class MarckerClusterSearch extends MapModule {
	constructor(nom_dep = null, id_dep = null) {
		const url_test = new URL(window.location.href);
		const search_type = url_test.pathname;

		let map_for_type = "";
		if (search_type.includes("/restaurant")) {
			map_for_type = "resto";
		} else if (search_type.includes("/ferme")) {
			map_for_type = "ferme";
		} else if (search_type.includes("/station")) {
			map_for_type = "station";
		} else if (search_type.includes("/golf")) {
			map_for_type = "golf";
		} else if (search_type.includes("/tabac")) {
			map_for_type = "tabac";
		} else if (search_type.includes("/tous")) {
			map_for_type = "tous";
		}

		super(id_dep, nom_dep, map_for_type);

		this.url_test = url_test;

		if (document.querySelector("#open-navleft")) {
			document.querySelector("#open-navleft").parentElement.removeChild(document.querySelector("#open-navleft"));
		}
	}

	async onInit(isAddControl = false) {
		const url = new Request(this.url_test.href.replace("search", "api/search"));
		this.isAddControl = isAddControl;
		try {
			////create new marker Cluster for POI etablisment
			this.createMarkersCluster();
			////create new marker Cluster special for count per dep.
			this.createMarkersClusterForCountPerDep();

			const response = await fetch(url);
			this.default_data = await response.json();
			this.data = this.default_data; /// [ results [ data, length, type], allIdRestoPastille,type, cles0, cles1, origin_cles1]

			this.listRestoPastille = this.data.allIdRestoPastille;

			const latLong = await this.getCenterFromOpenStreetMap();

			this.initMap(latLong.lat, latLong.long, latLong.zoom, this.isAddControl);

			this.bindAction();

			this.saveBoundsMap();
		} catch (e) {
			console.log(e);
		}
	}

	async getCenterFromOpenStreetMap() {
		const memoryCenter = getDataInSessionStorage("memoryCenter")
			? JSON.parse(getDataInSessionStorage("memoryCenter"))
			: null;
		let latLong = memoryCenter
			? { lat: memoryCenter.coord.lat, long: memoryCenter.coord.lng, zoom: memoryCenter.zoom }
			: { lat: null, long: null, zoom: null };

		try {
			let data_origin_cle1 = this.data.origin_cles1.trim();

			if (
				(data_origin_cle1.length < 3 && parseInt(data_origin_cle1) > 0 && parseInt(data_origin_cle1) < 95) ||
				data_origin_cle1.toLowerCase() === "nord"
			) {
				const depCode = data_origin_cle1.toLowerCase() === "nord" ? 59 : parseInt(data_origin_cle1);
				latLong = { lat: centers[depCode].lat, long: centers[depCode].lng, zoom: centers[depCode].zoom };
			} else {
				const dataLink = [
					{
						regex: /(([a-zA-Z-éÉèÈàÀùÙâÂêÊîÎôÔûÛïÏëËüÜçÇæœ'.]*\s)\d*(\s[a-zA-Z-éÉèÈàÀùÙâÂêÊîÎôÔûÛïÏëËüÜçÇæœ']*)*,)*\d*(\s[a-zA-Z-éÉèÈàÀùÙâÂêÊîÎôÔûÛïÏëËüÜçÇæœ']*)+\s([\d]{5})\s[a-zA-Z-éÉèÈàÀùÙâÂêÊîÎôÔûÛïÏëËüÜçÇæœ']+/gm,
						clesType: "completAdresss",
						zoom: 17,
						link: `https://nominatim.openstreetmap.org/?addressdetails=1&q=${data_origin_cle1}&format=json&limit=1`,
					},
					{
						regex: /[\d]{5}/g,
						clesType: "codepostal",
						zoom: 13,
						link: `https://nominatim.openstreetmap.org/search?format=json&postalcode=${data_origin_cle1}&country=France&limit=1`,
					},
					{
						regex: /([a-zA-Z-éÉèÈàÀùÙâÂêÊîÎôÔûÛïÏëËüÜçÇæœ']*)+/g,
						clesType: "city",
						zoom: 13,
						link: `https://nominatim.openstreetmap.org/search?format=json&city=${data_origin_cle1}&country=France&limit=1`,
					},
				];

				let useLink = dataLink.find((item) => item.regex.test(data_origin_cle1));

				const apiOpenStreetMap = useLink
					? useLink.link
					: `https://nominatim.openstreetmap.org/?addressdetails=1&q=${data_origin_cle1}&format=json&limit=1`;
				let responsePos = await fetch(apiOpenStreetMap);
				let address = await responsePos.json();

				if (address.length === 0) {
					responsePos = await fetch(
						`https://nominatim.openstreetmap.org/?addressdetails=1&q=${data_origin_cle1}&format=json&limit=1`
					);
					address = await responsePos.json();

					if (address.length === 0) {
						const cleWord = data_origin_cle1.replaceAll("-", " ").replaceAll("_", " ").split(" ");
						const regexCodepostal = /[\d]{5}/g;

						for (let i = 0; i < cleWord.length; i++) {
							const cle = cleWord[i];

							if (regexCodepostal.test(cle)) {
								responsePos = await fetch(
									`https://nominatim.openstreetmap.org/search?format=json&postalcode=${cle}&country=France&limit=1`
								);
								address = await responsePos.json();
							} else {
								// responsePos = await fetch(`https://nominatim.openstreetmap.org/?addressdetails=1&q=${cleWord[i]}&format=json&limit=1`)
								responsePos = await fetch(
									`https://nominatim.openstreetmap.org/search?format=json&city=${cle}&country=France&limit=1`
								);
								address = await responsePos.json();
							}

							if (address.length !== 0) {
								break;
							}
						}
					}
				}

				//// In cas API openStreetMap failed or return empty
				const memoryCenter = getDataInSessionStorage("memoryCenter")
					? JSON.parse(getDataInSessionStorage("memoryCenter"))
					: null;
				latLong =
					address.length > 0
						? { lat: address[0].lat, long: address[0].lon, zoom: useLink.zoom }
						: { lat: memoryCenter.coord.lat, long: memoryCenter.coord.lng, zoom: memoryCenter.zoom };
			}
		} catch (e) {
			console.log(e);
		} finally {
			return latLong;
		}
	}

	saveBoundsMap() {
		const x = this.getMax(this.map.getBounds().getWest(), this.map.getBounds().getEast());
		const y = this.getMax(this.map.getBounds().getNorth(), this.map.getBounds().getSouth());
		const lastSearchPosition = {
			zoom: 13,
			position: { minx: x.min, miny: y.min, maxx: x.max, maxy: y.max },
		};
		setDataInSessionStorage("lastSearchPosition", JSON.stringify(lastSearchPosition));
	}

	async getAdresseDetailsOpenStrettMap(cles) {
		try {
			const response = await fetch(
				`https://nominatim.openstreetmap.org/?addressdetails=1&q=${cles}&format=json&limit=1`
			);
			const address = await response.json();

			const memoryCenter = getDataInSessionStorage("memoryCenter")
				? JSON.parse(getDataInSessionStorage("memoryCenter"))
				: null;
			const latLong =
				address.length > 0
					? { lat: address[0].lat, long: address[0].lng }
					: { lat: memoryCenter.coord.lat, long: memoryCenter.coord.lng };

			this.initMap(latLong.lat, latLong.long, null, this.isAddControl);
			this.bindAction();
		} catch (e) {
			console.log(e);
		}
	}

	bindAction() {
		const { results } = this.data;
		/// marker for poi etabliesment.
		this.addMarker(results[0]);
		/// marker for count per dep
		this.addCulsterNumberAtablismentPerDep();

		this.addEventOnMap(this.map);
	}

	displayData() {
		console.log(this.allIdRestoPastille);
		console.log(this.data);
		console.log(this.geos);
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
		if (newData.length > 0) {
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

			const numberOfRubrique = 5;

			newData.forEach((item) => {
				const isInside =
					parseFloat(item.lat) > parseFloat(miny) &&
					parseFloat(item.lat) < parseFloat(maxy) &&
					parseFloat(item.long) > parseFloat(minx) &&
					parseFloat(item.long) < parseFloat(maxx);
				const item_with_ratio = parseFloat(parseFloat(item.lat).toFixed(ratio));

				if (
					dataFiltered.some(
						(jtem) =>
							parseFloat(jtem.lat) === item_with_ratio && jtem.data.length < dataMax * numberOfRubrique
					) &&
					isInside
				) {
					this.settingSingleMarker(item, false);

					dataFiltered.forEach((ktem) => {
						if (parseFloat(ktem.lat) === item_with_ratio) {
							ktem.data.push(item);
						}
					});
				}
				// this.settingSingleMarker(item, false);
			});

			/// check if the zoom related to the marker poi
			if (zoom >= this.zoom_max_for_count_per_dep) {
				this.map.addLayer(this.markers);
			}

			this.removePolylineAndSpyderfyMarker();
		}
	}

	addStation(dataStation) {
		dataStation.forEach((item) => {
			this.settingSingleMarkerStation(item);
		});
	}

	addFerme(dataFerme) {
		dataFerme.forEach((item) => {
			this.settingSingleMarkerFerme(item);
		});
	}

	addResto(dataResto) {
		dataResto.forEach((item) => {
			this.settingSingleMarkerResto(item);
		});
	}

	/**
	 * Get relatid icon
	 *
	 * @param {*} item
	 * @param {*} isSelected
	 * @returns
	 */
	getIcon(item, isSelected = false) {
		let icon_path = "";
		let icon_size = isSelected ? 2 : 0;

		if (item.ferme !== undefined) {
			icon_path = isSelected
				? "assets/icon/NewIcons/icon-ferme-new-R.png"
				: "assets/icon/NewIcons/icon-ferme-new-B.png";
		} else if (item.station !== undefined) {
			icon_path = isSelected
				? "assets/icon/NewIcons/icon-station-new-R.png"
				: "assets/icon/NewIcons/icon-station-new-B.png";
		} else if (item.resto !== undefined) {
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

			icon_path = isSelected ? poi_icon_Selected : poi_icon;
		} else if (item.golf !== undefined) {
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
				icon_size = isSelected ? 2 : 1;
			}
		} else if (item.tabac !== undefined) {
			icon_path = isSelected ? "assets/icon/NewIcons/tabac_red0.png" : "assets/icon/NewIcons/tabac_black0.png";
		} else if (item.marche !== undefined) {
			let poi_icon = "assets/icon/NewIcons/icon_marche.png";
			let poi_icon_Selected = "assets/icon/NewIcons/icon_marche_selected.png";
			let poi_icon_wait = "assets/icon/NewIcons/icon_marche_blanc.png";

			icon_path =
				item.hasOwnProperty("status") && parseInt(item.status) != 1
					? poi_icon_wait
					: isSelected
					? poi_icon_Selected
					: poi_icon;
		}

		return { path: icon_path, size: icon_size };
	}

	settingSingleMarker(item, isSelected = false) {
		if (item.ferme !== undefined) {
			this.settingSingleMarkerFerme(item, isSelected);
		} else if (item.station !== undefined) {
			this.settingSingleMarkerStation(item, isSelected);
		} else if (item.resto !== undefined) {
			this.settingSingleMarkerResto(item, isSelected);
		} else if (item.golf !== undefined) {
			this.settingSingleMarkerGolf(item, isSelected);
		} else if (item.tabac !== undefined) {
			this.settingSingleMarkerTabac(item, isSelected);
		} else if (item.marche !== undefined) {
			this.settingSingleMarkerMarche(item, isSelected);
		}
	}

	settingSingleMarkerStation(item, isSelected = false) {
		const zoom = this.map._zoom;
		const icon = this.getIcon(item, isSelected);

		var marker = L.marker(L.latLng(parseFloat(item.lat), parseFloat(item.long)), {
			icon: setIconn(icon.path, "content_badge", icon.size, zoom),
			id: item.id,
			type: "station",
		});

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

		this.bindEventClick(marker, item, "station");

		this.markers.addLayer(marker);
	}

	settingSingleMarkerFerme(item, isSelected = false) {
		const zoom = this.map._zoom;
		const icon = this.getIcon(item, isSelected);

		var marker = L.marker(L.latLng(parseFloat(item.lat), parseFloat(item.long)), {
			icon: setIconn(icon.path, "content_badge", icon.size, zoom),
			id: item.id,
			type: "ferme",
		});

		const adress = "<br><span class='fw-bolder'> Adresse:</span> <br>" + item.adresseFerme;
		var title =
			"<span class='fw-bolder'>Ferme:</span> " +
			item.nomFerme +
			". <br><span class='fw-bolder'> Departement:</span>" +
			item.departement +
			"." +
			adress;

		marker.bindTooltip(title, { direction: "auto", offset: L.point(0, -30) }).openTooltip();

		this.bindEventClick(marker, item, "ferme");

		this.markers.addLayer(marker);
	}

	/**
	 * @author Jehovanie RAMANDRIJOEL <jehovanierama@gmail.com>
	 *
	 * Bind event click on marker and show details
	 *
	 * @param {*} marker current marker to bind click
	 * @param {*} item item related to the marker
	 * @param {*} type type of the marker such as "ferme" or "station" or "resto" , ...
	 *
	 * @return void
	 */
	bindEventClick(marker, item, type) {
		marker.on("click", (e) => {
			/// close RightSide
			this.closeRightSide();
			this.updateCenter(parseFloat(item.lat), parseFloat(item.long), this.zoomDetails);

			// const coordAndZoom = {
			//     zoom: e.target.__parent._zoom + 1,
			//     coord: e.target.__parent._cLatLng
			// }
			// setDataInLocalStorage("coordSearch", JSON.stringify(coordAndZoom))

			const zoom = this.map._zoom;
			const icon = this.getIcon(item, true);

			marker.setIcon(setIconn(icon.path, "", icon.size, zoom));

			this.updateLastMarkerSelected(marker, type);

			this.renderFicheDetails(item, type);

			this.markers.refreshClusters();

			if (document.querySelector("#dockableIcone_" + type + "_" + item.id))
				document.querySelector("#dockableIcone_" + type + "_" + item.id).remove();

			if (document.querySelector("#dockableBtn_" + type + "_" + item.id))
				document.querySelector("#dockableBtn_" + type + "_" + item.id).remove();

			removeOrEditSpecificElement();
		});
	}

	bindEventClickResto(marker, item) {
		marker.on("click", (e) => {
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

			this.updateLastMarkerSelected(marker, "resto");

			this.renderFicheDetails(item, "resto");

			this.markers.refreshClusters();
			if (document.querySelector("#dockableIcone_resto_" + item.id))
				document.querySelector("#dockableIcone_resto_" + item.id).remove();
			if (document.querySelector("#dockableBtn_resto_" + item.id))
				document.querySelector("#dockableBtn_resto_" + item.id).remove();
			removeOrEditSpecificElement();
		});
	}

	bindEventClickGolf(marker, item) {
		marker.on("click", (e) => {
			/// close RightSide
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

			this.updateLastMarkerSelected(marker, "golf");

			this.renderFicheDetails(item, "golf");

			this.markers.refreshClusters();
			if (document.querySelector("#dockableIcone_golf_" + item.id))
				document.querySelector("#dockableIcone_golf_" + item.id).remove();
			if (document.querySelector("#dockableBtn_golf_" + item.id))
				document.querySelector("#dockableBtn_golf_" + item.id).remove();
			removeOrEditSpecificElement();
		});
	}

	bindEventClickTabac(marker, item) {
		marker.on("click", (e) => {
			/// close RightSide
			this.closeRightSide();

			// this.updateCenter( parseFloat(item.lat ), parseFloat(item.long ), this.zoomDetails);

			const zoom = this.map._zoom;
			const icon = this.getIcon(item, true);

			marker.setIcon(setIconn(icon.path, "", icon.size, zoom));

			this.updateLastMarkerSelected(marker, "tabac");

			this.renderFicheDetails(item, "tabac");

			this.markers.refreshClusters();
			if (document.querySelector("#dockableIcone_tabac_" + item.id))
				document.querySelector("#dockableIcone_tabac_" + item.id).remove();
			if (document.querySelector("#dockableBtn_tabac_" + item.id))
				document.querySelector("#dockableBtn_tabac_" + item.id).remove();
			removeOrEditSpecificElement();
		});
	}

	/**
	 * @author Jehovanie RAMANDRIJOEL <jehovanierama@gmail.com>
	 *
	 * Fetch data from the serve and afficher details
	 *
	 * @param {*} item item related to the marker
	 * @param {*} type type of the marker such as "ferme" or "station" or "resto" , ...
	 *
	 * @return void
	 */
	renderFicheDetails(item, type) {
		if (type === "ferme") {
			if (screen.width < 991) {
				getDetailFerme(item.departement, item.departementName, item.id, true);
			} else {
				getDetailFerme(item.departement, item.departementName, item.id, true);
			}
		} else if (type === "station") {
			// @Route("/station/departement/{depart_code}/{depart_name}/details/{id}" , name="station_details", methods={"GET"})
			if (screen.width < 991) {
				getDetailStation(item.depName.trim().replace("?", ""), item.dep.toString().trim(), item.id, true);
				// getDetailHomeForMobile("/station/departement/" + item.dep.toString().trim() + "/" + item.depName.trim().replace("?", "") + "/details/" + item.id)
			} else {
				getDetailStation(item.depName.trim().replace("?", ""), item.dep.toString().trim(), item.id, true);
			}
		} else if (type === "resto") {
			if (screen.width < 991) {
				getDetailResto(item.dep, item.depName, item.id, true);
				// var pathDetails = `/restaurant-mobile/departement/${departementName}/${dataResto.dep}/details/${dataResto.id}`;
				// location.assign(pathDetails)
			} else {
				getDetailResto(item.dep, item.depName, item.id, true);
			}
		} else if (type === "golf") {
			if (screen.width < 991) {
				getDetailGolf(item.dep, item.nom_dep, item.id, true);
			} else {
				getDetailGolf(item.dep, item.nom_dep, item.id, true);
			}
		} else if (type === "tabac") {
			if (screen.width < 991) {
				getDetailTabac(item.dep, item.nom_dep, item.id, true);
			} else {
				getDetailTabac(item.dep, item.nom_dep, item.id, true);
			}
		} else if (type === "marche") {
			let params = null;
			if (item.hasOwnProperty("status")) {
				params = "userCreate=true";
			}
			getDetailMarche(item.dep, item.depName, item.id, true, params);
		}
	}

	settingSingleMarkerResto(item, isSelected = false) {
		const zoom = this.map._zoom;
		const icon = this.getIcon(item, isSelected);

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

		// const marker = L.marker(L.latLng(parseFloat(item.lat), parseFloat(item.long)), { icon: setIconn('assets/icon/NewIcons/icon-resto-new-B.png'),id: item.id, type: "resto" });
		// const marker = L.marker(L.latLng(parseFloat(item.lat), parseFloat(item.long)), { icon: setIconn(poi_icon, '', isPastille ), id: item.id, type: "resto" });

		let marker = null;

		if (!item.moyenne_note) {
			marker = L.marker(L.latLng(parseFloat(item.lat), parseFloat(item.long)), {
				icon: setIconn(icon.path, "content_badge", icon.size, zoom),
				cleNom: item.denominationF,
				id: item.id,
				type: "resto",
			});
		} else {
			// marker=this.setSpecialMarkerToShowNote(L.latLng(parseFloat(item.lat), parseFloat(item.long)),item, false, poi_icon, poi_icon, isPastille)
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

		this.bindEventClickResto(marker, item);

		//reorganisePastille()
		this.markers.addLayer(marker);
	}

	settingSingleMarkerGolf(item, isSelected = false) {
		const zoom = this.map._zoom;
		const icon = this.getIcon(item, isSelected);

		let marker = null;
		if (!item.moyenne_note) {
			marker = L.marker(L.latLng(parseFloat(item.lat), parseFloat(item.long)), {
				icon: setIconn(icon.path, "content_badge", icon.size, zoom),
				// cleNom: item.denominationF,
				id: item.id,
				type: "golf",
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

		const adress = "<br><span class='fw-bolder'> Adresse:</span> <br>" + item.nom_commune + " " + item.adresse;
		const title =
			"<span class='fw-bolder'> Golf: </span>" +
			item.name +
			".<span class='fw-bolder'><br>Departement: </span>" +
			item.dep +
			"." +
			adress;

		marker.bindTooltip(title, { direction: "top", offset: L.point(0, -30) }).openTooltip();

		this.bindEventClickGolf(marker, item);

		this.markers.addLayer(marker);
	}

	settingSingleMarkerTabac(item, isSelected = false) {
		const zoom = this.map._zoom;
		const icon = this.getIcon(item, isSelected);

		let marker = L.marker(L.latLng(parseFloat(item.lat), parseFloat(item.long)), {
			icon: setIconn(icon.path, "content_badge", icon.size, zoom),
			id: item.id,
			type: "tabac",
		});

		const adress = `<br><span class='fw-bolder'> Adresse:</span> <br> ${item.numvoie} ${item.typevoie} ${item.nomvoie} ${item.codpost} ${item.villenorm}`;
		let title =
			"<span class='fw-bolder'> Tabac: </span>" +
			item.name +
			".<span class='fw-bolder'><br>Departement: </span>" +
			item.dep +
			" " +
			item.depName +
			" ." +
			adress;

		marker.bindTooltip(title, { direction: "top", offset: L.point(0, -30) }).openTooltip();

		this.bindEventClickTabac(marker, item);

		this.markers.addLayer(marker);
	}

	settingSingleMarkerMarche(item, isSelected = false) {
		const zoom = this.map._zoom;
		const icon = this.getIcon(item, isSelected);

		let marker = null;
		marker = L.marker(L.latLng(parseFloat(item.lat), parseFloat(item.long)), {
			icon: setIconn(icon.path, "", icon.size, zoom),
			cleNom: item.denominationF,
			id: item.id,
			type: "marche",
			draggable: false,
		});

		const title = `
					<div>
						<span class='fw-bolder'> Marché: </span>  
						${item.denominationF}<br>
						<span class='fw-bolder'>Adresse:</span>
						${item.adresse}
					</div>
				`;

		marker.bindTooltip(title, { direction: "top", offset: L.point(0, -30) }).openTooltip();

		this.bindEventClick(marker, item, "marche");

		this.markers.addLayer(marker);
	}

	updateLastMarkerSelected(marker, type) {
		if (this.marker_last_selected && this.marker_last_selected != marker) {
			const default_data = this.default_data.results[0];
			let last_item = null;
			if (this.marker_last_selected_type === "station") {
				last_item = default_data.find(
					(item) =>
						parseInt(item.id) === parseInt(this.marker_last_selected.options.id) &&
						item.station != undefined
				);
			} else if (this.marker_last_selected_type === "ferme") {
				last_item = default_data.find(
					(item) =>
						parseInt(item.id) === parseInt(this.marker_last_selected.options.id) && item.ferme != undefined
				);
			} else if (this.marker_last_selected_type === "resto") {
				last_item = default_data.find(
					(item) =>
						parseInt(item.id) === parseInt(this.marker_last_selected.options.id) && item.resto != undefined
				);
			} else if (this.marker_last_selected_type === "golf") {
				last_item = default_data.find(
					(item) =>
						parseInt(item.id) === parseInt(this.marker_last_selected.options.id) && item.golf != undefined
				);
			} else if (this.marker_last_selected_type === "tabac") {
				last_item = default_data.find(
					(item) =>
						parseInt(item.id) === parseInt(this.marker_last_selected.options.id) && item.tabac != undefined
				);
			} else if (this.marker_last_selected_type === "marche") {
				last_item = default_data.find(
					(item) =>
						parseInt(item.id) === parseInt(this.marker_last_selected.options.id) && item.marche != undefined
				);
			}

			const zoom = this.map._zoom;
			const icon = this.getIcon(last_item, false);

			const array_content_moyenne = ["resto", "golf"];
			if (array_content_moyenne.includes(this.marker_last_selected_type)) {
				// let oneResto = this.default_data.results[0].find(jtem => jtem.resto && parseInt(this.marker_last_selected.options.id) === parseInt(jtem.id))
				// this.marker_last_selected.setIcon(this.setSpecialIcon(oneResto, false, icon_marker, icon_marker, 0))
				if (!last_item.moyenne_note) {
					this.marker_last_selected.setIcon(setIconn(icon.path, "", icon.size, zoom));
				} else {
					this.marker_last_selected.setIcon(
						// this.setSpecialIcon(oneResto, false, poi_icon, poi_icon_Selected, isPastille)
						this.setSpecialIconRefactor(last_item, icon.path, icon.size)
					);
				}
			} else {
				this.marker_last_selected.setIcon(setIconn(icon.path, "", icon.size, zoom));
			}
		}
		this.marker_last_selected = marker;
		this.marker_last_selected_type = type;
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

	async updateData(new_min_ll, new_max_ll) {
		try {
			const data = {
				last: { min: this.last_minll, max: this.last_maxll },
				new: { min: new_min_ll, max: new_max_ll },
			};

			if (this.last_minll.lat > new_min_ll.lat && this.last_maxll.lng < new_max_ll.lng) {
				///same action update

				if (!this.is_online) {
					this.is_online = true;
					await this.addPeripheriqueMarker(data);
					this.last_minll = new_min_ll;
					this.last_maxll = new_max_ll;
				}
			}
		} catch (e) {
			console.log(e.message);
		}
	}

	addPeripheriqueMarker(new_size) {
		let data_peripherique = [];
		const { minx, miny, maxx, maxy } = new_size;

		const all_data = this.transformDataStructure();
		all_data.forEach((item) => {
			const isCanDisplay =
				parseFloat(item.lat) > parseFloat(miny) &&
				parseFloat(item.lat) < parseFloat(maxy) &&
				parseFloat(item.long) > parseFloat(minx) &&
				parseFloat(item.long) < parseFloat(maxx);
			if (isCanDisplay) {
				data_peripherique.push(item);
			}
		});
		this.addMarkerNewPeripherique(data_peripherique, new_size);
	}

	generate_checkout_option(content_filter) {
		this.generate_filter(content_filter, "filterTous", "Tous");
		this.generate_filter(content_filter, "filterFerme", "Ferme");
		this.generate_filter(content_filter, "filterStation", "Station");
		this.generate_filter(content_filter, "filterResto", "Réstaurant");
		this.generate_filter(content_filter, "filterVehicule", "Véhicule", true, true);
		this.generate_filter(content_filter, "filterCommerce", "Commerce", true, true);

		if (screen.width < 991) {
			document.querySelector(".content_filter_global_modal_jheo_js").appendChild(content_filter);
		} else {
			document.querySelector("#map").appendChild(content_filter);
		}
	}

	/* generate filter right */
	generate_filter(parent, id, textContent, state = true, none = false) {
		const div_filter = document.createElement("div");
		div_filter.className = "form-check form-switch";

		if (none) {
			div_filter.style.display = "none";
		}

		const input_filter = document.createElement("input");
		input_filter.className = "form-check-input";
		input_filter.type = "checkbox";
		input_filter.checked = state ? state : false;
		input_filter.setAttribute("id", id);
		input_filter.setAttribute("name", id);

		div_filter.appendChild(input_filter);

		const label_filter = document.createElement("label");
		label_filter.className = "form-check-label";
		label_filter.innerText = textContent;
		label_filter.setAttribute("for", id);

		div_filter.appendChild(label_filter);

		parent.appendChild(div_filter);
	}

	async generate_select_dep(parent, id_selected = null) {
		const div_select = document.createElement("select");
		div_select.className = "form-select input_select_dep_js_jheo";
		div_select.setAttribute("aria-label", "Sélectionnez un département");

		const default_options = document.createElement("option");
		default_options.innerText = "Tous les departements";
		default_options.setAttribute("value", "Tous les departements");
		div_select.appendChild(default_options);

		try {
			const response = await fetch("/api/alldepartements");
			const obj_dep = await response.json();
			this.all_dep = obj_dep.departements;

			this.all_dep.forEach((item) => {
				const option = document.createElement("option");

				if (item.id === id_selected) {
					option.setAttribute("selected", "");
				}
				option.setAttribute("value", item.id);
				option.innerText = `${item.id}: ${item.departement}`;

				div_select.appendChild(option);
			});
			parent.appendChild(div_select);
			this.eventManagement();
		} catch (e) {
			console.log(e);
		}
	}

	eventManagement() {
		if (document.querySelector(".content_filter_js_jheo")) {
			const alltype = document.querySelectorAll(".content_filter input");
			alltype.forEach((item) => {
				item.addEventListener("click", (e) => this.changeType(e));
			});
		}

		if (document.querySelector(".input_select_dep_js_jheo")) {
			document
				.querySelector(".input_select_dep_js_jheo")
				.addEventListener("change", (e) => this.checkStateSelectedDep(e));
		} else {
			console.log("event select dep not found");
		}
	}

	changeType(e) {
		document.querySelector(".btn_close_modal_filter_jheo_js")?.click();

		if (e.target.name === "filterTous") {
			if (document.querySelector("#filterTous").checked) {
				document.querySelectorAll(".content_filter input").forEach((item) => {
					item.checked = true;
				});
			} else {
				document.querySelectorAll(".content_filter input").forEach((item) => {
					item.checked = false;
				});
			}
		}

		const lists = ["filterFerme", "filterStation", "filterResto", "filterVehicule", "filterCommerce"];

		let result_temp = [];
		let results = null;
		for (let item of lists) {
			results = this.handleOnlyStateCheckbox(result_temp, item);
			result_temp = results;
		}

		if (results.every((item) => item.state === 1)) {
			document.querySelector("#filterTous").checked = true;
		} else {
			document.querySelector("#filterTous").checked = false;
		}

		this.filterDataByDep();
	}

	checkeFilterType(data) {
		let results = null;
		if (document.querySelector(".content_filter_js_jheo")) {
			const lists = ["filterFerme", "filterStation", "filterResto", "filterVehicule", "filterCommerce"];
			let result_temp = [];
			for (let item of lists) {
				results = this.handleOnlyStateCheckbox(result_temp, item);
				result_temp = results;
			}
		} else {
			results = [
				{ type: "filterFerme", state: 1 },
				{ type: "filterStation", state: 1 },
				{ type: "filterResto", state: 1 },
			];
		}

		const code_dep =
			document.querySelector(".input_select_dep_js_jheo").value.length < 3
				? document.querySelector(".input_select_dep_js_jheo").value
				: null;

		let data_ferme = [],
			data_station = [],
			data_resto = [];
		results.forEach((item) => {
			const { type, state } = item;
			if (state === 1) {
				if (type === "filterFerme") {
					data_ferme = code_dep
						? data.ferme.filter(({ departement }) => {
								if (parseInt(code_dep) === 20) {
									return (
										departement.trim() === "2A" ||
										departement.trim() === "2B" ||
										parseInt(departement) === 20
									);
								} else {
									return parseInt(departement) === parseInt(code_dep);
								}
						  })
						: data.ferme;
				} else if (type === "filterStation") {
					data_station = code_dep
						? data.station.filter(({ departementCode }) => {
								if (parseInt(code_dep) === 20) {
									return (
										departementCode.trim() === "2A" ||
										departementCode.trim() === "2B" ||
										parseInt(departementCode) === 20
									);
								} else {
									return parseInt(departementCode) === parseInt(code_dep);
								}
						  })
						: data.station;
				} else if (type === "filterResto") {
					data_resto = code_dep
						? data.resto.filter(({ dep }) => {
								if (parseInt(code_dep) === 20) {
									return dep.trim() === "2A" || dep.trim() === "2B" || parseInt(dep) === 20;
								} else {
									return parseInt(dep) === parseInt(code_dep);
								}
						  })
						: data.resto;
				}
			}
		});

		return { ferme: data_ferme, station: data_station, resto: data_resto };
	}

	checkStateSelectedDep(e) {
		const code_dep = e.target.value.length < 3 ? e.target.value : null;
		if (code_dep) {
			this.map.setView(L.latLng(centers[parseInt(code_dep)].lat, centers[parseInt(code_dep)].lng));
			this.map.setZoom(centers[parseInt(code_dep)].zoom + 2);
		}
		this.filterDataByDep();
	}

	handleOnlyStateCheckbox(tab, item) {
		let result = [];
		let state = { type: document.querySelector(`#${item}`).getAttribute("name") };

		if (document.querySelector(`#${item}`).checked) {
			state = { ...state, state: 1 };
		} else {
			state = { ...state, state: 0 };
		}

		if (tab.length === 0) {
			return [state];
		} else {
			result = [...tab, state];
		}
		return result;
	}

	filterDataByDep() {
		const data_filtered = this.checkeFilterType(this.default_data);
		this.removeMarker();

		if (data_filtered.ferme.length > 0 && data_filtered.station.length > 0) {
			this.data = {
				...this.data,
				ferme: data_filtered.ferme,
				station: data_filtered.station,
				resto: data_filtered.resto,
			};
			this.addMarker(this.data);
		} else {
			let bounds = this.map.getBounds();
			let minll = bounds.getSouthWest();
			let maxll = bounds.getNorthEast();
			const data = { last: { min: minll, max: maxll }, new: {} };
			this.addPeripheriqueMarker(data);
		}
	}

	removeMarker() {
		this.markers.clearLayers();
		this.map.removeLayer(this.markers);
	}

	redirectOnAdresse(lat, lng, zoom) {
		this.map.setView([lat, lng], zoom);
	}

	updateStatusDataItem(user_status, id, type) {
		if (type === "golf") {
			this.updateStatusDataGolfItem(user_status, id);
		}
	}

	updateStatusDataGolfItem(user_status, id) {
		// this.data = this.default_data; /// [ results [ data, length, type], allIdRestoPastille,type, cles0, cles1, origin_cles1]

		if (
			this.default_data.results[0].some(
				(item) => parseInt(item.id) === parseInt(id) && item.hasOwnProperty("golf")
			)
		) {
			this.default_data.results[0] = this.default_data.results[0].map((item) => {
				if (parseInt(item.id) === parseInt(id) && item.hasOwnProperty("golf")) {
					item.user_status = { ...item.user_status, ...user_status };
				}
				return item;
			});

			this.data.results[0] = this.data.results[0].map((item) => {
				if (parseInt(item.id) === parseInt(id) && item.hasOwnProperty("golf")) {
					item.user_status = { ...item.user_status, ...user_status }; /// { "a_faire" : ... , "fait" : ...  }
				}
				return item;
			});
		}
	}

	updateStateGolf(status, id) {
		/// new state for the data
		let user_status = this.getNewUserStatus(status); /// { a_faire: ..., fait: ..., mon_golf: ..., refaire: ... };
		if (
			this.default_data.results[0].some(
				(item) => parseInt(item.id) === parseInt(id) && item.hasOwnProperty("golf")
			)
		) {
			///update the global data state
			this.updateStatusDataItem(user_status, id, "golf");

			const golfModified = this.default_data.results[0].find(
				(item) => parseInt(item.id) === parseInt(id) && item.hasOwnProperty("golf")
			);

			this.markers.eachLayer((marker) => {
				if (marker.options.type === "golf" && parseInt(marker.options.id) === parseInt(id)) {
					const icon = this.getIcon(golfModified, true); /// path, size
					const zoom = this.map._zoom;
					if (!golfModified.moyenne_note) {
						marker.setIcon(setIconn(icon.path, "", icon.size, zoom));
					} else {
						marker.setIcon(
							// this.setSpecialIcon(oneResto, false, poi_icon, poi_icon_Selected, isPastille)
							this.setSpecialIconRefactor(golfModified, icon.path, icon.size)
						);
					}
				}
			});

			this.markers.refreshClusters();
		}
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
			if (parseInt(marker.options.id) === parseInt(idResto) && marker.options.type === "resto") {
				/*const icon_R = L.Icon.extend({
                    options: {
                        iconUrl: IS_DEV_MODE ? this.currentUrl.origin + "/"+  poi_icon_Selected: this.currentUrl.origin + "/public/" + poi_icon_Selected,
                        iconSize: isPastille === 2 ? [45, 60] : [30,45] ,
                        iconAnchor: [11, 30],
                        popupAnchor: [0, -20],
                        shadowSize: [68, 95],
                        shadowAnchor: [22, 94]
                    }
                })
                marker.setIcon(new icon_R);*/
				let oneResto = this.default_data.results[0].find(
					(jtem) => jtem.resto && parseInt(idResto) === parseInt(jtem.id)
				);
				marker.setIcon(this.setSpecialIcon(oneResto, true, poi_icon_Selected, poi_icon_Selected, isPastille));
			}
		});

		this.markers.refreshClusters();
	}

	injectListRestoPastille() {
		const restoPastilleTab = [];
		this.listRestoPastille.forEach((item) => {
			const restoPastille = this.default_data.results[0].find(
				(jtem) => parseInt(item.id_resto) === parseInt(jtem.id) && jtem.resto !== undefined
			);
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
		injectListMarker(restoPastilleTab, true);
	}

	/**
	 * @Author Nantenaina
	 * où: On utilise cette fonction dans la rubrique restaurant, restaurant specifique dép, arrondissement et tous de la carte cmz,
	 * localisation du fichier: dans MarkerClusterSearch.js,
	 * je veux: mettre à jour la note moyenne sur un POI
	 * si une POI a une note, la note se montre en haut à gauche du POI
	 */
	showNoteMoyenneRealTime(idItem, note, type) {
		console.log(type);
		this.markers.eachLayer((marker) => {
			if (parseInt(marker.options.id) === parseInt(idItem) && marker.options.type === type) {
				let single_data = this.default_data.results[0].find(
					(jtem) => parseInt(idItem) === parseInt(jtem.id) && jtem.hasOwnProperty(type)
				);
				single_data.moyenne_note = parseFloat(note).toFixed(2);

				const icon = this.getIcon(single_data, true);
				marker.setIcon(this.setSpecialIconRefactor(single_data, icon.path, icon.size));
			}
		});

		this.markers.refreshClusters();
	}

	/**
     *@author Nantenaina a ne pas contacté pendant les congés 
      où: on Utilise cette fonction dans la rubrique resto et tous carte cmz, 
     * localisation du fichier: dans MarkerClusterSearch.js,
     * je veux: rendre le marker draggable
     * si un utilisateur veut modifier une ou des informations
     * @param {} id 
     */
	makeMarkerDraggable(id) {
		this.markers.eachLayer((marker) => {
			if (parseInt(marker.options.id) === parseInt(id) && marker.options.type === "resto") {
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

	/**
	 * @override for the MapModule
	 *
	 * @author Jehovanie RAMANDRIJOEL <jehovanierama@gmail.com>
	 *
	 * @param {*} idToCheck
	 *
	 * @returns
	 */
	checkIsExist(idToCheck, type = "resto") {
		const default_data = this.transformDataStructure();
		if (default_data.some((item) => parseInt(item.id) === parseInt(idToCheck) && item.hasOwnProperty(type))) {
			let isAlreadyExist = false;
			this.markers.eachLayer((marker) => {
				if (parseInt(marker.options.id) === parseInt(idToCheck) && marker.options.type === type) {
					isAlreadyExist = true;
				}
			});

			if (!isAlreadyExist) {
				const data = default_data.find(
					(item) => parseInt(item.id) === parseInt(idToCheck) && item.hasOwnProperty(type)
				);
				this.settingSingleMarker(data, false);
			}
		}
		return default_data.some((item) => parseInt(item.id) === parseInt(idToCheck) && item.hasOwnProperty(type));
	}

	/**
	 * @override for the MapModule
	 *
	 * @author Jehovanie RAMANDRIJOEL <jehovanierama@gmail.com>
	 *
	 * @param {*} idToCheck
	 *
	 * @returns
	 */
	clickOnMarker(id, type = "resto") {
		this.markers.eachLayer((marker) => {
			if (parseInt(marker.options.id) === parseInt(id) && marker.options.type === type) {
				marker.fireEvent("click");
			}
		});
	}

	async fetchOneData(id) {
		try {
			await this.fetchOneResto(id);
		} catch (e) {
			console.log(e);
		}
	}

	async fetchOneResto(id) {
		try {
			const api_data = `/api/restaurant/one_data/${id}`;
			const response = await fetch(api_data);
			let { details } = await response.json();
			console.log(details);
			console.log(this.default_data);
			this.default_data.results[0] = [...this.default_data.results[0], details];

			this.settingSingleMarker(details, false);
			this.clickOnMarker(id);

			this.data = this.default_data;
		} catch (e) {
			console.log(e);
		}
	}

	makeMarkerDraggablePOI(id, type = "marche") {
		this.markers.eachLayer((marker) => {
			if (parseInt(marker.options.id) === parseInt(id) && marker.options.type == type) {
				let initialPos = marker.getLatLng();
				this.saveOriginPosition(id, initialPos);

				marker.dragging.enable();

				marker.on("dragend", (e) => {
					let position = marker.getLatLng();
					let lat = position.lat;
					let lng = position.lng;

					$("#modal_edit_poi_marche").modal("show");

					fetchInformationMarcheToEdit(id);

					document.querySelector("#edit_marche_departement").setAttribute("readOnly", "true");

					document.querySelector("#edit_marche_latitude").value = lng;
					document.querySelector("#edit_marche_latitude").setAttribute("readOnly", "true");

					document.querySelector("#edit_marche_longitude").value = lat;
					document.querySelector("#edit_marche_longitude").setAttribute("readOnly", "true");

					const btn_cancel = document.querySelector(".cancel_edit_poi_marche_jheo_js");
					btn_cancel.setAttribute("onclick", `cancelEditPoiMarche("${id}")`);

					const btn_close_modal_edit_poi = document.querySelector(".btn_close_modal_edit_poi_marche_jheo_js");
					btn_close_modal_edit_poi.setAttribute("onclick", `cancelEditPoiMarche("${id}")`);

					const btn_sendSubmit = document.querySelector(".submit_edit_poi_marche_jheo_js");
					btn_sendSubmit.setAttribute("onclick", `handleSubmitEditPOIMarche("${id}")`);

					marker.dragging.disable();
				});
			}
		});
	}

	addPendingDataMarche(item) {
		let already_exist = false;
		this.markers.eachLayer((marker) => {
			if (marker.options.hasOwnProperty("isPedding")) {
				if (parseInt(marker.options.id) === parseInt(item.id) && marker.options.isPedding == true) {
					already_exist = true;
				}
			}
		});

		if (!already_exist) {
			const zoom = this.map._zoom;
			const icon = this.getIcon(item, false);

			let marker = null;
			marker = L.marker(L.latLng(parseFloat(item.lat), parseFloat(item.long)), {
				icon: setIconn(icon.path, "", icon.size, zoom),
				cleNom: item.denominationF,
				id: item.id,
				type: "marche",
				draggable: false,
				isPedding: true,
			});

			const title = `
				<div>
					<span class='fw-bolder'> Marché: </span>  
					${item.denominationF}<br>
					<span class='fw-bolder'>Adresse:</span>
					${item.adresse}
				</div>
			`;
			marker.bindTooltip(title, { direction: "top", offset: L.point(0, -30) }).openTooltip();

			this.bindEventClick(marker, item, "marche");
			this.markers.addLayer(marker);

			this.default_data = {
				...this.default_data,
				results: [[...this.default_data.results[0], item], ...this.default_data.results],
			};
			this.data = { ...this.default_data };
		}

		this.markers.eachLayer((marker) => {
			if (marker.options.hasOwnProperty("isPedding")) {
				if (parseInt(marker.options.id) === parseInt(item.id) && marker.options.isPedding == true) {
					marker.fireEvent("click");
				}
			}
		});
	}
}
