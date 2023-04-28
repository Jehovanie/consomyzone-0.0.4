<?php



namespace App\Controller;



use App\Service\Status;

use App\Entity\Consumer;
use App\Entity\Supplier;
use App\Service\TributGService;
use App\Repository\UserRepository;

use App\Entity\AdressIpAndPosition;

use App\Repository\CodeapeRepository;

use App\Repository\BddRestoRepository;

use App\Repository\FermeGeomRepository;

use Doctrine\ORM\EntityManagerInterface;

use App\Repository\DepartementRepository;

use Symfony\Component\HttpFoundation\Request;

use Symfony\Component\HttpFoundation\Response;

use Symfony\Component\Routing\Annotation\Route;

use App\Repository\AdressIpAndPositionRepository;

use App\Repository\StationServiceFrGeomRepository;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;



class ToutsController extends AbstractController

{

    private $em;



    public function __construct(EntityManagerInterface $em)

    {

        $this->em = $em;

    }



    

    /**

     * @Route("/" , name="all_departement_touts" , methods={"GET", "POST"})

     * @Route("/" , name="app_home" , methods={"GET", "POST"})

     */

    public function getAllDepartementTouts(CodeapeRepository $codeApeRep,Status $status, DepartementRepository $departementRepository, Request $request, UserRepository $userRepository): Response

    {

        $statusProfile = $status->statusFondateur($this->getUser());

        return $this->render("home/index.html.twig", [

            "toutsdepartements" => $departementRepository->getDep(),

            "number_of_departement" => $departementRepository->getCountDepartement()[0]["1"],

            "profil" => $statusProfile["profil"],

            "statusTribut" => $statusProfile["statusTribut"],
            "codeApes" => $codeApeRep->getCode()
        ]);

    }

    #[Route("/api/save_ip_and_lat_long" , name:"save_ip_and_lat_long", methods: "POST")]
    public function saveIpAndLatLong(Request $request, EntityManagerInterface $entityManagerInterface){

        $requestContent = json_decode($request->getContent(), true);
        $adresseIp = $requestContent["adresseIp"];
        $latitude = $requestContent["latitude"];
        $longitude = $requestContent["longitude"];
        $city = $requestContent["city"];
        $country = $requestContent["country"];

        $ip = $entityManagerInterface->getRepository(AdressIpAndPosition::class)->findOneByAdresseIp($adresseIp);
        //dd($ip);
        if($ip == null){
            $adressIpAndPosition = new AdressIpAndPosition();
            $adressIpAndPosition->setAdresseIp($adresseIp);
            $adressIpAndPosition->setLatitude($latitude);
            $adressIpAndPosition->setLongitude($longitude);
            $adressIpAndPosition->setCity($city);
            $adressIpAndPosition->setCountry($country);

            $entityManagerInterface->persist($adressIpAndPosition);
            $entityManagerInterface->flush();
        }

        return $this->json("Ok");


    }

    #[Route("/api/alldepartements" , name:"app_api_getAllDep", methods: "GET")]
    public function getAllDepartementNames(DepartementRepository  $departementRepository){
        return $this->json([
            "departements" => $departementRepository->getDep(),
        ]);
    }

    /**

     * @Route("/tous/departement/{nom_dep}/{id_dep}" , name="touts_specific_departement", methods={"GET", "POST"} )

     */

    public function getSpecifiqueDep(Status $status,StationServiceFrGeomRepository $stationServiceFrGeomRepository,
        FermeGeomRepository $fermeGeomRepository,
        Request $request,
        $nom_dep,
        $id_dep,
        CodeapeRepository $codeApeRep

    ){

        $statusProfile = $status->statusFondateur($this->getUser());

        $result_ferme = $fermeGeomRepository->getFermByDep($nom_dep, $id_dep, 0);

        $result_station = $stationServiceFrGeomRepository->getStationByDepartement(strval(intval($id_dep)), $nom_dep,0);

        $number_total = $fermeGeomRepository->getCountFerme($nom_dep, $id_dep )[0]["1"] + $stationServiceFrGeomRepository->getCountStation(strval(intval($id_dep)),$nom_dep)[0]["1"];



        if( $request->query->get("type")){

            $type = $request->query->get("type");



            if( $type === "tous" ){



                return $this->render("home/specific_departement.html.twig", [

                    "id_dep" => $id_dep,

                    "nom_dep" => $nom_dep,

                    "results_ferme" => $result_ferme,

                    "results_station" => $result_station,

                    "number_station_ferme" => $number_total,

                    "profil" => $statusProfile["profil"],

                    "statusTribut" => $statusProfile["statusTribut"],
                    "codeApes" => $codeApeRep->getCode()
                ]);



            }else if( $type === "station"){

                // dd("tty");

                return $this->render("home/specific_departement.html.twig", [

                    "id_dep" => $id_dep,

                    "nom_dep" => $nom_dep,

                    "results_ferme" => null,

                    "results_station" => $result_station,

                    "number_station_ferme" => $stationServiceFrGeomRepository->getCountStation(strval(intval($id_dep)),$nom_dep)[0]["1"],

                    "profil" => $statusProfile["profil"],

                    "statusTribut" => $statusProfile["statusTribut"],
                    "codeApes" => $codeApeRep->getCode()
                ]);

            }else{



                return $this->render("home/specific_departement.html.twig", [

                    "id_dep" => $id_dep,

                    "nom_dep" => $nom_dep,

                    "results_ferme" => $result_ferme,

                    "results_station" => [],

                    "number_station_ferme" => $fermeGeomRepository->getCountFerme($nom_dep, $id_dep )[0]["1"],

                    "profil" => $statusProfile["profil"],

                    "statusTribut" => $statusProfile["statusTribut"],

                    "codeApes" => $codeApeRep->getCode()
                ]);

            }





           

        }



        if ($request->isXmlHttpRequest() || $request->query->get('showJson') == 1) {

            // ce qu'on va retourné

            $page = intval($request->request->get("page"));

            return new JsonResponse(

                [

                    $fermeGeomRepository->getFermByDep($nom_dep, $id_dep, $page),

                    $stationServiceFrGeomRepository->getStationByDepartement($id_dep, $nom_dep,$page),

                    "profil" => $statusProfile["profil"],

                    "statusTribut" => $statusProfile["statusTribut"],

                ]

            );

        }



        return $this->render("home/specific_departement.html.twig", [

            "id_dep" => $id_dep,

            "nom_dep" => $nom_dep,

            "results_ferme" => $result_ferme,

            "results_station" => $result_station,

            "number_station_ferme" => $number_total,

            "profil" => $statusProfile["profil"],

            "statusTribut" => $statusProfile["statusTribut"],

            "codeApes" => $codeApeRep->getCode()
        ]);

    }



    

    #[Route('/getLatitudeLongitudeForAll', name: 'for_explore_cat_tous')]

    public function getLatitudeLongitudeForAll(
        Status $status,
        Request $request,
        StationServiceFrGeomRepository $stationServiceFrGeomRepository,
        FermeGeomRepository $fermeGeomRepository,
        BddRestoRepository $bddRestoRepository,
    )
    {

        $statusProfile = $status->statusFondateur($this->getUser());

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

                            "profil" => $statusProfile["profil"],

                            "statusTribut" => $statusProfile["statusTribut"]

                        ]);

                    case "station":

                        return $this->json([

                            "station" => $stationServiceFrGeomRepository->getAllStationInDepartement($id_dep,$nom_dep),

                            "ferme" => null,

                            "profil" => $statusProfile["profil"],

                            "statusTribut" => $statusProfile["statusTribut"]

                        ]);

                    case "ferme":

                        return $this->json([

                            "station" => null,

                            "ferme" => $fermeGeomRepository->getAllFermeInDepartement($nom_dep, $id_dep),

                            "profil" => $statusProfile["profil"],

                            "statusTribut" => $statusProfile["statusTribut"]

                        ]);

                    default:

                        break;

                }

            }



            return $this->json([

                "station" => $stationServiceFrGeomRepository->getAllStationInDepartement(intval($id_dep),$nom_dep),

                "ferme" => $fermeGeomRepository->getAllFermeInDepartement($nom_dep, $id_dep),

                "profil" => $statusProfile["profil"],

                "statusTribut" => $statusProfile["statusTribut"]

            ]);

        }



        if( $type ){

            

            switch( $type){

                case "tous":

                    return $this->json([

                        "station" => $stationServiceFrGeomRepository->getLatitudeLongitudeStation(),

                        "ferme" => $fermeGeomRepository->getLatitudeLongitudeFerme(),

                        "profil" => $statusProfile["profil"],

                        "statusTribut" => $statusProfile["statusTribut"]

                    ]);

                case "station":

                    return $this->json([

                        "station" => $stationServiceFrGeomRepository->getLatitudeLongitudeStation(),

                        "ferme" => null,

                        "profil" => $statusProfile["profil"],

                        "statusTribut" => $statusProfile["statusTribut"]

                    ]);

                case "ferme":

                    return $this->json([

                        "station" => null,

                        "ferme" => $fermeGeomRepository->getLatitudeLongitudeFerme(),

                        "profil" => $statusProfile["profil"],

                        "statusTribut" => $statusProfile["statusTribut"]

                    ]);

                default:

                    break;

            }

        }



        return $this->json([

            "station" => $stationServiceFrGeomRepository->getLatitudeLongitudeStation(),

            "ferme" => $fermeGeomRepository->getLatitudeLongitudeFerme(),

            "resto" => $bddRestoRepository->getAllOpenedRestos(),

            "profil" => $statusProfile["profil"],

            "statusTribut" => $statusProfile["statusTribut"]

        ]);

    }
}
