<?php

namespace App\Repository;

use App\Entity\GolfFrance;
use Doctrine\ORM\Query\Expr\Join;
use App\Service\DepartementService;
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
                $data[$i]["user_status"]=["a_faire" => null, 
                "fait" => null, 
                "mon_golf"=>null,
                "refaire"=>null];
                $data[$i]["user_id"]=null;
            }else{
                $golfFinishedRepository = new GolfFinishedRepository($this->registry);
                $user= $golfFinishedRepository->findOneBy(["user_id" => $userID, "golf_id" => $data[$i]["id"]]);
              
                $data[$i]["user_status"]=($user) ? ["a_faire" => $user->getAfaire(), 
                "fait" => $user->getFait(), 
                "mon_golf" => $user->getMonGolf(),
                "refaire" => $user->getARefaire()]  : 
                ["a_faire" => null, 
                "fait" => null, 
                "mon_golf"=> null,
                "refaire" =>null];
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
    public function getGolfByDep($nom_dep="", $id_dep,$userID=null)
    {
        $id_dep= strlen($id_dep) === 1  ? "0" . $id_dep : $id_dep;
        ///lancement de requette
        $data = $this->createQueryBuilder('p')
            ->select(
                'p.id',
                'p.id as id_etab',
                'p.nom_golf as name',
                'p.nom_golf as nom',
                'p.adr1',
                'p.adr1 as adress',
                'CONCAT(p.adr1, \' \', p.cp, \' \', p.nom_commune) as adresse',
                'CONCAT(p.adr1, \' \', p.cp, \' \', p.nom_commune) as add',
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
                'p.nom_dep as departement',
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
                $data[$i]["user_status"]= ["a_faire" => null, "fait" => null, "mon_golf" => null, "refaire"=>null];
                $data[$i]["user_id"]=null;
            }else{
                $golfFinishedRepository = new GolfFinishedRepository($this->registry);
                $user= $golfFinishedRepository->findOneBy(["user_id" => $userID, "golf_id" => $data[$i]["id"]]);
                $data[$i]["user_status"]=($user) ? 
                ["a_faire" => $user->getAfaire(), 
                "fait" => $user->getFait(), 
                "mon_golf" => $user->getMonGolf(), 
                "refaire"=> $user->getARefaire()]  : 
                ["a_faire" => null, 
                "fait" => null, 
                "mon_golf"=> null,
                "refaire"=> null];
                $data[$i]["user_id"]=$userID;
            }
        }
        return $data;
    }

    ///Tomm : prendre tous les fermes qui appartients dans un departement specifique mobole
    public function getGolfByDepMobile($nom_dep = "", $id_dep, $userID = null, $limit = 2000, $offset = 0)
    {
        $id_dep = strlen($id_dep) === 1  ? "0" . $id_dep : $id_dep;
        ///lancement de requette
        $data = $this->createQueryBuilder('p')
        ->select(
            'p.id',
            'p.id as id_etab',
            'p.nom_golf as name',
            'p.nom_golf as nom',
            'p.adr1',
            'p.adr1 as adress',
            'CONCAT(p.adr1, \' \', p.cp, \' \', p.nom_commune) as adresse',
            'CONCAT(p.adr1, \' \', p.cp, \' \', p.nom_commune) as add',
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
            'p.nom_dep as departement',
            'p.nom_commune as commune',
            'p.latitude as lat',
            'p.longitude as long',
        )
        ->where('p.dep = :k')
        ->setParameter('k',  $id_dep)
        ->orderBy('p.id', 'ASC')
        ->setMaxResults($limit)
        ->setFirstResult($offset)
        ->getQuery()
        ->execute();

        for ($i = 0; $i < count($data); $i++) {
            if (!$userID) {
                $data[$i]["user_status"] = ["a_faire" => null, "fait" => null, "mon_golf" => null];
                $data[$i]["user_id"] = null;
            } else {
                $golfFinishedRepository = new GolfFinishedRepository($this->registry);
                $user = $golfFinishedRepository->findOneBy(["user_id" => $userID, "golf_id" => $data[$i]["id"]]);
                $data[$i]["user_status"] = ($user) ? ["a_faire" => $user->getAfaire(), "fait" => $user->getFait(), "mon_golf" => $user->getMonGolf()]  : ["a_faire" => null, "fait" => null, "mon_golf" => null];
                $data[$i]["user_id"] = $userID;
            }
        }
        return $data;
    }

    ///Tomm : prendre tous les fermes qui appartients dans un departement specifique mobole
    public function getGolfByDepSearchMobile($nom_dep = "", $id_dep, $userID = null, $id_golf)
    {
        $id_dep = strlen($id_dep) === 1  ? "0" . $id_dep : $id_dep;
        ///lancement de requette
        $data = $this->createQueryBuilder('p')
            ->select(
                'p.id',
                'p.id as id_etab',
                'p.nom_golf as name',
                'p.nom_golf as nom',
                'p.adr1',
                'p.adr1 as adress',
                'CONCAT(p.adr1, \' \', p.cp, \' \', p.nom_commune) as adresse',
                'CONCAT(p.adr1, \' \', p.cp, \' \', p.nom_commune) as add',
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
                'p.nom_dep as departement',
                'p.nom_commune as commune',
                'p.latitude as lat',
                'p.longitude as long',
            )
            ->where('p.dep = :k')
            ->andwhere('p.id = :id')
            ->setParameter('k',  $id_dep)
            ->setParameter('id',  $id_golf)
            ->orderBy('p.id', 'ASC')
            ->getQuery()
            ->execute();

        for ($i = 0; $i < count($data); $i++) {
            if (!$userID) {
                $data[$i]["user_status"] = ["a_faire" => null, "fait" => null, "mon_golf" => null, 'refaire' => null];
                $data[$i]["user_id"] = null;
            } else {
                $golfFinishedRepository = new GolfFinishedRepository($this->registry);
                $user = $golfFinishedRepository->findOneBy(["user_id" => $userID, "golf_id" => $data[$i]["id"]]);
                $data[$i]["user_status"] = ($user) ? ["a_faire" => $user->getAfaire(), "fait" => $user->getFait(), "mon_golf" => $user->getMonGolf() , 'refaire' => $user->getRefaire()]  : ["a_faire" => null, "fait" => null, "mon_golf" => null, 'refaire' => null];
                $data[$i]["user_id"] = $userID;
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
                $data["user_status"]=["a_faire" => null, "fait" => null, "mon_golf"=> null, "refaire" =>null];
                $data["user_id"]=null;
            }else{
                $golfFinishedRepository = new GolfFinishedRepository($this->registry);
                $user= $golfFinishedRepository->findOneBy(["user_id" => $userID, "golf_id" => $data["id"]]);
                $data["user_status"]=($user) ? ["a_faire" => $user->getAfaire(), 
                                "fait" => $user->getFait(), 
                                "mon_golf" => $user->getMonGolf(),
                                "refaire"=>$user->getARefaire()] : ["a_faire" => null, "fait" => null, "mon_golf"=>null,"refaire"=>null];
                $data["user_id"]=$userID;
            }
        }
        return $data;
    }

    public function getBySpecificClef(string $mot_cles0, string $mot_cles1, int $page = 0, $size=20, $userID= null){

        $mot_cles1 = strlen($mot_cles1) === 1 ? "0". $mot_cles1 : $mot_cles1;

        $departementService = new DepartementService();
        $departement = $departementService->getDepWithKeyNomDep();
        if(array_key_exists(strtolower($mot_cles1), $departement)){
            $mot_cles1 = $departement[strtolower($mot_cles1)];
        }

        $qb = $this->createQueryBuilder("p")
                ->select("p.id,
                        p.id as id_etab,
                        p.dep,
                        p.web,
                        p.site_web,
                        p.nom_dep,
                        p.nom_dep as depName,
                        p.adr1,
                        p.adr2,
                        p.adr3,
                        p.cp,
                        p.nom_commune,
                        p.nom_golf,
                        p.nom_golf as golf,
                        p.nom_golf as nom,
                        p.nom_golf as name,
                        p.dep as id_dep,
                        p.nom_dep as departement,
                        CONCAT(p.adr1,' ',p.cp, ' ',p.nom_commune) as adresse,
                        p.telephone as tel,
                        p.telephone,
                        p.e_mail,
                        p.e_mail as email,
                        p.longitude as long,
                        p.latitude as lat,
                        CONCAT(p.adr1,' ',p.cp, ' ',p.nom_commune) as add");
                        
        if( $mot_cles0 !== "" && $mot_cles1 === "" ){

            if( strlen($mot_cles0) <= 2 ){
                
                $qb = $qb->where("p.nom_golf LIKE :cles0")
                        ->setParameter('cles0', '%'. $mot_cles0. '%' );
            }else{
                    $qb = $qb->where("REPLACE(p.nom_golf) LIKE :cles0")
                            ->setParameter('cles0', '%' . $mot_cles0. '%');
            }
                
        }else if ($mot_cles0 === "" && $mot_cles1 !== "" ){
            if( strlen($mot_cles1) <= 2 ){
                $qb = $qb->where("p.dep LIKE :cles1")
                        ->setParameter('cles1', $mot_cles1 );
            }else{

                $qb = $qb->where("REPLACE(CONCAT(p.adr1,' ',p.cp, ' ',p.nom_commune)) LIKE :cles1")
                        ->setParameter('cles1', '%'. $mot_cles1. '%' );
            }

        }else {

            if(strtolower($mot_cles0) == "golf" || strtolower($mot_cles0) == "golfs"){
                if( strlen($mot_cles1) <= 2 ){
                    $qb = $qb->where("p.dep LIKE :cles1")
                            ->setParameter('cles1',  $mot_cles1 );
                }else{
                    $qb = $qb->where("REPLACE(CONCAT(p.adr1,' ',p.cp, ' ',p.nom_commune)) LIKE :cles1 ")
                            ->setParameter('cles1', '%'. $mot_cles1. '%' );
                }
            }else{

                if( strlen($mot_cles1) <= 2 ){
                
                    $qb = $qb->where("REPLACE(p.nom_golf) LIKE :cles0 AND p.dep LIKE :cles1")
                            ->setParameter('cles0', '%'. $mot_cles0. '%' )
                            ->setParameter('cles1', '%'. $mot_cles1. '%' );
                }else{

                    $qb = $qb->where("(REPLACE(p.nom_golf) LIKE :cles0) AND (REPLACE(CONCAT(p.adr1,' ',p.cp, ' ',p.nom_commune)) LIKE :cles1 )")
                            ->setParameter('cles0', '%'. $mot_cles0. '%' )
                            ->setParameter('cles1', '%'. $mot_cles1. '%' );

                }

            }
            
        }

        $qb = $qb->getQuery();

        $results = $qb->execute();

        for($i=0; $i< count($results); $i++){
            if(!$userID){
                $results[$i]["user_status"]= ["a_faire" => null, "fait" => null, "mon_golf"=>null];
                $results[$i]["user_id"]=null;
            }else{
                $golfFinishedRepository = new GolfFinishedRepository($this->registry);
                $user= $golfFinishedRepository->findOneBy(["user_id" => $userID, "golf_id" => $results[$i]["id"]]);
                $results[$i]["user_status"]=($user) ? ["a_faire" => $user->getAfaire(), "fait" => $user->getFait(), "mon_golf" => $user->getMonGolf()] : ["a_faire" => null, "fait" => null, "mon_golf"=>null];
                $results[$i]["user_id"]=$userID;
            }
        }

        return [ $results , count($results) , "golf"];
    }

    public function getBySpecificClefOther(string $mot_cles0, string $mot_cles1, int $page = 0, $size=20, $userID= null){

        $mot_cles1 = strlen($mot_cles1) === 1 ? "0". $mot_cles1 : $mot_cles1;

        $departementService = new DepartementService();
        $departement = $departementService->getDepWithKeyNomDep();
        if(array_key_exists(strtolower($mot_cles1), $departement)){
            $mot_cles1 = $departement[strtolower($mot_cles1)];
        }

        $qb = $this->createQueryBuilder("p")
                ->select("p.id,
                        p.id as id_etab,
                        p.dep,
                        p.web,
                        p.site_web,
                        p.nom_dep,
                        p.nom_dep as depName,
                        p.adr1,
                        p.adr2,
                        p.adr3,
                        p.cp,
                        p.nom_commune,
                        p.nom_golf,
                        p.nom_golf as golf,
                        p.nom_golf as nom,
                        p.nom_golf as name,
                        p.dep as id_dep,
                        p.nom_dep as departement,
                        CONCAT(p.adr1,' ',p.cp, ' ',p.nom_commune) as adresse,
                        p.telephone as tel,
                        p.telephone,
                        p.e_mail,
                        p.e_mail as email,
                        p.longitude as long,
                        p.latitude as lat,
                        CONCAT(p.adr1,' ',p.cp, ' ',p.nom_commune) as add");
                        
        if( $mot_cles0 !== "" && $mot_cles1 === "" ){

            if( strlen($mot_cles0) <= 2 ){
                
                $qb = $qb->where("p.nom_golf LIKE :cles0")
                        ->setParameter('cles0', '%'. $mot_cles0. '%' );
            }else{
                    $qb = $qb->where("MATCH_AGAINST(p.nom_golf) AGAINST( :cles0 boolean) > 0")
                            ->orWhere("p.nom_golf LIKE :cles0")
                            ->setParameter('cles0', '%' . $mot_cles0. '%');
            }
                
        }else if ($mot_cles0 === "" && $mot_cles1 !== "" ){
            if( strlen($mot_cles1) <= 2 ){
                $qb = $qb->where("p.dep LIKE :cles1")
                        ->setParameter('cles1', $mot_cles1 );
            }else{
                $qb = $qb->where("MATCH_AGAINST(p.adr1, p.cp, p.nom_commune) AGAINST( :cles1 boolean) > 0")
                         ->orWhere("CONCAT(p.adr1,' ',p.cp, ' ',p.nom_commune) LIKE :cles1")
                         ->setParameter('cles1', '%'. $mot_cles1. '%' );
            }

        }else {

            if(strtolower($mot_cles0) == "golf" || strtolower($mot_cles0) == "golfs"){
                if( strlen($mot_cles1) <= 2 ){
                    $qb = $qb->where("p.dep LIKE :cles1")
                            ->setParameter('cles1',  $mot_cles1 );
                }else{
                    $qb = $qb->where("MATCH_AGAINST(p.adr1, p.cp, p.nom_commune) AGAINST( :cles1 boolean) > 0")
                            ->setParameter('cles1', $mot_cles1);
                }
            }else{

                if( strlen($mot_cles1) <= 2 ){
                
                    $qb = $qb->where("MATCH_AGAINST(p.nom_golf) AGAINST( :cles0 boolean) > 0 AND p.dep LIKE :cles1")
                             ->orWhere("p.nom_golf LIKE :cles0 AND p.dep LIKE :cles1")
                             ->setParameter('cles0', '%'. $mot_cles0. '%' )
                             ->setParameter('cles1', '%'. $mot_cles1. '%' );
                }else{

                    $qb = $qb->where("(MATCH_AGAINST(p.nom_golf) AGAINST( :cles0 boolean) > 0) OR (MATCH_AGAINST(p.adr1, p.cp, p.nom_commune) AGAINST( :cles1 boolean) > 0)")
                             ->orWhere("(p.nom_golf LIKE :cles0) OR (CONCAT(p.adr1,' ',p.cp, ' ',p.nom_commune) LIKE :cles1 )")
                             ->setParameter('cles0', '%'. $mot_cles0. '%' )
                             ->setParameter('cles1', '%'. $mot_cles1. '%' );

                }

            }
            
        }

        $qb = $qb->getQuery();

        $results = $qb->execute();

        for($i=0; $i< count($results); $i++){
            if(!$userID){
                $results[$i]["user_status"]= ["a_faire" => null, "fait" => null, "mon_golf" => null];
                $results[$i]["user_id"]=null;
            }else{
                $golfFinishedRepository = new GolfFinishedRepository($this->registry);
                $user= $golfFinishedRepository->findOneBy(["user_id" => $userID, "golf_id" => $results[$i]["id"]]);
                $results[$i]["user_status"]=($user) ? ["a_faire" => $user->getAfaire(), "fait" => $user->getFait(), "mon_golf" => $user->getMonGolf()] : ["a_faire" => null, "fait" => null, "mon_golf"=>null];
                $results[$i]["user_id"]=$userID;
            }
        }

        return [ $results , count($results) , "golf"];
    }

    public function getGolfAfaire() {
        
        return $this->createQueryBuilder('g')
        ->select("g.id as id_etab,".
                "g.nom_golf as name,".
                "CONCAT(g.adr1,' ',g.cp, ' ',g.nom_commune) as adresse,".
                "g.telephone as tel,".
                "g.nom_dep as departement,".
                "g.site_web as siteweb","gf"
        )
        ->leftJoin("App\Entity\GolfFinished", "gf", Join::WITH, "g.id = gf.golf_id ")
        ->where('gf.a_faire= 1')
        ->orderBy('g.id',"ASC")
        ->getQuery()->getResult();
    }

    public function getALLWithJoin($id_etab){
        return $this->createQueryBuilder('g')
        ->select("g.id as id_etab,".
                "g.nom_golf as name,".
                "CONCAT(g.adr1,' ',g.cp, ' ',g.nom_commune) as adresse,".
                "g.telephone as tel,".
                "g.nom_dep as departement,".
                "g.site_web as siteweb","gf"
        )
        ->leftJoin("App\Entity\GolfFinished", "gf", Join::WITH, "g.id = gf.golf_id ")
        ->where('g.dep = :v' )
        ->setParameter('v', $id_etab)
        ->orderBy('g.id',"ASC")
        ->getQuery()->getResult();
    }

    public function getALLGolf(){
        return $this->createQueryBuilder('g')
        ->select("g.id as id_etab,".
                "g.nom_golf as name,".
                "CONCAT(g.adr1,' ',g.cp, ' ',g.nom_commune) as adresse,".
                "g.telephone as tel,".
                "g.nom_dep as departement,".
                "g.site_web as siteweb"
        )
        ->getQuery()->getResult();
    }
}
