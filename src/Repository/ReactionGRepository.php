<?php

namespace App\Repository;

use App\Entity\ReactionG;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<ReactionG>
 *
 * @method ReactionG|null find($id, $lockMode = null, $lockVersion = null)
 * @method ReactionG|null findOneBy(array $criteria, array $orderBy = null)
 * @method ReactionG[]    findAll()
 * @method ReactionG[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ReactionGRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ReactionG::class);
    }

    public function add(ReactionG $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(ReactionG $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

   /**
    * @return ReactionG[] Returns an array of ReactionG objects
    */
   public function findOneByPubAndUser($pub_id, $user_id): ?ReactionG
   {
       return $this->createQueryBuilder('r')
           ->andWhere('r.publication_id = :val')
           ->andWhere('r.user_id = :val2')
           ->setParameter('val', $pub_id)
           ->setParameter('val2', $user_id)
           ->orderBy('r.id', 'ASC')
           ->getQuery()
           ->getOneOrNullResult()
       ;
   }

//    public function findOneBySomeField($value): ?ReactionG
//    {
//        return $this->createQueryBuilder('r')
//            ->andWhere('r.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
