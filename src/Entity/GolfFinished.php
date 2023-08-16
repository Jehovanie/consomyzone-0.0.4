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
     * @ORM\GeneratedValue(strategy="SEQUENCE")
     * @ORM\SequenceGenerator(sequenceName="ogresto.golffinished", allocationSize=1, initialValue=1)
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
}
