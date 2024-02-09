if( document.querySelector("#fetch_actialite_tribug_jheo_js")){
    const btn_actualite = document.querySelector("#fetch_actialite_tribug_jheo_js");
    
    btn_actualite.addEventListener("click",(e) => {
        e.preventDefault();

        document.querySelector(".content_bloc_jheo_js").innerHTML = `<div class="mt-3 d-flex justify-content-center">
            <div class="spinner-border" role="status">
            <span class="sr-only">Loading...</span>
            </div>
        </div>`;

        removeActiveLinkOnG(document.querySelectorAll(".listNavBarTribu > a"), btn_actualite)

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
                let trbGName = document.querySelector(".tributG_profile_name").textContent.trim()
                document.querySelector(".textIndicationNantaJs").textContent = "Actualité de " + trbGName
                if( document.querySelector(".content_bloc_jheo_js")){
                    document.querySelector(".content_bloc_jheo_js").innerHTML = response;
                }
            }).catch(error => {
                console.log(error)
            })
    })
}