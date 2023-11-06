<?php

namespace App\Repository;

use App\Entity\HachageTribuTName;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;


/**
 * @extends ServiceEntityRepository<HachageTribuTName>
 *
 * @method HachageTribuTName|null find($id, $lockMode = null, $lockVersion = null)
 * @method HachageTribuTName|null findOneBy(array $criteria, array $orderBy = null)
 * @method HachageTribuTName[]    findAll()
 * @method HachageTribuTName[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class HachageTribuTNameRepository extends ServiceEntityRepository
{

    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, HachageTribuTName::class);
    }


    public function save(HachageTribuTName $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }
}
