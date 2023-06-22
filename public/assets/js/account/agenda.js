/**create event */
let contenu = ""
let dateEvent = ""
let restaurant = ""
let doneTypingInterval = 3000;
let typingTimer
showAgenda()
liveSearch()

if(document.querySelector(".btn-creat-event"))
  document.querySelector(".btn-creat-event").onclick = (e) => {
  
    showCalendar(document.querySelector("body > div.content-agenda"))
  }

if (document.querySelector(".btn-view-event")) {
  document.querySelector(".btn-view-event").onclick = (e) => {
     
        showAgenda()
    
  }
}
if (document.querySelectorAll("#eventType")) {
  document.querySelector("#eventType").addEventListener("change", (e) => {
    if (document.querySelector("#eventType").value === "2") {
      document.querySelector("#autreEvent").style.display = "block"
      document.querySelector("#choix-resto-type-past").style.display = "none"
    } else if (document.querySelector("#eventType").value === "1") {
      document.querySelector("#choix-resto-type-past").style.display = "block"
      document.querySelector("#autreEvent").style.display="none"
    }
  });
  
}

if (document.querySelectorAll("#choixRestoPast")) {
  document.querySelector("#choixRestoPast").addEventListener("change", (e) => {
    if (document.querySelector("#choixRestoPast").value === "1") {
      document.querySelector("#content-list-pastille").style.display = "block"
      document.querySelector("#lieuEventNonPastilled").classList.toggle("no-hidden")
      document.querySelector("#lieuEventNonPastilled").classList.toggle("hidden")
    } else if (document.querySelector("#choixRestoPast").value === "2") {
      document.querySelector("#lieuEventNonPastilled").classList.toggle("no-hidden")
      document.querySelector("#lieuEventNonPastilled").classList.toggle("hidden")
      document.querySelector("#content-list-pastille").style.display="none"
    }
  });
}



if (document.querySelector("#autreEvent")) {
  document.querySelector("#autreEvent").onchange = (e) => { 
      contenu=e.target.value
  }
}
if (document.getElementById("valid_agenda")) {
  document.getElementById("valid_agenda").onclick = (e) => {
    e.preventDefault();
    const formData = new FormData(document.querySelector("#form_agenda"))
    for (const [key, value] of formData) {
      console.log(`${key}: ${value}\n`);
    }
    let confidentiality = { confidentility: "moi uniquement", code: 1 }
    let eventType = { type: "repas", code: 1 }
    // console.log(formData.get("confidentialite"),formData.get("eventType"))
    switch (formData.get("confidentialite")) {
      case "2":{
        confidentiality = Object.assign({}, confidentiality, {
          confidentility: "Tribu-G",
          code: 2
        })
        break
      }
      case "3": {
        confidentiality = Object.assign({}, confidentiality, {
          confidentility: "Tribu-T",
          code: 3
        })
        break
      }
    }
    switch (formData.get("eventType")) {
      case "2":{
        eventType = Object.assign({}, eventType, {
          type: contenu,
          code: 2
        })
      }
      
    }
    sendAgenda(formData,confidentiality,eventType)
  }
}
/*end*/

if (document.querySelector("#close-modal-agenda")) {
  document.querySelector("#close-modal-agenda").onclick = () => { 
    const cookieDialog = document.getElementById("cookie-dialog");
    cookieDialog.close()
  }
}
if (document.querySelector(".message")) {
  const textarea = document.querySelector(".message");
  textarea.addEventListener("keyup", (e) => {
    textarea.style.height = "72px";
    let scHeight = e.target.scrollHeight;
    textarea.style.height = `72px`;

  });
}

inputFileModifName('.inputfile')


/*calendar section*/ 
function sendAgenda(formData,confidentiality,eventType){

  const fr = new FileReader()
  fr.addEventListener("load", (e) => { 

    const param = {
      fileBTOA: e.target.result,  
      fileName: formData.get("fileEvent").name,
      fileType: formData.get("fileEvent").type,
      fileSize: formData.get("fileEvent").size,
      agendaMessage: formData.get("message"),
      confidentiality: JSON.stringify(confidentiality),
      eventType: JSON.stringify(eventType),
      dateEvent: dateEvent,
      adresse: formData.get('adresseEvent'),
      restaurant: restaurant,
      maxParticipant: formData.get("nbrMax"),
      heureD: formData.get("timeDebut"),
      heureF: formData.get("timeFin")
      
    }
    console.log(param)
     const request = new Request("/user/create-event/agenda", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'  
            },
            body: JSON.stringify(param)
        })
    fetch(request).then(r => {
          createChargement(document.querySelector(".loader_agenda"), "chargement_content chargement_agenda")
            if(r.status === 200 && r.ok){
              const cookieDialog = document.getElementById("cookie-dialog");
              cookieDialog.close()
              document.querySelector(".btn-view-event").click()
              deleteChargement("chargement_agenda")
            }
        })
  })
  fr.readAsDataURL(formData.get("fileEvent"))
}
function plotDays(daysInMonth,
  firstDayPosition,
  monthNames,
  dateElement,
  calendarTitle,
  currentDate) {
  let count = 1;
  dateElement.innerHTML = "";

  console.log()
  let prevMonthLastDate = currentDate.subtract(1, "month").endOf("month").$D;
  let prevMonthDateArray = [];

  //plot prev month array
  for (let p = 1; p < firstDayPosition; p++) {
    prevMonthDateArray.push(prevMonthLastDate--);
  }
  prevMonthDateArray.reverse().forEach(function (day) {
    dateElement.innerHTML += `<button class="calendar-dates-day-empty">${day}</button>`;
  });

  //plot current month dates
  for (let i = 0; i < daysInMonth; i++) {
    dateElement.innerHTML += `<button class="calendar-dates-day" data-cookie-action="show-dialog" data-date="${currentDate.$y}-${currentDate.$M+1}-${count}" >${count++}</button>`;
  }

  //next month dates
  let diff =
    42 - Number(document.querySelector(".calendar-dates").children.length);
  let nextMonthDates = 1;
  for (let d = 0; d < diff; d++) {
    document.querySelector(
      ".calendar-dates"
    ).innerHTML += `<button class="calendar-dates-day-empty">${nextMonthDates++}</button>`;
  }

  //month name and year
  calendarTitle.innerHTML = `${
    monthNames[currentDate.month()]
  } - ${currentDate.year()}`;
}

//highlight current date
function highlightCurrentDate(dateElement,dateItems,currentDate) {
  dateItems = document.querySelectorAll(".calendar-dates-day");
  if (dateElement && dateItems[currentDate.$D - 1]) {
    dateItems[currentDate.$D - 1].classList.add("today-date");
  }
}


//set next and prev month
function setSelectedMonth(daysInMonth,
  firstDayPosition,
  currentDate,
  monthNames,
  dateElement,
  daysInMonth,
  newMonth,calendarTitle) {
  daysInMonth = newMonth.daysInMonth();
  firstDayPosition = newMonth.startOf("month").day();
  currentDate = newMonth;
  plotDays(daysInMonth,firstDayPosition,monthNames,dateElement,calendarTitle,currentDate)
}

/**end calendar*/

/** tiimeline function sectio*/
function showTimeLine(parentElement, datas) { 
  parentElement.classList.add("for-time-line");
  parentElement.innerHTML = `<h2 class="h2-agenda-title">Mon agenda</h2>`;
  let dialogContainer = document.createElement("div")
  dialogContainer.setAttribute("class", "dialog_container")
  document.body.appendChild(dialogContainer);
  let k = 1
  if (datas.length > 0) {
      for (let i = 0; i < datas.length; i++) { 
        const dataInter = datas[i];
        let divTimeLineContent = document.createElement("div");
        divTimeLineContent.innerHTML = `
          <h3 style="cursor: pointer;">Les événement du ${dataInter[0].date} <i class="fa-solid fa-plus plus-agenda"></i></h3>
                                        
        `
        let ul = document.createElement("ul");
        ul.setAttribute("class", "timeline hidden");
        parentElement.appendChild(divTimeLineContent);
        divTimeLineContent.appendChild(ul)
        ul.innerHTML=`<li class="timeline__line"></li>`
        for (let j = 0; j < dataInter.length; j++) {

          const data= dataInter[j];
          const eventType = JSON.parse(data.type)["type"]
          const eventTypeCode = JSON.parse(data.type)["code"]
          const confidentialityCode=JSON.parse(data.confidentialite)["code"]
          let classTimeLine="timeline__item"
          if (j === dataInter.length - 1)
            classTimeLine = "timeline__item end"
          let s1 = confidentialityCode === 1 ? "selected" :""
          let s2 =  confidentialityCode === 2 ? "selected" :""
          let s3 =  confidentialityCode === 3 ? "selected" :""
          
          let ev1 = eventTypeCode === 1 ? "selected" :""
          let ev2 = eventTypeCode === 2 ? "selected" : ""
          let haveFile= (data.file_path === "/uploads/users/agenda/files/document/" || data.file_path === "/uploads/users/agenda/files/img/") ? false: true
          console.log(data.status)
          let isEnd = (data.status == 0) ? "<span class='bg-danger'> événement términé</span>" : "";
          

          /// is this event sharing------
          let dataRankForShare= `agenda_share_${k}`;
          let collapseOnleft= (isEnd === "") ? `
            <div class="popup_partage hidden_partage" id='partage_agenda_${k}'>
                <p> Vous souhaitez partager ! Pour tous ? </p>
                <i class="fa-solid fa-lock-open hidden_partage fa_solid_open_dialog_for_share_js_jheo" data-rank="${dataRankForShare}"></i>
                <div>
                    <button class="cta_btn_partage cta_btn_partage_js_jheo" data-is-for-all="1" data-agenda-id='${data.id}'>Oui</button>
                    <button class="cta_btn_partage cta_btn_partage_js_jheo" data-is-for-all="0" data-agenda-id='${data.id}'>Non</button>
                </div>
            </div>
          ` : "";
          let isAlreadyShare= data.isAlreadyShare ? "red_color" : "";
          let isShare= (isEnd === "") ? `<i class="fa-solid fa-share-nodes cta_share_agenda ${isAlreadyShare} share_agenda_${data.id}" id="cta_share_agenda_${k}" data-agenda-share="${k}" ></i>`: "";
          /// ---------------------------

              
          
          
          
          let paperclip = ""
          if (haveFile) {
            paperclip=`<a href="/public${data.file_path}" download><i class="fa-solid fa-paperclip"></i></a>`
          }
          let autre = eventTypeCode === 2 ? eventType : ""
          let dialogModif = `
            <div class="modale-agenda">
              <dialog id="modif-dialog-${k}" class="cookie flow-content" data-spacing="lg">
                  <div class="loader_agenda_modif${k}"></div>
                  <i class="fa-solid fa-x i-x" id="close-modal-agenda-modif" onclick="closeModifAgenda(${k})"></i>
                  <form id="form_agenda-${k}">
                      <div class="item-mess wrapper">
                          <h2>Message</h2>
                              <textarea  name="message${k}" id="message${k}" class="form__input" >${data.message}</textarea>
                          </div>
                      <div class="item-file">
                        <input type="file" name="fileEvent${k}" id="file-${k}" accept="image/*,application/*" class="inputfile-modified inputfile-${k}" data-multiple-caption="{count} files selected" multiple/>
                          <label for="file-${k}"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="17" viewBox="0 0 20 17">
                                  <path
                                      d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z" />
                              </svg> <span>choisissez un fichier&hellip;</span></label>
                  
                      </div>
                      <div class="">
                          <div class="conf">
                              <label>Confidentialité</label>
                              <div class="item-confid select">
                                  
                                  <select name="confidentialite${k}" id="confidentialite${k}">
                                      <option value="1" ${s1}>Moi uniquement</option>
                                      <option value="2" ${s2}>Tribu-G</option>
                                      <option value="3" ${s3}>Tribu-T</option>
                                  </select>
                              </div>
                          </div>
                          <div class="tipeE">
                              <label>Type evenement</label>
                              <div class="item-confid select">

                                  <select name="eventType${k}" id="eventType-${k}">
                                      <option class="opt" value="1"  ${ev1}>Repas</option>
                                      <option class="opt" value="2" ${ev2}>Autres</option>
                                  </select>
                              </div>
                              

                          </div>
                      </div>
                      <div>
                          <input type="text" class="form__input form__input_autre" placeholder="Veuillez préciser l'événement" name="autreEvent" id="autreEvent${k}" value="${autre}">
                          <div class="resto-pasti" id="choix-resto-type-past${k}">
                            <label>Choix restaurant</label>
                            <div class="item-confid select">

                                <select name="choixRestoPast${k}" id="choixRestoPast${k}" >
                                    <option class="choix-resto" value="1">Restaurants pastillés</option>
                                    <option class="choix-resto" value="2">Restaurants non pastillés</option>
                                </select>
                            </div>
                            <div class="resto-pasti" id="content-list-pastille${k}">
                                <div class="item-confid ">
                                    <ul class="list-pastille">
                                        <li class="deroulant"><a class="a" href="#">liste des restaurants pastillés </a>
                                        <ul class="sous" id="list-pastille${k}"></ul>
                                    </ul>
                                </div>
                            </div>
                            <input type="text" class="form__input lieu_event hidden" placeholder="Veuillez entrer le nom du restaurant" name="lieuEventNonPastilled" id="lieuEventNonPastilled${k}">
                          </div>
                          <input type="text" class="form__input autre_event" placeholder="Veuillez entrer l'adresse" name="adresseEvent${k}" id="adresseEvent${k}">
                          <input type="number" class="form__input nbr_max_event" placeholder="Veuillez entrer le nombre maximum de partucipant" name="nbrMax${k}" id="nbrMax${k}">
                      </div>
                      <div>
                          <label for="timeDebut">Début :</label>
                          <input type="time" name="timeDebut${k}" id="timeDebut${k}" class="form__input form__input_time" value="${data.heure_debut}">
                          <label for="timeFin">Fin :</label>
                          <input type="time" name="timeFin${k}" id="timeFin${k}" class="form__input form__input_time" value="${data.heure_fin}">
                      </div>
                      <div class="d-flex-modif">
                          <button type="submit" id="modif_agenda-${k}" class="btn-modif-agenda" data-rank="${data.id}" data-pos="${k}">Modifier</button>
                          <button type="submit" id="fin_agenda-${k}" class="btn-fin-agenda" data-rank="${data.id}" data-pos="${k}">Mettre fin à l'événement</button>
                      </div>
                  </form>
              </dialog>
          </div>  
          `


          //// create a new dialog for share ---------------------------
          let dialogShare= `
          <div class="modale-share-agenda">
              <dialog id="share_agenda-dialog-${dataRankForShare}" class="cookie flow-content" data-spacing="lg">

                  <i class="fa-solid fa-x x_close_agenda_share" id="close-modal-${dataRankForShare}" onclick="closeShareAgenda('${dataRankForShare}')"></i>
                  <div class="content_dialog content_dialog_for_share_agenda_share_${dataRankForShare}_js_jheo">
                      <h3 class="text-primary">List</h3>
                  </div>
              </dialog>
          </div>  
        `
        //// ---------------------------------------------------------


          console.log(data.file_path)
          let li =` <li class="${classTimeLine}">
                        <div class="info">
                            <div class="dot"></div>
                            <time class="time">${data.heure_debut}</time>
                            <h4 class="speaker">${eventType}</h4>
                            <h4 class="title">
                                ${paperclip}
                                <i class="fa-solid fa-plus modal-modif-agenda" data-rank="${k}"></i>
                                ${isShare}
                                ${isEnd}
                              
                            </h4>
                        </div>
                        ${collapseOnleft}
                        <div class="content">
                          ${data.message}
                        </div>
                    </li>`
          ul.innerHTML += li
          dialogContainer.innerHTML += dialogModif  + " " + dialogShare;
          
          k++;
        }; 
          
          
      };
        
        if (document.querySelectorAll(".plus-agenda").length>0) {
          document.querySelectorAll(".plus-agenda").forEach(item => {
            item.onclick = (e) => {
              e.target.parentNode.parentNode.querySelector(".timeline ").classList.toggle("hidden")
              e.target.classList.toggle("fa-plus")
              e.target.classList.toggle("fa-minus")
            };
          });
        
      };
      let modalModif = document.querySelectorAll(`.modal-modif-agenda`) 
      inputFileModifName('.inputfile-modified')
      console.log(modalModif)
      if (modalModif.length > 0) 
        modalModif.forEach(item => {
            item.onclick = (e) => {
              let k=item.dataset.rank
              const cookieDialog = document.getElementById("modif-dialog-" + k);
              let selectType = document.querySelector("#eventType-" + k)
              console.log(selectType.selectedIndex)
              if (selectType.selectedIndex === 1) {
                  document.querySelector("#autreEvent"+k).style.display = "block"
              }
              if (document.querySelector("#autreEvent"+k)) {
                contenu=document.querySelector("#autreEvent"+k).value
                document.querySelector("#autreEvent"+k).onchange = (e) => { 
                    contenu=e.target.value
                }
              }
              if (document.querySelectorAll("#eventType"+k)) {
                  document.querySelector("#eventType-"+k).addEventListener("change", (e) => {
                    if (document.querySelector("#eventType-"+k).value === "2") {
                      document.querySelector("#autreEvent"+k).style.display = "block"
                      document.querySelector("#choix-resto-type-past"+k).style.display = "none"
                    }else if (document.querySelector("#eventType-"+k).value === "1"){
                      document.querySelector("#choix-resto-type-past"+k).style.display = "block"
                      document.querySelector("#autreEvent"+k).style.display="none"
                    }
                  });
                
              }
              if (document.querySelectorAll("#choixRestoPast"+k)) {
                document.querySelector("#choixRestoPast"+k).addEventListener("change", (e) => {
                  if (document.querySelector("#choixRestoPast"+k).value === "1") {
                    document.querySelector("#content-list-pastille"+k).style.display = "block"
                    document.querySelector("#lieuEventNonPastilled"+k).classList.toggle("no-hidden")
                    document.querySelector("#lieuEventNonPastilled"+k).classList.toggle("hidden")
                  } else if (document.querySelector("#choixRestoPast"+k).value === "2") {
                    document.querySelector("#lieuEventNonPastilled"+k).classList.toggle("no-hidden")
                    document.querySelector("#lieuEventNonPastilled"+k).classList.toggle("hidden")
                    document.querySelector("#content-list-pastille"+k).style.display="none"
                  }
                });
              }

              if (cookieDialog)
                cookieDialog.showModal();
              
            const request = new Request("/user/agenda/restpastil", {
              method: "GET",
              headers: {
                'Accept': 'application/json',
                "Content-Type": "application/json; charset=utf-8"
              }
            })
            fetch(request).then(r => {
              createChargement(document.querySelector(".loader_agenda_modif"+k), "chargement_content chargement_agenda")
              if (r.status === 200 && r.ok) {
                  r.json().then(json => {
                    showRestoPastilled(json,document.querySelector("#list-pastille"+k),k);
                    deleteChargement("chargement_agenda")
                  });
              }
            })
            liveSearch("lieuEventNonPastilled"+k,"dialog-apropos-resto-agenda", `#choix-resto-type-past${k}`,`loader_agenda_modif${k}`,k)
              
              
          }; 
        })


      ///---- share agenda ------------------------

      if( document.querySelectorAll(".cta_share_agenda")){
        document.querySelectorAll(".cta_share_agenda").forEach(cta_share_agenda => {
            const agenda_to_share= cta_share_agenda.getAttribute("data-agenda-share");
            
            cta_share_agenda.addEventListener("click" , () => {
                const block_share_agenda= document.querySelector(`#partage_agenda_${agenda_to_share}`)
                block_share_agenda.classList.toggle("show_partage");
                block_share_agenda.classList.toggle("hidden_partage");
            })

            bindEventAboutSharingEvent(agenda_to_share); 
        })
      }

      let modalShare = document.querySelectorAll(`.modal-share-agenda`) 
      if (modalShare.length > 0) 
        modalShare.forEach(item => {
          item.onclick = (e) => {
            let k=item.dataset.rank
            const sharedDialog = document.getElementById("share_agenda-dialog-" + k);
            if (sharedDialog)
                sharedDialog.showModal();
          }; 

      })
      //---------------------------

      let finAgendas = document.querySelectorAll(".btn-fin-agenda")
      if (finAgendas.length > 0)
        finAgendas.forEach(item => {
          item.addEventListener("click", e => {
              e.preventDefault();
              let k = item.dataset.pos
              let id = item.dataset.rank
              endOfEvent(id,k)
          });
        });
      let modifBtns = document.querySelectorAll(".btn-modif-agenda")
      if(modifBtns.length > 0) {
          modifBtns.forEach(item => { 
              item.onclick = (e) => {
                  e.preventDefault();
                  let k = item.dataset.pos
                  let id= item.dataset.rank
                  let form = document.querySelector("#modif-dialog-" + k +"> form ")
                  let formData = new FormData(form);
                  let confidentiality = { confidentility: "moi uniquement", code: 1 }
                  let eventType = { type: "repas", code: 1 }
                  // console.log(formData.get("confidentialite"),formData.get("eventType"))
                  switch (formData.get("confidentialite"+k)) {
                    case "2":{
                      confidentiality = Object.assign({}, confidentiality, {
                        confidentility: "Tribu-G",
                        code: 2
                      })
                      break
                    }
                    case "3": {
                      confidentiality = Object.assign({}, confidentiality, {
                        confidentility: "Tribu-T",
                        code: 3
                      })
                      break
                    }
                  }
                  switch (formData.get("eventType"+k)) {
                    case "2":{
                      eventType = Object.assign({}, eventType, {
                        type: contenu,
                        code: 2
                      })
                    }
                  } 
                  updateEvent(formData,confidentiality,eventType,id,k)
                
                
              }
          })
      }
  } else {
     showCalendar(document.querySelector("body > div.content-agenda"))
  }
  

       
}

function updateEvent(formData,confidentiality,eventType,id,k) {
    const fr = new FileReader()
    fr.addEventListener("load", (e) => { 

      const param = {
        fileBTOA: e.target.result,  
        fileName: formData.get("fileEvent"+k).name,
        fileType: formData.get("fileEvent"+k).type,
        fileSize: formData.get("fileEvent"+k).size,
        agendaMessage: formData.get("message"+k),
        confidentiality: JSON.stringify(confidentiality),
        eventType: JSON.stringify(eventType),
        heureD: formData.get("timeDebut"+k),
        heureF: formData.get("timeFin"+k),
        adresse: formData.get('adresseEvent'+k),
        restaurant: restaurant,
        max_participant: formData.get("nbrMax"+k),
        id:id
        
      }
      console.log(param)
      const request = new Request("/user/agenda/up", {
              method: "POST",
              headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'  
              },
              body: JSON.stringify(param)
          })
      fetch(request).then(r => {
            createChargement(document.querySelector(".loader_agenda_modif"), "chargement_content chargement_agenda")
            if(r.status === 200 && r.ok){
              closeModifAgenda(k)
              document.querySelector(".btn-view-event").click()
              deleteChargement("chargement_agenda")
            }
        })
    })
  console.log(formData.get("fileEvent"+k))
    fr.readAsDataURL(formData.get("fileEvent"+k))
  
}

function endOfEvent(id,k) {
  const param = {
      id:id
  }
  const request = new Request("/user/agenda/up/status", {
              method: "POST",
              headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'  
              },
              body: JSON.stringify(param)
  })
  fetch(request).then(r => {
    createChargement(document.querySelector(".loader_agenda_modif"), "chargement_content chargement_agenda")
    if(r.status === 200 && r.ok){
      closeModifAgenda(k)
      document.querySelector(".btn-view-event").click()
      deleteChargement("chargement_agenda")
    }
  })
}

function closeModifAgenda(k) { 
  const cookieDialog = document.getElementById("modif-dialog-" + k);
  cookieDialog.close()
}


function closeShareAgenda(k) { 
  const cookieDialog = document.getElementById("share_agenda-dialog-" + k);
  cookieDialog.close()
}




/**end section */

/*event creation*/
function showCalendar(parentElement) {
  parentElement.classList.remove("for-time-line");
  parentElement.innerHTML=`<div id="calendar" class="calendar">
                              <div class="calendar-title">
                                <div class="calendar-title-text"></div>
                                <div class="calendar-button-group">
                                  <button id="prevMonth">&lt;</button>
                                  <button id="today">Aujourd'hui</button>
                                  <button id="nextMonth">&gt;</button>
                                </div>
                              </div>
                              <div class="calendar-day-name"></div>
                              <div class="calendar-dates"></div>
                            </div>`
    let currentDate = dayjs();
    let daysInMonth = dayjs().daysInMonth();
    let firstDayPosition = dayjs().startOf("month").day();
    let monthNames = [
      "Janvier",
      "Février",
      "Mars",
      "Avril",
      "Mai",
      "Juin",
      "Juillet",
      "Août",
      "Septembre",
      "Octobre",
      "Novembre",
      "Decembre"
    ];
    let weekNames = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
    let dateElement = document.querySelector("#calendar .calendar-dates");
    let calendarTitle = document.querySelector(".calendar-title-text");
    let nextMonthButton = document.querySelector("#nextMonth");
    let prevMonthButton = document.querySelector("#prevMonth");
    let dayNamesElement = document.querySelector(".calendar-day-name");
    let todayButton = document.querySelector("#today");
    let dayInCurrentCalendar =null;
    let dateItems = null;
    let newMonth = null;

    weekNames.forEach(function (item) {
      dayNamesElement.innerHTML += `<div>${item}</div>`;
    });

    //init calendar
    plotDays(daysInMonth, firstDayPosition,monthNames,dateElement,calendarTitle,currentDate);
    setTimeout(function () {
      highlightCurrentDate(dateElement,dateItems,currentDate);
    }, 50);
    //next month button event
    nextMonthButton.addEventListener("click", function () {
      newMonth = currentDate.add(1, "month").startOf("month");//get next month
      currentDate = newMonth
      setSelectedMonth(daysInMonth, firstDayPosition, currentDate, monthNames, dateElement,daysInMonth,newMonth,calendarTitle);
      dayInCurrentCalendar = document.querySelectorAll(".calendar-dates-day")
      createEvent(dayInCurrentCalendar)
    });

    //prev month button event
    prevMonthButton.addEventListener("click", function () {
      newMonth = currentDate.subtract(1, "month").startOf("month"); //get prev month
      currentDate = newMonth
      setSelectedMonth(daysInMonth, firstDayPosition, currentDate, monthNames, dateElement,daysInMonth,newMonth,calendarTitle);
      dayInCurrentCalendar = document.querySelectorAll(".calendar-dates-day")
      createEvent(dayInCurrentCalendar)
    });

    //today button event
    todayButton.addEventListener("click", function () {
      newMonth = dayjs();
      currentDate = newMonth
      setSelectedMonth(daysInMonth, firstDayPosition, currentDate, monthNames, dateElement,daysInMonth,newMonth,calendarTitle);
      dayInCurrentCalendar = document.querySelectorAll(".calendar-dates-day")
      createEvent(dayInCurrentCalendar)
      setTimeout(function () {
         highlightCurrentDate(dateElement,dateItems,currentDate);
      }, 50);
    });
   dayInCurrentCalendar = document.querySelectorAll(".calendar-dates-day")
   createEvent(dayInCurrentCalendar)
}
function createEvent(elements) {
  elements.forEach(day => {
      day.addEventListener("mouseenter", (event) => {
          event.target.classList.toggle("day-selected")

      })
       day.addEventListener("mouseout", (event) => {
          event.target.classList.toggle("day-selected")

      })
    day.onclick = (e) => { 
      const cookieDialog = document.getElementById("cookie-dialog");
      dateEvent = e.target.dataset.date
      const request = new Request("/user/agenda/restpastil", {
          method: "GET",
          headers: {
            'Accept': 'application/json',
            "Content-Type": "application/json; charset=utf-8"
          }
      })
      fetch(request).then(r => {
        createChargement(document.querySelector(".loader_agenda"), "chargement_content chargement_agenda")
        if (r.status === 200 && r.ok) {
            r.json().then(json => {
              showRestoPastilled(json);
              deleteChargement("chargement_agenda")
            });
        }
      })
      if(cookieDialog)
          cookieDialog.showModal();
    }
     
      
  })
}

function inputFileModifName(cssSelector) {
  if (document.querySelectorAll(cssSelector)) {
    var inputs = document.querySelectorAll(cssSelector);
   
  Array.prototype.forEach.call(inputs, (input) =>{
    var label = input.nextElementSibling
   var labelVal = label.innerHTML;

    input.addEventListener('change', function (event) {
      var fileName = '';
      
      console.log(event.target.files)
      if (event.target.files && event.target.files > 1)
        fileName = (e.getAttribute('data-multiple-caption') || '').replace('{count}', event.target.files);
      else
        fileName = event.target.value.split('\\').pop();
      console.log(fileName)
      if (fileName)
        label.querySelector('span').innerHTML = fileName;
      else
        label.innerHTML = labelVal;
    });

    // Firefox bug fix
    input.addEventListener('focus', function () { input.classList.add('has-focus'); });
    input.addEventListener('blur', function () { input.classList.remove('has-focus'); });
  });
}
}
//showRestoPastilled(json,document.querySelector("#list-pastille-modif")) {

/**
 * 
 * @param {*} array 
 * @param {*} container 
 * @param {int} k is rank of one dialog in list of dialogs at modified agenda
 */
function showRestoPastilled(array,container=document.querySelector("#list-pastille"),k=0) {
  array.forEach(a1 => {
    a1.forEach(a2 => {
      const logoPath = a2["path"]
      for (a of a2[0]) {
        console.log(a)
        let c = `<li class="" >
                  <a onclick="voirApropos('${a.id}')">${a.denomination_f} </a>  
                  <i class="fa-solid fa-plus plus-list-pastille" onclick="voirApropos('${a.id}','${a.globalNote}',${k})"></i>
                </li>`
        
        container.innerHTML += c;
      }
    });
  })
}


function voirApropos(a,gN=0,k=0) {

  document.querySelector("#dialog-apropos-resto-agenda").showModal()
  const request = new Request(`/user/resto/apropos/${a}`, {
          method: "GET",
          headers: {
            'Accept': 'application/json',
            "Content-Type": "application/json; charset=utf-8"
          }
      })
  fetch(request).then(r => { 
      createChargement(document.querySelector(".loader_agenda"), "chargement_content chargement_agenda")
        if (r.status === 200 && r.ok) {
            r.json().then(json => {
              console.log(json);
              showDetailResto(json[0],k);
              deleteChargement("chargement_agenda")
            });
      }

  })
}

function showDetailResto(a,k=0) {
  let  restaurant = parseInt(a.restaurant) === 1 ?`<i class="fa-solid fa-utensils"></i> restaurant`:"";
  let bar = parseInt(a.bar) === 1 ?`<i class="fa-solid fa-martini-glass-empty"></i> bar`:""
  let creperie = parseInt(a.creperie) === 1 ?`<i class="fa-solid fa-pancakes"></i> creperie`:""
  let fastFood = parseInt(a.fastFood) === 1 ?`<i class="fa-solid fa-burger"></i> fastFood`:""
  let pizzeria = parseInt(a.pizzeria) === 1 ?`<i class="fa-solid fa-pizza-slice"></i> pizzeria`:""
  let boulangerie =parseInt(a.boulangerie) === 1 ?`<i class="fa-solid fa-pie"></i> boulangerie`:""
  let Brasserie =parseInt(a.brasserie) === 1 ?`<i class="fa-solid fa-beer-mug-empty"></i> Brasserie`:""
  let cuisine_du_monde =parseInt(a.cuisineMonde) === 1 ?`<i class="fa-solid fa-hat-chef"></i> cuisine du monde`:""
  let cafe =parseInt(a.cafe) === 1 ?`<i class="fa-solid fa-coffee-pot"></i> café`:""
  let salon_de_the = parseInt(a.salonThe) === 1 ? `<i class="fa-solid fa-mug-tea"></i> salon de thé` : ""
  let site = a.site1 != "" ? `<a class="btn btn-success" href="${a.site1}" target="_blank">Lien :  site Web</a>` : ""
  let adresse = `${a.numvoie}  ${a.typevoie} ${a.nomvoie} ${a.codpost}  ${a.commune}`
  let btn= k===0 ? `setChoice('${a.id}','${a.denominationF}','${adresse}')` :`setChoice('${a.id}','${a.denominationF}','${adresse}',${k})`
  let c=`<div class="content_home responsif-none">
            <div id="close-detail-tous-resto">
              <i class="fa-solid fa-x i-apropos" id="close-dialog-apropos"></i>
            </div>
              <div class="left_content_home">
              <div>
                <div class="description" id="details-coord" data-toggle-id-resto="3309" data-toggle-id-dep="75" data-latitude="48.86184692382812" data-longitude="2.339128971099854" data-nom="DELICES\u0020DE\u0020MARENGO" data-codeinsee="75101">

                          <div class="content_titre_details">
                    
                              <div class="titre col text-center">
                      <h4>
                        ${a.denominationF}
                        <br>
                        ${adresse}
                      <span>
                          <a id="see-tom-js" class="see-avis" data-bs-toggle="modal" data-bs-target="#staticBackdrop">avis</a>
                        </span>

                      </h4>
                    </div>
                  </div>

                  <div class="p-4">
                      
                              <hr>
                    <div class="content_note">
                      <div class="start">
                        <i class="fa-solid fa-star" data-rank="1"></i>
                        <i class="fa-solid fa-star" data-rank="2"></i>
                        <i class="fa-solid fa-star" data-rank="3"></i>
                        <i class="fa-solid fa-star" data-rank="4"></i>

                      </div>

                      <div class="nombre_avis"></div>
                    </div>

                    <hr>
                    
                    <div class="content_activite">
                      <p class="activite">
                        <span class="fw-bold">Type restaurant:</span>
                        ${restaurant}
                        ${bar}
                        ${creperie}
                        ${fastFood}
                        ${pizzeria}
                        ${boulangerie}
                        ${Brasserie}
                        ${cuisine_du_monde}
                        ${cafe}
                        ${salon_de_the}
                      </p>
                    </div>

                              <div class="content_tow_cta">
                                    <div class="site_web non_active">
                              ${site}
                        </div>
                                </div>

                    <hr>

                    <div class="fonctionnalite">
                                  <h5>
                        Fonctionalités:
                      </h5>
                      <ul>
                         <li>${a.fonctionalite1}</li>
                      </ul>


                    </div>

                    <hr>

                    <div class="fourchette_de_prix">
                      <h5>
                        Fourchette de prix:
                      </h5>
                      <ul>
                         <li>${a.fourchettePrix1}</li>
                      </ul>
                    </div>

                    <hr>

                    <div class="horaire">
                      <h5>
                        Horaires :
                      </h5>
                      <ul>
                        <li>${a.horaires1}</li>
                      </ul>
                      <hr>

                    </div>

                    <div class="prestation">
                      <h5>
                        Prestation :
                      </h5>
                      <ul>
                        <li>${a.prestation1}</li>
                      </ul>
                      <hr>

                    </div>

                    <div class="regime_speciaux">
                      <h5>
                        Régime spécial :
                      </h5>
                      <ul>
                        <li>${a.regimeSpeciaux1}</li>
                      </ul>
                      <hr>

                    </div>

                    <div class="repas">
                      <h5>
                        Repas :
                      </h5>
                      <ul>
                         <li>${a.repas1}</li>
                      </ul>
                      <hr>

                    </div>

                    <div class="tel">
                      <h5>
                        Téléphone :
                      </h5>
                      <ul>
                        <li>${a.tel}</li>
                      </ul>
                      <hr>

                    </div>

                    <hr>

                        <div class="content_one_cta text-center">
                        <button class="btn btn-success btn-choise" id="choise-js" type="button" onclick="${btn}">choisir</button>
                      </div>
                              
                    
                  </div>
                </div>
              </div>
            </div>
</div>`
  document.querySelector("#dialog-apropos-resto-agenda > div").innerHTML = c
  
  if (document.querySelector("#close-dialog-apropos")) {
  document.querySelector("#close-dialog-apropos").onclick = () => {
    document.querySelector("#dialog-apropos-resto-agenda").close()
  }
}
}



function showListResto(json,container=document.querySelector("#dialog-apropos-resto-agenda > div"),k=0) {
  let c =""
  if (k === 0) {
       c = `<li class="" >
            <a onclick="voirApropos('${json.id}')">${json.denominationF} </a>  
            <i class="fa-solid fa-plus plus-list-non-pastille" onclick="voirApropos('${json.id}')"></i>
          </li>`
  } else {
     c = `<li class="" >
            <a onclick="voirApropos('${json.id}',0,'${k}')">${json.denominationF} </a>  
            <i class="fa-solid fa-plus plus-list-non-pastille" onclick="voirApropos('${json.id}',0,${k})"></i>
          </li>`
  }
  
    container.innerHTML += c;
}


function setChoice(a = 0, b, c, k = 0) {
  if(document.querySelector("#adresseEvent"))
    document.querySelector("#adresseEvent").value = c
  if(document.querySelector("#adresseEvent"+k))
    document.querySelector("#adresseEvent" + k).value = c
  if(document.querySelector("#content-list-pastille > div > ul > li>a"))
    document.querySelector("#content-list-pastille > div > ul > li>a").innerText = b
  if(document.querySelector("#content-list-pastille"+k+"> div > ul > li>a"))
    document.querySelector("#content-list-pastille" + k + " > div > ul > li>a").innerText = b
  if( document.querySelector("#lieuEventNonPastilled"))
    document.querySelector("#lieuEventNonPastilled").value = b
  if( document.querySelector("#lieuEventNonPastilled"+k))
    document.querySelector("#lieuEventNonPastilled" + k).value = b
  if (document.querySelector(".resto-non-past")) {
    document.querySelector(".resto-non-past").classList.add("hidden") 
    if (document.querySelector("#lieuEventNonPastilled")) {
      document.querySelector("#lieuEventNonPastilled").addEventListener("keyup", (e) => {
        if (document.querySelector(".resto-non-past").classList.contains("hidden")) {
          document.querySelector(".resto-non-past").classList.remove("hidden")
        }
      })
    
    } else if (document.querySelector("#lieuEventNonPastilled"+k)) {
      document.querySelector("#lieuEventNonPastilled"+k).addEventListener("keyup", (e) => {
        if (document.querySelector(".resto-non-past").classList.contains("hidden")) {
          document.querySelector(".resto-non-past").classList.remove("hidden")
        }
      })
      
    }
  }
  restaurant=b
  document.querySelector("#dialog-apropos-resto-agenda").close()
}
function liveSearch(idInputRestaurant = "lieuEventNonPastilled",
  dialogToshow = "dialog-apropos-resto-agenda",
  containerClass = "#choix-resto-type-past",
  loader= "loader_agenda",
  k = 0) {
    console.log(containerClass)
    if (document.querySelector("#"+idInputRestaurant)) {
      document.querySelector("#" + idInputRestaurant).addEventListener("keyup", (e) => {
        
        clearTimeout(typingTimer)
        typingTimer = setTimeout(() => {

          const restName=e.target.value.normalize("NFD").replace(/\p{Diacritic}/gu, "")
          const request = new Request("/user/getRestoByName/" + restName ,{
            method: "GET",
            headers: {
              'Accept': 'application/json',
              "Content-Type": "application/json; charset=utf-8"
            }
          })
          fetch(request).then(r => { 
              createChargement(document.querySelector("."+loader), "chargement_content chargement_agenda")
                if (r.status === 200 && r.ok) {
                    r.json().then(json => {
                      if (json.length ===1) {
                        showDetailResto(json[0],k);
                        deleteChargement("chargement_agenda")
                        document.querySelector("#"+dialogToshow).showModal()
                        
                      } else if(json.length > 1) {
                        console.log(json)
                        const container =document.querySelector(containerClass)
                        container.innerHTML += `<ul id="rest_typing_${k}" class="resto-non-past"></ul>`

                        
                        for (i of json) {
                          showListResto(i, document.querySelector("#rest_typing_" + k), k)
                        }
                        deleteChargement("chargement_agenda") 
                      } else {
                        // toaster("INFO",
                        //   "nous n'avons pa pu trouver le restaurant dans nos donnés",
                        //  document.getElementById("cookie-dialog"))
                        restaurant = restName
                        deleteChargement("chargement_agenda")
                       
                      }
                      
                    });
              }
                
          })
        }, doneTypingInterval)
          
          
      })
      document.querySelector("#lieuEventNonPastilled").addEventListener("keydown", (e) => {
        clearTimeout(typingTimer)
      })
  }
}
function showAgenda() {
    const request1 = new Request(`/user/agenda`, {
        method: "GET",
        headers: {
            'Accept': 'application/json',
            "Content-Type": "application/json; charset=utf-8"
        }
    }) 
  fetch(request1).then((response) => {
      createChargement(document.querySelector(".loader_agenda"), "chargement_content chargement_agenda")
      if (response.status === 200 && response.ok) {
        response.json().then(json => {
            console.log(json)
            showTimeLine(document.querySelector("body > div.content-agenda"), json)
            deleteChargement("chargement_agenda")
        })
           
       }
    })
}



/**end */





function bindEventAboutSharingEvent(agendaToShare){
    const parent = document.querySelector(`#partage_agenda_${agendaToShare}`);
    parent.querySelectorAll(".cta_btn_partage_js_jheo").forEach(cta_btn_partage => {
        cta_btn_partage.addEventListener('click',() => {
            /// CREATE LOADER
            loaderForAgenda(document.querySelector(".content_loader_agenda_js_jheo"))
           

            /// ACTION 
            const isShareForAll= parseInt( cta_btn_partage.getAttribute("data-is-for-all")) === 1 ? true : false;

            if( isShareForAll ) { 
                const agendaID= parseInt(cta_btn_partage.getAttribute('data-agenda-id'));
                const shareFor= parseInt(cta_btn_partage.getAttribute("data-is-for-all"));

                shareAgenda(agendaID,shareFor, agendaToShare);
        
            }else{
                alert("On doit ouvrir un modal dialog (list des partisans)");
            }

            

            // const parent = document.querySelector(`#partage_agenda_${agendaToShare}`);
            // parent.classList.toggle("show_partage");
            // parent.classList.toggle("hidden_partage");
            // alert("is Share for all ? " + isShareForAll);


        })
    })
}



function shareAgenda(agendaID, shareFor, agendaToShare, tribuTChecked = null){
    const request = new Request("/user/agenda/shares", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'  
        },
        body: JSON.stringify({"agendaID" : agendaID, "shareFor" : shareFor, "tribuTChecked" : tribuTChecked })
    })

    fetch(request)
        .then(response=>response.json())
        .then(response => {
            ///remove loader
            removeLoaderForAgenda();

            //// close div content ask partage agenda for all
            const parent = document.querySelector(`#partage_agenda_${agendaToShare}`);
            parent.classList.toggle("show_partage");
            parent.classList.toggle("hidden_partage");


            if( response.hasOwnProperty("status") ){
                if(response.status === "shareSuccess" ){

                    document.querySelector(`.share_agenda_${agendaID}`).classList.add("red_color");
                    alert(response.message)
                }else if(response.status === "alreadyShare"){
                    
                    alert(response.message)
                }else if( response.status === "tribuT"){

                    if( tribuTChecked === null  ){ ///already select tribu T
                        const data_rank_modal= document.querySelector(".fa_solid_open_dialog_for_share_js_jheo").getAttribute("data-rank");
                        createHtmlViewListTribuT(data_rank_modal,response.all_tribugT,agendaID, shareFor, agendaToShare)
                        document.querySelector(`#share_agenda-dialog-${data_rank_modal}`).showModal();
                    }
                }

            }

        })
}




function createHtmlViewListTribuT(dataRankForShare, tabListTribuT,agendaID, shareFor, agendaToShare){

    let html_list_tribuT = "";

    let listTribuT= "";
    tabListTribuT.forEach(({table_name}) => {
        listTribuT += createSingleTribuT(table_name)
    })

    if( tabListTribuT.length >  0){
        html_list_tribuT= `
            <div class="content_list_tribuT">
                <div class="header_list_tribuT">
                    <h3> Liste de votre tribuT.</h3>
                </div>
                <div class="list_content_tribuT">
                    ${listTribuT}
                </div>
                <div class="footer_list_tribuT">
                    <button type="button" class="btn_primary_tribuT btn_send_share_agenda_tribuT_${dataRankForShare}_js_jheo">Envoyer</button>
                </div>
            </div>
        `

    }else{
        html_list_tribuT= `
            <div class="content_list_tribuT">
                <div class="alert_danger_tribuT">
                Vous n'avez pas encore créé de tribu T
                </div>
            </div>
        `
    }

    ///injection HTMl
    document.querySelector(`.content_dialog_for_share_agenda_share_${dataRankForShare}_js_jheo`).innerHTML = html_list_tribuT;

    ////bind event on list tribu T
    if( tabListTribuT.length >  0){
        bindEventForShareInTribuT(tabListTribuT, dataRankForShare,agendaID, shareFor, agendaToShare)
    }
}

function createSingleTribuT(table_name){
    return `
        <div class="form_check_tribuT">
            <input class="form_check_input_tribuT" type="checkbox" id="${table_name}">
            <label class="form_check_label_tribuT" for="${table_name}">
                ${table_name}
            </label>    
        </div>
    `
}

function bindEventForShareInTribuT(tabListTribuT, dataRankForShare,agendaID, shareFor, agendaToShare){

    /// handle event  click
    tabListTribuT.forEach(({table_name}) => {
        document.querySelector(`#${table_name}`).addEventListener("input",() => {
            if(document.querySelector(`#${table_name}`).checked){
                tabListTribuT.forEach(({table_name: item }) => {
                    if( item !== table_name && document.querySelector(`#${item}`).checked){
                        document.querySelector(`#${item}`).checked = false;
                    }
                })
            }
        })
    })


  if( document.querySelector(`.btn_send_share_agenda_tribuT_${dataRankForShare}_js_jheo`)){
      const cta_send_share_agenda_tribuT = document.querySelector(`.btn_send_share_agenda_tribuT_${dataRankForShare}_js_jheo`);
      
      cta_send_share_agenda_tribuT.addEventListener('click', () => {
            let tribuT_checked = "";
            tabListTribuT.forEach(({table_name: tribuT_item }) => {
                if(document.querySelector(`#${tribuT_item}`).checked){
                    tribuT_checked = tribuT_item;
                }
            })
    
            if( tribuT_checked !== ""){
                ///close modal dialog
                document.querySelector(`#close-modal-${dataRankForShare}`).click();

                /// CREATE LOADER
                loaderForAgenda(document.querySelector(".content_loader_agenda_js_jheo"))

                /// ACTION
                shareAgenda(agendaID, shareFor, agendaToShare,tribuT_checked)

            }else{
                alert("Veuillez selectionner un tribu T");
            }

      })
  }
}


function loaderForAgenda(parent, className){
    document.querySelector(".content_loader_agenda_js_jheo").classList.remove("hidden");
    document.querySelector(".content_agenda_js_jheo").classList.add("content_agenda_opacity")
    createChargement(parent, className);
}

function removeLoaderForAgenda(){
    document.querySelector(".content_loader_agenda_js_jheo").classList.add("hidden");
    document.querySelector(".content_agenda_js_jheo").classList.remove("content_agenda_opacity")
    deleteChargement();
}