<?php

namespace App\Controller;

use App\Entity\Consumer;
use App\Entity\Supplier;
use App\Service\MessageService;
use App\Service\TributGService;
use App\Repository\UserRepository;
use App\Repository\ConsumerRepository;
use App\Repository\SupplierRepository;
use Doctrine\ORM\EntityManagerInterface;
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
        UserRepository $userRepository,
        MessageService $messageService,
        ConsumerRepository $consumerRepository,
        SupplierRepository $supplierRepository,
    ): Response
    {
        ///check the user connected
        if(!$this->getUser()){
            return $this->redirectToRoute('app_home');
        }

        ///current user connected
        $user= $this->getUser();
        $userType = $user->getType();
        $userId = $user->getId();

        // ////profil user connected
        $profil = $tributGService->getProfil($user, $entityManager);


        ///////GET PROFIL THE USER IN SAME TRIBUT G WITH ME////////////////////////////////

        ///get all id the user in the same tribut G for me
        $id_amis_tributG = $tributGService->getAllTributG($profil[0]->getTributG());  /// [ ["user_id" => ...], ... ]

        ///to contains profil user information
        $amis_in_tributG = [];
        foreach($id_amis_tributG  as $id_amis){ /// ["user_id" => ...]

            ///check their type consumer of supplier
            $user_amis = $userRepository->find(intval($id_amis["user_id"]));
            $profil_amis = $tributGService->getProfil($user_amis, $entityManager)[0];
            ///single profil
            $amis = [
                "id" => $id_amis["user_id"],
                "photo" => $profil_amis->getPhotoProfil(),
                "email" => $user_amis->getEmail(),
                "firstname" => $profil_amis->getFirstname(),
                "lastname" => $profil_amis->getLastname(),
                "image_profil" => $profil_amis->getPhotoProfil(),
            ];

            ///get it
            array_push($amis_in_tributG, $amis);
        }

        ////// PROFIL FOR ALL FINIS ////////////////////////////////// 


        //// CHECKS USER TO CHAT //////////////////////////////////

        ///if the is id user from the url 
        if($request->query->get("user_id")){ /// "1" ...
            $id_user_to_chat = intval($request->query->get("user_id")); /// 1 ...

        }else{ /// the user not specified id user  in the url, just to chat box

            ////get random user in the tributG
            if(  count($id_amis_tributG) > 1 ){
                $id_user_to_chat = 0; /// random id user
                while( $id_user_to_chat === 0 || $id_user_to_chat == $user->getId() ){
                    $temp = rand(0, count($id_amis_tributG));
                    $i=0;
                    foreach($id_amis_tributG as $id_amis){
                        if( $i === $temp){
                            $id_user_to_chat = intval($id_amis["user_id"]);
                            break;
                        }
                        $i++;
                    }
                }
            }else{
                $id_user_to_chat= $user->getId();
            }
            // dd($id_user_to_chat);
        }

        ///user to chat
        $user_to = $userRepository->find($id_user_to_chat);
        //// set show and read all last messages.

        ///befor set show and read all last messages
        $result = $messageService->setShowAndReadMessages($user_to->getId(), $user->getTablemessage());

        ///get the all last messages
        $old_message = $messageService->getAllOldMessage(
            $user_to->getId(),
            $user->getTableMessage()
        );

        foreach ( $old_message as &$message ) {
            $message["content"] = json_decode($message["content"], true);
        }
        
        ///profile the user to chat
        $profil_user_to = $tributGService->getProfil($user_to, $entityManager)[0];

        $user_to_profil = [
            "id" => $user_to->getId(),
            "email" => $user_to->getEmail(),
            "photo_profile" => $profil_user_to->getPhotoProfil(),
            "firstname" => $profil_user_to->getFirstname(),
            "lastname" => $profil_user_to->getLastname(),
            "image_profil" => $profil_user_to->getPhotoProfil(),
            "message" => $old_message
        ];


        return $this->render('user/message/amis.html.twig', [
            "profil" => $profil,
            "statusTribut" => $tributGService->getStatusAndIfValid(
                $profil[0]->getTributg(),
                $profil[0]->getIsVerifiedTributGAdmin(),
                $userId
            ),
            "userToProfil" => $user_to_profil,
            "amisTributG" => $amis_in_tributG,
        ]);
    }


    #[Route('/user/push/message', name: 'app_message_push' , methods: ['POST'])]
    public function pushMessage(
        Request $request,
        UserRepository $userRepository,
        MessageService $messageService,

    ): Response
    {
        /// get data from front on json format
        $data = json_decode($request->getContent(), true); /// ["from" => ... , "to" => ... ,"message" => ... , "images" => [] ]
        ///define variables from the key in the array
        extract($data); /// $from , $to , $message, $images
        
        $image_lists = [];
        ///save all image
        if(count($images) > 0 ){
            
            $path = $this->getParameter('kernel.project_dir') . '/public/uploads/messages/';
            
            $dir_exist = $filesyst->exists($path);
            if ($dir_exist == false) {
                $filesyst->mkdir($path, 0777);
            }

            foreach( $images as $image ){
                // Function to write image into file
                $temp = explode(";", $image );
                $extension = explode("/", $temp[0])[1];
                $image_name =  str_replace("." , "_" , uniqid("image_", true)). "_from_". $from . "_to_" . $to . "." . $extension;
                ///save image in public/uploader folder
                file_put_contents($path ."/". $image_name, file_get_contents($image));
                
                array_push($image_lists, $image_name);
            }
        }

        ///persist message data and return the last id form their table
        $result = $messageService->sendMessageForOne($from, $to, json_encode([ "text" => $message, "images" => $image_lists ])); /// [ ["last_id_message" => .. ] ]

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
        $result = $nbr_msg_not_show[0]["not_show"]; // ...
       
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

}
