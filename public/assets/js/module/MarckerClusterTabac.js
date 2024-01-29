class MarckerClusterTabac extends MapModule {
	constructor(nom_dep = null, id_dep = null) {
		super(id_dep, nom_dep, "tabac");
	}

	async onInit(isAddControl) {
		this.ALREADY_INIT = false;
		try {
			////create new marker Cluster for POI etablisment
			this.createMarkersCluster();
			////create new marker Cluster special for count per dep.
			this.createMarkersClusterForCountPerDep();

			this.initMap(null, null, null, isAddControl);

			const link =
				this.nom_dep && this.id_dep ? `/api/tabac/departement/${this.nom_dep}/${this.id_dep}` : `/api/tabac`;
			const response = await fetch(link);
			const result = await response.json();
			this.default_data = result.data;

			this.data = this.default_data;

			this.bindAction();
		} catch (e) {
			console.log(e);
		}
	}

	bindAction() {
		/// marker for poi etabliesment.
		this.addMarker(this.data);
		/// marker for count per dep
		this.addCulsterNumberAtablismentPerDep();
		// this.setNumberOfMarker();
		this.addEventOnMap(this.map);
	}

	setNumberOfMarker() {
		if (this.id_dep) {
			/// change the number of result in div
			if (document.querySelector(".content_nombre_result_js_jheo")) {
				document.querySelector(".content_nombre_result_js_jheo").innerText = this.data.length;
			}

			/// change the number of result in div for the left translate
			if (document.querySelector(".content_nombre_result_mobile_js_jheo")) {
				document.querySelector(".content_nombre_result_mobile_js_jheo").innerText = this.data.length;
			}
		}
	}

	displayData() {
		console.log(this.data);
		console.log(this.map);
	}

	createMarkersCluster() {
		this.markers = L.markerClusterGroup({
			chunkedLoading: true,
			animate: true,
			disableClusteringAtZoom: true,
			animateAddingMarkers: true,
			chunkedLoading: true,
			chunkInterval: 500,
			chunkDelay: 100,
		});

		// const that= this;
		// this.markers = L.markerClusterGroup({
		//     chunkedLoading: true,
		//     iconCreateFunction: function (cluster) {
		//         if(that.marker_last_selected){
		//             let sepcMarmerIsExist = false;
		//             for (let g of  cluster.getAllChildMarkers()){
		//                 if (parseInt(that.marker_last_selected.options.id) === parseInt(g.options.id)) {
		//                     sepcMarmerIsExist = true;
		//                     break;
		//                 }
		//             }

		//             if(sepcMarmerIsExist){
		//                 return L.divIcon({
		//                     html: '<div class="markers-spec" id="c">' + cluster.getChildCount() + '</div>',
		//                     className: "spec_cluster",
		//                     iconSize:L.point(35,35)
		//                 });
		//             }else{
		//                 return L.divIcon({
		//                     html: '<div class="markers_tommy_js">' + cluster.getChildCount() + '</div>',
		//                     className: "mycluster",
		//                     iconSize:L.point(35,35)
		//                 });
		//             }
		//         }else{
		//             return L.divIcon({
		//                 html: '<div class="markers_tommy_js">' + cluster.getChildCount() + '</div>',
		//                 className: "mycluster",
		//                 iconSize:L.point(35,35)
		//             });
		//         }
		//     },
		// });
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
		const icon_path = isSelected ? "assets/icon/NewIcons/tabac_red0.png" : "assets/icon/NewIcons/tabac_black0.png";
		const icon_size = isSelected ? 2 : 0; /// 0: normal, 2: selected

		return { path: icon_path, size: icon_size };
	}

	settingSingleMarker(item, isSelected = false) {
		const zoom = this.map._zoom;
		const icon = this.getIcon(item, isSelected);

		let marker = L.marker(L.latLng(parseFloat(item.lat), parseFloat(item.long)), {
			icon: setIconn(icon.path, "content_badge", icon.size, zoom),
			id: item.id,
		});

		const adress = `<br><span class='fw-bolder'> Adresse:</span> <br> ${item.numvoie} ${item.typevoie} ${item.nomvoie} ${item.codpost} ${item.villenorm}`;
		const title =
			"<span class='fw-bolder'> Tabac: </span>" +
			item.name +
			".<span class='fw-bolder'><br>Departement: </span>" +
			item.dep +
			" " +
			item.depName +
			" ." +
			adress;

		marker.bindTooltip(title, { direction: "top", offset: L.point(0, -30) }).openTooltip();

		this.bindEventClick(marker, item);

		this.markers.addLayer(marker);
	}

	bindEventClick(marker, item) {
		marker.on("click", (e) => {
			////close right if this open
			this.closeRightSide();

			///set in the center
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
			const last_marker = this.data.find(
				({ id }) => parseInt(id) === parseInt(this.marker_last_selected.options.id)
			);
			const zoom = this.map._zoom;
			const icon = this.getIcon(last_marker, false);

			this.marker_last_selected.setIcon(setIconn(icon.path, "", icon.size, zoom));
		}

		this.marker_last_selected = marker;
	}

	renderFicheDetails(item) {
		if (screen.width < 991) {
			getDetailTabac(item.dep, item.nom_dep, item.id);
		} else {
			getDetailTabac(item.dep, item.nom_dep, item.id);
		}
	}

	addEventOnMap(map) {
		map.on("resize moveend", () => {
			const x = this.getMax(this.map.getBounds().getWest(), this.map.getBounds().getEast());
			const y = this.getMax(this.map.getBounds().getNorth(), this.map.getBounds().getSouth());

			const new_size = { minx: x.min, miny: y.min, maxx: x.max, maxy: y.max };

			this.updateMarkersDisplay(new_size);
			this.addPeripheriqueMarker(new_size);
		});
	}

	removeMarker() {
		this.markers.clearLayers();
		this.map.removeLayer(this.markers);
	}

	generateAllCard() {
		console.log("Generating all cards...");
	}

	filterByFirstLetterOnName(letter) {
		console.log(letter);
	}

	resetToDefaultMarkers() {
		this.removeMarker();
		this.addMarker(this.default_data);
	}

	/**
	 * Fetch all related data from the boundaries...
	 * @param {*} new_size  { minx, miny, maxx, maxy }
	 */
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

			const link =
				this.nom_dep && this.id_dep ? `/api/tabac/departement/${this.nom_dep}/${this.id_dep}` : `/api/tabac`;
			const response = await fetch(`${link}${param}`);
			const results = await response.json();
			// console.log(results)

			let new_data = results.data;
			this.addMarkerNewPeripherique(new_data, new_size);

			// console.log(new_data);
			new_data = new_data.filter((item) => !this.default_data.some((j) => j.id === item.id));

			this.default_data = this.default_data.concat(new_data);
		} catch (e) {
			console.log(e);
		}
	}

	checkeFilterType(data) {
		return data;
	}
}
