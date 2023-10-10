<?php

namespace App\Entity;

use App\Repository\ConfidentialityRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=ConfidentialityRepository::class)
 */
class Confidentiality
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="boolean", nullable=true)
     */
    private $notifIsActive;

    /**
     * @ORM\Column(type="integer")
     */
    private $profil;

    /**
     * @ORM\Column(type="integer", nullable=true)
     */
    private $email;

    /**
     * @ORM\Column(type="integer")
     */
    private $amie;

    /**
     * @ORM\Column(type="integer")
     */
    private $invitation;

    /**
     * @ORM\Column(type="integer")
     */
    private $publication;

    /**
     * @ORM\Column(type="integer")
     */
    private $user_id;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function isNotifIsActive(): ?bool
    {
        return $this->notifIsActive;
    }

    public function setNotifIsActive(?bool $notifIsActive): self
    {
        $this->notifIsActive = $notifIsActive;

        return $this;
    }

    public function getProfil(): ?int
    {
        return $this->profil;
    }

    public function setProfil(int $profil): self
    {
        $this->profil = $profil;

        return $this;
    }

    public function getEmail(): ?int
    {
        return $this->email;
    }

    public function setEmail(?int $email): self
    {
        $this->email = $email;

        return $this;
    }

    public function getAmie(): ?int
    {
        return $this->amie;
    }

    public function setAmie(int $amie): self
    {
        $this->amie = $amie;

        return $this;
    }

    public function getInvitation(): ?int
    {
        return $this->invitation;
    }

    public function setInvitation(int $invitation): self
    {
        $this->invitation = $invitation;

        return $this;
    }

    public function getPublication(): ?int
    {
        return $this->publication;
    }

    public function setPublication(int $publication): self
    {
        $this->publication = $publication;

        return $this;
    }

    public function getUserId(): ?int
    {
        return $this->user_id;
    }

    public function setUserId(int $user_id): self
    {
        $this->user_id = $user_id;

        return $this;
    }
}
