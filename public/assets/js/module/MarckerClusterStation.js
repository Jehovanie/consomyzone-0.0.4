class MarckerClusterStation {

    constructor(price_min, price_max, type = null, nom_dep = null, id_dep = null) {
        this.price_min = price_min;
        this.price_max = price_max;
        this.type = type ? type : null;
        this.nom_dep = nom_dep ? nom_dep : null;
        this.id_dep = id_dep ? id_dep : null;
    }

    async onInit() {
        this.ALREADY_INIT = false;
        try {
            this.getGeos()
            this.createMarkersCluster();

            const response = await fetch("/getLatitudeLongitudeStation/?max=" + this.price_max + "&min=" + this.price_min + "&type=" + this.type + "&nom_dep=" + this.nom_dep + "&id_dep=" + this.id_dep);
            this.default_data = await response.json();
            this.map = await create_map_content(this.geos, this.id_dep, "station");

            this.data = this.default_data;
            this.bindAction()
        } catch (e) {
            console.log(e)
        }
    }

    async filterByPrice(price_min, price_max, type) {
        try {
            const response = await fetch("/getLatitudeLongitudeStation/?max=" + price_max + "&min=" + price_min + "&type=" + type + "&nom_dep=" + this.nom_dep + "&id_dep=" + this.id_dep, {
                method: 'get',
            });
            this.default_data = await response.json();
            this.data = this.default_data;

            this.removeMarker();
            this.generateAllCard();
            this.setNumberOfMarker();

            if (document.querySelector(".alphabet_active span")) {
                this.filterByFirstLetterOnName(document.querySelector(".alphabet_active span").innerText)
                handleFilterFirstChar(document.querySelector(".alphabet_active span").innerText)
            } else {
                this.addMarker(this.data);
            }


        } catch (e) {
            console.log(e)
        }
    }

    getAlreadyInit() {
        return this.ALREADY_INIT;
    }

    setAlreadyInit(val) {
        this.ALREADY_INIT = val;
    }



    bindAction() {
        this.addMarker(this.data);
        this.addEventOnMap(this.map, this.markers);
        this.setNumberOfMarker();
        this.generateAllCard();
    }

    addEventOnMap(map, markers) {
        map.on("dragend", (e) => {
            const coordAndZoom = {
                zoom: e.target.getZoom(),
                coord: e.target.getCenter()
            }
            setDataInLocalStorage("coordStation", JSON.stringify(coordAndZoom))
        })


        map.on('moveend zoomend', function (e) {
            var bounds = map.getBounds();
            var zoom = map.getZoom();
            var markersDisplayed = false;

            if (zoom > 8) {
                markers.eachLayer(function (layer) {
                    if (bounds.contains(layer.getLatLng())) {
                        markersDisplayed = true;
                        layer.openPopup();
                        layer.unbindTooltip()
                    }
                });
            } else if (markersDisplayed) {
                markersDisplayed = false;
                markers.eachLayer(function (layer) {
                    if (bounds.contains(layer.getLatLng())) {
                        layer.closePopup();
                    }
                });
            }

            // this.markers.refreshClusters();
        });
    }

    getGeos() {
        this.geos = [];
        if (this.id_dep) {
            if (this.id_dep == 20) {
                for (let corse of ['2A', '2B'])
                    this.geos.push(franceGeo.features.find(element => element.properties.code == corse))
            } else {
                this.geos.push(franceGeo.features.find(element => element.properties.code == this.id_dep))
            }
        } else {
            document.querySelectorAll("#list_departements .element").forEach(item => {
                const dep = item.dataset.toggleDepartId
                if (dep == 20) {
                    for (let corse of ['2A', '2B'])
                        this.geos.push(franceGeo.features.find(element => element.properties.code == corse))
                } else {
                    this.geos.push(franceGeo.features.find(element => element.properties.code == dep))
                }
            })
        }
    }

    setNumberOfMarker() {
        /// change the number of result in div
        if (document.querySelector(".content_nombre_result_js_jheo")) {
            document.querySelector(".content_nombre_result_js_jheo").innerText = this.data.length;
        }

        /// change the number of result in div for the left translate
        if (document.querySelector(".content_nombre_result_left_js_jheo")) {
            document.querySelector(".content_nombre_result_left_js_jheo").innerText = this.data.length;
        }
    }

    displayData() {
        console.log(this.data)
        console.log(this.geos)
        console.log(this.map)
    }

    createMarkersCluster() {
        const that = this;
        this.markers = L.markerClusterGroup({
            chunkedLoading: true,

            iconCreateFunction: function (cluster) {
                if(that.marker_last_selected){
                    let sepcMarmerIsExist = false;
                    for (let g of  cluster.getAllChildMarkers()){
                        if (parseInt(that.marker_last_selected.options.id_icon) === parseInt(g.options.id_icon)) { 
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
                }
                return L.divIcon({
                    html: '<div class="markers_tommy_js">' + cluster.getChildCount() + '</div>',
                    className: "mycluster",
                    iconSize:L.point(35,35)
                });
            },
        });

    }

    addMarker(newData) {
        newData.forEach(item => {
            let miniFicheOnHover = setMiniFicheForStation(item.nom, item.adresse, item.prixE85, item.prixGplc, item.prixSp95, item.prixSp95E10, item.prixGasoil, item.prixSp98)
            let marker = L.marker(L.latLng(parseFloat(item.latitude), parseFloat(item.longitude)), { icon: setIcon("assets/icon/NewIcons/icon-station-new-B.png"), id_icon: item.id });

            // marker.bindPopup(setDefaultMiniFicherForStation(item.prixE85, item.prixGplc, item.prixSp95, item.prixSp95E10, item.prixGasoil, item.prixSp98), {autoClose: false, autoPan: false});

            // marker.on('add', function () {
            //     marker.openPopup();
            // });
            marker.on('click', () => {

                const latlng = L.latLng(marker._latlng.lat, marker._latlng.lng);
                this.map.setView(latlng, 11);

                if (screen.width < 991) {
                    getDetailStationForMobile(item.departementCode.toString().trim(), item.departementName.trim().replace("?", ""), item.id)
                } else {
                    getDetailStation(item.departementCode.toString().trim(), item.departementName.trim().replace("?", ""), item.id)
                }

                const url = new URL(window.location.href);
                const icon_R = L.Icon.extend({
                    options: {
                        iconUrl: IS_DEV_MODE ? url.origin + "/assets/icon/NewIcons/icon-station-new-R.png" : url.origin + "/public/assets/icon/NewIcons/icon-station-new-R.png"
                    }
                })
                marker.setIcon(new icon_R);
                if (this.marker_last_selected) {
                    const icon_B = L.Icon.extend({
                        options: {
                            iconUrl: IS_DEV_MODE ? url.origin + "/assets/icon/NewIcons/icon-station-new-B.png" : url.origin + "/public/assets/icon/NewIcons/icon-station-new-B.png"
                        }
                    })
                    this.marker_last_selected.setIcon(new icon_B)
                }
                this.marker_last_selected = marker;

                this.markers.refreshClusters();
            })

            marker.on("mouseover", () => {
                marker.bindTooltip(miniFicheOnHover, { direction: "auto", offset: L.point(0, -30) }).openTooltip()
                marker.closePopup();
            })

            this.markers.addLayer(marker);
        })
        this.map.addLayer(this.markers);
    }

    removeMarker() {
        this.markers.clearLayers();
        this.map.removeLayer(this.markers);
    }


    generateAllCard() {
        if (this.nom_dep && this.id_dep) {
            /// mise a jour de liste
            const parent_elements = document.querySelector(".list_result")
            const elements = document.querySelectorAll(".element")
            elements.forEach(element => {
                element.parentElement.removeChild(element);
            })

            this.data.forEach(element => {
                parent_elements.querySelector("ul").innerHTML += `
                    <li class="card-list element open_detail_jheo_js" onclick="getDetailStation('${this.id_dep}','${this.nom_dep}','${element.id}')" data-toggle-id='${element.id}'>
                        <div class="row container-depart element card_list_element_jheo_js" id="${element.id}">
                            <div class="col-md-9">
                                <p> <span class="id_departement">${element.nom.toLowerCase()}<br> </span>${element.adresse.toLowerCase()}</p>
                                <ul>
                                    <li> E 85: ${element.prixE85}€</li>
                                    <li> Gplc: ${element.prixGplc}€ </li>
                                    <li> Sp 95:${element.prixSp95}€ </li>
                                    <li> Sp 95 E 10:${element.prixSp95E10}€</li>
                                    <li> Sp 98:${element.prixSp98}€</li>
                                    <li> Gasoil:${element.prixGasoil}€</li>
                                </ul>
                            </div>
                            <div class="col-md-2">
                                <a class="open-detail-station">
                                    <svg version="1.0" xmlns="http://www.w3.org/2000/svg"  viewbox="0 0 512.000000 512.000000" preserveaspectratio="xMidYMid meet">

                                        <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)" 
                                        stroke="none">
                                            <path d="M2375 4954 c-231 -24 -462 -78 -641 -149 -782 -310 -1321 -993 -1440
                                            -1824 -21 -141 -23 -445 -5 -581 23 -170 77 -398 116 -485 8 -16 26 -59 40
                                            -95 175 -426 486 -804 870 -1056 1052 -689 2449 -398 3148 658 313 473 437
                                            1008 360 1568 -135 995 -920 1789 -1923 1945 -101 15 -440 28 -525 19z m285
                                            -395 c108 -17 187 -60 254 -137 32 -37 72 -96 90 -132 l31 -65 3 -519 3 -519
                                            332 6 c183 3 418 3 523 -1 188 -7 192 -8 256 -40 172 -85 278 -295 249 -496
                                            -23 -164 -114 -297 -249 -363 l-76 -38 -518 -3 -517 -3 -3 -517 -3 -517 -28
                                            -59 c-79 -170 -238 -266 -437 -266 -199 0 -358 96 -437 266 l-28 59 -3 517 -3
                                            517 -517 3 -518 3 -76 38 c-176 87 -280 295 -249 497 21 138 112 279 221 343
                                            98 57 120 59 652 59 l487 -1 3 517 3 517 29 62 c16 35 35 68 42 74 8 6 14 20
                                            14 29 0 47 174 151 280 169 77 12 115 12 190 0z"/>
                                        </g>
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </li>
                
                `
            })

            ///show when screen mobile
            if (document.querySelector(".content_list_station_left")) {
                const parent_elements_mobile_on_left = document.querySelector(".content_list_station_left")
                this.data.forEach(element => {
                    parent_elements_mobile_on_left.innerHTML += `
                        <li class="card_list element open_detail_mobile_jheo_js" data-toggle-id='${element.id}'  data-bs-toggle="modal" data-bs-target="#detailModalMobil" onclick="getDetailStationForMobile('${this.id_dep}','${this.nom_dep}','${element.id}')">
                            <div class="row container-depart pt-4 element" id="${element.id}">
                                <div class="col-md-9 col-sm-12">
                                    <p> 
                                        <strong class="id_departement">
                                            ${element.nom.toLowerCase()}<br>
                                        </strong>
                                        <em>${element.adresse.toLowerCase()}</em>
                                    </p>
                                    <ul>
                                        <li> E 85: ${element.prixE85}€</li>
                                        <li> Gplc: ${element.prixGplc}€ </li>
                                        <li> Sp 95:${element.prixSp95}€ </li>
                                        <li> Sp 95 E 10:${element.prixSp95E10}€</li>
                                        <li> Sp 98:${element.prixSp98}€</li>
                                        <li> Gasoil:${element.prixGasoil}€</li>
                                    </ul>
                                </div>
                            </div>
                        </li>
                    `
                })
            }
        }

        const selector = screen.width < 991 ? "open_detail_mobile_jheo_js" : "open_detail_jheo_js";
        if (document.querySelectorAll(`.${selector}`)) {
            const cta_details = document.querySelectorAll(`.${selector}`);
            cta_details.forEach(cta_detail => {
                cta_detail.addEventListener("click", () => {
                    const url = new URL(window.location.href);
                    this.markers.eachLayer(layer => {

                        if (parseInt(layer.options.id_icon) === parseInt(cta_detail.getAttribute("data-toggle-id"))) {
                            const icon_R = L.Icon.extend({
                                options: {
                                    iconUrl: IS_DEV_MODE ? url.origin + "/assets/icon/NewIcons/icon-station-new-R.png" : url.origin + "/public/assets/icon/NewIcons/icon-station-new-R.png"
                                }
                            })
                            layer.setIcon(new icon_R);
                            if (this.marker_last_selected) {
                                const icon_B = L.Icon.extend({
                                    options: {
                                        iconUrl: IS_DEV_MODE ? url.origin + "/assets/icon/NewIcons/icon-station-new-B.png" : url.origin + "/public/assets/icon/NewIcons/icon-station-new-B.png"
                                    }
                                })
                                this.marker_last_selected.setIcon(new icon_B)
                            }
                            this.marker_last_selected = layer;
                        }

                    })

                })
            })
        }

    }


    filterByFirstLetterOnName(letter) {
        const new_data = [];
        this.removeMarker();

        this.default_data.forEach(item => {
            if (item.nom.toLowerCase().charAt(0) === letter.toLowerCase()) {
                new_data.push(item)
            }
        })
        // alert(new_data.length)
        this.addMarker(new_data)
    }

    resetToDefaultMarkers() {
        this.removeMarker();
        this.addMarker(this.default_data)
    }
}