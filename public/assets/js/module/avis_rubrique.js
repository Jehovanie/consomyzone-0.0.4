let currentUserId = 0;
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
		} else if (details.getAttribute("data-toggle-id-resto")) {
			newIdItem = details.getAttribute("data-toggle-id-resto");
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
function createShowAvisAreas(json, currentUserId, idItem = 0, rubrique_type = null) {
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
	} else if (type === "resto") {
		path_link = `/avis/restaurant/global/${idItem}`;
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

var mediaRecorder;
let recordAudio = document.querySelector("#start_audio_avis_elie_js");
let stopAudio = document.querySelector("#stop_audio_avis_elie_js");
let recordCam = document.querySelector("#start_camera_avis_elie_js");
let stopCam = document.querySelector("#stop_camera_avis_elie_js");
let soundClips = document.querySelector(".vocal_display_elie_js");
let msgTxt = document.querySelector("#message-text");
let cameraOptions = document.querySelector("#cameraOption");
let microOptions = document.querySelector("#microOption");

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
 * @author Elie
 * @utilisation : evenement de capture audio pour un avis rubrique
 */
if(recordAudio) {
recordAudio.addEventListener("click", (event) => {
	if (soundClips.querySelector("audio") || soundClips.querySelector("video") || soundClips.querySelector("img")) {
		swal({
			title: "Modification",
			text: "Voulez-vous modifier le média déjà enregistré?",
			icon: "warning",
			buttons: ["Pas maintenant", "Ok, je vais modifier"],
		}).then((willDelete) => {
			if (willDelete) {
				initializeMediaTools();
			}
		});
	} else {
		$("#modalMicroOption").modal("show");
		$("#modalAvis").modal("hide");

		// startRecordingAudio(true)
	}
});
}
/**
 * @author Elie
 * @utilization : evenement de stop audio
 */
if(stopAudio)
stopAudio.addEventListener("click", (event) => {
	mediaRecorder.stop();
	//console.log(mediaRecorder.state);
	console.log("recorder stopped");
	stopAudio.classList.add("d-none");
	// stop.classList.add("d-none")
	document.querySelector(".record").classList.add("d-none");
	// document.querySelectorAll(".stop_audio_avis_elie_js").forEach(e=>{
	// 	e.classList.add("d-none")
	// })
	if (mediaRecorder) {
		mediaRecorder.stream.getTracks().forEach((track) => track.stop());
	}
});

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
if(recordCam)
recordCam.addEventListener("click", (event) => {
	setMediaStream(constraints);
});

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

	document.querySelector(".stop_audio_avis_elie_js").classList.add("d-none");

	document.querySelector(
		"#spinCameraAvis"
	).innerHTML = `<button type="button" class="btn btn-secondary btn-sm close_mediarecorder" data-bs-dismiss="modal" data-bs-toggle="modal" data-bs-target="#modalAvis">Annuler</button>`;

	document.querySelector(".all_avis_jheo_js").innerHTML = "";

	if (mediaRecorder) {
		mediaRecorder.stream.getTracks().forEach((track) => track.stop());
	}

	if (timeOutAudio) {
		clearTimeout(timeOutAudio);
	}

	if (timeOutVideo) {
		clearTimeout(timeOutVideo);
	}
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
 * @author Elie
 * @constructor affichage des cameras disponibles
 */
const getCameraSelection = async () => {
	const devices = await navigator.mediaDevices.enumerateDevices();
	const videoDevices = devices.filter((device) => device.kind === "videoinput");
	const options = videoDevices.map((videoDevice, i) => {
		// return `<option value="${videoDevice.deviceId}" >${videoDevice.label}</option>`;
		let checked = i == 0 ? "checked" : "";
		// console.log(videoDevice.deviceId);
		/* return `<option value="${videoDevice.deviceId}">${videoDevice.label}</option>`; */
		return `<div class="form-check form-switch" onclick="chooseCamera(this)"><input class="form-check-input" type="checkbox" role="switch" id="check-${i}" ${checked} deviceId="${videoDevice.deviceId}">
		<label class="form-check-label" for="check-${i}">${videoDevice.label}</label></div>`;
		i++;
	});
if(cameraOptions)
	cameraOptions.innerHTML = options.join("");
};

/**
 * @author Elie
 * @constructor affichage des micros disponibles dans l'avis audio
 */
const getMicroSelectionAudio = async () => {
	const devices = await navigator.mediaDevices.enumerateDevices();
	const audioDevices = devices.filter((device) => device.kind === "audioinput");

	const options = audioDevices.map((videoDevice, i) => {
		let checked = videoDevice.deviceId == "default" ? "checked" : "";
		// console.log(videoDevice.deviceId);
		/* return `<option value="${videoDevice.deviceId}">${videoDevice.label}</option>`; */
		return `<div class="form-check form-switch" onclick="chooseMicro(this, false)"><input class="form-check-input" type="checkbox" role="switch" id="check-${i}" ${checked} deviceId="${videoDevice.deviceId}">
		<label class="form-check-label" style="display: inline;" for="check-${i}">${videoDevice.label}</label></div>`;
		i++;
	});
	// microOptions.innerHTML = options.join('');
if(document.querySelector("#selectMicroOption"))
	document.querySelector("#selectMicroOption").innerHTML = options.join("");
};

/**
 * @author Elie
 * @constructor affichage des micros disponibles dans l'avis video
 */

const getMicroSelectionCamera = async () => {
	const devices = await navigator.mediaDevices.enumerateDevices();
	const audioDevices = devices.filter((device) => device.kind === "audioinput");

	const options = audioDevices.map((videoDevice, i) => {
		let checked = videoDevice.deviceId == "default" ? "checked" : "";
		// console.log(videoDevice.deviceId);
		/* return `<option value="${videoDevice.deviceId}">${videoDevice.label}</option>`; */
		return `<div class="form-check form-switch" onclick="chooseMicro(this, true)"><input class="form-check-input" type="checkbox" role="switch" id="check-${i}" ${checked} deviceId="${videoDevice.deviceId}">
		<label class="form-check-label" style="display: inline;" for="check-${i}">${videoDevice.label}</label></div>`;
		i++;
	});
if(microOptions)
	microOptions.innerHTML = options.join("");
	// document.querySelector("#selectMicroOption").innerHTML = options.join('');
};

getCameraSelection();
getMicroSelectionAudio();
getMicroSelectionCamera();

/**
 * @author Elie
 * @constructor Lancement d'enregistrement media audio ou video
 */
function setMediaStream(contraint, micro = true, camera = true) {
	let class_mute_mic = micro ? "fa-microphone" : "fa-microphone-slash";
	let class_mute_cam = camera ? "fa-video" : "fa-video-slash";

	$("#modalCameraAvis").modal("show");

	document.querySelector("#containerCameraAvis").innerHTML = "";

	let video = document.createElement("video");
	video.setAttribute("id", "playerCam");
	video.setAttribute("autoplay", true);
	let canvas = document.createElement("canvas");
	canvas.setAttribute("id", "outputCam");
	canvas.setAttribute("class", "d-none");

	let captureButton = document.createElement("button");
	captureButton.classList = "btn_capture_avis";
	captureButton.setAttribute("onclick", "takePictureAvis()");
	captureButton.setAttribute("title", "Prendre une photo");
	captureButton.innerHTML = `<i class="text-primary fs-3 fa-solid fa-camera-retro"></i>`;

	let videoButton = document.createElement("button");
	videoButton.classList = "btn_video_avis";
	// videoButton.setAttribute("onclick", "takeVideoAvis()");
	videoButton.setAttribute("title", "Prendre une vidéo");
	videoButton.innerHTML = ico_svg; //<i class="bi bi-record-btn"></i>

	let videoButtonStop = document.createElement("button");
	videoButtonStop.classList = "btn_video_stop_avis red d-none";
	// videoButtonStop.setAttribute("onclick", "stopVideoAvis()");
	videoButtonStop.setAttribute("title", "Enregistrer une vidéo");
	videoButtonStop.innerHTML = `<i class="fa-solid fa-stop fs-3"></i>`;

	let divCam = document.createElement("div");
	divCam.classList = "d-flex justify-content-center div-cam";

	let micButton = document.createElement("button");
	micButton.classList = "btn_change_micro_avis";
	micButton.setAttribute("onclick", "");
	micButton.setAttribute("title", "Paramètre microphone");
	micButton.innerHTML = `<i class="text-primary fs-3 fa-solid ${class_mute_mic}" onclick="muteMicro(this)"></i> <i class="fa-solid fa-chevron-up chevron-options" onclick="showMicro(this)"></i>`;

	let vidButton = document.createElement("button");
	vidButton.classList = "btn_change_cam_avis";
	vidButton.setAttribute("onclick", "");
	vidButton.setAttribute("title", "Paramètre caméra");
	// vidButton.innerHTML = `<i class="text-primary fs-3 fa-solid ${class_mute_cam}" onclick="muteCamera(this)"></i> <i class="fa-solid fa-chevron-up chevron-options" onclick="showCamera(this)"></i>`
	vidButton.innerHTML = ico_svg_2;
	vidButton.innerHTML += `</i> <i class="fa-solid fa-chevron-up chevron-options" onclick="showCamera(this)"></i>`;

	let chrono = document.createElement("span");
	chrono.id = "chrono_avis";
	chrono.classList = "chrono_avis text-white border rounded-4 p-1";
	// chrono.innerHTML = `<span class="chrono-h">`

	divCam.appendChild(captureButton);
	divCam.appendChild(videoButton);
	divCam.appendChild(videoButtonStop);

	divCam.appendChild(micButton);
	divCam.appendChild(vidButton);

	mediaRecorder = startStream(contraint, video);

	videoButton.addEventListener("click", (e) => {
		mediaRecorder.start(200);

		// e.target.parentElement.classList.add("d-none")
		videoButtonStop.classList.remove("d-none");

		divCam.appendChild(chrono);

		let maxTimeSeconds = 60;

		startChrono(chrono, maxTimeSeconds);

		timeOutVideo = setTimeout(() => {
			videoButtonStop.click();
		}, maxTimeSeconds * 1000);

		writeFooterModal();

		micButton.classList.add("disabled");
		micButton.querySelector("i").classList.add("text-secondary");
		vidButton.classList.add("disabled");
		vidButton.querySelector("svg > g").setAttribute("fill", "#868e96");
		captureButton.classList.add("disabled");
		captureButton.setAttribute("onclick", "");
		captureButton.querySelector("i").classList.add("text-secondary");
	});

	videoButtonStop.addEventListener("click", (e) => {
		mediaRecorder.stop();

		mediaRecorder.stream.getTracks().forEach((track) => track.stop());

		if (timeOutVideo) {
			clearTimeout(timeOutVideo);
		}

		videoButtonStop.parentElement.classList.add("d-none");
		videoButton.classList.remove("d-none");
		document.querySelector(".note_avis_jheo_js").disabled = true;

		document.querySelector(
			"#spinCameraAvis"
		).innerHTML = `<button type="button" class="btn btn-secondary btn-sm close_mediarecorder" data-bs-dismiss="modal" data-bs-toggle="modal" data-bs-target="#modalAvis">Annuler</button>`;

		$("#modalCameraAvis").modal("hide");
		$("#modalAvis").modal("show");
	});

	document.querySelector("#containerCameraAvis").appendChild(video);
	document.querySelector("#containerCameraAvis").appendChild(divCam);
	document.querySelector("#containerCameraAvis").appendChild(canvas);
}

/**
 * @author Elie
 * @constructor demarage d'enregistrement media audio ou video
 */
const startStream = async (constraints, video) => {
	const stream = await navigator.mediaDevices.getUserMedia(constraints);
	return handleStream(stream, video);
};

var recorder;

/**
 * @author Elie
 * @param {*} stream
 * @param {*} video
 * @constructor handle evenement apres demarrage de l'enregistrement
 * @returns
 */
const handleStream = (stream, video) => {
	$("#modalAvis").modal("hide");

	video.srcObject = stream;

	video.captureStream = video.captureStream || video.mozCaptureStream;

	let chunks = [];

	let options = {
		bitsPerSecond: 128000,
	};

	mediaRecorder = new MediaRecorder(video.captureStream(), options);

	mediaRecorder.ondataavailable = (e) => {
		chunks.push(e.data);
	};

	mediaRecorder.onstop = (e) => {
		const clipName = dateString + ".mp4";
		const clipContainer = document.createElement("div");
		const iconContainer = document.createElement("div");
		clipContainer.classList = "d-flex justify-content-center align-items-center";
		const audio = document.createElement("video");
		audio.id = "video_" + i;
		audio.classList = "create video-cam-avis";
		const deleteSpan = document.createElement("span");
		const deleteButton = document.createElement("i");
		const deleteLabel = document.createElement("label");
		deleteLabel.textContent = " Supprimer.";
		deleteLabel.style.marginLeft = "3px";
		deleteLabel.style.cursor = "pointer";

		clipContainer.classList.add("clip");
		iconContainer.classList.add("iconeDelete");
		audio.setAttribute("controls", "controls");
		audio.classList.add("me-2");
		deleteButton.classList = "fa-solid fa-trash";
		deleteSpan.style.color = "red";
		deleteSpan.style.marginLeft = "5px";
		deleteSpan.style.cursor = "pointer";
		deleteSpan.style.fontSize = "16px";
		deleteSpan.appendChild(deleteButton);
		deleteSpan.appendChild(deleteLabel);
		clipContainer.appendChild(audio);
		clipContainer.appendChild(deleteSpan);
		soundClips.appendChild(clipContainer);

		document.querySelector(".vocal_display_elie_js").classList.remove("d-none");
		document.querySelector(".record").classList.add("d-none");

		audio.controls = true;
		audio.autoplay = true;

		const blobVideo = new Blob(chunks, { type: "video/webm" });

		let blob_url = URL.createObjectURL(blobVideo);

		audio.src = blob_url;

		chunks = [];

		let reader = new FileReader();

		reader.readAsDataURL(blobVideo);
		reader.onloadend = function () {
			let base64String = reader.result;
			// audio.src = base64String
			// console.log(base64String);
		};

		deleteSpan.onclick = (e) => {
			const evtTgt = e.target;
			evtTgt.parentNode.parentNode.remove();

			initializeMediaTools();
		};

		mediaRecorder.stream.getTracks().forEach((track) => track.stop());
	};

	return mediaRecorder;
};

/**
 * @author Elie
 * @constructor rendre mute le microphone de navigateur
 * @param {*} elem
 */
function muteMicro(elem) {
	let cams = document.querySelectorAll("#cameraOption > div > input[type=checkbox]");

	cams.forEach((e) => {
		if (e.checked) {
			elem.setAttribute("deviceId", e.getAttribute("deviceId"));
		}
	});

	let deviceId = elem.getAttribute("deviceId");

	let mics = document.querySelectorAll("#microOption > div > input[type=checkbox]");

	mics.forEach((e) => {
		if (e.checked) {
			elem.setAttribute("microId", e.getAttribute("deviceId"));
		}
	});

	let microId = elem.getAttribute("microId");

	let updatedConstraints = {};

	if (elem.classList == "text-primary fs-3 fa-solid fa-microphone-slash") {
		elem.classList = "text-primary fs-3 fa-solid fa-microphone";
		updatedConstraints = {
			video: {
				deviceId: {
					exact: deviceId,
				},
			},
			audio: {
				deviceId: {
					exact: microId,
				},
			},
		};

		setMediaStream(updatedConstraints);
	} else {
		elem.classList = "text-primary fs-3 fa-solid fa-microphone-slash";

		setMediaStream(constraints, false, true);
	}
}

/**
 * @author Elie
 * @constructor Rendre mute le camrera utilisé
 * @param {*} elem
 */
function muteCamera(elem) {
	let updatedConstraints = {};

	if (elem.classList == "fa-solid fa-video-slash") {
		elem.classList = "fa-solid fa-video";

		updatedConstraints = {
			video: {
				deviceId: {
					exact: cameraOptions.value,
				},
			},
			audio: {
				deviceId: {
					exact: microOptions.value,
				},
			},
		};

		setMediaStream(updatedConstraints);
	} else {
		elem.classList = "fa-solid fa-video-slash";

		updatedConstraints = {
			video: false,
			audio: {
				deviceId: {
					exact: microOptions.value,
				},
			},
		};

		setMediaStream(updatedConstraints, true, false);
	}
}

/**
 * @author Elie
 * @constructor Affichage des listes des micro disponibles
 * @param {*} elem
 */
function showMicro(elem) {
	if (document.querySelector("#optionMedia").classList.contains("d-none")) {
		document.querySelector("#optionMedia").classList.remove("d-none");
		document.querySelector("#microOption").classList.remove("d-none");
		document.querySelector("#cameraOption").classList.add("d-none");
	} else {
		document.querySelector("#optionMedia").classList.add("d-none");
		document.querySelector("#microOption").classList.add("d-none");
		document.querySelector("#cameraOption").classList.remove("d-none");
	}

	document.querySelector("#optionMedia").classList.add("bg-white");
}

/**
 * @author Elie
 * @constructor Affichage des cameras detectés disponibles
 * @param {*} elem
 */
function showCamera(elem) {
	if (document.querySelector("#optionMedia").classList.contains("d-none")) {
		document.querySelector("#optionMedia").classList.remove("d-none");
		document.querySelector("#microOption").classList.add("d-none");
		document.querySelector("#cameraOption").classList.remove("d-none");
	} else {
		document.querySelector("#optionMedia").classList.add("d-none");
		document.querySelector("#microOption").classList.remove("d-none");
		document.querySelector("#cameraOption").classList.add("d-none");
	}

	document.querySelector("#optionMedia").classList.add("bg-white");
}

/**
 * @author Elie
 * @constructor Demarrage de l'enregistrement audio
 * @param {*} defaultValue
 */
function startRecordingAudio(defaultValue) {
	let deviceId = document.querySelector("#selectMicroOption").getAttribute("deviceId");

	let constraints = {};

	$("#modalMicroOption").modal("hide");
	$("#modalAvis").modal("show");

	if (navigator.mediaDevices) {
		if (defaultValue == false) {
			constraints = {
				audio: {
					deviceId: {
						exact: deviceId,
					},
				},
			};
		} else {
			constraints = { audio: true };
		}

		let chunks = [];

		navigator.mediaDevices
			.getUserMedia(constraints)
			.then((stream) => {
				mediaRecorder = new MediaRecorder(stream);

				mediaRecorder.start();
				// console.log("recorder started");
				recordAudio.classList.add("d-none");

				let timaMaxSec = 60;

				timeOutAudio = setTimeout(function () {
					stopAudio.click();
				}, timaMaxSec * 1000);

				document.querySelectorAll(".stop_audio_avis_elie_js").forEach((e) => {
					e.classList.remove("d-none");
					// e.querySelector("i").classList.add("disabled")
				});

				document.querySelector(".camera-record").classList.add("disabled");

				document.querySelector("#message-text").disabled = true;

				let recor_audio_animated = document.createElement("div");
				recor_audio_animated.id = "bars";

				for (let i = 0; i < 90; i++) {
					const left = i * 2 + 1;
					const anim = Math.floor(Math.random() * 75 + 400);
					const height = Math.floor(Math.random() * 25 + 3);

					recor_audio_animated.innerHTML += `<div class="bar" style="left:${left}px;animation-duration:${anim}ms;height:${height}px"></div>`; //`<div class="bar" style="left:${left}px">Hello</div>`;
				}

				document.querySelector(".vocal_display_elie_js").appendChild(recor_audio_animated);

				document.querySelector(".vocal_display_elie_js").innerHTML += `
				<div class="d-flex mt-5 justify-content-around spinner-recording">
					<button class="btn btn-primary btn-sm" type="button" disabled>
						<span class="spinner-grow spinner-grow-sm" aria-hidden="true"></span>
						<span role="status">Enregistrement en cours...</span>
					</button>
					<button class="btn btn-danger btn-sm" type="button" onclick="stopAudio.click();"><i class="fa-solid fa-stop"></i> Arrêter l'enregistrement</button>
				</div>
			  `;

				document.querySelector(".vocal_display_elie_js").classList.remove("d-none");

				mediaRecorder.onstop = (e) => {
					// console.log("data available after MediaRecorder.stop() called.");

					const clipName = dateString + ".oga";
					const clipContainer = document.createElement("div");
					const iconContainer = document.createElement("div");
					clipContainer.classList = "d-flex align-items-center";
					const audio = document.createElement("audio");
					audio.id = "audio_" + i;
					audio.classList.add("create");
					const deleteSpan = document.createElement("span");
					const deleteButton = document.createElement("i");
					const deleteLabel = document.createElement("label");
					deleteLabel.textContent = " Supprimer.";
					deleteLabel.style.marginLeft = "3px";
					deleteLabel.style.cursor = "pointer";

					clipContainer.classList.add("clip");
					iconContainer.classList.add("iconeDelete");
					audio.setAttribute("controls", "controls");
					audio.classList.add("ml-5");
					deleteButton.classList = "fa-solid fa-trash";
					deleteSpan.style.color = "red";
					deleteSpan.style.marginLeft = "5px";
					deleteSpan.style.cursor = "pointer";
					deleteSpan.style.fontSize = "16px";
					deleteSpan.appendChild(deleteButton);
					deleteSpan.appendChild(deleteLabel);
					clipContainer.appendChild(audio);
					clipContainer.appendChild(deleteSpan);
					soundClips.appendChild(clipContainer);

					document.querySelector(".vocal_display_elie_js").classList.remove("d-none");

					document.querySelector(".vocal_display_elie_js > div#bars").remove();
					document.querySelector(".spinner-recording")
						? document.querySelector(".spinner-recording").remove()
						: "";

					audio.controls = true;
					const blob = new Blob(chunks, { type: "audio/mp3; codecs=opus" });
					chunks = [];

					let reader = new FileReader();
					reader.readAsDataURL(blob);
					reader.onloadend = function () {
						let base64String = reader.result;
						audio.src = base64String;
					};

					deleteSpan.onclick = (e) => {
						const evtTgt = e.target;
						evtTgt.parentNode.parentNode.remove();

						initializeMediaTools();
					};

					mediaRecorder.stream.getTracks().forEach((track) => track.stop());

					if (timeOutAudio) {
						clearTimeout(timeOutAudio);
					}
				};

				mediaRecorder.ondataavailable = (e) => {
					chunks.push(e.data);
				};
			})
			.catch((err) => {
				console.log(err);
				alert("Veuillez vérifier votre micro svp!");
				// console.error(`The following error occurred: ${err}`);
			});
	}
}

/**
 * @author Elie
 * @constructor Choix des microphones utilisés
 * @param {*} elem
 * @param {*} isCamera
 */
function chooseMicro(elem, isCamera) {
	let checkboxs = elem.parentElement.querySelectorAll("input[type=checkbox]");
	checkboxs.forEach((e) => (e.checked = false));

	elem.querySelector("input[type=checkbox]").checked = true;

	if (isCamera == false) {
		let deviceId = elem.querySelector("input[type=checkbox]").getAttribute("deviceId");

		document.querySelector("#selectMicroOption").setAttribute("deviceId", deviceId);

		// use for camera
	}
	// else {

	// 	let micId = elem.querySelector("input[type=checkbox]").getAttribute("deviceId")

	// 	let cams = document.querySelectorAll("#cameraOption > div > input[type=checkbox]")

	// 	cams.forEach(e => {
	// 		if (e.checked) {
	// 			elem.setAttribute("camsId", e.getAttribute("deviceId"))
	// 		}
	// 	});

	// 	let camsId = elem.getAttribute("camsId")

	// 	const updatedConstraints = {
	// 		...constraints,
	// 		video: {
	// 			deviceId: {
	// 				exact: camsId
	// 			},
	// 		},
	// 		audio: {
	// 			deviceId: {
	// 				exact: micId
	// 			},
	// 		},
	// 	};
	// 	setMediaStream(updatedConstraints)

	// 	microOptions.classList.add("d-none");

	// 	document.querySelector("#optionMedia").classList.add("d-none");

	// }
}

/**
 * @author Elie
 * @constructor Choix des cameras utilisés
 * @param {*} elem
 */
function chooseCamera(elem) {
	let checkboxs = elem.parentElement.querySelectorAll("input[type=checkbox]");
	checkboxs.forEach((e) => (e.checked = false));

	let deviceId = elem.querySelector("input[type=checkbox]").getAttribute("deviceId");

	let mics = document.querySelectorAll("#microOption > div > input[type=checkbox]");

	elem.querySelector("input[type=checkbox]").checked = true;

	mics.forEach((e) => {
		if (e.checked) {
			elem.setAttribute("microId", e.getAttribute("deviceId"));
		}
	});

	let microId = elem.getAttribute("microId");

	const updatedConstraints = {
		...constraints,
		video: {
			deviceId: {
				exact: deviceId,
			},
		},
		audio: {
			deviceId: {
				exact: microId,
			},
		},
	};
	setMediaStream(updatedConstraints);

	cameraOptions.classList.add("d-none");

	document.querySelector("#optionMedia").classList.add("d-none");
}

/** Chrono video
 * @author Elie
 * @constructor Demarrage de chrono de la video
 */

function startChrono(elem, max = 60) {
	let count = 0;
	myInterval = setInterval(function () {
		let h = 0;
		let min = 0;

		if (count < max) {
			if (count >= 60) {
				h = Math.trunc(count / 60);
				min = count - 60;
				elem.innerHTML = h.toString().padStart(2, "0") + ":" + min.toString().padStart(2, "0");
			} else {
				elem.innerHTML = "00:" + count.toString().padStart(2, "0");
			}
			count++;
		}
	}, 1000);
}

/**
 * @author Elie
 * @constructor affichage des boutons actions en bas de modal
 */
function writeFooterModal() {
	let elem = `
		<button class="btn btn-primary btn-sm" disabled=""><span class="spinner-grow spinner-grow-sm" aria-hidden="true"></span>
		<span role="status"> Enregistrement en cours...</span></button><button class="btn btn-danger btn-sm" onclick="document.querySelector(&quot;.btn_video_stop_avis&quot;).click()"><i class="fa-solid fa-stop"></i> Arrêter</button><button class="btn btn-secondary btn-sm close_mediarecorder" data-bs-dismiss="modal" data-bs-toggle="modal" data-bs-target="#modalAvis"> Annuler</button>
	`;
	document.querySelector("#spinCameraAvis").innerHTML = elem;
}
