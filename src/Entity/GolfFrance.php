<?php

namespace App\Entity;

use App\Repository\GolfFranceRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;


/**
 * Ogresto.golffrance
 *
 * @ORM\Table(name="golffrance")
 * @ORM\Entity(repositoryClass="App\Repository\GolfFranceRepository")
 * 
 */
class GolfFrance
{

    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="SEQUENCE")
     * @ORM\SequenceGenerator(sequenceName="ogresto.bdd_resto_id_seq", allocationSize=1, initialValue=1)
     */
    private $id;

    /**
     * 
     * @ORM\Column(name="web", type="string", length=254, nullable=true)
     */
    private $web;

    /**
     * 
     * @ORM\Column(name="nom_golf", type="string", length=254, nullable=true)
     */
    private $nom_golf;

    /**
     * 
     * @ORM\Column(name="adr1", type="string", length=254, nullable=true)
     */
    private $adr1;

    /**
     * 
     * @ORM\Column(name="adr2", type="string", length=254, nullable=true)
     */
    private $adr2;

    /**
     * 
     * @ORM\Column(name="adr3", type="string", length=254, nullable=true)
     */
    private $adr3;

    /**
     * 
     * @ORM\Column(name="cp", type="string", length=254, nullable=true)
     */
    private $cp;

    /**
     * 
     * @ORM\Column(name="nom_commune", type="string", length=254, nullable=true)
     */
    private $nom_commune;

    /**
     * @var float|null
     *
     * @ORM\Column(name="latitude", type="float", precision=18, scale=16, nullable=true)
     */
    private $latitude;

    /**
     * @var float|null
     *
     * @ORM\Column(name="longitude", type="float", precision=18, scale=16, nullable=true)
     */
    private $longitude;

    /**
     * 
     * @ORM\Column(name="telephone", type="string", length=254, nullable=true)
     */
    private $telephone;

    /**
     * 
     * @ORM\Column(name="e_mail", type="string", length=254, nullable=true)
     */
    private $e_mail;

    /**
     * 
     * @ORM\Column(name="site_web", type="string", length=254, nullable=true)
     */
    private $site_web;

    /**
     * 
     * @ORM\Column(name="dep", type="integer", nullable=true)
     */
    private $dep;

    /**
     * 
     * @ORM\Column(name="nom_dep", type="string", length=254, nullable=true)
     */
    private $nom_dep;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getWeb(): ?string
    {
        return $this->web;
    }

    public function setWeb(?string $web): static
    {
        $this->web = $web;

        return $this;
    }

    public function getNomGolf(): ?string
    {
        return $this->nom_golf;
    }

    public function setNomGolf(?string $nom_golf): static
    {
        $this->nom_golf = $nom_golf;

        return $this;
    }

    public function getAdr1(): ?string
    {
        return $this->adr1;
    }

    public function setAdr1(?string $adr1): static
    {
        $this->adr1 = $adr1;

        return $this;
    }

    public function getAdr2(): ?string
    {
        return $this->adr2;
    }

    public function setAdr2(?string $adr2): static
    {
        $this->adr2 = $adr2;

        return $this;
    }

    public function getAdr3(): ?string
    {
        return $this->adr3;
    }

    public function setAdr3(?string $adr3): static
    {
        $this->adr3 = $adr3;

        return $this;
    }

    public function getCp(): ?string
    {
        return $this->cp;
    }

    public function setCp(?string $cp): static
    {
        $this->cp = $cp;

        return $this;
    }

    public function getNomCommune(): ?string
    {
        return $this->nom_commune;
    }

    public function setNomCommune(?string $nom_commune): static
    {
        $this->nom_commune = $nom_commune;

        return $this;
    }

    public function getLatitude(): ?string
    {
        return $this->latitude;
    }

    public function setLatitude(?string $latitude): static
    {
        $this->latitude = $latitude;

        return $this;
    }

    public function getLongitude(): ?string
    {
        return $this->longitude;
    }

    public function setLongitude(?string $longitude): static
    {
        $this->longitude = $longitude;

        return $this;
    }

    public function getTelephone(): ?string
    {
        return $this->telephone;
    }

    public function setTelephone(?string $telephone): static
    {
        $this->telephone = $telephone;

        return $this;
    }

    public function getEMail(): ?string
    {
        return $this->e_mail;
    }

    public function setEMail(?string $e_mail): static
    {
        $this->e_mail = $e_mail;

        return $this;
    }

    public function getSiteWeb(): ?string
    {
        return $this->site_web;
    }

    public function setSiteWeb(?string $site_web): static
    {
        $this->site_web = $site_web;

        return $this;
    }
}
