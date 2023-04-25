checkScreen();
setDataInLocalStorage("type", "station");

const parsedUrl = new URL(window.location.href);
const type= parsedUrl.searchParams.get("type") ? parsedUrl.searchParams.get("type") : "tous"
const content_info= document.querySelector(".content_info_js");
const dep_name= content_info?.getAttribute("data-dep-name") ? content_info.getAttribute("data-dep-name") : null;
const dep_code= content_info?.getAttribute("data-dep-code") ? content_info.getAttribute("data-dep-code") : null;

if( type !== "tous"){
    const tab_type= type.split("@").map(item => item.substring(4).toLocaleLowerCase());
    Array.from(document.querySelectorAll(".checkbox_filter .checkbox")).forEach( checkbox => {
        if( !tab_type.includes(checkbox.getAttribute("id"))){
            checkbox.checked= false;
        }
    })
}

const OBJECT_MARKERS_STATION= new MarckerClusterStation(0,2.5,type,dep_name, dep_code)
OBJECT_MARKERS_STATION.onInit();


//// HIDE DETAILS STATION POP UP
document.querySelector("#close-detail-station").addEventListener("click", () => { 
    document.getElementById("remove-detail-station").setAttribute("class", "hidden")
})

if( document.querySelectorAll(".list_item_dep_station_js_jheo").length > 0 ){
    document.querySelectorAll(".list_item_dep_station_js_jheo").forEach(card_dom => {
        card_dom.addEventListener("click",() => {
            localStorage.removeItem("coordStation")
            card_dom.querySelector(".plus")?.click()
        })
    })
}


/////CONTENT FILTER FOR STATION ////////////////////////////////////////////////
function checkScreen(){
    if( screen.width < 991){
        ///utilise modal
        document.querySelector(".content_filter_global_jheo_js").innerHTML = "";
        
        document.querySelector(".content_filter_global_modal_jheo_js").innerHTML = `
            <div class="content_checkbox_filter">
                <div class="checkbox_filter">
                    <input class="checkbox" type="checkbox" id="tous_type_filter" value="tous" checked>
                    <label for="tous"> Tous</label>
                </div>
    
                <div class="checkbox_filter">
                    <input class="checkbox" type="checkbox" id="e85" value="prixE85" checked>
                    <label for="e85"> E85</label>
                </div>
                <div class="checkbox_filter">
                    <input class="checkbox" type="checkbox" id="gplc" value="prixGplc" checked>
                    <label for="gplc"> GPLC</label>
                </div>
                <div class="checkbox_filter">
                    <input class="checkbox" type="checkbox" id="sp95" value="prixSp95" checked>
                    <label for="sp95"> SP95</label>
                </div>
                <div class="checkbox_filter">
                    <input class="checkbox" type="checkbox" id="sp95_e10" value="prixSp95E10" checked>
                    <label for="sp95_e10"> SP95_E10</label>
                </div>
                <div class="checkbox_filter">
                    <input class="checkbox" type="checkbox" id="sp98" value="prixSp98" checked>
                    <label for="sp98"> SP98</label>
                </div>
                <div class="checkbox_filter">
                    <input class="checkbox" type="checkbox" id="gasoil" value="prixGasoil" checked>
                    <label for="gasoil"> Gasoil</label>
                </div>
            </div>
            <div class="content_filter_slide_bar">
                <div class="price_input">
                    <div class="field">
                        <span> Min</span>
                        <input type="number" class="input_min" min="0" max="2.5" value="0" step="0.01"> 
                    </div>
    
                    <div class="separator"> - </div>
    
                    <div class="field">
                        <span> Max</span>
                        <input type="number" class="input_max" min="0" max="2.5" value="2.5" step="0.01"> 
                    </div>
                </div>
    
                <div class="slider">
                    <div class="proggress"></div>
                </div>
    
                <div class="range_input">
                    <input type="range" class="range_min" max="2.5" value="0" step="0.01">
                    <input type="range" class="range_max" max="2.5" value="2.5" step="0.01">
                </div>
    
            </div> 
        `
    }else{
        ///utilise current
        document.querySelector(".content_filter_global_jheo_js").innerHTML = `
            <div class="content_checkbox_filter">
                <div class="checkbox_filter">
                    <input class="checkbox" type="checkbox" id="tous_type_filter" value="tous" checked>
                    <label for="tous"> Tous</label>
                </div>
    
                <div class="checkbox_filter">
                    <input class="checkbox" type="checkbox" id="e85" value="prixE85" checked>
                    <label for="e85"> E85</label>
                </div>
                <div class="checkbox_filter">
                    <input class="checkbox" type="checkbox" id="gplc" value="prixGplc" checked>
                    <label for="gplc"> GPLC</label>
                </div>
                <div class="checkbox_filter">
                    <input class="checkbox" type="checkbox" id="sp95" value="prixSp95" checked>
                    <label for="sp95"> SP95</label>
                </div>
                <div class="checkbox_filter">
                    <input class="checkbox" type="checkbox" id="sp95_e10" value="prixSp95E10" checked>
                    <label for="sp95_e10"> SP95_E10</label>
                </div>
                <div class="checkbox_filter">
                    <input class="checkbox" type="checkbox" id="sp98" value="prixSp98" checked>
                    <label for="sp98"> SP98</label>
                </div>
                <div class="checkbox_filter">
                    <input class="checkbox" type="checkbox" id="gasoil" value="prixGasoil" checked>
                    <label for="gasoil"> Gasoil</label>
                </div>
            </div>
            <div class="content_filter_slide_bar">
                <div class="price_input">
                    <div class="field">
                        <span> Min</span>
                        <input type="number" class="input_min" min="0" max="2.5" value="0" step="0.01"> 
                    </div>
    
                    <div class="separator"> - </div>
    
                    <div class="field">
                        <span> Max</span>
                        <input type="number" class="input_max" min="0" max="2.5" value="2.5" step="0.01"> 
                    </div>
                </div>
    
                <div class="slider">
                    <div class="proggress"></div>
                </div>
    
                <div class="range_input">
                    <input type="range" class="range_min" max="2.5" value="0" step="0.01">
                    <input type="range" class="range_max" max="2.5" value="2.5" step="0.01">
                </div>
    
            </div> 
        `
        document.querySelector(".content_filter_global_modal_jheo_js").innerHTML = "";
    }
}

/// THIS FUNCTION USE ONLY TO SET THE URL ON STATION TO SYNCHRONISE THE LINK DEPART WITH CHECKBOX FILTER ///
function changeDapartLinkCurrent(type){

	const all_link= document.querySelectorAll(".plus");
	all_link.forEach(item => {
		if( item.getAttribute("href").split("?").length > 1 ){
			item.setAttribute("href", item.getAttribute("href").split("?")[0]+ "?type="+ type)
		}else{
			item.setAttribute("href", item.getAttribute("href")+ "?type="+ type)
		}
	})

}