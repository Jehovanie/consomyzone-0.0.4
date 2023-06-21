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



    public function sendEmail($to,$fullName_to,$objet,$message):void

    {


        // Generate connection configuration

        $dsn = "smtp://" . urlencode(ProdData::EMAIL_PROD) . ":" .urlencode(ProdData::MDP_PROD) . "@" . ProdData::SERVER_SMTP_PROD;

        $transport = Transport::fromDsn($dsn);

        $customMailer = new Mailer($transport);



        // Generates the email

        $email = (new TemplatedEmail())

                ->from(new Address( ProdData::EMAIL_PROD, ProdData::NOM_SENDER))

                ->to(new Address($to, $fullName_to ))

                ->subject($objet)

                ->text($message);


        $customMailer->send($email);

    }

    
    public function sendEmailWithCc($to,$fullName_to,$cc,$objet,$message):void
    {
         
        // Generate connection configuration
        $dsn = "smtp://" . urlencode(ProdData::EMAIL_PROD) . ":" .urlencode(ProdData::MDP_PROD) . "@" . ProdData::SERVER_SMTP_PROD;
        $transport = Transport::fromDsn($dsn);
        $customMailer = new Mailer($transport);

        // Generates the email
        $email = (new TemplatedEmail())
                ->from(new Address(ProdData::EMAIL_PROD, ProdData::NOM_SENDER)) 
                ->to(new Address($to, $fullName_to ))
                ->cc($cc[0]);

        for ( $i = 1; $i< count($cc); $i++){
            $email->addCc($cc[$i]);
        }

        $email->subject($objet)
              ->text($message);

        $customMailer->send($email);
    }


    public function sendEmailWithExpirationDate($to,$objet,$message,$cc, $bcc):void

    {

        // Generate connection configuration

        $dsn = "smtp://" . urlencode(ProdData::EMAIL_PROD) . ":" .urlencode(ProdData::MDP_PROD) . "@" . ProdData::SERVER_SMTP_PROD;

        $transport = Transport::fromDsn($dsn);

        $customMailer = new Mailer($transport);



        // Generates the email

        $email = (new TemplatedEmail())

                ->from(new Address(ProdData::EMAIL_PROD, ProdData::NOM_SENDER)) 

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