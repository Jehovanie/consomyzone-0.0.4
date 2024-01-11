if (document.querySelector("#fetch_new_letter_fans_tribug_jheo_js")) {
	///nav list news letter tribuG
	const callActionNewLetterFans = document.querySelector("#fetch_new_letter_fans_tribug_jheo_js");

	let new_letter_piece_joint_list = []; /// global variable to store all piece joint (file, image)

	callActionNewLetterFans.addEventListener("click", (e) => {
		e.preventDefault();

		// document.querySelector("#showCreatePub").style.display="none"

		/// turn active btn newletter on navbar
		if (!callActionNewLetterFans.classList.contains("active")) {
			callActionNewLetterFans.classList.add("active");
			callActionNewLetterFans.classList.add("text-white");
			callActionNewLetterFans.classList.remove("text-primary");
		}

		/// remove class active for other links
		if (document.querySelector("#fetch_actialite_tribug_jheo_js").classList.contains("active")) {
			document.querySelector("#fetch_actialite_tribug_jheo_js").classList.remove("active");
			document.querySelector("#fetch_actialite_tribug_jheo_js").classList.remove("text-white");
			document.querySelector("#fetch_actialite_tribug_jheo_js").classList.add("text-primary");
		}

		if (document.querySelector("#fetch_member_tribug_jheo_js").classList.contains("active")) {
			document.querySelector("#fetch_member_tribug_jheo_js").classList.remove("active");
			document.querySelector("#fetch_member_tribug_jheo_js").classList.remove("text-white");
			document.querySelector("#fetch_member_tribug_jheo_js").classList.add("text-primary");
		}

		if (document.querySelector("#fetch_photo_tribug_jheo_js").classList.contains("active")) {
			document.querySelector("#fetch_photo_tribug_jheo_js").classList.remove("active");
			document.querySelector("#fetch_photo_tribug_jheo_js").classList.remove("text-white");
			document.querySelector("#fetch_photo_tribug_jheo_js").classList.add("text-primary");
		}

		if (document.querySelector("#fetch_resto_tribug_jheo_js").classList.contains("active")) {
			document.querySelector("#fetch_resto_tribug_jheo_js").classList.remove("active");
			document.querySelector("#fetch_resto_tribug_jheo_js").classList.remove("text-white");
			document.querySelector("#fetch_resto_tribug_jheo_js").classList.add("text-primary");
		}

		///change title
		document.querySelector(".textIndicationNantaJs").textContent = "Lettre d'information";

		///show loading indicator
		document.querySelector(".content_bloc_jheo_js").innerHTML = `
            <div class="spinner-grow text-info d-block mx-auto" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        `;

		///fetch details user and tribuG
		fetch("/tributG/new_letter_fans")
			.then((response) => response.json())
			.then((response) => {
				const { apropos_tribuG, user_profil } = response;
				let logo_tribu = apropos_tribuG["avatar"]
					? "/uploads/tribus/photos/" + apropos_tribuG["avatar"]
					: "/uploads/tribu_t/photo/avatar_tribu.jpg";

				logo_tribu = IS_DEV_MODE ? logo_tribu : "/public" + logo_tribu;

				/// text description
				let text = `
                        <div class="bg-white rounded-3 px-3 2xl:ud-max-w-230 uf content_news_letter">
                            <div id="blockSendEmailInvitation" class="mt-4 px-3">
                                <form class="content_form_send_invitation_email_js_jheo">
                                    <div class="form-group content_cc_css_jheo mt-3">
                                        <div class="news_letter_entete">
                                            <div class="new_letter_tribu_logo">
                                                 <img src="${logo_tribu}" class="card-img-top" alt="tribu">
                                            </div>
                                            <h5 class="card-title">${apropos_tribuG.name}</h5>
                                            <p class="card-text">${apropos_tribuG.description}</p>
                                        </div>
                                    </div>
        
                                    <div class="form-group content_objet_css_jheo mt-3">
                                        <label for="newLetter_object_input">Objet</label>
                                        <input type="text" class="form-control newLetter_object_jheo_js" id="newLetter_object_input" placeholder="Lettre d'information" value="Lettre d'information">
                                    </div>

                                    <div class="form-group mt-3">
                                        <label for="textContentInformationTribu_jheo_js">Description<span class="info_multiple_mail">(*Vous pouvez changer tout le corps de cette lettre.)</span></label>
                                        <div>
                                            <textarea cols="100" id="textContentInformationTribu_jheo_js">
                                            
                                            </textarea>
                                        </div>
                                    </div>

                                    <ul class="list-group content_list_piece_joint content_list_piece_joint_jheo_js d-none"></ul>

                                    <div class="d-flex justify-content-start align-items-center">
                                        <div class="p-2 bd-highlight">
                                            <button type="button" class="btn btn-primary btn_submit_sendNewsLetter_jheo_js my-3">Envoyer</button>
                                        </div>
                                        <div class="p-2 bd-highlight content_input_piece_joint content_input_piece_joint_jheo_js">
                                            <div class="message_tooltip_piece_joint d-none message_tooltip_piece_joint_jheo_js">Ajout des pièce jointe.</div>
                                            <label class="label_piece_joint_jheo_js" for="piece_joint"><i class="label_piece_joint_jheo_js fa-solid fa-paperclip"></i></label>
                                            <input type="file" class="input_piece_joint_jheo_js hidden " id="piece_joint" name="piece_joint" onchange="addPieceJoint(this);" />
                                        </div>
                                        <div class="p-2 bd-highlight content_input_piece_joint content_add_image_js">
                                            <div class="pointer_cursor message_tooltip_piece_joint d-none add_image_jheo_js">Ajout des images.</div>
                                            <label class="pointer_cursor label_add_image_jheo_js" for="piece_joint_image"><i class="fa-solid fa-image"></i></label>
                                            <input type="file" class="input_piece_joint_jheo_js hidden " id="piece_joint_image" name="piece_joint_image" accept="image/png, image/jpeg, image/jpg" onchange="addPieceJointImage(this);"/>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>  
                `;

				if (document.querySelector(".content_bloc_jheo_js")) {
					document.querySelector(".content_bloc_jheo_js").innerHTML = text;
					initCKEditor("textContentInformationTribu_jheo_js", showTextInformationFans, {
						data: { user_profil, apropos_tribuG },
					});

					///hover tooltip piece joint, ...
					displayTooltipHelpMsg();

					///send action
					handleSubmitSendNewsLetter();
				}
			});
	});

	function showTextInformationFans(showTextOption) {
		const { data } = showTextOption;
		const { apropos_tribuG, user_profil } = data;

		// let fullname = document.querySelector(".use-in-agd-nanta_js_css").textContent.trim()
		return (html = `
                <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Chers tous,</span> </br>
                <p>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Un nouveau membre vient de rejoindre notre tribu.
					C'est une histoire, une expérience qui renforcent l'enthousiasme de notre communauté.
                </p>
    
                <p>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Ensemble, continuons à nourrir cet espace où chacun contribue à l'épanouissement des autres.
                </p>
                </br>
                <figure class="figure">
                    <figcaption class="figure-caption">À très bientôt,</figcaption>
                    <figcaption class="figure-caption">Fondateur tribu ${apropos_tribuG.name}</figcaption>
                    <figcaption class="figure-caption">${apropos_tribuG.description}</figcaption>
                    <figcaption class="figure-caption">${user_profil.lastname} ${user_profil.firstname} </figcaption>
                    <figcaption class="figure-caption">${user_profil.email}</figcaption>
                </figure>
            `);
	}

	/**
	 * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
	 *
	 * This function is use listen the input file event onchange
	 * on the input piece joint in mail invitation
	 *
	 * All add input image
	 * Object element
	 */
	function addPieceJoint(input) {
		if (input.files && input.files[0]) {
			/// list all extensions not accepted by email :Les types de fichiers bloqués par Gmail sont les suivants :
			/// https://support.google.com/mail/answer/6590?hl=fr#zippy=%2Cmessages-avec-pi%C3%A8ces-jointes
			const listNotAccepted = [
				"zip",
				"css",
				"html",
				"sql",
				"xml",
				"gz",
				"bz2",
				"tgz",
				"ade",
				"adp",
				"apk",
				"appx",
				"appxbundle",
				"bat",
				"cab",
				"chm",
				"cmd",
				"com",
				"cpl",
				"diagcab",
				"diagcfg",
				"diagpack",
				"dll",
				"dmg",
				"ex",
				"ex_",
				"exe",
				"hta",
				"img",
				"ins",
				"iso",
				"isp",
				"jar",
				"jnlp",
				"js",
				"jse",
				"lib",
				"lnk",
				"mde",
				"msc",
				"msi",
				"msix",
				"msixbundle",
				"msp",
				"mst",
				"nsh",
				"pif",
				"ps1",
				"scr",
				"sct",
				"shb",
				"sys",
				"vb",
				"vbe",
				"vbs",
				"vhd",
				"vxd",
				"wsc",
				"wsf",
				"wsh",
				"xll",
			];

			/// input value to get the original name of the file ( with the fake path )
			const value = input.value;

			//// to get the extension file
			const temp = value.split(".");
			const extensions = temp[temp.length - 1]; /// extension

			///if the current extension is in the list not accepted.
			if (
				!listNotAccepted.some((item) => item.toLowerCase() === extensions.toLowerCase()) &&
				extensions !== value
			) {
				var reader = new FileReader();
				reader.onload = function (e) {
					/// get name the originila name of the file
					const input_value = value.split("\\");
					const name = input_value[input_value.length - 1]; /// original name

					///unique  to identify the file item
					/// this not save in the database.
					const id_unique = new Date().getTime();

					////create item piece joint.
					createListItemPiece(name, id_unique);

					//// save the item in variable global list piece jointe.
					new_letter_piece_joint_list.push({
						id: id_unique,
						name,
						base64File: e.target.result,
					});
				};

				reader.readAsDataURL(input.files[0]);
			} else {
				/// if the extension is not supported.
				swal({
					title: "Le format de fichier n'est pas pris en charge!",
					icon: "error",
					button: "OK",
				});
			}
		}
	}

	/**
	 * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
	 *
	 * This function is use listen the input file event onchange
	 * on the input piece joint in mail invitation
	 *
	 * All add input image
	 * Object element
	 */
	function addPieceJointImage(input) {
		if (input.files && input.files[0]) {
			/// list all extensions not accepted by email :Les types de fichiers bloqués par Gmail sont les suivants :
			/// https://support.google.com/mail/answer/6590?hl=fr#zippy=%2Cmessages-avec-pi%C3%A8ces-jointes
			const listNotAccepted = [
				"zip",
				"css",
				"html",
				"sql",
				"xml",
				"gz",
				"bz2",
				"tgz",
				"ade",
				"adp",
				"apk",
				"appx",
				"appxbundle",
				"bat",
				"cab",
				"chm",
				"cmd",
				"com",
				"cpl",
				"diagcab",
				"diagcfg",
				"diagpack",
				"dll",
				"dmg",
				"ex",
				"ex_",
				"exe",
				"hta",
				"img",
				"ins",
				"iso",
				"isp",
				"jar",
				"jnlp",
				"js",
				"jse",
				"lib",
				"lnk",
				"mde",
				"msc",
				"msi",
				"msix",
				"msixbundle",
				"msp",
				"mst",
				"nsh",
				"pif",
				"ps1",
				"scr",
				"sct",
				"shb",
				"sys",
				"vb",
				"vbe",
				"vbs",
				"vhd",
				"vxd",
				"wsc",
				"wsf",
				"wsh",
				"xll",
			];
			const listAccepted = ["png", "gif", "jpeg", "jpg"];

			/// input value to get the original name of the file ( with the fake path )
			const value = input.value;

			//// to get the extension file
			const temp = value.split(".");
			const extensions = temp[temp.length - 1]; /// extension

			///if the current extension is in the list not accepted.
			if (
				listAccepted.some((item) => item === extensions) &&
				!listNotAccepted.some((item) => item.toLowerCase() === extensions.toLowerCase()) &&
				extensions !== value
			) {
				var reader = new FileReader();
				reader.onload = function (e) {
					/// get name the originila name of the file
					const input_value = value.split("\\");
					const name = input_value[input_value.length - 1]; /// original name

					///unique  to identify the file item
					/// this not save in the database.
					const id_unique = new Date().getTime();

					////create item piece joint.
					createListItemPiece(name, id_unique);

					//// save the item in variable global list piece jointe.
					new_letter_piece_joint_list.push({
						id: id_unique,
						name,
						base64File: e.target.result,
					});
				};

				reader.readAsDataURL(input.files[0]);
			} else {
				/// if the extension is not supported.
				swal({
					title: "Le format de fichier n'est pas pris en charge!",
					icon: "error",
					button: "OK",
				});
			}
		}
	}

	/**
	 * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
	 *
	 * This function remove the item on the list piece jointe
	 * and update variable global `new_letter_piece_joint_list` list of the piece joint
	 *
	 * @param {*} e : event html object: item list piece jointe
	 * @param {*} id : unique id in to identify the item piece joint in the list `new_letter_piece_joint_list`
	 *
	 * @return void
	 */
	function removeListeItem(e, id) {
		///remove html element
		e.parentElement.remove();
		///remove one element in the piece global
		new_letter_piece_joint_list = new_letter_piece_joint_list.filter((item) => parseInt(item.id) != parseInt(id));
	}

	function handleSubmitSendNewsLetter() {
		if (document.querySelector(".btn_submit_sendNewsLetter_jheo_js")) {
			const btn_submit = document.querySelector(".btn_submit_sendNewsLetter_jheo_js");

			btn_submit.addEventListener("click", () => {
				const objectNewsLetter = document.querySelector(".newLetter_object_jheo_js").value;
				const description = editor.getData();

				let status = false;

				if (description !== "") {
					status = true;
				} else {
					swal({
						title: "Information manquante.",
						text: "Veuillez saisir votre texte de description.",
						icon: "error",
						button: "OK",
					});

					return 0;
				}

				let data = {
					object: objectNewsLetter === "" ? "Lettre d'information" : objectNewsLetter,
					description: editor.getData(),
					piece_joint: new_letter_piece_joint_list,
				};

				if (status) {
					btn_submit.textContent = "Envoi en cours...";
					btn_submit.setAttribute("disabled", true);

					if (new_letter_piece_joint_list.length > 0) {
						new_letter_piece_joint_list.forEach((item) => {
							const id = item.id;
							const btn_item = document.querySelector(`.fa_solid_${id}_jheo_js`);

							if (btn_item.classList.contains("btn-outline-danger")) {
								btn_item.classList.remove("btn-outline-danger");
							}

							if (!btn_item.classList.contains("btn-outline-primary")) {
								btn_item.classList.add("btn-outline-primary");
							}

							btn_item.innerHTML = `<i class="fas fa-spinner fa-spin"></i>`;

							btn_item.setAttribute("onclick", "");
						});
					}

					sendNewLetter(data);
				}
			});
		}
	}

	function sendNewLetter(data) {
		//////fetch data
		fetch("/tributG/sendNewLetter/for_all", {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data), /// object, description, piece_joint
		})
			.then((response) => response.json())
			.then((result) => {
				new swal("Succès !", "Lettre d'information", "success").then((value) => {
					const btn_submit = document.querySelector(".btn_submit_sendNewsLetter_jheo_js");
					btn_submit.removeAttribute("disabled");
					btn_submit.textContent = "Envoyer";

					const { piece_joint } = data;

					if (piece_joint.length > 0) {
						piece_joint.forEach((item) => {
							const id = item.id;
							const btn_item = document.querySelector(`.fa_solid_${id}_jheo_js`);
							if (!btn_item.classList.contains("btn-outline-danger")) {
								btn_item.classList.add("btn-outline-danger");
							}

							if (btn_item.classList.contains("btn-outline-primary")) {
								btn_item.classList.remove("btn-outline-primary");
							}

							btn_item.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
							btn_item.setAttribute("onclick", `removeListeItem(this, '${id}')`);
						});
					}
				});
			})

			.catch((e) => {
				console.log(e);
			});
	}
}
