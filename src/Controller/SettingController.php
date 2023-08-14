<?php

namespace App\Controller;

use App\Entity\User;
use App\Service\Status;
use App\Entity\Consumer;
use App\Entity\Supplier;
use App\Service\MailService;
use App\Entity\Confidentiality;
use App\Service\TributGService;
use App\Service\Tribu_T_Service;
use App\Form\ConfidentialityType;
use App\Form\SettingProfilConsumerType;
use App\Form\SettingProfilSupplierType;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\RepeatedType;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use SymfonyCasts\Bundle\VerifyEmail\VerifyEmailHelperInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class SettingController extends AbstractController
{
    private $entityManager;
    private $isSuccess = false;
    private $mailService;
    private $verifyEmailHelper;

    function __construct(MailService $mailService, VerifyEmailHelperInterface $verifyEmailHelper_service, EntityManagerInterface $entityManager)
    {
        $this->mailService = $mailService;
        $this->verifyEmailHelper = $verifyEmailHelper_service;
        $this->entityManager = $entityManager;
    }

    #[Route('/user/setting/account', name: 'account_setting')]
    public function index(Request $request, Status $status, TributGService $tbg_serv): Response
    {
        $userConnected= $status->userProfilService($this->getUser());

        $user = $this->getUser();
        $userId = $user->getId();
        $userType = $user->getType();
        $profil = null;
        $flushMessage = null;
        $form = null;

        $tribugexists = $tbg_serv->getAllTribuGExists();

        //dd($tribugexists);

        if ($userType == "consumer") {
            $profil = $this->entityManager->getRepository(Consumer::class)->findByUserId($userId);
            $form = $this->createForm(SettingProfilConsumerType::class, $profil[0]);
            $form->handleRequest($request);

            if ($form->isSubmitted() && $form->isValid()) {
                $fname = $form->get('firstname')->getData();
                //dd($new_password);
                $lname = $form->get('lastname')->getData();

                $numRue = $form->get('numRue')->getData();

                $telephone = $form->get('telephone')->getData();

                // $ville = $form->get('ville')->getData();

                $codePostal = $form->get('codePostal')->getData();

                $pays = $form->get('pays')->getData();

                $telFixe = $form->get('telFixe')->getData();

                $quartier = $form->get('quartier')->getData();

                $profil[0]->setFirstname($fname);

                $profil[0]->setLastname($lname);

                $profil[0]->setNumRue($numRue);

                $profil[0]->setTelephone($telephone);

                // $profil[0]->setVille($ville);

                $profil[0]->setCodePostal($codePostal);

                $profil[0]->setPays($pays);

                $profil[0]->setTelFixe($telFixe);

                $profil[0]->setQuartier($quartier);

                // $tribug_name = str_replace(" ","_", $quartier);

                // $is_exist = false;

                // foreach ($tribugexists as $tribu) {

                //     if(str_contains($tribu['tributg'], $tribug_name)){

                //         $is_exist = true;

                //     }else{

                //         $is_exist = false;

                //     }
                // }

                // $tribug_table_name = "tribug_".str_pad($userId,2,'0',STR_PAD_LEFT)."_".$tribug_name;

                // $profil[0]->setTributG($tribug_table_name);

                // if($is_exist == false){

                //     $tbg_serv->createTableTributG($tribug_table_name, $userId);
                // }

                $this->entityManager->flush();

                $flushMessage = "Votre profil a été bien à jour !";
            }
        } elseif ($userType == "supplier") {
            $profil = $this->entityManager->getRepository(Supplier::class)->findByUserId($userId);
            $form = $this->createForm(SettingProfilSupplierType::class, $profil[0]);

            $form->handleRequest($request);

            if ($form->isSubmitted() && $form->isValid()) {
                $fname = $form->get('firstname')->getData();
                //dd($new_password);
                $lname = $form->get('lastname')->getData();

                $numRue = $form->get('numRue')->getData();

                $telephone = $form->get('telephone')->getData();

                // $ville = $form->get('ville')->getData();

                $codePostal = $form->get('codePostal')->getData();

                $pays = $form->get('pays')->getData();

                $telFixe = $form->get('telFixe')->getData();

                $commerce = $form->get('commerce')->getData();

                $codeape = $form->get('codeape')->getData();

                $website = $form->get('website')->getData();

                $facebook = $form->get('facebook')->getData();

                $twitter = $form->get('twitter')->getData();

                $quartier = $form->get('quartier')->getData();

                $profil[0]->setFirstname($fname);

                $profil[0]->setLastname($lname);

                $profil[0]->setNumRue($numRue);

                $profil[0]->setTelephone($telephone);

                // $profil[0]->setVille($ville);

                $profil[0]->setCodePostal($codePostal);

                $profil[0]->setPays($pays);

                $profil[0]->setTelFixe($telFixe);

                $profil[0]->setCommerce($commerce);

                $profil[0]->getCodeape($codeape);

                $profil[0]->setWebsite($website);

                $profil[0]->setFacebook($facebook);

                $profil[0]->setTwitter($twitter);

                $profil[0]->setQuartier($quartier);

                $this->entityManager->flush();

                $flushMessage = "Votre profil a été bien à jour !";
            }
        }
        $statusProfile = $status->statusFondateur($this->getUser());


        /** Update password and email */

        $form_password = $this->createFormBuilder()
            ->setAction($this->generateUrl('security_setting'))
            ->setMethod('POST')
            ->add('old_password', PasswordType::class)
            ->add('new_password', PasswordType::class)
            ->add('retap_new_password', PasswordType::class)
            ->getForm();

        $form_email = $this->createFormBuilder()
            ->setAction($this->generateUrl('security_setting'))
            ->setMethod('POST')
            ->add('old_email', EmailType::class)
            ->add('new_email', EmailType::class)
            ->add('confirm_email', EmailType::class)
            ->add('password', PasswordType::class)
            ->getForm();
        
        return $this->render('setting/index.html.twig', [
            "userConnected" => $userConnected,
            'profil' => $profil,
            "statusTribut" => $statusProfile["statusTribut"],
            'form' => $form->createView(),
            "message" => $flushMessage,
            "form_password" =>  $form_password->createView(),
            "form_email" =>$form_email->createView()
        ]);
    }

    #[Route('/user/setting/confidentiality', name: 'confidential_setting')]
    public function showConfidentiality(Request $request, EntityManagerInterface $em): Response
    {
        $user = $this->getUser();

        $flushMessage = null;

        $isSuccess = false;

        $id = $user->getId();

        $tribut_service = new Tribu_T_Service();

        $tribut_service->generateConfidentiality("confidentiality", $id);

        $post  = $this->entityManager->getRepository(Confidentiality::class)->findByUserId($id);
        
        $form = $this->createForm(ConfidentialityType::class, $post[0]);

        $form->handleRequest($request);

        
        if ($form->isSubmitted() && $form->isValid()) {
            
            $data = $form->getData();
            //dd($form["email"]->getData());
            
            $post[0]->setNotifIsActive($form['notifIsActive']->getData());
            $post[0]->setProfil($form['profil']->getData());
            $post[0]->setEmail($form['email']->getData());
            $post[0]->setAmie($form['amie']->getData());
            $post[0]->setInvitation($form['invitation']->getData());
            $post[0]->setPublication($form['publication']->getData());
            
            $em->persist($post[0]);
            $em->flush();

            $flushMessage = "Confidentialité a été bien mis à jour!";
            $isSuccess = true;
        }

        $userType = $user->getType();
        $profil = "";
        if($userType == "consumer") {
            $profil = $this->entityManager->getRepository(Consumer::class)->findByUserId($id);
        }else{
            $profil = $this->entityManager->getRepository(Supplier::class)->findByUserId($id);
        }

        return $this->render('setting/confidentiality.html.twig', [
            "form"=> $form->createView(),
            "message" => $flushMessage,
            "isSuccess" => $isSuccess,
            "profil"=>$profil,
            'statusTribut' => ["status" => "", "verified" => ""]

        ]);
    } 

    #[Route('/user/setting/security', name: 'security_setting')]
    public function updatePassword(Request $request, UserPasswordHasherInterface $passwordEncoder, MailService $mailService): Response
    {
        $user = $this->getUser();

        $flushMessage = null;

        $isSuccess = false;

        $data = $request->request->all()["form"];

        extract($data);
        //dd($data);

        $is_pwd = 0;

        if ($request->isMethod("POST")) {

            /** Mise à jour mot de passe */

            if ($request->request->get('reset') == "resetPassword") {

                $is_pwd = 1;

                if ($passwordEncoder->isPasswordValid($user, $old_password)) {

                    if ($new_password == $retap_new_password) {

                        $password = $passwordEncoder->hashPassword($user, $new_password);

                        $user->setPassword($password);

                        $this->entityManager->flush();

                        $flushMessage = "Votre mot de passe a bien été à jour !";

                        $isSuccess = true;
                    } else {
                        $flushMessage = "Le nouveau mot de passe et la confirmation doit être identique";
                        $isSuccess = false;
                    }
                } else {
                    $flushMessage = "Le mot de passe actuel n'est pas le bon !";
                    $isSuccess = false;
                }
            } else {

                /** Mise à jour email */

                $is_pwd = 0;

                if ($passwordEncoder->isPasswordValid($user, $password) && $new_email== $confirm_email) {

                    $user->setEmailTemp($new_email);

                    //$user->setVerifiedMail(false);

                    $this->entityManager->flush();

                    $flushMessage = "Veuillez vérifier le lien de modification dans " . $new_email;

                    $isSuccess = true;

                    $signatureComponents = $this->verifyEmailHelper->generateSignature(
                        "validate_email", /// lien de revenir
                        $user->getId(), /// id for user
                        $new_email, /// email destionation use for verifier
                        ['id' => $user->getId()] /// param id
                    );

                    $mailService->sendLinkOnEmailAboutAuthenticator(
                        $new_email, /// mail destination
                        trim($user->getPseudo()), /// name destination
                        [
                            "object" => "Validation e-mail sur ConsoMyZone", //// object of the email
                            "link" => $signatureComponents->getSignedUrl(), /// link
                            "template" => "emails/mail_validate_update_email.html.twig"
                        ]
                    );

                } else {
                    $flushMessage = "Le mot de passe actuel n'est pas le bon !";
                    $isSuccess = false;
                }
            }
        }

        $userType = $user->getType();
        $userId = $user->getId();
        $profil = "";
        if($userType == "consumer") {
            $profil = $this->entityManager->getRepository(Consumer::class)->findByUserId($userId);
        }else{
            $profil = $this->entityManager->getRepository(Supplier::class)->findByUserId($userId);
        }

        //dd($profil);

        return $this->redirectToRoute("account_setting", [
            "message" => $flushMessage,
            "isSuccess" => $isSuccess,
            "profil"=>$profil,
            'statusTribut' => ["status" => "", "verified" => ""],
            "is_pwd" => $is_pwd
        ]);

        // return $this->render('setting/password.html.twig', [
        //     "message" => $flushMessage,
        //     "isSuccess" => $isSuccess,
        //     "profil"=>$profil,
        //     'statusTribut' => ["status" => "", "verified" => ""],
        // ]);
    }

    #[Route('/security-validate-email', name: 'validate_email')]
    public function validateEmail(): Response
    {

        if (isset($_GET['id'])) {
            //$user = $this->getUser();

            $user_tmp = $this->entityManager->getRepository(User::class)->findById($_GET['id']);

            //dd($user_tmp[0]->getEmailTemp());

            $email = $user_tmp[0]->getEmailTemp();

            //dd($this->session->get('email'));

            if ($email != null || $email != "") {

                $user_tmp[0]->setEmail($email);

                $this->entityManager->flush();
            }

            $message = "";

            if ($user_tmp[0]->getEmail() == $email) {
                $this->isSuccess = true;
                $message = "Votre adresse email a été bien à jour. Veuillez vous reconnecter !";
                $user_tmp[0]->setEmailTemp("");
                $this->entityManager->flush();
            } else {
                $this->isSuccess = false;
                $message = "Session expiré !";
            }

            //return $this->render('setting/password.html.twig', ["message" => $message, "isSuccess" => $this->isSuccess]);
            return $this->redirectToRoute('app_login', ["message" => $message, "isSuccess" => $this->isSuccess, "email" => $user_tmp[0]->getEmail()]);
        }
    }

    #[Route('/user/traduction', name: 'app_traduction')]
    public function traduction(EntityManagerInterface $entityManager, TributGService $tributGService){
        $user= $this->getUser();

        $userType = $user->getType();

        $userId = $user->getId();

        $profil = "";







        if($userType == "consumer") {

            $profil = $entityManager->getRepository(Consumer::class)->findByUserId($userId);

        }else{

            $profil = $entityManager->getRepository(Supplier::class)->findByUserId($userId);

        }
        return $this->render('setting/traduction.html.twig', [
            "profil" => $profil,
            "statusTribut" => $tributGService->getStatusAndIfValid($profil[0]->getTributg(),$profil[0]->getIsVerifiedTributGAdmin(), $userId),

        ]);
    }

}
