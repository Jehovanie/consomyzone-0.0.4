/*

import  IS_DEV_MODE from "./../app.js"

import { 
	mustBeInferior4, msgErrorAlertAvis, settingDateToStringMonthDayAndYear,   
} from "./../function.js";


import { ResponseAvis } from "./ResponseAvis.js"
import { showNoteGlobaleOnMarker } from "./map_cmz_instance.js";
import { openAvisRestoG } from "./../account/fetchRestoTributG.js"
import { openAvisGolfG } from "./../account/fetchGolfTributG.js"

*/



let currentUserId = 0;
let INSTANCE_RESPONSE_AVIS = null;
window.addEventListener("load", () => {
	////controle text...
	document.querySelector("#text-note").onkeyup = (e) => {
		if (document.querySelector(".flash-msg-ERREUR")) {
			document
				.querySelector(".flash-msg-ERREUR")
				.parentNode.removeChild(document.querySelector(".flash-msg-ERREUR"));
		}
		const value = e.target.value;
		mustBeInferior4(value, e.target);

		setTimeout(() => {
			e.target.style = "border:2px solid black;";
			document.querySelectorAll(".flash-msg-ERREUR").forEach((i) => {
				i.style = " transition:2s ease-in-out; transform: translateX(-25px); opacity: 0;";
			});
		}, 5000);
	};

	////rest name of the title modal
	if (document.querySelector(".close_modal_input_avis_jheo_js")) {
		document.querySelector(".close_modal_input_avis_jheo_js").addEventListener("click", () => {
			deleteOldValueInputAvis();
			document.querySelector(".title_modal_jheo_js").innerHTML = "Donnée votre avis.";
			document.querySelector(".send_avis_jheo_js").setAttribute("onclick", "addAvis()");

			initializeMediaTools();
		});
	}
});

function showAvis(currentUserId, idItem) {
	// const details= document.querySelector("#details-coord");
	// const type= details.getAttribute("data-toggle-type");
	let details = document.querySelector("#details-coord")
		? document.querySelector("#details-coord")
		: document.querySelector(`.item_carrousel_${idItem}_jheo_js`);
	let type = details.getAttribute("data-toggle-type");

	const btn_update = document.querySelector(".send_avis_jheo_js");
	if (!btn_update.classList.contains("btn-warning")) {
		btn_update.classList.add("btn-warning");
	}

	let path_link = "";
	let rubrique_name = "";
	if (type === "golf") {
		path_link = `/avis/golf/global/${idItem}`;
		rubrique_name = "Golf";
	} else if (type === "resto") {
		path_link = `/avis/restaurant/global/${idItem}`;
		rubrique_name = "Restaurant";
	}

	fetch(path_link, {
		methode: "GET",
	})
		.then((r) => r.json())
		.then((responses) => {
			const jsons = responses.data;
			const user = responses.currentUser;
			////delete chargement ...
			document.querySelector(".all_avis_jheo_js").innerHTML = "";

			if (jsons.length > 0) {
				if (document.querySelector(".card_avis_empty_jheo_js")) {
					document.querySelector(".card_avis_empty_jheo_js").remove();
				}

				for (let json of jsons) {
					createShowAvisAreas(json, user.id, idItem);
				}
			} else {
				document.querySelector(".all_avis_jheo_js").innerHTML = `
                <div class="card mb-2 card_avis_empty_jheo_js">
                    <div class="card-body">
                        <div class="avis_content">
                            <div class="text-danger text-center">
                                Actuellement, il n'y a pas encore d'avis sur cette ${rubrique_name}
                            </div>
                        </div>
                    </div>
                </div>
            `;
			}
		});
}

/**
 * Create new avis resto in first time
 */
function addAvis(idItemRubrique = null) {
	let audioBase64 = document.querySelector(".vocal_display_elie_js > div > audio.create");
	let imageBase64 = document.querySelector(".vocal_display_elie_js > div > img.create");
	let videoBase64 = document.querySelector(".vocal_display_elie_js > div > video.create");

	if (audioBase64 || imageBase64 || videoBase64) {
		if (document.querySelector("#text-note").value === "") {
			msgErrorAlertAvis({ message: "no content" });
			return 0;
		} else {
			document.querySelector(".btn_open_modal_list_avis_jheo_js").click();
		}
	} else {
		if (document.querySelector("#text-note").value === "" || document.querySelector("#message-text").value === "") {
			msgErrorAlertAvis({ message: "no content" });
			return 0;
		} else {
			document.querySelector(".btn_open_modal_list_avis_jheo_js").click();
		}
	}

	// if (document.querySelector("#text-note").value === "" || document.querySelector("#message-text").value === "") {
	// 	msgErrorAlertAvis({ message: "no content" });
	// 	return 0;
	// } else {
	// 	document.querySelector(".btn_open_modal_list_avis_jheo_js").click();
	// }

	///// remove alert card empty avis and add chargement spinner
	if (document.querySelector(".card_avis_empty_jheo_js")) {
		document.querySelector(".card_avis_empty_jheo_js").remove();
	}

	///// remove alert card and add chargement spinner
	if (document.querySelector(".all_avis_jheo_js")) {
		document.querySelector(".all_avis_jheo_js").innerHTML = `
            <div class="d-flex justify-content-center align-items-center spinner_jheo_js">
                <div class="spinner-border m-3" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
        `;
	}

	let details = document.querySelector("#details-coord")
		? document.querySelector("#details-coord")
		: document.querySelector(`.item_carrousel_${idItemRubrique}_jheo_js`);
	let type = details.getAttribute("data-toggle-type");

	let newUserId = parseInt(
		document.querySelector(".content_body_details_jheo_js").getAttribute("data-toggle-user-id")
	);

	let avis = document.querySelector("#message-text").value;
	let note = document.querySelector("#text-note").value;
	note = note.replace(/,/g, ".");

	let type_avis = "text";

	if (audioBase64) {
		type_avis = "audio";
		avis = audioBase64.src;
	}
	if (imageBase64) {
		type_avis = "image";
		avis = imageBase64.src;
	}
	if (videoBase64) {
		type_avis = "video";
		avis = videoBase64.src;
	}

	try {
		mustBeInferior4(note, document.querySelector("#text-note"), true);
	} catch (e) {
		msgErrorAlertAvis(e);
	}
	const requestParam = { note: parseFloat(note), avis: avis, type: type_avis };

	deleteOldValueInputAvis(); //// delet input and text

	let idItem = 0;
	let path_link = "";
	if (type === "golf") {
		idItem = idItemRubrique != null ? idItemRubrique : details.getAttribute("data-toggle-id-golf");
		path_link = `/avis/golf/${idItem}`;
	} else if (type === "resto") {
		idItem = idItemRubrique != null ? idItemRubrique : details.getAttribute("data-toggle-id-resto");
		path_link = `/avis/restaurant/${idItem}`;
	}

	////send data to the backend server
	const request = new Request(path_link, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify(requestParam),
	});

	fetch(request)
		.then((r) => r.json())
		.then((response) => {
			// console.log(response);

			///// generate list avis in modal
			showModifArea(idItem, newUserId);

			//// update number avis in details resto
			if (document.querySelector("#see-tom-js") || document.querySelector(`#see-tom-js${idItem}`)) {
				const parent = document.querySelector("#see-tom-js")
					? document.querySelector("#see-tom-js")
					: document.querySelector(`#see-tom-js${idItem}`);
				////get total number avis and update
				showNemberOfAvis(idItem, parent);

				/// get global note and update global notes in details resto
				showNoteGlobale(idItem);
			}

			if (document.querySelector(".content_avis_person_hidden_jheo_js")) {
				document.querySelector(".content_avis_person_hidden_jheo_js").setAttribute("data-avis-note", note);
				document.querySelector(".content_avis_person_hidden_jheo_js").setAttribute("data-avis-text", avis);
			}

			const state = response.state;

			let total_note = 0;
			state.forEach((item) => {
				total_note += parseFloat(item.note);
			});

			if (
				window.location.href.includes("/user/tribu/my-tribu-t") === false ||
				window.location.href.includes("/user/account") === false
			) {
				showNoteGlobaleOnMarker(idItem, total_note / state.length, type);
			}

			initializeMediaTools();
		});
}

/**
 * Get number total avis resto and setting
 * @param {*} idItem
 * @param {*} parent
 */
function showNemberOfAvis(idItem, parent) {
	let details = document.querySelector("#details-coord")
		? document.querySelector("#details-coord")
		: document.querySelector(`.item_carrousel_${idItem}_jheo_js`);
	let type = details.getAttribute("data-toggle-type");

	let path_link = "";
	if (type === "golf") {
		path_link = `/nombre/avis/golf/${idItem}`;
	} else if (type === "resto") {
		path_link = `/nombre/avis/restaurant/${idItem}`;
	}

	fetch(path_link).then((r) => {
		r.json().then((json) => {
			const nombreAvis = json["nombre_avis"];
			createNombreAvisContainer(parent, nombreAvis);
		});
	});
}

/**
 * display all avis resto and reset input note and avis resto
 */
function showListAvie(idItem = null) {
	////delete all avis inside and add chargement
	if (document.querySelectorAll(".all_avis_jheo_js")) {
		document.querySelector(".all_avis_jheo_js").innerHTML = `
            <div class="d-flex justify-content-center align-items-center spinner_jheo_js">
                <div class="spinner-border m-3" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
        `;
	}

	if (document.querySelectorAll(".card_avis_resto_jheo_js")) {
		document.querySelectorAll(".card_avis_resto_jheo_js").forEach((item) => item.remove());
	}

	if (document.querySelector(".send_avis_jheo_js")) {
		//// reset function add avis resto
		if (document.querySelector(".send_avis_jheo_js").hasAttribute("onclick")) {
			document.querySelector(".send_avis_jheo_js").setAttribute("onclick", "addAvis()");
		}

		deleteOldValueInputAvis(); //// delet input and text
	}

	let newIdItem = 0;
	if (document.querySelector("#details-coord")) {
		let details = document.querySelector("#details-coord");
		if (details.getAttribute("data-toggle-id-golf")) {
			newIdItem = details.getAttribute("data-toggle-id-golf");
			// Initialisation de la classe ResponseAvis dans la rubrique golf
			INSTANCE_RESPONSE_AVIS = new ResponseAvis("golf")
		} else if (details.getAttribute("data-toggle-id-resto")) {
			newIdItem = details.getAttribute("data-toggle-id-resto");
			// Initialisation de la classe ResponseAvis dans la rubrique restaurant
			INSTANCE_RESPONSE_AVIS = new ResponseAvis("restaurant")
		}
	}
	newIdItem = idItem != null ? idItem : newIdItem;

	const userId = document.querySelector(".content_body_details_jheo_js").getAttribute("data-toggle-user-id");
	showAvis(userId, newIdItem);
}

/**
 * Rest input note and avis resto
 */
function deleteOldValueInputAvis() {
	document.querySelector(".note_number_jheo_js") ? (document.querySelector(".note_number_jheo_js").value = "") : null;
	document.querySelector(".note_avis_jheo_js") ? (document.querySelector(".note_avis_jheo_js").value = "") : null;
	document.querySelector(".note_avis_jheo_js")
		? (document.querySelector(".note_avis_jheo_js").disabled = false)
		: null;
	document.querySelector(".vocal_display_elie_js").innerHTML = "";
}

/**
 * Get all avis resto and check if the current connected is already send avis
 * @param {*} idItem
 * @param {*} currentUserId
 *
 * @return Generate html avis in modal
 */
function showModifArea(idItem, currentUserId) {
	let details = document.querySelector("#details-coord")
		? document.querySelector("#details-coord")
		: document.querySelector(`.item_carrousel_${idItem}_jheo_js`);
	let type = details.getAttribute("data-toggle-type");

	let path_link = "";
	if (type === "golf") {
		path_link = `/avis/golf/global/${idItem}`;
	} else if (type === "resto") {
		path_link = `/avis/restaurant/global/${idItem}`;
	}

	fetch(path_link)
		.then((r) => r.json())
		.then((responses) => {
			const jsons = responses.data;
			const user = responses.currentUser;
			if (jsons) {
				//// before show all comments, delete the content.
				document.querySelector(".all_avis_jheo_js").innerHTML = "";
				// if (screen.width <= 991) {
				//     document.querySelector(`.all_avis_${idItem}_jheo_js`).innerHTML = "";
				// } else {
				// }

				for (let json of jsons) {
					//// create single avis, and pass state of currect id
					createShowAvisAreas(json, user.id, idItem);
				}
			}
		});
}

/*
 *show comment without btn modification
 */
function createShowAvisAreasOld(json, currentUserId, idItem = 0, rubrique_type = null) {
	let startIcon = "";
	let rate = parseFloat(json.note) - Math.trunc(parseFloat(json.note));
	let rateYellow = rate * 100;
	let rateBlack = 100 - rateYellow;

	let modalebtnModife = "";

	let avis_template = "";

	if (json.type == "audio") {
		avis_template = ` <audio controls src="${json.avis}">
	  					</audio>`;
	} else if (json.type == "image") {
		avis_template = ` <img src="${json.avis}"/>`;
	} else if (json.type == "video") {
		avis_template = ` <video height="100" class="show-avis-media" controls src="${json.avis}">
	  					</video>`;
	} else {
		avis_template = json.avis;
	}

	// console.log(json);

	modalebtnModife = `
		<div class="content_action">
			<button type="button" class="btn btn-outline-primary edit_avis" data-bs-dismiss="modal" data-bs-toggle="modal" data-bs-target="#modalAvis" onclick="settingAvis('${
				json.id
			}' ,'${json.note}' , '${json.avis.replace("\n", "")}', '${idItem}', '${rubrique_type}', '${json.type}')">
				<i class="fa-solid fa-pen-to-square"></i>
			</button>
		</div>
	`;

	for (let i = 0; i < 4; i++) {
		if (i < parseInt(json.note)) {
			startIcon += `<i class="fa-solid fa-star checked" style="color: rgb(245, 209, 101);"></i>`;
		} else {
			if (rate != 0) {
				startIcon += `<i class="fa-solid fa-star" data-rank="1" style ="background: linear-gradient(90deg, #F5D165 ${rateYellow}%, #000 ${rateBlack}%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;" }}"></i>`;
				rate = 0;
			} else {
				startIcon += `<i class="fa-solid fa-star" data-rank="1"></i>`;
			}
		}
	}

	const spec_selector = currentUserId == json.user.id && currentUserId != null ? "my_comment_jheo_js" : "";
	const editHTMl = modalebtnModife;
	const isOwnComment = currentUserId == json.user.id ? editHTMl : "";

	let user_profil = json.user.photo ? json.user.photo : "/uploads/users/photos/default_pdp.png";
	user_profil = IS_DEV_MODE ? user_profil : "/public" + user_profil;

	const singleAvisHtml = `
        <div class="card mb-2 card_avis_resto_jheo_js ${spec_selector}" 
		     data-avis-note="${json.note}" data-avis-text="${json.avis}">
            <div class="card-body">
                <div class="avis_content">
                    <div>
                        <div class="d-flex justify-content-between align-items-start">
                            <div class="d-flex justify-content-between align-items-start">
                                <div class="content_profil_image me-2">
                                    <img class="profil_image" src="${user_profil}" alt="User">
                                </div>
                                <div class="content_info">
                                    <h5 class="text-point-9"> <small class="fw-bolder text-black"> ${
										json.user.fullname
									}</small></h5>
                                    <cite class="font-point-6"> ${settingDateToStringMonthDayAndYear(
										json.datetime
									)}</cite>
                                </div>
                            </div>
                            <div class="content_start">
                                <p class="mb-2"> ${startIcon}</p>
                                ${isOwnComment}
                            </div>
                        </div>

                        <div class="mt-2">
                            <p class="text-point-9"> ${avis_template} </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

	document.querySelector(`.all_avis_jheo_js`).innerHTML += singleAvisHtml;
}

/*
 *@author Elie
 *show comment without btn modification
 */
 function createShowAvisAreas(json, currentUserId, idItem = 0, rubrique_type = null) {
	let startIcon = "";
	let rate = parseFloat(json.note) - Math.trunc(parseFloat(json.note));
	let rateYellow = rate * 100;
	let rateBlack = 100 - rateYellow;

	// console.log(json);
	let avis_id = json.id

	let modalebtnModife = "";

	let avis_template = ""

	if (json.type == "audio") {
		avis_template = ` <audio controls src="${json.avis}">
	  					</audio>`
	} else if (json.type == "image") {
		avis_template = ` <img src="${json.avis}"/>`
	} else if (json.type == "video") {
		avis_template = ` <video height="100" class="show-avis-media" controls src="${json.avis}">
	  					</video>`
	} else {
		avis_template = json.avis
	}

	// console.log(json);
	// Initialisation de nombre de reaction et nombre reponse par avis

	let col_react = json.reaction == 1? "text-primary" :""
	let title_react = json.reaction == 1? "Je n'aime pas" :"J'aime"
	let nb_reaction= ` . <i class="fa-regular fa-thumbs-up ${col_react}" ></i> <small class="${col_react} avis_elie_js_${json.id}"> ${json.all_reaction.length}</small>`

	let nb_reponse= ` . <span class="btn_event rounded-pill text-bg-light cursor-pointer" data-bs-toggle="collapse" data-bs-target="#collapseResponseData${json.id}"><i class="fa-solid fa-reply-all text-secondary"></i> <small class="text-primary avis_response_elie_js_${json.id}"> ${json.all_response.length} réponse(s)</small></span>`

	// console.log(json.all_response);

	let li = ""
	let iter = 0
	
	// Affichage des reponse d'un rubrique;

	if(json.all_response.length > 0){

		li = INSTANCE_RESPONSE_AVIS.showResponseAvis(json.all_response)

	}

	let old_avis = json.avis.replaceAll("\n", "").replaceAll("'", "\\'").replaceAll('"', '\\"')

	modalebtnModife = `
		<div class="content_action">
			<button type="button" class="btn btn-outline-primary edit_avis" data-bs-dismiss="modal" data-bs-toggle="modal" data-bs-target="#modalAvis" onclick="settingAvis('${json.id
		}' ,'${json.note}' , '${old_avis}', '${idItem}', '${rubrique_type}', '${json.type}')">
				<i class="fa-solid fa-pen-to-square"></i>
			</button>
		</div>
	`;

	for (let i = 0; i < 4; i++) {
		if (i < parseInt(json.note)) {
			startIcon += `<i class="fa-solid fa-star checked" style="color: rgb(245, 209, 101);"></i>`;
		} else {
			if (rate != 0) {
				startIcon += `<i class="fa-solid fa-star" data-rank="1" style ="background: linear-gradient(90deg, #F5D165 ${rateYellow}%, #000 ${rateBlack}%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;" }}"></i>`;
				rate = 0;
			} else {
				startIcon += `<i class="fa-solid fa-star" data-rank="1"></i>`;
			}
		}
	}


	const spec_selector = currentUserId == json.user.id && currentUserId != null ? "my_comment_jheo_js" : "";
	const editHTMl = modalebtnModife;
	const isOwnComment = currentUserId == json.user.id ? editHTMl : "";

	let user_profil = json.user.photo ? json.user.photo : "/uploads/users/photos/default_pdp.png";
	user_profil = IS_DEV_MODE ? user_profil : "/public" + user_profil;

	const singleAvisHtml = `
        <div class="card mb-2 card_avis_resto_jheo_js ${spec_selector}" 
		     data-avis-note="${json.note}" data-avis-text="${json.avis}">
            <div class="card-body">
                <div class="avis_content">
                    <div>
                        <div class="d-flex justify-content-between align-items-start">
                            <div class="d-flex justify-content-between align-items-start">
                                <div class="content_profil_image me-2">
                                    <img class="profil_image" src="${user_profil}" alt="User">
                                </div>
                                <div class="content_info">
                                    <h5 class="text-point-9"> <small class="fw-bolder text-black"> ${json.user.fullname
										}</small></h5>
                                    <cite class="font-point-6"> ${settingDateToStringMonthDayAndYear(
										json.datetime
									)}</cite>
                                </div>
                            </div>
                            <div class="content_start">
                                <p class="mb-2"> ${startIcon}</p>
                                ${isOwnComment}
                            </div>
                        </div>

                        <div class="mt-2">
                            <p class="text-point-9"> ${avis_template} </p>
                        </div>
						<div class="">
							<span title="${title_react}" data-id="${json.id}" class="btn_event badge rounded-pill text-bg-light cursor-pointer ${col_react}" onclick="reagirAvis(this)"><i class="fa-solid fa-thumbs-up"></i> J'aime</span>
							${nb_reaction}
							|
							<span class="btn_event badge rounded-pill text-bg-light cursor-pointer" data-bs-toggle="collapse" data-bs-target="#collapseResponseInput${json.id}"><i class="fa-solid fa-reply"></i> Répondre</span>
							${nb_reponse}
							<div class="collapse" id="collapseResponseInput${json.id}">
								<div class="d-flex mt-2 input-group">
									<input class="form-control" id="input_response_${json.id}" placeholder="Ajouter une réponse...">
									<button data-id="${json.id}" class="btn btn-outline-primary btn-sm" onclick="sendResponseAvis(this)"><i class="fa-solid fa-paper-plane"></i></button>
								</div>
							</div>
							<div class="mt-2 collapse" id="collapseResponseData${json.id}">
								<h5 class="badge rounded-pill text-bg-light">${json.all_response.length} ${json.all_response.length>1?" Réponses":" Réponse"}</h5>
								<ul class="wtree">
									${li}
								
								</ul>
							</div>
						</div>
                    </div>
                </div>
            </div>
        </div>
    `;

	document.querySelector(`.all_avis_jheo_js`).innerHTML += singleAvisHtml;

}

/**
 *  Update text content in parent element (ex: 12 avis)
 * @param {*} parent
 * @param {*} nombre
 */
function createNombreAvisContainer(parent, nombre) {
	parent.textContent = nombre + " avis";
}

function _kidMo(event) {
	const v = event.target.parentNode.parentNode.querySelector(".tnEmMeco").textContent;
	const stars = event.target.parentNode.querySelectorAll(".lioTe >i.checked").length;

	const targertTextArea = document.querySelector("#message-text-kidje3");

	targertTextArea.value = v;

	document.querySelector("#text-note-modif").value = stars;
}

/**
 * Get global note avis resto  and setting
 * @param {*} idItem
 */
function showNoteGlobale(idItem, globalNote = 0) {
	let details = document.querySelector("#details-coord")
		? document.querySelector("#details-coord")
		: document.querySelector(`.item_carrousel_${idItem}_jheo_js`);
	let type = details.getAttribute("data-toggle-type");

	let path_link = "";
	if (type === "golf") {
		path_link = `/avis/golf/global/${idItem}`;
		// Initialisation de la classe ResponseAvis dans la rubrique golf
		INSTANCE_RESPONSE_AVIS = new ResponseAvis("golf")
	} else if (type === "resto") {
		path_link = `/avis/restaurant/global/${idItem}`;
		// Initialisation de la classe ResponseAvis dans la rubrique restaurant
		INSTANCE_RESPONSE_AVIS = new ResponseAvis("restaurant")
	}

	fetch(path_link, {
		methode: "GET",
	})
		.then((r) => r.json())
		.then((responses) => {
			const jsons = responses.data;
			const user = responses.currentUser;

			let globalNote = 0.0;
			let totalNote = 0.0;
			if (jsons.length > 0) {
				for (let avis of jsons) {
					totalNote += parseFloat(avis["note"]);
				}
				globalNote = totalNote / jsons.length;
				createGlobalNote(globalNote, idItem);

				// CURRENT_MAP_INSTANCE.showNoteGlobaleOnMarker(idItem, globalNote)
			}
		});
}

/**
 * Prepare update avis resto
 */
function settingAvis(avisID, avisNote, avisText, idItem, rubriquType = null, type) {
	document.querySelector(".title_modal_jheo_js").innerHTML = "Modifier votre avis.";

	document.querySelector(".note_number_jheo_js").value = parseFloat(avisNote);
	document.querySelector(".vocal_display_elie_js").classList.remove("d-none");

	if (type == "audio") {
		document.querySelectorAll(".start_audio_avis_elie_js").forEach((e) => {
			e.classList.remove("d-none");
		});

		document.querySelector(".vocal_display_elie_js").innerHTML = `
			<div class="d-flex align-items-center clip">
				<audio id="audio_0" controls="" class="ml-5 update" src="${avisText}"></audio>
				<span style="color: red; margin-left: 5px; cursor: pointer; font-size: 16px;" onclick='initializeMediaTools()'>
				<i class="fa-solid fa-trash"></i><label style="margin-left: 3px; cursor: pointer;"> Supprimer.</label>
				</span>
			</div>
		`;
		document.querySelector(".note_avis_jheo_js").value = "";
		document.querySelector(".note_avis_jheo_js").disabled = true;
		document.querySelector(".record").classList.add("d-none");
	} else if (type == "video") {
		document.querySelectorAll(".start_audio_avis_elie_js").forEach((e) => {
			e.classList.remove("d-none");
		});

		document.querySelector(".vocal_display_elie_js").innerHTML = `
			<div class="d-flex align-items-center clip">
				<video id="video_0" controls="" class="show-avis-media ml-5 update" src="${avisText}"></video>
				<span style="color: red; margin-left: 5px; cursor: pointer; font-size: 16px;" onclick='initializeMediaTools()'>
				<i class="fa-solid fa-trash"></i><label style="margin-left: 3px; cursor: pointer;"> Supprimer.</label>
				</span>
			</div>
		`;
		document.querySelector(".note_avis_jheo_js").value = "";
		document.querySelector(".note_avis_jheo_js").disabled = true;
		document.querySelector(".record").classList.add("d-none");
	} else if (type == "image") {
		document.querySelectorAll(".start_audio_avis_elie_js").forEach((e) => {
			e.classList.remove("d-none");
		});

		document.querySelector(".vocal_display_elie_js").innerHTML = `
			<div class="d-flex align-items-center clip">
				<img id="image_0" class="img-update ml-5 update" src="${avisText}"></img>
				<span style="color: red; margin-left: 5px; cursor: pointer; font-size: 16px;" onclick='initializeMediaTools()'>
				<i class="fa-solid fa-trash"></i><label style="margin-left: 3px; cursor: pointer;"> Supprimer.</label>
				</span>
			</div>
		`;
		document.querySelector(".note_avis_jheo_js").value = "";
		document.querySelector(".note_avis_jheo_js").disabled = true;
		document.querySelector(".record").classList.add("d-none");
	} else {
		document.querySelector(".note_avis_jheo_js").value = avisText;
	}

	const btn_update = document.querySelector(".send_avis_jheo_js");

	if (document.querySelector(".cart_map_jheo_js")) {
		btn_update.setAttribute("onclick", `updateAvis('${avisID}', '${idItem}')`);
	} else {
		btn_update.setAttribute("onclick", `updateAvisInTribuT('${avisID}', '${idItem}', '${rubriquType}')`);
	}
}

function updateAvis(avisID, idItemRubrique) {
	let audioBase64 = document.querySelector(".vocal_display_elie_js > div > audio.create");
	let audioBase64_up = document.querySelector(".vocal_display_elie_js > div > audio.update");

	let imageBase64 = document.querySelector(".vocal_display_elie_js > div > img.create");
	let imageBase64_up = document.querySelector(".vocal_display_elie_js > div > img.update");

	let videoBase64 = document.querySelector(".vocal_display_elie_js > div > video.create");
	let videoBase64_up = document.querySelector(".vocal_display_elie_js > div > video.update");

	if (audioBase64 || audioBase64_up || imageBase64 || imageBase64_up || videoBase64 || videoBase64_up) {
		if (document.querySelector("#text-note").value === "") {
			msgErrorAlertAvis({ message: "no content" });
			return 0;
		} else {
			document.querySelector(".btn_open_modal_list_avis_jheo_js").click();
		}
	} else {
		if (document.querySelector("#text-note").value === "" || document.querySelector("#message-text").value === "") {
			msgErrorAlertAvis({ message: "no content" });
			return 0;
		} else {
			document.querySelector(".btn_open_modal_list_avis_jheo_js").click();
		}
	}

	// if (document.querySelector("#text-note").value === "" || document.querySelector("#message-text").value === "") {
	// 	msgErrorAlertAvis({ message: "no content" });
	// 	return 0;
	// } else {
	// 	document.querySelector(".btn_open_modal_list_avis_jheo_js").click();
	// }

	let details = document.querySelector("#details-coord")
		? document.querySelector("#details-coord")
		: document.querySelector(`.item_carrousel_${idItemRubrique}_jheo_js`);
	let type = details.getAttribute("data-toggle-type");

	///// remove alert card and add chargement spinner
	if (document.querySelector(".all_avis_jheo_js")) {
		document.querySelector(".all_avis_jheo_js").innerHTML = `
            <div class="d-flex justify-content-center align-items-center spinner_jheo_js">
                <div class="spinner-border m-3" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
        `;
	}

	let newUserId = parseInt(
		document.querySelector(".content_body_details_jheo_js").getAttribute("data-toggle-user-id")
	);

	let note = document.querySelector("#text-note").value.replace(/,/g, ".");
	let avis = document.querySelector("#message-text").value;

	let type_avis = "text";

	if (audioBase64) {
		type_avis = "audio";
		avis = audioBase64.src;
	}

	if (audioBase64_up) {
		type_avis = "audio_up";
		avis = audioBase64_up.src;
	}

	if (imageBase64) {
		type_avis = "image";
		avis = imageBase64.src;
	}
	if (imageBase64_up) {
		type_avis = "image_up";
		avis = imageBase64_up.src;
	}

	if (videoBase64) {
		type_avis = "video";
		avis = videoBase64.src;
	}
	if (videoBase64_up) {
		type_avis = "video_up";
		avis = videoBase64_up.src;
	}

	try {
		mustBeInferior4(note, document.querySelector("#text-note"), true);
	} catch (e) {
		msgErrorAlertAvis(e);
	}

	let idItem = 0;
	let path_link = "";

	if (type === "golf") {
		idItem = idItemRubrique ? idItemRubrique : details.getAttribute("data-toggle-id-golf");
		path_link = `/change/golf/${idItem}`;
	} else if (type === "resto") {
		idItem = idItemRubrique ? idItemRubrique : details.getAttribute("data-toggle-id-resto");
		path_link = `/change/restaurant/${idItem}`;
	}

	const requestParam = {
		avisID: avisID,
		note: parseFloat(note),
		avis: avis,
		type: type_avis,
	};

	deleteOldValueInputAvis(); //// delet input and text
	document.querySelector(".title_modal_jheo_js").innerHTML = "Donnée votre avis.";
	document.querySelector(".send_avis_jheo_js").setAttribute("onclick", "addAvis()");

	const request = new Request(path_link, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify(requestParam),
	});
	fetch(request)
		.then((r) => r.json())
		.then((response) => {
			// console.log(response);
			// document.querySelector(".btn_modal_avis_resto_jheo_js").innerText = 'Modifier votre avis'
			showModifArea(idItem, newUserId);

			if (document.querySelector("#see-tom-js") || document.querySelector(`#see-tom-js${idItem}`)) {
				const parent = document.querySelector("#see-tom-js")
					? document.querySelector("#see-tom-js")
					: document.querySelector(`#see-tom-js${idItem}`);
				////get total number avis and update
				showNemberOfAvis(idItem, parent);

				/// get global note and update global notes in details resto
				showNoteGlobale(idItem);
			}

			// document.querySelector(".send_avis_jheo_js").setAttribute("onclick", "addAvisResto()");
			document.querySelector(".title_modal_jheo_js").innerHTML = "Donnée votre avis.";

			// document.querySelector(".record").classList.remove("d-none")

			initializeMediaTools();

			const state = response.state;

			let total_note = 0;
			state.forEach((item) => {
				total_note += parseFloat(item.note);
			});

			if (
				!window.location.href.includes("/user/tribu/my-tribu-t") ||
				!window.location.href.includes("/user/account")
			) {
				showNoteGlobaleOnMarker(idItem, total_note / state.length, type);
			}
		});
}

/**
 * Update note global star rating
 * @param {*} globalNote
 */
function createGlobalNote(globalNote, idItem = null) {
	// console.log(document.querySelector(`.start_${idItem}_jheo_js`));
	let startHTML = "";
	let rate = globalNote - Math.trunc(globalNote);
	let rateYellow = rate * 100;
	let rateBlack = 100 - rateYellow;
	for (let i = 0; i < 4; i++) {
		if (i < Math.trunc(globalNote)) {
			startHTML += `<i class="fa-solid fa-star checked" style="color: rgb(245, 209, 101);"></i>`;
		} else {
			if (rate != 0) {
				startHTML += `<i class="fa-solid fa-star" data-rank="1" style ="background: linear-gradient(90deg, #F5D165 ${rateYellow}%, #000 ${rateBlack}%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;" }}"></i>`;
				rate = 0;
			} else {
				startHTML += `<i class="fa-solid fa-star" data-rank="1"></i>`;
			}
		}
	}
	if (document.querySelector(`.start_jheo_js${idItem}`)) {
		document.querySelector(`.start_jheo_js${idItem}`).innerHTML = startHTML;
	} else if (document.querySelector(".start_jheo_js")) {
		document.querySelector(".start_jheo_js").innerHTML = startHTML;
	}

	if (document.querySelector(`.start_${idItem}_jheo_js`)) {
		document.querySelector(`.start_${idItem}_jheo_js`).innerHTML = startHTML;
	}
}


function settingAvisCarrousel(idItem) {
	if (document.querySelector(".send_avis_jheo_js")) {
		const btn = document.querySelector(".send_avis_jheo_js");
		btn.setAttribute("onclick", `addAvis('${idItem}')`);
	}
}

function showListInTribuT(idItem, rubrique_type) {
	////delete all avis inside and add chargement
	if (document.querySelectorAll(".all_avis_jheo_js")) {
		document.querySelector(".all_avis_jheo_js").innerHTML = `
            <div class="d-flex justify-content-center align-items-center spinner_jheo_js">
                <div class="spinner-border m-3" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
        `;
	}

	if (document.querySelectorAll(".card_avis_resto_jheo_js")) {
		document.querySelectorAll(".card_avis_resto_jheo_js").forEach((item) => item.remove());
	}

	fetchListAvisInTribuT(idItem, rubrique_type);
}

function fetchListAvisInTribuT(idItem, rubrique_type) {
	let type = rubrique_type;

	let path_link = "";
	let rubrique_name = "";

	if (type === "golf") {
		path_link = `/avis/golf/global/${idItem}`;
		rubrique_name = "Golf";
		//Instaciation de la classe ResponseAvis pour golf
		INSTANCE_RESPONSE_AVIS = new ResponseAvis("golf")
	} else if (type === "resto") {
		path_link = `/avis/restaurant/global/${idItem}`;
		rubrique_name = "Restaurant";
		//Instaciation de la classe ResponseAvis pour golf
		INSTANCE_RESPONSE_AVIS = new ResponseAvis("resto")
	}

	fetch(path_link, {
		methode: "GET",
	})
		.then((r) => r.json())
		.then((responses) => {
			const jsons = responses.data;
			const user = responses.currentUser;

			////delete chargement ...
			document.querySelector(".all_avis_jheo_js").innerHTML = "";

			if (jsons.length > 0) {
				if (document.querySelector(".card_avis_empty_jheo_js")) {
					document.querySelector(".card_avis_empty_jheo_js").remove();
				}

				for (let json of jsons) {
					createShowAvisAreas(json, user.id, idItem, type);
				}
			} else {
				document.querySelector(".all_avis_jheo_js").innerHTML = `
                <div class="card mb-2 card_avis_empty_jheo_js">
                    <div class="card-body">
                        <div class="avis_content">
                            <div class="text-danger text-center">
                                Actuellement, il n'y a pas encore d'avis sur cette ${rubrique_name}
                            </div>
                        </div>
                    </div>
                </div>
            `;
			}
		});
}

function addAvisInTribuT(idItem, rubrique_type) {
	let type = rubrique_type;

	let audioBase64 = document.querySelector(".vocal_display_elie_js > div > audio.create");
	let imageBase64 = document.querySelector(".vocal_display_elie_js > div > img.create");
	let videoBase64 = document.querySelector(".vocal_display_elie_js > div > video.create");

	if (audioBase64 || imageBase64 || videoBase64) {
		if (document.querySelector("#text-note").value === "") {
			msgErrorAlertAvis({ message: "no content" });
			return 0;
		} else {
			document.querySelector(".btn_open_modal_list_avis_jheo_js").click();
		}
	} else {
		if (document.querySelector("#text-note").value === "" || document.querySelector("#message-text").value === "") {
			msgErrorAlertAvis({ message: "no content" });
			return 0;
		} else {
			document.querySelector(".btn_open_modal_list_avis_jheo_js").click();
		}
	}

	// if (document.querySelector("#text-note").value === "" || document.querySelector("#message-text").value === "") {
	// 	msgErrorAlertAvis({ message: "no content" });
	// 	return 0;
	// } else {
	// 	document.querySelector(".btn_open_modal_list_avis_jheo_js").click();
	// }

	///// remove alert card empty avis and add chargement spinner
	if (document.querySelector(".card_avis_empty_jheo_js")) {
		document.querySelector(".card_avis_empty_jheo_js").remove();
	}

	///// remove alert card and add chargement spinner
	if (document.querySelector(".all_avis_jheo_js")) {
		document.querySelector(".all_avis_jheo_js").innerHTML = `
            <div class="d-flex justify-content-center align-items-center spinner_jheo_js">
                <div class="spinner-border m-3" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
        `;
	}

	let avis = document.querySelector("#message-text").value;
	let note = document.querySelector("#text-note").value;
	note = note.replace(/,/g, ".");

	let type_avis = "text";

	if (audioBase64) {
		type_avis = "audio";
		avis = audioBase64.src;
	}
	if (imageBase64) {
		type_avis = "image";
		avis = imageBase64.src;
	}
	if (videoBase64) {
		type_avis = "video";
		avis = videoBase64.src;
	}

	try {
		mustBeInferior4(note, document.querySelector("#text-note"), true);
	} catch (e) {
		msgErrorAlertAvis(e);
	}
	const requestParam = { note: parseFloat(note), avis: avis, type: type_avis };

	deleteOldValueInputAvis(); //// delet input and text

	let path_link = "";
	if (type === "golf") {
		path_link = `/avis/golf/${idItem}`;
	} else if (type === "resto") {
		path_link = `/avis/restaurant/${idItem}`;
	}

	////send data to the backend server
	const request = new Request(path_link, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify(requestParam),
	});

	fetch(request)
		.then((r) => r.json())
		.then((response) => {
			const new_state = response.state;

			///// generate list avis in modal
			showListInTribuT(idItem, type);

			//// update note and avis in the list
			updateViewState(new_state, idItem, type);

			initializeMediaTools();
		});
}

function updateAvisInTribuT(avisID, idItemRubrique, rubriqueType) {
	let audioBase64 = document.querySelector(".vocal_display_elie_js > div > audio.create");
	let audioBase64_up = document.querySelector(".vocal_display_elie_js > div > audio.update");

	let imageBase64 = document.querySelector(".vocal_display_elie_js > div > img.create");
	let imageBase64_up = document.querySelector(".vocal_display_elie_js > div > img.update");

	let videoBase64 = document.querySelector(".vocal_display_elie_js > div > video.create");
	let videoBase64_up = document.querySelector(".vocal_display_elie_js > div > video.update");

	if (audioBase64 || audioBase64_up || imageBase64 || imageBase64_up || videoBase64 || videoBase64_up) {
		if (document.querySelector("#text-note").value === "") {
			msgErrorAlertAvis({ message: "no content" });
			return 0;
		} else {
			document.querySelector(".btn_open_modal_list_avis_jheo_js").click();
		}
	} else {
		if (document.querySelector("#text-note").value === "" || document.querySelector("#message-text").value === "") {
			msgErrorAlertAvis({ message: "no content" });
			return 0;
		} else {
			document.querySelector(".btn_open_modal_list_avis_jheo_js").click();
		}
	}

	// if (document.querySelector("#text-note").value === "" || document.querySelector("#message-text").value === "") {
	// 	msgErrorAlertAvis({ message: "no content" });
	// 	return 0;
	// } else {
	// 	document.querySelector(".btn_open_modal_list_avis_jheo_js").click();
	// }

	// if (document.querySelector("#text-note").value === "" || document.querySelector("#message-text").value === "") {
	// 	msgErrorAlertAvis({ message: "no content" });
	// 	return 0;
	// } else {
	// 	document.querySelector(".btn_open_modal_list_avis_jheo_js").click();
	// }

	let type = rubriqueType;

	///// remove alert card and add chargement spinner
	if (document.querySelector(".all_avis_jheo_js")) {
		document.querySelector(".all_avis_jheo_js").innerHTML = `
            <div class="d-flex justify-content-center align-items-center spinner_jheo_js">
                <div class="spinner-border m-3" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
        `;
	}

	let note = document.querySelector("#text-note").value.replace(/,/g, ".");
	let avis = document.querySelector("#message-text").value;
	let type_avis = "text";

	if (audioBase64) {
		type_avis = "audio";
		avis = audioBase64.src;
	}

	if (audioBase64_up) {
		type_avis = "audio_up";
		avis = audioBase64_up.src;
	}

	if (imageBase64) {
		type_avis = "image";
		avis = imageBase64.src;
	}
	if (imageBase64_up) {
		type_avis = "image_up";
		avis = imageBase64_up.src;
	}

	if (videoBase64) {
		type_avis = "video";
		avis = videoBase64.src;
	}
	if (videoBase64_up) {
		type_avis = "video_up";
		avis = videoBase64_up.src;
	}

	try {
		mustBeInferior4(note, document.querySelector("#text-note"), true);
	} catch (e) {
		msgErrorAlertAvis(e);
	}

	let idItem = 0;
	let path_link = "";

	if (type === "golf") {
		idItem = idItemRubrique ? idItemRubrique : details.getAttribute("data-toggle-id-golf");
		path_link = `/change/golf/${idItem}`;
	} else if (type === "resto") {
		idItem = idItemRubrique ? idItemRubrique : details.getAttribute("data-toggle-id-resto");
		path_link = `/change/restaurant/${idItem}`;
	}

	const requestParam = {
		avisID: avisID,
		note: parseFloat(note),
		avis: avis,
		type: type_avis,
	};

	deleteOldValueInputAvis(); //// delet input and text
	document.querySelector(".title_modal_jheo_js").innerHTML = "Donnée votre avis.";
	document.querySelector(".send_avis_jheo_js").setAttribute("onclick", `addAvisInTribuT('${idItem}', '${type}')`);

	const request = new Request(path_link, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify(requestParam),
	});
	fetch(request)
		.then((r) => r.json())
		.then((response) => {
			const new_state = response.state;

			///show list
			fetchListAvisInTribuT(idItem, type);

			///update current state
			updateViewState(new_state, idItem);

			initializeMediaTools();
		});
}

function updateViewState(new_state, idItem) {
	if (document.querySelector(`.data-note-${idItem}`)) {
		let note_moyenne = 0;
		let note_total = 0;
		new_state.forEach((item) => {
			const item_note = parseFloat(item.note);
			note_total += item_note;
		});

		note_moyenne = note_total / new_state.length;
		document.querySelector(`.data-note-${idItem}`).innerText = `${note_moyenne}/4`;
	}

	if (document.querySelector(`.data-avis-${idItem}`)) {
		document.querySelector(`.data-avis-${idItem}`).innerText = `${new_state.length} Avis`;
	}
}

/** Avis audio & avis vidéo*/

// var mediaRecorder;
let recordAudio = document.querySelector("#star_faniry_audio_record_js");
// let stopAudio = document.querySelector("#stop_audio_avis_elie_js");
// let recordCam = document.querySelector("#start_camera_avis_elie_js");
// let stopCam = document.querySelector("#stop_camera_avis_elie_js");
// let soundClips = document.querySelector(".vocal_display_elie_js");
let msgTxt = document.querySelector("#message-text");
// let cameraOptions = document.querySelector("#cameraOption");
// let microOptions = document.querySelector("#microOption");

let timeOutVideo = null;
let timeOutAudio = null;

let ico_svg = `<svg class="fs-3" style="width:40px; height:40px; margin:auto;" version="1.0" xmlns="http://www.w3.org/2000/svg"
	width="752.000000pt" height="752.000000pt" viewBox="0 0 752.000000 752.000000"
	preserveAspectRatio="xMidYMid meet">
   
   <g transform="translate(0.000000,752.000000) scale(0.100000,-0.100000)"
   fill="#0d6efd" stroke="none">
   <path d="M3566 5640 c-228 -61 -401 -238 -461 -468 -21 -82 -21 -232 0 -313
   106 -408 572 -608 940 -404 177 99 301 285 324 489 24 204 -38 375 -189 526
   -95 95 -184 147 -300 174 -88 21 -228 19 -314 -4z"/>
   <path d="M2290 5145 c-183 -52 -302 -221 -287 -411 21 -275 322 -443 569 -318
   142 72 231 250 206 411 -28 177 -183 318 -359 329 -48 2 -93 -1 -129 -11z"/>
   <path d="M2064 4249 c-121 -15 -246 -106 -297 -216 l-22 -48 0 -930 0 -930 34
   -63 c40 -74 104 -134 181 -171 l55 -26 1125 0 1125 0 57 27 c76 35 148 104
   184 175 l29 58 0 930 0 930 -31 60 c-37 71 -116 148 -179 176 -25 11 -82 24
   -127 29 -100 12 -2046 11 -2134 -1z"/>
   <path d="M5198 3884 c-255 -190 -471 -355 -480 -366 -17 -19 -18 -55 -18 -457
   1 -323 4 -441 13 -457 7 -12 223 -179 481 -373 356 -266 477 -351 498 -351 16
   0 40 11 58 27 l30 28 0 1117 c1 866 -2 1122 -12 1137 -14 24 -50 41 -83 41
   -17 0 -175 -113 -487 -346z"/>
   </g>
   </svg>
   `;

let ico_svg_2 = `
	<svg class="fs-3" style="width:40px; height:40px; margin:auto;" version="1.0" xmlns="http://www.w3.org/2000/svg"
	width="752.000000pt" height="752.000000pt" viewBox="0 0 752.000000 752.000000"
	preserveAspectRatio="xMidYMid meet">

	<g transform="translate(0.000000,752.000000) scale(0.100000,-0.100000)"
	fill="#0d6efd" stroke="none">
	<path d="M2820 5114 c-83 -124 -154 -232 -157 -240 -4 -12 146 -14 1097 -14
	951 0 1101 2 1097 14 -3 8 -74 116 -157 240 l-150 226 -790 0 -790 0 -150
	-226z"/>
	<path d="M1710 3365 l0 -1345 1186 2 1186 3 -1 140 c-2 147 13 262 48 373 10
	34 18 62 17 62 -1 0 -25 -11 -52 -24 -117 -57 -188 -71 -344 -70 -130 0 -154
	3 -225 27 -132 44 -219 99 -320 201 -100 101 -145 170 -186 284 -74 212 -63
	414 36 617 133 273 397 437 705 437 308 0 572 -164 705 -437 64 -131 79 -197
	79 -345 l1 -126 75 54 c89 64 224 130 338 166 245 77 536 76 769 -3 l83 -27 0
	678 0 678 -2050 0 -2050 0 0 -1345z m940 870 l0 -155 -315 0 -315 0 0 155 0
	155 315 0 315 0 0 -155z"/>
	<path d="M3643 3745 c-137 -37 -248 -131 -310 -262 -33 -68 -38 -89 -41 -170
	-4 -73 0 -106 16 -160 63 -205 235 -335 447 -336 219 -2 393 127 457 336 17
	56 20 86 16 162 -4 81 -10 104 -41 170 -99 207 -330 317 -544 260z"/>
	<path d="M5180 2881 c0 -84 -1 -90 -22 -96 -13 -4 -49 -19 -81 -33 l-58 -25
	-62 61 -62 62 -113 -113 -112 -112 62 -62 61 -62 -25 -58 c-14 -32 -29 -68
	-33 -80 -6 -22 -12 -23 -96 -23 l-89 0 0 -160 0 -160 90 0 c78 0 91 -3 96 -17
	3 -10 17 -46 31 -81 l26 -64 -61 -61 -62 -62 113 -113 112 -112 64 64 63 64
	62 -28 c33 -15 69 -30 79 -34 14 -5 17 -19 17 -96 l0 -90 160 0 160 0 0 90 c0
	77 3 91 18 96 9 4 45 19 78 34 l62 28 63 -64 64 -64 112 112 113 113 -65 65
	c-56 57 -63 67 -52 85 6 11 21 45 33 75 l23 55 88 5 88 5 3 158 3 157 -91 0
	c-77 0 -91 3 -96 18 -4 9 -19 45 -34 78 l-28 62 59 58 c32 32 59 63 59 69 0 5
	-48 58 -107 117 l-108 108 -61 -61 -62 -61 -81 33 -81 33 0 88 0 88 -160 0
	-160 0 0 -89z m273 -407 c68 -23 138 -90 172 -165 24 -55 27 -70 23 -143 -9
	-175 -119 -284 -296 -294 -77 -4 -87 -2 -147 27 -192 95 -241 334 -100 490 93
	102 212 132 348 85z"/>
	</g>
	</svg>

`;

let open_modal_avis = document.querySelector(".btn_modal_avis_resto_jheo_js");
if (open_modal_avis) {
	open_modal_avis.addEventListener("click", function () {
		initializeMediaTools();
	});
}

let brn_open_modal_avis = document.querySelectorAll("#data-note-elie-js");
brn_open_modal_avis.forEach((btn) => {
	btn.addEventListener("click", function () {
		initializeMediaTools();
	});
});
// if (brn_open_modal_avis) {
// 	brn_open_modal_avis.addEventListener("click", function () {
// 		initializeMediaTools()
// 	})
// }

let close_mediarecorders = document.querySelectorAll(".close_mediarecorder");
if (close_mediarecorders.length > 0) {
	close_mediarecorders.forEach((close_mediarecorder) => {
		close_mediarecorder.addEventListener("click", function () {
			initializeMediaTools();
		});
	});
}

let close_modal_avis = document.querySelector(".close_modal_input_avis_jheo_js");

let constraints = {
	audio: true,
	video: true,
	// video: {
	// 	width: { ideal: 1280 },
	// 	height: { ideal: 720 },
	// 	facingMode: "user"
	// },
	// deviceId : "default"
};

if (close_modal_avis) {
	close_modal_avis.addEventListener("click", function () {
		initializeMediaTools();
	});
}

let dateForName = new Date();
let month = parseInt(dateForName.getMonth()) + 1;
if (String(month).length < 2) {
	month = String("0" + month);
}

let dateString = dateForName.getDate() + "_" + month + "_" + dateForName.getFullYear();

/**
 //  * @author Elie
 //  * @utilisation : evenement de capture audio pour un avis rubrique
 //  */
// if(recordAudio) {
// 	recordAudio.addEventListener("click", (event) => {
	// 		$("#modalMicroOption").modal("show");
// 			$("#modalAvis").modal("hide");
// 		// if (soundClips.querySelector("audio") || soundClips.querySelector("video") || soundClips.querySelector("img")) {
		// 		// 	swal({
			// 		// 		title: "Modification",
			// 		// 		text: "Voulez-vous modifier le média déjà enregistré?",
			// 		// 		icon: "warning",
			// 		// 		buttons: ["Pas maintenant", "Ok, je vais modifier"],
		// 		// 	}).then((willDelete) => {
			// 		// 		if (willDelete) {
				// 		// 			initializeMediaTools();
			// 		// 		}
// 		// 	});
	// 		// } else {
		// 		// 	$("#modalMicroOption").modal("show");
		// 		// 	$("#modalAvis").modal("hide");

		// 		// 	// startRecordingAudio(true)
	// 		// }
// 	});
// }
/**
 * @author Elie
 * @utilization : evenement de stop audio
 */
// if(stopAudio)
// 	stopAudio.addEventListener("click", (event) => {
	// 		mediaRecorder.stop();
	// 		//console.log(mediaRecorder.state);
	// 		console.log("recorder stopped");
	// 		stopAudio.classList.add("d-none");
	// 		// stop.classList.add("d-none")
	// 		document.querySelector(".record").classList.add("d-none");
	// 		// document.querySelectorAll(".stop_audio_avis_elie_js").forEach(e=>{
	// 		// 	e.classList.add("d-none")
	// 		// })
	// 		if (mediaRecorder) {
		// 			mediaRecorder.stream.getTracks().forEach((track) => track.stop());
	// 		}
// 	});

/**
 * @author ELie
 * @utilisation evenement de l'input avis pour initialisation de la media
 */
if(msgTxt)
msgTxt.addEventListener("keyup", (event) => {
	// console.log("manoratra");
	if (event.target.value == "") {
		document.querySelector(".record").classList.remove("disabled");
	} else {
		document.querySelector(".record").classList.add("disabled");
	}
});

/**
 * @author Elie
 * @utilisation Recorder par un camera pour un avis rubrique
 */
// if(recordCam)
// 	recordCam.addEventListener("click", (event) => {
	// 		setMediaStream(constraints);
// 	});

/**
 * @constructor Prendre une photo pour envoyer dans un avis
 * @author Elie
 * @localisation avis_rubrique
 */
function takePictureAvis() {
	const player = document.querySelector("#playerCam");
	const outputCanvas = document.querySelector("#outputCam");
	const context = outputCanvas.getContext("2d");

	const imageWidth = player.offsetWidth;
	const imageHeight = player.offsetHeight;

	// Make our hidden canvas the same size
	outputCanvas.width = imageWidth;
	outputCanvas.height = imageHeight;

	// Draw captured image to the hidden canvas
	context.drawImage(player, 0, 0, imageWidth, imageHeight);

	// A bit of magic to save the image to a file
	let data = outputCanvas.toDataURL();
	let preview = document.querySelector(".vocal_display_elie_js");
	preview.innerHTML = "";
	preview.classList.remove("d-none");

	let div_img = document.createElement("div");
	div_img.classList = "d-flex justify-content-center align-items-center";

	let image = document.createElement("img");

	image.setAttribute("name", `capture-${new Date().getTime()}.png`);
	image.classList = "create image-capture-cam me-3";
	image.src = data;
	image.setAttribute("typeFile", "image/png");

	let span_ico_del = document.createElement("span");
	span_ico_del.classList = "text-danger cursor-pointer";
	span_ico_del.setAttribute("onclick", "initializeMediaTools()");
	// let ico_del = document.createElement("i")
	// ico_del.classList = "fa-solid fa-trash"

	// span_ico_del.appendChild(ico_del)
	span_ico_del.innerHTML = `<i class="fa-solid fa-trash"></i> Supprimer`;

	div_img.appendChild(image);
	div_img.appendChild(span_ico_del);

	preview.appendChild(div_img);

	document.querySelector(".record").classList.add("d-none");

	document.querySelector("#message-text").disabled = true;

	$("#modalCameraAvis").modal("hide");
	$("#modalAvis").modal("show");

	if (mediaRecorder) {
		mediaRecorder.stream.getTracks().forEach((track) => track.stop());
	}
}

/**
 * @constructor Initialisation de outil media
 * @author Elie
 * @localisation avis_rubrique
 */
function initializeMediaTools() {
	document.querySelector(".record").classList.remove("disabled");
	document.querySelector(".record").classList.remove("d-none");
	document.querySelectorAll(".start_audio_avis_elie_js").forEach((e) => {
		e.classList.remove("d-none");
	});
	document.querySelector(".camera-record").classList.remove("disabled");
	document.querySelector(".vocal_display_elie_js").innerHTML = "";
	document.querySelector("#message-text").disabled = false;

if(document.querySelector(".stop_audio_avis_elie_js"))
	document.querySelector(".stop_audio_avis_elie_js").classList.add("d-none");

	document.querySelector(
		"#spinCameraAvis"
	).innerHTML = `<button type="button" class="btn btn-secondary btn-sm close_mediarecorder" data-bs-dismiss="modal" data-bs-toggle="modal" data-bs-target="#modalAvis">Annuler</button>`;

	document.querySelector(".all_avis_jheo_js").innerHTML = "";

	// if (mediaRecorder) {
		// 	mediaRecorder.stream.getTracks().forEach((track) => track.stop());
	// }

	// if (timeOutAudio) {
		// 	clearTimeout(timeOutAudio);
	// }

	// if (timeOutVideo) {
		// 	clearTimeout(timeOutVideo);
	// }
}

/**
 * @author Elie
 * @localisation avis_rubrique
 * @utilisation : ajout avis text, ou audio ou image ou vidéo dans un rubrique dans un tribu G
 * @param {*} idItem
 * @param {*} rubrique_type
 * @returns
 */
function addAvisInTribuG(idItem, rubrique_type) {
	let type = rubrique_type;

	let audioBase64 = document.querySelector(".vocal_display_elie_js > div > audio.create");
	let imageBase64 = document.querySelector(".vocal_display_elie_js > div > img.create");
	let videoBase64 = document.querySelector(".vocal_display_elie_js > div > video.create");

	if (audioBase64 || imageBase64 || videoBase64) {
		if (document.querySelector("#text-note").value === "") {
			msgErrorAlertAvis({ message: "no content" });
			return 0;
		} else {
			document.querySelector(".btn_open_modal_list_avis_jheo_js")
				? document.querySelector(".btn_open_modal_list_avis_jheo_js").click()
				: "";
		}
	} else {
		if (document.querySelector("#text-note").value === "" || document.querySelector("#message-text").value === "") {
			msgErrorAlertAvis({ message: "no content" });
			return 0;
		} else {
			document.querySelector(".btn_open_modal_list_avis_jheo_js")
				? document.querySelector(".btn_open_modal_list_avis_jheo_js").click()
				: "";
		}
	}

	///// remove alert card empty avis and add chargement spinner
	if (document.querySelector(".card_avis_empty_jheo_js")) {
		document.querySelector(".card_avis_empty_jheo_js").remove();
	}

	///// remove alert card and add chargement spinner
	if (document.querySelector(".all_avis_jheo_js")) {
		document.querySelector(".all_avis_jheo_js").innerHTML = `
            <div class="d-flex justify-content-center align-items-center spinner_jheo_js">
                <div class="spinner-border m-3" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
        `;
	}

	let avis = document.querySelector("#message-text").value;
	let note = document.querySelector("#text-note").value;
	note = note.replace(/,/g, ".");

	let type_avis = "text";

	if (audioBase64) {
		type_avis = "audio";
		avis = audioBase64.src;
	}
	if (imageBase64) {
		type_avis = "image";
		avis = imageBase64.src;
	}
	if (videoBase64) {
		type_avis = "video";
		avis = videoBase64.src;
	}

	try {
		mustBeInferior4(note, document.querySelector("#text-note"), true);
	} catch (e) {
		msgErrorAlertAvis(e);
	}
	const requestParam = { note: parseFloat(note), avis: avis, type: type_avis };

	deleteOldValueInputAvis(); //// delet input and text

	let path_link = "";
	if (type === "golf") {
		path_link = `/avis/golf/${idItem}`;
	} else if (type === "resto") {
		path_link = `/avis/restaurant/${idItem}`;
	}

	////send data to the backend server
	const request = new Request(path_link, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify(requestParam),
	});

	fetch(request)
		.then((r) => r.json())
		.then((response) => {
			const new_state = response.state;

			$("#staticBackdrop").modal("show");

			showListInTribuT(idItem, type);

			if (type == "resto") {
				openAvisRestoG(new_state.length, idItem);

				document.querySelector("#fetch_resto_tribug_jheo_js").click();
			}
			if (type == "golf") {
				openAvisGolfG(new_state.length, idItem);

				document.querySelector("#fetch_golf_tribug_jheo_js").click();
			}

			initializeMediaTools();
		});
}

/**
 * @author faniry 
 * nouveau avis audio
 */
if(document.getElementById("star_faniry_audio_record_js")){
	document.getElementById("star_faniry_audio_record_js").onclick=()=>{
		const isUpdate= document.querySelector("#modalAvisLabel").textContent.includes("Modifier votre avis") ? true : false;
		if (document.querySelector("#text-note").value === "") {
			msgErrorAlertAvis({ message: "no content" });
			return 0;
		}else{
			const url = new URL(window.location.href.toString());
			let avisId=0;
			if(isUpdate){
				let bntSendAvis=document.querySelector(".send_avis_jheo_js")
				avisId=parseInt(((bntSendAvis.getAttribute("onclick").replace(/[^0-9,]/g,""))
						.split(",")[0]),10);
				
			}
			
			let note = document.querySelector("#text-note").value;
			note = note.replace(/,/g, ".");
			try {
				mustBeInferior4(note, document.querySelector("#text-note"), true);
			} catch (e) {
				msgErrorAlertAvis(e);
			}
			$("#modalMicroOption").modal("show");
			$("#modalAvis").modal("hide");
			let canvas=document.querySelector(".visualizer_frequency");
			let btnReocrderStar=document.querySelector('.record_faniry');
			let btnReocrderStop=document.querySelector('.stop_faniry');
			let soundClips=document.querySelector(".main-controls-dictaphone");
			let detailsCoord=document.getElementById("details-coord")
			if(document.querySelector(".clips_faniry_js"))
				document.querySelector(".clips_faniry_js").innerHTML="";
			//verfier si on est dans les tribu G;
			if(url.pathname.includes("/user/account") ){
				detailsCoord=document.querySelector(".send_avis_jheo_js")
				
				const audioRecorderInTribuG=new RecorderAudioTribug(
					btnReocrderStar,
					canvas,
					btnReocrderStop,
					soundClips,
					detailsCoord,
					note,
					isUpdate,
					avisId,
					showListInTribuT,
					openAvisRestoG,
					openAvisGolfG,
					fetchListAvisInTribuT,
					updateViewState
				)
				audioRecorderInTribuG.initialize();
				audioRecorderInTribuG.play();
			}else if(url.pathname.includes("/user/tribu/my-tribu-t")){
				detailsCoord=document.querySelector(".send_avis_jheo_js")
				
				const audioRecorderInTribuT=new RecorderAudioTrubuT(
					btnReocrderStar,
					canvas,
					btnReocrderStop,
					soundClips,
					detailsCoord,
					note,
					isUpdate,
					avisId,
					showListInTribuT,
					updateViewState,
					fetchListAvisInTribuT
				)
				audioRecorderInTribuT.initialize();
				audioRecorderInTribuT.play();
			}else{
				//si on est sur la carte
				const showNoteGlobaleOnMarkerD =typeof showNoteGlobaleOnMarker== "function" ? showNoteGlobaleOnMarker : null;
				let audioRecorder=new RecorderAudio(
					btnReocrderStar,
					canvas,
					btnReocrderStop,
					soundClips,
					detailsCoord,
					note,
					isUpdate,
					avisId,
					showNoteGlobaleOnMarkerD,
					createShowAvisAreas);
				
				audioRecorder.initialize();
				audioRecorder.play();
			}
			//verifier si on est dans les tribuT
		}
	}
}

/**
 * @author Elie
 * @constructor Fonction de réaction d' un avis
 */
function reagirAvis(elem){

	INSTANCE_RESPONSE_AVIS.reagirAvis(elem)
	
}

/**
 * @author Elie
 * Envoie d'une réponse d'un avis rubrique
 * @param {*} elem 
 */
function sendResponseAvis(elem){

	INSTANCE_RESPONSE_AVIS.sendResponseAvis(elem)

}

/**
 * @author Elie
 * @constructor Affichage plus des responses de la list d'avis
 * @param {*} elem 
 */
function showMoreResponseAvis(elem){

	INSTANCE_RESPONSE_AVIS.showMoreResponseAvis(elem)
	
}


function showMinusResponseAvis(elem){

	INSTANCE_RESPONSE_AVIS.showMinusResponseAvis(elem)

}

/**
 * @author Elie
 * @constructor Envoie d'une réaction de la reponse
 * @param {*} elem 
 */
function reagirResponse(elem){

	INSTANCE_RESPONSE_AVIS.reagirResponse(elem)

}

/**
 * @author Elie
 * @constructor Envoie de la réaction de sous reponse
 * @param {*} elem 
 */
function reagirSubResponse(elem){

	INSTANCE_RESPONSE_AVIS.reagirSubResponse(elem)

}

/**
 * @author Elie
 * @constructor Envoi de la reponse d'une reponse dans un avis
 * @param {*} elem 
 */
function sendResponseForResponseAvis(elem){

	INSTANCE_RESPONSE_AVIS.sendResponseForResponseAvis(elem)

}