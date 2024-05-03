class RubriqueCMZ extends MapCMZ {
	constructor() {
		super();
		this.api_data = "/dataHome";

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
				icon: "assets/icon/NewIcons/mini_logo_resto_selected.png",
				isFirstResquest: true,
				poi_icon: {
					selected: "assets/icon/NewIcons/mini_logo_resto_selected.png",
					not_selected: "assets/icon/NewIcons/mini_logo_resto.png",
				},
				is_active: false,
				filter: {
					is_filtered: false,
					departement: "tous",
					notation: {
						min: 0,
						max: 5,
					},
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
			},
			{
				name: "Ferme",
				api_name: "ferme",
				icon: "assets/icon/NewIcons/mini_logo_ferme_selected.png",
				isFirstResquest: true,
				poi_icon: {
					selected: "assets/icon/NewIcons/mini_logo_ferme_selected.png",
					not_selected: "assets/icon/NewIcons/mini_logo_ferme.png",
				},
				is_active: false,
				filter: {
					is_filtered: false,
					departement: "tous",
					notation: {
						min: 0,
						max: 5,
					},
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
			},
			{
				name: "Station",
				api_name: "station",
				icon: "assets/icon/NewIcons/mini_logo_station.png",
				isFirstResquest: true,
				poi_icon: {
					selected: "assets/icon/NewIcons/mini_logo_station_selected.png",
					not_selected: "assets/icon/NewIcons/mini_logo_station.png",
				},
				is_active: false,
				filter: {
					is_filtered: false,
					departement: "tous",
					notation: {
						min: 0,
						max: 5,
					},
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
			},
			{
				name: "Golf",
				api_name: "golf",
				icon: "assets/icon/NewIcons/mini_logo_golf_selected.png",
				isFirstResquest: true,
				poi_icon: {
					selected: "assets/icon/NewIcons/mini_logo_golf_selected.png",
					not_selected: "assets/icon/NewIcons/mini_logo_golf.png",
				},
				is_active: false,
				filter: {
					is_filtered: false,
					departement: "tous",
					notation: {
						min: 0,
						max: 5,
					},
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
			},
			{
				name: "Tabac",
				api_name: "tabac",
				icon: "assets/icon/NewIcons/mini_logo_tabac_selected.png",
				isFirstResquest: true,
				poi_icon: {
					selected: "assets/icon/NewIcons/mini_logo_tabac_selected.png",
					not_selected: "assets/icon/NewIcons/mini_logo_tabac.png",
				},
				is_active: false,
				filter: {
					is_filtered: false,
					departement: "tous",
					notation: {
						min: 0,
						max: 5,
					},
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
			},
			{
				name: "Marché",
				api_name: "marche",
				icon: "assets/icon/NewIcons/mini_logo_marche_selected.png",
				isFirstResquest: true,
				poi_icon: {
					selected: "assets/icon/NewIcons/mini_logo_marche_selected.png",
					not_selected: "assets/icon/NewIcons/mini_logo_marche.png",
				},
				is_active: false,
				filter: {
					is_filtered: false,
					departement: "tous",
					notation: {
						min: 0,
						max: 5,
					},
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
			},
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
				filter: {
					is_filtered: false,
					departement: "tous",
					notation: {
						min: 0,
						max: 5,
					},
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
				filter: {
					is_filtered: false,
					departement: "tous",
					notation: {
						min: 0,
						max: 5,
					},
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
				filter: {
					is_filtered: false,
					departement: "tous",
					notation: {
						min: 0,
						max: 5,
					},
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
				filter: {
					is_filtered: false,
					departement: "tous",
					notation: {
						min: 0,
						max: 5,
					},
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
			},
		];

		const rubrique_active_default = ["restaurant", "ferme", "station"];

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

	onInitMarkerCluster() {
		////create new marker Cluster for POI etablisment
		this.createMarkersCluster();
		////create new marker Cluster special for count per dep.
		this.createMarkersClusterForCountPerDep();

		this.addRubriqueActiveByDefault();

		this.addEventOnMap();
	}

	addRubriqueActiveByDefault() {
		///add rubrique active on the nav bar (in map_cmz_fonction.js)
		this.allRubriques.forEach((item) => {
			if (item.is_active) {
				addRubriqueActivNavbar(item);
			}
		});

		////fetch data foreach rubrique active by default.
		this.fetchDataIterator();
	}

	fetchDataIterator() {
		const default_rubrique_active = this.allRubriques.filter((item) => item.is_active === true);
		const rubrique_iterator = default_rubrique_active[Symbol.iterator]();

		this.fetchOriginDataItem(rubrique_iterator);
	}

	async fetchOriginDataItem(rubrique_iterator) {
		const data_rubrique = rubrique_iterator.next().value;

		if (data_rubrique !== undefined) {
			const api_name = data_rubrique.api_name;
			const isFirstResquest = data_rubrique.isFirstResquest;

			const response = await this.fetchDataRubrique(api_name.toLowerCase(), { isFirstResquest, data_max: 50 });
			const data_pastille = response.hasOwnProperty("pastille") ? response.pastille : [];

			this.defaultData[api_name] = {
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
				...this.defaultData[api_name],
			};

			this.updateMapAddRubrique(api_name);

			this.fetchOriginDataItem(rubrique_iterator);
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
		this.map.on("movestart", (e) => {
			this.map.off("movestart");

			// const fa_solid_icon_nav_left = document.querySelector(".fa_solid_icon_nav_left_jheo_js");
			// if (fa_solid_icon_nav_left.getAttribute("data-type") === "show") {
			// 	fa_solid_icon_nav_left.click();
			// }

			this.handleEventMoveStartForMemoryCenter(e);
		});

		this.addEventOnMapDragend();

		this.addEventOnMapZoomend();
	}

	addEventOnMapDragend() {
		this.map.on("dragend ", (e) => {
			this.map.off("dragend");

			this.handleEventMoveendForMemoryCenter(e);

			const x = this.getMax(this.map.getBounds().getWest(), this.map.getBounds().getEast());
			const y = this.getMax(this.map.getBounds().getNorth(), this.map.getBounds().getSouth());

			const new_size = { minx: x.min, miny: y.min, maxx: x.max, maxy: y.max };

			this.updateMarkersDisplayForDragend(new_size);

			this.addPeripheriqueMarker();
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

			this.addPeripheriqueMarker();
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
				const data_max_fetching = Math.ceil((5 * 10) / default_rubrique_active.length);

				const response = await this.fetchDataRubrique(api_name.toLowerCase(), { data_max: data_max_fetching });
				if (response.data.length > 0) {
					///add data peripherique
					this.addMarkerPeripherique(response.data, api_name);
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

							const marker_to_remove = marker_display_object.markers.find((item_marker_display_objet) => {
								return (
									parseInt(item_marker_display_objet.options.id) === parseInt(item_radom.id) &&
									item_marker_display_objet.options.type === item_radom.rubrique_type
								);
							});

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
		});

		const new_data_rubrique = data.filter(
			(item) => !this.defaultData[rubrique_type].data.some((jtem) => parseInt(jtem.id) === parseInt(item.id))
		);

		this.defaultData[rubrique_type]["data"] = [...new_data_rubrique, ...this.defaultData[rubrique_type]["data"]];

		this.addDataToTableListLeft(new_data_rubrique, rubrique_type);
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
				<tr style="border: 1px solid transparent;">
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
	 * où: on Utilise cette fonction dans la rubrique resto,
	 * je veux: mise a jour les données sur la carte,
	 * @param {} newSize  { minx, maxx, miny, maxy }
	 *
	 * - remove markers outside the box
	 * - Add some markers ( via latitude, ratio, dataMax )
	 * -
	 */
	updateMarkersDisplay(newSize) {
		const { minx, maxx, miny, maxy } = newSize;

		// ///REMOVE THE OUTSIDE THE BOX
		this.removeMarkerOutSideTheBox(newSize);

		const zoom = this.map._zoom;
		const current_object_dataMax = this.objectRatioAndDataMax.find((item) => zoom >= parseInt(item.zoomMin));
		const { dataMax, ratio } = current_object_dataMax;

		const x = this.getMax(this.map.getBounds().getWest(), this.map.getBounds().getEast()); ///lat
		const y = this.getMax(this.map.getBounds().getNorth(), this.map.getBounds().getSouth()); ///lng

		//// update this.markers_display if needed... and update marker display on the map.
		let markers_display = [...this.markers_display];

		let isUpdate = this.markers_display.length > 0 && dataMax !== this.markers_display[0]["dataMax"];

		if (isUpdate) {
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

						const isInDisplay =
							item_rubrique.lat > parseFloat(miny) &&
							item_rubrique.lat < parseFloat(maxy) &&
							item_rubrique.long > parseFloat(minx) &&
							item_rubrique.long < parseFloat(maxx);

						if (isInDisplay) {
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

										/*

										let is_already_on_map = false;
										this.markers.eachLayer((marker) => {
											if (
												parseInt(marker.options.id) === item_rubrique &&
												marker.options.type === key_rubrique_type
											) {
												is_already_on_map = true;
											}
										});

										if (!is_already_on_map) {
											rubrique_active.setSingleMarker(item_rubrique);
										} else {
											item_marker_display.markers.push(
												this.markers_display.markers.find(
													(marker) =>
														parseInt(marker.options.id) === item_rubrique.id &&
														marker.options.type === key_rubrique_type
												)
											);
										}

										*/
									}
								}
								return item_marker_display;
							});
						}
					});
				}
			}

			markers_display.forEach((item_markers_display) => {
				const item_markers_display_data = item_markers_display.data;
				if (item_markers_display_data.length > 0) {
					item_markers_display_data.forEach((jtem_marker_display_data) => {
						const { rubrique_type } = jtem_marker_display_data;
						const rubrique_type_object = this.allRubriques.find((item) => item.api_name === rubrique_type);

						let is_already_on_map = false;
						let marker_already_on_map = null;
						this.markers.eachLayer((marker) => {
							if (
								parseInt(marker.options.id) === jtem_marker_display_data.id &&
								marker.options.type === jtem_marker_display_data.type
							) {
								is_already_on_map = true;
							}
						});

						if (!is_already_on_map) {
							rubrique_type_object.setSingleMarker(jtem_marker_display_data);
						}
					});
				}
			});

			/*
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
								parseInt(item_marker_data.id) === parseInt(marker_options_id) &&
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

			this.markers_display = [...markers_display];

			*/
		} else {
			let count_add = 0;

			const rubrique_active = this.allRubriques.filter((item) => item.is_active === true);
			const rubrique_active_length = rubrique_active.length;

			const dataMax_with_on_rubrique_active = dataMax * rubrique_active_length;

			const marker_display_copie = [...this.markers_display];

			marker_display_copie.forEach((item_marker_display_copie) => {
				if (
					item_marker_display_copie.data.length < dataMax_with_on_rubrique_active &&
					item_marker_display_copie.markers.length < dataMax_with_on_rubrique_active
				) {
					///// mila fenoina....
					const item_marker_display_copie_lat = item_marker_display_copie.lat;

					rubrique_active.forEach((item_rubrique_active) => {
						const { api_name } = item_rubrique_active;

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
								if (
									!item_marker_display_original.data.some(
										(item) =>
											item.id === item_data_rubrique_active.id && item.rubrique_type === api_name
									)
								) {
									const lat_item = parseFloat(item_data_rubrique_active.lat).toFixed(ratio);

									if (lat_item.toString() === item_marker_display_copie.lat.toString()) {
										const isInDisplay =
											item_data_rubrique_active.lat > parseFloat(miny) &&
											item_data_rubrique_active.lat < parseFloat(maxy) &&
											item_data_rubrique_active.long > parseFloat(minx) &&
											item_data_rubrique_active.long < parseFloat(maxx);

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

											count_add++;
										}
									}
								}
							});
						}
					});
				}
			});
		}

		/*

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
		*/

		//// Update icon size while zoom in or zoom out
		this.synchronizeAllIconSize();

		////count marker in map
		this.countMarkerInCart();
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
		const { minx, maxx, miny, maxy } = newSize;

		// ///REMOVE THE OUTSIDE THE BOX
		this.removeMarkerOutSideTheBox(newSize);

		const zoom = this.map._zoom;
		const current_object_dataMax = this.objectRatioAndDataMax.find((item) => zoom >= parseInt(item.zoomMin));
		const { dataMax, ratio } = current_object_dataMax;

		let count_add = 0;

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
				///// mila fenoina....
				const item_marker_display_copie_lat = item_marker_display_copie.lat;

				rubrique_active.forEach((item_rubrique_active) => {
					const { api_name } = item_rubrique_active;

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
							if (
								!item_marker_display_original.data.some(
									(item) =>
										parseInt(item.id) === parseInt(item_data_rubrique_active.id) &&
										item.rubrique_type === api_name
								)
							) {
								const lat_item = parseFloat(item_data_rubrique_active.lat).toFixed(ratio);

								if (lat_item.toString() === item_marker_display_copie.lat.toString()) {
									const isInDisplay =
										item_data_rubrique_active.lat > parseFloat(miny) &&
										item_data_rubrique_active.lat < parseFloat(maxy) &&
										item_data_rubrique_active.long > parseFloat(minx) &&
										item_data_rubrique_active.long < parseFloat(maxx);

									if (isInDisplay) {
										item_rubrique_active.setSingleMarker(item_data_rubrique_active);

										this.markers_display = this.markers_display.map((item_marker_display_edit) => {
											if (item_marker_display_edit.lat === item_marker_display_copie_lat) {
												item_marker_display_edit["data"] = [
													{ ...item_data_rubrique_active, rubrique_type: api_name },
													...item_marker_display_edit["data"],
												];
											}
											return item_marker_display_edit;
										});

										count_add++;
									}
								}
							}
						});
					}
				});
			}
		});

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
				///// mila fenoina....

				const item_marker_display_copie_lat = item_marker_display_copie.lat;

				rubrique_active.forEach((item_rubrique_active) => {
					const { api_name } = item_rubrique_active;

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
							if (
								!item_marker_display_original.data.some(
									(item) =>
										parseInt(item.id) === parseInt(item_data_rubrique_active.id) &&
										item.rubrique_type === api_name
								)
							) {
								const lat_item = parseFloat(item_data_rubrique_active.lat).toFixed(ratio);

								if (lat_item.toString() === item_marker_display_copie.lat.toString()) {
									const isInDisplay =
										item_data_rubrique_active.lat > parseFloat(miny) &&
										item_data_rubrique_active.lat < parseFloat(maxy) &&
										item_data_rubrique_active.long > parseFloat(minx) &&
										item_data_rubrique_active.long < parseFloat(maxx);

									if (isInDisplay) {
										item_rubrique_active.setSingleMarker(item_data_rubrique_active);

										this.markers_display = this.markers_display.map((item_marker_display_edit) => {
											if (item_marker_display_edit.lat === item_marker_display_copie_lat) {
												item_marker_display_edit["data"] = [
													{ ...item_data_rubrique_active, rubrique_type: api_name },
													...item_marker_display_edit["data"],
												];
											}
											return item_marker_display_edit;
										});
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

		if (this.lastNiveauZoomAction < this.map._zoom) {
			// ///REMOVE THE OUTSIDE THE BOX
			this.removeMarkerOutSideTheBox(newSize);

			if (isUpdate) {
				const y = this.getMax(this.map.getBounds().getNorth(), this.map.getBounds().getSouth()); ///lng

				let markers_display = this.generateTableDataFiltered(y.min, y.max, ratio); /// [ { lat: ( with ratio ), data: [] } ]

				///check if this rubrique_type is active...
				let rubrique_active = this.allRubriques.filter((item) => item.is_active === true);

				for (const key_rubrique_type in this.defaultData) {
					///check if this rubrique_type is active...
					let is_rubrique_type_active = rubrique_active.some((item) => item.api_name === key_rubrique_type);

					if (is_rubrique_type_active) {
						const rubrique_type = this.defaultData[key_rubrique_type];

						rubrique_type.data.forEach((item_rubrique) => {
							let lat_item_rubrique = parseFloat(parseFloat(item_rubrique.lat).toFixed(ratio));

							const isInDisplay =
								item_rubrique.lat > parseFloat(miny) &&
								item_rubrique.lat < parseFloat(maxy) &&
								item_rubrique.long > parseFloat(minx) &&
								item_rubrique.long < parseFloat(maxx);

							if (isInDisplay) {
								markers_display = markers_display.map((item_marker_display) => {
									if (item_marker_display.lat.toString() === lat_item_rubrique.toString()) {
										let count_data_per_rubrique = item_marker_display.data.reduce((sum, item) => {
											if (item.rubrique_type === rubrique_type) {
												sum = sum + 1;
											}
											return sum;
										}, 0);

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
				this.completeMarkerDisplay(newSize, dataMax, ratio);
			}
			//// in
		} else {
			//// out
			if (isUpdate) {
				const y = this.getMax(this.map.getBounds().getNorth(), this.map.getBounds().getSouth()); ///lng

				let markers_display = this.generateTableDataFiltered(y.min, y.max, ratio); /// [ { lat: ( with ratio ), data: [] } ]

				///check if this rubrique_type is active...
				let rubrique_active = this.allRubriques.filter((item) => item.is_active === true);

				for (const key_rubrique_type in this.defaultData) {
					///check if this rubrique_type is active...
					let is_rubrique_type_active = rubrique_active.some((item) => item.api_name === key_rubrique_type);

					if (is_rubrique_type_active) {
						const rubrique_type = this.defaultData[key_rubrique_type];

						rubrique_type.data.forEach((item_rubrique) => {
							let lat_item_rubrique = parseFloat(parseFloat(item_rubrique.lat).toFixed(ratio));

							const isInDisplay =
								item_rubrique.lat > parseFloat(miny) &&
								item_rubrique.lat < parseFloat(maxy) &&
								item_rubrique.long > parseFloat(minx) &&
								item_rubrique.long < parseFloat(maxx);

							if (isInDisplay) {
								markers_display = markers_display.map((item_marker_display) => {
									if (item_marker_display.lat.toString() === lat_item_rubrique.toString()) {
										let count_data_per_rubrique = item_marker_display.data.reduce((sum, item) => {
											if (item.rubrique_type === rubrique_type) {
												sum = sum + 1;
											}
											return sum;
										}, 0);

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
		//// api get all data from server;
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

		let btn_rubrique = this.allRubriques.map((item) => {
			const icon_image = IS_DEV_MODE ? `/${item.icon}` : `/public/${item.icon}`;
			const class_active = item.is_active ? "btn-primary" : "btn-light";

			let badge_filter = "";
			if (item.filter.is_filtered === true) {
				badge_filter = `
					<span class="badge_position_filter cursor_pointer translate-middle badge rounded-pill bg-danger" 
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
					<div class="d-none tooltip_rubrique_filter tooltip_rubrique_filter_jheo_js">
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

		document.querySelector(".content_right_side_body_jheo_js").innerHTML = `
            <div class="rubrique_list right_side_body_jheo_js">
                ${btn_rubrique.join("")}
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
			btn_rubrique.addEventListener("mouseover", () => {
				btn_rubrique.querySelector(".tooltip_rubrique_filter_jheo_js")?.classList?.remove("d-none");
			});

			btn_rubrique.addEventListener("mouseout", () => {
				btn_rubrique.querySelector(".tooltip_rubrique_filter_jheo_js")?.classList?.add("d-none");
			});

			btn_rubrique.querySelector(".rubrique_icon_text_jheo_js").addEventListener("click", () => {
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

					///remove rubrique active on the nav bar (in map_cmz_fonction.js)
					removeRubriqueActivNavbar(rubrique_type);

					this.removeRubriqueMarker(rubrique_api_name);

					btn_rubrique.querySelector(".fa_solide_open_rubrique_jheo_js").remove();
					btn_rubrique.querySelector(".tooltip_rubrique_filter_jheo_js").remove();
				} else {
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

					this.addRubriqueMarker(rubrique_api_name);

					if (!btn_rubrique.querySelector(".fa_solide_open_rubrique_jheo_js")) {
						btn_rubrique.insertAdjacentHTML(
							"beforeend",
							`
								<i class="fa-solid fa-ellipsis fa-rotate-90 ms-1 fa_solide_open_rubrique_jheo_js" onclick="openRubriqueFilter('${rubrique_api_name}')"></i>
								<div class="d-none tooltip_rubrique_filter tooltip_rubrique_filter_jheo_js">
									Cliquez ici pour voir les filtres
								</div>
							`
						);
					}
				}
			});

			btn_rubrique.addEventListener("dblclick", () => {
				all_button_rubrique.forEach((item) => {
					if (item.classList.contains("btn-primary")) {
						item.classList.remove("btn-primary");
						item.classList.add("btn-light");

						const rubrique_type = item.getAttribute("data-type");
						const rubrique_not_clicked = this.allRubriques.find((item) => item.name === rubrique_type);

						const rubrique_api_name = item.getAttribute("data-api_name");

						if (rubrique_not_clicked.is_active === true) {
							this.allRubriques = [
								...this.allRubriques.map((item) => {
									if (item.name === rubrique_type) {
										item.is_active = false;
									}
									return item;
								}),
							];

							///remove rubrique active on the nav bar (in map_cmz_fonction.js)
							removeRubriqueActivNavbar(rubrique_type);

							this.removeRubriqueMarker(rubrique_api_name);

							item.querySelector(".fa_solide_open_rubrique_jheo_js").remove();
							item.querySelector(".tooltip_rubrique_filter_jheo_js").remove();
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

				this.addRubriqueMarker(rubrique_api_name);

				if (!btn_rubrique.querySelector(".fa_solide_open_rubrique_jheo_js")) {
					btn_rubrique.insertAdjacentHTML(
						"beforeend",
						`
							<i class="fa-solid fa-ellipsis fa-rotate-90 ms-1 fa_solide_open_rubrique_jheo_js" onclick="openRubriqueFilter('${rubrique_api_name}')"></i>
							<div class="d-none tooltip_rubrique_filter tooltip_rubrique_filter_jheo_js">
								Cliquez ici pour voir les filtres
							</div>
						`
					);
				}
			});
		});
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
					this.injectListRubriqueType();

					document.querySelector(".close_right_side_jheo_js").addEventListener("click", () => {
						this.closeRightSide();
					});
				});
			}

			this.handleActionFilter(rubrique_type);
		} catch (error) {
			console.log(error);
		}
	}

	handleActionFilter(rubrique_type) {
		if (!document.querySelector(".filter_departement_jheo_js")) {
			console.log("Selector not found: 'filter_departement_jheo_js'");
			return false;
		}

		if (!document.querySelector(".cta_to_filter_jheo_js")) {
			console.log("Selector not found: 'cta_to_filter_jheo_js'");
			return false;
		}

		const skipSlider = document.getElementById("skipstep");
		const filter_departement = document.querySelector(".filter_departement_jheo_js");
		const cta_to_filter = document.querySelector(".cta_to_filter_jheo_js");

		cta_to_filter.addEventListener("click", () => {
			cta_to_filter.innerText = "Recherche en cours...";
			cta_to_filter.classList.remove("btn-primary");
			cta_to_filter.classList.add("btn-secondary");

			const filter_price = skipSlider.noUiSlider.get();
			const filter_dep_value = filter_departement.value;

			this.allRubriques = this.allRubriques.map((rubrique) => {
				if (rubrique.api_name === rubrique_type) {
					rubrique = {
						...rubrique,
						filter: {
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

			if (document.querySelector(`.badge_navbar_${rubrique_type}_jheo_js`)) {
				const badge_navbar_rubrique = document.querySelector(`.badge_navbar_${rubrique_type}_jheo_js`);
				if (badge_navbar_rubrique.classList.contains("d-none")) {
					badge_navbar_rubrique.classList.remove("d-none");
				}
			}
		});

		const cta_to_cancel_filter = document.querySelector(".cta_to_cancel_filter_jheo_js");
		cta_to_cancel_filter.addEventListener("click", () => {
			this.allRubriques = this.allRubriques.map((rubrique) => {
				if (rubrique.api_name === rubrique_type) {
					rubrique = {
						...rubrique,
						filter: {
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

			///inject filter for notation
			this.resetSliderNotation();

			if (document.querySelector(`.badge_navbar_${rubrique_type}_jheo_js`)) {
				const badge_navbar_rubrique = document.querySelector(`.badge_navbar_${rubrique_type}_jheo_js`);
				if (!badge_navbar_rubrique.classList.contains("d-none")) {
					badge_navbar_rubrique.classList.add("d-none");
				}
			}
		});
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
					<a class="navbar-brand cancel_filter cta_to_cancel_filter_jheo_js" href="#">Annuler tout</a>
					<button type="button" class="btn btn-primary cta_to_filter cta_to_filter_jheo_js">Voir les résultats</button>
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
	 * 	 this.handleActionFilter()
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
	}

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
			return [];
		}
	}

	async addRubriqueMarker(rubrique_api_name) {
		const response = await this.fetchDataRubrique(rubrique_api_name.toLowerCase());
		this.defaultData[rubrique_api_name] = {
			data: response.data,
			...this.defaultData[rubrique_api_name],
		};

		this.updateMapAddRubrique(rubrique_api_name);
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
			let { api_name, name: name_rubrique } = rubrique;

			let data_rubrique = this.defaultData[api_name];
			let data_rubrique_data = data_rubrique["data"];

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
				<tr style="border: 1px solid transparent;">
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

	createItemRubriqueActive(item_data) {
		const rubrique_active = this.allRubriques.find((item) => item.api_name === item_data.rubrique_type);

		const item_rubrique = rubrique_active.setListItemRubriqueActive(item_data);
		return item_rubrique;
	}

	cardItemRubriqueNameNoteAddress(name, note, address, options = {}) {
		const { id: id_rubrique, type: rubrique_type } = options;
		return `
			<figure id="${rubrique_type}_${id_rubrique}">
				<blockquote class="blockquote mb-0">
					<p class="name_rubrique_nav_left" onclick="openDetailsRubriqueFromLeft('${id_rubrique}', '${rubrique_type}')">
						${name.toUpperCase()}
					</p>
				</blockquote>
				<div class="stars">
					<i class="fa-solid fa-star"></i>
					<i class="fa-solid fa-star"></i>
					<i class="fa-solid fa-star"></i>
					<i class="fa-solid fa-star"></i>
					<i class="fa-solid fa-star"></i>
				</div>
				<figcaption class="blockquote-footer mt-0 mb-0">
					Adresse: <br> <cite title="Source Title">${address.toLowerCase()}</cite>
				</figcaption>
			</figure>
		`;
	}

	cardItemRubriqueImage() {
		return `
			<img class="img-fluid rounded" alt="image"
				src="https://images.unsplash.com/photo-1592861956120-e524fc739696?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D">
		`;
	}

	setListItemRubriqueActiveResto(item_data) {
		const { id, denominationF, name_rubrique, numvoie, typevoie, nomvoie, codpost, villenorm } = item_data;
		const adresse = `${numvoie} ${typevoie} ${nomvoie} ${codpost} ${villenorm}`;
		const nom = denominationF;
		const note = 5;

		const item_rubrique = `
			<div class="card" style="max-width: 540px;">
				<div class="card-body">
					<div class="row g-0">
						<div class="col-12">
							<h5 class="card-title">${name_rubrique.toUpperCase()}</h5>
						</div>
					</div>
					<div class="row g-0">
						<div class="col-md-8">
							${this.cardItemRubriqueNameNoteAddress(nom, note, adresse, { id, type: "restaurant" })}
						</div>
						<div class="col-md-4">
							${this.cardItemRubriqueImage()}
						</div>
					</div>
				</div>
			</div>
		`;

		return item_rubrique;
	}

	setListItemRubriqueActiveFerme(item_data) {
		const { id, name_rubrique, adresseFerme, nomFerme } = item_data;
		const adresse = `${adresseFerme}`;
		const nom = nomFerme;
		const note = 5;

		const item_rubrique = `
			<div class="card" style="max-width: 540px;">
				<div class="card-body">
					<div class="row g-0">
						<div class="col-12">
							<h5 class="card-title">${name_rubrique.toUpperCase()}</h5>
						</div>
					</div>
					<div class="row g-0">
						<div class="col-md-8">
							${this.cardItemRubriqueNameNoteAddress(nom, note, adresse, { id, type: "ferme" })}
						</div>
						<div class="col-md-4">
							${this.cardItemRubriqueImage()}
						</div>
					</div>
				</div>
			</div>
		`;

		return item_rubrique;
	}

	setListItemRubriqueActiveStation(item_data) {
		const { id, name_rubrique, adresse, nom } = item_data;
		const note = 5;

		const item_rubrique = `
			<div class="card" style="max-width: 540px;">
				<div class="card-body">
					<div class="row g-0">
						<div class="col-12">
							<h5 class="card-title">${name_rubrique.toUpperCase()}</h5>
						</div>
					</div>
					<div class="row g-0">
						<div class="col-md-8">
							${this.cardItemRubriqueNameNoteAddress(nom, note, adresse, { id, type: "station" })}
						</div>
						<div class="col-md-4">
							${this.cardItemRubriqueImage()}
						</div>
					</div>
				</div>
			</div>
		`;

		return item_rubrique;
	}

	setListItemRubriqueActiveGolf(item_data) {
		const { id, name: nom, name_rubrique, adress: adresse } = item_data;
		const note = 5;

		const item_rubrique = `
			<div class="card" style="max-width: 540px;">
				<div class="card-body">
					<div class="row g-0">
						<div class="col-12">
							<h5 class="card-title">${name_rubrique.toUpperCase()}</h5>
						</div>
					</div>
					<div class="row g-0">
						<div class="col-md-8">
							${this.cardItemRubriqueNameNoteAddress(nom, note, adresse, { id, type: "golf" })}
						</div>
						<div class="col-md-4">
							${this.cardItemRubriqueImage()}
						</div>
					</div>
				</div>
			</div>
		`;

		return item_rubrique;
	}

	setListItemRubriqueActiveMarche(item_data) {
		const { id, denominationF, name_rubrique, adresse } = item_data;
		const nom = denominationF;
		const note = 5;

		const item_rubrique = `
			<div class="card" style="max-width: 540px;">
				<div class="card-body">
					<div class="row g-0">
						<div class="col-12">
							<h5 class="card-title">${name_rubrique.toUpperCase()}</h5>
						</div>
					</div>
					<div class="row g-0">
						<div class="col-md-8">
							${this.cardItemRubriqueNameNoteAddress(nom, note, adresse, { id, type: "marche" })}
						</div>
						<div class="col-md-4">
							${this.cardItemRubriqueImage()}
						</div>
					</div>
				</div>
			</div>
		`;

		return item_rubrique;
	}

	setListItemRubriqueActiveTabac(item_data) {
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
		const note = 5;

		const item_rubrique = `
			<div class="card" style="max-width: 540px;">
				<div class="card-body">
					<div class="row g-0">
						<div class="col-12">
							<h5 class="card-title">${name_rubrique.toUpperCase()}</h5>
						</div>
					</div>
					<div class="row g-0">
						<div class="col-md-8">
							${this.cardItemRubriqueNameNoteAddress(nom, note, adresse, { id, type: "tabac" })}
						</div>
						<div class="col-md-4">
							${this.cardItemRubriqueImage()}
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
		const rubrique_type_object = this.allRubriques.find((item) => item.api_name === "restaurant");
		const icon = rubrique_type_object.poi_icon.not_selected;

		const data_resto_pastille = this.defaultData["restaurant"]["pastille"];

		const count_pastille = data_resto_pastille.reduce((sum, item_resto_pastille) => {
			if (parseInt(item_resto_pastille.id_resto) === parseInt(item.id)) {
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

	setMiniFicheFerme(nom, departement, adresse, options = {}) {
		const mini_fiche = `
			<button type="button" class="btn btn-primary btn-sm m-1" style="text-align: start;">
				${this.setMiniFicheGlobal("Ferme", nom, departement, adresse)}
			</button>
		`;

		return mini_fiche;
	}

	setSingleMarkerFerme(item, options = {}) {
		const rubrique_type_object = this.allRubriques.find((item) => item.api_name === "ferme");
		const icon = rubrique_type_object.poi_icon.not_selected;

		let marker = this.newMarkerPOI(rubrique_type_object.api_name, item, icon);

		const mini_fiche = rubrique_type_object.setMiniFiche(item.nomFerme, item.departement, item.adresseFerme);

		marker.bindTooltip(mini_fiche, { direction: "auto", offset: L.point(0, -30) }).openTooltip();

		this.markers.addLayer(marker);

		this.bindEventClickOnMarker(marker, item);

		this.saveMarkerDisplay(item, marker);
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

	setSingleMarkerStation(item, options = {}) {
		const rubrique_type_object = this.allRubriques.find((item) => item.api_name === "station");
		const icon = rubrique_type_object.poi_icon.not_selected;

		let marker = this.newMarkerPOI(rubrique_type_object.api_name, item, icon);

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

	setSingleMarkerTabac(item, options = {}) {
		const rubrique_type_object = this.allRubriques.find((item) => item.api_name === "tabac");
		const icon = rubrique_type_object.poi_icon.not_selected;

		let poi_options = { isPastille: true, is_pastille_vert: true, is_pastille_rouge: false };
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

	setMiniFicheMarche(nom, departement, adresse, options = {}) {
		const mini_fiche = `
			<button type="button" class="btn btn-primary btn-sm m-1" style="text-align: start;">
				${this.setMiniFicheGlobal("Tabac", nom, departement, adresse)}
			</button>
		`;

		return mini_fiche;
	}

	setSingleMarkerMarche(item, options = {}) {
		const rubrique_type_object = this.allRubriques.find((item) => item.api_name === "marche");
		const icon = rubrique_type_object.poi_icon.not_selected;

		let poi_options = { isPastille: true, is_pastille_vert: false, is_pastille_rouge: false };
		let marker = this.newMarkerPOI(rubrique_type_object.api_name, item, icon, poi_options);

		const miniFiche = rubrique_type_object.setMiniFiche(item.denominationF, item.dep, item.adresse);

		marker.bindTooltip(miniFiche, { direction: "top", offset: L.point(20, -30) }).openTooltip();

		this.markers.addLayer(marker);

		this.bindEventClickOnMarker(marker, item);

		this.saveMarkerDisplay(item, marker);
	}

	setMiniFicheGolf(nom, departement, adresse, options = {}) {
		const mini_fiche = `
			<button type="button" class="btn btn-primary btn-sm m-1" style="text-align: start;">
				${this.setMiniFicheGlobal("Tabac", nom, departement, adresse)}
			</button>
		`;

		return mini_fiche;
	}

	settingSingleMarkerGolf(item, options = {}) {
		const rubrique_type_object = this.allRubriques.find((item) => item.api_name === "golf");
		const icon = rubrique_type_object.poi_icon.not_selected;

		let poi_options = { isPastille: true, is_pastille_vert: true, is_pastille_rouge: false };
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

	newMarkerPOI(rubrique_type, singleData, poi_icon, options = {}) {
		const note = singleData.hasOwnProperty("moyenne_note") ? parseFloat(singleData.moyenne_note).toFixed(1) : "0.0";
		return new L.Marker(L.latLng(parseFloat(singleData.lat), parseFloat(singleData.long)), {
			icon: this.setDivIconMarker(poi_icon, note, options),
			id: singleData.id,
			type: rubrique_type,
			draggable: false,
		});
	}

	setDivIconMarker(poi_icon, note, options = {}) {
		const path_icon = IS_DEV_MODE ? `/${poi_icon}` : `/public/${poi_icon}`;

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

		return new L.DivIcon({
			className: "content_single_marker_poi",
			html: ` 
					<div class="single_marker_poi" style="${style_m_poi}">
						${point_pastille}
						<img class="single_marker_image" style="${style_image}" src="${path_icon}"/>
						<div class="single_marker_note">${note}</div>
						<div class="single_marker_point" style="${style_marker_point}"></div>
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

			const data_resto_pastille = this.defaultData[rubrique_type]["pastille"];

			const count_pastille = data_resto_pastille.reduce((sum, item_resto_pastille) => {
				if (parseInt(item_resto_pastille.id_resto) === parseInt(item.id)) {
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

			const data_resto_pastille = this.defaultData[type]["pastille"];

			const count_pastille = data_resto_pastille.reduce((sum, item_resto_pastille) => {
				if (parseInt(item_resto_pastille.id_resto) === parseInt(id)) {
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

			markerLastClicked.setIcon(this.setDivIconMarker(icon_not_selected, note, poi_options));
		}
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

	async fetchDetailsMarche(id_rubrique) {
		try {
			const link_details = `/details/marche/${id_rubrique}`;
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

	injectListRestoPastille() {
		const restoPastilleTab = [];

		const data_resto = this.defaultData["restaurant"];

		data_resto["pastille"].forEach((item) => {
			const restoPastille = data_resto["data"].find((jtem) => parseInt(item.id_resto) === parseInt(jtem.id));
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
		// this.default_data
		injectListMarker(restoPastilleTab);
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
}
