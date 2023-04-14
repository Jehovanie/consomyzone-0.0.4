////charge content map.
window.addEventListener('load', () => {
    let url_test = new URL(current_url);
    fetch(new Request(url_test.href.replace("search", 'api/search')))
    .then(response => {
        return response.json();
    })
    .then(response => {
        const geos = []
        for (let f of franceGeo.features) {
            geos.push(f)
        }

        var map= create_map_content(geos)
        const { results } = response;
        
        all_data= results[0];
        currentTabMarkers = []; ////desctructor old value.

        addMarker(map, all_data)
    })
    .catch(error => {
        console.log(error)
    })
});



function addMarker(map,data){
    ///delete currentTableMarkers;
    // removeAllMarkers();

    ////add new
    if(data.length > 0 ){

        var markers = L.markerClusterGroup({ 
            chunkedLoading: true
        });

        data.forEach(item => {
        
            let address_HTML = "";
            let miniFiche_HTML = "";
            let image_icon= "";

            if( item.ferme !== undefined ){

                address_HTML = "<br><span class='fw-bolder'> Adresse:</span> <br>" + item.add;
                miniFiche_HTML = "<span class='fw-bolder'>Ferme:</span>  <br>" + item.nom + ".</br><span class='fw-bolder'> Departement:</span>  <br>" + item.dep +"." + address_HTML;
                image_icon= "ferme-logo-bleu.png";
            }else if( item.station !== undefined ){

                miniFiche_HTML =setMiniFicheForStation(item.nom, item.add,item.prixE85,item.prixGplc,item.prixSp95,item.prixSp95E10,item.prixGasoil,item.prixSp98 )
                image_icon= "icon_essanceB.png";
            }else if( item.resto !== undefined ){

                const fullAdresse=`${item.numvoie} ${item.typevoie} ${item.nomvoie} ${item.codpost} ${item.villenorm}`
                address_HTML = "<br><span class='fw-bolder'> Adresse:</span> <br>" + fullAdresse;
                miniFiche_HTML = "<span class='fw-bolder'> Restaurant:</span>  " + item.denominationF + ".<span class='fw-bolder'><br> Departement:</span>  " + item.depName +"." + address_HTML;
                image_icon= "icon-resto-bleu.png";
            }

            const marker = L.marker(L.latLng(parseFloat(item.lat), parseFloat(item.long )), {icon: setIcon(`assets/icon/${image_icon}`) });
            
            currentTabMarkers.push(marker);

            marker.bindTooltip(miniFiche_HTML,{ direction:"top", offset: L.point(0,-30)}).openTooltip();
            
            marker.on('click', () => {
                if( item.resto !== undefined ){
                    if(screen.width < 991 ){
                        alert("mobile resto detail")
                    }else{
                        alert("resto detail")
                    }   
                }else if ( item.station !== undefined ){
                    if( screen.width < 991){
                        const link= "/station/departement/" + item.dep.toString().trim() + "/"+ item.depName.trim() + "/details/" + item.id;;
                        getDetailSearchForMobile(link)
                    }else{

                    }
                    // window.location = "/station/departement/" + item.dep.toString().trim() + "/"+ item.depName.trim() + "/details/" + item.id;;
                }else if ( item.ferme !== undefined ){
                    if( screen.width < 991){
                        alert("mobile ferme detail")
                    }else{
                        alert("ferme detail")
                    }
                }
            })

            markers.addLayer(marker);

        })

        markers.on('clusterclick', function (a) {
            // a.layer is actually a cluster
            a.layer.zoomToBounds({padding: [20, 20]});
            console.log('cluster ' + a.layer.getAllChildMarkers().length);
        });

        ////affiche les resultats.
        map.addLayer(markers);
        map.on("resize zoom", (e) => {
            console.log(e)
            const coordAndZoom = {
                zoom: e.target._zoom,
                coord:e.target._lastCenter
            }
            setDataInLocalStorage("coordTous", JSON.stringify(coordAndZoom))
        })

        map.on("dragend", (e) => {
            console.log(e.target.getCenter(), e.target.getZoom())
            const coordAndZoom = {
                zoom: e.target.getZoom(),
                coord:e.target.getCenter()
            }
            setDataInLocalStorage("coordTous", JSON.stringify(coordAndZoom))
        })
    }
}

function removeAllMarkers(){
    for(let i = 0; i < currentTabMarkers.length; i++){
        markers.removeLayer(currentTabMarkers[i]);
    }
    map.removeLayer(markers);
}

function getDetailSearchForMobile(link) {

    if(document.querySelector(".show_detail_for_mobile_js_jheo")){
        document.querySelector(".show_detail_for_mobile_js_jheo").click();
    }

    fetchDetails(".content_detail_home_js_jheo",link)
}

function fetchDetails(selector, link){

    const myHeaders = new Headers();
    myHeaders.append('Content-Type','text/plain; charset=UTF-8');

    fetch(link)
        .then(response => {
            return response.text()
        }).then(r => { 
           document.querySelector(selector).innerHTML = null
           document.querySelector(selector).innerHTML = r
        })
    
}