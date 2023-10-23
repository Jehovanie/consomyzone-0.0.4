<?php

namespace App\Controller;

use App\Service\Status;
use App\Entity\Consumer;
use App\Entity\Supplier;
use App\Service\TributGService;
use App\Service\Tribu_T_Service;
use App\Repository\UserRepository;
use App\Service\SortResultService;
use App\Repository\TabacRepository;
use App\Repository\BddRestoRepository;
use App\Repository\FermeGeomRepository;
use App\Repository\GolfFranceRepository;
use App\Service\StringTraitementService;
use Doctrine\ORM\EntityManagerInterface;
use App\Repository\DepartementRepository;
use App\Repository\AvisRestaurantRepository;
use App\Repository\CommuneGeoCoderRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use App\Repository\StationServiceFrGeomRepository;
use App\Service\Tribu_T_ServiceNew;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;


class HomeController extends AbstractController
{
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
        Tribu_T_ServiceNew $srvTribuT,
        CommuneGeoCoderRepository $communeGeoCoderRepository,
        GolfFranceRepository $golfFranceRepository,
        TabacRepository $tabacRepository,
        RestaurantController $restaurantController,
        AvisRestaurantRepository $avisRestaurantRepository
        
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

        $amis_in_tributG = [];

        if($user && $user->getType()!="Type"){
            // ////profil user connected
            $profil = $tributGService->getProfil($user, $entityManager);

            $id_amis_tributG = $tributGService->getAllTributG($profil[0]->getTributG());  /// [ ["user_id" => ...], ... ]
           
            ///to contains profil user information
            
            foreach ($id_amis_tributG  as $id_amis) { /// ["user_id" => ...]

                ///check their type consumer of supplier
                $user_amis = $userRepository->find(intval($id_amis["user_id"]));

                if( $user_amis && $user_amis->getType() != 'Type'){

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
            //dd($userId, $id_amis_tributG);
        }

        $origin_cles1= $request->query->get("cles1"); //// use for searching geojson API OpenStreetMap

        $cles0 = $request->query->get("cles0") ? $stringTraitementService->normalizedString($stringTraitementService->removeWhiteSpace($request->query->get("cles0"))) : "";
        $cles1 = $request->query->get("cles1") ? $stringTraitementService->normalizedString($stringTraitementService->removeWhiteSpace($request->query->get("cles1"))) : "";
        $page = $request->query->get("page") ? intval($request->query->get("page")) : 1 ;

        $condition = ($cles0 === "station" || $cles0 === "ferme" || $cles0 === "restaurant" || $cles0 === "resto" || $cles0 === "tabac" || $cles0 === "golf" || $cles0 === "tous"  );
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
                }elseif ($cles0 == "STATION" || $cles0 == "STATIONS" || $cles0 == "STATION SERVICE" || $cles0 == "STATIONS SERVICES") {
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

                    $golf = $golfFranceRepository->getBySpecificClef($cles0, $cles1, $page, $size);
                    if(!count($golf[0])>0){
                        $golf = $golfFranceRepository->getBySpecificClefOther($cles0, $cles1, $page, $size);
                        $golf0 = $sortResultService->getDataByCommune($golf, $cles1, "golf", $cles0);
                        
                        if(count($golf0["data"])>0){
                            $golf[0] = $golf0["data"];
                            $golf[1] = $golf0["nombre"];
                        }else{
                            $otherGolf = true;
                        }
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

                    $results[0] = [];

                    $results[1] = 0;

                    if(!$otherFerme || !$otherResto || !$otherStation || !$otherGolf || !$otherTabac){
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

                    }else{
                        $results[0] = array_merge($resto[0] , $station[0], $ferme[0], $golf[0], $tabac[0]);
                        $results[1] = $station[1] + $ferme[1] + $resto[1] + $golf[1] + $tabac[1];
                        $otherResult = true;
                    }

                }

                $results[2] = "tous";

                break;
        }

        ///// les resto pastille si l'utilisateur connecter
        $arrayIdResto = [];
        //// all my tribu t.
        //$tribu_t_owned = $userRepository->getListTableTribuT_owned(); /// [ [table_name => ..., name_tribu_t_muable => ..., logo_path => ...], ...]
        $tribu_t_owned = $tribuTOwned = $srvTribuT->getAllTribuTOwnedInfos($user);
        //// description tribu T with ID restaurant pastille
        $arrayIdResto = $srvTribuT->getEntityRestoPastilled($tribu_t_owned); /// [ [ id_resto => ..., tableName => ..., name_tribu_t_muable => ..., logo_path => ...], ... ]
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

    #[Route("/user/demande/devenir/partenaire",name:"app_get_partenaire",methods:["POST","GET"])]
    public function askToGetPartenaire(Status $status){

        $userConnected= $status->userProfilService($this->getUser());
        return $this->render("user/devenir_partenaire.html.twig",[
            "userConnected" => $userConnected
    ]);
    }

}
