////INSTANCE ///
window.addEventListener("load", () => {
    rmDataInLocalStorage();
    const OBJECT_MARKERS_HOME= new MarckerClusterStation()
    OBJECT_MARKERS_HOME.onInit();
})