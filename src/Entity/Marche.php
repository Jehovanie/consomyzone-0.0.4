<?php

namespace App\Entity;

use App\Repository\MarcheRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=MarcheRepository::class)
 */
class Marche
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=50, nullable=true)
     */
    private $clenum;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $denomination_f;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $adresse;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $codpost;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $villenorm;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $commune;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $codinsee;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $specificite;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $jour_de_marche_1;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $jour_de_marche_2;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $jour_de_marche_3;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $jour_de_marche_4;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $jour_de_marche_6;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $jour_de_marche_7;

    /**
     * @ORM\Column(type="decimal", precision=16, scale=14)
     */
    private $poi_x;

    /**
     * @ORM\Column(type="decimal", precision=16, scale=14)
     */
    private $poi_y;

    /**
     * @ORM\Column(type="string", length=50, nullable=true)
     */
    private $poi_qualitegeorue;

    /**
     * @ORM\Column(type="string", length=50, nullable=true)
     */
    private $dcomiris;

    /**
     * @ORM\Column(type="string", length=5)
     */
    private $dep;

    /**
     * @ORM\Column(type="string", length=50, nullable=true)
     */
    private $date_data;

    /**
     * @ORM\Column(type="string", length=50, nullable=true)
     */
    private $date_inser;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getClenum(): ?string
    {
        return $this->clenum;
    }

    public function setClenum(?string $clenum): self
    {
        $this->clenum = $clenum;

        return $this;
    }

    public function getDenominationF(): ?string
    {
        return $this->denomination_f;
    }

    public function setDenominationF(string $denomination_f): self
    {
        $this->denomination_f = $denomination_f;

        return $this;
    }

    public function getAdresse(): ?string
    {
        return $this->adresse;
    }

    public function setAdresse(string $adresse): self
    {
        $this->adresse = $adresse;

        return $this;
    }

    public function getCodpost(): ?string
    {
        return $this->codpost;
    }

    public function setCodpost(string $codpost): self
    {
        $this->codpost = $codpost;

        return $this;
    }

    public function getVillenorm(): ?string
    {
        return $this->villenorm;
    }

    public function setVillenorm(string $villenorm): self
    {
        $this->villenorm = $villenorm;

        return $this;
    }

    public function getCommune(): ?string
    {
        return $this->commune;
    }

    public function setCommune(string $commune): self
    {
        $this->commune = $commune;

        return $this;
    }

    public function getCodinsee(): ?string
    {
        return $this->codinsee;
    }

    public function setCodinsee(?string $codinsee): self
    {
        $this->codinsee = $codinsee;

        return $this;
    }

    public function getSpecificite(): ?string
    {
        return $this->specificite;
    }

    public function setSpecificite(?string $specificite): self
    {
        $this->specificite = $specificite;

        return $this;
    }

    public function getJourDeMarche1(): ?string
    {
        return $this->jour_de_marche_1;
    }

    public function setJourDeMarche1(?string $jour_de_marche_1): self
    {
        $this->jour_de_marche_1 = $jour_de_marche_1;

        return $this;
    }

    public function getJourDeMarche2(): ?string
    {
        return $this->jour_de_marche_2;
    }

    public function setJourDeMarche2(?string $jour_de_marche_2): self
    {
        $this->jour_de_marche_2 = $jour_de_marche_2;

        return $this;
    }

    public function getJourDeMarche3(): ?string
    {
        return $this->jour_de_marche_3;
    }

    public function setJourDeMarche3(?string $jour_de_marche_3): self
    {
        $this->jour_de_marche_3 = $jour_de_marche_3;

        return $this;
    }

    public function getJourDeMarche4(): ?string
    {
        return $this->jour_de_marche_4;
    }

    public function setJourDeMarche4(?string $jour_de_marche_4): self
    {
        $this->jour_de_marche_4 = $jour_de_marche_4;

        return $this;
    }

    public function getJourDeMarche6(): ?string
    {
        return $this->jour_de_marche_6;
    }

    public function setJourDeMarche6(?string $jour_de_marche_6): self
    {
        $this->jour_de_marche_6 = $jour_de_marche_6;

        return $this;
    }

    public function getJourDeMarche7(): ?string
    {
        return $this->jour_de_marche_7;
    }

    public function setJourDeMarche7(?string $jour_de_marche_7): self
    {
        $this->jour_de_marche_7 = $jour_de_marche_7;

        return $this;
    }

    public function getPoiX(): ?string
    {
        return $this->poi_x;
    }

    public function setPoiX(string $poi_x): self
    {
        $this->poi_x = $poi_x;

        return $this;
    }

    public function getPoiY(): ?string
    {
        return $this->poi_y;
    }

    public function setPoiY(string $poi_y): self
    {
        $this->poi_y = $poi_y;

        return $this;
    }

    public function getPoiQualitegeorue(): ?string
    {
        return $this->poi_qualitegeorue;
    }

    public function setPoiQualitegeorue(?string $poi_qualitegeorue): self
    {
        $this->poi_qualitegeorue = $poi_qualitegeorue;

        return $this;
    }

    public function getDcomiris(): ?string
    {
        return $this->dcomiris;
    }

    public function setDcomiris(?string $dcomiris): self
    {
        $this->dcomiris = $dcomiris;

        return $this;
    }

    public function getDep(): ?string
    {
        return $this->dep;
    }

    public function setDep(string $dep): self
    {
        $this->dep = $dep;

        return $this;
    }

    public function getDateData(): ?string
    {
        return $this->date_data;
    }

    public function setDateData(?string $date_data): self
    {
        $this->date_data = $date_data;

        return $this;
    }

    public function getDateInser(): ?string
    {
        return $this->date_inser;
    }

    public function setDateInser(?string $date_inser): self
    {
        $this->date_inser = $date_inser;

        return $this;
    }
}
