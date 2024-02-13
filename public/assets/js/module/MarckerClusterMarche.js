class MarckerClusterMarche extends MapModule {
	constructor(nom_dep = null, id_dep = null) {
		super(id_dep, nom_dep, "marche");
		this.zoomDetails = 15;
	}

	async onInit(isAddControl = false) {
		this.ALREADY_INIT = false;

		try {
			const zoom = 13;

			/// create Map
			await this.initMap(null, null, zoom, isAddControl);

			////create new marker Cluster for POI etablisment
			this.createMarkersCluster();
			////create new marker Cluster special for count per dep.
			this.createMarkersClusterForCountPerDep();

			/// Tow possiblities : all departement, in departement
			if (this.id_dep && this.nom_dep) {
				this.api_data = `/api/marche_specifique/${this.id_dep}`;
			} else {
				this.api_data = "/api/marche";
			}

			/// if the user just did a search
			let param = "";
			if (getDataInSessionStorage("lastSearchPosition")) {
				const lastSearchPosition = JSON.parse(getDataInSessionStorage("lastSearchPosition"));
				const { minx, miny, maxx, maxy } = lastSearchPosition.position;

				param = lastSearchPosition
					? "?minx=" +
					  encodeURIComponent(minx) +
					  "&miny=" +
					  encodeURIComponent(miny) +
					  "&maxx=" +
					  encodeURIComponent(maxx) +
					  "&maxy=" +
					  encodeURIComponent(maxy)
					: "";
			} else if (!!this.map) {
				const new_size = this.getBoundsWestEastNorthSouth();
				const { minx, miny, maxx, maxy } = new_size;

				param =
					"?minx=" +
					encodeURIComponent(minx) +
					"&miny=" +
					encodeURIComponent(miny) +
					"&maxx=" +
					encodeURIComponent(maxx) +
					"&maxy=" +
					encodeURIComponent(maxy) +
					"&isFirstResquest=true";
			}

			const response = await fetch(`${this.api_data}${param}`);
			const responseJson = await response.json();

			this.default_data = responseJson.data;
			this.data = this.default_data;

			this.listRestoPastille = responseJson.allIdRestoPastille;

			this.bindAction();

			if (getDataInSessionStorage("lastSearchPosition")) {
				clearDataInSessionStorage("lastSearchPosition");
			}
		} catch (e) {
			console.log(e);
		}
	}

	/**
	 *  @author Jehovanie RAMANDRIJOEL <jehovanierama@gmail.com>
	 *
	 *  initialize markersClusterGroup with other action bind Event on Map.
	 */
	bindAction() {
		/// marker for poi etabliesment.
		this.addMarker(this.data);
		// /// marker for count per dep
		this.addCulsterNumberAtablismentPerDep();

		// this.setNumberOfMarker();
		this.addEventOnMap(this.map);

		this.displayData();
	}

	addMarker(newData) {
		const zoom = this.map._zoom;
		const x = this.getMax(this.map.getBounds().getWest(), this.map.getBounds().getEast());
		const y = this.getMax(this.map.getBounds().getNorth(), this.map.getBounds().getSouth());
		const minx = x.min,
			miny = y.min,
			maxx = x.max,
			maxy = y.max;

		const current_object_dataMax = this.objectRatioAndDataMax.find((item) => zoom >= parseInt(item.zoomMin));
		const { dataMax, ratio } = current_object_dataMax;

		const ratioMin = parseFloat(parseFloat(y.min).toFixed(ratio));
		const ratioMax = parseFloat(parseFloat(y.max).toFixed(ratio));

		const dataFiltered = this.generateTableDataFiltered(ratioMin, ratioMax, ratio); /// [ { lat: ( with ratio ), data: [] } ]

		newData.forEach((item) => {
			const isInside =
				parseFloat(item.lat) > parseFloat(miny) &&
				parseFloat(item.lat) < parseFloat(maxy) &&
				parseFloat(item.long) > parseFloat(minx) &&
				parseFloat(item.long) < parseFloat(maxx);
			const item_with_ratio = parseFloat(parseFloat(item.lat).toFixed(ratio));
			if (
				dataFiltered.some((jtem) => parseFloat(jtem.lat) === item_with_ratio && jtem.data.length < dataMax) &&
				isInside
			) {
				this.settingSingleMarker(item, false);

				dataFiltered.forEach((ktem) => {
					if (parseFloat(ktem.lat) === item_with_ratio) {
						ktem.data.push(item);
					}
				});
			}
		});

		/// check if the zoom related to the marker poi
		if (zoom >= this.zoom_max_for_count_per_dep) {
			this.map.addLayer(this.markers);
		}

		this.removePolylineAndSpyderfyMarker();
	}

	/**
	 * Goals object about markers icon.
	 * @param {*} item  this rubric item.
	 * @param {*} isSelected : true or false
	 * @returns object : { path: ..., size: }
	 */
	getIcon(item, isSelected) {
		let poi_icon = "assets/icon/NewIcons/icon_marche.png";
		let poi_icon_Selected = "assets/icon/NewIcons/icon_marche_selected.png";

		const icon_path = isSelected ? poi_icon_Selected : poi_icon;
		const icon_size = isSelected ? 2 : 0; /// 0: normal, 3: selected

		return { path: icon_path, size: icon_size };
	}

	settingSingleMarker(item, isSelected = false) {
		const zoom = this.map._zoom;
		const icon = this.getIcon(item, isSelected);

		let marker = null;
		marker = L.marker(L.latLng(parseFloat(item.lat), parseFloat(item.long)), {
			icon: setIconn(icon.path, "", icon.size, zoom),
			cleNom: item.denominationF,
			id: item.id,
			draggable: false,
		});

		this.bindEventClick(marker, item);

		this.markers.addLayer(marker);
	}

	bindEventClick(marker, item) {
		marker.on("click", (e) => {
			////close right if this open
			this.closeRightSide();

			this.updateCenter(parseFloat(item.lat), parseFloat(item.long), this.zoomDetails);

			const zoom = this.map._zoom;
			const icon = this.getIcon(item, true);

			marker.setIcon(setIconn(icon.path, "", icon.size, zoom));

			this.updateLastMarkerSelected(marker, item);

			this.markers.refreshClusters();

			this.renderFicheDetails(item);

			if (document.querySelector("#dockableIcone_" + item.id))
				document.querySelector("#dockableIcone_" + item.id).remove();
			if (document.querySelector("#dockableBtn_" + item.id))
				document.querySelector("#dockableBtn_" + item.id).remove();
			removeOrEditSpecificElement();
		});
	}

	updateLastMarkerSelected(marker, item) {
		if (this.marker_last_selected && this.marker_last_selected != marker) {
			let oneMarche = this.default_data.find(
				(jtem) => parseInt(this.marker_last_selected.options.id) === parseInt(jtem.id)
			);
			const zoom = this.map._zoom;
			const icon = this.getIcon(oneMarche, false);

			this.marker_last_selected.setIcon(setIconn(icon.path, "", icon.size, zoom));
		}
		this.marker_last_selected = marker;
	}

	renderFicheDetails(item) {
		if (screen.width < 991) {
			getDetailMarche(item.dep, item.depName, item.id, false);
		} else {
			getDetailMarche(item.dep, item.depName, item.id, false);
		}
	}

	displayData() {
		console.log("Id departement:");
		console.log(this.id_dep);

		console.log("Nom dep:");
		console.log(this.nom_dep);

		console.log("Default_data: ");
		console.log(this.default_data);

		console.log("Data: ");
		console.log(this.data);
	}

	addEventOnMap(map) {
		// map.on("resize moveend", () => {
		map.on("resize moveend", () => {
			const x = this.getMax(this.map.getBounds().getWest(), this.map.getBounds().getEast());
			const y = this.getMax(this.map.getBounds().getNorth(), this.map.getBounds().getSouth());

			const new_size = { minx: x.min, miny: y.min, maxx: x.max, maxy: y.max };

			this.updateMarkersDisplay(new_size);
			this.addPeripheriqueMarker(new_size);
		});
	}

	async addPeripheriqueMarker(new_size) {
		try {
			const { minx, miny, maxx, maxy } = new_size;
			const param =
				"?minx=" +
				encodeURIComponent(minx) +
				"&miny=" +
				encodeURIComponent(miny) +
				"&maxx=" +
				encodeURIComponent(maxx) +
				"&maxy=" +
				encodeURIComponent(maxy);

			const response = await fetch(`${this.api_data}${param}`);
			const responseJson = await response.json();
			let new_data = responseJson.data;

			this.addMarkerNewPeripherique(new_data, new_size);

			// const new_data_filterd = new_data.filter(item => !this.default_data.some(j => j.id === item.id));
			new_data = new_data.filter((item) => !this.default_data.some((j) => parseInt(j.id) === parseInt(item.id)));

			// this.addMarker(this.checkeFilterType(new_data));

			this.default_data = this.default_data.concat(new_data);
		} catch (e) {
			console.log(e);
		}
	}

	getAlreadyInit() {
		return this.ALREADY_INIT;
	}

	setAlreadyInit(val) {
		this.ALREADY_INIT = val;
	}

	filterByFirstLetterOnName(letter) {
		const new_data = [];
		this.removeMarker();

		this.default_data.forEach((item) => {
			if (item.denominationF.toLowerCase().charAt(0) === letter.toLowerCase()) {
				new_data.push(item);
			}
		});
		// alert(new_data.length)
		this.addMarker(new_data);
	}

	removeMarker() {
		this.markers.clearLayers();
		this.map.removeLayer(this.markers);
	}

	resetToDefaultMarkers() {
		this.removeMarker();
		this.addMarker(this.default_data);
	}
}
