<?php

namespace App\Entity;

use App\Repository\CommuneGeoCoderRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Table(name="commune_geocoder")
 * @ORM\Entity(repositoryClass=CommuneGeoCoderRepository::class)
 */
class CommuneGeoCoder
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(name="depCom", type="string", length=255)
     */
    private $dep_com;

    /**
     * @ORM\Column(name="nom_com", type="string", length=255)
     */
    private $nom_com;

    /**
     * @ORM\Column(type="decimal", precision=16, scale=14)
     */
    private $x;

    /**
     * @ORM\Column(type="decimal", precision=16, scale=14)
     */
    private $y;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getDepCom(): ?string
    {
        return $this->dep_com;
    }

    public function setDepCom(string $dep_com): self
    {
        $this->dep_com = $dep_com;

        return $this;
    }

    public function getNomCom(): ?string
    {
        return $this->nom_com;
    }

    public function setNomCom(string $nom_com): self
    {
        $this->nom_com = $nom_com;

        return $this;
    }

    public function getX(): ?string
    {
        return $this->x;
    }

    public function setX(string $x): self
    {
        $this->x = $x;

        return $this;
    }

    public function getY(): ?string
    {
        return $this->y;
    }

    public function setY(string $y): self
    {
        $this->y = $y;

        return $this;
    }
}
