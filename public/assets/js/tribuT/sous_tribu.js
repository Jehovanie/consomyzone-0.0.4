function resetInputTableParent() {
	if (document.querySelector("#form_table_parent")) {
		document.querySelector("#form_table_parent").value = null;
	}
}

function bindActionSousTribuT(tribuTName) {
	if (document.querySelector("#fetch_sous_tribuT_jheo_js")) {
		const callActionSousTribu = document.querySelector("#fetch_sous_tribuT_jheo_js");
		const tribuTContainer = document.querySelector("#tribu_t_conteuneur");

		callActionSousTribu.addEventListener("click", (e) => {
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
			callActionSousTribu.classList.add("active");

			/// show loading indicator
			// tribuTContainer.innerHTML = `
			// 	<div class="spinner-grow text-info d-block mx-auto" role="status">
			// 		<span class="visually-hidden">Loading...</span>
			// 	</div>
			// `;

			createChargement(tribuTContainer, "chargement_content_sous_tribu");

			const url = `/tributT/mes_sous_tribu/${tribuTName}`;

			fetch(url)
				.then((response) => response.json())
				.then((response) => {
					const { list_sub_tribuT } = response;

					const current_list_html_sub_tribuT = generateListHtmlSubTribuT(list_sub_tribuT);

					const body = `
						<div class="card">
							<div class="card-body content_sous_tribu">
								<div class="content_entete mb-2">
									<div class="d-flex justify-content-between align-items-center">
										<div class="title">
											Liste de mes sous-tribus T
										</div>
										<div class="btn_cta_create_subtribu me-1">
											<button type="button" 
												class="btn btn-primary text-white" 
												data-bs-toggle="modal" 
												data-bs-target="#ModalCreationTribuT"
												onclick="setTableParent('${tribuTName}')"
											>
												<i class="fa-solid fa-plus fa-beat-fade"></i>
												Créer une sous-tribu
											</button>
										</div>
									</div>
								</div>
								<hr />
								<div class="list-group list-group-flush mt-2 content_list_sub_tribuT">
									<table class="table table-striped" id="content_list_sub_tribuT_jheo_js">
										<thead>
											<tr>
												<th class="text-center" scope="col">Image</th>
												<th class="text-center" scope="col">A propos </th>
											</tr>
										</thead>
										<tbody class="mt-2 content_list_sub_tribuT">
											${current_list_html_sub_tribuT}
										</tbody>
									</table>
								</div>
							</div>
						</div>
					`;

					tribuTContainer.innerHTML = body;

					$.fn.dataTable.ext.errMode = "throw";
					$("#content_list_sub_tribuT_jheo_js").DataTable({
						language: {
							url: "//cdn.datatables.net/plug-ins/1.13.4/i18n/fr-FR.json",
						},
					});
				});
		});
	}
}

function setTableParent(tribuTName) {
	if (document.querySelector("#form_table_parent")) {
		document.querySelector("#form_table_parent").value = tribuTName;
	}
}

function generateListHtmlSubTribuT(listSubTribuT) {
	if (listSubTribuT.length === 0) {
		const none_sub_tribuT = `
			<tr>
				<td colspan="2">
					<div class="alert alert-danger text-center" role="alert">
						Vous n'avez pas encore une sous-tribu sur cette tribu T.
					</div>
				</td>
			</tr>
		`;

		return none_sub_tribuT;
	}

	let list_html_sub_tribuT = "";

	listSubTribuT.forEach((item_sub_tribuT) => {
		const item_html_sub_tribuT = generateItemHtmlSubTribuT(item_sub_tribuT);
		list_html_sub_tribuT += item_html_sub_tribuT;
	});

	return list_html_sub_tribuT;
}

function generateItemHtmlSubTribuT(itemSubTribuT) {
	const { name, description, avatar, table_name, isOwned } = itemSubTribuT;

	let photo_avatar = avatar != "" ? avatar : "/uploads/tribu_t/photo/avatar_tribu.jpg";
	photo_avatar = IS_DEV_MODE ? photo_avatar : `/public/${photo_avatar}`;

	let isOwned_str = isOwned ? "owned" : "joined";
	let link_to_navigate = `/user/tribu/my-tribu-t?type=${isOwned_str}&tribu=${table_name}`;

	const item_html_sub_tribuT_tr = `
		<tr>
			<th>
				<div class="col-auto">
					<a href="${link_to_navigate}">
						<img class="img50_50" src="${photo_avatar}" class="width-90 rounded-3" alt="tribuT">
					</a>
				</div>
			</th>
			<td>
				<div class="col">
					<div class="overflow-hidden flex-nowrap">
						<h6 class="mb-1">
							<a href="${link_to_navigate}" class="link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover">
								${name}
							</a>
						</h6>
						<span class="text-muted d-block mb-2 small">
							${description}
						</span>
					</div>
				</div>
			</td>
		</tr>
	`;

	return item_html_sub_tribuT_tr;
}
