let remove = document.getElementById("remove-detail-spec-resto")
function getDetail(event, nom_dep, id_dep, id_restaurant, nomResto) { 
    var parent;
    var visibleClusterMarkers = [];
    var bounds =  map.getBounds();
   
   const url = new URL(window.location.href);
    for (let marker of tabMarker) {
        if (marker.options.cleNom === nomResto) {
            // alert("mitovy")  
            const icon_R= L.Icon.extend({
                    options: {
                        iconUrl: url.origin+"/assets/icon/NewIcons/icon-resto-new-Rr.png"
                    }
                })
                marker.setIcon(new icon_R);
        } else {
             const icon_R= L.Icon.extend({
                    options: {
                        iconUrl: url.origin+"/assets/icon/NewIcons/icon-resto-new-B.png"
                    }
                })
                marker.setIcon(new icon_R);
        }
    }
    
    let cm=null
    const divLatLng = event.target.children[0]
    console.log(divLatLng)
    const lat = parseFloat(divLatLng.dataset.toggleLatitude,10)
    const lng = parseFloat(divLatLng.dataset.toggleLongitude, 10)
    setView(lat,lng)
    const cleCoord=lat+""+lng
    markers.eachLayer(function (markerr) {
       
        const cleMrkerCoord=markerr._latlng.lat+""+markerr._latlng.lng
        if (cleCoord == cleMrkerCoord) { 
            cm=markerr
            console.log(cleMrkerCoord+" "+cleCoord)
            parent = markers.getVisibleParent(markerr);
            if (parent && (typeof visibleClusterMarkers[parent._leaflet_id] == 'undefined')) {
                visibleClusterMarkers[parent._leaflet_id] = parent;
            }
        }
        
    });
    visibleClusterMarkers.forEach(function (clusterMarker) {
        console.log(clusterMarker.getAllChildMarkers())
        markers.options = {
            showCoverageOnHover: false,
            iconCreateFunction: function() {
                return L.divIcon({ html: '<b>' + 'test' + '</b>' });
            }
        };
        
        markers.refreshClusters(clusterMarker.getAllChildMarkers());
        
    });
    
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
            const currentUserId = parseInt(document.querySelector(".FtBjOlVf").dataset.dem.split(":")[2].split("\.")[1].replace(/[^0-9]/g, ""), 10)
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
    // document.querySelector("#see-tom-js")
}
