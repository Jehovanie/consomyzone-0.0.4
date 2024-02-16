<?php

namespace App\Repository;

use App\Entity\Marche;
use App\Service\DepartementService;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;

/**
 * @extends ServiceEntityRepository<Marche>
 *
 * @method Marche|null find($id, $lockMode = null, $lockVersion = null)
 * @method Marche|null findOneBy(array $criteria, array $orderBy = null)
 * @method Marche[]    findAll()
 * @method Marche[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class MarcheRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Marche::class);
    }

    public function add(Marche $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(Marche $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    /**
     *  @author update by Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
     * 
     *  Goal: Get the number of elements per department is idDep is null, and count all if else.
     *  Use in: MarcheController.php , ... 
     *  
     *  @param {integer|null } $idDep: code de departement
     * 
     *  @return {integer} number of elements in departement or all
     *  
     */
    function getAccountMarche($idDep=null){
        $qb= $this->createQueryBuilder("r");
        $qb->select(
            $qb->expr()->countDistinct(
                $qb->expr()->concat(
                    'r.id', "' '",
                    'r.dep',"' '",
                    'r.denominationF',"' '",
                    'r.clenum',"' '",
                    'r.adresse',"' '",
                    'r.codpost',"' '",
                    'r.commune',"' '",
                    'r.villenorm',"' '",
                    'r.specificite',"' '",
                    'r.codinsee'
                )
            )
        );

        if( $idDep ){
            $qb = $qb->where("r.dep =:dep")
                     ->setParameter("dep", $idDep);
        }

        $scalar_result= $qb->getQuery()->getSingleScalarResult();
        return $scalar_result;
    }

    /**
     * @author Jehovanie RAMANDRIJOEL <jehovanierama@gmail.com>
     * 
     * @param null|integer $code_dep,
     * 
     * Similar of the getAccountMarche but not returns a scalar
     * but object like array ( deparement , number total ) if there is no departement specified
     * 
     * Use in: HomeController.php
     * 
     * @return array [ [ "departement" => .., "account_per_dep" => ... ], ... ]
     */
    function getAccountAllPerDep($code_dep=null){
        $qb = $this->createQueryBuilder('r');
        $qb->select(
            $qb->expr()->countDistinct(
                $qb->expr()->concat(
                    'r.id', "' '",
                    'r.dep',"' '",
                    'r.denominationF',"' '",
                    'r.clenum',"' '",
                    'r.adresse',"' '",
                    'r.codpost',"' '",
                    'r.commune',"' '",
                    'r.villenorm',"' '",
                    'r.specificite',"' '",
                    'r.codinsee'
                )
            ) . ' as account_per_dep',
            'r.dep as departement'
        )->groupBy('r.dep');
        
        if( $code_dep != null ){
            if( intval($code_dep) === 20 ){
                $qb = $qb->where('r.dep = :depA')
                         ->andWhere('r.dep = :depB')                   
                         ->setParameter('depA', '2A')
                         ->setParameter('depB', '2B');
            }else{
                $qb = $qb->where('r.dep = :dep')
                         ->setParameter('dep', $code_dep);
            }
          
        }

        $result= $qb->getQuery()->getResult();

        return count($result) > 0 ? $result : [ 
            [ 
                "departement" => $code_dep,
                "account_per_dep" => 0 
            ]
        ];
    }

    /**
     * @author Jehovanie RAMANDRIJOEL <jehovenierama@gmail.com>
     * 
     * Get random data 
     * Use in MarcheController
     * 
     * @param integer $id_dep: specifique departement
     * @param integer $limits: number of the data to get
     * 
     * @return array Resto
     */
    public function getSomeDataShuffle($id_dep=null, $limits= 1000){
        $query=  $this->createQueryBuilder("r");

        $query= $query->select(
                        "r.id,
                        r.clenum,
                        r.denominationF,
                        r.denominationF as nameFilter,
                        r.adresse,
                        r.codpost,
                        r.commune,
                        r.codinsee,
                        r.villenorm,
                        r.specificite,
                        r.jour_de_marche_1 as marche,
                        r.jour_de_marche_1,
                        r.jour_de_marche_2,
                        r.jour_de_marche_3,
                        r.jour_de_marche_4,
                        r.jour_de_marche_5,
                        r.jour_de_marche_6,
                        r.jour_de_marche_7,
                        r.poi_qualitegeorue,
                        r.dcomiris,
                        r.dep,
                        r.date_data,
                        r.date_inser,
                        r.poiY as lat,
                        r.poiX as long"
                )->distinct(
                    $query->expr()->concat(
                        'r.id', "' '",
                        'r.dep',"' '",
                        'r.denominationF',"' '",
                        'r.clenum',"' '",
                        'r.adresse',"' '",
                        'r.nomvoie',"' '",
                        'r.compvoie',"' '",
                        'r.villenorm',"' '",
                        'r.poiX',"' '",
                        'r.poiY'
                    )
                );

        if( $id_dep != null ){
            $query= $query->where("r.dep =:dep")
                          ->setParameter("dep",$id_dep);
        }

        return $query->orderBy('RAND()')
                    ->setMaxResults($limits)
                    ->getQuery()
                    ->getResult();
    }

    /**
     *  @author updated by Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
     *  
     *  Goal: Get data Marche between bound latitude and longitude 
     *  Use in: MarcheController.php, ... 
     * 
     *  @param {decimal} $minx,$miny, $maxx, $maxy: lat long min and max delimite the bound
     *         {integer|null} $idDep code of departement if this sepecified
     *         {integer} number data to return by default 250
     * 
     *  @return {array} list of the Marche.
     */
    public function getDataBetweenAnd($minx, $miny, $maxx, $maxy, $idDep= null, $taille= 250){
        $query = $this->createQueryBuilder("r");

        $query = $query->select(
                        "r.id,
                        r.clenum,
                        r.denominationF,
                        r.denominationF as nameFilter,
                        r.adresse,
                        r.codpost,
                        r.commune,
                        r.codinsee,
                        r.villenorm,
                        r.specificite,
                        r.jour_de_marche_1 as marche,
                        r.jour_de_marche_1,
                        r.jour_de_marche_2,
                        r.jour_de_marche_3,
                        r.jour_de_marche_4,
                        r.jour_de_marche_5,
                        r.jour_de_marche_6,
                        r.jour_de_marche_7,
                        r.poi_qualitegeorue,
                        r.dcomiris,
                        r.dep,
                        r.date_data,
                        r.date_inser,
                        r.poiY as lat,
                        r.poiX as long"
                    )
                    ->distinct(
                        $query->expr()->concat(
                            'r.id', "' '",
                            'r.dep',"' '",
                            'r.denominationF',"' '",
                            'r.clenum',"' '",
                            'r.adresse',"' '",
                            'r.nomvoie',"' '",
                            'r.compvoie',"' '",
                            'r.villenorm',"' '",
                            'r.poiX',"' '",
                            'r.poiY'
                        ))
                    ->where("r.poiX >= :minx")
                    ->andWhere("r.poiX <= :maxx")
                    ->andWhere("r.poiY >= :miny")
                    ->andWhere("r.poiY <= :maxy")
                    ->setParameter("minx", $minx)
                    ->setParameter("maxx", $maxx)
                    ->setParameter("miny", $miny)
                    ->setParameter("maxy", $maxy);
                                        
        if( $idDep ){
            $query = $query->andWhere("r.dep =:dep")
                           ->setParameter("dep", $idDep);
        }

        return $query->orderBy('RAND()')
                    ->setMaxResults($taille)
                    ->getQuery()
                    ->getResult();
    }

    /**
     * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
     * 
     * Goal: Get on element by the id
     * Use in: MarcheController.php
     */
    public function getOneItemByID($id){
        return  $this->createQueryBuilder("r")
                ->select(
                    "r.id,
                    r.clenum,
                    r.denominationF,
                    r.denominationF as nameFilter,
                    r.adresse,
                    r.codpost,
                    r.commune,
                    r.codinsee,
                    r.villenorm,
                    r.specificite,
                    r.jour_de_marche_1,
                    r.jour_de_marche_2,
                    r.jour_de_marche_3,
                    r.jour_de_marche_4,
                    r.jour_de_marche_5,
                    r.jour_de_marche_6,
                    r.jour_de_marche_7,
                    r.poi_qualitegeorue,
                    r.dcomiris,
                    r.dep,
                    r.date_data,
                    r.date_inser,
                    r.poiY as lat,
                    r.poiX as long"
                )
                ->where("r.id =:id")
                ->setParameter("id", $id)
                ->getQuery()
                ->getOneOrNullResult();
    }

    /**
     * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
     * 
     * Goal: Get all marche in departement.
     * Use in: MarcheController.php
     */
    public function getAllRestoIdForSpecificDepartement($dep){

        return $this->createQueryBuilder("r")
            ->select(
                "r.id,
                r.id as id_etab,
                r.denominationF as nom,
                r.denominationF as nameFilter,
                r.denominationF,
                r.adresse,
                r.adresse as add,
                r.adresse as rue,
                r.codpost,
                r.villenorm,
                r.commune,
                r.specificite,
                r.jour_de_marche_1,
                r.jour_de_marche_2,
                r.jour_de_marche_3,
                r.jour_de_marche_4,
                r.jour_de_marche_5,
                r.jour_de_marche_6,
                r.jour_de_marche_7,
                r.dep,
                r.poiX,
                r.poiY,
                r.poiX as long,
                r.poiY as lat"
            )
            ->where("r.dep =:dep")
            ->setParameter("dep",$dep)
            ->getQuery()
            ->getResult();
    }

    ///jheo : getByCles 
    public function getBySpecificClef(string $mot_cles0, string $mot_cles1, int $page = 0, $size=20){
        $departementService = new DepartementService();
        $departement = $departementService->getDepWithKeyNomDep();

        if(array_key_exists(strtolower($mot_cles1), $departement)){
            $mot_cles1 = $departement[strtolower($mot_cles1)];
            $mot_cles1= intval($mot_cles1);
        }

        $qb = $this->createQueryBuilder("p")
                ->select(
                    "p.id,
                    p.clenum,
                    p.denominationF,
                    p.denominationF as nom,
                    p.denominationF as nameFilter,
                    p.adresse,
                    p.adresse as add,
                    p.codpost,
                    p.commune,
                    p.codinsee,
                    p.villenorm,
                    p.specificite,
                    p.jour_de_marche_1 as marche,
                    p.jour_de_marche_1,
                    p.jour_de_marche_2,
                    p.jour_de_marche_3,
                    p.jour_de_marche_4,
                    p.jour_de_marche_5,
                    p.jour_de_marche_6,
                    p.jour_de_marche_7,
                    p.poi_qualitegeorue,
                    p.dcomiris,
                    p.dep,
                    p.dep as depName,
                    p.date_data,
                    p.date_inser,
                    p.poiY as lat,
                    p.poiX as long"
                );

        if( $mot_cles0 !== "" && $mot_cles1 === "" ){

            if( strlen($mot_cles0) <= 2 ){
                
                $qb = $qb->where("p.denominationF LIKE :cles0")
                         ->setParameter('cles0', '%'. $mot_cles0. '%' );
            }else{
                $qb = $qb->where("REPLACE(p.denominationF) LIKE :cles0")
                            ->setParameter('cles0', '%' . $mot_cles0. '%');
            }
                
        }else if ($mot_cles0 === "" && $mot_cles1 !== "" ){
            if( strlen($mot_cles1) <= 2 ){
                $qb = $qb->where("p.dep LIKE :cles1")
                         ->setParameter('cles1', $mot_cles1 );
            }else{
                $qb = $qb->where("REPLACE(p.adresse) LIKE :cles1")
                         ->setParameter('cles1', '%'. $mot_cles1. '%' );
            }

        }else {
            if(strtolower($mot_cles0) === "marche" || strtolower($mot_cles0) === "marché" || strtolower($mot_cles0) == "marches"){
                if( strlen($mot_cles1) <= 2 ){
                    $qb = $qb->where("p.dep LIKE :cles1")
                             ->setParameter('cles1',  $mot_cles1 );
                }else{
                    //dd("p.numvoie,' ',p.typevoie, ' ',p.nomvoie, ' ',p.codpost, ' ',p.villenorm");
                    $qb = $qb->where("REPLACE(p.adresse) LIKE :cles1 ")
                             ->setParameter('cles1', '%'. $mot_cles1. '%' );
                }
            }else{
                if( strlen($mot_cles1) <= 2 ){
                    $qb = $qb->where("REPLACE(p.denominationF) LIKE :cles0 AND p.dep LIKE :cles1")
                             ->setParameter('cles0', '%'. $mot_cles0. '%' )
                             ->setParameter('cles1', '%'. $mot_cles1. '%' );
                }else{
                    $qb = $qb->where("(REPLACE(p.denominationF) LIKE :cles0) AND (REPLACE(p.adresse) LIKE :cles1 )")
                             ->setParameter('cles0', '%'. $mot_cles0. '%' )
                             ->setParameter('cles1', '%'. $mot_cles1. '%' );
                }
            }
        }

        $qb = $qb->getQuery();
        $results = $qb->execute();

        return [ $results , count($results) , "marche"];
    }


    public function getBySpecificClefOther(string $mot_cles0, string $mot_cles1, int $page = 0, $size=20){
        $departementService = new DepartementService();
        $departement = $departementService->getDepWithKeyNomDep();

        if(array_key_exists(strtolower($mot_cles1), $departement)){
            $mot_cles1 = $departement[strtolower($mot_cles1)];
        }

        $qb = $this->createQueryBuilder("p")
                ->select(
                    "p.id,
                    p.clenum,
                    p.denominationF,
                    p.denominationF as nom,
                    p.denominationF as nameFilter,
                    p.adresse,
                    p.adresse as add,
                    p.codpost,
                    p.commune,
                    p.codinsee,
                    p.villenorm,
                    p.specificite,
                    p.jour_de_marche_1 as marche,
                    p.jour_de_marche_1,
                    p.jour_de_marche_2,
                    p.jour_de_marche_3,
                    p.jour_de_marche_4,
                    p.jour_de_marche_5,
                    p.jour_de_marche_6,
                    p.jour_de_marche_7,
                    p.poi_qualitegeorue,
                    p.dcomiris,
                    p.dep,
                    p.dep as depName,
                    p.date_data,
                    p.date_inser,
                    p.poiY as lat,
                    p.poiX as long"
                );

        if( $mot_cles0 !== "" && $mot_cles1 === "" ){
            if( strlen($mot_cles0) <= 2 ){
                $qb = $qb->where("p.denominationF LIKE :cles0")
                         ->setParameter('cles0', '%'. $mot_cles0. '%' );
            }else{
                $qb = $qb->where("MATCH_AGAINST(p.denominationF) AGAINST( :cles0 boolean) > 0")
                            ->orWhere("p.denominationF LIKE :cles0")
                            ->setParameter('cles0', '%' . $mot_cles0. '%');
            }
                
        }else if ($mot_cles0 === "" && $mot_cles1 !== "" ){
            if( strlen($mot_cles1) <= 2 ){
                $qb = $qb->where("p.dep LIKE :cles1")
                         ->setParameter('cles1', '%'. $mot_cles1. '%' );
            }else{
                $qb = $qb->where("MATCH_AGAINST(p.adresse) AGAINST( :cles1 boolean) > 0")
                         ->orWhere("p.adresse LIKE :cles1")
                         ->setParameter('cles1', '%'. $mot_cles1. '%' );
            }

        }else {
            if( strlen($mot_cles1) <= 2 ){
                $qb = $qb->where("MATCH_AGAINST(p.denominationF) AGAINST( :cles0 boolean) > 0 AND p.dep LIKE :cles1")
                            ->orWhere("p.denominationF LIKE :cles0 AND p.dep LIKE :cles1")
                            ->setParameter('cles0', '%'. $mot_cles0. '%' )
                            ->setParameter('cles1', '%'. $mot_cles1. '%' );
            }else{
                $qb = $qb->where("( MATCH_AGAINST(p.denominationF) AGAINST( :cles0 boolean) > 0 ) OR ( MATCH_AGAINST(p.addresse) AGAINST( :cles1 boolean) > 0 )")
                            ->orWhere("(p.denominationF LIKE :cles0) OR (p.addresse LIKE :cles1 )")
                            ->setParameter('cles0', '%'. $mot_cles0. '%' )
                            ->setParameter('cles1', '%'. $mot_cles1. '%' );
            }
        }
        $qb = $qb->getQuery();
        $results = $qb->execute();

        return [ $results , count($results) , "marche"];
    }

//    /**
//     * @return Marche[] Returns an array of Marche objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('m')
//            ->andWhere('m.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('m.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?Marche
//    {
//        return $this->createQueryBuilder('m')
//            ->andWhere('m.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
