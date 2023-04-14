<?php

namespace App\Entity;

use App\Entity\User;
use App\Entity\PublicationG;
use Doctrine\ORM\Mapping as ORM;
use App\Repository\ReactionGRepository;

/**
 * @ORM\Entity(repositoryClass=ReactionGRepository::class)
 */
class ReactionG
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

     /**
     *
     * @ORM\ManyToOne(targetEntity=User::class)
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="user_id", referencedColumnName="id")
     * })
     */
    private $user_id;

     /**
     *
     * @ORM\ManyToOne(targetEntity=PublicationG::class)
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="publication_id", referencedColumnName="id")
     * })
     */
    private $publication_id;

    /**
     * @ORM\Column(type="boolean")
     */
    private $is_like;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUser(): ?User
    {
        return $this->user_id;
    }

    public function setUser(?User $user_id): self
    {
        $this->user_id = $user_id;

        return $this;
    }

    public function getPublication(): ?PublicationG
    {
        return $this->publication_id;
    }

    public function setPublication(?PublicationG $publication_id): self
    {
        $this->publication_id = $publication_id;

        return $this;
    }

    public function isIsLike(): ?bool
    {
        return $this->is_like;
    }

    public function setIsLike(bool $is_like): self
    {
        $this->is_like = $is_like;

        return $this;
    }

    public function getUserId(): ?User
    {
        return $this->user_id;
    }

    public function setUserId(?User $user_id): self
    {
        $this->user_id = $user_id;

        return $this;
    }

    public function getPublicationId(): ?PublicationG
    {
        return $this->publication_id;
    }

    public function setPublicationId(?PublicationG $publication_id): self
    {
        $this->publication_id = $publication_id;

        return $this;
    }
}
