<?php

namespace App\Controller;

use App\Service\NotificationService;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class NotificationController extends AbstractController
{
    
    #[Route('/notifications', name: 'app_event')]
    public function event( Request $request,  NotificationService $notificationsService )
    {
        $table = $request->query->get("table");
        $notification = $notificationsService->fetchAllNotification($table);

        $response = new StreamedResponse();
        $response->setCallback(function () use (&$notification) {

            echo "data:" . json_encode($notification) .  "\n\n";
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

    #[Route("/user/notification/tous_marquer_lu" , name : "app_tous_marquer_lu")]
    public function readAllNotifications(
        NotificationService $notificationsService
    )
    {
        if(!$this->getUser()){
            return $this->json([
                "result" => "failure"
            ]);
        }

        $result = $notificationsService->readAllNotifications(
            $this->getUser()->getTablenotification(),
            $this->getUser()->getId()
        );

        return $this->json([
            "result" => $result
        ]);
    }
    
}
