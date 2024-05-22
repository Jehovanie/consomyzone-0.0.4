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

function setGolfRemake(goldID, event) {
	let selectElement = event.target;
	fecthGolfAction(goldID, "remake", selectElement);
}

function executeActionForPastMonGolf(goldID, golfName, golfAdress) {
	setMonGolf(goldID, golfName, golfAdress);
}
