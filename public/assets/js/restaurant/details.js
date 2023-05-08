let remove = document.getElementById("remove-detail-spec-resto")
function getDetail(event, nom_dep, id_dep, id_restaurant, nomResto) { 

    markers.clearLayers();
    map.removeLayer(markers);
    // var parent;
    // var visibleClusterMarkers = [];
    var bounds =  map.getBounds();
    const divLatLng = event.target.children[0]
    const lat = divLatLng.dataset.toggleLatitude
    const lng = divLatLng.dataset.toggleLongitude
    const id=divLatLng.dataset.toggleId

    console.log(lat, lng);
    setView(lat,lng)
    const url = new URL(window.location.href);
    let idMarkerCible;
    markers = L.markerClusterGroup({
        chunkedLoading: true,
     //   spiderfyOnEveryZoom:true,
         spiderfyOnMaxZoom: true,
         iconCreateFunction: function (cluster) {
             let sepcMarkerIsExist = false
             console.log(cluster._leaflet_id)
             for (let g of cluster.getAllChildMarkers()) {
                 if (idMarkerCible === g.options.id) {
                     console.log("marker cible " + idMarkerCible + " equal ===> " + g.options.id)
                     sepcMarkerIsExist = true;
                     break;
                 }
                
             }
             
             if (sepcMarkerIsExist) {
                    
                 return L.divIcon({
                     html: `<div><span class="markers-spec">${cluster.getChildCount()}</span></div>`,
                     className: "spec_cluster",
                     iconSize: L.point(35, 35)
                     
                 });
             } else {
                 return L.divIcon({
                      
                     html: '<div><span class="markers_tommy_js">' + cluster.getChildCount() + '</span></div>',
                     className: "mycluster",
                     iconSize: L.point(35, 35)
                 });
             }
         }
    });
    for (let marker of tabMarker) {
        if (marker.options.cleNom === nomResto) {
            idMarkerCible=marker.options.id
            console.log("marker cible "+idMarkerCible)
            const icon_R= L.Icon.extend({
                    options: {
                        //iconUrl: url.origin+"/public/assets/icon/NewIcons/icon-resto-new-Rr.png"
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
        } else {
             const icon_R= L.Icon.extend({
                    options: {
                        //iconUrl: url.origin+"/public/assets/icon/NewIcons/icon-resto-new-B.png"
                        iconUrl: url.origin+"/assets/icon/NewIcons/icon-resto-new-B.png"
                    }
                })
            marker.setIcon(new icon_R);
            
        }
        markers.addLayer(marker)
    }
    map.addLayer(markers)
    
    
    
    
    if (remove) {
        remove.removeAttribute("class", "hidden");
        remove.setAttribute("class", "navleft-detail fixed-top")
    }
    var myHeaders = new Headers();
    myHeaders.append('Content-Type','text/plain; charset=UTF-8');
    fetch(`/restaurant/departement/${nom_dep}/${id_dep}/details/${id_restaurant}`, myHeaders)
        .then(response => {
            return response.text()
        }).then(r => {
            document.querySelector("#content-details").innerHTML = null
            document.querySelector("#content-details").innerHTML = r
            
            document.querySelector("#close-detail-tous-resto").addEventListener("click", () => { 
                remove.setAttribute("class", "hidden")
            })
             const idRestaurant = document.querySelector("#all_ferme_in_dep > ul > li > div").getAttribute("data-toggle-id")
            let currentUserId
            if (document.querySelector(".FtBjOlVf"))
                currentUserId = parseInt(document.querySelector(".FtBjOlVf").dataset.dem.split(":")[2].split("\.")[1].replace(/[^0-9]/g, ""), 10)
            if (document.querySelector(".FtBjOlVf") != null)
                showModifArea(idRestaurant, currentUserId)
            if (document.querySelector("#see-tom-js")) {
                showNemberOfAvis(idRestaurant, document.querySelector("#see-tom-js"))
                showNoteGlobale(idRestaurant)
            }
            if(document.querySelector("#see-tom-js")){
                document.querySelector("#see-tom-js").onclick = () => {
                    const d=document.querySelectorAll(".fIQYlf")
                    if(d.length > 0){
                        d.forEach(i=>{
                            i.parentNode.removeChild(i)
                        })
                    }
                    showAvis(currentUserId,idRestaurant) 
                }
            }
        })
}
