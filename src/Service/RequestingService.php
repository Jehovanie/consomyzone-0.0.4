<?php

namespace App\Service;

use App\Repository\UserRepository;
use PDO;
use PDOException;
use DateTimeImmutable;
use App\Service\PDOConnexionService;
use Doctrine\DBAL\Driver\SQLSrv\Exception\Error;

class RequestingService extends PDOConnexionService
{

    private $u;
    public function __construct(UserRepository $u){
        $this->u=$u;
    }
    public function createTable($table_name)
    {

        $sql = "CREATE TABLE " . $table_name . "(
                id int(11) AUTO_INCREMENT NOT NULL PRIMARY KEY,
                user_post int(11) NOT NULL,
                user_received int(11) NOT NULL,
                content TEXT NULL,
                types VARCHAR(200) NOT NULL,
                is_wait TINYINT(1) DEFAULT '1',
                is_accepted TINYINT(1) DEFAULT '0',
                is_rejected TINYINT(1) DEFAULT '0',
                is_cancelled TINYINT(1) DEFAULT '0',
                is_tribu TINYINT(1) DEFAULT '0',
                is_friend TINYINT(1) DEFAULT '0',
                balise VARCHAR(200) NOT NULL
               ) ENGINE=InnoDB";

        try {
            $this->getPDO()->exec($sql);
        } catch (Error $error) {
            echo "ERROR: " . $error;
        }
    }

    public function setRequesting($tableName, $user_post, $user_received, $types, $content,$balise)
    {
        
        $sql = "INSERT INTO $tableName (user_post, user_received, types,content,balise) VALUES (?,?,?,?,?)";
        $statement = $this->getPDO()->prepare($sql);
        $statement->execute([$user_post, $user_received, $types, $content,$balise]);
    }		public function setRequestingTribut($tableName, $user_post, $user_received, $types, $content,$balise)    {                $sql = "INSERT INTO $tableName (user_post, user_received, types,content,balise,is_tribu) VALUES (?,?,?,?,?,?)";        $statement = $this->getPDO()->prepare($sql);        $statement->execute([$user_post, $user_received, $types, $content,$balise,1]);    }

    ///from Nanta
    // public function setRequesting($tableName, $user_post, $user_received, $types, $tribu, $content){
    //     $sql = "INSERT INTO $tableName (user_post, user_received, types,tribu,content) VALUES (?,?,?,?,?)";
    //     $statement = $this->getPDO()->prepare($sql);
    //     $statement->execute([$user_post, $user_received,$types,$tribu,$content]);
    // }

	public function setIsAccepted($tableName,  $table_requestin_balise, $user_post, $user_received )
    {
        $sql = "UPDATE $tableName SET is_accepted = 1, is_wait = 0 WHERE is_wait = 1 AND user_post = '$user_post' AND user_received = '$user_received' AND  balise = '$table_requestin_balise'";
        $statement = $this->getPDO()->prepare($sql);
        $statement->execute();
    }

    // public function setIsRejected($tableName, $invitation_id){
    //     $sql = "UPDATE $tableName SET is_rejected = 1, is_wait = 0 WHERE id = $invitation_id";
    public function setIsRejected($tableName,  $table_requestin_balise, $user_post, $user_received )
    {
        $sql = "UPDATE $tableName SET is_rejected = 1, is_wait = 0 WHERE is_wait = 1 AND  user_post = '$user_post' AND user_received = '$user_received' AND  balise = '$table_requestin_balise'";
        $statement = $this->getPDO()->prepare($sql);
        $statement->execute();
    }

    public function setIsCancel($tableName, $table_requestin_balise, $user_post, $user_received)
    {
        
        $sql = "UPDATE $tableName SET is_cancelled = 1, is_wait = 0 WHERE is_wait = 1 AND user_post = '$user_post' AND user_received = '$user_received' AND balise = '$table_requestin_balise'";
        $statement = $this->getPDO()->prepare($sql);
        $statement->execute();
    }
    
    public function getAllRequest($tableName)
    {
        $sql = "SELECT * FROM $tableName t ";
        $statement = $this->getPDO()->prepare($sql);
        $statement->execute();
        $ts=$statement->fetchAll(PDO::FETCH_ASSOC);
        $result=[];
        foreach ( $ts as $t ){
            $uPoster=$this->u->find($t["user_post"]);
            $uReceiver=$this->u->find($t["user_received"]);
             
            $tmp["requesting"]=$t;
            $tmp["userReceiving"]=(array)$uReceiver;
            $tmp["uPoster"] = (array)$uPoster;
            array_push($result,$tmp);
        }
        return $result;
    }

    //select balise from tablerequesting_5 where balise = "tribug_01_ville_nord_oyonnax75";
    public function showInvitation($tableName){
        $sql = "SELECT * FROM $tableName WHERE types = 'invitation'";
        $statement = $this->getPDO()->prepare($sql);
        $statement->execute();
        $result = $statement->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function showDemande($tableName){
        $sql = "SELECT * FROM $tableName WHERE types = 'demande'";
        $statement = $this->getPDO()->prepare($sql);
        $statement->execute();
        $result = $statement->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

}
