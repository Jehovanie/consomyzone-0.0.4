<?php

namespace App\Controller;

use App\Service\Status;
use Doctrine\ORM\EntityManagerInterface;
use App\Service\MessageService;
use App\Service\TributGService;
use App\Repository\UserRepository;

use App\Repository\MarcheRepository;
use App\Service\PDOConnexionService;
use App\Repository\DepartementRepository;
use Symfony\Component\HttpFoundation\Request;
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
        Request $request
    ){

        return $this->json([
            'result' => 'pong'
        ]);
    }
}
