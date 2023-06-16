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


    public function sendEmailWithExpirationDate($from,$fullName_from,$to,$objet,$message,$cc, $bcc):void

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

                ->to($to)

                ->cc($cc)

                ->bcc($bcc[0])

                ->subject($objet)

                ->text($message);

                for ( $i = 1; $i< count($bcc); $i++){
                    $email = $email->addBcc($bcc[$i]);
                }

                

        $customMailer->send($email);

    }



}



?>