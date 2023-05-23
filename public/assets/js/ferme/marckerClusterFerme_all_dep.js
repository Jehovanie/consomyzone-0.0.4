//// set type use if the user wants to search one.
setDataInLocalStorage("type", "ferme");

////INSTANCE ///
const OBJECT_MARKERS_FERME= new MarckerClusterFerme()
OBJECT_MARKERS_FERME.onInit();

/// add list dep for mobile devices
addListFermeMobile()