const TODAY = new Date();

let current_day = TODAY.getDate();
let current_month = TODAY.getMonth() + 1;
let current_year = TODAY.getFullYear();


// Listes des mois et liste des jour
const months = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet","Août", "Septembre", "Octobre", "Novembre", "Décembre"];
const days = ["Dim","Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"]

//set current month
document.querySelector("#current-date").innerText = months[current_month - 1 ] + " " + current_year;

/* creation calendrier */
let daysName = document.createElement("ul");
daysName.classList ="weeks";

days.forEach(day => {
    let daysLi = document.createElement("li")
    daysLi.textContent = day;
    daysName.appendChild(daysLi)
})

let daysNumber = document.createElement("ul");
daysNumber.classList ="days";

///add list of days
const calendar = document.querySelector(".calendar");
calendar.appendChild(daysName);
calendar.appendChild(daysNumber);

const renderCalendar = () => {
    let firstDayofMonth = new Date(current_year, current_month, 1).getDay(), 
    lastDateofMonth = new Date(current_year, current_month + 1, 0).getDate(),
    lastDayofMonth = new Date(current_year, current_month, lastDateofMonth).getDay(), 
    lastDateofLastMonth = new Date(current_year, current_month, 0).getDate(); 
    let liTag = "";

    for (let i = firstDayofMonth; i > 0; i--) {
        liTag += "<li class='inactive'>" + (lastDateofLastMonth - i + 1) +"</li>";
    }

    for (let i = 1; i <= lastDateofMonth; i++) {
        // adding active class to li if the current day, month, and year matched
        let isToday = i === TODAY.getDate() && current_month === new Date().getMonth() && current_year === new Date().getFullYear() ? "active" : "";

        let dateLabel = i < 10 ? "0"+i : i;
        let monthLabel = (current_month+1) < 10 ? "0"+(current_month+1) : (current_month+1)

        let dateSimple = current_year+ "-"+monthLabel+"-"+dateLabel;

        // testHasAgenda(tableAgenda, dateSimple, i)

        // liTag += "<li class='" +isToday+" current-day-"+i +"' onclick=\"mouseOverEvent("+i+",this)\">"+i+"</li>";
        liTag += "<li class='" +isToday+" current-day-"+i +">"+i+"</li>";
    }

    for (let i = lastDayofMonth; i < 6; i++) { 
        liTag += "<li class='inactive' >"+ (i - lastDayofMonth + 1) +"</li>"
    }

    document.querySelector(".days").innerHTML = liTag;
    
}
renderCalendar();