<?php

namespace App\Controller;

use App\Repository\DepartementRepository;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class MarcheController extends AbstractController
{
    #[Route('/marche', name: 'app_marche')]
    public function getAllDepartementMarche(
        DepartementRepository $departementRepository,
    ): Response
    {
        return $this->render('marche/index.html.twig',[
            "departements" => $departementRepository->getDep(),
        ]);
    }
}
