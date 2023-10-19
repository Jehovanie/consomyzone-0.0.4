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
     * localisation du fichier: dans Tribu_T_ServiceNew.php,
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
            `user_id_owened` int(11) NOT NULL,s
            `nom_table_trbT` int(11) NOT NULL,
            `date_adhesion` datetime NOT NULL DEFAULT current_timestamp()
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;";

        $prepare2=$db->prepare($sql2);
        $prepare2->execute();

    }

    /**
     * @author Nantenaina
     * où: on Utilise cette fonction dans la rubrique création tribu T cmz, 
     * localisation du fichier: dans Tribu_T_ServiceNew.php,
     * je veux: créer une tribu T
     * à executer après le hachage du nom de la table
     * @param object $user : l'utilisateur connecté
     */
    public function addTribuTOwned($user, $name_tribu_t_muable, $description, 
    $logo_path, $nomTableTribuT,$extensionRestaurant, $extensiongolf)
    {
      
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
     * où: On Utilise cette fonction dans la rubrique invitation cmz, 
     * localisation du fichier: dans Tribu_T_ServiceNew.php,
     * je veux: joindre une tribu T
     * @param object $user : l'utilisateur connecté
     */
    public function addTribuTJoined($user, $userIdOwned, $tableTribuT)
    {
      $tribuTJoined = $user->getTribuTJoined();
      $sql = "INSERT INTO $tribuTJoined (user_id_owened, nom_table_trbT) VALUE (:user_id_owened, :nom_table_trbT)";
      $db=$this->getPDO();
      $prepare=$db->prepare($sql);
      $prepare->bindParam(":user_id_owened",$userIdOwned,PDO::PARAM_INT);
      $prepare->bindParam(":nom_table_trbT",$tableTribuT,PDO::PARAM_STR);
      $prepare->execute();
    }

    /**
     * @author Nantenaina
     * où: on Utilise cette fonction dans la rubrique création tribu T cmz, 
     * localisation du fichier: dans Tribu_T_ServiceNew.php,
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
     * localisation du fichier: dans Tribu_T_ServiceNew.php,
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
           $prepare=$db->prepare($sql);
           $prepare->bindParam(":extensionName", $var,PDO::PARAM_BOOL);
           $prepare->bindParam(":id",$idTribuT,PDO::PARAM_INT);
           $prepare->execute();
        }
        
    }

    /**
     * @author Nantenaina
     * où: on Utilise cette fonction dans la rubrique tribu T cmz, 
     * localisation du fichier: dans Tribu_T_ServiceNew.php,
     * je veux: avoir le nom complet d'un partisan     
     * @param int $userId : l'identifiant du partisan
     */
    public function getFullName($userId)

    {

        $statement = $this->getPDO()->prepare("SELECT * from (SELECT concat(firstname,' ', lastname) as fullname, user_id from consumer union SELECT concat(firstname,' ', lastname) as fullname, user_id from supplier) as tab where tab.user_id=$userId");

        $statement->execute();

        $result = $statement->fetch(PDO::FETCH_ASSOC);

        return $result["fullname"];

    }
    
    /**
     * @author Nantenaina
     * où: on Utilise cette fonction dans la rubrique création tribu T cmz, 
     * localisation du fichier: dans Tribu_T_ServiceNew.php,
     * je veux: créer toutes les tables relatives à une tribu T     
     * @param string $tableTribuT : le nom de la table tribu T
     * @param int $userId: l'identifiant du partisan qui crée la tribu T
     */
    public function generateTribuTTables($tableTribuT, $userId)

    {

      $sql = "CREATE TABLE IF NOT EXISTS " . $tableTribuT . " (

            id VARCHAR(300) NOT NULL PRIMARY KEY , 

            user_id int(11) NULL,
            
            roles VARCHAR(300) NOT NULL, 

            status TINYINT(1) DEFAULT 0, 

            datetime timestamp NOT NULL DEFAULT current_timestamp(),

            email VARCHAR(255) NULL
    
      )ENGINE=InnoDB";

      $db=$this->getPDO();

      $db->exec($sql);

      $data = "Insert into " . $tableTribuT . " (id, user_id, roles, status) values (UUID(), $userId, 'Fondateur', 1)";

      $final = $db->exec($data);

      if ($final > 0) {

          $query = "CREATE TABLE IF NOT EXISTS " . $tableTribuT . "_publication(

              id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT, 

              user_id int(11) NOT NULL,

              publication VARCHAR(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,

              confidentiality TINYINT(1) NOT NULL,

              photo VARCHAR(250),

              userfullname VARCHAR(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'inconnu',

              datetime timestamp NOT NULL DEFAULT current_timestamp(),

              FOREIGN KEY(user_id) REFERENCES user(id)

              ON DELETE CASCADE

              ON UPDATE CASCADE

              )ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci";

          $final2 = $db->exec($query);

          if ($final2 == 0) {

              $sql = "CREATE TABLE IF NOT EXISTS " . $tableTribuT . "_commentaire(

                  id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT, 

                  user_id int(11) NOT NULL,

                  pub_id int(11) NOT NULL,

                  commentaire VARCHAR(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,

                  audioname VARCHAR(250) NULL,

                  userfullname VARCHAR(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'inconnu',

                  datetime timestamp NOT NULL DEFAULT current_timestamp(),

                  FOREIGN KEY(user_id) REFERENCES user(id),

                  FOREIGN KEY(pub_id) REFERENCES " . $tableTribuT . "_publication(id)

                  ON DELETE CASCADE

                  ON UPDATE CASCADE

                  )ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci";

              $db->exec($sql);

              $sql = "CREATE TABLE IF NOT EXISTS " . $tableTribuT . "_reaction(

                  id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT, 

                  user_id int(11) NOT NULL,

                  pub_id int(11) NOT NULL,

                  reaction TINYINT(1) DEFAULT 0,

                  userfullname VARCHAR(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'inconnu',

                  datetime timestamp NOT NULL DEFAULT current_timestamp(),

                  FOREIGN KEY(user_id) REFERENCES user(id),

                  FOREIGN KEY(pub_id) REFERENCES " . $tableTribuT . "_publication(id)

                  ON DELETE CASCADE

                  ON UPDATE CASCADE

                  )ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci";

              $db->exec($sql);

          }
      }
    }

    /**
     * @author Nantenaina
     * où: On utilise cette fonction dans tous les ribriques qui ont besoin d'activation des extensions cmz, 
     * localisation du fichier: dans Tribu_T_ServiceNew.php,
     * je veux: créer toutes les tables relatives à une tribu T     
     * @param string $tableTribuT : Table tribu T
     * @param string $extension : extension pour la table tribu T
     * Cette fonction est utilisée pour la création de toute les tables des extensions
     * extensionId n'est autre que l'id des extensions
     */
    public function createExtensionDynamicTable($tableTribuT, $extension){

      $sql = "CREATE TABLE IF NOT EXISTS " . $tableTribuT . "_" . $extension . " (

          id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT, 
          extensionId VARCHAR(250) NOT NULL,
          denomination_f VARCHAR(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
          isPastilled tinyint(1) NULL  DEFAULT '1',
          datetime timestamp NOT NULL DEFAULT current_timestamp(),
          CONSTRAINT cst_extensionId UNIQUE (extensionId)
          )ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci";
      
      $stmt = $this->getPDO()->prepare($sql);

      $stmt->execute();

      $sql = "CREATE TABLE IF NOT EXISTS " . $tableTribuT . "_" . $extension . "_commentaire (

        id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT, 

        extensionId VARCHAR(250) NOT NULL,

        userId VARCHAR(250) NOT NULL,

        note decimal(3,2),

        commentaire TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,

        datetime timestamp NOT NULL DEFAULT current_timestamp())ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci";

      $stmt = $this->getPDO()->prepare($sql);

      $stmt->execute();
  }

  /**
     * @author Nantenaina
     * où: On utilise cette fonction pour retrouver toutes les tribus T Owned cmz, 
     * localisation du fichier: dans Tribu_T_ServiceNew.php,
     * je veux: avoir les informations de toutes les tribus T Owned     
     * @param object $user: l'utilisateur connecté
     */
  public function getAllTribuTOwnedInfos($user){
    $tribuTOwned = $user->getTribuT();
    $sql = "SELECT * FROM $tribuTOwned";
    $db = $this->getPDO();
    $stm = $db->prepare($sql);
    $stm->execute();
    $results = $stm->fetchAll(PDO::FETCH_ASSOC);
    return $results;
  }

  /**
   * @author Nantenaina
   * où: On utilise cette fonction pour retrouver toutes les tribus T Joined cmz, 
   * localisation du fichier: dans Tribu_T_ServiceNew.php,
   * je veux: avoir les tribus T Joined    
   * @param object $user: l'utilisateur connecté
   */
  public function getAllTribuTJoined($user){
    $tribuTJoined = $user->getTribuTJoined();
    $sql = "SELECT * FROM $tribuTJoined";
    $db = $this->getPDO();
    $stm = $db->prepare($sql);
    $stm->execute();
    $results = $stm->fetchAll(PDO::FETCH_ASSOC);
    return $results;
  }

   /**
   * @author Nantenaina
   * où: On utilise cette fonction pour retrouver toutes les tribus T Owned cmz, 
   * localisation du fichier: dans Tribu_T_ServiceNew.php,
   * je veux: avoir les informations de toutes les tribus T Owned     
   * @param object $user: l'utilisateur connecté
   */
  public function getAllTribuTJoinedInfos($user){
    $tribuTJoined = $this->getAllTribuTJoined($user);
    $allInfos = [];
    $db = $this->getPDO();
    foreach ($tribuTJoined as $key) {
      $userOwnedId = $key["user_id_owened"];
      $tableUserOwned = "tribu_t_o_".$userOwnedId;
      $sql = "SELECT * FROM $tableUserOwned WHERE nom_table_trbT = :nom_table_trbT";
      $stm = $db->prepare($sql);
      $stm->bindParam(":nom_table_trbT", $key["nom_table_trbT"], PDO::PARAM_STR);
      $stm->execute();
      $oneInfo = $stm->fetch(PDO::FETCH_ASSOC);
      $oneInfo["user_id_owened"] = $userOwnedId;
      $oneInfo["date_adhesion"] = $key["date_adhesion"];
      array_push($allInfos, $oneInfo);
    }
    return $allInfos;
  }

    /**
     * @author Nantenaina
     * où: On utilise cette fonction pour retrouver toutes les publications d'une tribu T cmz, 
     * localisation du fichier: dans Tribu_T_ServiceNew.php,
     * je veux: avoir toutes les publications d'une tribu T
     * @param string $tableTribu: 
     */
    public function getAllPublicationForOneTribuT($tableTribu){

      $statement = $this->getPDO()->prepare("SELECT * FROM $tableTribu" ."_publication ORDER BY datetime DESC;");

      $statement->execute();

      $publications = $statement->fetchAll(PDO::FETCH_ASSOC);

      return $publications;
    }

    /**
     * @author Nantenaina
     * où: On utilise cette fonction pour retrouver les informations d'une tribu T cmz, 
     * localisation du fichier: dans Tribu_T_ServiceNew.php,
     * je veux: avoir les informations d'une tribu T
     * @param string $tableTribuT: le nom de la table tribu T
     * @return array associative
     */
    public function getApropos($tableTribuT,$user=null){
      $userIdOwned = explode("u",$tableTribuT)[1];
      $userIdOwned = intval($userIdOwned);
      $userOwnedFullname = $this->getFullName($userIdOwned);
      $tableTribuTUserOwned = "tribu_t_o_".$userIdOwned;
      $db =$this->getPDO();
      $statement = $db->prepare("SELECT * FROM $tableTribuTUserOwned where nom_table_trbT = :nom_table_trbT");
      $statement->bindParam(":nom_table_trbT",$tableTribuT, PDO::PARAM_STR);
      $statement->execute();
      $apropos = $statement->fetch(PDO::FETCH_ASSOC);
      
      if($user){
        $userId = $user->getId();
        if($userId == $userIdOwned){
          $apropos["isFondateur"] = true;
        }else{
          $apropos["isFondateur"] = false;
        }
      }

      $apropos["fondateurName"] = $userOwnedFullname;
      $apropos["name_tribu_t_muable"] = json_decode($this->convertUnicodeToUtf8($apropos["name_tribu_t_muable"]),true);
      $apropos["description"] = json_decode($this->convertUnicodeToUtf8($apropos["description"]),true);
      return $apropos;
    }

    /**
     * @author Nantenaina
     * où: On utilise cette fonction pour retrouver toutes les publications, commentaires et réactions dans une tribu T cmz, 
     * localisation du fichier: dans Tribu_T_ServiceNew.php,
     * je veux: avoir toutes les publications, commentaires et réactions dans une tribu T
     * @param string $tableTribu: 
    */
    public function getPubCommentAndReaction($tableTribu,$min=null, $max=null){

      $resultats = [];
 
      $apropo_tribuT = $this->getApropos($tableTribu);
     
      if( !$apropo_tribuT ){
          return $resultats;
      }

      $publications = $this->getAllPublicationForOneTribuT($tableTribu);

      $db = $this->getPDO();
      
      if(count($publications) > 0 ){

          foreach( $publications as $d_pub ){
  
              $publication_id = $d_pub["id"];
              $publication_user_id= $d_pub["user_id"];
              $statement_photos = $db->prepare("SELECT photo_profil FROM (SELECT photo_profil, user_id FROM consumer union SELECT photo_profil, user_id FROM supplier) as tab WHERE tab.user_id = $publication_user_id");
              $statement_photos->execute();
              $photo_profil = $statement_photos->fetch(PDO::FETCH_ASSOC); /// [ photo_profil => ...]
              $statement = $db->prepare("SELECT * FROM $tableTribu"."_commentaire WHERE pub_id = '" .$publication_id . "'");
              $statement->execute();
              $comments = $statement->fetchAll(PDO::FETCH_ASSOC); /// [...comments ]
              $statement = $db->prepare("SELECT * FROM $tableTribu"."_reaction WHERE pub_id = '" .$publication_id . "' AND reaction= '1'");
              $statement->execute();
              $reactions = $statement->fetchAll(PDO::FETCH_ASSOC);
             
              $data= [
                  "userOwnPub" => [
                      "id" => $d_pub["user_id"],
                      "profil" => $photo_profil["photo_profil"],
                      "fullName" => json_decode($this->convertUnicodeToUtf8($d_pub["userfullname"]),true),
                  ],
                  
                  "publication" => [
                      "id" => $d_pub["id"],
                      "confidentiality" => $d_pub['confidentiality'],
                      "description" => json_decode($this->convertUnicodeToUtf8($d_pub['publication']), true),
                      "image" => $d_pub['photo'],
                      "createdAt" => $d_pub["datetime"],
                      "comments" => $comments,
                      "reactions" => $reactions,
                  ],
                  "tribu" => [
                      "type" => "Tribu T",
                      "name" => json_decode($this->convertUnicodeToUtf8($apropo_tribuT['name_tribu_t_muable']),true),
                      "description" => json_decode($this->convertUnicodeToUtf8($apropo_tribuT['description']),true),
                      "avatar" =>  $apropo_tribuT['logo_path'],
                      "table" => $tableTribu,
                      "ext_restaurant" => $apropo_tribuT['ext_restaurant'],
                      "ext_golf" => $apropo_tribuT['ext_golf'],
                      "date_creation" => $apropo_tribuT['date_creation']
                  ]
              ];
  
              array_push($resultats, $data);
          }
      }

      return $resultats; 
    }

}

