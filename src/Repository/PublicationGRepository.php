<?php

namespace App\Repository;

use App\Entity\PublicationG;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<PublicationG>
 *
 * @method PublicationG|null find($id, $lockMode = null, $lockVersion = null)
 * @method PublicationG|null findOneBy(array $criteria, array $orderBy = null)
 * @method PublicationG[]    findAll()
 * @method PublicationG[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class PublicationGRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, PublicationG::class);
    }

    public function add(PublicationG $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(PublicationG $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

//    /**
//     * @return PublicationG[] Returns an array of PublicationG objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('p')
//            ->andWhere('p.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('p.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?PublicationG
//    {
//        return $this->createQueryBuilder('p')
//            ->andWhere('p.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
    public function findByUserAndTribut($user_id, $tribut_id): array
    {
        return $this->createQueryBuilder('p')
            ->andWhere('p.user_id = :val1')
            ->andWhere('p.tributg_id = :val2')
            ->setParameter('val1', $user_id)
            ->setParameter('val2', $tribut_id)
            ->orderBy('p.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }

    public function findByTribut($tribut_id): array
    {
        return $this->createQueryBuilder('p')
            ->andWhere('p.tribut_id = :val1')
            ->setParameter('val1', $tribut_id)
            ->orderBy('p.id', 'DESC')
            ->getQuery()
            ->getResult()
        ;
    }

    public function findAllById($tribut_id): array
    {
        return $this->createQueryBuilder('p')
            ->andWhere('p.tributg_id = :val')
            ->setParameter('val', $tribut_id)
            ->orderBy('p.id', 'DESC')
            ->getQuery()
            ->getResult()
        ;
    }

    public function findAllPub(): array
    {
        return $this->createQueryBuilder('p')
            ->orderBy('p.id', 'DESC')
            ->getQuery()
            ->getResult()
        ;
    }
}
