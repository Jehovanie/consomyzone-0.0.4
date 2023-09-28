const urlParams = new URLSearchParams(window.location.search);
const myParam = urlParams.get('tribuT');
if (myParam) {
    console.log(myParam);
    if (document.querySelector(`.${myParam}_jheo_js`)) {
        document.querySelector(`.${myParam}_jheo_js`).click();
    } else {
        console.log(`Selector not found : '${myParam}_jheo_js'`);
    }
}

if (document.querySelector(".content-message-nanta-css .bloc-text-message")) {
    document.querySelector(".content-message-nanta-css .bloc-text-message").classList.remove("text-white")
}
const imageType = ["jpg", "png", "gif", "jpeg"];
const fileDefaults = "/assets/image/type_file.png";
///check btn send and input msg
if (document.querySelector(".btn_send_message_jheo_js") && document.querySelector(".input_message_jheo_js")) {

    document.querySelector(".content_discussion_jheo_js").scrollTop = 9e9;

    //// input message
    const message_input = document.querySelector(".input_message_jheo_js")

    ///btn send message
    const btn_send_message = document.querySelector(".btn_send_message_jheo_js");

    ///input file
    const icon_input_file_show = document.querySelector(".input_file_show_jheo_js");
    const icon_input_file_hidden = document.querySelector(".input_file_hidden_jheo_js");

    // EVENT CLICK
    icon_input_file_show.onclick = () => {
        icon_input_file_hidden.click();
    }

    ///input file inside the file before
    if (document.querySelector(".input_file_under_image_jheo_js")) {
        document.querySelector(".input_file_under_image_jheo_js").onclick = () => {
            icon_input_file_hidden.click();
        }
    }

    ////Read image file. (message image)
    let image_list = [];
    icon_input_file_hidden.addEventListener("change", (e) => {

        ///read file
        const reader = new FileReader();

        ////on load file
        reader.addEventListener("load", () => {

            /// file as url
            const uploaded_image = reader.result;

            ///let get multiple images (files)

            const type = checkFileExtension(imageType, reader.result) ? "image" : "file";
            image_list.push({ type: type, name: reader.result });

            // for the content image above the input message
            const img = document.createElement("img")
            img.className = "image_input_item image_input_item_jheo_js";
            img.setAttribute("alt", "Image upload")
            img.src = (type === "image") ? uploaded_image : fileDefaults;

            const parentImage = document.querySelector(".content_image_input_jheo_js")
            parentImage.style.display = "flex"


            //// add in the first the new image upload
            if (parentImage.querySelector(".image_input_item_jheo_js")) {
                parentImage.insertBefore(img, parentImage.querySelector("image_input_item_jheo_js"))
            } else {
                parentImage.appendChild(img)
            }

        });


        ///run event load in file reader.
        reader.readAsDataURL(e.target.files[0]);

    })

    ///event on the keyup the user (message text)
    message_input.addEventListener("keyup", (e) => {
        ///the user key entre ... 
        if (e.code === "Enter" || e.code === "NumpadEnter") {

            ///check input content text
            if (document.querySelector(".input_message_jheo_js").value.length > 1 || document.querySelectorAll(".content_image_input_js_jheo img").length > 0) {

                ///send message---------------------------------------------------
                sendMessage(document.querySelector(".input_message_jheo_js").value, image_list)

                if (document.querySelectorAll(".image_input_item_jheo_js").length > 0) {
                    image_list = []
                }
            }

            ///delete focus
            document.querySelector(".input_message_jheo_js").blur()

            ///reset input
            document.querySelector(".input_message_jheo_js").value = null

            ///delete content image above ...
            if (document.querySelectorAll(".image_input_item_jheo_js")) {

                const image_sended = document.querySelectorAll(".image_input_item_jheo_js");
                image_sended.forEach(element => element.remove())

                document.querySelector(".content_image_input_jheo_js").style.display = "none"
            }

        }

    })



    /// click btn send message

    btn_send_message.addEventListener("click", () => {

        //alert("ok")
        ///check input content text
        if (document.querySelector(".input_message_jheo_js").value.length > 1 || image_list.length > 0) {

            ///send message---------------------------------------------------
            sendMessage(document.querySelector(".input_message_jheo_js").value, image_list)

            if (document.querySelectorAll(".image_input_item_jheo_js").length > 0) {
                image_list = []
            }

        }

        ///delete focus
        document.querySelector(".input_message_jheo_js").blur()

        ///reset input
        document.querySelector(".input_message_jheo_js").value = null

        if (document.querySelectorAll(".image_input_item_jheo_js")) {

            const image_sended = document.querySelectorAll(".image_input_item_jheo_js");
            image_sended.forEach(element => {
                element.remove()
            })
            document.querySelector(".content_image_input_jheo_js").style.display = "none"
        }
    })
}


/// THIS FUNCTION SHOW AND SEND MESSAGE TO THE SERVER ////////////////
function sendMessage(message, file_list) {

    //// format date now 
    const date = new Date().toLocaleDateString() + " " + new Date().toJSON().slice(11, 19);

    console.log(file_list)

    ///handle message, show under the input champ
    handleMessageResponse(date, message, file_list, "#", false)

    // ///send to the server
    fetch("/user/push/message", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({

            /// current connecter
            from: document.querySelector(".content_image_input_jheo_js").getAttribute("data-toggle-userfrom-id"),

            /// user to talk
            to: document.querySelector(".content_image_input_jheo_js").getAttribute("data-toggle-userto-id"),

            ///message content
            message: message.replace("\n", ""),
            files: file_list
        })
    })
        .then(response => response.json())
        .then(result => {

            ///change status message
            const content_loading = document.querySelector(".content_loading_jheo_js");
            content_loading.innerHTML = "<i class='fa-solid fa-check'></i>";

            //// change the id the last message.
            const message_sent = document.querySelector("#message_id_jheo_js");
            message_sent.setAttribute("id", `message_${result.id}_jheo_js`);

            setTimeout(() => {
                content_loading.parentElement.removeChild(content_loading);
            }, 2000);

        }).catch((e) => {

            const content_loading = document.querySelector(".content_loading_jheo_js");
            content_loading.innerHTML = "<i class='fa-solid fa-circle-exclamation error_message_status'></i>";
        })
}



//// SHOW MESSAGE ABOVE THE INPUT MESSAGE IN THE FIRST TIME 

function handleMessageResponse(date, message, file_list = null, image, status) {

    const card_msg = document.createElement("div");
    card_msg.className = "qf rb";
    card_msg.setAttribute("id", "message_id_jheo_js");

    let image_html_list = "";
    if (file_list.length > 0) {
        file_list.forEach(({ type, name }) => {
            const file = (type === "image") ? name : fileDefaults;
            image_html_list += `
                <div class="file_item">
                    <img class="message_image_item" src="${file}" alt="image">
                    <a class="icon_download_file" href="${name}" download>
                        <i class="fa-solid fa-download"></i>
                    </a>
                </div>
            `
        });
    }

    card_msg.innerHTML = `
        <div class="qb vh ii oj el yl">
            <p class="eo">${message}</p>
            <div class="content_image_msg">
                ${image_html_list}
            </div>
        </div>
        <p class="in nn">${date}</p>
    `


    if (!status) {

        const content_loading = document.createElement("div");
        content_loading.className = "content_loading content_loading_jheo_js"
        content_loading.innerHTML = "<i class='fa-solid fa-spinner loading'></i>"

        card_msg.appendChild(content_loading);

    }


    // <img src={{ (profil[0].getPhotoProfil != null) ? asset('uploads/users/photos/') ~ profil[0].getPhotoProfil : asset('uploads/users/photos/img_avatar.png') }} alt="{{ profil[0].getFirstname }}">
    ////insert into block message
    if (document.querySelector(".content_form_message_jheo_js")) {

        if (document.querySelector(".start_discussion_jheo_js")) {
            document.querySelector(".start_discussion_jheo_js").remove();
        }

        document.querySelector(".content_discussion_jheo_js").appendChild(card_msg);
        document.querySelector(".content_discussion_jheo_js").scrollTop = 9e9;
    }

}

if (document.querySelector("#search_friend_input")) {
    document.querySelector("#search_friend_input").addEventListener("keyup", function (e) {

        let target = e.target.value.toLowerCase()

        let divs = document.querySelectorAll("div.list_users > div.discussion")

        if (divs.length > 0) {
            for (var i = 0; i < divs.length; i++) {
                let a = divs[i].textContent.toLowerCase();

                if (a) {
                    if (a.indexOf(target) > -1) {
                        divs[i].style.display = "";
                    } else {
                        divs[i].style.display = "none";
                    }
                }
            }
        }

    })
}

const imgs = document.querySelectorAll("section > div.messages-chat.mode_pc > div > div > div > img")
const fullPage = document.querySelector('#fullpage');

imgs.forEach(img => {
    img.addEventListener('click', function () {
        fullPage.style.backgroundImage = 'url(' + img.src + ')';
        fullPage.style.display = 'block';
    });
});

// let y = document.querySelector("span.jc.un.mn.zn.gs.use-in-agd-nanta_js_css").textContent.trim()
// console.log(y)

if (document.querySelector("#elie-btn-visio")) {

    document.querySelector("#elie-btn-visio").addEventListener("click", function () {

        $("#visioMessageElie").modal("show")


        document.querySelector("#bodyVisioMessageElie").innerHTML = `<div class="d-flex justify-content-center mt-5">
        <div class="containt">
        <div class="word word-1">C</div>
        <div class="word word-2">M</div>
        <div class="word word-3">Z</div>
        </div>
        </div>
        `

        let roomRandom_msg = "Meet" + generateUID() + document.querySelector(".my-profile-id-elie").getAttribute("data-my-id")

        document.querySelector(".btn-minimize-elie").setAttribute('data-onclick', `joinMeet('${roomRandom_msg}', 'bodyVisioMessageElie', this,'old')`)

        let msg_txt = `<div class="qb-chat vh-chat hi-chat vj-chat yr-chat el-chat yl-chat">
        <p class="text-info mb-2">
            <i class="fas fa-video-camera me-2 ms-1"></i>
            Appel en attente...
            <span onclick="joinMeet('${roomRandom_msg}', 'bodyVisioMessageElie', this,'old')" class="float-end badge text-bg-primary text-white cursor-pointer p-2"><i class="fa-solid fa-phone-volume" style="color: #1bff0a;"></i></span>
        
        </p> 
        </div>`
        // <span onclick="cancelMeet('${roomRandom_msg}')"class="float-end badge text-bg-primary text-white cursor-pointer p-2"><i class="fa-solid fa-phone-slash" style="color: #ff0000;"></i></span>
        sendMessage(msg_txt, [])


        let amis = document.querySelector("div.content_entete_msg_jheo_js")

        document.querySelector("#bodyVisioMessageElie").innerHTML = ""

        runVisio(roomRandom_msg, amis.getAttribute("data-toggle-id-user-to"), 'bodyVisioMessageElie')
        // runVisio(roomRandom_msg, amis.getAttribute("data-toggle-id-user-to"),'content_discussion_elie')
    })
}

function cancelMeet(room) {
    console.log(apiJitsi)
    apiJitsi.executeCommand('hangup');
    // let msg_txt = `Appel refusé.`
    // sendMessage(msg_txt, [])
    // setStatusMeetByName(room, "finished")
}

function toggleClick(domHtml) {
    domHtml.classList.toggle("fa-minus-circle")
    domHtml.classList.toggle("fa-plus-circle")
}

function toggleAmisTribu(domHtml) {
    if (!domHtml.querySelector(".linkToActive_jheo_js")) {
        console.log("Selector not found: 'linkToActive_jheo_js'")
        return false;
    }

    const activeSwitch = domHtml.querySelector(".linkToActive_jheo_js");
    if (!activeSwitch.classList.contains('active')) {
        activeSwitch.classList.add('active')
    }

    const selector_list = activeSwitch.getAttribute("data-selector-list")
    if (document.querySelector(`.${selector_list}`).classList.contains('d-none')) {
        document.querySelector(`.${selector_list}`).classList.remove('d-none')
    }

    const allSwitches = document.querySelectorAll(".linkToActive_jheo_js")
    allSwitches.forEach(item => {
        if (item != activeSwitch) {
            const selector_list_other = item.getAttribute("data-selector-list")
            if (item.classList.contains('active')) {
                item.classList.remove('active')
            }
            if (!document.querySelector(`.${selector_list_other}`).classList.contains('d-none')) {
                document.querySelector(`.${selector_list_other}`).classList.add('d-none')
            }
        }
    })

}

window.addEventListener("load", (event) => {

    const currentUrl = window.location.href;

    let url = new URL(currentUrl);
    let params = new URLSearchParams(url.search);

    let user_id = 0;

    if (params.has("user_id")) {
        user_id = params.get("user_id");
    } else {
        user_id = document.querySelector(".content_entete_msg_jheo_js").getAttribute("data-toggle-id-user-to")
    }

    document.querySelectorAll("div.content-message-nanta-css").forEach(div => {
        if (div.getAttribute('data-toggle-user-id') == user_id) {
            div.classList.add("message-active")
        }
    })

    // document.querySelectorAll(".rb > div > div > p")
    document.querySelectorAll(".rb > div > div > p").forEach(p => {
        // console.log(p);
        p.classList.add("text-white")
    })

});

document.querySelector(".btn-minimize-elie").addEventListener("click", function (e) {
    $("#visioMessageElie").modal("hide")

    document.querySelector("#minimizeVisio").style="display:block;"

    let room = document.querySelector(".btn-minimize-elie").getAttribute("data-room")

    joinMeet(room, 'minimizeVisio', this)

    let btn_expand = document.createElement("button")
    btn_expand.setAttribute('onclick', "joinMeet('" + room + "','bodyVisioMessageElie', this)")
    btn_expand.setAttribute('type', 'button')
    btn_expand.classList = "btn-close btn-expand-elie"
    btn_expand.innerHTML = '<i class="fa-solid fa-expand"></i><span class="tooltiptext tooltiptextAgrandir">Agrandir</span>'

    document.querySelector("#minimizeVisio").appendChild(btn_expand)

    btn_expand.addEventListener("click", function () {
        $("#visioMessageElie").modal("show")
        document.querySelector("#minimizeVisio").innerHTML = ""
        document.querySelector("#minimizeVisio").style="display:none;"
    })

})