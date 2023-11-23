/* ------------------------------------------------------------------------------------------------------ */
/* THIS CODE USES THE  INSTANCE  of 'MarckerClusterFerme' CREATED IN FILE marckerClusterStation_spec.js */
/*--------------------------------------------------------------------------------------------------------*/

function getDetailFromListLeft(nom_dep, id_dep, id_ferme) {
   
    if (OBJECT_MARKERS_FERME.checkIsExist(id_ferme)) {
        OBJECT_MARKERS_FERME.clickOnMarker(id_ferme)
    }
}


