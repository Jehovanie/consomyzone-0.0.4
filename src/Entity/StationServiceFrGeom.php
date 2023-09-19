<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
/**
 * StationServiceFrGeom
 *
 * @ORM\Table(name="station_service_fr_geom")
 * @ORM\Entity(repositoryClass="App\Repository\StationServiceFrGeomRepository")
 */
class StationServiceFrGeom
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @var string|null
     *
     * @ORM\Column(name="adresse", type="string", nullable=true)
     */
    private $adresse;

    /**
     * @var bool|null
     *
     * @ORM\Column(name="automate_24_24", type="boolean", nullable=true)
     */
    private $automate2424;

    /**
     * @var string|null
     *
     * @ORM\Column(name="departement_code", type="string", nullable=true)
     */
    private $departementCode;

    /**
     * @var string|null
     *
     * @ORM\Column(name="departement_name", type="string", nullable=true)
     */
    private $departementName;

    /**
     * @var string|null
     *
     * @ORM\Column(name="horaires", type="string", nullable=true)
     */
    private $horaies;

    /**
     * @var string|null
     *
     * @ORM\Column(name="nom", type="string", nullable=true)
     */
    private $nom;

  

    /**
     * @var string|null
     *
     * @ORM\Column(name="services", type="string", nullable=true)
     */
    private $services;

    /**
     * @var string|null
     *
     * @ORM\Column(name="prix_e85", type="decimal", precision=4, scale=3, nullable=true)
     */
    private $prixE85;

    /**
     * @var string|null
     *
     * @ORM\Column(name="prix_gplc", type="decimal", precision=4, scale=3, nullable=true)
     */
    private $prixGplc;

    /**
     * @var string|null
     *
     * @ORM\Column(name="prix_sp95", type="decimal", precision=4, scale=3, nullable=true)
     */
    private $prixSp95;

    /**
     * @var string|null
     *
     * @ORM\Column(name="prix_sp95_e10", type="decimal", precision=4, scale=3, nullable=true)
     */
    private $prixSp95E10;

    /**
     * @var string|null
     *
     * @ORM\Column(name="prix_sp98", type="decimal", precision=4, scale=3, nullable=true)
     */
    private $prixSp98;

    /**
     * @var string|null
     *
     * @ORM\Column(name="prix_gasoil", type="decimal", precision=4, scale=3, nullable=true)
     */
    private $prixGasoil;

    /**
     * @var float|null
     *
     * @ORM\Column(name="latitude",type="decimal", precision=16, scale=14, nullable=true)
     */
    private $latitude;

    /**
     * @var float|null
     *
     * @ORM\Column(name="longitude",type="decimal", precision=16, scale=14, nullable=true)
     */
    private $longitude;

    /**
     * 
     *
     * @ORM\Column(name="note", type="decimal", precision=3, scale=0, nullable=true)
     */
    private $note;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getAdresse(): ?string
    {
        return $this->adresse;
    }

    public function setAdresse(?string $adresse): self
    {
        $this->adresse = $adresse;

        return $this;
    }

    public function isAutomate2424(): ?bool
    {
        return $this->automate2424;
    }

    public function setAutomate2424(?bool $automate2424): self
    {
        $this->automate2424 = $automate2424;

        return $this;
    }

    public function getDepartementCode(): ?string
    {
        return $this->departementCode;
    }

    public function setDepartementCode(?string $departementCode): self
    {
        $this->departementCode = $departementCode;

        return $this;
    }

    public function getDepartementName(): ?string
    {
        return $this->departementName;
    }

    public function setDepartementName(?string $departementName): self
    {
        $this->departementName = $departementName;

        return $this;
    }

    public function getHoraies(): ?string
    {
        return $this->horaies;
    }

    public function setHoraies(?string $horaies): self
    {
        $this->horaies = $horaies;

        return $this;
    }

    public function getNom(): ?string
    {
        return $this->nom;
    }

    public function setNom(?string $nom): self
    {
        $this->nom = $nom;

        return $this;
    }

 

    public function getServices(): ?string
    {
        return $this->services;
    }

    public function setServices(?string $services): self
    {
        $this->services = $services;

        return $this;
    }

    public function getPrixE85(): ?string
    {
        return $this->prixE85;
    }

    public function setPrixE85(?string $prixE85): self
    {
        $this->prixE85 = $prixE85;

        return $this;
    }

    public function getPrixGplc(): ?string
    {
        return $this->prixGplc;
    }

    public function setPrixGplc(?string $prixGplc): self
    {
        $this->prixGplc = $prixGplc;

        return $this;
    }

    public function getPrixSp95(): ?string
    {
        return $this->prixSp95;
    }

    public function setPrixSp95(?string $prixSp95): self
    {
        $this->prixSp95 = $prixSp95;

        return $this;
    }

    public function getPrixSp95E10(): ?string
    {
        return $this->prixSp95E10;
    }

    public function setPrixSp95E10(?string $prixSp95E10): self
    {
        $this->prixSp95E10 = $prixSp95E10;

        return $this;
    }

    public function getPrixSp98(): ?string
    {
        return $this->prixSp98;
    }

    public function setPrixSp98(?string $prixSp98): self
    {
        $this->prixSp98 = $prixSp98;

        return $this;
    }

    public function getPrixGasoil(): ?string
    {
        return $this->prixGasoil;
    }

    public function setPrixGasoil(?string $prixGasoil): self
    {
        $this->prixGasoil = $prixGasoil;

        return $this;
    }

    public function getLatitude(): ?float
    {
        return $this->latitude;
    }

    public function setLatitude(?float $latitude): self
    {
        $this->latitude = $latitude;

        return $this;
    }

    public function getLongitude(): ?float
    {
        return $this->longitude;
    }

    public function setLongitude(?float $longitude): self
    {
        $this->longitude = $longitude;

        return $this;
    }



    /**
     * Get the value of note
     */ 
    public function getNote()
    {
        return $this->note;
    }

    /**
     * Set the value of note
     *
     * @return  self
     */ 
    public function setNote($note)
    {
        $this->note = $note;

        return $this;
    }
}
