// console.log(DEP)

document.querySelector(".recherche-input-station-tom-js").onkeyup =(e) => {
    if (e.code === "Enter" || e.code === "NumpadEnter") { 
        redirectToSearch(e.target.value)
    }
}

document.querySelector(".content_input_search_dep_jheo_js").addEventListener("submit", (e) =>{
    e.preventDefault();
    if(document.querySelector(".input_search_dep_mobile_jheo_js").value){
        redirectToSearch(document.querySelector(".input_search_dep_mobile_jheo_js").value)
    }
})

function redirectToSearch(value){
    
    let type_filter= null;
    if(document.querySelector("#tous_type_filter").checked){
        type_filter="tous";
    }else{
        all_checkbox = document.querySelectorAll(".checkbox_filter .checkbox")
        var tab_filter_type = []
        all_checkbox.forEach(item => {
            if(item.checked){
                tab_filter_type.push(item.getAttribute("value"))
            }
        })
        type_filter = tab_filter_type.join("@")
    }

    const valueToSearch = value.toString().normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase()

    if (/^0[0-9]+$/.test(valueToSearch)) {
        lookupByDepCode(valueToSearch, type_filter)
    } else if (/^0[0-9]+.[a-zA-Z]+/.test(valueToSearch)) {
        const tmp = valueToSearch.replace(/[^0-9]/g, "")
        lookupByDepCode(tmp, type_filter)
    } else if (/^[0-9]+.[a-zA-Z]+$/.test(valueToSearch)) {
        const tmp = valueToSearch.replace(/[^0-9]/g, "")
        if (tmp.split("").length === 1) { 
            const p = `0${tmp}`
            lookupByDepCode(p, type_filter)
        } else {
            lookupByDepCode(tmp, type_filter)
        }
        
    } else if (/[^0-9]/.test(valueToSearch)) {
            lookupByDepName(valueToSearch, type_filter)
    }else {
        if (valueToSearch.split("").length === 1) {
            const tmp = `0${valueToSearch}`
            lookupByDepCode(tmp, type_filter)
        } else {
            lookupByDepCode(valueToSearch, type_filter)
        }
    }
}

function lookupByDepName(g, type) {
    DEP.depName.some((i,index) => {
        if ((i.toLowerCase()) === g ) {
             let code = DEP.depCode[index]
            if (index >= 0 && index <= 8) {
                code = DEP.depCode[index].replace("0", "")
                window.location=`/station/departement/${code}/${i}?type=${type}`
            } else {
                window.location=`/station/departement/${code}/${i}?type=${type}`
            }
        }
    })
}

function lookupByDepCode(g, type) {
    DEP.depCode.some((i,index) => {
        if (i == g) {
            let name = DEP.depName[index]
            if (index >= 0 && index <= 8) {
                window.location=`/station/departement/${i.replace("0","")}/${name}?type=${type}`
            } else {
               window.location=`/station/departement/${i}/${name}?type=${type}`
            }
        }
    })
}

