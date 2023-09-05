<?php

namespace App\Entity;

use App\Repository\GolfFinishedRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * Golffinished
 *
 * @ORM\Table(name="golffinished")
 * 
 * @ORM\Entity(repositoryClass= "App\Repository\GolfFinishedRepository")
 */
class GolfFinished
{
    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     */
    private $id;

    /**
     * @var int
     *
     * @ORM\Column(name="golf_id", type="integer", nullable=false)
     */
    private $golf_id;

    /**
     * @var int
     *
     * @ORM\Column(name="user_id", type="integer", nullable=false)
     */
    private $user_id;

    /**
     * @var int
     *
     * @ORM\Column(name="a_faire", type="integer", nullable=true)
     */
    private $a_faire;

    /**
     * @var int
     *
     * @ORM\Column(name="fait", type="integer", nullable=true)
     */
    private $fait;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getGolfId(): ?int
    {
        return $this->golf_id;
    }

    public function setGolfId(int $golf_id): static
    {
        $this->golf_id = $golf_id;

        return $this;
    }

    public function getUserId(): ?int
    {
        return $this->user_id;
    }

    public function setUserId(int $user_id): static
    {
        $this->user_id = $user_id;

        return $this;
    }

    /**
     * Get the value of a_faire
     *
     * @return  int
     */ 
    public function getAfaire()
    {
        return $this->a_faire;
    }

    /**
     * Set the value of a_faire
     *
     * @param  int  $a_faire
     *
     * @return  self
     */ 
    public function setAfaire(int $a_faire)
    {
        $this->a_faire = $a_faire;

        return $this;
    }

    /**
     * Get the value of fait
     *
     * @return  int
     */ 
    public function getFait()
    {
        return $this->fait;
    }

    /**
     * Set the value of fait
     *
     * @param  int  $fait
     *
     * @return  self
     */ 
    public function setFait(int $fait)
    {
        $this->fait = $fait;

        return $this;
    }
}
