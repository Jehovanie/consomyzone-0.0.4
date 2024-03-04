// addListFermeMobile()
if (document.querySelector(".close_detail_marche_js_jheo")) {
	document.querySelector(".close_detail_marche_js_jheo").addEventListener("click", () => {
		document.getElementById("remove-detail-marche").classList.add("hidden");
	});
}

if (document.querySelector(".name_marche_js_jheo")) {
	pagginationModule(".content_list_marche_spec_js_jheo", ".name_marche_js_jheo", 10);
}

function resetDataNewPoiMarche() {
	if (!document.querySelector(".form_new_poi_marche_jheo_js")) {
		console.log("Selector not found: form_new_poi_marche_jheo_js");
		return false;
	}

	const form = document.querySelector(".form_new_poi_marche_jheo_js");

	const all_input_jour_de_marche = form.querySelectorAll(".content_input_jdm_jheo_js");
	if (all_input_jour_de_marche.length > 0) {
		Array.from(all_input_jour_de_marche).forEach((input) => input.remove());
	}

	all_input = Array.from(form.querySelectorAll("input"));

	all_input.forEach((input) => (input.value = null));
}

function addInputJourDeMarche() {
	if (!document.querySelector(".content_input_jour_de_marche_jheo_js")) {
		console.log("Selector not found: content_input_jour_de_marche_jheo_js");
		return false;
	}

	const content_input_jour_de_marche = document.querySelector(".content_input_jour_de_marche_jheo_js");

	const all_input_jour_de_marche = content_input_jour_de_marche.querySelectorAll(".content_input_jdm_jheo_js");
	if (all_input_jour_de_marche.length >= 6) {
		if (!content_input_jour_de_marche.querySelector("#validationServer03Feedback")) {
			content_input_jour_de_marche.innerHTML += `
				<div id="validationServer03Feedback" class="invalid-feedback d-block">
					<i class="fa-solid fa-triangle-exclamation me-1"></i>Vous allez dépasser le nombre de jour. 
				</div>
			`;
		}

		setTimeout(() => {
			if (content_input_jour_de_marche.querySelector("#validationServer03Feedback")) {
				content_input_jour_de_marche.querySelector("#validationServer03Feedback").remove();
			}
		}, 3000);
		return false;
	}

	const input_jour_de_marche = generateInputJourDeMarche();

	content_input_jour_de_marche.appendChild(input_jour_de_marche);
}

function generateInputJourDeMarche() {
	const unique_id = Date.now();

	const input_jour_de_marche = document.querySelectorAll(".content_input_jdm_jheo_js");
	const numero = input_jour_de_marche.length + 2;

	const div_container = document.createElement("div");
	div_container.className = `input-group mb-1 content_input_jdm_jheo_js content_input_jdm_${unique_id}_jheo_js`;

	const inputJourDeMarche = `
		<input type="text" class="form-control" name="jour_de_marche_${numero}" id="new_marche_jour_de_marche_${unique_id}">
		<span class="input-group-text pe-auto cta_remove_input_jour_de_marche_jheo_js" onclick="removeInputJourDeMarche('${unique_id}')">
			<i class="fa-solid fa-trash text-danger"></i>
		</span>
	`;

	div_container.innerHTML = inputJourDeMarche;

	return div_container;
}

function removeInputJourDeMarche(uniqueId_input) {
	if (!document.querySelector(`.content_input_jdm_${uniqueId_input}_jheo_js`)) {
		console.log(`Selector not found: '.content_input_jdm_${uniqueId_input}_jheo_js`);
		return false;
	}

	document.querySelector(`.content_input_jdm_${uniqueId_input}_jheo_js`).remove();
}

function handleSubmitNewPOIMarche() {
	const btn_submit = document.querySelector(".submit_new_poi_marche_jheo_js");
	btn_submit.innerHTML = `
		<i class="fa-solid fa-spinner fa-spin"></i>
		En cours d'envoi...
	`;

	document.querySelector(".btn_close_modal_new_poi_marche_jheo_js").setAttribute("disabled", true);
	document.querySelector(".add_input_jour_de_marche_jheo_js").setAttribute("onclick", () => {});
	Array.from(document.querySelectorAll(".cta_remove_input_jour_de_marche_jheo_js")).forEach((item) =>
		item.setAttribute("onclick", () => {})
	);

	document.querySelector(".cancel_new_poi_marche_jheo_js").setAttribute("disabled", true);

	const data = {};

	const form = document.querySelector(".form_new_poi_marche_jheo_js");

	all_input = Array.from(form.querySelectorAll("input"));
	all_input.forEach((input) => {
		data[input.name] = input.value;
		input.setAttribute("readonly", true);
	});

	console.log(data);
}
