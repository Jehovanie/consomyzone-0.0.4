window.addEventListener('load', () => {
    
    ///we use this variable to keep track for user search
    if( localStorage.getItem("type")){
        rmDataInLocalStorage("type")
    }

    setDataInLocalStorage("type", "tous");

    // addMapTous();
    if(document.querySelector("#close-detail-station")){
        document.querySelector("#close-detail-station").addEventListener("click", () => { 
            document.getElementById("remove-detail-station").setAttribute("class", "hidden")
        })
    }

    //// HIDE DETAILS STATION POP UP
    if(document.querySelector("#close-detail-home")){
        document.querySelector("#close-detail-home").addEventListener("click", () => { 
            document.getElementById("remove-detail-home").setAttribute("class", "hidden")
        })
    }
});