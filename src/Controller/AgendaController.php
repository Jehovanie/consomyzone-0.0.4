<?php



namespace App\Controller;



use App\Entity\Consumer;

use App\Entity\Supplier;

use App\Service\AgendaService;

use App\Service\TributGService;

use App\Service\Tribu_T_Service;

use App\Service\NotificationService;

use Doctrine\ORM\EntityManagerInterface;

use Symfony\Component\HttpFoundation\Request;

use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;



class AgendaController extends AbstractController

{



    private $agendaService;

    private $entityManager;



    public function __construct(AgendaService $agendaService, EntityManagerInterface $entityManagerInterface)

    {

        $this->agendaService = $agendaService;

        $this->entityManager = $entityManagerInterface;
    }



    /**

     * @Route("user/get_agenda_by_date/{table}/{datetime}" , name="get_agenda_by_date", methods={"POST", "GET"})

     */

    public function getAgendaByDate($table, $datetime)

    {



        return  $this->json($this->agendaService->getAgendaByDate($table, $datetime));
    }



    /**

     * @Route("user/get_agenda_by_type/{tribut_name}/{type}" , name="get_agenda_by_type", methods={"POST", "GET"})

     */

    public function getAgendaByType($tribut_name, $type)

    {



        return  $this->json($this->agendaService->getAgendaByType($tribut_name, $type));
    }



    /**

     * @Route("user/new_agenda/{tribut_name}" , name="new_agenda")

     */

    public function createAgenda($tribut_name, Request $request)

    {



        $user = $this->getUser();



        $user_id = $user->getId();



        $requestContent = json_decode($request->getContent(), true);



        $title = $requestContent["title"];

        $type = $requestContent["type"];

        $from = $requestContent["from"];

        $to = $requestContent["to"];

        $lat = $requestContent["lat"];

        $lng = $requestContent["lng"];

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

    public function hasAgenda($tribut_name, $date)

    {

        return  $this->json($this->agendaService->hasAgenda($tribut_name, $date));
    }



    /**

     * @Route("user/tribut/get-detail-agenda/{table_name}/{id}" , name="detail_agenda", methods={"POST","GET"})

     */

    public function detailAgenda($table_name, $id, TributGService $tributGService)

    {

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

    public function setActionAgenda($table_name, $id, Request $request)

    {

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

     * @Route("user/tribut/delete/{table_name}/{id}" , name="delete_agenda", methods={"POST"})

     */

    public function deleteAgenda($table_name, $id, Request $request)

    {

        $user = $this->getUser();



        $user_id = $user->getId();



        $requestContent = json_decode($request->getContent(), true);



        $val = $requestContent["isActive"];



        $this->agendaService->deleteAgenda($table_name, $val, $user_id, $id);



        return $this->json('Suppression avec succès');
    }

    /**

     * @Route("user/tribut/modify_agenda/{table_name}/{id}" , name="modify_agenda", methods={"POST"})

     */

    public function modifyAgenda($table_name, $id, Request $request)

    {

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

    public function getListUser($table_name, $id, $type)

    {

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

     public function shareAgenda($type , $table_origin, $id_agenda, $table_dest)

     {
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
    public function getRestaurant($table_resto_pastille, $value)
    {

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
    public function saveRestaurant($table, Request $request)
    {
        $user_id = $this->getUser()->getId();
        $requestContent = json_decode($request->getContent(), true);

        $resto = $requestContent["name"];
        $id_resto = $requestContent["id_resto"];

        $this->agendaService ->saveRestaurant($table, $resto, $id_resto);

        return $this->json("Restaurant bien sauvegardé");

    }
}