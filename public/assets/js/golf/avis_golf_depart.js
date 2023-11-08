let currentUserId = 0
window.addEventListener('load', () => {
    ////controle text...
    document.querySelector("#text-note").onkeyup = (e) => { 
        if (document.querySelector(".flash-msg-ERREUR")) {
            document.querySelector(".flash-msg-ERREUR").parentNode.removeChild(document.querySelector(".flash-msg-ERREUR"))
        }
        const value = e.target.value
        mustBeInferior4(value, e.target)

        setTimeout(() => {
            e.target.style="border:2px solid black;" 
            document.querySelectorAll(".flash-msg-ERREUR").forEach((i) => {
                i.style = " transition:2s ease-in-out; transform: translateX(-25px); opacity: 0;"   
            })
        }, 5000)   
    }

    ////rest name of the title modal
    if( document.querySelector(".close_modal_input_avis_jheo_js")){
        document.querySelector(".close_modal_input_avis_jheo_js").addEventListener('click' , () => {
            document.querySelector(".title_modal_jheo_js").innerHTML = "Donnée votre avis."
        })
    }

})



function showAvis(currentUserId, idGolf) {

    const btn_update = document.querySelector(".send_avis_jheo_js");

    if( !btn_update.classList.contains("btn-warning")){
        btn_update.classList.add("btn-warning")
    }

    fetch(`/avis/golf/global/${idGolf}`, {
        methode:"GET"
    }).then(r => r.json())
    .then(jsons => {

        ////delete chargement ... 
        document.querySelector(".all_avis_jheo_js").innerHTML = "";

        if (jsons.length > 0 ) {
            if( document.querySelector(".card_avis_empty_jheo_js")){
                document.querySelector(".card_avis_empty_jheo_js").remove();
            }

            for (let json of jsons) {
                createShowAvisAreas(json, currentUserId,idGolf)
            }
            
        }else{
            document.querySelector(".all_avis_jheo_js").innerHTML= `
                <div class="card mb-2 card_avis_empty_jheo_js">
                    <div class="card-body">
                        <div class="avis_content">
                            <div class="text-danger text-center">
                                Actuellement, il n'y a pas encore d'avis sur cette restaurant
                            </div>
                        </div>
                    </div>
                </div>
            `
        }
    })
}

/**
 * Create new avis resto in first time
 */
function addAvis(){

    ///// remove alert card empty avis and add chargement spinner
    if( document.querySelector(".card_avis_empty_jheo_js")){
        document.querySelector(".card_avis_empty_jheo_js").remove();
    }

    ///// remove alert card and add chargement spinner
    if( document.querySelector(".all_avis_jheo_js")){
        document.querySelector(".all_avis_jheo_js").innerHTML = `
            <div class="d-flex justify-content-center align-items-center spinner_jheo_js">
                <div class="spinner-border m-3" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
        `
    }


    let newIdGolf = document.querySelector("#details-coord").getAttribute("data-toggle-id-golf")

    let newUserId = parseInt(document.querySelector(".content_body_details_jheo_js").getAttribute("data-toggle-user-id"))

    let note = document.querySelector("#text-note").value
    note=note.replace(/,/g,".")

    const avis = document.querySelector("#message-text").value

    try {
        mustBeInferior4(note, document.querySelector("#text-note"), true)

        const requestParam = {
            note: parseFloat(note),
            avis:avis
        }

        deleteOldValueInputAvis(); //// delet input and text 

        ////send data to the backend server
        const request = new Request(`/avis/golf/${newIdGolf}`, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(requestParam)
        })

        fetch(request).then(r => {
            if (r.ok && r.status === 200) {

                ///// generate list avis in modal
                showModifArea(newIdGolf, newUserId)

                //// update number avis in details resto
                if (document.querySelector("#see-tom-js")) {

                    ////get total number avis and update
                    showNemberOfAvis(newIdGolf, document.querySelector("#see-tom-js"))

                    /// get global note and update global notes in details resto
                    showNoteGlobale(newIdGolf)
                }


                if(document.querySelector(".content_avis_person_hidden_jheo_js")){
                    document.querySelector(".content_avis_person_hidden_jheo_js").setAttribute("data-avis-note", note )
                    document.querySelector(".content_avis_person_hidden_jheo_js").setAttribute("data-avis-text", avis )
                }
            }
        })
    } catch (e) {
        msgErrorAlertAvis(e)
    }finally{

    }
}


/**
 * Get number total avis resto and setting
 * @param {*} idGolf 
 * @param {*} parent 
 */
function showNemberOfAvis(idGolf, parent) {
    fetch(`/nombre/avis/golf/${idGolf}`).then(r => {
        r.json().then(json => {
            const nombreAvis = json["nombre_avis"]
            createNombreAvisContainer(parent, nombreAvis) 
        })
    })
}



/**
 * display all avis resto and reset input note and avis resto
 */
function showListAvie() {
    ////delete all avis inside and add chargement
    if( document.querySelectorAll(".all_avis_jheo_js")){
        document.querySelector(".all_avis_jheo_js").innerHTML = `
            <div class="d-flex justify-content-center align-items-center spinner_jheo_js">
                <div class="spinner-border m-3" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
        `
    }

    if(document.querySelectorAll(".card_avis_resto_jheo_js")){
        document.querySelectorAll(".card_avis_resto_jheo_js").forEach(item => item.remove())
    }

    if( document.querySelector(".send_avis_jheo_js")){ //// reset function add avis resto
        if(document.querySelector(".send_avis_jheo_js").hasAttribute("onclick")){
            document.querySelector(".send_avis_jheo_js").setAttribute("onclick", "addAvis()");
        }

        deleteOldValueInputAvis(); //// delet input and text 
    }

    const newIdGolf = document.querySelector("#details-coord").getAttribute("data-toggle-id-golf")
    const userId = document.querySelector(".content_body_details_jheo_js").getAttribute("data-toggle-user-id")
    showAvis(userId, newIdGolf) 
}

/**
 * Rest input note and avis resto
 */
function deleteOldValueInputAvis(){
    document.querySelector(".note_number_jheo_js") ? document.querySelector(".note_number_jheo_js").value = "" : null ;
    document.querySelector(".note_avis_jheo_js") ? document.querySelector(".note_avis_jheo_js").value = "" : null ;
}


/**
 * Get all avis resto and check if the current connected is already send avis
 * @param {*} idGolf 
 * @param {*} currentUserId 
 * 
 * @return Generate html avis in modal
 */
function showModifArea(idGolf, currentUserId) {

    fetch(`/avis/golf/global/${idGolf}`)
        .then(r => r.json())
        .then(jsons => {
            if (jsons) {

                //// before show all comments, delete the content.
                if (screen.width <= 991) {
                    document.querySelector(`.all_avis_${idGolf}_jheo_js`).innerHTML = "";
                } else {
                    document.querySelector(".all_avis_jheo_js").innerHTML = "";
                }

                for (let json of jsons) { 
                    //// create single avis, and pass state of currect id
                    createShowAvisAreas(json,currentUserId,idGolf)
                }
                
            }
        })
}

/*
*show comment without btn modification
*/
function createShowAvisAreas(json,currentUserId,idRestaurant = 0) {
    let startIcon = "";
    let rate= parseFloat(json.note) - Math.trunc(parseFloat(json.note));
    let rateYellow = rate * 100;
    let rateBlack= 100 - rateYellow;

    for(let i=0; i<4 ; i++  ){
        if(i<parseInt(json.note)){
            startIcon +=`<i class="fa-solid fa-star checked" style="color: rgb(245, 209, 101);"></i>`
        }else{
            if( rate != 0 ){
                startIcon += `<i class="fa-solid fa-star" data-rank="1" style ="background: linear-gradient(90deg, #F5D165 ${rateYellow}%, #000 ${rateBlack}%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;" }}"></i>`
                rate = 0;
            }else{
                startIcon += `<i class="fa-solid fa-star" data-rank="1"></i>`
            }
        }
    }

    let modalebtnModife

    if (screen.width <= 991) {
        modalebtnModife = `
        <div class="content_action">
            <button type="button" class="btn btn-outline-primary edit_avis" data-bs-dismiss="modal" data-bs-toggle="modal" data-bs-target="#modalAvisRestaurant${idRestaurant}" onclick="settingAvisRestoMobile(${idRestaurant},${currentUserId},'${json.id}' ,'${json.note}' , '${json.avis.replace('\n', '')}')">
                <i class="fa-solid fa-pen-to-square"></i>
            </button>
        </div>
    `
    } else {
         modalebtnModife = `
            <div class="content_action">
                <button type="button" class="btn btn-outline-primary edit_avis" data-bs-dismiss="modal" data-bs-toggle="modal" data-bs-target="#modalAvisRestaurant" onclick="settingAvisResto('${json.id}' ,'${json.note}' , '${json.avis.replace('\n', '')}')">
                    <i class="fa-solid fa-pen-to-square"></i>
                </button>
            </div>
        `
    }
    const spec_selector = (currentUserId == json.user.id && currentUserId!=null) ? "my_comment_jheo_js" : "";
    const editHTMl = modalebtnModife
    const  isOwnComment= (currentUserId == json.user.id ) ? editHTMl : "";

    const singleAvisHtml= `
        <div class="card mb-2 card_avis_resto_jheo_js ${spec_selector} " data-avis-note="${json.note}" data-avis-text="${json.avis}">
            <div class="card-body">
                <div class="avis_content">
                    <div>
                        <div class="d-flex justify-content-between align-items-start">
                            <div class="d-flex justify-content-between align-items-start">
                                <div class="content_profil_image me-2">
                                    <img class="profil_image" src="${ json.user.photo ? json.user.photo : '/public/uploads/users/photos/default_pdp.png' }" alt="User">
                                </div>
                                <div class="content_info">
                                    <h3 class="text-point-9"> <small class="fw-bolder text-black"> ${ json.user.fullname }</small></h3>
                                    <cite class="font-point-6"> ${ settingDateToStringMonthDayAndYear(json.datetime)}</cite>
                                </div>
                            </div>
                            <div class="content_start">
                                <p class="mb-2"> ${startIcon}</p>
                                ${isOwnComment}
                            </div>
                        </div>

                        <div class="mt-2">
                            <p class="text-point-9"> ${json.avis} </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
    document.querySelector(`.all_avis_jheo_js`).innerHTML += singleAvisHtml;
    if (idRestaurant != 0 && screen.width <= 991) {
        document.querySelector(`.all_avis_${idRestaurant}_jheo_js`).innerHTML += singleAvisHtml;
    }
    // else {
    //     document.querySelector(`.all_avis_jheo_js`).innerHTML += singleAvisHtml;
    // }
}

/**
 *  Update text content in parent element (ex: 12 avis)
 * @param {*} parent 
 * @param {*} nombre 
 */
function createNombreAvisContainer(parent,nombre) {
    parent.textContent= nombre+" avis"
}


function _kidMo(event) {
    const v=event.target.parentNode.parentNode.querySelector(".tnEmMeco").textContent
    const stars=event.target.parentNode.querySelectorAll(".lioTe >i.checked").length
   
    const targertTextArea=document.querySelector("#message-text-kidje3")

    targertTextArea.value=v

    document.querySelector("#text-note-modif").value=stars
   
}


/**
 * Get global note avis resto  and setting
 * @param {*} idGolf 
 */
function showNoteGlobale(idGolf, globalNote) { 
    fetch(`/avis/golf/global/${idGolf}`, {
        methode:"GET"
    }).then(r => r.json())
    .then(response => {
        let globalNote=0.00;
        let totalNote=0.00;
        if( response.length > 0 ){
            for (let avis of response) {
                totalNote+=parseFloat(avis["note"])
            }
            globalNote= totalNote /(response.length);
            createGlobalNote(globalNote)
        }
        // CURRENT_MAP_INSTANCE.showNoteGlobaleOnMarker(idGolf, globalNote)
    })
}


/**
 * Update note global star rating
 * @param {*} globalNote 
 */
function createGlobalNote(globalNote,idGolf) {
    let startHTML = "";
    let rate= globalNote - Math.trunc(globalNote);
    let rateYellow = rate * 100;
    let rateBlack= 100 - rateYellow;
    for(let i=0; i< 4; i++ ){
        if( i < Math.trunc(globalNote) ){
            startHTML += `<i class="fa-solid fa-star checked" style="color: rgb(245, 209, 101);"></i>`
        }else{
            if( rate != 0 ){
                startHTML += `<i class="fa-solid fa-star" data-rank="1" style ="background: linear-gradient(90deg, #F5D165 ${rateYellow}%, #000 ${rateBlack}%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;" }}"></i>`
                rate = 0;
            }else{
                startHTML += `<i class="fa-solid fa-star" data-rank="1"></i>`
            }
        }
    }
    if (screen.width <= 991) {
        document.querySelector(`.start_jheo_js${idGolf}`).innerHTML = startHTML;
    } else {
        document.querySelector(".start_jheo_js").innerHTML = startHTML;
    }    
    
}