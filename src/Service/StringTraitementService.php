<?php

namespace App\Service;

class StringTraitementService{

    /**
     * @author Jean Gilbert RANDRIANANTENAINASOA <nantenainasoa39@gmail.com>
     * 
     * @param string $str: initial string with white spaces
     * 
     * @return string $str: final string without white space
     */
    public function removeWhiteSpace($str){
        $str = trim($str);
        $str = preg_replace('/\s+/', ' ', $str);
        return $str;
    }

    /**
     * @author Jean Gilbert RANDRIANANTENAINASOA <nantenainasoa39@gmail.com>
     * 
     * @param string $str: initial string with all caracteres
     * 
     * @return string $str: final string contains only AlphaNumerique caracteres
     */
    public function removeNotAlphaNumerique($str){
        $str = preg_replace('/[^a-z0-9]/i', '', $str);
        return $str;
    }

    /**
     * @author Jean Gilbert RANDRIANANTENAINASOA <nantenainasoa39@gmail.com>
     * 
     * @param string $str: initial string with white spaces
     * 
     * @return string $str: final uppercase string without white space
     */
    public function normalizedString($str){
        $str = iconv('UTF-8','ASCII//TRANSLIT',$str);
        $str = preg_replace('/[^a-z0-9_ ]/i', '', $str);
        $str = strtoupper($str);
        return $str;
    }
}
