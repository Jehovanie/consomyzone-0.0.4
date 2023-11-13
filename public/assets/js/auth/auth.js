if(document.querySelector(".resend_email_js")){

    console.log(document.querySelector("#form_email").value)

    document.querySelector(".resend_email_js").addEventListener("click", () => {

        fetch("/inscription/resend-email", {

            method: "POST",

            headers: {

                'Accept': 'application/json',

                'Content-Type': 'application/json'

            },

            body: JSON.stringify( {

                email: document.querySelector("#form_email").value

            })

        }).then(response => response.json())

        .then(result => {

            console.log(result)

        })

    })

}



/**

 * @author Tommy 😎

 */

if (document.querySelector("#form_password")) {
    document.querySelector("#inscriptionCTA_tom_js").disabled = true;
    document.querySelector("#form_password").onkeyup = e => {

        console.log(e.target.value)

        let strength = 0;

        let rLength = false

        let upper = false

        let special = false

        let numeric = false

        const regexL = /.{8,}/

        //test if password has rigth length

        if (regexL.test(e.target.value)) {

            rLength = true;

            console.log("assez")

        } else {

            rLength=false

            console.log("pas assez")

        }



        //Test if password has less one or more uppercase char

        const regexUpCase=/[A-Z]+/

        

        if (regexUpCase.test(e.target.value)) {

            upper=true

            console.log("misy majuscule")

        } else {

            upper = false

            console.log("tsy misy majuscule")

        }



        //Test if password has less one or more special char

        const regexSpecialChar = /[@\!#\$\^%\&\*\(\)\+=\-\[\]\\\';,~`_£€²§µ\.\/\{\}\|\":<>\? ]+/

        if (regexSpecialChar.test(e.target.value)) {

            special = true

            console.log("misy special")

        } else {

            special = false

            console.log("tsy misy special")

        }



        const regexNum=/[0-9]+/

        

        if (regexNum.test(e.target.value)) {

             numeric = true

            console.log("misy chiffre")

        } else {

             numeric = false

            console.log("tsy misy chiffre")

        }



        if (rLength && upper && special && numeric) {

            strength = 1;

        } else if (rLength && upper && special) {

            strength = 0.75;

        } else if (rLength && upper && numeric) {

            strength = 0.75;

        } else if (special && upper && numeric) {

            strength = 0.75;

        } else if (special && rLength && numeric) {

            strength = 0.75;

        } else if (rLength && upper ) { 

            strength = 0.25;

        } else if (rLength && special ) { 

            strength = 0.25;

        } else if (rLength && numeric ) { 

            strength = 0.25;

        } else if (upper && numeric ) { 

            strength = 0.25;

        } else if (upper && special ) { 

            strength = 0.25;

        } else if (numeric && special ) { 

            strength = 0.25;

        }



        switch (strength) { 

            case 1: {

                let d=strength*100

                document.querySelector(".password-niveau > .progress > .progress-bar").style = `

                    width: ${d}%;

                    background-color: #009248;

                `

                document.querySelector("#text-pasword-niveau").innerText="Mot de passe fort"
                 document.querySelector("#inscriptionCTA_tom_js").disabled=false
                
                break;

            }

            case 0.25: {

                let d=strength*100

                 document.querySelector(".password-niveau > .progress > .progress-bar").style= `

                    width: ${d}%;

                    background-color: #b80000;

                `

                document.querySelector("#text-pasword-niveau").innerText = "Mot de passe faible." +
                    "Donner un mot de passe plus fort pour pouvoir vous inscrire."
                
                 document.querySelector("#inscriptionCTA_tom_js").disabled=true

                break;

            }

            case 0.75: {

                let d=strength*100

                 document.querySelector(".password-niveau > .progress > .progress-bar").style= `

                    width: ${d}%;

                    background-color: #ffff00;

                `

                document.querySelector("#text-pasword-niveau").innerText="Mot de passe moyen"
                 document.querySelector("#inscriptionCTA_tom_js").disabled=false

                break;

            }

            case 0: {

                let d=strength*100

                 document.querySelector(".password-niveau > .progress > .progress-bar").style= `

                    width: ${d}%;

                   

                `

                document.querySelector("#text-pasword-niveau").innerText=""
                 document.querySelector("#inscriptionCTA_tom_js").disabled=true
                 break;

            }

        }

       

    }

}

if (document.querySelector("#form_pseudo")) {
    let timeout = setTimeout(function () { }, 0);
    let timeout2=setTimeout(function(){}, 0);
    document.querySelector("#form_pseudo").addEventListener("input", (e) => { 
        clearTimeout(timeout);
         clearTimeout(timeout2);
        timeout = setTimeout(function () {
            const curentPseudo = e.target.value;
            fetch(`/is/pseudo/${curentPseudo}`, { method: "GET" })
                .then(response => {
                    if (response.status === 200 && response.ok) {
                        response.json().then(json => { 
                            const isPseudoExist=!!parseInt(json.result)
                            console.log(isPseudoExist)
                            if (isPseudoExist) {
                                document.querySelector("#pseudo-verif-response-js-tom").innerText = "ce pseudo existe déjà." 
                                timeout2 = setTimeout(function () {
                                    document.querySelector("#pseudo-verif-response-js-tom").innerText=""
                                }, 5000);
                                document.querySelector("#form_pseudo").style = "border:1px solid red;"
                                document.querySelector("#pseudo-verif-response-js-tom").parentElement.style="display:block; color:red"
                                fetch(`/give/pseudo/${curentPseudo}`, { method: "GET" }).then(response2 => { 
                                    if (response2.status === 200 && response2.ok) { 
                                        response2.json().then(json2 => { 
                                            document.querySelector("#pseudo_choise_js_tom>option").value = json2["@pseudos"];
                                            document.querySelector("#pseudo_choise_js_tom>option").innerText = json2["@pseudos"];
                                            document.querySelector("#pseudo_choise_js_tom").style = "display:block"
                                            document.querySelector("#pseudo_choise_label_js_tom").style = "display:block"
                                            document.querySelector("#pseudo_choise_js_tom").setAttribute("onclick", "setPseudo(event)");
                                        })        
                                    }

                                })
                            } else {
                                document.querySelector("#pseudo-verif-response-js-tom").innerText = "pseudo verifié." 
                                document.querySelector("#pseudo-verif-response-js-tom").parentElement.style="display:block; color:green"
                            }
                        })
                    }
                })
        }, 3000)
    })
}

function setPseudo(event) {
    let selectElement = event.target;
    if (selectElement != null && selectElement instanceof HTMLElement) { 
        let pseudo = selectElement.options[selectElement.selectedIndex].value;
        document.querySelector("#form_pseudo").value=pseudo;
    }
}
   