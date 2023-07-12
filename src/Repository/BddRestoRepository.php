<?php

namespace App\Repository;

use App\Entity\BddResto;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

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

    function getAccountRestauranting()
    {
        return $this->createQueryBuilder("r")
            ->select("count(r.id)")
            //->groupBy('r.denominationF, r.poiX, r.poiY')
            //->having('COUNT(r.denominationF)>1 and COUNT(r.poiX)>1 and COUNT(r.poiY)>1')
            ->getQuery()
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

    public function getCoordinateAndRestoIdForSpecific($dep)
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
            //->setMaxResults(10)
            ->getResult();
    }


    ///jheo : getByCles 
    public function getBySpecificClef(string $mot_cles0, string $mot_cles1, int $page = 0, $size=20){

        $page_current =$page > 1 ? $page * 10 +1  : 0;
        // const { dep, depName, nomvoie, typevoie, villenorm, commune, codpost , numvoie } = item;
        //  showResultSearchNavBar("resto",nomvoie, villenorm,dep, depName, id)
        // showResultSearchNavBar("ferme", nom, add, dep, depName, id);
        $qb = $this->createQueryBuilder("p")
                ->select("p.id,
                        p.dep,
                        p.depName,
                        p.numvoie,
                        p.typevoie,
                        p.commune,
                        p.villenorm,
                        p.codpost,
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
                        CONCAT(p.numvoie,' ',p.typevoie, ' ',p.nomvoie, ' ',p.codpost, ' ',p.villenorm) as add");
        if( $mot_cles0 !== "" && $mot_cles1 === "" ){
          
            $qb = $qb->where("MATCH_AGAINST(p.denominationF) AGAINST( :cles0 boolean) > 0")
                ->orWhere("MATCH_AGAINST(p.nomvoie) AGAINST( :cles0 boolean) > 0")
                ->orWhere("MATCH_AGAINST(p.typevoie) AGAINST( :cles0 boolean) > 0")
                ->orWhere("MATCH_AGAINST(p.villenorm) AGAINST( :cles0 boolean) > 0")
                ->orWhere("MATCH_AGAINST(p.commune) AGAINST( :cles0 boolean) > 0")
                ->orWhere("p.codpost LIKE :cles0")
                // ->orWhere("p.denominationF LIKE :cles0")
                ->orWhere("CONCAT(p.numvoie,' ',p.typevoie, ' ',p.nomvoie, ' ',p.codpost, ' ',p.villenorm) LIKE :cles0")
                ->setParameter('cles0', '%'. $mot_cles0. '%' );
                
        }else if ($mot_cles0 === "" && $mot_cles1 !== "" ){
            if( strlen($mot_cles1) === 2 ){
                
                $qb = $qb->where("p.dep LIKE :cles1")
                         ->setParameter('cles1', '%'. $mot_cles1. '%' );
            }else{

                $qb = $qb->where("p.dep LIKE :cles1")
                    ->orWhere("MATCH_AGAINST(p.nomvoie) AGAINST( :cles1 boolean) > 0")
                    ->orWhere("p.depName LIKE :cles1")
                    ->orWhere("p.typevoie LIKE :cles1")
                    ->orWhere("MATCH_AGAINST(p.villenorm) AGAINST( :cles1 boolean) > 0")
                    ->orWhere("MATCH_AGAINST(p.commune) AGAINST( :cles1 boolean) > 0")
                    ->orWhere("p.codpost LIKE :cles1")
                    ->orWhere("p.numvoie LIKE :cles1")
                    ->orWhere("MATCH_AGAINST(p.denominationF) AGAINST( :cles1 boolean) > 0")
                    ->orWhere("CONCAT(p.dep,' ',p.depName) LIKE :cles1")
                    ->orWhere("CONCAT(p.numvoie,' ',p.typevoie, ' ',p.nomvoie, ' ',p.codpost, ' ',p.villenorm) LIKE :cles1")
                    ->setParameter('cles1', '%'. $mot_cles1. '%' );
            }

        }else {

            $qb = $qb->where("(p.dep LIKE :cles0) AND ( p.depName LIKE :cles1)")
                ->orWhere("(p.dep LIKE :cles0) AND ( MATCH_AGAINST(p.nomvoie) AGAINST( :cles1 boolean) > 0)")
                ->orWhere("(p.dep LIKE :cles0) AND ( MATCH_AGAINST(p.commune) AGAINST( :cles1 boolean) > 0)")
                ->orWhere("(p.depName LIKE :cles0) AND ( MATCH_AGAINST(p.commune) AGAINST( :cles1 boolean) > 0)")
                ->orWhere("(MATCH_AGAINST(p.nomvoie) AGAINST( :cles0 boolean) > 0) AND ( p.depName LIKE :cles1)")
                ->orWhere("(MATCH_AGAINST(p.nomvoie) AGAINST( :cles0 boolean) > 0) AND ( MATCH_AGAINST(p.commune) AGAINST( :cles1 boolean) > 0)")
                ->orWhere("(MATCH_AGAINST(p.denominationF) AGAINST( :cles0 boolean) > 0) AND ( MATCH_AGAINST(p.villenorm) AGAINST( :cles1 boolean) > 0 )")
                ->orWhere("(MATCH_AGAINST(p.denominationF) AGAINST( :cles0 boolean) > 0) AND ( p.depName LIKE :cles1)")
                ->orWhere("(MATCH_AGAINST(p.denominationF) AGAINST( :cles0 boolean) > 0) AND ( p.dep LIKE :cles1)")
                ->orWhere("(MATCH_AGAINST(p.denominationF) AGAINST( :cles0 boolean) > 0) AND ( MATCH_AGAINST(p.commune) AGAINST( :cles1 boolean) > 0)")
                ->orWhere("(CONCAT(p.numvoie,' ',p.typevoie, ' ',p.nomvoie, ' ',p.codpost, ' ',p.villenorm) LIKE :cles0 ) AND ( p.depName LIKE :cles1)")
                ->orWhere("(CONCAT(p.numvoie,' ',p.typevoie, ' ',p.nomvoie, ' ',p.codpost, ' ',p.villenorm) LIKE :cles0 ) AND ( p.commune LIKE :cles1)")
                ->setParameter('cles0', '%'. $mot_cles0. '%' )
                ->setParameter('cles1', '%'. $mot_cles1. '%' );

        }
        // $qb = $qb->setFirstResult($page_current)
        //     ->setMaxResults($size)
        //     ->orderBy('p.nomvoie', 'ASC')
        //     ->getQuery();

        $qb = $qb->orderBy('p.nomvoie', 'ASC')
                 ->getQuery();
            

        // const singleMatch = numvoie + " " + typevoie + " " + nomvoie + " " + codpost + " " + villenorm;
        $results = $qb->execute();
        return [ $results , count($results) , "resto"];
    }

    public function getRestoByCodinsee($codinsee, $dep)
    {
        return $this->createQueryBuilder("r")
            ->select(
                "r.id,r.denominationF,
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
            ->where("r.dep =:dep")
            ->andWhere("r.id =:id")
            //->groupBy("r.denominationF, r.poiX, r.poiY")
            //->having('count(r.denominationF)=1')  
            //->andHaving('count(r.poiX)=1')
            //->andHaving('count(r.poiY) =1')
            ->setParameter("dep", $dep)
            ->setParameter("id", $id)
            ->orderBy("r.id", 'ASC')
            ->getQuery()
            ->getResult();
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
    public function getAllOpenedRestos()
    {
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
                    ->orderBy('RAND()')
                    ->setMaxResults($limits)
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
}
