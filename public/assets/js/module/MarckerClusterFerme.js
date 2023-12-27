class MarckerClusterFerme extends MapModule {
	constructor(nom_dep = null, id_dep = null) {
		super(id_dep, nom_dep, "ferme");
	}

	async onInit(isAddControl = false) {
		/** i use this variable for the filter a-z on specifique departement. by default none carractere specifique. */
		/** function createPagination() local [rubrique]/filter_a-z_asc_desc.js  */
		this.ALREADY_INIT = false;

		try {
			this.initMap(null, null, null, isAddControl);

			this.createMarkersCluster();

			const link =
				this.nom_dep && this.id_dep
					? `/ferme/departement/${this.nom_dep}/${this.id_dep}/allFerme`
					: `/getLatitudeLongitudeFerme`;

			/// if the user just did a search
			let param = "";
			if (getDataInSessionStorage("lastSearchPosition")) {
				const lastSearchPosition = getDataInSessionStorage("lastSearchPosition")
					? JSON.parse(getDataInSessionStorage("lastSearchPosition"))
					: null;
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
					encodeURIComponent(maxy);
			}

			const response = await fetch(`${link}${param}`);
			this.default_data = await response.json();
			this.data = this.default_data;

			this.bindAction();

			if (getDataInSessionStorage("lastSearchPosition")) {
				clearDataInSessionStorage("lastSearchPosition");
			}
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

	bindAction() {
		this.addMarker(this.data);
		this.setNumberOfMarker();
		// this.generateAllCard();
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
		this.map.addLayer(this.markers);
		this.removePolylineAndSpyderfyMarker();
	}

	/**
	 * Goals object about markers icon.
	 * @param {*} item  this rubric item.
	 * @param {*} isSelected : true or false
	 * @returns object : { path: ..., size: }
	 */
	getIcon(item, isSelected) {
		const icon_path = isSelected
			? "assets/icon/NewIcons/icon-ferme-new-R.png"
			: "assets/icon/NewIcons/icon-ferme-new-B.png";
		const icon_size = isSelected ? 2 : 0; /// 0: normal, 3: selected

		return { path: icon_path, size: icon_size };
	}

	settingSingleMarker(item, isSelected = false) {
		const zoom = this.map._zoom;
		const icon = this.getIcon(item, isSelected);

		let marker = L.marker(L.latLng(parseFloat(item.lat), parseFloat(item.long)), {
			icon: setIconn(icon.path, "content_badge", icon.size, zoom),
			id: item.id,
		});

		const adress = "<br><span class='fw-bolder'> Adresse:</span> <br>" + item.adresseFerme;
		const title =
			"<span class='fw-bolder'> Ferme: </span>" +
			item.nomFerme +
			".<span class='fw-bolder'><br>Departement: </span>" +
			item.departement +
			"." +
			adress;

		marker.bindTooltip(title, { direction: "top", offset: L.point(0, -30) }).openTooltip();

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
		});
	}

	updateLastMarkerSelected(marker, item) {
		if (this.marker_last_selected && this.marker_last_selected != marker) {
			const last_marker = this.data.find(
				({ id }) => parseInt(id) === parseInt(this.marker_last_selected.options.id)
			);
			const icon = this.getIcon(last_marker, false);

			this.marker_last_selected.setIcon(setIconn(icon.path, "", icon.size, 9));
		}
		this.marker_last_selected = marker;
	}

	renderFicheDetails(item) {
		if (screen.width < 991) {
			getDetailFerme(item.departement, item.departementName, item.id);
		} else {
			// getDetailsFerme(pathDetails, true)getDetailStation
			getDetailFerme(item.departement, item.departementName, item.id);
		}
	}

	addEventOnMap(map) {
		map.on("moveend", () => {
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
		if (this.nom_dep && this.id_dep) {
			/// mise a jour de liste
			const parent_elements = document.querySelector(".list_result");
			const elements = document.querySelectorAll(".element");
			elements.forEach((element) => {
				element.parentElement.removeChild(element);
			});

			this.data.forEach((new_element) => {
				// <div class="element" id="{{station.id}}">
				const div_new_element = document.createElement("div");
				div_new_element.setAttribute("class", "element");
				div_new_element.setAttribute("id", new_element.id);

				// <p> <span class="id_departement">{{station.nom }} </span> {{station.adresse}}</p>
				const s_p = document.createElement("p");
				s_p.innerHTML =
					"<span class='id_departement'>" + new_element.nomFerme + " </span>" + new_element.adresseFerme;

				// <a class="plus" href="{{path('station_details', {'depart_code':departCode, 'depart_name':departName,'id':station.id }) }}">
				const a = document.createElement("a");
				a.setAttribute("class", "plus");
				a.setAttribute(
					"href",
					"/ferme/departement/" + this.nom_dep + "/" + this.id_dep + "/details/" + new_element.id
				);
				a.innerText = "Voir détails";

				/// integre dom under the element
				div_new_element.appendChild(s_p);
				div_new_element.appendChild(a);

				///integre new element in each element.
				parent_elements.appendChild(div_new_element);
			});
		}
	}

	filterByFirstLetterOnName(letter) {
		const new_data = [];
		this.removeMarker();

		this.default_data.forEach((item) => {
			if (item.nomFerme.toLowerCase().charAt(0) === letter.toLowerCase()) {
				new_data.push(item);
			}
		});
		// alert(new_data.length)
		this.addMarker(new_data);
	}

	resetToDefaultMarkers() {
		this.removeMarker();
		this.addMarker(this.default_data);
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

			const response = await fetch(`/getLatitudeLongitudeFerme${param}`);
			let new_data = await response.json();

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
