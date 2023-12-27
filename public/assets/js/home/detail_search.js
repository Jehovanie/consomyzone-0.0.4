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

function setMonGolf(goldID, golfName, golfAdress) {
    showPastillGolfTribuT(goldID, golfName, golfAdress);
}

function executeActionForPastMonGolf(goldID, golfName, golfAdress) {
    setMonGolf(goldID, golfName, golfAdress);
}

function cancelGolfFinished(event, goldID) {
	let selectElement = event.target;
	fecthGolfAction(goldID, "cancel", selectElement);

	OBJECT_MARKERS_SEARCH.updateStateGolf("aucun", goldID); /// update marker
}

function executeActionForPastGolf(event, goldID) {
	let selectElement = event.target;

	if (selectElement != null && selectElement instanceof HTMLElement) {
		let actionstr = selectElement.options[selectElement.selectedIndex].value;
		action = parseInt(actionstr);
	}

	if (action === 1) {
		setGolfTodo(goldID, selectElement);
		OBJECT_MARKERS_SEARCH.updateStateGolf("afaire", goldID);
	} else if (action === 2) {
		setGolfFinished(goldID, selectElement);
		OBJECT_MARKERS_SEARCH.updateStateGolf("fait", goldID);
	} else if (action === 0) {
		setGolfNone(goldID, selectElement);
		OBJECT_MARKERS_SEARCH.updateStateGolf("aucun", goldID);
	} else if (action === 3) {
		setGolfRemake(goldID, selectElement);
		OBJECT_MARKERS_SEARCH.updateStateGolf("refaire", goldID);
	} else {
		cancelGolfFinished(selectElement, goldID);
		OBJECT_MARKERS_SEARCH.updateStateGolf("aucun", goldID); /// update marker
	}
}
