function getDetailFromListLeft(depart_name, depart_code, id) { 
    OBJECT_MARKERS_STATION.clickOnMarker(id)
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
