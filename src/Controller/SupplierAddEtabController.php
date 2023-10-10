<?php

namespace App\Controller;

use App\Entity\FermeGeom;
use App\Form\AddEtabFermeFinType;
use App\Form\AddEtabFermeModifFinType;
use App\Form\AddEtabFermeSuiteType;
use App\Form\AddEtabFermeType;
use App\Repository\DepartementRepository;
use App\Repository\FermeGeomRepository;
use App\Repository\StationServiceFrGeomRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class SupplierAddEtabController extends AbstractController
{

   function  __construct(){

   }

    /**
     * @Route("/choose-activity", name="app_choose_etab")
     */
    public function chooseActivity(){

        return $this->render('user/addEtab/ChoixActiviter.html.twig');

    }

    /**
     * @Route("/persit-new-etab", name="app_persist_etab")
     */
    public function persitEtab(Request $request, FermeGeomRepository $fermgeomRepository){
        $user = $this->getUser();
        $body=json_decode($request->getContent(),true);
        $f=new FermeGeom();
        $f->setNomFerme($body["nom_ferme"])
        ->setAdresseFerme($body["adresse_ferme"])
        ->setCodePostal($body["code_postal"])
        ->setDepartement($body["departement"])
        ->setDepartementName($body["departement_name"])
        ->setEmail($body["email"])
        ->setFax($body["fax"])
        ->setTelephoneDomicile($body["telephone_domicile"])
        ->setTelephoneMobile($body["telephone_mobile"])
        ->setTelephoneTravail($body["telephone_travail"])
        ->setProduitFerme($body["produit_ferme"])
        ->setVille($body["ville"])
        ->setLatitude(floatval($body["lat"]))
        ->setLongitude(floatval($body["lng"]))
        ->setHorairesVenteAFerme($body["horaires_vente_ferme"])
        ->setHorairesVenteMagasinProd($body["horaires_vente_magasin"])
        ->setHorairesVenteAuMarche($body["horaires_vente_marche"])
        ->setAccesHandicape($body["acces_handicape"])
        ->setAccesHandicapAuditif($body["acces_handicap_auditif"])
        ->setAccesHandicapMental($body["acces_handicap_mental"])
        ->setAccesHandicapMotrice($body["acces_handicap_motrice"])
        ->setAccesHandicapVisuel($body["acces_handicap_visuel"])
        ->setAccesVoiture($body["acces_voiture"])
        ->setAdherentAdeve($body["adherent_adeve"])
        ->setAgricultureBio($body["agriculture_bio"])
        ->setAnimauxAutoriser($body["animaux_autoriser"])
        ->setAtelier($body["atelier"])
        ->setCarteBancaire($body["carte_bancaire"])
        ->setChequeVacance($body["cheque_vacance"])
        ->setDegustation($body["degustation"])
        ->setMarcherProduit($body["marcher_produit"])
        ->setSiteWeb($body["site_web"])
        ->setStationVerte($body["station_verte"])
        ->setTicketsRestaurant($body["tickets_restaurant"])
        ->setVenteEnLigne($body["vente_en_ligne"])
        ->setAddBy($this->getUser()->getId());
        $fermgeomRepository->save($f,true);
        return $this->json(["r"=>"success"]);
    }

    /**
     * @Route("/add-etab", name="app_create_etab")
     */
    public function addEtab(){
        $ferme = new FermeGeom();

        $form = $this->createForm(AddEtabFermeType::class, $ferme);

        return $this->render('user/addEtab/AddEtabFerme.html.twig', [
            
            'form_add_etab_ferme' => $form->createView(),            
        ]);
        
    }

    /**
     * @Route("/add-etab-modif/{id}", name="app_modif_etab",methods={"GET"})
     * 
     */
    public function addEtabModif(FermeGeomRepository $f,$id)
    {
        $ferme=$f->findMyEtab($id, $this->getUser()->getId())[0];
        //dd($ferme);
        $form = $this->createForm(AddEtabFermeType::class, $ferme);

        return $this->render('user/addEtab/AddEtabModifFerme.html.twig', [
            'ferme' => $ferme,
            'form_add_etab_ferme' => $form->createView()
        ]);
    }

    /**
     * @Route("/delete-etab", name="app_delete_etab")
     */
    public function deleteEtab(Request $request,FermeGeomRepository $fermgeomRepository){
        $id= $request->get('id');
        return $this->json($fermgeomRepository->deleteEtab($id, $this->getUser()->getId()), $status = 200);
    }

    /**
     * @Route("/add-etab-suite", name="app_create_etab_suit")
     */
    public function addEtabSuit()
    {
        $ferme = new FermeGeom();

        $form = $this->createForm(AddEtabFermeSuiteType::class, $ferme);

        return $this->render('user/addEtab/AddEtabFermeSuite.html.twig', [
            'form_add_etab_ferme_suit' => $form->createView(),
        ]);
    }

    /**
     * @Route("/add-etab-modif-suite/{id}", name="app_modif_etab_suit")
     */
    public function addEtabModifSuit(FermeGeomRepository $f, $id)
    {
        $ferme = $f->findMyEtab($id, $this->getUser()->getId())[0];
        //dd($ferme);
        //$form = $this->createForm(AddEtabFermeType::class, $ferme);

        return $this->render('user/addEtab/AddEtabFermeModifSuite.html.twig', ['ferme' => $ferme]);
        
    }

    /**
     * @Route("/add-etab-fin", name="app_create_etab_fin")
     */
    public function addEtabFin()
    {
        $ferme = new FermeGeom();

        $form = $this->createForm(AddEtabFermeFinType::class, $ferme);

        return $this->render('user/addEtab/AddEtabFermeFin.html.twig', [
            'form_add_etab_ferme_fin' => $form->createView(),
        ]);
    }

    /**
     * @Route("/add-etab-modif-fin/{id}", name="app_modif_etab_fin")
     */
    public function addEtabModifFin(FermeGeomRepository $f,$id)
    {
        $ferme = $f->findMyEtab($id, $this->getUser()->getId())[0];
        
        $form = $this->createForm(AddEtabFermeModifFinType::class, $ferme);

        return $this->render('user/addEtab/AddEtabFermeModifFin.html.twig', [
            'ferme' => $ferme,
            'form_add_etab_ferme_modif_fin' => $form->createView()
        ]);
        
    }

    /**
     *@Route("/update_etab",name="app_update_etab") 
     */
    public function updateEtab(Request $request,FermeGeomRepository $f){
        $body=json_decode($request->getContent(),true);
        return $this->json($f->updateMyEtab($body,$this->getUser()->getId()),$status=200);
    }
    /**
     * @Route("/add-etab-carte", name="app_create_etab_carte")
     */
    public function addEtabCarte()
    {
        
        return $this->render('user/addEtab/Carte.html.twig');
    }

    /**
     * @Route("/add-etab-modif-carte", name="app_modif_etab_carte")
     */
    public function addEtabModifCarte()
    {

        return $this->render('user/addEtab/CarteModif.html.twig');
    }
}