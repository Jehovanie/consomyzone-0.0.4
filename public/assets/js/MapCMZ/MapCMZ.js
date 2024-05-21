/*
 import { setDataInSessionStorage, getDataInSessionStorage, iconsChange } from './../app.js';
 import { generateSelectContoursGeographie, showChargementRightSide } './map_cmz_instance.js';
 import { hideChargementRightSide } from './map_cmz_fonction.js';

*/

class MapCMZ {
	constructor() {
		///default data;
		this.map = null;

		this.listTales = [
			{
				name: "Esri WorldStreetMap",
				link: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
				id: "osm_esri_jheo_js",
				isCurrent: true,
				image: "assets/icon/NewIcons/esri_worldstreetmap.png",
			},
			{
				name: "Openstreetmap.org",
				link: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
				id: "osm_org_jheo_js",
				isCurrent: false,
				image: "assets/icon/NewIcons/openstreetmap_org.png",
			},
			{
				name: "Openstreetmap.fr Osmfr",
				link: "//{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png",
				id: "osm_fr_jheo_js",
				isCurrent: false,
				image: "assets/icon/NewIcons/openstreetmap_fr.png",
			},
		];

		this.id_listTales_selected = null;

		this.tales = null;

		this.id_dep = null;

		////default values but these distroy when we get the user position
		this.latitude = 46.61171462536897;
		this.longitude = 1.8896484375000002;
		this.zoom = 7;

		/// the copy of the default value of lat and long
		/// we use these for the function to reset the view to Paris overview.
		this.defautLatitude = this.latitude;
		this.defaultLongitude = this.longitude;

		this.defaultZoom = 7;
		this.maxZoom = 19;

		this.objectGeoJson = [];

		// REFERENCES : https://gist.github.com/frankrowe/9007567
		this.contourOption = [
			{
				couche: "canton",
				arrayColor: ["#1b9e77", "#d95f02", "#7570b3"],
				properties: ["cv", "dep", "nom_cv", "nom_dep", "nom_reg", "reg"],
			}, /// Dark2
			{ couche: "commune", arrayColor: ["#e0f3db", "#a8ddb5", "#43a2ca"], properties: [] }, /// GnBu
			{
				couche: "departement",
				arrayColor: ["#7fc97f", "#beaed4", "#fdc086"],
				properties: ["dep", "nom_dep", "nom_reg", "reg"],
			}, /// Accent
			{ couche: "iris", arrayColor: ["#fde0dd", "#fa9fb5", "#c51b8a"], properties: [] }, /// RdPu
			{
				couche: "quartier",
				arrayColor: ["red", "#feb24c", "#f03b20"],
				properties: ["nom_qv", "code_qv", "nom_pole", "pole"],
			}, /// YlOrRd
			{ couche: "region", arrayColor: ["#f1a340", "#f7f7f7", "#998ec3"], properties: ["nom_reg", "reg"] }, /// PuOr
		];

		///use for the store last memory center.
		this.lastMemoryCenter = null;

		//// this variable use for the historique navigation in the carte
		this.listPositionBeforAndAfter = [];

		/// this use for to know the current index in the history navigation in the carte
		/// by default it is the length of the this.listPositionBeforAndAfter.
		this.indexCurrentOnLisPositionBeforeAndAfter = 0;

		/// we use this for help in right section
		this.isRightSideAlreadyOpen = false;

		this.nbr_etablisement_per_dep = [];

		this.lastLatLngOnClick = { depCode: null, depName: null, lat: 0.0, lng: 0.0 };
	}

	initTales() {
		this.tiles = L.tileLayer(this.listTales[0].link, {
			attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
			minZoom: 1,
			maxZoom: this.maxZoom,
		});

		this.id_listTales_selected = this.listTales[0].id;
	}

	updateMemoryCenterInSession(lat, lng, zoom) {
		const coordAndZoom = {
			zoom: zoom,
			coord: { lat, lng },
		};
		setDataInSessionStorage("memoryCenter", JSON.stringify(coordAndZoom));
	}

	getDataMemoryCenterInSession() {
		const memory_center = getDataInSessionStorage("memoryCenter");
		return memory_center ? JSON.parse(memory_center) : null;
	}

	leafletControlExtend(position = "topright") {
		L.Control.Custom = L.Control.extend({
			version: "1.0.1",
			options: {
				position: position,
				id: "",
				title: "",
				classes: "",
				content: "",
				style: {},
				datas: {},
				events: {},
			},
			container: "container_lefleat_jheo_js",

			onAdd: function (map) {
				this.container = L.DomUtil.create("div");
				this.container.id = this.options.id;
				this.container.title = this.options.title;
				this.container.className = this.options.classes;
				this.container.innerHTML = this.options.content;

				for (var option in this.options.style) {
					this.container.style[option] = this.options.style[option];
				}

				for (var data in this.options.datas) {
					this.container.dataset[data] = this.options.datas[data];
				}

				/* Prevent click events propagation to map */
				L.DomEvent.disableClickPropagation(this.container);

				/* Prevent right click event propagation to map */
				L.DomEvent.on(this.container, "contextmenu", function (ev) {
					L.DomEvent.stopPropagation(ev);
				});

				/* Prevent scroll events propagation to map when cursor on the div */
				L.DomEvent.disableScrollPropagation(this.container);

				for (var event in this.options.events) {
					L.DomEvent.on(this.container, event, this.options.events[event], this.container);
				}

				return this.container;
			},

			onRemove: function (map) {
				for (var event in this.options.events) {
					L.DomEvent.off(this.container, event, this.options.events[event], this.container);
				}
			},
		});

		L.control.custom = function (options) {
			return new L.Control.Custom(options);
		};

		L.Control.CustomButtonLeft = L.Control.extend({
			version: "1.0.1",
			options: {
				position: "bottomleft",
				id: "",
				title: "",
				classes: "",
				content: "",
				style: {},
				datas: {},
				events: {},
			},
			container: "container_lefleat_jheo_js",

			onAdd: function (map) {
				this.container = L.DomUtil.create("div");
				this.container.id = this.options.id;
				this.container.title = this.options.title;
				this.container.className = this.options.classes;
				this.container.innerHTML = this.options.content;

				for (var option in this.options.style) {
					this.container.style[option] = this.options.style[option];
				}

				for (var data in this.options.datas) {
					this.container.dataset[data] = this.options.datas[data];
				}

				/* Prevent click events propagation to map */
				L.DomEvent.disableClickPropagation(this.container);

				/* Prevent right click event propagation to map */
				L.DomEvent.on(this.container, "contextmenu", function (ev) {
					L.DomEvent.stopPropagation(ev);
				});

				/* Prevent scroll events propagation to map when cursor on the div */
				L.DomEvent.disableScrollPropagation(this.container);

				for (var event in this.options.events) {
					L.DomEvent.on(this.container, event, this.options.events[event], this.container);
				}

				return this.container;
			},

			onRemove: function (map) {
				for (var event in this.options.events) {
					L.DomEvent.off(this.container, event, this.options.events[event], this.container);
				}
			},
		});

		L.control.customButtonLeft = function (options) {
			return new L.Control.CustomButtonLeft(options);
		};
	}

	leafletAddControl(position = "topright") {
		L.control
			.zoom({
				position: position,
			})
			.addTo(this.map);

		this.leafletControlExtend(position);
	}

	handleEventOnMap() {
		if (!this.map) {
			console.log("Map not initialized");
			return false;
		}

		this.map.doubleClickZoom.disable();
		// this.bindEventMouseOverOnMap();
	}

	/**
	 * @author Jehovanie RAMANDIRJOEL <jehovanieram@gmail.com>
	 *
	 * @goal initialize the process around the map ( tiles, zooom, leaflet control)
	 *
	 */
	async createMap() {
		this.initTales();

		const memoryCenter = this.getDataMemoryCenterInSession("memoryCenter");

		this.zoom = memoryCenter ? memoryCenter.zoom : this.defaultZoom;

		if (this.is_search_mode) {
			/// get relative position from search key word
			await this.getRelatedLatitudeAndLongitude();
		}

		this.map = L.map("map", {
			zoomControl: false,
			center:
				memoryCenter && !this.is_search_mode
					? L.latLng(memoryCenter.coord.lat, memoryCenter.coord.lng)
					: L.latLng(this.latitude, this.longitude),

			zoom: this.zoom,
			layers: [this.tiles],
		});

		this.lastNiveauZoomAction = this.zoom;

		this.leafletAddControl("topright");
	}

	async getRelatedLatitudeAndLongitude() {
		if (!this.is_search_mode) {
			return false;
		}

		try {
			let data_origin_cle1 = this.search_options.cles1.trim();
			if (
				(data_origin_cle1.length < 3 && parseInt(data_origin_cle1) > 0 && parseInt(data_origin_cle1) < 95) ||
				data_origin_cle1.toLowerCase() === "nord"
			) {
				const depCode = data_origin_cle1.toLowerCase() === "nord" ? 59 : parseInt(data_origin_cle1);

				this.latitude = centers[depCode].lat;
				this.longitude = centers[depCode].lng;
				this.zoom = centers[depCode]["zoom"];
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
				const apiOpenStreetMap = useLink ? useLink.link : dataLink[0]["link"];

				let responsePos = await fetch(apiOpenStreetMap);
				let response_adress = await responsePos.json();

				if (response_adress.length === 0) {
					responsePos = await fetch(dataLink[0]["link"]);
					response_adress = await responsePos.json();

					if (response_adress.length === 0) {
						let cleWord = data_origin_cle1.replaceAll("-", " ").replaceAll("_", " ").split(" ").reverse();

						var matches = data_origin_cle1.match(/\d{5}/);

						if (matches !== null) {
							const link = `https://nominatim.openstreetmap.org/search?format=json&postalcode=${matches[0]}&country=France&limit=1`;

							responsePos = await fetch(link);
							response_adress = await responsePos.json();
						} else {
							for (let i = 0; i < cleWord.length; i++) {
								const cle = cleWord[i];
								const link = `https://nominatim.openstreetmap.org/search?format=json&city=${cle}&country=France&limit=1`;

								responsePos = await fetch(link);
								response_adress = await responsePos.json();

								if (response_adress.length !== 0) {
									break;
								}
							}
						}
					}
				}

				const address = response_adress[0];

				this.latitude = address.lat;
				this.longitude = address.lon;
				this.zoom = useLink ? useLink.zoom : dataLink[0]["zoom"];
			}
		} catch (e) {
			console.log(e);
		}
	}

	updateCenter(lat, long, zoom) {
		this.map.setView(L.latLng(lat, long), zoom, { animation: true });
	}

	updateDataInSessionStorage(lat, lng, zoom) {
		const coordAndZoom = {
			zoom: zoom,
			coord: { lat, lng },
		};
		setDataInSessionStorage("memoryCenter", JSON.stringify(coordAndZoom));
	}

	/**
	 * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
	 *
	 * fetch number etablisement per departement.
	 *
	 * I use in this.settingGeos inside this.
	 *
	 * @returns list object { departement: , nbr_etablisement_per_dep: [ { departement: ...,  account_per_dep: ... }, ... ], type: ... }
	 */
	async fetchMarkerPerDep() {
		const response = await fetch(`/number_etablisement/tous/0`);
		const responseJson = await response.json();
		return responseJson;
	}

	async settingGeos() {
		let number_etablisement = null;

		if (this.is_search_mode) {
			let data_length = 0;

			number_etablisement = {
				type: "search",
				departement: "0",
				total: data_length,
				nbr_etablisement_per_dep: this.getNumberPerDepDataSearch(),
			};
		} else {
			number_etablisement = await this.fetchMarkerPerDep();
		}
		const nbr_etablisement_per_dep = number_etablisement["nbr_etablisement_per_dep"];
		this.nbr_etablisement_per_dep = nbr_etablisement_per_dep;

		let geos = [];

		if (this.id_dep || this.nom_dep) {
			if (this.id_dep === 20) {
				const geos_for_2A = franceGeo.features.find((element) => element.properties.code === "2A");
				const geos_for_2B = franceGeo.features.find((element) => element.properties.code === "2B");

				const corse = turf.union(geos_for_2A, geos_for_2B);

				const geos_for_corse = {
					...corse,
					properties: {
						...corse.properties,
						code: "20",
						nom: "corse",
						account_per_dep: nbr_etablisement_per_dep[0]["account_per_dep"],
					},
				};
				geos.push(geos_for_corse);
			} else {
				const temp = franceGeo.features.find((element) => parseInt(element.properties.code) === this.id_dep);
				geos.push({
					...temp,
					properties: {
						...temp.properties,
						account_per_dep: nbr_etablisement_per_dep[0]["account_per_dep"],
					},
				});
			}
		} else {
			for (let f of franceGeo.features) {
				let temp = null;
				if (f.properties.code === "2A" || f.properties.code === "2B") {
					temp = nbr_etablisement_per_dep.find((element) => parseInt(element.departement) === 20);
				} else {
					temp = nbr_etablisement_per_dep.find(
						(element) => parseInt(element.departement) === parseInt(f.properties.code)
					);
				}

				const details = temp && temp.hasOwnProperty("details") ? temp.details : null;

				if (f.properties.code === "2B") continue;

				if (f.properties.code === "2A") {
					const geos_for_2B = franceGeo.features.find((item) => item.properties.code === "2B");

					const corse = turf.union(f, geos_for_2B);

					const geos_for_corse = {
						...corse,
						properties: {
							...corse.properties,
							code: "20",
							nom: "corse",
							account_per_dep: temp ? temp["account_per_dep"] : 0,
							details,
						},
					};

					geos.push(geos_for_corse);
				} else {
					geos.push({
						...f,
						properties: {
							...f.properties,
							account_per_dep: temp ? temp["account_per_dep"] : 0,
							details,
						},
					});
				}
			}
		}
		return geos;
	}

	/**
	 * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
	 *
	 * @goal get and add geosJson on Map (details per departement)
	 *
	 */
	async addGeoJsonToMap() {
		if (!this.map) {
			console.log("Map not initialized");
			return false;
		}

		if (this.geos.length === 0) {
			this.geos = await this.settingGeos();
		}

		// this.geoJSONLayer = L.geoJson().addTo(this.map);
		this.geoJSONLayer = L.geoJson(this.geos, {
			style: {
				weight: 2,
				opacity: 1,
				color: "#74D0F1",
				dashArray: "3",
				fillOpacity: 0,
			},
			onEachFeature: (feature, layer) => {
				if (feature.properties.hasOwnProperty("details")) {
					if (
						feature.properties.details != null &&
						feature.properties.details?.hasOwnProperty("restaurant")
					) {
						feature.properties.details["resto"] = feature.properties.details.restaurant;
					}
				}

				let information_user_conected = document.querySelector(".information_user_conected_jheo_js");

				information_user_conected = true;

				const add_new_feature = information_user_conected
					? ` <hr class="mt-2 mb-1">
						Nouveau POI
						<span class="badge bg-light text-dark ms-1"
						 	data-bs-toggle="modal" data-bs-target="#list_rubrique_for_new_poi"
							onclick="injectListRubriqueTypeForNewPOI()"
						>
							<i class="fa-solid fa-circle-plus fa-fade"></i>
						</span>
					`
					: "";

				const details_html =
					feature.properties.hasOwnProperty("details") && feature.properties.details != null
						? `
                            <span class="badge rounded-pill bg-secondary">R:${feature.properties.details.resto}</span>
                            <span class="badge rounded-pill bg-success">F:${feature.properties.details.ferme}</span>
                            <span class="badge rounded-pill bg-danger">S:${feature.properties.details.station}</span>
                            <span class="badge rounded-pill bg-light text-black">G:${feature.properties.details.golf}</span>
                            <span class="badge rounded-pill bg-dark">T:${feature.properties.details.tabac}</span>
                            <span class="badge rounded-pill bg-dark">M:${feature.properties.details.marche}</span>
                        `
						: "";

				const popupContent = `
					<button type="button" class="btn btn-primary btn-sm">
						Département <span class="badge bg-info text-dark">${feature.properties.code} ${feature.properties.nom}</span></br>
						Résultat trouvé <span class="badge bg-warning text-dark">${feature.properties.account_per_dep}</span> </br>
						${details_html} 
						${add_new_feature}
					</button>
				`;
				layer.bindPopup(popupContent);
				layer.on({
					click: (e) => {
						const properties = e.target.feature.properties;
						this.saveLatLongOnClick(properties.code, properties.nom, e.latlng.lng, e.latlng.lat);
					},
				});
			},
		}).addTo(this.map);
	}

	saveLatLongOnClick(depCode, depName, latitude, longitude) {
		this.lastLatLngOnClick = {
			depCode,
			depName,
			lat: latitude,
			lng: longitude,
		};
	}

	/**
	 * @author Jehovanie RAMANDRIJOEL
	 * Cette fonction est irrittér dans tous les rubriques,
	 * localisation du fichier: cette meme fichier seulement.,
	 * je veux: faire construire une template dynamique des btn controles à adroite
	 * si une btn controle, on trouve une icon, couleur unique, message tooltip, action qui ouvre la partie droite.
	 */
	createBtnControl(dataType, faSolidIcon, classBtn, messageTooltip, position = "topright") {
		const fontSize = dataType === "resto_pastille_jheo_js" ? "1.3rem" : "1.1rem";
		const isHidden = dataType === "cart_before_jheo_js" || dataType === "cart_after_jheo_js" ? "d-none" : "";

		const msg_tooltip_pos = position === "topright" ? "message_tooltip" : "message_tooltip_bottom_right";
		return `
            <div class="content_message_tooltip content_message_tooltip_jheo_js ${isHidden}" data-type="${dataType}">
                <div class="${msg_tooltip_pos} d-none message_tooltip_jheo_js">${messageTooltip}</div>
                <button class="${classBtn} right_control_jheo_js" data-type="${dataType}"  style="font-size: ${fontSize};">
                    <i class="${faSolidIcon}" data-type="${dataType}"></i>
                </button>
            </div>
        `;
	}

	/**
	 * @author Jehovanie RAMANDRIJOEL
	 * Cette fonction est irrittér dans tous les rubriques,
	 * localisation du fichier: cette meme fichier seulement.,
	 * je veux: faire afficher ou cache un message tooltip sur une btn control
	 */
	bindTooltipsOnHover() {
		const all_control = document.querySelectorAll(`.content_message_tooltip_jheo_js`);

		all_control.forEach((item_control) => {
			item_control.addEventListener("mouseover", () => {
				item_control.querySelector(".message_tooltip_jheo_js").classList.remove("d-none");
			});

			item_control.addEventListener("mouseout", () => {
				item_control.querySelector(".message_tooltip_jheo_js").classList.add("d-none");
			});
		});
	}

	bindTooltipsDockOnHover() {
		let dockableIcone = document.querySelectorAll(`.dockableDetail`);

		dockableIcone.forEach((item_control) => {
			item_control.addEventListener("mouseover", () => {
				item_control.querySelector(".message_tooltip_jheo_js").classList.remove("d-none");
			});

			item_control.addEventListener("mouseout", () => {
				item_control.querySelector(".message_tooltip_jheo_js").classList.add("d-none");
			});
		});
	}

	resetZoom() {
		const memoryCenter = this.getDataMemoryCenterInSession();

		if (memoryCenter.zoom !== 6) {
			this.lastMemoryCenter = memoryCenter;
			this.map.setView(L.latLng(this.defautLatitude, this.defaultLongitude), 6, { animation: true });
		} else {
			this.map.setView(
				L.latLng(this.lastMemoryCenter.coord.lat, this.lastMemoryCenter.coord.lng),
				this.lastMemoryCenter.zoom,
				{ animation: true }
			);
		}
	}

	changeTiles(tilesID) {
		const newTiles = this.listTales.find((item) => item.id === tilesID);
		this.tiles.setUrl(newTiles.link, false);

		this.listTales = this.listTales.map((item) => {
			item.isCurrent = item.id === tilesID ? true : false;
			return item;
		});
	}

	bindEventChangeTiles() {
		this.listTales.forEach((item) => {
			document.querySelector(`.ID_${item.id}`).addEventListener("change", () => {
				this.changeTiles(item.id);
			});
		});
	}

	injectTilesType() {
		if (!document.querySelector(".content_right_side_body_jheo_js")) {
			console.log("Selector not found : '.content_right_side_body_body'");
			return false;
		}

		let tilesSelectHTML = "";

		this.listTales.forEach((item) => {
			tilesSelectHTML += `
                <div class="form-check">
                    <span class="leaflet-minimap-label">
                        <input type="radio" id="${item.id}" class="leaflet-control-layers-selector ID_${item.id}" 
							name="leaflet-base-layers" ${item.isCurrent ? "checked" : ""}>
                        <label class="" for="${item.id}">${item.name.toUpperCase()}</label>
                    </span>
                </div>
            `;
		});
		document.querySelector(".content_right_side_body_jheo_js").innerHTML = `
            <div class="right_side_body right_side_body_jheo_js">
                ${tilesSelectHTML}
            </div>
            <div class="d-none chargement_right_side chargement_right_side_jheo_js">
                <div class="containt">
                    <div class="word word-1">C</div>
                    <div class="word word-2">M</div>
                    <div class="word word-3">Z</div>
                </div>
            </div>
        `;
		this.bindEventChangeTiles();
	}

	injectTilesTypesOnBottom() {
		if (!document.querySelector(".content_bottom_side_body_jheo_js")) {
			console.log("Selector not found : '.content_bottom_side_body_jheo_js'");
			return false;
		}

		let tilesSelectHTML = "";
		this.listTales.forEach((item) => {
			let image = IS_DEV_MODE ? `/${item.image}` : `/public/${item.image}`;
			let classSelected = item.id === this.id_listTales_selected ? "card_type_layer_selected" : "";

			tilesSelectHTML += `
				<div class="card mb-3 card_type_layer ${classSelected} ID_${item.id}" onclick="changeTiles('${item.id}')">
					<div class="row">
						<div class="col-md-4">
							<img src="${image}" class="card-img" alt="${item.name.toLocaleLowerCase()}" style="height:70px">
						</div>
						<div class="col-md-8">
							<div class="card-body">
								<p class="card-text">${item.name.toUpperCase()}</p>
							</div>
						</div>
					</div>
				</div>`;
		});

		document.querySelector(".content_bottom_side_body_jheo_js").innerHTML = tilesSelectHTML;

		// this.bindEventChangeTiles();
	}

	bindEventChangeTiles() {
		this.listTales.forEach((item) => {
			const singleTile = document.querySelector(`.ID_${item.id}`);
			if (!singleTile) {
				singleTile.addEventListener("click", () => {
					this.changeTiles(item.id);

					this.id_listTales_selected = item.id;
					if (!singleTile.classList.contains("card_type_layer_selected")) {
						singleTile.classList.add("card_type_layer_selected");
					}

					this.listTales.forEach(({ id }) => {
						if (id !== this.id_listTales_selected) {
							const tempTile = document.querySelector(`.ID_${id}_jheo_js`);
							if (tempTile.classList.contains("card_type_layer_selected")) {
								tempTile.classList.remove("card_type_layer_selected");
							}
						}
					});
				});
			}
		});
	}

	changeTiles(tilesID) {
		const singleTile = document.querySelector(`.ID_${tilesID}`);

		if (!singleTile.classList.contains("card_type_layer_selected")) {
			singleTile.classList.add("card_type_layer_selected");
		}

		this.id_listTales_selected = tilesID;

		this.listTales.forEach(({ id }) => {
			if (id !== this.id_listTales_selected) {
				const tempTile = document.querySelector(`.ID_${id}`);
				if (tempTile.classList.contains("card_type_layer_selected")) {
					tempTile.classList.remove("card_type_layer_selected");
				}
			}
		});

		const newTiles = this.listTales.find((item) => item.id === tilesID);

		console.log(newTiles);

		this.tiles.setUrl(newTiles.link, false);

		this.listTales = this.listTales.map((item) => {
			item.isCurrent = item.id === tilesID ? true : false;
			return item;
		});
	}

	closeRightSide() {
		if (document.querySelector(".cart_map_jheo_js") && document.querySelector(".content_legende_jheo_js")) {
			this.isRightSideAlreadyOpen = false;

			document.querySelector(".cart_map_jheo_js").style.width = "100%";
			document.querySelector(".content_legende_jheo_js").style.width = "0%";
			document.querySelector(".content_legende_jheo_js").style.padding = "0";
		} else {
			console.log("Selector not found");
			console.log("cart_map_jheo_js", "content_legende_jheo_js");
		}
	}

	injectListRubriqueType() {
		console.log("Fonction inject on class filles...");
	}

	/**
	 * @author Jehovanie RAMANRIJOEL <jehovanieram@gmail.com>
	 *
	 * @goal setting the size of the map and the right side contains
	 *
	 * @whereIUseIt [
	 * 	 this.openRightSide(),
	 * ]
	 *
	 */
	openRightSideWidth() {
		if (!document.querySelector(".cart_map_jheo_js")) {
			console.log("Selector not found: 'cart_map_jheo_js'");
			return false;
		}

		if (!document.querySelector(".content_legende_jheo_js")) {
			console.log("Selector not found: 'content_legende_jheo_js'");
			return false;
		}

		if (!document.querySelector(".content_legende_jheo_js")) {
			console.log("Selector not found: 'content_legende_jheo_js'");
			return false;
		}

		this.isRightSideAlreadyOpen = true;

		const cart_width = "75%";
		const cont_legent_width = "25%";

		document.querySelector(".cart_map_jheo_js").style.width = cart_width;
		document.querySelector(".content_legende_jheo_js").style.width = cont_legent_width;
		document.querySelector(".content_legende_jheo_js").style.padding = "25px";
	}

	openRightSide(rightSideContentType) {
		if (rightSideContentType === "reset_zoom_jheo_js") {
			this.resetZoom();
		} else if (rightSideContentType === "cart_before_jheo_js") {
			this.goBackOrAfterPosition("back");
		} else if (rightSideContentType === "cart_after_jheo_js") {
			this.goBackOrAfterPosition("after");
		} else {
			if (document.querySelector(".close_details_jheo_js")) {
				document.querySelector(".close_details_jheo_js").click();
			}

			if (document.querySelector(".icon_close_nav_left_jheo_js")) {
				document.querySelector(".icon_close_nav_left_jheo_js").click();
			}

			if (document.querySelector(".cart_map_jheo_js") && document.querySelector(".content_legende_jheo_js")) {
				if (!document.querySelector(".title_right_side_jheo_js")) {
					console.log("Selector not found: '.title_right_side_jheo_js'");
					return false;
				}

				if (rightSideContentType === "info_rubrique_icon_jheo_js") {
					document.querySelector(".title_right_side_jheo_js").innerText = "Légende des icônes sur la carte.";
					this.injectLegendeIconeOnMap();
				} else if (rightSideContentType === "resto_pastille_jheo_js") {
					document.querySelector(".title_right_side_jheo_js").innerText = "Liste des restaurants pastilles.";
					this.injectListRestoPastille();
				} else if (rightSideContentType === "couche_tabac_jheo_js") {
					document.querySelector(".title_right_side_jheo_js").innerText =
						"Listes des contours géographiques.";
					this.injectChooseCouche();
				} // Edited by Elie 24/01/2024
				else if (rightSideContentType === "favoris_elie_js") {
					document.querySelector(".title_right_side_jheo_js").innerText =
						"Liste de mes favoris géographiques.";
					// alert("Please")
					this.injectMyFavoris();
				} else if (rightSideContentType === "rubrique_type_jheo_js") {
					document.querySelector(".title_right_side_jheo_js").innerText =
						"Sélectionner ou désélectionner une ou plusieurs rubriques.";

					this.injectListRubriqueType();
				} else {
					//// default tiles type
					document.querySelector(".title_right_side_jheo_js").innerText = "Sélectionner un type de carte.";
					this.injectTilesType();
				}

				this.openRightSideWidth();
			} else {
				console.log("Selector not found");
				console.log("cart_map_jheo_js", "content_legende_jheo_js");
			}

			if (this.isRightSideAlreadyOpen && document.querySelector(".close_right_side_jheo_js")) {
				document.querySelector(".close_right_side_jheo_js").addEventListener("click", () => {
					this.closeRightSide();
				});
			}
		}
	}

	resetZoom() {
		const memoryCenter = getDataInSessionStorage("memoryCenter")
			? JSON.parse(getDataInSessionStorage("memoryCenter"))
			: null;

		if (memoryCenter.zoom !== 6) {
			this.lastMemoryCenter = memoryCenter;
			this.map.setView(L.latLng(this.defautLatitude, this.defaultLongitude), 6, { animation: true });
		} else {
			this.map.setView(
				L.latLng(this.lastMemoryCenter.coord.lat, this.lastMemoryCenter.coord.lng),
				this.lastMemoryCenter.zoom,
				{ animation: true }
			);
		}
	}

	closeBottomSide() {
		if (document.querySelector(".cart_map_jheo_js") && document.querySelector(".content_legende_bottom_jheo_js")) {
			document.querySelector(".cart_map_jheo_js").style.height = "100%";
			document.querySelector(".content_legende_bottom_jheo_js").style.height = "0%";
			document.querySelector(".content_legende_bottom_jheo_js").style.padding = "0";
		} else {
			console.log("Selector not found");
			console.log("cart_map_jheo_js", "content_legende_bottom_jheo_js");
		}
	}

	goBackOrAfterPosition(backOrAfter) {
		if (backOrAfter === "back") {
			this.indexCurrentOnLisPositionBeforeAndAfter--;
		} else if (backOrAfter === "after") {
			this.indexCurrentOnLisPositionBeforeAndAfter++;
		}

		const before = this.listPositionBeforAndAfter[this.indexCurrentOnLisPositionBeforeAndAfter - 1];

		this.map.flyTo(L.latLng(before.lat, before.lng), before.zoom, { animation: true, noMoveStart: true });

		if (this.indexCurrentOnLisPositionBeforeAndAfter === 1) {
			const parentIconControl = document.querySelector(".cart_before_jheo_js")?.parentElement?.parentElement;
			if (parentIconControl && !parentIconControl.classList.contains("d-none")) {
				parentIconControl.classList.add("d-none");
			}

			const parentIconControlAfter = document.querySelector(".cart_after_jheo_js")?.parentElement?.parentElement;
			if (parentIconControlAfter && parentIconControlAfter.classList.contains("d-none")) {
				parentIconControlAfter.classList.remove("d-none");
			}
		}

		if (this.indexCurrentOnLisPositionBeforeAndAfter === this.listPositionBeforAndAfter.length) {
			const parentIconControl = document.querySelector(".cart_after_jheo_js")?.parentElement?.parentElement;
			if (parentIconControl && !parentIconControl.classList.contains("d-none")) {
				parentIconControl.classList.add("d-none");
			}

			const parentIconControlBefore =
				document.querySelector(".cart_before_jheo_js")?.parentElement?.parentElement;
			if (parentIconControlBefore && parentIconControlBefore.classList.contains("d-none")) {
				parentIconControlBefore.classList.remove("d-none");
			}
		}

		if (
			this.indexCurrentOnLisPositionBeforeAndAfter > 1 &&
			this.indexCurrentOnLisPositionBeforeAndAfter < this.listPositionBeforAndAfter.length
		) {
			const parentIconControlBefore =
				document.querySelector(".cart_before_jheo_js")?.parentElement?.parentElement;
			if (parentIconControlBefore && parentIconControlBefore.classList.contains("d-none")) {
				parentIconControlBefore.classList.remove("d-none");
			}

			const parentIconControlAfter = document.querySelector(".cart_after_jheo_js")?.parentElement?.parentElement;
			if (parentIconControlAfter && parentIconControlAfter.classList.contains("d-none")) {
				parentIconControlAfter.classList.remove("d-none");
			}
		}
	}

	openBottomSide(bottomSideContentType) {
		const tiles_change_map = ["tiles_type_jheo_js"];

		if (tiles_change_map.includes(bottomSideContentType)) {
			if (
				document.querySelector(".cart_map_jheo_js") &&
				document.querySelector(".content_legende_bottom_jheo_js")
			) {
				document.querySelector(".cart_map_jheo_js").style.height = "85%";
				document.querySelector(".content_legende_bottom_jheo_js").style.height = "15%";
				document.querySelector(".content_legende_bottom_jheo_js").style.padding = "0";
			}

			if (document.querySelector(".close_bottom_side_jheo_js")) {
				document.querySelector(".close_bottom_side_jheo_js").addEventListener("click", () => {
					this.closeBottomSide();
				});
			}
		}

		if (bottomSideContentType === "tiles_type_jheo_js") {
			//// default tiles type
			document.querySelector(".title_right_side_jheo_js").innerText = "Sélectionner un type de carte.";
			this.injectTilesTypesOnBottom();
		} else if (bottomSideContentType === "reset_zoom_jheo_js") {
			this.resetZoom();
		} else if (bottomSideContentType === "couche_tabac_jheo_js") {
			this.openRightSide(bottomSideContentType);
		} else if (bottomSideContentType === "cart_before_jheo_js") {
			this.goBackOrAfterPosition("back");
		} else if (bottomSideContentType === "cart_after_jheo_js") {
			this.goBackOrAfterPosition("after");
		}
	}

	injectChooseCouche() {
		if (!document.querySelector(".content_right_side_body_jheo_js")) {
			console.log("Selector not found : '.content_right_side_body_body'");
			return false;
		}
		document.querySelector(".content_right_side_body_jheo_js").innerHTML = `
            <div class="right_side_body right_side_body_jheo_js">
                <div class="form-check">
                    <div class="content_input">
                        <input class="form-check-input check_tabac_region_jheo_js" type="checkbox" value="" id="region">
                        <label class="form-check-label text-black" for="region">
                            REGION
                        </label>
                        <!-- <span class="badge bg-info show_list_select">AFFICHER</span> -->
                    </div>
                    <div class="content_select_region_jheo_js">
                        <div class="select_region select_region_jheo_js"></div>
                    </div>
                </div>
                <div class="form-check">
                    <input class="form-check-input check_tabac_departement_jheo_js" type="checkbox" value="" id="departement">
                    <label class="form-check-label text-black" for="departement">
                        DEPARTEMENT
                    </label>
                    <div class="content_select_departement_jheo_js">
                        <div class="select_region select_departement_jheo_js"></div>
                    </div>
                </div>
                
                <div class="form-check">
                    <input class="form-check-input check_tabac_quartier_jheo_js" type="checkbox" value="" id="quartier" >
                    <label class="form-check-label text-black" for="quartier">
                        QUARTIER DE VIE
                    </label>
                       <div class="content_select_region_jheo_js">
                        <div class="select_region select_region_jheo_js"></div>
                    </div>
                    <div class="content_select_quartier_jheo_js">
                        <div class="select_region select_quartier_jheo_js"></div>
                    </div>
                </div>
                <div class="form-check">
                    <input class="form-check-input check_tabac_canton_jheo_js" type="checkbox" value="" id="canton" >
                    <label class="form-check-label text-black" for="canton">
                        CANTON
                    </label>
                    <div class="content_select_canton_jheo_js">
                        <div class="select_region select_canton_jheo_js"></div>
                    </div>
                </div>
                <div class="form-check">
                    <input class="form-check-input check_tabac_commune_jheo_js" type="checkbox" value="" id="commune" disabled>
                    <label class="form-check-label non_active text-black" for="commune">
                        COMMUNE
                    </label>
                    <div class="content_select_commune_jheo_js">
                        <div class="select_region select_commune_jheo_js"></div>
                    </div>
                </div>
                <div class="form-check">
                    <input class="form-check-input check_tabac_iris_jheo_js" type="checkbox" value="" id="iris" disabled>
                    <label class="form-check-label non_active text-black" for="iris">
                        IRIS
                    </label>
                    <div class="content_select_iris_jheo_js">
                        <div class="select_region select_iris_jheo_js"></div>
                    </div>
                </div>
            </div>
            <div class="d-none chargement_right_side chargement_right_side_jheo_js">
                <div class="containt">
                    <div class="word word-1">C</div>
                    <div class="word word-2">M</div>
                    <div class="word word-3">Z</div>
                </div>
            </div>
        `;
		this.handleEventOnCheckBox();
	}

	async addCoucheOnLeaflet(COUCHE) {
		try {
			///// check if this is already get...
			const currentCouche = this.objectGeoJson.find((item) => item.couche.toLowerCase() === COUCHE.toLowerCase());
			if (!currentCouche) {
				const link = IS_DEV_MODE
					? `/assets/shapefile/${COUCHE.toUpperCase()}.zip`
					: `/public/assets/shapefile/${COUCHE.toUpperCase()}.zip`;
				const response = await fetch(link);
				const blob = await response.blob();
				const file = new File([blob], "xxx.zip", { type: "application/x-zip-compressed" });

				const reader = new FileReader();
				reader.onload = () => {
					shp(reader.result)
						.then((geoJson) => {
							hideChargementRightSide();
							///// couche Option, colors, properties
							const coucheOption = this.contourOption.find(
								(item) => item.couche === COUCHE.toLowerCase()
							);

							this.objectGeoJson.push({
								couche: COUCHE,
								data: geoJson.features,
								color: coucheOption.arrayColor,
								child: [],
							});
							if (COUCHE !== "quartier") {
								generateSelectContoursGeographie(COUCHE, geoJson.features); //// function in data_tabac
							} else {
								this.updateGeoJson(COUCHE, -1); //// if -1 all seen, other single
							}
						})
						.catch((error) => {
							hideChargementRightSide();
							console.log(error);
						});
				};

				reader.readAsArrayBuffer(file);
			} else {
				hideChargementRightSide();
				//// generate
				if (COUCHE !== "quartier") {
					generateSelectContoursGeographie(COUCHE, currentCouche.data, currentCouche.child); //// function in data_tabac
				} else {
					this.updateGeoJson(COUCHE, -1); //// if -1 all seen, other single
				}
			}
		} catch (e) {
			hideChargementRightSide();
			console.log(e.message);
		}
	}

	removeCoucheOnLeafled(COUCHE) {
		const data_spec = this.objectGeoJson.find((item) => item.couche.toLowerCase() === COUCHE.toLowerCase());
		//// remove geoJsom
		data_spec.child.forEach((jtem) => jtem.geoJson.clearLayers());

		this.objectGeoJson = this.objectGeoJson.filter((item) => item.couche.toLowerCase() !== COUCHE);
	}

	handleEventOnCheckBox() {
		const allCheckBox = [
			"check_tabac_region_jheo_js",
			"check_tabac_commune_jheo_js",
			"check_tabac_departement_jheo_js",
			"check_tabac_iris_jheo_js",
			"check_tabac_quartier_jheo_js",
			"check_tabac_canton_jheo_js",
		];

		allCheckBox.forEach((inputCheck) => {
			if (!document.querySelector(`.${inputCheck}`)) {
				throw new Error(`Selector not found : ${inputCheck}`);
			}

			///// event handlers
			const inputCheck_HTML = document.querySelector(`.${inputCheck}`);
			inputCheck_HTML.addEventListener("change", (e) => {
				const couche = inputCheck_HTML.getAttribute("id");
				if (e.target.checked) {
					showChargementRightSide();
					this.addCoucheOnLeaflet(couche); //// param couche name
				} else {
					const list = document.querySelector(`.select_${couche.toLowerCase()}_jheo_js`);

					this.removeCoucheOnLeafled(couche);

					if (list && !list.classList.contains("d-none")) {
						list.classList.add("d-none");

						while (list.firstChild) {
							list.removeChild(list.firstChild);
						}
					}
				}
			});
		});
	}

	/**
	 * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
	 *
	 * @goal bind and add control on the right and the left side of the map
	 */
	bindOtherControles() {
		let htmlControlBottomLeft = `
            ${this.createBtnControl(
				"tiles_type_jheo_js",
				"fa-solid fa-layer-group",
				"btn btn-warning me-2",
				"Sélectionner un type de carte.",
				"bootomright"
			)}
		`;

		// ${this.createBtnControl(
		// 	"cart_after_jheo_js",
		// 	"fa-solid fa-forward fa-fade cart_after_jheo_js",
		// 	"btn btn-outline-danger me-2",
		// 	"Voir la carte en position avant.",
		// 	"bootomright"
		// )}
		// ${this.createBtnControl(
		// 	"cart_before_jheo_js",
		// 	"fa-solid fa-backward fa-fade cart_before_jheo_js",
		// 	"btn btn-outline-danger",
		// 	"Voir la carte en position précedente.",
		// 	"bootomright"
		// )}

		let htmlControlRubrique = `
			${this.createBtnControl(
				"rubrique_type_jheo_js",
				"fa-solid fa-filter",
				"btn btn-success mb-2",
				"Sélectionner ou désélectionner une rubrique."
			)}
			${this.createBtnControl(
				"favoris_elie_js",
				"fa-regular fa-bookmark fs-4",
				"btn btn-dark mb-2",
				"Mes favoris géographiques."
			)}
			${this.createBtnControl(
				"resto_pastille_jheo_js",
				"fa-solid fa-location-dot fa-flip text-danger",
				"btn btn-light mb-2",
				"Liste des restaurants pastilles."
			)}
			${this.createBtnControl(
				// "info_golf_jheo_js",
				"info_rubrique_icon_jheo_js",
				"fa-solid fa-circle-question",
				"btn btn-info mb-2",
				"Légende des icônes sur la carte."
			)}
			${this.createBtnControl(
				"couche_tabac_jheo_js",
				"fa-brands fa-connectdevelop fs-6",
				"btn btn-primary mb-2",
				"Listes des contours géographiques."
			)}
			${this.createBtnControl(
				"reset_zoom_jheo_js",
				"fa-solid fa-arrows-rotate",
				"btn btn-dark me-2 mb-2",
				"Réstaure le niveau de zoom en position initiale."
			)}
			${this.createBtnControl(
				"cart_after_jheo_js",
				"fa-solid fa-forward fa-fade cart_after_jheo_js",
				"btn btn-outline-danger me-2",
				"Voir la carte en position avant."
				// "bootomright"
			)}
			${this.createBtnControl(
				"cart_before_jheo_js",
				"fa-solid fa-backward fa-fade cart_before_jheo_js",
				"btn btn-outline-danger",
				"Voir la carte en position précedente."
				// "bootomright"
			)}
		`;

		L.control
			.custom({
				content: htmlControlRubrique,
				classes: "btn-group-vertical btn-group-sm btn_group_vertical",
				datas: {
					foo: "bar",
				},
				events: {
					click: (data) => {
						this.openRightSide(data.srcElement.dataset.type);
					},
					dblclick: function () {
						console.log("click");
					},
					contextmenu: function (data) {
						console.log("wrapper div element contextmenu");
					},
				},
			})
			.addTo(this.map);

		L.control
			.customButtonLeft({
				content: htmlControlBottomLeft,
				classes: "d-flex justify-content-center align-items-center mb-4",
				datas: {
					foo: "bar",
				},
				events: {
					click: (data) => {
						this.openBottomSide(data.srcElement.dataset.type);
					},
					dblclick: function () {
						console.log("click");
					},
					contextmenu: function (data) {
						console.log("wrapper div element contextmenu");
					},
				},
			})
			.addTo(this.map);

		//// bint event hover on btn control.
		this.bindTooltipsOnHover();
	}

	createRightSideControl() {
		if (!document.querySelector(".content_cart_map_jheo_js")) {
			console.log("Selector not found : 'content_cart_map_jheo_js'");
			return null;
		}

		const container = document.createElement("div");
		container.className = "content_legende content_legende_jheo_js";

		container.innerHTML = `
            ${this.defaultHTMLRightSide()}
        `;

		document.querySelector(".content_cart_map_jheo_js").appendChild(container);
	}

	/**
	 * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
	 * @whereIUseIt [
	 * 	this.createRightSideControl(),
	 *  this.openRubriqueFilter()
	 * ]
	 *
	 * @returns default HTML right side control
	 */
	defaultHTMLRightSide() {
		const body_default_html_right_side = `
			<div class="content_header_right_side">
                <div class="header_right_side">
                    <div class="title_right_side text-black title_right_side_jheo_js">
                        CONTROL RIGHT SIDE
                    </div>
                    <div class="content_close_right_side">
                        <div class="close_right_side close_right_side_jheo_js">
                            <i class="fa-solid fa-xmark"></i>
                        </div>
                    </div>
                </div>
            </div>
			<hr class="mb-2">
            <div class="content_right_side_body content_right_side_body_jheo_js">
                
            </div>
		`;

		return body_default_html_right_side;
	}

	createBottomSideControl() {
		if (!document.querySelector(".content_cart_map_jheo_js")) {
			console.log("Selector not found : 'content_cart_map_jheo_js'");
			return null;
		}

		const container = document.createElement("div");
		container.className = "content_legende_bottom content_legende_bottom_jheo_js";

		container.innerHTML = `
            <div class="content_header_bottom_side">
                <div class="header_right_side">
                    <div class="content_close_right_side">
                        <div class="close_right_side close_side_jheo_js close_bottom_side_jheo_js">
                            <i class="fa-solid fa-xmark"></i>
                        </div>
                    </div>
                </div>
            </div>
            <div class="content_bottom_side_body content_bottom_side_body_jheo_js">
            </div>
        `;

		document.querySelector(".content_cart_map_jheo_js").appendChild(container);
	}

	handleEventMoveendForMemoryCenter(event) {
		const center = event.target.getCenter();
		const coordAndZoom = {
			zoom: event.target._zoom ? event.target._zoom : this.defaultZoom,
			coord: center,
		};
		setDataInSessionStorage("memoryCenter", JSON.stringify(coordAndZoom));

		if (getDataInSessionStorage("lastSearchPosition")) {
			const x = this.getMax(this.map.getBounds().getWest(), this.map.getBounds().getEast());
			const y = this.getMax(this.map.getBounds().getNorth(), this.map.getBounds().getSouth());
			const lastSearchPosition = {
				zoom: 13,
				position: { minx: x.min, miny: y.min, maxx: x.max, maxy: y.max },
			};
			setDataInSessionStorage("lastSearchPosition", JSON.stringify(lastSearchPosition));
		}

		/// check and add polylines s'il faut
		// this.customiSpyderfyWithoutMousePosition();
	}

	handleEventMoveStartForMemoryCenter(event) {
		const center = event.target.getCenter();
		const coordAndZoom = {
			zoom: event.target._zoom ? event.target._zoom : this.defaultZoom,
			coord: center,
		};

		if (document.querySelector(".icon_close_nav_left_jheo_js")) {
			if (!document.querySelector(".content_navleft_jheo_js").classList.contains("d-none")) {
				document.querySelector(".content_navleft_jheo_js").classList.add("d-none");
				iconsChange();
			}
		}

		////object of the current position
		this.currentPositionOnMap = {
			/// { zoom : 0, lat: 0, lng: 0 }
			zoom: coordAndZoom.zoom,
			...center,
		};

		////array contains history current position...
		this.listPositionBeforAndAfter.push(this.currentPositionOnMap); /// [ { zoom : 0, lat: 0, lng: 0 }, ... ]

		if (this.listPositionBeforAndAfter.length > 10) {
			this.listPositionBeforAndAfter.shift();
		}

		this.indexCurrentOnLisPositionBeforeAndAfter = this.listPositionBeforAndAfter.length;
		const parentIconControlAfter = document.querySelector(".cart_after_jheo_js")?.parentElement?.parentElement;
		if (parentIconControlAfter && !parentIconControlAfter.classList.contains("d-none")) {
			parentIconControlAfter.classList.add("d-none");
		}

		if (this.listPositionBeforAndAfter.length > 1) {
			const parentIconControl = document.querySelector(".cart_before_jheo_js")?.parentElement?.parentElement;
			if (parentIconControl && parentIconControl.classList.contains("d-none")) {
				parentIconControl.classList.remove("d-none");
			}
		}

		///remove polyline
		// this.removePolylineWithoutMousePosition();

		///REMOVE THE OUTSIDE THE BOX
		/// if not bind data.
		// const x = this.getMax(this.map.getBounds().getWest(), this.map.getBounds().getEast());
		// const y = this.getMax(this.map.getBounds().getNorth(), this.map.getBounds().getSouth());

		// const new_size = { minx: x.min, miny: y.min, maxx: x.max, maxy: y.max };
		// this.removeMarkerOutSideTheBox(new_size);
	}

	settingMemoryCenter() {
		this.map.on("moveend", (e) => {
			this.handleEventMoveendForMemoryCenter(e);
		});

		this.map.on("movestart", (e) => {
			this.handleEventMoveStartForMemoryCenter(e);
		});
	}

	/**
	 * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
	 *
	 * @goal Create map leaflet; add json
	 *
	 * @param {*} lat
	 * @param {*} long
	 * @param {*} zoom
	 */
	async initMap() {
		const content_map = document.querySelector(".cart_map_js");

		if (document.querySelector("#toggle_chargement")) {
			content_map.removeChild(document.querySelector("#toggle_chargement"));
		}

		if (!document.querySelector("#map")) {
			const map = document.createElement("div");
			map.setAttribute("id", "map");
			map.setAttribute("class", "map");

			content_map.appendChild(map);
		}

		///init map
		await this.createMap();

		// create MarkerClusterGroup form POI and
		// for count marker per dep, fetch data,
		// add event on map
		await this.onInitMarkerCluster();

		////init geojson
		await this.addGeoJsonToMap();

		///add marker with text count etablisement per dep, inside the map.
		await this.addCulsterNumberAtablismentPerDep();

		///bind events on map ( movestart, dragend, zommend)
		this.addEventOnMap();

		///inject event to save memoir zoom
		this.settingMemoryCenter();

		/// bind controller in the right
		this.bindOtherControles();

		//// prepare right container
		this.createRightSideControl();

		//// prepare bottom container
		this.createBottomSideControl();
	}

	addEventOnMap() {
		console.log("This class must implement on class fils...");
	}

	updateGeoJson(couche, indexInJson) {
		// this.geoJSONLayer.clearLayers();

		const data_spec = this.objectGeoJson.find((item) => item.couche.toLowerCase() === couche);
		const styles = {
			color: data_spec.color[0],
			// fillColor: data_spec.color[1],
			fillOpacity: 0,
			weight: 1,
		};

		const data = indexInJson === -1 ? data_spec.data : data_spec.data[parseInt(indexInJson)];
		const geoJson = L.geoJson(data, {
			style: styles,
			onEachFeature: (feature, layer) => {
				const lng = (feature.geometry.bbox[0] + feature.geometry.bbox[2]) / 2;
				const lat = (feature.geometry.bbox[1] + feature.geometry.bbox[3]) / 2;

				if (couche !== "quartier") {
					this.updateCenter(lat, lng, 8);
					this.updateDataInSessionStorage(lat, lng, 8);
				}

				const coucheOption = this.contourOption.find((item) => item.couche === couche.toLowerCase());

				let description = "";
				coucheOption.properties.forEach((propertie) => {
					const desc = feature.properties[propertie]
						.split(" ")
						.map((item) => item.charAt(0).toUpperCase() + item.slice(1).toLowerCase())
						.join(" ");
					description += propertie.toUpperCase() + " : " + desc + " </br>";
				});

				layer.bindPopup(description);

				layer.on("mouseover", function (e) {
					this.openPopup();
				});

				layer.on("mouseout", function (e) {
					this.closePopup();
				});
			},
		}).addTo(this.map);

		this.objectGeoJson = this.objectGeoJson.map((item, index) => {
			if (item.couche.toLowerCase() === couche) {
				if (indexInJson !== -1) {
					item.child.push({ index: indexInJson, geoJson: geoJson });
				} else {
					item.child.push({ index: index, geoJson: geoJson });
				}
			}
			return item;
		});
	}

	removeSpecGeoJson(couche, indexInJson) {
		const data_spec = this.objectGeoJson.find((item) => item.couche.toLowerCase() === couche);
		const jsonIndex = data_spec.child.find((jtem) => jtem.index === indexInJson);

		//// remove this child
		jsonIndex.geoJson.clearLayers();

		this.objectGeoJson = this.objectGeoJson.map((item) => {
			item.child =
				item.couche.toLowerCase() === couche
					? item.child.filter((ktem) => ktem.index !== indexInJson)
					: item.child;
			return item;
		});
	}

	removeCoucheOnLeafled(COUCHE) {
		const data_spec = this.objectGeoJson.find((item) => item.couche.toLowerCase() === COUCHE.toLowerCase());
		//// remove geoJsom
		data_spec.child.forEach((jtem) => jtem.geoJson.clearLayers());
		this.objectGeoJson = this.objectGeoJson.filter((item) => item.couche.toLowerCase() !== COUCHE);
	}

	getMax(max, min) {
		return max < min ? { max: min, min: max } : { max: max, min: min };
	}

	/**
	 * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
	 *
	 * @goal Get bound coordinates of the map
	 *
	 */
	getBoundsWestEastNorthSouth() {
		const x = this.getMax(this.map.getBounds().getWest(), this.map.getBounds().getEast());
		const y = this.getMax(this.map.getBounds().getNorth(), this.map.getBounds().getSouth());

		return { minx: x.min, miny: y.min, maxx: x.max, maxy: y.max };
	}
}
