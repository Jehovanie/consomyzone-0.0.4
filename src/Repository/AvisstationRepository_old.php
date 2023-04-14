<?php



namespace App\Repository;



use App\Entity\Avisstation;

use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;

use Doctrine\Persistence\ManagerRegistry;



/**

 * @extends ServiceEntityRepository<Avisstation>

 *

 * @method Avisstation|null find($id, $lockMode = null, $lockVersion = null)

 * @method Avisstation|null findOneBy(array $criteria, array $orderBy = null)

 * @method Avisstation[]    findAll()

 * @method Avisstation[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)

 */

class AvisstationRepository_old extends ServiceEntityRepository

{

    public function __construct(ManagerRegistry $registry)

    {

        parent::__construct($registry, Avisstation::class);
    }



    public function add(Avisstation $entity, bool $flush = false): void

    {

        $this->getEntityManager()->persist($entity);



        if ($flush) {

            $this->getEntityManager()->flush();
        }
    }



    public function remove(Avisstation $entity, bool $flush = false): void

    {

        $this->getEntityManager()->remove($entity);



        if ($flush) {

            $this->getEntityManager()->flush();
        }
    }



    public function updateAvis($idstation, $iduser, $note, $comment, $reaction)

    {

        return $this->createQueryBuilder("")

            ->update(Avisstation::class, "a")

            ->set("a.note", ":note")

            ->set("a.comment", ":comment")

            ->set("a.datetime", ":date")

            ->set("a.reaction", ":reaction")

            ->where("a.station = :id")

            ->andWhere("a.user = :iduser")

            ->setParameter("note", $note)

            ->setParameter("comment", $comment)

            ->setParameter("id", $idstation)

            ->setParameter("iduser", $iduser)

            ->setParameter("reaction", $reaction)

            ->setParameter("date", new \DateTimeImmutable())

            ->getQuery()

            ->execute();
    }



    public function deleteAvis($idstation, $iduser,)

    {

        return $this->createQueryBuilder("")

            ->delete(Avisstation::class, "a")

            ->where("a.station = :idStation")

            ->andWhere("a.user = :iduser")

            ->setParameter("idStation", $idstation)

            ->setParameter("iduser", $iduser)

            ->getQuery()

            ->execute();
    }



    public function getNote($idStation)

    {

        return $this->createQueryBuilder("r")

            ->select("r.note")

            ->where("r.station = :idS ")

            ->setParameter("idS", $idStation)

            ->getQuery()

            ->getResult();
    }



    public function getNombreAvis($idstation)
    {

        return $this->createQueryBuilder("r")

            ->select("count(r.id)")

            ->where("r.station = :idS ")

            ->setParameter("idS", $idstation)

            ->getQuery()

            ->getSingleScalarResult();
    }

    //    /**

    //     * @return Avisstation[] Returns an array of Avisstation objects

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



    //    public function findOneBySomeField($value): ?Avisstation

    //    {

    //        return $this->createQueryBuilder('a')

    //            ->andWhere('a.exampleField = :val')

    //            ->setParameter('val', $value)

    //            ->getQuery()

    //            ->getOneOrNullResult()

    //        ;

    //    }

}
