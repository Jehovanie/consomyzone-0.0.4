<?php



namespace App\Repository;



use App\Entity\Avisferme;

use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;

use Doctrine\Persistence\ManagerRegistry;



/**

 * @extends ServiceEntityRepository<Avisferme>

 *

 * @method Avisferme|null find($id, $lockMode = null, $lockVersion = null)

 * @method Avisferme|null findOneBy(array $criteria, array $orderBy = null)

 * @method Avisferme[]    findAll()

 * @method Avisferme[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)

 */

class AvisfermeRepository extends ServiceEntityRepository

{

    public function __construct(ManagerRegistry $registry)

    {

        parent::__construct($registry, Avisferme::class);
    }



    public function add(Avisferme $entity, bool $flush = false): void

    {

        $this->getEntityManager()->persist($entity);



        if ($flush) {

            $this->getEntityManager()->flush();
        }
    }



    public function remove(Avisferme $entity, bool $flush = false): void

    {

        $this->getEntityManager()->remove($entity);



        if ($flush) {

            $this->getEntityManager()->flush();
        }
    }



    // public function updateAvis($idferme, $iduser, $note,$comment, $reactionAccueil , $reactionPrix , $reactionQualiteP, $noteAccueil, $notePrix, $noteQualiteP)

    // {

    //     return $this->createQueryBuilder("")

    //         ->update(Avisferme::class, "a")

    //         ->set("a.note", ":note")

    //         ->set("a.comment", ":comment")

    //         ->set("a.datetime", ":date")

    //         ->set("a.reactionAccueil", ":reactionAccueil")

    //         ->set("a.reactionPrix", ":reactionPrix")

    //         ->set("a.reactionQualiteP", ":reactionQualiteP")

    //         ->set("a.noteAccueil", ":noteAccueil")

    //         ->set("a.notePrix", ":notePrix")

    //         ->set("a.noteQualiteP", ":noteQualiteP")

    //         ->where("a.ferme = :id")

    //         ->andWhere("a.user = :iduser")

    //         ->setParameter("note", $note)

    //         ->setParameter("comment", $comment)

    //         ->setParameter("id", $idferme)

    //         ->setParameter("iduser", $iduser)

    //         ->setParameter("reactionAccueil", $reactionAccueil)

    //         ->setParameter("reactionPrix", $reactionPrix)

    //         ->setParameter("reactionQualiteP", $reactionQualiteP)

    //         ->setParameter("noteAccueil", $noteAccueil)

    //         ->setParameter("notePrix", $notePrix)

    //         ->setParameter("noteQualiteP", $noteQualiteP)

    //         ->setParameter("date", new \DateTimeImmutable())

    //         ->getQuery()

    //         ->execute();

    // }





    // public function deleteAvis($idferme, $iduser,)

    // {

    //     return $this->createQueryBuilder("")

    //         ->delete(Avisferme::class, "a")

    //         ->where("a.ferme = :idferme")

    //         ->andWhere("a.user = :iduser")

    //         ->setParameter("idferme", $idferme)

    //         ->setParameter("iduser", $iduser)

    //         ->getQuery()

    //         ->execute();

    // }



    //  public function getNote($idFerme)

    // {

    //     return $this->createQueryBuilder("r")

    //         ->select("r.note")

    //         ->where("r.ferme = :idF ")

    //         ->setParameter("idF", $idFerme)

    //         ->getQuery()

    //         ->getResult();

    // }

    // public function getNombreAvis($idFerme)

    // {

    //     return $this->createQueryBuilder("r")

    //         ->select("count(r.id)")

    //         ->where("r.ferme = :idF ")

    //         ->setParameter("idF", $idFerme)

    //         ->getQuery()

    //         ->getSingleScalarResult();

    // }

    public function updateAvis($idferme, $iduser, $note, $comment)
    {
        return $this->createQueryBuilder("")
            ->update(Avisferme::class, "a")
            ->set("a.note", ":note")
            ->set("a.comment", ":comment")
            ->set("a.datetime", ":date")
            ->where("a.ferme = :id")
            ->andWhere("a.user = :iduser")
            ->setParameter("note", $note)
            ->setParameter("comment", $comment)
            ->setParameter("id", $idferme)
            ->setParameter("iduser", $iduser)
            ->setParameter("date", new \DateTimeImmutable())
            ->getQuery()
            ->execute();
    }


    public function deleteAvis($idferme, $iduser,)
    {
        return $this->createQueryBuilder("")
            ->delete(Avisferme::class, "a")
            ->where("a.ferme = :idferme")
            ->andWhere("a.user = :iduser")
            ->setParameter("idferme", $idferme)
            ->setParameter("iduser", $iduser)
            ->getQuery()
            ->execute();
    }

    public function getNoteGlobale($idFerme)
    {
        return $this->createQueryBuilder("r")
            ->where("r.ferme = :idF ")
            ->setParameter("idF", $idFerme)
            ->getQuery()
            ->getResult();
    }

    public function getNote($idFerme, $user)
    {
        return $this->createQueryBuilder("r")
            ->where("r.ferme = :idF ")
            ->andwhere("r.user = :idUser ")
            ->setParameter("idF", $idFerme)
            ->setParameter("idUser", $user)
            ->getQuery()
            ->getResult();
    }

    public function getNombreAvis($idFerme)
    {
        return $this->createQueryBuilder("r")
            ->select("count(r.id)")
            ->where("r.ferme = :idF ")
            ->setParameter("idF", $idFerme)
            ->getQuery()
            ->getSingleScalarResult();
    }

    //    /**

    //     * @return Avisferme[] Returns an array of Avisferme objects

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



    //    public function findOneBySomeField($value): ?Avisferme

    //    {

    //        return $this->createQueryBuilder('a')

    //            ->andWhere('a.exampleField = :val')

    //            ->setParameter('val', $value)

    //            ->getQuery()

    //            ->getOneOrNullResult()

    //        ;

    //    }

}
