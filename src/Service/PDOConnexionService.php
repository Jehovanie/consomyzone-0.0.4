<?php
namespace App\Service;

use PDO;
use PDOException;

class PDOConnexionService
{
    private $pdo;
    protected function getPDO()
    {
        $servername = $_ENV["SERVERNAME"];
        $username = $_ENV["USER"];
        $password = $_ENV["PASSWORD"];
        $dbname = $_ENV["DATABASENAME"];
        try {
            $this->pdo = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
            $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $e) {
            echo "Connection failed : " . $e->getMessage();
        }
        return $this->pdo;
    }
}