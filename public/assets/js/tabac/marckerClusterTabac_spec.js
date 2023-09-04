const id_dep= document.querySelector('#all_tabac_in_dep').getAttribute("data-toggle-id-dep")
const dep_name= document.querySelector('#all_tabac_in_dep').getAttribute("data-toggle-dep-name")
////INSTANCE ///
const OBJECT_MARKERS_TABAC= new MarckerClusterTabac(dep_name,id_dep)
OBJECT_MARKERS_TABAC.onInit(isAddControl=true);



