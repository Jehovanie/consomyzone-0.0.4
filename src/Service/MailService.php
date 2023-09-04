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
        $this->defaultEmailSender = ProdData::EMAIL_PROD;
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


    /**
     * just send simple plain text
     */
    public function sendEmail($email_to,$fullName_to,$objet,$message):void

    {
        $customMailer =  $this->configSendEmail();

        // Generates the email
        $email = (new TemplatedEmail())
                ->from(new Address($this->defaultEmailSender ,"ConsoMyZone")) 
                ->to(new Address($email_to, $fullName_to ))
                ->subject($objet)
                ->text($message);

        $customMailer->send($email);
    }

    /**
     * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
     * 
     * @param string $email_to: Email address to send the link
     * @param string $fullName_to: Full name of the user to send the link
     * @param array $context : [ [ "object" => ... "template" => ... "link" => ... ]]
     * 
     * @return void
     */
    public function sendLinkOnEmailAboutAuthenticator($email_to,$fullName_to,$context):void
    {
        $customMailer =  $this->configSendEmail();

        // Generates the email
        $email = (new TemplatedEmail())
                ->from(new Address($this->defaultEmailSender ,"ConsoMyZone")) 
                ->to(new Address($email_to, $fullName_to ))
                ->subject($context["object"]);

        $date = date('Y-m-d'); // Date actuelle au format YYYY-MM-DD
        $date_fr = strftime('%d %B %Y', strtotime($date)); // Formatage de la date en jour mois année

        //// Generate email with the contents html : 'emails/mail_confirm_inscription.html.twig'
        $email =  $email->html($this->renderView($context["template"],[
                'email' => new WrappedTemplatedEmail($this->twig, $email),
                'today' => $date_fr,
                'fullNameTo' => $fullName_to,
                'link' => $context["link"]
            ]));

        $customMailer->send($email);
    }
    public function sendLinkOnEmailAboutAgendaSharing($email_to,$fullName_to,$context):void
    {
        $customMailer =  $this->configSendEmail();

        // Generates the email
        $email = (new TemplatedEmail())
                ->from(new Address($this->defaultEmailSender ,"ConsoMyZone")) 
                ->to(new Address($email_to, $fullName_to ))
                ->subject($context["object_mail"]);

        $date = date('Y-m-d'); // Date actuelle au format YYYY-MM-DD
        $date_fr = strftime('%d %B %Y', strtotime($date)); // Formatage de la date en jour mois année

        //// Generate email with the contents html : 'emails/mail_confirm_inscription.html.twig'
        $email =  $email->html($this->renderView($context["template_path"],[
                'email' => new WrappedTemplatedEmail($this->twig, $email),
                'today' => $date_fr,
                'fullNameTo' => $fullName_to,
                'link' => $context["link_confirm"],
                'content' => $context["content_mail"],
                'Nom'=>$fullName_to
            ]));

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