<?php



namespace App\Controller;



use DateTime;

use Normalizer;

use App\Entity\User;

use App\Entity\Consumer;

use App\Entity\Supplier;
use App\Entity\PublicationG;
use App\Form\FileUplaodType;
use App\Service\MailService;

use App\Service\UserService;

use App\Service\FilesUtils;
use App\Form\PublicationType;
use App\Service\TributGService;

use App\Service\Tribu_T_Service;

use App\Repository\UserRepository;

use App\Service\RequestingService;
use App\Service\NotificationService;
use App\Repository\BddRestoRepository;

use Doctrine\ORM\EntityManagerInterface;

use function PHPUnit\Framework\assertFalse;

use Symfony\Component\Filesystem\Filesystem;

use Symfony\Component\HttpFoundation\Request;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\RouterInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpKernel\KernelInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Serializer\Encoder\JsonDecode;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Symfony\Component\String\Slugger\SluggerInterface;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
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

    function __construct(MailService $mailService, 

    EntityManagerInterface $entityManager, 

    KernelInterface $appKernel, 

    RequestingService $requesting)

    {

        $this->entityManager = $entityManager;

        $this->appKernel = $appKernel;

        $this->mailService = $mailService;

        $this->requesting = $requesting;

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
        $json = $serializer->serialize($v, 'json');
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
    public function update_pdp_tribu(Request $request,Filesystem $filesyst, UserRepository $userRep){
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
        
        $response = new Response();
        try{
            $userRep->updatePdpTribu_T(json_encode($userTribu_T));
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

        RequestingService $requestingService

    ): Response

    {

        $tribut = new Tribu_T_Service();



        $notif_service = new NotificationService();



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

    public function rejectInvitation($tableName, $user_id, $notif_id): Response

    {



        $notif_service = new NotificationService();



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

    #[Route('user/tribu_one/{name_tribu_t}', name: 'show_tribu_tribu_t')]
    public function showTribu_T_specifique($name_tribu_t,
    Tribu_T_Service $tribu_t_serv,
    SerializerInterface $serializer){

       $data=$tribu_t_serv->getTribuTInfo($name_tribu_t);
        $jsonUsers = $serializer->serialize($data, 'json');
        return new JsonResponse($jsonUsers, Response::HTTP_OK, [], true);
    }

    #[Route('/user/tribu/publication/{table}', name: 'publication_tribu')]

    public function index($table, Request $request, TributGService $tributGService): Response

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



        $notifService = new NotificationService();



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



        if ($formPub->isSubmitted() && $formPub->isValid()) {

            $publication = $formPub['legend']->getData();

            $confid = $formPub['confidentiality']->getData();

            $photo = $formPub['photo']->getData();

            $newFilename = "";



            if ($photo) {

                $destination = $this->getParameter('kernel.project_dir') . '/public/assets/publications/photos';

                $originalFilename = pathinfo($photo->getClientOriginalName(), PATHINFO_FILENAME);

                $newFilename = md5($originalFilename) . '-' . uniqid() . '.' . $photo->guessExtension();

                $photo->move(

                    $destination,

                    $newFilename

                );

            }



            $tribu_t->createOnePub($table, $user_id, $publication, $confid, $newFilename);

        }



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

                "publication" => $key["publication"],

                "confidentiality" => $key["confidentiality"],

                "photo" => $key["photo"],

                "userfullname" => $key["userfullname"],

                "datetime" => $key["datetime"],
                "commentaire_number" => $tribu_t->getCommentaireNumber($table_tribu."_commentaire", $key["id"]),
                "reaction" => $tribu_t->getReaction($table_reaction, $user_id, $key["id"]),

                "reaction_number" => $tribu_t->getReactionNumber($table_reaction, $key["id"])

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



        if (isset($photo)) {

            $destination = $this->getParameter('kernel.project_dir') . '/public/assets/publications/photos';

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

    public function saveComment(Request $request)

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

        $path = $this->getParameter('kernel.project_dir') . '/public/uploads/users/audios/';

        if ($audio != "") {

            $temp = explode(";", $audio );

            $extension = explode("/", $temp[0])[1];

            $audioname = uniqid() . "." . $extension;

            file_put_contents($path . $audioname, file_get_contents($audio));
        }

        $regex = "/\_commentaire+$/";

        $tribuTable = preg_replace($regex, "", $table_com);

        $tribut = new Tribu_T_Service();


        $tribut->createComent($table_com, $user_id, $pub_id, $new_comment, $audioname);



        $notification = new NotificationService();



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

    public function saveReaction(Request $request)

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



        $notification = new NotificationService();



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

    public function updatePublication($table, Request $request)

    {



        $user = $this->getUser();

        $requestContent = json_decode($request->getContent(), true);



        $pub_id = $requestContent["pub_id"];



        $confid = $requestContent["confidentiality"];



        $new_message = $requestContent["message"];



        $tribut = new Tribu_T_Service();



        $tribut->updatePublication($table, $pub_id, $new_message, $confid);



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
    public function sendInvitation(Request $request): Response
    {
        $user = $this->getUser();

        $userId = $user->getId();
        
        $requestContent = json_decode($request->getContent(), true);

        $table = $requestContent["table"];

        $notification = new NotificationService();

        $tribu_g = new TributGService();

        $tribu_g_table = $tribu_g->getTribuGtableForNotif($userId);

        $members = $tribu_g->getAllTributG($tribu_g_table);

        $tribu_t = new Tribu_T_Service();

        $userFullname = $tribu_t->getFullName($userId);

        $tribu_name = $tribu_t->showRightTributName($table);

        $type = "invitation";

        $invitLink = "<a href=\"/user/invitation\" style=\"display:block;padding-left:5px;\" class=\"btn btn-primary btn-sm w-50 mx-auto\">Voir l'invitation</a>";

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
    public function sendOneInvitation(Request $request): Response
    {
        $requestContent = json_decode($request->getContent(), true);

        $table = $requestContent["table"];

        $id_receiver = $requestContent["user_id"];

        $user = $this->getUser();

        $userId = $user->getId();

        $notification = new NotificationService();

        $tribu_t = new Tribu_T_Service();

        $userFullname = $tribu_t->getFullName($userId);

        //$tribu_name = $tribu_t->showRightTributName($table);

        // $contentForDestinator = $userFullname . " vous a envoyé une invitation de rejoindre la tribu " . str_replace("$", "'", $tribu_name["name"]) . "<a style=\"display:block;padding-left:5px;\" class=\"btn btn-primary btn-sm w-50 mx-auto\">Voir l'invitation</a>";
        $contentForDestinator = $userFullname . " vous a envoyé une invitation de rejoindre la tribu " . $table;
        
        $type = "invitation";

        $invitLink = "<a href=\"/user/invitation\" style=\"display:block;padding-left:5px;\" class=\"btn btn-primary btn-sm w-50 mx-auto\">Voir l'invitation</a>";

        $isMembre = $tribu_t->testSiMembre($table, $id_receiver);

        if ($isMembre == "not_invited") {
            $contentForSender = "Vous avez envoyé une invitation à " .$tribu_t->getFullName($id_receiver). " de rejoindre la tribu ". $table;
            $tribu_t->addMember($table, $id_receiver);
            $notification->sendNotificationForTribuGmemberOrOneUser($userId, $id_receiver, $type, $contentForDestinator . $invitLink, $table);
            $this->requesting->setRequestingTribut("tablerequesting_".$id_receiver, $userId, $id_receiver, "invitation", $contentForDestinator, $table);
            $this->requesting->setRequestingTribut("tablerequesting_".$userId, $userId, $id_receiver, "demande", $contentForSender, $table );
        }

        return $this->json("Invitation envoyee");
        
    }



    #[Route('/user/tribu/invitation', name: 'show_invitation')]

    public function showInvitation(Request $request, TributGService $tributGService)

    {

        $user = $this->getUser();



        $userId = $user->getId();



        $userType = $user->getType();



        $tribu = $request->query->get("tribu_name");



        $notif_id = $request->query->get("notif_id");






        $tribu_t = new Tribu_T_Service();



        $tribu_name = $tribu_t->showRightTributName($tribu);



        $isMember = $tribu_t->testSiMembre($tribu, $userId);



        $notifService = new NotificationService();



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



        $tribu_t = new Tribu_T_Service();



        $photos = $tribu_t->showAllphotosTribut($table);



        return $this->json($photos);

    }

    #[Route('/user/tribu/restos-pastilles/{table_resto}', name: 'show_restos_pastilles')]

    public function getRestoPastilles($table_resto): Response

    {

        $tableComment=$table_resto."_commentaire";
        $tribu_t = new Tribu_T_Service();

        $has_restaurant = $tribu_t->hasTableResto($table_resto);
        
        $restos = array();

        if($has_restaurant == true){
            $restos = $tribu_t->getRestoPastilles($table_resto, $tableComment);
        }
        return $this->json($restos);

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



        $path = $this->getParameter('kernel.project_dir') . '/public/uploads/tribus/photos/';



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



        $path = $this->getParameter('kernel.project_dir') . '/public/uploads/users/photos/';



        if($image != "" ){



                // Function to write image into file

                $temp = explode(";", $image );

                $extension = explode("/", $temp[0])[1];

                $imagename = md5($userId). '-' . uniqid() . "." . $extension;



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

        $userEmail = $this->getUser()->getEmail();

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
            $url = $router->generate('app_login', ['email' => $principal], UrlGeneratorInterface::ABSOLUTE_URL);

            $mailService->sendEmail(
                $userEmail,
                $from_fullname,
                $principal,
                "Amis",
                $object,
                // "Je vous invite de rejoindre ma tribu T. J'espère que vous ne regrettez rien. La seule chose que vous devez faire est de s'inscrire, cliquez sur le lien ci-dessous." . $url
                $description . "\nVeuillez visiter le site en cliquant sur le lien ci-dessous.\n" . $url
            );

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
            $mailService->sendEmail(
                $userEmail,
                $from_fullname,
                $principal,
                "Amis",
                $object,
                // "Je vous invite de rejoindre ma tribu T. J'espère que vous ne regrettez rien. La seule chose que vous devez faire est de s'inscrire, cliquez sur le lien ci-dessous." . $url
                $description . "\nSi vous souhaitez de nous rejoindre, cliquez sur le lien ci-dessous.\n" . $url
            );
        }

        if( count($cc) > 0 ){

            foreach($cc as $c){

                if($userRepository->findOneBy(["email" => $c])){

                    /** URL FOR MEMBER
                     * EDITED By Nantenaina
                    */
                    $url = $router->generate('app_login', ['email' => $c], UrlGeneratorInterface::ABSOLUTE_URL);
        
                    $mailService->sendEmail(
                        $userEmail,
                        $from_fullname,
                        $c,
                        "Amis",
                        $object,
                        // "Je vous invite de rejoindre ma tribu T. J'espère que vous ne regrettez rien. La seule chose que vous devez faire est de s'inscrire, cliquez sur le lien ci-dessous." . $url
                        $description . "\nVeuillez visiter le site en cliquant sur le lien ci-dessous.\n" . $url
                    );
        
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
                    $mailService->sendEmail(
                        $userEmail,
                        $from_fullname,
                        $c,
                        "Amis",
                        $object,
                        // "Je vous invite de rejoindre ma tribu T. J'espère que vous ne regrettez rien. La seule chose que vous devez faire est de s'inscrire, cliquez sur le lien ci-dessous." . $url
                        $description . "\nSi vous souhaitez de nous rejoindre, cliquez sur le lien ci-dessous." . $url
                    );
                }

            }
        }

        return $this->json([
            "result" => "success"
        ], 201 );
    }

    #[Route("/push/comment/resto/pastilled",name:"push_comment_pastilled_resto",methods:["POST"])]
    public function push_comment_pastilled_resto(Request $request, Tribu_T_Service $tribuTService ){
        $json=json_decode($request->getContent(),true);
        $tableName=$json["tableName"];
        $idResto=$json["idResto"];
        $idUser=$json["idUser"];
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
    public function up_comment_pastilled_resto(Request $request, Tribu_T_Service $tribuTService)
    {
        $json = json_decode($request->getContent(), true);
        $tableName = $json["tableName"];
        $idRestoComment = $json["idRestoComment"];
        // $idUser = $json["idUser"];
        $note = $json["note"];
        $commentaire = $json["commentaire"];

        $result = $tribuTService->upCommentRestoPastilled($tableName, $note, $commentaire,$idRestoComment);
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
    public function MyTribuT(Request $request,  
    TributGService $tributGService,
    SluggerInterface $slugger,
    Filesystem $filesyst) : Response
    {
        

        $defaultData = ['message' => 'Type your message here'];
        $form = $this->createFormBuilder($defaultData)
            ->add('upload', FileType::class, [
                'label' => false,
                'required' => false 
            ])
            ->add('tribuTName', TextType::class, [
                'label' => false 
            ])
            ->add('description', TextareaType::class, [
                'label' => false ,
                'required' => false
            ])
            ->add('adresse', TextType::class, [
                'label' => false ,
                'required' => false
            ])
            ->add('extension', CheckboxType::class, [
                'label' => 'Restaurant',
                'required' => false
            ])
            ->getForm();
        //$form = $this->createFormB(FileUplaodType::class);
        $user=$this->getUser();
        $form->handleRequest($request);

        $body=null;
        if ($form->isSubmitted() && $form->isValid()) {
           
            $data = $form->getData();
            $tribuName= str_replace(" ","_", strtolower($data["tribuTName"]));
            $tmp=Normalizer::normalize($tribuName,Normalizer::NFD);
            $tribuTNameFinal=preg_replace('/[[:^print:]]/', '', $tmp);
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
                "tribu_t_name"=>$tribuTNameFinal,
                "description"=>$data["description"],
                "adresse"=>$data["adresse"], 
                "extension"=>$data["extension"]);
          
            $this->createTribu_T($body);
            return $this->redirectToRoute("app_my_tribu_t");
      
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
         
        if($_ENV['APP_ENV'] == 'dev') 
            dump($tibu_T_data_owned);

        $tribu_t_owned=!is_null($tibu_T_data_owned) ?  $tibu_T_data_owned : null;
        $tribu_t_joined=!is_null($tibu_T_data_joined) ?  $tibu_T_data_joined : null;
        



       

        
        return $this->render('tribu_t/tribuT.html.twig',[
            "profil" => $profil,
            "kernels_dir" => $this->getParameter('kernel.project_dir'), 
            "tibu_T_owned" => $tribu_t_owned,
            "tibu_T_joined" => $tribu_t_joined,
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
        $publication= $jsonParsed["contenu"];
        $confid=$jsonParsed["confidentialite"];
        $image= $jsonParsed["base64"];
        $imageName= $jsonParsed["photoName"];
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
    //,  TributGService $tributGService
    public function createTribu_T($body)

    {

        $user = $this->getUser();

        $userId = $user->getId();



        // $userType = $user->getType();

        // $profil = "";

        // $flushMessage = null;

        // $isSuccess = false;
        if (!is_null($body)) {
           
                $resto = $body['extension'];
                $path  =   $body['path'];
                $nom = $body["tribu_t_name"];
                $nom = str_replace("'", "$", $nom);
                $description = str_replace("'", "$", $body["description"]);


                $nameNormalized =Normalizer::normalize($nom, Normalizer::NFD);
                $nameNormalized2 = preg_replace('/[[:^print:]]/', '', $nameNormalized);
                $tableName = strtolower($nameNormalized2);
                $tableName = str_replace(" ", "_", $tableName);

                setlocale(LC_CTYPE, 'cs_CZ');

                $tableName = iconv('UTF-8', 'ASCII//TRANSLIT', $tableName);

                $tableName = preg_replace('/[^a-z0-9_]/i', '', $tableName);

                $tribut = new Tribu_T_Service();
                $output = $tribut->createTribuTable($tableName, $userId, $nom, $description);
                $nom = str_replace("$", "'", $nom);
                if ($output != 0) {
                    $restoExtension = ($resto == "on") ? "restaurant" : null;
                    $tribut->setTribuT($output, $description, $path,$restoExtension, $userId,"tribu_t_owned");
                    $isSuccess = true;
                    $flushMessage = "Félicitation ! Vous avez réussi à créer la tribu " .$nom;
                    $tableTribu = "tribu_t_" . $userId . "_" . $tableName;
                    if ($resto == "on") {
                        $tribut->createExtensionDynamicTable($tableTribu, "restaurant");
                        $tribut->createTableComment($tableTribu, "restaurant_commentaire");
                    }

                    return $this->redirectToRoute('publication_tribu', [
                        "message" => $flushMessage,
                        "table" => $tableTribu . "_publication"
                    ]);
                } else {
                    $isSuccess = false;
                    $flushMessage = "Vous avez déjà créé la tribu " .$nom;
                }
            
        }



        // if ($userType == "consumer") {

        //     $profil = $this->entityManager->getRepository(Consumer::class)->findByUserId($userId);
        // } else {

        //     $profil = $this->entityManager->getRepository(Supplier::class)->findByUserId($userId);
        // }



        // return $this->render('tribu_t/index.html.twig', [

        //     "message" => $flushMessage, "isSuccess" => $isSuccess, "profil" => $profil, "tzone" => date_default_timezone_get(),

        //     "statusTribut" => $tributGService->getStatusAndIfValid($profil[0]->getTributg(), $profil[0]->getIsVerifiedTributGAdmin(), $userId)

        // ]);
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

    

}

