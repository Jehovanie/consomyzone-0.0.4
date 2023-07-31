<?php

namespace App\Service;

class DicoStationForSearchService extends StringTraitementService{

    /**
     * @author Jean Gilbert RANDRIANANTENAINASOA <nantenainasoa39@gmail.com>
     * 
     * @param string $mot_cles0: category of carburant
     * 
     * @return boolean : true if mot clé in dico else false
     */
    public function isE85($mot_cles0){

        $mot_cles0 = $this->removeNotAlphaNumerique($mot_cles0);

        $mot_cles0 = strtolower($mot_cles0);

        $e85 = array("e85", "superethanole85", "superethanolee85", "superethanol85", "superethanole85", "superethanol", "superethanole");

        if (in_array($mot_cles0, $e85))
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
     * @param string $mot_cles0: category of carburant
     * 
     * @return boolean : true if mot clé in dico else false
     */
    public function isGPLC($mot_cles0){

        $mot_cles0 = $this->removeNotAlphaNumerique($mot_cles0);

        $mot_cles0 = strtolower($mot_cles0);

        $gplc = array("gplc", "gplcarburant", "gplcarburants", "gazdepetroleliquefiecarburant", "gazdespetrolesliquefiescarburants", "gazdepetrolliquefiecarburant", "gazpetroleliquefiecarburant", "gazpetrolesliquefiescarburants");

        if (in_array($mot_cles0, $gplc))
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
     * @param string $mot_cles0: category of carburant
     * 
     * @return boolean : true if mot clé in dico else false
     */
    public function isSP95($mot_cles0){

        $mot_cles0 = $this->removeNotAlphaNumerique($mot_cles0);

        $mot_cles0 = strtolower($mot_cles0);

        $sp95 = array("sp95", "sansplomb95", "sansplombs95");

        if (in_array($mot_cles0, $sp95))
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
     * @param string $mot_cles0: category of carburant
     * 
     * @return boolean : true if mot clé in dico else false
     */
    public function isSP95_E10($mot_cles0){

        $mot_cles0 = $this->removeNotAlphaNumerique($mot_cles0);

        $mot_cles0 = strtolower($mot_cles0);

        $sp95_e10 = array("sp95e10", "sansplomb95e10", "sansplombs95e10", "e10", "essencee10", "essencese10");

        if (in_array($mot_cles0, $sp95_e10))
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
     * @param string $mot_cles0: category of carburant
     * 
     * @return boolean : true if mot clé in dico else false
     */
    public function isSP98($mot_cles0){

        $mot_cles0 = $this->removeNotAlphaNumerique($mot_cles0);

        $mot_cles0 = strtolower($mot_cles0);

        $sp98 = array("sp98", "sansplomb98", "sansplombs98");

        if (in_array($mot_cles0, $sp98))
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
     * @param string $mot_cles0: category of carburant
     * 
     * @return boolean : true if mot clé in dico else false
     */
    public function isGasoil($mot_cles0){

        $mot_cles0 = $this->removeNotAlphaNumerique($mot_cles0);

        $mot_cles0 = strtolower($mot_cles0);

        $gasoil = array("gasoil", "gasoils", "gazoil", "gazosils");

        if (in_array($mot_cles0, $gasoil))
        {
            return true;
        }
        else
        {
            return false;
        }
    }
    

}
