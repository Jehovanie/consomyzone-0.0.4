<?php



namespace App\Service;



use App\Entity\ProdData;

use Symfony\Component\Mime\Address;

use Symfony\Component\Mailer\Mailer;

use Symfony\Component\Mailer\Transport;

use Symfony\Bridge\Twig\Mime\TemplatedEmail;



class MailService {



    public function __construct(){}



    public function valid_email($str) : bool 

    {

        return (!preg_match("/^([a-z0-9\+_\-]+)(\.[a-z0-9\+_\-]+)*@([a-z0-9\-]+\.)+[a-z]{2,6}$/ix", $str)) ? false : true;

    }



    public function sendEmail($from,$fullName_from,$to,$fullName_to,$objet,$message):void

    {

        $userSendingEmail = ProdData::EMAIL_PROD;

        $pass = ProdData::MDP_PROD;

        $server = ProdData::SERVER_SMTP_PROD;

        $port = ProdData::PORT_PROD;

 

        // Generate connection configuration

        $dsn = "smtp://" . urlencode($userSendingEmail) . ":" .urlencode($pass) . "@" . $server;

        $transport = Transport::fromDsn($dsn);

        $customMailer = new Mailer($transport);



        // Generates the email

        $email = (new TemplatedEmail())

                ->from(new Address($from ,$fullName_from)) 

                ->to(new Address($to, $fullName_to ))

                ->subject($objet)

                ->text($message);



        $customMailer->send($email);

    }

    
    public function sendEmailWithCc($from,$fullName_from,$to,$fullName_to,$cc,$objet,$message):void
    {
        $userSendingEmail = ProdData::EMAIL_PROD;
        $pass = ProdData::MDP_PROD;
        $server = ProdData::SERVER_SMTP_PROD;
        $port = ProdData::PORT_PROD;
 
        // Generate connection configuration
        $dsn = "smtp://" . urlencode($userSendingEmail) . ":" .urlencode($pass) . "@" . $server;
        $transport = Transport::fromDsn($dsn);
        $customMailer = new Mailer($transport);

        // Generates the email
        $email = (new TemplatedEmail())
                ->from(new Address($from ,$fullName_from)) 
                ->to(new Address($to, $fullName_to ))
                ->cc($cc[0]);

        for ( $i = 1; $i< count($cc); $i++){
            $email->addCc($cc[$i]);
        }

        $email->subject($objet)
              ->text($message);

        $customMailer->send($email);
    }


    public function sendLinkToInviteOnAgenda($from, $fullName_from, $to, $fullName_to, $object, $message){
        $userSendingEmail = ProdData::EMAIL_PROD;
        $pass = ProdData::MDP_PROD;
        $server = ProdData::SERVER_SMTP_PROD;
        $port = ProdData::PORT_PROD;
 
        // Generate connection configuration
        $dsn = "smtp://" . urlencode($userSendingEmail) . ":" .urlencode($pass) . "@" . $server;
        $transport = Transport::fromDsn($dsn);
        $customMailer = new Mailer($transport);

        // Generates the email
        $email = (new TemplatedEmail())
                ->from(new Address($from ,$fullName_from)) 
                ->to(new Address($to, $fullName_to ))
                ->subject($object)
                ->text($message)
                // path of the Twig template to render
                ->htmlTemplate('shard/mail/mail_template.html.twig')

                // pass variables (name => value) to the template
                ->context([
                    'expiration_date' => new \DateTime('+1 days'),
                    'username' => 'Jehovanie RAMANDRIJOEL',
                ]);

        $customMailer->send($email);
    }


}



?>