<?php
namespace  App\Controller;

use DateTime;
use Normalizer;
use App\Entity\User;
use App\Service\Status;
use App\Entity\Consumer;
use App\Entity\Supplier;

use App\Service\FilesUtils;

use App\Entity\PublicationG;


use App\Form\FileUplaodType;
use App\Service\MailService;
use App\Service\UserService;
use App\Form\PublicationType;

use App\Service\AgendaService;

use App\Service\TributGService;

use App\Service\Tribu_T_Service;
use App\Repository\UserRepository;
use App\Service\RequestingService;
use App\Service\SortResultService;

use App\Service\Tribu_T_ServiceNew;

use App\Service\NotificationService;

use App\Service\PDOConnexionService;
use App\Repository\BddRestoRepository;
use function PHPUnit\Framework\isNull;
use App\Service\StringTraitementService;
use Doctrine\ORM\EntityManagerInterface;
use App\Repository\DepartementRepository;
use function PHPUnit\Framework\assertFalse;
use Symfony\Component\Filesystem\Filesystem;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

use Symfony\Component\Routing\RouterInterface;


use App\Repository\HachageTribuTNameRepository;
use Symfony\Component\Routing\Annotation\Route;

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
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

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
        SortResultService $sortResultService,
    ){
        $user=$this->getUser();

        if(!$user) {
            return $this->redirectToRoute('app_account');
        }

        $userId = intval($user->getId());
        $userType = $user->getType();
        $userConnected= $status->userProfilService($this->getUser());
       
        //render form create tribu-T
        $objet=$this->renderFormer(
           $request,
            $user,
            $userId,
            $userType,
            $hachageRepo,
            "app_my_tribu_t_new"
        );

        if($objet["afakaRedirect"]){
            return $this->redirectToRoute("tribu_t_content",
            [
                "name_tribu_t" => $objet["name_tribu_t"],
                "id" => $objet["id"],
                "message" => $objet["message"]
            ]

            ); 
        }
        
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

        //// SORTED PUBLICATION BY DATE CREATED AT TIME OF UPDATE
        $publications= (count($publications) > 0 ) ? $sortResultService->sortTapByKey($publications, "publication", "createdAt") : $publications;

        return $this->render('tribu_t/tribuT.html.twig',[
            "publications" => $publications,
            "userConnected" => $userConnected,
            "profil" => $profil,
            "tribu_T_owned" => $tribuTOwned,
            "tribu_T_joined" => $tribuTJoined,
            "kernels_dir" => $this->getParameter('kernel.project_dir'), 
            "form" => $objet["form"]->createView()
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
        $objet = $this->renderFormer(
            $request,
             $user,
             $userId,
             $userType,
             $hachageRepo,
             "app_my_tribu_t_new"
         );

        if($objet["afakaRedirect"]){
            return $this->redirectToRoute("tribu_t_content" ,
            [
                "name_tribu_t" => $objet["name_tribu_t"],
                "id" => $objet["id"],
                "message" => $objet["message"],
            ]
        ); 
        }

         if ($userType == "consumer") {

            $profil = $this->entityManager->getRepository(Consumer::class)->findByUserId($userId);
        } else {

            $profil = $this->entityManager->getRepository(Supplier::class)->findByUserId($userId);
        }
        
       return $this->render('tribu_t/tribu_t_specific.html.twig',[
            "profil" => $profil,
            "tribu"=> $infos,
            "userConnected" => $userConnected,
            "form" => $objet["form"]->createView(),
            "tribu_T_owned" => $tribuTOwned,
            "tribu_T_joined" => $tribuTJoined,
            "canActiveTribu" => true
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
        
        $isRedirect = false;
        $message = "";
        $form->handleRequest($request);
        $lastIdTribuTCreated = null;
        $key="";
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
            
            $message = "Tribu " . $data["tribuTName"] . " créée avec succes.";   
            $isRedirect = true;
        }

        $objet = [];
        $objet["form"] = $form;
        $objet["afakaRedirect"] = $isRedirect;
        $objet["message"] = $message;
        $objet["id"] = $lastIdTribuTCreated;
        $objet["name_tribu_t"] = $key;
        return $objet;
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
        
        return $this->json(["id_resto"=>$resto_id, "table"=>$tribu_t."_restaurant", "is_fondateur"=>true]);

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


    /**
     * @author Nantenaina
     * où: on Utilise cette fonction pour l'affichage des infos d'une tribu T, 
     * localisation du fichier: dans TribuTControllerNew.php,
     * je veux: afficher les infos d'une tribu T
    */
    #[Route("/user/{tribu}/show/tribu_t-info", name: "show_my_tribu_t_info")]
    public function showTribuTInfos
    ( 
        $tribu
    ){
        return $this->json($this->srvTribuT->getApropos($tribu));
    }

    #[Route('/user/tribu/golfs-pastilles/{table_tribu}', name: 'show_golfs_pastilles')]

    public function getGolfPastilles($table_tribu,SerializerInterface $serialize): Response

    {
        $table_golf = $table_tribu."_golf";

        $tableComment=$table_golf."_commentaire";

        $has_golf = $this->srvTribuT->hasTableResto($table_golf);
       
        $golfs = array();
       
        if($has_golf == true){
            $golfs = $this->srvTribuT->getGolfPastilles($table_golf, $tableComment);
            
            /* The mb_convert_encoding() function is an inbuilt function in PHP that transforms the string into another character encoding. */
			// $golfs=mb_convert_encoding($golfs, 'UTF-8', 'UTF-8');
        }
		$r=$serialize->serialize($golfs,'json');
		
		return new JsonResponse($r, Response::HTTP_OK, [], true);

    }

    #[Route("/user/tribu/email/invitation" , name:"app_send_invitation_email" )]
    public function sendInvitationPerEmail(
        Request $request,
        UserRepository $userRepository,
        MailService $mailService,
        UserService $userService,
        RouterInterface $router,
        NotificationService $notification
    )
    {
        if(!$this->getUser()){
            return $this->json(["result" => "error"] , 401);
        }

        $userId = $this->getUser()->getId();

        //$userEmail = $this->getUser()->getEmail();

        $data = json_decode($request->getContent(), true);

        extract($data); ///$table, $principal, $cc ,$object, $description

        $from_fullname = $userService->getUserFirstName($userId) . " " . $userService->getUserLastName($userId);

        $nomTribuT =  $this->srvTribuT->getApropos($table);

        $nomTribuT = $nomTribuT["name_tribu_t_muable"];

        $contentForDestinator = $from_fullname . " vous a envoyé une invitation de rejoindre la tribu " . $nomTribuT;
        
        $type = "invitation";

        $invitLink = "<a href=\"/user/invitation\" style=\"display:block;padding-left:5px;\" class=\"btn btn-primary btn-sm w-50 mx-auto\">Voir l'invitation</a>";
    
        
         
        if($userRepository->findOneBy(["email" => $principal])){

            /** URL FOR MEMBER
             * EDITED By Nantenaina
            */

            $url = $router->generate('app_confirm_invitation_tribu', ['email' => $principal,'tribu' => $table, 'signature' => "%2BqdqU93wfkSf5w%2F1sni7ISdnS12WgNAZDyWZ0kjzREg%3D&token=3c9NYQN05XAdV%2Fbc8xcM5eRQOmvi%2BiiSS3v7KDSKvdI%3D"], UrlGeneratorInterface::ABSOLUTE_URL);
            // $url = $router->generate('app_login', ['email' => $principal], UrlGeneratorInterface::ABSOLUTE_URL);

            // $mailService->sendEmail(
            //     $principal,
            //     "Amis",
            //     $object,
            //     // "Je vous invite de rejoindre ma tribu T. J'espère que vous ne regrettez rien. La seule chose que vous devez faire est de s'inscrire, cliquez sur le lien ci-dessous." . $url
            //     $description . "\nVeuillez visiter le site en cliquant sur le lien ci-dessous.\n" . $url
            // );

            $context["object_mail"] = $object;
            $context["template_path"] = "emails/mail_invitation_agenda.html.twig";
            $context["link_confirm"] = $url ;
            $context["content_mail"] = $description . "<br>Veuillez visiter le site en cliquant sur le lien ci-dessous.<br> <a href='" . $url ."'>Cliquez ici pour accepter l'invitation.</a><br><br>Cordialement.<br><br>ConsoMyZone";

            $mailService->sendLinkOnEmailAboutAgendaSharing($principal, $from_fullname, $context);

            $id_receiver = $userRepository->findOneBy(["email" => $principal])->getId();

            $isMembre = $this->srvTribuT->testSiMembre($table, $id_receiver);

            if ($isMembre == "not_invited") {
                $contentForSender = "Vous avez envoyé une invitation à " .$this->srvTribuT->getFullName($id_receiver). " de rejoindre la tribu ". $nomTribuT;
                $this->srvTribuT->addMember($table, $id_receiver);
                $notification->sendNotificationForTribuGmemberOrOneUser($userId, $id_receiver, $type, $contentForDestinator . $invitLink, $table);
                $this->requesting->setRequestingTribut("tablerequesting_".$id_receiver, $userId, $id_receiver, "invitation", $contentForDestinator, $table);
                $this->requesting->setRequestingTribut("tablerequesting_".$userId, $userId, $id_receiver, "demande", $contentForSender, $table );
            }

        }else{
            //// prepare email which we wish send
            $url = $router->generate('app_email_link_inscription', ['email' => $principal , 'tribu' => $table, 'signature' => "%2BqdqU93wfkSf5w%2F1sni7ISdnS12WgNAZDyWZ0kjzREg%3D&token=3c9NYQN05XAdV%2Fbc8xcM5eRQOmvi%2BiiSS3v7KDSKvdI%3D"], UrlGeneratorInterface::ABSOLUTE_URL);
            $this->srvTribuT->addMemberTemp($table, $principal);
            // sendEmail($from,$fullName_from,$to,$fullName_to,$objet,$message)app_login
            // $mailService->sendEmail(
            //     $principal,
            //     "Amis",
            //     $object,
            //     // "Je vous invite de rejoindre ma tribu T. J'espère que vous ne regrettez rien. La seule chose que vous devez faire est de s'inscrire, cliquez sur le lien ci-dessous." . $url
            //     $description . "\nSi vous souhaitez de nous rejoindre, cliquez sur le lien ci-dessous.\n" . $url
            // );

            $context["object_mail"] = $object;
            $context["template_path"] = "emails/mail_invitation_agenda.html.twig";
            $context["link_confirm"] = $url ;
            $context["content_mail"] = $description . "<br>Si vous souhaitez de nous rejoindre, cliquez sur le lien ci-dessous.<br> <a href='" . $url ."'>Cliquez ici pour nous joindre.</a><br><br>Cordialement.<br><br>ConsoMyZone";

            $mailService->sendLinkOnEmailAboutAgendaSharing($principal, $from_fullname, $context);
        }

        if( count($cc) > 0 ){

            foreach($cc as $c){

                if($userRepository->findOneBy(["email" => $c])){

                    /** URL FOR MEMBER
                     * EDITED By Nantenaina
                    */
                    $url = $router->generate('app_login', ['email' => $c], UrlGeneratorInterface::ABSOLUTE_URL);
        
                    // $mailService->sendEmail(
                    //     $c,
                    //     "Amis",
                    //     $object,
                    //     // "Je vous invite de rejoindre ma tribu T. J'espère que vous ne regrettez rien. La seule chose que vous devez faire est de s'inscrire, cliquez sur le lien ci-dessous." . $url
                    //     $description . "\nVeuillez visiter le site en cliquant sur le lien ci-dessous.\n" . $url
                    // );

                    $context["object_mail"] = $object;
                    $context["template_path"] = "emails/mail_invitation_agenda.html.twig";
                    $context["link_confirm"] = $url ;
                    $context["content_mail"] = $description . "<br>Veuillez visiter le site en cliquant sur le lien ci-dessous.<br> <a href='" . $url ."'>Cliquez ici pour accepter l'invitation.</a><br><br>Cordialement.<br><br>ConsoMyZone";

                    $mailService->sendLinkOnEmailAboutAgendaSharing($c, $from_fullname, $context);
        
                    $id_receiver = $userRepository->findOneBy(["email" => $c])->getId();
        
                    $isMembre = $this->srvTribuT->testSiMembre($table, $id_receiver);
        
                    if ($isMembre == "not_invited") {
                        $contentForSender = "Vous avez envoyé une invitation à " .$this->srvTribuT->getFullName($id_receiver). " de rejoindre la tribu ". $table;
                        $this->srvTribuT->addMember($table, $id_receiver);
                        $notification->sendNotificationForTribuGmemberOrOneUser($userId, $id_receiver, $type, $contentForDestinator . $invitLink, $table);
                        $this->requesting->setRequestingTribut("tablerequesting_".$id_receiver, $userId, $id_receiver, "invitation", $contentForDestinator, $table);
                        $this->requesting->setRequestingTribut("tablerequesting_".$userId, $userId, $id_receiver, "demande", $contentForSender, $table );
                    }
        
                }else{
                    $this->srvTribuT->addMemberTemp($table, $c);

                    //// prepare email which we wish send
                    $url = $router->generate('app_email_link_inscription', ['email' => $c,'tribu' => $table, 'signature' => "%2BqdqU93wfkSf5w%2F1sni7ISdnS12WgNAZDyWZ0kjzREg%3D&token=3c9NYQN05XAdV%2Fbc8xcM5eRQOmvi%2BiiSS3v7KDSKvdI%3D"], UrlGeneratorInterface::ABSOLUTE_URL);
                    
                    // sendEmail($from,$fullName_from,$to,$fullName_to,$objet,$message)
                    // $mailService->sendEmail(
                    //     $c,
                    //     "Amis",
                    //     $object,
                    //     // "Je vous invite de rejoindre ma tribu T. J'espère que vous ne regrettez rien. La seule chose que vous devez faire est de s'inscrire, cliquez sur le lien ci-dessous." . $url
                    //     $description . "\nSi vous souhaitez de nous rejoindre, cliquez sur le lien ci-dessous." . $url
                    // );

                    $context["object_mail"] = $object;
                    $context["template_path"] = "emails/mail_invitation_agenda.html.twig";
                    $context["link_confirm"] = $url ;
                    $context["content_mail"] = $description . "<br>Si vous souhaitez de nous rejoindre, cliquez sur le lien ci-dessous.<br> <a href='" . $url ."'>Cliquez ici pour nous joindre.</a><br><br>Cordialement.<br><br>ConsoMyZone";

                    $mailService->sendLinkOnEmailAboutAgendaSharing($c, $from_fullname, $context);
                }

            }
        }

        return $this->json([
            "result" => "success"
        ], 201 );
    }

    /**
     * @author Elie <eliefenohasina@gmail.com>
     * Controlleur de MAJ l'historique de l'invitation dans la tribu T
     */
    #[Route("/tribu/invitation/confirm",name:"app_confirm_invitation_tribu",methods:["GET"])]
    public function confirmInvitation(Request $request){

        $table =$request->query->get("tribu");

        $email =$request->query->get("email");

        if($this->getUser()){

            if($table && $email){

                $user = $this->getUser();
                $userId = $user->getId();
                
                $userIdOwned = explode("u",$table)[1];
                $userIdOwned = intval($userIdOwned);
                
                $this->srvTribuT->addTribuTJoined($user,$userIdOwned,  $table);

                ///update status of the user in table tribu T
                $this->srvTribuT->updateMember($table, $userId, 1);

                $this->srvTribuT->updateInvitationStory($table . "_invitation", 1, $email);
    
            }

            $infos = $this->srvTribuT->getApropos($table);

            return $this->redirectToRoute("tribu_t_content",
                [
                    "name_tribu_t" => $infos["nom_table_trbT"],
                    "id" => $infos["id"]
                ]
            );

        }else{

            return $this->redirectToRoute('app_login');
            
        }
    }

    #[Route('/user/tribu/get_fondateur/{table_tribu}', name: 'app_get_fondateur_tribu')]

    public function getFondateur($table_tribu): Response {

        $tribu_t_serv = new Tribu_T_ServiceNew();

        $fondateur_id = $tribu_t_serv->getFondateur($table_tribu)['fondateur_id'];

        if($this->getUser()->getId() !=$fondateur_id){

            return $this->json(["is_fondateur"=>false]);

        }else{

            return $this->json(["is_fondateur"=>true]);

        }
    }

    #[Route("/golf/pastilled/checking/{id_golf}", name: "app_tribut_pastilled_golf", methods: ["GET"])]
    public function checkedIfRestaurantIsPastilled(
        $id_golf,
        UserRepository $userRepository,
        Tribu_T_ServiceNew $tribu_T_Service,
        SerializerInterface $serializerInterface
    ) {
        $arrayTribu = [];
        if ($this->getUser()) {

            $tribu_t_owned = $userRepository->getListTableTribuT_owned();
            $pdoService = new PDOConnexionService();
            foreach ($tribu_t_owned as $key) {
                $tableTribu = $key["nom_table_trbT"];
                $logo_path = $key["logo_path"];
                $name_tribu_t_muable =  array_key_exists("name_tribu_t_muable", $key) ? $key["name_tribu_t_muable"] : null;
                $tableExtension = $tableTribu . "_golf";

                if ($tribu_T_Service->checkExtension($tableTribu, "_golf") > 0) {
                    if (!$tribu_T_Service->checkIfCurrentGolfPastilled($tableExtension, $id_golf, true)) {
                        array_push($arrayTribu, ["table_name" => $tableTribu, "name_tribu_t_muable" => json_decode($pdoService->convertUnicodeToUtf8($name_tribu_t_muable),true), "logo_path" => $logo_path, "isPastilled" => false]);
                    } else {
                        array_push($arrayTribu, ["table_name" => $tableTribu, "name_tribu_t_muable" => json_decode($pdoService->convertUnicodeToUtf8($name_tribu_t_muable),true), "logo_path" => $logo_path, "isPastilled" => true]);
                    }
                }
            }
        }

        $datas = $serializerInterface->serialize($arrayTribu, 'json');
        return new JsonResponse($datas, 200, [], true);
    }

    #[Route('/user/tribu/set/pdp',name:'update_pdp_tribu_t')]
    public function update_pdp_tribu(Request $request){
        
        $user = $this->getUser();

        $userId = $user->getId();
        
        $jsonParsed = json_decode($request->getContent(), true);

        $tribu_t_name =  $jsonParsed["tribu_t_name"];

        $image =  $jsonParsed["base64"] ;
       
        $imageName = time().$jsonParsed["photoName"];
        
        $path = '/public/uploads/tribu_t/photo/' .  strtolower($tribu_t_name) . "/";
        if (!($this->filesyst->exists($this->getParameter('kernel.project_dir') . $path)))
            $this->filesyst->mkdir($this->getParameter('kernel.project_dir') . $path, 0777);
        
        $fileUtils = new FilesUtils();

        $fileUtils->uploadImageAjax($this->getParameter('kernel.project_dir') . $path, $image, $imageName);
        
        $response = new Response();

        try{

            $this->srvTribuT->updatePDPTribuT($tribu_t_name,'/uploads/tribu_t/photo/' .  strtolower($tribu_t_name) . "/".$imageName);

            $response->setStatusCode(200);

            return $response;

        }catch(\Exception $e){
            $response->setStatusCode(500);
            return $response;
        }

    }

}
