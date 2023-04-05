<?php

namespace App\Repository;

use App\Entity\Departement;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Departement>
 *
 * @method Departement|null find($id, $lockMode = null, $lockVersion = null)
 * @method Departement|null findOneBy(array $criteria, array $orderBy = null)
 * @method Departement[]    findAll()
 * @method Departement[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class DepartementRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Departement::class);
    }

    public function add(Departement $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(Departement $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }


    ///jheo : prendre seulement tous  les departements .
    public function getDep()
    {
        // $page_current = 10 * $page;
        
        $qb = $this->createQueryBuilder('p')
                ->distinct('p.departement')
                ->select('p.id' , 'p.departement')
                // ->setMaxResults(10)
                ->orderBy('p.id', 'ASC');
                // ->setFirstResult($page_current);
                
        $query = $qb->getQuery();
        return $query->execute();
    }

    ///jheo : prendre tous les departements tries
    public function getAllDep()
    {
        $qb = $this->createQueryBuilder('p')
                ->select('p.id',
                         'p.departement')
                ->orderBy('p.id', 'ASC');
        $query = $qb->getQuery();

        return $query->execute();
    }

    ///jheo : get number of row in database
    public function getCountDepartement(){
        $qb = $this->createQueryBuilder('p')
                ->select('count(p.id)');

        $query = $qb->getQuery();

        return $query->execute();
    }



//    /**
//     * @return Departement[] Returns an array of Departement objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('d')
//            ->andWhere('d.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('d.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?Departement
//    {
//        return $this->createQueryBuilder('d')
//            ->andWhere('d.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
