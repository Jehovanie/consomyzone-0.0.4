<?php

namespace App\Service;

use App\Repository\UserRepository;
use PDO;
use PDOException;
use DateTimeImmutable;
use App\Service\PDOConnexionService;
use App\Service\Tribu_T_Service;
use Doctrine\DBAL\Driver\SQLSrv\Exception\Error;

class RequestingService extends PDOConnexionService
{

    private $u;
    private $tribuT;
    public function __construct(UserRepository $u, Tribu_T_Service $tribuT)
    {
        $this->u = $u;
        $this->tribuT = $tribuT;
    }
    public function createTable($table_name)
    {

        $sql = "CREATE TABLE IF NOT EXISTS " . $table_name . "(
                id int(11) AUTO_INCREMENT NOT NULL PRIMARY KEY,
                user_post int(11) NOT NULL,
                user_received int(11) NOT NULL,
                content TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
                types VARCHAR(200) NOT NULL,
                is_wait TINYINT(1) DEFAULT '1',
                is_accepted TINYINT(1) DEFAULT '0',
                is_rejected TINYINT(1) DEFAULT '0',
                is_cancelled TINYINT(1) DEFAULT '0',
                is_tribu TINYINT(1) DEFAULT '0',
                is_friend TINYINT(1) DEFAULT '0',
                balise VARCHAR(200) NOT NULL
               ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci";

        try {
            $this->getPDO()->exec($sql);
        } catch (Error $error) {
            echo "ERROR: " . $error;
        }
    }

    public function setRequesting($tableName, $user_post, $user_received, $types, $content, $balise)
    {

        $sql = "INSERT INTO $tableName (user_post, user_received, types,content,balise) VALUES (?,?,?,?,?)";
        $statement = $this->getPDO()->prepare($sql);
        $statement->execute([$user_post, $user_received, $types, $content, $balise]);
    }
    public function setRequestingTribut($tableName, $user_post, $user_received, $types, $content, $balise)
    {
        $sql = "INSERT INTO $tableName (user_post, user_received, types,content,balise,is_tribu) VALUES (?,?,?,?,?,?)";
        $statement = $this->getPDO()->prepare($sql);
        $statement->execute([$user_post, $user_received, $types, $content, $balise, 1]);
    }

    ///from Nanta
    // public function setRequesting($tableName, $user_post, $user_received, $types, $tribu, $content){
    //     $sql = "INSERT INTO $tableName (user_post, user_received, types,tribu,content) VALUES (?,?,?,?,?)";
    //     $statement = $this->getPDO()->prepare($sql);
    //     $statement->execute([$user_post, $user_received,$types,$tribu,$content]);
    // }

    public function setIsAccepted($tableName,  $table_requestin_balise, $user_post, $user_received)
    {
        $sql = "UPDATE $tableName SET is_accepted = 1, is_wait = 0 WHERE is_wait = 1 AND user_post = '$user_post' AND user_received = '$user_received' AND  balise = '$table_requestin_balise'";
        $statement = $this->getPDO()->prepare($sql);
        $statement->execute();
    }

    // public function setIsRejected($tableName, $invitation_id){
    //     $sql = "UPDATE $tableName SET is_rejected = 1, is_wait = 0 WHERE id = $invitation_id";
    public function setIsRejected($tableName,  $table_requestin_balise, $user_post, $user_received)
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
        $sql = "SELECT * FROM $tableName t WHERE is_wait = 1";
        $statement = $this->getPDO()->prepare($sql);
        $statement->execute();
        $ts = $statement->fetchAll(PDO::FETCH_ASSOC);
        $result = [];
        // dd($ts);

        foreach ($ts as $t) {
            $uPoster = $this->u->find($t["user_post"]);
            $uReceiver = $this->u->find($t["user_received"]);

            if($uPoster && $uReceiver ){
                // $tmp["requesting"] = $t;
                // $tmp["userReceiving"] = (array)$uReceiver;
                // $tmp["uPoster"] = (array)$uPoster;
                $tmp["requesting"] = $t;
                $tmp["userReceiving"] = (array)$uReceiver;
                $tmp["fN_userReceiving"] = $this->tribuT->getFullName($t["user_received"]);
                $tmp["pdp_userReceiving"] = $this->tribuT->getPdp($t["user_received"]);
                $tmp["uPoster"] = (array)$uPoster;
                $tmp["fN_uPoster"] = $this->tribuT->getFullName($t["user_post"]);
                $tmp["pdp_uPoster"] = $this->tribuT->getPdp($t["user_post"]);
                
                array_push($result, $tmp);
            }
        }
        return $result;
    }

    //select balise from tablerequesting_5 where balise = "tribug_01_ville_nord_oyonnax75";
    public function showInvitation($tableName)
    {
        $sql = "SELECT * FROM $tableName WHERE types = 'invitation'";
        $statement = $this->getPDO()->prepare($sql);
        $statement->execute();
        $result = $statement->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function showDemande($tableName)
    {
        $sql = "SELECT * FROM $tableName WHERE types = 'demande'";
        $statement = $this->getPDO()->prepare($sql);
        $statement->execute();
        $result = $statement->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }
}
