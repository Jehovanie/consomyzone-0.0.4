const MAP_CMZ = new RubriqueCMZ();

MAP_CMZ.initMap();
MAP_CMZ.onInitMarkerCluster();
MAP_CMZ.addCulsterNumberAtablismentPerDep();

function updateGeoJsonAdd(couche, index) {
	MAP_CMZ.updateGeoJson(couche, index);
}

function removeSpecGeoJson(couche, index) {
	MAP_CMZ.removeSpecGeoJson(couche, index);
}
