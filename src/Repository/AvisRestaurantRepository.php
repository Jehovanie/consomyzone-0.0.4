<?php

namespace App\Repository;

use App\Entity\AvisRestaurant;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<AvisRestaurant>
 *
 * @method AvisRestaurant|null find($id, $lockMode = null, $lockVersion = null)
 * @method AvisRestaurant|null findOneBy(array $criteria, array $orderBy = null)
 * @method AvisRestaurant[]    findAll()
 * @method AvisRestaurant[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class AvisRestaurantRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, AvisRestaurant::class);
    }

    public function add(AvisRestaurant $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(AvisRestaurant $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }
    
    public function updateAvis($idrestaurant,$iduser,$note,$comment)
    {
        return $this->createQueryBuilder("")
        ->update(AvisRestaurant::class,"a")
        ->set("a.note",":note")
        ->set("a.avis",":comment")
        ->set("a.datetime",":date")
        ->where("a.restaurant = :idResto")
        ->andWhere("a.user = :iduser")
        ->setParameter("note", $note)
        ->setParameter("comment", $comment)
        ->setParameter("idResto",$idrestaurant)
        ->setParameter("iduser", $iduser)
       ->setParameter("date", new \DateTimeImmutable())
        ->getQuery()
        ->execute();
    }

    public function deleteAvis($idrestaurant, $iduser,)
    {
        return $this->createQueryBuilder("")
        ->delete(AvisRestaurant::class,"a")
        ->where("a.restaurant = :idrestaurant")
        ->andWhere("a.user = :iduser")
        ->setParameter("idrestaurant", $idrestaurant)
        ->setParameter("iduser", $iduser)
        ->getQuery()
        ->execute();
    }

    public function getNoteGlobale($idrestaurant)
    {
        return $this->createQueryBuilder("r")
            ->where("r.restaurant = :idResto ")
            ->setParameter("idResto", $idrestaurant)
            ->getQuery()
            ->getResult();
    }

    public function getNote($idrestaurant,$user)
    {
        return $this->createQueryBuilder("r")
            ->where("r.restaurant = :idResto ")
            // ->andWhere("r.user = :idUser")
            ->setParameter("idResto", $idrestaurant)
            // ->setParameter("idUser", $user)
            ->getQuery()
            ->getResult();
    }

    public function getNombreAvis($idrestaurant){
        return $this->createQueryBuilder("r")
                    ->select("count(r.id)")
                    ->where("r.restaurant = :idResto ")
                    ->setParameter("idResto",$idrestaurant)
                    ->getQuery()
                    ->getSingleScalarResult();
    }
//    /**
//     * @return AvisRestaurant[] Returns an array of AvisRestaurant objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('a')
//            ->andWhere('a.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('a.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?AvisRestaurant
//    {
//        return $this->createQueryBuilder('a')
//            ->andWhere('a.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
