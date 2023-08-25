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
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $activiteSoumise;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $adresse;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $nom;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $dep;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $barTabac;

    /**
     * @ORM\Column(name="bureau_tabac",type="string", length=255, nullable=true)
     */
    private $bureauTabac;

    /**
     * @ORM\Column(name="cave_cigare", type="string", length=255, nullable=true)
     */
    private $caveCigare;

    /**
     * @ORM\Column(name="tabac_presse", type="string", length=255, nullable=true)
     */
    private $tabacPresse;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $services;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $telephone;

    /**
     * @ORM\Column(name="dep_name", type="string", length=255, nullable=true)
     */
    private $depName;

    /**
     * @ORM\Column(type="decimal", precision=16, scale=14, nullable=true)
     */
    private $latitude;

    /**
     * @ORM\Column(type="decimal", precision=16, scale=14, nullable=true)
     */
    private $longitude;

    /**
     * @ORM\Column(name="result_label", type="string", length=255, nullable=true)
     */
    private $resultLabel;

    /**
     * @ORM\Column(name="result_score", type="string", length=255, nullable=true)
     */
    private $resultScore;

    /**
     * @ORM\Column(name="result_score_next", type="string", length=255, nullable=true)
     */
    private $resultScoreNext;

    /**
     * @ORM\Column(name="result_type", type="string", length=255, nullable=true)
     */
    private $resultType;

    /**
     * @ORM\Column(name="result_id", type="integer", nullable=true)
     */
    private $resultId;

    /**
     * @ORM\Column(name="result_housenumber", type="string", length=255, nullable=true)
     */
    private $resultHousenumber;

    /**
     * @ORM\Column(name="result_name", type="string", length=255, nullable=true)
     */
    private $resultName;

    /**
     * @ORM\Column(name="result_street", type="string", length=255, nullable=true)
     */
    private $resultStreet;

    /**
     * @ORM\Column(name="result_postcode", type="string", length=255, nullable=true)
     */
    private $resultPostcode;

    /**
     * @ORM\Column(name="result_city", type="string", length=255, nullable=true)
     */
    private $resultCity;

    /**
     * @ORM\Column(name="result_context", type="string", length=255, nullable=true)
     */
    private $resultContext;

    /**
     * @ORM\Column(name="result_citycode", type="string", length=255, nullable=true)
     */
    private $resultCitycode;

    /**
     * @ORM\Column(name="result_oldcitycode", type="string", length=255, nullable=true)
     */
    private $resultOldcitycode;

    /**
     * @ORM\Column(name="result_oldcity", type="string", length=255, nullable=true)
     */
    private $resultOldcity;

    /**
     * @ORM\Column(name="result_district", type="string", length=255, nullable=true)
     */
    private $resultDistrict;

    /**
     * @ORM\Column(name="result_status", type="string", length=255, nullable=true)
     */
    private $resultStatus;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getActiviteSoumise(): ?string
    {
        return $this->activiteSoumise;
    }

    public function setActiviteSoumise(?string $activiteSoumise): self
    {
        $this->activiteSoumise = $activiteSoumise;

        return $this;
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

    public function getNom(): ?string
    {
        return $this->nom;
    }

    public function setNom(?string $nom): self
    {
        $this->nom = $nom;

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

    public function getBarTabac(): ?string
    {
        return $this->barTabac;
    }

    public function setBarTabac(?string $barTabac): self
    {
        $this->barTabac = $barTabac;

        return $this;
    }

    public function getBureauTabac(): ?string
    {
        return $this->bureauTabac;
    }

    public function setBureauTabac(?string $bureauTabac): self
    {
        $this->bureauTabac = $bureauTabac;

        return $this;
    }

    public function getCaveCigare(): ?string
    {
        return $this->caveCigare;
    }

    public function setCaveCigare(?string $caveCigare): self
    {
        $this->caveCigare = $caveCigare;

        return $this;
    }

    public function getTabacPresse(): ?string
    {
        return $this->tabacPresse;
    }

    public function setTabacPresse(?string $tabacPresse): self
    {
        $this->tabacPresse = $tabacPresse;

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

    public function getTelephone(): ?string
    {
        return $this->telephone;
    }

    public function setTelephone(?string $telephone): self
    {
        $this->telephone = $telephone;

        return $this;
    }

    public function getDepName(): ?string
    {
        return $this->depName;
    }

    public function setDepName(?string $depName): self
    {
        $this->depName = $depName;

        return $this;
    }

    public function getLatitude(): ?string
    {
        return $this->latitude;
    }

    public function setLatitude(?string $latitude): self
    {
        $this->latitude = $latitude;

        return $this;
    }

    public function getLongitude(): ?string
    {
        return $this->longitude;
    }

    public function setLongitude(?string $longitude): self
    {
        $this->longitude = $longitude;

        return $this;
    }

    public function getResultLabel(): ?string
    {
        return $this->resultLabel;
    }

    public function setResultLabel(?string $resultLabel): self
    {
        $this->resultLabel = $resultLabel;

        return $this;
    }

    public function getResultScore(): ?string
    {
        return $this->resultScore;
    }

    public function setResultScore(?string $resultScore): self
    {
        $this->resultScore = $resultScore;

        return $this;
    }

    public function getResultScoreNext(): ?string
    {
        return $this->resultScoreNext;
    }

    public function setResultScoreNext(?string $resultScoreNext): self
    {
        $this->resultScoreNext = $resultScoreNext;

        return $this;
    }

    public function getResultType(): ?string
    {
        return $this->resultType;
    }

    public function setResultType(?string $resultType): self
    {
        $this->resultType = $resultType;

        return $this;
    }

    public function getResultId(): ?int
    {
        return $this->resultId;
    }

    public function setResultId(?int $resultId): self
    {
        $this->resultId = $resultId;

        return $this;
    }

    public function getResultHousenumber(): ?string
    {
        return $this->resultHousenumber;
    }

    public function setResultHousenumber(?string $resultHousenumber): self
    {
        $this->resultHousenumber = $resultHousenumber;

        return $this;
    }

    public function getResultName(): ?string
    {
        return $this->resultName;
    }

    public function setResultName(?string $resultName): self
    {
        $this->resultName = $resultName;

        return $this;
    }

    public function getResultStreet(): ?string
    {
        return $this->resultStreet;
    }

    public function setResultStreet(?string $resultStreet): self
    {
        $this->resultStreet = $resultStreet;

        return $this;
    }

    public function getResultPostcode(): ?string
    {
        return $this->resultPostcode;
    }

    public function setResultPostcode(?string $resultPostcode): self
    {
        $this->resultPostcode = $resultPostcode;

        return $this;
    }

    public function getResultCity(): ?string
    {
        return $this->resultCity;
    }

    public function setResultCity(?string $resultCity): self
    {
        $this->resultCity = $resultCity;

        return $this;
    }

    public function getResultContext(): ?string
    {
        return $this->resultContext;
    }

    public function setResultContext(?string $resultContext): self
    {
        $this->resultContext = $resultContext;

        return $this;
    }

    public function getResultCitycode(): ?string
    {
        return $this->resultCitycode;
    }

    public function setResultCitycode(?string $resultCitycode): self
    {
        $this->resultCitycode = $resultCitycode;

        return $this;
    }

    public function getResultOldcitycode(): ?string
    {
        return $this->resultOldcitycode;
    }

    public function setResultOldcitycode(?string $resultOldcitycode): self
    {
        $this->resultOldcitycode = $resultOldcitycode;

        return $this;
    }

    public function getResultOldcity(): ?string
    {
        return $this->resultOldcity;
    }

    public function setResultOldcity(?string $resultOldcity): self
    {
        $this->resultOldcity = $resultOldcity;

        return $this;
    }

    public function getResultDistrict(): ?string
    {
        return $this->resultDistrict;
    }

    public function setResultDistrict(?string $resultDistrict): self
    {
        $this->resultDistrict = $resultDistrict;

        return $this;
    }

    public function getResultStatus(): ?string
    {
        return $this->resultStatus;
    }

    public function setResultStatus(?string $resultStatus): self
    {
        $this->resultStatus = $resultStatus;

        return $this;
    }
}
