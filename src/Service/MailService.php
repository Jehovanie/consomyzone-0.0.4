<?php



namespace App\Service;



use Twig\Environment;

use App\Entity\ProdData;

use App\Service\AgendaService;

use Symfony\Component\Mime\Address;

use Symfony\Component\Mailer\Mailer;
use Symfony\Component\Mailer\Transport;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Bridge\Twig\Mime\WrappedTemplatedEmail;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;



class MailService extends AbstractController {



    public function __construct(
        Environment $twig
    ){
        $this->twig= $twig;
    }



    public function valid_email($str) : bool 

    {

        return (!preg_match("/^([a-z0-9\+_\-]+)(\.[a-z0-9\+_\-]+)*@([a-z0-9\-]+\.)+[a-z]{2,6}$/ix", $str)) ? false : true;

    }


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



    public function sendEmail($to,$fullName_to,$objet,$message):void

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

                ->from(new Address($userSendingEmail ,"ConsoMyZone")) 

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


    public function sendLinkToInviteOnAgenda($to, $fullName_to, $object, $agenda, $user_sender){

        $userSendingEmail = ProdData::EMAIL_PROD;

        $customMailer = $this->configSendEmail();

        ///// Generates the email
        $email = (new TemplatedEmail())
                    ->from(new Address($userSendingEmail ,"ConsoMyZone")) 
                    ->to(new Address($to, $fullName_to ))
                    ->subject($object);

        $date = date('Y-m-d'); // Date actuelle au format YYYY-MM-DD
        $date_fr = strftime('%d %B %Y', strtotime($date)); // Formatage de la date en jour mois année

        //// Generate email with the contents html
        $email =  $email->html($this->renderView('emails/mail_invitation_agenda.html.twig',[
                    'email' => new WrappedTemplatedEmail($this->twig, $email),
                    'user_sender' => $user_sender,
                    'today' => $date_fr,
                    'expiration_date' => new \DateTime('+7 days'),
                    'fullNameTo' => $fullName_to,
                    'agenda' => $agenda
                ]));

        $customMailer->send($email);
    }


    public function sendResponseAcceptAgenda($to, $fullName_to, $object, $agenda, $user_sender){
        
        $userSendingEmail = ProdData::EMAIL_PROD;

        $customMailer = $this->configSendEmail();

        $date = date('Y-m-d'); // Date actuelle au format YYYY-MM-DD
        $date_fr = strftime('%d %B %Y', strtotime($date)); // Formatage de la date en jour mois année

        ///// Generates the email
        $email = (new TemplatedEmail())
                    ->from(new Address($userSendingEmail ,"ConsoMyZone")) 
                    ->to(new Address($to, $fullName_to ))
                    ->subject($object);
        
        $date = date('Y-m-d'); // Date actuelle au format YYYY-MM-DD
        $date_fr = strftime('%d %B %Y', strtotime($date)); // Formatage de la date en jour mois année

        //// Generate email with the contents html
        $email =  $email->html($this->renderView('emails/mail_invitation_accept_agenda.html.twig',[
                    'email' => new WrappedTemplatedEmail($this->twig, $email),
                    'user_sender' => $user_sender,
                    'today' => $date_fr,
                    'fullNameTo' => $fullName_to,
                    'agenda' => $agenda
                ]));

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