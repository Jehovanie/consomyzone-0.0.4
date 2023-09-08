function generateSelect(couche, data,itemsSelected= []){
    let all_select_HTML =""
    data.forEach((item, index ) => {
        const isSelected = itemsSelected.length > 0 && itemsSelected.find(jtem => parseInt(jtem.index)=== parseInt(index)) ? true : false;
        let nom_reg = "";
        if(couche === "region"){
            nom_reg = item.properties.nom_reg;
        }else if( couche === "quartier"){
            nom_reg = item.properties.code_qv + " " + item.properties.nom_pole ;
        }else if( couche === "departement"){
            nom_reg = item.properties.nom_reg;
        }else if( couche === "canton"){
            nom_reg = item.properties.nom_reg;
        }else if( couche === "commune"){
            alert("dfqdsqfsd")
            // nom_reg = item.properties.nom_reg.split(" ").map(item => item.charAt(0).toUpperCase() + item.slice(1).toLowerCase()).join(" ")
        }
        all_select_HTML += `
            <div class="form-check">
                <input class="form-check-input" type="checkbox" id="${couche + "_" + nom_reg + "_" + index}" onchange="updateGeoJson('${couche}', '${index}', this)" ${ isSelected ? "checked" : "" }>
                <label class="form-check-label text-black" for="${couche + "_" + nom_reg + "_" + index}">
                    ${nom_reg.split(" ").map(item => item.charAt(0).toUpperCase() + item.slice(1).toLowerCase()).join(" ")}
                </label>
            </div>
        `
    })

    const list = document.querySelector(`.select_${couche.toLowerCase()}_jheo_js`)

    list.innerHTML= all_select_HTML;

    if(list && list.classList.contains("d-none") ){
        list.classList.remove("d-none")
    }

}


function updateGeoJson(couche,index, e){
    if( e.checked){
        OBJECT_MARKERS_TABAC.updateGeoJson(couche, index)
    }else{
        OBJECT_MARKERS_TABAC.removeSpecGeoJson(couche, index)
    }
}

//// HIDE DETAILS TABAC POP UP
document.querySelector(".close_details_jheo_js").addEventListener("click", () => { 
    document.getElementById("remove-detail-tabac").setAttribute("class", "hidden")
})
    addListDepartTabac()
