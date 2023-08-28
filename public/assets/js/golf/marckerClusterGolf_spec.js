const id_dep= document.querySelector('#all_golf_in_dep').getAttribute("data-toggle-id-dep")
const dep_name= document.querySelector('#all_golf_in_dep').getAttribute("data-toggle-dep-name")
////INSTANCE ///
const OBJECT_MARKERS_GOLF= new MarckerClusterGolf(dep_name,id_dep)
OBJECT_MARKERS_GOLF.onInit(isAddControl= true);
