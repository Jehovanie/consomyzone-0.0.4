<?php

namespace App\Controller;

use App\Service\Status;
use App\Entity\AvisRestaurant;
use App\Entity\BddRestoUserModif;
use App\Entity\Codinsee;
use App\Service\TributGService;
use App\Service\Tribu_T_Service;
use App\Repository\UserRepository;
use App\Repository\CodeapeRepository;
use App\Repository\BddRestoRepository;
use App\Repository\CodeinseeRepository;
use Doctrine\ORM\EntityManagerInterface;
use App\Repository\DepartementRepository;
use App\Repository\AvisRestaurantRepository;
use App\Repository\BddRestoUserModifRepository;
use App\Service\Tribu_T_ServiceNew;
use Exception;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Serializer\Encoder\JsonDecode;

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

        ///current user connected
        $user = $this->getUser();

        //dd($user);

        $amis_in_tributG = [];

        $userConnected = $status->userProfilService($this->getUser());
        if($user && $user->getType()!="Type"){
            // ////profil user connected
            $profil = $tributGService->getProfil($user, $entityManager);

            $id_amis_tributG = $tributGService->getAllTributG($profil[0]->getTributG());  /// [ ["user_id" => ...], ... ]

            ///to contains profil user information
            
            foreach ($id_amis_tributG  as $id_amis) { /// ["user_id" => ...]

                ///check their type consumer of supplier
                $user_amis = $userRepository->find(intval($id_amis["user_id"]));
               
                if( $user_amis && $user_amis->getType() != 'Type' ){
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
        SerializerInterface $serialize,
        UserRepository $userRepository,
        Tribu_T_ServiceNew $tribu_T_Service,
        AvisRestaurantRepository $avisRestaurantRepository
    ) {
        $arrayIdResto = [];

        //// all my tribu t.
        $tribu_t_owned = $userRepository->getListTableTribuT_owned(); /// [ [table_name => ..., name_tribu_t_muable => ..., logo_path => ...], ...]

        //// description tribu T with ID restaurant pastille
        $arrayIdResto = $tribu_T_Service->getEntityRestoPastilled($tribu_t_owned); /// [ [ id_resto => ..., tableName => ..., name_tribu_t_muable => ..., logo_path => ...], ... ]

        if($request->query->has("minx") && $request->query->has("miny") ){

            $minx = $request->query->get("minx");
            $maxx = $request->query->get("maxx");
            $miny = $request->query->get("miny");
            $maxy = $request->query->get("maxy");

            $datas = $bddResto->getDataBetweenAnd($minx, $miny, $maxx, $maxy);

            $ids=array_map('self::getIdAvisResto',$datas);

            $moyenneNote = $avisRestaurantRepository->getAllNoteById($ids);
            //merge of resto data and note 
            // $l=array_map("self::mergeDatasAndAvis",$datas,$moyenneNote);
            return $this->json([
                "data" => self::mergeDatasAndAvis($datas,$moyenneNote),
                "allIdRestoPastille" => $arrayIdResto
            ], 200);
        }

        //// data resto all departement
        $datas= $bddResto->getSomeDataShuffle(2000);

        //// update data result to add all resto pastille in the Tribu T
        $datas = $bddResto->appendRestoPastille($datas, $arrayIdResto);

        $ids=array_map('self::getIdAvisResto',$datas);

        $moyenneNote = $avisRestaurantRepository->getAllNoteById($ids);

        return $this->json([
            "data" =>self::mergeDatasAndAvis($datas,$moyenneNote),
            "allIdRestoPastille" => $arrayIdResto,
           
        ], 200);
    }
    /**
     * @author Nantenaina <email>
     * où= dans la fonction getAllRestCoor
     * location=RestaurantController.phpo
     * je veux avoir les id des  resto recupéré apres  appel de la fonction getDataBetweenAnd()
     * pour avoir les notes
     */
    static function getIdAvisResto($data){
        return $data["id"];
    } 

    /**
     * @author Nantenaina <email>
     * où= dans la fonction getAllRestCoor
     * location=RestaurantController.phpo
     * je veux fussioner les  resto recupéré apres  appel de la fonction getDataBetweenAnd() et leur note
     * pour avoir les notes
     */
    public function mergeDatasAndAvis($datas,$notes){
        $noteExist=[];
        foreach($datas as $data){
            foreach($notes as $note){
                if(intval($data["id"]) === intval($note["id_resto"])){
                    // array_push($noteExist,array_merge($data,$note));
                    $data["moyenne_note"] = $note["moyenne_note"];
                    $data["id_resto"] = $note["id_resto"];
                    array_push($noteExist,$data);
                    break;
                }
               
            }
            if( !isset($data["moyenne_note"]))
                array_push($noteExist,$data);
        }
       return $noteExist;
        
    }

   

    #[Route("/test/get/avis", name:"find_all_avis", methods:["GET"])]
    public function getAllAvis(AvisRestaurantRepository $avisRestaurantRepository)
    {
        $avis = $avisRestaurantRepository->getAllNoteById([36489,1,36488,36505]);
        return $this->json($avis);
    }

    #[Route("/Coord/All/Restaurant/specific/arrondissement/{dep}/{codinsee}", name: "app_coord_restaurant_sepcific_arrond", methods: ["GET"])]
    public function getAllRestCoorArrondissement(
        $dep,
        $codinsee,
        Request $request,
        BddRestoRepository $bddResto,
        SerializerInterface $serialize,
        UserRepository $userRepository,
        Tribu_T_ServiceNew $tribu_T_Service,
        AvisRestaurantRepository $avisRestaurantRepository
    ) {
        $arrayIdResto = [];

        //// all my tribu t.
        $tribu_t_owned = $userRepository->getListTableTribuT_owned(); /// [ [table_name => ..., name_tribu_t_muable => ..., logo_path => ...], ...]

        //// description tribu T with ID restaurant pastille
        $arrayIdResto = $tribu_T_Service->getEntityRestoPastilled($tribu_t_owned); /// [ [ id_resto => ..., tableName => ..., name_tribu_t_muable => ..., logo_path => ...], ... ]

        if($request->query->has("minx") && $request->query->has("miny") ){

            $minx = $request->query->get("minx");
            $maxx = $request->query->get("maxx");
            $miny = $request->query->get("miny");
            $maxy = $request->query->get("maxy");

            $datas = $bddResto->getDataBetweenAnd($minx, $miny, $maxx, $maxy, $dep, $codinsee);

            $ids=array_map('self::getIdAvisResto',$datas);

            $moyenneNote = $avisRestaurantRepository->getAllNoteById($ids);

            return $this->json([
                "data" => self::mergeDatasAndAvis($datas,$moyenneNote),
                "allIdRestoPastille" => $arrayIdResto
            ], 200);
        }

        //// $data resto specific in $dep and $codinsee
        $datas = $bddResto->getCoordinateAndRestoIdForSpecific($dep, $codinsee);

        //// update data result to add all resto pastille in the Tribu T
        $datas = $bddResto->appendRestoPastille($datas, $arrayIdResto);

        $ids=array_map('self::getIdAvisResto',$datas);

        $moyenneNote = $avisRestaurantRepository->getAllNoteById($ids);

        return $this->json([
            "data" => self::mergeDatasAndAvis($datas,$moyenneNote),
            "allIdRestoPastille" => $arrayIdResto
        ], 200);
    }

    #[Route("/Coord/Spec/Restaurant/{dep}", name: "app_coord_spec_restaurant", methods: ["GET"])]
    public function getSpecificRestCoor(
        $dep,
        Request $request,
        BddRestoRepository $bddResto,
        SerializerInterface $serialize,
        UserRepository $userRepository,
        Tribu_T_ServiceNew $tribu_T_Service,
        AvisRestaurantRepository $avisRestaurantRepository
    ) {
        $arrayIdResto = [];

        //// all my tribu t.
        $tribu_t_owned = $userRepository->getListTableTribuT_owned();  /// [ [table_name => ..., name_tribu_t_muable => ..., logo_path => ...], ...]

        //// description tribu T with ID restaurant pastille
        $arrayIdResto = $tribu_T_Service->getEntityRestoPastilled($tribu_t_owned); /// [ [ id_resto => ..., tableName => ..., name_tribu_t_muable => ..., logo_path => ...], ... ]
        
        if($request->query->has("minx") && $request->query->has("miny") ){

            $minx = $request->query->get("minx");
            $maxx = $request->query->get("maxx");
            $miny = $request->query->get("miny");
            $maxy = $request->query->get("maxy");

            $datas = $bddResto->getDataBetweenAnd($minx, $miny, $maxx, $maxy, $dep);

            $ids=array_map('self::getIdAvisResto',$datas);

            $moyenneNote = $avisRestaurantRepository->getAllNoteById($ids);

            return $this->json([
                    "data" => self::mergeDatasAndAvis($datas,$moyenneNote),
                    "allIdRestoPastille" => $arrayIdResto
            ], 200);
        }

        //// data resto specific in departement
        $datas = $bddResto->getCoordinateAndRestoIdForSpecific($dep);

        //// update data result to add all resto pastille in the Tribu T
        $datas = $bddResto->appendRestoPastille($datas, $arrayIdResto);

        $ids=array_map('self::getIdAvisResto',$datas);

        $moyenneNote = $avisRestaurantRepository->getAllNoteById($ids);

        return $this->json([
            "data" => self::mergeDatasAndAvis($datas,$moyenneNote),
            "allIdRestoPastille" => $arrayIdResto
        ], 200);
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
        AvisRestaurantRepository $avisRestaurantRepository,
        Tribu_T_Service $tribu_T_Service,
    ) {

        $dataRequest = $request->query->all();
        $nomDep = $dataRequest["nom_dep"];
        $codeDep = $dataRequest["id_dep"];
        $userConnected = $status->userProfilService($this->getUser());
        $datas = [];
       
        $restos = $bddResto->getAllRestoIdForSpecificDepartement($codeDep);
        
        foreach ($restos as $data){
            $nbr_avis_resto = $avisRestaurantRepository->getNombreAvis($data["id"]);

            $global_note  = $avisRestaurantRepository->getNoteGlobale($data["id"]);

            $isAlreadyCommented = false;
            $avis = ["note" => null, "text" => null];

            $note_temp = 0;
            foreach ($global_note as $note) {
                if ($this->getUser() && $this->getUser()->getID() === $note["user"]["id"]  ) {
                    $isAlreadyCommented = true;
                    $avis = ["note" => $note["note"], "text" =>  $note["avis"]];
                }
                $note_temp +=  $note["note"];
            }

            $data["avis"] = [
                "nbr" => $nbr_avis_resto,
                "note" => $global_note ?  $note_temp / count($global_note) : 0,
                "isAlreadyCommented" => $isAlreadyCommented,
                "avisPerso" => $avis
            ];
            

            array_push($datas, $data);

            
        }

        

       
        $resultCount = $bddResto->getAccountRestauranting($codeDep);

        ///current user connected
        $user = $this->getUser();

        $statusProfile = $status->statusFondateur($user);

        $amis_in_tributG = [];

        if($user && $user->getType()!="Type"){
            // ////profil user connected
            $profil = $tributGService->getProfil($user, $entityManager);

            $id_amis_tributG = $tributGService->getAllTributG($profil[0]->getTributG());  /// [ ["user_id" => ...], ... ]

            ///to contains profil user information
            foreach ($id_amis_tributG  as $id_amis) { /// ["user_id" => ...]

                ///check their type consumer of supplier
                $user_amis = $userRepository->find(intval($id_amis["user_id"]));
               
                if( $user_amis && $user_amis->getType() != 'Type'){
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
        }

        // dd($datas);

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

    #[Route("/restaurant-mobile/specific/{nom_dep}/{id_dep}/{limit}/{offset}", name: "app_specific_dep_restaurant_mobile", methods: ["GET"])]
    public function getSpecificRestaurantMobile(
        BddRestoRepository $bddResto,
        Status $status,
        Request $request,
        CodeapeRepository $codeApeRep,
        Tribu_T_ServiceNew $tribu_T_Service,
        UserRepository $userRepository,
        $nom_dep,
        $id_dep,
        $limit,
        $offset,
        AvisRestaurantRepository $avisRestaurantRepository,

    ) {
        $datas = [];
        $idData = [];
        
        $restos = $bddResto->getCoordinateAndRestoIdForSpecificMobile($id_dep , null, $limit, $offset);
        $resultCount= $bddResto->getAccountRestauranting($id_dep);
        $userConnected = $status->userProfilService($this->getUser());
        $statusProfile = $status->statusFondateur($this->getUser());
        foreach ($restos as $data) {
            $arrayTribu = [];
            $arrayTribuRestoPast = [];
            $arrayTribuRestoJoinedPast = [];
            $nbr_avis_resto = $avisRestaurantRepository->getNombreAvis($data["id"]);

            $global_note  = $avisRestaurantRepository->getNoteGlobale($data["id"]);

            $isAlreadyCommented = false;
            $avis = ["note" => null, "text" => null];



            $note_temp = 0;
            foreach ($global_note as $note) {
                if ($this->getUser() && $this->getUser()->getID() === $note["user"]["id"]) {
                    $isAlreadyCommented = true;
                    $avis = ["note" => $note["note"], "text" =>  $note["avis"]];
                }
                $note_temp +=  $note["note"];
            }


            

            $data["avis"] = [
                "nbr" => $nbr_avis_resto,
                "note" => $global_note ?  $note_temp / count($global_note) : 0,
                "isAlreadyCommented" => $isAlreadyCommented,
                "avisPerso" => $avis
            ];

            if ($this->getUser()) {

                $tribu_t_owned = $userRepository->getListTableTribuT_owned();

                $arrayTribuRestoPast = $this->getTribuTForRestoPastilled($tribu_T_Service, $tribu_t_owned, $data["id"], $arrayTribuRestoPast);

                $tribu_t_joined = $userRepository->getListTalbeTribuT_joined();

                $arrayTribuRestoJoinedPast = $this->getTribuTForRestoPastilled($tribu_T_Service, $tribu_t_joined, $data["id"], $arrayTribuRestoJoinedPast);

            }
            $data["tribuTPastie"] =  [
                "tribu_t_can_pastille" => $arrayTribu,
                "tribu_t_resto_pastille" => $arrayTribuRestoPast,
                "tribu_t_resto_joined_pastille" => $arrayTribuRestoJoinedPast,
            ];
            

            array_push($datas, $data);
            array_push($idData, $data["id"]);
        }
       
        
        return $this->json([
            "id_dep" => $id_dep,
            "nom_dep" => $nom_dep,
            "restaurants" => $datas,
            "nomber_resto" => $resultCount,
            "profil" => $statusProfile["profil"],
            "statusTribut" => $statusProfile["statusTribut"],
            "userConnected" => $userConnected,
            "codeApes" => $codeApeRep->getCode(),
            "type" => "resto",
            // "arrdssm" => $arrdssm,
            // "codinsee" => $codinsee
        ],);
    }

    #[Route("/restaurant-mobile/specific/{nom_dep}/{id_dep}/{id_resto}", name: "app_specific_dep_restaurant_search", methods: ["GET"])]
    public function getSpecificRestaurantSearch(
        BddRestoRepository $bddResto,
        Status $status,
        $nom_dep,
        $id_dep,
        $id_resto,
        CodeapeRepository $codeApeRep,
        TributGService $tributGService,
        Tribu_T_ServiceNew $tribu_T_Service,
        UserRepository $userRepository,
        EntityManagerInterface $entityManager,
        AvisRestaurantRepository $avisRestaurantRepository,
    ) {

        $userConnected = $status->userProfilService($this->getUser());
        $datas = [];

        $restos = $bddResto->getAllRestoIdForSpecificDepartementMobile($id_dep, $id_resto);

        foreach ($restos as $data) {
            $nbr_avis_resto = $avisRestaurantRepository->getNombreAvis($data["id"]);

            $global_note  = $avisRestaurantRepository->getNoteGlobale($data["id"]);

            $isAlreadyCommented = false;
            $avis = ["note" => null, "text" => null];

            $note_temp = 0;
            foreach ($global_note as $note) {
                if ($this->getUser() && $this->getUser()->getID() === $note["user"]["id"]) {
                    $isAlreadyCommented = true;
                    $avis = ["note" => $note["note"], "text" =>  $note["avis"]];
                }
                $note_temp +=  $note["note"];
            }

            $data["avis"] = [
                "nbr" => $nbr_avis_resto,
                "note" => $global_note ?  $note_temp / count($global_note) : 0,
                "isAlreadyCommented" => $isAlreadyCommented,
                "avisPerso" => $avis
            ];


            array_push($datas, $data);
        }




        $resultCount = $bddResto->getAccountRestauranting($id_dep);

        ///current user connected
        $user = $this->getUser();

        $statusProfile = $status->statusFondateur($user);

        $amis_in_tributG = [];

        if ($user) {
            // ////profil user connected
            $profil = $tributGService->getProfil($user, $entityManager);

            $id_amis_tributG = $tributGService->getAllTributG($profil[0]->getTributG());  /// [ ["user_id" => ...], ... ]

            ///to contains profil user information
            foreach ($id_amis_tributG  as $id_amis) { /// ["user_id" => ...]

                ///check their type consumer of supplier
                $user_amis = $userRepository->find(intval($id_amis["user_id"]));

                if ($user_amis && $user_amis->getType() != 'Type') {
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
        }

        $arrayTribu = [];
        $arrayTribuRestoPast = [];
        $arrayTribuRestoJoinedPast = [];

        if ($this->getUser()) {

            $tribu_t_owned = $userRepository->getListTableTribuT_owned();

            $arrayTribuRestoPast = $this->getTribuTForRestoPastilled($tribu_T_Service, $tribu_t_owned, $id_resto, $arrayTribuRestoPast);

            $tribu_t_joined = $userRepository->getListTalbeTribuT_joined();

            $arrayTribuRestoJoinedPast = $this->getTribuTForRestoPastilled($tribu_T_Service, $tribu_t_joined, $id_resto, $arrayTribuRestoJoinedPast);
            
        }

        // dd($datas);

        return $this->json([
            "id_dep" => $id_dep,
            "nom_dep" => $nom_dep,
            "userConnected" => $userConnected,
            "type" => "resto",
            "restaurants" => $datas,
            "nomber_resto" => $resultCount,
            "profil" => $statusProfile["profil"],
            "statusTribut" => $statusProfile["statusTribut"],
            "codeApes" => $codeApeRep->getCode(),
            "amisTributG" => $amis_in_tributG,
            "tribu_t_can_pastille" => $arrayTribu,
            "tribu_t_resto_pastille" => $arrayTribuRestoPast,
            "tribu_t_resto_joined_pastille" => $arrayTribuRestoJoinedPast,
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

        if($user && $user->getType()!="Type"){
            // ////profil user connected
            $profil = $tributGService->getProfil($user, $entityManager);

            $id_amis_tributG = $tributGService->getAllTributG($profil[0]->getTributG());  /// [ ["user_id" => ...], ... ]

            ///to contains profil user information
            
            foreach ($id_amis_tributG  as $id_amis) { /// ["user_id" => ...]

                ///check their type consumer of supplier
                $user_amis = $userRepository->find(intval($id_amis["user_id"]));

                if($user_amis && $user_amis->getType()!="Type"){

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
        TributGService $tributGService,
        UserRepository $userRepository,
        EntityManagerInterface $entityManager,
        AvisRestaurantRepository $avisRestaurantRepository,
    ) {
        $dataRequest = $request->query->all();
        $nomDep = $dataRequest["nom_dep"];
        $codeDep = $dataRequest["id_dep"];
        $codinsee = $dataRequest["codinsee"];
        $arrdssm = $dataRequest["arrdssm"];


        $datas = [];

        $restos = $bddResto->getAllRestoIdForSpecificDepartement($codeDep);
        foreach ($restos as $data){
            $nbr_avis_resto = $avisRestaurantRepository->getNombreAvis($data["id"]);

            $global_note  = $avisRestaurantRepository->getNoteGlobale($data["id"]);

            $isAlreadyCommented = false;
            $avis = ["note" => null, "text" => null];

            $note_temp = 0;
            foreach ($global_note as $note) {
                if ($this->getUser() && $this->getUser()->getID() === $note["user"]["id"] ) {
                    $isAlreadyCommented = true;
                    $avis = ["note" => $note["note"], "text" => $note["avis"]];
                }
                $note_temp += $note["note"];
            }

            $data["avis"] = [
                "nbr" => $nbr_avis_resto,
                "note" => $global_note ?  $note_temp / count($global_note) : 0,
                "isAlreadyCommented" => $isAlreadyCommented,
                "avisPerso" => $avis
            ];
            

            array_push($datas, $data);

            
        }
        $resultCount = count($datas);
        $statusProfile = $status->statusFondateur($this->getUser());
        $userConnected = $status->userProfilService($this->getUser());


        ///current user connected
        $user = $this->getUser();

        $amis_in_tributG = [];

        if($user && $user->getType()!="Type"){
            // ////profil user connected
            $profil = $tributGService->getProfil($user, $entityManager);

            $id_amis_tributG = $tributGService->getAllTributG($profil[0]->getTributG());  /// [ ["user_id" => ...], ... ]

            ///to contains profil user information
            
            foreach ($id_amis_tributG  as $id_amis) { /// ["user_id" => ...]

                ///check their type consumer of supplier
                $user_amis = $userRepository->find(intval($id_amis["user_id"]));

                if($user_amis && $user_amis->getType() != 'Type'){

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
        }
 
        return $this->render("restaurant/specific_departement.html.twig", [
            "id_dep" => $codeDep,
            "nom_dep" => $nomDep,
            "type" => "resto",
            "restaurants" => $datas,
            "nomber_resto" => $resultCount,
            "profil" => $statusProfile["profil"],
            "statusTribut" => $statusProfile["statusTribut"],
            "codeApes" => $codeApeRep->getCode(),
            "userConnected" => $userConnected,
            "codinsee" => $codinsee,
            "arrdssm" => $arrdssm,
            "amisTributG" => $amis_in_tributG
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
        $id_restaurant,
        AvisRestaurantRepository $avisRestaurantRepository
    ): Response {
        $statusProfile = $status->statusFondateur($this->getUser());
        $details = $bddResto->getOneRestaurant($id_dep, $id_restaurant)[0];

        $nbr_avis_resto = $avisRestaurantRepository->getNombreAvis($details["id"]);

        $global_note  = $avisRestaurantRepository->getNoteGlobale($details["id"]);

        $isAlreadyCommented = false;
        $avis = ["note" => null, "text" => null];

        $note_temp = 0;
        foreach ($global_note as $note) {
            if ($this->getUser() && $this->getUser()->getID() === $note->getUser()->getID()) {
                $isAlreadyCommented = true;
                $avis = ["note" => $note->getNote(), "text" => $note->getAvis()];
            }
            $note_temp += $note->getNote();
        }

        $details["avis"] = [
            "nbr" => $nbr_avis_resto,
            "note" => $global_note ?  $note_temp / count($global_note) : 0,
            "isAlreadyCommented" => $isAlreadyCommented,
            "avisPerso" => $avis
        ];

        // return $this->json([
        //     "details" => $bddResto->getOneRestaurant($id_dep, $id_restaurant)[0],
        //     "id_dep" => $id_dep,
        //     "nom_dep" => $nom_dep,
        //     "profil" => $statusProfile["profil"],
        //     "statusTribut" => $statusProfile["statusTribut"],
        //     "codeApes" => $codeApeRep->getCode()

        // ], 200);

        return $this->render("shard/restaurant/details.js.twig", [
            "details" => $details,
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
        Tribu_T_ServiceNew $tribu_T_Service,
        AvisRestaurantRepository $avisRestaurantRepository
    ): Response {
        $statusProfile = $status->statusFondateur($this->getUser());
        $details= $bddResto->getOneRestaurant($id_dep, $id_restaurant)[0];

        $nbr_avis_resto = $avisRestaurantRepository->getNombreAvis($details["id"]);

        $global_note  = $avisRestaurantRepository->getNoteGlobale($details["id"]);

        $isAlreadyCommented= false;
        $avis= ["note" => null, "text" => null  ];
        
        $note_temp=0;
        foreach ($global_note as $note ) {
            if($this->getUser() && $this->getUser()->getID() === $note["user"]["id"]){
                $isAlreadyCommented = true;
                $avis = [ "note" => $note["note"], "text" => $note["avis"] ];
            }
            $note_temp += $note["note"]; 
        }

        $details["avis"] = [
            "nbr" => $nbr_avis_resto,
            "note" => $global_note ?  $note_temp / count($global_note) : 0,
            "isAlreadyCommented" => $isAlreadyCommented,
            "avisPerso" => $avis
        ];

        // dd($details);

        
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

            $arrayTribuRestoPast = $this->getTribuTForRestoPastilled($tribu_T_Service, $tribu_t_owned, $id_restaurant, $arrayTribuRestoPast);

            $tribu_t_joined = $userRepository->getListTalbeTribuT_joined();

            $arrayTribuRestoJoinedPast = $this->getTribuTForRestoPastilled($tribu_T_Service, $tribu_t_joined, $id_restaurant, $arrayTribuRestoJoinedPast);

        }
        return $this->render("restaurant/detail_resto.html.twig", [
            "id_restaurant"=>$id_restaurant,
            "details" => $details,
            "id_dep" => $id_dep,
            "nom_dep" => $nom_dep,
            "profil" => $statusProfile["profil"],
            "statusTribut" => $statusProfile["statusTribut"],
            "codeApes" => $codeApeRep->getCode(),
            "tribu_t_can_pastille" => $arrayTribu,
            "tribu_t_resto_pastille" => $arrayTribuRestoPast,
            "tribu_t_resto_joined_pastille" => $arrayTribuRestoJoinedPast,
        ]);
    }

    /*
    *use this API to know what tribu T had pastilled an rastaurant or not
    *DON'T CHANGE THIS ROUTE: It's use in js file.
    */
    #[Route("/restaurant/pastilled/checking/{idRestaurant}", name:"app_resto_pastilled_checked",methods:["GET"])]
    public function checkedIfRestaurantIsPastilled($idRestaurant,
    UserRepository $userRepository,
    Tribu_T_ServiceNew $tribu_T_Service,
    SerializerInterface $serializerInterface
    ){
        $arrayTribu = [];
        if($this->getUser()){

            $tribu_t_owned = $userRepository->getListTableTribuT_owned();
            
            $arrayTribu = $this->getTribuTForRestoPastilled($tribu_T_Service, $tribu_t_owned, $idRestaurant, $arrayTribu);
        }

        $datas = $serializerInterface->serialize($arrayTribu, 'json');
        return new JsonResponse($datas, 200, [], true);
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

        $resto = $bddResto->getOneRestaurant($id_dep, $id_restaurant)[0];

        // $nbr_avis_resto = $avisRestaurantRepository->getNombreAvis($resto[0]["id"]);
        // dd($nbr_avis_resto);

        return $this->render("shard/restaurant/detail_resto_navleft.twig", [
            "details" => $resto,
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
        CodeinseeRepository $code,
        AvisRestaurantRepository $avisRestaurantRepository,
    ): Response {
        $statusProfile = $status->statusFondateur($this->getUser());
        $dataRequest = $request->query->all();
    
        $codinsee = array_key_exists('codinsee', $dataRequest)? $dataRequest["codinsee"]: null;

        $details = $bddResto->getOneRestaurant($id_dep, $id_restaurant)[0];

        $nbr_avis_resto = $avisRestaurantRepository->getNombreAvis($details["id"]);

        $global_note  = $avisRestaurantRepository->getNoteGlobale($details["id"]);

        $isAlreadyCommented = false;
        $avis = ["note" => null, "text" => null];

        $note_temp = 0;
        foreach ($global_note as $note) {
            if ($this->getUser() && $this->getUser()->getID() === $note->getUser()->getID()) {
                $isAlreadyCommented = true;
                $avis = ["note" => $note->getNote(), "text" => $note->getAvis()];
            }
            $note_temp += $note->getNote();
        }

        $details["avis"] = [
            "nbr" => $nbr_avis_resto,
            "note" => $global_note ?  $note_temp / count($global_note) : 0,
            "isAlreadyCommented" => $isAlreadyCommented,
            "avisPerso" => $avis
        ];
        // $nbr_avis_resto = $avisRestaurantRepository->getNombreAvis($resto[0]["id"]);
        // dd($nbr_avis_resto);

        // $response = $serializer->serialize(["nombre_avis" => $nbr_avis_resto], 'json');
        
        return $this->render("shard/restaurant/details_mobile.js.twig", [
            "details" => $details,
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
            $rJson["avisID"],
            $rJson["note"],
            $rJson["avis"],
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

    #[Route("/user/make/modif/new/resto", name:"app_make_modif_user_resto", methods:["POST"])]
    public function makeModif(Request $request,BddRestoUserModifRepository $bddRepo){
        // try{
        $contents=json_decode($request->getContent(),true);
        $bddRestoUserModif=new BddRestoUserModif();
        $bddRestoUserModif->setDenominationF(json_encode($contents["denomination_f"]))
            ->setNumvoie(($contents["numvoie"]))
            ->setTypevoie(json_encode($contents["typevoie"]))
            ->setNomvoie(json_encode($contents["nomvoie"]))
            ->setCompvoie(json_encode($contents["compvoie"]))
            ->setCodpost(($contents["codpost"]))
            ->setVillenorm(json_encode($contents["villenorm"]))
            ->setCommune(json_encode($contents["commune"]))
            ->setTel(($contents["tel"]))
            ->setRestaurant(intval(($contents["restaurant"])))
            ->setBrasserie(intval(($contents["brasserie"])))
            ->setCreperie(intval(($contents["creperie"])))
            ->setFastFood(intval(($contents["fastFood"])))
            ->setPizzeria(intval(($contents["pizzeria"])))
            ->setBoulangerie(intval(($contents["boulangerie"])))
            ->setBar(intval(($contents["bar"])))
            ->setCuisineMonde(intval(($contents["cuisineMonde"])))
            ->setCafe(intval(($contents["cafe"])))
            ->setSalonThe(intval(($contents["the"])))
            ->setPoiX(doubleval(($contents["poix"])))
            ->setPoiY(doubleval(($contents["poiy"])))
            ->setUserId(intval($this->getUser()->getId()))
            ->setRestoId(intval(($contents["restoId"])));

            $bddRepo->save($bddRestoUserModif,true);
        // }catch(Exception $e){
        //     if($_ENV["APP_ENV"]=="dev")
        //         dd($e);
        //     $response = new Response();
        //     $response->setStatusCode(500);
        //     return $response;
        // }
        
        $response = new Response();
        $response->setStatusCode(201);
        return $response;
    }

    /**
     * @author Nantenaina
     * où: On utilise cette fonction dans les rubriques resto, tous et recherche cmz, 
     * localisation du fichier: dans RestaurantController.php,
     * je veux: avoir toutes les tribus pour un resto
     * @param Tribu_T_ServiceNew $tribu_T_Service: Obejt Tribu_T_ServiceNew
     * @param array $arrayTribuTOwnedOrJoined : Tableu de tribus T Owned or Joined
     * @param array $results : Tableu retourné
     * @param int $idRestaurant : identifiant d'un restaurant
    */
    public function getTribuTForRestoPastilled($tribu_T_Service, $arrayTribuTOwnedOrJoined, $idRestaurant, $results){
        
        foreach ($arrayTribuTOwnedOrJoined as $key) {
            $tableTribu = $key["nom_table_trbT"];
            $logo_path = $key["logo_path"];
            $name_tribu_t_muable =  array_key_exists("name_tribu_t_muable", $key) ? $key["name_tribu_t_muable"]:null;
            $tableExtension = $tableTribu . "_restaurant";
            if($key["ext_restaurant"]){
                if(!$tribu_T_Service->checkIfCurrentRestaurantPastilled($tableExtension, $idRestaurant, true)){
                    array_push($results, ["table_name" => $tableTribu, "name_tribu_t_muable" => $name_tribu_t_muable, "logo_path" => $logo_path,"isPastilled"=>false]);
                }else{
                    array_push($results, ["table_name" => $tableTribu, "name_tribu_t_muable" => $name_tribu_t_muable, "logo_path" => $logo_path, "isPastilled"=>true]);
                }
            }
            
        }

        return $results;

    }
    
}
