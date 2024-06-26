<?php



namespace App\Controller;



use PDO;

use App\Service\Status;

use App\Entity\Consumer;

use App\Entity\Supplier;

use App\Service\UserService;

use App\Form\PublicationType;

use App\Form\MixtePublicationType;

use App\Form\UserSettingType;

use App\Service\TributGService;

use App\Service\Tribu_T_Service;

use App\Service\SortResultService;

use App\Repository\UserRepository;

use App\Service\RequestingService;

use Proxies\__CG__\App\Entity\User;

use App\Service\NotificationService;
use App\Service\PDOConnexionService;

use App\Repository\ConsumerRepository;

use App\Repository\SupplierRepository;

use App\Repository\FermeGeomRepository;

use Doctrine\ORM\EntityManagerInterface;

use Symfony\Component\Filesystem\Filesystem;

use Symfony\Component\HttpFoundation\Request;

use Symfony\Component\HttpFoundation\Response;

use Symfony\Component\Routing\RouterInterface;

use Symfony\Component\Routing\Annotation\Route;

use Symfony\Component\HttpFoundation\StreamedResponse;

use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

use Symfony\Component\HttpKernel\KernelInterface;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;

class UserController extends AbstractController
{

    private $entityManager;

    private $appKernel;

    private $filesyst;


    public function __construct(EntityManagerInterface $entityManager,KernelInterface $appKernel, Filesystem $filesyst){

        $this->entityManager = $entityManager;
        $this->appKernel = $appKernel;
        $this->filesyst = $filesyst;

}
    #[Route("/info/verif/{id}",name:"userInfo")]
    public function getUserInfo($id){

        $data=$this->entityManager->getRepository(User::class)->findBy(["id"=>$id]);
        return $this->json(["email"=>$data[0]->getEmail()]);

    }
    #[Route("/user", name: "home")]
    public function home(){
        return $this->redirectToRoute('app_actualite');
    }

    #[Route("/user/actualite", name: "app_actualite")]
    public function Actualite(
        Status $status,
        Request $request,
        TributGService $tribuGService,
        Tribu_T_Service $tribuTService,
        UserRepository $userRepository,
        SortResultService $sortResultService,
        NotificationService $notificationService
    ): Response
    {
        $userConnected= $status->userProfilService($this->getUser());
        
        if( $userConnected["userType"] === "Type"){
            return $this->redirectToRoute('app_actu_non_active');
        }

        $userId= $this->getUser()->getId();
        $tribuG= $userConnected['tableTribuG'];
        $publications = [];

        //// ALL PUBLICATION TRIBU G /////
        $pub_tribuG= $tribuGService->getAllPublicationsUpdate($tribuG);
        $publications= array_merge($publications, $pub_tribuG);

        //// ALL PUBLICATION FOR ALL TRIBU T /////
        $all_tribuT= $userRepository->getListTableTribuT(); /// tribu T owned and join
      
       
        if(count($all_tribuT) > 0 ){
            $all_pub_tribuT= [];
            foreach($all_tribuT as $tribuT){
                $temp_pub= $tribuTService->getAllPublicationsUpdate($tribuT['table_name']);
                $all_pub_tribuT= array_merge($all_pub_tribuT, $temp_pub);
            }
            $publications= array_merge($publications, $all_pub_tribuT);
        }
        

        //// SORTED PUBLICATION BY DATE CREATED AT TIME OF UPDATE
        $publicationSorted= (count($publications) > 0 ) ? $sortResultService->sortTapByKey($publications, "publication", "createdAt") : $publications;
        // dd($publicationSorted);

        ///all publication on tribu T use for new publications
        $choiceTribuT= [];
        if(count($all_tribuT) > 0 ){
            foreach($all_tribuT as $key => $tribuT){
                $n= "Tribu T " . ucfirst(explode("_",$tribuT["table_name"])[count(explode("_",$tribuT["table_name"]))-1]);
                $choiceTribuT[$n] = $tribuT["table_name"];
            }
        }

        // dd($choiceTribuT);
        $new_publication = $this->createForm(MixtePublicationType::class,[ "tribuTList" => $choiceTribuT ],[]);
        
        $flash = [];
        
        $new_publication->handleRequest($request);
        if ($new_publication->isSubmitted() && $new_publication->isValid()) {
            
            // dd($new_publication->getData());
            $type_tribu = $new_publication['type']->getData();

            $newFilename = "";

            $legend = $new_publication['legend']->getData();
            $confid = $new_publication['confidentiality']->getData();
            $photo = $new_publication['photo']->getData();
            $capture = $new_publication['capture']->getData();
            // dd($photo);
            if( $photo ){
                $destination = $this->getParameter('kernel.project_dir'). "/public/uploads";
                $newFilename = "/public/uploads";

                $originalFilename = pathinfo($photo->getClientOriginalName(), PATHINFO_FILENAME);

                if( $type_tribu === "Tribu G"){
                    $destination .= '/tribu_g/photos/'.$tribuG.'/';
                    $newFilename .= '/tribu_g/photos/' . $tribuG. "/" . md5($originalFilename) . '-' . uniqid() . '.' . $photo->guessExtension();

                }else{
                    $tribu = $new_publication['tribu']->getData();
                    $destination .= '/tribu_t/photos/'.$tribu.'/';
                    $newFilename .= '/tribu_t/photos/' . $tribu . "/" . md5($originalFilename) . '-' . uniqid() . '.' . $photo->guessExtension();
                }

                $dir_exist = $this->filesyst->exists($destination);
                if($dir_exist===false){
                    $this->filesyst->mkdir($destination, 0777);
                }
                
                $photo->move($destination,$newFilename);
            }

            /**
             * @author Elie
             * bloc capture si l'utilisateur utilise un camera direct de votre appareil
             * utilisé dans Tribu G ou T
             */
            if ($capture) {

                // Function to write image into file

                $destination = $this->getParameter('kernel.project_dir'). "/public/uploads";
                $newFilename = "/public/uploads";

                $temp = explode(";", $capture);

                $extension = explode("/", $temp[0])[1];

                $imagename = md5($userId) . '-' . uniqid() . "." . $extension;

                if( $type_tribu === "Tribu G"){
                    $destination .= '/tribu_g/photos/'.$tribuG.'/';
                    $newFilename .= '/tribu_g/photos/' . $tribuG. "/" . $imagename;

                }else{
                    $tribu = $new_publication['tribu']->getData();
                    $destination .= '/tribu_t/photos/'.$tribu.'/';
                    $newFilename .= '/tribu_t/photos/' . $tribu . "/" . $imagename;
                }

                $dir_exist = $this->filesyst->exists($destination);
                if($dir_exist===false){
                    $this->filesyst->mkdir($destination, 0777);
                }

                file_put_contents($destination .'/'. $imagename, file_get_contents($capture));

            }

            if ($legend || $photo) {
                if( $type_tribu === "Tribu G"){
                    $tribu= $tribuG;
                    $tribuGService->createOnePub($tribuG. "_publication", $userId, $legend, intval($confid), $newFilename);
                }else{
                    $tribu = $new_publication['tribu']->getData();
                    $tribuTService->createOnePub($tribu . '_publication', $userId, $legend, intval($confid), $newFilename);
                }
            }

            ///send notification
            $notificationService->sendNotificationForOne($userId, $userId, "Une nouvelle notification.", "Votre publication est publiée.");

            ///send notification for all partisant in tribu.
            

            return $this->redirect($request->getUri());
        }


        $test= $tribuTService->getAllTribuTJoinedAndOwned($this->getUser()->getId());
        return $this->render("user/actualite.html.twig", [
            "userConnected" => $userConnected,
            "publications" => $publicationSorted,
            "formPub" => $new_publication->createView(),
        ]);
    }


 
    #[Route("/user/account", name: "app_account")]

    public function Account(

        Status $status,

        Request $request,

        EntityManagerInterface $entityManager,

        TributGService $tributGService,

        UserRepository $userRepository

    ): Response {

        $userConnected= $status->userProfilService($this->getUser());
        
        $user = $this->getUser();

        $userType = $user->getType();

        $userId = $user->getId();

        $profil = "";

        if ($userType == "consumer") {

            $profil = $entityManager->getRepository(Consumer::class)->findByUserId($userId);
        } else {

            $profil = $entityManager->getRepository(Supplier::class)->findByUserId($userId);
        }
        
        $all_TribuT= $userRepository->getListTableTribuT();

        $new_publication = $this->createForm(PublicationType::class, [], []);



        $new_publication->handleRequest($request);



        $flash = [];



        if ($new_publication->isSubmitted() && $new_publication->isValid()) {



            $publication = $new_publication['legend']->getData();

            $confid = $new_publication['confidentiality']->getData();

            $photo = $new_publication['photo']->getData();

            $capture = $new_publication['capture']->getData();

            $newFilename = "";

            $destination = $this->getParameter('kernel.project_dir') . '/public/uploads/tribu_g/photos/'.$profil[0]->getTributg().'/';

            $dir_exist = $this->filesyst->exists($destination);

            if($dir_exist==false){

                $this->filesyst->mkdir($destination, 0777);

            }

            if ($publication || $confid) {


                $destination = $this->getParameter('kernel.project_dir') . '/public/uploads/tribu_g/photos/' . $profil[0]->getTributG();

                if ($photo) {


                    $originalFilename = pathinfo($photo->getClientOriginalName(), PATHINFO_FILENAME);

                    $newFilename =  '/public/uploads/tribu_g/photos/' . $profil[0]->getTributG() . "/" . md5($originalFilename) . '-' . uniqid() . '.' . $photo->guessExtension();
                    $photo->move(

                        $destination,

                        $newFilename

                    );
                }

                /**
                 * @author Elie
                 * bloc capture si l'utilisateur utilise un camera direct de votre appareil
                 * utilisé dans Tribu G
                 */
                if ($capture) {

                    // Function to write image into file

                    $temp = explode(";", $capture);

                    $extension = explode("/", $temp[0])[1];

                    $imagename = md5($userId) . '-' . uniqid() . "." . $extension;

                    $newFilename =  '/public/uploads/tribu_g/photos/' . $profil[0]->getTributG() . "/" .$imagename;

                    file_put_contents($destination .'/'. $imagename, file_get_contents($capture));

                }

                $tributGService->createOnePub($profil[0]->getTributG() . "_publication", $userId, $publication, $confid, $newFilename);
            }



            return $this->redirect($request->getUri());
        }

        
        return $this->render("tribu_g/account.html.twig", [
            "userConnected" => $userConnected,

            "profil" => $profil,

            "table_tribu" => $profil[0]->getTributg(),

            "statusTribut" => $tributGService->getStatusAndIfValid($profil[0]->getTributg(),$profil[0]->getIsVerifiedTributGAdmin(), $userId),

            "tributG" => [
                "table" => $profil[0]->getTributg(),

                "profil" => $tributGService->getProfilTributG(

                    $profil[0]->getTributg(),

                    $userId

                ),
                "publications" => $tributGService->getAllPublicationsUpdate($profil[0]->getTributg()),
                "count_publications" => $tributGService->getCountAllPublications($profil[0]->getTributg()),
            ],

            "new_publication" => $new_publication->createView(),
            "all_tribuT" => $all_TribuT
        ]);
    }



    #[Route("/users/account/publications", name: "app_publications_sse")]

    public function publicationsSSE(

        TributGService $tributGService

    ) {

        $publications =  $tributGService->getAllPublications(

            $tributGService->getTableNameTributG(

                $this->getUser()->getId()

            )

        );

        /// send event to the client

        $response = new StreamedResponse();

        $response->setCallback(function () use (&$publications) { /// send result



            echo "data:" . json_encode($publications) .  "\n\n";

            ob_end_flush();

            flush();
        });



        /// setting the header

        $response->headers->set('Access-Control-Allow-Origin', '*');

        $response->headers->set('Access-Control-Allow-Headers', 'origin, content-type, accept');

        $response->headers->set('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, PATCH, OPTIONS');

        $response->headers->set('Cache-Control', 'no-cache');

        $response->headers->set('Content-Type', 'text/event-stream');



        return $response;
    }

    #[Route("/send/notifications/etbasCreate", name: "send_notifications_etbasCreate")]

    public function sendNotifications(

        Request $request,

        EntityManagerInterface $entityManager,

        NotificationService $notificationService,

        UserRepository $userRepository,

        TributGService $tributGService,

        SupplierRepository $supplierRepository,

        ConsumerRepository $consumerRepository,

        FermeGeomRepository $ferm

    ): Response {

        $req = json_decode($request->getContent(), true);

        $user = $this->getUser();

        $userId = $user->getId();

        $userType = $user->getType();

        if ($userType == "consumer") {

            $profil = $entityManager->getRepository(Consumer::class)->findByUserId($userId);
        } else {

            $profil = $entityManager->getRepository(Supplier::class)->findByUserId($userId);
        }

        $tableTribuGName = $profil[0]->getTributG();
        $allUsers = $tributGService->getAllTributG($tableTribuGName);

        ///ferme/departement/Ain/01/details/4726

        $content = "";

        if ($req["ask"] == "update") {

            // $content = $profil[0]->getFirstName() . " " . $profil[0]->getLastName() . "<a href='/ferme/departement/" . $req["departeName"] .
            //     "/" . $req["numDeparte"] . "/details/" . $req["id"] . "'>vient de modifier des informations sur son établissement</a>";
            $content= $profil[0]->getFirstName() . " " . $profil[0]->getLastName() . " vient de modifier des informations sur son établissement.";


        } else if ($req["ask"] == "create") {

            // $content = $profil[0]->getFirstName() . " " . $profil[0]->getLastName() . "<a href='/ferme/departement/" . $req["departeName"] .
            //     "/" . $req["numDeparte"] . "/details/" . $req["id"] . "'>vient de créer une nouvelle établissement</a>";

            $content= $profil[0]->getFirstName() . " " . $profil[0]->getLastName() . " vient de créer une nouvelle établissement.";

        }

        $notificationService->sendNotificationForMany($userId, $allUsers, "Nouvelle etablissement", $content);

        return $this->json("succes", 200);
    }





    #[Route("/send/request/moderate", name: "app_send_request_moderate")]

    public function sendRequestModerate(

        Request $request,

        EntityManagerInterface $entityManager,

        NotificationService $notificationService,

        UserRepository $userRepository,

        TributGService $tributGService,

        SupplierRepository $supplierRepository,
    ) {



        //TODO send request

    }



    #[Route("/send/notification/ask", name: "app_ask_notification_send")]

    public function sendNotificationForAsk(

        Request $request,

        TributGService $tributGService,

        NotificationService $notificationService,

        UserRepository $userRepository,

        Status $status,

        RequestingService $requesting

    ) {

        $req = $request->request->all();

        $id_receiver = $req["id"];

        //$val = $req["value"];



        $user_receiver = $userRepository->find($id_receiver);

        // $profil_receiver=$status->statusFondateur($user_receiver)["profil"];



        $tableRequestingReceiver = $user_receiver->getTableRequesting();



        ///all have the same table tribuG name.

        $tableTribuGName = $tributGService->getTableNameTributG($id_receiver);



        $userPoster = $this->getUser();

        $userPosterId = $userPoster->getId();

        $tableRequestingPoster = $userPoster->getTableRequesting();

        $profilPoster = $status->statusFondateur($userPoster)["profil"];



        // $content = $profilPoster[0]->getFirstName() . " " . $profilPoster[0]->getLastName() . "<a href=\"{{path('app_invitation')}}\">vient de vous envoyer une invitation pour devenir moderateur</a>";
        // $content = $profilPoster[0]->getFirstName() . " " . $profilPoster[0]->getLastName() . "<a href='/user/invitation'>vient de vous envoyer une invitation pour devenir modérateur</a>";

        $content = $profilPoster[0]->getFirstName() . " " . $profilPoster[0]->getLastName() . " vient de vous envoyer une invitation pour devenir modérateur.";



        $notificationService->sendNotificationForOne(
            $userPosterId,
            $id_receiver,
            "Invitation",
            $content
        );

        $balise = str_replace(" ", "", $tableTribuGName . $id_receiver . $userPosterId);

        //send request to user receiver
        $requesting->setRequesting(
            $tableRequestingReceiver,
            $userPosterId,
            $id_receiver,
            "invitation",
            "Invitation pour devenir modérateur",
            $balise
        );



        //send request to user poster
        $requesting->setRequesting(
            $tableRequestingPoster,
            $userPosterId,
            $id_receiver,
            "demande",
            "Invitation pour devenir modérateur",
            $balise
        );



        return $this->json(["succe" => "ok"]);
    }





    #[Route("/set/isDev", name: "app_set_is_dev")]

    public function setIsDev(

        Request $request,

        EntityManagerInterface $entityManager,

        NotificationService $notificationService,

        UserRepository $userRepository,

        TributGService $tributGService,

        SupplierRepository $supplierRepository,
    ) {

        $req = json_decode($request->getContent(), true);

        $id = $req["id"];

        $val = $req["value"];

        $tableTribuGName = $tributGService->getTableNameTributG($id);

        $isucces = $tributGService->setIsDev($tableTribuGName, $id, $val);

        return $this->json(["succes" => $isucces]);
    }



    #[Route("/set/isModerateur", name: "app_set_is_mod")]

    public function setIsModerateur(

        Request $request,

        EntityManagerInterface $entityManager,

        NotificationService $notificationService,

        UserRepository $userRepository,

        TributGService $tributGService,

        SupplierRepository $supplierRepository,

    ) {

        $req = json_decode($request->getContent(), true);

        $id = $req["id"];

        $val = $req["value"];

        $tableTribuGName = $tributGService->getTableNameTributG($id);

        $isucces = $tributGService->setIsModerateur($tableTribuGName, $id, $val);

        return $this->json(["succes" => $isucces]);
    }





    #[Route("/user/setting", name: "setting_user_account")]

    public function settingAccount(
        Status $status,

        Request $request,

        ConsumerRepository $consumerRepository,

        SupplierRepository $supplierRepository

    ): Response {

        if ( !$this->getUser()) {
            return $this->redirectToRoute("app_connexion");
        }

        $userConnected= $status->userProfilService($this->getUser());

        if ($this->getUser()->getType() === "consumer") {
            $profil = $consumerRepository->findOneBy(["user" => $this->getUser()->getId()]);
        } else {
            $profil = $supplierRepository->findOneBy(["user" => $this->getUser()->getId()]);
        }

        $form = $this->createForm(UserSettingType::class);

        $flash = [];



        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {

            dd($form->getData());
        }



        return $this->render("user/settingAccount.html.twig", [

            "userConnected" => $userConnected,

            "form_setting" => $form->createView(),

            "flash" => $flash,

            "firstname" => $profil->getFirstname(),

            "lastname" => $profil->getLastname()

        ]);
    }

    #[Route('/user/profil/{user_id}', name: 'user_profil')]
    public function index(
        $user_id,
        EntityManagerInterface $entityManager,
        TributGService $tributGService,
        Status $status,
        UserRepository $userRepository,
        UserService $userService,
        Tribu_T_Service $tributTService,
    ){
        $userConnected= $status->userProfilService($this->getUser());
        
        $user = $this->getUser();
        $userId = $user->getId();
        $myuserType = $user->getType();

        $myProfil = null;

        if ($myuserType == "consumer") {
            $myProfil = $entityManager->getRepository(Consumer::class)->findByUserId($userId);
        } elseif ($myuserType == "supplier") {
            $myProfil = $entityManager->getRepository(Supplier::class)->findByUserId($userId);
        }

        $tribu_t = new Tribu_T_Service();
        $userType = $tribu_t->getTypeUser($user_id);

        $profil = null;

        $type = "";
        if ($userType == "consumer") {

            $type = "Partisan";
            $profil = $entityManager->getRepository(Consumer::class)->findByUserId($user_id);
        }elseif ($userType == "supplier") {

            $type = "Partenaire";
            $profil = $entityManager->getRepository(Supplier::class)->findByUserId($user_id);
        }

        $path = $this->getParameter('kernel.project_dir') . '/public/uploads/users/photos/photo_user_' . $user_id . "/";
        $images = glob($path . "*.*");
        $images_trie = [];

        for ($i = count($images) - 1; $i >= 0; $i--) {
            # code...
            array_push($images_trie, $images[$i]);
        }

        

        $nombre_partisant = $tributGService->getCountPartisant($profil[0]->getTributG());
        $status_tribuT_autre_profil= strtoupper($tributGService->getStatus($profil[0]->getTributG(),$user->getId()));

        //Editing by Elie for a tribu g and t partisans
        
        $partisansG = [];
        $partisansT = [];

        $tributG_name = $tributGService->getTribuGtableForNotif($user_id);

        $all_user_id_tribug = $tributGService->getAllTributG($tributG_name);

        foreach ($all_user_id_tribug as $user_id_tribu_g) {
            $friend = $userRepository->find(intval($user_id_tribu_g["user_id"]));
            
            if( $tributGService->getCurrentStatus($tributG_name, $friend->getId())){

                $single_user = [
                    "id" => intval($friend->getId()),
                    "email" => $friend->getEmail(),
                    "firstname" => $userService->getUserFirstName($friend->getId()),
                    "lastname" => $userService->getUserLastName($friend->getId()),
                    "status" => $tributGService->getCurrentStatus($tributG_name, $friend->getId()),
                ];
    
                array_push($partisansG, $single_user);

            }
        }

        $all_tribuT = $userService->getTribuByIdUser($user_id);

        for($i=0; $i < count($all_tribuT); $i++ ){

            $tribut= $all_tribuT[$i];

            $tribuT_apropos= $tributTService->getApropos($tribut["table_name"]);

            $membres = $userService->getMembreTribuT($tribut["table_name"]);
            for($j=0; $j< count($membres); $j++ ){

                $partisant= $membres[$j];
                $friendT = $userRepository->find(intval($partisant["user_id"]));

                if( $friendT ){
                    $single_user = [
                        "id" => intval($friendT->getId()),
                        "email" => $friendT->getEmail(),
                        "firstname" => $userService->getUserFirstName($friendT->getId()),
                        "lastname" => $userService->getUserLastName($friendT->getId()),
                        "status" => $tributGService->getCurrentStatus($tributG_name, $friendT->getId()),
                        "role" =>$partisant["roles"],
                    ];
        
                    array_push($partisansT, ["user"=>$single_user, "tribuT"=>$tribuT_apropos]);
                }
            }

        }

        return $this->render('user/profil.html.twig', [
            "userConnected" => $userConnected,
            "profil" => $myProfil,
            "autre_profil" => $profil,
            "type" => $type,
            "images" => $images_trie,
            "statusTribut" => $tributGService->getStatusAndIfValid(
                $profil[0]->getTributg(),
                $profil[0]->getIsVerifiedTributGAdmin(),
                intval($user_id)
            ),

            "tributG" => [
                "table" => $profil[0]->getTributg(),

                "profil" => $tributGService->getProfilTributG(
                    $profil[0]->getTributg(),
                    intval($user_id)
                ),
            ],

            "nombre_partisant" => $nombre_partisant,
            "status_tribuT_autre_profil" =>$status_tribuT_autre_profil,
            "tribu_g_friend" => $partisansG,
            "tribu_t_friend" => $partisansT,

        ]);
    }



    #[Route('/user/dashboard', name: 'app_dashboard')]
    public function Dashboard(
        EntityManagerInterface $entityManager,
        TributGService $tributGService,
        Status $status,
        UserRepository $userRepository,

        SupplierRepository $supplierRepository,
    ): Response {
        $userConnected= $status->userProfilService($this->getUser());

        $user = $this->getUser();
        $userType = $user->getType();
        $userId = $user->getId();
        $profil = "";

        if ($userType == "consumer") {
            $profil = $entityManager->getRepository(Consumer::class)->findByUserId($userId);
        } else {
            $profil = $entityManager->getRepository(Supplier::class)->findByUserId($userId);
        }



        $all_user_supplier = $userRepository->findBy(["type" => "supplier"]);



        $results = [];



        foreach ($all_user_supplier as $user_supplier) {

            $supplier = $supplierRepository->findOneBy(["userId" => $user_supplier->getId()]);



            $result = [

                "id" => $user_supplier->getId(),

                "email" => $user_supplier->getEmail(),

                "type" => $user_supplier->getType(),

                "isLabled" => $user_supplier->getIsLabled(),



                "firstname" => $supplier->getFirstname(),

                "lastname" => $supplier->getLastname(),

            ];


            array_push($results, $result);
        }


        return $this->render("user/dashboard_super_admin/dashboard.html.twig", [
            "userConnected" => $userConnected,

            "statusTribut" => $tributGService->getStatusAndIfValid(
                $profil[0]->getTributg(),
                $profil[0]->getIsVerifiedTributGAdmin(),
                $userId
            ),

            "results" => $results
        ]);
    }

    #[Route("/user/dashboard/tribug_json", name:"app_dashboard_tribug_json")]
    public function app_dashboard_tribug_json(
        TributGService $tributGService
    ){
        return $this->json(
            ["allTribuG" => $tributGService->getAllTableTribuG()]
        );
    }

    #[Route("/user/dashboard/tribut_json", name: "app_dashboard_tribut_json")]
    public function app_dashboard_tribut_json(
        Tribu_T_Service $tributTService
    ) {
        $user = $this->getUser();
        $userId = $user->getId();

        return $this->json(
            ["allTribuT" => $tributTService->getAllTribuT($userId)]
        );
    }


    #[Route('/user/dashboard-membre', name: 'app_dashboardmembre')]

    public function DashboardMembre(
        Status $status,
        Request $request,
        EntityManagerInterface $entityManager,
        TributGService $tributGService,
        UserRepository $userRepository,
        ConsumerRepository $consumerRepository,
        SupplierRepository $supplierRepository
    ): Response {

        $userConnected= $status->userProfilService($this->getUser());

        $table_name = $request->query->get("table");
        // dd($table_name);


        $user = $this->getUser();
        $userType = $user->getType();
        $userId = $user->getId();

        $profil = "";
        if ($userType == "consumer") {
            $profil = $entityManager->getRepository(Consumer::class)->findByUserId($userId);
        } else {
            $profil = $entityManager->getRepository(Supplier::class)->findByUserId($userId);
        }

        $results = [];

        $under_tributG = $tributGService->getAllUserWithRoles($table_name);
        if ($under_tributG === 0) {
            goto quit;
        }

        foreach ($under_tributG as $tributG) {

            $user = $userRepository->find(intval($tributG["user_id"]));
            if ($user->getType() === "consumer") {
                $user_profil = $consumerRepository->findOneBy(['userId' => $tributG["user_id"]]);
            } else {
                $user_profil = $supplierRepository->findOneBy(['userId' => $tributG["user_id"]]);
            }

            $result = [
                "id" => $tributG["user_id"],
                "roles" => $tributG["roles"],
                "email" => $user->getEmail(),
                "firstname" => $user_profil->getFirstname(),
                "lastname" => $user_profil->getLastname(),
                "commune" => $user_profil->getCommune(),
                "isVerified" => $user_profil->getIsVerifiedTributGAdmin()
            ];



            array_push($results, $result);
        }



        quit:

        return $this->render("user/dashboard_super_admin/dashboard-membre.html.twig", [
            "userConnected" => $userConnected,
            "profil" => $profil,
            "statusTribut" => $tributGService->getStatusAndIfValid(
                $profil[0]->getTributg(),
                $profil[0]->getIsVerifiedTributGAdmin(),
                $userId
            ),
            "results" => $results
        ]);
    }



    #[Route("/user/dashboard-membre-apropos", name: "app_dashboardapropos")]

    public function DashboardMembreApropos(
        Status $status,

        Request $request,

        EntityManagerInterface $entityManager,

        TributGService $tributGService,

        UserRepository $userRepository,

        ConsumerRepository $consumerRepository,

        SupplierRepository $supplierRepository

    ): Response {

        $userConnected= $status->userProfilService($this->getUser());

        ///get param from the url
        ///user to validate.
        $user_id_to_control = intval($request->query->get("user_id"));

        /// current user connected: super admin
        $user = $this->getUser();
        $userType = $user->getType();
        $userId = $user->getId();
        $profil = "";

        if ($userType == "consumer") {
            $profil = $entityManager->getRepository(Consumer::class)->findByUserId($userId);
        } else {
            $profil = $entityManager->getRepository(Supplier::class)->findByUserId($userId);
        }

        $user_to_control = $userRepository->find($user_id_to_control);

        if ($user_to_control->getType() === "consumer") {
            $user_to_control_profil = $consumerRepository->findOneBy(['userId' => $user_id_to_control]);
        } else {
            $user_to_control_profil = $supplierRepository->findOneBy(['userId' => $user_id_to_control]);
        }

        $table_tribut = $user_to_control_profil->getTributG();
        $tribut = $tributGService->getStatus($table_tribut, $user_id_to_control);

        $apropos = [

            "id" => $user_to_control->getId(),

            "email" => $user_to_control->getEmail(),

            "tributg" => $table_tribut,

            "firstname" => $user_to_control_profil->getFirstname(),

            "lastname" => $user_to_control_profil->getLastname(),

            "commune" => $user_to_control_profil->getCommune(),

            "quartier" => $user_to_control_profil->getQuartier(),

            "codepostal" => $user_to_control_profil->getCodePostal(),

            "numRue" =>  $user_to_control_profil->getNumRue(),

            "pays" => $user_to_control_profil->getPays(),

            "tel" => $user_to_control_profil->getTelephone(),

            "telFixe" => $user_to_control_profil->getTelFixe(),

            "roles" => $tribut,

            "isVerified" => $user_to_control_profil->getIsVerifiedTributGAdmin(),

            "categories" => $user_to_control->getType()

        ];


        return $this->render("user/dashboard_super_admin/dashboard-apropos.html.twig", [
            "userConnected" => $userConnected,

            "profil" => $profil,

            "statusTribut" => $tributGService->getStatusAndIfValid(

                $profil[0]->getTributg(),

                $profil[0]->getIsVerifiedTributGAdmin(),

                $userId

            ),

            "apropos" => $apropos

        ]);
    }



    #[Route("/admin/validate_tributG", name: "app_validate_by_super_admin")]

    public function validateBySuperAdmin(
        Request $request,

        ConsumerRepository $consumerRepository,

        SupplierRepository $supplierRepository,

        EntityManagerInterface $entityManagerInterface,

        NotificationService $notificationService,

        UserRepository $userRepository

    ) {
        ///pour plus de resultat dans le view.

        $categories = $request->query->get("categories");

        $user_id = $request->query->get("user_id");

        $value = $request->query->get("value");



        if ($categories === "consumer") {

            $profil = $consumerRepository->findOneBy(["userId" => intVal($user_id)]);
        } else {

            $profil = $supplierRepository->findOneBy(["userId" => intVal($user_id)]);
        }



        if (intval($value) === 0) {

            $profil->setIsVerifiedTributGAdmin(false);

            $message_notification = "Dommage, l'administrateur de cette plateforme ne pas accepter que vous êtes l'administrateur de cette Tribu G.";
        } else {

            $profil->setIsVerifiedTributGAdmin(true);

            $message_notification = "Nous vous informons que l'administrateur de cette plateforme a valider que votre rôle en tant qu'administrateur dans notre tribu G.";

                // "<br/> <a class='d-block w-50 mx-auto mt-3 btn btn-primary text-center' href='/user/dashboard-fondateur' alt='Administration tributG'>Voir</a>";
        }

        $entityManagerInterface->persist($profil);
        $entityManagerInterface->flush();

        ////send notification to the fondateur tributG

        $admin = $userRepository->findByRolesUserSuperAdmin();

        $type = "Validation d'administrer le tribu G";

        $notificationService->sendNotificationForOne(
            $admin->getId(),  /// user dispatch an action and send notification
            intval($user_id), /// user to receive notification
            $type,            /// type de messagge
            $message_notification
        );

        return $this->json($value);
    }





    #[Route("/user/dashboard-fondateur", name: "app_dashboard_fondateur")]

    public function DashboardFondateur(
        Status $status,
        UserRepository $userRepository,
        TributGService $tributGService,
        EntityManagerInterface $entityManager,
        UserService $userService
    ): Response {

        $userConnected= $status->userProfilService($this->getUser());
        $user = $this->getUser();
        $userType = $user->getType();
        $userId = $user->getId();

        $profil = "";
        if ($userType == "consumer") {
            $profil = $entityManager->getRepository(Consumer::class)->findByUserId($userId);
        } else {
            $profil = $entityManager->getRepository(Supplier::class)->findByUserId($userId);
        }



        $results = [];

        $table_name = $profil[0]->getTributg();

        $all_member = $tributGService->getAllUserWithRoles($table_name);

        foreach ($all_member  as $member) {

            $user_temp = $userRepository->find(intval($member["user_id"]));
            $profil_temp =  $userService->getUserProfileFromId(intval($member["user_id"]));

            if ($user_temp &&  $profil_temp) {

                $result = [
                    "id" => $member["user_id"],
                    "roles" => $member["roles"],
                    "email" => $user_temp->getEmail(),
                    "firstname" => $profil_temp->getFirstname(),
                    "lastname" => $profil_temp->getLastname(),
                    "commune" => $profil_temp->getCommune(),
                    "isVerified" => $profil_temp->getIsVerifiedTributGAdmin()
                ];



                array_push($results, $result);
            }
        }





        return $this->render("user/dashboard_fondateur/dashboard.html.twig", [
            "userConnected" => $userConnected,
            "profil" => $profil,

            "results" => $results,

            "statusTribut" => $tributGService->getStatusAndIfValid(

                $profil[0]->getTributg(),

                $profil[0]->getIsVerifiedTributGAdmin(),

                $userId

            )

        ]);
    }





    #[Route("/user/dashboard-membre-fondateur", name: "app_dashboardmembre_fondateur")]

    public function DashboardMembreFondateur(
        Status $status,

        EntityManagerInterface $entityManager,

        TributGService $tributGService

    ): Response {
        $userConnected= $status->userProfilService($this->getUser());
        $user = $this->getUser();

        $userType = $user->getType();

        $userId = $user->getId();

        $profil = "";

        if ($userType == "consumer") {

            $profil = $entityManager->getRepository(Consumer::class)->findByUserId($userId);
        } else {

            $profil = $entityManager->getRepository(Supplier::class)->findByUserId($userId);
        }

        return $this->render("user/dashboard_Fondateur/dashboard-membre.html.twig", [
            "userConnected" => $userConnected,
            "profil" => $profil,
            "statusTribut" => $tributGService->getStatusAndIfValid($profil[0]->getTributg(), $profil[0]->getIsVerifiedTributGAdmin(), $userId)
        ]);
    }





    #[Route("/set/banished", name: "app_set_part_banished", methods: ["POST"])]

    public function SetBanished(

        Request $request,

        EntityManagerInterface $entityManager,

        TributGService $tributGService,

        UserRepository $userRepository,

        ConsumerRepository $consumerRepository,

        SupplierRepository $supplierRepository

    ): Response {

        $user_id_to_control = $request->request->get("id");

        //dump($user_id_to_control);

        $user_to_control = $userRepository->find($user_id_to_control);

        if ($user_to_control->getType() === "consumer") {

            $user_to_control_profil = $consumerRepository->findOneBy(['userId' => $user_id_to_control]);
        } else {

            $user_to_control_profil = $supplierRepository->findOneBy(['userId' => $user_id_to_control]);
        }

        $table_tribut = $user_to_control_profil->getTributG();

        $r = $tributGService->setBanishePartisant($table_tribut, $user_id_to_control);

        return $this->json(["success" => $r], 200);
    }





    #[Route("/undo/banished", name: "app_undo_part_banished")]

    public function UndoBanished(

        Request $request,

        EntityManagerInterface $entityManager,

        TributGService $tributGService,

        UserRepository $userRepository,

        ConsumerRepository $consumerRepository,

        SupplierRepository $supplierRepository

    ){

        $user_id_to_control = $request->request->get("id");

        //dump($user_id_to_control);

        $user_to_control = $userRepository->find($user_id_to_control);

        if ($user_to_control->getType() === "consumer") {

            $user_to_control_profil = $consumerRepository->findOneBy(['userId' => $user_id_to_control]);
        } else {

            $user_to_control_profil = $supplierRepository->findOneBy(['userId' => $user_id_to_control]);
        }

        $table_tribut = $user_to_control_profil->getTributG();

        $r = $tributGService->undoBanishePartisant($table_tribut, $user_id_to_control);

        return $this->json(["success" => $r], 200);
    }



    #[Route("/user/dashboard-membre-apropos-fondateur", name: "app_dashboardapropos_fondateur")]

    public function DashboardMembreAproposFondateur(
        Status $status,

        Request $request,

        EntityManagerInterface $entityManager,

        TributGService $tributGService,

        UserRepository $userRepository,

        ConsumerRepository $consumerRepository,

        SupplierRepository $supplierRepository,

    ): Response {
        $userConnected= $status->userProfilService($this->getUser());

        $user_id_to_control = intval($request->query->get("user_id"));



        $user = $this->getUser();

        $userType = $user->getType();

        $userId = $user->getId();

        $profil = "";

        if ($userType == "consumer") {

            $profil = $entityManager->getRepository(Consumer::class)->findByUserId($userId);
        } else {

            $profil = $entityManager->getRepository(Supplier::class)->findByUserId($userId);
        }





        $user_to_control = $userRepository->find($user_id_to_control);

        if ($user_to_control->getType() === "consumer") {

            $user_to_control_profil = $consumerRepository->findOneBy(['userId' => $user_id_to_control]);
        } else {

            $user_to_control_profil = $supplierRepository->findOneBy(['userId' => $user_id_to_control]);
        }





        $table_tribut = $user_to_control_profil->getTributG();

        $isBanished = $tributGService->getBanishedStatus($table_tribut, $user_id_to_control);

        $tribut = $tributGService->getStatus($table_tribut, $user_id_to_control);

        $apropos = [

            "id" => $user_to_control->getId(),

            "email" => $user_to_control->getEmail(),

            "tributg" => $table_tribut,

            "firstname" => $user_to_control_profil->getFirstname(),

            "lastname" => $user_to_control_profil->getLastname(),

            "commune" => $user_to_control_profil->getCommune(),

            "roles" => $tribut,

            "isVerified" => $user_to_control_profil->getIsVerifiedTributGAdmin(),

            "categories" => $user_to_control->getType(),

            "isBanned" => $isBanished

        ];



        return $this->render("user/dashboard_fondateur/dashboard-apropos.html.twig", [
            "userConnected" => $userConnected,
            "profil" => $profil,

            "statusTribut" => $tributGService->getStatusAndIfValid(

                $profil[0]->getTributg(),

                $profil[0]->getIsVerifiedTributGAdmin(),

                $userId

            ),

            "apropos" => $apropos



        ]);
    }





    #[Route("/user/notification/show", name: "app_set_notification_to_show", methods: "POST")]
    public function setNotificationToShow(
        Request $request,
        NotificationService $notificationService
    ){
        /// [ { "notif_id": "1"}, { "user_id":2 } , ... ]
        $data = json_decode($request->getContent(), true);

        ///get the name the table notification from the user.
        $table = $this->getUser()->getTablenotification();

        ////set notif to already show
        $notificationService->setShowNotif($table, $data);

        return $this->json(true);
    }


    #[Route("/user/notification/readAll", name: "app_set_notification_to_read_all", methods: "POST")]

    public function setNotificationToReadAll(
        Request $request,
        NotificationService $notificationService
    ){
        /// [ { "notif_id": "1"}, { "user_id":2 } , ... ]
        $data = json_decode($request->getContent(), true);

        ///get the name the table notification from the user.
        $table = $this->getUser()->getTablenotification();


        ////set notif to already show
        $notificationService->setReadNotif($table, $data);

        return $this->json(true);
    }



    #[Route("/user/notification/read", name: "app_read_notification")]
    public function readNotification(
        Request $request,
        NotificationService $notificationService,
        UserRepository $userRepository
    ){
        $notification_id = $request->query->get("notif_id");
        $table = $this->getUser()->getTablenotification();
        $singleNotification = $notificationService->updateNotificationIsread($notification_id, $this->getUser()->getId());

        return $this->json("Setting notification, ok");
    }





    #[Route("/user/administration/fournisseur", name: "app_administre_fournisseur")]

    public function adminFournisseur(
        Status $status,
        EntityManagerInterface $entityManager,

        UserRepository $userRepository,

        SupplierRepository $supplierRepository,

        TributGService $tributGService
    ): Response {
        $userConnected= $status->userProfilService($this->getUser());
        $user = $this->getUser();

        $userType = $user->getType();

        $userId = $user->getId();

        $profil = "";

        if ($userType == "consumer") {

            $profil = $entityManager->getRepository(Consumer::class)->findByUserId($userId);
        } else {

            $profil = $entityManager->getRepository(Supplier::class)->findByUserId($userId);
        }



        $all_user_supplier = $userRepository->findBy(["type" => "supplier"]);



        $results = [];



        foreach ($all_user_supplier as $user_supplier) {

            $supplier = $supplierRepository->findOneBy(["userId" => $user_supplier->getId()]);



            $result = [

                "id" => $user_supplier->getId(),

                "email" => $user_supplier->getEmail(),

                "type" => $user_supplier->getType(),

                "isLabled" => $user_supplier->getIsLabled(),



                "firstname" => $supplier->getFirstname(),

                "lastname" => $supplier->getLastname(),

            ];



            array_push($results, $result);
        }



        return $this->render("user/dashboard_super_admin/admin_fournisseur.html.twig", [
            "userConnected" => $userConnected,
            "profil" => $profil,

            "statusTribut" => $tributGService->getStatusAndIfValid(

                $profil[0]->getTributg(),

                $profil[0]->getIsVerifiedTributGAdmin(),

                $userId

            ),
          
            "results" => $results

        ]);
    }



    #[Route("/user/account/dashboard-fondateur/setting/validation", name: "app_setting_fondateur_setting")]

    public function dashboardSettingValidation(Request $request ,   Status $status)

    {
        $userConnected= $status->userProfilService($this->getUser());
        return $this->render("user/dashboard_fondateur/SettingAdminFondateur.html.twig", [ 
            "userConnected" => $userConnected,
        ]);
    }



    #[Route("/user/account/dashboard-fondateur/list-publication", name: "app_fondateur_list_publication")]

    public function dashboardListPublication(
        Status $status,
        EntityManagerInterface $entityManager,

        TributGService $tributGService,

        UserRepository $userRepository,

        ConsumerRepository $consumerRepository,

        SupplierRepository $supplierRepository,

        Request $request

    ): Response {
        $userConnected= $status->userProfilService($this->getUser());

        $user = $this->getUser();

        $userType = $user->getType();

        $userId = $user->getId();

        $profil = "";

        $userIdP = $request->query->get("user_id");

        if ($userType == "consumer") {
            $profil = $entityManager->getRepository(Consumer::class)->findByUserId($userId);
        } else {
            $profil = $entityManager->getRepository(Supplier::class)->findByUserId($userId);
        }

        return $this->render("user/dashboard_fondateur/listDePublication.html.twig", [
                "userConnected" => $userConnected,
                "profil" => $profil,
                "statusTribut" => $tributGService->getStatusAndIfValid(
                    $profil[0]->getTributg(),
                    $profil[0]->getIsVerifiedTributGAdmin(),
                    $userId
                ),
                'userIdP' =>  $userIdP
            ]
        );
    }



    #[Route("/user/administration/fournisseur/{id}", name: "app_administre_fournisseur_apropos")]

    public function administre_fournisseur_appropos(
        $id,
        Status $status,
        EntityManagerInterface $entityManager,
        UserRepository $userRepository,
        SupplierRepository $supplierRepository,
        TributGService $tributGService
    ): Response {
        $userConnected= $status->userProfilService($this->getUser());
        $user_connected = $this->getUser();

        $userType = $user_connected->getType();

        $userId = $user_connected->getId();

        $profil = "";

        if ($userType == "consumer") {

            $profil = $entityManager->getRepository(Consumer::class)->findByUserId($userId);
        } else {

            $profil = $entityManager->getRepository(Supplier::class)->findByUserId($userId);
        }
        $user = $userRepository->find(intval($id));
        $supplier = $supplierRepository->findOneBy(["userId" => $id]);
        return $this->render("user/dashboard_super_admin/apropos_fournisseur.html.twig", [
            "userConnected" => $userConnected,
            "profil" => $profil,
            "statusTribut" => $tributGService->getStatusAndIfValid(
                $profil[0]->getTributg(),
                $profil[0]->getIsVerifiedTributGAdmin(),
                $userId
            ),
            "user" => $user,
            "supplier" => $supplier
        ]);
    }

    #[Route("/user/validate/fournisseur", name: "app_administre_fournisseur_validate")]

    public function validate_fournisseur(

        Request $request,

        UserRepository $userRepository,

        EntityManagerInterface $entityManagerInterface,

    ) {

        $id = intval($request->query->get("id"));

        $user = $userRepository->find($id);



        $user->setIsLabled(true);



        $entityManagerInterface->persist($user);

        $entityManagerInterface->flush();



        return $this->json(true);
    }



    #[Route("/user/list-de-mes-etablissement", name: "app_list_de_mes_etablissement")]

    public function ListDeMaisAtribut(
        Status $status,

        EntityManagerInterface $entityManager,

        TributGService $tributGService,

        FermeGeomRepository $fermeGeomRepository

    ): Response {

        $userConnected= $status->userProfilService($this->getUser());

        $user = $this->getUser();

        $userType = $user->getType();

        $userId = $user->getId();

        $profil = "";



        if ($userType == "consumer") {

            $profil = $entityManager->getRepository(Consumer::class)->findByUserId($userId);
        } else {

            $profil = $entityManager->getRepository(Supplier::class)->findByUserId($userId);
        }

        return $this->render("user/listeDeMesEtablissement.html.twig", [

            "userConnected" => $userConnected,

            "id_dep" => $fermeGeomRepository->findOneBy(["addBy" => $user->getId()])->getDepartement(),

            "nom_dep" => $fermeGeomRepository->findOneBy(["addBy" => $user->getId()])->getDepartementName(),

            "fermes" => $fermeGeomRepository->findBy(["addBy" => $user->getId()]),

            "profil" => $profil,

            "statusTribut" => $tributGService->getStatusAndIfValid($profil[0]->getTributg(), $profil[0]->getIsVerifiedTributGAdmin(), $userId)

        ]);
    }





    #[Route("/getMax", name: "max_id")]

    public function getMax(FermeGeomRepository $f): Response
    {

        $idMax = $f->getLastId();

        return $this->json(["id" => $idMax], 200);
    }







    #[Route("/user/invitation/update", name: "app_update_list_invitations")]

    public function invitationUpdate(Status $status, RequestingService $requesting): Response

    {

        $tableRequestingName = $this->getUser()->getTablerequesting();

        $invitations = $requesting->getAllRequest($tableRequestingName);

        //dd($invitations);

        $response = new StreamedResponse();



        $response->setCallback(function () use (&$invitations) {

            echo "event: refreshInvitation";

            echo "\n";

            echo "data:" . json_encode($invitations) .  "\n\n";

            ob_end_flush();

            flush();
        });



        $response->headers->set('Access-Control-Allow-Origin', '*');

        $response->headers->set('Access-Control-Allow-Headers', 'origin, content-type, accept');

        $response->headers->set('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, PATCH, OPTIONS');

        $response->headers->set('Cache-Control', 'no-cache');

        $response->headers->set('Content-Type', 'text/event-stream');

        return $response;
    }

    /* Edited By Nantenaina */

    #[Route("/user/invitations/confirm/{id}/{idR}/{balise}/{is_tribu}", name: "app_invitation_confirm")]
    public function invitationConfirm(
        Status $status,
        RequestingService $requesting,
        $id,
        $idR,
        $balise,
        NotificationService $notificationService,
        UserRepository $userRepository,
        TributGService $tr,
        $is_tribu,
        Tribu_T_Service $tribut,
        // Request $request
    ): Response {

        // $requestContent = json_decode($request->getContent(), true);

        // $nomTribuT =  $requestContent["nomTribu"];

        $tableRequestingName = $this->getUser()->getTablerequesting();

        $tableRequestingNameOtherUser = $userRepository->find($idR)->getTablerequesting();

        $userPoster = $this->getUser();

        $role = $tribut->getRole($balise, intval($idR));

        $role == "Fondateur" ? $tribu_t_joined = json_decode($tribut->fetchJsonDataTribuT(intval($idR),"tribu_t_owned")) : 
                                $tribu_t_joined = json_decode($tribut->fetchJsonDataTribuT(intval($idR),"tribu_t_joined"));

        $listTribuT = $tribu_t_joined->tribu_t;

        $tribu_t_joined_info = null;
        
        if(is_array($listTribuT)){
            for ($i = 0; $i < count($listTribuT); $i++) {

                if($listTribuT[$i]->name == $balise) $tribu_t_joined_info = $listTribuT[$i];
                
            }
        }else{
            $tribu_t_joined_info = $listTribuT;
        }
        

        $userPosterId = $userPoster->getId();
        $pseudo = $userPoster->getPseudo();

        if ($is_tribu == 1) { /* Add By Nantenaina */
            
            $tributName  = $balise;

            $tribut->setTribuT($tribu_t_joined_info->name, $tribu_t_joined_info->description, $tribu_t_joined_info->logo_path, $tribu_t_joined_info->extension, $userPosterId,"tribu_t_joined", $tributName);

            $tribut->updateMember($balise, $userPosterId, 1);

            $userFullname = $tribut->getFullName($userPosterId);

            $content = $userFullname . " a accepté l'invitation de rejoindre la tribu " . $tributName;

            $type = "Invitation pour rejoindre la tribu " . $tributName;

            $requesting->setIsAccepted($tableRequestingName, $balise, intval($idR), $userPosterId);

            $requesting->setIsAccepted($tableRequestingNameOtherUser, $balise, intval($idR), $userPosterId);

            // $notificationService->sendForwardNotificationForUser($userPosterId, intval($idR), $type, $content);
            $notificationService->sendNotificationForOne($userPosterId, intval($idR), $type, $content);

            /* End Nantenaina */
        } else {
            $content = "$pseudo a accepté votre invitation pour devenir moderateur";
            $notificationService->sendNotificationForOne($userPosterId, intval($idR), "invitation", $content);
            $tableTribuGName = $tr->getTableNameTributG($userPosterId);

            $tr->changeRole($tableTribuGName, $userPosterId);

            $requesting->setIsAccepted($tableRequestingName, $balise, intval($idR), $userPosterId);
            $requesting->setIsAccepted($tableRequestingNameOtherUser, $balise, intval($idR), $userPosterId);
        }

        return $this->json("success");
    }


    /* Edited By Nantenaina */
    #[Route("/user/invitations/reject/{id}/{idR}/{balise}/{is_tribu}", name: "app_invitation_reject")]
    public function invitationReject(
        Status $status,
        RequestingService $requesting,
        $id,
        $idR,
        $balise,
        NotificationService $notificationService,
        TributGService $tr,
        UserRepository $userRepository,
        $is_tribu
    ): Response {
        $tableRequestingName = $this->getUser()->getTablerequesting();
        $userPoster = $this->getUser();
        $userPosterId = $userPoster->getId();
        $pseudo = $userPoster->getPseudo();
        $tableRequestingNameOtherUser = $userRepository->find($idR)->getTablerequesting();

        if ($is_tribu == 1) {/* Add By Nantenaina */

            $tribut = new Tribu_T_Service();
            $tribut->invitationCancelOrDelete($balise, $userPosterId);
            $requesting->setIsRejected($tableRequestingName, $balise, intval($idR), $userPosterId);
            $requesting->setIsRejected($tableRequestingNameOtherUser, $balise, intval($idR), $userPosterId);

            $type = "Invitation pour rejoindre la tribu " . $balise;

            $userFullname = $tribut->getFullName($userPosterId);

            $content = $userFullname . " a supprimée l'invitation de rejoindre la tribu " . $balise;

            // $notificationService->sendForwardNotificationForUser($userPosterId, intval($idR), $type, $content);
            $notificationService->sendNotificationForOne($userPosterId, intval($idR), $type, $content);

            /* End Nantenaina */
        } else {
            $content = "$pseudo a rejété votre invitation pour devenir moderateur";
            $notificationService->sendNotificationForOne($userPosterId, intval($idR), "invitation", $content);
            $requesting->setIsRejected($tableRequestingName,  $balise, intval($idR), $userPosterId);
            $requesting->setIsRejected($tableRequestingNameOtherUser, $balise, intval($idR), $userPosterId);
        }

        return $this->json("success");
    }


    /* Edited By Nantenaina */
    #[Route("/user/invitations/annule/{idTableRequest}/{idR}/{balise}/{is_tribu}", name: "app_invitation_annule")]
    public function invitationCancel(
        Status $status,
        RequestingService $requesting,
        $idTableRequest,
        $idR,
        $balise,
        NotificationService $notificationService,
        TributGService $tr,
        UserRepository $userRepository,
        $is_tribu
    ): Response {
        $tableRequestingName = $this->getUser()->getTablerequesting();
        //$requesting->setIsCancel($tableRequestingName, $idTableRequest, $this->getUser()->getId(), $idR);

        $tableRequestingNameOtherUser = $userRepository->find($idR)->getTablerequesting();
        //send notification
        $userPoster = $this->getUser();
        $userPosterId = $userPoster->getId();
        $pseudo = $userPoster->getPseudo();

        if ($is_tribu == 1) {/* Add By Nantenaina */
            $tribut = new Tribu_T_Service();
            $tribut->invitationCancelOrDelete($balise, intval($idR));
            $requesting->setIsCancel($tableRequestingName, $balise, $userPosterId, intval($idR));
            $requesting->setIsCancel($tableRequestingNameOtherUser, $balise, $userPosterId, intval($idR));

            /* End Nantenaina */
        } else {

            $content = "$pseudo a annulé votre invitation pour devenir moderateur";
            $notificationService->sendNotificationForOne($userPosterId, intval($idR), "demande", $content);
            $requesting->setIsCancel($tableRequestingName, $balise, $userPosterId, intval($idR));
            $requesting->setIsCancel($tableRequestingNameOtherUser, $balise, $userPosterId, intval($idR));
        }

        return $this->json("success");
    }


    #[Route("/user/invitation", name: "app_invitation")]

    public function invitation(Status $status, RequestingService $requesting): Response
    {
        $userConnected= $status->userProfilService($this->getUser());

        $statusProfile = $status->statusFondateur($this->getUser());

        $tableRequestingName = $this->getUser()->getTablerequesting();

        $invitations = $requesting->getAllRequest($tableRequestingName);



        return $this->render("user/invitation/invitation.html.twig", [
            "userConnected" => $userConnected,
            "profil" => $statusProfile["profil"],
            "statusTribut" => $statusProfile["statusTribut"],
            "invitations" => $invitations,
        ]);
    }



    #[Route("/user/invitation/all", name: "app_invitation_all")]

    public function showInvitation(Status $status): Response
    {

        $user = $this->getUser();

        $user_id = $user->getId();

        $tableName = "tablerequesting_" . $user_id;

        $requesting = new RequestingService();

        return $this->json($requesting->showInvitation($tableName));
    }



    #[Route("/user/demande/all", name: "app_demande_all")]

    public function showDemande(Status $status): Response
    {

        $user = $this->getUser();

        $user_id = $user->getId();

        $tableName = "tablerequesting_" . $user_id;

        $requesting = new RequestingService();

        return $this->json($requesting->showDemande($tableName));
    }

    #[Route('user/publication', name: 'publication_list')]

    public function publication(Status $status, Request $request, TributGService $tributGService): Response

    {
        $userConnected= $status->userProfilService($this->getUser());
        $user = $this->getUser();

        $user_id = $user->getId();

        $tribu_t = new Tribu_T_Service();

        $tribut_string = $tribu_t->fetchJsonDataTribuT($user_id);

        $tribut_tableau = json_decode($tribut_string);

        $publications = $tribu_t->fetchAllPublications($tribut_tableau, $user_id);

        $pubsFinale = array();

        if (count($publications) > 0)
            foreach ($publications as $pub) {
                array_push(
                    $pub,
                    $tribu_t->showRightTributName($pub["tribu"])["name"],
                    [
                        "reaction" => $tribu_t->getReaction($pub["tribu"] . "_reaction", $user_id, $pub["id"]),
                        "reaction_number" => $tribu_t->getReactionNumber($pub["tribu"] . "_reaction", $pub["id"]),
                        "commentaire_number" => $tribu_t->getCommentaireNumber($pub["tribu"] . "_commentaire", $pub["id"])
                    ]
                );
                array_push($pubsFinale, $pub);
            }

        //dd($pubsFinale);

        $userType = $user->getType();

        $profil = "";

        if ($userType == "consumer") {
            $profil = $this->entityManager->getRepository(Consumer::class)->findByUserId($user_id);
        } else {
            $profil = $this->entityManager->getRepository(Supplier::class)->findByUserId($user_id);
        }

        return $this->render('user/publication.html.twig', [
            "userConnected" => $userConnected,
            "profil" => $profil,
            "publication" => $pubsFinale,
            "statusTribut" => $tributGService->getStatusAndIfValid($profil[0]->getTributg(), $profil[0]->getIsVerifiedTributGAdmin(), $user_id)
        ]);
    }

    #[Route('/user/profil/add/photo', name: 'user_profil_add_photo')]

    public function userProfilAddPhoto(Request $request, Filesystem $filesyst): Response

    {

        $user = $this->getUser();

        $userId = $user->getId();

        $userType = $user->getType();

        $profil = null;

        $data = json_decode($request->getContent(), true);

        extract($data);

        $path = $this->getParameter('kernel.project_dir') . '/public/uploads/users/photos/photo_user_' . $userId . "/";

        $dir_exist = $filesyst->exists($path);

        if ($dir_exist == false) {

            $filesyst->mkdir($path, 0777);
        }

        if ($image != "") {

            // Function to write image into file

            $temp = explode(";", $image);

            $extension = explode("/", $temp[0])[1];

            // $imagename = md5($userId). '-' . uniqid() . "." . $extension;
            $imagename = time() . "." . $extension;

            if ($userType == "consumer") {

                $profil = $this->entityManager->getRepository(Consumer::class)->findByUserId($userId);
            } elseif ($userType == "supplier") {

                $profil = $this->entityManager->getRepository(Supplier::class)->findByUserId($userId);
            }

            ///save image in public/uploader folder

            file_put_contents($path . $imagename, file_get_contents($image));
        }

        // return $this->json("Photo ajouté avec succès !");

        return $this->json([
            "success" => true,
            "message" => "Photo ajouté avec succès!"
        ], 200);
        
    }

    #[Route('/user/profil/update/avatar', name: 'update_avatar_user')]

    public function updateUserAvatar(Request $request, Filesystem $filesyst): Response

    {



        $user = $this->getUser();



        $userId = $user->getId();



        $userType = $user->getType();



        $profil = null;



        $data = json_decode($request->getContent(), true);



        extract($data);



        // $path = $this->getParameter('kernel.project_dir') . '/public/uploads/users/photos/';

        $path = $this->getParameter('kernel.project_dir') . '/public/uploads/users/photos/photo_user_' . $userId . "/";

        $dir_exist = $filesyst->exists($path);

        if ($dir_exist === false) {

            $filesyst->mkdir($path, 0777);
        }



        if ($image != "") {



            // Function to write image into file

            $temp = explode(";", $image);

            $extension = explode("/", $temp[0])[1];

            $imagename = md5($userId) . '-' . uniqid() . "." . $extension;



            if ($userType == "consumer") {

                $profil = $this->entityManager->getRepository(Consumer::class)->findByUserId($userId);
            } elseif ($userType == "supplier") {

                $profil = $this->entityManager->getRepository(Supplier::class)->findByUserId($userId);
            }



            $profil[0]->setPhotoProfil('/public/uploads/users/photos/photo_user_' . $userId . "/" . $imagename);



            $this->entityManager->flush();

            

            ///save image in public/uploader folder

            file_put_contents($path . $imagename, file_get_contents($image));
        }

        return $this->json([
            "success" => true,
            "message" => "Photo de profil bien à jour!"
        ], 200);

        // return $this->json("Photo de profil bien à jour");
    }

    #[Route('/user/reception', name: 'user_boit_reception')]
    public function boiteReception(  Status $status,): Response
    {

        $userConnected= $status->userProfilService($this->getUser());
        return $this->render('user/boitDeReception/index.html.twig', [
            "userConnected" => $userConnected,
        ]);
    }

  
    /** UPDATE PASSWORD */
    /*
    #[Route("/user/update/password", name : "update_password_on_dev")]

    public function update_password_on_dev(UserRepository $userRepository, UserPasswordHasherInterface $passwordHasher)
    {
        $user = $userRepository->find(1);
        $user->setPassword("1234@azer");
        $hashedPassword = $passwordHasher->hashPassword(
            $user,
            $user->getPassword()
        );
        $user->setPassword($hashedPassword);
        $this->entityManager->flush();
        return $this->json($user);
    }*/

    /*#[Route("/user/get/email", name : "check_email_on_dev")]
    public function update_password_on_dev(UserRepository $userRepository, UserPasswordHasherInterface $passwordHasher, RouterInterface $router)
    {
        $user = $userRepository->findOneBy(["email" => "nantenainageomada@gmail.com"]);
        $result = false;
        $user ? $result = true : $result = false;
        $url = $router->generate('app_login', ['email' => "nantenainageomada@gmail.com"], UrlGeneratorInterface::ABSOLUTE_URL);
        //return $this->json($result);
        //return $this->json(["url"=>$url]);
        return $this->json($user->getId());
    }*/

    #[Route('/user/publication/tribu/update/visibility', name: 'update_visibility')]
    public function updateVisibility(Request $request, Tribu_T_Service $tribut): Response
    {
        $data = json_decode($request->getContent(), true);
        $tablePub = $data["tablePub"];
        $pub_id = $data["pub_id"];
        $confidentialite = $data["confidentialite"];
        
        $tribut->updateVisibility($tablePub, $pub_id, $confidentialite);

        return $this->json("Visibilité bien à jour");

    }


    #[Route('/user/publication/tribu/delete', name: 'delete_publication', methods: ['POST'])]
    public function deletePublication(Request $request, Tribu_T_Service $tribut): Response
    {
        $data = json_decode($request->getContent(), true); 
        $tablePub = $data["tablePub"];
        $pub_id = $data["pub_id"];

        // $tablePub = "tribug_01_centre_et_est_belley_publication";
        // $pub_id = 31;

        $publication= $tribut->getOnePublication($tablePub, $pub_id);
        // dd($publication);

        if( !$publication ||  $publication['user_id'] !== $this->getUser()->getId()){
            return $this->json(["success" => false, 
                "message" => "Vous n'avez pas le droit de supprimée cette publication."
            ], 403 );
        }

        if( $publication["photo"] !== null &&  $publication["photo"] !== "" ){
            $filesystem = new Filesystem();
            if($filesystem->exists($this->getParameter('kernel.project_dir') . $publication['photo'])){
                $filesystem->remove($this->getParameter('kernel.project_dir') . $publication['photo']);
            }
        }

        $tribut->removePublicationOrCommentaire($tablePub, $pub_id);

        return $this->json([
            "success" => true,
            "message" => "Publication supprimée!"
        ], 200);
    }


    #[Route('/user/publication/tribu/comment', name: 'all_comment_publication', methods: ["POST"])]
    public function getCommentPublication(Request $request, Tribu_T_Service $tribut): Response
    {
        $data = json_decode($request->getContent(), true);
        $tablePub = $data["tablePub"];
        $pub_id = $data["pub_id"];
        $comments= [];
        
        $comments= $tribut->getCommentsPublication($tablePub, $pub_id);

        return $this->json([
            "success" => true,
            "comments" => $comments
        ], 200);
    }
    
    #[Route('/user/publication/tribu/push_comment', name: 'push_comment', methods: ["POST"])]
    public function pushComment(
        Request $request,
        TributGService $tribut,
        NotificationService $notificationService
    ): Response
    {
        $data = json_decode($request->getContent(), true);
        extract($data); /// $tablePub, $pubID, $authorID, $comment, $audioname

        $result = $tribut->handlePublicationCommentUpdate(
            $tablePub,
            $this->getUser()->getId(),
            $pubID,
            $comment,
            $audioname
        );

        $full_name = $tribut->getFullName($this->getUser()->getId());

        if (intval($this->getUser()->getId()) != intval($authorID)) {

            $notificationService->sendNotificationForOne(
                $this->getUser()->getId(),
                $authorID,
                "Comment publication.",
                $full_name . " a commenté votre publication."
            );
        }

        return $this->json([
            "success" => true,
        ], 200);
    }

    #[Route('/user/setpdp', name: 'app_setpdp_user', methods: ["POST"])]
    public function setAsPdp(Request $request){

        $user = $this->getUser();

        $userId = $user->getId();

        $userType = $user->getType();

        $profil = null;

        $data = json_decode($request->getContent(), true);

        extract($data);

        if ($userType == "consumer") {

            $profil = $this->entityManager->getRepository(Consumer::class)->findByUserId($userId);
        } elseif ($userType == "supplier") {

            $profil = $this->entityManager->getRepository(Supplier::class)->findByUserId($userId);
        }

        $profil[0]->setPhotoProfil($image_path);

        $this->entityManager->flush();

        return $this->json([
            "success" => true,
        ], 200);

    }

    #[Route("/user/liste/demande/partenariat", name:"app_liste_demande_partenaire", methods:["GET"])]
    public function getListeDemandePartenariat(
        SupplierRepository $suplierRepo,
        SerializerInterface $serializerInterface
    ){
        $fields = $suplierRepo->findBy(
            ['isVerifiedTributGAdmin' => false]
        );
        $json = $serializerInterface->serialize($fields, 'json');
        return new JsonResponse($json, Response::HTTP_OK, [], true);
    }
}