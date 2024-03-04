///Jehovanie: this variable is use for the list of the piece joint
/// in the send email on the invitation tribu T
let email_piece_joint_list_member= [];

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


/**
 * @author Nantenaina x Faniry 
 * envoyer des invitations à participer a un evenement via email
 * @param {*} event 
 */
function sendInvitation(event){

    //SHOW INVITIATION
    event.target.innerText="En cours d'envoie ..."
    let data=editor.getData()
    
    let mailObject="";
    let agenda = JSON.parse(sessionStorage.getItem("agenda"))
    if(document.querySelector("#object_share_event"))
       mailObject= document.querySelector("#object_share_event").value
    let isG = event.target.dataset.g
    console.log("isG : " + isG);
    let dataInfos = []
    let isValidateEmail = true
    let infos={}
    if(isG){
        infos = getUserInfoForSharing(isG, dataInfos,data,mailObject)
        isValidateEmail =infos.isvalid 
    }else{
        let contenu = sessionStorage.getItem("csvContent")
        let headerIndex = JSON.parse(sessionStorage.getItem("headerIndex"))
        for (let i = 0; i < contenu.trim().split('\r\n').length; i++) {

            if(i>0){
                let email = contenu.trim().split('\r\n')[i].split(";")[headerIndex.indexMail]
                let lastname = contenu.trim().split('\r\n')[i].split(";")[headerIndex.indexName]
                let firstname = contenu.trim().split('\r\n')[i].split(";")[headerIndex.indexFirstName]
                if(validateEmail(email)){
                    dataInfos.push({
                        agendaId:agenda.id,
                        objet:mailObject,
                        from_id:null,
                        to_id:null,
                        lastname : lastname,
                        firstname : firstname,
                        fullname : firstname + " " + lastname,
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
    var templateDiv = document.createElement('div');
        templateDiv.innerHTML = data;
        templateDiv.querySelector("a#mail_link_Natenaina_js_css").href=`${window.location.origin}/agenda/confirmation/${agenda.id}`
        templateDiv.querySelector("a#mail_link_Natenaina_js_css").disabled=false
        infos.data = templateDiv.outerHTML
    }

    let dataEmail={
        emailCore:infos.data,
        receiver:dataInfos,
        files:email_piece_joint_list_member
    }
   
    let request =new Request("/agenda/send/invitation",{
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataEmail)
    })

   
    if(isValidateEmail){
        //makeLoadingEmail()
    
        fetch(request).then(r=>{
            
            if(r.status===200 && r.ok){
                //deleteChargement("chargement_content");
                event.target.innerText="Valider et partager par email"
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
        swal("Erreur !","Il y a un adresse email non valide !", "error")
            .then((value) => {
                $("#emailTemplateModal").modal("hide")
        });
    }

}

function sendEventByMessage(e){

    e.preventDefault()

    //makeLoadingEmail()

    e.target.innerText="En cours d'envoie ..."
    let data = editor.getData();

    
    let isG = e.target.dataset.g
    let isValidateEmail = true
    let dataInfos = []
    let infos={}
    infos = getUserInfoForSharing(isG, dataInfos,data)
    isValidateEmail =infos.isvalid 

    let body = {
        dataInfos: dataInfos,
        message: "<div class=\"bloc-text-message text-white\">"+infos.data+"</div>",
        files : [], 
    }

    fetch("/user/push/message", {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify(body)
    }).then(response => {

        if (response.status == 200) {
            //deleteChargement("chargement_content");
            e.target.innerText="Valider et partager par message"
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

function getUserInfoForSharing(isG, dataInfos,data,mailObject){
    let agenda = JSON.parse(sessionStorage.getItem("agenda"))
    let isValidateEmail = true
    if(isG ==="1"){
        let allTr = document.querySelectorAll("#list-tribu-g-partage-agenda> tbody >tr")
        for (let i = 0; i < allTr.length; i++) {
            let isChecked = allTr[i].querySelector("input").checked
            if(isChecked){
                let to_id = allTr[i].querySelector(".fullname").dataset.id
                let from_id=allTr[i].parentElement.dataset.id
                // let lastname = allTr[i].querySelector(".lastname").textContent
                // let firstname = allTr[i].querySelector(".firstname").textContent
                let lastname = ""
                let firstname = ""
                let fullname = allTr[i].querySelector(".fullname").textContent
                // let email = allTr[i].querySelector(".email").textContent
                let email = allTr[i].querySelector(".email").dataset.email
                var tempDiv = document.createElement('div');
                tempDiv.innerHTML = data;
                tempDiv.querySelector("a#mail_link_Natenaina_js_css").href=`${window.location.origin}/agenda/confirmation/${agenda.id}`
                tempDiv.querySelector("a#mail_link_Natenaina_js_css").disabled=false
                data=tempDiv.outerHTML
                dataInfos.push({
                    agendaId:agenda.id,
                    objet:mailObject,
                    from_id:from_id,
                    to_id:to_id,
                    lastname : lastname,
                    firstname : firstname,
                    fullname : fullname,
                    email : email
                })
                if(validateEmail(email)){
                    isValidateEmail = true
                }else{
                    isValidateEmail = false
                }
            }
        }
    
    }else if(isG ==="0"){

        let allTr = document.querySelectorAll("#list-partisans-tribu-t-agenda > tr")
        
        for (let i = 0; i < allTr.length; i++) {
            let isChecked = allTr[i].querySelector("input").checked
            if(isChecked){
                let to_id = allTr[i].querySelector(".fullname").dataset.id
                let from_id=allTr[i].parentElement.dataset.id
                // let lastname = allTr[i].querySelector(".lastname").textContent
                // let firstname = allTr[i].querySelector(".firstname").textContent
                // let email = allTr[i].querySelector(".email").textContent
                let lastname = ""
                let firstname = ""
                let fullname = allTr[i].querySelector(".fullname").textContent
                let email = allTr[i].querySelector(".email").dataset.email
                var tempDiv = document.createElement('div');
                tempDiv.innerHTML = data;
                tempDiv.querySelector("a#mail_link_Natenaina_js_css").href=`${window.location.origin}/agenda/confirmation/${agenda.id}`
                tempDiv.querySelector("a#mail_link_Natenaina_js_css").removeAttribute("disabled")
                data=tempDiv.outerHTML
                dataInfos.push({
                    agendaId:agenda.id,
                    objet:mailObject,
                    from_id:from_id,
                    to_id:to_id,
                    lastname : lastname,
                    firstname : firstname,
                    fullname : fullname,
                    email : email
                })
                if(validateEmail(email)){
                    isValidateEmail = true
                }else{
                    isValidateEmail = false
                }
            }
        }
    
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

/**
 * @Author Nantenaina
 * où: on Utilise cette fonction dans la rubrique historiques des invitations agenda cmz, 
 * localisation du fichier: dans partage_agenda.js,
 * je veux: voir les historiques des invitations
*/
function invitationStoryAgenda(){

    document.querySelector("#invitation-story").innerHTML = `<div class="d-flex justify-content-center">
                                            <div class="spinner-border" role="status">
                                                <span class="visually-hidden">Loading...</span>
                                            </div>
                                        </div>`
    
    fetch("/user/invitation/story/agenda")
        .then(response => response.json())
        .then(datas => {
            console.log(datas)
            let tr = ""
            let jj=0
            const data = datas.filter((word) => word.userType!=null);

            if(data.length > 0){
                for (const story of data) {
                    const statusPartisan=story?.userType?.toLowerCase()  !="type" ?  `<td><span style="background-color:green; border-radius:5px; color:white; padding:5px">Inscrit</span></td>` : `<td><span style="background-color:orange; border-radius:5px; color:white; padding:5px">Non Inscrit</span></td>`;
                    const statusInvitationEventValuer=parseInt(story?.accepted) 
                    let statusInvitationEvent= ""
                    switch(statusInvitationEventValuer){

                        case 0:{
                            statusInvitationEvent="<td><span style=\"background-color:orange; border-radius:5px; color:white; padding:5px\">Refusé.</span></td>";
                            break; 
                        }
                        case 1:{
                            statusInvitationEvent="<td><span style=\"background-color:green; border-radius:5px; color:white; padding:5px\">Accepté.</span></td>";
                            break;
                        }
                        default:{
                            statusInvitationEvent="<td><span style=\"background-color:gray; border-radius:5px; color:white; padding:5px\">En attente.</span></td>";
                           
                        }
                    }
                    if(story?.storyEmail){
                        tr += `<tr class="">
                            <td>${story?.storyEmail}</td>
                            ${statusPartisan}
                            ${statusInvitationEvent}
                            <td>${story?.storyDateTime}</td>
                        </tr>`
                        jj++
                    }else{
                        tr += `
                            <td>aucun info</td>
                            <td>aucun info</td>
                            <td>aucun info</td>
                            <td>aucun info</td>
                        `
                    }
                    
                }
            }else{
                tr += `<tr class="text-center">
                            <td colspan="4">Aucune invitation par email envoyée</td>
                        </tr>`
            }
            let table = `<table id="story-partage-agenda" class="table table-striped">
                    <thead>
                        <tr>
                            <th scope="col">Email</th>
                            <th scope="col">Statut du Fan</th>
                            <th scope="col">Statut de l'invitation</th>
                            <th scope="col">Date d'invitation.</th>
                        </tr>
                    </thead>
                    <tbody >
                        ${tr}
                    </tbody>   
                </table>`

            document.querySelector("#invitation-story").innerHTML = table
            if(data.length > 0 && jj > 0)
                $('#story-partage-agenda').DataTable({
                    language: {
                        url: 'https://cdn.datatables.net/plug-ins/1.13.4/i18n/fr-FR.json'
                    },})
        })
}


/**
 * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
 * 
 * This function is use listen the input file event onchange
 * on the input piece joint in mail invitation 
 * 
 * All add input image
 * @parm inputImage.html.twig
 */
function addPieceJointMember(input) {

    if (input.files && input.files[0]){

        /// list all extensions not accepted by email :Les types de fichiers bloqués par Gmail sont les suivants : 
        /// https://support.google.com/mail/answer/6590?hl=fr#zippy=%2Cmessages-avec-pi%C3%A8ces-jointes
        const listNotAccepted = ["zip", "css", "html", "sql", "xml", "gz", "bz2", "tgz",'ade', 'adp', 'apk', 'appx', 'appxbundle', 'bat', 'cab', 'chm', 'cmd', 'com', 'cpl', 'diagcab', 'diagcfg', 'diagpack', 'dll', 'dmg', 'ex', 'ex_', 'exe', 'hta', 'img', 'ins', 'iso', 'isp', 'jar', 'jnlp', 'js', 'jse', 'lib', 'lnk', 'mde', 'msc', 'msi', 'msix', 'msixbundle', 'msp', 'mst', 'nsh', 'pif', 'ps1', 'scr', 'sct', 'shb', 'sys', 'vb', 'vbe', 'vbs', 'vhd', 'vxd', 'wsc', 'wsf', 'wsh', 'xll'];
        
        /// input value to get the original name of the file ( with the fake path )
        const value= input.value;

        //// to get the extension file
        const  temp= value.split(".");
        const extensions = temp[temp.length-1]; /// extension

        ///if the current extension is in the list not accepted.
        if( !listNotAccepted.some( item => item.toLowerCase() === extensions.toLowerCase() ) && extensions !== value ){

            var reader = new FileReader();
            reader.onload = function (e) {

                /// get name the originila name of the file
                const input_value= value.split("\\")
                const name= input_value[input_value.length-1]; /// original name
    
                ///unique  to identify the file item
                /// this not save in the database.
                const id_unique= new Date().getTime();

                ////create item piece joint.
                createListItemPieceMember(name, id_unique);
                
                //// save the item in variable global list piece jointe.
                email_piece_joint_list_member.push({id: id_unique,  name, base64File: e.target.result })
            };
    
            reader.readAsDataURL(input.files[0]);
        }else{ /// if the extension is not supported.
            swal({
                title: "Le format de fichier n'est pas pris en charge!",
                icon: "error",
                button: "OK",
            });
        }
    }
}

/**
 * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
 * 
 * This function is use listen the input file event onchange
 * on the input piece joint in mail invitation 
 * 
 * All add input image
 * Object element
 */
function addPieceJointImageMember(input) {

    if (input.files && input.files[0]){

        /// list all extensions not accepted by email :Les types de fichiers bloqués par Gmail sont les suivants : 
        /// https://support.google.com/mail/answer/6590?hl=fr#zippy=%2Cmessages-avec-pi%C3%A8ces-jointes
        const listNotAccepted = ["zip", "css", "html", "sql", "xml", "gz", "bz2", "tgz",'ade', 'adp', 'apk', 'appx', 'appxbundle', 'bat', 'cab', 'chm', 'cmd', 'com', 'cpl', 'diagcab', 'diagcfg', 'diagpack', 'dll', 'dmg', 'ex', 'ex_', 'exe', 'hta', 'img', 'ins', 'iso', 'isp', 'jar', 'jnlp', 'js', 'jse', 'lib', 'lnk', 'mde', 'msc', 'msi', 'msix', 'msixbundle', 'msp', 'mst', 'nsh', 'pif', 'ps1', 'scr', 'sct', 'shb', 'sys', 'vb', 'vbe', 'vbs', 'vhd', 'vxd', 'wsc', 'wsf', 'wsh', 'xll'];
        const listAccepted= [ "png", "gif", "jpeg", "jpg" ];
        
        /// input value to get the original name of the file ( with the fake path )
        const value= input.value;

        //// to get the extension file
        const  temp= value.split(".");
        const extensions = temp[temp.length-1]; /// extension

        ///if the current extension is in the list not accepted.
        if( 
            listAccepted.some(item => item === extensions ) 
            && !listNotAccepted.some( item => item.toLowerCase() === extensions.toLowerCase() ) 
            && extensions !== value 
        ){

            var reader = new FileReader();
            reader.onload = function (e) {

                /// get name the originila name of the file
                const input_value= value.split("\\")
                const name= input_value[input_value.length-1]; /// original name
    
                ///unique  to identify the file item
                /// this not save in the database.
                const id_unique= new Date().getTime();

                ////create item piece joint.
                createListItemPieceMember(name, id_unique);
                
                //// save the item in variable global list piece jointe.
                email_piece_joint_list_member.push({id: id_unique,  name, base64File: e.target.result })
            };
    
            reader.readAsDataURL(input.files[0]);
        }else{ /// if the extension is not supported.
            swal({
                title: "Le format de fichier n'est pas pris en charge!",
                icon: "error",
                button: "OK",
            });
        }
    }
}

/**
 * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
 * 
 * This function create single elemment html like to piece joint
 * on the send email invitation on the tribu T
 * 
 * @param {*} name : file name
 * @param {*} id : unique id to identifie the element in the object.
 * 
 * @return void
 */
function createListItemPieceMember(name, id){
    
    ////content block the list item piece joint.
    const content_list_piece_joint= document.querySelector(".content_list_piece_joint_jheo_member_js");

    //// display the block when it's hidden.
    if( content_list_piece_joint.classList.contains("d-none")){
        content_list_piece_joint.classList.remove("d-none")
    }

    /// structure html the single element
    const list_item= `
        <li class="list-group-item d-flex justify-content-between align-items-center">
            <p>${name}</p>
            <button type="button" class="btn btn-outline-danger fa_solid_${id}_jheo_js" onclick="removeListeItemMember(this, '${id}')"><i class="fa-solid fa-trash-can"></i></button>
        </li>
    `
    /// insert the single element.
    content_list_piece_joint.innerHTML += list_item;
}

/**
 * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
 *  
 * This function remove the item on the list piece jointe 
 * and update variable global `email_piece_joint_list_member` list of the piece joint 
 * 
 * @param {*} e : event html object: item list piece jointe
 * @param {*} id : unique id in to identify the item piece joint in the list `email_piece_joint_list_member`
 * 
 * @return void
 */
function removeListeItemMember(e, id){
    ///remove html element
    e.parentElement.remove()
    ///remove one element in the piece global
    email_piece_joint_list_member= email_piece_joint_list_member.filter(item => item.id  != id )
}