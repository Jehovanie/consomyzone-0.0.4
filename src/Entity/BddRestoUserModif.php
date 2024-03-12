<?php

namespace App\Entity;

use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

/**
 *
 *
 * @ORM\Table(name="bdd_resto_usrmodif")
 * @ORM\Entity(repositoryClass="App\Repository\BddRestoUserModifRepository")
 * 
 */
class BddRestoUserModif
{
    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     *
     */
    private $id;

    /**
     * @var string|null
     *
     * @ORM\Column(name="denomination_f_new", type="string", length=1024, nullable=true)
     */
    private $denominationF;

    /**
     * @var string|null
     *
     * @ORM\Column(name="numvoie_new", type="string", length=1024, nullable=true)
     */
    private $numvoie;

    /**
     * @var string|null
     *
     * @ORM\Column(name="typevoie_new", type="string", length=1024, nullable=true)
     */
    private $typevoie;

    /**
     * @var string|null
     *
     * @ORM\Column(name="nomvoie_new", type="string", length=1024, nullable=true)
     */
    private $nomvoie;

    /**
     * @var string|null
     *
     * @ORM\Column(name="compvoie_new", type="string", length=1024, nullable=true)
     */
    private $compvoie;

    /**
     * @var string|null
     *
     * @ORM\Column(name="codpost_new", type="string", length=1024, nullable=true)
     */
    private $codpost;

    /**
     * @var string|null
     *
     * @ORM\Column(name="villenorm_new", type="string", length=1024, nullable=true)
     */
    private $villenorm;

    /**
     * @var string|null
     *
     * @ORM\Column(name="commune_new", type="string", length=1024, nullable=true)
     */
    private $commune;

   
    /**
     * @var string|null
     *
     * @ORM\Column(name="tel_new", type="string", length=1024, nullable=true)
     */
    private $tel;

    /**
     * @var float|null
     *
     * @ORM\Column(name="restaurant_new", type="float", precision=10, scale=0, nullable=true)
     */
    private $restaurant;

    /**
     * @var string|null
     *
     * @ORM\Column(name="brasserie_new", type="decimal", precision=1, scale=0, nullable=true)
     */
    private $brasserie;

    /**
     * @var string|null
     *
     * @ORM\Column(name="creperie_new", type="decimal", precision=1, scale=0, nullable=true)
     */
    private $creperie;

    /**
     * @var string|null
     *
     * @ORM\Column(name="fast_food_new", type="decimal", precision=1, scale=0, nullable=true)
     */
    private $fastFood;

    /**
     * @var string|null
     *
     * @ORM\Column(name="pizzeria_new", type="decimal", precision=1, scale=0, nullable=true)
     */
    private $pizzeria;

    /**
     * @var string|null
     *
     * @ORM\Column(name="boulangerie_new", type="decimal", precision=1, scale=0, nullable=true)
     */
    private $boulangerie;

    /**
     * @var string|null
     *
     * @ORM\Column(name="bar_new", type="decimal", precision=1, scale=0, nullable=true)
     */
    private $bar;

    /**
     * @var string|null
     *
     * @ORM\Column(name="cuisine_monde_new", type="decimal", precision=1, scale=0, nullable=true)
     */
    private $cuisineMonde;

    /**
     * @var string|null
     *
     * @ORM\Column(name="cafe_new", type="decimal", precision=1, scale=0, nullable=true)
     */
    private $cafe;

    /**
     * @var string|null
     *
     * @ORM\Column(name="salon_the_new", type="decimal", precision=1, scale=0, nullable=true)
     */
    private $salonThe;

  

    /**
     * @var float|null
     *
     * @ORM\Column(name="poi_x_new",type="decimal", precision=16, scale=14, nullable=true)
     */
    private $poiX;

    /**
     * @var float|null
     *
     * @ORM\Column(name="poi_y_new",type="decimal", precision=16, scale=14, nullable=true)
     */
    private $poiY;

    /**
     * @ORM\Column(name="user_id", type="integer")
     * 
     */
    private $userId;

     /**
     * @ORM\Column(name="resto_id", type="integer")
     * 
     */
    private $restoId;

    /**
     * @ORM\Column(name="status", type="integer")
     * 
     */
    private $status;

    public function getId(): ?int
    {
        return $this->id;
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

    
    /**
     * Get the value of userId
     */ 
    public function getUserId()
    {
        return $this->userId;
    }

    /**
     * Set the value of userId
     *
     * @return  self
     */ 
    public function setUserId($userId)
    {
        $this->userId = $userId;

        return $this;
    }

    /**
     * Get the value of restoId
     */ 
    public function getRestoId()
    {
        return $this->restoId;
    }

    /**
     * Set the value of restoId
     *
     * @return  self
     */ 
    public function setRestoId($restoId)
    {
        $this->restoId = $restoId;

        return $this;
    }

    /**
     * Get the value of status
     */ 
    public function getStatus()
    {
        return $this->status;
    }

    /**
     * Set the value of status
     *
     * @return  self
     */ 
    public function setStatus($status)
    {
        $this->status = $status;

        return $this;
    }
}
