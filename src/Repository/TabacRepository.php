<?php

namespace App\Repository;

use App\Entity\Tabac;
use App\Service\DepartementService;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;

/**
 * @extends ServiceEntityRepository<Tabac>
 *
 * @method Tabac|null find($id, $lockMode = null, $lockVersion = null)
 * @method Tabac|null findOneBy(array $criteria, array $orderBy = null)
 * @method Tabac[]    findAll()
 * @method Tabac[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class TabacRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Tabac::class);
    }

    public function add(Tabac $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(Tabac $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    
    public function getCount($nom_dep=null, $id_dep=null){

        if ($nom_dep || $id_dep) {
            $qb = $this->createQueryBuilder('p')
                ->select('count(p.id)')
                ->where('p.dep = :k')
                ->setParameter('k', intval($id_dep));
        } else {
            $qb = $this->createQueryBuilder('p')
                ->select('count(p.id)');
        }

        $qb= $qb->setMaxResults(1);

        $query = $qb->getQuery()
                    ->execute();
        
        return $query[0][1];
    }


    /**
     * @author Jehovanie RAMANDRIJOEL <jehovenierama@gmail.com>
     * 
     * Get random data 
     * 
     * @param integer $limits: number of the data to get
     * 
     * @return array Tabac
    */
    public function getSomeDataShuffle($limits= 1000){
        $results=[];
        $data=  $this->createQueryBuilder("r")
                ->select(
                    'r.id',
                    'r.clenum',
                    'r.denomination_f',
                    'r.denomination_f as name',
                    'r.denomination_f as nameFilter',
                    'r.denomination_f as tabac',
                    'r.numvoie',
                    'r.typevoie',
                    'r.nomvoie',
                    'r.compvoie',
                    'r.codpost',
                    'r.villenorm',
                    'r.commune',
                    'r.codinsee',
                    'r.siren',
                    'r.tel',
                    'r.tel as telephone',
                    'r.bureau_tabac',
                    'r.tabac_presse',
                    'r.bar_tabac',
                    'r.hotel_tabac',
                    'r.cafe_tabac',
                    'r.site_1',
                    'r.site_2',
                    'r.fonctionalite_1',
                    'r.horaires_1',
                    'r.prestation_1',
                    'r.codens',
                    'r.poi_qualitegeorue',
                    'r.dcomiris',
                    'r.dep',
                    'r.dep_name',
                    'r.dep_name as nom_dep',
                    'r.dep_name as depName',
                    'r.date_data',
                    'r.date_inser',
                    'r.poi_x as long',
                    'r.poi_y as lat',
                )
                ->orderBy('RAND()')
                ->setMaxResults($limits)
                ->getQuery()
                ->getResult();
       
        return $data;
    }

    /**
     * @author Jehovanie RAMANDRIJOEL <jehovenierama@gmail.com>
     * 
     * Get random data 
     * 
     * @param integer $limits: number of the data to get
     * 
     * @return array Tabac
    */
    public function getDataBetweenAnd($minx,$miny,$maxx,$maxy , $idDep= null, $taille= 200){
        $results=[];
        $data=  $this->createQueryBuilder("r")
                ->select(
                    'r.id',
                    'r.clenum',
                    'r.denomination_f',
                    'r.denomination_f as name',
                    'r.denomination_f as nameFilter',
                    'r.denomination_f as tabac',
                    'r.numvoie',
                    'r.typevoie',
                    'r.nomvoie',
                    'r.compvoie',
                    'r.codpost',
                    'r.villenorm',
                    'r.commune',
                    'r.codinsee',
                    'r.siren',
                    'r.tel',
                    'r.tel as telephone',
                    'r.bureau_tabac',
                    'r.tabac_presse',
                    'r.bar_tabac',
                    'r.hotel_tabac',
                    'r.cafe_tabac',
                    'r.site_1',
                    'r.site_2',
                    'r.fonctionalite_1',
                    'r.horaires_1',
                    'r.prestation_1',
                    'r.codens',
                    'r.poi_qualitegeorue',
                    'r.dcomiris',
                    'r.dep',
                    'r.dep_name',
                    'r.dep_name as nom_dep',
                    'r.dep_name as depName',
                    'r.date_data',
                    'r.date_inser',
                    'r.poi_x',
                    'r.poi_y',
                    'r.poi_x as long',
                    'r.poi_y as lat',
                )
                ->where( "r.poi_x >= :minx" )
                ->andWhere( "r.poi_x <= :maxx" )
                ->andWhere( "r.poi_y >= :miny" )
                ->andWhere( "r.poi_y <= :maxy" )
                ->setParameter( "minx", $minx )
                ->setParameter( "maxx", $maxx )
                ->setParameter( "miny", $miny )
                ->setParameter( "maxy", $maxy )
                ->orderBy('RAND()')
                ->getQuery()
                ->setMaxResults($taille)
                ->getResult();
       
        return $data;
    }

    public function getOneItemByID($id){

        $data=  $this->createQueryBuilder("r")
                ->select(
                    'r.id',
                    'r.clenum',
                    'r.denomination_f',
                    'r.denomination_f as name',
                    'r.denomination_f as nameFilter',
                    'r.denomination_f as tabac',
                    'r.numvoie',
                    'r.typevoie',
                    'r.nomvoie',
                    'r.compvoie',
                    'r.codpost',
                    'r.villenorm',
                    'r.commune',
                    'r.codinsee',
                    'r.siren',
                    'r.tel',
                    'r.tel as telephone',
                    'r.bureau_tabac',
                    'r.tabac_presse',
                    'r.bar_tabac',
                    'r.hotel_tabac',
                    'r.cafe_tabac',
                    'r.site_1',
                    'r.site_2',
                    'r.fonctionalite_1',
                    'r.horaires_1',
                    'r.prestation_1',
                    'r.codens',
                    'r.poi_qualitegeorue',
                    'r.dcomiris',
                    'r.dep',
                    'r.dep_name',
                    'r.dep_name as nom_dep',
                    'r.dep_name as depName',
                    'r.date_data',
                    'r.date_inser',
                    'r.poi_x as long',
                    'r.poi_y as lat',
                )
                ->where("r.id =:id")
                ->setParameter("id", $id)
                ->getQuery()
                ->getOneOrNullResult();
       
        return $data;
    }

    
    ///jheo : prendre tous les Tabac qui appartients dans un departement specifique
    public function getGolfByDep($nom_dep, $id_dep)
    {
        ///lancement de requette
        $data = $this->createQueryBuilder('r')
            ->select("
                r.id,
                r.clenum,
                r.denomination_f,
                r.denomination_f as nom,
                r.denomination_f as name,
                r.denomination_f as nameFilter,   
                r.numvoie,
                r.typevoie,
                r.nomvoie,
                r.compvoie,
                r.codpost,
                r.villenorm,
                r.commune,
                r.codinsee,
                r.siren,
                r.tel,
                r.tel as telephone,
                r.bureau_tabac,
                r.tabac_presse,
                r.bar_tabac,
                r.hotel_tabac,
                r.cafe_tabac,
                r.site_1,
                r.site_2,
                r.fonctionalite_1,
                r.horaires_1,
                r.prestation_1,
                r.codens,
                r.poi_qualitegeorue,
                r.dcomiris,
                r.dep,
                r.dep_name,
                r.dep_name as nom_dep,
                r.dep_name as depName,
                r.date_data,
                r.date_inser,
                r.poi_x as long,
                r.poi_y as lat,
                CONCAT(r.numvoie,' ', r.typevoie,' ', r.nomvoie,' ', r.codpost,' ', r.villenorm) as add"
            )
            ->where('r.dep = :k')
            ->setParameter('k',  $id_dep)
            ->getQuery()
            ->execute();
        return $data;
    }

    ///jheo : prendre tous les Tabac qui appartients dans un departement specifique
    public function getGolfByDepMobile($nom_dep, $id_dep, $limit = 2000, $offset = 0)
    {
        ///lancement de requette
        $data = $this->createQueryBuilder('r')
            ->select(
                "
                r.id,
                r.clenum,
                r.denomination_f,
                r.denomination_f as nom,
                r.denomination_f as name,
                r.denomination_f as nameFilter,
                r.numvoie,
                r.typevoie,
                r.nomvoie,
                r.compvoie,
                r.codpost,
                r.villenorm,
                r.commune,
                r.codinsee,
                r.siren,
                r.tel,
                r.tel as telephone,
                r.bureau_tabac,
                r.tabac_presse,
                r.bar_tabac,
                r.hotel_tabac,
                r.cafe_tabac,
                r.site_1,
                r.site_2,
                r.fonctionalite_1,
                r.horaires_1,
                r.prestation_1,
                r.codens,
                r.poi_qualitegeorue,
                r.dcomiris,
                r.dep,
                r.dep_name,
                r.dep_name as nom_dep,
                r.dep_name as depName,
                r.date_data,
                r.date_inser,
                r.poi_x as long,
                r.poi_y as lat,
                CONCAT(r.numvoie,' ', r.typevoie,' ', r.nomvoie,' ', r.codpost,' ', r.villenorm) as add"
            )
            ->where('r.dep = :k')
            ->setParameter('k',  $id_dep)
            ->orderBy('r.id', 'ASC')
            ->setMaxResults($limit)
            ->setFirstResult($offset)
            ->getQuery()
            ->execute();
        return $data;
    }

    ///jheo : prendre tous les Tabac qui appartients dans un departement specifique
    public function getGolfByDepSearchMobile($nom_dep, $id_dep, $id_tabac)
    {
        ///lancement de requette
        $data = $this->createQueryBuilder('r')
            ->select(
                "
                r.id,
                r.clenum,
                r.denomination_f,
                r.denomination_f as nom,
                r.denomination_f as name,
                r.denomination_f as nameFilter,
                r.numvoie,
                r.typevoie,
                r.nomvoie,
                r.compvoie,
                r.codpost,
                r.villenorm,
                r.commune,
                r.codinsee,
                r.siren,
                r.tel,
                r.tel as telephone,
                r.bureau_tabac,
                r.tabac_presse,
                r.bar_tabac,
                r.hotel_tabac,
                r.cafe_tabac,
                r.site_1,
                r.site_2,
                r.fonctionalite_1,
                r.horaires_1,
                r.prestation_1,
                r.codens,
                r.poi_qualitegeorue,
                r.dcomiris,
                r.dep,
                r.dep_name,
                r.dep_name as nom_dep,
                r.dep_name as depName,
                r.date_data,
                r.date_inser,
                r.poi_x as long,
                r.poi_y as lat,
                CONCAT(r.numvoie,' ', r.typevoie,' ', r.nomvoie,' ', r.codpost,' ', r.villenorm) as add"
            )
            ->where('r.dep = :k')
            ->andwhere('r.id = :id')
            ->setParameter('k',  $id_dep)
            ->setParameter('id',  $id_tabac)
            ->orderBy('r.id', 'ASC')
            ->getQuery()
            ->execute();
        return $data;
    }


    public function getOneTabac($tabacID){
        $data = $this->createQueryBuilder('r')
            ->select(
                'r.id',
                'r.clenum',
                'r.denomination_f',
                'r.denomination_f as nom',
                'r.denomination_f as nameFilter',
                'r.numvoie',
                'r.typevoie',
                'r.nomvoie',
                'r.compvoie',
                'r.codpost',
                'r.villenorm',
                'r.commune',
                'r.codinsee',
                'r.siren',
                'r.tel',
                'r.bureau_tabac',
                'r.tabac_presse',
                'r.bar_tabac',
                'r.hotel_tabac',
                'r.cafe_tabac',
                'r.site_1',
                'r.site_2',
                'r.fonctionalite_1',
                'r.horaires_1',
                'r.prestation_1',
                'r.codens',
                'r.poi_qualitegeorue',
                'r.dcomiris',
                'r.dep',
                'r.dep_name',
                'r.dep_name as nom_dep',
                'r.dep_name as depName',
                'r.date_data',
                'r.date_inser',
                'r.poi_x as longitude',
                'r.poi_y as latitude',
            )
            ->where('r.id = :k')
            ->setParameter('k',  $tabacID)
            ->getQuery()
            ->getOneOrNullResult();
        
        // dd($data);
        return $data;
    }

    public function getBySpecificClef(string $mot_cles0, string $mot_cles1, int $page = 0, $size=20){

        $mot_cles1 = strlen($mot_cles1) === 1 ? "0". $mot_cles1 : $mot_cles1;

        $departementService = new DepartementService();

        $departement = $departementService->getDepWithKeyNomDep();

        if(array_key_exists(strtolower($mot_cles1), $departement)){
            $mot_cles1 = $departement[strtolower($mot_cles1)];
        }

        $qb = $this->createQueryBuilder("p")
                ->select("p.id,
                        p.id as id_etab,
                        p.clenum,
                        p.dep,
                        p.dep_name,
                        p.dep_name as nom_dep,
                        p.dep_name as depName,
                        p.numvoie,
                        p.typevoie,
                        p.commune,
                        p.codinsee,
                        p.siren,
                        p.villenorm,
                        p.codpost,
                        p.bureau_tabac,
                        p.tabac_presse,
                        p.bar_tabac,
                        p.hotel_tabac,
                        p.cafe_tabac,
                        p.site_1,
                        p.site_2,
                        p.fonctionalite_1,
                        p.horaires_1,
                        p.prestation_1,
                        p.codens,
                        p.poi_qualitegeorue,
                        p.dcomiris,
                        p.denomination_f,
                        p.denomination_f as nom,
                        p.denomination_f as tabac,
                        p.nomvoie,
                        p.compvoie,
                        p.denomination_f as name,
                        p.denomination_f as nameFilter,
                        p.dep as id_dep,
                        p.dep_name as departement,
                        CONCAT(p.numvoie,' ',p.typevoie, ' ',p.nomvoie, ' ',p.codpost, ' ',p.villenorm) as adresse,
                        p.tel,
                        p.date_data,
                        p.date_inser,
                        p.poi_x as long,
                        p.poi_y as lat,
                        CONCAT(p.numvoie,' ',p.typevoie, ' ',p.nomvoie) as rue,
                        CONCAT(p.numvoie,' ',p.typevoie, ' ',p.nomvoie, ' ',p.codpost, ' ',p.villenorm) as add");
                        
        if( $mot_cles0 !== "" && $mot_cles1 === "" ){

            if( strlen($mot_cles0) <= 2 ){
                
                $qb = $qb->where("p.denomination_f LIKE :cles0")
                         ->setParameter('cles0', '%'. $mot_cles0. '%' );
            }else{
                    $qb = $qb->where("REPLACE(p.denomination_f) LIKE :cles0")
                             ->setParameter('cles0', '%' . $mot_cles0. '%');
            }
                
        }elseif ($mot_cles0 === "" && $mot_cles1 !== "" ){
            if( strlen($mot_cles1) <= 2 ){
                
                $qb = $qb->where("p.dep LIKE :cles1")
                         ->setParameter('cles1', $mot_cles1 );
            }else{
                $qb = $qb->where("REPLACE(CONCAT(p.numvoie,' ',p.typevoie, ' ',p.nomvoie, ' ',p.codpost, ' ',p.villenorm)) LIKE :cles1")
                         ->setParameter('cles1', '%'. $mot_cles1. '%' );
            }

        }else{

            if(strtolower($mot_cles0) == "tabac" || strtolower($mot_cles0) == "tabacs" || strtolower($mot_cles0) == "bureau tabac"  || strtolower($mot_cles0) == "bureaux tabacs"){
                if( strlen($mot_cles1) <= 2 ){
                    $qb = $qb->where("p.dep LIKE :cles1")
                            ->setParameter('cles1',  $mot_cles1 );
                }else{
                    $qb = $qb->where("REPLACE(CONCAT(p.numvoie,' ',p.typevoie, ' ',p.nomvoie, ' ',p.codpost, ' ',p.villenorm)) LIKE :cles1 ")
                            ->setParameter('cles1', '%'. $mot_cles1. '%' );
                }
            }else{

                if( strlen($mot_cles1) <= 2 ){
                
                    $qb = $qb->where("REPLACE(p.denomination_f) LIKE :cles0 AND p.dep LIKE :cles1")
                             ->setParameter('cles0', '%'. $mot_cles0. '%' )
                             ->setParameter('cles1', '%'. $mot_cles1. '%' );
                }else{
    
                    $qb = $qb->where("(REPLACE(p.denomination_f) LIKE :cles0) AND (REPLACE(CONCAT(p.numvoie,' ',p.typevoie, ' ',p.nomvoie, ' ',p.codpost, ' ',p.villenorm)) LIKE :cles1 )")
                             ->setParameter('cles0', '%'. $mot_cles0. '%' )
                             ->setParameter('cles1', '%'. $mot_cles1. '%' );

                }

            }
            
        }

        $qb = $qb->getQuery();

        $results = $qb->execute();

        return [ $results , count($results) , "tabac"];
    }

    public function getBySpecificClefOther(string $mot_cles0, string $mot_cles1, int $page = 0, $size=20){

        $mot_cles1 = strlen($mot_cles1) === 1 ? "0". $mot_cles1 : $mot_cles1;

        $departementService = new DepartementService();

        $departement = $departementService->getDepWithKeyNomDep();
        
        if(array_key_exists(strtolower($mot_cles1), $departement)){
            $mot_cles1 = $departement[strtolower($mot_cles1)];
        }

        $qb = $this->createQueryBuilder("p")
                ->select("p.id,
                        p.id as id_etab,
                        p.clenum,
                        p.dep,
                        p.dep_name,
                        p.dep_name as nom_dep,
                        p.dep_name as depName,
                        p.numvoie,
                        p.typevoie,
                        p.commune,
                        p.codinsee,
                        p.siren,
                        p.villenorm,
                        p.codpost,
                        p.bureau_tabac,
                        p.tabac_presse,
                        p.bar_tabac,
                        p.hotel_tabac,
                        p.cafe_tabac,
                        p.site_1,
                        p.site_2,
                        p.fonctionalite_1,
                        p.horaires_1,
                        p.prestation_1,
                        p.codens,
                        p.poi_qualitegeorue,
                        p.dcomiris,
                        p.denomination_f,
                        p.denomination_f as nom,
                        p.denomination_f as tabac,
                        p.nomvoie,
                        p.compvoie,
                        p.denomination_f as name,
                        p.denomination_f as nameFilter,
                        p.dep as id_dep,
                        p.dep_name as departement,
                        CONCAT(p.numvoie,' ',p.typevoie, ' ',p.nomvoie, ' ',p.codpost, ' ',p.villenorm) as adresse,
                        p.tel,
                        p.date_data,
                        p.date_inser,
                        p.poi_x as long,
                        p.poi_y as lat,
                        CONCAT(p.numvoie,' ',p.typevoie, ' ',p.nomvoie) as rue,
                        CONCAT(p.numvoie,' ',p.typevoie, ' ',p.nomvoie, ' ',p.codpost, ' ',p.villenorm) as add");
                        
        if( $mot_cles0 !== "" && $mot_cles1 === "" ){

            if( strlen($mot_cles0) <= 2 ){
                
                $qb = $qb->where("p.denomination_f LIKE :cles0")
                         ->setParameter('cles0', '%'. $mot_cles0. '%' );
            }else{
                
                $qb = $qb->where("MATCH_AGAINST(p.denomination_f) AGAINST( :cles0 boolean) > 0")
                    ->orWhere("p.denomination_f LIKE :cles0")
                    ->setParameter('cles0', '%' . $mot_cles0. '%');
            }
                
        }elseif ($mot_cles0 === "" && $mot_cles1 !== "" ){
            if( strlen($mot_cles1) <= 2 ){
                $qb = $qb->where("p.dep LIKE :cles1")
                         ->setParameter('cles1', $mot_cles1 );
            }else{
                $qb = $qb->where("MATCH_AGAINST(p.numvoie, p.typevoie, p.nomvoie, p.codpost, p.villenorm) AGAINST( :cles1 boolean) > 0")
                         ->orWhere("CONCAT(p.numvoie,' ',p.typevoie, ' ',p.nomvoie, ' ',p.codpost, ' ',p.villenorm) LIKE :cles1")
                         ->setParameter('cles1', '%'. $mot_cles1. '%' );
            }

        }else{

            if(strtolower($mot_cles0) == "tabac" || strtolower($mot_cles0) == "tabacs" || strtolower($mot_cles0) == "bureau tabac"  || strtolower($mot_cles0) == "bureaux tabacs"){
                if( strlen($mot_cles1) <= 2 ){
                    $qb = $qb->where("p.dep LIKE :cles1")
                            ->setParameter('cles1',  $mot_cles1 );
                }else{
                    $qb = $qb->where("REPLACE(CONCAT(p.numvoie,' ',p.typevoie, ' ',p.nomvoie, ' ',p.codpost, ' ',p.villenorm)) LIKE :cles1 ")
                            ->setParameter('cles1', '%'. $mot_cles1. '%' );
                }
            }else{

                if( strlen($mot_cles1) <= 2 ){

                    $qb = $qb->where("MATCH_AGAINST(p.denomination_f) AGAINST( :cles0 boolean) > 0 AND p.dep LIKE :cles1")
                             ->orWhere("p.denomination_f LIKE :cles0 AND p.dep LIKE :cles1")
                             ->setParameter('cles0', '%'. $mot_cles0. '%' )
                             ->setParameter('cles1', '%'. $mot_cles1. '%' );

                }else{

                    $qb = $qb->where("(MATCH_AGAINST(p.denomination_f) AGAINST( :cles0 boolean) > 0) OR (MATCH_AGAINST(p.numvoie, p.typevoie, p.nomvoie, p.codpost, p.villenorm) AGAINST( :cles1 boolean) > 0)")
                             ->orWhere("(p.denomination_f LIKE :cles0) OR (CONCAT(p.numvoie,' ',p.typevoie, ' ',p.nomvoie, ' ',p.codpost, ' ',p.villenorm) LIKE :cles1 )")
                             ->setParameter('cles0', '%'. $mot_cles0. '%' )
                             ->setParameter('cles1', '%'. $mot_cles1. '%' );

                }

            }
            
        }

        $qb = $qb->getQuery();

        $results = $qb->execute();

        return [ $results , count($results) , "tabac"];
    }

}
