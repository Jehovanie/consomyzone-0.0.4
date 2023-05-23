window.addEventListener('load', () => {
    const idRestaurant = document.querySelector("#all_ferme_in_dep > ul > li > div").getAttribute("data-toggle-id")
    let currentUserId = 0
    if(document.querySelector(".FtBjOlVf"))
        currentUserId = parseInt(document.querySelector(".FtBjOlVf").dataset.dem.split(":")[2].split("\.")[1].replace(/[^0-9]/g, ""), 10)
    // if (document.querySelector(".FtBjOlVf") != null)
    //      showModifArea(idRestaurant,currentUserId)
    
    // if (document.querySelector("#details-coord > div.content_note > div.nombre_avis")) {
    //     showNemberOfAvis(idRestaurant, document.querySelector("#details-coord > div.content_note > div.nombre_avis"))
    //     showNoteGlobale(idRestaurant)
    // }

    document.querySelector("#text-note").onkeyup = (e) => { 
        if (document.querySelector(".flash-msg-ERREUR")) {
            document.querySelector(".flash-msg-ERREUR").parentNode.removeChild(document.querySelector(".flash-msg-ERREUR"))
        }
        const value = e.target.value
        mustBeInferior4(value, e.target)
        
        
        setTimeout(() => {
            e.target.style="border:2px solid black;" 
            document.querySelectorAll(".flash-msg-ERREUR").forEach((i) => {
                i.style = " transition:2s ease-in-out; transform: translateX(-25px); opacity: 0;" 
                
            })
        }, 5000)   
    }

    document.querySelector("#text-note-modif").onkeyup = (e) => { 
        if (document.querySelector(".flash-msg-ERREUR")) {
            document.querySelector(".flash-msg-ERREUR").parentNode.removeChild(document.querySelector(".flash-msg-ERREUR"))
        }
        const value = e.target.value
        mustBeInferior4(value, e.target)
        
        
        setTimeout(() => {
            e.target.style="border:2px solid black;" 
            document.querySelectorAll(".flash-msg-ERREUR").forEach((i) => {
                i.style = " transition:2s ease-in-out; transform: translateX(-25px); opacity: 0;" 
                
            })
        }, 5000)   
    }
    document.querySelector("#Submit-Avis-resto-tom-js").onclick = () => {
       
        let note = document.querySelector("#text-note").value
        note=note.replace(/,/g,".")
        const avis = document.querySelector("#message-text").value
        try {
            mustBeInferior4(note, document.querySelector("#text-note"), true)  
            const requestParam = {
                note: parseFloat(note),
                avis:avis
            }
            //const idRestaurant=location.href.toString().split("/")[8]
            const request = new Request(`/avis/restaurant/${idRestaurant}`, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify(requestParam)
            })
            fetch(request).then(r => {
                if (r.ok && r.status === 200) {
                    showModifArea(idRestaurant, currentUserId)
                    if (document.querySelector("#see-tom-js")) {
                        showNemberOfAvis(idRestaurant, document.querySelector("#see-tom-js"))
                        showNoteGlobale(idRestaurant)
                    }
                }
            })
        } catch (e) {
            if (e.message == "note sup à 4") {
                alert("la note que vous aviez donnés est supérieur à 4")
            } else if(e.message == "non numerique") {
                alert("la note que vous aviez donnés n'est pas du type numeric ")
            }
        }
        
        
    }
    // if(document.querySelector("#see-tom-js")){
    //     document.querySelector("#see-tom-js").onclick = () => {
    //         const d=document.querySelectorAll(".fIQYlf")
    //         if(d.length > 0){
    //             d.forEach(i=>{
    //                 i.parentNode.removeChild(i)
    //             })
    //         }
    //         showAvis(currentUserId,idRestaurant) 
    //     }
    // }

    if (document.querySelector("#UpDate-Avis-tom-js")) {
        document.querySelector("#UpDate-Avis-tom-js").onclick = () => { 
            // alert("Updating")
            let note = document.querySelector("#text-note-modif").value
            note = note.replace(/,/g, ".")
            console.log(note)
            const avis = document.querySelector("#message-text-kidje3").value
            console.log(avis)
            try {
                    mustBeInferior4(note, document.querySelector("#text-note-modif"), true)  
                    const requestParam = {
                        note: parseFloat(note),
                        avis:avis
                    }
                    
                    //const idRestaurant=location.href.toString().split("/")[8]
                    const request = new Request(`/change/restaurant/${idRestaurant}`, {
                        method: "POST",
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body:JSON.stringify(requestParam)
                    })
                    fetch(request).then(r => {
                        if (r.ok && r.status === 200) {
                            // alert("Restaurants updated successfully")
                            console.log(currentUserId)
                            showModifArea(idRestaurant, currentUserId)
                            if (document.querySelector("#details-coord > div.content_note > div.nombre_avis")) {
                                showNemberOfAvis(idRestaurant, document.querySelector("#details-coord > div.content_note > div.nombre_avis"))
                                showNoteGlobale(idRestaurant)
                            }
                        }
                    })
            } catch (e) {
                if (e.message == "note sup à 4") {
                    alert("la note que vous aviez donnés est supérieur à 4")
                } else if(e.message == "non numerique") {
                    alert("la note que vous aviez donnés n'est pas du type numeric ")
                } else {
                    console.log(e)
                }
            }
        }
    }
   
})

function showNemberOfAvis(idRestaurant,parent) {
    fetch(`/nombre/avis/restaurant/${idRestaurant}`).then(r => {
        r.json().then(json => {
            const nombreAvis = json["nombre_avis"]
            createNombreAvisContainer(parent, nombreAvis) 
        })
    })

}

function showNoteGlobale(idRestaurant) { 
    fetch(`/avis/restaurant/global/${idRestaurant}`, {
        methode:"GET"
    }).then(r => {
        r.json().then(jsons => {
            let globalNote=0.00
            if (jsons) {
                let totalNote=0.00
                for (let json of jsons) {
                    totalNote+=parseFloat(json["note"])
                }
                globalNote = totalNote / jsons.length
                createGlobalNote(globalNote)
            }
        })
    })
}


function createGlobalNote(globalNote) {
    let rankRange = [0, 1, 2, 3, 4]
    // let stars = document.querySelectorAll("body > main > div.content_global > div > "+
    //     "div.content_home > div.left_content_home > div > div > div.content_note > div.start > i")
    let stars = document.querySelectorAll("#details-coord > div.content_note > div.start > i")
    for (let star of stars) {
        if (rankRange.includes(parseInt(star.dataset.rank, 10))) {
            if(parseInt(star.dataset.rank, 10) <= Math.trunc(globalNote))
                    star.style.color = "#F5D165"
            if (globalNote % 1 != 0) {
                //console.log(parseInt(star.dataset.rank, 10)+" "+(Math.trunc(globalNote) + 1))
                if (parseInt(star.dataset.rank, 10) == (Math.trunc(globalNote) + 1)) {
                      //console.log(parseInt(star.dataset.rank, 10)+" "+(Math.trunc(globalNote) + 1))
                    let rateYello = (globalNote % 1) *100
                    let rateBlack=100 -rateYello
                    star.style = `
                     background: linear-gradient(90deg, #F5D165 ${rateYello}%, #000 ${rateBlack}%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    `
                    
                }
            }
        }
    }
}


function createNombreAvisContainer(parent,nombre) {
    //const span = document.createElement("span")
    //span.classList.add("nombre_avis")
    //span.innerText += nombre
    console.log(parent)
    parent.textContent= nombre+" avis"
    //parent.insertBefore(, parent.firstChild)

}
function mustBeInferior4(value,target, isThrowException) {
    regex=/[^0-9,\.]+/
    if (parseFloat(value) > 4.00) {
        target.style = "border:2px solid red;"
        msgFlash("doit être inférieur ou égale à 4", target)
        if(isThrowException)
           throw new Error("note sup à 4")
    } else if (regex.test(value)) {
        target.style = "border:2px solid red;"
        msgFlash("veulliez saisir un type numerique", target)
        if(isThrowException)
           throw new Error("non numerique")
    }
}

function msgFlash(msg,target) {
    const div = document.createElement("div")
    div.classList.add("flash-msg-ERREUR")
    div.innerHTML= msg
    target.parentNode.insertBefore(div,target.nextSibling)
    
}

function showAvis(currentUserId,idRestaurant) {
    fetch(`/avis/restaurant/global/${idRestaurant}`, {
        methode:"GET"
    }).then(r => {
        r.json().then(jsons => {
            if (jsons) {
                for (let json of jsons) {
                    createShowAvisAreas(json,currentUserId)
                }
            }
        })
    })

}

function showModifArea(idRestaurant,currentUserId) {
    fetch(`/avis/restaurant/${idRestaurant}`, {
        methode:"GET"
    }).then(r => {
        r.json().then(jsons => {
            if (jsons) {
                console.log(jsons)
                for (let json of jsons) { 
                    const b = (currentUserId == json["user"]["id"])
                    if (b) {
                        if (document.querySelector("#givs-avis-resto-tom-js").style.display != "none") {
                            document.querySelector("#givs-avis-resto-tom-js").style.display = "none"
                            createModifArea(json,b)
                        } else {
                            if (document.querySelector(".fIQYlfPFT")) {
                                document.querySelector(".fIQYlfPFT").parentNode.removeChild(document.querySelector(".fIQYlfPFT"))
                                createModifArea(json,b)
                            }
                        }
                        break;
                    } 
                }
                
            }
        })
    })
}


function createModifArea(json,b) {
    console.log(json)
    const divEtAndModf=document.createElement("div")
    divEtAndModf.setAttribute("class", "fIQYlfMOP row")
    
    const divContentAvis = document.createElement("div")
    divContentAvis.setAttribute("class", "fIQYlfPFT card mt-4")
    const divNom = document.createElement("div")
    divNom.setAttribute("class", "TSUbDb")
    const pNom = document.createElement("p")
    pNom.setAttribute("class" , " text-muted")
    pNom.textContent = json["user"]["pseudo"]
    const hr = document.createElement("hr")
    const divEtoile=document.createElement("div")
    divEtoile.setAttribute("class", "lioTe col-6")
    const iStars1 = document.createElement("i")
    const iStars2 = document.createElement("i")
    const iStars3 = document.createElement("i")
    const iStars4 = document.createElement("i")
    const iStars5 = document.createElement("i")
    iStars1.setAttribute("class", "fa-solid fa-star")
    iStars2.setAttribute("class", "fa-solid fa-star")
    iStars3.setAttribute("class", "fa-solid fa-star")
    iStars4.setAttribute("class", "fa-solid fa-star")
    

    const divBtn = document.createElement("button")
    divBtn.setAttribute("class" , "kidje3 btn btn-outline-primary")
    divBtn.setAttribute("onclick","_kidMo(event)")
    divBtn.dataset.bsToggle = "modal"
    divBtn.setAttribute("href" , "#exampleModalToggle")
    divBtn.textContent = "Modifier"


    a=[iStars1, iStars2 , iStars3 ,iStars4 ]
    for(let i=0; i<a.length; i++){
        if( i < json["note"]){
            a[i].classList.add("checked")
            a[i].style.color="#F5D165"
        }
        divEtoile.appendChild(a[i])
    }

    divEtAndModf.appendChild(divEtoile)

    if(b){
        divEtoile.after(divBtn)
    }
    const divComment = document.createElement("div")
    divComment.setAttribute("class", "tnEmMeco")

    const pComment = document.createElement("p")
    pComment.textContent = json["avis"]
    
    divComment.appendChild(pComment)
    
    divNom.appendChild(pNom)

    
    divContentAvis.appendChild(divNom)
    divContentAvis.appendChild(hr)
    divContentAvis.appendChild(divEtAndModf)
    divContentAvis.appendChild(divComment)
    document.querySelector(".content_one_cta").appendChild(divContentAvis)
}

function createShowAvisAreas(json,currentUserId) {
    console.log(json)
    const divEtAndModf=document.createElement("div")
    divEtAndModf.setAttribute("class", "fIQYlfMOP row")
    
    const divContentAvis = document.createElement("div")
    divContentAvis.setAttribute("class", "fIQYlf card mt-4")
    const divNom = document.createElement("div")
    divNom.setAttribute("class", "TSUbDb")
    const pNom = document.createElement("p")
    pNom.setAttribute("class" , " text-muted")
    pNom.textContent = json["user"]["pseudo"]
    const hr = document.createElement("hr")
    const divEtoile=document.createElement("div")
    divEtoile.setAttribute("class", "lioTe  ms-5 col-6")
    const iStars1 = document.createElement("i")
    const iStars2 = document.createElement("i")
    const iStars3 = document.createElement("i")
    const iStars4 = document.createElement("i")
    const iStars5 = document.createElement("i")
    iStars1.setAttribute("class", "fa-solid fa-star")
    iStars2.setAttribute("class", "fa-solid fa-star")
    iStars3.setAttribute("class", "fa-solid fa-star")
    iStars4.setAttribute("class", "fa-solid fa-star")
  

    const divBtn = document.createElement("button")
    divBtn.setAttribute("class" , "kidje3 btn btn-outline-primary")
    divBtn.setAttribute("onclick","_kidMo(event)")
    divBtn.dataset.bsToggle = "modal"
    divBtn.setAttribute("href" , "#exampleModalToggle")
    divBtn.textContent = "Modifier"
    a=[iStars1, iStars2 , iStars3 ,iStars4]
    for(let i=0; i<a.length; i++){
        if( i < json["note"]){
            a[i].classList.add("checked")
            a[i].style.color="#F5D165"
        }
            
        divEtoile.appendChild(a[i])
    }

    divEtAndModf.appendChild(divEtoile)

    if(currentUserId == json["user"]["id"] && currentUserId!=null){
        divEtoile.after(divBtn)
    }
    const divComment = document.createElement("div")
    divComment.setAttribute("class", "tnEmMeco text-center")

    const pComment = document.createElement("p")
    pComment.textContent = json["avis"]
    
    divComment.appendChild(pComment)
    
    divNom.appendChild(pNom)

    
    divContentAvis.appendChild(divNom)
    divContentAvis.appendChild(hr)
    divContentAvis.appendChild(divEtAndModf)
    divContentAvis.appendChild(divComment)
    document.querySelector("#staticBackdrop > div > div > div.list-avis-ferme > div").appendChild(divContentAvis)
}
function _kidMo(event) {
    const v=event.target.parentNode.parentNode.querySelector(".tnEmMeco").textContent
    const stars=event.target.parentNode.querySelectorAll(".lioTe >i.checked").length
   
    const targertTextArea=document.querySelector("#message-text-kidje3")
    targertTextArea.value=v

   document.querySelector("#text-note-modif").value=stars
   
}

