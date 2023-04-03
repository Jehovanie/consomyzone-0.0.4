window.addEventListener('load', () => {
    addRestaurantToMap()
    document.querySelectorAll("#list_departements > div > a").forEach(item => {
        item.onclick = (e) => {
            localStorage.removeItem("coord")
        }
    })  
})