if( document.querySelector("#fetch_photo_tribug_js_jheo")){
    const btn_photos = document.querySelector("#fetch_photo_tribug_js_jheo");
    
    btn_photos.addEventListener("click",(e) => {
        e.preventDefault();
        if(!btn_photos.classList.contains("active")){
            btn_photos.classList.add("active")
            btn_photos.classList.add("text-white")
            btn_photos.classList.remove("text-primary")
            
        }

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
                }
            }).catch(error => {
                console.log(error)
            })
    })
}