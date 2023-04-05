const emojis = document.querySelectorAll("#exampleModal > div > div > div.modal-body > div > div > div.emoji")
const emojisInModif=document.querySelectorAll("#exampleModalToggle > div > div > div.modal-body > div > div > div > div.emoji")
let idStation = location.href.toString().split("/")[8]
let currentUserId = null

  const evtSource = new EventSource("/updateNoteStantion?idStation="+idStation)
    evtSource.addEventListener("upNoteStations",e=>{
    let globalNote = JSON.parse(e.data)
    let rankRange=[0,1,2,3,4]
        let stars = document.querySelectorAll("body > main > div.content_global > div > div.content_home >" +
            " div.left_content_home > div > div > div.content_note > div.start > i")
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
})

fetch(`/numnum/${idStation}`).then(r => {
        r.json().then(rFinals => {
            const nombreAvis = rFinals["response"][0]["1"]
            document.querySelector("#see-tom-js").textContent=`${nombreAvis} avis`
        })
})

if(document.querySelector(".FtBjOlV")!=null){
    currentUserId=parseInt(document.querySelector(".FtBjOlV").dataset.dem.split(":")[2].split("\.")[1].replace(/[^0-9]/g,""),10)
    fetch(`/getAvis/${idStation}`).then(r => {
        r.json().then(rFinals => {
                console.log(rFinals)
                for(let rFinal of rFinals){
                    let b=currentUserId == rFinal["user"]["id"]
                    if(b){
                        document.querySelector("#givs-avis-tom-js").style.display = "none"
                        ShowModifArea(rFinal,b)
                        break
                    }
                }
                     
            
               
        })
    })
}

__onclickEmoji(emojis)
__onclickEmoji(emojisInModif)


document.querySelector("#UpDate-Avis-tom-js").onclick = () => {
    const reactionArray = ["sad","sad-2","sad-3","happy","veryhappy"]
    
    const ds =document.querySelectorAll("#exampleModalToggle > div > div > div.modal-body > div > div > div > div.emoji.checked")

    const intTmp = ds.length > 0 ? parseInt(ds[0].dataset.rank, 10) : -1
    console.log(intTmp)
    let note = 0;
    if ( intTmp >= 0  && intTmp <= 5)
        note = parseInt(ds[0].dataset.rank,10)
    let comment = document.querySelector("#message-text-kidje3").value 
    let reactionStr = ""
    
    for (let d of ds) {
        if(reactionArray.includes(d.dataset.der))
            reactionStr=d.dataset.der
    }
    let objt = {
        etoile: note,
        comment: comment,
        idStation:parseInt(idStation,10),
        reaction: reactionStr
    }
    console.log(JSON.stringify(objt))
    const request =new Request("/upCmntvas", {
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
            currentUserId = parseInt(document.querySelector(".FtBjOlV").dataset.dem.split(":")[2].split("\.")[1].replace(/[^0-9]/g, ""), 10)
            fetch(`/getAvis/${idStation}`).then(r => {
                    r.json().then(rFinals => {
                        console.log(rFinals)
                        for(let rFinal of rFinals){
                            let b=currentUserId == rFinal["user"]["id"]
                            if(b){
                                document.querySelector("#givs-avis-tom-js").style.display = "none"
                                ShowModifArea(rFinal,b)
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
    //askConfirmation()
}
document.querySelector("#Submit-Avis-tom-js").onclick = () => {
    const reactionArray = ["sad","sad-2","sad-3","happy","veryhappy"]
    
    const ds = document.querySelectorAll("#exampleModal > div > div > div.modal-body > div > div.star-tom-js> .emoji.checked")
    const intTmp=ds!=null ?parseInt(ds[0].dataset.rank, 10):-1
    let note = 0;
    if (intTmp >= 0  && intTmp<= 5)
        note = parseInt(ds[0].dataset.rank,10)
    let comment = document.querySelector("#message-text").value 
    let reactionStr = ""
    
    for (let d of ds) {
        if(reactionArray.includes(d.dataset.der))
            reactionStr=d.dataset.der
    }
    let objt = {
        etoile: note,
        comment: comment,
        idStation:parseInt(idStation,10),
        reaction: reactionStr
    }
    console.log(JSON.stringify(objt))
    const request =new Request("/stcmntvas", {
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
            currentUserId=parseInt(document.querySelector(".FtBjOlV").dataset.dem.split(":")[2].split("\.")[1].replace(/[^0-9]/g,""),10)
            fetch(`/getAvis/${idStation}`).then(r => {
                    r.json().then(rFinals => {
                        console.log(rFinals)
                        for(let rFinal of rFinals){
                            let b=currentUserId == rFinal["user"]["id"]
                            if(b){
                                document.querySelector("#givs-avis-tom-js").style.display = "none"
                                ShowModifArea(rFinal,b)
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

document.querySelector("#see-tom-js").onclick = () => {
    const d=document.querySelectorAll(".fIQYlf")
    if(d.length > 0){
        d.forEach(i=>{
            i.parentNode.removeChild(i)
        })
    }
    fetch(`/getAvis/${idStation}`).then(r => {
        r.json().then(rFinals => {
                for(let rFinal of rFinals)
                    ShowAvis(rFinal,currentUserId)
            
               
        })
    })
}

function ShowModifArea(json,b) {
    
    console.log(json)
    const divEtAndModf=document.createElement("div")
    divEtAndModf.setAttribute("class", "fIQYlfMOP row")
    const reaction = json["reaction"]
    
    const divContentAvis = document.createElement("div")
    divContentAvis.setAttribute("class", "fIQYlfPFT card mt-4")
    const divNom = document.createElement("div")
    divNom.setAttribute("class", "TSUbDb")
    const pNom = document.createElement("p")
    pNom.setAttribute("class" , " text-muted")
    pNom.textContent = json["user"]["pseudo"]
    const hr = document.createElement("hr")
    hr.setAttribute("class" , "hr-modif")
    const divEtoile=document.createElement("div")
    divEtoile.setAttribute("class", "lioTe col")
    

    const divBtnModif = document.createElement("button")
    divBtnModif.setAttribute("class" , "kidje3 btn btn-outline-primary col")
    divBtnModif.setAttribute("onclick","_kidMo(event)")
    divBtnModif.dataset.bsToggle = "modal"
    divBtnModif.setAttribute("href" , "#exampleModalToggle")
    divBtnModif.textContent = "Modifier"

 
    const divReactionContainer = document.createElement("div")
    divReactionContainer.setAttribute("class", "reaction_container col-md-2")
    

    let reactionNode
    
    switch (reaction) {
        case "sad": {
            reactionNode=`<div class="inmodified  emoji--angry" data-rank="0" >
                                <div class="emoji__face">
                                    <div class="emoji__eyebrows"></div>
                                    <div class="emoji__eyes"></div>
                                    <div class="emoji__mouth"></div>
                                </div>
                            </div>`
            break;
        }
        case "sad-2": {
            reactionNode=` <div class="inmodified  emoji--sad--1 " data-rank="1">
                        <div class="emoji__face">
                            <div class="emoji__eyebrows"></div>
                            <div class="emoji__eyes"></div>
                            <div class="emoji__mouth"></div>
                        </div>
                    </div>`
            break;
        }
            case "sad-3": {
            reactionNode=`<div class="inmodified emoji--sad--3" data-rank="2">
                        <div class="emoji__face">
                            <div class="emoji__eyebrows"></div>
                            <div class="emoji__eyes"></div>
                            <div class="emoji__mouth"></div>
                        </div>
                    </div>`
            break;
        }
            case "happy": {
            reactionNode=`<div class="inmodified emoji--yay-2" data-rank="3">
                        <div class="emoji__face">
                            <div class="emoji__eyebrows"></div>
                            <div class="emoji__eyes"></div>
                            <div class="emoji__mouth"></div>
                        </div>
                    </div>`
            break;
        }
            case "veryhappy": {
            reactionNode=`<div class="inmodified emoji--yay" data-rank="4">
                        <div class="emoji__face">
                            <div class="emoji__eyebrows"></div>
                            <div class="emoji__mouth"></div>
                        </div>
                    </div>` 
            break;
        }
        case "":{
            reactionNode=`<div class="inmodified emoji--angry">
                <div class="emoji__face">
                    <div class="emoji__eyebrows"></div>
                    <div class="emoji__eyes"></div>
                    <div class="emoji__mouth"></div>
                </div>
            </div>
            `
            break
        }
    }
    divReactionContainer.innerHTML += reactionNode
   
   divEtAndModf.appendChild(divReactionContainer)
   
    
    const divComment = document.createElement("div")
    divComment.setAttribute("class", "tnEmMeco row")

    const divComments = document.createElement("div")
    divComments.setAttribute("class", "col-md-8 div-comment")

    
    const divIconSetting = document.createElement("div")
    divIconSetting.setAttribute("class", "col-md-2 div-setting dropdown")

    const aSetting = document.createElement("a")
    aSetting.setAttribute("class", "dropdown-toggle")
    aSetting.dataset.bsToggle = "dropdown"
    const ul = document.createElement("ul")
    ul.setAttribute("class" , "dropdown-menu")
    ul.innerHTML = `
            <li><a class="dropdown-item text-danger" href="#" id="Delete-Avis-tom-js" onclick="__delCom()">Supprimer</a></li>
            <li><a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#exampleModalToggle" onclick="__magicKidJe()">Modifier</a></li>`
    
    const iSetting = document.createElement("i")
    iSetting.setAttribute("class" , "fa-solid fa-ellipsis icon-menu")

    const pCommentTitle = document.createElement("p")
    pCommentTitle.setAttribute("class", "title-coment-modif ")
    pCommentTitle.textContent = "Votre commentaire :"
    

    const pComment = document.createElement("p")
    pComment.textContent = json["comment"]
    
    divComments.appendChild(pCommentTitle)
    divComments.appendChild(pComment)
    divComment.appendChild(divComments)
    divIconSetting.appendChild(aSetting)
    divIconSetting.appendChild(ul)
    //aSetting.appendChild(iSetting)
    divComment.appendChild(divIconSetting)
    
    divNom.appendChild(pNom)

    
    divContentAvis.appendChild(divNom)
    divContentAvis.appendChild(hr)
    divContentAvis.appendChild(divEtAndModf)
    divContentAvis.appendChild(divComment)
    if(b){
         //divComment.after(divBtnModif)
        aSetting.appendChild(iSetting)
    }
    document.querySelector(".content_one_cta").appendChild(divContentAvis)
    document.querySelector(".nmodified")
    const pNote = document.createElement('p')
    divEtAndModf.appendChild(pNote)
    pNote.setAttribute("class", "reaction_note col")
    pNote.textContent = "vous avez attribué(e) la note de : " + json["note"]

}
function __callbackChecked(emoji) {
    if (emoji.className.includes("checked")) {
        emoji.style="transform:scale(0.5)"
    } else {
        //emoji.style="transform:scale(0.2)"
        emoji.removeAttribute("style")
    }
    
}

function __onclickEmoji(elements) {
    if (elements.length > 0) {
    for (let element of elements) {
        element.onclick = () => {
            const currentRank=element.dataset.rank
            Array.from(elements).some(value => {
                
                if (value.className.includes("checked")  && value.dataset.rank != currentRank) { 
                    value.classList.remove("checked")
                     __callbackChecked(value)
                }
            }) 
            if (element.className.includes("checked")) {
                    element.classList.remove("checked")
                    __callbackChecked(element)
            } else {
                
                element.classList.add("checked")
                __callbackChecked(element)
                
            }
              
        }
     }
    }
}

function __magicKidJe(){
        fetch(`/getAvis/${idStation}`).then(r => {
        r.json().then(rFinals => {
                console.log(rFinals)
                for(let rFinal of rFinals){
                    let b=currentUserId == rFinal["user"]["id"]
                    if(b){
                        document.querySelector("#givs-avis-tom-js").style.display = "none"
                        __showComment(rFinal,b)
                        break
                    }
                }
                     
            
               
        })
    })
}

function __showComment(rFinal,b) {
    if(document.querySelector("#message-text-kidje3"))
        document.querySelector("#message-text-kidje3").value = rFinal["comment"]
    
    const note = rFinal["note"]
    const currentEmoji = document.querySelector("#exampleModalToggle > div > div >"+
        "div.modal-body > div > div > div > div[data-rank=\"" + note + "\"]")
    if (currentEmoji) {
        currentEmoji.style = "transform:scale(0.5)"
        currentEmoji.classList.add("checked")
    }
        

}
function __delCom() {
   
    currentUserId = parseInt(document.querySelector(".FtBjOlV").dataset.dem.split(":")[2].split("\.")[1].replace(/[^0-9]/g, ""), 10)
    const objt = {
        
        idStation:parseInt(idStation,10)
    }
    console.log(JSON.stringify(objt))
    const request =new Request("/dltCmntvas", {
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
            //document.querySelector("#exampleModalToggle > div > div > div.modal-header > button").click()
            document.querySelector("#givs-avis-tom-js").style.display = "block"
            
        }
    }).catch((e) => {
        console.log(e)
    })

}

function ShowAvis(json,currentUserId) {
    
     console.log(json)
    const divEtAndModf=document.createElement("div")
    divEtAndModf.setAttribute("class", "fIQYlfMOP row")
    const reaction = json["reaction"]
    
    const divContentAvis = document.createElement("div")
    divContentAvis.setAttribute("class", "fIQYlf card mt-4")
    const divNom = document.createElement("div")
    divNom.setAttribute("class", "TSUbDb")
    const pNom = document.createElement("p")
    pNom.setAttribute("class" , " text-muted")
    pNom.textContent = json["user"]["pseudo"]
    const hr = document.createElement("hr")
    hr.setAttribute("class" , "hr-modif")
    const divEtoile=document.createElement("div")
    divEtoile.setAttribute("class", "lioTe col")
    

    const divBtnModif = document.createElement("button")
    divBtnModif.setAttribute("class" , "kidje3 btn btn-outline-primary col")
    divBtnModif.setAttribute("onclick","_kidMo(event)")
    divBtnModif.dataset.bsToggle = "modal"
    divBtnModif.setAttribute("href" , "#exampleModalToggle")
    divBtnModif.textContent = "Modifier"

 
    const divReactionContainer = document.createElement("div")
    divReactionContainer.setAttribute("class", "reaction_container col-md-2")
    

    let reactionNode
    
    switch (reaction) {
        case "sad": {
            reactionNode=`<div class="inmodified  emoji--angry" data-rank="0">
                                <div class="emoji__face">
                                    <div class="emoji__eyebrows"></div>
                                    <div class="emoji__eyes"></div>
                                    <div class="emoji__mouth"></div>
                                </div>
                            </div>`
            break;
        }
        case "sad-2": {
            reactionNode=` <div class="inmodified  emoji--sad--1 " data-rank="1">
                        <div class="emoji__face">
                            <div class="emoji__eyebrows"></div>
                            <div class="emoji__eyes"></div>
                            <div class="emoji__mouth"></div>
                        </div>
                    </div>`
            break;
        }
            case "sad-3": {
            reactionNode=`<div class="inmodified emoji--sad--3" data-rank="2">
                        <div class="emoji__face">
                            <div class="emoji__eyebrows"></div>
                            <div class="emoji__eyes"></div>
                            <div class="emoji__mouth"></div>
                        </div>
                    </div>`
            break;
        }
            case "happy": {
            reactionNode=`<div class="inmodified emoji--yay-2" data-rank="3">
                        <div class="emoji__face">
                            <div class="emoji__eyebrows"></div>
                            <div class="emoji__eyes"></div>
                            <div class="emoji__mouth"></div>
                        </div>
                    </div>`
            break;
        }
            case "veryhappy": {
            reactionNode=`<div class="inmodified emoji--yay" data-rank="4">
                        <div class="emoji__face">
                            <div class="emoji__eyebrows"></div>
                            <div class="emoji__mouth"></div>
                        </div>
                    </div>` 
            break;
        }
        case "":{
            reactionNode=`<div class="inmodified emoji--angry">
                <div class="emoji__face">
                    <div class="emoji__eyebrows"></div>
                    <div class="emoji__eyes"></div>
                    <div class="emoji__mouth"></div>
                </div>
            </div>
            `
            break
        }
    }
    divReactionContainer.innerHTML += reactionNode
   
   divEtAndModf.appendChild(divReactionContainer)
   
    
    const divComment = document.createElement("div")
    divComment.setAttribute("class", "tnEmMeco row")

    const divComments = document.createElement("div")
    divComments.setAttribute("class", "col-md-8 div-comment")

    
    const divIconSetting = document.createElement("div")
    divIconSetting.setAttribute("class", "col-md-2 div-setting dropdown")

    const aSetting = document.createElement("a")
    aSetting.setAttribute("class", "dropdown-toggle")
    aSetting.dataset.bsToggle = "dropdown"
    const ul = document.createElement("ul")
    ul.setAttribute("class" , "dropdown-menu")
    ul.innerHTML = `
            <li><a class="dropdown-item text-danger" href="#" id="Delete-Avis-tom-js" onclick="__delCom()">Supprimer</a></li>
            <li><a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#exampleModalToggle" onclick="__magicKidJe()">Modifier</a></li>`
    
    const iSetting = document.createElement("i")
    iSetting.setAttribute("class" , "fa-solid fa-ellipsis icon-menu")

    const pCommentTitle = document.createElement("p")
    pCommentTitle.setAttribute("class", "title-coment-modif ")
    pCommentTitle.textContent = "Votre commentaire :"
    

    const pComment = document.createElement("p")
    pComment.textContent = json["comment"]
    
    divComments.appendChild(pCommentTitle)
    divComments.appendChild(pComment)
    divComment.appendChild(divComments)
    divIconSetting.appendChild(aSetting)
    divIconSetting.appendChild(ul)
    //aSetting.appendChild(iSetting)
    divComment.appendChild(divIconSetting)
    
    divNom.appendChild(pNom)

    
    divContentAvis.appendChild(divNom)
    divContentAvis.appendChild(hr)
    divContentAvis.appendChild(divEtAndModf)
    divContentAvis.appendChild(divComment)
    if(currentUserId == json["user"]["id"] && currentUserId!=null){
         //divComment.after(divBtnModif)
        aSetting.appendChild(iSetting)
    }
    document.querySelector("#staticBackdrop > div > div > div.list-avis > div").appendChild(divContentAvis)
    document.querySelector(".nmodified")
    const pNote = document.createElement('p')
    divEtAndModf.appendChild(pNote)
    pNote.setAttribute("class", "reaction_note col")
    pNote.textContent = "vous avez attribué(e) la note de : " + json["note"]

}