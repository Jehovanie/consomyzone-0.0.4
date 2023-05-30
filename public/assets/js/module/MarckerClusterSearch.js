class MarckerClusterSearch {

    constructor(nom_dep = null, id_dep = null) {
        this.nom_dep = nom_dep ? nom_dep : null;
        this.id_dep = id_dep ? id_dep : null;

        if( document.querySelector("#open-navleft")){
            document.querySelector("#open-navleft").parentElement.removeChild(document.querySelector("#open-navleft"));
        }
    }

    async onInit() {
        const url = new Request(url_test.href.replace("search", 'api/search'));
        try {
            this.getGeos()
            this.createMarkersCluster();
            this.map = await create_map_content(this.geos, this.id_dep, "home");

            const response = await fetch(url);
            this.default_data = await response.json();
            this.data = this.default_data;

            this.bindAction();

        } catch (e) {
            console.log(e)
        }
    }

    bindAction() {
        const { results } = this.data;
        this.addMarker(results[0]);
        // this.addEventOnMap(this.map, this.markers);
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
        const that= this;

        this.markers = L.markerClusterGroup({
            chunkedLoading: true,
            iconCreateFunction: function (cluster) {
                if(that.marker_last_selected){
                    let sepcMarmerIsExist = false;
                    for (let g of  cluster.getAllChildMarkers()){
                        if (parseInt(that.marker_last_selected.options.id) === parseInt(g.options.id)) { 
                            sepcMarmerIsExist = true;
                            break;
                        }
                    }
                    if(sepcMarmerIsExist){
                        return L.divIcon({
                            html: '<div class="markers-spec" id="c">' + cluster.getChildCount() + '</div>',
                            className: "spec_cluster",
                            iconSize:L.point(35,35)
                        });
                    }else{
                        return L.divIcon({
                            html: '<div class="markers_tommy_js">' + cluster.getChildCount() + '</div>',
                            className: "mycluster",
                            iconSize:L.point(35,35)
                        });
                    }
                }else{
                    return L.divIcon({
                        html: '<div class="markers_tommy_js">' + cluster.getChildCount() + '</div>',
                        className: "mycluster",
                        iconSize:L.point(35,35)
                    });
                }
            },
        });
    }

    addMarker(newData) {
        newData.forEach(item => {
            if( item.ferme !== undefined ){
                // address_HTML = "<br><span class='fw-bolder'> Adresse:</span> <br>" + item.add;
                // miniFiche_HTML = "<span class='fw-bolder'>Ferme:</span>  <br>" + item.nom + ".</br><span class='fw-bolder'> Departement:</span>  <br>" + item.dep +"." + address_HTML;
                // image_icon= "icon-ferme-new-B.png";

                this.settingSingleMarkerFerme(item)

            }else if( item.station !== undefined ){
                // miniFiche_HTML =setMiniFicheForStation(item.nom, item.add,item.prixE85,item.prixGplc,item.prixSp95,item.prixSp95E10,item.prixGasoil,item.prixSp98 )
                // image_icon= "icon-station-new-B.png";

                this.settingSingleMarkerStation(item)

            }else if( item.resto !== undefined ){
                // const fullAdresse=`${item.numvoie} ${item.typevoie} ${item.nomvoie} ${item.codpost} ${item.villenorm}`
                // address_HTML = "<br><span class='fw-bolder'> Adresse:</span> <br>" + fullAdresse;
                // miniFiche_HTML = "<span class='fw-bolder'> Restaurant:</span>  " + item.denominationF + ".<span class='fw-bolder'><br> Departement:</span>  " + item.depName +"." + address_HTML;
                // image_icon= "icon-resto-new-B.png";

                this.settingSingleMarkerResto(item);
            }
        })

        ////affiche les resultats.
        this.map.addLayer(this.markers);
    }

    addStation(dataStation) {
        dataStation.forEach(item => {
            this.settingSingleMarkerStation(item)
        })
    }

    addFerme(dataFerme) {
        dataFerme.forEach(item => {
            this.settingSingleMarkerFerme(item)
        })
    }

    addResto(dataResto) {
        dataResto.forEach(item => {
            this.settingSingleMarkerResto(item);
        })
    }


    settingSingleMarkerStation(item) {

        const url = new URL(window.location.href);
        const miniFicheOnHover = setMiniFicheForStation(item.nom, item.adresse, item.prixE85, item.prixGplc, item.prixSp95, item.prixSp95E10, item.prixGasoil, item.prixSp98)
        var marker = L.marker(L.latLng(parseFloat(item.lat), parseFloat(item.long)), { icon: setIcon("assets/icon/NewIcons/icon-station-new-B.png"), id: item.id });
        marker.bindTooltip(miniFicheOnHover, { direction: "auto", offset: L.point(0, -30) }).openTooltip();
        marker.on('click', (e) => {

            const latlng = L.latLng(marker._latlng.lat, marker._latlng.lng);
            this.map.setView(latlng, 13);

            const coordAndZoom = {
                zoom: e.target.__parent._zoom + 1,
                coord: e.target.__parent._cLatLng
            }
            setDataInLocalStorage("coordSearch", JSON.stringify(coordAndZoom))

            // @Route("/station/departement/{depart_code}/{depart_name}/details/{id}" , name="station_details", methods={"GET"})
            if (screen.width < 991) {
                getDetailHomeForMobile("/station/departement/" + item.dep.toString().trim() + "/" + item.depName.trim().replace("?", "") + "/details/" + item.id)
            } else {
                getDetailStation(item.dep.toString().trim(), item.depName.trim().replace("?", ""), item.id, true)
            }

            const icon_R = L.Icon.extend({
                options: {
                    iconUrl: IS_DEV_MODE ? url.origin + "/assets/icon/NewIcons/icon-station-new-R.png" : url.origin + "/public/assets/icon/NewIcons/icon-station-new-R.png"
                }
            })
            marker.setIcon(new icon_R);

            this.updateLastMarkerSelected(marker, "station");

            this.markers.refreshClusters();
        })

        this.markers.addLayer(marker);
    }

    settingSingleMarkerFerme(item) {
        const url = new URL(window.location.href);
        const adress = "<br><span class='fw-bolder'> Adresse:</span> <br>" + item.adresseFerme;
        // const link = "<br><a href='"+ pathDetails + "'> VOIR DETAILS </a>";

        var title = "<span class='fw-bolder'>Ferme:</span>  <br>" + item.nomFerme + ".<span class='fw-bolder'> Departement:</span>  <br>" + item.departement + "." + adress;

        var marker = L.marker(L.latLng(parseFloat(item.lat), parseFloat(item.long)), { icon: setIcon('assets/icon/NewIcons/icon-ferme-new-B.png'), id: item.id });

        marker.bindTooltip(title, { direction: "auto", offset: L.point(0, -30) }).openTooltip();


        marker.on('click', (e) => {

            const latlng = L.latLng(marker._latlng.lat, marker._latlng.lng);
            this.map.setView(latlng, 13);

            const coordAndZoom = {
                zoom: e.target.__parent._zoom + 1,
                coord: e.target.__parent._cLatLng
            }
            setDataInLocalStorage("coordTous", JSON.stringify(coordAndZoom))

            let pathDetails = `/ferme/departement/${item.depName}/${item.dep}/details/${item.id}`
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


            this.markers.refreshClusters();
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
        
        const poiY= item.lat;
        const poiX= item.long;
        var marker = L.marker(L.latLng(parseFloat(poiY), parseFloat(poiX)), { icon: setIcon('assets/icon/NewIcons/icon-resto-new-B.png'),id: item.id });

        marker.bindTooltip(title, { direction: "top", offset: L.point(0, -30) }).openTooltip();
        marker.on('click', (e) => {

            const latlng = L.latLng(marker._latlng.lat, marker._latlng.lng);
            this.map.setView(latlng, 13);

            const coordAndZoom = {
                zoom: e.target.__parent._zoom + 1,
                coord: e.target.__parent._cLatLng
            }
            setDataInLocalStorage("coordSearch", JSON.stringify(coordAndZoom))
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
            
            this.markers.refreshClusters();
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
        map.on("resize zoom dragend", (e) => {
            const coordAndZoom = {
                zoom: e.target._zoom,
                coord: e.target._lastCenter
            }
            setDataInLocalStorage("coordSearch", JSON.stringify(coordAndZoom))
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
                    this.last_minll = new_min_ll;
                    this.last_maxll = new_max_ll;
                }

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

    generate_checkout_option(content_filter){
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

        if (document.querySelector(".content_filter_js_jheo")) {
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
        let results = null;
        if(document.querySelector(".content_filter_js_jheo")){
            const lists = ["filterFerme", "filterStation", "filterResto", "filterVehicule", "filterCommerce"];
            let result_temp = [];
            for (let item of lists) {
                results = this.handleOnlyStateCheckbox(result_temp, item)
                result_temp = results;
            }
        }else{
            results= [
                { type:"filterFerme", state: 1},
                { type:"filterStation", state: 1},
                { type:"filterResto", state: 1},
            ]
        }

        const code_dep = document.querySelector(".input_select_dep_js_jheo").value.length < 3 ? document.querySelector(".input_select_dep_js_jheo").value : null;

        let data_ferme = [], data_station = [], data_resto = [];
        results.forEach(item => {
            const { type, state } = item;
            if (state === 1) {
                if (type === "filterFerme") {
                    data_ferme = code_dep ? data.ferme.filter(({ departement }) =>{  if( parseInt(code_dep) === 20){ return departement.trim() === "2A" || departement.trim() === "2B" || parseInt(departement) === 20 }else{ return parseInt(departement) === parseInt(code_dep)}}) : data.ferme;
                } else if (type === "filterStation") {
                    data_station = code_dep ? data.station.filter(({ departementCode }) => { if( parseInt(code_dep) === 20){ return departementCode.trim() === "2A" || departementCode.trim() === "2B" || parseInt(departementCode) === 20 }else{ return parseInt(departementCode) === parseInt(code_dep) }} ) : data.station;
                } else if (type === "filterResto") {
                    data_resto = code_dep ? data.resto.filter(({ dep }) =>{ if( parseInt(code_dep) === 20){ return dep.trim() === "2A" || dep.trim() === "2B" || parseInt(dep) === 20 }else{ return parseInt(dep) === parseInt(code_dep) }} ) : data.resto;
                }
            }
        })

        return { ferme: data_ferme, station: data_station, resto: data_resto }
    }

    checkStateSelectedDep(e) {
        const code_dep = e.target.value.length < 3 ? e.target.value : null;
        if (code_dep) {
            this.map.setView(L.latLng(centers[parseInt(code_dep)].lat, centers[parseInt(code_dep)].lng))
            this.map.setZoom(centers[parseInt(code_dep)].zoom +2 )
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
        console.log(data_filtered)
        this.removeMarker();
        if( data_filtered.ferme.length > 0  && data_filtered.station.length > 0 ){
            this.data = { ...this.data, "ferme": data_filtered.ferme, "station": data_filtered.station, "resto": data_filtered.resto }
            this.addMarker(this.data)
            console.log("not fetch")
        }else{
            let bounds = this.map.getBounds();
            let minll = bounds.getSouthWest();
            let maxll = bounds.getNorthEast();
            const data = { "last": { min: minll, max:maxll}, "new": {} };
            this.addPeripheriqueMarker(data)
        }

    }

    removeMarker() {
        this.markers.clearLayers();
        this.map.removeLayer(this.markers);
    }

    clickOnMarker(id){
        this.markers.eachLayer((marker) => {
            if (parseInt(marker.options.id) === parseInt(id) ) {
                marker.fireEvent('click');
            }
        });
    }
}