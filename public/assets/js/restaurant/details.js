/* ------------------------------------------------------------------------------------------------------ */
/* THIS CODE USES THE  INSTANCE  of 'MarckerClusterResto' CREATED IN FILE marckerClusterResto_spec.js */
/*--------------------------------------------------------------------------------------------------------*/

function getDetailFromListLeft(nom_dep, id_dep, id_resto) {
    id_resto = parseFloat(id_resto);
    if (OBJECT_MARKERS_RESTO.checkIsExist(id_resto)) {
        OBJECT_MARKERS_RESTO.clickOnMarker(id_resto);
	} else {
		OBJECT_MARKERS_RESTO.fetchOneData(id_resto);
    }

    if (screen.width < 991) {
        console.log(document.querySelector(`#list-tomm-js`));
        document
			.querySelector(`#list-tomm-js`)
			.classList.add("modal-body", "container-avis", "all_avis_jheo_js", `all_avis_${id_resto}_jheo_js`);
    }
}
