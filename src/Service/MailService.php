<?php



namespace App\Service;



use Twig\Environment;

use App\Entity\ProdData;

use App\Service\AgendaService;
use Exception;
use Symfony\Component\Mime\Address;

use Symfony\Component\Mailer\Mailer;
use Symfony\Component\Mailer\Transport;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Bridge\Twig\Mime\WrappedTemplatedEmail;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;

class MailService extends AbstractController {


    private $twig;
    private $defaultEmailSender;
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



    public function sendLinkOnEmailAboutAgendaSharing(
        $email_to, 
        $fullName_to, 
        $context, 
        $sender="ConsoMyZone", 
        $cc= [], 
        $cci= [] )
    {
        $customMailer =  $this->configSendEmail();

        // Generates the email
        $email = (new TemplatedEmail())
                ->from(new Address($this->defaultEmailSender ,$sender)) 
                ->to(new Address($email_to, $fullName_to ))
                ->subject($context["object_mail"]);
        
        if( count( $cc ) > 0 ){
            $email = $email->cc(new Address($cc[0], "Future Fans"));

            for( $i= 1; $i < count($cc); $i++ ){
                $email = $email->addCc(new Address($cc[$i], "Future Fans"));
            }
        }

        if( count( $cci ) > 0 ){
            $email = $email->bcc(new Address($cci[0], "Future Fans"));

            for( $i= 1; $i < count($cci); $i++ ){
                $email = $email->addBcc(new Address($cci[$i], "Future Fans"));
            }
        }

        if(isset($context["piece_joint"])){
            $all_pieces_joint= $context["piece_joint"];

            if( count($all_pieces_joint) > 0 ){
                foreach ($all_pieces_joint as $item) {
                    $file= $item["path"];
                    
                    if(file_exists($file)){
                        $email= $email->attach(fopen($file, 'r'), $item["name"] );
                    }
                }
            }
        }

        $date = date('Y-m-d'); // Date actuelle au format YYYY-MM-DD
        $date_fr = strftime('%d %B %Y', strtotime($date)); // Formatage de la date en jour mois année

        //// Generate email with the contents html : 'emails/mail_confirm_inscription.html.twig'
        $email =  $email->html($this->renderView($context["template_path"],[
            'email' => new WrappedTemplatedEmail($this->twig, $email),
            'today' => $date_fr,
            'fullNameTo' => $fullName_to,
            'link' => $context["link_confirm"],
            'content' => $context["content_mail"],
        ]));
try{
        $customMailer->send($email);
    return 250; 
        }catch(Exception $e){
            if($e->getCode()== 550){
                return 550;

            }
        }
       
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
    public function sendLinkOnEmailAboutTribuTInvitation($email_to=[], $fullName_to, $context, $sender="ConsoMyZone", $cc= [], $cci= [] ):void
    {
        $customMailer =  $this->configSendEmail();

        // Generates the email
        $email = (new TemplatedEmail())
                ->from(new Address($this->defaultEmailSender ,$sender)) 
                ->subject($context["object_mail"]);
        if( count( $email_to ) > 0 ){
            $email = $email->to(new Address($email_to[0], "Future Fans"));

            for( $i= 1; $i < count($email_to); $i++ ){
                $email = $email->addTo(new Address($email_to[$i], "Future Fans"));
            }
        }    
                // to(new Address($email_to, $fullName_to ))
               
        
        if( count( $cc ) > 0 ){
            $email = $email->cc(new Address($cc[0], "Future Fans"));

            for( $i= 1; $i < count($cc); $i++ ){
                $email = $email->addCc(new Address($cc[$i], "Future Fans"));
            }
        }

        if( count( $cci ) > 0 ){
            $email = $email->bcc(new Address($cci[0], "Future Fans"));

            for( $i= 1; $i < count($cci); $i++ ){
                $email = $email->addBcc(new Address($cci[$i], "Future Fans"));
            }
        }

        if(isset($context["piece_joint"])){
            $all_pieces_joint= $context["piece_joint"];

            if( count($all_pieces_joint) > 0 ){
                foreach ($all_pieces_joint as $item) {
                    $file= $item["path"];
                    
                    if(file_exists($file)){
                        $email= $email->attach(fopen($file, 'r'), $item["name"] );
                    }
                }
            }
        }

        $date = date('Y-m-d'); // Date actuelle au format YYYY-MM-DD
        $date_fr = strftime('%d %B %Y', strtotime($date)); // Formatage de la date en jour mois année

        //// Generate email with the contents html : 'emails/mail_confirm_inscription.html.twig'
        $email =  $email->html($this->renderView($context["template_path"],[
            'email' => new WrappedTemplatedEmail($this->twig, $email),
            'today' => $date_fr,
            'fullNameTo' => $fullName_to,
            'link' => $context["link_confirm"],
            'content' => $context["content_mail"],
        ]));

        $customMailer->send($email);
    }



    /**
     * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
     * 
     * use in tribuGController, tribuTController
     */
    public function sendEmailNewsLetter(
        $email_from,
        $fullName_from,
        $all_user_receiver,
        $context
    ) {

        if( count($all_user_receiver) === 0 ){
            return;
        }

        $customMailer =  $this->configSendEmail();

        // Generates the email
        $email = (new TemplatedEmail())
                ->from(new Address($this->defaultEmailSender, $fullName_from)) 
                // ->from(new Address($email_from ,$fullName_from)) 
                ->subject($context["object_mail"]);

        if (count($all_user_receiver) > 0) {
            $first_receiver = $all_user_receiver[0];
            // $email = $email->to(new Address($first_receiver["email"], $first_receiver["fullName"]));
$email = $email->to(new Address($first_receiver["email"]));

            for ($i = 1; $i < count($all_user_receiver); $i++) {
                $other_receiver = $all_user_receiver[$i];
                // $email = $email->addTo(new Address($other_receiver["email"], $other_receiver["fullName"]));
            $email = $email->addTo(new Address($other_receiver["email"]));
            }
        }

        if(isset($context["piece_joint"])){
            $all_pieces_joint= $context["piece_joint"];

            if( count($all_pieces_joint) > 0 ){
                foreach ($all_pieces_joint as $item) {
                    $file= $item["path"];
                    
                    if(file_exists($file)){
                        $email= $email->attach(fopen($file, 'r'), $item["name"] );
                    }
                }
            }
        }

        $date = date('Y-m-d'); // Date actuelle au format YYYY-MM-DD
        $date_fr = strftime('%d %B %Y', strtotime($date)); // Formatage de la date en jour mois année

        //// Generate email with the contents html : 'emails/mail_confirm_inscription.html.twig'
        $email =  $email->html($this->renderView($context["template_path"],[
            'email' => new WrappedTemplatedEmail($this->twig, $email),
            'content' => $context["content_mail"],
        ]));

// $customMailer->send($email);
        try {
        $customMailer->send($email);
return 250;
        } catch (Exception $e) {
            if ($e->getCode() == 550) {
                return 550;
            }
        }
    }

    /**
     * @author faniry
     * 
     * envoie les email de relance pour confirmé l'inscription et terminé adhésion dans un tribu t
     */
    public function sendEmailRelancePostulant($fullName_from, $emailAddressReceiver, $context):void
    {

        

        $customMailer =  $this->configSendEmail();

        // Generates the email
        $email = (new TemplatedEmail())
                ->from(new Address($this->defaultEmailSender, $fullName_from)) 
                // ->from(new Address($email_from ,$fullName_from)) 
                ->subject($context["object_mail"]);

        $email = $email->to(new Address($emailAddressReceiver["email"], $emailAddressReceiver["fullName"]));

        if(isset($context["piece_joint"])){
            $all_pieces_joint= $context["piece_joint"];

            if( count($all_pieces_joint) > 0 ){
                foreach ($all_pieces_joint as $item) {
                    $file= $item["path"];
                    
                    if(file_exists($file)){
                        $email= $email->attach(fopen($file, 'r'), $item["name"] );
                    }
                }
            }
        }

        $date = date('Y-m-d'); // Date actuelle au format YYYY-MM-DD
        $date_fr = strftime('%d %B %Y', strtotime($date)); // Formatage de la date en jour mois année

        //// Generate email with the contents html : 'emails/mail_confirm_inscription.html.twig'
        $email =  $email->html($this->renderView($context["template_path"],[
            'email' => new WrappedTemplatedEmail($this->twig, $email),
            'content' => $context["content_mail"],
        ]));

        $customMailer->send($email);
    }
    /**
     * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
     * 
     * @param $all_user_receiver [ [ "email" => ... , "fullName" => ... ], ...]
     * @param $context [ 
     *                   "object_mail" => ...,
     *                   "template_path" => ..., 
     *                   "resto" => ["name" => ... ], 
     *                   "user_modify" => ["fullname" => ... ], 
     *                   "user_super_admin" => ["fullname" => ... ],
     *                   "user_validator" => ["fullname" => ... ]
     *                 ]
     * 
     */
    public function sendEmailResponseModifPOI($email_from, $fullName_from, $all_user_receiver, $context):void
    {
        $customMailer =  $this->configSendEmail();

        // Generates the email
        $email = (new TemplatedEmail())
                ->from(new Address($this->defaultEmailSender, $fullName_from))
                // ->from(new Address($email_from ,$fullName_from)) 
                ->subject($context["object_mail"]);

        if( count( $all_user_receiver ) > 0 ){
            $first_receiver= $all_user_receiver[0];
            $email = $email->to(new Address($first_receiver["email"], $first_receiver["fullName"]));

            if(count( $all_user_receiver ) > 1 ){
                for( $i= 1; $i < count($all_user_receiver); $i++ ){
                    $other_receiver= $all_user_receiver[$i];
                    $email = $email->addTo(new Address($other_receiver["email"], $other_receiver["fullName"]));
                }
            }
        }

        $date = date('Y-m-d'); // Date actuelle au format YYYY-MM-DD
        $date_fr = strftime('%d %B %Y', strtotime($date)); // Formatage de la date en jour mois année

        //// Generate email with the contents html : 'emails/mail_confirm_inscription.html.twig'
        $email= $email->html(
                    $this->renderView(
                        $context["template_path"],
                        [
                            'email' => new WrappedTemplatedEmail($this->twig, $email),
                            'today' => $date_fr,
                            'resto_modify_name' => $context["resto"]["name"],
                            'resto_modify_adress' => $context["resto"]["adress"],
                            'user_modify_fullname' => $context["user_modify"]["fullname"],
                            'user_modify_email' => $context["user_modify"]["email"],
                            'fullNameTo' =>  $context["user_super_admin"]["fullname"],
                            'email_fullNameTo' => $context["user_super_admin"]["email"],
                            'user_validator_fullname' => $context["user_validator"]["fullname"],
                            'user_validator_email' => $context["user_validator"]["email"]
                        ]
                    )
                );

        $customMailer->send($email);
    }

    /**
     * @author Elie
     * Send email to user not connected or out of activity
     * just send simple template to user
     */
    public function sendEmailForMessage($email_to, $fullName_to, $objet, $user_sender, $url):void

    {
        $customMailer =  $this->configSendEmail();

        // Generates the email
        $email = (new TemplatedEmail())
                ->from(new Address($this->defaultEmailSender ,"ConsoMyZone")) 
                ->to(new Address($email_to, $fullName_to ))
                ->subject($objet);
                // ->text($message);
        
        $date = date('Y-m-d H:i:s'); // Date actuelle au format YYYY-MM-DD
        // $date_fr = strftime('%d %B %Y', strtotime($date)); // Formatage de la date en jour mois année

        $date_fr = date_format(date_create($date),"d-m-Y H:i:s");

        //// Generate email with the contents html
        $email =  $email->html($this->renderView('emails/mail_for_message.html.twig',[
            'email' => new WrappedTemplatedEmail($this->twig, $email),
            'sender_name' => $user_sender,
            'today' => $date_fr,
            'name_friend' => $fullName_to,
            "url" => $url,
        ]));

        $customMailer->send($email);
    }


    /**
     * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
     * 
     * Goal: Send an email with templated email with non param other the use received.
     * Use in: SecurityController.php, AgendaController.php
     * 
     * @param string $email_to: Email address to send the link
     * @param string $fullName_to: Full name of the user to send the link
     * @param array $context : [ [ "object" => ... "template" => ... ]]
     * 
     * @return void
     */
    public function sendEmailWithTemplatedEmail($email_to, $fullName_to, $context)
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
                'user_sender' => [
                    'fullname' => $context['user_sender']['fullname'],
                    'email' => $context['user_sender']['email'],
                ]
            ]));
        
        // try {
            $customMailer->send($email);
        //     return 200;
        // }catch (\Exception $e) {
        //     return 550;
        // }
    }



}


?>