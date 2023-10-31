if( document.querySelector("#fetch_golf_tribug_jheo_js")){
    const btn_member = document.querySelector("#fetch_golf_tribug_jheo_js");
    
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

        if(document.querySelector("#fetch_resto_tribug_jheo_js").classList.contains("active")){
            document.querySelector("#fetch_resto_tribug_jheo_js").classList.remove("active")
            document.querySelector("#fetch_resto_tribug_jheo_js").classList.remove("text-white")
            document.querySelector("#fetch_resto_tribug_jheo_js").classList.add("text-primary")
        }

        document.querySelector(".content_bloc_jheo_js").innerHTML = `
            <div class="spinner-grow text-info d-block mx-auto" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        `;


        fetch("/tributG/mon-golf")
            .then(response => response.json())
            .then( response => {
                
                let  text = `<div class="content_list_p_tG">
                                    <div class="card mb-2">

                                        <div class="row mt-3 p-3">
                                            <div class="col-12">
                                                <div id="form_past"></div>
                                                <div class="g-3">
                                                    <div class="input-group mb-3">
                                                        <input type="text" class="form-control  rounded elie-resto-rech" placeholder="Quoi ?" id="resto-rech">
                                                        <input type="text" class="form-control  rounded elie-resto-rech" placeholder="Où ?" id="resto-rech-ou">
                                                        <button class="btn btn-light" type="button" id="button-addon2"  onclick="listResto()"><i class="fas fa-search"></i></button>
                                                    </div>
                                                    <div class="list-group" style="z-index:9; position:relative;height:120px;display:none;" id="result_resto_past">
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="card-header">
                                            <h4>Golf pastillé dans la tribu G</h4>
                                        </div>
                                        <div class="card-body" style="overflow-x:auto;">
                                            <table class="table table-responsive" id="table-resto-tribu-g-elie">
                                                <thead>
                                                    <tr>
                                                        <th scope="col">Nom du golf</th>
                                                        <th scope="col">Adresse</th>
                                                        <th scope="col">Détail</th>
                                                    </tr>
                                                </thead>
                                                <tbody id="golf-tg-elie-js">
                                                    
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
                
                    for(let golf of response){

                        if (golf.isPastilled) {

                            // console.log(golf);

                            let adresse_golf = golf.adr1 +" "+golf.nom_commune+" "+golf.cp+" "+golf.nom_dep
        
                            body += `
                                <tr id="restaurant_${golf.extensionId}">
                                    <td class="d-flex bd-highlight align-items-center">
                                        <div class="elie-img-pastilled"><img src="${document.querySelector('#profilTribu').src}"></div>
                                        <span class="ms-3" style="font-size:12pt;cursor : pointer;" onclick ="openDetail('${golf.nom_golf}', '${adresse_golf}', '${golf.nom_dep}','${golf.cp.substring(0, 2)}','${golf.extensionId}')">${golf.nom_golf} </span>
                                    </td>
                                    <td>
                                        ${adresse_golf}
                                    </td>
                                    <td>
                                        <button class="btn btn-primary elie-plus-${golf.id}" style=""><i class="fas fa-plus"></i> Plus</button>
                                    </td>
                                </tr>
                            `
                        }

                    }

                    document.querySelector("#golf-tg-elie-js").innerHTML = body;

                    $('#table-resto-tribu-g-elie').DataTable({
                        "language": {
                            url: '//cdn.datatables.net/plug-ins/1.13.4/i18n/fr-FR.json',
                        }
                    });

                }else{
                    document.querySelector("#golf-tg-elie-js").innerHTML = "<label class='mt-4'>Aucun golf pastillé dans votre tribu G</label>";
                }
            })
    })
}

/**
 * @constructor Ouvrir le popup action pour resto tribu G
 * @param {*} id_pastille 
 * @param {*} denomination_f 
 * @param {*} adresse 
 * @param {*} latitude 
 * @param {*} longitude 
 * @param {*} text1 
 * @param {*} action 
 */
function openPopupActionRestoG(id_pastille, denomination_f, adresse, latitude, longitude, text1, action) {

    $("#detailOptionResto").modal("show")

    document.querySelector("#data-note-elie-js").innerHTML = `<i class="fas fa-edit"></i> ` + text1

    document.querySelector("#data-note-elie-js").setAttribute("onclick", "openOnNote(" + id_pastille + ",\'" + action + "\')")
    document.querySelector("#data-event-elie-js").setAttribute("onclick", "openOnEvent(" + id_pastille + ",\'" + denomination_f + "\',\'" + adresse + "\',\'" + action + "\')")
    let btn = document.querySelector("#data-depastille-nanta-js")
    btn.dataset.id = id_pastille
    btn.dataset.name = denomination_f
    btn.dataset.tbname = document.querySelector(".tributG_profile_name").getAttribute("data-toggle-tribug-table")

}
