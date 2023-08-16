<?php

namespace App\Repository;

use App\Entity\GolfFinished;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<GolfFinished>
 *
 * @method GolfFinished|null find($id, $lockMode = null, $lockVersion = null)
 * @method GolfFinished|null findOneBy(array $criteria, array $orderBy = null)
 * @method GolfFinished[]    findAll()
 * @method GolfFinished[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class GolfFinishedRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, GolfFinished::class);
    }

//    /**
//     * @return GolfFinished[] Returns an array of GolfFinished objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('g')
//            ->andWhere('g.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('g.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?GolfFinished
//    {
//        return $this->createQueryBuilder('g')
//            ->andWhere('g.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}