class ResponseAvis {

    constructor(rubrique) {
        if (rubrique == "resto") {
            this.rubrique = "restaurant";
        } else {
            this.rubrique = rubrique;
        }
        // console.log(this.rubrique);
    }
    /** Fonction de réaction d' un avis*/
    reagirAvis(elem) {
        let id = elem.getAttribute("data-id");
        let nb_reaction = document.querySelector(".avis_elie_js_" + id) ? document.querySelector(".avis_elie_js_" + id).textContent : 0;

        /** Post reaction from user */
        fetch("/" + this.rubrique + "/avis/push-reaction/" + id).then(d => d.json())
            .then(d => {
                if (d.result == "success") {
                    if (elem.classList.contains("text-primary")) {
                        elem.classList.remove("text-primary")

                        document.querySelector(".avis_elie_js_" + id).textContent = parseInt(nb_reaction) - 1
                        elem.setAttribute("title", "J'aime");

                    } else {
                        elem.classList.add("text-primary")

                        document.querySelector(".avis_elie_js_" + id).textContent = parseInt(nb_reaction) + 1
                        elem.setAttribute("title", "Je n'aime pas");
                    }
                }
            })


    }

    /** en cours d'une réponse d'un avis rubrique*/
    sendResponseAvis(elem) {

        let id_avis = elem.getAttribute("data-id");
        let comment = document.querySelector("#input_response_" + id_avis);
        let data = {
            avis_id: id_avis,
            commentaire: comment.value.trim()
        }

        elem.disabled = true
        elem.innerHTML = `<span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
        <span role="status">Envoi...</span>`

        let nb_reponse = document.querySelector(".avis_response_elie_js_" + id_avis).textContent

        fetch("/" + this.rubrique + "/avis/push-response", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        }).then(d => d.json())
            .then(d => {
                // console.log(d);
                let user = d.user
                if (d.result == "success") {
                    document.querySelector(".avis_response_elie_js_" + id_avis).textContent = parseInt(nb_reponse) + 1 + " réponse(s)"
                    // console.log("inserted");

                    let new_li = document.createElement("li")
                    new_li.classList = "card card-body"
                    let my_photo = user.photoProfil ? "/public" + user.photoProfil : "/public/uploads/users/photos/default_pdp.png"
                    let my_name = user.firstname + " " + user.lastname

                    let new_post = `
                    <div class="d-flex align-items-center">
                        <div class="content_profil_image me-2">
                            <img class="profil_image_v2" src="${my_photo}" alt="User">
                        </div>
                        <div class="content_info">
                            <h5 class="text-point-9"> <small class="fw-bolder text-black">${my_name}</small></h5>
                            <small class="fst-italic"> ${settingDateToStringMonthDayAndYear(new Date())}</small>
                        </div>
                    </div>
                    <p>${comment.value.trim()}</p>
                    <div>
                        <span title="J'aime" data-id="${d.last_id}" class="badge rounded-pill text-bg-light cursor-pointer " onclick="reagirResponse(this)"><i class="fa-solid fa-thumbs-up"></i> J'aime</span>
                        . <i class="fa-regular fa-thumbs-up "></i> <small class=" avis_elie_js_${d.last_id}"> 0</small>
                        |
                        <span class="badge rounded-pill text-bg-light cursor-pointer" data-bs-toggle="collapse" data-bs-target="#collapseResponseInput2${d.last_id}"><i class="fa-solid fa-reply"></i> Répondre</span>
                        . <span class="cursor-pointer" data-bs-toggle="collapse" data-bs-target="#subresponseData_${d.last_id}"><i class="fa-solid fa-reply-all text-secondary"></i> <small class="text-primary avis_response_elie_js_${d.last_id}"> 0 réponse(s)</small></span>
                        <div class="collapse" id="collapseResponseInput2${d.last_id}">
                            <div class="d-flex mt-2 input-group">
                                <input class="form-control" id="input_response_2_${d.last_id}" placeholder="Ajouter une réponse...">
                                <button data-id="${d.last_id}" class="btn btn-outline-primary btn-sm" onclick="sendResponseForResponseAvis(this)"><i class="fa-solid fa-paper-plane"></i></button>
                            </div>
                        </div>
                    </div>
                `
                    new_li.innerHTML = new_post

                    document.querySelector("#collapseResponseData" + id_avis).classList.add("show")

                    document.querySelector("#collapseResponseData" + id_avis + " > ul.wtree").prepend(new_li)

                    let new_nb_resp = parseInt(nb_reponse) + 1
                    document.querySelector("#collapseResponseData" + id_avis + " > h5").textContent = new_nb_resp + `${new_nb_resp > 1 ? " Réponses" : " Réponse"}`

                    document.querySelector("#input_response_" + id_avis).value = ""

                    elem.disabled = false

                    elem.innerHTML = `<i class="fa-solid fa-paper-plane"></i>`

                }
            })
    }

    /** Affichage plus des responses de la list d'avis */
    showMoreResponseAvis(elem) {

        let id_avis = elem.getAttribute("data-id")

        let div_resp = document.querySelector("#collapseResponseData" + id_avis)

        let nexts_li_d_none = div_resp.querySelectorAll("ul.wtree > li.d-none")

        let l = nexts_li_d_none.length - 1


        let ctx = ""
        if (l > 1) {
            ctx = "Voir les " + l + " réponses"
        } else if (l == 1) {
            ctx = "Voir l'une réponse"
        } else {
            ctx = ""
        }
        // let ctx = l > 1 ? "Voir les "+ l+" réponses" : "Voir l'une réponse"
        if (nexts_li_d_none.length > 1) {
            nexts_li_d_none[0].classList.remove("d-none")
            elem.textContent = ctx
        }
        else {
            nexts_li_d_none[0].classList.remove("d-none")
            elem.textContent = "Voir moins"
            elem.setAttribute("onclick", "showMinusResponseAvis(this)")
        }

    }

    /** Affichage moins d'avis */
    showMinusResponseAvis(elem) {

        let id_avis = elem.getAttribute("data-id")

        let div_resp = document.querySelector("#collapseResponseData" + id_avis)

        let nexts_li = div_resp.querySelectorAll("ul.wtree > li")


        for (let i = nexts_li.length - 2; i >= 3; i--) {
            nexts_li[i].classList.add("d-none")
        }
        let nexts_li_d_none = div_resp.querySelectorAll("ul.wtree > li.d-none")

        elem.setAttribute("onclick", "showMoreResponseAvis(this)")
        elem.classList.remove("d-none")
        let content = nexts_li_d_none.length > 1 ? "Voir les " + nexts_li_d_none.length + " réponses" : "Voir l'une réponse"
        elem.textContent = content

    }

    /** en cours d'une réaction de la reponse */
    reagirResponse(elem) {
        let id = elem.getAttribute("data-id");
        let nb_reaction = document.querySelector(".avis_elie_js_" + id) ? document.querySelector(".avis_elie_js_" + id).textContent : 0;

        /** Post reaction from user */
        fetch("/" + this.rubrique + "/avis/push-reaction-response/" + id, {
            method: "POST",
        }).then(resp => resp.json())
            .then(d => {
                // console.log(d);

                if (d.result == "success") {

                    if (elem.classList.contains("text-primary")) {
                        elem.classList.remove("text-primary")

                        document.querySelector(".avis_elie_js_" + id).textContent = parseInt(nb_reaction) - 1

                        elem.setAttribute("title", "J'aime");

                    } else {
                        elem.classList.add("text-primary")

                        document.querySelector(".avis_elie_js_" + id).textContent = parseInt(nb_reaction) + 1

                        elem.setAttribute("title", "Je n'aime pas");
                    }
                }
                // console.log("succès");
            })
    }

    /** en cours de la réaction de sous reponse */
    reagirSubResponse(elem) {
        let id = elem.getAttribute("data-id");
        let nb_reaction = document.querySelector(".avis_elie_js_2_" + id) ? document.querySelector(".avis_elie_js_2_" + id).textContent : 0;

        /** Post reaction from user */
        fetch("/" + this.rubrique + "/avis/push-reaction-subresponse/" + id).then(d => d.json())
            .then(d => {
                // console.log(d);
                if (d.result == "success") {
                    if (elem.classList.contains("text-primary")) {
                        elem.classList.remove("text-primary")

                        document.querySelector(".avis_elie_js_2_" + id).textContent = parseInt(nb_reaction) - 1

                        elem.setAttribute("title", "J'aime");

                    } else {
                        elem.classList.add("text-primary")

                        document.querySelector(".avis_elie_js_2_" + id).textContent = parseInt(nb_reaction) + 1

                        elem.setAttribute("title", "Je n'aime pas");
                    }
                }
                // console.log("succès");
            })
    }

    /** Envoi de la reponse d'une reponse dans un avis */
    sendResponseForResponseAvis(elem) {
        let id_avis = elem.getAttribute("data-id");
        let comment = document.querySelector("#input_response_2_" + id_avis);
        let data = {
            response_id: id_avis,
            commentaire: comment.value.trim()
        }

        let nb_reponse = document.querySelector(".avis_response_elie_js_" + id_avis).textContent

        elem.disabled = true
        elem.innerHTML = `<span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
        <span role="status">en cours...</span>`

        fetch("/" + this.rubrique + "/avis/push-subresponse-v2", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        }).then(d => d.json())
            .then(d => {
                // console.log(d);
                let user = d.user
                if (d.result == "success") {

                    document.querySelector(".avis_response_elie_js_" + id_avis).textContent = parseInt(nb_reponse) + 1 + " réponse(s)"
                    // console.log("inserted");

                    let new_li = document.createElement("li")
                    new_li.classList = "card card-body"
                    let my_photo = user.photoProfil ? "/public" + user.photoProfil : "/public/uploads/users/photos/default_pdp.png"
                    let my_name = user.firstname + " " + user.lastname

                    let new_post = `
                    <div class="d-flex align-items-center">
                        <div class="content_profil_image me-2">
                            <img class="profil_image_v2" src="${my_photo}" alt="User">
                        </div>
                        <div class="content_info">
                            <h5 class="text-point-9"> <small class="fw-bolder text-black">${my_name}</small></h5>
                            <small class="fst-italic"> ${settingDateToStringMonthDayAndYear(new Date())}</small>
                        </div>
                    </div>
                    <p>${comment.value.trim()}</p>
                    <div>
                        <span title="J'aime" data-id="${d.last_id.id}" class="badge rounded-pill text-bg-light cursor-pointer " onclick="reagirResponse(this)"><i class="fa-solid fa-thumbs-up"></i> J'aime</span>
                        . <i class="fa-regular fa-thumbs-up "></i> <small class=" avis_elie_js_2_${d.last_id.id}"> 0</small>
                        |
                        <span class="badge rounded-pill text-bg-light cursor-pointer" data-bs-toggle="collapse" data-bs-target="#collapseResponseInput2${d.last_id.id}"><i class="fa-solid fa-reply"></i> Répondre</span>
                        . <span class="cursor-pointer" data-bs-toggle="collapse" data-bs-target="#subresponseData_${d.last_id.id}"><i class="fa-solid fa-reply-all text-secondary"></i> <small class="text-primary avis_response_elie_js_${d.last_id.id}"> 0</small></span>
                        <div class="collapse" id="collapseResponseInput2${d.last_id.id}">
                            <div class="d-flex mt-2 input-group">
                                <input class="form-control" id="input_response_2_${d.last_id.id}" placeholder="Ajouter une réponse...">
                                <button data-id="${d.last_id.id}" class="btn btn-outline-primary btn-sm" onclick="sendResponseForResponseAvis(this)"><i class="fa-solid fa-paper-plane"></i></button>
                            </div>
                        </div>
                    </div>
                `
                    new_li.innerHTML = new_post

                    let show_resp = document.createElement("h5")
                    show_resp.classList = "badge rounded-pill text-bg-light"
                    let new_nb_resp = parseInt(nb_reponse) + 1
                    show_resp.innerHTML = new_nb_resp + `${new_nb_resp > 1 ? " Réponses" : " Réponse"}`

                    document.querySelector("#subresponseData_" + id_avis + " > h5") ?
                        document.querySelector("#subresponseData_" + id_avis + " > h5").remove() : ""

                    if (!document.querySelector("#subresponseData_" + id_avis)) {

                        let new_tree = document.createElement('ul')
                        new_tree.id = "subresponseData_" + id_avis
                        new_tree.classList = "wtree"
                        document.querySelector("#collapseResponseInput2" + id_avis).appendChild(new_tree)
                    }

                    document.querySelector("#subresponseData_" + id_avis).prepend(new_li)

                    document.querySelector("#subresponseData_" + id_avis).insertBefore(show_resp, new_li);

                    document.querySelector("#input_response_2_" + id_avis).value = ""

                    elem.disabled = false

                    elem.innerHTML = `<i class="fa-solid fa-paper-plane"></i>`

                }
            })
    }


    showResponseAvis(responses) {

        let ul_finale = ""

        if (responses.length > 0) {

            for (let reponse of responses) {

                let ul = `<ul class="collapse" id="subresponseData_${reponse.id}"><h5 class="badge rounded-pill text-bg-light">${reponse.all_response.length} ${reponse.all_response.length > 1 ? " Réponses" : " Réponse"}</h5>`
                let li = ""

                // Affichage des sous-reponse d'un rubrique si existe

                if (reponse.all_response.length > 0) {

                    ul += this.showResponseAvis(reponse.all_response)

                }
                ul += "</ul>"

                // Initialisation nombre de reaction et nombre de reponse par chaque reponse d'un avis rubrique
                let col_react_reponse = reponse.my_reaction == 1 ? "text-primary" : ""
                let title_react_reponse = reponse.my_reaction == 1 ? "Je n'aime pas" : "J'aime"
                let nb_reaction_reponse = ` . <i class="fa-regular fa-thumbs-up ${col_react_reponse}" ></i> <small class="${col_react_reponse} avis_elie_js_${reponse.id}"> ${reponse.all_reaction.length}</small>`
                let nb_reponse_reponse = ` . <span class="cursor-pointer" data-bs-toggle="collapse" data-bs-target="#subresponseData_${reponse.id}"><i class="fa-solid fa-reply-all text-secondary"></i> <small class="text-primary avis_response_elie_js_${reponse.id}"> ${reponse.all_response.length} réponse(s)</small></span>`

                li += `
			<li class="card card-body">
				<div class="d-flex align-items-center">
					<div class="content_profil_image me-2">
						<img class="profil_image_v2" src="/public${reponse.photo_profil ? reponse.photo_profil : "/uploads/users/photos/default_pdp.png"}" alt="User">
					</div>
					<div class="content_info">
						<h5 class="text-point-9"> <small class="fw-bolder text-black">${reponse.fullname}</small></h5>
						<small class="fst-italic"> ${settingDateToStringMonthDayAndYear(reponse.datetime)}</small>
					</div>
				</div>
				<p>${reponse.commentaire}</p>
	
				<div>
					<span title="${title_react_reponse}" data-id="${reponse.id}" class="badge rounded-pill text-bg-light cursor-pointer ${col_react_reponse}" onclick="reagirResponse(this)"><i class="fa-solid fa-thumbs-up"></i> J'aime</span>
					${nb_reaction_reponse}
					|
					<span class="badge rounded-pill text-bg-light cursor-pointer" data-bs-toggle="collapse" data-bs-target="#collapseResponseInput2${reponse.id}"><i class="fa-solid fa-reply"></i> Répondre</span>
					${nb_reponse_reponse}
					<div class="collapse" id="collapseResponseInput2${reponse.id}">
						<div class="d-flex mt-2 input-group">
							<input class="form-control" id="input_response_2_${reponse.id}" placeholder="Ajouter une réponse...">
							<button data-id="${reponse.id}" class="btn btn-outline-primary btn-sm" onclick="sendResponseForResponseAvis(this)"><i class="fa-solid fa-paper-plane"></i></button>
						</div>
					</div>
				</div>
	
				${ul}
			</li>
			
			`
                ul_finale += li
            }


            return ul_finale;
        }
    }


}