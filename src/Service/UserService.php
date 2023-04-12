<?php
namespace App\Service;

use PDO;
use PDOException;
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

    public function getUserFirstName($userId)
    {
        $statement = $this->getPDO()->prepare("select * from (select firstname,user_id  from consumer union select firstname,user_id from supplier) as tab where tab.user_id = $userId");
        $statement->execute();
        $result = $statement->fetch(PDO::FETCH_ASSOC);
        return $result["firstname"];
    }

    public function getUserLastName($userId)
    {

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
}