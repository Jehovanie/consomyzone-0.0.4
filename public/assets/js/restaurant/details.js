// window.addEventListener('load', () => {
//     document.querySelectorAll("#all_ferme_in_dep > div > a").forEach(item => {
//         item.onclick = (e) => {
//         localStorage.removeItem("coord")
//         }
//     })
//     const coord = document.getElementById('details-coord')
//     const lat=parseFloat(coord.dataset.latitude)
//     const lng =parseFloat(coord.dataset.longitude)
//     const name=coord.dataset.nom
//     const cleCoord = lat + "" + lng
//     const codinsee=coord.dataset.codeinsee
//     console.log("cle" + cleCoord)
//     const geos = []
//     //c_arinsee
//     if (window.location.href.includes("/restaurant/departement/Paris/75")) {
//         geos.push(arrdParis.features.find(element => element.properties.c_arinsee == codinsee))
//     } else {
//          const dep =window.location.href.split("/")[6]
//          if (dep == 20) {
//                 for (let corse of ['2A', '2B'])
//                      geos.push(franceGeo.features.find(element => element.properties.code == corse))
//         } else {
//                 geos.push(franceGeo.features.find(element => element.properties.code == dep))
//         }
//     }
    
//     fetch("/Coord/All/Restaurant").then((response) => {
//         response.json().then((rs) => {
//             create_map_content();
//             if (rs) {
//                 let tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//                         maxZoom: 18,
//                         attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Points &copy 2012 LINZ'
//                 })
//                 // let latlng = L.latLng(-37.89, 175.46);

//                 let latlng = L.latLng(lat, lng);

//                 // let map = L.map('map', {center: latlng, zoom: getDataInLocalStorage("zoom") ? getDataInLocalStorage("zoom"):15, layers: [tiles]});
//                 const json=getDataInLocalStorage("coord") ? JSON.parse(getDataInLocalStorage("coord")) :null
//                 const zoom = json ? (json.zoom ? json.zoom :18) : 18;
//                 const centered = json ? (json.coord ? L.latLng(json.coord.lat, json.coord.lng) : latlng) : latlng;
// 				console.log("center "+ " "+ centered+" zoom "+ zoom)
//                 let map = L.map('map', { center: centered, zoom: zoom, layers: [tiles] });
//                 map.doubleClickZoom.disable();
//                 L.geoJson(geos,{style:{
//                                 //fillColor: getColor(feature.properties.density),
//                                 weight: 2,
//                                 opacity: 1,
//                                 color: 'red',
//                                 dashArray: '3',
//                                 fillOpacity: 0
//                             },onEachFeature: function (feature, layer) {
//                             layer.bindTooltip(feature.properties.l_ar);
//                         }}).addTo(map);
//                 let markers = L.markerClusterGroup({
//                     chunkedLoading: true,
                    
//                     iconCreateFunction: function (cluster) {
//                         //console.log(cluster._cLatLng.lat + "" + cluster._cLatLng.lng)
//                         console.log(cluster.getAllChildMarkers())
//                         // let tmp = cluster._cLatLng.lat + "" + cluster._cLatLng.lng
//                         // tmp = tmp.toString().replace(/[\-\.]/g, "")
//                         let sepcMarmerIsExist = false
                        
//                         for (let g of  cluster.getAllChildMarkers()){
                           
//                             let tmpCleCoord = g._latlng.lat + "" + g._latlng.lng
//                             tmpCleCoord = tmpCleCoord.toString().replace(/[\-\.]/g, "")
//                             if (cleCoord.replace(/[^0-9]/g, "") == tmpCleCoord) {
//                                 sepcMarmerIsExist = true;
//                                 break;
//                             }
                        
//                         }
//                         if (sepcMarmerIsExist) {
                            
//                             return L.divIcon({
//                                 html: '<span class="markers-spec" id="c' + name.replace(/[\s]/g, "_") + '">' + cluster.getChildCount() + '</span>',
//                                 className: "spec_cluster",
//                                  iconSize:L.point(35,35)
//                             });
//                         } else {
//                             return L.divIcon({
//                                 html: '<span class="markers_tommy_js">' + cluster.getChildCount() + '</span>',
//                                 className: "mycluster",
//                                 iconSize:L.point(35,35)
//                             });
//                         }
                            
                       
//                     },
//                     spiderfyOnMaxZoom: true
//                 });
               
//                 //let marker = null
//                 rs.forEach(r=>{
//                     console.log(r)
                    
//                     var pathDetails = "/restaurant/departement/" + r.depName + "/" + r.dep + "/details/" + r.id;
//                     const adresseRestaurant = `${r.numvoie} ${r.typevoie} ${r.nomvoie} ${r.codpost} ${r.villenorm}`
//                     const title = "<span class='fw-bolder'>Réstaurant:</span> <br> " + r.denominationF + ". <br> <span class='fw-bolder'>adresse:</span> <br>" +  adresseRestaurant;
//                     const f = r.poiY + "" + r.poiX
//                     console.log(r.denominationF +" " + f)
//                     if (cleCoord ==f ) {
//                         console.log("ato hitsika")
//                         var marker= L.marker(L.latLng(parseFloat(r.poiY), parseFloat(r.poiX )), {icon: setIcon('assets/icon/icon-restoR.png'), /*draggable: true */ });
                       
                       
//                         //spc_marker = marker;
//                     } else {
//                         //const title = "<span class='fw-bolder'>Ferme: </span> <br>" + item.nomFerme + ".<br><span class='fw-bolder'> Departement: </span> <br>" + item.departement +"." + adress;
//                         var marker = L.marker(L.latLng(parseFloat(r.poiY), parseFloat(r.poiX )), {icon: setIcon('assets/icon/icon-resto-bleu.png'), /*draggable: true*/ });
//                         marker.on('click', (e) => {
//                         console.log(e)
//                          const coordAndZoom = {
//                             zoom: e.target.__parent._zoom+1,
//                             coord:e.target.__parent._cLatLng
//                         }
//                         setDataInLocalStorage("coord", JSON.stringify(coordAndZoom))
//                         window.location = pathDetails;
//                         })
//                         /*marker.on('click', () => {
//                             window.location = pathDetails;
//                         })*/
//                     //     marker.bindTooltip(title,{ direction:"top", offset: L.point(0,-30)}).openTooltip();
                   
//                     //      markers.addLayer(marker);
//                     }
//                      marker.bindTooltip(title,{ direction:"top", offset: L.point(0,-30)}).openTooltip();
                   
//                         markers.addLayer(marker);
                    
//                 })
//                 map.addLayer(markers);
//                 // map.on("zoom", (e) => {
//                 //     setDataInLocalStorage("zoom", e.target._zoom)
//                 // })
//                 map.on("resize zoom", (e) => {
//                     console.log(e)
//                     const coordAndZoom = {
//                         zoom: e.target._zoom,
//                         coord:e.target._lastCenter
//                     }
//                     setDataInLocalStorage("coord", JSON.stringify(coordAndZoom))
//                 })

//                 map.on("dragend", (e) => {
//                     console.log(e.target.getCenter(), e.target.getZoom())
//                     const coordAndZoom = {
//                         zoom: e.target.getZoom(),
//                         coord:e.target.getCenter()
//                     }
//                     setDataInLocalStorage("coord", JSON.stringify(coordAndZoom))
//                 })
//                 // console.log(name.replace(/[\s]/g, "_"))
//                 // document.querySelector(`#c${name.replace(/[\s]/g, "_")}`).parentElement.style.background="red"
                
//             };
//         });
//     });

// });

// document.querySelector("#open-detail").addEventListener("click", () => {
//     const remove = document.getElementById("remove-detail")
//     remove.removeAttribute("class", "hidden");
//     remove.setAttribute("class", "navleft-detail fixed-top")
    
//     fetch('restaurant/departement/{nom_dep}/{id_dep}/details/{id_restaurant}')
//         .then((reponse) => { return reponse.json() })
//         .then((response) => {
//             console.log(response)
//         })

// })

let remove = document.getElementById("remove-detail")
function getDetail(nom_dep, id_dep, id_restaurant) { 
    
    remove.removeAttribute("class", "hidden");
    remove.setAttribute("class", "navleft-detail fixed-top")
    var myHeaders = new Headers();
    myHeaders.append('Content-Type','text/plain; charset=UTF-8');
    fetch(`/restaurant/departement/${nom_dep}/${id_dep}/details/${id_restaurant}`, myHeaders)
        .then(response => {
            return response.text()
        }).then(r => {
           document.querySelector("#content-details").innerHTML = null
           document.querySelector("#content-details").innerHTML = r
        })
    
}

document.querySelector("#close-detail").addEventListener("click", () => { 
    remove.setAttribute("class", "hidden")
})