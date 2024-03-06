<?php

namespace App\Service;



use PDO;

use App\Entity\Consumer;
use App\Entity\Supplier;
use Doctrine\DBAL\Driver\SQLSrv\Exception\Error;
use Exception;

class TributGService extends PDOConnexionService
{



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
        $resultat = $sql->rowCount();

        if ($resultat > 0) {
            // $data = "Insert into tributg_".$commun_code_postal." (id, user_id, roles) values (UUID(), $user_id,'[\"Utilisateur\"]')";
            if($this->isValidParAdmin($name_table_tribuG) == 1){

                $data = "Insert into " . $name_table_tribuG . " (user_id, roles) values ( $user_id,'utilisateur')";
            }else{
                $data = "Insert into " . $name_table_tribuG . " (user_id, roles) values ( $user_id,'fondateur')";
            }

            $this->getPDO()->exec($data);
        } else {
            ///Formatage name
            $depart_tributG = explode("_", $name_table_tribuG); /// ["tribug", (departement code) , (...departement name ) ]
            $depart_tributG_name = mb_convert_case($depart_tributG[2], MB_CASE_TITLE, "UTF-8");

            for ($i = 3; $i < count($depart_tributG); $i++) {
                $depart_tributG_name .= " "  .  mb_convert_case($depart_tributG[$i], MB_CASE_TITLE, "UTF-8");
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

                isSuspendu tinyint(1) DEFAULT 0 NOT NULL,

                isDeveloper tinyint(1) DEFAULT 0 NOT NULL,

                isModerate  tinyint(1) DEFAULT 0 NOT NULL,

                isValid  tinyint(1) DEFAULT 0 NOT NULL

            )ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci";

            try {
                $db = $this->getPDO()->prepare($sql);
                $db->bindParam(":description", $description, PDO::PARAM_STR);
                $db->bindParam(":name", $depart_tributG_name, PDO::PARAM_STR);
                $db->execute();
            } catch (Error $error) {
                throw $error;
            }

            $data = "Insert into " . $name_table_tribuG . " (user_id, roles) values ($user_id,'fondateur')";

            $final = $this->getPDO()->exec($data);

            /** Add by Elie */
            
            $sql_role_user = "SELECT id FROM user WHERE roles like '%ROLE_GODMODE%' ";
            
            $statement_role = $this->getPDO()->prepare($sql_role_user);
            
            $statement_role->execute();
            
            $result_role = $statement_role->fetch(PDO::FETCH_ASSOC)['id'];
            
            /** If SUPER ADMIN */
            if($result_role === $user_id){

                $this->getPDO()->exec("Insert into tribu_g_list (table_name, user_id, is_valid) values ('$name_table_tribuG', $user_id, 1)");

                $this->setValidAdhesionTribuG($name_table_tribuG , $user_id, 1);
            // Not SUPER ADMIN
            }else{

                // Attend Approbation for superUser of fondateur
                $this->getPDO()->exec("Insert into tribu_g_list (table_name, user_id, is_valid) values ('$name_table_tribuG', $user_id, 0)");
            }

            /** End Elie */


            if($final > 0){

                $this->creaTableTeamMessage($name_table_tribuG);

                $query = "CREATE TABLE " . $name_table_tribuG . "_publication(

                    id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT, 

                    user_id int(11) NOT NULL,

                    publication TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,

                    confidentiality TINYINT(1) NOT NULL,

                    photo VARCHAR(250) NULL,

                    userfullname VARCHAR(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,

                    datetime timestamp NOT NULL DEFAULT current_timestamp(),

                    isAlbum TINYINT(1) NOT NULL DEFAULT 0,

                    FOREIGN KEY(user_id) REFERENCES user(id)

                    ON DELETE CASCADE

                    ON UPDATE CASCADE

                )ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";

                $final2 = $this->getPDO()->exec($query);

                if ($final2 == 0) {

                    $sql = "CREATE TABLE " . $name_table_tribuG . "_commentaire(

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

                    $sql = "CREATE TABLE " . $name_table_tribuG . "_reaction(

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

                    $sql_restaurant = "CREATE TABLE " . $name_table_tribuG . "_restaurant(

                        id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT, 

                        extensionId int(11) NOT NULL,

                        denomination_f varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,

                        isPastilled TINYINT(1) DEFAULT 1,

                        datetime timestamp NOT NULL DEFAULT current_timestamp()

                    )ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";

                    $this->getPDO()->exec($sql_restaurant);

                    $sql_restaurant_comment = "CREATE TABLE " . $name_table_tribuG . "_restaurant_commentaire(

                        id int(11)  NOT NULL PRIMARY KEY AUTO_INCREMENT,

                        extensionId varchar(250) NOT NULL,

                        userId varchar(250) NOT NULL,

                        note decimal(3,2) DEFAULT NULL,

                        commentaire text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,

                        datetime timestamp NOT NULL DEFAULT current_timestamp()

                      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";


                    $this->getPDO()->exec($sql_restaurant_comment);

                    $sql_golf = "CREATE TABLE " . $name_table_tribuG . "_golf(

                        id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT, 

                        extensionId int(11) NOT NULL,

                        denomination_f varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,

                        isPastilled TINYINT(1) DEFAULT 1,

                        datetime timestamp NOT NULL DEFAULT current_timestamp()

                    )ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";

                    $this->getPDO()->exec($sql_golf);

                    $sql_golf_comment = "CREATE TABLE " . $name_table_tribuG . "_golf_commentaire(

                        id int(11)  NOT NULL PRIMARY KEY AUTO_INCREMENT,

                        extensionId int(11) NOT NULL,

                        userId int(11) NOT NULL,

                        note decimal(3,2) DEFAULT NULL,

                        commentaire text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,

                        datetime timestamp NOT NULL DEFAULT current_timestamp()

                      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";


                    $this->getPDO()->exec($sql_golf_comment);

                    //creation table nom album
                    $sqlCreateTableAlbum = " CREATE TABLE " . $name_table_tribuG . "_album(

                        id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,

                        name_album varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,

                        datetime datetime NOT NULL DEFAULT current_timestamp()

                      ) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci";


                    $this->getPDO()->exec($sqlCreateTableAlbum);

                    //creation table path album
                    $sqlCreateTablePathAlbum = " CREATE TABLE " . $name_table_tribuG . "_album_path(

                        id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,

                        path varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,

    					album_id int(11) NOT NULL,

    					id_pub int(11) NOT NULL,

    					FOREIGN KEY (album_id) REFERENCES " . $name_table_tribuG . "_album(id),

    					FOREIGN KEY (id_pub) REFERENCES " . $name_table_tribuG . "_publication(id)

                      ) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci";

                    $this->getPDO()->exec($sqlCreateTablePathAlbum);

                    $query_table_invitation = "CREATE TABLE IF NOT EXISTS " . $name_table_tribuG . "_invitation(
                        id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
                        user_id int(11) DEFAULT NULL,
                        sender_id int(11) DEFAULT NULL,
                        email varchar(255) NOT NULL,
                        is_valid tinyint(1) NOT NULL DEFAULT 0,
                        datetime DATETIME NOT NULL DEFAULT current_timestamp()
                      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci";

                    $this->getPDO()->exec($query_table_invitation);

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

    public function changeProfilTribuG($table_name, $image_file)
    {

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
if ($result) {
        return $result["fullname"];
} else {
            return $this->getPseudoOfUser($userId);
        }
    }

    /**
     * @author Nantenaina
     * 
     * @param int $userId: userID of the user
     * 
     * @return string tributg of the user
     */
    public function getTribuG($userId)
    {
        $statement = $this->getPDO()->prepare("select * from (select tributg, user_id from consumer union select tributg, user_id from supplier) as tab where tab.user_id = $userId");
        $statement->execute();
        $result = $statement->fetch(PDO::FETCH_ASSOC);
        if($result){
            return $result["tributg"];
        }
        return "";
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

    public function getStatus($table_name, $user_id)
    {

        $statement = $this->getPDO()->prepare('SELECT roles FROM ' . $table_name . ' WHERE user_id = ' . $user_id . ' LIMIT 1');
        $statement->execute();
        $result = $statement->fetch(PDO::FETCH_ASSOC);

        return $result['roles'] === "utilisateur" ? "Partisan" : "Fondateur";
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
    public function getProfil($user, $entityManager)
    {

        $userType = $user->getType();
        $userId = $user->getId();

        ////profil user connected
        if ($userType == "consumer") {
            $profil = $entityManager->getRepository(Consumer::class)->findByUserId($userId);
        } else {
            $profil = $entityManager->getRepository(Supplier::class)->findByUserId($userId);
        }

        return $profil;
    }





    public function setIsDev($table_name, $user_id, $val)
    {

        $sql = "UPDATE " . $table_name . " set isDeveloper = " . $val . " where user_id  =" . $user_id;

        $statement = $this->getPDO()->prepare($sql);

        return $statement->execute();
    }



    public function setIsModerateur($table_name, $user_id, $val)
    {

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


    public function getBanishedStatus($table_name, $user_id)
    {

        $sql = "SELECT isBanished FROM " . $table_name . " where user_id  =" . $user_id;

        $statement = $this->getPDO()->prepare($sql);

        $statement->execute();

        return $statement->fetch(PDO::FETCH_ASSOC)['isBanished'];
    }





    public function setBanishePartisant($table_name, $user_id)
    {

        $sql = "UPDATE " . $table_name . " set isBanished = 1 where user_id  =" . $user_id;

        $statement = $this->getPDO()->prepare($sql);

        return $statement->execute();
    }

public function setSuspendrePartisant($table_name, $user_id)
    {
        if (!$this->isColumnExist($table_name, "isSuspendu")) {
            $this->updateTableTribuAddCullumnisSuspendu($table_name);
        }

        $sql = "UPDATE " . $table_name . " set isSuspendu = 1 where user_id  =" . $user_id;

        $statement = $this->getPDO()->prepare($sql);

        return $statement->execute();
    }


    public function getSuspenduStatus($table_name, $user_id)
    {
        if (!$this->isColumnExist($table_name, "isSuspendu")) {
            $this->updateTableTribuAddCullumnisSuspendu($table_name);
        }

        $sql = "SELECT isSuspendu FROM " . $table_name . " where user_id  =" . $user_id;

        $statement = $this->getPDO()->prepare($sql);

        $statement->execute();

        return $statement->fetch(PDO::FETCH_ASSOC)['isSuspendu'];
    }

    public function setSuspenduPartisant($table_name, $user_id)
    {
        if (!$this->isColumnExist($table_name, "isSuspendu")) {
            $this->updateTableTribuAddCullumnisSuspendu($table_name);
        }
        $sql = "UPDATE " . $table_name . " set isSuspendu = 1 where user_id  =" . $user_id;

        $statement = $this->getPDO()->prepare($sql);

        return $statement->execute();
    }



    public function changeRole($table_name, $user_id)
    {

        $sql = "UPDATE " . $table_name . " set roles = 'moderateur' where user_id  =" . $user_id;

        $statement = $this->getPDO()->prepare($sql);

        return $statement->execute();
    }





    public function undoBanishePartisant($table_name, $user_id)
    {

        $sql = "UPDATE " . $table_name . " set isBanished = 0 where user_id  =" . $user_id;

        $statement = $this->getPDO()->prepare($sql);

        return $statement->execute();
    }
public function undoSuspendrePartisant($table_name, $user_id)
    {
        if (!$this->isColumnExist($table_name, "isSuspendu")) {
            $this->updateTableTribuAddCullumnisSuspendu($table_name);
        }
        $sql = "UPDATE " . $table_name . " set isSuspendu = 0 where user_id  =" . $user_id;

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
    public function getAllTributG($table_name)
    {

        /** Add by Elie */
         if (!$this->isColumnExist($table_name, "isValid")) {
            $this->addColonneTable($table_name, "isValid");
        }
        /** End Elie */

        $statement = $this->getPDO()->prepare('SELECT DISTINCT user_id FROM ' . $table_name .' WHERE isValid = 1 ORDER BY id DESC');

        $statement->execute();

        return $statement->fetchAll(PDO::FETCH_ASSOC);
    }





    public function getTribuGtableForNotif($user_id)
    {

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
    public function getCurrentStatus($table_name, $userID)
    {

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

    public function getStatusAndIfValid($table_name, $isVerified,  $user_id)
    {

        $status = $this->getCurrentStatus($table_name, $user_id);

        return ["status" => $status, "verified" => $isVerified];
    }



    /**
     * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
     * 
     * @param string $table_name: name of the table
     * 
     * @return single tribut G
     */

    public function getProfilTributG($table_name, $user_id)
    {

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
            "isModerate" => $data["isModerate"],
            "table_name" => $table_name
        ];
        return $result;
    }





    public function getAllUserWithRoles($table_name)
    {



        $db = $_ENV["DATABASENAME"];



        $query = "SHOW TABLES FROM $db like '$table_name'";

        $sql = $this->getPDO()->query($query);



        $resultat = $sql->rowCount();



        if ($resultat === 0) {



            return $resultat;
        } else {



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
    public function createOnePub($table_pub, $user_id, $publication, $confid, $photo)
    {

        if (!$this->isTableExist($table_pub)) {
            return false;
        }

        $statement = $this->getPDO()->prepare(
            "INSERT INTO $table_pub (user_id, publication, confidentiality, photo, userfullname) 
            values (:user_id, :publication, :confidentiality, :photo, :userfullname)"
        );

        //// convert text publication
        $publication = $this->convertUtf8ToUnicode($publication);

        $userfullname = $this->getFullName($user_id);
        $publication = str_replace("\u", "\\u", $publication);
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
    public function getAllPublicationBrutes($table_name)
    {

        $statement = $this->getPDO()->prepare("SELECT * FROM $table_name" . "_publication ORDER BY datetime DESC LIMIT 6;");

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
    public function getApropos($table_name)
    {

        $statement = $this->getPDO()->prepare("SELECT name, description, avatar FROM $table_name");
        $statement->execute();
        $apropos = $statement->fetch(PDO::FETCH_ASSOC);

        if (!$apropos) {
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
    public function getAllPublications($table_name)
    {

        $apropo_tribuG = $this->getApropos($table_name);
        // dd($apropo_tribuG);

        $publications = $this->getAllPublicationBrutes($table_name); // [...publications]
        $resultats = [];

        if (count($publications) > 0) {
            foreach ($publications as $publication) {

                $publication_id = $publication["id"];
                $publication_user_id = $publication["user_id"];

                $statement_photos = $this->getPDO()->prepare("SELECT photo_profil FROM (SELECT photo_profil, user_id FROM consumer union SELECT photo_profil, user_id FROM supplier) as tab WHERE tab.user_id = $publication_user_id");

                $statement_photos->execute();

                $photo_profil = $statement_photos->fetch(PDO::FETCH_ASSOC); /// [ photo_profil => ...]

                $publication["photo_profil"] = $photo_profil["photo_profil"];

                $statement = $this->getPDO()->prepare("SELECT * FROM $table_name" . "_commentaire WHERE pub_id = '" . $publication_id . "'");

                $statement->execute();

                $comments = $statement->fetchAll(PDO::FETCH_ASSOC); /// [...comments ]



                $publication["comments"] = $comments;



                $statement = $this->getPDO()->prepare("SELECT * FROM $table_name" . "_reaction WHERE pub_id = '" . $publication_id . "' AND reaction= '1'");

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
    public function getAllPublicationsUpdate($table_name, $userId, $confidentialityService, $userService){
        $resultats = [];

        $apropo_tribuG = $this->getApropos($table_name);
        // dd($apropo_tribuG);
        if (!$apropo_tribuG) {
            return $resultats;
        }

        $publications = $this->getAllPublicationBrutes($table_name); // [...publications]

        if (count($publications) > 0) {
            foreach ($publications as $d_pub) {

                $publication_id = $d_pub["id"];
                $publication_user_id = $d_pub["user_id"];

                $statement_photos = $this->getPDO()->prepare("SELECT photo_profil FROM (SELECT photo_profil, user_id FROM consumer union SELECT photo_profil, user_id FROM supplier) as tab WHERE tab.user_id = $publication_user_id");
                $statement_photos->execute();
                $photo_profil = $statement_photos->fetch(PDO::FETCH_ASSOC); /// [ photo_profil => ...]

                $statement = $this->getPDO()->prepare("SELECT * FROM $table_name" . "_commentaire WHERE pub_id = '" . $publication_id . "'");
                $statement->execute();
                $comments = $statement->fetchAll(PDO::FETCH_ASSOC); /// [...comments ]

                $statement = $this->getPDO()->prepare("SELECT * FROM $table_name" . "_reaction WHERE pub_id = '" . $publication_id . "' AND reaction= '1'");
                $statement->execute();
                $reactions = $statement->fetchAll(PDO::FETCH_ASSOC);
                $description=json_decode($d_pub['publication'],true);
                $description=$this->convertUnicodeToUtf8($description);
                $description=mb_convert_encoding($description,'UTF-8', 'UTF-8');
                $pseudo = $confidentialityService->getConfFullname(intval($publication_user_id), $userId);
                $data= [
                    "userOwnPub" => [
                        "id" => $d_pub["user_id"],
                        "profil" => $photo_profil["photo_profil"],
                        //"fullName" => $d_pub["userfullname"],
                        "fullName" => $pseudo,
                    ],
                    "publication" => [
                        "id" => $d_pub["id"],
                        "confidentiality" => $d_pub['confidentiality'],
                        "description" => $description, // when get, must decode
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
    public function getCountAllPublications($table_name)
    {

        $statement = $this->getPDO()->prepare("SELECT COUNT(*) as count_publication FROM $table_name" . "_publication;");
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

    public function getAllPhotos($table_name)
    {



        $statement = $this->getPDO()->prepare("SELECT photo FROM $table_name" . "_publication ORDER BY datetime DESC;");

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

    public function handlePublicationReaction($pub_id, $user_id, $reaction, $tableTribuTReaction = null)
    {


        $table_reaction = $tableTribuTReaction ? $tableTribuTReaction : $this->getTableNameTributG($user_id) . "_reaction";


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

    public function handlePublicationComment($publication_id, $user_comment_id, $comment, $audioname)
    {



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

    public function handlePublicationCommentUpdate($table_name, $userID, $publication_id, $comment, $audioname)
    {

        $table_comment = $table_name . "_commentaire";
        if (!$this->isTableExist($table_comment)) {
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
    ) {
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

    public function fetchAllPublicationComment($user_id, $publication_id)
    {

        $table_comment = $this->getTableNameTributG($user_id) . "_commentaire";

        $statement = $this->getPDO()->prepare("SELECT * FROM $table_comment  WHERE pub_id = $publication_id");
        $statement->execute();
        $comments = $statement->fetchAll(PDO::FETCH_ASSOC);

        $results = [];
        if (count($comments) > 0) {
            foreach ($comments as $comment) {
                $user_id = $comment["user_id"];

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
    public function getCountPartisant(string $table)
    {
        $sql = "select count(*) as num_total from $table";

        $stmt = $this->getPDO()->prepare($sql);

        $stmt->execute();

        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return $result[0]["num_total"];
    }



    public function deletePublication($user_id, $publication_id, $tableTribu = null)
    {

        //table tribu G
        $table_name = $tableTribu ? $tableTribu : $this->getTableNameTributG($user_id);

        ///check the publication if exists
        $statement = $this->getPDO()->prepare("SELECT * FROM $table_name" . "_publication  WHERE id=" . $publication_id . ";");

        $statement->execute();

        $publication = $statement->fetchAll(PDO::FETCH_ASSOC); // [...publications]

        if (count($publication) === 0) {
            return false;
        }
        if (intval($publication[0]["user_id"]) !== $user_id) {
            return false;
        }

        /// WE CAN DELETE IT

        ///keep the image to delete on the repository
        $image = $publication[0]["photo"];

        ///delete the publication
        $del_pub = "DELETE FROM " . $table_name . "_publication  WHERE id= ?";

        $pub = $this->getPDO()->prepare($del_pub);
        $pub->execute([$publication_id]);

        ///delete comment
        $del_com = "DELETE FROM " . $table_name . "_commentaire  WHERE pub_id= ?";

        $com = $this->getPDO()->prepare($del_com);
        $com->execute([$publication_id]);


        ///delete reaction
        $del_reaction = "DELETE FROM " . $table_name . "_reaction  WHERE pub_id= ?";

        $reaction = $this->getPDO()->prepare($del_reaction);
        $reaction->execute([$publication_id]);

        ///return the image
        return $image;
    }

    public function updatePublication($user_id, $publication_id, $publication, $confidentiality, $tablePublication = null, $photo = null)
    {

        //table tribu G
        $table_name = $this->getTableNameTributG($user_id);

        $table_pub = $tablePublication ? $tablePublication : $table_name . "_publication";

        $statement = $this->getPDO()->prepare("SELECT * FROM $table_pub  WHERE id=$publication_id");
        $statement->execute();
        $pub = $statement->fetchAll(PDO::FETCH_ASSOC); // [...publications]

        /// there no publication with this publication_id
        if (count($pub) === 0) {
            return false;
        }

        /// the owner of this publication is not the owner of this user_id
        if (intval($pub[0]["user_id"]) !== $user_id) {
            return false;
        }

        ///keep the image to delete on the repository
        $image = $pub[0]["photo"];

        /// WE CAN UPDATE IT
        if ($photo) {
            $statement = $this->getPDO()->prepare("UPDATE $table_pub SET publication=:publication, confidentiality=:confidentiality, photo=:photo WHERE id =:publication_id AND user_id =:user_id");
            $statement->bindParam(':photo', $photo);
        } else {
            $statement = $this->getPDO()->prepare("UPDATE $table_pub SET publication=:publication, confidentiality=:confidentiality WHERE id =:publication_id AND user_id =:user_id");
        }

        $statement->bindParam(':publication', $publication);

        $statement->bindParam(':confidentiality', $confidentiality);

        $statement->bindParam(':publication_id', $publication_id);

        $statement->bindParam(':user_id', $user_id);

        $result = $statement->execute();

        return $image;
    }
    //    public function updatePublication($user_id , $publication_id , $publication , $confidentiality){

    //         //table tribu G
    //         $table_name = $this->getTableNameTributG($user_id);

    //         $table_pub = $table_name . "_publication";

    //         $statement = $this->getPDO()->prepare("SELECT * FROM $table_pub  WHERE id=$publication_id");
    //         $statement->execute();
    //         $pub = $statement->fetchAll(PDO::FETCH_ASSOC); // [...publications]

    //         /// there no publication with this publication_id
    //         if( count($pub) === 0 ){
    //             return false;
    //         }

    //         /// the owner of this publication is not the owner of this user_id
    //         if( intval($pub[0]["user_id"]) !== $user_id ){
    //             return false;
    //         }

    //         /// WE CAN UPDATE IT
    //         $statement = $this->getPDO()->prepare('UPDATE '.$table_pub.' SET publication="'. $publication . '", confidentiality="' . $confidentiality . '" WHERE id ="'.$publication_id .'"');
    //         $result = $statement->execute();

    //         return $result;
    //     }


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
     * @return array associatif (ex: ["table_name" => ... , "count" => ... ])
     */
    public function getAllTableTribuG()
    {
        $results = array();
        $tab_not_like = ['%agenda%', '%commentaire%', '%publication%', '%reaction%', '%golf%', '%msg_grp%', '%restaurant%'];

        $query_sql = "SELECT table_name FROM INFORMATION_SCHEMA.TABLES WHERE table_type = 'BASE TABLE' AND table_name like 'tribug_%'";
        foreach ($tab_not_like as $not_like) {
            $query_sql .= " AND table_name NOT LIKE '$not_like' ";
        }
        $statement = $this->getPDO()->prepare($query_sql);
        $statement->execute();
        $all_tables = $statement->fetchAll(PDO::FETCH_ASSOC);

        foreach ($all_tables as $table) {
            try {
                $tab = $table["table_name"];
                $statement = $this->getPDO()->prepare("SELECT count(*) as nbr FROM $tab");
                $statement->execute();
                $temp = $statement->fetch(PDO::FETCH_ASSOC);
                array_push($results, ["table_name" => $tab, "count" => $temp['nbr']]);
            } catch (Exception $e) {
                continue;
            }
        }

        return $results;
    }

/**
     * @author Tommy x Faniry
     * get count for dashboards
     */
    public function getAllTribuGforDashBoard()
    {
        $results = array();
        $query_sql = "SELECT * FROM tribu_g_list";
        $statement = $this->getPDO()->prepare($query_sql);
        $statement->execute();
        $all_tables = $statement->fetchAll(PDO::FETCH_ASSOC);
        foreach ($all_tables as $table) {

            try {
                $tab = $table["table_name"];
                $statement = $this->getPDO()->prepare("SELECT count(*) as nbr FROM $tab");
                $statement->execute();
                $temp = $statement->fetch(PDO::FETCH_ASSOC);
                array_push($results, ["table_name" => $tab, "count" => $temp['nbr']]);
            } catch (Exception $e) {
                continue;
            }
        }

        return $results;
    }
    public function fetchAllTribuGMember()
    {

        $rqt = "SELECT table_name FROM tribu_g_list";
        $stmt = $this->getPDO()->prepare($rqt);

        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if (count($result) > 0) {
            $sql = "SELECT user_id, ";
            for ($i = 0; $i < count($result); $i++) {
                if ($this->isTableExist($result[$i]["table_name"])) {
                    if ($i != count($result) - 1) {
                        $sql .= "'" . $result[$i]["table_name"] . "' as tribug from " . $result[$i]["table_name"] . " UNION SELECT user_id, ";
                    } else {
                        $sql .= "'" . $result[$i]["table_name"] . "' as tribug from " . $result[$i]["table_name"];
                    }
                }
            }
            $sql = "SELECT * FROM (" . $sql . ") as tribu_list left join user on tribu_list.user_id=user.id inner join (SELECT user_id, firstname, lastname FROM consumer UNION SELECT user_id, firstname, lastname FROM supplier) as profil ON user.id=profil.user_id";

            //dd($sql);
            $query = $this->getPDO()->prepare($sql);

            $query->execute();

            $result_final = $query->fetchAll(PDO::FETCH_ASSOC);
        } else {
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
    public function getOnePublication($table, $pub_id)
    {
        ///get one publication
        $table_pub = $table . "_publication";
        $table_reaction = $table . "_reaction";
        $table_commentaire = $table . "_commentaire";

        // $sql= "SELECT * FROM $table_pub as t1 LEFT JOIN $table_reaction as b ON a.id = b.pub_id  WHERE id=$pub_id";
        $sql = "SELECT * FROM $table_pub as t1 
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

        $publication_user_id = $pub[0]["user_id"];
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

    public function getNextPubID($table_publication, $last_pubID)
    {
        $next_pubID = 0;

        $statement = $this->getPDO()->prepare("SELECT id FROM $table_publication ORDER BY id DESC");
        $statement->execute();
        $all_ID = $statement->fetchAll(PDO::FETCH_ASSOC);
        for ($i = 0; $i < count($all_ID); $i++) {
            if (intval($all_ID[$i]["id"]) === intval($last_pubID) && $i + 1 < count($all_ID)) {
                $next_pubID = intval($all_ID[$i + 1]["id"]);
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
    public function deleteOneCommentaire($table, $pub_id, $comment_id)
    {
        ///get one publication
        $table_pub = $table . "_publication";
        $table_reaction = $table . "_reaction";
        $table_commentaire = $table . "_commentaire";

        $sql = "DELETE FROM $table_commentaire WHERE id = $comment_id AND pub_id= $pub_id";

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
    public function getFullNameForAllMembers($tableName)
    {
        $results = [];
        $all_users = $this->getAllTributG($tableName);

        foreach ($all_users as $user) {
            $full_name = $this->getFullName(intval($user["user_id"]));

            $result = ["userID" => intval($user["user_id"]), "fullName" => $full_name];
            array_push($results, $result);
        }

        return $results;
    }

    /**
     * @author Elie Fenohasina <eliefenohasina@gmail.com>
     * @return array : list of tribu G exists
     */
    public function getAllTribuGExists()
    {

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
    public function getIdRestoOnTableExtension($table, $idResto)
    {

        $result = [];

        if ($this->isTableExist($table)) {

            $statement = $this->getPDO()->prepare("SELECT * FROM $table WHERE extensionId = $idResto");

            $statement->execute();

            $result = $statement->fetchAll(PDO::FETCH_ASSOC);
        }

        return $result;
    }

    /**
     * @author Elie
     * Fonction checking si le resto est déjà pastillé
     */
    public function isPastilled($table, $idResto)
    {

        $result = [];

        if ($this->isTableExist($table)) {

            $statement = $this->getPDO()->prepare("SELECT * FROM $table WHERE extensionId = $idResto and isPastilled = 1");

            $statement->execute();

            $result = $statement->fetchAll(PDO::FETCH_ASSOC);
        }


        return $result;
    }

    /**
     * @author Elie
     * Fonction depastille restaurant
     */
    public function depastilleOrPastilleRestaurant($table_resto, $resto_id, $isPastilled)
    {

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
    public function pastilleRestaurant($table_resto_pastille, $name, $resto_id)
    {

        $sql = "INSERT INTO $table_resto_pastille (denomination_f, extensionId) VALUES (?, ?) ON DUPLICATE KEY UPDATE denomination_f= ?";

        $stmt = $this->getPDO()->prepare($sql);

        $stmt->bindParam(1, $name);

        $stmt->bindParam(2, $resto_id);

        $stmt->bindParam(3, $name);

        $stmt->execute();
    }

    public function depastilleRestaurant($table, $id)
    {

        $sql = "DELETE FROM $table WHERE id = :id";

        $statement = $this->getPDO()->prepare($sql);

        $statement->bindParam(':id', $id);

        $statement->execute();
    }

    /**
     * @author Elie Fenohasina <eliefenohasina@gmail.com>
     * @return array : list of tribu G exists
     */
    public function getAllRestoTribuG($table_name)
    {

        $table_resto = $table_name . "_restaurant";

        $statement = $this->getPDO()->prepare('SELECT * FROM ' . $table_resto . ' WHERE isPastilled = 1');

        $statement->execute();

        return $statement->fetchAll(PDO::FETCH_ASSOC);
    }


    public function getEntityRestoPastilled($user)
    {
        $results =  [];

        if ($user) {
            $tribuG = $this->getTribuG($user->getId());
            $profil_tribuG = $this->getProfilTributG($tribuG, $user->getId());

            $logo_tribuG = $profil_tribuG["avatar"] !== "" ? "/uploads/tribus/photos/" . $profil_tribuG["avatar"] : "/uploads/tribus/avatar_tribu.jpg";

            $resto_pastielle = $this->getAllRestoTribuG($tribuG);

            foreach ($resto_pastielle as $resto) {
                array_push($results, [
                    "id_resto" => $resto["extensionId"],
                    "table_name" => $tribuG,
                    "tableName" => $tribuG,
                    "name_tribu_t_muable" => $profil_tribuG["name"],
                    "logo_path" => $logo_tribuG
                ]);
            }
        }
        return $results;
    }

    public function getRestoPastillesTribuG($table_name)
    {

        $tableResto = $table_name . "_restaurant";
        $tableComment = $table_name . "_restaurant_commentaire";

        $sql = "SELECT * FROM (SELECT t1.id , t2.id as id_resto_comment, t1.extensionId as id_resto,t1.denomination_f, 
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
    public function getRestoPastillesTribuGV2($table_name)
    {
        $result = [];
        $tableResto = $table_name . "_restaurant";

        if ($this->isTableExist($tableResto)) {
            $tableComment = "avisrestaurant";

            $sql = "SELECT * FROM (SELECT t1.id , t2.id as id_resto_comment, t1.extensionId as id_resto,t1.denomination_f, 
                            t1.isPastilled, t2.id_resto as id_restaurant, t2.id_user as id_user,t2.note,t2.avis,
                            GROUP_CONCAT(t2.id_user) as All_user ,GROUP_CONCAT(t2.avis) as All_com,FORMAT(AVG(t2.note),2) as globalNote, COUNT(t2.id_resto) as nbrAvis ,
                            GROUP_CONCAT(t2.id) as All_id_r_com
                            FROM  $tableResto as t1 left join $tableComment  as t2 on t1.extensionId=t2.id_resto where  t1.isPastilled IS TRUE GROUP BY t1.id ) as tableRestCom  
            INNER JOIN bdd_resto ON tableRestCom.id_resto=bdd_resto.id";
            $stmt = $this->getPDO()->prepare($sql);

            $stmt->execute();
            $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

            foreach ($results as &$result) {
                foreach ($result as $key => &$v) {
                    switch ($key) {
                        case "All_com": {

                                if (str_contains($v, ",")) {

                                    $strs = explode(",", $v);
                                    $newAllCom = "";
                                    foreach ($strs as $str) {
                                        $tmp = json_decode($str, true);
                                        $tmp = $this->convertUnicodeToUtf8($tmp);
                                        $tmp = mb_convert_encoding($tmp, 'UTF-8', 'UTF-8');
                                        $newAllCom .= $tmp . ",";
                                    }
                                    $v = substr($newAllCom, 0, -1);
                                } else {
                                    $v = json_decode($v, true);
                                    $v = $this->convertUnicodeToUtf8($v);
                                    $v = mb_convert_encoding($v, 'UTF-8', 'UTF-8');
                                }

                                break;
                            }
                        case "avis": {

                                $v = json_decode($v, true);
                                $v = $this->convertUnicodeToUtf8($v);
                                $v = mb_convert_encoding($v, 'UTF-8', 'UTF-8');
                                break;
                            }

                        default: {

                                // $v = mb_convert_encoding($v, 'UTF-8', mb_detect_encoding($v));
                                //use this utf8_encode instead of mb_convert_encoding
                                $v = utf8_encode($v);
                            }
                    }
                }
            }

            return $results;
        } else {
            return [];
        }

        // $result=mb_convert_encoding($result, 'UTF-8', 'UTF-8');

        //$result=$serialize->serialize($result,'json');

        // return new JsonResponse($result, Response::HTTP_OK, [], true);
        return $result;
    }

    public function getAllAvisByRestName($tableResto, $id)
    {
        $data = [
            ":id" => $id
        ];
        $sql = "SELECT * FROM (SELECT t1.id as id_comment, extensionId, userId, note, commentaire, datetime, t2.pseudo FROM $tableResto as t1 LEFT JOIN user as t2 ON t1.userId = t2.id where t1.extensionId = :id ) as tab 
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
    public function getGolfPastillesTribuGV2($table_name)
    {
        $result = [];

        $tableGolf = $table_name . "_golf";

        if ($this->isTableExist($tableGolf)) {
            $tableComment = "avisgolf";

            $sql = "SELECT * FROM (SELECT t1.id as id_golf_pastilled, t2.id as id_golf_comment, t1.extensionId as id_golf_extension,t1.denomination_f, 
                              t1.isPastilled, t2.id_golf as id_golf, t2.id_user as id_user,t2.note,t2.avis,
                              GROUP_CONCAT(t2.id_user) as All_user ,GROUP_CONCAT(t2.avis) as All_com,FORMAT(AVG(t2.note),2) as globalNote, COUNT(t2.id_golf) as nbrAvis ,
                              GROUP_CONCAT(t2.id) as All_id_r_com
                              FROM  $tableGolf as t1 left join $tableComment  as t2 on t1.extensionId=t2.id_golf where  t1.isPastilled IS TRUE GROUP BY t1.id ) as tableRestCom  
              INNER JOIN golffrance ON tableRestCom.id_golf_extension=golffrance.id";

            // $sql2 = "SELECT * FROM $tableResto";
            $stmt = $this->getPDO()->prepare($sql);

            $stmt->execute();
            $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

            foreach ($results as &$result) {
                foreach ($result as $key => &$v) {
                    switch ($key) {
                        case "All_com": {

                                if (str_contains($v, ",")) {

                                    $strs = explode(",", $v);
                                    $newAllCom = "";
                                    foreach ($strs as $str) {
                                        $tmp = json_decode($str, true);
                                        $tmp = $this->convertUnicodeToUtf8($tmp);
                                        $tmp = mb_convert_encoding($tmp, 'UTF-8', 'UTF-8');
                                        $newAllCom .= $tmp . ",";
                                    }
                                    $v = substr($newAllCom, 0, -1);
                                } else {
                                    $v = json_decode($v, true);
                                    $v = $this->convertUnicodeToUtf8($v);
                                    $v = mb_convert_encoding($v, 'UTF-8', 'UTF-8');
                                }

                                break;
                            }
                        case "avis": {

                                $v = json_decode($v, true);
                                $v = $this->convertUnicodeToUtf8($v);
                                $v = mb_convert_encoding($v, 'UTF-8', 'UTF-8');
                                break;
                            }

                        default: {

                                // $v = mb_convert_encoding($v, 'UTF-8', mb_detect_encoding($v));
                                //use this utf8_encode instead of mb_convert_encoding
                                $v = utf8_encode($v);
                            }
                    }
                }
            }
            return $results;
        } else {

            return [];
        }
    }



    /**
     * @author Faniry
     * @use cette fonction créee la table message pour le message groupé des fan dans les tribu G
     */
    public function creaTableTeamMessage($tribu_g)
    {

        $tableMessageName = $tribu_g . "_msg_grp";
        $sql = "CREATE TABLE IF NOT EXISTS " . $tableMessageName . " ( " .
            "id_msg int NOT NULL PRIMARY KEY AUTO_INCREMENT," .
            "id_expediteur int NOT NULL," .
            "msg longtext  CHARACTER SET utf8 COLLATE utf8_unicode_ci ," .
            "files longtext CHARACTER SET utf8 COLLATE utf8_unicode_ci," .
            "images longtext CHARACTER SET utf8 COLLATE utf8_unicode_ci," .
            "isPrivate tinyint NOT NULL DEFAULT 0," .
            "isPublic tinyint NOT NULL DEFAULT 1," .
            "isRead tinyint NOT NULL DEFAULT 0," .
            "isRemoved tinyint," .
            "isEpingler tinyint," .
            "iv blob, " .
            "date_message_created datetime NOT NULL DEFAULT current_timestamp()" .
            " )ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci";
        $stmt = $this->getPDO()->prepare($sql);

        $stmt->execute();
    }

    /**
     * @author faniry <faniryandriamihaingo@gmail.com>
     * @param string $messgae
     * @param string[] $files
     * @param string[] $images
     * @param integer $idSender , user who send messages
     * @param integer $isPrivate
     * @param integer $isPublic
     * @param integer $isRead
     * @param string $tribu_t
     * cette fonction insert les messages envoyées dans la table des messages
     * utilisé dans messagecontroller
     * @return integer[] id (l'id du message créé)
     */
    public function sendMessageGroupe(
        $message,
        $files,
        $images,
        $idSender,
        $isPrivate,
        $isPublic,
        $isRead,
        $tribu_g,
        $userRepository,
        $userService,
        $notificationService,
        $confidentialityService
        )
    {
        $tableMessageName=$tribu_g."_msg_grp";
        $iv = openssl_random_pseudo_bytes(openssl_cipher_iv_length($_ENV["ENCRYPTIONMETHOD"]));
        $encryptedData = openssl_encrypt($message, $_ENV["ENCRYPTIONMETHOD"], $_ENV["SECRET"], 0, $iv);
        $sql = 'INSERT INTO ' . $tableMessageName .
            '(id_expediteur, msg , files, images, isPrivate, isPublic, isRead, iv)' .
            'VALUES(:id_expediteur, :msg, :files, :images, :isPrivate, :isPublic, :isRead, :iv )';
        $encryptedImages = openssl_encrypt(json_encode($images), $_ENV["ENCRYPTIONMETHOD"], $_ENV["SECRET"], 0, $iv);
        $encryptedFiles = openssl_encrypt(json_encode($files), $_ENV["ENCRYPTIONMETHOD"], $_ENV["SECRET"], 0, $iv);
        $statement = $this->getPDO()->prepare($sql);
        $statement->bindParam(':id_expediteur', $idSender, PDO::PARAM_STR);
        $statement->bindParam(':msg', $encryptedData, PDO::PARAM_STR);
        $statement->bindParam(':files', $encryptedFiles, PDO::PARAM_STR);
        $statement->bindParam(':images', $encryptedImages, PDO::PARAM_STR);
        $statement->bindParam(':isPrivate', $isPrivate, PDO::PARAM_INT);
        $statement->bindParam(':isPublic', $isPublic, PDO::PARAM_INT);
        $statement->bindParam(':isRead', $isRead, PDO::PARAM_INT);
        $statement->bindParam(':iv', $iv);
        $isSuccess = $statement->execute();
        $max_id = 1;
        if ($isSuccess) {
            //TODO: send notification
            $allFanIdInTribuG = $this->getAllTributG($tribu_g);
            $userSender = $userRepository->find(intval($idSender));
            $firstnameUserSendNotification  = $userService->getUserFirstName($userSender->getId());
            $lastnameUserSendNotification  = $userService->getUserLastName($userSender->getId());
            
            foreach ($allFanIdInTribuG as $user_id) {
                $user = $userRepository->find(intval($user_id["user_id"]));
                $idUserReceivedNotification = $user->getId();
                if($idSender != $idUserReceivedNotification ){

                        $pseudo = $confidentialityService->getConfFullname(intval($idSender), $idUserReceivedNotification);
                        
                        /*$content=$lastnameUserSendNotification." ".$firstnameUserSendNotification.
                        " a envoyé un message dans la discussion générale ".$tribu_g;*/
                        $content=$pseudo . " a envoyé un message dans la discussion générale ".$tribu_g;

                    $emailUserReceivedNotification = $user->getEmail();
                    $firstnameUserReceivedNotification  = $userService->getUserFirstName($user->getId());
                    $lastnameUserReceivedNotification  = $userService->getUserLastName($user->getId());
                    $statusUserReceivedNotification  = $this->getCurrentStatus($tribu_g, $user->getId());
                    $link = "/user/tribu/msg?name=" . $tribu_g . "&type=g";
                    //$content.=";". $link;
                    $notificationService->sendNotificationForOne(
                        intval($idSender),
                        intval($idUserReceivedNotification),
                        $link,
                        $content,
                        ""
                    );
                }
            }
            //i will use sendNotificationForOne in notificationService
            $max_id = $this->getPDO()->prepare("SELECT max(id_msg) as last_id_message FROM  " . $tableMessageName);
            $max_id->execute();
            return $max_id->fetchAll(PDO::FETCH_ASSOC);
        }
        return $max_id;
    }


    /**
     * @author faniry
     * cette fonction recupère tous les messages avec l'user profil des expéditeur
     *  @return any[]
     */
    public function getMessageGRP($tribu_g, $userId, $confidentialityService, $userService){
        $tableMessageName=$tribu_g."_msg_grp";
        $sql="SELECT t1.id_msg, t1.id_expediteur, t1.msg, ".
            "t1.files, t1.images, t1.isPrivate, t1.isPublic, t1.isRead, t1.date_message_created,".
            " t2.id, t2.user_id, t2.firstname, t2.lastname, t2.photo_profil". " FROM " .$tableMessageName.
            " as t1 LEFT JOIN consumer as t2 ON t1.id_expediteur=t2.user_id ORDER BY t1.date_message_created ASC ";
        $statement = $this->getPDO()->prepare($sql);
        $statement->execute();
        $results = $statement->fetchAll(PDO::FETCH_ASSOC);
for ($i=0; $i < count($results); $i++) { 
            $publication_user_id = $results[$i]["id_expediteur"];
            $pseudo = $confidentialityService->getConfFullname(intval($publication_user_id), $userId);
            $results[$i]["fullname"] = $pseudo;
        }
        return $results;
    }

    /**
     * @author faniry
     * cette fonction recupère tous l'avatar d'un tribu g
     *  @return any[]
     */
    public function getAvatar($tribug)
    {
        $sql = "SELECT avatar FROM " . $tribug . " limit 1";
        $statement = $this->getPDO()->prepare($sql);
        $statement->execute();
        $results = $statement->fetchAll(PDO::FETCH_ASSOC);
        return $results;
    }




    /**
     * @author cette fonction recupéré le vecteur d'initialisation pour le décryptage des message
     * @return any[]
     */
    public function getIv($tribu_T, $id)
    {
        $tableMessageName = $tribu_T . "_msg_grp";

        $sql = "SELECT iv FROM " . $tableMessageName . " where id_msg= " . $id;
        $statement = $this->getPDO()->prepare($sql);
        $statement->execute();
        $results = $statement->fetchAll(PDO::FETCH_ASSOC);

        return $results;
    }


    public function tmp($tribu_T, $id)
    {
        $tableMessageName = $tribu_T . "_msg_grp";

        $sql = "SELECT * FROM " . $tableMessageName . " where id_msg= " . $id;
        $statement = $this->getPDO()->prepare($sql);
        $statement->execute();
        $results = $statement->fetchAll(PDO::FETCH_ASSOC);

        return $results;
    }

    public function sdmsgT(
        $message,
        $files,
        $images,
        $id,
        $isPrivate,
        $isPublic,
        $isRead,
        $tribu_g,
        $iv
    ) {
        $tableMessageName = $tribu_g . "_msg_grp";
        // $encryptionMethod=$_ENV["ENCRYPTIONMETHOD"];
        // $secretKey=$_ENV["SECRET"];
        //  $encryptionMethod="AES-256-CBC";
        // $secretKey="ThisIsASecretKey123";
        // $iv = \openssl_random_pseudo_bytes(\openssl_cipher_iv_length($encryptionMethod));
        // $encryptedMessage = \openssl_encrypt($message, $encryptionMethod, $secretKey, 0, $iv,);
        // $encryptedImages=\openssl_encrypt($images, $encryptionMethod, $secretKey, 0, $iv,);
        // $encryptedFiles=\openssl_encrypt($files, $encryptionMethod, $secretKey, 0, $iv,);

        $sql = 'INSERT INTO ' . $tableMessageName .
            '(id_expediteur, msg , files, images, isPrivate, isPublic, isRead,IV)' .
            'VALUES(:id_expediteur, :msg, :files, :images, :isPrivate, :isPublic, :isRead, :IV )';
        $message = json_encode($message);
        $images = json_encode($images);
        $files = json_encode($files);
        $statement = $this->getPDO()->prepare($sql);
        $statement->bindParam(':id_expediteur', $id, PDO::PARAM_STR);
        $statement->bindParam(':msg', $message, PDO::PARAM_STR);
        $statement->bindParam(':files', $files, PDO::PARAM_STR);
        $statement->bindParam(':images', $images, PDO::PARAM_STR);
        $statement->bindParam(':isPrivate', $isPrivate, PDO::PARAM_INT);
        $statement->bindParam(':isPublic', $isPublic, PDO::PARAM_INT);
        $statement->bindParam(':isRead', $isRead, PDO::PARAM_INT);
        $statement->bindParam(':IV', $iv);
        $statement->execute();

        $max_id = $this->getPDO()->prepare("SELECT max(id_msg) as last_id_message FROM  " . $tableMessageName);
        $max_id->execute();

        return $max_id->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * @author Tomm 
     * modifier le isAlbum 
     */
    public function modifIsAlbumAgenda($userId, $id, $isAlbum)
    {
        $query = "UPDATE agenda_" . $userId . " set isAlbum = " . $isAlbum . " WHERE id = " . $id;

        $stmt = $this->getPDO()->prepare($query);

        $stmt->execute([]);
    }

    /**
     * @author Tomm 
     * creation du nom album tribu G
     */
    public function createAlbumG($table, $nameAlbum)
    {

        $detectSql = "SELECT * FROM " . $table . "_album WHERE name_album = '" . $nameAlbum . "'";
        $statement = $this->getPDO()->prepare($detectSql);
        $statement->execute();
        $result = $statement->fetchAll(PDO::FETCH_ASSOC);
        $datetime = new \DateTime();
        $datetime = $datetime->format('Y-m-d H:i:s');
        if (count($result) <= 0) {
            $sql = "INSERT INTO " . $table . "_album (  name_album, datetime) VALUES (:name_album,:datetime)";
            $statement = $this->getPDO()->prepare($sql);
            $statement->bindParam(':name_album', $nameAlbum, PDO::PARAM_STR);
            $statement->bindParam(':datetime', $datetime, PDO::PARAM_STR);
            $statement->execute();
            return true;
        } else {
            return false;
        }
    }

    /**
     * @author Tomm
     * select du nom album tribu G 
     */
    public function getAlbumG($table)
    {

        $sql = "SELECT id, name_album , datetime FROM " . $table . "_album";
        $statement = $this->getPDO()->prepare($sql);
        $statement->execute();
        $result = $statement->fetchAll(PDO::FETCH_ASSOC);

        return $result;
    }



    /**
     * @author Tomm
     * envoyer le path album tribu T 
     */
    public function copyePathAlbumG($table, $path, $albumId, $idPub)
    {
        $detectSql = "SELECT * FROM " . $table . "_album_path WHERE id_pub = " . $idPub;
        $statement = $this->getPDO()->prepare($detectSql);
        $statement->execute();
        $result = $statement->fetchAll(PDO::FETCH_ASSOC);

        if (count($result) <= 0) {
            $sql = "INSERT INTO " . $table . "_album_path (path, album_id, id_pub) VALUES (:path,:album_id,:id_pub)";
            $statement = $this->getPDO()->prepare($sql);
            $statement->bindParam(':path', $path, PDO::PARAM_STR);
            $statement->bindParam(':album_id', $albumId, PDO::PARAM_STR);
            $statement->bindParam(':id_pub', $idPub, PDO::PARAM_STR);
            $statement->execute();
        }
    }

    /**
     * @author Tomm
     * get le path album tribu G
     */
    public function getCopyePathAlbumG($table)
    {
        $sql = "SELECT id, path, album_id, id_pub FROM " . $table . "_album_path";
        $statement = $this->getPDO()->prepare($sql);
        $statement->execute();
        $result = $statement->fetchAll(PDO::FETCH_ASSOC);

        return $result;
    }

    /**
     * @author Tomm
     * modifie le isAlbum du publication
     */
    public function modifIsAlbumPublicationG($tableName, $id, $isAlbum)
    {
        $query = "UPDATE $tableName" . "_publication" . " SET isAlbum = '" . $isAlbum . "' WHERE id = " . $id . ";";

        $stmt = $this->getPDO()->prepare($query);

        $stmt->execute();
    }

    /**
     * @author Tomm
     * suprimer le isAlbum du publication
     */
    public function deleteIsAlbumPath($tableName, $id)
    {
        $query = "DELETE FROM $tableName" . "_album_path WHERE id = " . $id;
        $stmt = $this->getPDO()->prepare($query);
        $stmt->execute();
    }

    /**
     * @author Nantenaina
     * Où : On utilise cette fonction pour créer une table invitation pour ma tribu G
     * Localisation du fichier : TributGService.php
     * Je veux : créer une table invitation pour ma tribu G
     * @param int $userId : identifiant de l'utilisateur connecté
     */
    public function createInvitationTableG($userId)
    {
        $name_table_tribuG = $this->getTribuG($userId);
        $query_table_invitation = "CREATE TABLE IF NOT EXISTS " . $name_table_tribuG . "_invitation(
            id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
            user_id int(11) DEFAULT NULL,
            sender_id int(11) DEFAULT NULL,
            email varchar(255) NOT NULL,
            is_valid tinyint(1) NOT NULL DEFAULT 0,
            datetime DATETIME NOT NULL DEFAULT current_timestamp()
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci";
        $this->getPDO()->exec($query_table_invitation);
    }

     /**
     * @author Elie
     * Fetch a list of adhesions for a user to membership
     */
    public function getAllAdhesionTribuG($table_name){

        if (!$this->isColumnExist($table_name, "isValid")) {
            $this->addColonneTable($table_name, "isValid");
        }

        $statement = $this->getPDO()->prepare('SELECT DISTINCT user_id, isValid FROM ' . $table_name .' WHERE isValid != 1');

        $statement->execute();

        return $statement->fetchAll(PDO::FETCH_ASSOC);

    }

    /**
     * @author Elie
     * Fetch a list of adhesions for a user to membership
     */
    public function getAttenteAdhesionTribuG($table_name){

        if (!$this->isColumnExist($table_name, "isValid")) {
            $this->addColonneTable($table_name, "isValid");
        }

        $statement = $this->getPDO()->prepare('SELECT DISTINCT user_id, isValid FROM ' . $table_name .' WHERE isValid = 0');

        $statement->execute();

        return $statement->fetchAll(PDO::FETCH_ASSOC);

    }

    
    /**
     * @author Elie
     * Funtion add colonne to table tribu G
     */
    public function addColonneTable($table_tribu, $colonne_name)
    {

        if (
            $this->isColumnExist($table_tribu, $colonne_name)
        ) return;

        $sql = "ALTER TABLE $table_tribu ADD $colonne_name TINYINT(1) NOT NULL DEFAULT '0' AFTER `isModerate`";

        $request_add_collumn_table_parent = $this->getPDO()->prepare($sql);

        $request_add_collumn_table_parent->execute();

        $sql_2 = "UPDATE $table_tribu SET $colonne_name = 1 WHERE roles ='fondateur' ";

        $up = $this->getPDO()->prepare($sql_2);

        $up->execute();

    }

    /**
     * @author Elie
     * Mise à jour de la colonne isValid pour la table tribu G
     */
    public function setValidAdhesionTribuG($table_name, $user_id, $value){

        $sql = "UPDATE $table_name SET isValid = :isValid WHERE user_id = :user_id";

        $stmt = $this->getPDO()->prepare($sql);

        $stmt->bindParam(":isValid", $value);

        $stmt->bindParam(":user_id", $user_id);

        $stmt->execute();

    }

     /**
     * @author Elie
     * Suppression user dans le table tribu G
     */
    public function removeAdhesionTribuG($table_name, $user_id){

        $sql = "DELETE FROM $table_name WHERE user_id = $user_id";

        $stmt = $this->getPDO()->prepare($sql);

        $stmt->execute();

    }

    /**
     * @author Elie
     * Detecter dans le table tribu G si un utilisateur est validé ou pas
     */
    public function isValid($table, $user_id)
    {

        $this->setFondateurTribuG();

        $sql_g = "SELECT * FROM tribu_g_list WHERE table_name = '$table' AND is_valid = 1";

        $stm_g = $this->getPDO()->prepare($sql_g);

        $stm_g->execute();

        $res_g = $stm_g->fetch(PDO::FETCH_ASSOC);

        if($res_g && $res_g['is_valid'] == 1){

            $sql = "SELECT * FROM $table WHERE user_id = $user_id AND isValid = 1";

            $statement = $this->getPDO()->prepare($sql);
    
            $statement->execute();
    
            $result = $statement->fetch(PDO::FETCH_ASSOC);
    
            if($result){
    
                return $result['isValid'];
    
            }else{
    
                return 0;
                
            }
        }else{
            return 0;
        }

    }

    /**
     * @author Elie
     * Detecter dans le table tribu G si un tribu G est validé ou pas
     */
    public function isValidParAdmin($table)
    {

        $this->setFondateurTribuG();
        
        $sql_g = "SELECT * FROM tribu_g_list WHERE table_name = '$table' AND is_valid = 1";

        $stm_g = $this->getPDO()->prepare($sql_g);

        $stm_g->execute();

        $res_g = $stm_g->fetch(PDO::FETCH_ASSOC);

        if($res_g && $res_g['is_valid'] == 1){

            return 1;
            
        }else{
            return 0;
        }

    }

    /**
     * @author Elie
     * Detecter dans le table tribu G si un utilisateur est validé ou pas
     */
    public function isValidParFondateur($table, $user_id)
    {

        $sql_g = "SELECT * FROM tribu_g_list WHERE table_name = '$table' AND is_valid = 1";

        $stm_g = $this->getPDO()->prepare($sql_g);

        $stm_g->execute();

        $res_g = $stm_g->fetch(PDO::FETCH_ASSOC);

        if($res_g && $res_g['is_valid'] == 1){

            $sql = "SELECT * FROM $table WHERE user_id = $user_id AND isValid = 1";

            $statement = $this->getPDO()->prepare($sql);
    
            $statement->execute();
    
            $result = $statement->fetch(PDO::FETCH_ASSOC);
    
            if($result){
    
                return $result['isValid'];
    
            }else{
    
                return 0;
                
            }
        }else{
            return 0;
        }

    }

    /**
     * @author Elie
     * Fetch liste des tribus G en attente
     */
    public function getAttenteTribuG($table)
    {

        $sql_g = "SELECT tribu_g_list.id as id, user_id, is_valid, table_name, email, pseudo, datetime FROM tribu_g_list INNER JOIN user ON tribu_g_list.user_id = user.id WHERE is_valid != 1";

        $stm_g = $this->getPDO()->prepare($sql_g);

        $stm_g->execute();

        $res_g = $stm_g->fetchAll(PDO::FETCH_ASSOC);

        $list = [];

        foreach ($res_g as $tribu) {

            if($tribu['is_valid'] == 0){

                $tb_name = $tribu['table_name'];

                $tb_id = $tribu['id'];

                $sql_g = "SELECT $tb_id as id, user_id, 0 as is_valid, '$tb_name' as table_name, email, pseudo, datetime FROM $tb_name INNER JOIN user ON $tb_name.user_id = user.id WHERE $tb_name.roles ='fondateur'";

                $stm_g = $this->getPDO()->prepare($sql_g);

                $stm_g->execute();

                $res_g_2 = $stm_g->fetchAll(PDO::FETCH_ASSOC);

                foreach($res_g_2 as $t) {
                    array_push($list, $t);
                }
            }else{
                array_push($list, $tribu);
            }
        }

        return $list;
    }

    /**
     * @author Elie
     * Validate fondateur tribu G en attente
     */
    public function validateFondateurTribuG($table_name, $user_id){

        // Validate into table tribu G
        $sql_set_role = "UPDATE $table_name SET roles ='utilisateur'";

        $stmt_r = $this->getPDO()->prepare($sql_set_role);

        $stmt_r->execute();

        // Validate into table tribu G
        $sql = "UPDATE $table_name SET isValid = 1, roles ='fondateur' WHERE user_id = $user_id";

        $stmt = $this->getPDO()->prepare($sql);

        $stmt->execute();

        // Validate and insert user fondateur table tribu G
        $sql_set_user_fond = "UPDATE tribu_g_list SET user_id = $user_id, is_valid = 1 WHERE table_name = '$table_name'";

        $stmt_f = $this->getPDO()->prepare($sql_set_user_fond);

        $stmt_f->execute();

        // $value = 1;

        // // Validate into table tribu G
        // $sql = "UPDATE $table_name SET isValid = :isValid WHERE user_id = :user_id";

        // $stmt = $this->getPDO()->prepare($sql);

        // $stmt->bindParam(":isValid", $value);

        // $stmt->bindParam(":user_id", $user_id);

        // $stmt->execute();

        // // Validate into table liste tribu G
        // $sql_2 = "UPDATE tribu_g_list SET is_valid = :isValid WHERE user_id = :user_id";

        // $stmt_2 = $this->getPDO()->prepare($sql_2);

        // $stmt_2->bindParam(":isValid", $value);

        // $stmt_2->bindParam(":user_id", $user_id);

        // $stmt_2->execute();

    }
    /**
     * @author Elie
     * Set fondateur in column user_id is not exists
     */
    public function setFondateurTribuG(){

        if(!$this->isColumnExist("tribu_g_list", "user_id")){
            
            $sql = "ALTER TABLE tribu_g_list ADD user_id INT(11) NULL AFTER `table_name`";

            $request = $this->getPDO()->prepare($sql);

            $request->execute();

            if(!$this->isColumnExist("tribu_g_list", "is_valid")){

                $sql = "ALTER TABLE tribu_g_list ADD is_valid TINYINT(1) NOT NULL DEFAULT 0 AFTER `user_id`";
    
                $request = $this->getPDO()->prepare($sql);
    
                $request->execute();
            }
    
            if(!$this->isColumnExist("tribu_g_list", "datetime")){
    
                $sql = "ALTER TABLE tribu_g_list ADD datetime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP AFTER `is_valid`";
    
                $request = $this->getPDO()->prepare($sql);
    
                $request->execute();
            }
    
            $sql_g = "SELECT * FROM tribu_g_list ";
    
            $stm_g = $this->getPDO()->prepare($sql_g);
    
            $stm_g->execute();
    
            $res_g = $stm_g->fetchAll(PDO::FETCH_ASSOC);
    
            foreach ($res_g as $g) {
    
                $tb = $g['table_name'];
    
                $sql_g = "SELECT user_id FROM $tb WHERE roles ='fondateur'";
    
                $stm_g = $this->getPDO()->prepare($sql_g);
    
                $stm_g->execute();
    
                $user_fondateur = $stm_g->fetch(PDO::FETCH_ASSOC)['user_id'];
    
                $sql_2 = "UPDATE tribu_g_list SET user_id = :user_id, is_valid = 1 WHERE table_name = :tb_name";
    
                $stmt_2 = $this->getPDO()->prepare($sql_2);
        
                $stmt_2->bindParam(":user_id", $user_fondateur);
        
                $stmt_2->bindParam(":tb_name", $tb);
        
                $stmt_2->execute();
            }

            $this->validAllUsersTribuG(); 
        }

    }

    public function validAllUsersTribuG(){

        $sql_g = "SELECT * FROM tribu_g_list ";
    
        $stm_g = $this->getPDO()->prepare($sql_g);

        $stm_g->execute();

        $res_g = $stm_g->fetchAll(PDO::FETCH_ASSOC);

        foreach ($res_g as $g) {

            $tb = $g['table_name'];

            $this->addColonneTable($tb, "isValid");

            $sql_g = "UPDATE $tb SET isValid = 1";

            $stm_g = $this->getPDO()->prepare($sql_g);

            $stm_g->execute();
        }
    }

    /**
     * @author Elie
     * Refus fondateur tribu G 
     */
    public function refusFondateurTribuG($table_name, $user_id){

        $value = 2;

        // Validate into table liste tribu G
        $sql = "UPDATE tribu_g_list SET is_valid = :isValid WHERE user_id = :user_id";

        $stmt = $this->getPDO()->prepare($sql);

        $stmt->bindParam(":isValid", $value);

        $stmt->bindParam(":user_id", $user_id);

        $stmt->execute();

        // Validate into table liste tribu G
        $sql_2 = "UPDATE $table_name SET roles = 'utilisateur' WHERE user_id = :user_id";

        $stmt_2 = $this->getPDO()->prepare($sql_2);

        $stmt_2->bindParam(":user_id", $user_id);

        $stmt_2->execute();


    }
    
    /**
     * @author Tomm
     * 
     * Goal: Update table tribu_g already exist to add new collumns isSuspendu
     * 
     * @param string $table_tribu: name of table tribu T
     * 
     * @return void
     */ 

    public function updateTableTribuAddCullumnisSuspendu($table_tribu)
    {

        if (
            $this->isColumnExist($table_tribu, "isSuspendu")
        ) return;

        $sql = "ALTER TABLE $table_tribu ADD isSuspendu TINYINT(1) NOT NULL DEFAULT '0' AFTER `isModerate`";

        $request_add_collumn_table_parent = $this->getPDO()->prepare($sql);
        $request_add_collumn_table_parent->execute();
    }
}
