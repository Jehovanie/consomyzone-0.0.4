<?php 

namespace App\Service;

use PDO;
use App\Service\PDOConnexionService;

class GolfFranceService extends PDOConnexionService{

    public function getAllData($userID= null){
        $golffrance= "golffrance";
        $leftjoin= "golffinished";

        $results= [];
        $statement = $this->getPDO()->prepare("SELECT gl.id, web, dep, nom_dep, cp, site_web, nom_golf as name, adr1 as adress, adr2, adr3, e_mail as email, nom_commune as commune, latitude as lat, longitude, lg.golf_id as golfID, lg.user_id as userID FROM $golffrance as gl left join $leftjoin as lg on gl.id= lg.golf_id");
        $statement->execute();

        $data = $statement->fetchAll(PDO::FETCH_ASSOC);

        for($i=0; $i< count($data); $i++){
            extract($data[$i]);

            $result = [
               "id" => $id,
               "web" => $web, 
               "dep" => $dep,
               "cp" => $cp,
               "site_web" => $site_web,
               "name" => $name,
               "adress" => $adress,
               "adr2" => $adr2,
               "adr3" => $adr3,
               "email" => $email,
               "commune" => $commune,
               "lat" => $lat,
               "long" => $longitude,
               "user" => [
                "id" => $userID,
                "golf_id" => $golf_id
               ]
            ];

            array_push($results,$result);
        }

        return $results;
    }

    /**
     * @author Nantenaina <email>
     * où= dans la fonction getAllRestCoor
     * location=RestaurantController.phpo
     * je veux fussioner les  resto recupéré apres  appel de la fonction getDataBetweenAnd() et leur note
     * pour avoir les notes
     */
    public function mergeDatasAndAvis($datas,$notes){
        $noteExist=[];
        foreach($datas as $data){
            foreach($notes as $note){
                if(intval($data["id"]) === intval($note["id_golf"])){
                    // array_push($noteExist,array_merge($data,$note));
                    $data["moyenne_note"] = $note["moyenne_note"];
                    $data["id_golf"] = $note["id_golf"];
                    array_push($noteExist,$data);
                    break;
                }
               
            }
            if( !isset($data["moyenne_note"]))
                array_push($noteExist,$data);
        }
       return $noteExist;
        
    }
}

?>