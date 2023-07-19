// addListFermeMobile()
if( document.querySelector(".close_detail_resto_js_jheo")){
    document.querySelector(".close_detail_resto_js_jheo").addEventListener("click", () => {
        document.getElementById("remove-detail-resto").classList.add("hidden");
    })
}

pagginationModule(".content_list_resto_spec_js_jheo",".name_resto_js_jheo",10)