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

                email VARCHAR(255) NULL,

                table_parent VARCHAR(300) NULL DEFAULT NULL,

                state_table_parent INT(11) NULL DEFAULT NULL,

                livel_parent int(11) NOT NULL DEFAULT 0
				
				)ENGINE=InnoDB";

            $this->getPDO()->exec($sql);

            $data = "Insert into tribu_t_" . $user_id . "_" . $tableName . " (id, user_id, roles, status) values (UUID(), $user_id, 'Fondateur', 1)";



            $final = $this->getPDO()->exec($data);



            if ($final > 0) {

                $output = "tribu_t_" . $user_id . "_" . $tableName;

                $query = "CREATE TABLE IF NOT EXISTS " . $output . "_publication(

                    id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT, 

                    user_id int(11) NOT NULL,

                    publication TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,

                    confidentiality TINYINT(1) NOT NULL,

                    photo VARCHAR(250),

                    userfullname VARCHAR(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'inconnu',

                    datetime timestamp NOT NULL DEFAULT current_timestamp(),

                    isAlbum TINYINT(1) NOT NULL DEFAULT 0,

                    FOREIGN KEY(user_id) REFERENCES user(id)

                    ON DELETE CASCADE

                    ON UPDATE CASCADE

                    )ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci";



                $final2 = $this->getPDO()->exec($query);



                if ($final2 == 0) {

                    $query_table_invitation = "CREATE TABLE IF NOT EXISTS " . $output . "_invitation(
                        id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
                        user_id int(11) DEFAULT NULL,
                        sender_id int(11) DEFAULT NULL,
                        email varchar(255) NOT NULL,
                        is_valid tinyint(1) NOT NULL DEFAULT 0,
                        datetime DATETIME NOT NULL DEFAULT current_timestamp()
                      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci";

                    $this->getPDO()->exec($query_table_invitation);

                    $sql = "CREATE TABLE IF NOT EXISTS " . $output . "_commentaire(

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




                    $sql = "CREATE TABLE IF NOT EXISTS " . $output . "_reaction(

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

                        isAlbum TINYINT(1) NOT NULL DEFAULT 0,

                        FOREIGN KEY (user_id) REFERENCES user (id)

                        ON DELETE CASCADE 

                        ON UPDATE CASCADE

                      ) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci";


                    $this->getPDO()->exec($sqlCreateTableImpImg);

                    
                    $sql = "CREATE TABLE IF NOT EXISTS " . $output . "_agenda(

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


                    $sql = "CREATE TABLE IF NOT EXISTS " . $output . "_agenda_action(

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


                    //creation table nom album
                    $sqlCreateTableAlbum = " CREATE TABLE IF NOT EXISTS " . $output . "_album(

                        id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,

                        name_album varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,

                        datetime datetime NOT NULL DEFAULT current_timestamp()

                      ) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci";


                    $this->getPDO()->exec($sqlCreateTableAlbum);

                    //creation table path album
                    $sqlCreateTablePathAlbum = " CREATE TABLE IF NOT EXISTS " . $output . "_album_path(

                        id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,

                        path varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,

    					album_id int(11) NOT NULL,

    					FOREIGN KEY (album_id) REFERENCES " . $output . "_album(id)

                      ) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci";

                    $this->getPDO()->exec($sqlCreateTablePathAlbum);


                    $this->addListTribuT($output, $user_id);
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

        $statement = $this->getPDO()->prepare("SELECT  DISTINCT(user_id), roles FROM $table WHERE status = 1");

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
    function setTribuT(
        $tribu_T_name_table, 
        $description, 
        $path, 
        $extension, 
        $userId, 
        $tribu_t_owned_or_join, 
        $nomTribuT)
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

/**
     * @author faniry
     */
    function getTribuTInfoV2($userId,$tribuTName){
        $sql="SELECT *,tribu.roles as tribu_t_roles FROM ". 
        $tribuTName ." as tribu LEFT JOIN user as u ON u.id=:user_id ";
        $exec = $this->getPDO()->prepare($sql);
        $exec->bindParam("user_id",$userId,PDO::PARAM_INT);
        $exec->execute();
        return $exec->fetch(PDO::FETCH_ASSOC);

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

    public function getUser($userId){
        $statement = $this->getPDO()->prepare("SELECT id, email, pseudo FROM user WHERE id  = $userId");
        $statement->execute();
        $result = $statement->fetch(PDO::FETCH_ASSOC);
        return $result;
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



    public function testSiMembre($table, $user_id,$email="")

    {
        if($user_id){
            $statement = $this->getPDO()->prepare("SELECT id, status FROM $table WHERE user_id = :user_id");
            $id=intval($user_id);
            $statement->bindParam(':user_id', $id,PDO::PARAM_INT);

        }else{
            $statement = $this->getPDO()->prepare("SELECT id, status FROM $table WHERE email = :email");
            $statement->bindParam(':email', $email,PDO::PARAM_STR);
        }

        
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

    public function getAllRestoPastiledForAllTable($id, $data = [])
    {
        $results = [];
        
        $all_tribuT = count($data) > 0 ? $data : $this->showTribuT($id, "_restaurant");
        
        if(count($data) > 0){
            foreach ($all_tribuT as $trib) {
                $tableResto = $trib["table_name"] . "_restaurant";
                if ($this->hasTableResto($tableResto)) {
                    $statement = $this->getPDO()->prepare("SELECT id, id_resto,denomination_f as name FROM $tableResto WHERE isPastilled = 1;");
                    $statement->execute();
                    $restos = $statement->fetchAll(PDO::FETCH_ASSOC);
    
                    $results = array_merge($results, $restos);
                }
            }
        }else{
        foreach ($all_tribuT as $trib) {
            if ($this->hasTableResto($trib[0])) {
                $statement = $this->getPDO()->prepare("SELECT id, id_resto,denomination_f as name FROM $trib[0]  WHERE isPastilled = 1;");
                $statement->execute();
                $restos = $statement->fetchAll(PDO::FETCH_ASSOC);

                $results = array_merge($results, $restos);
            }
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

    public function getPartisantPublication($table_publication_Tribu_T, $table_commentaire_Tribu_T,$idMin,$limits, $userId, $confidentialityService, $userService){
        $resultF=[];
        $regex = "/\_publication+$/";

        $tableReaction = preg_replace($regex, "_reaction", $table_publication_Tribu_T);
  
        if($idMin == 0){
            //id,user_id,confidentiality,photo,userfullname,datetime, publication 
            //t1.user_id IS NOT NULL AND
             $sql = "SELECT * FROM (SELECT * FROM $table_publication_Tribu_T as t1 LEFT JOIN (SELECT pub_id ,count(*)".
            " as nbr FROM $table_commentaire_Tribu_T group by pub_id ) as t2 on t1.id = t2.pub_id WHERE". 
            "  t1.user_id IS NOT NULL ORDER BY t1.id DESC LIMIT :limits) as tb1 " .
            " LEFT JOIN (SELECT GROUP_CONCAT(user_id) user_react_list, user_id as user_id_react, pub_id as pub_id_react, count(*) as nbr_reaction,". 
            " reaction FROM $tableReaction WHERE reaction = 1 group by pub_id_react) as tb2 on tb1.id = tb2.pub_id_react"
            ;
            // and tb2.user_id_react = $userId
            // $sql = "SELECT * FROM (SELECT * FROM $table_publication_Tribu_T as t1 LEFT JOIN(SELECT pub_id ,count(*)".
            // " as nbr FROM $table_commentaire_Tribu_T group by pub_id ) as t2 on t1.id=t2.pub_id".  
            // " ORDER BY t1.id DESC LIMIT :limits) as tb1 " .
            // " LEFT JOIN (SELECT user_id as user_id_react, pub_id as pub_id_react,". 
            // " reaction FROM $tableReaction) as tb2 on tb1.id = tb2.pub_id_react and tb2.user_id_react = $userId"
            // ;
           
            $stmt = $this->getPDO()->prepare($sql);
            $stmt->bindValue(':limits', $limits, PDO::PARAM_INT);
            $stmt->execute();
            $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

            
        }else{
            // $sql = "SELECT * FROM (SELECT * FROM $table_publication_Tribu_T  as t1 LEFT JOIN(SELECT pub_id ,count(*)".
            // " as nbr FROM $table_commentaire_Tribu_T  group by pub_id ) as t2 on t1.id=t2.pub_id and t1.id <". 
            // " :idmin ORDER BY id DESC LIMIT :limits) as tb1 " .
            // " LEFT JOIN (SELECT user_id as user_id_react, pub_id as pub_id_react, reaction ". 
            // " FROM $tableReaction) as tb2 on tb1.id = tb2.pub_id_react and tb2.user_id_react = $userId";
            // and tb2.user_id_react = $userId
             $sql = "SELECT * FROM (SELECT * FROM $table_publication_Tribu_T  as t1 LEFT JOIN(SELECT pub_id ,count(*)".
            " as nbr FROM $table_commentaire_Tribu_T  group by pub_id ) as t2 on t1.id=t2.pub_id where t1.id < :idmin and t1.user_id is NOT NULL  ORDER BY id DESC LIMIT :limits) as tb1" .
            " LEFT JOIN (SELECT GROUP_CONCAT(user_id) user_react_list, user_id as user_id_react, pub_id as pub_id_react, count(*)".
			" as nbr_reaction, reaction FROM $tableReaction WHERE reaction = 1 group by pub_id_react) as tb2 on tb1.id = tb2.pub_id_react";
            $stmt = $this->getPDO()->prepare($sql);
            $stmt->bindValue(':idmin', $idMin, PDO::PARAM_INT); 
            $stmt->bindValue(':limits', $limits, PDO::PARAM_INT); 
            $stmt->execute();
            $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
           
        }

        foreach($results as $result){
            $userSentPub=$result['user_id'];
            $pseudo = $confidentialityService->getConfFullname(intval($userSentPub), $userId);
            $statement_photos = $this->getPDO()->prepare("SELECT photo_profil,firstname,lastname FROM (SELECT photo_profil, user_id,firstname,lastname FROM consumer union SELECT photo_profil, user_id,firstname,lastname FROM supplier) as tab WHERE tab.user_id = $userSentPub");
            $statement_photos->execute();
            $user_profil = $statement_photos->fetch(PDO::FETCH_ASSOC);
            $result["publication"]=json_decode($result["publication"],true);
            $result["publication"] = $this->convertUnicodeToUtf8($result["publication"]);
            $result["publication"]=mb_convert_encoding($result["publication"], 'UTF-8', 'UTF-8');
            $result["user_profil"]=$user_profil;
            $result["userfullname"] = $pseudo;
            array_push($resultF,$result);
        }
        return $resultF;
    }

    /**
     * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
     * 
     */
    public function getPartisantPublicationUpdate($table_publication_Tribu_T, $table_commentaire_Tribu_T,$idMin,$limits, $userId, $confidentialityService, $userService){
        $resultF=[];
        $regex = "/\_publication+$/";

        $tableReaction = preg_replace($regex, "_reaction", $table_publication_Tribu_T);
        $table_tribu_T = preg_replace($regex, "", $table_publication_Tribu_T);

        $all_table_parent= $this->getTableParent($table_tribu_T);

        $sql="SELECT *, '$table_tribu_T' as 'table_name' FROM (
                SELECT * FROM $table_publication_Tribu_T AS t1
                LEFT JOIN (
                    SELECT pub_id, count(*) AS nbr FROM $table_commentaire_Tribu_T GROUP BY  pub_id
                ) AS t2 ON t1.id = t2.pub_id WHERE t1.user_id IS NOT NULL ORDER BY t1.id DESC
            ) AS tb1 LEFT JOIN (
                SELECT GROUP_CONCAT(user_id) user_react_list, user_id AS user_id_react, pub_id AS pub_id_react, COUNT(*) AS nbr_reaction, reaction FROM $tableReaction
                WHERE reaction = 1 GROUP BY pub_id_react 
        ) AS tb2 ON tb1.id = tb2.pub_id_react";

        if( count($all_table_parent) > 0 ){
            foreach($all_table_parent as $table_parent){
                $table_parent_publication = $table_parent . "_publication";
                $table_parent_commentaire = $table_parent . "_commentaire";
                $table_parent_reaction= $table_parent . "_reaction";

                $union_sql ="SELECT *, '$table_parent' as 'table_name' FROM (
                    SELECT * FROM $table_parent_publication AS t1
                        LEFT JOIN (
                            SELECT pub_id, count(*) AS nbr FROM $table_parent_commentaire GROUP BY  pub_id
                        ) AS t2 ON t1.id = t2.pub_id WHERE t1.user_id IS NOT NULL ORDER BY t1.id DESC
                    ) AS tb1 LEFT JOIN (
                        SELECT GROUP_CONCAT(user_id) user_react_list, user_id AS user_id_react, pub_id AS pub_id_react, COUNT(*) AS nbr_reaction, reaction FROM $table_parent_reaction
                        WHERE reaction = 1 GROUP BY pub_id_react 
                ) AS tb2 ON tb1.id = tb2.pub_id_react";

                $sql = "$sql UNION $union_sql";
            }
        }

        $sql = "SELECT * FROM ( $sql) AS table_final ORDER BY table_final.datetime DESC LIMIT :limits OFFSET :offsets";

        $stmt = $this->getPDO()->prepare($sql);

        $offsets= intval($idMin) * 3;

        $stmt->bindValue(':limits', $limits, PDO::PARAM_INT);
        $stmt->bindValue(':offsets', $offsets, PDO::PARAM_INT);
        $stmt->execute();
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        foreach($results as $result){
            $userSentPub=$result['user_id'];
            $pseudo = $confidentialityService->getConfFullname(intval($userSentPub), $userId);
            $statement_photos = $this->getPDO()->prepare("SELECT photo_profil,firstname,lastname FROM (SELECT photo_profil, user_id,firstname,lastname FROM consumer union SELECT photo_profil, user_id,firstname,lastname FROM supplier) as tab WHERE tab.user_id = $userSentPub");
            $statement_photos->execute();
            $user_profil = $statement_photos->fetch(PDO::FETCH_ASSOC);
            $result["publication"]=json_decode($result["publication"],true);
            $result["publication"] = $this->convertUnicodeToUtf8($result["publication"]);
            $result["publication"]=mb_convert_encoding($result["publication"], 'UTF-8', 'UTF-8');
            $result["user_profil"]=$user_profil;
            $result["tribu_apropos"]= $this->getAproposUpdate($result["table_name"]);
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

        $sql = "SELECT * FROM $tableTribuT as t1   left join (" .
            "SELECT id,type, case type when 'consumer' THEN (SELECT JSON_OBJECT('id',id,'user_id',user_id,'firstName',firstname,'lastName'," .
            "lastname,'photo_profil',photo_profil,'tribuG',tributg,'email',email) as infos FROM consumer as c where c.user_id= u.id)" .
            "when 'supplier' THEN (SELECT JSON_OBJECT('id',id,'user_id',user_id,'firstName',firstname,'lastName', lastname," .
            "'photo_profil',photo_profil,'tribuG',tributg,'email',email)as infos FROM supplier as c where c.user_id= u.id)" .
            "end infos_profil from user as u ) as t2 on t2.id=t1.user_id WHERE t1.status = 1 and t1.user_id IS NOT NULL GROUP BY t1.user_id";
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
    public function getAllTribuT($userID= null)
    {

        $results = array();
        $tab_not_like = ['%agenda%', '%commentaire%', '%publication%', '%reaction%', '%restaurant%', '%album%', ];

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
                        'fondateurId' => $id
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
                    'fondateurId' => $id
                ];
            }
        }

        return $apropos;
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
    public function getAproposUpdate($table_name)
    {
        if (!$this->isTableExist($table_name)) {
            return false;
        }
        
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
                if (strtolower($trib['name']) === strtolower($table_name)) {
                    $apropos = [
                        'name' => $trib['name_tribu_t_muable'],
                        'description' => $trib['description'],
                        'avatar' => $trib['logo_path'],
                        'fondateurId' => $id
                    ];

                    return $apropos;
                }
            }
        } else {
            //"Tribu T " . ucfirst(explode("_",$object['tribu_t']['name_tribu_t_muable'])[count(explode("_",$object['tribu_t']['name_tribu_t_muable']))-1])
            if (strtolower($object['tribu_t']['name']) === strtolower($table_name)) {
                $apropos = [
                    'name' =>  $object['tribu_t']['name_tribu_t_muable'],
                    'description' => $object['tribu_t']['description'],
                    'avatar' => $object['tribu_t']['logo_path'],
                    'fondateurId' => $id
                ];

                return $apropos;
            }

        }

        return false;

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

                $description=json_decode($d_pub["publication"],true);
                $description=$this->convertUnicodeToUtf8($description);
                $description=mb_convert_encoding($description, 'UTF-8', 'UTF-8');
                $data = [
                    "userOwnPub" => [
                        "id" => $d_pub["user_id"],
                        "profil" => $photo_profil["photo_profil"],
                        "fullName" => $d_pub["userfullname"],
                    ],

                    "publication" => [
                        "id" => $d_pub["id"],
                        "confidentiality" => $d_pub['confidentiality'],
                        "description" => $description,
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
                        "createdAt" => $d_pub["datetime"],
                        "id" => $d_pub["id"],
                        "isAlbum" => $d_pub["isAlbum"]
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
        $sql = "SELECT id , path , datetime, isAlbum FROM " . str_replace("_publication", "_imp_img", $table_name);
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
    function saveInvitationStory($table_invitation, $user_id, $email,$isverified=0, $sender_id)
    {

        $sql = "SELECT count(*) as is_invited FROM $table_invitation WHERE email = :email ";

        $stmt = $this->getPDO()->prepare($sql);

        $stmt->bindParam(':email', $email);

        $stmt->execute();

        $is_invited = $stmt->fetch(PDO::FETCH_ASSOC)['is_invited'];

        if ($is_invited <= 0) {

            $statement = $this->getPDO()->prepare("INSERT INTO $table_invitation (user_id, email,is_valid,sender_id) values (:user_id, :email, :is_valid, :sender_id)");

            //$userfullname = $user_id ?  $this->getFullName($user_id) : '';

            $statement->bindParam(':user_id', $user_id);

            $statement->bindParam(':email', $email);

            $statement->bindParam(':is_valid', $isverified);

            $statement->bindParam(':sender_id', $sender_id);

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

        $sql = "SELECT $table_invitation.id as id, $table_invitation.sender_id as sender_id, user.id as user_id, is_valid, $table_invitation " . ".email, datetime FROM $table_invitation LEFT JOIN user ON $table_invitation" . ".email = user.email ORDER BY id DESC";

        $stmt = $this->getPDO()->prepare($sql);

        $stmt->execute();

        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return $result;
    }

    /**
     * @author Elie <eliefenohasina@gmail.com>
     * @Fonction mise à jour de l'historique de l'invitation dans la tribu T
     */
    function updateInvitationStory($table_invitation, $is_valid, $email,$id)
    {

        $sql = "UPDATE $table_invitation 
        SET is_valid = :is_valid, user_id = :user_id
         WHERE email = :email";

        $stmt = $this->getPDO()->prepare($sql);

        $stmt->bindParam(":is_valid", $is_valid);
        $stmt->bindParam(":user_id", $id);
        $stmt->bindParam(":email", $email);

        $stmt->execute();
    }

    /**
     * @author Elie <eliefenohasina@gmail.com>
     * @Fonction suppression de l'historique de l'invitation dans la tribu T
     */
    function deleteInvitationStory($table_invitation, $id)
    {

        $sql = "DELETE FROM $table_invitation WHERE id = :id";

        $stmt = $this->getPDO()->prepare($sql);

        $stmt->bindParam(":id", $id);

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
        $statement = $this->getPDO()->prepare('SELECT DISTINCT user_id FROM ' . $tribuName. ' WHERE status=1');

        $statement->execute();

        return $statement->fetchAll(PDO::FETCH_ASSOC);

    }
    

    /**
     * @author Elie
     *Fetch de toutes les reaction d'un seul publication dans un tribu*/
    public function findAllReactions($table, $publication_id)

    {

        $statement = $this->getPDO()->prepare("SELECT usr.user_id as user_id, concat(firstname,' ', lastname) as userfullname, photo_profil, pub_id FROM $table 
        INNER JOIN (SELECT user_id, firstname, lastname, photo_profil FROM consumer 
        UNION SELECT user_id, firstname, lastname, photo_profil FROM supplier) as usr ON $table.user_id = usr.user_id WHERE pub_id = $publication_id and reaction = 1");

        $statement->execute();

        $result = $statement->fetchAll(PDO::FETCH_ASSOC);

        return $result;
    }
   
    function getProfilTributT($tableName, $userId, $userRepository ){
        $statement = $this->getPDO()->prepare("SELECT * FROM $tableName WHERE user_id = $userId LIMIT 1");
        $statement->execute();
        $data = $statement->fetch(PDO::FETCH_ASSOC);

        $detailsTribuT= $userRepository->getDetailsTribuT($tableName);

        $result = [
            "id" => $data['id'],
            "user_id" => $data['user_id'],
            "roles" => $data["roles"],
            "name" => $detailsTribuT['name_tribu_t_muable'],
            "description" => $detailsTribuT['description'],
            "avatar" => $detailsTribuT['logo_path'],
            "datetime" => $detailsTribuT['datetime'],
            "table_name" => $tableName
        ];
        return $result;
    }
    
/**
     * @author Tomm
     * creation du nom album tribu T 
     */
    public function createAlbum($table, $nameAlbum)
    {
        $detectSql = "SELECT * FROM " . $table . "_album WHERE name_album = '" . $nameAlbum ."'";
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
        }else{
            return false;
        }
    }

    /**
     * @author Tomm
     * select du nom album tribu T 
     */
    public function getAlbum($table)
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
    public function copyePathAlbum($table, $path, $albumId){
        $sql = "INSERT INTO " . $table . "_album_path (path, album_id) VALUES (:path,:album_id)";
        $statement = $this->getPDO()->prepare($sql);
        $statement->bindParam(':path', $path, PDO::PARAM_STR);
        $statement->bindParam(':album_id', $albumId, PDO::PARAM_STR);
        $statement->execute();
    }

    /**
     * @author Tomm
     * get le path album tribu T 
     */
    public function getCopyePathAlbum($table)
    {
        $sql = "SELECT id, path, album_id FROM " . $table . "_album_path";
        $statement = $this->getPDO()->prepare($sql);
        $statement->execute();
        $result = $statement->fetchAll(PDO::FETCH_ASSOC);

        return $result;
    }

    /**
     * @author Tomm
     * modifie le isAlbum du publication
     */
    public function modifIsAlbumPublication($tableName, $id)
    {
        $query = "UPDATE $tableName" . "_publication" . " set isAlbum = " . 1 . " WHERE id = " . $id;

        $stmt = $this->getPDO()->prepare($query);

        $stmt->execute([]);
    }

    /**
     * @author Tomm
     * modifie le isAlbum du inport
     */
    public function modifIsAlbumImpImg($tableName, $id)
    {
        $query = "UPDATE $tableName" . "_imp_img" . " set isAlbum = " . 1 . " WHERE id = " . $id;

        $stmt = $this->getPDO()->prepare($query);

        $stmt->execute([]);
    }

    /**
     * @author Nantenaina a ne pas contacté pendant les congés
     * où: on utilise cette fonction dans la rubrique resto et tous carte cmz,
     * localisation du fichier: dans Tribu_T_Service.php,
     * je veux: vérifier si une tribu T existe ou non
     * @param int $user_id : identifiant de l'utilisateur connecté
     * @param string $suffixe : suffixe de la table Tribu T 
    */
    public function checkIfDefaultTribuTExist($user_id, $suffixe)

    {

        $db = $_ENV["DATABASENAME"];

        $query = "SHOW TABLES FROM $db like 'tribu_t_" . $user_id . "_" . $suffixe . "'";

        $sql = $this->getPDO()->query($query);

        $rowsNumber = $sql->rowCount();

        return $rowsNumber;

    }
     /** 
    *@author faniry 
    *Recupère la liste des postulants dans une tribu thèmatique donnée
    *@param String $name nom de la tribu Thèmatique 
    *@return array
    */ 
    public function getPostulant(String $name){
        //SELECT * FROM tribu_t_28_lenfer as t1 LEFT JOIN `user` ON (user.email = t1.email COLLATE utf8mb4_unicode_ci) WHERE t1.user_id is NULL;
        $query="SELECT t1.email as t1email, t1.status as t1status, user.id as userId, user.type, user.email useremail,". 
        " user.pseudo FROM ".$name. " as t1 LEFT JOIN  `user` ON".
        " (user.email = t1.email COLLATE utf8mb4_unicode_ci) WHERE user.type=\"type\"";
        $statement = $this->getPDO()->prepare($query);
        $statement->execute();
        return $statement->fetchAll(PDO::FETCH_ASSOC);
    }
    /** 
    *@author faniry 
    *Recupère la liste des postulants dans une tribu thèmatique donnée
    *@param String $name nom de la tribu Thèmatique 
    *@return array
    */ 
    public function getPostulantNotInvited(){
        //SELECT * FROM tribu_t_28_lenfer as t1 LEFT JOIN `user` ON (user.email = t1.email COLLATE utf8mb4_unicode_ci) WHERE t1.user_id is NULL;
        $query="SELECT * FROM `user` WHERE type=\"type\"";
        $statement = $this->getPDO()->prepare($query);
        $statement->execute();
        return $statement->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * @author Elie
     * Ajout colonne dans la table tribu T invitaion
     */
    public function addColumnInTableInvitation($tableName, $column_name)
    {

        $query = "SHOW COLUMNS FROM $tableName LIKE '$column_name' ";

        $stmt = $this->getPDO()->query($query);
        
        if($stmt->rowCount() <= 0) { 

            $alter = "ALTER TABLE $tableName ADD $column_name INT(11) NULL AFTER user_id ";

            $this->getPDO()->query($alter); 

            // echo "Added $column_name";
        }
    }
    /**
     * @author Nantenaina
     * Où : On utilise cette fonction pour la création d'une table de parrainage
     * Localisation du fichier : Tribu_T_Service.php
     * Je veux : créer une table de parrainage
     * @param int $userId : identifiant de l'utilisateur connecté
     */
    public function createParrainageTable($userId){
        $tableParrainage = "tableparrainage_".$userId;
        $sql= "CREATE TABLE IF NOT EXISTS ". $tableParrainage .
            "( `id` int(11) AUTO_INCREMENT PRIMARY KEY  NOT NULL,".
            "`user_id` int(11) NOT NULL,".
            "`tribu` TEXT NOT NULL,".
            "`isParent` tinyint(1) NOT NULL DEFAULT 0,".
            "`status` tinyint(1) NOT NULL DEFAULT 0,".
            "`dateSauvegarde` datetime NOT NULL DEFAULT current_timestamp()".
           " ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci";
        $stmt = $this->getPDO()->prepare($sql);
        $stmt->execute();
    }

    /**
     * @author Nantenaina
     * Où : On utilise cette fonction pour vérifier si une tribu T existe dans la colonne tribu_t_owned ou tribu_t_joined de la table user
     * Localisation du fichier : Tribu_T_Service.php
     * Je veux : tester l'existence d'une tribu T dans la colonne tribu_t_owned ou tribu_t_joined de la table user
     * @param string $tribu_T_name_table : nom de la table tribu T
     * @param int $userId : identifiant de l'utilisateur connecté
     * @param string $tribu_t_owned_or_join : tribu_t_owned ou tribu_t_joined
     */
    function checkIfTribuTExist($tribu_T_name_table, $userId, $tribu_t_owned_or_join)

    {

        $tribu_T_name_table = strtolower($tribu_T_name_table);

        $fetch = $this->getPDO()->prepare("SELECT $tribu_t_owned_or_join FROM user WHERE id  = $userId");

        $fetch->execute();

        $result = $fetch->fetch(PDO::FETCH_ASSOC);

        $list = $result[$tribu_t_owned_or_join];

        $isExiste = false;

        if (isset($list)) {

            $jsonInitial = json_decode($list, true);

            $array1 = $jsonInitial["tribu_t"];

            if (array_key_exists("name", $array1)) {
                $table = strtolower($array1["name"]);
                if ($tribu_T_name_table == $table) {
                    $isExiste = true;
                }
            } else {
                for ($i = 0; $i < count($array1); $i++) {

                    $table = strtolower($array1[$i]["name"]);

                    if ($tribu_T_name_table == $table) {
                        $isExiste = true;
                    }
                }
            }

        }
        return $isExiste;
    }
/**
     * @author TOMMY
     */
    public function isNotExistsAlbum($output){

        //creation table nom album
       
        $count1=$this->showTableTribu($output."_album");

        if($count1 == 0 ){
            $sqlCreateTableAlbum = " CREATE TABLE IF NOT EXISTS " . $output . "_album(

                id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,

                name_album varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,

                datetime datetime NOT NULL DEFAULT current_timestamp()

              ) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci";


            $this->getPDO()->exec($sqlCreateTableAlbum);
        }
        $count2=$this->showTableTribu($output."_album_path");
        if($count2 == 0){
             //creation table path album
            $sqlCreateTablePathAlbum = " CREATE TABLE IF NOT EXISTS " . $output . "_album_path(

                id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,

                path varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,

                album_id int(11) NOT NULL,

                FOREIGN KEY (album_id) REFERENCES " . $output . "_album(id)

            ) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci";

            $this->getPDO()->exec($sqlCreateTablePathAlbum);
        }


       
    }

     /**
     * @author TOMMY
     */
    public function createTableAlbumNotExists($list){ 
    

        if (isset($list)) {

            $jsonInitial =  $list;

            $array1 = $jsonInitial["tribu_t"];

            if (array_key_exists("name", $array1)) {
                $table = $array1["name"];
                $this->isNotExistsAlbum($table);
            } else {
                for ($i = 0; $i < count($array1); $i++) {

                    $table =$array1[$i]["name"];

                    $this->isNotExistsAlbum($table);
                }
            }

        }
    }


    public function addListTribuT($new_table_tribu_t_name, $user_id){
        $tribu_t_list= "tribu_t_list";

        $request_tribu_t_list = $this->getPDO()->prepare(
            "INSERT INTO $tribu_t_list (table_name, user_id, datetime)  VALUES (:table_name, :user_id, :datetime )"
        );

        $datetime = new \DateTime();
        $datetime = $datetime->format('Y-m-d H:i:s');
        
        $request_tribu_t_list->bindParam(':table_name', $new_table_tribu_t_name, PDO::PARAM_STR);
        $request_tribu_t_list->bindParam(':user_id', $user_id);
        $request_tribu_t_list->bindParam(':datetime', $datetime, PDO::PARAM_STR);

        $request_tribu_t_list->execute();
    }

    /**
     * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
     * 
     * Goal: Create table sub tribu T: eg: tribu_t_1_mon_tribu_t_list_sub 
     * Use in: TribuTController.php
     * 
     * @param {string} $tribu_name: name of the table parent.
     * 
     * @return void
     */
    public function createTableSousTribu($tribu_name){
        $table_sub_tribu= $tribu_name . "_list_sub";

         //// create table sub tribu
        $sql = "CREATE TABLE IF NOT EXISTS " . $table_sub_tribu . " ( 
                id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(300) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
                status int(11) NOT NULL DEFAULT 0,
                datetime timestamp NOT NULL DEFAULT current_timestamp()
            )ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci";

        $request_sub_tribu = $this->getPDO()->prepare($sql);
        $request_sub_tribu->execute();
    }

    /**
     * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
     * 
     * Goal: Save the sub_tribu into their parent.
     * Use in: TribuTController.php
     * 
     * @param {string} $table_parent: name of the table parent.
     * @param {string} $table_fils: name of the table fils.
     * 
     * @return void
     */
    public function updateParentTribuT($table_parent, $table_fils){
        $table_sub_tribu= $table_parent . "_list_sub";

        if (!$this->isTableExist($table_sub_tribu)) {
            $this->createTableSousTribu($table_parent);
        }

        $request_sub_tribu = $this->getPDO()->prepare(
            "INSERT INTO $table_sub_tribu (name, status, datetime) 
            VALUES (:name, :status, :datetime)"
        );

        $name= $table_fils;
        $status= 1; /// already accepted.
        $datetime = new \DateTime();
        $datetime = $datetime->format('Y-m-d H:i:s');

        $request_sub_tribu->bindParam(':name', $name);
        $request_sub_tribu->bindParam(':status', $status);
        $request_sub_tribu->bindParam(':datetime', $datetime);

        $request_sub_tribu->execute();
    }

    /**
     * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
     * 
     * Goal: Update table tribu_t already exist to add new collumns 'table_parent'
     * 
     * @param string $table_tribu: name of table tribu T
     * 
     * @return void
     */
    public function updateTableTribuAddCullumnTableParent($table_tribu){

        if( $this->isColumnExist($table_tribu, "table_parent")) return;

        $sql= "ALTER TABLE $table_tribu ADD table_parent VARCHAR(300) NULL DEFAULT NULL";

        $request_add_collumn_table_parent = $this->getPDO()->prepare($sql);
        $request_add_collumn_table_parent->execute();
    }

    /**
     * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
     * 
     * Goal: Update table tribu_t already exist to add new collumns 'state_table_parent'
     * 
     * @param string $table_tribu: name of table tribu T
     * 
     * @return void
     */
    public function updateTableTribuAddCullumnStateTableParent($table_tribu){

        if( $this->isColumnExist($table_tribu, "state_table_parent")) return;

        $sql= "ALTER TABLE $table_tribu ADD state_table_parent INT(11) NULL DEFAULT NULL";

        $request_add_collumn_table_parent = $this->getPDO()->prepare($sql);
        $request_add_collumn_table_parent->execute();
    }

    /**
     * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
     * 
     * Goal: Update table tribu_t already exist to add new collumns 'livel_parent'
     * 
     * @param string $table_tribu: name of table tribu T
     * 
     * @return void
     */
    public function updateTableTribuAddCullumnLivelParent($table_tribu){

        if( $this->isColumnExist($table_tribu, "livel_parent")) return;
        
        $sql= "ALTER TABLE $table_tribu ADD livel_parent INT(11) NOT NULL DEFAULT 0";

        $request_add_collumn_livel_parent = $this->getPDO()->prepare($sql);
        $request_add_collumn_livel_parent->execute();
    }


    /**
     * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
     * 
     * Goal: Update Livel parent for table fils (livel_parent) : set Parent
     * 
     * @param string $table_parent: name of the table parent
     * @param string $table_fils: name of the table fils
     * 
     * @return void
     */
    public function updateTableParentLivelParent($table_parent, $table_fils){

        /// check column
        if( !$this->isColumnExist($table_parent, "table_parent") ){
            $this->updateTableTribuAddCullumnTableParent($table_parent);
        }

        if( !$this->isColumnExist($table_parent, "state_table_parent") ){
            $this->updateTableTribuAddCullumnStateTableParent($table_parent);
        }

        if( !$this->isColumnExist($table_parent, "livel_parent") ){
            $this->updateTableTribuAddCullumnLivelParent($table_parent);
        }

        if( !$this->isColumnExist($table_fils, "table_parent") ){
            $this->updateTableTribuAddCullumnTableParent($table_fils);
        }

        if( !$this->isColumnExist($table_fils, "state_table_parent") ){
            $this->updateTableTribuAddCullumnStateTableParent($table_fils);
        }


        if( !$this->isColumnExist($table_fils, "livel_parent") ){
            $this->updateTableTribuAddCullumnLivelParent($table_fils);
        }

        /// get info table parent.
        $info_table_parent= $this->getTribuTInfo($table_parent);

        $parent_table_parent= $info_table_parent["table_parent"];
        $parent_livel_parent= $info_table_parent["livel_parent"];

        /// update table fils
        $request_update_livel_parent = $this->getPDO()->prepare(
            "UPDATE $table_fils SET table_parent = :table_parent, livel_parent = :livel_parent, state_table_parent= :state_table_parent WHERE roles = :roles"
        );
        
        $livel_parent= intval($parent_livel_parent) + 1;
        $state_table_parent= 1;
        $roles = "Fondateur";

        $request_update_livel_parent->bindParam(':table_parent', $table_parent);
        $request_update_livel_parent->bindParam(':livel_parent', $livel_parent);
        $request_update_livel_parent->bindParam(':state_table_parent', $state_table_parent);
        $request_update_livel_parent->bindParam(':roles', $roles);
        $request_update_livel_parent->execute();

    }

    /**
     * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
     * 
     * Goal: Get list of the tribu fils ( sub_tribu T ) on tribu Tribut t.
     * 
     * @param string $tableTribuT: name of the table tribu Parent
     * 
     * @return array  [  [ "id" => ..., "name" => ..., "datetime" => ... ], ... ]
     */
    public function getListSousTribuT($tableTribuT){
        if (!$this->isTableExist($tableTribuT)) {
            return [];
        }

        $table_sub_tribu= $tableTribuT . "_list_sub";
        if (!$this->isTableExist($table_sub_tribu)) {
            $this->createTableSousTribu($tableTribuT); 
            return [];
        }

        $request_sub_tribu = $this->getPDO()->prepare(
            "SELECT id, name, datetime FROM $table_sub_tribu WHERE status= :status ORDER BY datetime DESC"
        );

        $status= 1;
        $request_sub_tribu->bindParam(':status', $status);
        $request_sub_tribu->execute();

        $result = $request_sub_tribu->fetchAll(PDO::FETCH_ASSOC);

        return $result;
    }

    /**
     * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
     * 
     * Goal: check if the table tribu t given with userid given is owned or joined.
     * 
     * @param string $tabletribuT: name of the table tribu T
     * @param int $userid: id of the user to check.
     * 
     * @return boolean true: owned, false: joined.
     */
    public function checkTributIsOwnedOrJoined($tabletribuT, $userId){
        if (!$this->isTableExist($tabletribuT)) {
            return false;
        }

        $statement = $this->getPDO()->prepare("SELECT user_id FROM $tabletribuT where roles = 'Fondateur'");
        $statement->execute();
        $userID_fondateurTribuT = $statement->fetch(PDO::FETCH_ASSOC);
        $userID= $userID_fondateurTribuT["user_id"];

        return intval($userId) === intval($userID);
    }

    /**
     * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
     * 
     * Goal: get all list table tribu T in database
     * Use in: TributTController.php
     * 
     * @return array [ [ 'table_name' => ...], ... ]
     */
    public function getListAllTribuT(){
        $table_list_tribuT= "tribu_t_list";

        $all_list_tribu_t = $this->getPDO()->prepare("SELECT table_name FROM $table_list_tribuT");
        $all_list_tribu_t->execute();
        $list_tribu_t = $all_list_tribu_t->fetchAll(PDO::FETCH_ASSOC);

        return $list_tribu_t;
    }

    /**
     * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
     * 
     * Goal: get all tribu T private the list of the tribu T given.
     * Use in: TributTController.php
     * 
     * @param array $all_private_table list of the private tribu T 
     * 
     * @return array [ [ 'table_name' => ...], ... ]
     */
    public function getAllTablePossibleParrainer($all_private_table ){

        $table_list_tribuT= "tribu_t_list";

        $first_private_table= $all_private_table[0];

        $sql = "SELECT table_name FROM $table_list_tribuT WHERE table_name NOT LIKE '$first_private_table'";

        if( count($all_private_table) > 1 ){
            for( $i= 1; $i < count($all_private_table); $i++ ){
                $item_private_table= $all_private_table[$i];
                $sql .= " AND table_name NOT LIKE '$item_private_table'";
            }
        }

        $all_list_tribu_t = $this->getPDO()->prepare($sql);
        $all_list_tribu_t->execute();
        $list_tribu_t = $all_list_tribu_t->fetchAll(PDO::FETCH_ASSOC);

        return $list_tribu_t;
    }

    /**
     * @author Jehovanie RAMANDRIJOEL <jehovaneiram@gmail.com>
     * 
     * Goal: Get all hierarchie table tribu from my tribu T
     * User in: TributTController.php
     * 
     * @param string $table_parent: Name of the table start.
     * 
     * @return array [] if empty otherwise list table tribu T
     */
    public function getAllUnderTableTribuT($table_parent, $memo= []){

        if( in_array($table_parent, $memo)) return [];

        $table_parent_list_sub= $table_parent . "_list_sub";
        if (!$this->isTableExist($table_parent_list_sub)) {
            $this->createTableSousTribu($table_parent);
            return [];
        }
        

        $sub_list_tribu_t = $this->getPDO()->prepare("SELECT name FROM $table_parent_list_sub");
        $sub_list_tribu_t->execute();
        $all_sub_list_tribu_t = $sub_list_tribu_t->fetchAll(PDO::FETCH_ASSOC);

        if( count($all_sub_list_tribu_t) === 0 ){
            return [];
        }

        $results= [];
        foreach($all_sub_list_tribu_t as $sub_list){
            array_push($results, strtolower($sub_list['name']));
        }

        foreach($all_sub_list_tribu_t as $sub_list){
            $result_temp= $this->getAllUnderTableTribuT($sub_list['name'], $results);
            $results= array_merge($results, $result_temp );
        }

        return $results;
    }

    /**
     * @author Jehovanie RAMANDRIJOEL <jehovanie@gmail.com>
     * 
     * Goal: Get list for all invitation sub tribu T
     * Use in: TributTController.php
     * 
     * @param string $table_parent: Table name tribu T
     * 
     * @return array vide if empty otherwise array associtive 
     *  [ [ id => ..., name => ..., status => ..., datetime => ... ], ...]
     */
    public function getInvitationParrainer($table_parent){

        $table_parent_list_sub= $table_parent . "_list_sub";
        if (!$this->isTableExist($table_parent_list_sub)) {
            $this->createTableSousTribu($table_parent);
            return [];
        }

        $sub_list_tribu_t = $this->getPDO()->prepare("SELECT id, name, status, datetime FROM $table_parent_list_sub ORDER BY datetime DESC");
        $sub_list_tribu_t->execute();
        $all_sub_list_tribu_t = $sub_list_tribu_t->fetchAll(PDO::FETCH_ASSOC);

        return $all_sub_list_tribu_t;
    }

    /**
     * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
     * 
     * Goal: Setting request for tribu Parrainer
     * 
     * @param string $tabletribuT: name of the table tribu T
     * @param int $userid: id of the user to check.
     * 
     */
    public function setRequestTribuParrainer($table_tribu_futur_parrain, $table_tribu_current){
        $table_sub_list_name_parrainer= $table_tribu_futur_parrain . "_list_sub";
        
        if (!$this->isTableExist($table_sub_list_name_parrainer)) {
            $this->createTableSousTribu($table_tribu_futur_parrain);
        }

        if(!$this->isColumnExist($table_sub_list_name_parrainer, "status")){
            $this->addColumnStatusSubTribu($table_sub_list_name_parrainer);
        }

        $statement = $this->getPDO()->prepare("SELECT name FROM $table_sub_list_name_parrainer where name= '$table_tribu_current'");
        $statement->execute();
        $table_tribu_find = $statement->fetch(PDO::FETCH_ASSOC);

        if( $table_tribu_find ){
            return false;
        }

        $statement_check_parent = $this->getPDO()->prepare("SELECT table_parent, state_table_parent FROM $table_tribu_current WHERE table_parent= :table_tribu_futur_parrain AND state_table_parent = :state_table_parent");
        
        $state_table_parent= 1;
        $statement_check_parent->bindParam(':table_tribu_futur_parrain', $table_tribu_futur_parrain);
        $statement_check_parent->bindParam(':state_table_parent', $state_table_parent);
        
        $statement_check_parent->execute();
        $check_parent = $statement_check_parent->fetch(PDO::FETCH_ASSOC);

        if( $check_parent ){
            return false;
        }

        $request_sub_tribu = $this->getPDO()->prepare(
            "INSERT INTO $table_sub_list_name_parrainer (name, status, datetime) 
            VALUES (:name, :status, :datetime)"
        );

        $status = 0;

        $datetime = new \DateTime();
        $datetime = $datetime->format('Y-m-d H:i:s');

        $request_sub_tribu->bindParam(':name', $table_tribu_current);
        $request_sub_tribu->bindParam(':status', $status);
        $request_sub_tribu->bindParam(':datetime', $datetime);

        $request_sub_tribu->execute();

        /// update table list_sub parent
        $request_set_table_parent = $this->getPDO()->prepare(
            "UPDATE $table_tribu_current SET table_parent = :table_tribu_futur_parrain, state_table_parent= :state_table_parent WHERE roles = :roles"
        );

        $roles= "Fondateur";
        $state_table_parent= 0;

        $request_set_table_parent->bindParam(':roles', $roles);
        $request_set_table_parent->bindParam(':state_table_parent', $state_table_parent);
        $request_set_table_parent->bindParam(':table_tribu_futur_parrain', $table_tribu_futur_parrain);
        $request_set_table_parent->execute();

        return true;
    }

    /**
     * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
     * 
     * Goal: Cancel request to sub tribu T
     * Use in : TributTController.php
     * 
     * @param string $table_tribu_futur_parrain: Table Name of the future parraine
     * @param string $table_tribu_current: Table name send demande
     * 
     * @return boolean false if action failed otherwise true
     */
    public function setCancelTribuParrainer($table_tribu_futur_parrain, $table_tribu_current){

        $table_sub_list_name_parrainer= $table_tribu_futur_parrain . "_list_sub";
        
        if (!$this->isTableExist($table_sub_list_name_parrainer)) {
            $this->createTableSousTribu($table_tribu_futur_parrain);
            return false;
        }

        if(!$this->isColumnExist($table_sub_list_name_parrainer, "status")){
            $this->addColumnStatusSubTribu($table_sub_list_name_parrainer);
            return false;
        }

        $statement = $this->getPDO()->prepare("SELECT name FROM $table_sub_list_name_parrainer where name= '$table_tribu_current'");
        $statement->execute();
        $table_tribu_find = $statement->fetch(PDO::FETCH_ASSOC);

        if( !$table_tribu_find ){
            return false;
        };

        $cancel_sub_tribu = $this->getPDO()->prepare(
            "DELETE FROM $table_sub_list_name_parrainer WHERE name= '$table_tribu_current'"
        );
        $cancel_sub_tribu->execute();

        /// update table list_sub parent
        $request_set_table_parent = $this->getPDO()->prepare(
            "UPDATE $table_tribu_current SET table_parent = :table_parent, state_table_parent= :state_table_parent WHERE roles= :roles"
        );

        $table_name_parent= null;
        $roles= "Fondateur";
        $state_table_parent= null;

        $request_set_table_parent->bindParam(':roles', $roles);
        $request_set_table_parent->bindParam(':state_table_parent', $state_table_parent);
        $request_set_table_parent->bindParam(':table_parent', $table_name_parent);
        $request_set_table_parent->execute();


        return true;
    }

    /**
     * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
     * 
     * Goal: Add column status for table list_sub tribu T.
     * Use in: Tribu_T_Service.php
     * 
     * @param string $table_name_parrainer: Table name '<tribu>_list_sup'
     * 
     * @return void
     */
    public function addColumnStatusSubTribu($table_name_parrainer){

        if( $this->isColumnExist($table_name_parrainer, "status")) return;

        $sql= "ALTER TABLE $table_name_parrainer ADD status INT(11)  NOT NULL DEFAULT 0";

        $request_add_collumn_status = $this->getPDO()->prepare($sql);
        $request_add_collumn_status->execute();
    }

    /**
     * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
     * 
     * Goal: Get status for one sous tribu T inside their parent
     * Use in: TributTController.php
     * 
     * @param string $table_name_parent: Name table tribu T parent
     * @param string $table_name_fils: Name  table tribu T fils
     * 
     * @return false if the parent don't have tribu T fils or not match, otherwise number
     *  -1: reject
     *   0: pedding
     *   1: accepter
     */
    public function getStatusFillieul($table_name_parent, $table_name_fils){
        $table_list_sub_parent= $table_name_parent . "_list_sub";
        
        if (!$this->isTableExist($table_list_sub_parent)) {
            $this->createTableSousTribu($table_name_parent);
        }

        if(!$this->isColumnExist($table_list_sub_parent, "status")){
            $this->addColumnStatusSubTribu($table_list_sub_parent);
        }

        $statement = $this->getPDO()->prepare("SELECT status FROM $table_list_sub_parent where name= '$table_name_fils'");
        $statement->execute();
        $status_found = $statement->fetch(PDO::FETCH_ASSOC); 

        return $status_found ? intval($status_found['status']) : false;
    }

    /**
     * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
     * 
     * Goal: Accept an invitation to tribuT fils for tribuT parent
     * Use in: TributTController.php
     * 
     * @param string $table_futur_sous_tribu: Name  table tribu T fils
     * @param string $talbe_name_parent: Name table tribu T parent
     * 
     * @return boolean false if action failed otherwise true
     */
    public function setAcceptInvitationSousTribu($table_futur_sous_tribu, $table_name_parent){
        $table_list_sub_parent= $table_name_parent . "_list_sub";
        if (!$this->isTableExist($table_list_sub_parent)) {
            $this->createTableSousTribu($table_name_parent);
            return false;
        }

        if( !$this->isColumnExist($table_futur_sous_tribu, "state_table_parent") ){
            $this->updateTableTribuAddCullumnStateTableParent($table_futur_sous_tribu);
        }

        $statement = $this->getPDO()->prepare("SELECT name, status FROM $table_list_sub_parent where name= '$table_futur_sous_tribu'");
        $statement->execute();
        $status_found = $statement->fetch(PDO::FETCH_ASSOC);

        if( !$status_found ){
            return false;
        }

        /// update table list_sub parent
        $request_accept_invitation = $this->getPDO()->prepare(
            "UPDATE $table_list_sub_parent SET status = :status WHERE name = :table_futur_sous_tribu"
        );

        $status= 1;
        $request_accept_invitation->bindParam(':status', $status);
        $request_accept_invitation->bindParam(':table_futur_sous_tribu', $table_futur_sous_tribu);
        $request_accept_invitation->execute();

        /// update table list_sub parent
        $request_set_table_parent = $this->getPDO()->prepare(
            "UPDATE $table_futur_sous_tribu SET table_parent = :table_parent, state_table_parent = :state_table_parent WHERE roles = :roles"
        );

        $roles= "Fondateur";
        $state_table_parent= 1;

        $request_set_table_parent->bindParam(':roles', $roles);
        $request_set_table_parent->bindParam(':state_table_parent', $state_table_parent);
        $request_set_table_parent->bindParam(':table_parent', $table_name_parent);
        $request_set_table_parent->execute();

        return true;
    }

    /**
     * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
     * 
     * Goal: Reject an invitation to tribuT fils for tribuT parent
     * Use in: TributTController.php
     * 
     * @param string $table_futur_sous_tribu: Name  table tribu T fils
     * @param string $talbe_name_parent: Name table tribu T parent
     * 
     * @return boolean false if action failed otherwise true
     */
    public function setRejectInvitationSousTribu($table_futur_sous_tribu, $table_name_parent){
        $table_list_sub_parent= $table_name_parent . "_list_sub";
        if (!$this->isTableExist($table_list_sub_parent)) {
            $this->createTableSousTribu($table_name_parent);
            return false;
        }

        $statement = $this->getPDO()->prepare("SELECT name, status FROM $table_list_sub_parent where name= '$table_futur_sous_tribu'");
        $statement->execute();
        $status_found = $statement->fetch(PDO::FETCH_ASSOC);

        if( !$status_found ){
            return false;
        }

        /// update table list_sub parent
        $request_accept_invitation = $this->getPDO()->prepare(
            "UPDATE $table_list_sub_parent SET status = :status WHERE name = :table_futur_sous_tribu"
        );
        $status= -1;
        $request_accept_invitation->bindParam(':status', $status);
        $request_accept_invitation->bindParam(':table_futur_sous_tribu', $table_futur_sous_tribu);
        $request_accept_invitation->execute();


        /// update table futur sous tribu
        $request_set_table_parent = $this->getPDO()->prepare(
            "UPDATE $table_futur_sous_tribu SET table_parent = :table_parent, state_table_parent= :state_table_parent WHERE roles = :roles"
        );

        $roles= "Fondateur";
        $state_table_parent= -1;

        $request_set_table_parent->bindParam(':roles', $roles);
        $request_set_table_parent->bindParam(':state_table_parent', $state_table_parent);
        $request_set_table_parent->bindParam(':table_parent', $table_name_parent);
        $request_set_table_parent->execute();

        return true;
    }

    /**
     * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
     * 
     * Goal: Get status for one sous tribu T inside their parent
     * Use in: TributTController.php
     * 
     * @param string $table_futur_sous_tribu: Name  table tribu T fils
     * @param string $table_name_parent: Name table tribu T parent
     * 
     * @return false if the parent don't have tribu T fils or not match, otherwise array associated
     *  [ id => ..., name => ..., status => ... , datetime => ... ]
     */
    public function getStatusSousTribuT($table_futur_sous_tribu, $table_name_parent){
        $table_parent_list_sub= $table_name_parent . "_list_sub";

        if (!$this->isTableExist($table_parent_list_sub)) {
            $this->createTableSousTribu($table_name_parent);
            return false;
        }

        $request_status_invitation = $this->getPDO()->prepare("SELECT id, name, status, datetime FROM $table_parent_list_sub WHERE name= :name");

        $request_status_invitation->bindParam(':name', $table_futur_sous_tribu);
        $request_status_invitation->execute();
        $status_invitation = $request_status_invitation->fetch(PDO::FETCH_ASSOC);

        return $status_invitation;
    }

    public function getHierarchicalTribu($table_name_parent){

        $list_table_parent= [];
        $table_parent= $this->getSingleTableParent($table_name_parent);
        while($table_parent != null){
            array_push($list_table_parent, $table_parent);
            $table_parent = $this->getSingleTableParent($table_parent);
        }

        $list_table_parent= array_reverse($list_table_parent);
        array_push($list_table_parent, $table_name_parent);

        $data= null;
        if( count($list_table_parent) > 0 ){
            foreach($list_table_parent as $item_table_parent){
                $data = $this->dataTransformHierchicalTribu($item_table_parent, $data);
            }
        }
        $sub_list_trub= $this->getListSousTribuT($table_name_parent);


        if( count($data["child"]) === 0 ){
            $ref_mytribu_in_hierchical = &$data;
        }else{
            $ref_mytribu_in_hierchical = &$data["child"][0];
            while(count($ref_mytribu_in_hierchical["child"]) > 0 ){
                $ref_mytribu_in_hierchical= &$ref_mytribu_in_hierchical["child"][0];
            }
        }

        foreach($sub_list_trub as $item_sub_list){
            $hierachy_temp = $this->getHierarchicalFrom($item_sub_list["name"]);
            array_push($ref_mytribu_in_hierchical["child"], $hierachy_temp);
        }

        return $data;
    }

    public function dataTransformHierchicalTribu($table_name, $data){
        $apropos=  $this->getAproposUpdate($table_name);
        $user_fondateur= $this->getUser(intval($apropos["fondateurId"]));

        $hierarchical_tribu = [
            "apropos" => [
                "table_name" => $table_name,
                "name" => $apropos["name"],
                "description" => $apropos["description"],
                "avatar" => $apropos["avatar"],
                "fondateur" => [
                    "pseudo" => $user_fondateur["pseudo"],
                    "fullname" => ""
                ],
            ],
            "child" => []
        ];

        if( is_null($data)) return $hierarchical_tribu;


        if(count($data["child"]) === 0 ){
            $data["child"][] = $hierarchical_tribu;
        }else{
            $temp = &$data["child"][0];
            while(count($temp["child"]) > 0 ){
                $temp= $temp["child"];
            }

            $temp["child"][] = $hierarchical_tribu;
        }
       
        return $data;
    }

    public function getHierarchicalFrom($table_name, $data= null){
        $apropos=  $this->getAproposUpdate($table_name);
        $user_fondateur= $this->getUser(intval($apropos["fondateurId"]));

        $data_temp = [
            "apropos" => [
                "table_name" => $table_name,
                "name" => $apropos["name"],
                "description" => $apropos["description"],
                "avatar" => $apropos["avatar"],
                "fondateur" => [
                    "pseudo" => $user_fondateur["pseudo"],
                    "fullname" => ""
                ],
            ],
            "child" => []
        ];

        $sub_list_trub= $this->getListSousTribuT($table_name);

        if( count($sub_list_trub) === 0 && is_null($data) ) return $data_temp;

        if( count($sub_list_trub) === 0 && !is_null($data) ){
            array_push($data["child"], $data_temp);
            return $data;
        }


        foreach($sub_list_trub as $item_tribu){
            $apropos=  $this->getAproposUpdate($item_tribu["name"]);
            $user_fondateur= $this->getUser(intval($apropos["fondateurId"]));

            $data_temp_item= [
                "apropos" => [
                    "table_name" => $item_tribu["name"],
                    "name" => $apropos["name"],
                    "description" => $apropos["description"],
                    "avatar" => $apropos["avatar"],
                    "fondateur" => [
                        "pseudo" => $user_fondateur["pseudo"],
                        "fullname" => ""
                    ],
                ],
                "child" => []
            ];

            $data_item= $this->getHierarchicalFrom($item_tribu["name"], $data_temp_item);
            array_push($data_temp["child"], $data_item);
        }

        return $data_temp;

    }

    public function getTableParent($table_name){
        $results = [];

        $table_parent = $this->getSingleTableParent($table_name);

        if( $table_parent === null) return [];

        return array_merge([$table_parent], $this->getTableParent($table_parent));
    }

    public function getSingleTableParent($table_name){

        if(!$this->isColumnExist($table_name, "table_parent")){
            $this->updateTableTribuAddCullumnTableParent($table_name);
            return null;
        }

        if(!$this->isColumnExist($table_name, "state_table_parent")){
            $this->updateTableTribuAddCullumnStateTableParent($table_name);
            return null;
        }

        $request_table_parent = $this->getPDO()->prepare("SELECT table_parent FROM $table_name WHERE roles= :roles AND state_table_parent = :state_table_parent  AND table_parent != :table_parent");
        
        $roles= "Fondateur";
        $table_parent= 0;
        $state_table_parent= 1;

        $request_table_parent->bindParam(':table_parent', $table_parent);
        $request_table_parent->bindParam(':state_table_parent', $state_table_parent);
        $request_table_parent->bindParam(':roles', $roles);
        $request_table_parent->execute();
        $response = $request_table_parent->fetch(PDO::FETCH_ASSOC);

        return $response ? $response["table_parent"] : null;
    }
}