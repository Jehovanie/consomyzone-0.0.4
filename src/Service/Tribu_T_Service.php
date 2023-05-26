<?php



namespace App\Service;

use ArgumentCountError;
use Exception;
use PDO;
use PDOException;

class Tribu_T_Service extends PDOConnexionService

{



    public function createTribuTable($tableName, $user_id, $name, $description)

    {



        $db = $_ENV["DATABASENAME"];



        $query = "SHOW TABLES FROM $db like 'tribu_t_" . $user_id . "_" . $tableName . "'";



        $sql = $this->getPDO()->query($query);



        $resultat = $sql->rowCount();



        $output = 0;



        if ($resultat > 0) {



            $output = 0;

        } else {

            $sql = "CREATE TABLE tribu_t_" . $user_id . "_" . $tableName . " (

                id VARCHAR(300) NOT NULL PRIMARY KEY , 

                user_id int(11) NULL,
                
                roles VARCHAR(300) NOT NULL, 

                status TINYINT(1) DEFAULT 0, 

                datetime timestamp NOT NULL DEFAULT current_timestamp(),

                email VARCHAR(255) NULL
				
				)ENGINE=InnoDB";



            $this->getPDO()->exec($sql);



            $data = "Insert into tribu_t_" . $user_id . "_" . $tableName . " (id, user_id, roles, status) values (UUID(), $user_id, 'Fondateur', 1)";



            $final = $this->getPDO()->exec($data);



            if ($final > 0) {

                $output = "tribu_t_" . $user_id . "_" . $tableName;

                $query = "CREATE TABLE " . $output . "_publication(

                    id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT, 

                    user_id int(11) NOT NULL,

                    publication VARCHAR(250) NOT NULL,

                    confidentiality TINYINT(1) NOT NULL,

                    photo VARCHAR(250),

                    userfullname VARCHAR(250) NOT NULL,

                    datetime timestamp NOT NULL DEFAULT current_timestamp(),

                    FOREIGN KEY(user_id) REFERENCES user(id)

                    ON DELETE CASCADE

                    ON UPDATE CASCADE

                    )ENGINE=InnoDB";



                $final2 = $this->getPDO()->exec($query);



                if ($final2 == 0) {

                    $sql = "CREATE TABLE " . $output . "_commentaire(

                        id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT, 

                        user_id int(11) NOT NULL,

                        pub_id int(11) NOT NULL,

                        commentaire VARCHAR(250) NOT NULL,

                        audioname VARCHAR(250) NULL,

                        userfullname VARCHAR(250) NOT NULL,

                        datetime timestamp NOT NULL DEFAULT current_timestamp(),

                        FOREIGN KEY(user_id) REFERENCES user(id),

                        FOREIGN KEY(pub_id) REFERENCES " . $output . "_publication(id)

                        ON DELETE CASCADE

                        ON UPDATE CASCADE

                        )ENGINE=InnoDB";



                    $this->getPDO()->exec($sql);



                    $sql = "CREATE TABLE " . $output . "_reaction(

                        id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT, 

                        user_id int(11) NOT NULL,

                        pub_id int(11) NOT NULL,

                        reaction TINYINT(1) DEFAULT 0,

                        userfullname VARCHAR(250) NOT NULL,

                        datetime timestamp NOT NULL DEFAULT current_timestamp(),

                        FOREIGN KEY(user_id) REFERENCES user(id),

                        FOREIGN KEY(pub_id) REFERENCES " . $output . "_publication(id)

                        ON DELETE CASCADE

                        ON UPDATE CASCADE

                        )ENGINE=InnoDB";

                    $this->getPDO()->exec($sql);



                    

                    $sql = "CREATE TABLE " . $output . "_agenda(

                        `id` int(11) NOT NULL AUTO_INCREMENT,

                        `title` varchar(255) NOT NULL,

                        `type` varchar(255) NOT NULL,

                        `restaurant` varchar(255) DEFAULT NULL,

                        `participant` int(10) DEFAULT NULL,

                        `from_date` datetime NOT NULL,

                        `to_date` datetime NOT NULL,

                        `status` tinyint(1) NOT NULL DEFAULT 0,

                        `lat` float NOT NULL DEFAULT 0,

                        `lng` float NOT NULL DEFAULT 0,

                        `user_id` int(11) NOT NULL,

                        `description` varchar(255) DEFAULT NULL,

                        `isActive` tinyint(1) NOT NULL DEFAULT 1,

                        `datetime` timestamp NOT NULL DEFAULT current_timestamp(),

                        PRIMARY KEY (`id`),

                        FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) 

                        ON DELETE CASCADE

                        ON UPDATE CASCADE

                    ) ENGINE=InnoDB";



                    $this->getPDO()->exec($sql);



                    $sql = "CREATE TABLE " . $output . "_agenda_action(

                        `id` int(11) NOT NULL AUTO_INCREMENT,

                        `user_id` int(11) NOT NULL,

                        `agenda_id` int(11) NOT NULL,

                        `type_action` varchar(255) NOT NULL,

                        `status` int(1) NOT NULL DEFAULT 1,

                        `datetime` datetime NOT NULL DEFAULT current_timestamp(),

                        PRIMARY KEY (`id`),

                        FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),

                        FOREIGN KEY (`agenda_id`) REFERENCES " . $output . "_agenda (`id`)

                        ON DELETE CASCADE 

                        ON UPDATE CASCADE

                      ) ENGINE=InnoDB";

                    

                    $this->getPDO()->exec($sql);

  

                }

            }

        }



        return $output;

    }



    public function addMember($tableName, $user_id)

    {

        $query = "Insert into $tableName (id, user_id, roles) values (UUID(), $user_id, 'Membre')";



        $statement = $this->getPDO()->exec($query);



        $response = "";

        if ($statement == 1) {

            $response = "Acceptée";

        } else {

            $response = "Non acceptée";

        }

        return $response;

    }

    
    public function addMemberTemp($tableName, $email)
    {
        $query = "Insert into $tableName (id , roles, email) values (UUID(),'Membre','$email')";
        $statement = $this->getPDO()->exec($query);
        
    }

    public function confirmMemberTemp($tableName,$user_id, $email){
        $query = "UPDATE $tableName set user_id= $user_id, status=1  WHERE email = '$email'";

        $stmt = $this->getPDO()->prepare($query);

        $stmt->execute([]);
    }


    /**
     * Update Status of pedding invitation to accepted on the tribut T
     * @param string $tableName: Name of the table
     * @param int $user_id: ID of the user
     * @param int $status: Status of the invitation to accepted on the tribut
     * 
     */
    public function updateMember($tableName, $user_id, $status)

    {



        $query = "UPDATE $tableName set status = ? WHERE user_id = ?";



        $stmt = $this->getPDO()->prepare($query);



        $stmt->execute([$status, $user_id]);



    }

	
	public function invitationCancelOrDelete($tableName, $user_id)
    {

        $query = "DELETE FROM $tableName WHERE user_id = ?";

        $stmt = $this->getPDO()->prepare($query);

        $stmt->execute([$user_id]);

    }

    public function showTribuT($user_id)

    {



        $db = $_ENV["DATABASENAME"];



        $query = "SHOW TABLES FROM $db like '%tribu_t_" . $user_id . "_%'";



        $sql = $this->getPDO()->query($query);



        $nbTribu = $sql->rowCount();



        $resultat = $sql->fetchAll(PDO::FETCH_NUM);



        return $resultat;

    }


	/*  */
    public function showRightTributName($table)

    {

        $statement = $this->getPDO()->prepare("SELECT name, description FROM $table LIMIT 1");

        $statement->execute();

        $result = $statement->fetch(PDO::FETCH_ASSOC);

        return $result;

    }



    public function showMember($table)

    {

        $statement = $this->getPDO()->prepare("SELECT user_id FROM $table WHERE status = 1");

        $statement->execute();

        $result = $statement->fetchAll(PDO::FETCH_ASSOC);

        return $result;

    }



    public function showAllUsers()

    {

        $statement = $this->getPDO()->prepare("SELECT * FROM user");

        $statement->execute();

        $result = $statement->fetchAll(PDO::FETCH_ASSOC);

        return $result;

    }



    public function showUserFullName($query, $userId)

    {

        $statement = $this->getPDO()->prepare("select * from (select concat(firstname, ' ', lastname) as fullname, user_id from consumer union select concat(firstname, ' ', lastname) as fullname, user_id from supplier) as tab where tab.fullname like '%$query%' and user_id <> $userId");

        $statement->execute();

        $result = $statement->fetchAll(PDO::FETCH_ASSOC);

        return $result;

    }



    function getRole($table, $userId)

    {



        $statement = $this->getPDO()->prepare("SELECT roles as result FROM $table WHERE user_id  = $userId LIMIT 1");



        $statement->execute();



        $result = $statement->fetch(PDO::FETCH_ASSOC);



        return $result["result"];

    }



    function setTribuT($tribu_T_name, $description,$path,$extenstion,$userId,$tribu_t_owned_or_join)

    {



        $fetch = $this->getPDO()->prepare("SELECT $tribu_t_owned_or_join FROM user WHERE id  = $userId");

        

        $fetch->execute();



        $result = $fetch->fetch(PDO::FETCH_ASSOC);


        $date = \getdate();
        $list = $result[$tribu_t_owned_or_join];
   
        if (!isset($list)) {
            $array=array("tribu_t"=>array("name"=> $tribu_T_name,"description"=> $description,"extension"=> $extenstion,"logo_path"=>$path,"date"=>  $date));
            $array1= json_encode($array);

            //$statement = $this->getPDO()->prepare("UPDATE user SET tribu_t = CONCAT(tribu_t, ';$tableTribut') WHERE id  = $userId");

            //$statement = $this->getPDO()->prepare("UPDATE user SET tribu_t ='".$tableTribut."' WHERE id  = $userId");

            $statement = $this->getPDO()->prepare("UPDATE user SET $tribu_t_owned_or_join ='". $array1 ."' WHERE id  = $userId");

        } else {
            $array1= json_decode($list, true);
           
            $tmp = [];
            $array =[];
            
            try{
                array_push($tmp, ...$array1["tribu_t"]);
            }catch(ArgumentCountError $e){
                array_push($tmp, $array1["tribu_t"]);
            }finally{
                array_push($tmp, array("name" => $tribu_T_name, "description" => $description, "extension" => $extenstion, "logo_path" => $path, "date" =>  $date));
                $array = array("tribu_t" => $tmp);
            }


            if ($_ENV['APP_ENV'] == 'dev') 
                dump($array);
            
            $array2 = json_encode($array);
            //$statement = $this->getPDO()->prepare("UPDATE user SET tribu_t ='".$list.";".$tableTribut."' WHERE id  = $userId");

            $statement = $this->getPDO()->prepare("UPDATE user SET $tribu_t_owned_or_join ='". $array2."' WHERE id  = $userId");

        }



        $statement->execute();



    }


    function getTribuTInfo($tribu_t_name){

        $sql="SELECT *,tribu.roles as tribu_t_roles FROM $tribu_t_name as tribu LEFT JOIN user as u ON u.id=tribu.user_id WHERE tribu.roles = 'Fondateur'" ;
        $exec=$this->getPDO()->prepare($sql);
        $exec->execute();
        return $resultat = $exec->fetch(PDO::FETCH_ASSOC);

    }


    function fetchTribuT($userId)

    {



        $statement = $this->getPDO()->prepare("SELECT tribu_t as result FROM user WHERE id  = $userId");



        $statement->execute();



        $result = $statement->fetch(PDO::FETCH_ASSOC);



        return $result["result"];

    }



    function fetchJsonDataTribuT($userId,$tribu_t_owned_or_join)

    {



        $statement = $this->getPDO()->prepare("SELECT json_extract($tribu_t_owned_or_join, '$') as result FROM user WHERE id  = $userId");



        $statement->execute();



        $result = $statement->fetch(PDO::FETCH_ASSOC);



        return $result["result"];

    }



    function fetchAllPub($table_pub)

    {



        $statement = $this->getPDO()->prepare("SELECT * FROM $table_pub ORDER BY datetime DESC");



        $statement->execute();



        $result = $statement->fetchAll(PDO::FETCH_ASSOC);



        return $result;

    }



    function createOnePub($table_pub, $user_id, $publication, $confidentiality, $photo)

    {



        $statement = $this->getPDO()->prepare("INSERT INTO $table_pub (user_id, publication, confidentiality, photo, userfullname) values (:user_id, :publication, :confidentiality, :photo, :userfullname)");

        $userfullname = $this->getFullName($user_id);

        $statement->bindParam(':user_id', $user_id);

        $statement->bindParam(':publication', $publication);

        $statement->bindParam(':confidentiality', $confidentiality);

        $statement->bindParam(':photo', $photo);

        $statement->bindParam(':userfullname', $userfullname);



        $result = $statement->execute();



        return $result;

    }



    public function getFullName($userId)

    {

        $statement = $this->getPDO()->prepare("select * from (select concat(firstname, ' ', lastname) as fullname, user_id from consumer union select concat(firstname, ' ', lastname) as fullname, user_id from supplier) as tab where tab.user_id = $userId");

        $statement->execute();

        $result = $statement->fetch(PDO::FETCH_ASSOC);

        return $result["fullname"];

    }



    public function createComent($table_comment, $user_id, $pub_id, $commentaire, $audioname)

    {

        $statement = $this->getPDO()->prepare("INSERT INTO $table_comment (user_id, pub_id, commentaire, userfullname, audioname) values (:user_id, :pub_id, :commentaire, :userfullname, :audioname)");

        $userfullname = $this->getFullName($user_id);

        $statement->bindParam(':user_id', $user_id);

        $statement->bindParam(':pub_id', $pub_id);

        $statement->bindParam(':commentaire', $commentaire);

        $statement->bindParam(':userfullname', $userfullname);

        $statement->bindParam(':audioname', $audioname);


        $result = $statement->execute();



        return $result;

    }



    public function setReaction($table_reaction, $user_id, $pub_id, $reaction)

    {



        $sql = $this->getPDO()->prepare("SELECT COUNT(*) AS NB FROM $table_reaction WHERE user_id = $user_id AND pub_id = $pub_id");



        $sql->execute();



        $number = $sql->fetch();



        if ($number["NB"] > 0) {

            $statement = $this->getPDO()->prepare(" UPDATE $table_reaction SET reaction = $reaction WHERE user_id = $user_id AND pub_id = $pub_id ");

            $statement->execute();

        } else {



            $statement = $this->getPDO()->prepare("INSERT INTO $table_reaction (user_id, pub_id, reaction, userfullname) values (:user_id, :pub_id, :reaction, :userfullname)");

            $userfullname = $this->getFullName($user_id);

            $statement->bindParam(':user_id', $user_id);

            $statement->bindParam(':pub_id', $pub_id);

            $statement->bindParam(':reaction', $reaction);

            $statement->bindParam(':userfullname', $userfullname);

            $statement->execute();

        }



        return $number;

    }



    public function getReaction($table_reaction, $user_id, $pub_id)

    {

        $sql = $this->getPDO()->prepare("SELECT COUNT(*) AS NB FROM $table_reaction WHERE user_id = $user_id AND pub_id = $pub_id");



        $sql->execute();



        $number = $sql->fetch();



        if ($number["NB"] > 0) {

            $statement = $this->getPDO()->prepare(" SELECT reaction FROM $table_reaction WHERE user_id = $user_id AND pub_id = $pub_id ");

            $statement->execute();

            $result = $statement->fetch();

            return $result["reaction"];

        } else {

            return 0;

        }

    }



    public function getReactionNumber($table_reaction, $pub_id)

    {



        $sql = $this->getPDO()->prepare("SELECT COUNT(*) AS NB FROM $table_reaction WHERE reaction = 1 AND pub_id = $pub_id");



        $sql->execute();



        $number = $sql->fetch();



        return $number["NB"];

    }

    public function getReactionStatus($table_reaction, $pub_id, $user_id)

    {

        $sql = $this->getPDO()->prepare("SELECT COUNT(*) AS NB FROM $table_reaction WHERE user_id = $user_id AND reaction = 1 AND pub_id = $pub_id");

        $sql->execute();

        $number = $sql->fetch();

        return $number["NB"];

    }


    public function getCommentaireNumber($table_commentaire, $pub_id)

    {



        $sql = $this->getPDO()->prepare("SELECT COUNT(*) AS NB FROM $table_commentaire WHERE pub_id = $pub_id");



        $sql->execute();



        $number = $sql->fetch();



        return $number["NB"];

    }


    function findAllComments($publication_id, $table)

    {

        $statement = $this->getPDO()->prepare("SELECT * FROM $table WHERE pub_id  = $publication_id");

        $statement->execute();

        $result = $statement->fetchAll(PDO::FETCH_ASSOC);

        return $result;

    }



    function getTypeUser($userId)

    {



        $statement = $this->getPDO()->prepare("SELECT type as result FROM user WHERE id  = $userId");



        $statement->execute();



        $result = $statement->fetchAll(PDO::FETCH_ASSOC);



        return $result[0]["result"];

    }



    function getUserEmail($userId)

    {



        $statement = $this->getPDO()->prepare("SELECT email as result FROM user WHERE id  = $userId");



        $statement->execute();



        $result = $statement->fetchAll(PDO::FETCH_ASSOC);



        return $result[0]["result"];

    }



    function getName($table, $userId)

    {



        $statement = $this->getPDO()->prepare("SELECT firstname, lastname, concat(num_rue,' ', code_postal, ' ', commune) as adresse FROM $table WHERE user_id  = $userId");



        $statement->execute();



        $result = $statement->fetchAll(PDO::FETCH_ASSOC);



        return $result[0];

    }



    public function showTableTribu($table)

    {



        $db = $_ENV["DATABASENAME"];



        $query = "SHOW TABLES FROM $db like '%$table%'";



        $sql = $this->getPDO()->query($query);



        $nbTribu = $sql->rowCount();



        return $nbTribu;

    }



    public function removePublicationOrCommentaire($table, $id)

    {



        $sql = "DELETE FROM $table WHERE id = ?";



        $stmt = $this->getPDO()->prepare($sql);



        $stmt->execute([$id]);

    }



    public function updatePublication($table, $id, $publication, $confidentiality)

    {



        $sql = "UPDATE $table set publication = ?, confidentiality = ?  WHERE id = ?";



        $stmt = $this->getPDO()->prepare($sql);



        $stmt->execute([$publication, $confidentiality, $id]);

    }



    public function updateComment($table, $id, $commentaire)

    {



        $sql = "UPDATE $table set commentaire = ? WHERE id = ?";



        $stmt = $this->getPDO()->prepare($sql);



        $stmt->execute([$commentaire, $id]);

    }



    public function testSiMembre($table, $user_id)

    {

        $statement = $this->getPDO()->prepare("SELECT id, status FROM $table WHERE user_id = $user_id");

        $statement->execute();

        $result = $statement->fetchAll(PDO::FETCH_ASSOC);

        if(count($result) > 0){

            if($result[0]["status"] == 0){

                return "pending";

            }elseif($result[0]["status"] == 1){

                return "accepted";

            }if($result[0]["status"] == 2){

                return "refuse";

            }

        }else{

            return "not_invited";

        }

    }



    public function showUserId($table)

    {

        $statement = $this->getPDO()->prepare("SELECT user_id FROM $table");

        $statement->execute();

        $result = $statement->fetchAll(PDO::FETCH_NUM);

        return $result;

    }



    public function showAllphotosTribut($table)

    {

        $statement = $this->getPDO()->prepare("SELECT photo FROM $table WHERE photo <> ''");

        $statement->execute();

        $result = $statement->fetchAll(PDO::FETCH_ASSOC);

        return $result;

    }



    public function showAllInvitations($table)

    {

        $statement = $this->getPDO()->prepare("SELECT user_id, status FROM $table WHERE roles <> 'Fondateur'");

        $statement->execute();

        $result = $statement->fetchAll(PDO::FETCH_ASSOC);

        return $result;

    }



    public function showAvatar($table, $id){

        // dd($table);

        $sql = "SELECT avatar, roles FROM $table WHERE user_id = $id";

        

        $stmt = $this->getPDO()->prepare($sql);



        $stmt->execute();



        $result = $stmt->fetch(PDO::FETCH_ASSOC);



        return $result;

    }



    public function updateAvatar($table, $avatar){



        $sql = "UPDATE $table set avatar = ?";



        $stmt = $this->getPDO()->prepare($sql);



        $stmt->execute([$avatar]);

    }



    function generateConfidentiality($table, $user_id)

    {

        $sql = $sql = "SELECT * FROM $table WHERE user_id = $user_id";



        $stmt = $this->getPDO()->prepare($sql);



        $stmt->execute();



        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);



        if(count($result) < 1){

            $statement = $this->getPDO()->prepare("INSERT INTO $table (profil, email, amie, notif_is_active, invitation, publication, user_id) values (?,?,?,?,?,?,?)");

            $statement->execute([1,1,1,1,1,1,$user_id]);

        }

        

    }



    public function fetchUserPublication($table, $user_id){



        $sql = "select * from $table where user_id = $user_id ORDER BY datetime DESC";



        $stmt = $this->getPDO()->prepare($sql);



        $stmt->execute();



        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);



        return $result;



    }

    /**
     * @author Elie Fenohasina <elie@geomadagascar.com>
     * @param string $tableTribut
     * @return array $result
     */
    public function getUserIdInTribu($tableTribut, $auteur_id)
    {

        $sql = "SELECT user_id from $tableTribut where user_id != $auteur_id";

        $stmt = $this->getPDO()->prepare($sql);

        $stmt->execute();

        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return $result;
    }

    public function createExtensionDynamicTable($tribu_t, $extension){
        $sql = "CREATE TABLE " . $tribu_t . "_" . $extension . " (

            id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT, 

            id_resto VARCHAR(250) NOT NULL,

            denomination_f VARCHAR(250) NOT NULL,

            datetime timestamp NOT NULL DEFAULT current_timestamp())ENGINE=InnoDB";
        
        $stmt = $this->getPDO()->prepare($sql);

        $stmt->execute();
    }

    public function createTableComment($tribu_t, $extension){
        $sql = "CREATE TABLE  IF NOT EXISTS " . $tribu_t . "_" . $extension . " (

            id_resto_comment int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT, 

            id_restaurant VARCHAR(250) NOT NULL,

            id_user VARCHAR(250) NOT NULL,

            note decimal(3,2),

            commentaire TEXT,

            datetime timestamp NOT NULL DEFAULT current_timestamp())ENGINE=InnoDB";

        $stmt = $this->getPDO()->prepare($sql);

        $stmt->execute();
    }

    public function sendCommentRestoPastilled($tableName,$idResto,$idUser,$note,$commentaire){
        $values=array(":id_restaurant"=>$idResto,
            ":id_user"=>$idUser,
            ":note"=>$note,
            ":commentaire"=>$commentaire
        );
        $sql= "INSERT INTO " .$tableName. "(id_restaurant,id_user,note,commentaire)". 
                  "VALUES (:id_restaurant, :id_user,:note,:commentaire)";
        $stmt = $this->getPDO()->prepare($sql);

        return $stmt->execute($values);
            
    }

    public function upCommentRestoPastilled($tableName,  $note, $commentaire,$idRestoComment)
    {
        $values = array(
            ":note" => $note,
            ":commentaire" => $commentaire,
            ":idRestoComment"=> $idRestoComment
        );
        $sql = "UPDATE " . $tableName . " SET note = :note, commentaire = :commentaire WHERE id_resto_comment=:idRestoComment";
        $stmt = $this->getPDO()->prepare($sql);

        return $stmt->execute($values);
    }

    public function fetchAllPublications($tableList, $user_id){

        $rqt = "SELECT id, user_id, publication, confidentiality,photo, userfullname, datetime, ";

        $final_rqt ="";

        if(count($tableList)>0){
            for($i=0 ; $i < count($tableList); $i++){
                if($i != count($tableList) -1){
                    $rqt .="'".$tableList[$i] ."' as tribu from " .$tableList[$i] ."_publication WHERE user_id = " .$user_id. " union SELECT id, user_id, publication, confidentiality,photo, userfullname, datetime, ";
                }else{
                    $rqt .="'".$tableList[$i] ."' as tribu from " .$tableList[$i] ."_publication WHERE user_id = " .$user_id;
                }
            }
            $final_rqt = $rqt." order by datetime DESC";
        }

        $stmt = $this->getPDO()->prepare($final_rqt);

        $stmt->execute();

        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return $result;

    }

    /**
     * @author Elie Fenohasina <elie@geomadagascar.com>
     * @param string $table is the name's tribut of table
     * @return boolean true of false
     */

     public function hasTableResto($table){

        $db = $_ENV["DATABASENAME"];

        $query = "SHOW TABLES FROM $db like '%$table%'";

        $sql = $this->getPDO()->query($query);

        $resultat = $sql->rowCount();

        if($resultat>0){
            return true;
        }else{
            return false;
        }
    }

    public function getRestoPastilles($tableResto, $tableComment){
    
        // $sql = "SELECT * from (SELECT $tableResto.id as id_pastille, $tableResto.id_resto, $tableResto.denomination_f, bdd_resto.id as id_unique, bdd_resto.dep as id_dep, bdd_resto.poi_y as latitude, bdd_resto.poi_x as longitude,  concat(bdd_resto.numvoie,' ',bdd_resto.typevoie,' ',bdd_resto.nomvoie,' ',bdd_resto.codpost,' ',bdd_resto.commune) as adresse FROM `tribu_t_2_data_engineer_restaurant` inner JOIN bdd_resto on $tableResto.id_resto = bdd_resto.clenum ORDER BY $tableResto.datetime DESC) as resto_pastille INNER JOIN departement ON resto_pastille.id_dep=departement.id";
        //$sql = "SELECT * FROM $tableResto ORDER BY datetime DESC";

        //ORDER BY datetime DESC 
        //$sql = "SELECT * FROM $tableResto  as t1 LEFT JOIN $tableComment  as t2  ON t2.id_restaurant =t1.id ";

        $sql= "SELECT  * ,GROUP_CONCAT(t2.id_user) as All_user,GROUP_CONCAT(t2.commentaire) as All_com,
                FORMAT(AVG(t2.note),2) as globalNote, COUNT(t2.id_restaurant) as nbrAvis ,
                GROUP_CONCAT(t2.id_resto_comment) as All_id_r_com 
                FROM $tableResto  
                as t1 LEFT JOIN $tableComment  
                as t2  ON t2.id_restaurant =t1.id GROUP BY t1.id";

        $stmt = $this->getPDO()->prepare($sql);
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return $result;



    }

    public function getAllAvisByRestName($tableResto,$id){
        $data=[
            ":id"=>$id
        ];
        $sql="SELECT * FROM $tableResto as t1 LEFT JOIN user as t2 ON t1.id_user = t2.id where t1.id_restaurant = :id";
        $stmt = $this->getPDO()->prepare($sql);
        $stmt->execute($data);
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }
    
    public function getPartisantPublication($table_publication_Tribu_T, $idMin,$limits){
        if($idMin == 0){
            $sql = "SELECT * FROM $table_publication_Tribu_T ORDER BY id DESC LIMIT :limits";
           
            $stmt = $this->getPDO()->prepare($sql);
            $stmt->bindValue(':limits', $limits, PDO::PARAM_INT); 
            $stmt->execute();
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return $result;
        }else{
            $sql = "SELECT * FROM $table_publication_Tribu_T where id < :idmin ORDER BY id DESC LIMIT :limits";
            $stmt = $this->getPDO()->prepare($sql);
            $stmt->bindValue(':idmin', $idMin, PDO::PARAM_INT); 
            $stmt->bindValue(':limits', $limits, PDO::PARAM_INT); 
            $stmt->execute();
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return $result;
        }
       
    }

    

}

