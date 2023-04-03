///ferme_stationservice_ferme_restaurent_stationservice
/// ferme_stationservice, ferme, restaurent, stationservice
const cat_fermes_stationService = document.getElementById("ferme_stationservice_dispatch_event")
const cat_fermes = document.getElementById("ferme_dispatch_event")
const cat_restaurent = document.getElementById("restaurent_dispatch_event")
const cat_stationservice = document.getElementById("stationservice_dispatch_event")

const categories = [
    { 
        "type": "ferme_station",
        "action": cat_fermes_stationService 
    },
    {
        "type" : "ferme",
        "action": cat_fermes
    },
    {
        "type" : "station",
        "action" : cat_stationservice
    }
]

categories.forEach(item => {

    item.action.addEventListener("click", () => {

        categories.forEach(i => {
            if( i.action.classList.contains("border_black")){
                i.action.classList.remove("border_black")
            }
        })
        
        item.action.classList.add("border_black")
        ///delete old map
        const map = document.getElementById("map");
        const parent_map = map.parentElement;
        parent_map.removeChild(map);

        ///generate new map
        const div = document.createElement("div");
        div.setAttribute("id", "map")
        parent_map.appendChild(div);

        switch(item.type){
            case 'ferme_station':
                addMapFermeStation();
                break;
            case 'ferme':
                addMapFerme();
                break;
            case 'station':
                addMapStation();
                break;
            default:
                break;
        }
    })
})