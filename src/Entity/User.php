<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\ORM\Mapping as ORM;
use Scheb\TwoFactorBundle\Model\Email\TwoFactorInterface;
use Scheb\TwoFactorBundle\Model\TrustedDeviceInterface;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Validator\Constraints as Assert;


/**
 * @ORM\Entity(repositoryClass=UserRepository::class)
 * @ORM\Table(name="`user`")
 */
class User implements UserInterface, PasswordAuthenticatedUserInterface,TwoFactorInterface,TrustedDeviceInterface
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @var string
     *@Assert\NotBlank(payload={"error_code"="INVALID_EMAIL"})
     * @ORM\Column(name="email", type="string", length=180, nullable=false)
     */
    private $email;

    
    /**
     * @var string The hashed password
     * @ORM\Column(name="password", type="string")
     */
    private $password;

    /**
     * @var array
     *
     * @ORM\Column(name="roles", type="json", nullable=false)
     */
    private $roles;

    /**
     * @var bool
     *
     * @ORM\Column(name="verified_mail", type="boolean", nullable=false)
     */
    private $verifiedMail;

    /**
     * @var bool
     *
     * @ORM\Column(name="isLabled", type="boolean", nullable=false)
     */
    private $isLabled;

    /**
     * @var string
     *
     * @ORM\Column(name="type", type="string", length=100, nullable=false)
     */
    private $type;

    /**
     * @var string
     *
     * @ORM\Column(name="tablemessage", type="string", length=200, nullable=false)
     */
    private $tablemessage;

     /**
     * @var string
     *
     * @ORM\Column(name="tablenotification", type="string", length=200, nullable=false)
     */
    private $tablenotification;

    /**
     * @var string
     *
     * @ORM\Column(name="tablerequesting", type="string", length=200, nullable=false)
     */
    private $tablerequesting;

    /**
     * @var string
     *
     * @ORM\Column(name="pseudo", type="string", length=200, nullable=false)
     */
    private $pseudo;

    /**
     * @var string
     *
     * @ORM\Column(name="email_temp", type="string", length=200, nullable=true)
     */
    private $email_temp;

    /**
     * @var string
     *
     * @ORM\Column(name="tribu_t_owned", type="string", length=200, nullable=true)
     */
    private $tribuT;

    /**
     * @var string
     *
     * @ORM\Column(name="tribu_t_joined", type="string", length=200, nullable=true)
     */
    private $tribuTJoined;

    /**
     * @var string
     *
     * @ORM\Column(name="nom_table_agenda", type="string", length=200, nullable=true)
     */
    private $nomTableAgenda;

    /**
     * @var string
     *
     * @ORM\Column(name="nom_table_partage_agenda", type="string", length=200, nullable=true)
     */
    private $nomTablePartageAgenda;


    /**
     * @var bool
     *
     * @ORM\Column(name="is_connected", type="boolean", nullable=false)
     */
    private $isConnected;

    /**
     * @var bool
     *
     * @ORM\Column(name="status_demande_partenariat", nullable=false)
     */
    private $statusDemandePartenariat = 0;

    /**
     * @var bool
     *
     * @ORM\Column(name="idle", type="integer", nullable=false)
     */
    private $idle;

/**
     * @ORM\Column(type="string", nullable=true)
     */
    private ?string $authCode="";


     /**
     * @ORM\Column(type="integer")
     */
    private int $trustedVersion;


    /**
     * @ORM\Column( name="use_2fa",type="integer")
     */
    private int $use2fa;

    /**
     * @ORM\Column( name="use_2fa_email", type="integer")
     */
    private int $use2FaEmail;

    // [...]

    /** Add by Elie */
    public function setTrustedVersion(string $trustedVersion): void
    {
        $this->trustedVersion = $trustedVersion;
    }
    /** End Elie */

    public function getTrustedTokenVersion(): int
    {
        return $this->trustedVersion;
    }

    // [...]

    public function isEmailAuthEnabled(): bool
    {
        return true; // This can be a persisted field to switch email code authentication on/off
    }

    public function getEmailAuthRecipient(): string
    {
        return $this->email;
    }

    public function getEmailAuthCode(): string
    {
        if (null === $this->authCode) {
            throw new \LogicException('The email authentication code was not set');
        }

        return $this->authCode;
    }

    public function setEmailAuthCode(string $authCode): void
    {
        $this->authCode = $authCode;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    public function getPseudo(): ?string
    {
        return $this->pseudo;
    }

    public function setPseudo(string $pseudo): self
    {
        $this->pseudo = $pseudo;

        return $this;
    }
  
    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }

    /**
     * @deprecated since Symfony 5.3, use getUserIdentifier instead
     */
    public function getUsername(): string
    {
        return (string) $this->email;
    }


    /**
     * Returning a salt is only needed, if you are not using a modern
     * hashing algorithm (e.g. bcrypt or sodium) in your security.yaml.
     *
     * @see UserInterface
     */
    public function getSalt(): ?string
    {
        return null;
    }

    
    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    public function setRoles(array $roles): self
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see PasswordAuthenticatedUserInterface
     */
    public function getPassword(): string
    {
        return $this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;

        return $this;
    }


    /**
     * @see UserInterface
     */
    public function eraseCredentials()
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }

    public function isVerifiedMail(): ?bool
    {
        return $this->verifiedMail;
    }

    public function setVerifiedMail(bool $verifiedMail): self
    {
        $this->verifiedMail = $verifiedMail;

        return $this;
    }

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(string $type): self
    {
        $this->type = $type;

        return $this;
    }

    public function getTablemessage(): ?string
    {
        return $this->tablemessage;
    }

    public function setTablenotification(string $tablenotification): self
    {
        $this->tablenotification = $tablenotification;

        return $this;
    }

    
    public function getTablenotification(): ?string
    {
        return $this->tablenotification;
    }

    public function setTablemessage(string $tablemessage): self
    {
        $this->tablemessage = $tablemessage;

        return $this;
    }




    public function getEmailTemp(): ?string
    {
        return $this->email_temp;
    }

    public function setEmailTemp(string $temp): self
    {
        $this->email_temp = $temp;

        return $this;
    }


    /**
     * Get the value of tribuT
     *
     * @return  string
     */ 
    public function getTribuT()
    {
        return $this->tribuT;
    }

    /**
     * Set the value of tribuT
     *
     * @param  string  $tribuT
     *
     * @return  self
     */ 
    public function setTribuT(string $tribuT)
    {
        $this->tribuT = $tribuT;
    }

    
    /**
     * Get the value of isLabled
     *
     * @return  bool
     */ 
    public function getIsLabled()
    {
        return $this->isLabled;
    }

    /**
     * Set the value of isLabled
     *
     * @param  bool  $isLabled
     *
     * @return  self
     */ 
    public function setIsLabled(bool $isLabled)
    {
        $this->isLabled = $isLabled;

        return $this;
    }

    /**
     * Get the value of tablerequesting
     *
     * @return  string
     */ 
    public function getTablerequesting()
    {
        return $this->tablerequesting;
    }

    /**
     * Set the value of tablerequesting
     *
     * @param  string  $tablerequesting
     *
     * @return  self
     */ 
    public function setTablerequesting(string $tablerequesting)
    {
        $this->tablerequesting = $tablerequesting;

        return $this;
    }

    public function isIsLabled(): ?bool
    {
        return $this->isLabled;
    }

    /**
     * Get the value of tribuTJoined
     *
     * @return  string
     */ 
    public function getTribuTJoined()
    {
        return $this->tribuTJoined;
    }

    /**
     * Set the value of tribuTJoined
     *
     * @param  string  $tribuTJoined
     *
     * @return  self
     */ 
    public function setTribuTJoined(string $tribuTJoined)
    {
        $this->tribuTJoined = $tribuTJoined;

        return $this;
    }

    /**
     * Get the value of nomTableAgenda
     *
     * @return  string
     */ 
    public function getNomTableAgenda()
    {
        return $this->nomTableAgenda;
    }

    /**
     * Set the value of nomTableAgenda
     *
     * @param  string  $nomTableAgenda
     *
     * @return  self
     */ 
    public function setNomTableAgenda(string $nomTableAgenda)
    {
        $this->nomTableAgenda = $nomTableAgenda;

        return $this;
    }

    /**
     * Get the value of nomTablePartageAgenda
     *
     * @return  string
     */ 
    public function getNomTablePartageAgenda()
    {
        return $this->nomTablePartageAgenda;
    }

    /**
     * Set the value of nomTablePartageAgenda
     *
     * @param  string  $nomTablePartageAgenda
     *
     * @return  self
     */ 
    public function setNomTablePartageAgenda(string $nomTablePartageAgenda)
    {
        $this->nomTablePartageAgenda = $nomTablePartageAgenda;

        return $this;
    }


    /**
     * Get the value of isActive
     *
     * @return  bool
     */ 
    public function getIsConnected()
    {
        return $this->isConnected;
    }

    /**
     * Set the value of isActive
     *
     * @param  bool  $isActive
     *
     * @return  self
     */ 
    public function setIsConnected($isConnected)
    {
        $this->isConnected = $isConnected;

        return $this;
    }


    public function getStatusDemandePartenariat()
    {
        return $this->statusDemandePartenariat;
    }

    public function setStatusDemandePartenariat($statusDemandePartenariat)
    {
        $this->statusDemandePartenariat = $statusDemandePartenariat;

        return $this;
    }

    /**
     * Get the value of idle
     *
     * 
     */ 
    public function getIdle()
    {
        return $this->idle;
    }

    /**
     * Set the value of idle
     *
     * 
     *
     * @return  self
     */ 
    public function setIdle($idle)
    {
        $this->idle = $idle;

        return $this;
    }

    /**
     * Get the value of use2fa
     */ 
    public function getUse2fa()
    {
        return $this->use2fa;
    }

    /**
     * Set the value of use2fa
     *
     * @return  self
     */ 
    public function setUse2fa($use2fa)
    {
        $this->use2fa = $use2fa;

        return $this;
    }

    /**
     * Get the value of use2FaEmail
     */ 
    public function getUse2FaEmail()
    {
        return $this->use2FaEmail;
    }

    /**
     * Set the value of use2FaEmail
     *
     * @return  self
     */ 
    public function setUse2FaEmail($use2FaEmail)
    {
        $this->use2FaEmail = $use2FaEmail;

        return $this;
    }
}
