function getDetailFromListLeft(type, depart_name, depart_code, id) {
	if (OBJECT_MARKERS_SEARCH.checkIsExist(id, type)) {
		OBJECT_MARKERS_SEARCH.clickOnMarker(id, type);
	}

	if (type === "resto") {
		getRestoSpecSearchMobile(depart_name, depart_code, id);
	} else if (type === "ferme") {
		getFermeSpecSearchMobile(depart_name, depart_code, id);
	} else if (type === "station") {
		getStationSpecSearchMobile(depart_name, depart_code, id);
	} else if (type === "golf") {
		getGolfSpecSearchMobile(depart_name, depart_code, id);
	} else if (type === "tabac") {
		getTabacSpecSearchMobile(depart_name, depart_code, id);
	}
}

function setGolfTodo(goldID, event) {
	fecthGolfAction(goldID, "todo", event);
}

function setGolfFinished(goldID, event) {
	fecthGolfAction(goldID, "finished", event);
}

function setGolfNone(goldID, event) {
	fecthGolfAction(goldID, "none", event);
}

function setGolfRemake(goldID, event) {
	fecthGolfAction(goldID, "remake", event);
}

function cancelGolfFinished(event, goldID, selectElement = null) {
	if (selectElement === null) {
		if (document.querySelector("#content_details_home_js_jheo")) {
			const content_details = document.querySelector("#content_details_home_js_jheo");
			selectElement = content_details.querySelector(".content_btn_golf_did_jheo_js");
		}
	}
	fecthGolfAction(goldID, "cancel", selectElement);
}

function executeActionForPastGolf(event, goldID) {
	let action = document.querySelector("#selectActionGolf").value;

	if (document.querySelector("#content_details_home_js_jheo")) {
		const content_details = document.querySelector("#content_details_home_js_jheo");
		action = content_details.querySelector("#selectActionGolf").value;

		event = content_details.querySelector(".content_btn_golf_did_jheo_js");
	}

	if (action == "1") {
		setGolfTodo(goldID, event);
		OBJECT_MARKERS_SEARCH.updateStateGolf("afaire", goldID);
	} else if (action == "2") {
		setGolfFinished(goldID, event);
		OBJECT_MARKERS_SEARCH.updateStateGolf("fait", goldID);
	} else if (action == "0") {
		setGolfNone(goldID, event);
		OBJECT_MARKERS_SEARCH.updateStateGolf("aucun", goldID);
	} else if (action == "3") {
		setGolfRemake(goldID, event);
		OBJECT_MARKERS_SEARCH.updateStateGolf("refaire", goldID);
	} else {
		cancelGolfFinished(null, goldID, event);
	}
}

function fecthGolfAction(goldID, action, selectElement) {
	let url = "";

	if (action === "finished") {
		url = "/user/setGolf/finished";
	} else if (action === "todo") {
		url = "/user/setGolf/todo";
	} else if (action === "none") {
		url = "/user/setGolf/none";
	} else if (action === "remake") {
		url = "/user/setGolf/remake";
	} else {
		url = "/user/setGolf/unfinished";
	}

	const request = new Request(url, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			golfID: goldID,
		}),
	});

	fetch(request)
		.then((response) => response.json())
		.then((response) => {
			console.log(response);
			if (response.success) {
				if (action === "finished") {
					new swal("Bravo !", "Vous avez marqué ce golf comme fait !", "success").then((value) => {
						if (selectElement) {
							selectElement.innerHTML = `
                                Vouliez-vous annuler votre choix ? <span class="badge bg-danger btn_golf_did btn_golf_did_jheo_js" onclick="cancelGolfFinished(event,${goldID})">Oui</span>
                            `;
						}

						if (document.querySelector(`.item_carrousel_${goldID}_jheo_js`)) {
							const itemCarrousel = document.querySelector(`.item_carrousel_${goldID}_jheo_js`);
							itemCarrousel.querySelector(".content_btn_golf_did_jheo_js").innerHTML = `
                                Vouliez-vous annuler votre choix ? <span class="badge bg-danger btn_golf_did btn_golf_did_jheo_js" onclick="cancelGolfFinished(event,${goldID})">Oui</span>
							`;
						}

						if (document.querySelector(".golf_status_jheo_js")) {
							document.querySelector(".golf_status_jheo_js").innerText = "FAIT";
						}
					});
				} else if (action === "todo") {
					new swal("Bravo !", "Vous avez marqué ce golf comme à faire !", "success").then((value) => {
						if (selectElement) {
							selectElement.innerHTML = `
                                Vouliez-vous annuler votre choix ? <span class="badge bg-danger btn_golf_did btn_golf_did_jheo_js" onclick="cancelGolfFinished(event,${goldID})">Oui</span>
                            `;
						}

						if (document.querySelector(`.item_carrousel_${goldID}_jheo_js`)) {
							const itemCarrousel = document.querySelector(`.item_carrousel_${goldID}_jheo_js`);
							itemCarrousel.querySelector(".content_btn_golf_did_jheo_js").innerHTML = `
                                Vouliez-vous annuler votre choix ? <span class="badge bg-danger btn_golf_did btn_golf_did_jheo_js" onclick="cancelGolfFinished(event,${goldID})">Oui</span>
							`;
						}

						if (document.querySelector(".golf_status_jheo_js")) {
							document.querySelector(".golf_status_jheo_js").innerText = "A FAIRE";
						}
					});
				} else if (action === "none") {
					new swal("Bravo !", "Vous avez marqué ce golf comme aucun !", "success").then((value) => {
						if (selectElement) {
							selectElement.innerHTML = `
                                Vouliez-vous annuler votre choix ? <span class="badge bg-danger btn_golf_did btn_golf_did_jheo_js" onclick="cancelGolfFinished(event,${goldID})">Oui</span>
                            `;
						}
						if (document.querySelector(`.item_carrousel_${goldID}_jheo_js`)) {
							const itemCarrousel = document.querySelector(`.item_carrousel_${goldID}_jheo_js`);
							itemCarrousel.querySelector(".content_btn_golf_did_jheo_js").innerHTML = `
                                Vouliez-vous annuler votre choix ? <span class="badge bg-danger btn_golf_did btn_golf_did_jheo_js" onclick="cancelGolfFinished(event,${goldID})">Oui</span>
							`;
						}

						if (document.querySelector(".golf_status_jheo_js")) {
							document.querySelector(".golf_status_jheo_js").innerText = "";
						}
					});
				} else if (action === "remake") {
					new swal("Bravo !", "Vous avez marqué ce golf comme à refaire.", "success").then((value) => {
						if (selectElement) {
							selectElement.innerHTML = `
                                Voulez-vous annuler votre choix ? <span class="badge bg-danger btn_golf_did btn_golf_did_jheo_js" onclick="cancelGolfFinished(event,${goldID})">Oui</span>
                            `;
						}

						if (document.querySelector(`.item_carrousel_${goldID}_jheo_js`)) {
							const itemCarrousel = document.querySelector(`.item_carrousel_${goldID}_jheo_js`);
							itemCarrousel.querySelector(".content_btn_golf_did_jheo_js").innerHTML = `
								Voulez-vous annuler votre choix ? <span class="badge bg-danger btn_golf_did btn_golf_did_jheo_js" onclick="cancelGolfFinished(event,${goldID})">Oui</span>
							`;
						}

						if (document.querySelector(".golf_status_jheo_js")) {
							document.querySelector(".golf_status_jheo_js").innerText = "A REFAIRE";
						}
					});
				} else {
					new swal("Bravo !", "Vous venez d'annuler votre choix !", "success").then((value) => {
						if (selectElement) {
							selectElement.innerHTML = `
                            <label for="selectActionGolf" class="form-label">Vous voulez marquer que ce golf comme : </label>
                            <select class="form-select select_action_golf_nanta_js" id="selectActionGolf" name="sellist_action" data-id="${goldID}" onchange="executeActionForPastGolf(event,'${goldID}')">
                                <option value="0">Aucun</option>
                                <option value="1">A faire</option>
                                <option value="2">Fait</option>
                                <option value="3">A refaire</option>
                            </select>
                            `;
						}

						if (document.querySelector(`.item_carrousel_${goldID}_jheo_js`)) {
							const itemCarrousel = document.querySelector(`.item_carrousel_${goldID}_jheo_js`);
							itemCarrousel.querySelector(".content_btn_golf_did_jheo_js").innerHTML = `
								<label for="selectActionGolf" class="form-label">Vous voulez marquer que ce golf comme : </label>
								<select class="form-select select_action_golf_nanta_js" id="selectActionGolf" name="sellist_action" data-id="${goldID}" onchange="executeActionForPastGolf(event,'${goldID}')">
									<option value="0">Aucun</option>
									<option value="1">A faire</option>
									<option value="2">Fait</option>
									<option value="3">A refaire</option>
								</select>
							`;
						}
						if (document.querySelector(".golf_status_jheo_js")) {
							document.querySelector(".golf_status_jheo_js").innerText = "";
						}
					});
					OBJECT_MARKERS_SEARCH.updateStateGolf("aucun", goldID);
				}
			}
		});
}

function setMonGolf(goldID, golfName, golfAdress) {
	// fecthGolfAction(goldID, "for_me",selectElement)
	showPastillGolfTribuT(goldID, golfName, golfAdress);
}

function executeActionForPastMonGolf(goldID, golfName, golfAdress) {
	setMonGolf(goldID, golfName, golfAdress);
}
