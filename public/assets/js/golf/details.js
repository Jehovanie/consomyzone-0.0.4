function getDetailFromListLeft(depart_name, depart_code, id) { 
        OBJECT_MARKERS_GOLF.clickOnMarker(id)
    
    // if (screen.width < 991) {
    //     var pathDetails = `/golf-mobile/departement/${depart_name}/${depart_code}/details/${id}`;
    //     location.assign(pathDetails)
    // }else{
    //     OBJECT_MARKERS_GOLF.clickOnMarker(id)
    // }
   
}

function setGolfTodo(goldID){
    fecthGolfAction(goldID, "todo")
}

function setMonGolf(goldID){
    fecthGolfAction(goldID, "for_me")
}

function setGolfFinished(goldID){
    fecthGolfAction(goldID, "finished")
}

function setGolfNone(goldID){
    fecthGolfAction(goldID, "none")
}

function cancelGolfFinished(goldID){
    fecthGolfAction(goldID, "cancel")
}

function executeActionForPastGolf(goldID){
    let action = document.querySelector("#selectActionGolf").value
    if(action == "1"){
        setGolfTodo(goldID)
        OBJECT_MARKERS_GOLF.updateStateGolf("afaire", goldID)
    }else if(action == "2"){
        setGolfFinished(goldID)
        OBJECT_MARKERS_GOLF.updateStateGolf("fait", goldID)
    }else if(action == "3"){
        setMonGolf(goldID)
        //Mon golf
        OBJECT_MARKERS_GOLF.updateStateGolf("mon_golf", goldID)
    }else if(action == "0"){
        setGolfNone(goldID)
        OBJECT_MARKERS_GOLF.updateStateGolf("aucun", goldID)
    }else{
        cancelGolfFinished(goldID)
        // OBJECT_MARKERS_GOLF.updateStateGolf("aucun", goldID)
    }
}

function fecthGolfAction(goldID, action){

    // const url = (action === "finished") ? '/user/setGolf/finished': '/user/setGolf/unfinished';
    let url = ""
    
    if(action === "finished"){
        url = '/user/setGolf/finished'
    }else if(action === "todo"){
        url = '/user/setGolf/todo'
    }else if(action === "for_me"){
        url = '/user/setGolf/for_me'
    }else if(action === "none"){
        url = '/user/setGolf/none'
    }else{
        url = '/user/setGolf/unfinished'
    }
    
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
            if( response.success){
                if( action === "finished"){
                    new swal("Bravo !","Vous avez marqué ce golf comme fait !", "success")
                    .then((value) => {
                        if( document.querySelector(".content_btn_golf_did_jheo_js")){
                            document.querySelector(".content_btn_golf_did_jheo_js").innerHTML= `
                                Voulez-vous annuler votre choix ? <span class="badge bg-danger btn_golf_did btn_golf_did_jheo_js" onclick="cancelGolfFinished(${goldID})">Oui</span>
                            `
                        }
        
                        if( document.querySelector(".golf_status_jheo_js")){
                            document.querySelector(".golf_status_jheo_js").innerText= "FAIT"
                        }
                    });  

                }else if( action === "for_me"){
                    new swal("Bravo !","Vous avez marqué ce golf comme Mon Golf !", "success")
                    .then((value) => {
                        if( document.querySelector(".content_btn_golf_did_jheo_js")){
                            document.querySelector(".content_btn_golf_did_jheo_js").innerHTML= `
                                Voulez-vous annuler votre choix ? <span class="badge bg-danger btn_golf_did btn_golf_did_jheo_js" onclick="cancelGolfFinished(${goldID})">Oui</span>
                            `
                        }
        
                        if( document.querySelector(".golf_status_jheo_js")){
                            document.querySelector(".golf_status_jheo_js").innerText= "MON GOLF"
                        }
                    });  

                }else if( action === "todo"){

                    new swal("Bravo !","Vous avez marqué ce golf comme à faire !", "success")
                    .then((value) => {
                        if( document.querySelector(".content_btn_golf_did_jheo_js")){
                            document.querySelector(".content_btn_golf_did_jheo_js").innerHTML= `
                                Voulez-vous annuler votre choix ? <span class="badge bg-danger btn_golf_did btn_golf_did_jheo_js" onclick="cancelGolfFinished(${goldID})">Oui</span>
                            `
                        }
        
                        if( document.querySelector(".golf_status_jheo_js")){
                            document.querySelector(".golf_status_jheo_js").innerText= "A FAIRE"
                        }
                    });  

                }else if( action === "none"){

                    new swal("Bravo !","Vous avez choisi de ne rien faire avec ce golf.", "success")
                    .then((value) => {
                        if(document.querySelector(".content_btn_golf_did_jheo_js")){
                            document.querySelector(".content_btn_golf_did_jheo_js").innerHTML= `
                                Voulez-vous annuler votre choix ? <span class="badge bg-danger btn_golf_did btn_golf_did_jheo_js" onclick="cancelGolfFinished(${goldID})">Oui</span>
                            `
                        }
        
                        if( document.querySelector(".golf_status_jheo_js")){
                            document.querySelector(".golf_status_jheo_js").innerText= ""
                        }
                    });  

                }else{

                    new swal("Bravo !","Vous venez d'annuler votre choix !", "success")
                    .then((value) => {
                        if( document.querySelector(".content_btn_golf_did_jheo_js")){
                            document.querySelector(".content_btn_golf_did_jheo_js").innerHTML= `
                            <label for="selectActionGolf" class="form-label">Vous voulez marquer que ce golf comme : </label>
                            <select class="form-select select_action_golf select_action_golf_nanta_js" id="selectActionGolf" name="sellist_action" data-id="${goldID}" onchange="executeActionForPastGolf('${goldID}')">
                                <option value="0">Aucun</option>
                                <option value="1">A faire</option>
                                <option value="2">Fait</option>
                                <option value="3">Mon golf</option>
                            </select>
                            `
                        }
        
                        if( document.querySelector(".golf_status_jheo_js")){
                                document.querySelector(".golf_status_jheo_js").innerText= ""
                        }

                        OBJECT_MARKERS_GOLF.updateStateGolf("aucun", goldID)
                    })

                }
            }
        })

}