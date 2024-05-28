<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

use Doctrine\ORM\EntityManagerInterface;

use App\Service\MessageService;
use App\Service\MailService;
use App\Service\TributGService;
use App\Service\PDOConnexionService;
use App\Service\Status;
use App\Service\StringTraitementService;

use App\Entity\MarcheUserModification;

use App\Repository\UserRepository;
use App\Repository\MarcheBackupRepository;
use App\Repository\MarcheUserModificationRepository;
use App\Repository\MarcheRepository;
use App\Repository\DepartementRepository;


use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class MarcheController extends AbstractController
{
    #[Route('/marche', name: 'app_marche')]
    public function getAllDepartementMarche(
        Status $status,
        EntityManagerInterface $entityManager,
        TributGService $tributGService,
        UserRepository $userRepository,
        MessageService $messageService,

        DepartementRepository $departementRepository,
        MarcheRepository $marcheRepository,
    ): Response
    {
        $statusProfile = $status->statusFondateur($this->getUser());

        ///current user connected
        $user = $this->getUser();

        //dd($user);
        $userConnected = $status->userProfilService($this->getUser());

        ///////GET PROFIL THE USER IN SAME TRIBUT G WITH ME////////////////////////////////
        ///to contains profil user information [ [ id => ..., photo => ..., email => ..., firstname => ..., lastname => ..., image_profil => ..., last_message => ..., is_online => ... ], ... ]
        $amis_in_tributG = $messageService->getListAmisToChat($user, $tributGService, $entityManager, $userRepository);
        

        $count_marche= $marcheRepository->getAccountMarche();

        return $this->render('marche/index.html.twig',[
            "departements" => $departementRepository->getDep(),
            "count_marche" => $count_marche,

            "profil" => $statusProfile["profil"],
            "statusTribut" => $statusProfile["statusTribut"],
            "amisTributG" => $amis_in_tributG, 
            "userConnected" => $userConnected,
        ]);
    }

    #[Route("/marche/specific", name: "app_specific_marche", methods: ["GET"])]
    public function getSpecifiqueMarche(
        Request $request,
        MarcheRepository $marcheRepository,
        PDOConnexionService $pdoConnexionService,

        Status $status,
        EntityManagerInterface $entityManager,
        TributGService $tributGService,
        UserRepository $userRepository,
        MessageService $messageService,
    ) {
        $id_dep= $request->query->get('id_dep');
        $id_dep= intval($id_dep);

        $nom_dep= $request->query->get('nom_dep');

        $count_marche= $marcheRepository->getAccountMarche($id_dep);

        $results= $marcheRepository->getAllRestoIdForSpecificDepartement($id_dep);
        
        $marches= [];
        foreach ($results as $result){
            $temp = $result["specificite"];

            $temp = json_decode('"'.$temp.'"', true);
            if (json_last_error() === JSON_ERROR_NONE) {
                $temp= $pdoConnexionService->convertUnicodeToUtf8($temp);
                $temp=mb_convert_encoding($temp, 'UTF-8', 'UTF-8');
            }else{
                $temp = $result["specificite"];
            }

            $result["depName"] = $nom_dep;
            $result["specificite"]=$temp;
            array_push($marches, $result);  
        }

        $statusProfile = $status->statusFondateur($this->getUser());
        
        ///current user connected
        $user = $this->getUser();

        //dd($user);
        $userConnected = $status->userProfilService($this->getUser());

        ///////GET PROFIL THE USER IN SAME TRIBUT G WITH ME////////////////////////////////
        ///to contains profil user information [ [ id => ..., photo => ..., email => ..., firstname => ..., lastname => ..., image_profil => ..., last_message => ..., is_online => ... ], ... ]
        $amis_in_tributG = $messageService->getListAmisToChat($user, $tributGService, $entityManager, $userRepository);
        

        return $this->render("marche/specific_departement.html.twig", [
            "id_dep" => $id_dep,
            "nom_dep" => $nom_dep,
            "type" => "marche",
            "count_marche" => $count_marche,
            "marches" => $marches,

            "profil" => $statusProfile["profil"],
            "statusTribut" => $statusProfile["statusTribut"],
            "amisTributG" => $amis_in_tributG, 
            "userConnected" => $userConnected,
        ]);
    }


    #[Route("/marche/{id_dep}/details/{id_marche}", name: "app_get_details_marche", methods: ["GET"])]
    public function getDetailMarche(
        $id_dep,
        $id_marche,
        MarcheRepository $marcheRepository,
        PDOConnexionService $pdoConnexionService
    ) {

        $marche_details= $marcheRepository->getOneItemByID($id_marche);

        $temp = $marche_details["specificite"];

        $temp = json_decode('"'.$temp.'"', true);
        if (json_last_error() === JSON_ERROR_NONE) {
            $temp= $pdoConnexionService->convertUnicodeToUtf8($temp);
            $temp=mb_convert_encoding($temp, 'UTF-8', 'UTF-8');
        }else{
            $temp = $marche_details["specificite"];
        }

        $marche_details["specificite"]= $temp;

        return $this->render("marche/detail_marche.html.twig", [
            "id_marche" => $id_marche,
            "id_dep" => $id_dep,
            "details" => [
                ...$marche_details
            ]
        ]);
    }

    #[Route("/details/marche/{id_marche}", name:"get_details_marche", methods: ["GET"] )]
    public function getDetailsRubriqueMarche(
        $id_marche,
        MarcheRepository $marcheRepository,
        PDOConnexionService $pdoConnexionService
    ) {

        $marche_details= $marcheRepository->getOneItemByID($id_marche);

        $temp = $marche_details["specificite"];

        $temp = json_decode('"'.$temp.'"', true);
        if (json_last_error() === JSON_ERROR_NONE) {
            $temp= $pdoConnexionService->convertUnicodeToUtf8($temp);
            $temp=mb_convert_encoding($temp, 'UTF-8', 'UTF-8');
        }else{
            $temp = $marche_details["specificite"];
        }

        $marche_details["specificite"]= $temp;

        return $this->render("marche/detail_marche.html.twig", [
            "id_marche" => $id_marche,
            "id_dep" => $marche_details["dep"],
            "details" => [
                ...$marche_details
            ]
        ]);
    }


    #[Route("/fetch_data/marche", name: "fetch_data_marche" , methods: [ "GET", "POST" ])]
    #[Route("/api/marche", name: "app_api_marche", methods: ["GET"])]
    public function apiGetMarche(
        MarcheRepository $marcheRepository,
        MarcheUserModificationRepository $marcheUserModificationRepository,
        UserRepository $userRepository,
        Request $request,
    ){
        $current_uri= $request->getUri();
        $pathname= parse_url($current_uri, PHP_URL_PATH);

        ///validation -----------
        $options_validations= [
            "validation" => [
                "admin_cmz" => [],
                "validator_cmz" => [],
                "partisant_cmz" => [],
                "source_info" => [],
            ]
        ];
        /// ---------------------
        
        if($request->query->has("minx") && $request->query->has("miny") ){

            $minx = $request->query->get("minx");
            $maxx = $request->query->get("maxx");
            $miny = $request->query->get("miny");
            $maxy = $request->query->get("maxy");

            $datas = $marcheRepository->getDataBetweenAnd($minx, $miny, $maxx, $maxy);

            /// get all id from the datas
            if( $this->getUser()){
                $datasId = array_map('self::getAttributeId', $datas);

                $states_marche= $marcheUserModificationRepository->getStatesDataMarche($datasId);

                foreach($datas as $items){
                    if( in_array($items["id"], array_column($states_marche, "rubriqueId"))){
                        ///find 
                        $key= array_search($items["id"], array_column($states_marche, "rubriqueId"));
                        $temp_data= $states_marche[$key];
                        
                        //// check the user validator, [user_validator, user_admin,]
                        if( $temp_data["validatorId"] === null ){
                            array_push($options_validations["validation"]["partisant_cmz"], $temp_data);
                        }else if( $temp_data["validatorId"] !== null){
                            $user_validator= $userRepository->findOneBy(["id" => intval($temp_data["validatorId"])]);

                            if( in_array('ROLE_GODMODE', $user_validator->getRoles())){
                                array_push($options_validations["validation"]["admin_cmz"], $temp_data);

                            }else if( in_array('ROLE_VALIDATOR', $user_validator->getRoles())){
                                array_push($options_validations["validation"]["validator_cmz"], $temp_data);
                            }
                        }
                    }else{
                        array_push($options_validations["validation"]["source_info"], [
                            "id" => -1,
                            "action" => "source_info",
                            "userId" => null,
                            "email" => null,
                            "rubriqueId" => $items["id"],
                            "validatortId" => null
                        ]);
                    }
                }
            }

            //// end state data validation------------

            return $this->json([
                "data" => $datas,
                "options" => $options_validations
            ], 200);
        }

        if($request->getMethod() === "POST"){
            $data= json_decode($request->getContent(), true);
            extract($data); 
            /// $dep, $note_min, $note_max, $data_max,

            $data_max = $data_max ? intval($data_max) : 50;

            $filter_options= [
                "dep" => $dep,
                "note" => [
                    "min" => $note_min,
                    "max" => $note_max
                ],
            ];

            $datas = $marcheRepository->getDataByFilterOptions($filter_options, $data_max);

            /// get all id from the datas
            if( $this->getUser()){
                $datasId = array_map('self::getAttributeId', $datas);

                $states_marche= $marcheUserModificationRepository->getStatesDataMarche($datasId);

                foreach($datas as $items){
                    if( in_array($items["id"], array_column($states_marche, "marcheId"))){
                        ///find 
                        $key= array_search($items["id"], array_column($states_marche, "marcheId"));
                        $temp_data= $states_marche[$key];
                        
                        //// check the user validator, [user_validator, user_admin,]
                        if( $temp_data["validatorId"] === null ){
                            array_push($options_validations["validation"]["partisant_cmz"], $temp_data);
                        }else if( $temp_data["validatorId"] !== null){
                            $user_validator= $userRepository->findOneBy(["id" => intval($temp_data["validatorId"])]);

                            if( in_array('ROLE_GODMODE', $user_validator->getRoles())){
                                array_push($options_validations["validation"]["admin_cmz"], $temp_data);

                            }else if( in_array('ROLE_VALIDATOR', $user_validator->getRoles())){
                            if( strtolower($temp_data["action"]) === "modifier" ){
                                    array_push($options_validations["validation"]["partisant_cmz"], $temp_data);
                            }else{
                            }
                            }
                        }
                    }else{
                        array_push($options_validations["validation"]["source_info"], [
                            "id" => -1,
                            "action" => "source_info",
                            "userId" => null,
                            "email" => null,
                            "rubriqueId" => $items["id"],
                            "validatortId" => null
                        ]);
                    }
                }
            }

            //// end state data validation------------

            $count = $marcheRepository->getDataByFilterOptionsCount($filter_options);

            return $this->json([
                "data" => $datas,
                "pastille" => [],
                "options" => $options_validations,
                "count" => $count
            ], 200);
        }

        //// data marche all departement
        $datas= $marcheRepository->getSomeDataShuffle(null, 2000);

        return $this->json([
            "data" => $datas
        ], 200);
    }

    #[Route("/api/marche_specifique/{id_dep}", name: "app_api_marche_specifique_dep", methods: ["GET"])]
    public function apiGetMarcheSpecifique(
        $id_dep,
        MarcheRepository $marcheRepository,
        Request $request,
    ){
        $id_dep= intval($id_dep);
        
        if($request->query->has("minx") && $request->query->has("miny") ){

            $minx = $request->query->get("minx");
            $maxx = $request->query->get("maxx");
            $miny = $request->query->get("miny");
            $maxy = $request->query->get("maxy");

            $datas = $marcheRepository->getDataBetweenAnd($minx, $miny, $maxx, $maxy, $id_dep);

            return $this->json([
                "data" => $datas
            ], 200);
        }

        //// data marche all departement
        $datas= $marcheRepository->getSomeDataShuffle($id_dep, 2000);

        return $this->json([
            "data" => $datas
        ], 200);
    }

    static function getAttributeId($data){
        return $data["id"];
    } 


    #[Route("/marche/add_new_element", name: "app_add_new_element", methods: ["POST"])]
    public function apiAddNewMarche(
        Request $request,
        MarcheUserModificationRepository $marcheUserModifyRepository,
        EntityManagerInterface $entityManagerInterface,
        MailService $mailService,
        UserRepository $userRepository
    ) {
        $data = json_decode($request->getContent(), true);

        $current_user = $this->getUser();

        $new_marche_add = new MarcheUserModification();

        $datetime = new \DateTime();
        $datetime = $datetime->format('Y-m-d H:i:s');

        $new_marche_add->setDenominationF($data["denomination_f"])
            ->setClenum("")
            ->setAdresse($data["address"])
            ->setCodpost($data["code_postal"])
            ->setVillenorm("")
            ->setSpecificite($data["specificite"])
            ->setJourDeMarche1($data["jour_de_marche_1"])
            ->setPoiX($data["latitude"])
            ->setPoiY($data["longitude"])
            ->setCommune($data["commune"])
            ->setCodinsee("")
            ->setPoiQualitegeorue("")
            ->setDcomiris("")
            ->setDep($data["departement"])
            ->setDateData("")
            ->setDateInser($datetime)
            ->setUserId($current_user)
            ->setAction("Ajouter")
            ->setStatus(0)
            ->setIsDeleted(0)
            ->setTraiter(0)
            ->setDateValidation(new \DateTime("now"))
        ;

        if (array_key_exists("jour_de_marche_2", $data)) {
            $new_marche_add->setJourDeMarche2($data["jour_de_marche_2"]);
        }

        if (array_key_exists("jour_de_marche_3", $data)) {
            $new_marche_add->setJourDeMarche3($data["jour_de_marche_3"]);
        }

        if (array_key_exists("jour_de_marche_4", $data)) {
            $new_marche_add->setJourDeMarche4($data["jour_de_marche_4"]);
        }

        if (array_key_exists("jour_de_marche_5", $data)) {
            $new_marche_add->setJourDeMarche5($data["jour_de_marche_5"]);
        }

        if (array_key_exists("jour_de_marche_6", $data)) {
            $new_marche_add->setJourDeMarche6($data["jour_de_marche_6"]);
        }

        if (array_key_exists("jour_de_marche_7", $data)) {
            $new_marche_add->setJourDeMarche7($data["jour_de_marche_7"]);
        }

        $entityManagerInterface->persist($new_marche_add);
        $entityManagerInterface->flush();


        ////SEND NOTIFICATION FOR ALL

        /// for user created
        $context = [
            "object_mail" => "Un nouveau Marché ajouté",
            "template_path" => "emails/marche_notification_user_creator.html.twig",
            "etablisment" => [
                "name" => $new_marche_add->getDenominationF(),
                "adress" => $new_marche_add->getAdresse()
            ],
            "user_modify" => [
                "fullname" => $current_user->getPseudo(),
                "email" => $current_user->getEmail()
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

        $mailService->sendEmailResponseModifPOIUpdate(
            $current_user->getEmail(),
            "ConsoMyZone",
            [
                ["email" => $current_user->getEmail(), "fullName" => $current_user->getPseudo()]
            ],
            $context
        );

        /// for super admin + validators
        $all_user_receiver = [];

        $user_super_admin = $userRepository->getUserSuperAdmin();
        array_push(
            $all_user_receiver,
            ["email" => $user_super_admin->getEmail(), "fullName" => $user_super_admin->getPseudo()]
        );

        $validators = $userRepository->getAllValidator();
        foreach ($validators as $validator) {
            if ($validator->getId() != $current_user->getId() && $validator->getId() != $user_super_admin->getId() &&  $validator->getType() != "Type") {
                $temp = [
                    "email" => $validator->getEmail(),
                    "fullName" => $validator->getPseudo()
                ];
                array_push($all_user_receiver, $temp);
            }
        }

        $context["template_path"] = "emails/marche_notification_to_validated.html.twig";
        $mailService->sendEmailResponseModifPOIUpdate(
            $current_user->getEmail(),
            "ConsoMyZone",
            $all_user_receiver,
            $context
        );

        return $this->json([
            'data' => $marcheUserModifyRepository->getOneItemByID($new_marche_add->getId()),
            'id' => $new_marche_add->getId()
        ]);
    }

    #[Route("/marche/add_edit_element/{idMarche}", name: "app_add_edit_element", methods: ["POST"])]
    public function appEditMarche(
        $idMarche,
        Request $request,
        MarcheUserModificationRepository $marcheUserModifyRepository,
        MarcheRepository $marcheRepo,
        EntityManagerInterface $entityManagerInterface,
        MailService $mailService,
        UserRepository $userRepository
    ) {
        $data = json_decode($request->getContent(), true);
        $marche = $marcheRepo->findOneBy(["id" => $idMarche]);
        $current_user = $this->getUser();

        $new_marche_add = new MarcheUserModification();

        $datetime = new \DateTime();
        $datetime = $datetime->format('Y-m-d H:i:s');

        $new_marche_add->setDenominationF($data["denomination_f"])
            ->setClenum("")
            ->setAdresse($data["address"])
            ->setCodpost($data["code_postal"])
            ->setVillenorm("")
            ->setSpecificite($data["specificite"])
            ->setJourDeMarche1($data["jour_de_marche_1"])
            ->setPoiX($data["latitude"])
            ->setPoiY($data["longitude"])
            ->setCommune($data["commune"])
            ->setCodinsee("")
            ->setPoiQualitegeorue("")
            ->setDcomiris("")
            ->setDep($data["departement"])
            ->setDateData("")
            ->setDateInser($datetime)
            ->setUserId($current_user)
            ->setMarche($marche)
            ->setStatus(0)
            ->setAction("Modifier")
            ->setIsDeleted(0)
            ->setTraiter(0)
            ->setDateValidation(new \DateTime("now"));

        if (array_key_exists("jour_de_marche_2", $data)) {
            $new_marche_add->setJourDeMarche2($data["jour_de_marche_2"]);
        }
        if (array_key_exists("jour_de_marche_3", $data)) {
            $new_marche_add->setJourDeMarche3($data["jour_de_marche_3"]);
        }
        if (array_key_exists("jour_de_marche_4", $data)) {
            $new_marche_add->setJourDeMarche4($data["jour_de_marche_4"]);
        }
        if (array_key_exists("jour_de_marche_5", $data)) {
            $new_marche_add->setJourDeMarche5($data["jour_de_marche_5"]);
        }
        if (array_key_exists("jour_de_marche_6", $data)) {
            $new_marche_add->setJourDeMarche6($data["jour_de_marche_6"]);
        }
        if (array_key_exists("jour_de_marche_7", $data)) {
            $new_marche_add->setJourDeMarche7($data["jour_de_marche_7"]);
        }

        $entityManagerInterface->persist($new_marche_add);
        $entityManagerInterface->flush();


        ////SEND NOTIFICATION FOR ALL

        /// for user created
        $context = [
            "object_mail" => "Modification d'un Marché",
            "template_path" => "emails/marche_notification_user_edit.html.twig",
            "etablisment" => [
                "name" => $new_marche_add->getDenominationF(),
                "adress" => $new_marche_add->getAdresse()
            ],
            "user_modify" => [
                "fullname" => $current_user->getPseudo(),
                "email" => $current_user->getEmail()
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

        $mailService->sendEmailResponseModifPOIUpdate(
            $current_user->getEmail(),
            "ConsoMyZone",
            [
                ["email" => $current_user->getEmail(), "fullName" => $current_user->getPseudo()]
            ],
            $context
        );
        /// for super admin + validators
        $all_user_receiver = [];

        $user_super_admin = $userRepository->getUserSuperAdmin();
        array_push(
            $all_user_receiver,
            ["email" => $user_super_admin->getEmail(), "fullName" => $user_super_admin->getPseudo()]
        );

        $validators = $userRepository->getAllValidator();
        foreach ($validators as $validator) {
            if ($validator->getId() != $current_user->getId() && $validator->getId() != $user_super_admin->getId() &&  $validator->getType() != "Type") {
                $temp = [
                    "email" => $validator->getEmail(),
                    "fullName" => $validator->getPseudo()
                ];
                array_push($all_user_receiver, $temp);
            }
        }

        $context["template_path"] = "emails/marche_notification_to_edit_validated.html.twig";
        $mailService->sendEmailResponseModifPOIUpdate(
            $current_user->getEmail(),
            "ConsoMyZone",
            $all_user_receiver,
            $context
        );

        return $this->json([
            'data' => $marcheUserModifyRepository->getOneItemByID($new_marche_add->getId()),
            'id' => $new_marche_add->getId()
        ]);
    }

    #[Route("api/marche/delete_marche_user_modified", name: "app_delete_marche_user_modified", methods: ["POST"])]
    public function deleteMarcheUserModified(
        Request $request,
        MarcheUserModificationRepository $marcheUserModifyRepository,
        EntityManagerInterface $entityManagerInterface
    ) {
        if (!$this->getUser()) {
            return $this->json([], 401);
        }
        $current_user = $this->getUser();

        $data = json_decode($request->getContent(), true);
        $idMarcher = $data["idMarcher"];

        $marche_add = $marcheUserModifyRepository->findOneBy(["id" => $idMarcher, "userId" => $current_user->getId()]);
        if ($marche_add) {
            $marche_add->setIsDeleted(true);

            $entityManagerInterface->persist($marche_add);
            $entityManagerInterface->flush();
        }

        return $this->json([
            "data" => $idMarcher
        ]);
    }

    #[Route("api/marche/delete_marche", name: "app_delete_marche", methods: ["POST"])]
    public function deleteMarcheRequest(
        Request $request,
        MarcheRepository $marcheRepository,
        EntityManagerInterface $entityManagerInterface,
        MailService $mailService,
        UserRepository $userRepository
    ) {
        if (!$this->getUser()) {
            return $this->json([], 401);
        }
        $current_user = $this->getUser();

        $data = json_decode($request->getContent(), true);
        $idMarcher = $data["idMarcher"];

        $marche_del = $marcheRepository->findOneBy(["id" => $idMarcher]);

        if (!$marche_del) return  $this->json(["error" => "Marche not found", "idMarche" => $data["idMarcher"]]);

        $new_marche_add = new MarcheUserModification();

        $new_marche_add->setDenominationF($marche_del->getDenominationF())
            ->setClenum($marche_del->getClenum())
            ->setAdresse($marche_del->getAdresse())
            ->setCodpost($marche_del->getCodpost())
            ->setVillenorm($marche_del->getVillenorm())
            ->setSpecificite($marche_del->getSpecificite())
            ->setJourDeMarche1($marche_del->getJourDeMarche1())
            ->setJourDeMarche2($marche_del->getJourDeMarche2())
            ->setJourDeMarche3($marche_del->getJourDeMarche3())
            ->setJourDeMarche4($marche_del->getJourDeMarche4())
            ->setJourDeMarche5($marche_del->getJourDeMarche5())
            ->setJourDeMarche6($marche_del->getJourDeMarche6())
            ->setJourDeMarche7($marche_del->getJourDeMarche7())
            ->setPoiX($marche_del->getPoiX())
            ->setPoiY($marche_del->getPoiY())
            ->setCommune($marche_del->getCommune())
            ->setCodinsee($marche_del->getCodinsee())
            ->setPoiQualitegeorue($marche_del->getPoiQualitegeorue())
            ->setDcomiris($marche_del->getDcomiris())
            ->setDep($marche_del->getDep())
            ->setDateData($marche_del->getDateData())
            ->setDateInser($marche_del->getDateInser())
            ->setUserId($current_user->getId())
            ->setMarcheId($marche_del->getId())
            ->setAction("Supprimer")
            ->setStatus(0)
            ->setIsDeleted(0);

        $entityManagerInterface->persist($new_marche_add);
        $entityManagerInterface->flush();


        ////SEND NOTIFICATION FOR ALL

        /// for user created
        $context = [
            "object_mail" => "Suppression d'un Marché",
            "template_path" => "emails/marche_notification_user_delete.html.twig",
            "etablisment" => [
                "name" => $new_marche_add->getDenominationF(),
                "adress" => $new_marche_add->getAdresse()
            ],
            "user_modify" => [
                "fullname" => $current_user->getPseudo(),
                "email" => $current_user->getEmail()
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

        $mailService->sendEmailResponseModifPOIUpdate(
            $current_user->getEmail(),
            "ConsoMyZone",
            [
                ["email" => $current_user->getEmail(), "fullName" => $current_user->getPseudo()]
            ],
            $context
        );
        /// for super admin + validators
        $all_user_receiver = [];

        $user_super_admin = $userRepository->getUserSuperAdmin();
        array_push(
            $all_user_receiver,
            ["email" => $user_super_admin->getEmail(), "fullName" => $user_super_admin->getPseudo()]
        );

        $validators = $userRepository->getAllValidator();
        foreach ($validators as $validator) {
            if ($validator->getId() != $current_user->getId() && $validator->getId() != $user_super_admin->getId() &&  $validator->getType() != "Type") {
                $temp = [
                    "email" => $validator->getEmail(),
                    "fullName" => $validator->getPseudo()
                ];
                array_push($all_user_receiver, $temp);
            }
        }

        $context["template_path"] = "emails/marche_notification_to_delete_validated.html.twig";
        $mailService->sendEmailResponseModifPOIUpdate(
            $current_user->getEmail(),
            "ConsoMyZone",
            $all_user_receiver,
            $context
        );

        return $this->json([
            "data" => $new_marche_add,
            'id' => $marche_del->getId()
        ]);
    }

    #[Route("/api/marche/json_details/{id_marche}", name: "app_get_json_details_marche", methods: ["GET"])]
    public function getJsonDetailMarche(
        $id_marche,
        MarcheRepository $marcheRepository,
        MarcheUserModificationRepository $marcheUserModifyRepository,
        Request $request
    ) {
        if ($request->query->has("realData")) {
            $marche_details = $marcheRepository->getOneItemByID($id_marche);
        } else {
            $marche_details = $marcheUserModifyRepository->getOneItemByID($id_marche);
        }

        return $this->json([
            "data" => $marche_details
        ]);
    }
}
