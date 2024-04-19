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
	const key_name = name.trim().split(" ").join("_");
	const rubrique = `
		<button id="ID_nav_${key_name}_jheo_js" type="button" class="position-relative btn btn-light btn-sm me-1 rounded-pill d-flex justify-content-center align-items-center">
			<span class="badge_position_filter_navbar d-none badge_navbar_${api_name}_jheo_js cursor_pointer translate-middle badge rounded-pill bg-danger"
				onclick="openRubriqueFilter('${api_name}')"
			>
				Filtre
			</span>
			<img class="image_icon_rubrique" style="border:none!important" src="${icon}" alt="nav_${key_name}_rubrique" />
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
		const key_name = name.trim().split(" ").join("_");
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

function getDetailFromListRightUpdate(id_rubrique, type_rubrique) {
	displayFicheRubrique(id_rubrique, type_rubrique);
}
