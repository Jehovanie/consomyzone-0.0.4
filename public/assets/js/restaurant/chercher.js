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
    DEP.depName.some((i, index) => {
        if (DEP.depName[index] == 'Paris') {
            if ((i.toLowerCase()) === g) {
                let code = DEP.depCode[index]
                if (index >= 0 && index <= 8) {
                    // code = DEP.depCode[index].replace("0", "")
                    // window.location=`/ferme/departement/${code}/${i}`
                    // restaurant/specific?nom_dep=Loire-Atlantique&id_dep=44
                    window.location = `/restaurant/arrondissement?nom_dep=${i}&id_dep=${code}`
                } else {
                    // window.location=`/ferme/departement/${code}/${i}`
                    window.location = `/restaurant/arrondissement?nom_dep=${i}&id_dep=${code}`
                }
            }
        }else if (DEP.depName[index] == 'Loire-Atlantique') {
            if ((i.toLowerCase()) === g) {
                let code = DEP.depCode[index]
                if (index >= 0 && index <= 8) {
                    // code = DEP.depCode[index].replace("0", "")
                    // window.location=`/ferme/departement/${code}/${i}`
                    // restaurant/specific?nom_dep=Loire-Atlantique&id_dep=44
                    window.location = `/restaurant/specific?nom_dep=${i}&id_dep=${code}`
                } else {
                    // window.location=`/ferme/departement/${code}/${i}`
                    window.location = `/restaurant/specific?nom_dep=${i}&id_dep=${code}`
                }
            }
        }else if (DEP.depName[index] == 'Seine-et-Marne') {
            if ((i.toLowerCase()) === g) {
                let code = DEP.depCode[index]
                if (index >= 0 && index <= 8) {
                    // code = DEP.depCode[index].replace("0", "")
                    // window.location=`/ferme/departement/${code}/${i}`
                    // restaurant/specific?nom_dep=Loire-Atlantique&id_dep=44
                    window.location = `/restaurant/specific?nom_dep=${i}&id_dep=${code}`
                } else {
                    // window.location=`/ferme/departement/${code}/${i}`
                    window.location = `/restaurant/specific?nom_dep=${i}&id_dep=${code}`
                }
            }
        }else if (DEP.depName[index] == 'Yvelines') {
            if ((i.toLowerCase()) === g) {
                let code = DEP.depCode[index]
                if (index >= 0 && index <= 8) {
                    // code = DEP.depCode[index].replace("0", "")
                    // window.location=`/ferme/departement/${code}/${i}`
                    // restaurant/specific?nom_dep=Loire-Atlantique&id_dep=44
                    window.location = `/restaurant/specific?nom_dep=${i}&id_dep=${code}`
                } else {
                    // window.location=`/ferme/departement/${code}/${i}`
                    window.location = `/restaurant/specific?nom_dep=${i}&id_dep=${code}`
                }
            }
        } else {
            if (DEP.depCode[index] == 'Yvelines') {
                document.querySelector("#recherche-input-restaurant-tom-js").style.border = "1px solid #D5D9DB"
                document.querySelector("#recherche-input-restaurant-tom-js").style.transition = "border 3s"
            }else if (DEP.depCode[index] == 'Seine-et-Marne') {
                document.querySelector("#recherche-input-restaurant-tom-js").style.border = "1px solid #D5D9DB"
                document.querySelector("#recherche-input-restaurant-tom-js").style.transition = "border 3s"
            }else if (DEP.depCode[index] == 'Loire-Atlantique') {
                document.querySelector("#recherche-input-restaurant-tom-js").style.border = "1px solid #D5D9DB"
                document.querySelector("#recherche-input-restaurant-tom-js").style.transition = "border 3s"
            }else if (DEP.depCode[index] == 'Paris') {
                document.querySelector("#recherche-input-restaurant-tom-js").style.border = "1px solid #D5D9DB"
                document.querySelector("#recherche-input-restaurant-tom-js").style.transition = "border 3s"
            } else {
                document.querySelector("#recherche-input-restaurant-tom-js").style.border = "1px solid red"
                document.querySelector("#recherche-input-restaurant-tom-js").style.transition = "border 3s"
            }
            
            
        }

    })
}

function lookupByDepCodeResto(g) {
    
    DEP.depCode.some((i, index) => {
        if (DEP.depCode[index] == '75') {
            if (i == g) {
                let name = DEP.depName[index]
                if (index >= 0 && index <= 8) {
                    // window.location=`/ferme/departement/${i.replace("0","")}/${name}`
                    window.location = `/restaurant/arrondissement?nom_dep=${name}&id_dep=${i}`
                } else {
                    // window.location=`/ferme/departement/${i}/${name}`
                    window.location = `/restaurant/arrondissement?nom_dep=${name}&id_dep=${i}`
                }
                    
            }
        } else if (DEP.depCode[index] == '44') {
            if (i == g) {
                let name = DEP.depName[index]
                if (index >= 0 && index <= 8) {
                    // window.location=`/ferme/departement/${i.replace("0","")}/${name}`
                    window.location=`/restaurant/specific?nom_dep=${name}&id_dep=${i}`
                } else {
                    // window.location=`/ferme/departement/${i}/${name}`
                    window.location=`/restaurant/specific?nom_dep=${name}&id_dep=${i}`
                }
                
            } 
        }else if (DEP.depCode[index] == '77') {
            if (i == g) {
                let name = DEP.depName[index]
                if (index >= 0 && index <= 8) {
                    // window.location=`/ferme/departement/${i.replace("0","")}/${name}`
                    window.location=`/restaurant/specific?nom_dep=${name}&id_dep=${i}`
                } else {
                    // window.location=`/ferme/departement/${i}/${name}`
                    window.location=`/restaurant/specific?nom_dep=${name}&id_dep=${i}`
                }
                
            } 
        }else if (DEP.depCode[index] == '78') {
            if (i == g) {
                let name = DEP.depName[index]
                if (index >= 0 && index <= 8) {
                    // window.location=`/ferme/departement/${i.replace("0","")}/${name}`
                    window.location=`/restaurant/specific?nom_dep=${name}&id_dep=${i}`
                } else {
                    // window.location=`/ferme/departement/${i}/${name}`
                    window.location=`/restaurant/specific?nom_dep=${name}&id_dep=${i}`
                }
                
            } 
        } else {
            if (DEP.depCode[index] == '44') {
                document.querySelector("#recherche-input-restaurant-tom-js").style.border = "1px solid #D5D9DB"
                document.querySelector("#recherche-input-restaurant-tom-js").style.transition = "border 3s"
            }else if (DEP.depCode[index] == '75') {
                document.querySelector("#recherche-input-restaurant-tom-js").style.border = "1px solid #D5D9DB"
                document.querySelector("#recherche-input-restaurant-tom-js").style.transition = "border 3s"
            }else if (DEP.depCode[index] == '77') {
                document.querySelector("#recherche-input-restaurant-tom-js").style.border = "1px solid #D5D9DB"
                document.querySelector("#recherche-input-restaurant-tom-js").style.transition = "border 3s"
            }else if (DEP.depCode[index] == '78') {
                document.querySelector("#recherche-input-restaurant-tom-js").style.border = "1px solid #D5D9DB"
                document.querySelector("#recherche-input-restaurant-tom-js").style.transition = "border 3s"
            } else {
                document.querySelector("#recherche-input-restaurant-tom-js").style.border = "1px solid red"
                document.querySelector("#recherche-input-restaurant-tom-js").style.transition = "border 3s"
            }
            
            
        }
    })
}

