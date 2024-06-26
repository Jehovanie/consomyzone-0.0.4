class MarckerClusterResto extends MapModule  {
    
    constructor(nom_dep=null,id_dep=null, codinsee=null){
        super(id_dep,nom_dep, "resto");
        this.codinsee = codinsee;
    }

    async onInit(isAddControl=false){
        this.ALREADY_INIT = false;
        try{
            this.createMarkersCluster();

            /// Three possiblities : all departement, arrondissement, in departement
            const linkArrond = this.codinsee ? `/Coord/All/Restaurant/specific/arrondissement/${this.id_dep}/${this.codinsee}` : null;
            this.api_data =( this.nom_dep && this.id_dep) ? ( this.codinsee ? linkArrond : `/Coord/Spec/Restaurant/${this.id_dep}` ) : `/Coord/All/Restaurant`;

            /// if the user just did a search
            let param = "";
            if(getDataInSessionStorage("lastSearchPosition")){
                const lastSearchPosition= getDataInSessionStorage("lastSearchPosition") ? JSON.parse(getDataInSessionStorage("lastSearchPosition")) : null;
                const { minx, miny, maxx, maxy }= lastSearchPosition.position;
                param= lastSearchPosition ? "?minx="+encodeURIComponent(minx)+"&miny="+encodeURIComponent(miny)+"&maxx="+encodeURIComponent(maxx)+"&maxy="+encodeURIComponent(maxy)  : "";
            }

            // "data" => $datas,
            // "allIdRestoPastille" => $arrayIdResto

            const response= await fetch(`${this.api_data}${param}`);
            const responseJson = await response.json();

            this.default_data= responseJson.data;
            this.data=  this.default_data; 
            
            this.listRestoPastille= responseJson.allIdRestoPastille;

            this.initMap(null, null, null, isAddControl);
            this.bindAction();

            if(getDataInSessionStorage("lastSearchPosition")){
                clearDataInSessionStorage("lastSearchPosition")
            }

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

        let resultRestoPastille= this.listRestoPastille.length > 0 ? this.listRestoPastille.filter(jtem => parseInt(jtem.id_resto) === parseInt(item.id)) : [];

        let poi_icon =  resultRestoPastille.length > 1 ? 'assets/icon/NewIcons/icon-resto-new-B-vert-multi.png' : (resultRestoPastille.length === 1  ? 'assets/icon/NewIcons/icon-resto-new-B-org-single.png' : 'assets/icon/NewIcons/icon-resto-new-B.png' ) ;
        let poi_icon_Selected=  resultRestoPastille.length > 1 ? 'assets/icon/NewIcons/icon-resto-new-Rr-vert-multi.png' : (resultRestoPastille.length === 1  ? 'assets/icon/NewIcons/icon-resto-new-Rr-org-single.png' : 'assets/icon/NewIcons/icon-resto-new-Rr.png' ) ;
        let isPastille = resultRestoPastille.length > 0 ? 2 : 0;

        let marker

        /*const marker = L.marker(
            L.latLng(parseFloat(item.lat), parseFloat(item.long)),
            {
                icon: isSelected ? setIconn(poi_icon_Selected,"" , isPastille) : setIconn(poi_icon, "", isPastille),
                cleNom: item.denominationF,
                id: item.id
            }
        );*/

        if(!item.moyenne_note){
            marker = L.marker(
                L.latLng(parseFloat(item.lat), parseFloat(item.long)),
                {
                    icon: isSelected ? setIconn(poi_icon_Selected,"" , isPastille) : setIconn(poi_icon, "", isPastille),
                    cleNom: item.denominationF,
                    id: item.id,
                    draggable:false
                }
            );
        }else{
            marker=this.setSpecialMarkerToShowNote(L.latLng(parseFloat(item.lat), parseFloat(item.long)),item, isSelected, poi_icon, poi_icon_Selected, isPastille)
        }

        marker.bindTooltip(title,{ direction: "top", offset: L.point(0, -30)}).openTooltip();

        marker.on('click', (e) => {
            ////close right if this open
            this.closeRightSide();

            this.updateCenter( parseFloat(item.lat ), parseFloat(item.long ), this.zoomDetails);

            let resultRestoPastille= this.listRestoPastille.length > 0 ? this.listRestoPastille.filter(jtem => parseInt(jtem.id_resto) === parseInt(item.id)) : [];

            let poi_icon =  resultRestoPastille.length > 1 ? 'assets/icon/NewIcons/icon-resto-new-B-vert-multi.png' : (resultRestoPastille.length === 1  ? 'assets/icon/NewIcons/icon-resto-new-B-org-single.png' : 'assets/icon/NewIcons/icon-resto-new-B.png' ) ;
            let poi_icon_Selected=  resultRestoPastille.length > 1 ? 'assets/icon/NewIcons/icon-resto-new-Rr-vert-multi.png' : (resultRestoPastille.length === 1  ? 'assets/icon/NewIcons/icon-resto-new-Rr-org-single.png' : 'assets/icon/NewIcons/icon-resto-new-Rr.png' ) ;
            let isPastille = resultRestoPastille.length > 0 ? 2 : 0;



            const icon_R = L.Icon.extend({
                options: {
                    iconUrl: IS_DEV_MODE ? this.currentUrl.origin + "/" + poi_icon_Selected  : this.currentUrl.origin + "/public/" + poi_icon_Selected,
                    iconSize: isPastille === 2 ? [45, 60] : [30,45] ,
                    iconAnchor: [11, 30],
                    popupAnchor: [0, -20],
                    shadowSize: [68, 95],
                    shadowAnchor: [22, 94]
                }
            })

            if(!item.moyenne_note){
                marker.setIcon(new icon_R)
            }else{
                marker.setIcon(this.setSpecialIcon(item, true, poi_icon, poi_icon_Selected, isPastille))
            }

            if (this.marker_last_selected && this.marker_last_selected != marker ) {
                
                resultRestoPastille= this.listRestoPastille.length > 0 ? this.listRestoPastille.filter(jtem => parseInt(jtem.id_resto) === parseInt(this.marker_last_selected.options.id)) : [];
                poi_icon =  resultRestoPastille.length > 1 ? 'assets/icon/NewIcons/icon-resto-new-B-vert-multi.png' : (resultRestoPastille.length === 1  ? 'assets/icon/NewIcons/icon-resto-new-B-org-single.png' : 'assets/icon/NewIcons/icon-resto-new-B.png' ) ;

                const icon_B = L.Icon.extend({
                    options: {
                        iconUrl: IS_DEV_MODE ? this.currentUrl.origin + "/" + poi_icon :  this.currentUrl.origin + "/public/" + poi_icon,
                        iconSize: [32,50],
                        iconAnchor: [11, 30],
                        popupAnchor: [0, -20],
                        //shadowUrl: 'my-icon-shadow.png',
                        shadowSize: [68, 95],
                        shadowAnchor: [22, 94]
                    }
                })

                let oneResto = this.default_data.find(jtem => parseInt(this.marker_last_selected.options.id) === parseInt(jtem.id));

                if(!oneResto.moyenne_note){
                    this.marker_last_selected.setIcon(new icon_B)
                }else{
                    this.marker_last_selected.setIcon(this.setSpecialIcon(oneResto, false, poi_icon, poi_icon_Selected, isPastille))
                }

            }
            this.marker_last_selected = marker;

            this.markers.refreshClusters();

            if (screen.width < 991) {
                getDetailResto(item.dep, item.depName, item.id, false)
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

            // const api_data= (this.id_dep) ? `/Coord/Spec/Restaurant/${this.id_dep}/${param}` : `/Coord/All/Restaurant${param}`;
            const response = await fetch(`${this.api_data}${param}`);
            const responseJson = await response.json();
            let new_data = responseJson.data;
            
            // const new_data_filterd = new_data.filter(item => !this.default_data.some(j => j.id === item.id));
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

    updateListRestoPastille( idResto, tribuName){
        this.listRestoPastille.push({id_resto: idResto, tableName: tribuName })
        this.updateStateResto(idResto)
    }

    updateListRestoDepastille(idResto, tribuName){
        this.listRestoPastille = this.listRestoPastille.filter(item=>{ return (parseInt(item.id_resto) != parseInt(idResto) || item.tableName != tribuName)})
        this.updateStateResto(idResto)
    }


    updateStateResto(idResto){
        let resultRestoPastille= this.listRestoPastille.length > 0 ? this.listRestoPastille.filter(jtem => parseInt(jtem.id_resto) === parseInt(idResto)) : [];
        let poi_icon_Selected=  resultRestoPastille.length > 1 ? 'assets/icon/NewIcons/icon-resto-new-Rr-vert-multi.png' : (resultRestoPastille.length === 1  ? 'assets/icon/NewIcons/icon-resto-new-Rr-org-single.png' : 'assets/icon/NewIcons/icon-resto-new-Rr.png' ) ;
        let isPastille = resultRestoPastille.length > 0 ? 2 : 0;

        this.markers.eachLayer((marker) => {
            if (parseInt(marker.options.id) === parseInt(idResto)) {
                /*const icon_R = L.Icon.extend({
                    options: {
                        iconUrl: IS_DEV_MODE ? this.currentUrl.origin + "/"+  poi_icon_Selected: this.currentUrl.origin + "/public/" + poi_icon_Selected,
                        iconSize: isPastille === 2 ? [45, 60] : [30,45] ,
                        iconAnchor: [11, 30],
                        popupAnchor: [0, -20],
                        shadowSize: [68, 95],
                        shadowAnchor: [22, 94]
                    }
                })*/
                // marker.setIcon(new icon_R);
                const oneResto = this.default_data.find(jtem => parseInt(idResto) === parseInt(jtem.id));
                marker.setIcon(this.setSpecialIcon(oneResto, true, poi_icon_Selected, poi_icon_Selected, isPastille))
            }
        });

        this.markers.refreshClusters();
    }

    injectListRestoPastille(){
        const restoPastilleTab= [];
        this.listRestoPastille.forEach(item => {
            const restoPastille = this.default_data.find(jtem => parseInt(item.id_resto) === parseInt(jtem.id));
            if( restoPastille ){
                restoPastilleTab.push({ 
                    id: restoPastille.id, 
                    name: restoPastille.denominationF, 
                    depName: restoPastille.depName, 
                    dep: restoPastille.dep ,
                    logo_path: item.logo_path,
                    name_tribu_t_muable: item.name_tribu_t_muable
                })
            }
        })
        // this.default_data
        injectListMarker(restoPastilleTab)
    }

    /**
     * @Author Nantenaina
     * où: On utilise cette fonction dans la rubrique restaurant, restaurant specifique dép, arrondissement et tous de la carte cmz, 
     * localisation du fichier: dans MarkerClusterResto.js,
     * je veux: mettre à jour la note moyenne sur un POI
     * si une POI a une note, la note se montre en haut à gauche du POI 
     */
    showNoteMoyenneRealTime(idResto, note){
        let resultRestoPastille= this.listRestoPastille.length > 0 ? this.listRestoPastille.filter(jtem => parseInt(jtem.id_resto) === parseInt(idResto)) : [];
        let poi_icon_Selected=  resultRestoPastille.length > 1 ? 'assets/icon/NewIcons/icon-resto-new-Rr-vert-multi.png' : (resultRestoPastille.length === 1  ? 'assets/icon/NewIcons/icon-resto-new-Rr-org-single.png' : 'assets/icon/NewIcons/icon-resto-new-Rr.png' ) ;
        let isPastille = resultRestoPastille.length > 0 ? 2 : 0;

        this.markers.eachLayer((marker) => {
            if (parseInt(marker.options.id) === parseInt(idResto)) {
                let oneResto = this.default_data.find(jtem => parseInt(idResto) === parseInt(jtem.id));
                oneResto.moyenne_note = parseFloat(note).toFixed(2)
                marker.setIcon(this.setSpecialIcon(oneResto, true, poi_icon_Selected, poi_icon_Selected, isPastille))
            }
        });

        this.markers.refreshClusters();
    }

    /**
     *@author Nantenaina a ne pas contacté pendant les congés 
      où: on Utilise cette fonction dans la rubrique resto et tous carte cmz, 
     * localisation du fichier: dans MarkerClusterResto.js,
     * je veux: rendre le marker draggable
     * si un utilisateur veut modifier une ou des informations
     * @param {} id 
     */
    makeMarkerDraggable(id){
        this.markers.eachLayer((marker) => {
            if (parseInt(marker.options.id) === parseInt(id) ) {
                let initialPos=marker.getLatLng();
                marker.dragging.enable()
                
                marker.on("dragend",(e)=>{
                    let position = marker.getLatLng();
                    let lat=position.lat
                    let lng=position.lng
                    $("#userModifResto").modal("show")
                    document.querySelector("#newLatitude").value = lat
                    document.querySelector("#newLongitude").value = lng
                    document.querySelector("#newIdResto").value = id
                    setTimeout(()=>{
                        swal("Ça fait 10 minutes que vous n'avez effectué aucune modification sur le marquer, le mode interactif sur le marquer sera désactivé.").then(()=>{
                            marker.setLatLng(initialPos, {
                                draggable: 'false'
                            })
                            marker.dragging.disable()

                        })
                        
                    },600000)

                    console.log(position)
                })

                console.log(marker)
            }
        });
    }

}