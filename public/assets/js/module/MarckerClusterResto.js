class MarckerClusterResto extends MapModule {
	constructor(nom_dep = null, id_dep = null, codinsee = null) {
		super(id_dep, nom_dep, "resto");
		this.codinsee = codinsee;
	}

	async onInit(isAddControl = false) {
		this.ALREADY_INIT = false;
		try {
			const zoom = this.codinsee ? 13 : null;
			await this.initMap(null, null, zoom, isAddControl);

			////create new marker Cluster for POI etablisment
			this.createMarkersCluster();
			////create new marker Cluster special for count per dep.
			this.createMarkersClusterForCountPerDep();

			/// Three possiblities : all departement, arrondissement, in departement
			const linkArrond = this.codinsee
				? `/Coord/All/Restaurant/specific/arrondissement/${this.id_dep}/${this.codinsee}`
				: null;

			this.api_data =
				this.nom_dep && this.id_dep
					? this.codinsee
						? linkArrond
						: `/Coord/Spec/Restaurant/${this.id_dep}`
					: `/Coord/All/Restaurant`;

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
					encodeURIComponent(maxy) +
					"&isFirstResquest=true";
			}

			// "data" => $datas,
			// "allIdRestoPastille" => $arrayIdResto

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

	createMarkersCluster() {
		this.markers = L.markerClusterGroup({
			chunkedLoading: true,
			chunkInterval: 500,
			chunkDelay: 100,
			maxClusterRadius: 80, //A cluster will cover at most this many pixels from its center
			clusterPane: L.Marker.prototype.options.pane,
			spiderfyOnMaxZoom: true,
			disableClusteringAtZoom: true,
		});

		// const that = this;
		// this.markers = L.markerClusterGroup({
		// 	chunkedLoading: true,
		// 	disableClusteringAtZoom: 7,
		// 	iconCreateFunction: function (cluster) {
		// 		console.log(cluster);
		// 		if (that.marker_last_selected) {
		// 			let sepcMarmerIsExist = false;
		// 			for (let g of cluster.getAllChildMarkers()) {
		// 				if (parseInt(that.marker_last_selected.options.id) === parseInt(g.options.id)) {
		// 					sepcMarmerIsExist = true;
		// 					break;
		// 				}
		// 			}
		// 			if (sepcMarmerIsExist) {
		// 				return L.divIcon({
		// 					html: '<div class="markers-spec" id="c">' + cluster.getChildCount() + "</div>",
		// 					className: "spec_cluster",
		// 					iconSize: L.point(35, 35),
		// 				});
		// 			} else {
		// 				return L.divIcon({
		// 					html: '<div class="markers_tommy_js">' + cluster.getChildCount() + "</div>",
		// 					className: "mycluster",
		// 					iconSize: L.point(35, 35),
		// 				});
		// 			}
		// 		} else {
		// 			return L.divIcon({
		// 				html: '<div class="markers_tommy_js">' + cluster.getChildCount() + "</div>",
		// 				className: "mycluster",
		// 				iconSize: L.point(35, 35),
		// 			});
		// 		}
		// 	},
		// });
	}

	/**
	 *  @author Jehovanie RAMANDRIJOEL <jehovanierama@gmail.com>
	 *
	 *  initialize markersClusterGroup with other action bind Event on Map.
	 */
	bindAction() {
		/// marker for poi etabliesment.
		this.addMarker(this.data);
		/// marker for count per dep
		this.addCulsterNumberAtablismentPerDep();

		this.setNumberOfMarker();
		this.addEventOnMap(this.map);
	}

	getAlreadyInit() {
		return this.ALREADY_INIT;
	}

	setAlreadyInit(val) {
		this.ALREADY_INIT = val;
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
		// console.log(dataFiltered);

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
		let resultRestoPastille =
			this.listRestoPastille.length > 0
				? this.listRestoPastille.filter((jtem) => parseInt(jtem.id_resto) === parseInt(item.id))
				: [];
		let poi_icon =
			resultRestoPastille.length > 1
				? "assets/icon/NewIcons/icon-resto-new-B-vert-multi.png"
				: resultRestoPastille.length === 1
				? "assets/icon/NewIcons/icon-resto-new-B-org-single.png"
				: "assets/icon/NewIcons/icon-resto-new-B.png";
		let poi_icon_Selected =
			resultRestoPastille.length > 1
				? "assets/icon/NewIcons/icon-resto-new-Rr-vert-multi.png"
				: resultRestoPastille.length === 1
				? "assets/icon/NewIcons/icon-resto-new-Rr-org-single.png"
				: "assets/icon/NewIcons/icon-resto-new-Rr.png";

		let isPastille = resultRestoPastille.length > 0 ? 1 : 0;

		const icon_path = isSelected ? poi_icon_Selected : poi_icon;
		const icon_size = isSelected ? 2 : isPastille; /// 0: normal, 3: selected

		return { path: icon_path, size: icon_size };
	}

	settingSingleMarker(item, isSelected = false) {
		const zoom = this.map._zoom;
		const icon = this.getIcon(item, isSelected);

		let marker = null;
		if (!item.moyenne_note) {
			marker = L.marker(L.latLng(parseFloat(item.lat), parseFloat(item.long)), {
				icon: setIconn(icon.path, "content_badge", icon.size, zoom),
				cleNom: item.denominationF,
				id: item.id,
				draggable: false,
			});
		} else {
			// marker= this.setSpecialMarkerToShowNote( L.latLng(parseFloat(item.lat), parseFloat(item.long)), item,  isSelected,  poi_icon,  poi_icon_Selected,  isPastille,  zoom)
			marker = this.setSpecialMarkerToShowNoteRefactor(
				L.latLng(parseFloat(item.lat), parseFloat(item.long)),
				item,
				icon.path,
				icon.size,
				"resto"
			);
		}

		const departementName = item.depName;
		const adresseRestaurant = `${item.numvoie} ${item.typevoie} ${item.nomvoie} ${item.codpost} ${item.villenorm}`;
		const adress = "<br><span class='fw-bolder'> Adresse:</span> <br>" + adresseRestaurant;
		const title =
			"<span class='fw-bolder'> Restaurant:</span>  " +
			item.denominationF +
			".<span class='fw-bolder'><br> Departement:</span>  " +
			departementName +
			"." +
			adress;

		marker.bindTooltip(title, { direction: "top", offset: L.point(0, -30) }).openTooltip();

		this.bindEventClick(marker, item);

		this.markers.addLayer(marker);

		/// perhaps the map object is not initalized the markers for etablisment
		if (isSelected) {
			this.marker_last_selected = marker;
			this.markers.refreshClusters();
			this.map.addLayer(this.markers);
		}
	}

	bindEventClick(marker, item) {
		marker.on("click", (e) => {
			// console.log("marker clicked: ");
			// console.log(marker.getLatLng().toString());

			////close right if this open
			this.closeRightSide();

			this.updateCenter(parseFloat(item.lat), parseFloat(item.long), this.zoomDetails);

			const zoom = this.map._zoom;
			const icon = this.getIcon(item, true);

			if (!item.moyenne_note) {
				marker.setIcon(setIconn(icon.path, "", icon.size, zoom));
			} else {
				// marker.setIcon(this.setSpecialIcon(item, true, poi_icon, poi_icon_Selected, isPastille))
				marker.setIcon(this.setSpecialIconRefactor(item, icon.path, icon.size));
			}

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
			let oneResto = this.default_data.find(
				(jtem) => parseInt(this.marker_last_selected.options.id) === parseInt(jtem.id)
			);
			const zoom = this.map._zoom;
			const icon = this.getIcon(oneResto, false);
			if (!oneResto.moyenne_note) {
				this.marker_last_selected.setIcon(setIconn(icon.path, "", icon.size, zoom));
			} else {
				this.marker_last_selected.setIcon(
					// this.setSpecialIcon(oneResto, false, poi_icon, poi_icon_Selected, isPastille)
					this.setSpecialIconRefactor(oneResto, icon.path, icon.size)
				);
			}
		}
		this.marker_last_selected = marker;
	}

	renderFicheDetails(item) {
		if (screen.width < 991) {
			getDetailResto(item.dep, item.depName, item.id, false);
		} else {
			getDetailResto(item.dep, item.depName, item.id, false);
		}
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

	setNumberOfMarker() {
		if (!this.id_dep) {
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

	async fetchOneData(id) {
		try {
			const api_data = `/api/restaurant/one_data/${id}`;
			const response = await fetch(api_data);
			let { details } = await response.json();
			this.default_data = this.default_data.concat([details]);

			this.settingSingleMarker(details, false);
			this.clickOnMarker(id);
		} catch (e) {
			console.log(e);
		}
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

			// const api_data= (this.id_dep) ? `/Coord/Spec/Restaurant/${this.id_dep}/${param}` : `/Coord/All/Restaurant${param}`;
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

	checkeFilterType(data) {
		/// filter specifique: alphabet, asyc/desc
		return data;
	}

	updateListRestoPastille(idResto, tribuName, logo = null) {
		this.listRestoPastille.push({ id_resto: idResto.toString(), tableName: tribuName, logo_path: logo });
		this.updateStateResto(idResto);
	}

	updateListRestoDepastille(idResto, tribuName) {
		this.listRestoPastille = this.listRestoPastille.filter((item) => {
			return (
				parseInt(item.id_resto) != parseInt(idResto) ||
				item.tableName.replaceAll("_restaurant", "") != tribuName.replaceAll("_restaurant", "")
			);
		});
		this.updateStateResto(idResto);
	}

	updateStateResto(idResto) {
		let resultRestoPastille =
			this.listRestoPastille.length > 0
				? this.listRestoPastille.filter((jtem) => parseInt(jtem.id_resto) === parseInt(idResto))
				: [];
		let poi_icon_Selected =
			resultRestoPastille.length > 1
				? "assets/icon/NewIcons/icon-resto-new-Rr-vert-multi.png"
				: resultRestoPastille.length === 1
				? "assets/icon/NewIcons/icon-resto-new-Rr-org-single.png"
				: "assets/icon/NewIcons/icon-resto-new-Rr.png";
		let isPastille = resultRestoPastille.length > 0 ? 2 : 0;

		this.markers.eachLayer((marker) => {
			if (parseInt(marker.options.id) === parseInt(idResto)) {
				/*const icon_R = L.Icon.extend({
                    options: {
                        iconUrl: IS_DEV_MODE ? this.currentUrl.origin + "/"+  poi_icon_Selected: this.currentUrl.origin + "/public/" + poi_icon_Selected,
                        iconSize: isPastille === 2 ? [45, 60] : [30,45] ,
                        iconAnchor: [11, 30],
                        popupAnchor: [0, -20],
                        shadowSize: [68, 95],
                        shadowAnchor: [22, 94]
                    }
                })*/
				// marker.setIcon(new icon_R);
				const oneResto = this.default_data.find((jtem) => parseInt(idResto) === parseInt(jtem.id));
				marker.setIcon(this.setSpecialIcon(oneResto, true, poi_icon_Selected, poi_icon_Selected, isPastille));
			}
		});

		this.markers.refreshClusters();
	}

	injectListRestoPastille() {
		const restoPastilleTab = [];
		this.listRestoPastille.forEach((item) => {
			const restoPastille = this.default_data.find((jtem) => parseInt(item.id_resto) === parseInt(jtem.id));
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
	 * @Author Nantenaina
	 * où: On utilise cette fonction dans la rubrique restaurant, restaurant specifique dép, arrondissement et tous de la carte cmz,
	 * localisation du fichier: dans MarkerClusterResto.js,
	 * je veux: mettre à jour la note moyenne sur un POI
	 * si une POI a une note, la note se montre en haut à gauche du POI
	 */
	showNoteMoyenneRealTime(idResto, note) {
		let resultRestoPastille =
			this.listRestoPastille.length > 0
				? this.listRestoPastille.filter((jtem) => parseInt(jtem.id_resto) === parseInt(idResto))
				: [];
		let poi_icon_Selected =
			resultRestoPastille.length > 1
				? "assets/icon/NewIcons/icon-resto-new-Rr-vert-multi.png"
				: resultRestoPastille.length === 1
				? "assets/icon/NewIcons/icon-resto-new-Rr-org-single.png"
				: "assets/icon/NewIcons/icon-resto-new-Rr.png";
		let isPastille = resultRestoPastille.length > 0 ? 2 : 0;

		this.markers.eachLayer((marker) => {
			if (parseInt(marker.options.id) === parseInt(idResto)) {
				let oneResto = this.default_data.find((jtem) => parseInt(idResto) === parseInt(jtem.id));
				oneResto.moyenne_note = parseFloat(note).toFixed(2);
				marker.setIcon(this.setSpecialIcon(oneResto, true, poi_icon_Selected, poi_icon_Selected, isPastille));
			}
		});

		this.markers.refreshClusters();
	}

	/**
	 * @author Nantenaina a ne pas contacté pendant les congés
	 * où: on Utilise cette fonction dans la rubrique resto et tous carte cmz,
	 * localisation du fichier: dans MarkerClusterResto.js,
	 * je veux: rendre le marker draggable
	 * si un utilisateur veut modifier une ou des informations
	 * @param {} id
	 */
	makeMarkerDraggable(id) {
		this.markers.eachLayer((marker) => {
			if (parseInt(marker.options.id) === parseInt(id)) {
				let initialPos = marker.getLatLng();
				marker.dragging.enable();

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
	}
}
