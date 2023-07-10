const id_dep= document.querySelector('#all_ferme_in_dep').getAttribute("data-toggle-id-dep")
const dep_name= document.querySelector('#all_ferme_in_dep').getAttribute("data-toggle-dep-name")
////INSTANCE ///
const OBJECT_MARKERS_FERME= new MarckerClusterFerme(dep_name,id_dep)
OBJECT_MARKERS_FERME.onInit();