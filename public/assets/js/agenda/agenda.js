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

            allAgenda.forEach(agenda => {
                const {id, title, dateStart:start, dateEnd: end } = agenda;
                agendaTab.push({id, title, start, end})
            })

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
            const all_input= document.querySelectorAll('.content_input_create_agenda_jheo_js input');
            all_input.forEach(j => {
                if( j.value !== null ){
                    j.value = null;
                }
            })
            document.querySelector('.eventDesc_jheo_js').value = null
        })
    })
}


//// PUSH NEW AGENT -----------------------------------------------------------
if( document.querySelector(".cta_confirm_create_agenda_jheo_js")){
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
            "confidentiality" : document.querySelector(".confidEvent_jheo_js").value,
            // {"file" : document.querySelector('.image_upload_input_jheo_js').value},
            "file" : "file",
            "resto" : "resto"
        }

        const agenda_keys= Object.keys(agenda);
        agenda_keys.forEach(key => {
            if( agenda[key] === ''){
                state= false;
            }
        })

        if( !state ){
            e.preventDefault()
        }else{
            console.log(agenda)
            sendNewAgenda(agenda)
        }
    })
}


function rendreCalendarWithEvents(events){
    
    var calendarEl = document.getElementById('calendar');

    var calendar = new FullCalendar.Calendar(calendarEl, {
        plugins: [ 'interaction', 'dayGrid' ],
        themeSystem: 'bootstrap5',
        defaultDate: '2023-06-12',
        editable: true,
        eventLimit: true, // allow "more" link when too many events
        events: events,
        dateClick: function(info) {
            bindEventForAllDay()
        },
        eventClick: function(info) {
            console.log(info.event.id)
            const id = info.event.id ? parseInt(info.event.id) : 0
            bindEventForAnEvent(id)
        },
    });

    calendar.render();
}

function bindEventForAllDay(){
    document.querySelector('.show_modal_createAgenda_jheo_js').click()
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
            updateAgenda()
        })
}

function setAndShowModal(agenda){
    console.log(agenda)
    if( !document.querySelector('.content_input_view_agenda_jheo_js')){
        console.log("Selector not found");
        return 0;
    }

    const agendaType= JSON.parse(agenda.type)
    const content_view_agenda= document.querySelector('.content_input_view_agenda_jheo_js')
    
    content_view_agenda.querySelector(".nameEvent_jheo_js").value= agenda.title !== null ? agenda.title.toUpperCase() : agenda.message;
    content_view_agenda.querySelector(".typeEvent_jheo_js").value= agendaType.type.toUpperCase();
    content_view_agenda.querySelector(".lieuEvent_jheo_js").value= agenda.adresse;
    content_view_agenda.querySelector(".eventDesc_jheo_js").value= agenda.message;
    content_view_agenda.querySelector(".nbrParticipantMax_jheo_js").value= agenda.max_participant;
    content_view_agenda.querySelector(".dateStart_jheo_js").value= agenda.dateStart;
    content_view_agenda.querySelector(".dateEnd_jheo_js").value= agenda.dateEnd;
    content_view_agenda.querySelector(".timeStart_jheo_js").value= agenda.heure_debut;
    content_view_agenda.querySelector(".timeEnd_jheo_js").value= agenda.heure_fin;


    document.querySelector(".cta_delete_agenda_jheo_js").setAttribute("data-agenda-id" , agenda.id);

    document.querySelector('.show_modal_showAgenda_jheo_js').click();
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
            if( input.hasAttribute("disabled")){
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
        "fileType": null,
        "fileName": null,
    };
    
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
            showAlertMessageFlash(response.message, "success");
        })
}


function deleteAgenda(id){

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
            console.log(response);
            showAlertMessageFlash(response.message, "success");
        })
}