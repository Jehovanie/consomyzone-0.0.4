/* ------------------------------------------------------------------------------------------------------ */
/* THIS CODE USES THE  INSTANCE  of 'MarckerClusterResto' CREATED IN FILE marckerClusterResto_spec.js */
/*--------------------------------------------------------------------------------------------------------*/

function getDetailFromListLeft(nom_dep, id_dep, id_resto) {
   
    if(OBJECT_MARKERS_RESTO.checkIsExist(id_resto)){
        OBJECT_MARKERS_RESTO.clickOnMarker(id_resto)
    }
    if (screen.width < 991) {
        document.querySelector(`#list-tomm-js`).setAttribute('class', `modal-body container-avis all_avis_jheo_js all_avis_${id_resto}_jheo_js`)
    }
}
