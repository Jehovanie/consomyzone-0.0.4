/*

import MapCMZ from './MapCMZ'

import { addRubriqueActivNavbar, removeRubriqueActivNavbar, calculeProgression,
	injectFilterProduitStation, createStartNoteHtml, injectFilterProduitResto,
	openDetailsContainer, injectBodyListMarkerRestoPastille,
	injectListMarkerRestoPastilleAlertNonActive, trierTableau
} "./map_cmz_fonction.js"

import { addDataTableOnList, removeListNavLeftRubriqueType,
	 injectSliderStation, injectSliderCustomise, resetSliderCustomise, injectSlider,
	 resetSliderNotation, activeDataTableOnList,
 } "./lib.js"

import { removeLoadingListFavory, } from "./favori_rubrique.js"

*/
class RubriqueCMZ extends MapCMZ {
	constructor(options = {}) {
		super();

		this.is_search_mode = false;

		if (options && options.hasOwnProperty("cles0") && options.hasOwnProperty("cles1")) {
			this.is_search_mode = true;
			this.search_options = {
				cles0: options.cles0,
				cles1: options.cles1,
			};
		}

		this.markers = null;
		this.markerClusterForCounterPerDep = null;

		this.zoom_max_for_count_per_dep = 8;

		this.geos = [];
		this.zoom_min = 8;
		this.zoom_max = 19;
		this.zoomDetails = this.zoom_max;

		this.allRubriques = [
			{
				name: "Restaurant",
				api_name: "restaurant",
				dico_name: [
					"restaurant",
					"resto",
					"Café",
					"Bistro",
					"Brasserie",
					"Tavern",
					"Bar",
					"Pub",
					"Diner",
					"Boulangerie",
					"Buvette",
					"Cantine",
					"Crêperie",
					"Trattoria",
					"Gastropub",
					"Pâtisserie",
					"Taverne",
					"Resto",
					"Table d'hôte",
					"Buffet",
					"Fast-food",
					"Food-truck",
					"Guinguette",
					"Rotisserie",
					"Kiosque",
					"Traiteur",
					"pizzeria",
				],
				icon: "assets/icon/NewIcons/mini_logo_resto_selected.png",
				isFirstResquest: true,
				poi_icon: {
					selected: "assets/icon/NewIcons/mini_logo_resto_selected.png",
					not_selected: "assets/icon/NewIcons/mini_logo_resto.png",
				},
				is_active: false,
				is_have_specific_filter: true,
				is_can_add_new_poi: false,
				filter: {
					is_filtered: false,
					departement: "tous",
					default: "tous",
					notation: {
						min: 0,
						max: 5,
						min_default: 0,
						max_default: 5,
					},
					specifique: {
						produit: {
							restaurant: { is_filtered: false, prix: 0 },
							brasserie: { is_filtered: false, prix: 0 },
							fast_food: { is_filtered: false, prix: 0 },
							pizzeria: { is_filtered: false, prix: 0 },
							boulangerie: { is_filtered: false, prix: 0 },
							bar: { is_filtered: false, prix: 0 },
							cafe: { is_filtered: false, prix: 0 },
							salon_the: { is_filtered: false, prix: 0 },
							cuisine_monde: { is_filtered: false, prix: 0 },
						},
						price_produit: {
							min: 0,
							max: 200,
							min_default: 0,
							max_default: 200,
						},
					},
				},
				getLegendIcon: () => {
					return this.getLegendIconResto();
				},
				is_have_favory: true,
				injecteListFavory: (injecteListFavory, favori_folder_id = 0) => {
					this.injecteListFavoryResto(injecteListFavory, favori_folder_id);
				},
				getOptionPastille: (item) => {
					return this.getOptionPastilleResto(item);
				},
				setSingleMarker: (item, options = {}) => {
					this.setSingleMarkerResto(item, options);
				},
				setListItemRubriqueActive: (item, options = {}) => {
					return this.setListItemRubriqueActiveResto(item, options);
				},
				setMiniFiche: (nom, departement, adresse, options = {}) => {
					return this.setMiniFicheResto(nom, departement, adresse, options);
				},
				fetchDetails: (id_rubrique) => {
					this.fetchDetailsResto(id_rubrique);
				},
				specifiqueFilter: () => {
					this.specifiqueFilterResto();
				},
				getStateSpecificFilter: () => {
					return this.getStateSpecificFilterResto();
				},
				resetSpecificFilter: () => {
					this.resetSpecificFilterResto();
				},
				checkIsMuchOnFilter: (item_rubrique) => {
					return this.checkIsMuchOnFilterResto(item_rubrique);
				},
				addNewPOI: () => {
					this.addNewPOIResto();
				},
			},
			{
				name: "Ferme",
				api_name: "ferme",
				dico_name: ["ferme"],
				icon: "assets/icon/NewIcons/mini_logo_ferme_selected.png",
				isFirstResquest: true,
				poi_icon: {
					selected: "assets/icon/NewIcons/mini_logo_ferme_selected.png",
					not_selected: "assets/icon/NewIcons/mini_logo_ferme.png",
				},
				is_active: false,
				is_have_specific_filter: false,
				is_can_add_new_poi: false,
				filter: {
					is_filtered: false,
					departement: "tous",
					default: "tous",
					notation: {
						min: 0,
						max: 5,
						min_default: 0,
						max_default: 5,
					},
				},
				getLegendIcon: () => {
					return this.getLegendIconFerme();
				},
				is_have_favory: false,
				injecteListFavory: (injecteListFavory, favori_folder_id = 0) => {
					console.log(injecteListFavory, favori_folder_id);
				},
				getOptionPastille: (item) => {
					return this.getOptionPastilleFerme(item);
				},
				setSingleMarker: (item, options = {}) => {
					this.setSingleMarkerFerme(item, options);
				},
				setListItemRubriqueActive: (item, options = {}) => {
					return this.setListItemRubriqueActiveFerme(item, options);
				},
				setMiniFiche: (nom, departement, adresse, options = {}) => {
					return this.setMiniFicheFerme(nom, departement, adresse, options);
				},
				fetchDetails: (id_rubrique) => {
					this.fetchDetailsFerme(id_rubrique);
				},
				specifiqueFilter: () => {
					this.specifiqueFilterFerme();
				},
				getStateSpecificFilter: () => {
					return this.getStateSpecificFilterFerme();
				},
				resetSpecificFilter: () => {
					this.resetSpecificFilterFerme();
				},
				checkIsMuchOnFilter: (item_rubrique) => {
					return this.checkIsMuchOnFilterFerme(item_rubrique);
				},
				addNewPOI: () => {
					this.addNewPOIFerme();
				},
			},
			{
				name: "Station",
				api_name: "station",
				dico_name: ["station service", "station"],
				icon: "assets/icon/NewIcons/mini_logo_station.png",
				isFirstResquest: true,
				poi_icon: {
					selected: "assets/icon/NewIcons/mini_logo_station_selected.png",
					not_selected: "assets/icon/NewIcons/mini_logo_station.png",
				},
				is_active: false,
				is_have_specific_filter: true,
				is_can_add_new_poi: false,
				filter: {
					is_filtered: false,
					departement: "tous",
					default: "tous",
					notation: {
						min: 0,
						max: 5,
						min_default: 0,
						max_default: 5,
					},
					specifique: {
						produit: {
							e85: { is_filtered: true, prix: 0 },
							gplc: { is_filtered: true, prix: 0 },
							sp95: { is_filtered: true, prix: 0 },
							sp95e10: { is_filtered: true, prix: 0 },
							sp98: { is_filtered: true, prix: 0 },
							gasoil: { is_filtered: true, prix: 0 },
						},
						price_produit: {
							min: 0,
							max: 3,
							min_default: 0,
							max_default: 3,
						},
					},
				},
				getLegendIcon: () => {
					return this.getLegendIconStation();
				},
				is_have_favory: false,
				injecteListFavory: (injecteListFavory, favori_folder_id = 0) => {
					console.log(injecteListFavory, favori_folder_id);
				},
				getOptionPastille: (item) => {
					return this.getOptionPastilleStation(item);
				},
				setSingleMarker: (item, options = {}) => {
					this.setSingleMarkerStation(item, options);
				},
				setListItemRubriqueActive: (item, options = {}) => {
					return this.setListItemRubriqueActiveStation(item, options);
				},
				setMiniFiche: (nom, departement, adresse, options = {}) => {
					return this.setMiniFicheStation(nom, departement, adresse, options);
				},
				fetchDetails: (id_rubrique) => {
					this.fetchDetailsStation(id_rubrique);
				},
				specifiqueFilter: () => {
					this.specifiqueFilterStation();
				},
				getStateSpecificFilter: () => {
					return this.getStateSpecificFilterStation();
				},
				resetSpecificFilter: () => {
					this.resetSpecificFilterStation();
				},
				checkIsMuchOnFilter: (item_rubrique) => {
					return this.checkIsMuchOnFilterStation(item_rubrique);
				},
				addNewPOI: () => {
					this.addNewPOIStation();
				},
			},
			{
				name: "Golf",
				api_name: "golf",
				dico_name: [
					"golf",
					"Terrain de golf",
					"Club de golf",
					"Parcours de golf",
					"Green",
					"Fairway",
					"Rough",
					"Bunker",
					"Putting green",
					"Driving range",
					"Pitch and putt",
					"Compact",
					"Links",
					"Mini-golf",
					"Mini golf",
					"Golf indoor",
					"Simulateur de golf",
					"Practice",
					"Pro shop",
					"Caddy",
					"Cart de golf",
					"Tournoi de golf",
					"Ryder Cup",
					"Open de golf",
					"Swing",
					"Approche",
					"Putt",
					"Handicap",
					"Balles de golf",
					"Clubs de golf",
					"Tee de départ",
					"Foursome",
					"Handicap de golf",
					"Cadet de golf",
				],
				icon: "assets/icon/NewIcons/mini_logo_golf_selected.png",
				isFirstResquest: true,
				poi_icon: {
					selected: "assets/icon/NewIcons/mini_logo_golf_selected.png",
					not_selected: "assets/icon/NewIcons/mini_logo_golf.png",
				},
				is_active: false,
				is_have_specific_filter: false,
				is_can_add_new_poi: false,
				filter: {
					is_filtered: false,
					departement: "tous",
					default: "tous",
					notation: {
						min: 0,
						max: 5,
						min_default: 0,
						max_default: 5,
					},
				},
				getLegendIcon: () => {
					return this.getLegendIconGolf();
				},
				is_have_favory: false,
				injecteListFavory: (injecteListFavory, favori_folder_id = 0) => {
					console.log(injecteListFavory, favori_folder_id);
				},
				getOptionPastille: (item) => {
					return this.getOptionPastilleGolf(item);
				},
				setSingleMarker: (item, options = {}) => {
					this.settingSingleMarkerGolf(item, options);
				},
				setListItemRubriqueActive: (item, options = {}) => {
					return this.setListItemRubriqueActiveGolf(item, options);
				},
				setMiniFiche: (nom, departement, adresse, options = {}) => {
					return this.setMiniFicheGolf(nom, departement, adresse, options);
				},
				fetchDetails: (id_rubrique) => {
					this.fetchDetailsGolf(id_rubrique);
				},
				specifiqueFilter: () => {
					this.specifiqueFilterGolf();
				},
				getStateSpecificFilter: () => {
					return this.getStateSpecificFilterGolf();
				},
				resetSpecificFilter: () => {
					this.resetSpecificFilterGolf();
				},
				checkIsMuchOnFilter: (item_rubrique) => {
					return this.checkIsMuchOnFilterGolf(item_rubrique);
				},
				addNewPOI: () => {
					this.addNewPOIGolf();
				},
			},
			{
				name: "Tabac",
				api_name: "tabac",
				dico_name: ["tabac"],
				icon: "assets/icon/NewIcons/mini_logo_tabac_selected.png",
				isFirstResquest: true,
				poi_icon: {
					selected: "assets/icon/NewIcons/mini_logo_tabac_selected.png",
					not_selected: "assets/icon/NewIcons/mini_logo_tabac.png",
				},
				is_active: false,
				is_have_specific_filter: false,
				is_can_add_new_poi: false,
				filter: {
					is_filtered: false,
					departement: "tous",
					default: "tous",
					notation: {
						min: 0,
						max: 5,
						min_default: 0,
						max_default: 5,
					},
				},
				getLegendIcon: () => {
					return this.getLegendIconTabac();
				},
				is_have_favory: false,
				injecteListFavory: (injecteListFavory, favori_folder_id = 0) => {
					console.log(injecteListFavory, favori_folder_id);
				},
				getOptionPastille: (item) => {
					return this.getOptionPastilleTabac(item);
				},
				setSingleMarker: (item, options = {}) => {
					this.setSingleMarkerTabac(item, options);
				},
				setListItemRubriqueActive: (item, options = {}) => {
					return this.setListItemRubriqueActiveTabac(item, options);
				},
				setMiniFiche: (nom, departement, adresse, options = {}) => {
					return this.setMiniFicheTabac(nom, departement, adresse, options);
				},
				fetchDetails: (id_rubrique) => {
					this.fetchDetailsTabac(id_rubrique);
				},
				specifiqueFilter: () => {
					this.specifiqueFilterTabac();
				},
				getStateSpecificFilter: () => {
					return this.getStateSpecificFilterTabac();
				},
				resetSpecificFilter: () => {
					this.resetSpecificFilterTabac();
				},
				checkIsMuchOnFilter: (item_rubrique) => {
					return this.checkIsMuchOnFilterTabac(item_rubrique);
				},
				addNewPOI: () => {
					this.addNewPOITabac();
				},
			},
			{
				name: "Marché",
				api_name: "marche",
				dico_name: ["marché", "marche"],
				icon: "assets/icon/NewIcons/mini_logo_marche_selected.png",
				isFirstResquest: true,
				poi_icon: {
					selected: "assets/icon/NewIcons/mini_logo_marche_selected.png",
					not_selected: "assets/icon/NewIcons/mini_logo_marche.png",
				},
				is_active: false,
				is_have_specific_filter: false,
				is_can_add_new_poi: true,
				filter: {
					is_filtered: false,
					departement: "tous",
					default: "tous",
					notation: {
						min: 0,
						max: 5,
						min_default: 0,
						max_default: 5,
					},
				},
				getLegendIcon: () => {
					return this.getLegendIconMarche();
				},
				is_have_favory: false,
				injecteListFavory: (injecteListFavory, favori_folder_id = 0) => {
					console.log(injecteListFavory, favori_folder_id);
				},
				getOptionPastille: (item) => {
					return this.getOptionPastilleMarche(item);
				},
				setSingleMarker: (item, options = {}) => {
					this.setSingleMarkerMarche(item, options);
				},
				setListItemRubriqueActive: (item, options = {}) => {
					return this.setListItemRubriqueActiveMarche(item, options);
				},
				setMiniFiche: (nom, departement, adresse, options = {}) => {
					return this.setMiniFicheMarche(nom, departement, adresse, options);
				},
				fetchDetails: (id_rubrique) => {
					this.fetchDetailsMarche(id_rubrique);
				},
				specifiqueFilter: () => {
					this.specifiqueFilterMarche();
				},
				getStateSpecificFilter: () => {
					return this.getStateSpecificFilterMarche();
				},
				resetSpecificFilter: () => {
					this.resetSpecificFilterMarche();
				},
				checkIsMuchOnFilter: (item_rubrique) => {
					return this.checkIsMuchOnFilterMarche(item_rubrique);
				},
				addNewPOI: () => {
					this.addNewPOIMarche();
				},
				makeMarkerDraggablePOI: (rubrique_id) => {
					this.makeMarkerDraggablePOIMarche(rubrique_id);
				},
			},
			/*
			{
				name: "Boulangerie",
				api_name: "boulangerie",
				icon: "assets/icon/NewIcons/restaurant.png",
				isFirstResquest: true,
				poi_icon: {
					selected: "assets/icon/NewIcons/icon_marche_selected.png",
					not_selected: "assets/icon/NewIcons/icon_marche.png",
				},
				is_active: false,
				is_have_specific_filter: false,
				filter: {
					is_filtered: false,
					departement: "tous",
					default: "tous",
					notation: {
						min: 0,
						max: 5,
						min_default: 0,
						max_default: 5,
					},
				},
				getOptionPastille: () => {
					return this.getOptionPastilleResto();
				},
				setSingleMarker: (item, options = {}) => {
					this.settingSingleMarker(item, options);
				},
				setListItemRubriqueActive: (item, options = {}) => {
					return this.setListItemRubriqueActiveResto(item, options);
				},
				setMiniFiche: (nom, departement, adresse, options = {}) => {
					return this.setMiniFicheResto(nom, departement, adresse, options);
				},
				fetchDetails: (id_rubrique) => {
					this.fetchDetailsMarche(id_rubrique);
				},
				specifiqueFilter: () => {
					this.specifiqueFilterFerme();
				},
				getStateSpecificFilter: () => {
					return this.getStateSpecificFilterFerme();
				},
				resetSpecificFilter: () => {
					this.resetSpecificFilterFerme();
				},
				checkIsMuchOnFilter: () => {
					return this.checkIsMuchOnFilterFerme();
				},
			},
			{
				name: "Extra Pizza",
				api_name: "extra_pizza",
				icon: "assets/icon/NewIcons/restaurant.png",
				isFirstResquest: true,
				poi_icon: {
					selected: "assets/icon/NewIcons/icon_marche_selected.png",
					not_selected: "assets/icon/NewIcons/icon_marche.png",
				},
				is_active: false,
				is_have_specific_filter: false,
				filter: {
					is_filtered: false,
					departement: "tous",
					default: "tous",
					notation: {
						min: 0,
						max: 5,
						min_default: 0,
						max_default: 5,
					},
				},
				getOptionPastille: () => {
					return this.getOptionPastilleResto();
				},
				setSingleMarker: (item, options = {}) => {
					this.settingSingleMarker(item, options);
				},
				setListItemRubriqueActive: (item, options = {}) => {
					return this.setListItemRubriqueActiveResto(item, options);
				},
				setMiniFiche: (nom, departement, adresse, options = {}) => {
					return this.setMiniFicheResto(nom, departement, adresse, options);
				},
				fetchDetails: (id_rubrique) => {
					this.fetchDetailsMarche(id_rubrique);
				},
				specifiqueFilter: () => {
					this.specifiqueFilterFerme();
				},
				getStateSpecificFilter: () => {
					return this.getStateSpecificFilterFerme();
				},
				resetSpecificFilter: () => {
					this.resetSpecificFilterFerme();
				},
				checkIsMuchOnFilter: () => {
					return this.checkIsMuchOnFilterFerme();
				},
			},
			{
				name: "KFC",
				api_name: "kfc",
				icon: "assets/icon/NewIcons/restaurant.png",
				isFirstResquest: true,
				poi_icon: {
					selected: "assets/icon/NewIcons/icon_marche_selected.png",
					not_selected: "assets/icon/NewIcons/icon_marche.png",
				},
				is_active: false,
				is_have_specific_filter: false,
				filter: {
					is_filtered: false,
					departement: "tous",
					default: "tous",
					notation: {
						min: 0,
						max: 5,
						min_default: 0,
						max_default: 5,
					},
				},
				getOptionPastille: () => {
					return this.getOptionPastilleResto();
				},
				setSingleMarker: (item, options = {}) => {
					this.settingSingleMarker(item, options);
				},
				setListItemRubriqueActive: (item, options = {}) => {
					return this.setListItemRubriqueActiveResto(item, options);
				},
				setMiniFiche: (nom, departement, adresse, options = {}) => {
					return this.setMiniFicheResto(nom, departement, adresse, options);
				},
				fetchDetails: (id_rubrique) => {
					this.fetchDetailsMarche(id_rubrique);
				},
				specifiqueFilter: () => {
					this.specifiqueFilterFerme();
				},
				getStateSpecificFilter: () => {
					return this.getStateSpecificFilterFerme();
				},
				resetSpecificFilter: () => {
					this.resetSpecificFilterFerme();
				},
				checkIsMuchOnFilter: () => {
					return this.checkIsMuchOnFilterFerme();
				},
			},
			{
				name: "Gastro",
				api_name: "gastro",
				icon: "assets/icon/NewIcons/restaurant.png",
				isFirstResquest: true,
				poi_icon: {
					selected: "assets/icon/NewIcons/icon_marche_selected.png",
					not_selected: "assets/icon/NewIcons/icon_marche.png",
				},
				is_active: false,
				is_have_specific_filter: false,
				filter: {
					is_filtered: false,
					departement: "tous",
					default: "tous",
					notation: {
						min: 0,
						max: 5,
						min_default: 0,
						max_default: 5,
					},
				},
				getOptionPastille: () => {
					return this.getOptionPastilleResto();
				},
				setSingleMarker: (item, options = {}) => {
					this.settingSingleMarker(item, options);
				},
				setListItemRubriqueActive: (item, options = {}) => {
					return this.setListItemRubriqueActiveResto(item, options);
				},
				setMiniFiche: (nom, departement, adresse, options = {}) => {
					return this.setMiniFicheResto(nom, departement, adresse, options);
				},
				fetchDetails: (id_rubrique) => {
					this.fetchDetailsMarche(id_rubrique);
				},
				specifiqueFilter: () => {
					this.specifiqueFilterFerme();
				},
				getStateSpecificFilter: () => {
					return this.getStateSpecificFilterFerme();
				},
				resetSpecificFilter: () => {
					this.resetSpecificFilterFerme();
				},
				checkIsMuchOnFilter: () => {
					return this.checkIsMuchOnFilterFerme();
				},
			},
			*/
		];

		////this variable is for setting default rubrique active,
		/// but this action is overridden when 'rubrique_active_history' value exist in
		/// the session storage.
		const rubrique_active_default = ["restaurant", "ferme", "station", "golf", "tabac", "marche"];

		this.allRubriques = this.allRubriques.map((item_allRubriques) => {
			if (rubrique_active_default.includes(item_allRubriques.api_name)) {
				item_allRubriques.is_active = true;
			}
			return item_allRubriques;
		});

		this.defaultData = {}; /// { 'ferme' : [ ], 'restaurant' : [ ] , ... } ///original data
		this.data = {}; /// { 'ferme' : [ ], 'restaurant' : [ ] , ... }        ///data filtered.

		// this is the base of filter data in map based on the user zooming.
		/// ratio is the number precisious for the float on latitude ( ex lat= 47.5125400012145  if ratio= 3 => lat = 47.512
		//// dataMax is the number maximun of the data to show after grouping the all data by lat with ratio.
		///// this must objectRatioAndDataMax is must be order by zoomMin DESC
		this.objectRatioAndDataMax = [
			{ zoomMin: 20, dataMax: 8, ratio: 4 },
			{ zoomMin: 19, dataMax: 8, ratio: 3 },
			{ zoomMin: 18, dataMax: 7, ratio: 3 },
			{ zoomMin: 17, dataMax: 7, ratio: 3 },
			{ zoomMin: 16, dataMax: 6, ratio: 3 },
			{ zoomMin: 15, dataMax: 6, ratio: 3 },
			{ zoomMin: 14, dataMax: 5, ratio: 3 },
			{ zoomMin: 13, dataMax: 5, ratio: 2 },
			{ zoomMin: 12, dataMax: 4, ratio: 2 },
			{ zoomMin: 11, dataMax: 4, ratio: 2 },
			{ zoomMin: 10, dataMax: 3, ratio: 2 },
			{ zoomMin: 9, dataMax: 3, ratio: 1 },
			{ zoomMin: 8, dataMax: 2, ratio: 1 },
			{ zoomMin: 7, dataMax: 2, ratio: 1 },
			{ zoomMin: 6, dataMax: 2, ratio: 1 },
			{ zoomMin: 1, dataMax: 2, ratio: 1 },
		];

		this.markers_display = [];

		this.marker_last_selected = null;

		this.list_departements = [];

		this.stateActionMoveMap = {
			start: true,
			end: true,
		};

		this.lastNiveauZoomAction = 0;

		this.rubriqueOptionType = {
			isPastille: false,
			is_pastille_vert: false,
			is_pastille_rouge: false,
			is_pastille_orange: false,
			is_pastille_blue: false,
		};

		this.validation_color = {
			admin_cmz: {
				color: "#85dc14",
				className: "admin_cmz",
				text: "Cette rubrique est vérifiée par l'administrateur.",
			},
			validator_cmz: {
				color: "#27affe",
				className: "validator_cmz",
				text: "Cette rubrique est vérifiée manuellement par nos validateurs.",
			},
			partisant_cmz: {
				color: "#3af5e2",
				className: "partisant_cmz",
				text: "Cette rubrique est modifiée par un partisan et en cours de validation.",
			},
			source_info: {
				color: "#ffa500",
				className: "source_info",
				text: "Cette rubrique est obtenue par notre source informatique.",
			},
		};
	}

	getNumberMarkerDefault() {
		return this.allRubriques.reduce((sum, item) => {
			if (item.is_active) {
				sum = sum + 1;
			}
			return sum;
		}, 0);
	}

	createMarkersCluster() {
		this.markers = L.markerClusterGroup({
			chunkedLoading: true,
			animate: true,
			animateAddingMarkers: true,
			chunkedLoading: true,
			spiderfyOnEveryZoom: true,
			disableClusteringAtZoom: true,
		});
	}

	/**
	 * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
	 *
	 * Goal: Create special markerClusterGroup for the count etablisement per dep.
	 *
	 * I call this on onInit function inside child
	 */
	createMarkersClusterForCountPerDep() {
		this.markerClusterForCounterPerDep = L.markerClusterGroup({
			chunkedLoading: true,
			chunkInterval: 500,
			chunkDelay: 100,
			maxClusterRadius: 80, //A cluster will cover at most this many pixels from its center
			clusterPane: L.Marker.prototype.options.pane,
			spiderfyOnMaxZoom: true,
			disableClusteringAtZoom: true,
		});
	}

	/**
	 * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
	 *
	 * @goal create MarkerClusterGroup form POI and for count marker per dep
	 * and fetch default data for the rubrique default active
	 * finaly add event on map like movestart, dragend, zoomend
	 *
	 */
	async onInitMarkerCluster() {
		////create new marker Cluster for POI etablisment
		this.createMarkersCluster();
		////create new marker Cluster special for count per dep.
		this.createMarkersClusterForCountPerDep();

		///fetch data for all rubrique active
		await this.addRubriqueActiveByDefault();

		// ///bind events on map ( movestart, dragend, zommend)
		// this.addEventOnMap();
	}

	getNumberPerDepDataSearch() {
		// const data = this.default_data.results[0];
		let results = [];
		for (let i = 0; i < 95; i++) {
			let data_object = {};
			this.allRubriques.forEach((item_rubrique) => {
				const data = this.defaultData.hasOwnProperty(item_rubrique.api_name)
					? this.defaultData[item_rubrique.api_name]["data"]
					: [];

				const count = data.reduce((c, item) => {
					if (parseInt(item.dep) === i + 1) {
						c = c + 1;
					}
					return c;
				}, 0);

				data_object[item_rubrique.api_name] = count;
			});

			results.push({
				departement: i + 1 < 10 ? `0${i + 1}` : `${i + 1}`,
				account_per_dep: Array.from(Object.keys(data_object)).reduce((s, i) => (s += data_object[i]), 0),
				details: {
					...data_object,
				},
			});
		}
		return results;
	}

	async addRubriqueActiveByDefault() {
		/// check history for the rubrique active. ------
		//// get last last rubrique active in history.
		const rubrique_active_history = getDataInSessionStorage("rubrique_active_history");

		if (rubrique_active_history) {
			const history = JSON.parse(rubrique_active_history);

			this.allRubriques = this.allRubriques.map((item) => {
				item.is_active = history[item.api_name]["is_active"];
				return item;
			});
		}

		/// end of the check history for the rubrique active.....

		//// special state for the search mode ...
		if (this.is_search_mode) {
			let is_have_rubrique_match = false;
			let rubrique_match_type = "";

			this.allRubriques.forEach((item_rubrique) => {
				let tab_temp = item_rubrique.dico_name.map((i) => i.toLowerCase());
				if (tab_temp.includes(this.search_options["cles0"].toLowerCase())) {
					is_have_rubrique_match = true;
					rubrique_match_type = item_rubrique.api_name;
				}
			});

			if (is_have_rubrique_match) {
				this.allRubriques = this.allRubriques.map((item) => {
					item.is_active = item.api_name === rubrique_match_type;
					return item;
				});
			}
		}

		//// save current state rubrique active...
		this.updateRubriqueActiveHistory();

		///add rubrique active on the nav bar (in map_cmz_fonction.js)
		this.allRubriques.forEach((item) => {
			if (item.is_active) {
				addRubriqueActivNavbar(item);
			}
		});

		////fetch (call api) data foreach rubrique active by default.
		await this.fetchDataIterator();
	}

	/**
	 * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
	 *
	 * @goal Save the history of the rubrique active. (i use it for searching also)
	 */
	updateRubriqueActiveHistory() {
		const new_rubrique_active_history = {};
		this.allRubriques.forEach((item) => {
			new_rubrique_active_history[item.api_name] = { is_active: item.is_active };
		});

		setDataInSessionStorage("rubrique_active_history", JSON.stringify(new_rubrique_active_history));
	}

	async fetchDataIterator() {
		///filter all rubrique active ...
		const default_rubrique_active = this.allRubriques.filter((item) => item.is_active === true);

		/// make it to iterator...
		const rubrique_iterator = default_rubrique_active[Symbol.iterator]();

		//// fetch data rubrique....
		await this.fetchOriginDataItem(rubrique_iterator);
	}

	async fetchOriginDataItem(rubrique_iterator) {
		const data_rubrique = rubrique_iterator.next().value;

		if (data_rubrique !== undefined) {
			const api_name = data_rubrique.api_name;
			const isFirstResquest = data_rubrique.isFirstResquest;

			let response = null;
			if (!this.is_search_mode) {
				response = await this.fetchDataRubrique(api_name.toLowerCase(), {
					isFirstResquest,
					data_max: 50,
				});
			} else {
				response = await this.fetchDataRubriqueOnSearch(api_name.toLowerCase(), this.search_options);
			}

			const data_pastille = response.hasOwnProperty("pastille") ? response.pastille : [];
			const data_options = response.hasOwnProperty("options") ? response.options : {};

			this.defaultData[api_name] = {
				...this.defaultData[api_name],
				data: response.data,
				pastille: [
					...data_pastille,
					// ...response.pastille?.filter((item) => {
					// 	const object_api_name = this.defaultData[api_name];
					// 	if (object_api_name.hasOwnProperty("pastille")) {
					// 		const data_pastille = this.defaultData[api_name]["pastille"];
					// 		return !data_pastille.some((item_data_pastille) => {
					// 			if (
					// 				item_data_pastille.id_resto === item.id_resto &&
					// 				item_data_pastille.tableName === item_data_pastille.tableName
					// 			) {
					// 				return false;
					// 			}
					// 			return true;
					// 		});
					// 	}
					// 	return true;
					// }),
					// ...this.defaultData[api_name]["pastille"],
				],
				options: { ...data_options },
			};

			this.updateMapAddRubrique(api_name);

			await this.fetchOriginDataItem(rubrique_iterator);
		} else {
			this.bindActionToShowNavLeft();
			this.countMarkerInCart();

			return false;
		}
	}

	/**
	 * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
	 *
	 * Goal: from object geosjson type get the center lat lng using turl bibliothec
	 * Use in: MapModule function addCulsterNumberAtablismentPerDep
	 *
	 * @param geosjson object
	 *
	 * @return array [ lat, lng];
	 */
	getCentroidCoordinatesFromGeos(geosjson) {
		let centroid = null;
		let centroidCoordinates = null;

		if (geosjson.geometry.type === "Polygon") {
			// Calculate the centroid using turf
			centroid = turf.centroid(turf.polygon([geosjson.geometry.coordinates[0]]));
			// Extract the coordinates of the centroid
			centroidCoordinates = centroid.geometry.coordinates;
		} else if (geosjson.geometry.type === "MultiPolygon") {
			// Calculate the centroid using turf
			centroid = turf.centroid(turf.multiPolygon(geosjson.geometry.coordinates));
			// Extract the coordinates of the centroid
			centroidCoordinates = centroid.geometry.coordinates;
		}

		return centroidCoordinates;
	}

	/**
	 * @author Jehovanie RAMANDRIJOEL <jehoavaneirama@gmail.com>
	 *
	 * Check if the item related with this ID is in the marker or in the data
	 *
	 * @param {*} idToCheck
	 *
	 * @returns true if exists, false if not
	 */
	checkIsExist(idToCheck, rubrique_type = "restaurant") {
		const data = this.defaultData[rubrique_type]["data"];

		let isOnData = data.some(({ id }) => parseInt(id) === parseInt(idToCheck));

		let isAlreadyExist = false;
		if (isOnData) {
			this.markers.eachLayer((marker) => {
				if (parseInt(marker.options.id) === parseInt(idToCheck)) {
					isAlreadyExist = true;
				}
			});

			if (!isAlreadyExist) {
				const rubrique_type_object = this.allRubriques.find((item) => item.api_name === rubrique_type);

				const item = data.find(({ id }) => parseInt(id) === parseInt(idToCheck));
				const options = rubrique_type_object.getOptionPastille(item);

				rubrique_type_object.setSingleMarker(item, options);
			}
		}

		return isOnData;
	}

	/**
	 *
	 * @author Jehovanie RAMANDRIJOEL <jehovanierama@gmail.com>
	 *
	 * @param {*} idToCheck
	 *
	 * @returns
	 */
	clickOnMarker(id, rubrique_type = "restaurant") {
		this.markers.eachLayer((marker) => {
			if (parseInt(marker.options.id) === parseInt(id) && marker.options.type === rubrique_type) {
				marker.fireEvent("click");
			}
		});
	}

	/**
	 * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
	 * This remove the special markersCulsterGroup when state zoom is get in.
	 */
	addEventMapOnZoomend() {
		// Listen for the zoomend event and remove markers when zooming
		this.map.on("zoomend", () => {
			this.toggleCulsterCountPerDepAndCulsterMarker();
		});
	}

	toggleCulsterCountPerDepAndCulsterMarker() {
		var currentZoom = this.map.getZoom(); /// current zoom level
		if (currentZoom >= this.zoom_max_for_count_per_dep) {
			if (!this.map.hasLayer(this.markers)) {
				this.map.addLayer(this.markers);
			}
			if (this.map.hasLayer(this.markerClusterForCounterPerDep)) {
				this.map.removeLayer(this.markerClusterForCounterPerDep);
			}
		} else {
			if (this.map.hasLayer(this.markers)) {
				this.map.removeLayer(this.markers);
			}

			if (!this.map.hasLayer(this.markerClusterForCounterPerDep)) {
				this.map.addLayer(this.markerClusterForCounterPerDep);
			}
		}
	}

	addEventOnMap() {
		///move start
		this.addEventOnMapMoveStart();

		//// drag end
		this.addEventOnMapDragend();

		/// zoom end
		this.addEventOnMapZoomend();
	}

	addEventOnMapMoveStart() {
		this.map.on("movestart", (e) => {
			this.map.off("movestart");

			// const fa_solid_icon_nav_left = document.querySelector(".fa_solid_icon_nav_left_jheo_js");
			// if (fa_solid_icon_nav_left.getAttribute("data-type") === "show") {
			// 	fa_solid_icon_nav_left.click();
			// }

			this.handleEventMoveStartForMemoryCenter(e);
		});
	}

	addEventOnMapDragend() {
		this.map.on("dragend ", (e) => {
			this.map.off("dragend");

			this.handleEventMoveendForMemoryCenter(e);

			const x = this.getMax(this.map.getBounds().getWest(), this.map.getBounds().getEast());
			const y = this.getMax(this.map.getBounds().getNorth(), this.map.getBounds().getSouth());

			const new_size = { minx: x.min, miny: y.min, maxx: x.max, maxy: y.max };

			this.updateMarkersDisplayForDragend(new_size);

			if (this.is_search_mode === false) {
				this.addPeripheriqueMarker();
			}
		});
	}

	addEventOnMapZoomend() {
		this.map.on("zoomend", (e) => {
			///don't appear this event.
			this.map.off("zoomend");

			//// synchronized geoJSONLayer: remove and recreate
			this.geoJSONLayer.clearLayers();
			this.addGeoJsonToMap();

			this.handleEventMoveendForMemoryCenter(e);

			this.toggleCulsterCountPerDepAndCulsterMarker();

			const x = this.getMax(this.map.getBounds().getWest(), this.map.getBounds().getEast());
			const y = this.getMax(this.map.getBounds().getNorth(), this.map.getBounds().getSouth());

			const new_size = { minx: x.min, miny: y.min, maxx: x.max, maxy: y.max };

			this.updateMarkersDisplayForZoomend(new_size);

			if (this.is_search_mode === false) {
				this.addPeripheriqueMarker();
			}
		});
	}

	addPeripheriqueMarker() {
		const default_rubrique_active = this.allRubriques.filter((item) => item.is_active === true);

		const rubrique_iterator = default_rubrique_active[Symbol.iterator]();

		this.fetchDataOnPeripherique(rubrique_iterator);
	}

	async fetchDataOnPeripherique(rubrique_iterator) {
		const data_rubrique = rubrique_iterator.next().value;

		if (data_rubrique !== undefined) {
			try {
				const api_name = data_rubrique.api_name;

				const default_rubrique_active = this.allRubriques.filter((item) => item.is_active === true);
				// const data_max_fetching = Math.ceil((this.allRubriques.length * 10) / default_rubrique_active.length);
				let data_max_fetching = Math.ceil((5 * 10) / default_rubrique_active.length);
				if (data_rubrique.filter.is_filtered === true) {
					data_max_fetching += 50;
				}

				const response = await this.fetchDataRubrique(api_name.toLowerCase(), { data_max: data_max_fetching });

				if (response.data.length > 0) {
					//// updata default data
					this.updateDefaultData(response, api_name);
					//// end of updata data---------

					///add data peripherique ------
					this.addMarkerPeripherique(response.data, api_name);
					//// end action add data peripherique---
				}

				this.fetchDataOnPeripherique(rubrique_iterator);
			} catch (error) {
				console.log(error);
			}
		} else {
			this.addEventOnMap();

			this.stateActionMoveMap = {
				end: true,
				...this.stateActionMoveMap,
			};
			return false;
		}
	}

	updateDefaultData(dataObject, rubrique_type) {
		const data = dataObject["data"];

		if (!this.defaultData.hasOwnProperty(rubrique_type)) {
			this.defaultData[rubrique_type] = {
				data: [],
				pastille: [],
			};
		}

		const rubrique_object = this.defaultData[rubrique_type];

		////save all data
		const new_data_rubrique = data.filter(
			(item) => !this.defaultData[rubrique_type].data.some((jtem) => parseInt(jtem.id) === parseInt(item.id))
		);

		//// show data much only requirement.
		const rubrique_type_object = this.allRubriques.find(
			(item) => item.is_active === true && item.api_name === rubrique_type
		);

		const new_data_rubrique_show = new_data_rubrique.filter((ktem) =>
			rubrique_type_object.checkIsMuchOnFilter(ktem)
		);

		this.addDataToTableListLeft(new_data_rubrique_show, rubrique_type);
		//// end of add list left------------------------

		this.defaultData[rubrique_type]["data"] = [...new_data_rubrique, ...this.defaultData[rubrique_type]["data"]];

		///data pastille
		const data_pastille = dataObject.hasOwnProperty("pastille") ? dataObject.pastille : [];

		if (
			!this.defaultData[rubrique_type].hasOwnProperty("pastille") ||
			this.defaultData[rubrique_type]["pastille"] === undefined
		) {
			this.defaultData[rubrique_type]["pastille"] = [];
		}

		this.defaultData[rubrique_type]["pastille"] = mergeArraysUnique(
			this.defaultData[rubrique_type]["pastille"],
			data_pastille,
			"id"
		);

		if (dataObject.hasOwnProperty("options")) {
			const dataObject_options = dataObject.options;

			if (!rubrique_object.hasOwnProperty("options")) {
				this.defaultData[rubrique_type]["options"] = dataObject["options"];
			} else {
				const ro_options = rubrique_object.options;

				if (dataObject_options.hasOwnProperty("validation")) {
					const dataObject_options_validation = dataObject_options.validation;

					if (!ro_options.hasOwnProperty("validation")) {
						this.defaultData[rubrique_type]["options"]["validation"] = dataObject_options_validation;
					} else {
						this.defaultData[rubrique_type]["options"]["validation"] = {
							...this.defaultData[rubrique_type]["options"]["validation"],
							admin_cmz: [
								...dataObject_options_validation["admin_cmz"].filter(
									(item) =>
										!this.defaultData[rubrique_type]["options"]["validation"]["admin_cmz"].some(
											(jtem) => parseInt(item.rubriqueId) === parseInt(jtem.rubriqueId)
										)
								),
								...this.defaultData[rubrique_type]["options"]["validation"]["admin_cmz"],
							],
							partisant_cmz: [
								...dataObject_options_validation["partisant_cmz"].filter(
									(item) =>
										!this.defaultData[rubrique_type]["options"]["validation"]["partisant_cmz"].some(
											(jtem) => parseInt(item.rubriqueId) === parseInt(jtem.rubriqueId)
										)
								),
								...this.defaultData[rubrique_type]["options"]["validation"]["partisant_cmz"],
							],
							source_info: [
								...dataObject_options_validation["source_info"].filter(
									(item) =>
										!this.defaultData[rubrique_type]["options"]["validation"]["source_info"].some(
											(jtem) => parseInt(item.rubriqueId) === parseInt(jtem.rubriqueId)
										)
								),
								...this.defaultData[rubrique_type]["options"]["validation"]["source_info"],
							],
							validator_cmz: [
								...dataObject_options_validation["validator_cmz"].filter(
									(item) =>
										!this.defaultData[rubrique_type]["options"]["validation"]["validator_cmz"].some(
											(jtem) => parseInt(item.rubriqueId) === parseInt(jtem.rubriqueId)
										)
								),
								...this.defaultData[rubrique_type]["options"]["validation"]["validator_cmz"],
							],
						};
					}
				}
			}
		}

		this.addDataToTableListLeft(new_data_rubrique_show, rubrique_type);
		//// end of add list left------------------------
	}

	addMarkerPeripherique(data, rubrique_type) {
		const rubrique_type_object = this.allRubriques.find(
			(item) => item.is_active === true && item.api_name === rubrique_type
		);

		if (!rubrique_type_object) {
			return false;
		}

		const zoom = this.map._zoom;
		const current_object_dataMax = this.objectRatioAndDataMax.find((item) => zoom >= parseInt(item.zoomMin));
		const { dataMax, ratio } = current_object_dataMax;

		const default_rubrique_active = this.allRubriques.filter((item) => item.is_active === true);

		let count_temp = 0;
		data.forEach((item) => {
			const key_lat = parseFloat(parseFloat(item.lat).toFixed(ratio));

			//// polymorphisme check the filter
			if (rubrique_type_object.checkIsMuchOnFilter(item)) {
				const is_in_marker_display = this.markers_display.some((item_markes_display) => {
					return item_markes_display.lat.toString() === key_lat.toString();
				});

				if (is_in_marker_display) {
					let is_already_in_markers = this.markers_display.some((item_marker_display) => {
						if (item_marker_display.lat.toString() === key_lat.toString()) {
							return item_marker_display.data.some(
								(item_marker_display_data) =>
									item_marker_display_data.id === item.id &&
									item_marker_display_data.rubrique_type === rubrique_type
							);
						}
						return false;
					});

					if (!is_already_in_markers) {
						count_temp++;

						if (this.map._zoom <= 15) {
							const marker_display_object = this.markers_display.find((item_markes_display) => {
								return item_markes_display.lat.toString() === key_lat.toString();
							});

							if (
								marker_display_object &&
								marker_display_object.data.length >= dataMax * default_rubrique_active.length
							) {
								const marker_display_object_data = marker_display_object.data;

								const index_radom = Math.floor(Math.random() * marker_display_object_data.length);
								const item_radom = marker_display_object_data[index_radom];

								const marker_to_remove = marker_display_object.markers.find(
									(item_marker_display_objet) => {
										return (
											parseInt(item_marker_display_objet.options.id) ===
												parseInt(item_radom.id) &&
											item_marker_display_objet.options.type === item_radom.rubrique_type
										);
									}
								);

								if (marker_to_remove) {
									this.markers.removeLayer(marker_to_remove);
								}

								this.markers_display = this.markers_display.map((item_markes_display) => {
									if (item_markes_display.lat.toString() === key_lat.toString()) {
										item_markes_display = {
											...item_markes_display,
											data: item_markes_display.data.filter((item_md_data) => {
												if (
													item_md_data.id === item_radom.id &&
													item_md_data.rubrique_type === item_radom.rubrique_type
												) {
													return false;
												}
												return true;
											}),
											markers: item_markes_display.markers.filter((item_md_markers) => {
												if (
													parseInt(item_md_markers.options.id) === parseInt(item_radom.id) &&
													item_md_markers.options.type === item_radom.rubrique_type
												) {
													return false;
												}
												return true;
											}),
										};
									}
									return item_markes_display;
								});
							}
						}

						rubrique_type_object.setSingleMarker(item, {});

						const item_lat_with_ratio = parseFloat(parseFloat(item.lat).toFixed(ratio)).toString();

						this.markers_display = this.markers_display.map((md_item) => {
							if (md_item.lat.toString() === item_lat_with_ratio) {
								md_item["data"] = [{ ...item, rubrique_type: rubrique_type }, ...md_item["data"]];
							}
							return md_item;
						});
					}
				}
			}
		});
	}

	addDataToTableListLeft(new_data_rubrique, rubrique_type) {
		const rubrique_type_object = this.allRubriques.find((item) => item.api_name === rubrique_type);
		let { name: name_rubrique } = rubrique_type_object;

		new_data_rubrique = new_data_rubrique.map((item) => {
			return { ...item, name_rubrique, rubrique_type };
		});

		let body_table_list_rubrique_active = [];
		new_data_rubrique.forEach((item_data) => {
			body_table_list_rubrique_active.push(`
				<tr class="item_list_rubrique_nav_left_jheo_js" style="border: 1px solid transparent;">
					<td>${this.createItemRubriqueActive(item_data)}</td>
				</tr>
			`);
		});

		addDataTableOnList(body_table_list_rubrique_active);
	}

	/**
	 * @author Jehovanie RAMANDIRJOEL <jehovanieramd@gmail.com>
	 *
	 * Goal: Calculate and show the number of the marker in the map.
	 */
	countMarkerInCart() {
		let countMarkerst = 0;
		this.markers.eachLayer((marker) => {
			countMarkerst++;
		});
		console.log("Total marker afficher: " + countMarkerst);
	}

	/**
	 * @author Jehovanie RAMANDRIJOEL
	 * où: this.addEventOnMap
	 *     alternative for 'this.updateMarkersDisplay' but special for dragend event.
	 * je veux: mise a jour les données sur la carte,
	 * @param {} newSize  { minx, maxx, miny, maxy }
	 *
	 * - remove markers outside the box
	 * - Add some markers ( via latitude, ratio, dataMax )
	 * -
	 */
	updateMarkersDisplayForDragend(newSize) {
		// ///REMOVE THE OUTSIDE THE BOX
		this.removeMarkerOutSideTheBox(newSize);

		///// mila fenoina....
		const zoom = this.map._zoom;
		const current_object_dataMax = this.objectRatioAndDataMax.find((item) => zoom >= parseInt(item.zoomMin));
		const { dataMax, ratio } = current_object_dataMax;

		const y = this.getMax(this.map.getBounds().getNorth(), this.map.getBounds().getSouth()); ///lng
		let markers_display = this.generateTableDataFiltered(y.min, y.max, ratio); /// [ { lat: ( with ratio ), data: [] } ]

		markers_display = markers_display.map((item_markers_display) => {
			const lat = item_markers_display.lat;
			const origin_key_lat = this.markers_display.find((jtem) => jtem.lat === lat);
			if (origin_key_lat !== undefined) {
				return origin_key_lat;
			}

			return item_markers_display;
		});

		this.markers_display = [...markers_display];

		this.completeMarkerDisplay(newSize, dataMax, ratio);

		////count marker in map
		this.countMarkerInCart();

		this.addEventOnMapDragend();
	}

	completeMarkerDisplay(newSize, dataMax, ratio) {
		const { minx, maxx, miny, maxy } = newSize;

		////rubrique active and length...
		const rubrique_active = this.allRubriques.filter((item) => item.is_active === true);
		const rubrique_active_length = rubrique_active.length;

		const dataMax_with_on_rubrique_active = dataMax * rubrique_active_length;

		const marker_display_copie = [...this.markers_display];

		marker_display_copie.forEach((item_marker_display_copie) => {
			if (
				item_marker_display_copie.data.length < dataMax_with_on_rubrique_active &&
				item_marker_display_copie.markers.length < dataMax_with_on_rubrique_active
			) {
				const item_marker_display_copie_lat = item_marker_display_copie.lat;

				rubrique_active.forEach((item_rubrique_active) => {
					const { api_name, filter } = item_rubrique_active;

					const item_marker_display_original = this.markers_display.find(
						(item_marker_display) => item_marker_display.lat === item_marker_display_copie_lat
					);

					//// count marker already display related by the type.
					const item_rubrique_count = item_marker_display_original.data.reduce((sum, item) => {
						if (item.rubrique_type === api_name) {
							return sum + 1;
						}
						return sum;
					}, 0);

					if (item_rubrique_count < dataMax) {
						const object_rubrique_active = this.defaultData[api_name];
						const data_rubrique_active = object_rubrique_active.data;

						data_rubrique_active.forEach((item_data_rubrique_active) => {
							const is_not_in_data = !item_marker_display_original.data.some(
								(item) =>
									parseInt(item.id) === parseInt(item_data_rubrique_active.id) &&
									item.rubrique_type === api_name
							);

							if (is_not_in_data) {
								//// polymorphisme check the filter
								if (item_rubrique_active.checkIsMuchOnFilter(item_data_rubrique_active)) {
									const lat_item = parseFloat(item_data_rubrique_active.lat).toFixed(ratio);

									if (lat_item.toString() === item_marker_display_copie.lat.toString()) {
										const isInDisplay =
											parseFloat(item_data_rubrique_active.lat) > parseFloat(miny) &&
											parseFloat(item_data_rubrique_active.lat) < parseFloat(maxy) &&
											parseFloat(item_data_rubrique_active.long) > parseFloat(minx) &&
											parseFloat(item_data_rubrique_active.long) < parseFloat(maxx);

										if (isInDisplay) {
											item_rubrique_active.setSingleMarker(item_data_rubrique_active);

											this.markers_display = this.markers_display.map(
												(item_marker_display_edit) => {
													if (
														item_marker_display_edit.lat === item_marker_display_copie_lat
													) {
														item_marker_display_edit["data"] = [
															{ ...item_data_rubrique_active, rubrique_type: api_name },
															...item_marker_display_edit["data"],
														];
													}
													return item_marker_display_edit;
												}
											);
										}
									}
								}
							}
						});
					}
				});
			}
		});
	}

	updateMarkersDisplayForZoomend(newSize) {
		const { minx, maxx, miny, maxy } = newSize;

		const zoom = this.map._zoom;
		const current_object_dataMax = this.objectRatioAndDataMax.find((item) => zoom >= parseInt(item.zoomMin));
		const { dataMax, ratio } = current_object_dataMax;

		let isUpdate = this.markers_display.length > 0 && dataMax !== this.markers_display[0]["dataMax"];

		const y = this.getMax(this.map.getBounds().getNorth(), this.map.getBounds().getSouth()); ///lng

		if (this.lastNiveauZoomAction < this.map._zoom) {
			// ///REMOVE THE OUTSIDE THE BOX
			this.removeMarkerOutSideTheBox(newSize);

			if (isUpdate) {
				let markers_display = this.generateTableDataFiltered(y.min, y.max, ratio); /// [ { lat: ( with ratio ), data: [] } ]

				///check if this rubrique_type is active...
				let rubrique_active = this.allRubriques.filter((item) => item.is_active === true);

				for (const key_rubrique_type in this.defaultData) {
					///check if this rubrique_type is active...
					let rubrique_type_active_object = rubrique_active.find(
						(item) => item.api_name === key_rubrique_type
					);

					if (rubrique_type_active_object != undefined) {
						const rubrique_type = this.defaultData[key_rubrique_type];

						rubrique_type.data.forEach((item_rubrique) => {
							let lat_item_rubrique = parseFloat(parseFloat(item_rubrique.lat).toFixed(ratio));

							const isInDisplay =
								item_rubrique.lat > parseFloat(miny) &&
								item_rubrique.lat < parseFloat(maxy) &&
								item_rubrique.long > parseFloat(minx) &&
								item_rubrique.long < parseFloat(maxx);

							if (isInDisplay) {
								//// polymorphisme check the filter
								if (rubrique_type_active_object.checkIsMuchOnFilter(item_rubrique)) {
									markers_display = markers_display.map((item_marker_display) => {
										if (item_marker_display.lat.toString() === lat_item_rubrique.toString()) {
											let count_data_per_rubrique = item_marker_display.data.reduce(
												(sum, item) => {
													if (item.rubrique_type === rubrique_type) {
														sum = sum + 1;
													}
													return sum;
												},
												0
											);

											if (
												item_marker_display.data.length < dataMax * rubrique_active.length &&
												count_data_per_rubrique < dataMax
											) {
												item_marker_display.data.push({
													...item_rubrique,
													rubrique_type: key_rubrique_type,
												});
											}
										}

										return item_marker_display;
									});
								}
							}
						});
					}
				}

				/// add marker inside the box
				markers_display.forEach((item_markers_display) => {
					const item_markers_display_data = item_markers_display.data;
					const item_markers_display_lat = item_markers_display.lat;

					if (item_markers_display_data.length > 0) {
						item_markers_display_data.forEach((jtem_marker_display_data) => {
							const { rubrique_type } = jtem_marker_display_data;

							const rubrique_type_object = this.allRubriques.find(
								(item) => item.api_name === rubrique_type
							);

							let is_already_on_map = false;
							let marker_already_on_map = null;

							this.markers.eachLayer((marker) => {
								if (
									parseInt(marker.options.id) === jtem_marker_display_data.id &&
									marker.options.type === jtem_marker_display_data.rubrique_type
								) {
									is_already_on_map = true;
									marker_already_on_map = marker;
								}
							});

							if (!is_already_on_map) {
								rubrique_type_object.setSingleMarker(jtem_marker_display_data);
							} else {
								markers_display = markers_display.map((jtem_marker_display) => {
									const jtem_marker_display_lat = parseFloat(jtem_marker_display.lat).toFixed(ratio);
									if (jtem_marker_display_lat.toString() === item_markers_display_lat) {
										jtem_marker_display.markers.push(marker_already_on_map);
									}
									return jtem_marker_display;
								});
							}
						});
					}
				});

				this.markers_display = markers_display;
			} else {
				let markers_display = this.generateTableDataFiltered(y.min, y.max, ratio); /// [ { lat: ( with ratio ), data: [] } ]

				markers_display = markers_display.map((item_markers_display) => {
					const lat = item_markers_display.lat;
					const origin_key_lat = this.markers_display.find((jtem) => jtem.lat === lat);
					if (origin_key_lat !== undefined) {
						return origin_key_lat;
					}

					return item_markers_display;
				});

				this.markers_display = [...markers_display];

				this.completeMarkerDisplay(newSize, dataMax, ratio);
			}
			//// in
		} else {
			//// out
			if (isUpdate) {
				let markers_display = this.generateTableDataFiltered(y.min, y.max, ratio); /// [ { lat: ( with ratio ), data: [] } ]

				///check if this rubrique_type is active...
				let rubrique_active = this.allRubriques.filter((item) => item.is_active === true);

				for (const key_rubrique_type in this.defaultData) {
					///check if this rubrique_type is active...
					let is_rubrique_type_active = rubrique_active.some((item) => item.api_name === key_rubrique_type);

					if (is_rubrique_type_active) {
						let rubrique_type_active_object = rubrique_active.find(
							(item) => item.api_name === key_rubrique_type
						);

						const rubrique_type = this.defaultData[key_rubrique_type];

						rubrique_type.data.forEach((item_rubrique) => {
							let lat_item_rubrique = parseFloat(parseFloat(item_rubrique.lat).toFixed(ratio));

							const isInDisplay =
								item_rubrique.lat > parseFloat(miny) &&
								item_rubrique.lat < parseFloat(maxy) &&
								item_rubrique.long > parseFloat(minx) &&
								item_rubrique.long < parseFloat(maxx);

							if (isInDisplay) {
								//// polymorphisme check the filter
								if (rubrique_type_active_object.checkIsMuchOnFilter(item_rubrique)) {
									markers_display = markers_display.map((item_marker_display) => {
										if (item_marker_display.lat.toString() === lat_item_rubrique.toString()) {
											let count_data_per_rubrique = item_marker_display.data.reduce(
												(sum, item) => {
													if (item.rubrique_type === rubrique_type) {
														sum = sum + 1;
													}
													return sum;
												},
												0
											);

											if (
												item_marker_display.data.length < dataMax * rubrique_active.length &&
												count_data_per_rubrique < dataMax
											) {
												item_marker_display.data.push({
													...item_rubrique,
													rubrique_type: key_rubrique_type,
												});
											}
										}

										return item_marker_display;
									});
								}
							}
						});
					}
				}

				let marker_remove_inside_the_box = 0;

				/// remove marker in side the box
				this.markers.eachLayer((marker) => {
					const marker_id = parseInt(marker.options.id);
					const marker_type = marker.options.type;

					const latLng = marker.getLatLng();
					const key_lat = parseFloat(parseFloat(latLng.lat).toFixed(ratio)).toString();

					const is_key_lat_exist = markers_display.some((ktem_markers_display) => {
						return ktem_markers_display.lat === key_lat;
					});

					if (is_key_lat_exist) {
						const key_lat_object_data = markers_display.find((ktem_markers_display) => {
							return ktem_markers_display.lat === key_lat;
						});
						const is_marker_data_exist = key_lat_object_data.data.some((item_key_lat_object_data) => {
							return (
								item_key_lat_object_data.id === marker_id &&
								item_key_lat_object_data.rubrique_type === marker_type
							);
						});

						if (!is_marker_data_exist) {
							this.markers.removeLayer(marker);
							marker_remove_inside_the_box++;
						}
					} else {
						this.markers.removeLayer(marker);
						marker_remove_inside_the_box++;
					}
				});

				/// add marker inside the box
				markers_display.forEach((item_markers_display) => {
					const item_markers_display_data = item_markers_display.data;
					const item_markers_display_lat = item_markers_display.lat;

					if (item_markers_display_data.length > 0) {
						item_markers_display_data.forEach((jtem_marker_display_data) => {
							const { rubrique_type } = jtem_marker_display_data;

							const rubrique_type_object = this.allRubriques.find(
								(item) => item.api_name === rubrique_type
							);

							let is_already_on_map = false;
							let marker_already_on_map = null;

							this.markers.eachLayer((marker) => {
								if (
									parseInt(marker.options.id) === jtem_marker_display_data.id &&
									marker.options.type === jtem_marker_display_data.rubrique_type
								) {
									is_already_on_map = true;
									marker_already_on_map = marker;
								}
							});

							if (!is_already_on_map) {
								rubrique_type_object.setSingleMarker(jtem_marker_display_data);
							} else {
								markers_display = markers_display.map((jtem_marker_display) => {
									const jtem_marker_display_lat = parseFloat(jtem_marker_display.lat).toFixed(ratio);
									if (jtem_marker_display_lat.toString() === item_markers_display_lat) {
										jtem_marker_display.markers.push(marker_already_on_map);
									}
									return jtem_marker_display;
								});
							}
						});
					}
				});

				this.markers_display = markers_display;
			} else {
				let markers_display = this.generateTableDataFiltered(y.min, y.max, ratio); /// [ { lat: ( with ratio ), data: [] } ]

				markers_display = markers_display.map((item_markers_display) => {
					const lat = item_markers_display.lat;
					const origin_key_lat = this.markers_display.find((jtem) => jtem.lat === lat);
					if (origin_key_lat !== undefined) {
						return origin_key_lat;
					}

					return item_markers_display;
				});

				this.markers_display = [...markers_display];

				this.completeMarkerDisplay(newSize, dataMax, ratio);
			}
		}

		//// update this.lastNiveauZoomAction
		this.lastNiveauZoomAction = this.map._zoom;

		//// Update icon size while zoom in or zoom out
		this.synchronizeAllIconSize();

		////count marker in map
		this.countMarkerInCart();

		// Reset the map event zoomend...
		this.addEventOnMapZoomend();
	}

	synchronizeAllIconSize() {
		this.markers.eachLayer((marker) => {
			this.synchronizeSingeIconSize(marker);
		});
	}

	synchronizeSingeIconSize(marker) {
		const zoom_size = { min: this.zoom_min, max: this.zoom_max };
		const zoom = this.map._zoom;

		const divIcon = marker.options.icon.options;
		const lastDivIcon = divIcon.html;

		const parser = new DOMParser();
		const div_icon_html_page = parser.parseFromString(lastDivIcon, "text/html");
		const lastDivIcon_html = div_icon_html_page.querySelector(".single_marker_poi");

		const w_m_poi_size = { min: 50, max: 75 };
		const h_m_poi_size = { min: 20, max: 38 };
		const rad_m_poi_size = { min: 10, max: 20 };

		let w_m_poi = calculeProgression(w_m_poi_size, zoom_size, zoom);
		let h_m_poi = calculeProgression(h_m_poi_size, zoom_size, zoom);
		let br_m_poi = calculeProgression(rad_m_poi_size, zoom_size, zoom);

		let style_m_poi = `width:${w_m_poi.toFixed(1)}px!important;`;
		style_m_poi = `${style_m_poi}height:${h_m_poi.toFixed(1)}px!important;`;
		style_m_poi = `${style_m_poi}border-radius:${br_m_poi.toFixed(1)}px!important;`;

		lastDivIcon_html.setAttribute("style", style_m_poi);

		const single_marker_point = lastDivIcon_html.querySelector(".single_marker_point");

		const pb_m_point_size = { min: 104, max: 297 };
		const wh_m_point_size = { min: 9, max: 21 };

		let wh_m_point = calculeProgression(wh_m_point_size, zoom_size, zoom);
		let pb_m_point = calculeProgression(pb_m_point_size, zoom_size, zoom);

		let style_marker_point = `width:${wh_m_point.toFixed(1)}px!important;`;
		style_marker_point = `${style_marker_point}height:${wh_m_point.toFixed(1)}px!important;`;
		style_marker_point = `${style_marker_point}bottom:-${pb_m_point.toFixed(1)}%!important;`;
		style_marker_point = `${style_marker_point}border-top-color:white!important;`;
		style_marker_point = `${style_marker_point}border-left-color:white!important;`;

		single_marker_point.setAttribute("style", style_marker_point);

		const single_marker_image = lastDivIcon_html.querySelector(".single_marker_image");
		const style_wh_image = single_marker_image.getAttribute("style");

		const w_image_size = { min: 12, max: 34 };
		const h_image_size = { min: 15, max: 40 };

		let wh = style_wh_image.split(";").map((i) => i.trim().split(":"));
		wh = wh.map((i) => {
			let prog = 0.0;
			if (i[0] === "width") {
				prog = calculeProgression(w_image_size, zoom_size, zoom);
			} else if (i[0] === "height") {
				prog = calculeProgression(h_image_size, zoom_size, zoom);
			}
			i[1] = `${prog.toFixed(1)}px`;

			return i.join(":");
		});

		single_marker_image.setAttribute("style", wh.join(";"));

		if (lastDivIcon_html.querySelector(".single_marker_point_pastille")) {
			const m_point_pastille = lastDivIcon_html.querySelector(".single_marker_point_pastille");

			const wh_m_poi_pas_size = { min: 7, max: 12 };
			const left_pos_m_poi_size = { min: 342, max: 482 };

			let wh_m_poi_pas = calculeProgression(wh_m_poi_pas_size, zoom_size, zoom);
			let left_pos_m_poi = calculeProgression(left_pos_m_poi_size, zoom_size, zoom);

			const pastille_type = m_point_pastille.getAttribute("data-pastille-type");

			let style_m_poi_pas = `background-color:${pastille_type};`;
			style_m_poi_pas = `${style_m_poi_pas}width:${wh_m_poi_pas.toFixed(1)}px!important;`;
			style_m_poi_pas = `${style_m_poi_pas}height:${wh_m_poi_pas.toFixed(1)}px!important;`;
			style_m_poi_pas = `${style_m_poi_pas}left:${left_pos_m_poi.toFixed(1)}%!important;`;

			m_point_pastille.setAttribute("style", style_m_poi_pas);
		}

		marker.setIcon(
			new L.DivIcon({
				...divIcon,
				html: `${lastDivIcon_html.outerHTML}`,
			})
		);
	}

	/**
	 * @author Jehovanie RAMANDRIJOEL
	 * où: on Utilise cette fonction dans le mapModule,
	 * localisation du fichier: dans MapModule.js,
	 * je veux: supprimer les markers qui sont en dehors de notre vue sur la carte
	 *
	 * @param {} newSize  { minx, maxx, miny, maxy }
	 *
	 * - remove markers outside the box an normalize the size of the markers.
	 */
	removeMarkerOutSideTheBox(newSize) {
		const { minx, maxx, miny, maxy } = newSize;

		let countMarkersRemoved = 0;

		//// REMOVE the outside the box
		this.markers.eachLayer((marker) => {
			const { lat, lng } = marker.getLatLng();
			const isInDisplay =
				lat > parseFloat(miny) && lat < parseFloat(maxy) && lng > parseFloat(minx) && lng < parseFloat(maxx);

			if (!isInDisplay) {
				this.markers_display = this.markers_display.map((item) => {
					const ratio = item.ratio;

					if (item.lat.toString() === lat.toFixed(ratio).toString()) {
						//// update data list
						item.data = [
							...item.data.filter(
								(jtem) => !(jtem.id === marker.options.id && jtem.rubrique_type === marker.options.type)
							),
						];

						//// update marker list
						item.markers = [
							...item.markers.filter(
								(ktem) =>
									!(
										parseInt(ktem.options.id) === parseInt(marker.options.id) &&
										ktem.options.type === marker.options.type
									)
							),
						];
					}
					return item;
				});

				this.markers.removeLayer(marker);
				countMarkersRemoved++;
			}
		});

		console.log(`Marker removed: ${countMarkersRemoved}`);
	}

	/**
	 * @author Jehovanie RAMANDRIJOEL <Jehovanieram@gmail.com>
	 *
	 * Goal: Create a new marker POI for count per dep.
	 * Use in: MapModule function addCulsterNumberAtablismentPerDep,
	 *
	 * @paramt {item}
	 *
	 * @return marker leaflet.
	 */
	singleMarkerNumberEtablisementPerDep(item) {
		let marker = new L.Marker(item.latlng, {
			icon: new L.DivIcon({
				className: "mycluster",
				html: `
					<div class="content_text_number_per_dep">
						<p class="text_number_per_dep">
							${item.properties.account_per_dep}
						</p>
					</div>
				`,
				iconSize: [50, 40],
				iconAnchor: [11, 30],
				popupAnchor: [0, -20],
				shadowSize: [68, 95],
				shadowAnchor: [22, 94],
			}),
			type: "count_per_dep",
		});

		return marker;
	}

	/**
	 * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
	 *
	 * Goal: Move the map to the departement clicked
	 * Use in: MapModule function  addCulsterNumberAtablismentPerDep
	 *
	 * @param {MarkerLeaflet} markerCountPerDep
	 *
	 * @retun void
	 */
	bindEventClickMarkerCountPerDep(markerCountPerDep) {
		markerCountPerDep.on("click", (e) => {
			const latlng = markerCountPerDep.getLatLng();
			this.updateCenter(parseFloat(latlng.lat), parseFloat(latlng.lng), 11);
		});
	}

	/**
	 *  @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
	 *  Goal: add marker with text count etablisement per dep, inside the map.
	 */
	async addCulsterNumberAtablismentPerDep() {
		this.geos = this.geos.length === 0 ? await this.settingGeos() : this.geos;
		this.geos.forEach((item) => {
			if (parseInt(item.properties.account_per_dep) > 0) {
				///get center lat long
				const centroidCoordinates = this.getCentroidCoordinatesFromGeos(item);

				/// item is not type polygone or multipolygon
				if (centroidCoordinates !== null) {
					///leaflet latlng
					const latlng = L.latLng(parseFloat(centroidCoordinates[1]), parseFloat(centroidCoordinates[0]));
					////create marker
					let markerCountPerDep = this.singleMarkerNumberEtablisementPerDep({ ...item, latlng: latlng });

					this.bindEventClickMarkerCountPerDep(markerCountPerDep);

					this.markerClusterForCounterPerDep?.addLayer(markerCountPerDep);
				}
			}
		});

		if (this.map.getZoom() < this.zoom_max_for_count_per_dep) {
			this.map.addLayer(this.markerClusterForCounterPerDep);
		} else {
			this.map.addLayer(this.markers);
		}

		// this.addEventMapOnZoomend();
	}

	/**
	 * @author Jehovanie RAMANDRIJOEL <jehovanierama@gmail.com>
	 *
	 * @whereIUseIt [
	 *      this.openRightSide() [ MapCMZ ]
	 * 		this.openRubriqueFilter()
	 * ]
	 * @returns list HTML rubrique to select on the right
	 */
	injectListRubriqueType() {
		if (!document.querySelector(".content_right_side_body_jheo_js")) {
			console.log("Selector not found : '.content_right_side_body_body'");
			return false;
		}

		//// data transformation  --------------------------------
		let btn_rubrique = this.allRubriques.map((item) => {
			const icon_image = IS_DEV_MODE ? `/${item.icon}` : `/public/${item.icon}`;
			const class_active = item.is_active ? "btn-primary" : "btn-light";

			let badge_filter = "";
			if (item.filter.is_filtered === true) {
				badge_filter = `
					<span class="badge_position_filter badge_filter_${item.api_name}_jheo_js cursor_pointer translate-middle badge rounded-pill bg-danger" 
						onclick="openRubriqueFilter('${item.api_name}')"
					>
						Filtre
					</span>
				`;
			}

			let open_filter = "";
			if (item.is_active === true) {
				open_filter = `
					<i class="fa-solid fa-ellipsis fa-rotate-90 ms-1 fa_solide_open_rubrique_jheo_js" onclick="openRubriqueFilter('${item.api_name}')"></i>
					<div class="d-none tooltip_rubrique_filter tooltip_rubrique_filter_jheo_js" onclick="openRubriqueFilter('${item.api_name}')">
						Cliquez ici pour voir les filtres
					</div>
				`;
			}

			return `
				<button type="button" 
					class="position-relative d-flex justify-content-between align-items-center rubrique_list_item rubrique_list_item_jheo_js btn ${class_active} btn-sm mb-1 me-1"
					data-type="${item.name}" data-api_name="${item.api_name}"
				>
					${badge_filter}
					<span class="d-flex justify-content-center align-items-center rubrique_icon_text_jheo_js me-1">
						<img class="image_icon_rubrique" src="${icon_image}" alt="${item.name}_rubrique" />
						${item.name}
					</span>
					${open_filter}
				</button>
			`;
		});
		//// end of data transformation --------------------------------

		const is_have_rubrique_filter = this.allRubriques.some((item) => item.filter.is_filtered === true);

		let btn_action = "";
		if (is_have_rubrique_filter) {
			btn_action = `
				<button type="button" class="btn btn-danger btn-sm" onclick="resetFilterForAllRubrique()">Annuler tout les filtres</button>
			`;
		} else {
			btn_action = `
				<button type="button" class="btn btn-danger btn-sm" disabled>Annuler tout les filtres</button>
			`;
		}

		btn_action = `
			${btn_action}
			<button type="button" class="btn btn-secondary btn-sm" onclick="closeRightSide()">Fermer</button>
		`;

		document.querySelector(".content_right_side_body_jheo_js").innerHTML = `
            <div class="rubrique_list right_side_body_jheo_js">
                ${btn_rubrique.join("")}
            </div>
			<div class="content_alert_info content_alert_info_jheo_js"></div>
			<div class="btn_cancel_filter_for_all">
				${btn_action}
			</div>
        `;

		this.showAlertInformation();

		this.bindSelectRubrique();
	}

	showAlertInformation() {
		const tab_info = [
			"Vous pouvez sélectionner une ou plusieurs rubriques à activer.",
			"Vous pouvez également double-cliquer sur une rubrique pour l'activer seule.",
		];

		const tab_info_index = tab_info[Symbol.iterator]();

		let tab_info_value = tab_info_index.next().value;

		const info_interval = setInterval(() => {
			const alert_info = `
				<div class="alert alert-info alert_info_rubrique alert_info_rubrique_show alert_info_jheo_js" role="alert">
					<i class="fa-solid fa-x fa_solide_info_rubrique" onclick="removeInfoRubrique(this)"></i>
					${tab_info_value}
				</div>
			`;

			document.querySelector(".content_alert_info_jheo_js")?.insertAdjacentHTML("beforeend", alert_info);

			tab_info_value = tab_info_index.next().value;

			if (tab_info_value === undefined) {
				clearInterval(info_interval);
			}
		}, 1500);
	}

	bindSelectRubrique() {
		if (!document.querySelectorAll(".rubrique_list_item_jheo_js")) {
			console.log("Selector not found: 'rubrique_list_item_jheo_js' ");
			return;
		}

		const all_button_rubrique = Array.from(document.querySelectorAll(".rubrique_list_item_jheo_js"));

		all_button_rubrique.forEach((btn_rubrique) => {
			btn_rubrique.addEventListener("mouseover", () => {
				btn_rubrique.querySelector(".tooltip_rubrique_filter_jheo_js")?.classList?.remove("d-none");
			});

			btn_rubrique.addEventListener("mouseout", () => {
				btn_rubrique.querySelector(".tooltip_rubrique_filter_jheo_js")?.classList?.add("d-none");
			});

			btn_rubrique.querySelector(".rubrique_icon_text_jheo_js").addEventListener("click", () => {
				btn_rubrique.classList.toggle("btn-light");
				btn_rubrique.classList.toggle("btn-primary");

				const rubrique_api_name = btn_rubrique.getAttribute("data-api_name");

				const rubrique_clicked = this.allRubriques.find((item) => item.api_name === rubrique_api_name);

				if (rubrique_clicked.is_active === true) {
					//// disable rubrique...
					this.disableRubrique(rubrique_api_name);

					btn_rubrique.querySelector(".fa_solide_open_rubrique_jheo_js").remove();
					btn_rubrique.querySelector(".tooltip_rubrique_filter_jheo_js").remove();
				} else {
					//// active rubrique...
					this.activeRubrique(rubrique_api_name);

					if (!btn_rubrique.querySelector(".fa_solide_open_rubrique_jheo_js")) {
						btn_rubrique.insertAdjacentHTML(
							"beforeend",
							`
								<i class="fa-solid fa-ellipsis fa-rotate-90 ms-1 fa_solide_open_rubrique_jheo_js" onclick="openRubriqueFilter('${rubrique_api_name}')"></i>
								<div class="d-none tooltip_rubrique_filter tooltip_rubrique_filter_jheo_js"  onclick="openRubriqueFilter('${rubrique_api_name}')">
									Cliquez ici pour voir les filtres
								</div>
							`
						);
					}
				}

				//// update history rubrique active
				this.updateRubriqueActiveHistory();
			});

			btn_rubrique.querySelector(".rubrique_icon_text_jheo_js").addEventListener("dblclick", () => {
				all_button_rubrique.forEach((item) => {
					if (item.classList.contains("btn-primary")) {
						item.classList.remove("btn-primary");
						item.classList.add("btn-light");

						const rubrique_api_name = item.getAttribute("data-api_name");

						const rubrique_not_clicked = this.allRubriques.find(
							(item) => item.api_name === rubrique_api_name
						);

						if (rubrique_not_clicked.is_active === true) {
							this.allRubriques = [
								...this.allRubriques.map((item) => {
									if (item.api_name === rubrique_api_name) {
										item.is_active = false;
									}
									return item;
								}),
							];

							///remove rubrique active on the nav bar (in map_cmz_fonction.js)
							removeRubriqueActivNavbar(rubrique_api_name);

							this.removeRubriqueMarker(rubrique_api_name);

							item.querySelector(".fa_solide_open_rubrique_jheo_js").remove();
							item.querySelector(".tooltip_rubrique_filter_jheo_js").remove();

							//// remove rubrique in list on navleft ( in lib.js [datatables])
							removeListNavLeftRubriqueType(rubrique_api_name);
						}
					}
				});

				if (btn_rubrique.classList.contains("btn-light")) {
					btn_rubrique.classList.remove("btn-light");
				}

				if (!btn_rubrique.classList.contains("btn-primary")) {
					btn_rubrique.classList.add("btn-primary");
				}

				const rubrique_type = btn_rubrique.getAttribute("data-type");
				const rubrique_api_name = btn_rubrique.getAttribute("data-api_name");

				this.allRubriques = [
					...this.allRubriques.map((item) => {
						if (item.name === rubrique_type) {
							item.is_active = true;
						}
						return item;
					}),
				];

				///add rubrique active on the nav bar (in map_cmz_fonction.js)
				addRubriqueActivNavbar(
					this.allRubriques.find((item) => item.api_name === rubrique_api_name.toLowerCase())
				);

				//// update history rubrique active
				this.updateRubriqueActiveHistory();

				this.addRubriqueMarker(rubrique_api_name);

				if (!btn_rubrique.querySelector(".fa_solide_open_rubrique_jheo_js")) {
					btn_rubrique.insertAdjacentHTML(
						"beforeend",
						`
							<i class="fa-solid fa-ellipsis fa-rotate-90 ms-1 fa_solide_open_rubrique_jheo_js" onclick="openRubriqueFilter('${rubrique_api_name}')"></i>
							<div class="d-none tooltip_rubrique_filter tooltip_rubrique_filter_jheo_js" onclick="openRubriqueFilter('${rubrique_api_name}')">
								Cliquez ici pour voir les filtres
							</div>
						`
					);
				}
			});
		});
	}

	/**
	 * @author Jehovanie RAMANDRJOEL <jehovanieram@gmail.com>
	 *
	 * @goal to active one rubrique ( add on nav bar and fetch data related )
	 *
	 * @param {*} rubrique_api_name
	 */
	activeRubrique(rubrique_api_name) {
		this.allRubriques = [
			...this.allRubriques.map((item) => {
				if (item.api_name === rubrique_api_name) {
					item.is_active = true;
				}
				return item;
			}),
		];

		///add rubrique active on the nav bar (in map_cmz_fonction.js)
		addRubriqueActivNavbar(this.allRubriques.find((item) => item.api_name === rubrique_api_name.toLowerCase()));

		this.addRubriqueMarker(rubrique_api_name);
	}

	/**
	 * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
	 *
	 * @goal to remove one rubrique (remove all action related on it)
	 *
	 * @param {*} rubrique_api_name
	 */
	disableRubrique(rubrique_api_name) {
		this.allRubriques = [
			...this.allRubriques.map((item) => {
				if (item.api_name === rubrique_api_name) {
					item.is_active = false;
				}
				return item;
			}),
		];

		///remove rubrique active on the nav bar (in map_cmz_fonction.js)
		removeRubriqueActivNavbar(rubrique_api_name);

		this.removeRubriqueMarker(rubrique_api_name);

		//// remove card list on the left.
		removeListNavLeftRubriqueType(rubrique_api_name);
	}

	/**
	 * @author Jehovanie RAMANDRIJOEL <jehovanierama@gmail.com>
	 *
	 * @returns
	 */
	async openRubriqueFilter(rubrique_type) {
		try {
			if (!this.isRightSideAlreadyOpen) {
				this.openRightSideWidth();
			}

			if (this.list_departements.length === 0) {
				await this.fetchDepartement();
			}

			document.querySelector(".content_legende_jheo_js").innerHTML = `
				${this.defaultHTMLFilterBody(rubrique_type)}
			`;

			///inject filter departement and filter for notation
			document.querySelector(".content_body_filter_jheo_js").innerHTML = `
				${this.htmlFilterDepartement(rubrique_type)}
				${this.htmlSliderPerNote()}
			`;
			///inject filter for notation
			this.htmlFilterForNotation(rubrique_type);

			const rubrique_type_object = this.allRubriques.find((item) => item.api_name === rubrique_type);

			if (rubrique_type_object.is_have_specific_filter) {
				rubrique_type_object.specifiqueFilter();
			}

			//// close filter
			if (this.isRightSideAlreadyOpen && document.querySelector(".close_right_side_jheo_js")) {
				document.querySelector(".close_right_side_jheo_js").addEventListener("click", () => {
					document.querySelector(".content_legende_jheo_js").innerHTML = `
						${this.defaultHTMLRightSide()}
					`;

					this.closeRightSide();
				});
			}

			/// came back to list rubriques
			if (this.isRightSideAlreadyOpen && document.querySelector(".cta_back_select_rubrique_jheo_js")) {
				document.querySelector(".cta_back_select_rubrique_jheo_js").addEventListener("click", () => {
					document.querySelector(".content_legende_jheo_js").innerHTML = `
						${this.defaultHTMLRightSide()}
					`;

					const header_text = "Sélectionner ou désélectionner une ou plusieurs rubriques.";
					document.querySelector(".title_right_side_jheo_js").innerText = header_text;

					this.injectListRubriqueType();

					document.querySelector(".close_right_side_jheo_js").addEventListener("click", () => {
						this.closeRightSide();
					});
				});
			}
		} catch (error) {
			console.log(error);
		}
	}

	/**
	 * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
	 *
	 * @goal this is the polymorphisme of the function [this.]specifiqueFilter()
	 */
	specifiqueFilterStation() {
		const rubrique_type_object = this.allRubriques.find((item) => item.api_name === "station");

		const identifiant_slyder = "price_carburant_station";

		const { produit, price_produit } = rubrique_type_object.filter.specifique;

		injectFilterProduitStation(identifiant_slyder, produit);
		this.activeSlidePriceCarburantStation(identifiant_slyder, price_produit);
	}

	/**
	 * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
	 *
	 * @whereIUseIt  [
	 * 	 this.specifiqueFilterStation()
	 * ]
	 */
	activeSlidePriceCarburantStation(identifiant_slyder, price_produit) {
		injectSliderStation(identifiant_slyder, price_produit);
	}

	/**
	 * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
	 *
	 * @whereIUseIt  [
	 * 	 this.specifiqueFilterStation()
	 * ]
	 */
	activeSlidePriceCarburantResto(identifiant_slyder, price_produit) {
		injectSliderCustomise(identifiant_slyder, price_produit);
	}

	/**
	 * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
	 *
	 * @goal this is the polymorphisme of the function [this.]getStateSpecificFilter()
	 */
	getStateSpecificFilterStation() {
		const rubrique_type_object = this.allRubriques.find((item) => item.api_name === "station");
		const {
			filter: { specifique: rubrique_specifique_filter },
		} = rubrique_type_object;

		const state_specifique_filter = { ...rubrique_specifique_filter };

		const identifiant_slyder = "price_carburant_station";

		const slider_carburant = document.getElementById(`${identifiant_slyder}_jheo_js`);
		const slider_price_carburant = slider_carburant.noUiSlider.get();

		state_specifique_filter["price_produit"] = {
			...state_specifique_filter["price_produit"],
			min: parseFloat(slider_price_carburant[0]),
			max: parseFloat(slider_price_carburant[1]),
		};

		for (var name_produit in rubrique_specifique_filter.produit) {
			const checkbox_produit = document.getElementById(`${name_produit}_toggle_jheo_js`).checked;
			state_specifique_filter["produit"][name_produit] = {
				...state_specifique_filter["produit"][name_produit],
				is_filtered: checkbox_produit,
			};
		}

		return state_specifique_filter;
	}

	/**
	 * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
	 *
	 * @goal this is the polymorphisme of the function [this.]resetSpecificFilter()
	 */
	resetSpecificFilterStation() {
		this.allRubriques = this.allRubriques.map((rubrique) => {
			if (rubrique.api_name === "station") {
				rubrique.filter.specifique = {
					...rubrique.filter.specifique,
					produit: {
						e85: { is_filtered: true, prix: 0 },
						gplc: { is_filtered: true, prix: 0 },
						sp95: { is_filtered: true, prix: 0 },
						sp95e10: { is_filtered: true, prix: 0 },
						sp98: { is_filtered: true, prix: 0 },
						gasoil: { is_filtered: true, prix: 0 },
					},
					price_produit: {
						min: 0,
						max: 20,
						min_default: 0,
						max_default: 20,
					},
				};
			}
			return rubrique;
		});

		const rubrique_type_object = this.allRubriques.find((item) => item.api_name === "station");
		const { price_produit, produit } = rubrique_type_object.filter.specifique;

		const { min_default, max_default } = price_produit;

		resetSliderCustomise("price_carburant_station", { min: min_default, max: max_default });

		for (var name_produit in produit) {
			document.getElementById(`${name_produit}_toggle_jheo_js`).checked = true;
		}
	}

	/**
	 * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
	 *
	 * @goal Action common filter ( note, departement )
	 *
	 * @param {*} rubrique_type
	 * @param {*} rubrique_item
	 *
	 * @returns
	 */
	checkIsMuchOnFilterCommon(rubrique_type, rubrique_item) {
		const rubrique_type_object = this.allRubriques.find((item) => item.api_name === rubrique_type);
		const { filter } = rubrique_type_object;

		const moyenne_note = rubrique_item.hasOwnProperty("moyenne_note")
			? parseFloat(parseFloat(rubrique_item.moyenne_note).toFixed(2))
			: 0;

		const is_match_filter_notation = moyenne_note >= filter.notation.min && moyenne_note <= filter.notation.max;

		const is_match_filter_departement =
			filter.departement === "tous" || parseInt(filter.departement) === parseInt(rubrique_item.dep)
				? true
				: false;

		return is_match_filter_departement && is_match_filter_notation;
	}

	/**
	 * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
	 *
	 * @goal this is the polymorphisme of the function [this.]checkIsMuchOnFilter()
	 */
	checkIsMuchOnFilterStation(item) {
		const rubrique_type_object = this.allRubriques.find((item) => item.api_name === "station");
		if (!rubrique_type_object.filter.is_filtered) {
			return true;
		}

		const rubrique_typeo_object_filter = rubrique_type_object.filter.specifique.produit;
		const rubrique_filter_price_produit = rubrique_type_object.filter.specifique.price_produit;

		let result = false;

		result = this.checkIsMuchOnFilterCommon("station", item);

		if (
			rubrique_filter_price_produit.min === rubrique_filter_price_produit.min_default &&
			rubrique_filter_price_produit.max === rubrique_filter_price_produit.max_default
		) {
			result = result && true;
		} else {
			const object_filter_key_transform = {};

			for (let name_produit in rubrique_typeo_object_filter) {
				var name_produit_state = rubrique_typeo_object_filter[name_produit]["is_filtered"];
				object_filter_key_transform[`prix${name_produit.toLowerCase()}`] = name_produit_state;
			}

			for (let key_item in item) {
				if (
					object_filter_key_transform.hasOwnProperty(key_item.toLowerCase()) &&
					object_filter_key_transform[key_item.toLowerCase()] === true
				) {
					const price = parseFloat(item[key_item]);
					if (rubrique_filter_price_produit.min <= price && price <= rubrique_filter_price_produit.max) {
						result = result && true;
					} else {
						result = false;
					}
				}
			}
		}

		return result;
	}

	/**
	 * @author Jehovanie RAMANDRIJOEL <jehovanierama@gmail.com>
	 *
	 * @Goal : handle action filter form the user
	 *
	 * @whereIUseIt : map_cmz_instance.js (because this function directly injected on html element)
	 *
	 * @param {*} rubrique_type
	 *
	 * @returns
	 */
	handleClickCtaFilter(rubrique_type) {
		if (!document.querySelector(".filter_departement_jheo_js")) {
			console.log("Selector not found: 'filter_departement_jheo_js'");
			return false;
		}

		if (!document.querySelector(".cta_to_filter_jheo_js")) {
			console.log("Selector not found: 'cta_to_filter_jheo_js'");
			return false;
		}

		if (document.querySelector(".content_nbr_result_filter_jheo_js")) {
			document.querySelector(".content_nbr_result_filter_jheo_js").remove();
		}

		const skipSlider = document.getElementById("skipstep");
		const filter_departement = document.querySelector(".filter_departement_jheo_js");
		const cta_to_filter = document.querySelector(".cta_to_filter_jheo_js");

		cta_to_filter.innerText = "Recherche en cours...";

		cta_to_filter.classList.remove("btn-primary");
		cta_to_filter.classList.add("btn-secondary");

		////------------- side common filter ------------------------------

		const filter_price = skipSlider.noUiSlider.get();
		const filter_dep_value = filter_departement.value;

		this.allRubriques = this.allRubriques.map((rubrique) => {
			if (rubrique.api_name === rubrique_type) {
				rubrique = {
					...rubrique,
					filter: {
						...rubrique.filter,
						is_filtered: true,
						departement: filter_dep_value,
						notation: {
							...rubrique.filter.notation,
							min: parseFloat(filter_price[0]).toFixed(2),
							max: parseFloat(filter_price[1]).toFixed(2),
						},
					},
				};
			}
			return rubrique;
		});
		//// --------------------------x----------------------------------------------

		////------------- side for the specifique filter ------------------------------
		let spec_filter = {};
		const rubrique_type_object = this.allRubriques.find((item) => item.api_name === rubrique_type);
		if (rubrique_type_object.is_have_specific_filter) {
			spec_filter = rubrique_type_object.getStateSpecificFilter();

			this.allRubriques = this.allRubriques.map((rubrique) => {
				if (rubrique.api_name === rubrique_type) {
					rubrique.filter.specifique = {
						...rubrique.filter.specifique,
						...spec_filter,
					};
				}
				return rubrique;
			});
		}

		//// --------------------------x----------------------------------------------

		if (document.querySelector(`.badge_navbar_${rubrique_type}_jheo_js`)) {
			const badge_navbar_rubrique = document.querySelector(`.badge_navbar_${rubrique_type}_jheo_js`);
			if (badge_navbar_rubrique.classList.contains("d-none")) {
				badge_navbar_rubrique.classList.remove("d-none");
			}
		}

		this.handleActionFilter(rubrique_type);
	}

	/**
	 * @author Jehovanie RAMANDRIJOEL <jehovanierama@gmail.com>
	 *
	 * @Goal : reset the filter doing before for the user.
	 *
	 * @whereIUseIt : map_cmz_instance.js (because this function directly injected on html element)
	 *
	 * @param {*} rubrique_type
	 *
	 * @returns
	 */
	resetFilterOnRubrique(rubrique_type) {
		if (!document.querySelector(".filter_departement_jheo_js")) {
			console.log("Selector not found: 'filter_departement_jheo_js'");
			return false;
		}

		if (!document.querySelector(".cta_to_filter_jheo_js")) {
			console.log("Selector not found: 'cta_to_filter_jheo_js'");
			return false;
		}

		if (document.querySelector(".content_nbr_result_filter_jheo_js")) {
			document.querySelector(".content_nbr_result_filter_jheo_js").remove();
		}

		const filter_departement = document.querySelector(".filter_departement_jheo_js");

		this.allRubriques = this.allRubriques.map((rubrique) => {
			if (rubrique.api_name === rubrique_type) {
				rubrique = {
					...rubrique,
					filter: {
						...rubrique.filter,
						is_filtered: false,
						departement: "tous",
						notation: {
							...rubrique.filter.notation,
							min: 0,
							max: 5,
						},
					},
				};
			}
			return rubrique;
		});

		filter_departement.querySelector("option").setAttribute("selected", true);
		filter_departement.value = "tous";

		///inject filter for notation
		this.resetSliderNotation();

		////------------- side for the specifique filter ------------------------------
		const rubrique_type_object = this.allRubriques.find((item) => item.api_name === rubrique_type);
		if (rubrique_type_object.is_have_specific_filter) {
			rubrique_type_object.resetSpecificFilter();
		}
		//// --------------------------x----------------------------------------------

		if (document.querySelector(`.badge_navbar_${rubrique_type}_jheo_js`)) {
			const badge_navbar_rubrique = document.querySelector(`.badge_navbar_${rubrique_type}_jheo_js`);
			if (!badge_navbar_rubrique.classList.contains("d-none")) {
				badge_navbar_rubrique.classList.add("d-none");
			}
		}

		const x = this.getMax(this.map.getBounds().getWest(), this.map.getBounds().getEast());
		const y = this.getMax(this.map.getBounds().getNorth(), this.map.getBounds().getSouth());

		const new_size = { minx: x.min, miny: y.min, maxx: x.max, maxy: y.max };

		const zoom = this.map._zoom;
		const current_object_dataMax = this.objectRatioAndDataMax.find((item) => zoom >= parseInt(item.zoomMin));
		const { dataMax, ratio } = current_object_dataMax;

		this.completeMarkerDisplay(new_size, dataMax, ratio);

		////update list datatables
		this.bindListItemRubriqueActive();
	}

	resetFilterForAllRubrique() {
		this.allRubriques = this.allRubriques.map((rubrique) => {
			rubrique = {
				...rubrique,
				filter: {
					...rubrique.filter,
					is_filtered: false,
					departement: "tous",
					notation: {
						...rubrique.filter.notation,
						min: rubrique.filter.notation.min_default,
						max: rubrique.filter.notation.max_default,
					},
				},
			};

			if (rubrique.is_have_specific_filter) {
				const new_produit = rubrique.filter.specifique.produit;
				for (let key_produit in new_produit) {
					new_produit[key_produit]["is_filtered"] = true;
					new_produit[key_produit]["prix"] = 0;
				}

				rubrique.filter.specifique = {
					...rubrique.filter.specifique,
					price_produit: {
						...rubrique.filter.specifique.price_produit,
						min: rubrique.filter.specifique.price_produit.min_default,
						max: rubrique.filter.specifique.price_produit.max_default,
					},
					produit: {
						...rubrique.filter.specifique.produit,
						...new_produit,
					},
				};
			}

			return rubrique;
		});

		this.allRubriques.forEach((item_rubrique) => {
			const rubrique_type = item_rubrique.api_name;

			if (document.querySelector(`.badge_navbar_${rubrique_type}_jheo_js`)) {
				const badge_navbar_rubrique = document.querySelector(`.badge_navbar_${rubrique_type}_jheo_js`);
				if (!badge_navbar_rubrique.classList.contains("d-none")) {
					badge_navbar_rubrique.classList.add("d-none");
				}
			}

			if (document.querySelector(`.badge_filter_${rubrique_type}_jheo_js`)) {
				document.querySelector(`.badge_filter_${rubrique_type}_jheo_js`).remove();
			}
		});

		const x = this.getMax(this.map.getBounds().getWest(), this.map.getBounds().getEast());
		const y = this.getMax(this.map.getBounds().getNorth(), this.map.getBounds().getSouth());

		const new_size = { minx: x.min, miny: y.min, maxx: x.max, maxy: y.max };

		const zoom = this.map._zoom;
		const current_object_dataMax = this.objectRatioAndDataMax.find((item) => zoom >= parseInt(item.zoomMin));
		const { dataMax, ratio } = current_object_dataMax;

		this.completeMarkerDisplay(new_size, dataMax, ratio);

		////update list datatables
		this.bindListItemRubriqueActive();
	}

	async handleActionFilter(rubrique_type) {
		//// -------------
		const rubrique_type_object = this.allRubriques.find((item) => item.api_name === rubrique_type);
		/// -----------------------

		//// fetch new data and update the data global
		let spec_data_by_filter = null;
		if (this.is_search_mode === false) {
			try {
				spec_data_by_filter = await this.fetchSpecifiDataByFilterOptions(rubrique_type);
			} catch (e) {
				console.log(e);
				spec_data_by_filter = { data: [] };
			}

			// this.defaultData[rubrique_type]["data"] = mergeArraysUnique(
			// 	this.defaultData[rubrique_type]["data"],
			// 	spec_data_by_filter["data"],
			// 	"id"
			// );

			this.updateDefaultData(spec_data_by_filter, rubrique_type);
		} else {
			spec_data_by_filter = {
				data: this.defaultData[rubrique_type]["data"].filter((i) =>
					rubrique_type_object.checkIsMuchOnFilter(i)
				),
				count: this.defaultData[rubrique_type]["data"].reduce((c, i) => {
					if (rubrique_type_object.checkIsMuchOnFilter(i)) {
						c = c + 1;
					}
					return c;
				}, 0),
			};
		}

		//// update data globally.

		/////update btn ////
		const nbr_result = spec_data_by_filter.hasOwnProperty("count") ? spec_data_by_filter["count"] : 0;

		document.querySelector(".content_body_filter_jheo_js").insertAdjacentHTML(
			"beforeend",
			`
			<div class="alert alert-primary mt-4 text-center content_nbr_result_filter_jheo_js" role="alert">
				${nbr_result} resultat(s)
			</div>
			`
		);

		const cta_to_filter = document.querySelector(".cta_to_filter_jheo_js");
		cta_to_filter.innerText = `Rechercher à nouveau`;

		cta_to_filter.classList.remove("btn-secondary");
		cta_to_filter.classList.add("btn-primary");
		//// end of the update btn ////

		/// filter by note
		this.markers_display = this.markers_display.map((item_markers_display) => {
			if (item_markers_display.data.length > 0) {
				item_markers_display.data = item_markers_display.data.filter((item_md_data) => {
					if (item_md_data.rubrique_type !== rubrique_type) {
						return true;
					}

					if (rubrique_type_object.checkIsMuchOnFilter(item_md_data)) {
						return true;
					}
					return false;
				});
			}

			if (item_markers_display.markers.length > 0) {
				item_markers_display.markers = item_markers_display.markers.filter((item_md_markers) => {
					if (item_md_markers.options.type !== rubrique_type) {
						return true;
					}

					const object_rubrique = this.defaultData[item_md_markers.options.type];
					const data = object_rubrique.data;

					const item_data = data.find((item) => item.id === parseInt(item_md_markers.options.id));

					if (rubrique_type_object.checkIsMuchOnFilter(item_data)) {
						return true;
					}
					return false;
				});
			}

			return item_markers_display;
		});

		////remove markers not matching
		this.markers_display.forEach((jtem_markers_display) => {
			const { markers: markers_jtem_md, data: data_jtem_markers_display } = jtem_markers_display;

			markers_jtem_md.forEach((item_marker) => {
				const is_removed = data_jtem_markers_display.some((item_data) => {
					return (
						item_data.id === parseInt(item_marker.options.id) &&
						item_data.rubrique_type === item_marker.options.type
					);
				});

				if (!is_removed) {
					this.markers.removeLayer(item_marker);
				}
			});
		});

		this.markers.eachLayer((item_marker) => {
			const item_marker_id = parseInt(item_marker.options.id);
			const item_marker_type = item_marker.options.type;

			if (item_marker_type === rubrique_type) {
				const object_rubrique = this.defaultData[item_marker_type];
				const data = object_rubrique.data;

				const item_data = data.find((item) => item.id === item_marker_id);

				if (item_data) {
					if (!rubrique_type_object.checkIsMuchOnFilter(item_data)) {
						this.markers.removeLayer(item_marker);
					}
				}
			}
		});

		/// for specifique departement
		if (rubrique_type_object.filter.departement !== "tous") {
			const dep = parseInt(rubrique_type_object.filter.departement);
			this.map.setView(L.latLng(centers[dep].lat, centers[dep].lng), centers[dep].zoom, {
				animation: true,
			});
		}
		/// end of the specifique departement

		////add new markers:
		const x = this.getMax(this.map.getBounds().getWest(), this.map.getBounds().getEast());
		const y = this.getMax(this.map.getBounds().getNorth(), this.map.getBounds().getSouth());
		const new_size = { minx: x.min, miny: y.min, maxx: x.max, maxy: y.max };

		this.updateMarkersDisplayForDragend(new_size);
		///end of the add of marker

		this.countMarkerInCart();

		// //// upadate list on the nav_left
		// updateDataTableByFilter(object_filter);
		// //// end of update list on the nav_left

		////update list datatables
		this.bindListItemRubriqueActive();
	}

	async fetchSpecifiDataByFilterOptions(rubrique_type) {
		const rubrique_type_object = this.allRubriques.find((item) => item.api_name === rubrique_type);
		if (rubrique_type_object === undefined) {
			return false;
		}

		const { departement, notation } = rubrique_type_object.filter;

		let link = `/fetch_data/${rubrique_type}`;

		const default_rubrique_active = this.allRubriques.filter((item) => item.is_active === true);
		const data_max_fetching = Math.ceil((this.allRubriques.length * 50) / default_rubrique_active.length);

		let param_search = {
			dep: departement,
			note_min: notation.min,
			note_max: notation.max,
			data_max: data_max_fetching,
		};

		if (rubrique_type_object.is_have_specific_filter) {
			param_search = {
				...param_search,
				...rubrique_type_object.filter.specifique,
			};
		}

		const request = new Request(link, {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify(param_search),
		});

		try {
			const reponse = await fetch(request);
			const data_response = await reponse.json();

			return data_response;
		} catch (e) {
			console.log("ERROR : Data not fecting...");
			return [];
		}
	}

	async fetchDepartement() {
		try {
			const response = await fetch("/api/alldepartements");
			if (!response.ok) {
				throw new Error(`Erreur de reseaur: ${response.status}`);
			}

			const response_dep = await response.json();
			const { departements } = response_dep;

			this.list_departements = [{ id: "tous", departement: "Tous les départements" }, ...departements];
		} catch (e) {
			console.log(error);
		}
	}

	/**
	 * @author Jehovanie RAMANDRIJOEL <jehovanierama@gmail.com>
	 *
	 * @whereIUseIt [
	 * 		this.openRubriqueFilter()
	 * ]
	 *
	 * @returns HTML default body for the filtre rubrique
	 */
	defaultHTMLFilterBody(rubrique_type) {
		const rubrique_type_object = this.allRubriques.find((item) => item.api_name === rubrique_type);

		const default_html_filter_body = `
			<div class="mt-5">
				<div class="content_headers mb-1">
					<div style="width: 100%;">
						<nav class="d-flex justify-content-between align-items-center">
							<div class="d-flex justify-content-between align-items-center">
								<i class="fa-solid fa-arrow-left cursor_pointer cta_back_select_rubrique_jheo_js"></i>
								<a class="navbar-brand ms-2 fs-6 text-black" href="#">Les filtres pour ${rubrique_type_object.name}</a>
							</div>
							<div class="content_close_right_side">
								<div class="close_right_side close_right_side_jheo_js">
									<i class="fa-solid fa-xmark cursor_pointer"></i>
								</div>
							</div>
						</nav>
					</div>
				</div>
				<hr>
				<div class="content_body_filter content_body_filter_jheo_js">

				</div>
				<nav class="navbar navbar-light bg-light d-flex justify-content-between align-items-center">
					<a class="navbar-brand cancel_filter cta_to_cancel_filter_jheo_js" href="#"
					   onclick="resetFilterOnRubrique('${rubrique_type}')"
					>
						Annuler
					</a>
					<button type="button" class="btn btn-primary cta_to_filter cta_to_filter_jheo_js" 
					   onclick="handleClickCtaFilter('${rubrique_type}')"
					>
					   Voir les résultats
					</button>
				</nav>
			</div>
		`;

		return default_html_filter_body;
	}

	htmlFilterDepartement(rubrique_type) {
		if (this.list_departements.length === 0) {
			html_filter_departement = `
				<div class="mt-2 mb-3 p-1">
					<div class="alert alert-secondary text-center" role="alert">
						Une erreur est survenue sur votre réseau.
					</div>
				</div>
				<hr>
			`;
			return 0;
		}

		const rubrique_type_object = this.allRubriques.find((item) => item.api_name === rubrique_type);
		let dep_selected = rubrique_type_object.filter.departement;

		let options_dep = "";
		this.list_departements.forEach((item) => {
			let selected = item.id === dep_selected ? "selected" : "";

			options_dep += `
				<option value="${item.id}" ${selected}>
					${item.id != "tous" ? item.id : ""} ${item.departement.replaceAll("-", " ")}
				</option>
			`;
		});

		let html_filter_departement = "";

		html_filter_departement = `
			<div class="mt-2 mb-3 p-1">
				<label for="filter_departement" class="form-label text-black">Sélectionner un département</label>
				<select id="filter_departement" name="filter_departement" class="form-select form-control-sm filter_departement_jheo_js"
					aria-label="Default select example"
				>
					${options_dep}
				</select>
			</div>
			<hr>
		`;

		return html_filter_departement;
	}

	htmlSliderPerNote() {
		const html_filter_by_note = `
			<div class="content mt-2 mb-3 p-1">
				<h2 class="text-black">Filtrer selon la notation</h2>
				<div class="slider-area mt-1">
					<div class="slider-area-wrapper">
						<span id="skip-value-lower"></span>
						<div id="skipstep" class="slider"></div>
						<span id="skip-value-upper"></span>
					</div>
				</div>
			</div>
			<hr>
		`;

		return html_filter_by_note;
	}

	/**
	 * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
	 *
	 * @whereIUseIt [
	 * 	 this.openRubriqueFilter()
	 * ]
	 */
	htmlFilterForNotation(rubrique_type) {
		const rubrique_type_object = this.allRubriques.find((item) => item.api_name === rubrique_type);
		let dep_selected = rubrique_type_object.filter.notation;

		////fonction dans la lib.js
		injectSlider({ min: dep_selected.min, max: dep_selected.max });
	}

	/**
	 * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
	 *
	 * @whereIUseIt [
	 * 	 this.resetFilterOnRubrique()
	 * ]
	 */
	resetSliderNotation() {
		resetSliderNotation();
	}

	removeRubriqueMarker(rubrique_api_name) {
		this.markers.eachLayer((marker) => {
			if (marker.options.type === rubrique_api_name.toLowerCase()) {
				this.markers.removeLayer(marker);
			}
		});

		this.markers_display = this.markers_display.map((item) => {
			item.data = item.data.filter(
				(jtem) => jtem.rubrique_type.toLowerCase() !== rubrique_api_name.toLowerCase()
			);

			return item;
		});

		this.markers_display = this.markers_display.map((item) => {
			item.markers = item.markers.filter((jtem) => {
				const jtem_id = parseInt(jtem.options.id);
				const jtem_type = jtem.options.type;

				return item.data.some((ktem) => ktem.id === jtem_id && ktem.rubrique_type === jtem_type);
			});

			return item;
		});
	}

	/**
	 * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
	 *
	 * @goal Fetch data from the api backend with the current bound map( min, max [ lat, long ])
	 *
	 * @param {*} rubrique_type type of the rubrique to fetch form data.
	 * @param {*} options options specific like ( data_max [ number limit the data ])
	 */
	async fetchDataRubrique(rubrique_type, options = {}) {
		const x = this.getMax(this.map.getBounds().getWest(), this.map.getBounds().getEast());
		const y = this.getMax(this.map.getBounds().getNorth(), this.map.getBounds().getSouth());

		let param = `minx=${encodeURIComponent(x.min)}`;
		param = `${param}&miny=${encodeURIComponent(y.min)}`;
		param = `${param}&maxx=${encodeURIComponent(x.max)}`;
		param = `${param}&maxy=${encodeURIComponent(y.max)}`;

		if (options && options.data_max) {
			param = `${param}&data_max=${options.data_max}`;
		}

		if (options && options.isFirstResquest === true) {
			param = `${param}&isFirstResquest=${options.isFirstResquest}`;
		}

		let link = `/fetch_data/${rubrique_type}?${param}`;

		const request = new Request(link, {
			method: "GET",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
		});

		try {
			const reponse = await fetch(request);
			const data_response = await reponse.json();

			return data_response;
		} catch (e) {
			console.log("ERROR : Data not fecting...");
			return [];
		}
	}

	async fetchDataRubriqueOnSearch(rubrique_type, options = {}) {
		let param = "";
		if (options && options.cles0) {
			param = `${param}&cles0=${options.cles0}`;
		}

		if (options && options.cles1) {
			param = `${param}&cles1=${options.cles1}`;
		}

		let link = `/fetch_data/search/${rubrique_type}?${param}`;
		const request = new Request(link, {
			method: "GET",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
		});

		try {
			const reponse = await fetch(request);
			const data_response = await reponse.json();

			return data_response;
		} catch (e) {
			console.log("ERROR : Data not fecting...");
			return [];
		}
	}

	async addRubriqueMarker(rubrique_api_name) {
		let response = null;
		if (!this.is_search_mode) {
			response = await this.fetchDataRubrique(rubrique_api_name.toLowerCase());
		} else {
			response = await this.fetchDataRubriqueOnSearch(rubrique_api_name, this.search_options);
		}

		this.updateDefaultData(response, rubrique_api_name);

		this.updateMapAddRubrique(rubrique_api_name);

		//// add card list on the left.
		// this.addDataToTableListLeft(this.defaultData[rubrique_api_name]["data"], rubrique_api_name);
	}

	bindActionToShowNavLeft() {
		if (!document.querySelector(".cta_show_list_nav_left_jheo_js")) {
			console.log("Selector not found: 'cta_show_list_nav_left_jheo_js'");
			return;
		}

		const cta_show_list_nav_left = document.querySelector(".cta_show_list_nav_left_jheo_js");
		cta_show_list_nav_left.innerHTML = `
			<i class="fa-solid fa-xmark fa_solid_icon_nav_left_jheo_js" data-type="show"></i>
		`;

		this.bindListItemRubriqueActive();

		cta_show_list_nav_left.addEventListener("click", () => {
			const fa_solid_icon_nav_left = document.querySelector(".fa_solid_icon_nav_left_jheo_js");
			if (fa_solid_icon_nav_left.getAttribute("data-type") === "show") {
				cta_show_list_nav_left.innerHTML = `
					<i class="fa-solid fa-list fa_solid_icon_nav_left_jheo_js" data-type="hide"></i>
				`;

				const list_nav_left = document.querySelector(".list_nav_left_jheo_js");
				if (!list_nav_left) {
					console.log("Selector not found: 'list_nav_left_jheo_js'");
					return false;
				}

				list_nav_left.innerHTML = "";
			} else {
				cta_show_list_nav_left.innerHTML = `
					<i class="fa-solid fa-xmark fa_solid_icon_nav_left_jheo_js" data-type="show"></i>
				`;

				this.bindListItemRubriqueActive();
			}

			document.querySelector(".content_list_nav_left_jheo_js").classList.toggle("d-none");
		});
	}

	bindListItemRubriqueActive() {
		const all_rubrique_active = this.allRubriques.filter((item) => item.is_active === true);

		let data_transform = [];
		all_rubrique_active.forEach((rubrique) => {
			const { api_name, name: name_rubrique } = rubrique;

			const data_rubrique = this.defaultData[api_name];
			const data_rubrique_data_default = data_rubrique.hasOwnProperty("data") ? data_rubrique["data"] : [];

			let data_rubrique_data = data_rubrique_data_default.filter((item_data) => {
				if (rubrique.checkIsMuchOnFilter(item_data)) {
					return true;
				}
				return false;
			});

			data_rubrique_data = data_rubrique_data.map((item) => {
				return { ...item, name_rubrique: name_rubrique, rubrique_type: api_name };
			});

			data_transform = data_transform.concat(data_rubrique_data);
		});

		this.injectListemRubriqueActive(data_transform);
	}

	injectListemRubriqueActive(data) {
		const list_nav_left = document.querySelector(".list_nav_left_jheo_js");
		if (!list_nav_left) {
			console.log("Selector not found: 'list_nav_left_jheo_js'");
			return false;
		}

		let body_table_list_rubrique_active = "";
		data.forEach((item_data) => {
			body_table_list_rubrique_active += `
				<tr class="item_list_rubrique_nav_left_jheo_js" style="border: 1px solid transparent;">
					<td>${this.createItemRubriqueActive(item_data)}</td>
				</tr>
			`;
		});

		list_nav_left.innerHTML = `
			<table id="list_item_rubrique_active_nav_left" class="table">
				<thead>
					<tr style="display: none">
						<th scope="col">#</th>
					</tr>
				</thead>
				<tbody>
					${body_table_list_rubrique_active}
				</tbody>
			</table>
		`;

		activeDataTableOnList("#list_item_rubrique_active_nav_left");
	}

	getStateValidationTooltip(rubrique_type, rubrique_id) {
		const data = this.defaultData[rubrique_type];

		if (data.hasOwnProperty("options")) {
			let options = data["options"];

			if (options.hasOwnProperty("validation")) {
				let validation = options["validation"];

				if (
					validation.hasOwnProperty("admin_cmz") &&
					validation.admin_cmz.some(({ rubriqueId: id }) => parseInt(rubrique_id) === parseInt(id))
				) {
					return this.validation_color["admin_cmz"];
				} else if (
					validation.hasOwnProperty("validator_cmz") &&
					validation.validator_cmz.some(({ rubriqueId: id }) => parseInt(rubrique_id) === parseInt(id))
				) {
					return this.validation_color["validator_cmz"];
				} else if (
					validation.hasOwnProperty("partisant_cmz") &&
					validation.partisant_cmz.some(({ rubriqueId: id }) => parseInt(rubrique_id) === parseInt(id))
				) {
					return this.validation_color["partisant_cmz"];
				} else if (
					validation.hasOwnProperty("source_info") &&
					validation.source_info.some(({ rubriqueId: id }) => parseInt(rubrique_id) === parseInt(id))
				) {
					return this.validation_color["source_info"];
				}
			}
		}

		return null;
	}

	stateValidationTooltipOnList(rubrique_type, rubrique_id) {
		let result_validation_state = "";

		// const tab_rand = Object.keys(this.validation_color);
		// const validation_key = tab_rand[Math.floor(Math.random() * tab_rand.length)];

		// let validation_color = this.validation_color[validation_key]["color"]; ////<span class="badge bg_dark_purple">n</span>
		// let validation_text = this.validation_color[validation_key]["text"];

		let validation_color = "";
		let validation_text = "";

		const data = this.defaultData[rubrique_type];

		if (data.hasOwnProperty("options")) {
			let options = data["options"];

			if (options.hasOwnProperty("validation")) {
				let validation = this.getStateValidationTooltip(rubrique_type, rubrique_id);

				if (validation === null) {
					return "";
				}

				validation_color = validation["color"];
				validation_text = validation["text"];

				result_validation_state = `
					<div class="ms-1 mb-2 position-relative">
						<i class="fa-regular fa-circle-check validation_check validation_check_jheo_js" 
							style="color:${validation_color}"
							onmouseover="showMsgTooltipValidation(this)"
							onmouseout="hideMsgTooltipValidation(this)"
						></i>
						<div class="validation_tooltip validation_tooltip_jheo_js d-none" style="background-color:${validation_color}">
							${validation_text}
						</div>
					</div>
				`;
			}
		}

		return result_validation_state;
	}

	createItemRubriqueActive(item_data) {
		const rubrique_active = this.allRubriques.find((item) => item.api_name === item_data.rubrique_type);

		const item_rubrique = rubrique_active.setListItemRubriqueActive(item_data);
		return item_rubrique;
	}

	cardItemRubriqueNameNoteAddress(name, note, address, options = {}) {
		const { id: id_rubrique, type: rubrique_type, dep } = options;
		const start_note_moyenne_html = createStartNoteHtml(note);
		return `
			<figure id="${rubrique_type}_${id_rubrique}" class="containt_name_note_address_jheo_js"
				data-departement="${dep}" data-note="${note}" data-rubrique-id="${id_rubrique}" data-rubrique-type="${rubrique_type}"
			>
				<blockquote class="blockquote mb-0">
					<p class="name_rubrique_nav_left" onclick="openDetailsRubriqueFromLeft('${id_rubrique}', '${rubrique_type}')">
						${name.toUpperCase()}
					</p>
				</blockquote>
				<div class="stars">
					${start_note_moyenne_html}
				</div>
				<figcaption class="blockquote-footer mt-0 mb-0">
					Adresse: <br> <cite title="Source Title" style="user-select: none">${address.toLowerCase()}</cite>
				</figcaption>
			</figure>
		`;
	}

	cardItemRubriqueImage(image_a_la_une) {
		return `
			<img class="img-fluid rounded" alt="image" style="width:150px; height:150px"
				src="${image_a_la_une}">
		`;
	}

	setListItemRubriqueActiveResto(item_data) {
		const rubrique_type = "restaurant";

		const { id, denominationF, name_rubrique, numvoie, typevoie, nomvoie, codpost, villenorm, dep } = item_data;
		const adresse = `${numvoie} ${typevoie} ${nomvoie} ${codpost} ${villenorm}`;
		const nom = denominationF;

		const moyenne_note = item_data.hasOwnProperty("moyenne_note")
			? parseFloat(parseFloat(item_data.moyenne_note).toFixed(2))
			: 0;

		//// validation tribu-------
		let state_validation_tooltip = "";
		if (document.querySelector(".information_user_conected_jheo_js")) {
			state_validation_tooltip = this.stateValidationTooltipOnList(rubrique_type, id);
		}
		state_validation_tooltip = this.stateValidationTooltipOnList(rubrique_type, id);

		//// end of the validation ----------

		const image_a_la_une =
			"https://images.unsplash.com/photo-1592861956120-e524fc739696?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

		const item_rubrique = `
			<div class="card restaurant_${id}_jheo_js" style="max-width: 540px;">
				<div class="card-body">
					<div class="row g-0">
						<div class="col-12">
							<div class="d-flex align-items-center">
								<h5 class="card-title">${name_rubrique.toUpperCase()}</h5>
								${state_validation_tooltip}
							</div>
						</div>
					</div>
					<div class="row g-0">
						<div class="col-md-8">
							${this.cardItemRubriqueNameNoteAddress(nom, moyenne_note, adresse, { id, dep, type: "restaurant" })}
						</div>
						<div class="col-md-4">
							${this.cardItemRubriqueImage(image_a_la_une)}
						</div>
					</div>
				</div>
			</div>
		`;

		return item_rubrique;
	}

	setListItemRubriqueActiveFerme(item_data) {
		const rubrique_type = "ferme";

		const { id, name_rubrique, adresseFerme, nomFerme, dep } = item_data;
		const adresse = `${adresseFerme}`;
		const nom = nomFerme;

		const moyenne_note = item_data.hasOwnProperty("moyenne_note")
			? parseFloat(parseFloat(item_data.moyenne_note).toFixed(2))
			: 0;

		//// validation tribu-------
		let state_validation_tooltip = "";
		if (document.querySelector(".information_user_conected_jheo_js")) {
			state_validation_tooltip = this.stateValidationTooltipOnList(rubrique_type, id);
		}
		state_validation_tooltip = this.stateValidationTooltipOnList(rubrique_type, id);

		//// end of the validation ----------

		const image_a_la_une =
			"https://images.unsplash.com/photo-1674543548022-66a05fd5057e?q=80&w=1548&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

		const item_rubrique = `
			<div class="card resto_${id}_jheo_js" style="max-width: 540px;">
				<div class="card-body">
					<div class="row g-0">
						<div class="col-12">
							<div class="d-flex align-items-center">
								<h5 class="card-title">${name_rubrique.toUpperCase()}</h5>
								${state_validation_tooltip}
							</div>
						</div>
					</div>
					<div class="row g-0">
						<div class="col-md-8">
							${this.cardItemRubriqueNameNoteAddress(nom, moyenne_note, adresse, { id, dep, type: "ferme" })}
						</div>
						<div class="col-md-4">
							${this.cardItemRubriqueImage(image_a_la_une)}
						</div>
					</div>
				</div>
			</div>
		`;

		return item_rubrique;
	}

	setListItemRubriqueActiveStation(item_data) {
		const rubrique_type = "station";

		const { id, name_rubrique, adresse, nom, dep } = item_data;

		const moyenne_note = item_data.hasOwnProperty("moyenne_note")
			? parseFloat(parseFloat(item_data.moyenne_note).toFixed(2))
			: 0;

		//// validation tribu-------
		let state_validation_tooltip = "";
		if (document.querySelector(".information_user_conected_jheo_js")) {
			state_validation_tooltip = this.stateValidationTooltipOnList(rubrique_type, id);
		}
		state_validation_tooltip = this.stateValidationTooltipOnList(rubrique_type, id);

		//// end of the validation ----------

		const image_a_la_une =
			"https://images.unsplash.com/photo-1611159964154-831c28aa83bd?q=80&w=1587&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

		const item_rubrique = `
			<div class="card" style="max-width: 540px;">
				<div class="card-body">
					<div class="row g-0">
						<div class="col-12">
							<div class="d-flex align-items-center">
								<h5 class="card-title">${name_rubrique.toUpperCase()}</h5>
								${state_validation_tooltip}
							</div>
						</div>
					</div>
					<div class="row g-0">
						<div class="col-md-8">
							${this.cardItemRubriqueNameNoteAddress(nom, moyenne_note, adresse, { id, dep, type: "station" })}
						</div>
						<div class="col-md-4">
							${this.cardItemRubriqueImage(image_a_la_une)}
						</div>
					</div>
				</div>
			</div>
		`;

		return item_rubrique;
	}

	setListItemRubriqueActiveGolf(item_data) {
		const rubrique_type = "golf";

		const { id, name: nom, name_rubrique, adress: adresse, dep } = item_data;

		const moyenne_note = item_data.hasOwnProperty("moyenne_note")
			? parseFloat(parseFloat(item_data.moyenne_note).toFixed(2))
			: 0;

		//// validation tribu-------
		let state_validation_tooltip = "";
		if (document.querySelector(".information_user_conected_jheo_js")) {
			state_validation_tooltip = this.stateValidationTooltipOnList(rubrique_type, id);
		}
		state_validation_tooltip = this.stateValidationTooltipOnList(rubrique_type, id);

		//// end of the validation ----------

		const image_a_la_une =
			"https://images.unsplash.com/photo-1632946269126-0f8edbe8b068?q=80&w=1662&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

		const item_rubrique = `
			<div class="card" style="max-width: 540px;">
				<div class="card-body">
					<div class="row g-0">
						<div class="col-12">
							<div class="d-flex align-items-center">
								<h5 class="card-title">${name_rubrique.toUpperCase()}</h5>
								${state_validation_tooltip}
							</div>
						</div>
					</div>
					<div class="row g-0">
						<div class="col-md-8">
							${this.cardItemRubriqueNameNoteAddress(nom, moyenne_note, adresse, { id, dep, type: "golf" })}
						</div>
						<div class="col-md-4">
							${this.cardItemRubriqueImage(image_a_la_une)}
						</div>
					</div>
				</div>
			</div>
		`;

		return item_rubrique;
	}

	setListItemRubriqueActiveMarche(item_data) {
		const rubrique_type = "marche";

		const { id, denominationF, name_rubrique, adresse, dep } = item_data;
		const nom = denominationF;

		const moyenne_note = item_data.hasOwnProperty("moyenne_note")
			? parseFloat(parseFloat(item_data.moyenne_note).toFixed(2))
			: 0;

		//// validation tribu-------
		let state_validation_tooltip = "";
		if (document.querySelector(".information_user_conected_jheo_js")) {
			state_validation_tooltip = this.stateValidationTooltipOnList(rubrique_type, id);
		}
		state_validation_tooltip = this.stateValidationTooltipOnList(rubrique_type, id);

		//// end of the validation ----------

		const image_a_la_une =
			"https://media.sudouest.fr/8063523/1000x500/so-57ebc25866a4bd6726a44e7a-ph0.jpg?v=1408955534";

		const item_rubrique = `
			<div class="card" style="max-width: 540px;">
				<div class="card-body">
					<div class="row g-0">
						<div class="col-12">
							<div class="d-flex align-items-center">
								<h5 class="card-title">
									${name_rubrique.toUpperCase()}
								</h5>
								${state_validation_tooltip}
							</div>
						</div>
					</div>
					<div class="row g-0">
						<div class="col-md-8">
							${this.cardItemRubriqueNameNoteAddress(nom, moyenne_note, adresse, { id, dep, type: "marche" })}
						</div>
						<div class="col-md-4">
							${this.cardItemRubriqueImage(image_a_la_une)}
						</div>
					</div>
				</div>
			</div>
		`;

		return item_rubrique;
	}

	setListItemRubriqueActiveTabac(item_data) {
		const rubrique_type = "tabac";

		const {
			id,
			denomination_f: denominationF,
			name_rubrique,
			numvoie,
			typevoie,
			nomvoie,
			codpost,
			villenorm,
		} = item_data;
		const adresse = `${numvoie} ${typevoie} ${nomvoie} ${codpost} ${villenorm}`;
		const nom = denominationF;
		const moyenne_note = item_data.hasOwnProperty("moyenne_note")
			? parseFloat(parseFloat(item_data.moyenne_note).toFixed(2))
			: 0;

		//// validation tribu-------
		let state_validation_tooltip = "";
		if (document.querySelector(".information_user_conected_jheo_js")) {
			state_validation_tooltip = this.stateValidationTooltipOnList(rubrique_type, id);
		}
		state_validation_tooltip = this.stateValidationTooltipOnList(rubrique_type, id);

		//// end of the validation ----------

		const image_a_la_une =
			"https://images.unsplash.com/photo-1546484750-259a1104b00c?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

		const item_rubrique = `
			<div class="card" style="max-width: 540px;">
				<div class="card-body">
					<div class="row g-0">
						<div class="col-12">
							<div class="d-flex align-items-center">
								<h5 class="card-title">${name_rubrique.toUpperCase()}</h5>
								${state_validation_tooltip}
							</div>
						</div>
					</div>
					<div class="row g-0">
						<div class="col-md-8">
							${this.cardItemRubriqueNameNoteAddress(nom, moyenne_note, adresse, { id, type: "tabac" })}
						</div>
						<div class="col-md-4">
							${this.cardItemRubriqueImage(image_a_la_une)}
						</div>
					</div>
				</div>
			</div>
		`;

		return item_rubrique;
	}

	generateTableDataFiltered(ratioMin, ratioMax, ratio) {
		const zoom = this.map._zoom;
		const current_object_dataMax = this.objectRatioAndDataMax.find((item) => zoom >= parseInt(item.zoomMin));
		const { dataMax } = current_object_dataMax;

		const dataFiltered = [];

		let iterate_ratio = 1 / 10 ** ratio;

		let init_iterate_ratio = ratioMin;

		while (
			parseFloat(init_iterate_ratio.toFixed(ratio)) <
			parseFloat(parseFloat(ratioMax + iterate_ratio).toFixed(ratio))
		) {
			if (!dataFiltered.some((jtem) => parseFloat(init_iterate_ratio.toFixed(ratio)) === parseFloat(jtem.lat))) {
				dataFiltered.push({
					dataMax: dataMax,
					ratio: ratio,
					lat: parseFloat(init_iterate_ratio.toFixed(ratio)).toString(),
					data: [],
					markers: [],
				});
			}

			init_iterate_ratio += iterate_ratio;
		}

		return dataFiltered;
	}

	updateMapAddRubrique(rubrique_type) {
		///get rubrique object.
		const rubrique_type_object = this.allRubriques.find((item) => item.api_name === rubrique_type);

		///get the number element active
		const rubrique_active = this.allRubriques.filter((item) => item.is_active === true);
		const rubrique_active_length = rubrique_active.length;

		/// state of the data by the zoom level.
		const zoom = this.map._zoom;
		const current_object_dataMax = this.objectRatioAndDataMax.find((item) => zoom >= parseInt(item.zoomMin));

		const { dataMax, ratio } = current_object_dataMax;

		/// bound map size.
		const x = this.getMax(this.map.getBounds().getWest(), this.map.getBounds().getEast()); ///lat
		const y = this.getMax(this.map.getBounds().getNorth(), this.map.getBounds().getSouth()); ///lng

		//// marker dictionnary
		this.markers_display =
			this.markers_display.length === 0 /// [ { lat: ( with ratio ), data: [] } ]
				? this.generateTableDataFiltered(y.min, y.max, ratio)
				: this.markers_display;

		///all data fetching...
		const data_rubrique_add = this.defaultData[rubrique_type]["data"];

		data_rubrique_add?.forEach((item) => {
			if (rubrique_type_object.checkIsMuchOnFilter(item)) {
				//// current lat related to the ratio level
				const lat_item = parseFloat(item.lat).toFixed(ratio);

				////
				const data_filter_state = this.markers_display.find(
					(jtem) => jtem.lat.toString() === parseFloat(lat_item).toString()
				);

				if (data_filter_state) {
					//// count marker already display related by the type.
					const item_rubrique_count = data_filter_state.data.reduce((sum, item) => {
						if (item.rubrique_type === rubrique_type) {
							return sum + 1;
						}
						return sum;
					}, 0);

					if (item_rubrique_count < dataMax) {
						const lng_item = parseFloat(item.long).toFixed(ratio);

						if (x.min <= lng_item && x.max >= lng_item) {
							rubrique_type_object.setSingleMarker(item);

							this.markers_display = this.markers_display.map((ktem) => {
								if (ktem.lat.toString() === parseFloat(lat_item).toString()) {
									ktem.data.push({ ...item, rubrique_type: rubrique_type });
								}
								return ktem;
							});
						}
					}
				}
			}
		});
	}

	setMiniFicheGlobal(type, nom, departement, adresse) {
		const mini_fiche_global = `
			<span> 
				${type}: <span class="badge bg-info text-dark">${nom}</span>
			</span>
			<br>
			<span>
				Departement: <span class="badge bg-info text-dark">${departement}</span>
			</span>
			<br>
			<span>
				Adresse:<br>
				<span class="badge bg-warning text-dark">${adresse}</span>
			</span>
		`;

		return mini_fiche_global;
	}

	/**
	 * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
	 *
	 * save marker display to optimize whene remove marker from the.markers
	 *
	 * @whereIUseIt [
	 * 	this.setSingleMarkerResto,
	 * 	this.setSingleMarkerFerme,
	 * 	this.setSingleMarkerStation,
	 * 	this.setSingleMarkerGolf,
	 * 	this.setSingleMarkerTabac,
	 * 	this.setSingleMarkerMarche,
	 * ]
	 * @param {*} item
	 * @param {*} marker
	 */
	saveMarkerDisplay(item, marker) {
		const zoom = this.map._zoom;
		const current_object_dataMax = this.objectRatioAndDataMax.find(
			(item_objet) => zoom >= parseInt(item_objet.zoomMin)
		);
		const { ratio } = current_object_dataMax;
		const lat_item = parseFloat(item.lat).toFixed(ratio);

		this.markers_display = this.markers_display.map((ktem) => {
			if (ktem.lat.toString() === parseFloat(lat_item).toString()) {
				ktem.markers.push(marker);
			}
			return ktem;
		});
	}

	setMiniFicheResto(nom, departement, adresse, options = {}) {
		const mini_fiche = `
			<button type="button" class="btn btn-primary btn-sm m-1" style="text-align: start;">
				${this.setMiniFicheGlobal("Restaurant", nom, departement, adresse)}
			</button>
		`;

		return mini_fiche;
	}

	setSingleMarkerResto(item, options = {}) {
		const rubrique_type = "restaurant";

		const rubrique_type_object = this.allRubriques.find((item) => item.api_name === rubrique_type);
		const icon = rubrique_type_object.poi_icon.not_selected;

		let poi_options = rubrique_type_object.getOptionPastille(item);

		//// Validation state ----------------------
		// const tab_rand = Object.keys(this.validation_color);
		// const validation_key = tab_rand[Math.floor(Math.random() * tab_rand.length)];

		// let validation_color = this.validation_color[validation_key]["className"];

		let validation = this.getStateValidationTooltip(rubrique_type, item.id);
		if (validation !== null) {
			poi_options = {
				...poi_options,
				validation: {
					className: validation["className"],
				},
			};
		}
		//// -----------------------

		let marker = this.newMarkerPOI(rubrique_type_object.api_name, item, icon, poi_options);

		const mini_fiche = rubrique_type_object.setMiniFiche(
			item.denominationF,
			item.depName,
			`${item.numvoie} ${item.typevoie} ${item.nomvoie} ${item.codpost} ${item.villenorm}`
		);

		marker.bindTooltip(mini_fiche, { direction: "auto", offset: L.point(20, -30) }).openTooltip();

		this.markers.addLayer(marker);

		this.bindEventClickOnMarker(marker, item);

		this.saveMarkerDisplay(item, marker);
	}

	getLegendIconResto() {
		const rubrique_type_object = this.allRubriques.find((item) => item.api_name === "restaurant");

		const object_icon = [
			{ icon: rubrique_type_object.poi_icon.not_selected, name: "Restaurant non séléctionnée", description: "" },
			{ icon: rubrique_type_object.poi_icon.selected, name: "Restaurant séléctionnée", description: "" },
			{
				icon: rubrique_type_object.poi_icon.selected,
				name: "Restaurant pastillée vert",
				description: "Avoir un tribu qui pastille",
				color: "green",
			},
			{
				icon: rubrique_type_object.poi_icon.selected,
				name: "Restaurant pastillée rouge",
				description: "Avoir au minimun deux tribus qui pastille",
				color: "red",
			},
		];

		let resulthtml = "";

		object_icon.forEach((item_object_icon) => {
			const path_icon = IS_DEV_MODE ? `/${item_object_icon.icon}` : `/public/${item_object_icon.icon}`;

			let style_image = `width:12pxpx;height:15px;`;

			let point_pastille = "";
			if (item_object_icon.color != undefined) {
				let style_m_poi_pas = `width:11px!important;`;
				style_m_poi_pas = `${style_m_poi_pas}height:11px!important;`;
				style_m_poi_pas = `${style_m_poi_pas}left:21%!important;`;
				style_m_poi_pas = `${style_m_poi_pas}top:6%!important;`;

				let color_pastille = item_object_icon.color;

				point_pastille = `<div class="single_marker_point_pastille" data-pastille-type="${color_pastille}" style="background-color:${color_pastille};${style_m_poi_pas}"></div>`;
			}

			let description = "";
			if (item_object_icon.description !== "") {
				description = `
					<span style="font-size: 0.9rem;font-style: italic;">
						${item_object_icon.description}
					</span>
				`;
			}

			resulthtml += `
				<li class="list-group-item">
					<div class="content_single_marker_poi">
						<div class="single_marker_poi">
							${point_pastille}
							<img class="single_marker_image" style="${style_image}" src="${path_icon}"/>
							<div class="single_marker_note">0.0</div>
						</div>
					</div>
					<div>
						${item_object_icon.name}. <br>
						${description}
					</div>
				</li>
			`;
		});

		return resulthtml;
	}

	specifiqueFilterResto() {
		const rubrique_type_object = this.allRubriques.find((item) => item.api_name === "restaurant");

		const identifiant_slyder = "fourchette_prix_resto";

		const { produit, price_produit } = rubrique_type_object.filter.specifique;

		injectFilterProduitResto(identifiant_slyder, produit);
		this.activeSlidePriceCarburantResto(identifiant_slyder, price_produit);
	}

	getStateSpecificFilterResto() {
		const rubrique_type_object = this.allRubriques.find((item) => item.api_name === "restaurant");
		const {
			filter: { specifique: rubrique_specifique_filter },
		} = rubrique_type_object;

		const state_specifique_filter = { ...rubrique_specifique_filter };

		const identifiant_slyder = "fourchette_prix_resto";

		const slider_fourchette_prix = document.getElementById(`${identifiant_slyder}_jheo_js`);
		const slider_price_fourchette_prix = slider_fourchette_prix.noUiSlider.get();

		state_specifique_filter["price_produit"] = {
			...state_specifique_filter["price_produit"],
			min: parseFloat(slider_price_fourchette_prix[0]),
			max: parseFloat(slider_price_fourchette_prix[1]),
		};

		for (var name_produit in rubrique_specifique_filter.produit) {
			const checkbox_produit = document.getElementById(`${name_produit}_toggle_jheo_js`).checked;
			state_specifique_filter["produit"][name_produit] = {
				...state_specifique_filter["produit"][name_produit],
				is_filtered: checkbox_produit,
			};
		}

		return state_specifique_filter;
	}

	resetSpecificFilterResto() {
		this.allRubriques = this.allRubriques.map((rubrique) => {
			if (rubrique.api_name === "restaurant") {
				rubrique.filter.specifique = {
					...rubrique.filter.specifique,
					produit: {
						restaurant: { is_filtered: false, prix: 0 },
						brasserie: { is_filtered: false, prix: 0 },
						fast_food: { is_filtered: false, prix: 0 },
						pizzeria: { is_filtered: false, prix: 0 },
						boulangerie: { is_filtered: false, prix: 0 },
						bar: { is_filtered: false, prix: 0 },
						cafe: { is_filtered: false, prix: 0 },
						salon_the: { is_filtered: false, prix: 0 },
						cuisine_monde: { is_filtered: false, prix: 0 },
					},
					price_produit: {
						...rubrique.filter.specifique.price_produit,
						min: rubrique.filter.specifique.price_produit.min_default,
						max: rubrique.filter.specifique.price_produit.max_default,
					},
				};
			}
			return rubrique;
		});

		const rubrique_type_object = this.allRubriques.find((item) => item.api_name === "restaurant");
		const { price_produit, produit } = rubrique_type_object.filter.specifique;

		const { min_default, max_default } = price_produit;

		resetSliderCustomise("fourchette_prix_resto", { min: min_default, max: max_default });

		for (var name_produit in produit) {
			document.getElementById(`${name_produit}_toggle_jheo_js`).checked = produit[name_produit]["is_filtered"];
		}
	}

	//// polymorphisme check the filter
	checkIsMuchOnFilterResto(item) {
		const rubrique_type_object = this.allRubriques.find((item) => item.api_name === "restaurant");
		if (!rubrique_type_object.filter.is_filtered) {
			return true;
		}

		let result = false;

		result = this.checkIsMuchOnFilterCommon("restaurant", item);

		const rubrique_typeo_object_filter = rubrique_type_object.filter.specifique.produit;

		const object_filter_key_transform = {};

		for (let name_produit in rubrique_typeo_object_filter) {
			var name_produit_state = rubrique_typeo_object_filter[name_produit]["is_filtered"];
			object_filter_key_transform[name_produit.split("_").join("")] = name_produit_state;
		}

		for (let key_item in item) {
			if (
				object_filter_key_transform.hasOwnProperty(key_item.toLowerCase()) &&
				object_filter_key_transform[key_item.toLowerCase()] === true
			) {
				if (!!parseInt(item[key_item]) === !!object_filter_key_transform[key_item.toLowerCase()]) {
					result = result && true;
				} else {
					result = false;
				}
			}
		}

		const rubrique_filter_price_produit = rubrique_type_object.filter.specifique.price_produit;

		if (item.fourchettePrix1 !== "") {
			const fourchette_price = item.fourchettePrix1.split("-");

			const item_price_min = parseInt(fourchette_price[0]);
			const item_price_max = parseInt(fourchette_price[1]);

			if (
				rubrique_filter_price_produit.min <= item_price_min &&
				item_price_max <= rubrique_filter_price_produit.max
			) {
				result = result && true;
			} else {
				result = false;
			}
		} else {
			if (
				rubrique_filter_price_produit.min === rubrique_filter_price_produit.min_default &&
				rubrique_filter_price_produit.max === rubrique_filter_price_produit.max_default
			) {
				result = result && true;
			} else {
				return false;
			}
		}

		return result;
	}

	setMiniFicheFerme(nom, departement, adresse, options = {}) {
		const mini_fiche = `
			<button type="button" class="btn btn-primary btn-sm m-1" style="text-align: start;">
				${this.setMiniFicheGlobal("Ferme", nom, departement, adresse)}
			</button>
		`;

		return mini_fiche;
	}

	getLegendIconFerme() {
		const rubrique_type_object = this.allRubriques.find((item) => item.api_name === "ferme");

		const object_icon = [
			{ icon: rubrique_type_object.poi_icon.not_selected, name: "Ferme non séléctionnée", description: "" },
			{ icon: rubrique_type_object.poi_icon.selected, name: "Ferme séléctionnée", description: "" },
		];

		let resulthtml = "";

		object_icon.forEach((item_object_icon) => {
			const path_icon = IS_DEV_MODE ? `/${item_object_icon.icon}` : `/public/${item_object_icon.icon}`;

			let style_image = `width:12pxpx;height:15px;`;

			let point_pastille = "";
			if (item_object_icon.color != undefined) {
				let style_m_poi_pas = `width:11px!important;`;
				style_m_poi_pas = `${style_m_poi_pas}height:11px!important;`;
				style_m_poi_pas = `${style_m_poi_pas}left:21%!important;`;
				style_m_poi_pas = `${style_m_poi_pas}top:6%!important;`;

				let color_pastille = item_object_icon.color;

				point_pastille = `<div class="single_marker_point_pastille" data-pastille-type="${color_pastille}" style="background-color:${color_pastille};${style_m_poi_pas}"></div>`;
			}

			let description = "";
			if (item_object_icon.description !== "") {
				description = `
					<span style="font-size: 0.9rem;font-style: italic;">
						${item_object_icon.description}
					</span>
				`;
			}

			resulthtml += `
				<li class="list-group-item">
					<div class="content_single_marker_poi">
						<div class="single_marker_poi">
							${point_pastille}
							<img class="single_marker_image" style="${style_image}" src="${path_icon}"/>
							<div class="single_marker_note">0.0</div>
						</div>
					</div>
					<div>
						${item_object_icon.name}. <br>
						${description}
					</div>
				</li>
			`;
		});

		return resulthtml;
	}

	setSingleMarkerFerme(item, options = {}) {
		const rubrique_type = "ferme";

		const rubrique_type_object = this.allRubriques.find((item) => item.api_name === "ferme");
		const icon = rubrique_type_object.poi_icon.not_selected;

		let poi_options = rubrique_type_object.getOptionPastille();

		//// Validation state ----------------------
		// const tab_rand = Object.keys(this.validation_color);
		// const validation_key = tab_rand[Math.floor(Math.random() * tab_rand.length)];

		// let validation_color = this.validation_color[validation_key]["className"];
		let validation = this.getStateValidationTooltip(rubrique_type, item.id);
		if (validation !== null) {
			poi_options = {
				...poi_options,
				validation: {
					className: validation["className"],
				},
			};
		}
		//// -----------------------

		let marker = this.newMarkerPOI(rubrique_type_object.api_name, item, icon, poi_options);

		const mini_fiche = rubrique_type_object.setMiniFiche(item.nomFerme, item.departement, item.adresseFerme);

		marker.bindTooltip(mini_fiche, { direction: "auto", offset: L.point(0, -30) }).openTooltip();

		this.markers.addLayer(marker);

		this.bindEventClickOnMarker(marker, item);

		this.saveMarkerDisplay(item, marker);
	}

	specifiqueFilterFerme() {
		console.log("specifiqueFilterFerme...");
	}

	getStateSpecificFilterFerme() {
		console.log("getStateSpecificFilterFerme...");
		return {};
	}

	resetSpecificFilterFerme() {
		console.log("resetSpecificFilterFerme...");
		return {};
	}

	checkIsMuchOnFilterFerme(item) {
		return this.checkIsMuchOnFilterCommon("ferme", item);
	}

	setMiniFicheStation(nom, departement, adresse, options = {}) {
		let spec_other_options = "";
		if (Object.keys(options).length != 0) {
			for (const key of Object.keys(options)) {
				if (parseFloat(options[key]) != 0) {
					spec_other_options += `
						<span class="badge rounded-pill bg-secondary me-1">
							${key.replace("prix", "Prix ")}: € ${options[key]}
						</span>
						<br>
					`;
				}
			}
		}

		const mini_fiche = `
			<button type="button" class="btn btn-primary btn-sm m-1" style="text-align: start;">
				${this.setMiniFicheGlobal("Station", nom, departement, adresse)}
				<hr>
				<div class="d-flex justify-content-start align-items-center flex-wrap mt-1">
					${spec_other_options}
				</div>
			</button>
		`;

		return mini_fiche;
	}

	getLegendIconStation() {
		const rubrique_type_object = this.allRubriques.find((item) => item.api_name === "station");

		const object_icon = [
			{ icon: rubrique_type_object.poi_icon.not_selected, name: "Station non séléctionnée", description: "" },
			{ icon: rubrique_type_object.poi_icon.selected, name: "Station séléctionnée", description: "" },
		];

		let resulthtml = "";

		object_icon.forEach((item_object_icon) => {
			const path_icon = IS_DEV_MODE ? `/${item_object_icon.icon}` : `/public/${item_object_icon.icon}`;

			let style_image = `width:12pxpx;height:15px;`;

			let point_pastille = "";
			if (item_object_icon.color != undefined) {
				let style_m_poi_pas = `width:11px!important;`;
				style_m_poi_pas = `${style_m_poi_pas}height:11px!important;`;
				style_m_poi_pas = `${style_m_poi_pas}left:21%!important;`;
				style_m_poi_pas = `${style_m_poi_pas}top:6%!important;`;

				let color_pastille = item_object_icon.color;

				point_pastille = `<div class="single_marker_point_pastille" data-pastille-type="${color_pastille}" style="background-color:${color_pastille};${style_m_poi_pas}"></div>`;
			}

			let description = "";
			if (item_object_icon.description !== "") {
				description = `
					<span style="font-size: 0.9rem;font-style: italic;">
						${item_object_icon.description}
					</span>
				`;
			}

			resulthtml += `
				<li class="list-group-item">
					<div class="content_single_marker_poi">
						<div class="single_marker_poi">
							${point_pastille}
							<img class="single_marker_image" style="${style_image}" src="${path_icon}"/>
							<div class="single_marker_note">0.0</div>
						</div>
					</div>
					<div>
						${item_object_icon.name}. <br>
						${description}
					</div>
				</li>
			`;
		});

		return resulthtml;
	}

	setSingleMarkerStation(item, options = {}) {
		const rubrique_type = "station";

		const rubrique_type_object = this.allRubriques.find((item) => item.api_name === "station");
		const icon = rubrique_type_object.poi_icon.not_selected;

		let poi_options = rubrique_type_object.getOptionPastille(item);

		//// Validation state ----------------------
		// const tab_rand = Object.keys(this.validation_color);
		// const validation_key = tab_rand[Math.floor(Math.random() * tab_rand.length)];

		// let validation_color = this.validation_color[validation_key]["className"];
		let validation = this.getStateValidationTooltip(rubrique_type, item.id);
		if (validation !== null) {
			poi_options = {
				...poi_options,
				validation: {
					className: validation["className"],
				},
			};
		}
		//// -----------------------

		let marker = this.newMarkerPOI(rubrique_type_object.api_name, item, icon, poi_options);

		const mini_fiche = rubrique_type_object.setMiniFiche(
			item.nom,
			`${item.departementCode} ${item.departementName}`,
			item.adresse,
			{
				prixE85: item.prixE85,
				prixGplc: item.prixGplc,
				prixSp95: item.prixSp95,
				prixSp95E10: item.prixSp95E10,
				prixGasoil: item.prixGasoil,
				prixSp98: item.prixSp98,
			}
		);

		marker.bindTooltip(mini_fiche, { direction: "top", offset: L.point(0, -30) }).openTooltip();

		this.markers.addLayer(marker);

		this.bindEventClickOnMarker(marker, item);

		this.saveMarkerDisplay(item, marker);
	}

	setMiniFicheTabac(nom, departement, adresse, options = {}) {
		const mini_fiche = `
			<button type="button" class="btn btn-primary btn-sm m-1" style="text-align: start;">
				${this.setMiniFicheGlobal("Tabac", nom, departement, adresse)}
			</button>
		`;

		return mini_fiche;
	}

	getLegendIconTabac() {
		const rubrique_type_object = this.allRubriques.find((item) => item.api_name === "tabac");

		const object_icon = [
			{ icon: rubrique_type_object.poi_icon.not_selected, name: "Tabac non séléctionnée", description: "" },
			{ icon: rubrique_type_object.poi_icon.selected, name: "Tabac séléctionnée", description: "" },
		];

		let resulthtml = "";

		object_icon.forEach((item_object_icon) => {
			const path_icon = IS_DEV_MODE ? `/${item_object_icon.icon}` : `/public/${item_object_icon.icon}`;

			let style_image = `width:12pxpx;height:15px;`;

			let point_pastille = "";
			if (item_object_icon.color != undefined) {
				let style_m_poi_pas = `width:11px!important;`;
				style_m_poi_pas = `${style_m_poi_pas}height:11px!important;`;
				style_m_poi_pas = `${style_m_poi_pas}left:21%!important;`;
				style_m_poi_pas = `${style_m_poi_pas}top:6%!important;`;

				let color_pastille = item_object_icon.color;

				point_pastille = `<div class="single_marker_point_pastille" data-pastille-type="${color_pastille}" style="background-color:${color_pastille};${style_m_poi_pas}"></div>`;
			}

			let description = "";
			if (item_object_icon.description !== "") {
				description = `
					<span style="font-size: 0.9rem;font-style: italic;">
						${item_object_icon.description}
					</span>
				`;
			}

			resulthtml += `
				<li class="list-group-item">
					<div class="content_single_marker_poi">
						<div class="single_marker_poi">
							${point_pastille}
							<img class="single_marker_image" style="${style_image}" src="${path_icon}"/>
							<div class="single_marker_note">0.0</div>
						</div>
					</div>
					<div>
						${item_object_icon.name}. <br>
						${description}
					</div>
				</li>
			`;
		});

		return resulthtml;
	}

	setSingleMarkerTabac(item, options = {}) {
		const rubrique_type = "tabac";

		const rubrique_type_object = this.allRubriques.find((item) => item.api_name === "tabac");
		const icon = rubrique_type_object.poi_icon.not_selected;

		let poi_options = rubrique_type_object.getOptionPastille(item);

		//// Validation state ----------------------
		// const tab_rand = Object.keys(this.validation_color);
		// const validation_key = tab_rand[Math.floor(Math.random() * tab_rand.length)];

		// let validation_color = this.validation_color[validation_key]["className"];
		let validation = this.getStateValidationTooltip(rubrique_type, item.id);
		if (validation !== null) {
			poi_options = {
				...poi_options,
				validation: {
					className: validation["className"],
				},
			};
		}
		//// -----------------------

		let marker = this.newMarkerPOI(rubrique_type_object.api_name, item, icon, poi_options);

		const miniFiche = rubrique_type_object.setMiniFiche(
			item.name,
			`${item.dep} ${item.depName}`,
			`${item.numvoie} ${item.typevoie} ${item.nomvoie} ${item.codpost} ${item.villenorm}`
		);

		marker.bindTooltip(miniFiche, { direction: "top", offset: L.point(20, -30) }).openTooltip();

		this.markers.addLayer(marker);

		this.bindEventClickOnMarker(marker, item);

		this.saveMarkerDisplay(item, marker);
	}

	specifiqueFilterTabac() {
		console.log("specifiqueFilterTabac...");
	}

	getStateSpecificFilterTabac() {
		console.log("getStateSpecificFilterTabac...");
		return {};
	}

	resetSpecificFilterTabac() {
		console.log("resetSpecificFilterTabac...");
	}

	checkIsMuchOnFilterTabac(item) {
		return this.checkIsMuchOnFilterCommon("tabac", item);
	}

	setMiniFicheMarche(nom, departement, adresse, options = {}) {
		const mini_fiche = `
			<button type="button" class="btn btn-primary btn-sm m-1" style="text-align: start;">
				${this.setMiniFicheGlobal("Tabac", nom, departement, adresse)}
			</button>
		`;

		return mini_fiche;
	}

	getLegendIconMarche() {
		const rubrique_type_object = this.allRubriques.find((item) => item.api_name === "marche");

		const object_icon = [
			{ icon: rubrique_type_object.poi_icon.not_selected, name: "Marché non séléctionnée", description: "" },
			{ icon: rubrique_type_object.poi_icon.selected, name: "Marché séléctionnée", description: "" },
		];

		let resulthtml = "";

		object_icon.forEach((item_object_icon) => {
			const path_icon = IS_DEV_MODE ? `/${item_object_icon.icon}` : `/public/${item_object_icon.icon}`;

			let style_image = `width:12pxpx;height:15px;`;

			let point_pastille = "";
			if (item_object_icon.color != undefined) {
				let style_m_poi_pas = `width:11px!important;`;
				style_m_poi_pas = `${style_m_poi_pas}height:11px!important;`;
				style_m_poi_pas = `${style_m_poi_pas}left:21%!important;`;
				style_m_poi_pas = `${style_m_poi_pas}top:6%!important;`;

				let color_pastille = item_object_icon.color;

				point_pastille = `<div class="single_marker_point_pastille" data-pastille-type="${color_pastille}" style="background-color:${color_pastille};${style_m_poi_pas}"></div>`;
			}

			let description = "";
			if (item_object_icon.description !== "") {
				description = `
					<span style="font-size: 0.9rem;font-style: italic;">
						${item_object_icon.description}
					</span>
				`;
			}

			resulthtml += `
				<li class="list-group-item">
					<div class="content_single_marker_poi">
						<div class="single_marker_poi">
							${point_pastille}
							<img class="single_marker_image" style="${style_image}" src="${path_icon}"/>
							<div class="single_marker_note">0.0</div>
						</div>
					</div>
					<div>
						${item_object_icon.name}. <br>
						${description}
					</div>
				</li>
			`;
		});

		return resulthtml;
	}

	setSingleMarkerMarche(item, options = {}) {
		const rubrique_type = "marche";

		const rubrique_type_object = this.allRubriques.find((item) => item.api_name === rubrique_type);
		const icon = rubrique_type_object.poi_icon.not_selected;

		let poi_options = rubrique_type_object.getOptionPastille(item);

		if (options && options.hasOwnProperty("isPedding")) {
			poi_options = {
				...poi_options,
				...options,
			};
		}

		const data = this.defaultData[rubrique_type];
		if (data.hasOwnProperty("options")) {
			const data_options = data["options"];
			if (data_options.hasOwnProperty("validation")) {
				poi_options = {
					...poi_options,
					...data_options.validation,
				};
			}
		}

		//// Validation state ----------------------
		// const tab_rand = Object.keys(this.validation_color);
		// const validation_key = tab_rand[Math.floor(Math.random() * tab_rand.length)];

		// let validation_color = this.validation_color[validation_key]["className"];
		let validation = this.getStateValidationTooltip(rubrique_type, item.id);
		if (validation !== null) {
			poi_options = {
				...poi_options,
				validation: {
					className: validation["className"],
				},
			};
		}
		//// -----------------------

		let marker = this.newMarkerPOI(rubrique_type_object.api_name, item, icon, poi_options);

		const miniFiche = rubrique_type_object.setMiniFiche(item.denominationF, item.dep, item.adresse);

		marker.bindTooltip(miniFiche, { direction: "top", offset: L.point(20, -30) }).openTooltip();

		this.markers.addLayer(marker);

		this.bindEventClickOnMarker(marker, item);

		this.saveMarkerDisplay(item, marker);
	}

	specifiqueFilterMarche() {
		console.log("specifiqueFilterMarche...");
	}

	getStateSpecificFilterMarche() {
		console.log("getStateSpecificFilterMarche...");
		return {};
	}

	resetSpecificFilterMarche() {
		console.log("resetSpecificFilterMarche...");
		return {};
	}

	checkIsMuchOnFilterMarche(item) {
		return this.checkIsMuchOnFilterCommon("marche", item);
	}

	setMiniFicheGolf(nom, departement, adresse, options = {}) {
		const mini_fiche = `
			<button type="button" class="btn btn-primary btn-sm m-1" style="text-align: start;">
				${this.setMiniFicheGlobal("Tabac", nom, departement, adresse)}
			</button>
		`;

		return mini_fiche;
	}

	getLegendIconGolf() {
		const rubrique_type_object = this.allRubriques.find((item) => item.api_name === "golf");

		const object_icon = [
			{ icon: rubrique_type_object.poi_icon.not_selected, name: "Golf non séléctionnée", description: "" },
			{ icon: rubrique_type_object.poi_icon.selected, name: "Golf séléctionnée", description: "" },
			{ icon: rubrique_type_object.poi_icon.selected, name: "Golf a faire", description: "", color: "orange" },
			{ icon: rubrique_type_object.poi_icon.selected, name: "Golf fait", description: "", color: "blue" },
			{ icon: rubrique_type_object.poi_icon.selected, name: "Golf a refaire", description: "", color: "green" },
		];

		let resulthtml = "";

		object_icon.forEach((item_object_icon) => {
			const path_icon = IS_DEV_MODE ? `/${item_object_icon.icon}` : `/public/${item_object_icon.icon}`;

			let style_image = `width:12pxpx;height:15px;`;

			let point_pastille = "";
			if (item_object_icon.color != undefined) {
				let style_m_poi_pas = `width:11px!important;`;
				style_m_poi_pas = `${style_m_poi_pas}height:11px!important;`;
				style_m_poi_pas = `${style_m_poi_pas}left:21%!important;`;
				style_m_poi_pas = `${style_m_poi_pas}top:6%!important;`;

				let color_pastille = item_object_icon.color;

				point_pastille = `<div class="single_marker_point_pastille" data-pastille-type="${color_pastille}" style="background-color:${color_pastille};${style_m_poi_pas}"></div>`;
			}

			let description = "";
			if (item_object_icon.description !== "") {
				description = `
					<span style="font-size: 0.9rem;font-style: italic;">
						${item_object_icon.description}
					</span>
				`;
			}

			resulthtml += `
				<li class="list-group-item">
					<div class="content_single_marker_poi">
						<div class="single_marker_poi">
							${point_pastille}
							<img class="single_marker_image" style="${style_image}" src="${path_icon}"/>
							<div class="single_marker_note">0.0</div>
						</div>
					</div>
					<div>
						${item_object_icon.name}. <br>
						${description}
					</div>
				</li>
			`;
		});

		return resulthtml;
	}

	settingSingleMarkerGolf(item, options = {}) {
		const rubrique_type = "golf";

		const rubrique_type_object = this.allRubriques.find((item) => item.api_name === "golf");
		const icon = rubrique_type_object.poi_icon.not_selected;

		let poi_options = rubrique_type_object.getOptionPastille(item);

		//// Validation state ----------------------
		// const tab_rand = Object.keys(this.validation_color);
		// const validation_key = tab_rand[Math.floor(Math.random() * tab_rand.length)];

		// let validation_color = this.validation_color[validation_key]["className"];
		let validation = this.getStateValidationTooltip(rubrique_type, item.id);
		if (validation !== null) {
			poi_options = {
				...poi_options,
				validation: {
					className: validation["className"],
				},
			};
		}
		//// -----------------------

		let marker = this.newMarkerPOI(rubrique_type_object.api_name, item, icon, poi_options);

		const miniFiche = rubrique_type_object.setMiniFiche(
			item.name,
			`${item.dep} ${item.nom_dep}`,
			`${item.commune} ${item.adress}`
		);

		marker.bindTooltip(miniFiche, { direction: "top", offset: L.point(20, -30) }).openTooltip();

		this.markers.addLayer(marker);

		this.bindEventClickOnMarker(marker, item);

		this.saveMarkerDisplay(item, marker);
	}

	specifiqueFilterGolf() {
		console.log("specifiqueFilterGolf...");
	}

	getStateSpecificFilterGolf() {
		console.log("getStateSpecificFilterGolf...");
		return {};
	}

	resetSpecificFilterGolf() {
		console.log("resetSpecificFilterGolf...");
	}

	checkIsMuchOnFilterGolf(item) {
		return this.checkIsMuchOnFilterCommon("golf", item);
	}

	newMarkerPOI(rubrique_type, singleData, poi_icon, options = {}) {
		const note = singleData.hasOwnProperty("moyenne_note") ? parseFloat(singleData.moyenne_note).toFixed(1) : "0.0";

		let isPedding = false;
		if (options && options.hasOwnProperty("isPedding")) {
			isPedding = options.isPedding;
		}

		return new L.Marker(L.latLng(parseFloat(singleData.lat), parseFloat(singleData.long)), {
			icon: this.setDivIconMarker(poi_icon, note, options),
			id: singleData.id,
			type: rubrique_type,
			draggable: false,
			isPedding: isPedding,
		});
	}

	setDivIconMarker(poi_icon, note, options = {}) {
		const path_icon = IS_DEV_MODE ? `/${poi_icon}` : `/public/${poi_icon}`;

		///-----
		let class_indicator_poi = "";
		if (options && options.hasOwnProperty("validation")) {
			class_indicator_poi = options["validation"]["className"];
		}
		//// -------

		const zoom_size = { min: this.zoom_min, max: this.zoom_max };
		const zoom = this.map._zoom;

		const w_m_poi_size = { min: 50, max: 75 };
		const h_m_poi_size = { min: 20, max: 38 };
		const rad_m_poi_size = { min: 10, max: 20 };

		let w_m_poi = calculeProgression(w_m_poi_size, zoom_size, zoom);
		let h_m_poi = calculeProgression(h_m_poi_size, zoom_size, zoom);
		let br_m_poi = calculeProgression(rad_m_poi_size, zoom_size, zoom);

		let style_m_poi = `width:${w_m_poi.toFixed(1)}px!important;`;
		style_m_poi = `${style_m_poi}height:${h_m_poi.toFixed(1)}px!important;`;
		style_m_poi = `${style_m_poi}border-radius:${br_m_poi.toFixed(1)}px!important;`;

		const w_image_size = { min: 12, max: 34 };
		const h_image_size = { min: 15, max: 40 };

		let w_image = calculeProgression(w_image_size, zoom_size, zoom);
		let h_image = calculeProgression(h_image_size, zoom_size, zoom);
		let style_image = `width:${w_image}px;height:${h_image}px;`;

		const pb_m_point_size = { min: 104, max: 297 };
		const wh_m_point_size = { min: 9, max: 21 };

		let wh_m_point = calculeProgression(wh_m_point_size, zoom_size, zoom);
		let pb_m_point = calculeProgression(pb_m_point_size, zoom_size, zoom);

		let style_marker_point = `width:${wh_m_point.toFixed(1)}px!important;`;
		style_marker_point = `${style_marker_point}height:${wh_m_point.toFixed(1)}px!important;`;
		style_marker_point = `${style_marker_point}bottom:-${pb_m_point.toFixed(1)}%!important;`;
		style_marker_point = `${style_marker_point}border-top-color:white!important;`;
		style_marker_point = `${style_marker_point}border-left-color:white!important;`;

		let point_pastille = "";
		if (options?.isPastille) {
			const wh_m_poi_pas_size = { min: 7, max: 12 };
			const left_pos_m_poi_size = { min: 342, max: 482 };

			let wh_m_poi_pas = calculeProgression(wh_m_poi_pas_size, zoom_size, zoom);
			let left_pos_m_poi = calculeProgression(left_pos_m_poi_size, zoom_size, zoom);

			let style_m_poi_pas = `width:${wh_m_poi_pas.toFixed(1)}px!important;`;
			style_m_poi_pas = `${style_m_poi_pas}height:${wh_m_poi_pas.toFixed(1)}px!important;`;
			style_m_poi_pas = `${style_m_poi_pas}left:${left_pos_m_poi.toFixed(1)}%!important;`;

			let color_pastille = "";

			if (options.is_pastille_vert !== undefined && options.is_pastille_vert === true) {
				// point_pastille = `<div class="single_marker_point_pastille" data-pastille-type="green" style="background-color:green;${style_m_poi_pas}"></div>`;
				color_pastille = "green";
			} else if (options.is_pastille_rouge !== undefined && options.is_pastille_rouge === true) {
				// point_pastille = `<div class="single_marker_point_pastille" data-pastille-type="red" style="background-color:red;${style_m_poi_pas}"></div>`;
				color_pastille = "red";
			} else if (options.is_pastille_orange !== undefined && options.is_pastille_orange === true) {
				color_pastille = "orange";
			} else if (options.is_pastille_blue !== undefined && options.is_pastille_blue === true) {
				color_pastille = "blue";
			}

			point_pastille = `<div class="single_marker_point_pastille" data-pastille-type="${color_pastille}" style="background-color:${color_pastille};${style_m_poi_pas}"></div>`;
		}

		return new L.DivIcon({
			className: "content_single_marker_poi",
			html: ` 
					<div class="single_marker_poi ${class_indicator_poi}" style="${style_m_poi}">
						${point_pastille}
						<img class="single_marker_image" style="${style_image}" src="${path_icon}"/>
						<div class="single_marker_note">${note}</div>
						<div class="single_marker_point ${class_indicator_poi} " style="${style_marker_point}"></div>
					</div>
				`,
			iconAnchor: [11, 30],
			popupAnchor: [0, -20],
			shadowSize: [68, 95],
			shadowAnchor: [22, 94],
		});
	}

	bindEventClickOnMarker(markerRubrique, item) {
		markerRubrique.on("click", (e) => {
			this.resetLastMarkerClicked();

			this.updateCenter(parseFloat(item.lat), parseFloat(item.long), this.zoomDetails);

			const { id, type: rubrique_type } = markerRubrique.options;

			const rubrique_type_object = this.allRubriques.find((item) => item.api_name === rubrique_type);
			const icon_selected = rubrique_type_object.poi_icon.selected;

			let poi_options = rubrique_type_object.getOptionPastille(item);

			//// Validation state ----------------------
			let validation = this.getStateValidationTooltip(rubrique_type, item.id);
			if (validation !== null) {
				poi_options = {
					...poi_options,
					validation: {
						className: validation["className"],
					},
				};
			}
			//// -----------------------

			const note = item.hasOwnProperty("moyenne_note") ? parseFloat(item.moyenne_note).toFixed(1) : "0.0";

			markerRubrique.setIcon(this.setDivIconMarker(icon_selected, note, poi_options));

			this.marker_last_selected = { marker: markerRubrique, type: rubrique_type, id: id };

			openDetailsContainer();

			rubrique_type_object.fetchDetails(item.id);
		});
	}

	resetLastMarkerClicked() {
		if (this.marker_last_selected != null) {
			const { marker: markerLastClicked, type, id } = this.marker_last_selected;

			const rubrique_type_object = this.allRubriques.find((item) => item.api_name === type);
			const icon_not_selected = rubrique_type_object.poi_icon.not_selected;

			const last_rubrique_item = this.defaultData[type]["data"].find(
				(item) => parseInt(item.id) === parseInt(id)
			);

			const note = last_rubrique_item.hasOwnProperty("moyenne_note")
				? parseFloat(last_rubrique_item.moyenne_note).toFixed(1)
				: "0.0";

			let poi_options = rubrique_type_object.getOptionPastille(last_rubrique_item);

			//// Validation state ----------------------
			let validation = this.getStateValidationTooltip(type, last_rubrique_item.id);
			if (validation !== null) {
				poi_options = {
					...poi_options,
					validation: {
						className: validation["className"],
					},
				};
			}
			//// -----------------------

			markerLastClicked.setIcon(this.setDivIconMarker(icon_not_selected, note, poi_options));
		}
	}

	getOptionPastilleResto(item) {
		let option_resto = { ...this.rubriqueOptionType };

		const data_resto_pastille = this.defaultData["restaurant"]["pastille"];

		const count_pastille = data_resto_pastille.reduce((sum, item_resto_pastille) => {
			if (parseInt(item_resto_pastille.id_resto) === parseInt(item.id)) {
				sum = sum + 1;
			}
			return sum;
		}, 0);

		option_resto = {
			...option_resto,
			isPastille: count_pastille > 0 ? true : false,
			is_pastille_vert: count_pastille === 1 ? true : false,
			is_pastille_rouge: count_pastille === 2 ? true : false,
		};

		return option_resto;
	}

	async fetchDetailsResto(id_rubrique) {
		try {
			const link_details = `/details/restaurant/${id_rubrique}`;
			const response = await fetch(link_details);

			if (!response.ok) {
				throw new Error(`Erreur de réseaux: ${response.status}`);
			}

			const response_text = await response.text();

			const dom_parse = new DOMParser();
			const rubrique_details = dom_parse.parseFromString(response_text, "text/html");

			const content_details_rubrique = document.querySelector("#content_detail_rubrique_jheo_js");
			if (!content_details_rubrique) {
				console.log("Selector not found: 'content_detail_rubrique_jheo_js'");
				return false;
			}

			content_details_rubrique.innerHTML = rubrique_details.querySelector("body").innerHTML;
		} catch (error) {
			console.log(error);
		}
	}

	getOptionPastilleFerme(item) {
		return { ...this.rubriqueOptionType };
	}

	async fetchDetailsFerme(id_rubrique) {
		try {
			const link_details = `/details/ferme/${id_rubrique}`;
			const response = await fetch(link_details);

			if (!response.ok) {
				throw new Error(`Erreur de réseaux: ${response.status}`);
			}

			const response_text = await response.text();

			const dom_parse = new DOMParser();
			const rubrique_details = dom_parse.parseFromString(response_text, "text/html");

			const content_details_rubrique = document.querySelector("#content_detail_rubrique_jheo_js");
			if (!content_details_rubrique) {
				console.log("Selector not found: 'content_detail_rubrique_jheo_js'");
				return false;
			}

			content_details_rubrique.innerHTML = rubrique_details.querySelector("body").innerHTML;
		} catch (error) {
			console.log(error);
		}
	}

	getOptionPastilleMarche(item) {
		return { ...this.rubriqueOptionType };
	}

	async fetchDetailsMarche(id_rubrique) {
		try {
			const entity_marche = this.defaultData["marche"]["data"].find(
				(item) => parseInt(item.id) === parseInt(id_rubrique)
			);

			let params = "";
			if (entity_marche.hasOwnProperty("status")) {
				params = "?userCreate=true";
			}

			const link_details = `/details/marche/${id_rubrique}${params}`;
			const response = await fetch(link_details);

			if (!response.ok) {
				throw new Error(`Erreur de réseaux: ${response.status}`);
			}

			const response_text = await response.text();

			const dom_parse = new DOMParser();
			const rubrique_details = dom_parse.parseFromString(response_text, "text/html");

			const content_details_rubrique = document.querySelector("#content_detail_rubrique_jheo_js");
			if (!content_details_rubrique) {
				console.log("Selector not found: 'content_detail_rubrique_jheo_js'");
				return false;
			}

			content_details_rubrique.innerHTML = rubrique_details.querySelector("body").innerHTML;
		} catch (error) {
			console.log(error);
		}
	}

	getOptionPastilleStation(item) {
		return { ...this.rubriqueOptionType };
	}

	async fetchDetailsStation(id_rubrique) {
		try {
			const link_details = `/details/station/${id_rubrique}`;
			const response = await fetch(link_details);

			if (!response.ok) {
				throw new Error(`Erreur de réseaux: ${response.status}`);
			}

			const response_text = await response.text();

			const dom_parse = new DOMParser();
			const rubrique_details = dom_parse.parseFromString(response_text, "text/html");

			const content_details_rubrique = document.querySelector("#content_detail_rubrique_jheo_js");
			if (!content_details_rubrique) {
				console.log("Selector not found: 'content_detail_rubrique_jheo_js'");
				return false;
			}

			content_details_rubrique.innerHTML = rubrique_details.querySelector("body").innerHTML;
		} catch (error) {
			console.log(error);
		}
	}

	getOptionPastilleGolf(item) {
		let option_golf = { ...this.rubriqueOptionType };

		if (item.hasOwnProperty("user_status")) {
			if (!!item.user_status.a_faire === true) {
				////orange
				option_golf = { ...option_golf, isPastille: true, is_pastille_orange: true };
			} else if (!!item.user_status.fait === true) {
				//// bleu
				option_golf = { ...option_golf, isPastille: true, is_pastille_blue: true };
			} else if (!!item.user_status.refaire === true) {
				//// vert
				option_golf = { ...option_golf, isPastille: true, is_pastille_vert: true };
			}
		}

		return option_golf;
	}

	async fetchDetailsGolf(id_rubrique) {
		try {
			const link_details = `/details/golf/${id_rubrique}`;
			const response = await fetch(link_details);

			if (!response.ok) {
				throw new Error(`Erreur de réseaux: ${response.status}`);
			}

			const response_text = await response.text();

			const dom_parse = new DOMParser();
			const rubrique_details = dom_parse.parseFromString(response_text, "text/html");

			const content_details_rubrique = document.querySelector("#content_detail_rubrique_jheo_js");
			if (!content_details_rubrique) {
				console.log("Selector not found: 'content_detail_rubrique_jheo_js'");
				return false;
			}

			content_details_rubrique.innerHTML = rubrique_details.querySelector("body").innerHTML;
		} catch (error) {
			console.log(error);
		}
	}

	getOptionPastilleTabac(item) {
		return { ...this.rubriqueOptionType };
	}

	async fetchDetailsTabac(id_rubrique) {
		try {
			const link_details = `/details/tabac/${id_rubrique}`;
			const response = await fetch(link_details);

			if (!response.ok) {
				throw new Error(`Erreur de réseaux: ${response.status}`);
			}

			const response_text = await response.text();

			const dom_parse = new DOMParser();
			const rubrique_details = dom_parse.parseFromString(response_text, "text/html");

			const content_details_rubrique = document.querySelector("#content_detail_rubrique_jheo_js");
			if (!content_details_rubrique) {
				console.log("Selector not found: 'content_detail_rubrique_jheo_js'");
				return false;
			}

			content_details_rubrique.innerHTML = rubrique_details.querySelector("body").innerHTML;
		} catch (error) {
			console.log(error);
		}
	}

	displayFicheRubrique(id_rubrique, type_rubrique) {
		let is_clicked = false;
		this.markers.eachLayer((marker) => {
			if (parseInt(marker.options.id) === parseInt(id_rubrique) && marker.options.type === type_rubrique) {
				is_clicked = true;
				marker.fire("click");
			}
		});

		if (!is_clicked) {
			const data_rubrique = this.defaultData[type_rubrique];
			const data_item = data_rubrique.data.find((item) => item.id === parseInt(id_rubrique));

			const rubrique_type_object = this.allRubriques.find((item) => item.api_name === type_rubrique);

			rubrique_type_object.setSingleMarker(data_item);

			this.markers.eachLayer((marker) => {
				if (parseInt(marker.options.id) === parseInt(id_rubrique) && marker.options.type === type_rubrique) {
					marker.fire("click");
				}
			});
		}
	}

	async injectListRestoPastille() {
		injectBodyListMarkerRestoPastille();

		const rubrique_type_object = this.allRubriques.find((item) => item.api_name === "restaurant");

		if (!rubrique_type_object.is_active) {
			injectListMarkerRestoPastilleAlertNonActive();
		} else {
			fetch("/fetch_data/resto_pastille")
				.then((response) => {
					if (response.code === 401) {
						parent_content.innerHTML = `
								<div class="alert alert-danger" role="alert">
									Vous n'êtes pas connecté, <a href="/connexion" >veuillez connectez ici </a>.
								</div>
							`;

						throw new Error("Unauthorized...");
					} else {
						return response.json();
					}
				})
				.then((response) => {
					const { pastilles, resto } = response;
					const restoPastilleTab = [];

					pastilles.forEach((item) => {
						const restoPastille = resto.find((jtem) => parseInt(item.id_resto) === parseInt(jtem.id));
						if (restoPastille) {
							restoPastilleTab.push({
								id: restoPastille.id,
								name: restoPastille.denominationF,
								depName: restoPastille.depName,
								dep: restoPastille.dep,
								logo_path: item.logo_path,
								name_tribu_t_muable: item.name_tribu_t_muable,
								tableName: item.tableName,
							});
						}
					});

					injectDataListMarkerRestoPastille(restoPastilleTab);
				});
		}

		// this.default_data
		// injectListMarker(restoPastilleTab);
	}

	/**
	 * @author Nantenaina a ne pas contacté pendant les congés
	 * où: on Utilise cette fonction dans la rubrique resto et tous carte cmz,
	 * localisation du fichier: dans MarkerClusterResto.js,
	 * je veux: rendre le marker draggable
	 * si un utilisateur veut modifier une ou des informations
	 * @param {} id
	 */
	makeMarkerDraggable(id, rubrique_type) {
		let tab = "ivelany";
		this.markers.eachLayer((marker) => {
			if (parseInt(marker.options.id) === parseInt(id) && marker.options.type === rubrique_type) {
				let initialPos = marker.getLatLng();
				marker.dragging.enable();

				tab = "anatiny";
				marker.on("dragend", (e) => {
					let position = marker.getLatLng();
					let lat = position.lat;
					let lng = position.lng;
					$("#userModifResto").modal("show");
					document.querySelector("#newLatitude").value = lat;
					document.querySelector("#newLongitude").value = lng;
					document.querySelector("#newIdResto").value = id;

					setTimeout(() => {
						swal(
							"Ça fait 10 minutes que vous n'avez effectué aucune modification sur le marquer, le mode interactif sur le marquer sera désactivé."
						).then(() => {
							marker.setLatLng(initialPos, {
								draggable: "false",
							});
							marker.dragging.disable();
						});
					}, 600000);

					console.log(position);
				});

				console.log(marker);
			}
		});

		console.log(tab);
	}

	updateListRestoPastille(idResto, tribuName, logo = null) {
		this.defaultData["restaurant"]["pastille"] = [
			{ id_resto: idResto.toString(), tableName: tribuName, logo_path: logo },
			...this.defaultData["restaurant"]["pastille"],
		];

		// this.updateStateResto(idResto);
	}

	updateListRestoDepastille(idResto, tribuName) {
		this.defaultData["restaurant"]["pastille"] = [
			...this.defaultData["restaurant"]["pastille"].filter((item) => {
				if (
					parseInt(item.id_resto) === parseInt(idResto) &&
					item.tableName.replaceAll("_restaurant", "") === tribuName.replaceAll("_restaurant", "")
				) {
					return false;
				}
				return true;
			}),
		];

		// this.updateStateResto(idResto);
	}

	showNoteMoyenneRealTime(idResto, global_note, type) {
		this.defaultData[type]["data"] = [
			...this.defaultData[type]["data"].map((item) => {
				if (parseInt(item.id) === parseInt(idResto)) {
					item["moyenne_note"] = global_note;
				}
				return item;
			}),
		];

		const rubrique_type_object = this.allRubriques.find((item) => item.api_name === type);
		const icon_selected = rubrique_type_object.poi_icon.selected;

		const data_resto_pastille = this.defaultData[type]["pastille"];

		const count_pastille = data_resto_pastille.reduce((sum, item_resto_pastille) => {
			if (parseInt(item_resto_pastille.id_resto) === parseInt(idResto)) {
				sum = sum + 1;
			}
			return sum;
		}, 0);

		let poi_options =
			count_pastille > 0
				? {
						isPastille: true,
						is_pastille_vert: count_pastille === 1 ? true : false,
						is_pastille_rouge: count_pastille === 2 ? true : false,
				  }
				: {};

		this.markers.eachLayer((marker) => {
			if (parseInt(marker.options.id) === parseInt(idResto) && marker.options.type === type) {
				marker.setIcon(this.setDivIconMarker(icon_selected, global_note, poi_options));
			}
		});
	}

	getNewUserStatus(status) {
		let user_status = { a_faire: false, fait: false, mon_golf: false, refaire: false };
		if (status === "fait") {
			user_status = { ...user_status, fait: true };
		} else if (status === "afaire") {
			user_status = { ...user_status, a_faire: true };
		} else if (status === "refaire") {
			user_status = { ...user_status, refaire: true };
		} else if (status === "mon_golf") {
			user_status = { ...user_status, mon_golf: true };
		}
		return user_status;
	}

	updateStatusDataItem(user_status, id) {
		if (this.defaultData["golf"]["data"].some(({ id: item_id }) => parseInt(item_id) === parseInt(id))) {
			this.defaultData["golf"]["data"] = this.defaultData["golf"]["data"].map((item) => {
				if (parseInt(item.id) === parseInt(id)) {
					item.user_status = { ...item.user_status, ...user_status };
				}
				return item;
			});
		}
	}

	updateStateGolf(status, id) {
		let user_status = this.getNewUserStatus(status); ///  { a_faire: ..., fait: ..., mon_golf: ..., refaire: ... };

		if (this.defaultData["golf"]["data"].some(({ id: item_id }) => parseInt(item_id) === parseInt(id))) {
			///update the global data state
			this.updateStatusDataItem(user_status, id);

			const golfModified = this.defaultData["golf"]["data"].find(
				({ id: item_id }) => parseInt(item_id) === parseInt(id)
			);

			const rubrique_type_object = this.allRubriques.find((item) => item.api_name === "golf");
			const icon_selected = rubrique_type_object.poi_icon.selected;

			const note = golfModified.hasOwnProperty("moyenne_note")
				? parseFloat(golfModified.moyenne_note).toFixed(1)
				: "0.0";

			let poi_options = rubrique_type_object.getOptionPastille(golfModified);

			this.markers.eachLayer((item_marker) => {
				if (item_marker.options.type === "golf" && parseInt(item_marker.options.id) === golfModified.id) {
					item_marker.setIcon(this.setDivIconMarker(icon_selected, note, poi_options));
				}
			});
		}
	}

	/**
	 * @author Elie
	 * @constructor Affichage de liste de dossier et sous dossier contenant mes favories géographiques
	 */
	injectMyFavoris() {
		if (!document.querySelector(".content_right_side_body_jheo_js")) {
			console.log("Selector not found : '.content_right_side_body_body'");
			return false;
		}

		document.querySelector(".content_right_side_body_jheo_js").innerHTML = `
			<div class="content_list_favory">
				<div class="list_favory">
					<ul class="list-group list-group-flush favory_list_jheo_js">
						<div class="card_mini_chargement card_mini_chargement_jheo_js">
							<div class="containt">
								<div class="word word-1">C</div>
								<div class="word word-2">M</div>
								<div class="word word-3">Z</div>
							</div>
						</div>
					</ul>
				</div>
			</div>
		`;

		// const content_list_element = document.querySelector(`.favory_list_jheo_js`);
		this.injectListRubriqueTypeForFavory();
	}

	injectListRubriqueTypeForFavory() {
		if (!document.querySelector(".favory_list_jheo_js")) {
			console.log("Selector not found : '.favory_list_jheo_js'");
			return false;
		}

		let list_rubrique = this.allRubriques.map((item) => {
			const icon_image = IS_DEV_MODE ? `/${item.icon}` : `/public/${item.icon}`;

			return `
				<li class="list-group-item">
					<span class="d-flex justify-content-start align-items-center">
						<img class="image_icon_rubrique" src="${icon_image}" alt="${item.name}_rubrique" />
						<span class="${item.is_have_favory ? "hover_underline" : "hover_underline_gray"}" 
							onclick="openFavoryRubrique('${item.api_name}')">
							Voir les favoris ${item.name}
						</span>
					</span>
				</li>
			`;
		});

		document.querySelector(".favory_list_jheo_js").innerHTML = list_rubrique.join("");
	}

	openFavoryRubrique(rubrique_type) {
		const rubrique_type_object = this.allRubriques.find((item) => item.api_name === rubrique_type);

		if (!rubrique_type_object.is_have_favory) {
			this.alertSwalFunctionNoteImplement();
			return false;
		}

		if (!document.querySelector(".favory_list_jheo_js")) {
			console.log("Selector not found : '.favory_list_jheo_js'");
			return false;
		}

		if (!rubrique_type_object.is_active) {
			swal(
				`
				Cette section '${rubrique_type_object.name}' n'est pas active. Souhaitez-vous l'activer ?
			`,
				{
					buttons: {
						cancel: "Annuler",
						ok: {
							text: "Active",
							value: "ok",
							className: "swal-button swal-button--info",
						},
					},
				}
			).then((value) => {
				if (value === "ok") {
					///active rubrique
					this.activeRubrique(rubrique_type_object.api_name);

					//// update history rubrique active
					this.updateRubriqueActiveHistory();

					document.querySelector(".title_right_side_jheo_js").innerText = `
						Liste de mes favoris ${rubrique_type_object.name}:
					`;

					const parent_content = document.querySelector(".favory_list_jheo_js");

					parent_content.innerHTML = `
						<div class="card_mini_chargement card_mini_chargement_jheo_js">
							<div class="containt">
								<div class="word word-1">C</div>
								<div class="word word-2">M</div>
								<div class="word word-3">Z</div>
							</div>
						</div>
					`;

					rubrique_type_object.injecteListFavory(parent_content);
				}
			});
		} else {
			document.querySelector(".title_right_side_jheo_js").innerText = `
				Liste de mes favoris ${rubrique_type_object.name}:
			`;

			const parent_content = document.querySelector(".favory_list_jheo_js");

			parent_content.innerHTML = `
				<div class="card_mini_chargement card_mini_chargement_jheo_js">
					<div class="containt">
						<div class="word word-1">C</div>
						<div class="word word-2">M</div>
						<div class="word word-3">Z</div>
					</div>
				</div>
			`;

			rubrique_type_object.injecteListFavory(parent_content);
		}
	}

	injectListRubriqueTypeForNewPOI() {
		if (!document.querySelector(".list_rubrique_for_new_poi_jheo_js")) {
			console.log("Selector not found : '.list_rubrique_for_new_poi_jheo_js'");
			return false;
		}
		let list_rubrique = "";

		const all_rubrique = trierTableau(this.allRubriques, "is_can_add_new_poi");

		all_rubrique.forEach((item) => {
			const icon_image = IS_DEV_MODE ? `/${item.icon}` : `/public/${item.icon}`;

			list_rubrique += `
				<li class="list-group-item">
					<span class="d-flex justify-content-start align-items-center">
						<img class="image_icon_rubrique" src="${icon_image}" alt="${item.name}_rubrique" />
						<span class="${item.is_can_add_new_poi ? "hover_underline" : "hover_underline_gray"}" 
							onclick="openModalAddNewPOI('${item.api_name}')" data-bs-dismiss="modal">
							Une nouvelle POI ${item.name}
						</span>
					</span>
				</li>
			`;
		});

		document.querySelector(".list_rubrique_for_new_poi_jheo_js").innerHTML = list_rubrique;
	}

	openModalAddNewPOI(rubrique_type) {
		const rubrique_type_object = this.allRubriques.find((item) => item.api_name === rubrique_type);

		/// check if this rubrique can be added.
		if (!rubrique_type_object.is_can_add_new_poi) {
			let message = `
				Pour la section '${rubrique_type_object.name}', cette fonctionnalité n'est pas encore développée. Nous vous remercions de votre compréhension.
			`;

			this.alertSwalFunctionNoteImplement(message);
			return false;
		}

		if (!rubrique_type_object.is_active) {
			swal(
				`
				Cette section '${rubrique_type_object.name}' n'est pas active. Souhaitez-vous l'activer ?
			`,
				{
					buttons: {
						cancel: "Annuler",
						ok: {
							text: "Active",
							value: "ok",
							className: "swal-button swal-button--info",
						},
					},
				}
			).then((value) => {
				if (value === "ok") {
					///active rubrique
					this.activeRubrique(rubrique_type_object.api_name);

					//// update history rubrique active
					this.updateRubriqueActiveHistory();

					/// abstraction for function add New poi rubrique ---------
					rubrique_type_object.addNewPOI();
				}
			});
		} else {
			/// abstraction for function add New poi rubrique ---------
			rubrique_type_object.addNewPOI();
		}
	}

	addNewPOIMarche() {
		/// open modal -------------------------
		if (!document.querySelector(".cta_open_modal_new_poi_jheo_js")) {
			console.log("ERROR: Selector not found: 'cta_open_modal_new_poi_jheo_js'");
			return false;
		}

		document.querySelector(".cta_open_modal_new_poi_jheo_js").click();

		//// -----------------------------------

		if (!document.querySelector(".form_new_poi_marche_jheo_js")) {
			console.log("Selector not found: form_new_poi_marche_jheo_js");
			return false;
		}

		const form = document.querySelector(".form_new_poi_marche_jheo_js");

		const all_input_jour_de_marche = form.querySelectorAll(".content_input_jdm_jheo_js");
		if (all_input_jour_de_marche.length > 0) {
			Array.from(all_input_jour_de_marche).forEach((input) => input.remove());
		}

		const all_input = Array.from(form.querySelectorAll("input"));

		all_input.forEach((input) => (input.value = null));

		const lastLatLngOnClick = this.lastLatLngOnClick; /// { lat: 0.0, lng: 0.0 };

		document.querySelector("#new_marche_latitude").value = lastLatLngOnClick.lat;
		document.querySelector("#new_marche_longitude").value = lastLatLngOnClick.lng;
		document.querySelector("#new_marche_departement").value = lastLatLngOnClick.depCode;

		document.querySelector("#new_marche_latitude").setAttribute("readonly", true);
		document.querySelector("#new_marche_longitude").setAttribute("readonly", true);
		document.querySelector("#new_marche_departement").setAttribute("readonly", true);

		const errors = document.querySelectorAll(".invalid-feedback_jheo_js");
		Array.from(errors).forEach((error) => {
			if (error.classList.contains("d-block")) {
				error.classList.remove("d-block");
			}
		});
	}

	addPendingDataMarche(item) {
		const rubrique_type = "marche";

		let already_exist = false;
		this.markers.eachLayer((marker) => {
			if (marker.options.type === rubrique_type) {
				if (parseInt(marker.options.id) === parseInt(item.id) && marker.options.isPedding == true) {
					already_exist = true;
				}
			}
		});

		if (!already_exist) {
			const rubrique_type_object = this.allRubriques.find((item) => item.api_name === rubrique_type);

			rubrique_type_object.setSingleMarker(item, { isPedding: true });

			this.defaultData[rubrique_type]["data"] = [...this.defaultData[rubrique_type]["data"], item];

			this.markers.eachLayer((marker) => {
				if (marker.options.type === rubrique_type) {
					if (parseInt(marker.options.id) === parseInt(item.id) && marker.options.isPedding == true) {
						marker.fireEvent("click");
					}
				}
			});
		}
	}

	alertSwalFunctionNoteImplement(message = null) {
		if (message === null) {
			message = "Cette fonctinnalité est en cours de développement, merci de votre compréhension.";
		}

		new swal("Cher partisan.", message, "info");
	}

	injecteListFavoryResto(parent_content, favori_folder_id = 0) {
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

	injectLegendeIconeOnMap() {
		if (!document.querySelector(".content_right_side_body_jheo_js")) {
			console.log("Selector not found : '.content_right_side_body_body'");
			return false;
		}

		let list_rubrique = this.allRubriques.map((item) => {
			const icon_image = IS_DEV_MODE ? `/${item.icon}` : `/public/${item.icon}`;

			return `
				<li class="list-group-item">
					<span class="d-flex justify-content-start align-items-center">
						<img class="image_icon_rubrique" src="${icon_image}" alt="${item.name}_rubrique" />
						${item.name}
					</span
				</li>
			`;
		});

		let all_legend_icon = "";
		this.allRubriques.forEach((item_rubrique) => {
			all_legend_icon += item_rubrique.getLegendIcon();
		});

		document.querySelector(".content_right_side_body_jheo_js").innerHTML = `
			<div class="right_side_body right_side_body_jheo_js">
				<ul class="list-group list-group-flush content_list_legende_icon">
					${all_legend_icon}
				</ul>
			</div>
		`;
	}

	makeMarkerDraggablePOI(rubrique_type, rubrique_id) {
		const rubrique_type_object = this.allRubriques.find((item) => item.api_name === rubrique_type);
		rubrique_type_object.makeMarkerDraggablePOI(rubrique_id);
	}

	makeMarkerDraggablePOIMarche(rubrique_id) {
		this.markers.eachLayer((marker) => {
			if (parseInt(marker.options.id) === parseInt(rubrique_id) && marker.options.type === "marche") {
				let initialPos = marker.getLatLng();
				this.saveOriginPosition("marche", rubrique_id, initialPos);

				marker.dragging.enable();

				marker.on("dragend", (e) => {
					let position = marker.getLatLng();
					let lat = position.lat;
					let lng = position.lng;

					$("#modal_edit_poi_marche").modal("show");

					fetchInformationMarcheToEdit(rubrique_id);

					document.querySelector("#edit_marche_departement").setAttribute("readOnly", "true");

					document.querySelector("#edit_marche_latitude").value = lng;
					document.querySelector("#edit_marche_latitude").setAttribute("readOnly", "true");

					document.querySelector("#edit_marche_longitude").value = lat;
					document.querySelector("#edit_marche_longitude").setAttribute("readOnly", "true");

					const btn_cancel = document.querySelector(".cancel_edit_poi_marche_jheo_js");
					btn_cancel.setAttribute("onclick", `cancelEditPoiMarche("${rubrique_id}")`);

					//btn_close_modal_edit_poi_marche_jheo_js
					const btn_close_modal_edit_poi = document.querySelector(".btn_close_modal_edit_poi_marche_jheo_js");
					btn_close_modal_edit_poi.setAttribute("onclick", `cancelEditPoiMarche("${rubrique_id}")`);

					const btn_sendSubmit = document.querySelector(".submit_edit_poi_marche_jheo_js");
					btn_sendSubmit.setAttribute("onclick", `handleSubmitEditPOIMarche("${rubrique_id}")`);

					marker.dragging.disable();
				});
			}
		});
	}
}
