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
var __markerOld1 = null,
  __markerOld2 = null;
var __map1, __map2;
window.addEventListener("load", () => {
  document.querySelector(".content_global_super_admin_js_jheo").innerHTML = `
        <div class="content_chargement content_chargement_js_jheo">
            <div class="spinner-border spinner-border text-info" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
    `;
  fetch("/user/dashboard/tribug_json")
    .then((response) => response.json())
    .then((result) => {
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
});

function dataFormat(dataToFormat) {
  const data = [];
  t.forEach((item, index) => {
    const tribug =
      "tribug_" +
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
      "tribug_" +
      item.d +
      "_" +
      item.i.replace(/( )/g, "_") +
      "_" +
      item.co.replace(" ", "_");
    const table_exist = dataToFormat.find((item) =>
      name_format.includes(item.table_name)
    );
    const table_tribug = tribug.length > 30 ? tribug.substr(0, 30) : tribug;
    data.push([
      index + 1,
      item.d,
      item.co,
      item.co + " " + item.i,
      name_format,
      table_exist ? table_exist.count : 0,
      "<a class='btn btn-primary' href=/user/dashboard-membre?table=" +
        table_tribug +
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
  e.target.classList.add("text-primary");
  document.querySelector("#list-tribu-g").style.display = "none";
  // document.querySelector("#list-tribu-t").style.display = "none"
  document.querySelector("#list-demande-partenaire").style.display = "none";
  document.querySelector("#list-infoAvalider").style.display = "block";
  document.querySelector(
    ".content_list_infoAvalider_js"
  ).innerHTML = `<div class="spinner-border spinner-border text-info" role="status">
    <span class="visually-hidden">Loading...</span>
</div>`;
  let _table = `<table class="table" id="listeRestoAvaliderTable">
                    <thead>
                        <tr>
                            <th scope="col">Nouveau Nom</th>
                            <th scope="col">Nouveau Adresse</th>
                            <th scope="col">Nouveau Téléphone</th>
                            <th scope="col">Demandeur</th>
                            <th scope="col">Status</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                    `;

  fetch("/user/liste/information/to/update")
    .then((response) => response.json())
    .then((r) => {
      console.log(r);
      let _tr = "";
      if (r.length > 0) {
        for (const items of r) {
          let item = items.info;
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
                            <td>${denomination_f}</td>
                            <td>${adresse}</td>
                            <td>${tel}</td>
                            <td><a href="/user/profil/${item.userId}" style="color:blue;">${items.userFullName}</a></td>
                            <td><span style="background-color:${_bgColor}; border-radius:5px; color:white; padding:5px">${_status}</span></td>
                            <td><button class="btn btn-info" onclick="getRestoInfoToValidate(${item.restoId}, ${item.userId})">Voir</button></td>
                        </tr>`;
        }
      } else {
        _tr = `<tr><td colspan="4">Aucune information à valider</td></tr>`;
      }
      _table += _tr + "</tbody></table>";
      document.querySelector(".content_list_infoAvalider_js").innerHTML =
        _table;
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

        contentCurrentInfo.querySelector("#x").textContent = "poi x: "+ current_info.poiX;
        contentCurrentInfo.querySelector("#y").textContent = "poi y: "+ current_info.poiY;

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
          "nom: " + (new_info.denominationF!="" ? new_info.denominationF :"Non renseigné");
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
    .bindPopup(_nom2 !="" ? _nom2: _nom1)
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
  e.target.classList.add("text-primary");
  document.querySelector("#list-tribu-g").style.display = "none";
  // document.querySelector("#list-tribu-t").style.display = "none"
  document.querySelector("#list-demande-partenaire").style.display = "none";
  document.querySelector("#list-infoAvalider").style.display = "block";

  document.querySelector("#titre-info").textContent =
    "Liste des demandes d'approbation des photos";

  let _table = `<table class="table" id="listeRestoAvaliderTable">
                    <thead>
                        <tr>
                            <th scope="col">Demandes reçus</th>
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
                                        <p class="card-text"><a href="/user/profil/${item.user_id}" class="text-body-primary" style="color:blue !important;">${item.username}</a> a ajouté un photo dans un ${rubrique}</p>
                                        <h5 class="card-title">${item.denomination_f}</h5>
                                        <p class="card-text"><address style="color : #19a8d8;">Adresse : ${item.adresse}</address></p>
                                        <p class="card-text">Date de demande : <small class="text-body-secondary">${item.date_creation}</small></p>
                                        <button class="btn btn-success btn-sm m-2" onclick='validatePhoto(${item.id_rubrique}, ${item.id_gallery},\"${item.photo_path}\", \"${rubrique}\")'>Accepter</button> <button class="btn btn-danger btn-sm m-2" onclick='rejectPhoto(${item.id_rubrique}, ${item.id_gallery},\"${item.photo_path}\", \"${rubrique}\")'>Réfuser</button>
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

      $("#listeRestoAvaliderTable").DataTable({
        language: {
          url: "https://cdn.datatables.net/plug-ins/1.13.4/i18n/fr-FR.json",
        },
      });
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
