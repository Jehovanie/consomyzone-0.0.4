<?php
namespace App\Manager;

use App\Entity\User;
use Scheb\TwoFactorBundle\Security\TwoFactor\Trusted\TrustedDeviceManagerInterface;
use Symfony\Component\HttpFoundation\Request;

class TrustedDeviceManagerCustom implements TrustedDeviceManagerInterface {

    public function canSetTrustedDevice(object $user, Request $request, string $firewallName):bool{
        
        
        if(boolval($user->getUse2fa())){
            return false; //use two-factor authentication
        }else{
            return true; //do not use two-factor authentication
        }
       
    }

    /**
     * Add a trusted device token for a user.
     */
    public function addTrustedDevice(object $user, string $firewallName): void{
        // dd($user);
    }

    /**
     * Validate a device device token for a user.
     */
    public function isTrustedDevice(object $user, string $firewallName): bool{

        
        if(boolval($user->getUse2fa())){
            return false; //use two-factor authentication
        }else{
            return true; //do not use two-factor authentication
        }

        
    }
}