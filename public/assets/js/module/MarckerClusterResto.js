class MarckerClusterResto extends MapModule  {
    
    constructor(nom_dep=null,id_dep=null){
        super(id_dep,nom_dep, "resto")
    }

    async onInit(){
        this.ALREADY_INIT = false;
        try{
            this.createMarkersCluster();
            
            const link =( this.nom_dep && this.id_dep) ? `/Coord/Spec/Restaurant/${this.id_dep}` : `/Coord/All/Restaurant`;
            const response= await fetch(link);
            this.default_data= await response.json();
            this.data= this.default_data; 
            
            this.initMap();

            this.bindAction()
        }catch(e){
            console.log(e)
        }
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


    bindAction(){
        this.addMarker(this.data);
        this.setNumberOfMarker();
        this.addEventOnMap(this.map);
    }

    getAlreadyInit(){
        return this.ALREADY_INIT;
    }

    setAlreadyInit(val){
        this.ALREADY_INIT = val;
    }


    addMarker(newData){
        newData.forEach(item => {
            this.settingSingleMarker(item, false)
        })

        this.map.addLayer(this.markers);
    }


    settingSingleMarker(item, isSelected= false){

        const departementName = item.depName
        const adresseRestaurant = `${item.numvoie} ${item.typevoie} ${item.nomvoie} ${item.codpost} ${item.villenorm}`

        const adress = "<br><span class='fw-bolder'> Adresse:</span> <br>" + adresseRestaurant;
        const title = "<span class='fw-bolder'> Restaurant:</span>  " + item.denominationF + ".<span class='fw-bolder'><br> Departement:</span>  " + departementName + "." + adress;

        const marker = L.marker(
            L.latLng(parseFloat(item.lat), parseFloat(item.long)),
            {
                icon: isSelected ? setIconn('assets/icon/NewIcons/icon-resto-new-Rr.png') : setIconn('assets/icon/NewIcons/icon-resto-new-B.png'),
                cleNom: item.denominationF,
                id: item.id
            }
        );

        marker.bindTooltip(title,{ direction: "top", offset: L.point(0, -30)}).openTooltip();

        marker.on('click', (e) => {
            this.updateCenter( parseFloat(item.lat ), parseFloat(item.long ), this.zoomDetails);

            const icon_R = L.Icon.extend({
                options: {
                    iconUrl: IS_DEV_MODE ? this.currentUrl.origin + "/assets/icon/NewIcons/icon-resto-new-Rr.png" : this.currentUrl.origin + "/public/assets/icon/NewIcons/icon-resto-new-Rr.png",
                    iconSize: [32,50],
                    iconAnchor: [11, 30],
                    popupAnchor: [0, -20],
                    shadowSize: [68, 95],
                    shadowAnchor: [22, 94]
                }
            })

            marker.setIcon(new icon_R);

            if (this.marker_last_selected && this.marker_last_selected != marker ) {
                const icon_B = L.Icon.extend({
                    options: {
                        iconUrl: IS_DEV_MODE ? this.currentUrl.origin + "/assets/icon/NewIcons/icon-resto-new-B.png" :  this.currentUrl.origin + "/public/assets/icon/NewIcons/icon-resto-new-B.png",
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
                var pathDetails = `/restaurant-mobile/departement/${departementName}/${item.dep}/details/${item.id}`;
                location.assign(pathDetails)
            } else {
                getDetailResto(item.dep, item.depName, item.id, false)
            }

        })

        this.markers.addLayer(marker);

        if( isSelected ) {
            this.marker_last_selected= marker;

            this.markers.refreshClusters();
            this.map.addLayer(this.markers);
        }
    }

      
    addEventOnMap(map) {
        map.on("resize moveend", () => { 
            const x= this.getMax(this.map.getBounds().getWest(),this.map.getBounds().getEast())
            const y= this.getMax(this.map.getBounds().getNorth(), this.map.getBounds().getSouth())

            const new_size= { minx:x.min, miny:y.min, maxx:x.max, maxy:y.max }

            this.addPeripheriqueMarker(new_size)
        })
    }


    setNumberOfMarker(){
        if( !this.id_dep){
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

    checkIsExist(idToCheck){
        return this.default_data.some(({id}) => parseInt(id) === parseInt(idToCheck))
    }

    clickOnMarker(id){
        this.markers.eachLayer((marker) => {
            if (parseInt(marker.options.id) === parseInt(id) ) {
                marker.fireEvent('click'); 
            }
        });
    }

  

    async fetchOneData(id){
        try {
    
            if(this.marker_last_selected){
                const icon_B = L.Icon.extend({
                    options: {
                        iconUrl: IS_DEV_MODE ? this.currentUrl.origin + "/assets/icon/NewIcons/icon-resto-new-B.png" :  this.currentUrl.origin + "/public/assets/icon/NewIcons/icon-resto-new-B.png",
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

            const api_data= `/api/restaurant/${this.id_dep}/${this.id_dep}/details/${id}`;
            const response = await fetch(api_data);
            let { details } = await response.json();
            this.updateCenter(details.lat, details.long, this.zoomDetails);
            
            this.settingSingleMarker(details, true);

            this.default_data= this.default_data.concat([details]);
        } catch (e) {
            console.log(e)
        }
    }

    filterByFirstLetterOnName(letter){
        const new_data= [];
        this.removeMarker();
        
        this.default_data.forEach(item => {
            if(item.denominationF.toLowerCase().charAt(0) === letter.toLowerCase()){
                new_data.push(item)
            }
        })
        // alert(new_data.length)
        this.addMarker(new_data)
    }

    removeMarker(){
        this.markers.clearLayers();
        this.map.removeLayer(this.markers);
    }

    resetToDefaultMarkers(){
        this.removeMarker();
        this.addMarker(this.default_data)
    }

  
    async addPeripheriqueMarker(new_size) {
        try {
            const { minx, miny, maxx, maxy }= new_size;
            const param="?minx="+encodeURIComponent(minx)+"&miny="+encodeURIComponent(miny)+"&maxx="+encodeURIComponent(maxx)+"&maxy="+encodeURIComponent(maxy);

            const api_data= (this.id_dep) ? `/Coord/Spec/Restaurant/${this.id_dep}/${param}` : `/Coord/All/Restaurant${param}`;
            const response = await fetch(api_data);
            let new_data = await response.json();

            new_data = new_data.filter(item => !this.default_data.some(j => parseInt(j.id) === parseInt(item.id)))

            this.addMarker(this.checkeFilterType(new_data));

            this.default_data= this.default_data.concat(new_data)
        } catch (e) {
            console.log(e)
        }
    }

    checkeFilterType(data) {
        /// filter specifique: alphabet, asyc/desc
        return data;
    }
}