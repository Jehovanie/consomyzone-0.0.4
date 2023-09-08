if(dropZones)
    if( dropZones!=null && dropZones.length > 0){
        document.querySelectorAll(".drop_zone__input_Nantenaina_css_js").forEach((inputElement) => {
            const dropZoneElement = inputElement.closest(".drop_zone_Nantenaina_css_js");
            inputElement.addEventListener("change", (e) => {
                if (e.target.files.length) {
                    checkFileExtension(dropZoneElement,e.target.files[0])
                }
            });
            dropZoneElement.addEventListener("drop", (e) => {
                e.preventDefault();
            
                if (e.dataTransfer.files.length) {
                //inputElement.files = e.dataTransfer.files;
                //updateThumbnail(dropZoneElement, e.dataTransfer.files[0]);
                checkFileExtension(dropZoneElement,e.dataTransfer.files[0])
                }
            
                dropZoneElement.classList.remove("drop-zone--over");
            });
        })

    }


function makeLoadingEmail(){
    let containerChargement = document.createElement("div")
    containerChargement.classList.add("chargement_content")
    containerChargement.classList.add("content_chargement_email")
    containerChargement.classList.add("mt-3")
    containerChargement.classList.add("mb-3")
    document.querySelector(".container_list").appendChild(containerChargement)

    createChargement(document.querySelector(".content_chargement_email"), c = "chargement_content content_chargement_email")

}

function checkFileExtension(dropZoneElement,file){
   
    if(file.type ==="text/csv"){
        findDefColumn(dropZoneElement, file);
    }else
        swal("Attention !", "Veuillez choisir un fichier CSV", "error")
        .then((value) => {
            // location.reload();
    });
}

function findDefColumn(dropZoneElement, file){
    let reader=new FileReader
    reader.onload=()=>{
        let csvContent
        try{
            csvContent= b64DecodeUnicode(reader.result.split(",")[1])

            let header = csvContent.trim().split('\r\n')[0]
            
            header= header.normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(/[^a-zA-Z;]/g, "").toLowerCase()
            let param={}
            let hasName=false, hasFirstName=false,hasMail=false
            for (const [index, value] of header.split(";").entries()) {

                    switch(value){
                        case "nom":{
                            param.indexName=index
                            hasName=true
                            break;
                        }
                        case "noms":{
                            param.indexName=index
                            hasName=true
                            break;
                        }
                        case "prenom":{
                            param.indexFirstName=index
                            hasFirstName=true
                            break;
                        }
                        case "prenoms":{
                            param.indexFirstName=index
                            hasFirstName=true
                            break;
                        }
                        case "email":{
                            param.indexMail=index
                            hasMail=true
                            break;
                        }
                        case "emails":{
                            param.indexMail=index
                            hasMail=true
                            break;
                        }
                        case "mail":{
                            param.indexMail=index
                            hasMail=true
                            break;
                        }
                        case "mails":{
                            param.indexMail=index
                            hasMail=true
                            break;
                        }
                    }
            }

            if(hasMail && hasFirstName && hasName){
                sessionStorage.setItem("csvContent", csvContent)
                sessionStorage.setItem("headerIndex", JSON.stringify(param))
                updateThumbnail(dropZoneElement, file);
                document.querySelector(".btn_share_csv_file_nanta_js").classList.remove("btn-second-primary")
            }else{
                let errorFisrtName="", errorName="", errorMail=""
                if(!hasFirstName)
                    errorFisrtName="il manque la colonne prénom"
                if(!hasName)
                    errorName="il manque la colonne nom "

                if(!hasMail)
                    errorMail="il manque la colonne email"

                
                let error = errorFisrtName + " " + errorName + " " + errorMail 
                swal("Attention !", error.trim(), "error")
                .then((value) => {
                    // location.reload();
                });
            }
        }catch(exception){
            if(exception instanceof URIError){
                swal("Attention !","Votre fichier n'est pas encodé en UTF-8", "error")
                .then((value) => {
                    // location.reload();
                });
            }else{
                console.log(exception)
            }
        }  
    }
    reader.readAsDataURL(file)
}
function fromBinary(encoded) {
    const binary = atob(encoded);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return String.fromCharCode(...new Uint16Array(bytes.buffer));
  }

  function toBinary(string) {
    const codeUnits = new Uint16Array(string.length);
    for (let i = 0; i < codeUnits.length; i++) {
      codeUnits[i] = string.charCodeAt(i);
    }
    return btoa(String.fromCharCode(...new Uint8Array(codeUnits.buffer)));
  }

  function b64DecodeUnicode(str) {
    // Going backwards: from bytestream, to percent-encoding, to original string.
    return decodeURIComponent(atob(str).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}

function sendInvitation(event){

    let data=editor.getData()
    
    let agenda = JSON.parse(sessionStorage.getItem("agenda"))
    let isG = event.target.dataset.g
    console.log("isG : " + isG);
    let dataInfos = []
    let isValidateEmail = true
    let infos={}
    if(isG){
         infos = getUserInfoForSharing(isG, dataInfos,data)
        isValidateEmail =infos.isvalid

        
    }else{
        let contenu = sessionStorage.getItem("csvContent")
        let headerIndex = JSON.parse(sessionStorage.getItem("headerIndex"))
        for (let i = 0; i < contenu.trim().split('\r\n').length; i++) {

            if(i>0){
                let email = contenu.trim().split('\r\n')[i].split(";")[headerIndex.indexMail]
                if(validateEmail(email)){
                    dataInfos.push({
                        agendaId:agenda.id,
                        from_id:null,
                        to_id:null,
                        lastname : contenu.trim().split('\r\n')[i].split(";")[headerIndex.indexName],
                        firstname : contenu.trim().split('\r\n')[i].split(";")[headerIndex.indexFirstName],
                        email : email
                    })
                }else{
                    swal("Erreur !","Vérifier l'adresse email dans votre fichier !", "error")
                        .then((value) => {
                    });
                    resetFilePartage()
                    isValidateEmail = false
                    break;
                }
            }
            
        }
    }

    let dataEmail={
        emailCore:infos.data,
        receiver:dataInfos
    }

    console.log(JSON.stringify(dataEmail))
    let request =new Request("/agenda/send/invitation",{
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataEmail)
    })

    if(isValidateEmail){
        makeLoadingEmail()
    
        fetch(request).then(r=>{
        
            if(r.status===200 && r.ok){
                deleteChargement("chargement_content");
                swal("Bravo !","Invitation bien envoyée", "success")
                        .then((value) => {
                            if(isG){
                                if(isG ==="1"){
                                    let allTr = document.querySelectorAll("#list-tribu-g-partage-agenda> tbody >tr")
                                    
                                    allTr.forEach(elem => {
                                        let isChecked = elem.querySelector("input").checked
                                    
                                        if(isChecked){
                                            elem.querySelector("input").click()                                 
                                        }
                                    })
    
                                    document.querySelector("#shareAgendaForPartisan").classList.add("btn-second-primary")
                                
                                }else if(isG ==="0"){
                            
                                    let allTr = document.querySelectorAll("#list-partisans-tribu-t-agenda > tr")
                                    
                                    allTr.forEach(elem => {
                                        let isChecked = elem.querySelector("input").checked
                                        if(isChecked){
                                            elem.querySelector("input").click()
                                        }
                                    })
    
                                    document.querySelector("#shareBtnTribuTForPart").classList.add("btn-second-primary")
    
                                }
                            }else{
                                document.querySelector(".drop_zone_Nantenaina_css_js").innerHTML = `<span class="drop_zone__prompt_Nantenaina_css_js">Cliquez sur la bannière 
                                ou glissez le fichier ici directement</span>
                                <input type="file" name="fileAgendaShare" id="fileAgendaShare" class="drop_zone__input_Nantenaina_css_js" accept='text/csv'>`
                                document.querySelector(".btn_share_csv_file_nanta_js").classList.add("btn-second-primary")
                                sessionStorage.removeItem("csvContent");   
                                sessionStorage.removeItem("headerIndex");
                            }
                            $("#emailTemplateModal").modal("hide")
                    });
            }else{
                deleteChargement("chargement_content");
                swal("Erreur !","Erreur 500", "error")
                        .then((value) => {
                            $("#emailTemplateModal").modal("hide")
                    });
            }
        })
    }else{
        $("#emailTemplateModal").modal("hide")
    }

}

function sendEventByMessage(e){

    e.preventDefault()

    makeLoadingEmail()

    let content = "<div class=\"bloc-text-message text-white\">"+editor.getData()+"</div>"

    let isG = e.target.dataset.g

    let dataInfos = []

    getUserInfoForSharing(isG, dataInfos)

    let data = {
        dataInfos: dataInfos,
        message: content,
        files : [], 
    }

    fetch("/user/push/message", {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify(data)
    }).then(response => {

        if (response.status == 200) {
            deleteChargement("chargement_content");
            swal("Bravo !","Invitation bien envoyée", "success")
                    .then((value) => {
                        $("#emailTemplateModal").modal("hide")
                });         
        }else{
            deleteChargement("chargement_content");
            swal("Erreur !","Erreur 500", "error")
                    .then((value) => {
                        $("#emailTemplateModal").modal("hide")
                });
            }
    })

}

function getUserInfoForSharing(isG, dataInfos,data){
    let agenda = JSON.parse(sessionStorage.getItem("agenda"))
    let isValidateEmail = true
    if(isG ==="1"){
        let allTr = document.querySelectorAll("#list-tribu-g-partage-agenda> tbody >tr")
        for (let i = 0; i < allTr.length; i++) {
            let isChecked = allTr[i].querySelector("input").checked
            if(isChecked){
                let to_id = allTr[i].querySelector(".lastname").dataset.id
                let from_id=allTr[i].parentElement.dataset.id
                let lastname = allTr[i].querySelector(".lastname").textContent
                let firstname = allTr[i].querySelector(".firstname").textContent
                let email = allTr[i].querySelector(".email").textContent
                var tempDiv = document.createElement('div');
                tempDiv.innerHTML = data;
                console.log(data)
                tempDiv.querySelector("a").href=`${window.location.origin}/agenda/confirmation/${from_id}/${to_id}/${agenda.id}`
                tempDiv.querySelector("a").disabled=false
                data=tempDiv.outerHTML
                console.log(data)
                if(validateEmail(email)){
                    dataInfos.push({
                        agendaId:agenda.id,
                        from_id:from_id,
                        to_id:to_id,
                        lastname : lastname,
                        firstname : firstname,
                        email : email
                    })
                }else{
                    swal("Erreur !","Il y a un adresse email non valide !", "error")
                        .then((value) => {
                    });
                    isValidateEmail = false
                    break;
                }
            }
        }
        /*allTr.forEach(elem => {
            let isChecked = elem.querySelector("input").checked
           
            if(isChecked){
                let to_id = elem.querySelector(".lastname").dataset.id
                let lastname = elem.querySelector(".lastname").textContent
                let firstname = elem.querySelector(".firstname").textContent
                let email = elem.querySelector(".email").textContent
                if(validateEmail(email)){
                    dataInfos.push({
                        from_id:elem.parentElement.dataset.id,
                        to_id:to_id,
                        lastname : lastname,
                        firstname : firstname,
                        email : email
                    })
                }else{
                    swal("Erreur !","Il y a un adresse email non valide !", "error")
                        .then((value) => {
                    });
                    isValidateEmail = false
                }
               
            }
        })*/
    
    }else if(isG ==="0"){

        let allTr = document.querySelectorAll("#list-partisans-tribu-t-agenda > tr")
        
        for (let i = 0; i < allTr.length; i++) {
            let isChecked = allTr[i].querySelector("input").checked
            if(isChecked){
                let to_id = allTr[i].querySelector(".lastname").dataset.id
                let from_id=allTr[i].parentElement.dataset.id
                let lastname = allTr[i].querySelector(".lastname").textContent
                let firstname = allTr[i].querySelector(".firstname").textContent
                let email = allTr[i].querySelector(".email").textContent
                var tempDiv = document.createElement('div');
                tempDiv.innerHTML = data;
                tempDiv.querySelector("a").href=`${window.location.origin}/agenda/confirmation/${from_id}/${to_id}/${agenda.id}`
                tempDiv.querySelector("a").removeAttribute("disabled")
                data=tempDiv.outerHTML
                console.log(data)
                if(validateEmail(email)){
                    dataInfos.push({
                        agendaId:agenda.id,
                        from_id:from_id,
                        to_id:to_id,
                        lastname : lastname,
                        firstname : firstname,
                        email : email
                    })
                }else{
                    swal("Erreur !","Il y a un adresse email non valide !", "error")
                        .then((value) => {
                    });
                    isValidateEmail = false
                    break;
                }
            }
        }

        /*allTr.forEach(elem => {
            let isChecked = elem.querySelector("input").checked
            if(isChecked){
                let to_id = elem.querySelector(".lastname").dataset.id
                let lastname = elem.querySelector(".lastname").textContent
                let firstname = elem.querySelector(" .firstname").textContent
                let email = elem.querySelector(" .email").textContent
                if(validateEmail(email)){
                    dataInfos.push({
                        from_id:elem.parentElement.dataset.id,
                        to_id:to_id,
                        lastname : lastname,
                        firstname : firstname,
                        email : email
                    })
                }else{
                    swal("Erreur !","Il y a un adresse email non valide !", "error")
                        .then((value) => {
                    });
                    isValidateEmail = false
                }
            }
        })*/
    
    }

    return {
        isvalid:isValidateEmail,
        data:data
    
    };
}

function resetListPartageG(){
    let allTr = document.querySelectorAll("#list-tribu-g-partage-agenda> tbody >tr")
                            
    allTr.forEach(elem => {
        let isChecked = elem.querySelector("input").checked
        
        if(isChecked){
            elem.querySelector("input").click()                                 
        }
    })

    document.querySelector("#shareAgendaForPartisan").classList.add("btn-second-primary")
}

function resetFilePartage(){
    document.querySelector(".drop_zone_Nantenaina_css_js").innerHTML = `<span class="drop_zone__prompt_Nantenaina_css_js">Cliquez sur la bannière 
                        ou glissez le fichier ici directement</span>
                        <input type="file" name="fileAgendaShare" id="fileAgendaShare" class="drop_zone__input_Nantenaina_css_js" accept='text/csv'>`
    document.querySelector(".btn_share_csv_file_nanta_js").classList.add("btn-second-primary")
    sessionStorage.removeItem("csvContent");   
    sessionStorage.removeItem("headerIndex");
}