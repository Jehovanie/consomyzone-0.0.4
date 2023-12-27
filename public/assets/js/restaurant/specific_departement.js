window.addEventListener("load", () => {
	if (screen.width < 991) {
		const id_dep = new URLSearchParams(window.location.href).get("id_dep");
		const nom_dep = new URLSearchParams(window.location.href).get("nom_dep");

		let isArrondissement = parseInt(id_dep) === 75 ? true : false;
		getDataSpecificMobile(nom_dep, parseInt(id_dep), isArrondissement);
	}
});



