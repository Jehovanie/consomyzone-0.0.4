//// check screen to add the screen filter. ////
checkScreen();

//// set type use if the user wants to search one.
setDataInLocalStorage("type", "station");

////INSTANCE ///
const OBJECT_MARKERS_STATION= new MarckerClusterStation(0,2.5,"tous")
OBJECT_MARKERS_STATION.onInit();
