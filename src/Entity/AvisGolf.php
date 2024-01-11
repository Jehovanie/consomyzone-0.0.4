<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Table(name="avisgolf")
 * @ORM\Entity(repositoryClass="App\Repository\AvisGolfRepository")
 */
class AvisGolf
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
     * @ORM\Column(name="avis", type="text", nullable=false)
     */
    private $avis;

    /**
     * @var float
     *
     * @ORM\Column(name="note", nullable=false)
     */
    private $note;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="date_avis", type="datetime", nullable=false, options={"default"="CURRENT_TIMESTAMP"})
     */
    private $datetime = 'CURRENT_TIMESTAMP';

    /**
     *
     * @ORM\ManyToOne(targetEntity="User")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="id_user", referencedColumnName="id")
     * })
     */
    private $user;

    /**
     * @var \GolfFrance
     *
     * @ORM\ManyToOne(targetEntity="GolfFrance")
     * @ORM\JoinColumns({
     *  @ORM\JoinColumn(name="id_golf", referencedColumnName="id")
     * })
     */
    private $golf;

    /**
     * @var string
     *
     * @ORM\Column(name="type", type="text", nullable=false)
     */
    private $type;

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
     * Get the value of avis
     *
     * @return  string
     */
    public function getAvis()
    {
        return $this->avis;
    }

    /**
     * Set the value of avis
     *
     * @param  string  $avis
     *
     * @return  self
     */
    public function setAvis(string $avis)
    {
        $this->avis = $avis;

        return $this;
    }

    /**
     * Get the value of note
     *
     * @return  float
     */
    public function getNote()
    {
        return $this->note;
    }

    /**
     * Set the value of note
     *
     * @param  float  $note
     *
     * @return  self
     */
    public function setNote(float $note)
    {
        $this->note = $note;

        return $this;
    }

    /**
     * Get the value of datetime
     *
     * @return  \DateTime
     */
    public function getDatetime()
    {
        return $this->datetime;
    }

    /**
     * Set the value of datetime
     *
     * @param  \DateTime  $datetime
     *
     * @return  self
     */
    public function setDatetime(\DateTimeInterface $datetime)
    {
        $this->datetime = $datetime;

        return $this;
    }

    /**
     * Get the value of user
     */
    public function getUser()
    {
        return $this->user;
    }

    /**
     * Set the value of user
     *
     * @return  self
     */
    public function setUser($user)
    {
        $this->user = $user;

        return $this;
    }

    /**
     * Get the value of golf
     *
     * @return  \GolfFrance
     */
    public function getGolf()
    {
        return $this->golf;
    }

    /**
     * Set the value of golf
     *
     * @param  \GolfFrance  $golf
     *
     * @return  self
     */
    public function setGolf(GolfFrance $golf)
    {
        $this->golf = $golf;

        return $this;
    }
    /**
     * Get the value of type
     *
     * @return  string
     */
    public function getType()
    {
        return $this->type;
    }

    /**
     * Set the value of type
     *
     * @param  string  $type
     *
     * @return  self
     */
    public function setType(string $type)
    {
        $this->type = $type;

        return $this;
    }
}
