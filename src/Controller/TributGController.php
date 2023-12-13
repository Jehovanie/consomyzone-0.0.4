<?php



namespace App\Controller;

use App\Entity\Consumer;

use App\Entity\Supplier;

use App\Service\UserService;

use App\Service\TributGService;

use App\Service\Tribu_T_Service;

use App\Repository\UserRepository;

use App\Service\NotificationService;

use App\Service\FilesUtils;

use App\Service\AgendaService;

use Doctrine\ORM\EntityManagerInterface;

use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpKernel\KernelInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;



class TributGController extends AbstractController

{

    private $appKernel;
    private $filesyst;

    function __construct(KernelInterface $appKernel,Filesystem $filesyst)

    {

        $this->appKernel = $appKernel;
        $this->filesyst = $filesyst;

    }

    #[Route("/tributG/publications/reaction", name: "app_tribut_reaction")]

    public function handlePublicationReaction(

        Request $request,

        TributGService $tributGService,

        NotificationService $notificationService,

    ) {

        $data = json_decode($request->getContent(), true);

        extract($data); /// $pub_id , $is_like, $author_id

        $isTribuT = explode("_",$table)[0] === "tribu";

        if($isTribuT){
            $tableReaction = $table."_reaction";
            $reaction = $tributGService->handlePublicationReaction(
    
                $pub_id,
    
                $this->getUser()->getId(),
    
                $is_like,
                
                $tableReaction
    
            );
        }else{

            $reaction = $tributGService->handlePublicationReaction(
    
                $pub_id,
    
                $this->getUser()->getId(),
    
                $is_like
    
            );
        }



        if (intval($author_id) != $this->getUser()->getId()) {

            $full_name = $tributGService->getFullName($this->getUser()->getId());

            if (intval($is_like) === 1) {

                // $message_notification = $full_name . " a réagi sur votre publication.<br><a class='d-block btn btn-primary w-70 mt-2 mx-auto text-center' href='/user/account#pubication_js_" . $pub_id . "_jheo'>Voir la publication</a>";
                $message_notification = $full_name . " a réagi sur votre publication.<br><a class='d-block btn btn-primary w-70 mt-2 mx-auto text-center' href='/user/account#pubication_js_" . $pub_id . "_jheo'>Voir la publication</a>";
            } else {

                // $message_notification = $full_name . " a supprimé sa réaction sur votre publication.<br><a class='d-block btn btn-primary w-70 mt-2 mx-auto text-center' href='/user/account#pubication_js_" . $pub_id . "_jheo'>Voir la publication</a>";
                $message_notification = $full_name . " a supprimé sa réaction sur votre publication.
                <br>
                <a class='d-block btn btn-primary w-70 mt-2 mx-auto text-center' href='/user/account#pubication_js_" . $pub_id . "_jheo'>
                    Voir la publication
                </a>";
            }

            $notificationService->sendNotificationForOne(

                $this->getUser()->getId(),

                $author_id,

                "Réaction publication.",

                $message_notification

            );
        }



        return $this->json([

            "success" => true,

            "reaction" => $reaction

        ]);
    }



    #[Route("/tributG/publications/comments/fetchall", name: "app_comment")]

    public function fetchAllComments(

        Request $request,

        TributGService $tributGService

    ) {

        $data = json_decode($request->getContent(), true);

        extract($data); ///$publication_id



        $comments = $tributGService->fetchAllPublicationComment(

            $this->getUser()->getId(),

            $publication_id
        );


        return $this->json([

            "success" => true,

            "comments" => $comments

        ]);
    }


    #[Route("/tributG/publications/comment", name: "app_tribut_comment")]

    public function handlePublicationComment(

        Request $request,

        TributGService $tributGService,

        NotificationService $notificationService

    ) {



        $data = json_decode($request->getContent(), true);

        extract($data); /// $author_id, $publication_id , $comment

        if ($comment === null) {
            return $this->json([]);
        }

        $audioname = "";

        $path = $this->getParameter('kernel.project_dir') . '/public/uploads/users/audios/';

        if ($audio != "") {

            $temp = explode(";", $audio);

            $extension = explode("/", $temp[0])[1];

            $audioname = uniqid() . "." . $extension;

            file_put_contents($path . $audioname, file_get_contents($audio));
        }

        $reaction = $tributGService->handlePublicationComment(
            $publication_id,
            $this->getUser()->getId(),
            $comment,
            $audioname
        );

        $full_name = $tributGService->getFullName($this->getUser()->getId());

        if (intval($this->getUser()->getId()) != intval($author_id)) {

            $notificationService->sendNotificationForOne(
                $this->getUser()->getId(),
                $author_id,
                "Comment publication.",
                $full_name . " a commenté votre publication.<br><a class='d-block btn btn-primary w-70 mt-2 mx-auto text-center' href='/user/account#pubication_js_" . $publication_id . "_jheo'>Voir la publication</a>"
            );
        }


        return $this->json(["result" =>  $reaction], 201);
    }


    #[Route("/tributG/publications/{pub_id}/comment/{com_id}/change" , name:"app_tribut_change_comment", methods: "POST")]
    public function handleChangeComment(
        $pub_id,
        $com_id,
        Request $request,
        TributGService $tributGService,
        NotificationService $notificationService
    ){
        $data = json_decode($request->getContent(), true);
        extract($data); /// $publication_id, $comment_id, $comment_text

        $reaction = $tributGService->changeComment(
            $publication_id,
            $comment_id,
            $comment_text,
            $this->getUser()->getId()
        );

        return $this->json(["result" =>  $reaction], 201);
    }


    #[Route("/tribuG/publications/{publication_id}", name:"app_tribuG_publication_by_id" , methods: "GET")]
    public function getPublicationById( 
        $publication_id,
        TributGService $tributGService,
        EntityManagerInterface $entityManager
    ){
        $profil = "";
        $user = $this->getUser();
        $userType = $user->getType();
        $userId = $user->getId();

        if ($userType == "consumer") {
            $profil = $entityManager->getRepository(Consumer::class)->findByUserId($userId);
        } else {
            $profil = $entityManager->getRepository(Supplier::class)->findByUserId($userId);
        }

        $table_tributG_name = $tributGService->getTableNameTributG(
            $this->getUser()->getId()
        );

        $last_pub= $tributGService->getOnePublication($table_tributG_name, intval($publication_id) );
        $next_pubID=  $tributGService->getNextPubID($table_tributG_name . "_publication", intval($last_pub[0]["id"]));
        if( count($last_pub) > 0 ){
            return $this->render("tribu_g/single_publication.html.twig", [
                "pub" => $last_pub[0],
                "profil" => $profil,
                "next_pubID" => $next_pubID
            ]);
        }

        return $this->json(["result" => [], 404 ]);
    }

    #[Route("/tributG/member/list", name: "app_member_tributG")]
    public function fetchListMemberTributG(

        Request $request,

        TributGService $tributGService,

        UserRepository $userRepository,

        UserService $userService

    ) {
        $user_connected = $this->getUser();
        $tributG_name = $tributGService->getTribuGtableForNotif($user_connected->getId());

        $all_user_id_tribug = $tributGService->getAllTributG($tributG_name);
        $memberTributG = [];

        foreach ($all_user_id_tribug as $user_id) {
            $user = $userRepository->find(intval($user_id["user_id"]));

            $single_user = [

                "id" => $user->getId(),

                "email" => $user->getEmail(),

                "firstname" => $userService->getUserFirstName($user->getId()),

                "lastname" => $userService->getUserLastName($user->getId()),

                "status" => $tributGService->getCurrentStatus($tributG_name, $user->getId())

            ];

            array_push($memberTributG, $single_user);
        }



        return $this->render("tribu_g/member_tributG.html.twig", [

            "membersTributG" => $memberTributG

        ]);
    }



    #[Route("/tributG/actualite", name: "app_actualite_tributG")]
    public function fetchAllActualiteTributG(

        TributGService $tributGService,
        EntityManagerInterface $entityManager,
    ) {

        if(!$this->getUser()){
            return $this->render("tribu_g/publications.html.twig", [
                "publications" => [],
            ]); 
        }

        $table_tributG_name = $tributGService->getTableNameTributG($this->getUser()->getId());
        $publications = $tributGService->getAllPublicationsUpdate($table_tributG_name);

        return $this->render("tribu_g/publications.html.twig", [
            "publications" => $publications,
        ]);
    }

    /**
     * @author Jehobanie x modified by Tommy
     * cette route a pour but de charger les photos de la tribu-G
     */
    #[Route("/tributG/photos", name: "app_photos_tributG")]

    public function fetchAllPhotosTributG(
        TributGService $tributGService,
        AgendaService $agendaService,
        UserRepository $userRepository,
        UserService $userService
    ){
        // $table_tributG_name = $tributGService->getTableNameTributG($this->getUser()->getId());
        $table_tributG_name = $tributGService->getTableNameTributG($this->getUser()->getId());

        // dd($tributGService->getAllPhotos($table_tributG_name));

        // $folder = $this->getParameter('kernel.project_dir') . "/public/uploads/tribu_g/photos/".$table_tributG_name."/";
        // $images = glob($folder . '*.{jpg,JPG,jpeg,JPEG,png,PNG,gif,GIF}', GLOB_BRACE);
        // $tabPhoto = [];
        // foreach ($images as $image) {
        //     $photo = explode("uploads/tribu_g",$image)[1];
        //     $photo = "/public/uploads/tribu_g".$photo;
        //     array_push($tabPhoto, ["photo"=>$photo]);
        // }
        $galeryPhotosPub = $tributGService->getAllPublicationBrutes($table_tributG_name);
        $photoDatePub = [];
        for ($i = 0; $i < count($galeryPhotosPub); $i++) {
            array_push($photoDatePub, [
                "photo" => $galeryPhotosPub[$i]["photo"],
                "createdAt" => explode(' ', $galeryPhotosPub[$i]["datetime"])[0]
            ]);
        }
        //get id -> get repo-> get nom table -> get photo 
        $user_connected = $this->getUser();
        $tributG_name = $tributGService->getTribuGtableForNotif($user_connected->getId());
		$photoAgenda = [];
        $all_user_id_tribug = $tributGService->getAllTributG($tributG_name);
		foreach ($all_user_id_tribug as $user_id) {
			$user = $userRepository->find(intval($user_id["user_id"]));
			$table_agenda = $user->getNomTableAgenda();
			$agendas = $agendaService->getOneAgendaPhoto($table_agenda);
			
			for ($a = 0; $a < count($agendas); $a++) {
				array_push($photoAgenda, [
					"photo" => $agendas[$a]["file_path"],
					"photoSplit" =>  explode('/', $agendas[$a]["file_path"]),
					"createdAt" =>  explode(' ', $agendas[$a]["datetime"])[0]
				]);
			}
		}
       
        return $this->render("tribu_g/photos.html.twig", [
            "photosPub" => $photoDatePub,
            "photosAgenda" => $photoAgenda
        ]);
        
        // return $this->render("tribu_g/photos.html.twig", [
        //     "photos" => $tributGService->getAllPhotos($table_tributG_name),
        // ]);
    }



    #[Route("/users/acount/tribuG/changeprofile", name: "app_change_profile_tribuG")]
    public function changeProfileActionTribuG(

        Request $request,

        TributGService $tributGService,
        Filesystem $filesyst

    ) {

        if (!$this->getUser()) {

            return $this->json([

                "error" => "Invalid credentials",

            ], 401);
        }



        $requestContent = json_decode($request->getContent(), true);



        if ($requestContent["image"]) {

            $image = $requestContent["image"];



            $table_name  = $tributGService->getTableNameTributG(

                $this->getUser()->getId()

            );



            ///download image

            $path = $this->getParameter('kernel.project_dir') . '/public/uploads/tribus/photos/';

            $dir_exist = $filesyst->exists($path);

            if ($dir_exist == false) {
    
                $filesyst->mkdir($path, 0777);
            }

            $temp = explode(";", $image);

            $extension = explode("/", $temp[0])[1];

            $image_name = "profile_" . $table_name . "." . $extension;



            ///save image in public/uploader folder

            file_put_contents($path . $image_name, file_get_contents($image));



            ///change database

            $tributGService->changeProfilTribuG(

                $table_name,

                $image_name

            );
        }



        return $this->json([

            "result" => "success"

        ], 201);
    }

    #[Route("/user/acount/tributG/publication/delete", name: "app_delete_pub_tributG", methods: "DELETE")]
    public function deletePublicationAction(
        Request $request,
        TributGService $tributGService,
        UserService $userService,
    ) {
        if (!$this->getUser()) {
            return $this->json(["result" => "Unauthorized"], 401,);
        }
        $data = json_decode($request->getContent(), true);
        extract($data); /// $id_publication

        $user = $this->getUser();

        $result  = $tributGService->deletePublication($user->getId(), $id_publication);

        if (!$result) {
            return $this->json(["result" => "Service Not Found"], 503);
        }

        ///remove the old image in the directory : uploads
        $filesystem = new Filesystem();
        $filesystem->remove($this->getParameter('kernel.project_dir') . '/public/assets/publications/photos/' . $result);

        return $this->json([
            "result" => "sucess",
            "data" => $data
        ], 204);
    }

    #[Route("/user/acount/tributG/publication/update", name: "app_update_pub_tributG", methods: "PUT")]
    public function updatePublicationAction(
        Request $request,
        TributGService $tributGService,
        Filesystem $filesyst
    ) {
        if (!$this->getUser()) {
            return $this->json(["result" => "unauthorized"], 401);
        }

        $userId = $this->getUser()->getId();
        $data = json_decode($request->getContent(), true);
        extract($data); /// $pub_id, $confidentiality, $message

        $isTribuT = explode("_", $table)[0] === "tribu";

        $path = "";
        $imageName = "";
        if(isset($img_data))
            if($img_data != ""){
                $image = $img_data;
                $extension = explode(";", $image)[0];
                $extension = explode("/", $extension)[1];
                $imageName = time() . "_" . $userId . ".". $extension;

                if ($isTribuT) {
                    $path = '/public/uploads/tribu_t/photo/' .  $table . "/";
                } else {
                    $path = '/public/uploads/tribu_g/photo/' .  $table . "/";
                }

                if (!($filesyst->exists($this->getParameter('kernel.project_dir') . $path)))
                    $filesyst->mkdir($this->getParameter('kernel.project_dir') . $path, 0777);
    
                $fileUtils = new FilesUtils();
                
                $fileUtils->uploadImageAjax($this->getParameter('kernel.project_dir') . $path, $image, $imageName);

            }

        $photo = $imageName != "" ? $path.$imageName : null;
        if ($isTribuT) {
            $result = $tributGService->updatePublication($userId, $pub_id, json_encode($message), $confidentiality, $table . "_publication", $photo);
        } else {
            $result = $tributGService->updatePublication($userId, $pub_id, json_encode($message), $confidentiality, null, $photo);
        }
        
        if($photo != null)
            if ($result != "" || $result != null) {
                if (str_contains($result, "/public/")) {
                    $filesyst->remove($this->getParameter('kernel.project_dir') . $result);
                } else {
                    $filesyst->remove($this->getParameter('kernel.project_dir') . '/public' . $result);
                }
            }

        return $this->json([
            "result" => $result,
        ], 204);
    }
    /*public function updatePublicationAction(
        Request $request,
        TributGService $tributGService

    ) {
        if (!$this->getUser()) {
            return $this->json(["result" => "unauthorized"], 401);
        }
        $data = json_decode($request->getContent(), true);
        extract($data); /// $pub_id, $confidentiality, $message

        $user = $this->getUser();

        $result = $tributGService->updatePublication($user->getId(), $pub_id, $message, $confidentiality);

        if (!$result) {
            return $this->json(["result" => "Service Not Found"], 503);
        }

        return $this->json([
            "result" => $result,
        ], 204);
    }*/


    #[Route('/tribu_g/add_photo', name: 'add_photo_tribu_g')]

    public function AddPhotoTribuG(Request $request, TributGService $tributGService, Filesystem $filesyst): Response

    {

        $user = $this->getUser();


        $userId = $user->getId();


        $data = json_decode($request->getContent(), true);

        extract($data);

        $table_tribuG = $tributGService->getTableNameTributG($userId);


        $path = $this->getParameter('kernel.project_dir') . '/public/uploads/tribu_g/photos/' . $table_tribuG . '/';

        //dd($path);


        $dir_exist = $filesyst->exists($path);

        if ($dir_exist == false) {

            $filesyst->mkdir($path, 0777);
        }


        if ($image != "") {

            // Function to write image into file

            $temp = explode(";", $image);

            $extension = explode("/", $temp[0])[1];

            $imagename = md5($table_tribuG) . '-' . uniqid() . "." . $extension;


            ///save image in public/uploader folder

            file_put_contents($path . $imagename, file_get_contents($image));

            /// add database image

            // $tribu_t->createOnePub($table_tribuG, $userId, "", 1, $imagename);

            $tributGService->createOnePub($table_tribuG . "_publication", $userId, "", 1, '/public/uploads/tribu_g/photos/' . $table_tribuG . '/'.$imagename);
        }

        return $this->json("Photo ajouté avec succès");
    }


    #[Route("/tribuG/publication/{pub_id}/comment/{comment_id}/delete", name: "app_tribug_delete_commentaire")]
    public  function deleteCommentOnPublication(
        $pub_id, 
        $comment_id,
        TributGService $tributGService,
    ){
        $table_tributG_name = $tributGService->getTableNameTributG(
            $this->getUser()->getId()
        );

        $last_pub= $tributGService->getOnePublication($table_tributG_name, intval($pub_id) );

        if( $last_pub ){
            $tributGService->deleteOneCommentaire($table_tributG_name, intval($pub_id), intval($comment_id) );
        }

        return $this->json(["status" => "ok"], 200);
    }

    #[Route('/tribu_g/createOnePub', name: 'tribu_g_createOnePub')]

    public function createOnePub(Request $request, TributGService $tributGService, Filesystem $filesyst): Response

    {

        $user = $this->getUser();


        $userId = $user->getId();


        $data = json_decode($request->getContent(), true);

        // extract($data);
        $pub = $data["message"];
        $confid = $data["confid"];
        $image = $data["image64"];
        $imagename = "";

        $table_tribuG = $tributGService->getTableNameTributG($userId);


        $path = $this->getParameter('kernel.project_dir') . '/public/uploads/tribu_g/photos/' . $table_tribuG . '/';

        //dd($path);


        $dir_exist = $filesyst->exists($path);

        if ($dir_exist == false) {

            $filesyst->mkdir($path, 0777);
        }


        if ($image != "") {

            // Function to write image into file

            $temp = explode(";", $image);

            $extension = explode("/", $temp[0])[1];

            $imagename = md5($table_tribuG) . '-' . uniqid() . "." . $extension;

            ///save image in public/uploader folder

            file_put_contents($path . $imagename, file_get_contents($image));

        }

        $tributGService->createOnePub($table_tribuG . "_publication", $userId, $message, $confid, '/public/uploads/tribu_g/photos/' . $table_tribuG . '/'.$imagename);

        // return $this->redirectToRoute('app_account');

        return $this->json("Publication ajouté avec succès");
    }

    #[Route("/user/tribu_g/pastille/resto", name:"tribu_g_pastille_resto", methods:["POST"])]
    public function pastilleRestoForTribuT(Request $resquest, TributGService $tribuGService){

        $jsonParsed=json_decode($resquest->getContent(),true);

        $resto_name =  $jsonParsed["name"];

        $resto_id = $jsonParsed["id"];

        $tribu_g = $jsonParsed["tbl"];

        $isPastilled = $tribuGService->getIdRestoOnTableExtension($tribu_g."_restaurant", $resto_id);

        if(count($isPastilled)<=0){

            $tribuGService->pastilleRestaurant($tribu_g."_restaurant", $resto_name, $resto_id);

        }else{

            $tribuGService->depastilleOrPastilleRestaurant($tribu_g."_restaurant", $resto_id, 1);

        }

        return $this->json(["status"=>"ok","id_resto"=>$resto_id, "table"=>$tribu_g."_restaurant", "resto"=> $resto_name]);
        
        
    }

    #[Route("/user/tribu_g/depastille/resto", name:"tribu_g_depastille_resto", methods:["POST"])]
    public function depastilleRestoForTribuT(Request $resquest, TributGService $tribuGService){

        $jsonParsed=json_decode($resquest->getContent(),true);

        $resto_name =  $jsonParsed["name"];

        $resto_id = $jsonParsed["id"];

        $tribu_g = $jsonParsed["tbl"];

        $tribuGService->depastilleOrPastilleRestaurant($tribu_g."_restaurant", $resto_id, 0);

        return $this->json(["status"=>"ok","id_resto"=>$resto_id, "table"=>$tribu_g."_restaurant", "resto"=> $resto_name]);

        
    }

    #[Route("/user/tribu_g/pastille/golf", name:"tribu_g_pastille_golf", methods:["POST"])]
    public function pastilleGolfForTribuT(Request $resquest, TributGService $tribuGService){

        $jsonParsed=json_decode($resquest->getContent(),true);

        $golf_name =  $jsonParsed["name"];

        $golf_id = $jsonParsed["id"];

        $tribu_g = $jsonParsed["tbl"];

        $isPastilled = $tribuGService->getIdRestoOnTableExtension($tribu_g."_golf", $golf_id);

        if(count($isPastilled)<=0){

            $tribuGService->pastilleRestaurant($tribu_g."_golf", $golf_name, $golf_id);

        }else{

            $tribuGService->depastilleOrPastilleRestaurant($tribu_g."_golf", $golf_id, 1);

        }

        $profil_tribuG= $tribuGService->getProfilTributG($tribu_g, $this->getUser()->getId());

        return $this->json([
            "status"=>"ok",
            "id_golf"=>$golf_id, 
            "table"=>$tribu_g."_golf", 
            "profil_tribuG" =>  [
                "table_name" => $tribu_g, 
                "logo_path" => $profil_tribuG["avatar"], 
                "name_tribu_t_muable" => $profil_tribuG["name"], 
                "isPastilled" => true
            ],
            "golf"=> $golf_name
        ]);
        
        
    }

    #[Route("/user/tribu_g/depastille/golf", name:"tribu_g_depastille_golf", methods:["POST"])]
    public function depastilleGolfForTribuT(
        Request $resquest, 
        TributGService $tribuGService
    ){

        $jsonParsed=json_decode($resquest->getContent(),true);

        $golf_name =  $jsonParsed["name"];

        $golf_id = $jsonParsed["id"];

        $tribu_g = $jsonParsed["tbl"];

        $tribuGService->depastilleOrPastilleRestaurant($tribu_g."_golf", $golf_id, 0);

        $profil_tribuG= $tribuGService->getProfilTributG($tribu_g, $this->getUser()->getId());

        return $this->json([
            "status"=>"ok",
            "id_golf"=>$golf_id, 
            "table"=>$tribu_g."_golf",
            "profil_tribuG" =>  [
                "table_name" => $tribu_g, 
                "logo_path" => $profil_tribuG["avatar"], 
                "name_tribu_t_muable" => $profil_tribuG["name"], 
                "isPastilled" => false
            ],
            "golf"=> $golf_name
        ]);

        
    }

    #[Route("/user/tribu_g/isPastilled/{table}/{golfId}", name:"tribu_g_isPastilled", methods:["GET"])]
    public function isPastilled(
        $table, 
        $golfId, 
        Request $resquest, 
        TributGService $tribuGService
    ){

        $res = $tribuGService->isPastilled($table, $golfId);
        $table_tribuG_name= str_replace("_golf", "", $table);

        $profil_tribuG= $tribuGService->getProfilTributG($table_tribuG_name, $this->getUser()->getId());

        $isPastilled = (count($res)>0) ? true : false;;

        return $this->json([
            "isPastilled" => $isPastilled,
            "profil_tribuG" =>  [
                "table_name" => $table_tribuG_name, 
                "logo_path" => $profil_tribuG["avatar"], 
                "name_tribu_t_muable" => $profil_tribuG["name"], 
                "isPastilled" => false
            ],
            "gold_id" => $golfId
        ]);
    }

    /**
     * @author Elie
     * Fonction fetch resto pastille
     */
    #[Route("/tributG/restaurant", name: "app_restaurant_tributG")]

    public function fetchAllRestoTributG(
        TributGService $tributGService,
    ){
        // $table_tributG_name = $tributGService->getTableNameTributG($this->getUser()->getId());
        $table_tributG_name = $tributGService->getTableNameTributG($this->getUser()->getId());

        // dd($tributGService->getAllRestoTribuG($table_tributG_name));
        // getAllRestoTribuG($table_name)


        return $this->json($tributGService->getRestoPastillesTribuG($table_tributG_name));
    }

    /**
     * @author Elie
     * Fonction fetch resto pastille
     */
    #[Route("/tributG/restaurant/v2", name: "app_restaurant_tributG")]

    public function fetchAllRestoTributGV2(
        TributGService $tributGService,
    ){
        // $table_tributG_name = $tributGService->getTableNameTributG($this->getUser()->getId());
        $table_tributG_name = $tributGService->getTableNameTributG($this->getUser()->getId());

        // dd($tributGService->getAllRestoTribuG($table_tributG_name));
        // getAllRestoTribuG($table_name)


        return $this->json($tributGService->getRestoPastillesTribuGV2($table_tributG_name));
    }

    /**
     * @author Elie
     * Route fetching resto commentaire / avis pastille
     */
    #[Route('/user/comment/tribu-g/restos-pastilles/{table_resto}/{id}', name: 'show_restos_pastilles_t_g_commentaire')]

    public function getRestoPastillesCommentaire($table_resto,$id, TributGService $tributGService): Response

    {

        $tableComment = $table_resto . "_commentaire";

        $srvTribuT = new Tribu_T_Service();

        $has_restaurant = $srvTribuT->hasTableResto($table_resto);

        $restos = array();

        if ($has_restaurant == true) {
            
            $restos = $tributGService->getAllAvisByRestName($tableComment,$id);
        }
        return $this->json($restos);
    }

    #[Route("/update/note-g/resto/pastilled", name: "update_note_g_pastilled_resto", methods: ["POST"])]
    public function up_comment_pastilled_resto(Request $request, Tribu_T_Service $tribuTService) : Response
    {
        $my_id = $this->getUser()->getId();
        $json = json_decode($request->getContent(), true);
        $tableName = $json["tableName"];

        $idRestoComment = strval($json["id"]);

        // $idUser = $json["idUser"];
        $note = $json["note"];
        $commentaire = $json["commentaire"];
        
        $result = $tribuTService->upCommentRestoPastilled($tableName, $note, $commentaire,$idRestoComment, $my_id);
        if ($result) {
            $response = new Response();
            $response->setStatusCode(200);
            return $response;
        } else {
            $response = new Response();
            $response->setStatusCode(500);
            return $response;
        }

    }

    /**
     * @author Elie
     * Fonction fetch resto pastille
     */
    #[Route("/tributG/mon-golf", name: "app_mon_golf_tributG")]

    public function fetchAllGolfTributG(
        TributGService $tributGService,
    ){
        // $table_tributG_name = $tributGService->getTableNameTributG($this->getUser()->getId());
        $table_tributG_name = $tributGService->getTableNameTributG($this->getUser()->getId());

        // dd($tributGService->getAllRestoTribuG($table_tributG_name));
        // getAllRestoTribuG($table_name)


        return $this->json($tributGService->getAllGolfTribuG($table_tributG_name));
    }

    /**
     * @author Elie
     * Fonction fetch resto pastille
     */
    #[Route("/tributG/mon-golf/v2", name: "app_mon_golf_tributG")]

    public function fetchAllGolfTributGV2(
        TributGService $tributGService,
    ){
        // $table_tributG_name = $tributGService->getTableNameTributG($this->getUser()->getId());
        $table_tributG_name = $tributGService->getTableNameTributG($this->getUser()->getId());

        // dd($tributGService->getAllRestoTribuG($table_tributG_name));
        // getAllRestoTribuG($table_name)
        
        $results= $tributGService->getGolfPastillesTribuGV2($table_tributG_name);
        $results=mb_convert_encoding($results, 'UTF-8', 'UTF-8');

        return $this->json($results);
    }

}
