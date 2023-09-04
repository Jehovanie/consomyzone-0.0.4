document.addEventListener('DOMContentLoaded', function() {

    const request = new Request('/api/user/all_agenda', {
        method: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'  
        },
    })

    fetch(request)
        .then(response=>response.json())
        .then(response =>{
            const allAgenda= response.allAgenda;
            const agendaTab= [];
            
            const repasType= [ 'repas', 'dîné', 'déjeuné'];

            // console.log(allAgenda);

            allAgenda.forEach(agenda => { 
                const {id, title, dateStart:start, dateEnd: end, timeStart : heureDebut, timeEnd: heureFin } = agenda;
                // const className=  repasType.some(item => item.includes(type.toLowerCase())) ? "repas": 'other_event';
                // var tomorrow = new Date(end);
                // tomorrow.setDate(tomorrow.getDate()+1)
                // console.log(tomorrow)
                //agendaTab.push({id, title, start : new Date(start), end: new Date(end), textColor: 'black'})
                let dateStartAgd = new Date(start)
                dateStartAgd = dateStartAgd.setHours(heureDebut.split(":")[0], heureDebut.split(":")[1], heureDebut.split(":")[2]);
                let dateEndAgd = new Date(end)
                dateEndAgd = dateEndAgd.setHours(heureFin.split(":")[0], heureFin.split(":")[1], heureFin.split(":")[2]);
                agendaTab.push({id, title, start : dateStartAgd, end: dateEndAgd, textColor: 'black'})
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
}else {
  console.error('Upgrade your browser. This Browser is NOT supported WebSocket for Live-Reloading.');
}


///// CANCEL CREATE AGENDA ------------------------------------------------------
if( document.querySelector(".cta_cancel_create_agenda_jheo_js") || document.querySelector(".btn_close_create_agenda_jheo_js")){
    const cta_cancel_create_agenda = [document.querySelector(".cta_cancel_create_agenda_jheo_js"), document.querySelector(".btn_close_create_agenda_jheo_js")];
    
    cta_cancel_create_agenda.forEach(item => {
        item.addEventListener("click", () => {
            initInputForm()
        })
    })
}


//// PUSH NEW AGENT -----------------------------------------------------------
if( document.querySelector(".cta_confirm_create_agenda_jheo_js")){

    //// CHECK INPUT TYPE EVENT : IF 'REPAS' SHOW INPUT SEARCH RESTO
    const handleTypeEvent= [document.querySelector(".inputOther_radio_jheo_js"), document.querySelector(".inputRepas_radio_jheo_js") ];

    handleTypeEvent.forEach(typeEvent => {

        const content_inputTypeSelect= document.querySelector(".content_typeEventSelect_jheo_js");
        const content_inputType= document.querySelector(".content_typeEvent_jheo_js");

        typeEvent.addEventListener("change", () => {
            if( typeEvent.classList.contains("inputOther_radio_jheo_js")){
                if(content_inputType.classList.contains("d-none")){
                    content_inputType.classList.remove("d-none")

                    document.querySelector(".typeEvent_jheo_js").value=null;
                }
    
                if(!content_inputTypeSelect.classList.contains("d-none")){
                    content_inputTypeSelect.classList.add("d-none")
                }

                if(!document.querySelector(".content_searchResto_jheo_js").classList.contains('d-none')){
                    document.querySelector(".content_searchResto_jheo_js").classList.add('d-none');
                }

                if(!document.querySelector(".content_restoEvent_jheo_js").classList.contains('d-none')){
                    document.querySelector(".content_restoEvent_jheo_js").classList.add('d-none');
                    document.querySelector(".restoEvent_jheo_js").value = null
                }
    
                if(document.querySelector(".lieuEvent_jheo_js").hasAttribute('disabled')){
                    document.querySelector(".lieuEvent_jheo_js").removeAttribute('disabled');
                    document.querySelector(".lieuEvent_jheo_js").value= null;
                }
    
            }else{
                if(!content_inputType.classList.contains("d-none")){
                    content_inputType.classList.add("d-none")
                }
    
                if(content_inputTypeSelect.classList.contains("d-none")){
                    content_inputTypeSelect.classList.remove("d-none")
                }

                if(document.querySelector(".content_searchResto_jheo_js").classList.contains('d-none')){
                    document.querySelector(".content_searchResto_jheo_js").classList.remove('d-none')
                }

                document.querySelector(".typeEvent_jheo_js").value="Repas déjeuné"
            }
        })
    })

    document.querySelector(".typeEventSelect_jheo_js").addEventListener("change", (e) => {
        document.querySelector(".typeEvent_jheo_js").value = e.target.value
    })


    //// CHANGE EVENT FOR SEARCH RESTO
    document.querySelector(".searchResto_jheo_js").addEventListener("keyup",(e) => {
        if(parseInt(e.keyCode) === 13 ){
            if( document.querySelector(".searchResto_jheo_js").value != "" ){

                /// afficher la liste des restos trouver
                bindActionSearchResto(document.querySelector(".searchResto_jheo_js").value);
            }
        }
    })

    ///// AFFICHER UNE LISTE DES RESTO
    document.querySelector(".chose_pastil_resto_jheo_js").addEventListener("click",() => {

        /// afficher la liste des restos pastiller
        bindActionSearchResto("RESTO_PASTILLE");
    })

    document.querySelector(".cta_confirm_create_agenda_jheo_js").addEventListener("click", (e) => {
        
        let state= true;

        const agenda= {
            "title" : document.querySelector(".nameEvent_jheo_js").value,
            "type" : document.querySelector(".typeEvent_jheo_js").value,
            "address" : document.querySelector(".lieuEvent_jheo_js").value,
            "desc" : document.querySelector(".eventDesc_jheo_js").value,
            "participant" : document.querySelector(".nbrParticipant_jheo_js").value,
            "dateStart" : document.querySelector(".eventStart_jheo_js").value,
            "dateEnd" : document.querySelector(".eventEnd_jheo_js").value,
            "timeStart" : document.querySelector(".timeStart_jheo_js").value,
            "timeEnd" : document.querySelector(".timeEnd_jheo_js").value,
        }

        const agenda_keys= Object.keys(agenda);
        agenda_keys.forEach(key => {
            if( agenda[key] === ''){
                state= false;
            }
        })

        if( !state ){
            e.preventDefault()
            console.log(agenda)
            document.querySelector(".invalid_agenda_jheo_js").click();

            setTimeout(() => {
                document.querySelector(".close_modal_invalid_agenda_jheo_js").click();
            }, 1500);
        }else{
            sendNewAgenda(agenda)
        }
    })


    document.querySelectorAll(".cta_close_list_resto_jheo_js").forEach(close => {
        close.addEventListener("click", () => {
            document.querySelectorAll(".list_tr_resto_jheo_js tr").forEach(tr => tr.remove())
        })
    })
}


function rendreCalendarWithEvents(events){
    
    var calendarEl = document.getElementById('calendar');

    var calendar = new FullCalendar.Calendar(calendarEl, {
        plugins: [ 'interaction', 'dayGrid' ],
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
        dateClick: function(info) {
            bindEventForAllDay(info)
        },
        eventClick: function(info) {
            const id = info.event.id ? parseInt(info.event.id) : 0
            bindEventForAnEvent(id)
        },
    });

    calendar.render();
}

function bindEventForAllDay(info){
    const info_date = new Date(info.dateStr);
    const today = new Date();

    // if( info_date.getTime() >=  today.getTime()){
    // }

    document.querySelector(".eventStart_jheo_js").value= info.dateStr;
    document.querySelector(".eventEnd_jheo_js").value= info.dateStr;

    document.querySelector(".timeStart_jheo_js").value= '00:00';
    document.querySelector(".timeEnd_jheo_js").value= '23:00';

    ///show modal
    //document.querySelector('.show_modal_createAgenda_jheo_js').click()
    $("#createAgenda").modal("show")

    if(document.querySelector('#createOrEditBtn').textContent.toLowerCase().trim() == "modifier"){
        initInputForm()
    }

}

function bindEventForAnEvent(id){
    if(id===0){
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
        .then(response=>response.json())
        .then(response =>{
            const agenda= response.agenda;
            setAndShowModal(agenda)
        })
}

function setAndShowModal(agenda){
    $("#createAgenda").modal("show")
    $("#createOrEditBtn").text("Modifier")
    $("#modalCreateAgendaTitles").text("Modifier l'événement")
    document.querySelector('#createOrEditBtn').dataset.action = "update"
    document.querySelector('#createOrEditBtn').dataset.rank = agenda.id
    console.log(agenda)
    document.querySelector("#eventTitle").value = agenda.title
    document.querySelector("#typeEvent").value = agenda.type
    document.querySelector("#eventDesc").value = agenda.description

    if(document.querySelector("#deleteAgendaBtn").classList.contains("d-none")){
        document.querySelector("#deleteAgendaBtn").classList.remove("d-none")
    }

    if(document.querySelector("#shareAgendaBtn").classList.contains("d-none")){
        document.querySelector("#shareAgendaBtn").classList.remove("d-none")
    }

    let etabCMZ = document.querySelector("#etabCMZ")
    let nomEtab = document.querySelector("#containerNomEtab")
    let adresseContainer = document.querySelector(".lieuEventContainer")

    if(nomEtab.classList.contains("d-none")){
        nomEtab.classList.remove("d-none")
    }

    if(adresseContainer.classList.contains("d-none")){
        adresseContainer.classList.remove("d-none")
    }

    if(agenda.isEtabCMZ){

        document.querySelector("#etabSelectOptions").value = 1

        nomEtab.querySelector("input").disabled = true

        adresseContainer.querySelector("input").disabled = true

        if(etabCMZ.classList.contains("d-none")){
            etabCMZ.classList.remove("d-none")
        }

        if(agenda.isGolfCMZ){
            document.querySelector("#golfRadio").checked = true
        }else{
            document.querySelector("#restoRadio").checked = true
        }

    }else{

        document.querySelector("#etabSelectOptions").value = 2

        nomEtab.querySelector("input").disabled = false

        adresseContainer.querySelector("input").disabled = false

        if(!document.querySelector("#etabCMZ").classList.contains("d-none"))
            document.querySelector("#etabCMZ").classList.add("d-none")

    }

    nomEtab.querySelector("input").value = agenda.name

    adresseContainer.querySelector("input").value = agenda.adresse

    document.querySelector("#nbrParticipant").value = agenda.max_participant

    document.querySelector("#eventStart").value= agenda.dateStart;

    document.querySelector("#eventEnd").value= agenda.dateEnd;

    document.querySelector("#timeStart").value= agenda.heure_debut;

    document.querySelector("#timeEnd").value= agenda.heure_fin;
    
}


function updateAgenda(){
    const array= [
        document.querySelector('.cta_update_agenda_jheo_js'),
        document.querySelector('.cta_cancel_edit_agenda_jheo_js'),
        document.querySelector('.content_input_view_agenda_jheo_js')
    ];

    if(array.some(item => item === null )){
        console.log("Selector not found")
        return 0
    }

    const content_view_agenda= document.querySelector('.content_input_view_agenda_jheo_js')
    document.querySelector(".cta_update_agenda_jheo_js").addEventListener("click",() => {
        content_view_agenda.querySelectorAll("input").forEach(input => {
            if( input.hasAttribute("disabled") && !input.classList.contains("nbrParticipantCur_jheo_js")){
                input.removeAttribute("disabled")
            }
        })

        const textArea= content_view_agenda.querySelector("textarea");
        if( textArea.hasAttribute("disabled")){
            textArea.removeAttribute("disabled")
        }

        document.querySelector(".modal_title_event_jheo_js").innerText= "Modification d'une évenement"

        document.querySelector(".cta_update_agenda_jheo_js").innerText= 'Confirme la modification';

        const cta_cancel_edit= document.querySelector(".cta_cancel_edit_agenda_jheo_js");
        if( cta_cancel_edit.classList.contains("d-none")){
            cta_cancel_edit.classList.remove("d-none");
        }
    })

    document.querySelector(".cta_cancel_edit_agenda_jheo_js").addEventListener("click",() => {
        content_view_agenda.querySelectorAll("input").forEach(input => {
            if( !input.hasAttribute("disabled")){
                input.setAttribute("disabled", "")
            }
        })

        const textArea= content_view_agenda.querySelector("textarea");
        if( !textArea.hasAttribute("disabled")){
            textArea.setAttribute("disabled", "")
        }

        document.querySelector(".modal_title_event_jheo_js").innerText= "Evenement"
        document.querySelector(".cta_update_agenda_jheo_js").innerText= 'Voulez-vous modifier?';
        
        const cta_cancel_edit= document.querySelector(".cta_cancel_edit_agenda_jheo_js");
        if( !cta_cancel_edit.classList.contains("d-none")){
            cta_cancel_edit.classList.add("d-none");
        }
    })


    document.querySelector(".cta_delete_agenda_jheo_js").addEventListener("click",() => {
        const agendaID= document.querySelector(".cta_delete_agenda_jheo_js").getAttribute("data-agenda-id");
        if(!agendaID){
            showAlertMessageFlash("Impossible de supprimer cette agenda parce que ce n'est pas vous qu'il a crée.", "danger");
        }else{
            document.querySelector(".confirm_delete_agenda_jheo_js").addEventListener("click", () => {
                deleteAgenda(parseInt(agendaID))
            })
        }
    })
}

function sendNewAgenda(agenda){
    
    const param = {
        "name" : agenda.title,
        "description": agenda.desc,
        "type": JSON.stringify({ "type": agenda.type, "code" : 1 }),
        "confidentiality": agenda.confidentiality,
        "dateStart": agenda.dateStart,
        "dateEnd": agenda.dateEnd,
        "hourStart": agenda.timeStart,
        "hourEnd": agenda.timeEnd,
        "adresse": agenda.address,
        "participant": agenda.participant,
        "resto": agenda.resto,
        "resto" : (document.querySelector(".restoEvent_jheo_js").value !== "" ) ? document.querySelector(".restoEvent_jheo_js").value : null,
        "confidentiality" : 1,
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
        .then(response=>response.json())
        .then(response =>{
            console.log(response);
            showAlertMessageFlash(response.message, "success" ,isReload=true);
        })
}


function setRestoAgenda(resto, element){

    const classSuccess= "btn-info";
    const classDefault= "btn-outline-info";

    if( document.querySelector(".resto_pastiled_jheo_js")){
        const pastiled = document.querySelector(".resto_pastiled_jheo_js");
        pastiled.classList.remove("resto_pastiled_jheo_js");

        pastiled.classList.remove(classSuccess);
        pastiled.classList.add(classDefault);
        pastiled.innerText = "Choisir"
    }

    if( element.classList.contains(classDefault)){
        element.classList.remove(classDefault);
        element.classList.add(classSuccess);
        element.classList.add("resto_pastiled_jheo_js");

        element.innerText = 'Sélectionnée';
    }
    document.querySelector(".restoEvent_jheo_js").value = resto.name;
    document.querySelector(".lieuEvent_jheo_js").value = resto.adress;
    document.querySelector(".lieuEvent_jheo_js").setAttribute("disabled", "");
    
    if( document.querySelector(".content_restoEvent_jheo_js").classList.contains("d-none")){
        document.querySelector(".content_restoEvent_jheo_js").classList.remove("d-none")
    }
}


function bindActionSearchResto(motCles){
    document.querySelector(".listRestoModal_jheo_js").click();

    createChargement(document.querySelector(".content_chargement_jheo_js"),c="chargement_content chargment_content_js_jheo")
    if( !document.querySelector(".content_list_resto_js").classList.contains("opacity_03")){
        document.querySelector(".content_list_resto_js").classList.add("opacity_03")
    }

    // setTimeout(function(){
    //     deleteChargement("chargement_content")
    // },2000)

    let titleModal= ( motCles === "RESTO_PASTILLE" ) ? "Liste des restaurants pastillés dans vos tribu Tribu T." : "Résultat de restaurant trouver"
    document.querySelector(".listResto_title_jheo_js").innerText= titleModal

    if( motCles === "RESTO_PASTILLE"){
        const request = new Request('/api/user/agenda/resto-pastille', {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'  
            },
        })
    
        fetch(request)
            .then(response=>response.json())
            .then(response =>{
                if(!response.success){ 
                    throw  new Error(response.message); 
                }

                const { results } = response;
                if( results.length > 0 ){
                    results.forEach((resto, index) => {
                        createLinkRestoPastile( index,{ id: resto.id_resto,  name: resto.name, adress: resto.adress },true)
                    });
    
                }else{
                    createLinkRestoPastile( 0,{ id:"",  name:"", adress:""}, false)
                }

                if(document.querySelector(".content_list_resto_js").classList.contains("opacity_03")){
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


function deleteAgenda(){

    swal({
        title: "Etes vous sûr de vouloir supprimer cet événement?",
        // text: "Agenda supprimé avec succès !",
        icon: "warning",
        buttons: true,
        dangerMode: true,
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
                body: JSON.stringify({ agendaID: id})
            })
        
            fetch(request)
                .then(response=>response.json())
                .then(response =>{
                    $("#createAgenda").modal("hide")
                    swal("Bravo !", response.message, "success")
                    .then((value) => {
                        location.reload();
                    });
                })
        }

      });
}


function createLinkRestoPastile(index, resto, isValid=true){

    if( isValid){
        const tr= document.createElement('tr');

        tr.innerHTML = `
          <th>${index+1}</th>
          <td>${resto.name}</td>
          <td>${resto.adress.toLowerCase()}</td>
          <td><button type="button" class="btn btn-outline-info" onclick="setRestoAgenda({ name:'${resto.name}',adress:'${resto.adress.toLowerCase()}'} ,this)">Choisissez</button></td>
        `
        document.querySelector(".list_tr_resto_jheo_js").appendChild(tr)

    }else{
        document.querySelector(".list_tr_resto_jheo_js").innerHTML= `
            <div class="alert alert-secondary" role="alert">
                Vous n'avez pas encore des restaurants pastillées.
            </div>
        `
    }
}

/** BLOC NANTENAINA */

function activeOnglet(elem){
    if(!elem.classList.contains("active")){
        elem.classList.add("active")
        let cmzEtab = ""

        if(elem.dataset.name == "golf"){
            cmzEtab = "golf"
        }else if(elem.dataset.name == "restaurant"){
            cmzEtab = "restaurant"
        }

        if(elem.parentElement.nextElementSibling){
            elem.parentElement.nextElementSibling.firstElementChild.classList.remove("active")
            makeLoading()
            getAllEtab(cmzEtab, false, elem)
        }else{
            elem.parentElement.previousElementSibling.firstElementChild.classList.remove("active")
            makeLoading()
            getAllEtab(cmzEtab, true, elem)
        }
    }
}

function getListEtabCMZ(element){
    let tab = document.querySelectorAll("#smallNavInvitationDep > li > a")
    let cmzEtab = ""
    let tabEtab = document.querySelectorAll("#smallNavInvitation > li > a")
    if(tab[0].classList.contains("active")){

        if(tab[0].textContent.toLowerCase().includes("golf")){
            cmzEtab = "golf"
            tabEtab[0].textContent = "Tous les golfs"
            tabEtab[1].textContent = "Golfs pastillés"
        }else if(tab[0].textContent.toLowerCase().includes("restaurant")){
            cmzEtab = "restaurant"
            tabEtab[0].textContent = "Tous les restaurants"
            tabEtab[1].textContent = "Restaurants pastillés"
        }

        $("#listDepModal").modal("hide")

        tabEtab[0].dataset.id = element.dataset.id

        tabEtab[0].dataset.name = cmzEtab

        tabEtab[1].dataset.id = element.dataset.id

        tabEtab[1].dataset.name = cmzEtab

        $("#listRestoOrGolfModal").modal("show")
        
        getAllEtab(cmzEtab, false, element)

    }else{

        if(tab[1].textContent.toLowerCase().includes("golf")){
            cmzEtab = "golf"
            tabEtab[0].textContent = "Tous les golfs"
            tabEtab[1].textContent = "Golfs pastillés"
        }else if(tab[1].textContent.toLowerCase().includes("restaurant")){
            cmzEtab = "restaurant"
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

function activeOngletForDep(elem){
    if(!elem.classList.contains("active")){
        elem.classList.add("active")
        let cmzEtab = ""
        if(elem.textContent.toLowerCase().includes("golf")){
            cmzEtab = "golf"
        }else if(elem.textContent.toLowerCase().includes("restaurant")){
            cmzEtab = "restaurant"
        }

        let hiddenEtab = document.querySelector("#hiddenListDep")

        hiddenEtab.dataset.etab = cmzEtab

        if(elem.parentElement.nextElementSibling){
            elem.parentElement.nextElementSibling.firstElementChild.classList.remove("active")
        }else{
            elem.parentElement.previousElementSibling.firstElementChild.classList.remove("active")
        }

    }
}

function selectEtab(e){

    let etabCMZ = document.querySelector("#etabCMZ")
    let nomEtab = document.querySelector("#containerNomEtab")
    let adresseContainer = document.querySelector(".lieuEventContainer")

    if(e.target.value == 1){

        nomEtab.querySelector("input").disabled = true

        adresseContainer.querySelector("input").disabled = true
        
        if(!nomEtab.classList.contains("d-none")){
            nomEtab.classList.add("d-none")
        }

        if(etabCMZ.classList.contains("d-none")){
            etabCMZ.classList.remove("d-none")
        }

        if(!adresseContainer.classList.contains("d-none")){
            adresseContainer.classList.add("d-none")
        }

    }else if(e.target.value == 2){

        nomEtab.querySelector("input").disabled = false

        adresseContainer.querySelector("input").disabled = false

        if(!etabCMZ.classList.contains("d-none")){
            etabCMZ.classList.add("d-none")
        }

        if(nomEtab.classList.contains("d-none")){
            nomEtab.classList.remove("d-none")
        }

        if(adresseContainer.classList.contains("d-none")){
            adresseContainer.classList.remove("d-none")
        }

        document.querySelector("#containerNomEtab > input").value =""

        adresseContainer.querySelector("input").value = ""

    }else{
        alert("Il y a eu une erreur !");
    }
}

function showDepModal(radio){

    let container = document.querySelector('.container_list_dep')

    let cmzEtab = radio.value

    let navLinksModal = document.querySelectorAll("#smallNavInvitationDep > li > a")

    let tabEtab = document.querySelectorAll("#smallNavInvitation > li > a")

    if(!tabEtab[0].classList.contains("active")){
        tabEtab[0].classList.add("active")
        tabEtab[1].classList.remove("active")
    }

    activeOngletForDep(navLinksModal[0])

    if(cmzEtab == "golf"){
        navLinksModal[0].textContent = "Tous les golfs"
        navLinksModal[1].textContent = "Golfs pastillés"
    }else{
        navLinksModal[0].textContent = "Tous les restaurants"
        navLinksModal[1].textContent = "Restaurants pastillés"
    }

    $("#createAgenda").modal("hide")

    getListDep(container)

    document.querySelector("#hiddenListDep").dataset.etab = cmzEtab

    $("#listDepModal").modal("show")

    makeLoading()

}

function getAllEtab(etab, isPast, element){

    let request = "";

    let id = element.dataset.id
    let name = element.dataset.name

    /*if(isPast){
        request = new Request(`/api/user/agenda/get/${etab}/pastille`, {
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

    }*/

    let tabEtab = document.querySelectorAll("#smallNavInvitation > li > a")

    if(isPast){
        request = new Request(`/api/user/agenda/get/${etab}/pastille/dep/${id}`, {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'  
            },
        })

        if(!tabEtab[1].classList.contains("active")){
            tabEtab[1].classList.add("active")
            tabEtab[0].classList.remove("active")
        }
    }else{

        request = new Request(`/api/user/agenda/get/${etab}/dep/${id}`, {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'  
            },
        })

        if(!tabEtab[0].classList.contains("active")){
            tabEtab[0].classList.add("active")
            tabEtab[1].classList.remove("active")
        }

    }

    document.querySelector(".list_resto_or_golf > table > tbody").innerHTML =""

    fetch(request)
        .then(response=>response.json())
        .then(response =>{

            if(!response.success){
                throw  new Error(response.message); 
            }

            const { results } = response;

            if( results.length > 0 ){
                results.forEach((etablissement, index) => {
                    if(etablissement.tribu){
                        generateTableForEtab( index, { id: etablissement.id_etab,  nom: etablissement.name, adresse: etablissement.adresse, tel: etablissement.tel, tribu : etablissement.tribu, logoTribu : etablissement.logoTribu, departement : etablissement.departement, dep : etablissement.dep, id_etab: etablissement.id_etab },true)
                    }else{
                        generateTableForEtab( index, { id: etablissement.id_etab,  nom: etablissement.name, adresse: etablissement.adresse, tel: etablissement.tel, departement : etablissement.departement, dep : etablissement.dep, id_etab: etablissement.id_etab },true)
                    }
                });

               /*$("#tableEtabCMZ").DataTable({language: {
                    url: '//cdn.datatables.net/plug-ins/1.13.4/i18n/fr-FR.json',
                }});*/
                
            }else{
                generateTableForEtab( 0,{ id:"",  nom:"", adresse:""}, false)
            }

            if(document.querySelector(".list_resto_or_golf").classList.contains("opacity_03")){
                document.querySelector(".list_resto_or_golf").classList.remove("opacity_03")
            }
            deleteChargement("chargement_content");

    })
}

function generateTableForEtab(index, etab, isValid=true){

    if( isValid){

        let forTribuT = "";

        if (etab.tribu) {
            
            if(!document.querySelector(".forTribu")){

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
            logoTribu = etab.logoTribu ? "/public/" + etab.logoTribu : "/public/uploads/tribu_t/photo/avatar_tribu.jpg";
            
            forTribuT = `<td><img src="${logoTribu}" alt=""></td><td>${nomTribu}</td>`;

        }else{

            if(document.querySelector(".forLogo"))
                document.querySelector(".forLogo").remove()

            if(document.querySelector(".forTribu"))
                document.querySelector(".forTribu").remove()
        }


        let tableData = `<tr>
                ${forTribuT}
                <td class="dataName">${etab.nom}</td>
                <td class="dataAdresse">${etab.adresse.toLowerCase()}</td>
                <td>${etab.tel}</td>
                <td>
                    <button type="button" class="btn btn-outline-primary btn-sm" onclick="showEtabDetail(this, '${etab.departement}', ${etab.dep}, ${etab.id_etab})">Détail</button>
                    <button type="button" class="btn btn-outline-info btn-sm" onclick="setNameOrAdresseForEtab({ name:'${etab.nom}',adress:'${etab.adresse.toLowerCase()}'} ,this)">Choisir</button>
                </td>
            </tr>
            `
        document.querySelector(".list_resto_or_golf > table > tbody").innerHTML += tableData

    }else{
        document.querySelector(".list_resto_or_golf > table > tbody").innerHTML= `
            <td colspan="4" class="text-center">Aucun résultat</td>
            `
    }
}

function setNameOrAdresseForEtab(etab, element){

    const classSuccess= "btn-info";
    const classDefault= "btn-outline-info";

    if(document.querySelector(".resto_pastiled_jheo_js")){
        const pastiled = document.querySelector(".resto_pastiled_jheo_js");
        pastiled.classList.remove("resto_pastiled_jheo_js");

        pastiled.classList.remove(classSuccess);
        pastiled.classList.add(classDefault);
        pastiled.innerText = "Choisir"
    }

    if( element.classList.contains(classDefault)){
        element.classList.remove(classDefault);
        element.classList.add(classSuccess);
        element.classList.add("resto_pastiled_jheo_js");

        element.innerText = 'Sélectionner';
    }

    document.querySelector("#nomEtabEvent").value = etab.name;

    document.querySelector("#lieuEvent").value = etab.adress;
    
    if(document.querySelector("#containerNomEtab").classList.contains("d-none")){
        document.querySelector("#containerNomEtab").classList.remove("d-none")
    }

    if(document.querySelector("#containerAdresseEtab").classList.contains("d-none")){
        document.querySelector("#containerAdresseEtab").classList.remove("d-none")
    }
}

function makeLoading(){
    let containerChargement = document.createElement("div")
    containerChargement.classList.add("chargement_content")
    containerChargement.classList.add("content_chargement_nanta_js")
    containerChargement.classList.add("mt-3")
    containerChargement.classList.add("mb-3")
    document.querySelector(".container_list").appendChild(containerChargement)

    createChargement(document.querySelector(".content_chargement_nanta_js"),c="chargement_content content_chargement_nanta_js")

    if( !document.querySelector(".list_resto_or_golf").classList.contains("opacity_03")){
        document.querySelector(".list_resto_or_golf").classList.add("opacity_03")
    }
}

function saveNewAgenda(agenda){
    
    const param = {
        "title" : agenda.title,
        "type": agenda.type,
        "isEtabCMZ" : agenda.isEtabCMZ,
        "isGolfCMZ" : agenda.isGolfCMZ,
        "isRestoCMZ" : agenda.isRestoCMZ,
        "name" : agenda.name,
        "adresse": agenda.adresse,
        "description": agenda.description,
        "participant": agenda.participant,
        "dateStart": agenda.dateStart,
        "dateEnd": agenda.dateEnd,
        "timeStart": agenda.timeStart,
        "timeEnd": agenda.timeEnd,
        "fileType": null,
        "fileName": null,
        "confidentiality" : 1,
    };

    let request = ""

    let action = document.querySelector('#createOrEditBtn').dataset.action

    if(action.toLowerCase().trim() == "create"){
        request = new Request('/user/tribu/new-agenda', {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'  
            },
            body: JSON.stringify(param)
        })
    }else if(action.toLowerCase().trim() == "update"){
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
    }else{
        alert("il y a eu une erreur !")
    }

    fetch(request)
        .then(response=>response.json())
        .then(response =>{
            swal("Bravo !", response.message, "success")
            .then((value) => {
                location.reload();
            });
        })
}

function getObjectForNewAgenda(e){
        
    let state= true;

    let isEtabCMZ = parseInt(document.querySelector("#etabSelectOptions").value) == 1 ? true : false;
    
    let isGolfCMZ = false

    let isRestoCMZ = false

    if(isEtabCMZ){
        isGolfCMZ = document.querySelector("#golfRadio").checked ? true : false
        isRestoCMZ = document.querySelector("#restoRadio").checked ? true : false 
    }

    const agenda= {
        "title" : document.querySelector("#eventTitle").value,
        "type": document.querySelector("#typeEvent").value,
        "isEtabCMZ" : isEtabCMZ,
        "isGolfCMZ" : isGolfCMZ,
        "isRestoCMZ" : isRestoCMZ,
        "name" : document.querySelector("#nomEtabEvent").value,
        "adresse": document.querySelector("#lieuEvent").value,
        "description": document.querySelector("#eventDesc").value,
        "participant": document.querySelector("#nbrParticipant").value,
        "dateStart": document.querySelector("#eventStart").value,
        "dateEnd": document.querySelector("#eventEnd").value,
        "timeStart": document.querySelector("#timeStart").value,
        "timeEnd": document.querySelector("#timeEnd").value,
    }

    console.log(agenda);

    const agenda_keys= Object.keys(agenda);
    agenda_keys.forEach(key => {
        if( agenda[key] === ''){
            state= false;
        }
    })

    if( !state ){
        e.preventDefault()
        console.log(agenda)
        document.querySelector(".invalid_agenda_jheo_js").click();

        setTimeout(() => {
            document.querySelector(".close_modal_invalid_agenda_jheo_js").click();
        }, 1500);
    }else{
        saveNewAgenda(agenda)
    }
}

function getListDep(container){

    const request = new Request('/api/user/agenda/dep/list')

    fetch(request)
        .then(res => res.text()).then(html => {
            container.innerHTML = html;
        });

}

function showEtabDetail(element, nom_dep, id_dep, id_restaurant){

    const request = new Request(`/api/agenda/etab/${nom_dep}/${id_dep}/detail/${id_restaurant}`)

    fetch(request)
        .then(res => res.text()).then(html => {
            $("#listRestoOrGolfModal").modal("hide")
            $("#detailEtabModal").modal("show")
            //content_titre_details
            let dataName = element.parentElement.parentElement.querySelector('.dataName').textContent
            let dataAdresse = element.parentElement.parentElement.querySelector('.dataAdresse').textContent
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

function initInputForm(){

    const all_input= document.querySelectorAll('.content_input_create_agenda_jheo_js input')

    all_input.forEach(j => {
        if( j.value !== null ){
            j.value = null;
        }
    })

    $("#createOrEditBtn").text("Créer")

    $("#modalCreateAgendaTitles").text("Créer un événement")

    document.querySelector('#createOrEditBtn').dataset.action = "create"

    document.querySelector('.eventDesc_jheo_js').value = null

    document.querySelector("#etabSelectOptions").value = 1

    document.querySelector("#golfRadio").checked = false
    document.querySelector("#restoRadio").checked = false;

    let nomEtab = document.querySelector("#containerNomEtab")
    let adresseContainer = document.querySelector(".lieuEventContainer")

    let cmzEtab = document.querySelector("#etabCMZ")

    if(cmzEtab.classList.contains("d-none")){
        cmzEtab.classList.remove("d-none")
    }

    if(!nomEtab.classList.contains("d-none")){
        nomEtab.classList.add("d-none")
    }

    if(!adresseContainer.classList.contains("d-none")){
        adresseContainer.classList.add("d-none")
    }

    if(!document.querySelector("#deleteAgendaBtn").classList.contains("d-none")){
        document.querySelector("#deleteAgendaBtn").classList.add("d-none")
    }

    if(!document.querySelector("#shareAgendaBtn").classList.contains("d-none")){
        document.querySelector("#shareAgendaBtn").classList.add("d-none")
    }
}

/** END BLOC */

function tableActiveFilterPartisant(e){
    const allTypeActive= [ "list_partisant_tribuG_jheo_js", "list_partisant_tribuT_jheo_js" ];
    const current_class_active= allTypeActive.find( item => e.classList.contains(item) )
    const other_not_active= allTypeActive.filter(item => item != current_class_active)
    
    if( !e.classList.contains("active")){
        e.classList.add("active")
    }
    other_not_active.forEach(item => {
        if( document.querySelector(`.${item}`).classList.contains("active")){
            document.querySelector(`.${item}`).classList.remove("active")
        }
    })
}

if (document.querySelector('#list-tribu-partage-agenda')) {
    new DataTable('#list-tribu-partage-agenda');  
}
if (document.querySelector('#list-tribu-g-partage-agenda')) {
    new DataTable('#list-tribu-g-partage-agenda');  
}
if (document.querySelector('#list-tribu-t-partage-agenda')) {
    new DataTable('#list-tribu-t-partage-agenda');  
}

if (document.querySelector('#list-partisans-tribu-selection')) {
    new DataTable('#list-partisans-tribu-selection');  
}

if (document.querySelector("#list-partisans-tribu-t-partage-agenda")) {
    const selectorTableT = document.querySelector("#list-partisans-tribu-t-partage-agenda")
    const idTribuT = selectorTableT.getAttribute('data-toggel-tribu-t')
    new DataTable('#' + idTribuT);  
}




function selectAll(source) {
    var checkboxes = document.querySelectorAll('.select-oui');
    for (var i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i] != source)
            checkboxes[i].checked = source.checked;
    }
    
}

function selectTribuGAll(source) {
    var checkboxes = document.querySelectorAll('.select-tribu-g-oui');
    for (var i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i] != source)
            checkboxes[i].checked = source.checked;
    }
    
}


function showPartisanAgenda(tribu_t_name) {

    
    const param = "?tbl_tribu_T_name=" + encodeURIComponent(tribu_t_name)
    console.log(param)
    const request = new Request("/user/partisan/tribu_T"+param, {
        method: "GET",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
    })
    fetch(request).then((response) => { 
        if ( response.ok && response.status == 200) {
            response.json().then(jsons => {
                jsons.forEach(json => {
                    console.log(JSON.parse(json.infos_profil));
                    profilInfo = JSON.parse(json.infos_profil)
                    let profil = profilInfo.photo_profil!=null ? profilInfo.photo_profil : "/assets/image/img_avatar3.png"
                    let lastName = profilInfo.lastName
                    let firstName = profilInfo.firstName
                    let tribuG = profilInfo.tribuG.replace("tribug_01_","")
                    
                    document.querySelector(`#list-partisans-tribu-t-agenda-${tribu_t_name}`).innerHTML += `
                        <tr class="table-partisans-${tribu_t_name}-${lastName}">
                            <td><img class="pdp-agenda-tribu-t" src="${profil}" alt=""></td>
                            <td>${firstName}</td>
                            <td>${lastName}</td>
                            <td></td>
                            <td>${json.roles}</td>
                            <td  class="content-checkbox">
                                <input type="checkbox" name="selectOui" class="select-tribu-t-oui" data-id="${json.user_id}" data-tribu="${tribu_t_name}" data-toggle-last="${lastName}" data-toggle-pdp="${profil}" value="${firstName}" onchange="handleChange(this)">
                            </td>
                       </tr>
                    `
                    if (document.querySelector(`.btn-close-partisans-${tribu_t_name}`)) {
                        document.querySelector(`.btn-close-partisans-${tribu_t_name}`).addEventListener('click' , () => {
                            document.querySelector(`.table-partisans-${tribu_t_name}-${lastName}`).remove()
                        })
                    }

                })    
            })
        }
    })
    if (document.querySelector(".cta_close_list_partisons_t")) {
        document.querySelector(".cta_close_list_partisons_t").addEventListener('click', () => { 
            alert('Close')
            document.querySelector(`#listPartisantInTribu_${tribu_t_name}`).close()
        })
    }
   
}

function handleChange(checkbox) {
    let isChecked = document.querySelectorAll(".content-checkbox > input[type='checkbox']:checked").length
    if (isChecked > 0) {
        document.getElementById("getPartisonsSelectAgenda").classList.remove('btn-second-primary');
       
    } else {
        document.getElementById("getPartisonsSelectAgenda").classList.add('btn-second-primary');
    }
    if (checkbox.checked == true) {
        // document.querySelector("#list-partisans-tribu-selection-ckecked >.odd >.dataTables_empty").remove()
        if (!document.querySelector(`#exist-parisans-${checkbox.getAttribute('data-id')}`)){
            document.querySelector("#list-partisans-tribu-selection-ckecked").innerHTML += `
                <tr class="firstName" id="exist-parisans-${checkbox.getAttribute('data-id')}">
                    <td><img class="pdp-agenda-tribu-t" src="${checkbox.getAttribute('data-toggle-pdp')}" alt=""></td>
                    <td>${checkbox.getAttribute('data-toggle-last')}</td>
                    <td >${checkbox.value}</td>
                    <td> ${checkbox.getAttribute('data-tribu')}</td>
                    <td>
                        <input type="checkbox" name="selectOui" class="select-tribu-t-oui" checked="true">
                    </td>
                </tr>
            `
        }
        
        // if () {
            
        // }
    } else if (checkbox.checked == false) {
        document.querySelector(`#exist-parisans-${checkbox.getAttribute('data-id')}`).remove()
    }

    
}

