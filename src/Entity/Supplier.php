<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Supplier
 *
 * @ORM\Table(name="supplier", indexes={@ORM\Index(name="IDX_9B2A6C7EA76ED395", columns={"user_id"})})
 * @ORM\Entity(repositoryClass="App\Repository\SupplierRepository")
 */
class Supplier
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(name="firstname", type="string", length=300, nullable=false)
     */
    private $firstname;

    /**
     * @var string
     *
     * @ORM\Column(name="lastname", type="string", length=300, nullable=false)
     */
    private $lastname;


    /**
     * @var string
     *
     * @ORM\Column(name="num_rue", type="string", length=300, nullable=false)
     */
    private $numRue;

    /**
     * @var string
     *
     * @ORM\Column(name="telephone", type="string", length=100, nullable=false)
     */
    private $telephone;

    /**
     * @var string|null
     *
     * @ORM\Column(name="code_postal", type="string", length=255,  nullable=false)
     */
    private $codePostal;

    /**
     * @var string|null
     *
     * @ORM\Column(name="pays", type="string", length=255,  nullable=false)
     */
    private $pays;
    
    /**
     * 
     * @ORM\Column(name="quartier", type="string", length=255, nullable=false)
     */
    private $quartier;

    /**
     * @var string|null
     *
     * @ORM\Column(name="tel_fixe", type="string", length=100, nullable=true)
     */
    private $telFixe;

    /**
     * @var string|null
     *
     * @ORM\Column(name="commerce", type="string", length=200, nullable=true)
     */
    private $commerce;

    /**
     * @var string|null
     *
     * @ORM\Column(name="codeape", type="string", length=200, nullable=true)
     */
    private $codeape;

    /**
     * @var string|null
     *
     * @ORM\Column(name="website", type="string", length=200, nullable=true)
     */
    private $website;

    /**
     * @var string|null
     *
     * @ORM\Column(name="facebook", type="string", length=200, nullable=true)
     */
    private $facebook;

    /**
     * @var string|null
     *
     * @ORM\Column(name="twitter", type="string", length=200, nullable=true)
     */
    private $twitter;

    /**
     * @var string|null
     *
     * @ORM\Column(name="photo_profil", type="string", length=300, nullable=true)
     */
    private $photoProfil;

    /**
     * @var string|null
     *
     * @ORM\Column(name="photo_couverture", type="string", length=300, nullable=true)
     */
    private $photoCouverture;

    /**
     *
     * @ORM\ManyToOne(targetEntity="User")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="user_id", referencedColumnName="id")
     * })
     */
    private $userId;

   
    /**
     *
     * @ORM\Column(name="tributg", type="string", length=255, nullable=false)
     */
    private $tributG;

    /**
     *
     * @ORM\Column(name="commune", type="string", length=255,  nullable=false)
     */
    private $commune;

     /**
     * @var bool
     *
     * @ORM\Column(name="is_verified_tribuG_admin", type="boolean", nullable=false)
     */
    private $isVerifiedTributGAdmin=false;

    /**
     *
     * @ORM\Column(name="nomCommerce", type="string", length=255,  nullable=true)
     */
    private $nomCommerce;

    /**
     *
     * @ORM\Column(name="emailPro", type="string", length=255,  nullable=true)
     */
    private $emailPro;

    /**
     *
     * @ORM\Column(name="linkedin", type="string", length=255,  nullable=true)
     */
    private $linkedin;

    /**
     *
     * @ORM\Column(name="siret", type="string", length=20,  nullable=true)
     */
    private $siret;

    /**
     *
     * @ORM\Column(name="siren", type="string", length=20,  nullable=true)
     */
    private $siren;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getFirstname(): ?string
    {
        return $this->firstname;
    }

    public function setFirstname(string $firstname): self
    {
        $this->firstname = $firstname;

        return $this;
    }

    public function getLastname(): ?string
    {
        return $this->lastname;
    }

    public function setLastname(string $lastname): self
    {
        $this->lastname = $lastname;

        return $this;
    }

    public function getNumRue(): ?string
    {
        return $this->numRue;
    }

    public function setNumRue(string $numRue): self
    {
        $this->numRue = $numRue;

        return $this;
    }

    public function getTelephone(): ?string
    {
        return $this->telephone;
    }

    public function setTelephone(string $telephone): self
    {
        $this->telephone = $telephone;

        return $this;
    }

    public function getTelFixe(): ?string
    {
        return $this->telFixe;
    }

    public function setTelFixe(?string $telFixe): self
    {
        $this->telFixe = $telFixe;

        return $this;
    }

    public function getCommerce(): ?string
    {
        return $this->commerce;
    }

    public function setCommerce(?string $commerce): self
    {
        $this->commerce = $commerce;

        return $this;
    }

    public function getCodeape(): ?string
    {
        return $this->codeape;
    }

    public function setCodeape(?string $codeape): self
    {
        $this->codeape = $codeape;

        return $this;
    }

    public function getWebsite(): ?string
    {
        return $this->website;
    }

    public function setWebsite(?string $website): self
    {
        $this->website = $website;

        return $this;
    }

    public function getFacebook(): ?string
    {
        return $this->facebook;
    }

    public function setFacebook(?string $facebook): self
    {
        $this->facebook = $facebook;

        return $this;
    }

    public function getTwitter(): ?string
    {
        return $this->twitter;
    }

    public function setTwitter(?string $twitter): self
    {
        $this->twitter = $twitter;

        return $this;
    }

    public function getPhotoProfil(): ?string
    {
        return $this->photoProfil;
    }

    public function setPhotoProfil(?string $photoProfil): self
    {
        $this->photoProfil = $photoProfil;

        return $this;
    }

    public function getPhotoCouverture(): ?string
    {
        return $this->photoCouverture;
    }

    public function setPhotoCouverture(?string $photoCouverture): self
    {
        $this->photoCouverture = $photoCouverture;

        return $this;
    }

    public function getUserId(): ?User
    {
        return $this->userId;
    }

    public function setUserId(?User $user): self
    {
        $this->userId = $user;

        return $this;
    }


    public function getTributG()
    {
        return $this->tributG;
    }

    public function setTributG($tributG)
    {
        $this->tributG = $tributG;
    }


    /**
     * Get the value of codePostal
     *
     * @return  string|null
     */ 
    public function getCodePostal()
    {
        return $this->codePostal;
    }

    /**
     * Set the value of codePostal
     *
     * @param  string|null  $codePostal
     *
     * @return  self
     */ 
    public function setCodePostal($codePostal)
    {
        $this->codePostal = $codePostal;

        return $this;
    }

    /**
     * Get the value of pays
     *
     * @return  string|null
     */ 
    public function getPays()
    {
        return $this->pays;
    }

    /**
     * Set the value of pays
     *
     * @param  string|null  $pays
     *
     * @return  self
     */ 
    public function setPays($pays)
    {
        $this->pays = $pays;

        return $this;
    }

    
    public function getIsVerifiedTributGAdmin()
    {
        return $this->isVerifiedTributGAdmin;
    }

    public function setIsVerifiedTributGAdmin(bool $isVerifiedTributGAdmin)
    {
        $this->isVerifiedTributGAdmin = $isVerifiedTributGAdmin;

        return $this;
    }

    /**
     * Get the value of commune
     */ 
    public function getCommune()
    {
        return $this->commune;
    }

    /**
     * Set the value of commune
     *
     * @return  self
     */ 
    public function setCommune($commune)
    {
        $this->commune = $commune;

        return $this;
    }

    public function isIsVerifiedTributGAdmin(): ?bool
    {
        return $this->isVerifiedTributGAdmin;
    }

    /**
     * Get the value of quartier
     */ 
    public function getQuartier()
    {
        return $this->quartier;
    }

    /**
     * Set the value of quartier
     *
     * @return  self
     */ 
    public function setQuartier($quartier)
    {
        $this->quartier = $quartier;

        return $this;
    }

    /**
     * Get the value of nomCommerce
     */ 
    public function getNomCommerce()
    {
        return $this->nomCommerce;
    }

    /**
     * Set the value of nomCommerce
     *
     * @return  self
     */ 
    public function setNomCommerce($nomCommerce)
    {
        $this->nomCommerce = $nomCommerce;

        return $this;
    }

    /**
     * Get the value of emailPro
     */ 
    public function getEmailPro()
    {
        return $this->emailPro;
    }

    /**
     * Set the value of emailPro
     *
     * @return  self
     */ 
    public function setEmailPro($emailPro)
    {
        $this->emailPro = $emailPro;

        return $this;
    }

    /**
     * Get the value of linkedin
     */ 
    public function getLinkedin()
    {
        return $this->linkedin;
    }

    /**
     * Set the value of linkedin
     *
     * @return  self
     */ 
    public function setLinkedin($linkedin)
    {
        $this->linkedin = $linkedin;

        return $this;
    }

    /**
     * Get the value of siret
     */ 
    public function getSiret()
    {
        return $this->siret;
    }

    /**
     * Set the value of siret
     *
     * @return  self
     */ 
    public function setSiret($siret)
    {
        $this->siret = $siret;

        return $this;
    }

    /**
     * Get the value of siren
     */ 
    public function getSiren()
    {
        return $this->siren;
    }

    /**
     * Set the value of siren
     *
     * @return  self
     */ 
    public function setSiren($siren)
    {
        $this->siren = $siren;

        return $this;
    }
}
