window.addEventListener('load', () => {
    addMapStation()
    document.querySelectorAll("#list_departements > div> a").forEach(item => {
        item.onclick = (e) => {
            localStorage.removeItem("coordStation")
        }
    })
});
