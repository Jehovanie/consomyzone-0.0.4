<?php

namespace App\Controller;


use App\Entity\User;
use App\Service\Status;
use App\Entity\Consumer;
use App\Entity\Supplier;
use App\Service\JWTService;
use App\Service\JWTService1;
use App\Service\MailService;
use App\Service\UserService;
use App\Service\AgendaService;
use App\Service\MessageService;
use App\Service\TributGService;
use App\Service\Tribu_T_Service;
use App\Repository\UserRepository;
use App\Service\NotificationService;
use App\Repository\ConsumerRepository;
use App\Repository\SupplierRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class MessageController extends AbstractController
{

    private function decryptData($encryptedData, $iv){
      
       $decryptedData = openssl_decrypt($encryptedData, $_ENV["DECRYPTIONMETHOD"], $_ENV["SECRET"], 0, $iv);
        return $decryptedData;
    }

    #[Route("/user/tribu/msg", name:"app_tribu_g_message",methods:['GET'])]
    public function renderMessageTribu(
        Request $request,
        TributGservice $tributGService,
        Tribu_T_Service $tributTService,
        UserRepository $userRepository,
        MessageService $messageService,
        ConsumerRepository $consumerRepository,
        SupplierRepository $supplierRepository,
        Status $status,
        UserService $userService

    ){
        ///check the user connected
        if (!$this->getUser()) {
            return $this->redirectToRoute('app_home');
        }
        $userConnected = $status->userProfilService($this->getUser());
        $user = $this->getUser();
        $userType = $user->getType();
        $userId = $user->getId();
         
       
        $all_tribuT = $userRepository->getListTableTribuT();

        $tribuG=$userConnected;
        $tribuG["name"]= "tribu G ".$tribuG["commune"]." ". $tribuG["quartier"];
        
        $tribuTSelected=[];
       
        $type=$request->query->get('type');
        $isT=1;
        $groupSendTo="";
        switch($type){
            case ('t'):{
                //TODO get All message of tribu T concerned
                $tableName=$request->query->get('name');
                $groupSendTo=$tableName;
                $allMessage=$tributTService->getMessageGRP($tableName);
                foreach($allMessage as &$message){
                    $iv=$tributGService->getIv($groupSendTo,$message["id_msg"])[0]["iv"];
                    $decryptedData=$this->decryptData($message["msg"],$iv);
                    $decryptedImages=$this->decryptData($message["images"],$iv);
                    $decryptedFiles=$this->decryptData($message["files"],$iv);
                    $message["msg"]= $decryptedData != false ? $decryptedData : json_decode($message["msg"],true);
                    $message["images"]= $decryptedImages != false ? json_decode($decryptedImages,true): json_decode($message["images"],true);
                    $message["files"]= $decryptedFiles !=false ?   json_decode($decryptedFiles,true) : json_decode($message["files"],true);
                }
                foreach($all_tribuT as $tribut){
                     if($tribut["table_name"] ==$tableName)
                        $tribuTSelected=$tribut;
                }
                $isT=1;
                break;
            }
            case ('g'):{
                //TODO get All message of tribu g concerned
                $groupSendTo=$tribuG["tableTribuG"];
                $isT=0;
                $tableName=$request->query->get('name');
                $allMessage=$tributGService->getMessageGRP($tableName);
                if(count($allMessage)>0)
                    $tribuG["last_message"]=$allMessage[0];
                else
                    $tribuG["last_message"]=[];
                foreach($allMessage as &$message){
                    $iv=$tributGService->getIv($groupSendTo,$message["id_msg"])[0]["iv"];
                    $decryptedData=$this->decryptData($message["msg"],$iv);
                    $decryptedImages=$this->decryptData($message["images"],$iv);
                    $decryptedFiles=$this->decryptData($message["files"],$iv);
                    $message["msg"]= $decryptedData != false ? $decryptedData : json_decode($message["msg"],true);
                    $message["images"]= $decryptedImages != false ? json_decode($decryptedImages,true): json_decode($message["images"],true);
                    $message["files"]= $decryptedFiles !=false ?   json_decode($decryptedFiles,true) : json_decode($message["files"],true);
                }
                break;
            }
            default:{

            }
        } 

        //dump($allMessage);
        // $tribuG["last_message"]=$allMessage[0];
        return $this->render("user/message/mgs_grp_tribu.html.twig",[
            "group_send_to"=>$groupSendTo,
            "isT"=> $isT,
            "userConnected" => $userConnected,
            "tribusG" => $tribuG,
            "tribuT" => $all_tribuT,
            "tribuTSelected"=>$tribuTSelected,
            "allMessage"=>$allMessage,
            "type"=>$type
        ]);
        

    }

    #[Route("/user/pushMessage/T", name:"app_user_push_message_grp_T", methods:["POST","GET"])]
    public function pushMessageGrpT(
        Request $request,
        Tribu_T_Service $tributTService,
        Filesystem $filesyst, 
        UserRepository $userRepository,
        UserService $userService,
        NotificationService $notificationService,
        UrlGeneratorInterface $urlGenerator,
        MailService $mailService
    ){
        if (!$this->getUser()) {
            return $this->redirectToRoute('app_home');
        }
        
        $user = $this->getUser();
        $userType = $user->getType();
        $userId = $user->getId();

        $content=json_decode($request->getContent(),true);
        extract($content);

        $file_list = [];
        $image_list = [];

        if(count($files) > 0 ){
            $path_image = $this->getParameter('kernel.project_dir') . "/public/uploads/messages_grp_".$receiver."/";
            $path_files = $this->getParameter('kernel.project_dir') . "/public/uploads/messages_grp_".$receiver."/files/";
            
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
                $file_name =  str_replace("." , "_" , uniqid("image_", true)). "_from_". $userId . "_to_" . $receiver . "." . $extension;

                if( $file['type'] === 'image'){
                    file_put_contents($path_image . $file_name, file_get_contents($name));
                    array_push($image_list,"/public/uploads/messages_grp_".$receiver."/". $file_name);

                }else if( $file['type'] === 'file'){
                    file_put_contents($path_files . $file_name, file_get_contents($name));
                    array_push($file_list, "/public/uploads/messages_grp_".$receiver."/files/". $file_name);
                }
                ///save image in public/uploader folder
            }

        }
        
        $result= $tributTService->sendMessageGroupe($message,  
        $file_list , $image_list, $userId, 
        0, 1, 0,$receiver,$userRepository,$userService,$notificationService);

        /** Email for data infos boucle for user not connected 
         * Edited by Elie
        */

        $my_full_name =  $userService->getFullName($this->getUser()->getId());

        $tableTribuTName = $receiver;

        $partisans = $tributTService->getPartisanOfTribuT($tableTribuTName);

        // dump($content);

        if(count($partisans) > 0 ){

            foreach($partisans as $usr){

                $to_id = $usr["user_id"];

                if($to_id != $this->getUser()->getId()){

                    $status_friend = intval(($userService->getLastActivity($to_id))["@status"]);

                    $profil_friend = $userRepository->findOneBy(['id'=>$to_id]);
            
                    $name_friend = $userService->getFullName($to_id);
            
                    $email_friend = $profil_friend->getEmail();
            
                    $url_redirect = $urlGenerator->generate('app_tribu_g_message', ["name"=>$tableTribuTName, "type"=>"t"], UrlGeneratorInterface::ABSOLUTE_URL);
            
                    //send email for parisan not connected
                    if($status_friend == 0 || $profil_friend->getIsConnected() == 0 || $profil_friend->getIsConnected() == false){
            
                        $obj_mail = $my_full_name. " vous a envoyé un message sur ConsoMyZone";
                    
                        $mailService->sendEmailForMessage($email_friend, $name_friend, $obj_mail, $my_full_name, $url_redirect);
            
                    }

                }

            }
        }

        /** End Elie */

        // return $this->json(array("ok"=>"ok"));

        
        return $this->json([
            "id" => $result[0]["last_id_message"]
        ]);
    }
    #[Route("/user/pushMessage/G", name:"app_user_push_message_grp", methods:["POST","GET"])]
    public function pushMessageGrp(
        Request $request,
        TributGService $tributGService,
        Filesystem $filesyst,
        UserRepository $userRepository,
        UserService $userService,
        NotificationService $notificationService,
        UrlGeneratorInterface $urlGenerator,
        MailService $mailService
    ){
        if (!$this->getUser()) {
            return $this->redirectToRoute('app_home');
        }
        
        $user = $this->getUser();
        $userType = $user->getType();
        $userId = $user->getId();

        $content=json_decode($request->getContent(),true);
        extract($content);

        $file_list = [];
        $image_list = [];

        if(count($files) > 0 ){
            $path_image = $this->getParameter('kernel.project_dir') . "/public/uploads/messages_grp_".$receiver."/";
            $path_files = $this->getParameter('kernel.project_dir') . "/public/uploads/messages_grp_".$receiver."/files/";
            
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
                $file_name =  str_replace("." , "_" , uniqid("image_", true)). "_from_". $userId . "_to_" . $receiver . "." . $extension;

                if( $file['type'] === 'image'){
                    file_put_contents($path_image . $file_name, file_get_contents($name));
                    array_push($image_list,"/public/uploads/messages_grp_".$receiver."/". $file_name);

                }else if( $file['type'] === 'file'){
                    file_put_contents($path_files . $file_name, file_get_contents($name));
                    array_push($file_list, "/public/uploads/messages_grp_".$receiver."/files/". $file_name);
                }
                ///save image in public/uploader folder
            }

        }

        $result= $tributGService->sendMessageGroupe($message,  $file_list , $image_list, 
                $userId, 0, 1, 0,$receiver,$userRepository,$userService,$notificationService);

        /** Email for data infos boucle for user not connected 
         * Edited by Elie
        */

        $my_full_name =  $userService->getFullName($this->getUser()->getId());

        $tableTribuTName = $receiver;

        $partisans = $tributGService->getAllTributG($tableTribuTName);

        // dump($partisans);

        if(count($partisans) > 0 ){

            foreach($partisans as $usr){

                $to_id = $usr["user_id"];

                if($to_id != $this->getUser()->getId()){

                    $status_friend = intval(($userService->getLastActivity($to_id))["@status"]);

                    $profil_friend = $userRepository->findOneBy(['id'=>$to_id]);
            
                    $name_friend = $userService->getFullName($to_id);
            
                    $email_friend = $profil_friend->getEmail();
            
                    $url_redirect = $urlGenerator->generate('app_tribu_g_message', ["name"=>$tableTribuTName, "type"=>"g"], UrlGeneratorInterface::ABSOLUTE_URL);
            
                    //send email for parisan not connected
                    if($status_friend == 0 || $profil_friend->getIsConnected() == 0 || $profil_friend->getIsConnected() == false){
            
                        $obj_mail = $my_full_name. " vous a envoyé un message sur ConsoMyZone";
                    
                        $mailService->sendEmailForMessage($email_friend, $name_friend, $obj_mail, $my_full_name, $url_redirect);
            
                    }
                }
                
            }
        }

        /** End Elie */

        // return $this->json(array("ok"=>"ok"));

        return $this->json([
            "id" => $result[0]["last_id_message"]
         ]);
    }

    #[Route("/user/get/allTribu", name:"app_user_get_all_tribu")]
    public function getMyAllTribu(
        Request $request,
        EntityManagerInterface $entityManager,
        TributGService $tributGService,
        Tribu_T_Service $tributTService,
        UserRepository $userRepository,
        MessageService $messageService,
        ConsumerRepository $consumerRepository,
        SupplierRepository $supplierRepository,
        Status $status,
        UserService $userService
    ){
        if (!$this->getUser()) {
            return $this->redirectToRoute('app_home');
        }

         ////status user connected --- status on navBar -------------
         $userConnected = $status->userProfilService($this->getUser());
         // dd($userConnected);
 
         ///current user connected
         $user = $this->getUser();
         $userType = $user->getType();
         $userId = $user->getId();
         
         $myTribuG=$userConnected;

         $all_tribuT = $userRepository->getListTableTribuT();

         $response=array(0=>$myTribuG,1=> $all_tribuT) ;
         return $this->json($response);
 
    }
    #[Route('/user/get/allfans', name:"app_user_get_all_friend_fan")]
    public function getAllFriendFan(
        Request $request,
        EntityManagerInterface $entityManager,
        TributGService $tributGService,
        Tribu_T_Service $tributTService,
        UserRepository $userRepository,
        MessageService $messageService,
        ConsumerRepository $consumerRepository,
        SupplierRepository $supplierRepository,
        Status $status,
        UserService $userService
    ){
       
        ///check the user connected
        if (!$this->getUser()) {
            return $this->redirectToRoute('app_home');
        }

        ////status user connected --- status on navBar -------------
        $userConnected = $status->userProfilService($this->getUser());
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
            if (intval($id_amis["user_id"]) !== intval($userId)) {
                ///check their type consumer of supplier
                $user_amis = $userRepository->find(intval($id_amis["user_id"]));
                $isActive = intval(($userService->getLastActivity($id_amis["user_id"]))["@status"]);
                // if( $user_amis && boolval($isActive)){
                if($tributGService->getProfil($user_amis, $entityManager)){
                    $profil_amis = $tributGService->getProfil($user_amis, $entityManager)[0];
                    ///single profil
                    $amis = [
                        "my_id" => $userId,
                        "id" => $id_amis["user_id"],
                        "photo" => $profil_amis->getPhotoProfil(),
                        "email" => $user_amis->getEmail(),
                        "firstname" => $profil_amis->getFirstname(),
                        "lastname" => $profil_amis->getLastname(),
                        "image_profil" => $profil_amis->getPhotoProfil(),
                        "last_message" => $messageService->getLastMessage($user->getTablemessage(), $id_amis["user_id"]),
                        "is_online" => $isActive
                    ];
                    ///get it
                    array_push($amis_in_tributG, $amis);
                }
            }
        }
        ////// PROFIL FOR ALL FINIS ////////////////////////////////// 

        $all_tribuT_user = [];
        $all_tribuT = $userRepository->getListTableTribuT();
        foreach ($all_tribuT as $tribuT) {
            $tribuT['amis'] = [];
            $results = $tributTService->getAllPartisanProfil($tribuT['table_name']);
            foreach ($results as $result) {
                if (intval($result["user_id"]) !== intval($userId)) {
                    $user_amis = $userRepository->find(intval($result["user_id"]));
                    $isActive = intval(($userService->getLastActivity($result["user_id"]))["@status"]);
                    //dd($result["user_id"]);
                    // if( $user_amis && boolval($isActive)){
                    if($tributGService->getProfil($user_amis, $entityManager)){
                        $profil_amis = $tributGService->getProfil($user_amis, $entityManager)[0];
                        $amis = [
                            "my_id" => $userId,
                            "id" => $result["user_id"],
                            "photo" => $profil_amis->getPhotoProfil(),
                            "email" => $user_amis->getEmail(),
                            "firstname" => $profil_amis->getFirstname(),
                            "lastname" => $profil_amis->getLastname(),
                            "image_profil" => $profil_amis->getPhotoProfil(),
                            "last_message" => $messageService->getLastMessage($user->getTablemessage(), $result["user_id"]),
                            "is_online" => $isActive,
                        ];
                        ///get it
                        array_push($tribuT['amis'], $amis);
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

            if (count($id_amis_tributG) !== 1) {
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
            } else {
                $id_user_to_chat = $user->getId();
            }
        }
        // $id_user_to_chat= 20;


        ///user to chat
        $user_to = $userRepository->find($id_user_to_chat);
        $user_to = $user_to === null ? $user : $user_to;
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

        // return $this->render('user/message/liste_amis_connected.html.twig', [
        //     "userConnected" => $userConnected,
        //     "profil" => $profil,
        //     "statusTribut" => $tributGService->getStatusAndIfValid(
        //         $profil[0]->getTributg(),
        //         $profil[0]->getIsVerifiedTributGAdmin(),
        //         $userId
        //     ),
        //     "userToProfil" => $user_to_profil,
        //     "amisTributG" => $amis_in_tributG,
        //     "allTribuT" => $all_tribuT_user,
        //     //"isInTribut" => $request->query->get("tribuT") ? true : false
        // ]);
        $response=array(0=>$all_tribuT_user,1=> $amis_in_tributG) ;
        return $this->json($response);
    }
    #[Route('/user/get/fan/online', name:"app_user_get_online")]
    public function getFanOnline(
        Request $request,
        EntityManagerInterface $entityManager,
        TributGService $tributGService,
        Tribu_T_Service $tributTService,
        UserRepository $userRepository,
        MessageService $messageService,
        ConsumerRepository $consumerRepository,
        SupplierRepository $supplierRepository,
        Status $status,
        UserService $userService
    ){
       
        ///check the user connected
        if (!$this->getUser()) {
            return $this->redirectToRoute('app_home');
        }

        ////status user connected --- status on navBar -------------
        $userConnected = $status->userProfilService($this->getUser());
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
            if (intval($id_amis["user_id"]) !== intval($userId)) {
                ///check their type consumer of supplier
                $user_amis = $userRepository->find(intval($id_amis["user_id"]));
                $isActive = intval(($userService->getLastActivity($id_amis["user_id"]))["@status"]);
                if( $user_amis && boolval($isActive)){
                    if($tributGService->getProfil($user_amis, $entityManager)){
                        $profil_amis = $tributGService->getProfil($user_amis, $entityManager)[0];
                        ///single profil
                        $amis = [
                            "id" => $id_amis["user_id"],
                            "photo" => $profil_amis->getPhotoProfil(),
                            "email" => $user_amis->getEmail(),
                            "firstname" => $profil_amis->getFirstname(),
                            "lastname" => $profil_amis->getLastname(),
                            "image_profil" => $profil_amis->getPhotoProfil(),
                            "last_message" => $messageService->getLastMessage($user->getTablemessage(), $id_amis["user_id"]),
                            //"is_online" => $isActive
                        ];
                        ///get it
                        array_push($amis_in_tributG, $amis);
                    }
                }
            }
        }
        ////// PROFIL FOR ALL FINIS ////////////////////////////////// 

        $all_tribuT_user = [];
        $all_tribuT = $userRepository->getListTableTribuT();
        foreach ($all_tribuT as $tribuT) {
            $tribuT['amis'] = [];
            $results = $tributTService->getAllPartisanProfil($tribuT['table_name']);
            foreach ($results as $result) {
                if (intval($result["user_id"]) !== intval($userId)) {
                    $user_amis = $userRepository->find(intval($result["user_id"]));
                    $isActive = intval(($userService->getLastActivity($result["user_id"]))["@status"]);
                    //dd($result["user_id"]);
                    if( $user_amis && boolval($isActive)){
                        if($tributGService->getProfil($user_amis, $entityManager)){
                            $profil_amis = $tributGService->getProfil($user_amis, $entityManager)[0];
                            $amis = [
                                "id" => $result["user_id"],
                                "photo" => $profil_amis->getPhotoProfil(),
                                "email" => $user_amis->getEmail(),
                                "firstname" => $profil_amis->getFirstname(),
                                "lastname" => $profil_amis->getLastname(),
                                "image_profil" => $profil_amis->getPhotoProfil(),
                                "last_message" => $messageService->getLastMessage($user->getTablemessage(), $result["user_id"]),
                                //"is_online" => $isActive,
                            ];
                            ///get it
                            array_push($tribuT['amis'], $amis);
                        }
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

            if (count($id_amis_tributG) !== 1) {
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
            } else {
                $id_user_to_chat = $user->getId();
            }
        }
        // $id_user_to_chat= 20;


        ///user to chat
        $user_to = $userRepository->find($id_user_to_chat);
        $user_to = $user_to === null ? $user : $user_to;
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

        // return $this->render('user/message/liste_amis_connected.html.twig', [
        //     "userConnected" => $userConnected,
        //     "profil" => $profil,
        //     "statusTribut" => $tributGService->getStatusAndIfValid(
        //         $profil[0]->getTributg(),
        //         $profil[0]->getIsVerifiedTributGAdmin(),
        //         $userId
        //     ),
        //     "userToProfil" => $user_to_profil,
        //     "amisTributG" => $amis_in_tributG,
        //     "allTribuT" => $all_tribuT_user,
        //     //"isInTribut" => $request->query->get("tribuT") ? true : false
        // ]);
        $response=array(0=>$all_tribuT_user,1=> $amis_in_tributG) ;
        return $this->json($response);
    }
    #[Route('/user/all/message', name: 'app_all_message')]
    public function allAmis(
        Request $request,
        EntityManagerInterface $entityManager,
        TributGService $tributGService,
        Tribu_T_Service $tributTService,
        UserRepository $userRepository,
        MessageService $messageService,
        ConsumerRepository $consumerRepository,
        SupplierRepository $supplierRepository,
        Status $status,
        UserService $userService
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
                $isActive=intval(($userService->getLastActivity( $id_amis["user_id"]))["@status"]);
                //if( $user_amis && $user_amis->getIsConnected()){
                if($tributGService->getProfil($user_amis, $entityManager)){
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
                        "is_online" => $isActive
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
                    $isActive=intval(($userService->getLastActivity( $result["user_id"]))["@status"]);
                    //if( $user_amis && $user_amis->getIsConnected()){
                    if($tributGService->getProfil($user_amis, $entityManager)){
                        $profil_amis = $tributGService->getProfil($user_amis, $entityManager)[0];
                        $amis = [
                            "id" => $result["user_id"],
                            "photo" => $profil_amis->getPhotoProfil(),
                            "email" => $user_amis->getEmail(),
                            "firstname" => $profil_amis->getFirstname(),
                            "lastname" => $profil_amis->getLastname(),
                            "image_profil" => $profil_amis->getPhotoProfil(),
                            "last_message" => $messageService->getLastMessage($user->getTablemessage(),$result["user_id"]),
                            "is_online" => $isActive,
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
        
        return $this->render('user/message/liste_amis.html.twig', [
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
    }
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
        $userId = $user->getId();

        ////profil user connected
        $profil = $tributGService->getProfil($user, $entityManager);

        ///////GET PROFIL THE USER IN SAME TRIBUT G WITH ME////////////////////////////////
        ///to contains profil user information [ [ id => ..., photo => ..., email => ..., firstname => ..., lastname => ..., image_profil => ..., last_message => ..., is_online => ... ], ... ]
        $amis_in_tributG = $messageService->getListAmisToChat($user, $tributGService, $entityManager, $userRepository);

        ////// PROFIL FOR ALL FINIS //////////////////////////////////
        /////// GET PROFIL THE USER IN SAME TRIBUT T WITH ME ////////////////////////////////
        /////// [ [ table_name => ..., name_tribu_t_muable => ..., logo_path => ..., amis => ... ], ... ]
        $all_tribuT_user = $messageService->getListAmisInTribuTtoChat($user, $tributGService, $tributTService, $entityManager, $userRepository);
        
        //// CHECKS USER TO CHAT //////////////////////////////////

        ///if the is id user from the url 
        if ($request->query->get("user_id")) { /// "1" ...
            $id_user_to_chat = intval($request->query->get("user_id")); /// 1 ...

        } else { /// the user not specified id user  in the url, just to chat box
            $id_amis_tributG = $tributGService->getAllTributG($profil[0]->getTributG());  /// [ ["user_id" => ...], ... ]

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

        return $this->render('user/message/liste_amis.html.twig', [
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
    }


    #[Route('/user/message/perso', name: 'app_message_perso')]
    public function amisPerso(
        Request $request,
        EntityManagerInterface $entityManager,
        TributGService $tributGService,
        Tribu_T_Service $tributTService,
        UserRepository $userRepository,
        MessageService $messageService,
        ConsumerRepository $consumerRepository,
        SupplierRepository $supplierRepository,
        Status $status,
        UserService $userService
    ): Response {

        ///check the user connected
        if (!$this->getUser()) {
            return $this->redirectToRoute('app_home');
        }

        ////status user connected --- status on navBar -------------
        $userConnected = $status->userProfilService($this->getUser());
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
            if (intval($id_amis["user_id"]) !== intval($userId)) {
                ///check their type consumer of supplier
                $user_amis = $userRepository->find(intval($id_amis["user_id"]));
                $isActive = intval(($userService->getLastActivity($id_amis["user_id"]))["@status"]);
                // if ($user_amis && $user_amis->getIsConnected()) {
                if($tributGService->getProfil($user_amis, $entityManager)){
                    $profil_amis = $tributGService->getProfil($user_amis, $entityManager)[0];
                    ///single profil
                    $amis = [
                        "id" => $id_amis["user_id"],
                        "photo" => $profil_amis->getPhotoProfil(),
                        "email" => $user_amis->getEmail(),
                        "firstname" => $profil_amis->getFirstname(),
                        "lastname" => $profil_amis->getLastname(),
                        "image_profil" => $profil_amis->getPhotoProfil(),
                        "last_message" => $messageService->getLastMessage($user->getTablemessage(), $id_amis["user_id"]),
                        "is_online" => $isActive
                    ];
                    ///get it
                    array_push($amis_in_tributG, $amis);
                }
            }
        }
        ////// PROFIL FOR ALL FINIS ////////////////////////////////// 

        $all_tribuT_user = [];
        $all_tribuT = $userRepository->getListTableTribuT();
        foreach ($all_tribuT as $tribuT) {
            $tribuT['amis'] = [];
            $results = $tributTService->getAllPartisanProfil($tribuT['table_name']);
            foreach ($results as $result) {
                if (intval($result["user_id"]) !== intval($userId)) {
                    $user_amis = $userRepository->find(intval($result["user_id"]));
                    $isActive = intval(($userService->getLastActivity($result["user_id"]))["@status"]);
                    // if ($user_amis && $user_amis->getIsConnected()) {
                    if($tributGService->getProfil($user_amis, $entityManager)){
                        $profil_amis = $tributGService->getProfil($user_amis, $entityManager)[0];
                        $amis = [
                            "id" => $result["user_id"],
                            "photo" => $profil_amis->getPhotoProfil(),
                            "email" => $user_amis->getEmail(),
                            "firstname" => $profil_amis->getFirstname(),
                            "lastname" => $profil_amis->getLastname(),
                            "image_profil" => $profil_amis->getPhotoProfil(),
                            "last_message" => $messageService->getLastMessage($user->getTablemessage(), $result["user_id"]),
                            "is_online" => $isActive
                        ];
                        ///get it
                        array_push($tribuT['amis'], $amis);
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

            if (count($id_amis_tributG) !== 1) {

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
            } else {
                $id_user_to_chat = $user->getId();
            }
        }
        // $id_user_to_chat= 20;


        ///user to chat
        $user_to = $userRepository->find($id_user_to_chat);
        $user_to = $user_to === null ? $user : $user_to;
        //// set show and read all last messages.

        ///befor set show and read all last messages
        $result = $messageService->setShowAndReadMessages($user_to->getId(), $user->getTablemessage());

        ///get the all last messages
        $old_message = $messageService->getAllOldMessage(
            $user_to->getId(),
            $user->getTableMessage()
        );

        // $old_message = $messageService->getAllOldMessage(
        //     $user->getId(),
        //     $user_to->getTableMessage()
        // );

        foreach ($old_message as &$message) {
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
    }


    #[Route('/user/push/message', name: 'app_message_push' , methods: ['POST','GET'])]
    public function pushMessage(
        Request $request,
        UserRepository $userRepository,
        MessageService $messageService,
        Filesystem $filesyst,
        AgendaService $agendaService,
        UserService $userService,
        MailService $mailService,
        UrlGeneratorInterface $urlGenerator
    ): Response
    {
        /// get data from front on json format
        $data = json_decode($request->getContent(), true); /// ["from" => ... , "to" => ... ,"message" => ... , "files" => [ ["name" => ..., "type" => ...], ... ] ]
        ///define variables from the key in the array
        extract($data); /// $from , $to , $message, $images
        
        $file_list = [];
        $image_list = [];
        $userId = $this->getUser()->getId();
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

        $my_full_name =  $userService->getFullName($this->getUser()->getId());

        if(isset($dataInfos)){
            foreach ($dataInfos as $key) {
                $agendaID = $key["agendaId"];
                $from_id=$key["from_id"];
                $to_id=$key["to_id"];

                if(!is_null($to_id)){

                    $result = $messageService->sendMessageForOne(
                        $userId, 
                        $to_id, 
                        json_encode([ "text" => str_replace("/agenda/confirmation/".$agendaID,"/agenda/confirmation/".$userId."/".$to_id."/".$agendaID,$message), 
                            "images" => $image_list, 
                            "files" => $file_list 
                        ]),
                        $type);

                    $userTo = $userRepository->findOneBy(["id" => intval($to_id)]);
                    $email_to = $userTo->getEmail();
                    $table_agenda_partage_name="partage_agenda_".$userId;
                    $agendaService->setPartageAgenda($table_agenda_partage_name, $agendaID, ["userId"=>$to_id]);
                    $agendaService->addAgendaStory("agenda_".$userId."_story", $email_to, "Déjà confirmé", $agendaID);
                    
                    /** Email for data infos boucle for user not connected 
                     * Edited by Elie
                    */

                    $status_friend = intval(($userService->getLastActivity($to_id))["@status"]);

                    $name_friend = $userService->getFullName($to_id);

                    $url_redirect = $urlGenerator->generate('app_message_perso', ["user_id"=>$this->getUser()->getId()], UrlGeneratorInterface::ABSOLUTE_URL);

                    //send email for parisan not connected

                    if($status_friend == 0 || $userTo->getIsConnected() == 0 || $userTo->getIsConnected() == false){

                        $obj_mail = $my_full_name. " vous a envoyé un message sur ConsoMyZone";
                    
                        $mailService->sendEmailForMessage($email_to, $name_friend, $obj_mail, $my_full_name, $url_redirect);

                    }

                    /** End Elie */
                }
            }
        }else{

            $result = $messageService->sendMessageForOne($from, $to, json_encode([ "text" => $message, "images" => $image_list, "files" => $file_list ]),$type); /// [ ["last_id_message" => .. ] ]

            /**
            * Email for user not connected
            * Edited by Elie
            */
            $status_friend = intval(($userService->getLastActivity($to))["@status"]);

            $profil_friend = $userRepository->findOneBy(['id'=>$to]);

            $name_friend = $userService->getFullName($to);

            $email_friend = $profil_friend->getEmail();

            $url_redirect = $urlGenerator->generate('app_message_perso', ["user_id"=>$to], UrlGeneratorInterface::ABSOLUTE_URL);

            //send email for parisan not connected
            if($status_friend == 0){

                $obj_mail = $name_friend. " vous a envoyé un message sur ConsoMyZone";
            
                $mailService->sendEmailForMessage($email_friend, $name_friend, $obj_mail, $my_full_name, $url_redirect);

            }

            /** End Elie */
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
            $this->getUser()->getTablemessage(),
            intval($this->getUser()->getId())
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

    #[Route("/user/realTimeMessage/grp", name:"app_real_time_message_grp")]
    public function showMessageInRealTime(
        Request $request,
        Tribu_T_Service $tributTService,
        TributGService $tributGService
    
    ){
        $type=$request->query->get('type');
        $tableName="";
        $allMessage=[];
        switch($type){
            case 't':{

                $tableName=$request->query->get('name');
                $groupSendTo=$tableName;
                $allMessage=$tributTService->getMessageGRP($tableName);
                //$allMessage=mb_convert_encoding( $allMessage, 'UTF-8', 'UTF-8');
                foreach($allMessage as &$message){
                    $iv=$tributGService->getIv($groupSendTo,$message["id_msg"])[0]["iv"];
                    $decryptedData=$this->decryptData($message["msg"],$iv);
                    $decryptedImages=$this->decryptData($message["images"],$iv);
                    $decryptedFiles=$this->decryptData($message["files"],$iv);
                    $message["msg"]= $decryptedData != false ? $decryptedData : json_decode($message["msg"],true);
                    $message["images"]= $decryptedImages != false ? json_decode($decryptedImages,true): json_decode($message["images"],true);
                    $message["files"]= $decryptedFiles !=false ?   json_decode($decryptedFiles,true) : json_decode($message["files"],true);
                   
                }
                //dd( $allMessage);
                break;
                
            }

            case 'g':{
                $tableName=$request->query->get('name');
                $groupSendTo=$tableName;
                $allMessage=$tributGService->getMessageGRP($tableName);
                //$allMessage=mb_convert_encoding( $allMessage, 'UTF-8', 'UTF-8');
                foreach($allMessage as &$message){
                    $iv=$tributGService->getIv($groupSendTo,$message["id_msg"])[0]["iv"];
                    $decryptedData=$this->decryptData($message["msg"],$iv);
                    $decryptedImages=$this->decryptData($message["images"],$iv);
                    $decryptedFiles=$this->decryptData($message["files"],$iv);
                    $message["msg"]= $decryptedData != false ? $decryptedData : json_decode($message["msg"],true);
                    $message["images"]= $decryptedImages != false ? json_decode($decryptedImages,true): json_decode($message["images"],true);
                    $message["files"]= $decryptedFiles !=false ?   json_decode($decryptedFiles,true) : json_decode($message["files"],true);
                   
                }
                break;
            }

            default:{

            }
        }
        //dump($allMessage);
        //dd($allMessage);
        $response = new StreamedResponse();
        $response->setCallback(function () use (&$allMessage) {

            echo "data:" . json_encode($allMessage) .  "\n\n";
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

   #[Route("/user/sharing/message",name:"app_share_message")]
    public function shareMessage(
        Request $request,
        MessageService $messageService
    ){

        $currentUserId=$this->getUser()->getId();

        $content=json_decode($request->getContent(),true);
        
        $key = hex2bin("000102030405060708090a0b0c0d0e0f");
        $iv = hex2bin("101112131415161718191a1b1c1d1e1f");
       
        $idMessageBase64Decode=base64_decode($content["idMessage"],true);
        if(!$idMessageBase64Decode){
            return $this->json([
                "msg" =>"erreur"
            ],500);
        }else{
            $decryptedIdMessage = openssl_decrypt($idMessageBase64Decode, "AES-128-CBC", 
            $key, 0, $iv);
            $decryptedIdMessage=preg_replace('/[^0-9]/i','',base64_decode($decryptedIdMessage,true)) ;
            foreach($content["usr"] as $usr){
                $userIdBase64Decode=base64_decode($usr,true);
                if(!$userIdBase64Decode){
                    return $this->json([
                        "msg" =>"erreur"
                    ],500);
                }else{
                    $decryptedUserId = openssl_decrypt($userIdBase64Decode, "AES-128-CBC", 
                    $key, 0, $iv);
                    $messageService->transferMessage($currentUserId,
                    intval($decryptedUserId),
                    intval($decryptedIdMessage));
                }
            }
        }
        
        
        return $this->json([
            "msg" =>"ok" 
        ]);
    }

    
    #[Route('/api/user/message_iframe', name: 'app_all_message_iframe')]
    public function allAmisIframe(
        Request $request,
        EntityManagerInterface $entityManager,
        TributGService $tributGService,
        Tribu_T_Service $tributTService,
        UserRepository $userRepository,
        MessageService $messageService,
        ConsumerRepository $consumerRepository,
        SupplierRepository $supplierRepository,
        Status $status,
        UserService $userService
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
                $isActive=intval(($userService->getLastActivity( $id_amis["user_id"]))["@status"]);
                //if( $user_amis && $user_amis->getIsConnected()){
                if($tributGService->getProfil($user_amis, $entityManager)){
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
                        "is_online" => $isActive
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
                    $isActive=intval(($userService->getLastActivity( $result["user_id"]))["@status"]);
                    //if( $user_amis && $user_amis->getIsConnected()){
                    if($tributGService->getProfil($user_amis, $entityManager)){
                        $profil_amis = $tributGService->getProfil($user_amis, $entityManager)[0];
                        $amis = [
                            "id" => $result["user_id"],
                            "photo" => $profil_amis->getPhotoProfil(),
                            "email" => $user_amis->getEmail(),
                            "firstname" => $profil_amis->getFirstname(),
                            "lastname" => $profil_amis->getLastname(),
                            "image_profil" => $profil_amis->getPhotoProfil(),
                            "last_message" => $messageService->getLastMessage($user->getTablemessage(),$result["user_id"]),
                            "is_online" => $isActive,
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
        
        return $this->render('user/message/liste_amis_iframe.html.twig', [
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
    }

    #[Route("/api/tribu/msg_iframe", name:"app_tribu_g_message_iframe",methods:['GET'])]
    public function renderMessageTribuIframe(
        Request $request,
        TributGservice $tributGService,
        Tribu_T_Service $tributTService,
        UserRepository $userRepository,
        MessageService $messageService,
        ConsumerRepository $consumerRepository,
        SupplierRepository $supplierRepository,
        Status $status,
        UserService $userService

    ){
        ///check the user connected
        if (!$this->getUser()) {
            return $this->redirectToRoute('app_home');
        }
        $userConnected = $status->userProfilService($this->getUser());
        $user = $this->getUser();
        $userType = $user->getType();
        $userId = $user->getId();
         
       
        $all_tribuT = $userRepository->getListTableTribuT();

        $tribuG=$userConnected;
        $tribuG["name"]= "tribu G ".$tribuG["commune"]." ". $tribuG["quartier"];
        
        $tribuTSelected=[];
       
        $type=$request->query->get('type');
        $isT=1;
        $groupSendTo="";
        switch($type){
            case ('t'):{
                //TODO get All message of tribu T concerned
                $tableName=$request->query->get('name');
                $groupSendTo=$tableName;
                $allMessage=$tributTService->getMessageGRP($tableName);
                foreach($allMessage as &$message){
                    $iv=$tributGService->getIv($groupSendTo,$message["id_msg"])[0]["iv"];
                    $decryptedData=$this->decryptData($message["msg"],$iv);
                    $decryptedImages=$this->decryptData($message["images"],$iv);
                    $decryptedFiles=$this->decryptData($message["files"],$iv);
                    $message["msg"]= $decryptedData != false ? $decryptedData : json_decode($message["msg"],true);
                    $message["images"]= $decryptedImages != false ? json_decode($decryptedImages,true): json_decode($message["images"],true);
                    $message["files"]= $decryptedFiles !=false ?   json_decode($decryptedFiles,true) : json_decode($message["files"],true);
                }
                foreach($all_tribuT as $tribut){
                     if($tribut["table_name"] ==$tableName)
                        $tribuTSelected=$tribut;
                }
                $isT=1;
                break;
            }
            case ('g'):{
                //TODO get All message of tribu g concerned
                $groupSendTo=$tribuG["tableTribuG"];
                $isT=0;
                $tableName=$request->query->get('name');
                $allMessage=$tributGService->getMessageGRP($tableName);
                if(count($allMessage)>0)
                    $tribuG["last_message"]=$allMessage[0];
                else
                    $tribuG["last_message"]=[];
                foreach($allMessage as &$message){
                    $iv=$tributGService->getIv($groupSendTo,$message["id_msg"])[0]["iv"];
                    $decryptedData=$this->decryptData($message["msg"],$iv);
                    $decryptedImages=$this->decryptData($message["images"],$iv);
                    $decryptedFiles=$this->decryptData($message["files"],$iv);
                    $message["msg"]= $decryptedData != false ? $decryptedData : json_decode($message["msg"],true);
                    $message["images"]= $decryptedImages != false ? json_decode($decryptedImages,true): json_decode($message["images"],true);
                    $message["files"]= $decryptedFiles !=false ?   json_decode($decryptedFiles,true) : json_decode($message["files"],true);
                }
                break;
            }
            default:{

            }
        } 

        //dump($allMessage);
        // $tribuG["last_message"]=$allMessage[0];
        return $this->render("user/message/mgs_grp_tribu_iframe.html.twig",[
            "group_send_to"=>$groupSendTo,
            "isT"=> $isT,
            "userConnected" => $userConnected,
            "tribusG" => $tribuG,
            "tribuT" => $all_tribuT,
            "tribuTSelected"=>$tribuTSelected,
            "allMessage"=>$allMessage,
            "type"=>$type
        ]);
        

    }

    #[Route('/api/message/perso_iframe', name: 'app_message_perso_iframe')]
    public function amisPersoIframe(
        Request $request,
        EntityManagerInterface $entityManager,
        TributGService $tributGService,
        Tribu_T_Service $tributTService,
        UserRepository $userRepository,
        MessageService $messageService,
        ConsumerRepository $consumerRepository,
        SupplierRepository $supplierRepository,
        Status $status,
        UserService $userService
    ): Response {

        ///check the user connected
        if (!$this->getUser()) {
            return $this->redirectToRoute('app_home');
        }

        ////status user connected --- status on navBar -------------
        $userConnected = $status->userProfilService($this->getUser());
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
            if (intval($id_amis["user_id"]) !== intval($userId)) {
                ///check their type consumer of supplier
                $user_amis = $userRepository->find(intval($id_amis["user_id"]));
                $isActive = intval(($userService->getLastActivity($id_amis["user_id"]))["@status"]);
                // if ($user_amis && $user_amis->getIsConnected()) {
                if($tributGService->getProfil($user_amis, $entityManager)){
                    $profil_amis = $tributGService->getProfil($user_amis, $entityManager)[0];
                    ///single profil
                    $amis = [
                        "id" => $id_amis["user_id"],
                        "photo" => $profil_amis->getPhotoProfil(),
                        "email" => $user_amis->getEmail(),
                        "firstname" => $profil_amis->getFirstname(),
                        "lastname" => $profil_amis->getLastname(),
                        "image_profil" => $profil_amis->getPhotoProfil(),
                        "last_message" => $messageService->getLastMessage($user->getTablemessage(), $id_amis["user_id"]),
                        "is_online" => $isActive
                    ];
                    ///get it
                    array_push($amis_in_tributG, $amis);
                }
            }
        }
        ////// PROFIL FOR ALL FINIS ////////////////////////////////// 

        $all_tribuT_user = [];
        $all_tribuT = $userRepository->getListTableTribuT();
        foreach ($all_tribuT as $tribuT) {
            $tribuT['amis'] = [];
            $results = $tributTService->getAllPartisanProfil($tribuT['table_name']);
            foreach ($results as $result) {
                if (intval($result["user_id"]) !== intval($userId)) {
                    $user_amis = $userRepository->find(intval($result["user_id"]));
                    $isActive = intval(($userService->getLastActivity($result["user_id"]))["@status"]);
                    // if ($user_amis && $user_amis->getIsConnected()) {
                    if($tributGService->getProfil($user_amis, $entityManager)){
                        $profil_amis = $tributGService->getProfil($user_amis, $entityManager)[0];
                        $amis = [
                            "id" => $result["user_id"],
                            "photo" => $profil_amis->getPhotoProfil(),
                            "email" => $user_amis->getEmail(),
                            "firstname" => $profil_amis->getFirstname(),
                            "lastname" => $profil_amis->getLastname(),
                            "image_profil" => $profil_amis->getPhotoProfil(),
                            "last_message" => $messageService->getLastMessage($user->getTablemessage(), $result["user_id"]),
                            "is_online" => $isActive
                        ];
                        ///get it
                        array_push($tribuT['amis'], $amis);
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

            if (count($id_amis_tributG) !== 1) {

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
            } else {
                $id_user_to_chat = $user->getId();
            }
        }
        // $id_user_to_chat= 20;


        ///user to chat
        $user_to = $userRepository->find($id_user_to_chat);
        $user_to = $user_to === null ? $user : $user_to;
        //// set show and read all last messages.

        ///befor set show and read all last messages
        $result = $messageService->setShowAndReadMessages($user_to->getId(), $user->getTablemessage());

        ///get the all last messages
        $old_message = $messageService->getAllOldMessage(
            $user_to->getId(),
            $user->getTableMessage()
        );

        // $old_message = $messageService->getAllOldMessage(
        //     $user->getId(),
        //     $user_to->getTableMessage()
        // );

        foreach ($old_message as &$message) {
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
            "messages" => $old_message,
            "status" => strtoupper($user_to->getType())
        ];

        return $this->render('user/message/amis_iframe.html.twig', [
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
    }


    #[Route('/user/message/onglet/perso', name: 'app_message_perso_onglet')]
    public function amisPersoOnglet(
        Request $request,
        EntityManagerInterface $entityManager,
        TributGService $tributGService,
        Tribu_T_Service $tributTService,
        UserRepository $userRepository,
        MessageService $messageService,
        ConsumerRepository $consumerRepository,
        SupplierRepository $supplierRepository,
        Status $status,
        UserService $userService
    ): Response {

        ///check the user connected
        if (!$this->getUser()) {
            return $this->redirectToRoute('app_home');
        }

        ////status user connected --- status on navBar -------------
        $userConnected = $status->userProfilService($this->getUser());
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
            if (intval($id_amis["user_id"]) !== intval($userId)) {
                ///check their type consumer of supplier
                $user_amis = $userRepository->find(intval($id_amis["user_id"]));
                $isActive = intval(($userService->getLastActivity($id_amis["user_id"]))["@status"]);
                // if ($user_amis && $user_amis->getIsConnected()) {
                if($tributGService->getProfil($user_amis, $entityManager)){
                $profil_amis = $tributGService->getProfil($user_amis, $entityManager)[0];
                ///single profil
                $amis = [
                    "id" => $id_amis["user_id"],
                    "photo" => $profil_amis->getPhotoProfil(),
                    "email" => $user_amis->getEmail(),
                    "firstname" => $profil_amis->getFirstname(),
                    "lastname" => $profil_amis->getLastname(),
                    "image_profil" => $profil_amis->getPhotoProfil(),
                    "last_message" => $messageService->getLastMessage($user->getTablemessage(), $id_amis["user_id"]),
                    "is_online" => $isActive
                ];
                ///get it
                array_push($amis_in_tributG, $amis);
                }
            }
        }
        ////// PROFIL FOR ALL FINIS ////////////////////////////////// 

        $all_tribuT_user = [];
        $all_tribuT = $userRepository->getListTableTribuT();
        foreach ($all_tribuT as $tribuT) {
            $tribuT['amis'] = [];
            $results = $tributTService->getAllPartisanProfil($tribuT['table_name']);
            foreach ($results as $result) {
                if (intval($result["user_id"]) !== intval($userId)) {
                    $user_amis = $userRepository->find(intval($result["user_id"]));
                    $isActive = intval(($userService->getLastActivity($result["user_id"]))["@status"]);
                    // if ($user_amis && $user_amis->getIsConnected()) {
                    if($tributGService->getProfil($user_amis, $entityManager)){
                    $profil_amis = $tributGService->getProfil($user_amis, $entityManager)[0];
                    $amis = [
                        "id" => $result["user_id"],
                        "photo" => $profil_amis->getPhotoProfil(),
                        "email" => $user_amis->getEmail(),
                        "firstname" => $profil_amis->getFirstname(),
                        "lastname" => $profil_amis->getLastname(),
                        "image_profil" => $profil_amis->getPhotoProfil(),
                        "last_message" => $messageService->getLastMessage($user->getTablemessage(), $result["user_id"]),
                        "is_online" => $isActive
                    ];
                    ///get it
                    array_push($tribuT['amis'], $amis);
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

            if (count($id_amis_tributG) !== 1) {

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
            } else {
                $id_user_to_chat = $user->getId();
            }
        }
        // $id_user_to_chat= 20;


        ///user to chat
        $user_to = $userRepository->find($id_user_to_chat);
        $user_to = $user_to === null ? $user : $user_to;
        //// set show and read all last messages.

        ///befor set show and read all last messages
        $result = $messageService->setShowAndReadMessages($user_to->getId(), $user->getTablemessage());

        ///get the all last messages
        $old_message = $messageService->getAllOldMessage(
            $user_to->getId(),
            $user->getTableMessage()
        );

        // $old_message = $messageService->getAllOldMessage(
        //     $user->getId(),
        //     $user_to->getTableMessage()
        // );

        foreach ($old_message as &$message) {
            $message["content"] = json_decode($message["content"], true);
            $message["user_post"] = json_decode($message["user_post"], true);
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
            "messages" => $old_message,
            "status" => strtoupper($user_to->getType())
        ];
        $isPostid = $user_to_profil['id'];
        return $this->render('user/message/modul_message.html.twig', [
            "userConnected" => $userConnected,
            "profil" => $profil,
            "statusTribut" => $tributGService->getStatusAndIfValid(
                $profil[0]->getTributg(),
                $profil[0]->getIsVerifiedTributGAdmin(),
                $userId
            ),
            "user_post" => $isPostid,
            "userToProfil" => $user_to_profil,
            "amisTributG" => $amis_in_tributG,
            "allTribuT" => $all_tribuT_user,
            "isInTribut" => $request->query->get("tribuT") ? true : false
        ]);
    }
}
