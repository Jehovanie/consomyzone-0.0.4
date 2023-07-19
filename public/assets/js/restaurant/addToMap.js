window.addEventListener('load', () => {
    addRestaurantToMap();
    
    // //addRestaurantToMap();
    // const content_map = document.querySelector(".cart_map_js_jheo");
    // let geos=[]
    // document.querySelectorAll(".element_js_jheo").forEach(item => {
    //     const dep = item.dataset.toggleDepartId
    //     geos.push(franceGeo.features.find(element => element.properties.code == dep))
    // })
    // if( !document.querySelector("#map")){
    //     const map= document.createElement("div");
    //     map.setAttribute("id", "map");
    //     map.setAttribute("class", "map map_js_jheo");

    //     content_map.appendChild(map);
    // }
    // const request=new Request('/restaurant/poi/limit', {
    //     method: 'GET',
    //     headers: {
    //             'Accept': 'application/json',
    //             "Content-Type": "application/json; charset=utf-8"
    //     }
    // })
    // fetch(request).then(response => {
    //     if (response.status === 200 && response.ok) {
    //             response.json().then(jsons => {
    //                 const mapAdminRestaurant = new MapAdminRestaurant(jsons,"map");
    //                 mapAdminRestaurant.initMap(geos)
    //                     .renderAllPOI();
    //                 //remove loader
    //                 if (document.querySelector("#toggle_chargement"))
    //                     document.querySelector("#toggle_chargement").
    //                         parentNode.removeChild(document.querySelector("#toggle_chargement"))
                    
    //                 mapAdminRestaurant.handleMapResizeAndMouveEnd()
    //                 mapAdminRestaurant.loadStufAfterEachMoveEnd()
    //             })
    //     }
    // })

    ///hide navleft in the first visite
    if(document.querySelector("#close-navleft") ){
        document.querySelector("#close-navleft").click();
    }
})