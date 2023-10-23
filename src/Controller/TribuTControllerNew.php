<?php
namespace  App\Controller;

use App\Repository\HachageTribuTNameRepository;
use App\Service\Status;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use DateTime;

use Normalizer;

use App\Entity\User;


use App\Entity\Consumer;
use App\Entity\Supplier;
use App\Service\FilesUtils;
use App\Entity\PublicationG;

use App\Form\FileUplaodType;

use App\Service\MailService;

use App\Service\UserService;
use App\Service\StringTraitementService;
use App\Form\PublicationType;
use App\Service\TributGService;

use App\Service\Tribu_T_Service;

use App\Repository\UserRepository;

use App\Service\RequestingService;
use App\Service\NotificationService;
use App\Repository\BddRestoRepository;
use App\Repository\DepartementRepository;
use App\Service\AgendaService;
use App\Service\Tribu_T_ServiceNew;
use Doctrine\ORM\EntityManagerInterface;

use function PHPUnit\Framework\assertFalse;
use function PHPUnit\Framework\isNull;

use Symfony\Component\Filesystem\Filesystem;


use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\RouterInterface;

use Symfony\Component\HttpKernel\KernelInterface;
use Symfony\Component\Validator\Constraints\Uuid;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Serializer\Encoder\JsonDecode;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Symfony\Component\String\Slugger\SluggerInterface;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\HiddenType;

use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

class TribuTControllerNew extends AbstractController{
    private $form;

    private $entityManager;

    private $mailService;

    private $appKernel;
 
    private $requesting;

    private $filesyst;

    private $srvTribuT;

    function __construct(
        MailService $mailService, 

        EntityManagerInterface $entityManager, 

        KernelInterface $appKernel, 

        RequestingService $requesting,

        Filesystem $filesyst,
        Tribu_T_ServiceNew $srvTribuT
    )

    {

        $this->entityManager = $entityManager;

        $this->appKernel = $appKernel;

        $this->mailService = $mailService;

        $this->requesting = $requesting;

        $this->filesyst = $filesyst;

        $this->srvTribuT = $srvTribuT;

    }


    /**
     * @author Nantenaina
     * où: on Utilise cette fonction dans la rubrique création tribu T cmz, 
     * localisation du fichier: dans TribuTControllerNew.php,
     * je veux: créer une tribu T
     *
     */
    #[Route("/user/tribu/my-tribu-t/accueil", name: "app_my_tribu_t_new")]
    public function MyTribuT(
        Status $status,
        Request $request, 
        HachageTribuTNameRepository $hachageRepo,
    
    ){
        $user=$this->getUser();

        if(!$user) {
            return $this->redirectToRoute('app_account');
        }

        $userId = intval($user->getId());
        $userType = $user->getType();
        $userConnected= $status->userProfilService($this->getUser());
       
        //render form create tribu-T
        $form=$this->renderFormer(
           $request,
            $user,
            $userId,
            $userType,
            $hachageRepo,
            "app_my_tribu_t_new"
        );

        
        //get Profil partisant or partenaire
        if ($userType == "consumer") {

            $profil = $this->entityManager->getRepository(Consumer::class)->findByUserId($userId);
        } else {

            $profil = $this->entityManager->getRepository(Supplier::class)->findByUserId($userId);
        }


        $tribuTOwned = $this->srvTribuT->getAllTribuTOwnedInfos($user);
        
        $tribuTJoined = $this->srvTribuT->getAllTribuTJoinedInfos($user);

        //TODO get all publications of tribu T
        $publications= [];
        $allTribusT = array_merge($tribuTOwned, $tribuTJoined);
        if(count($allTribusT) > 0 ){
            $all_pub_tribuT= [];
            foreach($allTribusT as $tribuT){
                $temp_pub= $this->srvTribuT->getPubCommentAndReaction($tribuT['nom_table_trbT']);
                $all_pub_tribuT = array_merge($all_pub_tribuT, $temp_pub);
            }
            $publications= array_merge($publications, $all_pub_tribuT);
        }

        return $this->render('tribu_t/tribuT.html.twig',[
            "publications" => $publications,
            "userConnected" => $userConnected,
            "profil" => $profil,
            "tribu_T_owned" => $tribuTOwned,
            "tribu_T_joined" => $tribuTJoined,
            "kernels_dir" => $this->getParameter('kernel.project_dir'), 
            "form" => $form->createView()
        ]);
    }

    /**
     * @author Nantenaina
     * où: on Utilise cette fonction dans l'affichage d'une tribu T cmz, 
     * localisation du fichier: dans TribuTControllerNew.php,
     * je veux: afficher une tribu T
     *
     */
    #[Route('/user/tribu-t/{name_tribu_t}/accueil', name: 'show_one_tribu_infos')]
    public function showAccueilForOneTribuT($name_tribu_t,
    Tribu_T_ServiceNew $tribu_t_serv,
    SerializerInterface $serializer){
        $user = $this->getUser();
        $data=$tribu_t_serv->getApropos($name_tribu_t,$user);
        $jsonUsers = $serializer->serialize($data, 'json');
        return new JsonResponse($jsonUsers, Response::HTTP_OK, [], true);
    }


    /**
     * @author Nantenaina
     * où: on Utilise cette fonction pour l'affichage du contenu d'une tribu T cmz, 
     * localisation du fichier: dans TribuTControllerNew.php,
     * je veux: afficher le contenu d'une tribu T
    */
    #[Route('/user/tribu-t/contenu/{name_tribu_t}/{id}', name:'tribu_t_content')]
    public function showTribuTContents
    (
        $name_tribu_t,
        $id,
        Tribu_T_ServiceNew $tribu_t_serv,
        Status $status,
        Request $request,
        HachageTribuTNameRepository $hachageRepo,
    )
    {
        $user= $this->getUser();
        $userId = intval($user->getId());
        $userType = $user->getType();
        $userConnected= $status->userProfilService($this->getUser());
        $infos = $tribu_t_serv->getApropos($name_tribu_t,$user);
       //TODO get All data

       $userConnected= $status->userProfilService($user);

       $tribuTOwned = $this->srvTribuT->getAllTribuTOwnedInfos($user);
        
        $tribuTJoined = $this->srvTribuT->getAllTribuTJoinedInfos($user);
       
        //render form create tribu-T
        $form = $this->renderFormer(
            $request,
             $user,
             $userId,
             $userType,
             $hachageRepo,
             "app_my_tribu_t_new"
         );
         if ($userType == "consumer") {

            $profil = $this->entityManager->getRepository(Consumer::class)->findByUserId($userId);
        } else {

            $profil = $this->entityManager->getRepository(Supplier::class)->findByUserId($userId);
        }

       return $this->render('tribu_t/tribu_t_specific.html.twig',[
            "profil" => $profil,
            "tribu"=> $infos,
            "userConnected" => $userConnected,
            "form" => $form->createView(),
            "tribu_T_owned" => $tribuTOwned,
            "tribu_T_joined" => $tribuTJoined
       ]);
    }

    private function renderFormer(
        Request $request,
        $user,
        $userId,
        $userType,
        $hachageRepo,
        $routeName
    ){
        $defaultData = ['message' => 'reseigner le champ avec vos mots.'];
        $form = $this->createFormBuilder($defaultData)
                ->add('upload', FileType::class, [
                    'label' => false,
                    'required' => false 
                ])
                ->add('tribuTName', TextType::class, [
                    'label' => false 
                ])
                ->add('extensionData', HiddenType::class, [
                    'label' => false ,
                    'required' => false
                ])
                ->add('description', TextType::class, [
                    'label' => false ,
                    'required' => false
                ])
                // ->add('adresse', TextType::class, [
                //     'label' => false ,
                //     'required' => false
                // ])
                ->add('extension', CheckboxType::class, [
                    'label' => 'Restaurant',
                    'required' => false
                ])
                ->add('extension_golf', CheckboxType::class, [
                    'label' => 'Golf',
                    'required' => false
                ])
                ->getForm();
        
        $form->handleRequest($request);
        //TODO handle submit
        if ($form->isSubmitted() && $form->isValid()){
            $now = time();
            //key fera office de nom de la table de la tribuT créée
            $key='t'.$now.'u'.$userId;
            $data = $form->getData();
            $logoTribuT=null;
            $imgTribuTDir=null;
            $newImageName = null;
            $dataImg = $data["upload"];
            if($dataImg){
                $imgExtension = $dataImg->guessExtension();
                $newImageName = "img_".$now.".".$imgExtension;
                $path = '/uploads/tribu_t/photo/'.$key."/";
                $imgTribuTDir = $this->getParameter('kernel.project_dir')."/public".$path;
                if(!($this->filesyst->exists($imgTribuTDir)))
                        $this->filesyst->mkdir($imgTribuTDir,0777);
                        
                $logoTribuT = $path.$newImageName;

            }else{
                $logoTribuT="/uploads/tribu_t/photo/avatar_tribu.jpg";
            }
          
            $nomTribuT=json_encode($data["tribuTName"]);

            $extensionRestaurent=$data["extension"];

            $extensionGolf=$data["extension_golf"];

            $description=json_encode($data["description"]);
            
            //TODO insert one row in tribu T Owned table
            $lastIdTribuTCreated=$this->srvTribuT->addTribuTOwned($user,$nomTribuT,$description,
            $logoTribuT, $key,$extensionRestaurent,$extensionGolf);

            //TODO set into table hashing
             $this->srvTribuT->createHachage($hachageRepo,$key,$lastIdTribuTCreated, $userId );

            //TODO create table tribu t
            $this->srvTribuT->generateTribuTTables($key,$userId);

            //TODO check if extensions are activated
            if ($extensionRestaurent) {
                $this->srvTribuT->createExtensionDynamicTable($key, "restaurant");
            }

            if ($extensionGolf) {
                $this->srvTribuT->createExtensionDynamicTable($key, "golf");
            }

            // $srvTribuT->addTribuTJoined($user, $userId, $key);
            //TODO SAVE image
            if($imgTribuTDir)
                $dataImg->move($imgTribuTDir, $newImageName);
            
            $message = "Tribu " . $nomTribuT . " créée avec succes.";   
            return $this->redirectToRoute($routeName ,["message" => $message]);
        }
        return $form;
    }

    //TO DO route for this   $temp_pub= $this->srvTribuT->getPubCommentAndReaction($tribuT['nom_table_trbT']);
    /**
     * @author Nantenaina
     * où: on Utilise cette fonction pour l'affichage de publications d'une tribu T cmz, 
     * localisation du fichier: dans TribuTControllerNew.php,
     * je veux: afficher les publications d'une tribu T
    */
    #[Route('/user/get/{tableTribuT}/{tribuTId}/publications/', name:'tribu_t_specific_publication',methods:["GET"])]
    public function getPubsCommentsReactions
    (
        $tableTribuT,
        $tribuTId,
        Request $request,
    )
    {
        $idMin=$request->query->get('idmin');
        $limits=$request->query->get('limits');
        $data = $this->srvTribuT->getPublicationSpecificTribuT($tableTribuT,$idMin,$limits);
        return $this->json($data);
    }

    #[Route("/user/create-one/publication", name:"user_create_publication")]
    public function createOnePublication(
        Request $request       
    ){
        $user=$this->getUser();
        $userId= $user->getId();
        $jsonParsed=json_decode($request->getContent(),true);
        $tribu_t_name =  $jsonParsed["tribu_t_name"];
        $publication= json_encode($jsonParsed["contenu"]);
        $confid=$jsonParsed["confidentialite"];
        $image= $jsonParsed["base64"];
        $extImg = explode("/",$jsonParsed["photoType"]);
        $imageName = "img_".time()."_u_".$userId.".".$extImg[1];
        $path = '/public/uploads/tribu_t/photo/' .  $tribu_t_name . "_publication" . "/";
        if (!($this->filesyst->exists($this->getParameter('kernel.project_dir') . $path)))
                $this->filesyst->mkdir($this->getParameter('kernel.project_dir') . $path, 0777);
        $fileUtils=new FilesUtils();
        if (intval($jsonParsed["photoSize"], 10) > 0) {
            $fileUtils->uploadImageAjax($this->getParameter('kernel.project_dir').$path, $image, $imageName);
            $result =  $this->srvTribuT->createOnePub($tribu_t_name . "_publication", $userId, $publication, $confid, $path . $imageName);
        }else{
            $result =  $this->srvTribuT->createOnePub($tribu_t_name . "_publication", $userId, $publication, $confid,"");
        }
        

        $response = new Response();
        if($result){
            $response->setStatusCode(200);
            return $response;
        }else{
            $response->setStatusCode(500);
            return $response;
        }

    }

    #[Route("/user/tribu_t/pastille/resto", name:"tribu_t_pastille_resto", methods:["POST"])]
    public function pastilleRestoForTribuT(AgendaService $agendaService, Request $resquest){

        $jsonParsed=json_decode($resquest->getContent(),true);

        $resto_name =  $jsonParsed["name"];

        $resto_id = $jsonParsed["id"];

        $tribu_t = $jsonParsed["tbl"];

        $checkIdResto = $this->srvTribuT->getIdRestoOnTableExtension($tribu_t."_restaurant", $resto_id);

        if(count($checkIdResto) > 0){
            $this->srvTribuT->depastilleOrPastilleRestaurant($tribu_t."_restaurant", $resto_id, true);
        }else{
            $agendaService->saveRestaurant($tribu_t."_restaurant", $resto_name, $resto_id);
        }
        
        return $this->json(["id_resto"=>$resto_id, "table"=>$tribu_t."_restaurant"]);
    }

    #[Route("/user/tribu_t/depastille/resto", name:"tribu_t_depastille_resto", methods:["POST"])]
    public function dePastilleRestoForTribuT(AgendaService $agendaService, Request $resquest, Tribu_T_Service $tribu_T_Service){

        $jsonParsed=json_decode($resquest->getContent(),true);

        $resto_name =  $jsonParsed["name"];

        $resto_id = $jsonParsed["id"];

        $tribu_t = $jsonParsed["tbl"];

        $checkIdResto = $this->srvTribuT->getIdRestoOnTableExtension($tribu_t."_restaurant", $resto_id);

        if($checkIdResto > 0){
            $this->srvTribuT->depastilleOrPastilleRestaurant($tribu_t."_restaurant", $resto_id, false);
        }

        // $message = "Le restaurant " . $resto_name . " a été dépastillé avec succès !";
        
        return $this->json(["id_resto"=>$resto_id, "table"=>$tribu_t."_restaurant"]);
    }

    #[Route("/user/tribu_t/pastille/golf", name:"tribu_t_pastille_golf", methods:["POST"])]
    public function pastilleGolfForTribuT(AgendaService $agendaService, Request $resquest, Tribu_T_Service $tribu_T_Service){

        $jsonParsed=json_decode($resquest->getContent(),true);

        $golf_name =  $jsonParsed["name"];

        $golf_id = $jsonParsed["id"];

        $tribu_t = $jsonParsed["tbl"];

        $checkIdResto = $this->srvTribuT->getIdRestoOnTableExtension($tribu_t."_golf", $golf_id);

        if(count($checkIdResto) > 0){
            $this->srvTribuT->depastilleOrPastilleRestaurant($tribu_t."_golf", $golf_id, true);
        }else{
            $agendaService->saveRestaurant($tribu_t."_golf", $golf_name, $golf_id);
        }
        
        return $this->json(["id_golf"=>$golf_id, "table"=>$tribu_t."_golf"]);
    }

    #[Route("/user/tribu_t/depastille/golf", name:"tribu_t_depastille_golf", methods:["POST"])]
    public function dePastilleGolfForTribuT(AgendaService $agendaService, Request $resquest, Tribu_T_Service $tribu_T_Service){

        $jsonParsed=json_decode($resquest->getContent(),true);

        $resto_name =  $jsonParsed["name"];

        $golf_id = $jsonParsed["id"];

        $tribu_t = $jsonParsed["tbl"];

        $checkIdGolf = $this->srvTribuT->getIdRestoOnTableExtension($tribu_t."_golf", $golf_id);

        if($checkIdGolf > 0){
            $this->srvTribuT->depastilleOrPastilleRestaurant($tribu_t."_golf", $golf_id, false);
        }
        
        return $this->json(["id_golf"=>$golf_id, "table"=>$tribu_t."_golf"]);
    }

    #[Route('/user/tribu/restos-pastilles/{table_resto}', name: 'show_restos_pastilles')]

    public function getRestoPastilles(
        $table_resto,
        SerializerInterface $serialize,
        Tribu_T_ServiceNew $tribu_t_serv): Response

    {

        $tableComment=$table_resto."_commentaire";
      

        $has_restaurant = $tribu_t_serv->hasTableResto($table_resto);
        
        $restos = array();

        if($has_restaurant == true){
            $restos =$tribu_t_serv->getRestoPastilles($table_resto, $tableComment);
			$restos=mb_convert_encoding($restos, 'UTF-8', 'UTF-8');
        }
		
		$r=$serialize->serialize($restos,'json');
		
		return new JsonResponse($r, Response::HTTP_OK, [], true);

    }

    #[Route("/push/comment/resto/pastilled",name:"push_comment_pastilled_resto",methods:["POST"])]
    public function push_comment_pastilled_resto(Request $request){

        $user = $this->getUser();
        $json=json_decode($request->getContent(),true);
        $tableName=$json["tableName"];
        $idResto=$json["idResto"];
        $idUser=$user->getId();
        // $idUser=$json["idUser"];
        $note = $json["note"];
        $commentaire = $json["commentaire"];
        $result= $this->srvTribuT->sendCommentRestoPastilled($tableName, $idResto, $idUser, $note, $commentaire);
        if($result){
            $response = new Response();
            $response->setStatusCode(200);
            return $response;
        }else{
            $response = new Response();
            $response->setStatusCode(500);
            return $response;
        }
    }

    #[Route('/user/comment/tribu/restos-pastilles/{table_resto}/{id}', name: 'show_restos_pastilles_commentaire')]

    public function getRestoPastillesCommentaire($table_resto,$id): Response

    {

        $tableComment = $table_resto . "_commentaire";

        $has_restaurant = $this->srvTribuT->hasTableResto($table_resto);

        $restos = array();

        if ($has_restaurant == true) {
            
            $restos = $this->srvTribuT->getAllAvisByRestName($tableComment,$id);
        }
        return $this->json($restos);
    }

    #[Route("/user/tribu/update-tribu_t-info", name: "update_my_tribu_t")]
    public function updateTribuTInfos
    ( 
    Request $request,
    UserRepository $userRepository
    ){
        $user = $this->getUser();

        $userId = $user->getId();

        $jsonParsed=json_decode($request->getContent(),true);

        extract($jsonParsed);

        $path = '/public/uploads/tribu_t/photo/' .  strtolower($tableTribuT) . "/";
        $pathToBase='/uploads/tribu_t/photo/' .  strtolower($tableTribuT) . "/";
        $imgURL = null;
        if($photoName != ""){
            if (!($this->filesyst->exists($this->getParameter('kernel.project_dir') . $path)))
                $this->filesyst->mkdir($this->getParameter('kernel.project_dir') . $path, 0777);
    
            $fileUtils = new FilesUtils();
    
            $fileUtils->uploadImageAjax($this->getParameter('kernel.project_dir') . $path, $base64, time().$photoName);

            $imgURL = $pathToBase.time().$photoName;
        }

        $ext_restaurant = ($restaurant == "on") ? 1 : 0;

        $ext_golf = ($golf == "on") ? 1 : 0;

        $logo_path_old = $this->srvTribuT->getApropos($tableTribuT)["logo_path"];

        $logo_path = $imgURL ? $imgURL : $logo_path_old;

        $this->srvTribuT->updateTribuTInfos($tableTribuT, json_encode($nomTribuT), json_encode($description), $logo_path, $ext_restaurant, $ext_golf);

        if ($restaurant == "on") {
            $this->srvTribuT->createExtensionDynamicTable($tableTribuT, "restaurant");
        }

        if ($golf == "on") {
            $this->srvTribuT->createExtensionDynamicTable($tableTribuT, "golf");
        }

        return $this->json("Information modifié avec succès");

    }

}
