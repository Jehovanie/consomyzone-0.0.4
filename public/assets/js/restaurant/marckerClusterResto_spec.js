const id_dep= document.querySelector('.resto_specifique_dep_js_jheo').getAttribute("data-resto-codeDep")
const dep_name= document.querySelector('.resto_specifique_dep_js_jheo').getAttribute("data-resto-nameDep")

////INSTANCE ///
const OBJECT_MARKERS_RESTO= new MarckerClusterResto(dep_name,id_dep)
OBJECT_MARKERS_RESTO.onInit(isAddControl=false);