function setActiveTabAffiliate(elem, param) {
    document.querySelectorAll("#smallNavAffiliate > li > a").forEach((it) => {
      it.classList.remove("active");
    });
  
    if (!elem.classList.contains("active")) {
      elem.classList.add("active");
    }
    switch (param) {
      case "parrain": {
        document.querySelector("#blockListParrains").style.display = "block"
        document.querySelector("#blockListFilleuls").style.display = "none"
        getAllParrains()
        break;
      }
      case "filleul": {
        document.querySelector("#blockListFilleuls").style.display = "block"
        document.querySelector("#blockListParrains").style.display = "none"
        getAllFilleuils()
        break;
      }
    }
}

function getAllParrains(){
  let blockListParrains = document.querySelector("#blockListParrains")
  let tbody = blockListParrains.querySelector("table > tbody")
  tbody.innerHTML = `<td colspan="4"><div class="d-flex justify-content-center">
                          <div class="spinner-border" role="status">
                          <span class="visually-hidden">Loading...</span>
                          </div>
                        </div></td>`;
  fetch("/user/get/all/parrains")
    .then((response) => response.json())
    .then((response) => {
      if (response.isConnected == true) {
        let parrains = response.parrains
        if(parrains.length > 0){
          let tr = ""
          for (const item of parrains) { 
            tr += `<tr valign="middle">
                <td class=""><a href="/user/profil/${item.user_id}" class="badge text-bg-primary">${item.fullName}</a></td>
                <td>${item.email}</td>
                <td><span class="badge text-bg-success"><a href="${item.isTribuG ? '/user/account' : '/user/tribu/my-tribu-t'}">${item.isTribuG ?'Tribu G ' : 'Tribu T '}${item.tribuName}</a></span></td>
                <td class="" style="font-size:small;">${item.dateSauvegarde}</td>
            </tr>`
          }
          tbody.innerHTML = tr
        }else{
          tbody.innerHTML = `<tr class="text-center">
                            <td colspan="4">Vous n'avez aucun parrain</td>
                        </tr>`
        }
        // $("#table-tribuG-member > table").DataTable({
        //   language: {
        //     url: "//cdn.datatables.net/plug-ins/1.13.4/i18n/fr-FR.json",
        //   },
        // });
      } else {
        swal({
          title: "Non connecté!",
          text: "Veuillez vous connecter !",
          icon: "error",
          button: "OK",
        });
      }
    })
}

function getAllFilleuils(){
  let blockListFilleuls = document.querySelector("#blockListFilleuls")
  let tbody = blockListFilleuls.querySelector("table > tbody")
  tbody.innerHTML = `<td colspan="4"><div class="d-flex justify-content-center">
                          <div class="spinner-border" role="status">
                          <span class="visually-hidden">Loading...</span>
                          </div>
                        </div></td>`;
  fetch("/user/get/all/filleuils")
    .then((response) => response.json())
    .then((response) => {
      if (response.isConnected == true) {
        let filleuils = response.filleuils
        if(filleuils.length > 0){
          let tr = ""
          for (const item of filleuils) { 
            tr += `<tr valign="middle">
                <td class=""><a href="/user/profil/${item.user_id}" class="badge text-bg-primary">${item.fullName}</a></td>
                <td>${item.email}</td>
                <td><span class="badge text-bg-success"><a href="${item.isTribuG ? '/user/account' : '/user/tribu/my-tribu-t'}">${item.isTribuG ?'Tribu G ' : 'Tribu T '}${item.tribuName}</a></span></td>
                <td class="" style="font-size:small;">${item.dateSauvegarde}</td>
            </tr>`
          }
          tbody.innerHTML = tr
        }else{
          tbody.innerHTML = `<tr class="text-center">
                            <td colspan="4">Vous n'avez aucun filleul</td>
                        </tr>`
        }
      } else {
        swal({
          title: "Non connecté!",
          text: "Veuillez vous connecter !",
          icon: "error",
          button: "OK",
        });
      }
    })
}