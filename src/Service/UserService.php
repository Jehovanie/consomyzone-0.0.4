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
}