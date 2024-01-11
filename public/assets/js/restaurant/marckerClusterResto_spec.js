const parsedUrl_current = new URL(window.location.href);

const id_dep= parsedUrl_current.searchParams.get("id_dep")
const dep_name= parsedUrl_current.searchParams.get("nom_dep");
const codinsee= parsedUrl_current.searchParams.get("codinsee") ? parsedUrl_current.searchParams.get("codinsee") : null;

////INSTANCE ///
const OBJECT_MARKERS_RESTO= new MarckerClusterResto(dep_name,id_dep, codinsee)
OBJECT_MARKERS_RESTO.onInit(isAddControl=true);