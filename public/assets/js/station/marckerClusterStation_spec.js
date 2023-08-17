//// check screen to add the screen filter. ////
checkScreen();

//// get information important to the station.
const parsedUrl = new URL(window.location.href);
const type= parsedUrl.searchParams.get("type") ? parsedUrl.searchParams.get("type") : "tous" /// type of esscence
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

////INSTANCE ///
const OBJECT_MARKERS_STATION= new MarckerClusterStation(0,2.5,type,dep_name, dep_code)
OBJECT_MARKERS_STATION.onInit(isAddControl=false);