<?php

namespace App\Controller;

use App\Service\Status;
use App\Entity\GolfFinished;
use App\Service\TributGService;
use App\Repository\UserRepository;
use App\Service\GolfFranceService;
use App\Repository\GolfFranceRepository;
use Doctrine\ORM\EntityManagerInterface;
use App\Repository\DepartementRepository;
use App\Repository\GolfFinishedRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class GolfFranceController extends AbstractController
{
    #[Route('/golf', name: 'app_golf_france')]
    public function index(
        Status $status, 
        DepartementRepository $departementRepository,
        TributGService $tributGService,
        UserRepository $userRepository,
        EntityManagerInterface $entityManager,
        GolfFranceRepository $golfFranceRepository
    ): Response
    {
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

        return $this->render('golf/index.html.twig', [
            'number_of_departement' => $golfFranceRepository->getCount(),
            "profil" => $statusProfile["profil"],
            "departements" => $departementRepository->getDep(),
            "amisTributG" => $amis_in_tributG,
            "userConnected" => $userConnected,
        ]);
    }

    #[Route('/api/golf', name: 'api_golf_france', methods: ["GET", "POST"])]
    public function allGolfFrance(
        GolfFranceRepository $golfFranceRepository,
    ){

        $golfs= [];
        $userID = ($this->getUser()) ? $this->getUser()->getId() : null;

        $golfs= $golfFranceRepository->getSomeDataShuffle($userID);

        return $this->json([
            "success" => true,
            "data" => $golfs,
        ], 200);
    }


    #[Route('/golf/departement/{nom_dep}/{id_dep}', name: 'golf_dep_france', methods: ["GET", "POST"])]
    public function specifiqueDepartement(
        $nom_dep,
        $id_dep,
        GolfFranceRepository $golfFranceRepository,
        Status $status, 
        TributGService $tributGService,
        UserRepository $userRepository,
        EntityManagerInterface $entityManager,
    ){

        ///current user connected
        $user = $this->getUser();
        $userConnected = $status->userProfilService($this->getUser());
        $userID = ($user) ? $user->getId() : null;
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

        return $this->render("golf/specific_departement.html.twig", [

            "id_dep" => $id_dep,

            "nom_dep" => $nom_dep,

            "type" => "golf",

            "golf" => $golfFranceRepository->getGolfByDep($nom_dep, $id_dep, $userID),

            "nomber_golf" => $golfFranceRepository->getCount($nom_dep, $id_dep),

            "profil" => $statusProfile["profil"],

            "statusTribut" => $statusProfile["statusTribut"],

            "amisTributG" => $amis_in_tributG,

            "userConnected" => $userConnected,
        ]);
    }

    

    #[Route('/api/golf/departement/{nom_dep}/{id_dep}', name: 'api_golf_dep_france', methods: ["GET", "POST"])]
    public function api_specifiqueDepartement(
        $nom_dep,
        $id_dep,
        GolfFranceRepository $golfFranceRepository,
        Status $status, 
        TributGService $tributGService,
        UserRepository $userRepository,
        EntityManagerInterface $entityManager,
    ){
        $golfs= [];
        $userID = ($this->getUser()) ? $this->getUser()->getId() : null;

        $golfs= $golfFranceRepository->getGolfByDep($nom_dep, $id_dep, $userID);

        return $this->json([
            "success" => true,
            "data" => $golfs,
            "message" => "Ok"
        ], 200);
    }

    #[Route('/golf/departement/{nom_dep}/{id_dep}/{golfID}', name: 'single_golf_france', methods: ["GET"])]
    public function oneGolf(
        $nom_dep, $id_dep, $golfID,
        GolfFranceRepository $golfFranceRepository,
        Status $status, 
    ){
        ///current user connected
        $user = $this->getUser();
        $userID = ($user) ? intval($user->getId()) : null;
        // dd($golfFranceRepository->getOneGolf(intval($golfID)));

        return $this->render("golf/details_golf.html.twig", [
            "id_dep" => $id_dep,
            "nom_dep" => $nom_dep,
            "details" => $golfFranceRepository->getOneGolf(intval($golfID),$userID),
        ]);
    }

    #[Route('user/setGolf/finished', name: 'set_golf_finished', methods: ["POST"])]
    public function setGolfFinished(
        Request $request,
        EntityManagerInterface $entityManager
    ){
        $requestContent = json_decode($request->getContent(), true);
        extract($requestContent); ///$golfID

        
        ///current user connected
        $user = $this->getUser();
        if( !$user ){
            return $this->json([ "success" => false, "message" => "user is not connected" ], 403);
        }

        $userID= $user->getId();

        $golfFinished= new GolfFinished();
        $golfFinished->setGolfId($golfID);
        $golfFinished->setUserId($userID);


        $entityManager->persist($golfFinished);
        $entityManager->flush();

        return $this->json([
            "success" => true,
            "message" => "Golf finished successfully"
        ], 201);
    }

    #[Route('user/setGolf/unfinished', name: 'set_golf_unfinished', methods: ["POST"])]
    public function setGolfUnFinished(
        Request $request,
        GolfFinishedRepository $golfFinishedRepository,
        EntityManagerInterface $entityManager
    ){
        $requestContent = json_decode($request->getContent(), true);
        extract($requestContent); ///$golfID

        $isFinished= $golfFinishedRepository->findOneBy(['golf_id' => intval($golfID)]); 
        if( !$isFinished){
            return $this->json([ "success" => false, "message" => "This golf is not yet finished"], 200);
        }

        $entityManager->remove($isFinished);
        $entityManager->flush();

        return $this->json([
            "success" => true,
            "message" => "Setting golf unfinished successfully"
        ], 201);
    }
}
