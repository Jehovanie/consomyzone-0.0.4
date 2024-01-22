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
    
    public function updateAvis($idrestaurant, $iduser, $avisID, $note, $comment,$type)
    {
        return $this->createQueryBuilder("")
                ->update(AvisRestaurant::class,"a")
                ->set("a.note",":note")
                ->set("a.avis",":comment")
                ->set("a.type",":type")
                ->where("a.restaurant = :idResto")
                ->andWhere("a.user = :iduser")
                ->andWhere("a.id = :id")
                ->setParameter("note", $note)
                ->setParameter("comment", json_encode($comment))
                ->setParameter("idResto",$idrestaurant)
                ->setParameter("iduser", $iduser)
                ->setParameter("type", $type)
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
                ->andWhere("r.user is not null")
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
                "avis" => json_decode($avis->getAvis(), true),
                "datetime" => $avis->getDatetime(),
                "type" => $avis->getType(),
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
                    ->andWhere("r.user is not null")
                    ->setParameter("idResto",$idrestaurant)
                    ->getQuery()
                    ->getSingleScalarResult();
    }

    /**
     * @author Nantenaina <nantenainasoa39@gmail.com>
     * où: on Utilise cette fonction dans RestaurantController.php, 
     * localisation du fichier: dans AvisRestaurantRepository.php,
     * je veux: faire apparaitre la note en haut à gauche du poi resto
     * si une POI a une note, la note se montre en haut à gauche du POI 
     */
    public function getAllNoteById(array $a){
        return $this->createQueryBuilder("r")
                    ->select("AVG(r.note) as moyenne_note, IDENTITY(r.restaurant) as id_resto")
                    ->where("r.restaurant IN (:u)")
                    ->andWhere("r.user IS NOT NULL")
                    ->setParameter("u",$a)
                    ->groupBy("r.restaurant")
                    ->getQuery()
                    ->getResult();
    }


    public function getNoteById($id){
        return $this->createQueryBuilder("r")
                    ->select("AVG(r.note) as moyenne_note, IDENTITY(r.restaurant) as id_resto")
                    ->where("r.restaurant = :u ")
                    ->andWhere("r.user IS NOT NULL")
                    ->setParameter("u",$id)
                    ->groupBy("r.restaurant")
                    ->getQuery()
                    ->getOneOrNullResult();
    }



    public function getState($idrestaurant){
        $results = $this->createQueryBuilder("r")
            ->select("
                r.id,
                r.avis,
                r.note")
            ->where("r.restaurant = :idResto ")
            ->andWhere("r.user IS NOT NULL")
            ->setParameter("idResto",$idrestaurant)
            ->getQuery()
            ->getResult();
            
        return $results; 
    }

}
