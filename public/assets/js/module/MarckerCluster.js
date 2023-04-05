class MarckerCluster {

    data_markers = [];
    constructor(){
        this.tiles =  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Points &copy 2012 LINZ'
        })
    }

    setcenter( latitude, longitude, ){
       this.center_lat= latitude;
       this.center_long= longitude;
    }
    setZoom( zoom_value){
        this.zoom= zoom_value;
    }

    bindMap(){
        this.map = L.map('map', { 
            center: L.latLng(this.center_lat,this.center_long),
            zoom: this.zoom,
            layers: [this.tiles]});
    }

    createMarkers(type_config){
        this.markers =  L.markerClusterGroup(type_config);
    }

    singleMarker(lat,long,title,path_icon){
        this.data_markers.push(L.marker(L.latLng(lat, long), { title: title,icon: setIcon(path_icon) }).bindPopup(title));
    }

    prepareMarkers(){
        this.data_markers.forEach(marker => {
            console.log(marker._latlng)
            this.markers.addLayer(marker);
        })
    }

    addToMap(){
        this.map.addLayer(this.markers);
    }

}