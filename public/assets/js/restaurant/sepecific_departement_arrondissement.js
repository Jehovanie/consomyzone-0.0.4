window.addEventListener('load', () => {
    const dep = new URLSearchParams(window.location.href).get("id_dep")
    const codinsee =new URLSearchParams(window.location.href).get("codinsee")
    //alert(dep)
    let url = "/Coord/All/Restaurant/specific/arrondissement/" + dep+"/" + codinsee;

    fetch(url).then(response => {
        response.json().then(response => {
        
            var tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 18,
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Points &copy 2012 LINZ'
            })
            // var latlng = L.latLng(-37.89, 175.46);

            var latlng = L.latLng(46.227638, 2.213749);

            let map = L.map('map', { center: latlng, zoom: 5, layers: [tiles] });
            
            var markers = L.markerClusterGroup({
                chunkedLoading: true
            });

            
            ///// 0 -> 4717
            response.forEach(item => {
                console.log("item", item.depName)
                // const nom_dep = item.departement.split(",")[1]?.toString().trim() ? item.departement.split(",")[1]?.toString().trim() : "unknow";
                // const departementName = item.departementName ? item.departementName : "unknow";
                const departementName = item.depName
                // @Route("ferme/departement/{nom_dep}/{id_dep}/details/{id_ferme}" , name="detail_ferme" , methods="GET" )
                var pathDetails = "/restaurant/departement/" + departementName + "/" + item.dep + "/details/" + item.id;
			
                const adresseRestaurant = `${item.numvoie} ${item.typevoie} ${item.nomvoie} ${item.codpost} ${item.villenorm}`
                const adress = "<br><span class='fw-bolder'> Adresse:</span> <br>" + adresseRestaurant;
                // const link = "<br><a href='"+ pathDetails + "'> VOIR DETAILS </a>";

                var title = "<span class='fw-bolder'> Restaurant:</span>  " + item.denominationF + ".<span class='fw-bolder'><br> Departement:</span>  " + departementName + "." + adress;
              
                var marker = L.marker(L.latLng(parseFloat(item.poiY), parseFloat(item.poiX)), { icon: setIcon('assets/icon/NewIcons/icon-resto-new-B.png') });
					 
                marker.bindTooltip(title, { direction: "top", offset: L.point(0, -30) }).openTooltip();
                marker.on('click', (e) => {
                    console.log(e)
                    const coordAndZoom = {
                        zoom: e.target.__parent._zoom+1,
                        coord:e.target.__parent._cLatLng
                    }
                    setDataInLocalStorage("coord", JSON.stringify(coordAndZoom))
                    
                });
                    
                markers.addLayer(marker);
            });
                
            map.addLayer(markers);
            map.on("zoom", (e) => {
                setDataInLocalStorage("zoom", e.target._zoom)
            })
        });
        
    });
    
});