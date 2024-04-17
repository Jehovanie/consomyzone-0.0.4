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

		////default values but these distroy when we get the user position
		this.id_dep = null;

		this.latitude = 46.61171462536897;
		this.longitude = 1.8896484375000002;
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
	}

	initTales() {
		this.tiles = L.tileLayer(this.listTales[0].link, {
			attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
			minZoom: 1,
			maxZoom: this.maxZoom,
		});

		this.id_listTales_selected = this.listTales[0].id;
	}

	setLatLongForSpecDep(id_dep = null) {
		if (id_dep) {
			this.latitude = centers[this.id_dep].lat;
			this.longitude = centers[this.id_dep].lng;
			this.defaultZoom = centers[this.id_dep].zoom;
		}
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

	async createMap(lat = null, long = null, zoom = null) {
		if (lat != null && long != null && zoom != null) {
			this.latitude = lat;
			this.longitude = long;
			this.defaultZoom = zoom;

			this.updateMemoryCenterInSession(lat, long, zoom);
		}
		/// if there is departementSpecified
		this.setLatLongForSpecDep(this.id_dep);

		this.initTales();

		const memoryCenter = this.getDataMemoryCenterInSession("memoryCenter");

		// si on est dans une departement specifique, ou on est dans le recherch, et memory Center est vide...

		let map_zoom = 0;
		if (this.id_dep) {
			map_zoom = this.defaultZoom;
		} else if (lat && long && zoom) {
			map_zoom = zoom;
		} else if (memoryCenter) {
			map_zoom = memoryCenter.zoom;
		} else {
			map_zoom = this.defaultZoom;
		}

		this.map = L.map("map", {
			zoomControl: false,
			center:
				this.id_dep || (lat != null && long != null && zoom != null) || !memoryCenter
					? L.latLng(this.latitude, this.longitude)
					: L.latLng(memoryCenter.coord.lat, memoryCenter.coord.lng),

			zoom: map_zoom,
			layers: [this.tiles],
		});

		this.leafletAddControl("topright");

		// this.handleEventOnMap();
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
		const response = await fetch(`/number_etablisement/tous/${this.id_dep ? this.id_dep : "0"}`);
		const responseJson = await response.json();
		return responseJson;
	}

	async settingGeos() {
		let number_etablisement = null;

		const current_url = new URL(window.location.href);
		if (current_url.href.includes("search")) {
			const data = this.data.results[0];

			number_etablisement = {
				type: "search",
				departement: "0",
				total: data.length,
				nbr_etablisement_per_dep: this.getNumberPerDepDataSearch(),
			};
		} else {
			number_etablisement = await this.fetchMarkerPerDep();
		}
		const nbr_etablisement_per_dep = number_etablisement["nbr_etablisement_per_dep"];

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

	async addGeoJsonToMap() {
		if (!this.map) {
			console.log("Map not initialized");
			return false;
		}

		this.geos = await this.settingGeos();

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
					</button>
				`;
				layer.bindPopup(popupContent);
			},
		}).addTo(this.map);
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
				<div class="card mb-3 card_type_layer ${classSelected} ID_${item.id}_jheo_js">
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

		this.bindEventChangeTiles();
	}

	bindEventChangeTiles() {
		this.listTales.forEach((item) => {
			const singleTile = document.querySelector(`.ID_${item.id}_jheo_js`);
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
		const newTiles = this.listTales.find((item) => item.id === tilesID);
		this.tiles.setUrl(newTiles.link, false);

		this.listTales = this.listTales.map((item) => {
			item.isCurrent = item.id === tilesID ? true : false;
			return item;
		});
	}

	closeRightSide() {
		if (document.querySelector(".cart_map_jheo_js") && document.querySelector(".content_legende_jheo_js")) {
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

			const cart_width = "75%";
			const cont_legent_width = "25%";

			if (document.querySelector(".cart_map_jheo_js") && document.querySelector(".content_legende_jheo_js")) {
				if (!document.querySelector(".title_right_side_jheo_js")) {
					console.log("Selector not found: '.title_right_side_jheo_js'");
					return false;
				}

				if (rightSideContentType === "info_golf_jheo_js") {
					document.querySelector(".title_right_side_jheo_js").innerText = "Légende des icônes sur la carte.";
					injectStatusGolf();
				} else if (rightSideContentType === "resto_pastille_jheo_js") {
					document.querySelector(".title_right_side_jheo_js").innerText = "Liste des restaurants pastilles.";
					this.injectListRestoPastille();
				} else if (rightSideContentType === "info_resto_jheo_js") {
					document.querySelector(".title_right_side_jheo_js").innerText = "Légende des icônes sur la carte.";
					injectStatusResto();
				} else if (rightSideContentType === "info_ferme_jheo_js") {
					document.querySelector(".title_right_side_jheo_js").innerText = "Légende des icônes sur la carte.";
					injectStatusFerme();
				} else if (rightSideContentType === "info_station_jheo_js") {
					document.querySelector(".title_right_side_jheo_js").innerText = "Légende des icônes sur la carte.";
					injectStatusStation();
				} else if (rightSideContentType === "info_tabac_jheo_js") {
					document.querySelector(".title_right_side_jheo_js").innerText = "Légende des icônes sur la carte.";
					injectStatusTabac();
				} else if (rightSideContentType === "info_tous_jheo_js") {
					document.querySelector(".title_right_side_jheo_js").innerText = "Légende des icônes sur la carte.";
					injectStatusTous();
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

				document.querySelector(".cart_map_jheo_js").style.width = cart_width;
				document.querySelector(".content_legende_jheo_js").style.width = cont_legent_width;
				document.querySelector(".content_legende_jheo_js").style.padding = "25px";
			} else {
				console.log("Selector not found");
				console.log("cart_map_jheo_js", "content_legende_jheo_js");
			}

			if (!this.isRightSideAlreadyOpen && document.querySelector(".close_right_side_jheo_js")) {
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
			const parentIconControl = document.querySelector(".cart_before_jheo_js").parentElement.parentElement;
			if (!parentIconControl.classList.contains("d-none")) {
				parentIconControl.classList.add("d-none");
			}

			const parentIconControlAfter = document.querySelector(".cart_after_jheo_js").parentElement.parentElement;
			if (parentIconControlAfter.classList.contains("d-none")) {
				parentIconControlAfter.classList.remove("d-none");
			}
		}

		if (this.indexCurrentOnLisPositionBeforeAndAfter === this.listPositionBeforAndAfter.length) {
			const parentIconControl = document.querySelector(".cart_after_jheo_js").parentElement.parentElement;
			if (!parentIconControl.classList.contains("d-none")) {
				parentIconControl.classList.add("d-none");
			}

			const parentIconControlBefore = document.querySelector(".cart_before_jheo_js").parentElement.parentElement;
			if (parentIconControlBefore.classList.contains("d-none")) {
				parentIconControlBefore.classList.remove("d-none");
			}
		}

		if (
			this.indexCurrentOnLisPositionBeforeAndAfter > 1 &&
			this.indexCurrentOnLisPositionBeforeAndAfter < this.listPositionBeforAndAfter.length
		) {
			const parentIconControlBefore = document.querySelector(".cart_before_jheo_js").parentElement.parentElement;
			if (parentIconControlBefore.classList.contains("d-none")) {
				parentIconControlBefore.classList.remove("d-none");
			}

			const parentIconControlAfter = document.querySelector(".cart_after_jheo_js").parentElement.parentElement;
			if (parentIconControlAfter.classList.contains("d-none")) {
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

	///bind and add control on the right side of the map
	bindOtherControles() {
		let favory_rubrique = "";
		if (this.mapForType === "resto" || this.mapForType === "tous") {
			favory_rubrique = `
				${this.createBtnControl(
					"favoris_elie_js",
					"fa-regular fa-bookmark",
					"btn btn-dark p-3 pt-1 pb-1",
					"Mes favoris géographiques."
				)}
			`;
		}

		let htmlControlMap = `
            ${this.createBtnControl(
				"tiles_type_jheo_js",
				"fa-solid fa-layer-group",
				"btn btn-warning me-2",
				"Sélectionner un type de carte.",
				"bootomright"
			)}
            ${this.createBtnControl(
				"couche_tabac_jheo_js",
				"fa-brands fa-connectdevelop",
				"btn btn-primary me-2",
				"Listes des contours géographiques.",
				"bootomright"
			)}
			${this.createBtnControl(
				"reset_zoom_jheo_js",
				"fa-solid fa-arrows-rotate",
				"btn btn-dark me-2",
				"Réstaure le niveau de zoom en position initiale.",
				"bootomright"
			)}
            ${this.createBtnControl(
				"cart_after_jheo_js",
				"fa-solid fa-forward fa-fade cart_after_jheo_js",
				"btn btn-outline-danger me-2",
				"Voir la carte en position avant.",
				"bootomright"
			)}
			${this.createBtnControl(
				"cart_before_jheo_js",
				"fa-solid fa-backward fa-fade cart_before_jheo_js",
				"btn btn-outline-danger",
				"Voir la carte en position précedente.",
				"bootomright"
			)}
			
        `;

		let htmlControlRubrique = `
			${this.createBtnControl(
				"rubrique_type_jheo_js",
				"fa-solid fa-group-arrows-rotate",
				"btn btn-success mb-2",
				"Sélectionne ou désélectionne une rubrique."
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
				"info_golf_jheo_js",
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
				content: htmlControlMap,
				classes: "d-flex justify-content-center align-items-center ms-5 mb-4",
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

            <div class="content_right_side_body content_right_side_body_jheo_js">
                
            </div>
        `;

		document.querySelector(".content_cart_map_jheo_js").appendChild(container);
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
		console.log("handleEventMoveendForMemoryCenter...");

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
		console.log("handleEventMoveStartForMemoryCenter...");

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
		const parentIconControlAfter = document.querySelector(".cart_after_jheo_js").parentElement.parentElement;
		if (!parentIconControlAfter.classList.contains("d-none")) {
			parentIconControlAfter.classList.add("d-none");
		}

		if (this.listPositionBeforAndAfter.length > 1) {
			const parentIconControl = document.querySelector(".cart_before_jheo_js").parentElement.parentElement;
			if (parentIconControl.classList.contains("d-none")) {
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

	async initMap(lat = null, long = null, zoom = null) {
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
		await this.createMap(lat, long, zoom);

		////init geojson
		await this.addGeoJsonToMap();

		///inject event to save memoir zoom
		this.settingMemoryCenter();

		/// bind controller in the right
		this.bindOtherControles();

		//// prepare right container
		this.createRightSideControl();

		this.createBottomSideControl();

		this.addEventOnMap();
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

	getBoundsWestEastNorthSouth() {
		const x = this.getMax(this.map.getBounds().getWest(), this.map.getBounds().getEast());
		const y = this.getMax(this.map.getBounds().getNorth(), this.map.getBounds().getSouth());

		return { minx: x.min, miny: y.min, maxx: x.max, maxy: y.max };
	}
}
