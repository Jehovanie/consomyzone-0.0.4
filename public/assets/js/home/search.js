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
        card_dom.addEventListener("click",() => {
            card_dom.querySelector(".plus")?.click()
        })
    })
}
