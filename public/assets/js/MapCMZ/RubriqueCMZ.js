class RubriqueCMZ extends MapCMZ {
	constructor() {
		super();
		this.api_data = "/dataHome";

		this.markers = null;
		this.markerClusterForCounterPerDep = null;

		this.zoom_max_for_count_per_dep = 8;

		this.geos = [];
		this.zoom_min = 8;
		this.zoom_max = 20;

		this.allRubriques = [
			{
				name: "Restaurant",
				api_name: "restaurant",
				icon: "assets/icon/NewIcons/mini_logo_resto_selected.png",
				poi_icon: {
					selected: "assets/icon/NewIcons/mini_logo_resto_selected.png",
					not_selected: "assets/icon/NewIcons/mini_logo_resto.png",
				},
				is_active: false,
				setSingleMarker: (item, options = {}) => {
					this.setSingleMarkerResto(item, options);
				},
			},
			{
				name: "Ferme",
				api_name: "ferme",
				icon: "assets/icon/NewIcons/mini_logo_ferme_selected.png",
				poi_icon: {
					selected: "assets/icon/NewIcons/mini_logo_ferme_selected.png",
					not_selected: "assets/icon/NewIcons/mini_logo_ferme.png",
				},
				is_active: false,
				setSingleMarker: (item, options = {}) => {
					this.setSingleMarkerFerme(item, options);
				},
			},
			{
				name: "Station",
				api_name: "station",
				icon: "assets/icon/NewIcons/mini_logo_station.png",
				poi_icon: {
					selected: "assets/icon/NewIcons/mini_logo_station_selected.png",
					not_selected: "assets/icon/NewIcons/mini_logo_station.png",
				},
				is_active: false,
				setSingleMarker: (item, options = {}) => {
					this.setSingleMarkerStation(item, options);
				},
			},
			{
				name: "Golf",
				api_name: "golf",
				icon: "assets/icon/NewIcons/mini_logo_golf_selected.png",
				poi_icon: {
					selected: "assets/icon/NewIcons/mini_logo_golf_selected.png",
					not_selected: "assets/icon/NewIcons/mini_logo_golf.png",
				},
				is_active: false,
				setSingleMarker: (item, options = {}) => {
					this.settingSingleMarkerGolf(item, options);
				},
			},
			{
				name: "Tabac",
				api_name: "tabac",
				icon: "assets/icon/NewIcons/mini_logo_tabac_selected.png",
				poi_icon: {
					selected: "assets/icon/NewIcons/mini_logo_tabac_selected.png",
					not_selected: "assets/icon/NewIcons/mini_logo_tabac.png",
				},
				is_active: false,
				setSingleMarker: (item, options = {}) => {
					this.setSingleMarkerTabac(item, options);
				},
			},
			{
				name: "Marché",
				api_name: "marche",
				icon: "assets/icon/NewIcons/mini_logo_marche_selected.png",
				poi_icon: {
					selected: "assets/icon/NewIcons/mini_logo_marche_selected.png",
					not_selected: "assets/icon/NewIcons/mini_logo_marche.png",
				},
				is_active: false,
				setSingleMarker: (item, options = {}) => {
					this.setSingleMarkerMarche(item, options);
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

		// this is the base of filter data in map based on the user zooming.
		/// ratio is the number precisious for the float on latitude ( ex lat= 47.5125400012145  if ratio= 3 => lat = 47.512
		//// dataMax is the number maximun of the data to show after grouping the all data by lat with ratio.
		///// this must objectRatioAndDataMax is must be order by zoomMin DESC
		this.objectRatioAndDataMax = [
			{ zoomMin: 20, dataMax: 20, ratio: 4 },
			{ zoomMin: 19, dataMax: 15, ratio: 3 },
			{ zoomMin: 18, dataMax: 14, ratio: 3 },
			{ zoomMin: 17, dataMax: 13, ratio: 3 },
			{ zoomMin: 16, dataMax: 12, ratio: 3 },
			{ zoomMin: 15, dataMax: 11, ratio: 3 },
			{ zoomMin: 14, dataMax: 10, ratio: 3 },
			{ zoomMin: 13, dataMax: 9, ratio: 2 },
			{ zoomMin: 12, dataMax: 8, ratio: 2 },
			{ zoomMin: 11, dataMax: 7, ratio: 2 },
			{ zoomMin: 10, dataMax: 6, ratio: 2 },
			{ zoomMin: 9, dataMax: 5, ratio: 1 },
			{ zoomMin: 8, dataMax: 4, ratio: 1 },
			{ zoomMin: 7, dataMax: 3, ratio: 1 },
			{ zoomMin: 6, dataMax: 2, ratio: 1 },
			{ zoomMin: 1, dataMax: 1, ratio: 1 },
		];

		this.markers_display = [];
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

		const zoom = this.map._zoom;
		const current_object_dataMax = this.objectRatioAndDataMax.find((item) => zoom >= parseInt(item.zoomMin));
		const { dataMax, ratio } = current_object_dataMax;

		console.log("current zoom: " + zoom);
		console.log(current_object_dataMax);

		const x = this.getMax(this.map.getBounds().getWest(), this.map.getBounds().getEast()); ///lat
		const y = this.getMax(this.map.getBounds().getNorth(), this.map.getBounds().getSouth()); ///lng

		let markers_display = this.markers_display;
		if (this.markers_display.length > 0 && dataMax !== this.markers_display[0]["dataMax"]) {
			markers_display = this.generateTableDataFiltered(y.min, y.max, ratio); /// [ { lat: ( with ratio ), data: [] } ]

			for (const key_rubrique_type in this.defaultData) {
				///check if this rubrique_type is active...
				let is_rubrique_type_active = this.allRubriques.some(
					(item) => item.api_name === key_rubrique_type && item.is_active === true
				);

				if (is_rubrique_type_active) {
					const rubrique_type = this.defaultData[key_rubrique_type];

					rubrique_type.data.forEach((item_rubrique) => {
						let lat_item_rubrique = parseFloat(parseFloat(item_rubrique.lat).toFixed(ratio));
						let lng_item_rubrique = parseFloat(parseFloat(item_rubrique.long).toFixed(ratio));

						if (x.min <= lng_item_rubrique && x.max >= lng_item_rubrique) {
							markers_display = markers_display.map((item_marker_display) => {
								if (item_marker_display.lat.toString() === lat_item_rubrique.toString()) {
									let count_data_per_rubrique = item_marker_display.data.reduce((sum, item) => {
										if (item.rubrique_type === rubrique_type) {
											sum = sum + 1;
										}
										return sum;
									}, 0);

									if (count_data_per_rubrique < dataMax) {
										item_marker_display.data.push({
											...item_rubrique,
											rubrique_type: key_rubrique_type,
										});
									}
								}
								return item_marker_display;
							});
						}
					});
				}
			}

			this.markers_display = markers_display;
			console.log(this.markers_display);
		}

		let count_remove = 0;
		this.markers.eachLayer((marker) => {
			const marker_options_id = marker.options.id;
			const marker_options_rubrique_type = marker.options.type;

			const latLng = marker.getLatLng();
			const key_lat = parseFloat(parseFloat(latLng.lat).toFixed(ratio)).toString();

			if (
				this.markers_display.some(
					(item_marker_display) => item_marker_display.lat.toString() === key_lat.toString()
				)
			) {
				const item_marker_display_data = this.markers_display.find(
					(item_marker_display) => item_marker_display.lat.toString() === key_lat
				);

				if (
					!item_marker_display_data.data.some(
						(item_marker_data) =>
							item_marker_data.id === marker_options_id &&
							item_marker_data.rubrique_type === marker_options_rubrique_type
					)
				) {
					this.markers.removeLayer(marker);
					count_remove++;
				}
			} else {
				this.markers.removeLayer(marker);
				count_remove++;
			}
		});
		console.log("count_remove: " + count_remove);

		let count_new_add = 0;
		this.markers_display.forEach((marker_to_display) => {
			marker_to_display.data.forEach((item_marker_to_display) => {
				///check if already in the markers
				let isAlreadyDisplay = false; ///check if this already displayed on the map (already in the markers)
				this.markers.eachLayer((marker) => {
					if (
						parseInt(marker.options.id) === parseInt(item_marker_to_display.id) &&
						marker.options.type === item_marker_to_display.rubrique_type
					) {
						isAlreadyDisplay = true;
					}
				});

				if (!isAlreadyDisplay) {
					const rubrique_object_type = this.allRubriques.find(
						(item) => item.api_name === item_marker_to_display.rubrique_type
					);
					rubrique_object_type.setSingleMarker(item_marker_to_display);
					count_new_add++;
				}
			});
		});
		console.log("count_new_add: " + count_new_add);

		// console.log(data_filter);
		//// Update icon size while zoom in or zoom out
		// const iconSize= zoom > 16 ? [35, 45 ] : ( zoom > 14 ? [25,35] : [15, 25])
		this.synchronizeAllIconSize();

		////count marker in map
		this.countMarkerInCart();
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
						item.data = [
							...item.data.filter(
								(jtem) => !(jtem.id === marker.options.id && jtem.rubrique_type === marker.options.type)
							),
						];
					}
					return item;
				});

				this.markers.removeLayer(marker);
				countMarkersRemoved++;
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
		} else {
			this.map.addLayer(this.markers);
		}
		this.addEventMapOnZoomend();
		this.bindActionToShowNavLeft();
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

					addRubriqueActivNavbar(
						this.allRubriques.find((item) => item.api_name === rubrique_api_name.toLowerCase())
					);

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

		this.markers_display = this.markers_display.map((item) => {
			item.data = item.data.filter(
				(jtem) => jtem.rubrique_type.toLowerCase() !== rubrique_api_name.toLowerCase()
			);

			return item;
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

		console.log(this.defaultData);

		this.updateMapAddRubrique(rubrique_api_name);
	}

	bindActionToShowNavLeft() {
		if (!document.querySelector(".cta_show_list_nav_left_jheo_js")) {
			console.log("Selector not found: 'cta_show_list_nav_left_jheo_js'");
			return;
		}

		const cta_show_list_nav_left = document.querySelector(".cta_show_list_nav_left_jheo_js");
		cta_show_list_nav_left.innerHTML = `
			<i class="fa-solid fa-list fa_solid_icon_nav_left_jheo_js" data-type="show"></i>
		`;

		cta_show_list_nav_left.addEventListener("click", () => {
			const fa_solid_icon_nav_left = document.querySelector(".fa_solid_icon_nav_left_jheo_js");
			if (fa_solid_icon_nav_left.getAttribute("data-type") === "show") {
				cta_show_list_nav_left.innerHTML = `
					<i class="fa-solid fa-xmark fa_solid_icon_nav_left_jheo_js" data-type="hide"></i>
				`;
			} else {
				cta_show_list_nav_left.innerHTML = `
					<i class="fa-solid fa-list fa_solid_icon_nav_left_jheo_js" data-type="show"></i>
				`;
			}

			document.querySelector(".content_list_nav_left_jheo_js").classList.toggle("d-none");
		});
	}

	generateTableDataFiltered(ratioMin, ratioMax, ratio) {
		const dataFiltered = [];

		let iterate_ratio = 1 / 10 ** ratio;

		let init_iterate_ratio = ratioMin;

		while (
			parseFloat(init_iterate_ratio.toFixed(ratio)) <
			parseFloat(parseFloat(ratioMax + iterate_ratio).toFixed(ratio))
		) {
			if (!dataFiltered.some((jtem) => parseFloat(init_iterate_ratio.toFixed(ratio)) === parseFloat(jtem.lat))) {
				dataFiltered.push({ ratio: ratio, lat: parseFloat(init_iterate_ratio.toFixed(ratio)), data: [] });
			}

			init_iterate_ratio += iterate_ratio;
		}

		return dataFiltered;
	}

	updateMapAddRubrique(rubrique_type) {
		const rubrique_type_object = this.allRubriques.find((item) => item.api_name === rubrique_type);

		const zoom = this.map._zoom;
		const current_object_dataMax = this.objectRatioAndDataMax.find((item) => zoom >= parseInt(item.zoomMin));
		console.log(current_object_dataMax);

		const { dataMax, ratio } = current_object_dataMax;

		const x = this.getMax(this.map.getBounds().getWest(), this.map.getBounds().getEast()); ///lat
		const y = this.getMax(this.map.getBounds().getNorth(), this.map.getBounds().getSouth()); ///lng

		this.markers_display =
			this.markers_display.length === 0 /// [ { lat: ( with ratio ), data: [] } ]
				? this.generateTableDataFiltered(y.min, y.max, ratio)
				: this.markers_display;

		const data_rubrique_add = this.defaultData[rubrique_type]["data"];
		data_rubrique_add?.forEach((item) => {
			const lat_item = parseFloat(item.lat).toFixed(ratio);

			const data_filter_state = this.markers_display.find(
				(jtem) => jtem.lat.toString() === parseFloat(lat_item).toString()
			);

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
		});

		console.log(this.markers_display);
		this.countMarkerInCart();
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

	setSingleMarkerStation(item, options = {}) {
		const rubrique_type_object = this.allRubriques.find((item) => item.api_name === "station");
		const icon = rubrique_type_object.poi_icon.not_selected;

		let marker = this.newMarkerPOI(rubrique_type_object.api_name, item, icon);

		const miniFicheOnHover = setMiniFicheForStation(
			item.nom,
			item.adresse,
			item.prixE85,
			item.prixGplc,
			item.prixSp95,
			item.prixSp95E10,
			item.prixGasoil,
			item.prixSp98
		);

		marker.bindTooltip(miniFicheOnHover, { direction: "auto", offset: L.point(0, -30) }).openTooltip();

		this.markers.addLayer(marker);
	}

	setSingleMarkerTabac(item, options = {}) {
		const rubrique_type_object = this.allRubriques.find((item) => item.api_name === "tabac");
		const icon = rubrique_type_object.poi_icon.not_selected;

		let poi_options = { isPastille: true, is_pastille_vert: true, is_pastille_rouge: false };
		let marker = this.newMarkerPOI(rubrique_type_object.api_name, item, icon, poi_options);

		const title = `
			<span class='fw-bolder'> 
				Tabac: ${item.name}
			</span>
			<br>
			<span class='fw-boler'>
				Departement: ${item.dep} ${item.depName}
			</span>
			<br>
			<span class='fw-bolder'> 
				Adresse: ${item.numvoie} ${item.typevoie} ${item.nomvoie} ${item.codpost} ${item.villenorm}
			</span>
		`;

		marker.bindTooltip(title, { direction: "top", offset: L.point(20, -30) }).openTooltip();

		this.markers.addLayer(marker);
	}

	setSingleMarkerMarche(item, options = {}) {
		const rubrique_type_object = this.allRubriques.find((item) => item.api_name === "marche");
		const icon = rubrique_type_object.poi_icon.not_selected;

		let poi_options = { isPastille: true, is_pastille_vert: false, is_pastille_rouge: false };
		let marker = this.newMarkerPOI(rubrique_type_object.api_name, item, icon, poi_options);

		const title = `
			<span class='fw-bolder'> 
				Marché: ${item.denominationF}
			</span>
			<br>
			<span class='fw-bolder'> 
				Adresse: ${item.adresse}
			</span>
		`;

		marker.bindTooltip(title, { direction: "top", offset: L.point(20, -30) }).openTooltip();

		this.markers.addLayer(marker);
	}

	settingSingleMarkerGolf(item, options = {}) {
		const rubrique_type_object = this.allRubriques.find((item) => item.api_name === "golf");
		const icon = rubrique_type_object.poi_icon.not_selected;

		let poi_options = { isPastille: true, is_pastille_vert: true, is_pastille_rouge: false };
		let marker = this.newMarkerPOI(rubrique_type_object.api_name, item, icon, poi_options);

		const title = `
			<span class='fw-bolder'>
				Golf: ${item.name}
			</span>
			<br>
			<span class='fw-boler'>
				Departement: ${item.dep} ${item.nom_dep}
			</span>
			<br>
			<span class='fw-bolder'> 
				Adresse: ${item.commune} ${item.adress}
			</span>
		`;

		marker.bindTooltip(title, { direction: "top", offset: L.point(20, -30) }).openTooltip();

		this.markers.addLayer(marker);
	}

	newMarkerPOI(rubrique_type, singleData, poi_icon, options = {}) {
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

		const path_icon = IS_DEV_MODE ? `/${poi_icon}` : `/public/${poi_icon}`;

		let point_pastille = "";
		if (options?.isPastille) {
			const wh_m_poi_pas_size = { min: 7, max: 12 };
			const left_pos_m_poi_size = { min: 342, max: 482 };

			let wh_m_poi_pas = calculeProgression(wh_m_poi_pas_size, zoom_size, zoom);
			let left_pos_m_poi = calculeProgression(left_pos_m_poi_size, zoom_size, zoom);

			let style_m_poi_pas = `width:${wh_m_poi_pas.toFixed(1)}px!important;`;
			style_m_poi_pas = `${style_m_poi_pas}height:${wh_m_poi_pas.toFixed(1)}px!important;`;
			style_m_poi_pas = `${style_m_poi_pas}left:${left_pos_m_poi.toFixed(1)}%!important;`;

			if (options.is_pastille_vert) {
				point_pastille = `<div class="single_marker_point_pastille" data-pastille-type="green" style="background-color:green;${style_m_poi_pas}"></div>`;
			} else if (options.is_pastille_rouge) {
				point_pastille = `<div class="single_marker_point_pastille" data-pastille-type="red" style="background-color:red;${style_m_poi_pas}"></div>`;
			}
		}

		return new L.Marker(L.latLng(parseFloat(singleData.lat), parseFloat(singleData.long)), {
			icon: new L.DivIcon({
				className: "content_single_marker_poi",
				html: ` 
					<div class="single_marker_poi" style="${style_m_poi}">
						${point_pastille}
						<img class="single_marker_image" style="${style_image}" src="${path_icon}"/>
						<div class="single_marker_note">2.1</div>
						<div class="single_marker_point" style="${style_marker_point}"></div>
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

		// <div class="single_marker_poi" style="width:52.1px!important;height:21.5px!important;border-radius:10.8px!important;">
		// 	<div class="single_marker_point_pastille" style="background-color: red;width:7.4px!important;height:7.4px!important;left:353.7%!important;"></div>
		// 	<img class="single_marker_image" style="width:13.8px;height:17.1px" src="/assets/icon/NewIcons/mini_logo_resto.png">
		// 	<div class="single_marker_note">2.1</div>
		// 	<div class="single_marker_point" style="width:10.0px!important;height:10.0px!important;bottom:-120.1%!important;"></div>
		// </div>
	}
}
