window.addEventListener('load', () => {
    
    setDataInLocalStorage("type", "tous");

    addMapTous();
    if(document.querySelector("#close-detail-station")){
        document.querySelector("#close-detail-station").addEventListener("click", () => { 
            document.getElementById("remove-detail-station").setAttribute("class", "hidden")
        })
    }

    //// HIDE DETAILS STATION POP UP
    document.querySelector("#close-detail-home").addEventListener("click", () => { 
        document.getElementById("remove-detail-home").setAttribute("class", "hidden")
    })
});