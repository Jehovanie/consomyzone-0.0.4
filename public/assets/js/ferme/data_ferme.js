window.addEventListener('load', () => {
    addMapFerme()
    document.querySelectorAll("#list_departements > div> a").forEach(item => {
        item.onclick = (e) => {
            localStorage.removeItem("coordFerme")
        }
    })
});