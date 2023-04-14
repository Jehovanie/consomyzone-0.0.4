if( document.querySelector("#fetch_actialite_tribug_js_jheo")){
    const btn_actualite = document.querySelector("#fetch_actialite_tribug_js_jheo");
    btn_actualite.addEventListener("click",(e) => {
        e.preventDefault();
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