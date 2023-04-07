const current_url =  window.location.href;
const url = current_url.split("/");
const nav_items = document.querySelectorAll(".nav-item");
const url_test = new URL(current_url);


function testIsMatched(value, tester){
    return value?.split(" ").join("").toLowerCase().includes(tester);
}

function showResultSearchNavBar(type,nom, adresse, dep, nomDep , id ){

    const div_content = document.createElement('div');
    div_content.className = "card mt-2";

    const card_body = document.createElement('div');
    card_body.className = "card-body";

    const h5 = document.createElement('h5');
    h5.className = "card-title";
    h5.innerText = nom;

    const p = document.createElement('p');
    p.className = "card-text";
    p.innerText = `Adresse : ${adresse}, departement : ${dep}, nom de departement : ${nomDep}`;

    const a = document.createElement("a");

    switch(type){
        case "ferme":
            a.setAttribute("href", `/ferme/departement/${nomDep}/${dep}/details/${id}`);
            break;
        case "resto":
            // /restaurant/departement/Loire-Atlantique/44/details/1
            a.setAttribute("href", `/restaurant/departement/${nomDep}/${dep}/details/${id}`);
            break;
        case "station":
            // /station/departement/50/Manche/details/4827
            a.setAttribute("href", `/station/departement/${dep}/${nomDep}/details/${id}`);
            break;
        default: 
            break
    }
    
    a.className = "btn btn-primary";
    a.innerText = "Voir details"

    div_content.appendChild(card_body);
    card_body.appendChild(h5);
    card_body.appendChild(p);
    card_body.appendChild(a);

    document.querySelector(".content_list_result_js_jheo").appendChild(div_content)
}

///jheo: gray on tous filter 
// if( url_test.pathname === "/connexion" || url_test.pathname === "/reset-passwords" || url_test.pathname === "/confirm-reset-passwords"){
//     document.getElementById("tous").classList.remove("active");

//     document.getElementById("ferme").classList.remove("active");

//     document.getElementById("station").classList.remove("active");

//     document.getElementById("restaurant").classList.remove("active");
// }

// ///jheo: gray on tous filter 
// if( url_test.pathname === "/"){
//     document.getElementById("tous").classList.add("active")

//     rmDataInLocalStorage("type")

//     document.getElementById("ferme").classList.remove("active");

//     document.getElementById("station").classList.remove("active");

//     document.getElementById("restaurant").classList.remove("active");
// }



//// jheo: remove back gray for all link.

// nav_items.forEach(item => {

//     if (item.classList.contains("active")){

//         item.classList.remove("active");

//     }

// })



//// jheo mettre gray for ferme if it is active.
// if( url.includes("ferme")){
//     const li = document.getElementById("ferme");
//     li.querySelector("a > img").src="/public/assets/image/icon-ferme-bleu.png"
//     // li.querySelector("a > img").src="/assets/image/icon-ferme-bleu.png"
//     li.classList.add("active");

//     setDataInLocalStorage("type", "ferme");

//     const tous_type = document.getElementById("tous");
//     tous_type.classList.remove("active")
//     tous_type.querySelector("a > img").src="/public/assets/image/icon-tout-noir.png"
//     // tous_type.querySelector("a > img").src="/assets/image/icon-tout-noir.png"
// }

// /// jheo mettre gray for station if it is active.
// if( url.includes("station")){
//     const li = document.getElementById("station");
//     li.classList.add("active");
//     li.querySelector("a > img").src="/public/assets/icon/icon_essanceB.png"
//     // li.querySelector("a > img").src="/assets/icon/icon_essanceB.png"

//     setDataInLocalStorage("type", "station");

//     const tous_type = document.getElementById("tous");
//     tous_type.classList.remove("active")
//     tous_type.querySelector("a > img").src="/public/assets/image/icon-tout-noir.png"
//     // tous_type.querySelector("a > img").src="/assets/image/icon-tout-noir.png"
// }

// if( url.includes("restaurant")){
//     const li = document.getElementById("restaurant");
//     li.classList.add("active");
//     li.querySelector("a > img").src="/public/assets/image/icon-resto-bleu.png"
//     // li.querySelector("a > img").src="/assets/image/icon-resto-bleu.png"

//     setDataInLocalStorage("type", "restaurant");

//     const tous_type = document.getElementById("tous");
//     tous_type.classList.remove("active")
//     tous_type.querySelector("a > img").src="/public/assets/image/icon-tout-noir.png"
//     // tous_type.querySelector("a > img").src="/assets/image/icon-tout-noir.png"
// }

// if (current_url.includes("/geosirene/auto") || current_url.includes("/geosirenespec/specific/45")|| current_url.includes("geosirenetype=45")){
    
//     const li = document.getElementById("car");
//     li.classList.add("active");
//     document.querySelector("#car > a > i").style.color="#0033ff"

//     const tous_type = document.getElementById("tous");
//     tous_type.classList.remove("active")
//     tous_type.querySelector("a > img").src="/public/assets/image/icon-tout-noir.png"
//     // tous_type.querySelector("a > img").src="/assets/image/icon-tout-noir.png"
// }

// if (current_url.includes("/geosirene/commerce") || current_url.includes("/geosirenespec/specific/47") || current_url.includes("geosirenetype=47")) {
//     const li = document.getElementById("commerce");
//     li.classList.add("active");
//     document.querySelector("#commerce > a > i").style.color="#0033ff"

//     const tous_type = document.getElementById("tous");
//     tous_type.classList.remove("active")
//     tous_type.querySelector("a > img").src="/public/assets/image/icon-tout-noir.png"
//     // tous_type.querySelector("a > img").src="/assets/image/icon-tout-noir.png"
// }

// if( document.querySelector("#car")){

//     document.querySelector("#car").onclick = () => {
//             document.querySelector("#car").classList.add("active")
//         document.querySelector("#car > a > i").style.color = "#0033ff"
//          document.querySelectorAll("body > main > div.content_left_menu.fixed-top > div" +
//             "> div > div.content_list_menu.mt-5 > ul >li ").forEach(li => { 
//                  if (li.classList.contains("active") && li.id != "car") {
//                         li.classList.remove("active")
//                         if (li.id == "commerce") {
//                             document.querySelector("#commerce > a > i").style.color="#000"
//                         }
//                         console.log(li)
//                     }
//             })
//             document.querySelectorAll("body > div.content_left_menu.fixed-top > " +
//                 "div > div > div.content_list_menu.mt-5 > ul >li").forEach(li => { 
    
//                      console.log(li)
//                     if (li.classList.contains("active") && li.id != "car") {
//                         li.classList.remove("active")
//                         if (li.id == "commerce") {
//                             document.querySelector("#commerce > a > i").style.color="#000"
//                         }
//                         console.log(li)
//                     }
//                 });
//     }
// }

// if( document.querySelector("#commerce")){

//     document.querySelector("#commerce").onclick = () => {
//             document.querySelector("#commerce").classList.add("active")
//         document.querySelector("#commerce > a > i").style.color = "#0033ff"
//         document.querySelectorAll("body > main > div.content_left_menu.fixed-top > div" +
//             "> div > div.content_list_menu.mt-5 > ul > li").forEach(li => { 
//                  if (li.classList.contains("active") && li.id != "commerce") {
//                         li.classList.remove("active")
//                         if (li.id == "car") {
//                             document.querySelector("#car > a > i").style.color="#000"
//                         }
//                         console.log(li)
//                     }
//             })
//             document.querySelectorAll("body > div.content_left_menu.fixed-top > " +
//                 "div > div > div.content_list_menu.mt-5 > ul >li").forEach(li => { 
    
//                     if (li.classList.contains("active") && li.id != "commerce") {
//                         li.classList.remove("active")
//                         if (li.id == "car") {
//                             document.querySelector("#car > a > i").style.color="#000"
//                         }
//                         console.log(li)
//                     }
                         
//                 });
//     }
// }

if( document.querySelector(".form_content_search_navbar_js")){
    const search_form = document.querySelector(".form_content_search_navbar_js");
    if( getDataInLocalStorage("type")){
        const baseOne = getDataInLocalStorage("type");
        search_form.setAttribute("action", `${search_form.getAttribute("action")}/${baseOne}`);
    }
}


/// use this for flip on the left menu
if( document.querySelector(".b-example-divider .fa-solid") ){

    const menu = document.querySelector(".b-example-divider .fa-solid")
    menu.addEventListener("click" , () => {

        if(menu.getAttribute("data-toggle-state") === "show"){

            document.querySelector(".content_left_menu").style.animation ="toHideLeft 0.5s linear forwards"

            document.querySelector(".content_left_menu").style.overflow ="hidden"



            document.querySelector(".right_content").style.animation="toScaleUpContent 0.5s linear forwards";

            document.querySelector(".content_nav_top").style.animation="toScaleUpNavbar 0.5s linear forwards";

     

            const all_span = document.querySelectorAll(".link_type_menu");

            all_span.forEach(item => {

                item.style.animation="toNone 0.2s linear forwards";

             })

     

             menu.setAttribute("data-toggle-state", "hide")

        }else{

            document.querySelector(".content_left_menu").style.animation ="toShowLeft 0.5s linear forwards"

             

            document.querySelector(".right_content").style.animation="toScaleDownContent 0.5s linear forwards";

            document.querySelector(".content_nav_top").style.animation="toScaleDownNavbar 0.5s linear forwards";

     

             const all_span = document.querySelectorAll(".link_type_menu");

             all_span.forEach(item => {

                 item.style.animation="toBlock 0.2s linear forwards"

             })

             menu.setAttribute("data-toggle-state", "show")

        }

    })

}



///jheo: for message flash ---------------------------
if(document.querySelector(".custom-flash")){

    const contentMessageFlash = document.querySelector(".custom-flash");

    //contentMessageFlash.style.animation = "toShowFlass 0.8s linear forwards"



    setTimeout(() => {

        contentMessageFlash.classList.add("hide-flash") 

    }, 4000)

}


if(document.querySelector(".custom-flash-inscription")){

    const contentMessageFlash = document.querySelector(".custom-flash-inscription");

    //contentMessageFlash.style.animation = "toShowFlass 0.8s linear forwards"



    setTimeout(() => {

        contentMessageFlash.classList.add("hide-flash-inscription") 

    }, 4000)

}

/// ------------ end of message flash ----------------



///jheo: setting retractibilite -------------
if( document.querySelector("#show_list")){

    const btn_show_list = document.querySelector("#show_list");



    btn_show_list.addEventListener("click", () => {

        // contentMessageFlash.style.animation = "toShowFlass 0.8s linear forwards"

        document.querySelector(".left_content_home").style.animation ="toShowList 0.8s linear forwards";

        document.querySelector(".right_content_home").style.animation ="toScaleDown 0.8s linear forwards";



        btn_show_list.style.display="none"

    })

}



if( document.querySelector("#hide_list")){



    const btn_hide_list = document.querySelector("#hide_list");

    

    btn_hide_list.addEventListener("click", () => {

        // contentMessageFlash.style.animation = "toShowFlass 0.8s linear forwards"

        document.querySelector(".left_content_home").style.animation ="toHideList 0.8s linear forwards";

        document.querySelector(".right_content_home").style.animation ="toScaleUp 0.8s linear forwards";



        document.querySelector("#show_list").style.display="block"

    })

}
// --------- end of retractibilite -----------



/// ------- toggle password -----------------
if(document.querySelector("#togglePassword")){

    const icon_eye = document.querySelector("#togglePassword");

    icon_eye.addEventListener("click", () => {

        const input_pass = document.querySelector(".toggle_password_js_jheo");

        if( icon_eye.classList.contains("fa-eye-slash")){

            icon_eye.classList.remove("fa-eye-slash");

            icon_eye.classList.add("fa-eye");

            ///show password

            input_pass.type="text";

        }else{

            icon_eye.classList.remove("fa-eye");

            icon_eye.classList.add("fa-eye-slash");

            ///hide password

            input_pass.type="password";

        }

    })

}

if(document.querySelector("#togglePasswordInscription")){

    const icon_eye = document.querySelector("#togglePasswordInscription");

    icon_eye.addEventListener("click", () => {

        const input_pass = document.querySelector(".toggle_password_inscription_js_jheo");

        if( icon_eye.classList.contains("fa-eye-slash")){

            icon_eye.classList.remove("fa-eye-slash");

            icon_eye.classList.add("fa-eye");

            ///show password

            input_pass.type="text";

        }else{

            icon_eye.classList.remove("fa-eye");

            icon_eye.classList.add("fa-eye-slash");

            ///hide password

            input_pass.type="password";

        }

    })

}

////jheo: Responsive for mobile -----------------------
if(document.getElementById("close_menu_for_mobile")){
    const close_menu =  document.getElementById("close_menu_for_mobile");

    close_menu.addEventListener("click" , () => {
        document.querySelector(".content_left_menu").style.animation="toHide 0.8s linear forwards"
        console.log(document.querySelector(".content_left_menu").style.animation)
    })

}



if(document.getElementById("open_menu")){

    const open_menu =  document.getElementById("open_menu");



    open_menu.addEventListener("click" , () => {

        console.log(document.querySelector(".content_left_menu"))

        document.querySelector(".content_left_menu").style.animation="toShow 0.8s linear forwards"

        console.log(document.querySelector(".content_left_menu").style.animation)

    })

}
/// --------------- end of this rtesponsive for mobile ---------


////jheo: cart for map ferme --------------------
function addMapFerme(nom_dep=null, id_dep=null){

	// fetch("/getLatitudeLongitudeFerme/?nom_dep="+ nom_dep +"&id_dep="+id_dep)
	fetch("/getLatitudeLongitudeFerme")

		.then(result => result.json())

		.then(parsedResult => {

			if( parsedResult ){

                ///delete chargement

                // create_map_content();

                /// change the number of result in div

                // if( document.getElementById("content_nombre_result_js_jheo")){

                //     document.getElementById("content_nombre_result_js_jheo").innerText = parsedResult.length;

                // }



				var tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {

					maxZoom: 18,

					attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Points &copy 2012 LINZ'

				})

				// var latlng = L.latLng(-37.89, 175.46);



				let latlng = L.latLng(46.227638, 2.213749);


				let map = L.map('map', {center: latlng, zoom: 5, layers: [tiles]});
addControlPlaceholdersferme(map);
    
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

    // L.DomUtil.get(document.querySelector(".ferme")).addEventListener("click", () => {
    //     L.DomUtil.get(document.querySelector(".leaflet-verticalcenterl.leaflet-left")).classList.toggle("swipe-me-reverse")
    //     L.DomUtil.get(document.querySelector(".leaflet-verticalcenterl.leaflet-left")).classList.toggle("swipe-me")
        
    //     document.querySelector("#close").addEventListener('click', ()=>{
    //         document.querySelector(".leaflet-verticalcenterl.leaflet-left").style.transform = "translateX(-50vh)"
    //     })

    // })

				var markers = L.markerClusterGroup({ 

						chunkedLoading: true

					});

				///// 0 -> 4717

				parsedResult.forEach(item => {

                    console.log(item)

                    const nom_dep = item.departement.split(",")[1]?.toString().trim() ? item.departement.split(",")[1]?.toString().trim() : "unknow";

					// @Route("ferme/departement/{nom_dep}/{id_dep}/details/{id_ferme}" , name="detail_ferme" , methods="GET" )

					var pathDetails ="/ferme/departement/"+ nom_dep + "/" + item.departement.split(",")[0].toString().trim() +"/details/" + item.id;

			

                    const adress = "<br> Adresse: " + item.adresseFerme;

                    const link = "<br><a href='"+ pathDetails + "'> VOIR DETAILS </a>";



                    var title = "Ferme: " + item.nomFerme + ". Departement: " + item.departement +"." + adress + link;

              

					var marker = L.marker(L.latLng(parseFloat(item.latitude), parseFloat(item.longitude )), { title: title,icon: setIcon('assets/icon/ferme-logo.png') });

					marker.bindPopup(title);

					markers.addLayer(marker);

				} )



				map.addLayer(markers);





                ////update list on the left.

                if( nom_dep && id_dep ){

                    /// mise a jour de liste

                    const parent_elements= document.querySelector(".list_result")

                    const elements= document.querySelectorAll(".element")

                    elements.forEach(element => {

                        element.parentElement.removeChild(element);

                    })



                    if(document.querySelector(".plus_result")){

                        parent_elements.removeChild(document.querySelector(".plus_result"))

                    }



                    parsedResult.forEach(new_element => {



                        // <div class="element" id="{{station.id}}">

                        const div_new_element = document.createElement("div");

                        div_new_element.setAttribute("class", "element")

                        div_new_element.setAttribute("id", new_element.id);



                        // <p> <span class="id_departement">{{station.nom }} </span> {{station.adresse}}</p>

                        const s_p = document.createElement("p");

                        s_p.innerHTML = "<span class='id_departement'>"+ new_element.nomFerme+" </span>" +  new_element.adresseFerme



                        // <a class="plus" href="{{path('station_details', {'depart_code':departCode, 'depart_name':departName,'id':station.id }) }}">

                        const a= document.createElement("a");

                        a.setAttribute("class", "plus")

                        a.setAttribute("href", "/ferme/departement/"+ nom_dep +"/"+ id_dep +"/details/" + new_element.id )

                        a.innerText = "Voir details";



                        /// integre dom under the element

                        div_new_element.appendChild(s_p);

                        div_new_element.appendChild(a);

                        

                        ///integre new element in each element.

                        parent_elements.appendChild(div_new_element);

                    })



                }

			}else{

				console.log("ERREUR : L'erreur se produit par votre réseaux.")

			}

		});

}

///----- end of this function add 



///jheo: cart for map station

// function addMapStation(nom_dep=null, id_dep=null){



//     // fetch("/getLatitudeLongitudeStation/?nom_dep="+ nom_dep +"&id_dep="+parseInt(id_dep))
//     fetch("/getLatitudeLongitudeStation")

//         .then(result => result.json())

//         .then(parsedResult => {

//             ///delete chargement

//             // create_map_content();

//             /// {nomFerme: 'Mas de Saragosse', departement: '66', latitude: '42.6825111134275', longitude: '2.70390701189172'}

//             if( parsedResult ){



//                 /// change the number of result in div

//                 // if( document.getElementById("content_nombre_result_js_jheo")){

//                 //     document.getElementById("content_nombre_result_js_jheo").innerText = parsedResult.length;

//                 // }





//                 let tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {

//                     maxZoom: 20,

//                     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Points &copy 2012 LINZ'

//                 })

//                 // var latlng = L.latLng(-37.89, 175.46);



//                 let latlng = L.latLng(46.227638, 2.213749);



//                 let map = L.map('map', {center: latlng, zoom: 5, layers: [tiles]});



//                 var markers = L.markerClusterGroup({ 

//                         chunkedLoading: true

//                     });

//                 ///// 0 -> 4717

//                 parsedResult.forEach(item => {

                    

//                     // @Route("/station/departement/{depart_code}/{depart_name}/details/{id}" , name="station_details", methods={"GET"})

//                     var pathDetails = "/station/departement/" + item.departementCode.toString().trim() + "/"+ item.departementName.trim() + "/details/" + item.id;

                   

//                     const ad = "<br>Adresse: " + item.adresse + " .";

//                     const link = "<br><a href='"+ pathDetails + "'> VOIR DETAILS </a>";



//                     var title = "Station: " + item.nom + ". Id: " + item.id + ". Departement: " + item.departementCode +"." + ad + link;

                     

//                     var marker = L.marker(L.latLng(parseFloat(item.latitude), parseFloat(item.longitude )), { title: title,icon: setIcon("assets/icon/icon_essance.png") });

//                     marker.bindPopup(title);

//                     markers.addLayer(marker);

//                 } )



//                 map.addLayer(markers);



//                 ////update list on the left.

//                 if( nom_dep && id_dep ){

//                     /// mise a jour de liste

//                     const parent_elements= document.querySelector(".list_result")

//                     const elements= document.querySelectorAll(".element")

//                     elements.forEach(element => {

//                         element.parentElement.removeChild(element);

//                     })



//                     if(document.querySelector(".plus_result")){

//                         parent_elements.removeChild(document.querySelector(".plus_result"))

//                     }



//                     parsedResult.forEach(new_element => {



//                         // <div class="element" id="{{station.id}}">

//                         const div_new_element = document.createElement("div");

//                         div_new_element.setAttribute("class", "element")

//                         div_new_element.setAttribute("id", new_element.id);



//                         // <p> <span class="id_departement">{{station.nom }} </span> {{station.adresse}}</p>

//                         const s_p = document.createElement("p");

//                         s_p.innerHTML = "<span class='id_departement'>"+ new_element.nom+" </span>" +  new_element.adresse



//                         // <a class="plus" href="{{path('station_details', {'depart_code':departCode, 'depart_name':departName,'id':station.id }) }}">

//                         const a= document.createElement("a");

//                         a.setAttribute("class", "plus")

//                         a.setAttribute("href", "/station/departement/"+ parseInt(id_dep) +"/"+ nom_dep +"/details/" + new_element.id )

//                         a.innerText = "Voir details";



//                         /// integre dom under the element

//                         div_new_element.appendChild(s_p);

//                         div_new_element.appendChild(a);

                        

//                         ///integre new element in each element.

//                         parent_elements.appendChild(div_new_element);

//                     })



//                 }

//             }else{

//                 console.log("ERREUR : L'erreur se produit par votre réseaux.")

//             }

//         });

// }



///jheo: cart for map station and ferme

function addMapFermeStation(nom_dep=null, id_dep=null){
   let geos=[]
    if (id_dep) {
        if (id_dep == 20) {
                for (let corse of ['2A', '2B'])
                     geos.push(franceGeo.features.find(element => element.properties.code == corse))
        } else {
                    geos.push(franceGeo.features.find(element => element.properties.code == id_dep))
        }  
    }
    
    fetch("/getLatitudeLongitudeForAll/?nom_dep="+ nom_dep +"&id_dep="+id_dep)
    // fetch("/getLatitudeLongitudeForAll")

        .then(result => result.json())

        .then(parsedResult => {

            ///delete chargement

            // create_map_content();



            // console.log(parsedResult)

            const stations = parsedResult.station

            const fermes = parsedResult.ferme



            if( stations && fermes ){



                /// change the number of result in div

                if( document.getElementById("content_nombre_result_js_jheo")){

                    document.getElementById("content_nombre_result_js_jheo").innerText = stations.length + fermes.length ;

                }



                var tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {

                    maxZoom: 20,

                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Points &copy 2012 LINZ'

                })



                var latlng = L.latLng(46.227638, 2.213749);



                var map = L.map('map', {center: latlng, zoom: 5, layers: [tiles]});
                L.geoJson(geos,{style:{
                                //fillColor: getColor(feature.properties.density),
                                weight: 2,
                                opacity: 1,
                                color: 'red',
                                dashArray: '3',
                                fillOpacity: 0
                            },onEachFeature: function (feature, layer) {
                            layer.bindTooltip(feature.properties.nom);
                        }}).addTo(map);


                var markers = L.markerClusterGroup({ 

                        chunkedLoading: true

                    });

                ///// 0 -> 4717



                //// Pour les stations

                stations.forEach(item => {

                    

                    // @Route("/station/departement/{depart_code}/{depart_name}/details/{id}" , name="station_details", methods={"GET"})

                    var pathDetails = "/station/departement/" + item.departementCode.toString().trim() + "/"+ item.departementName.trim() + "/details/" + item.id;

                   

                    const ad = "<br>Adresse: " + item.adresse + " .";

                    const link = "<br><a href='"+ pathDetails + "'> VOIR DETAILS </a>";



                    var title = "Station: " + item.nom + ". Id: " + item.id + ". Departement: " + item.departementCode +"." + ad + link;

                    

                    var marker = L.marker(L.latLng(parseFloat(item.latitude), parseFloat(item.longitude )), { title: title,icon: setIcon("assets/icon/icon_essance.png") });

                    marker.bindPopup(title);

                    markers.addLayer(marker);

                } )



                //// Pour les fermes.

                fermes.forEach(item => {

                    // @Route("ferme/departement/{nom_dep}/{id_dep}/details/{id_ferme}" , name="detail_ferme" , methods="GET" )

                    const nom_dep = item.departement.split(",")[1]?.toString().trim() ? item.departement.split(",")[1]?.toString().trim() : "unknow";

                    var pathDetails ="/ferme/departement/"+ nom_dep + "/" + item.departement.split(",")[0].toString().trim() +"/details/" + item.id;

            

                    const adress = "<br> Adresse: " + item.adresseFerme;

                    const link = "<br><a href='"+ pathDetails + "'> VOIR DETAILS </a>";



                    var title = "Ferme: " + item.nomFerme + ". Departement: " + item.departement +"." + adress + link;



                    var marker = L.marker(L.latLng(parseFloat(item.latitude), parseFloat(item.longitude )), { title: title,icon: setIcon('assets/icon/ferme-logo.png') });

                    marker.bindPopup(title);

                    markers.addLayer(marker);

                } )

                

                ////affiche les resultats.

                map.addLayer(markers);



                ////update list on the left.

                if( nom_dep && id_dep ){

                    /// mise a jour de liste

                    const parent_elements= document.querySelector(".list_result")

                    const elements= document.querySelectorAll(".element")

                    elements.forEach(element => {

                        element.parentElement.removeChild(element);

                    })



                    if(document.querySelector(".plus_result")){

                        parent_elements.removeChild(document.querySelector(".plus_result"))

                    }



                    fermes.forEach(new_element => {



                        // <div class="element" id="{{station.id}}">

                        const div_new_element = document.createElement("div");

                        div_new_element.setAttribute("class", "element")

                        div_new_element.setAttribute("id", new_element.id);



                        // <p> <span class="id_departement">{{station.nom }} </span> {{station.adresse}}</p>

                        const s_p = document.createElement("p");

                        s_p.innerHTML = "<span class='id_departement'>"+ new_element.nomFerme+" </span>" +  new_element.adresseFerme



                        // <a class="plus" href="{{path('station_details', {'depart_code':departCode, 'depart_name':departName,'id':station.id }) }}">

                        const a= document.createElement("a");

                        a.setAttribute("class", "plus")

                        a.setAttribute("href", "/ferme/departement/"+ nom_dep +"/"+ id_dep +"/details/" + new_element.id )

                        a.innerText = "Voir details";



                        /// integre dom under the element

                        div_new_element.appendChild(s_p);

                        div_new_element.appendChild(a);

                        

                        ///integre new element in each element.

                        parent_elements.appendChild(div_new_element);

                    })



                    stations.forEach(new_element => {



                        // <div class="element" id="{{station.id}}">

                        const div_new_element = document.createElement("div");

                        div_new_element.setAttribute("class", "element")

                        div_new_element.setAttribute("id", new_element.id);



                        // <p> <span class="id_departement">{{station.nom }} </span> {{station.adresse}}</p>

                        const s_p = document.createElement("p");

                        s_p.innerHTML = "<span class='id_departement'>"+ new_element.nom+" </span>" +  new_element.adresse



                        // <a class="plus" href="{{path('station_details', {'depart_code':departCode, 'depart_name':departName,'id':station.id }) }}">

                        const a= document.createElement("a");

                        a.setAttribute("class", "plus")

                        a.setAttribute("href", "/station/departement/"+ parseInt(id_dep) +"/"+ nom_dep +"/details/" + new_element.id )

                        a.innerText = "Voir details";



                        /// integre dom under the element

                        div_new_element.appendChild(s_p);

                        div_new_element.appendChild(a);

                        

                        ///integre new element in each element.

                        parent_elements.appendChild(div_new_element);

                    })



                }

                

            }else{

                console.log("ERREUR : L'erreur se produit par votre réseaux.")

            }

        });

}

function filterByPrice(price_min, price_max, type,nom_dep=null, id_dep=null){

    fetch("/getLatitudeLongitudeStation/?max="+price_max + "&min="+ price_min+"&type="+ type+"&nom_dep="+ nom_dep +"&id_dep="+id_dep, {
        method: 'get',
    })
        .then(result => result.json())
        .then(parsedResult => {

            ///delete old map
            const cart_map = document.getElementById("map");
            const parent_map = cart_map.parentElement;

            parent_map.removeChild(cart_map);

            // ///generate new map
            const div = document.createElement("div");
            div.setAttribute("id", "map")
            parent_map.appendChild(div);

            ///delete chargement
            var map=create_map_content();

            if( parsedResult ){

                /// change the number of result in div
                if( document.querySelector(".content_nombre_result_js_jheo")){
                    document.querySelector(".content_nombre_result_js_jheo").innerText = parsedResult.length;
                }

                var markers = L.markerClusterGroup({ 
                    chunkedLoading: true
                });

                ///// 0 -> 4717
                parsedResult.forEach(item => {

                    // @Route("/station/departement/{depart_code}/{depart_name}/details/{id}" , name="station_details", methods={"GET"})
                    var pathDetails = "/station/departement/" + item.departementCode.toString().trim() + "/"+ item.departementName.trim() + "/details/" + item.id;
                    
                    const ad = "<br>Adresse: " + item.adresse + " .";
                    const link = "<br><a href='"+ pathDetails + "'> VOIR DETAILS </a>";



                    var title = "Station: " + item.nom + ". Id: " + item.id + ". Departement: " + item.departementCode +"." + ad + link;
                    var marker = L.marker(L.latLng(parseFloat(item.latitude), parseFloat(item.longitude )), { title: title,icon: setIcon("assets/icon/icon_essance.png") });

                    marker.bindPopup(title);
                    markers.addLayer(marker);

                } )

                map.addLayer(markers);

                if( nom_dep && id_dep ){

                    /// mise a jour de liste
                    const parent_elements= document.querySelector(".list_result")
                    const elements= document.querySelectorAll(".element")
                    console.log(elements.length)
                    elements.forEach(element => {
                        element.parentElement.removeChild(element);
                    })

                    parsedResult.forEach(element => {
                        parent_elements.querySelector("ul").innerHTML += `
                            <li class="card-list element">
                                <div class="row container-depart pt-4 element" id="${element.id}">
                                    <div class="col-md-9">
                                        <p> <span class="id_departement">${element.nom.toLowerCase()}<br> </span>${element.adresse.toLowerCase()}</p>
                                        <ul>
                                            <li> E 85: ${element.prixE85}€</li>
                                            <li> Gplc: ${element.prixGplc}€ </li>
                                            <li> Sp 95:${element.prixSp95}€ </li>
                                            <li> Sp 95 E 10:${element.prixSp95E10}€</li>
                                            <li> Sp 98:${element.prixSp98}€</li>
                                            <li> Gasoil:${element.prixGasoil}€</li>
                                        </ul>
                                    </div>
                                    <div class="col-md-2">
                                        <a id="open-detail-station" onclick="getDetailStation('${id_dep}','${nom_dep}','${element.id}')">
                                            <svg version="1.0" xmlns="http://www.w3.org/2000/svg"  viewbox="0 0 512.000000 512.000000" preserveaspectratio="xMidYMid meet">

                                                <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)" 
                                                stroke="none">
                                                    <path d="M2375 4954 c-231 -24 -462 -78 -641 -149 -782 -310 -1321 -993 -1440
                                                    -1824 -21 -141 -23 -445 -5 -581 23 -170 77 -398 116 -485 8 -16 26 -59 40
                                                    -95 175 -426 486 -804 870 -1056 1052 -689 2449 -398 3148 658 313 473 437
                                                    1008 360 1568 -135 995 -920 1789 -1923 1945 -101 15 -440 28 -525 19z m285
                                                    -395 c108 -17 187 -60 254 -137 32 -37 72 -96 90 -132 l31 -65 3 -519 3 -519
                                                    332 6 c183 3 418 3 523 -1 188 -7 192 -8 256 -40 172 -85 278 -295 249 -496
                                                    -23 -164 -114 -297 -249 -363 l-76 -38 -518 -3 -517 -3 -3 -517 -3 -517 -28
                                                    -59 c-79 -170 -238 -266 -437 -266 -199 0 -358 96 -437 266 l-28 59 -3 517 -3
                                                    517 -517 3 -518 3 -76 38 c-176 87 -280 295 -249 497 21 138 112 279 221 343
                                                    98 57 120 59 652 59 l487 -1 3 517 3 517 29 62 c16 35 35 68 42 74 8 6 14 20
                                                    14 29 0 47 174 151 280 169 77 12 115 12 190 0z"/>
                                                </g>
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                            </li>
                        
                        `
                    })
                }

            }else{
                console.log("ERREUR : L'erreur se produit par votre réseaux.")
            }
        })
        // .catch(e => {
        //     console.log(e);
        // })
}


function setDataInLocalStorage(type , value){
    localStorage.setItem(type, value );
}

function getDataInLocalStorage(type){
    return localStorage.getItem(type);
}

function rmDataInLocalStorage(type){
    localStorage.removeItem(type);
    // localStorage.clear();
}


function addControlPlaceholdersferme(map) {
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
