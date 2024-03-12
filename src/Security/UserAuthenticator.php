<?php



namespace App\Security;



use App\Entity\Consumer;

use App\Entity\Supplier;

use App\Entity\User;
use App\Repository\UserRepository;
use App\Service\TributGService;

use Doctrine\ORM\EntityManagerInterface;

use RuntimeException;
use App\Service\ConfidentialityService;
use Symfony\Component\HttpFoundation\Request;

use Symfony\Component\Security\Core\Security;

use Symfony\Component\HttpFoundation\Response;

use Symfony\Component\HttpFoundation\RedirectResponse;

use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

use Symfony\Component\Security\Http\Util\TargetPathTrait;

use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

use Symfony\Component\Security\Core\Exception\UserNotFoundException;

use Symfony\Component\Security\Http\Authenticator\Passport\Passport;

use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;

use Symfony\Component\Security\Http\Authenticator\Passport\Badge\UserBadge;

use Symfony\Component\Security\Http\Authenticator\Passport\Badge\CsrfTokenBadge;

use Symfony\Component\Security\Http\Authenticator\AbstractLoginFormAuthenticator;

use Symfony\Component\Security\Http\Authenticator\Passport\Badge\RememberMeBadge;

use Symfony\Component\Security\Http\Authenticator\Passport\Credentials\PasswordCredentials;

use Symfony\Component\Security\Core\Exception\CustomUserMessageAuthenticationException;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\HttpFoundation\JsonResponse;
use App\Service\Tribu_T_Service;
use App\Service\UserService;
use Twig\Environment;

class UserAuthenticator extends AbstractLoginFormAuthenticator

{

    use TargetPathTrait;



    public const LOGIN_ROUTE = 'app_login';



    private UrlGeneratorInterface $urlGenerator;
    private $entityManager;
    private $trib;
    private $passwordHasher;
    private $userRepository;
    private $userService;
    private $confidentialityService;
    private $twig;
    public function __construct(
        UrlGeneratorInterface $urlGenerator,

        EntityManagerInterface $em,

        TributGService $trib,

        UserPasswordHasherInterface $passwordHasher,
        UserRepository $userRepository,

        UserService $userService,
        ConfidentialityService $confidentialityService,
        Environment $twig
    ) {

        $this->urlGenerator = $urlGenerator;

        $this->entityManager = $em;

        $this->trib = $trib;

        $this->passwordHasher = $passwordHasher;

        $this->userRepository = $userRepository;

        $this->userService = $userService;
        $this->confidentialityService = $confidentialityService;
        $this->twig=$twig;
    }


 
    public function authenticate(Request $request): Passport

    {

        $email = $request->request->get('email', '');



        $request->getSession()->set(Security::LAST_USERNAME, $email);





        return new Passport(

            new UserBadge($email, function ($userIdentifier) use (&$request) {



                $isBanished = false;
                $isSuspendre = false;

                $user = $this->entityManager

                    ->getRepository(User::class)

                    ->findOneBy(['email' => $userIdentifier]);





                if ($user != null) {

                    $userType = $user->getType();

                    $userId = $user->getId();

                    if ($userType == "consumer") {

                        $profil = $this->entityManager->getRepository(Consumer::class)->findByUserId($userId);
                    } else {

                        $profil = $this->entityManager->getRepository(Supplier::class)->findByUserId($userId);
                    }

                    if (count($profil) !== 0) {
                        $tribuG = $profil[0]->getTributG();
                        $isBanished = (bool)$this->trib->getBanishedStatus($tribuG, $userId);
                        $isSuspendre = (bool)$this->trib->getSuspenduStatus($tribuG, $userId);
                        $isValidAdmin = (bool)$this->trib->isValidParAdmin($tribuG);
                        $isValidFondateur = (bool)$this->trib->isValidParFondateur($tribuG, $userId);
                    }
                }





                if (!$user) {

                    throw new CustomUserMessageAuthenticationException("Votre email n'est pas encore enregistré.");
                } else if (!$user->isVerifiedMail()) {

                    throw new CustomUserMessageAuthenticationException("e-mail non vérifié");
                } else if ($isBanished) {

                    throw new CustomUserMessageAuthenticationException("Vous avez été radié de votre tribu, veuillez contacter votre administrateur.");
                } else if ($isSuspendre) {

                    throw new CustomUserMessageAuthenticationException("Vous avez été suspendu de votre tribu, veuillez contacter votre administrateur.");
                } else if (!$this->passwordHasher->isPasswordValid($user, $request->request->get('password'))) {

                    throw new CustomUserMessageAuthenticationException("Mot de passe incorrecte");
                }else if(!$isValidAdmin){

                    throw new CustomUserMessageAuthenticationException("Votre inscription à la tribu G est en attente de validation.". 
                    "Veuillez contacter l'administrateur pour finaliser votre inscription.");
                } else if(!$isValidFondateur){
                    
                   
                    throw new CustomUserMessageAuthenticationException("Pour rejoindre la tribu G, vous devez obtenir l'approbation de l'administrateur." .
                    "Veuillez le contacter pour qu'il examine votre demande.");
                   
                }

                return $user;
            }),

            new PasswordCredentials($request->request->get('password')),

            [

                new RememberMeBadge(),

                //new CsrfTokenBadge('authenticate', $request->request->get('_csrf_token'))

            ]

        );
    }



    public function onAuthenticationSuccess(Request $request, TokenInterface $token, string $firewallName): ?Response
    {

        $tribu_T_Service = new Tribu_T_Service();
        $tribu_G_Service = new TributGService();
        $user = $token->getUser();

        $user->setIsConnected(1);
        ///stock the user
        $this->entityManager->persist($user);
        $this->entityManager->flush();

        // Générer des tribus T ami et famille
        $userId =  $user->getId();
        $canGenerateTribuTAmie = $tribu_T_Service->checkIfDefaultTribuTExist($userId, "A") > 0 ? false : true;
        $canGenerateTribuTFamille = $tribu_T_Service->checkIfDefaultTribuTExist($userId, "F") > 0 ? false : true;

        if ($canGenerateTribuTAmie && $canGenerateTribuTFamille) {
            $suffixeTableTribuTAmie = "A";
            $suffixeTableTribuTFamille = "F";
            $tableTribuTAmie = "tribu_t_" . $userId . "_" . $suffixeTableTribuTAmie;
            $tableTribuTFamille = "tribu_t_" . $userId . "_" . $suffixeTableTribuTFamille;
            $nomTribuTAmie = "Tribu A";
            $descriptionTribuTAmie = "Tribu T pour mes amis";
            $nomTribuTFamille = "Tribu F";
            $descriptionTribuTFamille = "Tribu T pour ma famille";
            $tribu_T_Service->createTribuTable($suffixeTableTribuTAmie, $userId, $nomTribuTAmie, $descriptionTribuTAmie);
            $tribu_T_Service->createTribuTable($suffixeTableTribuTFamille, $userId, $nomTribuTFamille, $descriptionTribuTFamille);

            $extension = [];

            $extension["restaurant"] = 1;

            $extension["golf"] = 1;

            $tribu_T_Service->setTribuT($tableTribuTAmie, $descriptionTribuTAmie, "", $extension, $userId, "tribu_t_owned", $nomTribuTAmie);

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
        }

        $tribu_T_Service->createParrainageTable($userId);

        if ($user->getType() != "Type") {
            $tribu_G_Service->createInvitationTableG($userId);

            $user = $this->userRepository->findOneById($userId);
            $tibutTOwneds = json_decode($user->getTribuT($userId), true);
            $tibutTJoineds = json_decode($user->getTribuTJoined($userId), true);

            // dump( $tibutTOwneds);
            // dd($tibutTJoineds);
            $tribu_T_Service->createTableAlbumNotExists($tibutTOwneds);
            $tribu_T_Service->createTableAlbumNotExists($tibutTJoineds);
            // $tibutTJoined
            $this->confidentialityService->generateConfidentiality($userId);

            $tribu_T_Service->createTableDropBox($userId);
        }

        // return new RedirectResponse($this->urlGenerator->generate('app_account'));
        $session = $request->getSession();
        if ($session->get("demande-partenariat")) {
            return new RedirectResponse($this->urlGenerator->generate('inscription_partenaire'));
        } else {
            return new RedirectResponse($this->urlGenerator->generate('app_account'));
        }
    }



    protected function getLoginUrl(Request $request): string

    {

        return $this->urlGenerator->generate(self::LOGIN_ROUTE);
    }

    public function onAuthenticationFailure(Request $request, AuthenticationException $exception): Response
    {
        $data = [
            // you may want to customize or obfuscate the message first
            'message' => strtr($exception->getMessageKey(), $exception->getMessageData())

            // or to translate this message
            // $this->translator->trans($exception->getMessageKey(), $exception->getMessageData())
        ];
       
        
        return new Response($this->twig->render("reponse_auto.html.twig",[
            "link"=>"app_login",
            "title"=>"Revenir vers la page de connexion",
            "contents"=>$exception->getMessageKey()
        ]));
    }
}
