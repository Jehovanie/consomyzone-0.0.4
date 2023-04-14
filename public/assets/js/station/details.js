// /**

//  *  DONNE DISPONIBLE :

//  *  class="description"

//  *  data-toggle-latitude ="{{(details.latitude) ? details.latitude : '0' }}"

//  *  data-toggle-longitude="{{(details.longitude) ? details.longitude : '0'}}"

//  *  data-toggle-longtd="{{(details.longtd) ? details.longtd : '0' }}"

//  *  data-toggle-lat="{{(details.lat) ? details.lat : '0'}}

//  */


// if (document.querySelector(".description")) {

//     let content_station = document.querySelector(".description");

//     let latitude = content_station.getAttribute("data-toggle-latitude").replace(/0+$/g,"");

//     let  longitude = content_station.getAttribute("data-toggle-longitude").replace(/0+$/g,"");

//     let cleCoord = latitude+" "+longitude


//     let lat_final=0,

//     long_final=0;



    

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
//         document.querySelectorAll("#list_departements > div > a").forEach(item => {
//             item.onclick = (e) => {
//             localStorage.removeItem("coordStaion")
//             }
//         })

//         fetch("/getLatitudeLongitudeStation")

//             .then(result => result.json())

//             .then(parsedResult => {



//                 ///delete chargment and create dom map

//                 create_map_content();



//                 /// {nomFerme: 'Mas de Saragosse', departement: '66', latitude: '42.6825111134275', longitude: '2.70390701189172'}

//                 if( parsedResult ){

//                     var tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {

//                         maxZoom: 18,

//                         attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Points &copy 2012 LINZ'

//                     })

//                     // var latlng = L.latLng(-37.89, 175.46);



//                     var latlng = L.latLng(lat_final, long_final);

//                     const json=getDataInLocalStorage("coordStation") ? JSON.parse(getDataInLocalStorage("coordStation")) :null
//                     const zoom = json ? (json.zoom ? json.zoom :18) : 18;
//                     const centered = json ? (json.coord ? L.latLng(json.coord.lat, json.coord.lng) : latlng) : latlng;
//                     console.log("center "+ " "+ centered+" zoom "+ zoom)
//                     let map = L.map('map', { center: centered, zoom: zoom, layers: [tiles] });
//                     map.doubleClickZoom.disable();

//                     var markers = L.markerClusterGroup({

//                             chunkedLoading: true,

//                                     iconCreateFunction: function (cluster) {
//                                 //console.log(cluster._cLatLng.lat + "" + cluster._cLatLng.lng)
//                                     console.log(cluster.getAllChildMarkers())
//                                     // let tmp = cluster._cLatLng.lat + "" + cluster._cLatLng.lng
//                                     // tmp = tmp.toString().replace(/[\-\.]/g, "")
//                                     let sepcMarmerIsExist = false
                                    
//                                     for (let g of  cluster.getAllChildMarkers()){
                                    
//                                         let tmpCleCoord = g._latlng.lat + "" + g._latlng.lng
//                                         tmpCleCoord = tmpCleCoord.toString().replace(/[\-\.]/g, "")
//                                         if (cleCoord.replace(/[^0-9]/g, "") == tmpCleCoord) {
//                                             sepcMarmerIsExist = true;
//                                             break;
//                                         }
                                    
//                                     }
//                                     if (sepcMarmerIsExist) {
                                        
//                                         return L.divIcon({
//                                             html: '<span class="markers-spec" id="c' + name.replace(/[\s]/g, "_") + '">' + cluster.getChildCount() + '</span>',
//                                             className: "spec_cluster",
//                                             iconSize:L.point(35,35)
//                                         });
//                                     } else {
//                                         return L.divIcon({
//                                             html: '<span class="markers_tommy_js">' + cluster.getChildCount() + '</span>',
//                                             className: "mycluster",
//                                             iconSize:L.point(35,35)
//                                         });
//                                     }
                                        
                                
//                                 },
//                                 spiderfyOnMaxZoom: true


//                         });

//                     ///// 0 -> 4717

//                     var spc_marker;



//                     parsedResult.forEach(item => {

//                         const ad = "<br><span class='fw-bolder'>Adresse:</span>" + item.adresse + " .";

//                         ///specifique icon and popup auto

//                         if(parseFloat(item.latitude) === lat_final && parseFloat(item.longitude) === long_final ){


                            
//                             var miniFicheOnHover =setMiniFicheForStation(item.nom, item.adresse,item.prixE85,item.prixGplc,item.prixSp95,item.prixSp95E10,item.prixGasoil,item.prixSp98 )

//                             var marker = L.marker(L.latLng(parseFloat(item.latitude), parseFloat(item.longitude )), {icon: setIcon("assets/icon/icon_essance.png") });

                            

//                             spc_marker = marker;

//                         }else{

//                             // @Route("/station/departement/{depart_code}/{depart_name}/details/{id}" , name="station_details", methods={"GET"})

//                             var pathDetails = "/station/departement/" + item.departementCode.toString().trim() + "/"+ item.departementName.trim() + "/details/" + item.id;
//                             var miniFicheOnHover =setMiniFicheForStation(item.nom, item.adresse,item.prixE85,item.prixGplc,item.prixSp95,item.prixSp95E10,item.prixGasoil,item.prixSp98 )

//                             var marker = L.marker(L.latLng(parseFloat(item.latitude), parseFloat(item.longitude )), {icon: setIcon("assets/icon/icon_essanceB.png") });

//                             marker.on('click', (e) => {
//                                 const coordAndZoom = {
//                                     zoom: e.target.__parent._zoom+1,
//                                     coord:e.target.__parent._cLatLng
//                                 }
//                                 setDataInLocalStorage("coordFerme", JSON.stringify(coordAndZoom))
//                                 window.location = pathDetails;

//                             })

//                         }



//                         marker.bindTooltip(miniFicheOnHover,{ direction:"auto", offset: L.point(0,-30)}).openTooltip();

//                         markers.addLayer(marker);

//                     } )



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

//                     console.log(cluster)


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

let remove = document.getElementById("remove-detail-station")
function getDetailStation(depart_name, depart_code, id) { 
    console.log(depart_name, depart_code, id)
    remove.removeAttribute("class", "hidden");
    remove.setAttribute("class", "navleft-detail fixed-top")
    var myHeaders = new Headers();
    myHeaders.append('Content-Type','text/plain; charset=UTF-8');
    fetch(`/station/departement/${depart_name}/${depart_code}/details/${id}`)
        .then(response => {
            console.log(response)

            return response.text()
        }).then(r => { 
           document.querySelector("#content-details-station").innerHTML = null
           document.querySelector("#content-details-station").innerHTML = r
        })
    
}

document.querySelector("#close-detail-station").addEventListener("click", () => { 
    remove.setAttribute("class", "hidden")
})