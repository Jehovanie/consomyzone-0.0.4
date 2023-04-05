<?php

namespace App\Entity;

use App\Entity\User;
use Doctrine\ORM\Mapping as ORM;

/**
 * Consumer
 *
 * @ORM\Table(name="consumer", indexes={@ORM\Index(name="IDX_705B3727A76ED395", columns={"user_id"})})
 * @ORM\Entity(repositoryClass="App\Repository\ConsumerRepository")
 */
class Consumer
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
     * @ORM\Column(name="tel_fixe", type="string", length=100, nullable=true)
     */
    private $telFixe;

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
     *
     * @ORM\ManyToOne(targetEntity=User::class)
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="user_id", referencedColumnName="id")
     * })
     */
    private $userId;

    
    /**
     *
     * @ORM\Column(name="tributg", type="string", length=255,  nullable=false)
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
    private $isVerifiedTributGAdmin;


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

    public function setPhotoCouverture(string $photoCouverture): self
    {
        $this->photoCouverture = $photoCouverture;

        return $this;
    }

    public function getCodePostal(): ?string
    {
        return $this->codePostal;
    }

    public function setCodePostal(string $codePostal): self
    {
        $this->codePostal = $codePostal;

        return $this;
    }

    public function getPays(): ?string
    {
        return $this->pays;
    }

    public function setPays(string $pays): self
    {
        $this->pays = $pays;

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

    public function setTributG($tributG): self
    {
        $this->tributG = $tributG;

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
}