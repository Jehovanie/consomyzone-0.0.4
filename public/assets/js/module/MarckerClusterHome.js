class MarckerClusterStation {

    constructor(nom_dep = null, id_dep = null) {
        this.nom_dep = nom_dep ? nom_dep : null;
        this.id_dep = id_dep ? id_dep : null;
        this.is_online = false;
        this.time_on_setInterval = 300;
    }

    async onInit() {
        const url = `/getLatitudeLongitudeForAll`;
        try {
            this.getGeos()
            this.createMarkersCluster();

            this.map = await create_map_content(this.geos, this.id_dep, "home");
            const bounds = this.map.getBounds();
            this.last_minll = bounds.getSouthWest();
            this.last_maxll = bounds.getNorthEast();

            const data = { "last": { min: this.last_minll, max: this.last_maxll }, "new": {} };

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            this.default_data = await response.json();
            this.data = this.default_data;
            // console.log(this.data)
            this.bindAction();
        } catch (e) {
            console.log(e)
        }
    }

    bindAction() {
        this.addMarker(this.data);
        this.addEventOnMap(this.map, this.markers);
        this.generateFilterAndSelectDep()
    }

    getGeos() {
        this.geos = [];
        if (this.id_dep) {
            if (this.id_dep === 20) {
                for (let corse of ['2A', '2B']) {
                    this.geos.push(franceGeo.features.find(element => element.properties.code == corse))
                }
            } else {
                this.geos.push(franceGeo.features.find(element => element.properties.code == this.id_dep))
            }
        } else {
            for (let f of franceGeo.features) {
                this.geos.push(f)
            }
        }
    }

    displayData() {
        console.log(this.data)
        console.log(this.geos)
        console.log(this.map)
    }

    createMarkersCluster() {
        this.markers = L.markerClusterGroup({
            chunkedLoading: true,
            removeOutsideVisibleBounds: true,
            chunkInterval: 100,
            chunkDelay: 30,
        });
    }

    addMarker(newData) {
        const { station, ferme, resto } = newData;
        if (station || ferme || resto) {

            if (station.length > 0) {
                this.addStation(station);
            }

            ///all fermes
            if (ferme.length > 0) {
                this.addFerme(ferme)
            }

            ///all resto
            if (resto.length > 0) {
                this.addResto(resto);
            }
            this.map.addLayer(this.markers);
        } else {
            console.log("ERREUR : L'erreur se produit par votre réseaux.")
        }
    }

    addStation(dataStation) {

        // dataStation.forEach(item => {
        //     this.settingSingleMarkerStation(item)
        // })

        const tab_data_station = splitArrayToMultipleArray(dataStation);

        let i = 0;
        const add_station_interval = setInterval(() => {
            tab_data_station[i].forEach(item => {
                this.settingSingleMarkerStation(item)
            })
            i++;
            if (i === tab_data_station.length) {
                clearInterval(add_station_interval)
            }
        }, this.time_on_setInterval)
    }

    addFerme(dataFerme) {

        // dataFerme.forEach(item => {
        //     this.settingSingleMarkerFerme(item)
        // })
        const tab_data_ferme = splitArrayToMultipleArray(dataFerme);

        let i = 0;
        const add_ferme_interval = setInterval(() => {
            tab_data_ferme[i].forEach(item => {
                this.settingSingleMarkerFerme(item)
            })
            i++;
            if (i === tab_data_ferme.length) {
                clearInterval(add_ferme_interval)
            }
        }, this.time_on_setInterval);
    }

    addResto(dataResto) {
        const tab_data_resto = splitArrayToMultipleArray(dataResto);

        let i = 0;
        const add_resto_Interval = setInterval(() => {
            tab_data_resto[i].forEach(item => {
                this.settingSingleMarkerResto(item);
            })
            i++;
            if (i === tab_data_resto.length) {
                clearInterval(add_resto_Interval)
            }
        }, this.time_on_setInterval);
    }


    settingSingleMarkerStation(item) {

        const url = new URL(window.location.href);
        const miniFicheOnHover = setMiniFicheForStation(item.nom, item.adresse, item.prixE85, item.prixGplc, item.prixSp95, item.prixSp95E10, item.prixGasoil, item.prixSp98)
        var marker = L.marker(L.latLng(parseFloat(item.latitude), parseFloat(item.longitude)), { icon: setIcon("assets/icon/NewIcons/icon-station-new-B.png") });
        marker.bindTooltip(miniFicheOnHover, { direction: "auto", offset: L.point(0, -30) }).openTooltip();
        marker.on('click', (e) => {
            const coordAndZoom = {
                zoom: e.target.__parent._zoom + 1,
                coord: e.target.__parent._cLatLng
            }
            setDataInLocalStorage("coordTous", JSON.stringify(coordAndZoom))

            // @Route("/station/departement/{depart_code}/{depart_name}/details/{id}" , name="station_details", methods={"GET"})
            if (screen.width < 991) {
                getDetailHomeForMobile("/station/departement/" + item.departementCode.toString().trim() + "/" + item.departementName.trim().replace("?", "") + "/details/" + item.id)
            } else {
                getDetailStation(item.departementCode.toString().trim(), item.departementName.trim().replace("?", ""), item.id, true)
            }

            const icon_R = L.Icon.extend({
                options: {
                    iconUrl: IS_DEV_MODE ? url.origin + "/assets/icon/NewIcons/icon-station-new-R.png" : url.origin + "/public/assets/icon/NewIcons/icon-station-new-R.png"
                }
            })
            marker.setIcon(new icon_R);

            this.updateLastMarkerSelected(marker, "station")
        })

        this.markers.addLayer(marker);
    }

    settingSingleMarkerFerme(item) {
        const url = new URL(window.location.href);
        const adress = "<br><span class='fw-bolder'> Adresse:</span> <br>" + item.adresseFerme;
        // const link = "<br><a href='"+ pathDetails + "'> VOIR DETAILS </a>";

        var title = "<span class='fw-bolder'>Ferme:</span>  <br>" + item.nomFerme + ".<span class='fw-bolder'> Departement:</span>  <br>" + item.departement + "." + adress;

        var marker = L.marker(L.latLng(parseFloat(item.latitude), parseFloat(item.longitude)), { icon: setIcon('assets/icon/NewIcons/icon-ferme-new-B.png') });

        marker.bindTooltip(title, { direction: "auto", offset: L.point(0, -30) }).openTooltip();


        marker.on('click', (e) => {
            const coordAndZoom = {
                zoom: e.target.__parent._zoom + 1,
                coord: e.target.__parent._cLatLng
            }
            setDataInLocalStorage("coordTous", JSON.stringify(coordAndZoom))

            let pathDetails = `/ferme/departement/${item.departementName}/${item.departement}/details/${item.id}`
            if (screen.width < 991) {
                getDetailHomeForMobile(pathDetails)
            } else {
                getDetailsFerme(pathDetails, true)
            }

            const icon_R = L.Icon.extend({
                options: {
                    iconUrl: IS_DEV_MODE ? url.origin + "/assets/icon/NewIcons/icon-ferme-new-R.png" : url.origin + "/public/assets/icon/NewIcons/icon-ferme-new-R.png"
                }
            })
            marker.setIcon(new icon_R);

            this.updateLastMarkerSelected(marker, "ferme")
        })
        this.markers.addLayer(marker);
    }

    settingSingleMarkerResto(item) {
        const url = new URL(window.location.href);
        const departementName = item.depName
        const adresseRestaurant = `${item.numvoie} ${item.typevoie} ${item.nomvoie} ${item.codpost} ${item.villenorm}`
        const adress = "<br><span class='fw-bolder'> Adresse:</span> <br>" + adresseRestaurant;

        // const link = "<br><a href='"+ pathDetails + "'> VOIR DETAILS </a>";
        var pathDetails = "/restaurant/departement/" + departementName + "/" + item.dep + "/details/" + item.id;
        var title = "<span class='fw-bolder'> Restaurant:</span>  " + item.denominationF + ".<span class='fw-bolder'><br> Departement:</span>  " + departementName + "." + adress;
        var marker = L.marker(L.latLng(parseFloat(item.poiY), parseFloat(item.poiX)), { icon: setIcon('assets/icon/NewIcons/icon-resto-new-B.png') });

        marker.bindTooltip(title, { direction: "top", offset: L.point(0, -30) }).openTooltip();
        marker.on('click', (e) => {
            const coordAndZoom = {
                zoom: e.target.__parent._zoom + 1,
                coord: e.target.__parent._cLatLng
            }
            setDataInLocalStorage("coordTous", JSON.stringify(coordAndZoom))
            // window.location = pathDetails;

            let screemMax = window.matchMedia("(max-width: 1000px)")
            let screemMin = window.matchMedia("(min-width: 1000px)")
            let remove = document.getElementById("remove-detail")

            if (screemMax.matches) {
                var pathDetails = `/restaurant-mobile/departement/${departementName}/${item.dep}/details/${item.id}`;
                location.assign(pathDetails)
            } else if (screemMin.matches) {

                remove.removeAttribute("class", "hidden");
                remove.setAttribute("class", "navleft-detail fixed-top")

                var myHeaders = new Headers();
                myHeaders.append('Content-Type', 'text/plain; charset=UTF-8');
                fetch(`/restaurant/departement/${departementName}/${item.dep}/details/${item.id}`, myHeaders)
                    .then(response => {
                        return response.text()
                    }).then(r => {
                        document.querySelector("#content-details").innerHTML = null
                        document.querySelector("#content-details").innerHTML = r

                        document.querySelector("#close-detail-tous-resto").addEventListener("click", () => {
                            document.querySelector("#content-details").style.display = "none"
                        })
                        document.querySelector("#content-details").removeAttribute("style")

                    })

            }

            const icon_R = L.Icon.extend({
                options: {
                    iconUrl: IS_DEV_MODE ? url.origin + "/assets/icon/NewIcons/icon-resto-new-R.png" : url.origin + "/public/assets/icon/NewIcons/icon-resto-new-R.png"
                }
            })
            marker.setIcon(new icon_R);

            this.updateLastMarkerSelected(marker, "resto")
        })

        this.markers.addLayer(marker);
    }

    updateLastMarkerSelected(marker, type) {
        const url = new URL(window.location.href);
        if (this.marker_last_selected) {
            let icon_marker = "";
            if (this.marker_last_selected_type === "station") {
                icon_marker = IS_DEV_MODE ? `${url.origin}/assets/icon/NewIcons/icon-station-new-B.png` : `${url.origin}/public/assets/icon/NewIcons/icon-station-new-B.png`;
            } else if (this.marker_last_selected_type === "ferme") {
                icon_marker = IS_DEV_MODE ? `${url.origin}/assets/icon/NewIcons/icon-ferme-new-B.png` : `${url.origin}/public/assets/icon/NewIcons/icon-ferme-new-B.png`;
            } else if (this.marker_last_selected_type === "resto") {
                icon_marker = IS_DEV_MODE ? `${url.origin}/assets/icon/NewIcons/icon-resto-new-B.png` : `${url.origin}/public/assets/icon/NewIcons/icon-resto-new-B.png`;
            }

            const icon_B = L.Icon.extend({
                options: {
                    iconUrl: icon_marker
                }
            })
            this.marker_last_selected.setIcon(new icon_B)
        }
        this.marker_last_selected = marker;
        this.marker_last_selected_type = type;
    }

    addEventOnMap(map, markers) {
        map.on("resize zoom", (e) => {
            const coordAndZoom = {
                zoom: e.target._zoom,
                coord: e.target._lastCenter
            }
            setDataInLocalStorage("coordTous", JSON.stringify(coordAndZoom))
        })

        map.on("zoomend dragend", async (e) => {

            let bounds = map.getBounds();
            let minll = bounds.getSouthWest();
            let maxll = bounds.getNorthEast();
            this.updateData(minll, maxll)
        })


        map.on("dragend", (e) => {
            const coordAndZoom = {
                zoom: e.target.getZoom(),
                coord: e.target.getCenter()
            }
            setDataInLocalStorage("coordTous", JSON.stringify(coordAndZoom))
        })
    }

    async updateData(new_min_ll, new_max_ll) {
        try {
            const data = { "last": { min: this.last_minll, max: this.last_maxll }, "new": { min: new_min_ll, max: new_max_ll } };

            if ((this.last_minll.lat > new_min_ll.lat) && (this.last_maxll.lng < new_max_ll.lng)) {
                ///same action update

                if (!this.is_online) {
                    this.is_online = true;
                    await this.addPeripheriqueMarker(data);
                }

                this.last_minll = new_min_ll;
                this.last_maxll = new_max_ll;
            }
        } catch (e) {
            console.log(e.message)
        }
    }

    async addPeripheriqueMarker(data) {
        const url = `/getLatitudeLongitudeForAll`;
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            let new_data = await response.json();

            new_data.ferme = new_data.ferme.filter(item => !this.default_data.ferme.some(j => j.id === item.id))
            new_data.station = new_data.station.filter(item => !this.default_data.station.some(j => j.id === item.id))
            new_data.resto = new_data.resto.filter(item => !this.default_data.resto.some(j => j.id === item.id))


            this.addMarker(this.checkeFilterType(new_data));
            this.is_online = false;

            // this.default_data= [ ...this.default_data, ...new_data ]
            this.default_data = {
                ...this.default_data,
                ferme: this.default_data.ferme.concat(new_data.ferme),
                station: this.default_data.station.concat(new_data.station),
                resto: this.default_data.resto.concat(new_data.resto),
            }

        } catch (e) {
            console.log(e)
        }
    }

    generateFilterAndSelectDep() {
        // <div class="content_filter">
        const content_filter = document.createElement("div");
        content_filter.className = "content_filter";

        this.generate_filter(content_filter, "filterTous", "Tous")
        this.generate_filter(content_filter, "filterFerme", "Ferme")
        this.generate_filter(content_filter, "filterStation", "Station")
        this.generate_filter(content_filter, "filterResto", "Réstaurant")
        this.generate_filter(content_filter, "filterVehicule", "Véhicule", true, true)
        this.generate_filter(content_filter, "filterCommerce", "Commerce", true, true)

        if (screen.width < 991) {
            document.querySelector(".content_filter_global_modal_jheo_js").appendChild(content_filter)
        } else {
            document.querySelector("#map").appendChild(content_filter);
        }

        const content_filter_dep = document.createElement("div");
        content_filter_dep.className = "content_filter_dep";
        document.querySelector("#map").appendChild(content_filter_dep);

        this.generate_select_dep(content_filter_dep) /// and bind event
        // this.eventManagement();
    }

    /* generate filter right */
    generate_filter(parent, id, textContent, state = true, none = false) {

        const div_filter = document.createElement("div");
        div_filter.className = "form-check form-switch";

        if (none) {
            div_filter.style.display = "none";
        }

        const input_filter = document.createElement("input");
        input_filter.className = "form-check-input"
        input_filter.type = "checkbox"
        input_filter.checked = state ? state : false;
        input_filter.setAttribute("id", id);
        input_filter.setAttribute("name", id);

        div_filter.appendChild(input_filter);

        const label_filter = document.createElement("label");
        label_filter.className = "form-check-label"
        label_filter.innerText = textContent;
        label_filter.setAttribute("for", id);

        div_filter.appendChild(label_filter);

        parent.appendChild(div_filter);

    }

    async generate_select_dep(parent, id_selected = null) {

        const div_select = document.createElement("select")
        div_select.className = "form-select input_select_dep_js_jheo"
        div_select.setAttribute("aria-label", "Sélectionnez un département");

        const default_options = document.createElement("option")
        default_options.innerText = "Tous les departements";
        default_options.setAttribute("value", "Tous les departements")
        div_select.appendChild(default_options)

        try {
            const response = await fetch("/api/alldepartements");
            const obj_dep = await response.json();
            this.all_dep = obj_dep.departements;

            this.all_dep.forEach(item => {
                const option = document.createElement("option")

                if (item.id === id_selected) {
                    option.setAttribute("selected", "");
                }
                option.setAttribute("value", item.id);
                option.innerText = `${item.id}: ${item.departement}`;

                div_select.appendChild(option);
            })
            parent.appendChild(div_select);
            this.eventManagement();
        } catch (e) {
            console.log(e)
        }
    }

    eventManagement() {

        if (document.querySelector(".content_filter")) {
            const alltype = document.querySelectorAll(".content_filter input");
            alltype.forEach(item => {
                item.addEventListener("click", (e) => this.changeType(e))
            })
        }

        if (document.querySelector(".input_select_dep_js_jheo")) {
            document.querySelector(".input_select_dep_js_jheo").addEventListener("change", (e) => this.checkStateSelectedDep(e))
        } else {
            console.log("event select dep not found")
        }
    }

    changeType(e) {
        document.querySelector(".btn_close_modal_filter_jheo_js")?.click();

        if (e.target.name === "filterTous") {
            if (document.querySelector("#filterTous").checked) {
                document.querySelectorAll(".content_filter input").forEach(item => {
                    item.checked = true;
                })
            } else {
                document.querySelectorAll(".content_filter input").forEach(item => {
                    item.checked = false;
                })
            }
        }

        const lists = ["filterFerme", "filterStation", "filterResto", "filterVehicule", "filterCommerce"];

        let result_temp = [];
        let results = null;
        for (let item of lists) {
            results = this.handleOnlyStateCheckbox(result_temp, item)
            result_temp = results;
        }

        if (results.every(item => item.state === 1)) {
            document.querySelector("#filterTous").checked = true;
        } else {
            document.querySelector("#filterTous").checked = false;
        }

        this.filterDataByDep();
    }

    checkeFilterType(data) {
        const lists = ["filterFerme", "filterStation", "filterResto", "filterVehicule", "filterCommerce"];
        let result_temp = [];
        let results = null;
        for (let item of lists) {
            results = this.handleOnlyStateCheckbox(result_temp, item)
            result_temp = results;
        }

        const code_dep = document.querySelector(".input_select_dep_js_jheo").value.length < 3 ? document.querySelector(".input_select_dep_js_jheo").value : null;

        let data_ferme = [], data_station = [], data_resto = [];
        results.forEach(item => {
            const { type, state } = item;
            if (state === 1) {
                if (type === "filterFerme") {
                    data_ferme = code_dep ? data.ferme.filter(({ departement }) => parseInt(departement) === parseInt(code_dep)) : data.ferme;
                } else if (type === "filterStation") {
                    data_station = code_dep ? data.station.filter(({ departementCode }) => parseInt(departementCode) === parseInt(code_dep)) : data.station;
                } else if (type === "filterResto") {
                    data_resto = code_dep ? data.resto.filter(({ dep }) => parseInt(dep) === parseInt(code_dep)) : data.resto;
                }
            }
        })

        return { ferme: data_ferme, station: data_station, resto: data_resto }
    }

    checkStateSelectedDep(e) {
        localStorage.removeItem("coordTous")

        const code_dep = e.target.value.length < 3 ? e.target.value : null;
        if (code_dep) {
            this.map.setView(L.latLng(centers[parseInt(code_dep)].lat, centers[parseInt(code_dep)].lng))
            this.map.setZoom(centers[parseInt(code_dep)].zoom)
        }
        this.filterDataByDep();
    }

    handleOnlyStateCheckbox(tab, item) {
        let result = []
        let state = { "type": document.querySelector(`#${item}`).getAttribute("name") };

        if (document.querySelector(`#${item}`).checked) {
            state = { ...state, "state": 1 }
        } else {
            state = { ...state, "state": 0 }
        }

        if (tab.length === 0) {
            return [state];
        } else {
            result = [...tab, state]
        }
        return result;
    }

    filterDataByDep() {
        const data_filtered = this.checkeFilterType(this.default_data);

        this.data = { ...this.data, "ferme": data_filtered.ferme, "station": data_filtered.station, "resto": data_filtered.resto }
        this.removeMarker();
        this.addMarker(this.data)
    }

    removeMarker() {
        this.markers.clearLayers();
        this.map.removeLayer(this.markers);
    }
}