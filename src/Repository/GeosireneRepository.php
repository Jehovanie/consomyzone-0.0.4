<?php

namespace App\Repository;

use App\Entity\Geosirene;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Geosirene>
 *
 * @method Geosirene|null find($id, $lockMode = null, $lockVersion = null)
 * @method Geosirene|null findOneBy(array $criteria, array $orderBy = null)
 * @method Geosirene[]    findAll()
 * @method Geosirene[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class GeosireneRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Geosirene::class);
    }

    public function add(Geosirene $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(Geosirene $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function getAllCoordonnes()
    {

        return $this->createQueryBuilder('g')
            ->select(
                "g.activitePrincipaleEtablissement",
                "g.adresse",
                "g.latitude",
                "g.longitude",
                "g.denominationGeoscar",
                "g.departement",
                "g.departementName"
            )
            ->orderBy("g.id", "ASC")
            ->getQuery()
            ->getResult();
    }
    public function getAllCoordonnesByName($name, $value)
    {

        return $this->createQueryBuilder('g')
            ->select(
                "g.id",
                "g.activitePrincipaleEtablissement",
                "g.labelleActiviteEtablissement",
                "g.adresse",
                "g.latitude",
                "g.longitude",
                "g.denominationGeoscar",
                "g.departement",
                "g.departementName"
            )
            ->where("g.$name =:v")
            ->setParameter("v", $value)
            ->orderBy("g.id", "ASC")
            ->getQuery()
            ->getResult();
    }
    public function getAllCoordonnesByDepType($dep, $type)
    {

        return $this->createQueryBuilder('g')
            ->select(
                "g.id",
                "g.activitePrincipaleEtablissement",
                "g.labelleActiviteEtablissement",
                "g.adresse",
                "g.latitude",
                "g.longitude",
                "g.denominationGeoscar",
                "g.departement",
                "g.departementName"
            )
            ->where("g.departement =:v")
            ->andWhere("g.activitePrincipaleEtablissement =:a")
            ->setParameter("v", $dep)
            ->setParameter("a", $type)
            ->orderBy("g.id", "ASC")
            ->getQuery()
            ->getResult();
    }


    public function getAllCoordonnesByBaseAPE($value)
    {

        return $this->createQueryBuilder('g')
            ->select(
                "g.id",
                "g.activitePrincipaleEtablissement",
                "g.labelleActiviteEtablissement",
                "g.adresse",
                "g.latitude",
                "g.longitude",
                "g.denominationGeoscar",
                "g.departement",
                "g.departementName"
            )
            ->where("g.activitePrincipaleEtablissement LIKE :like")
            ->setParameter("like", "$value%")
            ->orderBy("g.id", "ASC")
            ->getQuery()
            ->getResult();
    }

    public function getNumberOfGeosirene($value)
    {

        return $this->createQueryBuilder('g')
            ->select("count(g.id)")
            ->where("g.activitePrincipaleEtablissement LIKE :like")
            ->setParameter("like", "$value%")
            ->orderBy("g.id", "ASC")
            ->getQuery()
            ->getSingleScalarResult();
    }

    


    //    /**
    //     * @return Geosirene[] Returns an array of Geosirene objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('g')
    //            ->andWhere('g.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('g.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?Geosirene
    //    {
    //        return $this->createQueryBuilder('g')
    //            ->andWhere('g.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
