if( document.querySelector("#fetch_resto_tribug_jheo_js")){
    const btn_member = document.querySelector("#fetch_resto_tribug_jheo_js");
    
    btn_member.addEventListener("click",(e) => {
        e.preventDefault();

        // document.querySelector("#showCreatePub").style.display="none";

        document.querySelector(".content_bloc_jheo_js").innerHTML = `
            <div class="mt-3 d-flex justify-content-center">
                <div class="spinner-border" role="status">
                <span class="sr-only">Loading...</span>
                </div>
            </div>
        `;
        

        if(!btn_member.classList.contains("active")){
            btn_member.classList.add("active")
            btn_member.classList.add("text-white")
            btn_member.classList.remove("text-primary")
        }

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


        fetch("/tributG/restaurant")
            .then(response => response.json())
            .then( response => {
                console.log(response);
                
                let  text = `<div class="content_list_p_tG">
                                    <div class="card mb-2">
                                        <div class="card-header">
                                            <h4>Restaurant pastillé dans la tribu G</h4>
                                        </div>
                                        <div class="card-body" style="overflow-x:auto;">
                                            <table class="table table-responsive">
                                                <thead>
                                                    <tr>
                                                        <th scope="col">Nom de restaurant</th>
                                                        <th scope="col">Note</th>
                                                        <th scope="col">Avis</th>
                                                        <th scope="col">Actions</th>
                                                        <th></th>
                                                    </tr>
                                                </thead>
                                                <tbody id="restaurant-tg-elie-js">
                                                    
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>`

                    if( document.querySelector(".content_bloc_jheo_js")){
                        document.querySelector(".content_bloc_jheo_js").innerHTML = text;

                    }

                    if( response.length > 0 ){

                    let body = ""
                
                    for(let resto of response){
                        body +=`
                        <tr>
                            <td>${resto.denomination_f}</td>
                            <td>0/4</td>
                            <td>0 Avis</td>
                            <td class="text-primary">Dépastiller</td>
                        </tr>`
                    }

                    document.querySelector("#restaurant-tg-elie-js").innerHTML = body;

                }else{
                    document.querySelector("#restaurant-tg-elie-js").innerHTML = "<label class='mt-4'>Aucun restaurant pastillé dans votre tribu G</label>";
                }
            })
    })
}