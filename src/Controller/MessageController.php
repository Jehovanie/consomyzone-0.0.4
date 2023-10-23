<?php

namespace App\Controller;


use App\Service\Status;
use App\Entity\Consumer;
use App\Entity\Supplier;
use App\Service\JWTService;
use App\Service\JWTService1;
use App\Service\AgendaService;
use App\Service\MessageService;
use App\Service\TributGService;
use App\Service\Tribu_T_Service;
use App\Repository\UserRepository;
use App\Repository\ConsumerRepository;
use App\Repository\SupplierRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class MessageController extends AbstractController
{

    #[Route('/user/message', name: 'app_message')]
    public function amis(
        Request $request,
        EntityManagerInterface $entityManager,
        TributGService $tributGService,
        Tribu_T_Service $tributTService,
        UserRepository $userRepository,
        MessageService $messageService,
        ConsumerRepository $consumerRepository,
        SupplierRepository $supplierRepository,
        Status $status,
    ): Response {
        
        ///check the user connected
        if (!$this->getUser()) {
            return $this->redirectToRoute('app_home');
        }

        ////status user connected --- status on navBar -------------
        $userConnected= $status->userProfilService($this->getUser());
        // dd($userConnected);

        ///current user connected
        $user = $this->getUser();
        $userType = $user->getType();
        $userId = $user->getId();

        // ////profil user connected
        $profil = $tributGService->getProfil($user, $entityManager);

        ///////GET PROFIL THE USER IN SAME TRIBUT G WITH ME////////////////////////////////

        ///get all id the user in the same tribut G for me
        $id_amis_tributG = $tributGService->getAllTributG($userConnected['tableTribuG']);  /// [ ["user_id" => ...], ... ]


        ///to contains profil user information
        $amis_in_tributG = [];
        foreach ($id_amis_tributG  as $id_amis) { /// ["user_id" => ...]
            if( intval($id_amis["user_id"]) !== intval($userId) ){
                ///check their type consumer of supplier
                $user_amis = $userRepository->find(intval($id_amis["user_id"]));

                if($user_amis && $user_amis->getType() != 'Type' && $user_amis->getIsConnected()){
                    $profil_amis = $tributGService->getProfil($user_amis, $entityManager)[0];
                    ///single profil
                    $amis = [
                        "id" => $id_amis["user_id"],
                        "photo" => $profil_amis->getPhotoProfil(),
                        "email" => $user_amis->getEmail(),
                        "firstname" => $profil_amis->getFirstname(),
                        "lastname" => $profil_amis->getLastname(),
                        "image_profil" => $profil_amis->getPhotoProfil(),
                        "last_message" => $messageService->getLastMessage($user->getTablemessage(),$id_amis["user_id"]),
                        "is_online" => $user_amis->getIsConnected(),
                    ];
                    ///get it
                    array_push($amis_in_tributG, $amis);
                }
            }

        }
        ////// PROFIL FOR ALL FINIS ////////////////////////////////// 
        
        $all_tribuT_user= [];
        $all_tribuT= $userRepository->getListTableTribuT();
        foreach($all_tribuT as $tribuT){
            $tribuT['amis'] = [];
            $results=$tributTService->getAllPartisanProfil($tribuT['table_name']);
            foreach($results as $result){
                if( intval($result["user_id"]) !== intval($userId) ){
                    $user_amis = $userRepository->find(intval($result["user_id"]));
                    
                    if($user_amis && $user_amis->getType() != 'Type' && $user_amis->getIsConnected()){
                        $profil_amis = $tributGService->getProfil($user_amis, $entityManager)[0];
                        $amis = [
                            "id" => $result["user_id"],
                            "photo" => $profil_amis->getPhotoProfil(),
                            "email" => $user_amis->getEmail(),
                            "firstname" => $profil_amis->getFirstname(),
                            "lastname" => $profil_amis->getLastname(),
                            "image_profil" => $profil_amis->getPhotoProfil(),
                            "last_message" => $messageService->getLastMessage($user->getTablemessage(),$result["user_id"]),
                            "is_online" => $user_amis->getIsConnected(),
                        ];
                        ///get it
                        array_push($tribuT['amis'] , $amis);
                    }
                }
            }
            array_push($all_tribuT_user, $tribuT);
        }
        //// CHECKS USER TO CHAT //////////////////////////////////

        ///if the is id user from the url 
        if ($request->query->get("user_id")) { /// "1" ...
            $id_user_to_chat = intval($request->query->get("user_id")); /// 1 ...

        } else { /// the user not specified id user  in the url, just to chat box

            if( count($id_amis_tributG) !== 1 ){
                ////get random user in the tributG
                $id_user_to_chat = 0; /// random id user
                while ($id_user_to_chat === 0 || $id_user_to_chat === $user->getId()) {
                    $temp = rand(0, count($id_amis_tributG));
                    $i = 0;
                    foreach ($id_amis_tributG as $id_amis) {
                        if ($i === $temp) {
                            $id_user_to_chat = intval($id_amis["user_id"]);
                            break;
                        }
                        $i++;
                    }
                }
            }else{
                $id_user_to_chat = $user->getId();
            }
        }
        // $id_user_to_chat= 20;


        ///user to chat
        $user_to = $userRepository->find($id_user_to_chat);

        $user_to= $user_to === null ? $user : $user_to;
        //// set show and read all last messages.

        ///befor set show and read all last messages
        $result = $messageService->setShowAndReadMessages($user_to->getId(), $user->getTablemessage());

        ///get the all last messages
        $old_message = $messageService->getAllOldMessage(
            $user_to->getId(),
            $user->getTableMessage()
        );

        foreach ($old_message as &$message) {
            $message["content"] = json_decode($message["content"], true);
        }

        ///profile the user to chat
        // $profil_user_to = $tributGService->getProfil($user_to, $entityManager)[0];

        if($tributGService->getProfil($user_to, $entityManager)){

            $profil_user_to = $tributGService->getProfil($user_to, $entityManager)[0];


            $user_to_profil = [
                "id" => $user_to->getId(),
                "email" => $user_to->getEmail(),
                "photo_profile" => $profil_user_to->getPhotoProfil(),
                "firstname" => $profil_user_to->getFirstname(),
                "lastname" => $profil_user_to->getLastname(),
                "image_profil" => $profil_user_to->getPhotoProfil(),
                "messages" => $old_message,
                "status" => strtoupper($user_to->getType())
            ];

            return $this->render('user/message/amis.html.twig', [
                "userConnected" => $userConnected,
                "profil" => $profil,
                "statusTribut" => $tributGService->getStatusAndIfValid(
                    $profil[0]->getTributg(),
                    $profil[0]->getIsVerifiedTributGAdmin(),
                    $userId
                ),
                "userToProfil" => $user_to_profil,
                "amisTributG" => $amis_in_tributG,
                "allTribuT" => $all_tribuT_user,
                "isInTribut" => $request->query->get("tribuT") ? true : false
            ]);

        }else{
            return $this->redirectToRoute('app_message');
        }

    }


    #[Route('/user/push/message', name: 'app_message_push' , methods: ['POST','GET'])]
    public function pushMessage(
        Request $request,
        UserRepository $userRepository,
        MessageService $messageService,
        Filesystem $filesyst,
        AgendaService $agendaService
    ): Response
    {
        /// get data from front on json format
        $data = json_decode($request->getContent(), true); /// ["from" => ... , "to" => ... ,"message" => ... , "files" => [ ["name" => ..., "type" => ...], ... ] ]
        ///define variables from the key in the array
        extract($data); /// $from , $to , $message, $images
        
        $file_list = [];
        $image_list = [];
        
        ///save all image
        if(count($files) > 0 ){
            
            $path_image = $this->getParameter('kernel.project_dir') . '/public/uploads/messages/';
            $path_files = $this->getParameter('kernel.project_dir') . '/public/uploads/messages/files/';
            
            $dir_image_exist = $filesyst->exists($path_image);
            $dir_files_exist = $filesyst->exists($path_files);

            if ($dir_image_exist == false) {
                $filesyst->mkdir($path_image, 0777);
            }

            if ($dir_files_exist == false) {
                $filesyst->mkdir($path_files, 0777);
            }

            foreach( $files as $file ){
                extract($file); /// $type, $name

                // Function to write image into file
                $temp = explode(";", $name );
                $extension = explode("/", $temp[0])[1];
                $file_name =  str_replace("." , "_" , uniqid("image_", true)). "_from_". $from . "_to_" . $to . "." . $extension;

                if( $file['type'] === 'image'){
                    file_put_contents($path_image . $file_name, file_get_contents($name));
                    array_push($image_list, "/public/uploads/messages/". $file_name);

                }else if( $file['type'] === 'file'){
                    file_put_contents($path_files . $file_name, file_get_contents($name));
                    array_push($file_list, "/public/uploads/messages/files/". $file_name);
                }
                ///save image in public/uploader folder
            }
        }

        if(count($file_list) > 0 || count($image_list) > 0 ){
            $type= "object";
        }else{
            $type= "text";
        }

        if(isset($dataInfos)){
            foreach ($dataInfos as $key) {
                $result = $messageService->sendMessageForOne($key["from_id"], $key["to_id"], json_encode([ "text" => $message, "images" => $image_list, "files" => $file_list ]),$type);
                $agendaID = $key["agendaId"];
                $from_id=$key["from_id"];
                $to_id=$key["to_id"];

                if(!is_null($to_id)){
                    $table_agenda_partage_name="partage_agenda_".$this->getUser()->getId();
                    $agendaService->setPartageAgenda($table_agenda_partage_name, $agendaID, ["userId"=>$to_id]);
                }
            }
        }else{
            $result = $messageService->sendMessageForOne($from, $to, json_encode([ "text" => $message, "images" => $image_list, "files" => $file_list ]),$type); /// [ ["last_id_message" => .. ] ]
        }
        return $this->json([
           "id" => $result[0]["last_id_message"]
        ]);
    }

    #[Route('/user/show/nbrMessageNotShow', name:"app_nbr_message_not_show_sse")]
    public function showMessage(
        Request $request,
        UserRepository $userRepository,
        MessageService $messageService,
    )
    {
        /// SHOW THE NUMBER OF MESSAGES IN THE BADGE ////////////////////////////////////////////////////
        $nbr_msg_not_show = $messageService->getNumberMessageNotShow(
            $this->getUser()->getTablemessage()
        ); // [ ["not_show" => ... ]]

        $result = $nbr_msg_not_show["not_show"]; // ...
       
        /// send event to the client
        $response = new StreamedResponse();
        $response->setCallback(function () use (&$result) { /// send result

            echo "data:" . json_encode($result) .  "\n\n";
            ob_end_flush();
            flush();
        });
        
        /// setting the header
        $response->headers->set('Access-Control-Allow-Origin', '*');
        $response->headers->set('Access-Control-Allow-Headers', 'origin, content-type, accept');
        $response->headers->set('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, PATCH, OPTIONS');
        $response->headers->set('Cache-Control', 'no-cache');
        $response->headers->set('Content-Type', 'text/event-stream');

        return $response;
    }

    #[Route('/user/setshow/messages', name:"app_setshow_messages")]
    public function setShowMessagesAction(
        Request $request,
        UserRepository $userRepository,
        MessageService $messageService,
    )
    {
        //// SET SHOW ALL MESSAGES //////////////////////////////////
        $user = $this->getUser();///current user

        ///service set show all messages
        $messageService->setShowMessageAction($user->getTablemessage());

        ///return success message
        return $this->json([
            "success" => true
        ]);
    }
 
    #[Route("/user/show/message", name:"app_show_message_sse")]
    public function getMessage(
        Request $request,
        UserRepository $userRepository,
        MessageService $messageService,
        ConsumerRepository $consumerRepository,
        SupplierRepository $supplierRepository
    )
    {
        /// GET THE LAST MESSAGE FOR ALL USER

        ///last message for each user
        $all_message = $messageService->getMessageForEveryUser(
            $this->getUser()->getTablemessage()
        );
        ///last message for each user and their profil .
        $results = [];
        foreach ( $all_message as $message ){
            ///get id user post the message
            $id_user_send_message = $message[0]["user_post"];

            ///find the user by their id
            $user = $userRepository->find(intval($id_user_send_message));

            ///their profile
            if( $user->getType() == "consumer"){
                $profil_user_send_message = $consumerRepository->findOneBy(["userId" => intval($id_user_send_message)]);
            }else{
                $profil_user_send_message = $supplierRepository->findOneBy(["userId" => intval($id_user_send_message)]);
            }

            ///format single profil with message
            $result = [
                "firstname" => $profil_user_send_message->getFirstName(),
                "lastname" => $profil_user_send_message->getLastname(),
                "profil" => $profil_user_send_message->getPhotoProfil(),
                "message" => $message[0]
            ];

            //// push in the results
            array_push($results, $result);
        }
        /// send ssevent
        $response = new StreamedResponse();
        $response->setCallback(function () use (&$results) {

            echo "data:" . json_encode($results) .  "\n\n";
            ob_end_flush();
            flush();
        });
        
        $response->headers->set('Access-Control-Allow-Origin', '*');
        $response->headers->set('Access-Control-Allow-Headers', 'origin, content-type, accept');
        $response->headers->set('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, PATCH, OPTIONS');
        $response->headers->set('Cache-Control', 'no-cache');
        $response->headers->set('Content-Type', 'text/event-stream');

        return $response;
    }


    #[Route('/user/read/message', name: 'app_message_read_sse')]
    public function readMessage(
        Request $request,
        MessageService $messageService,
    )
    {

        //// SEND MESSAGE EVENT IN SSE

        /// user to chat
        $id_to = $request->get("id");
        
        /// current user
        $user = $this->getUser();

        /// my table name
        $user_tablemessage = $user->getTablemessage();

        //// get all my messages with other id  $id_to
        $message = $messageService->getAllOldMessage(intval($id_to), $user_tablemessage);


        //// send SSE event
        $response = new StreamedResponse();
        $response->setCallback(function () use (&$message) {

            echo "data:" . json_encode($message) .  "\n\n";
            ob_end_flush();
            flush();
        });
        
        $response->headers->set('Access-Control-Allow-Origin', '*');
        $response->headers->set('Access-Control-Allow-Headers', 'origin, content-type, accept');
        $response->headers->set('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, PATCH, OPTIONS');
        $response->headers->set('Cache-Control', 'no-cache');
        $response->headers->set('Content-Type', 'text/event-stream');

        return $response;

    }


    #[Route("/user/show-read/message", name: 'app_message_show_read_ajax', methods: ["POST"])]
    public function setShowAndReadMessages(
        Request $request,
        UserRepository $userRepository,
        MessageService $messageService,
    )
    {
        //// SET SHOW AND READ MESSAGES //////////////////////////////////
        $data = json_decode($request->getContent(), true);
        extract($data);
        $user = $this->getUser();
        $messageService->setShowAndReadMessages(intval($other_id), $user->getTablemessage());

        return $this->json([
            "success" => true,
        ]);
    }

    #[Route('/user/message/group', name: 'app_message_group')]
    public function group(): Response
    {
        return $this->render('user/message/group.html.twig', [
            'controller_name' => 'MessageController',
        ]);
    }

    #[Route('/user/message/{user_id}', name: 'app_message_user')]
    public function getMessageUser(MessageService $messageService, $user_id): Response
    {
        $user = $this->getUser();

        $table_message = $user->getTablemessage();

        $messages = $messageService->getAllOldMessage($user_id, $table_message);

        return $this->json($messages);
    }

    #[Route('/create/visio', name: 'app_new_visio')]
    public function createVisio(Request $request, MessageService $messageService, ConsumerRepository $consumerRepository,
    SupplierRepository $supplierRepository): Response
    {
        $user = $this->getUser();
        
        if( $user->getType() == "consumer"){
            $profil = $consumerRepository->findOneBy(["userId" => intval($user->getId())]);
        }else{
            $profil = $supplierRepository->findOneBy(["userId" => intval($user->getId())]);
        }

        $data = json_decode($request->getContent(), true);

        extract($data);

        $username = $profil->getFirstname()." ".$profil->getLastname();

        $messageService->createVisio($user->getId(), $to, $username, $roomName, $status);

        return $this->json([
            "success" => true
        ]);

    }

    #[Route('/get/myvisio', name: 'app_get_visio')]
    public function getVisio(MessageService $messageService): Response
    {

        $user = $this->getUser();
        
        $visio_all = $messageService->getVisio($user->getId());

        //// send SSE event
        $response = new StreamedResponse();
        $response->setCallback(function () use (&$visio_all) {

            echo "data:" . json_encode($visio_all) .  "\n\n";
            ob_end_flush();
            flush();
        });
        
        $response->headers->set('Access-Control-Allow-Origin', '*');
        $response->headers->set('Access-Control-Allow-Headers', 'origin, content-type, accept');
        $response->headers->set('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, PATCH, OPTIONS');
        $response->headers->set('Cache-Control', 'no-cache');
        $response->headers->set('Content-Type', 'text/event-stream');

        return $response;
    }

    #[Route('/update/visio/{id}/{status}', name: 'app_update_by_id_visio')]
    public function updateVisioById($id, $status, MessageService $messageService): Response
    {

        $messageService->updateVisioById($id, $status);

        return $this->json([
            "success" => true
        ]);
       
    }


    #[Route('/getVisioById/{id}', name: 'app_getVisioById')]
    public function getVisioById($id,MessageService $messageService): Response
    {

        $visio = $messageService->getVisioById($id);

        return $this->json($visio);
       
    }

    #[Route('/getVisioByName/{name}', name: 'app_getVisioByName')]
    public function getVisioByName($name,MessageService $messageService): Response
    {

        $visio = $messageService->getVisioByName($name);

        return $this->json($visio);
       
    }

    #[Route('/getJWTToken', name:'app_get_token_jwt')]
    public function getJWTToken(JWTService $jwt_service):Response
    {

        $API_KEY="vpaas-magic-cookie-6c87c9ecce8b4ccda30af3591dc24b54/60edf0";
        $APP_ID="vpaas-magic-cookie-6c87c9ecce8b4ccda30af3591dc24b54"; // Your AppID (previously tenant)
        $USER_EMAIL="";
        $USER_NAME="";
        $USER_IS_MODERATOR=false;
        $USER_AVATAR_URL="";
        $USER_ID="google-oauth2|118304592490975962975";
        $LIVESTREAMING_IS_ENABLED=true;
        $RECORDING_IS_ENABLED=true;
        $OUTBOUND_IS_ENABLED=false;
        $TRANSCRIPTION_IS_ENABLED=false;
        $EXP_DELAY_SEC=31104000; // un an
        $NBF_DELAY_SEC=0;

        $fp = fopen("jwt_key.pk", "r");
        $privKey = fread($fp, 8192);
        fclose($fp);

        $PRIVATE_KEY = openssl_get_privatekey($privKey, 'consomyzone');

        $token = $jwt_service->create_jaas_token($API_KEY,
                                    $APP_ID,
                                    $USER_EMAIL,
                                    $USER_NAME,
                                    $USER_IS_MODERATOR,
                                    $USER_AVATAR_URL,
                                    $USER_ID,
                                    $LIVESTREAMING_IS_ENABLED,
                                    $RECORDING_IS_ENABLED,
                                    $OUTBOUND_IS_ENABLED,
                                    $TRANSCRIPTION_IS_ENABLED,
                                    $EXP_DELAY_SEC,
                                    $NBF_DELAY_SEC,
                                    $PRIVATE_KEY);

        /// This writes the jwt to standard output
    
        return $this->json($token);
    }

    #[Route('/update/oneMessage/{id}', name: 'app_update_by_id_message')]
    public function updateOneMessageById($id, MessageService $messageService, Request $request): Response
    {

        $user = $this->getUser();

        $table_message = $user->getTablemessage();

        $msg = $messageService->getOneMessage($table_message,$id);

        $messageService->updateOneMessageById($id, $table_message, $request->getContent());

        return $this->json([
            "success" => true
        ]);
       
    }

}
