///Jehovanie: this variable is use for the list of the piece joint
/// in the send email on the invitation tribu T
let email_piece_joint_list= [];


if (document.querySelector(".content_form_send_invitation_email_js_jheo")) {

    const form_parent = document.querySelector(".content_form_send_invitation_email_js_jheo");
    const input_principal = form_parent.querySelector(".single_destination_js_jheo")
    // const input_cc = form_parent.querySelector(".multiple_destination_js_jheo")
    // const input_cci = form_parent.querySelector(".multiple_destination_cci_js_jheo")
    const object = form_parent.querySelector(".object_js_jheo");
    const description = editor.getData()

    /*console.log(input_cc);

    document.querySelectorAll(".invitation_email_js_jheo").forEach((item) => {
        item.addEventListener("click", () => {
            const parentElement = item.parentElement.parentElement;
            document.querySelector("#modal_sendEmail").setAttribute("data-table", parentElement.getAttribute("data-table"))
        })
    })*/

    let agenda = JSON.parse(sessionStorage.getItem("agenda"))
    object.value = agenda.title+", "+ (document.querySelector(".information_user_conected_jheo_js") ? 
        document.querySelector(".information_user_conected_jheo_js").dataset.userfullname :"")

    input_principal.addEventListener("input", () => {
        input_principal.style.border = "1px solid black";
    })

    // input_cc.addEventListener("input", () => {
    //     input_cc.style.border = "1px solid black";
    // })

    object.addEventListener("input", () => {
        object.style.border = "1px solid black";
    })

    //, input_cc, input_cci
    controlInputEmailToMultiple([ input_principal ])
    
    /*input_cc.addEventListener("keyup", (e) => {

        console.log("Code : " + e.code);

        if (e.code === "KeyM" || e.code === "Enter" || e.code === "NumpadEnter") {
            if (verifieEmailValid(input_cc.value.replace(",", ""))) {
                ////create single email
                // <div  class="chip"><span>toto@gmail.com</span><i class="fa-solid fa-delete-left" onclick="ondeleteUser(this)"></i></div>
                const div = document.createElement("div");
                div.classList.add("chip");
                const span = document.createElement("span");
                span.innerText = input_cc.value.replace(",", "");
                div.appendChild(span);
                div.innerHTML += `<i class="fa-solid fa-delete-left" onclick="ondeleteUser(this)"></i>`
                document.querySelector(".content_chip_js_jheo").appendChild(div);

                input_cc.value = null
            } else {
                input_cc.style.border = "1px solid red";
            }
        }
    })*/

    form_parent.querySelector(".btn_send_invitation_js_jheo").addEventListener("click", (e) => {
        e.preventDefault();

        ////get cc
        let cc_destinataire = [];
        /*document.querySelectorAll(".chip span").forEach(item => {
            cc_destinataire.push(item.innerText)
        })*/

        let agendaId = agenda.id

        let objectTitle = agenda.title+", "+(document.querySelector(".information_user_conected_jheo_js") ? 
        document.querySelector(".information_user_conected_jheo_js").dataset.userfullname :"")

        let status = true;

        // "cc": [],
        // "cci": [],
        let data = {
            "principal": [], 
           
            "object": "", 
            "description": "", 
            agendaId: agendaId
        }

      

        if (input_principal.value === "") {
            input_principal.style.border = "1px solid red";
            status = false;
            swal("Attention!", "Veuillez saisir un adresse email pour le destinataire.", "error")
        }else{

            if( checkIfExistMailInValid(input_principal.value)){
                input_principal.style.border = "1px solid red";
                status = false;
                swal("Attention!", "Veuillez saisir un adresse email valide pour le destinataire.", "error")
            }

            // if (!!input_cc.value && checkIfExistMailInValid(input_cc.value)) {
            //     input_cc.style.border = "1px solid red";
            //     status = false;
            //     swal("Attention!", "Veuillez saisir un adresse email valide pour le cc.", "error")
            // }
    
            // if (!!input_cci.value && checkIfExistMailInValid(input_cci.value)) {
            //     input_cci.style.border = "1px solid red";
            //     status = false;
            //     swal("Attention!", "Veuillez saisir un adresse email valide pour le cci.", "error")

            // }
            // "cc": formatEmailAdresseFromStringLong(input_cc.value),
            // "cci": formatEmailAdresseFromStringLong(input_cci.value),
            data = {
                ...data,
                "principal": formatEmailAdresseFromStringLong(input_principal.value)
              
            }

            if (object.value === "") {
                object.style.border = "1px solid red";
                status = false;
                swal("Attention!", "Veuillez saisir l'objet.", "error")
            } else {
                data = { ...data, "object": objectTitle }
            }
        }

        var tempDiv = document.createElement('div');
        tempDiv.innerHTML = editor.getData();
        tempDiv.querySelector("a").href=`${window.location.origin}/agenda/${agendaId}/confirmation/not/inscrit`
        tempDiv.querySelector("a").disabled=false

        data = { ...data, "description": tempDiv.outerHTML }

        if( email_piece_joint_list.length > 0 ){
            data = { ...data, "piece_joint": email_piece_joint_list }
        }else{
            data = { ...data, "piece_joint": [] }
        }

        if (status) {
            let btnSend = document.querySelector(".btn_send_invitation_js_jheo")
            btnSend.disabled = true
            btnSend.textContent = "Envoie en cours"

            if( email_piece_joint_list.length > 0 ){
                email_piece_joint_list.forEach(item => {
                    const id= item.id;
                    const btn_item = document.querySelector(`.fa_solid_${id}_jheo_js`);
                    if( btn_item.classList.contains("btn-outline-danger")){
                        btn_item.classList.remove("btn-outline-danger")
                    }

                    if( !btn_item.classList.contains("btn-outline-primary")){
                        btn_item.classList.add("btn-outline-primary")
                    }

                    btn_item.innerHTML= `<i class="fas fa-spinner fa-spin"></i>`

                    btn_item.setAttribute("onclick", "");
                });
            }
            
            console.log(data)
            //////fetch data
            fetch("/user/agenda/invitation/not/partisan", {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }).then(response => {
                if (!response.ok && response.status != 200) {
                    throw new Error("ERROR: " + response.status)
                }
                return response.json();
            })
				.then((result) => {
                swal("Bravo!", "Invitation envoyée avec succès!", "success").then((value) => {
						/// RESET DATA AFTER THE SENDING
						// input_principal.value = null;
                        // input_cc.value = null;
                        // email_piece_joint_list = [];
                        // editor.setData("");
                        // object.value = null;

                        // document.querySelectorAll(".chip").forEach((item) => {
                            // 	item.parentElement.removeChild(item);
                        // });
						// if (document.querySelector(".content_list_piece_joint_jheo_js")) {
						// 	document.querySelector(".content_list_piece_joint_jheo_js").innerHTML = "";
        
                            // 	if (!content_list_piece_joint.classList.contains("d-none")) {
						// 		content_list_piece_joint.classList.add("d-none");
						// 	}
						// }
						/// END OF THE RESET DATA.

						btnSend.disabled = false;
						btnSend.textContent = "Envoyer l'invitation";
					});
				})
				.catch((e) => {
					console.log(e);
				});
		}
    });
}

if( document.querySelector(".message_tooltip_piece_joint_jheo_js")){

    ///hover tooltip piece joint, ...
    displayTooltipHelpMsg();

    if( document.querySelector(".content_add_link_jheo_js")){
        document.querySelector(".label_add_link_jheo_js").addEventListener("click", () => {
            document.querySelector(".modal_addlink_invitation_jheo_js").click();
        })
    }
}

function verifieEmailValid(email) {
    if (email.match(/(?:[a-z0-9+!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/gi)) {
        return true;
    }
    return false
}


function ondeleteUser(e) {
    const email = e.parentElement
    email.parentElement.removeChild(email);
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
function addPieceJoint(input) {

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
                createListItemPiece(name, id_unique);
                
                //// save the item in variable global list piece jointe.
                email_piece_joint_list.push({id: id_unique,  name, base64File: e.target.result })
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
function addPieceJointImage(input) {

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
                createListItemPiece(name, id_unique);
                
                //// save the item in variable global list piece jointe.
                email_piece_joint_list.push({id: id_unique,  name, base64File: e.target.result })
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
function createListItemPiece(name, id){
    
    ////content block the list item piece joint.
    const content_list_piece_joint= document.querySelector(".content_list_piece_joint_jheo_js");

    //// display the block when it's hidden.
    if( content_list_piece_joint.classList.contains("d-none")){
        content_list_piece_joint.classList.remove("d-none")
    }

    /// structure html the single element
    const list_item= `
        <li class="list-group-item d-flex justify-content-between align-items-center">
            <p>${name}</p>
            <button type="button" class="btn btn-outline-danger fa_solid_${id}_jheo_js" onclick="removeListeItem(this, '${id}')"><i class="fa-solid fa-trash-can"></i></button>
        </li>
    `
    /// insert the single element.
    content_list_piece_joint.innerHTML += list_item;
}


/**
 * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
 *  
 * This function remove the item on the list piece jointe 
 * and update variable global `email_piece_joint_list` list of the piece joint 
 * 
 * @param {*} e : event html object: item list piece jointe
 * @param {*} id : unique id in to identify the item piece joint in the list `email_piece_joint_list`
 * 
 * @return void
 */
function removeListeItem(e, id){
    ///remove html element
    e.parentElement.remove()
    ///remove one element in the piece global
    email_piece_joint_list= email_piece_joint_list.filter(item => item.id  != id )
}


function addLinkOnMailBody(){
    const link_name= document.querySelector(".link_name_jheo_js").value.trim();
    const link_value= encodeURI(document.querySelector(".link_value_jheo_js").value);

    if( editor ){
        // const old_data= editor.getData();
        // const dom_parse= new DOMParser();
        // const html= dom_parse.parseFromString(old_data,  "text/html");

        // const content_link_jheo= html.body.querySelector(".content_link_jheo_js");
        // content_link_jheo.innerHTML= '<a class="link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover" href="' + link_value + '" >' + link_name + ' </a>'

        // console.log(html.body)

        editor.setData(
            editor.getData() + '<a class="link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover" href="' + link_value + '" >' + link_name + ' </a>'
        )
    }

    cancelAddLink();
}