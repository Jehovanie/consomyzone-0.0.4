const emojisAccueil =document.querySelectorAll(`#exampleModal > div > div > div.modal-body > div > div > div.emoji-accueil > div.emoji`)
const emojiPrix = document.querySelectorAll(`#exampleModal > div > div > div.modal-body > div > div > div.emoji-prix > div.emoji`);
const emojiQualiteP = document.querySelectorAll(`#exampleModal > div > div > div.modal-body > div > div > div.emoji-qualite-produit > div.emoji`)

const emojisAccueilInModif=document.querySelectorAll("#exampleModalToggle > div > div > div.modal-body > div > div > div > div.emoji-accueil > div.emoji")
const emojisPrixInModif=document.querySelectorAll("#exampleModalToggle > div > div > div.modal-body > div > div > div > div.emoji-prix > div.emoji")
const emojisQualitePInModif=document.querySelectorAll("#exampleModalToggle > div > div > div.modal-body > div > div > div > div.emoji-qualite-produit > div.emoji")
let idFerme = location.href.toString().split("/")[8]
let currentUserId = null

//setInterval(e=>{
    const evtSource = new EventSource("/updateNote?idFerme="+idFerme)
    evtSource.addEventListener("upNote",e=>{
    let globalNote = JSON.parse(e.data)
    let rankRange=[0,1,2,3,4]
    let stars = document.querySelectorAll("body > main > div.content_global > div > "+
        "div.content_home > div.left_content_home > div > div > div.content_note > div.start > i")
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

//},10000)

fetch(`/numnumf/${idFerme}`).then(r => {
    r.json().then(rFinals => {
            
            const nombreAvis = rFinals["response"]
            document.querySelector("#see-tom-js").textContent = `${nombreAvis} avis`
            
        })
})

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

__onclickEmojiF(emojisAccueil)
__onclickEmojiF(emojiPrix)
__onclickEmojiF(emojiQualiteP)
__onclickEmojiF(emojisAccueilInModif)
__onclickEmojiF(emojisPrixInModif)
__onclickEmojiF(emojisQualitePInModif)


document.querySelector("#UpDate-Avis-tom-js").onclick = () => {
    const reactionArray = ["sad","sad-2","sad-3","happy","veryhappy"]
    
    
    const dsAccueil = document.querySelector("#exampleModalToggle > div > div > div.modal-body > div > div > div > div.emoji-accueil > div.emoji.checked")
    const dsPrix = document.querySelector("#exampleModalToggle > div > div > div.modal-body > div > div > div > div.emoji-prix > div.emoji.checked")
    const dsQualiteP = document.querySelector("#exampleModalToggle > div > div > div.modal-body > div > div > div > div.emoji-qualite-produit > div.emoji.checked")
    

    const intTmpA = dsAccueil != null ? parseInt(dsAccueil.dataset.rank, 10) : -1
    const intTmpP=dsPrix!=null ? parseInt(dsPrix.dataset.rank, 10):-1
    const intTmpQ=dsQualiteP!=null ?parseInt(dsQualiteP.dataset.rank, 10):-1
    let note = 0;
    let noteAccueil = 0;
    let notePrix = 0;
    let noteQualiteP = 0;

   
    if (intTmpA >= 0 && intTmpA <= 4 ) {
        noteAccueil = parseInt(dsAccueil.dataset.rank,10)
    }
    if (intTmpP >= 0 && intTmpP <= 4 ) {
        notePrix = parseInt(dsPrix.dataset.rank,10)
    }
    if (intTmpQ >= 0 && intTmpQ <= 4 ) {
        noteQualiteP = parseInt(dsQualiteP.dataset.rank,10)
    }
    let comment = document.querySelector("#message-text-kidje3").value 
    let reactionStrA = ""
    let reactionStrP = ""
    let reactionStrQ = ""
    
    if(dsAccueil!=null && reactionArray.includes(dsAccueil.dataset.der) )
            reactionStrA=dsAccueil.dataset.der
    
        if(dsPrix!=null && reactionArray.includes(dsPrix.dataset.der))
            reactionStrP=dsPrix.dataset.der
    
        if(dsQualiteP!=null && reactionArray.includes(dsQualiteP.dataset.der))
            reactionStrQ = dsQualiteP.dataset.der

    note = ((noteAccueil + notePrix + noteQualiteP) / 12) * 4

    let objt = {
        etoile: note,
        comment: comment,
        idFerme:parseInt(idFerme,10),
       reactionAccueil: reactionStrA,
        reactionPrix: reactionStrP,
        reactionQualiteP: reactionStrQ,
        noteAccueil: noteAccueil,
        notePrix: notePrix,
        noteQualiteP: noteQualiteP
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
    //askConfirmation()
}
document.querySelector("#Submit-Avis-tom-js").onclick = () => {
    const reactionArray = ["sad", "sad-2", "sad-3", "happy", "veryhappy"]
    
    // const ds = document.querySelectorAll("#exampleModal > div > div > div.modal-body > div > div.star-tom-js > div.emoji-accueil> .emoji.checked")
        //#exampleModal > div > div > div.modal-body > div > div > div.emoji-accueil > div.emoji.emoji--angry.checked.animated-low-sad
    const dsAccueil = document.querySelector("#exampleModal > div > div > div.modal-body > div > div > div.emoji-accueil > div.emoji.checked")
    const dsPrix = document.querySelector("#exampleModal > div > div > div.modal-body > div > div >div.emoji-prix > div.emoji.checked")
    const dsQualiteP = document.querySelector("#exampleModal > div > div > div.modal-body > div > div >div.emoji-qualite-produit > div.emoji.checked")
    // const intTmp=ds!=null ?parseInt(ds[0].dataset.rank, 10):-1
    const intTmpA = dsAccueil != null ? parseInt(dsAccueil.dataset.rank, 10) : -1
    console.log(intTmpA)
    const intTmpP=dsPrix!=null ? parseInt(dsPrix.dataset.rank, 10):-1
    const intTmpQ=dsQualiteP!=null ?parseInt(dsQualiteP.dataset.rank, 10):-1
    let note = 0;
    let noteAccueil = 0;
    let notePrix = 0;
    let noteQualiteP = 0;

    if (intTmpA >= 0 && intTmpA <= 4 ) {
        noteAccueil = parseInt(dsAccueil.dataset.rank,10)
    }
    if (intTmpP >= 0 && intTmpP <= 4 ) {
        notePrix = parseInt(dsPrix.dataset.rank,10)
    }
    if (intTmpQ >= 0 && intTmpQ <= 4 ) {
        noteQualiteP = parseInt(dsQualiteP.dataset.rank,10)
    }
    let comment = document.querySelector("#message-text").value 
    let reactionStrA = ""
    let reactionStrP = ""
    let reactionStrQ = ""

   
        if(dsAccueil!=null && reactionArray.includes(dsAccueil.dataset.der) )
            reactionStrA=dsAccueil.dataset.der
    
        if(dsPrix!=null && reactionArray.includes(dsPrix.dataset.der))
            reactionStrP=dsPrix.dataset.der
    
        if(dsQualiteP!=null && reactionArray.includes(dsQualiteP.dataset.der))
            reactionStrQ=dsQualiteP.dataset.der
    
    note=((noteAccueil+notePrix+noteQualiteP)/12)*4
    let objt = {
        etoile: note,
        comment: comment,
        idFerme:parseInt(idFerme,10),
        reactionAccueil: reactionStrA,
        reactionPrix: reactionStrP,
        reactionQualiteP: reactionStrQ,
        noteAccueil: noteAccueil,
        notePrix: notePrix,
        noteQualiteP: noteQualiteP
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

function ShowModifAreaf(json,b) {
    
    console.log(json)
    const divEtAndModf=document.createElement("div")
    divEtAndModf.setAttribute("class", "fIQYlfMOP row")
    
    const reactionAccueil = json["reactionAccueil"]
    const reactionPrix = json["reactionPrix"]
    const reactionQualiteP = json["reactionQualiteP"]
    const reaction = json["note"]

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
    divReactionContainer.setAttribute("class", "reaction_container row")
    const divReactionContainerA = document.createElement("div")
    divReactionContainerA.setAttribute("class", "reaction_container row")
    const divReactionContainerP = document.createElement("div")
    divReactionContainerP.setAttribute("class", "reaction_container row")
    const divReactionContainerQ = document.createElement("div")
    divReactionContainerQ.setAttribute("class", "reaction_container row")
    
    let reactionNode=""
    let reactionNodeA=""
    let reactionNodeP=""
    let reactionNodeQ=""
   
  
    switch (reaction) {
        case 0: {
            reactionNode=`<div class="inmodified  emoji--angry" data-rank="0">
                            <div class="emoji__face">
                                <div class="emoji__eyebrows"></div>
                                <div class="emoji__eyes"></div>
                                <div class="emoji__mouth"></div>
                            </div>
                        </div>`
            break;
        }
        case 1: {
            reactionNode=` <div class="inmodified  emoji--sad--1 " data-rank="1">
                        <div class="emoji__face">
                            <div class="emoji__eyebrows"></div>
                            <div class="emoji__eyes"></div>
                            <div class="emoji__mouth"></div>
                        </div>
                    </div>`
            break;
        }
        case 2: {
            reactionNode=`<div class="inmodified emoji--sad--3" data-rank="2">
                        <div class="emoji__face">
                            <div class="emoji__eyebrows"></div>
                            <div class="emoji__eyes"></div>
                            <div class="emoji__mouth"></div>
                        </div>
                    </div>`
            break;
        }
        case 3: {
            reactionNode=`<div class="inmodified emoji--yay-2" data-rank="3">
                        <div class="emoji__face">
                            <div class="emoji__eyebrows"></div>
                            <div class="emoji__eyes"></div>
                            <div class="emoji__mouth"></div>
                        </div>
                    </div>`
            break;
        }
        case 4: {
            reactionNode=`<div class="inmodified emoji--yay" data-rank="4">
                        <div class="emoji__face">
                            <div class="emoji__eyebrows"></div>
                            <div class="emoji__mouth"></div>
                        </div>
                    </div>` 
            break;
        }
        /*case 0:{
            reactionNode=`<div class="inmodified emoji--angry">
                <div class="emoji__face">
                    <div class="emoji__eyebrows"></div>
                    <div class="emoji__eyes"></div>
                    <div class="emoji__mouth"></div>
                </div>
            </div>
            `
            break
        }*/
    }

    switch (reactionAccueil) {
        case "sad": {
            reactionNodeA=`<div class="inmodified  emoji--angry" data-rank="0">
                            <div class="emoji__face">
                                <div class="emoji__eyebrows"></div>
                                <div class="emoji__eyes"></div>
                                <div class="emoji__mouth"></div>
                            </div>
                        </div>`
            break;
        }
        case "sad-2": {
            reactionNodeA=` <div class="inmodified  emoji--sad--1 " data-rank="1">
                        <div class="emoji__face">
                            <div class="emoji__eyebrows"></div>
                            <div class="emoji__eyes"></div>
                            <div class="emoji__mouth"></div>
                        </div>
                    </div>`
            break;
        }
            case "sad-3": {
            reactionNodeA=`<div class="inmodified emoji--sad--3" data-rank="2">
                        <div class="emoji__face">
                            <div class="emoji__eyebrows"></div>
                            <div class="emoji__eyes"></div>
                            <div class="emoji__mouth"></div>
                        </div>
                    </div>`
            break;
        }
            case "happy": {
            reactionNodeA=`<div class="inmodified emoji--yay-2" data-rank="3">
                        <div class="emoji__face">
                            <div class="emoji__eyebrows"></div>
                            <div class="emoji__eyes"></div>
                            <div class="emoji__mouth"></div>
                        </div>
                    </div>`
            break;
        }
            case "veryhappy": {
            reactionNodeA=`<div class="inmodified emoji--yay" data-rank="4">
                        <div class="emoji__face">
                            <div class="emoji__eyebrows"></div>
                            <div class="emoji__mouth"></div>
                        </div>
                    </div>` 
            break;
        }
        case "":{
            reactionNodeA=`<div class="inmodified emoji--angry">
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
    
    switch (reactionPrix) {
        case "sad": {
            reactionNodeP=`<div class="inmodified  emoji--angry" data-rank="0">
                            <div class="emoji__face">
                                <div class="emoji__eyebrows"></div>
                                <div class="emoji__eyes"></div>
                                <div class="emoji__mouth"></div>
                            </div>
                        </div>`
            break;
        }
        case "sad-2": {
            reactionNodeP=` <div class="inmodified  emoji--sad--1 " data-rank="1">
                        <div class="emoji__face">
                            <div class="emoji__eyebrows"></div>
                            <div class="emoji__eyes"></div>
                            <div class="emoji__mouth"></div>
                        </div>
                    </div>`
            break;
        }
            case "sad-3": {
            reactionNodeP=`<div class="inmodified emoji--sad--3" data-rank="2">
                        <div class="emoji__face">
                            <div class="emoji__eyebrows"></div>
                            <div class="emoji__eyes"></div>
                            <div class="emoji__mouth"></div>
                        </div>
                    </div>`
            break;
        }
            case "happy": {
            reactionNodeP=`<div class="inmodified emoji--yay-2" data-rank="3">
                        <div class="emoji__face">
                            <div class="emoji__eyebrows"></div>
                            <div class="emoji__eyes"></div>
                            <div class="emoji__mouth"></div>
                        </div>
                    </div>`
            break;
        }
            case "veryhappy": {
            reactionNodeP=`<div class="inmodified emoji--yay" data-rank="4">
                        <div class="emoji__face">
                            <div class="emoji__eyebrows"></div>
                            <div class="emoji__mouth"></div>
                        </div>
                    </div>` 
            break;
        }
        case "":{
            reactionNodeP=`<div class="inmodified emoji--angry">
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
    
    switch (reactionQualiteP) {
        case "sad": {
            reactionNodeQ=`<div class="inmodified  emoji--angry" data-rank="0">
                            <div class="emoji__face">
                                <div class="emoji__eyebrows"></div>
                                <div class="emoji__eyes"></div>
                                <div class="emoji__mouth"></div>
                            </div>
                        </div>`
            break;
        }
        case "sad-2": {
            reactionNodeQ=` <div class="inmodified  emoji--sad--1 " data-rank="1">
                        <div class="emoji__face">
                            <div class="emoji__eyebrows"></div>
                            <div class="emoji__eyes"></div>
                            <div class="emoji__mouth"></div>
                        </div>
                    </div>`
            break;
        }
            case "sad-3": {
            reactionNodeQ=`<div class="inmodified emoji--sad--3" data-rank="2">
                        <div class="emoji__face">
                            <div class="emoji__eyebrows"></div>
                            <div class="emoji__eyes"></div>
                            <div class="emoji__mouth"></div>
                        </div>
                    </div>`
            break;
        }
            case "happy": {
            reactionNodeQ=`<div class="inmodified emoji--yay-2" data-rank="3">
                        <div class="emoji__face">
                            <div class="emoji__eyebrows"></div>
                            <div class="emoji__eyes"></div>
                            <div class="emoji__mouth"></div>
                        </div>
                    </div>`
            break;
        }
            case "veryhappy": {
            reactionNodeQ=`<div class="inmodified emoji--yay" data-rank="4">
                        <div class="emoji__face">
                            <div class="emoji__eyebrows"></div>
                            <div class="emoji__mouth"></div>
                        </div>
                    </div>` 
            break;
        }
        case "":{
            reactionNodeQ=`<div class="inmodified emoji--angry">
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
    divReactionContainerA.innerHTML += reactionNodeA
    divReactionContainerP.innerHTML += reactionNodeP
    divReactionContainerQ.innerHTML += reactionNodeQ
   
    divEtAndModf.appendChild(divReactionContainer)
    const divNoteAPQ = document.createElement('div')
    divNoteAPQ.setAttribute("class", "note-A-P-Q")
    divNoteAPQ.style =`
        height: 0px;
        transition: height 2s;
        transform: translateY(-2em);
        z-index: -1;`
    divEtAndModf.appendChild(divNoteAPQ)
    divNoteAPQ.appendChild(divReactionContainerA)
    divNoteAPQ.appendChild(divReactionContainerP)
    divNoteAPQ.appendChild(divReactionContainerQ)
    
   
    
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
            <li><a class="dropdown-item text-danger" href="#" id="Delete-Avis-Ferme-tom-js" onclick="__delComf()">Supprimer</a></li>
            <li><a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#exampleModalToggle" onclick="__magicKidJef()">Modifier</a></li>`
    
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
    divReactionContainer.appendChild(pNote)
    pNote.setAttribute("class", "reaction_note col-md-9")
    pNote.textContent = "vous avez attribué(e) la note de : " + json["note"]
    
    const iplus = document.createElement('i')
    divReactionContainer.appendChild(iplus)
    divReactionContainer.setAttribute("onclick", "__onclickPlus(event)")
    iplus.setAttribute("class", "fa-solid fa-plus plus-note col")
   
    const pNoteAccueil = document.createElement('p')
    divReactionContainerA.appendChild(pNoteAccueil)
    pNoteAccueil.setAttribute("class", "reaction_note col")
    pNoteAccueil.textContent = "vous avez attribué(e) la note d'accueil de : " + json["noteAccueil"]
   
    const pNotePrix = document.createElement('p')
    divReactionContainerP.appendChild(pNotePrix)
    pNotePrix.setAttribute("class", "reaction_note col")
    pNotePrix.textContent = "vous avez attribué(e) la note du prix de : " + json["notePrix"]
   
    const pNoteQualiteP = document.createElement('p')
    divReactionContainerQ.appendChild(pNoteQualiteP)
    pNoteQualiteP.setAttribute("class", "reaction_note col")
    pNoteQualiteP.textContent = "vous avez attribué(e) la note du prix de : " + json["noteQualiteP"]

}



function __onclickPlus(event) {
    if ( event.target.className.includes("active-y")) {
        event.target.classList.toggle("active-y")
        document.querySelector("div.note-A-P-Q").style =`
            height: 0px;
           
            transform: translateY(-2em);
            z-index: -1;`
    } else {
        event.target.classList.toggle("active-y")
        document.querySelector("div.note-A-P-Q").style =` 
        transform: translateY(0%);
        z-index: 1;`
    }
}

function __callbackChecked(emoji) {
    if (emoji.className.includes("checked")) {
        emoji.style="transform:scale(0.5)"
    } else {
        //emoji.style="transform:scale(0.2)"
        emoji.removeAttribute("style")
    }
    
}

function __onclickEmojiF(elements) {
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

function __magicKidJef(){
        fetch(`/getAvisFerme/${idFerme}`).then(r => {
        r.json().then(rFinals => {
                console.log(rFinals)
                for(let rFinal of rFinals){
                    let b=currentUserId == rFinal["user"]["id"]
                    if(b){
                        document.querySelector("#givs-avis-ferme-tom-js").style.display = "none"
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
function __delComf() {
   
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
            //document.querySelector("#exampleModalToggle > div > div > div.modal-header > button").click()
            document.querySelector("#givs-avis-ferme-tom-js").style.display = "block"
            
        }
    }).catch((e) => {
        console.log(e)
    })

}

function ShowAvisF(json,currentUserId) {
    
     console.log(json)
    const divEtAndModf=document.createElement("div")
    divEtAndModf.setAttribute("class", "fIQYlfMOP row")
    
    const reactionAccueil = json["reactionAccueil"]
    const reactionPrix = json["reactionPrix"]
    const reactionQualiteP = json["reactionQualiteP"]
    const reaction = json["note"]
    
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
    divReactionContainer.setAttribute("class", "reaction_container row")
    const divReactionContainerA = document.createElement("div")
    divReactionContainerA.setAttribute("class", "reaction_container row")
    const divReactionContainerP = document.createElement("div")
    divReactionContainerP.setAttribute("class", "reaction_container row")
    const divReactionContainerQ = document.createElement("div")
    divReactionContainerQ.setAttribute("class", "reaction_container row")
    
    let reactionNode=""
    let reactionNodeA=""
    let reactionNodeP=""
    let reactionNodeQ=""
    
   
    
    switch (reaction) {
        case 0: {
            reactionNode=`<div class="inmodified  emoji--angry" data-rank="0">
                            <div class="emoji__face">
                                <div class="emoji__eyebrows"></div>
                                <div class="emoji__eyes"></div>
                                <div class="emoji__mouth"></div>
                            </div>
                        </div>`
            break;
        }
        case 1: {
            reactionNode=` <div class="inmodified  emoji--sad--1 " data-rank="1">
                        <div class="emoji__face">
                            <div class="emoji__eyebrows"></div>
                            <div class="emoji__eyes"></div>
                            <div class="emoji__mouth"></div>
                        </div>
                    </div>`
            break;
        }
        case 2: {
            reactionNode=`<div class="inmodified emoji--sad--3" data-rank="2">
                        <div class="emoji__face">
                            <div class="emoji__eyebrows"></div>
                            <div class="emoji__eyes"></div>
                            <div class="emoji__mouth"></div>
                        </div>
                    </div>`
            break;
        }
        case 3: {
            reactionNode=`<div class="inmodified emoji--yay-2" data-rank="3">
                        <div class="emoji__face">
                            <div class="emoji__eyebrows"></div>
                            <div class="emoji__eyes"></div>
                            <div class="emoji__mouth"></div>
                        </div>
                    </div>`
            break;
        }
        case 4: {
            reactionNode=`<div class="inmodified emoji--yay" data-rank="4">
                        <div class="emoji__face">
                            <div class="emoji__eyebrows"></div>
                            <div class="emoji__mouth"></div>
                        </div>
                    </div>` 
            break;
        }
        /*case 0:{
            reactionNode=`<div class="inmodified emoji--angry">
                <div class="emoji__face">
                    <div class="emoji__eyebrows"></div>
                    <div class="emoji__eyes"></div>
                    <div class="emoji__mouth"></div>
                </div>
            </div>
            `
            break
        }*/
    }
    switch (reactionAccueil) {
        case "sad": {
            reactionNodeA=`<div class="inmodified  emoji--angry" data-rank="0">
                            <div class="emoji__face">
                                <div class="emoji__eyebrows"></div>
                                <div class="emoji__eyes"></div>
                                <div class="emoji__mouth"></div>
                            </div>
                        </div>`
            break;
        }
        case "sad-2": {
            reactionNodeA=` <div class="inmodified  emoji--sad--1 " data-rank="1">
                        <div class="emoji__face">
                            <div class="emoji__eyebrows"></div>
                            <div class="emoji__eyes"></div>
                            <div class="emoji__mouth"></div>
                        </div>
                    </div>`
            break;
        }
            case "sad-3": {
            reactionNodeA=`<div class="inmodified emoji--sad--3" data-rank="2">
                        <div class="emoji__face">
                            <div class="emoji__eyebrows"></div>
                            <div class="emoji__eyes"></div>
                            <div class="emoji__mouth"></div>
                        </div>
                    </div>`
            break;
        }
            case "happy": {
            reactionNodeA=`<div class="inmodified emoji--yay-2" data-rank="3">
                        <div class="emoji__face">
                            <div class="emoji__eyebrows"></div>
                            <div class="emoji__eyes"></div>
                            <div class="emoji__mouth"></div>
                        </div>
                    </div>`
            break;
        }
            case "veryhappy": {
            reactionNodeA=`<div class="inmodified emoji--yay" data-rank="4">
                        <div class="emoji__face">
                            <div class="emoji__eyebrows"></div>
                            <div class="emoji__mouth"></div>
                        </div>
                    </div>` 
            break;
        }
        case "":{
            reactionNodeA=`<div class="inmodified emoji--angry">
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
    
    switch (reactionPrix) {
        case "sad": {
            reactionNodeP=`<div class="inmodified  emoji--angry" data-rank="0">
                            <div class="emoji__face">
                                <div class="emoji__eyebrows"></div>
                                <div class="emoji__eyes"></div>
                                <div class="emoji__mouth"></div>
                            </div>
                        </div>`
            break;
        }
        case "sad-2": {
            reactionNodeP=` <div class="inmodified  emoji--sad--1 " data-rank="1">
                        <div class="emoji__face">
                            <div class="emoji__eyebrows"></div>
                            <div class="emoji__eyes"></div>
                            <div class="emoji__mouth"></div>
                        </div>
                    </div>`
            break;
        }
            case "sad-3": {
            reactionNodeP=`<div class="inmodified emoji--sad--3" data-rank="2">
                        <div class="emoji__face">
                            <div class="emoji__eyebrows"></div>
                            <div class="emoji__eyes"></div>
                            <div class="emoji__mouth"></div>
                        </div>
                    </div>`
            break;
        }
            case "happy": {
            reactionNodeP=`<div class="inmodified emoji--yay-2" data-rank="3">
                        <div class="emoji__face">
                            <div class="emoji__eyebrows"></div>
                            <div class="emoji__eyes"></div>
                            <div class="emoji__mouth"></div>
                        </div>
                    </div>`
            break;
        }
            case "veryhappy": {
            reactionNodeP=`<div class="inmodified emoji--yay" data-rank="4">
                        <div class="emoji__face">
                            <div class="emoji__eyebrows"></div>
                            <div class="emoji__mouth"></div>
                        </div>
                    </div>` 
            break;
        }
        case "":{
            reactionNodeP=`<div class="inmodified emoji--angry">
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
    
    switch (reactionQualiteP) {
        case "sad": {
           reactionNodeQ=`<div class="inmodified  emoji--angry" data-rank="0">
                            <div class="emoji__face">
                                <div class="emoji__eyebrows"></div>
                                <div class="emoji__eyes"></div>
                                <div class="emoji__mouth"></div>
                            </div>
                        </div>`
            break;
        }
        case "sad-2": {
           reactionNodeQ=` <div class="inmodified  emoji--sad--1 " data-rank="1">
                        <div class="emoji__face">
                            <div class="emoji__eyebrows"></div>
                            <div class="emoji__eyes"></div>
                            <div class="emoji__mouth"></div>
                        </div>
                    </div>`
            break;
        }
            case "sad-3": {
           reactionNodeQ=`<div class="inmodified emoji--sad--3" data-rank="2">
                        <div class="emoji__face">
                            <div class="emoji__eyebrows"></div>
                            <div class="emoji__eyes"></div>
                            <div class="emoji__mouth"></div>
                        </div>
                    </div>`
            break;
        }
            case "happy": {
           reactionNodeQ=`<div class="inmodified emoji--yay-2" data-rank="3">
                        <div class="emoji__face">
                            <div class="emoji__eyebrows"></div>
                            <div class="emoji__eyes"></div>
                            <div class="emoji__mouth"></div>
                        </div>
                    </div>`
            break;
        }
            case "veryhappy": {
           reactionNodeQ=`<div class="inmodified emoji--yay" data-rank="4">
                        <div class="emoji__face">
                            <div class="emoji__eyebrows"></div>
                            <div class="emoji__mouth"></div>
                        </div>
                    </div>` 
            break;
        }
        case "":{
           reactionNodeQ=`<div class="inmodified emoji--angry">
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
    divReactionContainerA.innerHTML += reactionNodeA
    divReactionContainerP.innerHTML += reactionNodeP
    divReactionContainerQ.innerHTML += reactionNodeQ
   
    divEtAndModf.appendChild(divReactionContainer)
     const divNoteAPQ = document.createElement('div')
    divNoteAPQ.setAttribute("class", "note-avie-A-P-Q")
    divNoteAPQ.style =`
        height: 0px;
        transition: height 2s;
        transform: translateY(-2em);
        z-index: -1;`
    divEtAndModf.appendChild(divNoteAPQ)
    divNoteAPQ.appendChild(divReactionContainerA)
    divNoteAPQ.appendChild(divReactionContainerP)
    divNoteAPQ.appendChild(divReactionContainerQ)
   
    
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
            <li><a class="dropdown-item text-danger" href="#" id="Delete-Avis-tom-js" onclick="__delComf()">Supprimer</a></li>
            <li><a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#exampleModalToggle" onclick="__magicKidJef()">Modifier</a></li>`
    
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
    document.querySelector("#staticBackdrop > div > div > div.list-avis-ferme > div").appendChild(divContentAvis)
    document.querySelector(".nmodified")
    
    const pNote = document.createElement('p')
    divReactionContainer.appendChild(pNote)
    pNote.setAttribute("class", "reaction_note col-md-9")
    pNote.textContent = "vous avez attribué(e) la note de : " + json["note"]
    
    const iplus = document.createElement('i')
    divReactionContainer.appendChild(iplus)
    divReactionContainer.setAttribute("onclick", "__onclickPlusAvie(event)")
    iplus.setAttribute("class", "fa-solid fa-plus plus-note col")
   
    const pNoteAccueil = document.createElement('p')
    divReactionContainerA.appendChild(pNoteAccueil)
    pNoteAccueil.setAttribute("class", "reaction_note col")
    pNoteAccueil.textContent = "vous avez attribué(e) la note d'accueil de : " + json["noteAccueil"]
   
    const pNotePrix = document.createElement('p')
    divReactionContainerP.appendChild(pNotePrix)
    pNotePrix.setAttribute("class", "reaction_note col")
    pNotePrix.textContent = "vous avez attribué(e) la note du prix de : " + json["notePrix"]
   
    const pNoteQualiteP = document.createElement('p')
    divReactionContainerQ.appendChild(pNoteQualiteP)
    pNoteQualiteP.setAttribute("class", "reaction_note col")
    pNoteQualiteP.textContent = "vous avez attribué(e) la note du prix de : " + json["noteQualiteP"]

}


function __onclickPlusAvie(event) {
    if ( event.target.className.includes("active-y")) {
        event.target.classList.toggle("active-y")
        event.target.parentNode.parentNode.querySelector("div.note-avie-A-P-Q").style =`
            height: 0px;
           
            transform: translateY(-2em);
            z-index: -1;`
    } else {
        event.target.classList.toggle("active-y")
        event.target.parentNode.parentNode.querySelector("div.note-avie-A-P-Q").style =` 
        transform: translateY(0%);
        z-index: 1;`
    }
}
