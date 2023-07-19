<?php



namespace App\Controller;



use PDO;

use App\Service\Status;

use App\Entity\Consumer;

use App\Entity\Supplier;

use App\Service\UserService;

use App\Form\PublicationType;

use App\Form\UserSettingType;

use App\Service\TributGService;

use App\Service\Tribu_T_Service;

use App\Repository\UserRepository;

use App\Service\RequestingService;

use Proxies\__CG__\App\Entity\User;

use Symfony\Component\Routing\RouterInterface;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

use App\Service\NotificationService;

use App\Service\PDOConnexionService;

use App\Repository\ConsumerRepository;

use App\Repository\SupplierRepository;

use App\Repository\FermeGeomRepository;

use Doctrine\ORM\EntityManagerInterface;

use Symfony\Component\Filesystem\Filesystem;

use Symfony\Component\HttpFoundation\Request;

use Symfony\Component\HttpFoundation\Response;

use Symfony\Component\Routing\Annotation\Route;

use Symfony\Component\HttpFoundation\StreamedResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class UserController extends AbstractController

{



    private $entityManager;



    public function __construct(EntityManagerInterface $entityManager)
    {

        $this->entityManager = $entityManager;
    }


    #[Route("/user/actualite", name: "app_actualite")]
    public function Actualite(): Response
    {
        return $this->render("user/actualite.html.twig");
    }



 
    #[Route("/user/account", name: "app_account")]

    public function Account(

        Request $request,

        EntityManagerInterface $entityManager,

        TributGService $tributGService

    ): Response {

        $user = $this->getUser();

        $userType = $user->getType();

        $userId = $user->getId();

        $profil = "";

        if ($userType == "consumer") {

            $profil = $entityManager->getRepository(Consumer::class)->findByUserId($userId);
        } else {

            $profil = $entityManager->getRepository(Supplier::class)->findByUserId($userId);
        }


        $new_publication = $this->createForm(PublicationType::class);



        $new_publication->handleRequest($request);



        $flash = [];



        if ($new_publication->isSubmitted() && $new_publication->isValid()) {



            $publication = $new_publication['legend']->getData();

            $confid = $new_publication['confidentiality']->getData();

            $photo = $new_publication['photo']->getData();

            $newFilename = "";



            if ($publication && $confid) {



                if ($photo) {

                    $destination = $this->getParameter('kernel.project_dir') . '/public/uploads/tribu_g/photos/' . $profil[0]->getTributG();

                    $originalFilename = pathinfo($photo->getClientOriginalName(), PATHINFO_FILENAME);

                    $newFilename = $profil[0]->getTributG() . "/" . md5($originalFilename) . '-' . uniqid() . '.' . $photo->guessExtension();

                    $photo->move(

                        $destination,

                        $newFilename

                    );
                }



                $tributGService->createOnePub($profil[0]->getTributG() . "_publication", $userId, $publication, $confid, $newFilename);
            }



            return $this->redirect($request->getUri());
        }

        
        return $this->render("tribu_g/account.html.twig", [

            "profil" => $profil,

            "statusTribut" => $tributGService->getStatusAndIfValid($profil[0]->getTributg(), $profil[0]->getIsVerifiedTributGAdmin(), $userId),

            "tributG" => [
                "table" => $profil[0]->getTributg(),

                "profil" => $tributGService->getProfilTributG(

                    $profil[0]->getTributg(),

                    $userId

                ),

                "publications" => $tributGService->getAllPublications($profil[0]->getTributg()),

            ],

            "new_publication" => $new_publication->createView()

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

            $constent = $profil[0]->getFirstName() . " " . $profil[0]->getLastName() . "<a href='/ferme/departement/" . $req["departeName"] .

                "/" . $req["numDeparte"] . "/details/" . $req["id"] . "'>vient de modifier des informations sur son établissement</a>";
        } else if ($req["ask"] == "create") {

            $constent = $profil[0]->getFirstName() . " " . $profil[0]->getLastName() . "<a href='/ferme/departement/" . $req["departeName"] .

                "/" . $req["numDeparte"] . "/details/" . $req["id"] . "'>vient de créer une nouvelle établissement</a>";
        }



        $notificationService->sendNotificationForMany($userId, $allUsers, "nouvelle etablissement", $constent);

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

        $content = $profilPoster[0]->getFirstName() . " " . $profilPoster[0]->getLastName() . "<a href='/user/invitation'>vient de vous envoyer une invitation pour devenir modérateur</a>";



        $notificationService->sendNotificationForOne(

            $userPosterId,

            $id_receiver,

            "invitation",

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

        Request $request,

        ConsumerRepository $consumerRepository,

        SupplierRepository $supplierRepository

    ): Response {

        if ($this->getUser()) {

            if ($this->getUser()->getType() === "consumer") {

                $profil = $consumerRepository->findOneBy(["user" => $this->getUser()->getId()]);
            } else {

                $profil = $supplierRepository->findOneBy(["user" => $this->getUser()->getId()]);
            }
        } else {

            return $this->redirectToRoute("app_connexion");
        }



        $form = $this->createForm(UserSettingType::class);

        $flash = [];



        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {

            dd($form->getData());
        }



        return $this->render("user/settingAccount.html.twig", [

            "form_setting" => $form->createView(),

            "flash" => $flash,

            "firstname" => $profil->getFirstname(),

            "lastname" => $profil->getLastname()

        ]);
    }

    #[Route('/user/profil', name: 'user_profil')]

    public function index(): Response

    {
        return $this->render('user/profil.html.twig');
    }





    // #[Route('/user/profil/{user_id}', name: 'user_profil')]

    // public function index($user_id, EntityManagerInterface $entityManager, TributGService $tributGService): Response

    // {



    //     $user = $this->getUser();

    //     $userId = $user->getId();

    //     $myuserType = $user->getType();

    //     $myProfil = null;



    //     if ($myuserType == "consumer") {

    //         $myProfil = $entityManager->getRepository(Consumer::class)->findByUserId($userId);
    //     } elseif ($myuserType == "supplier") {

    //         $myProfil = $entityManager->getRepository(Supplier::class)->findByUserId($userId);
    //     }






    //     $tribu_t = new Tribu_T_Service();



    //     $userType = $tribu_t->getTypeUser($user_id);



    //     $profil = null;



    //     $type = "";



    //     if ($userType == "consumer") {

    //         $type = "Consommateur";

    //         $profil = $entityManager->getRepository(Consumer::class)->findByUserId($user_id);
    //     } elseif ($userType == "supplier") {

    //         $type = "Fournisseur";

    //         $profil = $entityManager->getRepository(Supplier::class)->findByUserId($user_id);
    //     }

    //     $path = $this->getParameter('kernel.project_dir') . '/public/uploads/users/photos/photo_user_' . $user_id . "/";

    //     $images = glob($path . "*.*");

    //     $images_trie = [];

    //     for ($i = count($images) - 1; $i >= 0; $i--) {
    //         # code...
    //         array_push($images_trie, $images[$i]);
    //     }

    //     $nombre_partisant = $tributGService->getCountPartisant($profil[0]->getTributG());


    //     return $this->render('user/profil.html.twig', [

    //         "profil" => $myProfil,

    //         "autre_profil" => $profil,

    //         "type" => $type,

    //         "images" => $images_trie,

    //         "statusTribut" => $tributGService->getStatusAndIfValid(

    //             $profil[0]->getTributg(),

    //             $profil[0]->getIsVerifiedTributGAdmin(),

    //             $user_id

    //         ),

    //         "tributG" => [
    //             "table" => $profil[0]->getTributg(),

    //             "profil" => $tributGService->getProfilTributG(
    //                 $profil[0]->getTributg(),
    //                 $user_id
    //             ),
    //         ],

    //         "nombre_partisant" => $nombre_partisant

    //     ]);
    // }



    #[Route('/user/dashboard', name: 'app_dashboard')]
    public function Dashboard(
        EntityManagerInterface $entityManager,
        TributGService $tributGService

    ): Response {

        $user = $this->getUser();
        $userType = $user->getType();
        $userId = $user->getId();
        $profil = "";

        if ($userType == "consumer") {
            $profil = $entityManager->getRepository(Consumer::class)->findByUserId($userId);
        } else {
            $profil = $entityManager->getRepository(Supplier::class)->findByUserId($userId);
        }

        return $this->render("user/dashboard_super_admin/dashboard.html.twig", [

            "profil" => $profil,
            "statusTribut" => $tributGService->getStatusAndIfValid(
                $profil[0]->getTributg(),
                $profil[0]->getIsVerifiedTributGAdmin(),
                $userId
            )
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





    #[Route('/user/dashboard-membre', name: 'app_dashboardmembre')]

    public function DashboardMembre(

        Request $request,

        EntityManagerInterface $entityManager,

        TributGService $tributGService,

        UserRepository $userRepository,

        ConsumerRepository $consumerRepository,

        SupplierRepository $supplierRepository

    ): Response {



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

        Request $request,

        EntityManagerInterface $entityManager,

        TributGService $tributGService,

        UserRepository $userRepository,

        ConsumerRepository $consumerRepository,

        SupplierRepository $supplierRepository

    ): Response {

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

            $message_notification = "Nous vous informons que l'administrateur de cette plateforme a valider que votre rôle en tant qu'administrateur dans notre tribu G." .

                "<br/> <a class='d-block w-50 mx-auto mt-3 btn btn-primary text-center' href='/user/dashboard-fondateur' alt='Administration tributG'>Voir</a>";
        }



        $entityManagerInterface->persist($profil);

        $entityManagerInterface->flush();



        ////send notification to the fondateur tributG

        $admin = $userRepository->findByRolesUserSuperAdmin();

        $type = "Validation d'administrer le tribu G";



        // $notificationService->sendNotificaticationValidationTribug(

        //     $admin->getId(),  ///// id super admin

        //     intVal($user_id), ///// id fondateur

        //     intVal($value) === 1 ? true : false

        // );

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

        UserRepository $userRepository,

        TributGService $tributGService,

        EntityManagerInterface $entityManager,

        UserService $userService

    ): Response {

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

        EntityManagerInterface $entityManager,

        TributGService $tributGService

    ): Response {

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

        $r = $tributGService->undoBanishePartisant($table_tribut, $user_id_to_control);

        return $this->json(["success" => $r], 200);
    }



    #[Route("/user/dashboard-membre-apropos-fondateur", name: "app_dashboardapropos_fondateur")]

    public function DashboardMembreAproposFondateur(

        Request $request,

        EntityManagerInterface $entityManager,

        TributGService $tributGService,

        UserRepository $userRepository,

        ConsumerRepository $consumerRepository,

        SupplierRepository $supplierRepository,

    ): Response {

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

    ) {

        /// [ { "notif_id": "1"}, { "user_id":2 } , ... ]

        $data = json_decode($request->getContent(), true);



        ///get the name the table notification from the user.

        $table = $this->getUser()->getTablenotification();



        ////set notif to already show

        $notificationService->setShowNotif($table, $data);



        return $this->json(true);
    }



    #[Route("/user/notification/read", name: "app_read_notification")]

    public function readNotification(

        Request $request,

        NotificationService $notificationService,

        UserRepository $userRepository

    ) {

        $notification_id = $request->query->get("notif_id");

        $table = $this->getUser()->getTablenotification();

        $singleNotification = $notificationService->updateNotificationIsread($notification_id, $this->getUser()->getId());

        return $this->json([
            "result" => "success"
        ]);
    }





    #[Route("/user/administration/fournisseur", name: "app_administre_fournisseur")]

    public function adminFournisseur(

        EntityManagerInterface $entityManager,

        UserRepository $userRepository,

        SupplierRepository $supplierRepository,

        TributGService $tributGService



    ): Response {

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

    public function dashboardSettingValidation(Request $request)

    {

        return $this->render("user/dashboard_fondateur/SettingAdminFondateur.html.twig");
    }



    #[Route("/user/account/dashboard-fondateur/list-publication", name: "app_fondateur_list_publication")]

    public function dashboardListPublication(

        EntityManagerInterface $entityManager,

        TributGService $tributGService,

        UserRepository $userRepository,

        ConsumerRepository $consumerRepository,

        SupplierRepository $supplierRepository,

        Request $request

    ): Response {

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





        return $this->render(

            "user/dashboard_fondateur/listDePublication.html.twig",
            [

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

        EntityManagerInterface $entityManager,

        UserRepository $userRepository,

        SupplierRepository $supplierRepository,

        TributGService $tributGService

    ): Response {

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

        EntityManagerInterface $entityManager,

        TributGService $tributGService,

        FermeGeomRepository $fermeGeomRepository

    ): Response {

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
        Tribu_T_Service $tribut
    ): Response {

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

            $tribut->setTribuT($tribu_t_joined_info->name, $tribu_t_joined_info->description, $tribu_t_joined_info->logo_path, $tribu_t_joined_info->extension, $userPosterId,"tribu_t_joined");

            $tribut->updateMember($balise, $userPosterId, 1);

            $userFullname = $tribut->getFullName($userPosterId);

            $content = $userFullname . " a accepté l'invitation de rejoindre la tribu " . $tributName;

            $type = "Invitation pour rejoindre la tribu " . $tributName;

            $requesting->setIsAccepted($tableRequestingName, $balise, intval($idR), $userPosterId);

            $requesting->setIsAccepted($tableRequestingNameOtherUser, $balise, intval($idR), $userPosterId);

            $notificationService->sendForwardNotificationForUser($userPosterId, intval($idR), $type, $content);


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

            $notificationService->sendForwardNotificationForUser($userPosterId, intval($idR), $type, $content);

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

        $statusProfile = $status->statusFondateur($this->getUser());

        $tableRequestingName = $this->getUser()->getTablerequesting();

        $invitations = $requesting->getAllRequest($tableRequestingName);



        return $this->render("user/invitation/invitation.html.twig", [

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

    public function publication(Request $request, TributGService $tributGService): Response

    {
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

        return $this->json("Photo ajouté avec succès !");
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



        return $this->json("Photo de profil bien à jour");
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
}