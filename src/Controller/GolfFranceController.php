<?php

namespace App\Controller;

use App\Service\Status;
use App\Service\UserService;
use App\Entity\AvisGolf;
use App\Entity\GolfFinished;
use App\Service\MessageService;
use App\Service\TributGService;
use App\Repository\UserRepository;
use App\Service\GolfFranceService;
use App\Service\NotificationService;
use App\Repository\AvisGolfRepository;
use App\Repository\GolfFranceRepository;
use Doctrine\ORM\EntityManagerInterface;
use App\Repository\DepartementRepository;
use App\Repository\GolfFinishedRepository;
use App\Service\Tribu_T_Service;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Filesystem\Filesystem;

class GolfFranceController extends AbstractController
{
    #[Route('/golf', name: 'app_golf_france')]
    public function index(
        Status $status,
        DepartementRepository $departementRepository,
        TributGService $tributGService,
        UserRepository $userRepository,
        EntityManagerInterface $entityManager,
        GolfFranceRepository $golfFranceRepository,
        // MessageService $messageService
    ): Response
    {
        ///current user connected
        $user = $this->getUser();
        $userConnected = $status->userProfilService($this->getUser());

        // return $this->redirectToRoute("restaurant_all_dep");
        $statusProfile = $status->statusFondateur($user);

        ///////GET PROFIL THE USER IN SAME TRIBUT G WITH ME////////////////////////////////
        ///to contains profil user information [ [ id => ..., photo => ..., email => ..., firstname => ..., lastname => ..., image_profil => ..., last_message => ..., is_online => ... ], ... ]
        // $amis_in_tributG = $messageService->getListAmisToChat($user, $tributGService, $entityManager, $userRepository);
        $amis_in_tributG = [];

        if ($user && $user->getType() != "Type") {
            // ////profil user connected
            $profil = $tributGService->getProfil($user, $entityManager);

            $id_amis_tributG = $tributGService->getAllTributG($profil[0]->getTributG());  /// [ ["user_id" => ...], ... ]

            ///to contains profil user information
            foreach ($id_amis_tributG  as $id_amis) { /// ["user_id" => ...]

                ///check their type consumer of supplier
                $user_amis = $userRepository->find(intval($id_amis["user_id"]));

                if ($user_amis) {
                    $profil_amis = $tributGService->getProfil($user_amis, $entityManager)[0];
                    ///single profil
                    $amis = [
                        "id" => $id_amis["user_id"],
                        "photo" => $profil_amis->getPhotoProfil(),
                        "email" => $user_amis->getEmail(),
                        "firstname" => $profil_amis->getFirstname(),
                        "lastname" => $profil_amis->getLastname(),
                        "image_profil" => $profil_amis->getPhotoProfil(),
                        "is_online" => $user_amis->getIsConnected(),
                    ];

                    ///get it
                    array_push($amis_in_tributG, $amis);
                }
            }
        }

        return $this->render('golf/index.html.twig', [
            'number_of_departement' => $golfFranceRepository->getCount(),
            "profil" => $statusProfile["profil"],
            "departements" => $departementRepository->getDep(),
            "amisTributG" => $amis_in_tributG,
            "userConnected" => $userConnected,
        ]);
    }
    #[Route('/golf-mobile', name: 'app_golf_mobile_france')]
    public function indexMob(
        Status $status,
        DepartementRepository $departementRepository,
        GolfFranceRepository $golfFranceRepository
    ): Response {

        $statusProfile = $status->statusFondateur($this->getUser());
        $userConnected = $status->userProfilService($this->getUser());


        return $this->render('shard/golf/golf_navleft_mobile.twig', [
            'number_of_departement' => $golfFranceRepository->getCount(),
            "profil" => $statusProfile["profil"],
            "userConnected" => $userConnected,
            "departements" => $departementRepository->getDep(),
        ]);
    }

    #[Route('/api/golf', name: 'api_golf_france', methods: ["GET", "POST"])]
    public function allGolfFrance(
        Request $request,
        GolfFranceRepository $golfFranceRepository,
        AvisGolfRepository $avisGolfRepository,
        GolfFranceService $golfFranceService,
    ) {

        $golfs = [];
        $userID = ($this->getUser()) ? $this->getUser()->getId() : null;

        if($request->query->has("minx") && $request->query->has("miny") ){

            $minx = $request->query->get("minx");
            $maxx = $request->query->get("maxx");
            $miny = $request->query->get("miny");
            $maxy = $request->query->get("maxy");

            $datas = $golfFranceRepository->getDataBetweenAnd($minx, $miny, $maxx, $maxy);
            
            $ids=array_map('App\Service\SortResultService::getIdFromData', $datas);
            $moyenneNote = $avisGolfRepository->getAllNoteById($ids);

            $golfs= $golfFranceService->mergeDatasAndAvis($datas, $moyenneNote);

            return $this->json([ "success" => true, "data" => $golfs ], 200);
        }

        $data = $golfFranceRepository->getSomeDataShuffle($userID);

        
        $ids=array_map('App\Service\SortResultService::getIdFromData', $data);
        $moyenneNote = $avisGolfRepository->getAllNoteById($ids);

        $golfs= $golfFranceService->mergeDatasAndAvis($data, $moyenneNote);

        return $this->json([
            "success" => true,
            "data" => $golfs,
        ], 200);
    }


    #[Route('/golf/departement/{nom_dep}/{id_dep}', name: 'golf_dep_france', methods: ["GET", "POST"])]
    public function specifiqueDepartement(
        $nom_dep,
        $id_dep,
        GolfFranceRepository $golfFranceRepository,
        Status $status,
        TributGService $tributGService,
        UserRepository $userRepository,
        EntityManagerInterface $entityManager,
        Filesystem $filesyst,
    ){

        ///current user connected
        $user = $this->getUser();
        $userConnected = $status->userProfilService($this->getUser());
        $userID = ($user) ? $user->getId() : null;
        // return $this->redirectToRoute("restaurant_all_dep");
        $statusProfile = $status->statusFondateur($user);

        ///////GET PROFIL THE USER IN SAME TRIBUT G WITH ME////////////////////////////////
        ///to contains profil user information [ [ id => ..., photo => ..., email => ..., firstname => ..., lastname => ..., image_profil => ..., last_message => ..., is_online => ... ], ... ]
        // $amis_in_tributG = $messageService->getListAmisToChat($user, $tributGService, $entityManager, $userRepository);
        $amis_in_tributG = [];

        if ($user && $user->getType() != "Type") {

            // ////profil user connected
            $profil = $tributGService->getProfil($user, $entityManager);

            $id_amis_tributG = $tributGService->getAllTributG($profil[0]->getTributG());  /// [ ["user_id" => ...], ... ]

            ///to contains profil user information
            foreach ($id_amis_tributG  as $id_amis) { /// ["user_id" => ...]

                ///check their type consumer of supplier
                $user_amis = $userRepository->find(intval($id_amis["user_id"]));

                if ($user_amis) {
                    $profil_amis = $tributGService->getProfil($user_amis, $entityManager)[0];
                    ///single profil
                    $amis = [
                        "id" => $id_amis["user_id"],
                        "photo" => $profil_amis->getPhotoProfil(),
                        "email" => $user_amis->getEmail(),
                        "firstname" => $profil_amis->getFirstname(),
                        "lastname" => $profil_amis->getLastname(),
                        "image_profil" => $profil_amis->getPhotoProfil(),
                        "is_online" => $user_amis->getIsConnected(),
                    ];

                    ///get it
                    array_push($amis_in_tributG, $amis);
                }
            }
        }

        $golfs = $golfFranceRepository->getGolfByDep($nom_dep, $id_dep, $userID);

        for($i=0; $i<count($golfs);$i++){
            $g = $golfs[$i];
            $photo = $this->getPhotoPreviewResto("golf",$filesyst, $g["id"]);
            $golfs[$i]["photo"] = $photo;
            
        }


        return $this->render("golf/specific_departement.html.twig", [

            "id_dep" => $id_dep,

            "nom_dep" => $nom_dep,

            "type" => "golf",

            "golfs" => $golfs,

            "nomber_golf" => $golfFranceRepository->getCount($nom_dep, $id_dep),

            "profil" => $statusProfile["profil"],

            "statusTribut" => $statusProfile["statusTribut"],

            "amisTributG" => $amis_in_tributG,

            "userConnected" => $userConnected,
        ]);
    }


    /**
     * @Route("/golf_in_peripherique", name="golf_in_peripherique", methods={"GET"})
     */
    public function getPeripheriqueData(
        Request $request, 
        GolfFranceRepository $golfFranceRepository
    ){
        if($request->query->has("minx") && $request->query->has("miny") ){
            
            $dep = ( $request->query->get("dep")) ?  $request->query->get("dep") : null;
            $nom_dep = ( $request->query->get("nom_dep")) ?  $request->query->get("nom_dep") : null;

            $minx = $request->query->get("minx");
            $maxx = $request->query->get("maxx");
            $miny = $request->query->get("miny");
            $maxy = $request->query->get("maxy");

            $data= $golfFranceRepository->getDataBetweenAnd($minx, $miny, $maxx, $maxy, $nom_dep, $dep, 200);

            return $this->json(["data" => $data]);
        }

        return $this->json([]);
    }

    #[Route('/golf-mobile/departement/{nom_dep}/{id_dep}/{limit}/{offset}', name: 'golf_dep_france_mobile', methods: ["GET", "POST"])]
    public function specifiqueDepartementMobile(
        $nom_dep,
        $id_dep,
        $limit,
        $offset,
        GolfFranceRepository $golfFranceRepository,
        Status $status,
        TributGService $tributGService,
        UserRepository $userRepository,
        EntityManagerInterface $entityManager,
        MessageService $messageService
    ) {

        ///current user connected
        $user = $this->getUser();
        $userConnected = $status->userProfilService($this->getUser());
        $userID = ($user) ? $user->getId() : null;
        // return $this->redirectToRoute("restaurant_all_dep");
        $statusProfile = $status->statusFondateur($user);

        ///////GET PROFIL THE USER IN SAME TRIBUT G WITH ME////////////////////////////////
        ///to contains profil user information [ [ id => ..., photo => ..., email => ..., firstname => ..., lastname => ..., image_profil => ..., last_message => ..., is_online => ... ], ... ]
        // $amis_in_tributG = $messageService->getListAmisToChat($user, $tributGService, $entityManager, $userRepository);
        $amis_in_tributG = [];

        if ($user && $user->getType() != "Type") {

            // ////profil user connected
            $profil = $tributGService->getProfil($user, $entityManager);

            $id_amis_tributG = $tributGService->getAllTributG($profil[0]->getTributG());  /// [ ["user_id" => ...], ... ]

            ///to contains profil user information
            foreach ($id_amis_tributG  as $id_amis) { /// ["user_id" => ...]

                ///check their type consumer of supplier
                $user_amis = $userRepository->find(intval($id_amis["user_id"]));

                if ($user_amis) {
                    $profil_amis = $tributGService->getProfil($user_amis, $entityManager)[0];
                    ///single profil
                    $amis = [
                        "id" => $id_amis["user_id"],
                        "photo" => $profil_amis->getPhotoProfil(),
                        "email" => $user_amis->getEmail(),
                        "firstname" => $profil_amis->getFirstname(),
                        "lastname" => $profil_amis->getLastname(),
                        "image_profil" => $profil_amis->getPhotoProfil(),
                        "is_online" => $user_amis->getIsConnected(),
                    ];

                    ///get it
                    array_push($amis_in_tributG, $amis);
                }
            }
        }

        return $this->json([

            "id_dep" => $id_dep,

            "nom_dep" => $nom_dep,

            "type" => "golf",

            "golf" => $golfFranceRepository->getGolfByDepMobile($nom_dep, $id_dep, $userID, $limit, $offset),

            "nomber_golf" => $golfFranceRepository->getCount($nom_dep, $id_dep),

            "profil" => $statusProfile["profil"],

            "statusTribut" => $statusProfile["statusTribut"],

            "amisTributG" => $amis_in_tributG,

            "userConnected" => $userConnected,
        ]);
    }


    #[Route('/golf-mobile/departement/{nom_dep}/{id_dep}/{id_golf}', name: 'golf_dep_france_search_mobile', methods: ["GET", "POST"])]
    public function specifiqueDepartementSearchMobile(
        $nom_dep,
        $id_dep,
        $id_golf,
        GolfFranceRepository $golfFranceRepository,
        Status $status,
        TributGService $tributGService,
        UserRepository $userRepository,
        EntityManagerInterface $entityManager,
        MessageService $messageService
    ) {

        ///current user connected
        $user = $this->getUser();
        $userConnected = $status->userProfilService($this->getUser());
        $userID = ($user) ? $user->getId() : null;
        // return $this->redirectToRoute("restaurant_all_dep");
        $statusProfile = $status->statusFondateur($user);

        ///////GET PROFIL THE USER IN SAME TRIBUT G WITH ME////////////////////////////////
        ///to contains profil user information [ [ id => ..., photo => ..., email => ..., firstname => ..., lastname => ..., image_profil => ..., last_message => ..., is_online => ... ], ... ]
        // $amis_in_tributG = $messageService->getListAmisToChat($user, $tributGService, $entityManager, $userRepository);
        $amis_in_tributG = [];

        if ($user && $user->getType() != "Type") {

            // ////profil user connected
            $profil = $tributGService->getProfil($user, $entityManager);

            $id_amis_tributG = $tributGService->getAllTributG($profil[0]->getTributG());  /// [ ["user_id" => ...], ... ]

            ///to contains profil user information
            foreach ($id_amis_tributG  as $id_amis) { /// ["user_id" => ...]

                ///check their type consumer of supplier
                $user_amis = $userRepository->find(intval($id_amis["user_id"]));

                if ($user_amis) {
                    $profil_amis = $tributGService->getProfil($user_amis, $entityManager)[0];
                    ///single profil
                    $amis = [
                        "id" => $id_amis["user_id"],
                        "photo" => $profil_amis->getPhotoProfil(),
                        "email" => $user_amis->getEmail(),
                        "firstname" => $profil_amis->getFirstname(),
                        "lastname" => $profil_amis->getLastname(),
                        "image_profil" => $profil_amis->getPhotoProfil(),
                        "is_online" => $user_amis->getIsConnected(),
                    ];

                    ///get it
                    array_push($amis_in_tributG, $amis);
                }
            }
        }

        return $this->json([

            "id_dep" => $id_dep,

            "nom_dep" => $nom_dep,

            "type" => "golf",

            "golf" => $golfFranceRepository->getGolfByDepSearchMobile($nom_dep, $id_dep, $userID, $id_golf),

            "nomber_golf" => $golfFranceRepository->getCount($nom_dep, $id_dep),

            "profil" => $statusProfile["profil"],

            "statusTribut" => $statusProfile["statusTribut"],

            "amisTributG" => $amis_in_tributG,

            "userConnected" => $userConnected,
        ]);
    }


    #[Route('/api/golf/departement/{nom_dep}/{id_dep}', name: 'api_golf_dep_france', methods: ["GET", "POST"])]
    public function api_specifiqueDepartement(
        $nom_dep,
        $id_dep,
        GolfFranceRepository $golfFranceRepository,
        AvisGolfRepository $avisGolfRepository,
        GolfFranceService $golfFranceService,
        Status $status,
        TributGService $tributGService,
        UserRepository $userRepository,
        EntityManagerInterface $entityManager,
    ) {
        $data = [];
        $userID = ($this->getUser()) ? $this->getUser()->getId() : null;

        $data = $golfFranceRepository->getGolfByDep($nom_dep, $id_dep, $userID);

        $ids=array_map('App\Service\SortResultService::getIdFromData', $data);
        $moyenneNote = $avisGolfRepository->getAllNoteById($ids);

        $golfs= $golfFranceService->mergeDatasAndAvis($data, $moyenneNote);

        return $this->json([
            "success" => true,
            "data" => $golfs,
            "message" => "Ok"
        ], 200);
    }

    #[Route("/api/golf/one_data/{golfID}" , name:"api_one_data_golf" , methods:"GET" )]
    public function getOneDataGolf(
        $golfID,
        GolfFranceRepository $golfFranceRepository,
        AvisGolfRepository $avisGolfRepository,
    ){
        ///current user connected
        $user = $this->getUser();
        $userID = ($user) ? intval($user->getId()) : null;

        $details = $golfFranceRepository->getOneGolf(intval($golfID), $userID);

        $nbr_avis_resto = $avisGolfRepository->getNombreAvis($details["id"]);

        $global_note  = $avisGolfRepository->getNoteGlobale($details["id"]);

        $isAlreadyCommented= false;
        $isHaveTribuPastille= false;

        $avis= ["note" => null, "text" => null  ];

        $note_temp=0;
        foreach ($global_note as $note ) {
            if($this->getUser() && $this->getUser()->getID() === $note["user"]["id"]){
                $isAlreadyCommented = true;
                $avis = [ "note" => $note["note"], "text" => $note["avis"] ];
            }
            $note_temp += $note["note"]; 
        }

        $details["avis"] = [
            "nbr" => $nbr_avis_resto,
            "note" => $global_note ?  $note_temp / count($global_note) : 0,
            "isAlreadyCommented" => $isAlreadyCommented,
            "avisPerso" => $avis
        ];

        return $this->json([
            "details" => $details,
        ], 200);
    }

    #[Route('/golf/departement/{nom_dep}/{id_dep}/{golfID}', name: 'single_golf_france', methods: ["GET"])]
    public function oneGolf(
        $nom_dep,
        $id_dep,
        $golfID,
        GolfFranceRepository $golfFranceRepository,
        AvisGolfRepository $avisGolfRepository,
        UserRepository $userRepository,
        Status $status,
        Tribu_T_Service $tribu_T_Service,
        TributGService $tributGService,
        Filesystem $filesyst,
    ){
        ///current user connected
        $user = $this->getUser();
        $userID = ($user) ? intval($user->getId()) : null;

        $details = $golfFranceRepository->getOneGolf(intval($golfID),$userID);

        $nbr_avis_resto = $avisGolfRepository->getNombreAvis($details["id"]);

        $global_note  = $avisGolfRepository->getNoteGlobale($details["id"]);

        $isAlreadyCommented= false;
        $isHaveTribuPastille= false;

        $avis= ["note" => null, "text" => null  ];

        $note_temp=0;
        foreach ($global_note as $note ) {
            if($this->getUser() && $this->getUser()->getID() === $note["user"]["id"]){
                $isAlreadyCommented = true;
                $avis = [ "note" => $note["note"], "text" => $note["avis"] ];
            }
            $note_temp += $note["note"]; 
        }

        $details["avis"] = [
            "nbr" => $nbr_avis_resto,
            "note" => $global_note ?  $note_temp / count($global_note) : 0,
            "isAlreadyCommented" => $isAlreadyCommented,
            "avisPerso" => $avis
        ];

        $arrayTribu = []; // tribut T (own) pastille
        $arrayTribuJoined= []; // tribut T join pastille
        $array_tribug_pastilled= [];  // tribut G pastille

        if ($this->getUser()) {
            $tribu_t_owned = $userRepository->getListTableTribuT_owned();

            foreach ($tribu_t_owned as $key) {
                // dd($key);
                $tableTribu = $key["table_name"];
                $logo_path = $key["logo_path"];
                $name_tribu_t_muable =  array_key_exists("name_tribu_t_muable", $key) ? $key["name_tribu_t_muable"] : null;
                $tableExtension = $tableTribu . "_golf";

                if ($tribu_T_Service->checkExtension($tableTribu, "_golf") > 0) {
                    if (!$tribu_T_Service->checkIfCurrentGolfPastilled($tableExtension, $golfID, true)) {
                        array_push($arrayTribu, ["table_name" => $tableTribu, "name_tribu_t_muable" => $name_tribu_t_muable, "logo_path" => $logo_path, "isPastilled" => false]);
                    } else {
                        array_push($arrayTribu, ["table_name" => $tableTribu, "name_tribu_t_muable" => $name_tribu_t_muable, "logo_path" => $logo_path, "isPastilled" => true]);
                        $isHaveTribuPastille= true;
                    }
                }
            }

            $tribu_t_joined = $userRepository->getListTalbeTribuT_joined();
            foreach ($tribu_t_joined as $key) {
                $tbtJoined = $key["table_name"];
                $logo_path = $key["logo_path"];
                $name_tribu_t_muable = $key["name_tribu_t_muable"];
                $tableExtensionTbtJoined = $tbtJoined . "_golf";
                if($tribu_T_Service->checkExtension($tbtJoined, "_golf") > 0){
                    if($tribu_T_Service->checkIfCurrentRestaurantPastilled($tableExtensionTbtJoined, $details["id"], true)){
                        array_push($arrayTribuJoined, ["table_name" => $tbtJoined, "logo_path" => $logo_path, "name_tribu_t_muable" =>$name_tribu_t_muable, "isPastilled" => true]);
                        $isHaveTribuPastille= true;
                    }else{
                        array_push($arrayTribuJoined, ["table_name" => $tbtJoined, "logo_path" => $logo_path, "name_tribu_t_muable" => $name_tribu_t_muable, "isPastilled" => false]);
                    }
                }
            }

            $statusProfile = $status->statusFondateur($this->getUser());

            $current_profil= $statusProfile["profil"][0];
            $tributG_table_name= $current_profil->getTributG();

            $isPastilled = $tributGService->isPastilled($tributG_table_name."_golf", $golfID);

            if( count($isPastilled) > 0 ){
                $profil_tribuG= $tributGService->getProfilTributG($tributG_table_name, $user->getId());
                array_push($array_tribug_pastilled, ["table_name" => $profil_tribuG["table_name"], "logo_path" => $profil_tribuG["avatar"], "name_tribu_g_muable" => $profil_tribuG["name"], "isPastilled" => true]);
                $isHaveTribuPastille= true;
            }
        }

        $folder = $this->getParameter('kernel.project_dir') . "/public/uploads/valider/golf/".$details["id"]."/";

        $tabPhoto = [];

        $dir_exist = $filesyst->exists($folder);

        // dd($folder);


        if($dir_exist){
            $images = glob($folder . '*.{jpg,JPG,jpeg,JPEG,png,PNG,gif,GIF,webp}', GLOB_BRACE);

            // dd($images);
            foreach ($images as $image) {
                $photo = explode("uploads/valider",$image)[1];
                $photo = "/public/uploads/valider".$photo;
                array_push($tabPhoto, ["photo"=>$photo]);
            }
        }


        return $this->render("golf/details_golf.html.twig", [
            "id_dep" => $id_dep,
            "nom_dep" => $nom_dep,
            "details" => $details,
            "tribu_t_pastilleds" => $arrayTribu,
            "tribu_t_joined_pastille" => $arrayTribuJoined,
            "tribu_g_pastilleds" => $array_tribug_pastilled,
            "photos" => $tabPhoto,
            "isHaveTribuPastille" => $isHaveTribuPastille
        ]);
    }

    #[Route('/golf-mobile/departement/{nom_dep}/{id_dep}/details/{golfID}', name: 'single_golf_france_mobile', methods: ["GET"])]
    public function oneGolfMobile(
        $nom_dep,
        $id_dep,
        $golfID,
        GolfFranceRepository $golfFranceRepository,
        Status $status,
    ) {
        ///current user connected
        $user = $this->getUser();
        $userID = ($user) ? intval($user->getId()) : null;
        // dd($golfFranceRepository->getOneGolf(intval($golfID)));

        return $this->render("shard/golf/detail_golf_navleft_mobile.twig", [
            "id_dep" => $id_dep,
            "nom_dep" => $nom_dep,
            "details" => $golfFranceRepository->getOneGolf(intval($golfID), $userID),
        ]);
    }

    
    #[Route("/avis/golf/global/{idGolf}", name: "get_avis_global_golf", methods: ["GET"])]
    public function getAvisGlobalGolf(
        AvisGolfRepository $avisGolfRepository,
        $idGolf,
        SerializerInterface $serializer
    ) {
        $user= $this->getUser();
        if( !$user ){
            return $this->json([ "message" => "User no connected."]);
        }
        $currentUser= [
            "id" => $user->getId(),
            "email" => $user->getEmail(),
            "pseudo" => $user->getPseudo()
        ];

        $response = $avisGolfRepository->getNoteGlobale($idGolf);

        return $this->json([ "data" => $response, "currentUser" => $currentUser ]);
    }

    #[Route("/avis/golf/{idGolf}", name: "avis_golf", methods: ["POST"])]
    public function giveAvisGolf(
        AvisGolfRepository $avisGolfRepository,
        GolfFranceRepository $golfFranceRepository,
        Request $request,
        $idGolf,
        Filesystem $filesyst
    ){

        $user = $this->getUser();
        $golf = $golfFranceRepository->find($idGolf);
        $avisGolf = new AvisGolf();

        $requestJson = json_decode($request->getContent(), true);
        $avis = $requestJson["avis"];
        $note = $requestJson["note"];
        $type = $requestJson["type"];
        
        //dd($user,$resto);
        // $avisGolf->setAvis($avis)

        if($type == "audio"){

            $path_file = '/public/uploads/avis-golf/audio/';

            $destination = $this->getParameter('kernel.project_dir') . '/public/uploads/avis-golf/audio/';


            $temp = explode(";", $avis);

            $extension = explode("/", $temp[0])[1];

            $newFilename = time() . '-' . uniqid() . "." . $extension;

            ///save image in public/uploader folder

            $dir_exist = $filesyst->exists($destination);
            
            if ($dir_exist == false) {
                
                $filesyst->mkdir($destination, 0777);
            }

            file_put_contents($destination . $newFilename, file_get_contents($avis));


            $avis = $path_file . $newFilename;
        }

        $avisGolf->setAvis(json_encode($avis))
            ->setnote($note)
            ->setUser($user)
            ->setDatetime(new \DateTimeImmutable())
            ->setGolf($golf)
            ->setType($type);

        $avisGolfRepository->add($avisGolf, true);

        $state= $avisGolfRepository->getState($idGolf);

        return $this->json([
            "state" => $state
        ]);
    }

    #[Route("/nombre/avis/golf/{idGolf}", name: "get_nombre_avis_golf", methods: ["GET"])]
    public function getNombreAvisGolf(
        $idGolf,
        AvisGolfRepository $avisGolfRepository,
        SerializerInterface $serializer,
    ) {
        $response = $avisGolfRepository->getNombreAvis($idGolf);

        $response = $serializer->serialize(["nombre_avis" => $response], 'json');
        return new JsonResponse($response, 200, [], true);
    }

    #[Route("/change/golf/{idGolf}", name: "change_avis_golf", methods: ["POST"])]
    public function changeAvisGolf(
        $idGolf,
        AvisGolfRepository $avisGolfRepository,
        SerializerInterface $serializer,
        Request $request,
        Filesystem $filesyst
    ) {

        $rJson = json_decode($request->getContent(), true);
        $userId = $this->getUser()->getId();

        $avis = $rJson["avis"];
        $type = $rJson["type"];

        if($rJson["type"] == "audio"){

            $path_file = '/public/uploads/avis-golf/audio/';

            $destination = $this->getParameter('kernel.project_dir') . '/public/uploads/avis-golf/audio/';


            $temp = explode(";", $avis);

            $extension = explode("/", $temp[0])[1];

            $newFilename = time() . '-' . uniqid() . "." . $extension;

            ///save image in public/uploader folder

            $dir_exist = $filesyst->exists($destination);
            
            if ($dir_exist == false) {
                
                $filesyst->mkdir($destination, 0777);
            }

            file_put_contents($destination . $newFilename, file_get_contents($avis));


            $avis = $path_file . $newFilename;

        }

        if($rJson["type"] == "audio_up"){
            $type = "audio";
        }

        $response = $avisGolfRepository->updateAvis(
            $idGolf,
            $userId,
            $rJson["avisID"],
            $rJson["note"],
            $avis,
            $type,
        );
        $response = $serializer->serialize($response, 'json');

        $state= $avisGolfRepository->getState($idGolf);

        return $this->json([
            "state" => $state,
            "data" => $response
        ]);
    }


    #[Route('user/setGolf/finished', name: 'set_golf_finished', methods: ["POST"])]
    public function setGolfFinished(
        Request $request,
        EntityManagerInterface $entityManager,
        NotificationService $notificationService,
        GolfFinishedRepository $golfRepo,
        GolfFranceRepository $golfFranceRepository
    ) {
        $requestContent = json_decode($request->getContent(), true);
        extract($requestContent); ///$golfID


        ///current user connected


        $user = $this->getUser();
        if (!$user) {
            return $this->json(["success" => false, "message" => "user is not connected"], 403);
        }
        $isnumeric = (bool)preg_match('/[0-9]/', $golfID, $numerics);

        $userID = $user->getId();

        if ($isnumeric && intval($golfID) > 0) {
            $golf = $golfFranceRepository->findOneBy(["id" => $golfID]);

            if (!is_null($golf)) {

                // if($golfRepo->checkIfExists($userID,$golfID)){
                //     $golfRepo->updateGolfFinishedValue($userID,$golfID,0,1,0);
                // }else{
                $golfFinished = new GolfFinished();
                $golfFinished->setGolfId($golfID);
                $golfFinished->setUserId($userID);
                $golfFinished->setFait(1);
                $golfFinished->setAfaire(0);
                $golfFinished->setMonGolf(0);
                $golfFinished->setARefaire(0);

                // dd($golfFinished);

                $entityManager->persist($golfFinished);

                $entityManager->flush();


                $notificationService->sendNotificationForOne(
                    $userID,
                    $userID,
                    "/golf",
                    "Vous avez marqué le golf " . $golf->getNomGolf() . " comme terminé."
                );
                return $this->json([
                    "success" => true,
                    "message" => "Golf finished successfully"
                ], 201);
            } else {
                return $this->json([
                    "response" => "bad",

                ], 403);
            }
        } else {
            return $this->json([
                "response" => "bad",

            ], 403);
        }



        // sendNotificationForOne(int $user_id_post, int $user_id, string $type, string $content, string $link= null )
        return $this->json([
            "response" => "bad",

        ], 403);
    }

    #[Route('/user/setGolf/remake', name: 'set_golf_remake', methods: ["POST"])]
    public function setGolfRemake(
        Request $request,
        EntityManagerInterface $entityManager,
        NotificationService $notificationService,
        GolfFinishedRepository $golfRepo,
        GolfFranceRepository $golfFranceRepository
    ) {
        $requestContent = json_decode($request->getContent(), true);
        extract($requestContent); ///$golfID


        ///current user connected


        $user = $this->getUser();
        if (!$user) {
            return $this->json(["success" => false, "message" => "user is not connected"], 403);
        }
        $isnumeric = (bool)preg_match('/[0-9]/', $golfID, $numerics);

        $userID = $user->getId();

        if ($isnumeric && intval($golfID) > 0) {
            $golf = $golfFranceRepository->findOneBy(["id" => $golfID]);

            if (!is_null($golf)) {

                // if($golfRepo->checkIfExists($userID,$golfID)){
                //     $golfRepo->updateGolfFinishedValue($userID,$golfID,0,1,0);
                // }else{
                $golfFinished = new GolfFinished();
                $golfFinished->setGolfId($golfID);
                $golfFinished->setUserId($userID);
                $golfFinished->setFait(0);
                $golfFinished->setAfaire(0);
                $golfFinished->setARefaire(1);
                $golfFinished->setMonGolf(0);

                // dd($golfFinished);

                $entityManager->persist($golfFinished);

                $entityManager->flush();


                $notificationService->sendNotificationForOne(
                    $userID,
                    $userID,
                    "/golf",
                    "Vous avez marqué le golf " . $golf->getNomGolf() . " à refaire."
                );
                return $this->json([
                    "success" => true,
                    "message" => "Golf finished successfully"
                ], 201);
            } else {
                return $this->json([
                    "response" => "bad",

                ], 403);
            }
        } else {
            return $this->json([
                "response" => "bad",

            ], 403);
        }



        // sendNotificationForOne(int $user_id_post, int $user_id, string $type, string $content, string $link= null )
        return $this->json([
            "response" => "bad",

        ], 403);
    }
    #[Route('user/setGolf/todo', name: 'set_golf_todo', methods: ["POST"])]
    public function setGolfToDo(
        Request $request,
        EntityManagerInterface $entityManager,
        NotificationService $notificationService,
        GolfFinishedRepository $golfRepo,
        GolfFranceRepository $golfFranceRepository
    ) {
        $requestContent = json_decode($request->getContent(), true);
        extract($requestContent); ///$golfID


        ///current user connected
        $user = $this->getUser();
        if (!$user) {
            return $this->json(["success" => false, "message" => "user is not connected"], 403);
        }
        $isnumeric = (bool)preg_match('/[0-9]/', $golfID, $numerics);
        $userID = $user->getId();
        if ($isnumeric && intval($golfID) > 0) {
            $golf = $golfFranceRepository->findOneBy(["id" => $golfID]);
            if (!is_null($golf)) {
                $isFinished = $golfRepo->findOneBy(['golf_id' => intval($golfID), 'user_id' => $userID, 'a_faire' => 1]);
                if (!$isFinished) {

                    $isHasGolf = $golfRepo->findOneBy(['golf_id' => intval($golfID), 'user_id' => $userID]);

                    if($isHasGolf){
                        $isHasGolf->setFait(0);
                        $isHasGolf->setAfaire(1);
                        $isHasGolf->setMonGolf(0);
                        $isHasGolf->setARefaire(0);
                        $entityManager->persist($isHasGolf);
                    }else{
                        $golfFinished = new GolfFinished();
                        $golfFinished->setGolfId($golfID);
                        $golfFinished->setUserId($userID);
                        $golfFinished->setFait(0);
                        $golfFinished->setAfaire(1);
                        $golfFinished->setMonGolf(0);
                        $golfFinished->setARefaire(0);
    
                        $entityManager->persist($golfFinished);

                    }

                    $entityManager->flush();

                    $notificationService->sendNotificationForOne(
                        $userID,
                        $userID,
                        "/golf",
                        "Vous avez marqué le golf " . $golf->getNomGolf() . " à faire."
                    );

                    return $this->json([
                        "success" => true,
                        "message" => "Golf finished successfully"
                    ], 201);
                }else{
                    return $this->json([
                        "success" => false,
                        "message" => "Golf déjà à faire"
                    ], 201);
                }
            } else {
                return $this->json([
                    "response" => "bad",

                ], 403);
            }
        } else {
            return $this->json([
                "response" => "bad",

            ], 403);
        }

        return $this->json([
            "response" => "bad",

        ], 403);
    }

    #[Route('user/setGolf/none', name: 'set_golf_none', methods: ["POST"])]
    public function setGolfNone(
        Request $request,
        EntityManagerInterface $entityManager,
        GolfFinishedRepository $golfRepo
    ) {
        $requestContent = json_decode($request->getContent(), true);
        extract($requestContent); ///$golfID


        ///current user connected
        $user = $this->getUser();
        if (!$user) {
            return $this->json(["success" => false, "message" => "user is not connected"], 403);
        }
        $isnumeric = (bool)preg_match('/[0-9]/', $golfID, $numerics);
        $userID = $user->getId();
        if ($isnumeric && intval($golfID) > 0) {
            $golf = $golfRepo->findOneBy(["id" => $golfID]);
            if (!is_null($golf)) {
                $golfFinished = new GolfFinished();
                $golfFinished->setGolfId($golfID);
                $golfFinished->setUserId($userID);
                $golfFinished->setFait(0);
                $golfFinished->setAfaire(0);
                $golfFinished->setMonGolf(0);
                $golfFinished->setARefaire(0);

                $entityManager->persist($golfFinished);

                $entityManager->flush();

                return $this->json([
                    "success" => true,
                    "message" => "Golf finished successfully"
                ], 201);
            } else {
                return $this->json([
                    "response" => "bad",

                ], 403);
            }
        } else {
            return $this->json([
                "response" => "bad",

            ], 403);
        }

        return $this->json([
            "response" => "bad",

        ], 403);
    }

    #[Route('user/setGolf/unfinished', name: 'set_golf_unfinished', methods: ["POST"])]
    public function setGolfUnFinished(
        Request $request,
        GolfFinishedRepository $golfFinishedRepository,
        EntityManagerInterface $entityManager,
        NotificationService $notificationService
    ) {
        if (!$this->getUser()) {
            return $this->json(["success" => false, "message" => "Unauthorized"], 403);
        }
        $userID = $this->getUser()->getId();
        $requestContent = json_decode($request->getContent(), true);
        extract($requestContent); ///$golfID

        $isFinished = $golfFinishedRepository->findOneBy(['golf_id' => intval($golfID), 'user_id' => $userID]);
        if (!$isFinished) {
            return $this->json(["success" => false, "message" => "This golf is not yet finished"], 200);
        }

        $entityManager->remove($isFinished);

        $entityManager->flush();

        // sendNotificationForOne(int $user_id_post, int $user_id, string $type, string $content, string $link= null )
        $notificationService->sendNotificationForOne($userID, $userID, "/golf", "Vous avez annulé un golf terminé.");


        return $this->json([
            "success" => true,
            "message" => "Setting golf unfinished successfully"
        ], 201);
    }

    #[Route('user/setGolf/for_me', name: 'set_golf_for_me', methods: ["POST"])]
    public function setGolfForMe(
        Request $request,
        EntityManagerInterface $entityManager,
        NotificationService $notificationService,
        GolfFinishedRepository $golfRepo
    ) {
        $requestContent = json_decode($request->getContent(), true);
        extract($requestContent); ///$golfID


        ///current user connected
        $user = $this->getUser();
        if (!$user) {
            return $this->json(["success" => false, "message" => "user is not connected"], 403);
        }

        $userID = $user->getId();
        $isnumeric = (bool)preg_match('/[0-9]/', $golfID, $numerics);
        if ($isnumeric && intval($golfID) > 0) {
            $golf = $golfFranceRepository->findOneBy(["id" => $golfID]);
            if (!is_null($golf)) {
                $golfFinished = new GolfFinished();
                $golfFinished->setGolfId($golfID);
                $golfFinished->setUserId($userID);
                $golfFinished->setFait(0);
                $golfFinished->setAfaire(0);
                $golfFinished->setMonGolf(1);
                $golfFinished->setARefaire(0);
                
                $entityManager->persist($golfFinished);

                $entityManager->flush();
                $notificationService->sendNotificationForOne(
                    $userID,
                    $userID,
                    "/golf",
                    "Vous venez d'indiquer que vous êtes membre au golf le " . $golf->getNomGolf()
                );
                return $this->json([
                    "success" => true,
                    "message" => "Golf finished successfully"
                ], 201);
            } else {
                return $this->json([
                    "response" => "bad",
                ], 403);
            }
        } else {
            return $this->json([
                "response" => "bad",
            ], 403);
        }

        return $this->json([
            "response" => "bad",
        ], 403);
    }

    #[Route("/golf/add/photos/{id_golf}", name: "app_add_photos_golf")]
    public function addPhotoGolfToGallery( $id_golf, Request $request,
        Filesystem $filesyst, UserService $userService
    ) {

        $date = new \DateTimeImmutable();

        $timestamp = (int)$date->format('Uu');

        if (!$this->getUser()) {

            return $this->json([

                "error" => "Invalid credentials",

            ], 401);

        }else{

            $user_id = $this->getUser()->getId();

            $requestContent = json_decode($request->getContent(), true);
    
            if ($requestContent["image"]) {
    
                $image = $requestContent["image"];
    
                ///download image
    
                $path = $this->getParameter('kernel.project_dir') . '/public/uploads/avalider/golf/'.$id_golf;
    
                $path_name = '/uploads/avalider/golf/'.$id_golf .'/';
    
                $dir_exist = $filesyst->exists($path);
    
                if ($dir_exist == false) {
        
                    $filesyst->mkdir($path, 0777);
                }
    
                $temp = explode(";", $image);
    
                $extension = explode("/", $temp[0])[1];
    
                $image_name = "golf_" . $id_golf ."_". $timestamp . "." . $extension;
    
                ///save image in public/uploader folder
    
                file_put_contents($path . "/".$image_name, file_get_contents($image));
    
    
                ///insert into database
    
                $photo_path = $path_name .$image_name;
    
                $userService->insertPhotoGolf($id_golf, $user_id, $photo_path);
    
            }
    
            return $this->json([
    
                "result" => "success"
    
            ], 201);
        }
        
    }

    #[Route("/golf/validate/photos/{id_golf}/{id_gallery}", name: "app_validate_photos_golf")]
    public function validatePhotoGolfGallery($id_golf, $id_gallery, Request $request,
        Filesystem $filesyst, UserService $userService
    ){

        $old_path = $this->getParameter('kernel.project_dir') . '/public/uploads/avalider/golf/'.$id_golf;
        
        $new_path = $this->getParameter('kernel.project_dir') . '/public/uploads/valider/golf/'.$id_golf;

        $dir_exist = $filesyst->exists($new_path);

        if ($dir_exist == false) {

            $filesyst->mkdir($new_path, 0777);
        }

        $requestContent = json_decode($request->getContent(), true);

        $image_name = $requestContent["image_name"];

        ///save image in public/uploader folder

        $current = file_get_contents($old_path."/".$image_name);

        file_put_contents($new_path . "/".$image_name, $current);

        //delete old path
        unlink($old_path."/".$image_name);

        $userService->updateSatatusPhotoGolf($id_gallery, 1);

        return $this->json([

            "result" => "success"

        ], 201);
    }

    #[Route("/golf/reject/photos/{id_golf}/{id_gallery}", name: "app_reject_photos_golf")]
    public function rejectPhotoGolfGallery($id_golf, $id_gallery, Request $request,
        Filesystem $filesyst, UserService $userService
    ){

        $old_path = $this->getParameter('kernel.project_dir') . '/public/uploads/avalider/golf/'.$id_golf;

        $requestContent = json_decode($request->getContent(), true);

        $image_name = $requestContent["image_name"];

        $current = file_get_contents($old_path."/".$image_name);

        //delete old path
        unlink($old_path."/".$image_name);

        $userService->updateSatatusPhotoGolf($id_gallery, 2);

        return $this->json([

            "result" => "success"

        ], 201);
    }

    #[Route("/golf/delete/photos/{id_golf}/{id_gallery}", name: "app_delete_photos_golf")]
    public function deletePhotoGolfGallery($id_golf, $id_gallery, Request $request,
        Filesystem $filesyst, UserService $userService
    ){

        $old_path = $this->getParameter('kernel.project_dir') . '/public/uploads/valider/golf/'.$id_golf;

        $requestContent = json_decode($request->getContent(), true);

        $image_name = $requestContent["image_name"];

        $current = file_get_contents($old_path."/".$image_name);

        //delete old path
        unlink($old_path."/".$image_name);

        $userService->deletePhotoGolf($id_gallery);

        return $this->json([

            "result" => "success"

        ], 201);
    }

    #[Route("/golf/not-valid", name: "app_not_valid_golf")]
    public function getGolfNotValidate(Filesystem $filesyst, UserService $userServ):Response
    {

        $not_valid = $userServ->getAllPhotoNotValidGolf();

        $not_valid = mb_convert_encoding($not_valid, 'UTF-8', 'UTF-8');

        return $this->json($not_valid);
    }

    /**
     * @author Elie
     * Get image preview gallery
     */
    public function getPhotoPreviewResto($type, $filesyst, $id_restaurant){
         

        $folder = $this->getParameter('kernel.project_dir') . "/public/uploads/valider/".$type."/".$id_restaurant."/";

        $tabPhoto = [];

        $dir_exist = $filesyst->exists($folder);

        // dd($folder);


        if($dir_exist){
            $images = glob($folder . '*.{jpg,JPG,jpeg,JPEG,png,PNG,gif,GIF,webp}', GLOB_BRACE);

            // dd($images);
            foreach ($images as $image) {
                $photo = explode("uploads/valider",$image)[1];
                $photo = "/public/uploads/valider".$photo;
                array_push($tabPhoto, $photo);
            }
        }
        if(count($tabPhoto) > 0){
           return $tabPhoto[count($tabPhoto)-1];
        }else{
           return null;
        }

       //  $last_photo = $tabPhoto[count($tabPhoto)-1];
   }

}
