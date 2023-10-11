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
    // else {
    //     if (screen.width < 991) {
    //         var pathDetails = `/restaurant-mobile/departement/${nom_dep}/${id_dep}/details/${id_resto}`;
    //         location.assign(pathDetails)
    //         OBJECT_MARKERS_RESTO.clickOnMarker(id_resto)
    //     } else {
    //         const select_dem = document.querySelector("#open-navleft-resto-spec-mobile-tomm-js")
    //         getDetailResto(id_dep, nom_dep, id_resto, false,select_dem)
    //     }

    //     /// update card and the markers new
    //     OBJECT_MARKERS_RESTO.fetchOneData(id_resto)
    // }
}
