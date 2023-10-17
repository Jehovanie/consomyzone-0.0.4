class MapAdminRestaurant{

    
    constructor(datas,mapElmntContainer,options) {
        this.datas = datas;
        this.markerTab = [];
        this.mapZoom = 6
        this.mapElmntContainer = mapElmntContainer
        this.marker_last_selected=null
        this.options = Object.assign({}, {
            isSpecific: false,
            isAllDep: true,
            idDep: 0
        },options)
        
    }

    initMap(geoJson=null) {
        if (this.map == undefined) {
            this.tiles = L.tileLayer('//{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
                attribution: 'donn&eacute;es &copy; <a href="//osm.org/copyright">OpenStreetMap</a>/ODbL - rendu <a href="//openstreetmap.fr">OSM France</a>',
                minZoom: 1,
                maxZoom: 20
            })
            
            this.centerLatLng = L.latLng(45.729191061299936, 2.4161955097725722);
            let json = getDataInLocalStorage("coordRestos") ? JSON.parse(getDataInLocalStorage("coordRestos")) : null;
            if (this.options.isAllDep) {
                if (json) {
                    this.centerLatLng =json.coord
                    this.mapZoom =json.zoom
                }
               
            } else if (this.options.isSpecific) {
                this.centerLatLng = idDep > 0 ? L.latLng(centers[parseInt(id_dep)].lat, centers[parseInt(id_dep)].lng) : L.latLng(45.729191061299936, 2.4161955097725722);
                this.mapZoom =idDep > 0 ? centers[parseInt(id_dep)].zoom : ( json.zoom ? json.zoom : 6); 
            }
            
            this.map= L.map(this.mapElmntContainer,{center: this.centerLatLng , zoom:  this.mapZoom, layers: [this.tiles]});
            if (geoJson) {
                L.geoJson(geoJson, {
                    style: {
                        //fillColor: getColor(feature.properties.density),
                        weight: 2,
                        opacity: 1,
                        color: 'red',
                        dashArray: '3',
                        fillOpacity: 0
                    }, onEachFeature: function (feature, layer) {
                        layer.bindTooltip(feature.properties.l_ar);
                    }
                }).addTo(this.map);
            }
            this.map.doubleClickZoom.disable()
        }
        return this;
        
    }

    #initMarkerCluster() {
        this.markers = L.markerClusterGroup({
            chunkedLoading: true,
            removeOutsideVisibleBounds: true,
            iconCreateFunction: (cluster)=> {
                if(this.marker_last_selected){
                    let sepcMarmerIsExist = false;
                    for (let g of  cluster.getAllChildMarkers()){
                        if (parseInt(this.marker_last_selected.options.id) === parseInt(g.options.id)) { 
                            sepcMarmerIsExist = true;
                            break;
                        }
                    }

                    if(sepcMarmerIsExist){
                        return L.divIcon({
                            html: '<div class="markers-spec" id="c">' + cluster.getChildCount() + '</div>',
                            className: "spec_cluster",
                            iconSize:L.point(35,35)
                        });
                    }else{
                        return L.divIcon({
                            html: '<div class="markers_tommy_js">' + cluster.getChildCount() + '</div>',
                            className: "mycluster",
                            iconSize:L.point(35,35)
                        });
                    }
                }else{
                    return L.divIcon({
                        html: '<div class="markers_tommy_js">' + cluster.getChildCount() + '</div>',
                        className: "mycluster",
                        iconSize:L.point(35,35)
                    });
                }
            }

        })

    }

    #initMarker(data,title) {
        let marker = L.marker(
            L.latLng(parseFloat(data.poiY), parseFloat(data.poiX)),
            { 
                icon: setIconn('assets/icon/NewIcons/icon-resto-new-B.png'),
                cleNom: data.denominationF,
                id: data.id

            }

        )
         marker.bindTooltip(title, {
            direction: "top",
            offset: L.point(0, -30) 
        }).openTooltip();
        this.markerTab.push(marker)
        this.handleClickOnMarker(marker,data)
        return marker
    }

    #getMax(max,min){
        if(Math.abs(max)<Math.abs(min))
            return {max:min,min:max} 
        else
           return {max:max,min:min}
    }
    renderAllPOI() {
        this.#initMarkerCluster()
        this.handleMapResizeAndMouveEnd()
        for (let data of this.datas) {
            this.#addToMap(data)
             
        }
        this.map.addLayer(this.markers)
    }

    #addToMap(data) {
        const departementName = data.depName
        const adresseRestaurant = `${data.numvoie} ${data.typevoie} ${data.nomvoie} ${data.codpost} ${data.villenorm}`
        const adress = "<br><span class='fw-bolder'> Adresse:</span> <br>" + adresseRestaurant;
        const title = "<span class='fw-bolder'> Restaurant:</span>  " + data.denominationF +
            ".<span class='fw-bolder'><br> Departement:</span>  " + departementName + "." + adress;
        let marker = this.#initMarker(data,title)
        this.markers.addLayer(marker)
    }

    handleClickOnMarker(marker,data) {
        marker.on('click', (e) => {
            console.log(e)
            const latlng = L.latLng(marker._latlng.lat, marker._latlng.lng);
            this.map.setView(latlng, this.mapZoom);
            const url = new URL(window.location.href);
            const icon_R = L.Icon.extend({
                options: {
                    iconUrl: IS_DEV_MODE ? url.origin + "/assets/icon/NewIcons/icon-resto-new-Rr.png" : url.origin + "/public/assets/icon/NewIcons/icon-resto-new-Rr.png",
                    iconSize:[32,52]
                }
            })
            marker.setIcon(new icon_R);

            if (this.marker_last_selected && this.marker_last_selected != marker) {
                const icon_B = L.Icon.extend({
                    options: {
                        iconUrl: IS_DEV_MODE ? url.origin + "/assets/icon/NewIcons/icon-resto-new-B.png" :  url.origin + "/public/assets/icon/NewIcons/icon-resto-new-B.png",
                        iconSize:[32,52]
                    }
                })
                this.marker_last_selected.setIcon(new icon_B)
            }

            this.marker_last_selected = marker

            let screemMax = window.matchMedia("(max-width: 1000px)")
            let screemMin = window.matchMedia("(min-width: 1000px)")
            
            if (screemMax.matches) {

                // const pathDetails = `/restaurant-mobile/departement/${data.depName}/${data.dep}/details/${data.id}`;
                // location.assign(pathDetails)
            } else if (screemMin.matches) {

                let remove = document.getElementById("remove-detail")
                remove.removeAttribute("class", "hidden");
                remove.setAttribute("class", "navleft-detail fixed-top")

                var myHeaders = new Headers();
                myHeaders.append('Content-Type', 'text/plain; charset=UTF-8');

                fetch(`/restaurant/departement/${data.depName}/${data.dep}/details/${data.id}`, myHeaders)
                    .then(response => response.text())
                    .then(r => {
                        document.querySelector("#content-details").innerHTML = null
                        document.querySelector("#content-details").innerHTML = r

                        document.querySelector("#close-detail-tous-resto").addEventListener("click", () => {
                            document.querySelector("#content-details").style.display = "none"
                        })
                        document.querySelector("#content-details").removeAttribute("style")

                    })
            }
            //this.markers.removeLayers(this.markerTab)
            // this.markers.removeLayers(this.markerTab)
            // console.log(this)
            // this.#initMarkerCluster()
            this.markers.refreshClusters();
            // this.markers.addLayer(this.markerTab)
            // this.map.addLayer(this.markers);
            //console.log(this.markers.refreshClusters())  
        })
    }
    loadStufAfterEachMoveEnd() {
        this.map.on("resize moveend", () => { 
            const x=this.#getMax(this.map.getBounds().getWest(),this.map.getBounds().getEast())
            const y=this.#getMax(this.map.getBounds().getNorth(), this.map.getBounds().getSouth())
            var minx = x.min
            var maxx = x.max
            var miny =y.min
            var maxy = y.max
            var cached={
                minx:minx,
                miny:miny,
                maxx:maxx,
                maxy:maxy
            }
            console.log(cached)
             const param="?minx="+encodeURIComponent(minx)+"&miny="+encodeURIComponent(miny) 
            +"&maxx="+encodeURIComponent(maxx)+"&maxy="+encodeURIComponent(maxy)
            fetch(`/restaurant/maxmin${param}`).then(response=>{
                 if(response.status=== 200 && response.ok)
                    response.json().then(json=>{
                        //console.log(json)
                        for (let data of json) {
                            //console.log(data.id)
                            const b=this.datas.some((element)=>{return  element.id === data.id})
                            //console.log(b)
                            if(!b){
                                this.#addToMap(data)
                                this.datas.push(data)
                            }
                            
                        }
                        this.map.addLayer(this.markers);
                    })
            })

        })
    }

    handleMapResizeAndMouveEnd(){
        this.map.on("resize moveend", (e) => { 
           
                this.mapZoom = this.map.getZoom()
                const coordAndZoom = {
                    zoom: e.target._zoom,
                    coord: e.target.getCenter()
                }
                setDataInLocalStorage("coordRestos", JSON.stringify(coordAndZoom))
           
        })
    }

}