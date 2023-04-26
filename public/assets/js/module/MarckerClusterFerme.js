class MarckerClusterFerme {

    constructor(nom_dep=null,id_dep=null){
        this.nom_dep = nom_dep ? nom_dep : null;
        this.id_dep = id_dep ? id_dep : null;
    }

    async onInit(){
        this.ALREADY_INIT = false;
        try{
            const link =( this.nom_dep && this.id_dep) ? `/ferme/departement/${this.nom_dep}/${this.id_dep}/allFerme` : `/getLatitudeLongitudeFerme`;
            const response= await fetch(link);
            this.default_data= await response.json();
            this.data= this.default_data;
            this.bindAction()
            this.displayData()
        }catch(e){
            console.log(e)
        }
    }

    getAlreadyInit(){
        return this.ALREADY_INIT;
    }

    setAlreadyInit(val){
        this.ALREADY_INIT = val;
    }

    

    bindAction(){
        this.getGeos()
        this.map=create_map_content(this.geos,this.id_dep, "ferme");
        this.createMarkersCluster();
        this.addMarker(this.data);
        this.addEventOnMap(this.map);
        this.setNumberOfMarker();
        // this.generateAllCard();
    }

    addEventOnMap(map){
        map.on("resize zoom", (e) => {
            const coordAndZoom = {
                zoom: e.target._zoom,
                coord:e.target._lastCenter
            }
            setDataInLocalStorage("coordFerme", JSON.stringify(coordAndZoom))
        })

        map.on("dragend", (e) => {
            console.log(e.target.getCenter(), e.target.getZoom())
            const coordAndZoom = {
                zoom: e.target.getZoom(),
                coord:e.target.getCenter()
            }
            setDataInLocalStorage("coordFerme", JSON.stringify(coordAndZoom))
        })
    }

    getGeos(){
        this.geos= [];
        if (this.id_dep) {
            if (this.id_dep == 20) {
                for (let corse of ['2A', '2B'])
                    this.geos.push(franceGeo.features.find(element => element.properties.code == corse))
            } else {
                this.geos.push(franceGeo.features.find(element => element.properties.code == this.id_dep))
            }
        }else{
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

    setNumberOfMarker(){
        /// change the number of result in div
        if( document.querySelector(".content_nombre_result_js_jheo")){
            document.querySelector(".content_nombre_result_js_jheo").innerText = this.data.length;
        }

        /// change the number of result in div for the left translate
        if( document.querySelector(".content_nombre_result_mobile_js_jheo")){
            document.querySelector(".content_nombre_result_mobile_js_jheo").innerText = this.data.length;
        }
    }

    displayData() {
        console.log(this.data)
        console.log(this.geos)
        console.log(this.map)
    }

    createMarkersCluster(){
        this.markers = L.markerClusterGroup({ 
            chunkedLoading: true
        });
    }

    addMarker(newData){
        newData.forEach(item => {
            const departementName = item.departementName
            const adress = "<br><span class='fw-bolder'> Adresse:</span> <br>" + item.adresseFerme;
            
            let title = "<span class='fw-bolder'> Ferme:</span> <br> " + item.nomFerme + ".<span class='fw-bolder'>  Departement:</span> <br> " + item.departement +"." + adress;
            let marker = L.marker(L.latLng(parseFloat(item.latitude), parseFloat(item.longitude )), {icon: setIcon('assets/icon/NewIcons/icon-ferme-new-B.png') });
            
            marker.bindTooltip(title,{ direction:"top", offset: L.point(0,-30)}).openTooltip();
            marker.on('click', (e) => {
                const coordAndZoom = {
                    zoom: e.target.__parent._zoom+1,
                    coord:e.target.__parent._cLatLng
                }
                setDataInLocalStorage("coordFerme", JSON.stringify(coordAndZoom))
                
                let screemMax = window.matchMedia("(max-width: 1000px)")
                let screemMin = window.matchMedia("(min-width: 1000px)")

                // @Route("ferme/departement/{nom_dep}/{id_dep}/details/{id_ferme}" , name="detail_ferme" , methods="GET" )
                let pathDetails =`/ferme/departement/${departementName}/${item.departement}/details/${item.id}`
                if (screemMax.matches) {
                    getDetailsFermeForMobile(pathDetails);
                } else if (screemMin.matches) {
                    getDetailsFerme(pathDetails)
                }
                
            })

            this.markers.addLayer(marker);

        })
        this.map.addLayer(this.markers);
    }

    removeMarker(){
        this.markers.clearLayers();
        this.map.removeLayer(this.markers);
    }


    generateAllCard(){
        if( this.nom_dep && this.id_dep ){
            /// mise a jour de liste
            const parent_elements= document.querySelector(".list_result")
            const elements= document.querySelectorAll(".element")
            elements.forEach(element => {
                element.parentElement.removeChild(element);
            })

            this.data.forEach(new_element => {
                // <div class="element" id="{{station.id}}">
                const div_new_element = document.createElement("div");
                div_new_element.setAttribute("class", "element")
                div_new_element.setAttribute("id", new_element.id);

                // <p> <span class="id_departement">{{station.nom }} </span> {{station.adresse}}</p>
                const s_p = document.createElement("p");
                s_p.innerHTML = "<span class='id_departement'>"+ new_element.nomFerme+" </span>" +  new_element.adresseFerme

                // <a class="plus" href="{{path('station_details', {'depart_code':departCode, 'depart_name':departName,'id':station.id }) }}">
                const a= document.createElement("a");
                a.setAttribute("class", "plus")
                a.setAttribute("href", "/ferme/departement/"+ this.nom_dep +"/"+ this.id_dep +"/details/" + new_element.id )
                a.innerText = "Voir détails";

                /// integre dom under the element
                div_new_element.appendChild(s_p);
                div_new_element.appendChild(a);
                
                ///integre new element in each element.
                parent_elements.appendChild(div_new_element);
            })
            
        }

    }


    filterByFirstLetterOnName(letter){
        const new_data= [];
        this.removeMarker();
        
        this.default_data.forEach(item => {
            if(item.nomFerme.toLowerCase().charAt(0) === letter.toLowerCase()){
                new_data.push(item)
            }
        })
        // alert(new_data.length)
        this.addMarker(new_data)
    }

    resetToDefaultMarkers(){
        this.removeMarker();
        this.addMarker(this.default_data)
    }
}