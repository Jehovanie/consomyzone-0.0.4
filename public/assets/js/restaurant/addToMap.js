window.addEventListener('load', () => {
    addRestaurantToMap();
    ///hide navleft in the first visite
    if(document.querySelector("#close-navleft") ){
        document.querySelector("#close-navleft").click();
    }
})