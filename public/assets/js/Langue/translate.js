
let en = {
    "actualite" : "Actuality",
    "invitations" : "Invitations" ,
    "profil" : "Profile",
    "tribu_t" : "Tribes T",
    "publications" : "Publications",
    "mes_tribus" : "My Tribes",
    "creer_tribu" : "Create a Tribe",
    "autres_tribus" : "Other Tribes",
    "parametres" : "Settings",
    "compte" : "Account",
    "securite" : "Security",
    "confidentialite" : "Confidentiality",
    "message" : "Messages",
    "langage" : "Languages",
    "parametre_notification" : "Notifications Settings",
    "tribues_suivies" : "Tribes followed",
	"modif_langue_titre" : "Changing the language",
	"invitation_list":"Invitation list",
	"invitation_recu" : "Invitation received",
	"invitation_envoye" : "Invitation sent",
	"apropos" : "About",
	"modifier" :"Modify",
	"pub_list" :"List of your publications",
	"tribu_list" :"List of tribes",
	"tribu_nom" :"Nom of tribe",
	"description" :"Description",
	"tribu_creer" :"Create a tribe",
	"choix_ext" :"Choose an extension",
	"modifier_profil" :"Modify your profile",
	"prenom" :"Firstname",
	"nom" :"Lastname",
	"rue" :"Street number",
	"phone_mobile" : "Mobile phone",
	"code_postale" :"ZIP code",
	"pays" : "Country",
	"phone_fixe" :"Phone",
	"param_sec" :"Security setting",
	"modif_mdp" :"Modify your password",
	"modif_email" :"Modify your email address",
	"get_link" :"Get a link",
	"voir_profil" :"See his profile",
	"amis" :"Friends",
	"deconnexion" :"Logout",
	"autre_action" :"Another action",
	"nouvelle_notification" :"A new notification.",
	"mon_agenda" : " My agenda"
}

let fr = {
    "actualite" : "Actualité",
    "invitations" : "Invitations" ,
    "profil" : "Profil",
    "tribu_t" : "Tribu T",
    "publications" : "Publications",
    "mes_tribus" : "Mes Tribus",
    "creer_tribu" : "Créer une tribu",
    "autres_tribus" : "Autres Tribus",
    "parametres" : "Paramètres",
    "compte" : "Compte",
    "securite" : "Sécurité",
    "confidentialite" : "Confidentialité",
    "message" : "Messages",
    "langage" : "Langues",
    "parametre_notification" : "Paramètres des Notifications",
    "tribues_suivies" : "Tribues suivies",
	"modif_langue_titre" : "Modification de la langue",
	"invitation_list":"List d'invitation",
	"invitation_recu" : "Invitation réçue",
	"invitation_envoye" : "Invitation envoyée",
	"apropos" : "A propos",
	"modifier" :"Modifier",
	"pub_list" :"Liste de vos publications",
	"tribu_list" :"Liste des tribus",
	"tribu_nom" :"Nom de tribu",
	"description" :"Déscription",
	"tribu_creer" :"Créer un tribu",
	"choix_ext" :"Choisir une extension",
	"modifier_profil" :"Modifier votre profil",
	"prenom" :"Prénom",
	"nom" :"Nom",
	"rue" :"N° de rue",
	"phone_mobile" : "Téléphone mobile",
	"code_postale" :"ZIP code",
	"pays" : "Pays",
	"phone_fixe" :"Téléphone fixe",
	"param_sec" :"Paramètre de sécurité",
	"modif_mdp" :"Modifier le mot de passe",
	"modif_email" :"Modifier l'adresse email",
	"get_link" :"Recevoir un lien",
	"voir_profil" :"Voir son profil",
	"amis" :"Amis",
	"deconnexion" :"Déconnexion",
	"autre_action" :"Autres action",
	"nouvelle_notification" :"Une nouvelle notification.",
	"mon_agenda" : " Mon agenda"
}

function traduire(lng){
	
	let allDom = document.getElementsByTagName("*");
	for(let i =0; i < allDom.length; i++){
		let elem = allDom[i];
		let key = elem.getAttribute('lng-tag');
		if(key != null) {
			elem.innerHTML = lng[key] ;
		}
	}

	if(lng == en){
		$("#enTranslator").prop('disabled', true);
		$("#frTranslator").prop('disabled', false);
	} 
	if(lng == fr){
		// $("#frTranslator").css('color', '#f4623a');
		$("#frTranslator").prop('disabled', true);
		$("#enTranslator").prop('disabled', false);
	}
}
	
$(document).ready(function(){

	if(localStorage.getItem("langue")){
		let lng = localStorage.getItem("langue")
		if(lng=="en"){
			traduire(en)
		}
		if(lng=="fr"){
			traduire(fr)
		}
		//console.log("lng : " + lng);
	}
	//This is id of HTML element (English) with attribute lng-tag
	if($("#enTranslator") && $("#frTranslator")){
		$("#enTranslator").click(function(){
			traduire(en);
			localStorage.setItem("langue", "en");
		});
		//This is id of HTML element (Khmer) with attribute lng-tag
		$("#frTranslator").click(function(){
			traduire(fr);
			localStorage.setItem("langue", "fr");
			//localStorage.getItem("lastname");
		});
	}
	
});