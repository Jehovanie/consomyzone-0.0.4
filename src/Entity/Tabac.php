<?php

namespace App\Entity;

use App\Repository\TabacRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Table(name="bureau_tabac")
 * @ORM\Entity(repositoryClass=TabacRepository::class)
 */
class Tabac
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=200, nullable=true)
     */
    private $clenum;

    /**
     * @ORM\Column(type="string", length=200, nullable=true)
     */
    private $denomination_f;

    /**
     * @ORM\Column(type="string", length=200, nullable=true)
     */
    private $numvoie;

    /**
     * @ORM\Column(type="string", length=200, nullable=true)
     */
    private $typevoie;

    /**
     * @ORM\Column(type="string", length=200, nullable=true)
     */
    private $nomvoie;

    /**
     * @ORM\Column(type="string", length=200, nullable=true)
     */
    private $compvoie;

    /**
     * @ORM\Column(type="string", length=200, nullable=true)
     */
    private $codpost;

    /**
     * @ORM\Column(type="string", length=200, nullable=true)
     */
    private $villenorm;

    /**
     * @ORM\Column(type="string", length=200, nullable=true)
     */
    private $commune;

    /**
     * @ORM\Column(type="string", length=200, nullable=true)
     */
    private $codinsee;

    /**
     * @ORM\Column(type="string", length=200, nullable=true)
     */
    private $siren;

    /**
     * @ORM\Column(type="string", length=200, nullable=true)
     */
    private $tel;

    /**
     * @ORM\Column(type="string", length=200, nullable=true)
     */
    private $bureau_tabac;

    /**
     * @ORM\Column(type="string", length=200, nullable=true)
     */
    private $tabac_presse;

    /**
     * @ORM\Column(type="string", length=200, nullable=true)
     */
    private $bar_tabac;

    /**
     * @ORM\Column(type="string", length=200, nullable=true)
     */
    private $hotel_tabac;

    /**
     * @ORM\Column(type="string", length=200, nullable=true)
     */
    private $cafe_tabac;

    /**
     * @ORM\Column(type="string", length=200, nullable=true)
     */
    private $site_1;

    /**
     * @ORM\Column(type="string", length=200, nullable=true)
     */
    private $site_2;

    /**
     * @ORM\Column(type="string", length=200, nullable=true)
     */
    private $fonctionalite_1;

    /**
     * @ORM\Column(type="string", length=200, nullable=true)
     */
    private $horaires_1;

    /**
     * @ORM\Column(type="string", length=200, nullable=true)
     */
    private $prestation_1;

    /**
     * @ORM\Column(type="string", length=200, nullable=true)
     */
    private $codens;

    /**
     *  @ORM\Column(type="decimal", precision=16, scale=14, nullable=true)
     */
    private $poi_x;

    /**
     * @ORM\Column(type="decimal", precision=16, scale=14, nullable=true)
     */
    private $poi_y;

    /**
     * @ORM\Column(type="string", length=200, nullable=true)
     */
    private $poi_qualitegeorue;

    /**
     * @ORM\Column(type="string", length=200, nullable=true)
     */
    private $dcomiris;

    /**
     * @ORM\Column(type="string", length=200, nullable=true)
     */
    private $dep;


    /**
     * @ORM\Column(type="string", length=200, nullable=true)
     */
    private $dep_name;

    /**
     * @ORM\Column(type="string", length=200, nullable=true)
     */
    private $date_data;

    /**
     * @ORM\Column(type="string", length=200, nullable=true)
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

    public function setDenominationF(?string $denomination_f): self
    {
        $this->denomination_f = $denomination_f;

        return $this;
    }

    public function getNumvoie(): ?string
    {
        return $this->numvoie;
    }

    public function setNumvoie(?string $numvoie): self
    {
        $this->numvoie = $numvoie;

        return $this;
    }

    public function getTypevoie(): ?string
    {
        return $this->typevoie;
    }

    public function setTypevoie(?string $typevoie): self
    {
        $this->typevoie = $typevoie;

        return $this;
    }

    public function getNomvoie(): ?string
    {
        return $this->nomvoie;
    }

    public function setNomvoie(?string $nomvoie): self
    {
        $this->nomvoie = $nomvoie;

        return $this;
    }

    public function getCompvoie(): ?string
    {
        return $this->compvoie;
    }

    public function setCompvoie(?string $compvoie): self
    {
        $this->compvoie = $compvoie;

        return $this;
    }

    public function getCodpost(): ?string
    {
        return $this->codpost;
    }

    public function setCodpost(?string $codpost): self
    {
        $this->codpost = $codpost;

        return $this;
    }

    public function getVillenorm(): ?string
    {
        return $this->villenorm;
    }

    public function setVillenorm(?string $villenorm): self
    {
        $this->villenorm = $villenorm;

        return $this;
    }

    public function getCommune(): ?string
    {
        return $this->commune;
    }

    public function setCommune(?string $commune): self
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

    public function getSiren(): ?string
    {
        return $this->siren;
    }

    public function setSiren(?string $siren): self
    {
        $this->siren = $siren;

        return $this;
    }

    public function getTel(): ?string
    {
        return $this->tel;
    }

    public function setTel(?string $tel): self
    {
        $this->tel = $tel;

        return $this;
    }

    public function getBureauTabac(): ?string
    {
        return $this->bureau_tabac;
    }

    public function setBureauTabac(?string $bureau_tabac): self
    {
        $this->bureau_tabac = $bureau_tabac;

        return $this;
    }

    public function getTabacPresse(): ?string
    {
        return $this->tabac_presse;
    }

    public function setTabacPresse(?string $tabac_presse): self
    {
        $this->tabac_presse = $tabac_presse;

        return $this;
    }

    public function getBarTabac(): ?string
    {
        return $this->bar_tabac;
    }

    public function setBarTabac(?string $bar_tabac): self
    {
        $this->bar_tabac = $bar_tabac;

        return $this;
    }

    public function getHotelTabac(): ?string
    {
        return $this->hotel_tabac;
    }

    public function setHotelTabac(?string $hotel_tabac): self
    {
        $this->hotel_tabac = $hotel_tabac;

        return $this;
    }

    public function getCafeTabac(): ?string
    {
        return $this->cafe_tabac;
    }

    public function setCafeTabac(?string $cafe_tabac): self
    {
        $this->cafe_tabac = $cafe_tabac;

        return $this;
    }

    public function getSite1(): ?string
    {
        return $this->site_1;
    }

    public function setSite1(?string $site_1): self
    {
        $this->site_1 = $site_1;

        return $this;
    }

    public function getSite2(): ?string
    {
        return $this->site_2;
    }

    public function setSite2(?string $site_2): self
    {
        $this->site_2 = $site_2;

        return $this;
    }

    public function getFonctionalite1(): ?string
    {
        return $this->fonctionalite_1;
    }

    public function setFonctionalite1(?string $fonctionalite_1): self
    {
        $this->fonctionalite_1 = $fonctionalite_1;

        return $this;
    }

    public function getHoraires1(): ?string
    {
        return $this->horaires_1;
    }

    public function setHoraires1(?string $horaires_1): self
    {
        $this->horaires_1 = $horaires_1;

        return $this;
    }

    public function getPrestation1(): ?string
    {
        return $this->prestation_1;
    }

    public function setPrestation1(?string $prestation_1): self
    {
        $this->prestation_1 = $prestation_1;

        return $this;
    }

    public function getCodens(): ?string
    {
        return $this->codens;
    }

    public function setCodens(?string $codens): self
    {
        $this->codens = $codens;

        return $this;
    }

    public function getPoiX(): ?string
    {
        return $this->poi_x;
    }

    public function setPoiX(?string $poi_x): self
    {
        $this->poi_x = $poi_x;

        return $this;
    }

    public function getPoiY(): ?string
    {
        return $this->poi_y;
    }

    public function setPoiY(?string $poi_y): self
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

    public function getDepName(): ?string
    {
        return $this->dep_name;
    }

    public function setDepName(?string $dep_name): self
    {
        $this->dep_name = $dep_name;

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

    /**
     * Get the value of dep
     */ 
    public function getDep()
    {
        return $this->dep;
    }

    /**
     * Set the value of dep
     *
     * @return  self
     */ 
    public function setDep($dep)
    {
        $this->dep = $dep;

        return $this;
    }
}
