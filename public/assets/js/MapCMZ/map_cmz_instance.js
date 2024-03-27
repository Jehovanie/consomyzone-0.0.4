const MAP_CMZ = new RubriqueCMZ();

MAP_CMZ.initMap();

function updateGeoJsonAdd(couche, index) {
	MAP_CMZ.updateGeoJson(couche, index);
}

function removeSpecGeoJson(couche, index) {
	MAP_CMZ.removeSpecGeoJson(couche, index);
}
