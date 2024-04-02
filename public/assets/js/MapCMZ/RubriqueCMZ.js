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
				setSingleMarker: (item, isInHome) => {
					this.setSingleMarkerResto(item, isInHome);
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
				setSingleMarker: (item, isInHome) => {
					this.settingSingleMarker(item, isInHome);
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
				setSingleMarker: (item, isInHome) => {
					this.settingSingleMarker(item, isInHome);
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
				setSingleMarker: (item, isInHome) => {
					this.settingSingleMarker(item, isInHome);
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
				setSingleMarker: (item, isInHome) => {
					this.settingSingleMarker(item, isInHome);
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
				setSingleMarker: (item, isInHome) => {
					this.settingSingleMarker(item, isInHome);
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
				setSingleMarker: (item, isInHome) => {
					this.settingSingleMarker(item, isInHome);
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
				setSingleMarker: (item, isInHome) => {
					this.settingSingleMarker(item, isInHome);
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
				setSingleMarker: (item, isInHome) => {
					this.settingSingleMarker(item, isInHome);
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
				setSingleMarker: (item, isInHome) => {
					this.settingSingleMarker(item, isInHome);
				},
			},
		];

		this.defaultData = {}; /// { 'ferme' : [ ], 'restaurant' : [ ] , ... } ///original data
		this.data = {}; /// { 'ferme' : [ ], 'restaurant' : [ ] , ... }        ///data filtered.
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

	async addRubriqueMarker(rubrique_type) {
		const response = await this.fetchDataRubrique(rubrique_type.toLowerCase());
		this.defaultData[rubrique_type] = {
			data: response.data,
			...this.defaultData?.rubrique_type,
		};

		this.updateMapAddRubrique(rubrique_type);
	}

	async fetchDataRubrique(rubrique_type) {
		let link = `/fetch_data/${rubrique_type}`;

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

	updateMapAddRubrique(rubrique_type) {
		const rubrique_type_object = this.allRubriques.find((item) => item.api_name === rubrique_type);

		const data_rubrique_add = this.defaultData[rubrique_type]["data"];

		data_rubrique_add?.forEach((item) => {
			rubrique_type_object.setSingleMarker(item, false);
		});
	}

	setSingleMarkerResto(item, isHome = false) {
		const rubrique_type_object = this.allRubriques.find((item) => item.api_name === "restaurant");
		const icon = rubrique_type_object.poi_icon.not_selected;

		let marker = this.newMarkerPOI(rubrique_type_object.api_name, item, icon);

		const departementName = item.depName + "<br>";
		const adresseRestaurant = `${item.numvoie} ${item.typevoie} ${item.nomvoie} ${item.codpost} ${item.villenorm}`;
		const adress = "<br><span class='fw-bolder'> Adresse:</span> <br>" + adresseRestaurant;
		const title =
			"<span class='fw-bolder'> Restaurant: </span>  " +
			item.denominationF +
			" <br><span class='fw-bolder'><br> Departement:</span>  " +
			departementName +
			"." +
			adress;

		marker.bindTooltip(title, { direction: "top", offset: L.point(0, -30) }).openTooltip();

		this.markers.addLayer(marker);
	}

	newMarkerPOI(rubrique_type, singleData, poi_icon) {
		let [w, h] = [30, 45];
		const path_icon = IS_DEV_MODE ? `/${poi_icon}` : `/public/${poi_icon}`;

		return new L.Marker(L.latLng(parseFloat(singleData.lat), parseFloat(singleData.long)), {
			icon: new L.DivIcon({
				className: "my-div-icon",
				html: ` 
						<span class="my-div-span" style="padding:2px;position:absolute;top:-5px;left:-10px;
							background-color:red;color:white;
							border-radius: 50%;">
							2.1
						</span>
						<img class="my-div-image" style="width:${w}px ; height:${h}px" src="${path_icon}"/>
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
