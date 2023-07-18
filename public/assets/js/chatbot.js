/**
 * CHATBOT FONCTIONNALITY
 * @author Elie Fenohasina <eliefenohasina@gmail.com>
 */

/**
 * Function opening a chatbot
 * @constructor
 */
function openChat() {
    document.querySelector("#chat_container").style="width:28vw;height:92vh; position: fixed;bottom: 0; right: 0; z-index:1003;"
    document.querySelector("#openChat").style="background-color: #0d6efd;width:40px;height:40px;color:white;border-radius:8px;cursor:pointer;display: none;"
    //document.querySelector("#conversation").innerHTML =""
}

/**
 * Function closing a chatbot.
 * @constructor
 */
function closeChat() {

    document.querySelector("#chat_container").style="width:70px;height:70px; position: fixed;bottom: 0; right: 0; z-index:1003;background-color:transparent;"
    document.querySelector("#openChat").style="background-color: #0d6efd;width:40px;height:40px;color:white;border-radius:8px;cursor:pointer;"

}

/**
 * Function running spinner writing.
 * @constructor
 */
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

/**
 * Function for suggestion initial from a chatbot.
 * @constructor
 */
function runSuggestion() {

    let date_now = new Date().toLocaleTimeString()

    let sugg = `
        <div class="qf">
            <div class="qb vh hi vj yr el yl">
                <p>Que veux-tu savoir aujourd'hui ?</p>
                <div class="text-center">
                    <button class="ad lc mg pg th ni bj wr nj yr oq qq _q ks w-100 mb-1" cle="def_cmz" onclick="find(this)">
                        A propos de ConsoMyZone ?
                    </button>

                    <button class="ad lc mg pg th ni bj wr nj yr oq qq _q ks w-100 mb-1" cle="serv_cmz" onclick="find(this)">
                        Service de ConsoMyZone ?
                    </button>

                    <button class="ad lc mg pg th ni bj wr nj yr oq qq _q ks w-100 mb-1" cle="use_cmz" onclick="find(this)">
                        Utilisation de ConsoMyZone ?
                    </button>
                </div>
            </div>
            <p class="nn">${date_now}</p>
        </div>
    `
    setTimeout(function(){
        document.querySelector("#conversation").innerHTML += sugg
    },1500)
    
}

/**
 * Function for funding a result in a dictionnary.
 * @constructor
 * @param {node} elem - Element for getting a key for search
 */

function findInDict(elem) {

    let cle = elem.getAttribute("cle")

    Object.entries(dico).forEach(([key, value]) => {
        Object.entries(value).forEach(([key2, value2]) => {
            if(cle==key2){

                writeRequest(value2.label)

                runSpinner()

                writeResponse(value2.response, true)

            }
        })
    })
}


/**
 * Function for getting a list of suggestion (response) from a dictionnary.
 * @constructor
 * @param {string} cle - Key to search
 * @param {object} dico - Dictionnary having a result
 */

function getResponse(cle, dico) {
    
    let date_now = new Date().toLocaleTimeString()

    let template = ""

    Object.entries(dico).forEach(([key, value]) => {

        if(cle==key){

            if(typeof value === 'object'){

                template += `<div class="qf">
                        <div class="qb vh hi vj yr el yl">
                            <p> Que veux-tu savoir aujourd'hui ?</p>
                            <div class="text-center">`

                Object.entries(value).forEach(([key2, value2]) => {

                    template += `<button class="ad lc mg pg th ni bj wr nj yr oq qq _q ks w-100 mb-1 h-100 p-1" cle="${key2}" onclick="findInDict(this)">
                        ${value2.label}
                    </button>`
                    
                 });

                 template += `</div>
                            </div>
                            <p class="nn">${date_now}</p>
                        </div>`
            }
        }else{
            console.log(value);
        }

    })

    return template;
}

/**
 * Function for finding a result suggestion from a dictionnary.
 * @constructor
 * @param {node} elem - Element storing a key attribute
 */

function find(elem) {

    writeRequest(elem.textContent)

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

/**
 * Funtion key event for searching a result
 * @constructor
 * @param {string} value - Value for searching
 */
function searchResultKey(q) {

    writeRequest(q)
    
    runSpinner()

    let terms = q.normalize("NFD").replace(/\p{Diacritic}/gu, "").split(" ")

    let response = ""

    for(let term of terms){
        term = term.trim()
        for(const [key, value] of Object.entries(dico_response)) {
            let keys = key.split(",")

            for(let k of keys){
                if(term.trim().toLowerCase() == k.trim().toLowerCase()){
                    //console.log(value)
                    if(!response.includes(value)){
                        response = value;
                    }
                    
                }
            }
            //console.log(key + value);
        }
    }

    writeResponse(response)

    console.log(response);

}


/**
 * Function writing a request user
 * @constructor
 * @param {string} request - Request sending by user
 */
function writeRequest(request) {

    let date_now = new Date().toLocaleTimeString()

    if(request){
        document.querySelector("#conversation").innerHTML += `<div class="qf rb">
            <div class="qb vh ii oj el yl">
            <p class="eo">${request}</p>
            </div>
            <p class="in nn">${date_now}</p>
        </div>`
    }
}

/**
 * Function writing a response chatbot
 * @constructor
 * @param {string} response - Response sending by Chatbot
 */
function writeResponse(response, menu=false) {

    let date_now = new Date().toLocaleTimeString()

    if(response){
        setTimeout(function(){

            if(document.querySelector(".dot-spinner")){
                document.querySelector(".dot-spinner").remove();
            }
            
            if(menu==false){
                document.querySelector("#conversation").innerHTML += `<div class="qf">
                    <div class="qb vh hi vj yr el yl">
                    <p>${response}</p>
                    </div>
                    <p class="nn">${date_now}</p>
                </div>`
            }else{
                document.querySelector("#conversation").innerHTML += `<div class="qf">
                    <div class="qb vh hi vj yr el yl">
                    <p>${response}</p>
                    <button class="ad lc mg pg th ni bj wr nj yr oq qq _q ks w-100 mb-1 h-100 p-1" onclick="runSuggestion()"> Menu principal</button>
                    </div>
                    <p class="nn">${date_now}</p>
                </div>`
            }
            
        },1500)
    }

}
/***********************Action*************** */


let dico = {
    def_cmz : {
        definition : {
            label : "Qu'est ce que c'est ConsoMyZone ?",
            response : "ConsoMyZone est une application de consommation de service de votre proximité"
        },
        objectif : {
            label : "Quel est l'objectif de ConsoMyZone ?",
            response : "L'objectif de CMZ est de fournir facilement des données aux consommateurs"
        },
        vision : {
            label :"Quelle est vision de ConsoMyZone ?",
            response : "Aider les consommateurs à créer et entretenir le lien avec les professionnels, où qu'ils se trouvent "
        }
    },
    serv_cmz :{
        tribu : {
            label : "Comment grouper tous les consommateur ?",
            response : "ConsoMyZone propose de créer votre propre groupe appelé Tribu pour attribuer les consommateurs (clients)"
        },
        message : {
            label : "Comment discuter entre consommateur ?",
            response : "ConsoMyZone propose d'envoyer et de discuter avec un client ou consommateur par un message privé"
        },
        api : {
            label : "Comment utiliser les données de ConsoMyZone ?",
            response : "ConsoMyZone possede sa propre API pour collecter leur données afin d'utiliser dans votre propre application"
        }
    },
    use_cmz : {
        resto : {
            label : "Combien y a-t-il de restaurants dans ConsoMyZone ?",
            response : "On a plus de 75000 restaurants integrés dans ConsoMyZone, CMZ vous suggère le restaurant le plus proche"
        },
        ferme : {
            label : "Combien y a-t-il de fermes dans ConsoMyZone ?",
            response : "On a plus de 6000 fermes qui peut être visiter et afficher"
        },
        station : {
            label : "Combien y a-t-il de stations services dans ConsoMyZone ?",
            response : "La liste de station service est presque complet dans ConsoMyZone, qui facilite le consommateur au cas où on a manqué de carburant"
        }
    }
}

let dico_response = {
    "slt, salut, cv, ca va, cc, coucou, bjr, bonjour" : "Bonjour!",
    "consomyzone, cmz, definition" :"ConsoMyZone est une application de consommation de service de votre proximité.",
    "compte" : "Si vous avez déjà un compte, veuillez connecter <a href='/connexion'>ici</a>. Si vous n'avez pas un compte, je vous propose d'inscrire <a href='/connexion'>ici</a>. en choisissant le menu inscription.",
    "resto, restaurant, pizza, pizzeria, creperie, repas" : ""
}

document.querySelector("#openChat").addEventListener("click", function(){

    openChat()

    runSpinner()

    //Salutation
    writeResponse("👋 Bonjour! Je suis CMZ Chatbot. Je peux repondre à vos question.")

    runSuggestion()

})

document.querySelector("#closeChat").addEventListener("click", function(){

    closeChat()

})

document.querySelector("#text-search").addEventListener("keyup", function(e){

    if (e.key === 'Enter' || e.keyCode === 13) {

        searchResultKey(e.target.value)

        e.target.value =""

    }
    
})

document.querySelector("#btn-send").addEventListener("click", function(e){

    searchResultKey(document.querySelector("#text-search").value)

    document.querySelector("#text-search").value =""
    
})

