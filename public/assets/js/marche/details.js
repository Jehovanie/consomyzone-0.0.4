/* ------------------------------------------------------------------------------------------------------ */
/* THIS CODE USES THE  INSTANCE  of 'MarckerClusterMarche' CREATED IN FILE marckerClusterMarche_spec.js */
/*--------------------------------------------------------------------------------------------------------*/

function getDetailFromListLeft(nom_dep, id_dep, id_marche) {
	id_marche = parseFloat(id_marche);
	if (OBJECT_MARKERS_MARCHE.checkIsExist(id_marche)) {
		OBJECT_MARKERS_MARCHE.clickOnMarker(id_marche);
	} else {
		OBJECT_MARKERS_MARCHE.fetchOneData(id_marche);
	}

	if (screen.width < 991) {
		console.log(document.querySelector(`#list-tomm-js`));
		document
			.querySelector(`#list-tomm-js`)
			.classList.add("modal-body", "container-avis", "all_avis_jheo_js", `all_avis_${id_marche}_jheo_js`);
	}
}
