<?php

namespace App\Entity;

use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

/**
 *
 *
 * @ORM\Table(name="validationstory")
 * @ORM\Entity(repositoryClass="App\Repository\ValidationStoryRepository")
 * 
 */
class ValidationStory
{
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
     * @var string|null
     *
     * @ORM\Column(name="restoId", type="integer", nullable=false)
     */
    private $restoId;

    /**
     * @var string|null
     *
     * @ORM\Column(name="userModifiedId", type="integer", nullable=false)
     */
    private $userModifiedId;

    /**
     * @var string|null
     *
     * @ORM\Column(name="userValidatorId", type="integer", nullable=false)
     */
    private $userValidatorId;

    /**
     * @var string|null
     *
     * @ORM\Column(name="status", type="integer", nullable=false)
     */
    private $status;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="dateValidation", type="datetime", nullable=false, options={"default"="CURRENT_TIMESTAMP"})
     */
    private $dateValidation = 'CURRENT_TIMESTAMP';

    /**
     * Get the value of id
     *
     * @return  int
     */ 
    public function getId()
    {
        return $this->id;
    }

    /**
     * Get the value of restoId
     *
     * @return  string|null
     */ 
    public function getRestoId()
    {
        return $this->restoId;
    }

    /**
     * Set the value of restoId
     *
     * @param  string|null  $restoId
     *
     * @return  self
     */ 
    public function setRestoId($restoId)
    {
        $this->restoId = $restoId;

        return $this;
    }

    /**
     * Get the value of userModifiedId
     *
     * @return  string|null
     */ 
    public function getUserModifiedId()
    {
        return $this->userModifiedId;
    }

    /**
     * Set the value of userModifiedId
     *
     * @param  string|null  $userModifiedId
     *
     * @return  self
     */ 
    public function setUserModifiedId($userModifiedId)
    {
        $this->userModifiedId = $userModifiedId;

        return $this;
    }

    /**
     * Get the value of userValidatorId
     *
     * @return  string|null
     */ 
    public function getUserValidatorId()
    {
        return $this->userValidatorId;
    }

    /**
     * Set the value of userValidatorId
     *
     * @param  string|null  $userValidatorId
     *
     * @return  self
     */ 
    public function setUserValidatorId($userValidatorId)
    {
        $this->userValidatorId = $userValidatorId;

        return $this;
    }

    /**
     * Get the value of status
     *
     * @return  string|null
     */ 
    public function getStatus()
    {
        return $this->status;
    }

    /**
     * Set the value of status
     *
     * @param  string|null  $status
     *
     * @return  self
     */ 
    public function setStatus($status)
    {
        $this->status = $status;

        return $this;
    }

    /**
     * Get the value of datetime
     *
     * @return  \DateTime
     */
    public function getDateValidation()
    {
        return $this->dateValidation;
    }

    /**
     * Set the value of datetime
     *
     * @param  \DateTime  $datetime
     *
     * @return  self
     */
    public function setDateValidation(\DateTimeInterface $datetime)
    {
        $this->dateValidation = $datetime;

        return $this;
    }
}
