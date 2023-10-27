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
            `user_id_owened` int(11) NOT NULL,
            `nom_table_trbT` varchar(255) NOT NULL,
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
        $logo_path, $nomTableTribuT,$extensionRestaurant, $extensiongolf
    )
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

              /**
               * @author Elie <eliefenohasina@gmail.com>
               * Creation d'un table invitation story pour tribu T
              */
              $query_table_invitation = "CREATE TABLE IF NOT EXISTS " . $tableTribuT . "_invitation(
                id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
                user_id int(11) NOT NULL,
                email varchar(255) NOT NULL,
                is_valid tinyint(1) NOT NULL DEFAULT 0,
                datetime DATETIME NOT NULL DEFAULT current_timestamp()
              ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci";

             $this->getPDO()->exec($query_table_invitation);

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
    $results= [];
    if( !$user ){
      return $results;
    }

    $tribuTOwned = $user->getTribuT();

    if( !$tribuTOwned ){
      return $results;
    }
    
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
    $results= [];
    $tribuTJoined = $user->getTribuTJoined();

    if( !$tribuTJoined ){
      return $results;
    }

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
                      "fullName" => $d_pub["userfullname"]
                  ],
                  
                  "publication" => [
                      "id" => $d_pub["id"],
                      "confidentiality" => $d_pub['confidentiality'],
                      "description" => json_decode($this->convertUnicodeToUtf8($d_pub['publication']), true),
                      "image" => $d_pub['photo'],
                      "createdAt" => $d_pub["datetime"],
                      "comments" => $comments,
                      "reactions" => $reactions
                  ],
                  "tribu" => [
                      "type" => "Tribu T",
                      "name" => $apropo_tribuT['name_tribu_t_muable'],
                      "description" => $apropo_tribuT['description'],
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

    /**
     * @author Nantenaina
     * où: On utilise cette fonction pour retrouver toutes les publications, commentaires et réactions dans une tribu T cmz, 
     * localisation du fichier: dans Tribu_T_ServiceNew.php,
     * je veux: avoir toutes les publications, commentaires et réactions dans une tribu T
     * @param string $tableTribu: 
    */
    public function getPublicationSpecificTribuT($tableTribu,$idMax,$limits){
      $resultF=[];
      $table_publication_Tribu_T = $tableTribu."_publication";
      $table_commentaire_Tribu_T = $tableTribu."_commentaire"; 
      if($idMax == 0){
          $sql = "SELECT * FROM $table_publication_Tribu_T as t1 LEFT JOIN(SELECT pub_id ,count(*)"
          . "as nbr FROM $table_commentaire_Tribu_T group by pub_id ) as t2 on t1.id=t2.pub_id  ORDER BY t1.id DESC LIMIT :limits ";
         
          $stmt = $this->getPDO()->prepare($sql);
          $stmt->bindValue(':limits', $limits, PDO::PARAM_INT); 
          $stmt->execute();
          $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

          // t1.id= t2.pub_id
      }else{
          $sql = "SELECT * FROM $table_publication_Tribu_T  as t1 LEFT JOIN(SELECT pub_id ,count(*)"
          . "as nbr FROM $table_commentaire_Tribu_T  group by pub_id ) as t2 on t1.id= t2.pub_id   where  t1.id < :idMax ORDER BY id DESC LIMIT :limits";
          $stmt = $this->getPDO()->prepare($sql);
          $stmt->bindValue(':idMax', $idMax, PDO::PARAM_INT); 
          $stmt->bindValue(':limits', $limits, PDO::PARAM_INT); 
          $stmt->execute();
          $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
         
      }

      //get about tribu T
      $about=$this->getApropos($tableTribu);

      foreach($results as $result){
          $result["publication"]=$this->convertUnicodeToUtf8($result["publication"]);
          array_push($resultF,$result);
      }
      $resultF=array("publication"=>$resultF,"about"=>$about);
      
      return $resultF;
      
    }

    function createOnePub($table_pub, $user_id, $publication, $confidentiality, $photo){

      $statement = $this->getPDO()->prepare("INSERT INTO $table_pub (user_id, publication, confidentiality, photo, userfullname) values (:user_id, :publication, :confidentiality, :photo, :userfullname)");

      $userfullname = $this->getFullName($user_id);

      $statement->bindParam(':user_id', $user_id);

      $statement->bindParam(':publication', $publication);

      $statement->bindParam(':confidentiality', $confidentiality);

      $statement->bindParam(':photo', $photo);

      $statement->bindParam(':userfullname', $userfullname);

      $result = $statement->execute();

      return $result;

  }

    public function getEntityRestoPastilled($tribu_t_owned){
      $arrayIdResto = [];
      if( count($tribu_t_owned) > 0 ){
        foreach ($tribu_t_owned as $key) {
            $tableTribu = $key["nom_table_trbT"];
            $tableExtension = $tableTribu . "_restaurant";
            if($key["ext_restaurant"]){
                $all_id_resto_pastille = $this->getAllIdRestoPastille($tableExtension, true);  // [ [ extensionId => ..., tableName => ... ], ... ]
                if( count($all_id_resto_pastille) > 0 ){
                    foreach ($all_id_resto_pastille as $id_resto_pastille){
                        $temp = [
                            "id_resto" => $id_resto_pastille["extensionId"],
                            "tableName" => $id_resto_pastille["tableName"],
                            "name_tribu_t_muable" => $key["name_tribu_t_muable"],
                            "logo_path" => $key["logo_path"]
                        ];

                        array_push($arrayIdResto, $temp);
                    }
                }
            }
        }
    }

      return $arrayIdResto;
  }

  public function getAllIdRestoPastille($table, $isPastilled){

    $statement = $this->getPDO()->prepare("SELECT extensionId, '$table' as 'tableName' FROM $table WHERE isPastilled = $isPastilled");

    $statement->execute();

    $result = $statement->fetchAll(PDO::FETCH_ASSOC);

    return $result;
  }

  /**
     * @author Jean Gilbert RANDRIANANTENAINASOA <nantenainasoa39@gmail.com>
     * 
     * @param string $tableNameExtension: le nom de la table extension
     * 
     * @param int $idResto: l'extension
     * @return number $result: 0 or if(not exists) else positive number
     */
    public function checkIfCurrentRestaurantPastilled($tableNameExtension, int $idResto, $isPastilled){

        
      $statement = $this->getPDO()->prepare("SELECT id FROM $tableNameExtension WHERE extensionId = $idResto AND isPastilled = $isPastilled");

      $statement->execute();

      $result = $statement->fetch();

      if(is_array($result)){
          return true;
      }else{
          return false;
      }

  }

  public function getIdRestoOnTableExtension($table, $idResto){

      $statement = $this->getPDO()->prepare("SELECT * FROM $table WHERE extensionId = $idResto");

      $statement->execute();

      $result = $statement->fetchAll(PDO::FETCH_ASSOC);

      return $result;
  }

  public function depastilleOrPastilleRestaurant($table_resto, $resto_id, $isPastilled){
    $sql = "UPDATE $table_resto SET isPastilled = :isPastilled WHERE extensionId = :resto_id";
    $stmt = $this->getPDO()->prepare($sql);
    $stmt->bindParam(":isPastilled", $isPastilled);
    $stmt->bindParam(":resto_id", $resto_id);
    $stmt->execute();

  }

  public function getRestoPastilles($tableResto, $tableComment){
    
    // $sql = "SELECT * FROM (SELECT  id, id_resto,denomination_f, isPastilled, id_resto_comment,id_restaurant,id_user,note,commentaire ,
    //         GROUP_CONCAT(t2.id_user) as All_user ,GROUP_CONCAT(t2.commentaire) as All_com,FORMAT(AVG(t2.note),2) as globalNote, COUNT(t2.id_restaurant) as nbrAvis ,
    //         GROUP_CONCAT(t2.id_resto_comment) as All_id_r_com FROM $tableResto  as t1 LEFT JOIN $tableComment  as t2  ON t2.id_restaurant =t1.id_resto GROUP BY t1.id ) 
    // as tb1 INNER JOIN bdd_resto ON tb1.id_resto=bdd_resto.id";

    $sql="SELECT * FROM (SELECT t1.id , t2.id as id_resto_comment, t1.extensionId as id_resto,t1.denomination_f, 
                          t1.isPastilled, t2.extensionId as id_restaurant, t2.userId as id_user,t2.note,t2.commentaire,
                          GROUP_CONCAT(t2.userId) as All_user ,GROUP_CONCAT(t2.commentaire) as All_com,FORMAT(AVG(t2.note),2) as globalNote, COUNT(t2.extensionId) as nbrAvis ,
                          GROUP_CONCAT(t2.id) as All_id_r_com
                          FROM  $tableResto as t1 left join $tableComment  as t2 on t1.extensionId=t2.extensionId where  t1.isPastilled IS TRUE GROUP BY t1.id ) as tableRestCom  
          INNER JOIN bdd_resto ON tableRestCom.id_resto=bdd_resto.id";
    $stmt = $this->getPDO()->prepare($sql);
     
    $stmt->execute();
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
    return $result;

}

public function getGolfPastilles($tableGolf, $tableComment){
    
  // $sql = "SELECT * FROM (SELECT  id, id_resto as id_golf,denomination_f as nom_golf, isPastilled, id_resto_comment as id_golf_comment,id_restaurant  as id_extension,id_user,note,commentaire ,
  //         GROUP_CONCAT(t2.id_user) as All_user ,GROUP_CONCAT(t2.commentaire) as All_com,FORMAT(AVG(t2.note),2) as globalNote, COUNT(t2.id_restaurant) as nbrAvis ,
  //         GROUP_CONCAT(t2.id_resto_comment) as All_id_r_com FROM $tableGolf  as t1 LEFT JOIN $tableComment  as t2  ON t2.id_restaurant =t1.id_resto GROUP BY t1.id ) 
  // as tb1 INNER JOIN golffrance ON tb1.id_golf=golffrance.id";

  // $stmt = $this->getPDO()->prepare($sql);
   
  // $stmt->execute();
  // $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
  // return $result;

  $sql="SELECT * FROM (SELECT t1.id , t2.id as id_resto_comment, t1.extensionId as id_golf,t1.denomination_f, 
                          t1.isPastilled, t2.extensionId as id_golf_comment, t2.userId as id_user,t2.note,t2.commentaire,
                          GROUP_CONCAT(t2.userId) as All_user ,GROUP_CONCAT(t2.commentaire) as All_com,FORMAT(AVG(t2.note),2) as globalNote, COUNT(t2.extensionId) as nbrAvis ,
                          GROUP_CONCAT(t2.id) as All_id_r_com
                          FROM  $tableGolf as t1 left join $tableComment  as t2 on t1.extensionId=t2.extensionId where  t1.isPastilled IS TRUE GROUP BY t1.id ) as tableRestCom  
          INNER JOIN golffrance ON tableRestCom.id_golf=golffrance.id";
    $stmt = $this->getPDO()->prepare($sql);
     
    $stmt->execute();
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
    return $result;

}

public function hasTableResto($table){

  $db = $_ENV["DATABASENAME"];

  $query = "SHOW TABLES FROM $db like '%$table%'";

  $sql = $this->getPDO()->query($query);

  $resultat = $sql->rowCount();

  if($resultat>0){
      return true;
  }else{
      return false;
  }
}

public function sendCommentRestoPastilled($tableName,$idResto,$idUser,$note,$commentaire){
  $values=array(":id_restaurant"=>$idResto,
      ":id_user"=>$idUser,
      ":note"=>$note,
      ":commentaire"=>$commentaire
  );
  $sql= "INSERT INTO " .$tableName. "(extensionId,userId,note,commentaire)". 
            "VALUES (:id_restaurant, :id_user,:note,:commentaire)";
  $stmt = $this->getPDO()->prepare($sql);

  return $stmt->execute($values);
      
}

public function getAllAvisByRestName($tableResto,$id){
  $data=[
      ":id"=>$id
  ];
  $sql="SELECT * FROM $tableResto as t1 LEFT JOIN user as t2 ON t1.userId = t2.id where t1.extensionId = :id";
  $stmt = $this->getPDO()->prepare($sql);
  $stmt->execute($data);
  $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
  return $result;
}

    /**
     * @author nantenainasoa39@gmail.com <email>
     * 
     */
    function updateTribuTInfos($tableTribuT, $name_tribu_t_muable, $description, $logo_path, $ext_restaurant, $ext_golf)

    {

      $userIdOwned = explode("u",$tableTribuT)[1];
      $userIdOwned = intval($userIdOwned);
      $tableTribuTUserOwned = "tribu_t_o_".$userIdOwned;
      $db = $this->getPDO();
      $statement = $db->prepare("UPDATE $tableTribuTUserOwned SET name_tribu_t_muable = :name_tribu_t_muable, 
        `description` = :description, logo_path = :logo_path, ext_restaurant = :ext_restaurant, 
        ext_golf = :ext_golf WHERE nom_table_trbT  = :tableTribuT");
      $statement->bindParam(":name_tribu_t_muable",$name_tribu_t_muable);
      $statement->bindParam(":description",$description);
      $statement->bindParam(":logo_path",$logo_path);
      $statement->bindParam(":ext_restaurant",$ext_restaurant);
      $statement->bindParam(":ext_golf",$ext_golf);
      $statement->bindParam(":tableTribuT",$tableTribuT);
      $statement->execute();
    }

     /**
     * Update Status of pedding invitation to accepted on the tribut T
     * @param string $tableName: Name of the table
     * @param int $user_id: ID of the user
     * @param int $status: Status of the invitation to accepted on the tribut
     * 
     */
    public function updateMember($tableName, $user_id, $status)

    {
        $query = "UPDATE $tableName set status = ? WHERE user_id = ?";
        $stmt = $this->getPDO()->prepare($query);
        $stmt->execute([$status, $user_id]);
    }

    function getRole($table, $userId)
    {
        $statement = $this->getPDO()->prepare("SELECT roles as result FROM $table WHERE user_id  = $userId LIMIT 1");
        $statement->execute();
        $result = $statement->fetch(PDO::FETCH_ASSOC);
        return $result["result"];

    }

    public function getAllPartisanProfil($tableTribuT){
        
      if($this->isTableExist($tableTribuT)){
          $sql= "SELECT id, user_id, roles  FROM $tableTribuT WHERE status LIKE '1'";
          $stmt = $this->getPDO()->prepare($sql);
          $stmt->execute();
          $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

          return $results;
      }
      return [];
  }

}

