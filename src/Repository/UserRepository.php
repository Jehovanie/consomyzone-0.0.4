<?php

namespace App\Repository;

use App\Entity\Supplier;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Security\Core\Exception\UnsupportedUserException;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\PasswordUpgraderInterface;
use App\Repository\RepositoryDev;

/**
 * @extends ServiceEntityRepository<User>
 *
 * @method User|null find($id, $lockMode = null, $lockVersion = null)
 * @method User|null findOneBy(array $criteria, array $orderBy = null)
 * @method User[]    findAll()
 * @method User[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class UserRepository extends ServiceEntityRepository implements PasswordUpgraderInterface,RepositoryDev
{
    /**
     * @var Security
     */
    private $sec;

    public function __construct(ManagerRegistry $registry, Security $security)
    {
        parent::__construct($registry, User::class);
        $this->sec= $security;
    }

    public function add(User $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(User $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    /**
     * Used to upgrade (rehash) the user's password automatically over time.
     */
    public function upgradePassword(PasswordAuthenticatedUserInterface $user, string $newHashedPassword): void
    {
        if (!$user instanceof User) {
            throw new UnsupportedUserException(sprintf('Instances of "%s" are not supported.', \get_class($user)));
        }

        $user->setPassword($newHashedPassword);

        $this->add($user, true);
    }


    public function findByRolesUserSuperAdmin()
    {
        return  $this->createQueryBuilder('u')
                    ->where('u.roles  LIKE :r')
                    ->setParameter('r', '%GODMODE%' )
                    ->getQuery()
                    ->getOneOrNullResult();

    }

    public function updatePdpTribu_T($data){
        $user= $this->sec->getUser();
        $user->setTribuT($data);
        $this->getEntityManager()->merge($user);
        $this->getEntityManager()->flush();
    }

    public function updatePdpTribu_T_Joined($data,$user){
        $user->setTribuTJoined($data);
        $this->getEntityManager()->merge($user);
        $this->getEntityManager()->flush();
    }


    public function getListTableTribuT_owned(){

        $results= [ ];
        $json_tribuT_owned = $this->sec->getUser() ? $this->sec->getUser()->getTribuT() : false;
        if( $json_tribuT_owned ){
            $decode_tribuT_owned = json_decode($json_tribuT_owned , true);
            $arrayTribu_T_Owned = $decode_tribuT_owned['tribu_t'];
            if(!array_key_exists("name", $arrayTribu_T_Owned)){
                foreach($arrayTribu_T_Owned as $tribuT){
                    extract($tribuT);  /// $name
                    $name_tribu_t_muable = isset($name_tribu_t_muable) ? $name_tribu_t_muable : null;
                    array_push($results,["table_name" => $name, 
                    "name_tribu_t_muable" => $name_tribu_t_muable,
                    "logo_path" => $logo_path] );
                }
            }else{
                $name_tribu_t_muable =  array_key_exists("name_tribu_t_muable", $arrayTribu_T_Owned) ? $arrayTribu_T_Owned["name_tribu_t_muable"]:null;
                array_push($results, 
                ["table_name" => $arrayTribu_T_Owned['name'],
                "name_tribu_t_muable" => $name_tribu_t_muable,
                 "logo_path" => $arrayTribu_T_Owned['logo_path']]);
            }
            
        }

        return $results;
    }


    public function getListTalbeTribuT_joined(){
        $results= [ ];

        $json_tribuT_joined
        = $json_tribuT_owned = $this->sec->getUser() ? $this->sec->getUser()->getTribuTJoined() : false; 
        if( $json_tribuT_joined ){

            $decode_tribuT_joined = json_decode($json_tribuT_joined , true);

            $arrayTribu_T_Joined = $decode_tribuT_joined['tribu_t'];
           
            if( !array_key_exists("name", $arrayTribu_T_Joined) ){
                foreach($arrayTribu_T_Joined as $tribuT){
                    extract($tribuT);  /// $name
                    $name_tribu_t_muable = isset($name_tribu_t_muable) ? $name_tribu_t_muable : null;
                    array_push($results, ["table_name" => $name ,
                    "name_tribu_t_muable" => $name_tribu_t_muable, 
                    "logo_path" => $logo_path] );
                }
            }else{
                $name_tribu_t_muable =  array_key_exists("name_tribu_t_muable", $arrayTribu_T_Joined) ? $arrayTribu_T_Joined["name_tribu_t_muable"]:null;
                array_push($results, ["table_name" => $arrayTribu_T_Joined['name'], 
                "name_tribu_t_muable" => $name_tribu_t_muable,
                "logo_path" => $arrayTribu_T_Joined['logo_path']]);
            }

        }

        return $results;
    }

    public function getListTableTribuT(){
        $tab_owned= $this->getListTableTribuT_owned();
        $tab_joined= $this->getListTalbeTribuT_joined();

        return  array_merge($tab_owned, $tab_joined);
    }

    public function updateByNameWhereIdis($column,$value,$idValue){
        return $this->createQueryBuilder("")
        ->update(User::class, "s")
        ->set("s.".$column,":column")
        ->setParameter("column",$value)
        ->where("s.id=:id")
        ->setParameter("id",$idValue)
        ->getQuery()
        ->execute();
    }
    
}
