<?php

namespace App\Repository;

use App\Entity\GolfFrance;
use Doctrine\ORM\Query\Expr\Join;
use Doctrine\Persistence\ManagerRegistry;
use App\Repository\GolfFinishedRepository;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;

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
        $this->registry= $registry;
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


     /**
     * @author Jehovanie RAMANDRIJOEL <jehovenierama@gmail.com>
     * 
     * Get random data 
     * 
     * @param integer $limits: number of the data to get
     * 
     * @return array Ferme
     */
    public function getSomeDataShuffle($userID= null, $limits= 1000){
        $results=[];
        $data=  $this->createQueryBuilder("r")
                    ->select(
                        'r.id',
                        'r.web',
                        'r.nom_golf as name',
                        'r.dep',
                        'r.nom_dep',
                        'r.adr1 as adress',
                        'r.adr2',
                        'r.adr3',
                        'r.cp',
                        'r.e_mail as email',
                        'r.site_web',
                        'r.nom_commune as commune',
                        'r.latitude as lat',
                        'r.longitude as long',
                    )
                    ->orderBy('RAND()')
                    ->setMaxResults($limits)
                    ->getQuery()
                    ->getResult();
       
        for($i=0; $i< count($data); $i++){
            if(!$userID){
                $data[$i]["user_status"]="";
            }else{
                $golfFinishedRepository = new GolfFinishedRepository($this->registry);
                $user= $golfFinishedRepository->findOneBy(["user_id" => $userID, "golf_id" => $data[$i]["id"]]);
              
                $data[$i]["user_status"]=($user) ? "a faire" : "";
            }
        }

        return $data;
    }


    ///jheo : prendre tous les fermes qui appartients dans un departement specifique
    public function getGolfByDep($nom_dep, $id_dep,$userID=null)
    {
        ///lancement de requette
        $data = $this->createQueryBuilder('p')
            ->select(
                'p.id',
                'p.nom_golf as nom',
                'p.adr1',
                'p.adr1 as add',
                'p.adr2',
                'p.adr3',
                'p.e_mail as email',
                'p.web',
                'p.site_web as website',
                'p.telephone as tel',
                'p.cp',
                'p.dep',
                'p.nom_dep',
                'p.nom_dep as depName',
                'p.nom_commune as commune',
                'p.latitude as lat',
                'p.longitude as long',
            )
            ->where('p.dep = :k')
            ->setParameter('k',  $id_dep)
            ->getQuery()
            ->execute();

        for($i=0; $i< count($data); $i++){
            if(!$userID){
                $data[$i]["user_status"]="";
            }else{
                $golfFinishedRepository = new GolfFinishedRepository($this->registry);
                $user= $golfFinishedRepository->findOneBy(["user_id" => $userID, "golf_id" => $data[$i]["id"]]);
                
                $data[$i]["user_status"]=($user) ? "a faire" : "";
            }
        }
        return $data;
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
