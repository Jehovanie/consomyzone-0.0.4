<?php

namespace App\Repository;

use App\Entity\CommuneGeoCoder;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<CommuneGeoCoder>
 *
 * @method CommuneGeoCoder|null find($id, $lockMode = null, $lockVersion = null)
 * @method CommuneGeoCoder|null findOneBy(array $criteria, array $orderBy = null)
 * @method CommuneGeoCoder[]    findAll()
 * @method CommuneGeoCoder[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class CommuneGeoCoderRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, CommuneGeoCoder::class);
    }

    public function add(CommuneGeoCoder $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(CommuneGeoCoder $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

//    /**
//     * @return CommuneGeoCoder[] Returns an array of CommuneGeoCoder objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('c')
//            ->andWhere('c.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('c.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?CommuneGeoCoder
//    {
//        return $this->createQueryBuilder('c')
//            ->andWhere('c.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
