

//<b>${invitationsData["uPoster"]["\u0000App\\Entity\\User\u0000pseudo"]}</b>
const eventSource = new EventSource("/user/invitation/update");
eventSource.addEventListener("refreshInvitation", e => {
	const invitationsDatas = JSON.parse(e.data)
     
	console.log(invitationsDatas)
	const ulContents = document.querySelector("#contenus")
	// for(const childNode of ulContents.childNodes) 
	// 	ulContents.removeChild(childNode)
	for (let invitationsData of invitationsDatas) {
		if (invitationsData["requesting"]["types"] === "invitation") {
			let subRequestContent = ""
			if (invitationsData["requesting"]["is_wait"] == 1) {
				subRequestContent = `
				    <div class="col-md-6">
								<p> ${invitationsData["requesting"]["content"]}</p> 
					</div>
				    <div class="col-md-3"> 
							<button onclick="acceptInvitation(this)" class="btn btn-primary bt${invitationsData["requesting"]["id"]}rU btn_t_${invitationsData["uPoster"]["\u0000App\\Entity\\User\u0000id"]}" data-b="${invitationsData["requesting"]["balise"]}" data-tbt="${invitationsData["requesting"]["is_tribu"]}" id="confirm_invitation_js">Confirmer
								<i class="fa-solid fa-user-plus text-light"></i>
							</button> 
					</div>
					<div class="col-md-3"> 
							<button onclick="declineInvitation(this)" class="btn btn-danger bt${invitationsData["requesting"]["id"]}rU btn_r_${invitationsData["uPoster"]["\u0000App\\Entity\\User\u0000id"]}" data-b="${invitationsData["requesting"]["balise"]}" data-tbt="${invitationsData["requesting"]["is_tribu"]}" id="supre_invitation_js">Suprimer
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
				let array = []
				for (let cardInvitation of cardInvitations) {
					array.push(cardInvitation.dataset.rank)
				}
				console.log(array)
				if (!array.includes(invitationsData["requesting"]["id"].toString())) {
					ulContents.innerHTML += liContenus
				    initInviationOnglet()
				}
			} else {
				const cardInvitations = document.querySelectorAll(".invitation")
				let array = []
				for (let cardInvitation of cardInvitations) {
					array.push(cardInvitation.dataset.rank)
				}
				console.log(array)
				if (array.includes(invitationsData["requesting"]["id"].toString())) {
					const li = document.querySelector(`li[data-rank="${invitationsData["requesting"]["id"]}"]`)
					//li.parentNode.removeChild(li)
					li.remove()
				}
			}
		} else {
			let subRequestContent = ""
			if (invitationsData["requesting"]["is_wait"] == 1) {
				subRequestContent = `
				    
					<div class="col-md-9">
						 <p> ${invitationsData["requesting"]["content"]}</p> 
					 </div>
					<div class="col-md-3"> 
							 <button onclick="annuledDemand(this)" class="btn btn-primary bt${invitationsData["requesting"]["id"]}rU btn_a_${invitationsData["userReceiving"]["\u0000App\\Entity\\User\u0000id"]}" data-b="${invitationsData["requesting"]["balise"]}" data-tbt="${invitationsData["requesting"]["is_tribu"]}" id="annule_invitation_js">Annuler l'invitation

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
				let array = []
				for (let cardInvitation of cardInvitations) {
					array.push(cardInvitation.dataset.rank)
				}
				console.log(array)
				if (!array.includes(invitationsData["requesting"]["id"].toString())) {
					ulContents.innerHTML += liContenus
					initInviationOnglet()
				}
			} else {
				const cardDemandes = document.querySelectorAll(".demande")
				let array = []
				for (let cardDemande of cardDemandes) {
					array.push(cardDemande.dataset.rank)
				}
				console.log(array)
				if (array.includes(invitationsData["requesting"]["id"].toString())) {
					const li = document.querySelector(`li[data-rank="${invitationsData["requesting"]["id"]}"]`)
					//li.parentNode.removeChild(li)
					li.remove()

				}
			}
		}
	}
	
})

function initInviationOnglet() {

	var onglets = document.getElementById("onglets");
	var contenus = document.getElementById("contenus");

	let liOnglet = onglets.getElementsByTagName("li");
	var liContenuInvitations = contenus.getElementsByClassName("invitation");
	var liContenuDemandes = contenus.getElementsByClassName("demande");
	
	if(liContenuInvitations.length > 0 && liContenuDemandes.length > 0 ){
		liOnglet[0].classList.add("actif");
		for (let liContenuInvitation of liContenuInvitations) {
			liContenuInvitation.classList.add("actif");
		}
		liOnglet[1].classList.remove("actif");
		for (let liContenuDemande of liContenuDemandes) {
			liContenuDemande.classList.remove("actif");

		}
	}else if (liContenuInvitations.length > 0 ) {

		liOnglet[0].classList.add("actif");
		for (let liContenuInvitation of liContenuInvitations) {
			liContenuInvitation.classList.add("actif");
		}
	} else if (liContenuDemandes.length > 0 ) {
		//alert("Ato Zay ary")
		liOnglet[1].classList.add("actif");
		for (let liContenuDemande of liContenuDemandes) {
			liContenuDemande.classList.add("actif");

		}
	}
	

	addHookClick(liOnglet,liContenuInvitations,liContenuDemandes)

}

function addHookClick(liOnglet,liContenuInvitations,liContenuDemandes){
	for (var i = 0; i < liOnglet.length; i++) {


		liOnglet[i].addEventListener("click", function (e) {


			/*for (var j = 0; j < liOnglet.length; j++){
				liOnglet[j].classList.toggle("activ");
			}*/
            console.log(e.target)
			if (e.target.classList.contains("invit-r")) {
				//document.querySelector(".invit-d").classList.remove("actif")
				e.target.classList.add("actif");
				for (let liContenuInvitation of liContenuInvitations) {
					liContenuInvitation.classList.add("actif");

				}
				//console.log(liOnglet[1])
				liOnglet[1].classList.remove("actif");
				for (let liContenuDemande of liContenuDemandes) {
					console.log(liContenuDemande)
					liContenuDemande.classList.remove("actif");
				}

			} else {
				//document.querySelector(".invit-r").classList.remove("actif")
				e.target.classList.add("actif");
				for (let liContenuDemande of liContenuDemandes) {
					liContenuDemande.classList.add("actif");

				}
				liOnglet[0].classList.remove("actif");
				for (let liContenuInvitation of liContenuInvitations) {
					liContenuInvitation.classList.remove("actif");
				}
			}

		});
	}
}

	

function acceptInvitation(e){
    const id = e.classList[2].replace(/[^0-9]/g, "")
    const idReceiverNotif = e.classList[3].replace(/[^0-9]/g, "")
    const balise = e.dataset.b
    const tbt = e.dataset.tbt
	let nomTribu = e.parentElement.parentElement.previousElementSibling.querySelector(".profile-usertitle-job > p").textContent.split("invitation de rejoindre la tribu")[1]
    console.log("balise" + balise)
	let data = {nomTribu:nomTribu}
	console.log(nomTribu)
    const url = `/user/invitations/confirm/${id}/${idReceiverNotif}/${balise}/${tbt}`
    fetch(new Request(url, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }))
	.then(res => {
		console.log(res.json())
		if (res.ok && res.status == 200) {
			//document.querySelector(".remove_invitation").parentElement.removeChild(document.querySelector(".remove_invitation"));
			e.parentElement.parentElement.parentElement.remove();
			if(tbt == 1){
				document.querySelector("#succesMessageContent").textContent = "Félicitation ! Vous êtes maintenant membre de ce tribu"
				document.querySelector("#succesMessage").style.display="block";
				setTimeout(()=>{
					document.querySelector("#succesMessage").style.display="none";
				}, 5000)
			}
		}
    })
}

function declineInvitation(e){
	
    const id = e.classList[2].replace(/[^0-9]/g, "")
    const idReceiverNotif = e.classList[3].replace(/[^0-9]/g, "")
    const balise = e.dataset.b
    const tbt = e.dataset.tbt
    const url = `/user/invitations/reject/${id}/${idReceiverNotif}/${balise}/${tbt}`
    fetch(url)
        .then(res => {
            if (res.ok && res.status == 200) {
                //document.querySelector(".remove_invitation").parentElement.removeChild(document.querySelector(".remove_invitation"));
                e.parentElement.parentElement.parentElement.remove();
				if(tbt == 1){
                    document.querySelector("#succesMessageContent").textContent = "Félicitation ! L'invitation a été supprimée"
                    document.querySelector("#succesMessage").style.display="block";
                    setTimeout(()=>{
                        document.querySelector("#succesMessage").style.display="none";
                    }, 5000)
                }
            }
    })

}

function annuledDemand(e){
	
    const id = e.classList[2].replace(/[^0-9]/g, "")
    const idReceiverNotif = e.classList[3].replace(/[^0-9]/g, "")
    const balise = e.dataset.b
    const tbt = e.dataset.tbt
    const url = `/user/invitations/annule/${id}/${idReceiverNotif}/${balise}/${tbt}`
    fetch(url)
        .then(res => {
            if (res.ok && res.status == 200) {
                //document.querySelector(".remove_invitation").parentElement.removeChild(document.querySelector(".remove_invitation"));
                e.parentElement.parentElement.parentElement.remove();
				if(tbt == 1){
                    document.querySelector("#succesMessageContent").textContent = "Félicitation ! Votre demande a été annulée"
                    document.querySelector("#succesMessage").style.display="block";
                    setTimeout(()=>{
                        document.querySelector("#succesMessage").style.display="none";
                    }, 5000)
                }
            }
    })

}
