<?php

namespace App\Controller;

use App\Service\SortResultService;
use App\Repository\BddRestoRepository;
use App\Repository\FermeGeomRepository;
use App\Service\StringTraitementService;
use App\Repository\DepartementRepository;
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
        Request $request,
        StationServiceFrGeomRepository $stationServiceFrGeomRepository,
        FermeGeomRepository $fermeGeomRepository,
        BddRestoRepository $bddRestoRepository,
        $type = null,
        SortResultService $sortResultService,
        StringTraitementService $stringTraitementService
    ){

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
                $otherFerme = false;
                $ferme = $fermeGeomRepository->getBySpecificClef($cles0, $cles1, $page, $size);
                if(!count($ferme[0])>0){
                    $ferme = $fermeGeomRepository->getBySpecificClefOther($cles0, $cles1, $page, $size);
                    $otherFerme = true;
                }

                $otherResto = false;
                $resto = $bddRestoRepository->getBySpecificClef($cles0, $cles1, $page, $size);
                if(!count($resto[0])>0){
                    $resto = $bddRestoRepository->getBySpecificClefOther($cles0, $cles1, $page, $size);
                    $otherResto = true;
                }

                $otherStation = false;
                $station = $stationServiceFrGeomRepository->getBySpecificClef($cles0, $cles1, $page, $size);
                if(!count($station[0])>0){
                    $station = $stationServiceFrGeomRepository->getBySpecificClefOther($cles0, $cles1, $page, $size);
                    $otherStation = true;
                }

                if(!$otherFerme && !$otherResto && !$otherStation){
                    $results[0] = array_merge($station[0] , $ferme[0], $resto[0]);
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
                    $results[0] = array_merge($ferme[0], $resto[0]);
                    $results[1] = $ferme[1] + $resto[1];
                }elseif(!$otherFerme && $otherResto && !$otherStation){
                    $results[0] = array_merge($station[0] , $ferme[0]);
                    $results[1] = $station[1] + $ferme[1];
                }elseif($otherFerme && !$otherResto && !$otherStation){
                    $results[0] = array_merge($station[0] , $resto[0]);
                    $results[1] = $station[1] + $resto[1];
                }else{
                    $results[0] = array_merge($station[0] , $ferme[0], $resto[0]);
                    $results[1] = $station[1] + $ferme[1] + $resto[1];
                    $otherResult = true;
                }
                $results[2] = "tous";

                break;
        }

        if(str_contains($request->getPathInfo(), '/api/search')){
            return $this->json([
                "results" => $results,
                "type" => $type,
                "cles0" => $cles0,
                "cles1" => $cles1,
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
            "results" => $results,
            "otherResult" => $otherResult,
            "type" => $type,
            "cles0" => $cles0,
            "cles1" => $cles1,
            "page" => $page
        ]);
    }

}
