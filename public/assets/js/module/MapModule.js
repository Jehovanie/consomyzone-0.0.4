/// dependecies: 
///         - franceGeometry ( franceGeoJson.js )
///         - API openstreetmap

class MapModule{

    constructor(idDep= null,nomDep, map_for_type="tous"){
        this.currentUrl= new URL(window.location.href);

        ////default values but these distroy when we get the user position
        this.latitude= 46.61171462536897;
        this.longitude= 1.8896484375000002;

        this.defaultZoom= 6;
        this.zoomDetails= 15;
        this.geos= [];

        this.mapForType=map_for_type;
        this.id_dep= idDep ? parseInt(idDep) : null;
        this.nom_dep= nomDep ? nomDep : null;
        this.map= null;
    }

    initTales(){
        const tiles = L.tileLayer('//{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
            attribution: 'donn&eacute;es &copy; <a href="//osm.org/copyright">OpenStreetMap</a>/ODbL - rendu <a href="//openstreetmap.fr">OSM France</a>',
            minZoom: 1,
            maxZoom: 20
        })
        return tiles;
    }


    getUserLocation(){
        if( !localStorage.getItem("userLocate")){
            localStorage.setItem("userLocate", false)
            if( confirm("Souhaitez-vous que nous utiliser votre position ?") ){
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

    async createMap(){
        let position = null, coords= null;

        try{
            position = await this.getUserLocation();
            coords = position.coords;
            this.latitude = coords.latitude;
            this.longitude= coords.longitude;
    
        }catch(err){
            console.log(err.message)
        }finally{
            const memoryCenter= localStorage.getItem("memoryCenter") ? JSON.parse(localStorage.getItem("memoryCenter")) : null;
            const tiles= this.initTales();

            this.settingLatLong();
            
            this.map = L.map('map', {
                    zoomControl: false,
                    // center: memoryCenter ? L.latLng(memoryCenter.coord.lat,memoryCenter.coord.lng) :  L.latLng(this.latitude, this.longitude),
                    center:this.id_dep ? L.latLng(this.latitude, this.longitude) : (memoryCenter ? L.latLng(memoryCenter.coord.lat,memoryCenter.coord.lng) :  L.latLng(this.latitude, this.longitude)),
                    zoom:this.id_dep ? this.defaultZoom : ( memoryCenter ? memoryCenter.zoom : this.defaultZoom ),
                    layers: [tiles] 
                }
            );
            L.control.zoom({
                position: 'bottomright'
            }).addTo(this.map);
        }

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

        L.geoJson(geos, {
            style: {
                weight: 2,
                opacity: 1,
                color: (this.id_dep) ? "red" : "#63A3F6",
                dashArray: '3',
                fillOpacity: 0
            },
            onEachFeature: function (feature, layer) {
                layer.bindTooltip(feature.properties.nom);
            }
        }).addTo(this.map);
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
            setDataInLocalStorage("memoryCenter", JSON.stringify(coordAndZoom))
        })
    }

    updateCenter(lat, long, zoom){
        console.log("lat: " , lat)
        console.log("long: " , long)
        console.log("zoom: ", zoom)
        
        this.map.setView(L.latLng(lat, long), zoom, { animation: true });
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
                var el = L.DomUtil.create('button', 'leaflet-bar my-control');
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
                    <div class="card-options-home hide" id="card">
                    <div class="options-container">
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
                                <li class="station" id="mobile_station_js_jheo">
                                    <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
                                    width="50px" height="50px" viewBox="0 0 128.000000 128.000000"
                                    preserveAspectRatio="xMidYMid meet">
                                        <g transform="translate(0.000000,128.000000) scale(0.100000,-0.100000)"
                                        fill="#fff" stroke="none">
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
                                <li class="recherche" onclick="showModalSearch()">
                                    <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
                                    width="50" height="50" viewBox="0 0 128.000000 128.000000"
                                    preserveAspectRatio="xMidYMid meet">

                                        <g transform="translate(0.000000,128.000000) scale(0.100000,-0.100000)"
                                        fill="#fff" stroke="none">
                                            <path d="M403 985 c-80 -39 -119 -81 -158 -169 -30 -69 -32 -127 -5 -200 59
                                            -155 226 -238 377 -187 34 12 74 21 88 21 35 0 85 50 85 85 0 14 9 54 21 88
                                            51 151 -32 318 -187 377 -81 30 -136 26 -221 -15z m226 -31 c124 -52 189 -196
                                            146 -325 -37 -111 -155 -188 -271 -176 -220 23 -318 283 -166 440 79 82 186
                                            105 291 61z"/>
                                            <path d="M789 451 l-35 -36 89 -97 c87 -95 91 -98 133 -98 l44 0 0 44 c0 42
                                            -3 46 -97 133 l-98 89 -36 -35z"/>
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
                    <svg class="close" id="close" version="1.0" xmlns="http://www.w3.org/2000/svg"
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
    }

    async initMap(){
        
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


        await this.createMap();
        this.eventSetPositionOnMap();

        this.addGeoJsonToMap();
        this.settingMemoryCenter();
        // this.bindControlOnLeaflet(this.map);
        // this.bindEventLocationForMobile();
    }
    
    getMax(max,min){
        if(Math.abs(max)<Math.abs(min))
            return {max:min,min:max} 
        else
           return {max:max,min:min}
    }
}