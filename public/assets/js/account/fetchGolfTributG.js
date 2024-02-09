if (document.querySelector("#fetch_golf_tribug_jheo_js")) {
    const btn_member = document.querySelector("#fetch_golf_tribug_jheo_js");

    btn_member.addEventListener("click", (e) => {
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


        fetch("/tributG/mon-golf/v2")
            .then(response => response.json())
            .then(response => {
document.querySelector(".textIndicationNantaJs").textContent = "Golfs"
                let text = `<div class="content_list_p_tG">
                                    <div class="card mb-2">

                                        <div class="row mt-3 p-3">
                                            <div class="col-12">
                                                <div id="form_past"></div>
                                                <div class="g-3">
                                                    <h5 class="text-primary mb-3">Rechercher des golfs à pastiller</h5>
                                                    <div class="input-group mb-3">
                                                        <input type="text" class="form-control  rounded elie-resto-rech" placeholder="Quoi ?" id="golf-rech">
                                                        <input type="text" class="form-control  rounded elie-resto-rech" placeholder="Où ?" id="golf-rech-ou">
                                                        <button class="btn btn-light" type="button" id="button-addon2"  onclick="findGolf()"><i class="fas fa-search"></i></button>
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
                                                        <th scope="col">Notes</th>
                                                        <th scope="col">Avis</th>
                                                        <th scope="col">Details</th>
                                                    </tr>
                                                </thead>
                                                <tbody id="golf-tg-elie-js">
                                                    
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>`

                if (document.querySelector(".content_bloc_jheo_js")) {
                    document.querySelector(".content_bloc_jheo_js").innerHTML = text;

                }

                if (response.length > 0) {

                    let body = ""

                    let id_c_u = document.querySelector(".main_user_id").getAttribute("data-my-id")

                    for (let golf of response) {
// console.log(golf);
                        if (golf.isPastilled) {

                            let adresse_golf = golf.adr1 + " " + golf.nom_commune + " " + golf.cp + " " + golf.nom_dep

                            let note = golf.globalNote ? golf.globalNote : 0
// console.log("id_comment"+ golf.id_golf_comment);
                            body += `
                                <tr id="golf_${golf.id}">
                                    <td class="d-flex bd-highlight align-items-center">
                                        <div class="elie-img-pastilled"><img src="${document.querySelector('#profilTribuG').src}"></div>
                                        <span class="ms-3" style="font-size:12pt;cursor : pointer;" 
                                            data-toggle="tooltip" data-placement="top" title="Cliquez pour voir les détails."
                                            onclick ="openDetailGolf('${golf.nom_golf}', '${adresse_golf}', '${golf.nom_dep}','${golf.cp}','${golf.id}')">${golf.nom_golf.charAt(0).toUpperCase() + golf.nom_golf.slice(1)} </span>
                                    </td>
                                    <td class="data-note-${golf.id}">
                                        ${note}
                                    </td>
                                    <td>
                                        <a 
                                            class="btn btn-sm bg_orange data-avis-${golf.id}" 
                                            style="cursor: pointer;text-decoration:none;"  
                                            data-toggle="tooltip" data-placement="top" 
                                            title="Découvrir les avis des partisans de ce golf." 
                                            onclick="openAvisGolfG(${golf.nbrAvis}, ${golf.id})"> ${golf.nbrAvis} Avis
                                           
                                        </a>
                                    </td>
                                    <td>
                                        <button 
                                        class="btn btn-primary elie-plus-${golf.id}" 
                                        style="" 
                                        data-toggle="tooltip" data-placement="top" 
                                        title="Choisissez une action à entreprendre pour ce golf." 
                                        onclick='openPopupActionGolfG(${golf.id_golf_pastilled}, ${golf.id_golf_extension})'>
                                        <i class="fas fa-plus"></i> Action pour ce golf
                                        </button>
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

                } else {
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
function openPopupActionGolfG(id_pastille, id_golf) {

    $("#detailOptionGolf").modal("show")

    document.querySelector("#data-note-elie-js-2").innerHTML = `<i class="fas fa-edit"></i> Notez`

    document.querySelector("#data-note-elie-js-2").setAttribute("onclick", "openOnNoteGolf(" + id_golf + ",'create')")
    
    document.querySelector("#data-depastille-nanta-js-2").setAttribute("onclick", `depastillerGolf(${id_pastille}, ${id_golf})`)

    
   
}


/**
 * @author elie
 * @constructor
 * Function affichage de la liste des avis de golf pastillé dans un tribu T
 * @localisation: myTribuT.js
 * @utilisation : dans le template tribuT.html.twig
 * @param {int} nb_avis : afficher dans le template
 * @param {int} id_golf : id de la bdd_resto
 */
function openAvisGolfG(nb_avis, id_golf) {

    $("#staticBackdrop").modal("show");

	showListInTribuT(id_golf, 'golf');

    // if (parseInt(nb_avis) > 0) {

    //     $("#avisGolfPastille").modal("show")

    //     const table_resto = document.querySelector(".tributG_profile_name").getAttribute("data-toggle-tribug-table") + "_restaurant"

    //     ///avis/restaurant/{idRestaurant}

    //     // document.querySelector("#bodyAvisGolfPastilleElie").innerHTML = ""

    //     fetch('/avis/golf/global/' + id_golf)
    //         // fetch('/user/comment/tribu-g/restos-pastilles/' + table_resto + '/' + id_golf)
    //         .then(response => response.json())
    //         .then(response => {
    //             const avis= response.data;
    //             for (let avi of avis) {

    //                 console.log(avi);

    //                 let noteEtoile = ""



    //                 switch (parseInt(avi.note)) {
    //                     case 1:
    //                         noteEtoile = `<i class="fa-solid fa-star checked" style="color: rgb(245, 209, 101);"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>`
    //                         break;
    //                     case 2:
    //                         noteEtoile = `<i class="fa-solid fa-star checked" style="color: rgb(245, 209, 101);"></i><i class="fa-solid fa-star checked" style="color: rgb(245, 209, 101);"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>`
    //                         break;
    //                     case 3:
    //                         noteEtoile = `<i class="fa-solid fa-star checked" style="color: rgb(245, 209, 101);"></i><i class="fa-solid fa-star checked" style="color: rgb(245, 209, 101);"></i><i class="fa-solid fa-star checked" style="color: rgb(245, 209, 101);"></i><i class="fa-solid fa-star"></i>`
    //                         break;
    //                     case 4:
    //                         noteEtoile = `<i class="fa-solid fa-star checked" style="color: rgb(245, 209, 101);"></i><i class="fa-solid fa-star checked" style="color: rgb(245, 209, 101);"></i><i class="fa-solid fa-star checked" style="color: rgb(245, 209, 101);"></i><i class="fa-solid fa-star checked" style="color: rgb(245, 209, 101);"></i>`
    //                         break;
    //                     default:
    //                         noteEtoile = `<i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>`
    //                 }

    //                 let edit_avis_e = ''

    //                 if (avi.user.id == document.querySelector('.information_user_conected_jheo_js').getAttribute('data-toggle-user-id')) {
    //                     edit_avis_e = `<div class="content_action">
    //                         <button type="button" class="btn btn-outline-primary edit_avis" data-bs-dismiss="modal"
    //                             data-bs-toggle="modal" data-bs-target="#modalAvisGolf"
    //                             onclick="setUpdateGolfNoteG(this, ${avi.id}, ${avi.note}, '${avi.avis}', ${id_golf})">
    //                             <i class="fa-solid fa-pen-to-square"></i>
    //                         </button>
    //                     </div>
    //                     `
    //                 }

    //                 document.querySelector("#bodyAvisGolfPastilleElie").innerHTML +=
    //                     `<div class="card mb-2 card_avis_resto_jheo_js">
    //                         <div class="card-body">

    //                         <div class="avis_content">
    //                             <div>
    //                                 <div class="d-flex justify-content-between align-items-start">
    //                                     <div class="d-flex justify-content-between align-items-start">
    //                                         <div class="content_profil_image me-2">
    //                                             <img class="profil_image" src="${avi.user.photo ? "/public" +  avi.user.photo : '/public/uploads/users/photos/default_pdp.png'}" alt="User">
    //                                         </div>
    //                                         <div class="content_info">
    //                                             <h3 class="text-point-9"> <small class="fw-bolder text-black">${avi.user.fullname}</small></h3>
    //                                             <cite class="font-point-6"> ${avi.datetime}</cite>
    //                                         </div>
    //                                     </div>
    //                                     <div class="content_start">
    //                                         <p class="mb-2"> ${noteEtoile}</p>

    //                                         ${edit_avis_e}

    //                                     </div>
    //                                 </div>

    //                                 <div class="mt-2">
    //                                     <p class="text-point-9">${avi.avis}</p>
    //                                 </div>
    //                             </div>
    //                         </div>

    //                         </div>
    //                     </div>
    //                     `
    //             }

    //         })


    // } else {

    //     swal({
    //         title: "Opps!",
    //         text: "Aucun avis pour ce golf",
    //         icon: "warning",
    //         button: "Ok",
    //     });

    // }

    // const myModalEl = document.getElementById('avisGolfPastille')
    // if (myModalEl) {
    //     myModalEl.addEventListener('hidden.bs.modal', event => {
    //         // do something...
    //         if (document.querySelector("#bodyAvisGolfPastilleElie")) {
    //             document.querySelector("#bodyAvisGolfPastilleElie").innerHTML = ""
    //         }
    //     })
    // }


}


/**
* @author Elie
* @constructor Envoie de paramettre de la mise à jour de note dans le template
* @param {*} params 
* @param {*} id 
* @param {*} note 
* @param {*} commentaire 
* @param {*} id_resto 
*/
function setUpdateGolfNoteG(params, id, note, commentaire, id_resto) {
    $('#modalAvisGolf').modal('show')

    document.querySelector("#text-note-2").value = note
    document.querySelector("#message-text-2").value = commentaire
    document.querySelector("#modalAvisGolf > div > div > div.modal-footer > button").setAttribute("data-action", "update")

    if (window.location.href.includes("/user/account")) {

        document.querySelector("#modalAvisGolf > div > div > div.modal-footer > button").setAttribute("onclick", "updateNoteGolfTribuG(" + id + ", " + id_resto + ")")

    } else {

        document.querySelector("#modalAvisGolf > div > div > div.modal-footer > button").setAttribute("onclick", "updateNote(" + id + ", " + id_resto + ")")

    }

}


/**
 * @author elie
 * @constructor insertion commentaire/note resto pastille tribu G
 * @param {*} note 
 * @param {*} commentaire 
 * @param {*} _idResto 
 */
function sendNoteGolfTribuG(note, commentaire, _idResto) {

    const requestParam = {
        note: parseFloat(note),
        avis: commentaire
    }

    ////send data to the backend server
    const request = new Request(`/avis/golf/${_idResto}`, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestParam)
    })

    fetch(request).then(response => {

        if (response.status == 200 && response.ok) {

            swal({
                title: "Noté!",
                text: "Note ajouté avec succès",
                icon: "success",
                button: "Ok",
            }).then(r=>{
                document.querySelector("#fetch_golf_tribug_jheo_js").click()
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

}

/**
 * @author elie
 * @constructor mise à jour note et commentaire resto pastille tribu G
 * @param {int} id_resto 
 */
function updateNoteGolfTribuG(id_golf, id_bdd_golf) {

    let note = document.querySelector("#text-note-2").value.replace(/,/g, ".")
    let avis = document.querySelector("#message-text-2").value

    const requestParam = {
        avisID: id_golf,
        note: parseFloat(note),
        avis: avis
    }

    const request = new Request(`/change/golf/${id_bdd_golf}`, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestParam)
    })
    fetch(request).then(r => {
        if (r.ok && r.status === 200) {
            swal({
                title: "A jour!",
                text: "Note modifié avec succès!",
                icon: "success",
                button: "Ok",
            }).then(e=>{
                document.querySelector("#fetch_golf_tribug_jheo_js").click()
            });

        }
    })

}



/**
* Update 26-10-2023 : Deplacement de myTribuT.js vers function.js
* @author elie
* @constructor Fonction d'ouverture de note de resto pastillé
* @localisation : myTribuT.js
* @utilisation dans le template tribuT.html.twig
* @param {int} id_pastille : id resto
* @param {string} action : action à faire pour le bouton
*/
function openOnNoteGolf(id_pastille, action) {

    // document.querySelector("#modalAvisGolf > div > div > div.modal-footer > button").setAttribute("data-action", action)

    // document.querySelector("#modalAvisGolf > div > div > div.modal-footer > button").setAttribute("onclick", "setSendNoteGolf(this," + id_pastille + ")")

    $("#modalAvis").modal("show");
    document.querySelector(".send_avis_jheo_js").setAttribute("data-action", action);
    document.querySelector(".send_avis_jheo_js").setAttribute("onclick", "addAvisInTribuG(" + id_pastille + ",'golf')");

}


/**
* Update 26-10-2023 : Deplacement de myTribuT.js vers function.js
* @author elie
* @constructor : fonction de parametrage d'id resto dans un template
* @localisation : myTribuT.js
* @utilisation dans le template tribuT.html.twig
* @param {element} params : element ou le fonction se place
* @param {int} id_pastille : id resto
*/
function setSendNoteGolf(params, id_pastille) {

    const action = params.getAttribute("data-action")

    const avis = params.parentElement.previousElementSibling.querySelector("#message-text-2")
    const note = params.parentElement.previousElementSibling.querySelector("#text-note-2")

    if (action == "create") {

        if (parseFloat(note.value) > 4) {
            swal({
                title: "Erreur de saisie de note!",
                text: "Une note doit être inférieur ou égale à 4",
                icon: "error",
                button: "Ok",
            });

        } else {

            if (window.location.href.includes("/user/account")) {

                sendNoteGolfTribuG(parseFloat(note.value), avis.value, id_pastille)

            } else {

                sendNote(parseFloat(note.value), avis.value, id_pastille)

            }
        }

    }

}

/**
 * @author Elie
 * @constructor Ouvrir un detail de golf
 * @param {*} nom 
 * @param {*} adresse 
 * @param {*} ville 
 * @param {*} cp 
 * @param {*} id_golf 
 */
function openDetailGolf(nom, adresse, ville, cp, id_golf){
    $('#modalDetailGolf').modal("show")

    document.querySelector("#elie-golf-detail").innerHTML =
    `<div class="card" style="width: 100%;">
        <div class="card-body">
            <h5 class="card-title">Nom : ${nom.toUpperCase()}</h5>
            <figcaption class="blockquote-footer mt-3">Adresse : ${adresse}</figcaption>
        </div>
        <ul class="list-group list-group-flush">
            <li class="list-group-item">Commune : ${ville}</li>
            <li class="list-group-item">Code postale : ${cp}</li>
            <li class="list-group-item">Département: ${cp.substring(0, 2)}</li>
        </ul>
        </div>`
}

/**
 * @author Elie
 * @constructor depastiller un golf
 * @param {*} id_pastille 
 * @param {*} id_golf 
 */
function depastillerGolf(id_pastille, id_golf){
    let data = {
        tbl : document.querySelector(".tributG_profile_name").getAttribute("data-toggle-tribug-table"),
        name : "Golf id : "+id_golf,
        id : id_golf
    }

    fetch("/user/tribu_g/depastille/golf",{
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
                    text: "Golf dépastillé avec success",
                    icon: "success",
                    button: "Ok",
                }).then(e=>{
                    $("#detailOptionGolf").modal("hide")
                    document.querySelector("#fetch_golf_tribug_jheo_js").click()
                });
            }
        })
}