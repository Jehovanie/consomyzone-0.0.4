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
                    'r.activiteSoumise',
                    'r.nom as name',
                    'r.dep',
                    'r.depName',
                    'r.adresse as adress',
                    'r.barTabac',
                    'r.bureauTabac',
                    'r.caveCigare',
                    'r.tabacPresse',
                    'r.services',
                    'r.telephone',
                    'r.resultScore',
                    'r.resultLabel',
                    'r.resultScoreNext',
                    'r.resultType',
                    'r.resultId',
                    'r.resultHousenumber',
                    'r.resultName',
                    'r.resultStreet',
                    'r.resultPostcode',
                    'r.resultCity',
                    'r.resultContext',
                    'r.resultCitycode',
                    'r.resultOldcitycode',
                    'r.resultOldcity',
                    'r.resultDistrict',
                    'r.resultStatus',
                    'r.latitude as lat',
                    'r.longitude as long',
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
            ->select(
                'r.id',
                'r.activiteSoumise',
                'r.nom',
                'r.nom as name',
                'r.dep',
                'r.depName',
                'r.adresse as add',
                'r.adresse as adress',
                'r.barTabac',
                'r.bureauTabac',
                'r.caveCigare',
                'r.tabacPresse',
                'r.services',
                'r.telephone',
                'r.telephone as tel',
                'r.resultScore',
                'r.resultLabel',
                'r.resultScoreNext',
                'r.resultType',
                'r.resultId',
                'r.resultHousenumber',
                'r.resultName',
                'r.resultStreet',
                'r.resultPostcode',
                'r.resultCity',
                'r.resultContext',
                'r.resultCitycode',
                'r.resultOldcitycode',
                'r.resultOldcity',
                'r.resultDistrict',
                'r.resultStatus',
                'r.latitude as lat',
                'r.longitude as long',
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
                'r.activiteSoumise',
                'r.nom',
                'r.dep',
                'r.depName',
                'r.adresse',
                'r.barTabac',
                'r.bureauTabac',
                'r.caveCigare',
                'r.tabacPresse',
                'r.services',
                'r.telephone',
                'r.telephone as tel',
                'r.resultScore',
                'r.resultLabel',
                'r.resultScoreNext',
                'r.resultType',
                'r.resultId',
                'r.resultHousenumber',
                'r.resultName',
                'r.resultStreet',
                'r.resultPostcode',
                'r.resultCity',
                'r.resultContext',
                'r.resultCitycode',
                'r.resultOldcitycode',
                'r.resultOldcity',
                'r.resultDistrict',
                'r.resultStatus',
                'r.latitude',
                'r.longitude',
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
