class MarckerClusterTabac extends MapModule {

    constructor(nom_dep=null,id_dep=null){
        super(id_dep,nom_dep, "tabac")

        // REFERENCES : https://gist.github.com/frankrowe/9007567
        this.tabacOption = [
            { couche : "canton", arrayColor :["#1b9e77","#d95f02","#7570b3"], properties: ["cv", "dep","nom_cv", "nom_dep", "nom_reg", "reg"]},         /// Dark2
            { couche : "commune", arrayColor :["#e0f3db","#a8ddb5","#43a2ca"], properties: []},        /// GnBu
            { couche : "departement", arrayColor : ["#7fc97f","#beaed4","#fdc086"], properties: ["dep", "nom_dep", "nom_reg","reg"]},   /// Accent
            { couche : "iris", arrayColor : ["#fde0dd","#fa9fb5","#c51b8a"], properties: []},          /// RdPu
            // { couche : "quartier", arrayColor :["#ffeda0","#feb24c","#f03b20"], properties: []},       /// YlOrRd
            { couche : "quartier", arrayColor :["red","#feb24c","#f03b20"], properties: ["nom_qv", "code_qv", "nom_pole", "pole" ]},       /// YlOrRd
            { couche : "region", arrayColor : ["#f1a340","#f7f7f7","#998ec3"] , properties: ["nom_reg", "reg"]},       /// PuOr
        ]
          
    }

    async onInit(isAddControl){
        this.ALREADY_INIT = false;
        try{
            this.createMarkersCluster();
            this.initMap(null, null, null, isAddControl);

            const link =( this.nom_dep && this.id_dep) ? `/api/tabac/departement/${this.nom_dep}/${this.id_dep}` : `/api/tabac`;
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
            const adress = `<br><span class='fw-bolder'> Adresse:</span> <br> ${item.numvoie} ${item.typevoie} ${item.nomvoie} ${item.codpost} ${item.villenorm}`;
            let title = "<span class='fw-bolder'> Tabac: </span>" + item.name + ".<span class='fw-bolder'><br>Departement: </span>" + item.dep + " " + item.depName + " ." + adress;
            
            let pathIcon="assets/icon/NewIcons/tabac_black0.png";
            let taille= 0 /// 0: min, 1: moyenne, 2 : grand

            let marker = L.marker(L.latLng(parseFloat(item.lat), parseFloat(item.long )), {icon: setIconn(pathIcon,'content_badge', taille), id: item.id});
            
            marker.bindTooltip(title,{ direction:"top", offset: L.point(0,-30)}).openTooltip();

            marker.on('click', (e) => {

                hideRightSide();

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

                if (this.marker_last_selected && this.marker_last_selected != marker ) {

                    let pathIcon='/assets/icon/NewIcons/tabac_map.png';

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
                    let pathDetails = `/tabac/departement/${item.nom_dep}/${item.dep}/details/${item.id}`
                    getDetailHomeForMobile(pathDetails)
                } else {
                    // getDetailsFerme(pathDetails, true)getDetailStation
                    getDetailTabac(item.dep, item.nom_dep, item.id)
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
      
    }


    filterByFirstLetterOnName(letter){
       console.log(letter)
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
       console.log(new_size)
    }

    
    checkeFilterType(data) {
        return data;
    }

    injectChooseCouche(){
        if( !document.querySelector(".content_right_side_body_jheo_js")){
            console.log("Selector not found : '.content_right_side_body_body'")
            return false;
        }
        document.querySelector(".content_right_side_body_jheo_js").innerHTML= `
            <div class="right_side_body right_side_body_jheo_js">
                <div class="form-check">
                    <div class="content_input">
                        <input class="form-check-input check_tabac_region_jheo_js" type="checkbox" value="" id="region">
                        <label class="form-check-label text-black" for="region">
                            REGION
                        </label>
                        <!-- <span class="badge bg-info show_list_select">AFFICHER</span> -->
                    </div>
                    <div class="content_select_region_jheo_js">
                        <div class="select_region select_region_jheo_js"></div>
                    </div>
                </div>
                <div class="form-check">
                    <input class="form-check-input check_tabac_departement_jheo_js" type="checkbox" value="" id="departement">
                    <label class="form-check-label text-black" for="departement">
                        DEPARTEMENT
                    </label>
                    <div class="content_select_departement_jheo_js">
                        <div class="select_region select_departement_jheo_js"></div>
                    </div>
                </div>
                
                <div class="form-check">
                    <input class="form-check-input check_tabac_quartier_jheo_js" type="checkbox" value="" id="quartier" >
                    <label class="form-check-label text-black" for="quartier">
                        QUARTIER DE VIE
                    </label>
                       <div class="content_select_region_jheo_js">
                        <div class="select_region select_region_jheo_js"></div>
                    </div>
                    <div class="content_select_quartier_jheo_js">
                        <div class="select_region select_quartier_jheo_js"></div>
                    </div>
                </div>
                <div class="form-check">
                    <input class="form-check-input check_tabac_canton_jheo_js" type="checkbox" value="" id="canton" >
                    <label class="form-check-label text-black" for="canton">
                        CANTON
                    </label>
                    <div class="content_select_canton_jheo_js">
                        <div class="select_region select_canton_jheo_js"></div>
                    </div>
                </div>
                <div class="form-check">
                    <input class="form-check-input check_tabac_commune_jheo_js" type="checkbox" value="" id="commune">
                    <label class="form-check-label text-black" for="commune">
                        COMMUNE
                    </label>
                    <div class="content_select_commune_jheo_js">
                        <div class="select_region select_commune_jheo_js"></div>
                    </div>
                </div>
                <div class="form-check">
                    <input class="form-check-input check_tabac_iris_jheo_js" type="checkbox" value="" id="iris">
                    <label class="form-check-label text-black" for="iris">
                        IRIS
                    </label>
                    <div class="content_select_iris_jheo_js">
                        <div class="select_region select_iris_jheo_js"></div>
                    </div>
                </div>
            </div>
            <div class="d-none chargement_tabac chargement_tabac_jheo_js">
                <div class="containt">
                    <div class="word word-1">C</div>
                    <div class="word word-2">M</div>
                    <div class="word word-3">Z</div>
                </div>
            </div>
        `
        this.handleEventOnCheckBox();
    }

    handleEventOnCheckBox(){
        const allCheckBox= [
            "check_tabac_region_jheo_js", 
            "check_tabac_commune_jheo_js",
            "check_tabac_departement_jheo_js",
            "check_tabac_iris_jheo_js",
            "check_tabac_quartier_jheo_js",
            "check_tabac_canton_jheo_js"
        ];

        allCheckBox.forEach(inputCheck => {
            if(!document.querySelector(`.${inputCheck}`)){
               throw new Error(`Selector not found : ${inputCheck}`);
            }
            
            ///// event handlers
            const inputCheck_HTML= document.querySelector(`.${inputCheck}`)
            inputCheck_HTML.addEventListener("change", (e) => {
                const couche= inputCheck_HTML.getAttribute("id")
                if( e.target.checked){
                    showChargementTabac()
                    this.addCoucheOnLeaflet(couche) //// param couche name
                }else{
                    const list = document.querySelector(`.select_${couche.toLowerCase()}_jheo_js`)
                    
                    this.removeCoucheOnLeafled(couche)

                    if(list && !list.classList.contains("d-none") ){
                        list.classList.add("d-none")

                        while (list.firstChild) {
                          list.removeChild(list.firstChild);
                        }
                    }
                }
            })
        })
    }


    async addCoucheOnLeaflet(COUCHE){
        try{
            ///// check if this is already get...
            const currentCouche = this.objectGeoJson.find( item => item.couche.toLowerCase() === COUCHE.toLowerCase());
            if(!currentCouche){
                const link = IS_DEV_MODE ? `/assets/shapefile/${COUCHE.toUpperCase()}.zip` : `/public/assets/shapefile/${COUCHE.toUpperCase()}.zip`;
                const response= await fetch(link)
                const blob= await response.blob()
                const file=new File([blob], "xxx.zip",{type:"application/x-zip-compressed"})

                const reader = new FileReader();
                reader.onload = () => {
                    console.log(reader.result)
                    shp(reader.result)
                        .then((geoJson) =>{
                            hideChargementTabac()
                            ///// couche Option, colors, properties
                            const coucheOption= this.tabacOption.find(item => item.couche === COUCHE.toLowerCase());

                            this.objectGeoJson.push({ couche: COUCHE, data : geoJson.features, color : coucheOption.arrayColor , child : []})
                            if( COUCHE !== "quartier"){
                                generateSelect(COUCHE, geoJson.features) //// function in data_tabac
                            }else{
                                this.updateGeoJson(COUCHE, -1 ) //// if -1 all seen, other single
                            }
                        })
                        .catch(error => {
                            hideChargementTabac()
                            console.log(error)
                        })
                };

                reader.readAsArrayBuffer(file)
            }else{
                hideChargementTabac()
                //// generate
                if( COUCHE !== "quartier"){
                    generateSelect(COUCHE, currentCouche.data , currentCouche.child) //// function in data_tabac
                }else{
                    this.updateGeoJson(COUCHE, -1 ) //// if -1 all seen, other single
                }
            }
        }catch(e){
            hideChargementTabac()
            console.log(e.message)
        }

    }

    updateGeoJson(couche,indexInJson){
        // this.geoJSONLayer.clearLayers();
        
        const data_spec = this.objectGeoJson.find(item => item.couche.toLowerCase() === couche);
        const styles={
            color: data_spec.color[0],
            // fillColor: data_spec.color[1],
            fillOpacity: 0,
            weight: 2,
        }

        const data = indexInJson === -1 ? data_spec.data : data_spec.data[parseInt(indexInJson)];
        const geoJson = L.geoJson( data, {
            style: styles,
            onEachFeature : (feature, layer)  => {
                const lng= (feature.geometry.bbox[0] + feature.geometry.bbox[2]) / 2 ;
                const lat= (feature.geometry.bbox[1] + feature.geometry.bbox[3]) / 2 ;

                this.updateCenter(lat, lng, 8);

                const coucheOption= this.tabacOption.find(item => item.couche === couche.toLowerCase());

                let description = "";
                coucheOption.properties.forEach(propertie => {
                    const desc = feature.properties[propertie].split(" ").map(item => item.charAt(0).toUpperCase() + item.slice(1).toLowerCase()).join(" ")
                    description += propertie.toUpperCase() + " : " + desc + " </br>";
                })

                layer.bindPopup(description);
            }
        }).addTo(this.map);

        this.objectGeoJson= this.objectGeoJson.map((item, index) => { 
            if( item.couche.toLowerCase() === couche ){
                if(indexInJson !== -1 ){
                    item.child.push({ index : indexInJson, geoJson : geoJson})
                }else{
                    item.child.push({ index : index, geoJson : geoJson})
                }
            }
            return item;
        })
    }


    removeCoucheOnLeafled(COUCHE){
        const data_spec = this.objectGeoJson.find(item => item.couche.toLowerCase() === COUCHE.toLowerCase());

        //// remove geoJsom
        data_spec.child.forEach(jtem => jtem.geoJson.clearLayers());

        ///// update data remove all children selected in this
        // this.objectGeoJson= this.objectGeoJson.map(item => { 
        //     item.child = (item.couche.toLowerCase() === COUCHE ) ? [] : item.child;
        //     return item;
        // })
        this.objectGeoJson= this.objectGeoJson.filter(item => item.couche.toLowerCase() !== COUCHE )
    }

    removeSpecGeoJson(couche,indexInJson){
        
        const data_spec = this.objectGeoJson.find(item => item.couche.toLowerCase() === couche);
        const jsonIndex = data_spec.child.find(jtem => jtem.index === indexInJson );

        //// remove this child
        jsonIndex.geoJson.clearLayers()

        this.objectGeoJson= this.objectGeoJson.map(item => { 
            item.child = ( item.couche.toLowerCase() === couche ) ?  item.child.filter(ktem => ktem.index !== indexInJson) : item.child;
            return item;
        })
    }

}