let remove = document.getElementById("remove-detail-station")
function getDetailStation(depart_name, depart_code, id) { 
    remove.removeAttribute("class", "hidden");
    remove.setAttribute("class", "navleft-detail fixed-top")
    
    var myHeaders = new Headers();
    myHeaders.append('Content-Type','text/plain; charset=UTF-8');
    fetch(`/station/departement/${depart_name}/${depart_code}/details/${id}`)
        .then(response => {
            console.log(response)

            return response.text()
        }).then(r => { 
           document.querySelector("#content-details-station").innerHTML = null
           document.querySelector("#content-details-station").innerHTML = r
        })
    
}

document.querySelector("#close-detail-station").addEventListener("click", () => { 
    remove.setAttribute("class", "hidden")
})