function getDetailFromListLeft(depart_name, depart_code, id) {
	if (OBJECT_MARKERS_GOLF.checkIsExist(id)) {
		OBJECT_MARKERS_GOLF.clickOnMarker(id);
	}

	// if (screen.width < 991) {
	//     var pathDetails = `/golf-mobile/departement/${depart_name}/${depart_code}/details/${id}`;
	//     location.assign(pathDetails)
	// }else{
	//     OBJECT_MARKERS_GOLF.clickOnMarker(id)
	// }
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

// function fecthGolfAction(goldID, action,selectElement){

//     if(selectElement !=null && selectElement instanceof HTMLElement){
//         selectElement=selectElement.parentElement;
//     let url = ""
//     switch (action){
//         case  "finished":{
//             url = '/user/setGolf/finished'
//             brerak;
//         }
//         case "todo":{
//             url = '/user/setGolf/todo'
//             break;
//         }
//         // case "for_me":{
//         //     url = '/user/setGolf/for_me'
//         //     break;
//         // }
//         case  "none": {
//             url = '/user/setGolf/none'
//             break;
//         }
//         case "remake": {
//             url = "/user/setGolf/remake"
//             break;
//         }
//         default:{
//             url = '/user/setGolf/unfinished'
//             break;
//         }

//     }

//     const request = new Request(url, {
//         method: "POST",
//         headers: {
//             'Accept': 'application/json',
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//             golfID : goldID,
//         })
//     })

//     fetch(request)
//         .then(response=>response.json())
//         .then(response =>{
//             if( response.success){
//                 if( action === "finished"){
//                     new swal("Bravo !","Vous avez marqué ce golf comme fait !", "success")
//                     .then((value) => {
//                         if( document.querySelector(".content_btn_golf_did_jheo_js")){
//                             selectElement.innerHTML= `
//                                 Voulez-vous annuler votre choix ? <span class="badge bg-danger btn_golf_did btn_golf_did_jheo_js" onclick="cancelGolfFinished(event,${goldID})">Oui</span>
//                             `
//                         }

//                         if( document.querySelector(".golf_status_jheo_js")){
//                             document.querySelector(".golf_status_jheo_js").innerText= "FAIT"
//                         }
//                     });

//                 }else if( action === "for_me"){
//                     new swal("Bravo !","Vous avez marqué ce golf comme Mon Golf !", "success")
//                     .then((value) => {
//                         if( document.querySelector(".content_btn_golf_did_jheo_js")){
//                             selectElement.innerHTML= `
//                                 Voulez-vous annuler votre choix ? <span class="badge bg-danger btn_golf_did btn_golf_did_jheo_js" onclick="cancelGolfFinished(event,${goldID})">Oui</span>
//                             `
//                         }

//                         if( document.querySelector(".golf_status_jheo_js")){
//                             document.querySelector(".golf_status_jheo_js").innerText= "MON GOLF"
//                         }
//                     });

//                 }else if( action === "todo"){

//                     new swal("Bravo !","Vous avez marqué ce golf comme à faire !", "success")
//                     .then((value) => {
//                         if( document.querySelector(".content_btn_golf_did_jheo_js")){
//                             selectElement.innerHTML= `
//                                 Voulez-vous annuler votre choix ? <span class="badge bg-danger btn_golf_did btn_golf_did_jheo_js" onclick="cancelGolfFinished(event,${goldID})">Oui</span>
//                             `
//                         }

//                         if( document.querySelector(".golf_status_jheo_js")){
//                             document.querySelector(".golf_status_jheo_js").innerText= "A FAIRE"
//                         }
//                     });

//                 }else if( action === "none"){

//                     new swal("Bravo !","Vous avez choisi de ne rien faire avec ce golf.", "success")
//                     .then((value) => {
//                         if(document.querySelector(".content_btn_golf_did_jheo_js")){
//                             selectElement.innerHTML= `
//                                 Voulez-vous annuler votre choix ? <span class="badge bg-danger btn_golf_did btn_golf_did_jheo_js" onclick="cancelGolfFinished(event,${goldID})">Oui</span>
//                             `
//                         }

//                         if( document.querySelector(".golf_status_jheo_js")){
//                             document.querySelector(".golf_status_jheo_js").innerText= ""
//                         }
//                     });

//                 } else if (action === "remake") {
//                     new swal("Bravo !","Vous avez marqué ce golf comme à refaire.", "success")
//                     .then((value) => {
//                         if(document.querySelector(".content_btn_golf_did_jheo_js")){
//                             selectElement.innerHTML= `
//                                 Voulez-vous annuler votre choix ? <span class="badge bg-danger btn_golf_did btn_golf_did_jheo_js" onclick="cancelGolfFinished(event,${goldID})">Oui</span>
//                             `
//                         }

//                         if( document.querySelector(".golf_status_jheo_js")){
//                             document.querySelector(".golf_status_jheo_js").innerText= "A REFAIRE"
//                         }
//                     });
//                 }else {

//                     new swal("Info !","Vous venez d'annuler votre choix !", "success")
//                     .then((value) => {
//                         if( document.querySelector(".content_btn_golf_did_jheo_js")){
//                             selectElement.innerHTML= `
//                             <label for="selectActionGolf" class="form-label">Vous voulez marquer que ce golf comme : </label>
//                             <select class="form-select select_action_golf select_action_golf_nanta_js" id="selectActionGolf" name="sellist_action" data-id="${goldID}" onchange="executeActionForPastGolf(event,'${goldID}')">
//                                 <option value="0">Aucun</option>
//                                 <option value="1">A faire</option>
//                                 <option value="2">Fait</option>
//                                 <option value="3">A refaire</option>
//                                 <option value="4">Mon golf</option>
//                             </select>
//                             `
//                         }

//                         if( document.querySelector(".golf_status_jheo_js")){
//                                 document.querySelector(".golf_status_jheo_js").innerText= ""
//                         }

//                         OBJECT_MARKERS_GOLF.updateStateGolf("aucun", goldID)
//                     })

//                 }
//             }
//         })
// }else{
//         new swal("Bonjour","Oups!! ", "info")
//     }
//     // const url = (action === "finished") ? '/user/setGolf/finished': '/user/setGolf/unfinished';

// }
// }

function executeActionForPastMonGolf(goldID, golfName, golfAdress) {
	setMonGolf(goldID, golfName, golfAdress);
}
