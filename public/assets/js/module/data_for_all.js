const all_instances = [
	{ name: "tabac", value: typeof OBJECT_MARKERS_TABAC !== "undefined" ? OBJECT_MARKERS_TABAC : null },
	{ name: "ferme", value: typeof OBJECT_MARKERS_FERME !== "undefined" ? OBJECT_MARKERS_FERME : null },
	{ name: "golf", value: typeof OBJECT_MARKERS_GOLF !== "undefined" ? OBJECT_MARKERS_GOLF : null },
	{ name: "home", value: typeof OBJECT_MARKERS_HOME !== "undefined" ? OBJECT_MARKERS_HOME : null },
	{ name: "search", value: typeof OBJECT_MARKERS_SEARCH !== "undefined" ? OBJECT_MARKERS_SEARCH : null },
	{ name: "station", value: typeof OBJECT_MARKERS_STATION !== "undefined" ? OBJECT_MARKERS_STATION : null },
	{ name: "resto", value: typeof OBJECT_MARKERS_RESTO !== "undefined" ? OBJECT_MARKERS_RESTO : null },
];

const data = all_instances.find((item) => item.value !== null);
const CURRENT_MAP_INSTANCE = data.value;

///generate html checkbox on right side
function generateSelectContoursGeographie(couche, data, itemsSelected = []) {
	let all_select_HTML = "";
	data.forEach((item, index) => {
		const isSelected =
			itemsSelected.length > 0 && itemsSelected.find((jtem) => parseInt(jtem.index) === parseInt(index))
				? true
				: false;
		let nom_reg = "";
		if (couche === "region") {
			nom_reg = item.properties.nom_reg;
		} else if (couche === "quartier") {
			nom_reg = item.properties.code_qv + " " + item.properties.nom_pole;
		} else if (couche === "departement") {
			nom_reg = item.properties.nom_reg;
		} else if (couche === "canton") {
			nom_reg = item.properties.nom_reg;
		} else if (couche === "commune") {
			nom_reg =
				item.properties.depcom +
				" " +
				item.properties.nom_com +
				" " +
				item.properties.nom_reg.split("-").join(" ");
		}

		all_select_HTML += `
            <div class="form-check">
                <input class="form-check-input" type="checkbox" id="${
					couche + "_" + nom_reg + "_" + index
				}" onchange="updateGeoJson('${couche}', '${index}', this)" ${isSelected ? "checked" : ""}>
                <label class="form-check-label text-black" for="${couche + "_" + nom_reg + "_" + index}">
                    ${nom_reg
						.split(" ")
						.map((item) => item.charAt(0).toUpperCase() + item.slice(1).toLowerCase())
						.join(" ")} 
                </label>
            </div>
        `;
	});

	const list = document.querySelector(`.select_${couche.toLowerCase()}_jheo_js`);

	list.innerHTML = all_select_HTML;

	if (list && list.classList.contains("d-none")) {
		list.classList.remove("d-none");
	}
}

function hideChargementRightSide() {
	const chargement_Tabac = document.querySelector(".chargement_right_side_jheo_js");
	const right_Side_Tabac = document.querySelector(".right_side_body_jheo_js");
	if (chargement_Tabac) {
		if (!chargement_Tabac.classList.contains("d-none")) {
			chargement_Tabac.classList.add("d-none");
		}
	}

	if (right_Side_Tabac) {
		if (right_Side_Tabac.classList.contains("opacity04")) {
			right_Side_Tabac.classList.remove("opacity04");
		}
	}
}

function showChargementRightSide() {
	const chargement_Tabac = document.querySelector(".chargement_right_side_jheo_js");
	const right_Side_Tabac = document.querySelector(".right_side_body_jheo_js");
	if (chargement_Tabac) {
		if (chargement_Tabac.classList.contains("d-none")) {
			chargement_Tabac.classList.remove("d-none");
		}
	}

	if (right_Side_Tabac) {
		if (!right_Side_Tabac.classList.contains("opacity04")) {
			right_Side_Tabac.classList.add("opacity04");
		}
	}
}

function updateGeoJson(couche, index, e) {
	if (e.checked) {
		CURRENT_MAP_INSTANCE.updateGeoJson(couche, index);
	} else {
		CURRENT_MAP_INSTANCE.removeSpecGeoJson(couche, index);
	}
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

					CURRENT_MAP_INSTANCE.updateListRestoDepastille(id, tbl);

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
					CURRENT_MAP_INSTANCE.updateListRestoPastille(data.id_resto, data.table, element.dataset.velona);
				});
			}
		})
		.catch((error) => console.log(error));
}

function updateListRestoPastille(id, table, isPastille) {
	if (isPastille) {
		CURRENT_MAP_INSTANCE.updateListRestoPastille(id, table);
	} else {
		CURRENT_MAP_INSTANCE.updateListRestoDepastille(id, table);
	}
}

function injectChooseCouch() {
	if (!document.querySelector(".content_right_side_body_jheo_js")) {
		console.log("Selector not found : '.content_right_side_body_body'");
		return false;
	}
	document.querySelector(".content_right_side_body_jheo_js").innerHTML = `
        <div class="right_side_body right_side_body_jheo_js">
            <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="region">
                <label class="form-check-label" for="region">
                    REGION
                </label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="commune">
                <label class="form-check-label" for="commune">
                    COMMUNE
                </label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="departement">
                <label class="form-check-label" for="departement">
                    DEPARTEMENT
                </label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="iris" >
                <label class="form-check-label" for="iris">
                    IRIS
                </label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="quartierDeVie" >
                <label class="form-check-label" for="quartierDeVie">
                    QUARTIER DE VIE
                </label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="canton" >
                <label class="form-check-label" for="canton">
                    CANTON
                </label>
            </div>
        </div>
    `;
}

function getStateGolf(numeroIndices = 1) {
	const data = `
        <tr>
            <th scope="row">${numeroIndices}</th>
            <td><img class="icon_golf_legend" src="/public/assets/icon/NewIcons/mon_golf.png" alt="Icon Golf"></td>
            
            <td>Mon Golf</td>
        </tr>
        <tr>
            <th scope="row">${numeroIndices + 1}</th>
            <td><img class="icon_golf_legend" src="/public/assets/icon/NewIcons/icon-blanc-golf-vert-badgeC.png" alt="Icon Golf"></td>

            <td>Golf A faire</td>
        </tr>
        <tr>
            <th scope="row">${numeroIndices + 2}</th>
            <td><img class="icon_golf_legend" src="/public/assets/icon/NewIcons/icon-blanc-golf-vert-bC.png" alt="Icon Golf"></td>

            <td>Golf fait</td>
        </tr>
        <tr>
            <th scope="row">${numeroIndices + 3}</th>
            <td><img class="icon_golf_legend" src="/public/assets/icon/NewIcons/icon-blanc-golf-vertC.png" alt="Icon Golf"></td>
            
            <td>Golf Inconnue</td>
        </tr>
    `;
	return data;
}

function injectStatusGolf() {
	const data = getStateGolf(1);
	injectStatus(data);
}

function getStateResto(numeroIndices = 1) {
	const data = `
        <tr>
            <th scope="row">${numeroIndices}</th>
            <td><img class="icon_resto_legend" src="/public/assets/icon/NewIcons/icon-resto-new-B.png" alt="Icon Resto"></td>
            
            <td>Les restaurants non pastillés</td>
        </tr>
        <tr>
            <th scope="row">${numeroIndices + 1}</th>
            <td><img class="icon_resto_legend" src="/public/assets/icon/NewIcons/icon-resto-new-B-org-single.png" alt="Icon Resto"></td>

            <td>Les restaurants pastillés par une seule tribu T.</td>
        </tr>
        <tr>
            <th scope="row">${numeroIndices + 2}</th>
            <td><img class="icon_resto_legend" src="/public/assets/icon/NewIcons/icon-resto-new-B-vert-multi.png" alt="Icon Resto"></td>

            <td>Les restaurants pastillés par plusieurs tribus T.</td>
        </tr>
    `;
	return data;
}

function injectStatusResto() {
	const data = getStateResto(1);
	injectStatus(data);
}

function getStateTabac(numeroIndices = 1) {
	const data = `
        <tr>
            <th scope="row">${numeroIndices}</th>
            <td><img class="icon_resto_legend" src="/public/assets/icon/NewIcons/tabac_black0.png" alt="Icon Tabac"></td>
            
            <td>Marquer Tabac non sélectionné.</td>
        </tr>
        <tr>
            <th scope="row">${numeroIndices + 1}</th>
            <td><img class="icon_resto_legend" src="/public/assets/icon/NewIcons/tabac_red0.png" alt="Icon Tabac"></td>

            <td>Marquer Tabac sélectionné.</td>
        </tr>
    `;
	return data;
}

function injectStatusTabac() {
	const data = getStateTabac(1);
	injectStatus(data);
}

function getStateStation(numeroIndices = 1) {
	const data = `
        <tr>
            <th scope="row">${numeroIndices}</th>
            <td><img class="icon_resto_legend" src="/public/assets/icon/NewIcons/icon-station-new-B.png" alt="Icon Station"></td>
            
            <td>Marquer Station non sélectionné.</td>
        </tr>
        <tr>
            <th scope="row">${numeroIndices + 1}</th>
            <td><img class="icon_resto_legend" src="/public/assets/icon/NewIcons/icon-station-new-R.png" alt="Icon Station"></td>
            <td>Marquer Station sélectionné.</td>
        </tr>
    `;
	return data;
}

function injectStatusStation() {
	const data = getStateStation(1);
	injectStatus(data);
}

function getStateFerme(numeroIndices = 1) {
	const data = `
        <tr>
            <th scope="row">${numeroIndices}</th>
            <td><img class="icon_resto_legend" src="/public/assets/icon/NewIcons/icon-ferme-new-B.png" alt="Icon Ferme"></td>
            
            <td>Marquer Ferme non sélectionné.</td>
        </tr>
        <tr>
            <th scope="row">${numeroIndices + 1}</th>
            <td><img class="icon_resto_legend" src="/public/assets/icon/NewIcons/icon-ferme-new-R.png" alt="Icon Ferme"></td>
            <td>Marquer Ferme sélectionné.</td>
        </tr>
    `;
	return data;
}

function injectStatusFerme() {
	const data = getStateFerme(1);
	injectStatus(data);
}

function injectStatusTous() {
	let data = getStateResto(1);
	data += getStateFerme(4);
	data += getStateStation(6);
	data += getStateGolf(8);
	data += getStateTabac(12);

	injectStatus(data);
}

function injectStatus(data) {
	if (!document.querySelector(".content_right_side_body_jheo_js")) {
		console.log("Selector not found : '.content_right_side_body_body'");
		return false;
	}
	document.querySelector(".content_right_side_body_jheo_js").innerHTML = `
        <div class="right_side_body right_side_body_jheo_js">
            <table class="table table_info_marker">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Icône</th>
                    
                        <th scope="col">Statut</th>
                    </tr>
                </thead>
                <tbody>
                    ${data}

                </tbody>
            </table>
        </div>
    `;
}

function itemRestoPastielle(numeroIndices, depName, dep, name, id, icon) {
	let logo_path = icon ? icon : "/uploads/tribu_t/photo/avatar_tribu.jpg";
	logo_path = IS_DEV_MODE ? logo_path : "/public" + logo_path;

	const items = `
        <tr>
            <th scope="row">${numeroIndices + 1}</th>
            <td onclick="getDetailFromListRight('${depName}', '${dep}', '${id}')">
                <img class="icon_resto_legend" style="clip-path:circle()" src="${logo_path}" alt="Icon Resto">
            </td>
            <td>
                <a href="#" class="link-primary" onclick="getDetailFromListRight('${depName}', '${dep}', '${id}')">${name}</a>
            </td>
        </tr>
    `;
	return items;
}

/**
 * @author Elie
 * afiichege de la list de resto pastillé par tribu
 * @param {*} name
 * @param {*} tribu
 * @returns
 */
function itemRestoPastielleV2(name, tribu) {
	let item;
	let tribu_htm = "";

	let nb_tribu = tribu.length;

	item = tribu[0];

	let logo_path = item.logo_path ? item.logo_path : "/uploads/tribu_t/photo/avatar_tribu.jpg";
	logo_path = IS_DEV_MODE ? logo_path : "/public" + logo_path;

	let default_name_muable = !item.name_tribu_t_muable
		? item.tableName
				.replace("tribu_t_", "")
				.replace("tribug_", "")
				.replace("_restaurant", "")
				.replace(/[0-9]_/g, "")
				.replace("_", " ")
		: item.name_tribu_t_muable;

	let default_name =
		`Tribu ${item.tableName.includes("tribu_t") ? "T" : "G"} ${default_name_muable}` +
		(nb_tribu > 1 ? ` et ${nb_tribu - 1} autre(s) tribu(s)` : "");

	for (let t of tribu) {
		let type = t.tableName.includes("tribu_t") ? "T" : "G";

		let name_muable = !t.name_tribu_t_muable
			? t.tableName
					.replace("tribu_t_", "")
					.replace("tribug_", "")
					.replace("_restaurant", "")
					.replace(/[0-9]_/g, "")
					.replace("_", " ")
					.replace("0", "")
			: t.name_tribu_t_muable;

		name_muable = name_muable.replace("undefined", "").replace("_restaurant", "");

		let name_tribu = `Tribu ${type} ${name_muable}`;

		let log = t.logo_path ? t.logo_path : "/uploads/tribu_t/photo/avatar_tribu.jpg";

		tribu_htm += `<a href="#" data-name="${name_tribu}" onclick="openModalDetailPastille(this)" class="list-group-item list-group-item-action d-flex align-items-center tribu_${type}" data-bs-toggle="modal" data-bs-target="#modalCreatePopUp">
			<img class="icon_resto_legend" data-name="${name_tribu}" style="clip-path:circle()" src="/public${log}" alt="Icon Resto">
			<label class="ms-2">${name_tribu}</label>
		</a>`;
	}

	const items = `
        <tr>
			<td class="td_pastille d-flex flex-column">
                <div class="d-flex position-relative align-items-center">
					<img class="icon_resto_legend cursor-pointer" data-bs-placement="top" title="${default_name}"style="clip-path:circle()" src="${logo_path}" alt="Icon Resto" data-bs-toggle="collapse" data-bs-target="#collapseExample${
		item.id
	}">
					${
						nb_tribu > 1
							? `<span class="other_nb_tribu" data-bs-toggle="collapse" data-bs-target="#collapseExample${
									item.id
							  }">+${nb_tribu - 1}</span>`
							: ""
					}
					<a href="#" class="link-primary ms-4" onclick="getDetailFromListRight('${item.depName}', '${item.dep}', '${
		item.id
	}')">${name}</a>
				</div>
				<div class="collapse list-group" id="collapseExample${item.id}">${tribu_htm}</div>
            </td>

        </tr>
    `;
	return items;
}

function dataListMarker(data) {
	const result = Object.groupBy(data, ({ id }) => id);
	let dataTable = "";
	// data.forEach((item, index) => {
	// 	dataTable += itemRestoPastielle(index, item.depName, item.dep, item.name, item.id, item.logo_path, item.name_tribu_t_muable);
	// });

	/** Edited by Elie */
	for (const [key, value] of Object.entries(result)) {
		dataTable += itemRestoPastielleV2(value[0].name, value);
	}

	return dataTable;
}

function injectListMarker(data, isInSearch = false) {
	if (!document.querySelector(".content_right_side_body_jheo_js")) {
		console.log("Selector not found : '.content_right_side_body_body'");
		return false;
	}

	let message = isInSearch
		? "Il semble que vos restaurants pastilles ne figurent pas parmi les résultats de recherche ou n'avez aucun restaurant pastille."
		: "Vous n'avez pas de restaurant pastille ou vous n'avez pas encore de tribu T avec une extension restaurant.";
	let dataHTML =
		data.length > 0
			? dataListMarker(data)
			: document.querySelector(".cta_to_actualite_jheo_js")
			? `
        <tr>
            <td colspan="3">
                <div class="alert alert-info text-center" role="alert">
                    ${message}
                </div>
            </td>
        </tr>
    `
			: `
        <tr>
            <td colspan="3">
                <div class="alert alert-danger text-center" role="alert">
                   <a class="text-primary" href="/connexion" style="text-decoration:underline">Veuillez-vous connecter</a> pour voir la liste des restaurants pastillés dans vos tribus T.

                </div>
            </td>
        </tr>
    `;

	document.querySelector(".content_right_side_body_jheo_js").innerHTML = `
        <div class="right_side_body right_side_body_jheo_js">
            <table class="table table_info_marker">
                <thead>
                    <tr>
                        <!--<th scope="col">#</th>-->
                        <th scope="col">Tribu <label class="ms-2">Restaurant</label></th>
                    
                        <!--<th scope="col">Restaurant</th>-->
                    </tr>
                </thead>
                <tbody>
                    ${dataHTML}
                </tbody>
            </table>
        </div>
    `;
}

function getDetailFromListRight(nom_dep, id_dep, id_resto) {
	id_resto = parseFloat(id_resto);
	if (CURRENT_MAP_INSTANCE.checkIsExist(id_resto)) {
		CURRENT_MAP_INSTANCE.clickOnMarker(id_resto);
	} else {
		CURRENT_MAP_INSTANCE.fetchOneData(id_resto);
	}
}

/**
 * Get global note avis resto  and setting
 * @param {*} id
 */
function showNoteGlobaleOnMarker(id, globalNote, type) {
	CURRENT_MAP_INSTANCE.showNoteMoyenneRealTime(id, globalNote, type);
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
					CURRENT_MAP_INSTANCE.makeMarkerDraggable(id);
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

				CURRENT_MAP_INSTANCE.markers.eachLayer((marker) => {
					if (parseInt(marker.options.id) === parseInt(restoId)) {
						marker.dragging.disable();
					}
				});
			});
		} else if (response.status === 205) {
			swal("Il y a une demande de modification en cours pour ce restaurant.").then(() => {
				CURRENT_MAP_INSTANCE.markers.eachLayer((marker) => {
					if (parseInt(marker.options.id) === parseInt(restoId)) {
						marker.dragging.disable();
					}
				});
			});
		}
	});
}

function updataMarkerIntCarte(idItem) {}

function dockFicheRubrique(nombre = 10) {
	let closeDetailElement = document.querySelector(".close_details_jheo_js");
	let markerInfo = CURRENT_MAP_INSTANCE.marker_last_selected.options;
	let idRubrique = markerInfo.id;
	let typeRubrique = markerInfo.type ? markerInfo.type : "none";
	closeDetailElement.click();
	let divParent = document.createElement("div");
	let rubName = document.querySelector(".rubriqueNameDetail").dataset.name.trim();
	if (nombre > 1) {
		let containerIcones = document.querySelector(".container-icones");

		if (containerIcones) {
			let listeIcones = document.querySelectorAll(".liste-icones-dock");
			let listeIconesLength = listeIcones.length;
			createDockableIconForMore(divParent, idRubrique, typeRubrique, nombre, listeIconesLength, containerIcones);
		} else {
			let newDivContainer = document.createElement("div");
			newDivContainer.setAttribute("class", "leaflet-control container-icones d-none");

			let btnId = "";
			if (typeRubrique != "none") {
				btnId = "dockableBtn_" + typeRubrique + "_" + idRubrique;
				if (document.querySelector("#" + btnId) === null) {
					newDivContainer.innerHTML += `<button style="font-size: 1.1rem;" class="liste-icones-dock  ms-1" id=${btnId} onclick="reAfficherFiche(this, ${idRubrique}, '${typeRubrique}')" title="${rubName}">
			<i class="fa-solid fa-file"></i>
			</button>`;
				}
			} else {
				btnId = "dockableBtn_" + idRubrique;
				if (document.querySelector("#" + btnId) === null) {
					newDivContainer.innerHTML += `<button style="font-size: 1.1rem;" class="liste-icones-dock  ms-1" id=${btnId} onclick="reAfficherFiche(this, ${idRubrique}, '${typeRubrique}')" title="${rubName}">
										<i class="fa-solid fa-file"></i>
		</button>`;
				}
			}

			document.querySelector(".leaflet-top.leaflet-right").appendChild(newDivContainer);

			createDockableIcon(divParent, idRubrique, typeRubrique);
		}
	} else {
		createDockableIcon(divParent, idRubrique, typeRubrique);

		document.querySelector("#openFlottant").appendChild(divParent);
	}

	CURRENT_MAP_INSTANCE.bindTooltipsDockOnHover();
}

function reAfficherFiche(element, idRubrique, typeRubrique) {
	let iconeId = "";
	if (typeRubrique != "none") {
		iconeId = "dockableBtn_" + typeRubrique + "_" + idRubrique;
		if (document.querySelector("#" + iconeId)) document.querySelector("#" + iconeId).remove();
	} else {
		iconeId = "dockableBtn_" + idRubrique;
		if (document.querySelector("#" + iconeId)) document.querySelector("#" + iconeId).remove();
	}

	element.remove();

	removeOrEditSpecificElement();

	if (typeRubrique != "none") {
		if (CURRENT_MAP_INSTANCE.checkIsExist(idRubrique, typeRubrique)) {
			CURRENT_MAP_INSTANCE.clickOnMarker(idRubrique, typeRubrique);
		}
	} else {
		if (CURRENT_MAP_INSTANCE.checkIsExist(idRubrique)) {
			CURRENT_MAP_INSTANCE.clickOnMarker(idRubrique);
		}
	}
}

function removeOrEditSpecificElement() {
	if (document.querySelector(".container-icones")) {
		if (document.querySelector(".container-icones").children.length == 0)
			document.querySelector(".container-icones").remove();
	}
	let dockDetail = document.querySelector(".dockableDetail");
	if (dockDetail) {
		let iconesNumber = document.querySelector(".dockableDetail > button").textContent.replace(/\D/g, "");
		iconesNumber != "" ? parseInt(iconesNumber) : 0;
		if (iconesNumber > 0) {
			iconesNumber = document.querySelectorAll('[id^="dockableBtn_"]').length;
			if (iconesNumber >= 1) {
				if (iconesNumber > 1) {
					document.querySelector(".dockableDetail > button").textContent = "+" + iconesNumber;
				} else {
					let iconeToGet = document.querySelector('[id^="dockableBtn_"]');
					iconeToGetId = iconeToGet.id;
					iconeToGetOnClick = iconeToGet.getAttribute("onclick");
					dockDetail.setAttribute("onclick", iconeToGetOnClick);
					dockDetail.id = iconeToGetId.replace("dockableBtn", "dockableIcone");
					dockDetail.innerHTML = `<div class="message_tooltip message_tooltip_jheo_js d-none">Cliquer ici pour réafficher la fiche</div>
											<button style="font-size: 1.1rem;">
												<i class="fa-solid fa-file"></i>
											</button>`;
				}
				if (!document.querySelector(".container-icones").classList.contains("d-none")) {
					document.querySelector(".container-icones").classList.add("d-none");
				}
			} else {
				dockDetail.remove();
			}
		}
	}
}

function createDockableIcon(divParent, idRubrique, typeRubrique) {
	divParent.setAttribute("onclick", `reAfficherFiche(this, ${idRubrique}, '${typeRubrique}')`);
	divParent.setAttribute("style", "margin-left:30px;");
	divParent.classList = "content_message_tooltip content_message_tooltip_jheo_js dockableDetail cursor-pointer";

	if (typeRubrique != "none") {
		divParent.id = "dockableIcone_" + typeRubrique + "_" + idRubrique;
	} else {
		divParent.id = "dockableIcone_" + idRubrique;
	}

	divParent.innerHTML = `<div class="message_tooltip message_tooltip_jheo_js d-none">Cliquer ici pour réafficher la fiche</div>
							<button style="font-size: 1.1rem;">
								<i class="fa-solid fa-file"></i>
							</button>`;

	let dockableIconeElement = document.querySelector(".dockableDetail");

	if (dockableIconeElement) dockableIconeElement.remove();

	document.querySelector("#openFlottant").appendChild(divParent);
}

function createDockableIconForMore(divParent, idRubrique, typeRubrique, nombre, nombreIcone, containerIcones) {
	divParent.setAttribute("onclick", "afficherListeIcones()");
	divParent.setAttribute("style", "margin-left:30px;");
	divParent.classList = "content_message_tooltip content_message_tooltip_jheo_js dockableDetail cursor-pointer";
	let rubName = document.querySelector(".rubriqueNameDetail").dataset.name.trim();
	let iconeId = "";
	let canAdd = false;
	if (typeRubrique != "none") {
		iconeId = "dockableBtn_" + typeRubrique + "_" + idRubrique;
		if (document.querySelector("#" + iconeId) === null) {
			containerIcones.innerHTML += `<button style="font-size: 1.1rem;" class="liste-icones-dock ms-1" id=${iconeId} onclick="reAfficherFiche(this, ${idRubrique}, '${typeRubrique}')" title="${rubName}">
								<i class="fa-solid fa-file"></i>
							</button>`;
			canAdd = true;
		}
	} else {
		iconeId = "dockableBtn_" + idRubrique;
		if (document.querySelector("#" + iconeId) === null) {
			containerIcones.innerHTML += `<button style="font-size: 1.1rem;" class="liste-icones-dock ms-1" id=${iconeId} onclick="reAfficherFiche(this, ${idRubrique}, '${typeRubrique}')" title="${rubName}">
								<i class="fa-solid fa-file"></i>
							</button>`;
			canAdd = true;
		}
	}

	if (nombreIcone >= nombre) {
		nombreIcone = nombre;
		document.querySelectorAll(".liste-icones-dock")[0].remove();
	} else {
		if (canAdd) nombreIcone = nombreIcone + 1;
	}

	divParent.innerHTML = `<div class="message_tooltip message_tooltip_jheo_js d-none">Afficher tous</div>
								<button style="font-size: 1.1rem;">
									+${nombreIcone}
								</button>`;

	let dockableIconeElement = document.querySelector(".dockableDetail");

	if (dockableIconeElement) dockableIconeElement.remove();

	document.querySelector("#openFlottant").appendChild(divParent);
}

function afficherListeIcones() {
	let containerIcones = document.querySelector(".container-icones");
	if (containerIcones.classList.contains("d-none")) {
		containerIcones.classList.remove("d-none");
	} else {
		containerIcones.classList.add("d-none");
	}
}

function openCollapseRubriqueFavory(favori_folder_id) {
	if (!document.querySelector(`.sub_${favori_folder_id}`)) {
		console.log(`Selector not found: .sub${favori_folder_id}`);
		return null;
	}

	const content_list_element = document.querySelector(`.sub_${favori_folder_id}`);

	addLoadingListFavory(content_list_element);
	fecthListFavory(content_list_element, favori_folder_id);
}

function addLoadingListFavory(parent_content) {
	parent_content.innerHTML = `
		<div class="spinner-border text-info loading_list_favory loading_list_favory_jheo_js" role="status">
			<span class="visually-hidden">Loading...</span>
		</div>
	`;
}

function removeLoadingListFavory(parent_content) {
	if (!parent_content.querySelector(".loading_list_favory_jheo_js")) {
		console.log(`Selector not found: .loading_list_favory_jheo_js`);
		return null;
	}
	parent_content.querySelector(".loading_list_favory_jheo_js").remove();
}

/**
 * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
 * Goal: fetch all favori in the from the base
 * @param {*} parent_content
 */
function fecthListFavory(parent_content, favori_folder_id = 0) {
	let link = "/rubrique/all_favori";
	link = favori_folder_id != 0 ? `${link}?favoriFolder=${favori_folder_id}` : link;

	const request = new Request(link, {
		method: "GET",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
	});

	fetch(request)
		.then((response) => response.json())
		.then((response) => {
			if (response.code == 401) {
				parent_content.innerHTML = `
					<div class="alert alert-danger" role="alert">
						Vous n'êtes pas connecté, <a href="/connexion" >veuillez connectez ici </a>.
					</div>
				`;
			} else {
				const listElement = response.data;

				let listElement_html = "";
				if (listElement.length === 0) {
					listElement_html = `
						<div class="alert alert-danger custom_alert_danger custom_alert_danger_jheo_js" role="alert">
							Vous n'avez pas un favori ou un dossier ici.
						</div
					`;
				} else {
					listElement.forEach((element) => {
						let element_html = createItemFavory({ ...element }, element.isfolder);
						listElement_html += element_html;
					});
				}

				removeLoadingListFavory(parent_content);
				parent_content.innerHTML = listElement_html;
			}
		})
		.catch((error) => console.log(error));
}

function createItemFavory(object, isFolder) {
	if (isFolder === true) {
		return createItemFavoryFolder(object);
	} else {
		return createItemFavoryElement(object);
	}
}

function createItemFavoryElement(object) {
	let icon_path = "/assets/icon/NewIcons/icon-resto-new-B.png";
	icon_path = IS_DEV_MODE ? icon_path : `/public${icon_path}`;

	return `
		<li class="list-group-item d-flex justify-content-start align-items-center">
			<img class="icon_favory_rubrique" src="${icon_path}" alt="${object.name}">
			<span class="ms-2 favory_etablisment" onclick="getDetailFromListRight('${object.nom_dep}', '${object.dep}', '${object.id}')">${object.name}</span>
		</li>
	`;
}

function createItemFavoryFolder(object) {
	return `
		<li class="list-group-item">
			<i class="fa-solid fa-folder text-warning"></i>
			<a class="favory_folder_collapse" data-bs-toggle="collapse" href="#collapse_${object.id}" role="button" aria-expanded="false" aria-controls="collapse_${object.id}"
			   onclick="openCollapseRubriqueFavory('${object.id}')">
				${object.name}
			</a>
			<div class="collapse" id="collapse_${object.id}">
				<ul class="list-group list-group-flush sub_${object.id}"></ul>
			</div>
		</li>
	`;
}

/**
 * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
 *
 * Goal: Set on etablisment in favory by default in Mes favori
 *       and in the modal there is way that the user can move the emplacement in directory want.
 *
 * Use in: details resto, .../shard/restaurant/detail_resto.html.twig
 *
 * @param  etablisment_id id of etablisment like resto.id, ...
 *
 * @returns
 */
function makeFavori(etablisment_id) {
	if (!document.querySelector(".modal_content_favori_jheo_js")) {
		console.log("Selector not found: '.modal_content_favori_jheo_js'");
		return null;
	}

	const modal_content_favory = document.querySelector(".modal_content_favori_jheo_js");

	/// inject loading during the default operation.
	addChargementModalAddFavori(modal_content_favory);

	//// Content action to move favori, create new folder, ... (must remove these for the new instance)
	if (document.querySelector(".content_cta_move_favory_jheo_js")) {
		const content_cta_move_favori = document.querySelector(".content_cta_move_favory_jheo_js");
		if (!content_cta_move_favori.classList.contains("hidden")) {
			content_cta_move_favori.classList.add("hidden");
		}
		content_cta_move_favori.innerHTML = "";
	}

	//// default operation that store the etablisment in default favory 'Mes favory'
	pushItemFavory(modal_content_favory, etablisment_id);
}

function addChargementModalAddFavori(parent_element) {
	if (parent_element) {
		parent_element.innerHTML = `
			<div class="d-flex justify-content-center align-items-center">
				<div class="spinner-border text-primary m-3" role="status">
					<span class="visually-hidden">Loading...</span>
				</div>
			</div>
		`;
	}
}

function removeChargementModalAddFavori(parent_element) {
	if (parent_element) {
		parent_element.innerHTML = "";
	}
}

/**
 * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
 *
 * Goal: Default operation to store the etablisement in default favory 'Mes favory'
 *
 * @param {DomElement} modal_content_favory: body of the modal
 * @param {integer} etablisment_id: id of the etablisement like resto.id, ...
 */
function pushItemFavory(modal_content_favory, etablisment_id) {
	let link = "/user/add_resto_favory";

	const request = new Request(link, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			etablisment_id: etablisment_id,
		}),
	});

	fetch(request)
		.then((response) => response.json())
		.then((response) => {
			const data = response.data;
			const folder = data.folder;
			const etablisment = data.etablisment;

			const favori_folder = folder.name;

			let btn_alert = "",
				class_alert = "",
				alert_message = "";
			if (response.code === 201) {
				class_alert = "alert-info";
				alert_message = "Ce restaurant est enregistré dans";
			} else if (response.code === 200) {
				class_alert = "alert-warning";
				alert_message = "Ce restaurant est déja enregistré dans";
			}

			btn_alert = `
				<div class="content_info_alert">
					<div class="alert ${class_alert} d-flex justify-content-start align-items-center" role="alert">
						<i class="fa-solid fa-circle-check me-2"></i>
						<p>
							${alert_message}
							<span class="text-decoration-underline text-sm ms-2">
								${favori_folder}
							</span>
						</p>
					</div>
				</div>
			`;
			modal_content_favory.innerHTML = btn_alert;

			handleChangeDirectory(modal_content_favory, etablisment_id);
		})
		.catch((error) => console.log(error));
}

function handleChangeDirectory(modal_content_favory, etablisment_id) {
	const form_html = `
		<form>
			<div class="content_change_directory_favory">
				<div class="d-flex justify-content-start align-items-center">
					<p class="font_size_09 text-decoration-underline text-primary">
						Voulez-vous changer l'emplacement?
					</p>
				</div>
			</div>

			<div class="mt-3 collapse" id="parentdossier">
				<div class="content_hearder mb-1">
					<h5 class="card-title fw-bold">
						Liste de vos dossiers
					</h5>
				</div>
				<hr>
				<div class="mt-1">
					<div class="content_list_folder content_list_folder_jheo_js">
						<div class="loading_favory_folder d-flex justify-content-center align-items-center">
							<div class="spinner-border text-info loading_list_favory loading_list_favory_jheo_js" role="status">
								<span class="visually-hidden">Loading...</span>
							</div>
						</div>
					</div>
					<div>
						<button type="button" class="text-decoration-underline text-primary" 
						    data-bs-toggle="modal" data-bs-target="#new_folder_favori"
							onclick="getAllFolderFavory()">
							Crée un nouveau dossier
						</button>
					</div>
				</div>
			</div>
		</form>
	
	`;

	const cta_move_favori = `
		<button type="button" class="btn btn-primary" 
			data-bs-dismiss="modal"
			data-bs-toggle="collapse" href="#parentdossier"
			onclick="handleMoveDirectory('${etablisment_id}')"
		>
			Oui
		</button>
		<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
			Pas maintenant
		</button>
	`;

	setTimeout(() => {
		modal_content_favory.innerHTML += form_html;
		if (document.querySelector(".content_cta_move_favory_jheo_js")) {
			const content_cta_move_favori = document.querySelector(".content_cta_move_favory_jheo_js");
			if (content_cta_move_favori.classList.contains("hidden")) {
				content_cta_move_favori.classList.remove("hidden");
			}
			content_cta_move_favori.innerHTML = cta_move_favori;
		}
	}, 1000);
}

function handleMoveDirectory(etablisment_id) {
	fetchFolderFavory();

	const cta_move_favori = `
		<button type="button" 
		    class="btn btn-primary disabled cta_change_favori_folder_jheo_js" 
			data-bs-dismiss="modal"
			data-bs-toggle="collapse" href="#parentdossier"
			onclick="changeDirectoryFavoriFolder('${etablisment_id}')"
		>
			Terminer
		</button>
		<button type="button" class="btn btn-danger" data-bs-dismiss="modal">
			Annuler
		</button>
	`;

	if (document.querySelector(".content_cta_move_favory_jheo_js")) {
		const content_cta_move_favori = document.querySelector(".content_cta_move_favory_jheo_js");
		if (content_cta_move_favori.classList.contains("hidden")) {
			content_cta_move_favori.classList.remove("hidden");
		}
		content_cta_move_favori.innerHTML = cta_move_favori;
	}
}

/**
 * @author Jehovanie RAMANRIJOEL <jehovanieram@gmail.com>
 *
 * Goal: Get all folder
 * Use in: Change favori folder
 *
 */
function fetchFolderFavory() {
	if (!document.querySelector(".content_list_folder_jheo_js")) {
		console.log("Selector not found: '.content_list_folder_jheo_js'");
		return null;
	}

	let link = "/rubrique/all_favori_folder";

	const request = new Request(link, {
		method: "GET",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
	});

	fetch(request)
		.then((response) => response.json())
		.then((response) => {
			const content_list_folder = document.querySelector(".content_list_folder_jheo_js");

			if (response.code == 401) {
				content_list_folder.innerHTML = `
					<div class="alert alert-danger" role="alert">
						Vous n'êtes pas connecté, <a href="/connexion" >veuillez connectez ici </a>.
					</div>
				`;
			} else {
				const all_folder_lists = response.all_folder;

				if (all_folder_lists.length === 0) {
					content_list_folder.innerHTML = `
						<div class="alert alert-danger custom_alert_danger custom_alert_danger_jheo_js" role="alert">
							Vous n'avez pas encore un dossier
						</div
					`;
				} else {
					let all_folder_list_html = "";

					if (all_folder_lists.length > 0) {
						//// find the high level folder
						let initialState = 0;
						let folder_high_level = all_folder_lists.reduce((current_folder, folder) => {
							if (folder.livel_parent <= current_folder) {
								return current_folder;
							}
							return folder.livel_parent;
						}, initialState);

						while (initialState <= folder_high_level) {
							let all_folder_parent = all_folder_lists.filter(
								(folder) => parseInt(folder.livel_parent) === initialState
							);

							if (initialState === 0) {
								all_folder_parent.forEach((single_folder) => {
									all_folder_list_html += createSingleElementFolder(single_folder);
								});
								content_list_folder.innerHTML = all_folder_list_html;
							} else {
								let folder_element = "";
								all_folder_parent.forEach((single_folder) => {
									const idFolderParent = single_folder.idFolderParent;
									folder_element = createSingleElementFolder(single_folder);

									if (
										idFolderParent != "0" &&
										document.querySelector(`.list_sub_folder_${idFolderParent}_jheo_js`)
									) {
										const folder_parent = document.querySelector(
											`.list_sub_folder_${idFolderParent}_jheo_js`
										);
										folder_parent.innerHTML += folder_element;
									}
								});
							}

							initialState++;
						}
					}

					const cta_change_favori_folder = document.querySelector(".cta_change_favori_folder_jheo_js");

					const content_folder = document.querySelector(".content_list_folder_jheo_js");
					const all_input_favori_folder = content_folder.querySelectorAll(".input_favori_folder_jheo_js");

					Array.from(all_input_favori_folder).forEach((input_favori_folder) => {
						input_favori_folder.addEventListener("change", () => {
							if (cta_change_favori_folder.classList.contains("disabled")) {
								cta_change_favori_folder.classList.remove("disabled");
							}
						});
					});
				}
			}
		})
		.catch((error) => console.log(error));
}

/**
 * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
 *
 * Goal: Create single element folder.
 *
 * @param {*} folder_object
 */
function createSingleElementFolder(folder_object) {
	const folder_name = folder_object.name;
	const livel_parent = folder_object.hasOwnProperty("livel_parent") ? folder_object.livel_parent : 0;

	let font_size = parseFloat(livel_parent) / 10;
	font_size = `${1 - font_size}rem`;

	let single_folder_html = `
		<div class="form-check">
			<input class="form-check-input input_favori_folder_jheo_js" style="font-size:${font_size};" type="radio" name="flexRadioDefault" id="folder_${folder_object.id}" value="${folder_object.id}" >
			<label class="form-check-label" for="folder_${folder_object.id}">
				<i class="fa-solid fa-folder text-warning"></i>
				${folder_name}
			</label>
            <div class="content_list_folder list_sub_folder_${folder_object.id}_jheo_js">
			</div>
		</div>
	`;
	return single_folder_html;
}

/**
 * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
 *
 * Goal: action add new folder
 *
 */
function addNewFolder() {
	if (!document.querySelector(".input_new_folder_jheo_js")) {
		console.log("Selector not found: '.input_new_folder_jheo_js'");
		return null;
	}

	if (!document.querySelector(".content_list_folder_jheo_js")) {
		console.log("Selector not found: '.content_list_folder_jheo_js'");
		return null;
	}

	const input_new_folder = document.querySelector(".input_new_folder_jheo_js");
	let input_new_folder_value = input_new_folder.value;
	input_new_folder_value = input_new_folder_value.trim();

	const select_parent_folder = document.querySelector(".selected_parent_folder_jheo_js");
	let select_parent_folder_value = select_parent_folder.value;

	if (input_new_folder_value != "" && input_new_folder_value != null) {
		///push create favory folder
		document.querySelector(".cta_hidden_new_folder_favori_jheo_js").click();
		handleCreateFolderFavory({
			folder_name: input_new_folder_value,
			parent_folder: select_parent_folder_value,
		});
	} else {
		if (document.querySelector(".error_folder_name_jheo_js")) {
			error_display = document.querySelector(".error_folder_name_jheo_js");
			if (error_display.classList.contains("hidden")) error_display.classList.remove("hidden");

			if (!input_new_folder.classList.contains("border_input_danger")) {
				input_new_folder.classList.add("border_input_danger");
			}

			input_new_folder.addEventListener("input", () => {
				if (!error_display.classList.contains("hidden")) error_display.classList.add("hidden");

				if (input_new_folder.classList.contains("border_input_danger")) {
					input_new_folder.classList.remove("border_input_danger");
				}
			});
		}
	}
}

/**
 * @author Jehovanie RAMANRIJOEL <jehovanieram@gmail.com>
 *
 * Goal: Get all folder
 * Use for: Create new favori folder
 */
function getAllFolderFavory() {
	if (!document.querySelector(".content_select_folder_favory_jheo_js")) {
		console.log("Selector not found: '.content_select_folder_favory_jheo_js");
		return null;
	}

	let link = "/rubrique/all_favori_folder";

	const request = new Request(link, {
		method: "GET",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
	});

	fetch(request)
		.then((response) => response.json())
		.then((response) => {
			const all_folder_lists = response.all_folder;

			const content_select_folder = document.querySelector(".content_select_folder_favory_jheo_js");
			if (response.code == 401) {
				content_select_folder.innerHTML = `
					<div class="alert alert-danger" role="alert">
						Vous n'êtes pas connecté, <a href="/connexion" >veuillez connectez ici </a>.
					</div>
				`;
			} else {
				let all_folder_options = `
					<option value="0" selected>Dossier parent</option>
				`;

				all_folder_lists.forEach((single_folder) => {
					const folder_name = single_folder.name;
					const single_folder_option = `
						<option value="${single_folder.id}">
							${folder_name}
						</option>
					`;
					all_folder_options += single_folder_option;
				});

				const select_folder_favory = `
					<label class="form-check-label" for="flexSwitchCheckDefault">
						Choisissez le dossier parent
					</label>
					<select class="form-select form-select-sm selected_parent_folder_jheo_js" aria-label=".form-select-sm example">
						${all_folder_options}
					</select>
				`;

				content_select_folder.innerHTML = select_folder_favory;
			}
		})
		.catch((error) => console.log(error));
}

/**
 * @author Jehovanie RAMANDIRJOEL <jehovanieram@gmail.com>
 *
 * Goal: Create new folder.
 * @param {object} data_folder : { folder_name: ..., parent_folder: ... }
 */
function handleCreateFolderFavory(data_folder) {
	let link = "/user/add_new_favori_folder";

	const request = new Request(link, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data_folder),
	});

	fetch(request)
		.then((response) => response.json())
		.then((response) => {
			if (response.code === 201) {
				const folder = response.data;

				if (document.querySelector(".custom_alert_danger_jheo_js")) {
					document.querySelector(".custom_alert_danger_jheo_js").remove();
				}

				const new_folder_html = createSingleElementFolder({
					id: folder.unique_id,
					name: folder.name,
					livel_parent: folder.livel_parent,
				});

				if (folder.id_folder_parent == null || folder.id_folder_parent == "0") {
					const content_list_folder = document.querySelector(".content_list_folder_jheo_js");
					content_list_folder.innerHTML += new_folder_html;
				} else {
					const idFolderParent = folder.id_folder_parent;
					if (document.querySelector(`.list_sub_folder_${idFolderParent}_jheo_js`)) {
						const folder_parent = document.querySelector(`.list_sub_folder_${idFolderParent}_jheo_js`);
						folder_parent.innerHTML += new_folder_html;
					}
				}

				document.querySelector(`#folder_${folder.unique_id}`).addEventListener("change", () => {
					const cta_change_favori_folder = document.querySelector(".cta_change_favori_folder_jheo_js");

					if (cta_change_favori_folder.classList.contains("disabled")) {
						cta_change_favori_folder.classList.remove("disabled");
					}
				});

				const input_new_folder = document.querySelector(".input_new_folder_jheo_js");
				input_new_folder.value = null;

				const select_parent_folder = docuemnt.querySelector(".selected_parent_folder_jheo_js");
				select_parent_folder.value = null;
			}
		})
		.catch((error) => console.log(error));
}

function changeDirectoryFavoriFolder(etablisment_id) {
	const content_folder = document.querySelector(".content_list_folder_jheo_js");
	const all_input_favori_folder = content_folder.querySelectorAll(".input_favori_folder_jheo_js");

	const input_favori_folder_checked = Array.from(all_input_favori_folder).find(
		(input_favori_folder) => input_favori_folder.checked
	);

	if (!document.querySelector(".modal_content_favori_jheo_js")) {
		console.log("Selector not found: '.modal_content_favori_jheo_js'");
		return null;
	}

	const modal_content_favory = document.querySelector(".modal_content_favori_jheo_js");

	if (!!input_favori_folder_checked === false) {
		modal_content_favory;
	}

	const favori_folder_checked = input_favori_folder_checked.value;

	/// inject loading during the default operation.
	addChargementModalAddFavori(modal_content_favory);

	pushMoveFavoryEtablisment(
		{
			etablisment_id: etablisment_id,
			new_favory_folder: favori_folder_checked,
		},
		modal_content_favory
	);
}

function pushMoveFavoryEtablisment(data_folder, modal_content_favory) {
	let link = "/user/change_favory_folder";

	const request = new Request(link, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data_folder),
	});

	fetch(request)
		.then((response) => response.json())
		.then((response) => {
			const data = response.data;
			const folder = data.folder;

			const favori_folder = folder.name;

			let btn_alert = "",
				class_alert = "",
				alert_message = "";
			if (response.code === 201) {
				class_alert = "alert-info";
				alert_message = "Ce restaurant est enregistré dans";
			} else if (response.code === 200) {
				class_alert = "alert-warning";
				alert_message = "Ce restaurant est déjà enregistré dans";
			}

			btn_alert = `
				<div class="content_info_alert">
					<div class="alert ${class_alert} d-flex justify-content-start align-items-center" role="alert">
						<i class="fa-solid fa-circle-check me-2"></i>
						<p>
							${alert_message}<span class="text-decoration-underline text-sm ms-2">
								${favori_folder}
							</span>
						</p>
					</div>
				</div>
			`;
			modal_content_favory.innerHTML = btn_alert;

			if (document.querySelector(".content_cta_move_favory_jheo_js")) {
				const cta_move_favori = `
					<button type="button" class="btn btn-info" data-bs-dismiss="modal">
						Ferme
					</button>
				`;
				document.querySelector(".content_cta_move_favory_jheo_js").innerHTML = cta_move_favori;
			}
		})
		.catch((error) => console.log(error));
}
