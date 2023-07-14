class MarckerClusterHome extends MapModule  {

    constructor(nom_dep = null, id_dep = null,map_for_type="tous") {
        // this.nom_dep = nom_dep ? nom_dep : null;
        // this.id_dep = id_dep ? id_dep : null;
        super(id_dep,nom_dep, map_for_type)
        this.currentUrl= new URL(window.location.href);
        this.zoomDetails= 15;

        if( document.querySelector("#open-navleft")){
            document.querySelector("#open-navleft").parentElement.removeChild(document.querySelector("#open-navleft"));
        }
    }

    async onInit() {
        // const url = `/getLatitudeLongitudeForAll`;
        try {
            this.createMarkersCluster();

            const response = await fetch("/dataHome");

            this.default_data = await response.json();
            this.data = this.default_data;

            await this.initMap();
            this.bindAction();

        }catch(e){
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
        const that = this;
        const temp= 200;
        this.markers = L.markerClusterGroup({
            chunkedLoading: true,
            chunkInterval: temp * 5,
            chunkDelay: temp,
            removeOutsideVisibleBounds: true,
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

        const miniFicheOnHover = setMiniFicheForStation(item.nom, item.adresse, item.prixE85, item.prixGplc, item.prixSp95, item.prixSp95E10, item.prixGasoil, item.prixSp98)
        var marker = L.marker(L.latLng(parseFloat(item.lat), parseFloat(item.long)), { icon: setIconn("assets/icon/NewIcons/icon-station-new-B.png") , id: item.id });

        marker.bindTooltip(miniFicheOnHover, { direction: "auto", offset: L.point(0, -30) }).openTooltip();
        
        this.handleClickStation(marker, item)
        this.markers.addLayer(marker);
    }

    handleClickStation(stationMarker,dataStation){
            
        stationMarker.on('click', (e) => {
            this.updateCenter(e.target.__parent._cLatLng.lat, e.target.__parent._cLatLng.lng, this.zoomDetails);
            const icon_R = L.Icon.extend({
                options: {
                    iconUrl: IS_DEV_MODE ? this.currentUrl.origin + "/assets/icon/NewIcons/icon-station-new-R.png" : this.currentUrl.origin + "/public/assets/icon/NewIcons/icon-station-new-R.png",
                    iconSize: [32,50],
                    iconAnchor: [11, 30],
                    popupAnchor: [0, -20],
                    shadowSize: [68, 95],
                    shadowAnchor: [22, 94]
                }
            })

            stationMarker.setIcon(new icon_R);
            this.updateLastMarkerSelected(stationMarker, "station");
            
            if (screen.width < 991) {
                getDetailHomeForMobile("/station/departement/" + dataStation.departementCode.toString().trim() + "/" + dataStation.departementName.trim().replace("?", "") + "/details/" + dataStation.id)
            } else {
                getDetailStation(dataStation.departementCode.toString().trim(), dataStation.departementName.trim().replace("?", ""), dataStation.id, true)
            }

        })

    }

    settingSingleMarkerFerme(item) {
      
        const adress = "<br><span class='fw-bolder'> Adresse:</span> <br>" + item.adresseFerme;
        // const link = "<br><a href='"+ pathDetails + "'> VOIR DETAILS </a>";

        var title = "<span class='fw-bolder'>Ferme:</span>  <br>" + item.nomFerme + ".<span class='fw-bolder'> Departement:</span>  <br>" + item.departement + "." + adress;

        var marker = L.marker(L.latLng(parseFloat(item.lat), parseFloat(item.long)), { icon: setIconn('assets/icon/NewIcons/icon-ferme-new-B.png') , id: item.id });
        marker.bindTooltip(title, { direction: "auto", offset: L.point(0, -30) }).openTooltip();

        this.handleClickFerme(marker, item);
        
        this.markers.addLayer(marker);
    }


    handleClickFerme(fermeMarker, dataFerme ){

        fermeMarker.on('click', (e) => {
            this.updateCenter(e.target.__parent._cLatLng.lat, e.target.__parent._cLatLng.lng, this.zoomDetails);
            const icon_R = L.Icon.extend({
                options: {
                    iconUrl: IS_DEV_MODE ? this.currentUrl.origin + "/assets/icon/NewIcons/icon-ferme-new-R.png" : this.currentUrl.origin + "/public/assets/icon/NewIcons/icon-ferme-new-R.png",
                    iconSize: [32,50],
                    iconAnchor: [11, 30],
                    popupAnchor: [0, -20],
                    shadowSize: [68, 95],
                    shadowAnchor: [22, 94]
                }
            })
            fermeMarker.setIcon(new icon_R);
            this.updateLastMarkerSelected(fermeMarker, "ferme")

            if (screen.width < 991) {
                let pathDetails = `/ferme/departement/${dataFerme.departementName}/${dataFerme.departement}/details/${dataFerme.id}`
                getDetailHomeForMobile(pathDetails)
            } else {
                // getDetailsFerme(pathDetails, true)getDetailStation
                getDetailFerme(dataFerme.departement, dataFerme.departementName, dataFerme.id, true)
            }

        })
    }

    settingSingleMarkerResto(item) {

        const departementName = item.depName
        const adresseRestaurant = `${item.numvoie} ${item.typevoie} ${item.nomvoie} ${item.codpost} ${item.villenorm}`
        const adress = "<br><span class='fw-bolder'> Adresse:</span> <br>" + adresseRestaurant;

        var title = "<span class='fw-bolder'> Restaurant:</span>  " + item.denominationF + ".<span class='fw-bolder'><br> Departement:</span>  " + departementName + "." + adress;
        var marker = L.marker(L.latLng(parseFloat(item.lat), parseFloat(item.long)), { icon: setIconn('assets/icon/NewIcons/icon-resto-new-B.png') , id: item.id });

        marker.bindTooltip(title, { direction: "top", offset: L.point(0, -30) }).openTooltip();

        this.handleClickResto(marker, item)
        this.markers.addLayer(marker);
    }

    handleClickResto(restoMarker, dataResto){
        
        restoMarker.on('click', (e) => {
            this.updateCenter(e.target.__parent._cLatLng.lat, e.target.__parent._cLatLng.lng, this.zoomDetails);

            const icon_R = L.Icon.extend({
                options: {
                    iconUrl: IS_DEV_MODE ? this.currentUrl.origin + "/assets/icon/NewIcons/icon-resto-new-R.png" : this.currentUrl.origin + "/public/assets/icon/NewIcons/icon-resto-new-R.png",
                    iconSize: [32,50],
                    iconAnchor: [11, 30],
                    popupAnchor: [0, -20],
                    shadowSize: [68, 95],
                    shadowAnchor: [22, 94]
                }
            })
            restoMarker.setIcon(new icon_R);
            this.updateLastMarkerSelected(restoMarker, "resto")
            
            if (screen.width < 991) {
                var pathDetails = `/restaurant-mobile/departement/${departementName}/${dataResto.dep}/details/${dataResto.id}`;
                location.assign(pathDetails)
            } else {
                getDetailResto(dataResto.dep, dataResto.depName, dataResto.id, true)
            }
        })

    }


    updateLastMarkerSelected(marker, type) {
        if (this.marker_last_selected && this.marker_last_selected !== marker ) {

            let icon_marker = "";
            if (this.marker_last_selected_type === "station") {
                icon_marker = IS_DEV_MODE ? `${this.currentUrl.origin}/assets/icon/NewIcons/icon-station-new-B.png` : `${this.currentUrl.origin}/public/assets/icon/NewIcons/icon-station-new-B.png`;
            } else if (this.marker_last_selected_type === "ferme") {
                icon_marker = IS_DEV_MODE ? `${this.currentUrl.origin}/assets/icon/NewIcons/icon-ferme-new-B.png` : `${this.currentUrl.origin}/public/assets/icon/NewIcons/icon-ferme-new-B.png`;
            } else if (this.marker_last_selected_type === "resto") {
                icon_marker = IS_DEV_MODE ? `${this.currentUrl.origin}/assets/icon/NewIcons/icon-resto-new-B.png` : `${this.currentUrl.origin}/public/assets/icon/NewIcons/icon-resto-new-B.png`;
            }

            const icon_B = L.Icon.extend({
                options: {
                    iconUrl: icon_marker,
                    iconSize: [32,50],
                    iconAnchor: [11, 30],
                    popupAnchor: [0, -20],
                    shadowSize: [68, 95],
                    shadowAnchor: [22, 94]
                }
            })
            this.marker_last_selected.setIcon(new icon_B)
        }

        this.marker_last_selected = marker;
        this.marker_last_selected_type = type;
        
        this.markers.refreshClusters();
    }

    addEventOnMap(map) {
        map.on("resize moveend", () => { 
            const x= this.#getMax(this.map.getBounds().getWest(),this.map.getBounds().getEast())
            const y= this.#getMax(this.map.getBounds().getNorth(), this.map.getBounds().getSouth())

            const new_size= { minx:x.min, miny:y.min, maxx:x.max, maxy:y.max }

            this.addPeripheriqueMarker(new_size)
        })
    }

    async addPeripheriqueMarker(new_size) {
        try {
            const { minx, miny, maxx, maxy }= new_size;
            const param="?minx="+encodeURIComponent(minx)+"&miny="+encodeURIComponent(miny)+"&maxx="+encodeURIComponent(maxx)+"&maxy="+encodeURIComponent(maxy);

            const response = await fetch(`/dataHome${param}`);
            let new_data = await response.json();

            new_data.ferme = new_data.ferme.filter(item => !this.default_data.ferme.some(j => j.id === item.id))
            new_data.station = new_data.station.filter(item => !this.default_data.station.some(j => j.id === item.id))
            new_data.resto = new_data.resto.filter(item => !this.default_data.resto.some(j => j.id === item.id))
         
            this.addMarker(this.checkeFilterType(new_data));

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
        const content_filter = document.createElement("div");
        content_filter.className = "content_filter content_filter_js_jheo";

        this.generate_checkout_option(content_filter)

        const content_filter_dep = document.createElement("div");
        content_filter_dep.className = "content_filter_dep";
        document.querySelector("#map").appendChild(content_filter_dep);

        this.generate_select_dep(content_filter_dep) /// and bind event
        // this.eventManagement();
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

    #getMax(max,min){
        if(Math.abs(max)<Math.abs(min))
            return {max:min,min:max} 
        else
           return {max:max,min:min}
    }
}