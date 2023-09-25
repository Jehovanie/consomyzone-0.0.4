const all_instances = [
    { name :"tabac", value : typeof(OBJECT_MARKERS_TABAC) !== 'undefined' ? OBJECT_MARKERS_TABAC  : null }, 
    { name :"ferme", value : typeof(OBJECT_MARKERS_FERME) !== 'undefined' ? OBJECT_MARKERS_FERME  : null }, 
    { name :"golf", value :  typeof(OBJECT_MARKERS_GOLF) !== 'undefined' ? OBJECT_MARKERS_GOLF  : null}, 
    { name :"home", value :  typeof(OBJECT_MARKERS_HOME) !== 'undefined' ? OBJECT_MARKERS_HOME  : null}, 
    { name :"search", value : typeof(OBJECT_MARKERS_SEARCH) !== 'undefined' ? OBJECT_MARKERS_SEARCH  : null}, 
    { name :"station", value :  typeof(OBJECT_MARKERS_STATION) !== 'undefined' ? OBJECT_MARKERS_STATION  : null  }, 
    { name :"resto", value :  typeof(OBJECT_MARKERS_RESTO) !== 'undefined' ? OBJECT_MARKERS_RESTO  : null  }
]

const data= all_instances.find(item => item.value !== null);
const CURRENT_MAP_INSTANCE = data.value;

function generateSelectContoursGeographie(couche, data,itemsSelected= []){
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
            nom_reg = item.properties.depcom + " " + item.properties.nom_com + " " + item.properties.nom_reg.split("-").join(" ")
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

function hideChargementRightSide(){
    const chargement_Tabac= document.querySelector(".chargement_right_side_jheo_js")
    const right_Side_Tabac= document.querySelector(".right_side_body_jheo_js")
    if(chargement_Tabac){
        if(!chargement_Tabac.classList.contains("d-none")){
            chargement_Tabac.classList.add("d-none")
        }
    }

    if( right_Side_Tabac){
        if( right_Side_Tabac.classList.contains("opacity04")){
            right_Side_Tabac.classList.remove("opacity04")
        }
    }
}

function showChargementRightSide(){
    const chargement_Tabac= document.querySelector(".chargement_right_side_jheo_js")
    const right_Side_Tabac= document.querySelector(".right_side_body_jheo_js")
    if(chargement_Tabac){
        if(chargement_Tabac.classList.contains("d-none")){
            chargement_Tabac.classList.remove("d-none")
        }
    }

    if( right_Side_Tabac){
        if( !right_Side_Tabac.classList.contains("opacity04")){
            right_Side_Tabac.classList.add("opacity04")
        }
    }
}

function updateGeoJson(couche,index, e){

    if( e.checked){
        CURRENT_MAP_INSTANCE.updateGeoJson(couche, index)
    }else{
        CURRENT_MAP_INSTANCE.removeSpecGeoJson(couche, index)
    }
}