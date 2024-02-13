const parsedUrl_current = new URL(window.location.href);

const id_dep = parsedUrl_current.searchParams.get("id_dep");
const dep_name = parsedUrl_current.searchParams.get("nom_dep");

////INSTANCE ///
const OBJECT_MARKERS_MARCHE = new MarckerClusterMarche(dep_name, id_dep);
OBJECT_MARKERS_MARCHE.onInit((isAddControl = true));
