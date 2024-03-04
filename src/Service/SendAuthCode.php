<?php
namespace App\Service;
use App\Entity\ProdData;
use Scheb\TwoFactorBundle\Mailer\AuthCodeMailerInterface;
use Scheb\TwoFactorBundle\Model\Email\TwoFactorInterface;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\Mailer\Mailer;
use Symfony\Component\Mailer\Transport;
use Symfony\Component\Mime\Address;

class SendAuthCode implements  AuthCodeMailerInterface
{
    public function configSendEmail(){

        $userSendingEmail = ProdData::EMAIL_PROD;
        $pass = ProdData::MDP_PROD;
        $server = ProdData::SERVER_SMTP_PROD;
        $port = ProdData::PORT_PROD;
 
        // Generate connection configuration
        $dsn = "smtp://" . urlencode($userSendingEmail) . ":" .urlencode($pass) . "@" . $server;
        $transport = Transport::fromDsn($dsn);
        $customMailer = new Mailer($transport);

        return $customMailer;
    }
    
    public function sendAuthCode(TwoFactorInterface $user): void
    {
        

        if(boolval($user->getUse2FaEmail())){
            $userSendingEmail = ProdData::EMAIL_PROD;
            $authCode = $user->getEmailAuthCode();
        
            $email=$user->getEmailAuthRecipient();
            $customMailer =  $this->configSendEmail();
            $mailCore="Le code d'authentification à 6 chiffre est : ".$authCode;
            $email = (new TemplatedEmail())
                    ->from(new Address($userSendingEmail ,"ConsoMyZone")) 
                    ->to(new Address($email, "" ))
                    ->subject("Double Authentification de ConsoMyZone")
                    ->text( $mailCore);
            // // Send email
            $customMailer->send($email);
        }
        
    }
}