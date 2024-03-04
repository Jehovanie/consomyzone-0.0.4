if (document.querySelector("#fetch_adhesion_tribug_elie_js")) {
	///nav list news letter tribuG
	const callActionNewLetterFans = document.querySelector("#fetch_adhesion_tribug_elie_js");

	let new_letter_piece_joint_list = []; /// global variable to store all piece joint (file, image)

	callActionNewLetterFans.addEventListener("click", (e) => {
		e.preventDefault();

		removeActiveLinkOnG(document.querySelectorAll(".listNavBarTribu > a"), callActionNewLetterFans)

		///change title
		document.querySelector(".textIndicationNantaJs").textContent = "Demandes d'adhésions";

		///show loading indicator
		document.querySelector(".content_bloc_jheo_js").innerHTML = `
            <div class="spinner-grow text-info d-block mx-auto" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        `;

		///fetch details user and tribuG
		fetch("/tributG/adhesion/list")
            .then(response => {
                if (!response.ok) {
                    throw new Error("Not 404 response", {cause: response});
                } else {
                    return response.text()
                }
            })
            .catch(error => {
                console.log(error)
            })
            .then( response => {
                if( response ){
                    // document.querySelector(".textIndicationNantaJs").textContent = "Partisans"
                    if( document.querySelector(".content_bloc_jheo_js")){
                        document.querySelector(".content_bloc_jheo_js").innerHTML = response;

						$('div.content_bloc_jheo_js > div > div > div.card-body > table').DataTable({
							"language": {
								url: '//cdn.datatables.net/plug-ins/1.13.4/i18n/fr-FR.json',
							}
						});
                    }
                }
            }).catch(error => {
                console.log(error)
            })
	});
}

function validateAdhesion(elem){
	let id_user = elem.getAttribute("data-user");
	let email = elem.getAttribute("data-email");

	let data = {
		id_user: id_user,
		value : 1,
		email : email
	}

	fetch("/tribuG/setValid-member",{
		method: "POST",
    	headers: {
      		"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	})
	.then(resp=>resp.json())
	.then(response=>{
		
		if(response.statusCode === 200){

			swal({
                title: "Succès!",
                text: "Adhésion validée avec succès!",
                icon: "success",
                button: "Ok",
            }).then(r=>{
                document.querySelector("#fetch_adhesion_tribug_elie_js").click()
				let actu_now = parseInt(document.querySelector("#nb_adhesion_tg").textContent)
				if( actu_now == 1){
					document.querySelector("#nb_adhesion_tg").classList.add("d-none")
				}else{
					document.querySelector("#nb_adhesion_tg").textContent = actu_now - 1
				}
            });
			// console.log("Adhésion validée avec succès");
		}
	})
}

function refuseAdhesion(elem){
	let id_user = elem.getAttribute("data-user");
	let email = elem.getAttribute("data-email");

	let data = {
		id_user: id_user,
		value : 2,
		email : email
	}

	// /tribuG/setValid-member

	fetch("/tribuG/setValid-member",{
		method: "POST",
    	headers: {
      		"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	})
	.then(resp=>resp.json())
	.then(response=>{
		
		if(response.statusCode === 200){
			swal({
                title: "Succès!",
                text: "Adhésion réfusée avec succès!",
                icon: "success",
                button: "Ok",
            }).then(r=>{
                document.querySelector("#fetch_adhesion_tribug_elie_js").click()
				let actu_now = parseInt(document.querySelector("#nb_adhesion_tg").textContent)
				if( actu_now == 1){
					document.querySelector("#nb_adhesion_tg").classList.add("d-none")
				}else{
					document.querySelector("#nb_adhesion_tg").textContent = actu_now - 1
				}
            });
			// console.log("Adhésion réfusée avec succès");
		}
	})
}

function removeAdhesion(elem){
	let id_user = elem.getAttribute("data-user");
	let data ={
		id_user: id_user,
		email : elem.getAttribute("data-email"),
	}

	fetch("/tribuG/removeAdhesion-member",{
		method: "POST",
    	headers: {
      		"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	})
	.then(resp=>resp.json()).then(r=>{
		if(r.statusCode === 200){
            swal({
                title: "Succès!",
                text: "Adhésion supprimée avec succès!",
                icon: "success",
                button: "Ok",
            }).then(r=>{
                document.querySelector("#fetch_adhesion_tribug_elie_js").click()
				let actu_now = parseInt(document.querySelector("#nb_adhesion_tg").textContent)
				if( actu_now == 1){
					document.querySelector("#nb_adhesion_tg").classList.add("d-none")
				}else{
					document.querySelector("#nb_adhesion_tg").textContent = actu_now - 1
				}
			})
		}
	})
}