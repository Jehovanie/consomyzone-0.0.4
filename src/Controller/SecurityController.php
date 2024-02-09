<?php



namespace App\Controller;



use App\Entity\User;

use App\Service\Status;

use App\Entity\Consumer;

use App\Entity\Supplier;

use App\Service\MailService;

use App\Service\UserService;

use App\Form\InscriptionType;

use App\Service\AgendaService;

use App\Entity\Confidentiality;

use App\Service\MessageService;

use App\Service\TributGService;

use App\Service\Tribu_T_Service;

use App\Repository\UserRepository;

use App\Service\RequestingService;

use App\Security\UserAuthenticator;
use App\Form\InscriptionFilleulType;

use App\Service\NotificationService;
use App\Repository\CodeapeRepository;
use App\Repository\CommuneRepository;

use App\Form\InscriptionPartenaireType;
use App\Repository\ConsumerRepository;
use App\Repository\SupplierRepository;
use Doctrine\ORM\EntityManagerInterface;

use Symfony\Component\HttpFoundation\Request;

use Symfony\Component\HttpFoundation\Response;

use Symfony\Component\Routing\Annotation\Route;

use Symfony\Component\HttpFoundation\JsonResponse;

use Symfony\Component\Serializer\SerializerInterface;

use Symfony\Component\HttpFoundation\RedirectResponse;

use Symfony\Component\Form\Extension\Core\Type\TextType;

use Symfony\Component\Form\Extension\Core\Type\EmailType;

use Symfony\Component\Form\Extension\Core\Type\PasswordType;

use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

use SymfonyCasts\Bundle\VerifyEmail\VerifyEmailHelperInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use SymfonyCasts\Bundle\VerifyEmail\Exception\VerifyEmailExceptionInterface;
use Symfony\Component\Security\Http\Authentication\UserAuthenticatorInterface;

class SecurityController extends AbstractController

{
    private $requesting;

    function __construct(
        RequestingService $requesting
    ){
        $this->requesting = $requesting;
    }



    #[Route(path: '/connexion', name: 'app_login')]

    public function login(
        AuthenticationUtils $authenticationUtils,
        CodeapeRepository $codeApeRep,
        MailService $mailService,
        Request $request,
        EntityManagerInterface $entityManager,

        UserPasswordHasherInterface $passwordHasher,

        UserRepository $userRepository,

        NotificationService $notificationService,

        MessageService $messageService,

        VerifyEmailHelperInterface $verifyEmailHelper
    ): Response {

        if ($this->getUser()) {

            return $this->redirectToRoute('app_account');
        }

        $flash = [];

        if( $request->query->get("inscription") && $request->query->get("inscription") === "1" ){

            $flash = [
                "titre" => "SUCCESS",
                
                "content" => "Votre compte a été créé. Merci de vérifier votre boite email,". 
                            "pour finaliser votre inscription."
            ];
           
        }else{
            $type = $request->query->get("type");
            switch($type){
                case "email-nv": /// email not valid
                    $flash = [
                        "titre" => "ERROR",
                        "content" => "Votre adresse e-mail n'est pas validée, veuillez vérifier s'il vous plaît !"
                    ];
                    break;
                case "email-ae": /// email already exist
                    $flash = [
                        "titre" => "ERROR",
                        "content" => "Votre adresse e-mail existe déjà dans notre base de données, veuillez-vous connecter."
                    ];
                    break;
                case "password-ne":
                    $flash = [
                        "titre" => "ERROR",
                        "content" => "Veuillez vérifier votre mot de passe, il semble non conforme."
                    ];
                    break;
                case "password-sh":
                    $flash = [
                        "titre" => "ERROR",
                        "content" => "Veuillez vérifier votre mot de passe, il semble très court."
                    ];
                    break;
                default:
                    break;
            }

        }

        // get the login error if there is one
        $error = $authenticationUtils->getLastAuthenticationError();
        // last username entered by the user
        $lastUsername = $authenticationUtils->getLastUsername();

        $form = $this->createFormBuilder()
            ->setAction($this->generateUrl('app_inscription'))
            ->setMethod('POST')
            ->add('pseudo', TextType::class)
            ->add('email', EmailType::class)
            ->add('password', PasswordType::class)
            ->add('confirmpassword', PasswordType::class)
            ->getForm();

        ///don't change this, it used to handle error from user like : email exist, mdp don't match, ... 
        return $this->render('authenticator/connexion.html.twig', [
            'last_username' => $lastUsername,
            'error' => $error,
            "codeApes" => $codeApeRep->getCode(),
            "form_inscription" => $form->createView(),
            "flash" => $flash,
        ]);
    }

    #[Route(path: '/actualite-non-active', name: 'app_actu_non_active')]
    public function errorLoginProfil(){
        return $this->render('authenticator/actu_non_active.html.twig', [
        ]);
    }



    #[Route(path: '/reset-passwords', name: 'app_reset_password')]
    public function resetPassword(
        Request $request,
        VerifyEmailHelperInterface $verifyEmailHelper,
        UserRepository $userRepository,
        MailService $mailService,
        CodeapeRepository $codeApeRep
    ): Response {

        if ($this->getUser()) {
            return $this->redirectToRoute('app_home');
        }

        $flash = [];

        if ($request->isMethod('post')) {
            $email = $request->request->get('email');

            $user = $userRepository->findOneBy(["email" => $email]);
            if (!$user) {
                $flash = [
                    "titre" => "ERREUR",
                    "content" => "Nous n'avons pas trouvé votre adresse e-mail."
                ];
                ///On quitte
                goto quit;
            }

            //// prepare email which we wish send
            $signatureComponents = $verifyEmailHelper->generateSignature(
                "app_valid_reset_password", /// lien de revenir
                $user->getId(), /// id for user
                $user->getEmail(), /// email destionation use for verifier
                ['id' => $user->getId()] /// param id
            );

            // //// send the mail
            // $mailService->sendEmail(
            //     $user->getEmail(), /// mail destionation
            //     trim($user->getPseudo()), /// name destionation
            //     "Confirmation de réinitialiser mon mot de passe", //// title of email
            //     "Cliquez ici pour modifier votre mot de passe " . $signatureComponents->getSignedUrl() /// content: link
            // );

              
            $mailService->sendLinkOnEmailAboutAuthenticator(
                $user->getEmail(), /// mail destionation
                trim($user->getPseudo()), /// name destionation
                [
                    "object" => "Confirmation de réinitialiser Mot de passe",
                    "template" => "emails/mail_reset_password.html.twig",
                    "link" => $signatureComponents->getSignedUrl() /// link
                ]
            );

            $flash = [
                "titre" => "SUCCESS",
                "content" => "Nous avons envoyé un e-mail pour confirmer votre changement de mots de passe."
            ];
            ///On quitte
            goto quit;

            // return $this->redirect($request->getUri());
        }

        quit:
        return $this->render('authenticator/reset_password.html.twig', [
            "flash" => $flash,
            "codeApes" => $codeApeRep->getCode()
        ]);
    }

    #[Route(path: '/confirm-reset-passwords', name: 'app_valid_reset_password')]
    public function confirmResetPassword(
        Request $request,
        UserRepository $userRepository,
        UserPasswordHasherInterface $passwordHasher,
        EntityManagerInterface $entityManager,
        UserAuthenticatorInterface $authenticator,
        UserAuthenticator $loginAuth,
        CodeapeRepository $codeApeRep
    ): Response {
        if ($this->getUser()) {
            return $this->redirectToRoute('app_home');
        }


        $user_id = $request->query->get('id');

        $flash = [];

        if ($request->isMethod('post')) {

            $password = $request->request->get('password');
            $confirmPassword = $request->request->get('confirmPassword');

            if (strcmp($password, $confirmPassword) != 0) {
                // dd("Password don't macth.");
                $flash = [
                    "titre" => "ERREUR",
                    "content" => "Votre mot de passe n'est pas le même."
                ];
                ///On quitte
                goto quit;
            } else if (strlen($password) < 8) {
                $flash = [
                    "titre" => "ERREUR",
                    "content" => "Votre mot de passe est très court."
                ];
                ///On quitte
                goto quit;
            }

            $user = $userRepository->find(intval($user_id));

            $user->setPassword($password);
            $hashedPassword = $passwordHasher->hashPassword(
                $user,
                $user->getPassword()
            );
            $user->setPassword($hashedPassword);


            ///stock the user
            //$entityManager->persist($user);
            $entityManager->flush();


            return $authenticator->authenticateUser(
                $user,
                $loginAuth,
                $request
            );
        }

        quit:
        return $this->render('authenticator/confirme_reset_password.html.twig', [
            "flash" => $flash,
            "codeApes" => $codeApeRep->getCode()
        ]);
    }


    #[Route(path: '/deconnexion', name: 'app_disconnect')]
    public function disconnect(UrlGeneratorInterface $urlGenerator, EntityManagerInterface $entityManager): ?Response
    {
        $user = $this->getUser();

        if(!is_null($user)){
            $user->setIsConnected(0);

            ///stock the user
            //$entityManager->persist($user);
            $entityManager->flush();
        }
          

        return new RedirectResponse($urlGenerator->generate('app_logout'));
        
    }

    #[Route(path: '/logout', name: 'app_logout')]
    public function logout(): void
    {
        
        throw new \LogicException('This method can be blank - it will be intercepted by the logout key on your firewall.');
    }



    #[Route(path: '/inscription', name: 'app_inscription', methods: "post")]
    public function inscription(
        Request $request,
        MailService $mailService,
        EntityManagerInterface $entityManager,
        UserPasswordHasherInterface $passwordHasher,
        UserRepository $userRepository,
        NotificationService $notificationService,
        MessageService $messageService,
        VerifyEmailHelperInterface $verifyEmailHelper,
        AgendaService $agendaService,
        CodeapeRepository $codeApeRep,
        Tribu_T_Service $tribu_T_Service
    ) {

        $result = true;
        $type = "";

        $data = $request->request->all()["form"];
        //dd($data);
        // dd($data);
        extract($data);




        ///data user.
        //dd($data['email']);
        if( !$mailService->valid_email($data['email'])){
            $result = false;
            $type = "email-nv"; ///email not valid

            goto quit;
        }



        ///check the email if already exist
// if ($userRepository->findOneBy(['email' => $data['email']])) {
        //     $result = false;
        //     $type = "email-ae"; /// email already exist

        //     goto quit;
        // }
            $oldUser = null;
            ///check the email if already exist
        if ($userRepository->findOneBy(['email' => $data['email']])) {
            $userExist = $userRepository->findOneBy(['email' => $data['email']]);
            if($userExist->getType() == "Type"){
                $oldUser = $userExist;
            }else{
                $result = false;
                $type = "email-ae"; /// email already exist
                goto quit;
            }
        }


// Check if old user
           

        ////valid password
        if (strcmp($data['password'], $data['confirmpassword']) != 0) {
            $result = false;
            $type = "password-ne";///password not equal

            goto quit;

        } else if (strlen($data['password']) < 8) {
            $result = false;
            $type = "password-sh"; ///password to short

            goto quit;
        }



        /// new instance for user.
        if($oldUser){
            $user = $oldUser;
        }else{
            /// new instance for user.
            $user = new User();
        }

        $user->setPseudo(trim($data['pseudo']));
        $user->setEmail(trim($data['email']));
        $user->setPassword($data['password']);
        $user->setVerifiedMail(true);
        $user->setIsConnected(true);
        $user->setIdle(300);



        ////setting roles for user admin.
        if (count($userRepository->findAll()) === 0) {
            $user->setRoles(["ROLE_GODMODE"]);
        } else {
            $user->setRoles(["ROLE_USER"]);
        }



        ///property temp with default value, wait this user have an ID
        $user->setType("Type");
        $user->setTablemessage("tablemessage");
        $user->setTablenotification("tablenotification");
        $user->setTablerequesting("tablerequesting");
        $user->setNomTableAgenda("agenda");
        $user->setNomTablePartageAgenda("partage_agenda");

        ///hash password
        $hashedPassword = $passwordHasher->hashPassword(
            $user,
            $user->getPassword()
        );
        $user->setPassword($hashedPassword);



        ///save the user
        $entityManager->persist($user);
        $entityManager->flush();



        ///change the value temp: now this user have an ID, so change temp value
        $numero_table = $user->getId();

        $userNew=$userRepository->findOneById($numero_table);

        ///with true value
        $userNew->setTablemessage("tablemessage_" . $numero_table);
        $userNew->setTablenotification("tablenotification_" . $numero_table);
        $userNew->setTablerequesting("tablerequesting_" . $numero_table);
        $userNew->setNomTableAgenda("agenda_" . $numero_table);
        $userNew->setNomTablePartageAgenda("partage_agenda_" . $numero_table);

///keep the change in the user information
        $entityManager->flush();


        ///create table dynamique
        $notificationService->createTable("tablenotification_" . $numero_table);
        $messageService->createTable("tablemessage_" . $numero_table);
        $this->requesting->createTable("tablerequesting_" . $numero_table);
        $agendaService->createTableAgenda("agenda_" . $numero_table);
        $agendaService->createTablePartageAgenda("partage_agenda_" . $numero_table);
        $agendaService->createAgendaStoryTable($numero_table);
        $tribu_T_Service->createParrainageTable($numero_table);

        ///keep the change in the user information
        // $entityManager->persist($user);
        $entityManager->flush();


        /**
         * Persist user on confidentiality table
         * @author Nantenaina        
         */
        $confidentiality = new Confidentiality();
        $confidentiality->setNotifIsActive(1);
        $confidentiality->setProfil(1);
        $confidentiality->setEmail(1);
        $confidentiality->setAmie(1);
        $confidentiality->setInvitation(1);
        $confidentiality->setPublication(1);
        $confidentiality->setUserId($numero_table);



        $entityManager->persist($confidentiality);
        $entityManager->flush();

        /*
        * @end Nantenaina     
        */

        //// prepare email which we wish send
        $signatureComponents = $verifyEmailHelper->generateSignature(
            "verification_email", /// lien de revenir
            $user->getId(), /// id for user
            $user->getEmail(), /// email destionation use for verifier
            ['id' => $user->getId()] /// param id
        );


        /// IN DEVELOPMENT----- delete this when PROD ------------///
        // if( strtolower($_ENV["APP_ENV"]) === "dev"){
        //     return $this->redirect($signatureComponents->getSignedUrl());
        // }
        ///-------------------------------------------------------///


       
        $mailService->sendLinkOnEmailAboutAuthenticator(
            $user->getEmail(), /// mail destination
            trim($user->getPseudo()), /// name destination
            [
                "object" => "Confirmation d'inscription sur ConsoMyZone", //// object of the email
                "link" => $signatureComponents->getSignedUrl(), /// link
                "template" => "emails/mail_confirm_inscription.html.twig"
            ]
        );

        ///don't change this, it used to handle error from user like : email exist, mdp don't match, ... 
        quit:
        return $this->redirectToRoute("app_login", ["inscription" => $result,"type" => $type, "token" => "IffNjJ8ZSjaDm91Hr8bzHtxuDJaXcDrHbuCXribS5Hw%3D" ]);

        // return $this->render("authenticator/inscription.html.twig", [
        // return $this->render("authenticator/connexion.html.twig", [
        //     "form_inscription" => $form->createView(),

        //     "flash" => $flash,

        //     "codeApes" => $codeApeRep->getCode()

        // ]);
    }



    #[Route(path: '/inscription/resend-email', name: 'app_inscription-resend-email', methods: "POST")]
    public function  resendEmail(Request $request, UserRepository $userRepository, VerifyEmailHelperInterface $verifyEmailHelper, MailService $mailService)
    {

        //// send the mail

        $email = $request->request->get('email');

        $user = $userRepository->findOneBy(['email' => $email]);



        //// prepare email which we wish send

        $signatureComponents = $verifyEmailHelper->generateSignature(

            "verification_email", /// lien de revenir

            $user->getId(), /// id for user

            $user->getEmail(), /// email destionation use for verifier

            ['id' => $user->getId()] /// param id

        );



        ///send email

        $mailService->sendEmail(
            $user->getEmail(), /// mail destionation
            trim($user->getPseudo()), /// name destionation
            "EMAIL CONFIRMATION", //// title of email
            "Pour confirmer votre inscription. Clickez-ici: " . $signatureComponents->getSignedUrl() /// content: link
        );



        return $this->json("success");
    }


    //doesn't change the fucking code if you don't know what will you do!!!!
    #[Route(path: "/verification_email", name:"verification_email", methods: ["GET", "POST"])]
    public function verification_email(
        Request $request,
        Status $status,
        UserRepository $userRepository,
        NotificationService $notificationService,
        TributGService $tributGService,
        EntityManagerInterface $entityManager,
        UserAuthenticatorInterface $authenticator,
        UserAuthenticator $loginAuth,
        VerifyEmailHelperInterface $verifyEmailHelper,
        Filesystem $filesyst,
        ConsumerRepository $consumerRepository,
        SupplierRepository $supplierRepository,
        Tribu_T_Service $tribu_T_Service,
        RequestingService $requesting,
        UserService $userService
    ) {
        
        if ($this->getUser()) {
            $userConnected= $status->userProfilService($this->getUser());
            if( $userConnected["userType"] !== "Type"){
                return $this->redirectToRoute('app_home');
            }
        }

        ///to get info
        ///id de l'utilisateur.
        $userToVerifie = $userRepository->find($request->query->get('id'));
        
        //on utilise cette variable quand la requêst provient d'une relance
        $tribuT="";

        //id decrypted on utile cette id pour le parainage si cela vient de la relance
        $idDecrypted=null; 
        //verifie si relance , t =relance
        if($request->query->get('verif')!=null && strcmp($request->query->get('verif'),'t')==0){
            $key = hex2bin("000102030405060708090a0b0c0d0e0f");
            $iv = hex2bin("101112131415161718191a1b1c1d1e1f");
            $idUserToVerifieBase64Decoded=base64_decode($request->query->get('id'),true);
            $decryptedIdUserToVerifie = openssl_decrypt($idUserToVerifieBase64Decoded, "AES-128-CBC", 
            $key, 0, $iv);
            $idDecrypted=  $decryptedIdUserToVerifie;
            $userToVerifie = $userRepository->find($decryptedIdUserToVerifie);
            $tribuTBase64Decrypted=base64_decode($request->query->get('tribuT'),true);
            $tribuT=openssl_decrypt($tribuTBase64Decrypted, "AES-128-CBC", 
            $key, 0, $iv);
            
        }

        if($request->query->get('verif')!=null && strcmp($request->query->get('verif'),'a')==0){
            $key = hex2bin("000102030405060708090a0b0c0d0e0f");
            $iv = hex2bin("101112131415161718191a1b1c1d1e1f");
            $idUserToVerifieBase64Decoded=base64_decode($request->query->get('id'),true);
            $idDecrypted=  $decryptedIdUserToVerifie;
            $decryptedIdUserToVerifie = openssl_decrypt($idUserToVerifieBase64Decoded, "AES-128-CBC", 
            $key, 0, $iv);
            $userToVerifie = $userRepository->find($decryptedIdUserToVerifie);
            
            
        }
        //ne pas enlever ce bout de code ici demander avant de modifier
        //ça créé des erreur 
        if (!$userToVerifie) {
            return new Response('<div class="flex-container" style="display:flex;  flex-direction: row ;justify-content: center">'.
                                    '<div class="text-center" style="text-align: center!important;">'.
                                    '<h1 style="font-size: 2.5rem;">'.
                                        '<span class="fade-in" id="digit1">4</span>'.
                                        '<span class="fade-in" id="digit2">0</span>'.
                                        '<span class="fade-in" id="digit3">4</span>'.
                                    '</h1>'.
                                    '<h3 class="fadeIn" style="font-size: 1.75rem;">Page non trouvée.</h3>'.
                                    '<a href="/" style="text-decoration:underline; color:blue">Revenir à la page d\'accueil.</a>'.
                                    '</div>'.
                                '</div>'
                                ,404);
        }

        //verfiez si l'utilisateur à verifier est déjà membre dans cmz cad il de type= "consumer"
        if(strcmp($userToVerifie->getType(),"Type")!=0){ 
        //verfier si c'est une relance d'adhésion à une tribu T ou non
                if($request->query->get('verif')!=null && strcmp($request->query->get('verif'),'t')==0){
                    $emailToVerifie= $userToVerifie->getEmail();
                    $userId=$userToVerifie->getId();
                    
                    $userToVerifyTribuT=json_decode($userToVerifie->getTribuTJoined(),true);
                    $userToVerifyTribuT= $userToVerifyTribuT !=null ?  $userToVerifyTribuT["tribu_t"] : [];
            
                    //verifier si il est dèja dans la tribu t pour éviter d'ecrire la tribu en double  
                    if(count($userToVerifyTribuT) > 0 &&  isset($userToVerifyTribuT[0]) ){
                        foreach($userToVerifyTribuT as $tribu){
                            if( strcmp($tribu["name"],$tribuT)==0 ){ //// check the tribu T to join
                                return $this->render("authenticator/relance_inscription_response.html.twig",[
                                    "message" => "Vous êtes déjà membre de la tribu T ".$tribu["name_tribu_t_muable"],
                                    "lien" => "app_login"
                                ]);
                            }
                        }
                    }else{
                        
                        if( count($userToVerifyTribuT) > 0 ){
                            if(strcmp($userToVerifyTribuT["name"],$tribuT)==0) //// check the tribu T to join
                            return $this->render("authenticator/relance_inscription_response.html.twig",[
                                "message" => "Vous êtes déjà membre de la tribu T ".$userToVerifyTribuT["name_tribu_t_muable"],
                                "lien" => "app_login"
                            ]);
                        }
                    }
                
                    //ajoutez les tribu T dans la table 
                    //ce code est là on guisse d'assurance au cas où ça ne vas pas dans le code inscriptions tribu
                    // $userFondateurTribuT= $serviceTribuT->getTribuTInfo($tribuT);
                    // $userPostID= $userFondateurTribuT["user_id"]; /// id of the user fondateur of this tribu T

                    // $data= json_decode($userFondateurTribuT["tribu_t_owned"], true); 
                    
                    // $arrayTribuT= $data['tribu_t']; /// all tribu T for this user fondateur
                    
                    // $apropos_tribuTtoJoined=[];
                    // if(count($arrayTribuT) > 0 &&  isset($arrayTribuT[0]) ){
                        
                    //         foreach($arrayTribuT as $tribu){
                        
                    //                 if( strcmp($tribu["name"],$tribuT)==0 ){ //// check the tribu T to join
                    //                         $apropos_tribuTtoJoined= $tribu;
                    //                         break;
                    //         }
                    //     }
                    // }else{
                        
                    //     if( strcmp($arrayTribuT["name"],$tribuT)==0 ){ //// check the tribu T to join
                    //                 $apropos_tribuTtoJoined= $arrayTribuT;
                        
                    //         }
                    // }    
                    
                
                    // $serviceTribuT->setTribuT(
                    //         $apropos_tribuTtoJoined["name"], 
                    //         $apropos_tribuTtoJoined["description"], 
                    //         $apropos_tribuTtoJoined["logo_path"],
                    //         $apropos_tribuTtoJoined["extension"], 
                    //         $userId,
                    //          "tribu_t_joined", 
                    //         $apropos_tribuTtoJoined["name_tribu_t_muable"]
                    // );

                    
                    
        
                    // //// /envoie une notification au autre partisans
                    // $content = $emailToVerifie . " a accepté l'invitation de rejoindre la tribu " . $apropos_tribuTtoJoined["name_tribu_t_muable"];
                    
                    // $notificationService->sendNotificationForOne(
                    //         $userId, 
                    //         intval($userPostID), 
                    //         "user/tribu/my-tribu-t", 
                    //         $content);
                    // //met à jour la table historique des invitations
                    // $serviceTribuT->updateInvitationStory($tribuT."_invitation",1,$emailToVerifie,$userId);

                    // //confirme l'inscriptions comme membre de la tribuT
                    // $serviceTribuT->confirmMemberTemp($tribuT,$userId,$emailToVerifie);
                    return $this->render("authenticator/relance_inscription_response.html.twig",[
                        "message" => "Vous êtes maintenant membre de la tribu T ".$tribu["name_tribu_t_muable"],
                        "lien" => "app_login"
                    ]);
            }else{
                return $this->redirectToRoute('app_home');
            }
            
        }

        //a verifier
        // try {
        //     $verifyEmailHelper->validateEmailConfirmation(
        //         $request->getUri(),
        //         $userToVerifie->getId(),
        //         $userToVerifie->getEmail(),
        //     );
        // } catch (VerifyEmailExceptionInterface $e) {
        //     return $this->redirectToRoute('app_login');
        // }

        ///change the to true the email verified
        $userToVerifie->setVerifiedMail(true);  ///get the user from database by id

        $tableParrainage = $idDecrypted !=null ? "tableparrainage_".$idDecrypted : "tableparrainage_".$request->query->get('id');
        if(count($userService->getParainG($tableParrainage)) > 0){
            return $this->redirectToRoute('verification_filleul', ['id' => $request->query->get('id')]);
        }

        ////CREATE NEW FORM TO COMPLETE USER PROFIL
        $flash = [];

        $form = $this->createForm(InscriptionType::class);
      
        $form->handleRequest($request);
        if ($form->isSubmitted()) {
            ///get the data
            extract($form->getData());
         
            if( $consumerRepository->findOneBy(["userId" => $this->getUser() ]) ||  $supplierRepository->findOneBy(["userId" => $this->getUser() ]) ){
                return $authenticator->authenticateUser( $userToVerifie, $loginAuth, $request );
            }

            /// if the user is consumer
            if ($Consommateur && !$Fournisseur) {

                $user_profil = new Consumer();
                $userToVerifie->setType("consumer");

                ///the user is supplier
            } else {

                $user_profil = new Supplier();
                $user_profil->setCommerce($commerce);
                $user_profil->setCodeape($code_ape);
                $user_profil->setWebsite($site_web);
                $user_profil->setFacebook($facebook);
                $user_profil->setTwitter($twitter);
                $userToVerifie->setType("supplier");

            }

            $user_profil->setFirstname($nom);
            $user_profil->setLastname($prenom);
            $user_profil->setNumRue($num_rue);
            $user_profil->setTelephone($telephone);
            $user_profil->setCodePostal($code_postal);
            $user_profil->setCommune($nom_commune);
            $user_profil->setPays($pays);
            // $user_profil->setVille($ville);

            if( $telephone ){
                $user_profil->setTelFixe($telephone);
            }else{
                $user_profil->setTelFixe("");
            }

            // $name_tributG = "tribug_" . $departement . "_" . implode("_", explode(" ", $user_profil->getQuartier()));
            $test_length = "tribug_" . $departement . "_" . implode("_", explode(" ", $quartier));
            if( strlen($test_length) > 40 ){
                $data=  explode(" ", $quartier);

                $resolve_name= [ ];
                for( $i=0; $i< (count($data) - 1 ) / 2; $i++ ){
                    array_push($resolve_name, $data[$i]);
                }

                $quartier = implode("_", $resolve_name);
            }

            $user_profil->setQuartier($quartier);

            $departement = strlen($departement) === 1 ? "0". $departement : $departement;

            $name_tributG = "tribug_" . $departement . "_" . implode("_", explode(" ", $user_profil->getQuartier()));
            $name_tributG = strlen($name_tributG) > 40 ? substr($name_tributG,0,30) : $name_tributG;
            $user_profil->setTributg($name_tributG);


            ////set profil
            if( $profil ){
                ///path file folder
                $path = $this->getParameter('kernel.project_dir') . '/public/uploads/users/photos/photo_user_' . $userToVerifie->getId() . "/";
                $dir_exist = $filesyst->exists($path);

                if ($dir_exist == false) {
                    $filesyst->mkdir($path, 0777);
                }

                $temp = explode(";", $profil );
                $extension = explode("/", $temp[0])[1];
                $image_name = "profil_". $nom . "." . $extension;

                ///save image in public/uploader folder
                file_put_contents($path ."/". $image_name, file_get_contents($profil));
                
                ///set use profile
                $user_profil->setPhotoProfil( '/uploads/users/photos/photo_user_' . $userToVerifie->getId() . "/" . $image_name);
            }

            // $user_profil->setPhotoCouverture("photo de couverture");

            $user_profil->setUserId($userToVerifie);

            $user_profil->setIsVerifiedTributGAdmin(0);

            $departement = strlen($departement) === 1 ? "0". $departement : $departement;
            // $name_tributG = "tribug_" . $departement . "_" . implode("_", explode(" ", $user_profil->getQuartier()));
            $name_tributG = "tribug_" . $departement . "_" . implode("_", explode(" ", $user_profil->getQuartier()));
            $name_tributG = strlen($name_tributG) > 40 ? substr($name_tributG,0,30) : $name_tributG;


            $user_profil->setTributg($name_tributG);

            ///attribution des tribut.
            $resultat = $tributGService->createTableTributG($name_tributG, $userToVerifie->getId());

            ///save the user information
            $entityManager->persist($user_profil);
            $entityManager->flush();



            ////  NOTIFICATION

            ///switch type of the notification
            $notification = [
                "admin" => "Nous vous informons qu'une nouvelle tribu G a été créée.",
                "fondateur" => "Nous avons un grand plaisir de vous annoncer que la tribu G selon votre code postal a été créée et vous êtes l'administrateur provisoire.",
                "current" => "Nous avons un grand plaisir de vous avoir parmi nous dans la tribu G d'après votre code postal. De la part de tous les membres et la direction, nous aimerions présenter nos salutations cordiales et la bonne chance.",
                "other" => "Nous avons un grand plaisir de vous annonce que notre tribu G a un nouveau fan."
            ];



            $type = "/user/account";
            $all_user_sending_notification = $tributGService->getAllTributG($user_profil->getTributG()); /// [ ["user_id" => 1], ... ]

            foreach ($all_user_sending_notification as $user_to_send_notification) { ///["user_id" => 1]
                
                $user_id_post = intval($user_to_send_notification["user_id"]);
                if ($user_id_post === $userToVerifie->getId()) { ///current user connecter

                    if ($resultat == 0) {

                        $message_notification = $notification["fondateur"];
                    } else {

                        $message_notification = $notification["current"];
                    }
                } else {
                    // $message_notification = $notification["other"] . "<br/> <a class='d-block w-50 mx-auto btn btn-primary text-center' href='/user/profil/" .  $request->query->get('id') . "' alt='Nouvelle membre'>Voir son profil</a>";
                    $message_notification = $notification["other"];
                }





                $notificationService->sendNotificationForOne(
                    $userToVerifie->getId(),
                    $user_id_post,
                    $type,
                    $message_notification
                );
            }

            ////notification for super admin
            if ($userRepository->findByRolesUserSuperAdmin() && $resultat == 0) {

                $super_admin = $userRepository->findByRolesUserSuperAdmin();
                // $message_notification = $notification["admin"] . "<br/> <a class='d-block w-50 mx-auto btn btn-primary text-center' href='/user/dashboard-membre?table=" .  $name_tributG . "' alt='Nouvelle membre'>Valider</a>";
                $message_notification = $notification["admin"];

                $notificationService->sendNotificationForOne(
                    $userToVerifie->getId(),
                    $super_admin->getId(),
                    $type,
                    $message_notification,
                );
            }

            //TODO: verif param t and complete inscription t
            ///// END NOTIFICATION ////
            // if($request->query->get('verif')!=null && strcmp($request->query->get('verif'),'t')==0){
                    //         //TODO: mettre à jour les champs dans la table tribuT
                    //         $emailToVerifie= $userToVerifie->getEmail();
                    //         $userId=$userToVerifie->getId();

                    //         //ajoutez les tribu T dans la table
                    //         $userFondateurTribuT= $serviceTribuT->getTribuTInfo($tribuT);
                    //         $userPostID= $userFondateurTribuT["user_id"]; /// id of the user fondateur of this tribu T

                    //         $data= json_decode($userFondateurTribuT["tribu_t_owned"], true); 
                    
                    //         $arrayTribuT= $data['tribu_t']; /// all tribu T for this user fondateur
                    //         dump($arrayTribuT);
                    //         $apropos_tribuTtoJoined=[];
                    //         if(count($arrayTribuT) > 0 &&  isset($arrayTribuT[0]) ){
                        //             foreach($arrayTribuT as $tribu){
                           
                            //                 if( strcmp($tribu["name"],$tribuT)==0 ){ //// check the tribu T to join
                                //                     $apropos_tribuTtoJoined= $tribu;
                                //                     break;
            //                 }
            //             }
            //         }else{
            //             if( strcmp($arrayTribuT["name"],$tribuT)==0 ){ //// check the tribu T to join
                            //                 $apropos_tribuTtoJoined= $arrayTribuT;
                        //             }
            //         }    
                    
                    
                    //         $serviceTribuT->setTribuT(
                        //             $apropos_tribuTtoJoined["name"], 
                        //             $apropos_tribuTtoJoined["description"], 
                        //             $apropos_tribuTtoJoined["logo_path"],
                        //             $apropos_tribuTtoJoined["extension"], 
                        //             $userId,
                         //              "tribu_t_joined", 
                        //             $apropos_tribuTtoJoined["name_tribu_t_muable"]
                    //         );

                    
                    
        
                    //         //// /envoie une notification au autre partisans
                    //         $content = $emailToVerifie . " a accepté l'invitation de rejoindre la tribu " . $apropos_tribuTtoJoined["name_tribu_t_muable"];
                    
                    //         $notificationService->sendNotificationForOne(
                        //             $userId, 
                        //             intval($userPostID), 
                        //             "user/tribu/my-tribu-t", 
                        //             $content);
                    //         //met à jour la table historique des invitations
                    //         $serviceTribuT->updateInvitationStory($tribuT."_invitation",1,$emailToVerifie,$userId);

                    //         //confirme l'inscriptions comme membre de la tribuT
                    //         $serviceTribuT->confirmMemberTemp($tribuT,$userId,$emailToVerifie);

                    
            // }

            // Générer des tribus T ami et famille
            $userId = $idDecrypted!=null ? $idDecrypted : $request->query->get('id');
            $suffixeTableTribuTAmie = "A";
            $suffixeTableTribuTFamille = "F";
            $tableTribuTAmie = "tribu_t_" . $userId . "_" .$suffixeTableTribuTAmie;
            $tableTribuTFamille = "tribu_t_" . $userId . "_" .$suffixeTableTribuTFamille;
            $nomTribuTAmie = "Tribu A";
            $descriptionTribuTAmie = "Tribu T pour mes amis";
            $nomTribuTFamille = "Tribu F";
            $descriptionTribuTFamille = "Tribu T pour ma famille";
            $tribu_T_Service->createTribuTable($suffixeTableTribuTAmie, $userId, $nomTribuTAmie, $descriptionTribuTAmie);
            $tribu_T_Service->createTribuTable($suffixeTableTribuTFamille, $userId, $nomTribuTFamille, $descriptionTribuTFamille);

            $extension = [];
            $extension["restaurant"] = 1;
            $extension["golf"] = 1;
            if(!$tribu_T_Service->checkIfTribuTExist($tableTribuTAmie, $userId, "tribu_t_owned"))
                $tribu_T_Service->setTribuT($tableTribuTAmie, $descriptionTribuTAmie, "", $extension, $userId, "tribu_t_owned", $nomTribuTAmie);
            
            if(!$tribu_T_Service->checkIfTribuTExist($tableTribuTFamille, $userId, "tribu_t_owned"))
                $tribu_T_Service->setTribuT($tableTribuTFamille, $descriptionTribuTFamille, "", $extension, $userId, "tribu_t_owned", $nomTribuTFamille);
            
            if ($extension["restaurant"] == 1) {

                $tribu_T_Service->createExtensionDynamicTable($tableTribuTAmie, "restaurant");

                $tribu_T_Service->createTableComment($tableTribuTAmie, "restaurant_commentaire");

                $tribu_T_Service->createExtensionDynamicTable($tableTribuTFamille, "restaurant");

                $tribu_T_Service->createTableComment($tableTribuTFamille, "restaurant_commentaire");
            }

            if ($extension["golf"] == 1) {

                $tribu_T_Service->createExtensionDynamicTable($tableTribuTAmie, "golf");

                $tribu_T_Service->createTableComment($tableTribuTAmie, "golf_commentaire");

                $tribu_T_Service->createExtensionDynamicTable($tableTribuTFamille, "golf");

                $tribu_T_Service->createTableComment($tableTribuTFamille, "golf_commentaire");
            }

            $tribu_T_Service->creaTableTeamMessage($tableTribuTAmie);
            $tribu_T_Service->creaTableTeamMessage($tableTribuTFamille);

            // UPDATE TABLE PARRAINAGE
            $tribu_T_Service->createParrainageTable($userId);
            $userService->updateTableParrainage("tableparrainage_".$userId, $userId);

            ///// END NOTIFICATION ////

            return $authenticator->authenticateUser(
                $userToVerifie,
                $loginAuth,
                $request
            );
        }

        // return $this->redirectToRoute("connection");
        return $this->render("user/settingAccount.html.twig", [
            "form_inscription" => $form->createView(),
            "last_email" => $userToVerifie->getEmail(),
            "flash" => $flash,
            "pseudo" => $userToVerifie->getPseudo()
        ]);
    }




    #[Route(path: '/tribu/inscription', name: 'app_email_link_inscription')]
    public function emailLinkIncriptionAction(
        Request $request,
        MailService $mailService,
        UserRepository $userRepository,
        UserPasswordHasherInterface $passwordHasher,
        NotificationService $notificationService,
        MessageService $messageService,
        Tribu_T_Service $tribuTService,
        EntityManagerInterface $entityManager,
        VerifyEmailHelperInterface $verifyEmailHelper,
        CodeapeRepository $codeApeRep,
        AgendaService $agendaService,
        RequestingService $requesting,
        Status $status,
        UserService $userService
    ) {

        

        if ($this->getUser() ) {
            return $this->redirectToRoute("app_home");
        }

        if(!$request->query->get("email") || !$request->query->get("tribu")){
            return new Response("<strong>La syntaxe de la requête est erronée. Veuillez contacter l'administrateur du site. <strong>",400);
        }

        if($userRepository->findOneBy(["email" =>$request->query->get("email") ])){

            /**
             * update invitation story in tribu T
             * @author Elie <eliefenohasina@gmail.com>
             */ 

            $usr_to_confirm = $userRepository->findOneBy(["email" =>$request->query->get("email") ]);
            $tribuTService->updateInvitationStory($request->query->get("tribu").'_invitation', 1, $request->query->get("email"),$usr_to_confirm->getId());
             ///update status of the user in table tribu T
            $isTribuG = explode("_",$request->query->get("tribu"))[0] === "tribug";
            if(!$isTribuG)
                $tribuTService->confirmMemberTemp($request->query->get("tribu"), $usr_to_confirm->getId(), $usr_to_confirm->getEmail());

            /**
             * end Elie
             */

            return $this->redirectToRoute("app_accpeted_invitations");
        }

        $isTribuG = explode("_",$request->query->get("tribu"))[0] === "tribug";
        if($isTribuG){
            return $this->redirectToRoute('verification_filleul', ['tribu' => $request->query->get("tribu"),'email' => $request->query->get('email'), 'prtid' => $request->query->get('prtid')]);
        }
        //// check if this table tribu T exist
        if(!$tribuTService->isTableExist($request->query->get("tribu"))){
            return $this->redirectToRoute("app_home");
        }

        $form = $this->createFormBuilder()
            ->add('pseudo', TextType::class)
            ->add('email', EmailType::class,  ['data' => $request->query->get("email"), 'disabled' => true])
            ->add('password', PasswordType::class)
            ->add('confirmpassword', PasswordType::class)
            ->getForm();

        $flash = [];

        $form->handleRequest($request);
        if ($form->isSubmitted() && $form->isValid()) {

            ///data user.
            $data = $form->getData();
            $data["email"] = $request->query->get("email");

            $mailService->valid_email($data['email']);

            ///check the email if already exist
            // if ($userRepository->findOneBy(['email' => $data['email']])) {
            //     // dd("Email already exist.");

            //     $flash = [
            //         "titre" => "ERREUR",
            //         "content" => "Cette adresse e-mail est déjà associée à un compte."
            //     ];
            //     ///On quitte
            //     goto quit;
            // }
            $oldUser = null;
            ///check the email if already exist
            if ($userRepository->findOneBy(['email' => $data['email']])) {
                $userExist = $userRepository->findOneBy(['email' => $data['email']]);
                if($userExist->getType() == "Type"){
                    $oldUser = $userExist;
                }else{
                $flash = [
                    "titre" => "ERREUR",
                    "content" => "Cette adresse e-mail est déjà associée à un compte."
                ];
                }
            }

            ////valid password
            if (strcmp($data['password'], $data['confirmpassword']) != 0) {
                // dd("Password don't macth.");
                $flash = [
                    "titre" => "ERREUR",
                    "content" => "Votre mot de passe n'est pas le même."
                ];
                ///On quitte
                goto quit;
            } else if (strlen($data['password']) < 8) {
                $flash = [
                    "titre" => "ERREUR",
                    "content" => "Votre mot de passe est tros court."
                ];
                ///On quitte
                goto quit;
            }

            /// new instance for user.
            if($oldUser){
                $user = $oldUser;
            }else{
                /// new instance for user.
                $user = new User();
            }

            $user->setPseudo(trim($data['pseudo']));
            $user->setEmail(trim($data['email']));
            $user->setPassword($data['password']);
            $user->setVerifiedMail(true);
            $user->setRoles(["ROLE_USER"]);
            $user->setIsConnected(true);
            $user->setIdle(300);

            ///property temp
            $user->setType("Type");
            $user->setTablemessage("tablemessage");
            $user->setTablenotification("tablenotification");
            $user->setTablerequesting("tablerequesting");
            $user->setNomTableAgenda("agenda");
            $user->setNomTablePartageAgenda("partage_agenda");

            ///hash password
            $hashedPassword = $passwordHasher->hashPassword(
                $user,
                $user->getPassword()
            );
            $user->setPassword($hashedPassword);

            ///stock the user
            $entityManager->persist($user);
            $entityManager->flush();

            ///change the value temp
            $numero_table = $user->getId();
            $user->setTablemessage("tablemessage_" . $numero_table);
            $user->setTablenotification("tablenotification_" . $numero_table);
            $user->setTablerequesting("tablerequesting_" . $numero_table);
            $user->setNomTableAgenda("agenda_" . $numero_table);
            $user->setNomTablePartageAgenda("partage_agenda_" . $numero_table);



            ///create table dynamique
            $notificationService->createTable("tablenotification_" . $numero_table);
            $messageService->createTable("tablemessage_" . $numero_table);
            $this->requesting->createTable("tablerequesting_" . $numero_table);
            $agendaService->createTableAgenda("agenda_" . $numero_table);
            $agendaService->createTablePartageAgenda("partage_agenda_" . $numero_table);
            $agendaService->createAgendaStoryTable($numero_table);

            // $entityManager->persist($user);
            $entityManager->flush();

            

            ////name tribu to join
            $tribuTtoJoined= $request->query->get("tribu");
            $isTribuG = explode("_",$tribuTtoJoined)[0] === "tribug";                
            if(!$isTribuG){
            //// apropos user fondateur tribuT with user fondateur
            $userFondateurTribuT= $tribuTService->getTribuTInfo($tribuTtoJoined);

            $userPostID= $userFondateurTribuT["user_id"]; /// id of the user fondateur of this tribu T

            $data= json_decode($userFondateurTribuT["tribu_t_owned"], true); 
            $arrayTribuT= $data['tribu_t']; /// all tribu T for this user fondateur
            //dd($arrayTribuT);
            $apropos_tribuTtoJoined=[];
            if(count($arrayTribuT) > 0 &&  isset($arrayTribuT[0])){
                foreach($arrayTribuT as $tribuT){
                    if( $tribuT["name"] === $tribuTtoJoined ){ //// check the tribu T to join
                        $apropos_tribuTtoJoined= $tribuT;
                        break;
                    }
                }
            }else{
                //// check the tribu T to join
                $apropos_tribuTtoJoined= $arrayTribuT;
                    
                
            }
            

            //// set tribu T for this new user.
            $tribuTService->setTribuT(
                $apropos_tribuTtoJoined["name"], 
                $apropos_tribuTtoJoined["description"], 
                $apropos_tribuTtoJoined["logo_path"], 
                $apropos_tribuTtoJoined["extension"], 
                $numero_table,
                "tribu_t_joined", 
                $apropos_tribuTtoJoined["name_tribu_t_muable"]
            );
            
            // // update requesting table ,j'ai (faniry) commenté cette line parcequ'on a pas besoin de mettre à jour la table requesting
            // $tableRequestingNameOtherUser = $userRepository->find($userPostID)->getTablerequesting();
            // $requesting->setIsAccepted($tableRequestingNameOtherUser, $tribuTtoJoined, intval($userPostID), $numero_table);

            //// send notification for user send invitation.
            $content = $user->getEmail() . " a accepté l'invitation de rejoindre la tribu " . $tribuTtoJoined;
            // $type = "Invitation pour rejoindre la tribu " . $tribuTtoJoined;
            $notificationService->sendNotificationForOne($numero_table, intval($userPostID), "user/tribu/my-tribu-t", $content);


            ///update status of the user in table tribu T
            $tribuTService->confirmMemberTemp($request->query->get("tribu"), $user->getId(), $user->getEmail());
            
            
            ////Send email remerciement: Jehovanie RAMANDIRJOEL ////
            //// ajouter le 05-02-2024
            $user_sender = $userRepository->findOneBy(["id" => intval($userPostID)]);

            $mailService->sendEmailWithTemplatedEmail(
                $user->getEmail(),
                $user->getPseudo(),
                [
                    "object" => "Bienvenue dans notre communauté !",
                    "template" => "emails/mail_remerciement_inscription.html.twig",
                    "user_sender" => [
                        'fullname' => $user_sender->getPseudo(),
                        'email' => $user_sender->getEmail()
                    ]
                ]
            );
            //// email remerciement: Terminer //// 
            
        }
                   
            /**
             * Persist user on confidentiality table
             * @author Nantenaina        
             */
            $confidentiality = new Confidentiality();
            $confidentiality->setNotifIsActive(1);
            $confidentiality->setProfil(1);
            $confidentiality->setEmail(1);
            $confidentiality->setAmie(1);
            $confidentiality->setInvitation(1);
            $confidentiality->setPublication(1);
            $confidentiality->setUserId($numero_table);

            $entityManager->persist($confidentiality);
            $entityManager->flush();
            /*
            * @end Nantenaina     
            */

            //CREATE TABLE PARRAINAGE PUIS INSERER UNE NouVELLE LIGNE
            $tribuTService->createParrainageTable($numero_table);
            if($request->query->get("prtid"))
                $userService->saveOneParainOrFilleuil("tableparrainage_".$numero_table, $request->query->get("prtid"), $tribuTtoJoined, 0, 0);
            //// prepare email which we wish send
            $signatureComponents = $verifyEmailHelper->generateSignature(
                "verification_email", /// lien de revenir
                $user->getId(), /// id for user
                $user->getEmail(), /// email destionation use for verifier
                ['id' => $user->getId()] /// param id
            );

/**
             * update invitation story in tribu T
             * @author Elie <eliefenohasina@gmail.com>
             */ 
            if($isTribuG){
                $userService->updateInvitationStoryG($request->query->get("tribu").'_invitation', intval($request->query->get("prtid")), $request->query->get("email"), $numero_table);
            }else{
             $tribuTService->updateInvitationStory(
                $request->query->get("tribu").'_invitation', 
                1, 
                $request->query->get("email"),
                $user->getId());
            }
            /**
             * end Elie
             */

            /// redirect user to the inscription type------------///
            return $this->redirect($signatureComponents->getSignedUrl());
            ///-------------------------------------------------------///

        }

        quit:
        return $this->render("authenticator/emailLinkInscription.html.twig", [
            "form_inscription" => $form->createView(),
            "flash" => $flash,
            "codeApes" => $codeApeRep->getCode()
        ]);
    }

    #[Route(path:"/api/getAllCommune", name: "app_getAllCommune")]
    public function getAllCommuneAction(CommuneRepository $communeRepository){
        return $this->json([
            "commune" => $communeRepository->findAll(),
        ], 200);
    }


    #[Route(path:'/agenda/send/invitation', name:"app_agenda_send_invitation", methods:"POST")]
    public function sendLinkOnEmailAboutAgendaSharing(
        Request $request,
        SerializerInterface $serialize,
        MailService $mailService,
        AgendaService $agendaService,
        TributGService $tributGService,
        UserRepository $userRepository,
        EntityManagerInterface $entityManager,
        Filesystem $filesyst
        ){
        $context=[];
        $requestContent = json_decode($request->getContent(), true);
        $receivers=$requestContent["receiver"];
        $content=$requestContent["emailCore"];
        $piece_joint=$requestContent["files"];
        $user = $this->getUser();
        $userId = $user->getId();
        $fullNameSender = $tributGService->getFullName($userId);
        $piece_with_path = [];
        if (count($piece_joint) > 0) {
            // $path = $this->getParameter('kernel.project_dir') . '/public/uploads/users/photos/';
            $path = $this->getParameter('kernel.project_dir') . '/public/uploads/users/piece_joint/user_' . $userId . "/";
            $dir_exist = $filesyst->exists($path);
            if ($dir_exist === false) {
                $filesyst->mkdir($path, 0777);
            }

            foreach ($piece_joint as $item) {
                $name = $item["name"];

                $char_spec = ["-", " "];
                $name = str_replace($char_spec, "_", $name);
                $path_name = $path . $name;
                ///name file, file base64
                file_put_contents($path_name, file_get_contents($item["base64File"]));


                $item["path"] = $path . $name;

                array_push($piece_with_path, $item);
            }
        }
        
        foreach($receivers as $receiver){
                $agendaID = $receiver["agendaId"];
                $from_id=$receiver["from_id"];
                $to_id=$receiver["to_id"];
                $email_to=$receiver["email"];
                $nom=$receiver["lastname"];
                $prenom=$receiver["firstname"];
                $context["object_mail"]=$receiver["objet"];
                $context["template_path"]="emails/mail_invitation_agenda.html.twig";
                $context["link_confirm"]="";
                $context["content_mail"] = str_replace("/agenda/confirmation/".$agendaID,"/agenda/confirmation/".$userId."/".$to_id."/".$agendaID,$content);
                $context["piece_joint"] = $piece_with_path;
                $table_agenda_partage_name="partage_agenda_".$userId;
                if(!is_null($to_id)){
                $mailService->sendLinkOnEmailAboutAgendaSharing( $email_to,$nom." ".$prenom,$context, $fullNameSender);
                    $agendaService->setPartageAgenda($table_agenda_partage_name, $agendaID, ["userId"=>$to_id]);
                    $agendaService->addAgendaStory("agenda_".$userId."_story", $email_to, "Inscrit",$agendaID);
                }else{
                    if($userRepository->findOneBy(["email" => $email_to])){
                        $userTo = $userRepository->findOneBy(["email" => $email_to]);
                        $idUserTo = $userTo->getId();
                        $context["content_mail"] = str_replace("/agenda/confirmation/".$agendaID,"/agenda/confirmation/".$userId."/".$idUserTo."/".$agendaID,$content);
                        $mailService->sendLinkOnEmailAboutAgendaSharing( $email_to,$nom." ".$prenom,$context, $fullNameSender);
                        $agendaService->setPartageAgenda($table_agenda_partage_name, $agendaID, ["userId"=>$idUserTo]);
                        $agendaService->addAgendaStory("agenda_".$userId."_story", $email_to, "Inscrit",$agendaID);
                    }else{
                        // ADD USER TEMP
                        $userTemp = new User();
                        $idUserTo = $agendaService->insertUserTemp($userTemp, $email_to, time(), $userRepository, $entityManager);
                        $context["content_mail"] = str_replace("/agenda/confirmation/".$agendaID,"/agenda/confirmation/".$userId."/".$idUserTo."/".$agendaID,$content);
                        $mailService->sendLinkOnEmailAboutAgendaSharing( $email_to,$nom." ".$prenom,$context, $fullNameSender);
                        $agendaService->setPartageAgenda($table_agenda_partage_name, $agendaID, ["userId"=>$idUserTo]);
                        $agendaService->addAgendaStory("agenda_".$userId."_story", $email_to, "Inscrit",$agendaID);
                    }
                }
        }
        $r = $serialize->serialize(["response"=>"0k"], 'json');
        return new JsonResponse($r, 200, [], true);
    }

    #[Route(path: "/inscription/partenaire", name:"inscription_partenaire", methods: ["GET", "POST"])]
    public function inscriptionPartenaire(
        Request $request,
        Status $status,
        SupplierRepository $supplierRepo,
        UserRepository $userRepo,
        ConsumerRepository $consumerClient,
        Filesystem $filesyst,
        MailService $mailService
    ) {


        if ($this->getUser()) {
           
            ////CREATE NEW FORM TO COMPLETE USER PROFIL
            $flash = [];
    
            $form = $this->createForm(InscriptionPartenaireType::class);
    
            $form->handleRequest($request);

            if ($form->isSubmitted()) {
    
                ///set the data to table supplier
                extract($form->getData());
                $cusmerEntity=$consumerClient->findBy(['userId'=>$this->getUser()]);
                //dd( $cusmerEntity);
                $user_profil = new Supplier();
                $user_profil->setFirstname($cusmerEntity[0]->getFirstname());

                $user_profil->setLastname($cusmerEntity[0]->getLastname());
                $user_profil->setTributG($cusmerEntity[0]->getTributG());
                $user_profil->setCommerce($commerce);
                $user_profil->setCodeape($code_ape);
                $user_profil->setWebsite($site_web);
                $user_profil->setFacebook($facebook);
                $user_profil->setTwitter($twitter);
                $user_profil->setNumRue($num_rue);
                $user_profil->setTelephone($telephone);
                $user_profil->setCodePostal($code_postal);
                $user_profil->setCommune($nom_commune);
                $user_profil->setQuartier($quartier);
                $user_profil->setPays($pays);
                $user_profil->setTelFixe($telephone);
                $user_profil->setNomCommerce($nomCommerce);
                $user_profil->setEmailPro($mail_pro);
                $user_profil->setLinkedin($linkedin);
                $user_profil->setSiret($siret);
                $user_profil->setSiren($siren);
    
                ////set profil
                if( $profil){
                    ///path file folder
                    $path = $this->getParameter('kernel.project_dir') . '/public/uploads/users/photos/photo_user_' . $this->getUser()->getId() . "/";
                    $dir_exist = $filesyst->exists($path);
    
                    if ($dir_exist == false) {
                        $filesyst->mkdir($path, 0777);
                    }
    
                    $temp = explode(";", $profil );
                    $extension = explode("/", $temp[0])[1];
                    $image_name = "profil_". $cusmerEntity[0]->getFirstname() . "." . $extension;
    
                    ///save image in public/uploader folder
                    file_put_contents($path ."/". $image_name, file_get_contents($profil));
                    
                    ///set use profile
                    $user_profil->setPhotoProfil( '/uploads/users/photos/photo_user_' . $this->getUser()->getId() . "/" . $image_name);

                  
                }
    
                // $user_profil->setPhotoCouverture("photo de couverture");
                $user_profil->setUserId($this->getUser());
                $supplierRepo->add($user_profil,true);

                //update rôle of this user in user table after got supplier
               
              
                $session = $request->getSession();
                $session->set('demande-partenariat', false);
                $fullName = $cusmerEntity[0]->getLastname() . " " . $cusmerEntity[0]->getFirstname();
                $contenu = $fullName . " a terminé de remplir le formulaire de demande de partenariat.<br>
                Veuillez s'il vous plait approuver sa demande. Vous pouvez approuver sa demande dans le menu Super Admin de 
                CMZ puis dans la liste de demande de partenariat";
                $context["object_mail"] = "Demande d'approbation de partenariat";
                $context["template_path"] = "emails/mail_invitation_agenda.html.twig";
                $context["link_confirm"] = "" ;
                $context["content_mail"] = $contenu;
                $emailAdmin = $_ENV["SUPER_ADMIN_MAIL"];
                $nomComplet = $_ENV["FULLNAME"];
                $mailService->sendLinkOnEmailAboutAgendaSharing($emailAdmin, $nomComplet, $context);
                return $this->redirectToRoute('app_login');

            }

            $userConnected = $status->userProfilService($this->getUser());
    
            // return $this->redirectToRoute("connection");
            return $this->render("user/inscriptionPartenaire.html.twig", [
                "form_inscription" => $form->createView(),
                "last_email" => $this->getUser()->getEmail(),
                "flash" => $flash,
                "userConnected" => $userConnected,
                "pseudo" => $this->getUser()->getPseudo()
            ]);
        }else {
            $session = $request->getSession();
            $session->set('demande-partenariat', true);
            return $this->redirectToRoute('app_login');
        }
    }

    #[Route(path:'/proposition/partenariat/send/email', name:"proposition_partenariat_send_email", methods:"POST")]
    public function sendEmailPropositionPartenariat(
        Request $request,
        SerializerInterface $serialize,
        MailService $mailService,
        UserRepository $userRepository
        ){

        $context=[];

        $requestContent = json_decode($request->getContent(), true);
        $isAuto = $requestContent["generateAuto"];

        if($isAuto){

            $emailAdmin = $_ENV["SUPER_ADMIN_MAIL"];
            $nomComplet = $_ENV["FULLNAME"];
            $context["object_mail"] = $requestContent["objectEmail"];
            // $context["object_mail"] = "Demande de partenariat refusée";
            $context["template_path"] = "emails/mail_invitation_agenda.html.twig";
            $context["link_confirm"] = "" ;
            $context["content_mail"] = $requestContent["emailCore"];
            $mailService->sendLinkOnEmailAboutAgendaSharing($emailAdmin, $nomComplet, $context);
    
        }else{
            $content=$requestContent["emailCore"]; 
            if(isset($requestContent["email"])){
                $email_to = $requestContent["email"];
                $fullname = $requestContent["fullname"];
            } else{
                $email_to = $_ENV["SUPER_ADMIN_MAIL"];
                $fullname = $_ENV["FULLNAME"];
            }
            $context["object_mail"] = $requestContent["objectEmail"];
            $context["template_path"] = "emails/mail_invitation_agenda.html.twig";
            $context["link_confirm"] = "" ;
            $context["content_mail"] = $content;

            $mailService->sendLinkOnEmailAboutAgendaSharing($email_to, $fullname, $context);

            if(isset($requestContent["proposition"]) && $requestContent["proposition"] == true)
                $userRepository->updateByNameWhereIdis("statusDemandePartenariat",1,$this->getUser()->getId());
        }

        $r = $serialize->serialize(["response"=>"0k"], 'json');

        return new JsonResponse($r, 200, [], true);
    }

    #[Route(path:'/accept/proposition/partenariat/{isYes}', name:"accept_proposition_partenariat", methods:"POST")]
    public function acceptPropositionPartenariat(
        $isYes,
        Request $request,
        SerializerInterface $serialize,
        SupplierRepository $supplierRepository,
        UserRepository $userRepository
        ){

        $requestContent = json_decode($request->getContent(), true);

        $userId = $requestContent["userId"];

        if($isYes == 1){
            $supplierRepository->updateByNameWhereIdis("isVerifiedTributGAdmin",1,$userId);
            $userRepository->updateByNameWhereIdis("type","supplier",$userId);
            $userRepository->updateByNameWhereIdis("statusDemandePartenariat",2,$userId);
        }else{
            $supplierRepository->updateByNameWhereIdis("isVerifiedTributGAdmin",-1,$userId);
            $userRepository->updateByNameWhereIdis("statusDemandePartenariat",0,$userId);
        }

        $r = $serialize->serialize(["response"=>"0k"], 'json');

        return new JsonResponse($r, 200, [], true);
    }

#[Route(path: "/verification/filleul/old", name:"verification_filleul_old", methods: ["GET", "POST"])]
    public function verificationFilleulOld(
        Request $request,
        Status $status,
        UserRepository $userRepository,
        NotificationService $notificationService,
        TributGService $tributGService,
        EntityManagerInterface $entityManager,
        UserAuthenticatorInterface $authenticator,
        UserAuthenticator $loginAuth,
        VerifyEmailHelperInterface $verifyEmailHelper,
        Filesystem $filesyst,
        ConsumerRepository $consumerRepository,
        SupplierRepository $supplierRepository,
        Tribu_T_Service $tribu_T_Service,
        UserService $userService
    ) {
        ///to get info
        ///id de l'utilisateur.
        $userToVerifie = $userRepository->find($request->query->get('id'));

        if ($this->getUser()) {
            $userConnected= $status->userProfilService($this->getUser());
            if( $userConnected["userType"] !== "Type"){
                return $this->redirectToRoute('app_home');
            }
        }


        if (!$userToVerifie) {
            throw $this->createNotFoundException();
        }


        ///change the to true the email verified
        $userToVerifie->setVerifiedMail(true);  ///get the user from database by id

        $tableParrainage = "tableparrainage_".$request->query->get('id');
        $rowParain = $userService->getParainG($tableParrainage);
        if(count($rowParain) < 1){
            return $this->redirectToRoute('app_login');
        }


        $idParain = $rowParain[0]["user_id"];

        $tribuGParainInfos = $userService->getTribuGParainInfo($idParain);

        // dd($tribuGParainInfos);

        ////CREATE NEW FORM TO COMPLETE USER PROFIL
        $flash = [];

        $form = $this->createForm(InscriptionFilleulType::class);
      
        $form->handleRequest($request);
        if ($form->isSubmitted()) {
            ///get the data
            extract($form->getData());
         
            if( $consumerRepository->findOneBy(["userId" => $this->getUser() ]) ||  $supplierRepository->findOneBy(["userId" => $this->getUser() ]) ){
                return $authenticator->authenticateUser( $userToVerifie, $loginAuth, $request );
            }

            /// if the user is consumer
            if ($Consommateur && !$Fournisseur) {

                $user_profil = new Consumer();
                $userToVerifie->setType("consumer");

                ///the user is supplier
            } else {

                $user_profil = new Supplier();
                $user_profil->setCommerce($commerce);
                $user_profil->setCodeape($code_ape);
                $user_profil->setWebsite($site_web);
                $user_profil->setFacebook($facebook);
                $user_profil->setTwitter($twitter);
                $userToVerifie->setType("supplier");

            }

            $user_profil->setFirstname($nom);
            $user_profil->setLastname($prenom);//$tribuGParainInfos["num_rue"]
            $user_profil->setNumRue($tribuGParainInfos["num_rue"]);
            $user_profil->setTelephone($telephone);
            $user_profil->setCodePostal($tribuGParainInfos["code_postal"]);
            $user_profil->setCommune($tribuGParainInfos["commune"]);
            $user_profil->setPays($tribuGParainInfos["pays"]);

            if( $telephone ){
                $user_profil->setTelFixe($telephone);
            }else{
                $user_profil->setTelFixe("");
            }

            $user_profil->setQuartier($tribuGParainInfos["quartier"]);

            $departement = substr($tribuGParainInfos["code_postal"],0,-3);

            $user_profil->setTributg($tribuGParainInfos["tributg"]);


            ////set profil
            if( $profil ){
                ///path file folder
                $path = $this->getParameter('kernel.project_dir') . '/public/uploads/users/photos/photo_user_' . $userToVerifie->getId() . "/";
                $dir_exist = $filesyst->exists($path);

                if ($dir_exist == false) {
                    $filesyst->mkdir($path, 0777);
                }

                $temp = explode(";", $profil );
                $extension = explode("/", $temp[0])[1];
                $image_name = "profil_". $nom . "." . $extension;

                ///save image in public/uploader folder
                file_put_contents($path ."/". $image_name, file_get_contents($profil));
                
                ///set use profile
                $user_profil->setPhotoProfil( '/uploads/users/photos/photo_user_' . $userToVerifie->getId() . "/" . $image_name);
            }

            // $user_profil->setPhotoCouverture("photo de couverture");

            $user_profil->setUserId($userToVerifie);

            $user_profil->setIsVerifiedTributGAdmin(0);

            $user_profil->setTributg($tribuGParainInfos["tributg"]);

            ///attribution des tribut.
            $resultat = $tributGService->createTableTributG($tribuGParainInfos["tributg"], $userToVerifie->getId());

            ///save the user information
            $entityManager->persist($user_profil);
            $entityManager->flush();

            $userService->updateInvitationStoryG($tribuGParainInfos["tributg"].'_invitation', $tribuGParainInfos["user_id"], $userToVerifie->getEmail(), $userToVerifie->getId(), 1);

            ////  NOTIFICATION

            ///switch type of the notification
            $notification = [
                "admin" => "Nous vous informons qu'une nouvelle tribu G a été créée.",
                "fondateur" => "Nous avons un grand plaisir de vous annoncer que la tribu G selon votre code postal a été créée et vous êtes l'administrateur provisoire.",
                "current" => "Nous avons un grand plaisir de vous avoir parmi nous dans la tribu G d'après votre code postal. De la part de tous les membres et la direction, nous aimerions présenter nos salutations cordiales et la bonne chance.",
                "other" => "Nous avons un grand plaisir de vous annonce que notre tribu G a un nouveau fan."
            ];



            $type = "/user/account";
            $all_user_sending_notification = $tributGService->getAllTributG($user_profil->getTributG()); /// [ ["user_id" => 1], ... ]

            foreach ($all_user_sending_notification as $user_to_send_notification) { ///["user_id" => 1]
                
                $user_id_post = intval($user_to_send_notification["user_id"]);
                if ($user_id_post === $userToVerifie->getId()) { ///current user connecter

                    if ($resultat == 0) {

                        $message_notification = $notification["fondateur"];
                    } else {

                        $message_notification = $notification["current"];
                    }
                } else {
                    // $message_notification = $notification["other"] . "<br/> <a class='d-block w-50 mx-auto btn btn-primary text-center' href='/user/profil/" .  $request->query->get('id') . "' alt='Nouvelle membre'>Voir son profil</a>";
                    $message_notification = $notification["other"];
                }

                $notificationService->sendNotificationForOne(
                    $userToVerifie->getId(),
                    $user_id_post,
                    $type,
                    $message_notification
                );
            }

            ////notification for super admin
            if ($userRepository->findByRolesUserSuperAdmin() && $resultat == 0) {

                $super_admin = $userRepository->findByRolesUserSuperAdmin();
                // $message_notification = $notification["admin"] . "<br/> <a class='d-block w-50 mx-auto btn btn-primary text-center' href='/user/dashboard-membre?table=" .  $name_tributG . "' alt='Nouvelle membre'>Valider</a>";
                $message_notification = $notification["admin"];

                $notificationService->sendNotificationForOne(
                    $userToVerifie->getId(),
                    $super_admin->getId(),
                    $type,
                    $message_notification,
                );
            }

            // Générer des tribus T ami et famille
            $userId = $request->query->get('id');
            $suffixeTableTribuTAmie = "A";
            $suffixeTableTribuTFamille = "F";
            $tableTribuTAmie = "tribu_t_" . $userId . "_" .$suffixeTableTribuTAmie;
            $tableTribuTFamille = "tribu_t_" . $userId . "_" .$suffixeTableTribuTFamille;
            $nomTribuTAmie = "Tribu A";
            $descriptionTribuTAmie = "Tribu T pour mes amis";
            $nomTribuTFamille = "Tribu F";
            $descriptionTribuTFamille = "Tribu T pour ma famille";
            $tribu_T_Service->createTribuTable($suffixeTableTribuTAmie, $userId, $nomTribuTAmie, $descriptionTribuTAmie);
            $tribu_T_Service->createTribuTable($suffixeTableTribuTFamille, $userId, $nomTribuTFamille, $descriptionTribuTFamille);

            $extension = [];
            $extension["restaurant"] = 1;
            $extension["golf"] = 1;
            if(!$tribu_T_Service->checkIfTribuTExist($tableTribuTAmie, $userId, "tribu_t_owned"))
                $tribu_T_Service->setTribuT($tableTribuTAmie, $descriptionTribuTAmie, "", $extension, $userId, "tribu_t_owned", $nomTribuTAmie);
            
            if(!$tribu_T_Service->checkIfTribuTExist($tableTribuTFamille, $userId, "tribu_t_owned"))
                $tribu_T_Service->setTribuT($tableTribuTFamille, $descriptionTribuTFamille, "", $extension, $userId, "tribu_t_owned", $nomTribuTFamille);
            
            if ($extension["restaurant"] == 1) {

                $tribu_T_Service->createExtensionDynamicTable($tableTribuTAmie, "restaurant");

                $tribu_T_Service->createTableComment($tableTribuTAmie, "restaurant_commentaire");

                $tribu_T_Service->createExtensionDynamicTable($tableTribuTFamille, "restaurant");

                $tribu_T_Service->createTableComment($tableTribuTFamille, "restaurant_commentaire");
            }

            if ($extension["golf"] == 1) {

                $tribu_T_Service->createExtensionDynamicTable($tableTribuTAmie, "golf");

                $tribu_T_Service->createTableComment($tableTribuTAmie, "golf_commentaire");

                $tribu_T_Service->createExtensionDynamicTable($tableTribuTFamille, "golf");

                $tribu_T_Service->createTableComment($tableTribuTFamille, "golf_commentaire");
            }

            $tribu_T_Service->creaTableTeamMessage($tableTribuTAmie);
            $tribu_T_Service->creaTableTeamMessage($tableTribuTFamille);

            // UPDATE TABLE PARRAINAGE
            $tribu_T_Service->createParrainageTable($userId);
            $userService->updateTableParrainage("tableparrainage_".$userId, $userId);

            ///// END NOTIFICATION ////

            return $authenticator->authenticateUser(
                $userToVerifie,
                $loginAuth,
                $request
            );
        }

        // return $this->redirectToRoute("connection");
        return $this->render("user/settingFilleul.html.twig", [
            "form_inscription" => $form->createView(),
            "last_email" => $userToVerifie->getEmail(),
            "flash" => $flash,
            "pseudo" => $userToVerifie->getPseudo()
        ]);
    }

    #[Route(path: "/verification/filleul", name:"verification_filleul", methods: ["GET", "POST"])]
    public function verificationFilleul(
        Request $request,
        Status $status,
        UserRepository $userRepository,
        NotificationService $notificationService,
        TributGService $tributGService,
        UserPasswordHasherInterface $passwordHasher,
        EntityManagerInterface $entityManager,
        UserAuthenticatorInterface $authenticator,
        UserAuthenticator $loginAuth,
        Filesystem $filesyst,
        Tribu_T_Service $tribu_T_Service,
        UserService $userService,
        MessageService $messageService,
        AgendaService $agendaService,
    ) {

        $userToVerifie = null;
        if ($this->getUser()) {
            $userConnected= $status->userProfilService($this->getUser());
            if( $userConnected["userType"] !== "Type"){
                return $this->redirectToRoute('app_home');
            }
        }

        $tribuG = $request->query->get("tribu");
        $emailToVerifie = $request->query->get('email');
        $parentId = $request->query->get('prtid');
        if($tribuG && $emailToVerifie && $parentId){
            $userToVerifie = $userRepository->findOneBy(["email"=>$emailToVerifie]);
            if($userToVerifie){
                return $this->redirectToRoute("app_accpeted_invitations");
            }else{
                
                $idParain = $parentId;

                $tribuGParainInfos = $userService->getTribuGParainInfo($idParain);


                ////CREATE NEW FORM TO COMPLETE USER PROFIL
                $flash = [];

                $form = $this->createForm(InscriptionFilleulType::class);
            
                $form->handleRequest($request);
                if ($form->isSubmitted()) {
                    ///get the data
                    extract($form->getData());

                    $userToVerifie = new User();
                    ///change the to true the email verified
                    $userToVerifie->setVerifiedMail(true);  ///get the user from database by id
                    $userToVerifie->setEmail($email);
                    $userToVerifie->setPseudo($pseudo);
                    $userToVerifie->setPassword($password);
                    $userToVerifie->setRoles(["ROLE_USER"]);
                    $hashedPassword = $passwordHasher->hashPassword(
                        $userToVerifie,
                        $userToVerifie->getPassword()
                    );
                    $userToVerifie->setPassword($hashedPassword);

                    ///DEBUT
                    $userToVerifie->setIsConnected(true);
                    $userToVerifie->setIdle(300);
                    $userToVerifie->setTablemessage("tablemessage");
                    $userToVerifie->setTablenotification("tablenotification");
                    $userToVerifie->setTablerequesting("tablerequesting");
                    $userToVerifie->setNomTableAgenda("agenda");
                    $userToVerifie->setNomTablePartageAgenda("partage_agenda");

                    ///FIN

                    /// if the user is consumer
                    if ($Consommateur && !$Fournisseur) {
                        $userToVerifie->setType("consumer");
                    } else {
                        $userToVerifie->setType("supplier");
                    }

                    $entityManager->persist($userToVerifie);
                    $entityManager->flush();

                    $userId = $userToVerifie->getId();

                    $userToVerifie->setTablemessage("tablemessage_" . $userId);
                    $userToVerifie->setTablenotification("tablenotification_" . $userId);
                    $userToVerifie->setTablerequesting("tablerequesting_" . $userId);
                    $userToVerifie->setNomTableAgenda("agenda_" . $userId);
                    $userToVerifie->setNomTablePartageAgenda("partage_agenda_" . $userId);
                    $entityManager->flush();


                    ///create table dynamique
                    $notificationService->createTable("tablenotification_" . $userId);
                    $messageService->createTable("tablemessage_" . $userId);
                    $this->requesting->createTable("tablerequesting_" . $userId);
                    $agendaService->createTableAgenda("agenda_" . $userId);
                    $agendaService->createTablePartageAgenda("partage_agenda_" . $userId);
                    $agendaService->createAgendaStoryTable($userId);

                    if ($Consommateur && !$Fournisseur) {
                        $user_profil = new Consumer();
                    } else {
                        $user_profil = new Supplier();
                        $user_profil->setCommerce($commerce);
                        $user_profil->setCodeape($code_ape);
                        $user_profil->setWebsite($site_web);
                        $user_profil->setFacebook($facebook);
                        $user_profil->setTwitter($twitter);
                    }

                    $user_profil->setFirstname($nom);
                    $user_profil->setLastname($prenom);//$tribuGParainInfos["num_rue"]
                    $user_profil->setNumRue($tribuGParainInfos["num_rue"]);
                    $user_profil->setTelephone($telephone);
                    $user_profil->setCodePostal($tribuGParainInfos["code_postal"]);
                    $user_profil->setCommune($tribuGParainInfos["commune"]);
                    $user_profil->setPays($tribuGParainInfos["pays"]);

                    if( $telephone ){
                        $user_profil->setTelFixe($telephone);
                    }else{
                        $user_profil->setTelFixe("");
                    }

                    $user_profil->setQuartier($tribuGParainInfos["quartier"]);

                    $departement = substr($tribuGParainInfos["code_postal"],0,-3);

                    $user_profil->setTributg($tribuGParainInfos["tributg"]);


                    ////set profil
                    if( $profil ){
                        ///path file folder
                        $path = $this->getParameter('kernel.project_dir') . '/public/uploads/users/photos/photo_user_' . $userId . "/";
                        $dir_exist = $filesyst->exists($path);

                        if ($dir_exist == false) {
                            $filesyst->mkdir($path, 0777);
                        }

                        $temp = explode(";", $profil );
                        $extension = explode("/", $temp[0])[1];
                        $image_name = "profil_". $nom . "." . $extension;

                        ///save image in public/uploader folder
                        file_put_contents($path ."/". $image_name, file_get_contents($profil));
                        
                        ///set use profile
                        $user_profil->setPhotoProfil( '/uploads/users/photos/photo_user_' . $userId . "/" . $image_name);
                    }

                    $user_profil->setUserId($userToVerifie);

                    $user_profil->setIsVerifiedTributGAdmin(0);

                    $user_profil->setTributg($tribuGParainInfos["tributg"]);

                    ///attribution des tribut.
                    $resultat = $tributGService->createTableTributG($tribuGParainInfos["tributg"], $userId);

                    ///save the user information
                    $entityManager->persist($user_profil);
                    $entityManager->flush();

                    $userService->updateInvitationStoryG($tribuGParainInfos["tributg"].'_invitation', $tribuGParainInfos["user_id"], $email, $userId, 1);

                    ////  NOTIFICATION

                    ///switch type of the notification
                    $notification = [
                        "admin" => "Nous vous informons qu'une nouvelle tribu G a été créée.",
                        "fondateur" => "Nous avons un grand plaisir de vous annoncer que la tribu G selon votre code postal a été créée et vous êtes l'administrateur provisoire.",
                        "current" => "Nous avons un grand plaisir de vous avoir parmi nous dans la tribu G d'après votre code postal. De la part de tous les membres et la direction, nous aimerions présenter nos salutations cordiales et la bonne chance.",
                        "other" => "Nous avons un grand plaisir de vous annonce que notre tribu G a un nouveau fan."
                    ];

                    $type = "/user/account";
                    $all_user_sending_notification = $tributGService->getAllTributG($user_profil->getTributG()); /// [ ["user_id" => 1], ... ]

                    foreach ($all_user_sending_notification as $user_to_send_notification) { ///["user_id" => 1]
                        
                        $user_id_post = intval($user_to_send_notification["user_id"]);
                        if ($user_id_post === $userId) { ///current user connecter

                            if ($resultat == 0) {

                                $message_notification = $notification["fondateur"];
                            } else {

                                $message_notification = $notification["current"];
                            }
                        } else {
                            // $message_notification = $notification["other"] . "<br/> <a class='d-block w-50 mx-auto btn btn-primary text-center' href='/user/profil/" .  $request->query->get('id') . "' alt='Nouvelle membre'>Voir son profil</a>";
                            $message_notification = $notification["other"];
                        }

                        $notificationService->sendNotificationForOne(
                            $userId,
                            $user_id_post,
                            $type,
                            $message_notification
                        );
                    }

                    ////notification for super admin
                    if ($userRepository->findByRolesUserSuperAdmin() && $resultat == 0) {

                        $super_admin = $userRepository->findByRolesUserSuperAdmin();
                        // $message_notification = $notification["admin"] . "<br/> <a class='d-block w-50 mx-auto btn btn-primary text-center' href='/user/dashboard-membre?table=" .  $name_tributG . "' alt='Nouvelle membre'>Valider</a>";
                        $message_notification = $notification["admin"];

                        $notificationService->sendNotificationForOne(
                            $userId,
                            $super_admin->getId(),
                            $type,
                            $message_notification,
                        );
                    }

                    // Générer des tribus T ami et famille
                    $suffixeTableTribuTAmie = "A";
                    $suffixeTableTribuTFamille = "F";
                    $tableTribuTAmie = "tribu_t_" . $userId . "_" .$suffixeTableTribuTAmie;
                    $tableTribuTFamille = "tribu_t_" . $userId . "_" .$suffixeTableTribuTFamille;
                    $nomTribuTAmie = "Tribu A";
                    $descriptionTribuTAmie = "Tribu T pour mes amis";
                    $nomTribuTFamille = "Tribu F";
                    $descriptionTribuTFamille = "Tribu T pour ma famille";
                    $tribu_T_Service->createTribuTable($suffixeTableTribuTAmie, $userId, $nomTribuTAmie, $descriptionTribuTAmie);
                    $tribu_T_Service->createTribuTable($suffixeTableTribuTFamille, $userId, $nomTribuTFamille, $descriptionTribuTFamille);

                    $extension = [];
                    $extension["restaurant"] = 1;
                    $extension["golf"] = 1;
                    if(!$tribu_T_Service->checkIfTribuTExist($tableTribuTAmie, $userId, "tribu_t_owned"))
                        $tribu_T_Service->setTribuT($tableTribuTAmie, $descriptionTribuTAmie, "", $extension, $userId, "tribu_t_owned", $nomTribuTAmie);
                    
                    if(!$tribu_T_Service->checkIfTribuTExist($tableTribuTFamille, $userId, "tribu_t_owned"))
                        $tribu_T_Service->setTribuT($tableTribuTFamille, $descriptionTribuTFamille, "", $extension, $userId, "tribu_t_owned", $nomTribuTFamille);
                    
                    if ($extension["restaurant"] == 1) {

                        $tribu_T_Service->createExtensionDynamicTable($tableTribuTAmie, "restaurant");

                        $tribu_T_Service->createTableComment($tableTribuTAmie, "restaurant_commentaire");

                        $tribu_T_Service->createExtensionDynamicTable($tableTribuTFamille, "restaurant");

                        $tribu_T_Service->createTableComment($tableTribuTFamille, "restaurant_commentaire");
                    }

                    if ($extension["golf"] == 1) {

                        $tribu_T_Service->createExtensionDynamicTable($tableTribuTAmie, "golf");

                        $tribu_T_Service->createTableComment($tableTribuTAmie, "golf_commentaire");

                        $tribu_T_Service->createExtensionDynamicTable($tableTribuTFamille, "golf");

                        $tribu_T_Service->createTableComment($tableTribuTFamille, "golf_commentaire");
                    }

                    $tribu_T_Service->creaTableTeamMessage($tableTribuTAmie);
                    $tribu_T_Service->creaTableTeamMessage($tableTribuTFamille);

                    // CREATE TABLE PARRAINAGE
                    $tribu_T_Service->createParrainageTable($userId);
                    $tableParrainageFilleul = "tableparrainage_".$userId;
                    $tableParrainageParrain = "tableparrainage_".$idParain;
                    $userService->saveOneParainOrFilleuil($tableParrainageFilleul, $idParain, $tribuGParainInfos["tributg"], 0, 1);
                    $userService->saveOneParainOrFilleuil($tableParrainageParrain, $userId, $tribuGParainInfos["tributg"], 1, 1);
                    
                    return $authenticator->authenticateUser(
                        $userToVerifie,
                        $loginAuth,
                        $request
                    );
                }
            }
        }else{
            return $this->redirectToRoute('app_home');
        }

        return $this->render("user/settingFilleul.html.twig", [
            "form_inscription" => $form->createView(),
            "last_email" => $emailToVerifie,
            "pseudo" => "Pseudo",
            //"flash" => $flash,
            "flash" => $flash
        ]);
    }

}
