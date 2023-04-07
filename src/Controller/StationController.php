<?php



namespace App\Controller;



use App\Entity\Avisstation;

use App\Entity\StationServiceFrGeom;

use App\Repository\AvisstationRepository;
use App\Repository\CodeapeRepository;
use App\Repository\DepartementRepository;

use Symfony\Component\HttpFoundation\Request;

use Symfony\Component\HttpFoundation\Response;

use Symfony\Component\Routing\Annotation\Route;

use App\Repository\StationServiceFrGeomRepository;

use App\Service\Status;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;



class StationController extends AbstractController

{

    /**

     * @Route("/station", name="app_station", methods={"GET", "POST"})

     */

    public function station(CodeapeRepository $codeApeRep, Status $status, DepartementRepository $departementRepository, StationServiceFrGeomRepository $stationServiceFrGeomRepository, Request $request): Response

    {

        $statusProfile = $status->statusFondateur($this->getUser());

        return $this->render('station/index.html.twig', [

            "departements" => $departementRepository->getDep(),

            "total_number_station" => $stationServiceFrGeomRepository->getCountStation()[0]["1"],

            "profil" => $statusProfile["profil"],

            "statusTribut" => $statusProfile["statusTribut"],

            "codeApes" => $codeApeRep->getCode()
        ]);
    }

    /**

     * @Route("/fetch_departement_mobile", name="app_getDepartement", methods={"GET"})

     */

     public function getDepartement(DepartementRepository $departementRepository): Response

     {
         return $this->render('shard/station/fetchLeftSide.html.twig', [
             "departements" => $departementRepository->getDep(),
         ]);
     }
 





    /**

     * @Route("/station/departement/{depart_code}/{depart_name}" , name="specific_station_departement", methods={"GET"})

     */

    public function specifiStationDepartement(CodeapeRepository $codeApeRep, Status $status, Request $request, StationServiceFrGeomRepository $stationServiceFrGeomRepository, $depart_code, $depart_name)

    {

        if (strlen($depart_code) === 1) {
            $depart_code = "0" . $depart_code;
        }

        $statusProfile = $status->statusFondateur($this->getUser());



        return $this->render("station/specificStationDepartement.html.twig", [

            "departCode" => $depart_code,

            "departName" => $depart_name,

            "stations"   => $stationServiceFrGeomRepository->getStationByDepartement($depart_code, $depart_name, 0),

            "number_station" => $stationServiceFrGeomRepository->getCountStation($depart_code, $depart_name)[0]["1"],

            "profil" => $statusProfile["profil"],

            "statusTribut" => $statusProfile["statusTribut"],

            "codeApes" => $codeApeRep->getCode()
        ]);
    }



    /**

     * @Route("/station/departement/{depart_code}/{depart_name}/allStation" , name="getAllStationInDepartement", methods={"GET"})

     */

    public function getAllStationInDepartement(StationServiceFrGeomRepository $stationServiceFrGeomRepository, $depart_code, $depart_name)

    {

        return $this->json(

            $stationServiceFrGeomRepository->getAllStationInDepartement(

                $depart_code,

                $depart_name

            )

        );
    }



    /**

     * SPECIALEMENT POUR LE REQUETE AJAX

     * 

     * @Route("/station/departement" , name="departement_station_suite", methods={"POST"} )

     */

    public function getFermeRepoSuite(StationServiceFrGeomRepository $stationServiceFrGeomRepository, Request $request)

    {

        if ($request->isXmlHttpRequest() || $request->query->get('showJson') == 1) {

            return $this->json(

                $stationServiceFrGeomRepository->getStationByDepartement(

                    $request->request->get("id_dep"),

                    $request->request->get("nom_dep"),

                    intval($request->request->get("page"))

                )

            );
        }
    }



    /**

     * @Route("/station/departement/ajax" , name="specific_station_departement_ajax", methods={"POST"})

     */

    public function specifiStationDepartementAjax(StationServiceFrGeomRepository $stationServiceFrGeomRepository, Request $request)

    {

        ///pour plus de resultat dans le view.

        if ($request->isXmlHttpRequest() || $request->query->get('showJson') == 1) {

            return $this->json(

                $stationServiceFrGeomRepository->getStationByDepartement(

                    $request->request->get("code"),

                    $request->request->get("name"),

                    intval($request->request->get("page"))

                )

            );
        }
    }



    /**

     * DON'T CHANGE THIS ROUTE: This use in js file.

     * 

     * @Route("/station/departement/{depart_code}/{depart_name}/details/{id}" , name="station_details", methods={"GET"})

     */

    public function detailsStation(CodeapeRepository $codeApeRep, Status $status, StationServiceFrGeomRepository $stationServiceFrGeomRepository, $depart_code, $depart_name, $id)

    {

        $statusProfile = $status->statusFondateur($this->getUser());

        // dump($depart_code, $depart_name, $id);
        // dd($stationServiceFrGeomRepository->getDetailsStation($depart_code, $depart_name, $id));
        return $this->render("shard/station/details.js.twig", [

            "departCode" => $depart_code,

            "departName" => $depart_name,

            "station" => $stationServiceFrGeomRepository->getDetailsStation($depart_code, $depart_name, $id)[0],

            "profil" => $statusProfile["profil"],

            "statusTribut" => $statusProfile["statusTribut"],

            "codeApes" => $codeApeRep->getCode()
        ]);
    }





    /**

     * DON'T CHANGE THIS ROUTE: This use in js file.

     * @Route("/getLatitudeLongitudeStation" , name="getLatitudeLongitudeStation" , methods={"GET"})

     */

    public function getLatitudeLongitudeStation(StationServiceFrGeomRepository $stationServiceFrGeomRepository, Request $request)

    {



        $max = $request->query->get("max");

        $min = $request->query->get("min");

        $type = $request->query->get("type");

        $nom_dep = $request->query->get("nom_dep");

        $id_dep = $request->query->get("id_dep");



        if ($max || $min || $type) {



            if ($nom_dep != "null" && $id_dep != "null") {

                return $this->json(

                    $stationServiceFrGeomRepository->getLatitudeLongitudeStation(floatval($min), floatval($max), $type, $nom_dep, $id_dep)

                );
            } else {

                return $this->json(

                    $stationServiceFrGeomRepository->getLatitudeLongitudeStation(floatval($min), floatval($max), $type)

                );
            }
        } else {

            if ($nom_dep != null && $id_dep != null) {

                return $this->json(

                    $stationServiceFrGeomRepository->getAllStationInDepartement($id_dep, $nom_dep)

                );
            }
        }

        // return $this->json(count($stationServiceFrGeomRepository->getLatitudeLongitudeStation()));

        return $this->json(

            $stationServiceFrGeomRepository->getLatitudeLongitudeStation()

        );
    }

    /**

     * @Route("/stcmntvas", name="submit_comment", methods={"POST"})

     */

    public function submitComment(StationServiceFrGeomRepository $stationServiceFrGeomRepository, AvisstationRepository $repSataion, Request $request)
    {

        $requestContent = json_decode($request->getContent(), true);

        $stationAvis = new Avisstation();

        $user = $this->getUser(); //->getId();

        $etoile = $requestContent["etoile"];

        $commentaire = $requestContent["comment"];

        $idStation = $requestContent["idStation"];

        $reaction = $requestContent["reaction"];

        $station = $stationServiceFrGeomRepository->findOneBy(["id" => $idStation]);



        $stationAvis->setComment($commentaire)

            ->setNote($etoile)

            ->setUser($user)

            ->setReaction($reaction)

            ->setDatetime(new \DateTimeImmutable())

            ->setStation($station);



        //$repSataion->add($stationAvis);



        return $this->json($repSataion->add($stationAvis, true));
    }

    /**

     * @Route("/upCmntvas", name="update_comment", methods={"POST"})

     */

    public function updateComment(StationServiceFrGeomRepository $stationServiceFrGeomRepository, AvisstationRepository $repSataion, Request $request)

    {

        $requestContent = json_decode($request->getContent(), true);



        $iduser = $this->getUser()->getId();

        $etoile = $requestContent["etoile"];

        $commentaire = $requestContent["comment"];

        $idStation = $requestContent["idStation"];

        $reaction = $requestContent["reaction"];

        return $this->json($repSataion->updateAvis($idStation, $iduser, $etoile, $commentaire, $reaction));
    }



    /**

     * @Route("/dltCmntvas", name="delete_comment", methods={"POST"})

     */

    public function deleteComment(StationServiceFrGeomRepository $stationServiceFrGeomRepository, AvisstationRepository $repSataion, Request $request)

    {

        $requestContent = json_decode($request->getContent(), true);



        $iduser = $this->getUser()->getId();

        $idStation = $requestContent["idStation"];







        return $this->json($repSataion->deleteAvis($idStation, $iduser));
    }



    /**

     * @Route("/numnum/{idStation}", name="get_nombre_avis", methods={"GET"})

     */

    public function numnum(AvisstationRepository $repSataion, $idStation)

    {



        $r = ["response" => $repSataion->getNombreAvis($idStation)];

        return $this->json($r);
    }



    /**

     * @Route("/getAvis/{id}",name="get_avis", methods={"GET"})

     */

    public function getAvis($id, AvisstationRepository $repSataion)
    {



        return $this->json($repSataion->findBy(["station" => $id]));
    }
}
