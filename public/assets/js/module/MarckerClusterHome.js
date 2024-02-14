class MarckerClusterHome extends MapModule {
	constructor(nom_dep = null, id_dep = null, map_for_type = "tous") {
		super(id_dep, nom_dep, map_for_type);

		if (document.querySelector("#open-navleft")) {
			document.querySelector("#open-navleft").parentElement.removeChild(document.querySelector("#open-navleft"));
		}

		///override because for each rubric
		this.objectRatioAndDataMax = [
			{ zoomMin: 18, dataMax: 22, ratio: 4 },
			{ zoomMin: 16, dataMax: 17, ratio: 4 },
			{ zoomMin: 14, dataMax: 14, ratio: 3 },
			{ zoomMin: 13, dataMax: 12, ratio: 2 },
			{ zoomMin: 9, dataMax: 8, ratio: 2 },
			{ zoomMin: 6, dataMax: 6, ratio: 1 },
			{ zoomMin: 4, dataMax: 1, ratio: 0 },
			{ zoomMin: 1, dataMax: 1, ratio: 0 },
		];
	}

	async onInit(isAddControl = false) {
		// const url = `/getLatitudeLongitudeForAll`;
		try {
			this.initMap(null, null, null, isAddControl);

			////create new marker Cluster for POI etablisment
			this.createMarkersCluster();
			////create new marker Cluster special for count per dep.
			this.createMarkersClusterForCountPerDep();

			this.api_data = "/dataHome";
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
					encodeURIComponent(maxy) +
					"&isFirstResquest=true";
			}

			//// api get all data from server and return objects
			const response = await fetch(`${this.api_data}${param}`);

			//// api get all data from server
			this.default_data = await response.json(); /// { station, ferme, resto, golf, tabac, marche, allIdRestoPasstille}

			this.data = this.default_data; /// { station, ferme, resto, golf, tabac, marche, allIdRestoPasstille}

			this.listRestoPastille = this.default_data.allIdRestoPastille; /// [  { id_resto : ..., tableName : ..., name_tribu_t_muable : ..., logo_path : ... } , ... ]
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

		this.addEventOnMap(this.map);
		this.generateFilterAndSelectDep();
	}

	getGeos() {
		// this.geos = [];
		// if (this.id_dep) {
		//     if (this.id_dep === 20) {
		//         for (let corse of ['2A', '2B']) {
		//             this.geos.push(franceGeo.features.find(element => element.properties.code == corse))
		//         }
		//     } else {
		//         this.geos.push(franceGeo.features.find(element => element.properties.code === this.id_dep))
		//     }
		// } else {
		//     for (let f of franceGeo.features) {
		//         this.geos.push(f)
		//     }
		// }
	}

	displayData() {
		console.log(this.data);
		console.log(this.geos);
		console.log(this.map);
	}

	createMarkersCluster() {
		this.markers = L.markerClusterGroup({
			chunkedLoading: true,
			animate: true,
			animateAddingMarkers: true,
			chunkedLoading: true,
			spiderfyOnEveryZoom: true,
			disableClusteringAtZoom: true,
			// iconCreateFunction: function (cluster) {
			// console.log(cluster.getAllChildMarkers())

			// var pointA = new L.LatLng(28.635308, 77.22496);
			// var pointB = new L.LatLng(28.984461, 77.70641);
			// var pointList = [pointA, pointB];

			// return L.polyline(pointList, {
			//     color: 'red',
			//     weight: 3,
			//     opacity: 0.5,
			//     smoothFactor: 1
			// });
			// return L.divIcon({
			//     html: '<div class="markers_tommy_js">' + cluster.getChildCount() + '</div>',
			//     className: "mycluster",
			//     iconSize:L.point(35,35)
			// });
			// },
		});

		// const that = this;
		// const temp= 200;
		// this.markers = L.markerClusterGroup({
		//     chunkedLoading: true,
		//     chunkInterval: temp * 5,
		//     chunkDelay: temp,
		//     removeOutsideVisibleBounds: true,
		//     iconCreateFunction: function (cluster) {
		//         if(that.marker_last_selected){
		//             let sepcMarmerIsExist = false;
		//             for (let g of  cluster.getAllChildMarkers()){
		//                 if (parseInt(that.marker_last_selected.options.id) === parseInt(g.options.id)) {
		//                     if(that.marker_last_selected.options.hasOwnProperty('type')){
		//                         if( that.marker_last_selected.options.type === g.options.type ){
		//                             sepcMarmerIsExist = true;
		//                         }
		//                     }else{
		//                         sepcMarmerIsExist = true;
		//                     }
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
		const { station, ferme, resto, golf, tabac, marche } = newData;

		if (station || ferme || resto || golf || tabac || marche) {
			///all resto
			if (resto.length > 0) {
				this.addResto(resto);
			}

			///all resto
			if (marche.length > 0) {
				this.addMarche(marche);
			}

			///all fermes
			if (ferme.length > 0) {
				this.addFerme(ferme);
			}

			if (station.length > 0) {
				this.addStation(station);
			}

			// ///all golf
			if (golf.length > 0) {
				this.addGolf(golf);
			}

			if (tabac.length > 0) {
				this.addTabac(tabac);
			}

			/// check if the zoom related to the marker poi
			const zoom = this.map.getZoom();
			if (zoom >= this.zoom_max_for_count_per_dep) {
				this.map.addLayer(this.markers);
			}

			this.removePolylineAndSpyderfyMarker();

			////count marker in map
			this.countMarkerInCart();
		} else {
			console.log("ERREUR : L'erreur se produit par votre réseaux.");
		}
	}

	addStation(dataStation) {
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

		dataStation.forEach((item) => {
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
	}

	addFerme(dataFerme) {
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

		dataFerme.forEach((item) => {
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
	}

	addResto(dataResto) {
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

		dataResto.forEach((item) => {
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
	}

	addGolf(dataGolf) {
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

		dataGolf.forEach((item) => {
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
	}

	addTabac(dataTabac) {
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

		dataTabac.forEach((item) => {
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
	}

	addMarche(dataMarche) {
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

		dataMarche.forEach((item) => {
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
	}

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
				icon_size = isSelected ? 2 : 0;
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
				icon_size = isSelected ? 3 : 2;
			}
		} else if (item.tabac !== undefined) {
			icon_path = isSelected ? "assets/icon/NewIcons/tabac_red0.png" : "assets/icon/NewIcons/tabac_black0.png";
		} else if (item.marche !== undefined) {
			icon_path = isSelected
				? "assets/icon/NewIcons/icon_marche_selected.png"
				: "assets/icon/NewIcons/icon_marche.png";
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
			// icon: setIconn("assets/icon/NewIcons/icon-station-new-B.png"),
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

		this.handleClickStation(marker, item);
		this.markers.addLayer(marker);
	}

	handleClickStation(stationMarker, dataStation) {
		stationMarker.on("click", (e) => {
			////close right if this open
			this.closeRightSide();

			this.updateCenter(parseFloat(dataStation.lat), parseFloat(dataStation.long), this.zoomDetails);

			const zoom = this.map._zoom;
			const icon = this.getIcon(dataStation, true);

			stationMarker.setIcon(setIconn(icon.path, "", icon.size, zoom));

			this.updateLastMarkerSelected(stationMarker, "station");

			if (screen.width < 991) {
				getDetailStation(
					dataStation.departementName.toString().trim().replace("?", ""),
					dataStation.departementCode.toString().toString().trim(),
					dataStation.id,
					true
				);
			} else {
				getDetailStation(
					dataStation.departementName.toString().trim().replace("?", ""),
					dataStation.departementCode.toString().toString().trim(),
					dataStation.id,
					true
				);
			}
			if (document.querySelector("#dockableIcone_station_" + dataStation.id))
				document.querySelector("#dockableIcone_station_" + dataStation.id).remove();
			if (document.querySelector("#dockableBtn_station_" + dataStation.id))
				document.querySelector("#dockableBtn_station_" + dataStation.id).remove();
			removeOrEditSpecificElement();
		});
	}

	settingSingleMarkerFerme(item, isSelected = false) {
		const zoom = this.map._zoom;
		const icon = this.getIcon(item, isSelected);

		const marker = L.marker(L.latLng(parseFloat(item.lat), parseFloat(item.long)), {
			icon: setIconn(icon.path, "content_badge", icon.size, zoom),
			id: item.id,
			type: "ferme",
		});

		const adress = "<br><span class='fw-bolder'> Adresse:</span> <br>" + item.adresseFerme;
		const title =
			"<span class='fw-bolder'>Ferme: </span>" +
			item.nomFerme +
			".<span class='fw-bolder'> <br> Departement:</span>" +
			item.departement +
			"." +
			adress;

		marker.bindTooltip(title, { direction: "auto", offset: L.point(0, -30) }).openTooltip();

		this.handleClickFerme(marker, item);

		this.markers.addLayer(marker);
	}

	handleClickFerme(fermeMarker, dataFerme) {
		fermeMarker.on("click", (e) => {
			////close right if this open
			this.closeRightSide();

			this.updateCenter(parseFloat(dataFerme.lat), parseFloat(dataFerme.long), this.zoomDetails);

			const zoom = this.map._zoom;
			const icon = this.getIcon(dataFerme, true);

			fermeMarker.setIcon(setIconn(icon.path, "", icon.size, zoom));

			this.updateLastMarkerSelected(fermeMarker, "ferme");

			if (screen.width < 991) {
				getDetailFerme(dataFerme.departement, dataFerme.departementName, dataFerme.id, true);
			} else {
				getDetailFerme(dataFerme.departement, dataFerme.departementName, dataFerme.id, true);
			}

			if (document.querySelector("#dockableIcone_ferme_" + dataFerme.id))
				document.querySelector("#dockableIcone_ferme_" + dataFerme.id).remove();
			if (document.querySelector("#dockableBtn_ferme_" + dataFerme.id))
				document.querySelector("#dockableBtn_ferme_" + dataFerme.id).remove();
			removeOrEditSpecificElement();
		});
	}

	settingSingleMarkerResto(item, isSelected = false) {
		const zoom = this.map._zoom;
		const icon = this.getIcon(item, isSelected);

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
				icon.size
			);
		}

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

		this.handleClickResto(marker, item);
		this.markers.addLayer(marker);
	}

	handleClickResto(restoMarker, dataResto) {
		restoMarker.on("click", (e) => {
			////close right if this open
			this.closeRightSide();

			this.updateCenter(parseFloat(dataResto.lat), parseFloat(dataResto.long), this.zoomDetails);

			const zoom = this.map._zoom;
			const icon = this.getIcon(dataResto, true);

			if (!dataResto.moyenne_note) {
				restoMarker.setIcon(setIconn(icon.path, "", icon.size, zoom));
			} else {
				// restoMarker.setIcon(this.setSpecialIcon(dataResto, true, poi_icon_Selected, poi_icon_Selected, isPastille));
				restoMarker.setIcon(this.setSpecialIconRefactor(dataResto, icon.path, icon.size));
			}

			this.updateLastMarkerSelected(restoMarker, "resto");

			if (screen.width < 991) {
				getDetailResto(dataResto.dep, dataResto.depName, dataResto.id, true);
			} else {
				getDetailResto(dataResto.dep, dataResto.depName, dataResto.id, true);
			}

			if (document.querySelector("#dockableIcone_resto_" + dataResto.id))
				document.querySelector("#dockableIcone_resto_" + dataResto.id).remove();
			if (document.querySelector("#dockableBtn_resto_" + dataResto.id))
				document.querySelector("#dockableBtn_resto_" + dataResto.id).remove();
			removeOrEditSpecificElement();
		});
	}

	settingSingleMarkerGolf(item, isSelected = false) {
		const zoom = this.map._zoom;
		const icon = this.getIcon(item, isSelected);

		let marker = null;
		if (!item.moyenne_note) {
			marker = L.marker(L.latLng(parseFloat(item.lat), parseFloat(item.long)), {
				icon: setIconn(icon.path, "content_badge", icon.size, zoom),
				cleNom: item.denominationF,
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

		// console.log(item)
		const adress = "<br><span class='fw-bolder'> Adresse:</span> <br>" + item.commune + " " + item.adress;
		let title =
			"<span class='fw-bolder'> Golf: </span>" +
			item.name +
			".<span class='fw-bolder'><br>Departement: </span>" +
			item.dep +
			"." +
			adress;
		marker.bindTooltip(title, { direction: "top", offset: L.point(0, -30) }).openTooltip();

		this.handleClickGolf(marker, item);

		this.markers.addLayer(marker);
	}

	handleClickGolf(golfMarker, item) {
		golfMarker.on("click", (e) => {
			////close right if this open
			this.closeRightSide();
			this.updateCenter(parseFloat(item.lat), parseFloat(item.long), this.zoomDetails);

			const zoom = this.map._zoom;
			const icon = this.getIcon(item, true);

			if (!item.moyenne_note) {
				golfMarker.setIcon(setIconn(icon.path, "", icon.size, zoom));
			} else {
				// marker.setIcon(this.setSpecialIcon(item, true, poi_icon, poi_icon_Selected, isPastille))
				golfMarker.setIcon(this.setSpecialIconRefactor(item, icon.path, icon.size));
			}

			this.updateLastMarkerSelected(golfMarker, "golf");

			if (screen.width < 991) {
				getDetailGolf(item.dep, item.nom_dep, item.id, true);
			} else {
				getDetailGolf(item.dep, item.nom_dep, item.id, true);
			}

			if (document.querySelector("#dockableIcone_golf_" + item.id))
				document.querySelector("#dockableIcone_golf_" + item.id).remove();

			if (document.querySelector("#dockableBtn_golf_" + item.id))
				document.querySelector("#dockableBtn_golf_" + item.id).remove();

			removeOrEditSpecificElement();
		});
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

		this.handleClickTabac(marker, item);

		this.markers.addLayer(marker);
	}

	handleClickTabac(tabacMarker, item) {
		tabacMarker.on("click", (e) => {
			////close right if this open
			this.closeRightSide();

			this.updateCenter(parseFloat(item.lat), parseFloat(item.long), this.zoomDetails);

			const zoom = this.map._zoom;
			const icon = this.getIcon(item, true);

			tabacMarker.setIcon(setIconn(icon.path, "", icon.size, zoom));

			this.updateLastMarkerSelected(tabacMarker, "tabac");

			if (screen.width < 991) {
				getDetailTabac(item.dep, item.nom_dep, item.id, true);
			} else {
				getDetailTabac(item.dep, item.nom_dep, item.id, true);
			}
			if (document.querySelector("#dockableIcone_tabac_" + item.id))
				document.querySelector("#dockableIcone_tabac_" + item.id).remove();

			if (document.querySelector("#dockableBtn_tabac_" + item.id))
				document.querySelector("#dockableBtn_tabac_" + item.id).remove();

			removeOrEditSpecificElement();
		});
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

		this.handleClickMarche(marker, item);

		this.markers.addLayer(marker);
	}

	handleClickMarche(marcheMarker, dataMarche) {
		marcheMarker.on("click", (e) => {
			////close right if this open
			this.closeRightSide();

			this.updateCenter(parseFloat(dataMarche.lat), parseFloat(dataMarche.long), this.zoomDetails);

			const zoom = this.map._zoom;
			const icon = this.getIcon(dataMarche, true);

			marcheMarker.setIcon(setIconn(icon.path, "", icon.size, zoom));

			this.updateLastMarkerSelected(marcheMarker, "marche");

			getDetailMarche(dataMarche.dep, dataMarche.depName, dataMarche.id, true);

			if (document.querySelector("#dockableIcone_marche_" + dataMarche.id))
				document.querySelector("#dockableIcone_marche_" + dataMarche.id).remove();

			if (document.querySelector("#dockableBtn_marche_" + dataMarche.id))
				document.querySelector("#dockableBtn_marche_" + dataMarche.id).remove();

			removeOrEditSpecificElement();
		});
	}

	updateLastMarkerSelected(marker, type) {
		if (this.marker_last_selected && this.marker_last_selected !== marker) {
			let last_item = null;
			if (this.marker_last_selected_type === "station") {
				last_item = this.default_data.station.find(
					({ id }) => parseInt(id) === parseInt(this.marker_last_selected.options.id)
				);
			} else if (this.marker_last_selected_type === "ferme") {
				last_item = this.default_data.ferme.find(
					({ id }) => parseInt(id) === parseInt(this.marker_last_selected.options.id)
				);
			} else if (this.marker_last_selected_type === "resto") {
				last_item = this.default_data.resto.find(
					({ id }) => parseInt(id) === parseInt(this.marker_last_selected.options.id)
				);
			} else if (this.marker_last_selected_type === "golf") {
				last_item = this.default_data.golf.find(
					({ id }) => parseInt(id) === parseInt(this.marker_last_selected.options.id)
				);
			} else if (this.marker_last_selected_type === "tabac") {
				last_item = this.default_data.tabac.find(
					({ id }) => parseInt(id) === parseInt(this.marker_last_selected.options.id)
				);
			} else if (this.marker_last_selected_type === "marche") {
				last_item = this.default_data.marche.find(
					({ id }) => parseInt(id) === parseInt(this.marker_last_selected.options.id)
				);
			}

			const zoom = this.map._zoom;
			const icon = this.getIcon(last_item, false);

			const array_content_moyenne = ["resto", "golf"];
			if (array_content_moyenne.includes(this.marker_last_selected_type)) {
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

		this.markers.refreshClusters();

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

			const response = await fetch(`/dataHome${param}`);
			let new_data = await response.json();

			let all_data = [];
			all_data = all_data.concat(new_data.marche);
			all_data = all_data.concat(new_data.resto);
			all_data = all_data.concat(new_data.golf);
			all_data = all_data.concat(new_data.tabac);
			all_data = all_data.concat(new_data.ferme);
			all_data = all_data.concat(new_data.station);

			this.addMarkerNewPeripherique(all_data, new_size);

			new_data.ferme = new_data.ferme.filter((item) => !this.default_data.ferme.some((j) => j.id === item.id));
			new_data.station = new_data.station.filter(
				(item) => !this.default_data.station.some((j) => j.id === item.id)
			);
			new_data.resto = new_data.resto.filter((item) => !this.default_data.resto.some((j) => j.id === item.id));
			new_data.golf = new_data.golf.filter((item) => !this.default_data.golf.some((j) => j.id === item.id));
			new_data.tabac = new_data.tabac.filter((item) => !this.default_data.tabac.some((j) => j.id === item.id));
			new_data.marche = new_data.marche.filter((item) => !this.default_data.marche.some((j) => j.id === item.id));

			// const result= this.checkeFilterType(new_data);
			// this.addMarker(result);

			this.default_data = {
				...this.default_data,
				ferme: this.default_data.ferme.concat(new_data.ferme),
				station: this.default_data.station.concat(new_data.station),
				resto: this.default_data.resto.concat(new_data.resto),
				golf: this.default_data.golf.concat(new_data.golf),
				tabac: this.default_data.tabac.concat(new_data.tabac),
				marche: this.default_data.marche.concat(new_data.marche),
			};
		} catch (e) {
			console.log(e);
		}
	}

	generateFilterAndSelectDep() {
		const content_filter = document.createElement("div");
		content_filter.className = "content_filter content_filter_js_jheo";

		// this.generate_checkout_option(content_filter) ///// must commented

		const content_filter_dep = document.createElement("div");
		content_filter_dep.className = "content_filter_dep";
		document.querySelector("#map").appendChild(content_filter_dep);

		this.generate_select_dep(content_filter_dep); /// and bind event
		// this.eventManagement();
	}

	generate_checkout_option(content_filter) {
		this.generate_filter(content_filter, "filterTous", "Tous");
		this.generate_filter(content_filter, "filterFerme", "Ferme");
		this.generate_filter(content_filter, "filterStation", "Station");
		this.generate_filter(content_filter, "filterResto", "Réstaurant");
		this.generate_filter(content_filter, "filterGolf", "Golf");
		this.generate_filter(content_filter, "filterTabac", "Tabac");
		// this.generate_filter(content_filter, "filterVehicule", "Véhicule", true, true)
		// this.generate_filter(content_filter, "filterCommerce", "Commerce", true, true)

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
		///// EVENT CHECK TYPE
		if (document.querySelector(".content_filter_js_jheo")) {
			const alltype = document.querySelectorAll(".content_filter input");
			alltype.forEach((item) => {
				item.addEventListener("click", (e) => this.changeType(e));
			});
		}

		//// EVENT SELECT DEPARTEMENT
		if (document.querySelector(".input_select_dep_js_jheo")) {
			document
				.querySelector(".input_select_dep_js_jheo")
				.addEventListener("change", (e) => this.checkStateSelectedDep(e));
		} else {
			console.log("event select dep not found");
		}
	}

	changeType(e) {
		if (document.querySelector(".btn_close_modal_filter_jheo_js")) {
			document.querySelector(".btn_close_modal_filter_jheo_js").click();
		}

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

		// const lists = ["filterFerme", "filterStation", "filterResto", "filterVehicule", "filterCommerce"];
		const lists = ["filterFerme", "filterStation", "filterResto", "filterGolf", "filterTabac"];

		let result_temp = [];
		let results = null;
		for (let item of lists) {
			results = this.handleOnlyStateCheckbox(result_temp, item);
			result_temp = results;
		}
		if (results.length > 0 && results.every((item) => item.state === 1)) {
			document.querySelector("#filterTous").checked = true;
		} else {
			document.querySelector("#filterTous").checked = false;
		}

		this.filterDataByDep();
	}

	checkeFilterType(data) {
		let results = null;
		if (document.querySelector(".content_filter_js_jheo")) {
			/// these is id on the option field
			// const lists = ["filterFerme", "filterStation", "filterResto", "filterVehicule", "filterCommerce"];
			const lists = ["filterFerme", "filterStation", "filterResto", "filterGolf", "filterTabac"];

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
				{ type: "filterGolf", state: 1 },
				{ type: "filterTabac", state: 1 },
			];
		}

		const code_dep =
			document.querySelector(".input_select_dep_js_jheo").value.length < 3
				? document.querySelector(".input_select_dep_js_jheo").value
				: null;

		let data_ferme = [],
			data_station = [],
			data_resto = [],
			data_golf = [],
			data_tabac = [];
		results.forEach((item) => {
			const { type, state } = item;
			if (state === 1) {
				if (type === "filterFerme") {
					data_ferme = code_dep
						? data.ferme.filter(({ departement }) => {
								if (parseInt(code_dep) === 20) {
									return (
										departement.toString().trim() === "2A" ||
										departement.toString().trim() === "2B" ||
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
										departementCode.toString().trim() === "2A" ||
										departementCode.toString().trim() === "2B" ||
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
									return (
										dep.toString().trim() === "2A" ||
										dep.toString().trim() === "2B" ||
										parseInt(dep) === 20
									);
								} else {
									return parseInt(dep) === parseInt(code_dep);
								}
						  })
						: data.resto;
				} else if (type === "filterGolf") {
					data_golf = code_dep
						? data.golf.filter(({ dep }) => {
								if (parseInt(code_dep) === 20) {
									return (
										dep.toString().trim() === "2A" ||
										dep.toString().trim() === "2B" ||
										parseInt(dep) === 20
									);
								} else {
									return parseInt(dep) === parseInt(code_dep);
								}
						  })
						: data.golf;
				} else if (type === "filterTabac") {
					data_tabac = code_dep
						? data.tabac.filter(({ dep }) => {
								if (parseInt(code_dep) === 20) {
									return (
										dep.toString().trim() === "2A" ||
										dep.toString().trim() === "2B" ||
										parseInt(dep) === 20
									);
								} else {
									return parseInt(dep) === parseInt(code_dep);
								}
						  })
						: data.tabac;
				}
			}
		});

		return { ferme: data_ferme, station: data_station, resto: data_resto, golf: data_golf, tabac: data_tabac };
	}

	checkStateSelectedDep(e) {
		const code_dep = e.target.value.length < 3 ? e.target.value : null;
		if (code_dep) {
			this.updateCenter(
				centers[parseInt(code_dep)].lat,
				centers[parseInt(code_dep)].lng,
				centers[parseInt(code_dep)].zoom
			);
			setDataInLocalStorage(
				"memoryCenter",
				JSON.stringify({
					zoom: centers[parseInt(code_dep)].zoom,
					coord: { lat: centers[parseInt(code_dep)].lat, lng: centers[parseInt(code_dep)].lng },
				})
			);
		}
		this.filterDataByDep();
	}

	handleOnlyStateCheckbox(tab, item) {
		let result = [];
		let state = { type: document.querySelector(`#${item}`).getAttribute("name") };

		if (document.querySelector(`#${item}`)) {
			if (document.querySelector(`#${item}`).checked) {
				state = { ...state, state: 1 };
			} else {
				state = { ...state, state: 0 };
			}
		} else {
			state = { ...state, state: 1 };
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

		console.log("data_filtered");
		console.log(data_filtered);

		this.removeMarker();

		if (
			data_filtered.ferme.length > 0 ||
			data_filtered.station.length > 0 ||
			data_filtered.resto.length > 0 ||
			data_filtered.golf.length > 0 ||
			data_filtered.tabac.length > 0
		) {
			this.data = {
				...this.data,
				ferme: data_filtered.ferme,
				station: data_filtered.station,
				resto: data_filtered.resto,
				golf: data_filtered.golf,
				tabac: data_filtered.tabac,
			};
			this.addMarker(this.data);
		}

		const x = this.getMax(this.map.getBounds().getWest(), this.map.getBounds().getEast());
		const y = this.getMax(this.map.getBounds().getNorth(), this.map.getBounds().getSouth());
		const new_size = { minx: x.min, miny: y.min, maxx: x.max, maxy: y.max };

		this.addPeripheriqueMarker(new_size);
	}

	removeMarker() {
		this.markers.clearLayers();
		this.map.removeLayer(this.markers);
	}

	updateStatusDataItem(user_status, id, type) {
		if (type === "golf") {
			this.updateStatusDataGolfItem(user_status, id);
		}
	}

	updateStatusDataGolfItem(user_status, id) {
		if (this.default_data.golf.some(({ id: item_id }) => parseInt(item_id) === parseInt(id))) {
			this.default_data.golf = this.default_data.golf.map((item) => {
				if (parseInt(item.id) === parseInt(id)) {
					item.user_status = { ...item.user_status, ...user_status };
				}
				return item;
			});

			this.data.golf = this.data.golf.map((item) => {
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

		if (this.default_data.golf.some(({ id: item_id }) => parseInt(item_id) === parseInt(id))) {
			///update the global data state
			this.updateStatusDataItem(user_status, id, "golf");

			const golfModified = this.default_data.golf.find(({ id: item_id }) => parseInt(item_id) === parseInt(id));

			const zoom = this.map._zoom;

			this.markers.eachLayer((marker) => {
				if (marker.options.type === "golf" && parseInt(marker.options.id) === parseInt(id)) {
					const icon = this.getIcon(golfModified, true); /// path, size

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

	injectListRestoPastille() {
		const restoPastilleTab = [];
		this.listRestoPastille.forEach((item) => {
			const restoPastille = this.default_data.resto.find((jtem) => parseInt(item.id_resto) === parseInt(jtem.id));
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
				let oneResto = this.default_data.resto.find((jtem) => parseInt(idResto) === parseInt(jtem.id));
				marker.setIcon(this.setSpecialIcon(oneResto, true, poi_icon_Selected, poi_icon_Selected, isPastille));
			}
		});

		this.markers.refreshClusters();
	}

	/**
	 * @Author Nantenaina
	 * où: On utilise cette fonction dans la rubrique restaurant, restaurant specifique dép, arrondissement et tous de la carte cmz,
	 * localisation du fichier: dans MarkerClusterHome.js,
	 * je veux: mettre à jour la note moyenne sur un POI
	 * si une POI a une note, la note se montre en haut à gauche du POI
	 */
	showNoteMoyenneRealTime(idItem, note, type) {
		this.markers.eachLayer((marker) => {
			if (parseInt(marker.options.id) === parseInt(idItem)) {
				let single_data = null;
				if (type === "resto") {
					single_data = this.default_data.resto.find((jtem) => parseInt(idItem) === parseInt(jtem.id));
				} else if (type === "golf") {
					single_data = this.default_data.golf.find((jtem) => parseInt(idItem) === parseInt(jtem.id));
				}
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
     * localisation du fichier: dans MarkerClusterHome.js,
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

			this.default_data.resto = [...this.default_data.resto, details];

			this.settingSingleMarker(details, false);
			this.clickOnMarker(id);

			this.data = this.default_data;
		} catch (e) {
			console.log(e);
		}
	}
}
