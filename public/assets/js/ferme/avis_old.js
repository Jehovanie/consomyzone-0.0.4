let itemStars = document.querySelectorAll("#exampleModal > div > div > div.modal-body > div > div.star-tom-js> i")
let idFerme=location.href.toString().split("/")[8]
let currentUserId=null

if(document.querySelector(".FtBjOlVf")!=null){
    currentUserId=parseInt(document.querySelector(".FtBjOlVf").dataset.dem.split(":")[2].split("\.")[1].replace(/[^0-9]/g,""),10)
    fetch(`/getAvisFerme/${idFerme}`).then(r => {
        r.json().then(rFinals => {
                console.log(rFinals)
                for(let rFinal of rFinals){
                    let b=currentUserId == rFinal["user"]["id"]
                    if(b){
                        document.querySelector("#givs-avis-ferme-tom-js").style.display = "none"
                        ShowModifAreaf(rFinal,b)
                        break
                    }
                }

        })
    })
}
   
let itemStarsKidje3= document.querySelectorAll("#exampleModalToggle > div > div >div.modal-body > div.content_note_kidje3  > div > i")
for(let itemStarKidje3 of itemStarsKidje3){   
    itemStarKidje3.onclick=(e)=>{
            let currentRank = e.target.dataset.rank
            if (e.target.className.includes("checked")) {
           
                Array.from(itemStarsKidje3).forEach((item) => {

                    __callbackUnChecked(item,currentRank)
                })
        } else {
            e.target.style.color = "#F5D165" 
            e.target.classList.add("checked")
            Array.from(itemStarsKidje3).forEach((item) => {
                __callbackChecked(item,currentRank)
            })
        }
    }
}

function _kidMo(event){
    
    const v=event.target.parentNode.parentNode.querySelector(".tnEmMeco").textContent
    const stars=event.target.parentNode.querySelectorAll(".lioTe >i.checked").length
   
    const targertTextArea=document.querySelector("#message-text-kidje3")
    targertTextArea.value=v

    const targetStars=document.querySelectorAll("#exampleModalToggle > div > div >"+ 
            "div.modal-body > div.content_note_kidje3  > div > i")
    for(let targetStar of targetStars){
        if(parseInt(targetStar.dataset.rank) <=stars){
            targetStar.style.color="#F5D165" 
            targetStar.classList.add("checked")
        }
    }
}
if(document.querySelector("#UpDate-Avis-tom-js") ){

    document.querySelector("#UpDate-Avis-tom-js").onclick = () => {
        let note = document.querySelectorAll("#exampleModalToggle > div > div >div.modal-body > div.content_note_kidje3  > div > i.checked").length
        let comment = document.querySelector("#message-text-kidje3").value 
       
        let objt = {
            etoile: parseInt(note,10),
            comment: comment,
            idFerme:parseInt(idFerme,10)
        }
        console.log(JSON.stringify(objt))
        const request =new Request("/upCmntvasf", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(objt)
        })
        fetch(request).then(r => {
            if (r.ok && r.status === 200) {
                if (document.querySelector(".fIQYlfPFT ") != null)
                        document.querySelector(".fIQYlfPFT ").parentNode.removeChild(document.querySelector(".fIQYlfPFT "))
                document.querySelector("#exampleModalToggle > div > div > div.modal-header > button").click()
                currentUserId = parseInt(document.querySelector(".FtBjOlVf").dataset.dem.split(":")[2].split("\.")[1].replace(/[^0-9]/g, ""), 10)
                fetch(`/getAvisFerme/${idFerme}`).then(r => {
                        r.json().then(rFinals => {
                            console.log(rFinals)
                            for(let rFinal of rFinals){
                                let b=currentUserId == rFinal["user"]["id"]
                                if(b){
                                    document.querySelector("#givs-avis-ferme-tom-js").style.display = "none"
                                    ShowModifAreaf(rFinal,b)
                                    break
                                }
                            }
                        })
                })
            } else {
                
            }
        }).catch(e => {
            console.log(e)
        })
        askConfirmationFerme()
    }

}

if( document.querySelector("#Submit-Avis-tom-js")){
    document.querySelector("#Submit-Avis-tom-js").onclick = () => {
        let note = document.querySelectorAll("#exampleModal > div > div > div.modal-body > div > div.star-tom-js> i.checked").length
        let comment = document.querySelector("#message-text").value 
       
        let objt = {
            etoile: parseInt(note,10),
            comment: comment,
            idFerme:parseInt(idFerme,10)
        }
        console.log(JSON.stringify(objt))
        const request =new Request("/stcmntvasf", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(objt)
        })
        fetch(request).then(r => {
            if (r.ok && r.status === 200) {
                if (document.querySelector(".fIQYlfPFT ") != null)
                        document.querySelector(".fIQYlfPFT ").parentNode.removeChild(document.querySelector(".fIQYlfPFT "))
                document.querySelector("#exampleModal > div > div > div.modal-header > button").click()
                currentUserId=parseInt(document.querySelector(".FtBjOlVf").dataset.dem.split(":")[2].split("\.")[1].replace(/[^0-9]/g,""),10)
                fetch(`/getAvisFerme/${idFerme}`).then(r => {
                        r.json().then(rFinals => {
                            console.log(rFinals)
                            for(let rFinal of rFinals){
                                let b=currentUserId == rFinal["user"]["id"]
                                if(b){
                                    document.querySelector("#givs-avis-ferme-tom-js").style.display = "none"
                                    ShowModifAreaf(rFinal,b)
                                    break
                                }
                            }
                        })
                })
            } else {
               //TODO make toats notif for error 
            }
        }).catch(e => {
            console.log(e)
        })
    }
}

if(document.querySelector("#Delete-Avis-Ferme-tom-js")){
    document.querySelector("#Delete-Avis-Ferme-tom-js").onclick = (e) => {
        currentUserId = parseInt(document.querySelector(".FtBjOlVf").dataset.dem.split(":")[2].split("\.")[1].replace(/[^0-9]/g, ""), 10)
        const objt = {
            
            idFerme:parseInt(idFerme,10)
        }
        console.log(JSON.stringify(objt))
        const request =new Request("/dltCmntvasf", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(objt)
        })
        fetch(request).then(r => { 
            if (r.ok && r.status === 200) {
                if (document.querySelector(".fIQYlfPFT ") != null)
                        document.querySelector(".fIQYlfPFT ").parentNode.removeChild(document.querySelector(".fIQYlfPFT "))
                document.querySelector("#exampleModalToggle > div > div > div.modal-header > button").click()
                document.querySelector("#givs-avis-ferme-tom-js").style.display = "block"
                
            }
        }).catch((e) => {
            console.log(e)
        })
    }
}

if(document.querySelector("#see-tom-js")){
    document.querySelector("#see-tom-js").onclick = () => {
        const d=document.querySelectorAll(".fIQYlf")
        if(d.length > 0){
            d.forEach(i=>{
                i.parentNode.removeChild(i)
            })
        }
        fetch(`/getAvisFerme/${idFerme}`).then(r => {
            r.json().then(rFinals => {
                    for(let rFinal of rFinals)
                        ShowAvisF(rFinal,currentUserId)
                
                   
            })
        })
    }
}



for (let itemStar of itemStars) {
   
    
    itemStar.onclick = (e) => {
        let currentRank = e.target.dataset.rank
        if (e.target.className.includes("checked")) {
           
            Array.from(itemStars).forEach((item) => {

            __callbackUnChecked(item,currentRank)
            })
        } else {
            e.target.style.color = "#F5D165" 
            e.target.classList.add("checked")
            Array.from(itemStars).forEach((item) => {

            __callbackChecked(item,currentRank)
            })
        }
        
        
        
             
    }
   

}

function __callbackChecked(element,a){
    console.log(element)
    if (element.dataset.rank < a) {
        element.style.color = "#F5D165" 
        element.classList.add("checked")
    }
}

function __callbackUnChecked(element,a){
    console.log(element)
    if (element.dataset.rank > a) {
        element.style.color = "#000" 
        element.classList.remove("checked")
    }
}

function ShowAvisF(json,currentUserId) {
    
    console.log(json)
    const divEtAndModf=document.createElement("div")
    divEtAndModf.setAttribute("class", "fIQYlfMOP row")
    
    const divContentAvis = document.createElement("div")
    divContentAvis.setAttribute("class", "fIQYlf card mt-4")
    const divNom = document.createElement("div")
    divNom.setAttribute("class", "TSUbDb")
    const pNom = document.createElement("p")
    pNom.setAttribute("class" , " text-muted")
    pNom.textContent = json["user"]["email"]
    const hr = document.createElement("hr")
    const divEtoile=document.createElement("div")
    divEtoile.setAttribute("class", "lioTe col-md-4")
    const iStars1 = document.createElement("i")
    const iStars2 = document.createElement("i")
    const iStars3 = document.createElement("i")
    const iStars4 = document.createElement("i")
    const iStars5 = document.createElement("i")
    iStars1.setAttribute("class", "fa-solid fa-star")
    iStars2.setAttribute("class", "fa-solid fa-star")
    iStars3.setAttribute("class", "fa-solid fa-star")
    iStars4.setAttribute("class", "fa-solid fa-star")
    iStars5.setAttribute("class", "fa-solid fa-star")

    const divBtn = document.createElement("button")
    divBtn.setAttribute("class" , "kidje3 btn btn-outline-primary col-md-3")
    divBtn.setAttribute("onclick","_kidMo(event)")
    divBtn.dataset.bsToggle = "modal"
    divBtn.setAttribute("href" , "#exampleModalToggle")
    divBtn.textContent = "Modifier"
    a=[iStars1, iStars2 , iStars3 ,iStars4 ,iStars5]
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
    divComment.setAttribute("class", "tnEmMeco")

    const pComment = document.createElement("p")
    pComment.textContent = json["comment"]
    
    divComment.appendChild(pComment)
    
    divNom.appendChild(pNom)

    
    divContentAvis.appendChild(divNom)
    divContentAvis.appendChild(hr)
    divContentAvis.appendChild(divEtAndModf)
    divContentAvis.appendChild(divComment)
    document.querySelector("#staticBackdrop > div > div > div.list-avis-ferme > div").appendChild(divContentAvis)
}

function askConfirmationFerme(){
    const divRow = document.createElement("div")
    divRow.setAttribute("class" , "row")
    const divCol1 = document.createElement("div")
    divRow.setAttribute("class" , "col")
    const divCol2 = document.createElement("div")
    divRow.setAttribute("class" , "col")
    const BtnOui = document.createElement("button")
    divRow.setAttribute("class" , "btn")
    const BtnNon = document.createElement("button")
    divRow.setAttribute("class" , "btn")

    BtnOui.textContent = "Oui"
    BtnNon.textContent = "Non"

    divRow.appendChild(divCol1)
    divRow.appendChild(divCol2)
    divCol1.appendChild(BtnOui)
    divCol2.appendChild(BtnNon)

}


function ShowModifAreaf(json,b) {
    
    console.log(json)
    const divEtAndModf=document.createElement("div")
    divEtAndModf.setAttribute("class", "fIQYlfMOP row")
    
    const divContentAvis = document.createElement("div")
    divContentAvis.setAttribute("class", "fIQYlfPFT card mt-4")
    const divNom = document.createElement("div")
    divNom.setAttribute("class", "TSUbDb")
    const pNom = document.createElement("p")
    pNom.setAttribute("class" , " text-muted")
    pNom.textContent = json["user"]["email"]
    const hr = document.createElement("hr")
    const divEtoile=document.createElement("div")
    divEtoile.setAttribute("class", "lioTe col")
    const iStars1 = document.createElement("i")
    const iStars2 = document.createElement("i")
    const iStars3 = document.createElement("i")
    const iStars4 = document.createElement("i")
    const iStars5 = document.createElement("i")
    iStars1.setAttribute("class", "fa-solid fa-star")
    iStars2.setAttribute("class", "fa-solid fa-star")
    iStars3.setAttribute("class", "fa-solid fa-star")
    iStars4.setAttribute("class", "fa-solid fa-star")
    iStars5.setAttribute("class", "fa-solid fa-star")

    const divBtn = document.createElement("button")
    divBtn.setAttribute("class" , "kidje3 btn btn-outline-primary col")
    divBtn.setAttribute("onclick","_kidMo(event)")
    divBtn.dataset.bsToggle = "modal"
    divBtn.setAttribute("href" , "#exampleModalToggle")
    divBtn.textContent = "Modifier"


    a=[iStars1, iStars2 , iStars3 ,iStars4 ,iStars5]
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
    pComment.textContent = json["comment"]
    
    divComment.appendChild(pComment)
    
    divNom.appendChild(pNom)

    
    divContentAvis.appendChild(divNom)
    divContentAvis.appendChild(hr)
    divContentAvis.appendChild(divEtAndModf)
    divContentAvis.appendChild(divComment)
    document.querySelector(".content_one_cta").appendChild(divContentAvis)
}