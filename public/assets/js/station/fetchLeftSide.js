if( document.querySelector(".fetch_list_departement_jheo_js")){
    document.querySelector(".fetch_list_departement_jheo_js").addEventListener("click",() => {
        document.querySelector(".content_left_side_mobile").style.animation="translateFull 0.5s linear forwards";
    })
}


if( document.querySelector(".btn_retours_jheo_js")){
    document.querySelector(".btn_retours_jheo_js").addEventListener("click",() => {
        document.querySelector(".content_left_side_mobile").style.animation="unTranslateFull 0.5s linear forwards";
    });
}