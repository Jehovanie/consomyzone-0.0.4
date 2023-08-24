<?php

namespace App\Controller;

use App\Service\Status;
use App\Service\TributGService;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
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

        return $this->render('tabac/index.html.twig', [
            "profil" => $statusProfile["profil"],
            "amisTributG" => $amis_in_tributG,
            "userConnected" => $userConnected,
        ]);
    }
}
