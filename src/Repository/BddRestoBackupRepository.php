<?php

namespace App\Repository;

use App\Entity\BddRestoBackup;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;

/**
 * @extends ServiceEntityRepository<BddRestoBackup>
 *
 * @method BddRestoBackup|null find($id, $lockMode = null, $lockVersion = null)
 * @method BddRestoBackup|null findOneBy(array $criteria, array $orderBy = null)
 * @method BddRestoBackup[]    findAll()
 * @method BddRestoBackup[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class BddRestoBackupRepository extends ServiceEntityRepository
{

    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, BddRestoBackup::class);
    }



    public function save(BddRestoBackup $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }
}
