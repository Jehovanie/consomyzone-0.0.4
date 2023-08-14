<?php

namespace App\Repository;

use App\Entity\GolfFrance;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<GolfFrance>
 *
 * @method GolfFrance|null find($id, $lockMode = null, $lockVersion = null)
 * @method GolfFrance|null findOneBy(array $criteria, array $orderBy = null)
 * @method GolfFrance[]    findAll()
 * @method GolfFrance[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class GolfFranceRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, GolfFrance::class);
    }

    public function getCount($nom_dep=null, $id_dep=null){

        if ($nom_dep || $id_dep) {
            $qb = $this->createQueryBuilder('p')
                ->select('count(p.id)')
                ->where('p.dep = :k')
                ->setParameter('k', intval($id_dep));
        } else {
            $qb = $this->createQueryBuilder('p')
                ->select('count(p.id)');
        }

        $qb= $qb->setMaxResults(1);

        $query = $qb->getQuery()
                    ->execute();
        
        return $query[0][1];
    }

    ///jheo : prendre tous les fermes qui appartients dans un departement specifique
    public function getGolfByDep($nom_dep, $id_dep, $page)
    {
        ///page current
        $page_current = 10 * $page;

        ///lancement de requette
        $qb = $this->createQueryBuilder('p')
            ->select(
                'p.id',
                'p.nom_golf as nom',
                'p.adr1',
                'p.adr2',
                'p.adr3',
                'p.e_mail as email',
                'p.web',
                'p.site_web as website',
                'p.telephone as tel',
                'p.e_mail',
                'p.e_mail',
                'p.cp',
                'p.dep',
                'p.nom_dep as depName',
                'p.nom_commune as commune',
                'p.latitude',
                'p.longitude',
                'p.latitude as lat',
                'p.longitude as long',
            )
            ->where('p.dep = :k')
            ->setParameter('k',  $id_dep);

        $query = $qb->getQuery();
        return $query->execute();
    }


//    /**
//     * @return GolfFrance[] Returns an array of GolfFrance objects
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

//    public function findOneBySomeField($value): ?GolfFrance
//    {
//        return $this->createQueryBuilder('g')
//            ->andWhere('g.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
