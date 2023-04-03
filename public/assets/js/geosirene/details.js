window.addEventListener('load', () => { 

    const coord = document.getElementById('details-coord')
    const lat=parseFloat(coord.dataset.latitude)
    const lng =parseFloat(coord.dataset.longitude)
    const name = coord.dataset.nom
    const type = coord.dataset.codeape
    const dep=coord.dataset.dep
    const cleCoord=lat+""+lng
    console.log("cle"+cleCoord)
    fetch(`/geosirenes/ape/${type}`).then((response) => {
        response.json().then((rs) => {
            create_map_content(); 
            if (rs) {
                let tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        maxZoom: 18,
                        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Points &copy 2012 LINZ'
                })
                // let latlng = L.latLng(-37.89, 175.46);

                let latlng = L.latLng(lat, lng);

                let map = L.map('map', {center: latlng, zoom: 15, layers: [tiles]});

                let markers = L.markerClusterGroup({ 
                    chunkedLoading: true,
                    
                    iconCreateFunction: function (cluster) {
                        //console.log(cluster._cLatLng.lat + "" + cluster._cLatLng.lng)
                        console.log(cluster.getAllChildMarkers())
                        // let tmp = cluster._cLatLng.lat + "" + cluster._cLatLng.lng
                        // tmp = tmp.toString().replace(/[\-\.]/g, "")
                        let sepcMarmerIsExist = false
                        
                        for (let g of  cluster.getAllChildMarkers()){
                           
                            let tmpCleCoord = g._latlng.lat + "" + g._latlng.lng
                            tmpCleCoord = tmpCleCoord.toString().replace(/[\-\.]/g, "")
                            if (cleCoord.replace(/[^0-9]/g, "") == tmpCleCoord) { 
                                sepcMarmerIsExist = true;
                                break;
                            }
                        
                        }
                        if (sepcMarmerIsExist) {
                            
                            return L.divIcon({
                                html: '<span class="markers-spec" id="c' + name.replace(/[\s]/g, "_") + '">' + cluster.getChildCount() + '</span>',
                                className: "spec_cluster",
                                 iconSize:L.point(35,35)
                            });
                        } else {
                            return L.divIcon({
                                html: '<span class="markers_tommy_js">' + cluster.getChildCount() + '</span>',
                                className: "mycluster",
                                iconSize:L.point(35,35)
                            });
                        }
                            
                       
                    },
                    spiderfyOnMaxZoom: true
                });
               
                //let marker = null
                rs.forEach(r=>{
                    console.log(r)
                     const iconCustomBleu = L.icon({
                        // iconUrl: `/public/assets/icon/${r.activitePrincipaleEtablissement}-bleu.png`, ///on prod
                        iconUrl: `/assets/icon/${r.activitePrincipaleEtablissement}-bleu.png`, ///on dev
                        iconSize:     [45, 45], // size of the icon
                        iconAnchor: [30, 50],
                        popupAnchor: [0, -20],
                     })
                    const iconCustomRouge = L.icon({
                        // iconUrl: `/public/assets/icon/${r.activitePrincipaleEtablissement}-red.png`, /// on prod
                        iconUrl: `/assets/icon/${r.activitePrincipaleEtablissement}-red.png`, /// on dev
                        iconSize:     [45, 45], // size of the icon
                        iconAnchor: [30, 50],
                        popupAnchor: [0, -20],
                     })
                    ///detail/geosirene/?nom_dep=%C3%8Ele-et-Vilaine&amp;id_dep=35&amp;id_geosirene=362
                    var pathDetails = "/detail/geosirene/?nom_dep=" +encodeURIComponent(r.departementName)  + "&id_dep=" + r.departement + "&id_geosirene=" + r.id+ "&geosirenetype="+r.activitePrincipaleEtablissement;
                    const adresseRestaurant = r.adresse
                    const title = "<span class='fw-bolder'>Denomination:</span> <br> " + r.denominationGeoscar + ". <br> <span class='fw-bolder'>adresse:</span> <br>" +  adresseRestaurant;
                    const f = r.latitude + "" + r.longitude
                    console.log(r.denominationGeoscar +" " + f)
                    if (cleCoord ==f ) {
                        console.log("ato hitsika")
                        var marker= L.marker(L.latLng(parseFloat(r.latitude), parseFloat(r.longitude )), {icon: iconCustomRouge });
                       
                       
                        //spc_marker = marker;
                    } else {
                        //const title = "<span class='fw-bolder'>Ferme: </span> <br>" + item.nomFerme + ".<br><span class='fw-bolder'> Departement: </span> <br>" + item.departement +"." + adress;
                        var marker = L.marker(L.latLng(parseFloat(r.latitude), parseFloat(r.longitude )), {icon: iconCustomBleu });
                        marker.on('click', () => {
                             window.location = pathDetails;
                        });
                        /*marker.on('click', () => {
                            window.location = pathDetails;
                        })*/
                    //     marker.bindTooltip(title,{ direction:"top", offset: L.point(0,-30)}).openTooltip();
                   
                    //      markers.addLayer(marker);
                    }
                    marker.bindTooltip(title,{ direction:"top", offset: L.point(0,-30)}).openTooltip();
                    markers.addLayer(marker);
                    
                })
                map.addLayer(markers);
                console.log(name.replace(/[\s]/g, "_"))
                // document.querySelector(`#c${name.replace(/[\s]/g, "_")}`).parentElement.style.background="red"
                
            };
        });
    });

});