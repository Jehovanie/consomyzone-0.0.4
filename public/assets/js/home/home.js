window.addEventListener('load', () => {
    addMapTous();
    setDataInLocalStorage("type", "tous");
    
    if(document.querySelector("#close-detail-station")){
        document.querySelector("#close-detail-station").addEventListener("click", () => { 
            document.getElementById("remove-detail-station").setAttribute("class", "hidden")
        })
    }
});