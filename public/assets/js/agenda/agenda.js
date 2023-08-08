document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');

    var calendar = new FullCalendar.Calendar(calendarEl, {
      plugins: [ 'interaction', 'dayGrid' ],
      themeSystem: 'bootstrap5',
      defaultDate: '2023-02-12',
      editable: true,
      eventLimit: true, // allow "more" link when too many events
      events: [
        {
          title: 'All Day Event',
          start: '2023-02-01'
        },
        {
          title: 'Long Event',
          start: '2023-02-07',
          end: '2023-02-10'
        },
        {
          groupId: 999,
          title: 'Repeating Event',
          start: '2023-02-09T16:00:00'
        },
        {
          groupId: 999,
          title: 'Repeating Event',
          start: '2023-02-16T16:00:00'
        },
        {
          title: 'Conference',
          start: '2023-02-11',
          end: '2023-02-13'
        },
        {
          title: 'Meeting',
          start: '2023-02-12T10:30:00',
          end: '2023-02-12T12:30:00'
        },
        {
          title: 'Lunch',
          start: '2023-02-12T12:00:00'
        },
        {
          title: 'Meeting',
          start: '2023-02-12T14:30:00'
        },
        {
          title: 'Happy Hour',
          start: '2023-02-12T17:30:00'
        },
        {
          title: 'Dinner',
          start: '2023-02-12T20:00:00'
        },
        {
          title: 'Birthday Party',
          start: '2023-02-13T07:00:00'
        },
        {
          title: 'Click for Google',
          url: 'http://google.com/',
          start: '2023-02-28'
        }
      ]
    });

    calendar.render();
    bindActionAgenda();
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


///// CANTCEL CREATE AGENDA ------------------------------------------------------
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

if( document.querySelector(".cta_confirm_create_agenda_jheo_js")){
    document.querySelector(".cta_confirm_create_agenda_jheo_js").addEventListener("click", (e) => {
        
        let state= true;

        const agenda= [
            {"title" : document.querySelector(".nameEvent_jheo_js").value},
            {"type" : document.querySelector(".typeEvent_jheo_js").value},
            {"address" : document.querySelector(".lieuEvent_jheo_js").value},
            {"desc" : document.querySelector(".eventDesc_jheo_js").value},
            {"participant" : document.querySelector(".nbrParticipant_jheo_js").value},
            {"dateStart" : document.querySelector(".eventStart_jheo_js").value},
            {"dateEnd" : document.querySelector(".eventEnd_jheo_js").value},
            {"timeStart" : document.querySelector(".timeStart_jheo_js").value},
            {"timeEnd" : document.querySelector(".timeEnd_jheo_js").value},
            {"file" : document.querySelector('.image_upload_input_jheo_js').value},
            {"resto" : "resto"},
        ];

        agenda.forEach(item => {
            const key= Object.keys(item)[0];
            if( item[key] === ''){
                state= false;
            }
        })

        if( !state ){
            e.preventDefault()

        }else{
            console.log(agenda)
            alert("Gooooo")
        }

    })
}


function bindActionAgenda(){
    if( document.querySelector('.td_day_jheo_js')){
        const all_td = document.querySelectorAll('.td_day_jheo_js');

        all_td.forEach(index => {
            index.addEventListener('click',() => {
                if( index.classList.contains("fc-event-container")){
                    document.querySelector('.show_modal_showAgenda_jheo_js').click();
                }else{
                    document.querySelector('.show_modal_createAgenda_jheo_js').click();
                }
            })
        })
    }
}


