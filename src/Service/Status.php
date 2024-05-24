<?php

namespace App\Service;

use App\Entity\Consumer;
use App\Entity\Supplier;
use App\Service\TributGService;
use Doctrine\ORM\EntityManagerInterface;
use App\Service\ConfidentialityService;

class Status {
    private $entityManager;
    private $tributGService;
private $confidentialityService;

    public function __construct(EntityManagerInterface $entityManager, TributGService $tributGService, ConfidentialityService $confidentialityService)
    {
        $this->entityManager = $entityManager;
        $this->tributGService = $tributGService;
$this->confidentialityService = $confidentialityService;
    }

    public function statusFondateur($user){
        if (!$user || $user->getType() === "Type") {
            return [ "profil" => "", "statusTribut" => "", "userType" => "Type" ];
        }
        
        $userType = $user->getType();
        $userId = $user->getId();
        $profil = "";

        if ($userType == "consumer") {
            $profil = $this->entityManager->getRepository(Consumer::class)->findByUserId($userId);
        } else {
            $profil = $this->entityManager->getRepository(Supplier::class)->findByUserId($userId);
        }
       
        return [
            "profil" => $profil,
            "statusTribut" => $this->tributGService->getStatusAndIfValid($profil[0]->getTributg(), $profil[0]->getIsVerifiedTributGAdmin(), $userId),
            "userType" => $user->getType()
        ];
    }

    public function convertUtf8ToUnicode($str){
        return json_encode($str);
    }


    public function userProfilService(
        $user
    ){

        if (!$user || $user->getType() === "Type" ) {
            return ["profil" => "", "statusTribut" => "", "userType" => "Type" ];
        }

        $userType = $user->getType();
        $userId = $user->getId();

        $profil = "";
        $tribuAvatar="";
        if ($userType == "consumer") {
            $profil = $this->entityManager->getRepository(Consumer::class)->findOneBy(['userId' => intval($userId)]);
        } else {
            $profil = $this->entityManager->getRepository(Supplier::class)->findOneBy(['userId' => intval($userId)]);
        }

        $currentTribug=$profil ? $profil->getTributG() : "";

        if($currentTribug!=""){
            $tribuAvatar=$this->tributGService->getAvatar($currentTribug)[0]["avatar"];
            $profilTribuG= $this->tributGService->getProfilTributG( $currentTribug , intval($userId ) );
        }

        $pseudo = $profil ?  $this->confidentialityService->getConfFullname($userId, $userId):"";
        return [
            "id" => $user->getId(),
            "email" => $user->getEmail(),
            "pseudo" => $user->getPseudo(),
            "firstname" =>$profil ?  $profil->getFirstname() : "",
            "lastname" => $profil ? $profil->getLastname() : "",
            "fullname" => $pseudo,
            "photo_profil" => $profil ? $profil->getPhotoProfil() : "",
            "userType" => $userType,
            "tableTribuG" => $profil ? $profil->getTributG() : "",
            "status_tribuG" => $profil ? strtoupper($this->tributGService->getStatus($profil->getTributG(),$user->getId())) : "",
            "tableNotification" => $user->getTablenotification(),
            "tableMessage" => $user->getTablemessage(),
            "isSuperAdmin" => in_array("ROLE_GODMODE",$user->getRoles()),
            "isValidator" => in_array("ROLE_VALIDATOR",$user->getRoles()),
            "commune"=>  $profil ? $profil->getCommune():"",
            "quartier"=>$profil ? $profil->getQuartier() :"",
            "code_postal" =>$profil ?  $profil->getCodePostal() :"",
            "tribugAvatar"=> $tribuAvatar !=null ? "/uploads/tribus/photos/".$tribuAvatar :"/uploads/tribus/avatar_tribu.jpg",
            "tribuG_name_muable" => $profilTribuG['name'],
        ];
    }

    public function convertUnicodeToUTF8($str){
        return mb_convert_encoding($str, "UTF-8", mb_detect_encoding($str));
    }
} 