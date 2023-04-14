<?php

namespace App\Controller;

use App\Form\SettingProfilConsumerType;
use App\Form\SettingProfilSupplierType;
use App\Form\ConfidentialityType;
use App\Entity\Consumer;
use App\Entity\Supplier;
use App\Entity\User;
use App\Entity\Confidentiality;
use App\Service\Tribu_T_Service;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use SymfonyCasts\Bundle\VerifyEmail\VerifyEmailHelperInterface;
use App\Service\MailService;
use App\Service\Status;
use App\Service\TributGService;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

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
    public function index(Request $request, Status $status): Response
    {

        $user = $this->getUser();
        $userId = $user->getId();
        $userType = $user->getType();
        $profil = null;
        $flushMessage = null;
        $form = null;
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

                $profil[0]->setFirstname($fname);

                $profil[0]->setLastname($lname);

                $profil[0]->setNumRue($numRue);

                $profil[0]->setTelephone($telephone);

                // $profil[0]->setVille($ville);

                $profil[0]->setCodePostal($codePostal);

                $profil[0]->setPays($pays);

                $profil[0]->setTelFixe($telFixe);

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

                $this->entityManager->flush();

                $flushMessage = "Votre profil a été bien à jour !";
            }
        }
        $statusProfile = $status->statusFondateur($this->getUser());
        
        return $this->render('setting/index.html.twig', [
            'profil' => $profil,
            "statusTribut" => $statusProfile["statusTribut"],
            'form' => $form->createView(),
            "message" => $flushMessage
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
    public function updatePassword(Request $request, UserPasswordHasherInterface $passwordEncoder): Response
    {
        $user = $this->getUser();

        $flushMessage = null;

        $isSuccess = false;

        if ($request->isMethod("POST")) {

            if ($request->request->get('reset') == "resetPassword") {
                $old_password = $request->request->get('old_password');
                if ($passwordEncoder->isPasswordValid($user, $old_password)) {
                    $new_password = $request->request->get('new_password');
                    $retap_new_password = $request->request->get('retap_new_password');
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
                $password = $request->request->get('password');
                if ($passwordEncoder->isPasswordValid($user, $password)) {

                    $new_email = $request->request->get('new_email');

                    $user->setEmailTemp($new_email);

                    //$user->setVerifiedMail(false);

                    $this->entityManager->flush();

                    $flushMessage = "Veuillez vérifier le lien de modification dans " . $new_email;

                    $isSuccess = true;

                    //// prepare email which we wish send
                    $signatureComponents = $this->verifyEmailHelper->generateSignature(
                        "validate_email", /// lien de revenir
                        $user->getId(), /// id for user
                        $new_email, /// email destionation use for verifier
                        ['id' => $user->getId()] /// param id
                    );

                    $url = $this->generateUrl("validate_email", array("id" => $user->getId()), UrlGeneratorInterface::ABSOLUTE_URL);

                    //dd($url);

                    $param = $passwordEncoder->hashPassword($user, $user->getId());

                    //dd($signatureComponents->getSignedUrl() . "&id=" . $user->getId());

                    $this->mailService->sendEmail(
                        "geoinfography@infostat.fr", /// mail where from
                        "ConsoMyZone",  //// name the senders
                        $new_email, /// mail destionation
                        $user->getPseudo(), /// name destionation
                        "EMAIL DE CONFIRMATION", //// title of email
                        "Pour confirmer votre modification de l'adresse email. Clickez-ici: " . $signatureComponents->getSignedUrl() . "&id=" . $user->getId() /// content: link
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

        return $this->render('setting/password.html.twig', [
            "message" => $flushMessage,
            "isSuccess" => $isSuccess,
            "profil"=>$profil,
            'statusTribut' => ["status" => "", "verified" => ""],
        ]);
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
