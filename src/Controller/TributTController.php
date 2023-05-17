<?php



namespace App\Controller;



use DateTime;

use Normalizer;

use App\Entity\Consumer;

use App\Entity\Supplier;

use App\Entity\PublicationG;

use App\Service\MailService;

use App\Service\UserService;

use App\Form\PublicationType;

use App\Service\TributGService;

use App\Service\Tribu_T_Service;

use App\Service\RequestingService;

use App\Service\NotificationService;

use Doctrine\ORM\EntityManagerInterface;

use Symfony\Component\HttpFoundation\Request;

use Symfony\Component\HttpFoundation\Response;

use Symfony\Component\Routing\RouterInterface;

use Symfony\Component\Routing\Annotation\Route;

use Symfony\Component\HttpKernel\KernelInterface;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Serializer\Encoder\JsonDecode;
use Symfony\Component\Filesystem\Filesystem;

class TributTController extends AbstractController

{



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



    #[Route('/user/tribu/create', name: 'create_tribu')]

    public function createTable(Request $request,  TributGService $tributGService): Response

    {

        $user = $this->getUser();

        $userId = $user->getId();



        $userType = $user->getType();

        $profil = "";

        $flushMessage = null;

        $isSuccess = false;



        if ($request->isMethod("POST")) {



            if ($request->request->get('create_tribu') == "create_tribu_t") {
                $resto = $request->request->get('restaurant');
                $nom = $request->request->get('name');
                $nom = str_replace("'", "$", $nom);
                $nom_normalized = $request->request->get('name_normalize');
                $description = $request->request->get('description');
                $description = str_replace("'", "$", $description);

                $tableName = strtolower($nom_normalized);
                $tableName = str_replace(" ", "_", $tableName);

                setlocale(LC_CTYPE, 'cs_CZ');

                $tableName = iconv('UTF-8','ASCII//TRANSLIT',$tableName);

                $tableName = preg_replace( '/[^a-z0-9_]/i', '', $tableName);

                $tribut = new Tribu_T_Service();
                $output = $tribut->createTribuTable($tableName, $userId, $nom, $description);
                $nom = str_replace("$", "'", $nom);
                if ($output != 0) {
                    $tribut->setTribuT($output, $userId);
                    $isSuccess = true;
                    $flushMessage = "Félicitation ! Vous avez réussi à créer la tribu " . $request->request->get('name');
                    $tableTribu = "tribu_t_" . $userId . "_".$tableName;
                    if($resto == "on"){
                        $tribut->createExtensionDynamicTable($tableTribu, "restaurant");
                        $tribut->createTableComment($tableTribu, "restaurant_commentaire");
                    }
                    
                    return $this->redirectToRoute('publication_tribu', [
                    "message" => $flushMessage,
                    "table" => $tableTribu."_publication"]);
                } else {
                    $isSuccess = false;
                    $flushMessage = "Vous avez déjà créé la tribu " . $request->request->get('name') . " !";
                }

            }

        }



        if ($userType == "consumer") {

            $profil = $this->entityManager->getRepository(Consumer::class)->findByUserId($userId);

        } else {

            $profil = $this->entityManager->getRepository(Supplier::class)->findByUserId($userId);

        }



        return $this->render('tribu_t/index.html.twig', [

            "message" => $flushMessage, "isSuccess" => $isSuccess, "profil" => $profil, "tzone" => date_default_timezone_get(),

            "statusTribut" => $tributGService->getStatusAndIfValid($profil[0]->getTributg(), $profil[0]->getIsVerifiedTributGAdmin(), $userId)

        ]);

    }



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



        $tribut->updateMember($tableName, $user_id, 1);



        $userPost = $notif_service->getUserPostIdForFeedBack($notif_id, $user_id);



        $tributName = $tribut->showRightTributName($userPost["tribu"])["name"];



        $userPostId = $userPost["user_post"];



        //dd("Id posteur : " . $userPost["user_post"] . " Invitation : " . $userPost["invitation"]);



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



        //dd("Id posteur : " . $userPost["user_post"] . " Invitation : " . $userPost["invitation"]);



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



        //dd($users);



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


    #[Route('/user/tribu/fetch-member/{table}', name: 'fetch_member_tribut')]

    public function fetchMember($table)

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

        return $this->render('tribu_t/member_tribuT.html.twig', [

            "membre" => $tableau
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



    #[Route('user/tribu/publication/{table}', name: 'publication_tribu')]

    public function index($table, Request $request, TributGService $tributGService): Response

    {



        $user = $this->getUser();



        $user_id = $user->getId();



        $tribu_t = new Tribu_T_Service();



        $regex = "/\_publication+$/";



        $table_tribu = preg_replace($regex, "", $table);



        $avatar = $tribu_t->showAvatar($table_tribu, $user_id);

        

        $tribus = $tribu_t->showRightTributName($table_tribu);



        //dd($tribus);



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

        $table_reaction = preg_replace($regex, "_reaction", $table);

        $publications = array();

        $pubs = $tribu_t->fetchAllPub($table);

        $table_resto = $table_tribu.'_restaurant';

        $has_restaurant = $tribu_t->hasTableResto($table_resto);
        //dd($has_restaurant);
        //dd($tribu_t->getRestoPastilles($table_resto));

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

            "table_pub" => $table, "newPub" => $formPub->createView(),

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



        $notification = new NotificationService();



        $type = "commentaire";



        $publicationUrl = "#pub_number_".$pub_id;



        $contentForDestinator = $tribut->getFullName($user_id) . " a commenté votre publication dans la tribu " . $tribut->showRightTributName($tribuTable)["name"];

        $contentForDestinator .= "<a style=\"display:block;padding-left:5px;\" class=\"btn btn-primary btn-sm w-50 mx-auto\" data-ancre=\"".$publicationUrl."\">Voir</a>";

        

        // dd($tribuTable);



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

        $tribu_name = $tribu_t->showRightTributName($table);

        // $contentForDestinator = $userFullname . " vous a envoyé une invitation de rejoindre la tribu " . str_replace("$", "'", $tribu_name["name"]) . "<a style=\"display:block;padding-left:5px;\" class=\"btn btn-primary btn-sm w-50 mx-auto\">Voir l'invitation</a>";
        $contentForDestinator = $userFullname . " vous a envoyé une invitation de rejoindre la tribu " . str_replace("$", "'", $tribu_name["name"]);
        
        $type = "invitation";

        $invitLink = "<a href=\"/user/invitation\" style=\"display:block;padding-left:5px;\" class=\"btn btn-primary btn-sm w-50 mx-auto\">Voir l'invitation</a>";

        $isMembre = $tribu_t->testSiMembre($table, $id_receiver);

        if ($isMembre == "not_invited") {
            $contentForSender = "Vous avez envoyé une invitation à " .$tribu_t->getFullName($id_receiver). " de rejoindre la tribu ". str_replace("$", "'", $tribu_name["name"]);
            $tribu_t->addMember($table, $id_receiver);
            $notification->sendNotificationForTribuGmemberOrOneUser($userId, $id_receiver, $type, $contentForDestinator . $invitLink, $table);
            $this->requesting->setRequestingTribut("tablerequesting_".$id_receiver, $userId, $id_receiver, "invitation", $contentForDestinator, $table);
            $this->requesting->setRequestingTribut("tablerequesting_".$userId, $userId, $id_receiver, "demande", $contentForSender, $table );
            /*$this->mailService->sendEmail(
                "geoinfography@infostat.fr", /// mail where from
                "ConsoMyZone",  //// name the senders
                $tribu_t->getUserEmail($id_receiver), /// mail destionation
                $tribu_t->getFullName($id_receiver), /// name destionation
                "Invitation pour rejoindre la tribu " . str_replace("$", "'", $tribu_name["name"]), //// title of email
                // "Pour accepter l'invitation. Clickez-ici : " . $this->generateUrl("show_invitation", array("tribu_name" => $table, "notif_id" => $notification->getNotificationId("tablenotification_".$id_receiver, $table)), UrlGeneratorInterface::ABSOLUTE_URL)
                "Pour accepter l'invitation. Clickez-ici : " . $this->generateUrl("app_invitation", array("tribu_name" => $table, "notif_id" => $notification->getNotificationId("tablenotification_".$id_receiver, $table)), UrlGeneratorInterface::ABSOLUTE_URL)
            );*/
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



        // dd(intval($notif_id));



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
        dump($restos);
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
        // dump($restos);
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
        MailService $mailService,
        UserService $userService,
        RouterInterface $router,
        Tribu_T_Service $tribuTService
    )
    {
        if(!$this->getUser()){
            return $this->json(["result" => "error"] , 401);
        }

        $data = json_decode($request->getContent(), true);
        extract($data); ///$table, $principal, $cc ,$object, $description
        $from_fullname = $userService->getUserFirstName($this->getUser()->getId()) . $userService->getUserLastName($this->getUser()->getId());


        //// prepare email which we wish send
        $url = $router->generate('app_email_link_inscription', ['email' => $principal , 'tribu' => $table, 'signature' => "%2BqdqU93wfkSf5w%2F1sni7ISdnS12WgNAZDyWZ0kjzREg%3D&token=3c9NYQN05XAdV%2Fbc8xcM5eRQOmvi%2BiiSS3v7KDSKvdI%3D"], UrlGeneratorInterface::ABSOLUTE_URL);
        
        $tribuTService->addMemberTemp($table, $principal);
        // sendEmail($from,$fullName_from,$to,$fullName_to,$objet,$message)
        $mailService->sendEmail(
            $this->getUser()->getEmail(),
            $from_fullname,
            $principal,
            "Amis",
            $object,
            // "Je vous invite de rejoindre ma tribu T. J'espère que vous ne regrettez rien. La seule chose que vous devez faire est de s'inscrire, cliquez sur le lien ci-dessous." . $url
            $description . "\nSi vous souhaitez de nous rejoindre, cliquez sur le lien ci-dessous.\n" . $url
        );


        if( count($cc) > 0 ){
            foreach($cc as $c){

                $tribuTService->addMemberTemp($table, $c);

                //// prepare email which we wish send
                $url = $router->generate('app_email_link_inscription', ['email' => $c,'tribu' => $table, 'signature' => "%2BqdqU93wfkSf5w%2F1sni7ISdnS12WgNAZDyWZ0kjzREg%3D&token=3c9NYQN05XAdV%2Fbc8xcM5eRQOmvi%2BiiSS3v7KDSKvdI%3D"], UrlGeneratorInterface::ABSOLUTE_URL);
                
                // sendEmail($from,$fullName_from,$to,$fullName_to,$objet,$message)
                $mailService->sendEmail(
                    $this->getUser()->getEmail(),
                    $from_fullname,
                    $c,
                    "Amis",
                    $object,
                    // "Je vous invite de rejoindre ma tribu T. J'espère que vous ne regrettez rien. La seule chose que vous devez faire est de s'inscrire, cliquez sur le lien ci-dessous." . $url
                    $description . "\nSi vous souhaitez de nous rejoindre, cliquez sur le lien ci-dessous." . $url
                );

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

    
    #[Route('/user/tribu/add_photo/{table}', name: 'add_photo_tribu')]

    public function AddPhotoTribu($table, Request $request): Response

    {

        $user = $this->getUser();


        $userId = $user->getId();


        $data = json_decode($request->getContent(), true);



        extract($data);

        $regex = "/\_publication+$/";

        $table_tribu = preg_replace($regex, "", $table);


        $path = $this->getParameter('kernel.project_dir') . '/public/uploads/tribu_t/photos/'.$table_tribu.'/';

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

                /// add database image

                $tribu_t->createOnePub($table, $userId, "", 1, $imagename);


        }

        return $this->json("Photo ajouté avec succès");

    }

    #[Route('/tribu_t/publications/{table_pub}', name: 'publications_block')]

    public function showPubBloc($table_pub, Request $request, TributGService $tributGService): Response

    {

        $user = $this->getUser();

        $user_id = $user->getId();

        $tribu_t = new Tribu_T_Service();

        $regex = "/\_publication+$/";

        $table_tribu = preg_replace($regex, "", $table_pub);

        $rows = $tribu_t->fetchAllPub($table_pub);

        $tribus = $tribu_t->showRightTributName($table_tribu);

        $table_reaction = preg_replace($regex, "_reaction", $table_pub);

        $publications = array();

        $pubs = $tribu_t->fetchAllPub($table_pub);

        foreach ($pubs as $key) {

            array_push($publications, [

                "id" => $key["id"],

                "user_id" => $key["user_id"],

                "table_pub" => $table_pub,

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

        return $this->render('tribu_t/publications.twig', [

            "tribu" => $tribus,
			
			"table_tribu" => $table_tribu,

            "table_pub" => $table_pub,

            "publication" => $publications,

        ]);

    }

}

