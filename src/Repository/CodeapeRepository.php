<?php
namespace App\Repository;

use App\Entity\CodeApe;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<CodeApe>
 *
 * @method CodeApe|null find($id, $lockMode = null, $lockVersion = null)
 * @method CodeApe|null findOneBy(array $criteria, array $orderBy = null)
 * @method CodeApe[]    findAll()
 * @method CodeApe[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class CodeapeRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $managerRegistry)
    {
        parent::__construct($managerRegistry, CodeApe::class);
    }

    public function add(CodeApe $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(CodeApe $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    // Tom : prendre seulement tous  les departements .
    public function getCode()
    {
      

        $qb = $this->createQueryBuilder('c')
            ->select('c.id', 'c.code', 'c.libelle')
            ->orderBy('c.id', 'ASC');

        $query = $qb->getQuery();
        return $query->getResult();
    }
    public function getByName($name,$value)
    {


        $qb = $this->createQueryBuilder("c")
            ->select("c.id", "c.code", "c.libelle")
            ->where("c.$name = :value")
            ->setParameter("value",$value)
            ->orderBy("c.id", "ASC");

        $query = $qb->getQuery();
        return $query->getResult();
    }
}