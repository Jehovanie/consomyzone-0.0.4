class MarckerClusterResto extends MapModule  {
    
    constructor(nom_dep=null,id_dep=null, codinsee=null){
        super(id_dep,nom_dep, "resto");
        this.codinsee = codinsee;
    }

    async onInit(isAddControl=false){
        this.ALREADY_INIT = false;
        try{
            this.createMarkersCluster();
            this.initMap(null, null, null, isAddControl);

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
            else{
                const x= this.getMax(this.map.getBounds().getWest(),this.map.getBounds().getEast())
                const y= this.getMax(this.map.getBounds().getNorth(), this.map.getBounds().getSouth())
                const minx= x.min, miny=y.min, maxx=x.max, maxy=y.max;
                param= "?minx="+encodeURIComponent(minx)+"&miny="+encodeURIComponent(miny)+"&maxx="+encodeURIComponent(maxx)+"&maxy="+encodeURIComponent(maxy);
            }

            // "data" => $datas,
            // "allIdRestoPastille" => $arrayIdResto

            const response= await fetch(`${this.api_data}${param}`);
            const responseJson = await response.json();

            this.default_data= responseJson.data;
            this.data=  this.default_data; 
            
            this.listRestoPastille= responseJson.allIdRestoPastille;
            this.bindAction();

            if(getDataInSessionStorage("lastSearchPosition")){
                clearDataInSessionStorage("lastSearchPosition")
            }

        }catch(e){
            console.log(e)
        }
    }

    createMarkersCluster(){

        // var GetRadius = function (zoom) {
        //     // return 210 - zoom * 10;
        //     return 10;
        // }
        const that= this;
        this.markers = L.markerClusterGroup({ 
            chunkedLoading: true,
            spiderfyOnEveryZoom: true,
            disableClusteringAtZoom: true,
            spiderfyOnEveryZoom: true,
            animate: true,
            // maxClusterRadius: 40,
            // iconCreateFunction: function (cluster) {
            //     console.log(cluster)
            //     return L.divIcon({
            //         className: "d-none",
            //     });
            // },
            
            // maxClusterRadius: function(zoom){
            //     return 210 - zoom * 10
            //     // return 10
            // },
            // iconCreateFunction: function (cluster) {
            //     if(that.marker_last_selected){
            //         console.log(cluster)
            //         let sepcMarmerIsExist = false;
            //         for (let g of  cluster.getAllChildMarkers()){
            //             if (parseInt(that.marker_last_selected.options.id) === parseInt(g.options.id)) { 
            //                 sepcMarmerIsExist = true;
            //                 break;
            //             }
            //         }

            //         if(sepcMarmerIsExist){
            //             return L.divIcon({
            //                 html: '<div class="markers-spec" id="c">' + cluster.getChildCount() + '</div>',
            //                 className: "spec_cluster",
            //                 iconSize:L.point(35,35)
            //             });
            //         }else{
            //             return L.divIcon({
            //                 className: "d-none",
            //             });
            //         }
            //     }else{
            //         return L.divIcon({
            //             className: "d-none",
            //         });
            //     }
            // },
            
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
        const zoom = this.map._zoom;
        const x= this.getMax(this.map.getBounds().getWest(),this.map.getBounds().getEast())
        const y= this.getMax(this.map.getBounds().getNorth(), this.map.getBounds().getSouth())
        const  minx= x.min, miny=y.min, maxx=x.max, maxy=y.max;

        const ratio= zoom > 14 ? 3 : ( zoom > 11 ? 2 : 1);
        const ratioMin= parseFloat(parseFloat(y.min).toFixed(ratio));
        const ratioMax= parseFloat(parseFloat(y.max).toFixed(ratio));

        console.log(ratioMin, ratioMax);

        const dataMax= zoom === 19 ? 50 : ( zoom > 17 ? 25 : ( zoom > 15 ? 20 : ( zoom > 13 ? 10 : 5  )));
        const dataFiltered= [ ];

        let iterate_ratio= 1/(10**ratio)

        let init_iterate_ratio = ratioMin;
        while(parseFloat(init_iterate_ratio.toFixed(ratio)) < parseFloat(parseFloat(ratioMax+iterate_ratio).toFixed(ratio))){
            if( !dataFiltered.some((jtem) => parseFloat(init_iterate_ratio.toFixed(ratio)) === parseFloat(jtem.lat) )){
                dataFiltered.push({ lat: parseFloat(init_iterate_ratio.toFixed(ratio)),  data: [] })
            }

            init_iterate_ratio +=iterate_ratio;
        }
        console.log("dataFiltered")
        console.log(dataFiltered);

        newData.forEach(item => {
            const isInside = ( parseFloat(item.lat) > parseFloat(miny) && parseFloat(item.lat) < parseFloat(maxy) ) && ( parseFloat(item.long) > parseFloat(minx) && parseFloat(item.long) < parseFloat(maxx));
            const item_with_ratio= parseFloat(parseFloat(item.lat).toFixed(ratio));
            if(dataFiltered.some(jtem => parseFloat(jtem.lat) === item_with_ratio && jtem.data.length < dataMax ) && isInside ){

                this.settingSingleMarker(item, false);

                dataFiltered.forEach(ktem => {
                    if(parseFloat(ktem.lat) === item_with_ratio ){
                        ktem.data.push(item)
                    }
                })
            }
        })
        console.log(dataFiltered);

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

        // marker.on('mouseover', (e) => {
        //     let resultRestoPastille= this.listRestoPastille.length > 0 ? this.listRestoPastille.filter(jtem => parseInt(jtem.id_resto) === parseInt(item.id)) : [];
        //     let poi_icon =  resultRestoPastille.length > 1 ? 'assets/icon/NewIcons/icon-resto-new-B-vert-multi.png' : (resultRestoPastille.length === 1  ? 'assets/icon/NewIcons/icon-resto-new-B-org-single.png' : 'assets/icon/NewIcons/icon-resto-new-B.png' ) ;
        //     let poi_icon_Selected=  resultRestoPastille.length > 1 ? 'assets/icon/NewIcons/icon-resto-new-Rr-vert-multi.png' : (resultRestoPastille.length === 1  ? 'assets/icon/NewIcons/icon-resto-new-Rr-org-single.png' : 'assets/icon/NewIcons/icon-resto-new-Rr.png' ) ;
        //     let isPastille = resultRestoPastille.length > 0 ? 2 : 0;

        //     const icon_R = L.Icon.extend({
        //         options: {
        //             iconUrl: IS_DEV_MODE ? this.currentUrl.origin + "/" + poi_icon  : this.currentUrl.origin + "/public/" + poi_icon,
        //             iconSize: [55, 60],
        //             iconAnchor: [11, 30],
        //             popupAnchor: [0, -20],
        //             shadowSize: [68, 95],
        //             shadowAnchor: [22, 94]
        //         }
        //     })

        //     if(!item.moyenne_note){
        //         marker.setIcon(new icon_R)
        //     }else{
        //         marker.setIcon(this.setSpecialIcon(item, true, poi_icon, poi_icon_Selected, isPastille))
        //     }
        // })
        // marker.on('mouseout', (e) => {
        //     let resultRestoPastille= this.listRestoPastille.length > 0 ? this.listRestoPastille.filter(jtem => parseInt(jtem.id_resto) === parseInt(item.id)) : [];
        //     let poi_icon =  resultRestoPastille.length > 1 ? 'assets/icon/NewIcons/icon-resto-new-B-vert-multi.png' : (resultRestoPastille.length === 1  ? 'assets/icon/NewIcons/icon-resto-new-B-org-single.png' : 'assets/icon/NewIcons/icon-resto-new-B.png' ) ;
        //     let poi_icon_Selected=  resultRestoPastille.length > 1 ? 'assets/icon/NewIcons/icon-resto-new-Rr-vert-multi.png' : (resultRestoPastille.length === 1  ? 'assets/icon/NewIcons/icon-resto-new-Rr-org-single.png' : 'assets/icon/NewIcons/icon-resto-new-Rr.png' ) ;
        //     let isPastille = resultRestoPastille.length > 0 ? 2 : 0;

        //     const icon_R = L.Icon.extend({
        //         options: {
        //             iconUrl: IS_DEV_MODE ? this.currentUrl.origin + "/" + poi_icon  : this.currentUrl.origin + "/public/" + poi_icon,
        //             iconSize: [30,45] ,
        //             iconAnchor: [11, 30],
        //             popupAnchor: [0, -20],
        //             shadowSize: [68, 95],
        //             shadowAnchor: [22, 94]
        //         }
        //     })

        //     if(!item.moyenne_note){
        //         marker.setIcon(new icon_R)
        //     }else{
        //         marker.setIcon(this.setSpecialIcon(item, true, poi_icon, poi_icon_Selected, isPastille))
        //     }
        // })

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
        map.on("resize moveend", (e) => {
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
            new_data = new_data.filter(item => !this.default_data.some(j => parseInt(j.id) === parseInt(item.id)));

            // this.addMarker(this.checkeFilterType(new_data));
            this.default_data= this.default_data.concat(new_data)

            this.updateMarkersDisplay(new_size);

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



    updateMarkersDisplay(newSize){

        const zoom = this.map._zoom;
        const { minx, maxx, miny, maxy } = newSize;

        console.log("Zoom: " + zoom )
        console.log("newSize: " + " " + minx +" "+ maxx + " " +  miny + " " + maxy);

        let countMarkers= 0;

        //// REMOVE the outside the box
        this.markers.eachLayer((marker) => {
            const { lat, lng } = marker.getLatLng();
            const isInDisplay = ( lat > parseFloat(miny) && lat < parseFloat(maxy)) && ( lng > parseFloat(minx) && lng < parseFloat(maxx));
            if( !isInDisplay || countMarkers > 100 ){
                this.markers.removeLayer(marker);
            }else{
                countMarkers++;
            }
        });


        // const memoryCenter= getDataInSessionStorage("memoryCenter") ? JSON.parse(getDataInSessionStorage("memoryCenter")) : null;
        // memoryCenter.zoom
        /// add same data must be show
        if( zoom > 8 ){
            const ratio= zoom > 14 ? 3 : ( zoom > 11 ? 2 : 1);
            const dataMax= zoom === 19 ? 50 : ( zoom > 17 ? 25 : ( zoom > 15 ? 20 : ( zoom > 13 ? 10 : 5  )));
            const dataFilteredDerive= [ ];

            this.markers.eachLayer((marker) => {
                const temp= marker.getLatLng()
                if( !dataFilteredDerive.some((jtem) => parseFloat(parseFloat(temp.lat).toFixed(ratio))  === parseFloat(jtem.lat) )){

                    dataFilteredDerive.push({ lat: parseFloat(parseFloat(temp.lat).toFixed(ratio)),  data: [
                        this.default_data.find(item => parseInt(item.id) === parseInt(marker.options.id))
                    ] })

                }else{
                    dataFilteredDerive.forEach(ktem => {
                        if(parseFloat(parseFloat(temp.lat).toFixed(ratio)) === parseFloat( ktem.lat)){
                            if( ktem.data.length < dataMax ){
                                ktem.data.push(
                                    this.default_data.find(item => parseInt(item.id) === parseInt(marker.options.id))
                                )
                            }else{
                                this.markers.removeLayer(marker);
                            }
                        }
                    })
                }
            });

            const ratioMin= parseFloat(parseFloat(miny).toFixed(ratio))
            const ratioMax= parseFloat(parseFloat(maxy).toFixed(ratio))
            
            let iterate_ratio= 1/(10**ratio)

            let init_iterate_ratio = ratioMin;
            while(parseFloat(init_iterate_ratio.toFixed(ratio)) < parseFloat(parseFloat(ratioMax+iterate_ratio).toFixed(ratio))){
                if( !dataFilteredDerive.some((jtem) => parseFloat(init_iterate_ratio.toFixed(ratio)) === parseFloat(jtem.lat) )){
                    dataFilteredDerive.push({ lat: parseFloat(init_iterate_ratio.toFixed(ratio)),  data: [] })
                }

                init_iterate_ratio +=iterate_ratio;
            }

            console.log("dataFilteredDerive");
            console.log(dataFilteredDerive);

            console.log("Ratio: " + ratio)
            console.log("rationMin: " + ratioMin)
            console.log("rationMax: " + ratioMax)
            console.log(iterate_ratio)

            this.default_data.forEach(item => {
                const isCanDisplay = ( parseFloat(item.lat) > parseFloat(miny) && parseFloat(item.lat) < parseFloat(maxy) ) && ( parseFloat(item.long) > parseFloat(minx) && parseFloat(item.long) < parseFloat(maxx));
                
                if( isCanDisplay ){
                    let isAlreadyDisplay= false;
                    this.markers.eachLayer((marker) => {
                        if( parseInt(marker.options.id) === parseInt(item.id)){
                            isAlreadyDisplay = true;
                        }
                    })
    
                    if( !isAlreadyDisplay ){
                        if(dataFilteredDerive.some((jtem) => parseFloat(parseFloat(item.lat).toFixed(ratio))  === parseFloat(jtem.lat) )){
                            const itemDataDerive= dataFilteredDerive.find((single) => parseFloat(single.lat) === parseFloat(parseFloat(item.lat).toFixed(ratio)))
                            if( itemDataDerive && itemDataDerive.data.length < dataMax){
                                this.settingSingleMarker(item, false)
                                dataFilteredDerive.forEach(ktem => {
                                    if(parseFloat(parseFloat(item.lat).toFixed(ratio)) === parseFloat( ktem.lat)){
                                        ktem.data.push(item)
                                    }
                                })
                            }
                        }
                    }
                }
            })

            console.log("dataFilteredDerive");
            console.log(dataFilteredDerive);

        }else{
            console.log("Afficher same marker...");
            
            const ratio= zoom > 7 ? 1 : 0;
            const dataMax= 5;
            const dataFiltered= [ ];

            this.default_data.forEach(item => {
                if( !dataFiltered.find((jtem) => parseFloat(parseFloat(item.lat).toFixed(ratio))  === jtem.lat )){
                    dataFiltered.push({ lat: parseFloat(parseFloat(item.lat).toFixed(ratio)),  data: [item] })
                }else{
                    dataFiltered.forEach(ktem => {
                        if(parseFloat(parseFloat(item.lat).toFixed(ratio)) === ktem.lat && ktem.data.length < dataMax ){
                            ktem.data.push(item)
                        }
                    })
                }
            })
            console.log("isany tokony haseho: " + dataFiltered.length) ////tokony haseho....


            const dateFilteredPrime= [];
            this.markers.eachLayer((marker) => {
                const temp= marker.getLatLng()
                if( !dateFilteredPrime.find((jtem) => parseFloat(parseFloat(temp.lat).toFixed(ratio))  === jtem.lat )){
                    dateFilteredPrime.push({ lat: parseFloat(parseFloat(temp.lat).toFixed(ratio)),  data: [marker] })
                }else{
                    dateFilteredPrime.forEach(ktem => {
                        if(parseFloat(parseFloat(temp.lat).toFixed(ratio)) === ktem.lat){
                            if( ktem.data.length < dataMax ){
                                ktem.data.push(marker)
                            }else{
                                this.markers.removeLayer(marker);
                            }
                        }
                    })
                }
            });
            console.log("isany efa haseho: " + dateFilteredPrime.length) //// efa miseho

            dataFiltered.forEach(item => {
                if(dateFilteredPrime.find(jtem => item.lat === jtem.lat && item.data.length > jtem.data.length )){
                    const dataPrime= dateFilteredPrime.find(jtem => item.lat === jtem.lat)
                    item.data.forEach(ktem => {
                        if(!dataPrime.data.find(ptem => parseInt(ptem.options.id) === parseInt(ktem.id))){
                            this.settingSingleMarker(ktem, false)
                        }
                    })
                }else{
                    item.data.forEach(ktem => {
                        this.settingSingleMarker(ktem, false)
                    })
                }
               
            })
            console.log("dataFiltered");
            console.log(dataFiltered)
            // this.default_data.forEach(item => {
            //     const isCanDisplay = ( parseFloat(item.lat) > parseFloat(miny) && parseFloat(item.lat) < parseFloat(maxy) ) && ( parseFloat(item.long) > parseFloat(minx) && parseFloat(item.long) < parseFloat(maxx));
                
            //     if( isCanDisplay ){
            //         let isAlreadyDisplay= false;
            //         this.markers.eachLayer((marker) => {
            //             if( parseInt(marker.options.id) === parseInt(item.id)){
            //                 isAlreadyDisplay = true;
            //             }
            //         })
    
            //         if( !isAlreadyDisplay ){
            //             this.settingSingleMarker(item, false)
            //         }
            //     }
            // })
        }
        // this.markers.eachLayer((marker) => {
        //     if( id_layer_remove.find(id => id === marker.options.id)){
        //         console.log(marker.options.id)
        //     }
        // })


        let countMarkerst= 0;
        this.markers.eachLayer((marker) => {  countMarkerst++; });
        console.log("Total marker afficher: " + countMarkerst)
    }
}