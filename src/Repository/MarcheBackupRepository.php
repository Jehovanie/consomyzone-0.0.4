<?php

namespace App\Repository;

use App\Entity\Marche;
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
class MarcheBackupRepository extends ServiceEntityRepository
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

public function getMarketByIdAndDep($dep,$id){
        $qb=$this->createQueryBuilder("mb")
        ->where("mb.dep=:dep")
        ->andWhere("mb.marcheId=:id")
        ->setParameter("dep",$dep)
        ->setParameter("id",$id)
        ->getQuery()
        ->getResult();

        return $qb;
    }
    public function getMarketByIdBackAndDep($dep,$id){
        $qb=$this->createQueryBuilder("mb")
        ->where("mb.dep=:dep")
        ->andWhere("mb.id=:id")
        ->setParameter("dep",$dep)
        ->setParameter("id",$id)
        ->getQuery()
        ->getResult();

        return $qb;
    }
    
}
