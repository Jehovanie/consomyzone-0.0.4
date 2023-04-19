window.addEventListener('load', () => {

    ///translate: show list departement
    if( document.querySelector(".fetch_list_departement_jheo_js")){
        document.querySelector(".fetch_list_departement_jheo_js").addEventListener("click",() => {
            document.querySelector(".content_left_side_mobile").style.animation="translateFull 0.5s linear forwards";
        })
    }

    ///untranslate: hide list departement
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
});