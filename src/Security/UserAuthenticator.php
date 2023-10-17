<?php



namespace App\Security;



use App\Entity\Consumer;

use App\Entity\Supplier;

use App\Entity\User;

use App\Service\TributGService;

use Doctrine\ORM\EntityManagerInterface;

use RuntimeException;

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

class UserAuthenticator extends AbstractLoginFormAuthenticator

{

    use TargetPathTrait;



    public const LOGIN_ROUTE = 'app_login';



    private UrlGeneratorInterface $urlGenerator;



    public function __construct(UrlGeneratorInterface $urlGenerator, 

    EntityManagerInterface $em, 

    TributGService $trib,

    UserPasswordHasherInterface $passwordHasher)

    {

        $this->urlGenerator = $urlGenerator;

        $this->entityManager = $em;

        $this->trib = $trib;

        $this->passwordHasher = $passwordHasher;

    }



    public function authenticate(Request $request): Passport

    {

        $email = $request->request->get('email', '');



        $request->getSession()->set(Security::LAST_USERNAME, $email);

       

       

        return new Passport(

            new UserBadge($email, function($userIdentifier) use (&$request){

                

                    $isBanished=false;

                    $user = $this->entityManager

                    ->getRepository(User::class)

                    ->findOneBy(['email' => $userIdentifier]);

                    

                    

                    if($user!=null){

                        $userType = $user->getType();

                        $userId = $user->getId();

                        if ($userType == "consumer") {

                            $profil = $this->entityManager->getRepository(Consumer::class)->findByUserId($userId);

                        } else {

                            $profil = $this->entityManager->getRepository(Supplier::class)->findByUserId($userId);

                        }
                        
                        if( count($profil) !== 0 ){
                            $tribuG = $profil[0]->getTributG();
                            $isBanished = (bool)$this->trib->getBanishedStatus($tribuG, $userId);
                        }

                    }

                   

                  

                    if (!$user) {

                        throw new CustomUserMessageAuthenticationException("Votre email n'est pas encore enregistré.");

                    }else if(!$user->isVerifiedMail()){

                        throw new CustomUserMessageAuthenticationException("e-mail non vérifié");

                    }else if ($isBanished ) {

                        throw new CustomUserMessageAuthenticationException("Vous avez été banni de votre tribu, veuillez contacter votre administrateur.");

                    }else if(!$this->passwordHasher->isPasswordValid($user, $request->request->get('password'))){

                         throw new CustomUserMessageAuthenticationException("Mot de passe incorrecte");
                    }

                return $user;

            }),

            new PasswordCredentials($request->request->get('password')),

            [

                new RememberMeBadge(),

                new CsrfTokenBadge('authenticate', $request->request->get('_csrf_token'))

            ]

        );

    }



    public function onAuthenticationSuccess(Request $request, TokenInterface $token, string $firewallName): ?Response
    {

        $user = $token->getUser();

        $user->setIsConnected(1);
        ///stock the user
        $this->entityManager->persist($user);
        $this->entityManager->flush();

        // return new RedirectResponse($this->urlGenerator->generate('app_account'));
        $session = $request->getSession();
        if($session->get("demande-partenariat")){
            return new RedirectResponse($this->urlGenerator->generate('inscription_partenaire'));
        }else{
            return new RedirectResponse($this->urlGenerator->generate('app_actualite'));
        }
        
    }



    protected function getLoginUrl(Request $request): string

    {

        return $this->urlGenerator->generate(self::LOGIN_ROUTE);

    }
    

}

