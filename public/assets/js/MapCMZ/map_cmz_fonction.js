/*
	import { addNewElement, removeNewElement,  } from "./lib.js"
	import { updateGeoJsonAdd, removeSpecGeoJson, displayFicheRubrique } from "./map_cmz_instance.js"
*/

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

function updateGeoJson(couche, index, e) {
	if (e.checked) {
		updateGeoJsonAdd(couche, index);
	} else {
		removeSpecGeoJson(couche, index);
	}
}

/**
 * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
 *
 * @goal add rubrique active on the nav bar
 *
 * @whereIUseIt [
 * 		bindSelectRubrique ( RubriqueCMZ.js ) (2)
 * 		addRubriqueActiveByDefault ( RubriqueCMZ.js)
 * ]
 * @param {*} object_rubrique
 */
function addRubriqueActivNavbar(object_rubrique) {
	const { name, icon, api_name } = object_rubrique;
	const rubrique = `
		<button id="ID_nav_${api_name}_jheo_js" type="button" 
			class="position-relative btn btn-light btn-sm me-1 rounded-pill d-flex justify-content-center align-items-center"
			onclick="openRubriqueFilter('${api_name}')"
		>
			<span class="badge_position_filter_navbar d-none badge_navbar_${api_name}_jheo_js cursor_pointer translate-middle badge rounded-pill bg-danger"
				onclick="openRubriqueFilter('${api_name}')"
			>
				Filtre
			</span>
			<img class="image_icon_rubrique" style="border:none!important" src="${icon}" alt="nav_${api_name}_rubrique" />
			${name}
		</button>
	`;

	if (document.querySelector(".content_list_rubrique_active_jheo_js")) {
		/// in lib.js
		addNewElement(rubrique);
	}
}

/**
 * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
 *
 * @goal remove rubrique active on the nav bar
 *
 * @whereIUseIt [
 * 		bindSelectRubrique ( RubriqueCMZ.js ) (2)
 * 		addRubriqueActiveByDefault ( RubriqueCMZ.js)
 * ]
 * @param {*} object_rubrique
 */
function removeRubriqueActivNavbar(name) {
	if (document.querySelector(".content_list_rubrique_active_jheo_js")) {
		const key_name = name;
		const index_deleted = $(`#ID_nav_${key_name}_jheo_js`).index();

		/// in lib.js
		removeNewElement(parseInt(index_deleted));
	}
}

function calculeProgression(y_bord, x_bord, x_var) {
	return ((y_bord.max - y_bord.min) / (x_bord.max - x_bord.min)) * (x_var - x_bord.min) + y_bord.min;
}

function openDetailsContainer() {
	if (!document.querySelector(".content_details_rubrique_jheo_js")) {
		console.log("Selector not found : 'content_details_rubrique_jheo_js'");
		return false;
	}
	const content_details_rubrique = document.querySelector(".content_details_rubrique_jheo_js");
	if (content_details_rubrique.classList.contains("d-none")) {
		content_details_rubrique.classList.remove("d-none");
	}

	content_details_rubrique.querySelector("#content_detail_rubrique_jheo_js").innerHTML = `
		<div class="content_chargment_details content_chargment_details_jheo_js">
			<div class="containt">
				<div class="word word-1">C</div>
				<div class="word word-2">M</div>
				<div class="word word-3">Z</div>
			</div>
		</div>
	`;
}

function closeDetailsContainer() {
	if (!document.querySelector(".content_details_rubrique_jheo_js")) {
		console.log("Selector not found : 'content_details_rubrique_jheo_js'");
		return false;
	}
	const content_details_rubrique = document.querySelector(".content_details_rubrique_jheo_js");
	if (!content_details_rubrique.classList.contains("d-none")) {
		content_details_rubrique.classList.add("d-none");
	}

	content_details_rubrique.querySelector("#content_detail_rubrique_jheo_js").innerHTML = `
		<div class="content_chargment_details content_chargment_details_jheo_js">
			<div class="containt">
				<div class="word word-1">C</div>
				<div class="word word-2">M</div>
				<div class="word word-3">Z</div>
			</div>
		</div>
	`;
}

function openDetailsRubriqueFromLeft(id_rubrique, rubrique_type) {
	openDetailsContainer();
	displayFicheRubrique(id_rubrique, rubrique_type);
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
					<a href="#" class="link-primary ms-4" onclick="getDetailFromListRightUpdate('${item.id}', 'restaurant')">${name}</a>
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
			? `<tr>
					<td colspan="3">
						<div class="alert alert-info text-center" role="alert">
							${message}
						</div>
					</td>
				</tr>
			`
			: `<tr>
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

function injectBodyListMarkerRestoPastille() {
	if (!document.querySelector(".content_right_side_body_jheo_js")) {
		console.log("Selector not found : '.content_right_side_body_body'");
		return false;
	}

	document.querySelector(".content_right_side_body_jheo_js").innerHTML = `
        <div class="right_side_body right_side_body_jheo_js">
			<div class="card_mini_chargement card_mini_chargement_jheo_js">
				<div class="containt">
					<div class="word word-1">C</div>
					<div class="word word-2">M</div>
					<div class="word word-3">Z</div>
				</div>
			</div>
        </div>
    `;
}

function injectDataListMarkerRestoPastille(data, isInSearch = false) {
	if (!document.querySelector(".right_side_body_jheo_js")) {
		console.log("Selector not found : '.right_side_body_jheo_js'");
		return false;
	}

	let message = isInSearch
		? "Il semble que vos restaurants pastilles ne figurent pas parmi les résultats de recherche ou n'avez aucun restaurant pastille."
		: "Vous n'avez pas de restaurant pastille ou vous n'avez pas encore de tribu T avec une extension restaurant.";

	let dataHTML =
		data.length > 0
			? dataListMarker(data)
			: document.querySelector(".cta_to_actualite_jheo_js")
			? `<tr>
				<td colspan="3">
					<div class="alert alert-info text-center" role="alert">
						${message}
					</div>
				</td>
			</tr>
		`
			: `<tr>
				<td colspan="3">
					<div class="alert alert-danger text-center" role="alert">
						<a class="text-primary" href="/connexion" style="text-decoration:underline">Veuillez-vous connecter</a> pour voir la liste des restaurants pastillés dans vos tribus T.
					</div>
				</td>
			</tr>
		`;

	document.querySelector(".right_side_body_jheo_js").innerHTML = `
		<table class="table table_info_marker">
			<thead>
				<tr>
					<th scope="col">Tribu <label class="ms-2">Restaurant</label></th>
				</tr>
			</thead>
			<tbody class="content_list_resto_pastille content_list_resto_pastille_jheo_js">
				${dataHTML}
			</tbody>
		</table>
	`;

	if (document.querySelector(".card_mini_chargement_jheo_js")) {
		document.querySelector(".card_mini_chargement_jheo_js").remove();
	}
}

function injectListMarkerRestoPastilleAlertNonActive() {
	if (!document.querySelector(".right_side_body_jheo_js")) {
		console.log("Selector not found : '.right_side_body_jheo_js'");
		return false;
	}

	document.querySelector(".right_side_body_jheo_js").innerHTML = `
		${alertRubriqueNonActive("Restaurant")}
	`;
}

function alertRubriqueNonActive(rubrique_name) {
	const message = `
		Il semble que cette rubrique '${rubrique_name}' n'est pas activée.
	`;
	const alert_message = `
		<div class="alert alert-info text-center" role="alert">
			${message}
		</div>
	`;

	return alert_message;
}

function getDetailFromListRightUpdate(id_rubrique, type_rubrique) {
	displayFicheRubrique(id_rubrique, type_rubrique);
}

/**
 * Update note global star rating
 * @param {*} note_moyenne
 */
function createStartNoteHtml(note_moyenne, options = {}) {
	// console.log(document.querySelector(`.start_${idItem}_jheo_js`));
	let startHTML = "";

	let rate = note_moyenne - Math.trunc(note_moyenne);

	let rateYellow = rate * 100;
	let rateBlack = 100 - rateYellow;

	for (let i = 0; i < 5; i++) {
		if (i < Math.trunc(note_moyenne)) {
			startHTML += `<i class="fa-solid fa-star" style="color: rgb(245, 209, 101);"></i>`;
		} else {
			if (rate != 0) {
				startHTML += `<i class="fa-solid fa-star" style ="background: linear-gradient(90deg, #F5D165 ${rateYellow}%, #000 ${rateBlack}%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;" }}"></i>`;
				rate = 0;
			} else {
				startHTML += `<i class="fa-solid fa-star"></i>`;
			}
		}
	}

	return startHTML;
}

/**
 * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
 *
 * Goal: Merge two array to one without duplication.
 *
 * @param {*} firstTab
 * @param {*} secondTab
 * @param {*} key_unique
 *
 * @returns new array merge of the two
 */
function mergeArraysUnique(firstTab, secondTab, key_unique) {
	if (firstTab.length === 0) {
		return secondTab;
	}

	if (secondTab.length === 0) {
		return firstTab;
	}

	const map = new Map();

	// Add each item to the map; duplicates will be overwritten
	firstTab.concat(secondTab).forEach((item) => map.set(item[key_unique], item));

	// Return the values of the map as an array
	return Array.from(map.values());
}

function injectFilterProduitStation(identifiant_slyder, produit) {
	if (!document.querySelector(".content_body_filter_jheo_js")) {
		console.log("Error: selector not found 'content_body_filter_jheo_js'");
		return false;
	}

	let array_checkbox_type = [];
	for (var name_produit in produit) {
		var item = produit[name_produit];

		array_checkbox_type.push(`
			<div class="form-check">
				<input class="form-check-input" type="checkbox" 
					id="${name_produit}_toggle_jheo_js"
				    ${item.is_filtered ? "checked" : ""}
				>
				<label class="form-check-label" for="${name_produit}_toggle_jheo_js">
					${name_produit.toUpperCase()}
				</label>
			</div>
		`);
	}

	const html_filter = `
		<div class="content mt-2 mb-3 p-1">
			<h2 class="text-black">Filtrer sur les carubrants</h2>
			<div class="mt-1">
				<div class="content_filter_checkbox">
					${array_checkbox_type.join("")}
				</div>
			</div>
		</div>
	`;

	const html_forchette_price = htmlSlidePriceCarburantStation(identifiant_slyder);

	document.querySelector(".content_body_filter_jheo_js").insertAdjacentHTML(
		"beforeend",
		`
			${html_filter}
			${html_forchette_price}
		`
	);
}

function htmlSlidePriceCarburantStation(identifiant) {
	const html_filter_by_note = `
			<div class="content mt-2 mb-3 p-1">
				<h2 class="text-black">...avec une fourchette de prix:</h2>
				<div class="slider-area mt-1">
					<div class="slider-area-wrapper">
						<span id="${identifiant}_lower_jheo_js"></span>
						<div id="${identifiant}_jheo_js" class="slider"></div>
						<span id="${identifiant}_upper_jheo_js"></span>
					</div>
				</div>
			</div>
			<hr>
		`;

	return html_filter_by_note;
}

function injectFilterProduitResto(identifiant_slyder, produit) {
	if (!document.querySelector(".content_body_filter_jheo_js")) {
		console.log("Error: selector not found 'content_body_filter_jheo_js'");
		return false;
	}

	let array_checkbox_type = [];
	for (var name_produit in produit) {
		var item = produit[name_produit];

		array_checkbox_type.push(`
			<div class="form-check">
				<input class="form-check-input" type="checkbox" 
					id="${name_produit}_toggle_jheo_js"
				    ${item.is_filtered ? "checked" : ""}
				>
				<label class="form-check-label" for="${name_produit}_toggle_jheo_js">
					${name_produit.split("_").join(" ")}
				</label>
			</div>
		`);
	}

	const html_filter = `
		<div class="content mt-2 mb-3 p-1">
			<h2 class="text-black">Type</h2>
			<div class="mt-1">
				<div class="content_filter_checkbox">
					${array_checkbox_type.join("")}
				</div>
			</div>
		</div>
	`;

	const html_forchette_price = htmlSlidePriceCarburantResto(identifiant_slyder);

	document.querySelector(".content_body_filter_jheo_js").insertAdjacentHTML(
		"beforeend",
		`
			${html_filter}
			${html_forchette_price}
		`
	);
}

function htmlSlidePriceCarburantResto(identifiant) {
	const html_filter_by_note = `
			<div class="content mt-2 mb-3 p-1">
				<h2 class="text-black">Faurchette de prix:</h2>
				<div class="slider-area mt-1">
					<div class="slider-area-wrapper">
						<span id="${identifiant}_lower_jheo_js"></span>
						<div id="${identifiant}_jheo_js" class="slider"></div>
						<span id="${identifiant}_upper_jheo_js"></span>
					</div>
				</div>
			</div>
			<hr>
		`;

	return html_filter_by_note;
}

function alertSwalfunctionNoteImplement() {
	new swal(
		"Cher partisan.",
		"Cette fonctinnalité est en cours de développement, merci de votre compréhension.",
		"info"
	);
}

function removeInfoRubrique(element) {
	element.parentElement.remove();
}

function trierTableau(tableau, key) {
	// Séparer les éléments avec is_can_add_new_poi=true et is_can_add_new_poi=false
	let trueElements = tableau.filter((element) => element[key] === true);
	let falseElements = tableau.filter((element) => element[key] === false);

	// Concaténer les deux listes (en mettant d'abord trueElements)
	let sortedArray = trueElements.concat(falseElements);

	return sortedArray;
}

function addInputJourDeMarche() {
	if (!document.querySelector(".content_input_jour_de_marche_jheo_js")) {
		console.log("Selector not found: content_input_jour_de_marche_jheo_js");
		return false;
	}

	const content_input_jour_de_marche = document.querySelector(".content_input_jour_de_marche_jheo_js");

	const all_input_jour_de_marche = content_input_jour_de_marche.querySelectorAll(".content_input_jdm_jheo_js");
	if (all_input_jour_de_marche.length >= 6) {
		if (!content_input_jour_de_marche.querySelector("#validationServer03Feedback")) {
			content_input_jour_de_marche.innerHTML += `
				<div id="validationServer03Feedback" class="invalid-feedback d-block">
					<i class="fa-solid fa-triangle-exclamation me-1"></i>Vous allez dépasser le nombre de jour. 
				</div>
			`;
		}

		setTimeout(() => {
			if (content_input_jour_de_marche.querySelector("#validationServer03Feedback")) {
				content_input_jour_de_marche.querySelector("#validationServer03Feedback").remove();
			}
		}, 3000);
		return false;
	}

	const input_jour_de_marche = generateInputJourDeMarche();

	content_input_jour_de_marche.appendChild(input_jour_de_marche);
}

function generateInputJourDeMarche() {
	const unique_id = Date.now();

	const input_jour_de_marche = document.querySelectorAll(".content_input_jdm_jheo_js");
	const numero = input_jour_de_marche.length + 2;

	const div_container = document.createElement("div");
	div_container.className = `input-group mb-1 content_input_jdm_jheo_js content_input_jdm_${unique_id}_jheo_js`;

	const inputJourDeMarche = `
		<input type="text" class="form-control" name="jour_de_marche_${numero}" id="new_marche_jour_de_marche_${unique_id}">
		<span class="input-group-text pe-auto cta_remove_input_jour_de_marche_jheo_js" onclick="removeInputJourDeMarche('${unique_id}')">
			<i class="fa-solid fa-trash text-danger"></i>
		</span>
	`;

	div_container.innerHTML = inputJourDeMarche;

	return div_container;
}

function removeInputJourDeMarche(uniqueId_input) {
	if (!document.querySelector(`.content_input_jdm_${uniqueId_input}_jheo_js`)) {
		console.log(`Selector not found: '.content_input_jdm_${uniqueId_input}_jheo_js`);
		return false;
	}

	document.querySelector(`.content_input_jdm_${uniqueId_input}_jheo_js`).remove();
}

function handleSubmitNewPOIMarche() {
	const data = {};

	const form = document.querySelector(".form_new_poi_marche_jheo_js");
	all_input = Array.from(form.querySelectorAll("input"));

	all_input.forEach((input) => {
		data[input.name] = input.value;
	});

	let object_keys = Object.keys(data);
	let isDataIncomplet = false;

	let keyNotRequired = ["specificite", "address"];
	object_keys = object_keys.filter((item) => !keyNotRequired.includes(item));

	object_keys.forEach((key) => {
		if (data[key] === "") {
			const object = document.getElementsByName(key);
			const key_html = object.length > 0 ? object[0] : null;

			if (!key_html) return false;

			const id_key_html = key_html.getAttribute("id");
			document.querySelector(`.${id_key_html}_error_jheo_js`).classList.add("d-block");

			key_html.addEventListener("input", () => {
				document.querySelector(`.${id_key_html}_error_jheo_js`).classList.remove("d-block");
			});

			isDataIncomplet = true;
		}
	});

	if (!isDataIncomplet) {
		const btn_submit = document.querySelector(".submit_new_poi_marche_jheo_js");

		btn_submit.innerHTML = `
			<i class="fa-solid fa-spinner fa-spin"></i>
			En cours d'envoi...
		`;

		btn_submit.setAttribute("disabled", true);

		document.querySelector(".btn_close_modal_new_poi_marche_jheo_js").setAttribute("disabled", true);
		document.querySelector(".add_input_jour_de_marche_jheo_js").setAttribute("onclick", () => {});

		Array.from(document.querySelectorAll(".cta_remove_input_jour_de_marche_jheo_js")).forEach((item) =>
			item.setAttribute("onclick", () => {})
		);

		document.querySelector(".cancel_new_poi_marche_jheo_js").setAttribute("disabled", true);

		all_input.forEach((input) => {
			input.setAttribute("readonly", true);
		});

		const url = `/marche/add_new_element`;
		const request = new Request(url, {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});

		fetch(request)
			.then((response) => {
				if (response.status === 401) {
					location.reload();
				}
				return response.json();
			})
			.then((response) => {
				const data = response.data;
				$("#modal_new_poi_marche").modal("hide");
				new swal(
					"Succès !",
					"Le nouveau marché que vous avez ajouté a bien été reçu. Nous vous notifierons si elle a été prise en compte ou non.",
					"success"
				)
					.then((response) => {
						//// from instance///
						console.log(response);
						addPendingDataMarche(data);
					})
					.finally(() => {
						////////////////////////////////////////////////////////////////////////////////////////////
						document.querySelector(".btn_close_modal_new_poi_marche_jheo_js").removeAttribute("disabled");
						document
							.querySelector(".add_input_jour_de_marche_jheo_js")
							.setAttribute("onclick", "addInputJourDeMarche()");

						all_input.forEach((input) => {
							input.removeAttribute("readonly");
						});

						document.querySelector(".cancel_new_poi_marche_jheo_js").removeAttribute("disabled");

						btn_submit.setAttribute("onclick", "handleSubmitNewPOIMarche()");
						btn_submit.innerText = "Envoyer";
						btn_submit.removeAttribute("disabled");
					});
			});
	}
}

function editPOIMarche(rubrique_id) {
	swal(
		`Vous allez entrer en mode interactif pour pouvoir modifier les informations sur ce marché ou le supprimer.
		`,
		{
			buttons: {
				cancel: "Annuler",
				ok: {
					text: "Poursuivre",
					value: "ok",
					className: "swal-button swal-button--info",
				},
				supprimer: { text: "Supprimer", value: "delete", className: "swal-button swal-button--danger" },
			},
		}
	).then((value) => {
		if (value === "ok") {
			swal("Vous pouvez maintenant déplacer le marquer.😊").then(() => {
				///function in function_instance
				makeMarkerDraggablePOI("marche", rubrique_id);
			});
		} else if (value === "delete") {
			swal("Voulez-vous vraiment supprimer ce marché?", {
				buttons: {
					cancel: "NON",
					ok: {
						text: "OUI",
						value: "ok",
					},
				},
			}).then((second_value) => {
				if (second_value === "ok") {
					deleteEtablismentMarcker(id, "marche");
				} else {
					swal("Merci, suppression annulée.");
				}
			});
		} else {
			swal("Merci et revenez la prochaine fois!");
		}
	});
}

function deleteEtablismentMarcker(idEtablisment, type) {
	if (document.querySelector(".close_details_jheo_js")) {
		document.querySelector(".close_details_jheo_js").click();
	}

	switch (type) {
		case "marche":
			deleteEtablismentMarche(idEtablisment);
			break;
		default:
			break;
	}
}

function deleteEtablismentMarche(idEtablisment) {
	const url = `/api/marche/delete_marche`;
	const request = new Request(url, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			idMarcher: idEtablisment,
		}),
	});

	fetch(request)
		.then((response) => {
			if (response.status === 401) {
				location.reload();
			}
			return response.json();
		})
		.then((response) => {
			const { id: idMarche, data } = response;
			new swal(
				"Succès !",
				"Votre demande a bien été envoyée. Nous vous notifierons si elle a été prise en compte ou non",
				"success"
			).then((response) => {
				CURRENT_MAP_INSTANCE.removeSingleMarker(idMarche, "marche");
			});
		});
}

function fetchInformationMarcheToEdit(idMarcher) {
	const url = `/api/marche/json_details/${idMarcher}?realData=edit`;
	// const url = `/api/marche/json_details/114?realData=edit`;
	const request = new Request(url, {
		method: "GET",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
	});

	fetch(request)
		.then((response) => {
			if (response.status === 401) {
				location.reload();
			}
			return response.json();
		})
		.then((response) => {
			const { data } = response;
			console.log(data);

			if (document.querySelector(".marche_user_modified_jheo_js")) {
				document.querySelector(".marche_user_modified_jheo_js").remove();
			}

			if (document.querySelector(".form_edit_poi_marche_jheo_js")) {
				document.querySelector(".form_edit_poi_marche_jheo_js").classList.remove("d-none");
			}

			setFormEdit(data);
		});
}

function setFormEdit(data) {
	if (!document.querySelector(".content_edit_jour_de_marche_jheo_js")) {
		console.log("Selector not found: content_edit_jour_de_marche_jheo_js");
		return false;
	}

	const content_edit_jour_de_marche = document.querySelector(".content_edit_jour_de_marche_jheo_js");

	document.querySelector("#edit_marche_denomination_f").value = data.denominationF;
	document.querySelector("#edit_marche_specificite").value = data.specificite;
	document.querySelector("#edit_marche_jour_de_marche_1").value = data.jour_de_marche_1;

	if (data.jour_de_marche_2 != "") {
		const input_jour_de_marche = generateEditJourDeMarche(data.jour_de_marche_2);
		content_edit_jour_de_marche.appendChild(input_jour_de_marche);
	}

	if (data.jour_de_marche_3 != "") {
		const input_jour_de_marche = generateEditJourDeMarche(data.jour_de_marche_3);
		content_edit_jour_de_marche.appendChild(input_jour_de_marche);
	}

	if (data.jour_de_marche_4 != "") {
		const input_jour_de_marche = generateEditJourDeMarche(data.jour_de_marche_4);
		content_edit_jour_de_marche.appendChild(input_jour_de_marche);
	}

	if (data.jour_de_marche_5 != "") {
		const input_jour_de_marche = generateEditJourDeMarche(data.jour_de_marche_5);
		content_edit_jour_de_marche.appendChild(input_jour_de_marche);
	}

	if (data.jour_de_marche_6 != "") {
		const input_jour_de_marche = generateEditJourDeMarche(data.jour_de_marche_6);
		content_edit_jour_de_marche.appendChild(input_jour_de_marche);
	}

	if (data.jour_de_marche_7 != "") {
		const input_jour_de_marche = generateEditJourDeMarche(data.jour_de_marche_7);
		content_edit_jour_de_marche.appendChild(input_jour_de_marche);
	}

	document.querySelector("#edit_marche_address").value = data.adresse;
	document.querySelector("#edit_marche_code_postal").value = data.codpost;
	document.querySelector("#edit_marche_commune").value = data.commune;
	document.querySelector("#edit_marche_departement").value = data.dep;
}

function generateEditJourDeMarche(value = "") {
	const unique_id = Date.now();

	const input_jour_de_marche = document.querySelectorAll(".content_edit_jdm_jheo_js");
	const numero = input_jour_de_marche.length + 2;

	const div_container = document.createElement("div");
	div_container.className = `input-group mb-1 content_edit_jdm_jheo_js content_input_jdm_${unique_id}_jheo_js`;

	const inputJourDeMarche = `
		<input type="text" class="form-control" name="jour_de_marche_${numero}" id="new_marche_jour_de_marche_${unique_id}" value="${value}">
		<span class="input-group-text pe-auto cta_remove_input_jour_de_marche_jheo_js" onclick="removeInputJourDeMarche('${unique_id}')">
			<i class="fa-solid fa-trash text-danger"></i>
		</span>
	`;

	div_container.innerHTML = inputJourDeMarche;

	return div_container;
}

function cancelEditPoiMarche(rubrique_id) {
	/// this function is in functin_instance.
	cancelEditMarkerMarche("marche", rubrique_id);
}

function handleSubmitEditPOIMarche(idMarche) {
	const data = {};

	const form = document.querySelector(".form_edit_poi_marche_jheo_js");
	all_input = Array.from(form.querySelectorAll("input"));

	all_input.forEach((input) => {
		data[input.name] = input.value;
	});

	let object_keys = Object.keys(data);
	let isDataIncomplet = false;

	let keyNotRequired = ["specificite", "address"];
	object_keys = object_keys.filter((item) => !keyNotRequired.includes(item));

	object_keys.forEach((key) => {
		if (data[key] === "") {
			const object = form.querySelector(`#edit_marche_${key}`);
			const key_html = object ? object : null;

			if (!key_html) return false;

			const id_key_html = key_html.getAttribute("id");
			form.querySelector(`.${id_key_html}_error_jheo_js`).classList.add("d-block");

			key_html.addEventListener("input", () => {
				form.querySelector(`.${id_key_html}_error_jheo_js`).classList.remove("d-block");
			});

			isDataIncomplet = true;
		}
	});

	// if (Object.values(data).every((item) => item != "")) {
	if (!isDataIncomplet) {
		const btn_submit = document.querySelector(".submit_edit_poi_marche_jheo_js");

		btn_submit.innerHTML = `
			<i class="fa-solid fa-spinner fa-spin"></i>
			En cours d'envoi...
		`;

		btn_submit.setAttribute("disabled", true);

		document.querySelector(".btn_close_modal_edit_poi_marche_jheo_js").setAttribute("disabled", true);
		document.querySelector(".btn_close_modal_edit_poi_marche_jheo_js").setAttribute("onclick", () => {});

		document.querySelector(".add_edit_jour_de_marche_jheo_js").setAttribute("onclick", () => {});

		const content_edit_jour_de_marche = document.querySelector(".content_edit_jour_de_marche_jheo_js");
		Array.from(content_edit_jour_de_marche.querySelectorAll(".cta_remove_input_jour_de_marche_jheo_js")).forEach(
			(item) => item.setAttribute("onclick", () => {})
		);

		document.querySelector(".cancel_edit_poi_marche_jheo_js").setAttribute("disabled", true);
		document.querySelector(".cancel_edit_poi_marche_jheo_js").setAttribute("onclick", () => {});

		all_input.forEach((input) => {
			input.setAttribute("readonly", true);
		});

		const url = `/marche/add_edit_element/${idMarche}`;
		const request = new Request(url, {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});

		fetch(request)
			.then((response) => {
				if (response.status === 401) {
					location.reload();
				}
				return response.json();
			})
			.then((response) => {
				const data = response.data;
				$("#modal_edit_poi_marche").modal("hide");
				new swal(
					"Succès !",
					"Votre modification a bien été reçue. Nous vous notifierons si elle a été prise en compte ou non",
					"success"
				)
					.then((response) => {
						//// function need instance of MAP
						addPendingDataMarche(data);
					})
					.finally(() => {
						////////////////////////////////////////////////////////////////////////////////////////////
						document.querySelector(".btn_close_modal_edit_poi_marche_jheo_js").removeAttribute("disabled");
						document
							.querySelector(".add_edit_jour_de_marche_jheo_js")
							.setAttribute("onclick", "addInputEditJourDeMarche()");

						all_input.forEach((input) => {
							input.removeAttribute("readonly");
						});

						document.querySelector(".cancel_edit_poi_marche_jheo_js").removeAttribute("disabled");

						const content_edit_jour_de_marche = document.querySelector(
							".content_edit_jour_de_marche_jheo_js"
						);
						Array.from(content_edit_jour_de_marche.querySelectorAll(".content_edit_jdm_jheo_js")).forEach(
							(item) => item.remove()
						);

						btn_submit.removeAttribute("disabled");
						btn_submit.setAttribute("onclick", "handleSubmitEditPOIMarche()");
						btn_submit.innerText = "Envoyer";
						btn_submit.removeAttribute("disabled");
					});
			});
	}
}
