class MarckerClusterGolf extends MapModule {

    constructor(nom_dep=null,id_dep=null){
        super(id_dep,nom_dep, "golf")
    }

    async onInit(isAddControl){
        this.ALREADY_INIT = false;
        try{
            this.createMarkersCluster();
            this.initMap(null, null, isAddControl);

            const link =( this.nom_dep && this.id_dep) ? `/api/golf/departement/${this.nom_dep}/${this.id_dep}` : `/api/golf`;
            const response= await fetch(link);
            const result= await response.json();
            this.default_data = result.data
            
            this.data= this.default_data; 
            

            this.bindAction()
        }catch(e){
            console.log(e)
        }
    }

    bindAction(){
        this.addMarker(this.data);
        // this.setNumberOfMarker();
        // this.addEventOnMap(this.map);
    }

    
    setNumberOfMarker(){
        if( this.id_dep){
            /// change the number of result in div
            if( document.querySelector(".content_nombre_result_js_jheo")){
                document.querySelector(".content_nombre_result_js_jheo").innerText = this.data.length;
            }

            /// change the number of result in div for the left translate
            if( document.querySelector(".content_nombre_result_mobile_js_jheo")){
                document.querySelector(".content_nombre_result_mobile_js_jheo").innerText = this.data.length;
            }
        }
    }

    displayData() {
        console.log(this.data)
        console.log(this.map)
    }

    createMarkersCluster(){
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

    addMarker(newData){
        newData.forEach(item => {
            const adress = "<br><span class='fw-bolder'> Adresse:</span> <br>" + item.commune + " " + item.adress;
            let title = "<span class='fw-bolder'> Golf: </span>" + item.name + ".<span class='fw-bolder'><br>Departement: </span>" + item.dep +"." + adress;
            
            let pathIcon="";
            let taille= 0 /// 0: min, 1: moyenne, 2 : grand

            if( item.user_id === null){
                pathIcon='assets/icon/NewIcons/icon-blanc-golf-vertC.png';
            }else{
                pathIcon= item.user_status === null ? 'assets/icon/NewIcons/icon-blanc-golf-vert-badgeC.png' : 'assets/icon/NewIcons/icon-blanc-golf-vert-bC.png';
                taille=1
            }
            let marker = L.marker(L.latLng(parseFloat(item.lat), parseFloat(item.long )), {icon: setIconn(pathIcon,'content_badge', taille), id: item.id});
            
            marker.bindTooltip(title,{ direction:"top", offset: L.point(0,-30)}).openTooltip();

            marker.on('click', (e) => {
                this.updateCenter( parseFloat(item.lat ), parseFloat(item.long ), this.zoomDetails);

                let pathIcon="";
                if( item.user_id === null){
                    pathIcon='/assets/icon/NewIcons/icon-rouge-golf-C.png';
                }else{
                    pathIcon= item.user_status === null ? '/assets/icon/NewIcons/icon-vert-golf-orange.png' : '/assets/icon/NewIcons/icon-vert-golf-bleu.png';
                }
                const icon_R = L.Icon.extend({
                    options: {
                        iconUrl: IS_DEV_MODE ? this.currentUrl.origin +  pathIcon: this.currentUrl.origin + "/public" + pathIcon,
                        iconSize: [35,55],
                        iconAnchor: [11, 30],
                        popupAnchor: [0, -20],
                        shadowSize: [68, 95],
                        shadowAnchor: [22, 94]
                    }
                })
                marker.setIcon(new icon_R);

                if (this.marker_last_selected && this.marker_last_selected != marker ) {

                    const last_marker= this.default_data.find(({id}) => parseInt(id) === parseInt(this.marker_last_selected.options.id))

                    let pathIcon="";
                    if( last_marker.user_id === null){
                        pathIcon='/assets/icon/NewIcons/icon-blanc-golf-vertC.png';
                    }else{
                        pathIcon= last_marker.user_status === null ? '/assets/icon/NewIcons/icon-blanc-golf-vert-badgeC.png' : '/assets/icon/NewIcons/icon-blanc-golf-vert-bC.png';
                    }

                    const icon_B = L.Icon.extend({
                        options: {
                            iconUrl: IS_DEV_MODE ? this.currentUrl.origin + pathIcon : this.currentUrl.origin + "/public" + pathIcon ,
                            iconSize: [32,50],
                            iconAnchor: [11, 30],
                            popupAnchor: [0, -20],
                            //shadowUrl: 'my-icon-shadow.png',
                            shadowSize: [68, 95],
                            shadowAnchor: [22, 94]
                        }
                    })
                    this.marker_last_selected.setIcon(new icon_B)
                }
                this.marker_last_selected = marker;

                this.markers.refreshClusters();

                
                if (screen.width < 991) {
                    let pathDetails = `/ferme/departement/${item.nom_dep}/${item.dep}/details/${item.id}`
                    getDetailHomeForMobile(pathDetails)
                } else {
                    // getDetailsFerme(pathDetails, true)getDetailStation
                    getDetailGolf(item.dep, item.nom_dep, item.id)
                }

            })

            this.markers.addLayer(marker);

        })
        this.map.addLayer(this.markers);
    }

    addEventOnMap(map) {
        map.on("resize moveend", () => { 
            const x= this.getMax(this.map.getBounds().getWest(),this.map.getBounds().getEast())
            const y= this.getMax(this.map.getBounds().getNorth(), this.map.getBounds().getSouth())

            const new_size= { minx:x.min, miny:y.min, maxx:x.max, maxy:y.max }

            this.addPeripheriqueMarker(new_size)
        })
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

    clickOnMarker(id){
        this.markers.eachLayer((marker) => {
            if (parseInt(marker.options.id) === parseInt(id) ) {
                marker.fireEvent('click');  
            }
        });
    }

    async addPeripheriqueMarker(new_size) {
        try {
            const { minx, miny, maxx, maxy }= new_size;
            const param="?minx="+encodeURIComponent(minx)+"&miny="+encodeURIComponent(miny)+"&maxx="+encodeURIComponent(maxx)+"&maxy="+encodeURIComponent(maxy);

            const response = await fetch(`/getLatitudeLongitudeFerme${param}`);
            let new_data = await response.json();
            console.log(new_data);
            new_data = new_data.filter(item => !this.default_data.some(j => j.id === item.id))
         
            this.addMarker(this.checkeFilterType(new_data));
            this.default_data= this.default_data.concat(new_data);
        } catch (e) {
            console.log(e)
        }
    }

    
    checkeFilterType(data) {
        return data;
    }

}