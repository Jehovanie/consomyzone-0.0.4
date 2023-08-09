<?php

namespace App\Repository;

use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Security\Core\Exception\UnsupportedUserException;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\PasswordUpgraderInterface;

/**
 * @extends ServiceEntityRepository<User>
 *
 * @method User|null find($id, $lockMode = null, $lockVersion = null)
 * @method User|null findOneBy(array $criteria, array $orderBy = null)
 * @method User[]    findAll()
 * @method User[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class UserRepository extends ServiceEntityRepository implements PasswordUpgraderInterface
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
        $json_tribuT_owned= $this->sec->getUser()->getTribuT();
        if( $json_tribuT_owned ){
            $decode_tribuT_owned = json_decode($json_tribuT_owned , true);
            if( !array_key_exists("name", $decode_tribuT_owned['tribu_t']) ){
                foreach($decode_tribuT_owned["tribu_t"] as $tribuT){
                    extract($tribuT);  /// $name
                    array_push($results,["table_name" => $name ] );
                }
            }else{
                array_push($results, ["table_name" => $decode_tribuT_owned['tribu_t']['name'] ] );
            }
            
        }

        return $results;
    }


    public function getListTalbeTribuT_joined(){
        $results= [ ];

        $json_tribuT_joined = $this->sec->getUser()->getTribuTJoined();
        if( $json_tribuT_joined ){

            $decode_tribuT_joined = json_decode($json_tribuT_joined , true);
           
            if( !array_key_exists("name", $decode_tribuT_joined['tribu_t']) ){
                foreach($decode_tribuT_joined["tribu_t"] as $tribuT){
                    extract($tribuT);  /// $name
                    array_push($results, ["table_name" => $name ] );
                }
            }else{
                array_push($results, ["table_name" => $decode_tribuT_joined['tribu_t']['name'] ] );
            }

        }

        return $results;
    }

    public function getListTableTribuT(){
        $tab_owned= $this->getListTableTribuT_owned();
        $tab_joined= $this->getListTalbeTribuT_joined();

        return  array_merge($tab_owned, $tab_joined);
    }
}
