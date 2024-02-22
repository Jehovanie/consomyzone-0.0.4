function bindActionTribuTParrainer(tribuTName) {
	if (document.querySelector("#action_tribuT_parrainer_jheo_js")) {
		const callActionTribuParrainer = document.querySelector("#action_tribuT_parrainer_jheo_js");
		const tribuTContainer = document.querySelector("#tribu_t_conteuneur");

		callActionTribuParrainer.addEventListener("click", (e) => {
			e.preventDefault();

			/// content list navbar
			const content_navbar_tribuT = document.querySelector(".content_list_navBarTribuT_jheo_js");

			/// remove active for all link
			const all_list_items = content_navbar_tribuT.querySelectorAll(".listNavBarTribu");
			all_list_items.forEach((element) => {
				if (element.querySelector("a").classList.contains("active")) {
					element.querySelector("a").classList.remove("active");
				}
			});
			/// active link newletter
			callActionTribuParrainer.classList.add("active");

			/// show loading indicator
			tribuTContainer.innerHTML = `
				<div class="spinner-grow text-info d-block mx-auto" role="status">
					<span class="visually-hidden">Loading...</span>
				</div>
			`;

			const url = `/tributT/listTribuParrainer/${tribuTName}`;

			fetch(url)
				.then((response) => response.json())
				.then((response) => {
					const { list_tribu_parrainer } = response;

					const current_list_html_parrainer = generateListHtmlTribuTParrainer(
						list_tribu_parrainer,
						tribuTName
					);

					const body = `
						<div class="card">
							<div class="card-body content_sous_tribu">
								<div class="content_entete mb-2">
									<div class="d-flex justify-content-between align-items-center">
										<div>
											<h3> 
												<i class="fa-solid fa-code-pull-request fa-beat-fade"></i>
												Démande de parain Tribu T 
											</h3>
										</div>
									</div>
								</div>
								<hr />
								<ul class="list-group list-group-flush mt-2 content_list_sub_tribuT content_list_sub_tribuT_jheo_js">
									${current_list_html_parrainer}
								</ul>
							</div>
						</div>
					`;

					tribuTContainer.innerHTML = body;
				});
		});
	}
}

function generateListHtmlTribuTParrainer(list_tribu_parrainer, table_name_current) {
	if (list_tribu_parrainer.length === 0) {
		const none_tribuT_parrainer = `
			<li class="list-group-item">
				<div class="alert alert-danger text-center" role="alert">
					Il n'y a pas de tribu T peuvent vous parainner.
				</div>
			</li>
		`;

		return none_tribuT_parrainer;
	}

	let list_html_tribuT_parrainer = "";

	list_tribu_parrainer.forEach((item_tribut_futur_parrain) => {
		const item_html_tribuT_parrainer = generateItemHtmlTribuTParrainer(
			item_tribut_futur_parrain,
			table_name_current
		);
		list_html_tribuT_parrainer += item_html_tribuT_parrainer;
	});

	return list_html_tribuT_parrainer;
}

function generateItemHtmlTribuTParrainer(tribu_futur_parrain, table_tribu_current) {
	const { name, description, avatar, table_name, fondateur, status } = tribu_futur_parrain;
	const { pseudo, fullname } = fondateur;

	let photo_avatar = avatar != "" ? avatar : "/uploads/tribu_t/photo/avatar_tribu.jpg";
	photo_avatar = IS_DEV_MODE ? photo_avatar : `/public/${photo_avatar}`;

	let btn_action = getBtnStateAction(tribu_futur_parrain, table_tribu_current);

	const item_html_tribuT_parrainer = `
		<li class="list-group-item">
			<div class="col-xl-12">
				<div class="mt-2">
					<div class="d-flex justify-content-between align-items-end">
						<div class="row align-items-center">
							<div class="col-auto">
								<img class="img50_50" src="${photo_avatar}" class="width-90 rounded-3" alt="tribuT">
							</div>
							<div class="col">
								<div class="overflow-hidden flex-nowrap">
									<h6 class="mb-1 d-inline-block ">
										${name}
									</h6>
									<em class="text-muted d-inline-block  text-italic" style="font-size: 0.8rem;">fondé par <strong>${pseudo}</strong> </em>
									<span class="text-muted d-block small">
										${description}
									</span>
									
								</div>
							</div>
						</div>
						<div class="content_cta_action_parrainer d-flex justify-content-end align-items-center">
							${btn_action}
						</div>
					</div>
				</div>
			</div>
		</li>
	`;
	return item_html_tribuT_parrainer;
}

function getBtnStateAction(tribu_futur_parrain, table_tribu_current) {
	const { table_name, status } = tribu_futur_parrain;

	let btn_action = "";

	if (status === 0) {
		btn_action = `
			<button type="button"
				class="btn btn-info btn-sm text-white me-1 cta_request_${table_name}_jheo_js"
			>
				<i class="fa-solid fa-hourglass-half fa-spin"></i>
				Demande envoyer
			</button>
			<button type="button"
				class="btn btn-danger btn-sm cta_cancel_${table_name}_jheo_js"
				onclick="ctaCancelTribuParrainer('${table_name}', '${table_tribu_current}')"
			>
				<i class="fa-solid fa-ban"></i>
				Annuler
			</button>
		`;
	} else if (status === 1) {
		btn_action = `
			<button type="button"
				class="btn btn-warning btn-sm text-white me-1"
			>
				<i class="fa-solid fa-check"></i>
				Demande accepter
			</button>
			<button type="button"
				class="btn btn-danger btn-sm cta_cancel_${table_name}_jheo_js"
				onclick="ctaCancelTribuParrainer('${table_name}', '${table_tribu_current}')"
			>
				<i class="fa-solid fa-ban"></i>
				Annuler
			</button>
		`;
	} else if (status === -1) {
		btn_action = `
			<button type="button"
				class="btn btn-secondary btn-sm text-white me-1"
			>
				<i class="fa-solid fa-circle-xmark"></i>
				Demande rejeter
			</button>
		`;
	} else {
		btn_action = `
			<button type="button"
				class="btn btn-primary btn-sm cta_request_${table_name}_jheo_js"
				onclick="ctaRequestTribuParrainer('${table_name}', '${table_tribu_current}')"
			>
				Envoyer une demande de parainner
			</button>
		`;
	}

	return btn_action;
}

function ctaRequestTribuParrainer(table_tribu_futur_parrain, table_tribu_current) {
	if (!document.querySelector(`.cta_request_${table_tribu_futur_parrain}_jheo_js`)) {
		return false;
	}

	const cta_request = document.querySelector(`.cta_request_${table_tribu_futur_parrain}_jheo_js`);
	cta_request.innerHTML = `
		<i class="fa-solid fa-spinner fa-spin"></i>
		Envoyer de demande de parainner...
	`;

	cta_request.setAttribute("disabled", true);

	const url = `/tributT/request_tribu_parrainer`;
	const request = new Request(url, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			table_tribu_futur_parrain,
			table_tribu_current,
		}),
	});

	fetch(request)
		.then((response) => {
			if (response.status === 401) {
				const parent_cta_request = cta_request.parentElement;
				parent_cta_request.innerHTML = unhautorizedResult();
				throw new Error("Unhautorized");
			}
			return response.json();
		})
		.then((response) => {
			const { tribu_futur_parrain, table_tribu_current } = response;

			const parent_cta_request = cta_request.parentElement;

			let btn_action = getBtnStateAction(tribu_futur_parrain, table_tribu_current);

			parent_cta_request.innerHTML = btn_action;
		})
		.catch((error) => console.log(error));
}

function ctaCancelTribuParrainer(table_tribu_futur_parrain, table_tribu_current) {
	if (!document.querySelector(`.cta_cancel_${table_tribu_futur_parrain}_jheo_js`)) {
		return false;
	}

	const cta_cancel_ = document.querySelector(`.cta_cancel_${table_tribu_futur_parrain}_jheo_js`);
	cta_cancel_.innerHTML = `
		<i class="fa-solid fa-spinner fa-spin"></i>
		Annulation...
	`;

	cta_cancel_.setAttribute("disabled", true);

	const url = `/tributT/cancel_tribu_parrainer`;
	const request = new Request(url, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			table_tribu_futur_parrain,
			table_tribu_current,
		}),
	});

	fetch(request)
		.then((response) => {
			if (response.status === 401) {
				const parent_cta_cancel = cta_cancel_.parentElement;
				parent_cta_cancel.innerHTML = unhautorizedResult();
				throw new Error("Unhautorized");
			}
			return response.json();
		})
		.then((response) => {
			const { tribu_futur_parrain, table_tribu_current } = response;

			let btn_action = getBtnStateAction(tribu_futur_parrain, table_tribu_current);

			const parent_cta_cancel = cta_cancel_.parentElement;
			parent_cta_cancel.innerHTML = btn_action;
		})
		.catch((error) => console.log(error));
}

function unhautorizedResult() {
	const body = `
		<button type="button"
			class="btn btn-danger btn-sm text-white me-1"
		>
			Vous étés deconnecter, veuilllez reconnecter.
		</button>
	`;
	return body;
}
