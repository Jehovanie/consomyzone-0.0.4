

function create_map_content_respons(){
    // {# <div id="map"  style="width: 100%;"></div> #}
    
    var tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
					maxZoom: 18,
					attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Points &copy 2012 LINZ'
	})
	var latlng = L.latLng(46.227638, 2.213749);
    var map = L.map('map', { center: latlng, zoom: 9, layers: [tiles] });
    console.log(map)
    map.setView([51.505, -0.09], 13);
    addControlPlaceholders(map);


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
            el.innerHTML = `<div class="card-options-home hide" id="card">
                   <div class="options-container">
                      <ul>
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
                            <li class="ferme">
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
                            <li class="resto">
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
                            <li class="station">
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
            </div>`     ;
           
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
                <ul id="list_choix">
                    <li>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt, laborum.</li>
                    <li>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt, laborum.</li>
                    <li>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt, laborum.</li>
                    <li>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt, laborum.</li>
                    <li>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt, laborum.</li>
                    <li>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt, laborum.</li>
                    <li>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt, laborum.</li>
                    <li>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt, laborum.</li>
                    <li>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt, laborum.</li>
                </ul>
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

    //new L.Draggable(L.DomUtil.get(document.querySelector(".leaflet-verticalcenterl.leaflet-left"))).enable();

    // L.DomUtil.get(document.querySelector(".leaflet-verticalcenter.leaflet-left")).addEventListener("touchmove", (event) => {
    //     event.target.classList.toggle("swipe-me")
    // })

    L.DomUtil.get(document.querySelector(".ferme")).addEventListener("click", () => {
        L.DomUtil.get(document.querySelector(".leaflet-verticalcenterl.leaflet-left")).classList.toggle("swipe-me-reverse")
        L.DomUtil.get(document.querySelector(".leaflet-verticalcenterl.leaflet-left")).classList.toggle("swipe-me")
        
        document.querySelector("#close").addEventListener('click', ()=>{
            document.querySelector(".leaflet-verticalcenterl.leaflet-left").style.transform = "translateX(-50vh)"
        })

    })

   

// Change the position of the Zoom Control to a newly created placeholder.
//map.zoomControl.setPosition('verticalcenterright');

// You can also put other controls in the same placeholder.
//L.control.scale({position: 'verticalcenterright'}).addTo(map);
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
