<?php

namespace App\Service;

use App\Entity\Consumer;
use App\Entity\Supplier;
use App\Service\TributGService;
use Doctrine\ORM\EntityManagerInterface;

class Status {
    private $entityManager;
    private $tributGService;

    public function __construct(EntityManagerInterface $entityManager, TributGService $tributGService)
    {
        $this->entityManager = $entityManager;
        $this->tributGService = $tributGService;
    }

    public function statusFondateur($user){
        if (!$user) {
            return [ "profil" => "", "statusTribut" => "" ];
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
            "statusTribut" => $this->tributGService->getStatusAndIfValid($profil[0]->getTributg(), $profil[0]->getIsVerifiedTributGAdmin(), $userId)
        ];
    }

    public function convertUtf8ToUnicode($str){
        return json_encode($str);
    }


    public function userProfilService(
        $user
    ){

        if (!$user) {
            return ["profil" => "", "statusTribut" => ""];
        }
        $userType = $user->getType();
        $userId = $user->getId();
        $profil = "";
        if ($userType == "consumer") {
            $profil = $this->entityManager->getRepository(Consumer::class)->findOneBy(['userId' => intval($userId)]);
        } else {
            $profil = $this->entityManager->getRepository(Supplier::class)->findOneBy(['userId' => intval($userId)]);
        }
        return [
            "id" => $user->getId(),
            "email" => $user->getEmail(),
            "pseudo" => $user->getPseudo(),
            "firstname" => $profil->getFirstname(),
            "lastname" => $profil->getLastname(),
            "photo_profil" => $profil->getPhotoProfil(),
            "userType" => $userType,
            "tableTribuG" => $profil->getTributG(),
            "status_tribuG" => strtoupper($this->tributGService->getStatus($profil->getTributG(),$user->getId())),
            "tableNotification" => $user->getTablenotification(),
            "tableMessage" => $user->getTablemessage(),
            "isSuperAdmin" => in_array("ROLE_GODMODE",$user->getRoles()),
        ];
    }
}