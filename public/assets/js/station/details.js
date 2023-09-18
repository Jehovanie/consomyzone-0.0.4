function getDetailFromListLeft(depart_name, depart_code, id) { 
    if(OBJECT_MARKERS_STATION.clickOnMarker(id)){
        OBJECT_MARKERS_STATION.clickOnMarker(id)
    }else{
        if (screen.width < 991) {
            var pathDetails = `/station/departement/${depart_name}/${depart_code}/details/${id}`;
            location.assign(pathDetails)
            
        } else {
            const select_dem = document.querySelector("#open-navleft-resto-spec-mobile-tomm-js")
            getDetailStation(depart_code, depart_name, id, false,select_dem)
        }

        /// update card and the markers new
        OBJECT_MARKERS_RESTO.fetchOneData(id)
    }
    
}

let remove = document.getElementById("remove-detail-station")
document.querySelector("#close-detail-station").addEventListener("click", () => { 
    remove.setAttribute("class", "hidden")
})

function getDetailsStation(depart_name, depart_code, id) {

    let remove = document.getElementById("remove-detail-station")
    remove.removeAttribute("class", "hidden");
    remove.setAttribute("class", "navleft-detail fixed-top")
    
    var myHeaders = new Headers();
    myHeaders.append('Content-Type','text/plain; charset=UTF-8');
    fetch(`/station/departement/${depart_name}/${depart_code}/details/${id}`)
        .then(response => {
            return response.text()
        }).then(r => { 
           document.querySelector("#content-details-station").innerHTML = null
           document.querySelector("#content-details-station").innerHTML = r
        })
    ////
}
