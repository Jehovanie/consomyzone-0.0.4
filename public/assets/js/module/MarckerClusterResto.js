class MarckerClusterResto extends MapModule  {
    
    constructor(nom_dep=null,id_dep=null){
        super(id_dep,nom_dep, "resto")
    }

    async onInit(){
        this.ALREADY_INIT = false;
        try{
            this.createMarkersCluster();

            const link =( this.nom_dep && this.id_dep) ? `/ferme/departement/${this.nom_dep}/${this.id_dep}/allFerme` : `/Coord/All/Restaurant`;
            const response= await fetch(link);
            this.default_data= await response.json();
            this.data= this.default_data; 
            
            await this.initMap();

            this.bindAction()
        }catch(e){
            console.log(e)
        }
    }

    createMarkersCluster(){
        const that= this;
        this.markers = L.markerClusterGroup({ 
            chunkedLoading: true,
            iconCreateFunction: function (cluster) {
                if(that.marker_last_selected){
                    let sepcMarmerIsExist = false;
                    for (let g of  cluster.getAllChildMarkers()){
                        if (parseInt(that.marker_last_selected.options.id) === parseInt(g.options.id)) { 
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
            },
        });
    }


    bindAction(){
        this.addMarker(this.data);
        // this.setNumberOfMarker();
        // this.generateAllCard();
    }


    addMarker(newData){
        newData.forEach(item => {

            const departementName = item.depName
            const adresseRestaurant = `${item.numvoie} ${item.typevoie} ${item.nomvoie} ${item.codpost} ${item.villenorm}`

            const adress = "<br><span class='fw-bolder'> Adresse:</span> <br>" + adresseRestaurant;
            const title = "<span class='fw-bolder'> Restaurant:</span>  " + item.denominationF + ".<span class='fw-bolder'><br> Departement:</span>  " + departementName + "." + adress;

            const marker = L.marker(
                L.latLng(parseFloat(item.poiY), parseFloat(item.poiX)),
                {
                    icon: setIconn('assets/icon/NewIcons/icon-resto-new-B.png'),
                    cleNom: item.denominationF,
                    id: item.id
                }
            );

            marker.bindTooltip(title,{ direction: "top", offset: L.point(0, -30)}).openTooltip();

            marker.on('click', (e) => {
                this.updateCenter(e.target.__parent._cLatLng.lat, e.target.__parent._cLatLng.lng, this.zoomDetails);

                const icon_R = L.Icon.extend({
                    options: {
                        iconUrl: IS_DEV_MODE ? url.origin + "/assets/icon/NewIcons/icon-resto-new-Rr.png" : url.origin + "/public/assets/icon/NewIcons/icon-resto-new-Rr.png",
                        iconSize: [32,50],
                        iconAnchor: [11, 30],
                        popupAnchor: [0, -20],
                        shadowSize: [68, 95],
                        shadowAnchor: [22, 94]
                    }
                })
                marker.setIcon(new icon_R);

                if (this.marker_last_selected && this.marker_last_selected != marker ) {
                    const icon_B = L.Icon.extend({
                        options: {
                            iconUrl: IS_DEV_MODE ? url.origin + "/assets/icon/NewIcons/icon-resto-new-B.png" :  url.origin + "/public/assets/icon/NewIcons/icon-resto-new-B.png",
                            iconSize: [32,50],
                            iconAnchor: [11, 30],
                            popupAnchor: [0, -20],
                            //shadowUrl: 'my-icon-shadow.png',
                            shadowSize: [68, 95],
                            shadowAnchor: [22, 94]
                        }
                    })
                    this.marker_last_selected.setIcon(new icon_B)
                }
                this.marker_last_selected = marker;

                this.markers.refreshClusters();

                if (screen.width < 991) {
                    var pathDetails = `/restaurant-mobile/departement/${departementName}/${item.dep}/details/${item.id}`;
                    location.assign(pathDetails)
                } else {
                    getDetailResto(item.dep, item.depName, item.id, false)
                }

            })

            this.markers.addLayer(marker);

        })
        this.map.addLayer(this.markers);
    }
}