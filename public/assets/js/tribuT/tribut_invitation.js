// btn_send_invitation_js_jheo-invitation_description_js_jheo-multiple_destination_js_jheo-single_destination_js_jheo
if (document.querySelector(".content_form_send_invitation_email_js_jheo")) {
    const form_parent = document.querySelector(".content_form_send_invitation_email_js_jheo");
    const input_principal = form_parent.querySelector(".single_destination_js_jheo")
    const input_cc = form_parent.querySelector(".multiple_destination_js_jheo")
    const object = form_parent.querySelector(".object_js_jheo");
    const description = form_parent.querySelector(".invitation_description_js_jheo");



    document.querySelectorAll(".invitation_email_js_jheo").forEach((item) => {
        item.addEventListener("click", () => {
            const parentElement = item.parentElement.parentElement;
            document.querySelector("#modal_sendEmail").setAttribute("data-table", parentElement.getAttribute("data-table"))
        })
    })




    input_principal.addEventListener("input", () => {
        input_principal.style.border = "1px solid black";
    })

    input_cc.addEventListener("input", () => {
        input_cc.style.border = "1px solid black";
    })

    object.addEventListener("input", () => {
        object.style.border = "1px solid black";
    })



    input_cc.addEventListener("keyup", (e) => {

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
    })

    form_parent.querySelector(".btn_send_invitation_js_jheo").addEventListener("click", (e) => {
        e.preventDefault();

        ////get cc
        let cc_destinataire = [];
        document.querySelectorAll(".chip span").forEach(item => {
            cc_destinataire.push(item.innerText)
        })

        let data = { "table": document.querySelector("#modal_sendEmail").getAttribute("data-table"), "principal": "", "cc": cc_destinataire, "object": "", "description": "" }

        console.log(data);

        let status = false;

        if (input_principal.value === "") {
            alert("Entre au moin une destination.")
            input_principal.style.border = "1px solid red";
        }



        if (verifieEmailValid(input_principal.value)) {
            data = { ...data, "principal": input_principal.value }
            status = true;
        } else {
            input_principal.style.border = "1px solid red";
        }

        ///object
        if (object.value === "") {
            alert("Veillez entre un Object.")
            object.style.border = "1px solid red";
        } else {
            data = { ...data, "object": object.value }
            status = true;
        }



        if (description.value != "") {
            data = { ...data, "description": description.value }
        }
        console.log("data sending...")
        console.log(data)

        if (status) {
            //////fetch data
            fetch("/user/tribu/email/invitation", {
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
                input_principal.value = null;
                input_cc.value = null;
                description.value = null;
                object.value = null;
                document.querySelectorAll(".chip").forEach(item => {
                    item.parentElement.removeChild(item);
                })

                document.querySelector(".close_modal_js_jheo").click();

                if (document.querySelector("#successMessageBlock")) {

                    document.querySelector("#successMessageBlock").style.display = "block";

                    document.querySelector("#successMessage").innerHTML = "Invitation envoyée";

                    setTimeout(() => {
                        document.querySelector("#successMessageBlock").style.display = "none";
                    }, 5000)
                }


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