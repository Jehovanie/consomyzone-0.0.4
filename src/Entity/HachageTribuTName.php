<?php
namespace App\Entity;
use Doctrine\ORM\Mapping as ORM;
/**
 * @ORM\Entity(repositoryClass="App\Repository\HachageTribuTNameRepository")
 * @ORM\Table(name="hachage")
 */
class HachageTribuTName {
    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     *
     */
    private $id;

    /**
     * @ORM\Column(name="hashing", type="string", length=255, nullable=true )
     */
    private $key;


    /**
     * @ORM\Column(name="tribu_T_id", type="integer",nullable=false)
     */
    private $tribuTId;

    /**
     * @ORM\Column(name="userId",  type="integer", nullable=false)
     */
    private $userId;

    public function setKey($key){
        $this->key=$key;
        return $this;
    }

    public function getKey(){
        return $this->key;
    }

    public function setTribuTId($tribuTId){
        $this->tribuTId=$tribuTId;
        return $this;
    }

    public function getTribuTId(){
        return $this->tribuTId;
    }

    public function setUserId($userId){
        $this->userId=$userId;
        return $this;
    }

    public function getUserId(){
        return $this->userId;
    }
}