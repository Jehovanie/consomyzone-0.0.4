<?php

namespace App\Repository;

use App\Entity\AbonnementHistorique;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<AbonnementHistorique>
 *
 * @method AbonnementHistorique|null find($id, $lockMode = null, $lockVersion = null)
 * @method AbonnementHistorique|null findOneBy(array $criteria, array $orderBy = null)
 * @method AbonnementHistorique[]    findAll()
 * @method AbonnementHistorique[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class AbonnementHistoriqueRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, AbonnementHistorique::class);
    }

    public function add(AbonnementHistorique $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(AbonnementHistorique $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);
        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    

//    /**
//     * @return AbonnementHistorique[] Returns an array of AbonnementHistorique objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('a')
//            ->andWhere('a.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('a.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?AbonnementHistorique
//    {
//        return $this->createQueryBuilder('a')
//            ->andWhere('a.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
