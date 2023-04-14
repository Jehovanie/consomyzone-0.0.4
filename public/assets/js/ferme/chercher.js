console.log(DEP)

document.querySelector("#recherche-input-ferme-tom-js").onkeyup = (e) => {
    if (e.code === "Enter" || e.code === "NumpadEnter") { 
        const valueToSearch = e.target.value.toString().normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase()
            if (/^0[0-9]+$/.test(valueToSearch)) {
                lookupByDepCode(valueToSearch)
            } else if (/^0[0-9]+.[a-zA-Z]+/.test(valueToSearch)) {
                const tmp = valueToSearch.replace(/[^0-9]/g, "")
                lookupByDepCode(tmp)
            } else if (/^[0-9]+.[a-zA-Z]+$/.test(valueToSearch)) {
                const tmp = valueToSearch.replace(/[^0-9]/g, "")
                if (tmp.split("").length === 1) { 
                    const p = `0${tmp}`
                    lookupByDepCode(p)
                } else {
                    lookupByDepCode(tmp)
                }
                
            } else if (/[^0-9]/.test(valueToSearch)) {
                    lookupByDepName(valueToSearch)
            }else {
                if (valueToSearch.split("").length === 1) {
                    const tmp = `0${valueToSearch}`
                    lookupByDepCode(tmp)
                } else {
                    
                    lookupByDepCode(valueToSearch)
                }
            }
    }
}
function lookupByDepName(g) {
    DEP.depName.some((i,index) => {
        if ((i.toLowerCase()) === g ) {
             let code = DEP.depCode[index]
            if (index >= 0 && index <= 8) {
                // code = DEP.depCode[index].replace("0", "")
                // window.location=`/ferme/departement/${code}/${i}`
                window.location=`/ferme/departement/${i}/${code}`
            } else {
                // window.location=`/ferme/departement/${code}/${i}`
                window.location=`/ferme/departement/${i}/${code}`
            }
        }
    })
}

function lookupByDepCode(g) {
    DEP.depCode.some((i,index) => {
        if (i == g) {
            let name = DEP.depName[index]
            if (index >= 0 && index <= 8) {
                // window.location=`/ferme/departement/${i.replace("0","")}/${name}`
                window.location=`/ferme/departement/${name}/${i}`
            } else {
                // window.location=`/ferme/departement/${i}/${name}`
               window.location=`/ferme/departement/${name}/${i}`
            }
        }
    })
}

