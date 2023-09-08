<?php

namespace App\Repository;

use App\Entity\Tabac;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

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


    public function getOneTabac($tabacID){
        $data = $this->createQueryBuilder('r')
            ->select(
                'r.id',
                'r.clenum',
                'r.denomination_f',
                'r.denomination_f as nom',
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



//    /**
//     * @return Tabac[] Returns an array of Tabac objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('t')
//            ->andWhere('t.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('t.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?Tabac
//    {
//        return $this->createQueryBuilder('t')
//            ->andWhere('t.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
