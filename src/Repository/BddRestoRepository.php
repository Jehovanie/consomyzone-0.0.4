<?php

namespace App\Repository;

use App\Entity\BddResto;
use App\Service\DepartementService;
use Doctrine\Persistence\ManagerRegistry;
use App\Service\DicoRestoForSearchService;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;

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

    function getAccountRestauranting($idDep=null)
    {
        $query= $this->createQueryBuilder("r")
                ->select("count(r.id)");
            //->groupBy('r.denominationF, r.poiX, r.poiY')
            //->having('COUNT(r.denominationF)>1 and COUNT(r.poiX)>1 and COUNT(r.poiY)>1')
                         
        if( $idDep ){
            $query = $query->where("r.dep =:dep")
                           ->setParameter("dep", $idDep);
        }

        return $query->getQuery()
                     ->getSingleScalarResult();
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
                        CONCAT(r.numvoie,' ',r.typevoie, ' ',r.nomvoie) as rue,
                        CONCAT(r.numvoie,' ',r.typevoie, ' ',r.nomvoie, ' ',r.codpost, ' ',r.villenorm) as add"
                    )
                    ->where("r.dep =:dep")
                    ->setParameter("dep",$dep)
                    ->groupBy("r.denominationF, r.poiX, r.poiY")
                    ->having('count(r.denominationF)=1')
                    ->andHaving('count(r.poiX)=1')
                    ->andHaving('count(r.poiY) =1');

        if( $codinsee ){
            $query = $query->andWhere("r.codinsee =:codinsee")
                           ->setParameter("codinsee", $codinsee);
        }

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
            ->where("r.dep =:dep")
            ->setParameter("dep", $dep)
            ->groupBy("r.denominationF, r.poiX, r.poiY")
            ->having('count(r.denominationF)=1')
            ->andHaving('count(r.poiX)=1')
            ->andHaving('count(r.poiY) =1');

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
            ->where("r.codinsee =:codinsee")
            ->andWhere("r.dep =:dep")
            ->groupBy("r.denominationF, r.poiX, r.poiY")
            ->having('count(r.denominationF)=1')
            ->andHaving('count(r.poiX)=1')
            ->andHaving('count(r.poiY) =1')
            ->setParameter("codinsee", $codinsee)
            ->setParameter("dep", $dep)
            ->orderBy("r.denominationF", 'ASC')
            ->getQuery()
            ->getResult();
    }

    public function getOneRestaurant($dep, $id)
    {
        $resto =  $this->createQueryBuilder("r")
                ->select("r.id,
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
                    r.codinsee,
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

    public function getOneRestaurantById($id)
    {
        return $this->createQueryBuilder("r")
            ->select("r.id,r.denominationF,
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
            ->groupBy("r.denominationF, r.poiX, r.poiY")
            ->having('count(r.denominationF)=1')
            ->andHaving('count(r.poiX)=1')
            ->andHaving('count(r.poiY) =1')
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
            ->groupBy("r.denominationF, r.poiX, r.poiY")
            ->having('count(r.denominationF)=1')
            ->andHaving('count(r.poiX)=1')
            ->andHaving('count(r.poiY) =1')
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
        return $this->createQueryBuilder("r")
                    ->select("r.id,
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
                        r.poiY as lat,
                        r.poiX as long"
                    )
                    ->orderBy('RAND()')
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
                $idRestoPastille = $itemRestoPastille["id"];
                $isAlreadyGet = array_search($idRestoPastille, array_column($datas, 'id'));

                if( !$isAlreadyGet){
                    array_push($datas, $itemRestoPastille);
                }
            }
        }
        return $datas;
    }


    public function getDataBetweenAnd($minx,$miny,$maxx,$maxy , $idDep= null, $codinsee= null){
        $query =  $this->createQueryBuilder("r")
                    ->select("r.id,
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
                        r.poiY as lat"
                    )
                    ->where("ABS(r.poiX) >=ABS(:minx) ")
                    ->andWhere("ABS(r.poiX) <= ABS(:maxx)")
                    ->andWhere("ABS(r.poiY) >=ABS(:miny)")
                    ->andWhere("ABS(r.poiY) <=ABS(:maxy)")
                    ->setParameter("minx", $minx)
                    ->setParameter("maxx", $maxx)
                    ->setParameter("miny", $miny)
                    ->setParameter("maxy", $maxy)
                    ->groupBy("r.denominationF, r.poiX, r.poiY")
                    ->having('count(r.denominationF)=1')
                    ->andHaving('count(r.poiX)=1')
                    ->andHaving('count(r.poiY) =1');
                    
        if( $idDep ){
            $query = $query->andWhere("r.dep =:dep")
                           ->setParameter("dep", $idDep);
        }

        if( $codinsee ){
            $query = $query->andWhere("r.codinsee =:codinsee")
                           ->setParameter("codinsee", $codinsee);
        }

        return $query->orderBy('RAND()')
                    ->setMaxResults(200)
                    ->getQuery()
                    ->getResult();
    }
    //    /**
    //     * @return BddResto[] Returns an array of BddResto objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('b')
    //            ->andWhere('b.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('b.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?BddResto
    //    {
    //        return $this->createQueryBuilder('b')
    //            ->andWhere('b.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
    public function getAllOpenedRestosV2($limits = 0){
        return $this->createQueryBuilder("r")
            ->select("r.id,
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
