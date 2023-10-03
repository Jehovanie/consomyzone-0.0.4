window.addEventListener('load', () => {
    const id_dep = new URLSearchParams(window.location.href).get("id_dep")
    const nom_dep = new URLSearchParams(window.location.href).get("nom_dep")
    getDataSpecificMobile(nom_dep, id_dep)
    
    
    

});

