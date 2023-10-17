<?php



namespace App\Service;

use App\Entity\HachageTribuTName;
use App\Repository\HachageTribuTNameRepository;
use PDO;
use Exception;
use PDOException;
use ArgumentCountError;
use App\Repository\BddRestoRepository;

class Tribu_T_ServiceNew extends PDOConnexionService
{
    
     /**
     * @author Nantenaina
     * où: on Utilise cette fonction dans la rubrique inscription cmz, 
     * localisation du fichier: dans Tribu_T_Service.php,
     * je veux: remplacer les colonnes tribu_t_owned et joined par les tables owned et joined
     * si une personne s'inscrit, on créera les tables owned et joined 
     * @param object $user : l'utilisateur connecté
     */
    public function createTableTribuTForUser($user){
        /*
         * Récuperer le nom de la table owned et joined
         */
        $tribuTOwned = $user->getTribuT();
        $tribuTJoined = $user->getTribuTJoined();
        $sql1 = "CREATE TABLE IF NOT EXISTS $tribuTOwned (
            `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
            `name_tribu_t_muable` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
            `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
            `logo_path` varchar(255) DEFAULT NULL,
            `nom_table_trbT` varchar(255) NOT NULL,
            `ext_restaurant` tinyint DEFAULT 0,
            `ext_golf` tinyint DEFAULT 0,
            `date_creation` datetime NOT NULL DEFAULT current_timestamp()
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;";

        $db=$this->getPDO();
        $prepare=$db->prepare($sql1);
        $prepare->execute();

        $sql2 = "CREATE TABLE IF NOT EXISTS $tribuTJoined (
            `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
            `user_id_owened` int(11) NOT NULL,
            `id_cle_valeur` int(11) NOT NULL,
            `date_adhesion` datetime NOT NULL DEFAULT current_timestamp()
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;";

        $prepare2=$db->prepare($sql2);
        $prepare2->execute();

    }

    /**
     * @author Nantenaina
     * où: on Utilise cette fonction dans la rubrique création tribu T cmz, 
     * localisation du fichier: dans Tribu_T_Service.php,
     * je veux: créer une tribu T
     * à executer après le hachage du nom de la table
     * @param object $user : l'utilisateur connecté
     */
    public function createTribuTOwned($user, $name_tribu_t_muable, $description, 
    $logo_path, $nomTableTribuT,$extensionRestaurant, $extensiongolf){
      $tribuTOwned = $user->getTribuT();
      $sql = "INSERT INTO $tribuTOwned (name_tribu_t_muable, description, logo_path,nom_table_trbT,ext_restaurant,ext_golf)
        VALUE (:name_tribu_t_muable, :description, :logo_path, :nom_table_trbT,
        :ext_restaurant,:ext_golf)";
      $db=$this->getPDO();
      $prepare=$db->prepare($sql);
      $prepare->bindParam(":name_tribu_t_muable",$name_tribu_t_muable,PDO::PARAM_STR);
      $prepare->bindParam(":description",$description,PDO::PARAM_STR);
      $prepare->bindParam(":logo_path",$logo_path,PDO::PARAM_STR);
      $prepare->bindParam(":nom_table_trbT",$nomTableTribuT,PDO::PARAM_STR);
      $prepare->bindParam(":ext_restaurant",$extensionRestaurant,PDO::PARAM_BOOL);
      $prepare->bindParam(":ext_golf",$extensiongolf,PDO::PARAM_BOOL);
      $prepare->execute();

      return  intval($db->lastInsertId());
    }

    /**
     * @author Nantenaina
     * où: on Utilise cette fonction dans la rubrique création tribu T cmz, 
     * localisation du fichier: dans Tribu_T_Service.php,
     * je veux: créer une tribu T
     * à executer pour le hachage du nom de la table
     * @param object $hachage : entité hachage
     */
    public function createHachage(
     $hachageRepo,
      $key, 
      $tribuTid, 
      $userId){
      $hachage=new HachageTribuTName();
      $hachage->setKey($key);
      $hachage->setTribuTID($tribuTid);
      $hachage->setUserId($userId);
      $hachageRepo->save($hachage, true);
    }

    /**
     * @author Nantenaina
     * où: on Utilise cette fonction dans la rubrique création tribu T cmz, 
     * localisation du fichier: dans Tribu_T_Service.php,
     * je veux: ajouter une nouvelle extension     
     * * à executer pour le hachage du nom de la table
     * @param object $hachage : entité hachage
     */
    public function createNewExtension($user,$extensionName,$idTribuT,$enableThisExtension){
        $tribuTOwned = $user->getTribuT();
        $sql="ALTER TABLE $tribuTOwned 
              ADD COlUMN $extensionName tinyint DEFAULT 0";

        $db=$this->getPDO();
        $prepare=$db->prepare($sql);
        $prepare->execute();

        if($enableThisExtension){
           $var=true;
           $sql="UPDATE $tribuTOwned SET $extensionName=:extensionName WHERE id=:id";
           $db=$this->getPDO();
           $prepare=$db->prepare($sql);
           $prepare->bindParam(":extensionName", $var,PDO::PARAM_BOOL);
           $prepare->bindParam(":id",$idTribuT,PDO::PARAM_INT);
           $prepare->execute();
        }
        
    }

}

