const IS_DEV_MODE= true;
const current_url = window.location.href;
const url = current_url.split("/");
const nav_items = document.querySelectorAll(".nav-item");
const url_test = new URL(current_url);
// cloneResultDepResto()
if( document.querySelector(".form_content_search_navbar_js")){
    const search_form = document.querySelector(".form_content_search_navbar_js");
    if( getDataInLocalStorage("type")){
        const baseOne = getDataInLocalStorage("type");
        search_form.setAttribute("action", `${search_form.getAttribute("action")}/${baseOne}`);
    }

    search_form.addEventListener("submit", (e) => {
        const cles0 = document.querySelector(".input_search_type_js").value;
        const cles1= document.querySelector(".input_mots_cle_js").value;
        if( cles0=== "" && cles1 === "" ){
            alert("Veuillez entre mots cles pour la recherche.")
            e.preventDefault();

            if( cles0=== "" ){
                document.querySelector(".input_search_type_js").classList.add("border_red")
            }

            if( cles1=== "" ){
                document.querySelector(".input_mots_cle_js").classList.add("border_red")
            }
        }
    })

    const inputs=  [document.querySelector(".input_search_type_js"), document.querySelector(".input_mots_cle_js")];
    inputs.forEach(input => {
        input.addEventListener("input", () => {
            inputs.forEach(item => {
                if( item.classList.contains("border_red")){
                    item.classList.remove("border_red")
                }
            })
        })
    })

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
// function cloneResultDepResto() {
//     const restDep = document.querySelector(".result_container")
//     if (restDep) {
//         const clone = restDep.cloneNode(true)
//         restDep.parentNode.removeChild(restDep)
//         console.log(clone)
       
//         document.body.appendChild(clone)
//         clone.style.display="block"
//     }
// }
function iconsChange() {
    document.querySelector(".open-navleft-resto > i").classList.toggle("fa-bars")
    document.querySelector(".open-navleft-resto > i").classList.toggle("fa-minuss")
}
if (document.querySelector("#close-list-depart-resto")) {
    document.querySelector("#close-list-depart-resto").addEventListener("click", () => {
        document.querySelector(".result_container_resto").style.display = "none"
        iconsChange()
    })
}

// if (document.querySelector(".btn-recher-nav")) {
//     document.querySelector(".btn-recher-nav").onclick = () => {
//         document.querySelector(".result_container_resto").style.display = "none"
//         document.querySelector(".btn-recher-nav").classList.toggle("open-navleft-resto")
//         document.querySelector(".btn-recher-nav").classList.toggle("close-navleft-resto")
//         document.querySelector(".open-navleft-resto").addEventListener("click", () => {
//             document.querySelector(".result_container_resto").style.display = "block"
//         })
//         iconsChange()
//     }
// }

if (document.querySelector(".open-navleft-resto")) {
    document.querySelector(".open-navleft-resto").addEventListener("click", () => {
        document.querySelector(".result_container_resto").style.display = "block"
        iconsChange()
    })
}


if (document.querySelector("#close-list-depart-resto-spec")) {
    document.querySelector("#close-list-depart-resto-spec").addEventListener("click", () => {
        document.querySelector(".result_container_resto_spec").style.display="none"
        iconsChange()
    })
}

if (document.querySelector(".open-navleft-resto-spec")) {
    document.querySelector(".open-navleft-resto-spec").addEventListener("click", () => {
        document.querySelector(".result_container_resto_spec").style.display="block"
        iconsChange()
    })
}

if (document.querySelector("#close-list-depart-resto-spec-arrond")) {
    document.querySelector("#close-list-depart-resto-spec-arrond").addEventListener("click", () => {
        document.querySelector(".result_container_resto_spec_arrond").style.display="none"
        iconsChange()
    })
}

if (document.querySelector(".open-navleft-resto-arrond")) {
    document.querySelector(".open-navleft-resto-arrond").addEventListener("click", () => {
        document.querySelector(".result_container_resto_spec_arrond").style.display="block"
        iconsChange()
    })
}


if (document.querySelector("#close-list-depart-ferme")) {
    document.querySelector("#close-list-depart-ferme").addEventListener("click", () => {
        document.querySelector(".result_container_ferme").style.display="none"
        iconsChange()
    })
}

if (document.querySelector(".open-navleft-ferme")) {
    document.querySelector(".open-navleft-ferme").addEventListener("click", () => {
        document.querySelector(".result_container_ferme").style.display="block"
        iconsChange()
    })
}

if (document.querySelector("#close-list-depart-ferme-spec")) {
    document.querySelector("#close-list-depart-ferme-spec").addEventListener("click", () => {
        document.querySelector(".result_container_ferme_spec").style.display="none"
        iconsChange()
    })
}

if (document.querySelector(".open-navleft-ferme-spec")) {
    document.querySelector(".open-navleft-ferme-spec").addEventListener("click", () => {
        document.querySelector(".result_container_ferme_spec").style.display="block"
        iconsChange()
    })
}

if (document.querySelector("#close-list-depart-station")) {
    document.querySelector("#close-list-depart-station").addEventListener("click", () => {
        document.querySelector(".result_container_station").style.display="none"
        iconsChange()
    })
}

if (document.querySelector(".open-navleft-station")) {
    document.querySelector(".open-navleft-station").addEventListener("click", () => {
        document.querySelector(".result_container_station").style.display="block"
        iconsChange()
    })
}

if (document.querySelector("#close-list-depart-station-spec")) {
    document.querySelector("#close-list-depart-station-spec").addEventListener("click", () => {
        document.querySelector(".result_container_station_spec").style.display="none"
        iconsChange()
    })
}

if (document.querySelector(".open-navleft-station-spec")) {
    document.querySelector(".open-navleft-station-spec").addEventListener("click", () => {
        document.querySelector(".result_container_station_spec").style.display="block"
        iconsChange()
    })
}
