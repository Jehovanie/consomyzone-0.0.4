console.log(DEP)


if(document.querySelector("#recherche-tous-input-tom-js")){
    document.querySelector("#recherche-tous-input-tom-js").onkeyup = (e) => {
        if (e.code === "Enter" || e.code === "NumpadEnter") {
            
            const valueToSearch = e.target.value.toString().normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase()
            if (/^0[0-9]+$/.test(valueToSearch)) {
            } else if (/^0[0-9]+.[a-zA-Z]+/.test(valueToSearch)) {
                const tmp = valueToSearch.replace(/[^0-9]/g, "")
            } else if (/^[0-9]+.[a-zA-Z]+$/.test(valueToSearch)) {
                if (tmp.split("").length === 1) { 
                    const p = `0${tmp}`
                } else {
                }
                
            } else if (/[^0-9]/.test(valueToSearch)) {
            }else {
                if (valueToSearch.split("").length === 1) {
                    const tmp = `0${valueToSearch}`
                } else {
                    
                }
            }
        }
    }
}
