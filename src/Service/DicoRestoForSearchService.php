<?php

namespace App\Service;

class DicoRestoForSearchService extends StringTraitementService{

    /**
     * @author Jean Gilbert RANDRIANANTENAINASOA <nantenainasoa39@gmail.com>
     * 
     * @param string $mot_cles0: category of restaurant
     * 
     * @return boolean : true if mot clé in dico else false
     */
    public function isCafe($mot_cles0){

        $mot_cles0 = $this->removeNotAlphaNumerique($mot_cles0);

        $mot_cles0 = strtolower($mot_cles0);

        $cafe = array("cafe", "cafes", "cafee", "cafees", "saloncafe", "salonducafe", "salondecafe", "caffe", "caffes", "coffee", "coffees", "coffe");

        if (in_array($mot_cles0, $cafe))
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    /**
     * @author Jean Gilbert RANDRIANANTENAINASOA <nantenainasoa39@gmail.com>
     * 
     * @param string $mot_cles0: category of restaurant
     * 
     * @return boolean : true if mot clé in dico else false
     */
    public function isThe($mot_cles0){

        $mot_cles0 = $this->removeNotAlphaNumerique($mot_cles0);

        $mot_cles0 = strtolower($mot_cles0);

        $the = array("the", "thes", "salonthe", "salonthes",  "salonduthe",  "salondethe", "salondethes", "salondesthes");

        if (in_array($mot_cles0, $the))
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    /**
     * @author Jean Gilbert RANDRIANANTENAINASOA <nantenainasoa39@gmail.com>
     * 
     * @param string $mot_cles0: category of restaurant
     * 
     * @return boolean : true if mot clé in dico else false
     */
    public function isCuisine($mot_cles0){

        $mot_cles0 = $this->removeNotAlphaNumerique($mot_cles0);

        $mot_cles0 = strtolower($mot_cles0);

        $cuisine = array("cuisine", "cuisines", "cuisinemonde", "cuisineaumonde", "cuisineauxmondes", "cuisinemondes",  "cuisinedumonde",  "cuisinedemonde", "cuisinedemondes", "cuisinedesmondes");

        if (in_array($mot_cles0, $cuisine))
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    /**
     * @author Jean Gilbert RANDRIANANTENAINASOA <nantenainasoa39@gmail.com>
     * 
     * @param string $mot_cles0: category of restaurant
     * 
     * @return boolean : true if mot clé in dico else false
     */
    public function isBrasserie($mot_cles0){

        $mot_cles0 = $this->removeNotAlphaNumerique($mot_cles0);

        $mot_cles0 = strtolower($mot_cles0);

        $brasserie = array("brasserie", "brasseries", "bistro", "bistrot",  "bistros",  "bistrots");

        if (in_array($mot_cles0, $brasserie))
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    /**
     * @author Jean Gilbert RANDRIANANTENAINASOA <nantenainasoa39@gmail.com>
     * 
     * @param string $mot_cles0: category of restaurant
     * 
     * @return boolean : true if mot clé in dico else false
     */
    public function isBar($mot_cles0){

        $mot_cles0 = $this->removeNotAlphaNumerique($mot_cles0);

        $mot_cles0 = strtolower($mot_cles0);

        $bar = array("bar", "bars");

        if (in_array($mot_cles0, $bar))
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    /**
     * @author Jean Gilbert RANDRIANANTENAINASOA <nantenainasoa39@gmail.com>
     * 
     * @param string $mot_cles0: category of restaurant
     * 
     * @return boolean : true if mot clé in dico else false
     */
    public function isCreperie($mot_cles0){

        $mot_cles0 = $this->removeNotAlphaNumerique($mot_cles0);

        $mot_cles0 = strtolower($mot_cles0);

        $creperie = array("creperie", "creperies", "crepe", "crepes");

        if (in_array($mot_cles0, $creperie))
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    /**
     * @author Jean Gilbert RANDRIANANTENAINASOA <nantenainasoa39@gmail.com>
     * 
     * @param string $mot_cles0: category of restaurant
     * 
     * @return boolean : true if mot clé in dico else false
     */
    public function isFastFood($mot_cles0){

        $mot_cles0 = $this->removeNotAlphaNumerique($mot_cles0);

        $mot_cles0 = strtolower($mot_cles0);

        $fastfood = array("fastfood", "fastfod", "fastfoods", "fastfod");

        if (in_array($mot_cles0, $fastfood))
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    /**
     * @author Jean Gilbert RANDRIANANTENAINASOA <nantenainasoa39@gmail.com>
     * 
     * @param string $mot_cles0: category of restaurant
     * 
     * @return boolean : true if mot clé in dico else false
     */
    public function isPizzeria($mot_cles0){

        $mot_cles0 = $this->removeNotAlphaNumerique($mot_cles0);

        $mot_cles0 = strtolower($mot_cles0);

        $pizzeria = array("pizzeria", "pizzerias", "pizza", "pizzas");

        if (in_array($mot_cles0, $pizzeria))
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    /**
     * @author Jean Gilbert RANDRIANANTENAINASOA <nantenainasoa39@gmail.com>
     * 
     * @param string $mot_cles0: category of restaurant
     * 
     * @return boolean : true if mot clé in dico else false
     */
    public function isBoulangerie($mot_cles0){

        $mot_cles0 = $this->removeNotAlphaNumerique($mot_cles0);

        $mot_cles0 = strtolower($mot_cles0);

        $boulangerie = array("boulangerie", "boulangeries", "boulangier", "boulangiers");

        if (in_array($mot_cles0, $boulangerie))
        {
            return true;
        }
        else
        {
            return false;
        }
    }
    

}
