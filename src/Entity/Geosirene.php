<?php

namespace App\Entity;


use Doctrine\ORM\Mapping as ORM;

/**
 * Codinsee
 *
 * @ORM\Table(name="geosirene")
 * 
 * @ORM\Entity(repositoryClass= "App\Repository\GeosireneRepository")
 */
class Geosirene{
	

  public function __construct(){
  
  }
  
  /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     * @ORM\SequenceGenerator(sequenceName="codinsee_id_seq", allocationSize=1, initialValue=1)
     */
    private $id;
	
	
	/**
     * @var string|null
     *
     * @ORM\Column(name="siren", type="string", nullable=true)
     */
	private $siren;
			
	/**     
     * @var string|null
     *      
     * @ORM\Column(name="nic", type="string", nullable=true)
     */     
	private $nic;
	
	/**
     * @var string|null
     *
     * @ORM\Column(name="siret", type="string", nullable=true)
     */
	private $siret;
	
	/**
     * @var string|null
     *
     * @ORM\Column(name="activiteprincipaleregistremetiersetablissement", type="string", nullable=true)
     */
	private $activitePrincipaleRegistreMetiersEtablissement;
	
	
	
	/**
     * @var string|null
     *
     * @ORM\Column(name="etablissementsiege", type="string", nullable=true)
     */
	private $etablissementSiege;
	
	
	
	/**
     * @var string|null
     *
     * @ORM\Column(name="complementadresseetablissement", type="string", nullable=true)
     */
	private $complementAdresseEtablissement;
	
	/**
     * @var string|null
     *
     * @ORM\Column(name="numerovoieetablissement", type="string", nullable=true)
     */
	private $numeroVoieEtablissement;
	
	/**
     * @var string|null
     *
     * @ORM\Column(name="indicerepetitionetablissement", type="string", nullable=true)
     */
	private $indiceRepetitionEtablissement;
	
	/**
     * @var string|null
     *
     * @ORM\Column(name="typevoieetablissement", type="string", nullable=true)
     */
	private $typeVoieEtablissement;
	
	/**
     * @var string|null
     *
     * @ORM\Column(name="libellevoieetablissement", type="string", nullable=true)
     */
	private $libelleVoieEtablissement;
	
	/**
     * @var string|null
     *
     * @ORM\Column(name="codepostaletablissement", type="string", nullable=true)
     */
	private $codePostalEtablissement;
	
	/**
     * @var string|null
     *
     * @ORM\Column(name="libellecommuneetablissement", type="string", nullable=true)
     */
	private $libelleCommuneEtablissement;
     
     /**
     * @var string|null
     *
     * @ORM\Column(name="codecommuneetablissement", type="string", nullable=true)
     */
	private $codeCommuneEtablissement;
	
	/**
     * @var string|null
     *
     * @ORM\Column(name="activiteprincipaleetablissement", type="string", nullable=true)
     */
	private $activitePrincipaleEtablissement;


	/**
	 * @ORM\Column(name="labelleactiviteetablissement", type="string", nullable=true)
	 */
      private $labelleActiviteEtablissement;

	/**
     * @var string|null
     *
     * @ORM\Column(name="adresse", type="string", nullable=true)
     */
	private $adresse;
	
	/**
     * @var float|null
     *
     * @ORM\Column(name="latitude", type="float", precision=6, scale=0, nullable=true)
     */
	private $latitude;
	
	/**
     * @var float|null
     *
     * @ORM\Column(name="longitude", type="float", precision=6, scale=0, nullable=true)
     */
	private $longitude;
	
	/**
     * @var float|null
     *
     * @ORM\Column(name="denomination_geoscar", type="string",nullable=true)
     */
	private $denominationGeoscar;
	
	
	
	/**
     * @var float|null
     *
     * @ORM\Column(name="departement", type="string", nullable=true)
     */
	private $departement;
	
	/**
     * @var float|null
     *
     * @ORM\Column(name="departement_name", type="string", nullable=true)
     */
	private $departementName;
	

    /**
     * Get the value of id
     *
     * @return  int
     */ 
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set the value of id
     *
     * @param  int  $id
     *
     * @return  self
     */ 
    public function setId(int $id)
    {
        $this->id = $id;

        return $this;
    }

	/**
	 * Get the value of siren
	 *
	 * @return  string|null
	 */ 
	public function getSiren()
	{
		return $this->siren;
	}

	/**
	 * Set the value of siren
	 *
	 * @param  string|null  $siren
	 *
	 * @return  self
	 */ 
	public function setSiren($siren)
	{
		$this->siren = $siren;

		return $this;
	}

	/**
	 * Get the value of nic
	 */ 
	public function getNic()
	{
		return $this->nic;
	}

	/**
	 * Set the value of nic
	 *
	 * @return  self
	 */ 
	public function setNic($nic)
	{
		$this->nic = $nic;

		return $this;
	}

	/**
	 * Get the value of siret
	 *
	 * @return  string|null
	 */ 
	public function getSiret()
	{
		return $this->siret;
	}

	/**
	 * Set the value of siret
	 *
	 * @param  string|null  $siret
	 *
	 * @return  self
	 */ 
	public function setSiret($siret)
	{
		$this->siret = $siret;

		return $this;
	}

	/**
	 * Get the value of activitePrincipaleRegistreMetiersEtablissement
	 *
	 * @return  string|null
	 */ 
	public function getActivitePrincipaleRegistreMetiersEtablissement()
	{
		return $this->activitePrincipaleRegistreMetiersEtablissement;
	}

	/**
	 * Set the value of activitePrincipaleRegistreMetiersEtablissement
	 *
	 * @param  string|null  $activitePrincipaleRegistreMetiersEtablissement
	 *
	 * @return  self
	 */ 
	public function setActivitePrincipaleRegistreMetiersEtablissement($activitePrincipaleRegistreMetiersEtablissement)
	{
		$this->activitePrincipaleRegistreMetiersEtablissement = $activitePrincipaleRegistreMetiersEtablissement;

		return $this;
	}

	/**
	 * Get the value of etablissementSiege
	 *
	 * @return  string|null
	 */ 
	public function getEtablissementSiege()
	{
		return $this->etablissementSiege;
	}

	/**
	 * Set the value of etablissementSiege
	 *
	 * @param  string|null  $etablissementSiege
	 *
	 * @return  self
	 */ 
	public function setEtablissementSiege($etablissementSiege)
	{
		$this->etablissementSiege = $etablissementSiege;

		return $this;
	}

	/**
	 * Get the value of complementAdresseEtablissement
	 *
	 * @return  string|null
	 */ 
	public function getComplementAdresseEtablissement()
	{
		return $this->complementAdresseEtablissement;
	}

	/**
	 * Set the value of complementAdresseEtablissement
	 *
	 * @param  string|null  $complementAdresseEtablissement
	 *
	 * @return  self
	 */ 
	public function setComplementAdresseEtablissement($complementAdresseEtablissement)
	{
		$this->complementAdresseEtablissement = $complementAdresseEtablissement;

		return $this;
	}

	/**
	 * Get the value of numeroVoieEtablissement
	 *
	 * @return  string|null
	 */ 
	public function getNumeroVoieEtablissement()
	{
		return $this->numeroVoieEtablissement;
	}

	/**
	 * Set the value of numeroVoieEtablissement
	 *
	 * @param  string|null  $numeroVoieEtablissement
	 *
	 * @return  self
	 */ 
	public function setNumeroVoieEtablissement($numeroVoieEtablissement)
	{
		$this->numeroVoieEtablissement = $numeroVoieEtablissement;

		return $this;
	}

	/**
	 * Get the value of indiceRepetitionEtablissement
	 *
	 * @return  string|null
	 */ 
	public function getIndiceRepetitionEtablissement()
	{
		return $this->indiceRepetitionEtablissement;
	}

	/**
	 * Set the value of indiceRepetitionEtablissement
	 *
	 * @param  string|null  $indiceRepetitionEtablissement
	 *
	 * @return  self
	 */ 
	public function setIndiceRepetitionEtablissement($indiceRepetitionEtablissement)
	{
		$this->indiceRepetitionEtablissement = $indiceRepetitionEtablissement;

		return $this;
	}

	/**
	 * Get the value of typeVoieEtablissement
	 *
	 * @return  string|null
	 */ 
	public function getTypeVoieEtablissement()
	{
		return $this->typeVoieEtablissement;
	}

	/**
	 * Set the value of typeVoieEtablissement
	 *
	 * @param  string|null  $typeVoieEtablissement
	 *
	 * @return  self
	 */ 
	public function setTypeVoieEtablissement($typeVoieEtablissement)
	{
		$this->typeVoieEtablissement = $typeVoieEtablissement;

		return $this;
	}

	/**
	 * Get the value of libelleVoieEtablissement
	 *
	 * @return  string|null
	 */ 
	public function getLibelleVoieEtablissement()
	{
		return $this->libelleVoieEtablissement;
	}

	/**
	 * Set the value of libelleVoieEtablissement
	 *
	 * @param  string|null  $libelleVoieEtablissement
	 *
	 * @return  self
	 */ 
	public function setLibelleVoieEtablissement($libelleVoieEtablissement)
	{
		$this->libelleVoieEtablissement = $libelleVoieEtablissement;

		return $this;
	}

	/**
	 * Get the value of codePostalEtablissement
	 *
	 * @return  string|null
	 */ 
	public function getCodePostalEtablissement()
	{
		return $this->codePostalEtablissement;
	}

	/**
	 * Set the value of codePostalEtablissement
	 *
	 * @param  string|null  $codePostalEtablissement
	 *
	 * @return  self
	 */ 
	public function setCodePostalEtablissement($codePostalEtablissement)
	{
		$this->codePostalEtablissement = $codePostalEtablissement;

		return $this;
	}

	/**
	 * Get the value of libelleCommuneEtablissement
	 *
	 * @return  string|null
	 */ 
	public function getLibelleCommuneEtablissement()
	{
		return $this->libelleCommuneEtablissement;
	}

	/**
	 * Set the value of libelleCommuneEtablissement
	 *
	 * @param  string|null  $libelleCommuneEtablissement
	 *
	 * @return  self
	 */ 
	public function setLibelleCommuneEtablissement($libelleCommuneEtablissement)
	{
		$this->libelleCommuneEtablissement = $libelleCommuneEtablissement;

		return $this;
	}

	/**
	 * Get the value of codeCommuneEtablissement
	 *
	 * @return  string|null
	 */ 
	public function getCodeCommuneEtablissement()
	{
		return $this->codeCommuneEtablissement;
	}

	/**
	 * Set the value of codeCommuneEtablissement
	 *
	 * @param  string|null  $codeCommuneEtablissement
	 *
	 * @return  self
	 */ 
	public function setCodeCommuneEtablissement($codeCommuneEtablissement)
	{
		$this->codeCommuneEtablissement = $codeCommuneEtablissement;

		return $this;
	}

	/**
	 * Get the value of activitePrincipaleEtablissement
	 *
	 * @return  string|null
	 */ 
	public function getActivitePrincipaleEtablissement()
	{
		return $this->activitePrincipaleEtablissement;
	}

	/**
	 * Set the value of activitePrincipaleEtablissement
	 *
	 * @param  string|null  $activitePrincipaleEtablissement
	 *
	 * @return  self
	 */ 
	public function setActivitePrincipaleEtablissement($activitePrincipaleEtablissement)
	{
		$this->activitePrincipaleEtablissement = $activitePrincipaleEtablissement;

		return $this;
	}

	/**
	 * Get the value of adresse
	 *
	 * @return  string|null
	 */ 
	public function getAdresse()
	{
		return $this->adresse;
	}

	/**
	 * Set the value of adresse
	 *
	 * @param  string|null  $adresse
	 *
	 * @return  self
	 */ 
	public function setAdresse($adresse)
	{
		$this->adresse = $adresse;

		return $this;
	}

	/**
	 * Get the value of latitude
	 *
	 * @return  float|null
	 */ 
	public function getLatitude()
	{
		return $this->latitude;
	}

	/**
	 * Set the value of latitude
	 *
	 * @param  float|null  $latitude
	 *
	 * @return  self
	 */ 
	public function setLatitude($latitude)
	{
		$this->latitude = $latitude;

		return $this;
	}

	/**
	 * Get the value of longitude
	 *
	 * @return  float|null
	 */ 
	public function getLongitude()
	{
		return $this->longitude;
	}

	/**
	 * Set the value of longitude
	 *
	 * @param  float|null  $longitude
	 *
	 * @return  self
	 */ 
	public function setLongitude($longitude)
	{
		$this->longitude = $longitude;

		return $this;
	}

	/**
	 * Get the value of denominationGeoscar
	 *
	 * @return  float|null
	 */ 
	public function getDenominationGeoscar()
	{
		return $this->denominationGeoscar;
	}

	/**
	 * Set the value of denominationGeoscar
	 *
	 * @param  float|null  $denominationGeoscar
	 *
	 * @return  self
	 */ 
	public function setDenominationGeoscar($denominationGeoscar)
	{
		$this->denominationGeoscar = $denominationGeoscar;

		return $this;
	}

	/**
	 * Get the value of departement
	 *
	 * @return  float|null
	 */ 
	public function getDepartement()
	{
		return $this->departement;
	}

	/**
	 * Set the value of departement
	 *
	 * @param  float|null  $departement
	 *
	 * @return  self
	 */ 
	public function setDepartement($departement)
	{
		$this->departement = $departement;

		return $this;
	}

	/**
	 * Get the value of departementName
	 *
	 * @return  float|null
	 */ 
	public function getDepartementName()
	{
		return $this->departementName;
	}

	/**
	 * Set the value of departementName
	 *
	 * @param  float|null  $departementName
	 *
	 * @return  self
	 */ 
	public function setDepartementName($departementName)
	{
		$this->departementName = $departementName;

		return $this;
	}

      /**
       * Get the value of labelleActiviteEtablissement
       */ 
      public function getLabelleActiviteEtablissement()
      {
            return $this->labelleActiviteEtablissement;
      }

      /**
       * Set the value of labelleActiviteEtablissement
       *
       * @return  self
       */ 
      public function setLabelleActiviteEtablissement($labelleActiviteEtablissement)
      {
            $this->labelleActiviteEtablissement = $labelleActiviteEtablissement;

            return $this;
      }
}
	 

	

	

	




	





