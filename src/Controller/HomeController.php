<?php

namespace App\Controller;

use App\Repository\BddRestoRepository;
use App\Repository\FermeGeomRepository;
use App\Repository\DepartementRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use App\Repository\StationServiceFrGeomRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class HomeController extends AbstractController
{
    #[Route('/', name: 'app_home')]
    public function index(): Response
    {
        return $this->render('home/index.html.twig');
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
}
