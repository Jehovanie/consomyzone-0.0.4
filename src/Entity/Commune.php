<?php

namespace App\Entity;

use App\Repository\CommuneRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=CommuneRepository::class)
 * @ORM\Table(name="commune")
 */
class Commune
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(name="id", type="integer")
     */
    private $id;

    /**
     * @ORM\Column(name="commune", type="string", length=5)
     */
    private $commune;

    /**
     * @ORM\Column(name="code_insee", type="string", length=254)
     */
    private $codeInsee;

    /**
     * @ORM\Column(name="code_postal", type="string", length=5)
     */
    private $codePostal;

    /**
     * @ORM\Column(name="typecom", type="string", length=255)
     */
    private $typecom;

    /**
     * @ORM\Column(name="dep",type="string", length=254)
     */
    private $dep;


    /**
     * Get the value of id
     */ 
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set the value of id
     *
     * @return  self
     */ 
    public function setId($id)
    {
        $this->id = $id;

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

    /**
     * Get the value of codeInsee
     */ 
    public function getCodeInsee()
    {
        return $this->codeInsee;
    }

    /**
     * Set the value of codeInsee
     *
     * @return  self
     */ 
    public function setCodeInsee($codeInsee)
    {
        $this->codeInsee = $codeInsee;

        return $this;
    }

    /**
     * Get the value of codePostal
     */ 
    public function getCodePostal()
    {
        return $this->codePostal;
    }

    /**
     * Set the value of codePostal
     *
     * @return  self
     */ 
    public function setCodePostal($codePostal)
    {
        $this->codePostal = $codePostal;

        return $this;
    }

    /**
     * Get the value of typecom
     */ 
    public function getTypecom()
    {
        return $this->typecom;
    }

    /**
     * Set the value of typecom
     *
     * @return  self
     */ 
    public function setTypecom($typecom)
    {
        $this->typecom = $typecom;

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
