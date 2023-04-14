checkScreen();
window.addEventListener('load', () => {
    if( document.querySelector(".content_info_js")){
        const parsedUrl = new URL(window.location.href);
        const type= parsedUrl.searchParams.get("type") ? parsedUrl.searchParams.get("type") : "tous"
        const content_info= document.querySelector(".content_info_js");
        filterByPrice(0,2.5,type, content_info.getAttribute("data-dep-name"), content_info.getAttribute("data-dep-code"))
        
        if( type !== "tous"){
            const tab_type= type.split("@").map(item => item.substring(4).toLocaleLowerCase());
            console.log(tab_type);
            const all_checkboxes= document.querySelectorAll(".checkbox_filter .checkbox");
            Array.from(all_checkboxes).forEach( checkbox => {
                if( !tab_type.includes(checkbox.getAttribute("id"))){
                    checkbox.checked= false;
                }
            })
        }
    }else{
        filterByPrice(0,2.5,"tous")
    }
    
    ///event on resize
    // window.onresize = () => { 
    //     checkScreen() 
    // };

    //// HIDE DETAILS STATION POP UP
    document.querySelector("#close-detail-station").addEventListener("click", () => { 
        document.getElementById("remove-detail-station").setAttribute("class", "hidden")
    })

    setDataInLocalStorage("type", "station");
});


/////CONTENT FILTER FOR STATION ////////////////////////////////////////////////
function checkScreen(){
    if( screen.width < 991){
        ///utilise modal
        document.querySelector(".content_filter_global_jheo_js").innerHTML = "";
        
        document.querySelector(".content_filter_global_modal_jheo_js").innerHTML = `
            <div class="content_checkbox_filter">
                <div class="checkbox_filter">
                    <input class="checkbox" type="checkbox" id="tous_type_filter" value="tous" checked>
                    <label for="tous"> Tous</label>
                </div>
    
                <div class="checkbox_filter">
                    <input class="checkbox" type="checkbox" id="e85" value="prixE85" checked>
                    <label for="e85"> E85</label>
                </div>
                <div class="checkbox_filter">
                    <input class="checkbox" type="checkbox" id="gplc" value="prixGplc" checked>
                    <label for="gplc"> GPLC</label>
                </div>
                <div class="checkbox_filter">
                    <input class="checkbox" type="checkbox" id="sp95" value="prixSp95" checked>
                    <label for="sp95"> SP95</label>
                </div>
                <div class="checkbox_filter">
                    <input class="checkbox" type="checkbox" id="sp95_e10" value="prixSp95E10" checked>
                    <label for="sp95_e10"> SP95_E10</label>
                </div>
                <div class="checkbox_filter">
                    <input class="checkbox" type="checkbox" id="sp98" value="prixSp98" checked>
                    <label for="sp98"> SP98</label>
                </div>
                <div class="checkbox_filter">
                    <input class="checkbox" type="checkbox" id="gasoil" value="prixGasoil" checked>
                    <label for="gasoil"> Gasoil</label>
                </div>
            </div>
            <div class="content_filter_slide_bar">
                <div class="price_input">
                    <div class="field">
                        <span> Min</span>
                        <input type="number" class="input_min" min="0" max="2.5" value="0" step="0.01"> 
                    </div>
    
                    <div class="separator"> - </div>
    
                    <div class="field">
                        <span> Max</span>
                        <input type="number" class="input_max" min="0" max="2.5" value="2.5" step="0.01"> 
                    </div>
                </div>
    
                <div class="slider">
                    <div class="proggress"></div>
                </div>
    
                <div class="range_input">
                    <input type="range" class="range_min" max="2.5" value="0" step="0.01">
                    <input type="range" class="range_max" max="2.5" value="2.5" step="0.01">
                </div>
    
            </div> 
        `
    }else{
        ///utilise current
        document.querySelector(".content_filter_global_jheo_js").innerHTML = `
            <div class="content_checkbox_filter">
                <div class="checkbox_filter">
                    <input class="checkbox" type="checkbox" id="tous_type_filter" value="tous" checked>
                    <label for="tous"> Tous</label>
                </div>
    
                <div class="checkbox_filter">
                    <input class="checkbox" type="checkbox" id="e85" value="prixE85" checked>
                    <label for="e85"> E85</label>
                </div>
                <div class="checkbox_filter">
                    <input class="checkbox" type="checkbox" id="gplc" value="prixGplc" checked>
                    <label for="gplc"> GPLC</label>
                </div>
                <div class="checkbox_filter">
                    <input class="checkbox" type="checkbox" id="sp95" value="prixSp95" checked>
                    <label for="sp95"> SP95</label>
                </div>
                <div class="checkbox_filter">
                    <input class="checkbox" type="checkbox" id="sp95_e10" value="prixSp95E10" checked>
                    <label for="sp95_e10"> SP95_E10</label>
                </div>
                <div class="checkbox_filter">
                    <input class="checkbox" type="checkbox" id="sp98" value="prixSp98" checked>
                    <label for="sp98"> SP98</label>
                </div>
                <div class="checkbox_filter">
                    <input class="checkbox" type="checkbox" id="gasoil" value="prixGasoil" checked>
                    <label for="gasoil"> Gasoil</label>
                </div>
            </div>
            <div class="content_filter_slide_bar">
                <div class="price_input">
                    <div class="field">
                        <span> Min</span>
                        <input type="number" class="input_min" min="0" max="2.5" value="0" step="0.01"> 
                    </div>
    
                    <div class="separator"> - </div>
    
                    <div class="field">
                        <span> Max</span>
                        <input type="number" class="input_max" min="0" max="2.5" value="2.5" step="0.01"> 
                    </div>
                </div>
    
                <div class="slider">
                    <div class="proggress"></div>
                </div>
    
                <div class="range_input">
                    <input type="range" class="range_min" max="2.5" value="0" step="0.01">
                    <input type="range" class="range_max" max="2.5" value="2.5" step="0.01">
                </div>
    
            </div> 
        `
        document.querySelector(".content_filter_global_modal_jheo_js").innerHTML = "";
    }
}

/// FETCH AND ADD DATA STATION WITH FILTER ////////////////////////////////////////////////
function filterByPrice(price_min, price_max, type,nom_dep=null, id_dep=null){
    const geos=[]

    if (id_dep) {
        if (id_dep == 20) {
                for (let corse of ['2A', '2B'])
                     geos.push(franceGeo.features.find(element => element.properties.code == corse))
        } else {
                geos.push(franceGeo.features.find(element => element.properties.code == id_dep))
        }
    }else{
        document.querySelectorAll("#list_departements .element").forEach(item => {
            const dep = item.dataset.toggleDepartId
            if (dep == 20) {
                for (let corse of ['2A', '2B'])
                     geos.push(franceGeo.features.find(element => element.properties.code == corse))
            } else {
                geos.push(franceGeo.features.find(element => element.properties.code == dep))
            }
        })
    }

    fetch("/getLatitudeLongitudeStation/?max="+price_max + "&min="+ price_min+"&type="+ type+"&nom_dep="+ nom_dep +"&id_dep="+id_dep, {
        method: 'get',
    })
        .then(result => result.json())
        .then(parsedResult => {

            ///delete old map
            const cart_map = document.getElementById("map");
            const parent_map = cart_map.parentElement;

            parent_map.removeChild(cart_map);

            // ///generate new map
            const div = document.createElement("div");
            div.setAttribute("id", "map")
            parent_map.appendChild(div);

            ///delete chargement
            var map=create_map_content(geos,id_dep, "station");

            if( parsedResult ){

                /// change the number of result in div
                if( document.querySelector(".content_nombre_result_js_jheo")){
                    document.querySelector(".content_nombre_result_js_jheo").innerText = parsedResult.length;
                }

                /// change the number of result in div for the left translate
                if( document.querySelector(".content_nombre_result_left_js_jheo")){
                    document.querySelector(".content_nombre_result_left_js_jheo").innerText = parsedResult.length;
                }

                var markers = L.markerClusterGroup({ 
                    chunkedLoading: true
                });

                ///// 0 -> 4717
                parsedResult.forEach(item => {

                    // @Route("/station/departement/{depart_code}/{depart_name}/details/{id}" , name="station_details", methods={"GET"})
                    // let pathDetails = "/station/departement/" + item.departementCode.toString().trim() + "/" + item.departementName.trim() + "/details/" + item.id;
                    let miniFicheOnHover = setMiniFicheForStation(item.nom, item.adresse, item.prixE85, item.prixGplc, item.prixSp95, item.prixSp95E10, item.prixGasoil, item.prixSp98)
                    let marker = L.marker(L.latLng(parseFloat(item.latitude), parseFloat(item.longitude )), { icon: setIcon("assets/icon/icon_essance.png") });
                   
                    marker.bindTooltip(miniFicheOnHover, { direction: "auto", offset: L.point(0, -30) }).openTooltip();
                    marker.on('click', () => {
                        if( screen.width < 991){
                            getDetailStationForMobile(item.departementCode.toString().trim(), item.departementName.trim(), item.id)
                        }else{
                            getDetailStation(item.departementCode.toString().trim(), item.departementName.trim(), item.id)
                        }
                    })

                    markers.addLayer(marker);

                } )

                map.addLayer(markers);

                if( nom_dep && id_dep ){

                    /// mise a jour de liste
                    const parent_elements= document.querySelector(".list_result")
                    const elements= document.querySelectorAll(".element")
                    elements.forEach(element => {
                        element.parentElement.removeChild(element);
                    })

                    parsedResult.forEach(element => {
                        parent_elements.querySelector("ul").innerHTML += `
                            <li class="card-list element">
                                <div class="row container-depart pt-4 element" id="${element.id}">
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
                                        <a id="open-detail-station" onclick="getDetailStation('${id_dep}','${nom_dep}','${element.id}')">
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
                    if(document.querySelector(".content_list_station_left")){ 
                        const parent_elements_mobile_on_left= document.querySelector(".content_list_station_left")
                        parsedResult.forEach(element => {
                            parent_elements_mobile_on_left.innerHTML += `
                                <li class="card_list element" data-bs-toggle="modal" data-bs-target="#detailModalMobil" onclick="getDetailStationForMobile('${id_dep}','${nom_dep}','${element.id}')">
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

                map.on("resize zoom", (e) => {
                    const coordAndZoom = {
                        zoom: e.target._zoom,
                        coord:e.target._lastCenter
                    }
                    setDataInLocalStorage("coordStation", JSON.stringify(coordAndZoom))
                })

                map.on("dragend", (e) => {
                    const coordAndZoom = {
                        zoom: e.target.getZoom(),
                        coord:e.target.getCenter()
                    }
                    setDataInLocalStorage("coordStation", JSON.stringify(coordAndZoom))
                })

            }else{
                console.log("ERREUR : L'erreur se produit par votre réseaux.")
            }
        })
        // .catch(e => {
        //     console.log(e);
        // })
}

/// THIS FUNCTION USE ONLY TO SET THE URL ON STATION TO SYNCHRONISE THE LINK DEPART WITH CHECKBOX FILTER ///
function changeDapartLinkCurrent(type){

	const all_link= document.querySelectorAll(".plus");
	all_link.forEach(item => {
		if( item.getAttribute("href").split("?").length > 1 ){
			item.setAttribute("href", item.getAttribute("href").split("?")[0]+ "?type="+ type)
		}else{
			item.setAttribute("href", item.getAttribute("href")+ "?type="+ type)
		}
	})

}


function getDetailStation(depart_name, depart_code, id) { 
    // console.log(depart_name, depart_code, id)

    let remove = document.getElementById("remove-detail-station")
    remove.removeAttribute("class", "hidden");
    remove.setAttribute("class", "navleft-detail fixed-top")

    fetchDetails("#content-details-station", depart_name,depart_code,id)
}

function getDetailStationForMobile(depart_name, depart_code, id) {
    // console.log(depart_name, depart_code, id)
    if(document.querySelector(".btn_retours_specifique_jheo_js")){
        document.querySelector(".btn_retours_specifique_jheo_js").click();
    }

    if(document.querySelector(".get_action_detail_on_map_js_jheo")){
        document.querySelector(".get_action_detail_on_map_js_jheo").click();
    }

    fetchDetails(".content_detail_js_jheo", depart_name,depart_code,id)
}

function fetchDetails(selector, departName, departCode,id){

    const myHeaders = new Headers();
    myHeaders.append('Content-Type','text/plain; charset=UTF-8');

    fetch(`/station/departement/${departName}/${departCode}/details/${id}`)
        .then(response => {
            return response.text()
        }).then(r => { 
           document.querySelector(selector).innerHTML = null
           document.querySelector(selector).innerHTML = r
        })
    
}
