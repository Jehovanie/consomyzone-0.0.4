window.addEventListener('load', () => {
    const baseApe=document.querySelector("#content").dataset.baseApe
    getAllGeosireneByBeseApe(baseApe)
});

function getAllGeosireneByBeseApe(baseApe) {
    const request = new Request(`/geosirenes/baseape/${baseApe}`, {
        method: "GET",
    });
    fetch(request).then(response => {
        response.json().then(datas => {
            addGeosireneToMap(datas)
        });
    });
}

function addGeosireneToMap(datas) {
    console.log(datas)
    create_map_content();
    if( document.getElementById("content_nombre_result_js_jheo")){
        document.getElementById("content_nombre_result_js_jheo").innerText = datas.length;
    }
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
					maxZoom: 18,
					attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Points &copy 2012 LINZ'
    })
    const centerLatlng = L.latLng(46.227638, 2.213749);
    const map = L.map('map', {center: centerLatlng, zoom: 5, layers: [tiles]});
    const markers = L.markerClusterGroup({ 
						chunkedLoading: true
    });
    datas.forEach(data => {
        const iconCustom = L.icon({
            //  iconUrl: `/public/assets/icon/${data.activitePrincipaleEtablissement}-bleu.png`, /// on prod 
             iconUrl: `/assets/icon/${data.activitePrincipaleEtablissement}-bleu.png`, ///on dev
             iconSize:     [45, 45], // size of the icon
             iconAnchor: [30, 50],
             popupAnchor: [0, -20],
        })
        var pathDetails = "/detail/geosirene/?nom_dep=" +encodeURIComponent(data.departementName)  + "&id_dep=" + data.departement + "&id_geosirene=" + data.id+ "&geosirenetype="+data.activitePrincipaleEtablissement;
        const activite="<span class='fw-bolder'> Activiter:</span> <br>" + data.labelleActiviteEtablissement;
        const adresse = "<br><span class='fw-bolder'> Adresse:</span> <br>" + data.adresse;
        const title = activite+"</br><span class='fw-bolder'> Denomination:</span>  " + data.denominationGeoscar + ".<span class='fw-bolder'><br> Departement:</span>  "+data.departementName+"." +  adresse;
        const marker = L.marker(L.latLng(parseFloat(data.latitude), parseFloat(data.longitude )), {icon: iconCustom });
		marker.bindTooltip(title,{ direction:"top", offset: L.point(0,-30)}).openTooltip();
        marker.on('click', () => {
           window.location = pathDetails;
       })
       markers.addLayer(marker);
    })
    map.addLayer(markers);
}