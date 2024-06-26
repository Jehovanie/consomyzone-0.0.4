<?php



namespace App\Controller;

use App\Entity\Consumer;

use App\Entity\Supplier;

use App\Service\UserService;

use App\Service\TributGService;

use App\Repository\UserRepository;

use App\Service\NotificationService;

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



        $reaction = $tributGService->handlePublicationReaction(

            $pub_id,

            $this->getUser()->getId(),

            $is_like

        );



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

    #[Route("/tributG/photos", name: "app_photos_tributG")]

    public function fetchAllPhotosTributG(
        TributGService $tributGService,
    ){
        // $table_tributG_name = $tributGService->getTableNameTributG($this->getUser()->getId());
        $table_tributG_name = $tributGService->getTableNameTributG($this->getUser()->getId());

        // dd($tributGService->getAllPhotos($table_tributG_name));

        $folder = $this->getParameter('kernel.project_dir') . "/public/uploads/tribu_g/photos/".$table_tributG_name."/";
        $images = glob($folder . '*.{jpg,JPG,jpeg,JPEG,png,PNG,gif,GIF}', GLOB_BRACE);
        $tabPhoto = [];
        foreach ($images as $image) {
            $photo = explode("uploads/tribu_g",$image)[1];
            $photo = "/public/uploads/tribu_g".$photo;
            array_push($tabPhoto, ["photo"=>$photo]);
        }

        // dd($tabPhoto);
        // return $this->json($tabPhoto);

        return $this->render("tribu_g/photos.html.twig", [
            "photos" => $tabPhoto
        ]);
        // return $this->render("tribu_g/photos.html.twig", [
        //     "photos" => $tributGService->getAllPhotos($table_tributG_name),
        // ]);
    }



    #[Route("/users/acount/tribuG/changeprofile", name: "app_change_profile_tribuG")]
    public function changeProfileActionTribuG(

        Request $request,

        TributGService $tributGService

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



            $temp = explode(";", $image);

            $extension = explode("/", $temp[0])[1];

            $image_name = "profile_" . $table_name . "." . $extension;



            ///save image in public/uploader folder

            file_put_contents($path . "/" . $image_name, file_get_contents($image));



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
    }


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
}
