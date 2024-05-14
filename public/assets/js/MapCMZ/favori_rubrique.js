function openCollapseRubriqueFavory(favori_folder_id) {
	if (!document.querySelector(`.sub_${favori_folder_id}`)) {
		console.log(`Selector not found: .sub${favori_folder_id}`);
		return null;
	}

	const content_list_element = document.querySelector(`.sub_${favori_folder_id}`);

	addLoadingListFavory(content_list_element);
	fecthListFavory(content_list_element, favori_folder_id);
}

function addLoadingListFavory(parent_content) {
	parent_content.innerHTML = `
		<div class="folder_chargement loading_list_favory_jheo_js" ">
			<div class="containt">
				<div class="word word-1">C</div>
				<div class="word word-2">M</div>
				<div class="word word-3">Z</div>
			</div>
		</div>
	`;
}

function removeLoadingListFavory(parent_content) {
	if (!parent_content.querySelector(".loading_list_favory_jheo_js")) {
		console.log(`Selector not found: .loading_list_favory_jheo_js`);
		return null;
	}
	parent_content.querySelector(".loading_list_favory_jheo_js").remove();
}

/**
 * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
 * Goal: fetch all favori in the from the base
 * @param {*} parent_content
 */
function fecthListFavory(parent_content, favori_folder_id = 0) {
	let link = "/rubrique/all_favori";
	link = favori_folder_id != 0 ? `${link}?favoriFolder=${favori_folder_id}` : link;

	const request = new Request(link, {
		method: "GET",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
	});

	fetch(request)
		.then((response) => response.json())
		.then((response) => {
			if (response.code == 401) {
				parent_content.innerHTML = `
					<div class="alert alert-danger" role="alert">
						Vous n'êtes pas connecté, <a href="/connexion" >veuillez connectez ici </a>.
					</div>
				`;
			} else {
				const listElement = response.data;

				let listElement_html = "";
				if (listElement.length === 0) {
					listElement_html = `
						<div class="alert alert-danger custom_alert_danger custom_alert_danger_jheo_js" role="alert">
							Vous n'avez pas un favori ou un dossier ici.
						</div
					`;
				} else {
					listElement.forEach((element) => {
						let element_html = createItemFavory({ ...element }, element.isfolder);
						listElement_html += element_html;
					});
				}

				removeLoadingListFavory(parent_content);
				parent_content.innerHTML = listElement_html;
			}
		})
		.catch((error) => console.log(error));
}

function createItemFavory(object, isFolder) {
	if (isFolder === true) {
		return createItemFavoryFolder(object);
	} else {
		return createItemFavoryElement(object);
	}
}

function createItemFavoryElement(object) {
	let icon_path = "/assets/icon/NewIcons/icon-resto-new-B.png";
	icon_path = IS_DEV_MODE ? icon_path : `/public${icon_path}`;

	const id_favory_etablisment = object.id_favory_etablisment;

	return `
		<li class="favory_etablisment_${id_favory_etablisment}_jheo_js list-group-item d-flex justify-content-between align-items-center">
			<div class="d-flex justify-content-start align-items-center">
				<img class="icon_favory_rubrique" src="${icon_path}" alt="${object.name}">
				<!-- <span class="ms-2 favory_etablisment" onclick="getDetailFromListRight('${object.nom_dep}', '${object.dep}', '${object.id}')">${object.name}</span> -->
				<span class="ms-2 favory_etablisment" onclick="openDetailsRubriqueFromLeft('${object.id}', 'restaurant')">${object.name}</span>
            </div>
			<span class="remove_etablisment_${id_favory_etablisment}_jheo_js text-danger float-end" style="cursor:pointer" onclick="removeFavoryEtablisment('${id_favory_etablisment}')">
				<i class="fas fa-trash" aria-hidden="true"></i>
			</span>
		</li>
	`;
}

function createItemFavoryFolder(object) {
	return `
		<li class="list-group-item">
			<i class="fa-solid fa-folder text-warning"></i>
			<a class="favory_folder_collapse" data-bs-toggle="collapse" href="#collapse_${object.id}" role="button" aria-expanded="false" aria-controls="collapse_${object.id}"
			   onclick="openCollapseRubriqueFavory('${object.id}')">
				${object.name}
			</a>
			<div class="collapse" id="collapse_${object.id}">
				<ul class="list-group list-group-flush sub_${object.id}"></ul>
			</div>
		</li>
	`;
}

/**
 * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
 *
 * Goal: Set on etablisment in favory by default in Mes favori
 *       and in the modal there is way that the user can move the emplacement in directory want.
 *
 * Use in: details resto, .../shard/restaurant/detail_resto.html.twig
 *
 * @param  etablisment_id id of etablisment like resto.id, ...
 *
 * @returns
 */
function makeFavori(etablisment_id) {
	if (!document.querySelector(".modal_content_favori_jheo_js")) {
		console.log("Selector not found: '.modal_content_favori_jheo_js'");
		return null;
	}

	const modal_content_favory = document.querySelector(".modal_content_favori_jheo_js");

	/// inject loading during the default operation.
	addChargementModalAddFavori(modal_content_favory);

	//// Content action to move favori, create new folder, ... (must remove these for the new instance)
	if (document.querySelector(".content_cta_move_favory_jheo_js")) {
		const content_cta_move_favori = document.querySelector(".content_cta_move_favory_jheo_js");
		if (!content_cta_move_favori.classList.contains("hidden")) {
			content_cta_move_favori.classList.add("hidden");
		}
		content_cta_move_favori.innerHTML = "";
	}

	//// default operation that store the etablisment in default favory 'Mes favory'
	pushItemFavory(modal_content_favory, etablisment_id);
}

function addChargementModalAddFavori(parent_element) {
	if (parent_element) {
		parent_element.innerHTML = `
			<div class="d-flex justify-content-center align-items-center">
				<div class="spinner-border text-primary m-3" role="status">
					<span class="visually-hidden">Loading...</span>
				</div>
			</div>
		`;
	}
}

function removeChargementModalAddFavori(parent_element) {
	if (parent_element) {
		parent_element.innerHTML = "";
	}
}

/**
 * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
 *
 * Goal: Default operation to store the etablisement in default favory 'Mes favory'
 *
 * @param {DomElement} modal_content_favory: body of the modal
 * @param {integer} etablisment_id: id of the etablisement like resto.id, ...
 */
function pushItemFavory(modal_content_favory, etablisment_id) {
	let link = "/user/add_resto_favory";

	const request = new Request(link, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			etablisment_id: etablisment_id,
		}),
	});

	fetch(request)
		.then((response) => response.json())
		.then((response) => {
			const data = response.data;
			const folder = data.folder;
			const etablisment = data.etablisment;

			const favori_folder = folder.name;

			let btn_alert = "",
				class_alert = "",
				alert_message = "";
			if (response.code === 201) {
				class_alert = "alert-info";
				alert_message = "Ce restaurant est enregistré dans";
			} else if (response.code === 200) {
				class_alert = "alert-warning";
				alert_message = "Ce restaurant est déja enregistré dans";
			}

			btn_alert = `
				<div class="content_info_alert">
					<div class="alert ${class_alert} d-flex justify-content-start align-items-center" role="alert">
						<i class="fa-solid fa-circle-check me-2"></i>
						<p>
							${alert_message}
							<span class="text-decoration-underline text-sm ms-2">
								${favori_folder}
							</span>
						</p>
					</div>
				</div>
			`;
			modal_content_favory.innerHTML = btn_alert;

			handleChangeDirectory(modal_content_favory, etablisment_id);
		})
		.catch((error) => console.log(error));
}

function handleChangeDirectory(modal_content_favory, etablisment_id) {
	const form_html = `
		<form>
			<div class="content_change_directory_favory">
				<div class="d-flex justify-content-start align-items-center">
					<button class="font_size_09 text-decoration-underline text-primary"
						type="button"
						data-bs-dismiss="modal"
						data-bs-toggle="collapse" href="#parentdossier"
						onclick="handleMoveDirectory('${etablisment_id}')"
					>
						Voulez-vous changer l'emplacement?
					</button>
				</div>
			</div>

			<div class="mt-3 collapse" id="parentdossier">
				<div class="content_hearder mb-1">
					<h5 class="card-title fw-bold">
						Liste de vos dossiers
					</h5>
				</div>
				<hr>
				<div class="mt-1">
					<div class="content_list_folder content_list_folder_jheo_js">
						<div class="loading_favory_folder d-flex justify-content-center align-items-center">
							<div class="spinner-border text-info loading_list_favory loading_list_favory_jheo_js" role="status">
								<span class="visually-hidden">Loading...</span>
							</div>
						</div>
					</div>
					<div>
						<button type="button" class="text-decoration-underline text-primary" 
						    data-bs-toggle="modal" data-bs-target="#new_folder_favori"
							onclick="getAllFolderFavory()">
							Crée un nouveau dossier
						</button>
					</div>
				</div>
			</div>
		</form>
	
	`;

	const cta_move_favori = `
		<button type="button" class="btn btn-primary" 
			data-bs-dismiss="modal"
			data-bs-toggle="collapse" href="#parentdossier"
			onclick="handleMoveDirectory('${etablisment_id}')"
		>
			Oui
		</button>
		<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
			Pas maintenant
		</button>
	`;

	setTimeout(() => {
		modal_content_favory.innerHTML += form_html;
		if (document.querySelector(".content_cta_move_favory_jheo_js")) {
			const content_cta_move_favori = document.querySelector(".content_cta_move_favory_jheo_js");
			if (content_cta_move_favori.classList.contains("hidden")) {
				content_cta_move_favori.classList.remove("hidden");
			}
			content_cta_move_favori.innerHTML = cta_move_favori;
		}
	}, 1000);
}

function handleMoveDirectory(etablisment_id) {
	fetchFolderFavory();

	const cta_move_favori = `
		<button type="button" 
		    class="btn btn-primary disabled cta_change_favori_folder_jheo_js" 
			data-bs-dismiss="modal"
			data-bs-toggle="collapse" href="#parentdossier"
			onclick="changeDirectoryFavoriFolder('${etablisment_id}')"
		>
			Terminer
		</button>
		<button type="button" class="btn btn-danger" data-bs-dismiss="modal">
			Annuler
		</button>
	`;

	if (document.querySelector(".content_cta_move_favory_jheo_js")) {
		const content_cta_move_favori = document.querySelector(".content_cta_move_favory_jheo_js");
		if (content_cta_move_favori.classList.contains("hidden")) {
			content_cta_move_favori.classList.remove("hidden");
		}
		content_cta_move_favori.innerHTML = cta_move_favori;
	}
}

/**
 * @author Jehovanie RAMANRIJOEL <jehovanieram@gmail.com>
 *
 * Goal: Get all folder
 * Use in: Change favori folder
 *
 */
function fetchFolderFavory() {
	if (!document.querySelector(".content_list_folder_jheo_js")) {
		console.log("Selector not found: '.content_list_folder_jheo_js'");
		return null;
	}

	let link = "/rubrique/all_favori_folder";

	const request = new Request(link, {
		method: "GET",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
	});

	fetch(request)
		.then((response) => response.json())
		.then((response) => {
			const content_list_folder = document.querySelector(".content_list_folder_jheo_js");

			if (response.code == 401) {
				content_list_folder.innerHTML = `
					<div class="alert alert-danger" role="alert">
						Vous n'êtes pas connecté, <a href="/connexion" >veuillez connectez ici </a>.
					</div>
				`;
			} else {
				const all_folder_lists = response.all_folder;

				if (all_folder_lists.length === 0) {
					content_list_folder.innerHTML = `
						<div class="alert alert-danger custom_alert_danger custom_alert_danger_jheo_js" role="alert">
							Vous n'avez pas encore un dossier
						</div
					`;
				} else {
					let all_folder_list_html = "";

					if (all_folder_lists.length > 0) {
						//// find the high level folder
						let initialState = 0;
						let folder_high_level = all_folder_lists.reduce((current_folder, folder) => {
							if (folder.livel_parent <= current_folder) {
								return current_folder;
							}
							return folder.livel_parent;
						}, initialState);

						while (initialState <= folder_high_level) {
							let all_folder_parent = all_folder_lists.filter(
								(folder) => parseInt(folder.livel_parent) === initialState
							);

							if (initialState === 0) {
								all_folder_parent.forEach((single_folder) => {
									all_folder_list_html += createSingleElementFolder(single_folder);
								});
								content_list_folder.innerHTML = all_folder_list_html;
							} else {
								let folder_element = "";
								all_folder_parent.forEach((single_folder) => {
									const idFolderParent = single_folder.idFolderParent;
									folder_element = createSingleElementFolder(single_folder);

									if (
										idFolderParent != "0" &&
										document.querySelector(`.list_sub_folder_${idFolderParent}_jheo_js`)
									) {
										const folder_parent = document.querySelector(
											`.list_sub_folder_${idFolderParent}_jheo_js`
										);
										folder_parent.innerHTML += folder_element;
									}
								});
							}

							initialState++;
						}
					}

					const cta_change_favori_folder = document.querySelector(".cta_change_favori_folder_jheo_js");

					const content_folder = document.querySelector(".content_list_folder_jheo_js");
					const all_input_favori_folder = content_folder.querySelectorAll(".input_favori_folder_jheo_js");

					Array.from(all_input_favori_folder).forEach((input_favori_folder) => {
						input_favori_folder.addEventListener("change", () => {
							if (cta_change_favori_folder.classList.contains("disabled")) {
								cta_change_favori_folder.classList.remove("disabled");
							}
						});
					});
				}
			}
		})
		.catch((error) => console.log(error));
}

/**
 * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
 *
 * Goal: Create single element folder.
 *
 * @param {*} folder_object
 */
function createSingleElementFolder(folder_object) {
	const folder_name = folder_object.name;
	const livel_parent = folder_object.hasOwnProperty("livel_parent") ? folder_object.livel_parent : 0;

	let font_size = parseFloat(livel_parent) / 10;
	font_size = `${1 - font_size}rem`;

	let single_folder_html = `
		<div class="form-check">
			<input class="form-check-input input_favori_folder_jheo_js" style="font-size:${font_size};" type="radio" name="flexRadioDefault" id="folder_${folder_object.id}" value="${folder_object.id}" >
			<label class="form-check-label" for="folder_${folder_object.id}">
				<i class="fa-solid fa-folder text-warning"></i>
				${folder_name}
			</label>
            <div class="content_list_folder list_sub_folder_${folder_object.id}_jheo_js">
			</div>
		</div>
	`;
	return single_folder_html;
}

/**
 * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
 *
 * Goal: action add new folder
 *
 */
function addNewFolder() {
	if (!document.querySelector(".input_new_folder_jheo_js")) {
		console.log("Selector not found: '.input_new_folder_jheo_js'");
		return null;
	}

	if (!document.querySelector(".content_list_folder_jheo_js")) {
		console.log("Selector not found: '.content_list_folder_jheo_js'");
		return null;
	}

	const input_new_folder = document.querySelector(".input_new_folder_jheo_js");
	let input_new_folder_value = input_new_folder.value;
	input_new_folder_value = input_new_folder_value.trim();

	const select_parent_folder = document.querySelector(".selected_parent_folder_jheo_js");
	let select_parent_folder_value = select_parent_folder.value;

	if (input_new_folder_value != "" && input_new_folder_value != null) {
		///push create favory folder
		document.querySelector(".cta_hidden_new_folder_favori_jheo_js").click();
		handleCreateFolderFavory({
			folder_name: input_new_folder_value,
			parent_folder: select_parent_folder_value,
		});
	} else {
		if (document.querySelector(".error_folder_name_jheo_js")) {
			error_display = document.querySelector(".error_folder_name_jheo_js");
			if (error_display.classList.contains("hidden")) error_display.classList.remove("hidden");

			if (!input_new_folder.classList.contains("border_input_danger")) {
				input_new_folder.classList.add("border_input_danger");
			}

			input_new_folder.addEventListener("input", () => {
				if (!error_display.classList.contains("hidden")) error_display.classList.add("hidden");

				if (input_new_folder.classList.contains("border_input_danger")) {
					input_new_folder.classList.remove("border_input_danger");
				}
			});
		}
	}
}

/**
 * @author Jehovanie RAMANRIJOEL <jehovanieram@gmail.com>
 *
 * Goal: Get all folder
 * Use for: Create new favori folder
 */
function getAllFolderFavory() {
	if (!document.querySelector(".content_select_folder_favory_jheo_js")) {
		console.log("Selector not found: '.content_select_folder_favory_jheo_js");
		return null;
	}

	let link = "/rubrique/all_favori_folder";

	const request = new Request(link, {
		method: "GET",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
	});

	fetch(request)
		.then((response) => response.json())
		.then((response) => {
			const all_folder_lists = response.all_folder;

			const content_select_folder = document.querySelector(".content_select_folder_favory_jheo_js");
			if (response.code == 401) {
				content_select_folder.innerHTML = `
					<div class="alert alert-danger" role="alert">
						Vous n'êtes pas connecté, <a href="/connexion" >veuillez connectez ici </a>.
					</div>
				`;
			} else {
				let all_folder_options = `
					<option value="0" selected>Dossier parent</option>
				`;

				all_folder_lists.forEach((single_folder) => {
					const folder_name = single_folder.name;
					const single_folder_option = `
						<option value="${single_folder.id}">
							${folder_name}
						</option>
					`;
					all_folder_options += single_folder_option;
				});

				const select_folder_favory = `
					<label class="form-check-label" for="flexSwitchCheckDefault">
						Choisissez le dossier parent
					</label>
					<select class="form-select form-select-sm selected_parent_folder_jheo_js" aria-label=".form-select-sm example">
						${all_folder_options}
					</select>
				`;

				content_select_folder.innerHTML = select_folder_favory;
			}
		})
		.catch((error) => console.log(error));
}

/**
 * @author Jehovanie RAMANDIRJOEL <jehovanieram@gmail.com>
 *
 * Goal: Create new folder.
 * @param {object} data_folder : { folder_name: ..., parent_folder: ... }
 */
function handleCreateFolderFavory(data_folder) {
	let link = "/user/add_new_favori_folder";

	const request = new Request(link, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data_folder),
	});

	fetch(request)
		.then((response) => response.json())
		.then((response) => {
			if (response.code === 201) {
				const folder = response.data;

				if (document.querySelector(".custom_alert_danger_jheo_js")) {
					document.querySelector(".custom_alert_danger_jheo_js").remove();
				}

				const new_folder_html = createSingleElementFolder({
					id: folder.unique_id,
					name: folder.name,
					livel_parent: folder.livel_parent,
				});

				if (folder.id_folder_parent == null || folder.id_folder_parent == "0") {
					const content_list_folder = document.querySelector(".content_list_folder_jheo_js");
					content_list_folder.innerHTML += new_folder_html;
				} else {
					const idFolderParent = folder.id_folder_parent;
					if (document.querySelector(`.list_sub_folder_${idFolderParent}_jheo_js`)) {
						const folder_parent = document.querySelector(`.list_sub_folder_${idFolderParent}_jheo_js`);
						folder_parent.innerHTML += new_folder_html;
					}
				}

				document.querySelector(`#folder_${folder.unique_id}`).addEventListener("change", () => {
					const cta_change_favori_folder = document.querySelector(".cta_change_favori_folder_jheo_js");

					if (cta_change_favori_folder.classList.contains("disabled")) {
						cta_change_favori_folder.classList.remove("disabled");
					}
				});

				const input_new_folder = document.querySelector(".input_new_folder_jheo_js");
				input_new_folder.value = null;

				const select_parent_folder = docuemnt.querySelector(".selected_parent_folder_jheo_js");
				select_parent_folder.value = null;
			}
		})
		.catch((error) => console.log(error));
}

function changeDirectoryFavoriFolder(etablisment_id) {
	const content_folder = document.querySelector(".content_list_folder_jheo_js");
	const all_input_favori_folder = content_folder.querySelectorAll(".input_favori_folder_jheo_js");

	const input_favori_folder_checked = Array.from(all_input_favori_folder).find(
		(input_favori_folder) => input_favori_folder.checked
	);

	if (!document.querySelector(".modal_content_favori_jheo_js")) {
		console.log("Selector not found: '.modal_content_favori_jheo_js'");
		return null;
	}

	const modal_content_favory = document.querySelector(".modal_content_favori_jheo_js");

	if (!!input_favori_folder_checked === false) {
		modal_content_favory;
	}

	const favori_folder_checked = input_favori_folder_checked.value;

	/// inject loading during the default operation.
	addChargementModalAddFavori(modal_content_favory);

	pushMoveFavoryEtablisment(
		{
			etablisment_id: etablisment_id,
			new_favory_folder: favori_folder_checked,
		},
		modal_content_favory
	);
}

function pushMoveFavoryEtablisment(data_folder, modal_content_favory) {
	let link = "/user/change_favory_folder";

	const request = new Request(link, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data_folder),
	});

	fetch(request)
		.then((response) => response.json())
		.then((response) => {
			const data = response.data;
			const folder = data.folder;

			const favori_folder = folder.name;

			let btn_alert = "",
				class_alert = "",
				alert_message = "";
			if (response.code === 201) {
				class_alert = "alert-info";
				alert_message = "Ce restaurant est enregistré dans";
			} else if (response.code === 200) {
				class_alert = "alert-warning";
				alert_message = "Ce restaurant est déjà enregistré dans";
			}

			btn_alert = `
				<div class="content_info_alert">
					<div class="alert ${class_alert} d-flex justify-content-start align-items-center" role="alert">
						<i class="fa-solid fa-circle-check me-2"></i>
						<p>
							${alert_message}<span class="text-decoration-underline text-sm ms-2">
								${favori_folder}
							</span>
						</p>
					</div>
				</div>
			`;
			modal_content_favory.innerHTML = btn_alert;

			if (document.querySelector(".content_cta_move_favory_jheo_js")) {
				const cta_move_favori = `
					<button type="button" class="btn btn-info" data-bs-dismiss="modal">
						Ferme
					</button>
				`;
				document.querySelector(".content_cta_move_favory_jheo_js").innerHTML = cta_move_favori;
			}
		})
		.catch((error) => console.log(error));
}

/**
 * @author Jehovanie RAMANDIRJOEL <jehovanieram@gmail.com>
 *
 * Goal: delete favori etablisment
 * @param {integer} id_favory_etablisment : id favori etablisment
 */
function removeFavoryEtablisment(id_favory_etablisment) {
	let link = "/user/favori_etablisment/remove";

	if (document.querySelector(`.remove_etablisment_${id_favory_etablisment}_jheo_js`)) {
		const remove_etab = document.querySelector(`.remove_etablisment_${id_favory_etablisment}_jheo_js`);
		remove_etab.innerHTML = `
			<i class="fa-solid fa-spinner fa-spin"></i>
		`;
	}

	const request = new Request(link, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			etablisment_id: id_favory_etablisment,
		}),
	});

	fetch(request)
		.then((response) => response.json())
		.then((data) => {
			console.log(data);
			if (document.querySelector(`.favory_etablisment_${id_favory_etablisment}_jheo_js`)) {
				document.querySelector(`.favory_etablisment_${id_favory_etablisment}_jheo_js`).remove();
			}
		})
		.catch((error) => console.log(error));
}
