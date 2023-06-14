/**create event */
let contenu = ""
let dateEvent = ""
let restaurant=""
if(document.querySelector(".btn-creat-event"))
  document.querySelector(".btn-creat-event").onclick = (e) => {
  
    showCalendar(document.querySelector("body > div.content-agenda"))
  }

if (document.querySelector(".btn-view-event")) {
  document.querySelector(".btn-view-event").onclick = (e) => {
     
        const request1 = new Request(`/user/agenda`, {
        method: "GET",
        headers: {
            'Accept': 'application/json',
            "Content-Type": "application/json; charset=utf-8"
        }
    }) 
    fetch(request1).then((response) => { 
      if (response.status === 200 && response.ok) {
        response.json().then(json => {
          console.log(json)
          showTimeLine(document.querySelector("body > div.content-agenda"),json)
        })
           
       }
    })
    
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
        fetch(request).then(r=>{
            if(r.status === 200 && r.ok){
              const cookieDialog = document.getElementById("cookie-dialog");
              cookieDialog.close()
              document.querySelector(".btn-view-event").click()
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
  let k=0
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
      let paperclip = ""
      if (haveFile) {
        paperclip=`<a href="/public${data.file_path}" download><i class="fa-solid fa-paperclip"></i></a>`
      }
      let autre = eventTypeCode === 2 ? eventType : ""
      let dialogModif = `
        <div class="modale-agenda">
          <dialog id="modif-dialog-${k}" class="cookie flow-content" data-spacing="lg">

              <i class="fa-solid fa-x" id="close-modal-agenda-modif" onclick="closeModifAgenda(${k})"></i>
              <form id="form_agenda-${k}">
                  <div class="item-mess wrapper">
                      <h2>Message</h2>
                          <textarea  name="message" id="message" class="form__input" >${data.message}</textarea>
                      </div>
                  <div class="item-file">
                    <input type="file" name="fileEvent" id="file-${k}" accept="image/*,application/*" class="inputfile-modified inputfile-${k}" data-multiple-caption="{count} files selected" multiple/>
                      <label for="file-${k}"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="17" viewBox="0 0 20 17">
                              <path
                                  d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z" />
                          </svg> <span>choisissez un fichier&hellip;</span></label>
              
                  </div>
                  <div class="d-flex">
                      <div class="conf">
                          <label>Confidentialité</label>
                          <div class="item-confid select">
                              
                              <select name="confidentialite" id="confidentialite">
                                  <option value="1" ${s1}>Moi uniquement</option>
                                  <option value="2" ${s2}>Tribu-G</option>
                                  <option value="3" ${s3}>Tribu-T</option>
                              </select>
                          </div>
                      </div>
                      <div class="tipeE">
                          <label>Type evenement</label>
                          <div class="item-confid select">

                              <select name="eventType" id="eventType-${k}">
                                  <option class="opt" value="1"  ${ev1}>Repas</option>
                                  <option class="opt" value="2" ${ev2}>Autres</option>
                              </select>
                          </div>
                          

                      </div>
                  </div>
                  <div>
                      <input type="text" class="form__input form__input_autre" placeholder="Veuillez préciser l'événement" name="autreEvent" id="autreEvent${k}" value="${autre}">
                  </div>
                
                  <div>
                      <label for="timeDebut">Début :</label>
                      <input type="time" name="timeDebut" id="timeDebut" class="form__input form__input_time" value="${data.heure_debut}">
                      <label for="timeFin">Fin :</label>
                      <input type="time" name="timeFin" id="timeFin" class="form__input form__input_time" value="${data.heure_fin}">
                  </div>
                  <div class="d-flex-modif">
                      <button type="submit" id="modif_agenda-${k}" class="btn-modif-agenda" data-rank="${data.id}" data-pos="${k}">Modifier</button>
                      <button type="submit" id="fin_agenda-${k}" class="btn-fin-agenda" data-rank="${data.id}" data-pos="${k}">Mettre fin à l'événement</button>
                  </div>
              </form>
          </dialog>
      </div>  
      `
      console.log(data.file_path)
      let li =` <li class="${classTimeLine}">
                    <div class="info">
                        <div class="dot"></div>
                        <time class="time">${data.heure_debut}</time>
                        <h4 class="speaker">${eventType}</h4>
                        <h4 class="title">
                            ${paperclip}
                            <i class="fa-solid fa-plus modal-modif-agenda" data-rank="${k}"></i>
                            ${isEnd}
                          
                        </h4>
                    </div>
                    <div class="content">
                      ${data.message}
                    </div>
                </li>`
      ul.innerHTML += li
      dialogContainer.innerHTML += dialogModif
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
                  
                }else {
                  document.querySelector("#autreEvent"+k).style.display="none"
                }
              });
            
          }
          if (cookieDialog)
              cookieDialog.showModal();
        }; 

    })
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
              updateEvent(formData,confidentiality,eventType,id,k)
            
            
          }
      })
  }

       
}

function updateEvent(formData,confidentiality,eventType,id,k) {
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
        heureD: formData.get("timeDebut"),
        heureF: formData.get("timeFin"),
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
          fetch(request).then(r=>{
            if(r.status === 200 && r.ok){
              closeModifAgenda(k)
              document.querySelector(".btn-view-event").click()
            }
        })
    })
  console.log(formData.get("fileEvent"))
    fr.readAsDataURL(formData.get("fileEvent"))
  
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
  fetch(request).then(r=>{
    if(r.status === 200 && r.ok){
      closeModifAgenda(k)
      document.querySelector(".btn-view-event").click()
    }
  })
}

function closeModifAgenda(k) { 
  const cookieDialog = document.getElementById("modif-dialog-" + k);
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
function showRestoPastilled(array,container=document.querySelector("#list-pastille")) {
  array.forEach(a1 => {
    a1.forEach(a2 => {
      const logoPath = a2["path"]
      for (a of a2[0]) {
        console.log(a)
        let c = `<li class="" >
                  <a onclick="voirApropos('${a.id}')">${a.denomination_f} </a>  
                  <i class="fa-solid fa-plus plus-list-pastille" onclick="voirApropos('${a.id},${a.globalNote}')"></i>
                </li>`
        container.innerHTML += c;
      }
    });
  })
}

function voirApropos(a,gN) {

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
              showDetailResto(json[0],gN);
              deleteChargement("chargement_agenda")
            });
      }

  })
}

function showDetailResto(a) {
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
  let adresse=`${a.numvoie}  ${a.typevoie} ${a.nomvoie} ${a.codpost}  ${a.commune}`
  let c=`<div class="content_home responsif-none">
            <div id="close-detail-tous-resto">
              <i class="fa-solid fa-x"></i>
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
                        <button class="btn btn-success" id="choise-js" type="button" onclick="setChoice('${a.id}','${a.denominationF}','${adresse}')">choisir</button>
                      </div>
                              
                    
                  </div>
                </div>
              </div>
            </div>
</div>`
  document.querySelector("#dialog-apropos-resto-agenda > div").innerHTML=c
}

function setChoice(a, b,c) {

  document.querySelector("#adresseEvent").value = c
  document.querySelector("#content-list-pastille > div > ul > li>a").innerText = b
  restaurant=b
  document.querySelector("#dialog-apropos-resto-agenda").close()
}
/**end */
