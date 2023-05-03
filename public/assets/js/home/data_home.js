function deleteMap(){
    const cart_map = document.getElementById("map");
    const parent_map = cart_map.parentElement;
    parent_map.removeChild(cart_map);
}
///create chargement div
function createDivChargement(){

    // {# <div id="map"  style="width: 100%;"></div> #}
    if( !document.getElementById("map")){

        const div_content = document.createElement("div");
        div_content.setAttribute("id", "toggle_chargement");
        div_content.setAttribute("class", "chargement_content");

        const div_content_box = document.createElement("div");
        div_content_box.setAttribute("class", "content_box");

        const div_box = document.createElement("div");
        div_box.setAttribute("class", "box");

        const div_under_box = document.createElement("div");
        div_under_box.setAttribute("class", "under_box");

        div_box.appendChild(div_under_box);
        div_content_box.appendChild(div_box);
        div_content.appendChild(div_content_box);

        document.querySelector(".cart_map").appendChild(div_content);

    }
}