<?php

namespace App\Repository;

use App\Entity\MemberTributG;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<MemberTributG>
 *
 * @method MemberTributG|null find($id, $lockMode = null, $lockVersion = null)
 * @method MemberTributG|null findOneBy(array $criteria, array $orderBy = null)
 * @method MemberTributG[]    findAll()
 * @method MemberTributG[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class MemberTributGRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, MemberTributG::class);
    }

    public function add(MemberTributG $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(MemberTributG $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

//    /**
//     * @return MemberTributG[] Returns an array of MemberTributG objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('m')
//            ->andWhere('m.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('m.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?MemberTributG
//    {
//        return $this->createQueryBuilder('m')
//            ->andWhere('m.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }

    public function findOneByUserInTribut($user_id): ?MemberTributG
    {
        return $this->createQueryBuilder('m')
            ->andWhere('m.user_id = :val2')
            ->setParameter('val2', $user_id)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
}
