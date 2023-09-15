<?php

namespace App\Controller;



use App\Service\Status;

use App\Entity\Consumer;
use App\Entity\Supplier;
use App\Service\FilesUtils;
use App\Service\MailService;
use App\Service\UserService;
use App\Service\AgendaService;
use App\Service\TributGService;
use App\Service\Tribu_T_Service;
use App\Repository\UserRepository;

use App\Service\NotificationService;
use App\Repository\BddRestoRepository;
use App\Repository\CodeinseeRepository;
use App\Repository\ConsumerRepository;
use Doctrine\ORM\EntityManagerInterface;
use App\Repository\DepartementRepository;
use App\Repository\GolfFranceRepository;
use App\Repository\SupplierRepository;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use App\Entity\GolfFinished;

ini_set('max_execution_time', '600');

class AgendaController extends AbstractController

{



    private $agendaService;

    private $entityManager;



    public function __construct(AgendaService $agendaService, EntityManagerInterface $entityManagerInterface)

    {

        $this->agendaService = $agendaService;

        $this->entityManager = $entityManagerInterface;
    }


    
    public function sendEmailPartageAgenda(
        $userRepository,
        $mailService,
        $notificationService,
        $tributGService,
        $agenda,
        $all_partisans
    ){

        foreach($all_partisans as $partisan){
            extract($partisan); /// $userID, $fullName

            //// email of the user
            $email_user_to_send_email= $userRepository->find(intval($userID))->getEmail();

            ///send email de confirmation s'il est va accepter ou refuser.
            $mailService->sendLinkToInviteOnAgenda(
                $email_user_to_send_email,
                $fullName,
                "Partage Agenda",
                $agenda,
                [
                    "id" => $this->getUser()->getId(),
                    "email" => $this->getUser()->getEmail(),
                    "fullname" => $tributGService->getFullName(intval($this->getUser()->getId())),
                    "userToID" => $userID
                ]
            );


            ///send notification : we have to send an email for invitation in agenda
            $notificationService->sendNotificationForOne(
                $this->getUser()->getId(),
                intval($userID),
                "Partage Agenda",
                "Je tenais à vous informer que je vous ai envoyé une invitation importante par courrier électronique. 
                Si vous avez des questions ou des préoccupations, n'hésitez pas à me contacter par e-mail ou par téléphone."
            );
        }
    }

    /**
     * made by NANTENAINA, this function is use actualy to confirm invitation agenda
     */
    #[Route('/agenda/confirmation/{fromId}/{toId}/{agendaId}', name: 'agenda_confirmation', methods: ["GET","POST"])]
    public function setAgendaConfirmation($fromId,$toId,$agendaId){

        $place_libre=$this->agendaService->checkFreePlace(intval($fromId), intval($toId),intval($agendaId));

        if( $place_libre["place_libre"]=== 0){
            return $this->render("agenda/partage/agenda_full_place.html.twig",[
                "profil" => "",
            ]);
        }elseif( $place_libre["place_libre"]>0){
           
            return $this->render("agenda/partage/agenda_free_place.html.twig",[
                "profil" => "",
            ]);
        }

        return $this->render("agenda/partage/agenda_full_place.html.twig",[
            "profil" => "",
        ]);
    }

    #[Route('/agenda/make/confirmation/{fromId}/{toId}/{agendaId}/{isYes}', name: 'agenda_make_confirmation', methods: ["GET","POST"])]
    public function makeConfirmationAgenda($fromId,$toId,$agendaId, $isYes){

        $confirm = $this->agendaService->setConfirmPartageAgenda( $fromId, $toId, $agendaId, $isYes);
       
        return $this->json($confirm);
      
    }

    #[Route('/user/get_agenda_by_date/{table}/{datetime}', name: 'get_agenda_by_date', methods: ["GET","POST"])]
    public function getAgendaByDate($table, $datetime){
        return  $this->json($this->agendaService->getAgendaByDate($table, $datetime));
    }

    #[Route('/user/get_agenda_by_type/{tribut_name}/{type}', name: 'get_agenda_by_type', methods: ["GET","POST"])]
    public function getAgendaByType($tribut_name, $type){
        return  $this->json($this->agendaService->getAgendaByType($tribut_name, $type));
    }

    #[Route('/api/user/all_agenda', name: 'api_get_all_agenda', methods: ["GET"])]
    public function getAllAgenda(
        AgendaService $agendaService
    ){
        if( !$this->getUser()){
            return $this->json([], 403);
        }
        $user= $this->getUser();
        $table_agenda= $user->getNomTableAgenda();

        $all_agenda= $agendaService->getAllAgenda($table_agenda);

        return $this->json([
            "allAgenda" => $all_agenda,
        ], 200);
    }

    #[Route('/api/user/agenda/{id}', name: 'api_get_one_agenda', methods: ["GET"])]
    public function getOneAgenda(
        $id, 
        AgendaService $agendaService
    ){
        if( !$this->getUser()){
            return $this->json([], 403);
        }
        $user= $this->getUser();
        $table_agenda= $user->getNomTableAgenda();

        $agenda= $agendaService->getOneAgenda($table_agenda, $id);

        return $this->json([
            "agenda" => $agenda,
        ], 200);
    }

    
    #[Route('/user/tribu/delete-agenda', name: 'api_delete_agenda', methods: ["POST"])]
    public function deleteAgenda(
        Request $request,
        AgendaService $agendaService
    ){
        $user = $this->getUser();
        $table_agenda= $user->getNomTableAgenda();

        // $user_id = $user->getId();
        $requestContent = json_decode($request->getContent(), true);
        $agendaID = intval($requestContent["agendaID"]);

        $agenda= $agendaService->getOneAgenda($table_agenda, $agendaID);

        if( !$agenda){
            return $this->json([
                "success" => true,
                "message" => 'Agenda non trouvé, il est deja supprimer.'
            ], 201);
        }

        $agendaService->deleteAgendaUpdate($table_agenda,$agendaID);

        return $this->json([
            "success" => true,
            "message" => 'Agenda supprimé avec succès !'
        ], 201);
        
     }
 


    #[Route('/api_old/user/agenda/{id}', name: 'api_one_agenda', methods: ["GET"])]
    public function createAgenda(
        $tribut_name,
        Request $request
    ){
        $user = $this->getUser();
        $user_id = $user->getId();

        $requestContent = json_decode($request->getContent(), true);

        $title = $requestContent["title"];
        $type = $requestContent["type"];
        $from = $requestContent["from"];
        $to = $requestContent["to"];
        $lat = $requestContent["lat"];
        $lng = $requestContent["lat"];
        $resto = $requestContent["resto"];
        $participant = $requestContent["participant"];
        $description = $requestContent["desc"];

        $id_agenda = $this->agendaService->createAgenda($tribut_name, $title, $type, $resto, $participant, $from, $to, $lat, $lng, $user_id, $description);

        $this->agendaService->insertActionAgenda($tribut_name.'_action', "Participer", $user_id, $id_agenda, 1);

        //Modification by Elie
        //Sending notifications to members of Tribu T or Tribu G

        $tribu_t_service =  new Tribu_T_Service();

        $regex = "/\_agenda+$/";
        $table_tribu = preg_replace($regex, "", $tribut_name);

        $membre = $tribu_t_service -> getUserIdInTribu($table_tribu , $user_id);

        $notif_service = new NotificationService();

        $content = $tribu_t_service->getFullName($user_id). " a crée un ".$type." à partir du ".$from." au ".$to . " 
        si vous avez interéssé. <a href='/user/tribut/get-detail-agenda/" .$tribut_name. "/" .$id_agenda. "'>Voir plus...</a>";

        $notif_service -> sendNotificationForMany($user_id,$membre,"Agenda", $content);

        return  $this->json($type." enregistré avec succès");
    }


    /**

     * @Route("user/update_agenda/{tribut_name}" , name="update_agenda", methods={"POST","GET"})

     */

    public function updateAgenda($tribut_name, Request $request)

    {



        $user = $this->getUser();



        $requestContent = json_decode($request->getContent(), true);



        $statu = $requestContent["status"];

        $id = $requestContent["id"];



        $this->agendaService->updateAgenda($tribut_name, $statu, $id);



        return  $this->json("Agenda bien upgradé");
    }



    /**

     * @Route("user/has_agenda/{tribut_name}/{date}" , name="has_agenda", methods={"POST","GET"})

     */

    public function hasAgenda($tribut_name, $date){

        return  $this->json($this->agendaService->hasAgenda($tribut_name, $date));
    }



    /**

     * @Route("user/tribut/get-detail-agenda/{table_name}/{id}" , name="detail_agenda", methods={"POST","GET"})

     */

    public function detailAgenda($table_name, $id, TributGService $tributGService){

        $user = $this->getUser();

        $user_id = $user->getId();

        $tableName = $table_name . "_action";

        $regex = "/\_agenda+$/";

        $table_tribu = preg_replace($regex, "", $table_name);

        $tribu_t = new Tribu_T_Service();

        $tribu = $tribu_t->showRightTributName($table_tribu);

        $result_a = $this->agendaService->getActionAgenda($tableName, $id, $user_id);



        $isParticiped = false;

        $isPartaged = false;

        $isInterested = false;


        if (count($result_a) > 0) {

            for ($i = 0; $i < count($result_a); $i++) {

                if ($result_a[$i]["type_action"] == "Participer") {

                    $isParticiped = true;
                }

                if ($result_a[$i]["type_action"] == "Intéresser") {

                    $isInterested = true;
                }

                /*if ($result_a[$i]["type_action"] == "Partager") {

                    $isPartaged = true;
                }*/
            }
        }

        // adding condition max participants of agenda tribu T

        $Max_participant = $this->agendaService->getMaxOfParticipant($table_name, $id);

        $participant = $this->agendaService->getNumberOfParticipant($tableName, $id);
        //dd($participant);

        $type_agenda = $this->agendaService->getTypeBy($table_name, $id);

        //dd([$Max_participant,$participant,$type_agenda]);

        $disabled = "";
        $flush_msg =($Max_participant - $participant)." place(s) disponible";

        if($type_agenda == "Repas" && $participant >= $Max_participant){
            $disabled = "disabled";
            $flush_msg = "le nombre des participants atteint le maximal requis";
        }


        $result = $this->agendaService->detailAgenda($table_name, $id);



        $userFullName = $tribu_t->getFullName($result[0]["user_id"]);



        $userType = $user->getType();

        $profil = "";

        if ($userType == "consumer") {

            $profil = $this->entityManager->getRepository(Consumer::class)->findByUserId($user_id);
        } else {

            $profil = $this->entityManager->getRepository(Supplier::class)->findByUserId($user_id);
        }

        $list_tribu_t = json_decode($user->getTribuT(), true);



        if (count($result) > 0) {

            return $this->render('agenda/detail_agenda.html.twig', [

                "profil" => $profil,

                "agenda" => $result[0],

                "partage" => $isPartaged,

                "table_tribu" => $table_tribu,

                "tribu" => $tribu["name"],

                "userFullName" => $userFullName,

                "interesse" => $isInterested,

                "participe" => $isParticiped,

                "disabled" => $disabled,

                "participant" => $participant,

                "flushMsg" => $flush_msg,

                "tribu_t" => $list_tribu_t,

                "tribu_g" => $profil[0]->getTributG(),

                "statusTribut" => $tributGService->getStatusAndIfValid($profil[0]->getTributg(), $profil[0]->getIsVerifiedTributGAdmin(), $user_id)

            ]);
        } else {

            return $this->redirectToRoute('publication_tribu');
        }
    }



    /**

     * @Route("user/tribut/action-agenda/{table_name}/{id}" , name="action_agenda", methods={"POST","GET"})

     */

    public function setActionAgenda($table_name, $id, Request $request){

        $user = $this->getUser();



        $user_id = $user->getId();



        $requestContent = json_decode($request->getContent(), true);



        $type = $requestContent["type"];

        $verbe = "";

        $result_a = $this->agendaService->getStatusAgenda($table_name, $id, $user_id, $type);

        if (count($result_a) == 0) {

            $status_ok = 1;

            $this->agendaService->insertActionAgenda($table_name, $type, $user_id, $id, $status_ok);

            $verbe = $type == "Participer" ? "a participé":"a partagé";
        } else {
            if($type == "Participer"){

                $state = $result_a[0]["status"];

                $status_final = $state == 1 ? 0 : 1;

                $conjug = $state == 1 ? "a annulé sa participation sur" : "a participé";

                $verbe = $conjug ;//$type == "Participer" ? $conjug:"a partagé";

                $this->agendaService->updateActionAgenda($table_name, $status_final, $user_id, $id, $type);
            }else{

                $this->agendaService->insertActionAgenda($table_name, $type, $user_id, $id, 1);

                $verbe =" a partagé ";

            }
            
        }

        $tribu_t_service =  new Tribu_T_Service();

        $regex = "/\_action+$/";

        $table_agenda = preg_replace($regex, "", $table_name);

        $membre = $this->agendaService->getUserIdAndTypeBy($table_agenda , $id);

        $notif_service = new NotificationService();

        if($user_id != $membre["user_id"]){

            $content = $tribu_t_service->getFullName($user_id)." ". $verbe ." votre ".$membre["type"]." que vous avez créé.
            <a href='/user/tribut/get-detail-agenda/" .$table_agenda. "/" .$id. "'> Voir plus...</a>";

            $notif_service -> sendNotificationForOne($user_id, $membre["user_id"], "Action agenda", $content );

        }


        return $this->json("Action bien fait!");
    }



    /**

     * @Route("user/tribut/modify_agenda/{table_name}/{id}" , name="modify_agenda", methods={"POST"})

     */

    public function modifyAgenda($table_name, $id, Request $request){

        $requestContent = json_decode($request->getContent(), true);

        $title = $requestContent["title"];

        $from = $requestContent["from"];

        $to = $requestContent["to"];

        $desc = $requestContent["desc"];

        $lat = $requestContent["lat"];

        $lng = $requestContent["lng"];

        $resto = $requestContent["resto"];

        $participant = $requestContent["participant"];

        $this->agendaService->modifyAgenda($table_name, $title, $desc, $from, $to, $lat, $lng, $resto, $participant, $id);


        return $this->json('Agenda à jour!');
    }



    /**

     * @Route("user/tribut/list_user/{table_name}/{id}/{type}" , name="get_list_user", methods={"GET"})

     */

    public function getListUser($table_name, $id, $type){

        $list = $this->agendaService->getListUser($table_name, $id, $type);



        $tribu_t = new Tribu_T_Service();



        //$tribu = $tribu_t->showRightTributName($table_tribu);



        $tableau = array();



        for ($i = 0; $i < count($list); $i++) {

            array_push($tableau, ["user_id" => $list[$i]["user_id"], "userFullName" => $tribu_t->getFullName($list[$i]["user_id"]) ,"nombre"=>$list[$i]["nombre"]]);
        }

        //dd($tableau);

        return $this->json($tableau);
    }

    /**

     * @Route("user/tribut/share_agenda/{id_agenda}/{type}/{table_origin}/{table_dest}" , name="app_share_agenda", methods={"GET","POST"})

     */

     public function shareAgenda($type , $table_origin, $id_agenda, $table_dest){
        $user = $this->getUser();

        $user_id = $user ->getId();

        $list_tribu_t = json_decode($user->getTribuT(), true);

        $userType = $user->getType();

        $profil = "";

        if ($userType == "consumer") {

            $profil = $this->entityManager->getRepository(Consumer::class)->findByUserId($user_id);
        } else {

            $profil = $this->entityManager->getRepository(Supplier::class)->findByUserId($user_id);
        }
        
        $tribu_g = $profil[0]->getTributG();

        $tribu_t_service =  new Tribu_T_Service();

        $tribu_t_name = $tribu_t_service->showRightTributName($table_dest)["name"];

        $notif_service = new NotificationService();

        if($type=="tribu_g"){
            //$table = $tribu_g;
            $membre = $tribu_t_service -> getUserIdInTribu($tribu_g, $user_id);
            $content = $tribu_t_service->getFullName($user_id). " a partagé un agenda dans votre tribu G
            si vous avez interéssé. <a href='/user/tribut/get-detail-agenda/" .$table_origin. "/" .$id_agenda. "'>Voir plus...</a>";
            $notif_service -> sendNotificationForMany($user_id, $membre,"Partage Agenda", $content);

        }else if($type=="tribu_t"){

            for($i=0; $i<count($list_tribu_t); $i++){
                if(trim($list_tribu_t[$i]) == $table_dest){
                    $membre = $tribu_t_service -> getUserIdInTribu($list_tribu_t[$i], $user_id);
                    $content = $tribu_t_service->getFullName($user_id). " a partagé un agenda dans la tribu T ".$tribu_t_name."
                    si vous avez interéssé. <a href='/user/tribut/get-detail-agenda/" .$table_origin. "/" .$id_agenda. "'>Voir plus...</a>";
                    $notif_service -> sendNotificationForMany($user_id, $membre,"Partage Agenda", $content);
                }
                
            }
            
        }

 
         return $this->json("Agenda partagé");
     }
     
     /**
     * @Route("user/tribut/get_resto/{table_resto_pastille}/{value}" , name="get_resto_agenda", methods={"GET"})
     */
    public function getRestaurant($table_resto_pastille, $value){

        $list = $this->agendaService->getRestoAgenda($table_resto_pastille, $value);

        $tribut_serv = new Tribu_T_Service();

        $regex = "/_restaurant+$/";

        $table_tribu = preg_replace($regex, "", $table_resto_pastille);

        $avatar = $tribut_serv->showAvatar($table_tribu, $this->getUser()->getId())["avatar"];

        return $this->json(["list"=>$list,"avatar"=>$avatar]);

    }

    /** 
    *@Route("user/tribut/save_resto/{table}" , name="save_resto_agenda", methods={"POST"})
    */
    public function saveRestaurant($table, Request $request){
        $user_id = $this->getUser()->getId();
        $requestContent = json_decode($request->getContent(), true);

        $resto = $requestContent["name"];
        $id_resto = $requestContent["id_resto"];

        $this->agendaService ->saveRestaurant($table, $resto, $id_resto);

        return $this->json("Restaurant bien sauvegardé");

    }

   
    #[Route("/user/tribu/agenda", name: "app_agenda")]
    public function agenda(Status $status){
        $userConnected = $status->userProfilService($this->getUser());
        $statusProfile = $status->statusFondateur($this->getUser());


        return $this->render("agenda/agenda.html.twig",[
            "profil" => $statusProfile["profil"],
            "statusTribut" => $statusProfile["statusTribut"],
            "userConnected" => $userConnected,
        ]);
    }

    #[Route("/user/tribu/new-agenda", name: "app_new_agenda", methods: ["GET", "POST"] )]
    public function createEventUpdate(
        Request $request,
        AgendaService $agendaService, 
        Filesystem $fs
    ){

        $data=json_decode($request->getContent(),true);

        extract($data); 

        if( $fileName && $fileType ){
            $path = $this->getParameter('kernel.project_dir') . "/public/uploads/users/agenda/files/";
            $path .= (str_contains($req["fileType"], "application")) ? "document/" : "img/";
        
            if(!$fs->exists($path)){
                $fs->mkdir($path,0777);
            }
            $fileUtils = new FilesUtils();
            $fileUtils->uploadImageAjax($path, $req["fileBTOA"], $req["fileName"]);
        }

        $newAgenda= [
            "title" => $title,
            "type" => $type,
            "isEtabCMZ" => $isEtabCMZ ? 1 : 0 ,
            "isGolfCMZ" => $isGolfCMZ ? 1 : 0 ,
            "isRestoCMZ" => $isRestoCMZ ? 1 : 0 ,
            "name" => $name,
            "adresse" => $adresse,
            "description" => $description,
            "participant" => $participant,
            "place_libre"=>$place_libre,
            "dateStart" => $dateStart,
            "dateEnd" => $dateEnd,
            "heureStart" => $timeStart,
            "heureEnd" => $timeEnd,
            "file_type" => $fileType ? $fileType : null,
            "file_path" => $fileName ? $fileName : null,
            "status" => 0,
            "user_id" => $this->getUser()->getId()
        ];

        $agendaTableName=$this->getUser()->getNomTableAgenda();

        $agendaService->createEvent($agendaTableName,$newAgenda);

        return $this->json([
            "success" => true,
            "message" => "Agenda créé avec succès !"
        ], 201);
    }

    #[Route("/user/tribu/update-agenda/{agendaId}", name: "app_update_agenda", methods: ["GET", "POST"] )]
    public function updateEventCalendar(
        Request $request,
        AgendaService $agendaService,
        Filesystem $fs,
        $agendaId
    ){

        $data=json_decode($request->getContent(),true);

        extract($data); 

        if( $fileName && $fileType ){
            $path = $this->getParameter('kernel.project_dir') . "/public/uploads/users/agenda/files/";
            $path .= (str_contains($req["fileType"], "application")) ? "document/" : "img/";
        
            if(!$fs->exists($path)){
                $fs->mkdir($path,0777);
            }
            $fileUtils = new FilesUtils();
            $fileUtils->uploadImageAjax($path, $req["fileBTOA"], $req["fileName"]);
        }

        $newAgenda= [
            "title" => $title,
            "type" => $type,
            "isEtabCMZ" => $isEtabCMZ,
            "isGolfCMZ" => $isGolfCMZ,
            "isRestoCMZ" => $isRestoCMZ,
            "name" => $name,
            "adresse" => $adresse,
            "description" => $description,
            "participant" => $participant,
            "dateStart" => $dateStart,
            "dateEnd" => $dateEnd,
            "heureStart" => $timeStart,
            "heureEnd" => $timeEnd,
            "file_type" => $fileType ? $fileType : null,
            "file_path" => $fileName ? $fileName : null,
            "status" => 0,
        ];

        $agendaTableName=$this->getUser()->getNomTableAgenda();

        $agendaService->updateEventCalendar($agendaTableName,$newAgenda, $agendaId);

        return $this->json([
            "success" => true,
            "message" => "Agenda modifié avec succès !"
        ], 201);
    }


    #[Route("/user/create-event/agenda", name: "app_create_agenda")]
    public function createEvent(Request $request,AgendaService $agendaService, Filesystem $fs){
        $agendaTableName=$this->getUser()->getNomTableAgenda();
        $req=json_decode($request->getContent(),true);

        if( str_contains($req["fileType"],"image"))
            $path="/public/uploads/users/agenda/files/img/";
        else if(str_contains($req["fileType"], "application"))
            $path = "/public/uploads/users/agenda/files/document/";
        if(!($fs->exists($this->getParameter('kernel.project_dir') . $path)))
            $fs->mkdir($this->getParameter('kernel.project_dir') . $path,0777);
        
        $param=array(
            ":message"=>$req["agendaMessage"],
            ":type"=>$req["eventType"],
            ":confidentialite"=>$req["confidentiality"],
            ":file_path"=>str_replace("/public","",($path.$req["fileName"])),
            ":date"=>$req["dateEvent"],
            ":heure_debut"=>$req["heureD"],
            ":heure_fin"=>$req["heureF"],
            ":file_type"=>$req["fileType"],
            ":status"=>1,
            ":restaurant"=>$req["restaurant"],
            ":adresse"=>$req["adresse"],
            ":max_participant"=>$req["maxParticipant"]
        );
        $fileUtils = new FilesUtils();
        $response = new Response();
        try{
            if($req["fileSize"]>0)
                $fileUtils->uploadImageAjax($this->getParameter('kernel.project_dir') . $path, $req["fileBTOA"], $req["fileName"]);
            else
                $fs->touch($this->getParameter('kernel.project_dir') . $path. $req["fileName"]);
        }catch(\Exception $e){
            $response->setStatusCode(500);
            return $response;
        }
        $requestResponse=$agendaService->createEvent($agendaTableName,$param);
       
        if($requestResponse){
            $response->setStatusCode(200);
            return $response;
        }else{
            $response->setStatusCode(500);
            return $response;
        }


    }

    #[Route("/user/agenda", name: "app_get_agenda")]
    public function getAgenda(AgendaService $agendaService, SerializerInterface $ser){
        $agendaTableName = $this->getUser()->getNomTableAgenda();

        $agendaPartageName= $this->getUser()->getNomTablePartageAgenda();

        $r=$agendaService->getAgenda($agendaTableName, $agendaPartageName);
        $date= array_column($r, 'date');
        array_multisort($date, SORT_ASC, $r);
       
        $referenceDate=$r[0]["date"];
        $final=[];
        $tmp=[];
        $j=0;
        for($i=0;$i<count($r);$i++){
            if($referenceDate ===$r[$i]["date"]){
                $referenceDate = $r[$i]["date"];
            }else{
                $tmp=[];
                $j++;
                $referenceDate = $r[$i]["date"];
            }
            array_push($tmp,$r[$i]);
            $final[$j]=$tmp;
        }

       for($i=0;$i<count($final);$i++){
            $date = array_column($final[$i], 'heure_debut');
            array_multisort($date, SORT_ASC, $final[$i]);
       }

        $json=$ser->serialize($final,"json");
        return new JsonResponse($json, Response::HTTP_OK, [], true);
    }

    #[Route("/user/agenda/up", name: "agenda_update")]
    public function updateAgendaTom(
        Request $request, 
        AgendaService $agendaService,
        Filesystem $fs){
        $agendaTableName = $this->getUser()->getNomTableAgenda();
        $req = json_decode($request->getContent(), true);
        if (str_contains($req["fileType"], "image"))
            $path = "/public/uploads/users/agenda/files/img/";
        else if (str_contains($req["fileType"], "application"))
            $path = "/public/uploads/users/agenda/files/document/";
        if (!($fs->exists($this->getParameter('kernel.project_dir') . $path)))
            $fs->mkdir($this->getParameter('kernel.project_dir') . $path, 0777);
        
        $param=array(
            ":message" => $req["agendaMessage"],
            ":type" => $req["eventType"],
            ":confidentialite" => $req["confidentiality"],
            ":file_path" => str_replace("/public", "", ($path . $req["fileName"])),
            ":heure_debut" => $req["heureD"],
            ":heure_fin" => $req["heureF"],
            ":file_type" => $req["fileType"],
            ":restaurant" => $req["restaurant"],
            ":adresse" => $req["adresse"],
            ":max_participant" => $req["max_participant"],
            ":id" => $req["id"],
            
        );

        $fileUtils = new FilesUtils();
        $response = new Response();
        try {
            if ($req["fileSize"] > 0)
            $fileUtils->uploadImageAjax($this->getParameter('kernel.project_dir') . $path, $req["fileBTOA"], $req["fileName"]);
            else
                $fs->touch($this->getParameter('kernel.project_dir') . $path . $req["fileName"]);
        } catch (\Exception $e) {
            $response->setStatusCode(500);
            return $response;
        }
        $requestResponse = $agendaService->updateEvent($agendaTableName, $param);

        if ($requestResponse) {
            $response->setStatusCode(200);
            return $response;
        } else {
            $response->setStatusCode(500);
            return $response;
        }
        

    }

    #[Route("/user/agenda/up/status", name: "agenda_update_status")]
    public function updateAgendaStatusTom(Request $request,AgendaService $agendaService){
        $agendaTableName = $this->getUser()->getNomTableAgenda();
        $req = json_decode($request->getContent(), true);
        $param=array(
            ":status"=>0,
            ":id"=>$req["id"]
        );
        $requestResponse= $agendaService->updateEventStatus($agendaTableName,$param);
        $response = new Response();
        if ($requestResponse) {
            $response->setStatusCode(200);
            return $response;
        } else {
            $response->setStatusCode(500);
            return $response;
        }
        
    }

    #[Route("/user/agenda/restpastil", name:"agenda-pastille")]
    public function agendaRestPastille(Tribu_T_Service $servT, 
    AgendaService $agendaService,
    Status $status,
    SerializerInterface $jsonSerializer){
        $d = $servT->getAllTribuTJoinedAndOwned($this->getUser()->getId());
        $joinedTribuT = !is_null( $d[0]["tribu_t_joined"] ) ? json_decode($d[0]["tribu_t_joined"], true) : [];
        $ownedTribuT =  !is_null( $d[0]["tribu_t_owned"] ) ? json_decode($d[0]["tribu_t_owned"], true) : [];
        
        $r=$agendaService->getRestoPastilled($joinedTribuT, $ownedTribuT,$servT);
        $json =$jsonSerializer->serialize($r,'json');
        return new JsonResponse($json, Response::HTTP_OK, [], true);
      
        
    }
    #[Route("/f", name: "agenda-f")]
    public function shareAgendaInPublication(AgendaService $agendaService){
            $tableAgenda=$this->getUser()->getNomTableAgenda();
            $nom=$this->getUser()->getPseudo();
            $userId= $this->getUser()->getId();
            $r =$agendaService->shareAgendaInPublication($tableAgenda, "tribu_t_1_banane_publication",$userId,$nom,18);

            $response=new Response();
            if($r){
                return $response->setStatusCode(200);
            }else{
                return $response->setStatusCode(500);
            
            }
    }

    #[Route("/page/test/confirmations/agenda-partager/{userID_sender}", name: "app_agenda_page_test_confirmations", methods: "GET")]
    public function test_agenda_page_test_confirmations(
        $userID_sender
    ){

        return $this->render("test_agenda_page_test_confirmations.html.twig",[
            "userID_sender" => $userID_sender
        ]);
    }

    /**old boakely  */

    #[Route("/confirmation/agenda/{userID_sender}/{agendaID}/partager/{userID}/{isAccepted}" , name: "app_agenda_confirmation", methods: "GET")]
    public function agendaConfirmationEmail(
        $userID_sender,
        $agendaID,
        $userID,
        $isAccepted,
        UserRepository $userRepository,
        AgendaService $agendaService,
        NotificationService $notificationService,
        TributGService $tributGService,
        MailService $mailService
    ){
        $user_sender = $userRepository->findOneBy(["id" => intval($userID_sender)]); /// user entity (sender)
        $user_sender_fullname= $tributGService->getFullName(intval($userID_sender)); /// user full name (sender)


        $user= $userRepository->findOneBy(["id" => intval($userID)]); /// user entity (qui confirm)
        $user_fullname= $tributGService->getFullName(intval($userID)); /// user full name (qui confirm)

        $table_partage_user_sender= $user_sender->getNomTablePartageAgenda(); /// table partage agenda name (sender)

        //// check if this user is already confirm this partage: (may be by "email" or "pub" and "accept" or "refuse")
        if( $agendaService->chackIfAlreadyAcceptedAgenda($table_partage_user_sender, $agendaID, $userID )){

            /// send notification for the user that his confirm
            $notificationService->sendNotificationForOne($userID, $userID,"Accepted Agenda", "Vous avez déjà répond cet agenda partager." );

            return  $this->redirectToRoute("app_account");
        }

        ///Handle confirm form the user ( may be accept or reject )
        $result= $agendaService->setConfirmPartageAgenda($userID_sender, $agendaID,$userID,"email", !!$isAccepted); /// -1: error / 0: max atteint / 1: persite 

        if( intval($result) === 0 ){
            /// max participant atteint
            if( !!$isAccepted ){
                $message= "Vous venez d'accepter un agenda créé par " . $user_sender_fullname . ", malheusement le nombre maximum de participant est atteint.";

                ////send email que le nombre maximun est atteint.

            }else{
                $message= "Vous venez de refuser un agenda créé par " . $user_sender_fullname;
            }

            /// send  notification for the user that is request is reject because max atteint
            $notificationService->sendNotificationForOne($userID, $userID,"Accepted Agenda", $message );
            dd("Confirmation : REFUSE OU TAILLE MAX ATTEINT");
        }else if( intval($result) === 1 ){  //// accepted reussir

            /// send  notification for the user this is request is persist.
            $notificationService->sendNotificationForOne($userID, $userID,"Accepted Agenda", "Vous avez accepté un agenda créer par " . $user_sender_fullname . ".");
            
            /// send  notification for the user that is creat this agenda someone accept her partage.
            $notificationService->sendNotificationForOne($userID, $userID_sender,"Accepted Agenda", $user_fullname . " a accepté votre agenda partager");


            //// Persiste agenda to the user accepte.
            $agendaService->setEventFollowed($userID, $agendaID);

            $agenda= $agendaService->getAgendaById($user_sender->getNomTableAgenda(), intval($agendaID)); /// entity agenda

            /// send email
            $mailService->sendResponseAcceptAgenda(
                $user->getEmail(),
                $user_fullname,
                "Agenda Accepter",
                $agenda,
                [
                    "id" => $user_sender->getId(),
                    "email" => $user_sender->getEmail(),
                    "fullname" => $tributGService->getFullName(intval($user_sender->getId())),
                ]
            );
        }

        return  $this->redirectToRoute("app_account");
    }


    #[Route("/api/users/agenda/all_partisant", name: "api_all_partisant_agenda", methods: ["GET"])]
    public function getAllPartisant(
        UserRepository $userRepository,
        UserService $userService,
        TributGService $tributGService,
        Tribu_T_Service $tributTService
    ){

        if( !$this->getUser()){
            return $this->json(["success" => false,"data" => [],"message" => "user not connected"], 403);
        }
        $partisants= [];
        $user_connected = $this->getUser();
        $tributG_name = $tributGService->getTribuGtableForNotif($user_connected->getId());
        $tribuG_apropos= $tributGService->getApropos($tributG_name);

        $all_user_id_tribug = $tributGService->getAllTributG($tributG_name);

        foreach ($all_user_id_tribug as $user_id) {
            $user = $userRepository->find(intval($user_id["user_id"]));
            if( !$user ){ continue; }

            $single_user = [
                "id" => intval($user->getId()),
                "email" => $user->getEmail(),
                "firstname" => $userService->getUserFirstName($user->getId()),
                "lastname" => $userService->getUserLastName($user->getId()),
                "status" => $tributGService->getCurrentStatus($tributG_name, $user->getId()),
                "tribu" => [$tribuG_apropos]
            ];

            array_push($partisants, $single_user);
        }

        $all_tribuT= $userRepository->getListTableTribuT();

        for($i=0; $i < count($all_tribuT); $i++ ){
            $tribut= $all_tribuT[$i];

            $all_partisans_tribuT=  $tributGService->getFullNameForAllMembers($tribut["table_name"]);/// [ [ "userID" => ... , "fullName" => ... ], ... ] 
            $tribuT_apropos= $tributTService->getApropos($tribut["table_name"]);

            for($j=0; $j< count($all_partisans_tribuT); $j++ ){
                $partisant= $all_partisans_tribuT[$j];

                $isExist= array_search(intval($partisant["userID"]), array_column($partisants, 'id'));
                if($isExist !== false){
                    array_push( $partisants[$isExist]["tribu"], $tribuT_apropos);
                }else{
                    $user = $userRepository->find(intval($partisant["userID"]));
                    if( !$user ){ continue; }
        
                    $single_user = [
                        "id" => intval($user->getId()),
                        "email" => $user->getEmail(),
                        "firstname" => $userService->getUserFirstName($user->getId()),
                        "lastname" => $userService->getUserLastName($user->getId()),
                        "status" => $tributGService->getCurrentStatus($tributG_name, $user->getId()),
                        "tribu" =>[ $tribuT_apropos ],
                    ];
        
                    array_push($partisants, $single_user);
                }
            }
        }

        return $this->json([
            "success" => true,
            "data" => $partisants,
            "message" => "ok"
        ], 200);
    }


    #[Route("/user/agenda/shares", name: "app_shares_agenda", methods:"POST")]
    public function shareAgendaForAll(
        Request $request,
        AgendaService $agendaService,
        TributGService $tributGService,
        Tribu_T_Service $tribuTService,
        UserRepository $userRepository,
        MailService $mailService,
        NotificationService $notificationService
    ){
        //// if no user connected
        if( !$this->getUser()){
            return $this->json([ "message" => "No authorization"],401);
        }

        $agendaTableName = $this->getUser()->getNomTableAgenda();  /// table agenda  name
        $table_partage_agenda = $this->getUser()->getNomTablePartageAgenda();  /// table partage agenda  name


        //// data in request post
        $req = json_decode($request->getContent(), true);
        extract($req); ///  $agendaID , $shareFor, $tribuTChecked, $listUsers [ [ "userID" => ... , "fullName" => ... ], ... ] ;

        ///Check if this agenda is already share
        if( $agendaService->isAleardyShare($table_partage_agenda, $agendaID)){
            return $this->json(["message" => "Vous avez déjà partagé cet agenda.","status" => "alreadyShare"]);
        }

        //// get agenda to share
        $agenda= $agendaService->getAgendaById($agendaTableName, intval($agendaID)); /// entity agenda


        if( count($listUsers ) > 0){
           
            ///Settings table Agenda Partage.
            $agendaService->setPartageAgenda($table_partage_agenda, $agendaID,$listUsers);

            ////send email 
            $this->sendEmailPartageAgenda(
                $userRepository,
                $mailService,
                $notificationService,
                $tributGService,
                $agenda,
                $listUsers
            );

            $tribu=  $tribuTChecked ? "Tribu T." : "Tribu G.";

            ///send notification : we have to send an email for invitation in agenda
            $notificationService->sendNotificationForOne(
                $this->getUser()->getId(),
                $this->getUser()->getId(),
                "Partage Agenda",
                "Vous  venez de partager votre agenda sur votre " . $tribu . "."
            );

            return $this->json(["message" => "Votre agenda est partagé." ,"status" => "shareSuccess"]);
        }

       

       
        if( intval($shareFor) === 1 ){ ///share for all

            if( !$tribuTChecked ){
                 
                $confidentialite_agenda= $agendaService->getConfidentialite($agendaTableName, $agendaID); /// Confidentialite : partager for ( tribu G or tribu T )

                if(array_key_exists("confid", $confidentialite_agenda)){
                    extract($confidentialite_agenda); /// $confid
                }

                if( $confid === "Tribu-G"){
                    $tribuG_name = $tributGService->getTableNameTributG($this->getUser()->getId()); /// table tribuG name

                    ////get information( userID, fullName ) for all user in this tribu G
                    $all_users_tribuG = $tributGService->getFullNameForAllMembers($tribuG_name); /// [ [ "userID" => ... , "fullName" => ... ], ... ] 

                    ///Settings table Agenda Partage.
                    $agendaService->setPartageAgenda($table_partage_agenda, $agendaID,$all_users_tribuG);

                    $this->sendEmailPartageAgenda(
                        $userRepository,
                        $mailService,
                        $notificationService,
                        $tributGService,
                        $agenda,
                        $all_users_tribuG
                    );


                    ///send notification : we have to send an email for invitation in agenda
                    $notificationService->sendNotificationForOne(
                        $this->getUser()->getId(),
                        $this->getUser()->getId(),
                        "Partage Agenda",
                        "Vous  venez de partager votre agenda sur votre Tribu G."
                    );

                }else if( $confid === "Tribu-T" ){ /// $confid === "Trigu-T";
                    
                    ///get all tribu T for this user 
                    $all_tribuT= $userRepository->getListTableTribuT();
                    
                    return $this->json(["message" => "Partage for tribu T", "status" => "tribuT", "all_tribugT" => $all_tribuT]);

                }else{ /// Moi uniquement

                }
            }else{

                $all_partisans_tribuT=  $tributGService->getFullNameForAllMembers($tribuTChecked); /// [ [ "userID" => ... , "fullName" => ... ], ... ] 

                ///Settings table Agenda Partage.
                $agendaService->setPartageAgenda($table_partage_agenda, $agendaID,$all_partisans_tribuT);


                $this->sendEmailPartageAgenda(
                    $userRepository,
                    $mailService,
                    $notificationService,
                    $tributGService,
                    $agenda,
                    $all_partisans_tribuT
                );

                ///send notification : we have to send an email for invitation in agenda
                $notificationService->sendNotificationForOne(
                    $this->getUser()->getId(),
                    $this->getUser()->getId(),
                    "Partage Agenda",
                    "Vous  venez de partager votre agenda sur votre Tribu " . $tribuTChecked
                );
            }

        }else{ /// send list of the user in tribu T or tribu G

            $confidentialite_agenda= $agendaService->getConfidentialite($agendaTableName, $agendaID); /// Confidentialite : partager for ( tribu G or tribu T )
            if(array_key_exists("confid", $confidentialite_agenda)){
                extract($confidentialite_agenda); /// $confid
            }

            if( $confid === "Tribu-G"){
                $tribuG_name = $tributGService->getTableNameTributG($this->getUser()->getId()); /// table tribuG name

                ////get information( userID, fullName ) for all user in this tribu G
                $all_users_tribuG = $tributGService->getFullNameForAllMembers($tribuG_name); /// [ [ "userID" => ... , "fullName" => ... ], ... ]

                return $this->json(["message" => "Share for same person in tribu G", "status" => "Not all tribu", "all_users_tribu" => $all_users_tribuG]);
            }else{

                if( !$tribuTChecked ){
                    ///get all tribu T for this user 
                    $all_tribuT= $userRepository->getListTableTribuT();
                    return $this->json(["message" => "Partage for tribu T", "status" => "tribuT", "all_tribugT" => $all_tribuT]);
                }else{
    
                    $all_partisans_tribuT=  $tributGService->getFullNameForAllMembers($tribuTChecked); /// [ [ "userID" => ... , "fullName" => ... ], ... ] 

                    return $this->json(["message" => "Share for same person in tribu G", "status" => "Not all tribu", "all_users_tribu" => $all_partisans_tribuT]);
                }
            }
        }
        return $this->json(["message" => "Votre agenda est partagé." ,"status" => "shareSuccess"]);
    }


    #[Route("/agenda/presence/send/link/{agenda_id}", name: "agenda_send_presence_link")]
    public function sendPresenceLink($agenda_id, 
        MailService $mailService, 
        AgendaService $agendaService, 
        UserRepository $userRepository,
        TributGService $tributGService,
        NotificationService $notification
    ): Response
    {

        $user = $this->getUser();

        if($user){

            $userId = $user->getId();
    
            //$email_from = $user->getEmail();
    
            $object = "Lien pour faire de la présence";
    
            $listParticipant = $agendaService->sendPresenceLink("partage_agenda_".$userId, $agenda_id);
    
            //$infos = array();
            $description = "";
        
            //$list = array();

            $body = $tributGService->getFullName($userId) . " vous a envoyé un lien pour votre présence à son agenda numéro " . $agenda_id . "
            .\n Veuillez vérifier le lien dans votre adresse email";
    
            if(count($listParticipant) > 0){
    
                foreach ($listParticipant as $key) {
                    $id = $key["user_id"];
                    $email_to = $userRepository->findOneBy(["id" => $id])->getEmail();
                    $link = $this->generateUrl("agenda_set_presence", array("table_partage_agenda" => "partage_agenda_".$userId, "agenda_id" => $agenda_id, "userId" => $id), UrlGeneratorInterface::ABSOLUTE_URL);
                    $mailService->sendEmail(
                        $email_to,
                        $tributGService->getFullName($id),
                        $object,
                        $description . "\nVeuillez cliquer le lien ci-dessous pour valider votre présence.\n" . $link
                    );
    
                    $agendaService->setTimeOut("partage_agenda_".$userId, $id, $agenda_id, 15, "M");

                    $notification->sendNotificationForTribuGmemberOrOneUser($userId, $id, "presence_link", $body, null);
        
                    //array_push($list,$email_to);
                    //array_push($infos, ["id" => $id, "fromName" => $tributGService->getFullName($userId), "email_from" => $email_from, "toName" => $tributGService->getFullName($id), "email_to" => $email_to]);
                }

                return $this->json("Lien bien envoyé");
    
            }else{
                return $this->json("Aucune invitation accepté");
            }
        }else{
            return $this->json("Vous êtes déconnecté ! Veuillez vous reconnecter !");
        }

    }

    #[Route("/agenda/set/presence/{table_partage_agenda}/{agenda_id}/{userId}", name: "agenda_set_presence")]
    public function setPresence(
        $table_partage_agenda,
        $agenda_id,
        $userId,
        MailService $mailService, 
        AgendaService $agendaService, 
        UserRepository $userRepository,
        TributGService $tributGService,
        NotificationService $notification
    ){

        $timeOut = $agendaService->getTimeOut($table_partage_agenda, $userId, $agenda_id);

        $now = new \DateTime();

        $bigSeconds = $now->getTimestamp();

        if($timeOut >= $bigSeconds){

            $agendaService->setPresence($table_partage_agenda, $userId, $agenda_id);

            /** SEND EMAIL FOR AGENDA CREATOR */
            $id_creator = explode("_", $table_partage_agenda)[2];
            $email_to_creator = $userRepository->findOneBy(["id" => $id_creator])->getEmail();
            $creator_name = $tributGService->getFullName($id_creator);
            // $email_from = $userRepository->findOneBy(["id" => $userId])->getEmail();
            // $senderName = $tributGService->getFullName($userId);

            $body = $creator_name . " vient de faire sa présence pour l'agenda numéro " . $agenda_id;

            $mailService->sendEmail(
                $email_to_creator,
                $creator_name,
                "Présence pour l'agenda numéro " . $agenda_id,
                $body
            );

            $notification->sendNotificationForTribuGmemberOrOneUser($userId, $id_creator, "presence_agenda", $body, null);

            return $this->redirectToRoute("agenda_presence_success");

        }else{
            return $this->redirectToRoute("agenda_presence_expired");
        }

    }

    #[Route("/agenda/presence/expired", name: "agenda_presence_expired")]
    public function presenceExpired() : Response
    {
        return $this->render('agenda/presence_expired.html.twig');
    }

    #[Route("/agenda/presence/success", name: "agenda_presence_success")]
    public function presenceSuccess() : Response
    {
        return $this->render('agenda/presence_success.html.twig');
    }

    #[Route("/api/user/agenda/get/all/{etab}", name: 'user_all_etab', methods: ["GET"])]
    public function getAllEtab(
        SerializerInterface $serializer,
        BddRestoRepository $bdd_resto_rep,
        $etab,
        GolfFranceRepository $golfFranceRepository
    ) {

        $results= [];

        if(!$this->getUser()){
            return $this->json([ "success" => false, "message" => "User not Connecter"]);
        }

        if($etab == "restaurant") {
            $response = $bdd_resto_rep->getAllEtab();
        }elseif ($etab == "golf") {
            $response = $golfFranceRepository->getALLGolf();
            //$response = [];
        }else{
            $response = [];
        }
        
        return $this->json([
            "success" => true,
            "results" => $response
        ],200);
    }

    #[Route("/api/user/agenda/get/{etab}/dep/{id}", name: 'etab_for_specific_dep', methods: ["GET"])]
    public function getAllEtabForSpecificDep(
        BddRestoRepository $bdd_resto_rep,
        $etab,
        $id,
        GolfFranceRepository $golfFranceRepository
    ) {

        if(!$this->getUser()){
            return $this->json([ "success" => false, "message" => "User not Connecter"]);
        }

        if($etab == "restaurant") {
            $response = $bdd_resto_rep->getEtabForSpecificDep($id);
        }elseif ($etab == "golf") {
            // $response = $golfFranceRepository->getGolfByDep("",$id);
            $response = $golfFranceRepository->getALLWithJoin($id);
        }else{
            $response = [];
        }
        
        return $this->json([
            "success" => true,
            "results" => $response
        ],200);
        
    }

    #[Route('/api/user/agenda/get/{etab}/pastille', name: 'user_etab_pastille', methods: ["GET"])]
    public function getAllRestoPastille(
        $etab,
        Tribu_T_Service $tribuTService,
        BddRestoRepository $bddRestoRepository,
        GolfFranceRepository $golfFranceRepository
    ){

        $results= [];

        if(!$this->getUser()){
            return $this->json([ "success" => false, "message" => "User not Connecter"]);
        }

        if($etab == "restaurant") {
            $response = $tribuTService->getAllRestoPastiledForAllTable($this->getUser()->getId());
            //// add adress
            foreach($response as $result){

                $resto = $bddRestoRepository->find(intval($result['id_resto']));
                
                if( $resto ){
                    $result["adresse"]= $resto->getNumvoie() . " " . $resto->getNomvoie() . " " . $resto->getCodpost() . " " . $resto->getVillenorm();
                    $result["tel"] = $resto->getTel();
                    $result["id_etab"] = $resto->getId();
                    array_push($results, $result);
                }
            }
        }elseif ($etab == "golf") {
            $response = $golfFranceRepository->getGolfAfaire();
            $results= $response;
        }else{
            $response = [];
        }

        return $this->json([
                "success" => true,
                "results" => $results
            ],200);
    }

    #[Route('/api/user/agenda/get/{etab}/pastille/dep/{id}', name: 'etab_pastille_for_specific_dep', methods: ["GET"])]
    public function getRestoPastilleForSpecificDep(
        $etab,
        $id,
        Tribu_T_Service $tribuTService,
        BddRestoRepository $bddRestoRepository,
        UserRepository $userRepository,
        GolfFranceRepository $golfFranceRepository
    ){

        $results= [];

        if(!$this->getUser()){
            return $this->json([ "success" => false, "message" => "User not Connecter"]);
        }

        if($etab == "restaurant") {
            $response = $tribuTService->getAllRestoPastiledForAllTable($this->getUser()->getId());
            foreach($response as $result){

                $resto = $bddRestoRepository->find(intval($result['id_resto']));
                
                if($resto){
                    $id_dep = $resto->getDep();
                    if($id_dep == $id){
                        $result["adresse"]= $resto->getNumvoie() . " " . $resto->getNomvoie() . " " . $resto->getCodpost() . " " . $resto->getVillenorm();
                        $result["id_etab"] = $resto->getId();
                        $result["tel"] = $resto->getTel();
                        $result["dep"] = $resto->getDep();
                        $result["departement"] = $resto->getDepName();
    
                        $tribu_t_list = $userRepository->getListTableTribuT();
    
                        foreach ($tribu_t_list as $key) {
                            $tableTribu = $key["table_name"];
                            $logo_path = $key["logo_path"];
                            $tableExtension = $tableTribu . "_restaurant";
                            if($tribuTService->checkExtension($tableTribu, "_restaurant") > 0){
                                if($tribuTService->checkExtensionId($tableExtension, $resto->getId())){
                                    $result["tribu"] = $tableTribu;
                                    $result["logoTribu"] = $logo_path;
                                }
                            }
                        }
                        array_push($results, $result);
                    }
                }
            }
        }elseif ($etab == "golf") {
            $response = $golfFranceRepository->getGolfAfaire();
            $results= $response;
        }else{
            $response = [];
        }

        return $this->json([
                "success" => true,
                "results" => $results
            ],200);
    }

    #[Route("/api/user/agenda/dep/list", name: 'agenda_all_dep', methods: ["GET"])]
    public function getAllDepForEtab(
        DepartementRepository $departementRepository,
        ) {

        return $this->render('agenda/listDep.twig', [
            "departements" => $departementRepository->getDep()
        ]);
        
    }

    // TODO codinsee
    #[Route("/api/user/agenda/arrondissement/list/{dep}", name: 'agenda_all_arrondissement', methods: ["GET"])]
    public function getAllArrondissement(CodeinseeRepository $codeinseeRepository, $dep) {

        $codeIns = $codeinseeRepository->getAllCodinsee($dep);

        return $this->render('agenda/listArrondissement.twig', [
            "codeIns" => $codeIns
        ]);
        
    }


    #[Route("/api/user/agenda/arrondissement/restaurant/codeinse", name: 'agenda_resto_codinse_arrondissement', methods: ["GET"])]
    public function getAllRestoByArrondissement(BddRestoRepository $bddResto, Request $request) {

        $dataRequest = $request->query->all();
        $codeDep = $dataRequest["id_dep"];
        $codinsee = $dataRequest["codinsee"];
        
        $datas = $bddResto->getRestoByCodinsee($codinsee, $codeDep);
        
        return $this->json($datas);
        
    }
    

    /** 
     *
     * 
     * @Route("/api/agenda/etab/{nom_dep}/{id_dep}/detail/{id_restaurant}", name="api_agenda_detail_etab", methods="GET" )
     */
    public function detailRestaurant(
        Request $request,
        BddRestoRepository $bddResto,
        $nom_dep,
        $id_dep,
        $id_restaurant
    ): Response {
        
        $details= $bddResto->getOneRestaurant($id_dep, $id_restaurant)[0];

        if(str_contains($request->getPathInfo(), '/api/restaurant')){
            return $this->json([
                "details" => $details,
                "id_dep" => $id_dep,
                "nom_dep" => $nom_dep,
            ], 200);
        }

        return $this->render("agenda/detail_resto.html.twig", [
            "details" => $details,
            "id_dep" => $id_dep,
            "nom_dep" => $nom_dep,
        ]);
    }

    #[Route("/user/tribu/partage/agenda", name: 'app_partage_agenda')]
    public function partageAgenda( 
        Request $request,
        Status $status,
        Tribu_T_Service $tributTService,
        TributGService $tributGService,
        UserRepository $userRepository,
        EntityManagerInterface $entityManager,
        ConsumerRepository $consumerRepository,
        SupplierRepository $supplierRepository
    )
    {
        $user = $this->getUser();
        $userId = $user->getId();

        $userType = $user->getType();

        if ($userType == "consumer") {

            $profil = $entityManager->getRepository(Consumer::class)->findByUserId($userId);
        } else {

            $profil = $entityManager->getRepository(Supplier::class)->findByUserId($userId);
        }
        
        // $allTribuT = $tributTService->getAllTribuT($userId);
        $allTribuT = $userRepository->getListTableTribuT();

        // $tableTribuTName = $request->query->get("tribuTName");
        // $TribuTName = $tributTService->getPartisanOfTribuT($allTribuT);
        // dd($TribuTName);
        $tableTribuGName = $profil[0]->getTributG();

        $allTribuG = $tableTribuGName;

        $results = [];

        $under_tributG = $tributGService->getAllUserWithRoles($allTribuG);
        if ($under_tributG === 0) {
            goto quit;
        }

        foreach ($under_tributG as $tributG) {

            $user = $userRepository->find(intval($tributG["user_id"]));
            if ($user->getType() === "consumer") {
                $user_profil = $consumerRepository->findOneBy(['userId' => $tributG["user_id"]]);
            } else {
                $user_profil = $supplierRepository->findOneBy(['userId' => $tributG["user_id"]]);
            }
            // dd($user_profil);
            $result = [
                "id" => $tributG["user_id"],
                "roles" => $tributG["roles"],
                "email" => $user->getEmail(),
                "firstname" => $user_profil->getFirstname(),
                "lastname" => $user_profil->getLastname(),
                "commune" => $user_profil->getCommune(),
                "photoProfil" => $user_profil->getphotoProfil(),
                "isVerified" => $user_profil->getIsVerifiedTributGAdmin()
            ];

            if($tributG["user_id"] != $userId)
                array_push($results, $result);
        }

        quit:
        $userConnected = $status->userProfilService($this->getUser());
        $statusProfile = $status->statusFondateur($this->getUser());
        return $this->render('agenda/partage_agenda.html.twig',[
            "profil" => $statusProfile["profil"],
            "statusTribut" => $statusProfile["statusTribut"],
            "userConnected" => $userConnected,
            "allTribuTs" => $allTribuT,
            "allTribuG" => $allTribuG,
            "results" => $results,
        ]);
    }

}
