<?php

namespace App\Controller;

use App\Service\Status;
use App\Entity\AvisRestaurant;
use App\Service\TributGService;
use App\Repository\UserRepository;
use App\Repository\CodeapeRepository;
use App\Repository\BddRestoRepository;
use App\Repository\CodeinseeRepository;
use Doctrine\ORM\EntityManagerInterface;
use App\Repository\DepartementRepository;
use App\Repository\AvisRestaurantRepository;
use App\Service\Tribu_T_Service;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class RestaurantController extends AbstractController
{

    #[Route("/restaurant", name: "restaurant_all_dep", methods: ["GET"])]
    public function getAllDepartement(
        Status $status,
        CodeapeRepository $codeApeRep,
        DepartementRepository $departementRepository,
        BddRestoRepository $bddResto,
        CodeinseeRepository $code,
        TributGService $tributGService,
        EntityManagerInterface $entityManager,
        UserRepository $userRepository
    ) {
        $statusProfile = $status->statusFondateur($this->getUser());
        $dataRequest = $departementRepository->getDep();
        // $id_dep = $dataRequest["id"];
        // $datas = $code->getAllCodinsee($id_dep);
        // dump($dataRequest);
        //dd($bddResto->getAccountRestauranting(),$bddResto->getAllOpenedRestos());

        
        ///current user connected
        $user = $this->getUser();

        //dd($user);

        $amis_in_tributG = [];

        $userConnected = $status->userProfilService($this->getUser());
        if($user){
            // ////profil user connected
            $profil = $tributGService->getProfil($user, $entityManager);

            $id_amis_tributG = $tributGService->getAllTributG($profil[0]->getTributG());  /// [ ["user_id" => ...], ... ]

            ///to contains profil user information
            
            foreach ($id_amis_tributG  as $id_amis) { /// ["user_id" => ...]

                ///check their type consumer of supplier
                $user_amis = $userRepository->find(intval($id_amis["user_id"]));
               
                if( $user_amis ){
                    $profil_amis = $tributGService->getProfil($user_amis, $entityManager)[0];
                    ///single profil
                    $amis = [
                        "id" => $id_amis["user_id"],
                        "photo" => $profil_amis->getPhotoProfil(),
                        "email" => $user_amis->getEmail(),
                        "firstname" => $profil_amis->getFirstname(),
                        "lastname" => $profil_amis->getLastname(),
                        "image_profil" => $profil_amis->getPhotoProfil(),
                    ];
    
                    ///get it
                    array_push($amis_in_tributG, $amis);
                }
            }
        }

        
        return $this->render("restaurant/index.html.twig", [
            "departements" => $departementRepository->getDep(),
            //"number_of_departement" => count($bddResto->getAllOpenedRestos()),
            "number_of_departement" => $bddResto->getAccountRestauranting(),
            "profil" => $statusProfile["profil"],
            "statusTribut" => $statusProfile["statusTribut"],
            // "codinsees" => $datas,
            "codeApes" => $codeApeRep->getCode(),
            "amisTributG" => $amis_in_tributG, 
            "userConnected" => $userConnected,
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
        $userConnected = $status->userProfilService($this->getUser());
        //dd($bddResto->getAccountRestauranting(),$bddResto->getAllOpenedRestos());
        return $this->render("shard/restaurant/mobile-depart.js.twig", [
            "departements" => $departementRepository->getDep(),
            "number_of_departement" => count($bddResto->getAllOpenedRestos()),
            "profil" => $statusProfile["profil"],
            "statusTribut" => $statusProfile["statusTribut"],
            "userConnected" => $userConnected,
            "codeApes" => $codeApeRep->getCode()
        ]);
    }


    #[Route("/Coord/All/Restaurant", name: "app_coord_restaurant", methods: ["GET"])]
    public function getAllRestCoor(
        Request $request,
        BddRestoRepository $bddResto,
        SerializerInterface $serialize
    ) {
      
        if($request->query->has("minx") && $request->query->has("miny") ){

            $minx = $request->query->get("minx");
            $maxx = $request->query->get("maxx");
            $miny = $request->query->get("miny");
            $maxy = $request->query->get("maxy");

            $datas = $serialize->serialize($bddResto->getDataBetweenAnd($minx, $miny, $maxx, $maxy), 'json');

            return new JsonResponse($datas, 200, [], true);
        }

        $datas = $serialize->serialize($bddResto->getSomeDataShuffle(2000), 'json');
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
        Request $request,
        BddRestoRepository $bddResto,
        SerializerInterface $serialize,
        $dep
    ) {

        if($request->query->has("minx") && $request->query->has("miny") ){

            $minx = $request->query->get("minx");
            $maxx = $request->query->get("maxx");
            $miny = $request->query->get("miny");
            $maxy = $request->query->get("maxy");

            $datas = $serialize->serialize($bddResto->getDataBetweenAnd($minx, $miny, $maxx, $maxy, $dep), 'json');

            return new JsonResponse($datas, 200, [], true);
        }
        $datas = $serialize->serialize($bddResto->getCoordinateAndRestoIdForSpecific($dep), 'json');
        return new JsonResponse($datas, 200, [], true);
    }

    #[Route("/restaurant/specific", name: "app_specific_dep_restaurant", methods: ["GET"])]
    public function getSpecificRestaurant(
        BddRestoRepository $bddResto,
        Status $status,
        Request $request,
        CodeapeRepository $codeApeRep,
        TributGService $tributGService,
        UserRepository $userRepository,
        EntityManagerInterface $entityManager,
    ) {

        $dataRequest = $request->query->all();
        $nomDep = $dataRequest["nom_dep"];
        $codeDep = $dataRequest["id_dep"];
        $userConnected = $status->userProfilService($this->getUser());
        $datas = $bddResto->getAllRestoIdForSpecificDepartement($codeDep);

        $resultCount = $bddResto->getAccountRestauranting($codeDep);

        ///current user connected
        $user = $this->getUser();

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
               
                if( $user_amis ){
                    $profil_amis = $tributGService->getProfil($user_amis, $entityManager)[0];
                    ///single profil
                    $amis = [
                        "id" => $id_amis["user_id"],
                        "photo" => $profil_amis->getPhotoProfil(),
                        "email" => $user_amis->getEmail(),
                        "firstname" => $profil_amis->getFirstname(),
                        "lastname" => $profil_amis->getLastname(),
                        "image_profil" => $profil_amis->getPhotoProfil(),
                    ];
    
                    ///get it
                    array_push($amis_in_tributG, $amis);
                }
            }
        }

        return $this->render("restaurant/specific_departement.html.twig", [
            "id_dep" => $codeDep,
            "nom_dep" => $nomDep,
            "userConnected" => $userConnected,
            "type" => "resto",
            "restaurants" => $datas,
            "nomber_resto" => $resultCount,
            "profil" => $statusProfile["profil"],
            "statusTribut" => $statusProfile["statusTribut"],
            "codeApes" => $codeApeRep->getCode(),
            "amisTributG" => $amis_in_tributG,
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
        $resultCount= $bddResto->getAccountRestauranting($codeDep);
        $userConnected = $status->userProfilService($this->getUser());
        $statusProfile = $status->statusFondateur($this->getUser());

        return $this->render("shard/restaurant/specific_mobile_departement.js.twig", [
            "id_dep" => $codeDep,
            "nom_dep" => $nomDep,
            "restaurants" => $datas,
            "nomber_resto" => $resultCount,
            "profil" => $statusProfile["profil"],
            "statusTribut" => $statusProfile["statusTribut"],
            "userConnected" => $userConnected,
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
        CodeinseeRepository $code,
        UserRepository $userRepository,
        EntityManagerInterface $entityManager,
        TributGService $tributGService,
    ) {
        $dataRequest = $request->query->all();
        $nomDep = $dataRequest["nom_dep"];
        $codeDep = $dataRequest["id_dep"];
        $userConnected = $status->userProfilService($this->getUser());
        $datas = $code->getAllCodinsee($codeDep);
        
        $resto = $bddResto->getCoordinateAndRestoIdForSpecific($codeDep);
        $resultCount = $bddResto->getAccountRestauranting($codeDep);
        // dump($resultCount);

        ///current user connected
        $user = $this->getUser();

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
                ];

                ///get it
                array_push($amis_in_tributG, $amis);
            }
        }
 

        return $this->render("restaurant/restaurant_arrondisment.html.twig", [
            "id_dep" => $codeDep,
            "nom_dep" => $nomDep,
            "type" => "resto",
            "restaurants" => $resto,
            "codinsees" => $datas,
            "resto_nombre" => $resultCount,
            "userConnected" => $userConnected,
            "profil" => $statusProfile["profil"],
            "statusTribut" => $statusProfile["statusTribut"],
            "codeApes" => $codeApeRep->getCode(),
            "amisTributG" => $amis_in_tributG
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
        $resultCount= $bddResto->getAccountRestauranting($codeDep);
        $statusProfile = $status->statusFondateur($this->getUser());
        $userConnected = $status->userProfilService($this->getUser());
        return $this->render("shard/restaurant/arrondisment_resto_mobile_navleft.twig", [
            "id_dep" => $codeDep,
            "nom_dep" => $nomDep,
            "codinsees" => $datas,
            "resto_nombre" => $resultCount,
            "profil" => $statusProfile["profil"],
            "statusTribut" => $statusProfile["statusTribut"],
            "userConnected" => $userConnected,
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
        $userConnected = $status->userProfilService($this->getUser());


        return $this->render("restaurant/specific_departement.html.twig", [
            "id_dep" => $codeDep,
            "nom_dep" => $nomDep,
            "restaurants" => $datas,
            "nomber_resto" => $resultCount,
            "profil" => $statusProfile["profil"],
            "statusTribut" => $statusProfile["statusTribut"],
            "codeApes" => $codeApeRep->getCode(),
            "userConnected" => $userConnected,
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
     * @Route("/restaurant/{nom_dep}/{id_dep}/details/{id_restaurant}" , name="app_detail_restaurant" , methods="GET" )
     * @Route("/api/restaurant/{nom_dep}/{id_dep}/details/{id_restaurant}" , name="api_detail_restaurant" , methods="GET" )
     */
    public function detailRestaurant(
        Request $request,
        CodeapeRepository $codeApeRep,
        BddRestoRepository $bddResto,
        Status $status,
        $nom_dep,
        $id_dep,
        $id_restaurant,
        UserRepository $userRepository,
        Tribu_T_Service $tribu_T_Service
    ): Response {
        $statusProfile = $status->statusFondateur($this->getUser());
        $details= $bddResto->getOneRestaurant($id_dep, $id_restaurant)[0];

        if(str_contains($request->getPathInfo(), '/api/restaurant')){
            return $this->json([
                "details" => $details,
                "id_dep" => $id_dep,
                "nom_dep" => $nom_dep,
            ], 200);
        }

        $arrayTribu = [];
        $arrayTribuRestoPast = [];
        $arrayTribuRestoJoinedPast = [];
        
        if($this->getUser()){

            $tribu_t_owned = $userRepository->getListTableTribuT_owned();

            // dd($tribu_t_owned);
    
            foreach ($tribu_t_owned as $key) {
                $tableTribu = $key["table_name"];
                $logo_path = $key["logo_path"];
                $tableExtension = $tableTribu . "_restaurant";
                if($tribu_T_Service->checkExtension($tableTribu, "_restaurant") > 0){
                    if(!$tribu_T_Service->checkExtensionId($tableExtension, $details["id"])){
                        array_push($arrayTribu, ["table_name" => $tableTribu, "logo_path" => $logo_path]);
                    }else{
                        array_push($arrayTribuRestoPast, ["table_name" => $tableTribu, "logo_path" => $logo_path]);
                    }
                }
            }

            $tribu_t_joined = $userRepository->getListTalbeTribuT_joined();
            // dd($tribu_t_joined);
            foreach ($tribu_t_joined as $key) {
                $tbtJoined = $key["table_name"];
                $logo_path = $key["logo_path"];
                $tableExtensionTbtJoined = $tbtJoined . "_restaurant";
                if($tribu_T_Service->checkExtension($tbtJoined, "_restaurant") > 0){
                    if($tribu_T_Service->checkExtensionId($tableExtensionTbtJoined, $details["id"])){
                        array_push($arrayTribuRestoJoinedPast, ["table_name" => $tbtJoined, "logo_path" => $logo_path]);
                    }
                }
            }

        }

        return $this->render("restaurant/detail_resto.html.twig", [
            "details" => $details,
            "id_dep" => $id_dep,
            "nom_dep" => $nom_dep,
            "profil" => $statusProfile["profil"],
            "statusTribut" => $statusProfile["statusTribut"],
            "codeApes" => $codeApeRep->getCode(),
            "tribu_t_can_pastille" => $arrayTribu,
            "tribu_t_resto_pastille" => $arrayTribuRestoPast,
            "tribu_t_resto_joined_pastille" => $arrayTribuRestoJoinedPast
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

    #[Route("/user/resto/apropos/{idRestaurant}", name:"rest_apropos")]
    public function getOneRestaurantById($idRestaurant,
    BddRestoRepository $bdd,SerializerInterface $serializer){
    
       $r=$bdd->getOneRestaurantById($idRestaurant);
        $response = $serializer->serialize($r, 'json');
        return new JsonResponse($response, 200, [], true);
    }

    #[Route("/restaurant/poi/limit", name: 'app_poi', methods: ["GET"])]
    public function getAllPoi(SerializerInterface $serializer, BddRestoRepository $rep)
    {

        $response = $rep->getAllOpenedRestosV2(10000);

        $json = $serializer->serialize($response, 'json');
        return new JsonResponse($json, 200, [], true);
    }

    #[Route("/restaurant/maxmin", name: 'app_minmax', methods: ["GET"])]
    public function getRestoBetweenMinmax(
        SerializerInterface $serializer,
        Request $request,
        BddRestoRepository $rep
    ) {

        $minx = $request->query->get("minx");
        $maxx = $request->query->get("maxx");
        $miny = $request->query->get("miny");
        $maxy = $request->query->get("maxy");
        //dd(abs($minx));
        $response = $rep->getDataBetweenAnd($minx, $miny, $maxx, $maxy);
        $json = $serializer->serialize($response, 'json');
        return new JsonResponse($json, 200, [], true);
    }
    
}
