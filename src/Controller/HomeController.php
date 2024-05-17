<?php

namespace App\Controller;

use App\Service\Status;
use App\Entity\Consumer;
use App\Entity\Supplier;
use App\Service\MessageService;
use App\Service\TributGService;
use App\Service\Tribu_T_Service;
use App\Repository\UserRepository;
use App\Service\GolfFranceService;
use App\Service\SortResultService;
use App\Repository\TabacRepository;
use App\Repository\MarcheRepository;
use App\Repository\AvisGolfRepository;
use App\Repository\BddRestoRepository;
use App\Repository\FermeGeomRepository;
use App\Repository\GolfFranceRepository;
use App\Service\StringTraitementService;
use Doctrine\ORM\EntityManagerInterface;
use App\Repository\DepartementRepository;
use App\Repository\AvisRestaurantRepository;
use Symfony\Component\Filesystem\Filesystem;
use App\Repository\CommuneGeoCoderRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use App\Repository\StationServiceFrGeomRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\ResponseHeaderBag;

class HomeController extends AbstractController
{

    #[Route("/liste/guide/cmz", name:"app_guide_cmz")]
    public function getListGuideCMZ(){

        return $this->render("ficheUtilisation.html.twig");
    }
    #[Route("/user/liste/guide/cmz", name:"app_loged_guide_cmz")]
    public function getListGuideCMZLogedUser(
        EntityManagerInterface $entityManager,
        Status $status
    ){
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
        return $this->render("ficheUtilisationLogged.html.twig",[
            "userConnected" => $userConnected,

            "profil" => $profil,
        ]);
    }
    #[Route("/pdf/{nom}", name:"app_guide")]
    public function pdfGuide($nom){
        $path="";
        $name="";
        if($nom=="1"){
            $path =$this->getParameter('kernel.project_dir'). "/public/uploads/ConsoMYzone_Slidedoc_2024_01_08_INTRO_pour_site_web.pdf"; 
            $name="ConsoMYzone_Slidedoc_2024_01_08_INTRO_pour_site_web.pdf";
        }
            
        if($nom == "2"){
            $path =$this->getParameter('kernel.project_dir'). "/public/uploads/ConsoMYzone_Slidedoc_2024_01_15_Prise_en_main.pdf";
            $name="ConsoMYzone_Slidedoc_2024_01_15_Prise_en_main.pdf";
        }

        if($nom == "3"){
            $path =$this->getParameter('kernel.project_dir'). "/public/uploads/ConsoMYzone_Slidedoc_2024_01_15_Prise_en_main_rapide.pdf";
            $name="ConsoMYzone_Slidedoc_2024_01_15_Prise_en_main_rapide.pdf";
}
             
        if($nom == "4"){
            $path =$this->getParameter('kernel.project_dir'). "/public/uploads/ConsoMYzone_Slidedoc_2024_02_15_INTRO_pour_site_web_version_courte.pdf";
            $name="ConsoMYzone_Slidedoc_2024_02_15_INTRO_pour_site_web_version_courte.pdf";
        }
             
        $file = $path; // Path to the file on the server
        $response = new BinaryFileResponse($file);
 
        // Give the file a name:
        //$response->setContentDisposition(ResponseHeaderBag::DISPOSITION_ATTACHMENT,$name);
        $response->setContentDisposition(ResponseHeaderBag::DISPOSITION_INLINE,$name);

        return $response;
    }
    #[Route('/getLatitudeLongitudeForAll', name: 'for_explore_cat_tous')]
    public function getLatitudeLongitudeForAll(
        Request $request,
        StationServiceFrGeomRepository $stationServiceFrGeomRepository,
        FermeGeomRepository $fermeGeomRepository,
        BddRestoRepository $bddRestoRepository,
    )
    {
        $nom_dep = $request->query->get("nom_dep");
        $id_dep = $request->query->get("id_dep");
        $type = $request->query->get("type");

        // dd($nom_dep, $id_dep );

        if($nom_dep !=null && $id_dep !=null){
            if( $type ){
                switch( $type){
                    case "tous":
                        return $this->json([
                            "station" => $stationServiceFrGeomRepository->getAllStationInDepartement($id_dep,$nom_dep),
                            "ferme" => $fermeGeomRepository->getAllFermeInDepartement($nom_dep, $id_dep),
                        ]);

                    case "station":
                        return $this->json([
                            "station" => $stationServiceFrGeomRepository->getAllStationInDepartement($id_dep,$nom_dep),
                            "ferme" => null,
                            "resto" => null,
                        ]);

                    case "ferme":
                        return $this->json([
                            "ferme" => $fermeGeomRepository->getAllFermeInDepartement($nom_dep, $id_dep),
                            "station" => null,
                            "resto" => null
                        ]);

                    default:
                        break;
                }
            }



            return $this->json([
                "station" => $stationServiceFrGeomRepository->getAllStationInDepartement(intval($id_dep),$nom_dep),
                "ferme" => $fermeGeomRepository->getAllFermeInDepartement($nom_dep, $id_dep),
                "resto" => null
            ]);

        }



        if( $type ){
            switch( $type){
                case "tous":
                    return $this->json([
                        "station" => $stationServiceFrGeomRepository->getLatitudeLongitudeStation(),
                        "ferme" => $fermeGeomRepository->getLatitudeLongitudeFerme(),
                        "resto" => $bddRestoRepository->getAllOpenedRestos(),
                    ]);

                case "station":
                    return $this->json([
                        "station" => $stationServiceFrGeomRepository->getLatitudeLongitudeStation(),
                        "ferme" => null,
                        "resto" => null,
                    ]);

                case "ferme":
                    return $this->json([
                        "station" => null,
                        "resto" => null,
                        "ferme" => $fermeGeomRepository->getLatitudeLongitudeFerme(),
                    ]);
                
                case "resto":
                    return $this->json([
                        "station" => null,
                        "ferme" => null,
                        "resto" => $bddRestoRepository->getAllOpenedRestos(),
                    ]);

                default:
                    break;
            }

        }

        return $this->json([
            "station" => $stationServiceFrGeomRepository->getLatitudeLongitudeStation(),
            "ferme" => $fermeGeomRepository->getLatitudeLongitudeFerme(),
            "resto" => $bddRestoRepository->getAllOpenedRestos(),
        ]);

    }

    #[Route("/api/alldepartements" , name:"app_api_getAllDep", methods: "GET")]
    public function getAllDepartementNames(DepartementRepository  $departementRepository){
        return $this->json([
            "departements" => $departementRepository->getDep(),
        ]);
    }
    
    #[Route("/fetch-all-data-home" , name:"app_api_fetch_data", methods: "POST")]
    public function apiFetchDataAction(
        Request $request,
        StationServiceFrGeomRepository $stationServiceFrGeomRepository,
        FermeGeomRepository $fermeGeomRepository,
        BddRestoRepository $bddRestoRepository,
    )
    {
        /// get data from front on json format
        $data = json_decode($request->getContent(), true);
        extract($data); /// $types , $department
        $results = ["state" => $data];

        $dictionnaire = [ 
            "filterFerme" =>  "ferme",
            "filterStation" => "station",
            "filterResto" => "resto",
            "filterVehicule" => "vehicule",
            "filterCommerce" => "commerce"
        ];

        $dictionnaire_data = [ 
            "ferme" => $departement ? $fermeGeomRepository->getAllFermeInDepartement(null , $departement) :  $fermeGeomRepository->getLatitudeLongitudeFerme(),
            "station" => $departement ? $stationServiceFrGeomRepository->getAllStationInDepartement($departement) : $stationServiceFrGeomRepository->getLatitudeLongitudeStation(),
            "resto" =>$departement ? $bddRestoRepository->getCoordinateAndRestoIdForSpecific($departement) : $bddRestoRepository->getAllOpenedRestos(),
            "vehicule" => [],
            "commerce" => []
        ];

        foreach($types as $single ){
            extract($single); /// $type , $state
            if(intval($state) === 1 ){
                ///required
                $results[$dictionnaire[$type]] = $dictionnaire_data[$dictionnaire[$type]];
            }else{
                $results[$dictionnaire[$type]] = [];
            }
        }
        
        return $this->json($results);
    }

    #[Route("/api/search/{type}" , name:"app_api_search" , methods: "GET")]
    #[Route("/search/{type}" , name:"app_search" , methods: "GET")]
    public function search(
        $type = null,
        Request $request,
        Status $status,
        StationServiceFrGeomRepository $stationServiceFrGeomRepository,
        FermeGeomRepository $fermeGeomRepository,
        BddRestoRepository $bddRestoRepository,
        SortResultService $sortResultService,
        StringTraitementService $stringTraitementService,
        UserRepository $userRepository,
        EntityManagerInterface $entityManager,
        TributGService $tributGService,
        Tribu_T_Service $tribu_T_Service,
        MessageService $messageService,
        CommuneGeoCoderRepository $communeGeoCoderRepository,
        GolfFranceRepository $golfFranceRepository,
        AvisGolfRepository $avisGolfRepository,
        GolfFranceService $golfFranceService,
        TabacRepository $tabacRepository,
        MarcheRepository $marcheRepository,
        RestaurantController $restaurantController,
        AvisRestaurantRepository $avisRestaurantRepository,
        Filesystem $filesyst,
    ){

        ///current user connected
        $user = $this->getUser();
        $userConnected = $status->userProfilService($this->getUser());

        $userType = $user ? $user->getType()  : null;
        $userId=  $user ?  $user->getId() : null;

        if ($userType == "consumer") {
            $profil = $entityManager->getRepository(Consumer::class)->findByUserId($userId);
        } else {
            $profil = $entityManager->getRepository(Supplier::class)->findByUserId($userId);
        }

        // return $this->redirectToRoute("restaurant_all_dep");
        $statusProfile = $status->statusFondateur($user);

        ///////GET PROFIL THE USER IN SAME TRIBUT G WITH ME////////////////////////////////
        ///to contains profil user information [ [ id => ..., photo => ..., email => ..., firstname => ..., lastname => ..., image_profil => ..., last_message => ..., is_online => ... ], ... ]
        $amis_in_tributG = $messageService->getListAmisToChat($user, $tributGService, $entityManager, $userRepository);

        $origin_cles1= $request->query->get("cles1"); //// use for searching geojson API OpenStreetMap

        $cles0 = $request->query->get("cles0") ? $stringTraitementService->normalizedString($stringTraitementService->removeWhiteSpace($request->query->get("cles0"))) : "";
        $cles1 = $request->query->get("cles1") ? $stringTraitementService->normalizedString($stringTraitementService->removeWhiteSpace($request->query->get("cles1"))) : "";
        $page = $request->query->get("page") ? intval($request->query->get("page")) : 1 ;

        $condition = ($cles0 === "station" || $cles0 === "ferme" || $cles0 === "restaurant" || $cles0 === "resto" || $cles0 === "tabac" || $cles0 === "golf" || $cles0 === "marche" || $cles0 === "tous"  );
        $type= $condition ? $cles0: $type;
        $cles0= $condition ? "": $cles0;

        $size = 20;

        $otherResult = false;
        switch (strtolower($type)){
            case "ferme":
                $ferme = $fermeGeomRepository->getBySpecificClef($cles0, $cles1, $page, $size);
                if(!count($ferme[0])>0){
                    $ferme = $fermeGeomRepository->getBySpecificClefOther($cles0, $cles1, $page, $size);
                    $ferme0 = $sortResultService->getDataByCommune($ferme, $cles1, "ferme", $cles0);
                        
                    if(count($ferme0["data"])>0){
                        $ferme[0] = $ferme0["data"];
                        $ferme[1] = $ferme0["nombre"];
                    }else{
                        $otherResult = true;
                    }
                }
                
                $results = $ferme;
                break;
            case "restaurant":
                $resto = $bddRestoRepository->getBySpecificClef($cles0, $cles1, $page, $size);
                if(!count($resto[0])>0){

                    $resto = $bddRestoRepository->getBySpecificClefOther($cles0, $cles1, $page, $size);

                    $resto0 = $sortResultService->getDataByCommune($resto, $cles1, "restaurant", $cles0);
                        
                    if(count($resto0["data"])>0){
                        $resto[0] = $resto0["data"];
                        $resto[1] = $resto0["nombre"];
                    }else{
                        $otherResult = true;
                    }
                
                }
                
                if(count($resto) > 0){
                    $ids=array_map('App\Controller\RestaurantController::getIdAvisResto',$resto[0]);
                    $moyenneNote = $avisRestaurantRepository->getAllNoteById($ids);
                    $resto[0] = $restaurantController->mergeDatasAndAvis($resto[0],$moyenneNote);
                }

                $results = $resto;

                break;
            case "marche":
                $cles1= intval($cles1) === 0 ? $cles1 : intval($cles1);

                $marche = $marcheRepository->getBySpecificClef($cles0, $cles1, $page, $size);
                if(!count($marche[0])>0){

                    $marche = $marcheRepository->getBySpecificClefOther($cles0, $cles1, $page, $size);

                    $marche0 = $sortResultService->getDataByCommune($marche, $cles1, "marche", $cles0);
                        
                    if(count($marche0["data"])>0){
                        $marche[0] = $marche0["data"];
                        $marche[1] = $marche0["nombre"];
                    }else{
                        $otherResult = true;
                    }
                
                }
                $results = $marche;
                break;
            case "golf":
                $golf = $golfFranceRepository->getBySpecificClef($cles0, $cles1, $page, $size, $userId);
                if(!count($golf[0])>0){
                    $golf = $golfFranceRepository->getBySpecificClefOther($cles0, $cles1, $page, $size, $userId);
                    $golf0 = $sortResultService->getDataByCommune($golf, $cles1, "golf", $cles0);
                        
                    if(count($golf0["data"])>0){
                        $golf[0] = $golf0["data"];
                        $golf[1] = $golf0["nombre"];
                    }else{
                        $otherResult = true;
                    }
                }

                $ids_golf= array_map('App\Service\SortResultService::getIdFromData', $golf[0]);
                $moyenne_golfs= $avisGolfRepository->getAllNoteById($ids_golf);
                $golf[0] = $golfFranceService->mergeDatasAndAvis($golf[0], $moyenne_golfs);

                $results = $golf;

                break;
            case "tabac":
                $tabac = $tabacRepository->getBySpecificClef($cles0, $cles1, $page, $size);
                if(!count($tabac[0])>0){
                    $tabac = $tabacRepository->getBySpecificClefOther($cles0, $cles1, $page, $size);
                    $tabac0 = $sortResultService->getDataByCommune($tabac, $cles1, "tabac", $cles0);
                        
                    if(count($tabac0["data"])>0){
                        $tabac[0] = $tabac0["data"];
                        $tabac[1] = $tabac0["nombre"];
                    }else{
                        $otherResult = true;
                    }
                }
                $results = $tabac;
                break;
            case "station":
                $station = $stationServiceFrGeomRepository->getBySpecificClef($cles0, $cles1, $page, $size);
                if(!count($station[0])>0){
                    $station = $stationServiceFrGeomRepository->getBySpecificClefOther($cles0, $cles1, $page, $size);
                    $station0 = $sortResultService->getDataByCommune($station, $cles1, "station", $cles0);
                    if(count($station0["data"])>0){
                        $station[0] = $station0["data"];
                        $station[1] = $station0["nombre"];
                    }else{
                        $otherResult = true;
                    }
                }
                $results = $station;
                break;
            case "station service":
                $station = $stationServiceFrGeomRepository->getBySpecificClef($cles0, $cles1, $page, $size);
                if(!count($station[0])>0){
                    $station = $stationServiceFrGeomRepository->getBySpecificClefOther($cles0, $cles1, $page, $size);
                    $station0 = $sortResultService->getDataByCommune($station, $cles1, "station", $cles0);
                    if(count($station0["data"])>0){
                        $station[0] = $station0["data"];
                        $station[1] = $station0["nombre"];
                    }else{
                        $otherResult = true;
                    }
                }
                $results = $station;
                break;
            default:
                //dd($cles0);
                $otherResto = false;
                $otherFerme = false;
                $otherStation = false;
                $otherGolf = false;
                $otherTabac = false;
                if($cles0 == "RESTO" || $cles0 == "RESTOS" || $cles0 == "RESTAURANT" || $cles0 == "RESTAURANTS"){
                    $resto = $bddRestoRepository->getBySpecificClef($cles0, $cles1, $page, $size);
                    if(!count($resto[0])>0){
                        $resto = $bddRestoRepository->getBySpecificClefOther($cles0, $cles1, $page, $size);

                        $resto0 = $sortResultService->getDataByCommune($resto, $cles1, "restaurant");
                        
                        if(count($resto0["data"])>0){
                            $resto[0] = $resto0["data"];
                            $resto[1] = $resto0["nombre"];
                        }else{
                            $otherResto = true;
                        }
                    }

                    if($otherResto){
                        $otherResult = true;
                    }

                    if(count($resto) > 0){
                        $ids=array_map('App\Controller\RestaurantController::getIdAvisResto',$resto[0]);
                        $moyenneNote = $avisRestaurantRepository->getAllNoteById($ids);
                        $resto[0] = $restaurantController->mergeDatasAndAvis($resto[0],$moyenneNote);
                    }

                    $results[0] = array_merge($resto[0]);
                    $results[1] = $resto[1];
                }elseif($cles0 == "GOLF" || $cles0 == "GOLFS"){
                    $golf = $golfFranceRepository->getBySpecificClef($cles0, $cles1, $page, $size, $userId);
                    if(!count($golf[0])>0){
                        $golf = $golfFranceRepository->getBySpecificClefOther($cles0, $cles1, $page, $size, $userId);
                        $golf0 = $sortResultService->getDataByCommune($golf, $cles1, "golf");
                        
                        if(count($golf0["data"])>0){
                            $golf[0] = $golf0["data"];
                            $golf[1] = $golf0["nombre"];
                        }else{
                            $otherGolf = true;
                        }
                    }

                    $ids_golf= array_map('App\Service\SortResultService::getIdFromData', $golf[0]);
                    $moyenne_golfs= $avisGolfRepository->getAllNoteById($ids_golf);
                    $golf[0] = $golfFranceService->mergeDatasAndAvis($golf[0], $moyenne_golfs);

                    if($otherGolf){
                        $otherResult = true;
                    }

                    $results[0] = array_merge($golf[0]);
                    $results[1] = $golf[1];
                }elseif($cles0 == "TABAC" || $cles0 == "TABACS"){
                    $tabac = $tabacRepository->getBySpecificClef($cles0, $cles1, $page, $size);
                    if(!count($tabac[0])>0){
                        $tabac = $tabacRepository->getBySpecificClefOther($cles0, $cles1, $page, $size);
                        $tabac0 = $sortResultService->getDataByCommune($tabac, $cles1, "tabac");
                        
                        if(count($tabac0["data"])>0){
                            $tabac[0] = $tabac0["data"];
                            $tabac[1] = $tabac0["nombre"];
                        }else{
                            $otherTabac = true;
                        }
                    }

                    if($otherTabac){
                        $otherResult = true;
                    }

                    $results[0] = array_merge($tabac[0]);
                    $results[1] = $tabac[1];
                }elseif($cles0 == "FERME" || $cles0 == "FERMES"){
                    $ferme = $fermeGeomRepository->getBySpecificClef($cles0, $cles1, $page, $size);
                    if(!count($ferme[0])>0){
                        $ferme = $fermeGeomRepository->getBySpecificClefOther($cles0, $cles1, $page, $size);
                        $ferme0 = $sortResultService->getDataByCommune($ferme, $cles1, "ferme");
                        
                        if(count($ferme0["data"])>0){
                            $ferme[0] = $ferme0["data"];
                            $ferme[1] = $ferme0["nombre"];
                        }else{
                            $otherFerme = true;
                        }
                        
                    }

                    if($otherFerme){
                        $otherResult = true;
                    }

                    $results[0] = array_merge($ferme[0]);
                    $results[1] = $ferme[1];
                }elseif($cles0 == "STATION" || $cles0 == "STATIONS" || $cles0 == "STATION SERVICE" || $cles0 == "STATIONS SERVICES") {
                    $station = $stationServiceFrGeomRepository->getBySpecificClef($cles0, $cles1, $page, $size);
                    if(!count($station[0])>0){
                        $station = $stationServiceFrGeomRepository->getBySpecificClefOther($cles0, $cles1, $page, $size);
                        
                        $station0 = $sortResultService->getDataByCommune($station, $cles1, "station");
                        
                        if(count($station0["data"])>0){
                            $station[0] = $station0["data"];
                            $station[1] = $station0["nombre"];
                        }else{
                            $otherStation = true;
                        }
                    }
                    if($otherStation){
                        $otherResult = true;
                    }
                    $results[0] = array_merge($station[0]);
                    $results[1] = $station[1];
                }elseif($cles0 == "MARCHE" || $cles0 == "MARCHES"){
                    $cles1= intval($cles1);
                    $marche = $marcheRepository->getBySpecificClef($cles0, $cles1, $page, $size);
                    $otherMarche= false;

                    if(!count($marche[0])>0){
                        $marche = $marcheRepository->getBySpecificClefOther($cles0, $cles1, $page, $size);
                        $marche0 = $sortResultService->getDataByCommune($marche, $cles1, "marche", $cles0);
                        if(count($marche0["data"])>0){
                            $marche[0] = $marche0["data"];
                            $marche[1] = $marche0["nombre"];
                        }else{
                            $otherMarche = true;
                        }
                    }

                    if($otherMarche){
                        $otherResult = true;
                    }

                    $results[0] = array_merge($marche[0]);
                    $results[1] = $marche[1];
                }else{

                    $ferme = $fermeGeomRepository->getBySpecificClef($cles0, $cles1, $page, $size);
                    if(!count($ferme[0])>0){
                        $ferme = $fermeGeomRepository->getBySpecificClefOther($cles0, $cles1, $page, $size);
                        $ferme0 = $sortResultService->getDataByCommune($ferme, $cles1, "ferme", $cles0);
                        
                        if(count($ferme0["data"])>0){
                            $ferme[0] = $ferme0["data"];
                            $ferme[1] = $ferme0["nombre"];
                        }else{
                            $otherFerme = true;
                        }
                    }
    
                    $resto = $bddRestoRepository->getBySpecificClef($cles0, $cles1, $page, $size);
                    
                    if(!count($resto[0])>0){

                        $resto = $bddRestoRepository->getBySpecificClefOther($cles0, $cles1, $page, $size);

                        $resto0 = $sortResultService->getDataByCommune($resto, $cles1, "restaurant", $cles0);
                        
                        if(count($resto0["data"])>0){
                            $resto[0] = $resto0["data"];
                            $resto[1] = $resto0["nombre"];
                        }else{
                            $otherResto = true;
                        }

                    }

                    if(count($resto) > 0){
                        $ids=array_map('App\Controller\RestaurantController::getIdAvisResto',$resto[0]);
                        $moyenneNote = $avisRestaurantRepository->getAllNoteById($ids);
                        $resto[0] = $restaurantController->mergeDatasAndAvis($resto[0],$moyenneNote);
                    }

                    $golf = $golfFranceRepository->getBySpecificClef($cles0, $cles1, $page, $size, $userId);
                    if(!count($golf[0])>0){
                        $golf = $golfFranceRepository->getBySpecificClefOther($cles0, $cles1, $page, $size, $userId);
                        $golf0 = $sortResultService->getDataByCommune($golf, $cles1, "golf", $cles0);
                        
                        if(count($golf0["data"])>0){
                            $golf[0] = $golf0["data"];
                            $golf[1] = $golf0["nombre"];
                        }else{
                            $otherGolf = true;
                        }
                    }

                    if( count($golf[0])>0 ){
                        $ids_golf= array_map('App\Service\SortResultService::getIdFromData', $golf[0]);
                        $moyenne_golfs= $avisGolfRepository->getAllNoteById($ids_golf);
                        $golf[0] = $golfFranceService->mergeDatasAndAvis($golf[0], $moyenne_golfs);
                    }


                    $tabac = $tabacRepository->getBySpecificClef($cles0, $cles1, $page, $size);
                    if(!count($tabac[0])>0){
                        $tabac = $tabacRepository->getBySpecificClefOther($cles0, $cles1, $page, $size);
                        $tabac0 = $sortResultService->getDataByCommune($tabac, $cles1, "tabac", $cles0);
                        if(count($tabac0["data"])>0){
                            $tabac[0] = $tabac0["data"];
                            $tabac[1] = $tabac0["nombre"];
                        }else{
                            $otherTabac = true;
                        }
                    }
    
                    $station = $stationServiceFrGeomRepository->getBySpecificClef($cles0, $cles1, $page, $size);

                    if(!count($station[0])>0){
                        $station = $stationServiceFrGeomRepository->getBySpecificClefOther($cles0, $cles1, $page, $size);
                        $station0 = $sortResultService->getDataByCommune($station, $cles1, "station", $cles0);
                        
                        if(count($station0["data"])>0){
                            $station[0] = $station0["data"];
                            $station[1] = $station0["nombre"];
                        }else{
                            $otherStation = true;
                        }
                    }

                    $temp_cles1=intval($cles1) === 0 ? $cles1 : intval($cles1);
                    $marche = $marcheRepository->getBySpecificClef($cles0, $temp_cles1, $page, $size);
                    $otherMarche= false;
                    if(!count($marche[0])>0){
                        $marche = $marcheRepository->getBySpecificClefOther($cles0, $cles1, $page, $size);
                        $marche0 = $sortResultService->getDataByCommune($marche, $cles1, "marche", $cles0);
                        if(count($marche0["data"])>0){
                            $marche[0] = $marche0["data"];
                            $marche[1] = $marche0["nombre"];
                        }else{
                            $otherMarche = true;
                        }
                    }

                    $results[0] = [];

                    $results[1] = 0;

                    if(!$otherFerme || !$otherResto || !$otherStation || !$otherGolf || !$otherTabac || !$otherMarche){
                        if(!$otherFerme){
                            $results[0] = array_merge($ferme[0]);
                            $results[1] = $ferme[1];
                        }

                        if(!$otherStation){
                            $results[0] = array_merge($station[0], $results[0]);
                            $results[1] += $station[1];
                        }

                        if(!$otherResto){
                            $results[0] = array_merge($resto[0], $results[0]);
                            $results[1] += $resto[1];
                        }


                        if(!$otherGolf){
                            $results[0] = array_merge($golf[0], $results[0]);
                            $results[1] += $golf[1];
                        }

                        if(!$otherTabac){
                            $results[0] = array_merge($tabac[0], $results[0]);
                            $results[1] += $tabac[1];
                        }

                        if(!$otherMarche){
                            $results[0] = array_merge($marche[0], $results[0]);
                            $results[1] += $marche[1];
                        }

                    }else{
                        $results[0] = array_merge($resto[0] , $station[0], $ferme[0], $golf[0], $tabac[0], $marche[0]);
                        $results[1] = $station[1] + $ferme[1] + $resto[1] + $golf[1] + $tabac[1] + $marche[1];
                        $otherResult = true;
                    }
                }

                $results[2] = "tous";

                break;
        }

        ///// les resto pastille si l'utilisateur connecter
        $arrayIdResto = [];
        //// all my tribu t.
        $tribu_t_owned = $userRepository->getListTableTribuT_owned(); /// [ [table_name => ..., name_tribu_t_muable => ..., logo_path => ...], ...]

        //// description tribu T with ID restaurant pastille
        $arrayIdResto = $tribu_T_Service->getEntityRestoPastilled($tribu_t_owned); /// [ [ id_resto => ..., tableName => ..., name_tribu_t_muable => ..., logo_path => ...], ... ]

        //// list resto pastille dans le tribu G
        $restoPastilleInTribuG= $tributGService->getEntityRestoPastilled($this->getUser()); /// [ [ id_resto => ..., tableName => ..., name_tribu_t_muable => ..., logo_path => ...], ... ]
        
        $arrayIdResto= array_merge( $arrayIdResto, $restoPastilleInTribuG );



        if(str_contains($request->getPathInfo(), '/api/search')){
            return $this->json([
                "results" => $results,
                "allIdRestoPastille" => $arrayIdResto,
                "type" => $type,
                "cles0" => $cles0,
                "cles1" => $cles1,
                "origin_cles1" => $origin_cles1
            ], 200);
        }

        $resultSort = array();

        $resultSort0 = $sortResultService->shortResult($cles0, $cles1, $results);

        $nombreResult = $results[1];

        $type = $results[2];

        array_push($resultSort, [0 => $resultSort0, 1 => $nombreResult, 2 => $type]);

        $results = $resultSort[0];

        for($i=0; $i<count($results[0]) ; $i++){
            $r = $results[0][$i];
            $photo = null;
            if(array_key_exists("resto",$results[0][$i])){
                $photo = $this->getPhotoPreviewResto("restaurant",$filesyst, $r["id"]);
            }
            if(array_key_exists("golf",$results[0][$i])){
                $photo = $this->getPhotoPreviewResto("golf",$filesyst, $r["id"]);
            }
            $results[0][$i]["photo"] = $photo;
        }

        // dd($results);
       
        return $this->render("home/search_result.html.twig", [
            "userConnected" => $userConnected,
            "profil" => $profil,
            "results" => $results,
            "otherResult" => $otherResult,
            "type" => $type,
            "cles0" => $cles0,
            "cles1" => $cles1,
            "page" => $page,
            "amisTributG" => $amis_in_tributG,
        ]);
    }

    #[Route("/fetch_data/search/{type}" , name:"app_fetch_data_search" , methods: "GET")]
    public function fetchDataSearch(
        $type = null,
        Request $request,
        StationServiceFrGeomRepository $stationServiceFrGeomRepository,
        FermeGeomRepository $fermeGeomRepository,
        BddRestoRepository $bddRestoRepository,
        SortResultService $sortResultService,
        StringTraitementService $stringTraitementService,
        UserRepository $userRepository,
        TributGService $tributGService,
        Tribu_T_Service $tribu_T_Service,
        GolfFranceRepository $golfFranceRepository,
        AvisGolfRepository $avisGolfRepository,
        GolfFranceService $golfFranceService,
        TabacRepository $tabacRepository,
        MarcheRepository $marcheRepository,
        RestaurantController $restaurantController,
        AvisRestaurantRepository $avisRestaurantRepository,
    ){
        $origin_cles1= $request->query->get("cles1"); //// use for searching geojson API OpenStreetMap

        $cles0 = $request->query->get("cles0") ? $stringTraitementService->normalizedString($stringTraitementService->removeWhiteSpace($request->query->get("cles0"))) : "";
        $cles1 = $request->query->get("cles1") ? $stringTraitementService->normalizedString($stringTraitementService->removeWhiteSpace($request->query->get("cles1"))) : "";
        $page = $request->query->get("page") ? intval($request->query->get("page")) : 1 ;

        $condition = ($cles0 === "station" || $cles0 === "ferme" || $cles0 === "restaurant" || $cles0 === "resto" || $cles0 === "tabac" || $cles0 === "golf" || $cles0 === "marche" || $cles0 === "tous"  );
        $type= $condition ? $cles0: $type;
        $cles0= $condition ? "": $cles0;

        $size = 20;

        $otherResult = false;
        switch (strtolower($type)){
            case "ferme":
                $ferme = $fermeGeomRepository->getBySpecificClef($cles0, $cles1, $page, $size);
                if(!count($ferme[0])>0){
                    $ferme = $fermeGeomRepository->getBySpecificClefOther($cles0, $cles1, $page, $size);
                    $ferme0 = $sortResultService->getDataByCommune($ferme, $cles1, "ferme", $cles0);
                        
                    if(count($ferme0["data"])>0){
                        $ferme[0] = $ferme0["data"];
                        $ferme[1] = $ferme0["nombre"];
                    }else{
                        $otherResult = true;
                    }
                }
                
                $results = $ferme;
                break;

            case "restaurant":
                $resto = $bddRestoRepository->getBySpecificClef($cles0, $cles1, $page, $size);
                if(!count($resto[0])>0){

                    $resto = $bddRestoRepository->getBySpecificClefOther($cles0, $cles1, $page, $size);

                    $resto0 = $sortResultService->getDataByCommune($resto, $cles1, "restaurant", $cles0);
                        
                    if(count($resto0["data"])>0){
                        $resto[0] = $resto0["data"];
                        $resto[1] = $resto0["nombre"];
                    }else{
                        $otherResult = true;
                    }
                
                }
                
                if(count($resto) > 0){
                    $ids=array_map('App\Controller\RestaurantController::getIdAvisResto',$resto[0]);
                    $moyenneNote = $avisRestaurantRepository->getAllNoteById($ids);
                    $resto[0] = $restaurantController->mergeDatasAndAvis($resto[0],$moyenneNote);
                }

                $results = $resto;

                break;

            case "marche":
                $cles1= intval($cles1) === 0 ? $cles1 : intval($cles1);

                $marche = $marcheRepository->getBySpecificClef($cles0, $cles1, $page, $size);
                if(!count($marche[0])>0){

                    $marche = $marcheRepository->getBySpecificClefOther($cles0, $cles1, $page, $size);

                    $marche0 = $sortResultService->getDataByCommune($marche, $cles1, "marche", $cles0);
                        
                    if(count($marche0["data"])>0){
                        $marche[0] = $marche0["data"];
                        $marche[1] = $marche0["nombre"];
                    }else{
                        $otherResult = true;
                    }
                
                }
                $results = $marche;
                break;

            case "golf":
                $golf = $golfFranceRepository->getBySpecificClef($cles0, $cles1, $page, $size, $userId);
                if(!count($golf[0])>0){
                    $golf = $golfFranceRepository->getBySpecificClefOther($cles0, $cles1, $page, $size, $userId);
                    $golf0 = $sortResultService->getDataByCommune($golf, $cles1, "golf", $cles0);
                        
                    if(count($golf0["data"])>0){
                        $golf[0] = $golf0["data"];
                        $golf[1] = $golf0["nombre"];
                    }else{
                        $otherResult = true;
                    }
                }

                $ids_golf= array_map('App\Service\SortResultService::getIdFromData', $golf[0]);
                $moyenne_golfs= $avisGolfRepository->getAllNoteById($ids_golf);
                $golf[0] = $golfFranceService->mergeDatasAndAvis($golf[0], $moyenne_golfs);

                $results = $golf;

                break;

            case "tabac":
                $tabac = $tabacRepository->getBySpecificClef($cles0, $cles1, $page, $size);
                if(!count($tabac[0])>0){
                    $tabac = $tabacRepository->getBySpecificClefOther($cles0, $cles1, $page, $size);
                    $tabac0 = $sortResultService->getDataByCommune($tabac, $cles1, "tabac", $cles0);
                        
                    if(count($tabac0["data"])>0){
                        $tabac[0] = $tabac0["data"];
                        $tabac[1] = $tabac0["nombre"];
                    }else{
                        $otherResult = true;
                    }
                }
                $results = $tabac;
                break;

            case "station":
                $station = $stationServiceFrGeomRepository->getBySpecificClef($cles0, $cles1, $page, $size);
                if(!count($station[0])>0){
                    $station = $stationServiceFrGeomRepository->getBySpecificClefOther($cles0, $cles1, $page, $size);
                    $station0 = $sortResultService->getDataByCommune($station, $cles1, "station", $cles0);
                    if(count($station0["data"])>0){
                        $station[0] = $station0["data"];
                        $station[1] = $station0["nombre"];
                    }else{
                        $otherResult = true;
                    }
                }
                $results = $station;
                break;

            case "station service":
                $station = $stationServiceFrGeomRepository->getBySpecificClef($cles0, $cles1, $page, $size);
                if(!count($station[0])>0){
                    $station = $stationServiceFrGeomRepository->getBySpecificClefOther($cles0, $cles1, $page, $size);
                    $station0 = $sortResultService->getDataByCommune($station, $cles1, "station", $cles0);
                    if(count($station0["data"])>0){
                        $station[0] = $station0["data"];
                        $station[1] = $station0["nombre"];
                    }else{
                        $otherResult = true;
                    }
                }
                $results = $station;
                break;

            default:
                //dd($cles0);
                $otherResto = false;
                $otherFerme = false;
                $otherStation = false;
                $otherGolf = false;
                $otherTabac = false;

                if($cles0 == "RESTO" || $cles0 == "RESTOS" || $cles0 == "RESTAURANT" || $cles0 == "RESTAURANTS"){
                    $resto = $bddRestoRepository->getBySpecificClef($cles0, $cles1, $page, $size);
                    if(!count($resto[0])>0){
                        $resto = $bddRestoRepository->getBySpecificClefOther($cles0, $cles1, $page, $size);

                        $resto0 = $sortResultService->getDataByCommune($resto, $cles1, "restaurant");
                        
                        if(count($resto0["data"])>0){
                            $resto[0] = $resto0["data"];
                            $resto[1] = $resto0["nombre"];
                        }else{
                            $otherResto = true;
                        }
                    }

                    if($otherResto){
                        $otherResult = true;
                    }

                    if(count($resto) > 0){
                        $ids=array_map('App\Controller\RestaurantController::getIdAvisResto',$resto[0]);
                        $moyenneNote = $avisRestaurantRepository->getAllNoteById($ids);
                        $resto[0] = $restaurantController->mergeDatasAndAvis($resto[0],$moyenneNote);
                    }

                    $results[0] = array_merge($resto[0]);
                    $results[1] = $resto[1];
                }elseif($cles0 == "GOLF" || $cles0 == "GOLFS"){
                    $golf = $golfFranceRepository->getBySpecificClef($cles0, $cles1, $page, $size, $userId);
                    if(!count($golf[0])>0){
                        $golf = $golfFranceRepository->getBySpecificClefOther($cles0, $cles1, $page, $size, $userId);
                        $golf0 = $sortResultService->getDataByCommune($golf, $cles1, "golf");
                        
                        if(count($golf0["data"])>0){
                            $golf[0] = $golf0["data"];
                            $golf[1] = $golf0["nombre"];
                        }else{
                            $otherGolf = true;
                        }
                    }

                    $ids_golf= array_map('App\Service\SortResultService::getIdFromData', $golf[0]);
                    $moyenne_golfs= $avisGolfRepository->getAllNoteById($ids_golf);
                    $golf[0] = $golfFranceService->mergeDatasAndAvis($golf[0], $moyenne_golfs);

                    if($otherGolf){
                        $otherResult = true;
                    }

                    $results[0] = array_merge($golf[0]);
                    $results[1] = $golf[1];
                }elseif($cles0 == "TABAC" || $cles0 == "TABACS"){
                    $tabac = $tabacRepository->getBySpecificClef($cles0, $cles1, $page, $size);
                    if(!count($tabac[0])>0){
                        $tabac = $tabacRepository->getBySpecificClefOther($cles0, $cles1, $page, $size);
                        $tabac0 = $sortResultService->getDataByCommune($tabac, $cles1, "tabac");
                        
                        if(count($tabac0["data"])>0){
                            $tabac[0] = $tabac0["data"];
                            $tabac[1] = $tabac0["nombre"];
                        }else{
                            $otherTabac = true;
                        }
                    }

                    if($otherTabac){
                        $otherResult = true;
                    }

                    $results[0] = array_merge($tabac[0]);
                    $results[1] = $tabac[1];
                }elseif($cles0 == "FERME" || $cles0 == "FERMES"){
                    $ferme = $fermeGeomRepository->getBySpecificClef($cles0, $cles1, $page, $size);
                    if(!count($ferme[0])>0){
                        $ferme = $fermeGeomRepository->getBySpecificClefOther($cles0, $cles1, $page, $size);
                        $ferme0 = $sortResultService->getDataByCommune($ferme, $cles1, "ferme");
                        
                        if(count($ferme0["data"])>0){
                            $ferme[0] = $ferme0["data"];
                            $ferme[1] = $ferme0["nombre"];
                        }else{
                            $otherFerme = true;
                        }
                        
                    }

                    if($otherFerme){
                        $otherResult = true;
                    }

                    $results[0] = array_merge($ferme[0]);
                    $results[1] = $ferme[1];
                }elseif($cles0 == "STATION" || $cles0 == "STATIONS" || $cles0 == "STATION SERVICE" || $cles0 == "STATIONS SERVICES") {
                    $station = $stationServiceFrGeomRepository->getBySpecificClef($cles0, $cles1, $page, $size);
                    if(!count($station[0])>0){
                        $station = $stationServiceFrGeomRepository->getBySpecificClefOther($cles0, $cles1, $page, $size);
                        
                        $station0 = $sortResultService->getDataByCommune($station, $cles1, "station");
                        
                        if(count($station0["data"])>0){
                            $station[0] = $station0["data"];
                            $station[1] = $station0["nombre"];
                        }else{
                            $otherStation = true;
                        }
                    }
                    if($otherStation){
                        $otherResult = true;
                    }
                    $results[0] = array_merge($station[0]);
                    $results[1] = $station[1];
                }elseif($cles0 == "MARCHE" || $cles0 == "MARCHES"){
                    $cles1= intval($cles1);
                    $marche = $marcheRepository->getBySpecificClef($cles0, $cles1, $page, $size);
                    $otherMarche= false;

                    if(!count($marche[0])>0){
                        $marche = $marcheRepository->getBySpecificClefOther($cles0, $cles1, $page, $size);
                        $marche0 = $sortResultService->getDataByCommune($marche, $cles1, "marche", $cles0);
                        if(count($marche0["data"])>0){
                            $marche[0] = $marche0["data"];
                            $marche[1] = $marche0["nombre"];
                        }else{
                            $otherMarche = true;
                        }
                    }

                    if($otherMarche){
                        $otherResult = true;
                    }

                    $results[0] = array_merge($marche[0]);
                    $results[1] = $marche[1];
                }else{

                    $ferme = $fermeGeomRepository->getBySpecificClef($cles0, $cles1, $page, $size);
                    if(!count($ferme[0])>0){
                        $ferme = $fermeGeomRepository->getBySpecificClefOther($cles0, $cles1, $page, $size);
                        $ferme0 = $sortResultService->getDataByCommune($ferme, $cles1, "ferme", $cles0);
                        
                        if(count($ferme0["data"])>0){
                            $ferme[0] = $ferme0["data"];
                            $ferme[1] = $ferme0["nombre"];
                        }else{
                            $otherFerme = true;
                        }
                    }
    
                    $resto = $bddRestoRepository->getBySpecificClef($cles0, $cles1, $page, $size);
                    
                    if(!count($resto[0])>0){

                        $resto = $bddRestoRepository->getBySpecificClefOther($cles0, $cles1, $page, $size);

                        $resto0 = $sortResultService->getDataByCommune($resto, $cles1, "restaurant", $cles0);
                        
                        if(count($resto0["data"])>0){
                            $resto[0] = $resto0["data"];
                            $resto[1] = $resto0["nombre"];
                        }else{
                            $otherResto = true;
                        }

                    }

                    if(count($resto) > 0){
                        $ids=array_map('App\Controller\RestaurantController::getIdAvisResto',$resto[0]);
                        $moyenneNote = $avisRestaurantRepository->getAllNoteById($ids);
                        $resto[0] = $restaurantController->mergeDatasAndAvis($resto[0],$moyenneNote);
                    }

                    $golf = $golfFranceRepository->getBySpecificClef($cles0, $cles1, $page, $size, $userId);
                    if(!count($golf[0])>0){
                        $golf = $golfFranceRepository->getBySpecificClefOther($cles0, $cles1, $page, $size, $userId);
                        $golf0 = $sortResultService->getDataByCommune($golf, $cles1, "golf", $cles0);
                        
                        if(count($golf0["data"])>0){
                            $golf[0] = $golf0["data"];
                            $golf[1] = $golf0["nombre"];
                        }else{
                            $otherGolf = true;
                        }
                    }

                    if( count($golf[0])>0 ){
                        $ids_golf= array_map('App\Service\SortResultService::getIdFromData', $golf[0]);
                        $moyenne_golfs= $avisGolfRepository->getAllNoteById($ids_golf);
                        $golf[0] = $golfFranceService->mergeDatasAndAvis($golf[0], $moyenne_golfs);
                    }


                    $tabac = $tabacRepository->getBySpecificClef($cles0, $cles1, $page, $size);
                    if(!count($tabac[0])>0){
                        $tabac = $tabacRepository->getBySpecificClefOther($cles0, $cles1, $page, $size);
                        $tabac0 = $sortResultService->getDataByCommune($tabac, $cles1, "tabac", $cles0);
                        if(count($tabac0["data"])>0){
                            $tabac[0] = $tabac0["data"];
                            $tabac[1] = $tabac0["nombre"];
                        }else{
                            $otherTabac = true;
                        }
                    }
    
                    $station = $stationServiceFrGeomRepository->getBySpecificClef($cles0, $cles1, $page, $size);

                    if(!count($station[0])>0){
                        $station = $stationServiceFrGeomRepository->getBySpecificClefOther($cles0, $cles1, $page, $size);
                        $station0 = $sortResultService->getDataByCommune($station, $cles1, "station", $cles0);
                        
                        if(count($station0["data"])>0){
                            $station[0] = $station0["data"];
                            $station[1] = $station0["nombre"];
                        }else{
                            $otherStation = true;
                        }
                    }

                    $temp_cles1=intval($cles1) === 0 ? $cles1 : intval($cles1);
                    $marche = $marcheRepository->getBySpecificClef($cles0, $temp_cles1, $page, $size);
                    $otherMarche= false;
                    if(!count($marche[0])>0){
                        $marche = $marcheRepository->getBySpecificClefOther($cles0, $cles1, $page, $size);
                        $marche0 = $sortResultService->getDataByCommune($marche, $cles1, "marche", $cles0);
                        if(count($marche0["data"])>0){
                            $marche[0] = $marche0["data"];
                            $marche[1] = $marche0["nombre"];
                        }else{
                            $otherMarche = true;
                        }
                    }

                    $results[0] = [];

                    $results[1] = 0;

                    if(!$otherFerme || !$otherResto || !$otherStation || !$otherGolf || !$otherTabac || !$otherMarche){
                        if(!$otherFerme){
                            $results[0] = array_merge($ferme[0]);
                            $results[1] = $ferme[1];
                        }

                        if(!$otherStation){
                            $results[0] = array_merge($station[0], $results[0]);
                            $results[1] += $station[1];
                        }

                        if(!$otherResto){
                            $results[0] = array_merge($resto[0], $results[0]);
                            $results[1] += $resto[1];
                        }


                        if(!$otherGolf){
                            $results[0] = array_merge($golf[0], $results[0]);
                            $results[1] += $golf[1];
                        }

                        if(!$otherTabac){
                            $results[0] = array_merge($tabac[0], $results[0]);
                            $results[1] += $tabac[1];
                        }

                        if(!$otherMarche){
                            $results[0] = array_merge($marche[0], $results[0]);
                            $results[1] += $marche[1];
                        }

                    }else{
                        $results[0] = array_merge($resto[0] , $station[0], $ferme[0], $golf[0], $tabac[0], $marche[0]);
                        $results[1] = $station[1] + $ferme[1] + $resto[1] + $golf[1] + $tabac[1] + $marche[1];
                        $otherResult = true;
                    }
                }

                $results[2] = "tous";

                break;
        }

        ///// les resto pastille si l'utilisateur connecter
        $arrayIdResto = [];
        //// all my tribu t.
        $tribu_t_owned = $userRepository->getListTableTribuT_owned(); /// [ [table_name => ..., name_tribu_t_muable => ..., logo_path => ...], ...]

        //// description tribu T with ID restaurant pastille
        $arrayIdResto = $tribu_T_Service->getEntityRestoPastilled($tribu_t_owned); /// [ [ id_resto => ..., tableName => ..., name_tribu_t_muable => ..., logo_path => ...], ... ]

        //// list resto pastille dans le tribu G
        $restoPastilleInTribuG= $tributGService->getEntityRestoPastilled($this->getUser()); /// [ [ id_resto => ..., tableName => ..., name_tribu_t_muable => ..., logo_path => ...], ... ]
        
        $arrayIdResto= array_merge( $arrayIdResto, $restoPastilleInTribuG );

        return $this->json([
            "data" => $results[0],
            "pastille" => $arrayIdResto,
            "type" => $type,
            "cles0" => $cles0,
            "cles1" => $cles1,
            "origin_cles1" => $origin_cles1
        ], 200);
    }

    #[Route("/api/get_one/{type}/{id}", name: "api_get_one_item", methods: "GET")]
    public function getOneItem(
        $type, $id,
        BddRestoRepository $bddRestoRepository,
        AvisRestaurantRepository $avisRestaurantRepository,
        
        FermeGeomRepository $fermeGeomRepository,
        StationServiceFrGeomRepository $stationServiceFrGeomRepository,
        GolfFranceRepository $golfFranceRepository,
        TabacRepository $tabacRepository
    ){
        $result= null;

        if( $type === "resto"){
            $data = $bddRestoRepository->getOneItemByID($id);
            $moyenneNote = $avisRestaurantRepository->getNoteById($id);
            if( $moyenneNote !== null ){
                $data["moyenne_note"]= $moyenneNote["moyenne_note"];
            }
        }else if( $type === "ferme" ){
            $result = $fermeGeomRepository->getOneItemByID($id);
        }else if( $type === "station" ){
            $result = $stationServiceFrGeomRepository->getOneItemByID($id);
        }else if( $type === "golf" ){
            $result = $golfFranceRepository->getOneItemByID($id);
        }else if( $type === "tabac" ){
            $result = $tabacRepository->getOneItemByID($id);
        }else{
            $result = null;
        }

        return $this->json([
            "result" => $result
        ]);
    }

    #[Route("/user/demande/devenir/partenaire",name:"app_get_partenaire",methods:["POST","GET"])]
    public function askToGetPartenaire(Status $status){

        $userConnected= $status->userProfilService($this->getUser());
        return $this->render("user/devenir_partenaire.html.twig",[
            "userConnected" => $userConnected
    ]);
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

#[Route("/number_etablisement/{type}/{dep}", name:"app_get_number_etablisements",methods:["POST","GET"])]
    public function getNumberPerDepRubrique(
        $type,
        $dep,
        BddRestoRepository $bddRestoRepository,
        FermeGeomRepository $fermeGeomRepository,
        StationServiceFrGeomRepository $stationServiceFrGeomRepository,
        GolfFranceRepository $golfFranceRepository,
        TabacRepository $tabacRepository,
        MarcheRepository $marcheRepository
    ){
        $dep_specifique= intval($dep) === 0 ? null : ( strlen($dep) === 1 ?  "0" . intval($dep) : $dep);
        if( $type === "resto" || $type === "restaurant"){
            $nbr_etablisement_per_dep = $bddRestoRepository->getAccountAllPerDep($dep_specifique);
        }else if( $type === "ferme"){
            $nbr_etablisement_per_dep = $fermeGeomRepository->getAccountAllPerDep($dep_specifique);
        }else if( $type === "station"){
            $nbr_etablisement_per_dep = $stationServiceFrGeomRepository->getAccountAllPerDep($dep_specifique);
        }else if( $type === "golf"){
            $nbr_etablisement_per_dep = $golfFranceRepository->getAccountAllPerDep($dep_specifique);
        }else if( $type === "tabac"){
            $nbr_etablisement_per_dep = $tabacRepository->getAccountAllPerDep($dep_specifique);
        }else if( $type === "marche"){
            $dep_specifique= intval($dep_specifique);
            $nbr_etablisement_per_dep = $marcheRepository->getAccountAllPerDep($dep_specifique);
        }else if ($type === "tous"){
            
            $resto = $bddRestoRepository->getAccountAllPerDep($dep_specifique);
            $ferme = $fermeGeomRepository->getAccountAllPerDep($dep_specifique);
            $station = $stationServiceFrGeomRepository->getAccountAllPerDep($dep_specifique);
            $golf = $golfFranceRepository->getAccountAllPerDep($dep_specifique);
            $tabac = $tabacRepository->getAccountAllPerDep($dep_specifique);
            $marche = $marcheRepository->getAccountAllPerDep($dep_specifique);


            $nbr_etablisement_per_dep= SortResultService::mergeByCalculateData([
                "resto" => $resto, 
                "ferme" => $ferme, 
                "station" => $station, 
                "golf" => $golf, 
                "tabac" => $tabac,
                "marche" => $marche
            ]);

        }

        $total= 0;
        foreach ($nbr_etablisement_per_dep as $sum_per_dep){
            $total += $sum_per_dep['account_per_dep'];
        }

        return $this->json([
            "type" => $type,
            "departement" => $dep,
            "total" => $total,
            "nbr_etablisement_per_dep" => $nbr_etablisement_per_dep
        ], 200);
    }

}
