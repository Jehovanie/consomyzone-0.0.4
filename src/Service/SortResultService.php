<?php
namespace App\Service;

class SortResultService extends StringTraitementService

{
    public function shortResult($cle0, $cle1, $list){
        $results = array();
        $cle0 = $this->removeWhiteSpace($cle0);
        $cle0 = $this->normalizedString($cle0);
        $cle1 = $this->removeWhiteSpace($cle1);
        $cle1 = $this->normalizedString($cle1);
        $tab0 = explode(" ",$cle0);
	    $tab = explode(" ",$cle1);
        $n0 = count($tab0);
	    $n = count($tab);
        foreach ($list[0] as $key) {
            //$boolean_nom = false;
            //$boolean_addresse = false;
            $decision_nom = 0;
            $decision_addresse = 0;
            $levNom = 0;
            $levAdresse = 0;
            $nom = $this->removeWhiteSpace($key["nom"]);
            $nom = $this->normalizedString($nom);
            $add = $this->removeWhiteSpace($key["add"]);
            $add = $this->normalizedString($add);
            $levTotal = 0;

            if($cle0 != "" && $cle1 == ""){

                if($nom == $cle0){
                    $levNom = 0;
                }elseif($this->containsWord($nom, $cle0)){
                    $levNom = 0.2;
                }elseif(str_contains($nom, $cle0)){
                    $levNom = 0.5;
                }elseif($this->permute($decision_nom, $cle0, 0, $n0 - 1, $nom) == 1) {
                    $levNom = 0;
                }elseif($this->permute($decision_nom, $cle0, 0, $n0 - 1, $nom) == 2) {
                    $levNom = 0.5;
                }else{
                    $levNom = levenshtein($cle0, $nom);
                }

                $levTotal = floatval($levNom);

            }elseif($cle0 == "" && $cle1 != ""){

                if($add == $cle1){
                    $levAdresse = 0;
                }elseif($this->containsWord($add, $cle1)){
                    $levAdresse = 0.2;
                }elseif(str_contains($add, $cle1)){
                    $levAdresse = 1;
                }elseif ($this->permute($decision_addresse, $cle1, 0, $n - 1, $add) == 1) {
                    $levAdresse = 0;
                }elseif ($this->permute($decision_addresse, $cle1, 0, $n - 1, $add) == 2) {
                    $levAdresse = 1;
                }else{
                    $levAdresse = levenshtein($cle1, $add);
                }

                $levTotal = floatval($levAdresse);


            }else{

                /** Classifier % au nom */
                /*if($cle0 === "station" || $cle0 === "stations" || $cle0 === "station service" || $cle0 === "stations services" || $cle0 === "ferme" || $cle0 === "fermes" 
                || $cle0 === "resto" || $cle0 === "restos" || $cle0 === "restaurant" || $cle0 === "restaurants" 
                || $cle0 === "tabac" || $cle0 === "tabacs" || $cle0 === "golf" || $cle0 === "golfs"){
                    $levNom = 0;
                }else*/if(str_contains($nom, $cle0) && $nom == $cle0){
                    $levNom = 0;
                }elseif($this->containsWord($nom, $cle0)){
                    $levNom = 0.2;
                }elseif(str_contains($nom, $cle0)  && $nom != $cle0){
                    $levNom = 0.5;
                }elseif($this->permute($decision_nom, $cle0, 0, $n0 - 1, $nom) == 1) {
                    $levNom = 0;
                }elseif($this->permute($decision_nom, $cle0, 0, $n0 - 1, $nom) == 2) {
                    $levNom = 0.5;
                }else{
                    $levNom = levenshtein($cle0, $nom);
                }

                /** Classifier % à l'adresse */
                if(str_contains($add, $cle1) && $add == $cle1){
                    $levAdresse = 0;
                }elseif($this->containsWord($add, $cle1)){
                    $levAdresse = 0.2;
                }elseif(str_contains($add, $cle1)  && $add != $cle1){
                    $levAdresse = 1;
                }elseif ($this->permute($decision_addresse, $cle1, 0, $n - 1, $add) == 1) {
                    $levAdresse = 0;
                }elseif ($this->permute($decision_addresse, $cle1, 0, $n - 1, $add) == 2) {
                    $levAdresse = 1;
                }else{
                    $levAdresse = levenshtein($cle1, $add);
                }
                
                if(floatval($levNom) == 0 && floatval($levAdresse) == 0){
                    $levTotal = 0;
                }elseif((floatval($levNom) == 0 && floatval($levAdresse) > 1)){
                    $levTotal = 0.5 + floatval($levNom);
                }elseif(floatval($levNom) == 0.5 && floatval($levAdresse) > 1){
                    $levTotal = 1.3 + floatval($levNom);
                }elseif((floatval($levNom) == 0 && floatval($levAdresse) == 1)){
                    $levTotal = 0.2;
                }elseif((floatval($levNom) == 0.5 && floatval($levAdresse) == 1)){
                    $levTotal = 0.4;
                }elseif(floatval($levNom) == 0.5 && floatval($levAdresse) == 0){
                    $levTotal = 0.3;
                }elseif(floatval($levNom) > 0.5 && floatval($levAdresse) == 0){
                    $levTotal = 0.5 + floatval($levAdresse);
                }elseif(floatval($levNom) > 0.5 && floatval($levAdresse) == 1){
                    $levTotal = 1 + floatval($levAdresse);
                }elseif(floatval($levNom) > 1 && floatval($levAdresse) == 1){
                    $levTotal = 1.5 + floatval($levAdresse);
                }else{
                    $levTotal = floatval($levNom) + floatval($levAdresse);
                }
            }

            $key["levTotal"] = $levTotal;

            array_push($results, $key);
        }

        $key_values = array_column($results, 'levTotal');

        array_multisort($key_values, SORT_ASC, $results);

        return $results;
    }

    function permute(&$decision,$str, $l, $r, $str2) 
    {

        if($l == $r){
            if(str_contains($str2, $str) && $str2 == $str){       
                $decision = 1;
            }elseif(str_contains($str2, $str)  && $str2 != $str){
                $decision = 2;
            }
        }
        else{
            for ($i = $l; $i <= $r; $i++) { 
                $str = $this->swap($str, $l, $i); 
                $this->permute($decision,$str, $l + 1, $r, $str2);
                if ($decision == 1 || $decision == 2) {
                    break;
                }
                
            }
        }
        return  $decision;
    }
  
    function swap($string, $i, $j) 
    {
        $temp = ""; 
        $word = explode(" ", $string);
        $temp = $word[$i]; 
        $word[$i] = $word[$j]; 
        $word[$j] = $temp; 
        return implode(" ", $word);
    }


    function sortTapByKey($array, $firstKey, $secondKey=null){
        $length = count($array);

        for($i=0; $i<$length; $i++){
            $firstValue=($secondKey !== null) ? strtotime($array[$i][$firstKey][$secondKey]) : strtotime($array[$i][$firstKey]);

            for($j=$i; $j< $length; $j++ ){
                $secondValue=($secondKey !== null) ? strtotime($array[$j][$firstKey][$secondKey]) :strtotime($array[$j][$firstKey]);

                if ( intval($firstValue) < intval($secondValue)){
                    $tmp = $array[$i];
                    $array[$i] = $array[$j];
                    $array[$j] = $tmp;
                }
            }
        }
        return $array;
    }

    function containsWord($haystack, $needle)
    {
        return preg_match("/\b{$needle}\b/", $haystack) === 1;
    }

    /**
     * @author Nantenaina <nantenainasoa39@gmail.com>
     * où: On utilise cette fonction dans HomeController.php
     * localisation du fichier: dans SortResultService.php,
     * je veux: optimiser le moteur de recherche par rapport au nom de la commune
     * si l'adresse saisie par l'internaute ne contient pas de chiffres on se focalise sur la recherche communale 
     * @param array $data
     * @param string $cles1,
     *  @param string $type
     * @return array
     */
    function getDataByCommune($data, $cles1, $type="restaurant", $cle0=""){
        $data0 = [];
        $results = [];
        $text = $cles1;
        $adrs = explode(" ",trim($text));
        $hasCP = false;
        $hasNumVoie = false;
        $cpInput = "";

        foreach($adrs as $mot){
            if(is_numeric($mot) && strlen($mot) == 5)
                $hasCP = true;
                $cpInput = $mot;
            if(is_numeric($mot) && strlen($mot) < 5)
                $hasNumVoie = true;
        }

        $i = 0;

        foreach ($data[0] as $key) {

            if($type=="restaurant"){

                if($cle0 !=""){
                    if(str_contains($key["nom"], $cle0)){
                        if((!$hasCP && !$hasNumVoie) ||  ($hasCP && !$hasNumVoie)){
        
                            $levCommune = levenshtein(strtoupper(($key["villenorm"])), strtoupper($cles1));
        
                            if($hasCP){//&& $cpInput == $key["codpost"]
                                $cles1 = preg_replace('/(\d+)/i', '', $cles1);
                                $cles1 = trim($cles1);
                                $levCommune = levenshtein(strtoupper($key["villenorm"]), strtoupper($cles1));
                            }
            
                            if($levCommune <= 3){
                                array_push($data0, $key);
                                $i++;
                            }
                        }elseif ($hasNumVoie && !$hasCP) {
                            $levStreet = levenshtein(strtoupper($key["numvoie"]." ".$key["typevoie"]." ".$key["nomvoie"]), strtoupper(trim($cles1)));
                            if($levStreet <= 3){
                                array_push($data0, $key);
                                $i++;
                            }
                        }else{
                            $levAdresse = levenshtein(strtoupper(trim($key["add"])), strtoupper(trim($cles1)));
                            if($levAdresse <= 3){
                                array_push($data0, $key);
                                $i++;
                            }
                        }
                    }
                }else{

                    if((!$hasCP && !$hasNumVoie) ||  ($hasCP && !$hasNumVoie)){
        
                        $levCommune = levenshtein(strtoupper(($key["villenorm"])), strtoupper($cles1));
    
                        if($hasCP){//&& $cpInput == $key["codpost"]
                            $cles1 = preg_replace('/(\d+)/i', '', $cles1);
                            $cles1 = trim($cles1);
                            $levCommune = levenshtein(strtoupper($key["villenorm"]), strtoupper($cles1));
                        }
        
                        if($levCommune <= 3){
                            array_push($data0, $key);
                            $i++;
                        }
                    }elseif ($hasNumVoie && !$hasCP) {
                        $levStreet = levenshtein(strtoupper($key["numvoie"]." ".$key["typevoie"]." ".$key["nomvoie"]), strtoupper(trim($cles1)));
                        if($levStreet <= 3){
                            array_push($data0, $key);
                            $i++;
                        }
                    }else{
                        $levAdresse = levenshtein(strtoupper(trim($key["add"])), strtoupper(trim($cles1)));
                        if($levAdresse <= 3){
                            array_push($data0, $key);
                            $i++;
                        }
                    }
                }

            }elseif($type=="ferme"){

                if($cle0 !=""){
                    if(str_contains($key["nom"], $cle0)){
                        if((!$hasCP && !$hasNumVoie) ||  ($hasCP && !$hasNumVoie)){
        
                            $levCommune = levenshtein(strtoupper($key["ville"]), strtoupper($cles1));
        
                            if($hasCP){
                                $cles1 = preg_replace('/(\d+)/i', '', $cles1);
                                $cles1 = trim($cles1);
                                $levCommune = levenshtein(strtoupper($key["ville"]), strtoupper($cles1));
                            }
            
                            if($levCommune <= 3){
                                array_push($data0, $key);
                                $i++;
                            }
        
                        }elseif ($hasNumVoie && !$hasCP) {
                            $street = explode(trim($key["codePostal"]),trim($key["add"]));
                            $levStreet = levenshtein(strtoupper(trim($street[0])), strtoupper(trim($cles1)));
                            if($levStreet <= 3){
                                array_push($data0, $key);
                                $i++;
                            }
                        }else{
                            $levAdresse = levenshtein(strtoupper($key["add"]), strtoupper(trim($cles1)));
                            if($levAdresse <= 3){
                                array_push($data0, $key);
                                $i++;
                            }
                        }
                    }
                }else{

                    if((!$hasCP && !$hasNumVoie) ||  ($hasCP && !$hasNumVoie)){
        
                        $levCommune = levenshtein(strtoupper($key["ville"]), strtoupper($cles1));
    
                        if($hasCP){
                            $cles1 = preg_replace('/(\d+)/i', '', $cles1);
                            $cles1 = trim($cles1);
                            $levCommune = levenshtein(strtoupper($key["ville"]), strtoupper($cles1));
                        }
        
                        if($levCommune <= 3){
                            array_push($data0, $key);
                            $i++;
                        }
    
                    }elseif ($hasNumVoie && !$hasCP) {
                        $street = explode(trim($key["codePostal"]),trim($key["add"]));
                        $levStreet = levenshtein(strtoupper(trim($street[0])), strtoupper(trim($cles1)));
                        if($levStreet <= 3){
                            array_push($data0, $key);
                            $i++;
                        }
                    }else{
                        $levAdresse = levenshtein(strtoupper($key["add"]), strtoupper(trim($cles1)));
                        if($levAdresse <= 3){
                            array_push($data0, $key);
                            $i++;
                        }
                    }
                }

            }elseif($type=="station"){

                $keyAdd = trim($key["add"]);
                $adresse = explode(" ",$keyAdd);
                $cp = "";

                foreach($adresse as $mot){
                    if(is_numeric($mot) && strlen($mot) == 5){
                        $cp = $mot;
                    }
                }

                if($cle0 !=""){
                    if(str_contains($key["nom"], $cle0)){
                        if((!$hasCP && !$hasNumVoie) ||  ($hasCP && !$hasNumVoie)){   
                            $keyVille = "";
                            if(strlen($cp) == 5){
                                $ville = explode($cp,$keyAdd);
                                $keyVille = $ville[1];
                                $levStreet = levenshtein(strtoupper(trim($keyVille)), strtoupper(trim($cles1)));
                                if($levStreet <= 3){
                                    array_push($data0, $key);
                                    $i++;
                                }
                            }
        
                            $levCommune = levenshtein(strtoupper($keyVille), strtoupper($cles1));
        
                            if($hasCP){//&& $cpInput == $cp
        
                                $cles1 = preg_replace('/(\d+)/i', '', $cles1);
                                $cles1 = trim($cles1);
                                $levCommune = levenshtein(strtoupper($keyVille), strtoupper($cles1));
                            }
            
                            if($levCommune <= 3){
                                array_push($data0, $key);
                                $i++;
                            }
        
                        }elseif ($hasNumVoie && !$hasCP) {
                            if(strlen($cp) == 5){
                                $street = explode($cp,$keyAdd);
                                $levStreet = levenshtein(strtoupper(trim($street[0])), strtoupper(trim($cles1)));
                                if($levStreet <= 3){
                                    array_push($data0, $key);
                                    $i++;
                                }
                            }
                        }else{
                            $levAdresse = levenshtein(strtoupper($keyAdd), strtoupper(trim($cles1)));
                            if($levAdresse <= 3){
                                array_push($data0, $key);
                                $i++;
                            }
                        }
                    }
                }else{

                    if((!$hasCP && !$hasNumVoie) ||  ($hasCP && !$hasNumVoie)){   
                        $keyVille = "";
                        if(strlen($cp) == 5){
                            $ville = explode($cp,$keyAdd);
                            $keyVille = $ville[1];
                            $levStreet = levenshtein(strtoupper(trim($keyVille)), strtoupper(trim($cles1)));
                            if($levStreet <= 3){
                                array_push($data0, $key);
                                $i++;
                            }
                        }
    
                        $levCommune = levenshtein(strtoupper($keyVille), strtoupper($cles1));
    
                        if($hasCP){//&& $cpInput == $cp
    
                            $cles1 = preg_replace('/(\d+)/i', '', $cles1);
                            $cles1 = trim($cles1);
                            $levCommune = levenshtein(strtoupper($keyVille), strtoupper($cles1));
                        }
        
                        if($levCommune <= 3){
                            array_push($data0, $key);
                            $i++;
                        }
    
                    }elseif ($hasNumVoie && !$hasCP) {
                        if(strlen($cp) == 5){
                            $street = explode($cp,$keyAdd);
                            $levStreet = levenshtein(strtoupper(trim($street[0])), strtoupper(trim($cles1)));
                            if($levStreet <= 3){
                                array_push($data0, $key);
                                $i++;
                            }
                        }
                    }else{
                        $levAdresse = levenshtein(strtoupper($keyAdd), strtoupper(trim($cles1)));
                        if($levAdresse <= 3){
                            array_push($data0, $key);
                            $i++;
                        }
                    }
                }

            }elseif($type=="golf"){

                if($cle0 !=""){
                    if(str_contains($key["nom"], $cle0)){
                        if((!$hasCP && !$hasNumVoie) ||  ($hasCP && !$hasNumVoie)){
        
                            $levCommune = levenshtein(strtoupper($key["nom_commune"]), strtoupper($cles1));
        
                            if($hasCP){
                                $cles1 = preg_replace('/(\d+)/i', '', $cles1);
                                $cles1 = trim($cles1);
                                $levCommune = levenshtein(strtoupper($key["nom_commune"]), strtoupper($cles1));
                            }
            
                            if($levCommune <= 3){
                                array_push($data0, $key);
                                $i++;
                            }
        
                        }elseif ($hasNumVoie && !$hasCP) {
                            $street = explode(trim($key["cp"]),trim($key["add"]));
                            $levStreet = levenshtein(strtoupper(trim($street[0])), strtoupper(trim($cles1)));
                            if($levStreet <= 3){
                                array_push($data0, $key);
                                $i++;
                            }
                        }else{
                            $levAdresse = levenshtein(strtoupper($key["add"]), strtoupper(trim($cles1)));
                            if($levAdresse <= 3){
                                array_push($data0, $key);
                                $i++;
                            }
                        }
                    }
                }else{

                    if((!$hasCP && !$hasNumVoie) ||  ($hasCP && !$hasNumVoie)){
        
                        $levCommune = levenshtein(strtoupper($key["nom_commune"]), strtoupper($cles1));
    
                        if($hasCP){
                            $cles1 = preg_replace('/(\d+)/i', '', $cles1);
                            $cles1 = trim($cles1);
                            $levCommune = levenshtein(strtoupper($key["nom_commune"]), strtoupper($cles1));
                        }
        
                        if($levCommune <= 3){
                            array_push($data0, $key);
                            $i++;
                        }
    
                    }elseif ($hasNumVoie && !$hasCP) {
                        $street = explode(trim($key["cp"]),trim($key["add"]));
                        $levStreet = levenshtein(strtoupper(trim($street[0])), strtoupper(trim($cles1)));
                        if($levStreet <= 3){
                            array_push($data0, $key);
                            $i++;
                        }
                    }else{
                        $levAdresse = levenshtein(strtoupper($key["add"]), strtoupper(trim($cles1)));
                        if($levAdresse <= 3){
                            array_push($data0, $key);
                            $i++;
                        }
                    }
                }

            }elseif($type=="tabac"){
                if($cle0 !=""){
                    if(str_contains($key["nom"], $cle0)){
                        if((!$hasCP && !$hasNumVoie) ||  ($hasCP && !$hasNumVoie)){
        
                            $levCommune = levenshtein(strtoupper($key["villenorm"]), strtoupper($cles1));
        
                            if($hasCP){
                                $cles1 = preg_replace('/(\d+)/i', '', $cles1);
                                $cles1 = trim($cles1);
                                $levCommune = levenshtein(strtoupper($key["villenorm"]), strtoupper($cles1));
                            }
            
                            if($levCommune <= 3){
                                array_push($data0, $key);
                                $i++;
                            }
        
                        }elseif ($hasNumVoie && !$hasCP) {
                            $street = explode(trim($key["codpost"]),trim($key["add"]));
                            $levStreet = levenshtein(strtoupper(trim($street[0])), strtoupper(trim($cles1)));
                            if($levStreet <= 3){
                                array_push($data0, $key);
                                $i++;
                            }
                        }else{
                            $levAdresse = levenshtein(strtoupper($key["add"]), strtoupper(trim($cles1)));
                            if($levAdresse <= 3){
                                array_push($data0, $key);
                                $i++;
                            }
                        }
                    }
                }else{
                    if((!$hasCP && !$hasNumVoie) ||  ($hasCP && !$hasNumVoie)){
        
                        $levCommune = levenshtein(strtoupper($key["villenorm"]), strtoupper($cles1));
    
                        if($hasCP){
                            $cles1 = preg_replace('/(\d+)/i', '', $cles1);
                            $cles1 = trim($cles1);
                            $levCommune = levenshtein(strtoupper($key["villenorm"]), strtoupper($cles1));
                        }
        
                        if($levCommune <= 3){
                            array_push($data0, $key);
                            $i++;
                        }
    
                    }elseif ($hasNumVoie && !$hasCP) {
                        $street = explode(trim($key["codpost"]),trim($key["add"]));
                        $levStreet = levenshtein(strtoupper(trim($street[0])), strtoupper(trim($cles1)));
                        if($levStreet <= 3){
                            array_push($data0, $key);
                            $i++;
                        }
                    }else{
                        $levAdresse = levenshtein(strtoupper($key["add"]), strtoupper(trim($cles1)));
                        if($levAdresse <= 3){
                            array_push($data0, $key);
                            $i++;
                        }
                    }
                }
            }

        }
        
        $results["nombre"] = $i;

        $results["data"] = $data0;

        return $results;
    }

    /**
     * @author Nantenaina <email>
     * où= dans la fonction getAllRestCoor
     * location=RestaurantController.phpo
     * je veux avoir les id des  resto recupéré apres  appel de la fonction getDataBetweenAnd()
     * pour avoir les notes
     */
    static function getIdFromData($data){
        return $data["id"];
    }

    static function findData($data, $keySearch){
        $results= null;
        foreach($data as $temp){
            if( intval($temp["departement"]) === intval($keySearch)){
                $results=$temp;
            }
        }
        return $results;
    }


    static function mergeByCalculateData($table){

        extract($table); /// $resto, $ferme, $station, $golf, $tabac
        $results= [];
        if( count($resto) < 2 || count($ferme) < 2 || count($station) < 2 || count($golf) < 2 || count($tabac) < 2 || count($marche) < 2 ){
            $key =  count($resto) > 0 ? $resto[0]["departement"] : ( 
                        count($ferme) > 0 ? $ferme[0]["departement"] : ( 
                            count($station) > 0 ? $station[0]["departement"] : ( 
                                count($station) > 0 ? $station[0]["departement"] : (
                                    count($golf) > 0 ? $golf[0]["departement"] : (
                                        $tabac[0]["departement"]
                                    )
                                )
                            )
                        ) 
            );

            $result_resto= 0;
            $result_ferme= 0;
            $result_station= 0;
            $result_golf= 0;
            $result_tabac= 0;
            $result_marche= 0;
            $result_total= 0;

            if( SortResultService::findData($resto, $key) ){
                $data= SortResultService::findData($resto, $key);
                $result_resto += intval($data["account_per_dep"]);
            }

            if( SortResultService::findData($ferme, $key) ){
                $data= SortResultService::findData($ferme, $key);
                $result_ferme += intval($data["account_per_dep"]);
            }

            if( SortResultService::findData($station, $key) ){
                $data= SortResultService::findData($station, $key);
                $result_station += intval($data["account_per_dep"]);
            }

            if( SortResultService::findData($golf, $key) ){
                $data= SortResultService::findData($golf, $key);
                $result_golf += intval($data["account_per_dep"]);
            }

            if( SortResultService::findData($tabac, $key) ){
                $data= SortResultService::findData($tabac, $key);
                $result_tabac += intval($data["account_per_dep"]);
            }

             if( SortResultService::findData($marche, $key) ){
                $data= SortResultService::findData($marche, $key);
                $result_marche += intval($data["account_per_dep"]);
            }

            $result_total= $result_resto + 
                           $result_ferme + 
                           $result_station + 
                           $result_golf + 
                           $result_tabac +
                           $result_marche;
                           

            $result= [
                "departement" => strlen($key) === 1 ?  "0" . intval($key) : strval($key),
                "account_per_dep" => $result_total,
                "details" => [
                    "resto" => $result_resto,
                    "ferme" => $result_ferme,
                    "station" => $result_station,
                    "golf" => $result_golf,
                    "tabac" => $result_tabac,
                    "marche" => $result_marche
                ]
            ];

            array_push($results, $result);
        }else{
            for($i= 1; $i < 95 ; $i++){
                
                $result_resto= 0;
                $result_ferme= 0;
                $result_station= 0;
                $result_golf= 0;
                $result_tabac= 0;
                $result_total= 0;
                $result_marche= 0;

                if( SortResultService::findData($resto, $i) ){
                    $data= SortResultService::findData($resto, $i);
                    $result_resto += intval($data["account_per_dep"]);
                }

                if( SortResultService::findData($ferme, $i) ){
                    $data= SortResultService::findData($ferme, $i);
                    $result_ferme += intval($data["account_per_dep"]);
                }

                if( SortResultService::findData($station, $i) ){
                    $data= SortResultService::findData($station, $i);
                    $result_station += intval($data["account_per_dep"]);
                }

                if( SortResultService::findData($golf, $i) ){
                    $data= SortResultService::findData($golf, $i);
                    $result_golf += intval($data["account_per_dep"]);
                }

                if( SortResultService::findData($tabac, $i) ){
                    $data= SortResultService::findData($tabac, $i);
                    $result_tabac += intval($data["account_per_dep"]);
                }

                if( SortResultService::findData($marche, $i) ){
                    $data= SortResultService::findData($marche, $i);
                    $result_marche += intval($data["account_per_dep"]);
                }

                $result_total= $result_resto + 
                               $result_ferme + 
                               $result_station + 
                               $result_golf + 
                               $result_tabac +
                               $result_marche;

                $result= [
                    "departement" => strlen($i) === 1 ?  "0" . intval($i) : strval($i),
                    "account_per_dep" => $result_total,
                    "details" => [
                        "resto" => $result_resto,
                        "ferme" => $result_ferme,
                        "station" => $result_station,
                        "golf" => $result_golf,
                        "tabac" => $result_tabac,
                        "marche" => $result_marche
                    ]
                ];

                array_push($results, $result);
            }
        }
        
        return $results;
    }
}