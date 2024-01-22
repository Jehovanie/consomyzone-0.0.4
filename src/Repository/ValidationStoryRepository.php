<?php

namespace App\Repository;

use App\Entity\ValidationStory;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;

/**
 * @extends ServiceEntityRepository<ValidationStory>
 *
 * @method ValidationStory|null find($id, $lockMode = null, $lockVersion = null)
 * @method ValidationStory|null findOneBy(array $criteria, array $orderBy = null)
 * @method ValidationStory[]    findAll()
 * @method ValidationStory[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ValidationStoryRepository extends ServiceEntityRepository
{

    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ValidationStory::class);
    }



    public function save(ValidationStory $entity, bool $flush = false)
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }

        return $this->getEntityManager()->contains($entity);
    }
}
