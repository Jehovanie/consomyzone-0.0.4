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
        

        removeActiveLinkOnG(document.querySelectorAll(".listNavBarTribu > a"), btn_member)

        document.querySelector(".content_bloc_jheo_js").innerHTML = `
            <div class="spinner-grow text-info d-block mx-auto" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        `;


        fetch("/tributG/restaurant/v2")
            .then(response => response.json())
            .then( response => {
                document.querySelector(".textIndicationNantaJs").textContent = "Restaurants"
                let  text = `<div class="content_list_p_tG">
                                    <div class="card mb-2">

                                        <div class="row mt-3 p-3">
                                            <div class="col-12">
                                                <div id="form_past"></div>
                                                <div class="g-3">
                                                    <h5 class="text-primary mb-3">Rechercher des restaurants à pastiller</h5>
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

                            console.log(resto);

                            let id = resto.id
                            let id_resto = resto.id_resto
                            let id_resto_comment = resto.All_id_r_com != null ? resto.All_id_r_com.split(",") : []
        
                            let id_user = resto.All_user != null ? resto.All_user.split(",") : []
                            let denominationsF = resto.denomination_f
                            let nbrAvis = resto.nbrAvis
                            let key = 0
                            let note = resto.globalNote ? resto.globalNote : 0
        
                            let adresse = resto.numvoie + " " + resto.nomvoie + " " + resto.codpost + " " + resto.dep_name
        
                            let text1 = "Notez"
        
                            let action = "create"

                            for (let [k, v] of id_user.entries()) {
                                if (v === id_c_u)
                                    key = k
                            }
        
                            body += `
                                <tr id="restaurant_${resto.id_resto}">
                                    <td class="d-flex bd-highlight align-items-center">
                                        <div class="elie-img-pastilled"><img src="${document.querySelector('#profilTribuG').src}"></div>
                                        <span class="ms-3" style="font-size:12pt;cursor : pointer;" 
                                            data-toggle="tooltip" data-placement="top" title="Cliquez pour voir les détails."
                                            onclick ="openDetail('${denominationsF}', '${adresse}', '${resto.dep_name}','${resto.codpost.substring(0, 2)}','${resto.id_resto}')">${denominationsF} </span>
                                    </td>
                                    <td class="data-note-${resto.id}">${note}/4</td>
                                    <td>
                                        <a class="btn btn-sm bg_orange data-avis-${resto.id}"
                                            data-toggle="tooltip" data-placement="top" 
                                            title="Découvrir les avis des partisans de ce restaurant." 
                                            style="cursor: pointer;text-decoration:none;" 
                                            onclick="openAvisRestoG(${nbrAvis}, ${resto.id})"> 
                                            ${nbrAvis} Avis
                                        </a>
                                    </td>
                                    <td>
                                        <button 
                                        class="btn btn-primary elie-plus-${resto.id}"
                                        data-toggle="tooltip" data-placement="top" 
                                        title="Choisissez une action à entreprendre pour ce restaurant." 
                                        style="" 
                                        onclick="openPopupActionRestoG('${resto.id}','${resto.denomination_f}', '${adresse}', '${resto.poi_x}','${resto.poi_y}','${text1}', '${action}')">
                                        <i class="fas fa-plus"></i> Action pour ce restaurant</button>
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
    // let btn = document.querySelector("#data-depastille-nanta-js")
    // btn.setAttribute("onclick", `pastilleForTribuG(this, false,${id_pastille},'${denomination_f}')`)

    document.querySelector("#data-depastille-nanta-js").setAttribute("onclick", "depastillerResto(" + id_pastille + ",\'" + id_pastille + "\')")
    // btn.dataset.id = id_pastille
    // btn.dataset.name = denomination_f
    // btn.dataset.tbname = document.querySelector(".tributG_profile_name").getAttribute("data-toggle-tribug-table")

}


/**
 * @author elie
 * @constructor
 * Function affichage de la liste des avis de resto pastillé dans un tribu T
 * @localisation: myTribuT.js
 * @utilisation : dans le template tribuT.html.twig
 * @param {int} nb_avis : afficher dans le template
 * @param {int} id_resto : id de la bdd_resto
 */
function openAvisRestoG(nb_avis, id_resto) {

    $("#staticBackdrop").modal("show");

	showListInTribuT(id_resto, 'resto');
}

/**
 * @author elie
 * @constructor insertion commentaire/note resto pastille tribu G
 * @param {*} note 
 * @param {*} commentaire 
 * @param {*} _idResto 
 */
function sendNoteTribuG(note, commentaire, _idResto) {

    const requestParam = {
        note: parseFloat(note),
        avis:commentaire
    }

    ////send data to the backend server
    const request = new Request(`/avis/restaurant/${_idResto}`, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body:JSON.stringify(requestParam)
    })

    fetch(request).then(response => {

        if (response.status == 200 && response.ok) {

            swal({
                title: "Noté!",
                text: "Note ajouté avec succès",
                icon: "success",
                button: "Ok",
            }).then(r=>{
                document.querySelector("#fetch_resto_tribug_jheo_js").click()

            });


        } else {
            swal({
                title: "Erreur!",
                text: "Note non envoyé, veuillez réessayer!",
                icon: "error",
                button: "Ok",
            });

        }
    })

    /**
     * DEPRECATED
     */
    // const content = {
    //     // idUser: _idUser,
    //     idResto: _idResto,
    //     tableName: document.querySelector("#my_tribu_g").textContent.trim() + "_restaurant_commentaire",
    //     note: note,
    //     commentaire: commentaire
    // }

    // const jsonStr = JSON.stringify(content)
    // //  console.log(jsonStr)
    // const request = new Request("/push/comment/resto/pastilled", {
    //     method: "POST",
    //     body: jsonStr,
    //     headers: {
    //         'Accept': 'application/json',
    //         'Content-Type': 'application/json'
    //     },
    // })
    // fetch(request).then(response => {
    //     if (response.status == 200 && response.ok) {

    //         document.querySelector(".data-note-" + _idResto).innerHTML = parseFloat(note, 2).toFixed(2).toString() + "/4";

    //         let last_avis = parseInt(document.querySelector(".data-avis-" + _idResto).textContent.replaceAll(/[^0-9]/g, ""))

    //         document.querySelector(".data-avis-" + _idResto).innerHTML = parseInt(last_avis + 1) + " Avis";

    //         document.querySelector(".data-avis-" + _idResto).setAttribute("onclick", "openAvisRestoG(" + parseInt(last_avis + 1) + "," + _idResto + ")")

    //         swal({
    //             title: "Noté!",
    //             text: "Note ajouté avec succès",
    //             icon: "success",
    //             button: "Ok",
    //         });

    //     } else {
    //         swal({
    //             title: "Erreur!",
    //             text: "Note non envoyé, veuillez réessayer!",
    //             icon: "error",
    //             button: "Ok",
    //         });

    //     }
    // })
}

/**
 * @author elie
 * @constructor mise à jour note et commentaire resto pastille tribu G
 * @param {int} id_resto 
 */
function updateNoteTribuG(id_resto, id_bdd_resto) {

    let note = document.querySelector("#text-note").value.replace(/,/g, ".")
    let avis = document.querySelector("#message-text").value

    const requestParam = {
        avisID: id_resto,
        note: parseFloat(note),
        avis:avis
    }

    const request = new Request(`/change/restaurant/${id_bdd_resto}`, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body:JSON.stringify(requestParam)
    })
    fetch(request).then(r => {
        if (r.ok && r.status === 200) {
                swal({
                    title: "A jour!",
                    text: "Note modifié avec succès!",
                    icon: "success",
                    button: "Ok",
                }).then(r=>{
                    document.querySelector("#fetch_resto_tribug_jheo_js").click()

                });

        }
    })

    /**
     * DEPRECATED
     */
    /*
    let note = document.querySelector("#text-note").value
    let commentaire = document.querySelector("#message-text").value

    const tribu_t_name_0 = document.querySelector("#my_tribu_g").textContent.trim()

    const table_resto_comment = tribu_t_name_0+ "_restaurant_commentaire"

    let data = {
        tableName : table_resto_comment,
        id : id_resto,
        note : note,
        commentaire : commentaire
    }

    fetch("/update/note-g/resto/pastilled", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    }).then(res=>{
        if(res.ok && res.status==200){
            swal({
                title: "A jour!",
                text: "Note modifié avec succès!",
                icon: "success",
                button: "Ok",
            });
            
        }
    })
    */

}

/**
 * @author Elie
 * @constructor depastiller un golf
 * @param {*} id_pastille 
 * @param {*} id_golf 
 */
function depastillerResto(id_pastille, id_resto){
    let data = {
        tbl : document.querySelector(".tributG_profile_name").getAttribute("data-toggle-tribug-table"),
        name : "Resto id : "+id_resto,
        id : id_resto
    }

    fetch("/user/tribu_g/depastille/resto",{
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(resp=>{
            if(resp.ok && resp.status==200){
    
                swal({
                    title: "Dépastillé!",
                    text: "Restaurant dépastillé avec success",
                    icon: "success",
                    button: "Ok",
                }).then(e=>{
                    $("#detailOptionResto").modal("hide")
                    document.querySelector("#fetch_resto_tribug_jheo_js").click()
                });
            }
        })
}