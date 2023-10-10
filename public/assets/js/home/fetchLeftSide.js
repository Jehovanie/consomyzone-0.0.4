if( document.querySelectorAll(".list_item_search_mobile_js_jheo").length > 0 ){
    document.querySelectorAll(".list_item_search_mobile_js_jheo").forEach(card_dom => {
        card_dom.addEventListener("click",() => {
            card_dom.querySelector(".plus")?.click()
        })
    })
}