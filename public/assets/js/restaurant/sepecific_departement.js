let tabArray = []
let map = null
let markers
let tabMarker = []
let centerss = []
centerss[44] = {
  lat: 47.218371,
  lng: -1.553621,
  zoom:9
}

centerss[77] = {
  lat: 47.218371,
  lng: -1.553621,
  zoom:9
}

centerss[78] = {
  lat: 47.218371,
  lng: -1.553621,
  zoom:9
}

centerss[91] = {
  lat: 47.218371,
  lng: -1.553621,
  zoom:9
}

centerss[92] = {
  lat: 47.218371,
  lng: -1.553621,
  zoom:9
}

centerss[93] = {
  lat: 47.218371,
  lng: -1.553621,
  zoom:9
}

centerss[94] = {
  lat: 47.218371,
  lng: -1.553621,
  zoom:9
}

centerss[95] = {
  lat: 47.218371,
  lng: -1.553621,
  zoom:9
}

centerss[75] = {
  lat: 48.856614,
  lng: 2.3522219,
  zoom: 10,
  arrondissement: {
    75101: { lat: 48.861924, lng: 2.330883 },
    75102: { lat: 48.867556, lng: 2.343892 },
    75103: { lat: 48.8627014160156, lng: 2.3652000427246 },
    75104: { lat: 48.8544006347656 , lng: 2.36240005493164},
    75105: { lat: 48.8446998596191 , lng:  2.35419988632202},
    75106: { lat: 48.8470001220703, lng: 2.33459997177124 },
    75107: { lat: 48.8564987182617, lng: 2.31369996070861},
    75108: { lat: 48.872200012207, lng: 2.31680011749267 },
    75109: { lat: 48.8801002502441 , lng: 2.34039998054504 },
    75110: { lat: 48.8815994262695, lng: 2.36229991912841 },
    75111: { lat: 48.8611984252929 , lng: 2.3833999633789 },
    75112: { lat: 48.8367004394531, lng: 2.39689993858337 },
    75113: { lat: 48.8274002075195, lng: 2.36660003662109 },
    75114: { lat: 48.8316993713378, lng: 2.32319998741149 },
    75115: { lat: 48.8445014953613, lng: 2.29769992828369 },
    75116: { lat: 48.8712005615234, lng: 2.28929996490478 },
    75117: { lat: 48.8866996765136, lng: 2.30349993705749 },
    75118: { lat: 48.8917007446289 , lng: 2.35100007057189 },
    75119: { lat: 48.8825988769531, lng: 2.39109992980957},
    75120: { lat: 48.8646011352539, lng: 2.40639996528625}

   
  }
}


window.addEventListener('load', () => {
  const geos = []
  document.querySelectorAll("#all_ferme_in_dep > div > a").forEach(item => {
    item.onclick = () => {
      localStorage.removeItem("coord")
    }  
  })

  if (window.location.href.includes("/restaurant/arrondissement/specific")) {
    const dep = new URLSearchParams(window.location.href).get("id_dep")
    const codinsee = new URLSearchParams(window.location.href).get("codinsee")
    
    let url = "/Coord/All/Restaurant/specific/arrondissement/" + dep + "/" + codinsee;
    geos.push(arrdParis.features.find(element => element.properties.c_arinsee == codinsee))
   
    console.log(geos)
    const cntrJson = JSON.parse(JSON.stringify(centerss[75]))
    console.log(cntrJson["arrondissement"][codinsee])
    fetch(url).then(response =>response.json())
              .then(response1 => {
                tabArray = response1
                // create_map_content()
                // if (document.getElementById("content_nombre_result_js_jheo")) {
                //   document.getElementById("content_nombre_result_js_jheo").innerText = response1.length;
                // }

                var tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                  maxZoom: 18,
                  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Points &copy 2012 LINZ'
                })
                // var latlng = L.latLng(-37.89, 175.46);
                //lat: 48.85151944993856, lng: 2.3303965687751753
                var latlng = L.latLng(cntrJson["arrondissement"][codinsee].lat, cntrJson["arrondissement"][codinsee].lng);
                const json=getDataInLocalStorage("coord") ? JSON.parse(getDataInLocalStorage("coord")) :null
                const zoom = json ? (json.zoom ? json.zoom :14) : 14;
                const centered = json ? (json.coord ? L.latLng(json.coord.lat, json.coord.lng) : latlng) : latlng;
                map = L.map('map', { center: centered, zoom: zoom, layers: [tiles] });
                L.geoJson(geos,{style:{
                                //fillColor: getColor(feature.properties.density),
                                weight: 2,
                                opacity: 1,
                                color: 'red',
                                dashArray: '3',
                                fillOpacity: 0
                            },onEachFeature: function (feature, layer) {
                            layer.bindTooltip(feature.properties.l_ar);
                  }
                }).addTo(map);
                // addControlPlaceholdersresto(map)
                
                addControlPlaceholders(map)
                L.Control.DockPannel = L.Control.extend({
                  onAdd: function(map) {
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
                      el.setAttribute("draggable","true")
                      return el;
                  },
                  onRemove: function(map) {
              
                  },
                  onClick: ()=>{
                      alert("toto")
                  },
                  onDragend: ()=>{
                      
                  }
                });

    L.control.myControl = function(opts) {
        return new L.Control.DockPannel(opts);
    }

    L.control.myControl({
    position: 'verticalcenter'//right
    }).addTo(map);

    console.log(L.DomUtil.get(document.querySelector(".my-control")))
    var draggable = new L.Draggable(L.DomUtil.get(document.querySelector(".my-control")));
    draggable.enable();
    L.DomUtil.get(document.querySelector(".my-control")).addEventListener('click', ()=>{
        document.querySelector("#card").classList.toggle("hide")
        L.DomUtil.get(document.querySelector(".my-control")).classList.toggle("hide")
    })

    L.Control.DockPannel2 = L.Control.extend({
        onAdd: function(map) {
            var el = L.DomUtil.create('div', 'leaflet-bar my-controller');
            el.innerHTML = `
                <div class="card-options-home hide" id="card">
                   <div class="options-container">
                        <ul>
                            <li class="home-mobile" id="home-mobile">
                                <svg version="1.0" xmlns="http://www.w3.org/2000/svg" 
                                width="40px" height="40px" viewbox="0 0 512.000000 512.000000" preserveaspectratio="xMidYMid meet">

                                    <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)" 
                                    stroke="none">
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
                            <li class="station"  id="mobile_station_js_jheo">
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
                                <svg version="1.0" xmlns="http://www.w3.org/2000/svg" 
                                width="40px" height="40px" viewbox="0 0 512.000000 512.000000" preserveaspectratio="xMidYMid meet">

                                    <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)" 
                                    stroke="none">
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
                            <li class="recherche">
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
        onRemove: function(map) {
    
        },
        onClick: ()=>{
            alert("toto")
        },
        onDragend: ()=>{
            
        }
    });



    L.control.myControl2 = function (opt2) {
        
        return new L.Control.DockPannel2(opt2);
    }
     L.control.myControl2({
        position: 'horizontalmiddle'//center
    }).addTo(map);
    L.DomUtil.get(document.querySelector("#retoure")).addEventListener('click', ()=>{
        document.querySelector("#card").classList.toggle("hide")
        L.DomUtil.get(document.querySelector(".my-control")).classList.toggle("hide")
    })

    L.Control.DockPannel3 = L.Control.extend({
        onAdd: function(map) {
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
        onRemove: function(map) {
    
        },
        onClick: ()=>{
            alert("toto")
        },
        onDragend: ()=>{
            
        }
    });

    L.control.myControl3 = function (opt3) {
        return new L.Control.DockPannel3(opt3);
    }

    L.control.myControl3({
        position: 'verticalcenterl'//left
    }).addTo(map);

    addEventLocation() 
                

      map.doubleClickZoom.disable();

      markers = L.markerClusterGroup({
        chunkedLoading: true,
        
        spiderfyOnMaxZoom: true,
        spiderfyOnEveryZoom:true
      });

      chargeMapAndMarkers(response1, map, markers)

    });
  } else {
    const dep = new URLSearchParams(window.location.href).get("id_dep")
	  const url = "/Coord/Spec/Restaurant/" + dep;
	  console.log(dep);
    geos.push(franceGeo.features.find(element => element.properties.code == dep))
    fetch(url).then(response => response.json())
              .then(response1 => {
                // alert("Success")
                  tabArray = response1
                  // create_map_content()
                  // if (document.getElementById("content_nombre_result_js_jheo")) {
                  //   document.getElementById("content_nombre_result_js_jheo").innerText = response1.length;
                  // }

                  var tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    maxZoom: 18,
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Points &copy 2012 LINZ'
                  })
                  // var latlng = L.latLng(-37.89, 175.46);

                  let latlng = L.latLng(centerss[parseInt(dep)].lat, centerss[parseInt(dep)].lng);
                  const json=getDataInLocalStorage("coord") ? JSON.parse(getDataInLocalStorage("coord")) :null
                  const zoom = json ? (json.zoom ? json.zoom :centerss[parseInt(dep)].zoom) : centerss[parseInt(dep)].zoom;
                  const centered =json ?( json.coord ? L.latLng(json.coord.lat,json.coord.lng):latlng) : latlng ;
                  map = L.map('map', { center: centered, zoom: zoom, layers: [tiles] });
                  console.log(latlng);
                  L.geoJson(geos, {
                    style: {
                                //fillColor: getColor(feature.properties.density),
                                weight: 2,
                                opacity: 1,
                                color: 'red',
                                dashArray: '3',
                                fillOpacity: 0
                            }, onEachFeature: function (feature, layer) {
                            layer.bindTooltip(feature.properties.nom);
					  }
          }).addTo(map);
          // addControlPlaceholdersresto(map)
      addControlPlaceholders(map)
      
      L.Control.DockPannel = L.Control.extend({
        onAdd: function(map) {
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
            el.setAttribute("draggable","true")
            return el;
        },
        onRemove: function(map) {
    
        },
        onClick: ()=>{
            alert("toto")
        },
        onDragend: ()=>{
            
        }
    });

    L.control.myControl = function(opts) {
        return new L.Control.DockPannel(opts);
    }

    L.control.myControl({
    position: 'verticalcenter'//right
    }).addTo(map);

    console.log(L.DomUtil.get(document.querySelector(".my-control")))
    var draggable = new L.Draggable(L.DomUtil.get(document.querySelector(".my-control")));
    draggable.enable();
    L.DomUtil.get(document.querySelector(".my-control")).addEventListener('click', ()=>{
        document.querySelector("#card").classList.toggle("hide")
        L.DomUtil.get(document.querySelector(".my-control")).classList.toggle("hide")
    })

    L.Control.DockPannel2 = L.Control.extend({
        onAdd: function(map) {
            var el = L.DomUtil.create('div', 'leaflet-bar my-controller');
            el.innerHTML = `
                <div class="card-options-home hide" id="card">
                   <div class="options-container">
                        <ul>
                            <li class="home-mobile" id="home-mobile">
                                <svg version="1.0" xmlns="http://www.w3.org/2000/svg" 
                                width="40px" height="40px" viewbox="0 0 512.000000 512.000000" preserveaspectratio="xMidYMid meet">

                                    <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)" 
                                    stroke="none">
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
                                <svg version="1.0" xmlns="http://www.w3.org/2000/svg" 
                                width="40px" height="40px" viewbox="0 0 512.000000 512.000000" preserveaspectratio="xMidYMid meet">

                                    <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)" 
                                    stroke="none">
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
                            <li class="recherche">
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
        onRemove: function(map) {
    
        },
        onClick: ()=>{
            alert("toto")
        },
        onDragend: ()=>{
            
        }
    });



    L.control.myControl2 = function (opt2) {
        
        return new L.Control.DockPannel2(opt2);
    }
     L.control.myControl2({
        position: 'horizontalmiddle'//center
    }).addTo(map);
    L.DomUtil.get(document.querySelector("#retoure")).addEventListener('click', ()=>{
        document.querySelector("#card").classList.toggle("hide")
        L.DomUtil.get(document.querySelector(".my-control")).classList.toggle("hide")
    })

    L.Control.DockPannel3 = L.Control.extend({
        onAdd: function(map) {
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
        onRemove: function(map) {
    
        },
        onClick: ()=>{
            alert("toto")
        },
        onDragend: ()=>{
            
        }
    });

    L.control.myControl3 = function (opt3) {
        return new L.Control.DockPannel3(opt3);
    }

    L.control.myControl3({
        position: 'verticalcenterl'//left
    }).addTo(map);

    // document.querySelector("#home-mobile").addEventListener('click', () => { 
    //     location.assign('/')
    // })
    // // addListFermeMobile()
    // document.querySelector("#mobil-ferme").addEventListener('click', () => { 
    //     location.assign('/ferme')
    // })

    // document.querySelector("#mobil-resto").addEventListener('click', () => { 
    //     location.assign('/restaurant')
    //   })
    addEventLocation()
      
      map.doubleClickZoom.disable();

      // map = L.map('map', {center: latlng, zoom: getDataInLocalStorage("zoom") ? getDataInLocalStorage("zoom"): 5 , layers: [tiles]});

      markers = L.markerClusterGroup({
        chunkedLoading: true,
        spiderfyOnEveryZoom:true,
        spiderfyOnMaxZoom: true
      });

      chargeMapAndMarkers(tabArray, map, markers)
    });
  }
});


// filter alphabet

// selecting required element
const element = document.querySelector(".pagination ul");


const letters = ['', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
//const lettersL=letters.length
let totalPages = letters.length - 1;
let page = 1;
let isTheFerstTime = true

//calling function with passing parameters and adding inside element which is ul tag
if (element) {
    element.innerHTML = createPagination(totalPages, page);
}

function createPagination(totalPages, page) {
  let liTag = '';
  let active;
  let beforePage = page - 1;
  let afterPage = page + 1;
  if (page > 1) { //show the next button if the page value is greater than 1
    liTag += `<li class="btn prev" onclick="createPagination(totalPages, ${page - 1})"><span><i class="fas fa-angle-left"></i></span></li>`;
  }

  if (page > 2) { //if page value is less than 2 then add 1 after the previous button
    liTag += `<li class="first numb" onclick="createPagination(totalPages, 1)"><span>A</span></li>`;
    if (page > 3) { //if page value is greater than 3 then add this (...) after the first li or page
      liTag += `<li class="dots"><span>...</span></li>`;
    }
  }

  // how many pages or li show before the current li
  if (page == totalPages) {
    beforePage = beforePage - 2;
  } else if (page == totalPages - 1) {
    beforePage = beforePage - 1;
  }
  // how many pages or li show after the current li
  if (page == 1) {
    afterPage = afterPage + 2;
  } else if (page == 2) {
    afterPage = afterPage + 1;
  }

  for (var plength = beforePage; plength <= afterPage; plength++) {
    if (plength > totalPages) { //if plength is greater than totalPage length then continue
      continue;
    }
    if (plength == 0) { //if plength is 0 than add +1 in plength value
      plength = plength + 1;
    }
    if (!isTheFerstTime) {
      if (page == plength  ) { //if page is equal to plength than assign active string in the active variable
        active = "active";
      } else { //else leave empty to the active variable
        active = "";
      }
    }
    
    liTag += `<li class="numb ${active}" onclick="createPagination(totalPages, ${plength})"><span>${letters[plength]}</span></li>`;

    // if (liTag) {
    //   liTag += `<li class="numb ${active}" onclick="createPagination(totalPages, ${plength})"><span>${letters[plength]}</span></li>`;
    // } else {
    // liTag += `<li class="numb " onclick="createPagination(totalPages, ${plength})"><span>${letters[plength]}</span></li>`;
      
    // }
  }

  if (page < totalPages - 1) { //if page value is less than totalPage value by -1 then show the last li or page
    if (page < totalPages - 2) { //if page value is less than totalPage value by -2 then add this (...) before the last li or page
      liTag += `<li class="dots"><span>...</span></li>`;
    }
    liTag += `<li class="last numb" onclick="createPagination(totalPages, ${totalPages})"><span>${letters[totalPages]}</span></li>`;
  }

  if (page < totalPages) { //show the next button if the page value is less than totalPage(20)
    liTag += `<li class="btn next" onclick="createPagination(totalPages, ${page + 1})"><span> <i class="fas fa-angle-right"></i></span></li> <li class="btn next ms-4" onclick='refreshData()'><i class="fa-solid fa-arrows-rotate refreshData"></i></li>`;
  }
  if (!isTheFerstTime) {
    let xData = Array()

    element.innerHTML = liTag; //add li tag inside ul tag

  
    let charAfilter = element.querySelector("li.active").textContent;
 
    document.querySelectorAll("#all_ferme_in_dep > ul > li").forEach((ferme) => {
 
    // document.querySelectorAll("#all_ferme_in_dep > ul > li").forEach((ferme) => {
      let nomFerme = ferme.querySelector("p").textContent.trim();
      if (!nomFerme.startsWith(charAfilter)) {
        ferme.style.display = "none"
        ferme.classList.remove("miseho")
      } else {
        ferme.style.display = "block"
        ferme.classList.add("miseho")
        
        xData.push(filterData(ferme.querySelector('.element').dataset.toggleId));
      }

    })
    if (tabMarker.length > 0) {
      
      // console.log(tabMarker.length)
      for (let j = 0; j < tabMarker.length; j++) {
        markers.removeLayer(tabMarker[j]);
        document.querySelector("p.nombre_de_resultat > span.nombre").textContent = document.querySelectorAll(".miseho").length
          
      }
      // console.log(map)
      map.removeLayer(markers);
    tabMarker = [];
      if (xData.length > 0) {
        // console.log(xData)
        
        chargeMapAndMarkers(xData, map, markers)
      } 
    }
  }
   
  
    
  
    // document.querySelector("p.nombre_de_resultat > span").textContent = document.querySelectorAll(".miseho").length

    // console.log(element.querySelector("li.active").textContent);
  
    isTheFerstTime = false
  return liTag; //reurn the li tag
}
function setView(lat,lng) {
  const latlng = L.latLng(lat, lng);
  map.setView(latlng, 15);
}
function chargeMapAndMarkers(response1, map,markers) {

  //const departName = document.querySelector(".titre").getAttribute("data-toggle-deparement")
  ///// 0 -> 4717
  
  response1.forEach(item => {
    if(item.id){
      item = item
    }else{
      item = item[0]
    }
    
    // console.log(item);
    // console.log("item", item.depName)
    // const nom_dep = item.departement.split(",")[1]?.toString().trim() ? item.departement.split(",")[1]?.toString().trim() : "unknow";
    // const departementName = item.departementName ? item.departementName : "unknow";
    const departementName = item.depName
  //  console.log(departementName)

    // @Route("ferme/departement/{nom_dep}/{id_dep}/details/{id_ferme}" , name="detail_ferme" , methods="GET" )
    let pathDetails = `/restaurant-mobile/departement/${departementName}/${item.dep}/details/${item.id}`;
    const adresseRestaurant = `${item.numvoie} ${item.typevoie} ${item.nomvoie} ${item.codpost} ${item.villenorm}`
    const adress = "<br><span class='fw-bolder'> Adresse:</span> <br>" + adresseRestaurant;
    // const link = "<br><a href='"+ pathDetails + "'> VOIR DETAILS </a>";

    var title = "<span class='fw-bolder'> Restaurant:</span>  " + item.denominationF + ".<span class='fw-bolder'><br> Departement:</span>  " + departementName + "." + adress;
    let MarkerCustom = L.Marker.extend({
      options: {
        cleNom: "",
        id:0
      }  
      
    })
    var marker = new MarkerCustom(L.latLng(parseFloat(item.poiY), parseFloat(item.poiX)), { icon: setIcon('assets/icon/NewIcons/icon-resto-new-B.png'),cleNom:item.denominationF,id:item.id });
    //console.log(marker)
    tabMarker.push(marker)
    marker.bindTooltip(title, { direction: "top", offset: L.point(0, -30) }).openTooltip();
    marker.on('click', (e) => {
      
      const url = new URL(window.location.href);
      const icon_R= L.Icon.extend({
          options: {
              iconUrl: url.origin+"/assets/icon/NewIcons/icon-resto-new-Rr.png"
          }
      })
      marker.setIcon(new icon_R);

      if( marker_last_selected){
          const icon_B= L.Icon.extend({
              options: {
                  iconUrl: url.origin+"/assets/icon/NewIcons/icon-resto-new-B.png"
              }
          })
          marker_last_selected.setIcon(new icon_B)
      }
      marker_last_selected = marker

      

       
      

      console.log(e)
      const coordAndZoom = {
        zoom: e.target.__parent._zoom+1,
        coord:e.target.__parent._cLatLng
      }
      setDataInLocalStorage("coord", JSON.stringify(coordAndZoom))
      
      let screemMax = window.matchMedia("(max-width: 1000px)")
      let screemMin = window.matchMedia("(min-width: 1000px)")
      let remove = document.getElementById("remove-detail-spec-resto")
      if (screemMax.matches) {
          location.assign(pathDetails)
      } else if (screemMin.matches) {
          
          remove.removeAttribute("class", "hidden");
          remove.setAttribute("class", "navleft-detail fixed-top")
          var myHeaders = new Headers();
          myHeaders.append('Content-Type','text/plain; charset=UTF-8');
          fetch(`/restaurant/departement/${departementName}/${item.dep}/details/${item.id}`, myHeaders)
              .then(response => {
                  return response.text()
              }).then(r => {
              document.querySelector("#content-details").innerHTML = null
              document.querySelector("#content-details").innerHTML = r
              
              document.querySelector("#close-detail-tous-resto").addEventListener("click", () => {
                  document.querySelector("#content-details").style.display = "none"
              })
              document.querySelector("#content-details").removeAttribute("style")
              
          })
          
      }
    });
    

    markers.addLayer(marker);
    
    
  });
 
  
 
  map.addLayer(markers);
  
  map.on("resize zoom", (e) => {
      console.log(e)
      const coordAndZoom = {
          zoom: e.target._zoom,
          coord:e.target._lastCenter
      }
      setDataInLocalStorage("coord", JSON.stringify(coordAndZoom))
  })
  map.on("dragend", (e) => {
      console.log(e.target.getCenter(), e.target.getZoom())
      const coordAndZoom = {
          zoom: e.target.getZoom(),
          coord:e.target.getCenter()
      }
      setDataInLocalStorage("coord", JSON.stringify(coordAndZoom))
  })
}

function filterData(id) {
  // console.log(tabArray)
  let filteredData = tabArray.filter(position =>
    position.id == id
  )
 
  return filteredData

}

function sortList() {
  var list, i, switching, b, shouldSwitch;
  list = document.querySelector("#all_ferme_in_dep")
  switching = true;
  while (switching) {
    // start by saying: no switching is done:
    switching = false;
    b = list.querySelector("div > p");
    // Loop through all list-items:
    for (i = 0; i < (b.length - 1); i++) {
      // start by saying there should be no switching:
      shouldSwitch = false;
      if (b[i].innerHTML.toLowerCase() > b[i + 1].innerHTML.toLowerCase()) {
        shouldSwitch = true;
        break;
      }
    }
    if (shouldSwitch) {
      /* If a switch has been marked, make the switch
      and mark the switch as done: */
      b[i].parentNode.insertBefore(b[i + 1], b[i]);
      switching = true;
    }
  }
}

function reverseList(e) {
  const parent = document.querySelector("#all_ferme_in_dep")
  const arr = Array.from(parent.childNodes);
  arr.reverse();
  parent.append(...arr);
  e.classList.add("active")

  if (e.parentElement.nextElementSibling) {
    e.parentElement.nextElementSibling.querySelector("a").classList.remove("active")
  } else {
    e.parentElement.previousElementSibling.querySelector("a").classList.remove("active")
  }

}

function refreshData(){
  document.querySelector("li.numb.active").classList.remove("active")
    document.querySelectorAll("#all_ferme_in_dep > ul > li").forEach((ferme) => {
      ferme.style.display = "block"
      if (!ferme.classList.toString().includes("miseho")) {
        ferme.classList.add("miseho")
      }
    })
  document.querySelector("p.nombre_de_resultat > span.nombre").textContent = document.querySelectorAll("#all_ferme_in_dep > ul > li").length


  let xData = Array()
  document.querySelectorAll("#all_ferme_in_dep > ul > li.miseho").forEach((ferme) => {
    
      xData.push(filterData(ferme.querySelector('.element').dataset.toggleId));

  })

  
  if (tabMarker.length > 0) {
    for (let j = 0; j < tabMarker.length; j++) {
      markers.removeLayer(tabMarker[j]);

    }

    map.removeLayer(markers);

    tabMarker = [];
   
  }

  chargeMapAndMarkers(tabArray, map, markers)

}



