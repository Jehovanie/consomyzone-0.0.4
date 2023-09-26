let firstX = 0
let firstY = 0
let marker_last_selected = null

/*

*/

function splitArrayToMultipleArray(tabToSplit) {
    const taille = 1000;
    let tab_results = [];
    let start_index = 0;
    let end_index = taille;
    const nbrTabResults = Math.ceil(tabToSplit.length / 1000);
    for (let i = 0; i < nbrTabResults; i++) {
        tab_results.push(tabToSplit.slice(start_index, end_index));
        start_index = end_index + 1;
        end_index += taille + 1;
        end_index = end_index > tabToSplit.length ? tabToSplit.length : end_index;
    }
    return tab_results;
}

function addEventLocation() {
    document.getElementById("mobile_station_js_jheo").addEventListener("click", () => {
        location.assign("/station");
    });
    document.getElementById("home-mobile").addEventListener('click', () => {
        location.assign('/')
    });
    document.getElementById("mobil-ferme").addEventListener('click', () => {
        location.assign('/ferme')
    });
    document.getElementById("mobil-resto").addEventListener('click', () => {
        location.assign('/restaurant')
    });//home-mobile

    document.getElementById("home-mobile-connexion").addEventListener('click', () => {
        location.assign('/connexion')
    });


}

// function addListFermeMobile() {
//     document.querySelector("#mobil-ferme").addEventListener('click', (event) => {
//         alert("Please select")
//         document.querySelector("#map > div.leaflet-control-container").innerHTML =
//             `
//             <div class="content-mobil-ferme">
//                 <svg class="close" id="close" version="1.0" xmlns="http://www.w3.org/2000/svg"
//                 width="10px" height="10px" viewBox="0 0 980.000000 982.000000"
//                 preserveAspectRatio="xMidYMid meet">

//                     <g transform="translate(0.000000,982.000000) scale(0.100000,-0.100000)"
//                     fill="#000000" stroke="none">
//                         <path d="M217 9593 l-217 -218 2232 -2232 2233 -2233 -2233 -2233 -2232 -2232
//                         220 -220 220 -220 2228 2228 c1225 1225 2232 2227 2237 2227 5 0 1010 -1000
//                         2232 -2222 l2223 -2223 220 220 220 220 -2227 2227 -2228 2228 2228 2228 2227
//                         2227 -220 220 -220 220 -2223 -2223 c-1222 -1222 -2227 -2222 -2232 -2222 -6
//                         0 -1011 1001 -2235 2225 -1224 1224 -2227 2225 -2230 2225 -3 0 -103 -98 -223
//                         -217z"/>
//                     </g>
//                 </svg>
//                 <div>
//                     <p>
//                         <svg version="1.0" xmlns="http://www.w3.org/2000/svg" 
//                         width="6vw" height="6vh" viewbox="0 0 128.000000 128.000000" 
//                         preserveaspectratio="xMidYMid meet">

//                             <g transform="translate(0.000000,128.000000) scale(0.100000,-0.100000)" 
//                                 fill="#1111FE" stroke="none">
//                                 <path d="M820 965 c-14 -7 -38 -16 -53 -20 -20 -4 -33 -16 -43 -40 -7 -18 -18
//                                 -36 -24 -40 -13 -8 -13 -51 0 -75 5 -10 21 -20 34 -24 20 -5 26 -14 31 -50 8
//                                 -52 -13 -101 -50 -118 -14 -6 -25 -17 -25 -25 0 -23 31 -14 65 20 44 44 53 91
//                                 31 170 -16 58 -16 62 2 86 26 35 67 39 99 9 20 -19 24 -29 19 -59 -5 -31 -2
//                                 -39 19 -53 33 -21 76 -98 90 -158 6 -27 15 -48 20 -46 17 5 8 83 -14 126 -12
//                                 23 -17 42 -12 42 15 0 32 36 25 55 -4 8 -18 22 -33 29 l-26 14 28 13 c15 7 26
//                                 17 24 23 -6 17 -49 36 -85 36 -29 0 -32 2 -26 24 4 19 -1 32 -20 50 -29 30
//                                 -41 31 -76 11z m145 -125 c-3 -5 -10 -10 -16 -10 -5 0 -9 5 -9 10 0 6 7 10 16
//                                 10 8 0 12 -4 9 -10z"/>
//                                 <path d="M855 831 c-7 -12 12 -24 25 -16 11 7 4 25 -10 25 -5 0 -11 -4 -15 -9z"/>
//                                 <path d="M246 778 c-69 -40 -109 -153 -72 -204 8 -10 16 -17 18 -14 2 3 12 18
//                                 22 33 9 15 28 33 42 39 13 6 24 18 24 26 0 10 4 12 13 5 6 -6 32 -13 56 -16
//                                 62 -8 71 -23 13 -23 -142 0 -218 -164 -126 -274 33 -38 74 -60 114 -60 35 0
//                                 37 8 10 52 -40 65 -16 159 49 193 44 22 48 20 53 -33 9 -96 91 -205 174 -232
//                                 25 -8 34 -18 34 -33 0 -12 7 -30 15 -41 12 -16 12 -20 -1 -33 -7 -8 -14 -21
//                                 -14 -29 0 -19 26 -18 34 2 5 14 7 14 22 0 17 -18 50 -21 59 -6 3 6 -5 14 -19
//                                 20 -55 21 -9 84 81 110 92 28 189 138 196 224 4 51 -20 40 -37 -17 -55 -189
//                                 -300 -252 -439 -113 -47 47 -67 85 -74 144 l-5 47 67 -3 c77 -4 118 4 112 21
//                                 -2 8 -24 11 -70 9 -95 -5 -103 -1 -99 52 5 54 -24 115 -70 147 -47 34 -131 37
//                                 -182 7z m494 -539 c0 -11 -27 -29 -33 -22 -14 14 -6 32 13 30 11 -1 20 -4 20
//                                 -8z"/>
//                                 <path d="M865 590 c-4 -6 10 -26 32 -45 21 -19 33 -34 27 -35 -6 0 -17 7 -24
//                                 15 -17 20 -54 19 -98 -4 -100 -51 -121 -60 -175 -74 -33 -9 -62 -19 -65 -22
//                                 -11 -11 49 -53 97 -70 59 -20 170 -19 221 1 75 30 107 109 72 174 -22 40 -76
//                                 77 -87 60z"/>
//                             </g>
//                         </svg>
//                         Ferme dans tous les departements francais.
//                     </p>
//                     <div>
                        
//                     </div>
//                 </div>
//             </div>
//         `
//         document.querySelector("#close").addEventListener('click', () => {
//             document.querySelector("#map > div.leaflet-control-container > div.content-mobil-ferme").style.transform = "translateX(-100vw)"
//         })
//     })
// }

function addControlPlaceholders(map) {
    const corners = map._controlCorners
    const l = 'leaflet-'
    const container = map._controlContainer;

    function createCorner(vSide, hSide) {
        var className = l + vSide + ' ' + l + hSide;

        corners[vSide] = L.DomUtil.create('div', className, container);
    }

    createCorner('verticalcenterl', 'left swipe-me-reverse');
    createCorner('verticalcenter', 'right');
    createCorner('horizontalmiddle', 'center');

}

///jheo: dynamique icon for map leaflet. ---------
function setIconn(urlIcon, classIcon="", taille=0) {
    // taille : 0: min, 1 : moyenne, 2 : max

    const url = new URL(window.location.href);
    var myIcon = L.icon({
        // iconUrl: url.origin+"/public/"+urlIcon,  ///only prod
        iconUrl: IS_DEV_MODE ? url.origin + "/" + urlIcon : url.origin + "/public/" + urlIcon, ///on dev
        iconSize:(taille === 0 ) ?  [30,45] : ( taille === 1) ? [35, 55] : [45, 60],
        iconAnchor: [11, 30],
        popupAnchor: [0, -20],
        //shadowUrl: 'my-icon-shadow.png',
        shadowSize: [68, 95],
        shadowAnchor: [22, 94],
        className: classIcon
    });
    return myIcon;
}

/**
 * @author Tommy
 * @param {*} nom_dep 
 * @param {*} id_dep 
 */
function addRestaurantToMap(nom_dep, code_dep) {
    
    ///border departments
    const geos = [];
    document.querySelectorAll(".element_js_jheo").forEach(item => {
        const dep = item.dataset.toggleDepartId
        geos.push(franceGeo.features.find(element => element.properties.code == dep))
    })

    let url_string = window.location.href;
    let url_param = new URL(url_string);
    let id_resto_url = url_param.searchParams.get("id");
    
    
    const API_URL = "/Coord/All/Restaurant";
    if (id_resto_url) {

        fetch(API_URL)
            .then(response => response.json())
            .then(response1 => {

                // if( document.getElementById("content_nombre_result_js_jheo")){
                //         document.getElementById("content_nombre_result_js_jheo").innerText = response1.length;
                // }

                var map = create_map_content_not_async(geos, code_dep, "resto");

                var markers = L.markerClusterGroup({
                    chunkedLoading: true
                });

                let lat_selected, lng_selected;
                response1.forEach(item => {
                    //console.log("item" , item)
                    const departementName = item.depName

                    // @Route("ferme/departement/{nom_dep}/{id_dep}/details/{id_ferme}" , name="detail_ferme" , methods="GET" )
                    // var pathDetails ="/restaurant/departement/"+ departementName + "/" + item.dep +"/details/" + item.id;
                    const adresseRestaurant = `${item.numvoie} ${item.typevoie} ${item.nomvoie} ${item.codpost} ${item.villenorm}`
                    const adress = "<br><span class='fw-bolder'> Adresse:</span> <br>" + adresseRestaurant;
                    // const link = "<br><a href='"+ pathDetails + "'> VOIR DETAILS </a>";

                    var title = "<span class='fw-bolder'> Restaurant:</span>  " + item.denominationF + ".<span class='fw-bolder'><br> Departement:</span>  " + departementName + "." + adress;

                    var marker;

                    if (item.id != id_resto_url) {
                        marker = L.marker(L.latLng(parseFloat(item.poiY), parseFloat(item.poiX)), { icon: setIconn('assets/icon/icon-resto-bleu.png') });
                    } else {
                        marker = L.marker(L.latLng(parseFloat(item.poiY), parseFloat(item.poiX)), { icon: setIconn('assets/icon/icon-restoR.png') });
                        lat_selected = parseFloat(item.poiY)
                        lng_selected = parseFloat(item.poiX)
                    }

                    marker.bindTooltip(
                        title, 
                        {
                            direction: "top",
                            offset: L.point(0, -30) 
                        }).openTooltip();

                    marker.on('click', (e) => {

                        let screemMax = window.matchMedia("(max-width: 1000px)")
                        let screemMin = window.matchMedia("(min-width: 1000px)")
                        
                        if (screemMax.matches) {

                            // const pathDetails = `/restaurant-mobile/departement/${departementName}/${item.dep}/details/${item.id}`;
                            // location.assign(pathDetails)
                        } else if (screemMin.matches) {

                            let remove = document.getElementById("remove-detail")
                            remove.removeAttribute("class", "hidden");
                            remove.setAttribute("class", "navleft-detail fixed-top")
                            
                            const myHeaders = new Headers();
                            myHeaders.append('Content-Type', 'text/plain; charset=UTF-8');
                            fetch(`/restaurant/departement/${departementName}/${item.dep}/details/${item.id}`, myHeaders)
                                .then(response => response.text())
                                .then(r => {
                                    document.querySelector("#content-details").innerHTML = null
                                    document.querySelector("#content-details").innerHTML = r

                                    document.querySelector("#close-detail-tous-resto").addEventListener("click", () => {
                                        document.querySelector("#content-details").style.display = "none"
                                    })
                                    document.querySelector("#content-details").removeAttribute("style")

                                })

                        }

                    })
                    markers.addLayer(marker);
                })

                map.addLayer(markers);

                map.setView([lat_selected, lng_selected], 18);

                map.on("resize zoomend dragend", (e) => {
                    console.log(e)
                    const coordAndZoom = {
                        zoom: e.target._zoom,
                        coord: e.target.getCenter()
                    }
                    setDataInLocalStorage("coord", JSON.stringify(coordAndZoom))
                })

                if (nom_dep && code_dep) {
                    /// mise a jour de liste
                    const parent_elements = document.querySelector(".list_result")
                    const elements = document.querySelectorAll(".element")
                    elements.forEach(element => {
                        element.parentElement.removeChild(element);
                    })

                    if (document.querySelector(".plus_result")) {
                        parent_elements.removeChild(document.querySelector(".plus_result"))
                    }

                    parsedResult.forEach(new_element => {

                        // <div class="element" id="{{station.id}}">
                        const div_new_element = document.createElement("div");
                        div_new_element.setAttribute("class", "element")
                        div_new_element.setAttribute("id", new_element.id);

                        // <p> <span class="id_departement">{{station.nom }} </span> {{station.adresse}}</p>
                        const s_p = document.createElement("p");
                        s_p.innerHTML = "<span class='id_departement'>" + new_element.nomFerme + " </span>" + new_element.adresseFerme

                        // <a class="plus" href="{{path('station_details', {'depart_code':departCode, 'depart_name':departName,'id':station.id }) }}">
                        const a = document.createElement("a");
                        a.setAttribute("class", "plus")
                        a.setAttribute("href", "/ferme/departement/" + nom_dep + "/" + id_dep + "/details/" + new_element.id)
                        a.innerText = "Voir details";

                        /// integre dom under the element
                        div_new_element.appendChild(s_p);
                        div_new_element.appendChild(a);

                        ///integre new element in each element.
                        parent_elements.appendChild(div_new_element);
                    })

                }
            })
    } else {
        fetch(API_URL)
            .then(response =>  response.json())
            .then(response1 => {

                deleteChargement();

                createMap();

                var map = create_map_content_not_async(geos, code_dep, "resto");
                
                // map.doubleClickZoom.disable();
                var markers = L.markerClusterGroup({
                    chunkedLoading: true,
                    removeOutsideVisibleBounds: true,
                    iconCreateFunction: function (cluster) {
                        if(marker_last_selected){
                            let sepcMarmerIsExist = false;
                            for (let g of  cluster.getAllChildMarkers()){
                                if (parseInt(marker_last_selected.options.id) === parseInt(g.options.id)) { 
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

                response1.forEach(item => {
                    // @Route("ferme/departement/{nom_dep}/{id_dep}/details/{id_ferme}" , name="detail_ferme" , methods="GET" )
                    // var pathDetails ="/restaurant/departement/"+ departementName + "/" + item.dep +"/details/" + item.id;

                    const departementName = item.depName
                    const adresseRestaurant = `${item.numvoie} ${item.typevoie} ${item.nomvoie} ${item.codpost} ${item.villenorm}`

                    const adress = "<br><span class='fw-bolder'> Adresse:</span> <br>" + adresseRestaurant;
                    const title = "<span class='fw-bolder'> Restaurant:</span>  " + item.denominationF + ".<span class='fw-bolder'><br> Departement:</span>  " + departementName + "." + adress;

                    let marker = L.marker(
                        L.latLng(parseFloat(item.poiY), parseFloat(item.poiX)),
                        {
                            icon: setIconn('assets/icon/NewIcons/icon-resto-new-B.png'),
                            cleNom: item.denominationF,
                            id: item.id
                        }
                    );

                    marker.bindTooltip(title, {
                        direction: "top",
                        offset: L.point(0, -30) 
                    }).openTooltip();

                    var currentZoom=18;

                    map.on('resize zoom',e=>{
                        currentZoom=map.getZoom()
                    })
                    
                    marker.on('click', (e) => {
                        const latlng = L.latLng(marker._latlng.lat, marker._latlng.lng);
                        
                        map.setView(latlng, currentZoom);

                        const url = new URL(window.location.href);
                        const icon_R = L.Icon.extend({
                            options: {
                                iconUrl: IS_DEV_MODE ? url.origin + "/assets/icon/NewIcons/icon-resto-new-Rr.png" : url.origin + "/public/assets/icon/NewIcons/icon-resto-new-Rr.png",
                                iconSize:[32,50]
                            }
                        })
                        marker.setIcon(new icon_R);

                        if (marker_last_selected && marker_last_selected != marker) {
                            const icon_B = L.Icon.extend({
                                options: {
                                    iconUrl: IS_DEV_MODE ? url.origin + "/assets/icon/NewIcons/icon-resto-new-B.png" :  url.origin + "/public/assets/icon/NewIcons/icon-resto-new-B.png",
                                    iconSize:[32,50]
                                }
                            })
                            marker_last_selected.setIcon(new icon_B)
                        }

                        marker_last_selected = marker

                        let screemMax = window.matchMedia("(max-width: 1000px)")
                        let screemMin = window.matchMedia("(min-width: 1000px)")
                        
                        if (screemMax.matches) {

                            // const pathDetails = `/restaurant-mobile/departement/${departementName}/${item.dep}/details/${item.id}`;
                            // location.assign(pathDetails)
                        } else if (screemMin.matches) {

                            let remove = document.getElementById("remove-detail")
                            remove.removeAttribute("class", "hidden");
                            remove.setAttribute("class", "navleft-detail fixed-top")

                            var myHeaders = new Headers();
                            myHeaders.append('Content-Type', 'text/plain; charset=UTF-8');

                            fetch(`/restaurant/departement/${departementName}/${item.dep}/details/${item.id}`, myHeaders)
                                .then(response => response.text())
                                .then(r => {
                                    document.querySelector("#content-details").innerHTML = null
                                    document.querySelector("#content-details").innerHTML = r

                                    document.querySelector("#close-detail-tous-resto").addEventListener("click", () => {
                                        document.querySelector("#content-details").style.display = "none"
                                    })
                                    document.querySelector("#content-details").removeAttribute("style")

                                })
                        }

                        markers.refreshClusters();
                    })

                    markers.addLayer(marker);
                })

                map.addLayer(markers);

                map.on("zoom dragend", (e) => {
                    const coordAndZoom = {
                        zoom: e.target._zoom ? e.target._zoom : this.defaultZoom,
                        coord: e.target._lastCenter ? e.target._lastCenter : { lat: this.latitude, lng: this.longitude }
                    }
                    setDataInLocalStorage("memoryCenter", JSON.stringify(coordAndZoom))
                })

                const cta_setCurrentPosition = document.createElement('a');
                cta_setCurrentPosition.setAttribute('href',"#");
                cta_setCurrentPosition.setAttribute('title',"Ma position");
                cta_setCurrentPosition.setAttribute('role',"button");
                cta_setCurrentPosition.setAttribute('aria-label', "Ma position");
                cta_setCurrentPosition.setAttribute('aria-disabled', "false");
            
                cta_setCurrentPosition.className= "cta_setCurrentPosition cta_setCurrentPosition_jheo_js";
            
                cta_setCurrentPosition.innerHTML= `
                    <i class="fa-solid fa-street-view ma_position"></i>
                `
            
                if( document.querySelector(".leaflet-control-zoom-out")){
                    document.querySelector(".leaflet-control-zoom-out").after(cta_setCurrentPosition)
                }

            })
    }

    addListDepartRest()

    
}

function addControlPlaceholdersStation(map) {
    const corners = map._controlCorners
    const l = 'leaflet-'
    const container = map._controlContainer;

    function createCorner(vSide, hSide) {
        var className = l + vSide + ' ' + l + hSide;

        corners[vSide] = L.DomUtil.create('div', className, container);
    }

    createCorner('verticalcenterl', 'left swipe-me-reverse');
    createCorner('verticalcenter', 'right');
    createCorner('horizontalmiddle', 'center');
}

function addControlPlaceholdersresto(map) {
    const corners = map._controlCorners
    const l = 'leaflet-'
    const container = map._controlContainer;

    function createCorner(vSide, hSide) {
        var className = l + vSide + ' ' + l + hSide;

        corners[vSide] = L.DomUtil.create('div', className, container);
    }

    createCorner('verticalcenterl', 'left swipe-me-reverse');
    createCorner('verticalcenter', 'right');
    createCorner('horizontalmiddle', 'center');
}


function showModalSearch() {
    // alert("Please Show Modal Search...");
    document.querySelector(".show_modal_search_for_mobile_js_jheo")?.click();
}

/// THIS FUNCTION USE ONLY TO SET THE MINIFICHE FOR STATION ON HOVER ///
function setMiniFicheForStation(nom, adresse, prixE85, prixGplc, prixSp95, prixSp95E10, prixGasoil, prixSp98) {
    const station = "<span class='fw-bolder'>STATION: </span> <br>" + nom + ".";
    const ad = "<br><span class='fw-bolder'>ADRESSE:</span> <br>" + adresse + ".";
    const carburants = "<br><span class='fw-bolder'>CARBURANTS:</span>"
        + "<ul>"
        + "<li><span class='fw-bold'>SP 95:</span> " + prixSp95 + "€ </li>"
        + "<li><span class='fw-bold'>SP 95 E 10:</span> " + prixSp95E10 + "€ </li>"
        + "<li><span class='fw-bold'>SP 98:</span> " + prixSp98 + "€ </li>"
        + "<li><span class='fw-bold'>Gasoil:</span> " + prixGasoil + "€ </li>"
        + "<li><span class='fw-bold'>E 85:</span> " + prixE85 + "€ </li>"
        + "<li><span class='fw-bold'>GPLC:</span> " + prixGplc + "€ </li>"
        + "</ul>";
    return station + ad + carburants;
}

function setDefaultMiniFicherForStation(prixE85, prixGplc, prixSp95, prixSp95E10, prixGasoil, prixSp98) {
    const gazole = parseFloat(prixGasoil) !== 0 ? `Gazole:${prixGasoil}€,` : ``;
    const e_85 = parseFloat(prixE85) !== 0 ? `E85:${prixGasoil}€,` : ``;
    const sp_95 = parseFloat(prixSp95) !== 0 ? `Sp95:${prixSp95}€,` : ``;
    const sp_95_10 = parseFloat(prixSp95E10) !== 0 ? `Sp9510:${prixSp95E10}€,` : ``;
    const sp_98 = parseFloat(prixSp98) !== 0 ? `Sp98${prixSp98}€,` : ``;
    const gplc = parseFloat(prixGplc) !== 0 ? `GPLC:${prixGplc}€,` : ``;

    const default_mini_fiche = `<div class="default_mini_ficher">${gazole}${e_85}${sp_95}${sp_95_10}${sp_98}${gplc}</div>`

    return default_mini_fiche.length > 45 ? `<div class="default_mini_ficher">${gazole}${e_85}${sp_95}<br/>${sp_95_10}${sp_98}${gplc}</div>` : default_mini_fiche
}


function getDetailHomeForMobile(link) {

    if (document.querySelector(".show_detail_for_mobile_js_jheo")) {
        document.querySelector(".show_detail_for_mobile_js_jheo").click();
    }

    fetchDetailsVialink(".content_detail_home_js_jheo", link)
    fetchAvies(idResto,document.querySelector("#tout-dem"))
}

function fetchDetailsVialink(selector, link) {

    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'text/plain; charset=UTF-8');

    fetch(link)
        .then(response => {
            return response.text()
        }).then(r => {
            document.querySelector(selector).innerHTML = null
            document.querySelector(selector).innerHTML = r
        })

}

function getDetailStation(depart_name, depart_code, id, inHome = false) {

    const id_selector = !inHome ? "#content-details-station" : "#content_details_home_js_jheo";
    const linkGetDetails= `/station/departement/${depart_name}/${depart_code}/details/${id}`;

    
    
    let remove = !inHome ? document.getElementById("remove-detail-station") : document.getElementById("remove-detail-home");
    
    remove.removeAttribute("class", "hidden");
    remove.setAttribute("class", "navleft-detail fixed-top")

    document.querySelector(id_selector).innerHTML = createMiniCMZloading()
    fetchDetails(id_selector,linkGetDetails)
}

function getDetailStationForMobile(depart_name, depart_code, id) {

    // console.log(depart_name, depart_code, id)
    if (document.querySelector(".btn_retours_specifique_jheo_js")) {
        document.querySelector(".btn_retours_specifique_jheo_js").click();
    }

    if (document.querySelector(".get_action_detail_on_map_js_jheo")) {
        document.querySelector(".get_action_detail_on_map_js_jheo").click();
    }

    ///link to get details
    const linkGetDetails= `/station/departement/${depart_name}/${depart_code}/details/${id}`;
    fetchDetails(".content_detail_js_jheo",linkGetDetails)
}

function fetchDetails(selector,linkGetDetail) {
    // document.querySelector(selector).innerHTML = null;

    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'text/plain; charset=UTF-8');

    fetch(linkGetDetail, myHeaders)
        .then(response => {
            return response.text()
        }).then(r => {
            const parser = new DOMParser();
            const htmlDocument = parser.parseFromString(r, "text/html");

            if( htmlDocument.querySelector(".content_body_details_jheo_js")){

                if( document.querySelector(".mini_chargement_content_js_jheo")){
                    document.querySelector(".mini_chargement_content_js_jheo").remove()
                }

                document.querySelector(selector).innerHTML = r
                reorganisePastille()
            }else{
                document.querySelector(selector).innerHTML = `
                    <div class="alert alert-danger d-flex align-items-center alert_details_marker_position" role="alert">
                        <div>
                            <i class="fa-solid fa-triangle-exclamation"></i>
                            <div>
                                Nous avons rencontre une probleme de connexion.
                            </div>
                        </div>
                    </div>
                `
            }
        })

}

function fetchAvies(idRestaurant, select_dem) {
    console.log("idRestaurant")
    console.log(idRestaurant)
    let currentUserId = 0
    
    if (select_dem) {
        currentUserId = parseInt(select_dem.getAttribute("data-dem").split(/\s*(?::|$)\s*/)[3].replace(/[^0-9]/g, ""), 10) 
        console.log(currentUserId)
    }
        
 
    fetch(`/avis/restaurant/${idRestaurant}`)
    .then(r => r.json())
    .then(jsons => {
        if (jsons) {
            console.log(jsons)
            console.log("currentUserId : " + currentUserId)
            for (let json of jsons) { 
                console.log("jsonUserId : " + json["user"]["id"])
                const b = (currentUserId == json["user"]["id"])
                console.log("b : " + b)
                if (b) {
                    if (document.querySelector("#givs-avis-resto-tom-js").style.display != "none") {
                        document.querySelector("#givs-avis-resto-tom-js").style.display = "none"
                        createModifArea(json,b)
                    } else {
                        if (document.querySelector(".fIQYlfPFT")) {
                            document.querySelector(".fIQYlfPFT").parentNode.removeChild(document.querySelector(".fIQYlfPFT"))
                            createModifArea(json,b)
                        }
                    }
                    break;
                }else{
                    console.log("Oooopssssssssssssssss vous n'êtes pas autorisé !")
                } 
            }
           
            if (document.querySelector("#see-tom-js")) {
                showNemberOfAvis(idRestaurant, document.querySelector("#see-tom-js"))
                showNoteGlobale(idRestaurant)
            }
        }
    })
    
    
    
}



function getDetailFerme(codeDepart, nameDepart, idFerme, inHome = false) {
    
    let remove = !inHome ? document.getElementById("remove-detail-ferme") : document.getElementById("remove-detail-home")
    remove.removeAttribute("class", "hidden");
    remove.setAttribute("class", "navleft-detail fixed-top")

    const id_selector = !inHome ? "#content-details-ferme" : "#content_details_home_js_jheo";

    document.querySelector(id_selector).innerHTML = createMiniCMZloading()

    const pathDetails = `/ferme/departement/${nameDepart}/${codeDepart}/details/${idFerme}`
    fetchDetails(id_selector, pathDetails);
}

function getDetailGolf(codeDepart,nameDepart, golfID, inHome = false) {

    let remove = !inHome ? document.getElementById("remove-detail-golf") : document.getElementById("remove-detail-home")
    remove.removeAttribute("class", "hidden");
    remove.setAttribute("class", "navleft-detail fixed-top")

    const id_selector = !inHome ? "#content-details-golf" : "#content_details_home_js_jheo";

    document.querySelector(id_selector).innerHTML = createMiniCMZloading();

    const pathDetails = `/golf/departement/${nameDepart}/${codeDepart}/${golfID}`;
    fetchDetails(id_selector, pathDetails);
}


function getDetailTabac(codeDepart,nameDepart, golfID, inHome = false) {

    let remove = !inHome ? document.getElementById("remove-detail-tabac") : document.getElementById("remove-detail-home")
    remove.removeAttribute("class", "hidden");
    remove.setAttribute("class", "navleft-detail fixed-top")

    const id_selector = !inHome ? "#content-details-tabac" : "#content_details_home_js_jheo";

    document.querySelector(id_selector).innerHTML = createMiniCMZloading();

    const pathDetails = `/tabac/departement/${nameDepart}/${codeDepart}/${golfID}`;
    fetchDetails(id_selector, pathDetails);
}

function getDetailsFermeForMobile(pathDetails) {
    // location.assign(pathDetails)

    // console.log(depart_name, depart_code, id)
    if (document.querySelector(".btn_retours_specifique_jheo_js")) {
        document.querySelector(".btn_retours_specifique_jheo_js").click();
    }

    if (document.querySelector(".get_action_detail_on_map_js_jheo")) {
        document.querySelector(".get_action_detail_on_map_js_jheo").click();
    }

    // fetchDetails(".content_detail_js_jheo", depart_name,depart_code,id)
    fetchDetails(".content_detail_js_jheo", pathDetails)
}


function getDetailResto(codeDepart, nameDepart, idResto, inHome= false,select_dem){

    let remove = !inHome ? document.getElementById("remove-detail-resto") : document.getElementById("remove-detail-home")
    remove.removeAttribute("class", "hidden");
    remove.setAttribute("class", "navleft-detail fixed-top")

    const id_selector = !inHome ? "#content_detail_resto_js_jheo" : "#content_details_home_js_jheo";

    document.querySelector(id_selector).innerHTML = createMiniCMZloading()

    // /restaurant/{nom_dep}/{id_dep}/details/{id_restaurant}
    const pathDetails = `/restaurant/${nameDepart}/${codeDepart}/details/${idResto}`;
    fetchDetails(id_selector, pathDetails);


    // if (document.querySelector("#open-navleft-resto-mobile-tomm-js")) {
    //     fetchAvies(idResto,document.querySelector("#open-navleft-resto-mobile-tomm-js"))
    // } else if (document.querySelector("#open-navleft-resto-spec-mobile-tomm-js")) {
    //     fetchAvies(idResto,document.querySelector("#open-navleft-resto-spec-mobile-tomm-js"))
    // } else if (document.querySelector("#tout-dem")) {
    //     fetchAvies(idResto,document.querySelector("#tout-dem"))
    // }
}



function addListFermeMobile() {
    document.querySelector(".open-navleft-mobile-tomm-js").addEventListener('click', () => {
        document.querySelector(".open-navleft-mobile-tomm-js").style.opacity = 0
        document.querySelector(".open-navleft-mobile-tomm-js").style.transition = "opacity 0.5s ease-in-out"
        if (document.querySelector(".list-depart-mobile-tomm-js")) {
            document.querySelector(".list-depart-mobile-tomm-js").removeAttribute("style")
        }
        fetch(`/ferme-mobile`)
            .then(response => {
                return response.text()
            }).then(r => {
                document.querySelector(".list-depart-mobile-tomm-js").innerHTML = null
                document.querySelector(".list-depart-mobile-tomm-js").innerHTML = r
                // firstX= document.querySelector(".list-depart-mobile-tomm-js").getBoundingClientRect().x+document.querySelector(".list-depart-mobile-tomm-js").getBoundingClientRect().width
                // firstY=document.querySelector(".list-depart-mobile-tomm-js").getBoundingClientRect().y

                document.querySelector("#close-ferme").addEventListener('click', () => {
                    document.querySelector(".list-depart-mobile-tomm-js").style ="transform: translateX(-100vw);display: none;"
                    document.querySelector(".open-navleft-mobile-tomm-js").style.opacity = 1
                })


                if (document.querySelector(".content_input_search_dep_jheo_js")) {
                    document.querySelector(".content_input_search_dep_jheo_js").addEventListener("submit", (e) => {
                        e.preventDefault();
                        if (document.querySelector(".input_search_dep_mobile_jheo_js").value) {
                            redirectToSerchFerme(document.querySelector(".input_search_dep_mobile_jheo_js").value)
                        }
                    })
                }
            })


    })
}


function redirectToSerchFerme(value) {
    const valueToSearch = value.toString().normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase()
    if (/^0[0-9]+$/.test(valueToSearch)) {
        lookupByDepCodeFerme(valueToSearch)
    } else if (/^0[0-9]+.[a-zA-Z]+/.test(valueToSearch)) {
        const tmp = valueToSearch.replace(/[^0-9]/g, "")
        lookupByDepCodeFerme(tmp)
    } else if (/^[0-9]+.[a-zA-Z]+$/.test(valueToSearch)) {
        const tmp = valueToSearch.replace(/[^0-9]/g, "")
        if (tmp.split("").length === 1) {
            const p = `0${tmp}`
            lookupByDepCodeFerme(p)
        } else {
            lookupByDepCodeFerme(tmp)
        }
    } else if (/[^0-9]/.test(valueToSearch)) {
        lookupByDepNameFerme(valueToSearch)
    } else {
        if (valueToSearch.split("").length === 1) {
            const tmp = `0${valueToSearch}`
            lookupByDepCodeFerme(tmp)
        } else {
            lookupByDepCodeFerme(valueToSearch)
        }
    }
}

function lookupByDepNameFerme(g) {
    DEP.depName.some((i, index) => {
        if ((i.toLowerCase()) === g) {
            let code = DEP.depCode[index]
            if (index >= 0 && index <= 8) {
                // code = DEP.depCode[index].replace("0", "")
                // window.location=`/ferme/departement/${code}/${i}`
                window.location = `/ferme/departement/${i}/${code}`
            } else {
                // window.location=`/ferme/departement/${code}/${i}`
                window.location = `/ferme/departement/${i}/${code}`
            }
        }
    })
}

function lookupByDepCodeFerme(g) {
    DEP.depCode.some((i, index) => {
        if (i == g) {
            let name = DEP.depName[index]
            if (index >= 0 && index <= 8) {
                // window.location=`/ferme/departement/${i.replace("0","")}/${name}`
                window.location = `/ferme/departement/${name}/${i}`
            } else {
                // window.location=`/ferme/departement/${i}/${name}`
                window.location = `/ferme/departement/${name}/${i}`
            }
        }
    })
}

// const nom_dep = 

function addListDepartMobile(nom_dep, id_dep) {
    location.assign(`/ferme/departement/${nom_dep}/${id_dep}`)
}

function addSpecificFermeMobile(nom_dep, id_dep) {
    document.querySelector("#open-navleft-mobile-tomm-js-specific").style.opacity = 0
    document.querySelector("#open-navleft-mobile-tomm-js-specific").style.transition = "opacity 0.5s ease-in-out"
    if (document.querySelector("#list-specific-depart-tomm-js")) {
        document.querySelector("#list-specific-depart-tomm-js").removeAttribute("style")
    }
    fetch(`/ferme-mobile/departement/${nom_dep}/${id_dep}`)
        .then(response => {
            return response.text()
        }).then(r => {
            // document.querySelector("#list-specific-depart-tomm-js")
            document.querySelector("#list-specific-depart-tomm-js").innerHTML = null
            document.querySelector("#list-specific-depart-tomm-js").innerHTML = r
            document.querySelector("#close-ferme-specific").addEventListener('click', () => {
                document.querySelector("#list-specific-depart-tomm-js").style = "transform: translateX(-115vw);display: none;"
                document.querySelector("#open-navleft-mobile-tomm-js-specific").style.transition = "opacity 0.5s ease-in-out"
                document.querySelector("#open-navleft-mobile-tomm-js-specific").style.opacity = 1
            })
        })
}

function addDetailFermeMobile(nom_dep, id_dep, id_ferme) {
    location.assign(`/ferme-mobile/departement/${nom_dep}/${id_dep}/details/${id_ferme}`)
}

function closeFermeDetail(nom_dep, id_dep) {
    // alert("Detail")
    location.assign(`/ferme/departement/${nom_dep}/${id_dep}`)
}




let i = 0
if (document.querySelector("#list-depart-mobile-tomm-js")) {
    console.log("inside function and #list-depart-mobile-tomm-js")

    document.querySelector("#list-depart-mobile-tomm-js").ontouchstart = (e) => {
        //e.preventDefault()
        firstX = e.touches[0].clientX;
        firstY = e.touches[0].clientY;
        //console.log(e.touches)
        /* document.querySelector("#open-navleft-mobile-tomm-js-specific").style.transition = "translateX(-100vw) ease-in-out"*/
    }

    document.querySelector("#list-depart-mobile-tomm-js").ontouchend = (e) => {
        let x = e.changedTouches[0].clientX
        let y = e.changedTouches[0].clientY
        // e.target.getBoundingClientRect().x = firstX - i;
        //if()
        console.log(x)
        console.log(y)
        let deltx = x - firstX
        let delty = y - firstY
        if (Math.abs(deltx) > Math.abs(delty)) {

            if (deltx < 0) { //gauche
                //document.querySelector("body").style.transition = `all 3s ease-in-out !important`
                document.querySelector(".list-depart-mobile-tomm-js").style.transform = `translateX(${deltx}px)` //left = `${deltx}px`
                document.querySelector(".open-navleft-mobile-tomm-js").style.opacity = 1
                // document.querySelector(".open-navleft-mobile-tomm-js").style.transition = "opacity 0.5s ease-in-out"
            }
        }
    }
}

function addListDepartRest() {
    if(document.querySelector(".open-navleft-resto-mobile-tomm-js")){
        document.querySelector(".open-navleft-resto-mobile-tomm-js").addEventListener('click', () => {
            document.querySelector(".open-navleft-resto-mobile-tomm-js").style.opacity = 0
            document.querySelector(".open-navleft-resto-mobile-tomm-js").style.transition = "opacity 0.5s ease-in-out";

            if (document.querySelector(".list-depart-resto-mobile-tomm-js")) {
                document.querySelector(".list-depart-resto-mobile-tomm-js").removeAttribute("style")
            }

            fetch(`/restaurant-mobile`)
                .then(response => response.text())
                .then(r => {
                    if (document.querySelector(".list-depart-resto-mobile-tomm-js")) {
                        document.querySelector(".list-depart-resto-mobile-tomm-js").innerHTML = null
                        document.querySelector(".list-depart-resto-mobile-tomm-js").innerHTML = r

                        document.querySelector("#close-resto").addEventListener('click', () => {
                            document.querySelector(".list-depart-resto-mobile-tomm-js").style = "transform: translateX(-100vw);display: none;"
                            document.querySelector(".open-navleft-resto-mobile-tomm-js").style.opacity = 1
                        })
                    }
                })
        })
    }
}

function getSpecifictArrond(nom_dep, id_dep) {
    location.assign(`/restaurant/arrondissement?nom_dep=${nom_dep}&id_dep=${id_dep}`)
}


function addListSpecResto(nom_dep, id_dep) {
    document.querySelector("#open-navleft-resto-mobile-tomm-js-arrand").style.opacity = 0
    document.querySelector("#open-navleft-resto-mobile-tomm-js-arrand").style.transition = "opacity 0.5s ease-in-out"
    if (document.querySelector("#list-arrand-resto-tomm-js")) {
        console.log(document.querySelector("#list-arrand-resto-tomm-js"))
        document.querySelector("#list-arrand-resto-tomm-js").removeAttribute("style")
    }
    fetch(`/restaurant-mobile/arrondissement?nom_dep=${nom_dep}&id_dep=${id_dep}`)
    .then(response => {
        return response.text()
    }).then(r => {
        document.querySelector("#list-arrand-resto-tomm-js").innerHTML = null
        document.querySelector("#list-arrand-resto-tomm-js").innerHTML = r
        document.querySelector("#close-resto-arrand").addEventListener('click', () => {
            document.querySelector("#list-arrand-resto-tomm-js").style.transform = "translateX(-100vw)"
            document.querySelector("#open-navleft-resto-mobile-tomm-js-arrand").style.opacity = 1
        })
    })
}


function getSpecArrand(nom_dep, id_dep, codinsee) {
    location.assign(`/restaurant/arrondissement/specific/?nom_dep=${nom_dep}&id_dep=${id_dep}&codinsee=${codinsee}`)
}

function getSpectResto(nom_dep, id_dep) {
    location.assign(`/restaurant/specific?nom_dep=${nom_dep}&id_dep=${id_dep}`)
}

function addListSpecRestoMobile(nom_dep, id_dep, codinsee, arrdssm) {
    document.querySelector("#open-navleft-resto-spec-mobile-tomm-js").style.opacity = 0
    document.querySelector("#open-navleft-resto-spec-mobile-tomm-js").style.transition = "opacity 0.5s ease-in-out"
    if (document.querySelector("#list-spesific-resto-tomm-js")) {
        console.log(document.querySelector("#list-spesific-resto-tomm-js"))
        document.querySelector("#list-spesific-resto-tomm-js").removeAttribute("style")
    }
    // alert(codinsee)
    fetch(`/restaurant-mobile/specific?nom_dep=${nom_dep}&id_dep=${id_dep}&codinsee=${codinsee}&arrdssm=${arrdssm}`)
        .then(response => {
            return response.text()
        }).then(r => {
            // console.log(r)
            document.querySelector("#list-spesific-resto-tomm-js").innerHTML = null
            document.querySelector("#list-spesific-resto-tomm-js").innerHTML = r

            document.querySelector("#close-resto-specific").addEventListener('click', () => {
                document.querySelector("#list-spesific-resto-tomm-js").style.transform = "translateX(-100vw)"
                document.querySelector("#open-navleft-resto-spec-mobile-tomm-js").style.opacity = 1
            })
        })
}

function getDetailRetoMobile(nom_dep, id_dep, id_restaurant, codinsee = null) {
    if (id_dep == "75" && codinsee != null) {
        // location.assign(`/restaurant-mobile/departement/${nom_dep}/${id_dep}/details/${id_restaurant}?codinsee=${codinsee}`)
    } else {
        // location.assign(`/restaurant-mobile/departement/${nom_dep}/${id_dep}/details/${id_restaurant}`)
    }
}

function closeRestoDetail(nom_dep, id_dep, codinsee) {
    if (id_dep == "75") {
        location.assign(`/restaurant/arrondissement/specific?nom_dep=${nom_dep}&id_dep=${id_dep}&codinsee=${codinsee}`)
    } else {
        location.assign(`/restaurant/specific?nom_dep=${nom_dep}&id_dep=${id_dep}`)
    }
}

function createChargement(elementParent=document.querySelector(".cart_map_js_jheo"),c="chargement_content chargment_content_js_jheo"){
    
    elementParent.innerHTML = `
        <div class="${c}" id="toggle_chargement">
            <div class="containt">
                <div class="word word-1">C</div>
                <div class="word word-2">M</div>
                <div class="word word-3">Z</div>
            </div>
        </div>
    `
}

function deleteChargement(c="chargement_content_js_jheo"){
    if(document.querySelector("."+c)){
        document.querySelector("."+c).remove();
        //document.querySelector(".charchargement_content_js_jheogement_content_js_jheo").style.display = "none";
    }
}

function createMap(){
    document.querySelector(".cart_map_js_jheo").innerHTML = `
        <div id="map" class="map map_js_jheo"></div>
    `
}

function deleteMap(){
    if(document.querySelector(".map_js_jheo")){
        document.querySelector(".map_js_jheo").remove();
    }
}

/**
 * Set a viewing photos as a gallery
 * @param {NodeList} imgs : list of images elements for making gallery
 */

function setGallerie(imgs){
    imgs.forEach(img => {
            
        //console.log(img);
        h = img.naturalHeight;
        w = img.naturalWidth;

        //console.log("img.naturalHeight : " + img.naturalHeight)
        //console.log("img.naturalWidth : " + img.naturalWidth)
        ratio = w/h;
        closestRatioValue = Math.abs(1-ratio);
        closestRatio = 1;
        var a = Math.abs(16/9-ratio);
        var b = Math.abs(9/16-ratio);

        if(a < closestRatioValue){
            closestRatioValue = a;
            closestRatio = 16/9;
        }
        if(b < closestRatioValue){
            closestRatioValue = b;
            closestRatio = 9/16;
        }

        if(closestRatio == 16/9){
            console.log("16/9");
            img.style.gridColumn = "span 2";
        } else if(closestRatio == 9/16){
            console.log("9/16");
            img.style.gridRow = "span 2";
        }
    });
}

/**
 * 
 * @param {Node} btn_photo : Parameter button clickable before shwoing image
 */

function setPhotoTribu(btn_photo){

    if(btn_photo.tagName != "IMG"){
        document.querySelector("#img_modal").src = btn_photo.querySelector("img").src
    }else{
        document.querySelector("#img_modal").src = btn_photo.src
    }
    
}


function calculateDurationOfComment(dateOfComment) {
    var date;
    date = new Date();
    let month
    let day
    if (parseInt(date.getUTCMonth() + 1, 10) <= 9) {
        month = `0${date.getUTCMonth() + 1}`;
    } else {
        month=date.getUTCMonth() + 1
    }
    if (parseInt(date.getUTCDate(), 10) <= 9) {
        day = `0${date.getUTCDate()}`;
    } else {
        day=date.getUTCDate()
    }
    const dateStr= date.getUTCFullYear() + '-' +month+ '-' +day
    const hour= (date.getHours())+ ':' + (date.getMinutes())+ ':' + (date.getSeconds());
    // console.log(dateOfComment,dateStr,hour)
    if(dateOfComment.split(" ")[0] != dateStr) {
        const dateDetails = parseInt(((dateOfComment.split(" ")[0]).split("-")[2]), 10)
        if ((dateDetails-date.getUTCDate())== 1) {
            // console.log("hier le " + dateOfComment.split(" ")[1])
            return "hier le "+dateOfComment.split(" ")[1]
        } else {
            const since = date.getUTCDate() - dateDetails 
            
            // console.log(dateDetails, date.getUTCDate())
            // console.log("depuis " + since + " j");
            return "depuis " + since + " j"
        }
            
    } else {
        let lapsTime = Math.abs(parseInt(((dateOfComment.split(" ")[1]).split(":")[0]), 10) - parseInt(((hour.split(":")[0])), 10))
        if (lapsTime == 0) {
            const minuteDetailsOfComment = parseInt(((dateOfComment.split(" ")[1]).split(":")[1]), 10)
            const minuteDetails=parseInt(((hour.split(":")[1])), 10)
            lapsTime = Math.abs(minuteDetailsOfComment - minuteDetails)
            if( lapsTime == 0) {
                return "maintenant";
            }else{
                return "aujourd'hui il y a " + lapsTime + " mn"
            }
        }
        // console.log("aujourd'hui il y a " + lapsTime + " h")
        return "aujourd'hui il y a " + lapsTime + " h"
    }

}


function settingDateToStringMonthDayAndYear(dateToTransform){
    const all_months= ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
    const current_date = new Date(dateToTransform);
    
    return `${all_months[current_date.getMonth()]} ${current_date.getDate()}, ${current_date.getUTCFullYear()}` ;
}


/**
 * 
 * @param {string} type , 
 * type of toaste that you want to show message (ex: if success type="SUCCESS", 
 * error type="DANGER", info type="INFO", warning type="WARNING")
 * @param {string} message, message yuo want out put
 * @param {Node} container, node who will be contain your toaster
 * 
 */
function toaster(type,message,container) {
    let div = document.createElement("div");
    const divClass = "toaster_custom notification-toster " + type.toLowerCase();
    div.setAttribute("class",divClass );
    
    let span = document.createElement("span")
    span.setAttribute("class","span-toaster");
    span.innerText=message
    let color = "#28a745"
    switch (type) { 
        case "SUCCESS": {
            color = "#28a745"
            break;
        }
        case "ERROR": {
            
            color = "#E3000B"
            break;
        }
        case "INFO": {
            
            color = "#2E9AFE"
            break;
        }
        case "WARNING": {
            
            color = "#FFFF00"
            break;
        }
        default: {
            
            color = "#28a745"
            break;
        }

    }
    div.appendChild(span)
    container.appendChild(div);
    div.style.background= color
    // setTimeout(container.removeChild(div),3000)
}

function displayContact(element){
    element.style.display="none"
    element.nextElementSibling.style.display = "";
}

function createMiniCMZloading(){
    return `
        <div class="mini_chargement_content mini_chargement_content_js_jheo" id="toggle_chargement">
            <div class="containt">
                <div class="word word-1">C</div>
                <div class="word word-2">M</div>
                <div class="word word-3">Z</div>
            </div>
        </div>
    `
}



function pagginationModule(parentSelector, childSelector, numberPerPage){

    const parentHTML= document.querySelector(parentSelector);
    const allChildHtml= document.querySelectorAll(childSelector);

    
    for(let i = 0; i < allChildHtml.length; i++){
        if( i + 1  > numberPerPage ){
            if(!allChildHtml[i].classList.contains("hidden")){
                allChildHtml[i].classList.add("hidden");
            }
        }else{
            if(allChildHtml[i].classList.contains("hidden")){
                allChildHtml[i].classList.remove("hidden");
            }
        }
    }


    const countPage= Math.ceil(allChildHtml.length / numberPerPage);

    ////create pagination footer
    if( !parentHTML.querySelector(".content_pagination_js_jheo")){

        const contentPagination= document.createElement("div");
        const disabled= countPage === 1 ? "disabled" : "";

        contentPagination.className = "content_pagination content_pagination_js_jheo";
        contentPagination.innerHTML = `
            <ul class="pagination">
                <li class="page-item prec_btn prec_btn_js_jheo disabled">
                    <a class="page-link user_select_None" href="#" tabindex="-1" aria-disabled="true">
                        Précédent
                    </a>
                </li>

                <li class="page-item">
                    <a class="page-link user_select_None disabled current_page_js_jheo" href="#" id="current-page">
                        1/${countPage}
                    </a>
                </li>
                
                <li class="page-item next_btn nex_btn_js_jheo ${disabled}">
                    <a class="page-link user_select_None" href="#">
                        Suivant
                    </a>
                </li>
            </ul>
        `
         ////create pagination footer
        parentHTML.appendChild(contentPagination)
    }


    document.querySelector(".prec_btn_js_jheo").addEventListener("click", (e)=> {
        e.preventDefault();

        if(!document.querySelector(".prec_btn_js_jheo").classList.contains("disabled") ){

            let current_page = parseInt(document.querySelector(".current_page_js_jheo").textContent.split("/")[0])
            let maxPage = parseInt(document.querySelector(".current_page_js_jheo").textContent.split("/")[1]);

            document.querySelector(".current_page_js_jheo").innerText = `${current_page - 1}/${maxPage}`;
            
            if(document.querySelector(".nex_btn_js_jheo").classList.contains("disabled") ){
                document.querySelector(".nex_btn_js_jheo").classList.remove("disabled")
            }

            const startStep= (current_page-2) * numberPerPage;
            const endStep= (current_page-1) * numberPerPage;
            console.log(startStep, endStep);
            updateList(startStep,endStep,allChildHtml);

            if( current_page - 1 === 1 ){
                document.querySelector(".prec_btn_js_jheo").classList.add("disabled") 
            }
        }
    })


    document.querySelector(".nex_btn_js_jheo").addEventListener("click", (e)=> {
        e.preventDefault();
        if(!document.querySelector(".nex_btn_js_jheo").classList.contains("disabled") ){
            const current_page = parseInt(document.querySelector(".current_page_js_jheo").textContent.split("/")[0])
            const maxPage = parseInt(document.querySelector(".current_page_js_jheo").textContent.split("/")[1]);

            document.querySelector(".current_page_js_jheo").innerText = `${current_page + 1}/${maxPage}`;
            
            if(document.querySelector(".prec_btn_js_jheo").classList.contains("disabled") ){
                document.querySelector(".prec_btn_js_jheo").classList.remove("disabled")
            }

            const startStep= current_page * numberPerPage;
            const endStep= (current_page+1) * numberPerPage;

            updateList(startStep,endStep,allChildHtml);


            if( current_page + 1 === maxPage ){
                document.querySelector(".nex_btn_js_jheo").classList.add("disabled") 
            }
        }
    })



    function updateList(startStep,endStep,allChildHtml){

        if( !document.querySelector(".alphabet_active")){
            for(let i = 0; i < allChildHtml.length; i++){
                if( startStep > i || i + 1 > endStep ){ 
                    if(!allChildHtml[i].classList.contains("hidden")){
                        allChildHtml[i].classList.add("hidden");
                    }
                }else{
                    if(allChildHtml[i].classList.contains("hidden")){
                        allChildHtml[i].classList.remove("hidden");
                    }
                }
            }
    
        }else{
            console.log("tatara hafa")
            const alphabet_active= document.querySelector(".alphabet_active").innerText.toLowerCase();

            // all_card_elements[i].querySelector(".name_to_filter_js_jheo").innerText.charAt(0).toLowerCase() !== letter.toLowerCase()
        }
    }

}


function openMenu(){

		let leftInvitation = document.querySelector("#container-mobile")

		let style = leftInvitation.currentStyle || window.getComputedStyle(leftInvitation);

		//let marginLeft = style.marginLeft

		if(style.marginLeft == "70px"){
			//leftInvitation.style = "margin-left :30px !important"
			//console.log("margin-left : 70px")
			if(document.querySelector(".demande")){
				document.querySelector(".demande").style = "width:95vw !important"
			}
			if(document.querySelector(".invitation-conf")){
				document.querySelector(".invitation-conf").style = "width:95vw !important"
			}
			if(document.querySelector("#contenus")){
				document.querySelector("#contenus").style = "width:95vw !important"
			}
			if(document.querySelector(".content_right_profil")){
				document.querySelector(".content_right_profil").style = "margin-left:-42px !important;width:110vw !important"
			}
			if(document.querySelector(".content_right_actualite")){
				document.querySelector(".content_right_actualite").style = "margin-left:0px !important;width:100vw !important"
			}
			if(document.querySelector(".right_content")){
				document.querySelector(".right_content").style = "margin-left:-15% !important; width:90vw !important"
				leftInvitation.style = "margin-left :0px !important;"
			}
			if(document.querySelector(".listTribu_t_mobile")){
				document.querySelector(".listTribu_t_mobile").style = "margin-left:0px !important"
			}
			if(document.querySelector(".tribuT_mobile")){
				document.querySelector(".tribuT_mobile").style = "margin-left:0px !important; margin-right: 10px !important;width: 90% !important"
			}
			if(document.querySelector(".tribuT_form")){
				document.querySelector(".tribuT_form").style = "margin-left:-20px !important;margin-right: 10px !important;width: 100% !important"
			}
			if(document.querySelector(".setting_mobile")){
				document.querySelector(".setting_mobile").style = "margin-left:10px !important;margin-right: 10px !important;width: 100% !important"
			}
			if(document.querySelector(".securityForm")){
				document.querySelector(".securityForm").style = "margin-left:0px !important;margin-right: 10px !important;width: 100% !important"
			}
			if(document.querySelector(".security_mobile")){
			document.querySelector(".security_mobile").style = "width: 95vw !important"
			}
			if(document.querySelector(".col_confidentialite")){
				document.querySelector(".col_confidentialite").style = "margin-left:-7px !important;margin-right: 10px !important;width: 100% !important"
			}
			if(document.querySelector(".container-invitation")){
				document.querySelector(".container-invitation").style = "margin-left:25px !important;margin-right: 10px !important;width: 100% !important"
			}
			if(document.querySelector(".membre-tribut")){
				document.querySelector(".membre-tribut").style = "margin-left:0px !important;width: 100% !important"
			}
			if(document.querySelector(".detail_agenda_mobile")){
				document.querySelector(".detail_agenda_mobile").style = "margin-left:-10px !important;width: 100% !important"
			}
			if(document.querySelector(".card_mobile")){
				document.querySelectorAll(".card_mobile").forEach(element => {
					if(element.style.marginLeft=="0px"){
						element.style = "margin-left:70px !important; margin-top:60px !important"
						document.querySelector(".content_block_messages").style = "margin-left:70px !important"
					}else{
						element.style = "margin-left:0px !important; margin-top:60px !important"
						document.querySelector(".content_block_messages").style = "margin-left:0px !important"
					}
					
				});
				// document.querySelector(".card-body").style = "margin-left:0px !important; margin-top:60px !important"
			}
			
		}else{
			console.log("margin-left : 0px")
			leftInvitation.style = "margin-left :70px !important;"
			if(document.querySelector(".invitation-conf")){
				document.querySelector(".invitation-conf").style = "width:85vw !important"
			}
			if(document.querySelector(".demande")){
				document.querySelector(".demande").style = "width:85vw !important"
			}
			if(document.querySelector("#contenus")){
				document.querySelector("#contenus").style = "width:85vw !important"
			}
			if(document.querySelector(".content_right_profil")){
				document.querySelector(".content_right_profil").style = "left:-60px;margin-left:70px !important;width:95vw !important"
			}
			if(document.querySelector(".content_right_actualite")){
				document.querySelector(".content_right_actualite").style = "left:-25px;margin-left:70px !important;width:90vw !important"
			}
			 if(document.querySelector(".right_content")){
				 document.querySelector(".right_content").style = "margin-left:70px !important; width:95vw !important;  margin-right: 15px !important;"
			 
			 }
			 if(document.querySelector(".listTribu_t_mobile")){
				document.querySelector(".listTribu_t_mobile").style = "margin-left:70px !important"
			}
			if(document.querySelector(".tribuT_mobile")){
				document.querySelector(".tribuT_mobile").style = "margin-left:-23px !important;"
			}
			if(document.querySelector(".tribuT_form")){
				document.querySelector(".tribuT_form").style = "margin-left:15px !important;width: 90% !important"
			}
			if(document.querySelector(".setting_mobile")){
				document.querySelector(".setting_mobile").style = "margin-left:0px !important;margin-right: 10px !important;width: 100% !important"
			}
			if(document.querySelector(".security_mobile")){
				document.querySelector(".security_mobile").style = "margin-left:0px !important;margin-right: 85px !important;width: 98% !important"
			}
			if(document.querySelector(".col_confidentialite")){
				document.querySelector(".col_confidentialite").style = "margin-left:-7px !important;margin-right: 10px !important;width: 95% !important"
			}
			if(document.querySelector(".confidentialite_mobile")){
				document.querySelector(".confidentialite_mobile").style = "margin-left:10px !important;margin-right: 10px !important;width: 95% !important"
			}
			if(document.querySelector(".card_mobile")){
				document.querySelectorAll(".card_mobile").forEach(element => {
					if(element.style.marginLeft=="0px"){
						element.style = "margin-left:70px !important; margin-top:60px !important"
						document.querySelector(".content_block_messages").style = "margin-left:70px !important"
					}else{
						element.style = "margin-left:0px !important; margin-top:60px !important"
						document.querySelector(".content_block_messages").style = "margin-left:0px !important"
					}
					
				});
				// document.querySelector(".card-body").style = "margin-left:70px !important; margin-top:60px !important"
				
			}
			if(document.querySelector(".tribut_t_reponsive")){
				document.querySelector(".tribut_t_reponsive").style = "margin-left:0px !important"
			}

			if(document.querySelector(".detail_agenda_mobile")){
				document.querySelector(".detail_agenda_mobile").style = "margin-left:-10px !important;width: 100% !important"
			}
			if(document.querySelector(".detail_agenda_mobile_cont")){
				document.querySelector(".detail_agenda_mobile_cont").style = "margin-left:-10px !important;width: 100% !important"
			}
			
		}
}
    

/**
 * All add input image
 * @parm inputImage.html.twig
 */
function readURL(input) {

    // document.querySelector('.image_upload_jheo_js')
    if (input.files && input.files[0]) {
        
        const listExt= ['jpg', 'jpeg', 'png'];
        // const octetMax= 4096e+3; // 4Mo
        const octetMax= 2097152; //2Mo

        var reader = new FileReader();
        
        reader.onload = function (e) {

            if( !checkFileExtension(listExt,e.target.result)){

                swal({
                    title: "Le format de fichier n\'est pas pris en charge!",
                    text: "Le fichier autorisé doit être une image.",
                    icon: "error",
                    button: "OK",
                  });

            }else{
                if(!checkTailleImage(octetMax, e.target.result)){
                    swal({
                        title: "Le fichier est trop volumineux!",
                        text: "La taille de l\'image doit être inférieure à 2Mo.",
                        icon: "error",
                        button: "OK",
                      });
                    
                }else{
                    $('.image-upload-wrap').hide();
                    $('.image-upload-image').attr('src', e.target.result);
                    $('.image_upload_image_jheo_js').show();
                    $('.image-upload-content').show();
                }
                
            }

        };

        // reader.onload = function (e) {

        //     if( !checkFileExtension(listExt,e.target.result)  || !checkTailleImage(octetMax, e.target.result)){
        //         // $('.image-upload-wrap').hide();
        //         $(".image-upload-wrap").css("border","2px dashed red");
        //         $(".drag_text_jheo_js").html("<p class='text-danger erreur_type_jheo_js'>Le format de fichier ou la taille n'est pas pris en charge.</p>");
        //         $('.image_upload_image_jheo_js').hide();
        //         $(".remove_image_upload_jheo_js").text("Supprimer et changer ?");
        //     }else{
        //         $('.image-upload-wrap').hide();
        //         $('.image-upload-image').attr('src', e.target.result);
        //         $('.image_upload_image_jheo_js').show();
        //     }

        //     $('.image-upload-content').show();

        // //   $('.image-title').html(input.files[0].name);
        // };

        reader.readAsDataURL(input.files[0]);
    } else {
        removeUpload();
    }
}

/**
 * All remove input image
 * @parm inputImage.html.twig
 */
function removeUpload() {
    $('.image-upload-input').replaceWith($('.image-upload-input').clone());
    $('.image-upload-content').hide();
    $('.image-upload-wrap').show();

    $(".image-upload-wrap").css("border","2px dashed #878787");

    $(".drag_text_jheo_js").html(`
        <img src="/assets/image/uplaodIcon.png" alt="background upload file">
        <h3 class="text_upload_image_jheo_js">Faites glisser et déposez un fichier ou sélectionnez ajouter une image</h3>
    `);
    $(".remove_image_upload_jheo_js").text("Change l'image");

    document.querySelector(".image_upload_input_jheo_js").value = null
    
    $('.image_upload_input_jheo_js').click();
}


$('.image-upload-wrap').bind('dragover', function () {
    $('.image-upload-wrap').addClass('image-dropping');
});

$('.image-upload-wrap').bind('dragleave', function () {
    $('.image-upload-wrap').removeClass('image-dropping');
});
 

function updateVisibility(element){
    let pub_id = element.dataset.id
    let tablePub = element.dataset.name + "_publication"
    let confidentialite = element.previousElementSibling ? 2 : 1

    if(!element.classList.contains("active")){
        const param = {
            tablePub : tablePub,
            pub_id : pub_id,
            confidentialite : confidentialite
        }

        if(element.previousElementSibling){
            if(element.previousElementSibling.classList.contains("active")){
                element.previousElementSibling.classList.remove("active")
            }
        }else{
            if(element.nextElementSibling.classList.contains("active")){
                element.nextElementSibling.classList.remove("active")
            }
        }

        element.classList.add("active")
    
        const request = new Request("/user/publication/tribu/update/visibility", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'  
            },
            body: JSON.stringify(param)
        })
    
        fetch(request)
        .then(response=>response.json())
        .then(message=>{
            if(confidentialite == 1){
                element.parentElement.previousElementSibling.innerHTML = `<i class="fa-solid fa-earth-oceania"></i>`
            }else if(confidentialite == 2){
                element.parentElement.previousElementSibling.innerHTML = `<i class="bi bi-lock-fill"></i>`
            }
            // showAlertMessageFlash(message);
        })
    }
}

/**
 * @Authord <Jehovanie RAMANDRIOJEL <jehovanieram@gmail.com>
 * 
 * verifier l'extension de fichier par un tableux de type accepter
 * 
 * @param {*} array_ext_Accepcted : Tabeaux list des extension de fichier accepter
 * @param {*} file_base64 : string base 64
 * 
 * @returns : true: si l'extension est parmit les accepter, false sinon 
 */
function checkFileExtension(array_ext_Accepcted, file_base64 ){

    // const error_file= file_base64.error;
    // const dataType=(file_base64.result !== null && file_base64.result !== "") ? file_base64.result.split(';')[0] : null;
    const dataType=(file_base64 !== null && file_base64 !== "") ? file_base64.split(';')[0] : null;

    if( dataType === null ){
        return false
    }

    const typeFile= dataType.split('/')[dataType.split('/').length -1 ];
    return array_ext_Accepcted.some(item => item.trim().toLowerCase() === typeFile.trim().toLowerCase());
}

/**
 * @Authord <Jehovanie RAMANDRIOJEL <jehovanieram@gmail.com>
 * 
 * Veirifier la taille de fichier 
 * 
 * @param {*} maxOctetAccepted  max taille en octet accepted
 * @param {*} file_base64  string base 64
 * @returns : true: si la taille est ok, false sinon 
 */
function checkTailleImage(maxOctetAccepted, file_base64){
    // const dataType= file_base64.result;
    const base64Data = file_base64.split(',')[1];

    // Calculer la taille en octets
    const padding = (base64Data.length % 4 === 0) ? 0 : (4 - base64Data.length % 4);
    const sizeInBytes = ((base64Data.length + padding) * 3 / 4);
    console.log("sizeInBytes : ", sizeInBytes)
    return (sizeInBytes < maxOctetAccepted ) ? true : false;
}


function injectStatusGolf(){
    if( !document.querySelector(".content_right_side_body_jheo_js")){
        console.log("Selector not found : '.content_right_side_body_body'")
        return false;
    }
    document.querySelector(".content_right_side_body_jheo_js").innerHTML = `
        <div class="right_side_body right_side_body_jheo_js">
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Icon</th>
                    
                        <th scope="col">Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th scope="row">1</th>
                        <td><img class="icon_golf_legend" src="/public/assets/icon/NewIcons/icon-blanc-golf-vertC.png" alt="Icon Golf"></td>
                        
                        <td>Mon Golf</td>
                    </tr>
                    <tr>
                        <th scope="row">2</th>
                        <td><img class="icon_golf_legend" src="/public/assets/icon/NewIcons/icon-blanc-golf-vert-badgeC.png" alt="Icon Golf"></td>

                        <td>A faire</td>
                    </tr>
                    <tr>
                        <th scope="row">3</th>
                        <td><img class="icon_golf_legend" src="/public/assets/icon/NewIcons/icon-blanc-golf-vert-bC.png" alt="Icon Golf"></td>

                        <td>Fait</td>
                    </tr>
                    <tr>
                    <th scope="row">4</th>
                        <td><img class="icon_golf_legend" src="/public/assets/icon/NewIcons/icon-blanc-golf-vertC.png" alt="Icon Golf"></td>
                        
                        <td>Inconnu</td>
                    </tr>
                </tbody>
            </table>
        </div>
    `
}


function injectStatusResto(){
    if( !document.querySelector(".content_right_side_body_jheo_js")){
        console.log("Selector not found : '.content_right_side_body_body'")
        return false;
    }
    document.querySelector(".content_right_side_body_jheo_js").innerHTML = `
        <div class="right_side_body right_side_body_jheo_js">
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Icon</th>
                    
                        <th scope="col">Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th scope="row">1</th>
                        <td><img class="icon_resto_legend" src="/assets/icon/NewIcons/icon-resto-new-B.png" alt="Icon Resto"></td>
                        
                        <td>Les restaurants non pastillés</td>
                    </tr>
                    <tr>
                        <th scope="row">2</th>
                        <td><img class="icon_resto_legend" src="/public/assets/icon/NewIcons/icon-resto-new-B-org-single.png" alt="Icon Resto"></td>

                        <td>Les restaurants pastillés par une seule tribu T.</td>
                    </tr>
                    <tr>
                        <th scope="row">3</th>
                        <td><img class="icon_resto_legend" src="/public/assets/icon/NewIcons/icon-resto-new-B-vert-multi.png" alt="Icon Resto"></td>

                        <td>Les restaurants pastillés par plusieurs tribus T.</td>
                    </tr>
                </tbody>
            </table>
        </div>
    `
}

function injectChooseCouch(){
    if( !document.querySelector(".content_right_side_body_jheo_js")){
        console.log("Selector not found : '.content_right_side_body_body'")
        return false;
    }
    document.querySelector(".content_right_side_body_jheo_js").innerHTML= `
        <div class="right_side_body right_side_body_jheo_js">
            <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="region">
                <label class="form-check-label" for="region">
                    REGION
                </label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="commune">
                <label class="form-check-label" for="commune">
                    COMMUNE
                </label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="departement">
                <label class="form-check-label" for="departement">
                    DEPARTEMENT
                </label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="iris" >
                <label class="form-check-label" for="iris">
                    IRIS
                </label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="quartierDeVie" >
                <label class="form-check-label" for="quartierDeVie">
                    QUARTIER DE VIE
                </label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="canton" >
                <label class="form-check-label" for="canton">
                    CANTON
                </label>
            </div>
        </div>
    `
}

function removePublication(pubId, tablePub){

    document.querySelector('.confirm_delete_pub_jheo_js').addEventListener('click',() => {
        deletePublication(pubId, tablePub);
    })
}

function deletePublication(pubId, tablePub){
    const param = {
        tablePub : tablePub + "_publication",
        pub_id : pubId,
    }
    const request = new Request('/user/publication/tribu/delete', {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'  
        },
        body: JSON.stringify(param)
    })

    fetch(request)
        .then(response=>response.json())
        .then(response =>{
            let status= "danger";
            if(response.success){
                document.querySelector(`.pub_${tablePub}_${pubId}_jheo_js`).remove();
                status= "success";
            }
            closeModal();
            showAlertMessageFlash(response.message, status);
        })
}


function getAllComment(pubId, tablePub, userOwnID){

    const content_comments = document.querySelector('.content_all_comment_jheo_js');

    content_comments.innerHTML =  createMiniCMZloading();

    //// initialize all event for new comment
    pushNewComment(pubId, tablePub, userOwnID );

    const param = {
        tablePub : tablePub,
        pub_id : pubId,
    }
    const request = new Request('/user/publication/tribu/comment', {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'  
        },
        body: JSON.stringify(param)
    })

    fetch(request)
    .then(response=>response.json())
    .then(response =>{
        // console.log(response.comments)

        if( response.comments.length > 0 ){
            let listLIcomment = "";
            const comments = response.comments.reverse();

            comments.forEach(comment => {
                const pdp = (comment.user.photo !== null) ? comment.user.photo.replace("/public", "") : '/uploads/users/photos/default_pdp.png';
                listLIcomment += `
                    <li id='pub_${comment.pub_id}_comment_${comment.comment_id}' class="nr h lc rg mg qh sq js yk mb-2 show_single_msg_popup_jheo_js" data-toggle-other-id='10000'>
                        <div class="h sa wf uk th ni ej">
                            <a href="#"> <img class="profil_publication" src="${pdp}" alt="User"/> </a>
                            <span class="g l m xe qd th pi jj sj ra"></span>
                        </div>
                        <div>
                            <h6 class="un zn gs">
                               <p>${comment.user.fullname}</p>-<cite class="fontSize06">${comment.dateTime}</cite>
                            </h6>
                            <p class="hc">
                               ${comment.text_comment}
                            </p>
                        </div>
                    </li>
                `
            });

            content_comments.innerHTML = listLIcomment;


        }else{
            content_comments.innerHTML = `
                <li id='45' class="nr h lc rg mg qh sq js yk bg-light text-danger alert_comment_not_exist_jheo_js" data-toggle-other-id='10000'>
                    <p>Il n'y pas encore de commentaires sur cette publication.</p
                </li>
            `
        }
    })


}


function pushNewComment(pubId, tablePub, userOwnID){

    // const publicationItems= document.querySelector(`.pub_${tablePub}_${pubId}_jheo_js`)
    const btn_persitNewComment = document.querySelector('.cta_persitNewComment_jheo_js');

    document.querySelector('.textarea_content_jheo_js').addEventListener('input',() => {
        document.querySelector('.textarea_content_jheo_js').style.border= '1px solid black';
        if( document.querySelector(".invalid_jheo_js").classList.contains("d-block")){
            document.querySelector(".invalid_jheo_js").classList.remove("d-block")
        }
    })

    if(btn_persitNewComment){
        btn_persitNewComment.setAttribute('onclick',`persistCommment('${pubId}', '${tablePub}', '${userOwnID}')`)
    }

    // btn_persitNewComment.addEventListener('click',() => {
    //     if(document.querySelector('.textarea_content_jheo_js').value.length > 1 ){
    //         persistCommment(pubId, tablePub, userOwnID)
    //     }
    //     // else {
    //     //     document.querySelector('.textarea_content_jheo_js').style.border= '1px solid red';
    //     // }
    // })

    // document.querySelector('.textarea_content_jheo_js').addEventListener('keyup', (e) => {
    //     if (e.code === "Enter" || e.code === "NumpadEnter") {
    //         btn_persitNewComment.click();
    //     }
    // })

}


function persistCommment(pubId, tablePub, userOwnID){
    const text= document.querySelector('.textarea_content_jheo_js').value;
    
    if( text.length > 1){

        if(!document.querySelector('.information_user_conected_jheo_js')){
            console.log("Selector not found: 'information_user_conected_jheo_js'")
            return false
        }

        const currentUser= document.querySelector('.information_user_conected_jheo_js')
        const userInformations= {
            "fullName" : currentUser.getAttribute('data-userFullName'),
            "profil" : currentUser.getAttribute('data-profil')
        }
    
        handleNewComment(userInformations,text)
    
        document.querySelector('.textarea_content_jheo_js').value= null
    
        const param = { /// $tablePub, $pubID, $authorID, $comment, $audioname
            tablePub : tablePub,
            pubID : pubId,
            authorID: userOwnID,
            comment: text,
            audioname : "",
        }
        const request = new Request('/user/publication/tribu/push_comment', {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'  
            },
            body: JSON.stringify(param)
        })
    
        fetch(request)
        .then(response=>response.json())
        .then(response =>{
            ///change status comment
            const content_loading = document.querySelector(".content_loading_jheo_js");
            content_loading.innerHTML = "<i class='fa-solid fa-check'></i>";

            const publicationItems= document.querySelector(`.pub_${tablePub}_${pubId}_jheo_js`);
            const old_nbr_comment=  publicationItems.querySelector(".nbr_comment_jheo_js").innerText.split(" ")[0];
            const new_nbr_comment= parseInt(old_nbr_comment, 10) + 1
            publicationItems.querySelector(".nbr_comment_jheo_js").innerText= new_nbr_comment > 1  ? `${new_nbr_comment} commentaires` : `${new_nbr_comment} commentaire`;

            setTimeout(() => {
                content_loading.parentElement.removeChild(content_loading);
            }, 2000);
        }).catch(error => {
            console.log(error)
            const content_loading = document.querySelector(".content_loading_jheo_js");
            content_loading.innerHTML = "<i class='fa-solid fa-circle-exclamation loading error_message_status'></i>";
        })
    }else{
        document.querySelector('.textarea_content_jheo_js').style.border= '1px solid red';
        document.querySelector(".invalid_jheo_js").classList.add("d-block")
    }

}

function handleNewComment(userInformations, comment){
    
    const content_comment= document.createElement('li');
    content_comment.className="nr h lc rg mg qh sq js yk mb-2 gray400 show_single_msg_popup_jheo_js";
    content_comment.setAttribute('id', 'tempID');
    content_comment.setAttribute('title', userInformations.fullname);

    content_comment.innerHTML= `
        <div class="h sa wf uk th ni ej">
            <a href="#"> <img class="profil_publication" src="${userInformations.profil !== "" ? userInformations.profil : '/uploads/users/photos/default_pdp.png'}" alt="User"/> </a>
            <span class="g l m xe qd th pi jj sj ra"></span>
        </div>

        <div>
            <h6 class="un zn gs">
                ${userInformations.fullName}
            </h6>
            <p class="mn hc">
                ${comment}
            </p>
        </div>
        <div class="content_loading content_loading_jheo_js">
            <i class='fa-solid fa-spinner loading'></i>
        </div>
    `
    if(document.querySelector(".alert_comment_not_exist_jheo_js")){
        document.querySelector(".alert_comment_not_exist_jheo_js").remove();
    }

    document.querySelector('.content_all_comment_jheo_js').prepend(content_comment);
    document.querySelector(".content_all_comment_jheo_js").scrollTop=0;
}

function showAlertMessageFlash(text, status="success", isReload=false){

    const body= document.querySelector('.content_modal_alert_jheo_js');
    const className= (status === "success" ) ? "alert-primary" : "alert-danger";

    body.classList.add(className);
    body.innerText= text;

    document.querySelector('.alert_flash_jheo_js').click();

    setTimeout(() => {
        document.querySelector('.close_alertFlashModal_jheo_js').click();
        body.classList.remove(className);
        body.innerText = "";

        if( isReload){
            window.location.reload();
        }
    },1500)
}

function closeModal(){
    document.querySelector(".close_modal_jheo_js").click();
}


function checkIfExist(classSelector){
    if(!document.querySelector(`.${classSelector}`)){
        console.log(('Selecteur perdu!!!'))
        return false;
    }
}

function showTribuTForRestoPast(element){
    element.parentElement.style.display = "none"
    document.querySelector("#containerPastilleResto").style.display = "block"
    let container = document.querySelector("#content_detail_resto_js_jheo") ? document.querySelector("#content_detail_resto_js_jheo") : document.querySelector("#content_details_home_js_jheo")
    scrollBottom(container)
}

function annulePastille() {
    document.querySelector("#containerPastilleResto").style.display = "none"
    document.querySelector("#btnPastilleCarte").parentElement.style.display = "block"
    if (document.querySelector(".confirmPast").hasAttribute("data-tbname")) {
        document.querySelector(".confirmPast").removeAttribute("data-tbname");
    }
    document.querySelector(".confirmPast").disabled = true
    document.querySelector(".selectTribuForPast").value = "0"
}

function selectTribuForPast(e) {
    let index = e.target.selectedIndex
    let btn = document.querySelector(".confirmPast")
    if(index != 0){
        btn.disabled = false
        btn.dataset.tbname = e.target.value
    }else{
        btn.disabled = true
        if (btn.hasAttribute("data-tbname")) {
            btn.removeAttribute("data-tbname");
        }
    }
}

function scrollBottom(element) {
    element.scrollTop = element.scrollHeight;
}

function bindDataUpdatePub(table, id){
    
    const publication= document.querySelector(`.pub_${table}_${id}_jheo_js`)
    if(!publication){
        console.log(`Selector not found: pub_${table}_${id}_jheo_js`)
        return false;
    }

    document.querySelector(".desc_update_jheo_js").value = publication.querySelector(".pub_description_jheo_js").innerText;

    const tribu_Name= publication.querySelector(".tribu_name_jheo_js").innerText;
    const content_input_tribuT_name= document.querySelector(".content_input_name_tribuT_jheo_js");
    let tribuType= "";
    if( tribu_Name.includes("Tribu T") ){
        if(content_input_tribuT_name.classList.contains("d-none")){
            content_input_tribuT_name.classList.remove("d-none")
        }
        tribuType= "Tribu T";
        document.querySelector(".input_name_tribuT_jheo_js").value= tribu_Name;

    }else{
        if(!content_input_tribuT_name.classList.contains("d-none")){
            content_input_tribuT_name.classList.add("d-none")
        }
        tribuType= "Tribu G";
    }
    document.querySelector(".input_disable_tribu_jheo_js").value = tribuType;

    const config_pub= publication.querySelector(".config_jheo_js").getAttribute("data-confid");
    document.querySelectorAll(".config_update_jheo_js").forEach(item => {
        if(parseInt(item.getAttribute("value")) === parseInt(config_pub) ){
            item.setAttribute("selected" , "");
        }
    })


    if( publication.querySelector(".pub_image_jheo_js")){
        const link_image= publication.querySelector(".pub_image_jheo_js").getAttribute("src");
        document.querySelector(".image_upload_update_jheo_js").setAttribute("src", link_image);
        
        if(document.querySelector(".content_image_upload_jheo_js").classList.contains("d-none")){
            document.querySelector(".content_image_upload_jheo_js").classList.remove("d-none")
        }
    }else{
        if(!document.querySelector(".content_image_upload_jheo_js").classList.contains("d-none")){
            document.querySelector(".content_image_upload_jheo_js").classList.add("d-none")
            document.querySelector(".image_upload_update_jheo_js").setAttribute("src","#");
        }
    }

}

function pastilleRestoForTribuT(element){
    let id = element.dataset.id
    let name = element.dataset.name
    let tbl = element.dataset.tbname
    let data = {
        id : id,
        name : name,
        tbl : tbl
    }
   
    const request = new Request("/user/tribu_t/pastille/resto", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'  
        },
        body: JSON.stringify(data)
    })
    fetch(request)
            .then(response=>response.json())
            .then(message=>{
                tbl = tbl.replace(/tribu_t_[0-9]+_/, "").replaceAll("_", " ")
                tbl = tbl.charAt(0).toUpperCase() + tbl.slice(1)

                let html = `<td class="col-action">
                                <button type="button" class="mx-2 btn btn-secondary" disabled="">Pastillé</button>
                            </td>`
                let tribuName = element.dataset.tribu
                let img = document.createElement("img")
                img.src = element.dataset.velona
                img.dataset.name = tribuName
                img.setAttribute("alt",tribuName)
                let div = document.createElement("div")
                div.setAttribute("onclick","createPopUp(event)")
                div.setAttribute("onmouseout","resetImage(event)")
                div.setAttribute("onmouseover","agrandirImage(event)")
                div.setAttribute("class","img_nantenaina")
                div.setAttribute("title","Tribu T " + tribuName)
                div.setAttribute("data-bs-toggle","tooltip")
                div.setAttribute("data-bs-placement","top")
                div.dataset.name = tribuName
                div.appendChild(img)
                new swal("Succès !", "Restaurant pastillé avec succès", "success")
                .then((value) => {
                    updateBtnStatus(element, html)
                    document.querySelector(".mainContainerLogoTribu").appendChild(div);
                    reorganisePastille()
                });
                
            })
            .catch(error=>console.log(error))
}


function slideToRight(elem, html) {
        elem.parentElement.style.display = "none"
        elem.parentElement.parentElement.innerHTML = html
}

function updateBtnStatus(elem, html) {
    elem.parentElement.innerHTML = html
}

function updateTr(elem, html) {
    elem.parentElement.parentElement.innerHTML = html
}

function validateEmail(mail){
let reg = /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gmi
 if (reg.test(mail))
  {
    return true
  }else{
      return false
  }
}



function addListDepartGolf() {
    if (document.querySelector("#open-navleft-golf-mobile-tomm-js")) {
        document.querySelector("#open-navleft-golf-mobile-tomm-js").addEventListener("click", () => {
            document.querySelector("#open-navleft-golf-mobile-tomm-js").style.opacity = 0
            document.querySelector("#open-navleft-golf-mobile-tomm-js").style.transition = "opacity 0.5s ease-in-out";

            if (document.querySelector("#list-depart-golf-mobile-tomm-js")) {
                document.querySelector("#list-depart-golf-mobile-tomm-js").removeAttribute("style")
            }

            fetch(`/golf-mobile`)
            .then(response => response.text())
            .then(r => {
                if (document.querySelector("#list-depart-golf-mobile-tomm-js")) {
                    document.querySelector("#list-depart-golf-mobile-tomm-js").innerHTML = null
                    document.querySelector("#list-depart-golf-mobile-tomm-js").innerHTML = r

                    document.querySelector("#close-golf-dep").addEventListener('click', () => {
                        document.querySelector("#list-depart-golf-mobile-tomm-js").style = "transform: translateX(-100vw);display: none;"
                        document.querySelector("#open-navleft-golf-mobile-tomm-js").style.opacity = 1
                    })
                }
            })
        })
    }
    
}



function addSpecificgolfMobile(nom_dep, id_dep) {
    if(document.querySelector("#open-navleft-golf-mobile-specific-tomm-js")){
        document.querySelector("#open-navleft-golf-mobile-specific-tomm-js").style.opacity = 0
        document.querySelector("#open-navleft-golf-mobile-specific-tomm-js").style.transition = "opacity 0.5s ease-in-out";
    
        if (document.querySelector("#list-depart-golf-specific-mobile-tomm-js")) {
            document.querySelector("#list-depart-golf-specific-mobile-tomm-js").removeAttribute("style")
        }
    
        fetch(`/golf-mobile/departement/${nom_dep}/${id_dep}`)
        .then(response => response.text())
        .then(r => {
            if (document.querySelector("#list-depart-golf-specific-mobile-tomm-js")) {
                document.querySelector("#list-depart-golf-specific-mobile-tomm-js").innerHTML = null
                document.querySelector("#list-depart-golf-specific-mobile-tomm-js").innerHTML = r
    
                document.querySelector("#close-golf-specific-tomm-js").addEventListener('click', () => {
                    document.querySelector("#list-depart-golf-specific-mobile-tomm-js").style = "transform: translateX(-100vw);display: none;"
                    document.querySelector("#open-navleft-golf-mobile-specific-tomm-js").style.opacity = 1
                })
            }
        })
    }
   
}

function addListDepartStation() {
    if (document.querySelector("#open-navleft-station-mobile-tomm-js")) {
        document.querySelector("#open-navleft-station-mobile-tomm-js").addEventListener("click", () => {
            document.querySelector("#open-navleft-station-mobile-tomm-js").style.opacity = 0
            document.querySelector("#open-navleft-station-mobile-tomm-js").style.transition = "opacity 0.5s ease-in-out";

            if (document.querySelector("#list-depart-station-mobile-tomm-js")) {
                document.querySelector("#list-depart-station-mobile-tomm-js").removeAttribute("style")
            }

            fetch(`/station-mobile`)
            .then(response => response.text())
            .then(r => {
                if (document.querySelector("#list-depart-station-mobile-tomm-js")) {
                    document.querySelector("#list-depart-station-mobile-tomm-js").innerHTML = null
                    document.querySelector("#list-depart-station-mobile-tomm-js").innerHTML = r

                    document.querySelector("#close-station-dep").addEventListener('click', () => {
                        document.querySelector("#list-depart-station-mobile-tomm-js").style = "transform: translateX(-100vw);display: none;"
                        document.querySelector("#open-navleft-station-mobile-tomm-js").style.opacity = 1
                    })
                }
            })
        })
    }
    
}

function addSpecificStationMobile(nom_dep, id_dep) {
    if(document.querySelector("#open-navleft-station-mobile-specific-tomm-js")){
        document.querySelector("#open-navleft-station-mobile-specific-tomm-js").style.opacity = 0
        document.querySelector("#open-navleft-station-mobile-specific-tomm-js").style.transition = "opacity 0.5s ease-in-out";
    
        if (document.querySelector("#list-depart-station-specific-mobile-tomm-js")) {
            document.querySelector("#list-depart-station-specific-mobile-tomm-js").removeAttribute("style")
        }
    
        fetch(`/station-mobile/departement/${nom_dep}/${id_dep}`)
        .then(response => response.text())
        .then(r => {
            if (document.querySelector("#list-depart-station-specific-mobile-tomm-js")) {
                document.querySelector("#list-depart-station-specific-mobile-tomm-js").innerHTML = null
                document.querySelector("#list-depart-station-specific-mobile-tomm-js").innerHTML = r
    
                document.querySelector("#close-station-specific-tomm-js").addEventListener('click', () => {
                    document.querySelector("#list-depart-station-specific-mobile-tomm-js").style = "transform: translateX(-100vw);display: none;"
                    document.querySelector("#open-navleft-station-mobile-specific-tomm-js").style.opacity = 1
                })
            }
        })
    }
   
}

function addListDepartTabac() {
    if( document.querySelector("#open-navleft-tabac-mobile-tomm-js"))
        document.querySelector("#open-navleft-tabac-mobile-tomm-js").addEventListener("click", () => {
            document.querySelector("#open-navleft-tabac-mobile-tomm-js").style.opacity = 0
            document.querySelector("#open-navleft-tabac-mobile-tomm-js").style.transition = "opacity 0.5s ease-in-out";

            if (document.querySelector("#list-depart-tabac-mobile-tomm-js")) {
                document.querySelector("#list-depart-tabac-mobile-tomm-js").removeAttribute("style")
            }

            fetch(`/tabac-mobile`)
            .then(response => response.text())
            .then(r => {
                if (document.querySelector("#list-depart-tabac-mobile-tomm-js")) {
                    document.querySelector("#list-depart-tabac-mobile-tomm-js").innerHTML = null
                    document.querySelector("#list-depart-tabac-mobile-tomm-js").innerHTML = r

                    document.querySelector("#close-tabac-dep").addEventListener('click', () => {
                        document.querySelector("#list-depart-tabac-mobile-tomm-js").style = "transform: translateX(-100vw);display: none;"
                        document.querySelector("#open-navleft-tabac-mobile-tomm-js").style.opacity = 1
                    })
                }
            })
        })
}

function addListSpecificTabac(nom_dep, id_dep) {
    document.querySelector("#open-navleft-tabac-spec-mobile-tomm-js").style.opacity = 0
    document.querySelector("#open-navleft-tabac-spec-mobile-tomm-js").style.transition = "opacity 0.5s ease-in-out";

    if (document.querySelector("#list-depart-tabac-mobile-spec-tomm-js")) {
        document.querySelector("#list-depart-tabac-mobile-spec-tomm-js").removeAttribute("style")
    }

    fetch(`/tabac-mobile/departement/${nom_dep}/${id_dep}`)
    .then(response => response.text())
    .then(r => {
        if (document.querySelector("#list-depart-tabac-mobile-spec-tomm-js")) {
            document.querySelector("#list-depart-tabac-mobile-spec-tomm-js").innerHTML = null
            document.querySelector("#list-depart-tabac-mobile-spec-tomm-js").innerHTML = r

            document.querySelector("#close-tabac-spec-dep").addEventListener('click', () => {
                document.querySelector("#list-depart-tabac-mobile-spec-tomm-js").style = "transform: translateX(-100vw);display: none;"
                document.querySelector("#open-navleft-tabac-spec-mobile-tomm-js").style.opacity = 1
            })
        }
    })
}

function closeDetailGolfMob(nom_dep, id_dep) {
    location.assign(`/golf/departement/${nom_dep}/${id_dep}`)
}

function selectDepartRestoMobile() {
    if (document.querySelector("#selectDepartRestoTommJs")) {
        const selectOption = document.getElementById("selectDepartRestoTommJs")
        const selectId = selectOption.options[selectOption.selectedIndex].value
        const selectDepName = selectOption.options[selectOption.selectedIndex].getAttribute("data-dep-name")
        if (selectId == "Tous") {
            location.assign(`/restaurant`) 
        } else {
            location.assign(`/restaurant/specific?nom_dep=${selectDepName}&id_dep=${selectId}`) 
        }
    }
}

function selectDepartFermeMobile() {
    if (document.querySelector("#selectDepartFermeTommJs")) {
        const selectOption = document.getElementById("selectDepartFermeTommJs")
        const selectId = selectOption.options[selectOption.selectedIndex].value
        const selectDepName = selectOption.options[selectOption.selectedIndex].getAttribute("data-dep-name")
        if (selectId == "Tous") {
            location.assign(`/ferme`) 
        } else {
            location.assign(`/ferme/departement/${selectDepName}/${selectId}`) 
        }
    }
}

function selectDepartStationMobile() {
    if (document.querySelector("#selectDepartStationTommJs")) {
        const selectOption = document.getElementById("selectDepartStationTommJs")
        const selectId = selectOption.options[selectOption.selectedIndex].value
        const selectDepName = selectOption.options[selectOption.selectedIndex].getAttribute("data-dep-name")
        if (selectId == "Tous") {
            location.assign(`/station`) 
        } else {
            location.assign(`/station/departement/${selectDepName}/${selectId}`) 
        }
    }
}

function selectDepartGolfMobile() {
    if (document.querySelector("#selectDepartGolfTommJs")) {
        const selectOption = document.getElementById("selectDepartGolfTommJs")
        const selectId = selectOption.options[selectOption.selectedIndex].value
        const selectDepName = selectOption.options[selectOption.selectedIndex].getAttribute("data-dep-name")
        if (selectId == "Tous") {
            location.assign(`/golf`) 
        } else {
            location.assign(`/golf/departement/${selectDepName}/${selectId}`) 
        }
    }
}

function selectDepartTabacMobile() {
    if (document.querySelector("#selectDepartTabacTommJs")) {
        const selectOption = document.getElementById("selectDepartTabacTommJs")
        const selectId = selectOption.options[selectOption.selectedIndex].value
        const selectDepName = selectOption.options[selectOption.selectedIndex].getAttribute("data-dep-name")
        if (selectId == "Tous") {
            location.assign(`/tabac`) 
        } else {
            location.assign(`/tabac/departement/${selectDepName}/${selectId}`) 
        }
    }
}
function convertUnicodeToUtf8(str){
    return unescape(str);
}

/**
 * @author Nantenaina
 */
function showPastillTable(e,id){
    document.querySelector(".list_resto_detail_for_pastille > table > tbody").innerHTML=""
    fetch("/restaurant/pastilled/checking/"+parseInt(id)).then(response=>{
        if(response.status=200 && response.ok){
            response.json().then(data=>{
                data.forEach(item=>{
                    console.log(item)
                    let status=item.isPastilled ? "Pastillé" :"Pastiller";
                    let logoPath=item.logo_path ? item.logo_path : "/public/uploads/tribu_t/photo/avatar_tribu.jpg";
                    let tableTribuT=item.table_name; 
                    let nomTribuPars = tableTribuT.replace(/tribu_t_[0-9]+_/, "").replaceAll("_", " ")
                    nomTribuPars = nomTribuPars.charAt(0).toUpperCase() + nomTribuPars.slice(1)
                    let nomTribuT = item.name_tribu_t_muable ? item.name_tribu_t_muable : nomTribuPars
                    let restaurant = e.target.dataset.name
                                    
                    let btn = item.isPastilled ? `<button type="button" class="mx-2 btn btn-secondary" disabled>${status}</button>` : 
                                                `<button type="button" data-id="${id}" data-tribu="${nomTribuT}" data-name="${restaurant}" data-tbname="${tableTribuT}"
                                                class="mx-2 btn btn-success" data-velona='/public${logoPath}' onclick="pastilleRestoForTribuT(this)">${status}</button>`
                    let tr=`<tr style="vertical-align: middle;">
                                <td class="col-logo">
                                    <img style="max-height:70px;max-width:70px;clip-path: circle(40%);" 
                                        src="/public${logoPath}"
                                    alt="">
                                </td>
                                <td class="col-tribuT">${nomTribuT}</td>
                                <td class="col-action">
                                   ${btn}
                                </td>
                            </tr>`
                    $("#restoPastilleModal").modal("show")
                    document.querySelector(".list_resto_detail_for_pastille > table > tbody").innerHTML+=tr
                })
            })
        }
    })
    
}

