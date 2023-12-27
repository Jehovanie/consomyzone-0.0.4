<?php
namespace App\Service;


use PDO;
use PDOException;
use App\Entity\User;
use DateTimeImmutable;
use App\Repository\UserRepository;
use App\Service\PDOConnexionService;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\DBAL\Driver\SQLSrv\Exception\Error;


class MessageService extends PDOConnexionService{

    /**
     * We use this function to create table dynamique for TributG.
     * @param  $table_name : this is the name of the table to create.
     */
    public function createTable($table_name){

        $sql = "CREATE TABLE " . $table_name . "(
                id int(11) AUTO_INCREMENT NOT NULL PRIMARY KEY,
                user_id int(11) NOT NULL,
                user_post int(11) NOT NULL,
                content LONGTEXT  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
                message_type VARCHAR(100) NOT NULL DEFAULT 'text',
                isForMe tinyint(1) NOT NULL  DEFAULT '0',
                isShow tinyint(1) NOT NULL  DEFAULT '0',
                isRead tinyint(1) NOT NULL  DEFAULT '0',
                user_receiver int DEFAULT NULL,
                datetime timestamp NOT NULL DEFAULT current_timestamp(),
                INDEX user_id_index (user_id),
                INDEX user_post_index (user_post)
                )ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;";
            
        try {
            $this->getPDO()->exec($sql);
        }catch(Error $error ){
            // echo "ERROR: " . $error;
            throw $error;
        }
    }


    /**
     * To send message for one people.
     * @param int $user_id_post: user send message
     * @param int $user_id: user receive message
     * @param string $content: content of message
     */
    // public function sendMessageForOne(int $user_id_post, int $user_id, $content){
    public function sendMessageForOne(int $user_id, int $user_id_post, $content, $message_type ="text"){

        //// FOR other person //////////////////////////////////////////////////////////////
        ///get the name of the table message for  other person $user_id_post to send new message
        $statement_receive = $this->getPDO()->prepare('SELECT tablemessage FROM user WHERE id= '. $user_id_post );
        $statement_receive->execute();
        $result_receive = $statement_receive->fetchAll(PDO::FETCH_ASSOC);

        ///insert message
        $sql_receive = "INSERT INTO " . $result_receive[0]["tablemessage"] . " (user_id,user_post,content,message_type,isForMe, isShow,isRead) VALUES (?,?,?,?,?,?,?)";
            
        $this->getPDO()->prepare($sql_receive)->execute([$user_id_post, $user_id, $content, $message_type, 1, 0, 0]);
        //---------------------- FINISH HERE --------------------

        //// FOR ME //////////////////////////////////////////////////////////////////
        ///get the name of the table notification for $user_id_post to send new notification
        $statement_sender = $this->getPDO()->prepare('SELECT tablemessage FROM user WHERE id= '. $user_id );
        $statement_sender->execute();
        $result_sender = $statement_sender->fetchAll(PDO::FETCH_ASSOC);
 
        ///insert notification
        $sql_sender = "INSERT INTO " . $result_sender[0]["tablemessage"] . " (user_id,user_post,content,message_type, isForMe, isShow,isRead,user_receiver) VALUES (?,?,?,?,?,?,?,?)";
             
        $this->getPDO()->prepare($sql_sender)->execute([$user_id, $user_id, $content, $message_type, 0, 1, 1,$user_id_post]);
        //---------------------- FINISH HERE --------------------

        $max_id = $this->getPDO()->prepare("SELECT max(id) as last_id_message FROM  ". $result_sender[0]["tablemessage"]);
        $max_id->execute();
        return $max_id->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * To send message for many people.
     * @param int $user_id_post: user send message
     * @param array $tab_user_id: list user receive message [ ["user_id" => 1], ... ]
     * @param string $content: content of message
     */
    public function sendMessageForMany(int $user_id_post, array $tab_user_id, $content, $type){

        foreach($tab_user_id as $user ){
            $user_id= intval($user["user_id"]); /// user id
            $this->sendMessageForOne($user_id_post , $user_id , $content, $type);
        }
    }

    /**
     * To get the number messages that is not show by the user.
     * @param string $table_name: name of the table.
     */
    public function getNumberMessageNotShow(string $table_name ){
        $sql = "SELECT count(*) as not_show FROM ". $table_name. " WHERE isShow=0";
        $result = $this->getPDO()->query($sql);
        return $result->fetch(PDO::FETCH_ASSOC);
    }

    /**
     * To get the number messages that is not show by the user.
     * @param string $table_name: name of the table.
     */
    public function getMessageForEveryUser(string $table_name,int $userId ){
        
        //// get the different user already talk to me.
        $sql = "SELECT DISTINCT user_post from ".$table_name." WHERE user_post != :id";
        $exec_other_user_id = $this->getPDO()->prepare($sql);
        $exec_other_user_id->bindParam(":id",$userId,PDO::PARAM_INT);
        $exec_other_user_id->execute();
        $other_user_id= $exec_other_user_id->fetchAll(PDO::FETCH_ASSOC);
        // dd($other_user_id),

        ///get the last message that we talk to there
        $results = [];
        foreach ( $other_user_id as $user_id ){
            $user_id_other = intval($user_id["user_post"]);
            $sql = "SELECT * FROM ".$table_name." WHERE user_post = " . $user_id_other . " ORDER BY id DESC LIMIT 1";
            $result = $this->getPDO()->query($sql);
            $msg=  $result->fetchAll(PDO::FETCH_ASSOC);

            array_push($results, $msg);
        }
        
        return $results;
    }

    /**
     * To send message for many people. We use this on the discussion.
     * @param int $user_other: user id talk to him
     * @param string $table: my table name  message
     */
    public function getAllOldMessage(int $user_other, string $table ){

        $statement = $this->getPDO()->prepare("SELECT * FROM $table  WHERE user_post = $user_other or (user_id= user_post and user_receiver=$user_other )");
        $statement->execute();
        $results = $statement->fetchAll(PDO::FETCH_ASSOC);

        return $results;
    }


    /**
     * To set show messages.
     * @param string $table_name: my table name  message
     */
    public function setShowMessageAction($table_name){
        $statement = $this->getPDO()->prepare("UPDATE " . $table_name . "  SET isShow = '1' WHERE isShow = 0" );
        $statement->execute();
    
        return $statement->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Set all last messages to already read and show
     * @param int $user_id_post: user id talk to me
     * @param string $my_table_name: my table name  message
     */
    public function setShowAndReadMessages(int $user_id_post , string $my_table_name){

        $statement = $this->getPDO()->prepare("UPDATE " . $my_table_name . "  SET isShow = '1', isRead= '1' WHERE user_post = " . $user_id_post);
        $statement->execute();
    
        return $statement->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * other id is Id of the user who rerceived message
     */

    public function getLastMessage($myTableMessage,$otherID){

        $sql = "SELECT id,user_id,user_post,content, message_type, isForMe, isRead , datetime FROM "
        .$myTableMessage." WHERE user_post = " . $otherID . 
        " OR (user_id = user_post and user_receiver=". $otherID .")".
        " ORDER BY id DESC LIMIT 1";
        $result = $this->getPDO()->query($sql);
        $msg=  $result->fetch(PDO::FETCH_ASSOC);

      

        if(!!$msg === true && json_decode($this->convertUnicodeToUtf8($msg["content"]), true)){

            $text = json_decode($this->convertUnicodeToUtf8($msg["content"]), true);
           //dd($text);
            $result = [
                "id" => $msg["id"],
                "user_id" => $msg["user_id"],
                "user_post" => $msg["user_post"],
                "text" => array_key_exists('text', $text) ?  $text["text"] : "(Object)",
                "message_type" => $msg["message_type"],
                "isForMe" => $msg["isForMe"],
                "isRead" => $msg["isRead"],
                "datetime" => $msg["datetime"]
            ];
            return $result;
        }else{
            return false;
        }
        
    }

    public function createVisio($from, $to, $username, $nom, $status){

        $sql = "INSERT INTO visio_story (`from`,`to`,`username`, `nom`, `status`) VALUES (?, ?, ?, ?, ?)";

        $stmt = $this->getPDO()->prepare($sql);

        $stmt->bindParam(1, $from);

        $stmt->bindParam(2, $to);

        $stmt->bindParam(3, $username);

        $stmt->bindParam(4, $nom);

        $stmt->bindParam(5, $status);

        $stmt->execute();
    }

    public function getVisio($my_id){

        $sql = "SELECT * , count(nom) as users_number FROM visio_story WHERE visio_story.from = $my_id or visio_story.to = $my_id group by nom order by id asc";

        $stm = $this->getPDO()->prepare($sql);

        $stm->execute();

        $result = $stm->fetchAll(PDO::FETCH_ASSOC);

        return $result;
    }

    public function updateVisioById($id, $status)

    {

        $sql = "UPDATE visio_story set status = ? WHERE id = ?";

        $stmt = $this->getPDO()->prepare($sql);

        $stmt->bindParam(1, $status);

        $stmt->bindParam(2, $id);

        $stmt->execute();

        // $stmt->execute([$status, $id]);

    }

    public function updateOneMessageById($id, $myTableMessage, $content_msg)

    {

        $sql = "UPDATE $myTableMessage set content = ? WHERE id = ?";

        $stmt = $this->getPDO()->prepare($sql);

        $stmt->bindParam(1, $content_msg);

        $stmt->bindParam(2, $id);

        $stmt->execute();

    }


    public function deleteAllVisio($my_id)

    {

        // $sql = "UPDATE visio_story set status = ? WHERE id = ?";

        // $stmt = $this->getPDO()->prepare($sql);

        // $stmt->execute([$status, $id]);

    }

    public function getVisioById($my_id){

        $sql = "SELECT * FROM visio_story WHERE visio_story.id = $my_id";

        $stm = $this->getPDO()->prepare($sql);

        $stm->execute();

        $result = $stm->fetch(PDO::FETCH_ASSOC);

        return $result;
    }

    public function getVisioByName($name){

        $sql = "SELECT * FROM visio_story WHERE visio_story.nom = '$name' ";

        $stm = $this->getPDO()->prepare($sql);

        $stm->execute();

        $result = $stm->fetchAll(PDO::FETCH_ASSOC);

        return $result;
    }

    public function getOneMessage($myTableMessage,$id){

        $sql = "SELECT * FROM ".$myTableMessage." WHERE id = " . $id ;
        $result = $this->getPDO()->query($sql);
        $msg=  $result->fetch(PDO::FETCH_ASSOC);

        return $msg;
    }

    /**
     * Get list of the user to chat in the tribu G by the user connected
     * 
     * @param $user: user currenct connecter
     * @param TributGService $tributGService: TribuGService locate in src/service/TribuGService.php
     * @param EntityManagerInterface $entityManager, : EntityManagerInterface  build-in
     * @param UserRepository $userRepository: user repository locate in src/repository/UserRepository.php
     * 
     * @return array empty or array list of user in tribu G [ 
     *      [ 
     *        id => ...,
     *        photo => ..., 
     *        email => ..., 
     *        firstname => ...,
     *        lastname => ..., 
     *        image_profil => ..., 
     *        email_profil => ...,
     *        last_message => ...,
     *        is_online => ...
     *      ],
     *      ...
     * ]
     */
    public function getListAmisToChat( 
        $user, 
        TributGService $tributGService, 
        EntityManagerInterface $entityManager, 
        UserRepository $userRepository  
    ){

        $amis_in_tributG = [];
        
        if($user && $user->getType()!="Type"){
            // ////profil user connected
            $userId = $user->getId();
            $profil = $tributGService->getProfil($user, $entityManager);

            $id_amis_tributG = $tributGService->getAllTributG($profil[0]->getTributG());  /// [ ["user_id" => ...], ... ]
            ///to contains profil user information
            
            foreach ($id_amis_tributG  as $id_amis) { /// ["user_id" => ...]
                if( intval($id_amis["user_id"]) !== intval($userId) ){
                    ///check their type consumer of supplier
                    $user_amis = $userRepository->find(intval($id_amis["user_id"]));
                    
                    if( $user_amis ){
                        $profil_amis = $tributGService->getProfil($user_amis, $entityManager)[0];
                        ///single profil
                        $amis = [
                            "id" => $id_amis["user_id"],
                            "photo" => $profil_amis->getPhotoProfil(),
                            "email" => $user_amis->getEmail(),
                            "firstname" => $profil_amis->getFirstname(),
                            "lastname" => $profil_amis->getLastname(),
                            "image_profil" => $profil_amis->getPhotoProfil(),
                            "last_message" => $this->getLastMessage($user->getTablemessage(),$id_amis["user_id"]),
                            "is_online" => $user_amis->getIsConnected(),
                        ];
        
                        ///get it
                        array_push($amis_in_tributG, $amis);
                    }
                }
            }
        }


        return $amis_in_tributG;
    }

    /**
     * Get list of the user to chat in the tribu  T by the user connected
     * 
     * @param $user: user currenct connecter
     * @param TributGService $tributGService: TribuGService locate in src/service/TribuGService.php
     * @param Tribu_T_Service $tributTService: tributTService locate in src/service/Tribu_T_Service.php
     * @param EntityManagerInterface $entityManager, : EntityManagerInterface  build-in
     * @param UserRepository $userRepository: user repository locate in src/repository/UserRepository.php
     * 
     * @return array empty or array list of user in tribu T [ 
     *          [ 
     *             table_name => ..., 
     *             name_tribu_t_muable => ..., 
     *             logo_path => ..., 
     *             amis => [
     *               [
     *                  id =>  ...,
     *                  photo => ...,
     *                  email => ...,
     *                  firstname => ...,
     *                  lastname => ...,
     *                  image_profil => ...,
     *                  last_message => ...,
     *                  is_online => ... 
     *               ],
     *               ...
     *             ]
     *          ],
     *          ... 
     *   ]
     */
    public function getListAmisInTribuTtoChat(
        $user,
        TributGService $tributGService, 
        Tribu_T_Service $tributTService,
        EntityManagerInterface $entityManager,
        UserRepository $userRepository  
    ){
        $userId = $user->getId();
        
        $all_tribuT_user= [];
        $all_tribuT= $userRepository->getListTableTribuT();
        foreach($all_tribuT as $tribuT){
            $tribuT['amis'] = [];
            $results=$tributTService->getAllPartisanProfil($tribuT['table_name']);
            foreach($results as $result){
                if( intval($result["user_id"]) !== intval($userId) ){
                    $user_amis = $userRepository->find(intval($result["user_id"]));
                    
                    if( $user_amis && $user_amis->getIsConnected()){
                        $profil_amis = $tributGService->getProfil($user_amis, $entityManager)[0];
                        $amis = [
                            "id" => $result["user_id"],
                            "photo" => $profil_amis->getPhotoProfil(),
                            "email" => $user_amis->getEmail(),
                            "firstname" => $profil_amis->getFirstname(),
                            "lastname" => $profil_amis->getLastname(),
                            "image_profil" => $profil_amis->getPhotoProfil(),
                            "last_message" => $this->getLastMessage($user->getTablemessage(),$result["user_id"]),
                            "is_online" => $user_amis->getIsConnected(),
                        ];
                        ///get it
                        array_push($tribuT['amis'] , $amis);
                    }
                }
            }
            array_push($all_tribuT_user, $tribuT);
        }

        return $all_tribuT_user;
    }

    /**
     * @author faniry
     * partage les message entres les fans
     */
    public function transferMessage($currentUserId,$userIdReceivedMsg,$messageId){

        $tableMessageWhereWeTakeMessage="tablemessage_".$currentUserId;
        $sql="SELECT * FROM ". $tableMessageWhereWeTakeMessage ." WHERE id= :id";
        $statement=$this->getPDO()->prepare($sql);
        $statement->bindParam(":id",$messageId,PDO::PARAM_INT);
        $statement->execute();
        $data=$statement->fetch(PDO::FETCH_ASSOC);
        
        $message1=array(
            ":user_id"=>$userIdReceivedMsg,
            ":user_post"=>$currentUserId,
            ":content"=>$data["content"],
            "message_type"=>$data["message_type"],
            "isForMe"=>1,
            "isShow"=>0,
            "isRead"=>0);

       //ecrire le message dans  la table de receveur
        $tablemessageWhoReceivedMessage="tablemessage_".$userIdReceivedMsg;
        $sql2="INSERT INTO ".$tablemessageWhoReceivedMessage.
        "(user_id,".
          "user_post,".
          "content,". 
          "message_type,". 
          "isForMe,".
          "isShow,". 
          "isRead)".
          " VALUES".
          " (:user_id,".
          ":user_post,".
          ":content,". 
          ":message_type,". 
          ":isForMe,".
          ":isShow,". 
          ":isRead)";
        $statement2= $this->getPDO()->prepare($sql2);
        $statement2->execute($message1);

        //ecrire le message dans la table de l'envoyeur
        $message2=array(
            ":user_id"=>$currentUserId,
            ":user_post"=>$currentUserId,
            ":content"=>$data["content"],
            "message_type"=>$data["message_type"],
            ":isForMe"=>0,
            ":isShow"=>0,
            ":isRead"=>0,
            ":user_receiver"=>$userIdReceivedMsg);
        $tablemessageWhoSenderMessage="tablemessage_".$currentUserId;
        $sql3="INSERT INTO ".$tablemessageWhoSenderMessage.
        "(user_id,".
          "user_post,".
          "content,". 
          "message_type,". 
          "isForMe,".
          "isShow,". 
          "isRead,".
          "user_receiver)".
          " VALUES".
          " (:user_id,".
          ":user_post,".
          ":content,". 
          ":message_type,". 
          ":isForMe,".
          ":isShow,". 
          ":isRead,". 
          ":user_receiver)";
        $statement3= $this->getPDO()->prepare($sql3);
        return $statement3->execute($message2);
       
    }
}