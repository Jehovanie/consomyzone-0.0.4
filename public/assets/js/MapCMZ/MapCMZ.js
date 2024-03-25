class MapCMZ {
	constructor() {
		console.log("hello map_cmz...");

		///default data;
		this.map = null;

		this.listTales = [
			{
				name: "Esri WorldStreetMap",
				link: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
				id: "osm_esri_jheo_js",
				isCurrent: true,
			},
			{
				name: "Openstreetmap.org",
				link: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
				id: "osm_org_jheo_js",
				isCurrent: false,
			},
			{
				name: "Openstreetmap.fr Osmfr",
				link: "//{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png",
				id: "osm_fr_jheo_js",
				isCurrent: false,
			},
		];

		this.tales = null;

		////default values but these distroy when we get the user position
		this.latitude = 46.61171462536897;
		this.longitude = 1.8896484375000002;
		this.defaultZoom = 6;
	}

	initTales() {
		this.tiles = L.tileLayer(this.listTales[0].link, {
			attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
			minZoom: 1,
			maxZoom: this.maxZoom,
		});
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
	}

	leafletAddControl(position = "topright") {
		this.leafletControlExtend(position);
		L.control
			.zoom({
				position: position,
			})
			.addTo(this.map);
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
		this.map = L.map("map", {
			zoomControl: false,
			center:
				this.id_dep || (lat != null && long != null && zoom != null) || !memoryCenter
					? L.latLng(this.latitude, this.longitude)
					: L.latLng(memoryCenter.coord.lat, memoryCenter.coord.lng),

			zoom: this.id_dep
				? this.defaultZoom
				: lat && long && zoom
				? zoom
				: memoryCenter
				? memoryCenter.zoom
				: this.defaultZoom,
			// zoom: memoryCenter ?  memoryCenter.zoom : this.defaultZoom,
			layers: [this.tiles],
		});

		this.leafletAddControl("topright");

		this.handleEventOnMap();
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
	createBtnControl(dataType, faSolidIcon, classBtn, messageTooltip) {
		const fontSize = dataType === "resto_pastille_jheo_js" ? "1.3rem" : "1.1rem";
		const isHidden = dataType === "cart_before_jheo_js" || dataType === "cart_after_jheo_js" ? "d-none" : "";
		return `
            <div class="content_message_tooltip content_message_tooltip_jheo_js ${isHidden}" data-type="${dataType}">
                <div class="message_tooltip d-none message_tooltip_jheo_js">${messageTooltip}</div>
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

	openRightSide(rightSideContentType) {
		if (rightSideContentType === "reset_zoom_jheo_js") {
			this.resetZoom();
		} else if (rightSideContentType === "cart_before_jheo_js") {
			// this.goBackOrAfterPosition("back");
		} else if (rightSideContentType === "cart_after_jheo_js") {
			// this.goBackOrAfterPosition("after");
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

		let htmlControl = `
            ${this.createBtnControl(
				"favoris_elie_js",
				"fa-regular fa-bookmark",
				"btn btn-dark p-3 pt-1 pb-1",
				"Mes favoris géographiques."
			)}
            ${this.createBtnControl(
				"tiles_type_jheo_js",
				"fa-solid fa-layer-group",
				"btn btn-warning",
				"Sélectionner un type de carte."
			)}
            ${this.createBtnControl(
				"couche_tabac_jheo_js",
				"fa-brands fa-connectdevelop",
				"btn btn-primary",
				"Listes des contours géographiques."
			)}
            ${this.createBtnControl(
				"info_golf_jheo_js",
				"fa-solid fa-circle-question",
				"btn btn-info",
				"Légende des icônes sur la carte."
			)}
            ${this.createBtnControl(
				"resto_pastille_jheo_js",
				"fa-solid fa-location-dot fa-flip text-danger",
				"btn btn-light",
				"Liste des restaurants pastilles."
			)}
            ${this.createBtnControl(
				"reset_zoom_jheo_js",
				"fa-solid fa-arrows-rotate",
				"btn btn-dark",
				"Réstaure le niveau de zoom en position initiale."
			)}
            ${this.createBtnControl(
				"cart_before_jheo_js",
				"fa-solid fa-backward fa-fade cart_before_jheo_js",
				"btn btn-outline-danger",
				"Voir la carte en position précedente."
			)}
            ${this.createBtnControl(
				"cart_after_jheo_js",
				"fa-solid fa-forward fa-fade cart_after_jheo_js",
				"btn btn-outline-danger",
				"Voir la carte en position avant."
			)}
        `;

		L.control
			.custom({
				content: htmlControl,
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

		//// bint event hover on btn control.
		this.bindTooltipsOnHover();
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
		// this.settingMemoryCenter();

		/// bind controller in the right
		this.bindOtherControles();

		//// prepare right container
		// this.createRightSideControl();
	}
}
