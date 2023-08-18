<?php

namespace App\Service;





use PDO;

use PDOException;

use DateTimeImmutable;

use App\Service\PDOConnexionService;

use Doctrine\DBAL\Driver\SQLSrv\Exception\Error;





class NotificationService extends PDOConnexionService{



    /**

     * We use this function to create table dynamique for TributG.

     * @param  $table_name : this is the name of the table to create.

     */

    public function createTable($table_name)

    {



        $sql = "CREATE TABLE " . $table_name . "(

                id int(11) AUTO_INCREMENT NOT NULL PRIMARY KEY,

                user_id int(11) NOT NULL,

                user_post int(11) NOT NULL,

                type VARCHAR(200) NOT NULL,

                content VARCHAR(350) NOT NULL,

                isShow tinyint(1) NOT NULL  DEFAULT '0',

                isRead tinyint(1) NOT NULL  DEFAULT '0',

                datetime timestamp NOT NULL DEFAULT current_timestamp(),

                tribu VARCHAR(255) NULL)";

            

        try {

            $this->getPDO()->exec($sql);

        }catch(Error $error ){

            echo "ERROR: " . $error;

        }



    }



    /**
     * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
     * 
     * To send notification.
     * 
     * @param int $user_id_post: user dispatch an action and send notification
     * @param int $user_id: user receive notification
     * @param string $type: type of message (ex:publication, reaction, commentaire, ajout amis, ... )
     * @param string $content: content of message
     * 
     * @return void
     */
    public function sendNotificationForOne(int $user_id_post,int $user_id,string $type, string $content ){

        ///get the name of the table notification for $user_id_post to send new notification
        $statement = $this->getPDO()->prepare('SELECT tablenotification FROM user WHERE id= '. $user_id );

        $statement->execute();

        $result = $statement->fetch(PDO::FETCH_ASSOC);

        //// check if this table notification exists
        $db = $_ENV["DATABASENAME"];
        $query = "SHOW TABLES FROM $db like '" . $result["tablenotification"] . "'";
        $sql = $this->getPDO()->query($query);
        if( $sql->rowCount() === 0 ){
            return false;
        }

        ///insert notification
        $sql = "INSERT INTO " . $result["tablenotification"] . " (user_id,user_post,type,content,isShow,isRead) VALUES (?,?,?,?,?,?)";

        $this->getPDO()->prepare($sql)->execute([$user_id, $user_id_post, $type, $content,0,0]);

    }





    /**

     * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>

     * 

     * To send notification.

     * @param int $user_id_post: user dispatch an action and send notification

     * @param array $tab_user_id: list user receive notification [ ["user_id" => 1], ... ] you can get this form for example in tributGService function getAllTributG 

     * @param string $type: type of message (ex:publication, reaction, commentaire, ajout amis, ... )

     * @param string $content: content of message

     */

    public function sendNotificationForMany(int $user_id_post,array $tab_user_id,string $type, string $content ){

        ///get the name of the table notification for $user_id_post to send new notification

        foreach($tab_user_id as $user ){// [ ["user_id" => 1], ... ]



            $user_id= intval($user["user_id"]); /// user id



            ///get the name of the table notification for $user_id_post to send new notification

            $statement = $this->getPDO()->prepare('SELECT tablenotification FROM user WHERE id= '. $user_id );

            $statement->execute();

            $result = $statement->fetch(PDO::FETCH_ASSOC);



            ///insert notification

            $sql = "INSERT INTO " . $result["tablenotification"] . " (user_id,user_post,type,content,isShow,isRead) VALUES (?,?,?,?,?,?)";

                

            $this->getPDO()->prepare($sql)->execute([$user_id, $user_id_post, $type, $content,0,0]);

        }

    }



    /**

     * @deprecated instead use sendNotificationForOne or sendNotificationForMany

     * 

     * @param $user_current_id: user current id ( connected )

     * @param $destinations: array for the user to send notification

     * @param $super_admin: to check if user the is super_admin

     */

    public function sendNotification(int $user_current_id,array $destinations,bool $super_admin=false){



        ///type de notification

        $type="Tribut G";

        

        ////message content type

        $content_notification_for_super_admin= "Nous vous informons qu'il y a un nouveau tribu G a été crée, il vous faut féliciter et valide son fondateur.";

        

        $content_notification_for_fondateur= "Nous avons un grand plaisir de vous annonce que le tribut G selon votre code postal a été crée et vous êtes l'administrateur provisoire.";

        

        $content_notification_for_myself= "Nous avons un grand plaisir de vous avoir parmi nous dans le tribut G d'après votre code postal. De la part de tous les membres et la direction, nous aimerions présenter nos salutations cordiales et la bonne chance.";

        

        $content_notification_for_other_person= "Nous avons un grand plaisir de vous annonce que notre tribut G a une nouvelle amie.";

        



        //// parcourir les destinations envoyer 

        foreach($destinations as $destination){ /// [ ["user_id" => 1], ... ]

            $user_id= $destination["user_id"]; /// user id



            ////choose type of the content notification.

            if( $super_admin){

                $content = $content_notification_for_super_admin;



            }else{



                if( count($destinations) > 1 ){ /// current user connected is not fondateur

                    //// content notif different hisself and for other person

                    if(intval($user_id) === intval($user_current_id)){ ///his self

                        $content = $content_notification_for_myself;

    

                    }else{///////////////////other persone

                        $content = $content_notification_for_other_person;

                    }

                }else{ /// current user connected is  fondateur

                    $content = $content_notification_for_fondateur;

                }



            }



           

            //// get the table notification for this user from their id

            $statement = $this->getPDO()->prepare('SELECT tablenotification FROM user WHERE id= '. $user_id );

            $statement->execute();

            $result = $statement->fetch(PDO::FETCH_ASSOC);



            // dd($result[0]["tablenotification"] );



            ////set notification

            $sql = "INSERT INTO " . $result["tablenotification"] . " (user_id,user_post,type,content,isShow,isRead) VALUES (?,?,?,?,?,?)";

            

            $this->getPDO()->prepare($sql)->execute([intval($user_id), intval($user_current_id), $type, $content,0,0]);

        }

    }



    /**

     * @param $user_id_super_admin: user admin id ( connected )

     * @param $user_id_fondateur_tributg: user fondateur id

     * @param $value: the way to know the message status (accept or refuse the administrator)

     */

    public function sendNotificaticationValidationTribug($user_id_super_admin, $user_id_fondateur_tributg, $value){



        $type="Validation d'administer le tributG";



        if( $value ){

            $content= "Nous vous informons que l'administrateur de cette plateforme a validé que votre rôle en tant qu'administrateur dans le tribu G.";

        }else{

            $content= "Dommage, l'administrateur de cette plateforme ne pas accepter que vous êtes l'administrateur de cette Tribu G.";

        }





        //// get the table notification for this user from their id

        $statement = $this->getPDO()->prepare('SELECT tablenotification FROM user WHERE id= '. $user_id_fondateur_tributg );

        $statement->execute();

        $result = $statement->fetch(PDO::FETCH_ASSOC);



        $sql = "INSERT INTO " . $result["tablenotification"] . " (user_id,user_post,type,content,isShow,isRead) VALUES (?,?,?,?,?,?)";

            

        $this->getPDO()->prepare($sql)->execute([intval($user_id_fondateur_tributg), intval($user_id_super_admin), $type, $content,0,0]);

    }



    /**

     * @param $table: name of the table that contains all notification.

     * @param $data: array of object (ex: [{ notif_id: 2}, {...}, ... ])

     */

    public function setShowNotif(string $table, array $data){



        foreach($data as $notif){

            // UPDATE `tablenotification_1` SET `isShow` = '1' WHERE `tablenotification_1`.`id` = 2

            $statement = $this->getPDO()->prepare('SELECT isShow FROM '. $table . ' WHERE id= ' . intval($notif["notif_id"]));

            $statement->execute();

            $result = $statement->fetch(PDO::FETCH_ASSOC);



            if( $result["isShow"] !== "1" ){

                $sql = "UPDATE " . $table . " SET isShow = 1  WHERE id = " . intval($notif["notif_id"]);

                $this->getPDO()->prepare($sql)->execute();

            }

        }



    }



    public function readAllNotifications(string $table, int $user_id ){



        $sql = "UPDATE " . $table . " SET isShow = 1, isRead = 1  WHERE user_id = " . $user_id;



        return $this->getPDO()->prepare($sql)->execute();

    }





    /**

     * User this function to get all notification order by descendent

     * @param $table : this is the name of the table

     */

    public function fetchAllNotification($table){



        // $statement = getPDO()->prepare("SELECT * FROM " . $table . " WHERE isShow=0");

        $statement = $this->getPDO()->prepare("SELECT * FROM " . $table . " ORDER BY datetime DESC");

        

        $statement->execute();

    

        return $statement->fetchAll(PDO::FETCH_ASSOC);

    }





    public function getSingleNotification($table, $notif_id ){



        $statement = $this->getPDO()->prepare('SELECT isRead FROM '. $table . ' WHERE id= ' . intval($notif_id));



        $statement->execute();

        $result = $statement->fetch(PDO::FETCH_ASSOC);



        if( $result["isRead"] !== "1" ){

            $sql = "UPDATE " . $table . " SET isRead = 1  WHERE id = " . intval($notif_id);

            $this->getPDO()->prepare($sql)->execute();

        }

        

        // $statement = getPDO()->prepare("SELECT * FROM " . $table . " WHERE isShow=0");

        $statement = $this->getPDO()->prepare("SELECT * FROM " . $table . " WHERE id= ". intval($notif_id));

        $statement->execute();

    

        return $statement->fetchAll(PDO::FETCH_ASSOC);

    }



    public function sendNotificationForTribuGmember(int $user_id_post,int $user_id,string $type, string $content){

        ///get the name of the table notification for $user_id_post to send new notification

        $statement = $this->getPDO()->prepare('SELECT tablenotification FROM user WHERE id= '. $user_id );

        $statement->execute();

        $result = $statement->fetch(PDO::FETCH_ASSOC);



        ///insert notification

        $sql = "INSERT INTO " . $result["tablenotification"] . " (user_id,user_post,type,content,isShow,isRead) VALUES (?,?,?,?,?,?)";

            

        $this->getPDO()->prepare($sql)->execute([$user_id, $user_id_post, $type, $content,0,0]);

    }



    public function sendNotificationForTribuGmemberOrOneUser(int $user_id_post,int $user_id,string $type, string $content, string $tribu = null){

        ///get the name of the table notification for $user_id_post to send new notification

        $statement = $this->getPDO()->prepare('SELECT tablenotification FROM user WHERE id= '. $user_id );

        $statement->execute();

        $result = $statement->fetch(PDO::FETCH_ASSOC);



        ///insert notification

        $sql = "INSERT INTO " . $result["tablenotification"] . " (user_id,user_post,type,content,isShow,isRead, tribu) VALUES (?,?,?,?,?,?,?)";

            

        $this->getPDO()->prepare($sql)->execute([$user_id, $user_id_post, $type, $content,0,0,$tribu]);

    }



    /**

     * Deprecated 260102023

     * column is_accepted is deleted.

     */

    public function acceptNotification($table, $notif_id ){



        $statement = $this->getPDO()->prepare('SELECT is_accepted FROM '. $table . ' WHERE id= ' . intval($notif_id));



        $statement->execute();



        $result = $statement->fetch(PDO::FETCH_ASSOC);



        if( $result["is_accepted"] !== "1" ){

            $sql = "UPDATE " . $table . " SET is_accepted = 1  WHERE id = " . intval($notif_id);

            $this->getPDO()->prepare($sql)->execute();

        }

        

    }



    public function rejectNotification($table, $notif_id ){



        $statement = $this->getPDO()->prepare('SELECT is_accepted FROM '. $table . ' WHERE id= ' . intval($notif_id));



        $statement->execute();



        $result = $statement->fetch(PDO::FETCH_ASSOC);



        if( $result["is_accepted"] !== "2" ){

            $sql = "UPDATE " . $table . " SET is_accepted = 2  WHERE id = " . intval($notif_id);

            $this->getPDO()->prepare($sql)->execute();

        }

        

    }



    public function updateNotificationIsread($notif_id, $userId){



        $sql = "UPDATE tablenotification_$userId SET isRead = 1  WHERE id = " . intval($notif_id);

        $this->getPDO()->prepare($sql)->execute();



    }



    public function getUserPostIdForFeedBack($notif_id, $userId){



        $statement = $this->getPDO()->prepare("SELECT user_post, tribu FROM tablenotification_$userId WHERE id = $notif_id");



        $statement->execute();



        $result = $statement->fetch(PDO::FETCH_ASSOC);



        return $result;



    }



    public function sendForwardNotificationForUser(int $user_id_post,int $user_id,string $type, string $content){

        ///get the name of the table notification for $user_id_post to send new notification

        $statement = $this->getPDO()->prepare('SELECT tablenotification FROM user WHERE id= '. $user_id );

        $statement->execute();

        $result = $statement->fetch(PDO::FETCH_ASSOC);



        ///insert notification

        $sql = "INSERT INTO " . $result["tablenotification"] . " (user_id,user_post,type,content,isShow,isRead) VALUES (?,?,?,?,?,?)";

            

        $this->getPDO()->prepare($sql)->execute([$user_id, $user_id_post, $type, $content,0,0]);

    }



    public function getNotificationId($table, $tribu){



        $statement = $this->getPDO()->prepare("SELECT id FROM $table WHERE tribu like '%$tribu%'");



        $statement->execute();



        $result = $statement->fetch(PDO::FETCH_ASSOC);



        return $result["id"];



    }





}



?>

