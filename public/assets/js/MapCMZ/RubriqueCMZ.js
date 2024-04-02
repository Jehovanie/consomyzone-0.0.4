class RubriqueCMZ extends MapCMZ {
	constructor() {
		super();
		this.api_data = "/dataHome";

		this.markers = null;
		this.markerClusterForCounterPerDep = null;

		this.zoom_max_for_count_per_dep = 8;

		this.geos = [];

		this.allRubriques = [
			{
				name: "Restaurant",
				api_name: "restaurant",
				icon: "assets/icon/NewIcons/restaurant.png",
				poi_icon: {
					selected: "assets/icon/NewIcons/icon-resto-new-Rr.png",
					not_selected: "assets/icon/NewIcons/icon-resto-new-B.png",
				},
				is_active: false,
				setSingleMarker: (item, options = {}) => {
					this.setSingleMarkerResto(item, options);
				},
			},
			{
				name: "Ferme",
				api_name: "ferme",
				icon: "assets/icon/NewIcons/restaurant.png",
				poi_icon: {
					selected: "assets/icon/NewIcons/icon-ferme-new-R.png",
					not_selected: "assets/icon/NewIcons/icon-ferme-new-B.png",
				},
				is_active: false,
				setSingleMarker: (item, options = {}) => {
					this.setSingleMarkerFerme(item, options);
				},
			},
			{
				name: "Station",
				api_name: "station",
				icon: "assets/icon/NewIcons/restaurant.png",
				poi_icon: {
					selected: "assets/icon/NewIcons/icon-station-new-R.png",
					not_selected: "assets/icon/NewIcons/icon-station-new-B.png",
				},
				is_active: false,
				setSingleMarker: (item, options = {}) => {
					this.settingSingleMarker(item, options);
				},
			},
			{
				name: "Golf",
				api_name: "golf",
				icon: "assets/icon/NewIcons/restaurant.png",
				poi_icon: {
					selected: "assets/icon/NewIcons/icon-rouge-golf-C.png",
					not_selected: "assets/icon/NewIcons/icon-blanc-golf-vertC.png",
				},
				is_active: false,
				setSingleMarker: (item, options = {}) => {
					this.settingSingleMarker(item, options);
				},
			},
			{
				name: "Tabac",
				api_name: "tabac",
				icon: "assets/icon/NewIcons/restaurant.png",
				poi_icon: {
					selected: "assets/icon/NewIcons/tabac_red0.png",
					not_selected: "assets/icon/NewIcons/tabac_black0.png",
				},
				is_active: false,
				setSingleMarker: (item, options = {}) => {
					this.settingSingleMarker(item, options);
				},
			},
			{
				name: "Marché",
				api_name: "marche",
				icon: "assets/icon/NewIcons/restaurant.png",
				poi_icon: {
					selected: "assets/icon/NewIcons/icon_marche_selected.png",
					not_selected: "assets/icon/NewIcons/icon_marche.png",
				},
				is_active: false,
				setSingleMarker: (item, options = {}) => {
					this.settingSingleMarker(item, options);
				},
			},
			{
				name: "Boulangerie",
				api_name: "boulangerie",
				icon: "assets/icon/NewIcons/restaurant.png",
				poi_icon: {
					selected: "assets/icon/NewIcons/icon_marche_selected.png",
					not_selected: "assets/icon/NewIcons/icon_marche.png",
				},
				is_active: false,
				setSingleMarker: (item, options = {}) => {
					this.settingSingleMarker(item, options);
				},
			},
			{
				name: "Extra Pizza",
				api_name: "extra_pizza",
				icon: "assets/icon/NewIcons/restaurant.png",
				poi_icon: {
					selected: "assets/icon/NewIcons/icon_marche_selected.png",
					not_selected: "assets/icon/NewIcons/icon_marche.png",
				},
				is_active: false,
				setSingleMarker: (item, options = {}) => {
					this.settingSingleMarker(item, options);
				},
			},
			{
				name: "KFC",
				api_name: "kfc",
				icon: "assets/icon/NewIcons/restaurant.png",
				poi_icon: {
					selected: "assets/icon/NewIcons/icon_marche_selected.png",
					not_selected: "assets/icon/NewIcons/icon_marche.png",
				},
				is_active: false,
				setSingleMarker: (item, options = {}) => {
					this.settingSingleMarker(item, options);
				},
			},
			{
				name: "Gastro",
				api_name: "gastro",
				icon: "assets/icon/NewIcons/restaurant.png",
				poi_icon: {
					selected: "assets/icon/NewIcons/icon_marche_selected.png",
					not_selected: "assets/icon/NewIcons/icon_marche.png",
				},
				is_active: false,
				setSingleMarker: (item, options = {}) => {
					this.settingSingleMarker(item, options);
				},
			},
		];

		this.defaultData = {}; /// { 'ferme' : [ ], 'restaurant' : [ ] , ... } ///original data
		this.data = {}; /// { 'ferme' : [ ], 'restaurant' : [ ] , ... }        ///data filtered.

		this.dataMarkerDisplay = {};
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

	onInitMarkerCluster() {
		////create new marker Cluster for POI etablisment
		this.createMarkersCluster();
		////create new marker Cluster special for count per dep.
		this.createMarkersClusterForCountPerDep();

		this.addEventOnMap();
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
	 * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
	 * This remove the special markersCulsterGroup when state zoom is get in.
	 */
	addEventMapOnZoomend() {
		// Listen for the zoomend event and remove markers when zooming
		this.map.on("zoomend", () => {
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
		});
	}

	addEventOnMap() {
		this.map.on("resize moveend", () => {
			const x = this.getMax(this.map.getBounds().getWest(), this.map.getBounds().getEast());
			const y = this.getMax(this.map.getBounds().getNorth(), this.map.getBounds().getSouth());

			const new_size = { minx: x.min, miny: y.min, maxx: x.max, maxy: y.max };

			this.updateMarkersDisplay(new_size);
			// this.addPeripheriqueMarker(new_size);
		});
	}

	/**
	 * @author Jehovanie RAMANDRIJOEL
	 * où: on Utilise cette fonction dans la rubrique resto,
	 * localisation du fichier: dans MarkerClusterResto.js,
	 * je veux: mise a jour les données sur la carte,
	 * @param {} newSize  { minx, maxx, miny, maxy }
	 *
	 * - remove markers outside the box
	 * - Add some markers ( via latitude, ratio, dataMax )
	 * -
	 */
	updateMarkersDisplay(newSize) {
		// ///REMOVE THE OUTSIDE THE BOX
		this.removeMarkerOutSideTheBox(newSize);

		//// Update icon size while zoom in or zoom out
		// const iconSize= zoom > 16 ? [35, 45 ] : ( zoom > 14 ? [25,35] : [15, 25])
		// this.synchronizeAllIconSize();

		////count marker in map
		// this.countMarkerInCart();
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
				this.markers.removeLayer(marker);
				countMarkersRemoved++;
			}
		});

		console.log("Marker Removed: " + countMarkersRemoved);
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

					this.markerClusterForCounterPerDep.addLayer(markerCountPerDep);
				}
			}
		});

		if (this.map.getZoom() < this.zoom_max_for_count_per_dep) {
			this.map.addLayer(this.markerClusterForCounterPerDep);
		}

		this.addEventMapOnZoomend();
	}

	async initData() {
		let param = "";

		if (!!this.map) {
			const new_size = this.getBoundsWestEastNorthSouth();
			const { minx, miny, maxx, maxy } = new_size;

			param = `?minx=${encodeURIComponent(minx)}&miny=${encodeURIComponent(miny)}
					&maxx=${encodeURIComponent(maxx)}&maxy=${encodeURIComponent(maxy)}&isFirstResquest=true`;
		}

		//// api get all data from server and return objects
		const response = await fetch(`${this.api_data}${param}`);
		console.log(response);
		//// api get all data from server;
	}

	injectListRubriqueType() {
		if (!document.querySelector(".content_right_side_body_jheo_js")) {
			console.log("Selector not found : '.content_right_side_body_body'");
			return false;
		}

		let btn_rugbrique = this.allRubriques.map((item) => {
			const icon_image = IS_DEV_MODE ? `/${item.icon}` : `/public/${item.icon}`;
			const class_active = item.is_active ? "btn-primary" : "btn-light";
			return `<button type="button" 
						class="d-flex justify-content-center align-items-center rubrique_list_item rubrique_list_item_jheo_js btn ${class_active} btn-sm mb-1 me-1"
						data-type="${item.name}" data-api_name="${item.api_name}"
					>
						<img class="image_icon_rubrique" src="${icon_image}" alt="${item.name}_rubrique" />
						${item.name}
					</button>`;
		});

		document.querySelector(".content_right_side_body_jheo_js").innerHTML = `
            <div class="rubrique_list right_side_body_jheo_js">
                ${btn_rugbrique.join("")}
            </div>
        `;

		this.bindSelectRubrique();
	}

	bindSelectRubrique() {
		if (!document.querySelectorAll(".rubrique_list_item_jheo_js")) {
			console.log("Selector not found: 'rubrique_list_item_jheo_js' ");
			return;
		}

		const all_button_rubrique = Array.from(document.querySelectorAll(".rubrique_list_item_jheo_js"));

		all_button_rubrique.forEach((btn_rubrique) => {
			btn_rubrique.addEventListener("click", () => {
				btn_rubrique.classList.toggle("btn-light");
				btn_rubrique.classList.toggle("btn-primary");

				const rubrique_type = btn_rubrique.getAttribute("data-type");
				const rubrique_clicked = this.allRubriques.find((item) => item.name === rubrique_type);

				const rubrique_api_name = btn_rubrique.getAttribute("data-api_name");

				if (rubrique_clicked.is_active === true) {
					this.allRubriques = [
						...this.allRubriques.map((item) => {
							if (item.name === rubrique_type) {
								item.is_active = false;
							}
							return item;
						}),
					];
					removeRubriqueActivNavbar(rubrique_type);
					this.removeRubriqueMarker(rubrique_api_name);
				} else {
					this.allRubriques = [
						...this.allRubriques.map((item) => {
							if (item.name === rubrique_type) {
								item.is_active = true;
							}
							return item;
						}),
					];

					addRubriqueActivNavbar(rubrique_type);

					this.addRubriqueMarker(rubrique_api_name);
				}
			});
		});
	}

	removeRubriqueMarker(rubrique_api_name) {
		this.markers.eachLayer((marker) => {
			if (marker.options.type === rubrique_api_name.toLowerCase()) {
				this.markers.removeLayer(marker);
			}
		});
	}

	async fetchDataRubrique(rubrique_type) {
		const x = this.getMax(this.map.getBounds().getWest(), this.map.getBounds().getEast());
		const y = this.getMax(this.map.getBounds().getNorth(), this.map.getBounds().getSouth());

		let param = `minx=${encodeURIComponent(x.min)}`;
		param = `${param}&miny=${encodeURIComponent(y.min)}`;
		param = `${param}&maxx=${encodeURIComponent(x.max)}`;
		param = `${param}&maxy=${encodeURIComponent(y.max)}`;

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
			return [];
		}
	}

	async addRubriqueMarker(rubrique_api_name) {
		const response = await this.fetchDataRubrique(rubrique_api_name.toLowerCase());
		this.defaultData[rubrique_api_name] = {
			data: response.data,
			...this.defaultData?.rubrique_api_name,
		};

		this.updateMapAddRubrique(rubrique_api_name);
	}

	updateMapAddRubrique(rubrique_type) {
		const rubrique_type_object = this.allRubriques.find((item) => item.api_name === rubrique_type);

		const data_rubrique_add = this.defaultData[rubrique_type]["data"];

		data_rubrique_add?.forEach((item) => {
			rubrique_type_object.setSingleMarker(item);
		});
	}

	setSingleMarkerResto(item, options = {}) {
		const rubrique_type_object = this.allRubriques.find((item) => item.api_name === "restaurant");
		const icon = rubrique_type_object.poi_icon.not_selected;

		let poi_options = { isPastille: true, is_pastille_vert: false, is_pastille_rouge: true };
		let marker = this.newMarkerPOI(rubrique_type_object.api_name, item, icon, poi_options);

		const title = `
			<span class='fw-bolder'> 
				Restaurant: ${item.denominationF}
			</span>
			<br>
			<span class='fw-bolder'>
				Departement: ${item.depName}
			</span>
			<br>
			<span class='fw-bolder'>
				Adresse: ${item.numvoie} ${item.typevoie} ${item.nomvoie} ${item.codpost} ${item.villenorm}
			</span>
		`;

		marker.bindTooltip(title, { direction: "top", offset: L.point(20, -30) }).openTooltip();

		this.markers.addLayer(marker);
	}

	setSingleMarkerFerme(item, options = {}) {
		const rubrique_type_object = this.allRubriques.find((item) => item.api_name === "ferme");
		const icon = rubrique_type_object.poi_icon.not_selected;

		let marker = this.newMarkerPOI(rubrique_type_object.api_name, item, icon);

		const title = `
			<span class='fw-bolder'>
				Ferme: ${item.nomFerme}
			</span>
			<br>
			<span class='fw-bolder'> 
				Departement: ${item.departement}
			</span>
			<br>
			<span class='fw-bolder'> 
				Adresse: ${item.adresseFerme}
			</span>
		`;

		marker.bindTooltip(title, { direction: "auto", offset: L.point(0, -30) }).openTooltip();

		this.markers.addLayer(marker);
	}

	newMarkerPOI(rubrique_type, singleData, poi_icon, options = {}) {
		poi_icon = "assets/icon/NewIcons/mini_logo_ferme.png";

		let [w, h] = [26, 25];
		const path_icon = IS_DEV_MODE ? `/${poi_icon}` : `/public/${poi_icon}`;

		let point_pastille = "";
		if (options?.isPastille) {
			if (options.is_pastille_vert) {
				point_pastille = `<div class="single_marker_point_pastille" style="background-color: green"></div>`;
			} else if (options.is_pastille_rouge) {
				point_pastille = `<div class="single_marker_point_pastille" style="background-color: red"></div>`;
			}
		}

		return new L.Marker(L.latLng(parseFloat(singleData.lat), parseFloat(singleData.long)), {
			icon: new L.DivIcon({
				className: "content_single_marker_poi",
				html: ` 
					<div class="single_marker_poi">
						${point_pastille}
						<img class="single_marker_image" style="width:${w}px ; height:${h}px" src="${path_icon}"/>
						<div class="single_marker_note">2.1</div>
						<div class="single_marker_point"></div>
					</div>
				`,
				iconAnchor: [11, 30],
				popupAnchor: [0, -20],
				shadowSize: [68, 95],
				shadowAnchor: [22, 94],
			}),
			id: singleData.id,
			type: rubrique_type,
		});
	}
}
