<?php

// src/Controller/MailerController.php
namespace App\Controller;
use Symfony\Component\Routing\Annotation\Route;
use App\Entity\ProdData;
use Symfony\Component\Mailer\Mailer;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Mailer\Transport;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\HttpFoundation\Response;

class TestSendEmailController extends AbstractController
{
    #[Route("/user/agenda/presence/send", name: "agenda_send_presence")]
    public function sendEmail() : Response
    {

        $userSendingEmail = ProdData::EMAIL_PROD;
        $pass = ProdData::MDP_PROD;
        $server = ProdData::SERVER_SMTP_PROD;
        $port = ProdData::PORT_PROD;
 
        // Generate connection configuration
        $dsn = "smtp://" . urlencode($userSendingEmail) . ":" .urlencode($pass) . "@" . $server;
        $transport = Transport::fromDsn($dsn);
        $customMailer = new Mailer($transport);
        
        $email = (new TemplatedEmail())
            ->from('nantenainasoa39@gmail.com')
            ->to('jean@geomadagascar.com')
            ->cc('nantenaina101@alwaysdata.net')
            ->bcc('elie@geomadagascar.com', 'jean.gilbert@infostat.fr')
            //->replyTo('fabien@example.com')
            //->priority(Email::PRIORITY_HIGH)
            ->subject('Bonjour les amis !')
            ->text('Voici encore un dernier test!');
            // ->html('<p>See Twig integration for better HTML integration!</p>');

        $customMailer->send($email);

        //$messageId = $sentEmail->getMessageId();

        return $this->json("Email bien envoyee !");
        
    }
}