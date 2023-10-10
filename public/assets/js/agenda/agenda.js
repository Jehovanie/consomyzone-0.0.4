document.addEventListener('DOMContentLoaded', function () {

    const request = new Request('/api/user/all_agenda', {
        method: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    })

    fetch(request)
        .then(response => response.json())
        .then(response => {
            const allAgenda = response.allAgenda;
            const agendaTab = [];

            const repasType = ['repas', 'dîné', 'déjeuné'];

            // console.log(allAgenda);

            allAgenda.forEach(agenda => {
                const { id, title, dateStart: start, dateEnd: end, timeStart: heureDebut, timeEnd: heureFin } = agenda;
                // const className=  repasType.some(item => item.includes(type.toLowerCase())) ? "repas": 'other_event';
                // var tomorrow = new Date(end);
                // tomorrow.setDate(tomorrow.getDate()+1)
                // console.log(tomorrow)
                //agendaTab.push({id, title, start : new Date(start), end: new Date(end), textColor: 'black'})
                let dateStartAgd = new Date(start)
                dateStartAgd = dateStartAgd.setHours(heureDebut.split(":")[0], heureDebut.split(":")[1], heureDebut.split(":")[2]);
                let dateEndAgd = new Date(end)
                dateEndAgd = dateEndAgd.setHours(heureFin.split(":")[0], heureFin.split(":")[1], heureFin.split(":")[2]);
                agendaTab.push({ id, title, start: dateStartAgd, end: dateEndAgd, textColor: 'black' })
            })
            // console.log(agendaTab)
            rendreCalendarWithEvents(agendaTab)
        })

});



if ('WebSocket' in window) {
    (function () {
        function refreshCSS() {
            var sheets = [].slice.call(document.getElementsByTagName("link"));
            var head = document.getElementsByTagName("head")[0];
            for (var i = 0; i < sheets.length; ++i) {
                var elem = sheets[i];
                var parent = elem.parentElement || head;
                parent.removeChild(elem);
                var rel = elem.rel;
                if (elem.href && typeof rel != "string" || rel.length == 0 || rel.toLowerCase() == "stylesheet") {
                    var url = elem.href.replace(/(&|\?)_cacheOverride=\d+/, '');
                    elem.href = url + (url.indexOf('?') >= 0 ? '&' : '?') + '_cacheOverride=' + (new Date().valueOf());
                }
                parent.appendChild(elem);
            }
        }
        var protocol = window.location.protocol === 'http:' ? 'ws://' : 'wss://';
        var address = protocol + window.location.host + window.location.pathname + '/ws';
        var socket = new WebSocket(address);
        socket.onmessage = function (msg) {
            if (msg.data == 'reload') window.location.reload();
            else if (msg.data == 'refreshcss') refreshCSS();
        };
        if (sessionStorage && !sessionStorage.getItem('IsThisFirstTime_Log_From_LiveServer')) {
            console.log('Live reload enabled.');
            sessionStorage.setItem('IsThisFirstTime_Log_From_LiveServer', true);
        }
    })();
} else {
    console.error('Upgrade your browser. This Browser is NOT supported WebSocket for Live-Reloading.');
}


///// CANCEL CREATE AGENDA ------------------------------------------------------
// if (document.querySelector(".cta_cancel_create_agenda_jheo_js") || document.querySelector(".btn_close_create_agenda_jheo_js")) {
//     const cta_cancel_create_agenda = [document.querySelector(".cta_cancel_create_agenda_jheo_js"), document.querySelector(".btn_close_create_agenda_jheo_js")];

//     cta_cancel_create_agenda.forEach(item => {
//         item.addEventListener("click", () => {
//             initInputForm()
              
//         })
//     })
// }

//// PUSH NEW AGENT -----------------------------------------------------------
// if (document.querySelector(".cta_confirm_create_agenda_jheo_js")) {

//     //// CHECK INPUT TYPE EVENT : IF 'REPAS' SHOW INPUT SEARCH RESTO
//     const handleTypeEvent = [document.querySelector(".inputOther_radio_jheo_js"), document.querySelector(".inputRepas_radio_jheo_js")];

//     handleTypeEvent.forEach(typeEvent => {

//         const content_inputTypeSelect = document.querySelector(".content_typeEventSelect_jheo_js");
//         const content_inputType = document.querySelector(".content_typeEvent_jheo_js");

//         typeEvent.addEventListener("change", () => {
//             if (typeEvent.classList.contains("inputOther_radio_jheo_js")) {
//                 if (content_inputType.classList.contains("d-none")) {
//                     content_inputType.classList.remove("d-none")

//                     document.querySelector(".typeEvent_jheo_js").value = null;
//                 }

//                 if (!content_inputTypeSelect.classList.contains("d-none")) {
//                     content_inputTypeSelect.classList.add("d-none")
//                 }

//                 if (!document.querySelector(".content_searchResto_jheo_js").classList.contains('d-none')) {
//                     document.querySelector(".content_searchResto_jheo_js").classList.add('d-none');
//                 }

//                 if (!document.querySelector(".content_restoEvent_jheo_js").classList.contains('d-none')) {
//                     document.querySelector(".content_restoEvent_jheo_js").classList.add('d-none');
//                     document.querySelector(".restoEvent_jheo_js").value = null
//                 }

//                 if (document.querySelector(".lieuEvent_jheo_js").hasAttribute('disabled')) {
//                     document.querySelector(".lieuEvent_jheo_js").removeAttribute('disabled');
//                     document.querySelector(".lieuEvent_jheo_js").value = null;
//                 }

//             } else {
//                 if (!content_inputType.classList.contains("d-none")) {
//                     content_inputType.classList.add("d-none")
//                 }

//                 if (content_inputTypeSelect.classList.contains("d-none")) {
//                     content_inputTypeSelect.classList.remove("d-none")
//                 }

//                 if (document.querySelector(".content_searchResto_jheo_js").classList.contains('d-none')) {
//                     document.querySelector(".content_searchResto_jheo_js").classList.remove('d-none')
//                 }

//                 document.querySelector(".typeEvent_jheo_js").value = "Repas déjeuné"
//             }
//         })
//     })

//     document.querySelector(".typeEventSelect_jheo_js").addEventListener("change", (e) => {
//         document.querySelector(".typeEvent_jheo_js").value = e.target.value
//     })


//     //// CHANGE EVENT FOR SEARCH RESTO
//     document.querySelector(".searchResto_jheo_js").addEventListener("keyup", (e) => {
//         if (parseInt(e.keyCode) === 13) {
//             if (document.querySelector(".searchResto_jheo_js").value != "") {

//                 /// afficher la liste des restos trouver
//                 bindActionSearchResto(document.querySelector(".searchResto_jheo_js").value);
//             }
//         }
//     })

//     ///// AFFICHER UNE LISTE DES RESTO
//     document.querySelector(".chose_pastil_resto_jheo_js").addEventListener("click", () => {

//         /// afficher la liste des restos pastiller
//         bindActionSearchResto("RESTO_PASTILLE");
//     })

//     document.querySelector(".cta_confirm_create_agenda_jheo_js").addEventListener("click", (e) => {

//         let state = true;

//         const agenda = {
//             "title": document.querySelector(".nameEvent_jheo_js").value,
//             "type": document.querySelector(".typeEvent_jheo_js").value,
//             "address": document.querySelector(".lieuEvent_jheo_js").value,
//             "desc": document.querySelector(".eventDesc_jheo_js").value,
//             "participant": document.querySelector(".nbrParticipant_jheo_js").value,
//             "dateStart": document.querySelector(".eventStart_jheo_js").value,
//             "dateEnd": document.querySelector(".eventEnd_jheo_js").value,
//             "timeStart": document.querySelector(".timeStart_jheo_js").value,
//             "timeEnd": document.querySelector(".timeEnd_jheo_js").value,
//         }

//         const agenda_keys = Object.keys(agenda);
//         agenda_keys.forEach(key => {
//             if (agenda[key] === '') {
//                 state = false;
//             }
//         })

//         if (!state) {
//             e.preventDefault()
//             console.log(agenda)
//             document.querySelector(".invalid_agenda_jheo_js").click();

//             setTimeout(() => {
//                 document.querySelector(".close_modal_invalid_agenda_jheo_js").click();
//             }, 1500);
//         } else {
//             sendNewAgenda(agenda)
//         }
//     })


//     document.querySelectorAll(".cta_close_list_resto_jheo_js").forEach(close => {
//         close.addEventListener("click", () => {
//             document.querySelectorAll(".list_tr_resto_jheo_js tr").forEach(tr => tr.remove())
//         })
//     })
// }


function rendreCalendarWithEvents(events) {

    var calendarEl = document.getElementById('calendar');
    if(typeof FullCalendar != "undefined"){
        var calendar = new FullCalendar.Calendar(calendarEl, {
            plugins: ['interaction', 'dayGrid'],
            themeSystem: 'bootstrap5',
            defaultDate: new Date(),
            editable: true,
            eventLimit: true, // allow "more" link when too many events
            displayEventTime: true,
            eventTimeFormat: {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            },
            displayEventEnd: {
                month: false,
                basicWeek: true,
                "default": true
            },
            events: events,
            dateClick: function (info) {
                bindEventForAllDay(info)
            },
            eventClick: function (info) {
                const id = info.event.id ? parseInt(info.event.id) : 0
                bindEventForAnEvent(id)
            },
        });
    
        calendar.render();
    }
    
}

function bindEventForAllDay(info) {
    const info_date = new Date(info.dateStr);
    const today = new Date();

    // if( info_date.getTime() >=  today.getTime()){
    // }

    document.querySelector(".eventStart_jheo_js").value = info.dateStr;
    document.querySelector(".eventEnd_jheo_js").value = info.dateStr;

    document.querySelector(".timeStart_jheo_js").value = '00:00';
    document.querySelector(".timeEnd_jheo_js").value = '23:00';

    ///show modal
    //document.querySelector('.show_modal_createAgenda_jheo_js').click()
    $("#createAgenda").modal("show")
    document.querySelector("#createOrEditBtn").disabled = false
    document.querySelector("#deleteAgendaBtn").disabled = false
    if (document.querySelector('#createOrEditBtn').textContent.toLowerCase().trim() == "modifier") {
        initInputForm()
    }

    document.querySelector(".preview_image_nanta_js").classList.add("d-none")
    document.querySelector("#image-preview").src = ""
    document.querySelector(".btnAddPhoto_nanta_js").classList.remove("d-none")

}

function bindEventForAnEvent(id) {
    if (id === 0) {
        showAlertMessageFlash('Evenement non trouvée!', 'danger')
        return 0;
    }


    const request = new Request(`/api/user/agenda/${id}`, {
        method: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    })

    fetch(request)
        .then(response => response.json())
        .then(response => {
            const agenda = response.agenda;
            setAndShowModal(agenda)
        })
}

function setAndShowModal(agenda) {
    console.log(agenda);
    $("#createAgenda").modal("show")
    $("#createOrEditBtn").text("Modifier")
    $("#modalCreateAgendaTitles").text("Modifier l'événement")
    document.querySelector('#createOrEditBtn').dataset.action = "update"
    document.querySelector('#createOrEditBtn').dataset.rank = agenda.id
    document.querySelector('#shareAgendaBtn').dataset.agenda = JSON.stringify(agenda)
    document.querySelector("#eventTitle").value = agenda.title
    document.querySelector("#typeEvent").value = agenda.type
    document.querySelector("#eventDesc").value = agenda.description

    if (document.querySelector("#deleteAgendaBtn").classList.contains("d-none")) {
        document.querySelector("#deleteAgendaBtn").classList.remove("d-none")
    }

    if (agenda.user_id == document.querySelector("#createOrEditBtn").dataset.usi) {
        document.querySelector("#createOrEditBtn").disabled = false
        document.querySelector("#deleteAgendaBtn").disabled = false
    }else{
        document.querySelector("#createOrEditBtn").disabled = true
        document.querySelector("#deleteAgendaBtn").disabled = true
    }

    if (document.querySelector("#shareAgendaBtn").classList.contains("d-none")) {
        document.querySelector("#shareAgendaBtn").classList.remove("d-none")
    }

    let nomEtab = document.querySelector("#containerNomEtab")
    let adresseContainer = document.querySelector(".lieuEventContainer")

    if (nomEtab.classList.contains("d-none")) {
        nomEtab.classList.remove("d-none")
    }

    if (adresseContainer.classList.contains("d-none")) {
        adresseContainer.classList.remove("d-none")
    }

    if(agenda.file_path){
        document.querySelector(".preview_image_nanta_js").classList.remove("d-none")
        document.querySelector("#image-preview").src = agenda.file_path
        document.querySelector(".btnAddPhoto_nanta_js").classList.add("d-none")
    }else{
        document.querySelector(".preview_image_nanta_js").classList.add("d-none")
        document.querySelector("#image-preview").src = ""
        document.querySelector(".btnAddPhoto_nanta_js").classList.remove("d-none")
    }

    if (agenda.isEtabCMZ) {

        nomEtab.querySelector("input").disabled = true

        adresseContainer.querySelector("input").disabled = true

        if (etabCMZ.classList.contains("d-none")) {
            etabCMZ.classList.remove("d-none")
        }

        if (agenda.isGolfCMZ) {
            document.querySelector("#golfRadio").checked = true
        } else {
            document.querySelector("#restoRadio").checked = true
        }

    } else {

        document.querySelector("#autreRadio").checked = true

        nomEtab.querySelector("input").disabled = false

        adresseContainer.querySelector("input").disabled = false

    }

    nomEtab.querySelector("input").value = agenda.name

    adresseContainer.querySelector("input").value = agenda.adresse

    document.querySelector("#nbrParticipant").value = agenda.max_participant

    document.querySelector("#eventStart").value = agenda.dateStart;

    document.querySelector("#eventEnd").value = agenda.dateEnd;

    document.querySelector("#timeStart").value = agenda.heure_debut;

    document.querySelector("#timeEnd").value = agenda.heure_fin;

}

function seletOtherEtab(isEtabCMZ){

    let nomEtab = document.querySelector("#containerNomEtab")
    let adresseContainer = document.querySelector(".lieuEventContainer")

    if(!isEtabCMZ){

        if (nomEtab.classList.contains("d-none")) {
            nomEtab.classList.remove("d-none")
        }
    
        if (adresseContainer.classList.contains("d-none")) {
            adresseContainer.classList.remove("d-none")
        }

        nomEtab.querySelector("input").value = ""

        adresseContainer.querySelector("input").value = ""
    
        nomEtab.querySelector("input").disabled = false
    
        adresseContainer.querySelector("input").disabled = false

    }else{

        if (!nomEtab.classList.contains("d-none")) {
            nomEtab.classList.add("d-none")
        }
    
        if (!adresseContainer.classList.contains("d-none")) {
            adresseContainer.classList.add("d-none")
        }

        nomEtab.querySelector("input").value = ""

        adresseContainer.querySelector("input").value = ""
    
        nomEtab.querySelector("input").disabled = true
    
        adresseContainer.querySelector("input").disabled = true

    }
}


function updateAgenda() {
    const array = [
        document.querySelector('.cta_update_agenda_jheo_js'),
        document.querySelector('.cta_cancel_edit_agenda_jheo_js'),
        document.querySelector('.content_input_view_agenda_jheo_js')
    ];

    if (array.some(item => item === null)) {
        console.log("Selector not found")
        return 0
    }

    const content_view_agenda = document.querySelector('.content_input_view_agenda_jheo_js')
    document.querySelector(".cta_update_agenda_jheo_js").addEventListener("click", () => {
        content_view_agenda.querySelectorAll("input").forEach(input => {
            if (input.hasAttribute("disabled") && !input.classList.contains("nbrParticipantCur_jheo_js")) {
                input.removeAttribute("disabled")
            }
        })

        const textArea = content_view_agenda.querySelector("textarea");
        if (textArea.hasAttribute("disabled")) {
            textArea.removeAttribute("disabled")
        }

        document.querySelector(".modal_title_event_jheo_js").innerText = "Modification d'une évenement"

        document.querySelector(".cta_update_agenda_jheo_js").innerText = 'Confirme la modification';

        const cta_cancel_edit = document.querySelector(".cta_cancel_edit_agenda_jheo_js");
        if (cta_cancel_edit.classList.contains("d-none")) {
            cta_cancel_edit.classList.remove("d-none");
        }
    })

    document.querySelector(".cta_cancel_edit_agenda_jheo_js").addEventListener("click", () => {
        content_view_agenda.querySelectorAll("input").forEach(input => {
            if (!input.hasAttribute("disabled")) {
                input.setAttribute("disabled", "")
            }
        })

        const textArea = content_view_agenda.querySelector("textarea");
        if (!textArea.hasAttribute("disabled")) {
            textArea.setAttribute("disabled", "")
        }

        document.querySelector(".modal_title_event_jheo_js").innerText = "Evenement"
        document.querySelector(".cta_update_agenda_jheo_js").innerText = 'Voulez-vous modifier?';

        const cta_cancel_edit = document.querySelector(".cta_cancel_edit_agenda_jheo_js");
        if (!cta_cancel_edit.classList.contains("d-none")) {
            cta_cancel_edit.classList.add("d-none");
        }
    })


    document.querySelector(".cta_delete_agenda_jheo_js").addEventListener("click", () => {
        const agendaID = document.querySelector(".cta_delete_agenda_jheo_js").getAttribute("data-agenda-id");
        if (!agendaID) {
            showAlertMessageFlash("Impossible de supprimer cette agenda parce que ce n'est pas vous qu'il a crée.", "danger");
        } else {
            document.querySelector(".confirm_delete_agenda_jheo_js").addEventListener("click", () => {
                deleteAgenda(parseInt(agendaID))
            })
        }
    })
}

function sendNewAgenda(agenda) {

    const param = {
        "name": agenda.title,
        "description": agenda.desc,
        "type": JSON.stringify({ "type": agenda.type, "code": 1 }),
        "confidentiality": agenda.confidentiality,
        "dateStart": agenda.dateStart,
        "dateEnd": agenda.dateEnd,
        "hourStart": agenda.timeStart,
        "hourEnd": agenda.timeEnd,
        "adresse": agenda.address,
        "participant": agenda.participant,
        "resto": agenda.resto,
        "resto": (document.querySelector(".restoEvent_jheo_js").value !== "") ? document.querySelector(".restoEvent_jheo_js").value : null,
        "confidentiality": 1,
        "fileType": null,
        "fileName": null,
    };

    // alert(JSON.stringify(param))
    const request = new Request('/user/tribu/new-agenda', {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(param)
    })

    fetch(request)
        .then(response => response.json())
        .then(response => {
            console.log(response);
            showAlertMessageFlash(response.message, "success", isReload = true);
        })
}


function setRestoAgenda(resto, element) {

    const classSuccess = "btn-info";
    const classDefault = "btn-outline-info";

    if (document.querySelector(".resto_pastiled_jheo_js")) {
        const pastiled = document.querySelector(".resto_pastiled_jheo_js");
        pastiled.classList.remove("resto_pastiled_jheo_js");

        pastiled.classList.remove(classSuccess);
        pastiled.classList.add(classDefault);
        pastiled.innerText = "Choisir"
    }

    if (element.classList.contains(classDefault)) {
        element.classList.remove(classDefault);
        element.classList.add(classSuccess);
        element.classList.add("resto_pastiled_jheo_js");

        element.innerText = 'Sélectionnée';
    }
    document.querySelector(".restoEvent_jheo_js").value = resto.name;
    document.querySelector(".lieuEvent_jheo_js").value = resto.adress;
    document.querySelector(".lieuEvent_jheo_js").setAttribute("disabled", "");

    if (document.querySelector(".content_restoEvent_jheo_js").classList.contains("d-none")) {
        document.querySelector(".content_restoEvent_jheo_js").classList.remove("d-none")
    }
}


function bindActionSearchResto(motCles) {
    document.querySelector(".listRestoModal_jheo_js").click();

    createChargement(document.querySelector(".content_chargement_jheo_js"), c = "chargement_content chargment_content_js_jheo")
    if (!document.querySelector(".content_list_resto_js").classList.contains("opacity_03")) {
        document.querySelector(".content_list_resto_js").classList.add("opacity_03")
    }

    let titleModal = (motCles === "RESTO_PASTILLE") ? "Liste des restaurants pastillés dans vos tribu Tribu T." : "Résultat de restaurant trouver"
    document.querySelector(".listResto_title_jheo_js").innerText = titleModal

    if (motCles === "RESTO_PASTILLE") {
        const request = new Request('/api/user/agenda/resto-pastille', {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })

        fetch(request)
            .then(response => response.json())
            .then(response => {
                if (!response.success) {
                    throw new Error(response.message);
                }

                const { results } = response;
                if (results.length > 0) {
                    results.forEach((resto, index) => {
                        createLinkRestoPastile(index, { id: resto.id_resto, name: resto.name, adress: resto.adress }, true)
                    });

                } else {
                    createLinkRestoPastile(0, { id: "", name: "", adress: "" }, false)
                }

                if (document.querySelector(".content_list_resto_js").classList.contains("opacity_03")) {
                    document.querySelector(".content_list_resto_js").classList.remove("opacity_03")
                }
                deleteChargement("chargement_content");

            })
        // .catch(error=> {
        //     console.log(error)
        // })
    }

    // ///open modal
    // document.querySelector(".listRestoModal_jheo_js").click();

}


function deleteAgenda() {

    swal({
        title: "Etes vous sûr de vouloir supprimer cet événement?",
        // text: "Agenda supprimé avec succès !",
        icon: "warning",
        buttons: true,
        dangerMode: true,
        // allowOutsideClick: false
    })
        .then((willDelete) => {

            if (willDelete) {

                const id = document.querySelector('#createOrEditBtn').dataset.rank

                const request = new Request('/user/tribu/delete-agenda', {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ agendaID: id })
                })

                fetch(request)
                    .then(response => response.json())
                    .then(response => {
                        $("#createAgenda").modal("hide")
                        document.querySelector("#createOrEditBtn").disabled = false
                        document.querySelector("#deleteAgendaBtn").disabled = false
                        swal("Bravo !", response.message, "success")
                            .then((value) => {
                                location.reload();
                            });
                    })
            }

        });
}


function createLinkRestoPastile(index, resto, isValid = true) {

    if (isValid) {
        const tr = document.createElement('tr');

        tr.innerHTML = `
          <th>${index + 1}</th>
          <td>${resto.name}</td>
          <td>${resto.adress.toLowerCase()}</td>
          <td><button type="button" class="btn btn-outline-info" onclick="setRestoAgenda({ name:'${resto.name}',adress:'${resto.adress.toLowerCase()}'} ,this)">Choisissez</button></td>
        `
        document.querySelector(".list_tr_resto_jheo_js").appendChild(tr)

    } else {
        document.querySelector(".list_tr_resto_jheo_js").innerHTML = `
            <div class="alert alert-secondary" role="alert">
                Vous n'avez pas encore des restaurants pastillées.
            </div>
        `
    }
}

/** BLOC NANTENAINA */

function activeOnglet(elem) {
    if (!elem.classList.contains("active")) {
        
        elem.classList.add("active")
        
        /*let cmzEtab = ""

        if (elem.dataset.name == "golf") {
            cmzEtab = "golf"
        } else if (elem.dataset.name == "restaurant") {
            cmzEtab = "restaurant"
        }*/

        let cmzEtab = document.querySelector("#hiddenListDep").dataset.etab

        if (elem.parentElement.nextElementSibling) {
            elem.parentElement.nextElementSibling.firstElementChild.classList.remove("active")
            makeLoading()
            getAllEtab(cmzEtab, false, elem)
        } else {
            elem.parentElement.previousElementSibling.firstElementChild.classList.remove("active")
            makeLoading()
            getAllEtab(cmzEtab, true, elem)
        }
    }
}

function getListEtabCMZ(element) {
    let tab = document.querySelectorAll("#smallNavInvitationDep > li > a")
    let cmzEtab = document.querySelector("#hiddenListDep").dataset.etab
    let tabEtab = document.querySelectorAll("#smallNavInvitation > li > a")
    if (tab[0].classList.contains("active")) {

        if (cmzEtab == "golf") {
            tabEtab[0].textContent = "Tous les golfs"
            tabEtab[1].textContent = "Golfs à faire"
        } else if (cmzEtab == "restaurant") {
            tabEtab[0].textContent = "Tous les restaurants"
            tabEtab[1].textContent = "Restaurants pastillés"
        }

        $("#listDepModal").modal("hide")

        tabEtab[0].dataset.id = element.dataset.id

        tabEtab[0].dataset.name = cmzEtab

        tabEtab[1].dataset.id = element.dataset.id

        tabEtab[1].dataset.name = cmzEtab

        if (element.dataset.id != "75" || cmzEtab == "golf") {

            $("#listRestoOrGolfModal").modal("show")
            makeLoading()
            getAllEtab(cmzEtab, false, element)

        } else {
            $("#listArrondissement").modal("show")
            makeLoading()
            let container = document.querySelector(".container_list_arron")
            getListArrondissement(container, "75")
        }

    } else {

        if (cmzEtab == "golf") {
            tabEtab[0].textContent = "Tous les golfs"
            tabEtab[1].textContent = "Golfs à faire"
        } else if (cmzEtab == "restaurant") {
            tabEtab[0].textContent = "Tous les restaurants"
            tabEtab[1].textContent = "Restaurants pastillés"
        }

        $("#listDepModal").modal("hide")

        tabEtab[0].dataset.id = element.dataset.id

        tabEtab[0].dataset.name = cmzEtab

        tabEtab[1].dataset.id = element.dataset.id

        tabEtab[1].dataset.name = cmzEtab

        $("#listRestoOrGolfModal").modal("show")

        getAllEtab(cmzEtab, true, element)

    }
}

function activeOngletForDep(elem) {
    if (!elem.classList.contains("active")) {
        elem.classList.add("active")
        let cmzEtab = ""
        if (elem.textContent.toLowerCase().includes("golf")) {
            cmzEtab = "golf"
        } else if (elem.textContent.toLowerCase().includes("restaurant")) {
            cmzEtab = "restaurant"
        }

        let hiddenEtab = document.querySelector("#hiddenListDep")

        hiddenEtab.dataset.etab = cmzEtab

        if (elem.parentElement.nextElementSibling) {
            elem.parentElement.nextElementSibling.firstElementChild.classList.remove("active")
        } else {
            elem.parentElement.previousElementSibling.firstElementChild.classList.remove("active")
        }

    }
}

function selectEtab(e) {

    let etabCMZ = document.querySelector("#etabCMZ")
    let nomEtab = document.querySelector("#containerNomEtab")
    let adresseContainer = document.querySelector(".lieuEventContainer")

    if (e.target.value == 1) {

        nomEtab.querySelector("input").disabled = true

        adresseContainer.querySelector("input").disabled = true

        if (!nomEtab.classList.contains("d-none")) {
            nomEtab.classList.add("d-none")
        }

        if (etabCMZ.classList.contains("d-none")) {
            etabCMZ.classList.remove("d-none")
        }

        if (!adresseContainer.classList.contains("d-none")) {
            adresseContainer.classList.add("d-none")
        }

    } else if (e.target.value == 2) {

        nomEtab.querySelector("input").disabled = false

        adresseContainer.querySelector("input").disabled = false

        if (!etabCMZ.classList.contains("d-none")) {
            etabCMZ.classList.add("d-none")
        }

        if (nomEtab.classList.contains("d-none")) {
            nomEtab.classList.remove("d-none")
        }

        if (adresseContainer.classList.contains("d-none")) {
            adresseContainer.classList.remove("d-none")
        }

        document.querySelector("#containerNomEtab > input").value = ""

        adresseContainer.querySelector("input").value = ""

    } else {
        alert("Il y a eu une erreur !");
    }
}

/**
 * showing list departement
 * @param {*} radio 
 */
function showDepModal() {

    seletOtherEtab(true)

    let container = document.querySelector('.container_list_dep')

    let cmzEtab = "restaurant"

    let navLinksModal = document.querySelectorAll("#smallNavInvitationDep > li > a")

    let tabEtab = document.querySelectorAll("#smallNavInvitation > li > a")

    if (!tabEtab[0].classList.contains("active")) {
        tabEtab[0].classList.add("active")
        tabEtab[1].classList.remove("active")
    }

    activeOngletForDep(navLinksModal[0])

    navLinksModal[0].textContent = "Tous les restaurants"
    navLinksModal[1].textContent = "Restaurants pastillés"

    $("#createAgenda").modal("hide")

    document.querySelector("#createOrEditBtn").disabled = false
    document.querySelector("#deleteAgendaBtn").disabled = false

    getListDep(container)

    document.querySelector("#hiddenListDep").dataset.etab = cmzEtab

    $("#listDepModal").modal("show")

    makeLoading()

}

function showDepModalGol() {

    seletOtherEtab(true)

    let container = document.querySelector('.container_list_dep')

    let cmzEtab = "golf"

    let navLinksModal = document.querySelectorAll("#smallNavInvitationDep > li > a")

    let tabEtab = document.querySelectorAll("#smallNavInvitation > li > a")

    if (!tabEtab[0].classList.contains("active")) {
        tabEtab[0].classList.add("active")
        tabEtab[1].classList.remove("active")
    }

    activeOngletForDep(navLinksModal[0])


    navLinksModal[0].textContent = "Tous les golfs"
    navLinksModal[1].textContent = "Golfs à faire"

    $("#createAgenda").modal("hide")

    document.querySelector("#createOrEditBtn").disabled = false
    document.querySelector("#deleteAgendaBtn").disabled = false
    
    getListDep(container)

    document.querySelector("#hiddenListDep").dataset.etab = cmzEtab

    $("#listDepModal").modal("show")

    makeLoading()

}

/**
 * get restaurant by codinsee (dep 75)
 * @param {*} element 
 */
function getEtabByCodeinse(element) {

    let id_dep = encodeURIComponent(element.dataset.dpt)
    let codinsee = encodeURIComponent(element.dataset.cds);

    let request = new Request(`/api/user/agenda/arrondissement/restaurant/codeinse?id_dep=${id_dep}&codinsee=${codinsee}`, {
        method: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })

    let tabEtab = document.querySelectorAll("#smallNavInvitation > li > a")

    if (tabEtab[1].classList.contains("active")) {
        tabEtab[1].classList.remove("active")
        tabEtab[0].classList.add("active")
    }

    let initTable = `<table class="table table-striped" id="tableEtabCMZ">
                        <thead>
                        <tr>
                            <th scope="col">Nom</th>
                            <th scope="col">Adresse</th>
                            <th scope="col">Téléphone</th>
                            <th scope="col">Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        
                        </tbody>
                    </table>`
    document.querySelector(".list_resto_or_golf").innerHTML = initTable
    fetch(request)
        .then(response => response.json())
        .then(response => {

            const results = response;
            let turnOffLogo=false
            $("#listArrondissement").modal("hide")

            $("#listRestoOrGolfModal").modal("show")

            document.querySelector("#tableEtabCMZ").style.width = "100%"

            if (results.length > 0) {
                results.forEach((etablissement, index) => {
                   if (etablissement.tribu) {
                        turnOffLogo=true
                        document.querySelector("#tableEtabCMZ > tbody").appendChild(generateTableForEtab(index,
                            {
                                id: etablissement.id_etab,
                                nom: etablissement.name,
                                adresse: etablissement.adresse,
                                tel: etablissement.tel,
                                tribu: etablissement.tribu,
                                logoTribu: etablissement.logoTribu,
                                departement: etablissement.departement,
                                dep: etablissement.dep,
                                id_etab: etablissement.id_etab
                            }, true))

                    } else {
                        turnOffLogo=false
                        document.querySelector("#tableEtabCMZ > tbody").appendChild(
                            generateTableForEtab(index, {
                                id: etablissement.id_etab,
                                nom: etablissement.name,
                                adresse: etablissement.adresse,
                                tel: etablissement.tel,
                                departement: etablissement.departement,
                                dep: etablissement.dep,
                                id_etab: etablissement.id_etab
                            }, true))

                        // document.querySelector("#tableEtabCMZ > tbody").appendChild(v)
                    }
                });
                document.querySelector(".list_resto_or_golf").style.display = "block";

                generateDataTable("#tableEtabCMZ", 3,turnOffLogo)


            } else {
                document.querySelector(".list_resto_or_golf").style.display = "block";
                generateTableForEtab(0, { id: "", nom: "", adresse: "" }, false)
            }

            if (document.querySelector(".list_resto_or_golf").classList.contains("opacity_03")) {
                document.querySelector(".list_resto_or_golf").classList.remove("opacity_03")
            }

            deleteChargement("chargement_content");

        })

}

/**
 * Show all restaurant after you choose departement
 * @param {*} etab 
 * @param {*} isPast 
 * @param {*} element 
 */
function getAllEtab(etab, isPast, element) {

    let request = "";
    let id = element.dataset.id

    let tabEtab = document.querySelectorAll("#smallNavInvitation > li > a")
    if (isPast) {
        if(id !=""){
            request = new Request(`/api/user/agenda/get/${etab}/pastille/dep/${id}`, {
                method: "GET",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
            })
            console.log("id: "+id)
        }else{
            console.log("id: Tsisy")
            request = new Request(`/api/user/agenda/get/${etab}/pastille`, {
                method: "GET",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
            })
        }
        if (!tabEtab[1].classList.contains("active")) {
            tabEtab[1].classList.add("active")
            tabEtab[0].classList.remove("active")
        }
    } else {
        if(id !=""){
            request = new Request(`/api/user/agenda/get/${etab}/dep/${id}`, {
                method: "GET",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
            })
        }else{
            request = new Request(`/api/user/agenda/get/all/${etab}`, {
                method: "GET",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
            })
        }
        if (!tabEtab[0].classList.contains("active")) {
            tabEtab[0].classList.add("active")
            tabEtab[1].classList.remove("active")
        }
    }
    let initTable = `<table class="table table-striped" id="tableEtabCMZ">
                        <thead>
                            <tr>
                                <th scope="col">Nom</th>
                                <th scope="col">Adresse</th>
                                <th scope="col">Téléphone</th>
                                <th scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody></tbody>
                    </table>`
    document.querySelector(".list_resto_or_golf").innerHTML = initTable
    fetch(request)
        .then(response => response.json())
        .then(response => {
            if (!response.success)
                throw new Error(response.message);
            const { results } = response;
            let turnOffLogo=false
            if (results.length > 0) {
                results.forEach((etablissement, index) => {
                    console.log(etablissement[0])
                    if (etablissement.tribu) {
                        turnOffLogo=true
                        document.querySelector("#tableEtabCMZ > tbody").appendChild(
                            generateTableForEtab(index,
                                {
                                    id: etablissement.id_etab,
                                    nom: etablissement.name,
                                    adresse: etablissement.adresse,
                                    tel: etablissement.tel,
                                    tribu: etablissement.tribu,
                                    logoTribu: etablissement.logoTribu,
                                    departement: etablissement.departement,
                                    dep: etablissement.dep,
                                    id_etab: etablissement.id_etab
                                }, true))
                    } else {
                        turnOffLogo=false
                        
                        if(etab=== "golf"){
                            let status="Pas encore pastillé";
                            if(etablissement[0])
                             status = etablissement[0].afaire === 1 ? "à faire" : etablissement[0].fait === 1 ? "fait" : "Pas encore pastillé"
                            document.querySelector("#tableEtabCMZ > tbody").appendChild(
                                generateTableForEtab(index, {
                                    id: etablissement.id_etab,
                                    nom: etablissement.name,
                                    adresse: etablissement.adresse,
                                    tel: etablissement.tel,
                                    departement: etablissement.departement,
                                    dep: etablissement.dep,
                                    id_etab: etablissement.id_etab,
                                    status:status
                                }, true))
                        }else{
                            document.querySelector("#tableEtabCMZ > tbody").appendChild(
                                generateTableForEtab(index, {
                                    id: etablissement.id_etab,
                                    nom: etablissement.name,
                                    adresse: etablissement.adresse,
                                    tel: etablissement.tel,
                                    departement: etablissement.departement,
                                    dep: etablissement.dep,
                                    id_etab: etablissement.id_etab
                                }, true))
                        }
                    }
                });
                document.querySelector(".list_resto_or_golf").style.display = "block";
                generateDataTable("#tableEtabCMZ", 3,turnOffLogo)
            } else {
                document.querySelector(".list_resto_or_golf").style.display = "block";
                generateTableForEtab(0, { id: "", nom: "", adresse: "" }, false)
            }

            if (document.querySelector(".list_resto_or_golf").classList.contains("opacity_03")) {
                document.querySelector(".list_resto_or_golf").classList.remove("opacity_03")
            }
            deleteChargement("chargement_content");
        })

}

function generateTableForEtab(index, etab, isValid = true) {

    if (isValid) {
        let forTribuT = "";
        let tr = document.createElement("tr")
        if (etab.tribu && etab.tribu != null) {

            if (!document.querySelector(".forTribu")) {

                const thForLogo = document.createElement("th");

                thForLogo.classList.add("forLogo")

                const textNodeLogo = document.createTextNode("Logo");

                thForLogo.appendChild(textNodeLogo);

                const thForTribu = document.createElement("th");

                thForTribu.classList.add("forTribu")

                const textNodeTribu = document.createTextNode("TribuT");

                thForTribu.appendChild(textNodeTribu);

                // Insert before existing child:
                const thead = document.querySelector("#tableEtabCMZ > thead > tr");

                thead.insertBefore(thForTribu, thead.children[0]);

                thead.insertBefore(thForLogo, thead.children[0]);

            }

            nomTribu = etab.tribu.replace(/tribu_t_[0-9]+_/, "").replaceAll("_", " ")
            nomTribu = nomTribu.charAt(0).toUpperCase() + nomTribu.slice(1)
            // logoTribu = etab.logoTribu ? "/public/" + etab.logoTribu : "/public/uploads/tribu_t/photo/avatar_tribu.jpg";
            logoTribu = etab.logoTribu ? etab.logoTribu : "/uploads/tribu_t/photo/avatar_tribu.jpg";

            forTribuT = `<td><img src="${logoTribu}" alt="" style="max-height: 30px; max-width: 30px;"></td><td>${nomTribu}</td>`;

            let tdTribu = document.createElement("td")
            tdTribu.textContent = nomTribu
            let tdLogo = document.createElement("td")
            let imgTribu = document.createElement("img")
            imgTribu.setAttribute("src", logoTribu)
            imgTribu.setAttribute("style", "max-height: 100px; max-width: 100px;clip-path: circle(40%);")
            tdLogo.appendChild(imgTribu)
            tr.appendChild(tdLogo)
            tr.appendChild(tdTribu)

        } else {

            if (document.querySelector(".forLogo"))
                document.querySelector(".forLogo").remove()

            if (document.querySelector(".forTribu"))
                document.querySelector(".forTribu").remove()
        }

        if(etab.status){
            if (!document.querySelector(".forGolfStatus")) {

                const forGolfStatus = document.createElement("th");

                forGolfStatus.classList.add("forGolfStatus")

                const textNodeStatus = document.createTextNode("Status");

                forGolfStatus.appendChild(textNodeStatus);

                // Insert before existing child:
                const thead = document.querySelector("#tableEtabCMZ > thead > tr");

                thead.insertBefore(forGolfStatus, thead.children[0]);

            }

          

            let tdStatus = document.createElement("td")
            tdStatus.textContent =etab.status
            tr.appendChild(tdStatus)
        }else{
            if (document.querySelector(".forGolfStatus"))
                document.querySelector(".forGolfStatus").remove()
        }

        let tdDataName = document.createElement("td")
        tdDataName.textContent = etab.nom
       
        let tdDataAdresse = document.createElement("td")
        tdDataAdresse.textContent = etab.adresse.toLowerCase()
        let tdDatel = document.createElement("td")
        tdDatel.textContent = etab.tel
        let tdAction = document.createElement("td")
        let btnDetails = document.createElement("button")
        btnDetails.dataset.name = etab.nom
        btnDetails.dataset.adresse = etab.adresse.toLowerCase()
        btnDetails.setAttribute("type", "button")
        btnDetails.setAttribute("class", "btn btn-outline-primary btn-sm")
        btnDetails.setAttribute("onclick", `showEtabDetail(event, '${etab.departement}', '${etab.dep}', '${etab.id_etab}')`)
        btnDetails.textContent = "Détail"
        let btnCheck = document.createElement("button")
        btnCheck.setAttribute("type", "button")
        btnCheck.setAttribute("class", "btn btn-outline-info btn-sm")
        btnCheck.setAttribute("onclick", `setNameOrAdresseForEtab({ name:"${etab.nom}",adress:"${etab.adresse.toLowerCase()}"} ,this)`)
        btnCheck.textContent = "Choisir"
        btnCheck.dataset.idetab = etab.id_etab
        tr.appendChild(tdDataName)
        tr.appendChild(tdDataAdresse)
        tr.appendChild(tdDatel)
        tdAction.appendChild(btnDetails)
        tdAction.appendChild(btnCheck)
        tr.appendChild(tdAction)
        return tr;

    } else {
        document.querySelector(".list_resto_or_golf > table > tbody").innerHTML = `
            <td colspan="4" class="text-center">Aucun résultat</td>
            `
    }
}

function setNameOrAdresseForEtab(etab, element) {

    const classSuccess = "btn-info";
    const classDefault = "btn-outline-info";

    if (document.querySelector(".resto_pastiled_jheo_js")) {
        const pastiled = document.querySelector(".resto_pastiled_jheo_js");
        pastiled.classList.remove("resto_pastiled_jheo_js");

        pastiled.classList.remove(classSuccess);
        pastiled.classList.add(classDefault);
        pastiled.innerText = "Choisir"
    }

    if (element.classList.contains(classDefault)) {
        element.classList.remove(classDefault);
        element.classList.add(classSuccess);
        element.classList.add("resto_pastiled_jheo_js");

        element.innerText = 'Sélectionnée';
    }

    let cmzEtab = document.querySelector("#hiddenListDep").dataset.etab

    if(cmzEtab == "golf"){
        const request = new Request("/user/setGolf/todo", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'  
            },
            body: JSON.stringify({
                golfID : element.dataset.idetab,
            })
        })

        fetch(request)
        .then(response=>response.json())
        .then(response =>{
            if( response.success){
                new swal("Bravo !","Vous avez marqué ce golf comme à faire !", "success")
                    .then((value) => {
                        
                    });  
            }
        })
    }

    document.querySelector("#nomEtabEvent").value = etab.name;

    document.querySelector("#lieuEvent").value = etab.adress;

    if (document.querySelector("#containerNomEtab").classList.contains("d-none")) {
        document.querySelector("#containerNomEtab").classList.remove("d-none")
    }

    if (document.querySelector("#containerAdresseEtab").classList.contains("d-none")) {
        document.querySelector("#containerAdresseEtab").classList.remove("d-none")
    }
}

function makeLoading() {
    let containerChargement = document.createElement("div")
    containerChargement.classList.add("chargement_content")
    containerChargement.classList.add("content_chargement_nanta_js")
    containerChargement.classList.add("mt-3")
    containerChargement.classList.add("mb-3")
    document.querySelector(".container_list").appendChild(containerChargement)

    createChargement(document.querySelector(".content_chargement_nanta_js"), c = "chargement_content content_chargement_nanta_js")

    if (!document.querySelector(".list_resto_or_golf").classList.contains("opacity_03")) {
        document.querySelector(".list_resto_or_golf").classList.add("opacity_03")
    }
}

/**
 * @author NANTENAINA
 * create new egenda
 * @param {*} agenda 
 */
function saveNewAgenda(agenda) {

    const param = {
        "title": agenda.title,
        "type": agenda.type,
        "isEtabCMZ": agenda.isEtabCMZ,
        "isGolfCMZ": agenda.isGolfCMZ,
        "isRestoCMZ": agenda.isRestoCMZ,
        "name": agenda.name,
        "adresse": agenda.adresse,
        "description": agenda.description,
        "participant": agenda.participant,
        "place_libre":agenda.place_libre,
        "dateStart": agenda.dateStart,
        "dateEnd": agenda.dateEnd,
        "timeStart": agenda.timeStart,
        "timeEnd": agenda.timeEnd,
        "fileType": agenda.fileType,
        "fileName": agenda.fileName,
        "base64": agenda.base64,
        "directoryroot": agenda.directoryroot,
        "confidentiality": 1,
    };

    let request = ""

    let action = document.querySelector('#createOrEditBtn').dataset.action

    if (action.toLowerCase().trim() == "create") {
        request = new Request('/user/tribu/new-agenda', {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(param)
        })
    } else if (action.toLowerCase().trim() == "update") {
        let agendaId = document.querySelector('#createOrEditBtn').dataset.rank
        // alert("agendaId : " + agendaId)
        request = new Request(`/user/tribu/update-agenda/${agendaId}`, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(param)
        })
    } else {
        alert("il y a eu une erreur !")
    }

    fetch(request)
        .then(response => response.json())
        .then(response => {
            swal("Bravo !", response.message, "success")
                .then((value) => {
                    location.reload();
                });
        })
}

function getObjectForNewAgenda(e) {

    let state = true;

    let isEtabCMZ = false

    let isGolfCMZ = document.querySelector("#golfRadio").checked ? true : false

    let isRestoCMZ = document.querySelector("#restoRadio").checked ? true : false

    if (isGolfCMZ || isRestoCMZ) {
        isEtabCMZ = true
    }

    let fileType = null
    let fileName = null
    let base64 = null
    let directoryroot = null

    if(document.querySelector(".preview_image_nanta_js") && !document.querySelector(".preview_image_nanta_js").classList.contains("d-none")){
        let img = document.querySelector("#image-preview")
        fileType = img.getAttribute("typefile")
        base64 = img.getAttribute("src")
        fileName = img.getAttribute("name")
        directoryroot = img.getAttribute("directoryroot")
    }

    const agenda = {
        "title": document.querySelector("#eventTitle").value,
        "type": document.querySelector("#typeEvent").value,
        "isEtabCMZ": isEtabCMZ,
        "isGolfCMZ": isGolfCMZ,
        "isRestoCMZ": isRestoCMZ,
        "name": document.querySelector("#nomEtabEvent").value,
        "adresse": document.querySelector("#lieuEvent").value,
        "description": document.querySelector("#eventDesc").value,
        "participant": document.querySelector("#nbrParticipant").value,
        "place_libre": document.querySelector("#nbrParticipant").value,
        "dateStart": document.querySelector("#eventStart").value,
        "dateEnd": document.querySelector("#eventEnd").value,
        "timeStart": document.querySelector("#timeStart").value,
        "timeEnd": document.querySelector("#timeEnd").value,
        "fileType": fileType,
        "base64": base64,
        "directoryroot": directoryroot,
        "fileName": fileName,
    }

    console.log(agenda);

    const agenda_keys = Object.keys(agenda);
    agenda_keys.forEach(key => {
        if (agenda[key] === '') {
            state = false;
        }
    })

    if (!state) {
        e.preventDefault()
        console.log(agenda)
        document.querySelector(".invalid_agenda_jheo_js").click();

        setTimeout(() => {
            document.querySelector(".close_modal_invalid_agenda_jheo_js").click();
        }, 1500);
    } else {
        saveNewAgenda(agenda)
    }
}

/**
 * got and show list of departement
 * @param {*} container 
 */
function getListDep(container) {



    const request = new Request('/api/user/agenda/dep/list')

    fetch(request)
        .then(res => res.text()).then(html => {
            container.innerHTML = html;
            generateDataTable("#tableListDepCMZ", 2)
        });

}

function getListArrondissement(container, dep) {

    const request = new Request('/api/user/agenda/arrondissement/list/' + dep)

    fetch(request)
        .then(res => res.text()).then(html => {
            container.innerHTML = html;

        });

}

function showEtabDetail(event,nom_dep, id_dep, id_etab) {

    let etab = document.querySelector("#hiddenListDep").dataset.etab
    
    const request = new Request(`/api/agenda/${etab}/${nom_dep}/${id_dep}/detail/${id_etab}`)

    fetch(request)
        .then(res => res.text()).then(html => {
            $("#listRestoOrGolfModal").modal("hide")
            $("#detailEtabModal").modal("show")
            //content_titre_details
            let dataName = event.target.dataset.name
            let dataAdresse = event.target.dataset.adresse
            document.querySelector(".content_etab_detail").innerHTML = `<div>
                                        <div class="mb-2">
                                            <span class="mt-2 ms-3"><b>${dataName}</b></span>
                                        </div>
                                        <p style="text-align:padding-left:4% !important;">
                                            <a href="#" class="small" style="margin-left:4%#19a8d8 !important;">
                                                ${dataAdresse}
                                            </a>
                                        </p>
                                    </div>`
            document.querySelector("#detailEtabModal .modal-body").innerHTML = html
        });
    
}

function initInputForm() {

    const all_input = document.querySelectorAll('.content_input_create_agenda_jheo_js input')

    all_input.forEach(j => {
        if (j.value !== null) {
            j.value = null;
        }
    })

    $("#createOrEditBtn").text("Créer")

    $("#modalCreateAgendaTitles").text("Créer un événement")

    document.querySelector('#createOrEditBtn').dataset.action = "create"

    document.querySelector('.eventDesc_jheo_js').value = null

    // document.querySelector("#etabSelectOptions").value = 1

    document.querySelector("#golfRadio").checked = false
    document.querySelector("#autreRadio").checked = false
    document.querySelector("#restoRadio").checked = false

    let nomEtab = document.querySelector("#containerNomEtab")
    let adresseContainer = document.querySelector(".lieuEventContainer")

    /*let cmzEtab = document.querySelector("#etabCMZ")

    if (cmzEtab.classList.contains("d-none")) {
        cmzEtab.classList.remove("d-none")
    }*/

    if (!nomEtab.classList.contains("d-none")) {
        nomEtab.classList.add("d-none")
    }

    if (!adresseContainer.classList.contains("d-none")) {
        adresseContainer.classList.add("d-none")
    }

    if (!document.querySelector("#deleteAgendaBtn").classList.contains("d-none")) {
        document.querySelector("#deleteAgendaBtn").classList.add("d-none")
    }

    if (!document.querySelector("#shareAgendaBtn").classList.contains("d-none")) {
        document.querySelector("#shareAgendaBtn").classList.add("d-none")
    }
}

if(document.querySelector("#shareAgendaBtn")){
    document.querySelector("#shareAgendaBtn").addEventListener("click", (e)=>{
        e.preventDefault()
        sessionStorage.setItem("agenda", e.target.dataset.agenda);
    })
}

/** END BLOC */

function tableActiveFilterPartisant(e) {
    const allTypeActive = ["list_partisant_tribuG_jheo_js", "list_partisant_tribuT_jheo_js", "list_partisant_emailing_jheo_js"];
    const current_class_active = allTypeActive.find(item => e.classList.contains(item))
    const other_not_active = allTypeActive.filter(item => item != current_class_active)

    if (!e.classList.contains("active")) {
        e.classList.add("active")
    }

    if (e.classList.contains("agenda-emailing")) {
        document.querySelector("#agenda-emailing").style.display = "block"
        document.querySelector("#agenda-tribu-g").style.display = "none"
        document.querySelector("#agenda-tribu-t").style.display = "none"
    }else if(e.classList.contains("agenda-tribu-g")){
        document.querySelector("#agenda-tribu-g").style.display = "block"
        document.querySelector("#agenda-emailing").style.display = "none"
        document.querySelector("#agenda-tribu-t").style.display = "none"
    }else{
        document.querySelector("#agenda-tribu-g").style.display = "none"
        document.querySelector("#agenda-emailing").style.display = "none"
        document.querySelector("#agenda-tribu-t").style.display = "block"

    }

    other_not_active.forEach(item => {
        if (document.querySelector(`.${item}`).classList.contains("active")) {
            document.querySelector(`.${item}`).classList.remove("active")
        }
    })
}

if (document.querySelector('#list-tribu-partage-agenda')) {
    new DataTable('#list-tribu-partage-agenda');

    $('#list-tribu-partage-agenda').DataTable({
        language: {
            url: '//cdn.datatables.net/plug-ins/1.13.4/i18n/fr-FR.json',
            "search": "Recherche global",

        },})
}
if (document.querySelector('#list-tribu-g-partage-agenda')) {
    // new DataTable('#list-tribu-g-partage-agenda');
    $('#list-tribu-g-partage-agenda').DataTable({
        language: {
            url: '//cdn.datatables.net/plug-ins/1.13.4/i18n/fr-FR.json',
            "search": "Recherche global",
            "emptyTable": "Aucun partisan à part vous dans ce tribu",

        },})
}
if (document.querySelector('#list-tribu-t-partage-agenda')) {
    // new DataTable('#list-tribu-t-partage-agenda');
    $('#list-tribu-t-partage-agenda').DataTable({
        language: {
            url: '//cdn.datatables.net/plug-ins/1.13.4/i18n/fr-FR.json',
            "search": "Recherche global",

        },})
}

if (document.querySelector('#list-partisans-tribu-selection')) {
    // new DataTable('#list-partisans-tribu-selection');
    $('#list-partisans-tribu-selection').DataTable({
        language: {
            url: '//cdn.datatables.net/plug-ins/1.13.4/i18n/fr-FR.json',
            "search": "Recherche global",

        },})
}

function selectAll(source) {
    var checkboxes = document.querySelectorAll('.select-oui');
    for (var i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i] != source)
            checkboxes[i].checked = source.checked;
    }

}

function selectAllPartisan(source,isG) {

    if(isG){
        var checkboxes = document.querySelectorAll('.select-tribu-g-oui');

        if(checkboxes.length > 0){
            for (var i = 0; i < checkboxes.length; i++) {
                if (checkboxes[i] != source)
                    checkboxes[i].checked = source.checked;
            }
    
            if(source.checked){
                document.querySelector("#shareAgendaForPartisan").classList.remove("btn-second-primary")
            }else{
                document.querySelector("#shareAgendaForPartisan").classList.add("btn-second-primary")
            }
        }else{
            document.querySelector("#shareAgendaForPartisan").classList.add("btn-second-primary")
        }


    }else{
        var checkboxes = document.querySelectorAll('.select-tribu-t-oui');

        if(checkboxes.length > 0){

            for (var i = 0; i < checkboxes.length; i++) {
                if (checkboxes[i] != source)
                    checkboxes[i].checked = source.checked;
            }
    
            if(source.checked){
                document.querySelector("#shareBtnTribuTForPart").classList.remove("btn-second-primary")
            }else{
                document.querySelector("#shareBtnTribuTForPart").classList.add("btn-second-primary")
            }
        }else{
            document.querySelector("#shareBtnTribuTForPart").classList.add("btn-second-primary")
        }
    }
    

}


/**
 * generate table for partisan tribu t
 * @param {*-} tribu_t_name 
 */
function showPartisanAgenda(tribu_t_name) {

    document.querySelector("#shareBtnTribuTForPart").classList.add("btn-second-primary")

    document.querySelector("#list-partisans-tribu-t-partage-agenda").innerHTML = `<table id="list-partisans-tribuT" class="table table-striped">
                        <thead>
                            <tr>
                                <th scope="col">Profil</th>
                                <th scope="col">Nom</th>
                                <th scope="col">Prénom</th>
                                <th scope="col">Email</th>
                                <th scope="col">Rôle</th>
                                <th scope="col">
                                    <input type="checkbox" class="selectTribuTAll" name="selectionner" id="selectTribuTAll" onchange="selectAllPartisan(this,false)"> 
                                    <label for="selectionner">Sélectionnée tout</label></th>
                                </th>
      
                            </tr>
                        </thead>
                        <tbody id="list-partisans-tribu-t-agenda">
      
                        </tbody>
                      </table>`

    const param = "?tbl_tribu_T_name=" + encodeURIComponent(tribu_t_name)
    console.log(param)
    const request = new Request("/user/partisan/tribu_T" + param, {
        method: "GET",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
    })
    fetch(request).then((response) => {
        if (response.ok && response.status == 200) {
            response.json().then(jsons => {
                jsons[0].forEach(json => {

                    if(jsons["curent_user"] != json.id){
                        
                        profilInfo = JSON.parse(json.infos_profil)
                        let profil = profilInfo.photo_profil != null ? profilInfo.photo_profil : "/assets/image/img_avatar3.png"
                        let lastName = profilInfo.lastName
                        let firstName = profilInfo.firstName
                        let tribuG = profilInfo.tribuG.replace("tribug_01_", "")
    
                        document.querySelector('#list-partisans-tribu-t-agenda').innerHTML += `
                            <tr class="table-partisans-${tribu_t_name}-${lastName}">
                                <td><img class="pdp-agenda-tribu-t" src="${profil}" alt=""></td>
                                <td data-id="${json.user_id}" class="lastname">${firstName}</td>
                                <td class="firstname">${lastName}</td>
                                <td class="content-checkbox email">${profilInfo.email}</td>
                                <td>${json.roles}</td>
                                <td>
                                    <input type="checkbox" name="selectOui" class="select-tribu-t-oui" 
                                     onchange="handleChange(this,false)">
                                </td>
                           </tr>
                        `
                        if (document.querySelector(`.btn-close-partisans-${tribu_t_name}`)) {
                            document.querySelector(`.btn-close-partisans-${tribu_t_name}`).addEventListener('click', () => {
                                document.querySelector(`.table-partisans-${tribu_t_name}-${lastName}`).remove()
                            })
                        }

                    }else{
                        document.querySelector("#list-partisans-tribu-t-agenda").dataset.id = json.id
                    }
                })

                $("#listPartisantInTribuT").modal("show")

                $('#list-partisans-tribuT').DataTable({
                    language: {
                        url: '//cdn.datatables.net/plug-ins/1.13.4/i18n/fr-FR.json',
                        "search": "Recherche global",
                        "emptyTable": "Aucun partisan à part vous dans ce tribu",
            
                    }
                })

            })
        }
    })
}

function handleChange(elment,isG) {
    if(isG){
        if(elment.checked){
            var checkboxes = document.querySelectorAll('.select-tribu-g-oui');
            let allChekecd=true
            let hasChecked = false
            for (var i = 0; i < checkboxes.length; i++) {
                if (!checkboxes[i].checked)
                    allChekecd=false
            }
            if(allChekecd){
                document.querySelector("#selectTribuGAll").checked=true
            }

            document.querySelector("#shareAgendaForPartisan").classList.remove("btn-second-primary")

        }else{
                document.querySelector("#selectTribuGAll").checked=false
                var checkboxes = document.querySelectorAll('.select-tribu-g-oui');
                let hasChecked = false
                for (var i = 0; i < checkboxes.length; i++) {
                    if (checkboxes[i].checked)
                        hasChecked=true
                }

                if(hasChecked){
                    document.querySelector("#shareAgendaForPartisan").classList.remove("btn-second-primary")
                }else{
                    document.querySelector("#shareAgendaForPartisan").classList.add("btn-second-primary")
                }
        }

    }else{
        if(elment.checked){
            var checkboxes = document.querySelectorAll('.select-tribu-t-oui');
            let allChekecd=true
            for (var i = 0; i < checkboxes.length; i++) {
                if (!checkboxes[i].checked)
                    allChekecd=false
            }
            if(allChekecd){
                document.querySelector("#selectTribuTAll").checked=true
            }
            document.querySelector("#shareBtnTribuTForPart").classList.remove("btn-second-primary")
        }else{
                document.querySelector("#selectTribuTAll").checked=false
                var checkboxes = document.querySelectorAll('.select-tribu-t-oui');
                let hasChecked = false
                for (var i = 0; i < checkboxes.length; i++) {
                    if (checkboxes[i].checked)
                        hasChecked=true
                }

                if(hasChecked){
                    document.querySelector("#shareBtnTribuTForPart").classList.remove("btn-second-primary")
                }else{
                    document.querySelector("#shareBtnTribuTForPart").classList.add("btn-second-primary")
                }
        }
    }
    
}

function generateDataTable(selector, limite,turnOffLogo=false) {
    $(document).ready(function () {
        // Setup - add a text input to each footer cell
       
        var trHeadClone = $(selector + ' thead tr').clone(true)
        $(trHeadClone).children().last().text("")
        console.log($(trHeadClone).children().last())
        $(trHeadClone).addClass('filters').appendTo(selector + ' thead');
        limite = document.querySelectorAll(selector + ' thead tr:nth-child(2) > th').length
        var table = $(selector).DataTable({
            language: {
                url: '//cdn.datatables.net/plug-ins/1.13.4/i18n/fr-FR.json',
                "search": "Recherche global",

            },
            orderCellsTop: true,
            fixedHeader: true,
            initComplete: function () {
                var api = this.api();
                var i = 0;
                // For each column
                api.columns()
                    .eq(0)
                    .each(function (colIdx) {
                        if(!turnOffLogo){
                            if (i < limite - 1 ) {
                                putInputOnDataTableHeader(selector,colIdx,api)
                            }
                        }else{
                            $(trHeadClone).children().first().text("")
                            if(i > 0 && i < limite-1 ){
                                putInputOnDataTableHeader(selector,colIdx,api)
                            }
                        }
                        

                        i++;
                    });
            },
        });

    });
}

function putInputOnDataTableHeader(selector,colIdx,api){
    // Set the header cell to contain the input element
    var cell = $(selector + ' .filters th').eq(
        $(api.column(colIdx).header()).index()
    );
    var title = $(cell).text();

    $(cell).html('<input type="text" placeholder="Chercher ' + title + '" style="width:100%; font-size:1em" />');

    // On every keypress in this input
    $('input', $(selector + ' .filters th').eq($(api.column(colIdx).header()).index()))
        .off('keyup change')
        .on('keyup change', function (e) {
            e.stopPropagation();

            // Get the search value
            $(this).attr('title', $(this).val());
            var regexr = '({search})'; //$(this).parents('th').find('select').val();

            var cursorPosition = this.selectionStart;
            // Search the column for that value
            api
                .column(colIdx)
                .search(
                    this.value != ''
                        ? regexr.replace('{search}', '(((' + this.value + ')))')
                        : '',
                    this.value != '',
                    this.value == ''
                )
                .draw();

            $(this)
                .focus()[0]
                .setSelectionRange(cursorPosition, cursorPosition);
        });
}

function findEtabByKey(e,isHasDep){
    let cmzEtab = document.querySelector("#hiddenListDep").dataset.etab
    // element.dataset.id
    if(!isHasDep){
        document.querySelectorAll("#smallNavInvitation > li > a")[0].dataset.id = ""
        document.querySelectorAll("#smallNavInvitation > li > a")[1].dataset.id = ""
    }
    let cles0 = ""
    let cles1 = ""
    if(e.target.nextElementSibling){
        cles0 = e.target.value
        cles1 = e.target.nextElementSibling.value
    }else{
        cles0 = e.target.previousElementSibling.value
        cles1 = e.target.value
    }

    e.preventDefault()
    
    if(e.code == "Enter" || e.code == 13){
        let param = "?cles0="+cles0+"&cles1="+cles1
        const request = new Request("/api/search/"+cmzEtab + "/" + param, {
            method: "GET",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
        })

        $("#listArrondissement").modal("hide")

        $("#listDepModal").modal("hide")

        $("#listRestoOrGolfModal").modal("show")

        makeLoading()

        let initTable = `<table class="table table-striped" id="tableEtabCMZ">
                        <thead>
                            <tr>
                                <th scope="col">Nom</th>
                                <th scope="col">Adresse</th>
                                <th scope="col">Téléphone</th>
                                <th scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody></tbody>
                    </table>`

        document.querySelector(".list_resto_or_golf").innerHTML = initTable

        if(cmzEtab == "golf"){
            document.querySelectorAll("#smallNavInvitation > li > a")[0].textContent = "Tous les golfs"
            document.querySelectorAll("#smallNavInvitation > li > a")[1].textContent = "Golfs à faire"
        }else{
            document.querySelectorAll("#smallNavInvitation > li > a")[0].textContent = "Tous les restaurants"
            document.querySelectorAll("#smallNavInvitation > li > a")[1].textContent = "Restaurants pastillés"
        }

        fetch(request)
            .then(response => response.json())
            .then(data=>{

                let results = data.results[0]
                let tabEtab = document.querySelectorAll("#smallNavInvitation > li > a")
                if (!tabEtab[0].classList.contains("active")) {
                    tabEtab[0].classList.add("active")
                    tabEtab[1].classList.remove("active")
                }

                let turnOffLogo=false
                if (results.length > 0) {
                    results.forEach((etablissement, index) => {
                            document.querySelector("#tableEtabCMZ > tbody").appendChild(
                                generateTableForEtab(index, {
                                    id: etablissement.id_etab,
                                    nom: etablissement.name,
                                    adresse: etablissement.adresse,
                                    tel: etablissement.tel,
                                    departement: etablissement.departement,
                                    dep: etablissement.dep,
                                    id_etab: etablissement.id_etab
                                }, true))
                    });
                    document.querySelector(".list_resto_or_golf").style.display = "block";
                    generateDataTable("#tableEtabCMZ", 3,turnOffLogo)
                } else {
                    document.querySelector(".list_resto_or_golf").style.display = "block";
                    generateTableForEtab(0, { id: "", nom: "", adresse: "" }, false)
                }

                if (document.querySelector(".list_resto_or_golf").classList.contains("opacity_03")) {
                    document.querySelector(".list_resto_or_golf").classList.remove("opacity_03")
                }
                deleteChargement("chargement_content");

            })
    }

}
