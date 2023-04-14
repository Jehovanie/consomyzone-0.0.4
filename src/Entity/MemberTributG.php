<?php

namespace App\Entity;

use App\Repository\MemberTributGRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=MemberTributGRepository::class)
 */
class MemberTributG
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="integer")
     */
    private $user_id;

    /**
     * @ORM\Column(type="integer")
     */
    private $tribut_id;

    public function getId(): ?int
    {
        return $this->id;
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

    public function getTributId(): ?int
    {
        return $this->tribut_id;
    }

    public function setTributId(int $tribut_id): self
    {
        $this->tribut_id = $tribut_id;

        return $this;
    }
}
