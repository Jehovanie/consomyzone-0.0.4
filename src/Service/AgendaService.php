<?php



namespace App\Service;



use PDO;

use function PHPUnit\Framework\equalTo;

class AgendaService extends PDOConnexionService

{



    public function getAgendaByDate($table, $datetime){

        // $membre = "SELECT * FROM $table where (from_date like '%$datetime%' or to_date like '%$datetime%') and isActive = 1";

        $membre = "SELECT * FROM $table where (from_date like :datetime   or to_date like :datetime ) and isActive = :isActive";
        $stm = $this->getPDO()->prepare($membre);

        $stm->bindParam(":datetime",  '%' . $datetime . '%');
        $stm->bindParam(":isActive", 1);

        $stm->execute();
        $result = $stm->fetchAll(PDO::FETCH_ASSOC);

        return $result;
    }


    public function getAgendaByType($tableName, $type){
        // $membre = "SELECT * FROM $tableName where type = '$type' and isActive = 1";

        $membre = "SELECT * FROM $tableName where type = :type and isActive = :isActive";
        $stm = $this->getPDO()->prepare($membre);

        $stm->bindParam(":type", $type);
        $stm->bindParam(":isActive", 1);

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
        // $agenda_rqt = "SELECT id FROM $tableName where title like '%$title%' and type like '%$type%' and description like '%$description%' and user_id = $user_id";
        $agenda_rqt = "SELECT id FROM $tableName where title like :title and type like :type and description like :description and user_id = :user_id";
        $stm = $this->getPDO()->prepare($agenda_rqt);

        $stm->bindParam(":title", '%' . $title . '%');
        $stm->bindParam(":type", '%' . $type . '%');
        $stm->bindParam(":description", '%' . $description . '%');
        $stm->bindParam(":user_id", $user_id);

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

        // $agenda = "SELECT * FROM $tableName where (from_date like '%$date%' or to_date like '%$date%') and isActive =1";
        $agenda = "SELECT * FROM $tableName where (from_date like :date or to_date like :date ) and isActive =1";
        $stm = $this->getPDO()->prepare($agenda);

        $stm->bindParam(":date", '%' . $date . '%');
        $stm->bindParam(":isActive", 1);

        $stm->execute();
        $result = $stm->fetchAll(PDO::FETCH_ASSOC);

        return  (count($result) > 0) ? true : false;
    }



    public function getActionAgenda($tableName, $id, $user_id){

        // $action_agenda = "SELECT * FROM $tableName WHERE user_id = $user_id and agenda_id = $id and status = 1";
        $action_agenda = "SELECT * FROM $tableName WHERE user_id = :user_id and agenda_id = :id and status = :status";
        $stm_a = $this->getPDO()->prepare($action_agenda);

        $stm->bindParam(":user_id", $user_id);
        $stm->bindParam(":id", $id);
        $stm->bindParam(":status", 1);

        $stm_a->execute();
        $result_a = $stm_a->fetchAll(PDO::FETCH_ASSOC);

        return $result_a;
    }



    public function detailAgenda($table_name, $id){

        // $agenda = "SELECT * FROM $table_name WHERE id = $id and isActive = 1";
        $agenda = "SELECT * FROM $table_name WHERE id = :id and isActive = :isActive";
        $stm = $this->getPDO()->prepare($agenda);

        $stm->bindParam(":id", $id);
        $stm->bindParam(":isActive", 1);

        $stm->execute();
        $result = $stm->fetchAll(PDO::FETCH_ASSOC);

        return $result;
    }



    public function getStatusAgenda($table_name, $id, $user_id, $type){

        // $action_agenda = "SELECT status FROM $table_name WHERE user_id = $user_id and agenda_id = $id and type_action ='$type'";
        $action_agenda = "SELECT status FROM $table_name WHERE user_id = :user_id and agenda_id = :id and type_action = :type";
        $stm_a = $this->getPDO()->prepare($action_agenda);
        
        $stm->bindParam(":user_id", $user_id);
        $stm->bindParam(":id", $id);
        $stm->bindParam(":type", $type);

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

        // $agenda = "SELECT user_id, count(user_id) as nombre FROM $table_name WHERE agenda_id = $id and type_action like '%$type%' and status =1 group by user_id";
        $agenda = "SELECT user_id, count(user_id) as nombre FROM $table_name WHERE agenda_id = :id and type_action like :type and status = :status group by user_id";
        $stm = $this->getPDO()->prepare($agenda);

        $stm->bindParam(":id", $id);
        $stm->bindParam(":type", '%' . $type . '%' );
        $stm->bindParam(":status", 1);

        $stm->execute();
        $result = $stm->fetchAll(PDO::FETCH_ASSOC);

        return $result;
    }

    public function getNumberOfParticipant($table_agenda_action, $id){

        // $agenda = "SELECT count(*) as NB FROM $table_agenda_action WHERE agenda_id = $id and type_action like '%Participer%' and status =1";
        $agenda = "SELECT count(*) as NB FROM $table_agenda_action WHERE agenda_id = :id and type_action like :type_action and status = :status";
        $stm = $this->getPDO()->prepare($agenda);

        $stm->bindParam(":id", $id);
        $stm->bindParam(":type_action", '%Participer%' );
        $stm->bindParam(":status", 1);

        $stm->execute();
        $result = $stm->fetch(PDO::FETCH_ASSOC);

        return intval($result["NB"]);
    }

    public function getMaxOfParticipant($table_agenda, $id){

        // $agenda = "SELECT participant as NB FROM $table_agenda WHERE id = $id and isActive =1";
        $agenda = "SELECT participant as NB FROM $table_agenda WHERE id = :id and isActive = :isActive";
        $stm = $this->getPDO()->prepare($agenda);

        $stm->bindParam(":id", $id);
        $stm->bindParam(":status", 1);

        $stm->execute();
        $result = $stm->fetch(PDO::FETCH_ASSOC);

        return intval($result["NB"]);
    }

    public function getTypeBy($table_agenda, $id){

        $agenda = "SELECT type as typ FROM $table_agenda WHERE id = :id";
        $stm = $this->getPDO()->prepare($agenda);

        $stm->bindParam(":id", $id);

        $stm->execute();
        $result = $stm->fetch(PDO::FETCH_ASSOC);
        
        return $result["typ"];
    }

    public function getUserIdAndTypeBy($table_agenda, $id){

        $agenda = "SELECT user_id, type FROM $table_agenda WHERE id = :id";
        $stm = $this->getPDO()->prepare($agenda);

        $stm->bindParam(":id", $id);

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
        SELECT id as id, 0 as isPelleted, denomination_f, concat(numvoie, ' ', typevoie, ' ', nomvoie, ' ', compvoie, ', ', codpost, ' ', commune) as adresse FROM bdd_resto where denomination_f like '%$value%' AND id NOT IN (Select extensionId from $table_resto_pastille)";

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

        $sql = "INSERT INTO $table_resto_pastille (denomination_f, extensionId) VALUES (?, ?) ON DUPLICATE KEY UPDATE denomination_f= ?";

        $stmt = $this->getPDO()->prepare($sql);
        $stmt->bindParam(1, $name);
        $stmt->bindParam(2, $resto_id);
        $stmt->bindParam(3, $name);
        $stmt->execute();

    }

    /**
     * @author Tommy
     */

    public function createEvent($nom_table_agenda,$agenda) {
        extract($agenda); //// $title, $message, $type, $status, $restaurant, $adresse, $file_type, $file_path, $dateStart, $dateEnd, $heureStart, $heureEnd, $participant

        $statement = $this->getPDO()->prepare(
            "INSERT INTO $nom_table_agenda 
            (title, 
            name, 
            description, 
            isEtabCMZ, 
            isGolfCMZ, 
            isRestoCMZ, 
            type, 
            status, 
            adresse, 
            file_type, 
            file_path, 
            dateStart, 
            dateEnd, 
            heure_debut, 
            heure_fin, 
            max_participant, 
            place_libre,
            user_id) 
            values (
                :title, 
                :name, 
                :description, 
                :isEtabCMZ, 
                :isGolfCMZ, 
                :isRestoCMZ, 
                :type, 
                :status, 
                :adresse, 
                :file_type, 
                :file_path, 
                :dateStart, 
                :dateEnd, 
                :heure_debut, 
                :heure_fin, 
                :max_participant, 
                :place_libre,
                :user_id)"
        );

        if(!$isEtabCMZ){
            $isGolfCMZ = false;
            $isRestoCMZ = false;
        }

        $statement->bindParam(':title', $title);
        $statement->bindParam(':name', $name);
        $statement->bindParam(':description', $description);
        $statement->bindParam(':isEtabCMZ', $isEtabCMZ);
        $statement->bindParam(':isGolfCMZ', $isGolfCMZ);
        $statement->bindParam(':isRestoCMZ', $isRestoCMZ);
        $statement->bindParam(':type', $type);
        $statement->bindParam(':status', $status);
        $statement->bindParam(':adresse', $adresse);
        $statement->bindParam(':file_type', $file_type);
        $statement->bindParam(':file_path', $file_path);
        $statement->bindParam(':dateStart', $dateStart);
        $statement->bindParam(':dateEnd', $dateEnd);
        $statement->bindParam(':heure_debut', $heureStart);
        $statement->bindParam(':heure_fin', $heureEnd);
        $statement->bindParam(':max_participant', $participant);
        $statement->bindParam(':place_libre', $place_libre);
        $statement->bindParam(':user_id', $user_id);

        $result = $statement->execute();

        return $result;

    }

    public function updateEventCalendar($nom_table_agenda,$agenda, $agendaId) {

        extract($agenda); 

        $statement = $this->getPDO()->prepare(
            "UPDATE $nom_table_agenda SET title=?, name=?, description=?, isEtabCMZ=?, isGolfCMZ=?, 
            isRestoCMZ=?, type=?, status=?, adresse=?, file_type=?, file_path=?, dateStart=?, 
            dateEnd=?, heure_debut=?, heure_fin=?, max_participant=? WHERE id=?"
        );

        if(!$isEtabCMZ){
            $isGolfCMZ = false;
            $isRestoCMZ = false;
        }

        $statement->bindParam(1, $title);
        $statement->bindParam(2, $name);
        $statement->bindParam(3, $description);
        $statement->bindParam(4, $isEtabCMZ);
        $statement->bindParam(5, $isGolfCMZ);
        $statement->bindParam(6, $isRestoCMZ);
        $statement->bindParam(7, $type);
        $statement->bindParam(8, $status);
        $statement->bindParam(9, $adresse);
        $statement->bindParam(10, $file_type);
        $statement->bindParam(11, $file_path);
        $statement->bindParam(12, $dateStart);
        $statement->bindParam(13, $dateEnd);
        $statement->bindParam(14, $heureStart);
        $statement->bindParam(15, $heureEnd);
        $statement->bindParam(16, $participant);
        $statement->bindParam(17, $agendaId);

        $result = $statement->execute();

        return $result;

    }



    public function deleteAgendaUpdate($tableName, $id){

        $query = "DELETE FROM $tableName WHERE id = ?";

        $stmt = $this->getPDO()->prepare($query);
        $stmt->execute([$id]);
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
     * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
     * 
     * @param string $table_agenda : name of the table agenda
     * 
     * @return array // [ [ "title" => ... , "dateStart" => ... , "timeStart" => ...,"timeEnd" => ... ], ... ];
     */
    public function getAllAgenda($table_agenda){
        $results = [ ];

        $statement = $this->getPDO()->prepare("SELECT * FROM $table_agenda;");
        $statement->execute();

        $all_agenda= $statement->fetchAll(PDO::FETCH_ASSOC);
        foreach($all_agenda as $agenda){
            $temps= [
                "id" => $agenda['id'],
                "title" =>($agenda["title"]) ? $agenda["title"] : substr($agenda["message"], 0, 15) . "...",
                "type" => $agenda["type"],
                "name" => $agenda["name"],
                "description" => $agenda["description"],
                "adresse" => $agenda["adresse"],
                "isEtabCMZ" => $agenda["isEtabCMZ"],
                "isGolfCMZ" => $agenda["isGolfCMZ"],
                "isRestoCMZ" => $agenda["isRestoCMZ"],
                "dateStart" => $agenda["dateStart"],
                "dateEnd" => $agenda["dateEnd"],
                "timeStart" => $agenda["heure_debut"],
                "timeEnd" => $agenda["heure_fin"],
            ];

            array_push($results,$temps);
        }

        return $results ; // [ [ "title" => ... , "dateStart" => ... , "timeStart" => ...,"timeEnd" => ... ], ... ];
    }

    
    /**
     * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
     * 
     * @param string $table_agenda : name of the table agenda
     * @param int $id : id of the agenda
     * 
     * @return array 
     */
    public function getOneAgenda($table_agenda, $id){
        $results = [ ];

        $statement = $this->getPDO()->prepare("SELECT * FROM $table_agenda where id= $id;");
        $statement->execute();

        $agenda= $statement->fetch(PDO::FETCH_ASSOC);
        
        return $agenda ;
    }



    /**
     * @author Tommy
     */
    public function getAgenda($nom_table_agenda, $agenda_partage_name){

        $results = [];

        $sql="SELECT * FROM $nom_table_agenda  ORDER BY id ASC";
        $stmt = $this->getPDO()->prepare($sql);
        $stmt->execute();
        $all_agenda = $stmt->fetchAll(PDO::FETCH_ASSOC);

        foreach ($all_agenda as $single_agenda) {
            $agendaID= $single_agenda['id'];

            $sql="SELECT count(*) as count_share FROM $agenda_partage_name WHERE agenda_id= $agendaID";
            $stmt = $this->getPDO()->prepare($sql);
            $stmt->execute();
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
           
            $single_agenda["isAlreadyShare"] = intval($result["count_share"]) > 0 ? true : false;

            array_push($results,$single_agenda);
        }
        return $results ;
    }


    /**
     * @author Tommy
     */
    public function createTableAgenda($table_agenda_name){
        $sql= "CREATE TABLE IF NOT EXISTS ".$table_agenda_name ."(".
            "`id` int(11) PRIMARY KEY AUTO_INCREMENT  NOT NULL,".
            "`title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,".
            "`description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,".
            "`type` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,".
            "`confidentialite` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`confidentialite`)),".
            "`adresse` varchar(255) NOT NULL,".
            "`name` varchar(255) DEFAULT NULL,".
            "`restaurant` varchar(255) DEFAULT NULL,".
            "`dateStart` date DEFAULT NULL,".
            "`dateEnd` date DEFAULT NULL,".
            "`heure_debut` time NOT NULL,".
            "`heure_fin` time NOT NULL,".
            "`file_type` varchar(40) DEFAULT NULL,".
            "`file_path` varchar(500) DEFAULT NULL,".
            "`status` tinyint(1) NOT NULL DEFAULT 0,".
            "`max_participant` int(11) NOT NULL DEFAULT 0,".
            "`place_libre` int NOT NULL DEFAULT 0,".
            "`isEtabCMZ` tinyint(1) DEFAULT 0,".
            "`isGolfCMZ` tinyint(1) DEFAULT 0,".
            "`isRestoCMZ` tinyint(1) DEFAULT 0,".
            "`user_id` int(11) DEFAULT NULL".
            " ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci";
        $stmt = $this->getPDO()->prepare($sql);
        $stmt->execute();
    }


    /**
     * @author Jehovanie RAMANDRIJOEL   <jehovanieram@gmail.com>
     * 
     */
    public function createTablePartageAgenda($table_partage_agenda_name){
        $sql= "CREATE TABLE IF NOT EXISTS ". $table_partage_agenda_name .
            "( `id` int(11) AUTO_INCREMENT PRIMARY KEY  NOT NULL,".
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
            $userReceiverId=intval($ass_userID);

            $sql= "INSERT INTO  $table_agenda_partage_name (agenda_id,user_id)
            SELECT agenda_id,user_id  FROM (SELECT :agenda_id as agenda_id, :user_id as user_id)  as tmp 
            WHERE NOT EXISTS (SELECT 1 FROM $table_agenda_partage_name ag WHERE ag.agenda_id = tmp.agenda_id and ag.user_id=tmp.user_id);";

            $stmt = $this->getPDO()->prepare($sql);
            
            $stmt->bindParam(":agenda_id", $agendaID, PDO::PARAM_INT);
            $stmt->bindParam(":user_id", $userReceiverId ,PDO::PARAM_INT);

            $stmt->execute();
        }
    }

    /**
     * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>, modified by Nantenaina 08/09/2023
     * 
     * Handle confirm form the user ( may be accept or reject )
     * 
     * @param int $userID_sender : ID of the user own agenda to partage
     * @param int $agendaID : ID of the agenda partage 
     * @param int $userID : ID of the user to confirm this agenda partage
     * @param string $type : type of  what the user accepted the invitation
     * @param string $isAccepted: boolean (accept or refused)
     * 
     * @return {any} $alias: -1 : erreur on agenda ID: agenda n'existe pas
     *                      0 : max participant attteint
     *                      1 : agenda accepter;
     */
    public function setConfirmPartageAgenda($userID_sender, $userID_receiver, $agendaID,$response){

        $agenda_tabl_sender= "agenda_" . $userID_sender;
        $agenda_tabl_receiver= "agenda_" . $userID_receiver;
        $agenda_partage_table= "partage_agenda_" . $userID_sender;

        $accepted=intval($response);
        $userID_receiver=intval($userID_receiver);
        $agendaID=intval($agendaID);

        $isAllReadyAccepted=$this->isAlreadyAccepted($userID_sender, $userID_receiver, $agendaID);

        if(intval($response) === 1 && !$isAllReadyAccepted){
            $place_Libre=$this->checkFreePlace($userID_sender, $userID_receiver,  $agendaID)["place_libre"];
            
            $place_libre_new=$place_Libre-1;
            
            $sql1="UPDATE $agenda_tabl_sender set place_libre= :place_libre WHERE id = :agenda_id";
            $stmnt=$this->getPDO()->prepare($sql1);

            $stmnt->bindParam(":place_libre",$place_libre_new);
            $stmnt->bindParam(":agenda_id", $agendaID);

            $stmnt->execute();

            $rowInAgenda=$this->getAgendaBYIDPartage($agenda_tabl_sender,$agendaID);

            $this->createEvent($agenda_tabl_receiver,$rowInAgenda);
            
            $sql2="UPDATE $agenda_partage_table set accepted= :accepted WHERE agenda_id = :agenda_id AND user_id = :user_id";
            $stmnt2=$this->getPDO()->prepare($sql2);
            
            $stmnt2->bindParam(":accepted",$accepted,PDO::PARAM_INT);
            $stmnt2->bindParam(":agenda_id", $agendaID, PDO::PARAM_INT);
            $stmnt2->bindParam(":user_id", $userID_receiver, PDO::PARAM_INT);

            $stmnt2->execute();
            return array("response"=>"accepted");

        }elseif(intval($response) === 1 &&  $isAllReadyAccepted){
            return array("response"=>"already_accepted");
        }elseif (intval($response) === 0){

            $sql2="UPDATE $agenda_partage_table set accepted= :accepted WHERE agenda_id = :agenda_id AND user_id = :user_id";
            $stmnt2=$this->getPDO()->prepare($sql2);
            
            $stmnt2->bindParam(":accepted",$accepted,PDO::PARAM_INT);
            $stmnt2->bindParam(":agenda_id", $agendaID, PDO::PARAM_INT);
            $stmnt2->bindParam(":user_id", $userID_receiver, PDO::PARAM_INT);

            $stmnt2->execute();
            return array("response"=>"Rejected");
        }
       
    }

    /**
     * @author NANTENAINA <email>
     * check if accepted
     */
    function isAlreadyAccepted($userID_sender, $userID_receiver, $agendaID){
        $agenda_partage_table= "partage_agenda_" . $userID_sender;
        
        // check if already
        $sql="SELECT accepted FROM $agenda_partage_table WHERE agenda_id = :agenda_id AND user_id = :user_id";
        $agendaID = intval($agendaID);
        $userID_receiver = intval($userID_receiver);
        $stmt = $this->getPDO()->prepare($sql);
        $stmt->bindParam(":agenda_id", $agendaID, PDO::PARAM_INT);
        $stmt->bindParam(":user_id", $userID_receiver, PDO::PARAM_INT);
        $stmt->execute();
        $isAccepted =  $stmt->fetch(PDO::FETCH_ASSOC);
        return intval($isAccepted["accepted"]) === 1 ? true: false;
    }


    /**
     * @author NANTENAINA <email>
     * check free place 
     */
    function checkFreePlace($userID_sender, $userID_receiver,  $agendaID){
        $agenda_tabl_sender= "agenda_" . $userID_sender;
        $agenda_tabl_receiver= "agenda_" . $userID_receiver;
        $agenda_partage_table= "partage_agenda_" . $userID_sender;
        
        // check if there are already free place 
        $sql="SELECT place_libre FROM $agenda_tabl_sender WHERE id= $agendaID";
        $stmt = $this->getPDO()->prepare($sql);
        $stmt->execute();
        $place_Libre=  $stmt->fetch(PDO::FETCH_ASSOC);
       
        return $place_Libre;
    }

    /**
     * @author  Nantenaina <email>
     */
    function getAgendaBYIDPartage($table_agenda_name,$agendaID){
        $sql="SELECT title, 
        name, 
        description, 
        isEtabCMZ, 
        isGolfCMZ, 
        isRestoCMZ, 
        type, 
        status, 
        adresse, 
        file_type, 
        file_path, 
        dateStart, 
        dateEnd, 
        heure_debut as heureStart, 
        heure_fin as heureEnd, 
        max_participant as participant, 
        place_libre,
        user_id FROM $table_agenda_name WHERE id= $agendaID";
        $stmt = $this->getPDO()->prepare($sql);
        $stmt->execute();
        $tab_agenda=  $stmt->fetch(PDO::FETCH_ASSOC);

        return $tab_agenda;
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
     * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
     * 
     * Get single agenda by their ID.
     * 
     * @param string $table_agenda_name : name of the table agenda
     * @param string $agendaID : ID of the agenda to partage
     * 
     * @return agenda entity
     */
    public function getAgendaById($table_agenda_name, $agendaID){

        $sql="SELECT id, message, file_path, date, heure_debut, heure_fin, restaurant, JSON_VALUE(confidentialite, '$.confidentility') as organisateur, JSON_VALUE(type, '$.type') as goal  FROM $table_agenda_name WHERE id= $agendaID";
        $stmt = $this->getPDO()->prepare($sql);
        $stmt->execute();
        $tab_agenda=  $stmt->fetch(PDO::FETCH_ASSOC);
        return $tab_agenda;
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

    /**
     * @author Nantenaina
     * où: on Utilise cette fonction dans la rubrique inscription cmz, 
     * localisation du fichier: dans AgendaService.php,
     * je veux: créer une table historique de des invitations pour agenda pour chaque partisan
     * si une personne s'inscrit, on créera une table historique de des invitations pour agenda
     * @param int $userId : identifiant de l'utilisateur
     */
    public function createAgendaStoryTable($userId){

        $sql = "CREATE TABLE IF NOT EXISTS agenda_" . $userId . "_story" . " (
  
          id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT, 
          email VARCHAR(250) NOT NULL,
          partisan VARCHAR(250) NOT NULL,
          datetime timestamp NOT NULL DEFAULT current_timestamp()
          )ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci";
      
      $stmt = $this->getPDO()->prepare($sql);
  
      $stmt->execute();
    
    }

    /**
     * @author Nantenaina
     * où: on Utilise cette fonction dans la rubrique partage agenda pour l'utilisateur non inscrit de cmz, 
     * localisation du fichier: dans AgendaService.php,
     * je veux: insérer un partisan temporaire
     */
    public function insertUserTemp($user,$email,$password,$userRepository,$entityManager){
        
        $user->setPseudo("partisanAnonyme");
        $user->setEmail($email);
        $user->setPassword($password);
        $user->setVerifiedMail(false);
        $user->setIsConnected(false);
        
        ////setting roles for user admin.
        if (count($userRepository->findAll()) === 0) {
            $user->setRoles(["ROLE_GODMODE"]);
        }else {
            $user->setRoles(["ROLE_USER"]);
        }

        ///property temp with default value, wait this user have an ID
        $user->setType("Type");
        $user->setTablemessage("tablemessage");
        $user->setTablenotification("tablenotification");
        $user->setTablerequesting("tablerequesting");
        $user->setNomTableAgenda("agenda");
        $user->setNomTablePartageAgenda("partage_agenda");

        ///save the user
        $entityManager->persist($user);

        $entityManager->flush();

        $userId = $user->getId();

        $this->createTableAgenda("agenda_" . $userId);

        return $userId;

    }

    /**
     * @author Nantenaina
     * où: on Utilise cette fonction dans la rubrique partage agenda cmz, 
     * localisation du fichier: dans AgendaService.php,
     * je veux: ajouter l'historique de l'email invité
     * @param string $tableStoryAgenda : tableStoryAgenda
     * @param string $email : l'email du partisan
     * @param string $partisan : le nom du partisan
     */
    public function addAgendaStory($tableStoryAgenda, $email, $partisan,$agendaId){

        $db = $this->getPDO();
        $sql = "INSERT INTO $tableStoryAgenda (email, partisan,agenda_id) values (:email, :partisan,:agenda_id)";

        $stmt = $db->prepare($sql);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':partisan', $partisan);
        $stmt->bindParam(":agenda_id",$agendaId);

        $stmt->execute();
    }

    /**
     * @author Nantenaina
     * où: on Utilise cette fonction dans la rubrique historique invitation agenda agenda cmz, 
     * localisation du fichier: dans AgendaService.php,
     * je veux: voir l'historique d'invitation de mon agenda
     * @param string $$tableStoryAgenda : tableStoryAgenda
     */
    public function invitationStoryAgenda($tableStoryAgenda,$tablePartageAngenda){
        $db = $this->getPDO();
        
        // $sql = "SELECT * FROM $tableStoryAgenda";
        // $sql="SELECT * FROM ".$tableStoryAgenda ." as story left join `user` as u on story.email=u.email;";
        $sql="Select * FROM `".$tablePartageAngenda."`as tbl1 left join".
             "(SELECT story.id as storyId, story.email as storyEmail,".
                "story.agenda_id as storyAgendaId,".
                "story.datetime as storyDateTime, ".
                "u.id as userID, ".
                "u.type as userType FROM `".$tableStoryAgenda."` as story left join `user` as u on story.email=u.email) as tbl2 ".
                "on tbl1.user_id=tbl2.userID and tbl1.agenda_id=tbl2.storyAgendaId;";
        $stmt = $db->prepare($sql);

        $stmt->execute();

        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return $results;
    }

}