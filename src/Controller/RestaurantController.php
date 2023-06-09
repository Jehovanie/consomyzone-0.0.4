<?php

namespace App\Controller;

use App\Entity\AvisRestaurant;
use App\Repository\AvisRestaurantRepository;
use App\Repository\BddRestoRepository;
use App\Repository\CodeapeRepository;
use App\Repository\CodeinseeRepository;
use App\Repository\DepartementRepository;
use App\Service\Status;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

class RestaurantController extends AbstractController
{

    #[Route("/restaurant", name: "restaurant_all_dep", methods: ["GET"])]
    public function getAllDepartement(
        Status $status,
        CodeapeRepository $codeApeRep,
        DepartementRepository $departementRepository,
        BddRestoRepository $bddResto,
        CodeinseeRepository $code

    ) {
        $statusProfile = $status->statusFondateur($this->getUser());
        $dataRequest = $departementRepository->getDep();
        // $id_dep = $dataRequest["id"];
        // $datas = $code->getAllCodinsee($id_dep);
        // dump($dataRequest);
        //dd($bddResto->getAccountRestauranting(),$bddResto->getAllOpenedRestos());
        return $this->render("restaurant/index.html.twig", [
            "departements" => $departementRepository->getDep(),
            //"number_of_departement" => count($bddResto->getAllOpenedRestos()),
            "number_of_departement" => count($bddResto->getCoordinateAndRestoIdForSpecific(75)),
            "profil" => $statusProfile["profil"],
            "statusTribut" => $statusProfile["statusTribut"],
            // "codinsees" => $datas,
            "codeApes" => $codeApeRep->getCode()
        ]);
    }

    #[Route("/restaurant-mobile", name: "restaurant_all_dep_mobile", methods: ["GET"])]
    public function getAllDepartementMobile(
        Status $status,
        CodeapeRepository $codeApeRep,
        DepartementRepository $departementRepository,
        BddRestoRepository $bddResto
    ) {
        $statusProfile = $status->statusFondateur($this->getUser());
        //dd($bddResto->getAccountRestauranting(),$bddResto->getAllOpenedRestos());
        return $this->render("shard/restaurant/mobile-depart.js.twig", [
            "departements" => $departementRepository->getDep(),
            "number_of_departement" => count($bddResto->getAllOpenedRestos()),
            "profil" => $statusProfile["profil"],
            "statusTribut" => $statusProfile["statusTribut"],
            "codeApes" => $codeApeRep->getCode()
        ]);
    }


    #[Route("/Coord/All/Restaurant", name: "app_coord_restaurant", methods: ["GET"])]
    public function getAllRestCoor(
        BddRestoRepository $bddResto,
        SerializerInterface $serialize
    ) {
        //$datas = $serialize->serialize($bddResto->getAllOpenedRestos(), 'json');
        $datas = $serialize->serialize($bddResto->getCoordinateAndRestoIdForSpecific(75), 'json');
        return new JsonResponse($datas, 200, [], true);
    }

    #[Route("/Coord/All/Restaurant/specific/arrondissement/{dep}/{codinsee}", name: "app_coord_restaurant_sepcific_arrond", methods: ["GET"])]
    public function getAllRestCoorArrondissement(
        $dep,
        $codinsee,
        BddRestoRepository $bddResto,
        SerializerInterface $serialize
    ) {
        $datas = $serialize->serialize($bddResto->getRestoByCodinsee($codinsee, $dep), 'json');
        return new JsonResponse($datas, 200, [], true);
    }

    #[Route("/Coord/Spec/Restaurant/{dep}", name: "app_coord_spec_restaurant", methods: ["GET"])]
    public function getSpecificRestCoor(
        BddRestoRepository $bddResto,
        SerializerInterface $serialize,
        $dep
    ) {
        $datas = $serialize->serialize($bddResto->getCoordinateAndRestoIdForSpecific($dep), 'json');
        return new JsonResponse($datas, 200, [], true);
    }

    //http://localhost:8000/restaurant/specific?nom_dep=Loire-Atlantique&id_dep=44
    #[Route("/restaurant/specific", name: "app_specific_dep_restaurant", methods: ["GET"])]
    public function getSpecificRestaurant(
        BddRestoRepository $bddResto,
        Status $status,
        Request $request,
        CodeapeRepository $codeApeRep,
    ) {
        $dataRequest = $request->query->all();
        $nomDep = $dataRequest["nom_dep"];
        $codeDep = $dataRequest["id_dep"];
        $datas = $bddResto->getCoordinateAndRestoIdForSpecific($codeDep);
        $resultCount = count($datas);
        $statusProfile = $status->statusFondateur($this->getUser());

        return $this->render("restaurant/specific_departement.html.twig", [
            "id_dep" => $codeDep,
            "nom_dep" => $nomDep,
            "restaurants" => $datas,
            "nomber_resto" => $resultCount,
            "profil" => $statusProfile["profil"],
            "statusTribut" => $statusProfile["statusTribut"],
            "codeApes" => $codeApeRep->getCode(),
            

        ]);
    }

    #[Route("/restaurant-mobile/specific", name: "app_specific_dep_restaurant_mobile", methods: ["GET"])]
    public function getSpecificRestaurantMobile(
        BddRestoRepository $bddResto,
        Status $status,
        Request $request,
        CodeapeRepository $codeApeRep,
    ) {
        $dataRequest = $request->query->all();
        $nomDep = $dataRequest["nom_dep"];
        $codeDep = $dataRequest["id_dep"];
        $codinsee = $dataRequest["codinsee"];
        $datas = $bddResto->getCoordinateAndRestoIdForSpecific($codeDep);
        $resultCount = count($datas);
        $statusProfile = $status->statusFondateur($this->getUser());

        return $this->render("shard/restaurant/specific_mobile_departement.js.twig", [
            "id_dep" => $codeDep,
            "nom_dep" => $nomDep,
            "restaurants" => $datas,
            "nomber_resto" => $resultCount,
            "profil" => $statusProfile["profil"],
            "statusTribut" => $statusProfile["statusTribut"],
            "codeApes" => $codeApeRep->getCode(),
            "codinsee" => $codinsee


        ]);
    }

    #[Route("/restaurant/arrondissement", name: "app_dep_restaurant_arrondisme", methods: ["GET"])]
    public function getRestaurantArrondisme(
        BddRestoRepository $bddResto,
        Status $status,
        Request $request,
        CodeapeRepository $codeApeRep,
        CodeinseeRepository $code
    ) {
        $dataRequest = $request->query->all();
        $nomDep = $dataRequest["nom_dep"];
        $codeDep = $dataRequest["id_dep"];
        $datas = $code->getAllCodinsee($codeDep);
        $resto = $bddResto->getCoordinateAndRestoIdForSpecific($codeDep);
        $resultCount = count($resto);
        // dump($resultCount);
        $statusProfile = $status->statusFondateur($this->getUser());

        return $this->render("restaurant/restaurant_arrondisment.html.twig", [
            "id_dep" => $codeDep,
            "nom_dep" => $nomDep,
            "restaurants" => $bddResto->getCoordinateAndRestoIdForSpecificParis($codeDep),
            "codinsees" => $datas,
            "resto_nombre" => $resultCount,
            "profil" => $statusProfile["profil"],
            "statusTribut" => $statusProfile["statusTribut"],
            "codeApes" => $codeApeRep->getCode()
        ]);
    }

    #[Route("/restaurant-mobile/arrondissement", name: "app_dep_restaurant_arrondisme_mobile", methods: ["GET"])]
    public function getRestaurantArrondismeMobile(
        BddRestoRepository $bddResto,
        Status $status,
        Request $request,
        CodeapeRepository $codeApeRep,
        CodeinseeRepository $code
    ) {
        $dataRequest = $request->query->all();
        $nomDep = $dataRequest["nom_dep"];
        $codeDep = $dataRequest["id_dep"];
        $datas = $code->getAllCodinsee($codeDep);
        $resultCount = count($bddResto->getCoordinateAndRestoIdForSpecific($codeDep));
        dump($resultCount);
        $statusProfile = $status->statusFondateur($this->getUser());

        return $this->render("shard/restaurant/arrondisment_resto_mobile_navleft.twig", [
            "id_dep" => $codeDep,
            "nom_dep" => $nomDep,
            "codinsees" => $datas,
            "resto_nombre" => $resultCount,
            "profil" => $statusProfile["profil"],
            "statusTribut" => $statusProfile["statusTribut"],
            "codeApes" => $codeApeRep->getCode()
        ]);
    }

    #[Route("/restaurant/arrondissement/specific", name: "restaurant_specific_arrondissement_sepcial", methods: ["GET"])]
    public function getSpecificRestaurantArrondisme(
        BddRestoRepository $bddResto,
        Status $status,
        Request $request,
        CodeapeRepository $codeApeRep,
    ) {
        $dataRequest = $request->query->all();
        $nomDep = $dataRequest["nom_dep"];
        $codeDep = $dataRequest["id_dep"];
        $codinsee = $dataRequest["codinsee"];
        $datas = $bddResto->getRestoByCodinsee($codinsee, $codeDep);
        $resultCount = count($datas);
        $statusProfile = $status->statusFondateur($this->getUser());



        return $this->render("restaurant/specific_departement.html.twig", [
            "id_dep" => $codeDep,
            "nom_dep" => $nomDep,
            "restaurants" => $datas,
            "nomber_resto" => $resultCount,
            "profil" => $statusProfile["profil"],
            "statusTribut" => $statusProfile["statusTribut"],
            "codeApes" => $codeApeRep->getCode(),
            "codinsee" => $codinsee
        ]);
    }

    

    /** 
     * DON'T CHANGE THIS ROUTE: It's use in js file. 
     * 
     * @Route("/restaurant/departement/{nom_dep}/{id_dep}/details/{id_restaurant}" , name="detail_restaurant" , methods="GET" )
     */
    public function detailsRestaurant(
        CodeapeRepository $codeApeRep,
        BddRestoRepository $bddResto,
        Status $status,
        $nom_dep,
        $id_dep,
        $id_restaurant
    ): Response {
        $statusProfile = $status->statusFondateur($this->getUser());

        // return $this->json([
        //     "details" => $bddResto->getOneRestaurant($id_dep, $id_restaurant)[0],
        //     "id_dep" => $id_dep,
        //     "nom_dep" => $nom_dep,
        //     "profil" => $statusProfile["profil"],
        //     "statusTribut" => $statusProfile["statusTribut"],
        //     "codeApes" => $codeApeRep->getCode()

        // ], 200);

        return $this->render("shard/restaurant/details.js.twig", [
            "details" => $bddResto->getOneRestaurant($id_dep, $id_restaurant)[0],
            "id_dep" => $id_dep,
            "nom_dep" => $nom_dep,
            "profil" => $statusProfile["profil"],
            "statusTribut" => $statusProfile["statusTribut"],
            "codeApes" => $codeApeRep->getCode()

        ]);
    }

    /** 
     * DON'T CHANGE THIS ROUTE: It's use in js file. 
     * 
     * @Route("/restaurant-left/departement/{nom_dep}/{id_dep}/details/{id_restaurant}" , name="detail_left_restaurant" , methods="GET" )
     */
    public function detailsRestaurantLeft(
        CodeapeRepository $codeApeRep,
        BddRestoRepository $bddResto,
        Status $status,
        $nom_dep,
        $id_dep,
        $id_restaurant
    ): Response {
        $statusProfile = $status->statusFondateur($this->getUser());

        // return $this->json([
        //     "details" => $bddResto->getOneRestaurant($id_dep, $id_restaurant)[0],
        //     "id_dep" => $id_dep,
        //     "nom_dep" => $nom_dep,
        //     "profil" => $statusProfile["profil"],
        //     "statusTribut" => $statusProfile["statusTribut"],
        //     "codeApes" => $codeApeRep->getCode()

        // ], 200);

        return $this->render("shard/restaurant/detail_resto_navleft.twig", [
            "details" => $bddResto->getOneRestaurant($id_dep, $id_restaurant)[0],
            "id_dep" => $id_dep,
            "nom_dep" => $nom_dep,
            "profil" => $statusProfile["profil"],
            "statusTribut" => $statusProfile["statusTribut"],
            "codeApes" => $codeApeRep->getCode()

        ]);
    }

    /** 
     * DON'T CHANGE THIS ROUTE: It's use in js file. 
     * 
     * @Route("/restaurant-mobile/departement/{nom_dep}/{id_dep}/details/{id_restaurant}" , name="detail_restaurant_mobile" , methods="GET" )
     */
    public function detailsRestaurantMobile(
        CodeapeRepository $codeApeRep,
        BddRestoRepository $bddResto,
        Request $request,
        Status $status,
        $nom_dep,
        $id_dep,
        $id_restaurant,
        CodeinseeRepository $code
    ): Response {
        $statusProfile = $status->statusFondateur($this->getUser());
        $dataRequest = $request->query->all();
    
        $codinsee = array_key_exists('codinsee', $dataRequest)? $dataRequest["codinsee"]: null;
        
        return $this->render("shard/restaurant/details_mobile.js.twig", [
            "details" => $bddResto->getOneRestaurant($id_dep, $id_restaurant)[0],
            "id_dep" => $id_dep,
            "nom_dep" => $nom_dep,
            "codinsee" => $codinsee,
            "profil" => $statusProfile["profil"],
            "statusTribut" => $statusProfile["statusTribut"],
            "codeApes" => $codeApeRep->getCode()

        ]);
    }

    #[Route("/avis/restaurant/{idRestaurant}", name: "avis_restaurant", methods: ["POST"])]
    public function giveAvisRestaurant(
        AvisRestaurantRepository $avisRestoRep,
        BddRestoRepository $resto,
        Request $request,
        $idRestaurant
    ) {

        $user = $this->getUser();
        $resto = $resto->find($idRestaurant);
        $avisResto = new AvisRestaurant();
        $requestJson = json_decode($request->getContent(), true);
        $avis = $requestJson["avis"];
        $note = $requestJson["note"];
        //dd($user,$resto);
        $avisResto->setAvis($avis)
            ->setnote($note)
            ->setUser($user)
            ->setDatetime(new \DateTimeImmutable())
            ->setRestaurant($resto);

        return $this->json($avisRestoRep->add($avisResto, true));
    }

    #[Route("/avis/restaurant/{idRestaurant}", name: "get_avis_restaurant", methods: ["GET"])]
    public function getAvisRestaurant(
        AvisRestaurantRepository $avisRestaurantRepository,
        $idRestaurant,
        SerializerInterface $serializer
    ) {
        $userId = $this->getUser()->getId();
        $response = $avisRestaurantRepository->getNote($idRestaurant, $userId);
        $response = $serializer->serialize($response, 'json');
        return new JsonResponse($response, 200, [], true);
    }

    #[Route("/avis/restaurant/global/{idRestaurant}", name: "get_avis_global_restaurant", methods: ["GET"])]
    public function getAvisGlobalRestaurant(
        AvisRestaurantRepository $avisRestaurantRepository,
        $idRestaurant,
        SerializerInterface $serializer
    ) {

        $response = $avisRestaurantRepository->getNoteGlobale($idRestaurant);
        $response = $serializer->serialize($response, 'json');
        return new JsonResponse($response, 200, [], true);
    }
    #[Route("/change/restaurant/{idRestaurant}", name: "change_avis_restaurant", methods: ["POST"])]
    public function changeAvisRestaurant(
        AvisRestaurantRepository $avisRestaurantRepository,
        $idRestaurant,
        SerializerInterface $serializer,
        Request $request
    ) {

        $rJson = json_decode($request->getContent(), true);
        $userId = $this->getUser()->getId();
        $response = $avisRestaurantRepository->updateAvis(
            $idRestaurant,
            $userId,
            $rJson["note"],
            $rJson["avis"]
        );
        $response = $serializer->serialize($response, 'json');
        return new JsonResponse($response, 200, [], true);
    }

    #[Route("/nombre/avis/restaurant/{idRestaurant}", name: "get_nombre_avis_restaurant", methods: ["GET"])]
    public function getNombreAvisRestaurant(
        $idRestaurant,
        AvisRestaurantRepository $avisRestaurantRepository,
        SerializerInterface $serializer,
    ) {
        $response = $avisRestaurantRepository->getNombreAvis($idRestaurant);

        $response = $serializer->serialize(["nombre_avis" => $response], 'json');
        return new JsonResponse($response, 200, [], true);
    }
}
