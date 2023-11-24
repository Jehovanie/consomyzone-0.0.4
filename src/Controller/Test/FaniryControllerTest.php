<?php
namespace App\Controller\Test;

use App\Service\TributGService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

class FaniryControllerTest extends AbstractController{


    #[Route("/user/send/message/crypted", name:"user_send_message_crypted")]
    public function sendMessageCripted(
      
        TributGService $tributGService
    ){
        $message = "Theré are many variations of passages of Lorem~é available,". 
        "but the majority have suffered alteration in some form, by injected humour, or randomised .";
        $message=mb_convert_encoding($message, 'UTF-8', 'UTF-8');

        $receiver="tribug_01_apremont_apremont";
       
        $encryptionMethod = "AES-256-CBC";
        $decryptionMethod = "AES-256-CBC";
        $secretKey = "ThisIsASecretKey123";
        $iv = openssl_random_pseudo_bytes(openssl_cipher_iv_length($encryptionMethod));
        //dd($iv);
        $encryptedData = openssl_encrypt($message, $encryptionMethod, $secretKey, 0, $iv);

        //$encryptedData=json_encode($encryptedData);

        $result= $tributGService->sdmsgT($encryptedData,  
        [], 
        [], 
        1, 0, 1, 0,$receiver,$iv);

        $encryptedData2=$tributGService->tmp($receiver,11)[0]["msg"];
        $decryptedData2 = openssl_decrypt($encryptedData2, $decryptionMethod, $secretKey, 0, $iv);
        $decryptedData2=mb_convert_encoding($decryptedData2, 'UTF-8', 'UTF-8');
       // dd( $decryptedData2);

        return $this->json(array("r"=>$decryptedData2));
    }

    #[Route("/user/get/message/crypted", name:"user_get_message_crypted")]
    public function getMessageCripted(
        TributGService $tributGService
    ){
        $receiver="tribug_01_apremont_apremont";
        $encryptedData=$tributGService->tmp($receiver,13)[0]["msg"];
        $encryptionMethod = "AES-256-CBC";
        $decryptionMethod = "AES-256-CBC";
        $secretKey = "ThisIsASecretKey123";
        $iv=$tributGService->getIv($receiver,12)[0]["IV"];
        $decryptedData = openssl_decrypt($encryptedData, $decryptionMethod, $secretKey, 0, $iv);
        $decryptedData=mb_convert_encoding($decryptedData, 'UTF-8', 'UTF-8');
        dd( $decryptedData);

        return $this->json(array("r"=>$decryptedData));
    }

    
}