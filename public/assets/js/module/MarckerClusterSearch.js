class MarckerClusterSearch extends MapModule  {

    constructor(nom_dep = null, id_dep = null) {
        const url_test= new URL(window.location.href);
        const search_type= url_test.pathname;
        
        let map_for_type= "";
        if( search_type.includes("/restaurant")){
            map_for_type="resto"
        }else if(search_type.includes("/ferme")){
            map_for_type="ferme"
        }else if(search_type.includes("/station")){
            map_for_type="station"
        }else if(search_type.includes("/golf")){
            map_for_type="golf"
        }else if(search_type.includes("/tabac")){
            map_for_type="tabac"
        }else if(search_type.includes("/tous")){
            map_for_type="tous"
        }

        super(id_dep,nom_dep, map_for_type)

        this.url_test = url_test;

        if( document.querySelector("#open-navleft")){
            document.querySelector("#open-navleft").parentElement.removeChild(document.querySelector("#open-navleft"));
        }
    }

    async onInit(isAddControl=false) {

        const url = new Request(this.url_test.href.replace("search", 'api/search'));
        this.isAddControl = isAddControl;
        try {
            // this.getGeos()
            this.createMarkersCluster();
            
            const response = await fetch(url);
            this.default_data = await response.json();
            this.data = this.default_data;  /// [ results [ data, length, type], allIdRestoPastille,type, cles0, cles1, origin_cles1]

            this.listRestoPastille = this.data.allIdRestoPastille;

            // const responsePos = await fetch(`https://nominatim.openstreetmap.org/?addressdetails=1&q=${this.data.origin_cles1}&format=json&limit=1`)
            // const responsePos = await fetch(`https://nominatim.openstreetmap.org/search?format=json&city=${this.data.origin_cles1}&country=France`)
            // const address = await responsePos.json();

            //// In cas API openStreetMap failed or return empty
            // const memoryCenter= getDataInSessionStorage("memoryCenter") ? JSON.parse(getDataInSessionStorage("memoryCenter")) : null;
            // const latLong= (address.length> 0) ? { lat: address[0].lat, long: address[0].lon } : { lat: memoryCenter.coord.lat, long: memoryCenter.coord.lng };

            const latLong= await this.getCenterFromOpenStreetMap();
            this.initMap(latLong.lat, latLong.long, latLong.zoom, this.isAddControl);
            this.bindAction();

            this.saveBoundsMap();
        } catch (e) {
            console.log(e)
        }
    }


    async getCenterFromOpenStreetMap(){
        const memoryCenter= getDataInSessionStorage("memoryCenter") ? JSON.parse(getDataInSessionStorage("memoryCenter")) : null;
        let latLong = memoryCenter ? { lat: memoryCenter.coord.lat, long: memoryCenter.coord.lng, zoom : memoryCenter.zoom } : { lat: null, long: null, zoom: null };

        try{
            let data_origin_cle1=this.data.origin_cles1.trim();
            console.log(data_origin_cle1)
            if((data_origin_cle1.length < 3 && ( parseInt(data_origin_cle1) > 0 &&  parseInt(data_origin_cle1) < 95 ) || data_origin_cle1.toLowerCase() === "nord")){
                const depCode= data_origin_cle1.toLowerCase() === "nord" ? 59 : parseInt(data_origin_cle1) ;
                latLong=  { lat: centers[depCode].lat, long: centers[depCode].lng, zoom : centers[depCode].zoom };
            }else{
                const dataLink= [
                    {
                        regex : /(([a-zA-Z-éÉèÈàÀùÙâÂêÊîÎôÔûÛïÏëËüÜçÇæœ'.]*\s)\d*(\s[a-zA-Z-éÉèÈàÀùÙâÂêÊîÎôÔûÛïÏëËüÜçÇæœ']*)*,)*\d*(\s[a-zA-Z-éÉèÈàÀùÙâÂêÊîÎôÔûÛïÏëËüÜçÇæœ']*)+\s([\d]{5})\s[a-zA-Z-éÉèÈàÀùÙâÂêÊîÎôÔûÛïÏëËüÜçÇæœ']+/gm,
                        clesType:"completAdresss",
                        zoom: 17,
                        link : `https://nominatim.openstreetmap.org/?addressdetails=1&q=${data_origin_cle1}&format=json&limit=1`
                    },
                    {
                        regex: /[\d]{5}/g,
                        clesType:"codepostal",
                        zoom: 13,
                        link : `https://nominatim.openstreetmap.org/search?format=json&postalcode=${data_origin_cle1}&country=France&limit=1`
                    },
                    {
                        regex: /([a-zA-Z-éÉèÈàÀùÙâÂêÊîÎôÔûÛïÏëËüÜçÇæœ']*)+/g,
                        clesType : "city",
                        zoom: 13,
                        link : `https://nominatim.openstreetmap.org/search?format=json&city=${data_origin_cle1}&country=France&limit=1`
                    },
                    
                ]
                
                let useLink = dataLink.find(item =>item.regex.test(data_origin_cle1))
                
                const apiOpenStreetMap = useLink ? useLink.link : `https://nominatim.openstreetmap.org/?addressdetails=1&q=${data_origin_cle1}&format=json&limit=1`;
                let responsePos = await fetch(apiOpenStreetMap)
                let address = await responsePos.json();

                if( address.length === 0) {
                    responsePos = await fetch(`https://nominatim.openstreetmap.org/?addressdetails=1&q=${data_origin_cle1}&format=json&limit=1`)
                    address = await responsePos.json();

                    if( address.length === 0 ){
                        const cleWord= data_origin_cle1.replaceAll("-", " ").replaceAll("_", " ").split(" ");
                        const regexCodepostal=/[\d]{5}/g;

                        for(let i=0; i < cleWord.length; i++){
                            const cle= cleWord[i];

                            if(regexCodepostal.test(cle)){
                                responsePos = await fetch(`https://nominatim.openstreetmap.org/search?format=json&postalcode=${cle}&country=France&limit=1`)
                                address = await responsePos.json();

                            }else{
                                // responsePos = await fetch(`https://nominatim.openstreetmap.org/?addressdetails=1&q=${cleWord[i]}&format=json&limit=1`)
                                responsePos = await fetch(`https://nominatim.openstreetmap.org/search?format=json&city=${cle}&country=France&limit=1`)
                                address = await responsePos.json();
}

                            if(address.length !== 0 ){
                                break;
                            }
                        }
                    }
                }
    
                //// In cas API openStreetMap failed or return empty
                const memoryCenter= getDataInSessionStorage("memoryCenter") ? JSON.parse(getDataInSessionStorage("memoryCenter")) : null;
                latLong= (address.length> 0) ? { lat: address[0].lat, long: address[0].lon, zoom: useLink.zoom } : { lat: memoryCenter.coord.lat, long: memoryCenter.coord.lng, zoom: memoryCenter.zoom };
            }
        }catch (e){
            console.log(e)
        }finally{
            return latLong;
        }
    }


    saveBoundsMap(){
        const x= this.getMax(this.map.getBounds().getWest(),this.map.getBounds().getEast())
        const y= this.getMax(this.map.getBounds().getNorth(), this.map.getBounds().getSouth())
        const lastSearchPosition = {
            zoom: 13,
            position : { minx:x.min, miny:y.min, maxx:x.max, maxy:y.max }
        }
        setDataInSessionStorage("lastSearchPosition", JSON.stringify(lastSearchPosition))
    }

    async getAdresseDetailsOpenStrettMap(cles){
        try{
            

            const response = await fetch(`https://nominatim.openstreetmap.org/?addressdetails=1&q=${cles}&format=json&limit=1`)
            const address = await response.json();

            const memoryCenter= getDataInSessionStorage("memoryCenter") ? JSON.parse(getDataInSessionStorage("memoryCenter")) : null;
            const latLong= (address.length>0) ?  { lat: address[0].lat, long: address[0].lng } : { lat: memoryCenter.coord.lat, long: memoryCenter.coord.lng };

            this.initMap(latLong.lat, latLong.long, null, this.isAddControl);
            this.bindAction();
        }catch(e){
            console.log(e)
        }
    }

    bindAction() {
        const { results } = this.data;
        this.addMarker(results[0]);
        
        // this.addEventOnMap(this.map, this.markers);
    }

    displayData() {
        console.log(this.allIdRestoPastille)
        console.log(this.data)
        console.log(this.geos)
        console.log(this.map)
    }

    createMarkersCluster() {
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

    addMarker(newData) {
        if( newData.length > 0 ){
            newData.forEach(item => {
                if( item.ferme !== undefined ){
                    // address_HTML = "<br><span class='fw-bolder'> Adresse:</span> <br>" + item.add;
                    // miniFiche_HTML = "<span class='fw-bolder'>Ferme:</span>  <br>" + item.nom + ".</br><span class='fw-bolder'> Departement:</span>  <br>" + item.dep +"." + address_HTML;
                    // image_icon= "icon-ferme-new-B.png";

                    this.settingSingleMarkerFerme(item)

                }else if( item.station !== undefined ){
                    // miniFiche_HTML =setMiniFicheForStation(item.nom, item.add,item.prixE85,item.prixGplc,item.prixSp95,item.prixSp95E10,item.prixGasoil,item.prixSp98 )
                    // image_icon= "icon-station-new-B.png";

                    this.settingSingleMarkerStation(item)

                }else if( item.resto !== undefined ){
                    // const fullAdresse=`${item.numvoie} ${item.typevoie} ${item.nomvoie} ${item.codpost} ${item.villenorm}`
                    // address_HTML = "<br><span class='fw-bolder'> Adresse:</span> <br>" + fullAdresse;
                    // miniFiche_HTML = "<span class='fw-bolder'> Restaurant:</span>  " + item.denominationF + ".<span class='fw-bolder'><br> Departement:</span>  " + item.depName +"." + address_HTML;
                    // image_icon= "icon-resto-new-B.png";

                    this.settingSingleMarkerResto(item);
                }else if (item.golf !== undefined){
                    this.settingSingleMarkerGolf(item);
                }else if( item.tabac !== undefined){
                    this.setingSingleMarkerTabac(item);
                }
            })

            ////affiche les resultats.
            this.map.addLayer(this.markers);
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

        const url = new URL(window.location.href);
        const miniFicheOnHover = setMiniFicheForStation(item.nom, item.adresse, item.prixE85, item.prixGplc, item.prixSp95, item.prixSp95E10, item.prixGasoil, item.prixSp98)
        var marker = L.marker(L.latLng(parseFloat(item.lat), parseFloat(item.long)), { icon: setIconn("assets/icon/NewIcons/icon-station-new-B.png"), id: item.id, type: "station" });
        marker.bindTooltip(miniFicheOnHover, { direction: "auto", offset: L.point(0, -30) }).openTooltip();
        marker.on('click', (e) => {
            /// close RightSide
            this.closeRightSide();

            const latlng = L.latLng(marker._latlng.lat, marker._latlng.lng);
            this.map.setView(latlng, 13);

            const coordAndZoom = {
                zoom: e.target.__parent._zoom + 1,
                coord: e.target.__parent._cLatLng
            }
            setDataInLocalStorage("coordSearch", JSON.stringify(coordAndZoom))

            // @Route("/station/departement/{depart_code}/{depart_name}/details/{id}" , name="station_details", methods={"GET"})
            if (screen.width < 991) {
                getDetailStation(item.depName.trim().replace("?", ""), item.dep.toString().trim(),item.id, true)
                // getDetailHomeForMobile("/station/departement/" + item.dep.toString().trim() + "/" + item.depName.trim().replace("?", "") + "/details/" + item.id)
            } else {
                getDetailStation(item.depName.trim().replace("?", ""), item.dep.toString().trim(),item.id, true)
            }

            const icon_R = L.Icon.extend({
                options: {
                    iconUrl: IS_DEV_MODE ? url.origin + "/assets/icon/NewIcons/icon-station-new-R.png" : url.origin + "/public/assets/icon/NewIcons/icon-station-new-R.png",
                    iconSize: [32, 50],
                    iconAnchor: [11, 30],
                    popupAnchor: [0, -20],
                    //shadowUrl: 'my-icon-shadow.png',
                    shadowSize: [68, 95],
                    shadowAnchor: [22, 94]
                }
            })
            marker.setIcon(new icon_R);

            this.updateLastMarkerSelected(marker, "station");

            this.markers.refreshClusters();
        })

        this.markers.addLayer(marker);
    }

    settingSingleMarkerFerme(item) {
        const adress = "<br><span class='fw-bolder'> Adresse:</span> <br>" + item.adresseFerme;

        var title = "<span class='fw-bolder'>Ferme:</span> " + item.nomFerme + ". <br><span class='fw-bolder'> Departement:</span>" + item.departement + "." + adress;
        var marker = L.marker(L.latLng(parseFloat(item.lat), parseFloat(item.long)), { icon: setIconn('assets/icon/NewIcons/icon-ferme-new-B.png'), id: item.id, type: "ferme" });

        marker.bindTooltip(title, { direction: "auto", offset: L.point(0, -30) }).openTooltip();

        marker.on('click', (e) => {
            /// close RightSide
            this.closeRightSide();

            this.updateCenter( parseFloat(item.lat ), parseFloat(item.long ), this.zoomDetails);
            
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
            marker.setIcon(new icon_R);
            this.updateLastMarkerSelected(marker, "ferme");

            if (screen.width < 991) {
                getDetailFerme(item.departement, item.departementName, item.id, true)
                // let pathDetails = `/ferme/departement/${item.departementName}/${item.departement}/details/${item.id}`
                // getDetailHomeForMobile(pathDetails)
            } else {
                // getDetailsFerme(pathDetails, true)getDetailStation
                getDetailFerme(item.departement, item.departementName, item.id, true)
            }


            this.markers.refreshClusters();
        })
        this.markers.addLayer(marker);
    }

    settingSingleMarkerResto(item) {

        const departementName = item.depName
        const adresseRestaurant = `${item.numvoie} ${item.typevoie} ${item.nomvoie} ${item.codpost} ${item.villenorm}`
        const adress = "<br><span class='fw-bolder'> Adresse:</span> <br>" + adresseRestaurant;

        const title = "<span class='fw-bolder'> Restaurant:</span>  " + item.denominationF + ".<span class='fw-bolder'><br> Departement:</span>  " + departementName + "." + adress;
        
        let resultRestoPastille= this.listRestoPastille.length > 0 ? this.listRestoPastille.filter(jtem => parseInt(jtem.id_resto) === parseInt(item.id)) : [];
        let poi_icon =  resultRestoPastille.length > 1 ? 'assets/icon/NewIcons/icon-resto-new-B-vert-multi.png' : (resultRestoPastille.length === 1  ? 'assets/icon/NewIcons/icon-resto-new-B-org-single.png' : 'assets/icon/NewIcons/icon-resto-new-B.png' ) ;
        let isPastille = resultRestoPastille.length > 0 ? 2 : 0;

        // const marker = L.marker(L.latLng(parseFloat(item.lat), parseFloat(item.long)), { icon: setIconn('assets/icon/NewIcons/icon-resto-new-B.png'),id: item.id, type: "resto" });
        // const marker = L.marker(L.latLng(parseFloat(item.lat), parseFloat(item.long)), { icon: setIconn(poi_icon, '', isPastille ), id: item.id, type: "resto" });

        let marker

        if(!item.moyenne_note){
            marker = L.marker(L.latLng(parseFloat(item.lat), parseFloat(item.long)), 
                                { icon: setIconn(poi_icon, 
                                    '', 
                                    isPastille ), 
                                    id: item.id, 
                                    type: "resto" 
                                }
                            );
        }else{
            marker=this.setSpecialMarkerToShowNote(L.latLng(parseFloat(item.lat), parseFloat(item.long)),item, false, poi_icon, poi_icon, isPastille)
        }

        marker.bindTooltip(title, { direction: "top", offset: L.point(0, -30) }).openTooltip();

        marker.on('click', (e) => {
            /// close RightSide
            this.closeRightSide();


            let resultRestoPastille= this.listRestoPastille.length > 0 ? this.listRestoPastille.filter(jtem => parseInt(jtem.id_resto) === parseInt(e.target.options.id)) : [];
            let poi_icon_Selected=  resultRestoPastille.length > 1 ? 'assets/icon/NewIcons/icon-resto-new-Rr-vert-multi.png' : (resultRestoPastille.length === 1  ? 'assets/icon/NewIcons/icon-resto-new-Rr-org-single.png' : 'assets/icon/NewIcons/icon-resto-new-Rr.png' ) ;
            let isPastille = resultRestoPastille.length > 0 ? 2 : 0;
    
            
            this.updateCenter( parseFloat(item.lat ), parseFloat(item.long ), this.zoomDetails);
            const icon_R = L.Icon.extend({
                options: {
                    // iconUrl: IS_DEV_MODE ? this.currentUrl.origin + "/assets/icon/NewIcons/icon-resto-new-Rr.png" : this.currentUrl.origin + "/public/assets/icon/NewIcons/icon-resto-new-Rr.png",
                    // iconSize: [32,50],
                    iconUrl: IS_DEV_MODE ? this.currentUrl.origin + "/" + poi_icon_Selected  : this.currentUrl.origin + "/public/" + poi_icon_Selected,
                    iconSize: isPastille === 2 ? [45, 60] : [30,45] ,
                    iconAnchor: [11, 30],
                    popupAnchor: [0, -20],
                    shadowSize: [68, 95],
                    shadowAnchor: [22, 94]
                }
            })

            if(!item.moyenne_note){
                marker.setIcon(new icon_R);
            }else{
                marker.setIcon(this.setSpecialIcon(item, true, poi_icon, poi_icon_Selected, isPastille))
            }

            this.updateLastMarkerSelected(marker, "resto");
            
            if (screen.width < 991) {
                getDetailResto(item.dep, item.depName, item.id, true)
                // var pathDetails = `/restaurant-mobile/departement/${departementName}/${dataResto.dep}/details/${dataResto.id}`;
                // location.assign(pathDetails)
            } else {
                getDetailResto(item.dep, item.depName, item.id, true)
            }
            
            this.markers.refreshClusters();
        })
        //reorganisePastille()
        this.markers.addLayer(marker);
    }


    settingSingleMarkerGolf(item){

        // console.log(item)
        const adress = "<br><span class='fw-bolder'> Adresse:</span> <br>" + item.commune + " " + item.adress;
        let title = "<span class='fw-bolder'> Golf: </span>" + item.name + ".<span class='fw-bolder'><br>Departement: </span>" + item.dep +"." + adress;
        
        let pathIcon="";
        let taille= 0 /// 0: min, 1: moyenne, 2 : grand

        if( item.user_status.a_faire === null &&  item.user_status.fait === null ){
            pathIcon='assets/icon/NewIcons/icon-blanc-golf-vertC.png';
        }else{
            if( item.user_status.a_faire == true ){
                pathIcon= "/assets/icon/NewIcons/icon-blanc-golf-vert-badgeC.png";
            }else if( item.user_status.fait == true ){
                pathIcon= "/assets/icon/NewIcons/icon-blanc-golf-vert-bC.png"
            }else{
                pathIcon='assets/icon/NewIcons/icon-blanc-golf-vertC.png';
            }
            // pathIcon= item.user_status === null ? 'assets/icon/NewIcons/icon-blanc-golf-vert-badgeC.png' : 'assets/icon/NewIcons/icon-blanc-golf-vert-bC.png';
            taille=1
        }
        let marker = L.marker(L.latLng(parseFloat(item.lat), parseFloat(item.long )), {icon: setIconn(pathIcon,'content_badge', taille), id: item.id, type: "golf"});
        
        marker.bindTooltip(title,{ direction:"top", offset: L.point(0,-30)}).openTooltip();

        marker.on('click', (e) => {
            /// close RightSide
            this.closeRightSide();

            const itemID= item.id
            const golfUpdate = this.data.results[0].find(jtem => jtem.hasOwnProperty('golf') && parseInt(jtem.id) === itemID );
            // console.log(golfUpdate)
            this.updateCenter( parseFloat(golfUpdate.lat ), parseFloat(golfUpdate.long ), this.zoomDetails);


            let pathIcon="";
            if( golfUpdate.user_status.a_faire === null &&  golfUpdate.user_status.fait === null ){
                pathIcon='/assets/icon/NewIcons/icon-rouge-golf-C.png';
            }else{
                if( golfUpdate.user_status.a_faire == true){
                    pathIcon= "/assets/icon/NewIcons/icon-vert-golf-orange.png";
                }else if(golfUpdate.user_status.fait == true ){
                    pathIcon= "/assets/icon/NewIcons/icon-vert-golf-bleu.png"
                }else{
                    pathIcon='/assets/icon/NewIcons/icon-rouge-golf-C.png';
                }
                // pathIcon= item.user_status === null ? 'assets/icon/NewIcons/icon-blanc-golf-vert-badgeC.png' : 'assets/icon/NewIcons/icon-blanc-golf-vert-bC.png';
                taille=1
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

            this.updateLastMarkerSelected(marker, "golf");
            
            if (screen.width < 991) {
                getDetailGolf(golfUpdate.dep, golfUpdate.nom_dep, golfUpdate.id, true)
            } else {
                getDetailGolf(golfUpdate.dep, golfUpdate.nom_dep, golfUpdate.id, true)
            }

            this.markers.refreshClusters();

        })

        this.markers.addLayer(marker);
    }

    setingSingleMarkerTabac(item){
        const adress = `<br><span class='fw-bolder'> Adresse:</span> <br> ${item.numvoie} ${item.typevoie} ${item.nomvoie} ${item.codpost} ${item.villenorm}`;
        let title = "<span class='fw-bolder'> Tabac: </span>" + item.name + ".<span class='fw-bolder'><br>Departement: </span>" + item.dep + " " + item.depName + " ." + adress;
        
        let pathIcon="assets/icon/NewIcons/tabac_black0.png";
        let taille= 0 /// 0: min, 1: moyenne, 2 : grand

        let marker = L.marker(L.latLng(parseFloat(item.lat), parseFloat(item.long )), {icon: setIconn(pathIcon,'content_badge', taille), id: item.id});
        
        marker.bindTooltip(title,{ direction:"top", offset: L.point(0,-30)}).openTooltip();

        marker.on('click', (e) => {
            /// close RightSide
            this.closeRightSide();

            this.updateCenter( parseFloat(item.lat ), parseFloat(item.long ), this.zoomDetails);

            pathIcon='/assets/icon/NewIcons/tabac_red0.png';
            
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

            this.updateLastMarkerSelected(marker, "tabac");

            this.markers.refreshClusters();

            
            if (screen.width < 991) {
                getDetailTabac(item.dep, item.nom_dep, item.id, true)
            } else {
                getDetailTabac(item.dep, item.nom_dep, item.id, true)
            }

        })

        this.markers.addLayer(marker);
    }

    updateLastMarkerSelected(marker, type) {

        if (this.marker_last_selected && this.marker_last_selected != marker) {

            const resultRestoPastille= this.listRestoPastille.length > 0 ? this.listRestoPastille.filter(jtem => parseInt(jtem.id_resto) === parseInt(this.marker_last_selected.options.id)) : [];
            const isPastille = resultRestoPastille.length > 0 ? 2 : 0;


            let icon_marker = "";
            if (this.marker_last_selected_type === "station") {
                icon_marker = IS_DEV_MODE ? `/assets/icon/NewIcons/icon-station-new-B.png` : `/public/assets/icon/NewIcons/icon-station-new-B.png`;
            } else if (this.marker_last_selected_type === "ferme") {
                icon_marker = IS_DEV_MODE ? `/assets/icon/NewIcons/icon-ferme-new-B.png` : `/public/assets/icon/NewIcons/icon-ferme-new-B.png`;
            
            } else if (this.marker_last_selected_type === "resto") {
                const poi_icon =  resultRestoPastille.length > 1 ? 'assets/icon/NewIcons/icon-resto-new-B-vert-multi.png' : (resultRestoPastille.length === 1  ? 'assets/icon/NewIcons/icon-resto-new-B-org-single.png' : 'assets/icon/NewIcons/icon-resto-new-B.png' );
                icon_marker = IS_DEV_MODE ? `${poi_icon}` : `public/${poi_icon}`;
                
                // icon_marker = IS_DEV_MODE ? `${this.currentUrl.origin}/assets/icon/NewIcons/icon-resto-new-B.png` : `${this.currentUrl.origin}/public/assets/icon/NewIcons/icon-resto-new-B.png`;
            } else if (this.marker_last_selected_type === "golf") {
            
                const last_marker= this.data.results[0].find(({id}) => parseInt(id) === parseInt(this.marker_last_selected.options.id))

                if( last_marker.user_status.a_faire === null &&  last_marker.user_status.fait === null){
                    icon_marker = IS_DEV_MODE ? `/assets/icon/NewIcons/icon-blanc-golf-vertC.png` : `/public/assets/icon/NewIcons/icon-blanc-golf-vertC.png`;
                }else{
                    if( last_marker.user_status.a_faire == true){
                        icon_marker = IS_DEV_MODE ? `/assets/icon/NewIcons/icon-blanc-golf-vert-badgeC.png` : `/public/assets/icon/NewIcons/icon-blanc-golf-vert-badgeC.png`;
                    }else if(last_marker.user_status.fait == true ){
                        icon_marker = IS_DEV_MODE ? `/assets/icon/NewIcons/icon-blanc-golf-vert-bC.png` : `/public/assets/icon/NewIcons/icon-blanc-golf-vert-bC.png`;
                    }else{
                        icon_marker = IS_DEV_MODE ? `/assets/icon/NewIcons/icon-blanc-golf-vertC.png` : `/assets/icon/NewIcons/icon-blanc-golf-vertC.png`;
                    }
                }
            } else if( this.marker_last_selected_type === "tabac" ){
                icon_marker = IS_DEV_MODE ? `/assets/icon/NewIcons/tabac_black0.png` : `/public/assets/icon/NewIcons/tabac_black0.png`;
            }

            const icon_B = L.Icon.extend({
                options: {
                    iconUrl: this.currentUrl.origin+icon_marker,
                    iconSize:isPastille > 0 ? [45, 60] : [32,50],
                    iconAnchor: [11, 30],
                    popupAnchor: [0, -20],
                    //shadowUrl: 'my-icon-shadow.png',
                    shadowSize: [68, 95],
                    shadowAnchor: [22, 94]
                }
            })

            if(this.marker_last_selected_type === "resto"){
                let oneResto = this.default_data.results[0].find(jtem => jtem.resto && parseInt(this.marker_last_selected.options.id) === parseInt(jtem.id))
                this.marker_last_selected.setIcon(this.setSpecialIcon(oneResto, false, icon_marker, icon_marker, 0))
            }else{
                this.marker_last_selected.setIcon(new icon_B)
            }

        }
        this.marker_last_selected = marker;
        this.marker_last_selected_type = type;
    }

    async updateData(new_min_ll, new_max_ll) {
        try {
            const data = { "last": { min: this.last_minll, max: this.last_maxll }, "new": { min: new_min_ll, max: new_max_ll } };

            if ((this.last_minll.lat > new_min_ll.lat) && (this.last_maxll.lng < new_max_ll.lng)) {
                ///same action update

                if (!this.is_online) {
                    this.is_online = true;
                    await this.addPeripheriqueMarker(data);
                    this.last_minll = new_min_ll;
                    this.last_maxll = new_max_ll;
                }

            }
        } catch (e) {
            console.log(e.message)
        }
    }

    async addPeripheriqueMarker(data) {
        const url = `/getLatitudeLongitudeForAll`;
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            let new_data = await response.json();

            new_data.ferme = new_data.ferme.filter(item => !this.default_data.ferme.some(j => j.id === item.id))
            new_data.station = new_data.station.filter(item => !this.default_data.station.some(j => j.id === item.id))
            new_data.resto = new_data.resto.filter(item => !this.default_data.resto.some(j => j.id === item.id))

            this.addMarker(this.checkeFilterType(new_data));
            this.is_online = false;

            // this.default_data= [ ...this.default_data, ...new_data ]
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

    clickOnMarker(id){
        this.markers.eachLayer((marker) => {
            if (parseInt(marker.options.id) === parseInt(id) ) {
                marker.fireEvent('click');
            }
        });
    }

    redirectOnAdresse(lat, lng, zoom){
        this.map.setView([lat, lng], zoom);
    }

    updateStateGolf(status, id){
        let user_status = { "a_faire" : false, "fait" : false }
        
        this.markers.eachLayer((marker) => {
            if (marker.options.type === "golf" && parseInt(marker.options.id) === parseInt(id) ) {
                let pathIcon= "";

                if( status === "fait"){
                    pathIcon='/assets/icon/NewIcons/icon-vert-golf-bleu.png';
                    user_status= { ...user_status , "fait" : true }
                }else if( status === "afaire"){
                    pathIcon='/assets/icon/NewIcons/icon-vert-golf-orange.png';
                    user_status= { ...user_status , "a_faire" : true }
                }else{ /// aucun 
                    pathIcon='/assets/icon/NewIcons/icon-rouge-golf-C.png';
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
            }
        });

        this.markers.refreshClusters();

        this.data.results[0] = this.data.results[0].map(item => {
            if( parseInt(item.id) === parseInt(id) ){
                item.user_status = { ...item.user_status , ...user_status }
            }
            return item;
        })
    }

    updateStateResto(idResto){
        let resultRestoPastille= this.listRestoPastille.length > 0 ? this.listRestoPastille.filter(jtem => parseInt(jtem.id_resto) === parseInt(idResto)) : [];
        let poi_icon_Selected=  resultRestoPastille.length > 1 ? 'assets/icon/NewIcons/icon-resto-new-Rr-vert-multi.png' : (resultRestoPastille.length === 1  ? 'assets/icon/NewIcons/icon-resto-new-Rr-org-single.png' : 'assets/icon/NewIcons/icon-resto-new-Rr.png' ) ;
        let isPastille = resultRestoPastille.length > 0 ? 2 : 0;

        this.markers.eachLayer((marker) => {
            if (parseInt(marker.options.id) === parseInt(idResto) && marker.options.type === "resto" ) {
                /*const icon_R = L.Icon.extend({
                    options: {
                        iconUrl: IS_DEV_MODE ? this.currentUrl.origin + "/"+  poi_icon_Selected: this.currentUrl.origin + "/public/" + poi_icon_Selected,
                        iconSize: isPastille === 2 ? [45, 60] : [30,45] ,
                        iconAnchor: [11, 30],
                        popupAnchor: [0, -20],
                        shadowSize: [68, 95],
                        shadowAnchor: [22, 94]
                    }
                })
                marker.setIcon(new icon_R);*/
                let oneResto = this.default_data.results[0].find(jtem => jtem.resto && parseInt(idResto) === parseInt(jtem.id) );
                marker.setIcon(this.setSpecialIcon(oneResto, true, poi_icon_Selected, poi_icon_Selected, isPastille))
            }
        });

        this.markers.refreshClusters();
    }

    injectListRestoPastille(){
        const restoPastilleTab= [];
        this.listRestoPastille.forEach(item => {
            const restoPastille = this.default_data.results[0].find(jtem => parseInt(item.id_resto) === parseInt(jtem.id) &&  jtem.resto !== undefined );
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
        injectListMarker(restoPastilleTab,true)
    }

    /**
     * @Author Nantenaina
     * où: On utilise cette fonction dans la rubrique restaurant, restaurant specifique dép, arrondissement et tous de la carte cmz, 
     * localisation du fichier: dans MarkerClusterSearch.js,
     * je veux: mettre à jour la note moyenne sur un POI
     * si une POI a une note, la note se montre en haut à gauche du POI
     */
    showNoteMoyenneRealTime(idResto, note){
        let resultRestoPastille= this.listRestoPastille.length > 0 ? this.listRestoPastille.filter(jtem => parseInt(jtem.id_resto) === parseInt(idResto)) : [];
        let poi_icon_Selected=  resultRestoPastille.length > 1 ? 'assets/icon/NewIcons/icon-resto-new-Rr-vert-multi.png' : (resultRestoPastille.length === 1  ? 'assets/icon/NewIcons/icon-resto-new-Rr-org-single.png' : 'assets/icon/NewIcons/icon-resto-new-Rr.png' ) ;
        let isPastille = resultRestoPastille.length > 0 ? 2 : 0;

        this.markers.eachLayer((marker) => {
            if (parseInt(marker.options.id) === parseInt(idResto) && marker.options.type === "resto" ) {
                // let oneResto = this.default_data.resto.find(jtem => parseInt(idResto) === parseInt(jtem.id))
                let oneResto = this.default_data.results[0].find(jtem => jtem.resto && parseInt(idResto) === parseInt(jtem.id) );
                oneResto.moyenne_note = parseFloat(note).toFixed(2)
                marker.setIcon(this.setSpecialIcon(oneResto, true, poi_icon_Selected, poi_icon_Selected, isPastille))
            }
        });

        this.markers.refreshClusters();
    }

    /**
     *@author Nantenaina a ne pas contacté pendant les congés 
      où: on Utilise cette fonction dans la rubrique resto et tous carte cmz, 
     * localisation du fichier: dans MarkerClusterSearch.js,
     * je veux: rendre le marker draggable
     * si un utilisateur veut modifier une ou des informations
     * @param {} id 
     */
      makeMarkerDraggable(id){
        this.markers.eachLayer((marker) => {
            if (parseInt(marker.options.id) === parseInt(id)  && marker.options.type === "resto" ) {
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