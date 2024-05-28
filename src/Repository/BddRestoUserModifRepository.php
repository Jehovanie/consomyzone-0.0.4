<?php

namespace App\Repository;

use App\Entity\BddRestoUserModif;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;

/**
 * @extends ServiceEntityRepository<BddRestoUserModif>
 *
 * @method BddRestoUserModif|null find($id, $lockMode = null, $lockVersion = null)
 * @method BddRestoUserModif|null findOneBy(array $criteria, array $orderBy = null)
 * @method BddRestoUserModif[]    findAll()
 * @method BddRestoUserModif[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class BddRestoUserModifRepository extends ServiceEntityRepository
{

    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, BddRestoUserModif::class);
    }



    public function save(BddRestoUserModif $entity, bool $flush = false)
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }

        return $this->getEntityManager()->contains($entity);
    }

    public function getStatesDataResto($ids){
        $data= $this->createQueryBuilder("r")
                    ->select("r.id, r.userId, r.status, r.restoId as rubriqueId, r.validateurId as validatorId")
                    ->where("r.restoId IN (:u)")
                    ->setParameter("u",$ids)
                    ->getQuery()
                    ->getResult()
        ;
        

        return $data;
    }
}
