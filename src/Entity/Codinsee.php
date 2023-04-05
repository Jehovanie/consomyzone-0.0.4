<?php
namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
/**
 * 
 *
 * @ORM\Table(name="codinsee")
 * @ORM\Entity(repositoryClass="App\Repository\CodeinseeRepository")
 */
class Codinsee{

    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(name="departement", type="string",length=250, nullable=false)
     */
    private $departement;

    /**
     * @var string
     *
     * @ORM\Column(name="codinsee", type="string",length=250, nullable=false)
     */
    private $codinsee;

    /**
     * @var string
     *
     * @ORM\Column(name="arrondissement", type="string",length=250, nullable=false)
     */
    private $arrondissement;

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
     * Get the value of departement
     *
     * @return  string
     */ 
    public function getDepartement()
    {
        return $this->departement;
    }

    /**
     * Set the value of departement
     *
     * @param  string  $departement
     *
     * @return  self
     */ 
    public function setDepartement(string $departement)
    {
        $this->departement = $departement;

        return $this;
    }

    /**
     * Get the value of codinsee
     *
     * @return  string
     */ 
    public function getCodinsee()
    {
        return $this->codinsee;
    }

    /**
     * Set the value of codinsee
     *
     * @param  string  $codinsee
     *
     * @return  self
     */ 
    public function setCodinsee(string $codinsee)
    {
        $this->codinsee = $codinsee;

        return $this;
    }

    /**
     * Get the value of arrondissement
     *
     * @return  string
     */ 
    public function getArrondissement()
    {
        return $this->arrondissement;
    }

    /**
     * Set the value of arrondissement
     *
     * @param  string  $arrondissement
     *
     * @return  self
     */ 
    public function setArrondissement(string $arrondissement)
    {
        $this->arrondissement = $arrondissement;

        return $this;
    }
}