/**
 * CHATBOT FONCTIONNALITY
 * @author Elie Fenohasina <eliefenohasina@gmail.com>
 */

/**
 * Function opening a chatbot
 * @constructor
 */
function openChat() {
    document.querySelector("#chat_container").style = "width:58vw;height:82vh; position: fixed;bottom: 0; right: -260px; z-index:1003;"
    document.querySelector("#openChat").style = "background-color: #69BC45;width:40px;height:40px;color:white;border-radius:8px;cursor:pointer;display: none;"
    document.querySelector("#chat_header").style = "display:;"
    document.querySelector("#amis_list").style = "display:;"

    document.querySelector("#openFlottant").style = "display:none;"
    document.querySelector("#visio").style = "display:none;"
    document.querySelector("#conversation").style = "display:;"
    document.querySelector("#footer_chat").style.display = ""


}

/**
 * Function closing a chatbot.
 * @constructor
 */
function closeChat() {

    document.querySelector("#closeChat").disabled = true

    let divs = document.querySelectorAll("#conversation > div")

    divs.forEach(qf => {
        qf.style = "display:none;"
    })


    endChat()

}

/**
 * Function exiting perfectly a conversation chatbot
 * @constructor
 */
function endChat() {
    document.querySelector("#chat_container").style = "height:70px; position: fixed;bottom: 0; right: -320px; z-index:1003;background-color:transparent;"
    document.querySelector("#chat_container").classList.add("right_full")
    document.querySelector("#openChat").style = "background-color: #69BC45;width:40px;height:40px;color:white;border-radius:8px;cursor:pointer;"
    document.querySelector("#conversation").innerHTML = ""

    document.querySelector("#conversation").style.display = "none"
    document.querySelector("#footer_chat").style.display = "none"


    document.querySelector("#closeChat").disabled = false

    document.querySelector('#closeChat').style ="display:"
    document.querySelector('#closevisio').style ="display:none"

    document.querySelector("#chat_header").style = "display:none;"
    document.querySelector("#amis_list").style = "display:none;"
    document.querySelector("#visio_group_btn").style = "display:none"


    if (document.querySelector("div.user-chat-display").getAttribute("data-user-id") == "0" && document.querySelector("#amis_list").getAttribute("data-my-id") == "0") {

        document.querySelector("#amis_list").setAttribute("data-my-id", "0")

    }

    if(document.querySelector("#chat_container").getAttribute("data-type") == "visio"){

        document.querySelector("#chat_container").classList.remove("chat_container_visio")
        document.querySelector("#chat_container > div.content-chat.vc-chat.lc-chat.hg-chat.vv-chat.xi-chat.yi-chat.bj-chat.wr-chat").classList.remove("content_chat_visio")
        document.querySelector("#amis_list > div").classList.remove("chat_friend_visio")
        // document.querySelector("#visio_group_btn").style = "display:block;"
        // document.querySelector("#visio").innerHTML = ""
        document.querySelector("#visio").style.display = "none"
        // document.querySelector("#chat_container").style = "width: 75vw; height: 82vh; position: fixed; bottom: 0px; z-index: 1003; right: -260px !important;"

    }

    document.querySelector("#openFlottant").style = "display:flex;"

}

/**
 * Function escape exiting conversation chatbot
 * @constructor
 */
function escapeChat() {

    document.querySelector("#closeChat").disabled = false

    let divs = document.querySelectorAll("#conversation > div")

    let divs_len = divs.length - 1

    divs.forEach(qf => {
        qf.style = ""
    })

    if (document.querySelector(".popup_exit")) {
        document.querySelector(".popup_exit").remove()
    }

    document.querySelector("#conversation > div:nth-child(" + divs_len + ")").scrollIntoView();

}

/**
 * Function running spinner writing.
 * @constructor
 */
function runSpinner() {

    if (document.querySelector(".dot-spinner")) {
        document.querySelector(".dot-spinner").remove();
    }

    let timestamp = new Date().getTime()

    document.querySelector("#conversation").innerHTML += `
        <div class="dot-spinner disc_${timestamp}">
            <span></span>
            <span></span>
            <span></span>
        </div>`

    document.querySelector(".disc_" + timestamp).scrollIntoView();
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

    setTimeout(function () {

        if (document.querySelector(".dot-spinner")) {
            document.querySelector(".dot-spinner").remove();
        }

        document.querySelector("#conversation").innerHTML += sugg

        document.querySelector(".disc_" + timestamp).scrollIntoView();

    }, 1500)

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
            if (cle == key2) {

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

        if (cle == key) {

            if (typeof value === 'object') {

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

    return { timestamp: timestamp, template: template }

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

    setTimeout(function () {

        if (document.querySelector(".dot-spinner")) {
            document.querySelector(".dot-spinner").remove();
        }

        document.querySelector("#conversation").innerHTML += result.template

        document.querySelector(".disc_" + result.timestamp).scrollIntoView();

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

    for (const [cle, valeur] of Object.entries(dico_specifique)) {

        q = q.normalize("NFD").replace(/\p{Diacritic}/gu, "")

        if (q.trim().toLowerCase().includes(cle.trim().toLowerCase())) {

            response = valeur

        } else {

            let terms = q.normalize("NFD").replace(/\p{Diacritic}/gu, "").split(" ")

            for (let term of terms) {

                term = term.trim()

                for (const [key, value] of Object.entries(dico_response)) {

                    let keys = key.split(",")

                    for (let k of keys) {
                        if (term.trim().toLowerCase() == k.trim().toLowerCase()) {

                            if (!response.includes(value)) {
                                response = value;
                            }
                        }
                        if (!response) {

                            /************ Lancing OPENE AI API if using ************/

                            response = "Désolé, je ne comprends pas ce que tu veux dire."
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

    if (request) {
        document.querySelector("#conversation").innerHTML += `<div class="qf-chat rb-chat disc_${timestamp}">
            <div class="qb-chat vh-chat ii-chat oj-chat el-chat yl-chat">
            <p class="eo-chat">${request}</p>
            </div>
            <p class="in-chat nn-chat">${new Date().toLocaleTimeString()}</p>
        </div>`

        document.querySelector(".disc_" + timestamp).scrollIntoView();
    }
}

/**
 * Function writing a response chatbot
 * @constructor
 * @param {string} response - Response sending by Chatbot
 */
function writeResponse(response, menu = false) {

    // let date_now = new Date().toLocaleTimeString()

    let timestamp = new Date().getTime()

    if (response) {
        setTimeout(function () {

            if (document.querySelector(".dot-spinner")) {
                document.querySelector(".dot-spinner").remove();
            }

            let btn_menu = ""

            if (menu == true) {
                btn_menu = `<button class="ad-chat lc-chat mg-chat pg-chat th-chat ni-chat bj-chat wr-chat nj-chat yr-chat oq-chat qq-chat _q-chat ks-chat w-100 mb-1 h-100 p-1" onclick="menu()">🏡 Menu principal</button>`
            }

            document.querySelector("#conversation").innerHTML += `<div class="qf disc_${timestamp}">
                    <div class="qb-chat vh-chat hi-chat vj-chat yr-chat el-chat yl-chat">
                    <p>${response}</p>
                        ${btn_menu}
                    </div>
                    <p class="nn-chat">${new Date().toLocaleTimeString()}</p>
                </div>`

            document.querySelector(".disc_" + timestamp).scrollIntoView();

        }, 1500)
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

function sendChat(message, files= [], user_id) {

    let data = {
        from: document.querySelector("#amis_list").getAttribute("data-my-id"),
        to: user_id,
        message: message,
        files : files
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

        if (response.status == 200) {

            //getChat(user_id)

            if (document.querySelectorAll("div.content_image_input_js_jheo > img").length > 0) {
                document.querySelectorAll("div.content_image_input_js_jheo > img").forEach(img => {
                    img.remove()
                })
            }

            if (document.querySelectorAll("ul.content_image_input_js_jheo_file_name > li").length > 0) {
                document.querySelectorAll("ul.content_image_input_js_jheo_file_name > li").forEach(li => {
                    li.remove()
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

    fetch("/user/message/" + user_id)
        .then(response => response.json())
        .then(messages => {

            let i = 0;

            document.querySelector("#conversation").innerHTML = ""

            if (messages.length > 0) {

                for (let message of messages) {

                    //console.log(message);

                    let img_doc = ""

                    let file_doc = ""

                    let content = JSON.parse(message.content)

                    if (content.images.length > 0) {

                        for (let img of content.images) {

                            img_doc += `<img src="${img}" class="mb-1" alt="photo" style="height:100px;border-radius:5px;">`

                        }

                    }

                    if (content.files && content.files.length > 0) {

                        
                        for (let file of content.files) {
                            
                            let ext = getExtension(file.split(".")[file.split(".").length -1])

                            file_doc += `<div class="mt-2 mb-2" style="display:flex;flex-direction: row;justify-content: space-between">
                                            <a href="${file}" download class="icon_download_file" alt="photo" style="cursor: pointer;font-size: 1.6rem;"><i class="fas fa-file-text"></i></a>
                                            <div class="text-center" style="width:85%; display:block; overflow:auto;">document.${ext}</div>
                                            <a href="${file}" download class="icon_download_file" alt="photo" style="cursor: pointer;font-size: 1.6rem;"><i class="fas fa-download"></i></a>
                                            </div>`

                        }

                    }

                    if (message.isForMe == 0) {

                        document.querySelector("#conversation").innerHTML += `<div class="qf-chat rb-chat disc_${message.id}">
                        <div class="qb-chat vh-chat ii-chat oj-chat el-chat yl-chat">
                        <p class="eo-chat">${content.text}</p>
                            ${img_doc}
                            ${file_doc}
                        </div>
                        <p class="in-chat nn-chat">${message.datetime}</p>
                    </div>`

                    } else {

                        document.querySelector("#conversation").innerHTML += `<div class="qf disc_${message.id}">
                            <div class="qb-chat vh-chat hi-chat vj-chat yr-chat el-chat yl-chat">
                            <p>${content.text}</p>
                                ${img_doc}
                                ${file_doc}
                            </div>
                            <p class="nn-chat">${message.datetime}</p>
                        </div>`

                    }
                    i = message.id;
                    //console.log(message);
                }

                if (messages.length > 0) {
                    document.querySelector(".disc_" + (i)).scrollIntoView();
                }

            } else {

                document.querySelector("#conversation").innerHTML = "<p class='text-center'>Aucun message.</p>"

            }

        })

}


/**
 * Function checking a new message
 * @constructor
 * @param {string} user_id - Id of user
 */
function checkNewMessage(user_id) {

    /// sse event

    if (document.querySelector("div.user-chat-display")) {

       const evtSource = new EventSource("/user/read/message?id=" + user_id);

        //// event onmessage
        evtSource.onmessage = function (event) {

            const all_messages = JSON.parse(event.data);

            all_messages.forEach(message => {

                //console.log(message);
                if (!document.querySelector("div.disc_" + message.id) && document.querySelector("div.user-chat-display").getAttribute("data-user-id") == user_id) {

                    let img_doc = ""

                    let file_doc = ""

                    let content = JSON.parse(message.content)
    
                    if (content.images.length > 0) {
    
                        for (let img of content.images) {
    
                            img_doc += `<img src="${img}" class="mb-1" alt="photo" style="height:100px;border-radius:5px;">`
    
                        }
    
                    }

                    if (content.files && content.files.length > 0) {

                        for (let file of content.files) {

                            let ext = getExtension(file.split(".")[file.split(".").length -1])

                            file_doc += `<div class="mt-2 mb-2" style="display:flex;flex-direction: row;justify-content: space-between">
                                            <a href="${file}" download class="icon_download_file" alt="document" style="cursor: pointer;font-size: 1.6rem;"><i class="fas fa-file-text"></i></a>
                                            <div class="text-center" style="width:85%; display:block; overflow:auto;">document.${ext}</div>
                                            <a href="${file}" download class="icon_download_file" alt="document" style="cursor: pointer;font-size: 1.6rem;"><i class="fas fa-download"></i></a>
                                            </div>`

                        }

                    }
    
                    if (message.isForMe == 0) {
    
                        document.querySelector("#conversation").innerHTML += `<div class="qf-chat rb-chat disc_${message.id}">
                            <div class="qb-chat vh-chat ii-chat oj-chat el-chat yl-chat">
                            <p class="eo-chat">${content.text}</p>
                                ${img_doc}
                                ${file_doc}
                            </div>
                            <p class="in-chat nn-chat">${message.datetime}</p>
                        </div>`
    
                    } else {
    
                        document.querySelector("#conversation").innerHTML += `<div class="qf disc_${message.id}">
                                <div class="qb-chat vh-chat hi-chat vj-chat yr-chat el-chat yl-chat">
                                <p>${content.text}</p>
                                    ${img_doc}
                                    ${file_doc}
                                </div>
                                <p class="nn-chat">${message.datetime}</p>
                            </div>`
    
                    }
    
                    document.querySelector(".disc_" + (message.id)).scrollIntoView();
    
                }

            })
        }

    }


}

/**
 * Function launching a chat bot
 * @constructor
 */
function lanceChat() {

    document.querySelector("div.user-chat-display").setAttribute("data-user-id", "0")

    runSpinner()

    writeResponse("👋 Bonjour! Je suis l'assistant virtuel de ConsoMyZone.")

    runSuggestion()

}


/**
 * Function to get a extension file js
 * @constructor
 * @param {string} params 
 * @returns string : extension
 */
function getExtension(params) {

    let final_ext = params
    Object.entries(file_extension).forEach(([key, value]) => {
        if(key==params){
            final_ext = value;
        }
    })

    return final_ext;
}

/**
 * Function updating a status of visio
 * @constructor
 * @param {integer} id 
 * @param {string} status 
 */
function setStatusMeetById(id, status) {

    fetch("/update/visio/"+id+"/"+status, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "POST",
    })
}

/**
 * Function gerating a UID
 * @constructor
 * @returns {string} : UID 
 */
function generateUID() {

    var firstPart = (Math.random() * 46656) | 0;
    var secondPart = (Math.random() * 46656) | 0;
    firstPart = ("000" + firstPart.toString(36)).slice(-3);
    secondPart = ("000" + secondPart.toString(36)).slice(-3);
    return firstPart + secondPart;

}

// Value's declaration of Jitsi
// Editing with Jitsi as a Service API (Jaas)
// On https://jaas.8x8.vc/

const domain = '8x8.vc'
const jwt = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6InZwYWFzLW1hZ2ljLWNvb2tpZS02Yzg3YzllY2NlOGI0Y2NkYTMwYWYzNTkxZGMyNGI1NC82MGVkZjAifQ.eyJpc3MiOiJjaGF0IiwiYXVkIjoiaml0c2kiLCJleHAiOjE3MjM3OTQ0NDIsIm5iZiI6MTY5MjY5MDQ0Miwicm9vbSI6IioiLCJzdWIiOiJ2cGFhcy1tYWdpYy1jb29raWUtNmM4N2M5ZWNjZThiNGNjZGEzMGFmMzU5MWRjMjRiNTQiLCJjb250ZXh0Ijp7InVzZXIiOnsibW9kZXJhdG9yIjoiZmFsc2UiLCJlbWFpbCI6ImVsaWVmZW5vaGFzaW5hQGdtYWlsLmNvbSIsIm5hbWUiOiIiLCJhdmF0YXIiOiIiLCJpZCI6Imdvb2dsZS1vYXV0aDJ8MTE4MzA0NTkyNDkwOTc1OTYyOTc1In0sImZlYXR1cmVzIjp7InJlY29yZGluZyI6InRydWUiLCJsaXZlc3RyZWFtaW5nIjoidHJ1ZSIsInRyYW5zY3JpcHRpb24iOiJmYWxzZSIsIm91dGJvdW5kLWNhbGwiOiJmYWxzZSJ9fX0.aVoq6pqgQL4vIHrOnvFOBP7UY1Q-1v1CaGWsO04zKPtC_uFWvkp09EX5I6qD8sBLcwxv8anF1zhOCAIJIdPruDlfp82RIhD0x4_RAkxie8TJqr0MneAQoNAXSyf8ZJent-VxTlAwIuP5OwKgVEGcF1LPXxe7aFr4cxQ24kGd_z7aspR52GPo_R8QjX-AN-jelqIDcQQCiqLvJSLFRHwYIvM9kQaA5OHezUT-4uZy-R0P6fx3oMr0OFDn3DeQobJUkADDYMj4M6W1_trjmDoUkEa2moJmSmDnrj8rT0lpC3jg-oWvMz5PVFSu1d4jJniDSKjjjfTXNFvqplibMvK8rA'
const home_room = 'vpaas-magic-cookie-6c87c9ecce8b4ccda30af3591dc24b54/'

/**
 * Function joining a meeting jitsi
 * @constructor
 * @param {integer} id : id of meet
 * @param {string} room : roomname of meet
 */
function joinMeet(id, room) {

    let user_name = document.querySelector("#my_full_name").textContent.trim()
            
    const options = {
        roomName: home_room+room,
        width: "100%",
        height: "95%",
        lang: 'fr',
        jwt : jwt,
        configOverwrite: { prejoinPageEnabled: false},
        // configOverwrite: { prejoinPageEnabled: false , enableClosePage: false, toolbarButtons : ['microphone', 'camera','tileview','fullscreen', 'desktop', 'closedcaptions','participants-pane','hangup']},
        interfaceConfigOverwrite: { VERTICAL_FILMSTRIP: true },
        parentNode: document.querySelector('#visio'),
    };

    let api = new JitsiMeetExternalAPI(domain, options);

    api.executeCommand('displayName', user_name);

    setStatusMeetById(id,"progress")

    const iframe = api.getIFrame();

    iframe.scrollIntoView();

    api.on('readyToClose', () => {

        fetch("/getVisioByName/"+room)
        .then(response=>response.json())
        .then(visios=>{

            if(visios.length > 0){

                for(let visio of visios){

                    setStatusMeetById(visio.id, "finished")

                }
            }
            
        })
        
        document.querySelector('#visio').innerHTML =""
        document.querySelector("#user_name_chat").innerText ="VisioConférence"
	})

    api.addEventListener('participantJoined', (e)=>{

        if(!document.querySelector("#user_name_chat").textContent.trim().includes(e.displayName)){

            document.querySelector("#user_name_chat").innerText =document.querySelector("#user_name_chat").textContent.trim().replace("VisioConférence", "Vous") +", "+e.displayName
        }


    })
    
}


/**
 * Function creating a meeting jitsi
 * @constructor
 * @param {string} roomRandom : name of room
 * @param {integer} user_id : user_id of user
 */
function runVisio(roomRandom, user_id) {

    let data = {
        roomName : roomRandom,
        to : user_id,
        status : "wait"
    }

    const request = new Request('/create/visio', {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'  
        },
        body: JSON.stringify(data)
    })
    
    fetch(request)
        .then(response=>response.json())
        .then(response =>{
            // console.log(response.success == true)
            if(response.success == true){

                fetch("/getVisioByName/"+roomRandom)
                    .then(response=>response.json())
                    .then(visio=>{
                        if(!document.querySelector("#visio").querySelector("iframe")){
                            joinMeet(visio.id, roomRandom)
                        }
                    })
            }
        })
    
}

/**
 * Function creating a group visio
 * @constructor
 */
function createVisioGroup() {

    let friend_list_node = document.querySelectorAll("#amis_list > div > div > div.user_friends")

    let htm = "<div class='overflow-auto' style='max-height:50vh;'><ul class='list-group' id='list-group-user-visio'>"

    friend_list_node.forEach(nd=>{

        htm+=`
            <li class="list-group-item d-flex justify-content-between align-items-center" user_id_visio="${nd.getAttribute("data-toggle-user-id")}">
                <div class="d-flex justify-content-start align-items-center">
                    <img src="${nd.querySelector("img").src}" alt="profile" class="user-pdp-visio">    
                    <span class="ms-1">${nd.querySelector("h5").textContent.trim()}</span>
                </div>
                <span class="rounded-pill text-primary cursor-pointer" onclick="selectOneUser(this)">Inviter</span>
            </li>
        `

    })

    htm+="</ul></div>"

    const { value: accept } = Swal.fire({
        title: 'Réunion par visioconférence',
        input: 'text',
        inputPlaceholder:
          'Entrer le tritre de conférence',
        showCancelButton: true,
        cancelButtonText: 'Pas maintenant',
        confirmButtonText:
          'Créer la conférence <i class="fas fa-arrow-right"></i>',
        inputValidator: (result) => {
          return (result.length < 9 || /[^a-zA-Z0-9]/g.test(result)) && '9 caractères réquis, ni espace ni caractère spéciaux'
        }
        
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
            Swal.fire({
                title: 'Inviter des amis',
                html: htm,
                showCloseButton: true,
                showCancelButton: false,
                focusConfirm: false,
                confirmButtonText:
                  '<i class="fas fa-arrow-right"></i> Démarrer la conférence',
              }).then(res=>{
                if (res.isConfirmed){

                    let roomGroup = result.value

                    if(document.querySelectorAll("#list-group-user-visio > li.selected").length>0){

                        document.querySelectorAll("#list-group-user-visio > li.selected").forEach(li=>{

                            runVisio(roomGroup, li.getAttribute("user_id_visio"))
    
                        })
                    }else{
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Aucun utilisateur sélectionné!',
                            footer: 'Réunion annulée!'
                          })
                    }
                    
                }
              })
        } 
      })
      
    
}

/**
 * Function selecting one or more user to meeting
 * @constructor
 * @param {node} params : li element
 */
function selectOneUser(params) {

    if(params.textContent.trim()=="Inviter"){
        params.textContent = "Annuler"
        params.classList.remove("text-primary")
        params.classList.add("text-danger")
        params.parentElement.style ="background-color:#CFF4FC;"
        params.parentElement.classList.add("selected")
    }else{
        params.textContent = "Inviter"
        params.classList.remove("text-danger")
        params.classList.add("text-primary")
        params.parentElement.style =""
        params.parentElement.classList.remove("selected")

    }
    
}
/***********************Action*************** */


let dico = {
    def_cmz: {
        definition: {
            label: "🌍 Qu'est ce que c'est ConsoMyZone ?",
            response: "ConsoMyZone est une application de consommation de service de votre proximité"
        },
        objectif: {
            label: "✍️ Quel est l'objectif de ConsoMyZone ?",
            response: "L'objectif de CMZ est de fournir facilement des données aux consommateurs"
        },
        vision: {
            label: "🔍 Quelle est la vision de ConsoMyZone ?",
            response: "Aider les consommateurs à créer et entretenir le lien avec les professionnels, où qu'ils se trouvent "
        }
    },
    serv_cmz: {
        tribu: {
            label: "👨‍👨‍👧‍👦 Comment grouper tous les consommateurs ?",
            response: "ConsoMyZone propose de créer votre propre groupe appelé Tribu pour attribuer les consommateurs (clients)"
        },
        message: {
            label: "🖥️ Comment discuter entre consommateur ?",
            response: "ConsoMyZone propose d'envoyer et de discuter avec un client ou consommateur par un message privé"
        },
        api: {
            label: "💹 Comment utiliser les données de ConsoMyZone ?",
            response: "ConsoMyZone possede sa propre API pour collecter leur données afin d'utiliser dans votre propre application"
        }
    },
    use_cmz: {
        resto: {
            label: "🥣 A propos des restaurants chez CMZ ?",
            response: "On a plus de 75000 restaurants integrés dans ConsoMyZone, CMZ vous suggère le restaurant le plus proche"
        },
        ferme: {
            label: "🏕️ A propos des fermes chez CMZ ?",
            response: "On a plus de 6000 fermes qui peut être visiter et afficher"
        },
        station: {
            label: "🚉 A propos des stations chez CMZ ?",
            response: "La liste de station service est presque complet dans ConsoMyZone, qui facilite le consommateur au cas où on a manqué de carburant"
        }
    },
    connect_cmz: {
        membre: {
            label: "👨‍👩‍👦‍👦 Qui peut devenir membre chez ConsoMyZone ?",
            response: "Toutes les personnes qui ont besoin de service plus rapide et plus proche peuvent devenir membre chez CMZ. Vous avez une connexion internet? Alors, vous pouvez devenir membre. Inscrire <a class='link-primary' href='/connexion'>ici</a>."
        },
        pt_fort: {
            label: "💵 Quels sont les avantages pour s'inscrire ?",
            response: "Si vous avez inscrit chez CMZ, vous pouvez discuter avec d'autres personnes qui sont le même quartier de vous. Vous pouvez créer de votre propre groupe de restauration ou ferme avec votre proche et inviter d'autres personnes pour devenir membre."
        }
    },
    noconnect_cmz: {
        recherche: {
            label: "🔍 Comment trouver un restaurant ou ferme ou station ?",
            response: "Pour trouver rapidement quelque chose, je vous invite à chercher une donnée avec une adresse ou une quartier ce que vous voudrez dans un bar de recherche en haut."
        },
        map: {
            label: "🌐 Comment trouver un rubrique dans le map ?",
            response: "Vous pouvez localiser votre appareil pour faciliter la recherche de quelque chose de votre proximité. Ensuite, vous pouvez zoomer ou dezoomer la carte pour voir plus proche le détail de quelque chose."
        }
    }
}

let dico_specifique = {
    "je m'appelle": "Enchanté, je m'appelle ConsoMyZone.",
    "ca va": "👨‍⚕️ Je vais bien, merci.",
    "ca va?": "👨‍⚕️ Je vais bien, merci.",
    "comment ca va?": "👨‍⚕️ Je vais bien, merci.",
    "au revoir": "👋 Merci, à bientôt.",
    "va tu": "👨‍⚕️ Je vais bien, merci.",
    "bye bye": "👋 Merci, à bientôt.",
    "station service": "L'opérateur station-service est en rapport direct avec la clientèle : service en carburant (si station traditionnelle), encaissement des sommes des marchandises ou services vendus sont ses tâches principales. Pour voir plus dans CMZ, veuillez consulter <a class='link-primary' href='/station'> ici</a>.",
    "sp 95": "Le SP95-E10 est l'essence sans plomb qui contient jusqu'à 10% d'éthanol en volume. Le SP95 contient 7,5 % d'éthanol (en pur ou en dérivé). Pour voir plus dans CMZ, veuillez consulter <a class='link-primary' href='/station'> ici</a>.",
}

let dico_response = {
    "slt, salut, cv, cc, coucou, bjr, bonjour": "🤝 Bonjour.",
    "merci": "👍 Je vous en prie.",
    "bye, revoir": "👋 Merci, à bientôt.",
    "bisous, biz": "😘 Bisous.",
    "consomyzone, cmz, conso": "ConsoMyZone est une application de consommation de service de votre proximité.",
    "compte, login, inscrire, connecter, connexion": "Si vous avez déjà un compte, veuillez connecter <a class='link-primary' href='/connexion'>ici</a>. Si vous n'avez pas un compte, je vous propose d'inscrire <a class='link-primary' href='/connexion'>ici</a>, en choisissant le menu inscription.",
    "resto, restaurant, pizza, pizzeria, creperie, repas": "Dans la restauration, on a plusieurs restaurant qui se representent leurs produits dans notre application CMZ. Veuillez consulter <a class='link-primary' href='/restaurant'> ici</a> pour voir plus de restaurants.",
    "ferme, fermier, farm, producteur, agriculture, biologie, fruit, produit, leguime, viande, crêmerie": "Visitez la ferme pour avoir le prix de gros et des produits biologiques et sécuritaires. Veuillez consulter <a class='link-primary' href='/ferme'> ici</a> pour voir plus de fermes.",
    "station, carburant, essence, gazoil, petrole, gazole,sp95, sp98": "Visitez la station service dans notre application CMZ pour trouver la station le plus proche et choisissez le meuilleur prix. Veuillez consulter <a class='link-primary' href='/station'> ici</a> pour voir plus de stations.",
}

let main_suggestion = {
    def_cmz: "📌 C'est quoi ConsoMyZone ou CMZ ?",
    serv_cmz: "♻️ Quelles services chez CMZ ?",
    use_cmz: "🛠️ Nécessaire pour quel CMZ ?",
    connect_cmz: "🏘️ Partie connecté de CMZ ?",
    noconnect_cmz: "💎 Partie non connecté de CMZ ?"
}

let file_extension = {
    sheet : "xlsx",
    document : "docx",
    pdf : "pdf",
    plain : "txt",
    csv :"csv",
    presentation :"pptx",
    html :"html",
    xml : "xml"
}

let image_list = [];

if(document.querySelector("#closevisio")){

    document.querySelector("#closevisio").addEventListener("click", function () {
        endChat()
        document.querySelector("#chat_container").setAttribute("data-type","")
    })
}

if (document.querySelector("#openMessage")) {

    document.querySelector("#openMessage").addEventListener("click", function () {

        openChat()

        document.querySelector("#assist_virt").style = "display:none;"
        document.querySelector(".btn-input-file").style = "display:;cursor:pointer;"
        document.querySelector('#visio').style="display:none"

        document.querySelector("#amis_list").style = "display:block;"

        document.querySelector("#chat_container > div.content-chat.vc-chat.lc-chat.hg-chat.vv-chat.xi-chat.yi-chat.bj-chat.wr-chat > div.nj-chat.xr-chat.ti-chat.bj-chat.wr-chat.sl-chat.ql-chat").style = "display:block;"

        document.querySelector("#chat_container").style = "width: 58vw; height: 82vh; position: fixed; bottom: 0px; z-index: 1003; right: -260px;"

        document.querySelectorAll("div.user_friends").forEach(user => {
            user.style = "display:";
        })

        let first_user = document.querySelectorAll("#amis_list > div > div > div.cg-chat.lc-chat.mg-chat.sh-chat.ol-chat.rl-chat.tq-chat.is-chat.user_friends")[0]

        // let user_id = first_user.getAttribute("data-toggle-user-id")?first_user.getAttribute("data-toggle-user-id") : 0
        let user_id = 0;

        if (first_user) {
            user_id = first_user.getAttribute("data-toggle-user-id")
        } 
        // else {
        //     user_id = 0;
        //     runSpinner()

        //     writeResponse("👋 Bonjour! Je suis l'assistant virtuel de ConsoMyZone.")

        //     runSuggestion()
        // }

        let user_name = first_user == undefined? "" : first_user.querySelector("div:nth-child(2) > h5").textContent.trim()

        let user_photo = first_user == undefined? "" : first_user.querySelector("div.h-chat.mb-chat.sc-chat.yd-chat.of-chat.th-chat > img").src

        document.querySelector("div#user_head").innerHTML = `
                            <div class="ob-chat xc-chat yd-chat pf-chat nh-chat">
                                <div class="h-chat mb-chat sc-chat yd-chat of-chat th-chat">
                                    <img src="${user_photo}" alt="profile" id="profile-user" class="vc-chat yd-chat qk-chat rk-chat"/>
                                    <span class="g-chat l-chat m-chat jc-chat wc-chat ce-chat th-chat pi-chat ij-chat xj-chat"></span>
                                </div>
                            </div>
                            <div class="user-chat-display" data-user-id="${user_id}">
                                <h5 class="un-chat zn-chat gs-chat fw-bold" id="user_name_chat">
                                    ${user_name}
                                </h5>
                            </div>
                            `
        getChat(document.querySelector("div.user-chat-display").getAttribute("data-user-id"))

    })
}

if (document.querySelector("#openChat")) {

    document.querySelector("#openChat").addEventListener("click", function () {

        openChat()

        document.querySelector("#assist_virt").style = "display:;"
        document.querySelector(".btn-input-file").style = "display:none;"
        document.querySelector('#visio').style="display:none"

        document.querySelector("#amis_list").style = "display:none;"

        document.querySelector("#chat_container").style = "width: 58vw; height: 82vh; position: fixed; bottom: 0px; z-index: 1003; right: -33% !important;"

        document.querySelectorAll("div.user_friends").forEach(user => {
            user.style = "display:none";
        })

        document.querySelector("div#user_head").innerHTML = `
                            <div class="ob-chat xc-chat yd-chat pf-chat nh-chat">
                                <div class="h-chat mb-chat sc-chat yd-chat of-chat th-chat">
                                    <img src="https://www.iconpacks.net/icons/1/free-help-icon-1160-thumb.png" alt="profile" id="profile-user" class="vc-chat yd-chat qk-chat rk-chat"/>
                                    <span class="g-chat l-chat m-chat jc-chat wc-chat ce-chat th-chat pi-chat ij-chat xj-chat"></span>
                                </div>
                            </div>
                            <div class="user-chat-display" data-user-id="0">
                                <h5 class="un-chat zn-chat gs-chat fw-bold" id="user_name_chat">
                                    Assistant Virtuel
                                </h5>
                                <p class="mn-chat">Reponse automatique</p>
                            </div>
                            `

        if (document.querySelector("div.user-chat-display").getAttribute("data-user-id") == "0") {

            runSpinner()

            writeResponse("👋 Bonjour! Je suis l'assistant virtuel de ConsoMyZone.")

            runSuggestion()

        } else {

            getChat(document.querySelector("div.user-chat-display").getAttribute("data-user-id"))

        }

    })
}

if (document.querySelector("#openVisio")) {
    

    document.querySelector("#openVisio").addEventListener("click", function () {

        openChat()

        document.querySelector("#chat_container").classList.add("chat_container_visio")
        document.querySelector("#chat_container > div.content-chat.vc-chat.lc-chat.hg-chat.vv-chat.xi-chat.yi-chat.bj-chat.wr-chat").classList.add("content_chat_visio")
        document.querySelector("#amis_list > div").classList.add("chat_friend_visio")

        document.querySelector("#visio_group_btn").style = "display:;"

        document.querySelector("#assist_virt").style = "display:none;"
        document.querySelector(".btn-input-file").style = "display:;cursor:pointer;"

        document.querySelector('#conversation').style ="display:none"

        document.querySelector('#closeChat').style ="display:none"
        document.querySelector('#closevisio').style ="display:"

        document.querySelector("#chat_container").setAttribute("data-type","visio")

        document.querySelector("#chat_container > div.content-chat.vc-chat.lc-chat.hg-chat.vv-chat.xi-chat.yi-chat.bj-chat.wr-chat > div.nj-chat.xr-chat.ti-chat.bj-chat.wr-chat.sl-chat.ql-chat").style ="display:none;"

        document.querySelectorAll("div.user_friends").forEach(user => {
            user.style = "display:";
        })

        document.querySelector("div#user_head").innerHTML = `
                            <div class="d-flex p-1 ps-0">
                                <div">
                                    <i class="fas fa-video-camera" style="margin-top: 15%;font-size:27px;color:red;"></i>
                                </div>
                            </div>
                            <div class="user-chat-display p-2" data-user-id="">
                                <h5 class="un-chat zn-chat gs-chat fw-bold" id="user_name_chat">
                                VisioConférence
                                </h5>
                            </div>
                            `;
        // document.querySelector('#conversation').innerHTML = ""

        document.querySelector('#visio').style="display:block"

        let my_id = document.querySelector("#amis_list").getAttribute("data-my-id")

        const evtSource_meet = new EventSource("/get/myvisio");

        //// event onmessage
        evtSource_meet.onmessage = function (event) {

            const all_meet = JSON.parse(event.data);

            const last_meet = all_meet[all_meet.length-1]

            if(all_meet.length>0){

                all_meet.forEach(meet => {

                    if(!document.querySelector('.meet_'+meet.id)){
    
                        let stat = "manqué"
                        let color = ""
                        let btn_join = ""
                        switch(meet.status) {
                            case 'wait':
                                stat = `en attente...`
                                color = 'info'
                                btn_join = `<span onclick="joinMeet(${meet.id},'${meet.nom}')" class='float-end badge text-bg-primary text-white cursor-pointer p-2'>Joindre</span>`
                              break;
                            case 'progress':
                                stat = `en cours`
                                color = 'warning'
                                btn_join = `<span onclick="joinMeet(${meet.id},'${meet.nom}')" class='float-end badge text-bg-info text-white cursor-pointer p-2'>Ouvrir</span>`
                              break;
                            case 'finished':
                                stat = `términé`
                                color = 'success'
                              break;
                            case 'missed':
                                stat = `manqué`
                                color = 'danger'
                              break;
                            default:
                                stat = "manqué"
                          }
    
                        if(!document.querySelector("#visio > iframe")){
    
                            document.querySelector("#visio").innerHTML += `<div class="qf m-2 meet_${meet.id}">
                                <p class="qb-chat mn un mt-4">
                                    ${my_id==meet.from?meet.username +"(vous)" : meet.username}
                                </p>
                                <div class="qb-chat vh-chat hi-chat vj-chat yr-chat el-chat yl-chat">
                                <p class="text-${color} mb-2">
                                    <i class="fas fa-video-camera me-2 ms-1"></i>
                                    ${meet.users_number > 1? "Réunion" : "Appel"} ${stat}
                                    ${btn_join}
                                </p> 
                                </div>
                                <p class="nn-chat float-end">${meet.date}</p>
                            </div>`
                        }
    
                    }
                    
                })
    
                if(last_meet && !document.querySelector("#visio > iframe")){
                    document.querySelector(".meet_"+last_meet.id).scrollIntoView();
                }
            }else{
                document.querySelector("#visio").innerHTML ="<div class='m-4'><p class='text-center'>Aucune visioconférence a été notée.</p></div>";
            }

        }

    })
}

document.querySelector("#closeChat").addEventListener("click", function () {

    closeChat()

})

document.querySelector("#text-search").addEventListener("keyup", function (e) {

    if (e.key === 'Enter' || e.keyCode === 13) {

        if (document.querySelector("div.user-chat-display").getAttribute("data-user-id") == 0) {
            if (e.target.value) {

                searchResultKey(e.target.value)

            }
        } else {
            //console.log("send message user");

            sendChat(e.target.value, image_list, document.querySelector("div.user-chat-display").getAttribute("data-user-id"))
        }


        e.target.value = ""

    }

})

document.querySelector("#btn-send").addEventListener("click", function (e) {

    if (document.querySelector("div.user-chat-display").getAttribute("data-user-id") == 0) {

        if (document.querySelector("#text-search").value) {

            searchResultKey(document.querySelector("#text-search").value)

        }

    } else {

        //console.log("send message user");

        sendChat(document.querySelector("#text-search").value, image_list, document.querySelector("div.user-chat-display").getAttribute("data-user-id"))

    }

    document.querySelector("#text-search").value = ""

})


function removeToList(params) {
    params.parentElement.remove()
}

document.querySelectorAll("div.cg-chat").forEach(amis => {

    amis.addEventListener("click", function (e) {

        //Assistant virtuel and messagerie container

        if(document.querySelector("#chat_container").getAttribute("data-type") != "visio"){

            document.querySelector("#conversation").innerHTML = ""

            document.querySelector(".content_image_input_js_jheo").innerHTML = ""
    
            document.querySelector(".content_image_input_js_jheo_file_name").innerHTML = ""
    
            image_list = [];
            
            let user_name = e.target.textContent.trim()
    
            //let user_id = amis.getAttribute("data-toggle-user-id")
    
            document.querySelector("#user_name_chat").innerText = user_name
    
            if (user_name != "Assistant Virtuel") {
    
                document.querySelector("#profile-user").src = amis.querySelector("img").src
                document.querySelector(".mn-chat").style.display = "none"
    
                document.querySelector("div.user-chat-display").setAttribute("data-user-id", amis.getAttribute("data-toggle-user-id"))
    
                // get message from other user
    
                getChat(document.querySelector("div.user-chat-display").getAttribute("data-user-id"))
    
                checkNewMessage(document.querySelector("div.user-chat-display").getAttribute("data-user-id"))
    
                document.querySelector(".btn-input-file").style = "cursor:pointer;"
    
            } else {
    
                document.querySelector("#profile-user").src = "https://www.iconpacks.net/icons/1/free-help-icon-1160-thumb.png"
    
                document.querySelector(".user-chat-display").innerHTML = `
                        <h5 class="un-chat zn-chat gs-chat" id="user_name_chat">
                            Assistant Virtuel
                        </h5>
                        <p class="mn-chat">Reponse automatique</p>`
    
                document.querySelector("div.user-chat-display").setAttribute("data-user-id", "0")
    
                document.querySelector(".btn-input-file").style = "cursor:not-allowed;"
    
                runSpinner()
    
                writeResponse("👋 Bonjour! Je suis l'assistant virtuel de ConsoMyZone.")
    
                runSuggestion()
    
            }

        // Visio conference container

        }else{

            let roomRandom = "Meet"+generateUID() + document.querySelector("#amis_list").getAttribute("data-my-id")

            runVisio(roomRandom, amis.getAttribute("data-toggle-user-id"))

        }

    })
})


/** Upload image */

 ///read file

document.querySelector("#input-image").addEventListener("change", (e) => {

    ////on load file
    const reader = new FileReader();

    reader.addEventListener("load", () => {

        /// file as url
        const uploaded_image = reader.result;

        ///let get multiple images (files)

        image_list.push({
            name : reader.result,
            type : "image"
        });

        //// for the content image above the input message
        const img = document.createElement("img")
        img.src = uploaded_image
        img.style = "width:100px;height:100px;"
        img.setAttribute("alt", "Image upload")
        document.querySelector(".content_image_input_js_jheo").style.display = "flex"

        const parentImage = document.querySelector(".content_image_input_js_jheo")

        //// add in the first the new image upload
        if (parentImage.querySelector("img")) {
            parentImage.insertBefore(img, parentImage.querySelector("img"))
        } else {
            document.querySelector(".content_image_input_js_jheo").appendChild(img)
        }

    });

    ///run event load in file reader.
    reader.readAsDataURL(e.target.files[0]);

})

/** Upload document */

document.querySelector("#input-file").addEventListener("change", (e) => {

    ///read file
    const reader_doc = new FileReader();

    ////on load file
    reader_doc.addEventListener("load", () => {

        ///let get multiple images (files)
        image_list.push({
            name : reader_doc.result,
            type : "file"
        });

        const file_name = document.createElement("li")
        file_name.innerHTML = e.target.files[0].name

        //document.querySelector(".content_image_input_js_jheo").style.display = "flex"

        document.querySelector(".content_image_input_js_jheo_file_name").appendChild(file_name)

    });

    ///run event load in file reader.
    reader_doc.readAsDataURL(e.target.files[0]);

})
