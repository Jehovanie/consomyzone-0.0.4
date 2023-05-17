if( document.querySelector("#fetch_actialite_tribug_js_jheo")){
    const btn_actualite = document.querySelector("#fetch_actialite_tribug_js_jheo");
    
    btn_actualite.addEventListener("click",(e) => {
        e.preventDefault();

        document.querySelector(".content_bloc_js_jheo div").innerHTML = `<div class="mt-3 d-flex justify-content-center">
            <div class="spinner-border" role="status">
            <span class="sr-only">Loading...</span>
            </div>
        </div>`;

        if(!btn_actualite.classList.contains("active")){
            btn_actualite.classList.add("active")
            btn_actualite.classList.add("text-white")
            btn_actualite.classList.remove("text-primary")
        }
        if(document.querySelector("#fetch_member_tribug_js_jheo").classList.contains("active")){
            document.querySelector("#fetch_member_tribug_js_jheo").classList.remove("active")
            document.querySelector("#fetch_member_tribug_js_jheo").classList.remove("text-white")
            document.querySelector("#fetch_member_tribug_js_jheo").classList.add("text-primary")
        }
        if(document.querySelector("#fetch_photo_tribug_js_jheo").classList.contains("active")){
            document.querySelector("#fetch_photo_tribug_js_jheo").classList.remove("active")
            document.querySelector("#fetch_photo_tribug_js_jheo").classList.remove("text-white")
            document.querySelector("#fetch_photo_tribug_js_jheo").classList.add("text-primary")
        }

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
                if( document.querySelector(".content_bloc_js_jheo")){
                    document.querySelector(".content_bloc_js_jheo").removeChild(
                        document.querySelector(".content_bloc_js_jheo div")
                    );

                    document.querySelector("#showCreatePub").style.display="block";

                    document.querySelector(".content_bloc_js_jheo").innerHTML = response;
                }
            }).catch(error => {
                console.log(error)
            })
    })
}