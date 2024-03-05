<?php

namespace App\Repository;

use App\Entity\MarcheUserModify;
use App\Service\DepartementService;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;

/**
 * @extends ServiceEntityRepository<MarcheUserModify>
 *
 * @method MarcheUserModify|null find($id, $lockMode = null, $lockVersion = null)
 * @method MarcheUserModify|null findOneBy(array $criteria, array $orderBy = null)
 * @method MarcheUserModify[]    findAll()
 * @method MarcheUserModify[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class MarcheUserModifyRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, MarcheUserModify::class);
    }

    public function add(MarcheUserModify $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(MarcheUserModify $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

        /**
     * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
     * 
     * Goal: Get on element by the id
     * Use in: MarcheController.php
     */
    public function getOneItemByID($id){
        return  $this->createQueryBuilder("r")
                ->select(
                    "r.id,
                    r.clenum,
                    r.denominationF,
                    r.denominationF as nameFilter,
                    r.adresse,
                    r.codpost,
                    r.commune,
                    r.codinsee,
                    r.villenorm,
                    r.specificite,
                    r.jour_de_marche_1,
                    r.jour_de_marche_2,
                    r.jour_de_marche_3,
                    r.jour_de_marche_4,
                    r.jour_de_marche_5,
                    r.jour_de_marche_6,
                    r.jour_de_marche_7,
                    r.poi_qualitegeorue,
                    r.dcomiris,
                    r.dep,
                    r.date_data,
                    r.date_inser,
                    r.userId,
                    r.status,
                    r.poiY as lat,
                    r.poiX as long"
                )
                ->where("r.id =:id")
                ->setParameter("id", $id)
                ->getQuery()
                ->getOneOrNullResult();
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
