/*
 pas de function importer.
 */

var slickConfig = {
	slidesToShow: 0,
	slidesToScroll: 1,
	infinite: false,
	arrows: true,
	prevArrow: `<i class="fa-solid fa-circle-chevron-left fs-3 cursor-pointer color_blue"></i>`,
	nextArrow: `<i class="fa-solid fa-circle-chevron-right fs-3 cursor-pointer color_blue"></i>`,
};

const slickElement = $(".content_list_rubrique_active_jheo_js").slick(slickConfig);

function updateSlidesToShow() {
	let max_slidesToScroll = slickElement[0].slick.slideCount;

	// Adjust slidesToShow based on the number of child elements
	slickConfig.slidesToShow = Math.min(max_slidesToScroll, 5); // Limit to maximum of 5 slidesToShow

	// Reinitialize Slick Carousel with updated configuration
	slickElement.slick("unslick").slick(slickConfig);
}

function addNewElement(newElement) {
	slickElement.slick("slickAdd", newElement);
	updateSlidesToShow();
}

function removeNewElement(index) {
	console.log("remove: " + index);
	slickElement.slick("slickRemove", index);
	updateSlidesToShow();
}

//// data table object //////////////////////////////////////
let DataTableObject = function () {
	dataTableInstance = null;
};

DataTableObject.prototype = {
	activeDataTableOnList: (id_table_to_active_data_table) => {
		if (dataTableInstance) {
			dataTableInstance.clear().draw(); // Clear all data and update the view
			dataTableInstance.destroy();
		}
		dataTableInstance = $(id_table_to_active_data_table).DataTable({
			searching: false, // Ceci désactive la barre de recherche
			pageLength: 50,
			language: {
				url: "https://cdn.datatables.net/plug-ins/1.13.4/i18n/fr-FR.json",
			},
		});
	},

	addDataTableOnList: (data) => {
		data.forEach((item_data) => {
			dataTableInstance?.row.add([item_data]);
		});

		dataTableInstance?.draw();
	},

	removeOneElement: (element) => {
		// console.log(dataTableInstance.rows().eq(0));
		console.log("remove element: ");
		console.log(element);
		console.log("================================");
	},

	updateDataTableByFilter: (element) => {
		console.log(element);
		// Remove rows based on a condition directly
		dataTableInstance
			.rows(function (idx, data, node) {
				var parser = new DOMParser();
				var data_html = parser.parseFromString(data[0], "text/html");

				const text = data_html.querySelector(".containt_name_note_address_jheo_js");
				if (text) {
					// Check if the element exists
					const departement = text.getAttribute("data-departement");
					const note = text.getAttribute("data-note");
					const rubrique_id = text.getAttribute("data-rubrique-id");
					const rubrique_type = text.getAttribute("data-rubrique-type");

					if (departement && parseInt(element.departement) !== parseInt(departement)) {
						return true;
					}
				}
				return false;
			})
			.remove();

		dataTableInstance.draw();
	},

	removeListNavLeftRubriqueType: (rubriqueType) => {
		dataTableInstance
			.rows(function (idx, data, node) {
				var parser = new DOMParser();
				var data_html = parser.parseFromString(data[0], "text/html");

				const text = data_html.querySelector(".containt_name_note_address_jheo_js");
				if (text) {
					// Check if the element exists
					const departement = text.getAttribute("data-departement");
					const note = text.getAttribute("data-note");
					const rubrique_id = text.getAttribute("data-rubrique-id");
					const rubrique_type = text.getAttribute("data-rubrique-type");

					if (rubriqueType === rubrique_type) {
						return true;
					}
				}
				return false;
			})
			.remove();

		dataTableInstance.draw();
	},
};

const dataTable = new DataTableObject();

function activeDataTableOnList(id_table_to_active_data_table) {
	dataTable.activeDataTableOnList(id_table_to_active_data_table);
}

function addDataTableOnList(data) {
	dataTable.addDataTableOnList(data);
}

function removeOneElement(element) {
	dataTable.removeOneElement(element);
}

function updateDataTableByFilter(object_filter) {
	dataTable.updateDataTableByFilter(object_filter);
}

function removeListNavLeftRubriqueType(rubrique_type) {
	dataTable.removeListNavLeftRubriqueType(rubrique_type);
}

///// end of datatable

function injectSlider(start_min_max = { min: 0, max: 5 }) {
	const skipSlider = document.getElementById("skipstep");
	const skipValues = [document.getElementById("skip-value-lower"), document.getElementById("skip-value-upper")];

	noUiSlider.create(skipSlider, {
		start: [start_min_max.min, start_min_max.max],
		connect: true,
		// behaviour: "drag",
		step: 0.1,
		range: {
			min: 0,
			max: 5,
		},
		format: {
			from: function (value) {
				return parseFloat(value).toFixed(1);
			},
			to: function (value) {
				return parseFloat(value).toFixed(1);
			},
		},
	});

	skipSlider.noUiSlider.on("update", function (values, handle) {
		skipValues[handle].innerHTML = values[handle];
	});
}

function resetSliderNotation() {
	var skipSlider = document.getElementById("skipstep");
	skipSlider.noUiSlider.set([0, 5]);
}

function injectSliderStation(identifiant, start_min_max) {
	const slider_for_price_station = document.getElementById(`${identifiant}_jheo_js`);
	const slider_value_price_station = [
		document.getElementById(`${identifiant}_lower_jheo_js`),
		document.getElementById(`${identifiant}_upper_jheo_js`),
	];

	noUiSlider.create(slider_for_price_station, {
		start: [start_min_max.min, start_min_max.max],
		connect: true,
		// behaviour: "drag",
		step: 0.01,
		range: {
			min: start_min_max.min_default,
			max: start_min_max.max_default,
		},
		format: {
			from: function (value) {
				return parseFloat(value).toFixed(2);
			},
			to: function (value) {
				return parseFloat(value).toFixed(2);
			},
		},
	});

	slider_for_price_station.noUiSlider.on("update", function (values, handle) {
		slider_value_price_station[handle].innerHTML = values[handle];
	});
}

function injectSliderCustomise(identifiant, start_min_max) {
	const slider_for_price_station = document.getElementById(`${identifiant}_jheo_js`);
	const slider_value_price_station = [
		document.getElementById(`${identifiant}_lower_jheo_js`),
		document.getElementById(`${identifiant}_upper_jheo_js`),
	];

	noUiSlider.create(slider_for_price_station, {
		start: [start_min_max.min, start_min_max.max],
		connect: true,
		// behaviour: "drag",

		step: 2,
		range: {
			min: start_min_max.min_default,
			max: start_min_max.max_default,
		},
		format: {
			from: function (value) {
				return parseInt(value);
			},
			to: function (value) {
				return parseInt(value);
			},
		},
		draggable: false, // Disable dragging initially
	});

	slider_for_price_station.noUiSlider.on("update", function (values, handle) {
		slider_value_price_station[handle].innerHTML = values[handle];
	});
}

function resetSliderCustomise(identifiant, { min, max }) {
	const slider_for_customise = document.getElementById(`${identifiant}_jheo_js`);
	const slider_value_customise = [min, max];

	slider_for_customise.noUiSlider.set(slider_value_customise);
}

//// for driver js ////
document.addEventListener("DOMContentLoaded", () => {
	if (!getDataInLocalStorage("is_dacticiel_seen")) {
		swal(
			`Nous avons préparé un didacticiel pour les nouveaux utilisateurs de notre plateforme. Voulez-vous le voir ?`,
			{
				buttons: {
					ok: {
						text: "Oui, je veux.",
						value: "ok",
						className: "swal-button swal-button--info",
					},
					supprimer: {
						text: "Non, merci.",
						value: "no",
						className: "swal-button swal-button--danger",
					},
				},
			}
		).then((value) => {
			if (value === "ok") {
				openDidacticiel();
				setDataInLocalStorage("is_dacticiel_seen", true);
			}
		});
	}
});

function openDidacticiel() {
	const driver = window.driver.js.driver;

	const driverObj = driver({
		showProgress: true,
		steps: [
			{
				element: "#logo_cmz_jheo_js",
				popover: {
					title: "Bonjour,",
					description:
						"Voici un petit didacticiel pour vous aider à identifier les éléments pertinents de notre plateforme.",
				},
			},
			{
				element: "#navbar_recherche_jheo_js",
				popover: {
					title: "Recherche",
					description: "Utilisez ce formulaire pour effectuer une recherche sur une ou plusieurs rubriques.",
				},
			},
			{
				element: "#cta_toggle_list_rubrique_jheo_js",
				popover: {
					title: "Pour la liste déroulante,",
					description: "Cliquez sur ce bouton pour l'afficher ou le fermer.",
				},
			},
			{
				element: "#id_content_list_rubrique_active_jheo_js",
				popover: {
					title: "Dans ce carrousel,",
					description: "Vous trouvez la liste des rubriques actives.",
				},
			},
			{
				element: ".rubrique_element_jheo_js",
				popover: {
					title: "Pour une rubrique,",
					description: "Vous pouvez cliquer pour afficher le filtre spécifique associé.",
				},
			},
			{
				element: "#content_cta_signup_sigin_jheo_js",
				popover: {
					title: "Connexion",
					description: "Cliquez sur ce bouton pour vous connecter.",
				},
			},
			{
				element: ".content_list_nav_left_jheo_js",
				popover: {
					title: "Version de la liste des marqueurs POI.",
					description: "Cette section contient la liste des marqueurs POI sur la carte.",
				},
			},
			{
				element: ".item_list_rubrique_nav_left_jheo_js",
				popover: {
					title: "Un marqueur POI",
					description: "Dans cette section, vous trouverez la decription de base d'un marqueur POI.",
				},
			},
			{
				element: "#id_rubrique_type_jheo_js",
				popover: {
					title: "Liste de tous les rubriques.",
					description:
						"Cliquez sur cette icône pour afficher la liste de toutes les rubriques existantes dans CMZ.",
				},
			},
			{
				element: "#id_favoris_elie_js",
				popover: {
					title: "Favoris dans les rubriques.",
					description:
						"Cliquez sur cette icône pour voir mes favoris dans les différents types de rubriques.",
				},
			},
			{
				element: "#id_resto_pastille_jheo_js",
				popover: {
					title: "Liste des restaurants pastillées.",
					description: "Cliquez sur cette icône pour voir la liste des restaurants pastillées.",
				},
			},
			{
				element: "#id_info_rubrique_icon_jheo_js",
				popover: {
					title: "Légende des icônes sur la carte.",
					description: "Cliquez sur cette icône pour voir la légende des icônes sur la carte.",
				},
			},
			{
				element: "#id_couche_tabac_jheo_js",
				popover: {
					title: "Listes des contours géographiques.",
					description: "Pour voir la listes des contours géographiques, cliquez sur cette icône.",
				},
			},
			{
				element: "#id_reset_zoom_jheo_js",
				popover: {
					title: "Réinitialisation du niveau de zoom.",
					description:
						"Pour réinitialiser le niveau de zoom à la position initiale, cliquez sur cette icône.",
				},
			},
			{
				element: "#id_tiles_type_jheo_js",
				popover: {
					title: "Sélectionner un type de carte.",
					description:
						"Pour changer le type de carte et afficher une vue différente, cliquez sur cette icône..",
				},
			},
			{
				element: "#first_take",
				popover: {
					title: "Prise en main de ConsoMyZone",
					description:
						"Si vous êtes nouveaux ici, en cliquant ici, vous trouverez un guide pour prendre en main CMZ.",
				},
			},
			{
				element: "#openChat",
				popover: {
					title: "Assistant virtuel de CMZ.",
					description: "Si vous avez besoin d'aide, votre assistant virtuel CMZ est là. Cliquez ici.",
				},
			},
			{
				element: "#id_reopen_didacticiel_jheo_js",
				popover: {
					title: "Didacticiel",
					description: "Vous pouvez aussi revoir ce didacticiel en cliquant ici.",
				},
			},
			// { element: ".footer", popover: { title: "Title", description: "Description" } },
		],
	});

	driverObj.drive();
}

function reopenDidacticiel() {
	openDidacticiel();
}

/// end of the driver.
