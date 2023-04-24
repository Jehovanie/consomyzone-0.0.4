function addMapFerme(nom_dep=null, id_dep=null){
    const geos = []
    let url;
    if (nom_dep && id_dep ) {
        url = "/getLatitudeLongitudeFerme/?nom_dep=" + nom_dep + "&id_dep=" + id_dep
    }else{
        url = "/getLatitudeLongitudeFerme"
        document.querySelectorAll("#list_departements > ul > li > a > div").forEach(item => {
            const dep = item.dataset.toggleDepartId
            console.log(dep)
            if (dep == 20) {
                for (let corse of ['2A', '2B'])
                    geos.push(franceGeo.features.find(element => element.properties.code == corse))
            } else {
                geos.push(franceGeo.features.find(element => element.properties.code == dep))
            }
            console.log(geos) 
        })
    }
    
    fetch(url)
		.then(result => result.json())
		.then(parsedResult => {
			if( parsedResult ){

                var map=create_map_content(geos,id_dep, "home");
                
				var markers = L.markerClusterGroup({ 
                    chunkedLoading: true
                });

				///// 0 -> 4717
				parsedResult.forEach(item => {
                    // const nom_dep = item.departement.split(",")[1]?.toString().trim() ? item.departement.split(",")[1]?.toString().trim() : "unknow";
                    // const departementName = item.departementName ? item.departementName : "unknow";
                    const departementName = item.departementName
                    const adress = "<br><span class='fw-bolder'> Adresse:</span> <br>" + item.adresseFerme;
                    
                    let title = "<span class='fw-bolder'> Ferme:</span> <br> " + item.nomFerme + ".<span class='fw-bolder'>  Departement:</span> <br> " + item.departement +"." + adress;
                    
					let marker = L.marker(L.latLng(parseFloat(item.latitude), parseFloat(item.longitude )), {icon: setIcon('assets/icon/NewIcons/icon-ferme-new-B.png') });
                    
                    marker.bindTooltip(title,{ direction:"top", offset: L.point(0,-30)}).openTooltip();
                    marker.on('click', (e) => {
                        console.log(e)

                        // @Route("ferme/departement/{nom_dep}/{id_dep}/details/{id_ferme}" , name="detail_ferme" , methods="GET" )
                        let pathDetails =`/ferme/departement/${departementName}/${item.departement}/details/${item.id}`
                
                        const coordAndZoom = {
                            zoom: e.target.__parent._zoom+1,
                            coord:e.target.__parent._cLatLng
                        }
                        setDataInLocalStorage("coordFerme", JSON.stringify(coordAndZoom))

                        let screemMax = window.matchMedia("(max-width: 1000px)")
                        let screemMin = window.matchMedia("(min-width: 1000px)")
                        let remove = document.getElementById("remove-detail-ferme")

                        if (screemMax.matches) {
                            location.assign(pathDetails)
                        } else if (screemMin.matches) {
                            remove.removeAttribute("class", "hidden");
                            remove.setAttribute("class", "navleft-detail fixed-top")
                            var myHeaders = new Headers();
                            myHeaders.append('Content-Type', 'text/plain; charset=UTF-8');
                            fetch(pathDetails, myHeaders)
                                .then(response => {
                                    return response.text()
                                }).then(r => {
                                    document.querySelector("#content-details-ferme").innerHTML = null
                                    document.querySelector("#content-details-ferme").innerHTML = r
                                
                                    document.querySelector("#close-detail-ferme").addEventListener("click", () => {
                                        document.querySelector("#content-details-ferme").style.display = "none"
                                    })
                                    document.querySelector("#content-details-ferme").removeAttribute("style")
                                })
                        }
                        
                    })
                    
					markers.addLayer(marker);
                })

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

                    parsedResult.forEach(new_element => {

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
                        a.innerText = "Voir détails";

                        /// integre dom under the element
                        div_new_element.appendChild(s_p);
                        div_new_element.appendChild(a);
                        
                        ///integre new element in each element.
                        parent_elements.appendChild(div_new_element);
                    })

                }

                map.on("resize zoom", (e) => {
                    console.log(e)
                    const coordAndZoom = {
                        zoom: e.target._zoom,
                        coord:e.target._lastCenter
                    }
                    setDataInLocalStorage("coordFerme", JSON.stringify(coordAndZoom))
                })
                map.on("dragend", (e) => {
                    console.log(e.target.getCenter(), e.target.getZoom())
                    const coordAndZoom = {
                        zoom: e.target.getZoom(),
                        coord:e.target.getCenter()
                    }
                    setDataInLocalStorage("coordFerme", JSON.stringify(coordAndZoom))
                })

			}else{
				console.log("ERREUR : L'erreur se produit par votre réseaux.")
			}
        });
    addListFermeMobile()
}