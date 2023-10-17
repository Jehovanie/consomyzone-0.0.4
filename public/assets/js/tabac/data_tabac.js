window.addEventListener('load', () => { 
    const id_dep = new URL(window.location.href).pathname.split('/')[4]
    const nom_dep = new URL(window.location.href).pathname.split('/')[3]
    getDataSpecTabacMobile(nom_dep, id_dep)
})

function hideRightSide(){
    if( document.querySelector(".close_right_side_jheo_js")){
        if(document.querySelector(".content_legende_jheo_js").getAttribute("style") === "width: 25%; padding: 25px;"){
            document.querySelector(".close_right_side_jheo_js").click();
        }
    }
}

//// HIDE DETAILS TABAC POP UP
document.querySelector(".close_details_jheo_js").addEventListener("click", () => { 
    document.getElementById("remove-detail-tabac").setAttribute("class", "hidden")
})


addListDepartTabac()
