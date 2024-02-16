// let table = new DataTable('#myTable');
// console.log(table);

// {
//     data: dataSet,
//     columns: [
//         { title: 'Name' },
//         { title: 'Position' },
//         { title: 'Office' },
//         { title: 'Extn.' },
//         { title: 'Start date' },
//         { title: 'Salary' },
//     ],
// }
var fileStoreAdmin=[]
var __markerOld1 = null,
  __markerOld2 = null;
var __map1, __map2;
window.addEventListener("load", () => {
  if (document.querySelector("#list-tribu-g")) {
    document.querySelector(".content_global_super_admin_js_jheo").innerHTML = `
        <div class="content_chargement content_chargement_js_jheo">
            <div class="spinner-border spinner-border text-info" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>`;
    fetch("/user/dashboard/tribug_json")
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        const { allTribuG } = result;
        const dataSet = dataFormat(allTribuG);

        deleteChargement();
        bindContentTable();

        $("#myTable").DataTable({
          data: dataSet,
          order: [[5, "desc"]],

          initComplete: function () {
            document.querySelectorAll(".span_th_js_jheo").forEach((item) => {
              item.parentElement.innerHTML += `<input class="input_column input_column_js_jheo" type="text" placeholder="Search"/>`;
            });

            // Apply the search
            this.api()
              .columns()
              .every(function () {
                var that = this;
                console.log(this);
                $(".input_column_js_jheo", this.header()).on(
                  "keyup change clear",
                  function () {
                    if (that.search() !== this.value) {
                      that.search(this.value).draw();
                    }
                  }
                );
              });
          },
          language: {
            url: "//cdn.datatables.net/plug-ins/1.13.4/i18n/fr-FR.json",
          },
        });

        const label = document.querySelector("#myTable_filter label");
        const input_search = document.querySelector(
          "#myTable_filter label input"
        );
        if (input_search) {
          input_search.setAttribute("placeholder", "Recherche de tribu G");

          while (label.firstChild) {
            label.removeChild(label.firstChild);
          }

          label.appendChild(input_search);
        }
      });

    document.querySelector(
      ".content_global_super_admin_tribu_t_js_jheo"
    ).innerHTML = `
        <div class="content_chargement content_chargement_tribu_t_js_jheo">
            <div class="spinner-border spinner-border text-info" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
    `;

    fetch("/user/dashboard/tribut_json")
      .then((response) => response.json())
      .then((result) => {
        const { allTribuT } = result;
        const dataSet = dataFormatTribuT(allTribuT);

        deleteChargementTrubuT();
        bindContentTableTribuT();

        $("#myTableTribut").DataTable({
          data: dataSet,
          order: [[5, "desc"]],

          initComplete: function () {
            document
              .querySelectorAll(".span_th_js_tribu_t_jheo")
              .forEach((item) => {
                item.parentElement.innerHTML += `<input class="input_column input_column_tribu_t_js_jheo" type="text" placeholder="Search"/>`;
              });

            // Apply the search
            this.api()
              .columns()
              .every(function () {
                var that = this;
                console.log(this);
                $(".input_column_tribu_t_js_jheo", this.header()).on(
                  "keyup change clear",
                  function () {
                    if (that.search() !== this.value) {
                      that.search(this.value).draw();
                    }
                  }
                );
              });
          },
          language: {
            url: "//cdn.datatables.net/plug-ins/1.13.4/i18n/fr-FR.json",
          },
        });
        const label = document.querySelector("#myTable_filter_tribu_t label");
        const input_search = document.querySelector(
          "#myTable_filter_tribu_t label input"
        );
        if (input_search) {
          input_search.setAttribute("placeholder", "Recherche de tribu T");

          while (label.firstChild) {
            label.removeChild(label.firstChild);
          }

          label.appendChild(input_search);
        }
      });
  } else {
    getListeInfoTovalidate();
  }
});

function dataFormat(dataToFormat) {
  const data = [];
  t.forEach((item, index) => {
        // $name_tributG = "tribug_" . $departement . "_" . implode("_", explode(" ", $user_profil->getQuartier()));
    let quartier = item.i + " " + item.co;

    const test_length =
      "tribug_" + item.d + "_" + quartier.split(" ").join("_");

    if (test_length.length > 40) {
      const data = quartier.split(" ");

      let resolve_name = [];
      for (let i = 0; i < (data.length - 1) / 2; i++) {
        resolve_name.push(data[i]);
      }

      quartier = resolve_name.join("_");
    }

    const departement = item.d.length === 1 ? "0" + item.d : item.d;

    let name_tributG =
      "tribug_" + departement + "_" + quartier.split(" ").join("_");
    name_tributG =
      name_tributG.length > 40 ? name_tributG.substr(0, 30) : name_tributG;

const table_exist = dataToFormat.find(
      (item) => name_tributG === item.table_name
    );

    data.push([
      index + 1,
      item.d,
      item.co,
      item.co + " " + item.i,
      // name_format,
name_tributG,
      table_exist ? table_exist.count : 0,
      // "<a class='btn btn-primary' href=/user/dashboard-membre?table=" +
      //   table_tribug +
      // ">Voir</a>",
      "<a class='btn btn-primary' href=/user/dashboard-membre?table=" +
        name_tributG +
        ">Voir</a>",
    ]);
    // data.push({
    //     code: item.d,
    //     commune: item.co,
    //     quartier: item.co + " " + item.i,
    //     inv_quartier: item.i + " " + item.co,
    //     name: name_format,
    //     nbr_content: table_exist ? table_exist.count : 0,
    //     link: `/user/dashboard-membre?table=${table_tribug}`
    // })
  });
  return data;
}

function dataFormatTribuT(dataToFormat) {
  const data = [];
  t.forEach((item, index) => {
    const tribut =
      "tribut_" +
      item.d +
      "_" +
      item.i
        .split(" ")
        .map((t) => t.toLowerCase())
        .join("_") +
      "_" +
      item.co
        .split(" ")
        .map((t) => t.toLowerCase())
        .join("_");
    const name_format =
      "tribut_" +
      item.d +
      "_" +
      item.i.replace(/( )/g, "_") +
      "_" +
      item.co.replace(" ", "_");
    const table_exist = dataToFormat.find((item) =>
      name_format.includes(item.table_name)
    );
    const table_tribut = tribut.length > 30 ? tribut.substr(0, 30) : tribut;
    data.push([
      index + 1,
      item.d,
      item.co,
      item.co + " " + item.i,
      name_format,
      table_exist ? table_exist.count : 0,
      // "<a class='btn btn-primary' href=/user/dashboard-membre?table="+table_tribug+ ">Voir</a>"
    ]);
    // data.push({
    //     code: item.d,
    //     commune: item.co,
    //     quartier: item.co + " " + item.i,
    //     inv_quartier: item.i + " " + item.co,
    //     name: name_format,
    //     nbr_content: table_exist ? table_exist.count : 0,
    //     link: `/user/dashboard-membre?table=${table_tribug}`
    // })
  });
  return data;
}

function addChargement() {}

function deleteChargement() {
  document.querySelector(".content_chargement_js_jheo").remove();
}

function deleteChargementTrubuT() {
  document.querySelector(".content_chargement_tribu_t_js_jheo").remove();
}

function bindContentTable() {
  document.querySelector(".content_global_super_admin_js_jheo").innerHTML = `
    <div class="table-responsive">
        <table class="table table_content table-hover" id="myTable">
            <thead class="thead-dark">
                <tr>
                    <th>#</th>
                    <th>
                        <span class="span_th_js_jheo">Code</span>
                    </th>
                    <th>
                        <span class="span_th_js_jheo">Commune</span>
                    </th>
                    <th>
                        <span class="span_th_js_jheo">Quartier</span>
                    </th>
                    <th>
                        <span class="span_th_js_jheo">Tribu G</span>
                    </th>
                    <th>
                        <span class="span_th_js_jheo">Efféctif</span>
                    </th>
                    <th></th>
                </tr>
            </thead>
            <tbody class="content_list_tributG_js_jheo">
            </tbody>
        </table>
        
    </div>
    `;
}

function bindContentTableTribuT() {
  document.querySelector(
    ".content_global_super_admin_tribu_t_js_jheo"
  ).innerHTML = `
    <div class="table-responsive">
        <table class="table table_content table-hover" id="myTableTribuT">
            <thead class="thead-dark">
                <tr>
                    <th>#</th>
                    
                    
                    
                    <th>
                        <span class="span_th_tribu_t_js_jheo">Tribu T</span>
                    </th>
                    <th>
                        <span class="span_th_tribu_t_js_jheo">Efféctif</span>
                    </th>
                    <th></th>
                </tr>
            </thead>
            <tbody class="content_list_tributT_js_jheo">
            </tbody>
        </table>
        
    </div>
    `;
}

/**
 * @Author Nantenaina
 * Où: On utilise cette fonction dans l'onglet validation adresse de la rubrique Super Admin
 * Localisation du fichier: dataTable_features.js,
 * Je veux: voir la liste des adresses à valider
 *
 */
function getListeInfoTovalidate(e) {
  let linkActives = document.querySelectorAll(
    "#navbarSuperAdmin > ul > li > a"
  );
  linkActives.forEach((link) => {
    if (link.classList.contains("text-primary"))
      link.classList.remove("text-primary");
  });
  if (e) {
    e.target.classList.add("text-primary");
  } else {
    document.querySelector(".addr_faniry_js").classList.add("text-primary");
  }

  if (document.querySelector("#list-tribu-g"))
    document.querySelector("#list-tribu-g").style.display = "none";
  // document.querySelector("#list-tribu-t").style.display = "none"
  if (document.querySelector("#list-demande-partenaire"))
    document.querySelector("#list-demande-partenaire").style.display = "none";

  if (document.querySelector("#list-infoAvalider"))
    document.querySelector("#list-infoAvalider").style.display = "block";
  document.querySelector(
    ".content_list_infoAvalider_js"
  ).innerHTML = `<div class="spinner-border spinner-border text-info" role="status">
    <span class="visually-hidden">Loading...</span>
</div>`;
  let _table = `<table class="table" id="listeRestoAvaliderTable">
                    <thead>
                        <tr>
<th scope="col">Nom de l'établissement à valider</th>
                            <th scope="col">Nouveau Nom</th>
                            <th scope="col">Nouvelle Adresse</th>
                          
                            <th scope="col">Demandeur</th>
                            <th scope="col">Status</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                    `;
  // <th scope="col">Nouveau Téléphone</th>
  fetch("/user/liste/information/to/update")
    .then((response) => response.json())
    .then((r) => {
      console.log(r);
      let _tr = "";
      if (r.length > 0) {
        for (const items of r) {
          let item = items.info;
          const originaInfo = items.original_resto;
          let _adresse =
            item.numvoie +
            " " +
            item.typevoie +
            " " +
            item.nomvoie +
            " " +
            item.compvoie +
            " " +
            item.codpost +
            " " +
            item.commune;
          let _status =
            item.status == 1
              ? "Validé"
              : item.status == 0
              ? "Refusé"
              : "A valider";
          let _bgColor = "";
          if (item.status == 1) {
            _status = "Validé";
            _bgColor = "green";
          } else if (item.status == 0) {
            _status = "Refusé";
            _bgColor = "grey";
          } else {
            _status = "A valider";
            _bgColor = "blue";
          }
          _adresse = _adresse.replace(/\s+/g, " ").trim();
          const denomination_f =
            item.denominationF != "" ? item.denominationF : "non renseigné.";
          const adresse =
            _adresse.trim() != "" ? _adresse.trim() : "non renseigné.";
          const tel = item.tel != "" ? item.tel : "non renseigné.";

          _tr += `<tr style="text-align:center;vertical-align:middle;">
                            <td>${originaInfo.denominationF}</td>
                            <td>${denomination_f}</td>
                            <td>${adresse}</td>
                            <td><a href="/user/profil/${item.userId}" style="color:blue;">${items.userFullName}</a></td>
                            <td><span style="background-color:${_bgColor}; border-radius:5px; color:white; padding:5px">${_status}</span></td>
                            <td><button class="btn btn-info" onclick="getRestoInfoToValidate(${item.restoId}, ${item.userId})">Voir</button></td>
                        </tr>`;
        }
        //<td>${tel}</td>
      } else {
        _tr = `<tr><td colspan="4">Aucune information à valider</td></tr>`;
      }
      _table += _tr + "</tbody></table>";
      document.querySelector(".content_list_infoAvalider_js").innerHTML =
        _table;

      if (r.length > 0) {
        $("#listeRestoAvaliderTable").DataTable({
          language: {
            url: "https://cdn.datatables.net/plug-ins/1.13.4/i18n/fr-FR.json",
          },
        });
      }
    });
}

function getRestoInfoToValidate(restoId, userId) {
  document.querySelector(".navbar-expand-lg").display = "none";
  document.querySelector("#rejectAddTovalidate").dataset.breakfast = restoId;
  document.querySelector("#rejectAddTovalidate").dataset.killer = userId;
  document.querySelector("#acceptAddTovalidate").dataset.breakfast = restoId;
  document.querySelector("#acceptAddTovalidate").dataset.killer = userId;
  document.querySelector("#cancelAddTovalidate").dataset.breakfast = restoId;
  document.querySelector("#cancelAddTovalidate").dataset.killer = userId;
  $("#infoRestoToValidateModal").modal("show");
  //document.querySelector(".navbar-expand-lg").display = "block";
  fetch(`/user/information/${restoId}/etablissement/${userId}`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      let contentCurrentInfo = document.querySelector(
        ".content_current_info_nanta_js"
      );
      let newCurrentInfo = document.querySelector(".content_new_info_nanta_js");
      let new_info = data.new_info;
      let current_info = data.current_info;
      let _iconAdminUrl = "";
      if (current_info.restaurant) {
        contentCurrentInfo.querySelector("span.rubrique").textContent =
          "RESTAURANT";
        contentCurrentInfo.querySelector("#rubriqueName > p").textContent =
          "nom: " + current_info.denominationF;
        let current_adresse =
          current_info.numvoie +
          " " +
          current_info.typevoie +
          " " +
          current_info.nomvoie +
          " " /*+ current_info.compvoie + " "*/ +
          current_info.codpost +
          " " +
          current_info.villenorm;

        contentCurrentInfo.querySelector("#x").textContent =
          "poi x: " + current_info.poiX;
        contentCurrentInfo.querySelector("#y").textContent =
          "poi y: " + current_info.poiY;

        contentCurrentInfo
          .querySelector("#google_current")
          .setAttribute(
            "onclick",
            `findInNet('google','${current_info.denominationF.replace(
              /'/g,
              "\\'"
            )}', '${current_adresse.replace(/'/g, "\\'")}')`
          );
        contentCurrentInfo
          .querySelector("#map_current")
          .setAttribute(
            "onclick",
            `findInNet('map','${current_info.denominationF.replace(
              /'/g,
              "\\'"
            )}', '${current_adresse.replace(/'/g, "\\'")}')`
          );
        contentCurrentInfo.querySelector("#num_voie").value =
          current_info.numvoie;
        contentCurrentInfo.querySelector("#type_voie").value =
          current_info.typevoie;
        contentCurrentInfo.querySelector("#nom_voie").value =
          current_info.nomvoie;
        contentCurrentInfo.querySelector("#comp_voie").value =
          current_info.compvoie;
        contentCurrentInfo.querySelector("#code_post").value =
          current_info.codpost;
        contentCurrentInfo.querySelector("#commune").value =
          current_info.villenorm;

        // current_adresse = current_adresse.replace(/\s+/g, " ").trim();
        // contentCurrentInfo.querySelector(".cmz-adresse > a").textContent =
        //   current_adresse.toLocaleLowerCase();

        if (current_info.tel != "") {
          contentCurrentInfo.querySelector(".tel>.numero").textContent =
            current_info.tel;
          //contentCurrentInfo.querySelector(".cmz-tel").style.display = "block";
        } else {
          contentCurrentInfo.querySelector(".tel>.numero").textContent =
            "Aucun numéro de téléphone.";
          //contentCurrentInfo.querySelector(".cmz-tel").style.display = "none";
        }
        contentCurrentInfo.querySelector(".cmz-categories-list").innerHTML = "";
        checkRestoMenu(
          current_info,
          contentCurrentInfo.querySelector(".cmz-categories-list")
        );
        _iconAdminUrl = "/public/assets/icon/NewIcons/icon-resto-new-B.png";
      } else {
        contentCurrentInfo.querySelector("span.rubrique").textContent = "GOLF";
        _iconAdminUrl =
          "/public/assets/icon/NewIcons/icon-blanc-golf-vertC.png";
      }

      if (new_info.restoId) {
        6;
        newCurrentInfo.querySelector("span.rubrique").textContent =
          "RESTAURANT";
        newCurrentInfo.querySelector("#rubriqueName > p").textContent =
          "nom: " +
          (new_info.denominationF != ""
            ? new_info.denominationF
            : "Non renseigné");
        let current_adresse =
          new_info.numvoie +
          " " +
          new_info.typevoie +
          " " +
          new_info.nomvoie +
          " " /*+ new_info.compvoie + " "*/ +
          new_info.codpost +
          " " +
          new_info.villenorm;

        newCurrentInfo.querySelector("#x_new").textContent =
          "poi x: " + new_info.poiX;
        newCurrentInfo.querySelector("#y_new").textContent =
          "poi y: " + new_info.poiY;
        current_adresse = current_adresse.replace(/\s+/g, " ").trim();
        newCurrentInfo
          .querySelector("#google_current_new")
          .setAttribute(
            "onclick",
            `findInNet('google','${current_info.denominationF.replace(
              /'/g,
              "\\'"
            )}', '${current_adresse.replace(/'/g, "\\'")}')`
          );
        newCurrentInfo
          .querySelector("#map_current_new")
          .setAttribute(
            "onclick",
            `findInNet('map','${current_info.denominationF.replace(
              /'/g,
              "\\'"
            )}', '${current_adresse.replace(/'/g, "\\'")}')`
          );
        newCurrentInfo.querySelector("#num_voie_new").value =
          new_info.numvoie != "" ? new_info.numvoie : "Non renseigné";
        newCurrentInfo.querySelector("#type_voie_new").value =
          new_info.typevoie != "" ? new_info.typevoie : "Non renseigné";
        newCurrentInfo.querySelector("#nom_voie_new").value =
          new_info.nomvoie != "" ? new_info.nomvoie : "Non renseigné";
        newCurrentInfo.querySelector("#comp_voie_new").value =
          new_info.compvoie != "" ? new_info.compvoie : "Non renseigné";
        newCurrentInfo.querySelector("#code_post_new").value =
          new_info.codpost != "" ? new_info.codpost : "Non renseigné";
        newCurrentInfo.querySelector("#commune_new").value =
          new_info.villenorm != "" ? new_info.villenorm : "Non renseigné";

        if (new_info.tel != "") {
          newCurrentInfo.querySelector(".tel > .numero").textContent =
            new_info.tel;
          //newCurrentInfo.querySelector(".cmz-tel").style.display = "block";
        } else {
          newCurrentInfo.querySelector(".tel > .numero").textContent =
            "Non renseigné";
          //newCurrentInfo.querySelector(".cmz-tel").style.display = "none";
        }
        newCurrentInfo.querySelector(".cmz-categories-list").innerHTML = "";
        checkRestoMenu(
          new_info,
          newCurrentInfo.querySelector(".cmz-categories-list")
        );

        if (new_info.status !== undefined) {
          document.querySelector(".titleNewOrOld").textContent =
            "Nouvelle information";
          document.querySelector("#rejectAddTovalidate").style.display =
            "block";
          document.querySelector("#acceptAddTovalidate").style.display =
            "block";
          document.querySelector("#cancelAddTovalidate").style.display = "none";
        } else {
          document.querySelector(".titleNewOrOld").textContent =
            "Ancienne information";
          document.querySelector("#cancelAddTovalidate").style.display =
            "block";
          document.querySelector("#rejectAddTovalidate").style.display = "none";
          document.querySelector("#acceptAddTovalidate").style.display = "none";
        }
      } else {
        newCurrentInfo.querySelector("span.rubrique").textContent = "GOLF";
      }

      var _container1 = L.DomUtil.get("current-map");
      if (_container1 != null) {
        _container1._leaflet_id = null;
      }

      if (__markerOld1 != null) {
        __map1.removeLayer(__markerOld1);
      }
      if (__markerOld2 != null) {
        __map2.removeLayer(__markerOld2);
      }

      var _container2 = L.DomUtil.get("new-map");
      if (_container2 != null) {
        _container2._leaflet_id = null;
      }
      let _latLng1 = { lat: current_info.poiY, lng: current_info.poiX };
      let _latLng2 = { lat: new_info.poiY, lng: new_info.poiX };
      __map1 = L.map("current-map").setView([_latLng1.lat, _latLng1.lng], 17);
      __map2 = L.map("new-map").setView([_latLng2.lat, _latLng2.lng], 17);
      initMapForEtab(
        __map1,
        __map2,
        current_info.denominationF,
        new_info.denominationF,
        _latLng1,
        _latLng2,
        _iconAdminUrl
      );
    })
    .catch((error) => {
      console.log(error);
    });
}

function checkRestoMenu(resto, selector) {
  if (resto.brasserie == 1)
    selector.innerHTML += `<span class="cmz-category">brasserie</span>`;
  if (resto.creperie == 1)
    selector.innerHTML += `<span class="cmz-category">creperie</span>`;
  if (resto.fastFood == 1)
    selector.innerHTML += `<span class="cmz-category">fast_food</span>`;
  if (resto.pizzeria == 1)
    selector.innerHTML += `<span class="cmz-category">pizzeria</span>`;

  if (resto.boulangerie == 1)
    selector.innerHTML += `<span class="cmz-category">boulangerie</span>`;
  if (resto.cafe == 1)
    selector.innerHTML += `<span class="cmz-category">cafe</span>`;
  if (resto.bar == 1)
    selector.innerHTML += `<span class="cmz-category">bar</span>`;
  if (resto.cuisineMonde == 1)
    selector.innerHTML += `<span class="cmz-category">cuisine_monde</span>`;
  if (resto.salonThe == 1)
    selector.innerHTML += `<span class="cmz-category">salon_the</span>`;
}

function initMapForEtab(
  _map1,
  _map2,
  _nom1,
  _nom2,
  _latLng1,
  _latLng2,
  iconUrl
) {
  let _mapIcon = L.icon({
    iconUrl: iconUrl,
    iconSize: [30, 45],
  });

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(_map1);

  __markerOld1 = L.marker([_latLng1.lat, _latLng1.lng], { icon: _mapIcon })
    .addTo(_map1)
    .bindPopup(_nom1)
    .openPopup();

  _map1.setView([_latLng1.lat, _latLng1.lng], 17);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(_map2);

  __markerOld2 = L.marker([_latLng2.lat, _latLng2.lng], { icon: _mapIcon })
    .addTo(_map2)
    .bindPopup(_nom2 != "" ? _nom2 : _nom1)
    .openPopup();

  _map2.setView([_latLng2.lat, _latLng2.lng], 17);

  _map1.sync(_map2);

  _map2.sync(_map1);
}

function getListePhotoTovalidate(e, rubrique) {
  let linkActives = document.querySelectorAll(
    "#navbarSuperAdmin > ul > li > a"
  );
  linkActives.forEach((link) => {
    if (link.classList.contains("text-primary"))
      link.classList.remove("text-primary");
  });

  if (e) {
    e.target.classList.add("text-primary");
  } else {
    if (rubrique === "golf") {
      document.querySelector(".phtG_faniry_js").classList.add("text-primary");
    } else {
      document.querySelector(".phtR_faniry_js").classList.add("text-primary");
    }
  }
  if (document.querySelector("#list-tribu-g"))
    document.querySelector("#list-tribu-g").style.display = "none";
  // document.querySelector("#list-tribu-t").style.display = "none"
  if (document.querySelector("#list-demande-partenaire"))
    document.querySelector("#list-demande-partenaire").style.display = "none";

  if (document.querySelector("#list-infoAvalider"))
    document.querySelector("#list-infoAvalider").style.display = "block";

  document.querySelector("#titre-info").textContent =
    "Liste des demandes d'approbation des photos";

  let _table = `<table class="table" id="listeRestoAvaliderTable">
                    <thead>
                        <tr>
                            <th scope="col">Demandes reçues</th>
                        </tr>
                    </thead>
                    <tbody>
                    `;

  fetch("/" + rubrique + "/not-valid")
    .then((response) => response.json())
    .then((r) => {
      console.log(r);
      let _tr = "";
      if (r.length > 0) {
        for (const item of r) {
          // let item = item
          // let _adresse = item.numvoie + " " + item.typevoie + " " + item.nomvoie + " " + item.compvoie + " " + item.codpost + " " + item.commune
          // _adresse = _adresse.replace(/\s+/g, ' ').trim();
          _tr += `<tr style="text-align:center;vertical-align:middle;" class="tr_photo_${item.id_gallery}">
                            <td>
                                <div class="card mb-3">
                                    <div class="row g-0">
                                    <div class="col-md-4">
                                        <img src="/public${item.photo_path}" class="img-fluid rounded-start h-100" alt="..." style="max-height:200px;">
                                    </div>
                                    <div class="col-md-8">
                                        <div class="card-body">
                                        <p class="card-text"><a href="/user/profil/${item.user_id}" class="text-body-primary" style="color:blue !important;">${item.username}</a> a ajouté une photo dans un ${rubrique}</p>
                                        <h5 class="card-title">${item.denomination_f}</h5>
                                        <p class="card-text"><address style="color : #19a8d8;">Adresse : ${item.adresse}</address></p>
                                        <p class="card-text">Date de demande : <small class="text-body-secondary">${item.date_creation}</small></p>
                                        <button class="btn btn-success btn-sm m-2" onclick='validatePhoto(${item.id_rubrique}, ${item.id_gallery},\"${item.photo_path}\", \"${rubrique}\")'>
                                            Accepter
                                        </button> 
                                        <button class="btn btn-danger btn-sm m-2" onclick='rejectPhoto(${item.id_rubrique}, ${item.id_gallery},\"${item.photo_path}\", \"${rubrique}\")'>Refuser</button>
                                        </div>
                                    </div>
                                    </div>
                                </div>
                            </td>
                            
                        </tr>`;
        }
      } else {
        _tr = `<tr><td colspan="4">Aucune demande à valider</td></tr>`;
      }
      _table += _tr + "</tbody></table>";
      document.querySelector(".content_list_infoAvalider_js").innerHTML =
        _table;

      if (r.length > 0) {
        $("#listeRestoAvaliderTable").DataTable({
          language: {
            url: "https://cdn.datatables.net/plug-ins/1.13.4/i18n/fr-FR.json",
          },
        });
      }
    });
}
function rejectAdresseValidate(ev) {
  let restoId = ev.target.dataset.breakfast;
  let userId = ev.target.dataset.killer;
  let data = { restoId: restoId, userId: userId };
  let request = new Request("/user/reject/etab/to/update", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  fetch(request).then((r) => {
    if (r.status === 200 && r.ok) {
      $("#infoRestoToValidateModal").modal("hide");
      swal({
        title: "Merci!",
        text: "Information rejetée",
        icon: "success",
        button: "Ok",
      }).then((value) => {
        document.querySelector(".list-infoAvalider").click();
      });
    }
  });
}

function acceptAdresseValidate(ev) {
  let restoId = ev.target.dataset.breakfast;
  let userId = ev.target.dataset.killer;
  let data = { restoId: restoId, userId: userId };

  let _btnAccept = document.querySelector("#acceptAddTovalidate");
  _btnAccept.disabled = true;
  _btnAccept.textContent = "Validation";

  let request = new Request("/user/accept/etab/to/update", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  fetch(request).then((r) => {
    if (r.status === 200 && r.ok) {
      $("#infoRestoToValidateModal").modal("hide");
      _btnAccept.disabled = false;
      _btnAccept.textContent = "Valider";
      swal({
        title: "Merci!",
        text: "Information bien validée",
        icon: "success",
        button: "Ok",
      }).then((value) => {
        document.querySelector(".list-infoAvalider").click();
      });
    }
  });
}

function cancelAdresseValidate(ev) {
  let restoId = ev.target.dataset.breakfast;
  let userId = ev.target.dataset.killer;
  let data = { restoId: restoId, userId: userId };

  let _btnCancel = document.querySelector("#cancelAddTovalidate");
  _btnCancel.disabled = true;
  _btnCancel.textContent = "Annulation";

  let request = new Request("/user/cancel/etab/to/update", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  fetch(request).then((r) => {
    if (r.status === 200 && r.ok) {
      $("#infoRestoToValidateModal").modal("hide");
      _btnCancel.disabled = false;
      _btnCancel.textContent = "Annuler";
      swal({
        title: "Merci!",
        text: "Information bien annulée",
        icon: "success",
        button: "Ok",
      }).then((value) => {
        document.querySelector(".list-infoAvalider").click();
      });
    }
  });
}

function showValidationStory() {
  $("#validationStoryModal").modal("show");
  let validationStoryContainer = document.querySelector(
    ".validationStoryContainer_Nanta_js"
  );
  validationStoryContainer.innerHTML = `
      <div class="spinner-border spinner-border text-info mt-5" role="status">
        <span class="visually-hidden">Loading...</span>
    </div>
  `;
  let table = `<table class="table" id="validationStoryTable">
                  <thead>
                    <tr>
                      <th scope="col">Nom de l'établissement</th>
                      <th scope="col">Adresse</th>
                      <th scope="col">Demandeur</th>
                      <th scope="col">Validateur</th>
                      <th scope="col">Statuts</th>
                      <th scope="col">Date</th>
                    </tr>
                  </thead>
                <tbody>`;

  fetch("/user/get/validation/story")
    .then((response) => response.json())
    .then((data) => {
      let results = data.results;
      let tr = "";
      if (results.length > 0) {
        for (const item of results) {
          let _statusValidation = "";
          let _bgColor = "";
          if (item.status == 1) {
            _statusValidation = "Validé";
            _bgColor = "green";
          } else if (item.status == 0) {
            _statusValidation = "Refusé";
            _bgColor = "grey";
          } else {
            _statusValidation = "Annulé";
            _bgColor = "blue";
          }
          tr += `<tr style="text-align:center;vertical-align:middle;">
              <td>${item.resto.name}</td>
              <td>${item.resto.adresse}</td>
              <td><a href="/user/profil/${
                item.user_modify.id
              }" style="color:blue;">${item.user_modify.name}</a></td>
              <td><a href="/user/profil/${
                item.user_validator.id
              }" style="color:blue;">${item.user_validator.name}</a></td>
              <td><span style="background-color:${_bgColor}; border-radius:5px; color:white; padding:5px">${_statusValidation}</span></td>
              <td>${settingDateToStringMonthDayAndYear(item.date)}</td>
            </tr>`;
        }
        table += tr;
        table += `</tbody>
          </table>`;
        $("#validationStoryTable").DataTable({
          language: {
            url: "https://cdn.datatables.net/plug-ins/1.13.4/i18n/fr-FR.json",
          },
        });
      } else {
        tr += `<tr style="text-align:center;vertical-align:middle;"><td colspan="6">Aucun historique</td></tr>`;
        table += tr;
        table += `</tbody>
          </table>`;
      }

      validationStoryContainer.innerHTML = table;
    });
}
//---------------faniry blocks -----------------
/**
 * @author faniry
 */

function getListPostulant(e){

  let linkActives = document.querySelectorAll(
    "#navbarSuperAdmin > ul > li > a"
  );
  linkActives.forEach((link) => {
    if (link.classList.contains("text-primary"))
      link.classList.remove("text-primary");
  });
  if (e) {
    e.target.classList.add("text-primary");
  } else {
    document.querySelector(".addr_faniry_js").classList.add("text-primary");
  }

  if (document.querySelector("#list-tribu-g"))
    document.querySelector("#list-tribu-g").style.display = "none";
  if (document.querySelector("#list-demande-partenaire"))
    document.querySelector("#list-demande-partenaire").style.display = "none";

  if (document.querySelector("#list-infoAvalider"))
    document.querySelector("#list-infoAvalider").style.display = "none";

  if (document.querySelector("#list-abonnement-cmz"))
    document.querySelector("#list-abonnement-cmz").style.display = "none";

  if(document.getElementById("list-postulant"))
      document.getElementById("list-postulant").style.display = "block";
  document.querySelector(".content_list_postulan_faniry_js"
  ).innerHTML = `<div class="spinner-border spin_faniry text-info" role="status">
                  <span class="visually-hidden">Loading...</span>
              </div>`;
  const request =new Request("/user/postulant/v2",{
        method: "GET",
  });
  fetch(request).then((res)=>{
      if (res.status === 200 && res.ok) {
        document.querySelector(".spin_faniry").remove(); 
        res.json().then(json=>{
            renderPostulantList(json);
        });
         
      }
  })
}

function renderPostulantList(postulants){
  let container=document.querySelector(".content_list_postulan_faniry_js"
  );
  if(!document.querySelector("#postulant_modal"))
      createModalForPostulantAdmin(container)
  initCKEditor(
    "exampleFormControlTextareaPostulant",
    emailRelanceContent
  );
  const headTitles = ["Pseudo", "Email", "Relance"];
  const postulantTable = document.createElement("table");

  postulantTable.setAttribute("class", "cell-border hover ");
  postulantTable.id = "table_postulants";

  const postulantTableHead = document.createElement("thead");
  const postulantTableBody = document.createElement("tbody");
  const postulantTableHaedRow = document.createElement("tr");

  let postulantTableBodyRow = null;
  let th = null;
 
  let tdPseudo = null;

  let tdEmail = null;
  let tdRelance = null;
  let btnRelance = null;
  headTitles.forEach((headTitle) => {
    th = document.createElement("th");
    th.innerText = headTitle;
    postulantTableHaedRow.appendChild(th);
  });
  postulantTableHead.appendChild(postulantTableHaedRow);

  postulants.forEach((postulant) => {
    postulantTableBodyRow = document.createElement("tr");

   
    tdPseudo = document.createElement("td");
    tdPseudo.setAttribute("class","pso_faniry")
    tdEmail = document.createElement("td");
    tdEmail.setAttribute("class","ml_faniry");
    tdRelance = document.createElement("td");
    tdPseudo.innerText = postulant.pseudo;
    tdEmail.innerText = postulant.email;
    btnRelance = creaTeBtnRelanceAdmin(postulant);
    tdRelance.appendChild(btnRelance);
    postulantTableBodyRow.appendChild(tdPseudo);
    postulantTableBodyRow.appendChild(tdEmail);
    postulantTableBodyRow.appendChild(tdRelance);

    postulantTableBody.appendChild(postulantTableBodyRow);

    relanceOneIvitationAdmin(btnRelance, postulant);
  });

  postulantTable.appendChild(postulantTableHead);
  postulantTable.appendChild(postulantTableBody);

  container.appendChild(postulantTable);
  // container.appendChild(createBtnRelanceAll());

  $("#table_postulants").DataTable({
    autoWidth: false,
    language: {
      url: "//cdn.datatables.net/plug-ins/1.13.4/i18n/fr-FR.json",
    },
  });

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

/***
 * @author faniry <faniryandriamihaingo@gmail.com> doesn't disturb me when I'm off
 * créé le boutton de relance
 * @returns HtMLElement
 */
function creaTeBtnRelanceAdmin(data) {
  const btn = document.createElement("button");
  btn.setAttribute("class", "btn btn-primary btn_relance_faniry_js");
  btn.id = `relance_${data.userId}_faniry_js`;
  btn.dataset.rank = cryptageJs(data.userId);
  btn.dataset.bsToggle = "modal";
  btn.dataset.bsTarget = "#postulant_modal";
  btn.setAttribute("type", "button");
  btn.innerHTML = "Relancez";

  return btn;
}

/**
 * @author faniry <faniryandriamihaingo@gmail.com> doesn't disturb me when I'm off
 * fait la relance
 */
function relanceOneIvitationAdmin(element, data) {
	
  element.onclick = (e) => {
      
    // const btnRelanceAll = document.querySelector(".btn_relance_all_faniry_js");
    // if (btnRelanceAll.classList.contains("btn-primary")) {
    //   //TODO on utilise les check box qui relance
    //     relanceManyInvitation(tribuName) 
    // } else {
      //TODO on relance la personne relative au boutton relance
        console.log(data)
        const idCrypted=cryptageJs(data.id);
        const cryiptedEmail=cryptageJs(data.email)
        document.getElementById("dest_area_pst").value=data.email
      	const link1 = window.origin + `/verification_email?id=${idCrypted}&verif=a`;
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
          sendEmailForPostulant(objet,email,fileStoreAdmin,idCrypted, ev.target)

        }
        //
    //}
  };
}

/**
 * @faniry
 * fait le rendu de l'éditeur de l'email pour la relance postulant
 * @param {*} container 
 */
function createModalForPostulantAdmin() {
  container = document.querySelector(".container-fluid")
  const divModal = document.createElement("div");
  divModal.setAttribute("class", "modal fade");
  divModal.setAttribute("aria-labelledby", "postulantModalLabel");
  divModal.setAttribute("aria-hidden", "true");
  divModal.id = "postulant_modal";
  divModal.style.zIndex="1000";
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
  // document.querySelector(".btn-close").onclick=()=>{
  //    document.querySelector("#postulant_modal").remove();
  // }
 
}

/**
 * @author faniry
 * edit le contenu de l'email de relance  à envoyer
 * @returns  String html
 */
function emailRelanceContent() {
 
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
        fileStoreAdmin.push({
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
        fileStoreAdmin.push({
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
  fileStoreAdmin = fileStoreAdmin.filter((item) => parseInt(item.id) != parseInt(id));
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
//--------------end block faniry-----
