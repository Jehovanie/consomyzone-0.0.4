<?php

namespace App\Repository;

use App\Entity\FermeGeom;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

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
                'p.adresseFerme',
                'p.latitude',
                'p.longitude',
                'p.addBy'
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

    ///jheo : prendre tous les fermes qui appartients dans un departement specifique
    public function getAllFermeInDepartement($nom_dep=null, $id_dep)
    {
        
        ///lancement de requette
        $qb = $this->createQueryBuilder('p')
            ->select(
                'p.id',
                'p.nomFerme',
                'p.adresseFerme',
                'p.departement',
                'p.departementName',
                'p.latitude',
                'p.longitude'
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
    public function getLatitudeLongitudeFerme()
    {

        // Remarque : $id_ferme dans la base peut parfois combinaison des lettres et des chiffres.
        $qb = $this->createQueryBuilder('p')
            ->select(
                'p.id',
                'p.nomFerme',
                'p.adresseFerme',
                'p.departement',
                'p.departementName',
                'p.latitude',
                'p.longitude'
            );

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
        // const { adresseFerme: add , departement: dep , departementName: depName, nomFerme: nom } = item ;
        // // showResultSearchNavBar("ferme", nom, add, dep, depName, id);
        $qb = $this->createQueryBuilder('p')
            ->select(
                'p.id',
                'p.nomFerme as nom',
                'p.adresseFerme as add',
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
            $qb =  $qb->where("p.adresseFerme LIKE :cles0")
                    ->orWhere("p.departement LIKE :cles0")
                    ->orWhere("p.departementName LIKE :cles0")
                    ->orWhere("p.nomFerme LIKE :cles0")
                    ->orWhere("p.codePostal LIKE :cles0")
                    ->orWhere("p.motDuFermier LIKE :cles0")
                    ->orWhere("p.nomProprietaire LIKE :cles0")
                    ->setParameter('cles0', '%'. $mot_cles0. '%' );

        }else if ( $mot_cles0 === "" && $mot_cles1 !== "" ){
            $qb =  $qb->where("p.adresseFerme LIKE :cles1")
                    ->orWhere("p.departement LIKE :cles1")
                    ->orWhere("p.departementName LIKE :cles1")
                    ->orWhere("p.codePostal LIKE :cles1")
                    ->orWhere("p.nomFerme LIKE :cles1")
                    ->orWhere("p.motDuFermier LIKE :cles1")
                    ->orWhere("p.nomProprietaire LIKE :cles1")
                    ->setParameter('cles1', '%'. $mot_cles1. '%' );

        }else{
            $qb =  $qb->where("(p.departementName LIKE :cles0) AND (p.adresseFerme LIKE :cles1)")
                ->orWhere("(p.nomFerme LIKE :cles0) AND (p.adresseFerme LIKE :cles1)")
                ->orWhere("(p.nomProprietaire LIKE :cles0) AND (p.adresseFerme LIKE :cles1)")
                ->orWhere("(p.departementName LIKE :cles0) AND (p.departement LIKE :cles1)")
                ->orWhere("(p.nomFerme LIKE :cles0) AND (p.departement LIKE :cles1)")
                ->orWhere("(p.nomFerme LIKE :cles0) AND (p.nomProprietaire LIKE :cles1)")
                ->orWhere("(p.nomProprietaire LIKE :cles0) AND (p.departement LIKE :cles1)")
                ->orWhere("(p.departementName LIKE :cles0) OR (p.departementName LIKE :cles1)")
                ->setParameter('cles0', '%'. $mot_cles0. '%' )
                ->setParameter('cles1', '%'. $mot_cles1. '%' );
        }
        
        $qb = $qb->setFirstResult($page_current)
                ->setMaxResults($size)
                ->orderBy('p.nomFerme', 'ASC')
                ->getQuery();

        $results = $qb->execute();

        $count = $this->createQueryBuilder("p")
                ->select("COUNT(p.id) as total");

        if( $mot_cles0 !=="" && $mot_cles1 === "" ){
            $count =  $count->where("p.adresseFerme LIKE :cles0")
                    ->orWhere("p.departement LIKE :cles0")
                    ->orWhere("p.departementName LIKE :cles0")
                    ->orWhere("p.nomFerme LIKE :cles0")
                    ->orWhere("p.codePostal LIKE :cles0")
                    ->orWhere("p.motDuFermier LIKE :cles0")
                    ->orWhere("p.nomProprietaire LIKE :cles0")
                    ->setParameter('cles0', '%'. $mot_cles0. '%' );

        }else if ( $mot_cles0 === "" && $mot_cles1 !== "" ){
            $count =  $count->where("p.adresseFerme LIKE :cles1")
                    ->orWhere("p.departement LIKE :cles1")
                    ->orWhere("p.departementName LIKE :cles1")
                    ->orWhere("p.codePostal LIKE :cles1")
                    ->orWhere("p.nomFerme LIKE :cles1")
                    ->orWhere("p.motDuFermier LIKE :cles1")
                    ->orWhere("p.nomProprietaire LIKE :cles1")
                    ->setParameter('cles1', '%'. $mot_cles1. '%' );

        }else{
            $count =  $count->where("(p.departementName LIKE :cles0) AND (p.adresseFerme LIKE :cles1)")
                ->orWhere("(p.nomFerme LIKE :cles0) AND (p.adresseFerme LIKE :cles1)")
                ->orWhere("(p.nomProprietaire LIKE :cles0) AND (p.adresseFerme LIKE :cles1)")
                ->orWhere("(p.departementName LIKE :cles0) AND (p.departement LIKE :cles1)")
                ->orWhere("(p.nomFerme LIKE :cles0) AND (p.departement LIKE :cles1)")
                ->orWhere("(p.nomFerme LIKE :cles0) AND (p.nomProprietaire LIKE :cles1)")
                ->orWhere("(p.nomProprietaire LIKE :cles0) AND (p.departement LIKE :cles1)")
                ->orWhere("(p.departementName LIKE :cles0) OR (p.departementName LIKE :cles1)")
                ->setParameter('cles0', '%'. $mot_cles0. '%' )
                ->setParameter('cles1', '%'. $mot_cles1. '%' );
        }
        
        $count = $count->getQuery()
            ->getResult();
        
        
        return [ $results , $count[0]["total"] , "ferme"];
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
