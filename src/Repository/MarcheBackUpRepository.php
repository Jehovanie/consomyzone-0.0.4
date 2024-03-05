<?php

namespace App\Repository;

use App\Entity\MarcheBackup;
use App\Service\DepartementService;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;

/**
 * @extends ServiceEntityRepository<MarcheBackup>
 *
 * @method MarcheBackup|null find($id, $lockMode = null, $lockVersion = null)
 * @method MarcheBackup|null findOneBy(array $criteria, array $orderBy = null)
 * @method MarcheBackup[]    findAll()
 * @method MarcheBackup[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class MarcheBackUpRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, MarcheBackup::class);
    }

    public function add(MarcheBackup $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(MarcheBackup $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

//    /**
//     * @return Marche[] Returns an array of Marche objects
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

//    public function findOneBySomeField($value): ?Marche
//    {
//        return $this->createQueryBuilder('m')
//            ->andWhere('m.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
