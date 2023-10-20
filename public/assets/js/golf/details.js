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

function setMonGolf(goldID, golfName, golfAdress){
    // fecthGolfAction(goldID, "for_me")
    showPastillGolfTribuT(goldID, golfName, golfAdress)
    
    
    
}

function setGolfFinished(goldID){
    fecthGolfAction(goldID, "finished")
}

function setGolfNone(goldID){
    // fecthGolfAction(goldID, "none")
}

function cancelGolfFinished(goldID){
    fecthGolfAction(goldID, "cancel")
}

function executeActionForPastGolf(goldID, golfName, golfAdress) {
    let action = document.querySelector(".select_action_golf_nanta_js").value
    if(action == "1"){
        setGolfTodo(goldID)
        OBJECT_MARKERS_GOLF.updateStateGolf("afaire", goldID)
    }else if(action == "2"){
        setGolfFinished(goldID)
        OBJECT_MARKERS_GOLF.updateStateGolf("fait", goldID)
    } else if (action == "3") {
        setMonGolf(goldID, golfName, golfAdress)
        // OBJECT_MARKERS_GOLF.updateStateGolf("mon_golf", goldID)
    }else if(action == "0"){
        setGolfNone(goldID)
        // OBJECT_MARKERS_GOLF.updateStateGolf("aucun", goldID)
    }else{
        cancelGolfFinished(goldID)
        // OBJECT_MARKERS_GOLF.updateStateGolf("aucun", goldID)
    }

}

function executeActionForPastMonGolf(goldID, golfName, golfAdress){
        setMonGolf(goldID, golfName, golfAdress)
}





