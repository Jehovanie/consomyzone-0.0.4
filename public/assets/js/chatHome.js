/**
 * CHATBOT FONCTIONNALITY
 * @author Elie Fenohasina <eliefenohasina@gmail.com>
 */

/**
 * Function opening a chatbot
 * @constructor
 */
function openChat() {
    document.querySelector("#chat_container").style="width:58vw;height:82vh; position: fixed;bottom: 0; right: -260px !important; z-index:1003;"
    document.querySelector("#openChat").style="background-color: #0d6efd;width:40px;height:40px;color:white;border-radius:8px;cursor:pointer;display: none;"
    document.querySelector("#chat_header").style ="display:;"
    document.querySelector("#amis_list").style ="display:;"

    
}

/**
 * Function closing a chatbot.
 * @constructor
 */
function closeChat() {

    document.querySelector("#closeChat").disabled = true

    let divs = document.querySelectorAll("#conversation > div")

    divs.forEach(qf=>{
        qf.style="display:none;"
    })

    document.querySelector("#conversation").innerHTML += `
                    <div class="qf-chat text-center popup_exit">
                        <div class="qb-chat vh-chat hi-chat vj-chat yr-chat el-chat yl-chat">
                        <p>Voulez-vous vraiment mettre fin à la conversation ?</p>
                        <div class="p-4">
                            <button class="ad-chat lc-chat mg-chat pg-chat th-chat ni-chat bj-chat wr-chat nj-chat yr-chat oq-chat qq-chat _q-chat ks-chat w-100 mb-1 p-1 h-100 btn_b" onclick="endChat()">Fin de conversation</button>
                            <button class="ad-chat lc-chat mg-chat pg-chat th-chat ni-chat bj-chat wr-chat nj-chat yr-chat oq-chat ks-chat w-100 mb-1 p-1 h-100" onclick="escapeChat()">Pas maintenant</button>
                        </div>
                        </div>
                        
                    </div>`

    document.querySelector(".popup_exit").scrollIntoView();


}

/**
 * Function exiting perfectly a conversation chatbot
 * @constructor
 */
function endChat() {
    document.querySelector("#chat_container").style="height:70px; position: fixed;bottom: 0; right: -320px !important; z-index:1003;background-color:transparent;"
    document.querySelector("#openChat").style="background-color: #0d6efd;width:40px;height:40px;color:white;border-radius:8px;cursor:pointer;"
    document.querySelector("#conversation").innerHTML =""

    document.querySelector("#closeChat").disabled = false

    document.querySelector("#chat_header").style ="display:none;"
    document.querySelector("#amis_list").style ="display:none;"

    if(document.querySelector("div.user-chat-display").getAttribute("data-user-id") == "0" && document.querySelector("#amis_list").getAttribute("data-my-id")=="0"){

        document.querySelector("#amis_list").setAttribute("data-my-id","0")
        
    }

}

/**
 * Function escape exiting conversation chatbot
 * @constructor
 */
function escapeChat() {

    document.querySelector("#closeChat").disabled = false

    let divs = document.querySelectorAll("#conversation > div")

    let divs_len = divs.length - 1

    divs.forEach(qf=>{
        qf.style=""
    })

    if(document.querySelector(".popup_exit")){
        document.querySelector(".popup_exit").remove()
    }

    document.querySelector("#conversation > div:nth-child("+divs_len+")").scrollIntoView();

}

/**
 * Function running spinner writing.
 * @constructor
 */
function runSpinner(){

    if(document.querySelector(".dot-spinner")){
        document.querySelector(".dot-spinner").remove();
    }

    let timestamp = new Date().getTime()

    document.querySelector("#conversation").innerHTML +=`
        <div class="dot-spinner disc_${timestamp}">
            <span></span>
            <span></span>
            <span></span>
        </div>`

    document.querySelector(".disc_"+timestamp).scrollIntoView();
}

/**
 * Function for suggestion initial from a chatbot.
 * @constructor
 */
function runSuggestion() {

    let date_now = new Date().toLocaleTimeString()

    let timestamp = new Date().getTime()

    let list_sugg = ""

    Object.entries(main_suggestion).forEach(([key, value]) => {
        list_sugg += `<button class="ad-chat lc-chat mg-chat pg-chat th-chat ni-chat bj-chat wr-chat nj-chat yr-chat oq-chat qq-chat _q-chat ks-chat w-100 mb-1 p-1 h-100" cle="${key}" onclick="find(this)">
                        ${value}
                    </button>`
    })
   
    let sugg = `
        <div class="qf disc_${timestamp}">
            <div class="qb-chat vh-chat hi-chat vj-chat yr-chat el-chat yl-chat">
                <p>Que veux-tu savoir aujourd'hui ?</p>
                <div class="text-center">
                    ${list_sugg}
                </div>
            </div>
            <p class="nn-chat">${date_now}</p>
        </div>
    `

    setTimeout(function(){

        if(document.querySelector(".dot-spinner")){
            document.querySelector(".dot-spinner").remove();
        }

        document.querySelector("#conversation").innerHTML += sugg

        document.querySelector(".disc_"+timestamp).scrollIntoView();

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

    let timestamp = new Date().getTime()

    let template = ""

    Object.entries(dico).forEach(([key, value]) => {

        if(cle==key){

            if(typeof value === 'object'){

                template += `<div class="qf-chat disc_${timestamp}">
                        <div class="qb-chat vh-chat hi-chat vj-chat yr-chat el-chat yl-chat">
                            <p> Que veux-tu savoir aujourd'hui ?</p>
                            <div class="text-center">`

                Object.entries(value).forEach(([key2, value2]) => {

                    template += `<button class="ad-chat lc-chat mg-chat pg-chat th-chat ni-chat bj-chat wr-chat nj-chat yr-chat oq-chat qq-chat _q-chat ks-chat w-100 mb-1 h-100 p-1" cle="${key2}" onclick="findInDict(this)">
                        ${value2.label}
                    </button>`
                    
                 });

                 template += `</div>
                            </div>
                            <p class="nn-chat">${date_now}</p>
                        </div>`
                
            }
        }
        // else{
        //     //alert("Phrase incorrecte!")
        //     console.log(value);
        // }

    })

    return { timestamp : timestamp, template: template}

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

        document.querySelector("#conversation").innerHTML += result.template

        document.querySelector(".disc_"+result.timestamp).scrollIntoView();   

    }, 1500)
    
    
}

/**
 * Funtion key event for searching a result
 * @constructor
 * @param {string} value - Value for searching
 */
function searchResultKey(q) {

    writeRequest(q)
    
    runSpinner()

    let response = ""

    for(const [cle, valeur] of Object.entries(dico_specifique)) {

        q = q.normalize("NFD").replace(/\p{Diacritic}/gu, "")

        if(q.trim().toLowerCase().includes(cle.trim().toLowerCase())){

            response = valeur

        }else{

            let terms = q.normalize("NFD").replace(/\p{Diacritic}/gu, "").split(" ")

            for(let term of terms){
        
                term = term.trim()
        
                for(const [key, value] of Object.entries(dico_response)) {
        
                    let keys = key.split(",")
        
                    for(let k of keys){
                        if(term.trim().toLowerCase() == k.trim().toLowerCase()){

                            if(!response.includes(value)){
                                response = value;
                            }
                        }
                        if(!response){
        
                            /************ Lancing OPENE AI API if using ************/
        
                            response ="Désolé, je ne comprends pas ce que tu veux dire."
                        }
                    }
                }
            }
        }
    }

    writeResponse(response)
    runSuggestion()

}


/**
 * Function writing a request user
 * @constructor
 * @param {string} request - Request sending by user
 */
function writeRequest(request) {

    let timestamp = new Date().getTime()

    if(request){
        document.querySelector("#conversation").innerHTML += `<div class="qf-chat rb-chat disc_${timestamp}">
            <div class="qb-chat vh-chat ii-chat oj-chat el-chat yl-chat">
            <p class="eo-chat">${request}</p>
            </div>
            <p class="in-chat nn-chat">${new Date().toLocaleTimeString()}</p>
        </div>`

        document.querySelector(".disc_"+timestamp).scrollIntoView();
    }
}

/**
 * Function writing a response chatbot
 * @constructor
 * @param {string} response - Response sending by Chatbot
 */
function writeResponse(response, menu=false) {

    // let date_now = new Date().toLocaleTimeString()

    let timestamp = new Date().getTime()

    if(response){
        setTimeout(function(){

            if(document.querySelector(".dot-spinner")){
                document.querySelector(".dot-spinner").remove();
            }

            let btn_menu =""
            
            if(menu==true){
                btn_menu = `<button class="ad-chat lc-chat mg-chat pg-chat th-chat ni-chat bj-chat wr-chat nj-chat yr-chat oq-chat qq-chat _q-chat ks-chat w-100 mb-1 h-100 p-1" onclick="menu()">🏡 Menu principal</button>`
            }

            document.querySelector("#conversation").innerHTML += `<div class="qf disc_${timestamp}">
                    <div class="qb-chat vh-chat hi-chat vj-chat yr-chat el-chat yl-chat">
                    <p>${response}</p>
                        ${btn_menu}
                    </div>
                    <p class="nn-chat">${new Date().toLocaleTimeString()}</p>
                </div>`

            document.querySelector(".disc_"+timestamp).scrollIntoView();
            
        },1500)
    }


}

/**
 * Function return of menu
 * @constructor
 */
function menu() {

    runSpinner()

    runSuggestion()
}

/**
 * Function sending a conversation to a partisan
 * @constructor
 * @param {string} message - Text Content of message 
 * @param {Array} images - Images content of message
 * @param {string} user_id - Id of other user
 */

function sendChat(message, images =[], user_id) {

    let data = {
        from : document.querySelector("#amis_list").getAttribute("data-my-id"),
        to : user_id,
        message : message,
        images : images
    }

    console.log(data);

    fetch("/user/push/message", {
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify(data)
    }).then(response => {
        if(response.status == 200){
            //writeRequest(message)
            console.log("message sended...");

            if(document.querySelectorAll("div.content_image_input_js_jheo > img").length > 0){
                document.querySelectorAll("div.content_image_input_js_jheo > img").forEach(img=>{
                    img.remove()
                })
            }
            
        }
    })

}

/**
 * Function getting a conversation betwen partisan
 * @constructor
 * @param {string} user_id - Id of other user
 */
function getChat(user_id) {

    fetch("/user/message/"+user_id)
    .then(response=> response.json())
    .then(messages=>{

        let i = 0;

        for(let message of messages){

            let img_doc = ""

            let content = JSON.parse(message.content)

            if(content.images.length > 0){

                for(let img of content.images){

                    img_doc += `<img src="${img}" class="mb-1" alt="photo" style="height:100px;border-radius:5px;">`

                }
                
            }
            
            if(message.isForMe == 0){

                document.querySelector("#conversation").innerHTML += `<div class="qf-chat rb-chat disc_${i}">
                    <div class="qb-chat vh-chat ii-chat oj-chat el-chat yl-chat">
                    <p class="eo-chat">${content.text}</p>
                        ${img_doc}
                    </div>
                    <p class="in-chat nn-chat">${message.datetime}</p>
                </div>`

            }else{

                document.querySelector("#conversation").innerHTML += `<div class="qf disc_${i}">
                        <div class="qb-chat vh-chat hi-chat vj-chat yr-chat el-chat yl-chat">
                        <p>${content.text}</p>
                            ${img_doc}
                        </div>
                        <p class="nn-chat">${message.datetime}</p>
                    </div>`

            }
            i++;
            //console.log(message);
        }

        document.querySelector("#amis_list").setAttribute("data-chat-length", messages.length)
        
        document.querySelector(".disc_"+ (messages.length -1)).scrollIntoView();
    })


}


/**
 * Function checking a new message
 * @constructor
 * @param {string} user_id - Id of user
 */
function checkNewMessage(user_id) {

    setInterval(() => {

        fetch("/user/message/"+user_id)
        .then(response=>response.json())
        .then(data=>{

            let len_actif = document.querySelector("#amis_list").getAttribute("data-chat-length")
            let new_len = data.length

            if(new_len > len_actif){

                let message = data[new_len-1]

                let img_doc = ""

                let content = JSON.parse(message.content)

                if(content.images.length > 0){

                    for(let img of content.images){
    
                        img_doc += `<img src="${img}" class="mb-1" alt="photo" style="height:100px;border-radius:5px;">`
    
                    }
                    
                }

                if(message.isForMe == 0){

                    document.querySelector("#conversation").innerHTML += `<div class="qf-chat rb-chat disc_${new_len-1}">
                        <div class="qb-chat vh-chat ii-chat oj-chat el-chat yl-chat">
                        <p class="eo-chat">${content.text}</p>
                            ${img_doc}
                        </div>
                        <p class="in-chat nn-chat">${message.datetime}</p>
                    </div>`
    
                }else{
    
                    document.querySelector("#conversation").innerHTML += `<div class="qf disc_${new_len-1}">
                            <div class="qb-chat vh-chat hi-chat vj-chat yr-chat el-chat yl-chat">
                            <p>${content.text}</p>
                                ${img_doc}
                            </div>
                            <p class="nn-chat">${message.datetime}</p>
                        </div>`
    
                }

                document.querySelector(".disc_"+ (new_len -1)).scrollIntoView();

                document.querySelector("#amis_list").setAttribute("data-chat-length",new_len)
            }
        })
        
    }, 500);

}

/**
 * Function launching a chat bot
 * @constructor
 */
function lanceChat() {

    document.querySelector("div.user-chat-display").setAttribute("data-user-id","0")

    runSpinner()

    writeResponse("👋 Bonjour! Je suis l'assistant virtuel de ConsoMyZone.")

    runSuggestion()

}

/***********************Action*************** */


let dico = {
    def_cmz : {
        definition : {
            label : "🌍 Qu'est ce que c'est ConsoMyZone ?",
            response : "ConsoMyZone est une application de consommation de service de votre proximité"
        },
        objectif : {
            label : "✍️ Quel est l'objectif de ConsoMyZone ?",
            response : "L'objectif de CMZ est de fournir facilement des données aux consommateurs"
        },
        vision : {
            label :"🔍 Quelle est la vision de ConsoMyZone ?",
            response : "Aider les consommateurs à créer et entretenir le lien avec les professionnels, où qu'ils se trouvent "
        }
    },
    serv_cmz :{
        tribu : {
            label : "👨‍👨‍👧‍👦 Comment grouper tous les consommateurs ?",
            response : "ConsoMyZone propose de créer votre propre groupe appelé Tribu pour attribuer les consommateurs (clients)"
        },
        message : {
            label : "🖥️ Comment discuter entre consommateur ?",
            response : "ConsoMyZone propose d'envoyer et de discuter avec un client ou consommateur par un message privé"
        },
        api : {
            label : "💹 Comment utiliser les données de ConsoMyZone ?",
            response : "ConsoMyZone possede sa propre API pour collecter leur données afin d'utiliser dans votre propre application"
        }
    },
    use_cmz : {
        resto : {
            label : "🥣 A propos des restaurants chez CMZ ?",
            response : "On a plus de 75000 restaurants integrés dans ConsoMyZone, CMZ vous suggère le restaurant le plus proche"
        },
        ferme : {
            label : "🏕️ A propos des fermes chez CMZ ?",
            response : "On a plus de 6000 fermes qui peut être visiter et afficher"
        },
        station : {
            label : "🚉 A propos des stations chez CMZ ?",
            response : "La liste de station service est presque complet dans ConsoMyZone, qui facilite le consommateur au cas où on a manqué de carburant"
        }
    },
    connect_cmz : {
        membre : {
            label : "👨‍👩‍👦‍👦 Qui peut devenir membre chez ConsoMyZone ?",
            response : "Toutes les personnes qui ont besoin de service plus rapide et plus proche peuvent devenir membre chez CMZ. Vous avez une connexion internet? Alors, vous pouvez devenir membre. Inscrire <a class='link-primary' href='/connexion'>ici</a>."
        },
        pt_fort : {
            label : "💵 Quels sont les avantages pour s'inscrire ?",
            response : "Si vous avez inscrit chez CMZ, vous pouvez discuter avec d'autres personnes qui sont le même quartier de vous. Vous pouvez créer de votre propre groupe de restauration ou ferme avec votre proche et inviter d'autres personnes pour devenir membre."
        }
    },
    noconnect_cmz : {
        recherche : {
            label : "🔍 Comment trouver un restaurant ou ferme ou station ?",
            response : "Pour trouver rapidement quelque chose, je vous invite à chercher une donnée avec une adresse ou une quartier ce que vous voudrez dans un bar de recherche en haut."
        },
        map : {
            label : "🌐 Comment trouver un rubrique dans le map ?",
            response : "Vous pouvez localiser votre appareil pour faciliter la recherche de quelque chose de votre proximité. Ensuite, vous pouvez zoomer ou dezoomer la carte pour voir plus proche le détail de quelque chose."
        }
    }
}

let dico_specifique = {
    "je m'appelle" : "Enchanté, je m'appelle ConsoMyZone.",
    "ca va" : "👨‍⚕️ Je vais bien, merci.",
    "ca va?" : "👨‍⚕️ Je vais bien, merci.",
    "comment ca va?" : "👨‍⚕️ Je vais bien, merci.",
    "au revoir" : "👋 Merci, à bientôt.",
    "va tu" : "👨‍⚕️ Je vais bien, merci.",
    "bye bye" : "👋 Merci, à bientôt.",
    "station service" : "L'opérateur station-service est en rapport direct avec la clientèle : service en carburant (si station traditionnelle), encaissement des sommes des marchandises ou services vendus sont ses tâches principales. Pour voir plus dans CMZ, veuillez consulter <a class='link-primary' href='/station'> ici</a>.",
    "sp 95" : "Le SP95-E10 est l'essence sans plomb qui contient jusqu'à 10% d'éthanol en volume. Le SP95 contient 7,5 % d'éthanol (en pur ou en dérivé). Pour voir plus dans CMZ, veuillez consulter <a class='link-primary' href='/station'> ici</a>.",
}

let dico_response = {
    "slt, salut, cv, cc, coucou, bjr, bonjour" : "🤝 Bonjour.",
    "merci" : "👍 Je vous en prie.",
    "bye, revoir" : "👋 Merci, à bientôt.",
    "bisous, biz" : "😘 Bisous.",
    "consomyzone, cmz, conso" :"ConsoMyZone est une application de consommation de service de votre proximité.",
    "compte, login, inscrire, connecter, connexion" : "Si vous avez déjà un compte, veuillez connecter <a class='link-primary' href='/connexion'>ici</a>. Si vous n'avez pas un compte, je vous propose d'inscrire <a class='link-primary' href='/connexion'>ici</a>, en choisissant le menu inscription.",
    "resto, restaurant, pizza, pizzeria, creperie, repas" : "Dans la restauration, on a plusieurs restaurant qui se representent leurs produits dans notre application CMZ. Veuillez consulter <a class='link-primary' href='/restaurant'> ici</a> pour voir plus de restaurants.",
    "ferme, fermier, farm, producteur, agriculture, biologie, fruit, produit, leguime, viande, crêmerie" : "Visitez la ferme pour avoir le prix de gros et des produits biologiques et sécuritaires. Veuillez consulter <a class='link-primary' href='/ferme'> ici</a> pour voir plus de fermes.",
    "station, carburant, essence, gazoil, petrole, gazole,sp95, sp98" : "Visitez la station service dans notre application CMZ pour trouver la station le plus proche et choisissez le meuilleur prix. Veuillez consulter <a class='link-primary' href='/station'> ici</a> pour voir plus de stations.",
}

let main_suggestion = {
    def_cmz : "📌 C'est quoi ConsoMyZone ou CMZ ?",
    serv_cmz :"♻️ Quelles services chez CMZ ?",
    use_cmz :"🛠️ Nécessaire pour quel CMZ ?",
    connect_cmz :"🏘️ Partie connecté de CMZ ?",
    noconnect_cmz :"💎 Partie non connecté de CMZ ?"
}

//const user_id = document.querySelector("div.user-chat-display").getAttribute("data-user-id")

document.querySelector("#openChat").addEventListener("click", function(){

    openChat()

    if(document.querySelector("#amis_list").getAttribute("data-my-id") == 0 ){

        runSpinner()

        writeResponse(`Vous n'êtes pas connecté.<br><a class='link-primary' href=\"/connexion\">
        Connectez-vous</a> ou <a class='link-primary' href=\"/connexion\">créez un compte</a>.<br><br>
        <span class='link-primary cursor-pointer' onclick='lanceChat()'>Parlez avec l'assistant virtuel.</span>`)

    }else{

        if(document.querySelector("div.user-chat-display").getAttribute("data-user-id") == "0"){

            runSpinner()

            writeResponse("👋 Bonjour! Je suis l'assistant virtuel de ConsoMyZone.")
    
            runSuggestion()
            
        }else{
            
            getChat(document.querySelector("div.user-chat-display").getAttribute("data-user-id"))
        
        }
    }

})

document.querySelector("#closeChat").addEventListener("click", function(){

    closeChat()

})

document.querySelector("#text-search").addEventListener("keyup", function(e){

    if (e.key === 'Enter' || e.keyCode === 13) {

        if(document.querySelector("div.user-chat-display").getAttribute("data-user-id") == 0){
            if(e.target.value){

                searchResultKey(e.target.value)
    
            }
        }else{
            //console.log("send message user");

            sendChat(e.target.value, image_list, document.querySelector("div.user-chat-display").getAttribute("data-user-id"))
        }
        

        e.target.value =""

    }
    
})

document.querySelector("#btn-send").addEventListener("click", function(e){

    if(document.querySelector("div.user-chat-display").getAttribute("data-user-id") == 0){

        if(document.querySelector("#text-search").value){

            searchResultKey(document.querySelector("#text-search").value)
    
        }
        
    }else{

        //console.log("send message user");

        sendChat(document.querySelector("#text-search").value, image_list, document.querySelector("div.user-chat-display").getAttribute("data-user-id"))

    }
    
    document.querySelector("#text-search").value =""
    
})




// var controller = new ScrollMagic.Controller();

// 		// build tween
// 		var tween = TweenMax.to("#animate", 0.5, {scale: 3, ease: Linear.easeNone});

// 		// build scene
// 		var scene = new ScrollMagic.Scene({triggerElement: "#multiDirect", duration: 400, offset: 250})
// 						.setTween(tween)
// 						.setPin("#animate")
// 						.addIndicators({name: "resize"}) // add indicators (requires plugin)
// 						.addTo(controller);

// 		// init controller horizontal
// 		var controller_h = new ScrollMagic.Controller({vertical: false});

// 		// build tween horizontal
// 		var tween_h = TweenMax.to("#animate", 0.5, {rotation: 360, ease: Linear.easeNone});

// 		// build scene
// 		var scene_h = new ScrollMagic.Scene({duration: 700})
// 						.setTween(tween_h)
// 						.setPin("#animate")
// 						.addIndicators({name: "rotate"}) // add indicators (requires plugin)
// 						.addTo(controller_h);


document.querySelectorAll("div.cg-chat").forEach(amis=>{

    amis.addEventListener("click", function(e){

        document.querySelector("#conversation").innerHTML =""

        let user_name = e.target.textContent.trim()

        let user_id = amis.getAttribute("data-toggle-user-id")

        document.querySelector("#user_name_chat").innerText = user_name

        if(user_name != "Assistant Virtuel"){

            document.querySelector("#profile-user").src = amis.querySelector("img").src
            document.querySelector(".mn-chat").style.display ="none"

            document.querySelector("div.user-chat-display").setAttribute("data-user-id",user_id)

            // get message from other user

            getChat(user_id)

            // check the new message
            checkNewMessage(user_id)

            document.querySelector(".btn-input-file").style="cursor:pointer;"

        }else{
        
            document.querySelector("#profile-user").src = "https://www.iconpacks.net/icons/1/free-help-icon-1160-thumb.png"

            document.querySelector(".user-chat-display").innerHTML = `
                    <h5 class="un-chat zn-chat gs-chat" id="user_name_chat">
                        Assistant Virtuel
                    </h5>
                    <p class="mn-chat">Reponse automatique</p>`
            
            document.querySelector("div.user-chat-display").setAttribute("data-user-id","0")

            document.querySelector(".btn-input-file").style="cursor:not-allowed;"

            runSpinner()

            writeResponse("👋 Bonjour! Je suis l'assistant virtuel de ConsoMyZone.")
    
            runSuggestion()
            
        }

    })
})

/** Upload file */

let image_list = [];

document.querySelector("#input-file").addEventListener("change", (e) => {

    ///read file
    const reader = new FileReader();

    ////on load file
    reader.addEventListener("load", () => {

        /// file as url
        const uploaded_image = reader.result;

        ///let get multiple images (files)
        image_list.push(reader.result);

        //// for the content image above the input message
        const img = document.createElement("img")
        img.src = uploaded_image
        img.style = "width:100px;height:100px;"
        img.setAttribute("alt","Image upload")
        document.querySelector(".content_image_input_js_jheo").style.display= "flex"

        const parentImage = document.querySelector(".content_image_input_js_jheo")

        //// add in the first the new image upload
        if(parentImage.querySelector("img")){
            parentImage.insertBefore(img, parentImage.querySelector("img"))
        }else{
            document.querySelector(".content_image_input_js_jheo").appendChild(img)
        }

    });


    ///run event load in file reader.
    reader.readAsDataURL(e.target.files[0]);
        
})