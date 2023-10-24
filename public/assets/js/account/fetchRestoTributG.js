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
                
                let  text = `<div class="content_list_p_tG">
                                    <div class="card mb-2">
                                        <div class="card-header">
                                            <h4>Restaurant pastillé dans la tribu G</h4>
                                        </div>
                                        <div class="card-body" style="overflow-x:auto;">
                                            <table class="table table-responsive" id="table-resto-tribu-g-elie">
                                                <thead>
                                                    <tr>
                                                        <th scope="col">Nom de restaurant</th>
                                                        <th scope="col">Note</th>
                                                        <th scope="col">Avis</th>
                                                        <th scope="col">Actions</th>
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

                    let id_c_u = document.querySelector(".main_user_id").getAttribute("data-my-id")
                
                    for(let resto of response){

                        if (resto.isPastilled) {

                            // console.log(resto);

                            let id = resto.id
                            let id_resto = resto.id_resto
                            let id_resto_comment = resto.All_id_r_com != null ? resto.All_id_r_com.split(",") : []
        
                            let id_user = resto.All_user != null ? resto.All_user.split(",") : []
                            let denominationsF = resto.denomination_f
                            let nbrAvis = resto.nbrAvis
                            let key = 0
                            let note = resto.globalNote ? resto.globalNote : 0
        
                            let adresse = resto.numvoie + " " + resto.nomvoie + " " + resto.codpost + " " + resto.dep_name
        
                            let text1 = ""
        
                            let action = ""
        
                            for (let [k, v] of id_user.entries()) {
                                if (v === id_c_u)
                                    key = k
                            }
                            if (id_user.includes(id_c_u)) {
                                action = "update"
        
                                text1 = "Modifiez votre avis"
                            } else {
                                action = "create"
                                text1 = "Notez"
                            }
        
                            body += `
                                <tr id="restaurant_${resto.id_resto}">
                                    <td class="d-flex bd-highlight align-items-center">
                                        <div class="elie-img-pastilled"><img src="${document.querySelector('#profilTribu').src}"></div>
                                        <span class="ms-3" style="font-size:12pt;cursor : pointer;" onclick ="openDetail('${denominationsF}', '${adresse}', '${resto.dep_name}','${resto.codpost.substring(0, 2)}','${resto.id_resto}')">${denominationsF} </span>
                                    </td>
                                    <td class="data-note-${resto.id}">${note}/4</td>
                                    <td>
                                        <a class="text-secondary data-avis-${resto.id}" style="cursor: pointer;text-decoration:none;" onclick="openAvis(${nbrAvis}, ${resto.id})"> ${nbrAvis} Avis</a>
                                    </td>
                                    <td>
                                        <button class="btn btn-primary elie-plus-${resto.id}" style="" onclick="openPopupAction('${resto.id}','${resto.denomination_f}', '${adresse}', '${resto.poi_x}','${resto.poi_y}','${text1}', '${action}')"><i class="fas fa-plus"></i> Plus</button>
                                    </td>
                                </tr>
                            `
                        }

                    }

                    document.querySelector("#restaurant-tg-elie-js").innerHTML = body;

                    $('#table-resto-tribu-g-elie').DataTable({
                        "language": {
                            url: '//cdn.datatables.net/plug-ins/1.13.4/i18n/fr-FR.json',
                        }
                    });

                }else{
                    document.querySelector("#restaurant-tg-elie-js").innerHTML = "<label class='mt-4'>Aucun restaurant pastillé dans votre tribu G</label>";
                }
            })
    })
}

function openPopupAction(id_pastille, denomination_f, adresse, latitude, longitude, text1, action) {

    $("#detailOptionResto").modal("show")

    document.querySelector("#data-note-elie-js").innerHTML = `<i class="fas fa-edit"></i> ` + text1

    document.querySelector("#data-note-elie-js").setAttribute("onclick", "openOnNote(" + id_pastille + ",\'" + action + "\')")
    document.querySelector("#data-event-elie-js").setAttribute("onclick", "openOnEvent(" + id_pastille + ",\'" + denomination_f + "\',\'" + adresse + "\',\'" + action + "\')")
    let btn = document.querySelector("#data-depastille-nanta-js")
    btn.dataset.id = id_pastille
    btn.dataset.name = denomination_f
    // btn.dataset.tbname = document.querySelector("#activeTribu").getAttribute("data-table-name")
    btn.dataset.tbname = document.querySelector(".tributG_profile_name").getAttribute("data-toggle-tribug-table")

    // document.querySelector("#data-depastille-nanta-js").dataset.id = id_pastille
    // document.querySelector("#data-depastille-nanta-js").dataset.name = denomination_f
    // document.querySelector("#data-depastille-nanta-js").dataset.tbname = document.querySelector("#activeTribu").getAttribute("data-table-name")

}