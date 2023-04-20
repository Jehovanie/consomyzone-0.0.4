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

if( document.querySelectorAll(".list_item_dep_mobile_station_js_jheo").length > 0 ){
    document.querySelectorAll(".list_item_dep_mobile_station_js_jheo").forEach(card_dom => {
        card_dom.addEventListener("click",() => {
            card_dom.querySelector(".plus")?.click()
        })
    })
}