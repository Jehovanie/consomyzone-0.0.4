<?php

namespace App\Controller;
use App\Repository\AvisfermeRepository;
use App\Repository\AvisstationRepository;
use App\Repository\FermeGeomRepository;
use App\Repository\StationServiceFrGeomRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class updateNoteGlobalFerme extends AbstractController
{

    /**
     * @Route("/updateNote", name="app_note_event", methods={"GET"})
     */
    public function event(Request $request,FermeGeomRepository $fermGeom,AvisfermeRepository $avisRep)
    {
       
        $nombreAvis=$avisRep->getNombreAvis($request->get("idFerme"));
        
        $notes= $avisRep->getNote($request->get("idFerme"));
        $sommeNote=0;
        foreach ($notes as $note ){
                $sommeNote=$sommeNote+$note["note"];
        }
        $moyenneNote=0;
        if($nombreAvis >=10){
                $moyenneNote=$sommeNote/$nombreAvis;
        }
        $fermGeom->addNote($request->get("idFerme"),$moyenneNote);
        $response = new StreamedResponse();
        $response->setCallback(function () use (&$moyenneNote) {
            echo "event: upNote";
            echo "\n";
            echo "data:".json_encode($moyenneNote) .  "\n\n";
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

    /**
     * @Route("/updateNoteStantion", name="app_note_event_staton", methods={"GET"})
     */
    public function eventStation(Request $request, StationServiceFrGeomRepository $stationRep, AvisstationRepository $avisStationRep)
    {

        $nombreAvis = $avisStationRep->getNombreAvis($request->get("idStation"));

        $notes = $avisStationRep->getNote($request->get("idStation"));
        $sommeNote = 0;
        foreach ($notes as $note) {
            $sommeNote = $sommeNote + $note["note"];
        }
        $moyenneNote = 0;
        if (intval($nombreAvis) >= 10) {
            $moyenneNote = $sommeNote/ intval($nombreAvis);
        }
        $stationRep->addNote($request->get("idStation"), $moyenneNote);
        $response = new StreamedResponse();
        $response->setCallback(function () use (&$moyenneNote) {
            echo "event: upNoteStations";
            echo "\n";
            echo "data:" . json_encode($moyenneNote) .  "\n\n";
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
    
}
