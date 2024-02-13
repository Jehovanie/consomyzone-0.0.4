// addListFermeMobile()
if (document.querySelector(".close_detail_marche_js_jheo")) {
	document.querySelector(".close_detail_marche_js_jheo").addEventListener("click", () => {
		document.getElementById("remove-detail-marche").classList.add("hidden");
	});
}

if (document.querySelector(".name_marche_js_jheo")) {
	pagginationModule(".content_list_marche_spec_js_jheo", ".name_marche_js_jheo", 10);
}
