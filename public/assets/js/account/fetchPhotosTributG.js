if( document.querySelector("#fetch_photo_tribug_js_jheo")){
    const btn_photos = document.querySelector("#fetch_photo_tribug_js_jheo");

    btn_photos.addEventListener("click",(e) => {
        e.preventDefault();
        if(!btn_photos.classList.contains("active")){
            btn_photos.classList.add("active")
            btn_photos.classList.add("text-white")
            btn_photos.classList.remove("text-primary")
            document.querySelector("#showCreatePub").style.display="none";
            
        }

        document.querySelector(".content_bloc_js_jheo div").innerHTML = `<div class="mt-3 d-flex justify-content-center">
            <div class="spinner-border" role="status">
            <span class="sr-only">Loading...</span>
            </div>
        </div>`;

        if(document.querySelector("#fetch_actialite_tribug_js_jheo").classList.contains("active")){
            document.querySelector("#fetch_actialite_tribug_js_jheo").classList.remove("active")
            document.querySelector("#fetch_actialite_tribug_js_jheo").classList.remove("text-white")
            document.querySelector("#fetch_actialite_tribug_js_jheo").classList.add("text-primary")
        }
        if(document.querySelector("#fetch_member_tribug_js_jheo").classList.contains("active")){
            document.querySelector("#fetch_member_tribug_js_jheo").classList.remove("active")
            document.querySelector("#fetch_member_tribug_js_jheo").classList.remove("text-white")
            document.querySelector("#fetch_member_tribug_js_jheo").classList.add("text-primary")
        }
        fetch("/tributG/photos")
            .then(response => {
                if (!response.ok) {
                    throw new Error("Not 404 response", {cause: response});
                } else {
                    return response.text()
                }
            })
            .catch(error => {
                console.error(error)
            })
            .then( response => {
                if( document.querySelector(".content_bloc_js_jheo")){
                    document.querySelector(".content_bloc_js_jheo").removeChild(
                        document.querySelector(".content_bloc_js_jheo div")
                    );

                    document.querySelector(".content_bloc_js_jheo").innerHTML = response;

                    setGallerie(document.querySelectorAll("#gallery > img"))
                }
            }).catch(error => {
                console.log(error)
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