<?php

namespace App\Entity;

use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

/**
 * FermeGeom
 *
 * @ORM\Table(name="ferme_geom")
 * @ORM\Entity(repositoryClass="App\Repository\FermeGeomRepository")
 */
class FermeGeom
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @var string|null
     *
     * @ORM\Column(name="activite", type="string", nullable=true)
     */
    private $activite;

    /**
     * @var string|null
     *
     * @ORM\Column(name="adresse_ferme", type="string", nullable=true)
     */
    private $adresseFerme;

    /**
     * @var string|null
     *
     * @ORM\Column(name="code_postal", type="string", nullable=true)
     */
    private $codePostal;

    /**
     * @var string|null
     *
     * @ORM\Column(name="departement", type="string", nullable=true)
     */
    private $departement;

    /**
     * @var string|null
     *
     * @ORM\Column(name="departement_name", type="string", nullable=true)
     */
    private $departementName;

    /**
     * @var string|null
     *
     * @ORM\Column(name="email", type="string", nullable=true)
     */
    private $email;

    /**
     * @var bool|null
     *
     * @ORM\Column(name="engagement_prod", type="boolean", nullable=true)
     */
    private $engagementProd;

    /**
     * @var string|null
     *
     * @ORM\Column(name="fax", type="string", nullable=true)
     */
    private $fax;

    /**
     * @var string|null
     *
     * @ORM\Column(name="genre", type="string", nullable=true)
     */
    private $genre;

    /**
     * @var string|null
     *
     * @ORM\Column(name="horaires_vente_a_ferme", type="string", nullable=true)
     */
    private $horairesVenteAFerme;

    /**
     * @var string|null
     *
     * @ORM\Column(name="horaires_vente_magasin_prod", type="string", nullable=true)
     */
    private $horairesVenteMagasinProd;

    /**
     * @var string|null
     *
     * @ORM\Column(name="horaires_vente_au_marche", type="string", nullable=true)
     */
    private $horairesVenteAuMarche;

    /**
     * @var bool|null
     *
     * @ORM\Column(name="acces_handicape", type="boolean", nullable=true)
     */
    private $accesHandicape;

    /**
     * @var bool|null
     *
     * @ORM\Column(name="acces_handicap_auditif", type="boolean", nullable=true)
     */
    private $accesHandicapAuditif;

    /**
     * @var bool|null
     *
     * @ORM\Column(name="acces_handicap_mental", type="boolean", nullable=true)
     */
    private $accesHandicapMental;

    /**
     * @var bool|null
     *
     * @ORM\Column(name="acces_handicap_motrice", type="boolean", nullable=true)
     */
    private $accesHandicapMotrice;

    /**
     * @var bool|null
     *
     * @ORM\Column(name="acces_handicap_visuel", type="boolean", nullable=true)
     */
    private $accesHandicapVisuel;

    /**
     * @var bool|null
     *
     * @ORM\Column(name="acces_voiture", type="boolean", nullable=true)
     */
    private $accesVoiture;

    /**
     * @var bool|null
     *
     * @ORM\Column(name="adherent_adeve", type="boolean", nullable=true)
     */
    private $adherentAdeve;

    /**
     * @var bool|null
     *
     * @ORM\Column(name="agriculture_bio", type="boolean", nullable=true)
     */
    private $agricultureBio;

    /**
     * @var bool|null
     *
     * @ORM\Column(name="animaux_autoriser", type="boolean", nullable=true)
     */
    private $animauxAutoriser;

    /**
     * @var bool|null
     *
     * @ORM\Column(name="atelier", type="boolean", nullable=true)
     */
    private $atelier;

    /**
     * @var bool|null
     *
     * @ORM\Column(name="carte_bancaire", type="boolean", nullable=true)
     */
    private $carteBancaire;

    /**
     * @var bool|null
     *
     * @ORM\Column(name="cheque_vacance", type="boolean", nullable=true)
     */
    private $chequeVacance;

    /**
     * @var bool|null
     *
     * @ORM\Column(name="degustation", type="boolean", nullable=true)
     */
    private $degustation;

    /**
     * @var bool|null
     *
     * @ORM\Column(name="marcher_produit", type="boolean", nullable=true)
     */
    private $marcherProduit;

    /**
     * @var bool|null
     *
     * @ORM\Column(name="site_web", type="boolean", nullable=true)
     */
    private $siteWeb;

    /**
     * @var bool|null
     *
     * @ORM\Column(name="station_verte", type="boolean", nullable=true)
     */
    private $stationVerte;

    /**
     * @var bool|null
     *
     * @ORM\Column(name="tickets_restaurant", type="boolean", nullable=true)
     */
    private $ticketsRestaurant;

    /**
     * @var bool|null
     *
     * @ORM\Column(name="vente_en_ligne", type="boolean", nullable=true)
     */
    private $venteEnLigne;

    /**
     * @var float|null
     *
     * @ORM\Column(name="latitude", type="decimal", precision=16, scale=14, nullable=true)
     */
    private $latitude;

    /**
     * @var string|null
     *
     * @ORM\Column(name="lien_site_web", type="string", nullable=true)
     */
    private $lienSiteWeb;

    /**
     * @var float|null
     *
     * @ORM\Column(name="longitude", type="decimal", precision=16, scale=14, nullable=true)
     */
    private $longitude;

    /**
     * @var string|null
     *
     * @ORM\Column(name="mot_du_fermier", type="string", nullable=true)
     */
    private $motDuFermier;

    /**
     * @var string|null
     *
     * @ORM\Column(name="nom_ferme", type="string", nullable=true)
     */
    private $nomFerme;

    /**
     * @var string|null
     *
     * @ORM\Column(name="nom_proprietaire", type="string", nullable=true)
     */
    private $nomProprietaire;


    /**
     * @var string|null
     *
     * @ORM\Column(name="produit1", type="string", nullable=true)
     */
    private $produit1;

    /**
     * @var string|null
     *
     * @ORM\Column(name="produit2", type="string", nullable=true)
     */
    private $produit2;

    /**
     * @var string|null
     *
     * @ORM\Column(name="produit3", type="string", nullable=true)
     */
    private $produit3;

    /**
     * @var string|null
     *
     * @ORM\Column(name="produit4", type="string", nullable=true)
     */
    private $produit4;

    /**
     * @var string|null
     *
     * @ORM\Column(name="produit5", type="string", nullable=true)
     */
    private $produit5;

    /**
     * @var string|null
     *
     * @ORM\Column(name="produit6", type="string", nullable=true)
     */
    private $produit6;

    /**
     * @var string|null
     *
     * @ORM\Column(name="produit7", type="string", nullable=true)
     */
    private $produit7;

    /**
     * @var string|null
     *
     * @ORM\Column(name="produit8", type="string", nullable=true)
     */
    private $produit8;

    /**
     * @var string|null
     *
     * @ORM\Column(name="produit_ferme", type="string", nullable=true)
     */
    private $produitFerme;

    /**
     * @var string|null
     *
     * @ORM\Column(name="telephone_domicile", type="string", nullable=true)
     */
    private $telephoneDomicile;

    /**
     * @var string|null
     *
     * @ORM\Column(name="telephone_mobile", type="string", nullable=true)
     */
    private $telephoneMobile;

    /**
     * @var string|null
     *
     * @ORM\Column(name="telephone_travail", type="string", nullable=true)
     */
    private $telephoneTravail;

    /**
     * @var string|null
     *
     * @ORM\Column(name="ville", type="string", nullable=true)
     */
    private $ville;

    /**
     * 
     *
     * @ORM\Column(name="note", type="decimal", precision=3, scale=0, nullable=true)
     */
    private $note;

    /**
     * 
     *
     * @ORM\Column(name="addBy", type="integer",nullable=true)
     */
    private $addBy;


    /**
     * @ORM\Column(name="disabled", type="boolean",nullable=true)
     */
    private $disabled=0;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getActivite(): ?string
    {
        return $this->activite;
    }

    public function setActivite(?string $activite): self
    {
        $this->activite = $activite;

        return $this;
    }

    public function getAdresseFerme(): ?string
    {
        return $this->adresseFerme;
    }

    public function setAdresseFerme(?string $adresseFerme): self
    {
        $this->adresseFerme = $adresseFerme;

        return $this;
    }

    public function getCodePostal(): ?string
    {
        return $this->codePostal;
    }

    public function setCodePostal(?string $codePostal): self
    {
        $this->codePostal = $codePostal;

        return $this;
    }

    public function getDepartement(): ?string
    {
        return $this->departement;
    }

    public function setDepartement(?string $departement): self
    {
        $this->departement = $departement;

        return $this;
    }

    public function getDepartementName(): ?string
    {
        return $this->departementName;
    }

    public function setDepartementName(?string $departementName): self
    {
        $this->departementName = $departementName;

        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(?string $email): self
    {
        $this->email = $email;

        return $this;
    }

    public function isEngagementProd(): ?bool
    {
        return $this->engagementProd;
    }

    public function setEngagementProd(?bool $engagementProd): self
    {
        $this->engagementProd = $engagementProd;

        return $this;
    }

    public function getFax(): ?string
    {
        return $this->fax;
    }

    public function setFax(?string $fax): self
    {
        $this->fax = $fax;

        return $this;
    }

    public function getGenre(): ?string
    {
        return $this->genre;
    }

    public function setGenre(?string $genre): self
    {
        $this->genre = $genre;

        return $this;
    }

    public function getHorairesVenteAFerme(): ?string
    {
        return $this->horairesVenteAFerme;
    }

    public function setHorairesVenteAFerme(?string $horairesVenteAFerme): self
    {
        $this->horairesVenteAFerme = $horairesVenteAFerme;

        return $this;
    }

    public function getHorairesVenteMagasinProd(): ?string
    {
        return $this->horairesVenteMagasinProd;
    }

    public function setHorairesVenteMagasinProd(?string $horairesVenteMagasinProd): self
    {
        $this->horairesVenteMagasinProd = $horairesVenteMagasinProd;

        return $this;
    }

    public function getHorairesVenteAuMarche(): ?string
    {
        return $this->horairesVenteAuMarche;
    }

    public function setHorairesVenteAuMarche(?string $horairesVenteAuMarche): self
    {
        $this->horairesVenteAuMarche = $horairesVenteAuMarche;

        return $this;
    }

    public function isAccesHandicape(): ?bool
    {
        return $this->accesHandicape;
    }

    public function setAccesHandicape(?bool $accesHandicape): self
    {
        $this->accesHandicape = $accesHandicape;

        return $this;
    }

    public function isAccesHandicapAuditif(): ?bool
    {
        return $this->accesHandicapAuditif;
    }

    public function setAccesHandicapAuditif(?bool $accesHandicapAuditif): self
    {
        $this->accesHandicapAuditif = $accesHandicapAuditif;

        return $this;
    }

    public function isAccesHandicapMental(): ?bool
    {
        return $this->accesHandicapMental;
    }

    public function setAccesHandicapMental(?bool $accesHandicapMental): self
    {
        $this->accesHandicapMental = $accesHandicapMental;

        return $this;
    }

    public function isAccesHandicapMotrice(): ?bool
    {
        return $this->accesHandicapMotrice;
    }

    public function setAccesHandicapMotrice(?bool $accesHandicapMotrice): self
    {
        $this->accesHandicapMotrice = $accesHandicapMotrice;

        return $this;
    }

    public function isAccesHandicapVisuel(): ?bool
    {
        return $this->accesHandicapVisuel;
    }

    public function setAccesHandicapVisuel(?bool $accesHandicapVisuel): self
    {
        $this->accesHandicapVisuel = $accesHandicapVisuel;

        return $this;
    }

    public function isAccesVoiture(): ?bool
    {
        return $this->accesVoiture;
    }

    public function setAccesVoiture(?bool $accesVoiture): self
    {
        $this->accesVoiture = $accesVoiture;

        return $this;
    }

    public function isAdherentAdeve(): ?bool
    {
        return $this->adherentAdeve;
    }

    public function setAdherentAdeve(?bool $adherentAdeve): self
    {
        $this->adherentAdeve = $adherentAdeve;

        return $this;
    }

    public function isAgricultureBio(): ?bool
    {
        return $this->agricultureBio;
    }

    public function setAgricultureBio(?bool $agricultureBio): self
    {
        $this->agricultureBio = $agricultureBio;

        return $this;
    }

    public function isAnimauxAutoriser(): ?bool
    {
        return $this->animauxAutoriser;
    }

    public function setAnimauxAutoriser(?bool $animauxAutoriser): self
    {
        $this->animauxAutoriser = $animauxAutoriser;

        return $this;
    }

    public function isAtelier(): ?bool
    {
        return $this->atelier;
    }

    public function setAtelier(?bool $atelier): self
    {
        $this->atelier = $atelier;

        return $this;
    }

    public function isCarteBancaire(): ?bool
    {
        return $this->carteBancaire;
    }

    public function setCarteBancaire(?bool $carteBancaire): self
    {
        $this->carteBancaire = $carteBancaire;

        return $this;
    }

    public function isChequeVacance(): ?bool
    {
        return $this->chequeVacance;
    }

    public function setChequeVacance(?bool $chequeVacance): self
    {
        $this->chequeVacance = $chequeVacance;

        return $this;
    }

    public function isDegustation(): ?bool
    {
        return $this->degustation;
    }

    public function setDegustation(?bool $degustation): self
    {
        $this->degustation = $degustation;

        return $this;
    }

    public function isMarcherProduit(): ?bool
    {
        return $this->marcherProduit;
    }

    public function setMarcherProduit(?bool $marcherProduit): self
    {
        $this->marcherProduit = $marcherProduit;

        return $this;
    }

    public function isSiteWeb(): ?bool
    {
        return $this->siteWeb;
    }

    public function setSiteWeb(?bool $siteWeb): self
    {
        $this->siteWeb = $siteWeb;

        return $this;
    }

    public function isStationVerte(): ?bool
    {
        return $this->stationVerte;
    }

    public function setStationVerte(?bool $stationVerte): self
    {
        $this->stationVerte = $stationVerte;

        return $this;
    }

    public function isTicketsRestaurant(): ?bool
    {
        return $this->ticketsRestaurant;
    }

    public function setTicketsRestaurant(?bool $ticketsRestaurant): self
    {
        $this->ticketsRestaurant = $ticketsRestaurant;

        return $this;
    }

    public function isVenteEnLigne(): ?bool
    {
        return $this->venteEnLigne;
    }

    public function setVenteEnLigne(?bool $venteEnLigne): self
    {
        $this->venteEnLigne = $venteEnLigne;

        return $this;
    }

    public function getLatitude(): ?float
    {
        return $this->latitude;
    }

    public function setLatitude(?float $latitude): self
    {
        $this->latitude = $latitude;

        return $this;
    }

    public function getLienSiteWeb(): ?string
    {
        return $this->lienSiteWeb;
    }

    public function setLienSiteWeb(?string $lienSiteWeb): self
    {
        $this->lienSiteWeb = $lienSiteWeb;

        return $this;
    }

    public function getLongitude(): ?float
    {
        return $this->longitude;
    }

    public function setLongitude(?float $longitude): self
    {
        $this->longitude = $longitude;

        return $this;
    }

    public function getMotDuFermier(): ?string
    {
        return $this->motDuFermier;
    }

    public function setMotDuFermier(?string $motDuFermier): self
    {
        $this->motDuFermier = $motDuFermier;

        return $this;
    }

    public function getNomFerme(): ?string
    {
        return $this->nomFerme;
    }

    public function setNomFerme(?string $nomFerme): self
    {
        $this->nomFerme = $nomFerme;

        return $this;
    }

    public function getNomProprietaire(): ?string
    {
        return $this->nomProprietaire;
    }

    public function setNomProprietaire(?string $nomProprietaire): self
    {
        $this->nomProprietaire = $nomProprietaire;

        return $this;
    }

    public function getProduit1(): ?string
    {
        return $this->produit1;
    }

    public function setProduit1(?string $produit1): self
    {
        $this->produit1 = $produit1;

        return $this;
    }

    public function getProduit2(): ?string
    {
        return $this->produit2;
    }

    public function setProduit2(?string $produit2): self
    {
        $this->produit2 = $produit2;

        return $this;
    }

    public function getProduit3(): ?string
    {
        return $this->produit3;
    }

    public function setProduit3(?string $produit3): self
    {
        $this->produit3 = $produit3;

        return $this;
    }

    public function getProduit4(): ?string
    {
        return $this->produit4;
    }

    public function setProduit4(?string $produit4): self
    {
        $this->produit4 = $produit4;

        return $this;
    }

    public function getProduit5(): ?string
    {
        return $this->produit5;
    }

    public function setProduit5(?string $produit5): self
    {
        $this->produit5 = $produit5;

        return $this;
    }

    public function getProduit6(): ?string
    {
        return $this->produit6;
    }

    public function setProduit6(?string $produit6): self
    {
        $this->produit6 = $produit6;

        return $this;
    }

    public function getProduit7(): ?string
    {
        return $this->produit7;
    }

    public function setProduit7(?string $produit7): self
    {
        $this->produit7 = $produit7;

        return $this;
    }

    public function getProduit8(): ?string
    {
        return $this->produit8;
    }

    public function setProduit8(?string $produit8): self
    {
        $this->produit8 = $produit8;

        return $this;
    }

    public function getProduitFerme(): ?string
    {
        return $this->produitFerme;
    }

    public function setProduitFerme(?string $produitFerme): self
    {
        $this->produitFerme = $produitFerme;

        return $this;
    }

    public function getTelephoneDomicile(): ?string
    {
        return $this->telephoneDomicile;
    }

    public function setTelephoneDomicile(?string $telephoneDomicile): self
    {
        $this->telephoneDomicile = $telephoneDomicile;

        return $this;
    }

    public function getTelephoneMobile(): ?string
    {
        return $this->telephoneMobile;
    }

    public function setTelephoneMobile(?string $telephoneMobile): self
    {
        $this->telephoneMobile = $telephoneMobile;

        return $this;
    }

    public function getTelephoneTravail(): ?string
    {
        return $this->telephoneTravail;
    }

    public function setTelephoneTravail(?string $telephoneTravail): self
    {
        $this->telephoneTravail = $telephoneTravail;

        return $this;
    }

    public function getVille(): ?string
    {
        return $this->ville;
    }

    public function setVille(?string $ville): self
    {
        $this->ville = $ville;

        return $this;
    }



    /**
     * Get the value of note
     */ 
    public function getNote()
    {
        return $this->note;
    }

    /**
     * Set the value of note
     *
     * @return  self
     */ 
    public function setNote($note)
    {
        $this->note = $note;

        return $this;
    }

    /**
     * Get the value of addBy
     */ 
    public function getAddBy()
    {
        return $this->addBy;
    }

    /**
     * Set the value of addBy
     *
     * @return  self
     */ 
    public function setAddBy($addBy)
    {
        $this->addBy = $addBy;

        return $this;
    }

    /**
     * Get the value of disabled
     */ 
    public function getDisabled()
    {
        return $this->disabled;
    }

    /**
     * Set the value of disabled
     *
     * @return  self
     */ 
    public function setDisabled($disabled)
    {
        $this->disabled = $disabled;

        return $this;
    }

    public function isDisabled(): ?bool
    {
        return $this->disabled;
    }
}
