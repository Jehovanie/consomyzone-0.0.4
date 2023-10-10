if( document.querySelector("#fetch_actialite_tribug_jheo_js")){
    const btn_actualite = document.querySelector("#fetch_actialite_tribug_jheo_js");
    
    btn_actualite.addEventListener("click",(e) => {
        e.preventDefault();

        document.querySelector(".content_bloc_jheo_js").innerHTML = `<div class="mt-3 d-flex justify-content-center">
            <div class="spinner-border" role="status">
            <span class="sr-only">Loading...</span>
            </div>
        </div>`;

        if(!btn_actualite.classList.contains("active")){
            btn_actualite.classList.add("active")
            btn_actualite.classList.add("text-white")
            btn_actualite.classList.remove("text-primary")
        }

        if(document.querySelector("#fetch_member_tribug_jheo_js").classList.contains("active")){
            document.querySelector("#fetch_member_tribug_jheo_js").classList.remove("active")
            document.querySelector("#fetch_member_tribug_jheo_js").classList.remove("text-white")
            document.querySelector("#fetch_member_tribug_jheo_js").classList.add("text-primary")
        }
        
        if(document.querySelector("#fetch_photo_tribug_jheo_js").classList.contains("active")){
            document.querySelector("#fetch_photo_tribug_jheo_js").classList.remove("active")
            document.querySelector("#fetch_photo_tribug_jheo_js").classList.remove("text-white")
            document.querySelector("#fetch_photo_tribug_jheo_js").classList.add("text-primary")
        }

        document.querySelector(".content_bloc_jheo_js").innerHTML = `
            <div class="spinner-grow text-info d-block mx-auto" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        `;

        fetch("/tributG/actualite")
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
                if( document.querySelector(".content_bloc_jheo_js")){
                    document.querySelector(".content_bloc_jheo_js").innerHTML = response;
                }
            }).catch(error => {
                console.log(error)
            })
    })
}