function getDetailFromListLeft(depart_name, depart_code, id) {
	if (OBJECT_MARKERS_GOLF.checkIsExist(id)) {
		OBJECT_MARKERS_GOLF.clickOnMarker(id);
	} else {
		OBJECT_MARKERS_GOLF.fetchOneData(id_resto);
	}
}

function setGolfTodo(goldID, selectElement) {
	fecthGolfAction(goldID, "todo", selectElement);
}

function setMonGolf(goldID, golfName, golfAdress) {
	// fecthGolfAction(goldID, "for_me",selectElement)
	showPastillGolfTribuT(goldID, golfName, golfAdress);
}

function setGolfFinished(goldID, selectElement) {
	fecthGolfAction(goldID, "finished", selectElement);
}

function setGolfNone(goldID, selectElement) {
	fecthGolfAction(goldID, "none", selectElement);
}

function cancelGolfFinished(event, goldID) {
	let selectElement = event.target;
	fecthGolfAction(goldID, "cancel", selectElement);
	OBJECT_MARKERS_GOLF.updateStateGolf("aucun", goldID); /// update marker
}
function setGolfRemake(goldID, event) {
	let selectElement = event.target;
	fecthGolfAction(goldID, "remake", selectElement);
}

function executeActionForPastGolf(event, goldID) {
	let selectElement = event.target;

	if (selectElement != null && selectElement instanceof HTMLElement) {
		let actionstr = selectElement.options[selectElement.selectedIndex].value;
		action = parseInt(actionstr);

		if (/[0-9]/.test(actionstr)) {
			if (action >= 0 && action <= 3) {
				switch (action) {
					case 1: {
						setGolfTodo(goldID, selectElement);
						OBJECT_MARKERS_GOLF.updateStateGolf("afaire", goldID);
						break;
					}
					case 2: {
						setGolfFinished(goldID, selectElement);
						OBJECT_MARKERS_GOLF.updateStateGolf("fait", goldID);
						break;
					}
					case 3: {
						setGolfRemake(goldID, event);
						OBJECT_MARKERS_GOLF.updateStateGolf("refaire", goldID);
						break;
					}
					// case 4: {

					//     setMonGolf(goldID, selectElement)
					//     OBJECT_MARKERS_GOLF.updateStateGolf("mon_golf", goldID)
					//     break;
					// }

					default: {
						setGolfNone(goldID, selectElement);
						OBJECT_MARKERS_GOLF.updateStateGolf("aucun", goldID);
					}
				}
			} else {
				new swal("Bonjour!", "Bienvenu sur consomyzone.", "info");
			}
		} else {
			new swal("Bonjour!", "Bienvenu sur consomyzone.", "info");
		}
	} else {
		new swal("Bonjour", "Oups!! ", "info");
	}
}

function executeActionForPastMonGolf(goldID, golfName, golfAdress) {
	setMonGolf(goldID, golfName, golfAdress);
}
