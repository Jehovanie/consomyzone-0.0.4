<?php

namespace App\Entity;

use App\Repository\CommentGRepository;
use Doctrine\ORM\Mapping as ORM;
use App\Entity\User;
use App\Entity\PublicationG;

/**
 * CommentG
 * 
 * @ORM\Table(name="comment_g", indexes={@ORM\Index(name="IDX_705B3727A76ED395", columns={"user_id"})})
 * @ORM\Table(name="comment_g", indexes={@ORM\Index(name="IDX_705B3727A76ED395", columns={"publication_id"})})
 * @ORM\Entity(repositoryClass=CommentGRepository::class)
 */
class CommentG
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="datetime")
     */
    private $datetime;

    /**
     * @ORM\Column(name="comment", type="text")
     */
    private $comment;

    
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

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getDatetime(): ?\DateTimeInterface
    {
        return $this->datetime;
    }

    public function setDatetime(\DateTimeInterface $datetime): self
    {
        $this->datetime = $datetime;

        return $this;
    }

    public function getComment(): ?string
    {
        return $this->comment;
    }

    public function setComment(string $comment): self
    {
        $this->comment = $comment;

        return $this;
    }

    public function getUserId(): ?User
    {
        return $this->user_id;
    }

    public function setUserId(?User $user): self
    {
        $this->user_id = $user;

        return $this;
    }

    public function getPublicationId(): ?PublicationG
    {
        return $this->publication_id;
    }

    public function setPublicationId(?PublicationG $publication): self
    {
        $this->publication_id = $publication;

        return $this;
    }
}
