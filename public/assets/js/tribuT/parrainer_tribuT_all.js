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
										<ul class="nav nav-tabs">
											<li class="nav-item nav_item_sub_tribu" onclick="activeOnglet('demand_adhesion', '${tribuTName}')">
												<span class="nav-link nav_link_sub_tribu nav_link_sub_tribu_jheo_js  active nav_demand_adhesion_jheo_js" aria-current="page">
													<span> 
														<i class="fa-solid fa-code-pull-request fa-beat-fade"></i>
														Demande d'adhésion
													</span>
												</span>
											</li>
											<li class="nav-item nav_item_sub_tribu" onclick="activeOnglet('invitation_adherer', '${tribuTName}')">
												<span class="nav-link nav_link_sub_tribu nav_link_sub_tribu_jheo_js nav_invitation_adherer_jheo_js" aria-current="page">
													<span> 
														<i class="fa-solid fa-users-viewfinder fa-beat-fade"></i>
														Invitation d'adhésion
													</span>
												</span>
											</li>
											<li class="nav-item nav_item_sub_tribu" onclick="activeOnglet('parrent_tribuT', '${tribuTName}')">
												<span class="nav-link nav_link_sub_tribu nav_link_sub_tribu_jheo_js nav_parrent_tribuT_jheo_js" aria-current="page">
													<span> 
														<i class="fa-solid fa-sitemap fa-beat-fade"></i>
														Hiérarchie de ma Tribu 
													</span>
												</span>
											</li>
										</ul>
									</div>
								</div>
								<div class="content_list_sub_tribu_jheo_js content_list_demand_adhesion_tribuT_jheo_js">
									<table class="table table-striped" id="list_tribu_parrainer_jheo_js">
										<thead>
											<tr>
												<th class="text-center" scope="col">Image</th>
												<th class="text-center" scope="col">A propos </th>
												<th class="text-center" scope="col">Fondateur</th>
												<th class="text-center" scope="col">Action</th>
											</tr>
										</thead>
										<tbody class="mt-2 content_list_sub_tribuT">
											${current_list_html_parrainer}
										</tbody>
									</table>
								</div>
								<div class="d-none content_list_sub_tribu_jheo_js content_list_invitation_adherer_tribuT_jheo_js">
									<table class="table table-striped" id="list_invitation_parrainer_jheo_js">
										<thead>
											<tr>
												<th class="text-center" scope="col">Image</th>
												<th class="text-center" scope="col">A propos </th>
												<th class="text-center" scope="col">Fondateur</th>
												<th class="text-center" scope="col">Action</th>
											</tr>
										</thead>
										<tbody class="mt-2 content_list_sub_tribuT content_list_invitation_parrainer_jheo_js">
											<tr>
												<td colspan="4">
													<div class="spinner-border spinner-border-sm text-info d-block mx-auto" role="status">
														<span class="visually-hidden">Loading...</span>
													</div>
												</td>
											</tr>
										</tbody>
									</table>
								</div>
								<div class="d-none content_list_sub_tribu_jheo_js content_list_parrent_tribuT_tribuT_jheo_js">
									<ul class="list-group list-group-flush mt-2 content_list_hierarchy_tribu_jheo_js">
										<div class="spinner-border spinner-border-sm text-info d-block mx-auto" role="status">
											<span class="visually-hidden">Loading...</span>
										</div>
									</ul>
								</div>
							</div>
						</div>
					`;

					tribuTContainer.innerHTML = body;

					$.fn.dataTable.ext.errMode = "throw";
					$("#list_tribu_parrainer_jheo_js").DataTable({
						language: {
							url: "//cdn.datatables.net/plug-ins/1.13.4/i18n/fr-FR.json",
						},
					});
				});
		});
	}
}

/**
 * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
 *
 * Goal: Active link on nav tribu T adhession
 *
 * @param {string} action_type
 * @param {string} table_name
 * @returns
 */
function activeOnglet(action_type, table_name) {
	const nav_action_type = document.querySelector(`.nav_${action_type}_jheo_js`);
	const content_list_action_type = document.querySelector(`.content_list_${action_type}_tribuT_jheo_js`);

	if (!nav_action_type || !content_list_action_type) {
		console.log(`Selector not found: .nav_${action_type}_jheo_js`);
		console.log(`Selector not found: .content_list_${action_type}_tribuT_jheo_js`);
		return;
	}

	const all_nav_link_sub_tribu = document.querySelectorAll(".nav_link_sub_tribu_jheo_js");
	const all_content_list_sub_tribu = document.querySelectorAll(".content_list_sub_tribu_jheo_js");

	all_nav_link_sub_tribu.forEach((item_nav_link) => {
		if (item_nav_link.classList.contains("active")) {
			item_nav_link.classList.remove("active");
		}
	});

	all_content_list_sub_tribu.forEach((item_content_list_sub) => {
		if (!item_content_list_sub.classList.contains("d-none")) {
			item_content_list_sub.classList.add("d-none");
		}
	});

	if (!nav_action_type.classList.contains("active")) {
		nav_action_type.classList.add("active");
	}

	if (content_list_action_type.classList.contains("d-none")) {
		content_list_action_type.classList.remove("d-none");
	}

	if (action_type === "invitation_adherer") {
		fetchListInvitationParrainer(table_name);
	} else if (action_type === "parrent_tribuT") {
		fetchParentHierachyParrainer(table_name);
	}
}

function fetchListInvitationParrainer(tribuTName) {
	if (document.querySelector(".content_list_invitation_parrainer_jheo_js")) {
		const content_list = document.querySelector(".content_list_invitation_parrainer_jheo_js");
		content_list.innerHTML = `
			<td colspan="4">
				<div class="spinner-border spinner-border-sm text-info d-block mx-auto" role="status">
					<span class="visually-hidden">Loading...</span>
				</div>
			</td>
		`;
	}

	const url = `/tributT/listInvitationParrainer/${tribuTName}`;
	fetch(url)
		.then((response) => response.json())
		.then((response) => {
			const { all_invitation_parrainer_tribuT } = response;

			const current_list_html_invitation_parrainer = generateListHtmlInvitationTParrainer(
				all_invitation_parrainer_tribuT,
				tribuTName
			);

			if (document.querySelector(".content_list_invitation_parrainer_jheo_js")) {
				const content_list = document.querySelector(".content_list_invitation_parrainer_jheo_js");
				content_list.innerHTML = current_list_html_invitation_parrainer;
			}

			$("#list_invitation_parrainer_jheo_js").DataTable({
				language: {
					url: "//cdn.datatables.net/plug-ins/1.13.4/i18n/fr-FR.json",
				},
			});
		});
}

function fetchParentHierachyParrainer(tribuTName) {
	if (document.querySelector(".content_list_hierarchy_tribu_jheo_js")) {
		const content_list = document.querySelector(".content_list_hierarchy_tribu_jheo_js");
		content_list.innerHTML = `
			<div class="spinner-border spinner-border-sm text-info d-block mx-auto" role="status">
				<span class="visually-hidden">Loading...</span>
			</div>
		`;
	}
	const url = `/tributT/listHierarchyTribu/${tribuTName}`;
	fetch(url)
		.then((response) => response.json())
		.then((response) => {
			const { hierarchical_tribu_t } = response;

			const current_html_parent_tribuT = generateHierarchicalTribuT(hierarchical_tribu_t);

			if (document.querySelector(".content_list_hierarchy_tribu_jheo_js")) {
				const content_list = document.querySelector(".content_list_hierarchy_tribu_jheo_js");
				content_list.innerHTML = current_html_parent_tribuT;
			}
		});
}
/**
 * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
 *
 * Goal: Generate list html for tribu T parrainer
 *
 * @param {*} list_tribu_parrainer
 * @param {*} table_name_current
 * @returns
 */
function generateListHtmlTribuTParrainer(list_tribu_parrainer, table_name_current) {
	if (list_tribu_parrainer.length === 0) {
		const none_tribuT_parrainer = `
			<tr>
				<td colspan="4">
					<div class="alert alert-danger text-center" role="alert">
						Il n'y a pas de tribu T peuvent vous parainner.
					</div>
				</td>
			</tr>
		`;
		return none_tribuT_parrainer;
	}
	let list_html_tribuT_parrainer = "";

	let isHaveRequestAcceptOrPedding = list_tribu_parrainer.some(
		({ status }) => parseInt(status) === 1 || parseInt(status) === 0
	);

	list_tribu_parrainer.forEach((item_tribut_futur_parrain) => {
		const item_html_tribuT_parrainer = generateItemHtmlTribuTParrainer(
			item_tribut_futur_parrain,
			table_name_current,
			isHaveRequestAcceptOrPedding
		);
		list_html_tribuT_parrainer += item_html_tribuT_parrainer;
	});

	return list_html_tribuT_parrainer;
}

/**
 * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
 *
 * Goal: Generate item list html for tribu T parrainer
 *
 * @param {*} tribu_futur_parrain
 * @param {*} table_tribu_current
 * @param {*} isHaveRequestAcceptOrPedding
 * @returns
 */
function generateItemHtmlTribuTParrainer(
	tribu_futur_parrain,
	table_tribu_current,
	isHaveRequestAcceptOrPedding = false
) {
	const { name, description, avatar, table_name, fondateur, status } = tribu_futur_parrain;
	const { pseudo, fullname } = fondateur;

	let photo_avatar = avatar != "" ? avatar : "/uploads/tribu_t/photo/avatar_tribu.jpg";
	photo_avatar = IS_DEV_MODE ? photo_avatar : `/public/${photo_avatar}`;

	///get btn action
	let btn_action = getBtnStateAction(tribu_futur_parrain, table_tribu_current, isHaveRequestAcceptOrPedding);

	const item_html_tribuT_parrainer_tr = `
		<tr>
			<th>
				<div class="col-auto">
					<img class="img50_50" src="${photo_avatar}" class="width-90 rounded-3" alt="tribuT">
				</div>
			</th>
			<td>
				<div class="col">
					<div class="overflow-hidden flex-nowrap">
						<h6 class="mb-1 d-inline-block ">
							${name}
						</h6>
						<span class="text-muted d-block small">
							${description}
						</span>
					</div>
				</div>
			</td>

			<td>
				<strong>${pseudo}</strong>
			</td>
			<td>
				<div class="content_cta_action_parrainer_jheo_js cta_parrainer_${table_name}_jheo_js d-flex justify-content-end align-items-center">
					${btn_action}
				</div>
			</td>
		</tr>
	`;
	return item_html_tribuT_parrainer_tr;
}

/**
 * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
 *
 * Goal: Generate btn action for the adhesion request sub tribu
 *
 * @param {*} tribu_futur_parrain
 * @param {*} table_tribu_current : Name current table tribu T
 * @param {*} isHaveRequestAcceptOrPedding : Name current table tribu T
 *
 *
 * @returns
 */
function getBtnStateAction(tribu_futur_parrain, table_tribu_current, isHaveRequestAcceptOrPedding = false) {
	const { table_name, status } = tribu_futur_parrain;

	let btn_action = "";

	if (status === 0) {
		btn_action = `
			<button type="button"
				class="btn btn-info btn-sm text-white me-1 cta_request_${table_name}_jheo_js"
			>
				<i class="fa-solid fa-hourglass-half fa-spin"></i>
				Demande envoyée
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
				Demande acceptée
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
				Demande rejetée
			</button>
		`;
	} else {
		if (!isHaveRequestAcceptOrPedding) {
			btn_action = `
				<button type="button"
					class="btn btn-primary btn-sm cta_request_parrainer_jheo_js cta_request_${table_name}_jheo_js"
					onclick="ctaRequestTribuParrainer('${table_name}', '${table_tribu_current}')"
				>
					Envoyer une demande parrainer
				</button>
			`;
		} else {
			btn_action = `
				<button type="button"
					class="btn btn-secondary btn-sm cta_request_parrainer_jheo_js cta_request_${table_name}_jheo_js"
					onclick="ctaRequestTribuParrainer('${table_name}', '${table_tribu_current}')"
				>
					Envoyer une demande parrainer
				</button>
			`;
		}
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
		Action en cours...
	`;

	cta_request.setAttribute("disabled", true);

	const all_content_btn = document.querySelectorAll(".content_cta_action_parrainer_jheo_js");
	all_content_btn.forEach((item_content_btn) => {
		if (!item_content_btn.classList.contains(`cta_parrainer_${table_tribu_futur_parrain}_jheo_js`)) {
			const btn_action = item_content_btn.querySelector(`.cta_request_parrainer_jheo_js`);
			if (btn_action.classList.contains("btn-primary")) {
				btn_action.classList.remove("btn-primary");
				btn_action.classList.add("btn-secondary");

				btn_action.setAttribute("disabled", false);
			}
		}
	});

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

function updateStateActionBtn(list_tribu_parrainer, table_tribu_current) {
	let isHaveRequestAcceptOrPedding = list_tribu_parrainer.some(
		({ status }) => parseInt(status) === 1 || parseInt(status) === 0
	);

	list_tribu_parrainer.forEach((item_tribut_futur_parrain) => {
		const { table_name } = item_tribut_futur_parrain;

		///get btn action
		let btn_action = getBtnStateAction(
			item_tribut_futur_parrain,
			table_tribu_current,
			isHaveRequestAcceptOrPedding
		);

		if (document.querySelector(`.cta_parrainer_${table_name}_jheo_js`)) {
			document.querySelector(`.cta_parrainer_${table_name}_jheo_js`).innerHTML = btn_action;
		}
	});
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

			const all_content_btn = document.querySelectorAll(".content_cta_action_parrainer_jheo_js");
			all_content_btn.forEach((item_content_btn) => {
				if (!item_content_btn.classList.contains(`cta_parrainer_${table_tribu_futur_parrain}_jheo_js`)) {
					const btn_action = item_content_btn.querySelector(`.cta_request_parrainer_jheo_js`);
					if (btn_action.classList.contains("btn-secondary")) {
						btn_action.classList.remove("btn-secondary");
						btn_action.classList.add("btn-primary");

						btn_action.removeAttribute("disabled");
					}
				}
			});
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

function generateListHtmlInvitationTParrainer(list_tribu_invitation_parrainer, table_name_current) {
	if (list_tribu_invitation_parrainer.length === 0) {
		const none_invitation_parrainer = `
			<tr>
				<td colspan="4">
					<div class="alert alert-danger text-center" role="alert">
						Vous n'avez pas demande de sous tribu T.
					</div>
				</td>
			</tr>
		`;

		return none_invitation_parrainer;
	}

	let list_html_tribuT_invitation_parrainer = "";

	list_tribu_invitation_parrainer.forEach((item_tribut_invitation_parrain) => {
		const item_html_tribuT_parrainer = generateItemHtmlTribuTInvitationParrainer(
			item_tribut_invitation_parrain,
			table_name_current
		);
		list_html_tribuT_invitation_parrainer += item_html_tribuT_parrainer;
	});

	return list_html_tribuT_invitation_parrainer;
}

function generateItemHtmlTribuTInvitationParrainer(tribu_futur_sous_tribut, table_tribu_current) {
	const { status, datetime, tribu } = tribu_futur_sous_tribut;
	const { name, description, avatar, table_name, fondateur } = tribu;
	const { pseudo, fullname } = fondateur;

	let photo_avatar = avatar != "" ? avatar : "/uploads/tribu_t/photo/avatar_tribu.jpg";
	photo_avatar = IS_DEV_MODE ? photo_avatar : `/public/${photo_avatar}`;

	let btn_action = getBtnStateActionInvitation({ table_name, status }, table_tribu_current);

	const item_html_invitation_tribuT_tr = `
		<tr>
			<th>
				<div class="col-auto">
					<img class="img50_50" src="${photo_avatar}" class="width-90 rounded-3" alt="tribuT">
				</div>
			</th>
			<td>
				<div class="col">
					<div class="overflow-hidden flex-nowrap">
						<h6 class="mb-1 d-inline-block ">
							${name}
						</h6>
						<span class="text-muted d-block small">
							${description}
						</span>
					</div>
				</div>
			</td>

			<td>
				<strong>${pseudo}</strong>
			</td>
			<td>
				<div class="content_cta_action_parrainer d-flex justify-content-end align-items-center">
					${btn_action}
				</div>
			</td>
		</tr>
	`;

	return item_html_invitation_tribuT_tr;
}

function getBtnStateActionInvitation(tribu_futur_sous_tribu, table_tribu_current) {
	const { table_name, status } = tribu_futur_sous_tribu;

	let btn_action = "";

	if (parseInt(status) === 0) {
		btn_action = `
			<button type="button"
				class="btn btn-primary btn-sm text-white me-1 cta_invitation_${table_name}_jheo_js"
				onclick="ctaAcceptInvitationSousTribu('${table_name}', '${table_tribu_current}')"
			>
				<i class="fa-solid fa-check"></i>
				Accepter la demande
			</button>
			<button type="button"
				class="btn btn-danger btn-sm cta_reject_invitation_${table_name}_jheo_js"
				onclick="ctaRejectInvitationSousTribu('${table_name}', '${table_tribu_current}')"
			>
				<i class="fa-solid fa-ban"></i>
				Refuser
			</button>
		`;
	} else if (parseInt(status) === 1) {
		btn_action = `
			<button type="button"
				class="btn btn-info btn-sm text-white me-1 cta_request_${table_name}_jheo_js"
			>
				<i class="fa-solid fa-check"></i>
				Demande acceptée
			</button>
		`;
	} else if (parseInt(status) === -1) {
		btn_action = `
			<button type="button"
				class="btn btn-secondary btn-sm text-white me-1 cta_request_${table_name}_jheo_js"
			>
				<i class="fa-solid fa-ban"></i>
				Demander rejetée
			</button>
		`;
	}

	return btn_action;
}

function ctaAcceptInvitationSousTribu(table_futur_sous_tribu, table_tribu_current) {
	if (!document.querySelector(`.cta_invitation_${table_futur_sous_tribu}_jheo_js`)) {
		return false;
	}

	const cta_invitation = document.querySelector(`.cta_invitation_${table_futur_sous_tribu}_jheo_js`);
	cta_invitation.innerHTML = `
		<i class="fa-solid fa-spinner fa-spin"></i>
		Action en cours...
	`;

	cta_invitation.setAttribute("disabled", true);

	const url = `/tributT/response_invitation_sous_tribu`;
	const request = new Request(url, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			table_futur_sous_tribu,
			table_tribu_current,
			action: "accept",
		}),
	});

	fetch(request)
		.then((response) => {
			if (response.status === 401) {
				const parent_cta_invitation = cta_invitation.parentElement;
				parent_cta_invitation.innerHTML = unhautorizedResult();
				throw new Error("Unhautorized");
			}
			return response.json();
		})
		.then((response) => {
			const { futur_sous_tribu, table_tribu_current } = response;
			const { table_name, status } = futur_sous_tribu;

			const parent_cta_invitation = cta_invitation.parentElement;

			let btn_action = getBtnStateActionInvitation({ table_name, status }, table_tribu_current);

			parent_cta_invitation.innerHTML = btn_action;
		})
		.catch((error) => console.log(error));
}

function ctaRejectInvitationSousTribu(table_futur_sous_tribu, table_tribu_current) {
	if (!document.querySelector(`.cta_reject_invitation_${table_futur_sous_tribu}_jheo_js`)) {
		console.log(`Selector not found: .cta_reject_invitation_${table_futur_sous_tribu}_jheo_js`);
		return false;
	}

	const cta_reject_invitation = document.querySelector(`.cta_reject_invitation_${table_futur_sous_tribu}_jheo_js`);
	cta_reject_invitation.innerHTML = `
		<i class="fa-solid fa-spinner fa-spin"></i>
		Action en cours...
	`;

	cta_reject_invitation.setAttribute("disabled", true);

	const url = `/tributT/response_invitation_sous_tribu`;

	const request = new Request(url, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			table_futur_sous_tribu,
			table_tribu_current,
			action: "reject",
		}),
	});
	fetch(request)
		.then((response) => {
			if (response.status === 401) {
				const parent_cta_reject_invitation = cta_reject_invitation.parentElement;
				parent_cta_reject_invitation.innerHTML = unhautorizedResult();
				throw new Error("Unhautorized");
			}
			return response.json();
		})
		.then((response) => {
			const { futur_sous_tribu, table_tribu_current } = response;
			const { table_name, status } = futur_sous_tribu;

			const parent_cta_reject_invitation = cta_reject_invitation.parentElement;

			let btn_action = getBtnStateActionInvitation({ table_name, status }, table_tribu_current);

			parent_cta_reject_invitation.innerHTML = btn_action;
		})
		.catch((error) => console.log(error));
}

function generateHierarchicalTribuT(list_hierarchical_tribuT) {
	if (list_hierarchical_tribuT.length === 0) {
		const none_invitation_parrainer = `
					<li class="list-group-item">
						<div class="alert alert-danger text-center" role="alert">
							Vous n'avez pas de Tribut Parent.
						</div>
					</li>
				`;

		return none_invitation_parrainer;
	}

	return generateItemHierarchical(list_hierarchical_tribuT);
}

function generateItemHierarchical(list_hierarchical) {
	let fist_element = list_hierarchical.shift();

	const { name, description, avatar, fondateur } = fist_element;
	const { pseudo, fullname } = fondateur;

	let photo_avatar = avatar != "" ? avatar : "/uploads/tribu_t/photo/avatar_tribu.jpg";
	photo_avatar = IS_DEV_MODE ? photo_avatar : `/public/${photo_avatar}`;

	let item_hierarchical_tribuT = `
			<div class="d-flex align-items-center">
				<div class="col-xl-12">
					<div class="mt-2">
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
					</div>
				</div>
			</div>
	`;

	if (list_hierarchical.length === 0) {
		return `
			<ul class='wtree mt-2'>
				<li class="card card-body">
					${item_hierarchical_tribuT}
					<ul></ul>
				</li>
			</ul>

		`;
	}

	return `
		<ul class='wtree mt-2'>
			<li class="card card-body">
				${item_hierarchical_tribuT}
				${generateItemHierarchical(list_hierarchical)}
			</li>
		</ul>
	`;
}
