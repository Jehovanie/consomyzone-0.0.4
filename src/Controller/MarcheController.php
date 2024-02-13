<?php

namespace App\Controller;

use App\Repository\MarcheRepository;
use App\Repository\DepartementRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class MarcheController extends AbstractController
{
    #[Route('/marche', name: 'app_marche')]
    public function getAllDepartementMarche(
        DepartementRepository $departementRepository,
        MarcheRepository $marcheRepository,
    ): Response
    {
        $count_marche= $marcheRepository->getAccountMarche();

        return $this->render('marche/index.html.twig',[
            "departements" => $departementRepository->getDep(),
            "count_marche" => $count_marche
        ]);
    }

    #[Route("/marche/specific", name: "app_specific_marche", methods: ["GET"])]
    public function getSpecifiqueMarche(
    ) {
        return $this->render("marche/specific_departement.html.twig");
    }


    #[Route("/marche/{id_dep}/details/{id_marche}", name: "app_get_details_marche", methods: ["GET"])]
    public function getDetailMarche(
        $id_dep,
        $id_marche,
        MarcheRepository $marcheRepository,
    ) {

        $marche_details= $marcheRepository->getOneItemByID($id_marche);

        return $this->render("marche/detail_marche.html.twig", [
            "id_marche" => $id_marche,
            "id_dep" => $id_dep,
            "details" => [
                ...$marche_details
            ]
        ]);
    }


    #[Route("/api/marche", name: "app_api_marche", methods: ["GET"])]
    public function apiGetMarche(
        MarcheRepository $marcheRepository,
        Request $request,
    ){
        
        if($request->query->has("minx") && $request->query->has("miny") ){

            $minx = $request->query->get("minx");
            $maxx = $request->query->get("maxx");
            $miny = $request->query->get("miny");
            $maxy = $request->query->get("maxy");

            $datas = $marcheRepository->getDataBetweenAnd($minx, $miny, $maxx, $maxy);

            return $this->json([
                "data" => $datas
            ], 200);
        }

        //// data marche all departement
        $datas= $marcheRepository->getSomeDataShuffle(2000);

        return $this->json([
            "data" => $datas
        ], 200);
    }
}
