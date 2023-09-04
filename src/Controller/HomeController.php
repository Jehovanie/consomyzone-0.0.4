<?php

namespace App\Controller;

use App\Service\Status;
use App\Entity\Consumer;
use App\Entity\Supplier;
use App\Service\TributGService;
use App\Repository\UserRepository;
use App\Service\SortResultService;
use App\Repository\BddRestoRepository;
use App\Repository\FermeGeomRepository;
use App\Service\StringTraitementService;
use Doctrine\ORM\EntityManagerInterface;
use App\Repository\DepartementRepository;
use App\Repository\CommuneGeoCoderRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use App\Repository\StationServiceFrGeomRepository;
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
        CommuneGeoCoderRepository $communeGeoCoderRepository
        
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

        $userConnected = $status->userProfilService($this->getUser());

        $userType = $user->getType();

        $userId = $user->getId();

        if ($userType == "consumer") {

            $profil = $entityManager->getRepository(Consumer::class)->findByUserId($userId);
        } else {

            $profil = $entityManager->getRepository(Supplier::class)->findByUserId($userId);
        }

        // return $this->redirectToRoute("restaurant_all_dep");
        $statusProfile = $status->statusFondateur($user);

        $amis_in_tributG = [];

        if($user){
            // ////profil user connected
            $profil = $tributGService->getProfil($user, $entityManager);

            $id_amis_tributG = $tributGService->getAllTributG($profil[0]->getTributG());  /// [ ["user_id" => ...], ... ]

            ///to contains profil user information
            
            foreach ($id_amis_tributG  as $id_amis) { /// ["user_id" => ...]

                ///check their type consumer of supplier
                $user_amis = $userRepository->find(intval($id_amis["user_id"]));
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

        $origin_cles1= $request->query->get("cles1"); //// use for searching geojson API OpenStreetMap

        $cles0 = $request->query->get("cles0") ? $stringTraitementService->normalizedString($stringTraitementService->removeWhiteSpace($request->query->get("cles0"))) : "";
        $cles1 = $request->query->get("cles1") ? $stringTraitementService->normalizedString($stringTraitementService->removeWhiteSpace($request->query->get("cles1"))) : "";
        $page = $request->query->get("page") ? intval($request->query->get("page")) : 1 ;

        $condition = ($cles0 === "station" || $cles0 === "ferme" || $cles0 === "restaurant" || $cles0 === "resto" || $cles0 === "tous"  );
        $type= $condition ? $cles0: $type;
        $cles0= $condition ? "": $cles0;
        
        $size = 20;

        // $all = [
        //     "station" => $stationServiceFrGeomRepository->getBySpecificClef($cles0, $cles1, $page, $size),
        //     "ferme" => $fermeGeomRepository->getBySpecificClef($cles0, $cles1, $page, $size)
        // ];

        $otherResult = false;

        //dd($all["station"]);

        switch (strtolower($type)){
            case "ferme":
                $ferme = $fermeGeomRepository->getBySpecificClef($cles0, $cles1, $page, $size);
                if(!count($ferme[0])>0){
                    $ferme = $fermeGeomRepository->getBySpecificClefOther($cles0, $cles1, $page, $size);
                    $otherResult = true;
                }
                $results = $ferme;
                break;
            case "restaurant":
                $resto = $bddRestoRepository->getBySpecificClef($cles0, $cles1, $page, $size);
                if(!count($resto[0])>0){
                    $resto = $bddRestoRepository->getBySpecificClefOther($cles0, $cles1, $page, $size);
                    $otherResult = true;
                }
                $results = $resto;
                break;
            case "station":
            case "station service":
                $station = $stationServiceFrGeomRepository->getBySpecificClef($cles0, $cles1, $page, $size);
                if(!count($station[0])>0){
                    $station = $stationServiceFrGeomRepository->getBySpecificClefOther($cles0, $cles1, $page, $size);
                    $otherResult = true;
                }
                $results = $station;
                break;
            default:
                //dd($cles0);
                $otherResto = false;
                $otherFerme = false;
                $otherStation = false;
                if($cles0 == "RESTO" || $cles0 == "RESTOS" || $cles0 == "RESTAURANT" || $cles0 == "RESTAURANTS"){
                    $resto = $bddRestoRepository->getBySpecificClef($cles0, $cles1, $page, $size);
                    if(!count($resto[0])>0){
                        $resto = $bddRestoRepository->getBySpecificClefOther($cles0, $cles1, $page, $size);
                        $otherResto = true;
                    }

                    if($otherResto){
                        $otherResult = true;
                    }

                    $results[0] = array_merge($resto[0]);
                    $results[1] = $resto[1];
                }elseif($cles0 == "FERME" || $cles0 == "FERMES"){
                    $ferme = $fermeGeomRepository->getBySpecificClef($cles0, $cles1, $page, $size);
                    if(!count($ferme[0])>0){
                        $ferme = $fermeGeomRepository->getBySpecificClefOther($cles0, $cles1, $page, $size);
                        $otherFerme = true;
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
                        $otherStation = true;
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
                        $otherFerme = true;
                    }
    
                    $resto = $bddRestoRepository->getBySpecificClef($cles0, $cles1, $page, $size);
                    if(!count($resto[0])>0){
                        $resto = $bddRestoRepository->getBySpecificClefOther($cles0, $cles1, $page, $size);
                        $otherResto = true;
                    }
    
                    $station = $stationServiceFrGeomRepository->getBySpecificClef($cles0, $cles1, $page, $size);
                    if(!count($station[0])>0){
                        $station = $stationServiceFrGeomRepository->getBySpecificClefOther($cles0, $cles1, $page, $size);
                        $otherStation = true;
                    }
    
                    if(!$otherFerme && !$otherResto && !$otherStation){
                        // $results[0] = array_merge($station[0] , $ferme[0], $resto[0]);
                        $results[0] = array_merge($resto[0] , $station[0], $ferme[0]);
                        $results[1] = $station[1] + $ferme[1] + $resto[1];
                    }elseif(!$otherFerme && $otherResto && $otherStation){
                        $results[0] = array_merge($ferme[0]);
                        $results[1] = $ferme[1];
                    }elseif($otherFerme && !$otherResto && $otherStation){
                        $results[0] = array_merge($resto[0]);
                        $results[1] = $resto[1];
                    }elseif($otherFerme && $otherResto && !$otherStation){
                        $results[0] = array_merge($station[0]);
                        $results[1] = $station[1];
                    }elseif(!$otherFerme && !$otherResto && $otherStation){
                        // $results[0] = array_merge($ferme[0], $resto[0]);
                        $results[0] = array_merge($resto[0], $ferme[0]);
                        $results[1] = $ferme[1] + $resto[1];
                    }elseif(!$otherFerme && $otherResto && !$otherStation){
                        $results[0] = array_merge($station[0] , $ferme[0]);
                        $results[1] = $station[1] + $ferme[1];
                    }elseif($otherFerme && !$otherResto && !$otherStation){
                        // $results[0] = array_merge($station[0] , $resto[0]);
                        $results[0] = array_merge($resto[0] , $station[0]);
                        $results[1] = $station[1] + $resto[1];
                    }else{
                        // $results[0] = array_merge($station[0] , $ferme[0], $resto[0]);
                        $results[0] = array_merge($resto[0] , $station[0], $ferme[0]);
                        $results[1] = $station[1] + $ferme[1] + $resto[1];
                        $otherResult = true;
                    }

                }

                $results[2] = "tous";

                break;
        }

        // dd($communeGeoCoderRepository->findBy(["nom_com" => $cles1]));

        if(str_contains($request->getPathInfo(), '/api/search')){
            return $this->json([
                "results" => $results,
                "type" => $type,
                "cles0" => $cles0,
                "cles1" => $cles1,
                "origin_cles1" => $origin_cles1
            ], 200);
        }

        //dd($results[0]);

        $resultSort = array();

        $resultSort0 = $sortResultService->shortResult($cles0, $cles1, $results);

        //dd($resultSort0);

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

}
