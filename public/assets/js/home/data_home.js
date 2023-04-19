///jheo: cart for map station and ferme
function addMapTous(nom_dep=null, id_dep=null, type=null){
    const geos = []
    var url;
    if( id_dep){
        url = "/getLatitudeLongitudeForAll/?nom_dep=" + nom_dep + "&id_dep=" + id_dep
    }else{
        url = "/getLatitudeLongitudeForAll"

        for (let f of franceGeo.features) {
            geos.push(f)
        }
        // geos.push(franceGeo.features.find(element => element.properties.code > 0))
    }

    if( type){
        if( nom_dep && id_dep){
           url = url + "&type=" + type;
            if (id_dep == 20) {
                for (let corse of ['2A', '2B'])
                     geos.push(franceGeo.features.find(element => element.properties.code == corse))
            } else {
                geos.push(franceGeo.features.find(element => element.properties.code == id_dep))
            }
        }else{
           url = url + "?type=" + type;
        //    for (let f of franceGeo.features) {
        //     geos.push(f)
        //     }
       }
    }
    

    fetch(url)
        .then(result => result.json())
        .then(parsedResult => {

            ///delete chargement
            var map=create_map_content(geos,id_dep, "home");

            // <div class="content_filter">
            const content_filter = document.createElement("div");
            content_filter.className = "content_filter";

            
            generate_filter(content_filter, "filterTous", "Tous")
            generate_filter(content_filter, "filterFerme", "Ferme")
            generate_filter(content_filter, "filterStation", "Station")
            generate_filter(content_filter, "filterResto", "Réstaurant")
            generate_filter(content_filter, "filterVehicule", "Véhicule", true , true)
            generate_filter(content_filter, "filterCommerce", "Commerce", true , true)
            
            if(screen.width < 991 ){
                document.querySelector(".content_filter_global_modal_jheo_js").appendChild(content_filter)
            }else{
                document.querySelector("#map").appendChild(content_filter);
            }

            const content_filter_dep = document.createElement("div");
            content_filter_dep.className = "content_filter_dep";

            generate_select_dep(content_filter_dep)

            document.querySelector("#map").appendChild(content_filter_dep);


            eventManagement();



            // console.log(parsedResult)
            const stations = parsedResult.station
            const fermes = parsedResult.ferme
            const resto = parsedResult.resto

            if( stations || fermes || resto ){
                
                var markers = L.markerClusterGroup({ 
                    chunkedLoading: true
                });

                ///all stations
                if( stations ){
                    stations.forEach(item => {
                    
                        const miniFicheOnHover =setMiniFicheForStation(item.nom, item.adresse,item.prixE85,item.prixGplc,item.prixSp95,item.prixSp95E10,item.prixGasoil,item.prixSp98 )
                    
                        var marker = L.marker(L.latLng(parseFloat(item.latitude), parseFloat(item.longitude )), {icon: setIcon("assets/icon/icon_essanceB.png") });
                        marker.bindTooltip(miniFicheOnHover,{ direction:"auto", offset: L.point(0,-30)}).openTooltip();
                        
                        marker.on('click', (e) => {
                            console.log(e)
                            const coordAndZoom = {
                                zoom: e.target.__parent._zoom+1,
                                coord:e.target.__parent._cLatLng
                            }
                            setDataInLocalStorage("coordTous", JSON.stringify(coordAndZoom))

                            // @Route("/station/departement/{depart_code}/{depart_name}/details/{id}" , name="station_details", methods={"GET"})
                            if( screen.width< 991 ){
                                getDetailHomeForMobile("/station/departement/" + item.departementCode.toString().trim() + "/"+ item.departementName.trim() + "/details/" + item.id)
                            }else{
                                getDetailStation(item.departementCode.toString().trim(), item.departementName.trim(), item.id,inHome=true)
                            }
                        })
                        
                        markers.addLayer(marker);
                    } )
                    map.addLayer(markers);
                }

                ///all fermes
                if( fermes ){
                    fermes.forEach(item => {
                        const departementName = item.departementName ? item.departementName : "unknow";
                        const adress = "<br><span class='fw-bolder'> Adresse:</span> <br>" + item.adresseFerme;
                        // const link = "<br><a href='"+ pathDetails + "'> VOIR DETAILS </a>";

                        var title = "<span class='fw-bolder'>Ferme:</span>  <br>" + item.nomFerme + ".<span class='fw-bolder'> Departement:</span>  <br>" + item.departement +"." + adress;
                        var marker = L.marker(L.latLng(parseFloat(item.latitude), parseFloat(item.longitude )), {icon: setIcon('assets/icon/ferme-logo-bleu.png') });
                        marker.bindTooltip(title,{ direction:"auto", offset: L.point(0,-30)}).openTooltip();
                        
                        
                        marker.on('click', (e) => {
                            console.log(e)
                            const coordAndZoom = {
                                zoom: e.target.__parent._zoom+1,
                                coord:e.target.__parent._cLatLng
                            }
                            setDataInLocalStorage("coordTous", JSON.stringify(coordAndZoom))

                            let pathDetails =`/ferme/departement/${item.departementName}/${item.departement}/details/${item.id}`
                            if( screen.width< 991 ){
                                getDetailHomeForMobile(pathDetails)
                            }else{
                                getDetailsFerme(pathDetails, inHome=true)
                            }

                            // @Route("ferme/departement/{nom_dep}/{id_dep}/details/{id_ferme}" , name="detail_ferme" , methods="GET" )
                           
                            // window.location = pathDetails;
                        })
                        markers.addLayer(marker);
                    })
                    map.addLayer(markers);
                }

                ///all resto
                if( resto ){
                    resto.forEach(item => {

                        const departementName = item.depName

                        var pathDetails ="/restaurant/departement/"+ departementName + "/" + item.dep +"/details/" + item.id;
                
                        const adresseRestaurant=`${item.numvoie} ${item.typevoie} ${item.nomvoie} ${item.codpost} ${item.villenorm}`
                        const adress = "<br><span class='fw-bolder'> Adresse:</span> <br>" + adresseRestaurant;
                        // const link = "<br><a href='"+ pathDetails + "'> VOIR DETAILS </a>";
    
                        var title = "<span class='fw-bolder'> Restaurant:</span>  " + item.denominationF + ".<span class='fw-bolder'><br> Departement:</span>  " + departementName +"." + adress;
                  
                        var marker = L.marker(L.latLng(parseFloat(item.poiY), parseFloat(item.poiX )), {icon: setIcon('assets/icon/icon-resto-bleu.png') });
                         
                        marker.bindTooltip(title,{ direction:"top", offset: L.point(0,-30)}).openTooltip();
                        marker.on('click', (e) => {
                            console.log(e)
                            const coordAndZoom = {
                                zoom: e.target.__parent._zoom+1,
                                coord:e.target.__parent._cLatLng
                            }
                            setDataInLocalStorage("coordTous", JSON.stringify(coordAndZoom))
                            window.location = pathDetails;
                        })
                        
                        markers.addLayer(marker);
                    } )
                    map.addLayer(markers);
                }
                
                ////affiche les resultats.
                // map.addLayer(markers);
                // map.on("zoom", (e) => {
                //     setDataInLocalStorage("zoom", e.target._zoom)
                // })
                map.on("resize zoom", (e) => {
                    console.log(e)
                    const coordAndZoom = {
                        zoom: e.target._zoom,
                        coord:e.target._lastCenter
                    }
                    setDataInLocalStorage("coordTous", JSON.stringify(coordAndZoom))
                })

                map.on("dragend", (e) => {
                    console.log(e.target.getCenter(), e.target.getZoom())
                    const coordAndZoom = {
                        zoom: e.target.getZoom(),
                        coord:e.target.getCenter()
                    }
                    setDataInLocalStorage("coordTous", JSON.stringify(coordAndZoom))
                })

            }else{
                console.log("ERREUR : L'erreur se produit par votre réseaux.")
            }
        });
}

/* generate filter right */
function generate_filter( parent , id, textContent , state = true , none = false ){

    const div_filter = document.createElement("div");
    div_filter.className = "form-check form-switch";

    if(none){
        div_filter.style.display="none";
    }

    const input_filter = document.createElement("input");
    input_filter.className = "form-check-input"
    input_filter.type = "checkbox"
    input_filter.checked = state ? state : false;
    input_filter.setAttribute("id",id);
    input_filter.setAttribute("name",id);

    div_filter.appendChild(input_filter);

    const label_filter = document.createElement("label");
    label_filter.className = "form-check-label"
    label_filter.innerText = textContent;
    label_filter.setAttribute("for",id);

    div_filter.appendChild(label_filter);

    parent.appendChild(div_filter);

}


function generate_select_dep(parent, id_selected = null ){

    const div_select = document.createElement("select")
    div_select.className = "form-select input_select_dep_js_jheo"
    div_select.setAttribute("aria-label" , "Sélectionnez un département");

    fetch("/api/alldepartements")
    .then(response => response.json())
    .then(response => {
       const  { departements } = response;
       const option = document.createElement("option")
       option.innerText = `Sélectionnez un département ici`;
       div_select.appendChild(option);


       departements.forEach((item) => {
            
            const option = document.createElement("option")

            if( item.id === id_selected){
                option.setAttribute("selected" , "");
            }
            option.setAttribute("value", item.id );
            option.innerText = `${item.id}: ${item.departement}`;

            div_select.appendChild(option);
       })

       parent.appendChild(div_select);
       document.querySelector(".input_select_dep_js_jheo").addEventListener("change" , (e) => checkStateCheckbox(e))
    })
}


function eventManagement(){
	
	if( document.querySelector(".content_filter")){
	 
		const alltype = document.querySelectorAll(".content_filter input");
	
		alltype.forEach(item => {
			item.addEventListener("click", (e) => checkStateCheckbox(e))
		})
	}

    if( document.querySelector(".input_select_dep_js_jheo") ){
        document.querySelector(".input_select_dep_js_jheo").addEventListener("change" , (e) => checkStateCheckbox(e))
    }

}

function checkStateCheckbox(e){
    document.querySelector(".btn_close_modal_filter_jheo_js")?.click();

    localStorage.removeItem("coordTous")
    
    ////state view checkbox if tous selected//////////////////
    if( e.target.name === "filterTous"){
        if( document.querySelector("#filterTous").checked){
            document.querySelectorAll(".content_filter input").forEach(item => {
                item.checked = true;
            })
        }else{
            document.querySelectorAll(".content_filter input").forEach(item => {
                item.checked = false;
            })
        }
    }

    const lists = ["filterFerme" , "filterStation", "filterResto" , "filterVehicule" , "filterCommerce"];

    let result_temp = [];
    let results = null ;
    for (let item  of lists ) {
        results = handleOnlyStateCheckbox(result_temp, item )
        result_temp = results;
    }

    
    if( results.every(item => item.state === 1 ) ){
        document.querySelector("#filterTous").checked = true;
    }else{
        document.querySelector("#filterTous").checked = false;
    }

    const selected_input = document.querySelector(".input_select_dep_js_jheo").value;

    // console.log({"types" : results , "departement" : selected_input.length < 3 ? selected_input : null })
    
    fechData( {"types" : results , "departement" : selected_input.length < 3 ? selected_input : null } );
    
}

function handleOnlyStateCheckbox(tab , item ) {
    let result = []
    let state = { "type" : document.querySelector(`#${item}`).getAttribute("name") };
    
    if( document.querySelector(`#${item}`).checked){
        state = {...state , "state" : 1 }
    }else{
        state = {...state , "state" : 0 }
    }

    if( tab.length === 0){
        return [ state ];
    }else{
        result = [ ...tab, state ]
    }

    return result;

}

function fechData(data){
    const URL = "/fetch-all-data-home";
    
    fetch(URL , {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)   
    }).then (response => {
        if( !response.ok){
            throw new Error();
        }

        return response.json()
    }).then(response => {
        if( response.stat === "fail" ){
            throw new Error("Error for parse result to json");
        }
        // console.log(response)

        ///delete old map
        // deleteMap();
        // createDivChargement();
        ///delete old map
        const cart_map = document.getElementById("map");
        const parent_map = cart_map.parentElement;

        parent_map.removeChild(cart_map);

        // ///generate new map
        const div = document.createElement("div");
        div.setAttribute("id", "map")
        parent_map.appendChild(div);

        addMap(response,JSON.parse(JSON.stringify(data)).departement);

    })

}

function deleteMap(){
    const cart_map = document.getElementById("map");
    const parent_map = cart_map.parentElement;
    parent_map.removeChild(cart_map);
}
///create chargement div
function createDivChargement(){

    // {# <div id="map"  style="width: 100%;"></div> #}
    if( !document.getElementById("map")){

        const div_content = document.createElement("div");
        div_content.setAttribute("id", "toggle_chargement");
        div_content.setAttribute("class", "chargement_content");

        const div_content_box = document.createElement("div");
        div_content_box.setAttribute("class", "content_box");

        const div_box = document.createElement("div");
        div_box.setAttribute("class", "box");

        const div_under_box = document.createElement("div");
        div_under_box.setAttribute("class", "under_box");

        div_box.appendChild(div_under_box);
        div_content_box.appendChild(div_box);
        div_content.appendChild(div_content_box);

        document.querySelector(".cart_map").appendChild(div_content);

    }
}


function addMap(data,dep){

    const geos=[]
    const { state , ferme : fermes, station: stations , resto , vehicule } = data;
    if (dep) {
        if (dep == 20) {
            for (let corse of ['2A', '2B'])
                geos.push(franceGeo.features.find(element => element.properties.code == corse))
        } else {
                geos.push(franceGeo.features.find(element => element.properties.code == dep))
        }
    }
    ///delete chargement
    var map=create_map_content(geos,dep, "home")

    // <div class="content_filter">
    const content_filter = document.createElement("div");
    content_filter.className = "content_filter";

    
    generate_filter(content_filter, "filterTous", "Tous", state.types.every(item => item.state === 1 ))

    state.types.forEach(item => {
        const { type , state } = item;

        if(type.substring(6, type.length) === "Vehicule" || type.substring(6, type.length) === "Commerce"){
            generate_filter(content_filter,type , type.substring(6, type.length), state , true)
        }else{
            if( type.substring(6, type.length) === "Resto"){
                generate_filter(content_filter,type , "Restaurant", state)
            }else{
                generate_filter(content_filter,type , type.substring(6, type.length), state)
            }
        }

    })

    if(screen.width < 991 ){
        if(!document.querySelector(".content_filter")){
            document.querySelector(".content_filter_global_modal_jheo_js").appendChild(content_filter)
        }else{
            document.querySelector(".content_filter_global_modal_jheo_js").innerHTML = ""
            document.querySelector(".content_filter_global_modal_jheo_js").appendChild(content_filter)
        }
    }else{
        document.querySelector("#map").appendChild(content_filter);
    }


    const content_filter_dep = document.createElement("div");
    content_filter_dep.className = "content_filter_dep";

    generate_select_dep(content_filter_dep ,state.departement )

    document.querySelector("#map").appendChild(content_filter_dep);

    eventManagement();

    if( stations || fermes || resto ){

        var markers = L.markerClusterGroup({ 
            chunkedLoading: true
        });

        ///all stations
        if( stations.length > 0  ){
            stations.forEach(item => {
            
                const miniFicheOnHover =setMiniFicheForStation(item.nom, item.adresse,item.prixE85,item.prixGplc,item.prixSp95,item.prixSp95E10,item.prixGasoil,item.prixSp98 )
                
                var marker = L.marker(L.latLng(parseFloat(item.latitude), parseFloat(item.longitude )), {icon: setIcon("assets/icon/icon_essanceB.png") });
                marker.bindTooltip(miniFicheOnHover,{ direction:"auto", offset: L.point(0,-30)}).openTooltip();
                
               marker.on('click', (e) => {
                    console.log(e)
                    const coordAndZoom = {
                        zoom: e.target.__parent._zoom+1,
                        coord:e.target.__parent._cLatLng
                    }
                    setDataInLocalStorage("coordTous", JSON.stringify(coordAndZoom))
                    // @Route("/station/departement/{depart_code}/{depart_name}/details/{id}" , name="station_details", methods={"GET"})
                    if( screen.width< 991 ){
                        getDetailHomeForMobile("/station/departement/" + item.departementCode.toString().trim() + "/"+ item.departementName.trim() + "/details/" + item.id)
                    }else{
                        getDetailStation(item.departementCode.toString().trim(), item.departementName.trim(), item.id,inHome=true)
                    }
                });
                
                markers.addLayer(marker);
            } )
        }

        ///all fermes
        if( fermes.length > 0 ){
            fermes.forEach(item => {

                const adress = "<br><span class='fw-bolder'> Adresse:</span> <br>" + item.adresseFerme;
                var title = "<span class='fw-bolder'>Ferme:</span>  <br>" + item.nomFerme + ".<span class='fw-bolder'> Departement:</span>  <br>" + item.departement +"." + adress;

                var marker = L.marker(L.latLng(parseFloat(item.latitude), parseFloat(item.longitude )), {icon: setIcon('assets/icon/ferme-logo-bleu.png') });
                
                marker.bindTooltip(title,{ direction:"auto", offset: L.point(0,-30)}).openTooltip();
                
                marker.on('click', (e) => {
                    console.log(e)
                    const coordAndZoom = {
                        zoom: e.target.__parent._zoom+1,
                        coord:e.target.__parent._cLatLng
                    }
                    setDataInLocalStorage("coordTous", JSON.stringify(coordAndZoom))
                    // window.location = pathDetails;
                    
                    let pathDetails =`/ferme/departement/${item.departementName}/${item.departement}/details/${item.id}`
                    if( screen.width< 991 ){
                        getDetailHomeForMobile(pathDetails)
                    }else{
                        getDetailsFerme(pathDetails, inHome=true)
                    }

                });
                
                markers.addLayer(marker);
            } )
        }

        ///all resto
        if( resto.length > 0 ){
            resto.forEach(item => {

                const departementName = item.depName

        
                const adresseRestaurant=`${item.numvoie} ${item.typevoie} ${item.nomvoie} ${item.codpost} ${item.villenorm}`
                const adress = "<br><span class='fw-bolder'> Adresse:</span> <br>" + adresseRestaurant;
                // const link = "<br><a href='"+ pathDetails + "'> VOIR DETAILS </a>";

                var title = "<span class='fw-bolder'> Restaurant:</span>  " + item.denominationF + ".<span class='fw-bolder'><br> Departement:</span>  " + departementName +"." + adress;
            
                var marker = L.marker(L.latLng(parseFloat(item.poiY), parseFloat(item.poiX )), {icon: setIcon('assets/icon/icon-resto-bleu.png') });
                    
                marker.bindTooltip(title,{ direction:"top", offset: L.point(0,-30)}).openTooltip();
                 marker.on('click', (e) => {
                    console.log(e)
                    const coordAndZoom = {
                        zoom: e.target.__parent._zoom+1,
                        coord:e.target.__parent._cLatLng
                    }
                    setDataInLocalStorage("coordTous", JSON.stringify(coordAndZoom))
                    // window.location = pathDetails;

                    
                    let screemMax = window.matchMedia("(max-width: 1000px)")
                    let screemMin = window.matchMedia("(min-width: 1000px)")
                    let remove = document.getElementById("remove-detail")
                    
                    if (screemMax.matches) {
                        var pathDetails =`/restaurant-mobile/departement/${departementName}/${item.dep}/details/${item.id}`;
                        location.assign(pathDetails)
                    } else if (screemMin.matches) {
                        
                        remove.removeAttribute("class", "hidden");
                        remove.setAttribute("class", "navleft-detail fixed-top")

                        var myHeaders = new Headers();
                        myHeaders.append('Content-Type','text/plain; charset=UTF-8');
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

                });
                
                markers.addLayer(marker);
            } )
        }
        
        ////affiche les resultats.
        map.addLayer(markers);

        map.on("resize zoom", (e) => {
            console.log(e)
            const coordAndZoom = {
                zoom: e.target._zoom,
                coord:e.target._lastCenter
            }
            setDataInLocalStorage("coordTous", JSON.stringify(coordAndZoom))
        })
        map.on("dragend", (e) => {
            console.log(e.target.getCenter(), e.target.getZoom())
            const coordAndZoom = {
                zoom: e.target.getZoom(),
                coord:e.target.getCenter()
            }
            setDataInLocalStorage("coordTous", JSON.stringify(coordAndZoom))
        })
    }
}