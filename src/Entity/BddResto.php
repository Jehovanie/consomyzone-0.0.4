<?php

namespace App\Entity;

use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

/**
 * Ogresto.bddResto
 *
 * @ORM\Table(name="bdd_resto")
 * @ORM\Entity(repositoryClass="App\Repository\BddRestoRepository")
 * 
 */
class BddResto
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
     * @var string|null
     *
     * @ORM\Column(name="clenum", type="string", length=50, nullable=true)
     */
    private $clenum;

    /**
     * @var string|null
     *
     * @ORM\Column(name="denomination_f", type="string", length=1024, nullable=true)
     */
    private $denominationF;

    /**
     * @var string|null
     *
     * @ORM\Column(name="numvoie", type="string", length=1024, nullable=true)
     */
    private $numvoie;

    /**
     * @var string|null
     *
     * @ORM\Column(name="typevoie", type="string", length=1024, nullable=true)
     */
    private $typevoie;

    /**
     * @var string|null
     *
     * @ORM\Column(name="nomvoie", type="string", length=1024, nullable=true)
     */
    private $nomvoie;

    /**
     * @var string|null
     *
     * @ORM\Column(name="compvoie", type="string", length=1024, nullable=true)
     */
    private $compvoie;

    /**
     * @var string|null
     *
     * @ORM\Column(name="codpost", type="string", length=1024, nullable=true)
     */
    private $codpost;

    /**
     * @var string|null
     *
     * @ORM\Column(name="villenorm", type="string", length=1024, nullable=true)
     */
    private $villenorm;

    /**
     * @var string|null
     *
     * @ORM\Column(name="commune", type="string", length=1024, nullable=true)
     */
    private $commune;

    /**
     * @var string|null
     *
     * @ORM\Column(name="codinsee", type="string", length=1024, nullable=true)
     */
    private $codinsee;

    /**
     * @var string|null
     *
     * @ORM\Column(name="siren", type="string", length=1024, nullable=true)
     */
    private $siren;

    /**
     * @var string|null
     *
     * @ORM\Column(name="tel", type="string", length=1024, nullable=true)
     */
    private $tel;

    /**
     * @var float|null
     *
     * @ORM\Column(name="restaurant", type="float", precision=10, scale=0, nullable=true)
     */
    private $restaurant;

    /**
     * @var string|null
     *
     * @ORM\Column(name="brasserie", type="decimal", precision=1, scale=0, nullable=true)
     */
    private $brasserie;

    /**
     * @var string|null
     *
     * @ORM\Column(name="creperie", type="decimal", precision=1, scale=0, nullable=true)
     */
    private $creperie;

    /**
     * @var string|null
     *
     * @ORM\Column(name="fast_food", type="decimal", precision=1, scale=0, nullable=true)
     */
    private $fastFood;

    /**
     * @var string|null
     *
     * @ORM\Column(name="pizzeria", type="decimal", precision=1, scale=0, nullable=true)
     */
    private $pizzeria;

    /**
     * @var string|null
     *
     * @ORM\Column(name="boulangerie", type="decimal", precision=1, scale=0, nullable=true)
     */
    private $boulangerie;

    /**
     * @var string|null
     *
     * @ORM\Column(name="bar", type="decimal", precision=1, scale=0, nullable=true)
     */
    private $bar;

    /**
     * @var string|null
     *
     * @ORM\Column(name="cuisine_monde", type="decimal", precision=1, scale=0, nullable=true)
     */
    private $cuisineMonde;

    /**
     * @var string|null
     *
     * @ORM\Column(name="cafe", type="decimal", precision=1, scale=0, nullable=true)
     */
    private $cafe;

    /**
     * @var string|null
     *
     * @ORM\Column(name="salon_the", type="decimal", precision=1, scale=0, nullable=true)
     */
    private $salonThe;

    /**
     * @var string|null
     *
     * @ORM\Column(name="site_1", type="string", length=1024, nullable=true)
     */
    private $site1;

    /**
     * @var string|null
     *
     * @ORM\Column(name="site_2", type="string", length=1024, nullable=true)
     */
    private $site2;

    /**
     * @var string|null
     *
     * @ORM\Column(name="ambiance_1", type="string", length=1024, nullable=true)
     */
    private $ambiance1;

    /**
     * @var string|null
     *
     * @ORM\Column(name="ambiance_2", type="string", length=1024, nullable=true)
     */
    private $ambiance2;

    /**
     * @var string|null
     *
     * @ORM\Column(name="budget_1", type="string", length=1024, nullable=true)
     */
    private $budget1;

    /**
     * @var string|null
     *
     * @ORM\Column(name="budget_2", type="string", length=1024, nullable=true)
     */
    private $budget2;

    /**
     * @var string|null
     *
     * @ORM\Column(name="fonctionalite_1", type="string", length=1024, nullable=true)
     */
    private $fonctionalite1;

    /**
     * @var string|null
     *
     * @ORM\Column(name="fonctionalite_2", type="string", length=1024, nullable=true)
     */
    private $fonctionalite2;

    /**
     * @var string|null
     *
     * @ORM\Column(name="fonctionalite_3", type="string", length=1024, nullable=true)
     */
    private $fonctionalite3;

    /**
     * @var string|null
     *
     * @ORM\Column(name="fourchette_prix_1", type="string", length=1024, nullable=true)
     */
    private $fourchettePrix1;

    /**
     * @var string|null
     *
     * @ORM\Column(name="fourchette_prix_2", type="string", length=1024, nullable=true)
     */
    private $fourchettePrix2;

    /**
     * @var string|null
     *
     * @ORM\Column(name="horaires_1", type="string", length=1024, nullable=true)
     */
    private $horaires1;

    /**
     * @var string|null
     *
     * @ORM\Column(name="horaires_2", type="string", length=1024, nullable=true)
     */
    private $horaires2;

    /**
     * @var string|null
     *
     * @ORM\Column(name="note_1", type="string", length=1024, nullable=true)
     */
    private $note1;

    /**
     * @var string|null
     *
     * @ORM\Column(name="note_2", type="string", length=1024, nullable=true)
     */
    private $note2;

    /**
     * @var string|null
     *
     * @ORM\Column(name="prestation_1", type="string", length=1024, nullable=true)
     */
    private $prestation1;

    /**
     * @var string|null
     *
     * @ORM\Column(name="prestation_2", type="string", length=1024, nullable=true)
     */
    private $prestation2;

    /**
     * @var string|null
     *
     * @ORM\Column(name="regime_speciaux_1", type="string", length=1024, nullable=true)
     */
    private $regimeSpeciaux1;

    /**
     * @var string|null
     *
     * @ORM\Column(name="repas_1", type="string", length=1024, nullable=true)
     */
    private $repas1;

    /**
     * @var string|null
     *
     * @ORM\Column(name="repas_2", type="string", length=1024, nullable=true)
     */
    private $repas2;

    /**
     * @var string|null
     *
     * @ORM\Column(name="repas_3", type="string", length=1024, nullable=true)
     */
    private $repas3;

    /**
     * @var string|null
     *
     * @ORM\Column(name="type_cuisine_1", type="string", length=1024, nullable=true)
     */
    private $typeCuisine1;

    /**
     * @var string|null
     *
     * @ORM\Column(name="type_cuisine_2", type="string", length=1024, nullable=true)
     */
    private $typeCuisine2;

    /**
     * @var string|null
     *
     * @ORM\Column(name="type_cuisine_3", type="string", length=1024, nullable=true)
     */
    private $typeCuisine3;

    /**
     * @var string|null
     *
     * @ORM\Column(name="type_cuisine_4", type="string", length=1024, nullable=true)
     */
    private $typeCuisine4;

    /**
     * @var string|null
     *
     * @ORM\Column(name="codens", type="string", length=1024, nullable=true)
     */
    private $codens;

    /**
     * @var string|null
     *
     * @ORM\Column(name="type_cuisine_5", type="string", length=1024, nullable=true)
     */
    private $typeCuisine5;

    /**
     * @var string|null
     *
     * @ORM\Column(name="id_pj_1", type="string", length=1024, nullable=true)
     */
    private $idPj1;

    /**
     * @var string|null
     *
     * @ORM\Column(name="id_pj_2", type="string", length=1024, nullable=true)
     */
    private $idPj2;

    /**
     * @var string|null
     *
     * @ORM\Column(name="id_pj_3", type="string", length=1024, nullable=true)
     */
    private $idPj3;

    /**
     * @var string|null
     *
     * @ORM\Column(name="id_pj_5", type="string", length=1024, nullable=true)
     */
    private $idPj5;

    /**
     * @var string|null
     *
     * @ORM\Column(name="id_ta_1", type="string", length=1024, nullable=true)
     */
    private $idTa1;

    /**
     * @var string|null
     *
     * @ORM\Column(name="id_ta_2", type="string", length=1024, nullable=true)
     */
    private $idTa2;

    /**
     * @var string|null
     *
     * @ORM\Column(name="id_ta_3", type="string", length=1024, nullable=true)
     */
    private $idTa3;

    /**
     * @var string|null
     *
     * @ORM\Column(name="id_stock_1", type="string", length=1024, nullable=true)
     */
    private $idStock1;

    /**
     * @var string|null
     *
     * @ORM\Column(name="id_stock_2", type="string", length=1024, nullable=true)
     */
    private $idStock2;

    /**
     * @var float|null
     *
     * @ORM\Column(name="poi_x", type="float", precision=10, scale=0, nullable=true)
     */
    private $poiX;

    /**
     * @var float|null
     *
     * @ORM\Column(name="poi_y", type="float", precision=10, scale=0, nullable=true)
     */
    private $poiY;

    /**
     * @var string|null
     *
     * @ORM\Column(name="poi_qualitegeorue", type="string", length=15, nullable=true)
     */
    private $poiQualitegeorue;

    /**
     * @var string|null
     *
     * @ORM\Column(name="dcomiris", type="string", length=9, nullable=true)
     */
    private $dcomiris;

    /**
     * @var string|null
     *
     * @ORM\Column(name="dep", type="string", length=3, nullable=true)
     */
    private $dep;

    /**
     * @var string|null
     *
     * @ORM\Column(name="dep_name", type="string", length=255, nullable=true)
     */
    private $depName;



    /**
     * @var string|null
     *
     * @ORM\Column(name="date_data", type="string", length=10, nullable=true)
     */
    private $dateData;

    /**
     * @var string|null
     *
     * @ORM\Column(name="date_inser", type="string", length=10, nullable=true)
     */
    private $dateInser;

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
        return $this->denominationF;
    }

    public function setDenominationF(?string $denominationF): self
    {
        $this->denominationF = $denominationF;

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

    public function getRestaurant(): ?float
    {
        return $this->restaurant;
    }

    public function setRestaurant(?float $restaurant): self
    {
        $this->restaurant = $restaurant;

        return $this;
    }

    public function getBrasserie(): ?string
    {
        return $this->brasserie;
    }

    public function setBrasserie(?string $brasserie): self
    {
        $this->brasserie = $brasserie;

        return $this;
    }

    public function getCreperie(): ?string
    {
        return $this->creperie;
    }

    public function setCreperie(?string $creperie): self
    {
        $this->creperie = $creperie;

        return $this;
    }

    public function getFastFood(): ?string
    {
        return $this->fastFood;
    }

    public function setFastFood(?string $fastFood): self
    {
        $this->fastFood = $fastFood;

        return $this;
    }

    public function getPizzeria(): ?string
    {
        return $this->pizzeria;
    }

    public function setPizzeria(?string $pizzeria): self
    {
        $this->pizzeria = $pizzeria;

        return $this;
    }

    public function getBoulangerie(): ?string
    {
        return $this->boulangerie;
    }

    public function setBoulangerie(?string $boulangerie): self
    {
        $this->boulangerie = $boulangerie;

        return $this;
    }

    public function getBar(): ?string
    {
        return $this->bar;
    }

    public function setBar(?string $bar): self
    {
        $this->bar = $bar;

        return $this;
    }

    public function getCuisineMonde(): ?string
    {
        return $this->cuisineMonde;
    }

    public function setCuisineMonde(?string $cuisineMonde): self
    {
        $this->cuisineMonde = $cuisineMonde;

        return $this;
    }

    public function getCafe(): ?string
    {
        return $this->cafe;
    }

    public function setCafe(?string $cafe): self
    {
        $this->cafe = $cafe;

        return $this;
    }

    public function getSalonThe(): ?string
    {
        return $this->salonThe;
    }

    public function setSalonThe(?string $salonThe): self
    {
        $this->salonThe = $salonThe;

        return $this;
    }

    public function getSite1(): ?string
    {
        return $this->site1;
    }

    public function setSite1(?string $site1): self
    {
        $this->site1 = $site1;

        return $this;
    }

    public function getSite2(): ?string
    {
        return $this->site2;
    }

    public function setSite2(?string $site2): self
    {
        $this->site2 = $site2;

        return $this;
    }

    public function getAmbiance1(): ?string
    {
        return $this->ambiance1;
    }

    public function setAmbiance1(?string $ambiance1): self
    {
        $this->ambiance1 = $ambiance1;

        return $this;
    }

    public function getAmbiance2(): ?string
    {
        return $this->ambiance2;
    }

    public function setAmbiance2(?string $ambiance2): self
    {
        $this->ambiance2 = $ambiance2;

        return $this;
    }

    public function getBudget1(): ?string
    {
        return $this->budget1;
    }

    public function setBudget1(?string $budget1): self
    {
        $this->budget1 = $budget1;

        return $this;
    }

    public function getBudget2(): ?string
    {
        return $this->budget2;
    }

    public function setBudget2(?string $budget2): self
    {
        $this->budget2 = $budget2;

        return $this;
    }

    public function getFonctionalite1(): ?string
    {
        return $this->fonctionalite1;
    }

    public function setFonctionalite1(?string $fonctionalite1): self
    {
        $this->fonctionalite1 = $fonctionalite1;

        return $this;
    }

    public function getFonctionalite2(): ?string
    {
        return $this->fonctionalite2;
    }

    public function setFonctionalite2(?string $fonctionalite2): self
    {
        $this->fonctionalite2 = $fonctionalite2;

        return $this;
    }

    public function getFonctionalite3(): ?string
    {
        return $this->fonctionalite3;
    }

    public function setFonctionalite3(?string $fonctionalite3): self
    {
        $this->fonctionalite3 = $fonctionalite3;

        return $this;
    }

    public function getFourchettePrix1(): ?string
    {
        return $this->fourchettePrix1;
    }

    public function setFourchettePrix1(?string $fourchettePrix1): self
    {
        $this->fourchettePrix1 = $fourchettePrix1;

        return $this;
    }

    public function getFourchettePrix2(): ?string
    {
        return $this->fourchettePrix2;
    }

    public function setFourchettePrix2(?string $fourchettePrix2): self
    {
        $this->fourchettePrix2 = $fourchettePrix2;

        return $this;
    }

    public function getHoraires1(): ?string
    {
        return $this->horaires1;
    }

    public function setHoraires1(?string $horaires1): self
    {
        $this->horaires1 = $horaires1;

        return $this;
    }

    public function getHoraires2(): ?string
    {
        return $this->horaires2;
    }

    public function setHoraires2(?string $horaires2): self
    {
        $this->horaires2 = $horaires2;

        return $this;
    }

    public function getNote1(): ?string
    {
        return $this->note1;
    }

    public function setNote1(?string $note1): self
    {
        $this->note1 = $note1;

        return $this;
    }

    public function getNote2(): ?string
    {
        return $this->note2;
    }

    public function setNote2(?string $note2): self
    {
        $this->note2 = $note2;

        return $this;
    }

    public function getPrestation1(): ?string
    {
        return $this->prestation1;
    }

    public function setPrestation1(?string $prestation1): self
    {
        $this->prestation1 = $prestation1;

        return $this;
    }

    public function getPrestation2(): ?string
    {
        return $this->prestation2;
    }

    public function setPrestation2(?string $prestation2): self
    {
        $this->prestation2 = $prestation2;

        return $this;
    }

    public function getRegimeSpeciaux1(): ?string
    {
        return $this->regimeSpeciaux1;
    }

    public function setRegimeSpeciaux1(?string $regimeSpeciaux1): self
    {
        $this->regimeSpeciaux1 = $regimeSpeciaux1;

        return $this;
    }

    public function getRepas1(): ?string
    {
        return $this->repas1;
    }

    public function setRepas1(?string $repas1): self
    {
        $this->repas1 = $repas1;

        return $this;
    }

    public function getRepas2(): ?string
    {
        return $this->repas2;
    }

    public function setRepas2(?string $repas2): self
    {
        $this->repas2 = $repas2;

        return $this;
    }

    public function getRepas3(): ?string
    {
        return $this->repas3;
    }

    public function setRepas3(?string $repas3): self
    {
        $this->repas3 = $repas3;

        return $this;
    }

    public function getTypeCuisine1(): ?string
    {
        return $this->typeCuisine1;
    }

    public function setTypeCuisine1(?string $typeCuisine1): self
    {
        $this->typeCuisine1 = $typeCuisine1;

        return $this;
    }

    public function getTypeCuisine2(): ?string
    {
        return $this->typeCuisine2;
    }

    public function setTypeCuisine2(?string $typeCuisine2): self
    {
        $this->typeCuisine2 = $typeCuisine2;

        return $this;
    }

    public function getTypeCuisine3(): ?string
    {
        return $this->typeCuisine3;
    }

    public function setTypeCuisine3(?string $typeCuisine3): self
    {
        $this->typeCuisine3 = $typeCuisine3;

        return $this;
    }

    public function getTypeCuisine4(): ?string
    {
        return $this->typeCuisine4;
    }

    public function setTypeCuisine4(?string $typeCuisine4): self
    {
        $this->typeCuisine4 = $typeCuisine4;

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

    public function getTypeCuisine5(): ?string
    {
        return $this->typeCuisine5;
    }

    public function setTypeCuisine5(?string $typeCuisine5): self
    {
        $this->typeCuisine5 = $typeCuisine5;

        return $this;
    }

    public function getIdPj1(): ?string
    {
        return $this->idPj1;
    }

    public function setIdPj1(?string $idPj1): self
    {
        $this->idPj1 = $idPj1;

        return $this;
    }

    public function getIdPj2(): ?string
    {
        return $this->idPj2;
    }

    public function setIdPj2(?string $idPj2): self
    {
        $this->idPj2 = $idPj2;

        return $this;
    }

    public function getIdPj3(): ?string
    {
        return $this->idPj3;
    }

    public function setIdPj3(?string $idPj3): self
    {
        $this->idPj3 = $idPj3;

        return $this;
    }

    public function getIdPj5(): ?string
    {
        return $this->idPj5;
    }

    public function setIdPj5(?string $idPj5): self
    {
        $this->idPj5 = $idPj5;

        return $this;
    }

    public function getIdTa1(): ?string
    {
        return $this->idTa1;
    }

    public function setIdTa1(?string $idTa1): self
    {
        $this->idTa1 = $idTa1;

        return $this;
    }

    public function getIdTa2(): ?string
    {
        return $this->idTa2;
    }

    public function setIdTa2(?string $idTa2): self
    {
        $this->idTa2 = $idTa2;

        return $this;
    }

    public function getIdTa3(): ?string
    {
        return $this->idTa3;
    }

    public function setIdTa3(?string $idTa3): self
    {
        $this->idTa3 = $idTa3;

        return $this;
    }

    public function getIdStock1(): ?string
    {
        return $this->idStock1;
    }

    public function setIdStock1(?string $idStock1): self
    {
        $this->idStock1 = $idStock1;

        return $this;
    }

    public function getIdStock2(): ?string
    {
        return $this->idStock2;
    }

    public function setIdStock2(?string $idStock2): self
    {
        $this->idStock2 = $idStock2;

        return $this;
    }

    public function getPoiX(): ?float
    {
        return $this->poiX;
    }

    public function setPoiX(?float $poiX): self
    {
        $this->poiX = $poiX;

        return $this;
    }

    public function getPoiY(): ?float
    {
        return $this->poiY;
    }

    public function setPoiY(?float $poiY): self
    {
        $this->poiY = $poiY;

        return $this;
    }

    public function getPoiQualitegeorue(): ?string
    {
        return $this->poiQualitegeorue;
    }

    public function setPoiQualitegeorue(?string $poiQualitegeorue): self
    {
        $this->poiQualitegeorue = $poiQualitegeorue;

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

    public function setDep(?string $dep): self
    {
        $this->dep = $dep;

        return $this;
    }

    public function getDateData(): ?string
    {
        return $this->dateData;
    }

    public function setDateData(?string $dateData): self
    {
        $this->dateData = $dateData;

        return $this;
    }

    public function getDateInser(): ?string
    {
        return $this->dateInser;
    }

    public function setDateInser(?string $dateInser): self
    {
        $this->dateInser = $dateInser;

        return $this;
    }



    /**
     * Get the value of depName
     *
     * @return  string|null
     */ 
    public function getDepName()
    {
        return $this->depName;
    }

    /**
     * Set the value of depName
     *
     * @param  string|null  $depName
     *
     * @return  self
     */ 
    public function setDepName($depName)
    {
        $this->depName = $depName;

        return $this;
    }
}
