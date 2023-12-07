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
    document.querySelector("#gal-publication-g").style = "color: #0101DF";
    document.querySelector("#gal-agenda-g").removeAttribute("style");
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
    document.querySelector("#gal-agenda-g").style = "color: #0101DF";
    document.querySelector("#gal-publication-g").removeAttribute("style");
  }
}