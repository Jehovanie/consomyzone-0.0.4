<?php

namespace App\Controller;

use App\Repository\CodeapeRepository;
use App\Repository\DepartementRepository;
use App\Repository\GeosireneRepository;
use App\Service\Status;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

class GeosireneController extends AbstractController
{


    
    #[Route("/detail/geosirene/", name: "detail_geosirene", methods: ["GET"])]
    public function getDetailGeosirene(
        Status $status,
        CodeapeRepository $codeApeRep,
        DepartementRepository $departementRepository,
        GeosireneRepository $geoRepo,
        Request $req
    ) {
        $dataReq=$req->query->all();
        $datas= $geoRepo->getAllCoordonnesByName("id",$dataReq["id_geosirene"]);
        
        $statusProfile = $status->statusFondateur($this->getUser());
        return $this->render('geoSirene/detail_geosirene.html.twig', [
            "departements" => $departementRepository->getDep(),
            "id_dep" => $dataReq["id_dep"],
            "nom_dep" => $dataReq["nom_dep"],
            "details" =>$datas[0],
            "profil" => $statusProfile["profil"],
            "statusTribut" => $statusProfile["statusTribut"],
            "codeApes" => $codeApeRep->getCode(),
           
        ]);
    }
    #[Route("/geosirene/auto/{type}", name: "app_geosirene_auto", methods: ["GET"])]
    public function getGeosirene(
        Status $status,
        CodeapeRepository $codeApeRep,
        DepartementRepository $departementRepository,
        GeosireneRepository $geoRepo,
        $type
    )
    {

        if($type=="tous"){
            $baseApe="45";
            $labelle="tous";
        }else{
            $baseApe=$type;
            $labelle= $codeApeRep->getByName("code",$baseApe)[0]["libelle"];
            $baseApe=str_replace(".","",$baseApe);
            ;
        }
        $statusProfile = $status->statusFondateur($this->getUser());
        return $this->render('geoSirene/geoSirene.html.twig', [
            "departements" => $departementRepository->getDep(),
            "number_of_departement" => $geoRepo->getNumberOfGeosirene($baseApe),
            "profil" => $statusProfile["profil"],
            "statusTribut" => $statusProfile["statusTribut"],
            "codeApes" => $codeApeRep->getCode(),
            "baseApe" => $baseApe,
            "labelleApe"=> $labelle
        ]);
    }

    #[Route("/geosirene/commerce/{type}", name: "app_geosirene-commerce", methods: ["GET"])]
    public function getGeosireneCommerce(
        Status $status,
        CodeapeRepository $codeApeRep,
        DepartementRepository $departementRepository,
        GeosireneRepository $geoRepo,
        $type
    ) {

        if ($type == "tous") {
            $baseApe = "47";
            $labelle = "tous";
        } else {
            $baseApe = $type;
            $labelle = $codeApeRep->getByName("code", $baseApe)[0]["libelle"];
            $baseApe = str_replace(".", "", $baseApe);;
        }
        $statusProfile = $status->statusFondateur($this->getUser());
        return $this->render('geoSirene/geoSirene.html.twig', [
            "departements" => $departementRepository->getDep(),
            "number_of_departement" => $geoRepo->getNumberOfGeosirene($baseApe),
            "profil" => $statusProfile["profil"],
            "statusTribut" => $statusProfile["statusTribut"],
            "codeApes" => $codeApeRep->getCode(),
            "baseApe" => $baseApe,
            "labelleApe" => $labelle
        ]);
    }


    #[Route("/geosirene/{id}", name: "get_geosirene_id", methods: ["GET"])]
    public function getGeosireneById(
        GeosireneRepository $geoRepo,
        SerializerInterface $serializer,
        int $id
    ) {
        $r = $serializer->serialize($geoRepo->getAllCoordonnesByName("id", $id), 'json');
        return new JsonResponse($r, 200, [], true);
    }

    #[Route("/geosirenes/ape/{codeApe}", name:"get_geosirene_ape",methods:["GET"])]
    public function getGeosireneApe(
        GeosireneRepository $geoRepo,
        SerializerInterface $serializer,
        $codeApe){
        $r = $serializer->serialize($geoRepo->getAllCoordonnesByName("activitePrincipaleEtablissement", $codeApe), 'json');
        return new JsonResponse($r, 200, [], true);

    }

    #[Route("/geosirenes/dep/{dep}/{type}", name: "get_geosirene_dep", methods: ["GET"])]
    public function getGeosirenes(
        GeosireneRepository $geoRepo,
        SerializerInterface $serializer,
       $dep,
       $type
    ) {

        $r = $serializer->serialize($geoRepo->getAllCoordonnesByDepType($dep, $type), 'json');
        return new JsonResponse($r, 200, [], true);
    }

    #[Route("/geosirenes/baseape/{baseApe}", name: "get_geosirene_base__ape", methods: ["GET"])]
    public function getGeosireneBaseApe(
        GeosireneRepository $geoRepo,
        SerializerInterface $serializer,
        $baseApe
    ) {
        $r = $serializer->serialize($geoRepo->getAllCoordonnesByBaseAPE($baseApe), 'json');
        return new JsonResponse($r, 200, [], true);
    }
 
    #[Route("/geosirenespec/specific/{type}", name: "app_specific_dep_geosirene", methods: ["GET"])]
    public function getSpecificGeosirene(
        GeosireneRepository $geoRepo,
        Status $status,
        Request $request,
        CodeapeRepository $codeApeRep,
        $type
    ) {
        
        $dataRequest = $request->query->all();
        $nomDep = $dataRequest["nom_dep"];
        $codeDep = $dataRequest["id_dep"];
        $datas = $geoRepo->getAllCoordonnesByDepType($codeDep, $type);
        
        
        
        $resultCount = count($datas);
        $statusProfile = $status->statusFondateur($this->getUser());

        return $this->render("geoSirene/specific_departement.html.twig", [
            "id_dep" => $codeDep,
            "nom_dep" => $nomDep,
            "geosirenes" => $datas,
            "nomber_ferme" => $resultCount,
            "profil" => $statusProfile["profil"],
            "statusTribut" => $statusProfile["statusTribut"],
            "codeApes" => $codeApeRep->getCode()
        ]);
    }
    
}
