<?php



namespace App\Service;



use PDO;



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

        $sql="INSERT INTO $nom_table_agenda(message,type,confidentialite,file_path,date,heure_debut,heure_fin,file_type,status) VALUES(
            :message,:type,:confidentialite,:file_path,:date,:heure_debut,:heure_fin,:file_type,:status)";
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
                    file_type= :file_type
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
           " `status` tinyint(1) DEFAULT 0".
           " ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci";
        $stmt = $this->getPDO()->prepare($sql);
        $stmt->execute();
    }


}