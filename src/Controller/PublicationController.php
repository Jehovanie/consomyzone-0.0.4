<?php

namespace App\Controller;

use App\Entity\ReactionG;
use App\Entity\PublicationG;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class PublicationController extends AbstractController
{
    /**
     * @Route("/user/publication/new" , name="app_publication", methods={"POST", "GET"})
     */
    public function index(): Response
    {
        return $this->render('publication/publication.html.twig');
    }

    /**
     * @Route("user/update_publication" , name="update_publication", methods={"POST","GET"})
     */
    public function updatePublication(EntityManagerInterface $entityManager, Request $request)
    {

        $user = $this->getUser();
        //dd("ici");
        $requestContent = json_decode($request->getContent(), true);

        $pub_id=$requestContent["pub_id"];

        $confid=$requestContent["confidentiality"];

        $new_message=$requestContent["message"];

        $publication = $entityManager->getRepository(PublicationG::class)->findOneById($pub_id);

        $publication ->setLegend($new_message);
        
        $publication ->setConfidentiality($confid);

        $entityManager->flush();

    }

    /**
     * @Route("user/new_reaction" , name="new_reaction", methods={"POST", "GET"})
     */
    public function saveReaction(EntityManagerInterface $entityManager, Request $request)
    {

        $user = $this->getUser();
        $requestContent = json_decode($request->getContent(), true);
        $new_reaction = new ReactionG();

        $pub_id=$requestContent["pub_id"];
        $user_id= $user->getId();
        $new_react=$requestContent["is_like"];
        //$pub_id =1;

        $publication = $entityManager->getRepository(PublicationG::class)->findOneById($pub_id);

        $dernier_reaction = $entityManager->getRepository(ReactionG::class)->findOneByPubAndUser($pub_id, $user_id);

        if($dernier_reaction != null){
            $dernier_reaction->setUser($user);
            $dernier_reaction->setPublication($publication);
            $dernier_reaction->setIsLike($new_react);

            $entityManager->persist($dernier_reaction);
            $entityManager->flush();
        }else{
            $new_reaction->setUser($user);
            $new_reaction->setPublication($publication);
            $new_reaction->setIsLike(true);

            $entityManager->persist($new_reaction);
            $entityManager->flush();

        }

        return $this->render('tribut/monTribut.html.twig', [

        ]);

    }

}
