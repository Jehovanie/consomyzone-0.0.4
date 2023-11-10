<?php
namespace App\Security;

use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Routing\RouterInterface;
use Symfony\Component\HttpKernel\Event\GetResponseEvent;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
class SessionHandler{
    public function __construct(
        private SessionInterface $session,
        private RouterInterface $router,
        
    ) {
        // Accessing the session in the constructor is *NOT* recommended, since
        // it might not be accessible yet or lead to unwanted side-effects
        // $this->session = $requestStack->getSession();
    }

    public function onKernelRequest(GetResponseEvent $event): void
    {
        $this->session->start();
        $maxIdleTime=60*5;
        
        if (time() - $this->session->getMetadataBag()->getLastUsed() > $maxIdleTime) {
            $this->session->invalidate();
            //TODO set data base
            new RedirectResponse($this->router->generate('app_login'));
         


        }
        // ...
    }
}