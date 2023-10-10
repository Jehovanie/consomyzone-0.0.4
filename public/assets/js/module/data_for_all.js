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

function injectChooseCouch(){
    if( !document.querySelector(".content_right_side_body_jheo_js")){
        console.log("Selector not found : '.content_right_side_body_body'")
        return false;
    }
    document.querySelector(".content_right_side_body_jheo_js").innerHTML= `
        <div class="right_side_body right_side_body_jheo_js">
            <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="region">
                <label class="form-check-label" for="region">
                    REGION
                </label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="commune">
                <label class="form-check-label" for="commune">
                    COMMUNE
                </label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="departement">
                <label class="form-check-label" for="departement">
                    DEPARTEMENT
                </label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="iris" >
                <label class="form-check-label" for="iris">
                    IRIS
                </label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="quartierDeVie" >
                <label class="form-check-label" for="quartierDeVie">
                    QUARTIER DE VIE
                </label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="canton" >
                <label class="form-check-label" for="canton">
                    CANTON
                </label>
            </div>
        </div>
    `
}

function getStateGolf(numeroIndices= 1){
    const data= `
        <tr>
            <th scope="row">${numeroIndices}</th>
            <td><img class="icon_golf_legend" src="/public/assets/icon/NewIcons/mon_golf.png" alt="Icon Golf"></td>
            
            <td>Mon Golf</td>
        </tr>
        <tr>
            <th scope="row">${numeroIndices + 1 }</th>
            <td><img class="icon_golf_legend" src="/public/assets/icon/NewIcons/icon-blanc-golf-vert-badgeC.png" alt="Icon Golf"></td>

            <td>Golf A faire</td>
        </tr>
        <tr>
            <th scope="row">${numeroIndices + 2 }</th>
            <td><img class="icon_golf_legend" src="/public/assets/icon/NewIcons/icon-blanc-golf-vert-bC.png" alt="Icon Golf"></td>

            <td>Golf fait</td>
        </tr>
        <tr>
            <th scope="row">${numeroIndices + 3}</th>
            <td><img class="icon_golf_legend" src="/public/assets/icon/NewIcons/icon-blanc-golf-vertC.png" alt="Icon Golf"></td>
            
            <td>Golf Inconnue</td>
        </tr>
    `
    return data;
}
function injectStatusGolf(){
    const data = getStateGolf(1)
    injectStatus(data)
}

function getStateResto(numeroIndices= 1){
    const data= `
        <tr>
            <th scope="row">${numeroIndices}</th>
            <td><img class="icon_resto_legend" src="/public/assets/icon/NewIcons/icon-resto-new-B.png" alt="Icon Resto"></td>
            
            <td>Les restaurants non pastillés</td>
        </tr>
        <tr>
            <th scope="row">${numeroIndices + 1 }</th>
            <td><img class="icon_resto_legend" src="/public/assets/icon/NewIcons/icon-resto-new-B-org-single.png" alt="Icon Resto"></td>

            <td>Les restaurants pastillés par une seule tribu T.</td>
        </tr>
        <tr>
            <th scope="row">${numeroIndices + 2 }</th>
            <td><img class="icon_resto_legend" src="/public/assets/icon/NewIcons/icon-resto-new-B-vert-multi.png" alt="Icon Resto"></td>

            <td>Les restaurants pastillés par plusieurs tribus T.</td>
        </tr>
    `
    return data;
}
function injectStatusResto(){
    const data= getStateResto(1);
    injectStatus(data)
}

function getStateTabac(numeroIndices=1){
    const data= `
        <tr>
            <th scope="row">${numeroIndices}</th>
            <td><img class="icon_resto_legend" src="/public/assets/icon/NewIcons/tabac_black0.png" alt="Icon Tabac"></td>
            
            <td>Marquer Tabac non sélectionné.</td>
        </tr>
        <tr>
            <th scope="row">${numeroIndices + 1 }</th>
            <td><img class="icon_resto_legend" src="/public/assets/icon/NewIcons/tabac_red0.png" alt="Icon Tabac"></td>

            <td>Marquer Tabac sélectionné.</td>
        </tr>
    `
    return data;
}
function injectStatusTabac(){
    const data= getStateTabac(1);
    injectStatus(data)
}

function getStateStation(numeroIndices=1){
    const data= `
        <tr>
            <th scope="row">${numeroIndices}</th>
            <td><img class="icon_resto_legend" src="/public/assets/icon/NewIcons/icon-station-new-B.png" alt="Icon Station"></td>
            
            <td>Marquer Station non sélectionné.</td>
        </tr>
        <tr>
            <th scope="row">${numeroIndices + 1 }</th>
            <td><img class="icon_resto_legend" src="/public/assets/icon/NewIcons/icon-station-new-R.png" alt="Icon Station"></td>
            <td>Marquer Station sélectionné.</td>
        </tr>
    `
    return data;
}

function injectStatusStation(){
    const data= getStateStation(1);
    injectStatus(data)
}


function getStateFerme(numeroIndices=1){
    const data= `
        <tr>
            <th scope="row">${numeroIndices}</th>
            <td><img class="icon_resto_legend" src="/public/assets/icon/NewIcons/icon-ferme-new-B.png" alt="Icon Ferme"></td>
            
            <td>Marquer Ferme non sélectionné.</td>
        </tr>
        <tr>
            <th scope="row">${numeroIndices + 1 }</th>
            <td><img class="icon_resto_legend" src="/public/assets/icon/NewIcons/icon-ferme-new-R.png" alt="Icon Ferme"></td>
            <td>Marquer Ferme sélectionné.</td>
        </tr>
    `
    return data;
}

function injectStatusFerme(){
    const data = getStateFerme(1);
    injectStatus(data)
}


function injectStatusTous(){
    let data = getStateResto(1);
    data += getStateFerme(4);
    data += getStateStation(6);
    data += getStateGolf(8);
    data += getStateTabac(12);

    injectStatus(data);
}


function injectStatus(data){
    if( !document.querySelector(".content_right_side_body_jheo_js")){
        console.log("Selector not found : '.content_right_side_body_body'")
        return false;
    }
    document.querySelector(".content_right_side_body_jheo_js").innerHTML = `
        <div class="right_side_body right_side_body_jheo_js">
            <table class="table table_info_marker">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Icône</th>
                    
                        <th scope="col">Statut</th>
                    </tr>
                </thead>
                <tbody>
                    ${data}

                </tbody>
            </table>
        </div>
    `
}