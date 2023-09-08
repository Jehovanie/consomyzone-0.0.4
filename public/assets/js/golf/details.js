function getDetailFromListLeft(depart_name, depart_code, id) { 

    if (screen.width < 991) {
        var pathDetails = `/golf-mobile/departement/${depart_name}/${depart_code}/details/${id}`;
        location.assign(pathDetails)
    }else{
        OBJECT_MARKERS_GOLF.clickOnMarker(id)
    }
    // if(OBJECT_MARKERS_GOLF.clickOnMarker(id)){
    //     OBJECT_MARKERS_GOLF.clickOnMarker(id)
    //     if (screen.width < 991) {
            
    //         var pathDetails = `/golf-mobile/departement/${depart_name}/${depart_code}/details/${id}`;
    //         location.assign(pathDetails)
    //     }
    // } else {
        
    //     //  else {
    //     //     const select_dem = document.querySelector("#open-navleft-golf-mobile-specific-tomm-js")
    //     //     getDetailGolf(depart_code, depart_name, id, false,select_dem)
    //     // }

    //     /// update card and the markers new
    //     OBJECT_MARKERS_GOLF.fetchOneData(id)
    // }
}


function setGolfFinished(goldID){
    fecthGolfAction(goldID, "finished")
}

function cancelGolfFinished(goldID){
    fecthGolfAction(goldID, "cancel")
}

function fecthGolfAction(goldID, action){

    const url = (action === "finished") ? '/user/setGolf/finished': '/user/setGolf/unfinished';

    const request = new Request(url, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'  
        },
        body: JSON.stringify({
            golfID : goldID,
        })
    })

    fetch(request)
        .then(response=>response.json())
        .then(response =>{
            console.log(response)
            if( response.success){
            }
            if( action === "finished"){
                if( document.querySelector(".content_btn_golf_did_jheo_js")){
                    document.querySelector(".content_btn_golf_did_jheo_js").innerHTML= `
                        Vouliez-vous annuler votre choix ? <span class="badge bg-danger btn_golf_did btn_golf_did_jheo_js" onclick="cancelGolfFinished(${goldID})">Oui</span>
                    `
                }

                if( document.querySelector(".golf_status_jheo_js")){
                    if(document.querySelector(".golf_status_jheo_js").classList.contains("bg-primary")){
                        document.querySelector(".golf_status_jheo_js").classList.remove("bg-primary")
                        document.querySelector(".golf_status_jheo_js").classList.add("bg-info")
                        document.querySelector(".golf_status_jheo_js").innerText= "FAIT"
                    }
                }
            }else{

                if( document.querySelector(".content_btn_golf_did_jheo_js")){
                    document.querySelector(".content_btn_golf_did_jheo_js").innerHTML= `
                        Marquez que ce golf est déjà fait ? <span class="badge bg-danger btn_golf_did btn_golf_did_jheo_js" onclick="setGolfFinished(${goldID})">Oui</span>
                    `
                }

                if( document.querySelector(".golf_status_jheo_js")){
                    if(document.querySelector(".golf_status_jheo_js").classList.contains("bg-info")){
                        document.querySelector(".golf_status_jheo_js").classList.remove("bg-info")
                        document.querySelector(".golf_status_jheo_js").classList.add("bg-primary")
                        document.querySelector(".golf_status_jheo_js").innerText= "A FAIRE"
                    }
                }
            }
        })
}