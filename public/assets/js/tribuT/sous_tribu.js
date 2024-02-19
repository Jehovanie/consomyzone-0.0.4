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
			tribuTContainer.innerHTML = `
				<div class="spinner-grow text-info d-block mx-auto" role="status">
					<span class="visually-hidden">Loading...</span>
				</div>
			`;

			const url = `/tributT/mes_sous_tribu/${tribuTName}`;

			fetch(url)
				.then((response) => response.json())
				.then((response) => {
					const { list_sub_tribuT } = response;
					console.log(list_sub_tribuT);

					const current_list_html_sub_tribuT = generateListHtmlSubTribuT(list_sub_tribuT);

					const body = `
						<div class="card">
							<div class="card-body content_sous_tribu">
								<div class="content_entete mb-2">
									<div class="d-flex justify-content-between align-items-center">
										<div class="title">
											Liste de mes sous tribu T
										</div>
										<div class="btn_cta_create_subtribu">
											<button type="button" 
												class="btn btn-primary text-white" 
												data-bs-toggle="modal" 
												data-bs-target="#ModalCreationTribuT"
												onclick="setTableParent('${tribuTName}')"
											>
												<i class="fa-solid fa-plus fa-beat-fade"></i>
												Créer un sous tribu
											</button>
										</div>
									</div>
								</div>
								<hr />
								<ul class="list-group list-group-flush mt-2 content_list_sub_tribuT">
									${current_list_html_sub_tribuT}
								</ul>
							</div>
						</div>
					`;

					tribuTContainer.innerHTML = body;
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
			<li class="list-group-item">
				<div class="alert alert-danger text-center" role="alert">
					Vous n'avez pas encore un sous tribu sur cette tribu T
				</div>
			</li>
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

	const item_html_sub_tribuT = `
		<li class="list-group-item">
			<div class="col-xl-12">
				<div class="mt-2">
					<div class="row align-items-center">
						<div class="col-auto">
							<a href="${link_to_navigate}">
								<img class="img50_50" src="${photo_avatar}" class="width-90 rounded-3" alt="tribuT">
							</a>
						</div>
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
					</div>
				</div>
			</div>
		</li>
	`;
	return item_html_sub_tribuT;
}
