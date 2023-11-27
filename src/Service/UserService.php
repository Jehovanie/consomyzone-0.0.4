<?php
namespace App\Service;

use PDO;
use PDOException;
use App\Entity\User;
use App\Repository\UserRepository;
use App\Service\PDOConnexionService;
use App\Repository\ConsumerRepository;
use App\Repository\SupplierRepository;

class UserService  extends PDOConnexionService{

    private $userRepository;
    private $consumerRepository;
    private $supplierRepository;

    public function __construct(
        UserRepository $userRepository,
        ConsumerRepository $consumerRepository,
        SupplierRepository $supplierRepository
    ){
        $this->userRepository = $userRepository;
        $this->consumerRepository = $consumerRepository;
        $this->supplierRepository = $supplierRepository;
    }

    public function getUserFirstName($userId){
        $statement = $this->getPDO()->prepare("select * from (select firstname,user_id  from consumer union select firstname,user_id from supplier) as tab where tab.user_id = $userId");
        $statement->execute();
        $result = $statement->fetch(PDO::FETCH_ASSOC);
        return $result["firstname"];
    }

    public function getUserLastName($userId){
        $statement = $this->getPDO()->prepare("select * from (select lastname,user_id  from consumer union select lastname,user_id from supplier) as tab where tab.user_id = $userId");
        $statement->execute();
        $result = $statement->fetch(PDO::FETCH_ASSOC);

        return $result["lastname"];
    }


    public function getUserProfileFromId( int $userId ){

        $user_temp = $this->userRepository->find($userId);
       
        if ($user_temp->getType() === "consumer") {
            $profil_temp = $this->consumerRepository->findOneBy(["userId" => $user_temp->getId()] );
        } else {
            $profil_temp = $this->supplierRepository->findOneBy(["userId" => $user_temp->getId()] );
        }
        
        return $profil_temp;
    }

    public function getTribuByIdUser($user_id){

        $profil_user = $this->userRepository->find($user_id);

        $all_tribuT = [];

        $json_tribuT_owned= $profil_user->getTribuT();

        if( $json_tribuT_owned ){
            $decode_tribuT_owned = json_decode($json_tribuT_owned , true);
            if( !array_key_exists("name", $decode_tribuT_owned['tribu_t']) ){
                foreach($decode_tribuT_owned["tribu_t"] as $tribuT){
                    extract($tribuT);  /// $name
                    array_push($all_tribuT,["table_name" => $name, "logo_path" => $logo_path, "role"=>"Fondateur"] );
                }
            }else{
                array_push($all_tribuT, ["table_name" => $decode_tribuT_owned['tribu_t']['name'], "logo_path" => $decode_tribuT_owned['tribu_t']['logo_path'] , "role"=>"Fondateur"] );
            }
        }

        $json_tribuT_joined = $profil_user->getTribuTJoined();

        if( $json_tribuT_joined ){

            $decode_tribuT_joined = json_decode($json_tribuT_joined , true);
           
            if( !array_key_exists("name", $decode_tribuT_joined['tribu_t']) ){
                foreach($decode_tribuT_joined["tribu_t"] as $tribuT){
                    extract($tribuT);  /// $name
                    array_push($all_tribuT, ["table_name" => $name , "logo_path" => $logo_path, "role"=>"Membre"] );
                }
            }else{
                array_push($all_tribuT, ["table_name" => $decode_tribuT_joined['tribu_t']['name'], "logo_path" => $decode_tribuT_joined['tribu_t']['logo_path'], "role"=>"Membre" ] );
            }

        }

        return $all_tribuT;
    }

    public function getMembreTribuT($table){

        $statement = $this->getPDO()->prepare("SELECT * FROM $table");
        $statement->execute();
        $result = $statement->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function isPseudoExist($pseudo){
        $statement = $this->getPDO()->prepare("SELECT IF(EXISTS (SELECt * FROM `user` WHERE pseudo=:pseudo),true,false) as result");
        $statement->bindParam(":pseudo",$pseudo,PDO::PARAM_STR);
        $statement->execute();
        $result = $statement->fetch(PDO::FETCH_ASSOC);
        return $result;
    }

    public function generatePseudo($pseudo){
        $statement =$this->getPDO()->prepare("CALL generate_randompseudo_from_user_pseudo_v2(?)");
        $statement->bindParam(1, $pseudo, PDO::PARAM_STR);
        $statement->execute();
        $result = $statement->fetch(PDO::FETCH_ASSOC);
        return $result;
    }


    public function setActivity($userID)
    {

        //$currentTimeActivity=\date("Y-m-d H:i:s"); 
        $statement = $this->getPDO()->prepare("UPDATE user SET current_time_activity=NOW() WHERE id=?");
        $statement->bindParam(1, $userID, PDO::PARAM_INT);
        $succes = $statement->execute();
        // $result = $statement->fetch(PDO::FETCH_ASSOC);
        return $succes;
    }

    /**
     * cette fonction verifie si un individu est toujours actif ou non
     * @return int si la reponse est égale à zero alors la personne n'est plus active 
     * si la reponse est > 0 alors la personne est toujours connecter sauf  si le idle est supérieur à 5mn
     * 
     */
    public function getLastActivity($userID)
    {
        ///SELECT TIMESTAMPDIFF(SECOND, last_time_activity, current_time_activity) FROM `user` WHERE id=2;
        $statement = $this->getPDO()->PREPARE("call isActive(?)");
        $statement->bindParam(1, $userID, PDO::PARAM_INT);
        $statement->execute();
        $result = $statement->fetch(PDO::FETCH_ASSOC);
        return $result;
    }

    /**
     * cette fonction recupère tous les indivu actif
     */
    public function getUserActive()
    {
        $statement = $this->getPDO()->PREPARE("SELECT * FROM user  WHERE TIMESTAMPDIFF(SECOND, current_time_activity,NOW()) < 300");
        $statement->execute();
        $result = $statement->fetch(PDO::FETCH_ASSOC);
        return $result;
    }


    /**
     * cette fonction recupère tous les indivu inactif
     */
    public function getInactiveActive()
    {
        $statement = $this->getPDO()->PREPARE("SELECT * FROM user  WHERE TIMESTAMPDIFF(SECOND, current_time_activity,NOW()) > 300");
        $statement->execute();
        $result = $statement->fetch(PDO::FETCH_ASSOC);
        return $result;
    }

    /**
     * cette fonction met à jour le idle de l'user courant
     */
    public function updateUserIDLE($userID,$idle)
    {
        $statement = $this->getPDO()->PREPARE("UPDATE user SET idle = ? WHERE id = ?");
        $statement->bindParam(1, $idle, PDO::PARAM_INT);
        $statement->bindParam(2, $userID, PDO::PARAM_INT);
        $statement->execute();
        $result = $statement->fetch(PDO::FETCH_ASSOC);
        return $result;
    }

    /**
     * cette fonction recherche des fan
     */
    public function lookForOtherFan($word,$myid){
        $sql= "SELECT * FROM `consumer` WHERE (firstname like '%$word%' or lastname like '%$word%' or match(firstname) AGAINST(?) or match (lastname) AGAINST(?)) and user_id !=? ;";
        $statement = $this->getPDO()->PREPARE($sql);
        $statement->bindParam(1, $word, PDO::PARAM_STR);
        $statement->bindParam(2, $word, PDO::PARAM_STR);
        $statement->bindParam(3, $myid, PDO::PARAM_INT);
        $statement->execute();
        $result = $statement->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    /**
     * @author Elie
     * Function insert data into photo_resto
     */
    public function insertPhotoResto($resto_id, $user_id, $photo_path){

        $sql = "INSERT INTO photo_resto (resto_id, user_id, photo_path) VALUES (?, ? , ? )";

        $stmt = $this->getPDO()->prepare($sql);

        $stmt->bindParam(1, $resto_id);

        $stmt->bindParam(2, $user_id);

        $stmt->bindParam(3, $photo_path);

        $stmt->execute();
    }

    /**
     * @author Elie
     * Function insert data into photo_golf
     */
    public function insertPhotoGolf($golf_id, $user_id, $photo_path){

        $sql = "INSERT INTO photo_golf (golf_id, user_id, photo_path) VALUES (?, ? , ? )";

        $stmt = $this->getPDO()->prepare($sql);

        $stmt->bindParam(1, $golf_id);

        $stmt->bindParam(2, $user_id);

        $stmt->bindParam(3, $photo_path);

        $stmt->execute();
    }

    /**
     * @author Elie
     * function validate or devalidate photo resto
     */
    public function updateSatatusPhotoResto($id_gallery, $is_valid)
    {

        $statement = $this->getPDO()->PREPARE("UPDATE photo_resto SET is_valid = ? WHERE id = ?");
        $statement->bindParam(1, $is_valid, PDO::PARAM_INT);
        $statement->bindParam(2, $id_gallery, PDO::PARAM_INT);
        $statement->execute();
        $result = $statement->fetch(PDO::FETCH_ASSOC);
        return $result;
    }

    /**
     * @author Elie
     * function validate or devalidate photo golf
     */
    public function updateSatatusPhotoGolf($id_gallery, $is_valid)
    {

        $statement = $this->getPDO()->PREPARE("UPDATE photo_golf SET is_valid = ? WHERE id = ?");
        $statement->bindParam(1, $is_valid, PDO::PARAM_INT);
        $statement->bindParam(2, $id_gallery, PDO::PARAM_INT);
        $statement->execute();
        $result = $statement->fetch(PDO::FETCH_ASSOC);
        return $result;
    }

    /**
     * @author Elie
     * function delete photo resto
     */
    public function deletePhotoResto($id_gallery)
    {

        $statement = $this->getPDO()->PREPARE("DELETE FROM photo_resto WHERE id = ?");
        $statement->bindParam(1, $id_gallery, PDO::PARAM_INT);
        $statement->execute();
        $result = $statement->fetch(PDO::FETCH_ASSOC);
        return $result;
    }

    /**
     * @author Elie
     * function delete photo golf
     */
    public function deletePhotoGolf($id_gallery)
    {

        $statement = $this->getPDO()->PREPARE("DELETE FROM photo_golf WHERE id = ?");
        $statement->bindParam(1, $id_gallery, PDO::PARAM_INT);
        $statement->execute();
        $result = $statement->fetch(PDO::FETCH_ASSOC);
        return $result;
    }



}