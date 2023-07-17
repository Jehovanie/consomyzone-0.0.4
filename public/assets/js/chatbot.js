function openChat() {
    document.querySelector("#chat_container").style="width:28vw;height:92vh; position: fixed;bottom: 0; right: 0; z-index:1003;"
    document.querySelector("#openChat").style="background-color: rgb(48 86 211 / var(--tw-bg-opacity));width:42px;height:42px;color:white;border-radius:10px;display: none;"
}

function closeChat() {
    document.querySelector("#chat_container").style="width:75px;height:75px; position: fixed;bottom: 0; right: 0; z-index:1003;background-color:transparent;"
    document.querySelector("#openChat").style="background-color: rgb(48 86 211 / var(--tw-bg-opacity));width:42px;height:42px;color:white;border-radius:8px;"
}

function runSpinner(){

    if(document.querySelector(".dot-spinner")){
        document.querySelector(".dot-spinner").remove();
    }

    document.querySelector("#conversation").innerHTML +=`
        <div class="dot-spinner">
            <span></span>
            <span></span>
            <span></span>
        </div>`
    
}

function salutation() {

    let date_now = new Date().toLocaleTimeString()

    document.querySelector("#conversation").innerHTML = `
    <div class="qf">
        <div class="qb vh hi vj yr el yl">
            <p>
            👋 Bonjour! Je suis CMZ Chatbot. Je peux repondre à vos question.
            </p>
        </div>
        <p class="nn">${date_now}</p>
    </div>
`
}

function gererateSuggestion(dico) {
    
}

function runSuggestion() {

    let date_now = new Date().toLocaleTimeString()

    document.querySelector("#conversation").innerHTML += `
        <div class="qf">
            <div class="qb vh hi vj yr el yl">
                <p>Que veux-tu savoir aujourd'hui ?</p>
                <div class="text-center">
                    <button class="ad lc mg pg th ni bj wr nj yr oq qq _q ks w-100 mb-1" cle="def_cmz" onclick="findResponse(this)">
                        A propos de ConsoMyZone ?
                    </button>

                    <button class="ad lc mg pg th ni bj wr nj yr oq qq _q ks w-100 mb-1" cle="serv_cmz" onclick="findResponse(this)">
                        Service de ConsoMyZone ?
                    </button>

                    <button class="ad lc mg pg th ni bj wr nj yr oq qq _q ks w-100 mb-1" cle="use_cmz" onclick="findResponse(this)">
                        Utilisation de ConsoMyZone ?
                    </button>
                </div>
            </div>
            <p class="nn">${date_now}</p>
        </div>
    `
}

function writeRequest(request) {
    
    let date_now = new Date().toLocaleTimeString()

    let req = request.textContent

    let res = `<div class="qf rb">
            <div class="qb vh ii oj el yl">
            <p class="eo">${req}</p>
            </div>
            <p class="in nn">${date_now}</p>
        </div>`

    document.querySelector("#conversation").innerHTML += res

}

function findInDict(cle) {
    
}

function getResponse(cle, dico) {
    
    let date_now = new Date().toLocaleTimeString()

    let kk = ""
    Object.entries(dico).forEach(([key, value]) => {
        if(cle==key){
            //console.log(value);
            if(typeof value === 'object'){
                kk += `<div class="qf">
                        <div class="qb vh hi vj yr el yl">
                            <p>Que veux-tu savoir aujourd'hui ?</p>
                            <div class="text-center">`
                Object.entries(value).forEach(([key2, value2]) => {

                    kk+= `<button class="ad lc mg pg th ni bj wr nj yr oq qq _q ks w-100 mb-1" cle="${key2}" onclick="findResponse(this)">
                        A propos de ${key2}
                    </button>`

                    getResponse(key2, value2)
                    
                 });

                 kk += `</div>
                            </div>
                            <p class="nn">${date_now}</p>
                        </div>`
            }else{
                kk = value
            }
            
        }
     });

    let result = `<div class="qf">
                    <div class="qb vh hi vj yr el yl">
                    <p>${kk}</p>
                    </div>
                    <p class="nn">1:55pm</p>
                </div>`

    return result;
}

function findResponse(elem) {

    writeRequest(elem)

    runSpinner()

    let cle = elem.getAttribute("cle")

    let result = getResponse(cle, dico)

    setTimeout(function(){

        if(document.querySelector(".dot-spinner")){
            document.querySelector(".dot-spinner").remove();
        }

        document.querySelector("#conversation").innerHTML += result

    }, 2000)
    
    
}

/***********************Action*************** */


let dico = {
    def_cmz : {
        definition : "ConsoMyZone est une application de consommation de service de votre proximité",
        objectif : "L'objectif de CMZ est de fournir facilement des données aux consommateurs",
        vision : "Aider les consommateurs à créer et entretenir le lien avec les professionnels, où qu'ils se trouvent "
    },
    serv_cmz :{
        tribu : "ConsoMyZone propose de créer votre propre groupe pour attribuer les consommateurs (clients)",
        message : "ConsoMyZone propose d'envoyer et de discuter avec un client ou consommateur par un message privé",
        api : "ConsoMyZone a sa propre API pour collecter leur données afin d'utiliser dans votre propre application"
    },
    use_cmz : {
        resto : "On a plus de 75000 restaurants integrés dans ConsoMyZone, CMZ vous suggère le restaurant le plus proche",
        ferme : "On a plus de 6000 fermes qui peut être visiter et afficher",
        station : "La liste de station service est presque complet dans ConsoMyZone, qui facilite le consommateur au cas où on a manqué de carburant"
    }
}
document.querySelector("#openChat").addEventListener("click", function(){
    openChat()
    runSpinner()

    setTimeout( function(){
        salutation()
        runSuggestion()
    }, 2000);

})

document.querySelector("#closeChat").addEventListener("click", function(){
    closeChat()
})
