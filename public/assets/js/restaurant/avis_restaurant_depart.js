let currentUserId = 0
window.addEventListener('load', () => {
    // const idRestaurant = document.querySelector("#details-coord").getAttribute("data-toggle-id-resto")
    const idRestaurant = document.querySelector("#details-coord") ? document.querySelector("#details-coord").getAttribute("data-toggle-id-resto") : null
    
    if (document.querySelector(".FtBjOlVf")) {
        currentUserId = parseInt(document.querySelector(".FtBjOlVf").dataset.dem.split(":")[2].split("\.")[1].replace(/[^0-9]/g, ""), 10) 
    }
    // if (document.querySelector(".FtBjOlVf") != null) {
        
    //     showModifArea(idRestaurant,currentUserId)
    // }
        //  console.log(idRestaurant)
    
    if (document.querySelector("#details-coord > div.content_note > div.nombre_avis")) {
        console.log("show Nember of Avis and show note globale")
        showNemberOfAvis(idRestaurant, document.querySelector("#details-coord > div.content_note > div.nombre_avis"))
        showNoteGlobale(idRestaurant)
    }else{
        console.log("opsssssss not show Nember of Avis and show note globale")
    }
    if(document.querySelector(".content_one_cta"))
        currentUserId = parseInt(document.querySelector(".content_one_cta").dataset.dem.split(":")[3].replace(/[^0-9]/g, ""), 10)

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

    /// Send note post
    document.querySelector("#Submit-Avis-resto-tom-js").onclick = () => {

        let newIdResto = document.querySelector("#details-coord").getAttribute("data-toggle-id-resto")
        let newUserId = parseInt(document.querySelector(".content_one_cta").dataset.dem.split(":")[3].replace(/[^0-9]/g, ""), 10)
        let note = document.querySelector("#text-note").value
        note=note.replace(/,/g,".")
        const avis = document.querySelector("#message-text").value
        try {
            mustBeInferior4(note, document.querySelector("#text-note"), true)  
            const requestParam = {
                note: parseFloat(note),
                avis:avis
            }


            document.querySelector(".note_number_jheo_js").value = "";
            document.querySelector(".note_avis_jheo_js").value = "";

            ///// remove alert card and add chargement spinner
            if( document.querySelector(".card_avis_resto_empty_jheo_js")){
                document.querySelector(".card_avis_resto_empty_jheo_js").remove();

                document.querySelector(".all_avis_jheo_js").innerHTML = `
                    <div class="d-flex justify-content-center align-items-center spinner_jheo_js">
                        <div class="spinner-border m-3" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                    </div>
                `
            }

            const request = new Request(`/avis/restaurant/${newIdResto}`, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify(requestParam)
            })
            fetch(request).then(r => {
                if (r.ok && r.status === 200) {
                    showModifArea(newIdResto, newUserId)
                    if (document.querySelector("#see-tom-js")) {
                        showNemberOfAvis(newIdResto, document.querySelector("#see-tom-js"))
                        showNoteGlobale(newIdResto)
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
    

    if (document.querySelector("#UpDate-Avis-tom-js")) {
        document.querySelector("#UpDate-Avis-tom-js").onclick = () => { 
            // alert("Updating")
            let newIdResto = document.querySelector("#details-coord").getAttribute("data-toggle-id-resto")
            let newUserId = parseInt(document.querySelector(".content_one_cta").dataset.dem.split(":")[3].replace(/[^0-9]/g, ""), 10)
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
                    const request = new Request(`/change/restaurant/${newIdResto}`, {
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
                            console.log(newUserId)
                            showModifArea(newIdResto, newUserId)
                            if (document.querySelector("#details-coord > div.content_note > div.nombre_avis")) {
                                showNemberOfAvis(newIdResto, document.querySelector("#details-coord > div.content_note > div.nombre_avis"))
                                showNoteGlobale(newIdResto)
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



    if( document.querySelector(".btn_modal_avis_resto_jheo_js")){
        const modifyAvis = document.querySelector(".btn_modal_avis_resto_jheo_js")
        modifyAvis.addEventListener("click",() => {
            if( modifyAvis.getAttribute("data-status") === "update" ){
                // data-avis-note="${json.note}" data-avis-text="${json.avis}> my_comment_jheo_js
                const note = document.querySelector(".my_comment_jheo_js").getAttribute('data-avis-note')
                const text = document.querySelector(".my_comment_jheo_js").getAttribute('data-avis-text')
                
                document.querySelector(".note_number_jheo_js").value = parseFloat(note);
                document.querySelector(".note_avis_jheo_js").value = text;

                const btn_update = document.querySelector(".send_avis_jheo_js");

                // btn_update.setAttribute("id", "dfdf")
                // btn_update.setAttribute("onclick","_kidMo(event)")

                if( btn_update.classList.contains("btn-warning")){
                    btn_update.classList.remove("btn-warning")
                }

                btn_update.classList.add("btn-secondary")
                btn_update.classList.add("non_active")
            }
        })
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
    }).then(r => r.json())
    .then(response => {
        let globalNote=0.00;
        let totalNote=0.00;
        if( response.length > 0 ){
            for (let avis of response) {
                totalNote+=parseFloat(avis["note"])
            }
            globalNote= totalNote /(response.length);
            createGlobalNote(globalNote)
        }
    })

    // .then(jsons => {
    //     let globalNote=0.00
    //     if (jsons) {
    //         let totalNote=0.00
    //         for (let json of jsons) {
    //             totalNote+=parseFloat(json["note"])
    //         }
    //         console.log(totalNote)
    //         globalNote = totalNote / jsons.length
    //         createGlobalNote(globalNote)
    //     }
    // })
}

function showListAvie() {
    const newIdResto = document.querySelector("#details-coord").getAttribute("data-toggle-id-resto")
    // const d=document.querySelectorAll(".fIQYlf")
    // const d=document.querySelectorAll(".fIQYlfPFT")
    // if(d.length > 0){
    //     d.forEach(i=>{
    //         i.parentNode.removeChild(i)
    //     })
    // }
    // showAvis(currentUserId, newIdResto) 
    const userId = document.querySelector(".content_body_details_jheo_js").getAttribute("data-toggle-user-id")
    showAvis(userId, newIdResto) 
}



function createGlobalNote(globalNote) {
    // let rankRange = [0, 1, 2, 3, 4]
    // let stars = document.querySelectorAll("body > main > div.content_global > div > "+
    //     "div.content_home > div.left_content_home > div > div > div.content_note > div.start > i")
    // let stars = document.querySelectorAll("#details-coord > div.p-4 > div.content_note > div.start > i")
    // for (let star of stars) {
    //     if (rankRange.includes(parseInt(star.dataset.rank, 10))) {
    //         if(parseInt(star.dataset.rank, 10) <= Math.trunc(globalNote))
    //                 star.style.color = "#F5D165"
    //         if (globalNote % 1 != 0) {
    //             //console.log(parseInt(star.dataset.rank, 10)+" "+(Math.trunc(globalNote) + 1))
    //             if (parseInt(star.dataset.rank, 10) == (Math.trunc(globalNote) + 1)) {
    //                   //console.log(parseInt(star.dataset.rank, 10)+" "+(Math.trunc(globalNote) + 1))
    //                 let rateYello = (globalNote % 1) *100
    //                 let rateBlack=100 -rateYello
    //                 star.style = `
    //                  background: linear-gradient(90deg, #F5D165 ${rateYello}%, #000 ${rateBlack}%);
    //                 -webkit-background-clip: text;
    //                 -webkit-text-fill-color: transparent;
    //                 `
    //             }
    //         }
    //     }
    // }

    let startHTML = "";
    let rate= globalNote - Math.trunc(globalNote);
    let rateYellow = rate * 100;
    let rateBlack= 100 - rateYellow;
    for(let i=0; i< 4; i++ ){
        if( i < Math.trunc(globalNote) ){
            startHTML += `<i class="fa-solid fa-star checked" style="color: rgb(245, 209, 101);"></i>`
        }else{
            if( rate != 0 ){
                startHTML += `<i class="fa-solid fa-star" data-rank="1" style ="background: linear-gradient(90deg, #F5D165 ${rateYellow}%, #000 ${rateBlack}%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;" }}"></i>`
                rate = 0;
            }else{
                startHTML += `<i class="fa-solid fa-star" data-rank="1"></i>`
            }
        }
    }

    document.querySelector(".start_jheo_js").innerHTML = startHTML;
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

function showAvis(currentUserId, idRestaurant) {

    if( document.querySelectorAll(".card_avis_resto_jheo_js")){
        document.querySelectorAll(".card_avis_resto_jheo_js").forEach(item => item.remove())

        document.querySelector(".all_avis_jheo_js").innerHTML = `
            <div class="d-flex justify-content-center align-items-center spinner_jheo_js">
                <div class="spinner-border m-3" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
        `
    }

    if( document.querySelector(".btn_modal_avis_resto_jheo_js")){
        const btn_modal_avis_resto = document.querySelector(".btn_modal_avis_resto_jheo_js");
        btn_modal_avis_resto.innerText = "Donné votre avis";

        if(btn_modal_avis_resto.classList.contains("non_active")){
            btn_modal_avis_resto.classList.remove("non_active");
        }
    }


    document.querySelector(".open_modal_avis_resto_jheo_js").click();

    const btn_update = document.querySelector(".send_avis_jheo_js");

    // btn_update.setAttribute("id", "dfdf")
    // btn_update.setAttribute("onclick","_kidMo(event)")

    if( !btn_update.classList.contains("btn-warning")){
        btn_update.classList.add("btn-warning")
    }

    if(btn_update.classList.contains("btn-secondary")){
        btn_update.classList.remove("btn-secondary")
    }

    if(btn_update.classList.contains("non_active")){
        btn_update.classList.remove("non_active")
    }

    fetch(`/avis/restaurant/global/${idRestaurant}`, {
        methode:"GET"
    }).then(r => r.json())
    .then(jsons => {
        document.querySelector(".all_avis_jheo_js").innerHTML = "";
        let ulreadyCommented = false
        jsons.forEach(item => {
            console.log(parseInt(item.user.id))
            console.log(currentUserId)
            if(parseInt(item.user.id) === parseInt(currentUserId)){
                ulreadyCommented= true;
            }
        })
        if( ulreadyCommented ){
            document.querySelector(".btn_modal_avis_resto_jheo_js").innerText = "Modifier votre avis"
            document.querySelector(".btn_modal_avis_resto_jheo_js").setAttribute("data-status", "update");
            document.querySelector(".btn_modal_avis_resto_jheo_js").classList.add("non_active");
            // document.querySelector(".btn_modal_avis_resto_jheo_js").setAttribute("onclick","_kidMo(event)")
        }


        if (jsons.length > 0 ) {
            if( document.querySelector(".card_avis_resto_empty_jheo_js")){
                document.querySelector(".card_avis_resto_empty_jheo_js").remove();
            }

            for (let json of jsons) {
                createShowAvisAreas(json, currentUserId)
            }
        }else{
            document.querySelector(".all_avis_jheo_js").innerHTML= `
                <div class="card mb-2 card_avis_resto_empty_jheo_js">
                    <div class="card-body">
                        <div class="avis_content">
                            <div class="text-danger text-center">
                                Actuellement, il n'y a pas encore d'avis sur cette restaurant
                            </div>
                        </div>
                    </div>
                </div>
            `
        }

    })
}

function showModifArea(idRestaurant, currentUserId) {
    
    fetch(`/avis/restaurant/${idRestaurant}`)
        .then(r => r.json())
        .then(jsons => {
            if (jsons) {
                //// before show all comments, delete the content.
                document.querySelector(".all_avis_jheo_js").innerHTML = "";

                console.log(jsons)
                console.log("currentUserId : " + currentUserId)
                for (let json of jsons) { 
                    const b = (currentUserId == json["user"]["id"])
                    createShowAvisAreas(json,b)
                    // if (b) {
                    //     if (document.querySelector("#givs-avis-resto-tom-js").style.display != "none") {
                    //         document.querySelector("#givs-avis-resto-tom-js").style.display = "none"
                    //         // createModifArea(json,b)
                    //         createShowAvisAreas(json,b)
                    //     } else {
                    //         if (document.querySelector(".fIQYlfPFT")) {
                    //             document.querySelector(".fIQYlfPFT").parentNode.removeChild(document.querySelector(".fIQYlfPFT"))
                    //             // createModifArea(json,b)
                    //             createShowAvisAreas(json,b)
                    //         }
                    //     }
                    //     break;
                    // }else{
                    //     console.log("Oooopssssssssssssssss vous n'êtes pas autorisé !")
                    // } 
                }
                
            }
        })
}

/*
*show comment with btn modification
*/
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

    document.querySelector(".all_avis_jheo_js").appendChild(divContentAvis)
}

/*
*show comment without btn modification
*/
function createShowAvisAreas(json,currentUserId) {

    console.log(json)
    // const divEtAndModf=document.createElement("div")
    // divEtAndModf.setAttribute("class", "fIQYlfMOP row")
    
    // const divContentAvis = document.createElement("div")
    // divContentAvis.setAttribute("class", "fIQYlf card mt-4")
    // const divNom = document.createElement("div")
    // divNom.setAttribute("class", "TSUbDb")
    // const pNom = document.createElement("p")
    // pNom.setAttribute("class" , " text-muted")
    // pNom.textContent = json["user"]["pseudo"]
    // const hr = document.createElement("hr")
    // const divEtoile=document.createElement("div")
    // divEtoile.setAttribute("class", "lioTe  ms-5 col-6")


    // const iStars1 = document.createElement("i")
    // const iStars2 = document.createElement("i")
    // const iStars3 = document.createElement("i")
    // const iStars4 = document.createElement("i")
    // const iStars5 = document.createElement("i")
    // iStars1.setAttribute("class", "fa-solid fa-star")
    // iStars2.setAttribute("class", "fa-solid fa-star")
    // iStars3.setAttribute("class", "fa-solid fa-star")
    // iStars4.setAttribute("class", "fa-solid fa-star")
  

    // const divBtn = document.createElement("button")
    // divBtn.setAttribute("class" , "kidje3 btn btn-outline-primary")
    // divBtn.setAttribute("onclick","_kidMo(event)")
    // divBtn.dataset.bsToggle = "modal"
    // divBtn.setAttribute("href" , "#exampleModalToggle")
    // divBtn.textContent = "Modifier"


    // a=[iStars1, iStars2 , iStars3 ,iStars4];


    // for(let i=0; i<a.length; i++){
    //     if( i < json["note"]){
    //         a[i].classList.add("checked")
    //         a[i].style.color="#F5D165"
    //     }
            
    //     divEtoile.appendChild(a[i])
    // }

    // divEtAndModf.appendChild(divEtoile)

    // if(currentUserId == json["user"]["id"] && currentUserId!=null){
    //     divEtoile.after(divBtn)
    // }
    // const divComment = document.createElement("div")
    // divComment.setAttribute("class", "tnEmMeco text-center")

    // const pComment = document.createElement("p")
    // pComment.textContent = json["avis"]
    
    // divComment.appendChild(pComment)
    
    // divNom.appendChild(pNom)

    
    // divContentAvis.appendChild(divNom)
    // divContentAvis.appendChild(hr)
    // divContentAvis.appendChild(divEtAndModf)
    // divContentAvis.appendChild(divComment)
    // document.querySelector("#staticBackdrop > div > div > div.list-avis-ferme > div").appendChild(divContentAvis)

    let startIcon = "";
    for(let i=0; i<4 ; i++  ){
        if(i<parseInt(json.note)){
            startIcon +=`<i class="fa-solid fa-star checked" style="color: rgb(245, 209, 101);"></i>`
        }else{
            startIcon += ` <i class="fa-solid fa-star"></i>`
        }
    }
    const spec_selector = (currentUserId == json["user"]["id"] && currentUserId!=null) ? "my_comment_jheo_js" : "";
    const singleAvisHtml= `
        <div class="card mb-2 card_avis_resto_jheo_js ${spec_selector} " data-avis-note="${json.note}" data-avis-text="${json.avis}">
            <div class="card-body">
                <div class="avis_content">
                    <div class="d-flex justify-content-between align-items-end">
                        <h3>
                            <small class="fw-bolder text-black"> ${ json["user"]["pseudo"] } : </small> <br>
                            ${json["avis"]}
                        </h3>	
                        <p> ${startIcon}</p>
                    </div>
                </div>
            </div>
        </div>
    `

    document.querySelector(".all_avis_jheo_js").innerHTML += singleAvisHtml;
}

function _kidMo(event) {
    const v=event.target.parentNode.parentNode.querySelector(".tnEmMeco").textContent
    const stars=event.target.parentNode.querySelectorAll(".lioTe >i.checked").length
   
    const targertTextArea=document.querySelector("#message-text-kidje3")

    targertTextArea.value=v

    document.querySelector("#text-note-modif").value=stars
   
}

