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

                break;

            }

            case 0.25: {

                let d=strength*100

                 document.querySelector(".password-niveau > .progress > .progress-bar").style= `

                    width: ${d}%;

                    background-color: #b80000;

                `

                document.querySelector("#text-pasword-niveau").innerText="Mot de passe faible"

                break;

            }

            case 0.75: {

                let d=strength*100

                 document.querySelector(".password-niveau > .progress > .progress-bar").style= `

                    width: ${d}%;

                    background-color: #ffff00;

                `

                document.querySelector("#text-pasword-niveau").innerText="Mot de passe moyen"

                break;

            }

            case 0: {

                let d=strength*100

                 document.querySelector(".password-niveau > .progress > .progress-bar").style= `

                    width: ${d}%;

                   

                `

                document.querySelector("#text-pasword-niveau").innerText=""

                 break;

            }

        }

       

    }

}