<?php



namespace App\Controller;



use App\Service\Status;
use App\Entity\Avisferme;
use App\Service\MessageService;
use App\Service\TributGService;
use App\Repository\UserRepository;

use App\Repository\CodeapeRepository;

use App\Repository\AvisfermeRepository;

use App\Repository\FermeGeomRepository;

use Doctrine\ORM\EntityManagerInterface;

use App\Repository\DepartementRepository;

use Symfony\Component\HttpFoundation\Request;

use Symfony\Component\HttpFoundation\Response;

use Symfony\Component\Routing\Annotation\Route;

use Symfony\Component\HttpFoundation\JsonResponse;

use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

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
        MessageService $messageService
    ): Response
    {
        ///current user connected
        $user = $this->getUser();
        $userConnected = $status->userProfilService($this->getUser());
        // return $this->redirectToRoute("restaurant_all_dep");
        $statusProfile = $status->statusFondateur($user);

        ///////GET PROFIL THE USER IN SAME TRIBUT G WITH ME////////////////////////////////
        ///to contains profil user information [ [ id => ..., photo => ..., email => ..., firstname => ..., lastname => ..., image_profil => ..., last_message => ..., is_online => ... ], ... ]
        $amis_in_tributG = $messageService->getListAmisToChat($user, $tributGService, $entityManager, $userRepository);


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
        MessageService $messageService
    )
    {

        ///current user connected
        $user = $this->getUser();

        // return $this->redirectToRoute("restaurant_all_dep");
        $statusProfile = $status->statusFondateur($user);
        $userConnected = $status->userProfilService($this->getUser());

        ///////GET PROFIL THE USER IN SAME TRIBUT G WITH ME////////////////////////////////
        ///to contains profil user information [ [ id => ..., photo => ..., email => ..., firstname => ..., lastname => ..., image_profil => ..., last_message => ..., is_online => ... ], ... ]
        $amis_in_tributG = $messageService->getListAmisToChat($user, $tributGService, $entityManager, $userRepository);


        // dd($fermeGeomRepository->getFermByDep($nom_dep, $id_dep, 0));
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
     * @Route("/ferme-mobile/departement/{nom_dep}/{id_dep}/{limit}/{offset}" , name="specific_mobile_departement", methods={"GET"} )
     */
    public function getSpecifiqueDepMobile(
        CodeapeRepository $codeApeRep, 
        Status $status, 
        FermeGeomRepository $fermeGeomRepository, 
        $nom_dep,
        $id_dep,
        $limit,
        $offset,
        )

    {

        $statusProfile = $status->statusFondateur($this->getUser());
        $userConnected = $status->userProfilService($this->getUser());
        return $this->json([
            "id_dep" => $id_dep,

            "nom_dep" => $nom_dep,

            "fermes" => $fermeGeomRepository->getFermByDepMobile($nom_dep, $id_dep, $limit, $offset),

            "nomber_ferme" => $fermeGeomRepository->getCountFerme($nom_dep, $id_dep)[0]["1"],

            "profil" => $statusProfile["profil"],

            "statusTribut" => $statusProfile["statusTribut"],
            "userConnected" => $userConnected,
            "codeApes" => $codeApeRep->getCode()
        ]);
    }

    /**
     * @Route("/ferme-mobile/departement/{nom_dep}/{id_dep}/{id_ferme}" , name="specific_mobile_search_departement", methods={"GET"} )
     */
    public function getSpecifiqueDepSearchMobile(
        CodeapeRepository $codeApeRep,
        Status $status,
        FermeGeomRepository $fermeGeomRepository,
        $nom_dep,
        $id_dep,
        $id_ferme,
    ) {

        $statusProfile = $status->statusFondateur($this->getUser());
        $userConnected = $status->userProfilService($this->getUser());
        return $this->json([
            "id_dep" => $id_dep,

            "nom_dep" => $nom_dep,

            "fermes" => $fermeGeomRepository->getFermByDepSearchMobile($nom_dep, $id_dep, $id_ferme),

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

    #[Route("/details/ferme/{id_ferme}", name:"get_details_ferme", methods: ["GET"] )]
    public function getDetailsRubriqueFerme(
        $id_ferme,
        CodeapeRepository $codeApeRep, 
        Status $status, 
        FermeGeomRepository $fermeGeomRepository, 
    ): Response
    {
        $statusProfile = $status->statusFondateur($this->getUser());
        $userConnected = $status->userProfilService($this->getUser());

        $ferme_details= $fermeGeomRepository->getDetailsRubriqueFerme($id_ferme);
        
        return $this->render("ferme/details_ferme.html.twig", [
            "details" => $ferme_details,
            "userConnected" => $userConnected,
            "nom_dep" => $ferme_details["departementName"],
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
    #[Route("/fetch_data/ferme", name: "fetch_data_ferme" , methods: [ "GET", "POST"])]
    #[Route("/getLatitudeLongitudeFerme", name: "getLatitudeLongitudeFerme" , methods: [ "GET"])]
    public function getLatitudeLongitudeFerme(
        Request $request,
        FermeGeomRepository $fermeGeomRepository,
        SerializerInterface $serialize
    ){
        $current_uri= $request->getUri();
        $pathname= parse_url($current_uri, PHP_URL_PATH);
        // if( str_contains($pathname, "fetch_data")){}

        if($request->query->has("minx") && $request->query->has("miny") ){

            $minx = $request->query->get("minx");
            $maxx = $request->query->get("maxx");
            $miny = $request->query->get("miny");
            $maxy = $request->query->get("maxy");

            $data_max = $request->query->get("data_max"); 
            $data_max = $data_max ? intval($data_max) : null;

            $datas= $fermeGeomRepository->getDataBetweenAnd($minx, $miny, $maxx, $maxy, $data_max);

            if( str_contains($pathname, "fetch_data")){
                return $this->json([
                    "data" => $datas
                ], 200);
            }
            return $this->json($datas);
        }

        if($request->getMethod() === "POST"){
            $data= json_decode($request->getContent(), true);
            extract($data);  /// $dep, $note_min, $note_max, $data_max, 
            
            $data_max = $data_max ? intval($data_max) : 50;

            $filter_options= [
                "dep" => $dep,
                "note" => [
                    "min" => $note_min,
                    "max" => $note_max
                ],
            ];

            $datas = $fermeGeomRepository->getDataByFilterOptions($filter_options, $data_max);
            $count = $fermeGeomRepository->getDataByFilterOptionsCount($filter_options);

            return $this->json([
                "data" => $datas,
                "pastille" => [],
                "count" => $count
            ], 200);
        }


        $datas= $fermeGeomRepository->getSomeDataShuffle(2000);

        if( str_contains($pathname, "fetch_data")){
            return $this->json([
                "data" => $datas
            ], 200);
        }
        return $this->json($datas);
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
