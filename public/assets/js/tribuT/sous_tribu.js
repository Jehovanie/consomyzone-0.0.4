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

			const url = `/tributT/mes_sous_tribu`;

			fetch(url)
				.then((response) => response.json())
				.then((response) => {
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
								<ul class="list-group list-group-flush mt-2" >
									

									<li class="list-group-item">
										<div class="alert alert-danger text-center" role="alert">
											Vous n'avez pas encore un sous tribu sur cette tribu T
										</div>
									</li>

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
