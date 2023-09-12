<?php

namespace App\Controller;

use App\Entity\Consumer;
use App\Entity\Supplier;
use App\Service\AgendaService;
use App\Service\TributGService;
use App\Service\NotificationService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class TribuGAgendaController extends AbstractController
{

    private $agendaService;
    private $tributGService;

    public function __construct(
        AgendaService $agendaService,
        TributGService $tributGService
    ){
        $this->agendaService = $agendaService;
        $this->tributGService = $tributGService;
    }


    #[Route('user/tribug/hasagenda/{date}', name: 'app_tribuG_agenda')]
    public function hasAgenda($date): Response
    {
        $tributG= $this->tributGService->getTableNameTributG($this->getUser()->getId());
        $agenda_table = $tributG . "_agenda";

        return  $this->json($this->agendaService->hasAgenda($agenda_table, $date));
    }


   
    #[Route('user/tribug/getAgendaByDate/{date}', name: 'app_tribuG_get_agenda')]
    public function getAgendaByDate($date):Response
    {
        $tributG= $this->tributGService->getTableNameTributG($this->getUser()->getId());
        $agenda_table = $tributG . "_agenda";

        return $this->json($this->agendaService->getAgendaByDate($agenda_table, $date));
    }

    #[Route("user/tribug/agenda/{type}" , name: "app_tribuG_agenda_type")]
    public function getAgendaByType($type)
    {
        $tributG= $this->tributGService->getTableNameTributG($this->getUser()->getId());
        $agenda_table = $tributG . "_agenda";

        return  $this->json($this->agendaService->getAgendaByType($agenda_table, $type));
    }

    #[Route("user/tribug/newAgenda" , name: "app_tribuG_new_agenda")]
    public function newAgenda(Request $request):Response
    {
        $user = $this->getUser();
        $user_id = $user->getId();

        $requestContent = json_decode($request->getContent(), true);
        extract($requestContent); /// $title , $type , $from , $to , $lat ,  $lng , $resto, $participant, $des 
        $description = $desc;

        $tributG= $this->tributGService->getTableNameTributG($this->getUser()->getId());
        $agenda_table = $tributG . "_agenda";

        $id_agenda = $this->agendaService->createAgenda($agenda_table, $title, $type, $resto, $participant, $from, $to, $lat, $lng, $user_id, $description);

        $this->agendaService->insertActionAgenda($agenda_table.'_action', "Participer", $user_id, $id_agenda, 1);

        //Modification by Elie
        //Sending notifications to members of Tribu G

        $membre = $this->tributGService->getAllTributG($tributG); // [ [ "user_id" => ... ], ... ]

        $notif_service = new NotificationService();

        $content = $this->tributGService->getFullName($user_id). " a crée un ".$type." à partir du ".$from." au ".$to . " 
        si vous avez interéssé. <a class='d-block btn btn-primary w-70 mt-2 mx-auto text-center' href='#'>Voir plus...</a>";

        $notif_service->sendNotificationForMany($user_id,$membre,"Agenda", $content);


        return  $this->json([
            "message" => $type." enregistré avec succès",
            "agendaId"=> $id_agenda 
        ], 201 );

    }

    #[Route("user/tribug/agenda/details/{id}" , name: "app_tribuG_agenda_details")]
    public function detailAgenda( $id, TributGService $tributGService, EntityManagerInterface $entityManager)
    {
        $tributG= $this->tributGService->getTableNameTributG($this->getUser()->getId());
        $table_name = $tributG . "_agenda";
        $tableName = $table_name . "_action";

        $user = $this->getUser();
        $user_id = $user->getId();

        $regex = "/\_agenda+$/";

        $table_tribu = preg_replace($regex, "", $table_name);

        // $tribu_t = new Tribu_T_Service();

        $tribu = $tributGService->showRightTributName($table_tribu);

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



        $userFullName = $tributGService->getFullName($result[0]["user_id"]);



        $userType = $user->getType();

        $profil = "";

        if ($userType == "consumer") {

            $profil = $entityManager->getRepository(Consumer::class)->findByUserId($user_id);
        } else {

            $profil = $entityManager->getRepository(Supplier::class)->findByUserId($user_id);
        }

        $list_tribu_t = json_decode($user->getTribuT(), true);


        if (count($result) > 0) {

            return $this->render('tribu_g/agenda/detail_agenda.html.twig', [
                
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

    #[Route("user/tribug/agenda/{id}/update" , name:"app_tribuG_agenda_update" , methods : "PUT")]
    public function updateAgenda(
        $id,
        Request $request,
    ){
        $requestContent = json_decode($request->getContent(), true);
        extract($requestContent); ///$title , $from , $to , $desc , $lat, $lng,  $resto, $participant

        $tributG= $this->tributGService->getTableNameTributG($this->getUser()->getId());
        $table_name = $tributG . "_agenda";
        $tableName = $table_name . "_action";

        $this->agendaService->modifyAgenda($table_name, $title, $desc, $from, $to, $lat, $lng, $resto, $participant, $id);

        return $this->json([
            "message" => 'Agenda à jour!',
            "agendaId" => $id,
        ], 202);

    }

    #[Route("user/tribuG/agenda/{id}/delete",name:"app_tribuG_agenda_delete", methods: "DELETE" )]
    public function deleteTribuG(
        $id,
        Request $request,
    ){
        $user = $this->getUser();
        $user_id = $user->getId();

        $tributG= $this->tributGService->getTableNameTributG($this->getUser()->getId());
        $agenda_table = $tributG . "_agenda";

        $requestContent = json_decode($request->getContent(), true);
        $val = $requestContent["isActive"];
        $this->agendaService->deleteAgenda($agenda_table, $val, $user_id, $id);

        return $this->json('Suppression avec succès');
    }


    #[Route("user/tribuG/agenda/update-state/{id}", name:"app_tributG_agenda_update_state" , methods:"PUT")]
    public function updateStateAgenda(
        $id,
        Request $request,
    ){
        $user = $this->getUser();

        $tributG= $this->tributGService->getTableNameTributG($this->getUser()->getId());
        $agenda_table = $tributG . "_agenda";
        
        $requestContent = json_decode($request->getContent(), true);

        $status = $requestContent["status"];

        $this->agendaService->updateAgenda($agenda_table, $status, $id);

        return  $this->json("Agenda bien upgradé" , 202);
    }


    #[Route("user/tribuG/agenda-list/{id}/{type}" , name: "app_tribuG_agenda_list" , methods : "GET")]
    public function getListUserRelated($id, $type)
    {
        $tributG= $this->tributGService->getTableNameTributG($this->getUser()->getId());
        $agenda_table_action = $tributG . "_agenda_action";

        $list = $this->agendaService->getListUser($agenda_table_action, $id, $type);///agenda_action /// [ [ user_id, count(user_id) as nombre] , ... ]

        $tableau = array();
        for ($i = 0; $i < count($list); $i++) {

            $tab = [
                "user_id" => $list[$i]["user_id"],
                "userFullName" => $this->tributGService->getFullName($list[$i]["user_id"]),
                "nombre"=>$list[$i]["nombre"]
            ];

            array_push($tableau, $tab);
        }

        //dd($tableau);

        return $this->json($tableau , 200);
    }


    #[Route("user/tribuG/agenda/set-action/{id}" , name: "app_tribuG_set_action" , methods: "POST")]
    public function setActionAgenda($id, Request $request)
    {
        $user = $this->getUser();
        $user_id = $user->getId();

        
        $tributG= $this->tributGService->getTableNameTributG($this->getUser()->getId());
        $agenda_table = $tributG . "_agenda";
        $agenda_table_action = $tributG . "_agenda_action";


        $requestContent = json_decode($request->getContent(), true);
        $type = $requestContent["type"];

        $verbe = "";
        $result_a = $this->agendaService->getStatusAgenda($agenda_table_action, $id, $user_id, $type);  ///agenda_action

        if (count($result_a) == 0) {

            $status_ok = 1;
            $this->agendaService->insertActionAgenda($agenda_table_action, $type, $user_id, $id, $status_ok); ///agenda_action

            $verbe = $type == "Participer" ? "a participé":"a partagé";
        } else {
            if($type == "Participer"){

                $state = $result_a[0]["status"];

                $status_final = $state == 1 ? 0 : 1;

                $conjug = $state == 1 ? "a annulé sa participation sur" : "a participé";

                $verbe = $conjug ;//$type == "Participer" ? $conjug:"a partagé";

                $this->agendaService->updateActionAgenda($agenda_table_action, $status_final, $user_id, $id, $type); ///agenda_action
            }else{

                $this->agendaService->insertActionAgenda($agenda_table_action, $type, $user_id, $id, 1); ///agenda_action

                $verbe =" a partagé ";

            }
            
        }

        $membre = $this->agendaService->getUserIdAndTypeBy($agenda_table , $id);

        $notif_service = new NotificationService();

        if($user_id != $membre["user_id"]){

            $content = $this->tributGService->getFullName($user_id)." ". $verbe ." votre ".$membre["type"]." que vous avez créé.
            <a href='/user/tribut/get-detail-agenda/" .$agenda_table. "/" .$id. "'> Voir plus...</a>";

            $notif_service->sendNotificationForOne($user_id, $membre["user_id"], "Action agenda", $content );

        }

        return $this->json("Action bien fait!");
    }


}
