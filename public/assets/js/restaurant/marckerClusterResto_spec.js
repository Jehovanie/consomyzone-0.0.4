
const content_data = document.querySelector('.resto_specifique_dep_js_jheo');
const id_dep= content_data.getAttribute("data-resto-codeDep");
const dep_name= content_data.getAttribute("data-resto-nameDep");
const codinsee= content_data.getAttribute("data-resto-codinsee") !== "null" ? content_data.getAttribute("data-resto-codinsee") : null;

////INSTANCE ///
const OBJECT_MARKERS_RESTO= new MarckerClusterResto(dep_name,id_dep, codinsee)
OBJECT_MARKERS_RESTO.onInit(isAddControl=true);