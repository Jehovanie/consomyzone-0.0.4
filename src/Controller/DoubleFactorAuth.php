<?php

namespace App\Controller;

use App\Entity\User;
use App\Service\TwoFactorInterf;
use Doctrine\ORM\EntityManagerInterface;
use Scheb\TwoFactorBundle\Model\Email\TwoFactorInterface;
use Scheb\TwoFactorBundle\Security\TwoFactor\Provider\Email\Generator\CodeGenerator;
use Scheb\TwoFactorBundle\Security\TwoFactor\Provider\Email\Generator\CodeGeneratorInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
class DoubleFactorAuth extends AbstractController{

    private $codeGenerator;
    private $entityManager;
   
    public function __construct(
        CodeGeneratorInterface $codeGenerator,
        EntityManagerInterface $entityManager){
        $this->codeGenerator= $codeGenerator;
        $this->entityManager = $entityManager;
       
    }

    #[Route("/fa/resend/code", name:"2fa.resend.code")]
    public function resendCode(){
        $user=new TwoFactorInterf($this->getUser());
        $this->codeGenerator->reSend($user);

        return $this->json(['response' => "ok"],200);
    }

    #[Route("/user/isuse/2fact", name:"isuse.2fact")]
    public function isuse2Fact(){
       
        $user=$this->getUser();
        $response=boolval(intval($user->getUse2fa(),10));
        return $this->json(['response' =>$response],200);
    }

    #[Route("/user/set/isuse2fact", name:"set.isuse2fact")]
    public function setIsUse2Fact(Request $request){
        $value=json_decode(($request->getContent()),true);
        $user=$this->getUser();
        $user->setUse2fa($value["v"]);
        $this->entityManager->flush();
        return $this->json(['response' =>boolval(intval($value["v"],10) )],200);
      
        
    }

    #[Route("/user/set/2fa/useMail", name:"set.2fact")]
    public function set2FactUseEmail(Request $request){
        $value=json_decode(($request->getContent()),true);
        $user=$this->getUser();
        $user->setUse2FaEmail($value["v"]);
        $this->entityManager->flush();
        return $this->json(['response' =>boolval( intval($value["v"],10))],200);
    }

    #[Route("/user/isuse/famail", name:"use.2fact.email")]
    public function isUse2FactEmail(){
        $user=$this->getUser();
        $reponse= intval($user->getUse2FaEmail(),10);
        return $this->json(['response' =>boolval($reponse)],200);
    }
}