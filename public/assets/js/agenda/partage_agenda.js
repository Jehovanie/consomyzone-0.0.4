if(dropZones)
    if( dropZones!=null && dropZones.length > 0){
        document.querySelectorAll(".drop_zone__input_Nantenaina_css_js").forEach((inputElement) => {
            const dropZoneElement = inputElement.closest(".drop_zone_Nantenaina_css_js");
            inputElement.addEventListener("change", (e) => {
                if (e.target.files.length) {
                    console.log(e.target)
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
     
        updateThumbnail(dropZoneElement, file);
        findDefColumn(file);
    }else
        swal("Attention !", "Veuillez choisir un fichier CSV", "error")
        .then((value) => {
            // location.reload();
        });
}

function findDefColumn(file){
    let reader=new FileReader
    reader.onload=()=>{
        console.log(reader.result)
        let csvContent
        try{
            csvContent= b64DecodeUnicode(reader.result.split(",")[1])
            console.log(csvContent)
            let header = csvContent.trim().split('\r\n')[0]
            
            header= header.normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(/[^a-zA-Z;]/g, "").toLowerCase()
            console.log(header)
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
                console.log(param)
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
                swal("Attention !","votre fichier n'est pas encodé en UTF-8", "error")
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
    console.log(data)

    let isG = event.target.dataset.g
    console.log(isG)
    let dataInfos = []

    if(isG ==="1"){
        let allTr = document.querySelectorAll("#list-tribu-g-partage-agenda> tbody >tr")
        
        allTr.forEach(elem => {
            let isChecked = elem.querySelector("input").checked
           
            if(isChecked){
                
                let lastname = elem.querySelector(".lastname").textContent
                let firstname = elem.querySelector(".firstname").textContent
                let email = elem.querySelector(".email").textContent
                dataInfos.push({
                    lastname : lastname,
                    firstname : firstname,
                    email : email
                })
               
            }
        })
    
    }else if(isG ==="0"){
        console.log("ato e")
        let allTr = document.querySelectorAll("#list-partisans-tribu-t-agenda > tr")
        
        allTr.forEach(elem => {
            let isChecked = elem.querySelector("input").checked
            if(isChecked){
                let lastname = elem.querySelector(".lastname").textContent
                let firstname = elem.querySelector(" .firstname").textContent
                let email = elem.querySelector(" .email").textContent
                dataInfos.push({
                    lastname : lastname,
                    firstname : firstname,
                    email : email
                })
            }
        })
    
        console.log(dataInfos)
    }

    let dataEmail={
        emailCore:data,
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

    makeLoadingEmail()

    fetch(request).then(r=>{
    
    if(r.status===200 && r.ok){
        deleteChargement("chargement_content");
        swal("Bravo !","Invitation bien envoyée", "success")
                .then((value) => {
                    $("#emailTemplateModal").modal("hide")
            });
    }else{
        swal("Erreur !","Erreur 500", "error")
                .then((value) => {
                    $("#emailTemplateModal").modal("hide")
            });
    }
})
}