<?php

namespace App\Controller;

use App\Repository\UserRepository;
use App\Service\TributGService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class FondateurGController extends AbstractController{
    public function __construct()
    {
        parent::__construct();
        
    }

    #[Route("/get_browser/partisantG/banishement", name:"app_partisant_banished")]
    public function indexAction(TributGService $t, 
    EntityManagerInterface $entityManager,
    Request $request,
    UserRepository $u)
    {
        $req = json_decode($request->getContent(), true);
        $user = $u->find($req["id"]);
        $userId = $user->getId();
        $userType = $user->getType();
        if ($userType == "consumer") {
            $profil = $entityManager->getRepository(Consumer::class)->findByUserId($userId);
        } else {
            $profil = $entityManager->getRepository(Supplier::class)->findByUserId($userId);
        }
        $tableTribuGName = $profil[0]->getTributG();
    }

    
    
}

