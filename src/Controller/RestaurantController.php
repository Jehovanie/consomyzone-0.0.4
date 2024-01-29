<?php

namespace App\Controller;

use Exception;
use App\Service\Status;
use App\Entity\Codinsee;
use App\Service\UserService;
use App\Entity\AvisRestaurant;
use App\Service\MessageService;
use App\Service\TributGService;
use App\Service\Tribu_T_Service;
use App\Entity\BddRestoUserModif;
use App\Repository\UserRepository;
use App\Repository\CodeapeRepository;
use App\Repository\BddRestoRepository;
use App\Repository\CodeinseeRepository;
use Doctrine\ORM\EntityManagerInterface;
use App\Repository\DepartementRepository;
use App\Repository\AvisRestaurantRepository;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Repository\BddRestoUserModifRepository;
use App\Service\MailService;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Serializer\Encoder\JsonDecode;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Symfony\Component\BrowserKit\HttpBrowser;
use Symfony\Component\HttpClient\HttpClient;

use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Constraints\DateTime;
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
        UserRepository $userRepository,
        MessageService $messageService
    ) {
        $statusProfile = $status->statusFondateur($this->getUser());
        $dataRequest = $departementRepository->getDep();

        ///current user connected
        $user = $this->getUser();

        //dd($user);
        $userConnected = $status->userProfilService($this->getUser());

        ///////GET PROFIL THE USER IN SAME TRIBUT G WITH ME////////////////////////////////
        ///to contains profil user information [ [ id => ..., photo => ..., email => ..., firstname => ..., lastname => ..., image_profil => ..., last_message => ..., is_online => ... ], ... ]
        $amis_in_tributG = $messageService->getListAmisToChat($user, $tributGService, $entityManager, $userRepository);

        
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
        Tribu_T_Service $tribu_T_Service,
        TributGService $tributGService,
        AvisRestaurantRepository $avisRestaurantRepository
    ) {
        $arrayIdResto = [];

        //// all my tribu t.
        $tribu_t_owned = $userRepository->getListTableTribuT_owned(); /// [ [table_name => ..., name_tribu_t_muable => ..., logo_path => ...], ...]

        //// description tribu T with ID restaurant pastille
        $arrayIdResto = $tribu_T_Service->getEntityRestoPastilled($tribu_t_owned); /// [ [ id_resto => ..., tableName => ..., name_tribu_t_muable => ..., logo_path => ...], ... ]
        
        //// list resto pastille dans le tribu G
        $restoPastilleInTribuG= $tributGService->getEntityRestoPastilled($this->getUser()); /// [ [ id_resto => ..., tableName => ..., name_tribu_t_muable => ..., logo_path => ...], ... ]
        
        $arrayIdResto= array_merge( $arrayIdResto, $restoPastilleInTribuG );

        if($request->query->has("minx") && $request->query->has("miny") ){

            $minx = $request->query->get("minx");
            $maxx = $request->query->get("maxx");
            $miny = $request->query->get("miny");
            $maxy = $request->query->get("maxy");

            $datas = $bddResto->getDataBetweenAnd($minx, $miny, $maxx, $maxy);

            if( $request->query->has("isFirstResquest")){
                //// update data result to add all resto pastille in the Tribu T
                $datas = $bddResto->appendRestoPastille($datas, $arrayIdResto);
            }

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
        Tribu_T_Service $tribu_T_Service,
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

            $datas = $bddResto->getDataBetweenAnd($minx, $miny, $maxx, $maxy, $dep, $codinsee, 50);

            if( $request->query->has("isFirstResquest")){
                //// update data result to add all resto pastille in the Tribu T
                $datas = $bddResto->appendRestoPastille($datas, $arrayIdResto);
            }

            $ids=array_map('self::getIdAvisResto',$datas);

            $moyenneNote = $avisRestaurantRepository->getAllNoteById($ids);

            return $this->json([
                "data" => self::mergeDatasAndAvis($datas,$moyenneNote),
                "allIdRestoPastille" => $arrayIdResto
            ], 200);
        }

        //// $data resto specific in $dep and $codinsee
        $datas = $bddResto->getCoordinateAndRestoIdForSpecific($dep, $codinsee, 1000);

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
        Tribu_T_Service $tribu_T_Service,
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

            if( $request->query->has("isFirstResquest")){
                //// update data result to add all resto pastille in the Tribu T
                $datas = $bddResto->appendRestoPastille($datas, $arrayIdResto);
            }

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
        MessageService $messageService,
        Filesystem $filesyst,
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

            $photo = $this->getPhotoPreviewResto("restaurant",$filesyst, $data["id"]);

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
                "avisPerso" => $avis,
            ];

            $data["photo"] = $photo;
            

            array_push($datas, $data);

            
        }

        

       
        $resultCount = $bddResto->getAccountRestauranting($codeDep);

        ///current user connected
        $user = $this->getUser();

        $statusProfile = $status->statusFondateur($user);

        ///////GET PROFIL THE USER IN SAME TRIBUT G WITH ME////////////////////////////////
        ///to contains profil user information [ [ id => ..., photo => ..., email => ..., firstname => ..., lastname => ..., image_profil => ..., last_message => ..., is_online => ... ], ... ]
        $amis_in_tributG = $messageService->getListAmisToChat($user, $tributGService, $entityManager, $userRepository);

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

    #[Route("/restaurant-mobile/specific/arrondissement/{nom_dep}/{id_dep}/{codinsee}/{limit}/{offset}", name: "app_specific_arrd_restaurant_mobile", methods:"GET")]
    public function getSpecificArrdRestaurantMobile(
        BddRestoRepository $bddResto,
        Status $status,
        Request $request,
        CodeapeRepository $codeApeRep,
        Tribu_T_Service $tribu_T_Service,
        UserRepository $userRepository,
        $nom_dep,
        $id_dep,
        $limit,
        $offset,
        $codinsee,
        AvisRestaurantRepository $avisRestaurantRepository,

    ) {
        $datas = [];
        $idData = [];
        
        $restos = $bddResto->getCoordinateAndRestoIdForSpecificMobile($id_dep , $codinsee, $limit, $offset);
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


                foreach ($tribu_t_owned as $key) {
                    $tableTribu = $key["table_name"];
                    $logo_path = $key["logo_path"];
                    $name_tribu_t_muable = $key["name_tribu_t_muable"];
                    $tableExtension = $tableTribu . "_restaurant";
                    if ($tribu_T_Service->checkExtension($tableTribu, "_restaurant") > 0) {
                        if (!$tribu_T_Service->checkIfCurrentRestaurantPastilled($tableExtension, $data["id"], true)) {
                            array_push($arrayTribu, ["table_name" => $tableTribu, "logo_path" => $logo_path, "name_tribu_t_muable" => $name_tribu_t_muable]);
                        } else {
                            array_push($arrayTribuRestoPast, ["table_name" => $tableTribu, "logo_path" => $logo_path, "name_tribu_t_muable" => $name_tribu_t_muable]);
                        }
                    }
                }

                $tribu_t_joined = $userRepository->getListTalbeTribuT_joined();
                // dd($tribu_t_joined);
                foreach ($tribu_t_joined as $key) {
                    $tbtJoined = $key["table_name"];
                    $logo_path = $key["logo_path"];
                    $name_tribu_t_muable = $key["name_tribu_t_muable"];
                    $tableExtensionTbtJoined = $tbtJoined . "_restaurant";
                    if ($tribu_T_Service->checkExtension($tbtJoined, "_restaurant") > 0) {
                        if ($tribu_T_Service->checkIfCurrentRestaurantPastilled($tableExtensionTbtJoined, $data["id"], true)) {
                            array_push($arrayTribuRestoJoinedPast, ["table_name" => $tbtJoined, "logo_path" => $logo_path, "name_tribu_t_muable" => $name_tribu_t_muable]);
                        }
                    }
                }
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
    #[Route("/restaurant-mobile/specific/{nom_dep}/{id_dep}/{limit}/{offset}", name: "app_specific_dep_restaurant_mobile", methods: ["GET"])]
    public function getSpecificRestaurantMobile(
        BddRestoRepository $bddResto,
        Status $status,
        Request $request,
        CodeapeRepository $codeApeRep,
        Tribu_T_Service $tribu_T_Service,
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


                foreach ($tribu_t_owned as $key) {
                    $tableTribu = $key["table_name"];
                    $logo_path = $key["logo_path"];
                    $name_tribu_t_muable = $key["name_tribu_t_muable"];
                    $tableExtension = $tableTribu . "_restaurant";
                    if ($tribu_T_Service->checkExtension($tableTribu, "_restaurant") > 0) {
                        if (!$tribu_T_Service->checkIfCurrentRestaurantPastilled($tableExtension, $data["id"], true)) {
                            array_push($arrayTribu, ["table_name" => $tableTribu, "logo_path" => $logo_path, "name_tribu_t_muable" => $name_tribu_t_muable]);
                        } else {
                            array_push($arrayTribuRestoPast, ["table_name" => $tableTribu, "logo_path" => $logo_path, "name_tribu_t_muable" => $name_tribu_t_muable]);
                        }
                    }
                }

                $tribu_t_joined = $userRepository->getListTalbeTribuT_joined();
                // dd($tribu_t_joined);
                foreach ($tribu_t_joined as $key) {
                    $tbtJoined = $key["table_name"];
                    $logo_path = $key["logo_path"];
                    $name_tribu_t_muable = $key["name_tribu_t_muable"];
                    $tableExtensionTbtJoined = $tbtJoined . "_restaurant";
                    if ($tribu_T_Service->checkExtension($tbtJoined, "_restaurant") > 0) {
                        if ($tribu_T_Service->checkIfCurrentRestaurantPastilled($tableExtensionTbtJoined, $data["id"], true)) {
                            array_push($arrayTribuRestoJoinedPast, ["table_name" => $tbtJoined, "logo_path" => $logo_path, "name_tribu_t_muable" => $name_tribu_t_muable]);
                        }
                    }
                }
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
        Tribu_T_Service $tribu_T_Service,
        UserRepository $userRepository,
        EntityManagerInterface $entityManager,
        AvisRestaurantRepository $avisRestaurantRepository,
        MessageService $messageService
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

        ///////GET PROFIL THE USER IN SAME TRIBUT G WITH ME////////////////////////////////
        ///to contains profil user information [ [ id => ..., photo => ..., email => ..., firstname => ..., lastname => ..., image_profil => ..., last_message => ..., is_online => ... ], ... ]
        $amis_in_tributG = $messageService->getListAmisToChat($user, $tributGService, $entityManager, $userRepository);


        $arrayTribu = [];
        $arrayTribuRestoPast = [];
        $arrayTribuRestoJoinedPast = [];

        if ($this->getUser()) {

            $tribu_t_owned = $userRepository->getListTableTribuT_owned();

            // dd($tribu_t_owned);

            foreach ($tribu_t_owned as $key) {
                $tableTribu = $key["table_name"];
                $logo_path = $key["logo_path"];
                $name_tribu_t_muable = $key["name_tribu_t_muable"];
                $tableExtension = $tableTribu . "_restaurant";
                if ($tribu_T_Service->checkExtension($tableTribu, "_restaurant") > 0) {
                    if (!$tribu_T_Service->checkIfCurrentRestaurantPastilled($tableExtension, $id_resto, true)) {
                        array_push($arrayTribu, ["table_name" => $tableTribu, "logo_path" => $logo_path, "name_tribu_t_muable" => $name_tribu_t_muable]);
                    } else {
                        array_push($arrayTribuRestoPast, ["table_name" => $tableTribu, "logo_path" => $logo_path, "name_tribu_t_muable" => $name_tribu_t_muable]);
                    }
                }
            }

            $tribu_t_joined = $userRepository->getListTalbeTribuT_joined();
            // dd($tribu_t_joined);
            foreach ($tribu_t_joined as $key) {
                $tbtJoined = $key["table_name"];
                $logo_path = $key["logo_path"];
                $name_tribu_t_muable = $key["name_tribu_t_muable"];
                $tableExtensionTbtJoined = $tbtJoined . "_restaurant";
                if ($tribu_T_Service->checkExtension($tbtJoined, "_restaurant") > 0) {
                    if ($tribu_T_Service->checkIfCurrentRestaurantPastilled($tableExtensionTbtJoined, $id_resto, true)) {
                        array_push($arrayTribuRestoJoinedPast, ["table_name" => $tbtJoined, "logo_path" => $logo_path, "name_tribu_t_muable" => $name_tribu_t_muable]);
                    }
                }
            }
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
        MessageService $messageService
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

        ///////GET PROFIL THE USER IN SAME TRIBUT G WITH ME////////////////////////////////
        ///to contains profil user information [ [ id => ..., photo => ..., email => ..., firstname => ..., lastname => ..., image_profil => ..., last_message => ..., is_online => ... ], ... ]
        $amis_in_tributG = $messageService->getListAmisToChat($user, $tributGService, $entityManager, $userRepository);
 

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
        MessageService $messageService,
        Filesystem $filesyst,
    ) {
        $dataRequest = $request->query->all();
        $nomDep = $dataRequest["nom_dep"];
        $codeDep = $dataRequest["id_dep"];
        $codinsee = $dataRequest["codinsee"];
        $arrdssm = $dataRequest["arrdssm"];


        $datas = [];

        // $restos = $bddResto->getAllRestoIdForSpecificDepartement($codeDep,$codinsee);
        // dd($codinsee);
        $restos = $bddResto->getCoordinateAndRestoIdForSpecific($codeDep,$codinsee);
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

            $photo = $this->getPhotoPreviewResto("restaurant",$filesyst, $data["id"]);
            
            $data["photo"]=$photo;

            array_push($datas, $data);

            
        }
        $resultCount = count($datas);
        $statusProfile = $status->statusFondateur($this->getUser());
        $userConnected = $status->userProfilService($this->getUser());


        ///current user connected
        $user = $this->getUser();

        ///////GET PROFIL THE USER IN SAME TRIBUT G WITH ME////////////////////////////////
        ///to contains profil user information [ [ id => ..., photo => ..., email => ..., firstname => ..., lastname => ..., image_profil => ..., last_message => ..., is_online => ... ], ... ]
        $amis_in_tributG = $messageService->getListAmisToChat($user, $tributGService, $entityManager, $userRepository);


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
     * @Route("/api/restaurant/one_data/{id_restaurant}" , name="api_one_data_resto" , methods="GET" )
     */
    public function getOneDataResto(
        $id_restaurant,
        Request $request,
        BddRestoRepository $bddResto,
        Status $status,
        AvisRestaurantRepository $avisRestaurantRepository,
    ): Response {
        $statusProfile = $status->statusFondateur($this->getUser());
        $details= $bddResto->getOneRestaurant(null, $id_restaurant)[0];

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

        return $this->json([
            "details" => $details,
        ], 200);
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
        Tribu_T_Service $tribu_T_Service,
TributGService $tributGService,
        AvisRestaurantRepository $avisRestaurantRepository,
        Filesystem $filesyst,
        BddRestoUserModifRepository $bddRestoUserModifRepository,

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


        $field = $bddRestoUserModifRepository->findOneBy(["restoId" => $id_restaurant ]);
        $isWaiting = $field && $field->getStatus() === -1 ? true : false;
        
        
        if(str_contains($request->getPathInfo(), '/api/restaurant')){
            return $this->json([
                "details" => $details,
                "id_dep" => $id_dep,
                "nom_dep" => $nom_dep,
                "isWaiting" => $isWaiting
            ], 200);
        }

        $arrayTribu = [];
        $arrayTribuRestoPast = [];
        $arrayTribuRestoJoinedPast = [];
        $arrayTribuGRestoPastille = [];
        
        if($this->getUser()){
            $user= $this->getUser();

            //// list tribu T owned
            $tribu_t_owned = $userRepository->getListTableTribuT_owned();
            
            foreach ($tribu_t_owned as $key) {
                $tableTribu = $key["table_name"];
                $logo_path = $key["logo_path"];
                $name_tribu_t_muable = $key["name_tribu_t_muable"];
                $tableExtension = $tableTribu . "_restaurant";
                if($tribu_T_Service->checkExtension($tableTribu, "_restaurant") > 0){
                    if(!$tribu_T_Service->checkIfCurrentRestaurantPastilled($tableExtension, $details["id"], true)){
                        array_push($arrayTribu, ["table_name" => $tableTribu, "logo_path" => $logo_path, "name_tribu_t_muable" =>$name_tribu_t_muable, "isPastilled" => false]);
                    }else{
                        array_push($arrayTribuRestoPast, ["table_name" => $tableTribu, "logo_path" => $logo_path, "name_tribu_t_muable" => $name_tribu_t_muable , "isPastilled" => true]);
                    }
                }
            }

/// list tribu T joined
            $tribu_t_joined = $userRepository->getListTalbeTribuT_joined();
            // dd($tribu_t_joined);
            foreach ($tribu_t_joined as $key) {
                $tbtJoined = $key["table_name"];
                $logo_path = $key["logo_path"];
                $name_tribu_t_muable = $key["name_tribu_t_muable"];
                $tableExtensionTbtJoined = $tbtJoined . "_restaurant";
                if($tribu_T_Service->checkExtension($tbtJoined, "_restaurant") > 0){
                    if($tribu_T_Service->checkIfCurrentRestaurantPastilled($tableExtensionTbtJoined, $details["id"], true)){
                        array_push($arrayTribuRestoJoinedPast, ["table_name" => $tbtJoined, "logo_path" => $logo_path, "name_tribu_t_muable" =>$name_tribu_t_muable, "isPastilled" => true]);
                    }else{
                        array_push($arrayTribuRestoJoinedPast, ["table_name" => $tbtJoined, "logo_path" => $logo_path, "name_tribu_t_muable" => $name_tribu_t_muable, "isPastilled" => false]);
                    }
                }
            }

            // tribut G pastille
            $current_profil= $statusProfile["profil"][0];
            $tributG_table_name= $current_profil->getTributG();
            $isPastilled = $tributGService->isPastilled($tributG_table_name."_restaurant", $id_restaurant);
            if( count($isPastilled) > 0 ){
                $profil_tribuG= $tributGService->getProfilTributG($tributG_table_name, $user->getId());
                array_push($arrayTribuGRestoPastille, $profil_tribuG);
            }

            // $all_table_tribuG= $tributGService->getAllTableTribuG();
            // foreach($all_table_tribuG as $table_tribuG){
            //     $tributG_table_name= $table_tribuG["table_name"];
            //     $isPastilled = $tributGService->isPastilled($tributG_table_name."_restaurant", $id_restaurant);

            //     if( count($isPastilled) > 0 ){
            //         $profil_tribuG= $tributGService->getProfilTributG($tributG_table_name, $user->getId());
            //         array_push($arrayTribuGRestoPastille, $profil_tribuG);
            //     }
            // }
        }

        $folder = $this->getParameter('kernel.project_dir') . "/public/uploads/valider/restaurant/".$id_restaurant."/";

        $tabPhoto = [];

        $dir_exist = $filesyst->exists($folder);

        // dd($folder);


        if($dir_exist){
            $images = glob($folder . '*.{jpg,JPG,jpeg,JPEG,png,PNG,gif,GIF,webp}', GLOB_BRACE);

            // dd($images);
            foreach ($images as $image) {
                $photo = explode("uploads/valider",$image)[1];
                $photo = "/public/uploads/valider".$photo;
                array_push($tabPhoto, ["photo"=>$photo]);
            }
        }

        // dd($tabPhoto);
        
        return $this->render("restaurant/detail_resto.html.twig", [
            "id_restaurant"=>$id_restaurant,
            "details" => $details,
            "isWaiting" => $isWaiting,
            "id_dep" => $id_dep,
            "nom_dep" => $nom_dep,
            "profil" => $statusProfile["profil"],
            "statusTribut" => $statusProfile["statusTribut"],
            "codeApes" => $codeApeRep->getCode(),
            "tribu_t_can_pastille" => $arrayTribu,
            "tribu_t_resto_pastille" => $arrayTribuRestoPast,
            "tribu_t_resto_joined_pastille" => $arrayTribuRestoJoinedPast,
            "tribu_g_resto_pastille" => $arrayTribuGRestoPastille,
            "photos" => $tabPhoto,
        ]);
    }



    /*
    *use this API to know what tribu T had pastilled an rastaurant or not
    *DON'T CHANGE THIS ROUTE: It's use in js file.
    */
    #[Route("/restaurant/pastilled/checking/{idRestaurant}", name:"app_resto_pastilled_checked",methods:["GET"])]
    public function checkedIfRestaurantIsPastilled(
        $idRestaurant,
        Status $status,
        UserRepository $userRepository,
        Tribu_T_Service $tribu_T_Service,
        TributGService $tributGService,
        SerializerInterface $serializerInterface
    ){
        $arrayTribu = [];
        $arrayTribuGRestoPastille = [];
        if($this->getUser()){

            $tribu_t_owned = $userRepository->getListTableTribuT_owned();
            
            foreach ($tribu_t_owned as $key) {
                $tableTribu = $key["table_name"];
                $logo_path = $key["logo_path"];
                $name_tribu_t_muable =  array_key_exists("name_tribu_t_muable", $key) ? $key["name_tribu_t_muable"]:null;
                $tableExtension = $tableTribu . "_restaurant";
                if($tribu_T_Service->checkExtension($tableTribu, "_restaurant") > 0){
                    if(!$tribu_T_Service->checkIfCurrentRestaurantPastilled($tableExtension, $idRestaurant, true)){
                        array_push($arrayTribu, ["table_name" => $tableTribu, "name_tribu_t_muable" => $name_tribu_t_muable, "logo_path" => $logo_path,"isPastilled"=>false]);
                    }else{
                        array_push($arrayTribu, ["table_name" => $tableTribu, "name_tribu_t_muable" => $name_tribu_t_muable, "logo_path" => $logo_path, "isPastilled"=>true]);
                    }
                }
            }
        
            $statusProfile = $status->statusFondateur($this->getUser());

            // tribut G pastille
            $current_profil= $statusProfile["profil"][0];
            $tributG_table_name= $current_profil->getTributG();

            $profil_tribuG= $tributGService->getProfilTributG($tributG_table_name, $this->getUser()->getId());
            $isPastilled = $tributGService->isPastilled($tributG_table_name."_restaurant", $idRestaurant);

            array_push($arrayTribuGRestoPastille, [
                "table_name" => $profil_tribuG["table_name"], 
                "name_tribu_t_muable" => $profil_tribuG["name"], 
                "logo_path" => $profil_tribuG["avatar"], 
                "isPastilled"=> count($isPastilled) > 0 ? true: false
            ]);
        }

        // dd($arrayTribu);
        return $this->json([
            "listResto" => $arrayTribu,
            "tribuGProfil" => $arrayTribuGRestoPastille
        ]);
        // $datas = $serializerInterface->serialize($arrayTribu, 'json');
        // return new JsonResponse($datas, 200, [], true);
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
        $idRestaurant,
        Filesystem $filesyst
    ) {

        $user = $this->getUser();
        $resto = $resto->find($idRestaurant);
        $avisResto = new AvisRestaurant();

        $requestJson = json_decode($request->getContent(), true);
        $avis = $requestJson["avis"];
        $note = $requestJson["note"];
        $type = $requestJson["type"];

        if($type == "audio" || $type == "image" || $type == "video"){

            $path_file = '/public/uploads/avis-restaurant/'.$type .'/';

            $destination = $this->getParameter('kernel.project_dir') . '/public/uploads/avis-restaurant/'.$type .'/';


            $temp = explode(";", $avis);

            $extension = explode("/", $temp[0])[1];

            $newFilename = time() . '-' . uniqid() . "." . $extension;

            ///save image in public/uploader folder

            $dir_exist = $filesyst->exists($destination);
            
            if ($dir_exist == false) {
                
                $filesyst->mkdir($destination, 0777);
            }

            file_put_contents($destination . $newFilename, file_get_contents($avis));


            $avis = $path_file . $newFilename;
        }
        
        //dd($user,$resto);
        $avisResto->setAvis(json_encode($avis))
            ->setnote($note)
            ->setUser($user)
            ->setDatetime(new \DateTimeImmutable())
            ->setRestaurant($resto)
            ->setType($type);

        $avisRestoRep->add($avisResto, true);
        
        $state= $avisRestoRep->getState($idRestaurant);

        return $this->json([
            "state" => $state
        ]);
    }

    #[Route("/avis/restaurant/{idRestaurant}", name: "get_avis_restaurant", methods: ["GET"])]
    public function getAvisRestaurant(
        AvisRestaurantRepository $avisRestaurantRepository,
        $idRestaurant,
        SerializerInterface $serializer
    ) {
        $userId = $this->getUser()->getId();
        $response = $avisRestaurantRepository->getNote($idRestaurant, $userId);
        //dd($response);
        $response = $serializer->serialize($response, 'json');
        return new JsonResponse($response, 200, [], true);
    }

    #[Route("/avis/restaurant/global/{idRestaurant}", name: "get_avis_global_restaurant", methods: ["GET"])]
    public function getAvisGlobalRestaurant(
        AvisRestaurantRepository $avisRestaurantRepository,
        $idRestaurant,
        SerializerInterface $serializer
    ) {
        $user= $this->getUser();
        if( !$user ){
            return $this->json([ "message" => "User no connected."]);
        }
        $currentUser= [
            "id" => $user->getId(),
            "email" => $user->getEmail(),
            "pseudo" => $user->getPseudo()
        ];

        $response = $avisRestaurantRepository->getNoteGlobale($idRestaurant);


        return $this->json([ "data" => $response, "currentUser" => $currentUser ]);
    }


    #[Route("/change/restaurant/{idRestaurant}", name: "change_avis_restaurant", methods: ["POST"])]
    public function changeAvisRestaurant(
        AvisRestaurantRepository $avisRestaurantRepository,
        $idRestaurant,
        SerializerInterface $serializer,
        Request $request,
        Filesystem $filesyst
    ) {

        $rJson = json_decode($request->getContent(), true);
        $userId = $this->getUser()->getId();

        $avis = $rJson["avis"];
        $type = $rJson["type"];

        if($type == "audio" || $type == "image" || $type == "video"){

            $path_file = '/public/uploads/avis-restaurant/'.$type .'/';

            $destination = $this->getParameter('kernel.project_dir') . '/public/uploads/avis-restaurant/'.$type .'/';


            $temp = explode(";", $avis);

            $extension = explode("/", $temp[0])[1];

            $newFilename = time() . '-' . uniqid() . "." . $extension;

            ///save image in public/uploader folder

            $dir_exist = $filesyst->exists($destination);
            
            if ($dir_exist == false) {
                
                $filesyst->mkdir($destination, 0777);
            }

            file_put_contents($destination . $newFilename, file_get_contents($avis));


            $avis = $path_file . $newFilename;

        }

        if($rJson["type"] == "audio_up"){
            $type = "audio";
        }
        
        if($rJson["type"] == "image_up"){
            $type = "image";
        }
        if($rJson["type"] == "video_up"){
            $type = "video";
        }

        $response = $avisRestaurantRepository->updateAvis(
            $idRestaurant,
            $userId,
            $rJson["avisID"],
            $rJson["note"],
            $avis,
            $type,
        );
        $response = $serializer->serialize($response, 'json');
        
        $state= $avisRestaurantRepository->getState($idRestaurant);

        return $this->json([
            "state" => $state,
            "data" => $response
        ]);

        // return new JsonResponse($response, 200, [], true);
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
    public function makeModif(
        Request $request,
        BddRestoUserModifRepository $bddRepo,
        UserRepository $userRepo,
        UserService $userService,
        MailService $mailServ,
        BddRestoRepository $bddResto,
        Status $status
    ){
        // try{
        $contents=json_decode($request->getContent(),true);

        $field = $bddRepo->findOneBy(["restoId" => intval($contents["restoId"]) ]);

        $isWaiting = $field && $field->getStatus() === -1 ? true : false;

        if( $isWaiting){
             $response = new Response();
            $response->setStatusCode(205);
            return $response;
        }

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
            // ->setRestaurant(intval(($contents["restaurant"])))
            ->setRestaurant(1)
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
            ->setRestoId(intval(($contents["restoId"])))
            ->setStatus(-1);

            $success=$bddRepo->save($bddRestoUserModif,true);

            if($success){

                $resto=$bddResto->getOneItemByID((intval($contents["restoId"])));

                $user=$this->getUser();
                $profil=$status->userProfilService($user);
                $emailsCorp="L'établissement ".
                            $resto["denominationF"].
                            " a été modifié par ". 
                            $profil["firstname"]." ".$profil["lastname"]." Veuillez le vérifier s'il vous plaît.";

                $validators=$userRepo->getAllValidator();
                foreach($validators  as $validator){
                    $emails=$validator->getEmail();
                    //TODO send email
                    $mailServ->sendEmail($emails,"", "établissement modifié", $emailsCorp);
                }

                // $profil=$status->userProfilService($user);
                
                // $emailsCorp="L'étabillsement ". $resto["denominationF"].  " a été modifié par ". 
                                //         $profil["firstname"]." ".$profil["lastname"]." Veuillez le vérifier s'il vous plaît.";

                // $validators=$userRepo->getAllValidator();

                // foreach($validators  as $validator){
                //         $emails=$validator->getEmail();
                //         //TODO send email
                //         $mailServ->sendEmail($emails,"", "établissement modifié", $emailsCorp);
                // }

                ////sendEmailResponseModifPOI
                $all_user_receiver= [];
                $validators=$userRepo->getAllValidator();
                foreach ($validators as $validator){
                        if( $validator->getType() != "Type"){
                    $temp=[
                        "email" => $validator->getEmail(),
                        "fullName" => $userService->getFullName($validator->getId())
                    ];
                    array_push($all_user_receiver,$temp);
                }
            }
            $adress_resto= $resto["numvoie"] . " " . $resto["typevoie"] . " " . $resto["nomvoie"] . " " . $resto["codpost"] . " " . $resto["villenorm"];
            $context= [
                "object_mail" => "Modification d'un établissement",
                "template_path" => "emails/mail_for_new_modification_poi.html.twig",
                "resto" => [
                    "name" => $resto["denominationF"],
                    "adress" => $adress_resto
                ],
                "user_modify" => [
                    "fullname" => $userService->getFullName($user->getId()),
                    "email" => $user->getEmail()
                ],
                "user_super_admin" => [
                    "fullname" => "",
                    "email" => ""
                ],
                "user_validator" => [
                    "fullname" => "",
                    "email" => ""
                ]
            ];

            $mailServ->sendEmailResponseModifPOI(
                $user->getEmail(),
                $userService->getFullName($user->getId()),
                $all_user_receiver,
                $context
            );
            }
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


    #[Route("/restaurant/add/photos/{id_resto}", name: "app_add_photos_resto")]
    public function addPhotoRestoToGallery( $id_resto, Request $request,
        Filesystem $filesyst, UserService $userService
    ) {

        $date = new \DateTimeImmutable();

        $timestamp = (int)$date->format('Uu');

        if (!$this->getUser()) {

            return $this->json([

                "error" => "Invalid credentials",

            ], 401);

        }else{

            $user_id = $this->getUser()->getId();

            $requestContent = json_decode($request->getContent(), true);
    
            if ($requestContent["image"]) {
    
                $image = $requestContent["image"];
    
                ///download image
    
                $path = $this->getParameter('kernel.project_dir') . '/public/uploads/avalider/restaurant/'.$id_resto;
    
                $path_name = '/uploads/avalider/restaurant/'.$id_resto .'/';
    
                $dir_exist = $filesyst->exists($path);
    
                if ($dir_exist == false) {
        
                    $filesyst->mkdir($path, 0777);
                }
    
                $temp = explode(";", $image);
    
                $extension = explode("/", $temp[0])[1];
    
                $image_name = "resto_" . $id_resto ."_". $timestamp . "." . $extension;
    
                ///save image in public/uploader folder
    
                file_put_contents($path . "/".$image_name, file_get_contents($image));
    
    
                ///insert into database
    
                $photo_path = $path_name .$image_name;
    
                $userService->insertPhotoResto($id_resto, $user_id, $photo_path);
    
            }
    
            return $this->json([
    
                "result" => "success"
    
            ], 201);
        }
        
    }

    #[Route("/restaurant/validate/photos/{id_resto}/{id_gallery}", name: "app_validate_photos_resto")]
    public function validatePhotoRestoGallery($id_resto, $id_gallery, Request $request,
        Filesystem $filesyst, UserService $userService
    ){

        $old_path = $this->getParameter('kernel.project_dir') . '/public/uploads/avalider/restaurant/'.$id_resto;
        
        $new_path = $this->getParameter('kernel.project_dir') . '/public/uploads/valider/restaurant/'.$id_resto;

        $dir_exist = $filesyst->exists($new_path);

        if ($dir_exist == false) {

            $filesyst->mkdir($new_path, 0777);
        }

        $requestContent = json_decode($request->getContent(), true);

        $image_name = $requestContent["image_name"];

        ///save image in public/uploader folder

        $current = file_get_contents($old_path."/".$image_name);

        file_put_contents($new_path . "/".$image_name, $current);

        //delete old path
        unlink($old_path."/".$image_name);

        $userService->updateSatatusPhotoResto($id_gallery, 1);

        return $this->json([

            "result" => "success"

        ], 201);
    }

    #[Route("/restaurant/reject/photos/{id_resto}/{id_gallery}", name: "app_reject_photos_resto")]
    public function rejectPhotoRestoGallery($id_resto, $id_gallery, Request $request,
        Filesystem $filesyst, UserService $userService
    ){

        $old_path = $this->getParameter('kernel.project_dir') . '/public/uploads/avalider/restaurant/'.$id_resto;

        $requestContent = json_decode($request->getContent(), true);

        $image_name = $requestContent["image_name"];

        $current = file_get_contents($old_path."/".$image_name);

        //delete old path
        unlink($old_path."/".$image_name);

        $userService->updateSatatusPhotoResto($id_gallery, 2);

        return $this->json([

            "result" => "success"

        ], 201);
    }

    #[Route("/restaurant/delete/photos/{id_resto}/{id_gallery}", name: "app_delete_photos_resto")]
    public function deletePhotoRestoGallery($id_resto, $id_gallery, Request $request,
        Filesystem $filesyst, UserService $userService
    ){

        $old_path = $this->getParameter('kernel.project_dir') . '/public/uploads/valider/restaurant/'.$id_resto;

        $requestContent = json_decode($request->getContent(), true);

        $image_name = $requestContent["image_name"];

        $current = file_get_contents($old_path."/".$image_name);

        //delete old path
        unlink($old_path."/".$image_name);

        $userService->deletePhotoResto($id_gallery);

        return $this->json([

            "result" => "success"

        ], 201);
    }

    #[Route("/restaurant/not-valid", name: "app_not_valid_resto")]
    public function getRestoNotValidate(Filesystem $filesyst, UserService $userServ):Response
    {

        $not_valid = $userServ->getAllPhotoNotValidResto();

        $not_valid = mb_convert_encoding($not_valid, 'UTF-8', 'UTF-8');

        return $this->json($not_valid);
    }

    /**
     * @author Elie
     * Get image preview gallery
     */
    public function getPhotoPreviewResto($type, $filesyst, $id_restaurant){
         

        $folder = $this->getParameter('kernel.project_dir') . "/public/uploads/valider/".$type."/".$id_restaurant."/";

        $tabPhoto = [];

        $dir_exist = $filesyst->exists($folder);

        // dd($folder);


        if($dir_exist){
            $images = glob($folder . '*.{jpg,JPG,jpeg,JPEG,png,PNG,gif,GIF,webp}', GLOB_BRACE);

            // dd($images);
            foreach ($images as $image) {
                $photo = explode("uploads/valider",$image)[1];
                $photo = "/public/uploads/valider".$photo;
                array_push($tabPhoto, $photo);
            }
        }
        if(count($tabPhoto) > 0){
           return $tabPhoto[count($tabPhoto)-1];
        }else{
           return null;
        }

       //  $last_photo = $tabPhoto[count($tabPhoto)-1];
   }

    #[Route("/test", name:"test")]
    public function t(UserRepository $u){
        
        return $this->json($u->getAllValidator());
    }

    #[Route("/get/link/thefork/{resto_name}/{depart}", name: "thefork")]
    public function thefork(
        // HttpClientInterface $client,
        $resto_name,
        $depart
        )
    {
        $browser = new HttpBrowser(HttpClient::create());
        $response = $browser->request(
            "GET",
            "https://www.google.com/search?q=the+fork+". str_replace('_', '+', $resto_name)."+".$depart,
            [
                'headers' => [
                    'Accept' => 'application/text',
                ],
            ]
        );
        // $content = $response->getContent();
        $link = $response->getBaseHref();
        return new Response($content); 
    }
}
