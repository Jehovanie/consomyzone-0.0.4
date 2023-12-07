set_iris_partenaire();
if (screen.width >= 991) {
  set_iris_partisan();
}
/**set iris for inscriptions*/

function set_iris_partisan() {
  if (document.querySelector("#inscription_nom_commune")) {
    //// user input
    const input_codePostal = document.querySelector("#inscription_code_postal");

    ///set departement
    const input_hidden_departement = document.querySelector(
      "#inscription_departement"
    );

    //// dedecter et selectionner
    const input_commune = document.querySelector("#inscription_nom_commune");
    const content_options_communes = document.querySelector(
      "#inscription_faux_commune"
    ); ///select >> option

    //// dedecte et sélectionner
    const input_quartier = document.querySelector("#inscription_quartier");
    const content_options_quartier = document.querySelector(
      "#inscription_faux_quartier"
    ); ///select >> option

    ///profile selection
    const input_hidden_profil = document.querySelector("#inscription_profil");
    const img_profil = document.querySelector(".image_profil_js_jheo");
    const fake_input_profil = document.querySelector("#fileInputProfil");

    ///get all Commune
    fetch("/api/getAllCommune")
      .then((response) => {
        if (!response.ok || response.status != 200) {
          throw new Error("ERROR : " + response.status);
        }
        return response.json();
        /// object list of the commune
      })
      .then((response) => {
        //// { commune: []}
        addNumeroOptionGeo();
        document.getElementById("spinner-setting-tomm-js").style.display =
          "none";
        document
          .getElementById("conteneurs-setting-tom-js")
          .classList.remove("pointeur-event-none-tomm-js");

        const commune = response.commune; // [{ codeInsee : "" , codePostal : "" , commune : "" , dep :"" , id : "", typecom : "" }, ... ]

        ///when input
        input_codePostal.addEventListener("input", (e) => {
          ///delete border red
          input_codePostal.style.border = "";

          ///delete old value and set there to disable until user set code postal
          deleteOption("inscription_faux_commune"); /// id content_options for commune
          deleteOption("inscription_faux_quartier"); /// id content_options for quartier

          ////get list commune related with the code postal
          const list_options_commune = commune.filter(
            (item) => e.target.value === item.codePostal
          );

          /// if there is more
          if (list_options_commune.length > 0) {
            ///set input commun active
            input_commune.disabled = false;

            ///to handle default value on select
            let is_default_value = true;
            list_options_commune.forEach(({ commune, dep }) => {
              ///put all options input
              /// create single option
              createAndAddOption(
                commune,
                content_options_communes,
                is_default_value
              ); /// value, parents
              input_hidden_departement.value = dep;
              is_default_value = false;
            });

            input_commune.value = content_options_communes?.querySelector(
              ".default_value_on_select_jheo_js"
            ).value;

            ///set default select option on quartier
            //// active input quartier
            const commune_valid = commune.find(
              ({ commune }) =>
                commune ===
                content_options_communes?.querySelector(
                  ".default_value_on_select_jheo_js"
                ).value
            );

            if (commune_valid) {
              ///return single value
              ////get list quartie related with the commune
              const list_options_quartier = t.filter(
                (item) => item.dr.substring(0, 5) === commune_valid.codeInsee
              );

              /// if there is more quartier
              if (list_options_quartier.length > 0) {
                let is_default_value = true;
                list_options_quartier.forEach((item) => {
                  createAndAddOption(
                    item.i + " " + item.co,
                    content_options_quartier,
                    is_default_value
                  );
                  is_default_value = false;
                });
                input_quartier.value = content_options_quartier?.querySelector(
                  ".default_value_on_select_jheo_js"
                ).value;
              }
            }
          } else {
            ///if the user set unvalid code postal or unexisting value in the database
            input_codePostal.style.border = "1px solid red";
          }
        });

        ///when commmune setting
        content_options_communes.addEventListener("change", (e) => {
          ///update the default value
          input_commune.value = e.target.value;

          deleteOption("inscription_faux_quartier");

          //// active input quartier
          const commune_valid = commune.find(
            ({ commune }) => commune === e.target.value
          );
          if (commune_valid) {
            ///return single value

            ////get list quartie related with the commune
            const list_options_quartier = t.filter(
              (item) => item.dr.substring(0, 5) === commune_valid.codeInsee
            );

            /// if there is more quartier
            if (list_options_quartier.length > 0) {
              let is_default_value = true;
              list_options_quartier.forEach((item) => {
                createAndAddOption(
                  item.i + " " + item.co,
                  content_options_quartier,
                  is_default_value
                );
                is_default_value = false;
              });
              input_quartier.value = content_options_quartier?.querySelector(
                ".default_value_on_select_jheo_js"
              ).value;
            }
          }
        });

        content_options_quartier.addEventListener("change", (e) => {
          input_quartier.value = e.target.value;
        });
      })
      .catch((error) => {
        console.log(error);
      });

    fake_input_profil.addEventListener("change", (e) => {
      ///read file
      const reader = new FileReader();
      ////on load file
      reader.addEventListener("load", (e) => {
        /// file as url
        const uploaded_image = reader.result;
        img_profil.setAttribute("src", uploaded_image);
        input_hidden_profil.value = uploaded_image;
      });

      ///run event load in file reader.
      reader.readAsDataURL(e.target.files[0]);
    });
  }

  if (
    document.querySelector("#inscription_code_postal") &&
    document.querySelector("#inscription_num_rue")
  ) {
    console.log("misy");
    const codePostal = document.querySelector("#inscription_code_postal");
    const rue = document.querySelector("#inscription_num_rue");
    const nom = document.querySelector("#inscription_nom");
    const prenom = document.querySelector("#inscription_prenom");
    const telephone = document.querySelector("#inscription_telephone");
    codePostal.addEventListener("input", (e) => {
      console.log(e.target.value);
      const fake_commune = document.querySelector("#inscription_faux_commune");
      const fake_quartier = document.querySelector(
        "#inscription_faux_quartier"
      );

      [codePostal, fake_commune, fake_quartier].forEach((item) => {
        if (item.classList.contains("border_red")) {
          item.classList.remove("border_red");
          if (item.parentElement.querySelector(".msg_js"))
            item.parentElement.querySelector(".msg_js").remove();
        }
      });
    });
    rue.addEventListener("input", (e) => {
      rue.classList.remove("border_red");
      rue.parentElement.querySelector(".msg_js").remove();
    });
    nom.addEventListener("input", (e) => {
      nom.classList.remove("border_red");
      nom.parentElement.querySelector(".msg_js").remove();
    });
    prenom.addEventListener("input", (e) => {
      prenom.classList.remove("border_red");
      prenom.parentElement.querySelector(".msg_js").remove();
    });
    telephone.addEventListener("input", (e) => {
      telephone.classList.remove("border_red");
      telephone.parentElement.parentElement.querySelector(".msg_js").remove();
    });
  }

  if (document.querySelector(".btn_submit_inscription_js")) {
    const submit_inscription = document.querySelector(
      ".btn_submit_inscription_js"
    );
    submit_inscription.addEventListener("click", (e) => {
      const codePostal = document.querySelector("#inscription_code_postal");
      const commune = document.querySelector("#inscription_nom_commune");
      const quartier = document.querySelector("#inscription_quartier");
      const rue = document.querySelector("#inscription_num_rue");
      const nom = document.querySelector("#inscription_nom");
      const prenom = document.querySelector("#inscription_prenom");
      const telephone = document.querySelector("#inscription_telephone");
      const fake_commune = document.querySelector("#inscription_faux_commune");
      const fake_quartier = document.querySelector(
        "#inscription_faux_quartier"
      );

      const tableTemp = [
        codePostal,
        commune,
        quartier,
        fake_commune,
        fake_quartier,
        rue,
        nom,
        prenom,
        telephone,
      ];

      if (tableTemp.some((item) => item.value === "")) {
        e.preventDefault();

        if (codePostal.value === "") {
          codePostal.classList.add("border_red");
          const span = document.createElement("span");
          span.setAttribute("class", "msg_js text-danger");
          span.textContent = "Veuillez reseigné le code postal";
          codePostal.parentElement.appendChild(span);
        }

        if (rue.value === "") {
          rue.classList.add("border_red");
          const span = document.createElement("span");
          span.setAttribute("class", "msg_js text-danger");
          span.textContent = "Veuillez reseigné votre adresse";
          rue.parentElement.appendChild(span);
        }
        if (nom.value === "") {
          nom.classList.add("border_red");
          const span = document.createElement("span");
          span.setAttribute("class", "msg_js text-danger");
          span.textContent = "Veuillez reseigné votre nom";
          nom.parentElement.appendChild(span);
        }
        if (prenom.value === "") {
          prenom.classList.add("border_red");
          const span = document.createElement("span");
          span.setAttribute("class", "msg_js text-danger");
          span.textContent = "Veuillez reseigné votre prénom";
          prenom.parentElement.appendChild(span);
        }
        if (telephone.value === "") {
          telephone.classList.add("border_red");
          const span = document.createElement("span");
          span.setAttribute("class", "msg_js text-danger");
          span.textContent = "Veuillez reseigné votre numéro de téléphone.";
          telephone.parentElement.parentElement.appendChild(span);
        }

        if (fake_commune.value === "" || commune.value === "") {
          fake_commune.classList.add("border_red");
          // fake_commune.parentElement.innerHTML += `<span class="msg_js" style="text-danger">Veuillez reseigné votre commune</span>`;
        }

        if (fake_quartier.value === "" || quartier.value === "") {
          fake_quartier.classList.add("border_red");
          // fake_quartier.parentElement.innerHTML += `<span class="msg_js" style="text-danger">Veuillez reseigné le code postal</span>`;
        }
      }
    });
  }
}

/**set iris fro partenaire */
function set_iris_partenaire() {
  if (document.querySelector("#inscription_partenaire_nom_commune")) {
    //// user input
    const input_codePostal = document.querySelector(
      "#inscription_partenaire_code_postal"
    );

    ///set departement
    const input_hidden_departement = document.querySelector(
      "#inscription_partenaire_departement"
    );

    //// dedecter et selectionner
    const input_commune = document.querySelector(
      "#inscription_partenaire_nom_commune"
    );
    const content_options_communes = document.querySelector(
      "#inscription_partenaire_faux_commune"
    ); ///select >> option

    //// dedecte et sélectionner
    const input_quartier = document.querySelector(
      "#inscription_partenaire_quartier"
    );
    const content_options_quartier = document.querySelector(
      "#inscription_partenaire_faux_quartier"
    ); ///select >> option

    ///profile selection
    const input_hidden_profil = document.querySelector(
      "#inscription_partenaire_profil"
    );
    const img_profil = document.querySelector(".image_profil_js_jheo");
    const fake_input_profil = document.querySelector("#fileInputProfil");

    ///get all Commune
    fetch("/api/getAllCommune")
      .then((response) => {
        if (!response.ok || response.status != 200) {
          throw new Error("ERROR : " + response.status);
        }
        return response.json();
        /// object list of the commune
      })
      .then((response) => {
        //// { commune: []}

        const commune = response.commune; // [{ codeInsee : "" , codePostal : "" , commune : "" , dep :"" , id : "", typecom : "" }, ... ]

        ///when input
        input_codePostal.addEventListener("input", (e) => {
          ///delete border red
          input_codePostal.style.border = "";

          ///delete old value and set there to disable until user set code postal
          deleteOption("inscription_partenaire_faux_commune"); /// id content_options for commune
          deleteOption("inscription_partenaire_faux_quartier"); /// id content_options for quartier

          ////get list commune related with the code postal
          const list_options_commune = commune.filter(
            (item) => e.target.value === item.codePostal
          );

          /// if there is more
          if (list_options_commune.length > 0) {
            ///set input commun active
            input_commune.disabled = false;

            ///to handle default value on select
            let is_default_value = true;
            list_options_commune.forEach(({ commune, dep }) => {
              ///put all options input
              /// create single option
              createAndAddOption(
                commune,
                content_options_communes,
                is_default_value
              ); /// value, parents
              input_hidden_departement.value = dep;
              is_default_value = false;
            });

            input_commune.value = content_options_communes?.querySelector(
              ".default_value_on_select_jheo_js"
            ).value;

            ///set default select option on quartier
            //// active input quartier
            const commune_valid = commune.find(
              ({ commune }) =>
                commune ===
                content_options_communes?.querySelector(
                  ".default_value_on_select_jheo_js"
                ).value
            );

            if (commune_valid) {
              ///return single value
              ////get list quartie related with the commune
              const list_options_quartier = t.filter(
                (item) => item.dr.substring(0, 5) === commune_valid.codeInsee
              );

              /// if there is more quartier
              if (list_options_quartier.length > 0) {
                let is_default_value = true;
                list_options_quartier.forEach((item) => {
                  createAndAddOption(
                    item.i + " " + item.co,
                    content_options_quartier,
                    is_default_value
                  );
                  is_default_value = false;
                });
                input_quartier.value = content_options_quartier?.querySelector(
                  ".default_value_on_select_jheo_js"
                ).value;
              }
            }
          } else {
            ///if the user set unvalid code postal or unexisting value in the database
            input_codePostal.style.border = "1px solid red";
          }
        });

        ///when commmune setting
        content_options_communes.addEventListener("change", (e) => {
          ///update the default value
          input_commune.value = e.target.value;

          deleteOption("inscription_partenaire_faux_quartier");

          //// active input quartier
          const commune_valid = commune.find(
            ({ commune }) => commune === e.target.value
          );
          if (commune_valid) {
            ///return single value

            ////get list quartie related with the commune
            const list_options_quartier = t.filter(
              (item) => item.dr.substring(0, 5) === commune_valid.codeInsee
            );

            /// if there is more quartier
            if (list_options_quartier.length > 0) {
              let is_default_value = true;
              list_options_quartier.forEach((item) => {
                createAndAddOption(
                  item.i + " " + item.co,
                  content_options_quartier,
                  is_default_value
                );
                is_default_value = false;
              });
              input_quartier.value = content_options_quartier?.querySelector(
                ".default_value_on_select_jheo_js"
              ).value;
            }
          }
        });

        content_options_quartier.addEventListener("change", (e) => {
          input_quartier.value = e.target.value;
        });
      })
      .catch((error) => {
        console.log(error);
      });

    fake_input_profil.addEventListener("change", (e) => {
      ///read file
      const reader = new FileReader();
      ////on load file
      reader.addEventListener("load", (e) => {
        /// file as url
        const uploaded_image = reader.result;
        img_profil.setAttribute("src", uploaded_image);
        input_hidden_profil.value = uploaded_image;
      });

      ///run event load in file reader.
      reader.readAsDataURL(e.target.files[0]);
    });
  }
}

function createAndAddOption(value, parent, is_default_value = false) {
  const option = document.createElement("option");
  if (is_default_value) {
    option.setAttribute("class", "default_value_on_select_jheo_js");
  }
  option.textContent = value;
  parent.appendChild(option);
}

function deleteOption(content_options) {
  document.querySelectorAll("input[list]").forEach((i) => {
    i.value = null;
    i.disabled = true;
  });

  const parent = document.querySelector("#" + content_options);
  if (parent.querySelectorAll("option")) {
    parent.querySelectorAll("option").forEach((i) => i.remove());
  }
}

function addNumeroOptionGeo() {
  const target = document.querySelector("#inscription_telephone");
  intlTelInput(target, {
    initialCountry: "auto",
    geoIpLookup: (callback) => {
      fetch("https://ipapi.co/json")
        .then((res) => res.json())
        .then((data) => callback(data.country_code))
        .catch(() => callback("us"));
    },
    utilsScript: "/assets/js/intelTelInput/utils.js",
  });
}
