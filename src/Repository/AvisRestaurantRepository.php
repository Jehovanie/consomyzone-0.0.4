<?php

namespace App\Repository;

use App\Entity\AvisRestaurant;
use App\Service\UserService;
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
    public function __construct(ManagerRegistry $registry, UserService $userService)
    {
        parent::__construct($registry, AvisRestaurant::class);
        $this->userService = $userService;
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
    
    public function updateAvis($idrestaurant, $iduser, $avisID, $note, $comment)
    {
        return $this->createQueryBuilder("")
                ->update(AvisRestaurant::class,"a")
                ->set("a.note",":note")
                ->set("a.avis",":comment")
                ->where("a.restaurant = :idResto")
                ->andWhere("a.user = :iduser")
                ->andWhere("a.id = :id")
                ->setParameter("note", $note)
                ->setParameter("comment", $comment)
                ->setParameter("idResto",$idrestaurant)
                ->setParameter("iduser", $iduser)
                ->setParameter("id", $avisID)
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
        $all_avis= $this->createQueryBuilder("r")
                ->where("r.restaurant = :idResto ")
                ->setParameter("idResto", $idrestaurant)
                ->orderBy("r.datetime", "DESC")
                ->getQuery()
                ->getResult();

        $results = [];

        foreach ($all_avis as $avis){
            $user_id = $avis->getUser()->getId();
            $user_item = $this->userService->getUserProfileFromId($user_id);
            $resto_id= $avis->getRestaurant()->getId();
            $data = [
                "id" => $avis->getId(),
                "note" => $avis->getNote(),
                "avis" => $avis->getAvis(),
                "datetime" => $avis->getDatetime(),
                "resto" => [
                    "id" => $resto_id
                ],
                "user" => [
                    "id" => $user_id,
                    "email" => $avis->getUser()->getEmail(),
                    "pseudo" => $avis->getUser()->getPseudo(),
                    "fullname" => $user_item->getFirstname() . " " . $user_item->getLastname(),
                    "photo" => $user_item->getPhotoProfil(),
                ]
            ];

            array_push($results, $data);
        }
        return $results;
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
