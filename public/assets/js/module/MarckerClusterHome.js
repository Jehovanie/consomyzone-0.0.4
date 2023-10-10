class MarckerClusterHome extends MapModule  {

    constructor(nom_dep = null, id_dep = null,map_for_type="tous") {
    
        super(id_dep,nom_dep, map_for_type)

        if( document.querySelector("#open-navleft")){
            document.querySelector("#open-navleft").parentElement.removeChild(document.querySelector("#open-navleft"));
        }
    }

    async onInit(isAddControl=false) {
        // const url = `/getLatitudeLongitudeForAll`;
        try {
            this.createMarkersCluster();
            
            //// api get all data from server and return objects
            const response = await fetch("/dataHome");
            
            //// api get all data from server
            this.default_data = await response.json(); /// { station, ferme, resto, golf, tabac, allIdRestoPasstille}
            
            this.data = this.default_data;  /// { station, ferme, resto, golf, tabac, allIdRestoPasstille}
            
            this.listRestoPastille= this.default_data.allIdRestoPastille; /// [  { id_resto : ..., tableName : ..., name_tribu_t_muable : ..., logo_path : ... } , ... ]
            
            this.initMap(null, null, null, isAddControl);

            this.bindAction();

        }catch(e){
            console.log(e)
        }
    }

    bindAction() {
        this.addMarker(this.data);
        this.addEventOnMap(this.map);
        this.generateFilterAndSelectDep()
    }

    getGeos() {
        this.geos = [];
        if (this.id_dep) {
            if (this.id_dep === 20) {
                for (let corse of ['2A', '2B']) {
                    this.geos.push(franceGeo.features.find(element => element.properties.code == corse))
                }
            } else {
                this.geos.push(franceGeo.features.find(element => element.properties.code === this.id_dep))
            }
        } else {
            for (let f of franceGeo.features) {
                this.geos.push(f)
            }
        }
    }

    displayData() {
        console.log(this.data)
        console.log(this.geos)
        console.log(this.map)
    }

    createMarkersCluster() {
        const that = this;
        const temp= 200;
        this.markers = L.markerClusterGroup({
            chunkedLoading: true,
            chunkInterval: temp * 5,
            chunkDelay: temp,
            removeOutsideVisibleBounds: true,
            iconCreateFunction: function (cluster) {
                if(that.marker_last_selected){
                    let sepcMarmerIsExist = false;
                    for (let g of  cluster.getAllChildMarkers()){
                        if (parseInt(that.marker_last_selected.options.id) === parseInt(g.options.id)) { 
                            if(that.marker_last_selected.options.hasOwnProperty('type')){
                                if( that.marker_last_selected.options.type === g.options.type ){
                                    sepcMarmerIsExist = true;
                                }
                            }else{
                                sepcMarmerIsExist = true;
                            }
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
        const { station, ferme, resto, golf, tabac } = newData;

        if (station || ferme || resto || golf || tabac  ) {

            if (station.length > 0) {
                this.addStation(station);
            }

            ///all fermes
            if (ferme.length > 0) {
                this.addFerme(ferme)
            }

            ///all resto
            if (resto.length > 0) {
                this.addResto(resto);
            }

            ///all golf
            if ( golf.length > 0 ){
                this.addGolf(golf);
            }

            if( tabac.length > 0 ){
                this.addTabac(tabac);
            }

            this.map.addLayer(this.markers);
        } else {
            console.log("ERREUR : L'erreur se produit par votre réseaux.")
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

    addGolf(dataGolf){
        dataGolf.forEach(item => {
            this.settingSingleMarkerGolf(item)
        })
    }

    addTabac(dataTabac){
        dataTabac.forEach(item => {
            this.settingSingleMarkerTabac(item);
        })
    }


    settingSingleMarkerStation(item) {

        const miniFicheOnHover = setMiniFicheForStation(item.nom, item.adresse, item.prixE85, item.prixGplc, item.prixSp95, item.prixSp95E10, item.prixGasoil, item.prixSp98)
        var marker = L.marker(L.latLng(parseFloat(item.lat), parseFloat(item.long)), { icon: setIconn("assets/icon/NewIcons/icon-station-new-B.png") , id: item.id, type: "station" });

        marker.bindTooltip(miniFicheOnHover, { direction: "auto", offset: L.point(0, -30) }).openTooltip();
        
        this.handleClickStation(marker, item)
        this.markers.addLayer(marker);
    }

    handleClickStation(stationMarker,dataStation){
            
        stationMarker.on('click', (e) => {
            ////close right if this open
            this.closeRightSide();


            this.updateCenter( parseFloat(dataStation.lat ), parseFloat(dataStation.long ), this.zoomDetails);
            
            const icon_R = L.Icon.extend({
                options: {
                    iconUrl: IS_DEV_MODE ? this.currentUrl.origin + "/assets/icon/NewIcons/icon-station-new-R.png" : this.currentUrl.origin + "/public/assets/icon/NewIcons/icon-station-new-R.png",
                    iconSize: [32,50],
                    iconAnchor: [11, 30],
                    popupAnchor: [0, -20],
                    shadowSize: [68, 95],
                    shadowAnchor: [22, 94]
                }
            })

            stationMarker.setIcon(new icon_R);
            this.updateLastMarkerSelected(stationMarker, "station");
            
            if (screen.width < 991) {
                getDetailStation( dataStation.departementName.toString().trim().replace("?", ""), dataStation.departementCode.toString().toString().trim(), dataStation.id, true)
            } else {
                getDetailStation( dataStation.departementName.toString().trim().replace("?", ""), dataStation.departementCode.toString().toString().trim(), dataStation.id, true)
            }

        })

    }

    settingSingleMarkerFerme(item) {
      
        const adress = "<br><span class='fw-bolder'> Adresse:</span> <br>" + item.adresseFerme;
        const title = "<span class='fw-bolder'>Ferme: </span>" + item.nomFerme + ".<span class='fw-bolder'> <br> Departement:</span>" + item.departement + "." + adress;

        const marker = L.marker(L.latLng(parseFloat(item.lat), parseFloat(item.long)), { icon: setIconn('assets/icon/NewIcons/icon-ferme-new-B.png') , id: item.id, type: "ferme" });
        marker.bindTooltip(title, { direction: "auto", offset: L.point(0, -30) }).openTooltip();

        this.handleClickFerme(marker, item);
        
        this.markers.addLayer(marker);
    }


    handleClickFerme(fermeMarker, dataFerme ){

        fermeMarker.on('click', (e) => {
            ////close right if this open
            this.closeRightSide();

            this.updateCenter( parseFloat(dataFerme.lat ), parseFloat(dataFerme.long ), this.zoomDetails);
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
            fermeMarker.setIcon(new icon_R);
            this.updateLastMarkerSelected(fermeMarker, "ferme")

            if (screen.width < 991) {
                getDetailFerme(dataFerme.departement, dataFerme.departementName, dataFerme.id, true)
            } else {
                getDetailFerme(dataFerme.departement, dataFerme.departementName, dataFerme.id, true)
            }

        })
    }

    settingSingleMarkerResto(item) {

        const departementName = item.depName + '<br>';
        const adresseRestaurant = `${item.numvoie} ${item.typevoie} ${item.nomvoie} ${item.codpost} ${item.villenorm}`;
        const adress = "<br><span class='fw-bolder'> Adresse:</span> <br>" + adresseRestaurant;

        const title = "<span class='fw-bolder'> Restaurant: </span>  " + item.denominationF + " <br><span class='fw-bolder'><br> Departement:</span>  " + departementName + "." + adress;

        let resultRestoPastille= this.listRestoPastille.length > 0 ? this.listRestoPastille.filter(jtem => parseInt(jtem.id_resto) === parseInt(item.id)) : [];

        let poi_icon =  resultRestoPastille.length > 1 ? 'assets/icon/NewIcons/icon-resto-new-B-vert-multi.png' : (resultRestoPastille.length === 1  ? 'assets/icon/NewIcons/icon-resto-new-B-org-single.png' : 'assets/icon/NewIcons/icon-resto-new-B.png' ) ;
        // let poi_icon_Selected=  resultRestoPastille.length > 1 ? 'assets/icon/NewIcons/icon-resto-new-Rr-vert-multi.png' : (resultRestoPastille.length === 1  ? 'assets/icon/NewIcons/icon-resto-new-Rr-org-single.png' : 'assets/icon/NewIcons/icon-resto-new-Rr.png' ) ;
        let isPastille = resultRestoPastille.length > 0 ? 2 : 0;

        let marker

        if(!item.moyenne_note){
            marker = L.marker(L.latLng(parseFloat(item.lat), parseFloat(item.long)), 
                        { icon: 
                            setIconn(poi_icon, "", isPastille), 
                            id: item.id, 
                            type: "resto" 
                        }
                    );
        }else{
            marker=this.setSpecialMarkerToShowNote(L.latLng(parseFloat(item.lat), parseFloat(item.long)),item, false, poi_icon, poi_icon, isPastille)
        }

        marker.bindTooltip(title, { direction: "top", offset: L.point(0, -30) }).openTooltip();

        this.handleClickResto(marker, item);
        this.markers.addLayer(marker);
    }

    handleClickResto(restoMarker, dataResto){
        
        restoMarker.on('click', (e) => {
            ////close right if this open
            this.closeRightSide();


            this.updateCenter( parseFloat(dataResto.lat ), parseFloat(dataResto.long ), this.zoomDetails);
            
            let resultRestoPastille= this.listRestoPastille.length > 0 ? this.listRestoPastille.filter(jtem => parseInt(jtem.id_resto) === parseInt(restoMarker.options.id)) : [];

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

            if(!dataResto.moyenne_note){
                restoMarker.setIcon(new icon_R);
            }else{
                restoMarker.setIcon(this.setSpecialIcon(dataResto, true, poi_icon_Selected, poi_icon_Selected, isPastille));
            }
            
            // restoMarker.setIcon(this.setSpecialIcon(dataResto, true, poi_icon_Selected, poi_icon_Selected, isPastille));
            this.updateLastMarkerSelected(restoMarker, "resto")
            
            if (screen.width < 991) {
                getDetailResto(dataResto.dep, dataResto.depName, dataResto.id, true)
            } else {
                getDetailResto(dataResto.dep, dataResto.depName, dataResto.id, true)
            }
        })

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
                pathIcon= "/assets/icon/NewIcons/icon-blanc-golf-vert-bC.png";
            }else{
                pathIcon='assets/icon/NewIcons/icon-blanc-golf-vertC.png';
            }
            // pathIcon= item.user_status === null ? 'assets/icon/NewIcons/icon-blanc-golf-vert-badgeC.png' : 'assets/icon/NewIcons/icon-blanc-golf-vert-bC.png';
            taille=1
        }
        let marker = L.marker(L.latLng(parseFloat(item.lat), parseFloat(item.long )), {icon: setIconn(pathIcon,'content_badge', taille), id: item.id, type: "golf"});
        
        marker.bindTooltip(title,{ direction:"top", offset: L.point(0,-30)}).openTooltip();

        this.handleClickGolf(marker, item);
        this.markers.addLayer(marker);
    }

    handleClickGolf(golfMarker, item){
        golfMarker.on('click', (e) => {
            ////close right if this open
            this.closeRightSide();

            const itemID= item.id
            
            const golfUpdate = this.data.golf.find(jtem =>parseInt(jtem.id) === itemID);
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

            golfMarker.setIcon(new icon_R);

            this.updateLastMarkerSelected(golfMarker, "golf")
            
            if (screen.width < 991) {
                getDetailGolf(golfUpdate.dep, golfUpdate.nom_dep, golfUpdate.id, true)
            } else {
                getDetailGolf(golfUpdate.dep, golfUpdate.nom_dep, golfUpdate.id, true)
            }

        })
    }

    settingSingleMarkerTabac(item){
        const adress = `<br><span class='fw-bolder'> Adresse:</span> <br> ${item.numvoie} ${item.typevoie} ${item.nomvoie} ${item.codpost} ${item.villenorm}`;
        let title = "<span class='fw-bolder'> Tabac: </span>" + item.name + ".<span class='fw-bolder'><br>Departement: </span>" + item.dep + " " + item.depName + " ." + adress;
        
        let pathIcon="assets/icon/NewIcons/tabac_black0.png";
        let taille= 0 /// 0: min, 1: moyenne, 2 : grand

        let marker = L.marker(L.latLng(parseFloat(item.lat), parseFloat(item.long )), {icon: setIconn(pathIcon,'content_badge', taille), id: item.id});
        
        marker.bindTooltip(title,{ direction:"top", offset: L.point(0,-30)}).openTooltip();

        this.handleClickTabac(marker, item);

        this.markers.addLayer(marker);
    }

    handleClickTabac(tabacMarker, item){
        tabacMarker.on('click', (e) => {
            ////close right if this open
            this.closeRightSide();

            this.updateCenter( parseFloat(item.lat ), parseFloat(item.long ), this.zoomDetails);
            let pathIcon='/assets/icon/NewIcons/tabac_red0.png';
            
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
            tabacMarker.setIcon(new icon_R);

            this.updateLastMarkerSelected(tabacMarker, "tabac")

            if (screen.width < 991) {
                getDetailTabac(item.dep, item.nom_dep, item.id, true)
            } else {
                getDetailTabac(item.dep, item.nom_dep, item.id, true)
            }
        })
    }


    updateLastMarkerSelected(marker, type) {

        if (this.marker_last_selected && this.marker_last_selected !== marker ) {

            let icon_marker = "";
            if (this.marker_last_selected_type === "station") {
                icon_marker = IS_DEV_MODE ? `/assets/icon/NewIcons/icon-station-new-B.png` : `/public/assets/icon/NewIcons/icon-station-new-B.png`;

            } else if (this.marker_last_selected_type === "ferme") {
                icon_marker = IS_DEV_MODE ? `/assets/icon/NewIcons/icon-ferme-new-B.png` : `/public/assets/icon/NewIcons/icon-ferme-new-B.png`;

            } else if (this.marker_last_selected_type === "resto") {
                let resultRestoPastille= this.listRestoPastille.length > 0 ? this.listRestoPastille.filter(jtem => parseInt(jtem.id_resto) === parseInt(this.marker_last_selected.options.id)) : [];
                let poi_icon =  resultRestoPastille.length > 1 ? 'assets/icon/NewIcons/icon-resto-new-B-vert-multi.png' : (resultRestoPastille.length === 1  ? 'assets/icon/NewIcons/icon-resto-new-B-org-single.png' : 'assets/icon/NewIcons/icon-resto-new-B.png' ) ;
                
                // icon_marker = IS_DEV_MODE ? `/${poi_icon}` : `/public/${poi_icon}`;
                icon_marker = IS_DEV_MODE ? `${poi_icon}` : `public/${poi_icon}`;

            } else if( this.marker_last_selected_type === "golf"){

                const last_marker= this.data.golf.find(({id}) => parseInt(id) === parseInt(this.marker_last_selected.options.id))

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
                    iconSize: [32,50],
                    iconAnchor: [11, 30],
                    popupAnchor: [0, -20],
                    shadowSize: [68, 95],
                    shadowAnchor: [22, 94]
                }
            })

            if(this.marker_last_selected_type === "resto"){
                let oneResto = this.default_data.resto.find(jtem => parseInt(this.marker_last_selected.options.id) === parseInt(jtem.id))
                this.marker_last_selected.setIcon(this.setSpecialIcon(oneResto, false, icon_marker, icon_marker, 0))
            }else{
                this.marker_last_selected.setIcon(new icon_B)
            }
            
        }

        this.markers.refreshClusters();

        this.marker_last_selected = marker;
        this.marker_last_selected_type = type;
    }

    addEventOnMap(map) {
        map.on("resize moveend", () => { 
            const x= this.getMax(this.map.getBounds().getWest(),this.map.getBounds().getEast())
            const y= this.getMax(this.map.getBounds().getNorth(), this.map.getBounds().getSouth())

            const new_size= { minx:x.min, miny:y.min, maxx:x.max, maxy:y.max }

            this.addPeripheriqueMarker(new_size)
        })
    }

    async addPeripheriqueMarker(new_size) {
        try {
            const { minx, miny, maxx, maxy }= new_size;
            const param="?minx="+encodeURIComponent(minx)+"&miny="+encodeURIComponent(miny)+"&maxx="+encodeURIComponent(maxx)+"&maxy="+encodeURIComponent(maxy);

            const response = await fetch(`/dataHome${param}`);
            let new_data = await response.json();

            new_data.ferme = new_data.ferme.filter(item => !this.default_data.ferme.some(j => j.id === item.id))
            new_data.station = new_data.station.filter(item => !this.default_data.station.some(j => j.id === item.id))
            new_data.resto = new_data.resto.filter(item => !this.default_data.resto.some(j => j.id === item.id))
            new_data.golf = new_data.golf.filter(item => !this.default_data.golf.some(j => j.id === item.id))
            new_data.tabac = new_data.tabac.filter(item => !this.default_data.tabac.some(j => j.id === item.id))

            const result= this.checkeFilterType(new_data);
            this.addMarker(result);

            this.default_data = {
                ...this.default_data,
                ferme: this.default_data.ferme.concat(new_data.ferme),
                station: this.default_data.station.concat(new_data.station),
                resto: this.default_data.resto.concat(new_data.resto),
                golf: this.default_data.golf.concat(new_data.golf),
                tabac: this.default_data.tabac.concat(new_data.tabac),
            }

        } catch (e) {
            console.log(e)
        }
    }

    generateFilterAndSelectDep() {
        const content_filter = document.createElement("div");
        content_filter.className = "content_filter content_filter_js_jheo";

        // this.generate_checkout_option(content_filter) ///// must commented

        const content_filter_dep = document.createElement("div");
        content_filter_dep.className = "content_filter_dep";
        document.querySelector("#map").appendChild(content_filter_dep);

        this.generate_select_dep(content_filter_dep) /// and bind event
        // this.eventManagement();
    }

    generate_checkout_option(content_filter){
        this.generate_filter(content_filter, "filterTous", "Tous")
        this.generate_filter(content_filter, "filterFerme", "Ferme")
        this.generate_filter(content_filter, "filterStation", "Station")
        this.generate_filter(content_filter, "filterResto", "Réstaurant")
        this.generate_filter(content_filter, "filterGolf", "Golf")
        this.generate_filter(content_filter, "filterTabac", "Tabac")
        // this.generate_filter(content_filter, "filterVehicule", "Véhicule", true, true)
        // this.generate_filter(content_filter, "filterCommerce", "Commerce", true, true)

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

        ///// EVENT CHECK TYPE 
        if (document.querySelector(".content_filter_js_jheo")) {
            const alltype = document.querySelectorAll(".content_filter input");
            alltype.forEach(item => {
                item.addEventListener("click", (e) => this.changeType(e))
            })
        }


        //// EVENT SELECT DEPARTEMENT
        if (document.querySelector(".input_select_dep_js_jheo")) {
            document.querySelector(".input_select_dep_js_jheo").addEventListener("change", (e) => this.checkStateSelectedDep(e))
        } else {
            console.log("event select dep not found")
        }
    }

    changeType(e) {
        if(document.querySelector(".btn_close_modal_filter_jheo_js")){
            document.querySelector(".btn_close_modal_filter_jheo_js").click();
        }

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

        // const lists = ["filterFerme", "filterStation", "filterResto", "filterVehicule", "filterCommerce"];
        const lists = ["filterFerme", "filterStation", "filterResto", "filterGolf", "filterTabac"];

        let result_temp = [];
        let results = null;
        for (let item of lists) {
            results = this.handleOnlyStateCheckbox(result_temp, item)
            result_temp = results;
        }
        if (results.length > 0 && results.every(item => item.state === 1)) {
            document.querySelector("#filterTous").checked = true;
        } else {
            document.querySelector("#filterTous").checked = false;
        }

        this.filterDataByDep();
    }

    checkeFilterType(data) {
        let results = null;
        if(document.querySelector(".content_filter_js_jheo")){

            /// these is id on the option field 
            // const lists = ["filterFerme", "filterStation", "filterResto", "filterVehicule", "filterCommerce"];
            const lists = ["filterFerme", "filterStation", "filterResto", "filterGolf", "filterTabac"];

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
                { type:"filterGolf", state: 1},
                { type:"filterTabac", state: 1},
            ]
        }

        const code_dep = document.querySelector(".input_select_dep_js_jheo").value.length < 3 ? document.querySelector(".input_select_dep_js_jheo").value : null;

        let data_ferme = [], data_station = [], data_resto = [], data_golf= [], data_tabac = [];
        results.forEach(item => {
            const { type, state } = item;
            if (state === 1) {
                if (type === "filterFerme") {
                    data_ferme = code_dep ? data.ferme.filter(({ departement }) =>{  if( parseInt(code_dep) === 20){ return departement.toString().trim() === "2A" || departement.toString().trim() === "2B" || parseInt(departement) === 20 }else{ return parseInt(departement) === parseInt(code_dep)}}) : data.ferme;
                } else if (type === "filterStation") {
                    data_station = code_dep ? data.station.filter(({ departementCode }) => { if( parseInt(code_dep) === 20){ return departementCode.toString().trim() === "2A" || departementCode.toString().trim() === "2B" || parseInt(departementCode) === 20 }else{ return parseInt(departementCode) === parseInt(code_dep) }} ) : data.station;
                } else if (type === "filterResto") {
                    data_resto = code_dep ? data.resto.filter(({ dep }) =>{ if( parseInt(code_dep) === 20){ return dep.toString().trim() === "2A" || dep.toString().trim() === "2B" || parseInt(dep) === 20 }else{ return parseInt(dep) === parseInt(code_dep) }} ) : data.resto;
                }else if( type === "filterGolf"){
                    data_golf = code_dep ? data.golf.filter(({ dep }) =>{ if( parseInt(code_dep) === 20){ return dep.toString().trim() === "2A" || dep.toString().trim() === "2B" || parseInt(dep) === 20 }else{ return parseInt(dep) === parseInt(code_dep) }} ) : data.golf;
                }else if( type === "filterTabac"){
                    data_tabac = code_dep ? data.tabac.filter(({ dep }) =>{ if( parseInt(code_dep) === 20){ return dep.toString().trim() === "2A" || dep.toString().trim() === "2B" || parseInt(dep) === 20 }else{ return parseInt(dep) === parseInt(code_dep) }} ) : data.tabac;
                }
            }
        })

        return { ferme: data_ferme, station: data_station, resto: data_resto, golf: data_golf, tabac: data_tabac }
    }

    checkStateSelectedDep(e) {
     
        const code_dep = e.target.value.length < 3 ? e.target.value : null;
        if (code_dep) {
            this.updateCenter(centers[parseInt(code_dep)].lat, centers[parseInt(code_dep)].lng, centers[parseInt(code_dep)].zoom)
            setDataInLocalStorage("memoryCenter", JSON.stringify({ zoom:  centers[parseInt(code_dep)].zoom ,coord: { lat:centers[parseInt(code_dep)].lat , lng: centers[parseInt(code_dep)].lng }}))
        }
        this.filterDataByDep();
    }

    handleOnlyStateCheckbox(tab, item) {
        let result = []
        let state = { "type": document.querySelector(`#${item}`).getAttribute("name") };

        if(document.querySelector(`#${item}`)){
            if (document.querySelector(`#${item}`).checked) {
                state = { ...state, "state": 1 }
            } else {
                state = { ...state, "state": 0 }
            }
        }else{
            state = { ...state, "state": 1 }
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
        
        console.log("data_filtered");
        console.log(data_filtered);

        this.removeMarker();

        if( data_filtered.ferme.length > 0  || data_filtered.station.length > 0 ||  data_filtered.resto.length > 0 ||  data_filtered.golf.length > 0 || data_filtered.tabac.length > 0 ){
            this.data = { ...this.data, "ferme": data_filtered.ferme, "station": data_filtered.station, "resto": data_filtered.resto, "golf" : data_filtered.golf, "tabac" : data_filtered.tabac }
            this.addMarker(this.data)
        }

        const x= this.getMax(this.map.getBounds().getWest(),this.map.getBounds().getEast())
        const y= this.getMax(this.map.getBounds().getNorth(), this.map.getBounds().getSouth())
        const new_size= { minx:x.min, miny:y.min, maxx:x.max, maxy:y.max }

        this.addPeripheriqueMarker(new_size)
    }

    removeMarker() {
        this.markers.clearLayers();
        this.map.removeLayer(this.markers);
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

        this.data.golf = this.data.golf.map(item => {
            if( parseInt(item.id) === parseInt(id) ){
                item.user_status = { ...item.user_status , ...user_status }
            }
            return item;
        })
    }

    injectListRestoPastille(){
        const restoPastilleTab= [];
        this.listRestoPastille.forEach(item => {
            const restoPastille = this.default_data.resto.find(jtem => parseInt(item.id_resto) === parseInt(jtem.id));
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
        injectListMarker(restoPastilleTab);
    }

    checkIsExist(idToCheck){
        return this.default_data.resto.some(({id}) => parseInt(id) === parseInt(idToCheck))
    }

    clickOnMarker(id){
        this.markers.eachLayer((marker) => {
            if (parseInt(marker.options.id) === parseInt(id) && marker.options.type === "resto" ) {
                marker.fireEvent('click'); 
            }
        });
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
                let oneResto = this.default_data.resto.find(jtem => parseInt(idResto) === parseInt(jtem.id))
                marker.setIcon(this.setSpecialIcon(oneResto, true, poi_icon_Selected, poi_icon_Selected, isPastille))
            }
        });

        this.markers.refreshClusters();
    }

    /**
     * @Author Nantenaina
     * où: On utilise cette fonction dans la rubrique restaurant, restaurant specifique dép, arrondissement et tous de la carte cmz, 
     * localisation du fichier: dans MarkerClusterHome.js,
     * je veux: mettre à jour la note moyenne sur un POI
     * si une POI a une note, la note se montre en haut à gauche du POI
     */
    showNoteMoyenneRealTime(idResto, note){
        let resultRestoPastille= this.listRestoPastille.length > 0 ? this.listRestoPastille.filter(jtem => parseInt(jtem.id_resto) === parseInt(idResto)) : [];
        let poi_icon_Selected=  resultRestoPastille.length > 1 ? 'assets/icon/NewIcons/icon-resto-new-Rr-vert-multi.png' : (resultRestoPastille.length === 1  ? 'assets/icon/NewIcons/icon-resto-new-Rr-org-single.png' : 'assets/icon/NewIcons/icon-resto-new-Rr.png' ) ;
        let isPastille = resultRestoPastille.length > 0 ? 2 : 0;

        this.markers.eachLayer((marker) => {
            if (parseInt(marker.options.id) === parseInt(idResto) && marker.options.type === "resto" ) {
                let oneResto = this.default_data.resto.find(jtem => parseInt(idResto) === parseInt(jtem.id))
                oneResto.moyenne_note = parseFloat(note).toFixed(2)
                marker.setIcon(this.setSpecialIcon(oneResto, true, poi_icon_Selected, poi_icon_Selected, isPastille))
            }
        });

        this.markers.refreshClusters();
    }
}