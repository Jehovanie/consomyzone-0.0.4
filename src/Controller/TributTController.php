<?php



namespace App\Controller;



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
use App\Service\NotificationService;
use App\Repository\BddRestoRepository;
use App\Repository\ConsumerRepository;
use App\Repository\SupplierRepository;
use App\Service\StringTraitementService;

use Doctrine\ORM\EntityManagerInterface;

use App\Repository\DepartementRepository;

use function PHPUnit\Framework\assertFalse;

use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\RouterInterface;
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

class TributTController extends AbstractController

{



    private $form;

    private $entityManager;

    private $mailService;

    private $appKernel;
 
    private $requesting;

    private $filesyst;

    function __construct(MailService $mailService, 

    EntityManagerInterface $entityManager, 

    KernelInterface $appKernel, 

    RequestingService $requesting,

    Filesystem $filesyst)

    {

        $this->entityManager = $entityManager;

        $this->appKernel = $appKernel;

        $this->mailService = $mailService;

        $this->requesting = $requesting;

        $this->filesyst = $filesyst;

    }

    #[Route('/createFile', name: 'create_file')]
    public function createFile(Request $request ){
       
        //$r=$request->request->all();
        $this->form->handleRequest($request);
        // $targetPath=  $this->getParameter('kernel.project_dir') . "/public/uploads/photos/";
        // $r=new FilesUtils($targetPath, $r["uploadBtn"], "uploadBtn");
        // $r->upload();
    }

    #[Route('/geto', name: 'create_tribuo')]
    public function getListTribuT(Tribu_T_Service $tributGService){
        $tributGService->setTribuT("akondro","ovy",null,null, 1, null);
        return $this->render('tribu_t/test.html.twig');
    }
    //#[Route('/user/tribu/create', name: 'create_tribu')]

    #[Route('/user/tribu/add-member', name: 'add_member_tribut')]

    public function addMember(TributGService $tributGService)

    {



        $user = $this->getUser();

        $userId = $user->getId();



        $userType = $user->getType();

        $profil = "";

        $flushMessage = null;

        $isSuccess = false;



        if (isset($_GET["tribu_name"]))

            $tribu = $_GET["tribu_name"];



        if ($userType == "consumer") {

            $profil = $this->entityManager->getRepository(Consumer::class)->findByUserId($userId);

        } else {

            $profil = $this->entityManager->getRepository(Supplier::class)->findByUserId($userId);

        }

        return $this->render('tribu_t/add-member.html.twig', [

            "message" => $flushMessage, "isSuccess" => $isSuccess, "profil" => $profil, "tribu" => $tribu,

            "statusTribut" => $tributGService->getStatusAndIfValid($profil[0]->getTributg(), $profil[0]->getIsVerifiedTributGAdmin(), $userId)

        ]);

    }

    #[Route("/user/partisan/tribu_T", name:'get_partisan_tribu_t')]
    public function getPartisanOfTribuT(Request $request, 
    Tribu_T_Service $serv,
    SerializerInterface $serializer){
        $tableTribuTName=$request->query->get("tbl_tribu_T_name");
        $v=$serv->getPartisanOfTribuT($tableTribuTName);

        $v_2 = [];

        foreach ($v as $k) {
            if($k['type'] != 'Type'){

                array_push($v_2,$k);
            }
        }
        $results = array_merge(["curent_user" => $this->getUser()->getId()], array($v_2));
        $json = $serializer->serialize($results, 'json');
        return new JsonResponse($json, Response::HTTP_OK, [], true);
    }


    #[Route('/user/get/comment/pub', name: "user_get_comment_pubss",methods:["GET"])]
    public function getCommentPubTribuT(Request $request,Tribu_T_Service $serv,SerializerInterface $serializer){

        $datas=$request->query->all();
       
        $tabl_cmnt_tribu_t=$datas["tbl_tribu_t_commentaire"];
        $idPub=$datas["id_pub"];
        $idMin=$datas["id_min"];
        $limits=$datas["limits"];
        $response=$serv->getCommentPubTribuT($tabl_cmnt_tribu_t, $idPub, $idMin,$limits);
        $json=$serializer->serialize($response,'json');
        
        return new JsonResponse($json, Response::HTTP_OK, [], true);
    }

    #[Route('/user/send/comment/pub', name:"user_send_comment_pub")]
    public function putCommentOnPublication(Request $request,Tribu_T_Service $serv){
        $datas=json_decode($request->getContent(),true);
        $user=$this->getUser();
        $userId=$user->getId();
        $pubId=$datas["pubId"];
        $commentaire=$datas["commentaire"];
        $tableCommentaireTribu_T=$datas["tbl_cmnt_name"];
       
        $result=$serv->putCommentOnPublication($tableCommentaireTribu_T, 
        $userId,$pubId,$commentaire, $user->getPseudo());

        
        if($result){
        $json=json_encode(array("userid"=>$userId,"pubId"=>$pubId, "commentaire"=>$commentaire,"pseudo"=> $user->getPseudo()));
           return new JsonResponse($json, Response::HTTP_OK, [], true);;
           
        }else{
            $response=new Response();
            return $response->setStatusCode(500);
        }
    }

    #[Route('/user/tribu/set/pdp',name:'update_pdp_tribu_t')]
    public function update_pdp_tribu(Request $request,Filesystem $filesyst, UserRepository $userRep, Tribu_T_Service $tribu_T_Service){
        
        $user = $this->getUser();
        $userId = $user->getId();
        $userTribu_T=json_decode($user->getTribuT(),true);
        
        $jsonParsed = json_decode($request->getContent(), true);
        $tribu_t_name =  $jsonParsed["tribu_t_name"];
        $image =  $jsonParsed["base64"] ;
       
        $imageName = $jsonParsed["photoName"];
        
        $path = '/public/uploads/tribu_t/photo/' .  strtolower($tribu_t_name) . "/";
        if (!($filesyst->exists($this->getParameter('kernel.project_dir') . $path)))
            $filesyst->mkdir($this->getParameter('kernel.project_dir') . $path, 0777);
        
        $fileUtils = new FilesUtils();
        $fileUtils->uploadImageAjax($this->getParameter('kernel.project_dir') . $path, $image, $imageName);

        foreach ($userTribu_T["tribu_t"] as $k =>$v) {
            if(is_array($v)){
                if (in_array($tribu_t_name, $v)) {
                    $v["logo_path"]=str_replace("/public","",$path.$imageName);
                    $userTribu_T["tribu_t"][$k]= $v;
                }
            }else{
                if($k== "logo_path"){
                    $v=str_replace("/public","",$path.$imageName);
                    $userTribu_T["tribu_t"][$k]= $v;
                }
            }
            
        }

        $membre = $tribu_T_Service->showMember($tribu_t_name);
        
        $response = new Response();

        try{
            foreach ($membre as $key) {
                if($key["roles"] == "Fondateur"){
                    $userRep->updatePdpTribu_T(json_encode($userTribu_T));
                }else{
                    $user = $userRep->findOneBy(["id"=>$key["user_id"]]);
                    $userTribu_T = json_decode($user->getTribuTJoined(),true);
                    foreach ($userTribu_T["tribu_t"] as $k =>$v) {
                        if(is_array($v)){
                            if (in_array($tribu_t_name, $v)) {
                                $v["logo_path"]=str_replace("/public","",$path.$imageName);
                                $userTribu_T["tribu_t"][$k]= $v;
                            }
                        }else{
                            if($k== "logo_path"){
                                $v=str_replace("/public","",$path.$imageName);
                                $userTribu_T["tribu_t"][$k]= $v;
                            }
                        }
                        
                    }
                    $userRep->updatePdpTribu_T_Joined(json_encode($userTribu_T), $user);
                }
            }

            $response->setStatusCode(200);

            return $response;
        }catch(\Exception $e){
            $response->setStatusCode(500);
            return $response;
        }
     
      
       
    }


    #[Route('/user/tribu/add_to/{tableName}/{user_id}/{notif_id}', name: 'add_personne')]

    public function acceptInvitation($user_id,

        $notif_id,

        $tableName,

        RequestingService $requestingService,
        NotificationService $notif_service
    ): Response

    {

        $tribut = new Tribu_T_Service();


        $tableNotif = "tablenotification_" . $user_id;



        // $notif_service->acceptNotification($tableNotif, $notif_id);



        $tribut->setTribuT($tableName, $user_id);

        //$tribut->setTribuT($output, $description, $path,$restoExtension, $user_id);



        $tribut->updateMember($tableName, $user_id, 1);



        $userPost = $notif_service->getUserPostIdForFeedBack($notif_id, $user_id);



        $tributName = $tribut->showRightTributName($userPost["tribu"])["name"];



        $userPostId = $userPost["user_post"];






        $userFullname = $tribut->getFullName($user_id);



        $content = $userFullname . " a accepté l'invitation de rejoindre la tribu " . str_replace("$", "'", $tributName);



        $type = "Invitation pour rejoindre la tribu " . str_replace("$", "'", $tributName);



        $notif_service->sendForwardNotificationForUser($user_id, $userPostId, $type, $content, 1);

        

        // ///set requesting

        // $balise =        

        // $requestingService->setIsAccepted("tablerequesting_". $user_id , );

        // $requestingService->setIsAccepted("tablerequesting_". $userPostId , );





        return $this->json("Invitation acceptée");

    }



    #[Route('/user/tribu/reject/{tableName}/{user_id}/{notif_id}', name: 'reject_invitation')]

    public function rejectInvitation($tableName, $user_id, $notif_id, NotificationService $notif_service): Response
    {
        $tableNotif = "tablenotification_" . $user_id;

        $notif_service->rejectNotification($tableNotif, $notif_id);

        $tribut = new Tribu_T_Service();



        $tribut->updateMember($tableName, $user_id, 2);



        $notif_service->getUserPostIdForFeedBack($notif_id, $user_id);



        $userPost = $notif_service->getUserPostIdForFeedBack($notif_id, $user_id);



        $tributName = $tribut->showRightTributName($userPost["invitation"])["name"];



        $userPostId = $userPost["user_post"];






        $userFullname = $tribut->getFullName($user_id);



        $content = $userFullname . " a refusé de rejoindre la tribu " . str_replace("$", "'", $tributName);



        $type = "Invitation pour rejoindre la tribu " . str_replace("$", "'", $tributName);



        $notif_service->sendForwardNotificationForUser($user_id, $userPostId, $type, $content, 2);



        return $this->json("Invitation rejetée");

    }



    #[Route('/user/tribu/list-by-user', name: 'list_tribut_by_user')]

    public function listTribuByUser(TributGService $tributGService)

    {

        $user = $this->getUser();



        $userId = $user->getId();



        $tribut = new Tribu_T_Service();



        $tribut_string = $tribut->fetchJsonDataTribuT($userId);



        $tribut_tableau = json_decode($tribut_string);



        $tributs = array();



        if($tribut_tableau != null){

            for ($i = 0; $i < count($tribut_tableau); $i++) {

                if ($tribut->showTableTribu($tribut_tableau[$i]) > 0) {

                    array_push($tributs, [$tribut->showRightTributName($tribut_tableau[$i]), "table" => $tribut_tableau[$i]]);

                }

            }

        }

        

        $userType = $user->getType();



        $profil = "";



        if ($userType == "consumer") {

            $profil = $this->entityManager->getRepository(Consumer::class)->findByUserId($userId);

        } else {

            $profil = $this->entityManager->getRepository(Supplier::class)->findByUserId($userId);

        }



        return $this->render('tribu_t/list.html.twig', [

            "profil" => $profil, "mytribus" => $tributs,

            "statusTribut" => $tributGService->getStatusAndIfValid($profil[0]->getTributg(), $profil[0]->getIsVerifiedTributGAdmin(), $userId)

        ]);

    }



    #[Route('/user/tribu/show-member/{table}', name: 'show_member_tribut')]

    public function showMember($table, TributGService $tributGService)

    {

        $user = $this->getUser();



        $userId = $user->getId();



        $tribut = new Tribu_T_Service();



        $users = $tribut->showMember($table);

        $tableau = array();



        $admin = false;



        foreach ($users as $key) {

            $type = $tribut->getTypeUser($key["user_id"]);

            $name = $tribut->getName($type, $key["user_id"]);

            $email = $tribut->getUserEmail($key["user_id"]);

            $role = $tribut->getRole($table, $key["user_id"]);

            if ($tribut->getRole($table, $userId) != "Membre")

                $admin = true;

            array_push($tableau, ['user_id' => $key["user_id"], 'user_full_name' => $name, 'email' => $email, 'role' => $role, 'admin' => $admin]);

        }



        $userType = $user->getType();



        $profil = "";



        if ($userType == "consumer") {

            $profil = $this->entityManager->getRepository(Consumer::class)->findByUserId($userId);

        } else {

            $profil = $this->entityManager->getRepository(Supplier::class)->findByUserId($userId);

        }



        return $this->render('tribu_t/membre.html.twig', [

            "profil" => $profil, "membre" => $tableau,

            "statusTribut" => $tributGService->getStatusAndIfValid($profil[0]->getTributg(), $profil[0]->getIsVerifiedTributGAdmin(), $userId)

        ]);

    }

    

    #[Route('/user/tribu/fetch-all-users/{table}/{query}', name: 'fetch_all_users')]

    public function fetchAll(string $query = "", $table): Response

    {

        $user = $this->getUser();



        $userId = $user->getId();



        $tribut = new Tribu_T_Service();



        $list = $tribut->showUserFullName($query, $userId);



        $users = array();



        for ($i = 0; $i < count($list); $i++) {

            array_push($users, ["user" => $list[$i], "isMember" => $tribut->testSiMembre($table, $list[$i]["user_id"])]);

        }



        return $this->json($users);

    }

    
    #[Route('/user/tribu_one/{name_tribu_t}', name: 'show_tribu_tribu_t')]
    public function showTribu_T_specifique($name_tribu_t,
    Tribu_T_Service $tribu_t_serv,
    SerializerInterface $serializer){

       $data=$tribu_t_serv->getTribuTInfo($name_tribu_t);
        $jsonUsers = $serializer->serialize($data, 'json');
        return new JsonResponse($jsonUsers, Response::HTTP_OK, [], true);
    }

    /**
     * 
     */
    #[Route('/user/tribu/publication/{table}', name: 'publication_tribu')]

    public function index($table, Request $request, TributGService $tributGService, NotificationService $notifService): Response

    {



        $user = $this->getUser();



        $user_id = $user->getId();



        $tribu_t = new Tribu_T_Service();



        $regex = "/\_publication+$/";



        $table_tribu = preg_replace($regex, "", $table);



        $avatar = $tribu_t->showAvatar($table_tribu, $user_id);

        

        $tribus = $tribu_t->showRightTributName($table_tribu);


        $rows = $tribu_t->fetchAllPub($table);



        $tribu = $request->query->get("tribu_name");



        $notif_id = $request->query->get("notif_id");


        $notifService->updateNotificationIsread($notif_id, $user_id);



        $userType = $user->getType();



        $profil = "";



        if ($userType == "consumer") {

            $profil = $this->entityManager->getRepository(Consumer::class)->findByUserId($user_id);

        } else {

            $profil = $this->entityManager->getRepository(Supplier::class)->findByUserId($user_id);

        }

        $data = ['legend' => null, 'confidentiality' => null, 'photo' => null];



        $formPub = $this->createForm(PublicationType::class, $data);



        $formPub->handleRequest($request);

        $table_reaction = preg_replace($regex, "_reaction", $table);

        $publications = array();

        $pubs = $tribu_t->fetchAllPub($table);

        $table_resto = $table_tribu.'_restaurant';

        $has_restaurant = $tribu_t->hasTableResto($table_resto);

        foreach ($pubs as $key) {

            array_push($publications, [

                "id" => $key["id"],

                "user_id" => $key["user_id"],

                "table_pub" => $table,

                "publication" => json_decode($key["publication"],true),

                "confidentiality" => $key["confidentiality"],

                "photo" => $key["photo"],

                "userfullname" => $key["userfullname"],

                "datetime" => $key["datetime"],
                "commentaire_number" => $tribu_t->getCommentaireNumber($table_tribu."_commentaire", $key["id"]),
                "reaction" => $tribu_t->getReaction($table_reaction, $user_id, $key["id"]),

                "reaction_number" => $tribu_t->getReactionNumber($table_reaction, $key["id"])

            ]);

        }

        if ($formPub->isSubmitted() && $formPub->isValid()) {

            $publication = $formPub['legend']->getData();

            $confid = $formPub['confidentiality']->getData();

            $photo = $formPub['photo']->getData();

            $newFilename = "";



            if ($photo) {

                $destination = $this->getParameter('kernel.project_dir') . '/public/uploads/tribu_t/photos/'.$table_tribu.'/';

                $dir_exist = $this->filesyst->exists($destination);

                if($dir_exist==false){
        
                    $this->filesyst->mkdir($destination, 0777);
        
                }

                $originalFilename = pathinfo($photo->getClientOriginalName(), PATHINFO_FILENAME);

                $newFilename = md5($originalFilename) . '-' . uniqid() . '.' . $photo->guessExtension();

                $photo->move(

                    $destination,

                    $newFilename

                );

            }



            $tribu_t->createOnePub($table, $user_id, $publication, $confid, $newFilename);

            return $this->redirectToRoute('publication_tribu', [

                "table" => $table
            ]);
            

        }

        return $this->render('tribu_t/monTribut.html.twig', [

            "profil" => $profil, 

            "tribu" => $tribus,
			
			"table_tribu" => $table_tribu,

            "avatar" => $avatar["avatar"],

            "roles" => $avatar["roles"],

            "table_pub" => $table, 
            "newPub" => $formPub->createView(),

            "publication" => $publications,
            "has_restaurant" => $has_restaurant,
            "statusTribut" => $tributGService->getStatusAndIfValid($profil[0]->getTributg(), $profil[0]->getIsVerifiedTributGAdmin(), $user_id)

        ]);

    }



    #[Route('/user/tribu/create/{tableName}', name: 'create_pub')]

    public function createPublication($tableName, Request $request): Response

    {

        $user = $this->getUser();



        $user_id = $user->getId();



        $tribut = new Tribu_T_Service();



        $requestContent = json_decode($request->getContent(), true);



        $publication = $requestContent["publication"];

        $confidentiality = $requestContent["confidentiality"];

        $photo = $requestContent['photo'];



        $newFilename = null;

        $regex = "/\_publication+$/";

        $table_tribu = preg_replace($regex, "", $tableName);



        if (isset($photo)) {

            $destination = $this->getParameter('kernel.project_dir') . '/public/uploads/tribu_t/photos/'.$table_tribu.'/';

            $dir_exist = $this->filesyst->exists($destination);

            if($dir_exist==false){
    
                $this->filesyst->mkdir($destination, 0777);
    
            }

            $originalFilename = pathinfo($photo->getClientOriginalName(), PATHINFO_FILENAME);

            $newFilename = md5($originalFilename) . '-' . uniqid() . '.' . $photo->guessExtension();

            $photo->move(

                $destination,

                $newFilename

            );

        }



        $tribut = new Tribu_T_Service();



        $tribut->createOnePub($tableName, $user_id, $publication, $confidentiality, $newFilename);



        return $this->json("Publication bien créée");

    }



    /**

     * @Route("user/tribu/new_commentaire" , name="tribu_new_comment", methods={"POST", "GET"})

     */

    public function saveComment(Request $request, NotificationService $notification)

    {



        $user = $this->getUser();



        $requestContent = json_decode($request->getContent(), true);



        $user_id = $user->getId();



        $pub_id = $requestContent["pub_id"];



        $user_id_pub = $requestContent["user_id_pub"];



        $table_com = $requestContent["table_com"];



        $new_comment = $requestContent["new_comment"];

        $audio = $requestContent["audio"];

        $audioname = "";

        $regex = "/\_commentaire+$/";

        $tribuTable = preg_replace($regex, "", $table_com);

        $path = $this->getParameter('kernel.project_dir') . '/public/uploads/tribu_t/audios/'.$tribuTable.'/';

        $dir_exist = $this->filesyst->exists($path);

        if($dir_exist==false){

            $this->filesyst->mkdir($path, 0777);

        }

        if ($audio != "") {

            $temp = explode(";", $audio );

            $extension = explode("/", $temp[0])[1];

            $audioname = uniqid() . "." . $extension;

            file_put_contents($path . $audioname, file_get_contents($audio));
        }


        $tribut = new Tribu_T_Service();


        $tribut->createComent($table_com, $user_id, $pub_id, $new_comment, $audioname);

        $type = "commentaire";

        $publicationUrl = "#pub_number_".$pub_id;

        $contentForDestinator = $tribut->getFullName($user_id) . " a commenté votre publication dans la tribu " . $tribut->showRightTributName($tribuTable)["name"];

        $contentForDestinator .= "<a style=\"display:block;padding-left:5px;\" class=\"btn btn-primary btn-sm w-50 mx-auto\" data-ancre=\"".$publicationUrl."\">Voir</a>";

        




        if($user_id != $user_id_pub){

            $notification->sendNotificationForTribuGmemberOrOneUser($user_id, $user_id_pub, $type, $contentForDestinator, $tribuTable);

        }



        return $this->json("Commentaire bien créée");

    }



    #[Route('/events/commentaires', name: 'comments_event')]

    public function fetchAllComments()

    {

        $response = new StreamedResponse();

        $response->setCallback(function () {

            $tribut = new Tribu_T_Service();

            $comments = null;

            if (isset($_GET['pub_id']) && isset($_GET['table'])) {

                $regex = "/\_publication+$/";


                $table_comm = preg_replace($regex, "_commentaire", $_GET['table']);


                $comments = $tribut->findAllComments($_GET['pub_id'], $table_comm);



                $table_react = preg_replace($regex, "_reaction", $_GET['table']);


                $reactions = $tribut->getReactionNumber($table_react, $_GET['pub_id']);


                $user = $this->getUser();

                $userId = $user->getId();

                $reactionStatus = $tribut->getReactionStatus($table_react, $_GET['pub_id'], $userId);

                $tableau = array();

                $now = new DateTime();
                
                array_push($tableau, ["reactionStatus" => $reactionStatus, "reaction" => $reactions, "comments" => $comments, "now_date" => $now->format('Y-m-d H:i:s')]);

                echo "data:" . json_encode($tableau) . "\n\n";


                flush();

            }

        });

        $response->headers->set('Cache-Control', 'no-cache');

        $response->headers->set('Content-Type', 'text/event-stream');

        return $response;

    }



    /**

     * @Route("user/tribu/new_reaction" , name="tribut_new_reaction", methods={"POST", "GET"})

     */

    public function saveReaction(Request $request, NotificationService $notification)

    {



        $user = $this->getUser();

        $requestContent = json_decode($request->getContent(), true);



        $pub_id = $requestContent["pub_id"];

        $user_id = $user->getId();

        $new_react = $requestContent["is_like"];

        $table_reaction = $requestContent["table_reaction"];

        $user_id_pub = $requestContent["user_id_pub"];

        $regex = "/\_reaction+$/";

        $tribuTable = preg_replace($regex, "", $table_reaction);

        $tribut = new Tribu_T_Service();

        $type = "reaction";

        $publicationUrl = "#pub_number_".$pub_id;



        $contentForDestinator = $tribut->getFullName($user_id) . " a réagi votre publication dans la tribu " . $tribut->showRightTributName($tribuTable)["name"];

        $contentForDestinator .= "<a style=\"display:block;padding-left:5px;\" class=\"btn btn-primary btn-sm w-50 mx-auto\" data-ancre=\"".$publicationUrl."\">Voir</a>";

        if($user_id != $user_id_pub){

            $notification->sendNotificationForTribuGmemberOrOneUser($user_id, $user_id_pub, $type, $contentForDestinator, $tribuTable);

        }



        return $this->json($tribut->setReaction($table_reaction, $user_id, $pub_id, $new_react));

    }



    /**

     * @Route("user/tribu/publication/remove/{table}/{id}" , name="tribut_remove_pub_or_comment", methods={"GET"})

     */

    public function removePubOrComment($table, $id)

    {



        $tribut = new Tribu_T_Service();



        $tribut->removePublicationOrCommentaire($table, $id);



        return $this->json("Bien supprimée !");

    }



    /**

     * @Route("user/tribu/update_publication/{table}" , name="tribu_update_publication", methods={"POST"})

     */

    public function updatePublication($table, Request $request, 
    Tribu_T_Service $tribuTService,
    Filesystem $filesyst)

    {

        $user = $this->getUser();

        $userId = $user->getId();

        $requestContent = json_decode($request->getContent(), true);

        $file = $requestContent["base64"];

        $oldSrc = $requestContent["oldSrc"];

        $pub_id = $requestContent["pub_id"];

        $confid = $requestContent["confidentiality"];

        $new_message = $requestContent["message"];

        $path = '/public/uploads/tribu_t/photo/' .  $table . "/";

        $imageName = "";

        if($file != null){

            $temp = explode(";", $file );

            $extension = explode("/", $temp[0])[1];

            $imageName = time(). '-' . uniqid() . "." . $extension;

            ///save image in public/uploader folder

            if (!($filesyst->exists($this->getParameter('kernel.project_dir') . $path)))
                $filesyst->mkdir($this->getParameter('kernel.project_dir') . $path, 0777);
            $projectDir = $this->getParameter('kernel.project_dir') . $path;
            file_put_contents($projectDir . $imageName, file_get_contents($file));

            $tribuTService->updatePublication($table, $pub_id, $new_message, $confid, $path . $imageName);

        }else{
            if($oldSrc != ""){
                $tribuTService->updatePublication($table, $pub_id, $new_message, $confid, $oldSrc);
            }else{
                $tribuTService->updatePublication($table, $pub_id, $new_message, $confid);
            }
            
        }

        return $this->json("Bien à jour !");

    }



    /**

     * @Route("user/tribu/update_comment/{table}" , name="tribu_update_comment", methods={"POST"})

     */

    public function updateComment($table, Request $request)

    {



        $user = $this->getUser();

        $requestContent = json_decode($request->getContent(), true);



        $comment_id = $requestContent["id"];



        $commentaire = $requestContent["commentaire"];



        $tribut = new Tribu_T_Service();



        $tribut->updateComment($table, $comment_id, $commentaire);



        return $this->json("Bien à jour !");

    }



    /**
     * @Route("user/tribu/send/invitation" , name="invitation_tribu_g")
     */
    public function sendInvitation(Request $request, NotificationService $notification, TributGService $tribu_g, Tribu_T_Service $tribu_t ): Response
    {
        $user = $this->getUser();
        $userId = $user->getId();
        
        $requestContent = json_decode($request->getContent(), true);
        $table = $requestContent["table"];

        $tribu_g_table = $tribu_g->getTribuGtableForNotif($userId);
        $members = $tribu_g->getAllTributG($tribu_g_table);


        $userFullname = $tribu_t->getFullName($userId);
        $tribu_name = $tribu_t->showRightTributName($table);

        $type = "invitation";

        // $invitLink = "<a href=\"/user/invitation\" style=\"display:block;padding-left:5px;\" class=\"btn btn-primary btn-sm w-50 mx-auto\">Voir l'invitation</a>";
        $invitLink = "";

        for ($i = 0; $i < count($members); $i++) {
            if ($userId != $members[$i]["user_id"]) {

                $isMembre = $tribu_t->testSiMembre($table, $members[$i]["user_id"]);

                if ($isMembre == "not_invited") {
                    
                    // $contentForDestinator = $userFullname . " vous a envoyé une invitation de rejoindre la tribu " . str_replace("$", "'", $tribu_name["name"]) . "<a style=\"display:block;padding-left:5px;\" class=\"btn btn-primary btn-sm w-50 mx-auto\">Voir l'invitation</a>";
                    $contentForDestinator = $userFullname . " vous a envoyé une invitation de rejoindre la tribu " . str_replace("$", "'", $tribu_name["name"]);

                    $contentForSender = "Vous avez envoyé une invitation à " .$tribu_t->getFullName($members[$i]["user_id"]). " de rejoindre la tribu ". str_replace("$", "'", $tribu_name["name"]);
                    $tribu_t->addMember($table, $members[$i]["user_id"]);
                    $notification->sendNotificationForTribuGmemberOrOneUser($userId, $members[$i]["user_id"], $type, $contentForDestinator . $invitLink, $table);
                    $this->requesting->setRequestingTribut("tablerequesting_".$members[$i]["user_id"], $userId, $members[$i]["user_id"], "invitation", $contentForDestinator, $table);
                    $this->requesting->setRequestingTribut("tablerequesting_".$userId, $userId, $members[$i]["user_id"], "demande", $contentForSender, $table);
                    /*$this->mailService->sendEmail(
                        "geoinfography@infostat.fr", /// mail where from
                        "ConsoMyZone",  //// name the senders
                        $tribu_t->getUserEmail($members[$i]["user_id"]), /// mail destionation
                        $tribu_t->getFullName($members[$i]["user_id"]), /// name destionation
                        "Invitation pour rejoindre la tribu " . str_replace("$", "'", $tribu_name["name"]), //// title of email
                        // "Pour accepter l'invitation. Clickez-ici : " . $this->generateUrl("show_invitation", array("tribu_name" => $table, "notif_id" => $notification->getNotificationId("tablenotification_".$members[$i]["user_id"], $table)), UrlGeneratorInterface::ABSOLUTE_URL)
                        "Pour accepter l'invitation. Clickez-ici : " . $this->generateUrl("app_invitation", array("tribu_name" => $table, "notif_id" => $notification->getNotificationId("tablenotification_".$members[$i]["user_id"], $table)), UrlGeneratorInterface::ABSOLUTE_URL)
                    );*/
                }
            }
        }

        return $this->json("Invitation envoyée à tous les membres");
    }



    /**
     * @Route("user/tribu/send/one-invitation" , name="invitation_partisan")
     */
    public function sendOneInvitation(Request $request, NotificationService $notification ): Response
    {
        $requestContent = json_decode($request->getContent(), true);

        $table = $requestContent["table"];
        
        $nomTribu = $requestContent["nom"];

        $id_receiver = $requestContent["user_id"];

        $user = $this->getUser();

        $userId = $user->getId();

        $tribu_t = new Tribu_T_Service();

        $userFullname = $tribu_t->getFullName($userId);

        //$tribu_name = $tribu_t->showRightTributName($table);

        // $contentForDestinator = $userFullname . " vous a envoyé une invitation de rejoindre la tribu " . str_replace("$", "'", $tribu_name["name"]) . "<a style=\"display:block;padding-left:5px;\" class=\"btn btn-primary btn-sm w-50 mx-auto\">Voir l'invitation</a>";
        // $contentForDestinator = " vous a envoyé une invitation de rejoindre la tribu " . $nomTribu;
        $contentForDestinator = "Vous avez reçu une invitation de rejoindre la tribu " . $nomTribu;

        
        $type = "invitation";

        $invitLink = "<a href=\"/user/invitation\" style=\"display:block;padding-left:5px;\" class=\"btn btn-primary btn-sm w-50 mx-auto\">Voir l'invitation</a>";

        $isMembre = $tribu_t->testSiMembre($table, $id_receiver);

        if ($isMembre == "not_invited") {
            $contentForSender = "Vous avez envoyé une invitation à " .$tribu_t->getFullName($id_receiver). " de rejoindre la tribu ". $nomTribu;
            $tribu_t->addMember($table, $id_receiver);
            $notification->sendNotificationForTribuGmemberOrOneUser($userId, $id_receiver, $type, $contentForDestinator . $invitLink, $table);
            $this->requesting->setRequestingTribut("tablerequesting_".$id_receiver, $userId, $id_receiver, "invitation", $contentForDestinator, $table);
            $this->requesting->setRequestingTribut("tablerequesting_".$userId, $userId, $id_receiver, "demande", $contentForSender, $table );
        }

        return $this->json("Invitation envoyee");
        
    }



    #[Route('/user/tribu/invitation', name: 'show_invitation')]

    public function showInvitation(Request $request, TributGService $tributGService, NotificationService $notifService)

    {

        $user = $this->getUser();



        $userId = $user->getId();



        $userType = $user->getType();



        $tribu = $request->query->get("tribu_name");



        $notif_id = $request->query->get("notif_id");






        $tribu_t = new Tribu_T_Service();



        $tribu_name = $tribu_t->showRightTributName($tribu);



        $isMember = $tribu_t->testSiMembre($tribu, $userId);


        $notifService->updateNotificationIsread($notif_id, $userId);

        $profil = "";
        if ($userType == "consumer") {

            $profil = $this->entityManager->getRepository(Consumer::class)->findByUserId($userId);

        } else {

            $profil = $this->entityManager->getRepository(Supplier::class)->findByUserId($userId);

        }

        return $this->render('tribu_t/invitation.html.twig', [

            "profil" => $profil,

            "statusTribut" => $tributGService->getStatusAndIfValid($profil[0]->getTributg(), $profil[0]->getIsVerifiedTributGAdmin(), $userId),

            "tribu_name" => str_replace("$", "'", $tribu_name["name"]),

            "tribu" => $tribu,

            "notif_id" => intval($notif_id),

            "isMember" => $isMember

        ]);

    }



    #[Route('/user/tribu/photos/{table}', name: 'show_all_photos')]
    public function showAllphotosTribut($table): Response
    {
        // $tribu_t = new Tribu_T_Service();
        // $photos = $tribu_t->showAllphotosTribut($table);
        // return $this->json($photos);
        $folder = $this->getParameter('kernel.project_dir') . "/public/uploads/tribu_t/photo/".$table."/";
        $images = glob($folder . '*.{jpg,JPG,jpeg,JPEG,png,PNG,gif,GIF}', GLOB_BRACE);

        $tabPhoto = [];
        foreach ($images as $image) {
            $photo = explode("uploads/tribu_t",$image)[1];
            $photo = "/public/uploads/tribu_t".$photo;
            array_push($tabPhoto, ["photo"=>$photo]);
        }
        return $this->json($tabPhoto);
    }

    #[Route('/user/tribu/restos-pastilles/{table_resto}', name: 'show_restos_pastilles')]

    public function getRestoPastilles($table_resto,SerializerInterface $serialize): Response

    {

        $tableComment=$table_resto."_commentaire";
        $tribu_t = new Tribu_T_Service();

        $has_restaurant = $tribu_t->hasTableResto($table_resto);
        
        $restos = array();

        if($has_restaurant == true){
            $restos = $tribu_t->getRestoPastilles($table_resto, $tableComment);
			$restos=mb_convert_encoding($restos, 'UTF-8', 'UTF-8');
        }
		
		$r=$serialize->serialize($restos,'json');
		
		return new JsonResponse($r, Response::HTTP_OK, [], true);

    }

    #[Route('/user/tribu/golfs-pastilles/{table_tribu}', name: 'show_golfs_pastilles')]

    public function getGolfPastilles($table_tribu,SerializerInterface $serialize): Response

    {
        $table_golf = $table_tribu."_golf";

        $tableComment=$table_golf."_commentaire";
        $tribu_t = new Tribu_T_Service();

        $has_golf = $tribu_t->hasTableResto($table_golf);
        
        $golfs = array();

        if($has_golf == true){
            $golfs = $tribu_t->getGolfPastilles($table_golf, $tableComment);
			$golfs=mb_convert_encoding($golfs, 'UTF-8', 'UTF-8');
        }
		
		$r=$serialize->serialize($golfs,'json');
		
		return new JsonResponse($r, Response::HTTP_OK, [], true);

    }


    #[Route('/user/comment/tribu/restos-pastilles/{table_resto}/{id}', name: 'show_restos_pastilles_commentaire')]

    public function getRestoPastillesCommentaire($table_resto,$id): Response

    {

        $tableComment = $table_resto . "_commentaire";
        $tribu_t = new Tribu_T_Service();

        $has_restaurant = $tribu_t->hasTableResto($table_resto);

        $restos = array();

        if ($has_restaurant == true) {
            
            $restos = $tribu_t->getAllAvisByRestName($tableComment,$id);
        }
        return $this->json($restos);
    }


    #[Route('/user/tribu/show/invitations/{table}', name: 'show_all_invitations')]

    public function showAllInvitations($table): Response

    {



        $tribu_t = new Tribu_T_Service();



        $invitations_obj = $tribu_t->showAllInvitations($table);



        $invitations = array();



        for ($i = 0; $i < count($invitations_obj); $i++) {

            array_push($invitations, [

                "status" => $invitations_obj[$i]["status"],

                "user_id" => $invitations_obj[$i]["user_id"],

                "fullname" => $tribu_t->getFullName($invitations_obj[$i]["user_id"])

            ]);

        }

        return $this->json($invitations);

    }



    #[Route('/user/tribu/update/avatar/{table}', name: 'update_avatar_tribu')]

    public function updateTribuAvatar($table, Request $request): Response

    {



        $data = json_decode($request->getContent(), true);



        extract($data);



        $path = $this->getParameter('kernel.project_dir') . '/public/uploads/tribu_t/photos/'.$table.'/';


        $dir_exist = $this->filesyst->exists($path);

        if($dir_exist==false){

            $this->filesyst->mkdir($path, 0777);

        }

        $tribu_t = new Tribu_T_Service();



        if($image != "" ){



                // Function to write image into file

                $temp = explode(";", $image );

                $extension = explode("/", $temp[0])[1];

                $imagename = md5($table). '-' . uniqid() . "." . $extension;



                ///save image in public/uploader folder

                file_put_contents($path . $imagename, file_get_contents($image));



                /// update database image

                $tribu_t->updateAvatar($table, $imagename);

            

        }

        return $this->json("Photo de profil bien à jour");

    }



    #[Route('/user/profil/update/avatar', name: 'update_avatar_user')]

    public function updateUserAvatar(Request $request): Response

    {



        $user = $this->getUser();



        $userId = $user->getId();



        $userType = $user->getType();



        $profil = null;



        $data = json_decode($request->getContent(), true);



        extract($data);



        $path = $this->getParameter('kernel.project_dir') . '/public/uploads/users/photos/photo_user_'.$userId."/";

        $dir_exist = $this->filesyst->exists($path);

        if($dir_exist==false){

            $this->filesyst->mkdir($path, 0777);

        }



        if($image != "" ){



                // Function to write image into file

                $temp = explode(";", $image );

                $extension = explode("/", $temp[0])[1];

                //$imagename = md5($userId). '-' . uniqid() . "." . $extension;
                $imagename = time() . "." . $extension;



                if ($userType == "consumer") {

                    $profil = $this->entityManager->getRepository(Consumer::class)->findByUserId($userId);

                } elseif ($userType == "supplier") {

                    $profil = $this->entityManager->getRepository(Supplier::class)->findByUserId($userId);

                }



                $profil[0]->setPhotoProfil($imagename);



                $this->entityManager->flush();



                ///save image in public/uploader folder

                file_put_contents($path . $imagename, file_get_contents($image));

            

        }



        return $this->json("Photo de profil bien à jour");



    }


    #[Route("/user/tribu/email/invitation" , name:"app_send_invitation_email" )]
    public function sendInvitationPerEmail(
        Request $request,
        UserRepository $userRepository,
        MailService $mailService,
        UserService $userService,
        RouterInterface $router,
        Tribu_T_Service $tribuTService,
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

        $contentForDestinator = $from_fullname . " vous a envoyé une invitation de rejoindre la tribu " . $table;
        
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

            $isMembre = $tribuTService->testSiMembre($table, $id_receiver);

            if ($isMembre == "not_invited") {
                $contentForSender = "Vous avez envoyé une invitation à " .$tribuTService->getFullName($id_receiver). " de rejoindre la tribu ". $table;
                $tribuTService->addMember($table, $id_receiver);
                $notification->sendNotificationForTribuGmemberOrOneUser($userId, $id_receiver, $type, $contentForDestinator . $invitLink, $table);
                $this->requesting->setRequestingTribut("tablerequesting_".$id_receiver, $userId, $id_receiver, "invitation", $contentForDestinator, $table);
                $this->requesting->setRequestingTribut("tablerequesting_".$userId, $userId, $id_receiver, "demande", $contentForSender, $table );
            }

        }else{
            //// prepare email which we wish send
            $url = $router->generate('app_email_link_inscription', ['email' => $principal , 'tribu' => $table, 'signature' => "%2BqdqU93wfkSf5w%2F1sni7ISdnS12WgNAZDyWZ0kjzREg%3D&token=3c9NYQN05XAdV%2Fbc8xcM5eRQOmvi%2BiiSS3v7KDSKvdI%3D"], UrlGeneratorInterface::ABSOLUTE_URL);
            $tribuTService->addMemberTemp($table, $principal);
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
        
                    $isMembre = $tribuTService->testSiMembre($table, $id_receiver);
        
                    if ($isMembre == "not_invited") {
                        $contentForSender = "Vous avez envoyé une invitation à " .$tribuTService->getFullName($id_receiver). " de rejoindre la tribu ". $table;
                        $tribuTService->addMember($table, $id_receiver);
                        $notification->sendNotificationForTribuGmemberOrOneUser($userId, $id_receiver, $type, $contentForDestinator . $invitLink, $table);
                        $this->requesting->setRequestingTribut("tablerequesting_".$id_receiver, $userId, $id_receiver, "invitation", $contentForDestinator, $table);
                        $this->requesting->setRequestingTribut("tablerequesting_".$userId, $userId, $id_receiver, "demande", $contentForSender, $table );
                    }
        
                }else{
                    $tribuTService->addMemberTemp($table, $c);

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

    #[Route("/push/comment/resto/pastilled",name:"push_comment_pastilled_resto",methods:["POST"])]
    public function push_comment_pastilled_resto(Request $request, Tribu_T_Service $tribuTService ){

        $user = $this->getUser();
        $json=json_decode($request->getContent(),true);
        $tableName=$json["tableName"];
        $idResto=$json["idResto"];
        $idUser=$user->getId();
        // $idUser=$json["idUser"];
        $note = $json["note"];
        $commentaire = $json["commentaire"];

        $result= $tribuTService->sendCommentRestoPastilled($tableName, $idResto, $idUser, $note, $commentaire);
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
    #[Route("/up/comment/resto/pastilled", name: "up_comment_pastilled_resto", methods: ["POST"])]
    public function up_comment_pastilled_resto(Request $request, Tribu_T_Service $tribuTService) : Response
    {
        $my_id = $this->getUser()->getId();
        $json = json_decode($request->getContent(), true);
        $tableName = $json["tableName"];

        $idRestoComment = strval($json["idRestoComment"]);

        // $idUser = $json["idUser"];
        $note = $json["note"];
        $commentaire = $json["commentaire"];
        
        $result = $tribuTService->upCommentRestoPastilled($tableName, $note, $commentaire,$idRestoComment, $my_id);
        if ($result) {
            $response = new Response();
            $response->setStatusCode(200);
            return $response;
        } else {
            $response = new Response();
            $response->setStatusCode(500);
            return $response;
        }

    }

    #[Route("/user/tribu/my-tribu-t", name: "app_my_tribu_t")]
    public function MyTribuT(
        Status $status,
        Request $request,  
        TributGService $tributGService,
        SluggerInterface $slugger,
        Filesystem $filesyst,
        UserRepository $userRepository,
        Tribu_T_Service $tribu_T_Service,
        StringTraitementService $stringTraitementService,
        BddRestoRepository $bddRestoRepository
    ) : Response
    {
        $userConnected= $status->userProfilService($this->getUser());

        $defaultData = ['message' => 'Type your message here'];
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
        //$form = $this->createFormB(FileUplaodType::class);
        $user=$this->getUser();
        $form->handleRequest($request);

        $body=null;
        if ($form->isSubmitted() && $form->isValid()) {
           
            $data = $form->getData();
            $tribuName= $data["tribuTName"];
            $tribuTNameFinal = $stringTraitementService->normalizedString($tribuName);
            $tribuTNameFinal = str_replace(" ","_", strtolower($tribuTNameFinal));
            $tribuTNameFinal = strlen($tribuTNameFinal) > 30 ? substr($tribuTNameFinal,0,30) : $tribuTNameFinal;
            
            $path = '/public/uploads/tribu_t/photo/tribu_t_'.$user->getId()."_".$tribuTNameFinal."/";
            if( !($filesyst->exists($this->getParameter('kernel.project_dir').$path)))
                    $filesyst->mkdir($this->getParameter('kernel.project_dir').$path,0777);

            $fileUtils= new FilesUtils($data['upload'], $this->getParameter('kernel.project_dir').$path);
            $filename =$fileUtils->upload($slugger);
            if(is_null($filename))
                $path=null;
            else
                $path= $path . $filename;
            
            //TODO create tribu-t

            $body=array(
                "path" => str_replace("/public","",$path),
                "tribu_t_name"=>$tribuName,
                "description"=>$data["description"],
                // "adresse"=>$data["adresse"], 
                "extension"=>$data["extension"],
                "extension_golf"=>$data["extension_golf"],
                "extensionData"=>$data["extensionData"]
            );
          
            $bool=$this->createTribu_T($body, $stringTraitementService, $status);
            if($bool){
                $message = "Tribu " . $data["tribuTName"] . " créée avec succes.";
            }else{
                $message = "Tribu " . $data["tribuTName"] . " existe déjà.";
            }
            
            
            return $this->redirectToRoute("app_my_tribu_t" ,["message" => $message]);
      
        }

        $user = $this->getUser();
       
        $userId = $user->getId();

        $profil = "";


        $userType = $user->getType();

        if ($userType == "consumer") {

            $profil = $this->entityManager->getRepository(Consumer::class)->findByUserId($userId);
        } else {

            $profil = $this->entityManager->getRepository(Supplier::class)->findByUserId($userId);
        }
        
        $tibu_T_data_owned=json_decode($user->getTribuT(),true);
        $tibu_T_data_joined=json_decode($user->getTribuTJoined(),true);

        $tribu_t_owned=!is_null($tibu_T_data_owned) ?  $tibu_T_data_owned : null;
        $tribu_t_joined=!is_null($tibu_T_data_joined) ?  $tibu_T_data_joined : null;

        /**
         * CONTAINER LIST PUBLICATION
         */

        //// ALL PUBLICATION FOR ALL TRIBU T /////
        $all_tribuT= $userRepository->getListTableTribuT(); /// tribu T owned and join
        // dd($all_tribuT);

        $publications= [];
        if(count($all_tribuT) > 0 ){
            $all_pub_tribuT= [];
            foreach($all_tribuT as $tribuT){
                $temp_pub= $tribu_T_Service->getAllPublicationsUpdate($tribuT['table_name']);
                $all_pub_tribuT = array_merge($all_pub_tribuT, $temp_pub);
            }
            $publications= array_merge($publications, $all_pub_tribuT);
        }

        /**
         * END LIST PUBLICATION
         */
        // dd($tribu_t_owned);
        return $this->render('tribu_t/tribuT.html.twig',[
            "publications" => $publications,
            "userConnected" => $userConnected,
            "profil" => $profil,
            "kernels_dir" => $this->getParameter('kernel.project_dir'), 
            "tribu_T_owned" => $tribu_t_owned,
            "tribu_T_joined" => $tribu_t_joined,
            "statusTribut" => $tributGService->getStatusAndIfValid($profil[0]->getTributg(), $profil[0]->getIsVerifiedTributGAdmin(), $userId),
            "form" => $form->createView(),
        ]);
 
        //end publication seding 
    }
    #[Route("/user/create-one/publication", name:"user_create_publication")]
    public function createOnePublication(
        Request $request, 
        Tribu_T_Service $tribuTService,
        Filesystem $filesyst
    ){
        $user=$this->getUser();
        $userId= $user->getId();
        $jsonParsed=json_decode($request->getContent(),true);
        $tribu_t_name =  $jsonParsed["tribu_t_name"];
        $publication= json_encode($jsonParsed["contenu"]);
        $confid=$jsonParsed["confidentialite"];
        $image= $jsonParsed["base64"];
        $imageName= time()."_".$jsonParsed["photoName"];
        $path = '/public/uploads/tribu_t/photo/' .  $tribu_t_name . "_publication" . "/";
        if (!($filesyst->exists($this->getParameter('kernel.project_dir') . $path)))
                $filesyst->mkdir($this->getParameter('kernel.project_dir') . $path, 0777);
        $fileUtils=new FilesUtils();
        if (intval($jsonParsed["photoSize"], 10) > 0) {
            $fileUtils->uploadImageAjax($this->getParameter('kernel.project_dir').$path, $image, $imageName);
            $result = $tribuTService->createOnePub($tribu_t_name . "_publication", $userId, $publication, $confid, $path . $imageName);
        }else{
            $result = $tribuTService->createOnePub($tribu_t_name . "_publication", $userId, $publication, $confid,"");
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

    #[Route("/user/publicalition/vals", name:"get_publicalition_tribu_t",methods:["GET"])]
    public function getPublicationList(Request $request,
    Tribu_T_Service $srv,
    SerializerInterface $serializer){

        
        $tableTribuTPublication=$request->query->get('tblpublication');
        $idMin=$request->query->get('idmin');
        $limits=$request->query->get('limits');
        $tableCommentaireTribuT=$request->query->get('tblCommentaire');
       
        $result=$srv->getPartisantPublication($tableTribuTPublication, $tableCommentaireTribuT ,$idMin, $limits);
        $json=$serializer->serialize($result,'json');
        return new JsonResponse($json, Response::HTTP_OK, [], true);
    }

    #[Route("/user/getRestoByName/{name}", name:"get_resto_b_name", methods:["GET"])]
    public function getRestoByName($name,
    BddRestoRepository $bddResto,SerializerInterface $serializer){
      
        
        $result=$bddResto->findRestoByName($name);
        $json=$serializer->serialize($result,'json');
        
        return new JsonResponse($json, Response::HTTP_OK, [], true);
    }
    
    /**
     * @author  Tommy <tommyramihoatrarivo@gmail.com>
     * create  tribu-t
     */
    public function createTribu_T($body, $stringTraitementService, $status)

    {

        $user = $this->getUser();

        $userId = $user->getId();

        if (!is_null($body)) {
           
                $resto = $body['extension'];
                $golf = $body['extension_golf'];

                $path  =   $body['path'];
                /*$nom est une variable qui designe une table dans la  base de donneé de CMZ, 
                Elle ne peut pas être modifier par l'user ou par le devellopeur , sous risque d'un grand systemique.
                Au début $nom et $nomTribuT on la même valeur*/
                $nom = $body["tribu_t_name"]; 
                $nom = str_replace("'", "$", $nom);
                
                /*$nomTribuT est une varibale mutable c-a-d peut être modifier par l'user et le dev 
                  Au début $nom et $nomTribuT on la même valeur
                */
                $nomTribuT=$body["tribu_t_name"]; 
                // $description = str_replace("'", "$", $body["description"]);
                // $description = $status->convertUtf8ToUnicode($body["description"]) ;
                $description =$body["description"] ;
               
                $tableName = $stringTraitementService->normalizedString($nom);
                $tableName = str_replace(" ","_", strtolower($tableName));
                $tableName = strlen($tableName) > 30 ? substr($tableName,0,30) : $tableName;

                $tribut = new Tribu_T_Service();

                $output = $tribut->createTribuTable($tableName, $userId, $nom, $description);

                $nom = str_replace("$", "'", $nom);

                if ($output != 0) {

                    // $restoExtension = ($resto == "on") ? "restaurant" : null;
                    // $golfExtension = ($golf == "on") ? "golf" : null;

                    $extension = [];
                    $extension["restaurant"] = ($resto == "on") ? 1 : 0;
                    $extension["golf"] = ($golf == "on") ? 1 : 0;
                   
                    $tribut->setTribuT($output, $description, $path,$extension, $userId,"tribu_t_owned", $nomTribuT);

                    $isSuccess = true;

                    $flushMessage = "Félicitation ! Vous avez réussi à créer la tribu " .$nom;

                    $tableTribu = "tribu_t_" . $userId . "_" . $tableName;

                    if ($resto == "on") {

                        $tribut->createExtensionDynamicTable($tableTribu, "restaurant");

                        $tribut->createTableComment($tableTribu, "restaurant_commentaire");

                    }
                    if ($golf == "on") {

                        // $tribut->createExtensionDynamicTableGolf($tableTribu, "golf");

                        // $tribut->createTableCommentGolf($tableTribu, "golf_commentaire");

                        $tribut->createExtensionDynamicTable($tableTribu, "golf");

                        $tribut->createTableComment($tableTribu, "golf_commentaire");

                    }

                    return true;

                } else {
                    $isSuccess = false;
                    $flushMessage = "Vous avez déjà créé la tribu " .$nom;
                    return false;
                }
            
        }

    }

    #[Route("/user/tribu/update-tribu_t-info", name: "update_my_tribu_t")]
    public function updateTribuTInfos
    (Tribu_T_Service $tribu_T_Service, 
    Request $request,
    Filesystem $filesyst,
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
            if (!($filesyst->exists($this->getParameter('kernel.project_dir') . $path)))
                $filesyst->mkdir($this->getParameter('kernel.project_dir') . $path, 0777);
    
            $fileUtils = new FilesUtils();
    
            $fileUtils->uploadImageAjax($this->getParameter('kernel.project_dir') . $path, $base64, time().$photoName);

            $imgURL = $pathToBase.time().$photoName;
        }

        $member = $tribu_T_Service->showMember($tableTribuT);

        $extension = [];
        $extension["restaurant"] = ($restaurant == "on") ? 1 : 0;
        $extension["golf"] = ($golf == "on") ? 1 : 0;
        
        foreach ($member as $user) {
            if($user["user_id"] == $userId){
                $tribu_T_Service->updateTribuTInfos($tableTribuT, $description, $imgURL, $extension, $userId, "tribu_t_owned", $nomTribuT);
            }else{
                $tribu_T_Service->updateTribuTInfos($tableTribuT, $description, $imgURL, $extension, $user["user_id"], "tribu_t_joined", $nomTribuT);
            }
        }

        if ($restaurant == "on") {

            $tribu_T_Service->createExtensionDynamicTable($tableTribuT, "restaurant");

            $tribu_T_Service->createTableComment($tableTribuT, "restaurant_commentaire");
        }

        if ($golf == "on") {

            $tribu_T_Service->createExtensionDynamicTable($tableTribuT, "golf");

            $tribu_T_Service->createTableComment($tableTribuT, "golf_commentaire");

        }

        return $this->json("Information modifié avec succès");

    }

    #[Route("/user/tribu_t/pastille/resto", name:"tribu_t_pastille_resto", methods:["POST"])]
    public function pastilleRestoForTribuT(AgendaService $agendaService, Request $resquest, Tribu_T_Service $tribu_T_Service){

        $jsonParsed=json_decode($resquest->getContent(),true);

        $resto_name =  $jsonParsed["name"];

        $resto_id = $jsonParsed["id"];

        $tribu_t = $jsonParsed["tbl"];

        $checkIdResto = $tribu_T_Service->getIdRestoOnTableExtension($tribu_t."_restaurant", $resto_id);

        if(count($checkIdResto) > 0){
            $tribu_T_Service->depastilleOrPastilleRestaurant($tribu_t."_restaurant", $resto_id, true);
        }else{
            $agendaService->saveRestaurant($tribu_t."_restaurant", $resto_name, $resto_id);
        }
        
        return $this->json(["id_resto"=>$resto_id, "table"=>$tribu_t."_restaurant"]);
    }

    #[Route("/user/tribu_t/pastille/golf", name:"tribu_t_pastille_golf", methods:["POST"])]
    public function pastilleGolfForTribuT(AgendaService $agendaService, Request $resquest, Tribu_T_Service $tribu_T_Service){

        $jsonParsed=json_decode($resquest->getContent(),true);

        $golf_name =  $jsonParsed["name"];

        $golf_id = $jsonParsed["id"];

        $tribu_t = $jsonParsed["tbl"];

        $checkIdResto = $tribu_T_Service->getIdRestoOnTableExtension($tribu_t."_golf", $golf_id);

        if(count($checkIdResto) > 0){
            $tribu_T_Service->depastilleOrPastilleRestaurant($tribu_t."_golf", $golf_id, true);
        }else{
            $agendaService->saveRestaurant($tribu_t."_golf", $golf_name, $golf_id);
        }
        
        return $this->json(["id_golf"=>$golf_id, "table"=>$tribu_t."_golf"]);
    }

    #[Route("/user/tribu_t/depastille/resto", name:"tribu_t_depastille_resto", methods:["POST"])]
    public function dePastilleRestoForTribuT(AgendaService $agendaService, Request $resquest, Tribu_T_Service $tribu_T_Service){

        $jsonParsed=json_decode($resquest->getContent(),true);

        $resto_name =  $jsonParsed["name"];

        $resto_id = $jsonParsed["id"];

        $tribu_t = $jsonParsed["tbl"];

        $checkIdResto = $tribu_T_Service->getIdRestoOnTableExtension($tribu_t."_restaurant", $resto_id);

        if($checkIdResto > 0){
            $tribu_T_Service->depastilleOrPastilleRestaurant($tribu_t."_restaurant", $resto_id, false);
        }

        // $message = "Le restaurant " . $resto_name . " a été dépastillé avec succès !";
        
        return $this->json(["id_resto"=>$resto_id, "table"=>$tribu_t."_restaurant"]);
    }

    #[Route("/user/tribu_t/depastille/golf", name:"tribu_t_depastille_golf", methods:["POST"])]
    public function dePastilleGolfForTribuT(AgendaService $agendaService, Request $resquest, Tribu_T_Service $tribu_T_Service){

        $jsonParsed=json_decode($resquest->getContent(),true);

        $resto_name =  $jsonParsed["name"];

        $golf_id = $jsonParsed["id"];

        $tribu_t = $jsonParsed["tbl"];

        $checkIdGolf = $tribu_T_Service->getIdRestoOnTableExtension($tribu_t."_golf", $golf_id);

        if($checkIdGolf > 0){
            $tribu_T_Service->depastilleOrPastilleRestaurant($tribu_t."_golf", $golf_id, false);
        }
        
        return $this->json(["id_golf"=>$golf_id, "table"=>$tribu_t."_golf"]);
    }

    #[Route('/user/tribu/add_photo/{table}', name: 'add_photo_tribu')]

    public function AddPhotoTribu($table, Request $request,Filesystem $filesyst): Response

    {

        $user = $this->getUser();


        $userId = $user->getId();


        $data = json_decode($request->getContent(), true);



        extract($data);

        $regex = "/\_publication+$/";

        $table_tribu = preg_replace($regex, "", $table);


        $path = $this->getParameter('kernel.project_dir') . '/public/uploads/tribu_t/photos/' . $table_tribu . '/';

        $dir_exist = $filesyst->exists($path);

        if ($dir_exist == false) {

            $filesyst->mkdir($path, 0777);
        }


        $tribu_t = new Tribu_T_Service();



        if ($image != "") {



            // Function to write image into file

            $temp = explode(";", $image);

            $extension = explode("/", $temp[0])[1];

            $imagename = md5($table) . '-' . uniqid() . "." . $extension;



            ///save image in public/uploader folder

            file_put_contents($path . $imagename, file_get_contents($image));

            /// add database image

            $tribu_t->createOnePub($table, $userId, "", 1, '/public/uploads/tribu_t/photos/' . $table_tribu . '/'.$imagename);
        }

        return $this->json("Photo ajouté avec succès");
    }


    #[Route('/user/all_tribu_g/members', name: 'all_tribu_g_members')]

    public function fetchAllTribuGMember(TributGService $tribu_g, Tribu_T_Service $tribut): Response

    {

        $members = $tribu_g->fetchAllTribuGMember();

        $users = array();

        for ($i = 0; $i < count($members); $i++) {

            array_push($users, ["id" => $members[$i]["id"], "fullName" => $members[$i]["firstname"] ." ". $members[$i]["lastname"], "email" => $members[$i]["email"], "tribug" => $members[$i]["tribug"], "isMember" => $tribut->testSiMembre($_GET["tribu_t"], $members[$i]["user_id"])]);

        }

        return $this->json($users);

    }
    
    #[Route('/user/pub/tribu_t', name: 'all_pub_tribu_t')]

    public function fetchAllPubTribuT(UserRepository $userRepository, Tribu_T_Service $tribu_T_Service): Response

    {

        //// ALL PUBLICATION FOR ALL TRIBU T /////
        $all_tribuT= $userRepository->getListTableTribuT(); /// tribu T owned and join
        // dd($all_tribuT);

        if(count($all_tribuT) > 0 ){
            $publications= [];
            $all_pub_tribuT= [];
            foreach($all_tribuT as $tribuT){
                $temp_pub= $tribu_T_Service->getAllPublicationsUpdate($tribuT['table_name']);
                $all_pub_tribuT = array_merge($all_pub_tribuT, $temp_pub);
            }
            $publications= array_merge($publications, $all_pub_tribuT);
        }
        dd($publications);

        return $this->json($publications);

    }   

    #[Route('/tribu/findresto/{quoi}/{ou}', name: 'find_resto_tribu_t')]
    public function findRestoInBdd($quoi, $ou, BddRestoRepository $bddRestoRepository): Response{

        $resto = $bddRestoRepository->getBySpecificClef($quoi, $ou, 1, 20);

        return $this->json($resto);
    }

    #[Route("/user/all/dep", name:"user_all_dep", methods:["GET"])]
    public function getAllDepByNanta(DepartementRepository $departementRepository){
        
        $allDep = $departementRepository->findAll();
        $keyValueDep = [];
        
        foreach ($allDep as $key) {
            $keyValueDep[$key->getDepartement()] = $key->getId();
        }

        return $this->json($keyValueDep);
    }

    #[Route("/user/all/photos", name:"user_all_photos", methods:["GET"])]
    public function getAllPhotoOnDirectory(){
        $folder = $this->getParameter('kernel.project_dir') . "/public/uploads/tribu_t/photo/tribu_t_2_data_engineer_publication/";
        $images = glob($folder . '*.{jpg,jpeg,png,gif}', GLOB_BRACE);
        $tabPhoto = [];
        foreach ($images as $image) {
            $photo = explode("uploads/tribu_t",$image)[1];
            $photo = "/uploads/tribu_t/".$photo;
            // $tabPhoto["photo"] = $photo;
            // array_push($tmp, ...$array1["tribu_t"])
            array_push($tabPhoto, ["photo"=>$photo]);
        }
        dd($tabPhoto);
    }

    /**
     * @author Elie <eliefenohasina@gmail.com>
     * Controlleur de sauvegarde de l'historique de l'invitation dans la tribu T
     */
    #[Route("/tribu/invitation/save_story/{table}",name:"app_save_story_invitation",methods:["POST"])]
    public function saveStoryInvitation($table , Request $request, Tribu_T_Service $tribuTService ){

        $user = $this->getUser();
        $user_id = $user->getId();

        $table_invitation = $table . "_invitation";

        $json=json_decode($request->getContent(),true);
        $email=$json["email"];

        $result= $tribuTService->saveInvitationStory($table_invitation, $user_id, $email);

        if($result == true){
            return $this->json(["status"=>"ok"]);
        }else{
            return $this->json(["status"=>"!ok"]);
        }
       
    }

    /**
     * @author Elie <eliefenohasina@gmail.com>
     * Controlleur de fetching l'historique de l'invitation dans la tribu T
     */
    #[Route("/tribu/invitation/get_all_story/{table}",name:"app_get_all_story_invitation",methods:["GET"])]
    public function getAllStoryInvitation($table , Tribu_T_Service $tribuTService, UserService $user_serv){

        $table_invitation = $table . "_invitation";

        $result= $tribuTService->getAllInvitationStory($table_invitation);
        
        $hist = [];

        if(count($result)>0){
            foreach ($result as $user) {
                $pp = null;

                if($user['id']){
                    $pp = $user_serv->getUserProfileFromId( $user['id'] );
                }
                
                array_push($hist, ['user'=>$pp, 
                'is_valid'=>$user['is_valid'], 
                'date'=>$user['datetime'],
                'email'=>$user['email']
            ]);
            }
        }

        return $this->json($hist);
       
    }

     /**
     * @author Elie <eliefenohasina@gmail.com>
     * Controlleur de MAJ l'historique de l'invitation dans la tribu T
     */
    #[Route("/tribu/invitation/update_story/{table}/{is_valid}/{email}",name:"app_up_valid_story_invitation",methods:["POST"])]
    public function updateStoryInvitation($table ,  $is_valid, $email, Tribu_T_Service $tribuTService){

        $table_invitation = $table . "_invitation";

        $tribuTService->updateInvitationStory($table_invitation, $is_valid, $email);

        return $this->json(["message"=>"Mise à jour sauvegardé!"]);
       
    }

    /**
     * @author Elie <eliefenohasina@gmail.com>
     * Controlleur de MAJ l'historique de l'invitation dans la tribu T
     */
    #[Route("/tribu/invitation/confirm",name:"app_confirm_invitation_tribu",methods:["GET"])]
    public function confirmInvitation(Tribu_T_Service $tribuTService, Request $request){

        $table =$request->query->get("tribu");

        $email =$request->query->get("email");


        if($this->getUser()){

            if($table && $email){

                ////name tribu to join
                $tribuTtoJoined = $table;
                    
                //// apropos user fondateur tribuT with user fondateur
                $userFondateurTribuT= $tribuTService->getTribuTInfo($tribuTtoJoined);
    
                $userPostID= $userFondateurTribuT["user_id"]; /// id of the user fondateur of this tribu T
    
                $data= json_decode($userFondateurTribuT["tribu_t_owned"], true); 

                $arrayTribuT= $data['tribu_t']; /// all tribu T for this user fondateur

                if(array_key_exists("name", $arrayTribuT)){
                    if( $arrayTribuT["name"] === $tribuTtoJoined ){ //// check the tribu T to join
                        $apropos_tribuTtoJoined= $arrayTribuT;
                    }
                }else{
                    foreach($arrayTribuT as $tribuT){
                    
                        if( $tribuT["name"] === $tribuTtoJoined ){ //// check the tribu T to join
                            $apropos_tribuTtoJoined= $tribuT;
                            break;
                        }
                    }
                }

                //// set tribu T for this new user.
                $tribuTService->setTribuT($apropos_tribuTtoJoined["name"], $apropos_tribuTtoJoined["description"], $apropos_tribuTtoJoined["logo_path"], $apropos_tribuTtoJoined["extension"], $this->getUser()->getId(),"tribu_t_joined", $tribuTtoJoined);
                
                ///update status of the user in table tribu T
                $tribuTService->updateMember($request->query->get("tribu"), $this->getUser()->getId(), 1);

                $tribuTService->updateInvitationStory($table . "_invitation", 1, $email);
    
            }

            return $this->redirectToRoute('app_my_tribu_t');

        }else{

            return $this->redirectToRoute('app_login');
            
        }

       
    }

}

