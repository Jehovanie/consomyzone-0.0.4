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
 * Function for salutation from a chatbot.
 * @constructor
 */
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

/**
 * Function for suggestion initial from a chatbot.
 * @constructor
 */
function runSuggestion() {

    let date_now = new Date().toLocaleTimeString()

    document.querySelector("#conversation").innerHTML += `
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
}


/**
 * Function for writing a request from user.
 * @constructor
 * @param {string} request - The question from user.
 */
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

/**
 * Function for funding a result in a dictionnary.
 * @constructor
 * @param {node} elem - Element for getting a key for search
 */

function findInDict(elem) {

    let cle = elem.getAttribute("cle")

    let date_now = new Date().toLocaleTimeString()

    Object.entries(dico).forEach(([key, value]) => {
        Object.entries(value).forEach(([key2, value2]) => {
            if(cle==key2){
                //console.log(value2);

                document.querySelector("#conversation").innerHTML += `<div class="qf rb">
                    <div class="qb vh ii oj el yl">
                    <p class="eo">${value2.label}</p>
                    </div>
                    <p class="in nn">${date_now}</p>
                </div>`

                runSpinner()

                setTimeout(function(){

                    if(document.querySelector(".dot-spinner")){
                        document.querySelector(".dot-spinner").remove();
                    }

                    document.querySelector("#conversation").innerHTML += `<div class="qf">
                        <div class="qb vh hi vj yr el yl">
                        <p>${value2.response}</p>
                            <button class="ad lc mg pg th ni bj wr nj yr oq qq _q ks w-100 mb-1" onclick="runSuggestion()">Menu principal</button>
                        </div>
                        <p class="nn">${date_now}</p>
                    </div>`
                },1500)

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
                            <p>Que veux-tu savoir aujourd'hui ?</p>
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

/**
 * Funtion key event for searching a result
 * @constructor
 * @param {string} value - Value for searching
 */
function searchResultKey(q) {

    console.log(q);

    let doc = nlp(q)

    console.log(doc.data());
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

document.querySelector("#openChat").addEventListener("click", function(){
    openChat()
    runSpinner()

    setTimeout( function(){
        salutation()
        runSuggestion()
    }, 1500);

})

document.querySelector("#closeChat").addEventListener("click", function(){
    closeChat()
})

document.querySelector("#text-search").addEventListener("keyup", function(e){

    if (e.key === 'Enter' || e.keyCode === 13) {

        searchResultKey(e.target.value)

        console.log(e.target.value);

        e.target.value =""

    }
    
})


