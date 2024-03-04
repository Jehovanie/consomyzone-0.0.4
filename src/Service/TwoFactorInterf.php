<?php 
namespace App\Service;

use App\Entity\User;
use Scheb\TwoFactorBundle\Model\Email\TwoFactorInterface;

class TwoFactorInterf implements TwoFactorInterface{

    
    private $user;
    
    public function __construct(User $user)
    {
        $this->user = $user;
    }
    
    /**
     * Return true if the user should do two-factor authentication.
     */
    public function isEmailAuthEnabled(): bool{

        return true;
    }

    /**
     * Return user email address.
     */
    public function getEmailAuthRecipient(): string{

       
        return $this->user->getEmail();
    }

    /**
     * Return the authentication code.
     */
    public function getEmailAuthCode(): ?string{

        if (null === $this->user->getEmailAuthCode()) {
            throw new \LogicException('The email authentication code was not set');
        }

        return $this->user->getEmailAuthCode();
    }

    /**
     * Set the authentication code.
     */
    public function setEmailAuthCode(string $authCode): void{
       
    }

    public function getUse2FaEmail(): ?string{
        return $this->user->getEmail();
    }
}