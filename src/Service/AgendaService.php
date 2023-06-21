<?php



namespace App\Service;



use PDO;

use function PHPUnit\Framework\equalTo;

class AgendaService extends PDOConnexionService

{



    public function getAgendaByDate($table, $datetime){



        $membre = "SELECT * FROM $table where (from_date like '%$datetime%' or to_date like '%$datetime%') and isActive = 1";



        $stm = $this->getPDO()->prepare($membre);



        $stm->execute();



        $result = $stm->fetchAll(PDO::FETCH_ASSOC);



        return $result;

    }



    public function getAgendaByType($tableName, $type){



        $membre = "SELECT * FROM $tableName where type = '$type' and isActive = 1";



        $stm = $this->getPDO()->prepare($membre);



        $stm->execute();



        $result = $stm->fetchAll(PDO::FETCH_ASSOC);



        return $result;

    }



    public function createAgenda($tableName, $title, $type, $resto, $participant, $from, $to, $lat, $lng, $user_id, $description){

        

        $sql = "INSERT INTO $tableName (`title`, `type`, `restaurant`, `participant`, `from_date`, `to_date`, `lat`, `lng`, `user_id`, `description`) VALUES (?, ?, ?, ?,?,?,?,?,?,?)";

        $stmt = $this->getPDO()->prepare($sql);

        $stmt->bindParam(1, $title);

        $stmt->bindParam(2, $type);

        $stmt->bindParam(3, $resto);

        $stmt->bindParam(4, $participant);

        $stmt->bindParam(5, $from);

        $stmt->bindParam(6, $to);

        $stmt->bindParam(7, $lat);

        $stmt->bindParam(8, $lng);

        $stmt->bindParam(9, $user_id);

        $stmt->bindParam(10, $description);

        $stmt->execute();

        // getting id of last agenda created

        $agenda_rqt = "SELECT id FROM $tableName where title like '%$title%' and type like '%$type%' and description like '%$description%' and user_id = $user_id";

        $stm = $this->getPDO()->prepare($agenda_rqt);

        $stm->execute();

        return $stm->fetch(PDO::FETCH_ASSOC)["id"];


    }



    public function updateAgenda($tableName, $statu, $id){

        $sql = "UPDATE $tableName set status=? where id=?";

        $stm = $this->getPDO()->prepare($sql);

        $stm->bindParam(1, $statu);

        $stm->bindParam(2, $id);

        $stm->execute();

    }



    public function hasAgenda($tableName, $date){

        $agenda = "SELECT * FROM $tableName where (from_date like '%$date%' or to_date like '%$date%') and isActive =1";

        $stm = $this->getPDO()->prepare($agenda);



        $stm->execute();



        $valiny = "";



        $result = $stm->fetchAll(PDO::FETCH_ASSOC);

        if (count($result) > 0) {

            $valiny = true;

        } else {

            $valiny = false;

        }



        return $valiny;

    }



    public function getActionAgenda($tableName, $id, $user_id){

        

        $action_agenda = "SELECT * FROM $tableName WHERE user_id = $user_id and agenda_id = $id and status = 1";



        $stm_a = $this->getPDO()->prepare($action_agenda);



        $stm_a->execute();



        $result_a = $stm_a->fetchAll(PDO::FETCH_ASSOC);



        return $result_a;

    }



    public function detailAgenda($table_name, $id){

        

        $agenda = "SELECT * FROM $table_name WHERE id = $id and isActive = 1";



        $stm = $this->getPDO()->prepare($agenda);



        $stm->execute();



        $result = $stm->fetchAll(PDO::FETCH_ASSOC);



        return $result;

    }



    public function getStatusAgenda($table_name, $id, $user_id, $type){



        $action_agenda = "SELECT status FROM $table_name WHERE user_id = $user_id and agenda_id = $id and type_action ='$type'";



        $stm_a = $this->getPDO()->prepare($action_agenda);



        $stm_a->execute();



        $result_a = $stm_a->fetchAll(PDO::FETCH_ASSOC);



        return $result_a;

    }



    public function insertActionAgenda($table_name, $type, $user_id, $id, $status_ok){



        $sql = "INSERT INTO $table_name (`type_action`, `user_id`, `agenda_id`, `status`) VALUES (?, ?, ?, ?)";



        $stmt = $this->getPDO()->prepare($sql);

        $stmt->bindParam(1, $type);

        $stmt->bindParam(2, $user_id);

        $stmt->bindParam(3, $id);

        $stmt->bindParam(4, $status_ok);

        $stmt->execute();



    }



    public function updateActionAgenda($tableName, $status_final, $user_id, $id, $type){



        $sql2 = "UPDATE $tableName SET status =? WHERE user_id =? and agenda_id =? and type_action =?";

        $stm2 = $this->getPDO()->prepare($sql2);

        $stm2->bindParam(1, $status_final);

        $stm2->bindParam(2, $user_id);

        $stm2->bindParam(3, $id);

        $stm2->bindParam(4, $type);

        $stm2->execute();

        

    }



    public function deleteAgenda($table_name,$val,$user_id,$id){

        

        $sql2 = "UPDATE $table_name SET isActive = ? WHERE user_id =? and id =?";

        $stm2 = $this->getPDO()->prepare($sql2);

        $stm2->bindParam(1, $val);

        $stm2->bindParam(2, $user_id);

        $stm2->bindParam(3, $id);

        $stm2->execute();

    }



    public function modifyAgenda($table_name,$title,$desc,$from,$to,$lat,$lng, $resto, $participant,$id){

        $sql2 = "UPDATE $table_name SET title = ?, description =?, from_date =? , to_date =? , lat =?, lng =?, restaurant=?, participant=? WHERE id =?";

        $stm2 = $this->getPDO()->prepare($sql2);

        $stm2->bindParam(1, $title);

        $stm2->bindParam(2, $desc);

        $stm2->bindParam(3, $from);

        $stm2->bindParam(4, $to);

        $stm2->bindParam(5, $lat);

        $stm2->bindParam(6, $lng);

        $stm2->bindParam(7, $resto);

        $stm2->bindParam(8, $participant);

        $stm2->bindParam(9, $id);

        $stm2->execute();

    }



    public function getListUser($table_name, $id, $type){



        $agenda = "SELECT user_id, count(user_id) as nombre FROM $table_name WHERE agenda_id = $id and type_action like '%$type%' and status =1 group by user_id";



        $stm = $this->getPDO()->prepare($agenda);



        $stm->execute();



        $result = $stm->fetchAll(PDO::FETCH_ASSOC);



        return $result;

    }

    public function getNumberOfParticipant($table_agenda_action, $id){

        $agenda = "SELECT count(*) as NB FROM $table_agenda_action WHERE agenda_id = $id and type_action like '%Participer%' and status =1";

        $stm = $this->getPDO()->prepare($agenda);

        $stm->execute();

        $result = $stm->fetch(PDO::FETCH_ASSOC);

        return intval($result["NB"]);

    }

    public function getMaxOfParticipant($table_agenda, $id){

        $agenda = "SELECT participant as NB FROM $table_agenda WHERE id = $id and isActive =1";

        $stm = $this->getPDO()->prepare($agenda);

        $stm->execute();

        $result = $stm->fetch(PDO::FETCH_ASSOC);

        return intval($result["NB"]);

    }

    public function getTypeBy($table_agenda, $id){

        $agenda = "SELECT type as typ FROM $table_agenda WHERE id = $id";

        $stm = $this->getPDO()->prepare($agenda);

        $stm->execute();

        $result = $stm->fetch(PDO::FETCH_ASSOC);
        
        return $result["typ"];

    }

    public function getUserIdAndTypeBy($table_agenda, $id){

        $agenda = "SELECT user_id, type FROM $table_agenda WHERE id = $id";

        $stm = $this->getPDO()->prepare($agenda);

        $stm->execute();

        $result = $stm->fetch(PDO::FETCH_ASSOC);

        return $result;

    }

    /*
     * @author Elie Fenohasina <elie@geomadagascar.com>
     * @param string $table_resto_pastille
     * @param string $value filtre denomination
     * @return array 
     */

    public function getRestoAgenda($table_resto_pastille, $value){

        $membre = "SELECT id, 1 as isPelleted, denomination_f, '' as adresse from $table_resto_pastille where denomination_f like '%$value%' UNION 
        SELECT clenum as id, 0 as isPelleted, denomination_f, concat(numvoie, ' ', typevoie, ' ', nomvoie, ' ', compvoie, ', ', codpost, ' ', commune) as adresse FROM bdd_resto where denomination_f like '%$value%' AND clenum NOT IN (Select id_resto from $table_resto_pastille)";

        $stm = $this->getPDO()->prepare($membre);

        $stm->execute();

        $result = $stm->fetchAll(PDO::FETCH_ASSOC);

        return $result;
    }

    /*
     * @author Elie Fenohasina <elie@geomadagascar.com>
     * @param string $table_resto_pastille
     * @param string $name denomination
     * @param string $resto_id id retaurant bdd_resto
     */

    public function saveRestaurant($table_resto_pastille, $name,$resto_id){

        $sql = "INSERT INTO $table_resto_pastille (denomination_f, id_resto) VALUES (?, ?) ON DUPLICATE KEY UPDATE denomination_f= ?";

        $stmt = $this->getPDO()->prepare($sql);
        $stmt->bindParam(1, $name);
        $stmt->bindParam(2, $resto_id);
        $stmt->bindParam(3, $name);
        $stmt->execute();

    }

    /**
     * @author Tommy
     */

    public function createEvent($nom_table_agenda,$a) {

        $sql="INSERT INTO $nom_table_agenda(message,type,confidentialite".
        ",file_path,date,heure_debut,heure_fin,file_type,status,restaurant,adresse,max_participant) VALUES(".
        ":message,:type,:confidentialite,:file_path,:date,:heure_debut,".
        ":heure_fin,:file_type,:status,:restaurant,:adresse,:max_participant)";
        $stmt = $this->getPDO()->prepare($sql);
        return  $stmt->execute($a);
       

    }

    /**
     * @author Tommy
     */

    public function updateEvent($nom_table_agenda, $a)
    {

        $sql = "UPDATE $nom_table_agenda SET 
                    message= :message,
                    type= :type ,
                    confidentialite= :confidentialite,
                    file_path= :file_path,
                    heure_debut= :heure_debut,
                    heure_fin= :heure_fin,
                    file_type= :file_type,
                    restaurant= :restaurant,
                    adresse= :adresse,
                    max_participant =:max_participant
                WHERE id= :id";

        $stmt = $this->getPDO()->prepare($sql);
        return  $stmt->execute($a);
    }

    /**
     * @author Tommy
     */

    public function updateEventStatus($nom_table_agenda, $a)
    {

        $sql = "UPDATE $nom_table_agenda SET 
                    status= :status
                WHERE id= :id";

        $stmt = $this->getPDO()->prepare($sql);
        return  $stmt->execute($a);
    }


    /**
     * @author Tommy
     */
    public function getAgenda($nom_table_agenda){
        $sql="SELECT * FROM $nom_table_agenda  ORDER BY id ASC";
        $stmt = $this->getPDO()->prepare($sql);
       $stmt->execute();
       return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }


    /**
     * @author Tommy
     */
    public function createTableAgenda($table_agenda_name){
        $sql= "CREATE TABLE $table_agenda_name (".
            "`id` int(11) AUTO_INCREMENT PRIMARY KEY  NOT NULL,".
            "`message` text DEFAULT NULL,".
            "`type` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`type`)),".
            "`confidentialite` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`confidentialite`)),".
            "`file_path` varchar(500) DEFAULT NULL,".
            "`date` date NOT NULL,".
            "`heure_debut` time NOT NULL,".
            "`heure_fin` time NOT NULL,".
            "`file_type` varchar(40) NOT NULL,".
            " `status` tinyint(1) DEFAULT 0,".
            "`restaurant` varchar(500) DEFAULT NULL,".
            "`adresse` varchar(500) DEFAULT NULL,".
            "`max_participant` int(11) NOT NULL DEFAULT 0".
           " ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci";
        $stmt = $this->getPDO()->prepare($sql);
        $stmt->execute();
    }


    /**
     * @author Jehovanie RAMANDRIJOEL   <jehovanieram@gmail.com>
     * 
     */
    public function createTableEventFollowed($table_event_followed_name){
        $sql= "CREATE TABLE $table_event_followed_name (".
            "`id` int(11) AUTO_INCREMENT PRIMARY KEY  NOT NULL,".
            "`user_id` int(11) NOT NULL,".
            "`agenda_id` int(11) NOT NULL".
           " ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci";
        $stmt = $this->getPDO()->prepare($sql);
        $stmt->execute();
    }

    /**
     * @author Jehovanie RAMANDRIJOEL   <jehovanieram@gmail.com>
     * 
     */
    public function createTablePartageAgenda($table_partage_agenda_name){
        $sql= "CREATE TABLE $table_partage_agenda_name (".
            "`id` int(11) AUTO_INCREMENT PRIMARY KEY  NOT NULL,".
            "`agenda_id` int(11) NOT NULL,".
            "`user_id` int(11) NOT NULL,".
            "`origin` varchar(200) DEFAULT NULL,".
            "`accepted` tinyint(4) NOT NULL DEFAULT -1,".
            "`presence` tinyint(4) NOT NULL DEFAULT 0".
           " ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci";
        $stmt = $this->getPDO()->prepare($sql);
        $stmt->execute();
    }


    /**
     * @author Nantenaina <nantenainasoa39@gmail.com>
     */
    public function sendPresenceLink($partage_agenda_table, $agenda_id){


        $statement = $this->getPDO()->prepare("SELECT user_id FROM $partage_agenda_table WHERE accepted  = 1 AND agenda_id  = $agenda_id");

        $statement->execute();

        $result = $statement->fetchAll(PDO::FETCH_ASSOC);

        return $result;

    }

    /**
     * @author Nantenaina <nantenainasoa39@gmail.com>
     */
    public function setPresence($partage_agenda_table, $user_id, $agenda_id){

        $sql = "UPDATE $partage_agenda_table set presence = ?  WHERE user_id = ? AND agenda_id = ?";

        $stmt = $this->getPDO()->prepare($sql);

        $stmt->execute([1, $user_id, $agenda_id]);

    }

    public function getTimeOut($partage_agenda_table, $user_id, $agenda_id){

        $statement = $this->getPDO()->prepare("SELECT presence_time_out FROM $partage_agenda_table WHERE user_id  = $user_id AND agenda_id  = $agenda_id");

        $statement->execute();

        $result = $statement->fetch(PDO::FETCH_ASSOC);

        return $result["presence_time_out"];

    }

    public function setTimeOut($partage_agenda_table, $user_id, $agenda_id, $timeOut, $format){

        $now = new \DateTime();

        $bigSeconds = $now->getTimestamp();

        $time = 0;

        if($format == "J"){
            $time = $bigSeconds + $timeOut*86400;
        }elseif($format == "H") {
            $time = $bigSeconds + $timeOut*3600;
        }elseif($format == "M"){
            $time = $bigSeconds + $timeOut*60;
        }else{
            $time = $bigSeconds + $timeOut;
        }

        $sql = "UPDATE $partage_agenda_table set presence_time_out = ?, time_now = ?  WHERE user_id = ? AND agenda_id = ?";

        $stmt = $this->getPDO()->prepare($sql);

        $stmt->execute([$time, $bigSeconds, $user_id, $agenda_id]);

    }



    /**
     * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
     * 
     * @param string $table_partage_user_sender : name of the table partage agenda
     * @param string $agendaID : ID of the agenda to partage
     * @param array $userID : user id check if already accepted this agenda
     * 
     * 
     * @return boolean
     */
    public function chackIfAlreadyAcceptedAgenda($table_partage_user_sender, $agendaID, $userID ){

        $sql="SELECT origin,accepted FROM $table_partage_user_sender WHERE agenda_id= $agendaID AND user_id= $userID";
        $stmt = $this->getPDO()->prepare($sql);
        $stmt->execute();
        $result=  $stmt->fetch(PDO::FETCH_ASSOC);

        extract($result); /// $origin, $accepted

        return ( $origin && intval($accepted) !== -1);
    }

    /**
     * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
     * 
     * Confidentialite : partager for ( tribu G or tribu T )
     * 
     * @param string $table_agenda_name : name of the table agenda
     * @param string $agendaID : ID of the agenda
     * 
     * @return array associative [ "confid" => ... ]
     */
    public function getConfidentialite($table_agenda_name, $agendaID){
        $sql="SELECT JSON_VALUE(confidentialite, '$.confidentility') as confid FROM $table_agenda_name where id= $agendaID";

        $stmt = $this->getPDO()->prepare($sql);
        $stmt->execute();

       return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    /**
     * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
     * 
     * Settings table Agenda Partage.
     * 
     * @param string $table_agenda_partage_name : name of the table partage agenda
     * @param string $agendaID : ID of the agenda to partage
     * @param array $arrayAssUserId : array  associative for all users  with key 'userID'. ex [ [ 'userID' => 1 ] , ... ]
     * 
     * 
     * @return void
     */
    public function setPartageAgenda($table_agenda_partage_name, $agendaID, $arrayAssUserId){

        foreach($arrayAssUserId as $ass_userID ){
            $sql = "INSERT INTO $table_agenda_partage_name (`agenda_id`, `user_id`) VALUES (?,?)";

            $stmt = $this->getPDO()->prepare($sql);
    
            $stmt->bindParam(1, $agendaID);
            $stmt->bindParam(2, $ass_userID["userID"]);

            $stmt->execute();
        }
    }

    /**
     * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
     * 
     * Handle confirm form the user ( may be accept or reject )
     * 
     * @param int $userID_sender : ID of the user own agenda to partage
     * @param int $agendaID : ID of the agenda partage 
     * @param int $userID : ID of the user to confirm this agenda partage
     * @param string $type : type of  what the user accepted the invitation
     * @param string $isAccepted: boolean (accept or refused)
     * 
     * @return int $alias: -1 : erreur on agenda ID: agenda n'existe pas
     *                      0 : max participant attteint
     *                      1 : agenda accepter;
     */
    public function setConfirmPartageAgenda(int $userID_sender, int $agendaID,int $userID, string $type, bool $isAccepted){

        $agenda_table= "agenda_" . $userID_sender;
        $agenda_partage_table= "partage_agenda_" . $userID_sender;

        ////get max_participant agenda ( table agenda )
        $sql="SELECT max_participant FROM $agenda_table WHERE id= $agendaID";
        $stmt = $this->getPDO()->prepare($sql);
        $stmt->execute();
        $tab_max_participant=  $stmt->fetch(PDO::FETCH_ASSOC);
        
        if(!array_key_exists("max_participant", $tab_max_participant)){
            return -1;
        }
        extract($tab_max_participant); /// $max_participant

        /// counte user already accepted this agenda
        $sql="SELECT count(*) as nbr_accepted_agenda FROM $agenda_partage_table WHERE accepted='1'";
        $stmt = $this->getPDO()->prepare($sql);
        $stmt->execute();
        $tab_nbr_accepted_agenda=  $stmt->fetch(PDO::FETCH_ASSOC);
        extract($tab_nbr_accepted_agenda); /// $nbr_accepted_agenda

        if( intval($nbr_accepted_agenda) ===  intval($max_participant)){
            return 0;
        }

        $sql = "UPDATE $agenda_partage_table set origin=?, accepted=? where agenda_id=? and user_id=?";

        $stm = $this->getPDO()->prepare($sql);
        $stm->bindParam(1, $type);
        $stm->bindParam(2, $isAccepted);
        $stm->bindParam(3, $agendaID);
        $stm->bindParam(4, $userID);
        $stm->execute();

        return 1;
    }


    /**
     * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
     * 
     * Persiste agenda to the user accepte.
     * 
     * @param int $userID : ID of the user to confirm this agenda partage
     * @param int $agendaID : agenda ID to accepted
     * 
     * @return void
     */
    public function setEventFollowed($userID, $agendaID){
        $eventFollowed_table= "event_followed_" . $userID;

        $sql = "INSERT INTO $eventFollowed_table (`user_id`, `agenda_id`) VALUES (?,?)";

        $stmt = $this->getPDO()->prepare($sql);
        $stmt->bindParam(1, $userID);
        $stmt->bindParam(2, $agendaID);

        $stmt->execute();
    }

    /**
     * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
     * 
     * Check if this agenda is already share
     * 
     * @param string $table_agenda_partage_name : name of the table partage agenda
     * @param string $agendaID : ID of the agenda to partage
     * 
     * @return boolean (true of false)
     */
    public function isAleardyShare($table_agenda_partage_name, $agendaID){

        $sql="SELECT COUNT(agenda_id) as agendaID_count FROM $table_agenda_partage_name WHERE agenda_id= $agendaID";
        $stmt = $this->getPDO()->prepare($sql);
        $stmt->execute();
        $tab_agendaID_count=  $stmt->fetch(PDO::FETCH_ASSOC);

        extract($tab_agendaID_count); /// $agendaID_count

        return (intval($agendaID_count) > 0 ) ? true : false;
    }
    /** 
     * @author tommy
     */
    public function getRestoPastilled($joinedTribuT,$ownedTribuT,$servTribuT){
        $finalResult = []; 
        $finalResult1=[];
        if( isset($joinedTribuT["tribu_t"])){
            foreach($joinedTribuT["tribu_t"] as $k=>$v){
                if (!is_int($k)) {
                    $this->notNesterArray($v, $k, $joinedTribuT["tribu_t"],$servTribuT, $finalResult1);
                } else {
                    $this->isNesterArray($v,$servTribuT, $finalResult);
                }
            }
        }

       
        if( isset($ownedTribuT["tribu_t"])){
            foreach ($ownedTribuT["tribu_t"] as $k => $v) {
                if (!is_int($k)) {
                    $this->notNesterArray($v, $k, $joinedTribuT["tribu_t"],$servTribuT, $finalResult1);
                } else {
                    $this->isNesterArray($v,$servTribuT, $finalResult);
                }
            }
        }
        
        return array($finalResult,$finalResult1);
    }


    public function notNesterArray($v,$k,$a,$servTribuT,&$finalResult)
    {   
        if($k==="extension" && $v == "restaurant"){
           $r= $servTribuT->getRestoPastilles($a["name"]."_restaurant", $a["name"]. "_restaurant_commentaire");
            array_push($finalResult, array("path" => $a["logo_path"], $r));
        }
    }
    public function isNesterArray($v,$servTribuT, &$finalResult)
    {
        
        foreach ($v as $k1=>$v2) {
            if ($k1 === "extension" && $v2 == "restaurant") {
                $r=$servTribuT->getRestoPastilles($v["name"] . "_restaurant", $v["name"] . "_restaurant_commentaire");
                array_push($finalResult,array("path"=>$v["logo_path"],$r));
            }
            
        }
        
        
    }
    /**
     * @param string $tableAgendaUser table agenda user
     * @param string $tableAgendaUser table publication of tribu_T ot tribu_G user
     */
    public function shareAgendaInPublication($tableAgendaUser,$tableTribuPublication,$idUser,$userName,$agendaId){
        $sql= "INSERT INTO $tableTribuPublication(user_id,publication,confidentiality,photo,userfullname)".
        "VALUES( $idUser  , (SELECT concat('$userName',' vous invite à participer à l\'événement ', ".
        "message, ' qui aura lieu au ',restaurant, ' à l\'adresse ', adresse, ' merci de réserver dès maintenant votre participation ".
		"car les places sont limitées.', ' kixxxdjeu',id) from $tableAgendaUser where id=$agendaId), 1 , ". 
        "(SELECT file_path  from $tableAgendaUser  where id=$agendaId),'$userName')";
        $stmt = $this->getPDO()->prepare($sql);
        return $stmt->execute();
    }
}