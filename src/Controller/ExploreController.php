<?php

namespace App\Controller;

use App\Entity\StationServiceFrGeom;
use App\Repository\DepartementRepository;
use App\Repository\FermeGeomRepository;
use App\Repository\StationServiceFrGeomRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class ExploreController extends AbstractController
{
    
    #[Route('/explore', name: 'app_explore')]
    public function explore(DepartementRepository $departementRepository ): Response
    {
        return $this->render("explore/explore.html.twig", [
            "departements" => $departementRepository->getAllDep()
        ]);
    }

    #[Route('/getLatitudeLongitudeForAll', name:'for_explore_cat_tous')]
    public function getLatitudeLongitudeForAll(StationServiceFrGeomRepository $stationServiceFrGeomRepository, FermeGeomRepository $fermeGeomRepository )
    {
        return $this->json([
            "station" => $stationServiceFrGeomRepository->getLatitudeLongitudeStation(),
            "ferme" => $fermeGeomRepository->getLatitudeLongitudeFerme()
        ]);
    }

    // #[Route("/getLatitudeLongitudeForAll/{departement}/{code}", name:"getforAllLatLongByDepartement",methods:"GET")]
    // public function getforAllLatLongByDepartement(StationServiceFrGeomRepository $stationServiceFrGeomRepository, FermeGeomRepository $fermeGeomRepository )
    // {
    //     ///
    // }
}
