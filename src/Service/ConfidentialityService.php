<?php

namespace App\Service;

use PDO;
use App\Service\UserService;
use App\Service\TributGService;
use App\Repository\UserRepository;

class ConfidentialityService extends PDOConnexionService
{
    private $userRepository;
    private $tribuGService;
    private $userService;

    public function __construct(
        UserRepository $userRepository,
        TributGService $tribuGService,
        UserService $userService
    ){
        $this->userRepository = $userRepository;
        $this->tribuGService = $tribuGService;
        $this->userService = $userService;
    }

    /**
     * @author Nantenaina
     * Où : On utilise cette fonction pour la création de la table confidentialité pour chaque utilisateur
     * Localisation du fichier : ConfidentialityService.php
     * Je veux : attribuer une table confidentialité pour chaque utilisateur
     * @param int $userId : identifiant de l'utilisateur connecté
    */
    public function createConfidentialityTable($userId){

        $confidentialityTable = "confidentiality_".$userId;

        $sql = " CREATE TABLE IF NOT EXISTS " . $confidentialityTable . " (

            id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,

            cle varchar(255) NOT NULL,

            is_private TINYINT(1) NOT NULL DEFAULT '1',

            is_public TINYINT(1) NOT NULL DEFAULT '0',

            is_tribu TINYINT(1) NOT NULL DEFAULT '0',

            dateconf datetime NOT NULL DEFAULT current_timestamp(),

            CONSTRAINT cst_conf_cle UNIQUE (cle)

          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci";

        $this->getPDO()->exec($sql);

    }

    /**
     * @author Nantenaina
     * Où : On utilise cette fonction pour l'insértion d'un enregistrement dans la table confidentialité
     * Localisation du fichier : ConfidentialityService.php
     * Je veux : insérer un enregistrement dans la table confidentialité
     * @param int $userId : identifiant de l'utilisateur connecté
     * @param string $cle : email / firstname / lastname / adresse / phone_number
    */
    public function insertRowInConfidentiality($userId, $cle){

        $confidentialityTable = "confidentiality_".$userId;

        $canInsert = $this->checkIfCleExist($confidentialityTable, $cle) ? false : true;

        if($canInsert){

            $statement = $this->getPDO()->prepare("INSERT INTO $confidentialityTable (cle) values (:cle)");
    
            $statement->bindParam(':cle', $cle);
    
            $statement->execute();
        }

    }

    /**
     * @author Nantenaina
     * Où : On utilise cette fonction pour la création de la table confidentialité spécifique pour les tribus
     * Localisation du fichier : ConfidentialityService.php
     * Je veux : créer une table confidentialité spécifique pour les tribus
     * @param int $userId : identifiant de l'utilisateur connecté
    */
    public function createSpecificCriteriaConfidTribu($userId){

        $confidentialityTribuTable = "confidentiality_tribu_".$userId;

        $sql = " CREATE TABLE IF NOT EXISTS " . $confidentialityTribuTable . " (

            id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,

            tribu varchar(255) NOT NULL,

            is_public_email TINYINT(1) NOT NULL DEFAULT '0',

            is_public_firstname TINYINT(1) NOT NULL DEFAULT '0',

            is_public_lastname TINYINT(1) NOT NULL DEFAULT '0',

            is_public_adresse TINYINT(1) NOT NULL DEFAULT '0',

            is_public_phone_number TINYINT(1) NOT NULL DEFAULT '0',

            is_public_badge_fan TINYINT(1) NOT NULL DEFAULT '0',

            is_public_badge_don_bleu TINYINT(1) NOT NULL DEFAULT '0',

            is_public_badge_don_vert TINYINT(1) NOT NULL DEFAULT '0',

            is_public_badge_actionnaire TINYINT(1) NOT NULL DEFAULT '0',

            dateconf datetime NOT NULL DEFAULT current_timestamp(),

            CONSTRAINT cst_conf_tribu UNIQUE (tribu)

          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci";

        $this->getPDO()->exec($sql);

    }

    /**
     * @author Nantenaina
     * Où : On utilise cette fonction pour l'insértion d'un enregistrement dans la table confidentialité de tribus
     * Localisation du fichier : ConfidentialityService.php
     * Je veux : insérer un enregistrement dans la table confidentialité de tribus
     * @param int $userId : identifiant de l'utilisateur connecté
     * @param string $tribu : le nom de la table tribu
    */
    public function insertRowInConfTribu($userId, $tribu){

        $confidentialityTribuTable = "confidentiality_tribu_".$userId;

        $canInsert = $this->checkIfCleExist($confidentialityTribuTable, $tribu, true) ? false : true;

        if($canInsert){

            $statement = $this->getPDO()->prepare("INSERT INTO $confidentialityTribuTable (tribu) VALUES (:tribu)");
    
            $statement->bindParam(':tribu', $tribu);
    
            $statement->execute();

        }

    }

    /**
     * @author Nantenaina
     * Où : On utilise cette fonction pour l'affichage d'une ligne d'une table
     * Localisation du fichier : ConfidentialityService.php
     * Je veux : afficher une ligne d'une table
     * @param string $table : la table d'une base de données
     * @param string $cle : la clé unique
     * @param boolean $isTribu : est-ce qu'une confidentialité de tribu ?
     * @return array $result : Tableau associative
    */
    public function selectRowOnTable($table, $cle, $isTribu = false){

        $db = $_ENV["DATABASENAME"];
        $query = "SHOW TABLES FROM $db like '$table'";
        $sql = $this->getPDO()->query($query);
        $size = $sql->rowCount();
        
        $result = [];
        if($size > 0){
            if($isTribu){
                $sql = "SELECT * FROM $table WHERE tribu =:cle";
                $statement = $this->getPDO()->prepare($sql);
                $statement->bindParam(':cle', $cle);
            }else{
                $sql = "SELECT * FROM $table WHERE cle =:cle";
                $statement = $this->getPDO()->prepare($sql);
                $statement->bindParam(':cle', $cle);
            }
            $statement->execute();
            $result = $statement->fetchAll(PDO::FETCH_ASSOC);
        }
        return $result;
    }

    /**
     * @author Nantenaina
     * Où : On utilise cette fonction pour tester si un enregistrement existe déjà dans une table
     * Localisation du fichier : ConfidentialityService.php
     * Je veux : tester l'existence d'un enregistrement
     * @param string $table : la table d'une base de données
     * @param string $cle : la clé unique
     * @param boolean $isTribu : est-ce qu'une confidentialité de tribu ?
     * @return boolean $status: true / false
    */
    public function checkIfCleExist($table, $cle, $isTribu = false){
        if($isTribu){
            $result = $this->selectRowOnTable($table, $cle, true);
        }else{
            $result = $this->selectRowOnTable($table, $cle);
        }
    
        $number = count($result);
        $status = $number > 0 ? true : false;
        return $status;
    }

    /**
     * @author Nantenaina
     * Où : On utilise cette fonction pour tester si la valeur d'une colonne vaut 1
     * Localisation du fichier : ConfidentialityService.php
     * Je veux : tester si la valeur d'une colonne vaut 1
     * @param string $table : la table d'une base de données
     * @param string $cle : la clé unique
     * @param string $colonneName : le nom de la colonne d'une table de la base de données
     * @param boolean $isTribu : est-ce qu'une confidentialité de tribu ?
     * @return boolean $isTrue: true / false
    */
    public function checkIfTrue($table, $cle, $colonneName, $isTribu = false){
        if($isTribu){
            $result = $this->selectRowOnTable($table, $cle, true);
        }else{
            $result = $this->selectRowOnTable($table, $cle);
        }
        $number = count($result);
        $isTrue = false;
        if($number > 0){
            $row = $result[0];
            $isTrue = intval($row[$colonneName]) == 1;
        }
        return $isTrue;
    }

    /**
     * @author Nantenaina
     * Où : On utilise cette lister toutes les tables tribus
     * Localisation du fichier : ConfidentialityService.php
     * Je veux : lister toutes les tables tribus
     * @param int $userId : identifiant de l'utilisateur connecté
     * @return array $all_tribuT_G : Tableau associative
    */
    public function getTribuByIdUser($userId){

        $user = $this->userRepository->find($userId);

        $tableTribuG = $this->tribuGService->getTribuG($userId);
        $all_tribuT_G = [];
        if($tableTribuG != ""){
            $tribuGName = $this->userService->getTribuGName($tableTribuG);
    
            $all_tribuT_G = [["table_name" => $tableTribuG, "name"=> $tribuGName, "type"=>"g"]];
        }

        $json_tribuT_owned= $user->getTribuT();

        if( $json_tribuT_owned ){
            $decode_tribuT_owned = json_decode($json_tribuT_owned , true);
            if( !array_key_exists("name", $decode_tribuT_owned['tribu_t']) ){
                foreach($decode_tribuT_owned["tribu_t"] as $tribuT){
                    extract($tribuT);  /// $name
                    array_push($all_tribuT_G,["table_name" => $name, "name"=> $name_tribu_t_muable, "type"=>"t"] );
                }
            }else{
                array_push($all_tribuT_G, ["table_name" => $decode_tribuT_owned['tribu_t']['name'], "name"=> $decode_tribuT_owned['tribu_t']['name_tribu_t_muable'], "type"=>"t"] );
            }
        }

        $json_tribuT_joined = $user->getTribuTJoined();

        if( $json_tribuT_joined ){

            $decode_tribuT_joined = json_decode($json_tribuT_joined , true);
           
            if( !array_key_exists("name", $decode_tribuT_joined['tribu_t']) ){
                foreach($decode_tribuT_joined["tribu_t"] as $tribuT){
                    extract($tribuT);  /// $name
                    array_push($all_tribuT_G, ["table_name" => $name, "name"=> $name_tribu_t_muable, "type"=>"t"] );
                }
            }else{
                array_push($all_tribuT_G, ["table_name" => $decode_tribuT_joined['tribu_t']['name'], "name"=> $decode_tribuT_joined['tribu_t']['name_tribu_t_muable'], "type"=>"t"] );
            }

        }

        return $all_tribuT_G;
    }

    /**
     * @author Nantenaina
     * Où : On utilise cette fonction pour mettre à jour la confidentialité
     * Localisation du fichier : ConfidentialityService.php
     * Je veux : mettre à jour la confidentiality
     * @param string $table : la table confidentialité globale ou tribu
     * @param string $cle : la clé unique
     * @param int $is_private : 0 ou 1
     * @param int $is_public : 0 ou 1
     * @param int $is_tribu : 0 ou 1
    */
    public function updatePrincipalConfidentiality($table, $cle, $is_private, $is_public, $is_tribu){

        $statement = $this->getPDO()->prepare("UPDATE $table SET is_private =:is_private, is_public =:is_public, is_tribu =:is_tribu WHERE cle =:cle");

        $statement->bindParam(':cle', $cle);

        $statement->bindParam(':is_private', $is_private);

        $statement->bindParam(':is_public', $is_public);

        $statement->bindParam(':is_tribu', $is_tribu);

        $statement->execute();
    
    }

    /**
     * @author Nantenaina
     * Où : On utilise cette fonction pour mettre à jour la confidentialité
     * Localisation du fichier : ConfidentialityService.php
     * Je veux : mettre à jour la confidentiality
     * @param string $table : la table confidentialité globale ou tribu
     * @param string $tribu : le nom de la table tribu
     * @param string $colonne : le nom de la colonne
     * @param int $valeur : 0 ou 1
    */
    public function updateTribuConfidentiality($table, $tribu, $colonne, $valeur){

        $statement = $this->getPDO()->prepare("UPDATE $table SET $colonne =:valeur WHERE tribu =:tribu");

        $statement->bindParam(':tribu', $tribu);

        $statement->bindParam(':valeur', $valeur);

        $statement->execute();
    
    }

    /**
     * @author Nantenaina
     * Où : On utilise cette fonction pour savoir la visiblité d'un membre d'une tribu
     * Localisation du fichier : ConfidentialityService.php
     * Je veux : savoir la visiblité d'un membre d'une tribu
     * @param int $userId : identifiant d'un utilisateur
     * @param int $userIdConnected : identifiant de l'utilisateur connecté
     * @param array $allTribus : liste de tribu de l'identifiant $userId
     * @param string $confKey : email / nom complet / adresse / numéro de téléphone
     * @param string $column : is_public_email / is_public_firstname / is_public_last_name / is_public_adresse / is_public_phone_number / is_public_badge
     * @return boolean $isVisible : true / false
    */
    public function getVisibilityTribu($userId, $userIdConnected, $allTribus, $confKey, $column){
        $isKeyPublicOnTribu = $this->checkIfTrue("confidentiality_".$userId, $confKey, "is_tribu");
        $isVisible = false;
        if($isKeyPublicOnTribu){
            for ($i=0; $i < count($allTribus); $i++) { 
                $isPublic = $this->checkIfTrue("confidentiality_tribu_".$userId, $allTribus[$i]["table_name"], $column, true);
                if($isPublic){
                    $userInfo = $this->getUserIdOnTribu($allTribus[$i]["table_name"], $userIdConnected);
                    if($userInfo){
                        $isVisible = true;
                        break;
                    }
                }
            }
        }
        return $isVisible;
    }


    /**
     * @author Nantenaina
     * Où : On utilise cette fonction pour savoir si l'utilisateur connecté est membre de la tribu $tableTribu
     * Localisation du fichier : ConfidentialityService.php
     * Je veux : savoir si l'utilisateur connecté est membre de la tribu $tableTribu
     * @param string $tableTribu : le nom de la table tribu
     * @param int $userIdConnected : identifiant de l'utilisateur connecté
    */
    public function getUserIdOnTribu($tableTribu, $userIdConnected){
        $statement = $this->getPDO()->prepare("SELECT * FROM $tableTribu WHERE user_id =:user_id");
        $statement->bindParam(':user_id', $userIdConnected);
        $statement->execute();
        $result = $statement->fetch(PDO::FETCH_ASSOC);
        return $result;
    }

    /**
     * @author Nantenaina
     * Où : On utilise cette fonction pour savoir la visiblité d'un email de l'identifiant $userId
     * Localisation du fichier : ConfidentialityService.php
     * Je veux : savoir la visiblité d'un email de l'identifiant $userId
     * @param int $userId : identifiant d'un utilisateur
     * @param int $userIdConnected : identifiant de l'utilisateur connecté
    */
    public function getVisibilityEmail($userId, $userIdConnected){

        $isEmailPrivate = $this->checkIfTrue("confidentiality_".$userId, "email", "is_private");
        if($isEmailPrivate){
            return false;
        }else{
            $isEmailPublic = $this->checkIfTrue("confidentiality_".$userId, "email", "is_public");
            if($isEmailPublic){
                return true;
            }else{
                $allTribus = $this->getTribuByIdUser($userId);
                return $this->getVisibilityTribu($userId, $userIdConnected, $allTribus, "email", "is_public_email");
            }
        }
        
    }

    /**
     * @author Nantenaina
     * Où : On utilise cette fonction pour savoir la visiblité du prénom de l'identifiant $userId
     * Localisation du fichier : ConfidentialityService.php
     * Je veux : savoir la visiblité du prénom de l'identifiant $userId
     * @param int $userId : identifiant d'un utilisateur
     * @param int $userIdConnected : identifiant de l'utilisateur connecté
    */
    public function getVisibilityFirstName($userId, $userIdConnected){

        $isFirstNamePrivate = $this->checkIfTrue("confidentiality_".$userId, "firstname", "is_private");
        if($isFirstNamePrivate){
            return false;
        }else{
            $isFirstNamePublic = $this->checkIfTrue("confidentiality_".$userId, "firstname", "is_public");
            if($isFirstNamePublic){
                return true;
            }else{
                $allTribus = $this->getTribuByIdUser($userId);
                return $this->getVisibilityTribu($userId, $userIdConnected, $allTribus, "firstname", "is_public_firstname");
            }
        }
        
    }

    /**
     * @author Nantenaina
     * Où : On utilise cette fonction pour savoir la visiblité du nom de l'identifiant $userId
     * Localisation du fichier : ConfidentialityService.php
     * Je veux : savoir la visiblité du nom de l'identifiant $userId
     * @param int $userId : identifiant d'un utilisateur
     * @param int $userIdConnected : identifiant de l'utilisateur connecté
    */
    public function getVisibilityLastName($userId, $userIdConnected){

        $isLastNamePrivate = $this->checkIfTrue("confidentiality_".$userId, "lastname", "is_private");
        if($isLastNamePrivate){
            return false;
        }else{
            $isLastNamePublic = $this->checkIfTrue("confidentiality_".$userId, "lastname", "is_public");
            if($isLastNamePublic){
                return true;
            }else{
                $allTribus = $this->getTribuByIdUser($userId);
                return $this->getVisibilityTribu($userId, $userIdConnected, $allTribus, "lastname", "is_public_lastname");
            }
        }
        
    }

    /**
     * @author Nantenaina
     * Où : On utilise cette fonction pour savoir la visiblité de l'adresse de l'identifiant $userId
     * Localisation du fichier : ConfidentialityService.php
     * Je veux : savoir la visiblité de l'adresse de l'identifiant $userId
     * @param int $userId : identifiant d'un utilisateur
     * @param int $userIdConnected : identifiant de l'utilisateur connecté
    */
    public function getVisibilityAdresse($userId, $userIdConnected){

        $isAdressePrivate = $this->checkIfTrue("confidentiality_".$userId, "adresse", "is_private");
        if($isAdressePrivate){
            return false;
        }else{
            $isAdressePublic = $this->checkIfTrue("confidentiality_".$userId, "adresse", "is_public");
            if($isAdressePublic){
                return true;
            }else{
                $allTribus = $this->getTribuByIdUser($userId);
                return $this->getVisibilityTribu($userId, $userIdConnected, $allTribus, "adresse", "is_public_adresse");
            }
        }
        
    }

    /**
     * @author Nantenaina
     * Où : On utilise cette fonction pour savoir la visiblité du numéro de téléphone de l'identifiant $userId
     * Localisation du fichier : ConfidentialityService.php
     * Je veux : savoir la visiblité du numéro de téléphone de l'identifiant $userId
     * @param int $userId : identifiant d'un utilisateur
     * @param int $userIdConnected : identifiant de l'utilisateur connecté
    */
    public function getVisibilityPhoneNumber($userId, $userIdConnected){

        $isPhoneNumberPrivate = $this->checkIfTrue("confidentiality_".$userId, "phone_number", "is_private");
        if($isPhoneNumberPrivate){
            return false;
        }else{
            $isPhoneNumberPublic = $this->checkIfTrue("confidentiality_".$userId, "phone_number", "is_public");
            if($isPhoneNumberPublic){
                return true;
            }else{
                $allTribus = $this->getTribuByIdUser($userId);
                return $this->getVisibilityTribu($userId, $userIdConnected, $allTribus, "phone_number", "is_public_phone_number");
            }
        }
        
    }

    /**
     * @author Nantenaina
     * Où : On utilise cette fonction pour savoir la visiblité du badge fan de l'identifiant $userId
     * Localisation du fichier : ConfidentialityService.php
     * Je veux : savoir la visiblité du badge fan de l'identifiant $userId
     * @param int $userId : identifiant d'un utilisateur
     * @param int $userIdConnected : identifiant de l'utilisateur connecté
    */
    public function getVisibilityBadgeFan($userId, $userIdConnected){

        $isBadgePrivate = $this->checkIfTrue("confidentiality_".$userId, "badgeFan", "is_private");
        if($isBadgePrivate){
            return false;
        }else{
            $isBadgePublic = $this->checkIfTrue("confidentiality_".$userId, "badgeFan", "is_public");
            if($isBadgePublic){
                return true;
            }else{
                $allTribus = $this->getTribuByIdUser($userId);
                return $this->getVisibilityTribu($userId, $userIdConnected, $allTribus, "badgeFan", "is_public_badge_fan");
            }
        }
        
    }

    /**
     * @author Nantenaina
     * Où : On utilise cette fonction pour savoir la visiblité du badge donateur bleu de l'identifiant $userId
     * Localisation du fichier : ConfidentialityService.php
     * Je veux : savoir la visiblité du badge donateur bleu de l'identifiant $userId
     * @param int $userId : identifiant d'un utilisateur
     * @param int $userIdConnected : identifiant de l'utilisateur connecté
    */
    public function getVisibilityBadgeDonBleu($userId, $userIdConnected){

        $isBadgePrivate = $this->checkIfTrue("confidentiality_".$userId, "badgeDonateurBleu", "is_private");
        if($isBadgePrivate){
            return false;
        }else{
            $isBadgePublic = $this->checkIfTrue("confidentiality_".$userId, "badgeDonateurBleu", "is_public");
            if($isBadgePublic){
                return true;
            }else{
                $allTribus = $this->getTribuByIdUser($userId);
                return $this->getVisibilityTribu($userId, $userIdConnected, $allTribus, "badgeDonateurBleu", "is_public_badge_don_bleu");
            }
        }
        
    }

    /**
     * @author Nantenaina
     * Où : On utilise cette fonction pour savoir la visiblité du badge donateur vert de l'identifiant $userId
     * Localisation du fichier : ConfidentialityService.php
     * Je veux : savoir la visiblité du badge vert bleu de l'identifiant $userId
     * @param int $userId : identifiant d'un utilisateur
     * @param int $userIdConnected : identifiant de l'utilisateur connecté
    */
    public function getVisibilityBadgeDonVert($userId, $userIdConnected){

        $isBadgePrivate = $this->checkIfTrue("confidentiality_".$userId, "badgeDonateurVert", "is_private");
        if($isBadgePrivate){
            return false;
        }else{
            $isBadgePublic = $this->checkIfTrue("confidentiality_".$userId, "badgeDonateurVert", "is_public");
            if($isBadgePublic){
                return true;
            }else{
                $allTribus = $this->getTribuByIdUser($userId);
                return $this->getVisibilityTribu($userId, $userIdConnected, $allTribus, "badgeDonateurVert", "is_public_badge_don_vert");
            }
        }
        
    }

    /**
     * @author Nantenaina
     * Où : On utilise cette fonction pour savoir la visiblité du badge actionnaire de l'identifiant $userId
     * Localisation du fichier : ConfidentialityService.php
     * Je veux : savoir la visiblité du badge actionnaire de l'identifiant $userId
     * @param int $userId : identifiant d'un utilisateur
     * @param int $userIdConnected : identifiant de l'utilisateur connecté
    */
    public function getVisibilityBadgeActionnaire($userId, $userIdConnected){

        $isBadgePrivate = $this->checkIfTrue("confidentiality_".$userId, "badgeActionnaire", "is_private");
        if($isBadgePrivate){
            return false;
        }else{
            $isBadgePublic = $this->checkIfTrue("confidentiality_".$userId, "badgeActionnaire", "is_public");
            if($isBadgePublic){
                return true;
            }else{
                $allTribus = $this->getTribuByIdUser($userId);
                return $this->getVisibilityTribu($userId, $userIdConnected, $allTribus, "badgeActionnaire", "is_public_badge_actionnaire");
            }
        }
        
    }

    public function generateConfidentiality($userId){
        $this->createConfidentialityTable($userId);
        $this->insertRowInConfidentiality($userId, "email");
        $this->insertRowInConfidentiality($userId, "firstname");
        $this->insertRowInConfidentiality($userId, "lastname");
        $this->insertRowInConfidentiality($userId, "adresse");
        $this->insertRowInConfidentiality($userId, "phone_number");
        $this->insertRowInConfidentiality($userId, "badgeFan");
        $this->insertRowInConfidentiality($userId, "badgeDonateurBleu");
        $this->insertRowInConfidentiality($userId, "badgeDonateurVert");
        $this->insertRowInConfidentiality($userId, "badgeActionnaire");
        $this->createSpecificCriteriaConfidTribu($userId);
        $allTribus_T_G = $this->getTribuByIdUser($userId);
        foreach ($allTribus_T_G as $key ) {
            $this->insertRowInConfTribu($userId, $key["table_name"]);
        }
    }

    /**
     * @author Nantenaina
     * Où : On utilise cette fonction pour tester si un pseudo est disponible pour la modification
     * Localisation du fichier : ConfidentialityService.php
     * Je veux : tester si un pseudo est disponible pour la modification
     * @param int $userId : identifiant d'un utilisateur
     * @param string $pseudo : identifiant de l'utilisateur connecté
    */
    public function isPseudoAvailable($userId, $pseudo){
        $statement = $this->getPDO()->prepare("SELECT IF(EXISTS (SELECt * FROM `user` WHERE pseudo=:pseudo AND id<>:user_id),true,false) as result");
        $statement->bindParam(":user_id",$userId,PDO::PARAM_INT);
        $statement->bindParam(":pseudo",$pseudo,PDO::PARAM_STR);
        $statement->execute();
        $result = $statement->fetch(PDO::FETCH_ASSOC);
        return $result;
    }

    /**
     * @author Nantenaina
     * Où : On utilise cette fonction pour afficher le nom d'un identifiant $otherId à une certaine confidentialité
     * Localisation du fichier : ConfidentialityService.php
     * Je veux : afficher le nom d'un identifiant $otherId à une certaine confidentialité
     * @param int $userId : identifiant de l'utilisateur connecté
     * @param int $otherId : identifiant d'un utilisateur
    */
    public function getConfFullname($otherId, $userId){

        $pseudo = $this->getPseudoOfUser($otherId);
        $firstName = $this->getVisibilityFirstName(intval($otherId), intval($userId)) ? $this->userService->getUserFirstName(intval($otherId)) : "";
        $lastName = $this->getVisibilityLastName(intval($otherId), intval($userId)) ? $this->userService->getUserLastName(intval($otherId)):"";
        if($firstName != "" && $lastName != ""){
            $pseudo = $lastName . " " . $firstName;
        }else{
            if($firstName == "" && $lastName != ""){
                $pseudo = $lastName;
            }elseif($firstName != "" && $lastName == ""){
                $pseudo = $firstName;
            }
        }

        return $pseudo;
    }

    /**
     * @author Nantenaina
     * Où : On utilise cette fonction pour modifier la structure de la table confidentialité de tribu
     * Localisation du fichier : ConfidentialityService.php
     * Je veux : modifier la structure de la table confidentialité de tribu
    */
    public function alterTableConfTribu(){
        $statement = $this->getPDO()->prepare("SELECT * FROM user");
        $statement->execute();
        $users = $statement->fetchAll(PDO::FETCH_ASSOC);
        if(count($users)>0){
            foreach ($users as $key) {
                $userId = $key["id"];
                $tableConfTribu = "confidentiality_tribu_".$userId;
                $isTableExist = $this->isTableExist($tableConfTribu);
                if($isTableExist){
                    $sql = "ALTER TABLE $tableConfTribu DROP COLUMN IF EXISTS `is_public_badge`, ADD COLUMN IF NOT EXISTS `is_public_badge_fan` TINYINT(1) NOT NULL DEFAULT '0' AFTER `is_public_phone_number`, ADD COLUMN IF NOT EXISTS `is_public_badge_don_bleu` TINYINT(1) NOT NULL DEFAULT '0' AFTER `is_public_badge_fan`, ADD COLUMN IF NOT EXISTS `is_public_badge_don_vert` TINYINT(1) NOT NULL DEFAULT '0' AFTER `is_public_badge_don_bleu`, ADD COLUMN IF NOT EXISTS `is_public_badge_actionnaire` TINYINT(1) NOT NULL DEFAULT '0' AFTER `is_public_badge_don_vert`";
                    $this->getPDO()->exec($sql);
                }
            }
            return "OK";
        }
    }
}
