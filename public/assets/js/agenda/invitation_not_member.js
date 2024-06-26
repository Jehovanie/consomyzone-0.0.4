
if (document.querySelector(".content_form_send_invitation_email_js_jheo")) {

    const form_parent = document.querySelector(".content_form_send_invitation_email_js_jheo");
    const input_principal = form_parent.querySelector(".single_destination_js_jheo")
    const input_cc = form_parent.querySelector(".multiple_destination_js_jheo")
    const object = form_parent.querySelector(".object_js_jheo");
    const description = editor.getData()

    /*console.log(input_cc);

    document.querySelectorAll(".invitation_email_js_jheo").forEach((item) => {
        item.addEventListener("click", () => {
            const parentElement = item.parentElement.parentElement;
            document.querySelector("#modal_sendEmail").setAttribute("data-table", parentElement.getAttribute("data-table"))
        })
    })*/




    input_principal.addEventListener("input", () => {
        input_principal.style.border = "1px solid black";
    })

    input_cc.addEventListener("input", () => {
        input_cc.style.border = "1px solid black";
    })

    object.addEventListener("input", () => {
        object.style.border = "1px solid black";
    })



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


        let agenda = JSON.parse(sessionStorage.getItem("agenda"))

        let agendaId = agenda.id

        let status = true;
        
        let data = {"principal": "", "cc": [], "object": "", "description": "", agendaId:agendaId}

        if (input_principal.value === "") {
            input_principal.style.border = "1px solid red";
            status = false;
            swal("Attention!", "Veuillez saisir un adresse email pour le destinataire.", "error")
        }else{
            if (verifieEmailValid(input_principal.value)) {

                data = { ...data, "principal": input_principal.value }

                if (input_cc.value != "") {
                    if(verifieEmailValid(input_cc.value)){
                        cc_destinataire.push(input_cc.value)
                        data = { ...data, "cc": cc_destinataire }

                        ///object
                        if (object.value === "") {
                            object.style.border = "1px solid red";
                            status = false;
                            swal("Attention!", "Veuillez saisir l'objet.", "error")
                        } else {
                            data = { ...data, "object": object.value }
                        }

                    }else {
                        input_cc.style.border = "1px solid red";
                        status = false;
                        swal("Attention!", "Veuillez saisir un adresse email valide pour le cc.", "error")
                    }
                }else{
                    ///object
                    if (object.value === "") {
                        object.style.border = "1px solid red";
                        status = false;
                        swal("Attention!", "Veuillez saisir l'objet.", "error")
                    } else {
                        data = { ...data, "object": object.value }
                    }
                }

            } else {
                input_principal.style.border = "1px solid red";
                status = false;
                swal("Attention!", "Veuillez saisir un adresse email valide pour le destinataire.", "error")
            }
        }

        var tempDiv = document.createElement('div');
        tempDiv.innerHTML = editor.getData();
        tempDiv.querySelector("a").href=`${window.location.origin}/agenda/${agendaId}/confirmation/not/inscrit`
        tempDiv.querySelector("a").disabled=false

        data = { ...data, "description": tempDiv.outerHTML }

        console.log(data)
        console.log(editor.getData())

        if (status) {
            let btnSend = document.querySelector(".btn_send_invitation_js_jheo")
            btnSend.disabled = true
            btnSend.textContent = "Envoie en cours"
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
                return response.json()
            }).then(result => {
                
                /*if (document.querySelector("#successSendingMail")) {

                    document.querySelector("#successSendingMail").style.display = "block";

                    setTimeout(() => {
                        document.querySelector("#successSendingMail").style.display = "none";
                    }, 5000)
                }*/
                swal("Bravo!", "Invitation envoyée avec succès!", "success")
                    .then((value)=>{
                        input_principal.value = null;
                        input_cc.value = null;
                        // editor.setData("");
                        object.value = null;
                        document.querySelectorAll(".chip").forEach(item => {
                            item.parentElement.removeChild(item);
                        })
                        btnSend.disabled = false
                        btnSend.textContent = "Envoyer l'invitation"
                    })

            }).catch((e) => { console.log(e); });

        }
    })


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