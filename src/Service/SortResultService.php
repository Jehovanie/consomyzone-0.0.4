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
    
                /*if(array_key_exists("commune", $key)) {
                    
                    $commune = $this->removeWhiteSpace($key["commune"]);
                    $commune = $this->normalizedString($commune);
                    $levCommune = levenshtein($cle1, $commune);
    
                    if(str_contains($key["commune"], $cle1) || floatval($levCommune) <= 3){
                        $levAdresse = $levCommune;
                    }
                }
    
                if(array_key_exists("rue", $key)) {
                    $rue = $this->removeWhiteSpace($key["rue"]);
                    $rue = $this->normalizedString($rue);
                    $levRue = levenshtein($cle1, $rue);
                    if(floatval($levAdresse) > floatval($levRue)){
                        $levAdresse = $levRue;
                    }
                }*/

            }else{

                /** Classifier % au nom */
                if(str_contains($nom, $cle0) && $nom == $cle0){
                    $levNom = 0;
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
                }elseif(str_contains($add, $cle1)  && $add != $cle1){
                    $levAdresse = 1;
                }elseif ($this->permute($decision_addresse, $cle1, 0, $n - 1, $add) == 1) {
                    $levAdresse = 0;
                }elseif ($this->permute($decision_addresse, $cle1, 0, $n - 1, $add) == 2) {
                    $levAdresse = 1;
                }else{
                    $levAdresse = levenshtein($cle1, $add);
                }
                
                /** Déduction lev total */
                /*if(floatval($levNom) <= 0.5 && floatval($levAdresse) >= 1){
                    $levTotal = floatval($levNom);
                }elseif(floatval($levNom) >= 0.5 && floatval($levAdresse) == 0){
                    $levTotal = floatval($levAdresse);
                }elseif(floatval($levNom) >= 0.5 && floatval($levAdresse) == 0){
                    $levTotal = floatval($levAdresse);
                }elseif(floatval($levNom) > 1 && floatval($levAdresse) <= 1){
                    $levTotal = floatval($levAdresse);
                }else{
                    $levTotal = floatval($levNom) + floatval($levAdresse);
                }*/

                
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

    /*function permute(&$boolean,$str, $l, $r, $str2) 
    {

        if($l == $r){
            if(str_contains($str2, $str)){       
                $boolean= true;
            }

        }
        else{
            for ($i = $l; $i <= $r; $i++) { 
                $str = $this->swap($str, $l, $i); 
                $this->permute($boolean,$str, $l + 1, $r, $str2);
                if ($boolean == true) {
                    break;
                }
                
            } 
        }
        return  $boolean;
    } */

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
}