////INSTANCE ///
window.addEventListener("load", () => {
    rmDataInLocalStorage();
    const OBJECT_MARKERS_HOME= new MarckerClusterHome()
    OBJECT_MARKERS_HOME.onInit();
})