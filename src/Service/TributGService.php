<?php

namespace App\Service;



use PDO;

use App\Entity\Consumer;
use App\Entity\Supplier;
use Doctrine\DBAL\Driver\SQLSrv\Exception\Error;
use Exception;

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

            // $depart_tributG_name = $this->convertUtf8ToUnicode($depart_tributG_name);

            $description = "Département " . $depart_tributG[1] . ", " . $depart_tributG_name;
            $description = $this->convertUtf8ToUnicode($description);

            //// creation de table tribut G.
            $sql = "CREATE TABLE " . $name_table_tribuG . " (

                id int(11) AUTO_INCREMENT NOT NULL PRIMARY KEY , 

                user_id int(11) NOT NULL,

                name VARCHAR(250) NOT NULL DEFAULT :name,

                description VARCHAR(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT :description,

                avatar VARCHAR(250) NULL,

                roles VARCHAR(300) NOT NULL, 

                datetime timestamp NOT NULL DEFAULT current_timestamp(),

                isBanished tinyint(1) DEFAULT 0 NOT NULL,

                isDeveloper tinyint(1) DEFAULT 0 NOT NULL,

                isModerate  tinyint(1) DEFAULT 0 NOT NULL

            )ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci";

            try {
                $db=$this->getPDO()->prepare($sql);
                $db->bindParam(":description",$description,PDO::PARAM_STR);
                $db->bindParam(":name",$depart_tributG_name,PDO::PARAM_STR);
                $db->execute();
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

                    publication VARCHAR(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,

                    confidentiality TINYINT(1) NOT NULL,

                    photo VARCHAR(250) NULL,

                    userfullname VARCHAR(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,

                    datetime timestamp NOT NULL DEFAULT current_timestamp(),

                    FOREIGN KEY(user_id) REFERENCES user(id)

                    ON DELETE CASCADE

                    ON UPDATE CASCADE

                )ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
                
                $final2 = $this->getPDO()->exec($query);

                if ($final2 == 0) {

                    $sql = "CREATE TABLE ".$name_table_tribuG."_commentaire(

                        id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT, 

                        user_id int(11) NOT NULL,

                        pub_id int(11) NOT NULL,

                        commentaire VARCHAR(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,

                        userfullname VARCHAR(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'inconnu',

                        audioname VARCHAR(250) NULL,

                        datetime timestamp NOT NULL DEFAULT current_timestamp(),

                        FOREIGN KEY(user_id) REFERENCES user(id),

                        FOREIGN KEY(pub_id) REFERENCES " . $name_table_tribuG . "_publication(id)

                        ON DELETE CASCADE

                        ON UPDATE CASCADE

                        )ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";





                    $this->getPDO()->exec($sql);

                    $sql = "CREATE TABLE ".$name_table_tribuG."_reaction(

                        id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT, 

                        user_id int(11) NOT NULL,

                        pub_id int(11) NOT NULL,

                        reaction TINYINT(1) DEFAULT 0,

                        userfullname VARCHAR(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'inconnu',

                        datetime timestamp NOT NULL DEFAULT current_timestamp(),

                        FOREIGN KEY(user_id) REFERENCES user(id),

                        FOREIGN KEY(pub_id) REFERENCES " . $name_table_tribuG . "_publication(id)

                        ON DELETE CASCADE

                        ON UPDATE CASCADE

                    )ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";

                    $this->getPDO()->exec($sql);


                    /** 
                     * @author Elie
                     * Create a table for pastille restaurant */

                     $sql_restaurant = "CREATE TABLE ".$name_table_tribuG."_restaurant(

                        id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT, 

                        extensionId int(11) NOT NULL,

                        denomination_f varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,

                        isPastilled TINYINT(1) DEFAULT 1,

                        datetime timestamp NOT NULL DEFAULT current_timestamp()

                    )ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";

                    $this->getPDO()->exec($sql_restaurant);

                    $sql_restaurant_comment = "CREATE TABLE ".$name_table_tribuG."_restaurant_commentaire(

                        id int(11)  NOT NULL PRIMARY KEY AUTO_INCREMENT,

                        extensionId varchar(250) NOT NULL,

                        userId varchar(250) NOT NULL,

                        note decimal(3,2) DEFAULT NULL,

                        commentaire text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,

                        datetime timestamp NOT NULL DEFAULT current_timestamp()

                      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";


                    $this->getPDO()->exec($sql_restaurant_comment);

                    $sql_golf = "CREATE TABLE ".$name_table_tribuG."_golf(

                        id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT, 

                        extensionId int(11) NOT NULL,

                        denomination_f varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,

                        isPastilled TINYINT(1) DEFAULT 1,

                        datetime timestamp NOT NULL DEFAULT current_timestamp()

                    )ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";

                    $this->getPDO()->exec($sql_golf);

                    $sql_golf_comment = "CREATE TABLE ".$name_table_tribuG."_golf_commentaire(

                        id int(11)  NOT NULL PRIMARY KEY AUTO_INCREMENT,

                        extensionId int(11) NOT NULL,

                        userId int(11) NOT NULL,

                        note decimal(3,2) DEFAULT NULL,

                        commentaire text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,

                        datetime timestamp NOT NULL DEFAULT current_timestamp()

                      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";


                    $this->getPDO()->exec($sql_golf_comment);

                    /** End restaurant table */


                    // Create table agenda for  tribu G

                    ///agenda table
                    // $sql = "CREATE TABLE " . $name_table_tribuG . "_agenda(

                    //     `id` int(11) NOT NULL AUTO_INCREMENT,

                    //     `title` varchar(255) NOT NULL,

                    //     `type` varchar(255) NOT NULL,

                    //     `restaurant` varchar(255) DEFAULT NULL,

                    //     `participant` int(10) DEFAULT NULL,

                    //     `from_date` datetime NOT NULL,

                    //     `to_date` datetime NOT NULL,

                    //     `status` tinyint(1) NOT NULL DEFAULT 0,

                    //     `lat` float NOT NULL DEFAULT 0,

                    //     `lng` float NOT NULL DEFAULT 0,

                    //     `user_id` int(11) NOT NULL,

                    //     `description` varchar(255) DEFAULT NULL,

                    //     `isActive` tinyint(1) NOT NULL DEFAULT 1,

                    //     `datetime` timestamp NOT NULL DEFAULT current_timestamp(),

                    //     PRIMARY KEY (`id`),

                    //     FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) 

                    //     ON DELETE CASCADE

                    //     ON UPDATE CASCADE

                    // ) ENGINE=InnoDB";
                    // $this->getPDO()->exec($sql);
                    
                    ///agenda action
                    // $sql = "CREATE TABLE " . $name_table_tribuG . "_agenda_action(

                    //     `id` int(11) NOT NULL AUTO_INCREMENT,

                    //     `user_id` int(11) NOT NULL,

                    //     `agenda_id` int(11) NOT NULL,

                    //     `type_action` varchar(255) NOT NULL,

                    //     `status` int(1) NOT NULL DEFAULT 1,

                    //     `datetime` datetime NOT NULL DEFAULT current_timestamp(),

                    //     PRIMARY KEY (`id`),

                    //     FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),

                    //     FOREIGN KEY (`agenda_id`) REFERENCES " . $name_table_tribuG . "_agenda (`id`)

                    //     ON DELETE CASCADE 

                    //     ON UPDATE CASCADE

                    //   ) ENGINE=InnoDB";

                    // $this->getPDO()->exec($sql);
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


    /**
     * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
     * 
     * @param int $userId: userID of the user
     * 
     * @return string full name of the user
     */
    public function getFullName($userId)
    {
        $statement = $this->getPDO()->prepare("select * from (select concat(firstname, ' ', lastname) as fullname, user_id from consumer union select concat(firstname, ' ', lastname) as fullname, user_id from supplier) as tab where tab.user_id = $userId");
        $statement->execute();
        $result = $statement->fetch(PDO::FETCH_ASSOC);

        return $result["fullname"];
    }


    /**
     * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
     * 
     * @param int $userId: userID of the user
     * 
     * @return string table Tribu G name 
     */
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
        $result = $statement->fetch(PDO::FETCH_ASSOC);

        return $result['roles'] ==="utilisateur" ? "Partisan" : "Fondateur";
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



    public function setIsModerateur($table_name, $user_id, $val){

        $sql = "UPDATE " . $table_name . " set isModerate = " . $val . " where user_id  =" . $user_id;

        $statement = $this->getPDO()->prepare($sql);

        return $statement->execute();

    }

    // public function getAllPublication(){

    //     $sql = "SELECT * FROM tributg_".$commun_code_postal."";

    //     $statement = $this->getPDO()->query($sql);

    //     $resultat=$statement->fetchAll();

    //     return $resultat;

    // }


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
     * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
     * 
     * @param string $table_name: name of the table
     * 
     * @return array array containing all user id in tribut G like [ [ "user_id" => ... ], ... ]
     */
    public function getAllTributG($table_name){

        $statement = $this->getPDO()->prepare('SELECT DISTINCT user_id FROM ' . $table_name);

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
     * @param user_id: user id
     * 
     * @return string : fondateur ou utilistateur
     */
    public function getCurrentStatus($table_name, $userID){
        
        $statement = $this->getPDO()->prepare("SELECT roles FROM $table_name WHERE user_id = $userID");
        $statement->execute();
        $result = $statement->fetch(PDO::FETCH_ASSOC);

        return $result ?  $result['roles'] : false;
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
        
        $status= $this->getCurrentStatus($table_name, $user_id);

        return ["status" => $status, "verified" => $isVerified ];
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

        $data = $statement->fetch(PDO::FETCH_ASSOC);

        $result = [
            "id" => $data['id'],
            "user_id" => $data['user_id'],
            "name" => $data['name'],
            "description" => json_decode($this->convertUnicodeToUtf8($data['description']), true),
            "avatar" => $data['avatar'],
            "roles" => $data["roles"],
            "datetime" => $data['datetime'],
            "isBanished" => $data["isBanished"],
            "isDeveloper" => $data["isDeveloper"],
            "isModerate" => $data["isModerate"]
        ];
        return $result;

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
     * Persiste new publication in database
     * 
     * @param string $table_pub: Name of the table containing the publication
     * @param int $user_id: id of the user
     * @param string $publication_id: publication content
     * @param string $confid : confidential of the publication
     * @param string $photo: image in the publication
     * 
     */
    public function createOnePub($table_pub, $user_id, $publication, $confid, $photo){

        if( !$this->isTableExist($table_pub)){
            return false;
        }

        $statement = $this->getPDO()->prepare(
            "INSERT INTO $table_pub (user_id, publication, confidentiality, photo, userfullname) 
            values (:user_id, :publication, :confidentiality, :photo, :userfullname)"
        );
        
        //// convert text publication
        $publication = $this->convertUtf8ToUnicode($publication);

        $userfullname = $this->getFullName($user_id);
        $publication=str_replace("\u","\\u",$publication);
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
     * Get all publications in this table (brutes: entity).
     * 
     * @param string $table_name: name of the table
     */
    public function getAllPublicationBrutes($table_name){

        $statement = $this->getPDO()->prepare("SELECT * FROM $table_name" ."_publication ORDER BY datetime DESC LIMIT 6;");

        $statement->execute();

        $publications = $statement->fetchAll(PDO::FETCH_ASSOC); // [...publications]

        return $publications;
    }


    /**
     * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
     * 
     *  Get apropos of the tribu G ( name, description,avatar)
     * 
     * @param string $table_name: name of the table
     * 
     * @return array associative : [ 'name' => ... , 'description' => ... , 'avatar' => ... ]
     */
    public function getApropos($table_name){

        $statement = $this->getPDO()->prepare("SELECT name, description, avatar FROM $table_name");
        $statement->execute();
        $apropos = $statement->fetch(PDO::FETCH_ASSOC);
        
        if( !$apropos ){
            return false;
        }

        $apropos['name'] = 'Tribu G ' . $apropos['name'];

        return $apropos;
    }


    /**
     * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
     * 
     * Get all publications in this table.
     * 
     * @param string $table_name: name of the table
     */
    public function getAllPublications($table_name){

        $apropo_tribuG= $this->getApropos($table_name);
        // dd($apropo_tribuG);

        $publications = $this->getAllPublicationBrutes($table_name); // [...publications]
        $resultats = [];

        if( count($publications) > 0 ){
            foreach( $publications as $publication ){

                $publication_id = $publication["id"];
                $publication_user_id= $publication["user_id"];
    
                $statement_photos = $this->getPDO()->prepare("SELECT photo_profil FROM (SELECT photo_profil, user_id FROM consumer union SELECT photo_profil, user_id FROM supplier) as tab WHERE tab.user_id = $publication_user_id");
    
                $statement_photos->execute();
    
                $photo_profil = $statement_photos->fetch(PDO::FETCH_ASSOC); /// [ photo_profil => ...]
    
                $publication["photo_profil"] = $photo_profil["photo_profil"];
    
                $statement = $this->getPDO()->prepare("SELECT * FROM $table_name"."_commentaire WHERE pub_id = '" .$publication_id . "'");
    
                $statement->execute();
    
                $comments = $statement->fetchAll(PDO::FETCH_ASSOC); /// [...comments ]
    
     
    
                $publication["comments"] = $comments;
    
    
    
                $statement = $this->getPDO()->prepare("SELECT * FROM $table_name"."_reaction WHERE pub_id = '" .$publication_id . "' AND reaction= '1'");
    
                $statement->execute();
    
                $reactions = $statement->fetchAll(PDO::FETCH_ASSOC);
    
    
    
                $publication["reactions"] = $reactions; /// [ ...reactions ]
    
                $publication["tribu"]["state"] = "Tribu G";
                $publication["tribu"]["name"] = $apropo_tribuG['name'];
                $publication["tribu"]["description"] = $apropo_tribuG['description'];
                $publication["tribu"]["avatar"] = $apropo_tribuG['avatar'];
    
    
    
                array_push($resultats, $publication);
    
            }
        }

        return $resultats; /// [ [...publication, "comments" => ... , "reactions" => ... ], ...]

    }


        /**
     * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
     * 
     * Get all publications in this table.
     * 
     * @param string $table_name: name of the table
     * 
     * @return array [[associative]]: [ 
     *                              [ 
     *                                "userOwnPub" => [ id => ..., profil => ..., fullName => ... ], 
     *                                "publication" => [ id => ..., description => ..., image => ..., createdAt => ..., comments => ..., reactions => ... ], 
     *                                "tribu" => [ type => ..., name => ..., description => ...,avatar => ... ],
     *                              ],
     *                              ...
     *                            ]
     */
    public function getAllPublicationsUpdate($table_name){
        $resultats = [];

        $apropo_tribuG= $this->getApropos($table_name);
        // dd($apropo_tribuG);
        if( !$apropo_tribuG){
            return $resultats;
        }

        $publications = $this->getAllPublicationBrutes($table_name); // [...publications]

        if( count($publications) > 0 ){
            foreach( $publications as $d_pub ){

                $publication_id = $d_pub["id"];
                $publication_user_id= $d_pub["user_id"];

                $statement_photos = $this->getPDO()->prepare("SELECT photo_profil FROM (SELECT photo_profil, user_id FROM consumer union SELECT photo_profil, user_id FROM supplier) as tab WHERE tab.user_id = $publication_user_id");
                $statement_photos->execute();
                $photo_profil = $statement_photos->fetch(PDO::FETCH_ASSOC); /// [ photo_profil => ...]

                $statement = $this->getPDO()->prepare("SELECT * FROM $table_name"."_commentaire WHERE pub_id = '" .$publication_id . "'");
                $statement->execute();
                $comments = $statement->fetchAll(PDO::FETCH_ASSOC); /// [...comments ]

                $statement = $this->getPDO()->prepare("SELECT * FROM $table_name"."_reaction WHERE pub_id = '" .$publication_id . "' AND reaction= '1'");
                $statement->execute();
                $reactions = $statement->fetchAll(PDO::FETCH_ASSOC);

                $data= [
                    "userOwnPub" => [
                        "id" => $d_pub["user_id"],
                        "profil" => $photo_profil["photo_profil"],
                        "fullName" => $d_pub["userfullname"],
                    ],
                    "publication" => [
                        "id" => $d_pub["id"],
                        "confidentiality" => $d_pub['confidentiality'],
                        "description" => json_decode($this->convertUnicodeToUtf8($d_pub['publication'] ),true), //// when get, must decode
                        "image" => $d_pub['photo'],
                        "createdAt" => $d_pub["datetime"],
                        "comments" => $comments,
                        "reactions" => $reactions,
                    ],
                    "tribu" => [
                        "type" => "Tribu G",
                        "name" => $apropo_tribuG['name'],
                        "description" => $apropo_tribuG['description'],
                        "avatar" =>  $apropo_tribuG['avatar'],
                        "table" => $table_name
                    ]
                ];

                array_push($resultats, $data);

            }
        }

        return $resultats; 

    }

    /**
     * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
     * 
     * Get number all  publications in this table.
     * 
     * @param string $table_name: name of the table
     * 
     * @return number : count of publications in this table
     */
    public function getCountAllPublications($table_name){

        $statement = $this->getPDO()->prepare("SELECT COUNT(*) as count_publication FROM $table_name" ."_publication;");
        $statement->execute();
        $result = $statement->fetch(PDO::FETCH_ASSOC); // [ count_publication => ... ]
        extract($result);  /// $count_publication

        return $count_publication;
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



        $statement = $this->getPDO()->prepare("INSERT INTO $table_comment (user_id, pub_id, commentaire, userfullname) values (:user_id, :pub_id, :commentaire, :userfullname)");



        $statement->bindParam(':user_id', $user_comment_id);

        $statement->bindParam(':pub_id', $publication_id);

        $statement->bindParam(':commentaire', $comment);

        $statement->bindParam(':userfullname', $userfullname);

        // $statement->bindParam(':audioname', $audioname);

        

        return $statement->execute();

    }


     /**
     * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
     * 
     * @param string $table_name: name of the table origin
     * @param int $userID: id of the user comment currently logged
     * @param int publication_id: id of the publication
     * @param string $comment: text comment
     * @param string $audioname: name of the audio comment
     */

     public function handlePublicationCommentUpdate($table_name,$userID, $publication_id, $comment, $audioname ){

        $table_comment = $table_name. "_commentaire";
        if(!$this->isTableExist($table_comment)){
            return false;
        }

        $comment = $this->convertUtf8ToUnicode($comment);

        $userfullname = $this->getFullName($userID);

        $statement = $this->getPDO()->prepare("INSERT INTO $table_comment (user_id, pub_id, commentaire, userfullname) values (:user_id, :pub_id, :commentaire, :userfullname)");

        $statement->bindParam(':user_id', $userID);
        $statement->bindParam(':pub_id', $publication_id);
        $statement->bindParam(':commentaire', $comment);
        $statement->bindParam(':userfullname', $userfullname);
      

        return $statement->execute();
    }


    public function changeComment(
        $publication_id,
        $comment_id,
        $comment_text,
        $user_id
    ){
        $table_comment = $this->getTableNameTributG($user_id) . "_commentaire";

        $sql = "UPDATE  $table_comment  set commentaire = '$comment_text' where pub_id = '$publication_id' and id= '$comment_id'";

        $statement = $this->getPDO()->prepare($sql);

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

        $statement = $this->getPDO()->prepare("SELECT * FROM $table_comment  WHERE pub_id = $publication_id");
        $statement->execute();
        $comments= $statement->fetchAll(PDO::FETCH_ASSOC);

        $results= [];
        if( count($comments) > 0 ){
            foreach($comments as $comment){
                $user_id= $comment["user_id"];
    
                $sql = "SELECT photo_profil FROM (SELECT photo_profil, user_id FROM consumer union SELECT photo_profil, user_id FROM supplier) as tab WHERE tab.user_id = $user_id";
                $statement = $this->getPDO()->prepare($sql);
                $statement->execute();
                $image = $statement->fetch();
    
                $comment["photo_profil"] = $image["photo_profil"];
                array_push($results, $comment);
            }
        }

        return $results;

    }


    /**
     * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
     * 
     * Get count of the user in tribu G  
     * 
     * @param string $table: table name of the tribu G
     * 
     * @return int count
     */ 
    public function getCountPartisant( string $table){
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


    public function showRightTributName($table){

        $statement = $this->getPDO()->prepare("c");

        $statement->execute();
        $result = $statement->fetch(PDO::FETCH_ASSOC);

        return $result;
    }


    /**
     * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
     * 
     * 
     * @return array associatif (ex: ["table_name" => ... , "count" => ... ])
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
            try{
                $tab= $table["table_name"];
                $statement = $this->getPDO()->prepare("SELECT count(*) as nbr FROM $tab");
                $statement->execute();
                $temp = $statement->fetch(PDO::FETCH_ASSOC);
                array_push($results, ["table_name" => $tab, "count" => $temp['nbr']]);
             }catch(Exception $e){
                 continue;
            }
           
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
                if($this->isTableExist($result[$i]["table_name"])){
                    if($i != count($result) -1){
                        $sql .= "'".$result[$i]["table_name"] ."' as tribug from " .$result[$i]["table_name"] ." UNION SELECT user_id, ";
                    }else{
                        $sql .="'".$result[$i]["table_name"] ."' as tribug from " .$result[$i]["table_name"];
                    }
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

    /**
     * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
     * 
     * Get one pub from ID
     * 
     * @param string $table: table publication tribut G
     * @param int $pub_id: id publication
     * 
     * @return array associative : One publication
     */
    public function getOnePublication($table, $pub_id){
        ///get one publication
        $table_pub= $table . "_publication";
        $table_reaction= $table . "_reaction";
        $table_commentaire= $table . "_commentaire";

        // $sql= "SELECT * FROM $table_pub as t1 LEFT JOIN $table_reaction as b ON a.id = b.pub_id  WHERE id=$pub_id";
        $sql="SELECT * FROM $table_pub as t1 
                LEFT JOIN(
                    SELECT pub_id,count(*) as nbr_c FROM $table_commentaire group by pub_id
                ) as t2 
                ON t1.id= t2.pub_id 
                -- LEFT JOIN(
                --     SELECT pub_id,count(*) as nbr_r FROM $table_reaction group by pub_id
                -- ) as t3
                -- ON t1.id= t3.pub_id
                
            WHERE id=$pub_id";

        // $sql = "SELECT * FROM $table_publication_Tribu_T as t1 LEFT JOIN(SELECT pub_id ,count(*)"
        // . "as nbr FROM $table_commentaire_Tribu_T group by pub_id ) as t2 on t1.id=t2.pub_id  ORDER BY t1.id DESC LIMIT :limits ";

        $statement = $this->getPDO()->prepare($sql);
        $statement->execute();
        $pub = $statement->fetchAll(PDO::FETCH_ASSOC); // [...publications]

        $publication_user_id= $pub[0]["user_id"];
        $statement_photos = $this->getPDO()->prepare("SELECT photo_profil FROM (SELECT photo_profil, user_id FROM consumer union SELECT photo_profil, user_id FROM supplier) as tab WHERE tab.user_id = $publication_user_id");
        $statement_photos->execute();

        $photo_profil = $statement_photos->fetchAll(PDO::FETCH_ASSOC); /// [...photo_profil ]

        $pub[0]["photo_profil"] = $photo_profil[0]["photo_profil"];

        $statement = $this->getPDO()->prepare("SELECT * FROM $table_reaction WHERE pub_id = $pub_id AND reaction= '1'");
        $statement->execute();
        $reactions = $statement->fetchAll(PDO::FETCH_ASSOC);

        $pub[0]["reactions"] = $reactions; /// [ ...reactions ]
        return $pub;
    }

    public function getNextPubID($table_publication, $last_pubID){
        $next_pubID=0;

        $statement = $this->getPDO()->prepare("SELECT id FROM $table_publication ORDER BY id DESC");
        $statement->execute();
        $all_ID = $statement->fetchAll(PDO::FETCH_ASSOC);
        for($i=0 ; $i < count($all_ID); $i++){
            if( intval($all_ID[$i]["id"]) === intval($last_pubID) && $i+1 < count($all_ID) ){
                $next_pubID= intval($all_ID[$i+1]["id"]);
                break;
            }
        }

        return $next_pubID;
    }

    /**
     * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
     * 
     * Delete one comment from ID
     * 
     * @param string $table: table publication tribut G
     * @param int $pub_id: id publication
     * @param int $comment_id : id of the comment
     * 
     * @return void
     */
    public function deleteOneCommentaire($table, $pub_id, $comment_id ){
        ///get one publication
        $table_pub= $table . "_publication";
        $table_reaction= $table . "_reaction";
        $table_commentaire= $table . "_commentaire";

        $sql= "DELETE FROM $table_commentaire WHERE id = $comment_id AND pub_id= $pub_id";

        $statement = $this->getPDO()->prepare($sql);
        return $statement->execute();
    }


    /**
     * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
     * 
     * @param string $tableName : table name tribu G
     * 
     * @return array associative like [ [ "userID" => ... , "fullName" => ... ], ... ] 
     * 
     */
    public function getFullNameForAllMembers($tableName){
        $results= [];
        $all_users= $this->getAllTributG($tableName);
        
        foreach($all_users as $user){
            $full_name= $this->getFullName(intval($user["user_id"]));

            $result= ["userID" => intval($user["user_id"]), "fullName" => $full_name ];
            array_push($results, $result);
        }
        
        return $results;
    }

    /**
     * @author Elie Fenohasina <eliefenohasina@gmail.com>
     * @return array : list of tribu G exists
     */
    public function getAllTribuGExists(){

        $sql = "SELECT tributg FROM `consumer` UNION SELECT tributg FROM `supplier`";
        $statement = $this->getPDO()->prepare($sql);

        $statement->execute();
        $results = $statement->fetchAll(PDO::FETCH_ASSOC);

        return $results;
    }

    /**
     * @author Elie
     * Fonction checking si le resto est déjà pastillé
     */
    public function getIdRestoOnTableExtension($table, $idResto){

        $statement = $this->getPDO()->prepare("SELECT * FROM $table WHERE extensionId = $idResto");

        $statement->execute();

        $result = $statement->fetchAll(PDO::FETCH_ASSOC);

        return $result;
    }

    /**
     * @author Elie
     * Fonction checking si le resto est déjà pastillé
     */
    public function isPastilled($table, $idResto){

        $statement = $this->getPDO()->prepare("SELECT * FROM $table WHERE extensionId = $idResto and isPastilled = 1");

        $statement->execute();

        $result = $statement->fetchAll(PDO::FETCH_ASSOC);

        return $result;
    }

    /**
     * @author Elie
     * Fonction depastille restaurant
     */
    public function depastilleOrPastilleRestaurant($table_resto, $resto_id, $isPastilled){

        $sql = "UPDATE $table_resto SET isPastilled = :isPastilled WHERE extensionId = :resto_id";

        $stmt = $this->getPDO()->prepare($sql);

        $stmt->bindParam(":isPastilled", $isPastilled);

        $stmt->bindParam(":resto_id", $resto_id);

        $stmt->execute();

    }

    /**
     * @author Elie
     * Fonction Pastille resto
     */
    public function pastilleRestaurant($table_resto_pastille, $name,$resto_id){

        $sql = "INSERT INTO $table_resto_pastille (denomination_f, extensionId) VALUES (?, ?) ON DUPLICATE KEY UPDATE denomination_f= ?";

        $stmt = $this->getPDO()->prepare($sql);

        $stmt->bindParam(1, $name);

        $stmt->bindParam(2, $resto_id);

        $stmt->bindParam(3, $name);

        $stmt->execute();

    }

    public function depastilleRestaurant($table, $id){

        $sql= "DELETE FROM $table WHERE id = :id";

        $statement = $this->getPDO()->prepare($sql);

        $statement->bindParam(':id', $id);

        $statement->execute();
    }

    /**
     * @author Elie Fenohasina <eliefenohasina@gmail.com>
     * @return array : list of tribu G exists
     */
    public function getAllRestoTribuG($table_name){

        $table_resto = $table_name."_restaurant";

        $statement = $this->getPDO()->prepare('SELECT * FROM ' . $table_resto. '');

        $statement->execute();

        return $statement->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getRestoPastillesTribuG($table_name){

        $tableResto = $table_name."_restaurant";
        $tableComment = $table_name."_restaurant_commentaire";
    
        $sql="SELECT * FROM (SELECT t1.id , t2.id as id_resto_comment, t1.extensionId as id_resto,t1.denomination_f, 
                          t1.isPastilled, t2.extensionId as id_restaurant, t2.userId as id_user,t2.note,t2.commentaire,
                          GROUP_CONCAT(t2.userId) as All_user ,GROUP_CONCAT(t2.commentaire) as All_com,FORMAT(AVG(t2.note),2) as globalNote, COUNT(t2.extensionId) as nbrAvis ,
                          GROUP_CONCAT(t2.id) as All_id_r_com
                          FROM  $tableResto as t1 left join $tableComment  as t2 on t1.extensionId=t2.extensionId where  t1.isPastilled IS TRUE GROUP BY t1.id ) as tableRestCom  
          INNER JOIN bdd_resto ON tableRestCom.id_resto=bdd_resto.id";
        $stmt = $this->getPDO()->prepare($sql);
        
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return $result;

    }

    /**
     * @author Elie
     * fetch resto pastiller dans tribu G
     */
    public function getRestoPastillesTribuGV2($table_name){

        $tableResto = $table_name."_restaurant";
        $tableComment = "avisrestaurant";
    
        $sql="SELECT * FROM (SELECT t1.id , t2.id as id_resto_comment, t1.extensionId as id_resto,t1.denomination_f, 
                          t1.isPastilled, t2.id_resto as id_restaurant, t2.id_user as id_user,t2.note,t2.avis,
                          GROUP_CONCAT(t2.id_user) as All_user ,GROUP_CONCAT(t2.avis) as All_com,FORMAT(AVG(t2.note),2) as globalNote, COUNT(t2.id_resto) as nbrAvis ,
                          GROUP_CONCAT(t2.id) as All_id_r_com
                          FROM  $tableResto as t1 left join $tableComment  as t2 on t1.extensionId=t2.id_resto where  t1.isPastilled IS TRUE GROUP BY t1.id ) as tableRestCom  
          INNER JOIN bdd_resto ON tableRestCom.id_resto=bdd_resto.id";
        $stmt = $this->getPDO()->prepare($sql);
        
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return $result;

    }

    public function getAllAvisByRestName($tableResto,$id){
        $data=[
            ":id"=>$id
        ];
        $sql="SELECT * FROM (SELECT t1.id as id_comment, extensionId, userId, note, commentaire, datetime, t2.pseudo FROM $tableResto as t1 LEFT JOIN user as t2 ON t1.userId = t2.id where t1.extensionId = :id ) as tab 
            INNER JOIN (SELECT concat(firstname, ' ', lastname) as fullname, photo_profil, user_id FROM consumer UNION SELECT concat(firstname, ' ', lastname) as fullname, photo_profil, user_id FROM supplier) as profil 
            ON tab.userId = profil.user_id";
        $stmt = $this->getPDO()->prepare($sql);
        $stmt->execute($data);
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return $result;
      }

    /**
     * @author Elie
     * fetch golf pastiller dans tribu G
     */
    public function getGolfPastillesTribuGV2($table_name){

        $tableResto = $table_name."_golf";
        $tableComment = "avisgolf";
    
        $sql="SELECT * FROM (SELECT t1.id , t2.id as id_golf_comment, t1.extensionId as id_golf_extension,t1.denomination_f, 
                          t1.isPastilled, t2.id_golf as id_golf, t2.id_user as id_user,t2.note,t2.avis,
                          GROUP_CONCAT(t2.id_user) as All_user ,GROUP_CONCAT(t2.avis) as All_com,FORMAT(AVG(t2.note),2) as globalNote, COUNT(t2.id_golf) as nbrAvis ,
                          GROUP_CONCAT(t2.id) as All_id_r_com
                          FROM  $tableResto as t1 left join $tableComment  as t2 on t1.extensionId=t2.id_golf where  t1.isPastilled IS TRUE GROUP BY t1.id ) as tableRestCom  
          INNER JOIN golffrance ON tableRestCom.id_golf_extension=golffrance.id";

          $sql2 = "SELECT * FROM $tableResto";
        $stmt = $this->getPDO()->prepare($sql);
        
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return $result;

    }
}