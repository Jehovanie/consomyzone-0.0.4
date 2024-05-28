<?php

namespace App\Repository;

use App\Entity\Marche;
use App\Entity\MarcheUserModification;
use App\Service\DepartementService;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;

/**
 * @extends ServiceEntityRepository<Marche>
 *
 * @method Marche|null find($id, $lockMode = null, $lockVersion = null)
 * @method Marche|null findOneBy(array $criteria, array $orderBy = null)
 * @method Marche[]    findAll()
 * @method Marche[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class MarcheUserModificationRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, MarcheUserModification::class);
    }

    public function add(MarcheUserModification $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(MarcheUserModification $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }
    
    public function getMarketCreatedByUser(string $dep){
        $qb=$this->createQueryBuilder("m")
        ->where("m.marche IS NULL")
        ->andWhere("m.action = 'Ajouter'")
        ->andWhere("m.traiter!=1")
        ->andWhere("m.isDeleted!=1")
        ->andWhere("m.dep =:dep")
        ->setParameter('dep',$dep)
        ->orderBy('m.id', 'DESC')
        ->getQuery()
        ->getResult();
        return $qb;
    }

    public function getMarketCreatedByUserById(string $dep,$id){
        $qb=$this->createQueryBuilder("m")
        ->where("m.marche IS NULL")
        ->andWhere(" m.traiter!=1")
        ->andWhere("m.isDeleted!=1")
        ->andWhere(" m.action = 'Ajouter'")
        ->andWhere("m.dep =:dep")
        ->andWhere("m.id =:id")
        ->setParameter("id",$id)
        ->setParameter('dep',$dep)
        ->orderBy('m.id', 'DESC')
        ->getQuery()
        ->getResult();
        return $qb;
    }

    public function getMarketCreatedAllReadyValidatedByUserById(string $dep,$id){
        $qb=$this->createQueryBuilder("m")
        ->where("m.marche IS NOT NULL")
        ->andWhere(" m.traiter =1")
        ->andWhere("m.isDeleted!=1")
        ->andWhere(" m.action = 'Ajouter'")
        ->andWhere("m.dep =:dep")
        ->andWhere("m.id =:id")
        ->setParameter("id",$id)
        ->setParameter('dep',$dep)
        ->orderBy('m.id', 'DESC')
        ->getQuery()
        ->getResult();
        return $qb;
    }
    public function getMarketCreatedAllReadyRejectedByUserById(string $dep,$id){
        $qb=$this->createQueryBuilder("m")
        ->where("m.marche IS NULL")
        ->andWhere(" m.traiter =1")
        ->andWhere(" m.status =0")
        ->andWhere("m.isDeleted!=1")
        ->andWhere(" m.action = 'Ajouter'")
        ->andWhere("m.dep =:dep")
        ->andWhere("m.id =:id")
        ->setParameter("id",$id)
        ->setParameter('dep',$dep)
        ->orderBy('m.id', 'DESC')
        ->getQuery()
        ->getResult();
        return $qb;
    }
    public function getMarketCreatedValidatedByUserById(string $dep,$id){
        $qb=$this->createQueryBuilder("m")
        ->where(" m.traiter = 1")
        ->andWhere("m.isDeleted!=1")
        ->andWhere(" m.action = 'Ajouter'")
        ->andWhere("m.dep =:dep")
        ->andWhere("m.id =:id")
        ->setParameter("id",$id)
        ->setParameter('dep',$dep)
        ->orderBy('m.id', 'DESC')
        ->getQuery()
        ->getResult();
        return $qb;
    }

    public function getMarketModifiedByUser(string $dep){
        $qb=$this->createQueryBuilder("m")
        ->where("m.marche IS NOT NULL")
        ->andWhere(" m.traiter!=1")
        ->andWhere("m.isDeleted!=1")
        ->andWhere("m.action = 'Modifier'")
        ->andWhere("m.dep =:dep")
        ->setParameter('dep',$dep)
        ->orderBy('m.id', 'DESC')
        ->getQuery()
        ->getResult();
        return $qb;
    }

    public function getMarketModifiedAndRejectByUser(string $dep,$id){
        $qb=$this->createQueryBuilder("m")
        ->where("m.marche IS NOT NULL")
        ->andWhere("m.traiter= 1")
        ->andWhere("m.status = 0")
        ->andWhere("m.isDeleted!=1")
        ->andWhere("m.action = 'Modifier'")
        ->andWhere("m.id =:id")
        ->setParameter("id",$id)
        ->andWhere("m.dep =:dep")
        ->setParameter('dep',$dep)
        ->orderBy('m.id', 'DESC')
        ->getQuery()
        ->getResult();
        return $qb;
      
    }
    public function getMarketModifiedByUserById(string $dep,$id){
        $qb=$this->createQueryBuilder("m")
        ->where("m.marche IS NOT NULL")
        ->andWhere(" m.traiter!=1")
        ->andWhere("m.isDeleted!=1")
        ->andWhere("m.action = 'Modifier'")
        ->andWhere("m.id =:id")
        ->setParameter("id",$id)
        ->andWhere("m.dep =:dep")
        ->setParameter('dep',$dep)
        ->orderBy('m.id', 'DESC')
        ->getQuery()
        ->getResult();
        return $qb;
    }

    public function getMarketThatWillBeDeleted(string $dep){
        $qb=$this->createQueryBuilder("m")
        ->where("m.marche IS NOT NULL")
        ->andWhere(" m.traiter!=1")
        ->andWhere("m.isDeleted!=1")
        ->andWhere("m.action = 'Supprimer'")
        ->andWhere("m.dep =:dep")
        ->setParameter('dep',$dep)
        ->orderBy('m.id', 'DESC')
        ->getQuery()
        ->getResult();
        return $qb;
    }
    
    public function getNumberOfMarketCreatedByUserPerDep(string $dep):int{
        $qb=$this->createQueryBuilder("m")
        ->select("dep,count(m.dep)")
        ->andWhere(" m.traiter!=1")
        ->andWhere("m.isDeleted!=1")
        ->where("m.marche IS NULL")
        ->andWhere("m.action = 'Ajouter'")
        ->andWhere("m.dep =:dep")
        ->setParameter('dep',$dep)
        ->orderBy('m.id', 'DESC')
        ->getQuery()
        ->getSingleScalarResult();
        return $qb;
    }

    public function getNumberOfMarketModiFiedByUserPerDep(string $dep):int{
        $qb=$this->createQueryBuilder("m")
        ->select("dep,count(m.dep)")
        ->where("m.marche IS NOT NULL")
        ->andWhere("m.traiter!=1")
        ->andWhere("m.isDeleted!=1")
        ->andWhere("m.action = 'Modifier'")
        ->andWhere("m.dep =:dep")
        ->setParameter('dep',$dep)
        ->orderBy('m.id', 'DESC')
        ->getQuery()
        ->getSingleScalarResult();
        return $qb;
    }

    public function getNumberOfMarketThatWillBeDeletedPerDep(string $dep){
        $qb=$this->createQueryBuilder("m")
        ->where("m.marche IS NOT NULL")
        ->andWhere(" m.traiter!=1")
        ->andWhere("m.isDeleted!=1")
        ->andWhere("m.action = 'Supprimer'")
        ->andWhere("m.dep =:dep")
        ->setParameter('dep',$dep)
        ->orderBy('m.id', 'DESC')
        ->getQuery()
        ->getResult();
        return $qb;
    }

    public function getNumberOfMarketModiFied():array{
        $qb=$this->createQueryBuilder("m")
        ->select("m.dep,count(m.dep) as count")
        ->where("m.marche IS NOT NULL")
        ->andWhere(" m.traiter!=1")
        ->andWhere("m.isDeleted!=1")
        ->andWhere("m.action = 'Modifier'")
        ->groupBy("m.dep")
        ->orderBy('m.dep', 'ASC')
        ->getQuery()
        ->getResult();
        return $qb;
    }

    public function getNumberOfMarketAdd():array{
        $qb=$this->createQueryBuilder("m")
        ->select("m.dep,count(m.dep) as count")
        ->where("m.marche IS NULL")
        ->andWhere(" m.traiter!=1")
        ->andWhere("m.isDeleted!=1")
        ->andWhere("m.action = 'Ajouter'")
        ->groupBy("m.dep")
        ->orderBy('m.dep', 'ASC')
        ->getQuery()
        ->getResult();
        return $qb;
    }

    public function getNumberOfMarketThatWillBeDeleted(){
        $qb=$this->createQueryBuilder("m")
        ->select("m.dep,count(m.dep) as count")
        ->where("m.marche IS NOT NULL")
        ->andWhere(" m.traiter!=1")
        ->andWhere("m.isDeleted!=1")
        ->andWhere("m.action = 'Supprimer'")
        ->groupBy("m.dep")
        ->orderBy('m.dep', 'ASC')
        ->getQuery()
        ->getResult();
        return $qb;
    }

    public function rejectMarketCreated($dep,$id,$validateurId,$commentaire){
        $dateValidation=new \DateTime("now");
        $dateValidation=new \DateTime("now");
        $qb= $this->createQueryBuilder("")
        ->update(MarcheUserModification::class,"m")
        ->set("m.status",":status")
        ->set("m.traiter",":traiter")
        ->set("m.validateurId",":validateurId")
        ->set("m.dateValidation",":dateValidation")
        ->set("m.commentaire",":commentaire")
        ->where("m.marche IS NULL")
        ->andWhere(" m.traiter!=1")
        ->andWhere(" m.action = 'Ajouter'")
        ->andWhere("m.dep =:dep")
        ->andWhere("m.id =:id")
        ->setParameter("id",$id)
        ->setParameter('dep',$dep)
        ->setParameter("status",0)
        ->setParameter("traiter",1)
        ->setParameter("validateurId",$validateurId)
        ->setParameter("dateValidation",$dateValidation)
        ->setParameter("commentaire",$commentaire)
        ->getQuery()
        ->execute();
        return $qb;
    }

    public function rejectMarketModified($dep,$id,$validateurId,$commentaire){
        $dateValidation=new \DateTime("now");
        $qb= $this->createQueryBuilder("")
        ->update(MarcheUserModification::class,"m")
        ->set("m.status",":status")
        ->set("m.traiter",":traiter")
        ->set("m.validateurId",":validateurId")
        ->set("m.dateValidation",":dateValidation")
        ->set("m.commentaire",":commentaire")
        ->where("m.marche IS NOT NULL")
        ->andWhere(" m.traiter!=1")
        ->andWhere(" m.action = 'Modifier'")
        ->andWhere("m.dep =:dep")
        ->andWhere("m.id =:id")
        ->setParameter("id",$id)
        ->setParameter('dep',$dep)
        ->setParameter("status",0)
        ->setParameter("traiter",1)
        ->setParameter("validateurId",$validateurId)
        ->setParameter("dateValidation",$dateValidation)
        ->setParameter("commentaire",$commentaire)
        ->getQuery()
        ->execute();
        return $qb;
    }

    public function canceledMarketCreatedValidated($dep,$id,$validateurId,$commentaire){
        $dateValidation=new \DateTime("now");
        $qb= $this->createQueryBuilder("")
        ->update(MarcheUserModification::class,"m")
        ->set("m.status",":status")
        ->set("m.traiter",":traiter")
        ->set("m.marche",":marche")
        ->set("m.validateurId",":validateurId")
        ->set("m.dateValidation",":dateValidation")
        ->set("m.commentaire",":commentaire")
        ->where("m.marche IS NOT NULL")
        ->andWhere(" m.traiter =1")
        ->andWhere(" m.action = 'Ajouter'")
        ->andWhere("m.dep =:dep")
        ->andWhere("m.id =:id")
        ->setParameter("id",$id)
        ->setParameter('dep',$dep)
        ->setParameter("status",0)
        ->setParameter("traiter",0)
        ->setParameter('marche',null)
        ->setParameter("validateurId",$validateurId)
        ->setParameter("dateValidation",$dateValidation)
        ->setParameter("commentaire",$commentaire)
        ->getQuery()
        ->execute();
        return $qb;
    }
    public function canceledMarketModifValidated($dep,$id){
        $dateValidation=new \DateTime("now");
        $qb= $this->createQueryBuilder("")
        ->update(MarcheUserModification::class,"m")
        ->set("m.status",":status")
        ->set("m.traiter",":traiter")
        ->set("m.dateValidation",":dateValidation")
        ->where("m.marche IS NOT NULL")
        ->andWhere(" m.traiter =1")
        ->andWhere(" m.action = 'Modifier'")
        ->andWhere("m.dep =:dep")
        ->andWhere("m.id =:id")
        ->setParameter("id",$id)
        ->setParameter('dep',$dep)
        ->setParameter("status",0)
        ->setParameter("traiter",0)
        ->setParameter("dateValidation",$dateValidation)
        ->getQuery()
        ->execute();
        return $qb;
    }
    public function updateMarketCreatedByUser($dep,$id,$validateurId,$commentaire,$marche){
        $dateValidation=new \DateTime("now");
        $qb= $this->createQueryBuilder("")
        ->update(MarcheUserModification::class,"m")
        ->set("m.status",":status")
        ->set("m.traiter",":traiter")
        ->set("m.validateurId",":validateurId")
        ->set("m.dateValidation",":dateValidation")
        ->set("m.commentaire",":commentaire")
        ->set("m.marche",":marche")
        ->where("m.marche IS NULL")
        ->andWhere(" m.traiter!=1")
        ->andWhere(" m.action = 'Ajouter'")
        ->andWhere("m.dep =:dep")
        ->andWhere("m.id =:id")
        ->setParameter("marche",$marche)
        ->setParameter("id",$id)
        ->setParameter('dep',$dep)
        ->setParameter("status",1)
        ->setParameter("traiter",1)
        ->setParameter("validateurId",$validateurId)
        ->setParameter("dateValidation",$dateValidation)
        ->setParameter("commentaire",$commentaire)
        ->getQuery()
        ->execute();
        return $qb;
    }

    public function updateMarketModifiedByUser($dep,$id,$validateurId,$commentaire){
        $dateValidation=new \DateTime("now");
        $qb= $this->createQueryBuilder("")
        ->update(MarcheUserModification::class,"m")
        ->set("m.status",":status")
        ->set("m.traiter",":traiter")
        ->set("m.validateurId",":validateurId")
        ->set("m.dateValidation",":dateValidation")
        ->set("m.commentaire",":commentaire")
        ->where("m.marche IS NOT NULL")
        ->andWhere(" m.traiter!=1")
        ->andWhere(" m.action = 'Modifier'")
        ->andWhere("m.dep =:dep")
        ->andWhere("m.id =:id")
        ->setParameter("id",$id)
        ->setParameter('dep',$dep)
        ->setParameter("status",1)
        ->setParameter("traiter",1)
        ->setParameter("validateurId",$validateurId)
        ->setParameter("dateValidation",$dateValidation)
        ->setParameter("commentaire",$commentaire)
        ->getQuery()
        ->execute();
        return $qb;
    }

    public function getAllMarketValidate($dep){
        return $this->createQueryBuilder("m")
        ->where("m.dep =:dep")
        ->andWhere("m.traiter= 1")
        ->andWhere("m.isDeleted!=1")
        ->setParameter("dep",$dep)
        ->getQuery()
        ->getResult();
    }

    public function getNumberAllMarketValidate(){
        return $this->createQueryBuilder("m")
        ->select("m.dep, count(m.dep) as count")
        ->andWhere("m.traiter= 1")
         ->andWhere("m.isDeleted!=1")
        ->groupBy("m.dep")
        ->orderBy('m.dep', 'ASC')
        ->getQuery()
        ->getResult();
    }

    /**
     * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
     * 
     * Goal: Get on element by the id
     * Use in: MarcheController.php
     */
    public function getOneItemByID($id){
        return  $this->createQueryBuilder("r")
                ->select(
                    "r.id,
                    r.clenum,
                    r.denominationF,
                    r.denominationF as nameFilter,
                    r.adresse,
                    r.codpost,
                    r.commune,
                    r.codinsee,
                    r.villenorm,
                    r.specificite,
                    r.jour_de_marche_1,
                    r.jour_de_marche_2,
                    r.jour_de_marche_3,
                    r.jour_de_marche_4,
                    r.jour_de_marche_5,
                    r.jour_de_marche_6,
                    r.jour_de_marche_7,
                    r.jour_de_marche_1 as marche,
                    r.poi_qualitegeorue,
                    r.dcomiris,
                    r.dep,
                    r.date_data,
                    r.date_inser,
                    r.status,
                    r.poiY as lat,
                    r.poiX as long"
                )
                ->where("r.id =:id")
                ->setParameter("id", $id)
                ->getQuery()
                ->getOneOrNullResult();
    }


    public function getAllMarcheModify($userId){

        $isDeleted= false;
        
        $marche= $this->createQueryBuilder("r")
                    ->select(
                        "r.id,
                        r.clenum,
                        r.denominationF,
                        r.denominationF as nameFilter,
                        r.adresse,
                        r.codpost,
                        r.commune,
                        r.codinsee,
                        r.villenorm,
                        r.specificite,
                        r.jour_de_marche_1,
                        r.jour_de_marche_2,
                        r.jour_de_marche_3,
                        r.jour_de_marche_4,
                        r.jour_de_marche_5,
                        r.jour_de_marche_6,
                        r.jour_de_marche_7,
                        r.poi_qualitegeorue,
                        r.dcomiris,
                        r.dep,
                        r.date_data,
                        r.date_inser,
                        r.action,
                        r.status,
                        r.poiY as lat,
                        r.poiX as long"
                    )
                    ->where("r.userId =:userId")
                    ->andWhere("r.isDeleted =:isDeleted")
                    ->setParameter("userId", $userId)
                    ->setParameter("isDeleted", $isDeleted)
                    ->orderBy('r.status','DESC')
                    ->getQuery()
                    ->getResult();

        return $marche;
    }

    public function getStatesDataMarche($ids){
        $data= $this->createQueryBuilder("r")
                    ->select("r.id,r.action,r.status")
                    ->leftJoin('r.userId', 'u')
                    ->addSelect('u.id AS userId')
                    ->addSelect('u.email AS email')

                    ->leftJoin('r.marche', 'm')
                    ->addSelect('m.id AS rubriqueId')

                    ->leftJoin('r.validateurId', 'v')
                    ->addSelect('v.id AS validatorId')

                    ->where("r.marche IN (:u)")
                    ->setParameter("u",$ids)
                    ->getQuery()
                    ->getResult()
        ;
        

        return $data;
    }
}
