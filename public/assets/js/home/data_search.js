const urlParams = new URLSearchParams(window.location.search)

if(urlParams.get("cles0")){
    document.querySelector(".input_search_type_js").value= urlParams.get("cles0")
}

if(urlParams.get("cles1")){
    document.querySelector(".input_mots_cle_js").value= urlParams.get("cles1")
}


if( document.querySelector(".btn_retours_jheo_js")){
    document.querySelector(".btn_retours_jheo_js").addEventListener("click",() => {
        document.querySelector(".content_left_side_mobile").style.animation="unTranslateFull 0.5s linear forwards";
    });
}


//// HIDE DETAILS STATION POP UP
if(document.querySelector("#close-detail-home")){
    document.querySelector("#close-detail-home").addEventListener("click", () => { 
        document.getElementById("remove-detail-home").setAttribute("class", "hidden")
    })
}

if( document.querySelectorAll(".list_item_search_js_jheo").length > 0 ){
    document.querySelectorAll(".list_item_search_js_jheo").forEach(card_dom => {
        card_dom.addEventListener("click", () => {
            card_dom.querySelector(".plus")?.click()
        })
    })
}





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


// function fetchDetails(selector, departName, departCode,id){

//     const myHeaders = new Headers();
//     myHeaders.append('Content-Type','text/plain; charset=UTF-8');

//     fetch(`/station/departement/${departName}/${departCode}/details/${id}`)
//         .then(response => {
//             return response.text()
//         }).then(r => { 
//            document.querySelector(selector).innerHTML = null
//            document.querySelector(selector).innerHTML = r
//         })
    
// }

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


if (document.querySelector(".toggel-recherche-tomm-js")) {
    document.querySelector(".toggel-recherche-tomm-js").addEventListener("click", () => { 
            document.querySelector(".content_navleft_jheo_js").classList.toggle('d-none')
    })
}