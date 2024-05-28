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
        $str = preg_replace('/[^a-z0-9\s]/i', '', $str);
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
        // $str=preg_replace('/[^a-zàâçéèêëîïôûùüÿñæœ0-9 ]/i',' ',$str);
        $str=preg_replace('/[^a-zàâçéèêëîïôûùüÿ#$-@&|+*\/.,;?!\'":`()[]{}=~_«»<>ñæœ0-9 ]/i',' ',$str);
        $tmp=\Normalizer::normalize($str,\Normalizer::NFD);
        $str = iconv('UTF-8','ASCII//TRANSLIT//IGNORE',$tmp);
        $str = preg_replace('/[^a-z0-9 ]/i', '', $str);
        $str = strtoupper($str);
        return $str;
    }
}
