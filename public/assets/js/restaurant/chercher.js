console.log(DEP)

document.querySelector("#recherche-input-restaurant-tom-js").onkeyup = (e) => {
    if (e.code === "Enter" || e.code === "NumpadEnter") { 
        const valueToSearch = e.target.value.toString().normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase()
            if (/^0[0-9]+$/.test(valueToSearch)) {
                lookupByDepCodeResto(valueToSearch)
            } else if (/^0[0-9]+.[a-zA-Z]+/.test(valueToSearch)) {
                const tmp = valueToSearch.replace(/[^0-9]/g, "")
                lookupByDepCodeResto(tmp)
            } else if (/^[0-9]+.[a-zA-Z]+$/.test(valueToSearch)) {
                const tmp = valueToSearch.replace(/[^0-9]/g, "")
                if (tmp.split("").length === 1) { 
                    const p = `0${tmp}`
                    lookupByDepCodeResto(p)
                } else {
                    lookupByDepCodeResto(tmp)
                }
                
            } else if (/[^0-9]/.test(valueToSearch)) {
                    lookupByDepNameResto(valueToSearch)
            }else {
                if (valueToSearch.split("").length === 1) {
                    const tmp = `0${valueToSearch}`
                    lookupByDepCodeResto(tmp)
                } else {
                    
                    lookupByDepCodeResto(valueToSearch)
                }
            }
    }
}
function lookupByDepNameResto(g) {
    DEP.depName.some((i,index) => {
        if ((i.toLowerCase()) === g ) {
             let code = DEP.depCode[index]
            if (index >= 0 && index <= 8) {
                // code = DEP.depCode[index].replace("0", "")
                // window.location=`/ferme/departement/${code}/${i}`
                window.location=`/restaurant/departement/${i}/${code}`
            } else {
                // window.location=`/ferme/departement/${code}/${i}`
                window.location=`/restaurant/departement/${i}/${code}`
            }
        }
    })
}

function lookupByDepCodeResto(g) {
    DEP.depCode.some((i,index) => {
        if (i == g) {
            let name = DEP.depName[index]
            if (index >= 0 && index <= 8) {
                // window.location=`/ferme/departement/${i.replace("0","")}/${name}`
                window.location=`/restaurant/departement/${name}/${i}`
            } else {
                // window.location=`/ferme/departement/${i}/${name}`
               window.location=`/restaurant/departement/${name}/${i}`
            }
        }
    })
}

