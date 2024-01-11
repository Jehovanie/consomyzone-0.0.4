<?php

namespace App\Repository;

use App\Entity\AvisGolf;
use App\Service\UserService;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<AvisGolf>
 *
 * @method AvisGolf|null find($id, $lockMode = null, $lockVersion = null)
 * @method AvisGolf|null findOneBy(array $criteria, array $orderBy = null)
 * @method AvisGolf[]    findAll()
 * @method AvisGolf[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class AvisGolfRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry, UserService $userService)
    {
        parent::__construct($registry, AvisGolf::class);
        $this->userService = $userService;
    }

    public function add(AvisGolf $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(AvisGolf $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }
    
    public function updateAvis($idGolf, $iduser, $avisID, $note, $comment, $type)
    {
        return $this->createQueryBuilder("")
                ->update(AvisGolf::class,"a")
                ->set("a.note",":note")
                ->set("a.avis",":comment")
                ->set("a.type",":type")
                ->where("a.golf = :idGolf")
                ->andWhere("a.user = :iduser")
                ->andWhere("a.id = :id")
                ->setParameter("note", $note)
                ->setParameter("comment", json_encode($comment))
                ->setParameter("idGolf",$idGolf)
                ->setParameter("iduser", $iduser)
                ->setParameter("id", $avisID)
                ->setParameter("type", $type)
                ->getQuery()
                ->execute();
    }

    public function deleteAvis($idGolf, $iduser,)
    {
        return $this->createQueryBuilder("")
                ->delete(AvisGolf::class,"a")
                ->where("a.golf = :idGolf")
                ->andWhere("a.user = :iduser")
                ->setParameter("idGolf", $idGolf)
                ->setParameter("iduser", $iduser)
                ->getQuery()
                ->execute();
    }

    
    public function getNoteGlobale($idGolf)
    {
        $all_avis= $this->createQueryBuilder("r")
                ->where("r.golf = :idGolf ")
                ->setParameter("idGolf", $idGolf)
                ->orderBy("r.datetime", "DESC")
                ->getQuery()
                ->getResult();

        $results = [];

        foreach ($all_avis as $avis){
            $user_id = $avis->getUser()->getId();
            $user_item = $this->userService->getUserProfileFromId($user_id);
            $resto_id= $avis->getGolf()->getId();
            $data = [
                "id" => $avis->getId(),
                "note" => $avis->getNote(),
                // "avis" => $avis->getAvis(),
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

    public function getNote($idGolf,$user)
    {
        return $this->createQueryBuilder("r")
            ->where("r.golf = :idGolf ")
            // ->andWhere("r.user = :idUser")
            ->setParameter("idGolf", $idGolf)
            // ->setParameter("idUser", $user)
            ->getQuery()
            ->getResult();
    }

    public function getNombreAvis($idGolf){
        return $this->createQueryBuilder("r")
                    ->select("count(r.id)")
                    ->where("r.golf = :idGolf ")
                    ->setParameter("idGolf",$idGolf)
                    ->getQuery()
                    ->getSingleScalarResult();
    }

    
    /**
     * @author Nantenaina <nantenainasoa39@gmail.com>
     * où: on Utilise cette fonction dans GolfController.php, 
     * localisation du fichier: dans AvisGolfRepository.php,
     * je veux: faire apparaitre la note en haut à gauche du poi resto
     * si une POI a une note, la note se montre en haut à gauche du POI 
     */
    public function getAllNoteById(array $a){
        return $this->createQueryBuilder("r")
                    ->select("AVG(r.note) as moyenne_note, IDENTITY(r.golf) as id_golf")
                    ->where("r.golf IN (:u)")
                    ->setParameter("u", $a)
                    ->groupBy("r.golf")
                    ->getQuery()
                    ->getResult();
    }

    
    public function getState($idGolf){
        $results = $this->createQueryBuilder("r")
            ->select("
                r.id,
                r.avis,
                r.note")
            ->where("r.golf = :idGolf ")
            ->setParameter("idGolf",$idGolf)
            ->getQuery()
            ->getResult();
            
        return $results; 
    }

}
