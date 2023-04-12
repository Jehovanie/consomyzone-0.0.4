// /**

//  *  DONNE DISPONIBLE :

//  *  class="description"

//  *  data-toggle-latitude ="{{(details.latitude) ? details.latitude : '0' }}"

//  *  data-toggle-longitude="{{(details.longitude) ? details.longitude : '0'}}"

//  *  data-toggle-longtd="{{(details.longtd) ? details.longtd : '0' }}"

//  *  data-toggle-lat="{{(details.lat) ? details.lat : '0'}}

//  */


// if( document.querySelector(".description")){

//     let content_ferme = document.querySelector(".description");

//     let latitude = content_ferme.getAttribute("data-toggle-latitude").replace(/0+$/g,"");

//     let longitude = content_ferme.getAttribute("data-toggle-longitude").replace(/0+$/g,"");
//     let cleCoord = latitude+" "+longitude
//     console.log("cle"+cleCoord)



//     let lat_final=0;

//     let long_final=0



    

//     if( parseFloat(latitude) != 0 ){

//         lat_final =parseFloat(latitude);

//     }else{ ///deuxiemme choix de latitude

//         lat_final = 0;

//     }



//     if( parseFloat(longitude) != 0 ){

//         long_final = parseFloat(longitude);

//     }else{ ///deuxiemme choix de longitude

//         long_final = 0;

//     }



//     window.addEventListener('load', () => {
//         document.querySelectorAll("#all_ferme_in_dep > div > a").forEach(item => {
//                 item.onclick = (e) => {
//                 localStorage.removeItem("coordFerme")
//                 }
//             })
//         const geos=[]
//         const dep =window.location.href.split("/")[6]
//          if (dep == 20) {
//                 for (let corse of ['2A', '2B'])
//                      geos.push(franceGeo.features.find(element => element.properties.code == corse))
//         } else {
//                 geos.push(franceGeo.features.find(element => element.properties.code == dep))
//         }
//         fetch("/getLatitudeLongitudeFerme")

//             .then(result => result.json())

//             .then(parsedResult => {

//                 ///delete chargment and create dom map

//                 create_map_content();



//                 if( parsedResult ){

//                     var tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {

//                         maxZoom: 18,

//                         attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Points &copy 2012 LINZ'

//                     })

//                     // var latlng = L.latLng(-37.89, 175.46);



//                     var latlng = L.latLng(lat_final, long_final);

//                     const json=getDataInLocalStorage("coordFerme") ? JSON.parse(getDataInLocalStorage("coordFerme")) :null
//                     const zoom = json ? (json.zoom ? json.zoom :18) : 18;
//                     const centered = json ? (json.coord ? L.latLng(json.coord.lat, json.coord.lng) : latlng) : latlng;
//                     console.log("center "+ " "+ centered+" zoom "+ zoom)
//                     let map = L.map('map', { center: centered, zoom: zoom, layers: [tiles] });
//                     L.geoJson(geos,{style:{
//                                 //fillColor: getColor(feature.properties.density),
//                                 weight: 2,
//                                 opacity: 1,
//                                 color: 'red',
//                                 dashArray: '3',
//                                 fillOpacity: 0
//                             },onEachFeature: function (feature, layer) {
//                             layer.bindTooltip(feature.properties.nom);
//                     }}).addTo(map);
//                     map.doubleClickZoom.disable();

//                     var markers = L.markerClusterGroup({

//                         chunkedLoading: true,
                        
//                             iconCreateFunction: function (cluster) {
//                             // console.log(cluster._cLatLng.lat + "" + cluster._cLatLng.lng)
//                             console.log(cluster.getAllChildMarkers())
//                             // let tmp = cluster._cLatLng.lat + "" + cluster._cLatLng.lng
//                             // tmp = tmp.toString().replace(/[\-\.]/g, "")
//                             let sepcMarmerIsExist = false
                            
//                             for (let g of  cluster.getAllChildMarkers()){
                            
//                                 let tmpCleCoord = g._latlng.lat + "" + g._latlng.lng
//                                 tmpCleCoord = tmpCleCoord.toString().replace(/[\-\.]/g, "")
//                                 if (cleCoord.replace(/[^0-9]/g, "") == tmpCleCoord) {
//                                     sepcMarmerIsExist = true;
//                                     break;
//                                 }
                            
//                             }
//                             if (sepcMarmerIsExist) {
                                
//                                 return L.divIcon({
//                                     html: '<span class="markers-spec" id="c' + name.replace(/[\s]/g, "_") + '">' + cluster.getChildCount() + '</span>',
//                                     className: "spec_cluster",
//                                     iconSize:L.point(35,35)
//                                 });
//                             } else {
//                                 return L.divIcon({
//                                     html: '<span class="markers_tommy_js">' + cluster.getChildCount() + '</span>',
//                                     className: "mycluster",
//                                     iconSize:L.point(35,35)
//                                 });
//                             }
                                
                        
//                         },
//                         spiderfyOnMaxZoom: true

//                         });



//                     var spc_marker;

//                     ///// 0 -> 4717

//                     parsedResult.forEach(item => {

                        

//                         const adress = "<br><span class='fw-bolder'> Adresse: </span> <br> " + item.adresseFerme;

//                         ///specifique icon and popup auto

//                         if(parseFloat(item.latitude) === lat_final && parseFloat(item.longitude) === long_final ){

//                             var title = "<span class='fw-bolder'>Ferme:</span> <br> " + item.nomFerme + ". <br> <span class='fw-bolder'>Departement:</span> <br>" + item.departement +"." + adress;

//                             var marker = L.marker(L.latLng(parseFloat(item.latitude), parseFloat(item.longitude )), {icon: setIcon('assets/icon/ferme-logoR.png') });

//                             spc_marker = marker;


//                         }else{

//                             // @Route("ferme/departement/{nom_dep}/{id_dep}/details/{id_ferme}" , name="detail_ferme" , methods="GET" )

//                             // const departementName = item.departementName ? item.departementName : "unknow";

//                             const departementName = item.departementName;

//                             var pathDetails ="/ferme/departement/"+ departementName + "/" + item.departement +"/details/" + item.id;

//                             // var link = "<br><a href='"+ pathDetails + "'> VOIR DETAILS </a>";

//                             var title = "<span class='fw-bolder'>Ferme: </span> <br>" + item.nomFerme + ".<br><span class='fw-bolder'> Departement: </span> <br>" + item.departement +"." + adress;

//                             var marker = L.marker(L.latLng(parseFloat(item.latitude), parseFloat(item.longitude )), {icon: setIcon('assets/icon/ferme-logo-bleu.png') });

                            

//                             marker.on('click', (e) => {
//                                 const coordAndZoom = {
//                                     zoom: e.target.__parent._zoom+1,
//                                     coord:e.target.__parent._cLatLng
//                                 }
//                                 setDataInLocalStorage("coordFerme", JSON.stringify(coordAndZoom))
//                                 window.location = pathDetails;

//                             })

//                         }

//                         // marker.bindPopup(title);

//                         marker.bindTooltip(title,{ direction:"top", offset: L.point(0,-30)}).openTooltip();

//                         markers.addLayer(marker);

//                     } )

                    
//                     // actual_marker.openPopup();

//                     map.addLayer(markers);
//                     map.on("resize zoom", (e) => {
//                         console.log(e)
//                         const coordAndZoom = {
//                             zoom: e.target._zoom,
//                             coord:e.target._lastCenter
//                         }
//                         setDataInLocalStorage("coordFerme", JSON.stringify(coordAndZoom))
//                     })

//                     map.on("dragend", (e) => {
//                         console.log(e.target.getCenter(), e.target.getZoom())
//                         const coordAndZoom = {
//                             zoom: e.target.getZoom(),
//                             coord:e.target.getCenter()
//                         }
//                         setDataInLocalStorage("coordFerme", JSON.stringify(coordAndZoom))
//                     })



//                     var cluster = markers.getVisibleParent(spc_marker);

//                     if( cluster){

//                         setTimeout(() => {

//                             cluster.openPopup();

//                         }, 500);

//                     }else{

//                         setTimeout(() => {

//                             spc_marker.openPopup();

//                         }, 500);

//                     }

//                 }else{

//                     console.log("ERREUR : L'erreur se produit par votre réseaux.")

//                 }

//         });

//     });
// }

let remove = document.getElementById("remove-detail-ferme")
function getDetailFerme(nom_dep, id_dep, id_ferme) { 
    remove.removeAttribute("class", "hidden");
    remove.setAttribute("class", "navleft-detail fixed-top")
    var myHeaders = new Headers();
    myHeaders.append('Content-Type','text/plain; charset=UTF-8');
    fetch(`/ferme/departement/${nom_dep}/${id_dep}/details/${id_ferme}`, myHeaders)
        .then(response => {
            return response.text()
        }).then(r => { 
           document.querySelector("#content-details-ferme").innerHTML = null
           document.querySelector("#content-details-ferme").innerHTML = r
        })
    
}

document.querySelector("#close-detail-ferme").addEventListener("click", () => { 
    remove.setAttribute("class", "hidden")
})

