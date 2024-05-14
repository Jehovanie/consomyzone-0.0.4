const MAP_CMZ = new RubriqueCMZ();

MAP_CMZ.initMap();
MAP_CMZ.onInitMarkerCluster();
MAP_CMZ.addCulsterNumberAtablismentPerDep();

function updateGeoJsonAdd(couche, index) {
	MAP_CMZ.updateGeoJson(couche, index);
}

function removeSpecGeoJson(couche, index) {
	MAP_CMZ.removeSpecGeoJson(couche, index);
}

function getNumberMarkerDefault() {
	return MAP_CMZ.getNumberMarkerDefault();
}

function displayFicheRubrique(id_rubrique, type_rubrique) {
	MAP_CMZ.displayFicheRubrique(id_rubrique, type_rubrique);
}

function openRubriqueFilter(rubrique_type) {
	MAP_CMZ.openRubriqueFilter(rubrique_type);
}

/**
 * @author Nantenaina a ne pas contacté pendant les congés
 * où: on Utilise cette fonction dans la rubrique resto et tous carte cmz,
 * localisation du fichier: dans data_for_all.js,
 * je veux: rendre le marker draggable
 * si un utilisateur veut modifier une ou des informations
 * @param {} id
 */
function makeMarkerDraggable(id) {
	swal("Vous allez entrer en mode interactif, pour pouvoir modifier les informations sur cet établissement.", {
		buttons: {
			cancel: "Annuler.",
			ok: {
				text: "Poursuivre.",
				value: "ok",
			},
		},
	}).then((value) => {
		switch (value) {
			case "ok": {
				swal("Vous pouvez maintenant déplacer le marquer.😊").then(() => {
					MAP_CMZ.makeMarkerDraggable(id, "restaurant");
				});

				break;
			}
			default:
				swal("Merci et revenez la prochaine fois!");
		}
	});
}

/**
 * @author Nantenaina a ne pas contacté pendant les congés
 * où: on Utilise cette fonction dans la rubrique resto et tous carte cmz,
 * localisation du fichier: dans data_for_all.js,
 * je veux: modifier les informations relatives à un établissement
 * si un utilisateur veut modifier une ou des informations
 */
function makeUserModifResto(e) {
	let denomination_f = document.querySelector("#restoNewDenominationF").value;
	let numvoie = document.querySelector("#newNumVoie").value;
	let typevoie = document.querySelector("#newTypeVoie").value;
	let nomvoie = document.querySelector("#newNomVoie").value;
	let compvoie = document.querySelector("#newCompVoie").value;
	let codpost = document.querySelector("#newCP").value;
	let villenorm = document.querySelector("#newVille").value;
	let tel = document.querySelector("#newPhoneNumber").value;
	let restaurant = document.querySelector("#trueResto").checked ? 1 : 0;
	let brasserie = document.querySelector("#trueBrasserie").checked ? 1 : 0;
	let creperie = document.querySelector("#trueCreperie").checked ? 1 : 0;
	let fastFood = document.querySelector("#trueFastFood").checked ? 1 : 0;
	let pizzeria = document.querySelector("#truePizzeria").checked ? 1 : 0;
	let boulangerie = document.querySelector("#trueBoulangerie").checked ? 1 : 0;
	let bar = document.querySelector("#trueBar").checked ? 1 : 0;
	let cuisineMonde = document.querySelector("#trueCuisineMonde").checked ? 1 : 0;
	let cafe = document.querySelector("#trueCafe").checked ? 1 : 0;
	let the = document.querySelector("#trueSalonThe").checked ? 1 : 0;
	let poix = document.querySelector("#newLongitude").value;
	let poiy = document.querySelector("#newLatitude").value;
	let restoId = document.querySelector("#newIdResto").value;

	let data = {
		denomination_f: denomination_f,
		numvoie: numvoie,
		typevoie: typevoie,
		nomvoie: nomvoie,
		compvoie: compvoie,
		codpost: codpost,
		villenorm: villenorm,
		commune: villenorm,
		tel: tel,
		restaurant: restaurant,
		brasserie: brasserie,
		creperie: creperie,
		fastFood: fastFood,
		pizzeria: pizzeria,
		boulangerie: boulangerie,
		bar: bar,
		cuisineMonde: cuisineMonde,
		cafe: cafe,
		the: the,
		poix: poix,
		poiy: poiy,
		restoId: restoId,
	};

	let request = new Request("/user/make/modif/new/resto", {
		body: JSON.stringify(data),
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
	});

	// makeUserModifResto;
	e.target.textContent = "Modification en cours...";
	e.target.disabled = true;

	fetch(request).then((response) => {
		$("#userModifResto").modal("hide");
		if (response.status === 201) {
			swal(
				"Votre modification a été prise en compte. " +
					"Nous procédons à des vérifications et vous recontacterons prochainement. " +
					"Merci."
			).then(() => {
				e.target.textContent = "Modifier";
				e.target.disabled = false;

				MAP_CMZ.markers.eachLayer((marker) => {
					if (parseInt(marker.options.id) === parseInt(restoId)) {
						marker.dragging.disable();
					}
				});
			});
		} else if (response.status === 205) {
			swal("Il y a une demande de modification en cours pour ce restaurant.").then(() => {
				MAP_CMZ.markers.eachLayer((marker) => {
					if (parseInt(marker.options.id) === parseInt(restoId)) {
						marker.dragging.disable();
					}
				});
			});
		}
	});
}

function pastilleRestoForTribuT(element, isPastilled) {
	let id = element.dataset.id;
	let name = element.dataset.name;
	let tbl = element.dataset.tbname;
	let data = {
		id: id,
		name: name,
		tbl: tbl,
	};

	let link = isPastilled ? "/user/tribu_t/pastille/resto" : "/user/tribu_t/depastille/resto";

	const request = new Request(link, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	});

	fetch(request)
		.then((response) => response.json())
		.then((data) => {
			let tribuName = element.dataset.tribu;
			let html = "";
			if (!isPastilled) {
				html = `<button type="button" data-id="${id}" data-tribu="${tribuName}" data-name="${name}" 
                                data-tbname="${tbl}" class="mx-2 btn btn-success" data-velona="${element.dataset.velona}" 
                                onclick="pastilleRestoForTribuT(this,true)">Pastiller</button> `;

				new swal("Succès !", "Restaurant dépastillé avec succès", "success").then((value) => {
					updateBtnStatus(element, html);
					document.querySelector("#" + tbl).remove();

					MAP_CMZ.updateListRestoDepastille(id, tbl);

					// reorganisePastille();
				});
			} else {
				html = `<button type="button" data-id="${id}" data-tribu="${tribuName}" data-name="${name}" 
                                    data-tbname="${tbl}" class="mx-2 btn btn-info" data-velona="${element.dataset.velona}" 
                                    onclick="pastilleRestoForTribuT(this,false)">Dépastiller</button>`;

				let img = document.createElement("img");
				img.setAttribute("class", "logo_tribu_pastille");
				img.src = element.dataset.velona;
				img.dataset.name = tribuName;
				img.dataset.type = "tribuT";
				img.setAttribute("alt", tribuName);

				let translate_left = "";
				if (document.querySelector(".content_tribuT_pastille_jheo_js")) {
					const content_tribuT_pastille = document.querySelector(".content_tribuT_pastille_jheo_js");
					if (content_tribuT_pastille.querySelector(".logo_tribu_pastille")) {
						translate_left = "translate_left";
					}
				}

				let div = document.createElement("div");
				div.setAttribute("id", tbl);
				div.setAttribute("class", "img_nantenaina content_logo_tribu_pastille " + translate_left);
				div.setAttribute("onclick", "createPopUp(event)");
				div.setAttribute("onmouseout", "resetImage(event)");
				div.setAttribute("onmouseover", "agrandirImage(event)");
				div.setAttribute("data-bs-toggle", "tooltip");
				div.setAttribute("data-bs-placement", "top");
				div.setAttribute("title", "Tribu T " + tribuName);
				div.setAttribute("data-name", tribuName);

				div.appendChild(img);

				new swal("Succès !", "Restaurant pastillé avec succès", "success").then((value) => {
					updateBtnStatus(element, html);

					if (document.querySelector(".content_tribuT_pastille_jheo_js")) {
						const content_tribuT_pastille = document.querySelector(".content_tribuT_pastille_jheo_js");
						content_tribuT_pastille.querySelector(".mainContainerLogoTribu").appendChild(div);

						const all_tribuT_pastille = content_tribuT_pastille.querySelectorAll(".logo_tribu_pastille");
						if (all_tribuT_pastille.length > 4) {
							content_tribuT_pastille.querySelector(".iconePlus_nanta_js").classList.remove("d-none");
						}
					}

					// reorganisePastille();
					MAP_CMZ.updateListRestoPastille(data.id_resto, data.table, element.dataset.velona);
				});
			}
		})
		.catch((error) => console.log(error));
}

/**
 * Get global note avis resto  and setting
 * @param {*} id
 */
function showNoteGlobaleOnMarker(id, globalNote, type) {
	type = type === "resto" ? "restaurant" : type;

	MAP_CMZ.showNoteMoyenneRealTime(id, globalNote, type);
}

function handleClickCtaFilter(rubrique_type) {
	MAP_CMZ.handleClickCtaFilter(rubrique_type);
}

function resetFilterOnRubrique(rubrique_type) {
	MAP_CMZ.resetFilterOnRubrique(rubrique_type);
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
						MAP_CMZ.updateStateGolf("afaire", goldID);
						break;
					}
					case 2: {
						setGolfFinished(goldID, selectElement);
						MAP_CMZ.updateStateGolf("fait", goldID);
						break;
					}
					case 3: {
						setGolfRemake(goldID, event);
						MAP_CMZ.updateStateGolf("refaire", goldID);
						break;
					}
					// case 4: {

					//     setMonGolf(goldID, selectElement)
					//     OBJECT_MARKERS_GOLF.updateStateGolf("mon_golf", goldID)
					//     break;
					// }

					default: {
						setGolfNone(goldID, selectElement);
						MAP_CMZ.updateStateGolf("aucun", goldID);
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

function cancelGolfFinished(event, goldID) {
	let selectElement = event.target;
	fecthGolfAction(goldID, "cancel", selectElement);
	MAP_CMZ.updateStateGolf("aucun", goldID); /// update marker
}

function openFavoryRubrique(rubrique_type) {
	MAP_CMZ.openFavoryRubrique(rubrique_type); /// update marker
}
