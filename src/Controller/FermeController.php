<?php



namespace App\Controller;



use App\Entity\Avisferme;
use App\Service\TributGService;
use App\Repository\AvisfermeRepository;
use App\Repository\CodeapeRepository;
use App\Repository\DepartementRepository;

use App\Repository\FermeGeomRepository;

use App\Repository\UserRepository;

use App\Service\Status;

use Doctrine\ORM\EntityManagerInterface;

use Symfony\Component\HttpFoundation\Request;

use Symfony\Component\HttpFoundation\Response;

use Symfony\Component\Routing\Annotation\Route;

use Symfony\Component\HttpFoundation\JsonResponse;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

use Symfony\Component\Serializer\SerializerInterface;

class FermeController extends AbstractController

{

    private $em;

    public function __construct(EntityManagerInterface $em)

    {

        $this->em = $em;
    }

    /**

     * @Route("/ferme" , name="all_departement" , methods={"GET", "POST"})

     */

    public function getAllDepartement(
        CodeapeRepository $codeApeRep, 
        Status $status, 
        DepartementRepository $departementRepository, 
        FermeGeomRepository $fermeGeomRepository, 
        Request $request,
        UserRepository $userRepository,
        EntityManagerInterface $entityManager,
        TributGService $tributGService,
        
    ): Response
    {
        ///current user connected
        $user = $this->getUser();
        $userConnected = $status->userProfilService($this->getUser());
        // return $this->redirectToRoute("restaurant_all_dep");
        $statusProfile = $status->statusFondateur($user);

        $amis_in_tributG = [];

        if($user){
            // ////profil user connected
            $profil = $tributGService->getProfil($user, $entityManager);

            $id_amis_tributG = $tributGService->getAllTributG($profil[0]->getTributG());  /// [ ["user_id" => ...], ... ]

            ///to contains profil user information
            foreach ($id_amis_tributG  as $id_amis) { /// ["user_id" => ...]

                ///check their type consumer of supplier
                $user_amis = $userRepository->find(intval($id_amis["user_id"]));
                
                if( $user_amis ){
                    $profil_amis = $tributGService->getProfil($user_amis, $entityManager)[0];
                    ///single profil
                    $amis = [
                        "id" => $id_amis["user_id"],
                        "photo" => $profil_amis->getPhotoProfil(),
                        "email" => $user_amis->getEmail(),
                        "firstname" => $profil_amis->getFirstname(),
                        "lastname" => $profil_amis->getLastname(),
                        "image_profil" => $profil_amis->getPhotoProfil(),
                        "is_online" => $user_amis->getIsConnected(),
                    ];

                    ///get it
                    array_push($amis_in_tributG, $amis);
                }
            }
        }




        return $this->render("ferme/index.html.twig", [

            "departements" => $departementRepository->getDep(),

            "number_of_departement" => $fermeGeomRepository->getCountFerme()[0]["1"],

            "profil" => $statusProfile["profil"],

            "statusTribut" => $statusProfile["statusTribut"],

            "codeApes" => $codeApeRep->getCode(),
            "userConnected" => $userConnected,
            "amisTributG" => $amis_in_tributG
        ]);
    }

    /**

     * @Route("/ferme-mobile" , name="all_obile_departement" , methods={"GET", "POST"})

     */

    public function getAllMobilDepartement(CodeapeRepository $codeApeRep, Status $status, DepartementRepository $departementRepository, FermeGeomRepository $fermeGeomRepository, Request $request): Response

    {

        $statusProfile = $status->statusFondateur($this->getUser());
        $userConnected = $status->userProfilService($this->getUser());
         return $this->render("shard/ferme/mobil-depart.js.twig", [
            "userConnected" => $userConnected,
            "departements" => $departementRepository->getDep(),

            "number_of_departement" => $fermeGeomRepository->getCountFerme()[0]["1"],

            "profil" => $statusProfile["profil"],

            "statusTribut" => $statusProfile["statusTribut"],

            "codeApes" => $codeApeRep->getCode()
        ]);
    }



    /**
     * @Route("/ferme/departement/{nom_dep}/{id_dep}" , name="specific_departement", methods={"GET"} )
     */
    public function getSpecifiqueDep(
        $nom_dep, $id_dep,
        CodeapeRepository $codeApeRep,
        Status $status, 
        FermeGeomRepository $fermeGeomRepository,
        UserRepository $userRepository,
        EntityManagerInterface $entityManager,
        TributGService $tributGService,
    )
    {

        ///current user connected
        $user = $this->getUser();

        // return $this->redirectToRoute("restaurant_all_dep");
        $statusProfile = $status->statusFondateur($user);

        $amis_in_tributG = [];
        $userConnected = $status->userProfilService($this->getUser());
        if($user){
            // ////profil user connected
            $profil = $tributGService->getProfil($user, $entityManager);

            $id_amis_tributG = $tributGService->getAllTributG($profil[0]->getTributG());  /// [ ["user_id" => ...], ... ]

            ///to contains profil user information
            foreach ($id_amis_tributG  as $id_amis) { /// ["user_id" => ...]

                ///check their type consumer of supplier
                $user_amis = $userRepository->find(intval($id_amis["user_id"]));
                
                if( $user_amis ){
                    $profil_amis = $tributGService->getProfil($user_amis, $entityManager)[0];
                    ///single profil
                    $amis = [
                        "id" => $id_amis["user_id"],
                        "photo" => $profil_amis->getPhotoProfil(),
                        "email" => $user_amis->getEmail(),
                        "firstname" => $profil_amis->getFirstname(),
                        "lastname" => $profil_amis->getLastname(),
                        "image_profil" => $profil_amis->getPhotoProfil(),
                        "is_online" => $user_amis->getIsConnected(),
                    ];

                    ///get it
                    array_push($amis_in_tributG, $amis);
                }
            }
        }

        return $this->render("ferme/specific_departement.html.twig", [

            "id_dep" => $id_dep,

            "nom_dep" => $nom_dep,

            "type" => "ferme",
            "userConnected" => $userConnected,
            "fermes" => $fermeGeomRepository->getFermByDep($nom_dep, $id_dep, 0),

            "nomber_ferme" => $fermeGeomRepository->getCountFerme($nom_dep, $id_dep)[0]["1"],

            "profil" => $statusProfile["profil"],

            "statusTribut" => $statusProfile["statusTribut"],

            "codeApes" => $codeApeRep->getCode(),

            "amisTributG" => $amis_in_tributG
        ]);
    }

    /**

     * @Route("/ferme-mobile/departement/{nom_dep}/{id_dep}" , name="specific_mobile_departement", methods={"GET"} )

     */

    public function getSpecifiqueDepMobile(CodeapeRepository $codeApeRep, Status $status, FermeGeomRepository $fermeGeomRepository, $nom_dep, $id_dep)

    {

        $statusProfile = $status->statusFondateur($this->getUser());
        $userConnected = $status->userProfilService($this->getUser());
        return $this->render("shard/ferme/specific_mobile_departement.js.twig", [

            "id_dep" => $id_dep,

            "nom_dep" => $nom_dep,

            "fermes" => $fermeGeomRepository->getFermByDep($nom_dep, $id_dep, 0),

            "nomber_ferme" => $fermeGeomRepository->getCountFerme($nom_dep, $id_dep)[0]["1"],

            "profil" => $statusProfile["profil"],

            "statusTribut" => $statusProfile["statusTribut"],
            "userConnected" => $userConnected,
            "codeApes" => $codeApeRep->getCode()
        ]);
    }



    /**

     * @Route("/ferme/departement", name="departement_ferme_suite", methods={"POST"} )

     */

    public function getFermeRepoSuite(Status $status, FermeGeomRepository $fermeGeomRepository, Request $request)

    {

        if ($request->isXmlHttpRequest() || $request->query->get('showJson') == 1) {

            // ce qu'on va retourné

            return $this->json(

                $fermeGeomRepository->getFermByDep(

                    $request->request->get("nom_dep"),

                    intval($request->request->get("id_dep")),

                    intval($request->request->get("page"))

                )
            );
        }
    }

    /**
     * @Route("/ferme/departement/{nom_dep}/{id_dep}/allFerme" , name="getAllFermeInDepartement", methods={"GET"} )
     */
    public function getAllFermeInDepartement(Status $status, FermeGeomRepository $fermeGeomRepository, $nom_dep, $id_dep)
    {
        $id_dep= strlen($id_dep) === 1 ? "0" . $id_dep : $id_dep;
        return $this->json(
            $fermeGeomRepository->getAllFermeInDepartement(
                $nom_dep,
                $id_dep
            )
        );
    }

    /** 
     * DON'T CHANGE THIS ROUTE: It's use in js file. 
     * 
     * @Route("ferme/departement/{nom_dep}/{id_dep}/details/{id_ferme}" , name="detail_ferme" , methods="GET" )
     */
    public function detailsFerme(CodeapeRepository $codeApeRep, Status $status, FermeGeomRepository $fermeGeomRepository, $nom_dep, $id_dep, $id_ferme): Response
    {
        
        $statusProfile = $status->statusFondateur($this->getUser());
        $userConnected = $status->userProfilService($this->getUser());
        return $this->render("ferme/details_ferme.html.twig", [
            "details" => $fermeGeomRepository->getOneFerme($nom_dep, $id_dep, $id_ferme)[0],
            "id_dep" => $id_dep,
            "userConnected" => $userConnected,
            "nom_dep" => $nom_dep,
            "profil" => $statusProfile["profil"],
            "statusTribut" => $statusProfile["statusTribut"],
            "codeApes" => $codeApeRep->getCode()
        ]);
    }

    /** 
     * DON'T CHANGE THIS ROUTE: It's use in js file. 
     * @Route("ferme-mobile/departement/{nom_dep}/{id_dep}/details/{id_ferme}" , name="detail_ferme_mobile" , methods="GET" )
     */

    public function detailsFermeMobile(CodeapeRepository $codeApeRep, Status $status, FermeGeomRepository $fermeGeomRepository, $nom_dep, $id_dep, $id_ferme): Response

    {

        $statusProfile = $status->statusFondateur($this->getUser());



        return $this->render("shard/ferme/details_mobile.js.twig", [

            "details" => $fermeGeomRepository->getOneFerme($nom_dep, $id_dep, $id_ferme)[0],

            "id_dep" => $id_dep,

            "nom_dep" => $nom_dep,

            "profil" => $statusProfile["profil"],

            "statusTribut" => $statusProfile["statusTribut"],

            "codeApes" => $codeApeRep->getCode()
        ]);
    }



    /**
     * @Route("/getLatitudeLongitudeFerme" , name="getLatitudeLongitudeFerme" , methods={"GET"})
     */
    public function getLatitudeLongitudeFerme(
        Request $request,
        FermeGeomRepository $fermeGeomRepository,
        SerializerInterface $serialize
    ){

        if($request->query->has("minx") && $request->query->has("miny") ){

            $minx = $request->query->get("minx");
            $maxx = $request->query->get("maxx");
            $miny = $request->query->get("miny");
            $maxy = $request->query->get("maxy");

            $datas= $fermeGeomRepository->getDataBetweenAnd($minx, $miny, $maxx, $maxy);

            return $this->json($datas);
        }

        return $this->json($fermeGeomRepository->getSomeDataShuffle(2000));
    }

    #[Route("/avis/ferme/{idFerme}", name: "avis_ferme", methods: ["POST"])]
    public function giveAvisFerme(
        FermeGeomRepository $fermeRep,
        AvisfermeRepository $repoAvisFerme,
        Request $request,
        $idFerme
    ) {

        $user = $this->getUser();
        $fermeRep = $fermeRep->find($idFerme);
        $avisFerme = new Avisferme();
        $requestJson = json_decode($request->getContent(), true);
        $avis = $requestJson["avis"];
        $note = $requestJson["note"];
        //dd($user,$resto);
        $avisFerme->setComment($avis)
            ->setnote($note)
            ->setUser($user)
            ->setDatetime(new \DateTimeImmutable())
            ->setFerme($fermeRep);

        return $this->json($repoAvisFerme->add($avisFerme, true));
    }

    #[Route("/aviss/ferme/{idFerme}", name: "get_avis_Ferme", methods: ["GET"])]
    public function getAvisFerme(
        AvisfermeRepository $avisFermeRepository,
        $idFerme,
        SerializerInterface $serializer
    ) {

        $userId = $this->getUser()->getId();
        $response = $avisFermeRepository->getNote($idFerme, $userId);
        $response = $serializer->serialize($response, 'json');
        return new JsonResponse($response, 200, [], true);
    }


    #[Route("/avis/ferme/global/{idFerme}", name: "get_avis_global_ferme", methods: ["GET"])]
    public function getAvisGlobalferme(
        AvisfermeRepository $avisFermeRepository,
        $idFerme,
        SerializerInterface $serializer
    ) {

        $response = $avisFermeRepository->getNoteGlobale($idFerme);
        $response = $serializer->serialize($response, 'json');
        return new JsonResponse($response, 200, [], true);
    }
    #[Route("/change/ferme/{idFerme}", name: "change_avis_ferme", methods: ["POST"])]
    public function changeAvisferme(
        AvisfermeRepository $avisFermeRepository,
        $idFerme,
        SerializerInterface $serializer,
        Request $request
    ) {

        $rJson = json_decode($request->getContent(), true);
        $userId = $this->getUser()->getId();
        $response = $avisFermeRepository->updateAvis(
            $idFerme,
            $userId,
            $rJson["note"],
            $rJson["avis"]
        );
        $response = $serializer->serialize($response, 'json');
        return new JsonResponse($response, 200, [], true);
    }

    #[Route("/nombre/avis/ferme/{idFerme}", name: "get_nombre_avis_ferme", methods: ["GET"])]
    public function getNombreAvisferme(
        $idFerme,
        AvisfermeRepository $avisFermeRepository,
        SerializerInterface $serializer,
    ) {
        $response = $avisFermeRepository->getNombreAvis($idFerme);

        $response = $serializer->serialize(["nombre_avis" => $response], 'json');
        return new JsonResponse($response, 200, [], true);
    }
}
