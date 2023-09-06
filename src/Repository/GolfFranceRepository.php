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
     * @return array Golf
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
                $data[$i]["user_status"]=["a_faire" => null, "fait" => null];
                $data[$i]["user_id"]=null;
            }else{
                $golfFinishedRepository = new GolfFinishedRepository($this->registry);
                $user= $golfFinishedRepository->findOneBy(["user_id" => $userID, "golf_id" => $data[$i]["id"]]);
              
                $data[$i]["user_status"]=($user) ? ["a_faire" => $user->getAfaire(), "fait" => $user->getFait()]  : ["a_faire" => null, "fait" => null];
                $data[$i]["user_id"]=$userID;

            }
        }

        return $data;
    }

    public function getDataBetweenAnd($minx,$miny,$maxx,$maxy){

        $query =  $this->createQueryBuilder("r")
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
                        'r.latitude',
                        'r.longitude',
                        'r.latitude as lat',
                        'r.longitude as long',
                    )
                    ->where("ABS(r.latitude) >= ABS(:minx) ")
                    ->andWhere("ABS(r.latitude) <= ABS(:maxx)")
                    ->andWhere("ABS(r.longitude) >= ABS(:miny)")
                    ->andWhere("ABS(r.longitude) <= ABS(:maxy)")
                    ->setParameter("minx", floatval($miny))
                    ->setParameter("maxx", floatval($maxy))
                    ->setParameter("miny", floatval($minx))
                    ->setParameter("maxy", floatval($maxx))
                    ->setMaxResults(200)
                    ->orderBy('RAND()')
                    ->getQuery();

        return $query->getResult();
    }


    ///jheo : prendre tous les fermes qui appartients dans un departement specifique
    public function getGolfByDep($nom_dep, $id_dep,$userID=null)
    {
        ///lancement de requette
        $data = $this->createQueryBuilder('p')
            ->select(
                'p.id',
                'p.nom_golf as name',
                'p.nom_golf as nom',
                'p.adr1',
                'p.adr1 as add',
                'p.adr1 as adress',
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
                $data[$i]["user_status"]= ["a_faire" => null, "fait" => null];
                $data[$i]["user_id"]=null;
            }else{
                $golfFinishedRepository = new GolfFinishedRepository($this->registry);
                $user= $golfFinishedRepository->findOneBy(["user_id" => $userID, "golf_id" => $data[$i]["id"]]);
                $data[$i]["user_status"]=($user) ? ["a_faire" => $user->getAfaire(), "fait" => $user->getFait()]  : ["a_faire" => null, "fait" => null];
                $data[$i]["user_id"]=$userID;
            }
        }
        return $data;
    }


    public function getOneGolf($golfID, $userID=null){
        $data = $this->createQueryBuilder('p')
            ->select(
                'p.id',
                'p.nom_golf as nomGolf',
                'p.adr1',
                'p.adr2',
                'p.adr3',
                'p.e_mail',
                'p.e_mail as eMail',
                'p.web',
                'p.site_web',
                'p.site_web as siteWeb',
                'p.telephone',
                'p.cp',
                'p.dep',
                'p.nom_dep',
                'p.nom_dep as nomDep',
                'p.nom_commune as nomCommune',
                'p.latitude',
                'p.longitude',
            )
            ->where('p.id = :k')
            ->setParameter('k',  $golfID)
            ->getQuery()
            ->getOneOrNullResult();

        if( $data){
            if(!$userID){
                $data["user_status"]=["a_faire" => null, "fait" => null];
                $data["user_id"]=null;
            }else{
                $golfFinishedRepository = new GolfFinishedRepository($this->registry);
                $user= $golfFinishedRepository->findOneBy(["user_id" => $userID, "golf_id" => $data["id"]]);
                $data["user_status"]=($user) ? ["a_faire" => $user->getAfaire(), "fait" => $user->getFait()] : ["a_faire" => null, "fait" => null];
                $data["user_id"]=$userID;
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
