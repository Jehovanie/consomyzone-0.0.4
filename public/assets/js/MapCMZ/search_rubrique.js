const input_search_type = document.querySelector(".input_search_type_js");
const input_mots_cle = document.querySelector(".input_mots_cle_js");
const cta_show_list_nav_left = document.querySelector(".cta_show_list_nav_left_jheo_js");

if (!input_search_type) {
	console.log("ERROR: Selector not found 'input_search_type_js'");
}

if (!input_mots_cle) {
	console.log("ERROR: Selector not found 'input_mots_cle'");
}

if (!cta_show_list_nav_left) {
	console.log("ERROR: Selector not found 'cta_show_list_nav_left_jheo_js'");
}

if (document.querySelector(".form_content_search_navbar_js")) {
	const search_form = document.querySelector(".form_content_search_navbar_js");

	search_form.addEventListener("submit", (e) => {
		const cles0 = document.querySelector(".input_search_type_js").value.trim();
		const cles1 = document.querySelector(".input_mots_cle_js").value.trim();

		if (cles0 === "" && cles1 === "") {
			e.preventDefault();

			new swal("Attention !", "Veuillez renseigner au moins l'adresse!", "error").then((value) => {
				document.querySelector(".input_mots_cle_js").classList.add("border_red");
			});
		} else if (cles1 === "") {
			e.preventDefault();

			new swal("Attention !", "L'adresse est obligatoire!", "error").then((value) => {
				document.querySelector(".input_mots_cle_js").classList.add("border_red");
			});
		}
	});

	const inputs = [document.querySelector(".input_search_type_js"), document.querySelector(".input_mots_cle_js")];
	inputs.forEach((input) => {
		input.addEventListener("input", () => {
			inputs.forEach((item) => {
				if (item.classList.contains("border_red")) {
					item.classList.remove("border_red");
				}
			});
		});
	});
}
