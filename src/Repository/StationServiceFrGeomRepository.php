<?php

namespace App\Repository;

use App\Entity\StationServiceFrGeom;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<StationServiceFrGeom>
 *
 * @method StationServiceFrGeom|null find($id, $lockMode = null, $lockVersion = null)
 * @method StationServiceFrGeom|null findOneBy(array $criteria, array $orderBy = null)
 * @method StationServiceFrGeom[]    findAll()
 * @method StationServiceFrGeom[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */

class StationServiceFrGeomRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, StationServiceFrGeom::class);
    }

    public function add(StationServiceFrGeom $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(StationServiceFrGeom $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    ///jheo : prendre list stations dans un department donnéer.
    public function getStationByDepartement($code,$name,$page)
    {   
        ///page current
        $page_current = 10 * $page;
        
        ///correction des carractères speciaux;
        $car_speciaux = array("é", "è");
        $car_correction   = array("e", "e");
        $new_nom_dep = str_replace($car_speciaux, $car_correction, $name);
        
        $qb = $this->createQueryBuilder('p')
            ->select('p.id',
                     'p.nom',
                     'p.prixE85',
                     'p.prixGplc',
                     'p.prixSp95',
                     'p.prixSp95E10',
                     'p.prixSp98',
                     'p.prixGasoil',
                     'p.adresse')
            //->setMaxResults(10)
            ->where('p.departementCode LIKE :q')
            // ->andWhere('p.departementName LIKE :k')
            ->orderBy("p.nom", 'ASC')
            ->setParameter('q', '%'. $code. '%' )
            // ->setParameter('k', '%'. $new_nom_dep. '%' )
            ->setFirstResult($page_current);

        $query = $qb->getQuery();
        return $query->execute();
    }

    ///jheo : prendre tous les lists de stations dans un department donnéer.
    public function getAllStationInDepartement($code,$name = null )
    {

        $qb = $this->createQueryBuilder('p')
            ->select('p.id',
                     'p.nom',
                     'p.latitude',
                     'p.longitude',
                     'p.adresse',
                     'p.prixE85',
                     'p.prixGplc',
                     'p.prixSp95',
                     'p.prixSp95E10',
                     'p.prixSp98',
                     'p.prixGasoil',
                     'p.departementName',
                     'p.departementCode')
                     ->orderBy("p.nom", 'ASC');
        if( $code === "20"){
            $qb->where('p.departementCode = :q')
                ->orWhere('p.departementCode = :k')
                ->setParameter('q',  "2A" )
                ->setParameter('k',  "2B");
        }else{
            $qb->where('p.departementCode = :q')
                ->setParameter('q', $code );
        }
            // ->andWhere('p.departementName LIKE :k')
            // ->setParameter('k', '%'. $new_nom_dep. '%' );

        $query = $qb->orderBy("p.nom", 'ASC')->getQuery();
        return $query->execute();
    }


    ///jheo : prendre les details d'une station
    public function getDetailsStation($code, $name, $id_station)
    {
        $car_speciaux = array("é", "è");
        $car_correction   = array("e", "e");
        $new_nom_dep = str_replace($car_speciaux, $car_correction, $name);

        $qb = $this->createQueryBuilder('p')
            ->select('p.id',
                     'p.adresse',
                     'p.automate2424',
                     'p.departementCode',
                     'p.departementName',
                     'p.horaies',
                     'p.nom',
                     'p.prixE85',
                     'p.prixGplc',
                     'p.prixSp95',
                     'p.prixSp95E10',
                     'p.prixSp98',
                     'p.prixGasoil',
                     'p.latitude',
                     'p.longitude',
                     'p.services')
            // ->where('p.departementCode = :q')
            // ->andWhere('p.departementName LIKE :k')
            ->andWhere('p.id = :t')
            // ->setParameter('q', $code )
            // ->setParameter('k', '%'. $new_nom_dep. '%' )
            ->setParameter('t',$id_station);

        $query = $qb->getQuery();
        return $query->execute();

    }

    ///jheo : getLatitudeLongitude
    public function getLatitudeLongitudeStation($min=null,$max=null,$type=null, $nom_dep=null, $id_dep=null)
    {


        ////filter with min and max
        if( $min || $max){
            ////for one departement
            if( $nom_dep && $id_dep ){

                ////filter for all type
                if( $type === "tous" ){
                    // dd("ss ato");
                    $qb = $this->createQueryBuilder('p')
                        ->select('p.id',
                                'p.adresse',
                                'p.departementCode',
                                'p.departementName',
                                'p.latitude',
                                'p.longitude',
                                'p.prixE85',
                                'p.prixGplc',
                                'p.prixSp95',
                                'p.prixSp95E10',
                                'p.prixSp98',
                                'p.prixGasoil',
                                'p.nom');

                    if( $id_dep === "20"){
                        $qb= $qb->where('(p.departementCode = :a OR p.departementCode = :b ) AND (p.prixE85 BETWEEN :min AND :max)')
                            ->orWhere('(p.departementCode = :a OR p.departementCode = :b ) AND (p.prixGplc BETWEEN :min AND :max)')
                            ->orWhere('(p.departementCode = :a OR p.departementCode = :b ) AND (p.prixSp95 BETWEEN :min AND :max)')
                            ->orWhere('(p.departementCode = :a OR p.departementCode = :b ) AND (p.prixSp95E10 BETWEEN :min AND :max)')
                            ->orWhere('(p.departementCode = :a OR p.departementCode = :b ) AND (p.prixSp98 BETWEEN :min AND :max)' )
                            ->orWhere('(p.departementCode = :a OR p.departementCode = :b ) AND (p.prixGasoil BETWEEN :min AND :max)' )
                            ->setParameter('a',  "2A" )
                            ->setParameter('b',  "2B");

                    }else{
                        $qb= $qb->where('(p.departementCode = :code ) AND (p.prixE85 BETWEEN :min AND :max)')
                            ->orWhere('(p.departementCode = :code ) AND (p.prixGplc BETWEEN :min AND :max)')
                            ->orWhere('(p.departementCode = :code ) AND (p.prixSp95 BETWEEN :min AND :max)')
                            ->orWhere('(p.departementCode = :code ) AND (p.prixSp95E10 BETWEEN :min AND :max)')
                            ->orWhere('(p.departementCode = :code ) AND (p.prixSp98 BETWEEN :min AND :max)' )
                            ->orWhere('(p.departementCode = :code ) AND (p.prixGasoil BETWEEN :min AND :max)' )
                            ->setParameter('code', $id_dep);
                    }
                        
                //// filter some type not all
                }else{
                    
                    $var_type = explode("@", $type);
                    
                    $qb = $this->createQueryBuilder('p')
                        ->select('p.id',
                                'p.adresse',
                                'p.departementCode',
                                'p.departementName',
                                'p.prixE85',
                                'p.prixGplc',
                                'p.prixSp95',
                                'p.prixSp95E10',
                                'p.prixSp98',
                                'p.prixGasoil',
                                'p.nom',
                                'p.latitude',
                                'p.longitude');

                    
                    //// iterate for different type
                    if( $id_dep === "20"){
                        $qb= $qb->where("(p.departementCode = :a OR p.departementCode = :b ) AND (p." . $var_type[0] . " BETWEEN :min AND :max)")
                            ->setParameter('a',  "2A")
                            ->setParameter('b',  "2B");
                    }else{
                        $qb= $qb->where("(p.departementCode = :code) AND (p." . $var_type[0] . " BETWEEN :min AND :max)");
                    }

                    for ( $i = 1; $i< count($var_type); $i++){
                        if( $id_dep === "20"){
                            $qb= $qb->orWhere("(p.departementCode = :a OR p.departementCode = :b ) AND (p." . $var_type[$i] . " BETWEEN :min AND :max)")
                                    ->setParameter('a',  "2A" )
                                    ->setParameter('b',  "2B");
                        }else{
                            $qb= $qb->orWhere("(p.departementCode = :code) AND (p." . $var_type[$i] . " BETWEEN :min AND :max)");
                        }
                    }
                }

                if( $id_dep !== "20"){
                    $qb->setParameter('code', $id_dep );
                }

                $qb->setParameter('min', $min )
                   ->setParameter('max', $max );

            /// for all departement
            }else{
                ////filter for all type
                if( $type === "tous" ){
                    $qb = $this->createQueryBuilder('p')
                        ->select('p.id',
                                'p.adresse',
                                'p.departementCode',
                                'p.departementName',
                                'p.prixE85',
                                'p.prixGplc',
                                'p.prixSp95',
                                'p.prixSp95E10',
                                'p.prixSp98',
                                'p.prixGasoil',
                                'p.latitude',
                                'p.longitude',
                                'p.nom')  
                        ->where('p.prixE85 BETWEEN :min AND :max' )
                        ->orWhere('p.prixGplc BETWEEN :min AND :max' )
                        ->orWhere('p.prixSp95 BETWEEN :min AND :max' )
                        ->orWhere('p.prixSp95E10 BETWEEN :min AND :max' )
                        ->orWhere('p.prixSp98 BETWEEN :min AND :max' )
                        ->orWhere('p.prixGasoil BETWEEN :min AND :max' )
                        ->setParameter('min', $min )
                        ->setParameter('max', $max );

                //// filter for some type
                }else{

                    $var_type = explode("@", $type);

                    $qb = $this->createQueryBuilder('p')
                        ->select('p.id',
                                'p.adresse',
                                'p.departementCode',
                                'p.departementName',
                                'p.prixE85',
                                'p.prixGplc',
                                'p.prixSp95',
                                'p.prixSp95E10',
                                'p.prixSp98',
                                'p.prixGasoil',
                                'p.nom',
                                'p.latitude',
                                'p.longitude');
                                
                    $qb->where("p." . $var_type[0] . " BETWEEN :min AND :max");
                    for ( $i = 1; $i< count($var_type); $i++){
                        $qb->orWhere("p." . $var_type[$i] . " BETWEEN :min AND :max");
                    }
                    $qb->setParameter('min', $min )
                    ->setParameter('max', $max );
                }
            }
        //// filter first without min and max
        }else{
            $qb = $this->createQueryBuilder('p')
                ->select('p.id',
                        'p.adresse',
                        'p.departementCode',
                        'p.departementName',
                        'p.prixE85',
                        'p.prixGplc',
                        'p.prixSp95',
                        'p.prixSp95E10',
                        'p.prixSp98',
                        'p.prixGasoil',
                        'p.nom',
                        'p.latitude',
                        'p.longitude');
        }
        $query = $qb->orderBy("p.nom", 'ASC')->getQuery();
        return $query->execute();
    }

    public function getAllFilterByLatLong($data){

        extract($data); //// $last [ min [ lat , lng ], max [ lat, lng ] ], $new [ min [ lat, lng ], max [ lat, lng ] ]

        $qb = $this->createQueryBuilder('p')
            ->select('p.id',
                'p.adresse',
                'p.departementCode',
                'p.departementName',
                'p.prixE85',
                'p.prixGplc',
                'p.prixSp95',
                'p.prixSp95E10',
                'p.prixSp98',
                'p.prixGasoil',
                'p.nom',
                'p.latitude',
                'p.longitude')
            ->orderBy("p.nom", 'ASC')
            ->where('p.latitude BETWEEN :lat_min AND :lat_max')
            ->andWhere('p.longitude BETWEEN :lng_min AND :lng_max');

        // $lat_min= count($new) > 0 ? $new["min"] : [ "lat" => -25.0];
        // $lat_max= $last["max"];

        // $lng_min= count($new) > 0 ? $last["min"] : [ "lng" => 0.0];
        // $lng_max= count($new) > 0 ?  $new["max"] : $last["min"] ;

        $lat_min=$last["min"];
        $lat_max= count($new) > 0 ? $new["max"] : $last["max"];

        $lng_min= count($new) > 0 ? $new["min"] : $last["min"];
        $lng_max= $last["max"];

        ///(this.last_minll.lat > minll.lat) && (this.last_maxll.lng < maxll.lng) 
        $qb= $qb->setParameter('lat_min', $lat_min["lat"])
                ->setParameter('lat_max', $lat_max["lat"])
                ->setParameter('lng_min', $lng_min["lng"])
                ->setParameter('lng_max', $lng_max["lng"]);
        
        $query = $qb->getQuery();
        return $query->execute();
    }

    ///jheo : get number of row in database
    public function getCountStation($code=null, $name=null){
        if( $code || $name ){
            ///correction des carractères speciaux;
            $car_speciaux = array("é", "è");
            $car_correction   = array("e", "e");
            $new_nom_dep = str_replace($car_speciaux, $car_correction, $name);

            $qb = $this->createQueryBuilder('p')
                        ->select('count(p.id)')
                        ->where('p.departementCode = :q')
                        // ->andWhere('p.departementName LIKE :k')
                        ->setParameter('q', $code );
                        // ->setParameter('k', '%'. $new_nom_dep. '%' );

        }else{
            $qb = $this->createQueryBuilder('p')
                        ->select('count(p.id)');
        }

        $query = $qb->getQuery();
        return $query->execute();
    }

    public function addNote($idStation, $note)
    {
        return $this->createQueryBuilder("")
            ->update(StationServiceFrGeom::class, "s")
            ->set("s.note", ":note")
            ->where('s.id=:idS')
            ->setParameter("note", $note)
            ->setParameter("idS", $idStation)
            ->getQuery()
            ->execute();
    }

    ///jheo : get by cles
    public function getBySpecificClef(string $mot_cles0, string $mot_cles1 , int $page = 1, $size = 20 )
    {
        // $page_current =$page > 1 ? $page * 10 +1  : 0;
        // const { adresse:add, departementName: depName, departementCode: dep, nom } = item;
        // // showResultSearchNavBar("station", nom, add, dep, depName, id);
        $qb = $this->createQueryBuilder('p')
            ->select('p.id',
                    'p.adresse as add',
                    'p.adresse as commune',
                    'p.departementCode as dep',
                    'p.departementName as depName',
                    'p.prixE85',
                    'p.prixGplc',
                    'p.prixSp95',
                    'p.prixSp95E10',
                    'p.prixSp98',
                    'p.prixGasoil',
                    'p.prixGasoil as station',
                    'p.nom',
                    'p.latitude as lat',
                    'p.longitude as long',
                    'p.services');

        if( $mot_cles0 !== "" && $mot_cles1 === ""){
            
            if( strlen($mot_cles0) <= 2 ){
            
                $qb = $qb->where("p.nom LIKE :cles0")
                            ->setParameter('cles0', '%'. $mot_cles0. '%' );
            }else{

                $qb = $qb->where("MATCH_AGAINST(p.nom) AGAINST( :cles0 boolean)>0")
                         ->orWhere("p.services LIKE :cles0")
                         ->setParameter('cles0', '%'. $mot_cles0. '%' );
            }

        }else if( $mot_cles0 === "" && $mot_cles1 !== ""){
            if( strlen($mot_cles1) <= 2 ){
                if($mot_cles1 === "20" ){
                    $qb = $qb->where("p.departementCode LIKE :a")
                            ->orWhere("p.departementCode LIKE :b")
                            ->setParameter('a',  "%2A%" )
                            ->setParameter('b',  "%2B%");
                }else{
                    $qb =  $qb->where("p.departementCode LIKE :cles1")
                        ->setParameter('cles1', '%'. $mot_cles1. '%' );
                }
            }else{
                $qb = $qb->where("MATCH_AGAINST(p.adresse) AGAINST( :cles1 boolean) > 0")
                            ->orWhere("p.adresse LIKE :cles1")
                            ->orWhere("MATCH_AGAINST(p.departementName) AGAINST( :cles1 boolean) > 0")
                            ->orWhere("p.departementName LIKE :cles1")
                            ->orWhere("CONCAT(p.departementCode,' ',p.departementName) LIKE :cles1")
                            ->orWhere("CONCAT(p.departementName,' ',p.departementCode) LIKE :cles1")
                            ->setParameter('cles1', '%'. $mot_cles1. '%' );
            }
        }else{
            
            $qb = $qb->where("p.nom LIKE :cles0")
                    ->orWhere("MATCH_AGAINST(p.nom) AGAINST( :cles0 boolean) > 0")
                    ->orWhere("p.adresse LIKE :cles1")
                    ->orWhere("MATCH_AGAINST(p.adresse) AGAINST( :cles1 boolean) > 0")
                    ->orWhere("(MATCH_AGAINST(p.nom) AGAINST( :cles0 boolean) > 0) AND (MATCH_AGAINST(p.adresse) AGAINST( :cles1 boolean) > 0)")
                    ->orWhere("(MATCH_AGAINST(p.nom) AGAINST( :cles0 boolean) > 0) AND (p.adresse LIKE :cles1 )")
                    ->orWhere("(p.nom LIKE :cles0) AND (MATCH_AGAINST(p.adresse) AGAINST( :cles1 boolean) > 0)")
                    ->orWhere("(p.nom LIKE :cles0) AND (p.adresse LIKE :cles1 )")
                    ->orWhere("(MATCH_AGAINST(p.nom) AGAINST( :cles0 boolean) > 0) AND (MATCH_AGAINST(p.departementName) AGAINST( :cles1 boolean) > 0)")
                    ->orWhere("(MATCH_AGAINST(p.nom) AGAINST( :cles0 boolean) > 0) AND (p.departementName LIKE :cles1 )")
                    ->orWhere("(p.nom LIKE :cles0) AND (MATCH_AGAINST(p.departementName) AGAINST( :cles1 boolean) > 0)")
                    ->orWhere("(p.nom LIKE :cles0) AND (p.departementName LIKE :cles1 )")
                    ->setParameter('cles0', '%'. $mot_cles0. '%' )
                    ->setParameter('cles1', '%'. $mot_cles1. '%' );
        }

        // $qb = $qb->setFirstResult($page_current)
        //     ->setMaxResults($size)
        //     ->orderBy('p.nom', 'ASC')
        //     ->getQuery();

        $qb = $qb->orderBy('p.nom', 'ASC')
                 ->getQuery();
            

        $results =$qb->execute();
        return [ $results , count($results) , "station"];
    }
//    /**
//     * @return StationServiceFrGeom[] Returns an array of StationServiceFrGeom objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('s')
//            ->andWhere('s.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('s.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?StationServiceFrGeom
//    {
//        return $this->createQueryBuilder('s')
//            ->andWhere('s.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
