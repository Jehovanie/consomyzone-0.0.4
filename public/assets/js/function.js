let firstX = 0
let firstY = 0
let marker_last_selected = null
/*

*/

function splitArrayToMultipleArray(tabToSplit) {
    const taille = 1000;
    let tab_results = [];
    let start_index = 0;
    let end_index = taille;
    const nbrTabResults = Math.ceil(tabToSplit.length / 1000);
    for (let i = 0; i < nbrTabResults; i++) {
        tab_results.push(tabToSplit.slice(start_index, end_index));
        start_index = end_index + 1;
        end_index += taille + 1;
        end_index = end_index > tabToSplit.length ? tabToSplit.length : end_index;
    }
    return tab_results;
}


async function create_map_content(geos, id_dep = null, map_for_type = "home") {
    // {# <div id="map"  style="width: 100%;"></div> #}
   
    try {

        const response = await fetch("https://api.bigdatacloud.net/data/reverse-geocode-client")
        const results = await response.json();
        const { latitude, longitude } = results;

        var tiles = L.tileLayer('//{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
            attribution: 'donn&eacute;es &copy; <a href="//osm.org/copyright">OpenStreetMap</a>/ODbL - rendu <a href="//openstreetmap.fr">OSM France</a>',
            minZoom: 1,
            maxZoom: 20
        })

        // var mbAttr = 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
        // '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        // 'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        // mbUrl = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1Ijoicmlwc3R5eCIsImEiOiJja2RvbDJncGQwMGV0MnFtc2ZnaTZpZzdxIn0.-hP88dgkMtKClw2X77nD0Q';
        // var tiles = L.tileLayer('https://a.tile.openstreetmap.fr/osmfr/${z}/${x}/${y}.png', {
        //     maxZoom: 20,
        //     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Points &copy 2012 LINZ'
        // })

        //var tilesSatelite= L.tileLayer(mbUrl, {id: 'mapbox/satellite-v9', tileSize: 512, zoomOffset: -1, attribution: mbAttr})
        // var baseLayers = {
        //     'tiles':tiles,
        //     'tilesSatelite':tilesSatelite
        // }


        // var latlng = L.latLng(45.729191061299936, 2.4161955097725722);
        let latlng = null, json = null, zoom = null, centered = null;

        if (map_for_type === "station") {

            latlng = id_dep ? L.latLng(centers[parseInt(id_dep)].lat, centers[parseInt(id_dep)].lng) : L.latLng(45.729191061299936, 2.4161955097725722);;
            json = getDataInLocalStorage("coordStation") ? JSON.parse(getDataInLocalStorage("coordStation")) : null;
            zoom = id_dep ? centers[parseInt(id_dep)].zoom : ( json ? json.zoom : 6);
            
        } else if (map_for_type === "home") {
            latlng= L.latLng(48.856470515304515, 2.35882043838501); ///centre Paris 
            // latlng = L.latLng(latitude, longitude);
            zoom = 12;
        } else if (map_for_type === "ferme") {

            latlng =id_dep ? L.latLng(centers[parseInt(id_dep)].lat, centers[parseInt(id_dep)].lng) : L.latLng(45.729191061299936, 2.4161955097725722);
            json = getDataInLocalStorage("coordFerme") ? JSON.parse(getDataInLocalStorage("coordFerme")) : null;
            zoom = id_dep ? centers[parseInt(id_dep)].zoom : ( json ? json.zoom : 6);
            
        } else if (map_for_type === "resto") {

            latlng =id_dep ? L.latLng(centers[parseInt(id_dep)].lat, centers[parseInt(id_dep)].lng) : L.latLng(45.729191061299936, 2.4161955097725722);;
            json = getDataInLocalStorage("coordResto") ? JSON.parse(getDataInLocalStorage("coordResto")) : null;
            zoom = id_dep ? centers[parseInt(id_dep)].zoom : ( json.zoom ? json.zoom : 6);
        }

        centered = id_dep ? latlng : ( json ? L.latLng(json.coord.lat, json.coord.lng) : latlng)

        var container = L.DomUtil.get('map');
        if (container != null) {
            container._leaflet_id = null;
        }


        const content_map= document.querySelector(".cart_map_js");
        if( !document.querySelector("#map")){
            const map= document.createElement("div");
            map.setAttribute("id", "map");
            map.setAttribute("class", "map");

            content_map.appendChild(map);
        }

        if( document.querySelector("#toggle_chargement")){
            content_map.removeChild(document.querySelector("#toggle_chargement"))
        }
        var map = L.map('map', { center: centered, zoom: zoom, layers: [tiles] });

        // layerControl = L.control.layers(null, overlayPane, {position: 'topleft'});
        // layerControl.addTo(map);
        //L.control.layers(null,baseLayers,{position: 'bottomright'}).addTo(map);

        L.geoJson(geos, {
            style: {
                weight: 2,
                opacity: 1,
                color: (id_dep) ? "red" : "#63A3F6",
                dashArray: '3',
                fillOpacity: 0
            },
            onEachFeature: function (feature, layer) {
                layer.bindTooltip(feature.properties.nom);
            }
        }).addTo(map);

        map.doubleClickZoom.disable();

        console.log("map create")

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

        // addListFermeMobile()
        addEventLocation()

        return map;

    } catch (e) {
        console.log(e)
    }
}

function create_map_content_not_async(geos, id_dep = null, map_for_type = "home") {
    // {# <div id="map"  style="width: 100%;"></div> #}

    var tiles = L.tileLayer('//{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
        attribution: 'donn&eacute;es &copy; <a href="//osm.org/copyright">OpenStreetMap</a>/ODbL - rendu <a href="//openstreetmap.fr">OSM France</a>',
        minZoom: 1,
        maxZoom: 20
    })

    // var latlng = L.latLng(45.729191061299936, 2.4161955097725722);
    let latlng = null, json = null, zoom = null, centered = null;

    if (map_for_type === "station") {

        latlng = id_dep ? L.latLng(centers[parseInt(id_dep)].lat, centers[parseInt(id_dep)].lng) : L.latLng(45.729191061299936, 2.4161955097725722);
        json = getDataInLocalStorage("coordStation") ? JSON.parse(getDataInLocalStorage("coordStation")) : null
        zoom = json ? (json.zoom ? json.zoom : (id_dep ? centers[parseInt(id_dep)].zoom : 6)) : (id_dep ? centers[parseInt(id_dep)].zoom : 6);
    } else if (map_for_type === "home") {

        latlng = id_dep ? L.latLng(centers[parseInt(id_dep)].lat, centers[parseInt(id_dep)].lng) : L.latLng(46.227638, 2.213749);
        json = getDataInLocalStorage("coordTous") ? JSON.parse(getDataInLocalStorage("coordTous")) : latlng
        zoom = json ? (json.zoom ? json.zoom : (id_dep ? centers[parseInt(id_dep)].zoom : 6)) : (id_dep ? centers[parseInt(id_dep)].zoom : 6);
    } else if (map_for_type === "ferme") {

        latlng = L.latLng(45.55401555223028, 3.9946391799233365);
        json = getDataInLocalStorage("coordFerme") ? JSON.parse(getDataInLocalStorage("coordFerme")) : latlng
        zoom = json.zoom ? json.zoom : 5;
    } else if (map_for_type === "resto") {

        latlng =id_dep ? L.latLng(centers[parseInt(id_dep)].lat, centers[parseInt(id_dep)].lng) : L.latLng(/*45.729191061299936, 2.4161955097725722*/48.86214210975093, 2.341021299362183);
        json = getDataInLocalStorage("coordResto") ? JSON.parse(getDataInLocalStorage("coordResto")) : null;
        zoom = id_dep ? centers[parseInt(id_dep)].zoom : ( json ? json.zoom : 17);
    }

    centered = json ? L.latLng(json.coord.lat, json.coord.lng) : latlng;

    var container = L.DomUtil.get('map');
    if (container != null) {
        container._leaflet_id = null;
    }

    var map = L.map('map', { center: centered, zoom: zoom, layers: [tiles] });
    L.geoJson(geos, {
        style: {
            weight: 2,
            opacity: 1,
            color: (id_dep) ? "red" : "#63A3F6",
            dashArray: '3',
            fillOpacity: 0
        },
        onEachFeature: function (feature, layer) {
            layer.bindTooltip(feature.properties.nom);
        }
    }).addTo(map);

    map.doubleClickZoom.disable();

    console.log("map create")

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

    // addListFermeMobile()
    addEventLocation()

    return map;
}

function addEventLocation() {
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

function addListFermeMobile() {
    document.querySelector("#mobil-ferme").addEventListener('click', (event) => {
        document.querySelector("#map > div.leaflet-control-container").innerHTML =
            `
            <div class="content-mobil-ferme">
                <svg class="close" id="close" version="1.0" xmlns="http://www.w3.org/2000/svg"
                width="10px" height="10px" viewBox="0 0 980.000000 982.000000"
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
                <div>
                    <p>
                        <svg version="1.0" xmlns="http://www.w3.org/2000/svg" 
                        width="6vw" height="6vh" viewbox="0 0 128.000000 128.000000" 
                        preserveaspectratio="xMidYMid meet">

                            <g transform="translate(0.000000,128.000000) scale(0.100000,-0.100000)" 
                                fill="#1111FE" stroke="none">
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
                        Ferme dans tous les departements francais.
                    </p>
                    <div>
                        
                    </div>
                </div>
            </div>
        `
        document.querySelector("#close").addEventListener('click', () => {
            document.querySelector("#map > div.leaflet-control-container > div.content-mobil-ferme").style.transform = "translateX(-100vw)"
        })
    })
}

function addControlPlaceholders(map) {
    const corners = map._controlCorners
    const l = 'leaflet-'
    const container = map._controlContainer;

    function createCorner(vSide, hSide) {
        var className = l + vSide + ' ' + l + hSide;

        corners[vSide] = L.DomUtil.create('div', className, container);
    }

    createCorner('verticalcenterl', 'left swipe-me-reverse');
    createCorner('verticalcenter', 'right');
    createCorner('horizontalmiddle', 'center');

}

///jheo: dynamique icon for map leaflet. ---------
function setIconn(urlIcon) {
    const url = new URL(window.location.href);
    var myIcon = L.icon({
        // iconUrl: url.origin+"/public/"+urlIcon,  ///only prod
        iconUrl: IS_DEV_MODE ? url.origin + "/" + urlIcon : url.origin + "/public/" + urlIcon, ///on dev
        iconSize: [32, 50],
        iconAnchor: [11, 30],
        popupAnchor: [0, -20],
        //shadowUrl: 'my-icon-shadow.png',
        shadowSize: [68, 95],
        shadowAnchor: [22, 94]
    });
    return myIcon;
}

/**
 * @author Tommy
 * @param {*} nom_dep 
 * @param {*} id_dep 
 */
function addRestaurantToMap(nom_dep, code_dep) {
    
    ///border departments
    const geos = [];
    document.querySelectorAll(".element_js_jheo").forEach(item => {
        const dep = item.dataset.toggleDepartId
        geos.push(franceGeo.features.find(element => element.properties.code == dep))
    })

    let url_string = window.location.href;
    let url_param = new URL(url_string);
    let id_resto_url = url_param.searchParams.get("id");
    
    
    const API_URL = "/Coord/All/Restaurant";
    if (id_resto_url) {

        fetch(API_URL)
            .then(response => response.json())
            .then(response1 => {

                // if( document.getElementById("content_nombre_result_js_jheo")){
                //         document.getElementById("content_nombre_result_js_jheo").innerText = response1.length;
                // }

                var map = create_map_content_not_async(geos, code_dep, "resto");

                var markers = L.markerClusterGroup({
                    chunkedLoading: true
                });

                let lat_selected, lng_selected;
                response1.forEach(item => {
                    //console.log("item" , item)
                    const departementName = item.depName

                    // @Route("ferme/departement/{nom_dep}/{id_dep}/details/{id_ferme}" , name="detail_ferme" , methods="GET" )
                    // var pathDetails ="/restaurant/departement/"+ departementName + "/" + item.dep +"/details/" + item.id;
                    const adresseRestaurant = `${item.numvoie} ${item.typevoie} ${item.nomvoie} ${item.codpost} ${item.villenorm}`
                    const adress = "<br><span class='fw-bolder'> Adresse:</span> <br>" + adresseRestaurant;
                    // const link = "<br><a href='"+ pathDetails + "'> VOIR DETAILS </a>";

                    var title = "<span class='fw-bolder'> Restaurant:</span>  " + item.denominationF + ".<span class='fw-bolder'><br> Departement:</span>  " + departementName + "." + adress;

                    var marker;

                    if (item.id != id_resto_url) {
                        marker = L.marker(L.latLng(parseFloat(item.poiY), parseFloat(item.poiX)), { icon: setIconn('assets/icon/icon-resto-bleu.png') });
                    } else {
                        marker = L.marker(L.latLng(parseFloat(item.poiY), parseFloat(item.poiX)), { icon: setIconn('assets/icon/icon-restoR.png') });
                        lat_selected = parseFloat(item.poiY)
                        lng_selected = parseFloat(item.poiX)
                    }

                    marker.bindTooltip(
                        title, 
                        {
                            direction: "top",
                            offset: L.point(0, -30) 
                        }).openTooltip();

                    marker.on('click', (e) => {

                        let screemMax = window.matchMedia("(max-width: 1000px)")
                        let screemMin = window.matchMedia("(min-width: 1000px)")
                        
                        if (screemMax.matches) {

                            const pathDetails = `/restaurant-mobile/departement/${departementName}/${item.dep}/details/${item.id}`;
                            location.assign(pathDetails)
                        } else if (screemMin.matches) {

                            let remove = document.getElementById("remove-detail")
                            remove.removeAttribute("class", "hidden");
                            remove.setAttribute("class", "navleft-detail fixed-top")
                            
                            const myHeaders = new Headers();
                            myHeaders.append('Content-Type', 'text/plain; charset=UTF-8');
                            fetch(`/restaurant/departement/${departementName}/${item.dep}/details/${item.id}`, myHeaders)
                                .then(response => response.text())
                                .then(r => {
                                    document.querySelector("#content-details").innerHTML = null
                                    document.querySelector("#content-details").innerHTML = r

                                    document.querySelector("#close-detail-tous-resto").addEventListener("click", () => {
                                        document.querySelector("#content-details").style.display = "none"
                                    })
                                    document.querySelector("#content-details").removeAttribute("style")

                                })

                        }

                    })
                    markers.addLayer(marker);
                })

                map.addLayer(markers);

                map.setView([lat_selected, lng_selected], 18);

                map.on("resize zoomend dragend", (e) => {
                    console.log(e)
                    const coordAndZoom = {
                        zoom: e.target._zoom,
                        coord: e.target.getCenter()
                    }
                    setDataInLocalStorage("coord", JSON.stringify(coordAndZoom))
                })

                if (nom_dep && code_dep) {
                    /// mise a jour de liste
                    const parent_elements = document.querySelector(".list_result")
                    const elements = document.querySelectorAll(".element")
                    elements.forEach(element => {
                        element.parentElement.removeChild(element);
                    })

                    if (document.querySelector(".plus_result")) {
                        parent_elements.removeChild(document.querySelector(".plus_result"))
                    }

                    parsedResult.forEach(new_element => {

                        // <div class="element" id="{{station.id}}">
                        const div_new_element = document.createElement("div");
                        div_new_element.setAttribute("class", "element")
                        div_new_element.setAttribute("id", new_element.id);

                        // <p> <span class="id_departement">{{station.nom }} </span> {{station.adresse}}</p>
                        const s_p = document.createElement("p");
                        s_p.innerHTML = "<span class='id_departement'>" + new_element.nomFerme + " </span>" + new_element.adresseFerme

                        // <a class="plus" href="{{path('station_details', {'depart_code':departCode, 'depart_name':departName,'id':station.id }) }}">
                        const a = document.createElement("a");
                        a.setAttribute("class", "plus")
                        a.setAttribute("href", "/ferme/departement/" + nom_dep + "/" + id_dep + "/details/" + new_element.id)
                        a.innerText = "Voir details";

                        /// integre dom under the element
                        div_new_element.appendChild(s_p);
                        div_new_element.appendChild(a);

                        ///integre new element in each element.
                        parent_elements.appendChild(div_new_element);
                    })

                }
            })
    } else {
        fetch(API_URL)
            .then(response =>  response.json())
            .then(response1 => {

                deleteChargement();

                createMap();

                var map = create_map_content_not_async(geos, code_dep, "resto");
                
                // map.doubleClickZoom.disable();
                var markers = L.markerClusterGroup({
                    chunkedLoading: true,
                    removeOutsideVisibleBounds: true,
                    iconCreateFunction: function (cluster) {
                        if(marker_last_selected){
                            let sepcMarmerIsExist = false;
                            for (let g of  cluster.getAllChildMarkers()){
                                if (parseInt(marker_last_selected.options.id) === parseInt(g.options.id)) { 
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

                response1.forEach(item => {
                    // @Route("ferme/departement/{nom_dep}/{id_dep}/details/{id_ferme}" , name="detail_ferme" , methods="GET" )
                    // var pathDetails ="/restaurant/departement/"+ departementName + "/" + item.dep +"/details/" + item.id;

                    const departementName = item.depName
                    const adresseRestaurant = `${item.numvoie} ${item.typevoie} ${item.nomvoie} ${item.codpost} ${item.villenorm}`

                    const adress = "<br><span class='fw-bolder'> Adresse:</span> <br>" + adresseRestaurant;
                    const title = "<span class='fw-bolder'> Restaurant:</span>  " + item.denominationF + ".<span class='fw-bolder'><br> Departement:</span>  " + departementName + "." + adress;

                    let marker = L.marker(
                        L.latLng(parseFloat(item.poiY), parseFloat(item.poiX)),
                        { 
                            icon: setIconn('assets/icon/NewIcons/icon-resto-new-B.png'),
                           
                            cleNom: item.denominationF,
                            id: item.id

                        }
                    );

                    marker.bindTooltip(title, {
                        direction: "top",
                        offset: L.point(0, -30) 
                    }).openTooltip();

                    var currentZoom=18;
                    map.on('resize zoom',e=>{
                        currentZoom=map.getZoom()
                    })
                    marker.on('click', (e) => {
                        const latlng = L.latLng(marker._latlng.lat, marker._latlng.lng);
                        
                        map.setView(latlng, currentZoom);

                        const url = new URL(window.location.href);
                        const icon_R = L.Icon.extend({
                            options: {
                                iconUrl: IS_DEV_MODE ? url.origin + "/assets/icon/NewIcons/icon-resto-new-Rr.png" : url.origin + "/public/assets/icon/NewIcons/icon-resto-new-Rr.png",
                                iconSize:[32,52]
                            }
                        })
                        marker.setIcon(new icon_R);

                        if (marker_last_selected) {
                            const icon_B = L.Icon.extend({
                                options: {
                                    iconUrl: IS_DEV_MODE ? url.origin + "/assets/icon/NewIcons/icon-resto-new-B.png" :  url.origin + "/public/assets/icon/NewIcons/icon-resto-new-B.png",
                                    iconSize:[32,52]
                                }
                            })
                            marker_last_selected.setIcon(new icon_B)
                        }

                        marker_last_selected = marker

                        let screemMax = window.matchMedia("(max-width: 1000px)")
                        let screemMin = window.matchMedia("(min-width: 1000px)")
                        
                        if (screemMax.matches) {

                            const pathDetails = `/restaurant-mobile/departement/${departementName}/${item.dep}/details/${item.id}`;
                            location.assign(pathDetails)
                        } else if (screemMin.matches) {

                            let remove = document.getElementById("remove-detail")
                            remove.removeAttribute("class", "hidden");
                            remove.setAttribute("class", "navleft-detail fixed-top")

                            var myHeaders = new Headers();
                            myHeaders.append('Content-Type', 'text/plain; charset=UTF-8');

                            fetch(`/restaurant/departement/${departementName}/${item.dep}/details/${item.id}`, myHeaders)
                                .then(response => response.text())
                                .then(r => {
                                    document.querySelector("#content-details").innerHTML = null
                                    document.querySelector("#content-details").innerHTML = r

                                    document.querySelector("#close-detail-tous-resto").addEventListener("click", () => {
                                        document.querySelector("#content-details").style.display = "none"
                                    })
                                    document.querySelector("#content-details").removeAttribute("style")

                                })
                        }

                        markers.refreshClusters();
                    })

                    markers.addLayer(marker);
                })

                map.addLayer(markers);

                map.on("resize zoomend dragend", (e) => {
                    const coordAndZoom = {
                        zoom: e.target._zoom,
                        coord: e.target.getCenter()
                    }
                    setDataInLocalStorage("coord", JSON.stringify(coordAndZoom))
                })
            
                /// mise a jour de liste on left
                if (nom_dep && code_dep) {
                    const parent_elements = document.querySelector(".list_result")
                    const elements = document.querySelectorAll(".element")
                    elements.forEach(element => {
                        element.parentElement.removeChild(element);
                    })

                    if (document.querySelector(".plus_result")) {
                        parent_elements.removeChild(document.querySelector(".plus_result"))
                    }

                    parsedResult.forEach(new_element => {

                        // <div class="element" id="{{station.id}}">
                        const div_new_element = document.createElement("div");
                        div_new_element.setAttribute("class", "element")
                        div_new_element.setAttribute("id", new_element.id);

                        // <p> <span class="id_departement">{{station.nom }} </span> {{station.adresse}}</p>
                        const s_p = document.createElement("p");
                        s_p.innerHTML = "<span class='id_departement'>" + new_element.nomFerme + " </span>" + new_element.adresseFerme

                        // <a class="plus" href="{{path('station_details', {'depart_code':departCode, 'depart_name':departName,'id':station.id }) }}">
                        const a = document.createElement("a");
                        a.setAttribute("class", "plus")
                        a.setAttribute("href", "/ferme/departement/" + nom_dep + "/" + id_dep + "/details/" + new_element.id)
                        a.innerText = "Voir details";

                        /// integre dom under the element
                        div_new_element.appendChild(s_p);
                        div_new_element.appendChild(a);

                        ///integre new element in each element.
                        parent_elements.appendChild(div_new_element);
                    })

                }
            })
    }

    addListDepartRest()
}

function addControlPlaceholdersStation(map) {
    const corners = map._controlCorners
    const l = 'leaflet-'
    const container = map._controlContainer;

    function createCorner(vSide, hSide) {
        var className = l + vSide + ' ' + l + hSide;

        corners[vSide] = L.DomUtil.create('div', className, container);
    }

    createCorner('verticalcenterl', 'left swipe-me-reverse');
    createCorner('verticalcenter', 'right');
    createCorner('horizontalmiddle', 'center');
}

function addControlPlaceholdersresto(map) {
    const corners = map._controlCorners
    const l = 'leaflet-'
    const container = map._controlContainer;

    function createCorner(vSide, hSide) {
        var className = l + vSide + ' ' + l + hSide;

        corners[vSide] = L.DomUtil.create('div', className, container);
    }

    createCorner('verticalcenterl', 'left swipe-me-reverse');
    createCorner('verticalcenter', 'right');
    createCorner('horizontalmiddle', 'center');
}


function showModalSearch() {
    // alert("Please Show Modal Search...");
    document.querySelector(".show_modal_search_for_mobile_js_jheo")?.click();
}

/// THIS FUNCTION USE ONLY TO SET THE MINIFICHE FOR STATION ON HOVER ///
function setMiniFicheForStation(nom, adresse, prixE85, prixGplc, prixSp95, prixSp95E10, prixGasoil, prixSp98) {
    const station = "<span class='fw-bolder'>STATION: </span> <br>" + nom + ".";
    const ad = "<br><span class='fw-bolder'>ADRESSE:</span> <br>" + adresse + ".";
    const carburants = "<br><span class='fw-bolder'>CARBURANTS:</span>"
        + "<ul>"
        + "<li><span class='fw-bold'>SP 95:</span> " + prixSp95 + "€ </li>"
        + "<li><span class='fw-bold'>SP 95 E 10:</span> " + prixSp95E10 + "€ </li>"
        + "<li><span class='fw-bold'>SP 98:</span> " + prixSp98 + "€ </li>"
        + "<li><span class='fw-bold'>Gasoil:</span> " + prixGasoil + "€ </li>"
        + "<li><span class='fw-bold'>E 85:</span> " + prixE85 + "€ </li>"
        + "<li><span class='fw-bold'>GPLC:</span> " + prixGplc + "€ </li>"
        + "</ul>";
    return station + ad + carburants;
}

function setDefaultMiniFicherForStation(prixE85, prixGplc, prixSp95, prixSp95E10, prixGasoil, prixSp98) {
    const gazole = parseFloat(prixGasoil) !== 0 ? `Gazole:${prixGasoil}€,` : ``;
    const e_85 = parseFloat(prixE85) !== 0 ? `E85:${prixGasoil}€,` : ``;
    const sp_95 = parseFloat(prixSp95) !== 0 ? `Sp95:${prixSp95}€,` : ``;
    const sp_95_10 = parseFloat(prixSp95E10) !== 0 ? `Sp9510:${prixSp95E10}€,` : ``;
    const sp_98 = parseFloat(prixSp98) !== 0 ? `Sp98${prixSp98}€,` : ``;
    const gplc = parseFloat(prixGplc) !== 0 ? `GPLC:${prixGplc}€,` : ``;

    const default_mini_fiche = `<div class="default_mini_ficher">${gazole}${e_85}${sp_95}${sp_95_10}${sp_98}${gplc}</div>`

    return default_mini_fiche.length > 45 ? `<div class="default_mini_ficher">${gazole}${e_85}${sp_95}<br/>${sp_95_10}${sp_98}${gplc}</div>` : default_mini_fiche
}


function getDetailHomeForMobile(link) {

    if (document.querySelector(".show_detail_for_mobile_js_jheo")) {
        document.querySelector(".show_detail_for_mobile_js_jheo").click();
    }

    fetchDetailsVialink(".content_detail_home_js_jheo", link)
}

function fetchDetailsVialink(selector, link) {

    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'text/plain; charset=UTF-8');

    fetch(link)
        .then(response => {
            return response.text()
        }).then(r => {
            document.querySelector(selector).innerHTML = null
            document.querySelector(selector).innerHTML = r
        })

}

function getDetailStation(depart_name, depart_code, id, inHome = false) {
    // console.log(depart_name, depart_code, id)

    let remove = !inHome ? document.getElementById("remove-detail-station") : document.getElementById("remove-detail-home")
    remove.removeAttribute("class", "hidden");
    remove.setAttribute("class", "navleft-detail fixed-top")

    const id_selector = !inHome ? "#content-details-station" : "#content-details-home";
    fetchDetails(id_selector, depart_name, depart_code, id)
}

function getDetailStationForMobile(depart_name, depart_code, id) {
    // console.log(depart_name, depart_code, id)
    if (document.querySelector(".btn_retours_specifique_jheo_js")) {
        document.querySelector(".btn_retours_specifique_jheo_js").click();
    }

    if (document.querySelector(".get_action_detail_on_map_js_jheo")) {
        document.querySelector(".get_action_detail_on_map_js_jheo").click();
    }

    fetchDetails(".content_detail_js_jheo", depart_name, depart_code, id)
}

function fetchDetails(selector, departName, departCode, id) {

    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'text/plain; charset=UTF-8');

    console.log(departName, departCode, id);

    fetch(`/station/departement/${departName}/${departCode}/details/${id}`)
        .then(response => {
            return response.text()
        }).then(r => {
            document.querySelector(selector).innerHTML = null;

            const parser = new DOMParser();
            const htmlDocument = parser.parseFromString(r, "text/html");
            if( htmlDocument.querySelector(".content_body")){
                document.querySelector(selector).innerHTML = r
            }else{
                document.querySelector(selector).innerHTML = `
                    <div class="alert alert-danger d-flex align-items-center" role="alert">
                        <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Danger:"><use xlink:href="#exclamation-triangle-fill"/></svg>
                        <div>
                            Nous avons rencontre une probleme de connexion.
                        </div>
                    </div>`
            }

        })

}

function getDetailsFerme(pathDetails, inHome = false) {
    let remove = !inHome ? document.getElementById("remove-detail-ferme") : document.getElementById("remove-detail-home")
    remove.removeAttribute("class", "hidden");
    remove.setAttribute("class", "navleft-detail fixed-top")

    const id_selector = !inHome ? "#content-details-ferme" : "#content-details-home";
    fetchDetailFerme(id_selector, pathDetails);
}

function getDetailsFermeForMobile(pathDetails) {
    // location.assign(pathDetails)

    // console.log(depart_name, depart_code, id)
    if (document.querySelector(".btn_retours_specifique_jheo_js")) {
        document.querySelector(".btn_retours_specifique_jheo_js").click();
    }

    if (document.querySelector(".get_action_detail_on_map_js_jheo")) {
        document.querySelector(".get_action_detail_on_map_js_jheo").click();
    }

    // fetchDetails(".content_detail_js_jheo", depart_name,depart_code,id)
    fetchDetailFerme(".content_detail_js_jheo", pathDetails)
}

function fetchDetailFerme(selector, link) {

    let myHeaders = new Headers();
    myHeaders.append('Content-Type', 'text/plain; charset=UTF-8');
    fetch(link, myHeaders)
        .then(response => {
            return response.text()
        }).then(r => {
            document.querySelector(selector).innerHTML = null
            document.querySelector(selector).innerHTML = r
        })

}


function addListFermeMobile() {

    document.querySelector("#open-navleft-mobile").addEventListener('click', () => {
        document.querySelector("#open-navleft-mobile").style.opacity = 0
        document.querySelector("#open-navleft-mobile").style.transition = "opacity 0.5s ease-in-out"
        if (document.querySelector("#list-depart-mobile")) {
            document.querySelector("#list-depart-mobile").removeAttribute("style")
        }
        fetch(`/ferme-mobile`)
            .then(response => {
                return response.text()
            }).then(r => {
                document.querySelector("#list-depart-mobile").innerHTML = null
                document.querySelector("#list-depart-mobile").innerHTML = r
                // firstX= document.querySelector("#list-depart-mobile").getBoundingClientRect().x+document.querySelector("#list-depart-mobile").getBoundingClientRect().width
                // firstY=document.querySelector("#list-depart-mobile").getBoundingClientRect().y

                document.querySelector("#close-ferme").addEventListener('click', () => {
                    document.querySelector("#list-depart-mobile").style.transform = "translateX(-100vw)"
                    document.querySelector("#open-navleft-mobile").style.opacity = 1
                })


                if (document.querySelector(".content_input_search_dep_jheo_js")) {
                    document.querySelector(".content_input_search_dep_jheo_js").addEventListener("submit", (e) => {
                        e.preventDefault();
                        if (document.querySelector(".input_search_dep_mobile_jheo_js").value) {
                            redirectToSerchFerme(document.querySelector(".input_search_dep_mobile_jheo_js").value)
                        }
                    })
                }
            })


    })
}


function redirectToSerchFerme(value) {
    const valueToSearch = value.toString().normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase()
    if (/^0[0-9]+$/.test(valueToSearch)) {
        lookupByDepCodeFerme(valueToSearch)
    } else if (/^0[0-9]+.[a-zA-Z]+/.test(valueToSearch)) {
        const tmp = valueToSearch.replace(/[^0-9]/g, "")
        lookupByDepCodeFerme(tmp)
    } else if (/^[0-9]+.[a-zA-Z]+$/.test(valueToSearch)) {
        const tmp = valueToSearch.replace(/[^0-9]/g, "")
        if (tmp.split("").length === 1) {
            const p = `0${tmp}`
            lookupByDepCodeFerme(p)
        } else {
            lookupByDepCodeFerme(tmp)
        }
    } else if (/[^0-9]/.test(valueToSearch)) {
        lookupByDepNameFerme(valueToSearch)
    } else {
        if (valueToSearch.split("").length === 1) {
            const tmp = `0${valueToSearch}`
            lookupByDepCodeFerme(tmp)
        } else {
            lookupByDepCodeFerme(valueToSearch)
        }
    }
}

function lookupByDepNameFerme(g) {
    DEP.depName.some((i, index) => {
        if ((i.toLowerCase()) === g) {
            let code = DEP.depCode[index]
            if (index >= 0 && index <= 8) {
                // code = DEP.depCode[index].replace("0", "")
                // window.location=`/ferme/departement/${code}/${i}`
                window.location = `/ferme/departement/${i}/${code}`
            } else {
                // window.location=`/ferme/departement/${code}/${i}`
                window.location = `/ferme/departement/${i}/${code}`
            }
        }
    })
}

function lookupByDepCodeFerme(g) {
    DEP.depCode.some((i, index) => {
        if (i == g) {
            let name = DEP.depName[index]
            if (index >= 0 && index <= 8) {
                // window.location=`/ferme/departement/${i.replace("0","")}/${name}`
                window.location = `/ferme/departement/${name}/${i}`
            } else {
                // window.location=`/ferme/departement/${i}/${name}`
                window.location = `/ferme/departement/${name}/${i}`
            }
        }
    })
}

// const nom_dep = 

function addListDepartMobile(nom_dep, id_dep) {
    location.assign(`/ferme/departement/${nom_dep}/${id_dep}`)
}

function addSpecificFermeMobile(nom_dep, id_dep) {
    document.querySelector("#open-navleft-mobile-specific").style.opacity = 0
    document.querySelector("#open-navleft-mobile-specific").style.transition = "opacity 0.5s ease-in-out"
    if (document.querySelector("#list-specific-depart")) {
        document.querySelector("#list-specific-depart").removeAttribute("style")
    }
    fetch(`/ferme-mobile/departement/${nom_dep}/${id_dep}`)
        .then(response => {
            return response.text()
        }).then(r => {
            // document.querySelector("#list-specific-depart")
            document.querySelector("#list-specific-depart").innerHTML = null
            document.querySelector("#list-specific-depart").innerHTML = r
            document.querySelector("#close-ferme-specific").addEventListener('click', () => {
                document.querySelector("#list-specific-depart").style.transform = "translateX(-115vw)"
                document.querySelector("#open-navleft-mobile-specific").style.transition = "opacity 0.5s ease-in-out"
                document.querySelector("#open-navleft-mobile-specific").style.opacity = 1
            })
        })
}

function addDetailFermeMobile(nom_dep, id_dep, id_ferme) {
    location.assign(`/ferme-mobile/departement/${nom_dep}/${id_dep}/details/${id_ferme}`)
}

function closeFermeDetail(nom_dep, id_dep) {
    // alert("Detail")
    location.assign(`/ferme/departement/${nom_dep}/${id_dep}`)
}




let i = 0
if (document.querySelector("#list-depart-mobile")) {
    console.log("inside function and #list-depart-mobile")

    document.querySelector("#list-depart-mobile").ontouchstart = (e) => {
        //e.preventDefault()
        firstX = e.touches[0].clientX;
        firstY = e.touches[0].clientY;
        //console.log(e.touches)
        /* document.querySelector("#open-navleft-mobile-specific").style.transition = "translateX(-100vw) ease-in-out"*/
    }

    document.querySelector("#list-depart-mobile").ontouchend = (e) => {
        let x = e.changedTouches[0].clientX
        let y = e.changedTouches[0].clientY
        // e.target.getBoundingClientRect().x = firstX - i;
        //if()
        console.log(x)
        console.log(y)
        let deltx = x - firstX
        let delty = y - firstY
        if (Math.abs(deltx) > Math.abs(delty)) {

            if (deltx < 0) { //gauche
                //document.querySelector("body").style.transition = `all 3s ease-in-out !important`
                document.querySelector("#list-depart-mobile").style.transform = `translateX(${deltx}px)` //left = `${deltx}px`
                document.querySelector("#open-navleft-mobile").style.opacity = 1
                // document.querySelector("#open-navleft-mobile").style.transition = "opacity 0.5s ease-in-out"
            }
        }
    }
}

function addListDepartRest() {
    document.querySelector("#open-navleft-resto-mobile").addEventListener('click', () => {
        document.querySelector("#open-navleft-resto-mobile").style.opacity = 0
        document.querySelector("#open-navleft-resto-mobile").style.transition = "opacity 0.5s ease-in-out";

        if (document.querySelector("#list-depart-resto-mobile")) {
            document.querySelector("#list-depart-resto-mobile").removeAttribute("style")
        }

        fetch(`/restaurant-mobile`)
            .then(response => response.text())
            .then(r => {
                document.querySelector("#list-depart-resto-mobile").innerHTML = null
                document.querySelector("#list-depart-resto-mobile").innerHTML = r

                document.querySelector("#close-resto").addEventListener('click', () => {
                    document.querySelector("#list-depart-resto-mobile").style.transform = "translateX(-100vw)"
                    document.querySelector("#open-navleft-resto-mobile").style.opacity = 1
                })
            })
    })
}

function getSpecifictArrond(nom_dep, id_dep) {
    location.assign(`/restaurant/arrondissement?nom_dep=${nom_dep}&id_dep=${id_dep}`)
}


function addListSpecResto(nom_dep, id_dep) {
    document.querySelector("#open-navleft-resto-mobile-arrand").style.opacity = 0
    document.querySelector("#open-navleft-resto-mobile-arrand").style.transition = "opacity 0.5s ease-in-out"
    if (document.querySelector("#list-arrand-resto")) {
        console.log(document.querySelector("#list-arrand-resto"))
        document.querySelector("#list-arrand-resto").removeAttribute("style")
    }
    fetch(`/restaurant-mobile/arrondissement?nom_dep=${nom_dep}&id_dep=${id_dep}`)
        .then(response => {
            return response.text()
        }).then(r => {
            // console.log(r)
            document.querySelector("#list-arrand-resto").innerHTML = null
            document.querySelector("#list-arrand-resto").innerHTML = r

            document.querySelector("#close-resto-arrand").addEventListener('click', () => {
                document.querySelector("#list-arrand-resto").style.transform = "translateX(-100vw)"
                document.querySelector("#open-navleft-resto-mobile-arrand").style.opacity = 1
            })
        })
}


function getSpecArrand(nom_dep, id_dep, codinsee) {
    location.assign(`/restaurant/arrondissement/specific/?nom_dep=${nom_dep}&id_dep=${id_dep}&codinsee=${codinsee}`)
}

function getSpectResto(nom_dep, id_dep) {
    location.assign(`/restaurant/specific?nom_dep=${nom_dep}&id_dep=${id_dep}`)
}

function addListSpecRestoMobile(nom_dep, id_dep, codinsee) {
    document.querySelector("#open-navleft-resto-spec-mobile").style.opacity = 0
    document.querySelector("#open-navleft-resto-spec-mobile").style.transition = "opacity 0.5s ease-in-out"
    if (document.querySelector("#list-spesific-resto")) {
        console.log(document.querySelector("#list-spesific-resto"))
        document.querySelector("#list-spesific-resto").removeAttribute("style")
    }
    // alert(codinsee)
    fetch(`/restaurant-mobile/specific?nom_dep=${nom_dep}&id_dep=${id_dep}&codinsee=${codinsee}`)
        .then(response => {
            return response.text()
        }).then(r => {
            // console.log(r)
            document.querySelector("#list-spesific-resto").innerHTML = null
            document.querySelector("#list-spesific-resto").innerHTML = r

            document.querySelector("#close-resto-specific").addEventListener('click', () => {
                document.querySelector("#list-spesific-resto").style.transform = "translateX(-100vw)"
                document.querySelector("#open-navleft-resto-spec-mobile").style.opacity = 1
            })
        })
}

function getDetailRetoMobile(nom_dep, id_dep, id_restaurant, codinsee = null) {
    if (id_dep == "75" && codinsee != null) {
        location.assign(`/restaurant-mobile/departement/${nom_dep}/${id_dep}/details/${id_restaurant}?codinsee=${codinsee}`)
    } else {
        location.assign(`/restaurant-mobile/departement/${nom_dep}/${id_dep}/details/${id_restaurant}`)
    }
}

function closeRestoDetail(nom_dep, id_dep, codinsee) {
    if (id_dep == "75") {
        location.assign(`/restaurant/arrondissement/specific?nom_dep=${nom_dep}&id_dep=${id_dep}&codinsee=${codinsee}`)
    } else {
        location.assign(`/restaurant/specific?nom_dep=${nom_dep}&id_dep=${id_dep}`)
    }
}

function createChargement(){
    
    document.querySelector(".cart_map_js_jheo").innerHTML = `
        <div class="chargement_content chargment_content_js_jheo" id="toggle_chargement">
            <div class="content_box">
                <div class="box">
                    <div class="under_box"></div>
                </div>
            </div>
        </div>
    `
}

function deleteChargement(){
    if(document.querySelector(".chargement_content_js_jheo")){
        document.querySelector(".chargement_content_js_jheo").remove();
        //document.querySelector(".chargement_content_js_jheo").style.display = "none";
    }
}

function createMap(){
    document.querySelector(".cart_map_js_jheo").innerHTML = `
        <div id="map" class="map map_js_jheo"></div>
    `
}

function deleteMap(){
    if(document.querySelector(".map_js_jheo")){
        document.querySelector(".map_js_jheo").remove();
    }
}

/**
 * Set a viewing photos as a gallery
 * @param {NodeList} imgs : list of images elements for making gallery
 */

function setGallerie(imgs){
    imgs.forEach(img => {
            
        //console.log(img);
        h = img.naturalHeight;
        w = img.naturalWidth;

        //console.log("img.naturalHeight : " + img.naturalHeight)
        //console.log("img.naturalWidth : " + img.naturalWidth)
        ratio = w/h;
        closestRatioValue = Math.abs(1-ratio);
        closestRatio = 1;
        var a = Math.abs(16/9-ratio);
        var b = Math.abs(9/16-ratio);

        if(a < closestRatioValue){
            closestRatioValue = a;
            closestRatio = 16/9;
        }
        if(b < closestRatioValue){
            closestRatioValue = b;
            closestRatio = 9/16;
        }

        if(closestRatio == 16/9){
            console.log("16/9");
            img.style.gridColumn = "span 2";
        } else if(closestRatio == 9/16){
            console.log("9/16");
            img.style.gridRow = "span 2";
        }
    });
}

/**
 * 
 * @param {Node} btn_photo : Parameter button clickable before shwoing image
 */

function setPhotoTribu(btn_photo){

    if(btn_photo.tagName != "IMG"){
        document.querySelector("#img_modal").src = btn_photo.querySelector("img").src
    }else{
        document.querySelector("#img_modal").src = btn_photo.src
    }
    
}
