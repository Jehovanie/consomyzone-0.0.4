if( document.querySelector("#fetch_actialite_tribug_js_jheo")){
    const btn_actualite = document.querySelector("#fetch_actialite_tribug_js_jheo");
    
    btn_actualite.addEventListener("click",(e) => {
        e.preventDefault();
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

        document.querySelector(".content_bloc_js_jheo").innerHTML = `
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
                if( document.querySelector(".content_bloc_js_jheo")){
                    document.querySelector(".content_bloc_js_jheo").removeChild(
                        document.querySelector(".content_bloc_js_jheo div")
                    );

                    document.querySelector(".content_bloc_js_jheo").innerHTML = response;
                }
            }).catch(error => {
                console.log(error)
            })
    })
}