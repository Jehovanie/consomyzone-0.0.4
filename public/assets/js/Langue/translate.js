
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
	"modif_langue_titre" : "Changing the language"

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
	"modif_langue_titre" : "Modification de la langue"
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