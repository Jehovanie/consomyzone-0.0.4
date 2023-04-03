const eventSource = new EventSource("/user/invitation/update");
eventSource.addEventListener("refreshInvitation", e => {
	const invitationsDatas = JSON.parse(e.data)

	// console.log(invitationsDatas)
	const ulContents = document.querySelector("#contenus")
	// for(const childNode of ulContents.childNodes) 
	// 	ulContents.removeChild(childNode)
	for (let invitationsData of invitationsDatas) { 
		if (invitationsData["requesting"]["types"] === "invitation") { 
			let subRequestContent = ""
			if (invitationsData["requesting"]["is_wait"] == 1) {
				subRequestContent = `
				    <div class="col-md-6">
								<p> <b>${invitationsData["uPoster"]["\u0000App\\Entity\\User\u0000pseudo"]}</b> vous a envoyé une ${invitationsData["requesting"]["content"]}</p> 
					</div>
				    <div class="col-md-3"> 
							<button class="btn btn-primary bt${invitationsData["requesting"]["id"]}rU btn_t_${invitationsData["uPoster"]["\u0000App\\Entity\\User\u0000id"]}" data-b="${invitationsData["requesting"]["balise"]}" id="confirm_invitation_js" >Confirmer
								<i class="fa-solid fa-user-plus text-light"></i>
							</button> 
					</div>
					<div class="col-md-3"> 
							<button class="btn btn-danger bt${invitationsData["requesting"]["id"]}rU btn_r_${invitationsData["uPoster"]["\u0000App\\Entity\\User\u0000id"]}" data-b="${invitationsData["requesting"]["balise"]}" id="supre_invitation_js">Suprimer
								<i class="fa-solid fa-user-minus text-light"></i>
							</button> 
					</div> 
				`
				const liContenus = `
					<li class="invitation" data-rank=${invitationsData["requesting"]["id"]}>
						<div class="row invitation-conf">
							${subRequestContent}				
						</div> 
					</li>  
				
				`
				const cardInvitations = document.querySelectorAll(".invitation")
				let array=[]
				for (let cardInvitation of cardInvitations) {
					array.push(cardInvitation.dataset.rank)
				}
				console.log(array)
				if (!array.includes(invitationsData["requesting"]["id"].toString())) {
					ulContents.innerHTML += liContenus
					createInviationOnglet()
				}
			} else {
				const cardInvitations = document.querySelectorAll(".invitation")
				let array=[]
				for (let cardInvitation of cardInvitations) {
					array.push(cardInvitation.dataset.rank)
				}
				console.log(array)
				if (array.includes(invitationsData["requesting"]["id"].toString())) {
					// ulContents.innerHTML += liContenus
					// createInviationOnglet()
					const li = document.querySelector(`li[data-rank="${invitationsData["requesting"]["id"]}"]`)
					//console.log(li)
					li.parentNode.removeChild(li)

				}
			}

		} else {
			// let subRequestContent = ""
			if (invitationsData["requesting"]["is_wait"] == 1) {
				subRequestContent = `
					<div class="col-md-9">
						 <p><b>${invitationsData["userReceiving"]["\u0000App\\Entity\\User\u0000pseudo"]}</b> vous avez envoyé une ${invitationsData["requesting"]["content"]}</p> 
					 </div>
					<div class="col-md-3"> 
							 <button class="btn btn-primary bt${invitationsData["requesting"]["id"]}rU btn_a_${invitationsData["userReceiving"]["\u0000App\\Entity\\User\u0000id"]}" data-b="${invitationsData["requesting"]["balise"]}" id="annule_invitation_js">Annuler l'invitation

							<i class="fa-solid fa-user-plus text-light"></i> 
						 </button>
					</div>
				`
				const liContenus = `
					<li class="demande" data-rank=${invitationsData["requesting"]["id"]}>
						<div class="row invitation-conf">
							${subRequestContent}				
						</div> 
					</li>  
				`
				const cardInvitations = document.querySelectorAll(".demande")
				let array=[]
				for (let cardInvitation of cardInvitations) {
					array.push(cardInvitation.dataset.rank)
				}
				// console.log(array)
				if (!array.includes(invitationsData["requesting"]["id"].toString())) {
					ulContents.innerHTML += liContenus
					createInviationOnglet()
				}
			} else {
				const cardInvitations = document.querySelectorAll(".invitation")
				let array=[]
				for (let cardInvitation of cardInvitations) {
					array.push(cardInvitation.dataset.rank)
				}
				console.log(array)
				if (array.includes(invitationsData["requesting"]["id"].toString())) {
					const li = document.querySelector(`li[data-rank="${invitationsData["requesting"]["id"]}"]`)
					li.parentNode.removeChild(li)

				}
			}
			
			
			
		}
	}
})

function createInviationOnglet() {
	
	var onglets = document.getElementById("onglets");
	var contenus = document.getElementById("contenus");

	var liOnglet = onglets.getElementsByTagName("li");
	var liContenuInvitations = contenus.getElementsByClassName("invitation");
 	var liContenuDemandes = contenus.getElementsByClassName("demande");

	if (liContenuInvitations.length > 0) {
		liOnglet[0].classList.toggle("actif");
		for (let liContenuInvitation of liContenuInvitations) {
			liContenuInvitation.classList.toggle("actif");
		}
	} else if(liContenuDemandes.length > 0) {
		liOnglet[1].classList.toggle("actif");
		for (let liContenuDemande of liContenuDemandes) {
			liContenuDemande.classList.toggle("actif");

		}
	}else {
		
	}

	for (var i = 0; i < liOnglet.length; i++){

		liOnglet[i].addEventListener("click", function(e){
		

			/*for (var j = 0; j < liOnglet.length; j++){
				liOnglet[j].classList.toggle("activ");
			}*/

			if (e.target.classList.contains("invit-r")) {
				e.target.classList.toggle("actif");
				for (let liContenuInvitation of liContenuInvitations) {
					liContenuInvitation.classList.toggle("actif");

				}
				liOnglet[1].classList.toggle("actif");
				for (let liContenuDemande of liContenuDemandes) {
					liContenuDemande.classList.toggle("actif");

				}
				
			} else {
				e.target.classList.toggle("actif");
				for (let liContenuDemande of liContenuDemandes) {
					liContenuDemande.classList.toggle("actif");

				}
				liOnglet[0].classList.toggle("actif");
				for (let liContenuInvitation of liContenuInvitations) {
					liContenuInvitation.classList.toggle("actif");
				}
			}
		
		});
	}

	if (document.querySelector("#confirm_invitation_js")) {
		document.querySelector("#confirm_invitation_js").addEventListener("click", function (e) { 
			const id = e.target.classList[2].replace(/[^0-9]/g, "")
			const idReceiverNotif = e.target.classList[3].replace(/[^0-9]/g, "")
			const balise = e.target.dataset.b
			console.log("balise" + balise)
			const url =`/user/invitations/confirm/${id}/${idReceiverNotif}/${balise}`
			fetch(url)
				.then(res => {
					console.log(res.json())
					if (res.ok && res.status == 200) { 
						document.querySelector(".remove_invitation").parentElement.removeChild(document.querySelector(".remove_invitation"));
					}
				})
			
		})
	}
	if (document.querySelector("#supre_invitation_js")) {
		document.querySelector("#supre_invitation_js").addEventListener("click", function (e) { 
			const id = e.target.classList[2].replace(/[^0-9]/g, "")
			const idReceiverNotif=e.target.classList[3].replace(/[^0-9]/g, "")
			const balise=e.target.dataset.b
			const url =`/user/invitations/reject/${id}/${idReceiverNotif}/${balise}`
			fetch(url)
				.then(res => {
					if (res.ok && res.status == 200) { 
						document.querySelector(".remove_invitation").parentElement.removeChild(document.querySelector(".remove_invitation"));
					}
				})
		})
	}

	if (document.querySelector("#annule_invitation_js")) {
		document.querySelector("#annule_invitation_js").addEventListener("click", function (e) { 
			const id = e.target.classList[2].replace(/[^0-9]/g, "")
			const idReceiverNotif = e.target.classList[3].replace(/[^0-9]/g, "")
			const balise=e.target.dataset.b
			const url =`/user/invitations/annule/${id}/${idReceiverNotif}/${balise}`
			fetch(url)
				.then(res => {
					if (res.ok && res.status == 200) { 
						document.querySelector(".remove_invitation").parentElement.removeChild(document.querySelector(".remove_invitation"));
					}
				})
		})
	}

}


// var liContenu = contenus.getElementsByTagName("li");

// liOnglet[0].className = "actif";
// liContenu[0].className = "actif";

// for (var i = 0; i < liOnglet.length; i++){
	
// 	liOnglet[i].num = i;

// 	liOnglet[i].addEventListener("click", function(){

// 		var xmlhttp=new XMLHttpRequest();

// 		if(this.num == 0){
// 			//console.log("Invitation reçu");
// 		xmlhttp.onreadystatechange=function() {
// 			console.log(JSON.parse(this.responseText));
// 		}
// 		xmlhttp.open("GET","/user/invitation/all",true);
// 		xmlhttp.send();

// 		}else{
// 			console.log("Invitation envoyé");
// 			xmlhttp.onreadystatechange=function() {
// 				console.log(JSON.parse(this.responseText));
// 			}
// 			xmlhttp.open("GET","/user/demande/all",true);
// 			xmlhttp.send();
// 		}

// 		console.log(liOnglet[this.num]);

// 		for (var j = 0; j < liOnglet.length; j++){
// 			liOnglet[j].className="";
// 			liContenu[j].className="";
// 		}

// 		liOnglet[this.num].className="actif";
// 		liContenu[this.num].className = "actif";
// 		//liContenu[this.num].appendChild
// 	});
// }//fin function
