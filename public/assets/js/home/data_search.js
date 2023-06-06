
function getDetailSearchForMobile(link) {
    
    if(document.querySelector(".btn_retours_jheo_js")){
        document.querySelector(".btn_retours_jheo_js").click();
    }

    if(document.querySelector(".show_detail_for_mobile_js_jheo")){
        document.querySelector(".show_detail_for_mobile_js_jheo").click();
    }

    fetchDetail(".content_detail_home_js_jheo",link)
}

function fetchDetail(selector, link){

    const myHeaders = new Headers();
    myHeaders.append('Content-Type','text/plain; charset=UTF-8');

    fetch(link)
        .then(response => {
            return response.text()
        }).then(r => { 
           document.querySelector(selector).innerHTML = null
           document.querySelector(selector).innerHTML = r
        })
    
}

function getDetails(type,depart_name, depart_code, id ){
    OBJECT_MARKERS_SEARCH.clickOnMarker(id);
}


function fetchDetails(selector, departName, departCode,id){

    const myHeaders = new Headers();
    myHeaders.append('Content-Type','text/plain; charset=UTF-8');

    fetch(`/station/departement/${departName}/${departCode}/details/${id}`)
        .then(response => {
            return response.text()
        }).then(r => { 
           document.querySelector(selector).innerHTML = null
           document.querySelector(selector).innerHTML = r
        })
    
}

function getDetailRestoSearch(depName, dep, id){
    
    var myHeaders = new Headers();
    myHeaders.append('Content-Type','text/plain; charset=UTF-8');
    fetch(`/restaurant/departement/${depName.trim()}/${dep}/details/${id}`, myHeaders)
        .then(response => {
            return response.text()
        }).then(r => {
        document.querySelector("#content-details").innerHTML = null
        document.querySelector("#content-details").innerHTML = r
        
        document.querySelector("#close-detail-tous-resto").addEventListener("click", () => { 
            document.querySelector("#content-details").style.display = "none"
        })
        document.querySelector("#content-details").removeAttribute("style")
        
    })
}