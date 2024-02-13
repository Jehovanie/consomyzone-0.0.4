class MarckerClusterGolf extends MapModule {
	constructor(nom_dep = null, id_dep = null) {
		super(id_dep, nom_dep, "golf");
	}

	async onInit(isAddControl) {
		this.ALREADY_INIT = false;
		try {
			this.initMap(null, null, null, isAddControl);

			////create new marker Cluster for POI etablisment
			this.createMarkersCluster();
			////create new marker Cluster special for count per dep.
			this.createMarkersClusterForCountPerDep();

			const link =
				this.nom_dep && this.id_dep ? `/api/golf/departement/${this.nom_dep}/${this.id_dep}` : `/api/golf`;
			let param = "";
			if (!!this.map) {
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

			const response = await fetch(`${link}`);
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
		let icon_path = "";
		let icon_size = isSelected ? 2 : 0; /// 0: min, 1: moyenne, 2 : grand

		if (
			item.user_status.a_faire === null &&
			item.user_status.fait === null &&
			item.user_status.mon_golf === null &&
			item.user_status.refaire === null
		) {
			icon_path = isSelected
				? "assets/icon/NewIcons/icon-rouge-golf-C.png"
				: "assets/icon/NewIcons/icon-blanc-golf-vertC.png";
			icon_size = isSelected ? 3 : 0;
		} else {
			if (!!item.user_status.a_faire === true) {
				icon_path = isSelected
					? "assets/icon/NewIcons/icon-vert-golf-orange.png"
					: "assets/icon/NewIcons/icon-blanc-golf-vert-badgeC.png";
			} else if (!!item.user_status.fait === true) {
				icon_path = isSelected
					? "assets/icon/NewIcons/icon-vert-golf-bleu.png"
					: "assets/icon/NewIcons/icon-blanc-golf-vert-bC.png";
			} else if (!!item.user_status.mon_golf === true) {
				icon_path = isSelected
					? "assets/icon/NewIcons/mon_golf_select.png"
					: "assets/icon/NewIcons/mon_golf.png";
			} else if (!!item.user_status.refaire === true) {
				icon_path = isSelected
					? "assets/icon/NewIcons/icon-vert-golf-refaire.png"
					: "assets/icon/NewIcons/icon-blanc-golf-refaire.png";
			} else {
				icon_path = isSelected
					? "assets/icon/NewIcons/icon-rouge-golf-C.png"
					: "assets/icon/NewIcons/icon-blanc-golf-vertC.png";
			}
			// pathIcon= item.user_status === null ? 'assets/icon/NewIcons/icon-blanc-golf-vert-badgeC.png' : 'assets/icon/NewIcons/icon-blanc-golf-vert-bC.png';
			icon_size = isSelected ? 3 : 2;
		}

		return { path: icon_path, size: icon_size };
	}

	settingSingleMarker(item, isSelected = false) {
		const zoom = this.map._zoom;

		const icon = this.getIcon(item, isSelected);

		const adress = "<br><span class='fw-bolder'> Adresse:</span> <br>" + item.commune + " " + item.adress;
		let title =
			"<span class='fw-bolder'> Golf: </span>" +
			item.name +
			".<span class='fw-bolder'><br>Departement: </span>" +
			item.dep +
			"." +
			adress;

		let marker = null;
		if (!item.moyenne_note) {
			marker = L.marker(L.latLng(parseFloat(item.lat), parseFloat(item.long)), {
				icon: setIconn(icon.path, "content_badge", icon.size, zoom),
				cleNom: item.denominationF,
				id: item.id,
			});
		} else {
			// marker= this.setSpecialMarkerToShowNote( L.latLng(parseFloat(item.lat), parseFloat(item.long)), item,  isSelected,  poi_icon,  poi_icon_Selected,  isPastille,  zoom)
			marker = this.setSpecialMarkerToShowNoteRefactor(
				L.latLng(parseFloat(item.lat), parseFloat(item.long)),
				item,
				icon.path,
				icon.size,
				"golf"
			);
		}

		marker.bindTooltip(title, { direction: "top", offset: L.point(0, -30) }).openTooltip();

		this.bindEventClick(marker, item);

		this.markers.addLayer(marker);
	}

	bindEventClick(marker, item) {
		marker.on("click", (e) => {
			////close right if this open
			this.closeRightSide();

			const itemID = item.id;
			const golfUpdate = this.data.find((jtem) => parseInt(jtem.id) === itemID);

			this.updateCenter(parseFloat(golfUpdate.lat), parseFloat(golfUpdate.long), this.zoomDetails);

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

	/**
	 * @author Jehovanie RAMANDRIJOEL <jehovanierama@gmail.com>
	 *
	 * Update the state icon for the last selected marker.
	 *
	 * @param {*} marker current marker selected
	 * @param {*} item  current item selected
	 */
	updateLastMarkerSelected(marker, item) {
		if (this.marker_last_selected && this.marker_last_selected != marker) {
			const last_marker = this.data.find(
				({ id }) => parseInt(id) === parseInt(this.marker_last_selected.options.id)
			);

			const zoom = this.map._zoom;
			const icon = this.getIcon(last_marker, false);

			if (!last_marker.moyenne_note) {
				this.marker_last_selected.setIcon(setIconn(icon.path, "", icon.size, zoom));
			} else {
				this.marker_last_selected.setIcon(
					// this.setSpecialIcon(oneResto, false, poi_icon, poi_icon_Selected, isPastille)
					this.setSpecialIconRefactor(last_marker, icon.path, icon.size)
				);
			}
		}
		this.marker_last_selected = marker;
	}

	/**
	 * Goal fetch fiche details
	 * @param {*} item
	 */
	renderFicheDetails(item) {
		if (screen.width < 991) {
			getDetailGolf(item.dep, item.nom_dep, item.id);
		} else {
			getDetailGolf(item.dep, item.nom_dep, item.id);
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

	updateStatusDataItem(user_status, id) {
		if (this.default_data.some(({ id: item_id }) => parseInt(item_id) === parseInt(id))) {
			this.default_data = this.default_data.map((item) => {
				if (parseInt(item.id) === parseInt(id)) {
					item.user_status = { ...item.user_status, ...user_status };
				}
				return item;
			});

			this.data = this.data.map((item) => {
				if (parseInt(item.id) === parseInt(id)) {
					item.user_status = { ...item.user_status, ...user_status }; /// { "a_faire" : ... , "fait" : ...  }
				}
				return item;
			});
		}
	}

	updateStateGolf(status, id) {
		/// new state for the data
		let user_status = this.getNewUserStatus(status); ///  { a_faire: ..., fait: ..., mon_golf: ..., refaire: ... };

		///find the item related with this id;
		if (this.default_data.some(({ id: item_id }) => parseInt(item_id) === parseInt(id))) {
			///update the global data state
			this.updateStatusDataItem(user_status, id);

			const golfModified = this.default_data.find(({ id: item_id }) => parseInt(item_id) === parseInt(id));

			this.markers.eachLayer((marker) => {
				if (parseInt(marker.options.id) === parseInt(id)) {
					const icon = this.getIcon(golfModified, true); /// path, size

					if (!golfModified.moyenne_note) {
						const zoom = this.map._zoom;
						marker.setIcon(setIconn(icon.path, "", icon.size, zoom));
					} else {
						marker.setIcon(this.setSpecialIconRefactor(golfModified, icon.path, icon.size));
					}
				}
			});

			this.markers.refreshClusters();
		}
	}

	/**
	 * Fetch all related data from the boundaries...
	 * @param {*} new_size  { minx, miny, maxx, maxy }
	 */
	async addPeripheriqueMarker(new_size) {
		try {
			const { minx, miny, maxx, maxy } = new_size;

			let param =
				"?minx=" +
				encodeURIComponent(minx) +
				"&miny=" +
				encodeURIComponent(miny) +
				"&maxx=" +
				encodeURIComponent(maxx) +
				"&maxy=" +
				encodeURIComponent(maxy);
			param += this.nom_dep && this.id_dep ? `&dep=${this.id_dep}&nom_dep=${this.nom_dep}` : "";

			const response = await fetch(`/golf_in_peripherique${param}`);
			let new_data = await response.json();

			this.addMarkerNewPeripherique(new_data, new_size);

			if (new_data.length > 0) {
				new_data = new_data.filter((item) => !this.default_data.some((j) => j.id === item.id));
				this.default_data = this.default_data.concat(new_data);
			}
		} catch (e) {
			console.log(e);
		}
	}

	checkeFilterType(data) {
		return data;
	}

	showNoteGlobaleOnMarker(idItem, globalNote) {
		console.log(idItem, globalNote);
	}

	/**
	 * @Author Nantenaina
	 * où: On utilise cette fonction dans la rubrique restaurant, restaurant specifique dép, arrondissement et tous de la carte cmz,
	 * localisation du fichier: dans MarkerClusterResto.js,
	 * je veux: mettre à jour la note moyenne sur un POI
	 * si une POI a une note, la note se montre en haut à gauche du POI
	 */
	showNoteMoyenneRealTime(idGolf, note) {
		this.markers.eachLayer((marker) => {
			if (parseInt(marker.options.id) === parseInt(idGolf)) {
				let oneGolf = this.default_data.find((jtem) => parseInt(idGolf) === parseInt(jtem.id));
				oneGolf.moyenne_note = parseFloat(note).toFixed(2);

				const icon = this.getIcon(oneGolf, true);
				marker.setIcon(this.setSpecialIconRefactor(oneGolf, icon.path, icon.size));
			}
		});

		this.markers.refreshClusters();
	}

	async fetchOneData(id) {
		try {
			const api_data = `/api/golf/${this.nom_dep}/${this.id_dep}/${id}`;
			const response = await fetch(api_data);
			let { details } = await response.json();
			this.default_data = this.default_data.concat([details]);

			this.settingSingleMarker(details, false);
			this.clickOnMarker(id);
		} catch (e) {
			console.log(e);
		}
	}
}
