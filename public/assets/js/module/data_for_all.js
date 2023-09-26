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


function pastilleRestoForTribuT(element, isPastilled){
    let id = element.dataset.id
    let name = element.dataset.name
    let tbl = element.dataset.tbname
    let data = {
        id : id,
        name : name,
        tbl : tbl
    }

    let request = ""
    if(isPastilled){
        request = new Request("/user/tribu_t/pastille/resto", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'  
            },
            body: JSON.stringify(data)
        })

    }else{
        request = new Request("/user/tribu_t/depastille/resto", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'  
            },
            body: JSON.stringify(data)
        })
    }

    fetch(request)
            .then(response=>response.json())
            .then(data=>{
                let tribuName = element.dataset.tribu
                let html = ""
                if(!isPastilled){
                    html = `<button type="button" data-id="${id}" data-tribu="${tribuName}" data-name="${name}" 
                                data-tbname="${tbl}" class="mx-2 btn btn-success" data-velona="${element.dataset.velona}" 
                                onclick="pastilleRestoForTribuT(this,true)">Pastiller</button> `
                    new swal("Succès !", "Restaurant dépastillé avec succès", "success")
                    .then((value) => {
                        updateBtnStatus(element, html)
                        document.querySelector("#"+tbl).remove()
                        reorganisePastille()
                        CURRENT_MAP_INSTANCE.updateListRestoDepastille(id, tbl+"_restaurant")
                    });
                }else{

                    html = `<button type="button" data-id="${id}" data-tribu="${tribuName}" data-name="${name}" 
                                    data-tbname="${tbl}" class="mx-2 btn btn-info" data-velona="${element.dataset.velona}" 
                                    onclick="pastilleRestoForTribuT(this,false)">Dépastiller</button>`
                    let img = document.createElement("img")
                    img.src = element.dataset.velona
                    img.dataset.name = tribuName
                    img.setAttribute("alt",tribuName)
                    let div = document.createElement("div")
                    div.setAttribute("onclick","createPopUp(event)")
                    div.setAttribute("onmouseout","resetImage(event)")
                    div.setAttribute("onmouseover","agrandirImage(event)")
                    div.setAttribute("id",tbl)
                    div.setAttribute("class","img_nantenaina")
                    div.setAttribute("title","Tribu T " + tribuName)
                    div.setAttribute("data-bs-toggle","tooltip")
                    div.setAttribute("data-bs-placement","top")
                    div.dataset.name = tribuName
                    div.appendChild(img)
                    new swal("Succès !", "Restaurant pastillé avec succès", "success")
                    .then((value) => {
                        updateBtnStatus(element, html)
                        document.querySelector(".mainContainerLogoTribu").appendChild(div);
                        reorganisePastille()
                        CURRENT_MAP_INSTANCE.updateListRestoPastille(data.id_resto, data.table)
                    });
                }
            })
            .catch(error=>console.log(error))
}