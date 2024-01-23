if( document.querySelector("#fetch_photo_tribug_jheo_js")){
    const btn_photos = document.querySelector("#fetch_photo_tribug_jheo_js");

    btn_photos.addEventListener("click",(e) => {
        e.preventDefault();
        if(!btn_photos.classList.contains("active")){
            btn_photos.classList.add("active")
            btn_photos.classList.add("text-white")
            btn_photos.classList.remove("text-primary")
        }

        document.querySelector(".content_bloc_jheo_js").innerHTML = `<div class="mt-3 d-flex justify-content-center">
            <div class="spinner-border" role="status">
            <span class="sr-only">Loading...</span>
            </div>
        </div>`;

        if(document.querySelector("#fetch_actialite_tribug_jheo_js").classList.contains("active")){
            document.querySelector("#fetch_actialite_tribug_jheo_js").classList.remove("active")
            document.querySelector("#fetch_actialite_tribug_jheo_js").classList.remove("text-white")
            document.querySelector("#fetch_actialite_tribug_jheo_js").classList.add("text-primary")
        }
        if(document.querySelector("#fetch_member_tribug_jheo_js").classList.contains("active")){
            document.querySelector("#fetch_member_tribug_jheo_js").classList.remove("active")
            document.querySelector("#fetch_member_tribug_jheo_js").classList.remove("text-white")
            document.querySelector("#fetch_member_tribug_jheo_js").classList.add("text-primary")
        }
        if(document.querySelector("#fetch_resto_tribug_jheo_js").classList.contains("active")){
            document.querySelector("#fetch_resto_tribug_jheo_js").classList.remove("active")
            document.querySelector("#fetch_resto_tribug_jheo_js").classList.remove("text-white")
            document.querySelector("#fetch_resto_tribug_jheo_js").classList.add("text-primary")
        }

        if(document.querySelector("#fetch_golf_tribug_jheo_js").classList.contains("active")){
            document.querySelector("#fetch_golf_tribug_jheo_js").classList.remove("active")
            document.querySelector("#fetch_golf_tribug_jheo_js").classList.remove("text-white")
            document.querySelector("#fetch_golf_tribug_jheo_js").classList.add("text-primary")
        }

        document.querySelector(".content_bloc_jheo_js").innerHTML = `
            <div class="spinner-grow text-info d-block mx-auto" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        `;

        fetch("/tributG/photos").then(response=>{
            if(response.ok && response.status==200){
                response.text().then(text=>{
                    document.querySelector(".textIndicationNantaJs").textContent = "Photos"
                    if( document.querySelector(".content_bloc_jheo_js")){
                        document.querySelector(".content_bloc_jheo_js").innerHTML = text;
                        // const parser = new DOMParser();
                        // const htmlDocument = parser.parseFromString(text, "text/html");
                        // htmlDocument.querySelector(".image_item_gallery")
                        setGallerieImageV2();
                    }
                })
            }else{
                throw new Error("Not 404 response", {cause: response});
            }
        })
       
    })
}

/**
* Upload photos
*/
var loadFile = (event) => {

    let new_photo = document.createElement("img")
    new_photo.setAttribute("data-bs-toggle","modal")
    new_photo.setAttribute("data-bs-target","#modal_show_photo")
    new_photo.setAttribute("onclick","setPhotoTribu(this)")
    new_photo.src = URL.createObjectURL(event.target.files[0]);
    var div_photo = document.querySelector('#gallery');

    let first_photo = document.querySelector("#gallery > img:nth-child(1)")

    div_photo.insertBefore(new_photo, first_photo);

    const fileReader = new FileReader();
    fileReader.onload = () => {
        const srcData = fileReader.result;

        let data = {
                image : srcData,
            }

        fetch(new Request("/tribu_g/add_photo", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })).then(x => x.json()).then(response => {
            document.querySelector("#success_upload").style ="display:block;"
            setTimeout(function(){
                 document.querySelector("#success_upload").style ="display:none;"
            }, 5000);
            console.log(response)
            }
            
        ).catch(error=>{
            console.log(error)
        });
    };
    fileReader.readAsDataURL(event.target.files[0]);


}
/**
 * @author Tommy
 * gère la navigation entre les onglets de la gallerie photos dans les tribu-G.
 * onglet pub tribu-g
 */
function galPubG() {
  if (
    document
      .querySelector("#gal-publication-g")
      .getAttribute("data-status-nav") ==
    document
      .querySelector(".content-publication-tomm-js")
      .getAttribute("data-status")
  ) {
    document
      .querySelector(".content-publication-tomm-js")
      .classList.remove("d-none");
    document.querySelector(".content-agenda-tomm-js").classList.add("d-none");
document.querySelector(".content-album-tomm-js").classList.add("d-none");
    document.querySelector("#gal-publication-g").style = "color: #0101DF";
    document.querySelector("#gal-agenda-g").removeAttribute("style");
document.querySelector("#gal-album-g").removeAttribute("style");
  }
}
/**
 * @author Tommy
 * gère la navigation entre les onglets de la gallerie photos dans les tribu-G.
 * onglet agenda
 */
function galAgendaG() {
  if (
    document.querySelector("#gal-agenda-g").getAttribute("data-status-nav") ==
    document
      .querySelector(".content-agenda-tomm-js")
      .getAttribute("data-status")
  ) {
    document
      .querySelector(".content-agenda-tomm-js")
      .classList.remove("d-none");
    document
      .querySelector(".content-publication-tomm-js")
      .classList.add("d-none");
document
      .querySelector(".content-album-tomm-js")
      .classList.add("d-none");
    document.querySelector("#gal-agenda-g").style = "color: #0101DF";
    document.querySelector("#gal-publication-g").removeAttribute("style");
    document.querySelector("#gal-album-g").removeAttribute("style");
  }
}

/**
 * @author Tommy
 * gère la navigation entre les onglets de la gallerie photos dans les tribu-G.
 * onglet agenda
 */
function galAlbumG() {
  if (
    document.querySelector("#gal-album-g").getAttribute("data-status-nav") ==
    document
        .querySelector(".content-album-tomm-js")
        .getAttribute("data-status")
  ) {
    document
        .querySelector(".content-album-tomm-js")
        .classList.remove("d-none");
    document
        .querySelector(".content-publication-tomm-js")
        .classList.add("d-none");
    document.querySelector(".content-agenda-tomm-js").classList.add("d-none");
    document.querySelector("#gal-album-g").style = "color: #0101DF";
    document.querySelector("#gal-publication-g").removeAttribute("style");
    document.querySelector("#gal-agenda-g").removeAttribute("style");
  }

  let status = document.querySelector(".status-tomm-js").getAttribute("data-status");
  if (status != "FONDATEUR") {
    document.querySelector(".create-album").style.display = "none";
  }
  getAlbumTribuG()
}

/**
 * @author Tomm
 * fetch touts les photos dans tribuT
 * @param dans
 */
function fetchAllGalereGInAlbum(idAlbum) {
  if (document.querySelector(".content-gal-all")) {
    document
      .querySelectorAll(".content-gal-all")
      .forEach((item) => item.remove());
  }
  const requete = new Request(
    "/tributG/photos/album",
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
          if (photo.isAlbum != 1) {
            if (img_src != "" && img_src.indexOf("/tribu_g/") > -1) { 
              li_img += `
                    <div class="col-lg-4 col-md-12 mb-4 mb-lg-0 content-gal-all">
                      <input type="checkbox" class="select-album value-checked-album-g-tomm-js" data-id="${photo.id}" value="${img_src}"/>
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
      document.querySelector(".all-galeri-to-album-tomm-js").innerHTML +=
        li_img;
      clickCopyePathAlbumTribuG(idAlbum)
    });
}

/**
 * @author Tomm
 * creater une album dan le tableao album du tribu g
 * @param dans le photo.html.twig sur le modale createAlbumTribuG
 */
function createAlbumTribuG() {
  const valueNameAlbum = document.querySelector(
    ".value-name-album-g-tomm-js"
  ).value;
if (valueNameAlbum !== "") {
  const request = new Request(`/user/tribu-g/photos/album`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name_album: valueNameAlbum }),
  });
  fetch(request).then((res) => res.json()).then((resp) => {
    if (resp == true) {
      swal({
        title: "Créer ",
        text: "Votre album a été bien créé.",
        icon: "success",
        button: "OK",
      });
    } else {
      swal({
        title: "déjà existé",
        text: "Votre album est déjà existé.",
        icon: "error",
        button: "OK",
      });
    }
     
  });
}else {
		swal({
			title: "Vide",
			text: "Veuillez inscrire le nom de votre album.",
			icon: "error",
			button: "OK",
		});
	}
  $("#createAlbumTribuG").modal('hide')
  // document.querySelector(".btn-close-creer-album-tomm-js").click();
  document.querySelector("#gal-album-g").click();
}

function docAlbumGClick(idAlbum, nameAlbum) {
let status = document.querySelector(".status-tomm-js").getAttribute("data-status");
  if (status != "FONDATEUR") {
    document.querySelector(".modif-album").style.display = "none";
  }
  document.querySelector(".album-tomm-js").classList.toggle("d-none");
    let contentAmbum = document.querySelector(".content-album-tomm-js");
    contentAmbum.innerHTML += `
      <div class="row photo-imp-t-tomm-js photo-album-tomm-js" data-name-album="${nameAlbum}" data-id-album="${idAlbum}">
        <div class="row">
          <p class="col-1"><i class="fa-solid fa-arrow-left" onclick="closeAlbumG()"></i></p>
          <h3 class="col-6">${nameAlbum}</h3>
          <button type="button" class="btn btn-light create-album-img col-4" data-bs-toggle="modal" data-bs-target="#selectAddAlbumG" onclick="fetchAllGalereGInAlbum(${idAlbum})">
            Ajouter des photos <i class="fa-solid fa-plus"></i>
          </button>
          <p class="col-1 modif-album d-none" data-bs-toggle="modal" data-bs-target="#selectModifAlbumG" onclick="photoInAlbumModif(${idAlbum}, '${nameAlbum.replace("'","")}')"><i class="fa-solid fa-gear"></i></p>
        </div>
        <div class="row insert-album-photo-g-tomm-js mt-3"> </div> 
      </div>
    `;
  getCopyePathAlbumGTribuT(idAlbum);
}

/**
 * @author Tomm
 * creater une album dan le tableao album du tribu g
 * @param dans function  galAlbumG
 */
function getAlbumTribuG() {
  
  if (document.querySelector(".insert-album-g-tomm-js")) {
    document
      .querySelectorAll(".doc-album-g-tomm-js")
      .forEach((item) => item.remove());
  }
  const requete = new Request(`/user/tribu-g/get/album `, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  fetch(requete)
    .then((response) => response.json())
    .then((data) => {
      let contentAlbum = document.querySelector(".insert-album-g-tomm-js");
      for (let album of data) {
        contentAlbum.innerHTML += `
          <div class="doc-album col-4 mb-2 album-${album.id}-tomm-js doc-album-g-tomm-js doc-album-g-${album.id}-tomm-js" onclick="docAlbumGClick(${album.id}, '${album.name_album.replace("'", "").replace('"',"")}')">
            <i class="fa-regular fa-folder-open"></i>
            <p>${album.name_album}</p>
          </div>
          `;
      }
    });
}

function closeAlbumG() {
  document.querySelector(".album-tomm-js").classList.toggle("d-none");
  document.querySelector(".photo-album-tomm-js").remove();
}
  
function getCopyePathAlbumGTribuT(idAlbum) {
  const requete = new Request(
    `/user/tribu-g/get/copyer/album/`,
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
      let contentPhotoAlbum = document.querySelector(".insert-album-photo-g-tomm-js");
      for (let photoAlbum of data) {
        let imageAlbum = "";
        if (photoAlbum.album_id == idAlbum) {
          imageAlbum = `

            <div class="col-lg-4 col-md-12 mb-4 mb-lg-0 imp_img " data-floor=${photoAlbum.album_id} onclick="openGalleriesPhotoTribuT(this)">
                <img src="${photoAlbum.path}" class="w-100 shadow-1-strong mb-4 imp_img" data-floor=${photoAlbum.album_id} alt="Album"/>
            </div>
          `;
        }
        contentPhotoAlbum.innerHTML += imageAlbum;
      }
    });
}




function clickCopyePathAlbumTribuG(idAlbum) {
    if (document.querySelector(".copye-album-tribu-g-tomm-js")) {
      document.querySelectorAll(".select-album").forEach((event) => {
        event.addEventListener("change", (e) => { 
          if (event.checked) {
            
            document.querySelector(".copye-album-tribu-g-tomm-js").classList.add("btn-primary")
            document.querySelector(".copye-album-tribu-g-tomm-js").classList.remove("btn-secondary")
            document.querySelector(".copye-album-tribu-g-tomm-js").removeAttribute("disabled")
            

          } else {
            let val = true
            document.querySelectorAll(".select-album").forEach((event) => { 
              if (event.checked) { 
                val = false
              }   
            })
            if (val) {
              document.querySelector(".copye-album-tribu-g-tomm-js").setAttribute("disabled","")
            }
          }
        })
        
      })
      document.querySelector(".copye-album-tribu-g-tomm-js").addEventListener("click", () => {
        document.querySelector(".btn-close-tomm-js").click();
        document.querySelector(".album-tomm-js").classList.toggle("d-none");
        document.querySelector(".photo-album-tomm-js").remove();
        copyePathAlbumTribuG(idAlbum);
        document.querySelector(`.doc-album-g-${idAlbum}-tomm-js`).click()  
      });
    }
}

/**
 * @author Tomm
 * ajouter le photo dans l'album
 * @param dans le tribuT.html.twig sur le modale selectAddAlbum
 */
function copyePathAlbumTribuG(idAlbum) {
  const valuePathAlbum = document.querySelectorAll(
    ".value-checked-album-g-tomm-js"
  );
  let allValueAlbum = [];
  let allIdPub = [];
  for (let i = 0; i < valuePathAlbum.length; i++) {
    if (valuePathAlbum[i].checked) {
      let valueAlbum = {
        path: valuePathAlbum[i].value,
        idPub: valuePathAlbum[i].dataset.id
      }
      allValueAlbum.push(valueAlbum);
      let idPub = valuePathAlbum[i].dataset.id;
      allIdPub.push(idPub);
    }
  }
  
  const request = new Request(
    `/user/tribu-g/photos/copyer/album`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        valueAlbum: allValueAlbum,
        albumId: idAlbum,
        idPub: allIdPub,
      }),
    }
  );
  fetch(request);
}


function photoInAlbumModif(idAlbum, album) {
  if (document.querySelector(".content-gal-all")) {
    document
      .querySelectorAll(".content-gal-all")
      .forEach((item) => item.remove());
  }
  const requete = new Request(
    `/user/tribu-g/get/copyer/album`,
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
      let contentPhotoAlbum = document.querySelector(".all-galeri-modif-album-tomm-js");
      for (let photoAlbum of data) {
        let imageAlbum = "";
        if (photoAlbum.album_id == idAlbum) {
          imageAlbum = `

            <div class="col-lg-4 col-md-12 mb-4 mb-lg-0 content-gal-all" data-floor=${photoAlbum.album_id}>
              <input type="checkbox" class="select-album delete-checked-album-g-tomm-js" data-idalbum="${photoAlbum.id}" data-idpub="${photoAlbum.id_pub}" value="${photoAlbum.path}"/>
              <img src="${photoAlbum.path}" class="w-100 shadow-1-strong mb-4 imp_img" data-floor=${photoAlbum.album_id} alt="Album"/>
            </div>
          `;
        }
        contentPhotoAlbum.innerHTML += imageAlbum;
        clickDeletePathAlbumTribuG(idAlbum)
      }
    });
}

/**
 * @author Tomm
 * ajouter le photo dans l'album
 * @param dans le tribuT.html.twig sur le modale selectAddAlbum
 */
function deletePathAlbumTribuG() {
  const valuePathAlbum = document.querySelectorAll(".delete-checked-album-g-tomm-js");
  let allIdAlbum = [];
  let allIdPub = [];
  for (let i = 0; i < valuePathAlbum.length; i++) {
    if (valuePathAlbum[i].checked) {
      let idPub = valuePathAlbum[i].dataset.idpub;
      allIdPub.push(idPub);
      let idAlbum = valuePathAlbum[i].dataset.idalbum;
      allIdAlbum.push(idAlbum);
    }
  }
  const request = new Request(
    `/user/tribu-g/delete/path/album`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        albumId: allIdAlbum,
        allIdPub: allIdPub
      }),
    }
  );
  fetch(request).then(() => {
    swal({
      title: "Suprimer ",
      text: "Votre photo a ete bien suprimer",
      icon: "error",
      button: "OK",
    });
  });
  document.querySelector('#fetch_photo_tribug_jheo_js').click()

}

function clickDeletePathAlbumTribuG(idAlbum) {
    if (document.querySelector(".delete-album-tribu-g-tomm-js")) {
      document.querySelectorAll(".select-album").forEach((event) => {
        event.addEventListener("change", (e) => { 
          if (event.checked) {
            document.querySelector(".delete-album-tribu-g-tomm-js").addEventListener("click", () => {
              document.querySelector(".btn-close-delet-tomm-js").click();
              document.querySelector(".album-tomm-js").classList.toggle("d-none");
              document.querySelector(".photo-album-tomm-js").remove();
              deletePathAlbumTribuG()
              document.querySelector(".doc-album-g-tomm-js").click()  
            });
            document.querySelector(".delete-album-tribu-g-tomm-js").classList.add("btn-primary")
            document.querySelector(".delete-album-tribu-g-tomm-js").classList.remove("btn-secondary")
            document.querySelector(".delete-album-tribu-g-tomm-js").removeAttribute("disabled")
            

          } else {
            let val = true
            document.querySelectorAll(".select-album").forEach((event) => { 
              if (event.checked) { 
                val = false
              }   
            })
            if (val) {
              document.querySelector(".delete-album-tribu-g-tomm-js").setAttribute("disabled","")
            }
          }
        })
        
      })
      
    }
}
