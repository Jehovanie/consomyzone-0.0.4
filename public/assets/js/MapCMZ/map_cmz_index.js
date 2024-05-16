if (document.querySelector(".cta_show_list_nav_left_jheo_js")) {
	const cta_show_list_nav_left = document.querySelector(".cta_show_list_nav_left_jheo_js");

	cta_show_list_nav_left.addEventListener("mouseover", () => {
		document.querySelector(".tooltip_show_rubrique_list_jheo_js")?.classList.remove("d-none");
	});

	cta_show_list_nav_left.addEventListener("mouseout", () => {
		document.querySelector(".tooltip_show_rubrique_list_jheo_js")?.classList.add("d-none");
	});
}

const url_object = new URL(window.location.href);
if (url_object.searchParams.has("cles0") && url_object.searchParams.has("cles1")) {
	document.querySelector(".input_search_type_js").value = url_object.searchParams.get("cles0");
	document.querySelector(".input_mots_cle_js").value = url_object.searchParams.get("cles1");
}
