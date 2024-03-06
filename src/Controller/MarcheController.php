<?php

namespace App\Controller;

use App\Service\Status;
use App\Service\MessageService;
use App\Service\TributGService;
use App\Service\MailService;
use App\Entity\MarcheUserModify;
use App\Repository\UserRepository;

use App\Repository\MarcheRepository;
use App\Service\PDOConnexionService;
use Doctrine\ORM\EntityManagerInterface;
use App\Repository\DepartementRepository;
use Symfony\Component\HttpFoundation\Request;
use App\Repository\MarcheUserModifyRepository;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
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
        MarcheUserModifyRepository $marcheUserModifyRepository,
        PDOConnexionService $pdoConnexionService,
        Request $request
    ) {
        if( $request->query->has("userCreate")){
            $marche_details= $marcheUserModifyRepository->getOneItemByID($id_marche);
        }else{
            $marche_details= $marcheRepository->getOneItemByID($id_marche);
        }

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


    #[Route("/marche/add_new_element", name: "app_add_new_element", methods: ["POST"])]
    public function apiAddNewMarche(
        Request $request,
        MarcheUserModifyRepository $marcheUserModifyRepository,
        EntityManagerInterface $entityManagerInterface,
        MailService $mailService,
        UserRepository $userRepository
    ){
        $data= json_decode($request->getContent(), true );

        $current_user= $this->getUser();

        $new_marche_add= new MarcheUserModify();

        $new_marche_add->setDenominationF($data["denomination_f"])
                       ->setClenum($data["cles_num"])
                       ->setAdresse($data["address"])
                       ->setCodpost($data["code_postal"])
                       ->setVillenorm($data["ville_norm"])
                       ->setSpecificite($data["specificite"])
                       ->setJourDeMarche1($data["jour_de_marche_1"])
                       ->setPoiX($data["latitude"])
                       ->setPoiY($data["longitude"])
                       ->setCommune($data["commune"])
                       ->setCodinsee($data["codeinsee"])
                       ->setPoiQualitegeorue("")
                       ->setDcomiris("")
                       ->setDep($data["departement"])
                       ->setDateData("")
                       ->setDateInser("")
                       ->setUserId($current_user->getId())
                       ->setStatus(0)
        ;

        if( array_key_exists("jour_de_marche_2", $data)){
            $new_marche_add->setJourDeMarche2($data["jour_de_marche_2"]);
        }
        if( array_key_exists("jour_de_marche_3", $data)){
            $new_marche_add->setJourDeMarche3($data["jour_de_marche_3"]);
        }
        if( array_key_exists("jour_de_marche_4", $data)){
            $new_marche_add->setJourDeMarche4($data["jour_de_marche_4"]);
        }
        if( array_key_exists("jour_de_marche_5", $data)){
            $new_marche_add->setJourDeMarche5($data["jour_de_marche_5"]);
        }
        if( array_key_exists("jour_de_marche_6", $data)){
            $new_marche_add->setJourDeMarche6($data["jour_de_marche_6"]);
        }
        if( array_key_exists("jour_de_marche_7", $data)){
            $new_marche_add->setJourDeMarche7($data["jour_de_marche_7"]);
        }

        $entityManagerInterface->persist($new_marche_add);
        $entityManagerInterface->flush();


        ////SEND NOTIFICATION FOR ALL

        /// for user created
        $context= [
            "object_mail" => "Une nouvelle établissement de Marche",
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
                [ "email" => $current_user->getEmail(), "fullName" => $current_user->getPseudo() ]
            ],
            $context
        );
        /// for super admin + validators
        $all_user_receiver= [];

        $user_super_admin= $userRepository->getUserSuperAdmin();
        array_push($all_user_receiver,
            [ "email" => $user_super_admin->getEmail(), "fullName" => $user_super_admin->getPseudo() ]
        );

        $validators=$userRepository->getAllValidator();
        foreach ($validators as $validator){
            if($validator->getId() != $current_user->getId() && $validator->getId() != $user_super_admin->getId() &&  $validator->getType() != "Type"){
                $temp=[
                    "email" => $validator->getEmail(),
                    "fullName" => $validator->getPseudo()
                ];
                array_push($all_user_receiver,$temp);
            }
        }

        $context["template_path"]= "emails/marche_notification_to_validated.html.twig";
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
}
