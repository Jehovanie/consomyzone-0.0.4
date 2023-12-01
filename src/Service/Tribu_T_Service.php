<?php



namespace App\Service;

use PDO;
use Exception;
use PDOException;
use ArgumentCountError;
use App\Repository\BddRestoRepository;

class Tribu_T_Service extends PDOConnexionService
{




    /**
     * create data_base table tribu-T
     * 
     */
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

                    publication VARCHAR(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,

                    confidentiality TINYINT(1) NOT NULL,

                    photo VARCHAR(250),

                    userfullname VARCHAR(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'inconnu',

                    datetime timestamp NOT NULL DEFAULT current_timestamp(),

                    FOREIGN KEY(user_id) REFERENCES user(id)

                    ON DELETE CASCADE

                    ON UPDATE CASCADE

                    )ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci";



                $final2 = $this->getPDO()->exec($query);



                if ($final2 == 0) {

                    $query_table_invitation = "CREATE TABLE " . $output . "_invitation(
                        id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
                        user_id int(11) NOT NULL,
                        email varchar(255) NOT NULL,
                        is_valid tinyint(1) NOT NULL DEFAULT 0,
                        datetime DATETIME NOT NULL DEFAULT current_timestamp()
                      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci";

                    $this->getPDO()->exec($query_table_invitation);

                    $sql = "CREATE TABLE " . $output . "_commentaire(

                        id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT, 

                        user_id int(11) NOT NULL,

                        pub_id int(11) NOT NULL,

                        commentaire VARCHAR(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,

                        audioname VARCHAR(250) NULL,

                        userfullname VARCHAR(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'inconnu',

                        datetime timestamp NOT NULL DEFAULT current_timestamp(),

                        FOREIGN KEY(user_id) REFERENCES user(id),

                        FOREIGN KEY(pub_id) REFERENCES " . $output . "_publication(id)

                        ON DELETE CASCADE

                        ON UPDATE CASCADE

                        )ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci";



                    $this->getPDO()->exec($sql);




                    $sql = "CREATE TABLE " . $output . "_reaction(

                        id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT, 

                        user_id int(11) NOT NULL,

                        pub_id int(11) NOT NULL,

                        reaction TINYINT(1) DEFAULT 0,

                        userfullname VARCHAR(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'inconnu',

                        datetime timestamp NOT NULL DEFAULT current_timestamp(),

                        FOREIGN KEY(user_id) REFERENCES user(id),

                        FOREIGN KEY(pub_id) REFERENCES " . $output . "_publication(id)

                        ON DELETE CASCADE

                        ON UPDATE CASCADE

                        )ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci";

                    $this->getPDO()->exec($sql);

                    $sqlCreateTableImpImg = " CREATE TABLE " . $output . "_imp_img(

                        id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,

                        user_id int(11) NOT NULL,

                        path varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,

                        datetime datetime NOT NULL DEFAULT current_timestamp(),

                        FOREIGN KEY (user_id) REFERENCES user (id)

                        ON DELETE CASCADE 

                        ON UPDATE CASCADE

                      ) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci";


                    $this->getPDO()->exec($sqlCreateTableImpImg);

                    
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
                    // $this->getPDO()->exec($sql);


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

    public function confirmMemberTemp($tableName, $user_id, $email)
    {
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

    public function showTribuT($user_id, $option = null)

    {

        $option = ($option === null) ? null : "_" . $option;

        $db = $_ENV["DATABASENAME"];



        $query = "SHOW TABLES FROM $db like '%tribu_t_" . $user_id . "_%" . $option . "'";



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

        $statement = $this->getPDO()->prepare("SELECT user_id, roles FROM $table WHERE status = 1");

        $statement->execute();

        $result = $statement->fetchAll(PDO::FETCH_ASSOC);

        return $result;
    }


    public function getAllIdRestoPastille($table, $isPastilled)
    {

        $statement = $this->getPDO()->prepare("SELECT id_resto, '$table' as 'tableName' FROM $table WHERE isPastilled = $isPastilled");

        $statement->execute();

        $result = $statement->fetchAll(PDO::FETCH_ASSOC);

        return $result;
    }

    public function getIdRestoOnTableExtension($table, $idResto)
    {

        // $statement = $this->getPDO()->prepare("SELECT * FROM $table WHERE extensionId = $idResto");
        $statement = $this->getPDO()->prepare("SELECT * FROM $table WHERE id_resto = $idResto");

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



    /**
     * @author tommyramihoatrarivo@gmail.com <email>
     * createjson for tribu-t
     * @param string $tribu_T_name_table it's can't be change. This value is the name of table in CMZ data base
     * @param string $description it's can be change. This is the description of the tribu T
     * @param string $path  it's can be change. This is the logo path of the tribu T
     * @param array $extension it's can be change. This is the extension we can associate with the tribu T
     * @param string $tribu_t_owned_or_join it's can't be change. The tribu T owned and joined
     * @param string $nomTribuT it's can be change. The name of the tribu T
     */
    function setTribuT($tribu_T_name_table, $description, $path, $extension, $userId, $tribu_t_owned_or_join, $nomTribuT)
    // function setTribuT($tribu_T_name_table, $description,$path,$extenstion,$userId,$tribu_t_owned_or_join,$nomTribuT)

    {

        $fetch = $this->getPDO()->prepare("SELECT $tribu_t_owned_or_join FROM user WHERE id  = $userId");

        $fetch->execute();

        $result = $fetch->fetch(PDO::FETCH_ASSOC);

        $date = \getdate();
        $list = $result[$tribu_t_owned_or_join];

        if (!isset($list)) {
            $array = array(
                "tribu_t" => array(
                    "name" => $tribu_T_name_table,
                    "name_tribu_t_muable" => $nomTribuT,
                    "description" => $description,
                    "extension" => $extension,
                    // "extension"=> $extenstion,
                    // "extension_golf"=> $extenstion_golf,
                    "logo_path" => $path,
                    "date" =>  $date,
                )
            );
            //use these param if don't wont escape unicode JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES
            $array1 = json_encode($array);

            // $statement = $this->getPDO()->prepare("UPDATE user SET $tribu_t_owned_or_join ='". $array1 ."' WHERE id  = $userId");
            $statement = $this->getPDO()->prepare("UPDATE user SET $tribu_t_owned_or_join = :jsonArray WHERE id  = :userid");
            $statement->bindParam(":jsonArray", $array1);
            $statement->bindParam(":userid", $userId);
        } else {
            $array1 = json_decode($list, true);
            $tmp = [];
            $array = [];
            try {
                array_push($tmp, ...$array1["tribu_t"]);
            } catch (ArgumentCountError $e) {
                array_push($tmp, $array1["tribu_t"]);
            } finally {
                array_push(
                    $tmp,
                    array(
                        "name" => $tribu_T_name_table,
                        "name_tribu_t_muable" => $nomTribuT,
                        "description" => $description, "extension" => $extension, "logo_path" => $path, "date" =>  $date
                    )
                );
                // "description" => $description, "extension" => $extenstion,"extension_golf"=> $extenstion_golf, "logo_path" => $path, "date" =>  $date));
                // "description" => $description, "extension" => $extenstion, "logo_path" => $path, "date" =>  $date));
                $array = array("tribu_t" => $tmp);
            }

            if ($_ENV['APP_ENV'] == 'dev')
                dump($array);

            //use these param if don't wont escape unicode JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES
            $jsontribuT = json_encode($array);
            // $jsontribuT=str_replace("\\u","\\\\u",$jsontribuT);
            // dd($jsontribuT);
            $statement = $this->getPDO()->prepare("UPDATE user SET $tribu_t_owned_or_join = :jsonArray WHERE id  = :userid");
            $statement->bindParam(":jsonArray", $jsontribuT);
            $statement->bindParam(":userid", $userId);
        }

        $statement->execute();
    }

    /**
     * @author nantenainasoa39@gmail.com <email>
     * createjson for tribu-t
     * @param string $tribu_T_name_table it's can't be change. This value is the name of table in CMZ data base
     * @param string $description it's can be change. This is the description of the tribu T
     * @param string $path  it's can be change. This is the logo path of the tribu T
     * @param array $extension it's can be change. This is the extension we can associate with the tribu T
     * @param string $tribu_t_owned_or_join it's can't be change. The tribu T owned and joined
     * @param string $nomTribuT it's can be change. The name of the tribu T
     */
    function updateTribuTInfos($tribu_T_name_table, $description, $path, $extension, $userId, $tribu_t_owned_or_join, $nomTribuT)

    {

        $fetch = $this->getPDO()->prepare("SELECT $tribu_t_owned_or_join FROM user WHERE id  = $userId");

        $fetch->execute();

        $result = $fetch->fetch(PDO::FETCH_ASSOC);

        $date = \getdate();
        $list = $result[$tribu_t_owned_or_join];

        $tmp = [];

        if (isset($list)) {

            $jsonInitial = json_decode($list, true);

            $array1 = $jsonInitial["tribu_t"];

            if (array_key_exists("name", $array1)) {
                $table = $array1["name"];
                if ($tribu_T_name_table == $table) {
                    array_push(
                        $tmp,
                        array(
                            "name" => $table,
                            "name_tribu_t_muable" => $nomTribuT,
                            "description" => $description,
                            "extension" => $extension,
                            "logo_path" => $path != null ? $path : $array1["logo_path"],
                            "date" =>  $date
                        )
                    );
                } else {
                    array_push($tmp, $array1);
                }
            } else {
                for ($i = 0; $i < count($array1); $i++) {

                    $table = $array1[$i]["name"];

                    if ($tribu_T_name_table == $table) {
                        array_push(
                            $tmp,
                            array(
                                "name" => $table,
                                "name_tribu_t_muable" => $nomTribuT,
                                "description" => $description,
                                "extension" => $extension,
                                "logo_path" => $path != null ? $path : $array1[$i]["logo_path"],
                                "date" =>  $date
                            )
                        );
                    } else {
                        array_push($tmp, $array1[$i]);
                    }
                }
            }

            $array = array("tribu_t" => $tmp);

            if ($_ENV['APP_ENV'] == 'dev')
                dump($tmp);

            $jsontribuT = json_encode($array);

            //$jsontribuT=str_replace("\\u","\\\\u",$jsontribuT);

            $statement = $this->getPDO()->prepare("UPDATE user SET $tribu_t_owned_or_join = :jsonArray WHERE id  = :userid");
            $statement->bindParam(":jsonArray", $jsontribuT);
            $statement->bindParam(":userid", $userId);

            // $statement = $this->getPDO()->prepare("UPDATE user SET $tribu_t_owned_or_join = `".$jsontribuT."` WHERE id  = $userId");
            // // $statement->bindParam(":jsonArray",$jsontribuT);
            // $statement->bindParam(":userid",$userId);

            $statement->execute();
        }
    }


    /**
     * TODO
     */
    function getTribuTInfo($tribu_t_name)
    {

        $sql = "SELECT *,tribu.roles as tribu_t_roles FROM $tribu_t_name as tribu LEFT JOIN user as u ON u.id=tribu.user_id WHERE tribu.roles = 'Fondateur'";
        $exec = $this->getPDO()->prepare($sql);
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



    function fetchJsonDataTribuT($userId, $tribu_t_owned_or_join)
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

        $statement = $this->getPDO()->prepare("SELECT * from (SELECT concat(firstname,' ', lastname) as fullname, user_id from consumer union SELECT concat(firstname,' ', lastname) as fullname, user_id from supplier) as tab where tab.user_id=$userId");

        $statement->execute();

        $result = $statement->fetch(PDO::FETCH_ASSOC);
        // dd($result);
        return $result["fullname"];
    }

    public function getPdp($userId)

    {

        $statement = $this->getPDO()->prepare("SELECT * from (SELECT concat(photo_profil) as pdp, user_id from consumer union SELECT concat(photo_profil) as pdp, user_id from supplier) as tab where tab.user_id=$userId ");

        $statement->execute();

        $result = $statement->fetch(PDO::FETCH_ASSOC);

        return $result["pdp"];
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
        $result = $statement->fetch(PDO::FETCH_ASSOC);

        return $result ? $result["result"] : "unknown";
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



    public function updatePublication($table, $id, $publication, $confidentiality, $photo = "")

    {

        $sql = "UPDATE $table set publication = ?, confidentiality = ?, photo = ?  WHERE id = ?";

        $stmt = $this->getPDO()->prepare($sql);

        $stmt->execute([$publication, $confidentiality, $photo, $id]);
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

        if (count($result) > 0) {

            if ($result[0]["status"] == 0) {

                return "pending";
            } elseif ($result[0]["status"] == 1) {

                return "accepted";
            }
            if ($result[0]["status"] == 2) {

                return "refuse";
            }
        } else {

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

        $statement = $this->getPDO()->prepare("SELECT photo FROM $table WHERE photo <> '' order by id DESC");

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



    public function showAvatar($table, $id)
    {

        // dd($table);

        $sql = "SELECT avatar, roles FROM $table WHERE user_id = $id";



        $stmt = $this->getPDO()->prepare($sql);



        $stmt->execute();



        $result = $stmt->fetch(PDO::FETCH_ASSOC);



        return $result;
    }



    public function updateAvatar($table, $avatar)
    {



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



        if (count($result) < 1) {

            $statement = $this->getPDO()->prepare("INSERT INTO $table (profil, email, amie, notif_is_active, invitation, publication, user_id) values (?,?,?,?,?,?,?)");

            $statement->execute([1, 1, 1, 1, 1, 1, $user_id]);
        }
    }



    public function fetchUserPublication($table, $user_id)
    {

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

    /**
     * @author Jean Gilbert RANDRIANANTENAINASOA <nantenainasoa39@gmail.com>
     * @param string $tribu_t : Table tribu T
     * @param string $extension : extension pour la table tribu T
     * Cette fonction est utilisée pour la création de toute les tables des extensions
     * id_resto n'est autre que l'id des extensions
     */
    public function createExtensionDynamicTable($tribu_t, $extension)
    {

        $sql = "CREATE TABLE IF NOT EXISTS " . $tribu_t . "_" . $extension . " (

            id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT, 
            id_resto VARCHAR(250) NOT NULL,
            denomination_f VARCHAR(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
            isPastilled tinyint(1) NULL  DEFAULT '1',
            datetime timestamp NOT NULL DEFAULT current_timestamp(),
            CONSTRAINT cst_id_resto UNIQUE (id_resto)
            )ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci";

        $stmt = $this->getPDO()->prepare($sql);

        $stmt->execute();
    }

    /**
     * @author Jean Gilbert RANDRIANANTENAINASOA <nantenainasoa39@gmail.com>
     * @param string $tribu_t : Table tribu T
     * @param string $extension : extension pour la table tribu T
     * Cette fonction est utilisée pour la création de toute les tables commentaires des extensions
     * id_restaurant n'est autre que l'id des extensions
     * id_resto_comment n'est autre que la clé primaire de la table commentaire de l'extension
     */
    public function createTableComment($tribu_t, $extension)
    {
        $sql = "CREATE TABLE IF NOT EXISTS " . $tribu_t . "_" . $extension . "(

            id_resto_comment int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT, 

            id_restaurant VARCHAR(250) NOT NULL,

            id_user VARCHAR(250) NOT NULL,

            note decimal(3,2),

            commentaire TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,

            datetime timestamp NOT NULL DEFAULT current_timestamp())ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci";

        $stmt = $this->getPDO()->prepare($sql);

        $stmt->execute();
    }

    public function createExtensionDynamicTableGolf($tribu_t, $extension)
    {

        $sql = "CREATE TABLE IF NOT EXISTS " . $tribu_t . "_" . $extension . " (

            id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT, 

            id_golf VARCHAR(250) NOT NULL,

            denomination_f VARCHAR(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,

            datetime timestamp NOT NULL DEFAULT current_timestamp(),

            CONSTRAINT cst_id_golf UNIQUE (id_golf)
            
            )ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci";

        $stmt = $this->getPDO()->prepare($sql);

        $stmt->execute();
    }

    public function createTableCommentGolf($tribu_t, $extension)
    {
        $sql = "CREATE TABLE IF NOT EXISTS " . $tribu_t . "_" . $extension . "(

            id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT, 

            id_golf VARCHAR(250) NOT NULL,

            id_user VARCHAR(250) NOT NULL,

            note decimal(3,2),

            commentaire TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,

            datetime timestamp NOT NULL DEFAULT current_timestamp())ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci";

        $stmt = $this->getPDO()->prepare($sql);

        $stmt->execute();
    }

    // public function sendCommentRestoPastilled($tableName,$idResto,$idUser,$note,$commentaire){
    //     $values=array(":id_restaurant"=>$idResto,
    //         ":id_user"=>$idUser,
    //         ":note"=>$note,
    //         ":commentaire"=>$commentaire
    //     );
    //     $sql= "INSERT INTO " .$tableName. "(id_restaurant,id_user,note,commentaire)". 
    //               "VALUES (:id_restaurant, :id_user,:note,:commentaire)";
    //     $stmt = $this->getPDO()->prepare($sql);

    //     return $stmt->execute($values);

    // }

    public function sendCommentRestoPastilled($tableName, $idResto, $idUser, $note, $commentaire)
    {
        $values = array(
            ":id_restaurant" => $idResto,
            ":id_user" => $idUser,
            ":note" => $note,
            ":commentaire" => $commentaire
        );
        $sql = "INSERT INTO " . $tableName . "(extensionId,userId,note,commentaire)" .
            "VALUES (:id_restaurant, :id_user,:note,:commentaire)";
        $stmt = $this->getPDO()->prepare($sql);

        return $stmt->execute($values);
    }


    public function upCommentRestoPastilled($tableName,  $note, $commentaire, $idRestoComment, $my_id)
    {
        $values = array(
            ":note" => $note,
            ":commentaire" => $commentaire,
            ":idRestoComment" => $idRestoComment,
            ":my_id" => $my_id
        );
        $sql = "UPDATE " . $tableName . " SET note = :note, commentaire = :commentaire WHERE id=:idRestoComment and userId=:my_id";
        $stmt = $this->getPDO()->prepare($sql);

        return $stmt->execute($values);
    }

    public function fetchAllPublications($tableList, $user_id)
    {

        $rqt = "SELECT id, user_id, publication, confidentiality,photo, userfullname, datetime, ";

        $final_rqt = "";

        if (count($tableList) > 0) {
            for ($i = 0; $i < count($tableList); $i++) {
                if ($i != count($tableList) - 1) {
                    $rqt .= "'" . $tableList[$i] . "' as tribu from " . $tableList[$i] . "_publication WHERE user_id = " . $user_id . " union SELECT id, user_id, publication, confidentiality,photo, userfullname, datetime, ";
                } else {
                    $rqt .= "'" . $tableList[$i] . "' as tribu from " . $tableList[$i] . "_publication WHERE user_id = " . $user_id;
                }
            }
            $final_rqt = $rqt . " order by datetime DESC";
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

    public function hasTableResto($table)
    {

        $db = $_ENV["DATABASENAME"];

        $query = "SHOW TABLES FROM $db like '%$table%'";

        $sql = $this->getPDO()->query($query);

        $resultat = $sql->rowCount();

        if ($resultat > 0) {
            return true;
        } else {
            return false;
        }
    }

    public function getAllRestoPastiledForAllTable($id)
    {
        $results = [];
        /// all tribu T
        $all_tribuT = $this->showTribuT($id, "_restaurant");



        foreach ($all_tribuT as $trib) {
            if ($this->hasTableResto($trib[0])) {
                $statement = $this->getPDO()->prepare("SELECT id, id_resto,denomination_f as name FROM $trib[0];");
                $statement->execute();
                $restos = $statement->fetchAll(PDO::FETCH_ASSOC);

                $results = array_merge($results, $restos);
            }
        }
        return $results;
    }

    public function getRestoPastilles($tableResto, $tableComment)
    {
        /// old sql request, this use the talbe <tribu_t_ ...>_restaurant_commentaire to get the avis.
        // $sql = "SELECT * FROM (SELECT  id, id_resto,denomination_f, isPastilled, id_resto_comment,id_restaurant,id_user,note,commentaire ,
        // 						GROUP_CONCAT(t2.id_user) as All_user ,GROUP_CONCAT(t2.commentaire) as All_com,FORMAT(AVG(t2.note),2) as globalNote, COUNT(t2.id_restaurant) as nbrAvis ,
        // 						GROUP_CONCAT(t2.id_resto_comment) as All_id_r_com FROM $tableResto  as t1 LEFT JOIN $tableComment  as t2  ON t2.id_restaurant =t1.id_resto GROUP BY t1.id ) 
        // 		as tb1 INNER JOIN bdd_resto ON tb1.id_resto=bdd_resto.id";

        //// NEW : This use the global table avisresaturant in tribu T
        $sql = "SELECT * FROM ( 
                    SELECT  t1.id, 
                            t1.id_resto,
                            t1.denomination_f, 
                            t1.isPastilled, 
                            t2.id as id_resto_comment, 
                            t2.id_resto as id_resto_pastilled, 
                            t2.id_user, 
                            t2.note, 
                            t2.avis as commentaire,
                            GROUP_CONCAT(t2.id_user) as All_user, 
                            GROUP_CONCAT(t2.avis) as All_com, 
                            FORMAT(AVG(t2.note),2) as globalNote, 
                            COUNT(t2.id_resto) as nbrAvis,
                            GROUP_CONCAT(t2.id) as All_id_r_com 
                    FROM $tableResto  as t1 
                    LEFT JOIN avisrestaurant  as t2 ON t1.id_resto = t2.id_resto WHERE t1.isPastilled IS TRUE
                GROUP BY t1.id ) as tb1 
                INNER JOIN bdd_resto ON tb1.id_resto=bdd_resto.id";

        $stmt = $this->getPDO()->prepare($sql);

        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function getGolfPastilles($tableGolf, $tableComment)
    {

        // $sql = "SELECT * FROM (SELECT  id, id_resto as id_golf,denomination_f as nom_golf, isPastilled, id_resto_comment as id_golf_comment,id_restaurant  as id_extension,id_user,note,commentaire ,
        // 						GROUP_CONCAT(t2.id_user) as All_user ,GROUP_CONCAT(t2.commentaire) as All_com,FORMAT(AVG(t2.note),2) as globalNote, COUNT(t2.id_restaurant) as nbrAvis ,
        // 						GROUP_CONCAT(t2.id_resto_comment) as All_id_r_com FROM $tableGolf  as t1 LEFT JOIN $tableComment  as t2  ON t2.id_restaurant =t1.id_resto GROUP BY t1.id ) 
        // 		as tb1 INNER JOIN golffrance ON tb1.id_golf=golffrance.id";
        $sql = "SELECT * FROM (
                    SELECT  t1.id, 
                            t1.id_resto,
                            t1.denomination_f, 
                            t1.isPastilled, 
                            t2.id as id_golf_comment, 
                            t2.id_golf, 
                            t2.id_user, 
                            t2.note, 
                            t2.avis as commentaire ,
                            GROUP_CONCAT(t2.id_user) as All_user ,
                            GROUP_CONCAT(t2.avis) as All_com, 
                            FORMAT(AVG(t2.note),2) as globalNote, 
                            COUNT(t2.id) as nbrAvis,
                            GROUP_CONCAT(t2.id) as All_id_r_com 
                            FROM $tableGolf as t1 
                                LEFT JOIN avisgolf  as t2
                                ON t2.id_golf =t1.id_resto WHERE t1.isPastilled IS TRUE
                    GROUP BY t1.id ) as tb1 
                INNER JOIN golffrance
                ON tb1.id_resto =golffrance.id;";

        $stmt = $this->getPDO()->prepare($sql);

        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function getAllAvisByRestName($tableResto, $id)
    {
        $data = [
            ":id" => $id
        ];
        $sql = "SELECT * FROM $tableResto as t1 LEFT JOIN user as t2 ON t1.id_user = t2.id where t1.id_restaurant = :id";
        $stmt = $this->getPDO()->prepare($sql);
        $stmt->execute($data);
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function getPartisantPublicationOld($table_publication_Tribu_T, $table_commentaire_Tribu_T, $tableTribuTImageImported,$idMin, $limits)
    {
        $resultF = [];
        if ($idMin == 0) {
            //id,user_id,confidentiality,photo,userfullname,datetime, publication 

            $sql = "SELECT * FROM $table_publication_Tribu_T as t1 LEFT JOIN(SELECT pub_id ,count(*)".
                " as nbr FROM $table_commentaire_Tribu_T group by pub_id )".
                " as t2 on t1.id=t2.pub_id  ORDER BY t1.id DESC LIMIT :limits ";

            $stmt = $this->getPDO()->prepare($sql);
            $stmt->bindValue(':limits', $limits, PDO::PARAM_INT);
            $stmt->execute();
            $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // select image from image imported
           
        } else {
            $sql = "SELECT * FROM $table_publication_Tribu_T  as t1 LEFT JOIN(SELECT pub_id ,count(*)".
                " as nbr FROM $table_commentaire_Tribu_T  group by pub_id )". 
                " as t2 on t1.id=t2.pub_id and t1.id < :idmin ORDER BY id DESC LIMIT :limits";
            $stmt = $this->getPDO()->prepare($sql);
            $stmt->bindValue(':idmin', $idMin, PDO::PARAM_INT);
            $stmt->bindValue(':limits', $limits, PDO::PARAM_INT);
            $stmt->execute();
            $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        }

        foreach ($results as $result) {
            
            $userSentPub =intval($result['user_id']);
            $sql2="SELECT photo_profil,firstname,lastname FROM (". 
            " SELECT photo_profil, user_id,firstname,lastname FROM". 
            " consumer union SELECT photo_profil, user_id,firstname,".
            " lastname FROM supplier) as tab WHERE tab.user_id =:id_user";
            $statement_photos = $this->getPDO()->prepare($sql2);
            $statement_photos->bindValue(':id_user', $userSentPub, PDO::PARAM_INT);
            $statement_photos->execute();
            $user_profil = $statement_photos->fetch(PDO::FETCH_ASSOC);
            $result["publication"] = $this->convertUnicodeToUtf8($result["publication"]);
            $result["user_profil"] = $user_profil;
            array_push($resultF, $result);
        }
        return $resultF;
    }
    public function getPartisantPublication($table_publication_Tribu_T, $table_commentaire_Tribu_T,$idMin,$limits, $userId){
        $resultF=[];
        $regex = "/\_publication+$/";

        $tableReaction = preg_replace($regex, "_reaction", $table_publication_Tribu_T);
  
        if($idMin == 0){
            //id,user_id,confidentiality,photo,userfullname,datetime, publication 

            $sql = "SELECT * FROM (SELECT * FROM $table_publication_Tribu_T as t1 LEFT JOIN(SELECT pub_id ,count(*)".
            " as nbr FROM $table_commentaire_Tribu_T group by pub_id ) as t2 on t1.id=t2.pub_id".  
            " ORDER BY t1.id DESC LIMIT :limits) as tb1 " .
            " LEFT JOIN (SELECT user_id as user_id_react, pub_id as pub_id_react,". 
            " reaction FROM $tableReaction) as tb2 on tb1.id = tb2.pub_id_react and tb2.user_id_react = $userId"
            ;
           
            $stmt = $this->getPDO()->prepare($sql);
            $stmt->bindValue(':limits', $limits, PDO::PARAM_INT); 
            $stmt->execute();
            $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

            
        }else{
            $sql = "SELECT * FROM (SELECT * FROM $table_publication_Tribu_T  as t1 LEFT JOIN(SELECT pub_id ,count(*)".
            " as nbr FROM $table_commentaire_Tribu_T  group by pub_id ) as t2 on t1.id=t2.pub_id and t1.id <". 
            " :idmin ORDER BY id DESC LIMIT :limits) as tb1 " .
            " LEFT JOIN (SELECT user_id as user_id_react, pub_id as pub_id_react, reaction ". 
            " FROM $tableReaction) as tb2 on tb1.id = tb2.pub_id_react and tb2.user_id_react = $userId";
            $stmt = $this->getPDO()->prepare($sql);
            $stmt->bindValue(':idmin', $idMin, PDO::PARAM_INT); 
            $stmt->bindValue(':limits', $limits, PDO::PARAM_INT); 
            $stmt->execute();
            $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
           
        }

        foreach($results as $result){
            $userSentPub=$result['user_id'];
            $statement_photos = $this->getPDO()->prepare("SELECT photo_profil,firstname,lastname FROM (SELECT photo_profil, user_id,firstname,lastname FROM consumer union SELECT photo_profil, user_id,firstname,lastname FROM supplier) as tab WHERE tab.user_id = $userSentPub");
            $statement_photos->execute();
            $user_profil = $statement_photos->fetch(PDO::FETCH_ASSOC);
            $result["publication"]=$this->convertUnicodeToUtf8($result["publication"]);
            $result["user_profil"]=$user_profil;
            array_push($resultF,$result);
        }
        return $resultF;
    }

    public function putCommentOnPublication(
        $tableCommentaireName,
        $user_id,
        $pub_id,
        $commentaire,
        $userFullname,
    ) {

        $datetime = new \DateTime();
        $datetime = $datetime->format('Y-m-d H:i:s');
        $array = array(
            ":user_id" => $user_id,
            ":pub_id" => $pub_id,
            ":commentaire" => $commentaire,
            ":userFullname" => $userFullname,
            ":datetime" => $datetime

        );
        $sql = "INSERT INTO $tableCommentaireName (user_id,pub_id,commentaire,userFullname,datetime) 
        values(:user_id,:pub_id,:commentaire,:userFullname,:datetime)";
        $stmt = $this->getPDO()->prepare($sql);
        return $stmt->execute($array);
    }

    public function getCommentPubTribuT($tableCommentaireTribu_t, $idPub, $idMin, $limits)
    {
        //SELECT * FROM `tribu_t_1_banane_commentaire` as t1  LEFT JOIN user  as t2 on t1.user_id = t2.id where t1.id < 10 ORDER BY t1.id DESC LIMIT 3;
        if ($idMin == 0) {
            $sql = "SELECT * FROM $tableCommentaireTribu_t as t1 WHERE t1.pub_id=:pub_id ORDER BY t1.id DESC LIMIT :limits";
            $stmt = $this->getPDO()->prepare($sql);
            $stmt->bindValue(':limits', $limits, PDO::PARAM_INT);
            $stmt->bindValue(':pub_id', $idPub, PDO::PARAM_INT);
            $stmt->execute();
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return $result;
        } else {
            $sql = "SELECT * FROM $tableCommentaireTribu_t as t1 WHERE t1.id < :idmin and t1.pub_id =:pub_id ORDER BY t1.id DESC LIMIT :limits";
            $stmt = $this->getPDO()->prepare($sql);
            $stmt->bindValue(':idmin', $limits, PDO::PARAM_INT);
            $stmt->bindValue(':limits', $limits, PDO::PARAM_INT);
            $stmt->bindValue(':pub_id', $idPub, PDO::PARAM_INT);
            $stmt->execute();
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return $result;
        }
    }

    public function getPartisanOfTribuT($tableTribuT)
    {

        $sql = "SELECT * FROM $tableTribuT as t1 left join (" .
            "SELECT id,type, case type when 'consumer' THEN (SELECT JSON_OBJECT('id',id,'user_id',user_id,'firstName',firstname,'lastName'," .
            "lastname,'photo_profil',photo_profil,'tribuG',tributg,'email',email) as infos FROM consumer as c where c.user_id= u.id)" .
            "when 'supplier' THEN (SELECT JSON_OBJECT('id',id,'user_id',user_id,'firstName',firstname,'lastName', lastname," .
            "'photo_profil',photo_profil,'tribuG',tributg,'email',email)as infos FROM supplier as c where c.user_id= u.id)" .
            "end infos_profil from user as u ) as t2 on t2.id=t1.user_id";
        $stmt = $this->getPDO()->prepare($sql);
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function getAllPartisanProfil($tableTribuT)
    {

        if ($this->isTableExist($tableTribuT)) {
            $sql = "SELECT id, user_id, roles  FROM $tableTribuT WHERE status LIKE '1'";
            $stmt = $this->getPDO()->prepare($sql);
            $stmt->execute();
            $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

            return $results;
        }
        return [];
    }


    /**
     * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
     * 
     * Get all list of the table tribu T in the database
     * 
     * @param string $userID : ID of the agenda to partage
     * 
     * @return array list of the table tribu T. [ [ "table_name" => ... ], ... ]
     */
    public function getAllTribuT($userID)
    {

        $results = array();
        $tab_not_like = ['%agenda%', '%commentaire%', '%publication%', '%reaction%', '%restaurant%'];

        $query_sql = "SELECT table_name FROM INFORMATION_SCHEMA.TABLES WHERE table_type = 'BASE TABLE' AND table_name like 'tribu_t_%'";
        foreach ($tab_not_like as $not_like) {
            $query_sql .= " AND table_name NOT LIKE '$not_like' ";
        }
        $statement = $this->getPDO()->prepare($query_sql);
        $statement->execute();
        $all_tables = $statement->fetchAll(PDO::FETCH_ASSOC);

        $results = [];
        foreach ($all_tables as $table) {
            if ($this->hasTableResto($table["table_name"])) {
                array_push($results, $table);
            }
        }

        return $results;
    }

    /**
     * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
     * 
     *  Get apropos of the tribu T ( name, description,avatar)
     * 
     * @param string $table_name: name of the table
     * 
     * @return array associative : [ 'name' => ... , 'description' => ... , 'avatar' => ... ]
     */
    public function getApropos($table_name)
    {
        $apropos = ["name" => "", "description" => "", "avatar" => ""];

        $statement = $this->getPDO()->prepare("SELECT user_id FROM $table_name where roles = 'Fondateur'");
        $statement->execute();
        $userID_fondateurTribuT = $statement->fetch(PDO::FETCH_ASSOC);

        if (!$userID_fondateurTribuT) {
            return false;
        }

        $id = $userID_fondateurTribuT['user_id'];

        $statement = $this->getPDO()->prepare("SELECT tribu_t_owned FROM user where id = $id ");
        $statement->execute();
        $t_owned = $statement->fetch(PDO::FETCH_ASSOC);

        $tribu_t_owned = $t_owned['tribu_t_owned'];

        $object = json_decode($tribu_t_owned, true);

        if (!array_key_exists("name_tribu_t_muable", $object['tribu_t'])) {

            foreach ($object['tribu_t'] as $trib) {

                //"Tribu T " . ucfirst(explode("_",$trib['name_tribu_t_muable'])[count(explode("_",$trib['name_tribu_t_muable']))-1])
                if ($trib['name'] === $table_name) {
                    $apropos = [
                        'name' => $trib['name_tribu_t_muable'],
                        'description' => $trib['description'],
                        'avatar' => $trib['logo_path'],
                    ];

                    break;
                }
            }
        } else {
            //"Tribu T " . ucfirst(explode("_",$object['tribu_t']['name_tribu_t_muable'])[count(explode("_",$object['tribu_t']['name_tribu_t_muable']))-1])
            if ($object['tribu_t']['name'] === $table_name) {
                $apropos = [
                    'name' =>  $object['tribu_t']['name_tribu_t_muable'],
                    'description' => $object['tribu_t']['description'],
                    'avatar' => $object['tribu_t']['logo_path'],
                ];
            }
        }

        return $apropos;
    }


    public function getAllTribuTJoinedAndOwned($id)
    {
        $sql = "SELECT tribu_t_joined,tribu_t_owned FROM `user` WHERE id=$id";
        $stmt = $this->getPDO()->prepare($sql);
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    /**
     * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
     * 
     * Get On publications in this table (brutes: entity).
     * 
     * @param string $table_name: name of the table
     * @param int $id:  publication id
     */
    public function getOnePublication($table_name, $pubID)
    {

        $statement = $this->getPDO()->prepare("SELECT * FROM $table_name WHERE id= $pubID;");
        $statement->execute();

        $publication = $statement->fetch(PDO::FETCH_ASSOC); // publications

        return $publication;
    }


    /**
     * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
     * 
     * Get On publications in this table (brutes: entity).
     * 
     * @param string $table_name: name of the table
     * @param int $id:  publication id
     */
    public function getCommentsPublication($table_name, $pubID)
    {

        $results = [];
        $statement = $this->getPDO()->prepare("SELECT * FROM $table_name" . "_commentaire " . "WHERE pub_id= $pubID;");
        $statement->execute();

        $comments = $statement->fetchAll(PDO::FETCH_ASSOC); // publications

        foreach ($comments as $comment) {
            $user_id = $comment["user_id"];

            $statement_photos = $this->getPDO()->prepare("SELECT tab.photo_profil FROM (SELECT photo_profil, user_id FROM consumer union SELECT photo_profil, user_id FROM supplier) as tab WHERE tab.user_id = $user_id");
            $statement_photos->execute();
            $photo_profil = $statement_photos->fetch(PDO::FETCH_ASSOC); /// [ photo_profil => ...]
            $commentaire= $this->convertUnicodeToUtf8(json_decode($comment["commentaire"],true));
            $temp= [
                "comment_id" => $comment["id"],
                "pub_id" => $comment["pub_id"],
                "dateTime" => $comment["datetime"],
                "text_comment" => $commentaire,
                "user" => [
                    "fullname" => $comment["userfullname"],
                    "photo" => $photo_profil["photo_profil"],
                    "is_connected" => true
                ]
            ];

            array_push($results, $temp);
        }

        return $results;
    }



    public function updateVisibility($tablePub, int $pub_id, int $confidentiality)
    {

        $query = "UPDATE $tablePub set confidentiality = $confidentiality WHERE id = '$pub_id'";

        $stmt = $this->getPDO()->prepare($query);

        $stmt->execute();
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
     * Get all publications in this table (brutes: entity).
     * 
     * @param string $table_name: name of the table
     */
    public function getAllPublicationBrutesPhoto($table_name)
    {

        $statement = $this->getPDO()->prepare("SELECT * FROM $table_name" . " ORDER BY datetime DESC LIMIT 6;");

        $statement->execute();

        $publications = $statement->fetchAll(PDO::FETCH_ASSOC); // [...publications]

        return $publications;
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
    public function getAllPublicationsUpdate($table_name)
    {
        $resultats = [];


        $apropo_tribuT = $this->getApropos($table_name);

        if (!$apropo_tribuT) {
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


                $data = [
                    "userOwnPub" => [
                        "id" => $d_pub["user_id"],
                        "profil" => $photo_profil["photo_profil"],
                        "fullName" => $d_pub["userfullname"],
                    ],

                    "publication" => [
                        "id" => $d_pub["id"],
                        "confidentiality" => $d_pub['confidentiality'],
                        "description" => json_decode($this->convertUnicodeToUtf8($d_pub['publication']), true),
                        "image" => $d_pub['photo'],
                        "createdAt" => $d_pub["datetime"],
                        "comments" => $comments,
                        "reactions" => $reactions,
                    ],
                    "tribu" => [
                        "type" => "Tribu T",
                        "name" => $apropo_tribuT['name'],
                        "description" => $apropo_tribuT['description'],
                        "avatar" =>  $apropo_tribuT['avatar'],
                        "table" => $table_name
                    ]
                ];

                array_push($resultats, $data);
            }
            //dd();
        }

        return $resultats;
    }

    /**
     * @author Tomm
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
    public function getAllPublicationsPhotoUpdate($table_name)
    {
        $resultats = [];



        $publications = $this->getAllPublicationBrutesPhoto($table_name); // [...publications]


        if (count($publications) > 0) {
            foreach ($publications as $d_pub) {

                $publication_user_id = $d_pub["user_id"];

                $statement_photos = $this->getPDO()->prepare("SELECT photo_profil FROM (SELECT photo_profil, user_id FROM consumer union SELECT photo_profil, user_id FROM supplier) as tab WHERE tab.user_id = $publication_user_id");
                $statement_photos->execute();
                $data = [
                    "publication" => [
                        "image" => $d_pub['photo'],
                        "createdAt" => $d_pub["datetime"]
                    ]
                ];

                array_push($resultats, $data);
            }
        }

        return $resultats;
    }

    /**
     * @author Tomm
     * @param Creation image import dans tribu t
     * @ultimately tributControllert
     */
    public function createImportPhotoGalery($table_name, $userId, $file_path, $datetime,$userfullname)
    {
        $userId=intval($userId);
        $confidentiality=1;
        $sql = "INSERT INTO " . $table_name . "( user_id, path, datetime) VALUES (:user_id,:path,:datetime)";
        $statement = $this->getPDO()->prepare($sql);
        $statement->bindParam(':user_id',$userId , PDO::PARAM_INT);
        $statement->bindParam(':path', $file_path, PDO::PARAM_STR);
        $statement->bindParam(':datetime', $datetime, PDO::PARAM_STR);
        $statement->execute();

        //insert in table publication 1 public, 2 private
        $sql2="INSERT INTO ". str_replace("_imp_img","_publication",$table_name).
        " (user_id,confidentiality, photo,userfullname) ".
        " VALUES (?,?,?,?)";
        $statement2 = $this->getPDO()->prepare($sql2);
        $statement2->bindParam(1,$userId, PDO::PARAM_INT);
        $statement2->bindParam(2,  $confidentiality, PDO::PARAM_INT);
        $statement2->bindParam(3,$file_path, PDO::PARAM_STR);
        $statement2->bindParam(4, $userfullname, PDO::PARAM_STR);
      
        $statement2->execute();

    }

    public function getImportPhotoGalery($table_name)
    {
        $sql = "SELECT path , datetime FROM " . str_replace("_publication", "_imp_img", $table_name);
        //dd($sql);
        $stmt = $this->getPDO()->prepare($sql);
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return $result;
    }



    /**
     * @author Jean Gilbert RANDRIANANTENAINASOA <nantenainasoa39@gmail.com>
     * 
     * @param string $tableName: le nom de la table tribu
     * 
     * @param string $extension: l'extension
     * @return number $result: 0 or if(not exists) else positive number
     */
    public function checkExtension($tableName, $extension)
    {

        //$query = "SHOW TABLES FROM $db like 'tribu_t_" . $user_id . "_" . $tableName . "'";
        $db = $_ENV["DATABASENAME"];

        $query = "SHOW TABLES FROM $db like '" . $tableName . $extension . "'";

        $sql = $this->getPDO()->query($query);

        $result = $sql->rowCount();

        return $result;
    }

    /**
     * @author Jean Gilbert RANDRIANANTENAINASOA <nantenainasoa39@gmail.com>
     * 
     * @param string $tableNameExtension: le nom de la table extension
     * 
     * @param int $idResto: l'extension
     * @return number $result: 0 or if(not exists) else positive number
     */
    public function checkIfCurrentRestaurantPastilled($tableNameExtension, int $idResto, $isPastilled)
    {


        $statement = $this->getPDO()->prepare("SELECT id FROM $tableNameExtension WHERE id_resto = $idResto AND isPastilled = $isPastilled");

        $statement->execute();

        $result = $statement->fetch();

        if (is_array($result)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * @author Tomm 
     * @action get list tribu t pastille
     * @ou golfControlleur
     */
    public function checkIfCurrentGolfPastilled($tableNameExtension, int $golf, $isPastilled)
    {


        $statement = $this->getPDO()->prepare("SELECT id FROM $tableNameExtension WHERE id_resto = $golf AND isPastilled = $isPastilled");

        $statement->execute();

        $result = $statement->fetch();

        if (is_array($result)) {
            return true;
        } else {
            return false;
        }
    }

    public function depastilleOrPastilleRestaurant($table_resto, $resto_id, $isPastilled)
    {
        $sql = "UPDATE $table_resto SET isPastilled = :isPastilled WHERE id_resto = :resto_id";
        $stmt = $this->getPDO()->prepare($sql);
        $stmt->bindParam(":isPastilled", $isPastilled);
        $stmt->bindParam(":resto_id", $resto_id);
        $stmt->execute();
    }

    public function depastilleOrPastilleTribuT($table_resto, $resto_id, $isPastilled)
    {
        $sql = "UPDATE $table_resto SET isPastilled = :isPastilled WHERE id_resto = :resto_id";
        $stmt = $this->getPDO()->prepare($sql);
        $stmt->bindParam(":isPastilled", $isPastilled);
        $stmt->bindParam(":resto_id", $resto_id);
        $stmt->execute();
    }


    /**
     * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
     * où:la rubrique resto 
     * localisation du fichier: dans ResturantController.php,
     * je veux: obtenir les details de tous les tribu T avec une extension restaurant avec l'id de restaurant pastille.
     * 
     * @param $tribu_t_owned []
     * 
     * @return array [ [ id_resto => ..., tableName => ..., name_tribu_t_muable => ..., logo_path => ...], ... ]
     */
    public function getEntityRestoPastilled($tribu_t_owned)
    {
        $arrayIdResto = [];
        if (count($tribu_t_owned) > 0) {
            foreach ($tribu_t_owned as $key) {
                $tableTribu = $key["table_name"];
                $tableExtension = $tableTribu . "_restaurant";
                if ($this->checkExtension($tableTribu, "_restaurant") > 0) {
                    $all_id_resto_pastille = $this->getAllIdRestoPastille($tableExtension, true);  // [ [ id_resto => ..., tableName => ... ], ... ]
                    if (count($all_id_resto_pastille) > 0) {
                        foreach ($all_id_resto_pastille as $id_resto_pastille) {
                            $temp = [
                                "id_resto" => $id_resto_pastille["id_resto"],
                                "tableName" => $id_resto_pastille["tableName"],
                                "name_tribu_t_muable" => $key["name_tribu_t_muable"],
                                "logo_path" => $key["logo_path"]
                            ];

                            array_push($arrayIdResto, $temp);
                        }
                    }
                }
            }
        }

        return $arrayIdResto;
    }

    /**
     * @author Elie <eliefenohasina@gmail.com>
     * @Fonction de sauvegarde de l'historique de l'invitation dans la tribu T
     */
    function saveInvitationStory($table_invitation, $user_id, $email)
    {

        $sql = "SELECT count(*) as is_invited FROM $table_invitation WHERE email = :email ";

        $stmt = $this->getPDO()->prepare($sql);

        $stmt->bindParam(':email', $email);

        $stmt->execute();

        $is_invited = $stmt->fetch(PDO::FETCH_ASSOC)['is_invited'];

        if ($is_invited <= 0) {

            $statement = $this->getPDO()->prepare("INSERT INTO $table_invitation (user_id, email) values (:user_id, :email)");

            $userfullname = $this->getFullName($user_id);

            $statement->bindParam(':user_id', $user_id);

            $statement->bindParam(':email', $email);

            $statement->execute();

            return true;
        } else {

            return false;
        }
    }

    /**
     * @author Elie <eliefenohasina@gmail.com>
     * @Fonction fetching de l'historique de l'invitation dans la tribu T
     */
    function getAllInvitationStory($table_invitation)
    {

        $sql = "SELECT user.id as id, is_valid, $table_invitation " . ".email, datetime FROM $table_invitation LEFT JOIN user ON $table_invitation" . ".email = user.email";

        $stmt = $this->getPDO()->prepare($sql);

        $stmt->execute();

        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return $result;
    }

    /**
     * @author Elie <eliefenohasina@gmail.com>
     * @Fonction mise à jour de l'historique de l'invitation dans la tribu T
     */
    function updateInvitationStory($table_invitation, $is_valid, $email)
    {

        $sql = "UPDATE $table_invitation SET is_valid = :is_valid WHERE email = :email";

        $stmt = $this->getPDO()->prepare($sql);

        $stmt->bindParam(":is_valid", $is_valid);

        $stmt->bindParam(":email", $email);

        $stmt->execute();
    }
    /**
     * @author Faniry
     * @use cette fonction créee la table message pour le message groupé des fan dans les tribu T
     */
    public function creaTableTeamMessage($tribu_t)
    {

        $tableMessageName = $tribu_t . "_msg_grp";

        $sql="CREATE TABLE IF NOT EXISTS ".$tableMessageName. " ( ".
        "id_msg int NOT NULL PRIMARY KEY AUTO_INCREMENT,".
        "id_expediteur int NOT NULL,".
        "msg longtext  CHARACTER SET utf8 COLLATE utf8_unicode_ci,".
        "files longtext CHARACTER SET utf8 COLLATE utf8_unicode_ci,".
        "images longtext CHARACTER SET utf8 COLLATE utf8_unicode_ci,".
        "isPrivate tinyint NOT NULL DEFAULT 0,".
        "isPublic tinyint NOT NULL DEFAULT 1,".
        "isRead tinyint NOT NULL DEFAULT 0,".
        "isRemoved tinyint,".
        "isEpingler tinyint,".
        "iv blob, ".
        "date_message_created datetime NOT NULL DEFAULT current_timestamp()".
        " )ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci";
        $stmt = $this->getPDO()->prepare($sql);

        $stmt->execute();
    }

    /**
     * @author faniry <faniryandriamihaingo@gmail.com>
     * @param string $messgae
     * @param string[] $files
     * @param string[] $images
     * @param integer $id, (id of user who send message)
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
        $files , 
        $images, 
        $idSender, 
        $isPrivate, 
        $isPublic,
        $isRead,
        $tribu_t,
        $userRepository,
        $userService,
        $notificationService)
    {

        $tableMessageName=$tribu_t."_msg_grp";
        $iv = openssl_random_pseudo_bytes(openssl_cipher_iv_length($_ENV["ENCRYPTIONMETHOD"]));
        $encryptedData = openssl_encrypt($message,$_ENV["ENCRYPTIONMETHOD"], $_ENV["SECRET"], 0, $iv);
        $sql='INSERT INTO '. $tableMessageName.
        '(id_expediteur, msg , files, images, isPrivate, isPublic, isRead, iv)'. 
        'VALUES(:id_expediteur, :msg, :files, :images, :isPrivate, :isPublic, :isRead, :iv )';
        $encryptedImages=  openssl_encrypt(json_encode($images),$_ENV["ENCRYPTIONMETHOD"], $_ENV["SECRET"], 0, $iv);
        $encryptedFiles= openssl_encrypt(json_encode($files),$_ENV["ENCRYPTIONMETHOD"], $_ENV["SECRET"], 0, $iv);
        $statement = $this->getPDO()->prepare($sql);
        $statement->bindParam(':id_expediteur',$idSender,PDO::PARAM_STR);
        $statement->bindParam(':msg', $encryptedData,PDO::PARAM_STR);
        $statement->bindParam(':files',$encryptedFiles,PDO::PARAM_STR);
        $statement->bindParam(':images', $encryptedImages,PDO::PARAM_STR);
        $statement->bindParam(':isPrivate',$isPrivate,PDO::PARAM_INT);
        $statement->bindParam(':isPublic',$isPublic,PDO::PARAM_INT);
        $statement->bindParam(':isRead',$isRead,PDO::PARAM_INT);
        $statement->bindParam(':iv',$iv);
        $isSuccess=$statement->execute();
        $max_id=1;
        if($isSuccess){
            //TODO: send notification
            $allFanIdInTribuG=$this->getAllFanInTribuT($tribu_t);
            $userSender= $userRepository->find(intval($idSender));
            $firstnameUserSendNotification  = $userService->getUserFirstName($userSender->getId());
            $lastnameUserSendNotification  = $userService->getUserLastName($userSender->getId());
            $content=$lastnameUserSendNotification." ".$firstnameUserSendNotification.
            " a envoyé un message dans la discussion générale ".$tribu_t; 
            foreach ($allFanIdInTribuG as $user_id) {
                $user= $userRepository->find(intval($user_id["user_id"]));
                $idUserReceivedNotification = $user->getId();
                if($idSender != $idUserReceivedNotification ){
                    $emailUserReceivedNotification = $user->getEmail();
                    $firstnameUserReceivedNotification  = $userService->getUserFirstName($user->getId());
                    $lastnameUserReceivedNotification  = $userService->getUserLastName($user->getId());
                    $link="/user/tribu/msg?name=".$tribu_t."&type=t";
                    //$content.=";". $link;
                    $notificationService->sendNotificationForOne(intval($idSender), intval($idUserReceivedNotification),
                    $link,$content,$link);
                }
               
                
            }
            //i will use sendNotificationForOne in notificationService

            $max_id = $this->getPDO()->prepare("SELECT max(id_msg) as last_id_message FROM  ". $tableMessageName );
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
    public function getMessageGRP($tribu_T){
        $tableMessageName=$tribu_T."_msg_grp";

        $sql="SELECT t1.id_msg, t1.id_expediteur, t1.msg, ". 
        "t1.files, t1.images, t1.isPrivate, t1.isPublic, t1.isRead, t1.date_message_created,". 
        " t2.id, t2.user_id, t2.firstname, t2.lastname, t2.photo_profil". " FROM " .$tableMessageName.
        " as t1 LEFT JOIN consumer as t2 ON t1.id_expediteur=t2.user_id ORDER BY t1.date_message_created ASC ";
        $statement = $this->getPDO()->prepare($sql);
        $statement->execute();
        $results = $statement->fetchAll(PDO::FETCH_ASSOC);

        return $results;
    }

     /**
     * @author cette fonction recupéré le vecteur d'initialisation pour le décryptage des message
     * @return any[]
     */
    public function getIv($tribu_T,$id){
        $tableMessageName=$tribu_T."_msg_grp";

        $sql="SELECT iv FROM " . $tableMessageName . " where id_msg= ".$id;
        $statement = $this->getPDO()->prepare($sql);
        $statement->execute();
        $results = $statement->fetchAll(PDO::FETCH_ASSOC);

        return $results;
        
    }

    /** cette fonction retourne les id des fan dans une tribu T
     * @author faniry
     * @param string $tribuName nom de la tribu T où on veut récupéré les id
     * @return string[]
     */
    public function getAllFanInTribuT($tribuName){
        $statement = $this->getPDO()->prepare('SELECT DISTINCT user_id FROM ' . $tribuName);

        $statement->execute();

        return $statement->fetchAll(PDO::FETCH_ASSOC);

    }
    
   

}
