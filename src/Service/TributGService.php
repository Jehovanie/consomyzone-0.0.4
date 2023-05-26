<?php

namespace App\Service;



use PDO;

use App\Entity\Consumer;
use App\Entity\Supplier;
use Doctrine\DBAL\Driver\SQLSrv\Exception\Error;



class TributGService extends PDOConnexionService{

 

    /**
     * 
     * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
     * 
     * Create a new table tribut G and table related for it: publication , commentaire, reaction
     * 
     * @param string $name_table_tributG: name of the table,
     * @param int $user_id: user id
     * 
     * @return int number of rows in the table.
     */

    public function createTableTributG($name_table_tribuG, $user_id)
    {



        



        $db = $_ENV["DATABASENAME"];

        

        $query = "SHOW TABLES FROM $db like '$name_table_tribuG'";

        $sql = $this->getPDO()->query($query);

        

        $resultat=$sql->rowCount();



        if($resultat>0){



            // $data = "Insert into tributg_".$commun_code_postal." (id, user_id, roles) values (UUID(), $user_id,'[\"Utilisateur\"]')";

            $data = "Insert into " . $name_table_tribuG . " (user_id, roles) values ( $user_id,'utilisateur')";

            $this->getPDO()->exec($data);

        }else {



            ///Formatage name

            $depart_tributG = explode("_",$name_table_tribuG); /// ["tribug", (departement code) , (...departement name ) ]

            $depart_tributG_name = mb_convert_case( $depart_tributG[count($depart_tributG) - 1 ] , MB_CASE_TITLE, "UTF-8");

            

            for($i = 2; $i < count($depart_tributG) - 1 ; $i++) {

                $depart_tributG_name .= " "  .  mb_convert_case( $depart_tributG[$i] , MB_CASE_TITLE, "UTF-8");

            }

            $description = "Département " . $depart_tributG[1] . ", " . $depart_tributG_name;

            

            //// creation de table tribut G.

            $sql = "CREATE TABLE " . $name_table_tribuG . " (

                id int(11) AUTO_INCREMENT NOT NULL PRIMARY KEY , 

                user_id int(11) NOT NULL,

                name VARCHAR(250) NOT NULL DEFAULT '".$depart_tributG_name."',

                description VARCHAR(250) NOT NULL DEFAULT '$description',

                avatar VARCHAR(250) NULL,

                roles VARCHAR(300) NOT NULL, 

                datetime timestamp NOT NULL DEFAULT current_timestamp(),

                isBanished tinyint(1) DEFAULT 0 NOT NULL,

                isDeveloper tinyint(1) DEFAULT 0 NOT NULL,

                isModerate  tinyint(1) DEFAULT 0 NOT NULL

                )ENGINE=InnoDB";



            try {

                $this->getPDO()->exec($sql);

            }catch(Error $error ){

                throw $error;

            }



            $this->getPDO()->exec("Insert into tribu_g_list (table_name) values ('$name_table_tribuG')");



            $data = "Insert into " . $name_table_tribuG . " (user_id, roles) values ($user_id,'fondateur')";



            $final = $this->getPDO()->exec($data);



            if($final > 0){

                $query = "CREATE TABLE ".$name_table_tribuG."_publication(

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

                    $sql = "CREATE TABLE ".$name_table_tribuG."_commentaire(

                        id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT, 

                        user_id int(11) NOT NULL,

                        pub_id int(11) NOT NULL,

                        commentaire VARCHAR(250) NULL,

                        userfullname VARCHAR(250) NOT NULL,

                        audioname VARCHAR(250) NULL,

                        datetime timestamp NOT NULL DEFAULT current_timestamp(),

                        FOREIGN KEY(user_id) REFERENCES user(id),

                        FOREIGN KEY(pub_id) REFERENCES " . $name_table_tribuG . "_publication(id)

                        ON DELETE CASCADE

                        ON UPDATE CASCADE

                        )ENGINE=InnoDB";





                    $this->getPDO()->exec($sql);

                    $sql = "CREATE TABLE ".$name_table_tribuG."_reaction(

                        id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT, 

                        user_id int(11) NOT NULL,

                        pub_id int(11) NOT NULL,

                        reaction TINYINT(1) DEFAULT 0,

                        userfullname VARCHAR(250) NOT NULL,

                        datetime timestamp NOT NULL DEFAULT current_timestamp(),

                        FOREIGN KEY(user_id) REFERENCES user(id),

                        FOREIGN KEY(pub_id) REFERENCES " . $name_table_tribuG . "_publication(id)

                        ON DELETE CASCADE

                        ON UPDATE CASCADE

                        )ENGINE=InnoDB";





                    $this->getPDO()->exec($sql);


                    // Create table agenda for  tribu G

                    ///agenda table
                    $sql = "CREATE TABLE " . $name_table_tribuG . "_agenda(

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
                    
                    ///agenda action
                    $sql = "CREATE TABLE " . $name_table_tribuG . "_agenda_action(

                        `id` int(11) NOT NULL AUTO_INCREMENT,

                        `user_id` int(11) NOT NULL,

                        `agenda_id` int(11) NOT NULL,

                        `type_action` varchar(255) NOT NULL,

                        `status` int(1) NOT NULL DEFAULT 1,

                        `datetime` datetime NOT NULL DEFAULT current_timestamp(),

                        PRIMARY KEY (`id`),

                        FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),

                        FOREIGN KEY (`agenda_id`) REFERENCES " . $name_table_tribuG . "_agenda (`id`)

                        ON DELETE CASCADE 

                        ON UPDATE CASCADE

                      ) ENGINE=InnoDB";

                    $this->getPDO()->exec($sql);

                }

            }

        }

        

        return $resultat;

    }



    /**
     *  @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
     * 
     *  Settings profil for the tribut G
     *  
     * @param string $table_name: name of the table
     * @param string $image_file: name of the image
     */

    public function changeProfilTribuG($table_name, $image_file){



        $sql = "UPDATE " . $table_name . " set avatar = '" . $image_file . "';";

        $statement = $this->getPDO()->prepare($sql);

        $statement->execute();



        $sql_set_default = "ALTER TABLE  $table_name CHANGE avatar avatar VARCHAR(250) NOT NULL DEFAULT   '$image_file'";

        $statement = $this->getPDO()->prepare($sql_set_default);

        return $statement->execute();

    }



    public function getFullName($userId)
    {

        $statement = $this->getPDO()->prepare("select * from (select concat(firstname, ' ', lastname) as fullname, user_id from consumer union select concat(firstname, ' ', lastname) as fullname, user_id from supplier) as tab where tab.user_id = $userId");

        $statement->execute();

        $result = $statement->fetch(PDO::FETCH_ASSOC);

        return $result["fullname"];

    }



    public function getTableNameTributG($userId)
    {

        $statement = $this->getPDO()->prepare("select * from (select tributg, user_id from consumer union select tributg, user_id from supplier) as tab where tab.user_id = $userId");

        $statement->execute();

        $result = $statement->fetch(PDO::FETCH_ASSOC);



        return $result["tributg"];

    }



    /**
     * 
     * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
     * 
     * @param string $table_name : table tribut G name
     * @param int $user_id : user id
     * 
     * @return string status of the user inside the tributg like "fondateur" or "utilisateur"
     */

    public function getStatus($table_name, $user_id){



        $statement = $this->getPDO()->prepare('SELECT roles FROM ' . $table_name . ' WHERE user_id = ' .$user_id. ' LIMIT 1');

        $statement->execute();

        $result = $statement->fetchAll(PDO::FETCH_ASSOC);



        return $result[0]['roles'];

    }

    /**
     * 
     * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
     * 
     * @param object $user : user
     * @param object $entityManager : object instance from EntityManagerInterface
     * 
     * @return object consumer or suplier;
     */
    public function getProfil( $user, $entityManager ){

        $userType = $user->getType();
        $userId = $user->getId();

        ////profil user connected
        if($userType == "consumer") {
            $profil = $entityManager->getRepository(Consumer::class)->findByUserId($userId);
        }else{
            $profil = $entityManager->getRepository(Supplier::class)->findByUserId($userId);
        }
        return $profil;
    }





    public function setIsDev($table_name, $user_id,$val){

        $sql = "UPDATE " . $table_name . " set isDeveloper = ". $val ." where user_id  =" . $user_id;

        $statement = $this->getPDO()->prepare($sql);

        return $statement->execute();

    }



    public function setIsModerateur($table_name, $user_id, $val)

    {

        $sql = "UPDATE " . $table_name . " set isModerate = " . $val . " where user_id  =" . $user_id;

        $statement = $this->getPDO()->prepare($sql);

        return $statement->execute();

    }



    public function getAllPublication(){

        $sql = "SELECT * FROM tributg_".$commun_code_postal."";

        $statement = $this->getPDO()->query($sql);

        $resultat=$statement->fetchAll();

        return $resultat;

    }





    public function getBanishedStatus($table_name,$user_id){

        $sql="SELECT isBanished FROM ".$table_name. " where user_id  =".$user_id;

        $statement = $this->getPDO()->prepare($sql);

        $statement->execute();

        return $statement->fetchAll(PDO::FETCH_ASSOC)[0]['isBanished'];

    }





    public function setBanishePartisant($table_name,$user_id){

        $sql = "UPDATE ".$table_name. " set isBanished = 1 where user_id  =".$user_id;

        $statement = $this->getPDO()->prepare($sql);

        return $statement->execute();



    }





    public function changeRole($table_name,$user_id){

        $sql = "UPDATE " . $table_name . " set roles = 'moderateur' where user_id  =" . $user_id;

        $statement = $this->getPDO()->prepare($sql);

        return $statement->execute();

    }





    public function undoBanishePartisant($table_name,$user_id){

        $sql = "UPDATE ".$table_name. " set isBanished = 0 where user_id  =".$user_id;

        $statement = $this->getPDO()->prepare($sql);

        return $statement->execute();

    }



    /**

     * @param string $table_name: name of the table

     * 

     * @return array array containing all user id in tribut G like [ [ "user_id" => ... ], ... ]

     */

    public function getAllTributG($table_name){

        $statement = $this->getPDO()->prepare('SELECT user_id FROM ' . $table_name);

        $statement->execute();

        return $statement->fetchAll(PDO::FETCH_ASSOC);

    }





    public function getTribuGtableForNotif($user_id){

        $sql = "SELECT tributg FROM (SELECT tributg, user_id FROM consumer union SELECT tributg, user_id FROM supplier) as tab WHERE tab.user_id = $user_id";

        $statement = $this->getPDO()->prepare($sql);

        $statement->execute();

        $result = $statement->fetch();

        return $result["tributg"];

    }





    /**

     * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>

     * 

     * @param table_name: the name of the tributG

     * @param isVerfied: check validity

     * @param user_id: user id

     * 

     * @return array associatif (ex: ["status" => "roles", "verified" => "isverified" ])

     */

    public function getStatusAndIfValid($table_name, $isVerified,  $user_id){



        $statement = $this->getPDO()->prepare("SELECT roles FROM $table_name WHERE user_id = $user_id LIMIT 1");

        $statement->execute();

        $result = $statement->fetchAll(PDO::FETCH_ASSOC);

        return ["status" => $result[0]['roles'] , "verified" => $isVerified ];

    }



    /**

     * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>

     * 

     * @param string $table_name: name of the table

     * 

     * @return single tribut G

     */

    public function getProfilTributG($table_name, $user_id ){



        $statement = $this->getPDO()->prepare("SELECT * FROM $table_name WHERE user_id = $user_id LIMIT 1");

        $statement->execute();

        $result = $statement->fetchAll(PDO::FETCH_ASSOC);



        return $result[0];

    }





    public function getAllUserWithRoles($table_name){



        $db = $_ENV["DATABASENAME"];

        

        $query = "SHOW TABLES FROM $db like '$table_name'";

        $sql = $this->getPDO()->query($query);

        

        $resultat=$sql->rowCount();

                

        if($resultat === 0 ){

            

            return $resultat;

        }else {



            $statement = $this->getPDO()->prepare('SELECT user_id , roles FROM ' . $table_name);

            $statement->execute();

            return $statement->fetchAll(PDO::FETCH_ASSOC);

        }



    }







    /**

     * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>

     * 

     * Persiste new publication in database

     * 

     * @param string $table_pub: Name of the table containing the publication

     * @param int $user_id: id of the user

     * @param string $publication_id: publication content

     * @param string $confid : confidential of the publication

     * @param string $photo: image in the publication

     * 

     * 

     */

    public function createOnePub($table_pub, $user_id, $publication, $confid, $photo){



        $statement = $this->getPDO()->prepare(

            "INSERT INTO $table_pub (user_id, publication, confidentiality, photo, userfullname) 

            values (:user_id, :publication, :confidentiality, :photo, :userfullname)"

        );

        

        $userfullname = $this->getFullName($user_id);



        $statement->bindParam(':user_id', $user_id);

        $statement->bindParam(':publication', $publication);

        $statement->bindParam(':confidentiality', $confid);

        $statement->bindParam(':photo', $photo);

        $statement->bindParam(':userfullname', $userfullname);



        $result = $statement->execute();



        return $result;

    }



    /**

     * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>

     * 

     * Get all publications in this table.

     * 

     * @param string $table_name: name of the table

     */

    public function getAllPublications($table_name){





        $statement = $this->getPDO()->prepare("SELECT * FROM $table_name" ."_publication ORDER BY datetime DESC;");

        $statement->execute();

        $publications = $statement->fetchAll(PDO::FETCH_ASSOC); // [...publications]

        $resultats = [];



        foreach( $publications as $publication ){

            $publication_id = $publication["id"];



            $statement = $this->getPDO()->prepare("SELECT * FROM $table_name"."_commentaire WHERE pub_id = '" .$publication_id . "'");

            $statement->execute();

            $comments = $statement->fetchAll(PDO::FETCH_ASSOC); /// [...comments ]

 

            $publication["comments"] = $comments;



            $statement = $this->getPDO()->prepare("SELECT * FROM $table_name"."_reaction WHERE pub_id = '" .$publication_id . "' AND reaction= '1'");

            $statement->execute();

            $reactions = $statement->fetchAll(PDO::FETCH_ASSOC);



            $publication["reactions"] = $reactions; /// [ ...reactions ]



            array_push($resultats, $publication);

        }

        return $resultats; /// [ [...publication, "comments" => ... , "reactions" => ... ], ...]

    }



    /**

     * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>

     * 

     * Get all photos publications in this table.

     * 

     * @param string $table_name: name of the table

     */

    public function getAllPhotos($table_name){



        $statement = $this->getPDO()->prepare("SELECT photo FROM $table_name" ."_publication ORDER BY datetime DESC;");

        $statement->execute();



        return $statement->fetchAll(PDO::FETCH_ASSOC); // [...publications];

    }





    /**

     * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>

     * 

     * Setting the reaction from user on publications

     * 

     * @param int $pub_id: publication identifier

     * @param int $user_id: user identifier, that leave reactions

     * @param string $reaction: this is the reaction value. true or false.

     * 

     * @return int : number reaction for one publication from the database.

     */

    public function handlePublicationReaction( $pub_id , $user_id , $reaction  ){



        $table_reaction = $this->getTableNameTributG($user_id) . "_reaction";



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



        $statement = $this->getPDO()->prepare("SELECT count(*) as nbr FROM $table_reaction WHERE reaction = 1 AND pub_id = $pub_id ");

        $statement->execute();

        $count_reaction = $statement->fetchAll(PDO::FETCH_ASSOC);



        return $count_reaction[0]["nbr"];

    }



    /**

     * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>

     * 

     * 

     * @param int publication_id: id of the publication

     * @param int $user_comment_id: id of the user comment currently logged

     * @param string $comment: text comment

     */

    public function handlePublicationComment( $publication_id , $user_comment_id, $comment, $audioname ){



        $table_comment = $this->getTableNameTributG($user_comment_id) . "_commentaire";

        $userfullname = $this->getFullName($user_comment_id);



        $statement = $this->getPDO()->prepare("INSERT INTO $table_comment (user_id, pub_id, commentaire, userfullname, audioname) values (:user_id, :pub_id, :commentaire, :userfullname, :audioname)");



        $statement->bindParam(':user_id', $user_comment_id);

        $statement->bindParam(':pub_id', $publication_id);

        $statement->bindParam(':commentaire', $comment);

        $statement->bindParam(':userfullname', $userfullname);

        $statement->bindParam(':audioname', $audioname);

        

        return $statement->execute();

    }





    /**

     * 

     * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>

     * 

     * @param int $user_id: id of the user currently logged

     * @param int $publication_id: id of the publication

     * 

     * @return array all comments for one publication

     */

    public function fetchAllPublicationComment( $user_id , $publication_id ){



        $table_comment = $this->getTableNameTributG($user_id) . "_commentaire";



        $statement = $this->getPDO()->prepare("SELECT * FROM " . $table_comment . " WHERE pub_id = ". $publication_id);

        $statement->execute();

    

        return $statement->fetchAll(PDO::FETCH_ASSOC);

    }


        
    public function getCountPartisant($table){
        $sql = "select count(*) as num_total from $table";

        $stmt = $this->getPDO()->prepare($sql);

        $stmt->execute();

        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return $result[0]["num_total"];
    }



    public function deletePublication($user_id , $publication_id ){

        //table tribu G
        $table_name = $this->getTableNameTributG($user_id);
        
        ///check the publication if exists
        $statement = $this->getPDO()->prepare("SELECT * FROM $table_name" ."_publication  WHERE id=". $publication_id .";");

        $statement->execute();

        $publication = $statement->fetchAll(PDO::FETCH_ASSOC); // [...publications]

        if( count($publication) === 0 ){
            return false;
        }
        if( intval($publication[0]["user_id"]) !== $user_id ){
            return false;
        }

        /// WE CAN DELETE IT

        ///keep the image to delete on the repository
        $image = $publication[0]["photo"];

        ///delete the publication
        $del_pub = "DELETE FROM ". $table_name ."_publication  WHERE id= ?";

        $pub = $this->getPDO()->prepare($del_pub);
        $pub->execute([$publication_id]);

        ///delete comment
        $del_com = "DELETE FROM ". $table_name ."_commentaire  WHERE pub_id= ?";

        $com = $this->getPDO()->prepare($del_com);
        $com->execute([$publication_id]);


        ///delete reaction
        $del_reaction = "DELETE FROM ". $table_name ."_reaction  WHERE pub_id= ?";

        $reaction = $this->getPDO()->prepare($del_reaction);
        $reaction->execute([$publication_id]);

        ///return the image
        return $image;
    }

    public function updatePublication($user_id , $publication_id , $publication , $confidentiality){

        //table tribu G
        $table_name = $this->getTableNameTributG($user_id);

        $table_pub = $table_name . "_publication";

        $statement = $this->getPDO()->prepare("SELECT * FROM $table_pub  WHERE id=$publication_id");
        $statement->execute();
        $pub = $statement->fetchAll(PDO::FETCH_ASSOC); // [...publications]

        /// there no publication with this publication_id
        if( count($pub) === 0 ){
            return false;
        }

        /// the owner of this publication is not the owner of this user_id
        if( intval($pub[0]["user_id"]) !== $user_id ){
            return false;
        }

        /// WE CAN UPDATE IT
        $statement = $this->getPDO()->prepare('UPDATE '.$table_pub.' SET publication="'. $publication . '", confidentiality="' . $confidentiality . '" WHERE id ="'.$publication_id .'"');
        $result = $statement->execute();

        return $result;
    }


    public function showRightTributName($table)
    {
        $statement = $this->getPDO()->prepare("c");

        $statement->execute();

        $result = $statement->fetch(PDO::FETCH_ASSOC);

        return $result;

    }


    /**
     * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
     * 
     * 
     * @return array associatif (ex: ["status" => "roles", "verified" => "isverified" ])
     */
     public function getAllTableTribuG(){
        $results = array();
        $tab_not_like= ['%agenda%','%commentaire%', '%publication%','%reaction%'];
        $query_sql= "SELECT table_name FROM INFORMATION_SCHEMA.TABLES WHERE table_type = 'BASE TABLE' AND table_name like 'tribug_%'";
        foreach($tab_not_like as $not_like ){
            $query_sql .= " AND table_name NOT LIKE '$not_like' ";
        }
        $statement = $this->getPDO()->prepare($query_sql);
        $statement->execute();
        $all_tables = $statement->fetchAll(PDO::FETCH_ASSOC);

        foreach($all_tables as $table ){
            $tab= $table["table_name"];
            $statement = $this->getPDO()->prepare("SELECT count(*) as nbr FROM $tab");
            $statement->execute();
            $temp = $statement->fetchAll(PDO::FETCH_ASSOC);
            array_push($results, ["table_name" => $tab, "count" => $temp[0]['nbr']]);
        }
        
        return $results;
    }

    public function fetchAllTribuGMember(){

        $rqt = "SELECT table_name FROM tribu_g_list";

        $stmt = $this->getPDO()->prepare($rqt);

        $stmt->execute();

        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if(count($result)>0){
            $sql = "SELECT user_id, ";
            for($i=0 ; $i < count($result); $i++){
                if($i != count($result) -1){
                    $sql .= "'".$result[$i]["table_name"] ."' as tribug from " .$result[$i]["table_name"] ." UNION SELECT user_id, ";
                }else{
                    $sql .="'".$result[$i]["table_name"] ."' as tribug from " .$result[$i]["table_name"];
                }
            }
            $sql ="SELECT * FROM (".$sql. ") as tribu_list left join user on tribu_list.user_id=user.id inner join (SELECT user_id, firstname, lastname FROM consumer UNION SELECT user_id, firstname, lastname FROM supplier) as profil ON user.id=profil.user_id";
            
            //dd($sql);
            $query = $this->getPDO()->prepare($sql);

            $query->execute();

            $result_final = $query->fetchAll(PDO::FETCH_ASSOC);

        }else{
            $result_final = [];
        }

        return $result_final;

    }

}