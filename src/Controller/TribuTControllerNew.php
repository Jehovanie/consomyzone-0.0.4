<?php
namespace  App\Controller;

use App\Repository\HachageTribuTNameRepository;
use App\Service\Status;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use DateTime;

use Normalizer;

use App\Entity\User;


use App\Entity\Consumer;
use App\Entity\Supplier;
use App\Service\FilesUtils;
use App\Entity\PublicationG;

use App\Form\FileUplaodType;

use App\Service\MailService;

use App\Service\UserService;
use App\Service\StringTraitementService;
use App\Form\PublicationType;
use App\Service\TributGService;

use App\Service\Tribu_T_Service;

use App\Repository\UserRepository;

use App\Service\RequestingService;
use App\Service\NotificationService;
use App\Repository\BddRestoRepository;
use App\Repository\DepartementRepository;
use App\Service\AgendaService;
use App\Service\Tribu_T_ServiceNew;
use Doctrine\ORM\EntityManagerInterface;

use function PHPUnit\Framework\assertFalse;
use function PHPUnit\Framework\isNull;

use Symfony\Component\Filesystem\Filesystem;


use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\RouterInterface;

use Symfony\Component\HttpKernel\KernelInterface;
use Symfony\Component\Validator\Constraints\Uuid;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Serializer\Encoder\JsonDecode;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Symfony\Component\String\Slugger\SluggerInterface;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\HiddenType;

use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

class TribuTControllerNew extends AbstractController{
    private $form;

    private $entityManager;

    private $mailService;

    private $appKernel;
 
    private $requesting;

    private $filesyst;

    function __construct(
        MailService $mailService, 

        EntityManagerInterface $entityManager, 

        KernelInterface $appKernel, 

        RequestingService $requesting,

        Filesystem $filesyst
    )

    {

        $this->entityManager = $entityManager;

        $this->appKernel = $appKernel;

        $this->mailService = $mailService;

        $this->requesting = $requesting;

        $this->filesyst = $filesyst;

    }


    /**
     * @author Nantenaina
     * où: on Utilise cette fonction dans la rubrique création tribu T cmz, 
     * localisation du fichier: dans TribuTControllerNew.php,
     * je veux: créer une tribu T
     *
     */
    #[Route("/user/tribu/my-tribu-t/accueil", name: "app_my_tribu_t_new")]
    public function MyTribuT(
        Status $status,
        Request $request, 
        Tribu_T_ServiceNew $srvTribuT,
        HachageTribuTNameRepository $hachageRepo,
        Filesystem $filesyst
    ){
        $user=$this->getUser();

        if(!$user) {
            return $this->redirectToRoute('app_account');
        }

        $userId = intval($user->getId());
        $userType = $user->getType();
        $userConnected= $status->userProfilService($this->getUser());
        $defaultData = ['message' => 'reseigner le champ avec vos mots.'];
        $form = $this->createFormBuilder($defaultData)
                ->add('upload', FileType::class, [
                    'label' => false,
                    'required' => false 
                ])
                ->add('tribuTName', TextType::class, [
                    'label' => false 
                ])
                ->add('extensionData', HiddenType::class, [
                    'label' => false ,
                    'required' => false
                ])
                ->add('description', TextType::class, [
                    'label' => false ,
                    'required' => false
                ])
                // ->add('adresse', TextType::class, [
                //     'label' => false ,
                //     'required' => false
                // ])
                ->add('extension', CheckboxType::class, [
                    'label' => 'Restaurant',
                    'required' => false
                ])
                ->add('extension_golf', CheckboxType::class, [
                    'label' => 'Golf',
                    'required' => false
                ])
                ->getForm();
        
        if ($userType == "consumer") {

            $profil = $this->entityManager->getRepository(Consumer::class)->findByUserId($userId);
        } else {

            $profil = $this->entityManager->getRepository(Supplier::class)->findByUserId($userId);
        }
        $form->handleRequest($request);
        //TODO handle submit
        if ($form->isSubmitted() && $form->isValid()){
            $now = time();
            //key fera office de nom de la table de la tribuT créée
            $key='t'.$now.'u'.$userId;
            $data = $form->getData();
            $logoTribuT=null;
            $imgTribuTDir=null;
            $newImageName = null;
            $dataImg = $data["upload"];
            if($dataImg){
                $imgExtension = $dataImg->guessExtension();
                $newImageName = "img_".$now.".".$imgExtension;
                $path = '/uploads/tribu_t/photo/'.$key."/";
                $imgTribuTDir = $this->getParameter('kernel.project_dir')."/public".$path;
                if(!($filesyst->exists($imgTribuTDir)))
                        $filesyst->mkdir($imgTribuTDir,0777);
                        
                $logoTribuT = $path.$newImageName;

            }else{
                $logoTribuT="/uploads/tribu_t/photo/avatar_tribu.jpg";
            }
          
            $nomTribuT=json_encode($data["tribuTName"]);

            $extensionRestaurent=$data["extension"];

            $extensionGolf=$data["extension_golf"];

            $description=json_encode($data["description"]);
            
            //TODO insert one row in tribu T Owned table
            $lastIdTribuTCreated=$srvTribuT->addTribuTOwned($user,$nomTribuT,$description,
            $logoTribuT, $key,$extensionRestaurent,$extensionGolf);

            //TODO set into table hashing
             $srvTribuT->createHachage($hachageRepo,$key,$lastIdTribuTCreated, $userId );

            //TODO create table tribu t
            $srvTribuT->generateTribuTTables($key,$userId);

            //TODO check if extensions are activated
            if ($extensionRestaurent) {
                $srvTribuT->createExtensionDynamicTable($key, "restaurant");
            }

            if ($extensionGolf) {
                $srvTribuT->createExtensionDynamicTable($key, "golf");
            }

            // $srvTribuT->addTribuTJoined($user, $userId, $key);
            //TODO SAVE image
            if($imgTribuTDir)
                $dataImg->move($imgTribuTDir, $newImageName);
            
            $message = "Tribu " . $nomTribuT . " créée avec succes.";   
            return $this->redirectToRoute("app_my_tribu_t_new" ,["message" => $message]);
        }

        $tribuTOwned = $srvTribuT->getAllTribuTOwnedInfos($user);

        $tribuTJoined = $srvTribuT->getAllTribuTJoinedInfos($user);

        //TODO get all publications of tribu T
        $publications= [];
        $allTribusT = array_merge($tribuTOwned, $tribuTJoined);
        if(count($allTribusT) > 0 ){
            $all_pub_tribuT= [];
            foreach($allTribusT as $tribuT){
                $temp_pub= $srvTribuT->getAllPublicationForOneTribuT($tribuT['nom_table_trbT']);
                $all_pub_tribuT = array_merge($all_pub_tribuT, $temp_pub);
            }
            $publications= array_merge($publications, $all_pub_tribuT);
        }

        return $this->render('tribu_t/tribuT.html.twig',[
            "publications" => $publications,
            "userConnected" => $userConnected,
            "profil" => $profil,
            "tribu_T_owned" => $tribuTOwned,
            "tribu_T_joined" => $tribuTJoined,
            "kernels_dir" => $this->getParameter('kernel.project_dir'), 
            "form" => $form->createView(),
        ]);
    }
}
