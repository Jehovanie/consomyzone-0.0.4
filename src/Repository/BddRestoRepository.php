<?php

namespace App\Repository;

use Doctrine\Persistence\ManagerRegistry;

use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;

use App\Entity\BddResto;

use App\Service\DepartementService;
use App\Service\DicoRestoForSearchService;

/**
 * @extends ServiceEntityRepository<BddResto>
 *
 * @method BddResto|null find($id, $lockMode = null, $lockVersion = null)
 * @method BddResto|null findOneBy(array $criteria, array $orderBy = null)
 * @method BddResto[]    findAll()
 * @method BddResto[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class BddRestoRepository extends ServiceEntityRepository
{

    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, BddResto::class);
    }



    public function save(BddResto $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function findRestoByName($restoName){
        return $this->createQueryBuilder("m")
            ->where('MATCH_AGAINST(m.denominationF) AGAINST(:name boolean)>0 ')
            ->setParameter('name', $restoName)
            ->getQuery()
            ->getResult();

    }

    // public function findRestoByNameV2($restoName1,$restoName2){
    //     return $this->createQueryBuilder("r")
    //     ->select("r")
    //     ->where("r.denominationF LIKE :name1")
    //     ->orWhere("r.denominationF LIKE :name2")
    //     ->setParameter("name1",'%'.$restoName1.'%')
    //     ->setParameter("name2",'%'.$restoName2.'%')
    //     ->getQuery()
    //     ->getResult();
    // }
    public function remove(BddResto $entity, bool $flush = false): void
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
     *  Use in: RestaurantController.php , ... 
     *  
     *  @param {integer|null } $idDep: code de departement
     * 
     *  @return {integer} number of elements in departement or all
     *  
     */
    function getAccountRestauranting($idDep=null){
        $qb= $this->createQueryBuilder("r");
        $qb->select(
            $qb->expr()->countDistinct(
                $qb->expr()->concat(
                    'r.id', "' '",
                    'r.dep',"' '",
                    'r.depName',"' '",
                    'r.denominationF',"' '",
                    'r.numvoie',"' '",
                    'r.typevoie',"' '",
                    'r.nomvoie',"' '",
                    'r.compvoie',"' '",
                    'r.villenorm',"' '",
                    'r.poiX',"' '",
                    'r.poiY'
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
     * Similar of the getAccountRestauranting but not returns a scalar
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
                    'r.depName',"' '",
                    'r.denominationF',"' '",
                    'r.numvoie',"' '",
                    'r.typevoie',"' '",
                    'r.nomvoie',"' '",
                    'r.compvoie',"' '",
                    'r.villenorm',"' '",
                    'r.poiX',"' '",
                    'r.poiY'
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


    function getAccountSpecificRestauranting($dep)
    {
        return $this->createQueryBuilder("r")
            ->select("count(r.id)")
            ->where("r.dep =:dep")
            ->setParameter("dep", $dep)
            ->getQuery()
            ->getSingleScalarResult();
    }
    public function getCoordinateAndRestoIdForAll()
    {
    }

    public function getAllRestoIdForSpecificDepartement($dep)
    {
        return $this->createQueryBuilder("r")
            ->select("r.id,
                r.denominationF as nom,
                r.denominationF as nameFilter,
                r.denominationF,
                r.numvoie,
                r.typevoie,
                r.nomvoie,
                r.compvoie,
                r.codpost,
                r.villenorm,
                r.commune,
                r.restaurant,
                r.brasserie,
                r.creperie,
                r.fastFood,
                r.pizzeria,
                r.boulangerie,
                r.bar,
                r.cuisineMonde,
                r.cafe,
                r.salonThe,
                r.site1,
                r.fonctionalite1,
                r.fourchettePrix1,
                r.horaires1,
                r.prestation1,
                r.regimeSpeciaux1,
                r.repas1,
                r.typeCuisine1,
                r.dep,
                r.depName,
                r.tel,
                r.poiX,
                r.poiY,
                r.poiX as long,
                r.poiY as lat,
                CONCAT(r.numvoie,' ',r.typevoie, ' ',r.nomvoie) as rue,
                CONCAT(r.numvoie,' ',r.typevoie, ' ',r.nomvoie, ' ',r.codpost, ' ',r.villenorm) as add"
            )
            ->where("r.dep =:dep")
            ->setParameter("dep",$dep)
            ->getQuery()
            ->getResult();
    }

    public function getAllRestoIdForSpecificDepartementMobile($dep,$idReso)
    {
        return $this->createQueryBuilder("r")
            ->select(
                "r.id,
                r.denominationF as nom,
                r.denominationF as nameFilter,
                r.denominationF,
                r.numvoie,
                r.typevoie,
                r.nomvoie,
                r.compvoie,
                r.codpost,
                r.villenorm,
                r.commune,
                r.restaurant,
                r.brasserie,
                r.creperie,
                r.fastFood,
                r.pizzeria,
                r.boulangerie,
                r.bar,
                r.cuisineMonde,
                r.cafe,
                r.salonThe,
                r.site1,
                r.fonctionalite1,
                r.fourchettePrix1,
                r.horaires1,
                r.prestation1,
                r.regimeSpeciaux1,
                r.repas1,
                r.typeCuisine1,
                r.dep,
                r.depName,
                r.tel,
                r.poiX,
                r.poiY,
                r.poiX as long,
                r.poiY as lat,
                CONCAT(r.numvoie,' ',r.typevoie, ' ',r.nomvoie) as rue,
                CONCAT(r.numvoie,' ',r.typevoie, ' ',r.nomvoie, ' ',r.codpost, ' ',r.villenorm) as add"
            )
            ->where("r.dep =:dep")
            ->setParameter("dep", $dep)
            ->andWhere("r.id =:id")
            ->setParameter("id", $idReso)
            ->getQuery()
            ->getResult();
    }


    public function getCoordinateAndRestoIdForSpecific($dep, $codinsee= null, $limit = 2000)
    {

        $dep= strlen($dep) === 1  ? "0" . $dep : $dep;
        $query= $this->createQueryBuilder("r")
                    ->select("r.id,
                        r.denominationF,
                        r.denominationF as nameFilter,
                        r.denominationF as nom,
                        r.numvoie,
                        r.typevoie,
                        r.nomvoie,
                        r.compvoie,
                        r.codpost,
                        r.villenorm,
                        r.commune,
                        r.restaurant,
                        r.restaurant as resto,
                        r.brasserie,
                        r.creperie,
                        r.fastFood,
                        r.pizzeria,
                        r.boulangerie,
                        r.bar,
                        r.cuisineMonde,
                        r.cafe,
                        r.salonThe,
                        r.site1,
                        r.fonctionalite1,
                        r.fourchettePrix1,
                        r.horaires1,
                        r.prestation1,
                        r.regimeSpeciaux1,
                        r.repas1,
                        r.typeCuisine1,
                        r.dep,
                        r.depName,
                        r.tel,
                        r.poiX,
                        r.poiY,
                        r.poiX as long,
                        r.poiY as lat,
                        r.codinsee,
                        CONCAT(r.numvoie,' ',r.typevoie, ' ',r.nomvoie) as rue,
                        CONCAT(r.numvoie,' ',r.typevoie, ' ',r.nomvoie, ' ',r.codpost, ' ',r.villenorm) as add"
                    )
                    ->distinct('r.denominationF, r.poiX, r.poiY')
                    ->where("r.dep =:dep")
                    ->setParameter("dep",$dep);

        //dd($codinsee);
        if($codinsee){

            $query = $query->andWhere("r.codinsee =:codinsee")
                            ->setParameter("codinsee", $codinsee);
        }

        //    $query= $query->groupBy("r.denominationF, r.poiX, r.poiY")
                // ->having('count(r.denominationF)=1')
                // ->andHaving('count(r.poiX)=1')
                // ->andHaving('count(r.poiY) =1');
        return $query->orderBy('RAND()')
                ->setMaxResults($limit)
                ->getQuery()
                ->getResult();
    }

    public function getCoordinateAndRestoIdForSpecificMobile($dep, $codinsee = null, $limit = 2000, $offset = 0) 
    {
        $dep = strlen($dep) === 1  ? "0" . $dep : $dep;
        $query = $this->createQueryBuilder("r")
            ->select(
                        "r.id,
                        r.denominationF,
                        r.denominationF as nom,
                        r.denominationF as nameFilter,
                        r.numvoie,
                        r.typevoie,
                        r.nomvoie,
                        r.compvoie,
                        r.codpost,
                        r.villenorm,
                        r.commune,
                        r.restaurant,
                        r.restaurant as resto,
                        r.brasserie,
                        r.creperie,
                        r.fastFood,
                        r.pizzeria,
                        r.boulangerie,
                        r.bar,
                        r.cuisineMonde,
                        r.cafe,
                        r.salonThe,
                        r.site1,
                        r.fonctionalite1,
                        r.fourchettePrix1,
                        r.horaires1,
                        r.prestation1,
                        r.regimeSpeciaux1,
                        r.repas1,
                        r.typeCuisine1,
                        r.dep,
                        r.codinsee,
                        r.depName,
                        r.tel,
                        r.poiX,
                        r.poiY,
                        r.poiX as long,
                        r.poiY as lat,
                        CONCAT(r.numvoie,' ',r.typevoie, ' ',r.nomvoie) as rue,
                        CONCAT(r.numvoie,' ',r.typevoie, ' ',r.nomvoie, ' ',r.codpost, ' ',r.villenorm) as add"
            )
            ->distinct('r.denominationF, r.poiX, r.poiY')
            ->where("r.dep =:dep")
            ->setParameter("dep", $dep);
            // ->groupBy("r.denominationF, r.poiX, r.poiY")
            // ->having('count(r.denominationF)=1')
            // ->andHaving('count(r.poiX)=1')
            // ->andHaving('count(r.poiY) =1');

        if ($codinsee) {
            $query = $query->andWhere("r.codinsee =:codinsee")
            ->setParameter("codinsee", $codinsee);
        }

        return $query
            ->orderBy('r.id','ASC')
            ->setMaxResults($limit)
            ->setFirstResult($offset)
            ->getQuery()
            ->getResult()
            ;
    }

    public function getCoordinateAndRestoIdForSpecificParis($dep)
    {
        return $this->createQueryBuilder("r")
            ->select("r.id,r.denominationF,
                r.denominationF as nameFilter,
                r.numvoie,r.typevoie,
                r.nomvoie,r.compvoie,
                r.codpost,r.villenorm,
                r.commune,r.restaurant,
                r.brasserie,r.creperie,
                r.fastFood,r.pizzeria,
                r.boulangerie,r.bar,
                r.cuisineMonde,r.cafe,
                r.salonThe,r.site1,
                r.fonctionalite1,
                r.fourchettePrix1,r.horaires1,
                r.prestation1,r.regimeSpeciaux1,
                r.repas1,r.typeCuisine1,
                r.dep,r.depName,r.tel,
                r.poiX,r.poiY"
            )
            ->where("r.dep =:dep")
            ->setParameter("dep",$dep)
            ->orderBy("r.denominationF", 'ASC')
            ->getQuery()
            ->getResult();
    }


    ///jheo : getByCles 
    public function getBySpecificClef(string $mot_cles0, string $mot_cles1, int $page = 0, $size=20){
        $dicoResto = new DicoRestoForSearchService();
        $page_current =$page > 1 ? $page * 10 +1  : 0;

        $mot_cles1 = strlen($mot_cles1) === 1 ? "0". $mot_cles1 : $mot_cles1;

        $departementService = new DepartementService();
        $departement = $departementService->getDepWithKeyNomDep();
        if(array_key_exists(strtolower($mot_cles1), $departement)){
            $mot_cles1 = $departement[strtolower($mot_cles1)];
        }

        $qb = $this->createQueryBuilder("p")
                ->select("p.id,
                        p.id as id_etab,
                        p.dep,
                        p.depName,
                        p.numvoie,
                        p.typevoie,
                        p.commune,
                        p.villenorm,
                        p.codpost,
                        p.denominationF,
                        p.denominationF as nom,
                        p.nomvoie,
                        p.compvoie,
                        p.restaurant as resto,
                        p.brasserie,
                        p.denominationF as name,
                        p.dep as id_dep,
                        p.depName as departement,
                        CONCAT(p.numvoie,' ',p.typevoie, ' ',p.nomvoie, ' ',p.codpost, ' ',p.villenorm) as adresse,
                        p.creperie,
                        p.fastFood,
                        p.pizzeria,
                        p.boulangerie,
                        p.bar,
                        p.cuisineMonde,
                        p.cafe,
                        p.salonThe,
                        p.site1,
                        p.fonctionalite1,
                        p.fourchettePrix1,
                        p.horaires1,
                        p.prestation1,
                        p.regimeSpeciaux1,
                        p.repas1,
                        p.typeCuisine1,
                        p.tel,
                        p.poiX as long,
                        p.poiY as lat,
                        CONCAT(p.numvoie,' ',p.typevoie, ' ',p.nomvoie) as rue,
                        CONCAT(p.numvoie,' ',p.typevoie, ' ',p.nomvoie, ' ',p.codpost, ' ',p.villenorm) as add");
                        
        if( $mot_cles0 !== "" && $mot_cles1 === "" ){

            if( strlen($mot_cles0) <= 2 ){
                
                $qb = $qb->where("p.denominationF LIKE :cles0")
                         ->setParameter('cles0', '%'. $mot_cles0. '%' );
            }else{
                if($dicoResto->isCafe($mot_cles0)){
                    $qb = $qb->where('p.cafe = :identifier')
                             ->setParameter('identifier', true);
                }elseif($dicoResto->isThe($mot_cles0)){
                    $qb = $qb->where('p.salonThe = :identifier')
                             ->setParameter('identifier', true);
                }elseif($dicoResto->isCuisine($mot_cles0)){
                    $qb = $qb->where('p.cuisineMonde = :identifier')
                             ->setParameter('identifier', true);
                }elseif($dicoResto->isBrasserie($mot_cles0)){
                    $qb = $qb->where('p.brasserie = :identifier')
                             ->setParameter('identifier', true);
                }elseif($dicoResto->isBar($mot_cles0)){
                    $qb = $qb->where('p.bar = :identifier')
                             ->setParameter('identifier', true);
                }elseif($dicoResto->isCreperie($mot_cles0)){
                    $qb = $qb->where('p.creperie = :identifier')
                             ->setParameter('identifier', true);
                }elseif($dicoResto->isFastFood($mot_cles0)){
                    $qb = $qb->where('p.fastFood = :identifier')
                             ->setParameter('identifier', true);
                }elseif($dicoResto->isPizzeria($mot_cles0)){
                    $qb = $qb->where('p.pizzeria = :identifier')
                             ->setParameter('identifier', true);
                }elseif($dicoResto->isBoulangerie($mot_cles0)){
                    $qb = $qb->where('p.boulangerie = :identifier')
                             ->setParameter('identifier', true);
                }else{

                    $qb = $qb->where("REPLACE(p.denominationF) LIKE :cles0")
                             ->setParameter('cles0', '%' . $mot_cles0. '%');
                }
            }
                
        }else if ($mot_cles0 === "" && $mot_cles1 !== "" ){
            if( strlen($mot_cles1) <= 2 ){
                $qb = $qb->where("p.dep LIKE :cles1")
                         ->setParameter('cles1', $mot_cles1 );
            }else{

                $qb = $qb->where("REPLACE(CONCAT(p.numvoie,' ',p.typevoie, ' ',p.nomvoie, ' ',p.codpost, ' ',p.villenorm)) LIKE :cles1")
                         ->setParameter('cles1', '%'. $mot_cles1. '%' );
            }

        }else {

            if(strtolower($mot_cles0) == "resto" || strtolower($mot_cles0) == "restos" || strtolower($mot_cles0) == "restaurant" || strtolower($mot_cles0) == "restaurants"){
                if( strlen($mot_cles1) <= 2 ){
                    $qb = $qb->where("p.dep LIKE :cles1")
                             ->setParameter('cles1',  $mot_cles1 );
                }else{
                    //dd("p.numvoie,' ',p.typevoie, ' ',p.nomvoie, ' ',p.codpost, ' ',p.villenorm");
                    $qb = $qb->where("REPLACE(CONCAT(p.numvoie,' ',p.typevoie, ' ',p.nomvoie, ' ',p.codpost, ' ',p.villenorm)) LIKE :cles1 ")
                             ->setParameter('cles1', '%'. $mot_cles1. '%' );
                }
            }elseif($dicoResto->isCafe($mot_cles0)){
                if( strlen($mot_cles1) <= 2 ){
                    $qb = $qb->where("p.cafe = 1 AND p.dep LIKE :cles1")
                             ->setParameter('cles1', '%'. $mot_cles1. '%' );
                }else{
                    $qb = $qb->where("p.cafe = 1 AND REPLACE(CONCAT(p.numvoie,' ',p.typevoie, ' ',p.nomvoie, ' ',p.codpost, ' ',p.villenorm)) LIKE :cles1 ")
                             ->setParameter('cles1', '%'. $mot_cles1. '%' );
                }
            }elseif($dicoResto->isThe($mot_cles0)){
                if( strlen($mot_cles1) <= 2 ){
                    $qb = $qb->where("p.salonThe = 1 AND p.dep LIKE :cles1")
                             ->setParameter('cles1', '%'. $mot_cles1. '%' );
                }else{
                    $qb = $qb->where("p.salonThe = 1 AND REPLACE(CONCAT(p.numvoie,' ',p.typevoie, ' ',p.nomvoie, ' ',p.codpost, ' ',p.villenorm)) LIKE :cles1 ")
                             ->setParameter('cles1', '%'. $mot_cles1. '%' );
                }
            }elseif($dicoResto->isCuisine($mot_cles0)){
                if( strlen($mot_cles1) <= 2 ){
                    $qb = $qb->where("p.cuisineMonde = 1 AND p.dep LIKE :cles1")
                             ->setParameter('cles1', '%'. $mot_cles1. '%' );
                }else{
                    $qb = $qb->where("p.cuisineMonde = 1 AND REPLACE(CONCAT(p.numvoie,' ',p.typevoie, ' ',p.nomvoie, ' ',p.codpost, ' ',p.villenorm)) LIKE :cles1 ")
                             ->setParameter('cles1', '%'. $mot_cles1. '%' );
                }
            }elseif($dicoResto->isBrasserie($mot_cles0)){
                if( strlen($mot_cles1) <= 2 ){
                    $qb = $qb->where("p.brasserie = 1 AND p.dep LIKE :cles1")
                             ->setParameter('cles1', '%'. $mot_cles1. '%' );
                }else{
                    $qb = $qb->where("p.brasserie = 1 AND REPLACE(CONCAT(p.numvoie,' ',p.typevoie, ' ',p.nomvoie, ' ',p.codpost, ' ',p.villenorm)) LIKE :cles1 ")
                             ->setParameter('cles1', '%'. $mot_cles1. '%' );
                }
            }elseif($dicoResto->isBar($mot_cles0)){
                if( strlen($mot_cles1) <= 2 ){
                    $qb = $qb->where("p.bar = 1 AND p.dep LIKE :cles1")
                             ->setParameter('cles1', '%'. $mot_cles1. '%' );
                }else{
                    $qb = $qb->where("p.bar = 1 AND REPLACE(CONCAT(p.numvoie,' ',p.typevoie, ' ',p.nomvoie, ' ',p.codpost, ' ',p.villenorm)) LIKE :cles1 ")
                             ->setParameter('cles1', '%'. $mot_cles1. '%' );
                }
            }elseif($dicoResto->isCreperie($mot_cles0)){
                if( strlen($mot_cles1) <= 2 ){
                    $qb = $qb->where("p.creperie = 1 AND p.dep LIKE :cles1")
                             ->setParameter('cles1', '%'. $mot_cles1. '%' );
                }else{
                    $qb = $qb->where("p.creperie = 1 AND REPLACE(CONCAT(p.numvoie,' ',p.typevoie, ' ',p.nomvoie, ' ',p.codpost, ' ',p.villenorm)) LIKE :cles1 ")
                             ->setParameter('cles1', '%'. $mot_cles1. '%' );
                }
            }elseif($dicoResto->isFastFood($mot_cles0)){
                if( strlen($mot_cles1) <= 2 ){
                    $qb = $qb->where("p.fastFood = 1 AND p.dep LIKE :cles1")
                             ->setParameter('cles1', '%'. $mot_cles1. '%' );
                }else{
                    $qb = $qb->where("p.fastFood = 1 AND REPLACE(CONCAT(p.numvoie,' ',p.typevoie, ' ',p.nomvoie, ' ',p.codpost, ' ',p.villenorm)) LIKE :cles1 ")
                             ->setParameter('cles1', '%'. $mot_cles1. '%' );
                }
            }elseif($dicoResto->isPizzeria($mot_cles0)){
                if( strlen($mot_cles1) <= 2 ){
                    $qb = $qb->where("p.pizzeria = 1 AND p.dep LIKE :cles1")
                             ->setParameter('cles1', '%'. $mot_cles1. '%' );
                }else{
                    $qb = $qb->where("p.pizzeria = 1 AND REPLACE(CONCAT(p.numvoie,' ',p.typevoie, ' ',p.nomvoie, ' ',p.codpost, ' ',p.villenorm)) LIKE :cles1 ")
                             ->setParameter('cles1', '%'. $mot_cles1. '%' );
                }
            }elseif($dicoResto->isBoulangerie($mot_cles0)){
                if( strlen($mot_cles1) <= 2 ){
                    $qb = $qb->where("p.boulangerie = 1 AND p.dep LIKE :cles1")
                             ->setParameter('cles1', '%'. $mot_cles1. '%' );
                }else{
                    $qb = $qb->where("p.boulangerie = 1 AND REPLACE(CONCAT(p.numvoie,' ',p.typevoie, ' ',p.nomvoie, ' ',p.codpost, ' ',p.villenorm)) LIKE :cles1 ")
                             ->setParameter('cles1', '%'. $mot_cles1. '%' );
                }
            }else{

                if( strlen($mot_cles1) <= 2 ){
                
                    $qb = $qb->where("REPLACE(p.denominationF) LIKE :cles0 AND p.dep LIKE :cles1")
                             ->setParameter('cles0', '%'. $mot_cles0. '%' )
                             ->setParameter('cles1', '%'. $mot_cles1. '%' );
                }else{
    
                    $qb = $qb->where("(REPLACE(p.denominationF) LIKE :cles0) AND (REPLACE(CONCAT(p.numvoie,' ',p.typevoie, ' ',p.nomvoie, ' ',p.codpost, ' ',p.villenorm)) LIKE :cles1 )")
                             ->setParameter('cles0', '%'. $mot_cles0. '%' )
                             ->setParameter('cles1', '%'. $mot_cles1. '%' );

                }

            }
            
        }

        $qb = $qb->getQuery();

        // const singleMatch = numvoie + " " + typevoie + " " + nomvoie + " " + codpost + " " + villenorm;
        $results = $qb->execute();

        return [ $results , count($results) , "resto"];
    }
    
    /**
     * 
     */
    public function getOneItemByID($id){
        return $this->createQueryBuilder("r")
                    ->select("r.id,
                        r.denominationF,
                        r.denominationF as nameFilter,
                        r.numvoie,
                        r.typevoie,
                        r.nomvoie,
                        r.compvoie,
                        r.codpost,
                        r.villenorm,
                        r.commune,
                        r.restaurant,
                        r.restaurant as resto,
                        r.brasserie,
                        r.creperie,
                        r.fastFood,
                        r.pizzeria,
                        r.boulangerie,
                        r.bar,
                        r.cuisineMonde,
                        r.cafe,
                        r.salonThe,
                        r.site1,
                        r.fonctionalite1,
                        r.fourchettePrix1,
                        r.horaires1,
                        r.prestation1,
                        r.regimeSpeciaux1,
                        r.repas1,
                        r.typeCuisine1,
                        r.dep,
                        r.depName,
                        r.tel,
                        r.poiY as lat,
                        r.poiX as long"
                    )
                    ->where("r.id =:id")
                    ->setParameter("id", $id)
                    ->getQuery()
                    ->getOneOrNullResult();
    }

    public function getBySpecificClefOther(string $mot_cles0, string $mot_cles1, int $page = 0, $size=20){
        $dicoResto = new DicoRestoForSearchService();
        $page_current =$page > 1 ? $page * 10 +1  : 0;
        $mot_cles1 = strlen($mot_cles1) === 1 ? "0". $mot_cles1 : $mot_cles1;
        $departementService = new DepartementService();
        $departement = $departementService->getDepWithKeyNomDep();
        if(array_key_exists(strtolower($mot_cles1), $departement)){
            $mot_cles1 = $departement[strtolower($mot_cles1)];
        }

        $qb = $this->createQueryBuilder("p")
                ->select("p.id,
                        p.dep,
                        p.id as id_etab,
                        p.denominationF as name,
                        p.dep as id_dep,
                        p.depName as departement,
                        CONCAT(p.numvoie,' ',p.typevoie, ' ',p.nomvoie, ' ',p.codpost, ' ',p.villenorm) as adresse,
                        p.depName,
                        p.numvoie,
                        p.typevoie,
                        p.commune,
                        p.villenorm,
                        p.codpost,
                        p.denominationF,
                        p.denominationF as nom,
                        p.nomvoie,
                        p.compvoie,
                        p.restaurant as resto,
                        p.brasserie,
                        p.creperie,
                        p.fastFood,
                        p.pizzeria,
                        p.boulangerie,
                        p.bar,
                        p.cuisineMonde,
                        p.cafe,
                        p.salonThe,
                        p.site1,
                        p.fonctionalite1,
                        p.fourchettePrix1,
                        p.horaires1,
                        p.prestation1,
                        p.regimeSpeciaux1,
                        p.repas1,
                        p.typeCuisine1,
                        p.tel,
                        p.poiX as long,
                        p.poiY as lat,
                        CONCAT(p.numvoie,' ',p.typevoie, ' ',p.nomvoie) as rue,
                        CONCAT(p.numvoie,' ',p.typevoie, ' ',p.nomvoie, ' ',p.codpost, ' ',p.villenorm) as add");
                        
        if( $mot_cles0 !== "" && $mot_cles1 === "" ){

            if( strlen($mot_cles0) <= 2 ){
                
                $qb = $qb->where("p.denominationF LIKE :cles0")
                         ->setParameter('cles0', '%'. $mot_cles0. '%' );
            }else{
                if($dicoResto->isCafe($mot_cles0)){
                    $qb = $qb->where('p.cafe = :identifier')
                             ->setParameter('identifier', true);
                }elseif($dicoResto->isThe($mot_cles0)){
                    $qb = $qb->where('p.salonThe = :identifier')
                             ->setParameter('identifier', true);
                }elseif($dicoResto->isCuisine($mot_cles0)){
                    $qb = $qb->where('p.cuisineMonde = :identifier')
                             ->setParameter('identifier', true);
                }elseif($dicoResto->isBrasserie($mot_cles0)){
                    $qb = $qb->where('p.brasserie = :identifier')
                             ->setParameter('identifier', true);
                }elseif($dicoResto->isBar($mot_cles0)){
                    $qb = $qb->where('p.bar = :identifier')
                             ->setParameter('identifier', true);
                }elseif($dicoResto->isCreperie($mot_cles0)){
                    $qb = $qb->where('p.creperie = :identifier')
                             ->setParameter('identifier', true);
                }elseif($dicoResto->isFastFood($mot_cles0)){
                    $qb = $qb->where('p.fastFood = :identifier')
                             ->setParameter('identifier', true);
                }elseif($dicoResto->isPizzeria($mot_cles0)){
                    $qb = $qb->where('p.pizzeria = :identifier')
                             ->setParameter('identifier', true);
                }elseif($dicoResto->isBoulangerie($mot_cles0)){
                    $qb = $qb->where('p.boulangerie = :identifier')
                             ->setParameter('identifier', true);
                }else{

                    $qb = $qb->where("MATCH_AGAINST(p.denominationF) AGAINST( :cles0 boolean) > 0")
                             ->orWhere("p.denominationF LIKE :cles0")
                             ->setParameter('cles0', '%' . $mot_cles0. '%');
                }
            }
                
        }else if ($mot_cles0 === "" && $mot_cles1 !== "" ){
            
            if( strlen($mot_cles1) <= 2 ){
                
                $qb = $qb->where("p.dep LIKE :cles1")
                         ->setParameter('cles1', '%'. $mot_cles1. '%' );
            }else{

                $qb = $qb->where("MATCH_AGAINST(p.numvoie, p.typevoie, p.nomvoie, p.codpost, p.villenorm) AGAINST( :cles1 boolean) > 0")
                         ->orWhere("CONCAT(p.numvoie,' ',p.typevoie, ' ',p.nomvoie, ' ',p.codpost, ' ',p.villenorm) LIKE :cles1")
                         ->setParameter('cles1', '%'. $mot_cles1. '%' );
            }

        }else {

            if($dicoResto->isCafe($mot_cles0)){
                if( strlen($mot_cles1) <= 2 ){
                    $qb = $qb->where("p.cafe = 1 AND p.dep LIKE :cles1")
                             ->setParameter('cles1', '%'. $mot_cles1. '%' );
                }else{
                    $qb = $qb->where("p.cafe = 1 AND REPLACE(CONCAT(p.numvoie,' ',p.typevoie, ' ',p.nomvoie, ' ',p.codpost, ' ',p.villenorm)) LIKE :cles1 ")
                             ->orWhere("p.cafe = 1 AND MATCH_AGAINST(p.numvoie, p.typevoie, p.nomvoie, p.codpost, p.villenorm) AGAINST( :cles1 boolean) > 0")
                             ->setParameter('cles1', '%'. $mot_cles1. '%' );     
                }
            }elseif($dicoResto->isThe($mot_cles0)){
                if( strlen($mot_cles1) <= 2 ){
                    $qb = $qb->where("p.salonThe = 1 AND p.dep LIKE :cles1")
                             ->setParameter('cles1', '%'. $mot_cles1. '%' );
                }else{
                    $qb = $qb->where("p.salonThe = 1 AND REPLACE(CONCAT(p.numvoie,' ',p.typevoie, ' ',p.nomvoie, ' ',p.codpost, ' ',p.villenorm)) LIKE :cles1 ")
                             ->orWhere("p.salonThe = 1 AND MATCH_AGAINST(p.numvoie, p.typevoie, p.nomvoie, p.codpost, p.villenorm) AGAINST( :cles1 boolean) > 0")
                             ->setParameter('cles1', '%'. $mot_cles1. '%' );
                }
            }elseif($dicoResto->isCuisine($mot_cles0)){
                if( strlen($mot_cles1) <= 2 ){
                    $qb = $qb->where("p.cuisineMonde = 1 AND p.dep LIKE :cles1")
                             ->setParameter('cles1', '%'. $mot_cles1. '%' );
                }else{
                    $qb = $qb->where("p.cuisineMonde = 1 AND REPLACE(CONCAT(p.numvoie,' ',p.typevoie, ' ',p.nomvoie, ' ',p.codpost, ' ',p.villenorm)) LIKE :cles1 ")
                             ->orWhere("p.cuisineMonde = 1 AND MATCH_AGAINST(p.numvoie, p.typevoie, p.nomvoie, p.codpost, p.villenorm) AGAINST( :cles1 boolean) > 0")
                             ->setParameter('cles1', '%'. $mot_cles1. '%' );
                }
            }elseif($dicoResto->isBrasserie($mot_cles0)){
                if( strlen($mot_cles1) <= 2 ){
                    $qb = $qb->where("p.brasserie = 1 AND p.dep LIKE :cles1")
                             ->setParameter('cles1', '%'. $mot_cles1. '%' );
                }else{
                    $qb = $qb->where("p.brasserie = 1 AND REPLACE(CONCAT(p.numvoie,' ',p.typevoie, ' ',p.nomvoie, ' ',p.codpost, ' ',p.villenorm)) LIKE :cles1 ")
                             ->orWhere("p.brasserie = 1 AND MATCH_AGAINST(p.numvoie, p.typevoie, p.nomvoie, p.codpost, p.villenorm) AGAINST( :cles1 boolean) > 0")
                             ->setParameter('cles1', '%'. $mot_cles1. '%' );
                }
            }elseif($dicoResto->isBar($mot_cles0)){
                if( strlen($mot_cles1) <= 2 ){
                    $qb = $qb->where("p.bar = 1 AND p.dep LIKE :cles1")
                             ->setParameter('cles1', '%'. $mot_cles1. '%' );
                }else{
                    $qb = $qb->where("p.bar = 1 AND REPLACE(CONCAT(p.numvoie,' ',p.typevoie, ' ',p.nomvoie, ' ',p.codpost, ' ',p.villenorm)) LIKE :cles1 ")
                             ->orWhere("p.bar = 1 AND MATCH_AGAINST(p.numvoie, p.typevoie, p.nomvoie, p.codpost, p.villenorm) AGAINST( :cles1 boolean) > 0")
                             ->setParameter('cles1', '%'. $mot_cles1. '%' );
                }
            }elseif($dicoResto->isCreperie($mot_cles0)){
                if( strlen($mot_cles1) <= 2 ){
                    $qb = $qb->where("p.creperie = 1 AND p.dep LIKE :cles1")
                             ->setParameter('cles1', '%'. $mot_cles1. '%' );
                }else{
                    $qb = $qb->where("p.creperie = 1 AND REPLACE(CONCAT(p.numvoie,' ',p.typevoie, ' ',p.nomvoie, ' ',p.codpost, ' ',p.villenorm)) LIKE :cles1 ")
                             ->orWhere("p.creperie = 1 AND MATCH_AGAINST(p.numvoie, p.typevoie, p.nomvoie, p.codpost, p.villenorm) AGAINST( :cles1 boolean) > 0")
                             ->setParameter('cles1', '%'. $mot_cles1. '%' );
                }
            }elseif($dicoResto->isFastFood($mot_cles0)){
                if( strlen($mot_cles1) <= 2 ){
                    $qb = $qb->where("p.fastFood = 1 AND p.dep LIKE :cles1")
                             ->setParameter('cles1', '%'. $mot_cles1. '%' );
                }else{
                    $qb = $qb->where("p.fastFood = 1 AND REPLACE(CONCAT(p.numvoie,' ',p.typevoie, ' ',p.nomvoie, ' ',p.codpost, ' ',p.villenorm)) LIKE :cles1 ")
                             ->orWhere("p.fastFood = 1 AND MATCH_AGAINST(p.numvoie, p.typevoie, p.nomvoie, p.codpost, p.villenorm) AGAINST( :cles1 boolean) > 0")
                             ->setParameter('cles1', '%'. $mot_cles1. '%' );
                }
            }elseif($dicoResto->isPizzeria($mot_cles0)){
                if( strlen($mot_cles1) <= 2 ){
                    $qb = $qb->where("p.pizzeria = 1 AND p.dep LIKE :cles1")
                             ->setParameter('cles1', '%'. $mot_cles1. '%' );
                }else{
                    $qb = $qb->where("p.pizzeria = 1 AND REPLACE(CONCAT(p.numvoie,' ',p.typevoie, ' ',p.nomvoie, ' ',p.codpost, ' ',p.villenorm)) LIKE :cles1 ")
                             ->orWhere("p.pizzeria = 1 AND MATCH_AGAINST(p.numvoie, p.typevoie, p.nomvoie, p.codpost, p.villenorm) AGAINST( :cles1 boolean) > 0")
                             ->setParameter('cles1', '%'. $mot_cles1. '%' );
                }
            }elseif($dicoResto->isBoulangerie($mot_cles0)){
                if( strlen($mot_cles1) <= 2 ){
                    $qb = $qb->where("p.boulangerie = 1 AND p.dep LIKE :cles1")
                             ->setParameter('cles1', '%'. $mot_cles1. '%' );
                }else{
                    $qb = $qb->where("p.boulangerie = 1 AND REPLACE(CONCAT(p.numvoie,' ',p.typevoie, ' ',p.nomvoie, ' ',p.codpost, ' ',p.villenorm)) LIKE :cles1 ")
                             ->orWhere("p.boulangerie = 1 AND MATCH_AGAINST(p.numvoie, p.typevoie, p.nomvoie, p.codpost, p.villenorm) AGAINST( :cles1 boolean) > 0")
                             ->setParameter('cles1', '%'. $mot_cles1. '%' );
                }
            }else{

                if( strlen($mot_cles1) <= 2 ){
                
                    $qb = $qb->where("MATCH_AGAINST(p.denominationF) AGAINST( :cles0 boolean) > 0 AND p.dep LIKE :cles1")
                             ->orWhere("p.denominationF LIKE :cles0 AND p.dep LIKE :cles1")
                             ->setParameter('cles0', '%'. $mot_cles0. '%' )
                             ->setParameter('cles1', '%'. $mot_cles1. '%' );
                }else{
    
                    $qb = $qb->where("(MATCH_AGAINST(p.denominationF) AGAINST( :cles0 boolean) > 0) OR (MATCH_AGAINST(p.numvoie, p.typevoie, p.nomvoie, p.codpost, p.villenorm) AGAINST( :cles1 boolean) > 0)")
                             ->orWhere("(p.denominationF LIKE :cles0) OR (CONCAT(p.numvoie,' ',p.typevoie, ' ',p.nomvoie, ' ',p.codpost, ' ',p.villenorm) LIKE :cles1 )")
                             ->setParameter('cles0', '%'. $mot_cles0. '%' )
                             ->setParameter('cles1', '%'. $mot_cles1. '%' );

                }

            }
            
        }

        $qb = $qb->getQuery();

        // const singleMatch = numvoie + " " + typevoie + " " + nomvoie + " " + codpost + " " + villenorm;
        $results = $qb->execute();
        return [ $results , count($results) , "resto"];
    }

    public function getRestoByCodinsee($codinsee, $dep)
    {
        return $this->createQueryBuilder("r")
            ->select("r.id,
                r.denominationF,
                r.denominationF as nom,
                r.denominationF as nameFilter,
                r.numvoie,
                r.typevoie,
                r.nomvoie,
                r.compvoie,
                r.codpost,
                r.villenorm,
                r.commune,
                r.restaurant,
                r.restaurant as resto,
                r.brasserie,
                r.creperie,
                r.fastFood,
                r.pizzeria,
                r.boulangerie,
                r.bar,
                r.cuisineMonde,
                r.cafe,
                r.salonThe,
                r.site1,
                r.fonctionalite1,
                r.fourchettePrix1,
                r.horaires1,
                r.prestation1,
                r.regimeSpeciaux1,
                r.repas1,
                r.typeCuisine1,
                r.dep,
                r.depName,
                r.tel,
                r.poiX,
                r.poiY,
                r.poiX as long,
                r.poiY as lat,
                CONCAT(r.numvoie,' ',r.typevoie, ' ',r.nomvoie) as rue,
                CONCAT(r.numvoie,' ',r.typevoie, ' ',r.nomvoie, ' ',r.codpost, ' ',r.villenorm) as add"
            )
            ->distinct('r.denominationF, r.poiX, r.poiY')
            ->where("r.codinsee =:codinsee")
            ->andWhere("r.dep =:dep")
            // ->groupBy("r.denominationF, r.poiX, r.poiY")
            // ->having('count(r.denominationF)=1')
            // ->andHaving('count(r.poiX)=1')
            // ->andHaving('count(r.poiY) =1')
            ->setParameter("codinsee", $codinsee)
            ->setParameter("dep", $dep)
            ->orderBy("r.denominationF", 'ASC')
            ->getQuery()
            ->getResult();
    }

    public function getOneRestaurant($dep= null, $id)
    {
        $resto =  $this->createQueryBuilder("r")
                ->select("r.id,
                    r.denominationF,
                    r.denominationF as nameFilter,
                    r.numvoie,
                    r.typevoie,
                    r.nomvoie,
                    r.compvoie,
                    r.codinsee,
                    r.codpost,
                    r.villenorm,
                    r.commune,
                    r.restaurant,
                    r.restaurant as resto,
                    r.brasserie,
                    r.creperie,
                    r.fastFood,
                    r.pizzeria,
                    r.boulangerie,
                    r.bar,
                    r.cuisineMonde,
                    r.cafe,
                    r.salonThe,
                    r.site1,
                    r.fonctionalite1,
                    r.fourchettePrix1,
                    r.horaires1,
                    r.prestation1,
                    r.regimeSpeciaux1,
                    r.repas1,
                    r.typeCuisine1,
                    r.dep,
                    r.depName,
                    r.tel,
                    r.poiX,
                    r.poiY,
                    r.poiX as long,
                    r.poiY as lat"
                )
                ->andWhere("r.id =:id")
                ->setParameter("id", $id)
                ->orderBy("r.id", 'ASC')
                ->getQuery()
                ->getResult();

        // dd($resto);
        return $resto;
    }

    public function getDetailsRubriqueRestaurant($id)
    {
        $resto =  $this->createQueryBuilder("r")
                ->select(
                    "r.id,
                    r.denominationF,
                    r.denominationF as nameFilter,
                    r.numvoie,
                    r.typevoie,
                    r.nomvoie,
                    r.compvoie,
                    r.codinsee,
                    r.codpost,
                    r.villenorm,
                    r.commune,
                    r.restaurant,
                    r.restaurant as resto,
                    r.brasserie,
                    r.creperie,
                    r.fastFood,
                    r.pizzeria,
                    r.boulangerie,
                    r.bar,
                    r.cuisineMonde,
                    r.cafe,
                    r.salonThe,
                    r.site1,
                    r.fonctionalite1,
                    r.fourchettePrix1,
                    r.horaires1,
                    r.prestation1,
                    r.regimeSpeciaux1,
                    r.repas1,
                    r.typeCuisine1,
                    r.dep,
                    r.depName,
                    r.tel,
                    r.poiX,
                    r.poiY,
                    r.poiX as long,
                    r.poiY as lat"
                )
                ->where("r.id =:id")
                ->setParameter("id", $id)
                ->getQuery()
                ->getOneOrNullResult();

        return $resto;
    }

    public function getOneRestaurantById($id)
    {
        return $this->createQueryBuilder("r")
            ->select("r.id,r.denominationF,
                r.denominationF as nameFilter,
                r.numvoie,r.typevoie,
                r.nomvoie,r.compvoie,
                r.codpost,r.villenorm,
                r.commune,r.restaurant,
                r.brasserie,r.creperie,
                r.fastFood,r.pizzeria,
                r.boulangerie,r.bar,
                r.cuisineMonde,r.cafe,
                r.salonThe,r.site1,
                r.fonctionalite1,
                r.fourchettePrix1,r.horaires1,
                r.prestation1,r.regimeSpeciaux1,
                r.repas1,r.typeCuisine1,
                r.dep,r.depName,r.tel,r.codinsee,
                r.poiX,r.poiY")
            ->where("r.id =:id")
            ->setParameter("id", $id)
            ->orderBy("r.id", 'ASC')
            ->getQuery()
            ->getResult();
    }

    public function getAllOpenedRestos(){
        
        return $this->createQueryBuilder("r")
            ->select("r.id,
                    r.denominationF,
                    r.denominationF as nameFilter,
                    r.numvoie,
                    r.typevoie,
                    r.nomvoie,
                    r.compvoie,
                    r.codpost,
                    r.villenorm,
                    r.commune,
                    r.restaurant,
                    r.brasserie,
                    r.creperie,
                    r.fastFood,
                    r.pizzeria,
                    r.boulangerie,
                    r.bar,
                    r.cuisineMonde,
                    r.cafe,
                    r.salonThe,
                    r.site1,
                    r.fonctionalite1,
                    r.fourchettePrix1,
                    r.horaires1,
                    r.prestation1,
                    r.regimeSpeciaux1,
                    r.repas1,
                    r.typeCuisine1,
                    r.dep,
                    r.depName,
                    r.tel,
                    r.poiX,
                    r.poiY")
            ->distinct('r.denominationF, r.poiX, r.poiY')
            // ->groupBy("r.denominationF, r.poiX, r.poiY")
            // ->having('count(r.denominationF)=1')
            // ->andHaving('count(r.poiX)=1')
            // ->andHaving('count(r.poiY) =1')
            ->getQuery()
            ->getResult();
    }

    
    public function getAllFilterByLatLong($data){
        extract($data); //// $last [ min [ lat , lng ], max [ lat, lng ] ], $new [ min [ lat, lng ], max [ lat, lng ] ]
        // dump("-2.548957109000000 3.440684080123901 46.88474655000000 49.18113327026367 ");
        // dd($data);

        $qb= $this->createQueryBuilder("r")
            ->select("r.id,
                    r.denominationF,
                    r.denominationF as nameFilter,
                    r.numvoie,
                    r.typevoie,
                    r.nomvoie,
                    r.compvoie,
                    r.codpost,
                    r.villenorm,
                    r.commune,
                    r.restaurant,
                    r.brasserie,
                    r.creperie,
                    r.fastFood,
                    r.pizzeria,
                    r.boulangerie,
                    r.bar,
                    r.cuisineMonde,
                    r.cafe,
                    r.salonThe,
                    r.site1,
                    r.fonctionalite1,
                    r.fourchettePrix1,
                    r.horaires1,
                    r.prestation1,
                    r.regimeSpeciaux1,
                    r.repas1,
                    r.typeCuisine1,
                    r.dep,
                    r.depName,
                    r.tel,
                    r.poiX,
                    r.poiY")
            ->distinct('r.denominationF, r.poiX, r.poiY')
            // ->groupBy("r.denominationF, r.poiX, r.poiY")
            // ->having('count(r.denominationF)=1')
            // ->andHaving('count(r.poiX)=1')
            // ->andHaving('count(r.poiY) =1')
            ->where('r.poiY BETWEEN :lat_min AND :lat_max')
            ->andWhere('r.poiX BETWEEN :lng_min AND :lng_max');

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

    /**
     * @author Jehovanie RAMANDRIJOEL <jehovenierama@gmail.com>
     * 
     * Get random data 
     * 
     * @param integer $limits: number of the data to get
     * 
     * @return array Resto
     */
    public function getSomeDataShuffle($limits= 1000){
        $query=  $this->createQueryBuilder("r");

        $query= $query->select(
                        "r.id,
                        r.denominationF,
                        r.denominationF as nameFilter,
                        r.numvoie,
                        r.typevoie,
                        r.nomvoie,
                        r.compvoie,
                        r.codpost,
                        r.villenorm,
                        r.commune,
                        r.restaurant,
                        r.restaurant as resto,
                        r.brasserie,
                        r.creperie,
                        r.fastFood,
                        r.pizzeria,
                        r.boulangerie,
                        r.bar,
                        r.cuisineMonde,
                        r.cafe,
                        r.salonThe,
                        r.site1,
                        r.fonctionalite1,
                        r.fourchettePrix1,
                        r.horaires1,
                        r.prestation1,
                        r.regimeSpeciaux1,
                        r.repas1,
                        r.typeCuisine1,
                        r.dep,
                        r.depName,
                        r.tel,
                        r.poiY as lat,
                        r.poiX as long"
                    )->distinct(
                    $query->expr()->concat(
                        'r.id', "' '",
                        'r.dep',"' '",
                        'r.depName',"' '",
                        'r.denominationF',"' '",
                        'r.numvoie',"' '",
                        'r.typevoie',"' '",
                        'r.nomvoie',"' '",
                        'r.compvoie',"' '",
                        'r.villenorm',"' '",
                        'r.poiX',"' '",
                        'r.poiY'
                    )
                );

        return $query->orderBy('RAND()')
                    ->setMaxResults($limits)
                    ->getQuery()
                    ->getResult();
    }

    /**
     * @author Jehovanie RAMANDRIJOEL <jehovenierama@gmail.com>
     * 
     * Gat all resto pastille from id
     * 
     * @param array Resto  [ [ id_resto => ..., tableName => ... ], ... ]
     */
    public function getRestoPastille($data){
        $tab= [];
        foreach($data as $item){
            $resto=  $this->createQueryBuilder("r")
                ->select(
                    "r.id,
                    r.denominationF,
                    r.denominationF as nameFilter,
                    r.numvoie,
                    r.typevoie,
                    r.nomvoie,
                    r.compvoie,
                    r.codpost,
                    r.villenorm,
                    r.commune,
                    r.restaurant,
                    r.restaurant as resto,
                    r.brasserie,
                    r.creperie,
                    r.fastFood,
                    r.pizzeria,
                    r.boulangerie,
                    r.bar,
                    r.cuisineMonde,
                    r.cafe,
                    r.salonThe,
                    r.site1,
                    r.fonctionalite1,
                    r.fourchettePrix1,
                    r.horaires1,
                    r.prestation1,
                    r.regimeSpeciaux1,
                    r.repas1,
                    r.typeCuisine1,
                    r.dep,
                    r.depName,
                    r.tel,
                    r.poiY as lat,
                    r.poiX as long"
                )
                ->where("r.id =:id")
                ->setParameter("id",intval($item["id_resto"]))
                ->getQuery()
                ->getOneOrNullResult();

            array_push($tab, $resto);
        }
        return $tab;
    }

    /**
     * @author Jehovanie RAMANDRIJOEL <jehovenierama@gmail.com>
     * 
     * Gat all resto in my favory id
     * Use in: UserController.php
     * 
     * @param array Resto  [ [ idRubrique => ... ], ... ]
     * 
     */
    public function getRestoFavory($data){
        $tab= [];
        foreach($data as $item){
            $resto=  $this->createQueryBuilder("r")
                ->select(
                    "r.id,
                    r.denominationF as name,
                    r.dep,
                    r.depName as nom_dep,
                    CONCAT(r.numvoie,' ', r.typevoie, ' ', r.nomvoie) as address"
                )
                ->where("r.id =:id")
                ->setParameter("id",intval($item["idRubrique"]))
                ->getQuery()
                ->getOneOrNullResult();
            if( $resto ){
                array_push($tab, [
                    "id" => $resto["id"],
                    "name" => $resto["name"],
                    "dep" => $resto["dep"],
                    "nom_dep" => $resto["nom_dep"],
                    "address" => $resto["address"],
                    "id_favory_etablisment" => $item["id"]
                ]);
            }
}

        return $tab;
    }

    /**
     * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
     * 
     * où:la rubrique resto 
     * localisation du fichier: dans ResturantController.php,
     * je veux: Faire une mise à jour sur les donnée, ajouter les restaurant passtille.
     * 
     * @param array $datas: all data to append the new data
     * @param array $arrayIdResto: array id resto get each details and append in the $datas when this is not yet in.
     * 
     * @return array $data: all data updated : all resto with resto pastielle
     */
    public function appendRestoPastille($datas, $arrayIdResto){
        if( count($arrayIdResto) > 0 ){
            ////add List Resto pastille in data
            $dataRestoPastille = $this->getRestoPastille($arrayIdResto);

            foreach ($dataRestoPastille as $itemRestoPastille){
                if(!is_null($itemRestoPastille)){
                    $idRestoPastille = $itemRestoPastille["id"];
                    $isAlreadyGet = array_search($idRestoPastille, array_column($datas, 'id'));
    
                    if( !$isAlreadyGet){
                        array_push($datas, $itemRestoPastille);
                    }
                }
                
            }
        }
        return $datas;
    }

/**
     *  @author updated by Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
     *  
     *  Goal: Get data restaurant between bound latitude and longitude 
     *  Use in: RestaurantController.php, ... 
     * 
     *  @param {decimal} $minx,$miny, $maxx, $maxy: lat long min and max delimite the bound
     *         {integer|null} $idDep code of departement if this sepecified
     *         {integer|null} $codinsee: code Insee of arrondissement in departement.
     *         {integer} number data to return by default 200
     * 
     *  @return {array} list of the restaurant.
     */
    public function getDataBetweenAnd($minx, $miny, $maxx, $maxy, $idDep= null, $codinsee= null, $taille= 250){
        $idDep= strlen($idDep) === 1  ? "0" . $idDep : $idDep;
        
        $query = $this->createQueryBuilder("r");
        $query = $query->select(
                "r.id,
                        r.denominationF,
                        r.denominationF as nameFilter,
                        r.numvoie,
                        r.typevoie,
                        r.nomvoie,
                        r.compvoie,
                        r.codpost,
                        r.villenorm,
                        r.commune,
                        r.restaurant,
                        r.restaurant as resto,
                        r.brasserie,
                        r.creperie,
                        r.fastFood,
                        r.pizzeria,
                        r.boulangerie,
                        r.bar,
                        r.cuisineMonde,
                        r.cafe,
                        r.salonThe,
                        r.site1,
                        r.fonctionalite1,
                        r.fourchettePrix1,
                        r.horaires1,
                        r.prestation1,
                        r.regimeSpeciaux1,
                        r.repas1,
                        r.typeCuisine1,
                        r.dep,
                        r.depName,
                        r.tel,
                        r.poiX,
                        r.poiY,
                        r.poiX as long,
                        r.poiY as lat"
                    )
                    // ->distinct('r.denominationF, r.poiX, r.poiY')
                    ->distinct(
                        $query->expr()->concat(
                            'r.id', "' '",
                            'r.dep',"' '",
                            'r.depName',"' '",
                            'r.denominationF',"' '",
                            'r.numvoie',"' '",
                            'r.typevoie',"' '",
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

        if( $codinsee ){
            $query = $query->andWhere("r.codinsee =:codinsee")
                           ->setParameter("codinsee", $codinsee);
        }

        return $query->orderBy('RAND()')
                    ->setMaxResults($taille)
                    ->getQuery()
                    ->getResult();
    }


    public function getDataByFilterOptions($filterOptions, $data_max= 200){
        $idDep= strlen($filterOptions["dep"]) === 1  ? "0" . $filterOptions["dep"] : $filterOptions["dep"];

        $produit= $filterOptions["produit"];
        $price_produit_min= $filterOptions["price_produit"]["min"];
        $price_produit_min= $filterOptions["price_produit"]["min"];

        $price_produit_max= $filterOptions["price_produit"]["max"];
        $price_produit_max= $filterOptions["price_produit"]["max"];

        $query = $this->createQueryBuilder("r");
        $query = $query->select(
                "r.id,
                r.denominationF,
                r.denominationF as nameFilter,
                r.numvoie,
                r.typevoie,
                r.nomvoie,
                r.compvoie,
                r.codpost,
                r.villenorm,
                r.commune,
                r.restaurant,
                r.restaurant as resto,
                r.brasserie,
                r.creperie,
                r.fastFood,
                r.pizzeria,
                r.boulangerie,
                r.bar,
                r.cuisineMonde,
                r.cafe,
                r.salonThe,
                r.site1,
                r.fonctionalite1,
                r.fourchettePrix1,
                r.fourchettePrix2,
                r.horaires1,
                r.prestation1,
                r.regimeSpeciaux1,
                r.repas1,
                r.typeCuisine1,
                r.dep,
                r.depName,
                r.tel,
                r.poiX,
                r.poiY,
                r.poiX as long,
                r.poiY as lat"
            )
            ->distinct(
                $query->expr()->concat(
                    'r.id', "' '",
                    'r.dep',"' '",
                    'r.depName',"' '",
                    'r.denominationF',"' '",
                    'r.numvoie',"' '",
                    'r.typevoie',"' '",
                    'r.nomvoie',"' '",
                    'r.compvoie',"' '",
                    'r.villenorm',"' '",
                    'r.poiX',"' '",
                    'r.poiY'
                )
            )
        ;

        if( $idDep != 'tous' ){
            $query = $query->where("r.dep =:idDep");
        }

        $active= true;
        $have_active= false;
        foreach ($produit as $cle => $element) {
            if($element){
                if( $idDep !== "tous"){
                    $query = $query->andWhere("(r.dep = :idDep) AND (r." . $cle . " = :active)");
                }else{
                    $query = $query->andWhere("r." . $cle . " = :active");
                }

                $have_active= true;
            }
        }

        if($have_active){
            $query= $query->setParameter("active", $active);
        }

        if( $idDep != 'tous' ){
            $query = $query->setParameter("idDep", $idDep);
        }

        if( $price_produit_min !== $filterOptions["price_produit"]["min_default"] || $price_produit_max !== $filterOptions["price_produit"]["max_default"] ){
            $query = $query->andWhere("r.fourchettePrix1 != ''");
        }

        $result= $query->orderBy('RAND()')
            ->setMaxResults($data_max)
            ->getQuery()
            ->getResult();

        if( $price_produit_min === $filterOptions["price_produit"]["min_default"] && $price_produit_max === $filterOptions["price_produit"]["max_default"] ){
            return $result;
        }

        $result_filter= [];

        foreach($result as $item_result){
            if( $item_result["fourchettePrix1"] !== "" && str_contains($item_result["fourchettePrix1"], '-')){
                $is_much_price= false;
                $fourchettePrix1= $item_result["fourchettePrix1"];

                $pieces = explode("-", $fourchettePrix1);
                $min= $pieces[0];

                $pieces = explode(" ", $pieces[1]);
                $max= $pieces[0];

                if(intval($price_produit_min) <= intval($min) && intval($max) <= intval($price_produit_max)){
                    $is_much_price= true;
                }

                if($is_much_price){
                    array_push($result_filter, $item_result);
                }
            }
        }

        return $result_filter;
    }

    public function getDataByFilterOptionsCount($filterOptions){
        $idDep= strlen($filterOptions["dep"]) === 1  ? "0" . $filterOptions["dep"] : $filterOptions["dep"];

        $produit= $filterOptions["produit"];
        $price_produit_min= $filterOptions["price_produit"]["min"];
        $price_produit_min= $filterOptions["price_produit"]["min"];

        $price_produit_max= $filterOptions["price_produit"]["max"];
        $price_produit_max= $filterOptions["price_produit"]["max"];

        $query = $this->createQueryBuilder("r");
        $query = $query->select(
                "r.id,
                r.denominationF,
                r.denominationF as nameFilter,
                r.numvoie,
                r.typevoie,
                r.nomvoie,
                r.compvoie,
                r.codpost,
                r.villenorm,
                r.commune,
                r.restaurant,
                r.restaurant as resto,
                r.brasserie,
                r.creperie,
                r.fastFood,
                r.pizzeria,
                r.boulangerie,
                r.bar,
                r.cuisineMonde,
                r.cafe,
                r.salonThe,
                r.site1,
                r.fonctionalite1,
                r.fourchettePrix1,
                r.fourchettePrix2,
                r.horaires1,
                r.prestation1,
                r.regimeSpeciaux1,
                r.repas1,
                r.typeCuisine1,
                r.dep,
                r.depName,
                r.tel,
                r.poiX,
                r.poiY,
                r.poiX as long,
                r.poiY as lat"
            )
            ->distinct(
                $query->expr()->concat(
                    'r.id', "' '",
                    'r.dep',"' '",
                    'r.depName',"' '",
                    'r.denominationF',"' '",
                    'r.numvoie',"' '",
                    'r.typevoie',"' '",
                    'r.nomvoie',"' '",
                    'r.compvoie',"' '",
                    'r.villenorm',"' '",
                    'r.poiX',"' '",
                    'r.poiY'
                )
            )
        ;

        if( $idDep != 'tous' ){
            $query = $query->where("r.dep =:idDep");
        }

        $active= true;
        $have_active= false;
        foreach ($produit as $cle => $element) {
            if($element){
                if( $idDep !== "tous"){
                    $query = $query->andWhere("(r.dep = :idDep) AND (r." . $cle . " = :active)");
                }else{
                    $query = $query->andWhere("r." . $cle . " = :active");
                }

                $have_active= true;
            }
        }

        if($have_active){
            $query= $query->setParameter("active", $active);
        }

        if( $idDep != 'tous' ){
            $query = $query->setParameter("idDep", $idDep);
        }

        if( $price_produit_min !== $filterOptions["price_produit"]["min_default"] || $price_produit_max !== $filterOptions["price_produit"]["max_default"] ){
            $query = $query->andWhere("r.fourchettePrix1 != ''");
        }

        $result= $query->getQuery()
            ->getResult();

        if( $price_produit_min === $filterOptions["price_produit"]["min_default"] && $price_produit_max === $filterOptions["price_produit"]["max_default"] ){
            return count($result);
        }

        $result_filter= [];

        foreach($result as $item_result){
            if( $item_result["fourchettePrix1"] !== "" && str_contains($item_result["fourchettePrix1"], '-')){
                $is_much_price= false;
                $fourchettePrix1= $item_result["fourchettePrix1"];

                $pieces = explode("-", $fourchettePrix1);
                $min= $pieces[0];

                $pieces = explode(" ", $pieces[1]);
                $max= $pieces[0];

                if(intval($price_produit_min) <= intval($min) && intval($max) <= intval($price_produit_max)){
                    $is_much_price= true;
                }

                if($is_much_price){
                    array_push($result_filter, $item_result);
                }
            }
        }

        return count($result_filter);
    }

    public function getAllOpenedRestosV2($limits = 0){
        return $this->createQueryBuilder("r")
            ->select("r.id,
                    r.denominationF,
                    r.denominationF as nameFilter,
                    r.numvoie,
                    r.typevoie,
                    r.nomvoie,
                    r.compvoie,
                    r.codpost,
                    r.villenorm,
                    r.commune,
                    r.restaurant,
                    r.brasserie,
                    r.creperie,
                    r.fastFood,
                    r.pizzeria,
                    r.boulangerie,
                    r.bar,
                    r.cuisineMonde,
                    r.cafe,
                    r.salonThe,
                    r.site1,
                    r.fonctionalite1,
                    r.fourchettePrix1,
                    r.horaires1,
                    r.prestation1,
                    r.regimeSpeciaux1,
                    r.repas1,
                    r.typeCuisine1,
                    r.dep,
                    r.depName,
                    r.tel,
                    r.poiX,
                    r.poiY")
            ->orderBy('RAND()')
            ->setMaxResults($limits)
            ->getQuery()
            ->getResult();
    }

    public function getAllEtab()
    {
        return $this->createQueryBuilder("r")
            ->select("r.id,
                r.id as id_etab,
                r.denominationF as name,
                r.denominationF as nameFilter,
                r.denominationF,
                r.numvoie,
                r.typevoie,
                r.nomvoie,
                r.compvoie,
                r.codpost,
                r.villenorm,
                r.commune,
                r.dep,
                r.dep as id_dep,
                r.depName,
                r.depName as departement,
                r.tel,
                r.poiX,
                r.poiY,
                r.poiX as long,
                r.poiY as lat,
                CONCAT(r.numvoie,' ',r.typevoie, ' ',r.nomvoie) as rue,
                CONCAT(r.numvoie,' ',r.typevoie, ' ',r.nomvoie, ' ',r.codpost, ' ',r.villenorm) as adresse"
            )
            ->orderBy('RAND()')
            ->setMaxResults(100)
            ->getQuery()
            ->getResult();
    }

    public function getEtabForSpecificDep($id)
    {
        return $this->createQueryBuilder("r")
            ->select("r.id,
                r.id as id_etab,
                r.denominationF as name,
                r.denominationF as nameFilter,
                r.denominationF,
                r.numvoie,
                r.typevoie,
                r.nomvoie,
                r.compvoie,
                r.codpost,
                r.villenorm,
                r.commune,
                r.dep,
                r.dep as id_dep,
                r.depName,
                r.depName as departement,
                r.tel,
                r.poiX,
                r.poiY,
                r.poiX as long,
                r.poiY as lat,
                CONCAT(r.numvoie,' ',r.typevoie, ' ',r.nomvoie) as rue,
                CONCAT(r.numvoie,' ',r.typevoie, ' ',r.nomvoie, ' ',r.codpost, ' ',r.villenorm) as adresse"
            )
            ->where("r.dep =:id")
            ->setParameter("id",$id)
            ->orderBy('RAND()')
            // ->setMaxResults(50)
            ->getQuery()
            ->getResult();
    }

    public function findRestoById(int $id)
    {
        return $this->createQueryBuilder("r")
            ->select("r.id,
                r.id as id_etab,
                r.denominationF as name,
                r.denominationF as nameFilter,
                r.denominationF,
                r.numvoie,
                r.typevoie,
                r.nomvoie,
                r.compvoie,
                r.codpost,
                r.villenorm,
                r.commune,
                r.dep,
                r.dep as id_dep,
                r.depName,
                r.depName as departement,
                r.tel,
                r.poiX,
                r.poiY,
                r.poiX as long,
                r.poiY as lat,
                CONCAT(r.numvoie,' ',r.typevoie, ' ',r.nomvoie) as rue,
                CONCAT(r.numvoie,' ',r.typevoie, ' ',r.nomvoie, ' ',r.codpost, ' ',r.villenorm) as adresse"
            )
            ->orderBy('RAND()')
            ->setMaxResults(20)
            ->getQuery()
            ->getResult();
    }


}