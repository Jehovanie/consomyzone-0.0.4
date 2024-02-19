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

    /**
     * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
     * 
     * Goal: Check if this table is already exists.
     * 
     * @param string $tableName name of the table to check;
     * 
     * @return boolean true: exist, false: not exist.
     */
    public function isTableExist($tableName){
        $db = $_ENV["DATABASENAME"];

        $query = "SHOW TABLES FROM $db like '$tableName'";
        $sql = $this->getPDO()->query($query);
        $resultat = $sql->rowCount();

        return $resultat > 0 ? true : false;
    }

    /**
     * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
     * 
     * Goal: Check if colum is already exists in specific table.
     * 
     * @param string $tableName name of the table to check
     * @param string $columName name of the column to check
     * 
     * @return boolean true: exist, false: not exist.
     */
    public function isColumnExist($tableName, $columnName){
        $query= "SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name = :table_name AND column_name = :column_name";
        
        $sql = $this->getPDO()->prepare($query);

        $sql->bindParam(':table_name', $tableName);
        $sql->bindParam(':column_name', $columnName);
        $sql->execute();

        $resultat = $sql->fetch(PDO::FETCH_ASSOC);
        return !!$resultat;

    }

    public function convertUtf8ToUnicode($str){
        return json_encode($str);
    }

    public function convertUnicodeToUtf8($str){
        return preg_replace_callback('/\\\\u([0-9a-fA-F]{4})/', function ($match) {
                    return mb_convert_encoding(pack('H*', $match[1]), 'UTF-8', 'UCS-2BE');
                },$str);
    }

    /**
     * @author Jehovanie RAMANDRIJOEL <jehovanierama@gmail.com>
     * 
     * Goal: Gerenate strong unique id
     * 
     * @return new unique id; 
     */
    public function generateUniqueID(){
        $unique_id = md5(uniqid(mt_rand(), true));
        return $unique_id;
    }
}