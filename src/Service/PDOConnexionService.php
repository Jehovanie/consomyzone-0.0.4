<?php
namespace App\Service;

use PDO;
use PDOException;

class PDOConnexionService
{
    private $pdo;
    public function getPDO()
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


    public function isTableExist($tableName){
        $db = $_ENV["DATABASENAME"];

        $query = "SHOW TABLES FROM $db like '$tableName'";
        $sql = $this->getPDO()->query($query);
        $resultat = $sql->rowCount();

        return $resultat > 0 ? true : false;
    }

    public function convertUtf8ToUnicode($str){
        return json_encode($str);
    }

    public function convertUnicodeToUtf8($str){
        return preg_replace_callback('/\\\\u([0-9a-fA-F]{4})/', function ($match) {
                    return mb_convert_encoding(pack('H*', $match[1]), 'UTF-8', 'UCS-2BE');
                },$str);
    }
}