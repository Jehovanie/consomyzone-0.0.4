function setGolfTodo(goldID) {
	fecthGolfAction(goldID, "todo");
}

function setGolfFinished(goldID) {
	fecthGolfAction(goldID, "finished");
}

function setGolfNone(goldID) {
	fecthGolfAction(goldID, "none");
}

function cancelGolfFinished(event, goldID) {
	fecthGolfAction(goldID, "cancel");
}

function setGolfRemake(goldID, event) {
	let selectElement = event.target;
	fecthGolfAction(goldID, "remake", selectElement);
}

function executeActionForPastGolf(event, goldID) {
	let action = document.querySelector("#selectActionGolf").value;
	if (action == "1") {
		setGolfTodo(goldID);
		OBJECT_MARKERS_HOME.updateStateGolf("afaire", goldID);
	} else if (action == "2") {
		setGolfFinished(goldID);
		OBJECT_MARKERS_HOME.updateStateGolf("fait", goldID);
	} else if (action == "0") {
		setGolfNone(goldID);
		OBJECT_MARKERS_HOME.updateStateGolf("aucun", goldID);
	} else if (action == "3") {
		setGolfRemake(goldID, event);
		OBJECT_MARKERS_HOME.updateStateGolf("refaire", goldID);
	} else {
		cancelGolfFinished(event, goldID);
		// OBJECT_MARKERS_HOME.updateStateGolf("aucun", goldID)
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
						if (document.querySelector(".content_btn_golf_did_jheo_js")) {
							document.querySelector(".content_btn_golf_did_jheo_js").innerHTML = `
                                Vouliez-vous annuler votre choix ? <span class="badge bg-danger btn_golf_did btn_golf_did_jheo_js" onclick="cancelGolfFinished(event,${goldID})">Oui</span>
                            `;
						}

						if (document.querySelector(".golf_status_jheo_js")) {
							document.querySelector(".golf_status_jheo_js").innerText = "FAIT";
						}
					});
				} else if (action === "todo") {
					new swal("Bravo !", "Vous avez marqué ce golf comme à faire !", "success").then((value) => {
						if (document.querySelector(".content_btn_golf_did_jheo_js")) {
							document.querySelector(".content_btn_golf_did_jheo_js").innerHTML = `
                                Vouliez-vous annuler votre choix ? <span class="badge bg-danger btn_golf_did btn_golf_did_jheo_js" onclick="cancelGolfFinished(event,${goldID})">Oui</span>
                            `;
						}

						if (document.querySelector(".golf_status_jheo_js")) {
							document.querySelector(".golf_status_jheo_js").innerText = "A FAIRE";
						}
					});
				} else if (action === "none") {
					new swal("Bravo !", "Vous avez marqué ce golf comme aucun !", "success").then((value) => {
						if (document.querySelector(".content_btn_golf_did_jheo_js")) {
							document.querySelector(".content_btn_golf_did_jheo_js").innerHTML = `
                                Vouliez-vous annuler votre choix ? <span class="badge bg-danger btn_golf_did btn_golf_did_jheo_js" onclick="cancelGolfFinished(event,${goldID})">Oui</span>
                            `;
						}

						if (document.querySelector(".golf_status_jheo_js")) {
							document.querySelector(".golf_status_jheo_js").innerText = "";
						}
					});
				} else if (action === "remake") {
					new swal("Bravo !", "Vous avez marqué ce golf comme à refaire.", "success").then((value) => {
						if (document.querySelector(".content_btn_golf_did_jheo_js")) {
							document.querySelector(".content_btn_golf_did_jheo_js").innerHTML = `
                                Voulez-vous annuler votre choix ? <span class="badge bg-danger btn_golf_did btn_golf_did_jheo_js" onclick="cancelGolfFinished(event,${goldID})">Oui</span>
                            `;
						}

						if (document.querySelector(".golf_status_jheo_js")) {
							document.querySelector(".golf_status_jheo_js").innerText = "A REFAIRE";
						}
					});
				} else {
					new swal("Bravo !", "Vous venez d'annuler votre choix !", "success").then((value) => {
						if (document.querySelector(".content_btn_golf_did_jheo_js")) {
							document.querySelector(".content_btn_golf_did_jheo_js").innerHTML = `
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

						OBJECT_MARKERS_HOME.updateStateGolf("aucun", goldID);
					});
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
