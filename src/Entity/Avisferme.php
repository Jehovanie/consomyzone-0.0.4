<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Avisferme
 *
 * @ORM\Table(name="avisferme", indexes={@ORM\Index(name="IDX_F4C2D6D8A76ED395", columns={"user_id"}), @ORM\Index(name="IDX_F4C2D6D818981132", columns={"ferme_id"})})
 * @ORM\Entity(repositoryClass="App\Repository\AvisfermeRepository")
 */
class Avisferme
{
   /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(name="comment", type="text", nullable=false)
     */
    private $comment;

    /**
     * @var int
     *
     * @ORM\Column(name="note", type="integer", nullable=false)
     */
    private $note;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="datetime", type="datetime", nullable=false, options={"default"="CURRENT_TIMESTAMP"})
     */
    private $datetime = 'CURRENT_TIMESTAMP';

    /**
     *
     * @ORM\ManyToOne(targetEntity="User")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="user_id", referencedColumnName="id")
     * })
     */
    private $user;

    /**
     * @var \FermeGeom
     *
     * @ORM\ManyToOne(targetEntity="FermeGeom")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="ferme_id", referencedColumnName="id")
     * })
     */
    private $ferme;


    public function getId(): ?int
    {
        return $this->id;
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

    public function getNote(): ?int
    {
        return $this->note;
    }

    public function setNote(int $note): self
    {
        $this->note = $note;

        return $this;
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

    public function getUser()
    {
        return $this->user;
    }

    public function setUser(?User $user): self
    {
        $this->user = $user;

        return $this;
    }

    public function getFerme()
    {
        return $this->ferme;
    }

    public function setFerme(?FermeGeom $ferme): self
    {
        $this->ferme = $ferme;

        return $this;
    }


}
