<?php

namespace App\Repository;

use App\Entity\Codinsee;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Codinsee>
 *
 * @method Codinsee|null find($id, $lockMode = null, $lockVersion = null)
 * @method Codinsee|null findOneBy(array $criteria, array $orderBy = null)
 * @method Codinsee[]    findAll()
 * @method Codinsee[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class CodeinseeRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Codinsee::class);
    }

    public function add(Codinsee $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(Codinsee $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }
    public function getAllCodinsee($dep){
        return $this->createQueryBuilder("c")
        ->where("c.departement = :dep")
        ->setParameter("dep",$dep)
        ->orderBy('c.arrondissement', 'ASC')
        ->getQuery()
        ->getResult();
    }

//    /**
//     * @return Codinsee[] Returns an array of Codinsee objects
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

//    public function findOneBySomeField($value): ?Codinsee
//    {
//        return $this->createQueryBuilder('c')
//            ->andWhere('c.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
