<?php

namespace App\Service;

use PDO;
use PDOException;
use App\Entity\User;
use App\Repository\UserRepository;
use App\Service\PDOConnexionService;
use App\Repository\ConsumerRepository;
use App\Repository\SupplierRepository;

class UserService  extends PDOConnexionService
{

    private $userRepository;
    private $consumerRepository;
    private $supplierRepository;

    public function __construct(
        UserRepository $userRepository,
        ConsumerRepository $consumerRepository,
        SupplierRepository $supplierRepository
    ) {
        $this->userRepository = $userRepository;
        $this->consumerRepository = $consumerRepository;
        $this->supplierRepository = $supplierRepository;
    }

    public function getUserFirstName($userId)
    {
        $statement = $this->getPDO()->prepare("select * from (select firstname,user_id  from consumer union select firstname,user_id from supplier) as tab where tab.user_id = $userId");
        $statement->execute();
        $result = $statement->fetch(PDO::FETCH_ASSOC);
        if ($result) {
            return $result["firstname"];
        } else {
            return "Postulant";
        }
    }

    public function getUserLastName($userId)
    {
        $statement = $this->getPDO()->prepare("select * from (select lastname,user_id  from consumer union select lastname,user_id from supplier) as tab where tab.user_id = $userId");
        $statement->execute();
        $result = $statement->fetch(PDO::FETCH_ASSOC);

        if ($result) {
            return $result["lastname"];
        } else {
            return "non inscrit";
        }
    }

    public function getFullName($userId)
    {
        return $this->getUserFirstName($userId) . " " . $this->getUserLastName($userId);
    }


    public function getUserProfileFromId(int $userId)
    {

        $user_temp = $this->userRepository->find($userId);

        if ($user_temp->getType() === "consumer") {
            $profil_temp = $this->consumerRepository->findOneBy(["userId" => $user_temp->getId()]);
        } else {
            $profil_temp = $this->supplierRepository->findOneBy(["userId" => $user_temp->getId()]);
        }

        return $profil_temp;
    }

    public function getTribuByIdUser($user_id)
    {

        $profil_user = $this->userRepository->find($user_id);

        $all_tribuT = [];

        $json_tribuT_owned = $profil_user->getTribuT();

        if ($json_tribuT_owned) {
            $decode_tribuT_owned = json_decode($json_tribuT_owned, true);
            if (!array_key_exists("name", $decode_tribuT_owned['tribu_t'])) {
                foreach ($decode_tribuT_owned["tribu_t"] as $tribuT) {

                    extract($tribuT);  /// $name
                    array_push($all_tribuT, ["table_name" => $name, "name_tribu_t_muable" => $name_tribu_t_muable, "logo_path" => $logo_path, "role" => "Fondateur"]);
                }
            } else {
                array_push($all_tribuT, ["table_name" => $decode_tribuT_owned['tribu_t']['name'], "name_tribu_t_muable" => $decode_tribuT_owned['tribu_t']['name_tribu_t_muable'], "logo_path" => $decode_tribuT_owned['tribu_t']['logo_path'], "role" => "Fondateur"]);
            }
        }

        $json_tribuT_joined = $profil_user->getTribuTJoined();

        if ($json_tribuT_joined) {

            $decode_tribuT_joined = json_decode($json_tribuT_joined, true);

            if (!array_key_exists("name", $decode_tribuT_joined['tribu_t'])) {
                foreach ($decode_tribuT_joined["tribu_t"] as $tribuT) {
                    extract($tribuT);  /// $name
                    array_push($all_tribuT, ["table_name" => $name, "name_tribu_t_muable" => $name_tribu_t_muable, "logo_path" => $logo_path, "role" => "Membre"]);
                }
            } else {
                array_push($all_tribuT, ["table_name" => $decode_tribuT_joined['tribu_t']['name'], "name_tribu_t_muable" => $decode_tribuT_joined['tribu_t']['name_tribu_t_muable'], "logo_path" => $decode_tribuT_joined['tribu_t']['logo_path'], "role" => "Membre"]);
            }
        }

        return $all_tribuT;
    }

    public function getMembreTribuT($table)
    {

        $statement = $this->getPDO()->prepare("SELECT * FROM $table WHERE status = 1 and user_id IS NOT NULL GROUP BY user_id");
        $statement->execute();
        $result = $statement->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function isPseudoExist($pseudo)
    {
        $statement = $this->getPDO()->prepare("SELECT IF(EXISTS (SELECt * FROM `user` WHERE pseudo=:pseudo),true,false) as result");
        $statement->bindParam(":pseudo", $pseudo, PDO::PARAM_STR);
        $statement->execute();
        $result = $statement->fetch(PDO::FETCH_ASSOC);
        return $result;
    }

    public function generatePseudo($pseudo)
    {
        $statement = $this->getPDO()->prepare("CALL generate_randompseudo_from_user_pseudo_v2(?)");
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
    public function updateUserIDLE($userID, $idle)
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
    public function lookForOtherFan($word, $myid)
    {
        $sql = "SELECT * FROM `consumer` WHERE (firstname like '%$word%' or lastname like '%$word%' or match(firstname) AGAINST(?) or match (lastname) AGAINST(?)) and user_id !=? ;";
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
    public function insertPhotoResto($resto_id, $user_id, $photo_path)
    {

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
    public function insertPhotoGolf($golf_id, $user_id, $photo_path)
    {

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

    /**
     * @author Elie
     * Fetch photo not valid resto
     */
    public function getAllPhotoNotValidResto()
    {

        $statement = $this->getPDO()->PREPARE("SELECT photo_resto.id as id_gallery, resto_id as id_rubrique, date_creation, photo_path, denomination_f, photo_resto.user_id as user_id, 
        concat(numvoie, \" \", typevoie,\" \",  nomvoie, \" \", compvoie, \" \", codpost, \" \", bdd_resto.commune) as adresse, concat(firstname, \" \", lastname) as username FROM photo_resto 
        INNER JOIN bdd_resto ON photo_resto.resto_id = bdd_resto.id INNER JOIN (SELECT user_id, firstname, lastname FROM consumer UNION SELECT user_id, firstname, lastname FROM supplier) as partisan ON photo_resto.user_id = partisan.user_id WHERE is_valid = 0");
        $statement->execute();
        $result = $statement->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    /**
     * @author Elie
     * Fetch photo not valid golf
     */
    public function getAllPhotoNotValidGolf()
    {

        $statement = $this->getPDO()->PREPARE("SELECT photo_golf.id as id_gallery, golf_id as id_rubrique, date_creation, photo_path, nom_golf as denomination_f, photo_golf.user_id as user_id, 
        concat(adr1, \" \", cp,\" \",  nom_commune) as adresse, concat(firstname, \" \", lastname) as username FROM photo_golf 
        INNER JOIN golffrance ON photo_golf.golf_id = golffrance.id INNER JOIN (SELECT user_id, firstname, lastname FROM consumer UNION SELECT user_id, firstname, lastname FROM supplier) as partisan ON photo_golf.user_id = partisan.user_id WHERE is_valid = 0");
        $statement->execute();
        $result = $statement->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    /**
     * @author Nantenaina
     * Où : On utilise cette fonction dans l'onglet abonnement de la page profil utilisateur
     * Localisation du fichier : UserService.php
     * Je veux : tester si la table abonnement existe
     * 
     */
    public function checkIfAbonnementTable()
    {

        $db = $_ENV["DATABASENAME"];

        $query = "SHOW TABLES FROM $db like 'abonnement'";

        $sql = $this->getPDO()->query($query);

        $rowsNumber = $sql->rowCount();

        return $rowsNumber;
    }

    /**
     * @author Nantenaina
     * Où : On utilise cette fonction dans l'onglet abonnement de la page profil utilisateur
     * Localisation du fichier : UserService.php
     * Je veux : créer la table abonnement s'il n'existe pas
     * 
     */
    public function createAbonnementOldTable()
    {

        $sql = "CREATE TABLE  IF NOT EXISTS `abonnement` (
            `id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
            `userId` int(11) NOT NULL,
            `firstOption` decimal(10,3) NOT NULL,
            `secondOption` decimal(10,3) NOT NULL,
            `thirdOption` decimal(10,3) NOT NULL,
            `fourthOption` decimal(10,3) NOT NULL,
            `fifthOption` decimal(10,3) NOT NULL,
            `dateSoumission` datetime NOT NULL DEFAULT current_timestamp()
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci";

        $this->getPDO()->exec($sql);
    }

    /**
     * @author Nantenaina
     * Où : On utilise cette fonction dans l'onglet abonnement de la page profil utilisateur
     * Localisation du fichier : UserService.php
     * Je veux : créer la table abonnement s'il n'existe pas
     * 
     */
    public function createAbonnementTable()
    {

        $sql = "CREATE TABLE  IF NOT EXISTS `abonnement` (
            `id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
            `userId` int(11) NOT NULL,
            `typeAbonnement` tinyint(1) NOT NULL DEFAULT 0,
            `montant` decimal(10,3) NOT NULL,
            `dateSoumission` datetime NOT NULL DEFAULT current_timestamp()
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci";

        $this->getPDO()->exec($sql);
    }

    /**
     * @author Nantenaina
     * Où : On utilise cette fonction dans l'onglet abonnement de la page profil utilisateur
     * Localisation du fichier : UserService.php
     * Je veux : enregistrer un abonnement
     * @param int $userId : identifiant de l'utilisateur connecté
     * @param float $firstOption : Cotisations
     * @param float $secondOption : Participation supplémentaire 
     * @param float $thirdOption : Cotisation tribu 
     * @param float $fourthOption : Participation verte 
     * @param float $fifthOption : Participation bleue
     */
    public function saveAbonnement($userId, $firstOption, $secondOption, $thirdOption, $fourthOption, $fifthOption)
    {

        $statement = $this->getPDO()->prepare("INSERT INTO abonnement (userId, firstOption, secondOption, thirdOption, fourthOption, fifthOption) values (:userId, :firstOption, :secondOption, :thirdOption, :fourthOption, :fifthOption)");

        $statement->bindParam(':userId', $userId);

        $statement->bindParam(':firstOption', $firstOption);

        $statement->bindParam(':secondOption', $secondOption);

        $statement->bindParam(':thirdOption', $thirdOption);

        $statement->bindParam(':fourthOption', $fourthOption);

        $statement->bindParam(':fifthOption', $fifthOption);

        $statement->execute();
    }

    /**
     * @author Nantenaina
     * Où : On utilise cette fonction dans l'onglet abonnement de la page profil utilisateur
     * Localisation du fichier : UserService.php
     * Je veux : enregistrer un abonnement
     * @param int $userId : identifiant de l'utilisateur connecté
     * @param int $typeAbonnement : Cotisations => 1, Participation supplémentaire => 2, Cotisation tribu => 3, Participation verte => 4, Participation bleue => 5
     * @param float $montant : le montant saisi
     */
    public function saveOneAbonnement($userId, $typeAbonnement, $montant)
    {

        $statement = $this->getPDO()->prepare("INSERT INTO abonnement (userId, typeAbonnement, montant) values (:userId, :typeAbonnement, :montant)");

        $statement->bindParam(':userId', $userId);

        $statement->bindParam(':typeAbonnement', $typeAbonnement);

        $statement->bindParam(':montant', $montant);

        $statement->execute();
    }



    /**
     * @author Tommy
     * Où : On utilise cette fonction dans l'onglet abonnementHistorique de la page profil utilisateur
     * Localisation du fichier : UserService.php
     * Je veux : afficher l'historique d'abonnementHistorique par utilisateur
     * @param int $userId : identifiant de l'utilisateur connecté
     * @return array $result : Tableau associatif
     */
    public function getAbonnementByUserHistorique($userId)
    {
        $statement = $this->getPDO()->prepare("SELECT * FROM historique_abonnement WHERE user_id = :userId ORDER BY id DESC");
        $statement->bindParam(':userId', $userId);
        $statement->execute();
        $result = $statement->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    /**
     * @author Nantenaina
     * Où : On utilise cette fonction dans l'onglet abonnement de la page profil utilisateur
     * Localisation du fichier : UserService.php
     * Je veux : afficher l'historique d'abonnement par utilisateur
     * @param int $userId : identifiant de l'utilisateur connecté
     * @return array $result : Tableau associatif
     */
    public function getAbonnementByUser($userId)
    {
        $statement = $this->getPDO()->prepare("SELECT * FROM abonnement WHERE user_id = :userId ORDER BY id DESC");
        $statement->bindParam(':userId', $userId);
        $statement->execute();
        $result = $statement->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    /**
     * @author Nantenaina
     * Où : On utilise cette fonction dans l'onglet abonnement de la page Super Admin
     * Localisation du fichier : UserService.php
     * Je veux : afficher l'historique de tous les abonnements
     * @return array $result : Tableau associatif
     */
    public function getAllAbonnement()
    {
        $statement = $this->getPDO()->prepare("SELECT * FROM abonnement ORDER BY id DESC");
        $statement->execute();
        $result = $statement->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    /**
     * @author Nantenaina
     * Où : On utilise cette fonction pour l'ajout d'un parain ou filleuil
     * Localisation du fichier : UserService.php
     * Je veux : enregistrer un parain ou filleuil
     * @param string $tableParrainage : table parrainage
     * @param int $user_id : identifiant de parain ou filleuil
     * @param string $tribu : table tribu
     * @param int $isParent : parain => 1, filleuil => 0
     * @param int $status : terminé => 1, non terminé => 0
     */
    public function saveOneParainOrFilleuil($tableParrainage, $user_id, $tribu, $isParent, $status)
    {

        $statement = $this->getPDO()->prepare("INSERT INTO " . $tableParrainage . " (user_id, tribu, isParent, status) VALUES (:user_id, :tribu, :isParent, :status)");

        $statement->bindParam(':user_id', $user_id);

        $statement->bindParam(':tribu', $tribu);

        $statement->bindParam(':isParent', $isParent);

        $statement->bindParam(':status', $status);

        $statement->execute();
    }

    /**
     * @author Nantenaina
     * Où : On utilise cette fonction pour l'affichage de la liste de filleuils
     * Localisation du fichier : UserService.php
     * Je veux : afficher la liste de filleuils
     * @param string $tableParrainage : table parrainage
     * @param object $userRepo : UserRepository
     * @return array $result : Tableau associatif
     */
    public function getAllFilleuils($tableParrainage, $userRepo = null, $userIdC, $confidentialityService)
    {
        $statement = $this->getPDO()->prepare("SELECT * FROM " . $tableParrainage . " WHERE isParent = 1 AND status = 1 ORDER BY id DESC");
        $statement->execute();
        $result = $statement->fetchAll(PDO::FETCH_ASSOC);
        $tabs = [];
        if (count($result) > 0) {
            foreach ($result as $key) {
                

                $tribuTable = $key["tribu"];
                $isTribuG = explode("_", $tribuTable)[0] === "tribug" ? true : false;
                $user = $userRepo->findOneById($key["user_id"]);
$publication_user_id = $key["user_id"];
                $key["fullName"] = $confidentialityService->getConfFullname(intval($publication_user_id), $userIdC);
                if (intval($publication_user_id) == $userIdC) {
                $key["email"] = $user->getEmail();
} else {
                    $key["email"] = $confidentialityService->getVisibilityEmail(intval($publication_user_id), $userIdC) ? $user->getEmail() : "Confidentiel";
                }

                if ($isTribuG) {
                    $key["tribuName"] = $this->getTribuGName($tribuTable);
                    $key["isTribuG"] = true;
                } else {
                    $key["isTribuG"] = false;
                    $userId = explode("_", $tribuTable)[2];
                    $user = $userRepo->findOneById(intval($userId));
                    $tribuTOwned = $user->getTribuT();
                    $tribuTable = strtolower($tribuTable);
                    if (isset($tribuTOwned)) {

                        $jsonInitial = json_decode($tribuTOwned, true);

                        $array1 = $jsonInitial["tribu_t"];

                        if (array_key_exists("name", $array1)) {
                            $table = strtolower($array1["name"]);
                            if ($tribuTable == $table) {
                                $key["tribuName"] = $array1["name_tribu_t_muable"];
                            }
                        } else {
                            for ($i = 0; $i < count($array1); $i++) {
                                $table = strtolower($array1[$i]["name"]);
                                if ($tribuTable == $table) {
                                    $key["tribuName"] = $array1[$i]["name_tribu_t_muable"];
                                }
                            }
                        }
                    }
                }
                array_push($tabs, $key);
            }
        }
        return $tabs;
    }

    /**
     * @author Nantenaina
     * Où : On utilise cette fonction pour l'affichage de la liste de parains
     * Localisation du fichier : UserService.php
     * Je veux : afficher la liste de parains
     * @param string $tableParrainage : table parrainage
     * @param object $userRepo : UserRepository
     * @return array $result : Tableau associatif
     */
    public function getAllParains($tableParrainage, $userRepo = null, $userIdC, $confidentialityService)
    {
        $statement = $this->getPDO()->prepare("SELECT * FROM " . $tableParrainage . " WHERE isParent = 0 AND status = 1 ORDER BY id DESC");
        $statement->execute();
        $result = $statement->fetchAll(PDO::FETCH_ASSOC);
        $tabs = [];
        if (count($result) > 0) {
            foreach ($result as $key) {
                                $tribuTable = $key["tribu"];
                $isTribuG = explode("_", $tribuTable)[0] === "tribug" ? true : false;
                $user = $userRepo->findOneById($key["user_id"]);
                $publication_user_id = $key["user_id"];
                $key["fullName"] = $confidentialityService->getConfFullname(intval($publication_user_id), $userIdC);
                if (intval($publication_user_id) == $userIdC) {
                $key["email"] = $user->getEmail();
} else {
                    $key["email"] = $confidentialityService->getVisibilityEmail(intval($publication_user_id), $userIdC) ? $user->getEmail() : "Confidentiel";
                }
                if ($isTribuG) {
                    $key["tribuName"] = $this->getTribuGName($tribuTable);
                    $key["isTribuG"] = true;
                } else {
                    $key["isTribuG"] = false;
                    $tribuTOwned = $user->getTribuT();
                    $tribuTable = strtolower($tribuTable);
                    if (isset($tribuTOwned)) {

                        $jsonInitial = json_decode($tribuTOwned, true);

                        $array1 = $jsonInitial["tribu_t"];

                        if (array_key_exists("name", $array1)) {
                            $table = strtolower($array1["name"]);
                            if ($tribuTable == $table) {
                                $key["tribuName"] = $array1["name_tribu_t_muable"];
                            }
                        } else {
                            for ($i = 0; $i < count($array1); $i++) {
                                $table = strtolower($array1[$i]["name"]);
                                if ($tribuTable == $table) {
                                    $key["tribuName"] = $array1[$i]["name_tribu_t_muable"];
                                }
                            }
                        }
                    }
                }
                array_push($tabs, $key);
            }
        }
        return $tabs;
    }

    /**
     * @author Nantenaina
     * Où : On utilise cette fonction pour l'affichage de la liste de filleuils et parains 
     * Localisation du fichier : UserService.php
     * Je veux : afficher la liste de filleuils et parains
     * @param string $tableParrainage : table parrainage
     * @return array $result : Tableau associatif
     */
    public function getAllFilleuilsAndParains($tableParrainage)
    {
        $statement = $this->getPDO()->prepare("SELECT * FROM " . $tableParrainage . " WHERE status = 1 ORDER BY id DESC");
        $statement->execute();
        $result = $statement->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    /**
     * @author Nantenaina
     * Où : On utilise cette fonction pour l'affichage de la liste de parains
     * Localisation du fichier : UserService.php
     * Je veux : afficher la liste de parains
     * @param string $tableParrainage : table parrainage
     * @return array $result : Tableau associatif
     */
    public function getAllParainsWithStatusNull($tableParrainage)
    {
        $statement = $this->getPDO()->prepare("SELECT * FROM " . $tableParrainage . " WHERE isParent = 0 AND status = 0 ORDER BY id DESC");
        $statement->execute();
        $result = $statement->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    /**
     * @author Nantenaina
     * Où : On utilise cette fonction pour modifier la table parrainage
     * Localisation du fichier : UserService.php
     * Je veux : modifier la table parrainage
     * @param string $tableParrainage : table parrainage
     * @param int $userId : identifiant de l'utilisateur connecté
     */
    public function updateTableParrainage($tableParrainage, $userId)
    {

        $allRows = $this->getAllParainsWithStatusNull($tableParrainage);

        if (count($allRows) > 0) {

            foreach ($allRows as $key) {

                $statement = $this->getPDO()->prepare("UPDATE " . $tableParrainage . " SET status = 1 WHERE id = :id");

                $statement->bindParam(':id', $key["id"]);

                $statement->execute();

                $tableParrainageParent = "tableparrainage_" . $key["user_id"];

                $this->saveOneParainOrFilleuil($tableParrainageParent, $userId, $key["tribu"], 1, 1);
            }
        }
    }

    /**
     * @author Nantenaina
     * Où : On utilise cette fonction pour sauvegarder l'historique des invitation tribu G
     * Localisation du fichier : Tribu_T_Service.php
     * Je veux : sauvegarder l'historique des invitation tribu G
     * @param string $table_invitation : nom de la table invitatio
     * @param int $sender_id : identifiant de l'utilisateur connecté
     * @param string $email : l'email qu'on va inviter
     */
    function saveInvitationStoryG($table_invitation, $sender_id, $email)
    {

        $sql = "SELECT count(*) as is_invited FROM $table_invitation WHERE email = :email AND sender_id = :sender_id";

        $stmt = $this->getPDO()->prepare($sql);

        $stmt->bindParam(':email', $email);

        $stmt->bindParam(':sender_id', $sender_id);

        $stmt->execute();

        $is_invited = $stmt->fetch(PDO::FETCH_ASSOC)['is_invited'];

        if ($is_invited < 1) {

            $statement = $this->getPDO()->prepare("INSERT INTO $table_invitation (sender_id, email) values (:sender_id, :email)");

            $statement->bindParam(':sender_id', $sender_id);

            $statement->bindParam(':email', $email);

            $statement->execute();
        }
    }

    /**
     * @author Nantenaina
     * Où : On utilise cette fonction pour mettre à jour l'historique des invitation tribu G
     * Localisation du fichier : Tribu_T_Service.php
     * Je veux : mettre à jour l'historique des invitation tribu G
     * @param string $table_invitation : nom de la table invitatio
     * @param int $sender_id : identifiant de l'utilisateur connecté
     * @param int $user_id : identifiant de filleuil
     * @param int $is_valid : si vérifier
     * @param string $email : l'email qu'on va inviter
     */
    function updateInvitationStoryG($table_invitation, $sender_id, $email, $user_id, $is_valid = 0)
    {
        $statement = $this->getPDO()->prepare("UPDATE $table_invitation SET user_id = :user_id, is_valid = :is_valid WHERE sender_id =:sender_id AND email =:email");

        $statement->bindParam(':user_id', $user_id);

        $statement->bindParam(':is_valid', $is_valid);

        $statement->bindParam(':sender_id', $sender_id);

        $statement->bindParam(':email', $email);

        $statement->execute();
    }

    /**
     * @author Nantenaina
     * Où : On utilise cette fonction pour vérifier si on a un parain pour la tribu G
     * Localisation du fichier : UserService.php
     * Je veux : vérifier si on a un parain pour la tribu G
     * @param string $tableParrainage : table parrainage
     * @return array $result : Tableau associatif
     */
    public function getParainG($tableParrainage)
    {
        $statement = $this->getPDO()->prepare("SELECT * FROM " . $tableParrainage . " WHERE isParent = 0 AND status = 0 AND tribu LIKE 'tribug_%'");
        $statement->execute();
        $result = $statement->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    /**
     * @author Nantenaina
     * Où : On utilise cette fonction pour afficher les infos relatives aux adresses d'une tribu G
     * Localisation du fichier : UserService.php
     * Je veux : afficher les infos relatives aux adresses d'une tribu G
     * @param int $userId : identifiant du parain
     * @return array $result : Tableau associatif
     */
    public function getTribuGParainInfo($userId)
    {
        $statement = $this->getPDO()->prepare("SELECT * from (SELECT user_id, tributg as tributg, commune as commune, num_rue as num_rue, code_postal as code_postal, pays as pays, quartier as quartier from consumer union SELECT user_id, tributg as tributg, commune as commune, num_rue as num_rue, code_postal as code_postal, pays as pays, quartier as quartier from supplier) as tab where tab.user_id=:user_id");
        $statement->bindParam(':user_id', $userId);
        $statement->execute();
        $result = $statement->fetch(PDO::FETCH_ASSOC);
        return $result;
    }

    /**
     * @author Nantenaina
     * 
     * @param int $userId: userID of the user
     * 
     * @return string tributg of the user
     */
    public function getTribuGName($tableTribuG)
    {
        $statement = $this->getPDO()->prepare("SELECT * FROM $tableTribuG WHERE id = 1");
        $statement->execute();
        $result = $statement->fetch(PDO::FETCH_ASSOC);
        return $result["name"];
    }



    /**
     * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
     * 
     * Goal: Create table favory: favori_folder, and favori_etablisment
     * Use in: UserService.php
     * 
     * @param {integer} $userId: id of the user that no have the table
     * 
     * @return void
     */
    public function createTableFavori($userId)
    {
        $table_favori_folder = "favori_folder_" . $userId;
        $table_favori_etablisment = "favori_etablisment_" . $userId;

        //// create table favori folder.
        $sql = "CREATE TABLE IF NOT EXISTS " . $table_favori_folder . " ( 
                id VARCHAR(300) NOT NULL PRIMARY KEY,
                name VARCHAR(300) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
                rubriqueType VARCHAR(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL,
                idFolderParent VARCHAR(300) NULL DEFAULT 0,
                subFolderList longtext CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL,
                livel_parent int(11) NOT NULL DEFAULT 0,
                datetime timestamp NOT NULL DEFAULT current_timestamp()
            )ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci";

        $request_favori_folder = $this->getPDO()->prepare($sql);
        $request_favori_folder->execute();

        /// create table favori etablisment.
        $sql = "CREATE TABLE IF NOT EXISTS " . $table_favori_etablisment . " ( 
                id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
                rubriqueType VARCHAR(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
                idRubrique int(11) NOT NULL DEFAULT 0,
                idFolder VARCHAR(300) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
                datetime timestamp NOT NULL DEFAULT current_timestamp()
            )ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci";

        $request_favori_etablisment = $this->getPDO()->prepare($sql);
        $request_favori_etablisment->execute();
    }

    /**
     * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
     * 
     * Goal: For an etablisment (resto, ferme, station, ... ) save as favory in specified directory (by default mes favori)
     * Use in: RestaurantController.php
     * 
     * @param $userId : id of the user
     * @param {array_associative} $etablisment: ["type" => ..., "id" (etablismentID) => ... ]
     * @param {array_associative} $folder: [ "id" (if the folder is already exist) => ..., "name" (by default 'Mes favori') => ...  ]
     * 
     * @return { array_associative } [ "code" => ..., "message" => ... ]
     * 
     */
    public function saveFavory($userId, $etablisment, $folder)
    {
        $table_favori_folder = "favori_folder_" . $userId;
        $table_favori_etablisment = "favori_etablisment_" . $userId;

        ///check if the table is already exist
        if (!$this->isTableExist($table_favori_folder) || !$this->isTableExist($table_favori_etablisment)) {
            $this->createTableFavori($userId);
        }

        //// insert in the folder get the id in the last created
        ///////// insert in the folder

        $unique_id = $this->generateUniqueID();
        $datetime = new \DateTime();
        $datetime = $datetime->format('Y-m-d H:i:s');
        $rubriqueType = $etablisment["type"];

        //// check if the folder is already exist


        $unique_id = $this->generateUniqueID();
        if (!$this->checkIfExistFavoriFolder($table_favori_folder, $folder["name"])) {

            $request_favori_folder = $this->getPDO()->prepare(
                "INSERT INTO $table_favori_folder (id, name, rubriqueType, idFolderParent, subFolderList, livel_parent, datetime) 
                VALUES (:id, :name, :rubriqueType, :idFolderParent, :subFolderList, :livel_parent, :datetime)"
            );

            $name = $folder["name"];
            $idFolderParent = $folder["id_folder_parent"];
            $livel_parent = $folder["livel_parent"];

            $subFolderList = [];
            $subFolderList = json_encode($subFolderList, true);

            $request_favori_folder->bindParam(':id', $unique_id);
            $request_favori_folder->bindParam(':name', $name);
            $request_favori_folder->bindParam(':rubriqueType', $rubriqueType);
            $request_favori_folder->bindParam(':idFolderParent', $idFolderParent);
            $request_favori_folder->bindParam(':subFolderList', $subFolderList);
            $request_favori_folder->bindParam(':livel_parent', $livel_parent);
            $request_favori_folder->bindParam(':datetime', $datetime);

            $result_create_folder = $request_favori_folder->execute();

            if (!$result_create_folder) {
                return [
                    "code" => "folder",
                    "message" => "error creating folder"
                ];
            }
        }
        $data = $this->checkIfExistFavoriFolder($table_favori_folder, $folder["name"]);
        $unique_id = $data["id"];


        /// insert in the etablisment
        $request_favori_etablisment = $this->getPDO()->prepare(
            "INSERT INTO $table_favori_etablisment (rubriqueType, idRubrique, idFolder, datetime) 
            VALUES (:rubriqueType, :idRubrique, :idFolder, :datetime)"
        );

        $idRubrique = $etablisment["id"];
        $idFolder = $unique_id;

        $request_favori_etablisment->bindParam(':rubriqueType', $rubriqueType);
        $request_favori_etablisment->bindParam(':idRubrique', $idRubrique);
        $request_favori_etablisment->bindParam(':idFolder', $idFolder);
        $request_favori_etablisment->bindParam(':datetime', $datetime);

        $result_insert_etablisment = $request_favori_etablisment->execute();

        if (!$result_insert_etablisment) {
            return [
                "code" => "etablisment",
                "message" => "error creating etablisment"
            ];
        }


        return [
            "code" => "success",
            "message" => "save favori successfully"
        ];
    }

    /**
     * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
     * 
     * Goal: Check if the folder is already exist
     * 
     * @param {string} $table_favori_folder: table of the favori folder
     * @param {string} $folder_name: favori folder
     * 
     * @return {array_assoc|false}  [ id => ... ]
     */
    public function checkIfExistFavoriFolder($table_favori_folder, $folder_name)
    {

        $request_check_favory = $this->getPDO()->prepare("SELECT id FROM $table_favori_folder WHERE name= :folder_name");

        $request_check_favory->bindParam(':folder_name', $folder_name);
        $request_check_favory->execute();

        $result = $request_check_favory->fetch(PDO::FETCH_ASSOC);

        return $result;
    }

    /**
     * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
     * 
     * Goal: Check if the etablisment Id is already in my favori
     * Use in: RestaurantController.php
     * 
     * @param {integer} $userId: id of the user
     * @param {integer} $etablismentId: id of the etablisement
     * 
     * @return {boolean} true : already in, false: not 
     */
    public function checkIsAlreadyInFavory($userId, $etablismentId)
    {
        $table_favori_folder = "favori_folder_" . $userId;
        $table_favori_etablisment = "favori_etablisment_" . $userId;

        ///check if the table is already exist
        if (!$this->isTableExist($table_favori_folder) || !$this->isTableExist($table_favori_etablisment)) {
            $this->createTableFavori($userId);
        }

        $request_check_favory = $this->getPDO()->prepare("SELECT id FROM $table_favori_etablisment WHERE idRubrique= :idRubrique");

        $request_check_favory->bindParam(':idRubrique', $etablismentId);
        $request_check_favory->execute();

        $result = $request_check_favory->fetch(PDO::FETCH_ASSOC);

        return $result ? true : false;
    }

    /**
     *  @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
     *  
     *  Goal: Get the information for one favori
     *  Use in: RestaurantController.php
     * 
     * @param {integer} $userId: id of the user
     * @param {integer} $etablismentId: id of the etablisement
     * 
     * @return {array_associative}: [...]
     */
    public function getInformationEtablismentFavory($userId, $etablismentId)
    {
        $table_favori_folder = "favori_folder_" . $userId;
        $table_favori_etablisment = "favori_etablisment_" . $userId;

        ///check if the table is already exist
        if (!$this->isTableExist($table_favori_folder) || !$this->isTableExist($table_favori_etablisment)) {
            $this->createTableFavori($userId);
        }

        $request_check_favory = $this->getPDO()->prepare(
            "SELECT 
                ff.id, ff.name, ff.rubriqueType, ff.idFolderParent, ff.subFolderList, ff.livel_parent, ff.datetime,
                fe.id as 'favori_id', fe.idRubrique, fe.idFolder
            FROM $table_favori_folder as ff INNER JOIN $table_favori_etablisment as fe ON ff.id = fe.idFolder WHERE fe.idRubrique= :etablismentId"
        );

        $request_check_favory->bindParam(':etablismentId', $etablismentId);
        $request_check_favory->execute();

        $result = $request_check_favory->fetch(PDO::FETCH_ASSOC);

        return $result;
    }

    /**
     *  @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
     *  
     *  Goal: Get the information for one favori folder
     *  Use in: UserService.php
     * 
     * @param {integer} $userId: id of the user
     * @param {integer} $favoriFolderId: id of the favori folder
     * 
     * @return {array_associative}: [...]
     */
    public function getInformationFavoryFolder($userId, $favoriFolderId)
    {
        $table_favori_folder = "favori_folder_" . $userId;

        $request_check_favory = $this->getPDO()->prepare(
            "SELECT 
                id, name, rubriqueType, idFolderParent, subFolderList, livel_parent, datetime
            FROM $table_favori_folder WHERE id= :favoriFolderId"
        );

        $request_check_favory->bindParam(':favoriFolderId', $favoriFolderId);
        $request_check_favory->execute();

        $result = $request_check_favory->fetch(PDO::FETCH_ASSOC);

        return $result;
    }


    /**
     *  @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
     *  
     *  Goal: Get all favory folder
     *  Use in: UserController.php
     * 
     * @param {integer} $userId: id of the user
     * 
     * @return {array_associative}: []
     */
    public function getAllFavoryFolder($userId)
    {
        $table_favori_folder = "favori_folder_" . $userId;
        $table_favori_etablisment = "favori_etablisment_" . $userId;

        ///check if the table is already exist
        if (!$this->isTableExist($table_favori_folder) || !$this->isTableExist($table_favori_etablisment)) {
            $this->createTableFavori($userId);
        }


        $request_check_favory = $this->getPDO()->prepare(
            "SELECT DISTINCT name, id, idFolderParent, livel_parent, datetime FROM $table_favori_folder ORDER BY datetime"
        );
        $request_check_favory->execute();

        $result = $request_check_favory->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    /**
     *  @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
     *  
     *  Goal: Get details of the favori_folder
     *  Use in: UserService.php
     * 
     * @param {integer} $favori_folder_id: id of the user
     * 
     * @return {array_associative}: []
     */
    public function getOneFavoryFolder($userId, $favori_folder_id)
    {
        $table_favori_folder = "favori_folder_" . $userId;
        $table_favori_etablisment = "favori_etablisment_" . $userId;

        ///check if the table is already exist
        if (!$this->isTableExist($table_favori_folder) || !$this->isTableExist($table_favori_etablisment)) {
            $this->createTableFavori($userId);
        }


        $request_check_favory = $this->getPDO()->prepare(
            "SELECT 
                id, name, rubriqueType, idFolderParent, subFolderList, livel_parent, datetime 
            FROM $table_favori_folder WHERE id=:idFolderParent"
        );

        $request_check_favory->bindParam(':idFolderParent', $favori_folder_id);
        $request_check_favory->execute();

        $result = $request_check_favory->fetch(PDO::FETCH_ASSOC);

        return $result;
    }



    /**
     *  @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
     *  
     *  Goal: Get  favory folder
     *  Use in: UserController.php
     * 
     * @param {integer} $userId: id of the user
     * 
     * @return {array_associative}: []
     */
    public function getFavoryFolder($userId, $favoriFolder_id = null)
    {
        $table_favori_folder = "favori_folder_" . $userId;
        $table_favori_etablisment = "favori_etablisment_" . $userId;

        ///check if the table is already exist
        if (!$this->isTableExist($table_favori_folder) || !$this->isTableExist($table_favori_etablisment)) {
            $this->createTableFavori($userId);
        }

        $livel_parent = 0;
        if ($favoriFolder_id != null) {
            $one_favori_folder = $this->getOneFavoryFolder($userId, $favoriFolder_id);
            $livel_parent = intval($one_favori_folder["livel_parent"]) + 1;

            $request_check_favory = $this->getPDO()->prepare(
                "SELECT DISTINCT name, id, datetime FROM $table_favori_folder WHERE livel_parent = :livel_parent AND idFolderParent= :idFolderParent ORDER BY datetime"
            );
            $request_check_favory->bindParam(':livel_parent', $livel_parent);
            $request_check_favory->bindParam(':idFolderParent', $favoriFolder_id);
        } else {
            $request_check_favory = $this->getPDO()->prepare(
                "SELECT DISTINCT name, id, datetime FROM $table_favori_folder WHERE livel_parent = :livel_parent ORDER BY datetime"
            );
            $request_check_favory->bindParam(':livel_parent', $livel_parent);
        }


        $request_check_favory->execute();
        $result = $request_check_favory->fetchAll(PDO::FETCH_ASSOC);

        return $result;
    }

    /**
     *  @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
     *  
     *  Goal: Get  etablisement
     *  Use in: UserController.php
     * 
     * @param {integer} $userId: id of the user
     * 
     * @return {array_associative}: []
     */
    public function getEtablismentInFolder($userId, $favoriFolder_id)
    {
        $table_favori_folder = "favori_folder_" . $userId;
        $table_favori_etablisment = "favori_etablisment_" . $userId;

        $rubriqueType = "resto";

        ///check if the table is already exist
        if (!$this->isTableExist($table_favori_folder) || !$this->isTableExist($table_favori_etablisment)) {
            $this->createTableFavori($userId);
        }

        $one_favori_folder = $this->getOneFavoryFolder($userId, $favoriFolder_id);
        $livel_parent = intval($one_favori_folder["livel_parent"]) + 1;

        $request_check_favory = $this->getPDO()->prepare(
            "SELECT id, idRubrique, idFolder, datetime FROM $table_favori_etablisment WHERE idFolder= :idFolder AND rubriqueType= :rubriqueType"
        );
        $request_check_favory->bindParam(':idFolder', $favoriFolder_id);
        $request_check_favory->bindParam(':rubriqueType', $rubriqueType);

        $request_check_favory->execute();
        $result = $request_check_favory->fetchAll(PDO::FETCH_ASSOC);

        return $result;
    }



    /**
     *  @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
     *  
     *  Goal: Get the information for one favori
     *  Use in: RestaurantController.php
     * 
     * @param {integer} $userId: id of the user
     * @param {string} $favory_folder_name: id of the etablisement
     * 
     * @return {boolean}: exist -> true if not false
     */
    public function checkIsAlreadyExistFavoryFolder($userId, $favory_folder_name)
    {
        $table_favori_folder = "favori_folder_" . $userId;
        $table_favori_etablisment = "favori_etablisment_" . $userId;

        ///check if the table is already exist
        if (!$this->isTableExist($table_favori_folder) || !$this->isTableExist($table_favori_etablisment)) {
            $this->createTableFavori($userId);
        }

        $request_check_favory = $this->getPDO()->prepare(
            "SELECT id FROM $table_favori_folder WHERE name= :favory_folder_name"
        );

        $request_check_favory->bindParam(':favory_folder_name', $favory_folder_name);

        $request_check_favory->execute();

        $result = $request_check_favory->fetch(PDO::FETCH_ASSOC);
        return $result ? true : false;
    }

    /**
     *  @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
     *  
     *  Goal: Create a favory folder
     *  Use in: RestaurantController.php
     * 
     * @param {integer} $userId: id of the user
     * @param {string} $favory_folder_name: id of the etablisement
     * 
     */
    public function createFavoryFolder($userId, $folder)
    {
        $table_favori_folder = "favori_folder_" . $userId;
        $table_favori_etablisment = "favori_etablisment_" . $userId;

        ///check if the table is already exist
        if (!$this->isTableExist($table_favori_folder) || !$this->isTableExist($table_favori_etablisment)) {
            $this->createTableFavori($userId);
        }


        $request_favori_folder = $this->getPDO()->prepare(
            "INSERT INTO $table_favori_folder (id, name, idFolderParent, subFolderList, livel_parent, datetime) 
            VALUES (:id, :name, :idFolderParent, :subFolderList, :livel_parent, :datetime)"
        );

        $unique_id = $this->generateUniqueID();
        $datetime = new \DateTime();
        $datetime = $datetime->format('Y-m-d H:i:s');

        $name = $folder["name"];
        $idFolderParent = $folder["id_folder_parent"] != null ? $folder["id_folder_parent"] : 0;
        $livel_parent = $folder["livel_parent"];
        $subFolderList = json_encode([], true);

        $request_favori_folder->bindParam(':id', $unique_id);
        $request_favori_folder->bindParam(':name', $name);
        $request_favori_folder->bindParam(':idFolderParent', $idFolderParent);
        $request_favori_folder->bindParam(':subFolderList', $subFolderList);
        $request_favori_folder->bindParam(':livel_parent', $livel_parent);
        $request_favori_folder->bindParam(':datetime', $datetime);

        $result_create_folder = $request_favori_folder->execute();

        if ($folder["id_folder_parent"] != null) {

            $request_check_favory = $this->getPDO()->prepare(
                "SELECT subFolderList, livel_parent FROM $table_favori_folder WHERE id= :idFolderParent"
            );
            $request_check_favory->bindParam(':idFolderParent', $idFolderParent);
            $request_check_favory->execute();

            $result = $request_check_favory->fetch(PDO::FETCH_ASSOC);

            $livel_parent = $result["livel_parent"];

            $subFolderList = $result["subFolderList"];
            $subFolderList = json_decode($subFolderList, true);

            array_push($subFolderList, $unique_id);

            $request_update_folder_favory = $this->getPDO()->prepare(
                "UPDATE $table_favori_folder SET subFolderList = :subFolderList WHERE id= :idFolderParent"
            );

            $subFolderList = json_encode($subFolderList, true);
            $request_update_folder_favory->bindParam(':subFolderList', $subFolderList);

            $request_update_folder_favory->bindParam(':idFolderParent', $idFolderParent);
            $request_update_folder_favory->execute();

            /// increment level from their parent.
            $livel_parent = intval($livel_parent) + 1;

            $request_update_folder_favory = $this->getPDO()->prepare(
                "UPDATE $table_favori_folder SET livel_parent = :livel_parent WHERE id= :unique_id"
            );

            $request_update_folder_favory->bindParam(':livel_parent', $livel_parent);
            $request_update_folder_favory->bindParam(':unique_id', $unique_id);
            $request_update_folder_favory->execute();
        }

        return $unique_id;
    }


    /**
     *  @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
     *  
     *  Goal: Check if etablisment is specified favorifolder
     *  Use in: UserService.php
     * 
     * @param {integer} $userId: id of the user
     * @param {integer} $etablisment_id: id of the etablisment
     * @param {integer} $favoryFolderId: id of the folder id
     * 
     * @return {boolean} true if inside, false otherwise
     * 
     */
    public function checkIfEtablismentInFavoryFolder($userId, $etablisementId, $favoryFolderId)
    {
        $table_favori_folder = "favori_folder_" . $userId;
        $table_favori_etablisment = "favori_etablisment_" . $userId;

        ///check if the table is already exist
        if (!$this->isTableExist($table_favori_folder) || !$this->isTableExist($table_favori_etablisment)) {
            $this->createTableFavori($userId);
        }

        $request_check_favory = $this->getPDO()->prepare(
            "SELECT id FROM $table_favori_etablisment WHERE etablisementId= :etablisementId AND idFolder= :favoryFolderId"
        );

        $request_check_favory->bindParam(':etablisementId', $etablisementId);
        $request_check_favory->bindParam(':favoryFolderId', $favoryFolderId);

        $request_check_favory->execute();

        $result = $request_check_favory->fetch(PDO::FETCH_ASSOC);
        return $result ? true : false;
    }

    /**
     *  @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
     *  
     *  Goal: Change folder favory
     *  Use in: UserController.php
     * 
     * @param {integer} $userId: id of the user
     * @param {array_assoc} $etablisment: [ 'type' => ..., 'id' => ...]
     * @param {array} $folder: [ "new_favory_folder" => ... ]
     * 
     */
    public function changeFolderFavoryFolder($userId, $etablisment, $folder)
    {
        $table_favori_folder = "favori_folder_" . $userId;
        $table_favori_etablisment = "favori_etablisment_" . $userId;

        ///check if the table is already exist
        if (!$this->isTableExist($table_favori_folder) || !$this->isTableExist($table_favori_etablisment)) {
            $this->createTableFavori($userId);
        }

        $request_update_folder_favory = $this->getPDO()->prepare(
            "UPDATE $table_favori_etablisment SET idFolder = :idFolder WHERE idRubrique= :etablisment_id AND rubriqueType= :rubriqueType"
        );

        $idFolder = $folder["new_favory_folder"];
        $etablisment_id = $etablisment["id"];
        $etablisment_type = $etablisment["type"];

        $request_update_folder_favory->bindParam(':idFolder', $idFolder);
        $request_update_folder_favory->bindParam(':rubriqueType', $etablisment_type);
        $request_update_folder_favory->bindParam(':etablisment_id', $etablisment_id);

        $request_update_folder_favory->execute();

        /// get information about the new favori folder for this etablisment.
        $folder_information = $this->getInformationFavoryFolder($userId, $idFolder);

        return $folder_information;
    }

    /**
     *  @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
     *  
     *  Goal: Get all sub folder for specified folder.
     *  Use in: UserController.php
     * 
     * @param {integer} $userId: id of the user
     * @param {integer} $parent_favori_folder_id: id of  the parent favori folder
     * 
     */
    public function getAllSubFavoriFolder($userId, $parent_favori_folder_id)
    {
        $table_favori_folder = "favori_folder_" . $userId;
        $table_favori_etablisment = "favori_etablisment_" . $userId;

        ///check if the table is already exist
        if (!$this->isTableExist($table_favori_folder) || !$this->isTableExist($table_favori_etablisment)) {
            $this->createTableFavori($userId);
        }

        $request_check_favory = $this->getPDO()->prepare(
            "SELECT DISTINCT name, id FROM $table_favori_folder"
        );
        $request_check_favory->execute();

        $result = $request_check_favory->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }


    public function removeFavoriteEtablisment($userId, $etablisment_id)
    {
        $table_favori_etablisment = "favori_etablisment_" . $userId;

        $etablisment_id = intval($etablisment_id);

        $request_check_favory = $this->getPDO()->prepare(
            "SELECT id FROM $table_favori_etablisment WHERE id= :id"
        );
        $request_check_favory->bindParam(':id', $etablisment_id);
        $request_check_favory->execute();
        $result = $request_check_favory->fetch(PDO::FETCH_ASSOC);

        if (!$result) {
            return false;
        }

        $request_delete_favory = $this->getPDO()->prepare(
            "DELETE FROM $table_favori_etablisment WHERE id= :id"
        );
        $request_delete_favory->bindParam(':id', $etablisment_id);
        $result = $request_delete_favory->execute();

        return true;
    }


    /**
     * @author Tomm
     * Get list user all
     */
    public function getListUserAll()
    {
        $sql = "SELECT id, email, pseudo, type FROM " . "user";
        $statement = $this->getPDO()->prepare($sql);
        $statement->execute();
        $result = $statement->fetchAll(PDO::FETCH_ASSOC);

        return $result;
    }

    /**
     * @author Elie
     * Function creation d'une nouvelle réaction
     */
    public function pushReactionAvis($table, $user_id, $avis_id, $reaction)
    {

        $statement = $this->getPDO()->PREPARE("SELECT * FROM $table WHERE user_id = $user_id AND avis_id = $avis_id");

        $statement->execute();

        $result = $statement->fetch(PDO::FETCH_ASSOC);

        $jaime = 0;

        if ($result) {
            if ($result["reaction"] == 1) {
                //update reaction value = 0
                $jaime = 0;
            } else {
                //update reaction value = 1
                $jaime = 1;
            }

            $statement = $this->getPDO()->PREPARE("UPDATE $table SET reaction = ? WHERE user_id = ? AND avis_id = ?");

            $statement->bindParam(1, $jaime, PDO::PARAM_INT);
            $statement->bindParam(2, $user_id, PDO::PARAM_INT);
            $statement->bindParam(3, $avis_id, PDO::PARAM_INT);

            $statement->execute();
        } else {

            $sql = "INSERT INTO $table (user_id, avis_id, reaction) VALUES (?,?,?)";

            $stmt = $this->getPDO()->prepare($sql);

            $stmt->bindParam(1, $user_id);
            $stmt->bindParam(2, $avis_id);
            $stmt->bindParam(3, $reaction);

            $stmt->execute();
        }
    }

    /**
     * @author Elie
     * Function creation d'une nouvelle réaction reponse avis
     */
    public function pushReactionResponseAvis($table, $user_id, $response_id, $reaction)
    {

        $statement = $this->getPDO()->PREPARE("SELECT * FROM $table WHERE user_id = $user_id AND response_id = $response_id");

        $statement->execute();

        $result = $statement->fetch(PDO::FETCH_ASSOC);

        $jaime = 0;

        if ($result) {
            if ($result["reaction"] == 1) {
                //update reaction value = 0
                $jaime = 0;
            } else {
                //update reaction value = 1
                $jaime = 1;
            }

            $statement = $this->getPDO()->PREPARE("UPDATE $table SET reaction = ? WHERE user_id = ? AND response_id = ?");

            $statement->bindParam(1, $jaime, PDO::PARAM_INT);
            $statement->bindParam(2, $user_id, PDO::PARAM_INT);
            $statement->bindParam(3, $response_id, PDO::PARAM_INT);

            $statement->execute();
        } else {

            $sql = "INSERT INTO $table (user_id, response_id, reaction) VALUES (?,?,?)";

            $stmt = $this->getPDO()->prepare($sql);

            $stmt->bindParam(1, $user_id);
            $stmt->bindParam(2, $response_id);
            $stmt->bindParam(3, $reaction);

            $stmt->execute();
        }
    }

    /**
     * @author Elie
     * Function creation d'un nouveau reponse d'un avis rubrique
     */
    public function pushNewResponseAvis($table, $user_id, $avis_id, $commentaire, $type = 'text')
    {

        $sql = "INSERT INTO $table (user_id, avis_id, commentaire, type) VALUES (?, ?, ?, ?)";

        $stmt = $this->getPDO()->prepare($sql);

        $stmt->bindParam(1, $user_id);

        $stmt->bindParam(2, $avis_id);

        $stmt->bindParam(3, $commentaire);

        $stmt->bindParam(4, $type);

        $stmt->execute();

        $statement = $this->getPDO()->PREPARE("SELECT MAX(id) as id FROM $table");

        $statement->execute();

        $result = $statement->fetch(PDO::FETCH_ASSOC);

        return $result["id"];
    }

    /**
     * @author Elie
     * Function creation d'un nouveau reponse d'un avis rubrique
     */
    public function pushNewSubResponseAvis($table, $user_id, $response_id, $level_response = 1, $commentaire, $type = 'text')
    {

        $sql = "INSERT INTO $table (user_id, response_id, level_response, commentaire, type) VALUES (?, ?, ?, ?, ?)";

        $stmt = $this->getPDO()->prepare($sql);

        $stmt->bindParam(1, $user_id);

        $stmt->bindParam(2, $response_id);

        $stmt->bindParam(3, $level_response);

        $stmt->bindParam(4, $commentaire);

        $stmt->bindParam(5, $type);

        $stmt->execute();

        $statement = $this->getPDO()->PREPARE("SELECT MAX(id) as id, response_id FROM $table");

        $statement->execute();

        $result = $statement->fetch(PDO::FETCH_ASSOC);

        return $result;
    }

    /**
     * @author Elie
     * Function creation d'un nouveau reponse d'un avis rubrique
     */
    public function pushNewSubResponseAvisV2($table, $user_id, $parent_id, $commentaire, $type = 'text')
    {


        $sql = "INSERT INTO $table (user_id, commentaire, type) VALUES (?, ?, ?)";

        $stmt = $this->getPDO()->prepare($sql);

        $stmt->bindParam(1, $user_id);

        $stmt->bindParam(2, $commentaire);

        $stmt->bindParam(3, $type);

        $stmt->execute();

        $statement = $this->getPDO()->PREPARE("SELECT MAX(id) as id FROM $table");

        $statement->execute();

        $result = $statement->fetch(PDO::FETCH_ASSOC);

        $statement_up = $this->getPDO()->PREPARE("SELECT * FROM $table WHERE id = $parent_id");

        $statement_up->execute();

        $result_up = $statement_up->fetch(PDO::FETCH_ASSOC);

        $responses_id = json_decode($result_up['response_id']);

        $new_responses_id = json_encode($responses_id . $result['id'] . ",");

        $update = $this->getPDO()->PREPARE("UPDATE $table SET response_id = ? WHERE id = ?");

        $update->bindParam(1, $new_responses_id, PDO::PARAM_STR);

        $update->bindParam(2, $parent_id, PDO::PARAM_INT);

        $update->execute();

        return $result;
    }

    /**
     * @author Elie
     * Fetch reaction from avis d'un rubrique
     */
    public function fetchAllReactionAvis($table, $avis_id)
    {

        $statement = $this->getPDO()->PREPARE("SELECT * FROM $table WHERE avis_id = $avis_id AND reaction = 1");

        $statement->execute();

        $result = $statement->fetchAll(PDO::FETCH_ASSOC);

        return $result;
    }

    /**
     * @author Elie
     * Fetch reaction from avis d'un rubrique
     */
    public function fetchAllReactionResponseAvis($table, $response_id)
    {

        $statement = $this->getPDO()->PREPARE("SELECT * FROM $table WHERE response_id = $response_id AND reaction = 1");

        $statement->execute();

        $result = $statement->fetchAll(PDO::FETCH_ASSOC);

        return $result;
    }

    /**
     * @author Elie
     * Fetch reaction from avis d'un rubrique
     */
    public function fetchOneReactionAvis($table, $avis_id, $user_id)
    {

        $statement = $this->getPDO()->PREPARE("SELECT reaction FROM $table WHERE avis_id = $avis_id AND user_id = $user_id");

        $statement->execute();

        $result = $statement->fetch(PDO::FETCH_ASSOC);

        if ($result) {
            return $result["reaction"];
        } else {
            return 0;
        }
    }

    /**
     * @author Elie
     * Fetch reaction from reponse avis d'un rubrique
     */
    public function fetchOneReactionResponseAvis($table, $response_id, $user_id)
    {

        $statement = $this->getPDO()->PREPARE("SELECT reaction FROM $table WHERE response_id = $response_id AND user_id = $user_id");

        $statement->execute();

        $result = $statement->fetch(PDO::FETCH_ASSOC);

        if ($result) {
            return $result["reaction"];
        } else {
            return 0;
        }
    }

    /**
     * @author Elie
     * Fetch all respona from avis d'un rubrique
     */
    public function fetchAllResponseAvis($table, $avis_id, $user_id)
    {

        $statement = $this->getPDO()->PREPARE("SELECT * FROM $table 
        INNER JOIN (SELECT user_id, firstname, lastname, photo_profil FROM consumer 
        UNION SELECT user_id, firstname, lastname, photo_profil FROM supplier) as usr ON $table.user_id = usr.user_id
        WHERE avis_id = $avis_id order by id desc;
        ");

        $statement->execute();

        $result = $statement->fetchAll(PDO::FETCH_ASSOC);

        $table = "avisrestaurant_subresponse";

        $new_res = [];

        foreach ($result as $res) {
            $array = [
                "id" => $res["id"],
                "user_id" => $res["user_id"],
                "avis_id" => $res["avis_id"],
                "level_response" => $res["level_response"],
                "commentaire" => json_decode($res["commentaire"]),
                "type" => $res["type"],
                "datetime" => $res["datetime"],
                "firstname" => $res["firstname"],
                "lastname" => $res["lastname"],
                "photo_profil" => $res["photo_profil"],
                "all_subresponse" => $this->fetchAllSubResponseAvis($table, $res["id"], $user_id),
                "my_reaction" => $this->fetchOneReactionResponseAvis("avisrestaurant_response_reaction", $res["id"], $user_id),
                "all_reaction" => $this->fetchAllReactionResponseAvis("avisrestaurant_response_reaction", $res["id"])
            ];

            array_push($new_res, $array);
        }

        return $new_res;
    }

    /**
     * @author Elie
     * Fetch all sous_response from avis d'un rubrique
     */
    public function fetchAllSubResponseAvis($table, $response_id, $user_id)
    {

        $statement = $this->getPDO()->PREPARE("SELECT * FROM $table 
        INNER JOIN (SELECT user_id, firstname, lastname, photo_profil FROM consumer 
        UNION SELECT user_id, firstname, lastname, photo_profil FROM supplier) as usr ON $table.user_id = usr.user_id
        WHERE response_id = $response_id order by id desc;
        ");

        $statement->execute();

        $result = $statement->fetchAll(PDO::FETCH_ASSOC);

        $table = "avisrestaurant_subresponse";

        $new_res = [];

        foreach ($result as $res) {
            $array = [
                "id" => $res["id"],
                "user_id" => $res["user_id"],
                "response_id" => $res["response_id"],
                "level_response" => $res["level_response"],
                "commentaire" => json_decode($res["commentaire"]),
                "type" => $res["type"],
                "datetime" => $res["datetime"],
                "firstname" => $res["firstname"],
                "lastname" => $res["lastname"],
                "photo_profil" => $res["photo_profil"],
                "my_reaction" => $this->fetchOneReactionResponseAvis("avisrestaurant_subresponse_reaction", $res["id"], $user_id),
                "all_reaction" => $this->fetchAllReactionResponseAvis("avisrestaurant_subresponse_reaction", $res["id"])
            ];

            array_push($new_res, $array);
        }

        return $new_res;
    }

    /**
     * @author Elie
     * Fetch all respona from avis d'un golf
     */
    public function fetchAllResponseAvisGolf($table, $avis_id, $user_id)
    {

        $statement = $this->getPDO()->PREPARE("SELECT * FROM $table 
        INNER JOIN (SELECT user_id, firstname, lastname, photo_profil FROM consumer 
        UNION SELECT user_id, firstname, lastname, photo_profil FROM supplier) as usr ON $table.user_id = usr.user_id
        WHERE avis_id = $avis_id order by id desc;
        ");

        $statement->execute();

        $result = $statement->fetchAll(PDO::FETCH_ASSOC);

        $table = "avisgolf_subresponse";

        $new_res = [];

        foreach ($result as $res) {
            $array = [
                "id" => $res["id"],
                "user_id" => $res["user_id"],
                "avis_id" => $res["avis_id"],
                "level_response" => $res["level_response"],
                "commentaire" => json_decode($res["commentaire"]),
                "type" => $res["type"],
                "datetime" => $res["datetime"],
                "firstname" => $res["firstname"],
                "lastname" => $res["lastname"],
                "photo_profil" => $res["photo_profil"],
                "all_subresponse" => $this->fetchAllSubResponseAvisGolf($table, $res["id"], $user_id),
                "my_reaction" => $this->fetchOneReactionResponseAvis("avisgolf_response_reaction", $res["id"], $user_id),
                "all_reaction" => $this->fetchAllReactionResponseAvis("avisgolf_response_reaction", $res["id"])
            ];

            array_push($new_res, $array);
        }

        return $new_res;
    }

    /**
     * @author Elie
     * Fetch all sous_response from avis d'un golf
     */
    public function fetchAllSubResponseAvisGolf($table, $response_id, $user_id)
    {

        $statement = $this->getPDO()->PREPARE("SELECT * FROM $table 
        INNER JOIN (SELECT user_id, firstname, lastname, photo_profil FROM consumer 
        UNION SELECT user_id, firstname, lastname, photo_profil FROM supplier) as usr ON $table.user_id = usr.user_id
        WHERE response_id = $response_id order by id desc;
        ");

        $statement->execute();

        $result = $statement->fetchAll(PDO::FETCH_ASSOC);

        $table = "avisgolf_subresponse";

        $new_res = [];

        foreach ($result as $res) {
            $array = [
                "id" => $res["id"],
                "user_id" => $res["user_id"],
                "response_id" => $res["response_id"],
                "level_response" => $res["level_response"],
                "commentaire" => json_decode($res["commentaire"]),
                "type" => $res["type"],
                "datetime" => $res["datetime"],
                "firstname" => $res["firstname"],
                "lastname" => $res["lastname"],
                "photo_profil" => $res["photo_profil"],
                "my_reaction" => $this->fetchOneReactionResponseAvis("avisgolf_subresponse_reaction", $res["id"], $user_id),
                "all_reaction" => $this->fetchAllReactionResponseAvis("avisgolf_subresponse_reaction", $res["id"])
            ];

            array_push($new_res, $array);
        }

        return $new_res;
    }

    /**
     * @author Elie
     * Fetch all respona from avis d'un rubrique
     */
    public function fetchAllResponseAvisV2($table, $avis_id, $my_id, $type, $confidentialityService)
    {

        $sql = "SELECT * FROM $table 
            INNER JOIN (SELECT user_id, firstname, lastname, photo_profil FROM consumer 
            UNION SELECT user_id, firstname, lastname, photo_profil FROM supplier) as usr ON $table.user_id = usr.user_id
            WHERE avis_id = $avis_id order by id desc;
        ";

        $statement = $this->getPDO()->PREPARE($sql);


        $statement->execute();

        $result = $statement->fetchAll(PDO::FETCH_ASSOC);

        $new_res = [];

        foreach ($result as $res) {

            $id_responses = json_decode($res['response_id']);

            $new_instance = [];

            if ($id_responses) {

                $list_response_id = explode(',', $id_responses);

                if (count($list_response_id) > 0) {

                    for ($b = 0; $b < count($list_response_id) - 1; $b++) {

                        $new_id_resp = $list_response_id[$b];

                        array_push($new_instance, $this->fetchAllResponseOfReponse($table, $new_id_resp, $my_id, $type, $confidentialityService));
                    }
                }
            }

            $table_reaction = "";

            if ($type == "golf") {
                $table_reaction = "avisgolf_response_reaction";
            }

            if ($type == "restaurant") {
                $table_reaction = "avisrestaurant_response_reaction";
            }
            $fullname = $confidentialityService->getConfFullname($res["user_id"], $my_id);
            $array = [
                "id" => $res["id"],
                "user_id" => $res["user_id"],
                "avis_id" => $res["avis_id"],
                "response_id" => $res["response_id"],
                "commentaire" => json_decode($res["commentaire"]),
                "type" => $res["type"],
                "datetime" => $res["datetime"],
                "firstname" => $res["firstname"],
                "lastname" => $res["lastname"],
                "fullname" => $fullname,
                "photo_profil" => $res["photo_profil"],
                "all_response" => $new_instance,
                "my_reaction" => $this->fetchOneReactionResponseAvis($table_reaction, $res["id"], $my_id),
                "all_reaction" => $this->fetchAllReactionResponseAvis($table_reaction, $res["id"])
            ];

            array_push($new_res, $array);
        }

        // dd($new_res);

        return $new_res;
    }

    /**
     * @author Elie
     * Fetch all respona from avis d'un rubrique
     */
    public function fetchAllResponseOfReponse($table, $response_id, $my_id, $type, $confidentialityService)
    {

        $statement = $this->getPDO()->PREPARE("SELECT * FROM $table 
        INNER JOIN (SELECT user_id, firstname, lastname, photo_profil FROM consumer 
        UNION SELECT user_id, firstname, lastname, photo_profil FROM supplier) as usr ON $table.user_id = usr.user_id
        WHERE id = $response_id order by id desc;
        ");

        $statement->execute();

        $res = $statement->fetch(PDO::FETCH_ASSOC);

        $new_res = [];

        $id_responses = json_decode($res['response_id']);

        $new_instance = [];

        if ($id_responses) {

            $list_response_id = explode(',', $id_responses);

            if (count($list_response_id) > 0) {

                for ($b = 0; $b < count($list_response_id) - 1; $b++) {

                    $new_id_resp = $list_response_id[$b];

                    array_push($new_instance, $this->fetchAllResponseOfReponse($table, $new_id_resp, $my_id, $type, $confidentialityService));
                }
            }
        }

        $table_reaction = "";

        if ($type == "golf") {
            $table_reaction = "avisgolf_response_reaction";
        }

        if ($type == "restaurant") {
            $table_reaction = "avisrestaurant_response_reaction";
        }

        $fullname = $confidentialityService->getConfFullname($res["user_id"], $my_id);

        $array = [
            "id" => $res["id"],
            "user_id" => $res["user_id"],
            "avis_id" => $res["avis_id"],
            "response_id" => $res["response_id"],
            "commentaire" => json_decode($res["commentaire"]),
            "type" => $res["type"],
            "datetime" => $res["datetime"],
            "firstname" => $res["firstname"],
            "lastname" => $res["lastname"],
            "fullname" => $fullname,
            "photo_profil" => $res["photo_profil"],
            "all_response" => $new_instance,
            "my_reaction" => $this->fetchOneReactionResponseAvis($table_reaction, $res["id"], $my_id),
            "all_reaction" => $this->fetchAllReactionResponseAvis($table_reaction, $res["id"])
        ];

        array_push($new_res, $array);

        return $array;
    }

    /**
     * @author Tomm
     * update si le fan est plus de 2
     */
    public function updateUserFan($user_id)
    {
        $statement = $this->getPDO()->PREPARE("UPDATE user SET fan = 1 WHERE id = :id");
        $statement->bindParam(':id', $user_id);
        $statement->execute();
        $result = $statement->fetch(PDO::FETCH_ASSOC);
        return $result;
    }

    /**
     * @author Tomm
     * get si le fan est plus de 2
     */
    public function getUserFan($user_id)
    {
        $sql = "SELECT fan FROM user  WHERE id = :id";
        $statement = $this->getPDO()->PREPARE($sql);
        $statement->bindParam(':id', $user_id);
        $statement->execute();
        $result = $statement->fetch(PDO::FETCH_ASSOC);
        return $result;
    }

    /**
     * @author Tomm
     * update si le donateur vert est plus de 1
     */
    public function updateUserDonateurVert($user_id)
    {
        $statement = $this->getPDO()->PREPARE("UPDATE user SET donateur_vert = 1 WHERE id = :id");
        $statement->bindParam(':id', $user_id);
        $statement->execute();
        $result = $statement->fetch(PDO::FETCH_ASSOC);
        return $result;
    }

    /**
     * @author Tomm
     * get si le donateur vert est plus de 1
     */
    public function getUserDonateurVert($user_id)
    {
        $statement = $this->getPDO()->PREPARE("SELECT donateur_vert FROM user WHERE id = :id");
        $statement->bindParam(':id', $user_id);
        $statement->execute();
        $result = $statement->fetch(PDO::FETCH_ASSOC);
        return $result;
    }

    /**
     * @author Tomm
     * update si le donateur bleu est plus de 1
     */
    public function updateUserDonateurBleu($user_id)
    {
        $statement = $this->getPDO()->PREPARE("UPDATE user SET donateur_bleu = 1 WHERE id = :id");
        $statement->bindParam(':id', $user_id);
        $statement->execute();
        $result = $statement->fetch(PDO::FETCH_ASSOC);
        return $result;
    }

    /**
     * @author Tomm
     * get si le donateur bleu est plus de 1
     */
    public function getUserDonateurBleu($user_id)
    {
        $statement = $this->getPDO()->PREPARE("SELECT donateur_bleu FROM user WHERE id = :id");
        $statement->bindParam(':id', $user_id);
        $statement->execute();
        $result = $statement->fetch(PDO::FETCH_ASSOC);
        return $result;
    }

    /**
     * @author Tomm
     * get all id user
     */
    public function getAllIdUser()
    {
        $statement = $this->getPDO()->PREPARE("SELECT id FROM user WHERE 1");
        $statement->execute();
        $result = $statement->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    /**
     * @author Faniry
     * liste les fichier disponible dans le drop box du partisan
     * @param integer int id du partisan
     */
    public function getAllFileInDropBox($id){
        $tableName="dropbox_".$id;
        $sql="SELECT * FROM ". $tableName ." WHERE isdeleted = 0";
        $statement=$this->getPDO()->prepare($sql);
        $statement->execute();
        $results = $statement->fetchAll(PDO::FETCH_ASSOC);
        foreach($results as &$result){
            $result["file_name"]=mb_convert_encoding(
                ($this->convertUnicodeToUtf8(json_decode($result["file_name"]))),'UTF-8','UTF-8');
        }

        return $results;

    }

    /**
     * @author faniry
     * recupère un fichier spécifique dans le box du partisan
     * @param integer int id du partisan
     * @param string shortlink cle unique du fichier
     */
    public function getSpecificFileINDropBox($id,$shortLink){
        $tableName="dropbox_".$id;
        $sql="SELECT * FROM ".$tableName." WHERE short_link = :short_link and isdeleted = 0";
        $statement=$this->getPDO()->prepare($sql);
        $statement->bindParam(":short_link",$shortLink, PDO::PARAM_STR);
        $statement->execute();
        $results = $statement->fetchAll(PDO::FETCH_ASSOC);
        foreach($results as &$result){
            $result["file_name"]=mb_convert_encoding(
                ($this->convertUnicodeToUtf8(json_decode($result["file_name"]))),'UTF-8','UTF-8');
            $result["file_path"]=mb_convert_encoding(
                ($this->convertUnicodeToUtf8(json_decode($result["file_path"]))),'UTF-8','UTF-8');
        }
        return $results;
    }

     /**
     * @author faniry
     * supprime  un fichier spécifique dans le box du partisan
     * @param integer int id du partisan
     * @param string shortlink cle unique du fichier
     */
    public function deleteFileFromDropBox($id,$shortLink){
        $isDeleted=1;
        $tableName="dropbox_".$id;
        $sql="UPDATE ".$tableName ." SET isdeleted = :isdeleted WHERE short_link= :short_link";
        $statement=$this->getPDO()->prepare($sql);
        $statement->bindParam(":short_link",$shortLink,PDO::PARAM_STR);
        $statement->bindParam(":isdeleted",$isDeleted,PDO::PARAM_INT);
        $statement->execute();
    }

    /**
     * @author faniry
     * renommer  un fichier spécifique dans le box du partisan
     * @param integer int id du partisan
     * @param string shortlink cle unique du fichier
     * @param string newFileName le nouveau nom du fichier
     */
    public function renameFile($id,$shortLik,$newFileName){
        
        $tableName="dropbox_".$id;
        $sql="UPDATE ".$tableName ." SET file_name = :file_name WHERE short_link= :short_link";
        $statement=$this->getPDO()->prepare($sql);
        $statement->bindParam(":file_name",$newFileName,PDO::PARAM_STR);
        $statement->bindParam(":short_link",$shortLik,PDO::PARAM_STR);
        $statement->execute();

    }
   
    /**
     * @author faniry
     * Ajoute  un fichier spécifique dans le box du partisan
     * @param integer int id du partisan
     * @param string fileName nom du fichier
     * @param string filePath le chemin d'enregistrement du fichier
     * @param string fileSize taille du fichier
     * @param string fileExtension type du fichier
     * @param string $shortLink unique id
     */
    public function setFileInDropBox( 
    int $id,
    string $fileName,
    string $filePath,
    int $fileSize, 
    string $fileExtension,
    string $shortLink){
        $tableName="dropbox_".$id;
        $sql ="INSERT INTO ". $tableName ." (".
            "file_name,file_path, file_extension,file_size, short_link) ".
            "VALUES(:file_name,:file_path, :file_extension, :file_size, :short_link)";
        
        $statement=$this->getPDO()->prepare($sql);
        $statement->bindParam(':file_name', $fileName,PDO::PARAM_STR);
        $statement->bindParam(':file_path', $filePath,PDO::PARAM_STR);
        $statement->bindParam(':file_extension', $fileExtension,PDO::PARAM_STR);
        $statement->bindParam(':file_size', $fileSize,PDO::PARAM_INT);
        $statement->bindParam(':short_link', $shortLink,PDO::PARAM_STR);

        $statement->execute();

    }
}
