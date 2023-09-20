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

    document.querySelector('#closeChat').style = "display:"
    document.querySelector('#closevisio').style = "display:none"

    document.querySelector("#chat_header").style = "display:none;"
    document.querySelector("#amis_list").style = "display:none;"
    document.querySelector("#visio_group_btn").style = "display:none"


    if (document.querySelector("div.user-chat-display").getAttribute("data-user-id") == "0" && document.querySelector("#amis_list").getAttribute("data-my-id") == "0") {

        document.querySelector("#amis_list").setAttribute("data-my-id", "0")

    }

    if (document.querySelector("#chat_container").getAttribute("data-type") == "visio") {

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
                <p>Comment puis-je vous aider ?</p>
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

        if (value.question) {

            Object.entries(value.question).forEach(([key2, value2]) => {

                Object.entries(value2).forEach(([key3, value3]) => {
                    if (cle == key3) {

                        writeRequest(value3.label)

                        runSpinner()

                        writeResponse(value3.response, true)
                    }

                })

            })
        }
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

            if (value.response) {

                writeResponse(value.response)

            }

            if (value.question) {

                if (value.question.length > 0) {

                    template += `<div class="qf-chat disc_${timestamp}">
                                <div class="qb-chat vh-chat hi-chat vj-chat yr-chat el-chat yl-chat">
                                    <p> Comment puis-je vous aider ?</p>
                                    <div class="text-center">`

                    for (let question of value.question) {
                        if (typeof question === 'object') {

                            Object.entries(question).forEach(([key2, value2]) => {

                                template += `<button class="ad-chat lc-chat mg-chat pg-chat th-chat ni-chat bj-chat wr-chat nj-chat yr-chat oq-chat qq-chat _q-chat ks-chat w-100 mb-1 h-100 p-1" cle="${key2}" onclick="findInDict(this)">
                                    ${value2.label}
                                </button>`

                            });

                        }
                    }

                    template += `</div>
                                        </div>
                                        <p class="nn-chat">${date_now}</p>
                                    </div>`

                }
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

function sendChat(message, files = [], user_id) {

    let data = {
        from: document.querySelector("#amis_list").getAttribute("data-my-id"),
        to: user_id,
        message: message,
        files: files
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

                            let ext = getExtension(file.split(".")[file.split(".").length - 1])

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

                            let ext = getExtension(file.split(".")[file.split(".").length - 1])

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
        if (key == params) {
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

    fetch("/update/visio/" + id + "/" + status, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "POST",
    })
}


/**
 * Function updating a status of visio
 * @constructor
 * @param {string} name 
 * @param {string} status 
 */
function setStatusMeetByName(roomname, status) {

    fetch("/getVisioByName/" + roomname)
        .then(response => response.json())
        .then(visios => {

            if (visios.length > 0) {

                for (let visio of visios) {

                    setStatusMeetById(visio.id, status)

                }
            }

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

let user_name = document.querySelector("#my_full_name") ? document.querySelector("#my_full_name").textContent.trim() : document.querySelector("span.jc.un.mn.zn.gs.use-in-agd-nanta_js_css")? document.querySelector("span.jc.un.mn.zn.gs.use-in-agd-nanta_js_css").textContent.trim() : ""

/**
 * Function joining a meeting jitsi
 * @constructor
 * @param {integer} id : id of meet
 * @param {string} room : roomname of meet
 * @param {node} nodeElement : node of button of meeting
 */
function joinMeet(...args) {

    let room = args[0]
    let parentNodeId = args[1]
    
    // let user_name = document.querySelector("#my_full_name").textContent.trim()

    if(document.querySelector("#visioMessageElie")){
        $("#visioMessageElie").modal("show")
    }

    if (document.querySelector('#'+parentNodeId).querySelector("iframe")) {
        document.querySelector('#'+parentNodeId).querySelector("iframe").remove()
    }

    const options = {
        roomName: home_room + room,
        width: "100%",
        height: "95%",
        lang: 'fr',
        jwt: jwt,
        configOverwrite: { prejoinPageEnabled: false },
        // configOverwrite: { prejoinPageEnabled: false , enableClosePage: false, toolbarButtons : ['microphone', 'camera','tileview','fullscreen', 'desktop', 'closedcaptions','participants-pane','hangup']},
        interfaceConfigOverwrite: { VERTICAL_FILMSTRIP: true },
        parentNode: document.querySelector('#'+parentNodeId),
    };

    let api = new JitsiMeetExternalAPI(domain, options);

    api.executeCommand('displayName', user_name);

    setStatusMeetByName(room, "progress")

    const iframe = api.getIFrame();

    iframe.scrollIntoView();

    api.on('readyToClose', () => {

        setStatusMeetByName(room, "finished")
        
        //document.querySelector('#'+parentNodeId).innerHTML = ""
        
        const currentUrl = window.location.href;

        if(currentUrl.includes("user/message")){

            $("#visioMessageElie").modal("hide")

            let node = ""
            let message_id = 0;

            let content = `<div class="qb-chat vh-chat hi-chat vj-chat yr-chat el-chat yl-chat">
                <p class="text-success mb-2">
                <i class="fas fa-video-camera me-2 ms-1"></i>
                Appel términé
                </p> 
            </div>`

            if(args[2]){
                node = args[2]
                message_id = node.parentElement.parentElement.parentElement.parentElement.getAttribute("id").replaceAll(/[^0-9]/g,"");
                node.parentElement.parentElement.parentElement.parentElement.innerHTML = content
            }

            let msg = {
                text : content,
                imagges :[],
                files :[]
            }
            
            fetch('/update/oneMessage/'+message_id, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(msg)
            }).then(response=>response.json())
            .then(res=>{
                console.log(res);
            })

            if (document.querySelector('#'+parentNodeId).querySelector("iframe")) {
                document.querySelector('#'+parentNodeId).querySelector("iframe").remove()
            }
        }else{
            document.querySelector('#'+parentNodeId).innerHTML = ""
        }
        

        if(document.querySelector("#user_name_chat")){
            document.querySelector("#user_name_chat").innerText = "VisioConférence"
        }
        if(document.querySelector("#visioMessageElieLabel")){
            document.querySelector("#visioMessageElieLabel").innerText = "VisioConférence"
        }
    })

    api.addEventListener('participantJoined', (e) => {

        if(document.querySelector("#user_name_chat")){

            if (!document.querySelector("#user_name_chat").textContent.trim().includes(e.displayName)) {

                document.querySelector("#user_name_chat").innerText = document.querySelector("#user_name_chat").textContent.trim().replace("VisioConférence", "Vous") + ", " + e.displayName
            }
            
        }
        if(document.querySelector("#visioMessageElieLabel")){

            if (!document.querySelector("#visioMessageElieLabel").textContent.trim().includes(e.displayName)) {

                document.querySelector("#visioMessageElieLabel").innerText = document.querySelector("#visioMessageElieLabel").textContent.trim().replace("VisioConférence", "Vous") + ", " + e.displayName
            }
        }
        

    })

}


/**
 * Function creating a meeting jitsi
 * @constructor
 * @param {string} roomRandom : name of room
 * @param {integer} user_id : user_id of user
 */
function runVisio(roomRandom, user_id, parentNodeId) {

    document.querySelector("#"+parentNodeId).innerHTML += `<div class="d-flex justify-content-center mt-5 chargement-visio">
        <div class="containt">
            <div class="word word-1">C</div>
            <div class="word word-2">M</div>
            <div class="word word-3">Z</div>
        </div>
    </div>
    `   

    let data = {
        roomName: roomRandom,
        to: user_id,
        status: "wait"
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
        .then(response => response.json())
        .then(response => {
            // console.log(response.success == true)
            if (response.success == true) {

                fetch("/getVisioByName/" + roomRandom)
                    .then(response => response.json())
                    .then(visio => {
                        if (!document.querySelector('#'+parentNodeId).querySelector("iframe")) {
                            document.querySelector(".chargement-visio").remove()
                            joinMeet(roomRandom, parentNodeId, this)

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

    friend_list_node.forEach(nd => {

        htm += `
            <li class="list-group-item d-flex justify-content-between align-items-center" user_id_visio="${nd.getAttribute("data-toggle-user-id")}">
                <div class="d-flex justify-content-start align-items-center">
                    <img src="${nd.querySelector("img").src}" alt="profile" class="user-pdp-visio">    
                    <span class="ms-1">${nd.querySelector("h5").textContent.trim()}</span>
                </div>
                <span class="rounded-pill text-primary cursor-pointer" onclick="selectOneUser(this)">Inviter</span>
            </li>
        `

    })

    htm += "</ul></div>"

    if(friend_list_node.length <= 0){
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Aucun utilisateur connecté pour le moment!',
            footer: 'Réunion annulée!'
        })
        
    }else{

        Swal.fire({
            title: 'Inviter des amis',
            html: htm,
            showCloseButton: true,
            showCancelButton: true,
            focusConfirm: false,
            confirmButtonText:
                '<i class="fas fa-arrow-right"></i> Démarrer la conférence',
            cancelButtonText:
                '<i class="fas fa-close"></i> Pas maintenant',
        }).then(res => {
            if (res.isConfirmed) {
    
                let roomGroup = "Meet" + generateUID() + document.querySelector("#amis_list").getAttribute("data-my-id")
    
                
                    if (document.querySelectorAll("#list-group-user-visio > li.selected").length > 0) {
    
                        document.querySelectorAll("#list-group-user-visio > li.selected").forEach(li => {
        
                            runVisio(roomGroup, li.getAttribute("user_id_visio"), 'visio')
        
                        })
                    } else {
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

}


/**
 * Function creating a group visio
 * @constructor
 */
function createVisioGroupFromMessage() {

    let div = document.querySelector("div.user_profile_list_elie")

    let div_tribuG = div.querySelector(".content_list_tribuG_jheo_js")
    let div_tribuT = div.querySelector(".content_list_tribuT_jheo_js")

    let final_div = div_tribuT.outerHTML.replaceAll("ID_","ID_elie_")

    final_div = final_div.replaceAll("content_list_tribuT_jheo_js", "content_list_tribuT_elie_js d-none")
    final_div = final_div.replaceAll("yd", "")

    let friend_list_node_tribuG = document.querySelectorAll("div.content_list_tribuG_jheo_js > div.content-message-nanta-css")
    let friend_list_node_tribuT = div_tribuT.querySelectorAll("ul > div.content-message-nanta-css")

    let tabs = `
        <ul class="nav nav-tabs user-tabs-profile-elie">
        <li class="nav-item">
            <a class="nav-link _t_g active" aria-current="page" href="#">Tribu G</a>
        </li>
        <li class="nav-item">
            <a class="nav-link _t_t" href="#">Tribu T</a>
        </li>
        </ul>
        `

    let htm = tabs + "<div class='overflow-auto mt-2' style='max-height:50vh;'><ul class='list-group' id='list-group-user-visio'>"

    friend_list_node_tribuG.forEach(nd => {

        htm += `
            <li class="list-group-item d-flex justify-content-between align-items-center user_t_g" user_id_visio="${nd.getAttribute("data-toggle-user-id")}">
                <div class="d-flex justify-content-start align-items-center">
                    <img src="${nd.querySelector("img").src}" alt="profile" class="user-pdp-visio">    
                    <span class="ms-1">${nd.querySelector("h5").textContent.trim()}</span>
                </div>
                <span class="rounded-pill text-primary cursor-pointer" onclick="selectOneUser(this)">Inviter</span>
            </li>
        `

    })

    
    htm += "</ul></div>"

    htm +=final_div

    Swal.fire({
        title: 'Inviter des amis',
        html: htm,
        showCloseButton: true,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText:
            '<i class="fas fa-arrow-right"></i> Démarrer la conférence',
        cancelButtonText:
            '<i class="fas fa-close"></i> Pas maintenant',
    }).then(res => {
        if (res.isConfirmed) {

            // let roomGroup = "Meet" + generateUID() + document.querySelector("#amis_list").getAttribute("data-my-id")
            let roomGroup = "Meet" + generateUID() + document.querySelector(".my-profile-id-elie").getAttribute("data-my-id")
            
            let msg_txt = `<div class="qb-chat vh-chat hi-chat vj-chat yr-chat el-chat yl-chat">
            <p class="text-info mb-2">
                <i class="fas fa-video-camera me-2 ms-1"></i>
                Appel en attente...
                <span onclick="joinMeet('${roomGroup}', 'bodyVisioMessageElie', this)" class="float-end badge text-bg-primary text-white cursor-pointer p-2">Joindre</span>
            </p> 
            </div>`

            
            if (document.querySelectorAll(".elie-user-selected").length > 0) {

                let unique = [];

                document.querySelectorAll(".elie-user-selected").forEach(li => {

                    let to_user = li.getAttribute("user_id_visio")

                    if (!unique.includes(to_user)) {
                        unique.push(to_user);
                    }
                   
                })

                for(let user_id of unique){
                    fetch("/user/push/message", {
                        method: "POST",
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify( {
                
                            /// current connecter
                            from: document.querySelector(".content_image_input_jheo_js").getAttribute("data-toggle-userfrom-id"),
                            
                            /// user to talk
                            to: user_id,
                
                            ///message content
                            message: msg_txt.replace("\n", ""),
                            files: []
                        })
                    }).then(response=>response.json())
                    .then(res=>console.log(res))

                    document.querySelector("#bodyVisioMessageElie").innerHTML =""
    
                    runVisio(roomGroup, user_id, 'bodyVisioMessageElie')
                }

            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Aucun utilisateur sélectionné!',
                    footer: 'Réunion annulée!'
                })
            }

        }
    })

    document.querySelectorAll("ul.user-tabs-profile-elie > li").forEach(li=>{
        
        li.addEventListener("click",function(e){
            document.querySelectorAll("ul.user-tabs-profile-elie > li > a").forEach(a=>{
                a.classList.remove("active")
            })
            e.target.classList.add("active")

            document.querySelector(".content_list_tribuT_elie_js").querySelectorAll("a").forEach(a=>{
                a.href = "#"
                if(a.parentElement.querySelector("span")){
                    a.parentElement.querySelector("span").remove()
                }
            })

            if(e.target.classList.contains("_t_g")){

                document.querySelector(".content_list_tribuT_elie_js").classList.add("d-none")

                document.querySelectorAll(".user_t_g").forEach(user=>{
                    user.style ="display:flex !important"
                })

            }else{
                document.querySelectorAll(".user_t_g").forEach(user=>{
                    user.style ="display:none !important"
                })
                document.querySelector(".content_list_tribuT_elie_js").classList.remove("d-none")

                document.querySelector(".content_list_tribuT_elie_js").querySelectorAll("a").forEach(a=>{
                    if(a.querySelector("p")) a.querySelector("p").remove()

                    let span = document.createElement("span")
                    span.classList = "rounded-pill text-primary cursor-pointer ms-auto"
                    span.setAttribute("onclick","selectOneUser(this)")
                    span.textContent = "Inviter"
                    a.previousElementSibling.parentElement.appendChild(span)

                    a.parentElement.classList = "cg lc mg sh ol rl tq is content-message-nanta-css d-flex align-items-center"

                    a.parentElement.querySelector("img").classList = "user-pdp-visio"
                    
                })

            }
        })
    })

}

/**
 * Function selecting one or more user to meeting
 * @constructor
 * @param {node} params : li element
 */
function selectOneUser(params) {

    if (params.textContent.trim() == "Inviter") {
        params.textContent = "Annuler"
        params.classList.remove("text-primary")
        params.classList.add("text-danger")
        params.parentElement.style = "background-color:#CFF4FC;"
        params.parentElement.classList.add("elie-user-selected")
    } else {
        params.textContent = "Inviter"
        params.classList.remove("text-danger")
        params.classList.add("text-primary")
        params.parentElement.style = ""
        params.parentElement.classList.remove("elie-user-selected")

    }

}

/***********************Action*************** */


// let dico = {
//     def_cmz: {
//         definition: {
//             label: "🌍 Qu'est ce que c'est ConsoMyZone ?",
//             response: "ConsoMyZone est une application de consommation de service de votre proximité"
//         },
//         objectif: {
//             label: "✍️ Quel est l'objectif de ConsoMyZone ?",
//             response: "L'objectif de CMZ est de fournir facilement des données aux consommateurs"
//         },
//         vision: {
//             label: "🔍 Quelle est la vision de ConsoMyZone ?",
//             response: "Aider les consommateurs à créer et entretenir le lien avec les professionnels, où qu'ils se trouvent "
//         }
//     },
//     serv_cmz: {
//         tribu: {
//             label: "👨‍👨‍👧‍👦 Comment grouper tous les consommateurs ?",
//             response: "ConsoMyZone propose de créer votre propre groupe appelé Tribu pour attribuer les consommateurs (clients)"
//         },
//         message: {
//             label: "🖥️ Comment discuter entre consommateur ?",
//             response: "ConsoMyZone propose d'envoyer et de discuter avec un client ou consommateur par un message privé"
//         },
//         api: {
//             label: "💹 Comment utiliser les données de ConsoMyZone ?",
//             response: "ConsoMyZone possede sa propre API pour collecter leur données afin d'utiliser dans votre propre application"
//         }
//     },
//     use_cmz: {
//         resto: {
//             label: "🥣 A propos des restaurants chez CMZ ?",
//             response: "On a plus de 75000 restaurants integrés dans ConsoMyZone, CMZ vous suggère le restaurant le plus proche"
//         },
//         ferme: {
//             label: "🏕️ A propos des fermes chez CMZ ?",
//             response: "On a plus de 6000 fermes qui peut être visiter et afficher"
//         },
//         station: {
//             label: "🚉 A propos des stations chez CMZ ?",
//             response: "La liste de station service est presque complet dans ConsoMyZone, qui facilite le consommateur au cas où on a manqué de carburant"
//         }
//     },
//     connect_cmz: {
//         membre: {
//             label: "👨‍👩‍👦‍👦 Qui peut devenir membre chez ConsoMyZone ?",
//             response: "Toutes les personnes qui ont besoin de service plus rapide et plus proche peuvent devenir membre chez CMZ. Vous avez une connexion internet? Alors, vous pouvez devenir membre. Inscrire <a class='link-primary' href='/connexion'>ici</a>."
//         },
//         pt_fort: {
//             label: "💵 Quels sont les avantages pour s'inscrire ?",
//             response: "Si vous avez inscrit chez CMZ, vous pouvez discuter avec d'autres personnes qui sont le même quartier de vous. Vous pouvez créer de votre propre groupe de restauration ou ferme avec votre proche et inviter d'autres personnes pour devenir membre."
//         }
//     },
//     noconnect_cmz: {
//         recherche: {
//             label: "🔍 Comment trouver un restaurant ou ferme ou station ?",
//             response: "Pour trouver rapidement quelque chose, je vous invite à chercher une donnée avec une adresse ou une quartier ce que vous voudrez dans un bar de recherche en haut."
//         },
//         map: {
//             label: "🌐 Comment trouver un rubrique dans le map ?",
//             response: "Vous pouvez localiser votre appareil pour faciliter la recherche de quelque chose de votre proximité. Ensuite, vous pouvez zoomer ou dezoomer la carte pour voir plus proche le détail de quelque chose."
//         }
//     }
// }

let dico = {
    definition: {
        label: "Qu'est ce que ConsoMyZone ou CMZ pour les intimes ?",
        response: "ConsoMyZone est une application qui vous aidera à consommer bien et bon près de chez vous.",
        question: [
            {
                description: {
                    label: "Comment ConsoMyZone peut vous aidez à consommer bien et bon?",
                    response: "L'application embarque une carte interactive qui vous donne des informations bien qualifiées et mise à jour sur les restaurants," +
                        "les golfs, les fermes, les stations et bien d'autres encore à venir, et vous donne aussi la possibilité de noter et de donner votre avis."
                }
            }
        ]
    },
    FAQ: {
        label: "Section FAQ?",
        question: [
            {
                f1: {
                    label: "ConsoMyZone, a-t-il une partie connectée?",
                    response: "Oui, ConsoMyZone invoque la notion de tribu dans ses parties connectées."
                }
            },
            {
                f2: {
                    label: "C'est quoi une tribu-G?",
                    response: "Une tribu-G, est une tribu géographique (G pour géographie), qui regroupe tous les partisans qui habitent dans la même commune." +
                        "Vous serez assigné à un tribu-G lors de votre inscription."
                }
            },
            {
                f3: {
                    label: "Comment on vous assigne-t-on à une tribu-G ?",
                    response: "Lors de votre inscription, vous serez amené à choisir votre commune, et cette commune que vous auriez choisis deviendra votre tribu-G."
                }
            },
            {
                f4: {
                    label: "C'est quoi une tribu-T?",
                    response: "Une tribu-T, est une tribu thématique (T pour thématique). Contrairement aux tribus-g, elle n'est pas assignée automatiquement," +
                        "mais vous devriez la créer, l'animé, et chercher et inviter des partisans qui auront la même passion que vous à propos du thème de votre tribu-T."
                }
            },
            {
                f5: {
                    label: "C'est quoi un fondateur ou fondatrice d'une tribu-G ?",
                    response: "C'est le partisan, qui aura été le premier a s'inscrire sur ConsoMyZone dans sa commune."
                }
            },
            {
                f6: {
                    label: "Quels sont les rôles d'un fondateur ou fondatrice ?",
                    response: "Votre rôle sera d'animer la tribu et de veiller au bon déroulement des événements de la tribu, pour que tout le monde se sente en sécurité et soit à l'aise."
                }
            },
            {
                f7: {
                    label: "Est ce que je peux abandonner mon rôle de fondateur.",
                    response: "Oui, bien sûr"
                }
            },
            {
                f8: {
                    label: "Que peut-on faire dans la partie connectée ?",
                    response: "Vous pouvez partager vos pensées, des photos, créer des tribus-T, parlez avec d'autres partisans ," +
                        "faire des appels vidéo ou vocal avec la messagerie de ConsoMyzone et gérer votre agenda et aussi le partager."

                }
            }

        ]
    },
    sessions: {
        label: "Comment gère-t-on vos données clients ?",
        response: "Nous utilisons des sessions storages, pour stocker vos habitudes sur la carte ConsoMyzone  comme le niveau de zoom, dernier emplacement sur la carte," +
            "pour vous donnez une meilleure expérience quand vous parcourez la carte."

    }
}


let dico_specifique = {
    "je m'appelle": "Enchanté et bienvenu sur l'application ConsoMyzone. Comment puis-je vous aider ? ",
    "ça va": "L'équipe ConsoMyzone se porte merveilleusement bien, nous tenons à vous souhaiter une très bonne santé. Comment puis-je vous aider ?",
    "ça va?": "L'équipe ConsoMyzone se porte merveilleusement bien, nous tenons à vous souhaiter une très bonne santé. Comment puis-je vous aider ?",
    "comment ça va?": "L'équipe ConsoMyzone se porte merveilleusement bien, nous tenons à vous souhaiter une très bonne santé. Comment puis-je vous aider ?",


}

let dico_response = {
    "slt, salut, cv, cc, coucou, bjr, bonjour": "Bonjour, comment puis-je vous aider ?",
    "merci": "L'équipe ConsoMyzone vous remercie de l'intêret que vous portiez à l'application. Comment puis-je vous aider ?",
    "bye, au revoir": "L'équipe ConsoMyzone vous remercie de l'intêret que vous portiez à l'application. Comment puis-je vous aider ?",
    "bisous, biz": "L'équipe ConsoMyzone vous remercie de l'intêret que vous portiez à l'application. Comment puis-je vous aider ?",

}

let main_suggestion = {
    definition: "Qu'est ce que ConsoMyZone ou CMZ pour les intimes ?",
    FAQ: "Section FAQ ?",
    sessions: "Comment gère-t-on vos données clients ?"

}

let file_extension = {
    sheet: "xlsx",
    document: "docx",
    pdf: "pdf",
    plain: "txt",
    csv: "csv",
    presentation: "pptx",
    html: "html",
    xml: "xml"
}

let image_list = [];

if (document.querySelector("#closevisio")) {

    document.querySelector("#closevisio").addEventListener("click", function () {
        endChat()
        document.querySelector("#chat_container").setAttribute("data-type", "")
    })
}

if (document.querySelector("#openMessage")) {

    document.querySelector("#openMessage").addEventListener("click", function () {

        openChat()

        document.querySelector("#assist_virt").style = "display:none;"
        document.querySelector(".btn-input-file").style = "display:;cursor:pointer;"
        document.querySelector('#visio').style = "display:none"

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

        let user_name = (first_user === undefined) ? "" : first_user.querySelector("div:nth-child(2) > h5").textContent.trim()

        let user_photo = (first_user === undefined) ? "" : first_user.querySelector("div.h-chat.mb-chat.sc-chat.yd-chat.of-chat.th-chat > img").src

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
        document.querySelector('#visio').style = "display:none"

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

        document.querySelector('#conversation').style = "display:none"

        document.querySelector('#closeChat').style = "display:none"
        document.querySelector('#closevisio').style = "display:"

        document.querySelector("#chat_container").setAttribute("data-type", "visio")

        document.querySelector("#chat_container > div.content-chat.vc-chat.lc-chat.hg-chat.vv-chat.xi-chat.yi-chat.bj-chat.wr-chat > div.nj-chat.xr-chat.ti-chat.bj-chat.wr-chat.sl-chat.ql-chat").style = "display:none;"

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

        document.querySelector('#visio').style = "display:block"

        let my_id = document.querySelector("#amis_list").getAttribute("data-my-id")

        const evtSource_meet = new EventSource("/get/myvisio");

        //// event onmessage
        evtSource_meet.onmessage = function (event) {

            const all_meet = JSON.parse(event.data);

            const last_meet = all_meet[all_meet.length - 1]

            if (all_meet.length > 0) {

                all_meet.forEach(meet => {

                    if (!document.querySelector('.meet_' + meet.id)) {

                        let stat = "manqué"
                        let color = ""
                        let btn_join = ""
                        switch (meet.status) {
                            case 'wait':
                                stat = `en attente...`
                                color = 'info'
                                btn_join = `<span onclick="joinMeet('${meet.nom}', 'visio')" class='float-end badge text-bg-primary text-white cursor-pointer p-2'>Joindre</span>`
                                break;
                            case 'progress':
                                stat = `en cours`
                                color = 'warning'
                                btn_join = `<span onclick="joinMeet('${meet.nom}', 'visio')" class='float-end badge text-bg-info text-white cursor-pointer p-2'>Ouvrir</span>`
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

                        if (!document.querySelector("#visio > iframe")) {

                            document.querySelector("#visio").innerHTML += `<div class="qf m-2 meet_${meet.id}">
                                <p class="qb-chat mn un mt-4">
                                    ${my_id == meet.from ? meet.username + "(vous)" : meet.username}
                                </p>
                                <div class="qb-chat vh-chat hi-chat vj-chat yr-chat el-chat yl-chat">
                                <p class="text-${color} mb-2">
                                    <i class="fas fa-video-camera me-2 ms-1"></i>
                                    ${meet.users_number > 1 ? "Réunion" : "Appel"} ${stat}
                                    ${btn_join}
                                </p> 
                                </div>
                                <p class="nn-chat float-end">${meet.date}</p>
                            </div>`
                        }

                    }

                })

                if (last_meet && !document.querySelector("#visio > iframe")) {
                    document.querySelector(".meet_" + last_meet.id).scrollIntoView();
                }
            } else {
                document.querySelector("#visio").innerHTML = "<div class='m-4'><p class='text-center'>Aucune visioconférence a été notée.</p></div>";
            }

        }

    })
}

if(document.querySelector("#closeChat")){
    
    document.querySelector("#closeChat").addEventListener("click", function () {

        closeChat()
    
    })
}


if(document.querySelector("#text-search")){

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
}


if(document.querySelector("#btn-send")){

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
}


function removeToList(params) {
    params.parentElement.remove()
}

if(document.querySelectorAll("div.cg-chat")){

    document.querySelectorAll("div.cg-chat").forEach(amis => {

        amis.addEventListener("click", function (e) {
    
            //Assistant virtuel and messagerie container
    
            if (document.querySelector("#chat_container").getAttribute("data-type") != "visio") {
    
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
    
            } else {
    
                let roomRandom = "Meet" + generateUID() + document.querySelector("#amis_list").getAttribute("data-my-id")
    
                runVisio(roomRandom, amis.getAttribute("data-toggle-user-id"), 'visio')
    
            }
    
        })
    })
}


/** Upload image */

///read file

if(document.querySelector("#input-image")){

    document.querySelector("#input-image").addEventListener("change", (e) => {

        ////on load file
        const reader = new FileReader();
    
        reader.addEventListener("load", () => {
    
            /// file as url
            const uploaded_image = reader.result;
    
            ///let get multiple images (files)
    
            image_list.push({
                name: reader.result,
                type: "image"
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
}


/** Upload document */
if(document.querySelector("#input-file")){

    document.querySelector("#input-file").addEventListener("change", (e) => {

        ///read file
        const reader_doc = new FileReader();
    
        ////on load file
        reader_doc.addEventListener("load", () => {
    
            ///let get multiple images (files)
            image_list.push({
                name: reader_doc.result,
                type: "file"
            });
    
            const file_name = document.createElement("li")
            file_name.innerHTML = e.target.files[0].name
    
            //document.querySelector(".content_image_input_js_jheo").style.display = "flex"
    
            document.querySelector(".content_image_input_js_jheo_file_name").appendChild(file_name)
    
        });
    
        ///run event load in file reader.
        reader_doc.readAsDataURL(e.target.files[0]);
    
    })
}

