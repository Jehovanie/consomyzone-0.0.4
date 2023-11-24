<?php

namespace App\Repository;

use App\Entity\FermeGeom;
use App\Service\DepartementService;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;

/**
 * @extends ServiceEntityRepository<FermeGeom>
 *
 * @method FermeGeom|null find($id, $lockMode = null, $lockVersion = null)
 * @method FermeGeom|null findOneBy(array $criteria, array $orderBy = null)
 * @method FermeGeom[]    findAll()
 * @method FermeGeom[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class FermeGeomRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, FermeGeom::class);
    }

    public function save(FermeGeom $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(FermeGeom $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    ///jheo : prendre tous les fermes qui appartients dans un departement specifique
    public function getFermByDep($nom_dep, $id_dep, $page)
    {

        ///page current
        $page_current = 10 * $page;

        ///correction des carractères speciaux;
        $car_speciaux = array("é", "è", "ô");
        $car_correction   = array("e", "e", "o");
        $new_nom_dep = str_replace($car_speciaux, $car_correction, $nom_dep);

        // dd($id_dep, $new_nom_dep);

        ///lancement de requette
        $qb = $this->createQueryBuilder('p')
            ->select(
                'p.id',
                'p.nomFerme',
                'p.nomFerme as nom',
                'p.codePostal',
                'p.lienSiteWeb',
                'p.departement',
                'p.departement as dep',
                'p.departementName',
                'p.departementName as depName',
                'p.genre',
                'p.email',
                'p.adresseFerme',
                'p.adresseFerme as add',
                'p.latitude',
                'p.latitude as lat',
                'p.longitude',
                'p.longitude as long',
                'p.addBy',
                'p.activite',
                'p.produit1',
                'p.produit2',
                'p.produit3',
                'p.produit4',
                'p.produit5',
                'p.produit6',
                'p.produit7',
                'p.produit8',
                'p.produitFerme',
                'p.animauxAutoriser',
                'p.carteBancaire',
                'p.chequeVacance',
                'p.degustation',
                'p.venteEnLigne',
                'p.siteWeb',
                'p.telephoneDomicile',
                'p.telephoneMobile',
                'p.horairesVenteAFerme',
                'p.horairesVenteMagasinProd',
                'p.horairesVenteAuMarche',
                'p.accesHandicape',
                'p.accesHandicapAuditif',
                'p.accesHandicapMental',
                'p.accesHandicapMotrice',
                'p.accesHandicapVisuel',
                'p.accesVoiture',
                'p.adherentAdeve',
                'p.agricultureBio',
                'p.atelier',
                'p.marcherProduit',
                'p.stationVerte',
                'p.ticketsRestaurant',
                'p.motDuFermier',
                'p.ville',
                'p.telephoneTravail',
                'p.nomProprietaire',
            )
            // ->setMaxResults(10)
            ->setFirstResult($page_current)
            // ->where('p.adresseFerme LIKE :q')
            ->where('p.departement = :k')
            ->andWhere("p.disabled = :disabled")
            ->orderBy("p.nomFerme", 'ASC')
            // ->setParameter('q', '%' . $new_nom_dep . '%')
            ->setParameter('k',  $id_dep)
            ->setParameter('disabled',0);
        $query = $qb->getQuery();

        return $query->execute();
    }

    public function getFermByDepMobile($nom_dep, $id_dep,$limit = 2000,$offset = 0)
    {

       

        ///correction des carractères speciaux;
        $car_speciaux = array("é", "è", "ô");
        $car_correction   = array("e", "e", "o");
        $new_nom_dep = str_replace($car_speciaux, $car_correction, $nom_dep);

        // dd($id_dep, $new_nom_dep);

        ///lancement de requette
        $qb = $this->createQueryBuilder('p')
            ->select(
                'p.id',
                'p.nomFerme',
                'p.nomFerme as nom',
                'p.codePostal',
                'p.lienSiteWeb',
                'p.departement',
                'p.departement as dep',
                'p.departementName',
                'p.departementName as depName',
                'p.genre',
                'p.email',
                'p.adresseFerme',
                'p.adresseFerme as add',
                'p.latitude',
                'p.latitude as lat',
                'p.longitude',
                'p.longitude as long',
                'p.addBy',
                'p.activite',
                'p.produit1',
                'p.produit2',
                'p.produit3',
                'p.produit4',
                'p.produit5',
                'p.produit6',
                'p.produit7',
                'p.produit8',
                'p.produitFerme',
                'p.animauxAutoriser',
                'p.carteBancaire',
                'p.chequeVacance',
                'p.degustation',
                'p.venteEnLigne',
                'p.siteWeb',
                'p.telephoneDomicile',
                'p.telephoneMobile',
                'p.horairesVenteAFerme',
                'p.horairesVenteMagasinProd',
                'p.horairesVenteAuMarche',
                'p.accesHandicape',
                'p.accesHandicapAuditif',
                'p.accesHandicapMental',
                'p.accesHandicapMotrice',
                'p.accesHandicapVisuel',
                'p.accesVoiture',
                'p.adherentAdeve',
                'p.agricultureBio',
                'p.atelier',
                'p.marcherProduit',
                'p.stationVerte',
                'p.ticketsRestaurant',
                'p.motDuFermier',
                'p.ville',
                'p.telephoneTravail',
                'p.nomProprietaire',
            )
            ->setMaxResults($limit)
            ->setFirstResult($offset)
            // ->where('p.adresseFerme LIKE :q')
            ->where('p.departement = :k')
            ->andWhere("p.disabled = :disabled")
            ->orderBy("p.nomFerme", 'ASC')
            // ->setParameter('q', '%' . $new_nom_dep . '%')
            ->setParameter('k',  $id_dep)
            ->setParameter('disabled', 0);
        $query = $qb->getQuery();

        return $query->execute();
    }

    public function getFermByDepSearchMobile($nom_dep, $id_dep, $id_ferme)
    {



        ///correction des carractères speciaux;
        $car_speciaux = array("é", "è", "ô");
        $car_correction   = array("e", "e", "o");
        $new_nom_dep = str_replace($car_speciaux, $car_correction, $nom_dep);

        // dd($id_dep, $new_nom_dep);

        ///lancement de requette
        $qb = $this->createQueryBuilder('p')
            ->select(
                'p.id',
                'p.nomFerme',
                'p.nomFerme as nom',
                'p.codePostal',
                'p.lienSiteWeb',
                'p.departement',
                'p.departement as dep',
                'p.departementName',
                'p.departementName as depName',
                'p.genre',
                'p.email',
                'p.adresseFerme',
                'p.adresseFerme as add',
                'p.latitude',
                'p.latitude as lat',
                'p.longitude',
                'p.longitude as long',
                'p.addBy',
                'p.activite',
                'p.produit1',
                'p.produit2',
                'p.produit3',
                'p.produit4',
                'p.produit5',
                'p.produit6',
                'p.produit7',
                'p.produit8',
                'p.produitFerme',
                'p.animauxAutoriser',
                'p.carteBancaire',
                'p.chequeVacance',
                'p.degustation',
                'p.venteEnLigne',
                'p.siteWeb',
                'p.telephoneDomicile',
                'p.telephoneMobile',
                'p.horairesVenteAFerme',
                'p.horairesVenteMagasinProd',
                'p.horairesVenteAuMarche',
                'p.accesHandicape',
                'p.accesHandicapAuditif',
                'p.accesHandicapMental',
                'p.accesHandicapMotrice',
                'p.accesHandicapVisuel',
                'p.accesVoiture',
                'p.adherentAdeve',
                'p.agricultureBio',
                'p.atelier',
                'p.marcherProduit',
                'p.stationVerte',
                'p.ticketsRestaurant',
                'p.motDuFermier',
                'p.ville',
                'p.telephoneTravail',
                'p.nomProprietaire',
            )
            ->where('p.departement = :k')
            ->andWhere("p.disabled = :disabled")
            ->andWhere("p.id = :id")
            ->orderBy("p.nomFerme", 'ASC')
            ->setParameter('k',  $id_dep)
            ->setParameter('disabled', 0)
            ->setParameter('id', $id_ferme);
        $query = $qb->getQuery();

        return $query->execute();
    }

    ///jheo : prendre tous les fermes qui appartients dans un departement specifique
    public function getAllFermeInDepartement($nom_dep=null, $id_dep)
    {
        
        ///lancement de requette
        $qb = $this->createQueryBuilder('p')
            ->select(
                'p.id',
                'p.nomFerme',
                'p.nomFerme as nameFilter',
                'p.adresseFerme',
                'p.departement',
                'p.departementName',
                'p.latitude',
                'p.longitude',
                'p.latitude as lat',
                'p.longitude as long'
            )
            ->where('p.departement = :k')
            ->andWhere("p.disabled = :disabled")
            ->setParameter('k', $id_dep)
            ->setParameter('disabled',0);

        $query = $qb->getQuery();

        return $query->execute();
    }



    ///jheo : prendre une ferme apartir d'un nom de departement , le numero de departement et son identifiant.
    public function getOneFerme($nom_dep, $id_dep, $id_ferme)
    {
        // Remarque : $id_ferme dans la base peut parfois combinaison des lettres et des chiffres.
        $qb = $this->createQueryBuilder('p')
            ->select(
                'p.genre',
                'p.activite',
                'p.codePostal',
                'p.lienSiteWeb',
                'p.nomFerme',
                'p.nomProprietaire',
                'p.adresseFerme',
                'p.produit1',
                'p.produit2',
                'p.produit3',
                'p.produit4',
                'p.produit5',
                'p.produit6',
                'p.produit7',
                'p.produit8',
                'p.produitFerme',
                'p.animauxAutoriser',
                'p.carteBancaire',
                'p.chequeVacance',
                'p.degustation',
                'p.venteEnLigne',
                'p.siteWeb',
                'p.telephoneDomicile',
                'p.telephoneMobile',
                'p.horairesVenteAFerme',
                'p.horairesVenteMagasinProd',
                'p.horairesVenteAuMarche',
                'p.accesHandicape',
                'p.accesHandicapAuditif',
                'p.accesHandicapMental',
                'p.accesHandicapMotrice',
                'p.accesHandicapVisuel',
                'p.accesVoiture',
                'p.adherentAdeve',
                'p.agricultureBio',
                'p.atelier',
                'p.marcherProduit',
                'p.stationVerte',
                'p.ticketsRestaurant',
                'p.motDuFermier',
                'p.ville',
                'p.telephoneTravail',
                'p.latitude',
                'p.longitude',
                'p.departement',
                'p.departementName'
            )
            ->where('p.id = :q')
            ->andWhere('p.departement = :k')
            ->setMaxResults(1)
            ->setParameter('q', $id_ferme)
            ->setParameter('k', $id_dep);


        $query = $qb->getQuery();

        return $query->execute();
    }

    ///jheo : getLatitudeLongitude
    public function getLatitudeLongitudeFerme($limits= 1000)
    {
        // Remarque : $id_ferme dans la base peut parfois combinaison des lettres et des chiffres.
        return $this->createQueryBuilder('p')
            ->select(
                'p.id',
                'p.nomFerme',
                'p.adresseFerme',
                'p.departement',
                'p.departementName',
                'p.latitude',
                'p.longitude'
            )
            ->orderBy('RAND()')
            ->setMaxResults($limits)
            ->getQuery()
            ->getResult();
    }

    public function getAllFilterByLatLong($data){
        extract($data); //// $last [ min [ lat , lng ], max [ lat, lng ] ], $new [ min [ lat, lng ], max [ lat, lng ] ]
        $qb = $this->createQueryBuilder('p')
            ->select(
                'p.id',
                'p.nomFerme',
                'p.adresseFerme',
                'p.departement',
                'p.departementName',
                'p.latitude',
                'p.longitude'
            )->where('p.latitude BETWEEN :lat_min AND :lat_max')
            ->andWhere('p.longitude BETWEEN :lng_min AND :lng_max');

        // $lat_min= count($new) > 0 ? $new["min"] : [ "lat" => -25.0];
        // $lat_max= $last["max"];

        // $lng_min= count($new) > 0 ? $last["min"] : [ "lng" => 0.0];
        // $lng_max= count($new) > 0 ? $new["max"] : $last["min"];


        $lat_min=$last["min"];
        $lat_max= count($new) > 0 ? $new["max"] : $last["max"];

        $lng_min= count($new) > 0 ? $new["min"] : $last["min"];
        $lng_max= $last["max"];

        ///(this.last_minll.lat > minll.lat) && (this.last_maxll.lng < maxll.lng) 
        $qb= $qb->setParameter('lat_min', $lat_min["lat"])
                ->setParameter('lat_max', $lat_max["lat"])
                ->setParameter('lng_min', $lng_min["lng"])
                ->setParameter('lng_max', $lng_max["lng"]);
        
        $query = $qb->getQuery();
        return $query->execute();
    }

    ///jheo : get number of row in database
    public function getCountFerme($nom_dep = null, $id_dep = null)
    {

        ///correction des carractères speciaux;
        $car_speciaux = array("é", "è", "ô");
        $car_correction   = array("e", "e", "o");
        $new_nom_dep = str_replace($car_speciaux, $car_correction, $nom_dep);


        if ($nom_dep || $id_dep) {
            $qb = $this->createQueryBuilder('p')
                ->select('count(p.id)')
                // ->where('p.adresseFerme LIKE :q')
                // ->andWhere('p.adresseFerme LIKE :k')
                // ->orWhere('p.departement LIKE :k')
                ->where('p.departement = :k')
                // ->setParameter('q', '%' . $new_nom_dep . '%')
                ->setParameter('k', $id_dep);
        } else {
            $qb = $this->createQueryBuilder('p')
                ->select('count(p.id)');
        }

        $query = $qb->getQuery();
        return $query->execute();
    }

    public function addNote($idFerme, $note)
    {
        return $this->createQueryBuilder("")
            ->update(FermeGeom::class, "f")
            ->set("f.note", ":note")
            ->where('f.id=:idF')
            ->setParameter("note", $note)
            ->setParameter("idF", $idFerme)
            ->getQuery()
            ->execute();
    }

    public function findMyEtab($id,$idUser)
    {
        return $this->createQueryBuilder("f")
            ->select()
            ->where('f.addBy=:addBy')
            ->andWhere('f.id=:id')
            ->setParameter('addBy',$idUser)
            ->setParameter('id',$id)
            ->getQuery()
            ->getResult();
    }

    public function getNumberOfMyEtab()
    {
        return $this->createQueryBuilder("f")
            ->select('count(f.addBy)')
            ->where('f.addBy=:id')
            ->setParameter('id', $this->getUser()->getId())
            ->getQuery()
            ->getSingleScalarResult();
    }

    public function updateMyEtab($body,$addBy)
    {
        $f=$this->find(intval($body['id']));
       
        $lat= floatval($body["lat"]) ==0 ? $f->getLatitude() : floatval($body["lat"]);
        $lng= floatval($body["lng"]) ==0 ? $f->getLongitude() : floatval($body["lng"]);
        dump($f,$lat,$lng);
        return $this->createQueryBuilder("f")
            ->update(FermeGeom::class, "f")
            ->set("f.nomFerme", ":nomFerme")
            ->set("f.codePostal", ":code_postal")
            ->set("f.adresseFerme", ":adresseFerme")
            ->set("f.departement", ":departement")
            ->set("f.departementName", ":departementName")
            ->set("f.email", ":email")
            ->set("f.fax", ":fax")
            ->set("f.telephoneDomicile", ":telephoneDomicile")
            ->set("f.telephoneMobile", ":telephoneMobile")
            ->set("f.telephoneTravail", ":telephoneTravail")
            ->set("f.produitFerme", ":produitFerme")
            ->set("f.ville", ":ville")
            ->set("f.latitude", ":latitude")
            ->set("f.longitude", ":longitude")
            ->set("f.horairesVenteAFerme", ":horairesVenteAFerme")
            ->set("f.horairesVenteMagasinProd", ":horairesVenteMagasinProd")
            ->set("f.horairesVenteAuMarche", ":horairesVenteAuMarche")
            ->set("f.accesHandicape", ":accesHandicape")
            ->set("f.accesHandicapMental", ":accesHandicapMental")
            ->set("f.accesHandicapAuditif", ":accesHandicapAuditif")
            ->set("f.accesHandicapMotrice", ":accesHandicapMotrice")
            ->set("f.accesHandicapVisuel",":accesHandicapVisuel")
            ->set("f.accesVoiture", ":accesVoiture")
            ->set("f.adherentAdeve", ":adherentAdeve")
            ->set("f.agricultureBio", ":agricultureBio")
            ->set("f.animauxAutoriser",":animauxAutoriser")
            ->set("f.atelier",":atelier")
            ->set("f.carteBancaire",":carteBancaire")
            ->set("f.chequeVacance",":chequeVacance")
            ->set("f.degustation",":degustation")
            ->set("f.marcherProduit",":marcheProduit")
            ->set("f.siteWeb", ":siteWeb")
            ->set("f.stationVerte", ":stationVerte")
            ->set("f.ticketsRestaurant", ":ticketsRestaurant")
            ->set("f.venteEnLigne", ":venteEnLigne")
            ->where("f.id=:id")
            ->andWhere("f.addBy=:addBy")
            ->setParameter("id", $body["id"])
            ->setParameter("addBy", $addBy)
            ->setParameter("nomFerme", $body["nom_ferme"])
            ->setParameter("code_postal", $body["code_postal"])
            ->setParameter("adresseFerme", $body["adresse_ferme"])
            ->setParameter("departement", $body["departement"])
            ->setParameter("departementName", $body["departement_name"])
            ->setParameter("email",$body["email"])
            ->setParameter("fax", $body["fax"])
            ->setParameter("telephoneDomicile", $body["telephone_domicile"])
            ->setParameter("telephoneMobile", $body["telephone_mobile"])
            ->setParameter("telephoneTravail", $body["telephone_travail"])
            ->setParameter("produitFerme", $body["produit_ferme"])
            ->setParameter("ville", $body["ville"])
            ->setParameter("latitude", $lat)
            ->setParameter("longitude", $lng)
            ->setParameter("horairesVenteAFerme", $body["horaires_vente_ferme"])
            ->setParameter("horairesVenteMagasinProd", $body["horaires_vente_magasin"])
            ->setParameter("horairesVenteAuMarche", $body["horaires_vente_marche"])
            ->setParameter("accesHandicape", $body["acces_handicape"])
            ->setParameter("accesHandicapAuditif", $body["acces_handicap_auditif"])
            ->setParameter("accesHandicapMental", $body["acces_handicap_mental"])
            ->setParameter("accesHandicapMotrice", $body["acces_handicap_motrice"])
            ->setParameter("accesHandicapVisuel", $body["acces_handicap_visuel"])
            ->setParameter("accesVoiture",$body["acces_voiture"])
            ->setParameter("adherentAdeve", $body["adherent_adeve"])
            ->setParameter("agricultureBio", $body["agriculture_bio"])
            ->setParameter("animauxAutoriser", $body["animaux_autoriser"])
            ->setParameter("atelier", $body["atelier"])
            ->setParameter("carteBancaire", $body["carte_bancaire"])
            ->setParameter("chequeVacance", $body["cheque_vacance"])
            ->setParameter("degustation", $body["degustation"])
            ->setParameter("marcheProduit", $body["marcher_produit"])
            ->setParameter("siteWeb", $body["site_web"])
            ->setParameter("stationVerte", $body["station_verte"])
            ->setParameter("ticketsRestaurant", $body["tickets_restaurant"])
            ->setParameter("venteEnLigne", $body["vente_en_ligne"])
            ->getQuery()
            ->execute();
    }
    public function deleteEtab($id,$idUser){
         return $this->createQueryBuilder("")
         ->update(FermeGeom::class,"f")
         ->set("f.disabled",":disabled")
         ->where("f.id = :id")
         ->andWhere("f.addBy = :addBy")
         ->setParameter("addBy", $idUser)
         ->setParameter("id", $id)
         ->setParameter("disabled", 1)
         ->getQuery()
         ->execute();
    }


    public function getLastId(){
        return $this->createQueryBuilder("t") 
        ->select("max(t.id)")
        ->getQuery()
        ->getSingleScalarResult();
    }

    ///jheo : getByCles 
    public function getBySpecificClef(string $mot_cles0, string $mot_cles1, int $page = 1, $size= 20 )
    {
        $page_current =$page > 1 ? $page * 10 +1  : 0;

        $mot_cles1 = strlen($mot_cles1) === 1 ? "0". $mot_cles1 : $mot_cles1;

        $departementService = new DepartementService();
        $departement = $departementService->getDepWithKeyNomDep();
        if(array_key_exists(strtolower($mot_cles1), $departement)){
            $mot_cles1 = $departement[strtolower($mot_cles1)];
        }
        
        $qb = $this->createQueryBuilder('p')
            ->select(
                'p.id',
                'p.nomFerme',
                'p.nomFerme as nom',
                'p.adresseFerme',
                'p.adresseFerme as add',
                'p.email',
                'p.genre',
                'p.departement',
                'p.departementName',
                'p.departement as dep',
                'p.departementName as depName',
                'p.produitFerme as ferme',
                'p.codePostal',
                'p.nomProprietaire',
                'p.motDuFermier',
                'p.ville',
                'p.latitude as lat',
                'p.longitude as long',
            );

        if( $mot_cles0 !=="" && $mot_cles1 === "" ){
            if( strlen($mot_cles0) <= 2 ){
                
                $qb = $qb->where("p.nomFerme LIKE :cles0")
                         ->setParameter('cles0', '%'. $mot_cles0. '%' );
            }else{
                $qb =  $qb->where("REPLACE(p.nomFerme) LIKE :cles0")
                          ->orWhere("REPLACE(p.nomProprietaire) LIKE :cles0")
                          ->setParameter('cles0', '%'.$mot_cles0.'%');
            }
            

        }else if ( $mot_cles0 === "" && $mot_cles1 !== "" ){
            if( strlen($mot_cles1) <= 2 ){
                $qb =  $qb->where("p.departement LIKE :cles1")
                        ->setParameter('cles1', '%'. $mot_cles1. '%' );
            }else{
                $qb =  $qb->where("REPLACE(p.adresseFerme) LIKE :cles1")
                          ->orWhere("REPLACE(p.departementName) LIKE :cles1")
                          ->orWhere("REPLACE(CONCAT(p.departement,' ',p.departementName)) LIKE :cles1")
                          ->orWhere("REPLACE(CONCAT(p.departementName,' ',p.departement)) LIKE :cles1")
                          ->setParameter('cles1', '%'. $mot_cles1. '%' );
            }

        }else{
            if(strtolower($mot_cles0) == "ferme" || strtolower($mot_cles0) == "fermes"){
                if( strlen($mot_cles1) <= 2 ){
                    $qb = $qb->where("p.departement LIKE :cles1")
                             ->setParameter('cles1', '%'. $mot_cles1. '%' );
                }else{
                    $qb = $qb->where("REPLACE(p.adresseFerme) LIKE :cles1")
                            ->orWhere("REPLACE(p.departementName) LIKE :cles1")
                            ->orWhere("REPLACE(CONCAT(p.departement,' ',p.departementName)) LIKE :cles1")
                            ->orWhere("REPLACE(CONCAT(p.departementName,' ',p.departement)) LIKE :cles1")
                             ->setParameter('cles1', '%'. $mot_cles1. '%' );
                }
            } else{

                if( strlen($mot_cles1) <= 2 ){
                    $qb = $qb->where("REPLACE(p.nomFerme) LIKE :cles0 AND p.departement LIKE :cles1")
                                 ->orWhere("REPLACE(p.nomProprietaire) LIKE :cles0 AND p.departement LIKE :cles1")
                                 ->setParameter('cles0', '%'. $mot_cles0. '%' )
                                 ->setParameter('cles1', '%'. $mot_cles1. '%' );
                }else{

                    $qb = $qb->where("(REPLACE(p.nomFerme) LIKE :cles0) AND (REPLACE(p.adresseFerme) LIKE :cles1)")
                        ->orWhere("REPLACE(p.nomFerme) LIKE :cles0 AND REPLACE(p.departementName) LIKE :cles1")
                        ->orWhere("REPLACE(p.nomFerme) LIKE :cles0 AND REPLACE(CONCAT(p.departement,' ',p.departementName)) LIKE :cles1")
                        ->orWhere("REPLACE(p.nomFerme) LIKE :cles0 AND REPLACE(CONCAT(p.departementName,' ',p.departement)) LIKE :cles1")
                        ->setParameter('cles0', '%'. $mot_cles0. '%' )
                        ->setParameter('cles1', '%'. $mot_cles1. '%' );
                }


            }
        }

        $qb = $qb->orderBy('p.nomFerme', 'ASC')
                 ->getQuery();
                

        $results = $qb->execute();
        return [ $results , count($results) , "ferme"];
    }

    public function getBySpecificClefOther(string $mot_cles0, string $mot_cles1, int $page = 1, $size= 20 )
    {
        $page_current =$page > 1 ? $page * 10 +1  : 0;
        
        $mot_cles1 = strlen($mot_cles1) === 1 ? "0". $mot_cles1 : $mot_cles1;

        $departementService = new DepartementService();
        $departement = $departementService->getDepWithKeyNomDep();
        if(array_key_exists(strtolower($mot_cles1), $departement)){
            $mot_cles1 = $departement[strtolower($mot_cles1)];
        }

        $qb = $this->createQueryBuilder('p')
            ->select(
                'p.id',
                'p.nomFerme',
                'p.nomFerme as nom',
                'p.adresseFerme',
                'p.adresseFerme as add',
                'p.email',
                'p.genre',
                'p.departement',
                'p.departementName',
                'p.departement as dep',
                'p.departementName as depName',
                'p.produitFerme as ferme',
                'p.codePostal',
                'p.nomProprietaire',
                'p.motDuFermier',
                'p.ville',
                'p.latitude as lat',
                'p.longitude as long',
            );

        if( $mot_cles0 !=="" && $mot_cles1 === "" ){
            if( strlen($mot_cles0) <= 2 ){
                
                $qb = $qb->where("p.nomFerme LIKE :cles0")
                         ->setParameter('cles0', '%'. $mot_cles0. '%' );
            }else{
                $qb =  $qb->where("MATCH_AGAINST(p.nomFerme) AGAINST( :cles0 boolean) > 0")
                          ->orWhere("p.nomFerme LIKE :cles0")
                          ->orWhere("MATCH_AGAINST(p.departementName) AGAINST( :cles0 boolean) > 0")
                          ->orWhere("p.nomProprietaire LIKE :cles0")
                          ->orWhere("MATCH_AGAINST(p.nomProprietaire) AGAINST( :cles0 boolean) > 0")
                          ->setParameter('cles0', '%'.$mot_cles0.'%');
            }
            

        }else if ( $mot_cles0 === "" && $mot_cles1 !== "" ){
            if( strlen($mot_cles1) <= 2 ){
                $qb =  $qb->where("p.departement LIKE :cles1")
                        ->setParameter('cles1', '%'. $mot_cles1. '%' );
            }else{
                $qb =  $qb->where("MATCH_AGAINST(p.adresseFerme) AGAINST( :cles1 boolean) > 0")
                          ->orWhere("p.adresseFerme LIKE :cles1")
                          ->orWhere("MATCH_AGAINST(p.departementName) AGAINST( :cles1 boolean) > 0")
                          ->orWhere("p.departementName LIKE :cles1")
                          ->orWhere("p.nomProprietaire LIKE :cles1")
                          ->orWhere("MATCH_AGAINST(p.nomProprietaire) AGAINST( :cles1 boolean) > 0")
                          ->orWhere("CONCAT(p.departement,' ',p.departementName) LIKE :cles1")
                          ->orWhere("CONCAT(p.departementName,' ',p.departement) LIKE :cles1")
                          ->setParameter('cles1', '%'. $mot_cles1. '%' );
            }

        }else{
            if( strlen($mot_cles1) <= 2 ){
                $qb = $qb->where("MATCH_AGAINST(p.nomFerme) AGAINST( :cles0 boolean) > 0 AND p.departement LIKE :cles1")
                             ->orWhere("p.nomFerme LIKE :cles0 AND p.departement LIKE :cles1")
                             ->orWhere("MATCH_AGAINST(p.nomProprietaire) AGAINST( :cles0 boolean) > 0 AND p.departement LIKE :cles1")
                             ->orWhere("p.nomProprietaire LIKE :cles0 AND p.departement LIKE :cles1")
                             ->setParameter('cles0', '%'. $mot_cles0. '%' )
                             ->setParameter('cles1', '%'. $mot_cles1. '%' );
            }else{

                $qb = $qb->where("(MATCH_AGAINST(p.nomFerme) AGAINST( :cles0 boolean) > 0) OR (MATCH_AGAINST(p.adresseFerme) AGAINST( :cles1 boolean) > 0)")
                    ->orWhere("(p.nomFerme LIKE :cles0) OR (p.adresseFerme LIKE :cles1 )")
                    ->orWhere("MATCH_AGAINST(p.nomProprietaire) AGAINST( :cles0 boolean) > 0")
                    ->orWhere("p.nomProprietaire LIKE :cles0")
                    ->setParameter('cles0', '%'. $mot_cles0. '%' )
                    ->setParameter('cles1', '%'. $mot_cles1. '%' );

            }
        }

        $qb = $qb->orderBy('p.nomFerme', 'ASC')
                 ->getQuery();
                

        $results = $qb->execute();
        return [ $results , count($results) , "ferme"];
    }

    /**
     * @author Jehovanie RAMANDRIJOEL <jehovenierama@gmail.com>
     * 
     * Get random data 
     * 
     * @param integer $limits: number of the data to get
     * 
     * @return array Ferme
     */
    public function getSomeDataShuffle($limits= 1000){
        return $this->createQueryBuilder("r")
                    ->select(
                        'r.id',
                        'r.nomFerme',
                        'r.nomFerme as nameFilter',
                        'r.adresseFerme',
                        'r.departement',
                        'r.departementName',
                        'r.produitFerme',
                        'r.email',
                        'r.engagementProd',
                        'r.fax',
                        'r.genre',
                        'r.horairesVenteAFerme',
                        'r.horairesVenteMagasinProd',
                        'r.horairesVenteAuMarche',
                        'r.accesHandicape',
                        'r.accesHandicapAuditif',
                        'r.accesHandicapMental',
                        'r.accesHandicapMotrice',
                        'r.accesHandicapVisuel',
                        'r.accesVoiture',
                        'r.adherentAdeve',
                        'r.agricultureBio',
                        'r.animauxAutoriser',
                        'r.atelier',
                        'r.carteBancaire',
                        'r.chequeVacance',
                        'r.degustation',
                        'r.marcherProduit',
                        'r.motDuFermier',
                        'r.produitFerme',
                        'r.produitFerme as ferme',
                        'r.codePostal',
                        'r.nomProprietaire',
                        'r.motDuFermier',
                        'r.ville',
                        'r.latitude as lat',
                        'r.longitude as long',
                    )
                    ->orderBy('RAND()')
                    ->setMaxResults($limits)
                    ->getQuery()
                    ->getResult();
    }

    
    public function getDataBetweenAnd($minx,$miny,$maxx,$maxy, $taille= 200){

        $query =  $this->createQueryBuilder("r")
                    ->select(
                        'r.id',
                        'r.nomFerme',
                        'r.nomFerme as nameFilter',
                        'r.nomFerme as nom',
                        'r.adresseFerme',
                        'r.adresseFerme as add',
                        'r.departement',
                        'r.departement as dep',
                        'r.departementName',
                        'r.departementName as depName',
                        'r.email',
                        'r.engagementProd',
                        'r.fax',
                        'r.genre',
                        'r.horairesVenteAFerme',
                        'r.horairesVenteMagasinProd',
                        'r.horairesVenteAuMarche',
                        'r.accesHandicape',
                        'r.accesHandicapAuditif',
                        'r.accesHandicapMental',
                        'r.accesHandicapMotrice',
                        'r.accesHandicapVisuel',
                        'r.accesVoiture',
                        'r.adherentAdeve',
                        'r.agricultureBio',
                        'r.animauxAutoriser',
                        'r.atelier',
                        'r.carteBancaire',
                        'r.chequeVacance',
                        'r.degustation',
                        'r.marcherProduit',
                        'r.motDuFermier',
                        'r.produitFerme',
                        'r.produitFerme as ferme',
                        'r.codePostal',
                        'r.nomProprietaire',
                        'r.motDuFermier',
                        'r.ville',
                        'r.latitude',
                        'r.latitude as lat',
                        'r.longitude',
                        'r.longitude as long',
                    )
                    ->where("r.latitude >= :minx ")
                    ->andWhere("r.latitude <= :maxx")
                    ->andWhere("ABS(r.longitude) >= ABS(:miny)")
                    ->andWhere("ABS(r.longitude) <= ABS(:maxy)")
                    ->setParameter("minx", floatval($miny))
                    ->setParameter("maxx", floatval($maxy))
                    ->setParameter("miny", floatval($minx))
                    ->setParameter("maxy", floatval($maxx))
                    ->setMaxResults($taille)
                    ->orderBy('RAND()')
                    ->getQuery();


            return $query->getResult();;
    }


    public function getOneItemByID($id){
        return $this->createQueryBuilder("r")
                    ->select(
                        'r.id',
                        'r.nomFerme',
                        'r.nomFerme as nameFilter',
                        'r.adresseFerme',
                        'r.departement',
                        'r.departementName',
                        'r.produitFerme',
                        'r.email',
                        'r.engagementProd',
                        'r.fax',
                        'r.genre',
                        'r.horairesVenteAFerme',
                        'r.horairesVenteMagasinProd',
                        'r.horairesVenteAuMarche',
                        'r.accesHandicape',
                        'r.accesHandicapAuditif',
                        'r.accesHandicapMental',
                        'r.accesHandicapMotrice',
                        'r.accesHandicapVisuel',
                        'r.accesVoiture',
                        'r.adherentAdeve',
                        'r.agricultureBio',
                        'r.animauxAutoriser',
                        'r.atelier',
                        'r.carteBancaire',
                        'r.chequeVacance',
                        'r.degustation',
                        'r.marcherProduit',
                        'r.motDuFermier',
                        'r.produitFerme',
                        'r.produitFerme as ferme',
                        'r.codePostal',
                        'r.nomProprietaire',
                        'r.motDuFermier',
                        'r.ville',
                        'r.latitude as lat',
                        'r.longitude as long',
                    )
                    ->where("r.id =:id")
                    ->setParameter("id", $id)
                    ->getQuery()
                    ->getOneOrNullResult();
    }

    //    /**
    //     * @return FermeGeom[] Returns an array of FermeGeom objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('f')
    //            ->andWhere('f.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('f.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?FermeGeom
    //    {
    //        return $this->createQueryBuilder('f')
    //            ->andWhere('f.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
