<?php

namespace App\Repository;

use App\Entity\Confidentiality;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Confidentiality>
 *
 * @method Confidentiality|null find($id, $lockMode = null, $lockVersion = null)
 * @method Confidentiality|null findOneBy(array $criteria, array $orderBy = null)
 * @method Confidentiality[]    findAll()
 * @method Confidentiality[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ConfidentialityRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Confidentiality::class);
    }

    public function add(Confidentiality $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(Confidentiality $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

//    /**
//     * @return Confidentiality[] Returns an array of Confidentiality objects
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

//    public function findOneBySomeField($value): ?Confidentiality
//    {
//        return $this->createQueryBuilder('c')
//            ->andWhere('c.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }

   public function findByUserId($value): ?array
   {
       return $this->createQueryBuilder('c')
                   ->where('c.user_id = :val')
                   ->setParameter('val', $value)
                   ->getQuery()
                   ->getResult()

       ;
   }
}
