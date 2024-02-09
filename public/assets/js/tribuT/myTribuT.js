/**updatePdpTribu_T
 * global variable
 */
var fileStore = [];
var tribu_t_name_0 = ""; 
var id_c_u; //id du user courant
let image_listss = [];
let dataExtension = [];
var worker = IS_DEV_MODE
  ? new Worker("/assets/js/tribuT/worker.js")
  : new Worker("/public/assets/js/tribuT/worker.js");
var workerRestoPastilled = IS_DEV_MODE
  ? new Worker("/assets/js/tribuT/worker_pastilled.js")
  : new Worker("/public/assets/js/tribuT/worker_pastilled.js");
var workerGetCommentaireTribuT = IS_DEV_MODE
  ? new Worker("/assets/js/tribuT/worker_cmnt.js")
  : new Worker("/public/assets/js/tribuT/worker_cmnt.js");

var image_tribu_t;
var descriptionTribuT = "";

let __userLoggedId = document.querySelector(
  ".information_user_conected_jheo_js"
).dataset.toggleUserId;

///Jehovanie: this variable is use for the list of the piece joint
/// in the send email on the invitation tribu T
let email_piece_joint_list = [];

window.addEventListener("load", (event) => {
/**
 * create tribu_t section
 */
document.getElementById("form_upload").onchange = (e) => {
  const reader = new FileReader();

  const imgs = document.querySelectorAll("img.img-uploaded");
  if (imgs.length > 0) {
    for (let i of imgs) i.parentNode.removeChild(i);
  }
  reader.onload = () => {
    const uploaded_image = reader.result;
    image_listss.push(reader.result);

    let taille = parseInt(e.target.files[0].size); // En Octets

    // console.log(e.target.files[0].type.includes("image/"));

    if (!e.target.files[0].type.includes("image/")) {
      swal({
        title: "Le format de fichier n'est pas pris en charge!",
        text: "Le fichier autorisé doit être une image",
        icon: "error",
        button: "Ok",
      });
    } else {
      if (taille <= 2097152) {
        let img = document.createElement("img");
        img.setAttribute("class", "img-uploaded");
        img.src = uploaded_image;
        img.setAttribute("alt", "Image upload");
        // img.setAttribute("style", "width:100px; height:100px");

        const parentImage = document.querySelector("#uploadImage");
        if (parentImage.querySelector("img")) {
          parentImage.insertBefore(img, parentImage.querySelector("img"));
        } else {
          document.querySelector("#uploadImage").appendChild(img);
        }
      } else {
        swal({
          title: "Le fichier est trop volumineux.",
          text: "La taille de l'image doit être inférieure à 2Mo",
          icon: "error",
          button: "Ok",
        });
      }
    }
  };
  reader.readAsDataURL(e.target.files[0]);
};
/*---------------------- end create tribu_t section-----------------------*/

/**sendPublication
 * render tribu_t section
 */

document.getElementById("form_upload_update").onchange = (e) => {
  const reader = new FileReader();

  const imgs = document.querySelectorAll("img.img-update-tribu-t");
  if (imgs.length > 0) {
    for (let i of imgs) i.parentNode.removeChild(i);
  }
  reader.onload = () => {
    const uploaded_image = reader.result;
    image_listss.push(reader.result);
    let taille = parseInt(e.target.files[0].size); // En Octets

    // console.log(e.target.files[0].type.includes("image/"));

    if (!e.target.files[0].type.includes("image/")) {
      document.querySelector("#updateTribuInfo").dataset.name = "";
      document.querySelector("#updateTribuInfo").dataset.url = "";

      swal({
        title: "Le format de fichier n'est pas pris en charge!",
        text: "Le fichier autorisé doit être une image",
        icon: "error",
        button: "Ok",
      });
    } else {
      if (taille <= 2097152) {
        let img = document.createElement("img");
        img.setAttribute("class", "img-update-tribu-t");
        img.src = uploaded_image;
        img.setAttribute("alt", "Image upload");
        // img.setAttribute("style", "width:100px; height:100px");

        const parentImage = document.querySelector("#uploadImageForUpdate");
        if (parentImage.querySelector("img")) {
          parentImage.insertBefore(img, parentImage.querySelector("img"));
        } else {
          document.querySelector("#uploadImageForUpdate").appendChild(img);
        }

        document.querySelector("#updateTribuInfo").dataset.name =
          e.target.files[0].name;
        document.querySelector("#updateTribuInfo").dataset.url =
            uploaded_image;
      } else {
        document.querySelector("#updateTribuInfo").dataset.name = "";
        document.querySelector("#updateTribuInfo").dataset.url = "";

        swal({
          title: "Le fichier est trop volumineux.",
          text: "La taille de l'image doit être inférieure à 2Mo",
          icon: "error",
          button: "Ok",
        });
      }
    }
  };
  reader.readAsDataURL(e.target.files[0]);
};

//rendre les publications image du tribu T selectionner sur l'écran
  renderMyTribu();

  /**
   * send publication sectio
   */
  const btnSubmitPublication = document.querySelector(
    "#submit-publication-tribu-t"
  );
  if (btnSubmitPublication) {
    document
      .querySelector("#publication_photo")
      .addEventListener("change", getBase64V2);
    btnSubmitPublication.onclick = (e) => {
      e.preventDefault();
      const formData = document.querySelector("#form-publication-tribu-t")
        ? new FormData(document.querySelector("#form-publication-tribu-t"))
        : null;
      if (formData) sendPublication(formData);
      else
        new swal({
          title: "Ouups",
          text: "Erreur 500",
          icon: "error",
          button: "OK",
        });
    };
  }
});

/**
 * @author Faniry
 * cette focntion rend la tribu T
 */
function renderMyTribu() {
  const url = new URL(window.location.href.toString());
  let params = new URLSearchParams(url.search);
  if (params.size > 0) {
    //?type=owned&tribu=tribu_t_28_lenfer&rank=28
    const type = params.get("type").trim();
    const tributName = params.get("tribu").trim();
    //const id_c_u=params.get("rank").trim();
    const id_c_u = document.querySelector(".information_user_conected_jheo_js")
      ? document.querySelector(".information_user_conected_jheo_js").dataset
          .toggleUserId
      : 0;
    console.log(type, tributName, id_c_u);
    if (id_c_u > 0) {
      showBlockPubV2(type, tributName, id_c_u);
    } else
      new swal({
        title: "Ouups",
        text: "Erreur 500",
        icon: "error",
        button: "OK",
      });
  } else {
    showBlockPub();
  }
}

/**
 * @author Faniry
 * @async function
 * rend à l'écran les information de la tribu T donnée
 * @param String type  le type= owned ou joined
 * @param String tribu_t_name  le nom de la tribu t
 * @param int id_c_u  id de l'utilisateur connecté
 */
async function showBlockPubV2(type, tribu_t_name, id_c_u) {
  let currentTribuSelected = document.querySelector(
    `a[data-table-name="${tribu_t_name}"]`
  );

  if (currentTribuSelected && (type =="owned" || type =="joined")) {
    document
      .querySelector(".apropos-tribu-t-tomm-js")
      .classList.toggle("responsif-none");
    document
      .querySelector(".span-menu-tribut-tomm-js")
      .classList.toggle("responsif-none");
    document
      .querySelector(".fermet-tribu-t-tomm-js")
      .classList.toggle("responsif-none");
    document
      .querySelector(".menu-tribut-tomm-js")
      .classList.toggle("span-btn-menu-tribut");
    if (document.querySelector("#activeTribu")) {
      document.querySelector("#activeTribu").classList.remove("p-2");
      document.querySelector("#activeTribu").classList.remove("list-nav-left");
      document.querySelector("#activeTribu").classList.remove("active");
      document.querySelector("#activeTribu").removeAttribute("id");
    }

    currentTribuSelected.id = "activeTribu";
    currentTribuSelected.classList.add("p-2");
    currentTribuSelected.classList.add("list-nav-left");
    currentTribuSelected.classList.add("active"); //p-2 list-nav-left active
    const tribu_t_types = "tribu_T_" + type;
    // let data = await showdData(tribu_t_name);
    let data = await showdDataV2(id_c_u,tribu_t_name);
    showdDataContent(data, type, tribu_t_name, id_c_u);

    /**render pastiled resto */
    if (
      document.querySelector(
        "#navBarTribu > li.listNavBarTribu.restoNotHide > a"
      )
    )
      document.querySelector(
        "#navBarTribu > li.listNavBarTribu.restoNotHide > a"
      ).onclick = (e) => {
        e.preventDefault();
        if (document.querySelector("li.listNavBarTribu > a.active")) {
          document
            .querySelector("li.listNavBarTribu > a.active")
            .classList.remove("active");
        }
        document
          .querySelector("#navBarTribu > li.listNavBarTribu.restoNotHide > a")
          .classList.add("active");
        document.querySelector("#tribu_t_conteuneur").innerHTML = "";
        showResto(tribu_t_name + "_restaurant", id_c_u);
      };
    /**end */

    /**render photo gallery*/
    document.querySelector("#see-gallery").onclick = (e) => {
      e.preventDefault();
      if (document.querySelector("li.listNavBarTribu > a.active")) {
        document
          .querySelector("li.listNavBarTribu > a.active")
          .classList.remove("active");
      }
      document.querySelector("#see-gallery").classList.add("active");
      document.querySelector("#tribu_t_conteuneur").innerHTML = "";
      // showPhotos()
      galleryAll(tribu_t_types);
    };
    /**end */

    /**change pdp tribu_t */
    if (document.querySelector("#fileInputModifTribuT")) {
      document.querySelector("#fileInputModifTribuT").onchange = (e) => {
        let files = e.target.files[0];
        updatePdpTribu_T(files);
      };
    }
    /**end */

    /**render partisant*/
    document.querySelector(".partisantT").onclick = (e) => {
      if (document.querySelector("li.listNavBarTribu > a.active")) {
        document
          .querySelector("li.listNavBarTribu > a.active")
          .classList.remove("active");
      }
      document.querySelector(".partisantT > a").classList.add("active");
      document.querySelector("#tribu_t_conteuneur").innerHTML = "";
      showPartisan();
    };
  } else {
    document.querySelector("#content-pub-js").innerHTML =`
      <div class="flex-container">
      <div class="text-center">
        <h1>
          <span class="fade-in" id="digit1">4</span>
          <span class="fade-in" id="digit2">0</span>
          <span class="fade-in" id="digit3">4</span>
        </h1>
        <h3 class="fadeIn">Page non trouvée.</h3>
        <a href="/user/account" style="text-decoration:underline; color:blue">Revenir à la page d'accueil.</a>
      </div>
    </div>
    `
  }

  /**end */
}

/**
 * @author Faniry x Tommy
 */
function showBlockPub() {
  const arrays = Array.from(document.querySelectorAll(".tribu_t"));
  for (let array of arrays) {
    array.onclick = async (e) => {
      e.preventDefault();

      document
        .querySelector(".apropos-tribu-t-tomm-js")
        .classList.toggle("responsif-none");
      document
        .querySelector(".span-menu-tribut-tomm-js")
        .classList.toggle("responsif-none");
      document
        .querySelector(".fermet-tribu-t-tomm-js")
        .classList.toggle("responsif-none");
      document
        .querySelector(".menu-tribut-tomm-js")
        .classList.toggle("span-btn-menu-tribut");
      if (document.querySelector("#activeTribu")) {
        document.querySelector("#activeTribu").classList.remove("p-2");
        document
          .querySelector("#activeTribu")
          .classList.remove("list-nav-left");
        document.querySelector("#activeTribu").classList.remove("active");
        document.querySelector("#activeTribu").removeAttribute("id");
      }
      e.target.id = "activeTribu";
      e.target.classList.add("p-2");
      e.target.classList.add("list-nav-left");
      e.target.classList.add("active"); //p-2 list-nav-left active
      const id_c_u = e.target.dataset.tribuRank;
      const type = e.target.classList[1];
      const tribu_t_types = e.target.classList[2];
      // const tribu_t_name=e.target.textContent  data-table-name
      const tribu_t_name = e.target.dataset.tableName; ///  data-table-name
      let data = await showdDataV2(id_c_u,tribu_t_name);
      // console.log(data);
      showdDataContent(data, type, tribu_t_name, id_c_u);

      /**render pastiled resto */
      if (
        document.querySelector(
          "#navBarTribu > li.listNavBarTribu.restoNotHide > a"
        )
      )
        document.querySelector(
          "#navBarTribu > li.listNavBarTribu.restoNotHide > a"
        ).onclick = (e) => {
          e.preventDefault();
          if (document.querySelector("li.listNavBarTribu > a.active")) {
            document
              .querySelector("li.listNavBarTribu > a.active")
              .classList.remove("active");
          }
          document
            .querySelector("#navBarTribu > li.listNavBarTribu.restoNotHide > a")
            .classList.add("active");
          document.querySelector("#tribu_t_conteuneur").innerHTML = "";
          showResto(tribu_t_name + "_restaurant", id_c_u);
        };
      /**end */

      /**render photo gallery*/
      document.querySelector("#see-gallery").onclick = (e) => {
        e.preventDefault();
        if (document.querySelector("li.listNavBarTribu > a.active")) {
          document
            .querySelector("li.listNavBarTribu > a.active")
            .classList.remove("active");
        }
        document.querySelector("#see-gallery").classList.add("active");
        document.querySelector("#tribu_t_conteuneur").innerHTML = "";
        // showPhotos()
        galleryAll(tribu_t_types);
      };
      /**end */

      /**change pdp tribu_t */
      if (document.querySelector("#fileInputModifTribuT")) {
        document.querySelector("#fileInputModifTribuT").onchange = (e) => {
          let files = e.target.files[0];
          updatePdpTribu_T(files);
        };
      }
      /**end */

      /**render partisant*/
      document.querySelector(".partisantT").onclick = (e) => {
        if (document.querySelector("li.listNavBarTribu > a.active")) {
          document
            .querySelector("li.listNavBarTribu > a.active")
            .classList.remove("active");
        }
        document.querySelector(".partisantT > a").classList.add("active");
        document.querySelector("#tribu_t_conteuneur").innerHTML = "";
        showPartisan();
      };
      /**end */
    };
  }
}

/*------------end render tribu_t section--------------*/

/*---------------end send publication section--------------------*/

/*--------------function section---------------------*/
function showPartisan() {
  const param = "?tbl_tribu_T_name=" + encodeURIComponent(tribu_t_name_0);
  const request = new Request("/user/partisan/tribu_T" + param, {
    method: "GET",
    headers: {
      // 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      "Content-Type": "application/json",
    },
  });
  fetch(request).then((response) => {
    if (response.ok && response.status == 200) {
      response.json().then((jsons) => {
        // console.log(jsons);

        let head_table = `<h5 class="text-primary ms-1 mt-4 mb-4 float-start">Liste des Fans</h5><table id="table_partisan_elie_js" class="display m-2 p-2" style="width:100%">
                    <thead>
                        <tr>
                            <th>Profil</th>
                            <th>Nom du fan</th>
                            <th>Tribu G</th>
                        </tr>
                    </thead>
                    <tbody>`;
        let foot_table = `</tbody>
                </table>`;
        let body_table = ``;

        jsons[0].forEach((json) => {
          if (json.infos_profil !== null) {
            profilInfo = JSON.parse(json.infos_profil);
            let profil =
              profilInfo.photo_profil != null
                ? profilInfo.photo_profil
                : "/assets/image/img_avatar3.png";

            profil = IS_DEV_MODE ? profil : "/public" + profil;

            let lastName = profilInfo.lastName;
            let firstName = profilInfo.firstName;
            let tribuG = profilInfo.tribuG.replace("tribug_01_", "");

            body_table += `
                            <tr>
                                <td class="d-flex bd-highlight align-items-center">
                                    <div class="elie-img-pastilled"><img src="${profil}" alt=""></div>
                                </td>
                                <td>
                                    <a target="_blank" href="/user/profil/${
                                      profilInfo.user_id
                                    }" class="text-decoration-none">${lastName} <span> ${firstName}</span></a>
                                </td>
                                <td>
                                    TribuG ${tribuG.replaceAll("_", " ")}
                                </td>
                            </tr>
                        `;
          }

          // console.log(JSON.parse(json.infos_profil))
          // document.querySelector("#tribu_t_conteuneur").innerHTML += `
          //     <div class="card-partisons row">
          //         <div class="partisons-pdp col-lg-6">
          //             <img src="${profil/*.replace("/public","")*/}" alt="">
          //         </div>
          //         <div class="partisons-text col-lg-6">
          //             <h4>${lastName} <span> ${firstName}</span></h4>
          //             <p>TribuG : ${tribuG.replaceAll("_", " ")}</p>
          //         </div>
          //     </div>
          // `
        });

        document.querySelector("#tribu_t_conteuneur").classList.add("bg-white");

        document.querySelector("#tribu_t_conteuneur").innerHTML +=
          head_table + body_table + foot_table;

        $("#table_partisan_elie_js").DataTable({
          language: {
            url: "//cdn.datatables.net/plug-ins/1.13.4/i18n/fr-FR.json",
          },
        });
      });
    }
  });
}

function convertFileToBlob(file) {
  const reader = new FileReader();
  reader.onload = function (e) {
    let blob = new Blob([new Uint8Array(e.target.result)], { type: file.type });
  };
  reader.readAsArrayBuffer(file);
}
function getBase64V2() {
  const fR = new FileReader();
  fR.addEventListener("load", function (evt) {
    document.querySelector("#image-publication-tribu-t").src =
      evt.target.result;
  });
  fR.readAsDataURL(this.files[0]);
}
function updatePdpTribu_T(files) {
  const fR = new FileReader();

  fR.addEventListener("load", (evt) => {
    /**
     * @author elie
     * checking image extension and size if <2Mo
     * use into TribuT.html.twig
     * i want upload an image less than 2Mo
     */

    const listExt = ["jpg", "jpeg", "png", "gif", "tiff", "jpe"];
    const octetMax = 2e6; //2Mo

    /// file as url
    const uploaded_image = fR.result;

    if (!checkFileExtension(listExt, uploaded_image)) {
      swal({
        title: "Le format de fichier n'est pas pris en charge!",
        text: "Le fichier autorisé doit être une image ou des fichier (.jpeg, .jpg, .png, gif, tiff, jpe)",
        icon: "error",
        button: "OK",
      });
    } else {
      if (!checkTailleImage(octetMax, uploaded_image)) {
        swal({
          title: "Le fichier est trop volumineux!",
          text: "La taille de l'image doit être inférieure à 2Mo.",
          icon: "error",
          button: "OK",
        });
      } else {
        const param = {
          base64: evt.target.result,
          photoName: files.name,
          photoType: files.type,
          photoSize: files.size,
          tribu_t_name: tribu_t_name_0,
        };
        // console.log(param);
        const request = new Request("/user/tribu/set/pdp", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(param),
        });
        fetch(request).then((responses) => {
          if (responses.ok && responses.status === 200) {
            document.querySelector("#avatarTribuT").src = evt.target.result;
            document.querySelector(
              "#activeTribu"
            ).parentElement.parentElement.previousElementSibling.children[0].src =
              evt.target.result;
            swal({
              title: "Succès!",
              text: "L'avatar de la tribu est à jour avec succès!",
              icon: "success",
              button: "OK",
            });
          }
        });
      }
    }
  });
  fR.readAsDataURL(files);
}

/**
 * @author elie (update) x Faniry
 *  où: on Utilise cette block pour capture de photo de publication tribu T
 *  localisation : myTribuT.js,
 *  utilisation de selecteur modal_publication.html.twig
 *  je veux : ajouter une photo par media screen navigateur
 */
function sendPublication(formData) {
  // console.log(formData.values());
  const fR = new FileReader();

  /**
   * tester si on utilise la capture media
   */

  if (
    document
      .querySelector("#image-publication-tribu-t")
      .getAttribute("data-file") == "image"
  ) {
    fR.addEventListener("load", (evt) => {
      let base64 = document.querySelector("#image-publication-tribu-t").src;
      let param = {
        base64: base64,
        photoName: `capture-${new Date().getTime()}.png`,
        photoType: "image/png",
        photoSize: 300000,
        contenu: formData.get("contenu"),
        tribu_t_name: tribu_t_name_0,
        confidentialite: formData.get("confidentialite"),
      };
      // console.log(formData.get('photo'));
      // console.log(param);
      const request = new Request("/user/create-one/publication", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(param),
      });
      fetch(request).then((response) => {
        if (response.status == 200 && response.ok) {
          $("#modal_publication").modal("toggle");
          showActualites();
        } else {
          new swal({
            title: "Ouups",
            text: "Erreur 500",
            icon: "error",
            button: "OK",
          });
        }
      });
    });
    fR.readAsDataURL(
      dataURLtoFile(
        document.querySelector("#image-publication-tribu-t").src,
        `capture-${new Date().getTime()}.png`
      )
    );
  } else {
    fR.addEventListener("load", (evt) => {
      // console.log("evt" + evt);
      let param = {
        base64: evt.target.result,
        photoName: formData.get("photo").name,
        photoType: formData.get("photo").type,
        photoSize: formData.get("photo").size,
        contenu: formData.get("contenu"),
        tribu_t_name: tribu_t_name_0,
        confidentialite: formData.get("confidentialite"),
      };
      const request = new Request("/user/create-one/publication", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(param),
      });
      fetch(request).then((response) => {
        if (response.status == 200 && response.ok) {
          $("#modal_publication").modal("toggle");
          showActualites();
        } else {
          new swal({
            title: "Ouups",
            text: "Erreur 500",
            icon: "error",
            button: "OK",
          });
        }
      });
    });
    fR.readAsDataURL(formData.get("photo"));
  }
}

/**
* @author faniry x tommy x Elie
 * render tribu_t contet
 * @param {*} data
 * @param {*} type
 * @param {*} tribu_t_name
 */
function showdDataContent(dataFirst, type, tribu_t_name, id_c_u, lastId = 0) {
  let detailsTribuT = null;
// console.log(dataFirst)
  if (type === "owned") detailsTribuT = dataFirst.tribu_t_owned;
  else detailsTribuT = dataFirst.tribu_t_joined;

  //check if nested array or not
  let tribu_t = Array.isArray(JSON.parse(detailsTribuT).tribu_t)
    ? Array.from(JSON.parse(detailsTribuT).tribu_t).filter(
        (e) => e.name == tribu_t_name
      )
    : [JSON.parse(detailsTribuT).tribu_t];
  tribu_t_name_0 = tribu_t[0].name;
  descriptionTribuT = tribu_t[0].description;
  let restExtension = "";
  let golfExtension = "";
  if (lastId == 0) {
    // extension 'on' correspond à extension
    //restaurant dans les anciens version
    // ce bout de code est là pour assurer une prise en charge recurssive
    if (tribu_t[0].extension == "on" || tribu_t[0].extension == "restaurant") {
      restExtension = ` <li class="listNavBarTribu restoNotHide">
                        <a style="cursor:pointer;" data-value="restaurant">Restaurants</a>
                    </li>`;
    } else {
      if (
        tribu_t[0].extension != null &&
        tribu_t[0].extension.restaurant == 1
      ) {
        restExtension = ` <li class="listNavBarTribu restoNotHide">
                                <a style="cursor:pointer;" data-value="restaurant">Restaurants</a>
                            </li>`;
      }
      if (tribu_t[0].extension != null && tribu_t[0].extension.golf == 1) {
        golfExtension = ` <li class="listNavBarTribu golfNotHide">
                                <a style="cursor:pointer;" class="btn_grise_non_actif_js_Elie" onclick="showGolf('${tribu_t_name_0}')" data-value="golf">Golf</a>
                            </li>`;
      }
    }

    if (tribu_t[0].logo_path) {
      // image_tribu_t = `<img src="../../..${tribu_t[0].logo_path}" alt="123">`
      //public
      let avatarTribuT = tribu_t[0].logo_path;
      avatarTribuT = IS_DEV_MODE ? avatarTribuT : "/public" + avatarTribuT;

      image_tribu_t = `<img id="avatarTribuT" src="${avatarTribuT}" alt="123">`; //PROD
      // image_tribu_t = `<img id="avatarTribuT" src="${tribu_t[0].logo_path}" alt="123">` //DEV
    } else {
      let avatarTribuT = "/uploads/tribu_t/photo/avatar_tribu.jpg";
      avatarTribuT = IS_DEV_MODE ? avatarTribuT : "/public" + avatarTribuT;
      image_tribu_t = `<img id="avatarTribuT"  src="${avatarTribuT}" alt="123">`;
    }

    let canChangeTribuPicture = "";
    if (document.querySelector("#activeTribu")) {
      // data-bs-toggle="modal" data-bs-target="#addPictureModalTribu"
      canChangeTribuPicture = !document
        .querySelector("#activeTribu")
        .classList.contains("other")
        ? `<div class="col-lg-6 col-6" style="height:100px;">
                                    <label style="margin-left:50%;margin-top:50%" for="fileInputModifTribuT" data-bs-placement="top" title="Modifier le logo de la tribu">
                                        <i class="bi bi-camera-fill" style="font-size: 20px; margin-top:5px;margin-left: 15px;cursor:pointer; background-position: 0px -130px; background-size: auto; width: 20px; height: 20px; background-repeat: no-repeat; display: inline-block;"></i>
                                    </label>
                                    <input type="file" name="fileInputModifTribuT" id="fileInputModifTribuT" style="display:none;visibility:none;" accept="image/*">
                                </div>`
        : "";
    }

    let canUpdateTribuInfo = !document
      .querySelector("#activeTribu")
      .classList.contains("other")
      ? `<li class="listNavBarTribu">
                                <a style="cursor:pointer;" id="settingTribuT" onclick="settingTribuT(event,'${tribu_t[0].name}')">Paramètre</a>
                            </li>`
      : "";

    let canUpdateTribuInfoMob = !document
      .querySelector("#activeTribu")
      .classList.contains("other")
      ? `<li class="listNavBarTribu">
                                <a style="cursor:pointer;" id="settingTribuT" class="dropdown-item" onclick="settingTribuT(event,'${tribu_t[0].name}')">Paramètre</a>
                            </li>`
      : "";

    let newsLetterTribuT = !document
      .querySelector("#activeTribu")
      .classList.contains("other")
      ? ` <li class="listNavBarTribu">
            <a style="cursor:pointer;" id="fetch_new_letter_fans_tribuT_jheo_js" class="dropdown-item">Communiquer</a>
          </li>`
      : "";
      const postulantListe = ` <li class="listNavBarTribu postulantListe">
      <a style="cursor:pointer;" id="cta_postulant_js" class="dropdown-item" onclick=(renderPosulant("${tribu_t[0].name}"))>Postulants</a>
    </li>`;
    let navMenuTribuT = "";
    if (screen.width < 1000) {
      navMenuTribuT = `<nav class=" mx-auto ">
                    <ul id="navBarTribu" class="navBarTribu-t content_list_navBarTribuT_jheo_js">
                        <li class="listNavBarTribu">
                            <a class="active" id="ulActualites" style="cursor:pointer;" onclick="showActualites()">Actualités</a>
                        </li>
                        ${restExtension}
                        ${golfExtension}
                                              
                    </ul>
                    <div class="dropdown setting-nav-tribu-t">
                        <a class="dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
                          <i class="fa-solid fa-bars"></i>
                        </a>

                        <ul class="dropdown-menu" aria-labelledby="dropdownMenuLink">
                          <li class="listNavBarTribu invitation">
                              <a style="cursor:pointer;" onclick="showInvitations()" class="dropdown-item">Invitations</a>
                          </li>  
                            <li class="listNavBarTribu partisantT">
                              <a style="cursor:pointer;" class="dropdown-item">Fans</a>
                          </li>
                          ${postulantListe}
                          <li class="listNavBarTribu">
                              <a style="cursor:pointer;" id="see-gallery" class="dropdown-item">Photos</a>
                          </li>

                          ${canUpdateTribuInfoMob}

                          ${newsLetterTribuT}
                        </ul>
                      </div>
                </nav>`;
    } else {
      navMenuTribuT = `<nav class=" mx-auto">
                    <ul id="navBarTribu" class="navBarTribu-t content_list_navBarTribuT_jheo_js">
                        <li class="listNavBarTribu">
                            <a class="active" id="ulActualites" style="cursor:pointer;" onclick="showActualites()">Actualités</a>
                        </li>


                        ${restExtension}
                        ${golfExtension}

                        <li class="listNavBarTribu invitation">
                            <a style="cursor:pointer;" onclick="showInvitations()">Invitations</a>
                        </li>
                        <li class="listNavBarTribu partisantT">
                            <a style="cursor:pointer;">Fans</a>
                        </li>
                        ${postulantListe}
                        <li class="listNavBarTribu">
                            <a style="cursor:pointer;" id="see-gallery">Photos</a>
                        </li>

                        ${canUpdateTribuInfo}

                        ${newsLetterTribuT}

                    </ul>
                </nav>`;
    }

    document.querySelector("#content-pub-js").innerHTML = `
            <div class="card-couverture-pub-tribu-t ">
                <div class="content-couverture mt-3">
                    <div class="row content-tribu-t">
                        <div class="col-lg-3 col-4">
                            <div class="row">
                                <div class="col-lg-6 col-3">
                                    ${image_tribu_t}
                                </div>
                                ${canChangeTribuPicture}
                            </div>
                        </div>
                        <div class="col-lg-8 col-8 content-tribu-t-name">
                            <h1 class="titre-tribu-t" id="tribu_t_name_main_head" data-tribu="${
                              tribu_t[0].name
                            }">${
      tribu_t[0].name_tribu_t_muable
        ? tribu_t[0].name_tribu_t_muable
        : tribu_t[0].name.replace(/tribu_t_[0-9]+_/, "").replaceAll("_", " ")
    }</h1>
                            <p class="text-white descrp-tribu-t">
                            ${
                              tribu_t[0].description
                                ? tribu_t[0].description?.replace(/"/gi, "")
                                : ""
                            }
                            </p>
                        </div>
                    </div>
                    
                </div>
                <div class="container-fluid" style="height: 30px; background-color: #1ABA12;">
                     <p class="text-light">Tribu-t fondée par <span class="fw-bold">${
                       dataFirst.pseudo
                     }</span></p>
                </div>
                ${navMenuTribuT}
            </div>

            <div id="tribu_t_conteuneur" class="exprime-pub">
                <div class="lc kg hg av vg au 2xl:ud-gap-7.5 yb ot 2xl:ud-mt-7.5 ">
                    <!-- ====== Chart pub One Start -->
                    <div class="2xl:ud-max-w-230 2xl:ud-max-w-230-tribu-t rh ni bj wr nj xr content-pub pub-t">
                        <div class="head-pub">
                            <div class="pdp-content">
                                <img src="${
                                  document.querySelector(".userProfil > img")
                                    .src
                                }" alt=""
                                  data-bs-toggle="modal" data-bs-target="#modal_show_photo" onclick="setPhotoTribu(this)"
                                >
                            </div>
                            <div class="name-content-h">
                                <div class="name-content">
                                    <p class="form-pub"  data-bs-toggle="modal" data-bs-target="#modal_publication" data-bs-whatever="@mdo">Exprimez-vous...</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- ====== Chart pub One End -->
                </div>
                <div class="publication-content">
                    <div class="list-pub-new">
                        <div id="list-publicatiotion-tribu-t">
                            
                        </div>
                        <div class="pub-tribu-t" id="showResto"></div>
                        <div class="invitation-tribu-t" id="blockInvitation"></div>
                    </div>
                    
                </div>
            </div>
            
    `;

    bindActionNewsLetterTribuT(tribu_t_name);
  }

  //
  worker.postMessage([tribu_t_name_0, lastId, 20]);
  // console.log('Message envoyé au worker');
  worker.onmessage = (event) => {
    // console.log(event.data)
    let data = event.data;
    console.log(data);

    /*---------show 5 pub par defaut-----------------*/
    if (data.length > 0) var limits = data.length > 5 ? 5 : data.length;
    let new_reaction_show;
    for (let i = 0; i < limits; i++) {
      let dataNbr;
      if (data[i].nbr === null) {
        dataNbr = 0 + " ";
      } else {
        dataNbr = data[i].nbr + " ";
      }

      new_reaction_show = data[i].nbr_reaction
        ? data[i].nbr_reaction +
          (data[i].nbr_reaction > 1 ? " réactions" : " réaction")
        : "0 réaction";
      let pub_photo = data[i].photo
        ? `<img class="publication-picture" data-bs-toggle="modal" data-bs-target="#modal_show_photo" style="cursor:pointer;" onclick="setPhotoTribu(this)" src="${
            data[i].photo /*.replace("/public","")*/
          }" alt="">`
        : `<img class="publication-picture" data-bs-toggle="modal" data-bs-target="#modal_show_photo" style="cursor:pointer;display:none;" onclick="setPhotoTribu(this)" src="" alt="">`;

      let confidentiality = parseInt(data[i].confidentiality, 10);
      let contentPublication = "";
      let _fullName =
        data[i].user_profil.firstname + " " + data[i].user_profil.lastname;
      let _profilImg = data[i].user_profil.photo_profil
        ? "/public" + data[i].user_profil.photo_profil
        : "/public/assets/image/img_avatar3.png";

      if (confidentiality === 1) {
        //public

        let changeVisibility =
          parseInt(id_c_u, 10) === parseInt(data[i].user_id, 10)
            ? `<div class="btn-group" role="group" aria-label="Button group with nested dropdown">
                                        <div class="btn-group" role="group">
                                            
                                            <span style="cursor:pointer;" id="btnGroupDrop1" class="dropdown-toggle" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                <i class="fa-solid fa-earth-oceania"></i>
                                            </span>
                                            <div class="dropdown-menu" aria-labelledby="btnGroupDrop1">
                                                <a data-id="${data[i].id}" data-name="${tribu_t_name_0}" class="dropdown-item active" onclick="updateVisibility(this)" href="#"><i class="fa-solid fa-earth-oceania"></i> Tous les Fans </a>
                                                <a data-id="${data[i].id}" data-name="${tribu_t_name_0}" class="dropdown-item" onclick="updateVisibility(this)" href="#"><i class="bi bi-lock-fill"></i> Moi uniquement</a>
                                            </div>
                                        </div>
                                    </div>`
            : "";
        let canUpdateOrDeletePub =
          parseInt(id_c_u, 10) === parseInt(data[i].user_id, 10)
            ? `<div id="contentUpdateOrDelete">
                                        <span class="float-end dropstart">
                                            <span class="float-end" style="cursor:pointer" data-bs-toggle="dropdown">
                                                <i class="bi bi-three-dots" style="cursor:pointer"></i>
                                            </span>
                                            <ul class="dropdown-menu">
                                                <li>
                                                <button onclick="setHiddenValue('${tribu_t_name_0}', 'Update', '${data[i].id}')" data-bs-toggle="modal" data-bs-target="#modal_publication_modif" class="text-primary dropdown-item"><i class="fas fa-edit"></i> Modifier</button>

                                                </li>
                                                <li>

                                                    <button onclick="setHiddenValue('${tribu_t_name_0}', '', '${data[i].id}')" data-bs-toggle="modal" data-bs-target="#deletePubModalConfirm" class="text-danger dropdown-item">
                                                        <i class="bi bi-trash3" aria-hidden="true"></i>
                                                        Supprimer
                                                    </button>
                                                </li>
                                            </ul>
                                        </span>
                                    </div>`
            : "";

        contentPublication = `<div id="${
          tribu_t_name_0 + "_" + data[i].id
        }" data-name = "${tribu_t_name_0}" data-id="${
          data[i].id
        }" data-confid="${confidentiality}" class="lc kg hg av vg au 2xl:ud-gap-7.5 yb ot 2xl:ud-mt-7.5 pub_${
          tribu_t[0].name
        }_${data[i].id}_jheo_js">
                                            <!-- ====== Chart One Start -->
                                            <div class="yd uf 2xl:ud-max-w-230-tribu-t rh ni bj wr nj xr content-pub">
                                                <div class="head-pub">
                                                    <div class="pdp-content">
                                                        <img src="${_profilImg}" 
                                                          alt=""
                                                          data-bs-toggle="modal" data-bs-target="#modal_show_photo" onclick="setPhotoTribu(this)"
                                                        >
                                                    </div>
                                                    <div class="name-content-h">
                                                        <div class="name-content responsif-none">
                                                            <h5> &ensp;${_fullName} &ensp;</h5>
                                                            <div  class="publiate_on"><p  class="p-title"> a publié sur <span>${tribu_t[0].name
                                                              .replace(
                                                                /tribu_t_[0-9]+_/,
                                                                ""
                                                              )
                                                              .replaceAll(
                                                                "_",
                                                                " "
                                                              )}</span></p></div>
                                                        </div>
<div class="publiate_on responsif-none-pc"><p  class="p-title"><span>${tribu_t[0].name
          .replace(/tribu_t_[0-9]+_/, "")
          .replaceAll("_", " ")}</span></p>
                                                        </div>
                                                        <div class="name-content responsif-none-pc">
                                                            <h5> &ensp;${_fullName} &ensp;</h5>
                                                            
                                                        </div>
                                                        <div class="status-content d-flex">
                                                            <p class="p-heure"> ${
                                                              data[i].datetime
                                                            }</p>
                                                            ${changeVisibility}
                                                            
                                                        </div>
                                                    </div>
                                                    ${canUpdateOrDeletePub}
                                                    
                                                </div>
                                                    
                                                <div class="card-pub-actu">
                                                    <p class="text-pub"> ${data[
                                                      i
                                                    ].publication
                                                      .replace(/"/gi, "")
                                                      .replace(
                                                        /\\n/g,
                                                        "</br>"
                                                      )}</p>
                                                    ${pub_photo}
                                                </div>

                                                <div class="card-reaction">
                                                    <p class="text-comment content_nbr_comment_jheo_js" onclick="">
                                                                 <span class="nbr_reaction_elie_js" id="nbr_reaction_pub_${
                                                                   tribu_t[0]
                                                                     .name
                                                                 }_${
          data[i].id
        }" onclick="getAllReaction('${data[i].id}', 
                                                        '${
                                                          tribu_t[0].name
                                                        }', '${
          data[i].user_id
        }')" data-bs-toggle="modal" data-bs-target="#listeReacteur">${new_reaction_show}</span>
          <span style="cursor:pointer;" data-bs-toggle="modal" data-bs-target="#commentaire" class="nbr_comment_jheo_js" 
			    onclick="getAllComment('${data[i].id}', '${tribu_t[0].name}', '${
          data[i].user_id
        }')"> ${dataNbr} commentaire(s)</span>
                                               
                                                    </p>
                                                    <div class="reaction-icon d-flex">
                                                        <i style="cursor:pointer;" class="${
                                                          data[i].reaction == 1
                                                            ? __userLoggedId ==
                                                              data[i]
                                                                .user_id_react
                                                              ? "bi-heart-fill"
                                                              : "bi-heart"
                                                            : "bi-heart"
                                                        } like reaction_${
          tribu_t[0].name
        }_${data[i].id}" onclick="isLike('${data[i].id}', '${
          data[i].user_id
        }', '${tribu_t[0].name}')"></i>
                                                                            <i style="cursor:pointer;" class="fa-regular fa-comment comment" data-bs-toggle="modal" data-bs-target="#commentaire"  
                                                            onclick="getAllComment('${
                                                              data[i].id
                                                            }', '${
          tribu_t[0].name
        }', '${data[i].user_id}')"></i>
                                                                                  </div>
                                                </div>
                                                
                                            </div>
                                            <!-- ====== Chart One End -->
                                        </div>

                    

                    <!-- Modal commentair -->
                    <div class="modal fade" id="modalCommentairTribuT${
                      data[i].id
                    }" tabindex="-1" aria-labelledby="modalCommentairTribuTLabel" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                        <div class="modal-header">
                            <h3 class="count_comment">Publication de ...</h3>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="container">
                                <div class="center-block" id="center-content-cmnt${
                                  data[i].id
                                }">
                                    
                                </div>
                               
                                <div class="modal-footer">
                                    <input type="text" class="commentair-tribu-t" placeholder="votre commentaire">
                                    <i class="fa-solid fa-paper-plane" id="mlXXdZE${
                                      data[i].id
                                    }hjki" onclick="putComment(event)"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    `;
      } else if (confidentiality === 2) {
        //privée
        //moi uniquement
        // console.log(id_c_u,data[i].user_id)
        if (parseInt(id_c_u, 10) === parseInt(data[i].user_id, 10)) {
          contentPublication = `
                                        <div id="${
                                          tribu_t_name_0 + "_" + data[i].id
                                        }" data-name = "${tribu_t_name_0}" data-id="${
            data[i].id
          }" data-confid="${confidentiality}" class="lc kg hg av vg au 2xl:ud-gap-7.5 yb ot 2xl:ud-mt-7.5 pub_${
            tribu_t[0].name
          }_${data[i].id}_jheo_js">
                                            <!-- ====== Chart One Start -->
                                            <div class="yd uf 2xl:ud-max-w-230 rh ni bj wr nj xr content-pub">
                                                <div class="head-pub">
                                                    <div class="pdp-content">
                                                        <img src="${_profilImg}" 
                                                          alt=""
                                                          data-bs-toggle="modal" data-bs-target="#modal_show_photo" onclick="setPhotoTribu(this)"
                                                        >
                                                    </div>
                                                    <div class="name-content-h">
                                                        <div class="name-content  responsif-none">
                                                            <h5> &ensp;${_fullName} &ensp;</h5>
                                                            <div  class="publiate_on"><p  class="p-title"> a publié sur <span>${tribu_t[0].name
                                                              .replace(
                                                                /tribu_t_[0-9]+_/,
                                                                ""
                                                              )
                                                              .replaceAll(
                                                                "_",
                                                                " "
                                                              )}</span></p></div>
                                                        </div>
<div class="publiate_on responsif-none-pc"><p  class="p-title"><span>${tribu_t[0].name
            .replace(/tribu_t_[0-9]+_/, "")
            .replaceAll("_", " ")}</span></p>
                                                        </div>
                                                        <div class="name-content responsif-none-pc">
                                                            <h5> &ensp;${_fullName} &ensp;</h5>
                                                            
                                                        </div>
                                                        <div class="status-content d-flex">
                                                            <p class="p-heure"> ${
                                                              data[i].datetime
                                                            }</p>
                                                            <div class="btn-group" role="group" aria-label="Button group with nested dropdown">
                                                                
                                                                <div class="btn-group" role="group">
                                                                    
                                                                    <span style="cursor:pointer;" id="btnGroupDrop1" class="dropdown-toggle" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                                        <i class="bi bi-lock-fill"></i>
                                                                    </span>
                                                                    <div class="dropdown-menu" aria-labelledby="btnGroupDrop1">
                                                                        <a data-id="${
                                                                          data[
                                                                            i
                                                                          ].id
                                                                        }" data-name="${tribu_t_name_0}" class="dropdown-item" onclick="updateVisibility(this)" href="#"><i class="fa-solid fa-earth-oceania"></i> Tous les Fans </a>
                                                                        <a data-id="${
                                                                          data[
                                                                            i
                                                                          ].id
                                                                        }" data-name="${tribu_t_name_0}" class="dropdown-item active" onclick="updateVisibility(this)" href="#"><i class="bi bi-lock-fill"></i> Moi uniquement</a>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            
                                                        </div>
                                                    </div>
                                                    <div id="contentUpdateOrDelete">
                                                        <span class="float-end dropstart">
                                                            <span class="float-end" style="cursor:pointer" data-bs-toggle="dropdown">
                                                                <i class="bi bi-three-dots" style="cursor:pointer"></i>
                                                            </span>
                                                            <ul class="dropdown-menu">
                                                                <li>
                                                                <button onclick="setHiddenValue('${tribu_t_name_0}', 'Update', '${
            data[i].id
          }')" data-bs-toggle="modal" data-bs-target="#modal_publication_modif" class="text-primary dropdown-item"><i class="fas fa-edit"></i> Modifier</button>

                                                                </li>
                                                                <li>

                                                                    <button onclick="setHiddenValue('${tribu_t_name_0}', '', '${
            data[i].id
          }')" data-bs-toggle="modal" data-bs-target="#deletePubModalConfirm" class="text-danger dropdown-item">
                                                                        <i class="bi bi-trash3" aria-hidden="true"></i>
                                                                        Supprimer
                                                                    </button>
                                                                </li>
                                                            </ul>
                                                        </span>
                                                    </div>

                                                    
                                                </div>
                                                    
                                                <div class="card-pub-actu">
                                                    <p class="text-pub"> ${data[
                                                      i
                                                    ].publication.replace(
                                                      /"/gi,
                                                      ""
                                                    )}</p>
                                                    ${pub_photo}
                                                </div>

                                                <div class="card-reaction">
                                                    <p class="text-comment content_nbr_comment_jheo_js" onclick="">
                                                        <span class="nbr_reaction_elie_js" id="nbr_reaction_pub_${
                                                          tribu_t[0].name
                                                        }_${
            data[i].id
          }" onclick="getAllReaction('${data[i].id}', 
                                        '${tribu_t[0].name}', '${
            data[i].user_id
          }')" data-bs-toggle="modal" data-bs-target="#listeReacteur">${new_reaction_show}</span>
                <span style="cursor:pointer;"data-bs-toggle="modal" data-bs-target="#commentaire" class="nbr_comment_jheo_js" 
				onclick="getAllComment('${data[i].id}', '${tribu_t[0].name}', '${
            data[i].user_id
          }')">  ${dataNbr} commentaire(s) </span>
                                                    </p>
                                                    <div class="reaction-icon d-flex">
                                                        <i style="cursor:pointer;" class="${
                                                          data[i].reaction == 1
                                                            ? __userLoggedId ==
                                                              data[i]
                                                                .user_id_react
                                                              ? "bi-heart-fill"
                                                              : "bi-heart"
                                                            : "bi-heart"
                                                        } like reaction_${
            tribu_t[0].name
          }_${data[i].id}" onclick="isLike('${data[i].id}', '${
            data[i].user_id
          }', '${tribu_t[0].name}')"></i>
                                                                                  <i class="fa-regular fa-comment comment" data-bs-toggle="modal" data-bs-target="#commentaire"  
                                                        onclick="getAllComment('${
                                                          data[i].id
                                                        }', '${
            tribu_t[0].name
          }', '${data[i].user_id}')"></i>
                                                    </div>
                                                </div>
                                                
                                            </div>
                                            <!-- ====== Chart One End -->
                                        </div>

                                        <!-- Modal commentair -->
                                        <div class="modal fade" id="modalCommentairTribuT${
                                          data[i].id
                                        }" tabindex="-1" aria-labelledby="modalCommentairTribuTLabel" aria-hidden="true">
                                        <div class="modal-dialog">
                                            <div class="modal-content">
                                            <div class="modal-header">
                                                <h3 class="count_comment">Publication de ...</h3>
                                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                            </div>
                                            <div class="modal-body">
                                                <div class="container">
                                                    <div class="center-block" id="center-content-cmnt${
                                                      data[i].id
                                                    }">
                                                        
                                                    </div>
                                                
                                                    <div class="modal-footer">
                                                        <input type="text" class="commentair-tribu-t" placeholder="votre commentaire">
                                                        <i class="fa-solid fa-paper-plane" id="mlXXdZE${
                                                          data[i].id
                                                        }hjki" onclick="putComment(event)"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        `;
        } else {
          contentPublication = "";
        }
      }

      if (document.querySelector("#list-publicatiotion-tribu-t")) {
        document.querySelector("#list-publicatiotion-tribu-t").innerHTML +=
          contentPublication;
      }

      showComment();
    }

    //---------after shwo in each scroll ---------------
    const gen = genDataPubOfAllFans(data, 5);
    const gen_length = data.length - 5;
    let lastIdf = 0;
    let genCursorPos = 0;
    if (gen_length > 0) {
      window.addEventListener("scroll", (e) => {
        const scrollable =
          document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = window.scrollY;
        if (Math.ceil(scrolled) === scrollable) {
          //if (data) {

          // console.log("data id" + data.id);
          // lastIdf = data.length > 0 ?  parseInt(data.id) : 0;
          console.log("new c" + genCursorPos);
          console.log("last id" + lastIdf);
          if (genCursorPos === gen_length && genCursorPos > 0) {
            //TODO appel recurcive
            showdDataContent(dataFirst, type, tribu_t_name, id_c_u, lastIdf);
          } else {
            // console.log(data)
            // console.log("last id " + lastId)
            let dataG = gen.next().value;

            if (dataG !== undefined) {
              let dataNbr;
              if (dataG.nbr === null) {
                dataNbr = 0 + " ";
              } else {
                dataNbr = dataG.nbr + " ";
              }

              new_reaction_show = dataG.nbr_reaction
                ? dataG.nbr_reaction +
                  (dataG.nbr_reaction > 1 ? " réactions" : " réaction")
                : "0 réaction";
              let pub_photo = dataG.photo
                ? `<img class="publication-picture" data-bs-toggle="modal" data-bs-target="#modal_show_photo" style="cursor:pointer;" onclick="setPhotoTribu(this)" src="${
                    dataG.photo /*.replace("/public","")*/
                  }" alt="">`
                : `<img class="publication-picture" data-bs-toggle="modal" data-bs-target="#modal_show_photo" style="cursor:pointer;display:none;" onclick="setPhotoTribu(this)" src="" alt="">`;

              let confidentiality = parseInt(dataG.confidentiality, 10);

              let _fullName =
                dataG.user_profil.firstname + " " + dataG.user_profil.lastname;
              let _profilImg = dataG.user_profil.photo_profil
                ? "/public" + dataG.user_profil.photo_profil
                : "/public/assets/image/img_avatar3.png";
              lastIdf = dataG?.id;
              new_reaction_show = dataG.nbr_reaction
                ? dataG.nbr_reaction +
                  (dataG.nbr_reaction > 1 ? " réactions" : " réaction")
                : "0 réaction";
              //console.log("data N°: " + i);
              console.log(dataG);
              const contentPublication = `
                                    <div class="lc kg hg av vg au 2xl:ud-gap-7.5 yb ot 2xl:ud-mt-7.5 pub_${
                                      tribu_t[0].name
                                    }_${dataG.id}_jheo_js">
                                            <!-- ====== Chart One Start -->
                                            <div class="yd uf 2xl:ud-max-w-230 rh ni bj wr nj xr content-pub">
                                                <div class="head-pub">
                                                    <div class="pdp-content">
                                                        <img src="${_profilImg}" 
                                                          alt=""
                                                          data-bs-toggle="modal" data-bs-target="#modal_show_photo" onclick="setPhotoTribu(this)"
                                                        >
                                                    </div>
                                                    <div class="name-content-h">
                                                        <div class="name-content responsif-none">
                                                            <h5> &ensp;${_fullName} &ensp;</h5>
                                                            <div class="publiate_on"><p  class="p-title"> a publié sur <span>${tribu_t[0].name
                                                              .replace(
                                                                /tribu_t_[0-9]+_/,
                                                                ""
                                                              )
                                                              .replaceAll(
                                                                "_",
                                                                " "
                                                              )}</span></p></div>
                                                        </div>
<div class="publiate_on responsif-none-pc"><p  class="p-title"><span>${tribu_t[0].name
                .replace(/tribu_t_[0-9]+_/, "")
                .replaceAll("_", " ")}</span></p>
                                                        </div>
                                                        <div class="name-content responsif-none-pc">
                                                            <h5> &ensp;${_fullName} &ensp;</h5>
                                                            
                                                        </div>
                                                        <div class="status-content d-flex">
                                                            <p class="p-heure"> ${
                                                              dataG.datetime
                                                            }</p>
                                                            <div class="btn-group" role="group" aria-label="Button group with nested dropdown">
                                                                
                                                                <div class="btn-group" role="group">
                                                                    
                                                                    <span style="cursor:pointer;" id="btnGroupDrop1" class="dropdown-toggle" 
                                                                    data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="fa-solid fa-earth-oceania"></i> </span>
                                                                    <div class="dropdown-menu" aria-labelledby="btnGroupDrop1">
                                                                        <a data-id="${
                                                                          dataG.id
                                                                        }" data-name="${tribu_t_name_0}" class="dropdown-item" onclick="updateVisibility(this)"
                                                                         href="#"><i class="fa-solid fa-earth-oceania"></i> Tous les Fans </a>
                                                                        <a data-id="${
                                                                          dataG.id
                                                                        }" data-name="${tribu_t_name_0}" class="dropdown-item" onclick="updateVisibility(this)" href="#"><i class="bi bi-lock-fill"></i> Moi uniquement</a>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            
                                                        </div>
                                                    </div>
                                                    <div id="contentUpdateOrDelete">
                                                        <span class="dropend">
                                                            <span style="cursor:pointer" data-bs-toggle="dropdown">
                                                                <i class="bi bi-three-dots" style="cursor:pointer"></i>
                                                            </span>
                                                            <ul class="dropdown-menu">
                                                                <li>
                                                                    <button data-bs-toggle="modal" data-bs-target="#modal_publication_modif" class="dropdown-item"><i class="fas fa-edit"></i> Modifier</button>
                                                                </li>
                                                                <li>

                                                                    <button data-bs-toggle="modal" data-bs-target="#deletePubModalConfirm" class="dropdown-item">
                                                                        <i class="bi bi-trash3" aria-hidden="true"></i>
                                                                        Supprimer
                                                                    </button>
                                                                </li>
                                                            </ul>
                                                        </span>
                                                    </div>

                                                </div>
                                                    
                                                <div class="card-pub-actu">
                                                    <p class="text-pub"> ${dataG.publication.replace(
                                                      /"/gi,
                                                      ""
                                                    )}</p>
                                                    ${pub_photo}
                                                </div>

                                                <div class="card-reaction">
                                                    <p class="text-comment content_nbr_comment_jheo_js" onclick="">
                                                        <span class="nbr_reaction_elie_js" id="nbr_reaction_pub_${
                                                          tribu_t[0].name
                                                        }_${
                dataG.id
              }" onclick="getAllReaction('${dataG.id}', '${
                tribu_t[0].name
              }', '${
                dataG.user_id
              }')" data-bs-toggle="modal" data-bs-target="#listeReacteur">${new_reaction_show}</span>
                 <span style="cursor:pointer;" data-bs-toggle="modal" data-bs-target="#commentaire" class="nbr_comment_jheo_js" 
				 	onclick="getAllComment('${dataG.id}', '${tribu_t[0].name}', '${
                dataG.user_id
              }')"> ${dataNbr} commentaire(s) </span>
                                                    </p>

                                                    <div class="reaction-icon d-flex">
                                                        <i style="cursor:pointer;" class="${
                                                          dataG.reaction == 1
                                                            ? __userLoggedId ==
                                                              data[i]
                                                                .user_id_react
                                                              ? "bi-heart-fill"
                                                              : "bi-heart"
                                                            : "bi-heart"
                                                        } like reaction_${
                tribu_t[0].name
              }_${dataG.id}" onclick="isLike('${dataG.id}', '${
                dataG.user_id
              }', '${tribu_t[0].name}')"></i>
                                                        <i class="fa-regular fa-comment comment" data-bs-toggle="modal" data-bs-target="#commentaire"  
                                                        onclick="getAllComment('${
                                                          dataG.id
                                                        }', '${
                tribu_t[0].name
              }', '${dataG.user_id}')"></i>
                                                    </div>
                                                </div>
                                                
                                            </div>
                                            <!-- ====== Chart One End -->
                                        </div>
                                    `;
              if (document.querySelector("#list-publicatiotion-tribu-t")) {
                document.querySelector(
                  "#list-publicatiotion-tribu-t"
                ).innerHTML += contentPublication;
              }
            }
          }

          //data = gen.next().value;
          //console.log(data);

          genCursorPos++;
          //}
        }
      });
    }
  };
  //showComment();
}

function showCommentaireTribu_T(event, idmin = 0, b) {
  event.preventDefault();
  console.log(idmin);
  const table_cmmnt = tribu_t_name_0 + "_commentaire";
  const pub_id = event.target.dataset.foo.replace(/[^0-9]/g, "");

  const limits = 5;
  if (b) {
    if (document.getElementById("center-content-cmnt" + pub_id)) {
      document.getElementById("center-content-cmnt" + pub_id).innerHTML = "";
    }
  }
  //console.log(document.getElementById("center-content-cmnt" + pub_id))
  else if (document.querySelector("a.voir-plus"))
    event.target.parentNode.removeChild(event.target);

  workerGetCommentaireTribuT.postMessage([table_cmmnt, pub_id, idmin, limits]);
}

function showComment(id_resto) {
  // alert(id_resto)

  workerGetCommentaireTribuT.onmessage = (e) => {
    // console.log("afffichage comment");
    // console.log(e.data);
    const datas = e.data[0];
    const index = e.data[0].length;

    for (let i = 0; i < index; i++) {
      // console.log(i);
      let lapstime = calculateDurationOfComment(datas[i].datetime);
      let commentaire = `<div class="media-comment">
                                            <a class="avatar-content" href="javascript://">
                                                <img class="avatar" src="https://randomuser.me/api/portraits/men/77.jpg" width="45" height="45"/>
                                            </a>
                                            <div class="media-content">
                                                <div class="media-comment-body">
                                                    <div  class="media-option"><a class="ripple-grow" id="dropdownMenuButton" href="javascript://" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                        <svg  class="ripple-icon" width="28" height="28" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" viewBox="0 0 24 24">
                                                            <g fill="currentColor">
                                                            <circle cx="5" cy="12" r="2"></circle>
                                                            <circle cx="12" cy="12" r="2"></circle>
                                                            <circle cx="19" cy="12" r="2"></circle>
                                                            </g>
                                                        </svg></a>
                                                    </div>
                                                    <div class="media-comment-data-person">
                                                        <a class="media-comment-name" href="javascript://">${datas[i].userfullname}</a><span class="text-muted">${lapstime}</span>
                                                    </div>
                                                    <div class="media-comment-text" id="comment-container">
                                                        <p >
                                                            ${datas[i].commentaire}
                                                        </p>
                                                    </div>
                                                </div>
                                                
                                            </div>
                                        </div>`;
      if (i == index - 1)
        commentaire +=
          '<a class="voir-plus" data-foo="kjjk_' +
          e.data[1] +
          'xdjyfvfAAS" onclick=" showCommentaireTribu_T(event,' +
          datas[i].id +
          ',false)">Voir plus de commentaire</a>';

      document.getElementById(
        "center-content-cmnt" + datas[i].pub_id
      ).innerHTML += commentaire;
    }
  };
}

function putComment(event) {
  const pubId = event.target.id.replace(/[^0-9]/g, "");
  const commentaire = event.target.parentNode.querySelector("input").value;

  const param = {
    pubId: pubId,
    commentaire: commentaire,
    tbl_cmnt_name: tribu_t_name_0 + "_commentaire",
  };
  const request = new Request("/user/send/comment/pub", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(param),
  });
  fetch(request).then((response) => {
    if (response.status === 200 && response.ok) {
      response.json().then((json) => {
        let div = document.createElement("div");
        div.classList.add("media-comment");
        let commentaire = `  <a class="avatar-content" href="javascript://">
                                        <img class="avatar" src="https://randomuser.me/api/portraits/men/77.jpg" width="45" height="45"/>
                                    </a>
                                    <div class="media-content">
                                        <div class="media-comment-body">
                                            <div  class="media-option"><a class="ripple-grow" id="dropdownMenuButton" href="javascript://" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                <svg  class="ripple-icon" width="28" height="28" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" viewBox="0 0 24 24">
                                                    <g fill="currentColor">
                                                    <circle cx="5" cy="12" r="2"></circle>
                                                    <circle cx="12" cy="12" r="2"></circle>
                                                    <circle cx="19" cy="12" r="2"></circle>
                                                    </g>
                                                </svg></a>
                                            </div>
                                            <div class="media-comment-data-person">
                                                <a class="media-comment-name" href="javascript://">${json.pseudo}</a><span class="text-muted">maintenant</span>
                                            </div>
                                            <div class="media-comment-text" id="comment-container">
                                                <p >
                                                    ${json.commentaire}
                                                </p>
                                            </div>
                                        </div>
                                    </div>`;
        div.innerHTML = commentaire;

        const firstComment = document.querySelector(
          `#center-content-cmnt${json.pubId} > div:nth-child(1)`
        );
        if (firstComment)
          document
            .getElementById("center-content-cmnt" + json.pubId)
            .insertBefore(div, firstComment);
        else
          document
            .getElementById("center-content-cmnt" + json.pubId)
            .appendChild(div);
      });
    }
  });
  // console.log(pubId, commentaire);
}

function* genDataPubOfAllFans(data, index) {
  for (let i = index; i < data.length; i++) if (i < data.length) yield data[i];
}

function test() {
  return new Promise((resolve, reject) => {
    setInterval(() => resolve(), 5000);
  });
}

/**
 * @deprecated
 * @param {*} tribu_t_name 
 * @returns 
 */
async function showdData(tribu_t_name) {
  const request1 = new Request(`/user/tribu_one/${tribu_t_name}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json; charset=utf-8",
    },
  });
  return await fetch(request1).then((res) => res.json());
}
/**
 * author faniry
 * @param {*} id 
 * @param {*} tribuTname 
 * @returns 
 */
async function showdDataV2(id,tribuTname) {
  const request1 = new Request(`/user/tribu_onev2/${id}/${tribuTname}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json; charset=utf-8",
    },
  });
  return await fetch(request1).then((res) => res.json());
}
/**
 * this function show all resto pastilled
 * @param {*} table_rst_pastilled
 * @param {*} id_c_u
 */
function showResto(table_rst_pastilled, id_c_u) {
  if (document.querySelector("li.listNavBarTribu > a.active")) {
    document
      .querySelector("li.listNavBarTribu > a.active")
      .classList.remove("active");
  }
  document
    .querySelector("li.listNavBarTribu.restoNotHide > a")
    .classList.add("active");

  let restoContainer = document.querySelector("#tribu_t_conteuneur");
  restoContainer.innerHTML = `
                                <div class="row mt-3 p-3">
                                    <div class="col-12">
                                        <div id="form_past"></div>
                                        <div class="g-3">
                                            <div class="input-group mb-3">
                                                <input type="text" class="form-control  rounded elie-resto-rech" placeholder="Quoi ?" id="resto-rech">
                                                <input type="text" class="form-control  rounded elie-resto-rech" placeholder="Où ?" id="resto-rech-ou">
                                                <button class="btn btn-light" type="button" id="button-addon2"  onclick="listResto()"><i class="fas fa-search"></i></button>
                                            </div>
                                            <div class="list-group" style="z-index:9; position:relative;height:120px;display:none;" id="result_resto_past">
                                            </div>
                                        </div>
                                    </div>
                                    <!--<div class="col-lg-4">
                                        <div class="apropos-tribu-t ps-2 ">
                                            <p class="fw-bold">A propos tribu-t</p>
                                            <p>
                                                ${descriptionTribuT}
                                            </p>
                                        </div>
                                    </div>-->
                                </div>
                                <!--<div id="result_resto_chr" class="result_resto_chr"></div>-->
                                `;

  if (document.getElementById("list_resto_pastilled")) {
    let childreen = document.getElementById("list_resto_pastilled").children;
    for (let child of childreen)
      document.getElementById("list_resto_pastilled").removeChild(child);
  }

  restoContainer.classList.add("bg-white");
  restoContainer.classList.add("p-2");

  let head_table = `<h5 class="text-primary mb-4">Liste des restaurants pastillés</h5><table id="table_resto_pastilled" class="display m-2" style="width:100%">
        <thead>
            <tr>
                <th>Nom de restaurant</th>
                <th>Note</th>
                <th>Liste des avis</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>`;
  let foot_table = `</tbody>
    </table>`;
  let body_table = ``;
  workerRestoPastilled.postMessage([table_rst_pastilled]);

  workerRestoPastilled.onmessage = (e) => {
    let restos = e.data;
    // console.log("workerresto :::::");
    // console.log(restos);
    let imgSrc = "";
    let avatar = ""; //"{{avatar}}"
    if (avatar != null) {
      imgSrc = "/public/uploads/tribus/photos/" + avatar;
    } else {
      imgSrc = "/public/uploads/tribu_t/photo/avatar_tribu.jpg";
    }

    if (restos.length > 0) {
      for (let resto of restos) {
        //<a target="_blank" href="/restaurant/departement/${resto.departement}/${resto.id_dep}/details/${resto.id_unique}">

        if (resto.isPastilled) {
          let id = resto.id;
          let id_resto = resto.id_resto;
          let id_resto_comment =
            resto.All_id_r_com != null ? resto.All_id_r_com.split(",") : [];

          let id_user = resto.All_user != null ? resto.All_user.split(",") : [];
          // console.log(id_user)
          let denominationsF = resto.denomination_f;
          let nbrAvis = resto.nbrAvis;
          let key = 0;
          let note = resto.globalNote ? resto.globalNote : 0;

          let adresse =
            resto.numvoie +
            " " +
            resto.nomvoie +
            " " +
            resto.codpost +
            " " +
            resto.dep_name;

          let text1 = "";

          let action = "";
//${name}', '${adresse}', '${depName}','${dep}','${json.id}
          //openDetail('denominationsF', 'adresse', 'resto.dep_name','resto.dep','resto.id')

          for (let [k, v] of id_user.entries()) {
            if (v === id_c_u) key = k;
          }
          if (id_user.includes(id_c_u)) {
            // console.log("up " + denominationsF)
            // text = `<button type="button" class="btn btn-primary disabled-link" id="Submit-Avis-resto-tribu-t-tom-js" data-bs-toggle="modal" data-bs-target="#RestoModalNote${id_resto_comment[key]}" onclick="updateNote(event,${id_resto_comment[key]})">Modifiez votre avis</button>`
            action = "update";

            // text1 = "Modifiez votre avis"
            text1 = "Ajouter une autre avis";
          } else {
            // console.log("crt " + denominationsF)
            // text = `<button type="button" class="btn btn-primary" id="Submit-Avis-resto-tribu-t-tom-js" data-bs-toggle="modal" data-bs-target="#RestoModalNote${id_resto_comment[key]}" onclick="sendNote(event,${id_c_u},${id},${id_resto_comment[key]})">Notez</button>`
            action = "create";
            text1 = "Notez";
          }
//http://localhost:8090/restaurant/specific?nom_dep=Allier&id_dep=03#
          body_table += `
                        <tr id="restaurant_${resto.id_resto}">
                            <td class="d-flex bd-highlight align-items-center">
                                <div class="elie-img-pastilled">${image_tribu_t}</div>
                                <span class="ms-3" style="font-size:12pt;cursor:pointer" 
                                  onclick="openDetail('${denominationsF}', '${adresse}', '${resto.dep_name}','${resto.dep}','${resto.id}')"
                                  data-toggle="tooltip" data-placement="top" title="Cliquez pour voir les détails."
                                >
                                ${denominationsF} 
                                </span> 
                                
                            </td>
                            
                            <td class="data-note-${resto.id}" style="cursor:not-allowed">${note}/4</td>
                            <td>
                                <!--<div id="etoile_${id_resto}" class="non_active">
                                    <i class="fa-solid fa-star" data-rank="1"></i>
                                    <i class="fa-solid fa-star" data-rank="2"></i>
                                    <i class="fa-solid fa-star" data-rank="3"></i>
                                    <i class="fa-solid fa-star" data-rank="4"> </i>-->
                                    <!--<a class="text-secondary" style="cursor: pointer;text-decoration:none;" data-bs-toggle="modal" data-bs-target="#RestoModalComment${resto.id}" onclick="showComment(${resto.id})"> ${nbrAvis} Avis</a>-->
                                    <!--<a class="text-secondary data-avis-${resto.id}" style="cursor: pointer;text-decoration:none;" onclick="openAvis(${nbrAvis}, ${resto.id})"> ${nbrAvis} Avis</a> -->
                                    <a class="btn btn-sm bg_orange data-avis-${resto.id}" 
                                      style="cursor: pointer;text-decoration:none;" 
                                      data-toggle="tooltip" data-placement="top" 
									                    title="Découvrir les avis des partisans de ce restaurant."
                                      data-bs-toggle="modal" data-bs-target="#staticBackdrop" onclick="showListInTribuT('${resto.id}', 'resto')"> ${nbrAvis} Avis
                                      
                                    </a>
                                <!--</div>-->
                            </td>
                            <td>
                                <button class="btn btn-primary elie-plus-${resto.id}" style="" 
                                onclick="openPopupAction('${resto.id}','${resto.denomination_f}', '${adresse}','${text1}', '${action}')"
                                data-toggle="tooltip" data-placement="top" title="Choisissez une action  à entreprendre pour ce restaurant."
                                >
                                <i class="fas fa-plus"></i> Action pour ce restaurant</button>
                                <!--<button type="button" class="btn btn-secondary disabled-link float-end" data-bs-toggle="modal" data-bs-target="#modal_repas" style="cursor:pointer;" onclick="createRepas('${resto.id_pastille}','${resto.denomination_f}', '${resto.latitude}','${resto.longitude}')">Créer un repas</button>
                                
                                <button type="button" class="btn btn-secondary disabled-link" data-bs-toggle="modal" data-bs-target="#RestoModalNote${id_resto_comment[key]}">${text1}</button>-->
                            </td>
                        </tr>
                    `;
        }
      }
      // staticBackdrop
      restoContainer.innerHTML += head_table + body_table + foot_table;

      $("#table_resto_pastilled").DataTable({
        language: {
          url: "//cdn.datatables.net/plug-ins/1.13.4/i18n/fr-FR.json",
        },
      });

      // document.querySelector("#table_resto_pastilled_wrapper").classList.add("p-2")
    } else {
      restoContainer.style.textAlign = "center";
      // restoContainer.classList.add("mt-5")
      restoContainer.innerHTML += "Aucun restaurant pastillé pour le moment";
    }

    restoContainer.style.display = "block";
    // invitationsContainer.innerHTML = "";
    // invitationsContainer.style.display = "none"
    // photosContainer.innerHTML = "";
    // photosContainer.style.display = "none"
    // showCreatePub.style.display = "none"
    //  showCreatePub_mobile.style.display = "none"
    // showPub.style.display = "none"
  };

  let rows = document.querySelectorAll(
    "#restaurants > ul.list-group > li.list-group-item"
  );

  if (document.querySelector("#resto-rech")) {
    document.querySelector("#resto-rech").addEventListener("keyup", (event) => {
      // alert("ato")
      const q = event.target.value.toLowerCase();

      if (event.keyCode === 13) {
        listResto();
      } else {
        document.querySelectorAll("#restaurants > ul > li").forEach((elem) => {
          if (elem.textContent.toLowerCase().includes(q)) {
            elem.style = "display : flex!important;";
          } else {
            elem.style = "display : none !important;";
          }
        });
      }
    });
  }
}

// document.querySelector("#resto-rech")

//faniry j'ai commenté ce bout de code car il ne fait rien
// if (document.querySelector("#resto-rech")) {
  //   const src_resto = document.querySelector("#resto-rech");

  //   src_resto.addEventListener("keyup", function onEvent(event) {
    //     // alert("ato")
    //     // const q = event.target.value.toLowerCase();
    //     // if (event.keyCode === 13) {
    //     //     alert("ato")
    //     //     listResto()
    //     // }else{
    //     //     document.querySelectorAll("#restaurants > ul > li").forEach(elem=>{
    //     //         if(elem.textContent.toLowerCase().includes(q)){
    //     //             elem.style = "display : flex!important;"
    //     //         }else{
    //     //             elem.style = "display : none !important;"
    //     //         }
    //     //     })
    //     // }
  //   });
// }

function printNodeGlobale(element, globalNote) {
  let rankRange = [1, 2, 3, 4];
  for (let star of element) {
    // console.log(star)
    if (rankRange.includes(parseInt(star.dataset.rank, 10))) {
      if (parseInt(star.dataset.rank, 10) <= Math.trunc(globalNote))
        star.style.color = "#F5D165";
      if (globalNote % 1 != 0) {
        //console.log(parseInt(star.dataset.rank, 10)+" "+(Math.trunc(globalNote) + 1))
        if (parseInt(star.dataset.rank, 10) == Math.trunc(globalNote) + 1) {
          //console.log(parseInt(star.dataset.rank, 10)+" "+(Math.trunc(globalNote) + 1))
          let rateYello = (globalNote % 1) * 100;
          let rateBlack = 100 - rateYello;
          star.style = `
                     background: linear-gradient(90deg, #F5D165 ${rateYello}%, #000 ${rateBlack}%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    `;
        }
      }
    }
  }
}
function sendNote(note, commentaire, _idResto) {
  const content = {
    // idUser: _idUser,
    idResto: _idResto,
    tableName: tribu_t_name_0 + "_restaurant_commentaire",
    note: note,
    commentaire: commentaire,
  };

  const jsonStr = JSON.stringify(content);
  //  console.log(jsonStr)
  const request = new Request("/push/comment/resto/pastilled", {
    method: "POST",
    body: jsonStr,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  fetch(request).then((response) => {
    if (response.status == 200 && response.ok) {
      document.querySelector(".data-note-" + _idResto).innerHTML =
        parseFloat(note, 2).toFixed(2).toString() + "/4";

      let last_avis = parseInt(
        document
          .querySelector(".data-avis-" + _idResto)
          .textContent.replaceAll(/[^0-9]/g, "")
      );

      document.querySelector(".data-avis-" + _idResto).innerHTML =
        parseInt(last_avis + 1) + " Avis";

      document
        .querySelector(".data-avis-" + _idResto)
        .setAttribute(
          "onclick",
          "openAvis(" + parseInt(last_avis + 1) + "," + _idResto + ")"
        );

      const openPopup = document
        .querySelector(".elie-plus-" + _idResto)
        .getAttribute("onclick");

      document
        .querySelector(".elie-plus-" + _idResto)
        .setAttribute(
          "onclick",
          openPopup
            .replaceAll("create", "update")
            .replaceAll("Notez", "Modifier votre avis")
        );

      swal({
        title: "Noté!",
        text: "Note ajouté avec succès",
        icon: "success",
        button: "Ok",
      });
    } else {
      swal({
        title: "Erreur!",
        text: "Note non envoyé, veuillez réessayer!",
        icon: "error",
        button: "Ok",
      });
    }
  });
}
function updateNote(note, commentaire, id_resto) {
  const table_resto_comment = tribu_t_name_0 + "_restaurant_commentaire";

  fetch(
    "/user/comment/tribu/restos-pastilles/" +
      tribu_t_name_0 +
      "_restaurant/" +
      id_resto
  )
    .then((response) => response.json())
    .then((avis) => {
      if (avis.length > 0) {
        for (let av of avis) {
          const content = {
            tableName: table_resto_comment,
            note: note,
            commentaire: commentaire,
            idRestoComment: av.id_resto_comment,
          };
          const jsonStr = JSON.stringify(content);
          const request = new Request("/up/comment/resto/pastilled", {
            method: "POST",
            body: jsonStr,
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          });
          fetch(request);
        }
      }
    });

  document.querySelector(".data-note-" + id_resto).innerHTML =
    parseFloat(note, 2).toFixed(2).toString() + "/4";

  swal({
    title: "A jour!",
    text: "Note modifié avec succès!",
    icon: "success",
    button: "Ok",
  });
}

function findResto(val, localisation = "") {
  const request = new Request(
    `/api/search/restaurant?cles0=${val}&cles1=${localisation}`,
    {
      method: "GET",
    }
  );

  document.querySelector("#result_resto_past").style.display = "block;";

  document.querySelector("#extModalLabel").innerText = "Recherche en cours...";
  document.querySelector(
    "#elie-restou"
  ).innerHTML = `<div class="d-flex justify-content-center">
        <div class="spinner-border" role="status">
            <span class="sr-only">Loading...</span>
        </div>
        </div>`;

  fetch(request)
    .then((response) => response.json())
    .then((data) => {
      let jsons = data.results[0];

      jsons.length > 1
        ? (document.querySelector("#extModalLabel").innerText =
            jsons.length + " restaurants trouvés")
        : (document.querySelector("#extModalLabel").innerText =
            jsons.length + " restaurant trouvé");

      let head_table = `<table id="resto-a-pastiller-list" class="display" style="width:100%">
        <thead>
            <tr>
                <th>Nom de restaurant</th>
                <th>Type</th>
                <th>Adresse</th>
                <th>Action</th>
            </tr>
        </thead>
        <tbody>`;

      let foot_table = `</tbody>
        </table>`;

      let body_table = "";

      let tribut_table_name = document.querySelector("#tribu_t_name_main_head")
        .dataset.tribu;

      if (jsons.length > 0) {
        for (let json of jsons) {
          const name = json.denominationF;
          const dep = json.dep;
          const depName = json.depName;
          const commune = json.commune;
          const codePost = json.codpost;
          const nomvoie = json.nomvoie;
          const numvoie = json.numvoie;
          const typevoie = json.typevoie;
          // const adresse = `${numvoie} ${typevoie} ${nomvoie} ${codePost} ${commune}`
          const adresse = json.add;
          const bar =
            json.bar != "0"
              ? `<p><i class="fa-solid fa-martini-glass-citrus"> </i><span> Bar </span></p>`
              : "";
          const boulangerie =
            json.boulangerie != "0"
              ? `<p><i class="fa-solid fa-bread-slice"> </i> <span> Boulangerie </span></p>`
              : "";
          const brasserie =
            json.brasserie != "0"
              ? `<p><i class="fa-solid fa-beer-mug-empty"> </i><span> Brasserie </span></p>`
              : "";
          const cafe =
            json.cafe != "0"
              ? `<p><i class="fa-solid fa-mug-hot"> </i><span>Cafe</span></p>`
              : "";
          const cuisineMonde =
            json.cuisineMonde != "0"
              ? `<p><i class="fa-solid fa-utensils"> </i><span> Cuisine du Monde </span></p>`
              : "";
          const fastFood =
            json.fastFood != "0"
              ? `<p><i class="fa-solid fa-burger"></i><span> Fast food </span></p>`
              : "";
          const creperie =
            json.creperie != "0"
              ? `<p><i class="fa-solid fa-pancakes"> </i><span> Crêperie </span></p>`
              : "";
          const salonThe =
            json.salonThe != "0"
              ? `<p><i class="fa-solid fa-mug-saucer"> </i><span> Salon de thé </span></p>`
              : "";
          const pizzeria =
            json.pizzeria != "0"
              ? `<p><i class="fa-solid fa-pizza-slice"> </i><span> Pizzeria </span></p>`
              : "";

          body_table += `
                                <tr>
                                    <td>${name}</td>
                                    <td>
                                        <!--<div class="type-resto" onclick="showTypeResto(event)"> <span>Type de restauration</span> <i class="fa-solid fa-greater-than"></i></div>-->
                                        <div class="d-flex bd-highlight">
                                            <div class="">${boulangerie}</div>
                                            <div class="">${bar}</div>
                                            <div class="">${brasserie}</div>
                                            <div class="">${cafe}</div>
                                            <div class="">${cuisineMonde}</div>
                                            <div class="">${fastFood}</div>
                                            <div class="">${creperie}</div>
                                            <div class="">${salonThe}</div>
                                            <div class="">${pizzeria}</div>
                                        </div>
                                    </td>
                                    <td>${adresse}</td>
                                    <td class="d-flex bd-highlight">
                                        <button class="btn btn-info" onclick="openDetail('${name}', '${adresse}', '${depName}','${dep}','${json.id}')"><!--<i class="fas fa-plus"></i>--> Détail</button>
                                        <!--<button class="btn btn-primary ms-1" onclick="pastillerPast(this, ${json.id},'${name}')">Pastillez</button>-->
                                        <button type="button" class="btn btn-warning ms-1" onclick="pastilleRestoForTribuTDashboard(this,true)" data-id="${json.id}" data-name="${name}" data-tbname="${tribut_table_name}">Pastillez</button>
                                    </td>
                                </tr>
                            `;
        }

        document.querySelector("#elie-restou").innerHTML =
          head_table + body_table + foot_table;

        // new DataTable('#resto-a-pastiller-list');
        $("#resto-a-pastiller-list").DataTable({
          language: {
            url: "//cdn.datatables.net/plug-ins/1.13.4/i18n/fr-FR.json",
          },
        });
      } else {
        document.querySelector("#elie-restou").style.display = "block";
        document.querySelector("#elie-restou").innerHTML =
          "<div class='container text-center'>Aucun restaurant qui correspond au recherche de " +
          document.querySelector("#resto-rech").value +
          "</div>";
      }
    });
}

function showTypeResto(event) {
  let b = event.target.parentNode.parentNode;
  // console.log(b)
  if (b.classList.contains("active")) {
    b.classList.remove("active");
    b.querySelector("div.type-resto > i").classList.remove("active");
    b.querySelector("div.type-resto-ico").style.display = "none";
  } else {
    b.classList.add("active");
    b.querySelector("div.type-resto > i").classList.add("active");
    b.querySelector("div.type-resto-ico").style.display = "block";
  }
}

function pastillerPast(element, id, nom) {
  // let modal = element.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement
  let modal = element.parentElement.parentElement.parentElement;
  // if(modal.id == "modalForExtension"){
  element.classList = "btn btn-success ms-1";
  element.innerText = "Pastillé";
  if (modal.id == "resto-a-pastiller-list") {
    setRestoForPast(id, nom);
    element.disabled = true;
    // document.querySelector("#successPastille").style.display = ""
    // document.querySelector("#successPastille").textContent = "Le restaurant " + nom + " a été pastillé avec succès !";
  } else {
    saveRestaurantPast(id, nom);
  }

  swal({
    title: "Succès",
    text: "Le restaurant " + nom + " a été pastillé avec succès !",
    icon: "success",
    button: "Ok",
  });
}

function setRestoForPast(id, nom) {
  if (nom != "" && id != null) {
    let item = {
      denomination_f: nom,
      id_resto: id,
    };
    dataExtension.push(item);
    document.querySelector("#form_extensionData").value =
      JSON.stringify(dataExtension);
    // document.querySelector("#form_extensionData").dataset.jsonValue = JSON.stringify(dataExtension)
  }
}

/**save resto pastilled */
function saveRestaurantPast(id, nom) {
  let data = {
    name: nom,
    id_resto: id,
  };
  //console.log(data);

  fetch(
    new Request("/user/tribut/save_resto/" + tribu_t_name_0 + "_restaurant", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
  ).then((req) => {
    // console.log(req.ok , req.status)
    if (req.ok && req.status === 200) {
      let xmlString = `<div class="alert alert-success mb-2 mt-2" role="alert">
                ${nom} bien pastillé avec succès!
                </div>`;

      document.querySelector("#form_past").innerHTML = xmlString;

      setTimeout(() => {
        document.querySelector("#form_past").innerHTML = "";
        showResto(tribu_t_name_0 + "_restaurant", id_c_u);
      }, 5000);
    }
  });

  document.querySelector("#result_resto_past").style.display = "none";
}

/**
 * show gallery
 */
function showPhotos() {
  // invitationsContainer.innerHTML = "";
  // invitationsContainer.style.display = "none"
  // restoContainer.style.display = "none"
  // restoContainer.innerHTML += "";
  let photosContainer = document.querySelector("#tribu_t_conteuneur");
  // showCreatePub.style.display = "none"
  // showCreatePub_mobile.style.display = "none"
  // showPub.style.display = "none"

  photosContainer.innerHTML = `<div class="mt-3 d-flex justify-content-center">
            <div class="spinner-border" role="status">
            <span class="sr-only">Loading...</span>
            </div>
        </div>`;

  const requete = new Request(
    "/user/tribu/photos/" + tribu_t_name_0 + "_publication",
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );
  fetch(requete)
    .then((rqt) => rqt.json())
    .then((data) => {
      // console.log(data);
      photosContainer.innerHTML = `
                <div class="intro">
                    <div class="alert alert-success" role="alert" style="display:none;" id="success_upload">
                        Photo télechargé avec succès!
                    </div>
                    
                    
                </div>`;

      if (data.length > 0) {
        let li_img = "";

        for (let photo of data) {
          let img_src = photo.photo; //replaceAll("/public","");
          // li_img +=`<img  class="img_gal" src="${img_src}" data-bs-toggle="modal" data-bs-target="#modal_show_photo" onclick = "setPhotoTribu(this)">`
          li_img += `
                                    <div class="col-lg-4 col-md-12 mb-4 mb-lg-0">
                                        <img
                                        src="${img_src}"
                                        class="w-100 shadow-1-strong  mb-4"
                                        alt="Boat on Calm Water"
                                        />
                                    </div>
                                    `;
        }
        setGallerie(document.querySelectorAll(".img_gal"));
        photosContainer.innerHTML += `<div class="gallery-container">
                <div>
                    <span class="h2">Vos photo</span> 
                    <label class="input-file text-center float-end"  style="height:40px;background-color:#0D6EFD;padding:10px;border-radius:5px;color:white;cursor:pointer;"> 
                        <i class="bi bi-camera-fill"></i> Importer
                        <input onchange="loadFile(event)" type="file" accept="image/*" name="photo" style="display:none;"  >
                        <img src="" alt="" id="photo-file" class="w-100" style="display:none;">
                    </label>
                </div>
                <div id="gallery"><div class="row">${li_img}</div></div></div>`;

        setGallerie(document.querySelectorAll("#gallery img"));
      } else {
        //photosContainer.style.textAlign = "center"
        photosContainer.innerHTML += `<div class="gallery-container"><div>
                    <span class="h2">Vos photo</span> 
                    <label class="input-file text-center float-end"  style="height:40px;background-color:#0D6EFD;padding:10px;border-radius:5px;color:white;cursor:pointer;"> 
                        <i class="bi bi-camera-fill"></i> Importer
                        <input onchange="loadFile(event)" type="file" accept="image/*" name="photo" style="display:none;"  >
                        <img src="" alt="" id="photo-file" class="w-100" style="display:none;">
                    </label>
                </div>
                <div id="gallery">Aucune photo</div></div>`;
        // invitationsContainer.innerHTML = "";
        // invitationsContainer.style.display = "none"
        // restoContainer.style.display = "none"
        // restoContainer.innerHTML += "";
      }
    });
}

function loadFile(event) {
  const div = document.createElement("div");
  div.setAttribute("class", "col-lg-4 col-md-12 mb-4 mb-lg-0");
  const new_photo = document.createElement("img");
  new_photo.setAttribute("class", "w-100 shadow-1-strong  mb-4");
  new_photo.setAttribute("data-bs-toggle", "modal");
  new_photo.setAttribute("data-bs-target", "#modal_show_photo");
  new_photo.setAttribute("onclick", "setPhotoTribu(this)");
  new_photo.src = URL.createObjectURL(event.target.files[0]);
  div.appendChild(new_photo);
  // var div_photo = document.querySelector("#gallery");
  var div_photo = document.querySelector(".content-telechargement-tomm-js");

  // let first_photo = document.querySelector("#gallery >div> div:nth-child(1)");
  let first_photo = document.querySelector(".content-telechargement-tomm-js");

  if (first_photo) {
    first_photo.parentElement.insertBefore(div, first_photo);
  } else {
    div_photo.innerHTML = "";
    div_photo.appendChild(new_photo);
  }

  const fileReader = new FileReader();
  fileReader.onload = (event) => {
    const srcData = fileReader.result;
    const extensionFile = srcData.split(";")[0].split("/")[1];
    // console.log(event);
    // console.log(extensionFile);
    ///public/uploads/tribu_t/photo/tribu_t_1_banane_publication/photo.jpg
    let data = {
      extensionFile: extensionFile,
      base64: srcData,
      confidentiality: 1,
    };

    fetch(
      new Request("/user/tribu/add_img/" + tribu_t_name_0 + "_imp_img", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
    )
      .then((x) => {
        if (x.status === 200 && x.ok) {
          swal(
            "Merci de votre partage.",
            "Votre photo a bien été partagée.",
            "success",
            {
              button: "Ok",
            }
          );
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  fileReader.readAsDataURL(event.target.files[0]);
}
/*-----------end------------------*/

function showActualites() {
  const selected = document.querySelector("#activeTribu");

  //<a href="/user/tribu/my-tribu-t?type=owned&amp;tribu=tribu_t_28_lenfer"
  //class="tribu_t owned tribu_T_owned p-2 list-nav-left active"
  //data-tribu-rank="28" data-table-name="tribu_t_28_lenfer" id="activeTribu">Tribu T l'enfer</a>*
  const type = selected.classList[1].trim();
  const tributName = selected.dataset.tableName.trim();
  const id_c_u = document.querySelector(".information_user_conected_jheo_js")
    ? document.querySelector(".information_user_conected_jheo_js").dataset
        .toggleUserId
    : 0;
  if (id_c_u > 0) 
    showBlockPubV2(type, tributName, id_c_u);
}

function showInvitations() {
  if (document.querySelector("li.listNavBarTribu > a.active")) {
    document
      .querySelector("li.listNavBarTribu > a.active")
      .classList.remove("active");
  }
  document
    .querySelector("li.listNavBarTribu.invitation > a")
    .classList.add("active");
  // document.querySelector("#list-publicatiotion-tribu-t").innerHTML = ""
  // document.querySelector("#createPubBloc").style.display = "none";
  //setActiveTab(this)
  document.querySelector("#tribu_t_conteuneur").innerHTML = `
                <div class="bg-white rounded-3 px-3">
                    <ul class="nav nav-tabs ml-3" id="smallNavInvitation">
                        <li class="nav-item">
                            <a data-element="table-tribuG-member" class="nav-link active text-secondary tab_invite_elie" aria-current="page" href="#" onclick="setActiveTab(this, 'tribu_g')">Tribu G</a>
                        </li>
                        <li class="nav-item">
                            <a data-element="blockSendEmailInvitation" class="nav-link text-secondary tab_invite_elie" href="#" onclick="setActiveTab(this, 'email')">Par e-mail</a>
</li>
                        <li class="nav-item">
                            <a data-element="blockHistInvitation" class="nav-link text-secondary tab_invite_elie" href="#" onclick="setActiveTab(this, 'historique')">Historiques</a>
                        </li>
                    </ul>
                    <div id="blockSendEmailInvitation" style="display:none;" class="mt-4 px-3">
                        <h5 class="modal-title text-primary" id="exampleModalLabel">Inviter d'autre fan par e-mail</h5>
<h6 class="modal-title text-primary" >Vous pouvez modifier le corps de l'e-mail comme vous le voulez.</h6>
                        <h6 class="modal-title text-primary" >Le lien d'invitation sera généré automatiquement par CMZ.</h6>
                        <h6 class="modal-title text-primary" >L'e-mail envoyé sera automatiquement signé à votre nom.</h6>
                        <form class="content_form_send_invitation_email_js_jheo">
                            <div class="alert alert-success mt-3" id="successSendingMail" role="alert" style="display:none;">
                                Invitation envoyée avec succès !
                            </div>
                            <div class="form-group content_cc_css_jheo mt-3">
                                <label for="exampleFormControlInput1">Destinataires<span class="info_multiple_mail">(*Sépare par un espace ou une virgule si vous avez plusieurs destinataires.)</span></label>
                                <input type="text" class="form-control single_destination_js_jheo" id="exampleFormControlInput1" placeholder="Saisir les ou l'adresse(s) e-mail du destinataire">
                                <!--<a href="#" style="padding-top:5px;" class="nav-link link-dark collapsed cc_css_jheo" data-bs-toggle="collapse" data-bs-target="#tribut-collapse" aria-expanded="false">
                                    <span class="me-2 mt-2">Cc/Cci</span>
                                </a>-->
                            </div>

                            
                            <div class="form-group content_objet_css_jheo mt-3">
                                <label for="exampleFormControlInput2">Objet</label>
                                <input type="text" class="form-control object_js_jheo" id="exampleFormControlInput2" placeholder="Objet">
                            </div>

                            <div class="form-group mt-3">
                                <label for="exampleFormControlTextarea1">Corps de l'e-mail</label>
                                <div id="exampleFormControlTextarea32">
                                    <div class="wrapper pt-3 pb-3">
                                        <textarea cols="100 invitation_description_js_jheo" id="exampleFormControlTextarea1">
                                            
                                        </textarea>
                        
                                        <pre id="output"></pre>
                                    </div>
                                </div>
                                <!--<textarea class="form-control invitation_description_js_jheo" id="exampleFormControlTextarea1" rows="3"></textarea>-->
                            </div>

                            <ul class="list-group content_list_piece_joint_jheo_js d-none"></ul>

                            <div class="d-flex justify-content-start align-items-center">
                                <div class="p-2 bd-highlight">
                                    <button type="button" class="btn btn-primary btn_send_invitation_js_jheo my-3">Envoyer l'invitation</button>
                                </div>
                                <div class="p-2 bd-highlight content_input_piece_joint content_input_piece_joint_jheo_js">
                                    <div class="message_tooltip_piece_joint d-none message_tooltip_piece_joint_jheo_js">Ajout des pièce jointe.</div>
                                    <label class="pointer_cursor label_piece_joint_jheo_js" for="piece_joint">
                                        <i class="fa-solid fa-paperclip pointer_cursor label_piece_joint_jheo_js"></i>
                                    </label>
                                    <input type="file" class="input_piece_joint_jheo_js hidden " id="piece_joint" name="piece_joint" onchange="addPieceJoint(this);" />
                                </div>
                                <div class="p-2 bd-highlight content_input_piece_joint content_add_link_jheo_js">
                                    <div class="pointer_cursor message_tooltip_piece_joint d-none add_link_jheo_js">Ajout des liens.</div>
                                    <div class="pointer_cursor label_add_link_jheo_js"><i class="fa-solid fa-link"></i></div>
                                </div>
                                <div class="p-2 bd-highlight content_input_piece_joint content_add_image_js">
                                    <div class="pointer_cursor message_tooltip_piece_joint d-none add_image_jheo_js">Ajout des images.</div>
                                    <label class="pointer_cursor label_add_image_jheo_js" for="piece_joint_image"><i class="fa-solid fa-image"></i></label>
                                    <input type="file" class="input_piece_joint_jheo_js hidden " id="piece_joint_image" name="piece_joint_image" accept="image/png, image/jpeg, image/jpg" onchange="addPieceJointImage(this);"/>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div id="table-tribuG-member" class="mt-2">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th scope="col">Nom</th>
                                    <th>E-mail</th>
                                    <th scope="col">Tribu G</th>
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody id="all_tribu_g_members">
                                
                            </tbody>
                        </table>
                    </div>
                    <div id="blockHistInvitation" class="mt-2 d-none">
                        <h5 class="modal-title text-primary mt-3 mb-3" id="exampleModalLabel">Historique des invitations par e-mail</h5>
                        <table class="table" id="historique_invitation">
                            <thead>
                                <tr>
                                    <th>E-mail</th>
                                    <th scope="col">Date</th>
                                    <th scope="col">Fan</th>
                                    <th scope="col">Invité(e) par </th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody id="all_historique">
                                
                            </tbody>
                        </table>
                    </div>
                </div>
        `;

  // <div class="mt-3" id="tribut-collapse">
  //     <div class="form-group multiple_destination_css">
  //         <label for="exampleFormControlInput1">Ajouter de Cc <span class="info_multiple_mail">(*Sépare par un espace ou une virgule si vous avez plusieurs Cc.)</span></label>
  //         <input type="text" class="form-control  multiple_destination_js_jheo" id="exampleFormControlInput1" placeholder="Saisir l'adresse email de copie">
  //         <div class="content_chip content_chip_js_jheo">

  //         </div>
  //     </div>
  // </div>
  // <div class="mt-3" id="tribut-collapse">
  //     <div class="form-group multiple_destination_css">
  //         <label for="exampleFormControlInput1">Ajouter de Cci <span class="info_multiple_mail">(*Sépare par un espace ou une virgule si vous avez plusieurs Cci.)</span></label>
  //         <input type="text" class="form-control  multiple_destination_cci_js_jheo" id="exampleFormControlInput2" placeholder="Saisir l'adresse email en Cci">
  //         <div class="content_chip content_chip_js_jheo">

  //         </div>
  //     </div>
  // </div>
  initCKEditor("exampleFormControlTextarea1", showReponsePartenaire);
  // editor_invitation = document.querySelector("#editorInvitationElie")
  // // console.log(editor);
  // document.querySelector("#exampleFormControlTextarea32").appendChild(editor_invitation);
  // document.querySelector("#editorInvitationElie").classList.remove("d-none")

  fetchAllTribuGMember();

  ///hover tooltip piece joint, ...
  displayTooltipHelpMsg();

  if (document.querySelector(".content_add_link_jheo_js")) {
    document
      .querySelector(".label_add_link_jheo_js")
      .addEventListener("click", () => {
        document.querySelector(".modal_addlink_invitation_jheo_js").click();
      });
  }

  /** JEHOVANNIE SEND INVITATION BY EMAIL */
  const form_parent = document.querySelector(
    ".content_form_send_invitation_email_js_jheo"
  );
  const input_principal = form_parent.querySelector(
    ".single_destination_js_jheo"
  );
  // const input_cc = form_parent.querySelector(".multiple_destination_js_jheo")
  // const input_cci = form_parent.querySelector(".multiple_destination_cci_js_jheo")
  const object = form_parent.querySelector(".object_js_jheo");
  const description = form_parent.querySelector(
    ".invitation_description_js_jheo"
  );

  document
    .querySelector("#blockSendEmailInvitation")
    .setAttribute(
      "data-table",
      document.querySelector("#tribu_t_name_main_head").dataset.tribu
    );

  input_principal.addEventListener("input", () => {
    input_principal.style.border = "1px solid black";
  });

  // input_cc.addEventListener("input", () => {
  //   input_cc.style.border = "1px solid black";
  // });

  object.addEventListener("input", () => {
    object.style.border = "1px solid black";
  });

  controlInputEmailToMultiple([input_principal]);

  // input_cc.addEventListener("keyup", (e) => {

  //     if (e.code === "KeyM" || e.code === "Enter" || e.code === "NumpadEnter") {
  //         if (verifieEmailValid(input_cc.value.replace(",", ""))) {
  //             ////create single email
  //             // <div  class="chip"><span>toto@gmail.com</span><i class="fa-solid fa-delete-left" onclick="ondeleteUser(this)"></i></div>
  //             const div = document.createElement("div");
  //             div.classList.add("chip");
  //             const span = document.createElement("span");
  //             span.innerText = input_cc.value.replace(",", "");
  //             div.appendChild(span);
  //             div.innerHTML += `<i class="fa-solid fa-delete-left" onclick="ondeleteUser(this)"></i>`
  //             document.querySelector(".content_chip_js_jheo").appendChild(div);
  // document.querySelectorAll(".chip span").forEach(item => {
  //     cc_destinataire.push(item.innerText)
  // })
  //             input_cc.value = null
  //         } else {
  //             input_cc.style.border = "1px solid red";
  //         }
  //     }
  // })
  form_parent
    .querySelector(".btn_send_invitation_js_jheo")
    .addEventListener("click", (e) => {
      e.preventDefault();
      form_parent
        .querySelector(".btn_send_invitation_js_jheo")
        .setAttribute("disabled", true);
      form_parent.querySelector(".btn_send_invitation_js_jheo").textContent =
        "En cours...";

      ////get cc
      let cc_destinataire = [];
      // document.querySelectorAll(".chip span").forEach(item => {
      //     cc_destinataire.push(item.innerText)
      // })

      // if (input_cc.value != "") {
      //   cc_destinataire.push(input_cc.value);
      // }

      let status = true;

      if (input_principal.value === "") {
        // console.log("Entre au moin une destination.");
        input_principal.style.border = "1px solid red";
        status = false;
      }

      if (checkIfExistMailInValid(input_principal.value)) {
        input_principal.style.border = "1px solid red";
        status = false;
      }

      // if (!!input_cc.value && checkIfExistMailInValid(input_cc.value)) {
      //     input_cc.style.border = "1px solid red";
      //     status = false;
      // }

      // if (!!input_cci.value && checkIfExistMailInValid(input_cci.value)) {
      //     input_cci.style.border = "1px solid red";
      //     status = false;
      // }

      // "cc": formatEmailAdresseFromStringLong(input_cc.value),
      // "cci": formatEmailAdresseFromStringLong(input_cci.value),
      let data = {
        table: document
          .querySelector("#blockSendEmailInvitation")
          .getAttribute("data-table"),
        principal: formatEmailAdresseFromStringLong(input_principal.value),
        object: "",
        description: "",
      };

      ///object
      if (object.value === "") {
        // console.log("Veillez entre un Object.");
        object.style.border = "1px solid red";
        status = false;
      } else {
        data = { ...data, object: object.value };
      }
      //Changing description check editor by Elie
      data = { ...data, description: editor.getData() };

      if (email_piece_joint_list.length > 0) {
        data = { ...data, piece_joint: email_piece_joint_list };
      } else {
        data = { ...data, piece_joint: [] };
      }
      // if (document.querySelector(".message_tooltip_piece_joint_jheo_js")) {
      //   const content_input_piece = document.querySelector(
      //     `.content_input_piece_joint_jheo_js`
      //   );

      //   content_input_piece.addEventListener("mouseover", () => {
      //     content_input_piece
      //       .querySelector(".message_tooltip_piece_joint_jheo_js")
      //       .classList.remove("d-none");
      //   });

      //   content_input_piece.addEventListener("mouseout", () => {
      //     content_input_piece
      //       .querySelector(".message_tooltip_piece_joint_jheo_js")
      //       .classList.add("d-none");
      //   });
      // }
      // if (verifieEmailValid(input_principal.value)) {
      //   data = { ...data, principal: input_principal.value };
      // } else {
      //   input_principal.style.border = "1px solid red";
      //   status = false;
      // }
      if (status) {
        if (email_piece_joint_list.length > 0) {
          email_piece_joint_list.forEach((item) => {
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
        // console.log(data);
        //////fetch data
        fetch("/user/tribu/email/invitation", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }).then((response) => {
            if (!response.ok && response.status != 200) {
              new swal({
              title: "Mail non envoyé",
              text: "Le destinataire bloque le courrier électronique sur le serveur de messagerie du destinataire.",
              icon: "error",
              button: "OK",
            }).then(() => {
              form_parent
                .querySelector(".btn_send_invitation_js_jheo")
                .removeAttribute("disabled");
              form_parent.querySelector(
                ".btn_send_invitation_js_jheo"
              ).textContent = "Envoyer l'invitation";
            });
          } else if (response.ok && response.status == 200) {
            response.json().then((result) => {
              const userEmailDoesntExist = result.data.email_not_exist;
              if (userEmailDoesntExist.length > 0) {
                let listEmail = "";
                for (let email of userEmailDoesntExist) {
                  listEmail += email + " ";
                }
                listEmail = listEmail.trim().replaceAll(" ", ",");
                new swal({
                  title: "informations",
                  text: `On n'a pas pu envoyer l'invitation à ces emails: ${listEmail}`,
                  icon: "info",
                  button: "ok",
                }).then(() => {
                  let table_trib = document
                    .querySelector("#blockSendEmailInvitation")
                    .getAttribute("data-table");

            // sauvegarde de l'invitation
                  saveInvitationStory(table_trib, result.data);

                  // }
                  /// END OF THE RESET DATA.

                  form_parent
                    .querySelector(".btn_send_invitation_js_jheo")
                    .removeAttribute("disabled");
                  form_parent.querySelector(
                    ".btn_send_invitation_js_jheo"
                  ).textContent = "Envoyer l'invitation";

                  email_piece_joint_list.forEach((item) => {
                    const id = item.id;
                    const btn_item = document.querySelector(
                      `.fa_solid_${id}_jheo_js`
                    );
                    if (!btn_item.classList.contains("btn-outline-danger")) {
                      btn_item.classList.add("btn-outline-danger");
                    }

                    if (btn_item.classList.contains("btn-outline-primary")) {
                      btn_item.classList.remove("btn-outline-primary");
                    }

                    btn_item.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;

                    btn_item.setAttribute(
                      "onclick",
                      `removeListeItem(this, '${id}')`
                    );
                  });

                  document.querySelector("#successSendingMail").style.display =
                    "block";

                  setTimeout(() => {
                    document.querySelector(
                      "#successSendingMail"
                    ).style.display = "none";
                  }, 5000);
                });
              } else {
            let table_trib = document
              .querySelector("#blockSendEmailInvitation")
              .getAttribute("data-table");

            // sauvegarde de l'invitation
            //saveInvitationStory(table_trib, result.data);
            
            // }
            /// END OF THE RESET DATA.

            form_parent
              .querySelector(".btn_send_invitation_js_jheo")
              .removeAttribute("disabled");
            form_parent.querySelector(
              ".btn_send_invitation_js_jheo"
            ).textContent = "Envoyer l'invitation";

            email_piece_joint_list.forEach((item) => {
              const id = item.id;
              const btn_item = document.querySelector(
                `.fa_solid_${id}_jheo_js`
              );
              if (!btn_item.classList.contains("btn-outline-danger")) {
                btn_item.classList.add("btn-outline-danger");
              }

              if (btn_item.classList.contains("btn-outline-primary")) {
                btn_item.classList.remove("btn-outline-primary");
              }

              btn_item.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;

              btn_item.setAttribute(
                "onclick",
                `removeListeItem(this, '${id}')`
              );
            });

            document.querySelector("#successSendingMail").style.display =
              "block";

            setTimeout(() => {
              document.querySelector("#successSendingMail").style.display =
                "none";
            }, 5000);
          }
            });
}
          });
      }
    });

  /** END JEHOVANNIE*/
}

function setActiveTab(elem, param) {
  document.querySelectorAll(".tab_invite_elie").forEach((it) => {
    it.classList.remove("active");
  });

  if (!elem.classList.contains("active")) {
    elem.classList.add("active");
    document.querySelector("#" + elem.dataset.element).style = "";
    // if (elem.parentElement.nextElementSibling) {
    //     elem.parentElement.nextElementSibling.firstElementChild.classList.remove("active")
    //     document.querySelector("#" + elem.parentElement.nextElementSibling.firstElementChild.dataset.element).style.display = "none";
    // } else {
    //     elem.parentElement.previousElementSibling.firstElementChild.classList.remove("active")
    //     document.querySelector("#" + elem.parentElement.previousElementSibling.firstElementChild.dataset.element).style.display = "none";
    // }
  }
  switch (param) {
    case "tribu_g": {
      document.querySelector("#blockHistInvitation").classList.add("d-none");
      document
        .querySelector("#blockSendEmailInvitation")
        .classList.add("d-none");
      document.querySelector("#table-tribuG-member").classList.remove("d-none");
      document.querySelector(
        "#" +
          elem.parentElement.nextElementSibling.firstElementChild.dataset
            .element
      ).style.display = "none";
      break;
    }
    case "email": {
      document.querySelector("#blockHistInvitation").classList.add("d-none");
      document
        .querySelector("#blockSendEmailInvitation")
        .classList.remove("d-none");
      document.querySelector("#table-tribuG-member").classList.add("d-none");
      document.querySelector(
        "#" +
          elem.parentElement.previousElementSibling.firstElementChild.dataset
            .element
      ).style.display = "none";
      document.querySelector(".object_js_jheo").value =
        "Invitation à rejoindre ma tribu Thématique sur Consomyzone";
      break;
    }
    case "historique": {
      document
        .querySelector("#blockSendEmailInvitation")
        .classList.add("d-none");
      document.querySelector("#blockHistInvitation").classList.remove("d-none");
      document.querySelector("#table-tribuG-member").classList.add("d-none");
      document.querySelector(
        "#" +
          elem.parentElement.previousElementSibling.firstElementChild.dataset
            .element
      ).style.display = "none";
      fetchAllInvitationStory();
      break;
    }
  }
}

function fetchAllTribuGMember() {
  let table = document
    .querySelector("#tribu_t_name_main_head")
    .dataset.tribu.trim();
  let tbody = document.querySelector("#all_tribu_g_members");
  tbody.innerHTML = `<td colspan="4"><div class="d-flex justify-content-center">
                        <div class="spinner-border" role="status">
                        <span class="visually-hidden">Loading...</span>
                        </div>
                    </div></td>`;
  fetch("/user/all_tribu_g/members?tribu_t=" + table)
    .then((response) => response.json())
    .then((response) => {
      // console.log(response)
      if (response.length > 0) {
        tbody.innerHTML = "";
        for (const item of response) {
          let ancorOrbutton = "";
          if (item.isMember != "not_invited") {
            if (item.isMember == "refuse") {
              ancorOrbutton = `<button class="btn btn-sm btn-secondary" disabled="true">Invitation refusée</button>`;
            } else if (item.isMember == "pending") {
              ancorOrbutton = `<button class="btn btn-sm btn-secondary" disabled="true">En attente</button>`;
            } else {
              ancorOrbutton = `<button class="btn btn-sm btn-secondary" disabled="true">Membre</button>`;
            }
          } else {
            ancorOrbutton = `<button data-id="${item.id}" type="button" class="btn btn-primary btn-sm" onclick="inviteUser(this)">Inviter</button>`;
          }
          tbody.innerHTML += `<tr>
                            <td class="non_active"><a class="disabled-link" style="text-decoration:none;" href="/user/profil/${item.id}">${item.fullName}</a></td>
                            <td>${item.email}</td>
                            <td>${item.tribug}</td>
                            <td class="text-center">${ancorOrbutton}</td>
                        </tr>
                    `;
        }
        $("#table-tribuG-member > table").DataTable({
          language: {
            url: "//cdn.datatables.net/plug-ins/1.13.4/i18n/fr-FR.json",
          },
        });
      } else {
        tbody.innerHTML = "Aucun tribu G créé pour le moment";
      }
    })
    .catch((error) => console.log(error));
}

function inviteUser(elem) {
  let data = {
    user_id: elem.dataset.id,
    table: document
      .querySelector("#tribu_t_name_main_head")
      .dataset.tribu.trim(),
    nom: document.querySelector("#tribu_t_name_main_head").textContent.trim(),
  };

  // console.log(data);

  const http = new XMLHttpRequest();
  http.open("POST", "/user/tribu/send/one-invitation");
  http.setRequestHeader("Content-type", "application/json");
  http.setRequestHeader("X-Requested-With", "XMLHttpRequest");
  http.send(JSON.stringify(data));
  http.onload = function () {
    elem.style.backgroundColor = "#E4E6EB";
    elem.style.borderColor = "#E4E6EB";
    elem.style.color = "black";
    elem.setAttribute("disabled", true);
    elem.innerHTML = http.responseText.replace(/"/g, "").replace(/ee/g, "ée");
  };
}

// function verifieEmailValid(email) {
  //   if (
    //     email.match(
      //       /(?:[a-z0-9+!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/gi
    //     )
//   ) {
    //     return true;
  //   }
//   return false;
// }

function ondeleteUser(e) {
  const email = e.parentElement;
  email.parentElement.removeChild(email);
}

function removePublication() {
  let hiddenElement = document.querySelector("#hiddenElement");
  let id = hiddenElement.value;
  let dataId = hiddenElement.dataset.id;
  let dataName = hiddenElement.dataset.name;
  document.querySelector("#" + dataId).remove();
  fetch(
    new Request(
      "/user/tribu/publication/remove/" + dataName + "_publication/" + id,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    )
  )
    .then((rqt) => rqt.json())
    .then((data) => console.log(data));
}

// function setHiddenValue(element, update = "") {
//   if (update != "") {
//     document.querySelector("#publication_update_confidentiality").value =
//       element.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.dataset.confid;
//     document.getElementById("publication_update_legend").value =
//       element.parentElement.parentElement.parentElement.parentElement.parentElement.nextElementSibling.children[0].innerText;
//   }
//   let hiddenElement = document.querySelector("#hiddenElement" + update);
//   hiddenElement.dataset.id =
//     element.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.id;
//   hiddenElement.dataset.name =
//     element.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.dataset.name;
//   hiddenElement.value =
//     element.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.dataset.id;
// }

function updatePublication() {
  let hiddenElement = document.querySelector("#hiddenElementUpdate");
  let id = hiddenElement.value;
  let dataId = hiddenElement.dataset.id;
  let dataName = hiddenElement.dataset.name;
  let confidentiality = document.querySelector(
    "#publication_update_confidentiality"
  ).value;
  let message = document.querySelector("#publication_update_legend").value;

  document.querySelector("#" + dataId).querySelector(".text-pub").innerHTML =
    message;

  let publicVisibilityElement = document
    .querySelector("#" + dataId)
    .querySelector("[aria-labelledby=btnGroupDrop1]").children[0];
  let privateVisibilityElement = document
    .querySelector("#" + dataId)
    .querySelector("[aria-labelledby=btnGroupDrop1]").children[1];
  let btnGroupDropElement = document
    .querySelector("#" + dataId)
    .querySelector("#btnGroupDrop1");
  let publicIcone = `<i class="fa-solid fa-earth-oceania"></i>`;
  let privateIcone = `<i class="bi bi-lock-fill"></i>`;

  if (parseInt(confidentiality) == 1) {
    if (!publicVisibilityElement.classList.contains("active")) {
      btnGroupDropElement.innerHTML = publicIcone;
      privateVisibilityElement.classList.remove("active");
      publicVisibilityElement.classList.add("active");
    }
  } else if (parseInt(confidentiality) == 2) {
    if (!privateVisibilityElement.classList.contains("active")) {
      btnGroupDropElement.innerHTML = privateIcone;
      publicVisibilityElement.classList.remove("active");
      privateVisibilityElement.classList.add("active");
    }
  }

  //document.querySelector("#modal_publication_modif img.image-upload-image")
  let imgSrc = null;
  let oldSrc = "";
  if (
    document.querySelector("#modal_publication_modif .image-upload-content")
      .style.display == "block"
  ) {
    imgSrc = document.querySelector(
      "#modal_publication_modif img.image-upload-image"
    ).src;
    if (
      document.querySelector("#" + dataId + " .publication-picture").style
        .display == "none"
    ) {
      document
        .querySelector("#" + dataId)
        .querySelector(".publication-picture").style = "cursor:pointer";
      document
        .querySelector("#" + dataId)
        .querySelector(".publication-picture").src = imgSrc;
    } else {
      document.querySelector("#" + dataId + " .publication-picture").src =
        imgSrc;
    }
  } else {
    if (
      document.querySelector("#" + dataId + " .publication-picture").style
        .display == "none"
    ) {
      console.log("Ok");
    } else {
      if (
        document
          .querySelector("#" + dataId + " .publication-picture")
          .src.includes("data:image/")
      ) {
        imgSrc = document.querySelector(
          "#" + dataId + " .publication-picture"
        ).src;
      } else {
        oldSrc = document.querySelector(
          "#" + dataId + " .publication-picture"
        ).src;
      }
    }
  }

  let data = {
    oldSrc: oldSrc,
    base64: imgSrc,
    pub_id: id,
    confidentiality: confidentiality,
    message: message,
  };

  // console.log(data);

  fetch(
    new Request("/user/tribu/update_publication/" + dataName + "_publication", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
  )
    .then((response) => response.json())
    .then((message) => console.log(message));
}

function checkExtension(element) {
  return element.checked;
}

function openModalForExtension(element) {
  if (checkExtension(element)) {
    $("#modalForExtension").modal("show");
  } else {
    console.log("Unchecked");
  }
}

if (document.querySelector("#apropos-tribu-t")) {
  let openClose = document.querySelector("#apropos-tribu-t");
  openClose.addEventListener("click", () => {});
}

const searchParams = new URLSearchParams(window.location.search);
if (searchParams.has("message")) {
  showAlertMessageFlash(searchParams.get("message"));
  const url = new URL(window.location.href);
  window.location.replace(url.pathname);
}

function listResto() {
  document.querySelector("#elie-restou").innerHTML = "";
  let inputName = document.querySelector("#resto-rech").value;
  let adresse = document.querySelector("#resto-rech-ou").value;
  if (adresse.trim() != "" || inputName.trim() != "") {
    if (
      document.querySelector(".golfNotHide > a") &&
      document.querySelector(".golfNotHide > a").classList.contains("active")
    ) {
      findGolf(inputName, adresse);
    } else if (
      document.querySelector(".restoNotHide > a").classList.contains("active")
    ) {
      findResto(inputName, adresse);
    }
    $("#modalForExtension").modal("show");
  } else {
    swal({
      // title: "Succès",
      text: "Champ invalide!",
      icon: "error",
      button: "Ok",
    });
  }
}

// function closeModal(){
//     document.querySelector(".main-search-resto").style.display = "none";
//     document.querySelector("#elie-restou").innerHTML =""
//     document.querySelector("body").style.overflowY = 'auto'
// }

// document.querySelector(".main-search-resto").onclick = function(event) {
//     let modal = document.querySelector(".main-search-resto")
//     if (event.target == modal) {
//         closeModal()
//     }
//   }

if (document.querySelector("#btn_open_modal_avis_elie")) {
  document
    .querySelector("#btn_open_modal_avis_elie")
    .addEventListener("click", function () {
      $("#avisRestoPastille").modal("hide");
      $("#modalAvisRestaurant").modal("show");
    });
}

/**
 * @author elie
 * @constructor
 * Function affichage de la liste des avis de resto pastillé dans un tribu T
 * @localisation: myTribuT.js
 * @utilisation : dans le template tribuT.html.twig
 * @param {int} nb_avis : afficher dans le template
 * @param {int} id_resto : id de la bdd_resto
 */
function openAvis(nb_avis, id_resto) {
  if (parseInt(nb_avis) > 0) {
    $("#avisRestoPastille").modal("show");

    const table_resto = tribu_t_name_0 + "_restaurant";

    // document.querySelector("#bodyAvisRestoPastilleElie").innerHTML = ""

    fetch(
      "/user/comment/tribu/restos-pastilles/" + table_resto + "/" + id_resto
    )
      .then((response) => response.json())
      .then((avis) => {
        // console.log(avis);
        for (let avi of avis) {
          let noteEtoile = "";

          switch (parseInt(avi.note)) {
            case 1:
              noteEtoile = `<i class="fa-solid fa-star checked" style="color: rgb(245, 209, 101);"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>`;
              break;
            case 2:
              noteEtoile = `<i class="fa-solid fa-star checked" style="color: rgb(245, 209, 101);"></i><i class="fa-solid fa-star checked" style="color: rgb(245, 209, 101);"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>`;
              break;
            case 3:
              noteEtoile = `<i class="fa-solid fa-star checked" style="color: rgb(245, 209, 101);"></i><i class="fa-solid fa-star checked" style="color: rgb(245, 209, 101);"></i><i class="fa-solid fa-star checked" style="color: rgb(245, 209, 101);"></i><i class="fa-solid fa-star"></i>`;
              break;
            case 4:
              noteEtoile = `<i class="fa-solid fa-star checked" style="color: rgb(245, 209, 101);"></i><i class="fa-solid fa-star checked" style="color: rgb(245, 209, 101);"></i><i class="fa-solid fa-star checked" style="color: rgb(245, 209, 101);"></i><i class="fa-solid fa-star checked" style="color: rgb(245, 209, 101);"></i>`;
              break;
            default:
              noteEtoile = `<i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>`;
          }

          document.querySelector(
            "#bodyAvisRestoPastilleElie"
          ).innerHTML += `<div class="card mb-2 card_avis_resto_jheo_js">
                            <div class="card-body">
                                <div class="avis_content">
                                    <div class="d-flex justify-content-between align-items-end">
                                        <h5>
                                            <small class="fw-bolder text-black"><i class="fas fa-user"></i> ${avi.pseudo} </small> <br>
                                            ${avi.commentaire}
                                        </h5>	
                                        <p>
                                            ${noteEtoile}
                                            <!--<i class="fa-solid fa-star checked" style="color: rgb(245, 209, 101);"></i>
                                            <i class="fa-solid fa-star checked" style="color: rgb(245, 209, 101);"></i>
                                            <i class="fa-solid fa-star"></i>
                                            <i class="fa-solid fa-star"></i>-->
                                        </p>
                                    </div>
                                    <p>${avi.datetime}</p>
                                </div>
                            </div>
                        </div>
                        `;
        }

        document
          .querySelector(".send_avis_jheo_js")
          .setAttribute("onclick", "setSendNote(this," + id_resto + ")");

        document
          .querySelector(".send_avis_jheo_js")
          .setAttribute("data-action", "create");
      });
  } else {
    swal({
      title: "Opps!",
      text: "Aucun avis pour ce restaurant",
      icon: "warning",
      button: "Ok",
    });
  }

  const myModalEl = document.getElementById("avisRestoPastille");
  myModalEl.addEventListener("hidden.bs.modal", (event) => {
    // do something...
    document.querySelector("#bodyAvisRestoPastilleElie").innerHTML = "";
  });
}

/**
 * @author elie
 * @constructor : fonction de parametrage d'id resto dans un template
 * @localisation : myTribuT.js
 * @utilisation dans le template tribuT.html.twig
 * @param {element} params : element ou le fonction se place
 * @param {int} id_pastille : id resto
 */
function setSendNote(params, id_pastille) {
  const action = params.getAttribute("data-action");

  const avis =
    params.parentElement.previousElementSibling.querySelector("#message-text");
  const note =
    params.parentElement.previousElementSibling.querySelector("#text-note");

  if (action == "create") {
    if (parseFloat(note.value) > 4) {
      swal({
        title: "Erreur de saisie de note!",
        text: "Une note doit être inférieur ou égale à 4",
        icon: "error",
        button: "Ok",
      });
    } else {
      sendNote(parseFloat(note.value), avis.value, id_pastille);
    }
  } else {
    updateNote(parseFloat(note.value), avis.value, id_pastille);
  }
}

/**
 * @author elie
 * @constructor Fonction d'ouverture de note de resto pastillé
 * @localisation : myTribuT.js
 * @utilisation dans le template tribuT.html.twig
 * @param {int} id_pastille : id resto
 * @param {string} action : action à faire pour le bouton
 */
function openOnNote(id_pastille, action) {
  document
    .querySelector(".send_avis_jheo_js")
    .setAttribute("data-action", action);
  document
    .querySelector(".send_avis_jheo_js")
    .setAttribute("onclick", "setSendNote(this," + id_pastille + ")");
}

/**
 * @constructor Fonction d'ouverture d'un evenement
 * @author elie
 * @param {int} id : id resto
 * @param {string} nom : nom de resto
 * @param {string} adresse : adresse de resto
 * @param {string} action : action à faire pour le resto
 */
function openOnEvent(id, nom, adresse, action = "") {
if (action == "golf") document.getElementById("golfRadio").checked = true;
  else if (action == "resto")
    document.getElementById("restoRadio").checked = true;
  document.querySelector("#nomEtabEvent").value = nom;

  document.querySelector("#lieuEvent").value = adresse.toLowerCase().trim();

  let date = new Date();
  let currentDate = date.toISOString().substring(0, 10);

  document.getElementById("eventStart").value = currentDate;
  document.getElementById("eventEnd").value = currentDate;
  document.getElementById("timeStart").value = "00:00";
  document.getElementById("timeEnd").value = "23:00";
}

/**
* @modifier faniry
 * @constructor Fonction d'ouverture d'un modal detail option resto
 * @param {*} id_pastille : id resto
 * @param {*} denomination_f : nom resto
 * @param {*} adresse
 * @param {*} text1 : icon action
 * @param {*} action : type d'action
 */
function openPopupAction(
  id_pastille,
  denomination_f,
  adresse,
  text1,
  action,
  rubrique_type = "resto"
) {
  denomination_f = denomination_f.replaceAll("'", "\\'");
  switch (rubrique_type) {
    case "resto": {
    $("#detailOptionResto").modal("show");
  document.getElementById("data-note-elie-js").innerHTML =
    `<i class="fas fa-edit"></i> ` + text1;
  document
    .getElementById("data-event-elie-js")
    .setAttribute(
      "onclick",
      `openOnEvent(${id_pastille},'${denomination_f}','${adresse}',"resto")`
    );
  let btn = document.querySelector("#data-depastille-nanta-js");
  btn.dataset.id = id_pastille;
  btn.dataset.name = denomination_f;
  btn.dataset.tbname = document
    .querySelector("#activeTribu")
    .getAttribute("data-table-name");
  if (document.querySelector(".send_avis_jheo_js")) {
    //// reset function add avis resto
    document
      .querySelector(".send_avis_jheo_js")
      .setAttribute(
        "onclick",
        `addAvisInTribuT("${id_pastille}","${rubrique_type}")`
      );
}
                break;
    }
    case "golf": {
      $("#detailOptionGolf").modal("show");
      document
        .getElementById("data-event-nanta-js")
        .setAttribute(
          "onclick",
          `openOnEvent(${id_pastille},'${denomination_f}','${adresse}',"golf")`
        );
      const depastilledBtn = document.getElementById(
        "data-depastilleGolf-nanta-js"
      );
      depastilledBtn.dataset.id = id_pastille;
      depastilledBtn.dataset.name = denomination_f;
      depastilledBtn.dataset.tbname = document
        .querySelector("#activeTribu")
        .getAttribute("data-table-name");
      break;
    }
  }
}

/**
 * @constructor : Ouverture de modal detail resto
 * @param {*} nom_resto
 * @param {*} adresse
 * @param {*} nom_dep
 * @param {*} id_dep
 * @param {*} id_restaurant
 */
function openDetail(nom_resto, adresse, nom_dep, id_dep, id_restaurant) {
  fetch(
    "/api/agenda/restaurant/" +
      nom_dep +
      "/" +
      id_dep +
      "/detail/" +
      id_restaurant
  )
    .then((response) => response.text())
    .then((result) => {
      $("#modalDetailResto").modal("show");

      document.querySelector("#restoModalLabel").innerHTML = `
        <div>
        <h1 class="modal-title fs-5">${nom_resto}</h1>
        <span>${adresse.toLowerCase()}</span>
        </div>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        `;

      document.querySelector("#elie-resto-detail").innerHTML = result;
if (document.querySelector(".content_tow_cta >.site_web")) {
              document
                .querySelector(".content_tow_cta >.site_web")
                .classList.toggle("non_active");
            }
    });
}

function settingTribuT(e, tribuTName) {
  // if (document.querySelector("li.listNavBarTribu > a.active")) {
  //     document.querySelector("li.listNavBarTribu > a.active").classList.remove("active")
  // }
  let data = showdData(tribuTName);

  data.then((response) => {
    let tbt = JSON.parse(response.tribu_t_owned);
    let selectTribuOwned = Array.isArray(tbt.tribu_t)
      ? tbt.tribu_t.filter((tribu) => tribu.name == tribuTName)
      : [tbt.tribu_t];
    let currentTribuT = selectTribuOwned[0];
    // let selectTribuOwned = []

    // if(Array.isArray(tbt.tribu_t)){
    //     selectTribuOwned = tbt.tribu_t.filter((tribu) => tribu.name == tribuTName);
    // }else{
    //     selectTribuOwned.push(tbt.tribu_t)
    // }
    // // selectTribuOwned = tbt.tribu_t.filter((tribu) => tribu.name == tribuTName);
    // let currentTribuT = selectTribuOwned[0]
    // // console.log(currentTribuT)
    // e.target.classList.add("active")
    // document.querySelector("#tribu_t_conteuneur").innerHTML = `<h5 class="text-primary ms-1 mt-4 mb-4 float-start">Modifier les informations de la tribu T</h5>
    //    <button type="button" class="btn btn-primary mt-4 float-end">Modifier</button>
    // `
    $("#ModalUpdateTribuT").modal("show");

    document.querySelector("#updateTribuInfo").dataset.name = "";
    document.querySelector("#updateTribuInfo").dataset.url = "";

    document.querySelector("#updateTribuTName").value =
      currentTribuT.name_tribu_t_muable
        ? currentTribuT.name_tribu_t_muable
        : currentTribuT.name
            .replace(/tribu_t_[0-9]+_/, "")
            .replaceAll("_", " "); //currentTribuT.name.replace(/tribu_t_[0-9]+_/, "").replaceAll("_", " ")
    document.querySelector("#update_description").value =
      currentTribuT.description;
    document.querySelector(".img-update-tribu-t").src =
      currentTribuT.logo_path != ""
        ? "/public" + currentTribuT.logo_path
        : "/public/uploads/tribu_t/photo/avatar_tribu.jpg";

    // extension 'on' correspond à extension
    //restaurant dans les anciens version
    // ce bout de code est là pour assurer une prise en charge recurssive
    if (currentTribuT.extension.restaurant || currentTribuT.extension == "on") {
      document.querySelector("#update_form_restaurant").checked = true;
    } else {
      document.querySelector("#update_form_restaurant").checked = false;
    }

    if (currentTribuT.extension.golf) {
      document.querySelector("#update_form_golf").checked = true;
    } else {
      document.querySelector("#update_form_golf").checked = false;
    }

    document.querySelector("#updateTribuInfo").dataset.tbttbl = tribuTName;
  });
}

function showModalInfo() {
  $("#ModalUpdateTribuT").modal("show");
}

function updateTribuTInfos(e) {
  let tableTribuT = e.target.dataset.tbttbl;
  let description = document.querySelector("#update_description").value.trim();
  let nomTribuT = document.querySelector("#updateTribuTName").value.trim();
  let path = null;
  let restaurant =
    document.querySelector("#update_form_restaurant").checked == true
      ? "on"
      : null;
  let golf =
    document.querySelector("#update_form_golf").checked == true ? "on" : null;
  let photoName = e.target.dataset.name;
  let base64 = e.target.dataset.url;

  let data = {
    tableTribuT: tableTribuT,
    description: description,
    nomTribuT: nomTribuT,
    path: path,
    photoName: photoName,
    base64: base64,
    restaurant: restaurant,
    golf: golf,
  };

  let request = new Request("/user/tribu/update-tribu_t-info", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  fetch(request)
    .then((r) => r.json())
    .then((res) => {
      console.log(res);
      $("#ModalUpdateTribuT").modal("hide");
      document.querySelector("#activeTribu").textContent =
        "Tribu T " + nomTribuT;
      swal({
        title: "Bravo !",
        text: "Information modifiée avec succès",
        icon: "success",
        button: "Fermer",
      }).then((value) => {
        if (photoName != "") {
          document
            .querySelector("#activeTribu")
            .parentElement.parentElement.previousElementSibling.querySelector(
              "img"
            ).src = base64;
        }
        document.querySelector("#activeTribu").click();
      });
    });
}

function findGolf(val, localisation = "") {
  const request = new Request(
    `/api/search/golf?cles0=${val}&cles1=${localisation}`,
    {
      method: "GET",
    }
  );

  document.querySelector("#result_resto_past").style.display = "block;";

  document.querySelector("#extModalLabel").innerText = "Recherche en cours...";
  document.querySelector(
    "#elie-restou"
  ).innerHTML = `<div class="d-flex justify-content-center">
            <div class="spinner-border" role="status">
                <span class="sr-only">Loading...</span>
            </div>
        </div>`;

  fetch(request)
    .then((response) => response.json())
    .then((data) => {
      let jsons = data.results[0];

      jsons.length > 1
        ? (document.querySelector("#extModalLabel").innerText =
            jsons.length + " golfs trouvés")
        : (document.querySelector("#extModalLabel").innerText =
            jsons.length + " golf trouvé");

      let head_table = `<table id="resto-a-pastiller-list" class="display" style="width:100%">
        <thead>
            <tr>
                <th>Nom du golf</th>
                <th>Adresse</th>
                <th>Action</th>
            </tr>
        </thead>
        <tbody>`;

      let foot_table = `</tbody>
        </table>`;

      let body_table = "";

      if (jsons.length > 0) {
        for (let json of jsons) {
          const name = json.nom;
          const adresse = json.add;
          const idDep = json.id_dep;
          const nomDep = json.departement;
          const idEtab = json.id_etab;
          const table = document
            .querySelector("#activeTribu")
            .getAttribute("data-table-name");

          body_table += `
                                <tr>
                                    <td>${name}</td>
                                    <td>${adresse}</td>
                                    <td class="d-flex bd-highlight">
                                        <button data-tbname = ${table} data-id="${idEtab}" data-name="${name}" data-adresse="${adresse}" class="btn btn-info" onclick="showEtabDetail(event,'${nomDep}', ${idDep}, ${idEtab})">Détail</button>
                                        <button data-tbname = ${table} data-id="${idEtab}" data-name="${name}" data-adresse="${adresse}" class="btn btn-primary ms-1" onclick="pastilleGolf(this)">Pastillez</button>
                                    </td>
                                </tr>
                            `;
        }

        document.querySelector("#elie-restou").innerHTML =
          head_table + body_table + foot_table;

        $("#resto-a-pastiller-list").DataTable({
          language: {
            url: "//cdn.datatables.net/plug-ins/1.13.4/i18n/fr-FR.json",
          },
        });
      } else {
        document.querySelector("#elie-restou").style.display = "block";
        document.querySelector("#elie-restou").innerHTML =
          "<div class='container text-center'>Aucun restaurant qui correspond au recherche de " +
          document.querySelector("#resto-rech").value +
          "</div>";
      }
    });
}

function showEtabDetail(event, nom_dep, id_dep, id_etab) {
  const request = new Request(
    `/api/agenda/golf/${nom_dep}/${id_dep}/detail/${id_etab}`
  );

  $("#modalForExtension").modal("hide");
  $("#detailEtabModal").modal("show");

  let dataName = event.target.dataset.name;
  let dataAdresse = event.target.dataset.adresse;
  let modalBody = document.querySelector("#detailEtabModal .modal-body");
  document.querySelector(".content_etab_detail").innerHTML = `<div>
                                <div class="mb-2">
                                    <span class="mt-2 ms-3"><b>${dataName}</b></span>
                                </div>
                                <p style="text-align:padding-left:4% !important;">
                                    <a href="#" class="small" style="margin-left:4%#19a8d8 !important;">
                                        ${dataAdresse}
                                    </a>
                                </p>
                            </div>`;

  modalBody.innerHTML = `<div class="d-flex justify-content-center">
                                                <div class="spinner-border" role="status">
                                                    <span class="sr-only">Loading...</span>
                                                </div>
                                                </div>`;

  fetch(request)
    .then((res) => res.text())
    .then((html) => {
      modalBody.innerHTML = html;
    });
}

/**
 * @notused
 * @deprecated
 * @param {} id_pastille
 * @param {*} denomination_f
 * @param {*} adresse
 * @param {*} note
 * @param {*} create
 * @param {*} type
 */
function openPopupActionGolf(
  id_pastille = null,
  denomination_f = null,
  adresse = null,
  note,
  create,
  type
) {
  let tableTribu = document.querySelector("#activeTribu").dataset.tableName;

  $("#detailOptionGolf").modal("show");

  // document.querySelector("#data-note-elie-js").innerHTML = `<i class="fas fa-edit"></i> ` + text1

  //document.querySelector("#data-note-nanta-js").removeAttribute("onclick");
  console.log("ee" + document.querySelector("#data-event-nanta-js"));
  document
    .querySelector("#data-event-nanta-js")
    .setAttribute(
      "onclick",
      `openOnEvent(${id_pastille},'${denomination_f}','${adresse}')`
    );
  let btn = document.querySelector("#data-depastilleGolf-nanta-js");
  btn.dataset.id = id_pastille;
  btn.dataset.name = denomination_f;
  btn.dataset.tbname = document
    .querySelector("#activeTribu")
    .getAttribute("data-table-name");
  btn.dataset.id = id_pastille;
  btn.dataset.name = denomination_f;
  btn.dataset.tbname = tableTribu;

  document
    .querySelector(".add_attribut_tomm_js")
    .setAttribute("id", "details-coord");
  document
    .querySelector(".add_attribut_tomm_js")
    .setAttribute("data-toggle-type", type);
  document
    .querySelector(".add_attribut_tomm_js")
    .setAttribute("data-toggle-id-golf", id_pastille);
}

/**
 * @constructor
 * @author Elie <eliefenhasina@gmail.com>
 * @Fonction fetch toutes les historiques dans la tribu T et affichage dans un tableau
 */
function fetchAllInvitationStory() {
  let table = document
    .querySelector("#tribu_t_name_main_head")
    .dataset.tribu.trim();
  let tbody_hist = document.querySelector("#all_historique");

  let table_display_name = document.querySelector("#tribu_t_name_main_head").textContent.trim();

	let fullName = document.querySelector("span.use-in-agd-nanta_js_css.status-tomm-js").textContent.trim();

  tbody_hist.innerHTML = `<td colspan="4"><div class="d-flex justify-content-center">
                        <div class="spinner-border" role="status">
                        <span class="visually-hidden">Loading...</span>
                        </div>
                    </div></td>`;
  fetch("/tribu/invitation/get_all_story/" + table)
    .then((response) => response.json())
    .then((response) => {
      // console.log(response)
      if (response.length > 0) {
        tbody_hist.innerHTML = "";
        for (const item of response) {
          // console.log(item);

          tbody_hist.innerHTML += `<tr>
                            <td>${item.email}</td>
                            <td class="">${item.date}</td>
                            <td class="">${
                              item.user
                                ? `<a href="/user/profil/${
                                    item.user.userId.id
                                  }" class="badge text-bg-primary">${
                                    item.user.firstname +
                                    " " +
                                    item.user.lastname
                                  }</a>`
                                : `<span class="badge text-bg-warning">Compte non trouvé</span>`
                            }</td>
                            <td><a href="${item.sender? "/user/profil/"+item.sender.id :"#"}" class="badge text-bg-primary">${
                              item.sender? item.sender.firstname + " " + item.sender.lastname :"Fondateur"
                            }</a>
                            </td>
                            <td>${
                              item.is_valid == 1
                                ? `<span class="badge text-bg-success">Validé</span>`
                                : `<span class="badge text-bg-warning">En attente</span>`
                            }</td>
                            <td>
                              ${item.is_valid == 0
                                ? `<button class="badge text-bg-primary" onclick="relanceInvitationExterne('${table}', '${table_display_name}', '${item.email}', '${fullName}')">
                                <i class="fa-solid fa-user-plus"></i> Relancer </button>`
                                : ``
                                }
                            </td>
                        </tr>
                    `;
        }
        if (!$.fn.dataTable.isDataTable("#historique_invitation")) {
          $("#historique_invitation").DataTable({
          language: {
            url: "//cdn.datatables.net/plug-ins/1.13.4/i18n/fr-FR.json",
          },
          "ordering": false,
        });
        }
  
        $("#historique_invitation").DataTable().destroy();
        
      } else {
        tbody_hist.innerHTML = "Aucun historique enregistré pour le moment!";
      }
    })
    .catch((error) => console.log(error));
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
      !listNotAccepted.some(
        (item) => item.toLowerCase() === extensions.toLowerCase()
      ) &&
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
        email_piece_joint_list.push({
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
      !listNotAccepted.some(
        (item) => item.toLowerCase() === extensions.toLowerCase()
      ) &&
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
        email_piece_joint_list.push({
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
 * and update variable global `email_piece_joint_list` list of the piece joint
 *
 * @param {*} e : event html object: item list piece jointe
 * @param {*} id : unique id in to identify the item piece joint in the list `email_piece_joint_list`
 *
 * @return void
 */
function removeListeItem(e, id) {
  ///remove html element
  e.parentElement.remove();
  ///remove one element in the piece global
  email_piece_joint_list = email_piece_joint_list.filter(
    (item) => item.id != id
  );
}

// function addLinkOnMailBody() {
  //   const link_name = document.querySelector(".link_name_jheo_js").value.trim();
  //   const link_value = encodeURI(
    //     document.querySelector(".link_value_jheo_js").value
  //   );

  //   if (editor) {
    //     editor.setData(
      //       editor.getData() +
        //         '<a class="link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover" href="' +
        //         link_value +
        //         '" >' +
        //         link_name +
        //         " </a>"
    //     );
  //   }

  //   cancelAddLink();
// }

/**
 * @author Tomm
 * creater une album dan le tableao album du tribu t
 * @param dans le tribuT.html.twig sur le modale createAlbumTribuT
 */
function createAlbumTribuT() {
  const valueNameAlbum = document
    .querySelector(".value-name-album-tomm-js")
    .value.replaceAll("'", "")
    .replaceAll('"', "");

  if (valueNameAlbum !== "") {
  const request = new Request(`/user/tribu/photos/album/${tribu_t_name_0}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name_album: valueNameAlbum }),
  });
  fetch(request)
      .then((res) => res.json())
      .then((resp) => {
if (resp == true) {
    swal({
      title: "Creation",
      text: "Votre album a été bien créer.",
      icon: "success",
      button: "OK",
      });
  document.querySelector("#gal-album-t").click();
  document.querySelector(".btn-close-creer-album-tomm-js").click();
} else {
          swal({
            title: "déjà existé",
            text: "Votre album est déjà existé.",
            icon: "error",
            button: "OK",
          });
        }
      });
  } else {
    swal({
      title: "Vide",
      text: "Veuillez inscrire le nom de votre album.",
      icon: "error",
      button: "OK",
    });
  }

  // fetchAllGalereInAlbum()
}

/**
 * @author Tomm
 * fetch touts les photos dans tribuT
 * @param dans
 */
function fetchAllGalereInAlbum(idAlbum) {
  if (document.querySelector(".content-gal-all")) {
    document
      .querySelectorAll(".content-gal-all")
      .forEach((item) => item.remove());
  }
  const requete = new Request(
    "/user/tribu/photos/show/album/" + tribu_t_name_0 + "_publication",
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );
  fetch(requete)
    .then((rqt) => rqt.json())
    .then((data) => {
      let li_img = "";
      for (let photos of data) {
        for (let photo of photos) {
          let img_src = photo.photo;
          console.log(img_src);
          if (!img_src == "") {
            const imgSplit = img_src.split("/")[6];
            const imgNameSplit = imgSplit.split(".")[0];
            const parser = new DOMParser();
            const htmlDocument = parser.parseFromString(li_img, "text/html");
            if (!htmlDocument.querySelector(`.photo_${imgNameSplit}`)) {
              if (parseInt(photo.isAlbum) != 1) {
                li_img += `
									<div class="col-lg-4 col-md-12 mb-4 mb-lg-0 content-gal-all photo_${imgNameSplit}">
									<input type="checkbox" class="select-album value-checked-album-tomm-js" data-id="${photo.id}" value="${img_src}"/>
									<img
									src="${img_src}"
									class="w-100 shadow-1-strong  mb-4"
									alt="Boat on Calm Water"
									/>
									</div>
                        		`;
              }
            }
          }
        }
      }
      document.querySelector(".all-galeri-to-album-tomm-js").innerHTML +=
        li_img;
      clickCopyePathAlbumTribu(idAlbum);
    });
}

/**
 * @author Tomm
 * ajouter le photo dans l'album
 * @param dans le tribuT.html.twig sur le modale selectAddAlbum
 */
function copyePathAlbumTribuT(idAlbum) {
  const valuePathAlbum = document.querySelectorAll(
    ".value-checked-album-tomm-js"
  );
  // const idAlbum = document.querySelector(".album-tomm-js").getAttribute("data-id-album");
  let allValuePathAlbum = [];
  let allIdPub = [];
  for (let i = 0; i < valuePathAlbum.length; i++) {
    if (valuePathAlbum[i].checked) {
      allValuePathAlbum.push(valuePathAlbum[i].value);
      let idPub = valuePathAlbum[i].dataset.id;
      allIdPub.push(idPub);
    }
  }
  const request = new Request(
    `/user/tribu/photos/copyer/album/${tribu_t_name_0}`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        path: allValuePathAlbum,
        albumId: idAlbum,
        idPub: allIdPub,
      }),
    }
  );
  fetch(request).then(() => {
    swal({
      title: "Photo Ajouté",
      text: "Votre photo a été bien ajoutée dans l'album.",
      icon: "success",
      button: "OK",
    });
  });
}

function getAlbumTribuT(tribu_t_types) {
  if (document.querySelector(".insert-album-tomm-js")) {
    document
      .querySelectorAll(".doc-album-tomm-js")
      .forEach((item) => item.remove());
  }
  const requete = new Request(`/user/tribu/get/album/${tribu_t_name_0}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  fetch(requete)
    .then((response) => response.json())
    .then((data) => {
      let contentAlbum = document.querySelector(".insert-album-tomm-js");
      for (let album of data) {
        contentAlbum.innerHTML += `  
          <div class="doc-album col-4 mb-2 album-${
            album.id
          }-tomm-js doc-album-tomm-js" onclick="docAlbumClick(${
          album.id
        }, '${album.name_album
          .replace("'", "")
          .replace('"', "")}', '${tribu_t_types}')">
            <i class="fa-regular fa-folder-open"></i>
            <p>${album.name_album}</p>
          </div>
          `;
      }
    });
}

function docAlbumClick(idAlbum, nameAlbum, tribu_t_types) {
  document.querySelector(".album-tomm-js").classList.toggle("d-none");

  let contentAmbum = document.querySelector(".content-album-tomm-js");
  let btnSelectImgAlbum = "";
  if (tribu_t_types == "tribu_T_owned") {
    btnSelectImgAlbum = ` 
            <button type="button" class="btn btn-light create-album-img col-4" data-bs-toggle="modal" data-bs-target="#selectAddAlbum" onclick="fetchAllGalereInAlbum('${idAlbum}')">
			Ajouter des photos  
              <i class="fa-solid fa-plus"></i>
            </button>`;
  }
  contentAmbum.innerHTML += `
    <div class="row photo-imp-t-tomm-js photo-album-tomm-js" data-name-album="${nameAlbum}" data-id-album="${idAlbum}">
      <div class="row">
        <p class="col-1"><i class="fa-solid fa-arrow-left" onclick="closeAlbum()"></i></p>
        <h3 class="col-7">${nameAlbum}</h3>
		${btnSelectImgAlbum}
      </div>

        <div class="row insert-photo-album-tomm-js mt-3">
          
        </div>
    </div>
  `;

  getCopyePathAlbumTribuT(idAlbum);
}

function clickCopyePathAlbumTribu(idAlbum, nameAlbum) {
  if (document.querySelector(".copye-album-tribu-t-tomm-js")) {
    document.querySelectorAll(".select-album").forEach((event) => {
      event.addEventListener("change", (e) => {
        if (event.checked) {
          document
            .querySelector(".copye-album-tribu-t-tomm-js")
            .addEventListener("click", () => {
              document.querySelector(".btn-close-tomm-js").click();
              document
                .querySelector(".album-tomm-js")
                .classList.toggle("d-none");
              document.querySelector(".photo-album-tomm-js").remove();
              copyePathAlbumTribuT(idAlbum);
            });
          document
            .querySelector(".copye-album-tribu-t-tomm-js")
            .classList.add("btn-primary");
          document
            .querySelector(".copye-album-tribu-t-tomm-js")
            .classList.remove("btn-secondary");
          document
            .querySelector(".copye-album-tribu-t-tomm-js")
            .removeAttribute("disabled");
        } else {
          let val = true;
          document.querySelectorAll(".select-album").forEach((event) => {
            if (event.checked) {
              val = false;
            }
          });
          if (val) {
            document
              .querySelector(".copye-album-tribu-t-tomm-js")
              .setAttribute("disabled", "");
          }
        }
      });
    });
  }
}

function getCopyePathAlbumTribuT(idAlbum) {
  const requete = new Request(
    `/user/tribu/get/copyer/album/${tribu_t_name_0}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );
  fetch(requete)
    .then((response) => response.json())
    .then((data) => {
      let contentPhotoAlbum = document.querySelector(
        ".insert-photo-album-tomm-js"
      );
      for (let photoAlbum of data) {
        let imageAlbum = "";
        if (photoAlbum.album_id == idAlbum) {
          imageAlbum = `
            <div class="col-lg-4 col-md-12 mb-2 album" data-floor=${photoAlbum.album_id} onclick="openGalleriesPhotoTribuT(this)">
                <img src="${photoAlbum.path}" class="shadow-1-strong album" data-floor=${photoAlbum.album_id} alt="Album"/>
            </div>
          `;
        }
        contentPhotoAlbum.innerHTML += imageAlbum;
      }
    });
}

function closeAlbum() {
  document.querySelector(".album-tomm-js").classList.toggle("d-none");
  document.querySelector(".photo-album-tomm-js").remove();
}
/**
 * @author faniry <faniryandriamihaingo@gmail.com> doesn't disturb me when I'm off
 * récupère la liste des postulants dans une tribu T données
 */
function renderPosulant(tribuName) {
  const navBarTribu = document.querySelector("li.listNavBarTribu > a.active");
  const navBarPostulant = document.getElementById("cta_postulant_js");
  if (navBarTribu && navBarTribu.classList.contains("active")) {
    navBarTribu.classList.toggle("active");
  }
  if (!navBarPostulant?.classList.contains("active")) {
    navBarPostulant?.classList.toggle("active");
  }

  const url =
    "/user/postulant?" +
    new URLSearchParams({
      name: tribuName,
    });
  const resquest = new Request(url, {
    method: "GET",
  });
  fetch(resquest).then((res) => {
    if (res.status === 200 && res.ok) {
      res.json().then((postulants) => {
        const container = document.querySelector("#tribu_t_conteuneur");
        container.classList.add("bg-white")
        container.classList.add("p-2")
        createPostulantUI(postulants, container,tribuName);
      });
    }
  });
}

/**
 * @author faniry <faniryandriamihaingo@gmail.com> doesn't disturb me when I'm off
 * fait le rendu de la table des liste des postulants
 * @param array postulants
 * @param HTMLElement container
 */
function createPostulantUI(postulants, container, tribuName) {
  console.log(postulants);
  container.innerHTML = "";
  if (!document.querySelector("#postulant_modal"))
      createModalForPostulant(container);
  initCKEditor("exampleFormControlTextareaPostulant", emailRelanceContent);
 
  const headTitles = ["Selectionnez tout", "Pseudo", "Email", "Relance"];
  const postulantTable = document.createElement("table");
  //cell-border hover
  postulantTable.setAttribute("class", "cell-border hover ");
  postulantTable.id = "table_postulants";

  const postulantTableHead = document.createElement("thead");
  const postulantTableBody = document.createElement("tbody");
  const postulantTableHaedRow = document.createElement("tr");
  let postulantTableBodyRow = null;
  let th = null;
  let tdSelected = null;
  let tdPseudo = null;

  let tdEmail = null;
  let tdRelance = null;
  let btnRelance = null;
  headTitles.forEach((headTitle) => {
    th = document.createElement("th");
    if (headTitle === "Selectionnez tout") {
      th.innerHTML = `
		<label for="all_postulant">${headTitle}</label>
	  <input class="slct_all_pstl_faniry_js" id="all_postulant" type="checkbox" name="all_postulant"/>`;
    } else {
      th.innerText = headTitle;
    }

    postulantTableHaedRow.appendChild(th);
  });
  postulantTableHead.appendChild(postulantTableHaedRow);

  postulants.forEach((postulant) => {
    postulantTableBodyRow = document.createElement("tr");
let idTmp=''+postulant.userId
    tdSelected = document.createElement("td");
    tdPseudo = document.createElement("td");
    tdPseudo.setAttribute("class","pso_faniry")
    tdEmail = document.createElement("td");
    tdEmail.setAttribute("class","ml_faniry");
    tdRelance = document.createElement("td");
    tdSelected.innerHTML = `<input class="slct_pstl_fan_js" type="checkbox" name="SelectedMe" data-loop="${cryptageJs(idTmp)}"/>`;
    tdPseudo.innerText = postulant.pseudo;
    tdEmail.innerText = postulant.useremail;
    btnRelance = creaTeBtnRelance(postulant);
    tdRelance.appendChild(btnRelance);
    postulantTableBodyRow.appendChild(tdSelected);
    postulantTableBodyRow.appendChild(tdPseudo);
    postulantTableBodyRow.appendChild(tdEmail);
    postulantTableBodyRow.appendChild(tdRelance);

    postulantTableBody.appendChild(postulantTableBodyRow);

    relanceOneIvitation(btnRelance, postulant,tribuName);
  });

  postulantTable.appendChild(postulantTableHead);
  postulantTable.appendChild(postulantTableBody);

  container.appendChild(postulantTable);
  container.appendChild(createBtnRelanceAll());

  $("#table_postulants").DataTable({
    autoWidth: false,
    language: {
      url: "//cdn.datatables.net/plug-ins/1.13.4/i18n/fr-FR.json",
    },
  });

  listenCheckBoxPostulantForSelectedAll(
    document.getElementById("all_postulant"),
    Array.from(document.getElementsByClassName("slct_pstl_fan_js"))
  );
  listenCheckBoxPostulant(
    document.getElementById("all_postulant"),
    Array.from(document.getElementsByClassName("slct_pstl_fan_js"))
  );

  triggerEventRelanceYourSelection(tribuName);

}

/**
 * @author faniry <faniryandriamihaingo@gmail.com> doesn't disturb me when I'm off
 * fait la relance
 */
function relanceOneIvitation(element, data,tribuName) {
	
  element.onclick = (e) => {
    const btnRelanceAll = document.querySelector(".btn_relance_all_faniry_js");
    if (btnRelanceAll.classList.contains("btn-primary")) {
      //TODO on utilise les check box qui relance
        relanceManyInvitation(tribuName) 
    } else {
      //TODO on relance la personne relative au boutton relance
        console.log(data)
        const idCrypted=cryptageJs((''+data.userId));
        const cryiptedEmail=cryptageJs(data.useremail)
        const tribuTNameCrypted=cryptageJs(tribuName)
        document.getElementById("dest_area_pst").value=data.useremail
      	const link1 = window.origin + `/verification_email?id=${idCrypted}&verif=t&tribuT=${tribuTNameCrypted}`;
        const tmpElement=document.createElement("div");
        tmpElement.innerHTML =editor.getData();
        tmpElement.querySelector("#link_faniry_js").href=link1;
        const emailContaint=tmpElement.innerHTML;
        editor.setData(emailContaint); 
        //todo send email
       
        
        document.querySelector(".pst_sb_faniry_js").onclick=(ev)=>{
          ev.target.disabled = true;
          ev.target.textContent = "Envoie en cours ...";
          const objet= cryptageJs((document.getElementById("objet_area_pst").value))
          const email=cryptageJs(editor.getData());
          sendEmailForPostulant(objet,email,fileStore,idCrypted,ev.target)

        }
        //
    }
  };
}

/**
 * @author faniry
 * envoie les email de relance pour les postulants selectionner
 */
function relanceManyInvitation(tribuName) {

  const allCheckBox=Array.from(document.getElementsByClassName("slct_pstl_fan_js")).filter(e => e.checked === true)

  if(allCheckBox.length > 0 ){
      let tmp=""
      let userDatas=[]
      allCheckBox.forEach(checkBox=>{
          const idCrypted= checkBox.dataset.loop
          const email= checkBox.parentElement.parentElement.querySelector(".ml_faniry")
          const cryiptedEmail=cryptageJs(email.textContent);
          const tribuTNameCrypted=cryptageJs(tribuName);
          const link1 = window.origin + `/verification_email?id=${idCrypted}&verif=t&tribuT=${tribuTNameCrypted}`;
          const tmpElement=document.createElement("div");
          tmpElement.innerHTML =editor.getData();
          tmpElement.querySelector("#link_faniry_js").href=link1;
          const emailContaint=tmpElement.innerHTML;
          editor.setData(emailContaint); 
          const objectTmp={ 
            i: idCrypted,
            m: cryptageJs(editor.getData())
          }
          userDatas.push(objectTmp);
          tmp+= email.textContent+" "
          document.getElementById("dest_area_pst").value=tmp.trim()
      });
      document.querySelector(".pst_sb_faniry_js").onclick=(ev)=>{
        ev.target.disabled = true;
        ev.target.textContent = "Envoie en cours ...";
        const objet= cryptageJs((document.getElementById("objet_area_pst").value))
        sendEmailForManyPostulant(objet,userDatas,fileStore,ev.target)
      }
      
  }

  
 
}

/**
 * @author faniry
 * écoute l'événement du bouton relancez vos selection
 */
function triggerEventRelanceYourSelection(tribuName){
  const btnRelanceAll = document.querySelector(".btn_relance_all_faniry_js");
  btnRelanceAll.onclick = (e) => {
      relanceManyInvitation(tribuName)

  };
}
/***
 * @author faniry <faniryandriamihaingo@gmail.com> doesn't disturb me when I'm off
 * créé le boutton de relance
 * @returns HtMLElement
 */
function creaTeBtnRelance(data) {
  const btn = document.createElement("button");
  btn.setAttribute("class", "btn btn-primary btn_relance_faniry_js");
  btn.id = `relance_${data.userId}_faniry_js`;
  btn.dataset.rank = cryptageJs((''+data.userId));
  btn.dataset.bsToggle = "modal";
  btn.dataset.bsTarget = "#postulant_modal";
  btn.setAttribute("type", "button");
  btn.innerHTML = "Relancez";

  return btn;
}

/**
 * @author faniry
 * créé le bouton relancez vos selection
 * @returns HtMLElement
 */
function createBtnRelanceAll() {
  const btnRelanceAll = document.createElement("button");
  //btnRelanceAll.disabled=true
  btnRelanceAll.setAttribute(
    "class",
    "btn btn-secondary btn_relance_all_faniry_js"
  );
  btnRelanceAll.setAttribute("type", "button");
  btnRelanceAll.disabled=true;
  btnRelanceAll.dataset.bsToggle = "modal";
  btnRelanceAll.dataset.bsTarget = "#postulant_modal";
  btnRelanceAll.innerHTML = "Relancez vos sélections.";
  return btnRelanceAll;
}

/**
 * @author faniry
 * ecoute les événements de toutes les checkbox
 * @param {*} element1 
 * @param {*} elements 
 */
function listenCheckBoxPostulant(element1, elements) {
  elements.forEach((element) => {
    element.onchange = (e) => {
      const btnRelanceAll = document.querySelector(
        ".btn_relance_all_faniry_js"
      );
      const whoIsCheked = elements.filter(
        (element2) => element2.checked === true
      );
      console.log(whoIsCheked);
      if (e.target.checked) {
        if (elements.length === whoIsCheked.length) {
          element1.checked = true;
          btnRelanceAll.classList.remove("btn-secondary");
          btnRelanceAll.classList.add("btn-primary");
          disableRelanceAll(btnRelanceAll);
        } else {
          btnRelanceAll.classList.remove("btn-secondary");
          btnRelanceAll.classList.add("btn-primary");
          disableRelanceAll(btnRelanceAll);
        }
      } else {
        if (elements.length - 1 === whoIsCheked.length) {
          element1.checked = false;
        }
        if (whoIsCheked.length === 0) {
          btnRelanceAll.classList.remove("btn-primary");
          btnRelanceAll.classList.add("btn-secondary");
          disableRelanceAll(btnRelanceAll);
        }
      }
    };
  });
}

/**
 * @author faniry
 * ecoute les événements du checkbox selectionnez tout
 * @param {*} element 
 * @param {*} elements 
 */
function listenCheckBoxPostulantForSelectedAll(element, elements) {
  element.onchange = (e) => {
    const btnRelanceAll = document.querySelector(".btn_relance_all_faniry_js");
    if (e.target.checked) {
      elements.forEach((element) => {
        element.checked = true;
      });
      // relnaceManyInvitation();
      btnRelanceAll.classList.remove("btn-secondary");
      btnRelanceAll.classList.add("btn-primary");
      disableRelanceAll(btnRelanceAll);
    } else {
      elements.forEach((element) => {
        element.checked = false;
      });
      btnRelanceAll.classList.remove("btn-primary");
      btnRelanceAll.classList.add("btn-secondary");
      disableRelanceAll(btnRelanceAll);
    }
  };
}

/**
 * @author faniry 
 * met l'etat disabled au bouton relancez vos selection
 * @param {*} btnRelanceAll 
 */
function disableRelanceAll(btnRelanceAll) {
  if (btnRelanceAll.classList.contains("btn-secondary")) {
    btnRelanceAll.disabled = true;
  } else {
    btnRelanceAll.disabled = false;
  }
}

/**
 * @faniry
 * fait le rendu de l'éditeur de l'email pour la relance postulant
 * @param {*} container 
 */
function createModalForPostulant(container) {
  const divModal = document.createElement("div");
  divModal.setAttribute("class", "modal fade");
  divModal.setAttribute("aria-labelledby", "postulantModalLabel");
  divModal.setAttribute("aria-hidden", "true");
  divModal.id = "postulant_modal";
  divModal.innerHTML = `
		<div class="modal-dialog modal-lg">
		<div class="modal-content">
			<div class="modal-header">
			<h5 class="modal-title" id="postulantModalLabel">Relancez et incitez vos amis à devenir Partisan.</h5>
			<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
			</div>
			<div class="modal-body">
				<div class="input-group mb-3">
					<span class="input-group-text" id="basic-addon1">Destinataires</span>
					<input type="text" id="dest_area_pst" class="form-control destinaire_postulant" placeholder="" aria-label="Destinataire" aria-describedby="basic-addon1" disabled>
				</div>
				<div class="input-group mb-3">
					<span class="input-group-text" id="basic-addon1">Objet</span>
					<input type="text" id="objet_area_pst" class="form-control objet_destinataire" placeholder="" aria-label="Objet" aria-describedby="basic-addon1">
				</div>
				<div id="exampleFormControlTextareaPostulant">
					<div class="wrapper pt-3 pb-3">
						<textarea cols="100 invitation_description_js_jheo" id="postulat_email">
							
						</textarea>

						<pre id="output"></pre>
					</div>
				</div>
			</div>
			<div class="modal-footer">
				<ul class="list-group content_list_piece_joint content_list_piece_joint_jheo_js d-none"></ul>

				<div class="d-flex justify-content-start align-items-center">
					<div class="p-2 bd-highlight">
						<button type="button" class="btn btn-primary pst_sb_faniry_js my-3">Envoyer.</button>
					</div>
					<div class="p-2 bd-highlight content_input_piece_joint content_input_piece_joint_jheo_js">
						<div class="message_tooltip_piece_joint d-none message_tooltip_piece_joint_jheo_js">Ajout des pièce jointe.</div>
						<label class="label_piece_joint_jheo_js" for="piece_joint"><i class="label_piece_joint_jheo_js fa-solid fa-paperclip"></i></label>
						<input type="file" class="input_piece_joint_jheo_js hidden " id="piece_joint" name="piece_joint" onchange="addPieceJointPostulant(this)" />
					</div>
					<div class="p-2 bd-highlight content_input_piece_joint content_add_image_js">
						<div class="pointer_cursor message_tooltip_piece_joint d-none add_image_jheo_js">Ajout des images.</div>
						<label class="pointer_cursor label_add_image_jheo_js" for="piece_joint_image"><i class="fa-solid fa-image"></i></label>
						<input type="file" class="input_piece_joint_jheo_js hidden " id="piece_joint_image" name="piece_joint_image" accept="image/png, image/jpeg, image/jpg" onchange="addPieceJointImagePostulant(this)"/>
					</div>
				</div>
			 	
			</div>
		</div>
		</div>
	`;
  container.appendChild(divModal);
  document.getElementById("objet_area_pst").value =
    "Relance pour valider votre profil sur consomyzone.";
 
}

/**
 * @author faniry
 * edit le contenu de l'email de relance  à envoyer
 * @returns  String html
 */
function emailRelanceContent() {
  const nameTribuT = document.querySelector(
    "#tribu_t_name_main_head"
  )?.textContent;
  let userSender = "";
  if (document.querySelector(".information_user_conected_jheo_js"))
    userSender = document.querySelector(".information_user_conected_jheo_js")
      .dataset.userfullname;

  return `
		<span>Madame, Monsieur,</span></br>

			<span>Validez votre profil sur consomyzone pour profiter de ses multiples fonctionnalités.</span> 
			<p>Nous serions ravis de vous compter parmi nos membres.  Votre présence sera une aide précieuse.</br>
			
			Dans cette attente, je vous adresse mes cordiales salutations.</p></br>
			<a href="#" id="link_faniry_js" style="text-decoration:underline;color:blue; cursor:pointer"><span>Validez le profil.</span></a>
		<span><br/>${userSender}</span>`;
}


/**
 * @author ajoute une piece jointe fichier à l'email pour la relance postulant
 * @param {*} input 
 */
function addPieceJointPostulant(input) {
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
      !listNotAccepted.some(
        (item) => item.toLowerCase() === extensions.toLowerCase()
      ) &&
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
        fileStore.push({
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
 * ajoute une piece jointe image à l'email pour la relance postulant
 * @param {*} input 
 */
function addPieceJointImagePostulant(input) {
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
      !listNotAccepted.some(
        (item) => item.toLowerCase() === extensions.toLowerCase()
      ) &&
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
        fileStore.push({
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


function removeListeItemPostulant(e, id) {
  ///remove html element
  e.parentElement.remove();
  ///remove one element in the piece global
  fileStore = fileStore.filter((item) => parseInt(item.id) != parseInt(id));
}

/**
 * @author faniry
 * envoie l'email pour une seul relance
 * @param {*} ObjetMail 
 * @param {*} mailContent 
 * @param {*} pieceJointe 
 * @param {*} idUserToSendEmail 
 */

function sendEmailForPostulant(ObjetMail, 
  mailContent, 
  pieceJointe,
  idUserToSendEmail,
  element){
  const data={
    objetMail:ObjetMail,
    mailContent:mailContent,
    pieceJointe:pieceJointe,
    idUserToSendEmail:idUserToSendEmail
  }
  const request=new Request("/user/mail/postulant",{
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data)

  })
  fetch(request).then((response) =>{
    if( response.status === 200 && response.ok ){
        //TODO faire des actions après que le send mail soit fait
        element.disabled = false;
        element.textContent="Envoyer."
        new  swal({
          title: "Fait",
          text: "Relance réussi.",
          icon: "success",
          button: "OK",
        });
    }else{
        swal({
          title: "Erreur",
          text: "Erreur 500",
          icon: "error",
          button: "OK",
        });
    }
    
  })
}


/**
 * @author faniry
 * envoie le email pour l'option relancez vos selections.
 * @param {*} objetMail 
 * @param {*} mailContent 
 * @param {*} pieceJointe 
 */
function sendEmailForManyPostulant(objetMail,
  mailContent,
  pieceJointe,
  ){
    const data={
      objectMail: objetMail,
      contents: mailContent,
      pieceJointe: pieceJointe,
      
    }
    const request=new Request("/user/mail/selected/postulant",{
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
  
    })
    fetch(request).then((response) =>{
      if( response.status === 200 && response.ok ){
        //TODO faire des actions après que le send mail soit fait
        new  swal({
          title: "Fait",
          text: "Relance réussi.",
          icon: "success",
          button: "OK",
        });
      }else{
        swal({
          title: "Erreur",
          text: "Erreur 500",
          icon: "error",
          button: "OK",
        });
      }
    })
}