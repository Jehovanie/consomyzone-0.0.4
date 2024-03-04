<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * historique_abonnement
 *
 * @ORM\Table(name="historique_abonnement")
 * @ORM\Entity(repositoryClass="App\Repository\AbonnementHistoriqueRepository")
 */
class AbonnementHistorique
{

    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @var integer
     *
     * @ORM\Column(name="user_id", type="integer", nullable=true)
     */
    private $userId;


    /**
     * @var integer
     *
     * @ORM\Column(name="cotisation_cmz", type="integer", nullable=true)
     */
    private $cotisationCMZ;

    /**
     * @var integer
     *
     * @ORM\Column(name="cotisation_bleu", type="integer", nullable=true)
     */
    private $cotisationBleu;

    /**
     * @var integer
     *
     * @ORM\Column(name="cotisation_vert", type="integer", nullable=true)
     */
    private $cotisationVert;

    /**
     * @var integer
     *
     * @ORM\Column(name="cotisation_tribu", type="integer", nullable=true)
     */
    private $cotisationTribu;

    /**
     * @var integer
     *
     * @ORM\Column(name="participation_suplementaire", type="integer", nullable=true)
     */
    private $participationSuplementaire;

    /**
     * @var datetime
     *
     * @ORM\Column(name="date_cotisation_cmz", type="datetime", nullable=true)
     */
    private $dateCotisationCmz;

    /**
     * @var datetime
     *
     * @ORM\Column(name="date_cotisation_bleu", type="datetime", nullable=true)
     */
    private $dateCotisationBleu;

    /**
     * @var datetime
     *
     * @ORM\Column(name="date_cotisation_vert", type="datetime", nullable=true)
     */
    private $dateCotisationVert;

    /**
     * @var datetime
     *
     * @ORM\Column(name="date_cotisation_tribu", type="datetime", nullable=true)
     */
    private $dateCotisationTribu;

    /**
     * @var datetime
     *
     * @ORM\Column(name="date_supplementaire", type="datetime", nullable=true)
     */
    private $dateSupplementaire;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUserId(): ?int
    {
        return $this->userId;
    }

    public function setUserId(int $userId): static
    {
        $this->userId = $userId;

        return $this;
    }

    public function getCotisationCMZ(): ?int
    {
        return $this->cotisationCMZ;
    }

    public function setCotisationCMZ(int $cotisationCMZ): static
    {
        $this->cotisationCMZ = $cotisationCMZ;

        return $this;
    }

    public function getCotisationBleu(): ?int
    {
        return $this->cotisationBleu;
    }

    public function setCotisationBleu(?int $cotisationBleu): static
    {
        $this->cotisationBleu = $cotisationBleu;

        return $this;
    }

    public function getCotisationVert(): ?int
    {
        return $this->cotisationVert;
    }

    public function setCotisationVert(?int $cotisationVert): static
    {
        $this->cotisationVert = $cotisationVert;

        return $this;
    }

    public function getCotisationTribu(): ?int
    {
        return $this->cotisationTribu;
    }

    public function setCotisationTribu(?int $cotisationTribu): static
    {
        $this->cotisationTribu = $cotisationTribu;

        return $this;
    }

    public function getParticipationSuplementaire(): ?int
    {
        return $this->participationSuplementaire;
    }

    public function setParticipationSuplementaire(?int $participationSuplementaire): static
    {
        $this->participationSuplementaire = $participationSuplementaire;

        return $this;
    }

    public function getDateCotisationCMZ(): ?\DateTimeInterface
    {
        return $this->dateCotisationCmz;
    }

    public function setDateCotisationCMZ(\DateTimeInterface $dateCotisationCMZ): static
    {
        $this->dateCotisationCmz = $dateCotisationCMZ;

        return $this;
    }

    public function getDateCotisationBleu(): ?\DateTimeInterface
    {
        return $this->dateCotisationBleu;
    }

    public function setDateCotisationBleu(?\DateTimeInterface $dateCotisationBleu): static
    {
        $this->dateCotisationBleu = $dateCotisationBleu;

        return $this;
    }

    public function getDateCotisationVert(): ?\DateTimeInterface
    {
        return $this->dateCotisationVert;
    }

    public function setDateCotisationVert(?\DateTimeInterface $dateCotisationVert): static
    {
        $this->dateCotisationVert = $dateCotisationVert;

        return $this;
    }

    public function getDateCotisationTribu(): ?\DateTimeInterface
    {
        return $this->dateCotisationTribu;
    }

    public function setDateCotisationTribu(\DateTimeInterface $dateCotisationTribu): static
    {
        $this->dateCotisationTribu = $dateCotisationTribu;

        return $this;
    }

    public function getDateSupplementaire(): ?\DateTimeInterface
    {
        return $this->dateSupplementaire;
    }

    public function setDateSupplementaire(?\DateTimeInterface $dateSupplementaire): static
    {
        $this->dateSupplementaire = $dateSupplementaire;

        return $this;
    }
}
