/// dependecies: 
///         - franceGeometry ( franceGeoJson.js )
///         - API openstreetmap

class MapModule{

    constructor(idDep= null,nomDep, map_for_type="tous"){
        this.currentUrl= new URL(window.location.href);

        ////default values but these distroy when we get the user position
        this.latitude= 46.61171462536897;
        this.longitude= 1.8896484375000002;

        this.defautLatitude= this.latitude;
        this.defaultLongitude= this.longitude;


        this.defaultZoom= 6;

        this.zoomDetails= 20;
        this.geos= [];

        this.mapForType=map_for_type;
        this.id_dep= idDep ? parseInt(idDep) : null;
        this.nom_dep= nomDep ? nomDep : null;
        this.map= null;


        this.isRightSideAlreadyOpen = false;

        this.objectGeoJson = [];
        this.listRestoPastille = [];

        this.tab_tales = [];
        this.listTales= [
            { name: "Esri WorldStreetMap", link : "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}", id: "osm_esri_jheo_js", isCurrent: true },
            { name: "Openstreetmap.org", link : "https://tile.openstreetmap.org/{z}/{x}/{y}.png", id: "osm_org_jheo_js", isCurrent: false },
            { name: "Openstreetmap.fr Osmfr", link : "//{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png" , id: "osm_fr_jheo_js", isCurrent: false },
        ];

        // REFERENCES : https://gist.github.com/frankrowe/9007567
        this.contourOption = [
            { couche : "canton", arrayColor :["#1b9e77","#d95f02","#7570b3"], properties: ["cv", "dep","nom_cv", "nom_dep", "nom_reg", "reg"]},         /// Dark2
            { couche : "commune", arrayColor :["#e0f3db","#a8ddb5","#43a2ca"], properties: []},        /// GnBu
            { couche : "departement", arrayColor : ["#7fc97f","#beaed4","#fdc086"], properties: ["dep", "nom_dep", "nom_reg","reg"]},   /// Accent
            { couche : "iris", arrayColor : ["#fde0dd","#fa9fb5","#c51b8a"], properties: []},          /// RdPu
            { couche : "quartier", arrayColor :["red","#feb24c","#f03b20"], properties: ["nom_qv", "code_qv", "nom_pole", "pole" ]},       /// YlOrRd
            { couche : "region", arrayColor : ["#f1a340","#f7f7f7","#998ec3"] , properties: ["nom_reg", "reg"]},       /// PuOr
        ]
    }
    initTales(){
        this.tiles = L.tileLayer(this.listTales[0].link, {
            // attribution: 'donn&eacute;es &copy; <a href="//osm.org/copyright">OpenStreetMap</a>/ODbL - rendu <a href="//openstreetmap.fr">OSM France</a>',
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            minZoom: 1,
            maxZoom: 19
        })
    } /// - //{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png


    getUserLocation(){
        if( !localStorage.getItem("userLocate")){
            localStorage.setItem("userLocate", false)
            if( confirm("Souhaitez-vous que nous utilisions votre position ?") ){
                localStorage.setItem("userLocate", true);
                return new Promise((resolve, reject) =>
                    navigator.geolocation.getCurrentPosition(resolve, reject,{maximumAge: 2000, enableHighAccuracy: true,timeout: 3000} )
                );
            }
        }else if( localStorage.getItem("userLocate").toString() === "true"){
            return new Promise((resolve, reject) =>
                navigator.geolocation.getCurrentPosition(resolve, reject,{maximumAge: 2000, enableHighAccuracy: true,timeout: 3000} )
            );
        }
        return false;
    }

    async createMap(lat= null, long=null, zoom= null){
        if( lat !=null && long != null && zoom != null ){
            this.latitude = lat;
            this.longitude= long;
            this.defaultZoom= zoom;
        }

        const memoryCenter= getDataInSessionStorage("memoryCenter") ? JSON.parse(getDataInSessionStorage("memoryCenter")) : null;
        this.initTales();

        /// if there is departementSpecified
        this.settingLatLong();

        // ( this.id_dep || (lat !=null && long != null && zoom != null) ||  !memoryCenter )
        // si on est dans une departement specifique, ou on est dans le recherch, et memory Center est vide... 
        this.map = L.map('map', {
                zoomControl: false,
                center: ( this.id_dep || (lat !=null && long != null && zoom != null) ||  !memoryCenter ) ? L.latLng(this.latitude, this.longitude) : L.latLng(memoryCenter.coord.lat,memoryCenter.coord.lng),
                zoom: this.id_dep ? this.defaultZoom : ( ( lat && long && zoom ) ? zoom :  ( memoryCenter ?  memoryCenter.zoom : this.defaultZoom ) ),
                // zoom: memoryCenter ?  memoryCenter.zoom : this.defaultZoom,
                layers: [this.tiles] 
            }
        );

        if( lat && long && zoom ){
            this.updateDataInSessionStorage(lat, long, zoom);
        }


        const position = "topright";
        L.control.zoom({
            position: position
        }).addTo(this.map);

        this.leafletControlExtend(position);
        // let position = null, coords= null;
        // try{
        //     position = await this.getUserLocation();
        //     coords = position.coords;
        //     this.latitude = coords.latitude;
        //     this.longitude= coords.longitude;
        // }catch(err){
        //     console.log(err.message)
        // }finally{
        // }

    }

    handleEventOnMap(){
        if(!this.map){
            console.log("Map not initialized")
            return false;
        }

        this.map.doubleClickZoom.disable();
    }

    settingGeos(){
        let geos= [];
    
        if(this.id_dep || this.nom_dep ){
            if( this.id_dep === 20 ){
                for( let corse of ["2A", "2B"]){
                    this.geos.push(franceGeo.features.find(element => element.properties.code === corse))
                }
            }else{
                geos.push(franceGeo.features.find(element => parseInt(element.properties.code) === this.id_dep))
            }
        }else {
            for (let f of franceGeo.features) {
                geos.push(f)
            }
        }

        return geos;
    }


    settingLatLong(){
        if( this.id_dep ){
            this.latitude= centers[this.id_dep].lat;
            this.longitude= centers[this.id_dep].lng;
            this.defaultZoom= centers[this.id_dep].zoom;
        }
    }

    addGeoJsonToMap(){
        if(!this.map){
            console.log("Map not initialized")
            return false;
        }

        let geos= this.settingGeos();
        this.geoJSONLayer = L.geoJson().addTo(this.map);
        // this.geoJSONLayer = L.geoJson(geos, {
        //     style: {
        //         weight: 2,
        //         opacity: 1,
        //         color: (this.id_dep) ? "red" : "#63A3F6",
        //         dashArray: '3',
        //         fillOpacity: 0
        //     },
        //     onEachFeature: function (feature, layer) {
        //         layer.bindTooltip(feature.properties.nom);
        //     }
        // }).addTo(this.map);
    }

    eventSetPositionOnMap(){
        const cta_setCurrentPosition = document.createElement('a');
        cta_setCurrentPosition.setAttribute('href',"#");
        cta_setCurrentPosition.setAttribute('title',"Ma position");
        cta_setCurrentPosition.setAttribute('role',"button");
        cta_setCurrentPosition.setAttribute('aria-label', "Ma position");
        cta_setCurrentPosition.setAttribute('aria-disabled', "false");

        cta_setCurrentPosition.className= "cta_setCurrentPosition cta_setCurrentPosition_jheo_js";

        cta_setCurrentPosition.innerHTML= `
            <i class="fa-solid fa-street-view ma_position"></i>
        `

        if( document.querySelector(".leaflet-control-zoom-out")){
            document.querySelector(".leaflet-control-zoom-out").after(cta_setCurrentPosition)
        }

        ////handle event set to the current position
        document.querySelector(".cta_setCurrentPosition_jheo_js").addEventListener("click" ,async (e)=>{
            e.preventDefault();
            try{
                const position = await this.getUserLocation();
                const { coords } = position ;

                this.updateCenter(coords.latitude,coords.longitude, 6)
            }catch(e){
                alert("Votre position est bloquée, vous devez l'autoriser sur votre navigateur.")
            }
        })
    }

    settingMemoryCenter(){
        this.map.on("zoom dragend", (e) => {
            const coordAndZoom = {
                zoom: e.target._zoom ? e.target._zoom : this.defaultZoom,
                coord: e.target._lastCenter ? e.target._lastCenter : { lat: this.latitude, lng: this.longitude }
            }
            setDataInSessionStorage("memoryCenter", JSON.stringify(coordAndZoom));

            if(getDataInSessionStorage("lastSearchPosition")){
                const x= this.getMax(this.map.getBounds().getWest(),this.map.getBounds().getEast())
                const y= this.getMax(this.map.getBounds().getNorth(), this.map.getBounds().getSouth())
                const lastSearchPosition = {
                    zoom: 13,
                    position : { minx:x.min, miny:y.min, maxx:x.max, maxy:y.max }
                }
                setDataInSessionStorage("lastSearchPosition", JSON.stringify(lastSearchPosition))
            }


            if( document.querySelector(".icon_close_nav_left_jheo_js")){
                if(!document.querySelector(".content_navleft_jheo_js").classList.contains("d-none")){
                    document.querySelector(".content_navleft_jheo_js").classList.add("d-none")
                    iconsChange()
                };
            }
        })
    }

    updateDataInSessionStorage(lat, lng, zoom){
        const coordAndZoom = {
            zoom: zoom,
            coord: { lat, lng }
        }
        setDataInSessionStorage("memoryCenter", JSON.stringify(coordAndZoom))
    }

    updateCenter(lat, long, zoom){
        this.map.setView(L.latLng(lat, long), zoom, { animation: true });
    }

    resetZoom(){
        const memoryCenter= getDataInSessionStorage("memoryCenter") ? JSON.parse(getDataInSessionStorage("memoryCenter")) : null;
        if( memoryCenter.zoom !== 6 ){
            this.lastMemoryCenter= memoryCenter;
            this.map.setView(L.latLng(this.defautLatitude, this.defaultLongitude), 6, { animation: true });
        }else{
            this.map.setView(L.latLng(this.lastMemoryCenter.coord.lat,this.lastMemoryCenter.coord.lng), this.lastMemoryCenter.zoom, { animation: true });
        }
    }

    addControlPlaceholders(map) {
        const corners = map._controlCorners
        const leaflet = 'leaflet-'
        const container = map._controlContainer;
    
        function createCorner(vSide, hSide) {
            var className = leaflet + vSide + ' ' + leaflet + hSide;
    
            corners[vSide] = L.DomUtil.create('div', className, container);
        }
    
        createCorner('verticalcenterl', 'left swipe-me-reverse');
        createCorner('verticalcenter', 'right');
        createCorner('horizontalmiddle', 'center');
    
    }

    bindControlOnLeaflet(map){

        addControlPlaceholders(map);
        
        L.Control.DockPannel = L.Control.extend({
            onAdd: function (map) {
                var el = L.DomUtil.create('button', 'leaflet-bar my-control responsif-none-pc');
                el.innerHTML = `<svg version="1.0" xmlns="http://www.w3.org/2000/svg"
                                width="32.000000pt" height="32.000000pt" viewBox="0 0 32.000000 32.000000"
                                preserveAspectRatio="xMidYMid meet">

                                    <g transform="translate(0.000000,32.000000) scale(0.100000,-0.100000)"
                                    fill="#fff" stroke="none">
                                        <path d="M99 221 c-20 -20 -29 -39 -29 -61 0 -43 47 -90 90 -90 43 0 90 47 90
                                        90 0 43 -47 90 -90 90 -22 0 -41 -9 -61 -29z"/>
                                    </g>
                                </svg>`;
                el.setAttribute("draggable", "true")
                return el;
            },
            onRemove: function (map) {

            },
            onClick: () => {
            },
            onDragend: () => {

            }
        });

        L.control.myControl = function (opts) {
            return new L.Control.DockPannel(opts);
        }

        L.control.myControl({
            position: 'verticalcenter'//right
        }).addTo(map);

        var draggable = new L.Draggable(L.DomUtil.get(document.querySelector(".my-control")));
        draggable.enable();

        L.DomUtil.get(document.querySelector(".my-control")).addEventListener('click', () => {
            document.querySelector("#card").classList.toggle("hide")
            L.DomUtil.get(document.querySelector(".my-control")).classList.toggle("hide")
        })

        L.Control.DockPannel2 = L.Control.extend({
            onAdd: function (map) {
                var el = L.DomUtil.create('div', 'leaflet-bar my-controller');
                el.innerHTML = ` 
                    <div class="card-options-home hide responsif-none-pc" id="card">
                    <div class="options-container ">
                            <ul>
                                <li class="home-mobile" id="home-mobile">
                                    <svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="40px" height="40px" viewbox="0 0 512.000000 512.000000" preserveaspectratio="xMidYMid meet">
                                        <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)" stroke="none">
                                            <path d="M2260 4855 c-489 -64 -935 -276 -1294 -616 -418 -396 -688 -970 -712
                                                -1514 -8 -181 4 -165 -118 -165 -87 0 -105 -3 -119 -18 -38 -42 -26 -72 154
                                                -361 94 -152 182 -286 196 -298 13 -13 35 -23 48 -23 13 0 35 10 49 23 33 29
                                                366 562 372 596 4 18 -2 35 -16 54 -21 26 -24 27 -126 27 l-104 0 0 64 c0 161
                                                52 429 117 606 245 664 810 1139 1513 1273 97 18 151 21 340 21 189 0 243 -3
                                                340 -21 353 -67 659 -212 929 -438 77 -65 94 -75 128 -75 35 0 46 8 121 83 75
                                                75 82 86 82 122 0 34 -6 45 -52 88 -75 69 -228 183 -338 252 -270 167 -607
                                                284 -940 325 -112 13 -451 11 -570 -5z"/>
                                            <path d="M2450 3848 c-500 -34 -946 -380 -1113 -863 -92 -267 -92 -583 0 -850
                                                154 -444 534 -768 998 -850 119 -21 327 -21 452 1 574 97 1016 583 1061 1165
                                                27 337 -67 651 -273 914 -193 247 -486 421 -791 469 -126 20 -203 23 -334 14z
                                                m-378 -906 c10 -10 77 -174 149 -365 120 -318 130 -350 119 -377 -16 -38 -57
                                                -55 -93 -39 -19 9 -35 32 -56 83 l-30 71 -149 3 -149 3 -27 -70 c-31 -79 -45
                                                -94 -86 -94 -39 0 -70 29 -70 65 0 35 245 685 269 712 34 39 88 42 123 8z
                                                m571 0 c15 -14 17 -43 17 -329 l0 -313 94 0 c76 0 98 -3 117 -18 30 -25 30
                                                -75 0 -105 -20 -21 -31 -22 -165 -22 -128 0 -146 2 -165 19 -21 19 -21 26 -21
                                                386 0 337 1 368 18 382 34 31 70 31 105 0z m550 -4 c15 -18 17 -49 17 -329 l0
                                                -309 95 0 c109 0 135 -14 135 -72 0 -62 -15 -68 -185 -68 -142 0 -153 1 -171
                                                21 -18 20 -19 41 -19 379 0 381 0 380 50 400 27 11 56 3 78 -22z"/>
                                            <path d="M1972 2608 c-64 -166 -68 -148 37 -148 65 0 91 4 91 12 0 11 -79 228
                                                -85 236 -2 2 -21 -43 -43 -100z"/>
                                            <path d="M4656 3238 c-27 -25 -352 -542 -369 -588 -10 -25 -8 -34 9 -57 21
                                            -27 24 -28 129 -31 l108 -3 -6 -112 c-21 -384 -157 -754 -395 -1074 -85 -113
                                            -272 -300 -385 -385 -259 -192 -561 -322 -872 -375 -164 -27 -498 -25 -655 5
                                            -368 69 -642 202 -970 470 -40 32 -60 42 -89 42 -32 0 -45 -9 -119 -83 -74
                                            -75 -82 -86 -82 -121 0 -34 7 -45 53 -88 138 -129 341 -266 532 -358 230 -112
                                            433 -173 692 -211 197 -29 530 -24 723 11 1061 188 1856 1082 1909 2145 l6
                                            130 105 3 c120 3 140 13 140 70 0 27 -37 93 -181 323 -99 159 -189 294 -199
                                            299 -30 16 -57 12 -84 -12z"/>
                                        </g>
                                    </svg>
                                </li>
                                
                                <li class="resto" id="mobil-resto">
                                    <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
                                    width="50px" height="50px" viewBox="0 0 128.000000 128.000000"
                                    preserveAspectRatio="xMidYMid meet">

                                        <g transform="translate(0.000000,128.000000) scale(0.100000,-0.100000)"
                                        fill="#fff" stroke="none">
                                            <path d="M520 1047 c-20 -7 -36 -20 -38 -31 -3 -16 0 -18 25 -11 15 4 76 9
                                            136 12 79 4 107 8 107 18 0 7 -7 16 -16 19 -27 10 -177 5 -214 -7z"/>
                                            <path d="M372 948 c-8 -8 -12 -48 -12 -105 0 -92 0 -93 34 -131 l34 -38 -10
                                            -188 c-7 -133 -7 -196 1 -212 20 -44 102 -44 122 0 8 16 8 79 1 212 l-10 188
                                            34 38 c34 38 34 39 34 132 0 66 -4 97 -13 105 -23 18 -27 2 -27 -96 0 -92 0
                                            -93 -35 -131 l-34 -38 10 -188 c6 -103 8 -194 5 -202 -7 -18 -45 -18 -52 0 -3
                                            8 -1 99 5 202 l10 188 -34 38 c-35 38 -35 39 -35 132 0 95 -6 116 -28 94z"/>
                                            <path d="M437 954 c-4 -4 -7 -52 -7 -106 0 -89 2 -99 18 -96 15 3 17 16 17
                                            102 0 92 -8 120 -28 100z"/>
                                            <path d="M495 948 c-3 -8 -5 -55 -3 -104 3 -76 6 -89 21 -92 16 -3 17 5 15 99
                                            -2 71 -7 104 -15 107 -7 2 -15 -3 -18 -10z"/>
                                            <path d="M765 951 c-75 -32 -106 -203 -49 -271 l27 -31 -7 -184 c-7 -177 -7
                                            -184 13 -204 27 -27 75 -27 102 0 20 20 20 27 13 204 l-7 184 27 31 c25 31 31
                                            59 26 135 -2 37 -31 106 -52 122 -20 17 -69 24 -93 14z m74 -52 c41 -45 44
                                            -160 4 -201 l-26 -27 4 -193 4 -193 -25 0 -25 0 4 193 4 193 -26 27 c-56 58
                                            -24 222 43 222 11 0 28 -10 39 -21z"/>
                                            <path d="M935 910 c-4 -6 8 -33 25 -60 87 -136 81 -321 -15 -442 -36 -44 -42
                                            -62 -26 -73 12 -7 55 38 87 91 78 131 72 327 -14 448 -29 43 -46 53 -57 36z"/>
                                            <path d="M276 858 c-45 -79 -59 -139 -54 -241 5 -101 26 -161 81 -234 31 -40
                                            67 -57 67 -30 0 6 -16 32 -35 55 -90 115 -103 292 -28 420 23 41 25 72 4 72
                                            -6 0 -21 -19 -35 -42z"/>
                                            <path d="M580 245 c-16 -19 -1 -25 61 -25 56 0 84 14 59 30 -20 12 -108 9
                                            -120 -5z"/>
                                        </g>
                                    </svg>
                                </li>
                                <li class="ferme" id="mobil-ferme">
                                    <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
                                    width="50px" height="50px" viewBox="0 0 128.000000 128.000000"
                                    preserveAspectRatio="xMidYMid meet">

                                        <g transform="translate(0.000000,128.000000) scale(0.100000,-0.100000)"
                                        fill="#fff" stroke="none">
                                            <path d="M820 965 c-14 -7 -38 -16 -53 -20 -20 -4 -33 -16 -43 -40 -7 -18 -18
                                            -36 -24 -40 -13 -8 -13 -51 0 -75 5 -10 21 -20 34 -24 20 -5 26 -14 31 -50 8
                                            -52 -13 -101 -50 -118 -14 -6 -25 -17 -25 -25 0 -23 31 -14 65 20 44 44 53 91
                                            31 170 -16 58 -16 62 2 86 26 35 67 39 99 9 20 -19 24 -29 19 -59 -5 -31 -2
                                            -39 19 -53 33 -21 76 -98 90 -158 6 -27 15 -48 20 -46 17 5 8 83 -14 126 -12
                                            23 -17 42 -12 42 15 0 32 36 25 55 -4 8 -18 22 -33 29 l-26 14 28 13 c15 7 26
                                            17 24 23 -6 17 -49 36 -85 36 -29 0 -32 2 -26 24 4 19 -1 32 -20 50 -29 30
                                            -41 31 -76 11z m145 -125 c-3 -5 -10 -10 -16 -10 -5 0 -9 5 -9 10 0 6 7 10 16
                                            10 8 0 12 -4 9 -10z"/>
                                            <path d="M855 831 c-7 -12 12 -24 25 -16 11 7 4 25 -10 25 -5 0 -11 -4 -15 -9z"/>
                                            <path d="M246 778 c-69 -40 -109 -153 -72 -204 8 -10 16 -17 18 -14 2 3 12 18
                                            22 33 9 15 28 33 42 39 13 6 24 18 24 26 0 10 4 12 13 5 6 -6 32 -13 56 -16
                                            62 -8 71 -23 13 -23 -142 0 -218 -164 -126 -274 33 -38 74 -60 114 -60 35 0
                                            37 8 10 52 -40 65 -16 159 49 193 44 22 48 20 53 -33 9 -96 91 -205 174 -232
                                            25 -8 34 -18 34 -33 0 -12 7 -30 15 -41 12 -16 12 -20 -1 -33 -7 -8 -14 -21
                                            -14 -29 0 -19 26 -18 34 2 5 14 7 14 22 0 17 -18 50 -21 59 -6 3 6 -5 14 -19
                                            20 -55 21 -9 84 81 110 92 28 189 138 196 224 4 51 -20 40 -37 -17 -55 -189
                                            -300 -252 -439 -113 -47 47 -67 85 -74 144 l-5 47 67 -3 c77 -4 118 4 112 21
                                            -2 8 -24 11 -70 9 -95 -5 -103 -1 -99 52 5 54 -24 115 -70 147 -47 34 -131 37
                                            -182 7z m494 -539 c0 -11 -27 -29 -33 -22 -14 14 -6 32 13 30 11 -1 20 -4 20
                                            -8z"/>
                                            <path d="M865 590 c-4 -6 10 -26 32 -45 21 -19 33 -34 27 -35 -6 0 -17 7 -24
                                            15 -17 20 -54 19 -98 -4 -100 -51 -121 -60 -175 -74 -33 -9 -62 -19 -65 -22
                                            -11 -11 49 -53 97 -70 59 -20 170 -19 221 1 75 30 107 109 72 174 -22 40 -76
                                            77 -87 60z"/>
                                        </g>
                                    </svg>
                                </li>
                                <li class="station" id="mobile_station_js_jheo">
                                    <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
                                    width="50px" height="50px" viewBox="0 0 128.000000 128.000000"
                                    preserveAspectRatio="xMidYMid meet">
                                        <g transform="translate(0.000000,128.000000) scale(0.100000,-0.100000)" fill="#fff" stroke="none">
                                            <path d="M397 942 c-13 -15 -17 -39 -17 -112 0 -79 3 -97 19 -114 15 -16 24
                                            -51 35 -141 20 -148 20 -179 1 -195 -8 -7 -15 -28 -15 -46 l0 -34 184 0 c119
                                            0 187 4 191 11 9 14 -2 55 -21 73 -12 13 -14 29 -8 86 6 64 9 70 29 70 38 0
                                            55 -30 55 -98 0 -74 20 -102 73 -102 65 0 67 9 67 271 l0 235 -38 37 c-36 35
                                            -62 47 -62 29 0 -5 11 -19 25 -32 14 -13 25 -27 25 -31 0 -5 -11 -25 -25 -45
                                            -42 -62 -25 -144 31 -144 l24 0 0 -130 c0 -117 -2 -132 -20 -150 -24 -24 -30
                                            -24 -55 -6 -15 11 -20 30 -23 84 -5 78 -19 100 -66 104 l-27 2 7 66 c5 47 13
                                            73 30 93 21 25 24 39 24 106 0 64 -4 83 -21 105 l-20 26 -193 0 c-174 0 -195
                                            -2 -209 -18z m368 -112 l0 -55 -157 -3 -158 -3 0 61 0 61 158 -3 157 -3 0 -55z
                                            m195 -81 c0 -52 -2 -60 -17 -57 -26 5 -30 74 -7 99 9 10 19 19 21 19 1 0 3
                                            -27 3 -61z"/>
                                        </g>
                                    </svg>
                                    
                                </li>
                                <li class="golf" id="mobile-golf" >
                                    <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
                                    width="25px" viewBox="0 0 300.000000 500.000000"
                                    preserveAspectRatio="xMidYMid meet">

                                    <g transform="translate(0.000000,500.000000) scale(0.100000,-0.100000)"
                                    fill="#fff" stroke="none">
                                    <path d="M1141 4661 c-18 -33 -12 -59 21 -97 35 -40 40 -88 10 -110 -9 -7 -13
                                    -19 -9 -33 3 -13 -1 -54 -9 -93 -8 -39 -16 -75 -17 -81 -2 -9 28 -32 78 -62
                                    10 -6 16 -18 14 -28 -4 -16 -7 -15 -38 8 -20 14 -48 25 -65 25 -61 0 -217 -63
                                    -253 -102 -21 -24 -34 -136 -20 -187 5 -19 22 -48 38 -64 l30 -29 -67 -172
                                    c-37 -94 -93 -230 -125 -302 -70 -160 -84 -207 -105 -346 -14 -95 -14 -111 -1
                                    -121 7 -7 20 -28 27 -47 7 -19 19 -40 26 -46 11 -9 10 -22 -6 -75 -13 -43 -20
                                    -94 -20 -154 0 -49 -7 -153 -15 -230 -8 -77 -15 -206 -15 -287 l0 -148 41 0
                                    42 0 -7 -47 c-36 -265 -27 -419 46 -766 11 -54 19 -100 17 -101 -2 -2 -65 -15
                                    -139 -30 -239 -48 -437 -126 -527 -209 -56 -51 -87 -116 -79 -162 33 -174 408
                                    -325 937 -375 198 -19 707 -8 883 19 340 53 578 136 688 239 59 55 78 88 78
                                    137 0 94 -93 182 -271 256 -78 32 -318 99 -356 99 -27 0 -40 19 -22 31 11 7 9
                                    17 -11 55 -13 26 -37 65 -53 86 -31 44 -33 44 -126 2 l-53 -24 -27 21 c-33 26
                                    -121 151 -186 265 -40 70 -68 103 -140 167 -182 161 -176 155 -169 196 4 20
                                    12 47 19 61 12 25 44 196 65 355 15 116 27 158 46 172 22 16 43 125 44 225 0
                                    50 4 78 12 80 9 3 12 46 13 154 0 130 -3 159 -24 224 l-23 74 78 73 c44 40 85
                                    79 92 86 7 6 40 42 72 80 50 56 60 74 60 104 0 20 10 52 23 72 19 31 22 49 21
                                    128 -1 86 -3 96 -42 174 -31 61 -39 86 -31 96 26 31 105 73 148 78 25 4 55 11
                                    66 16 26 13 321 -46 675 -134 l255 -64 16 -62 c9 -35 24 -70 32 -78 20 -20 73
                                    -11 118 20 30 21 34 28 32 65 -1 24 -14 65 -30 95 -26 49 -31 52 -69 55 -38 3
                                    -44 0 -65 -30 -12 -18 -24 -34 -25 -36 -3 -5 -185 40 -370 92 -89 24 -222 56
                                    -295 70 -233 46 -270 57 -267 81 2 15 -3 21 -21 23 -14 2 -37 17 -53 34 -21
                                    22 -34 29 -51 25 -12 -3 -56 -15 -97 -25 -41 -11 -77 -18 -79 -16 -12 10 39
                                    106 79 151 73 80 89 173 46 271 -19 45 -32 59 -86 92 -86 53 -105 56 -190 27
                                    l-73 -24 -56 22 c-93 37 -99 38 -110 16z m-8 -3298 c78 -75 177 -160 219 -190
                                    65 -45 177 -155 178 -173 0 -3 -84 -4 -187 -2 -104 1 -236 -1 -295 -5 l-108
                                    -9 0 100 c0 54 5 127 11 161 10 51 9 81 -5 168 -9 58 -16 111 -16 117 0 19 54
                                    -26 203 -167z"/>
                                    </g>
                                    </svg>

                                </li>
                                <li class="tabac" id="mobile-tabac" >
                                    <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
                                    width="50px" height="50px" viewBox="0 0 400.000000 400.000000"
                                    preserveAspectRatio="xMidYMid meet">

                                        <g transform="translate(0.000000,400.000000) scale(0.100000,-0.100000)"
                                        fill="#fff" stroke="none">
                                            <path d="M1999 3671 c-126 -45 -207 -119 -233 -216 -9 -33 -20 -67 -23 -75 -3
                                            -8 -7 -20 -8 -25 -4 -18 -56 -178 -87 -265 -16 -47 -31 -96 -33 -110 -2 -14
                                            -18 -65 -35 -115 -17 -49 -34 -103 -37 -120 -3 -16 -9 -34 -13 -40 -5 -5 -11
                                            -27 -15 -47 -4 -21 -11 -38 -16 -38 -4 0 -11 -17 -14 -37 -6 -44 -9 -53 -65
                                            -233 -23 -74 -53 -164 -67 -199 -22 -56 -24 -75 -20 -150 8 -119 12 -141 33
                                            -184 16 -33 16 -41 5 -60 -11 -18 -11 -20 0 -9 11 10 22 -14 61 -135 26 -82
                                            51 -164 54 -183 4 -19 10 -39 14 -45 4 -5 14 -32 22 -60 9 -27 39 -124 68
                                            -215 28 -91 64 -205 80 -255 130 -419 124 -406 235 -478 59 -38 97 -53 185
                                            -73 62 -14 150 -11 150 4 0 5 -24 22 -53 40 -30 18 -64 44 -76 57 -19 22 -55
                                            111 -81 200 -5 17 -23 70 -39 118 -17 48 -31 97 -31 108 0 11 -7 33 -15 49 -8
                                            16 -17 37 -18 47 -2 10 -9 32 -16 48 -7 17 -24 71 -37 120 -14 50 -32 106 -39
                                            125 -36 92 -57 173 -51 198 5 19 4 23 -3 13 -7 -10 -18 13 -40 84 -17 55 -31
                                            110 -31 122 0 13 -4 23 -9 23 -4 0 -14 21 -21 48 -7 26 -28 93 -46 149 -51
                                            155 -59 109 116 653 15 47 47 150 71 230 23 80 46 149 51 154 4 6 8 17 8 25 0
                                            22 51 184 61 195 5 6 9 17 9 27 0 15 60 209 79 254 25 60 31 78 31 94 0 26 25
                                            72 35 63 5 -4 5 1 2 11 -4 11 -1 17 9 17 8 0 13 4 10 9 -3 5 1 14 9 21 14 12
                                            19 7 16 -13 -1 -5 3 -6 9 -2 8 5 7 11 -1 21 -6 8 -10 16 -8 17 2 2 17 9 33 17
                                            90 45 88 52 -17 49 -60 -1 -103 -9 -158 -28z"/>
                                            <path d="M1800 3570 c0 -5 5 -10 11 -10 5 0 7 5 4 10 -3 6 -8 10 -11 10 -2 0
                                            -4 -4 -4 -10z"/>
                                            <path d="M2226 3215 c-17 -13 -33 -22 -37 -20 -3 3 -5 -7 -3 -20 1 -14 -1 -25
                                            -5 -25 -5 0 -18 -39 -31 -87 -12 -49 -29 -101 -37 -116 -7 -15 -11 -32 -7 -38
                                            3 -6 -2 -19 -12 -30 -10 -11 -12 -19 -5 -19 7 0 8 -6 2 -17 -24 -46 -45 -107
                                            -44 -126 1 -11 -7 -37 -18 -58 -10 -21 -19 -49 -19 -63 0 -14 -4 -28 -10 -31
                                            -5 -3 -10 -14 -10 -24 0 -9 -9 -36 -20 -59 -11 -22 -20 -48 -20 -57 0 -35 -45
                                            -184 -79 -258 -12 -27 -19 -52 -17 -55 2 -4 -4 -32 -14 -61 -16 -49 -17 -58
                                            -4 -95 8 -22 16 -57 17 -77 1 -21 5 -35 8 -33 7 4 21 -27 38 -86 6 -19 15 -51
                                            22 -70 6 -19 19 -64 29 -100 19 -70 37 -124 51 -152 5 -10 9 -26 9 -36 0 -10
                                            9 -36 20 -57 11 -22 18 -46 15 -53 -4 -12 21 -87 45 -133 5 -9 12 -34 15 -55
                                            4 -22 18 -73 31 -115 14 -42 27 -86 29 -98 10 -55 30 -92 52 -97 13 -4 23 -9
                                            23 -13 0 -4 15 -8 32 -8 18 0 27 2 20 5 -10 3 -10 6 1 16 14 11 74 183 69 199
                                            -1 4 7 24 18 44 11 21 20 47 20 58 0 12 4 25 9 31 12 13 38 100 46 154 4 25
                                            14 52 22 62 8 9 21 47 28 85 8 37 21 84 29 103 13 30 47 140 75 235 5 17 23
                                            76 42 132 l33 103 -33 102 c-48 154 -51 163 -51 176 0 6 -5 23 -12 39 -6 15
                                            -10 32 -9 36 1 5 -5 23 -13 40 -22 47 -76 213 -76 232 0 9 -6 26 -14 38 -8 12
                                            -17 38 -20 57 -12 66 -29 120 -36 120 -5 0 -11 19 -15 43 -4 23 -16 59 -26 81
                                            -11 21 -18 45 -15 52 3 7 1 16 -4 19 -6 4 -10 17 -10 30 0 13 -4 26 -9 29 -5
                                            3 -14 26 -20 50 -6 24 -17 51 -25 59 -8 8 -12 19 -8 23 4 5 3 6 -2 2 -5 -4
                                            -14 -4 -20 1 -7 6 -22 1 -40 -14z"/>
                                            <path d="M1662 2164 c-7 -8 -8 -14 -3 -14 10 0 25 19 20 25 -2 1 -10 -3 -17
                                            -11z"/>
                                            <path d="M1665 1910 c-3 -5 -1 -10 4 -10 6 0 11 5 11 10 0 6 -2 10 -4 10 -3 0
                                            -8 -4 -11 -10z"/>
                                            <path d="M1831 1274 c0 -11 3 -14 6 -6 3 7 2 16 -1 19 -3 4 -6 -2 -5 -13z"/>
                                            <path d="M1520 1210 c0 -19 3 -21 12 -12 9 9 9 15 0 24 -9 9 -12 7 -12 -12z"/>
                                            <path d="M1520 1129 c0 -5 5 -7 10 -4 6 3 10 8 10 11 0 2 -4 4 -10 4 -5 0 -10
                                            -5 -10 -11z"/>
                                            <path d="M2135 410 c-4 -6 -3 -16 3 -22 6 -6 12 -6 17 2 4 6 3 16 -3 22 -6 6
                                            -12 6 -17 -2z"/>
                                        </g>
                                    </svg>

                                </li>
                                <li class="home-mobile" id="home-mobile-connexion">
                                    <svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="40px" height="40px" viewbox="0 0 512.000000 512.000000" preserveaspectratio="xMidYMid meet">
                                        <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)" stroke="none">
                                            <path d="M2158 4700 c-97 -24 -184 -64 -271 -123 -37 -26 -71 -47 -75 -47 -18
                                                0 -152 -149 -199 -222 -108 -164 -156 -331 -155 -533 2 -566 251 -1070 615
                                                -1246 158 -76 318 -88 482 -35 222 71 456 320 565 600 18 44 38 95 45 111 14
                                                32 51 178 60 235 3 19 9 58 15 85 18 97 23 297 11 386 -52 350 -290 653 -598
                                                760 -153 53 -350 64 -495 29z m-330 -574 c44 -22 209 -75 291 -92 233 -49 454
                                                -27 713 70 l91 35 33 -33 c19 -19 39 -55 49 -87 21 -67 30 -281 17 -394 -5
                                                -44 -9 -81 -8 -82 1 -1 25 9 53 23 29 15 56 24 61 23 4 -2 2 -42 -5 -89 -7
                                                -47 -15 -100 -17 -117 -13 -99 -110 -331 -185 -442 -247 -363 -637 -443 -946
                                                -194 -72 59 -180 191 -225 276 -19 34 -36 64 -39 67 -13 11 -31 51 -40 87 -5
                                                21 -20 75 -34 120 -27 88 -63 280 -54 290 3 3 31 -7 62 -21 l56 -25 -8 72 c-4
                                                40 -7 128 -7 197 0 151 24 246 75 298 36 37 32 36 67 18z"/>
                                            <path d="M1545 2554 c-461 -82 -824 -424 -945 -889 -30 -113 -38 -352 -16
                                                -455 45 -211 166 -342 376 -409 116 -37 239 -52 495 -61 284 -10 1568 -11
                                                1692 -2 l82 7 -30 45 c-49 72 -87 153 -111 237 -19 65 -23 101 -22 218 0 131
                                                2 146 32 234 76 220 215 377 424 476 101 48 248 78 356 73 45 -3 82 -3 82 0 0
                                                2 -25 37 -55 77 -114 151 -294 292 -467 367 -89 39 -245 82 -325 91 -41 5 -41
                                                4 -48 -31 -28 -150 -198 -272 -459 -329 -63 -14 -122 -18 -261 -17 -160 1
                                                -191 4 -280 27 -229 61 -376 170 -411 306 -6 25 -15 46 -20 47 -5 1 -45 -4
                                                -89 -12z"/>
                                            <path d="M3790 1934 c-14 -2 -52 -9 -85 -15 -33 -5 -106 -32 -162 -60 -356
                                                -172 -492 -593 -307 -951 54 -104 191 -240 295 -291 171 -84 362 -99 534 -44
                                                273 89 463 333 482 620 22 336 -208 648 -531 722 -68 15 -188 26 -226 19z
                                                m148 -360 c70 -35 103 -90 110 -185 l5 -69 33 0 c61 0 64 -10 64 -223 0 -106
                                                -5 -199 -10 -207 -14 -23 -531 -28 -566 -5 -24 15 -24 16 -24 210 0 215 3 225
                                                64 225 l33 0 5 69 c7 95 40 150 110 185 66 33 110 33 176 0z"/>
                                            <path d="M3774 1487 c-33 -30 -36 -39 -41 -100 l-6 -67 122 0 121 0 0 51 c0
                                            92 -47 149 -124 149 -27 0 -45 -8 -72 -33z"/>
                                        </g>
                                    </svg>
                                </li>
                                
                        </ul>
                            <div class="home">
                                <button id="retoure" class="retoure">
                                    <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
                                    width="32.000000pt" height="32.000000pt" viewBox="0 0 32.000000 32.000000"
                                    preserveAspectRatio="xMidYMid meet">

                                        <g transform="translate(0.000000,32.000000) scale(0.100000,-0.100000)"
                                        fill="#fff" stroke="none">
                                            <path d="M99 221 c-20 -20 -29 -39 -29 -61 0 -43 47 -90 90 -90 43 0 90 47 90
                                            90 0 43 -47 90 -90 90 -22 0 -41 -9 -61 -29z"/>
                                        </g>
                                    </svg>
                                </button>
                            </div>
                    </div>
                    </div>`;

                return el;
            },
            onRemove: function (map) { },
            onClick: () => { },
            onDragend: () => { }
        });

        L.control.myControl2 = function (opt2) {
            return new L.Control.DockPannel2(opt2);
        }

        L.control.myControl2({
            position: 'horizontalmiddle'//center
        }).addTo(map);

        L.DomUtil.get(document.querySelector("#retoure")).addEventListener('click', () => {
            document.querySelector("#card").classList.toggle("hide")
            L.DomUtil.get(document.querySelector(".my-control")).classList.toggle("hide")
        })

        L.Control.DockPannel3 = L.Control.extend({
            onAdd: function (map) {
                var el = L.DomUtil.create('div', 'leaflet-bar my-list');
                el.innerHTML = ` 
                    <svg class="close responsif-none-pc" id="close" version="1.0" xmlns="http://www.w3.org/2000/svg"
                    width="20px" height="20px" viewBox="0 0 980.000000 982.000000"
                    preserveAspectRatio="xMidYMid meet">

                        <g transform="translate(0.000000,982.000000) scale(0.100000,-0.100000)"
                        fill="#000000" stroke="none">
                            <path d="M217 9593 l-217 -218 2232 -2232 2233 -2233 -2233 -2233 -2232 -2232
                            220 -220 220 -220 2228 2228 c1225 1225 2232 2227 2237 2227 5 0 1010 -1000
                            2232 -2222 l2223 -2223 220 220 220 220 -2227 2227 -2228 2228 2228 2228 2227
                            2227 -220 220 -220 220 -2223 -2223 c-1222 -1222 -2227 -2222 -2232 -2222 -6
                            0 -1011 1001 -2235 2225 -1224 1224 -2227 2225 -2230 2225 -3 0 -103 -98 -223
                            -217z"/>
                        </g>
                    </svg>
                
                `     ;

                return el;
            },
            onRemove: function (map) {

            },
            onClick: () => {
                alert("toto")
            },
            onDragend: () => {

            }
        });

        L.control.myControl3 = function (opt3) {
            return new L.Control.DockPannel3(opt3);
        }

        L.control.myControl3({
            position: 'verticalcenterl'//left
        }).addTo(map);
    }

    bindEventLocationForMobile(){

        document.getElementById("mobile_station_js_jheo").addEventListener("click", () => {
            location.assign("/station");
        });
        document.getElementById("home-mobile").addEventListener('click', () => {
            location.assign('/')
        });
        document.getElementById("mobil-ferme").addEventListener('click', () => {
            location.assign('/ferme')
        });
        document.getElementById("mobil-resto").addEventListener('click', () => {
            location.assign('/restaurant')
        });//home-mobile
    
        document.getElementById("home-mobile-connexion").addEventListener('click', () => {
            location.assign('/connexion')
        });

        document.getElementById("mobile-golf").addEventListener('click', () => {
            location.assign('/golf')
        });

        document.getElementById("mobile-tabac").addEventListener('click', () => {
            location.assign('/tabac')
        });
    }


    /// fonction create map: ( init map, init geojson, add event on memoire zooming)
    initMap(lat= null,long= null, zoom= null , isAddControl=false){
        const content_map= document.querySelector(".cart_map_js");

        if( document.querySelector("#toggle_chargement")){
            content_map.removeChild(document.querySelector("#toggle_chargement"))
        }
        
        if( !document.querySelector("#map")){
            const map= document.createElement("div");
            map.setAttribute("id", "map");
            map.setAttribute("class", "map");

            content_map.appendChild(map);
        }

        ///init map
        this.createMap(lat, long, zoom);
        // this.eventSetPositionOnMap();

        ////init geojson
        this.addGeoJsonToMap();

        ///inject event to save memoir zoom
        this.settingMemoryCenter();

        if( isAddControl ){ /// bind controller in the right
            //// bind all fonctionnality on the right
            this.bindOtherControles();

            //// prepare right container
            this.createRightSideControl();
        }


        // this.bindControlOnLeaflet(this.map);
        // this.bindEventLocationForMobile();
    }
    
    //// get Max
    getMax(max,min){
        if(Math.abs(max)<Math.abs(min))
            return {max:min,min:max} 
        else
           return {max:max,min:min}
    }

    ///bind and add control on the right side of the map
    bindOtherControles(){
        // let htmlControl = `
        //     <button class="btn btn-warning right_control_jheo_js" data-type="tiles_type_jheo_js"  style="font-size: 1.1rem;">
        //         <i class="fa-solid fa-layer-group" data-type="tiles_type_jheo_js"></i>
        //     </button>
        //     <button class="btn btn-primary" data-type="couche_tabac_jheo_js" style="font-size: 1.1rem;">
        //         <i class="fa-brands fa-connectdevelop" data-type="couche_tabac_jheo_js"></i>
        //     </button>
        // `;
        let htmlControl = `
            ${this.createBtnControl("tiles_type_jheo_js","fa-solid fa-layer-group","btn btn-warning", "Sélectionner un type de carte.")}
            ${this.createBtnControl("couche_tabac_jheo_js","fa-brands fa-connectdevelop","btn btn-primary", "Listes des contours géographiques.")}
        `;
        if( this.mapForType === "golf"){
            htmlControl += `
                ${this.createBtnControl("info_golf_jheo_js","fa-solid fa-circle-question","btn btn-info", "Légende des icônes sur la carte.")}
            `
        //     <button class="btn btn-info" data-type="info_golf_jheo_js" style="font-size: 1.1rem;">
        //         <i class="fa-solid fa-circle-question" data-type="info_golf_jheo_js"></i>
        //     </button>
        }else if( this.mapForType === "resto" ){ 
            htmlControl += `
                ${this.createBtnControl("info_resto_jheo_js","fa-solid fa-circle-question","btn btn-info", "Légende des icônes sur la carte.")}
                ${this.createBtnControl("resto_pastille_jheo_js","fa-solid fa-location-dot fa-flip text-danger","btn btn-light", "Liste des restaurants pastilles.")}
            `
            // <button class="btn btn-info" data-type="info_resto_jheo_js" style="font-size: 1.1rem;">
            //     <i class="fa-solid fa-circle-question" data-type="info_resto_jheo_js"></i>
            // </button>
            // <button class="btn btn-light" data-type="resto_pastille_jheo_js" style="font-size: 1.1rem;">
            //     <i  class="fa-solid fa-location-dot fa-flip text-danger" data-type="resto_pastille_jheo_js"></i>
            // </button>
        }else if( this.mapForType === "tous"){
            htmlControl += `
                ${this.createBtnControl("info_tous_jheo_js","fa-solid fa-circle-question","btn btn-info", "Légende des icônes sur la carte.")}
                ${this.createBtnControl("resto_pastille_jheo_js","fa-solid fa-location-dot fa-flip text-danger","btn btn-light", "Liste des restaurants pastilles.")}
            `
            // <button class="btn btn-info" data-type="info_tous_jheo_js" style="font-size: 1.1rem;">
            //     <i class="fa-solid fa-circle-question" data-type="info_tous_jheo_js"></i>
            // </button>
            // <button class="btn btn-light" data-type="resto_pastille_jheo_js" style="font-size: 1.1rem;">
            //     <i  class="fa-solid fa-location-dot fa-flip text-danger" data-type="resto_pastille_jheo_js"></i>
            // </button>
        }else if( this.mapForType === "station"){
            htmlControl += `
                ${this.createBtnControl("info_station_jheo_js","fa-solid fa-circle-question","btn btn-info", "Légende des icônes sur la carte.")}
            `
            // <button class="btn btn-info" data-type="info_station_jheo_js" style="font-size: 1.1rem;">
            //     <i class="fa-solid fa-circle-question" data-type="info_station_jheo_js"></i>
            // </button>
        }else if( this.mapForType === "ferme"){
            htmlControl += `
                ${this.createBtnControl("info_ferme_jheo_js","fa-solid fa-circle-question","btn btn-info", "Légende des icônes sur la carte.")}
            `
            // <button class="btn btn-info" data-type="info_ferme_jheo_js" style="font-size: 1.1rem;">
            //     <i class="fa-solid fa-circle-question" data-type="info_ferme_jheo_js"></i>
            // </button>
        }else if( this.mapForType === "tabac"){
            htmlControl += `
                ${this.createBtnControl("info_tabac_jheo_js","fa-solid fa-circle-question","btn btn-info", "Légende des icônes sur la carte.")}
            `
            // <button class="btn btn-info" data-type="info_tabac_jheo_js" style="font-size: 1.1rem;">
            //     <i class="fa-solid fa-circle-question" data-type="info_tabac_jheo_js"></i>
            // </button>
        }

        htmlControl += `
            ${this.createBtnControl("reset_zoom_jheo_js","fa-solid fa-arrows-rotate","btn btn-dark", "Réstaure le niveau de zoom en position initiale.")}
        `

        L.control.custom({
            // position: 'topright',
            content : htmlControl,
            classes : 'btn-group-vertical btn-group-sm btn_group_vertical',
            // style   :
            // {
            //     margin: '10px',
            //     padding: '0px 0 0 0',
            //     cursor: 'pointer',
            // },
            datas   :{
                'foo': 'bar',
            },
            events:{
                click: (data) => {
                    if (screen.width < 991) { 
                        this.openRightSideMobile(data.srcElement.dataset.type);
                        
                    } else {
                        this.openRightSide(data.srcElement.dataset.type);
                    }
                    
                },
                dblclick: function(){
                    closeRightSide();
                },
                contextmenu: function(data){
                    console.log('wrapper div element contextmenu');
                    console.log(data);
                },
            }
        }).addTo(this.map);


        //// bint event hover on btn control.
        this.bindTooltipsOnHover();
    }

    /**
     * @author Jehovanie RAMANDRIJOEL
     * Cette fonction est irrittér dans tous les rubriques, 
     * localisation du fichier: cette meme fichier seulement.,
     * je veux: faire construire une template dynamique des btn controles à adroite
     * si une btn controle, on trouve une icon, couleur unique, message tooltip, action qui ouvre la partie droite.
     */
    createBtnControl(dataType, faSolidIcon, classBtn, messageTooltip){
        const fontSize = (dataType === "resto_pastille_jheo_js") ? '1.3rem' : '1.1rem';
        return `
            <div class="content_message_tooltip content_message_tooltip_jheo_js" data-type="${dataType}">
                <div class="message_tooltip d-none message_tooltip_jheo_js">${messageTooltip}</div>
                <button class="${classBtn} right_control_jheo_js" data-type="${dataType}"  style="font-size: ${fontSize};">
                    <i class="${faSolidIcon}" data-type="${dataType}"></i>
                </button>
            </div>
        `
    }

    /**
     * @author Jehovanie RAMANDRIJOEL
     * Cette fonction est irrittér dans tous les rubriques, 
     * localisation du fichier: cette meme fichier seulement.,
     * je veux: faire afficher ou cache un message tooltip sur une btn control
     */
    bindTooltipsOnHover(){
        const all_control= document.querySelectorAll(`.content_message_tooltip_jheo_js`);

        all_control.forEach(item_control => {
            item_control.addEventListener('mouseover',() => {
                item_control.querySelector('.message_tooltip_jheo_js').classList.remove('d-none')
            })

            item_control.addEventListener('mouseout',() => {
                item_control.querySelector('.message_tooltip_jheo_js').classList.add('d-none')
            })
        })
    }



    leafletControlExtend(position= 'topright'){
        
        L.Control.Custom = L.Control.extend({
            version: '1.0.1',
            options: {
                position: position,
                id: '',
                title: '',
                classes: '',
                content: '',
                style: {},
                datas: {},
                events: {},
            },
            container: "container_lefleat_jheo_js",

            onAdd: function (map) {
                this.container = L.DomUtil.create('div');
                this.container.id = this.options.id;
                this.container.title = this.options.title;
                this.container.className = this.options.classes;
                this.container.innerHTML = this.options.content;
    
                for (var option in this.options.style){
                    this.container.style[option] = this.options.style[option];
                }
    
                for (var data in this.options.datas){
                    this.container.dataset[data] = this.options.datas[data];
                }
    
    
                /* Prevent click events propagation to map */
                L.DomEvent.disableClickPropagation(this.container);
    
                /* Prevent right click event propagation to map */
                L.DomEvent.on(this.container, 'contextmenu', function (ev){
                    L.DomEvent.stopPropagation(ev);
                });
    
                /* Prevent scroll events propagation to map when cursor on the div */
                L.DomEvent.disableScrollPropagation(this.container);
    
                for (var event in this.options.events){
                    L.DomEvent.on(this.container, event, this.options.events[event], this.container);
                }
    
                return this.container;
            },
    
            onRemove: function (map) {
                for (var event in this.options.events){
                    L.DomEvent.off(this.container, event, this.options.events[event], this.container);
                }
            },
        });
    
        L.control.custom = function (options) {
            return new L.Control.Custom(options);
        };
    }

    updateListRestoPastille( idResto, tribuName){
        this.listRestoPastille.push({id_resto: idResto, tableName: tribuName })
        this.updateStateResto(idResto)
    }

    updateListRestoDepastille(idResto, tribuName){
        this.listRestoPastille = this.listRestoPastille.filter(item=>{ return (parseInt(item.id_resto) != parseInt(idResto) || item.tableName != tribuName)})
        this.updateStateResto(idResto)
    }



    createRightSideControl(){
        if( !document.querySelector(".content_cart_map_jheo_js")){
            console.log("Selector not found : 'content_cart_map_jheo_js'");
            return null;
        }

        const container = document.createElement("div");
        container.className = "content_legende content_legende_jheo_js";
        
        container.innerHTML = `
            <div class="content_header_right_side">
                <div class="header_right_side">
                    <div class="title_right_side text-black title_right_side_jheo_js">
                        CONTROL RIGHT SIDE
                    </div>
                    <div class="content_close_right_side">
                        <div class="close_right_side close_right_side_jheo_js">
                            <i class="fa-solid fa-xmark"></i>
                        </div>
                    </div>
                </div>
            </div>

            <div class="content_right_side_body content_right_side_body_jheo_js">
                
            </div>
        `

        document.querySelector(".content_cart_map_jheo_js").appendChild(container);
    }

    openRightSide(rightSideContentType){

        if(rightSideContentType === "reset_zoom_jheo_js" ){
            this.resetZoom()
        }else{
            if( document.querySelector(".close_details_jheo_js")){
                document.querySelector(".close_details_jheo_js").click();
            }
    
            if( document.querySelector('.icon_close_nav_left_jheo_js')){
                document.querySelector(".icon_close_nav_left_jheo_js").click();
            }
    
            const cart_width= '75%';
            const cont_legent_width= '25%';
            
            if(document.querySelector(".cart_map_jheo_js") && document.querySelector(".content_legende_jheo_js") ){
    
                if( !document.querySelector(".title_right_side_jheo_js")){
                    console.log("Selector not found: '.title_right_side_jheo_js'")
                    return false;
                }
        
                if( rightSideContentType === "info_golf_jheo_js"){
                    document.querySelector(".title_right_side_jheo_js").innerText = "Légende des icônes sur la carte.";
                    injectStatusGolf(); 
    
                }else if( rightSideContentType === "resto_pastille_jheo_js" ){
                    document.querySelector(".title_right_side_jheo_js").innerText = "Liste des restaurants pastilles.";
                    this.injectListRestoPastille();
    
                }else if( rightSideContentType === "info_resto_jheo_js" ){
                    document.querySelector(".title_right_side_jheo_js").innerText = "Légende des icônes sur la carte.";
                    injectStatusResto();
    
                }else if( rightSideContentType === "info_ferme_jheo_js" ){
                    document.querySelector(".title_right_side_jheo_js").innerText = "Légende des icônes sur la carte.";
                    injectStatusFerme();
    
                }else if( rightSideContentType === "info_station_jheo_js" ){
                    document.querySelector(".title_right_side_jheo_js").innerText = "Légende des icônes sur la carte.";
                    injectStatusStation();
    
                }else if( rightSideContentType === "info_tabac_jheo_js" ){
                    document.querySelector(".title_right_side_jheo_js").innerText = "Légende des icônes sur la carte.";
                    injectStatusTabac();
    
                }else if( rightSideContentType === "info_tous_jheo_js" ){
                    document.querySelector(".title_right_side_jheo_js").innerText = "Légende des icônes sur la carte.";
                    injectStatusTous();
    
                }else if( rightSideContentType === "couche_tabac_jheo_js" ){
                    document.querySelector(".title_right_side_jheo_js").innerText = "Listes des contours géographiques.";
                    this.injectChooseCouche();
    
                }else{ //// default tiles type
                    document.querySelector(".title_right_side_jheo_js").innerText = "Sélectionner un type de carte.";
                    this.injectTilesType();
                }
        
                document.querySelector(".cart_map_jheo_js").style.width= cart_width;
                document.querySelector(".content_legende_jheo_js").style.width= cont_legent_width;
                document.querySelector(".content_legende_jheo_js").style.padding= '25px';
            }else{
                console.log("Selector not found")
                console.log("cart_map_jheo_js", "content_legende_jheo_js")
            }
        
        
            if(!this.isRightSideAlreadyOpen && document.querySelector('.close_right_side_jheo_js')){
                document.querySelector(".close_right_side_jheo_js").addEventListener("click", () => {
                    this.closeRightSide();
                })
            }
        }
    }

    openRightSideMobile(rightSideContentType){
        if(rightSideContentType === "reset_zoom_jheo_js" ){
            this.resetZoom()
        }else{
            if( document.querySelector(".close_details_jheo_js")){
                document.querySelector(".close_details_jheo_js").click();
            }

            if( document.querySelector('.icon_close_nav_left_jheo_js')){
                document.querySelector(".icon_close_nav_left_jheo_js").click();
            }

            const cart_width= '100%';
            const cont_legent_width= '200%';
            
            if(document.querySelector(".cart_map_jheo_js") && document.querySelector(".content_legende_jheo_js") ){

                if( !document.querySelector(".title_right_side_jheo_js")){
                    console.log("Selector not found: '.title_right_side_jheo_js'")
                    return false;
                }
        
                if( rightSideContentType === "info_golf_jheo_js"){
                        document.querySelector(".title_right_side_jheo_js").innerText = "Légende des icônes sur la carte.";
                        injectStatusGolf(); 
        
                    }else if( rightSideContentType === "resto_pastille_jheo_js" ){
                        document.querySelector(".title_right_side_jheo_js").innerText = "Liste des restaurants pastilles.";
                        this.injectListRestoPastille();
        
                    }else if( rightSideContentType === "info_resto_jheo_js" ){
                        document.querySelector(".title_right_side_jheo_js").innerText = "Légende des icônes sur la carte.";
                        injectStatusResto();
        
                    }else if( rightSideContentType === "info_ferme_jheo_js" ){
                        document.querySelector(".title_right_side_jheo_js").innerText = "Légende des icônes sur la carte.";
                        injectStatusFerme();
        
                    }else if( rightSideContentType === "info_station_jheo_js" ){
                        document.querySelector(".title_right_side_jheo_js").innerText = "Légende des icônes sur la carte.";
                        injectStatusStation();
        
                    }else if( rightSideContentType === "info_tabac_jheo_js" ){
                        document.querySelector(".title_right_side_jheo_js").innerText = "Légende des icônes sur la carte.";
                        injectStatusTabac();
        
                    }else if( rightSideContentType === "info_tous_jheo_js" ){
                        document.querySelector(".title_right_side_jheo_js").innerText = "Légende des icônes sur la carte.";
                        injectStatusTous();
        
                    }else if( rightSideContentType === "couche_tabac_jheo_js" ){
                        document.querySelector(".title_right_side_jheo_js").innerText = "Listes des contours géographiques.";
                        this.injectChooseCouche();
        
                    }else{ //// default tiles type
                        document.querySelector(".title_right_side_jheo_js").innerText = "Sélectionner un type de carte.";
                        this.injectTilesType();
                    }
        
                document.querySelector(".cart_map_jheo_js").style.width= cart_width;
                document.querySelector(".content_legende_jheo_js").style.width= cont_legent_width;
                document.querySelector(".content_legende_jheo_js").style.padding= '25px';
            }else{
                console.log("Selector not found")
                console.log("cart_map_jheo_js", "content_legende_jheo_js")
            }
        
        
            if(!this.isRightSideAlreadyOpen && document.querySelector('.close_right_side_jheo_js')){
                document.querySelector(".close_right_side_jheo_js").addEventListener("click", () => {
                    this.closeRightSide();
                })
            }

            
        }
    }

    closeRightSide(){
        if(document.querySelector(".cart_map_jheo_js") && document.querySelector(".content_legende_jheo_js") ){
            document.querySelector(".cart_map_jheo_js").style.width= '100%';
            document.querySelector(".content_legende_jheo_js").style.width= '0%';
            document.querySelector(".content_legende_jheo_js").style.padding= '0';
        }else{
            console.log("Selector not found")
            console.log("cart_map_jheo_js", "content_legende_jheo_js")
        }
    }

    injectTilesType(){
        if( !document.querySelector(".content_right_side_body_jheo_js")){
            console.log("Selector not found : '.content_right_side_body_body'")
            return false;
        }

        let tilesSelectHTML = "";
        
        this.listTales.forEach(item => {
            tilesSelectHTML +=  `
                <div class="form-check">
                    <span class="leaflet-minimap-label">
                        <input type="radio" id="${item.id}" class="leaflet-control-layers-selector ID_${item.id}" name="leaflet-base-layers" ${item.isCurrent ? 'checked' : '' }>
                        <label class="" for="${item.id}">${item.name.toUpperCase() }</label>
                    </span>
                </div>
            `
        })
        document.querySelector(".content_right_side_body_jheo_js").innerHTML= `
            <div class="right_side_body right_side_body_jheo_js">
                ${tilesSelectHTML}
            </div>
            <div class="d-none chargement_right_side chargement_right_side_jheo_js">
                <div class="containt">
                    <div class="word word-1">C</div>
                    <div class="word word-2">M</div>
                    <div class="word word-3">Z</div>
                </div>
            </div>
        `
        this.bindEventChangeTiles();
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
                    <input class="form-check-input check_tabac_commune_jheo_js" type="checkbox" value="" id="commune" disabled>
                    <label class="form-check-label non_active text-black" for="commune">
                        COMMUNE
                    </label>
                    <div class="content_select_commune_jheo_js">
                        <div class="select_region select_commune_jheo_js"></div>
                    </div>
                </div>
                <div class="form-check">
                    <input class="form-check-input check_tabac_iris_jheo_js" type="checkbox" value="" id="iris" disabled>
                    <label class="form-check-label non_active text-black" for="iris">
                        IRIS
                    </label>
                    <div class="content_select_iris_jheo_js">
                        <div class="select_region select_iris_jheo_js"></div>
                    </div>
                </div>
            </div>
            <div class="d-none chargement_right_side chargement_right_side_jheo_js">
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
                    showChargementRightSide()
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
                    shp(reader.result)
                        .then((geoJson) =>{
                            hideChargementRightSide() 
                            ///// couche Option, colors, properties
                            const coucheOption= this.contourOption.find(item => item.couche === COUCHE.toLowerCase());

                            this.objectGeoJson.push({ couche: COUCHE, data : geoJson.features, color : coucheOption.arrayColor , child : []})
                            if( COUCHE !== "quartier"){
                                generateSelectContoursGeographie(COUCHE, geoJson.features) //// function in data_tabac
                            }else{
                                this.updateGeoJson(COUCHE, -1 ) //// if -1 all seen, other single
                            }

                            console.log(this.objectGeoJson)
                        })
                        .catch(error => {
                            hideChargementRightSide()
                            console.log(error)
                        })
                };

                reader.readAsArrayBuffer(file)
            }else{
                hideChargementRightSide()
                //// generate
                if( COUCHE !== "quartier"){
                    generateSelectContoursGeographie(COUCHE, currentCouche.data , currentCouche.child) //// function in data_tabac
                }else{
                    this.updateGeoJson(COUCHE, -1 ) //// if -1 all seen, other single
                }
            }
        }catch(e){
            hideChargementRightSide()
            console.log(e.message)
        }

    }

    updateGeoJson(couche,indexInJson){
        // this.geoJSONLayer.clearLayers();
        console.log(this.objectGeoJson)
        const data_spec = this.objectGeoJson.find(item => item.couche.toLowerCase() === couche);
        const styles={
            color: data_spec.color[0],
            // fillColor: data_spec.color[1],
            fillOpacity: 0,
            weight: 1,
        }

        const data = indexInJson === -1 ? data_spec.data : data_spec.data[parseInt(indexInJson)];
        const geoJson = L.geoJson( data, {
            style: styles,
            onEachFeature : (feature, layer)  => {
                const lng= (feature.geometry.bbox[0] + feature.geometry.bbox[2]) / 2 ;
                const lat= (feature.geometry.bbox[1] + feature.geometry.bbox[3]) / 2 ;
                
                if(couche !== "quartier"){
                    this.updateCenter(lat, lng, 8);
                    this.updateDataInSessionStorage(lat, lng, 8);
                }

                const coucheOption= this.contourOption.find(item => item.couche === couche.toLowerCase());

                let description = "";
                coucheOption.properties.forEach(propertie => {
                    const desc = feature.properties[propertie].split(" ").map(item => item.charAt(0).toUpperCase() + item.slice(1).toLowerCase()).join(" ")
                    description += propertie.toUpperCase() + " : " + desc + " </br>";
                })

                layer.bindPopup(description);

                layer.on('mouseover', function (e) {
                    this.openPopup();
                });
                
                layer.on('mouseout', function (e) {
                    this.closePopup();
                });
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

    bindEventChangeTiles(){
        this.listTales.forEach(item => {
            document.querySelector(`.ID_${item.id}`).addEventListener('change', () => {
                this.changeTiles(item.id)
            })
        })
    }

    changeTiles(tilesID){
        const newTiles= this.listTales.find(item => item.id === tilesID);
        this.tiles.setUrl(newTiles.link, false)

        this.listTales= this.listTales.map(item => {
            item.isCurrent = item.id === tilesID ? true : false
            return item
        });
    }

    /**
     * @Author Nantenaina
     * où: On utilise cette fonction dans la rubrique restaurant, restaurant specifique dép, arrondissement et tous de la carte cmz, 
     * localisation du fichier: dans MapModule.js,
     * je veux: faire apparaitre la note en haut à gauche du poi resto
     * si une POI a une note, la note se montre en haut à gauche du POI 
     */
    setSpecialMarkerToShowNote(latLng,item,isSelected=false, poi_icon, poi_icon_Selected, taille){
        // isSelected ? setIconn(poi_icon_Selected,"" , isPastille) : setIconn(poi_icon, "", isPastille)
        // const iconUrlNanta="/assets/icon/NewIcons/icon-resto-new-B.png"; ///on dev
        // const taille=0
        let noteMoyenne = item.moyenne_note ? parseFloat(item.moyenne_note).toFixed(2) : 0
        let [w,h]=(taille === 0 ) ?  [30,45] : ( taille === 1) ? [35, 55] : [45, 60];
        return new L.Marker(latLng, {
            icon: new L.DivIcon({
                className: 'my-div-icon',
                html: ` 
                        <span class="my-div-span" style="padding:2px;position:absolute;top:-5px;left:-10px;
                        background-color:${noteMoyenne < 2 ? "red" : (noteMoyenne == 2 ? "orange" : "green")};color:white;
                        border-radius: 50%;">${noteMoyenne}</span>
                      <img class="my-div-image" style="width:${w}px ; height:${h}px" src="/public/${isSelected ? poi_icon_Selected : poi_icon}"/>
                       `,
                //iconSize:(taille === 0 ) ?  [30,45] : ( taille === 1) ? [35, 55] : [45, 60],
                iconAnchor: [11, 30],
                popupAnchor: [0, -20],
                shadowSize: [68, 95],
                shadowAnchor: [22, 94],
            }),
            cleNom:item.denominationF,
            id:item.id,
            type:"resto"
        });
    }

    /**
     * @Author Nantenaina
     * où: On utilise cette fonction dans la rubrique restaurant, restaurant specifique dép, arrondissement et tous de la carte cmz, 
     * localisation du fichier: dans MapModule.js,
     * je veux: modifier l'icone du poi resto
     * si une POI a une note, la note se montre en haut à gauche du POI 
     */
    setSpecialIcon(item, isSelected=false, poi_icon, poi_icon_Selected, taille){
        let noteMoyenne = item.moyenne_note ? parseFloat(item.moyenne_note).toFixed(2) : 0
        let [w,h]=(taille === 0 ) ?  [30,45] : ( taille === 1) ? [35, 55] : [45, 60];
        return new L.DivIcon({
            className: 'my-div-icon',
            html: noteMoyenne > 0 ? ` 
                    <span class="my-div-span" style="padding:2px;position:absolute;top:-5px;left:-10px;
                    background-color:${noteMoyenne < 2 ? "red" : (noteMoyenne == 2 ? "orange" : "green")};color:white;
                    border-radius: 50%;">${noteMoyenne}</span>
                  <img class="my-div-image" style="width:${w}px ; height:${h}px" src="/public/${isSelected ? poi_icon_Selected : poi_icon}"/>
                   `:`<img class="my-div-image" style="width:${w}px ; height:${h}px" src="/public/${isSelected ? poi_icon_Selected : poi_icon}"/>
                   `,
            //iconSize:(taille === 0 ) ?  [30,45] : ( taille === 1) ? [35, 55] : [45, 60],
            iconAnchor: [11, 30],
            popupAnchor: [0, -20],
            shadowSize: [68, 95],
            shadowAnchor: [22, 94],
        })
    }
}