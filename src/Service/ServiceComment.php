<?php
namespace App\Service;

use PDO;
use PDOException;
use App\Service\PDOConnexionService;

class ServiceComment  extends PDOConnexionService{

    private $pdo;

    
    public function findAllComments()
    {
        dd("findAllComments in ServiceComment");
        
        $statement = $this->getPDO()->prepare('SELECT * FROM user');
        $statement->execute();
        $result = $statement->fetchAll(PDO::FETCH_ASSOC);
        dd($result);
    }
}