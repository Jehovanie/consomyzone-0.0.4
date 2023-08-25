<?php

namespace App\Controller;

use App\Service\Status;
use App\Service\TributGService;
use App\Repository\UserRepository;
use App\Repository\TabacRepository;
use Doctrine\ORM\EntityManagerInterface;
use App\Repository\DepartementRepository;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class TabacContoller extends AbstractController
{
    #[Route('/tabac', name: 'app_bureau_tabac')]
    public function index(
        Status $status, 
        TributGService $tributGService,
        UserRepository $userRepository,
        EntityManagerInterface $entityManager,
        TabacRepository $tabacRepository,
        DepartementRepository $departementRepository,
    ): Response
    {
        // $data= $tabacRepository->findAll();
        // dd($data);

        ///current user connected
        $user = $this->getUser();
        $userConnected = $status->userProfilService($this->getUser());

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

        return $this->render('tabac/index.html.twig', [
            "profil" => $statusProfile["profil"],
            "amisTributG" => $amis_in_tributG,
            "userConnected" => $userConnected,
            'number_of_departement' => $tabacRepository->getCount(),
            "departements" => $departementRepository->getDep(),
        ]);
    }


    #[Route('/api/tabac', name: 'api_tabac_france', methods: ["GET", "POST"])]
    public function allGolfFrance(
        TabacRepository $tabacRepository,
    ){

        $tabac= [];
        $userID = ($this->getUser()) ? $this->getUser()->getId() : null;

        $tabac= $tabacRepository->getSomeDataShuffle();

        return $this->json([
            "success" => true,
            "data" => $tabac,
        ], 200);
    }

    #[Route('/tabac/departement/{nom_dep}/{id_dep}', name: 'app_tabac_dep', methods: ["GET", "POST"])]
    public function specifiqueDepartement(
        $nom_dep,
        $id_dep,
        TabacRepository $tabacRepository,
        Status $status, 
        TributGService $tributGService,
        UserRepository $userRepository,
        EntityManagerInterface $entityManager,
    ){

        ///current user connected
        $user = $this->getUser();
        $userConnected = $status->userProfilService($this->getUser());

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

        return $this->render("tabac/specific_departement.html.twig", [

            "id_dep" => $id_dep,

            "nom_dep" => $nom_dep,

            "type" => "tabac",

            "tabac" => $tabacRepository->getGolfByDep($nom_dep, $id_dep),

            "nomber_tabac" => $tabacRepository->getCount($nom_dep, $id_dep),

            "profil" => $statusProfile["profil"],

            "statusTribut" => $statusProfile["statusTribut"],

            "amisTributG" => $amis_in_tributG,

            "userConnected" => $userConnected,
        ]);
    }

    #[Route('/api/tabac/departement/{nom_dep}/{id_dep}', name: 'api_tabac_dep', methods: ["GET", "POST"])]
    public function api_specifiqueDepartement(
        $nom_dep, $id_dep,
        TabacRepository $tabacRepository,
        TributGService $tributGService,
    ){
        $golfs= [];
        $golfs= $tabacRepository->getGolfByDep($nom_dep, $id_dep);

        return $this->json([
            "success" => true,
            "data" => $golfs,
            "message" => "Ok"
        ], 200);
    }


    #[Route('/tabac/departement/{nom_dep}/{id_dep}/{tabacID}', name: 'app_single_tabac', methods: ["GET"])]
    public function oneTabac(
        $nom_dep, $id_dep, $tabacID,
        TabacRepository $tabacRepository,
        Status $status, 
    ){
        ///current user connected
        $user = $this->getUser();
        // dd($golfFranceRepository->getOneGolf(intval($golfID)));

        return $this->render("tabac/details_tabac.html.twig", [
            "id_dep" => $id_dep,
            "nom_dep" => $nom_dep,
            "details" => $tabacRepository->getOneTabac(intval($tabacID)),
        ]);
    }
}
