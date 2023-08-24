class MarckerClusterTabac extends MapModule {

    constructor(nom_dep=null,id_dep=null){
        super(id_dep,nom_dep, "golf")

        // REFERENCES : https://gist.github.com/frankrowe/9007567
        this.tabacOption = [
            { couche : "canton", arrayColor :["#1b9e77","#d95f02","#7570b3"], properties: ["cv", "dep","nom_cv", "nom_dep", "nom_reg", "reg"]},         /// Dark2
            { couche : "commune", arrayColor :["#e0f3db","#a8ddb5","#43a2ca"], properties: []},        /// GnBu
            { couche : "departement", arrayColor : ["#7fc97f","#beaed4","#fdc086"], properties: ["dep", "nom_dep", "nom_reg","reg"]},   /// Accent
            { couche : "iris", arrayColor : ["#fde0dd","#fa9fb5","#c51b8a"], properties: []},          /// RdPu
            { couche : "quartier", arrayColor :["#ffeda0","#feb24c","#f03b20"], properties: []},       /// YlOrRd
            { couche : "region", arrayColor : ["#f1a340","#f7f7f7","#998ec3"] , properties: ["nom_reg", "reg"]},       /// PuOr
        ]
          
    }

    async onInit(isAddControl){
        this.ALREADY_INIT = false;
        try{
            this.createMarkersCluster();
            this.initMap(null, null, isAddControl);

            // const link =( this.nom_dep && this.id_dep) ? `/api/golf/departement/${this.nom_dep}/${this.id_dep}` : `/api/golf`;
            // const response= await fetch(link);
            // const result= await response.json();
            // this.default_data = result.data
            
            // this.data= this.default_data; 
            

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
                        <label class="form-check-label" for="region">
                            REGION
                        </label>
                        <!-- <span class="badge bg-info show_list_select">AFFICHER</span> -->
                    </div>
                    <div class="content_select_region_jheo_js">
                        <div class="select_region select_region_jheo_js"></div>
                    </div>
                </div>
                <div class="form-check">
                    <input class="form-check-input check_tabac_commune_jheo_js" type="checkbox" value="" id="commune">
                    <label class="form-check-label" for="commune">
                        COMMUNE
                    </label>
                    <div class="content_select_commune_jheo_js">
                        <div class="select_region select_commune_jheo_js"></div>
                    </div>
                </div>
                <div class="form-check">
                    <input class="form-check-input check_tabac_departement_jheo_js" type="checkbox" value="" id="departement">
                    <label class="form-check-label" for="departement">
                        DEPARTEMENT
                    </label>
                    <div class="content_select_departement_jheo_js">
                        <div class="select_region select_departement_jheo_js"></div>
                    </div>
                </div>
                <div class="form-check">
                    <input class="form-check-input check_tabac_iris_jheo_js" type="checkbox" value="" id="iris" >
                    <label class="form-check-label" for="iris">
                        IRIS
                    </label>
                    <div class="content_select_iris_jheo_js">
                        <div class="select_region select_iris_jheo_js"></div>
                    </div>
                </div>
                <div class="form-check">
                    <input class="form-check-input check_tabac_quartier_jheo_js" type="checkbox" value="" id="quartier" >
                    <label class="form-check-label" for="quartierDeVie">
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
                    <label class="form-check-label" for="canton">
                        CANTON
                    </label>
                    <div class="content_select_canton_jheo_js">
                        <div class="select_region select_canton_jheo_js"></div>
                    </div>
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
            
            const inputCheck_HTML= document.querySelector(`.${inputCheck}`)
            inputCheck_HTML.addEventListener("change", (e) => {
                if( e.target.checked){
                    this.addCoucheOnLeaflet(inputCheck_HTML.getAttribute("id"))
                }else{
                    const couche= inputCheck_HTML.getAttribute("id")
                    const list = document.querySelector(`.select_${couche.toLowerCase()}_jheo_js`)
                    
                    this.removeCoucheOnLeafled(couche)
                    if(list && !list.classList.contains("d-none") ){
                        list.classList.add("d-none")
                    }
                }
            })
        })
    }


    async addCoucheOnLeaflet(COUCHE){
        try{
            const currentCouche = this.objectGeoJson.find( item => item.couche.toLowerCase() === COUCHE.toLowerCase());
            if(!currentCouche){
                const response= await fetch(`/assets/shapefile/${COUCHE}.zip`)
                const blob= await response.blob()
                const file=new File([blob], "xxx.zip",{type:"application/x-zip-compressed"})

           

                const reader = new FileReader();
                reader.onload = () => {
                    shp(reader.result)
                        .then((geoJson) =>{
                            const coucheOption= this.tabacOption.find(item => item.couche === COUCHE.toLowerCase());

                            this.objectGeoJson.push({ couche: COUCHE, data : geoJson.features, color : coucheOption.arrayColor , child : []})
                            generateSelect(COUCHE, geoJson.features) //// function in data_tabac
                        })
                        .catch(error => console.log(error))
                };

                reader.readAsArrayBuffer(file)
            }else{
                //// generate
                generateSelect(COUCHE, currentCouche.data , currentCouche.child) //// function in data_tabac
            }
        }catch(e){
            console.log(e.message)
        }

    }

    updateGeoJson(couche,indexInJson){
        // this.geoJSONLayer.clearLayers();
        
        const data_spec = this.objectGeoJson.find(item => item.couche.toLowerCase() === couche);
        const styles={
            color: data_spec.color[0],
            fillColor: data_spec.color[0],
            fillOpacity: 1
        }

        const geoJson = L.geoJson(data_spec.data[parseInt(indexInJson)], {
            style: styles,
            onEachFeature : (feature, layer)  => {
                const coucheOption= this.tabacOption.find(item => item.couche === couche.toLowerCase());

                let description = "";
                coucheOption.properties.forEach(propertie => {
                    const desc = feature.properties[propertie].split(" ").map(item => item.charAt(0).toUpperCase() + item.slice(1).toLowerCase()).join(" ")
                    description += propertie.toUpperCase() + " : " + desc + " </br>";
                })

                layer.bindPopup(description);
            }
        }).addTo(this.map);

        this.objectGeoJson= this.objectGeoJson.map(item => { 
            if( item.couche.toLowerCase() === couche ){
                item.child.push({ index : indexInJson, geoJson : geoJson})
            }
            return item;
        })

    }


    removeCoucheOnLeafled(COUCHE){
        const data_spec = this.objectGeoJson.find(item => item.couche.toLowerCase() === COUCHE.toLowerCase());

        //// remove geoJsom
        data_spec.child.forEach(jtem => jtem.geoJson.clearLayers())

        ///// update data remove all children selected in this
        this.objectGeoJson= this.objectGeoJson.filter(ktem => ktem.couche.toLowerCase() !== COUCHE.toLowerCase())
    }

    removeSpecGeoJson(couche,indexInJson){
        
        const data_spec = this.objectGeoJson.find(item => item.couche.toLowerCase() === couche);
        const jsonIndex = data_spec.child.find(jtem => jtem.index === indexInJson );

        //// remove this child
        jsonIndex.geoJson.clearLayers()

        this.objectGeoJson= this.objectGeoJson.map(item => { 
            if( item.couche.toLowerCase() === couche ){
                item.child = item.child.filter(ktem => ktem.index !== indexInJson)
            }
            return item;
        })
    }

}