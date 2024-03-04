/**
 * CHATBOT FONCTIONNALITY
 * @author Elie Fenohasina <eliefenohasina@gmail.com>
 */

/**
 * Function opening a chatbot
 * @constructor
 */
function openChat() {
  document.querySelector("#chat_container").style =
    "width:58vw;height:82vh; position: fixed;bottom: 0; right: -260px; z-index:1003;";
  document.querySelector("#openChat").style =
    "background-color: #69BC45;width:40px;height:40px;color:white;border-radius:8px;cursor:pointer;display: none;";
  document.querySelector("#chat_header").style = "display:;";
  document.querySelector("#amis_list").style = "display:;";

  document.querySelector("#openFlottant").style = "display:none;";
  document.querySelector("#visio").style = "display:none;";
  document.querySelector("#conversation").style = "display:;";
  document.querySelector("#footer_chat").style.display = "";
}

/**
 * Function closing a chatbot.
 * @constructor
 */
function closeChat() {
  document.querySelector("#closeChat").disabled = true;

  let divs = document.querySelectorAll("#conversation > div");

  divs.forEach((qf) => {
    qf.style = "display:none;";
  });

  endChat();
}

/**
 * Function exiting perfectly a conversation chatbot
 * @constructor
 */
function endChat() {
  document.querySelector("#chat_container").style =
    "height:70px; position: fixed;bottom: 0; right: -320px; z-index:1003;background-color:transparent;";
  document.querySelector("#chat_container").classList.add("right_full");
  document.querySelector("#openChat").style =
    "background-color: #69BC45;width:40px;height:40px;color:white;border-radius:8px;cursor:pointer;";
  document.querySelector("#conversation").innerHTML = "";

  document.querySelector("#conversation").style.display = "none";
  document.querySelector("#footer_chat").style.display = "none";

  document.querySelector("#closeChat").disabled = false;

  document.querySelector("#closeChat").style = "display:";
  document.querySelector("#closevisio").style = "display:none";

  document.querySelector("#chat_header").style = "display:none;";
  document.querySelector("#amis_list").style = "display:none;";
  document.querySelector("#visio_group_btn").style = "display:none";

  if (
    document
      .querySelector("div.user-chat-display")
      .getAttribute("data-user-id") == "0" &&
    document.querySelector("#amis_list").getAttribute("data-my-id") == "0"
  ) {
    document.querySelector("#amis_list").setAttribute("data-my-id", "0");
  }

  if (
    document.querySelector("#chat_container").getAttribute("data-type") ==
    "visio"
  ) {
    document
      .querySelector("#chat_container")
      .classList.remove("chat_container_visio");
    document
      .querySelector(
        "#chat_container > div.content-chat.vc-chat.lc-chat.hg-chat.vv-chat.xi-chat.yi-chat.bj-chat.wr-chat"
      )
      .classList.remove("content_chat_visio");
    document
      .querySelector("#amis_list > div")
      .classList.remove("chat_friend_visio");
    // document.querySelector("#visio_group_btn").style = "display:block;"
    // document.querySelector("#visio").innerHTML = ""
    document.querySelector("#visio").style.display = "none";
    // document.querySelector("#chat_container").style = "width: 75vw; height: 82vh; position: fixed; bottom: 0px; z-index: 1003; right: -260px !important;"
  }

  document.querySelector("#openFlottant").style = "display:flex;";
}

/**
 * Function escape exiting conversation chatbot
 * @constructor
 */
function escapeChat() {
  document.querySelector("#closeChat").disabled = false;

  let divs = document.querySelectorAll("#conversation > div");

  let divs_len = divs.length - 1;

  divs.forEach((qf) => {
    qf.style = "";
  });

  if (document.querySelector(".popup_exit")) {
    document.querySelector(".popup_exit").remove();
  }

  document
    .querySelector("#conversation > div:nth-child(" + divs_len + ")")
    .scrollIntoView();
}

/**
 * Function running spinner writing.
 * @constructor
 */
function runSpinner() {
  if (document.querySelector(".dot-spinner")) {
    document.querySelector(".dot-spinner").remove();
  }

  let timestamp = new Date().getTime();

  document.querySelector("#conversation").innerHTML += `
        <div class="dot-spinner disc_${timestamp}">
            <span></span>
            <span></span>
            <span></span>
        </div>`;

  document.querySelector(".disc_" + timestamp).scrollIntoView();
}

/**
 * Function for suggestion initial from a chatbot.
 * @constructor
 */
function runSuggestion() {
  let date_now = new Date().toLocaleTimeString();

  let timestamp = new Date().getTime();

  let list_sugg = "";

  Object.entries(main_suggestion).forEach(([key, value]) => {
    list_sugg += `<button class="ad-chat lc-chat mg-chat pg-chat th-chat ni-chat bj-chat wr-chat nj-chat yr-chat oq-chat qq-chat _q-chat ks-chat w-100 mb-1 p-1 h-100" cle="${key}" onclick="find(this)">
                        ${value}
                    </button>`;
  });

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
    `;

  setTimeout(function () {
    if (document.querySelector(".dot-spinner")) {
      document.querySelector(".dot-spinner").remove();
    }

    document.querySelector("#conversation").innerHTML += sugg;

    document.querySelector(".disc_" + timestamp).scrollIntoView();
  }, 1500);
}

/**
 * Function for funding a result in a dictionnary.
 * @constructor
 * @param {node} elem - Element for getting a key for search
 */

function findInDict(elem) {
  let cle = elem.getAttribute("cle");

  Object.entries(dico).forEach(([key, value]) => {
    if (value.question) {
      Object.entries(value.question).forEach(([key2, value2]) => {
        Object.entries(value2).forEach(([key3, value3]) => {
          if (cle == key3) {
            writeRequest(value3.label);

            runSpinner();

            writeResponse(value3.response, true);
          }
        });
      });
    }
  });
}

/**
 * Function for getting a list of suggestion (response) from a dictionnary.
 * @constructor
 * @param {string} cle - Key to search
 * @param {object} dico - Dictionnary having a result
 */

function getResponse(cle, dico) {
  let date_now = new Date().toLocaleTimeString();

  let timestamp = new Date().getTime();

  let template = "";

  Object.entries(dico).forEach(([key, value]) => {
    if (cle == key) {
      if (value.response) {
        writeResponse(value.response);
      }

      if (value.question) {
        if (value.question.length > 0) {
          template += `<div class="qf-chat disc_${timestamp}">
                                <div class="qb-chat vh-chat hi-chat vj-chat yr-chat el-chat yl-chat">
                                    <p> Comment puis-je vous aider ?</p>
                                    <div class="text-center">`;

          for (let question of value.question) {
            if (typeof question === "object") {
              Object.entries(question).forEach(([key2, value2]) => {
                template += `<button class="ad-chat lc-chat mg-chat pg-chat th-chat ni-chat bj-chat wr-chat nj-chat yr-chat oq-chat qq-chat _q-chat ks-chat w-100 mb-1 h-100 p-1" cle="${key2}" onclick="findInDict(this)">
                                    ${value2.label}
                                </button>`;
              });
            }
          }

          template += `</div>
                                        </div>
                                        <p class="nn-chat">${date_now}</p>
                                    </div>`;
        }
      }
    }
    // else{
    //     //alert("Phrase incorrecte!")
    //     console.log(value);
    // }
  });

  return { timestamp: timestamp, template: template };
}

/**
 * Function for finding a result suggestion from a dictionnary.
 * @constructor
 * @param {node} elem - Element storing a key attribute
 */

function find(elem) {
  writeRequest(elem.textContent);

  runSpinner();

  let cle = elem.getAttribute("cle");

  let result = getResponse(cle, dico);

  setTimeout(function () {
    if (document.querySelector(".dot-spinner")) {
      document.querySelector(".dot-spinner").remove();
    }

    document.querySelector("#conversation").innerHTML += result.template;

    document.querySelector(".disc_" + result.timestamp).scrollIntoView();
  }, 1500);
}

/**
 * Funtion key event for searching a result
 * @constructor
 * @param {string} value - Value for searching
 */
function searchResultKey(q) {
  writeRequest(q);

  runSpinner();

  let response = "";

  for (const [cle, valeur] of Object.entries(dico_specifique)) {
    q = q.normalize("NFD").replace(/\p{Diacritic}/gu, "");

    if (q.trim().toLowerCase().includes(cle.trim().toLowerCase())) {
      response = valeur;
    } else {
      let terms = q
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .split(" ");

      for (let term of terms) {
        term = term.trim();

        for (const [key, value] of Object.entries(dico_response)) {
          let keys = key.split(",");

          for (let k of keys) {
            if (term.trim().toLowerCase() == k.trim().toLowerCase()) {
              if (!response.includes(value)) {
                response = value;
              }
            }
            if (!response) {
              /************ Lancing OPENE AI API if using ************/

              response = "Désolé, je ne comprends pas ce que tu veux dire.";
            }
          }
        }
      }
    }
  }

  writeResponse(response);
  runSuggestion();
}

/**
 * Function writing a request user
 * @constructor
 * @param {string} request - Request sending by user
 */
function writeRequest(request) {
  let timestamp = new Date().getTime();

  if (request) {
    document.querySelector(
      "#conversation"
    ).innerHTML += `<div class="qf-chat rb-chat disc_${timestamp}">
            <div class="qb-chat vh-chat ii-chat oj-chat el-chat yl-chat">
            <p class="eo-chat">${request}</p>
            </div>
            <p class="in-chat nn-chat">${new Date().toLocaleTimeString()}</p>
        </div>`;

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

  let timestamp = new Date().getTime();

  if (response) {
    setTimeout(function () {
      if (document.querySelector(".dot-spinner")) {
        document.querySelector(".dot-spinner").remove();
      }

      let btn_menu = "";

      if (menu == true) {
        btn_menu = `<button class="ad-chat lc-chat mg-chat pg-chat th-chat ni-chat bj-chat wr-chat nj-chat yr-chat oq-chat qq-chat _q-chat ks-chat w-100 mb-1 h-100 p-1" onclick="menu()">🏡 Menu principal</button>`;
      }

      document.querySelector(
        "#conversation"
      ).innerHTML += `<div class="qf disc_${timestamp}">
                    <div class="qb-chat vh-chat hi-chat vj-chat yr-chat el-chat yl-chat">
                    <p>${response}</p>
                        ${btn_menu}
                    </div>
                    <p class="nn-chat">${new Date().toLocaleTimeString()}</p>
                </div>`;

      document.querySelector(".disc_" + timestamp).scrollIntoView();
    }, 1500);
  }
}

/**
 * Function return of menu
 * @constructor
 */
function menu() {
  runSpinner();

  runSuggestion();
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
    files: files,
  };

  console.log(data);

  fetch("/user/push/message", {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(data),
  }).then((response) => {
    if (response.status == 200) {
      //getChat(user_id)

      if (
        document.querySelectorAll("div.content_image_input_js_jheo > img")
          .length > 0
      ) {
        document
          .querySelectorAll("div.content_image_input_js_jheo > img")
          .forEach((img) => {
            img.remove();
          });
      }

      if (
        document.querySelectorAll(
          "ul.content_image_input_js_jheo_file_name > li"
        ).length > 0
      ) {
        document
          .querySelectorAll("ul.content_image_input_js_jheo_file_name > li")
          .forEach((li) => {
            li.remove();
          });
      }
    }
  });
}

/**
 * Function getting a conversation betwen partisan
 * @constructor
 * @param {string} user_id - Id of other user
 */
function getChat(user_id) {
  fetch("/user/message/" + user_id)
    .then((response) => response.json())
    .then((messages) => {
      let i = 0;

      document.querySelector("#conversation").innerHTML = "";

      if (messages.length > 0) {
        for (let message of messages) {
          //console.log(message);

          let img_doc = "";

          let file_doc = "";

          let content = JSON.parse(message.content);

          if (content.images.length > 0) {
            for (let img of content.images) {
              img_doc += `<img src="${img}" class="mb-1" alt="photo" style="height:100px;border-radius:5px;">`;
            }
          }

          if (content.files && content.files.length > 0) {
            for (let file of content.files) {
              let ext = getExtension(
                file.split(".")[file.split(".").length - 1]
              );

              file_doc += `<div class="mt-2 mb-2" style="display:flex;flex-direction: row;justify-content: space-between">
                                            <a href="${file}" download class="icon_download_file" alt="photo" style="cursor: pointer;font-size: 1.6rem;"><i class="fas fa-file-text"></i></a>
                                            <div class="text-center" style="width:85%; display:block; overflow:auto;">document.${ext}</div>
                                            <a href="${file}" download class="icon_download_file" alt="photo" style="cursor: pointer;font-size: 1.6rem;"><i class="fas fa-download"></i></a>
                                            </div>`;
            }
          }

          if (message.isForMe == 0) {
            document.querySelector(
              "#conversation"
            ).innerHTML += `<div class="qf-chat rb-chat disc_${message.id}">
                        <div class="qb-chat vh-chat ii-chat oj-chat el-chat yl-chat">
                        <p class="eo-chat">${content.text}</p>
                            ${img_doc}
                            ${file_doc}
                        </div>
                        <p class="in-chat nn-chat">${message.datetime}</p>
                    </div>`;
          } else {
            document.querySelector(
              "#conversation"
            ).innerHTML += `<div class="qf disc_${message.id}">
                            <div class="qb-chat vh-chat hi-chat vj-chat yr-chat el-chat yl-chat">
                            <p>${content.text}</p>
                                ${img_doc}
                                ${file_doc}
                            </div>
                            <p class="nn-chat">${message.datetime}</p>
                        </div>`;
          }
          i = message.id;
          //console.log(message);
        }

        if (messages.length > 0) {
          document.querySelector(".disc_" + i).scrollIntoView();
        }
      } else {
        document.querySelector("#conversation").innerHTML =
          "<p class='text-center'>Aucun message.</p>";
      }
    });
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

      all_messages.forEach((message) => {
        //console.log(message);
        if (
          !document.querySelector("div.disc_" + message.id) &&
          document
            .querySelector("div.user-chat-display")
            .getAttribute("data-user-id") == user_id
        ) {
          let img_doc = "";

          let file_doc = "";

          let content = JSON.parse(message.content);

          if (content.images.length > 0) {
            for (let img of content.images) {
              img_doc += `<img src="${img}" class="mb-1" alt="photo" style="height:100px;border-radius:5px;">`;
            }
          }

          if (content.files && content.files.length > 0) {
            for (let file of content.files) {
              let ext = getExtension(
                file.split(".")[file.split(".").length - 1]
              );

              file_doc += `<div class="mt-2 mb-2" style="display:flex;flex-direction: row;justify-content: space-between">
                                            <a href="${file}" download class="icon_download_file" alt="document" style="cursor: pointer;font-size: 1.6rem;"><i class="fas fa-file-text"></i></a>
                                            <div class="text-center" style="width:85%; display:block; overflow:auto;">document.${ext}</div>
                                            <a href="${file}" download class="icon_download_file" alt="document" style="cursor: pointer;font-size: 1.6rem;"><i class="fas fa-download"></i></a>
                                            </div>`;
            }
          }

          if (message.isForMe == 0) {
            document.querySelector(
              "#conversation"
            ).innerHTML += `<div class="qf-chat rb-chat disc_${message.id}">
                            <div class="qb-chat vh-chat ii-chat oj-chat el-chat yl-chat">
                            <p class="eo-chat">${content.text}</p>
                                ${img_doc}
                                ${file_doc}
                            </div>
                            <p class="in-chat nn-chat">${message.datetime}</p>
                        </div>`;
          } else {
            document.querySelector(
              "#conversation"
            ).innerHTML += `<div class="qf disc_${message.id}">
                                <div class="qb-chat vh-chat hi-chat vj-chat yr-chat el-chat yl-chat">
                                <p>${content.text}</p>
                                    ${img_doc}
                                    ${file_doc}
                                </div>
                                <p class="nn-chat">${message.datetime}</p>
                            </div>`;
          }

          document.querySelector(".disc_" + message.id).scrollIntoView();
        }
      });
    };
  }
}

/**
 * Function launching a chat bot
 * @constructor
 */
function lanceChat() {
  document
    .querySelector("div.user-chat-display")
    .setAttribute("data-user-id", "0");

  runSpinner();

  writeResponse("👋 Bonjour! Je suis l'assistant virtuel de ConsoMyZone.");

  runSuggestion();
}

/**
 * Function to get a extension file js
 * @constructor
 * @param {string} params
 * @returns string : extension
 */
function getExtension(params) {
  let final_ext = params;
  Object.entries(file_extension).forEach(([key, value]) => {
    if (key == params) {
      final_ext = value;
    }
  });

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
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
  });
}

/**
 * Function updating a status of visio
 * @constructor
 * @param {string} name
 * @param {string} status
 */
function setStatusMeetByName(roomname, status) {
  fetch("/getVisioByName/" + roomname)
    .then((response) => response.json())
    .then((visios) => {
      if (visios.length > 0) {
        for (let visio of visios) {
          setStatusMeetById(visio.id, status);
        }
      }
    });
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

const domain = "8x8.vc";
const jwt =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6InZwYWFzLW1hZ2ljLWNvb2tpZS02Yzg3YzllY2NlOGI0Y2NkYTMwYWYzNTkxZGMyNGI1NC82MGVkZjAifQ.eyJpc3MiOiJjaGF0IiwiYXVkIjoiaml0c2kiLCJleHAiOjE3MjY5MDMxMDQsIm5iZiI6MTY5NTc5OTEwNCwicm9vbSI6IioiLCJzdWIiOiJ2cGFhcy1tYWdpYy1jb29raWUtNmM4N2M5ZWNjZThiNGNjZGEzMGFmMzU5MWRjMjRiNTQiLCJjb250ZXh0Ijp7InVzZXIiOnsibW9kZXJhdG9yIjoiZmFsc2UiLCJlbWFpbCI6IiIsIm5hbWUiOiIiLCJhdmF0YXIiOiIiLCJpZCI6Imdvb2dsZS1vYXV0aDJ8MTE4MzA0NTkyNDkwOTc1OTYyOTc1In0sImZlYXR1cmVzIjp7InJlY29yZGluZyI6InRydWUiLCJsaXZlc3RyZWFtaW5nIjoidHJ1ZSIsInRyYW5zY3JpcHRpb24iOiJmYWxzZSIsIm91dGJvdW5kLWNhbGwiOiJmYWxzZSJ9fX0.WkB1WzmEq5v8gX6IZ1uYUZKCY-q-AYx72WXuxPV4Q-Aojj4q0xK7PHfDpbjjj5VjPLY6WZqDZZF0R7jiVioTCwLLfMC-2_yDT9BnUQ6uL2zvU_Mh7Es4rAH2igZVhGONFWEQyQN21Boh225cZS66hVZDd-bLJTDXPy2v6dC2M8M1GISMI7pQMJIK_22UsMIquqSloSSPYlD4_5eyHoZz8O0sieQEM2V4pm4_FiuVOXzgMlFs3FP04efXOABOzluIQluN3VSiuFJRIpKY5n3CT22lVcqXDx-pn8lxN7aUz3OqPbDL6ZxEq4ej88m-r-dbwfIqN-PqEPazCJEN3wgLJw";
const home_room = "vpaas-magic-cookie-6c87c9ecce8b4ccda30af3591dc24b54/";

let user_name = document.querySelector("#my_full_name")
  ? document.querySelector("#my_full_name").textContent.trim()
  : document.querySelector("span.jc.un.mn.zn.gs.use-in-agd-nanta_js_css")
  ? document
      .querySelector("span.jc.un.mn.zn.gs.use-in-agd-nanta_js_css")
      .textContent.trim()
  : "";

/**
 * Function joining a meeting jitsi
 * @constructor
 * @param {integer} id : id of meet
 * @param {string} room : roomname of meet
 * @param {node} nodeElement : node of button of meeting
 */
let apiJitsi;

function joinMeet(...args) {
  try {
    //document.querySelector("#bodyVisioMessageElie>iframe").remove();
    AUDIO_FOR_JITSI = document.querySelector("#myAudio_faniry_js");
    AUDIO_FOR_JITSI.pause();
    AUDIO_FOR_JITSI.currentTime = 0;
  } catch (e) {
    console.log(e);
  } finally {
    let room = args[0];
    let parentNodeId = args[1];

    // let user_name = document.querySelector("#my_full_name").textContent.trim()

    if (
      document.querySelector("#visioMessageElie").classList.contains("d-none")
    ) {
      document.querySelector("#visioMessageElie").classList.remove("d-none");
    }

    if (document.querySelector("#minimizeVisio")) {
      document.querySelector("#minimizeVisio").innerHTML = "";
      // document.querySelector("#minimizeVisio").style = "display :block !important;"
    }

    if (document.querySelector("#" + parentNodeId).querySelector("iframe")) {
      document
        .querySelector("#" + parentNodeId)
        .querySelector("iframe")
        .remove();
    }

    toolbarButtonsList = [
      "camera",
      "chat",
      "closedcaptions",
      "desktop",
      "download",
      "embedmeeting",
      "etherpad",
      "feedback",
      "filmstrip",
      "fullscreen",
      "hangup",
      "help",
      "highlight",
      // 'invite',
      "linktosalesforce",
      "livestreaming",
      "microphone",
      "noisesuppression",
      // 'participants-pane',
      "profile",
      "raisehand",
      "recording",
      "security",
      "select-background",
      "settings",
      "shareaudio",
      "sharedvideo",
      "shortcuts",
      "stats",
      "tileview",
      "toggle-camera",
      "videoquality",
      "whiteboard",
    ];

    const options = {
      roomName: home_room + room,
      width: "100%",
      height: "100%",
      lang: "fr",
      jwt: jwt,
      // configOverwrite: { prejoinPageEnabled: false },
      configOverwrite: {
        prejoinPageEnabled: false,
        toolbarButtons: toolbarButtonsList,
      },
      interfaceConfigOverwrite: { VERTICAL_FILMSTRIP: true },
      parentNode: document.querySelector("#" + parentNodeId),
    };

    apiJitsi = new JitsiMeetExternalAPI(domain, options);
    // console.log(apiJitsi)
    apiJitsi.executeCommand("displayName", user_name);

    setStatusMeetByName(room, "progress");

    const iframe = apiJitsi.getIFrame();

    // localStorage.setItem("room_name", room)

    iframe.scrollIntoView();

    apiJitsi.on("readyToClose", () => {
      if (localStorage.getItem("room_name")) {
        localStorage.removeItem("room_name");
      }

      if (
        document.querySelector("#minimizeVisio")
      ) {
        document.querySelector("#minimizeVisio").innerHTML = "";
        document.querySelector("#minimizeVisio").classList.toggle("d-none");
         document.querySelector("#visioMessageElie").style="";
      }

      if (document.querySelector("#visioMessageElie")) {
        document.querySelector("#visioMessageElie").classList.toggle("d-none");
        document.querySelector("#visioMessageElie").style="";
      }

      setStatusMeetByName(room, "finished");

      //document.querySelector('#'+parentNodeId).innerHTML = ""

      const currentUrl = window.location.href;

      if (currentUrl.includes("user/message")) {
        $("#visioMessageElie").modal("hide");

        let node = "";
        let message_id = 0;

        let content = `<div class="qb-chat vh-chat hi-chat vj-chat yr-chat el-chat yl-chat">
                <p class="text-success mb-2">
                <i class="fas fa-video-camera me-2 ms-1"></i>
                Appel términé
                </p> 
            </div>`;

        // if(args[2]){
        //     node = args[2]
        //     message_id = node.parentElement.parentElement.parentElement.parentElement.getAttribute("id").replaceAll(/[^0-9]/g,"");
        //     node.parentElement.parentElement.parentElement.parentElement.innerHTML = content
        // }

        if (args[2]) {
          if (args[3]) {
            node = args[2];
            message_id =
              node.parentElement.parentElement.parentElement.parentElement
                .getAttribute("id")
                .replaceAll(/[^0-9]/g, "");
            node.parentElement.parentElement.parentElement.parentElement.innerHTML =
              content;
          } else {
            message_id = document
              .querySelector("#content_discussion_elie")
              .lastElementChild.getAttribute("id")
              .replaceAll(/[^0-9]/g, "");
            document.querySelector(
              "#content_discussion_elie"
            ).lastElementChild.innerHTML = content;
          }
        }

        let msg = {
          text: content,
          imagges: [],
          files: [],
        };

        fetch("/update/oneMessage/" + message_id, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(msg),
        })
          .then((response) => response.json())
          .then((res) => {
            //alert("terminé")
          });

        if (
          document.querySelector("#" + parentNodeId).querySelector("iframe")
        ) {
          document
            .querySelector("#" + parentNodeId)
            .querySelector("iframe")
            .remove();
        }
      } else {
        document.querySelector("#" + parentNodeId).innerHTML = "";
      }

      if (document.querySelector("#user_name_chat")) {
        document.querySelector("#user_name_chat").innerText = "VisioConférence";
      }
      if (document.querySelector("#visioMessageElieLabel")) {
        document.querySelector("#visioMessageElieLabel").innerText =
          "VisioConférence";
      }
    });

    if (document.querySelector(".btn-minimize-elie")) {
      // document.querySelector(".btn-minimize-elie").setAttribute("onclick", "joinMeet('" + room + "','minimizeVisio', this)")
      document
        .querySelector(".btn-minimize-elie")
        .setAttribute("data-room", room);
    }

    apiJitsi.addEventListener("participantJoined", (e) => {
      if (document.querySelector("#user_name_chat")) {
        if (
          !document
            .querySelector("#user_name_chat")
            .textContent.trim()
            .includes(e.displayName)
        ) {
          document.querySelector("#user_name_chat").innerText =
            document
              .querySelector("#user_name_chat")
              .textContent.trim()
              .replace("VisioConférence", "Vous") +
            ", " +
            e.displayName;
        }
      }
      if (document.querySelector("#visioMessageElieLabel")) {
        if (
          !document
            .querySelector("#visioMessageElieLabel")
            .textContent.trim()
            .includes(e.displayName)
        ) {
          document.querySelector("#visioMessageElieLabel").innerText =
            document
              .querySelector("#visioMessageElieLabel")
              .textContent.trim()
              .replace("VisioConférence", "Vous") +
            ", " +
            e.displayName;
        }
      }
    });
  }
}

/**
 * Function creating a meeting jitsi
 * @constructor
 * @param {string} roomRandom : name of room
 * @param {integer} user_id : user_id of user
 */
function runVisio(roomRandom, user_id, parentNodeId) {
  document.querySelector(
    "#" + parentNodeId
  ).innerHTML += `<div class="d-flex justify-content-center mt-5 chargement-visio">
        <div class="containt">
            <div class="word word-1">C</div>
            <div class="word word-2">M</div>
            <div class="word word-3">Z</div>
        </div>
    </div>
    `;

  let data = {
    roomName: roomRandom,
    to: user_id,
    status: "wait",
  };

  const request = new Request("/create/visio", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  fetch(request)
    .then((response) => response.json())
    .then((response) => {
      // console.log(response.success == true)
      if (response.success == true) {
        fetch("/getVisioByName/" + roomRandom)
          .then((response) => response.json())
          .then((visio) => {
            if (
              !document
                .querySelector("#" + parentNodeId)
                .querySelector("iframe")
            ) {
              document.querySelector(".chargement-visio").remove();
              joinMeet(roomRandom, parentNodeId, this);
            }
          });
      }
    });
}

/**
 * Function creating a group visio
 * @constructor
 */
function createVisioGroup() {
  let friend_list_node = document.querySelectorAll(
    "#amis_list > div > div > div.user_friends"
  );

  let htm =
    "<div class='overflow-auto' style='max-height:50vh;'><ul class='list-group' id='list-group-user-visio'>";

  friend_list_node.forEach((nd) => {
    htm += `
            <li class="list-group-item d-flex justify-content-between align-items-center" user_id_visio="${nd.getAttribute(
              "data-toggle-user-id"
            )}">
                <div class="d-flex justify-content-start align-items-center">
                    <img src="${
                      nd.querySelector("img").src
                    }" alt="profile" class="user-pdp-visio">    
                    <span class="ms-1">${nd
                      .querySelector("h5")
                      .textContent.trim()}</span>
                </div>
                <span class="rounded-pill text-primary cursor-pointer" onclick="selectOneUser(this)">Inviter</span>
            </li>
        `;
  });

  htm += "</ul></div>";

  if (friend_list_node.length <= 0) {
    swal({
      title: "Oops...",
      text: "Aucun utilisateur connecté pour le moment!",
      icon: "error",
      button: "OK",
    });
  } else {
    $("#visioGroupModal").modal("show");

    document.querySelector("#visioGroupContent").innerHTML = htm;

    document
      .querySelector("#confirmVisioGroup")
      .addEventListener("click", function () {
        let roomGroup =
          "Meet" +
          generateUID() +
          document.querySelector("#amis_list").getAttribute("data-my-id");

        if (
          document.querySelectorAll(
            "#list-group-user-visio > li.elie-user-selected"
          ).length > 0
        ) {
          document
            .querySelectorAll("#list-group-user-visio > li.elie-user-selected")
            .forEach((li) => {
              runVisio(roomGroup, li.getAttribute("user_id_visio"), "visio");
            });
        } else {
          swal({
            title: "Oops...",
            text: "Aucun utilisateur sélectionné!",
            icon: "error",
            button: "OK",
          });
        }
      });
  }
}

/**
 * Function creating a group visio
 * @constructor
 * @deprecated
 */
function createVisioGroupFromMessage() {
  let div = document.querySelector("div.user_profile_list_elie");

  let div_tribuG = div.querySelector(".content_list_tribuG_jheo_js");
  let div_tribuT = div.querySelector(".content_list_tribuT_jheo_js");

  let final_div = div_tribuT.outerHTML.replaceAll("ID_", "ID_elie_");

  final_div = final_div.replaceAll(
    "content_list_tribuT_jheo_js",
    "content_list_tribuT_elie_js d-none"
  );
  final_div = final_div.replaceAll("yd", "");

  let friend_list_node_tribuG = document.querySelectorAll(
    "div.content_list_tribuG_jheo_js > div.content-message-nanta-css"
  );
  let friend_list_node_tribuT = div_tribuT.querySelectorAll(
    "ul > div.content-message-nanta-css"
  );

  let tabs = `
        <ul class="nav nav-tabs user-tabs-profile-elie">
        <li class="nav-item">
            <a class="nav-link _t_g active" aria-current="page" href="#">Tribu G</a>
        </li>
        <li class="nav-item">
            <a class="nav-link _t_t" href="#">Tribu T</a>
        </li>
        </ul>
        `;

  let htm =
    tabs +
    "<div class='overflow-auto mt-2' style='max-height:50vh;'><ul class='list-group' id='list-group-user-visio'>";

  friend_list_node_tribuG.forEach((nd) => {
    htm += `
            <li class="list-group-item d-flex justify-content-between align-items-center user_t_g" user_id_visio="${nd.getAttribute(
              "data-toggle-user-id"
            )}">
                <div class="d-flex justify-content-start align-items-center">
                    <img src="${
                      nd.querySelector("img").src
                    }" alt="profile" class="user-pdp-visio">    
                    <span class="ms-1">${nd
                      .querySelector("h5")
                      .textContent.trim()}</span>
                </div>
                <span class="rounded-pill text-primary cursor-pointer" onclick="selectOneUser(this)">Inviter</span>
            </li>
        `;
  });

  htm += "</ul></div>";

  htm += final_div;

  $("#visioGroupModalForMessage").modal("show");

  document.querySelector("#visioGroupContentForMessage").innerHTML = htm;

  document
    .querySelector("#confirmVisioGroupForMessage")
    .addEventListener("click", function () {
      // let roomGroup = "Meet" + generateUID() + document.querySelector("#amis_list").getAttribute("data-my-id")
      let roomGroup =
        "Meet" +
        generateUID() +
        document
          .querySelector(".my-profile-id-elie")
          .getAttribute("data-my-id");

      let msg_txt = `<div class="qb-chat vh-chat hi-chat vj-chat yr-chat el-chat yl-chat">
            <p class="text-info mb-2">
                <i class="fas fa-video-camera me-2 ms-1"></i>
                Appel en attente...
                <span onclick="joinMeet('${roomGroup}', 'bodyVisioMessageElie', this)" class="float-end badge text-bg-primary text-white cursor-pointer p-2">Joindre</span>
            </p> 
            </div>`;

      if (document.querySelectorAll(".elie-user-selected").length > 0) {
        let unique = [];

        document.querySelectorAll(".elie-user-selected").forEach((li) => {
          let to_user = li.getAttribute("user_id_visio");

          if (!unique.includes(to_user)) {
            unique.push(to_user);
          }
        });

        for (let user_id of unique) {
          fetch("/user/push/message", {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              /// current connecter
              from: document
                .querySelector(".content_image_input_jheo_js")
                .getAttribute("data-toggle-userfrom-id"),

              /// user to talk
              to: user_id,

              ///message content
              message: msg_txt.replace("\n", ""),
              files: [],
            }),
          })
            .then((response) => response.json())
            .then((res) => console.log(res));

          document.querySelector("#bodyVisioMessageElie").innerHTML = "";

          runVisio(roomGroup, user_id, "bodyVisioMessageElie");
        }
      } else {
        swal({
          title: "Oops...",
          text: "Aucun utilisateur sélectionné!",
          icon: "error",
          button: "OK",
        });
      }
    });

  document.querySelectorAll("ul.user-tabs-profile-elie > li").forEach((li) => {
    li.addEventListener("click", function (e) {
      document
        .querySelectorAll("ul.user-tabs-profile-elie > li > a")
        .forEach((a) => {
          a.classList.remove("active");
        });
      e.target.classList.add("active");

      document
        .querySelector(".content_list_tribuT_elie_js")
        .querySelectorAll("a")
        .forEach((a) => {
          a.href = "#";
          if (a.parentElement.querySelector("span")) {
            a.parentElement.querySelector("span").remove();
          }
        });

      if (e.target.classList.contains("_t_g")) {
        document
          .querySelector(".content_list_tribuT_elie_js")
          .classList.add("d-none");

        document.querySelectorAll(".user_t_g").forEach((user) => {
          user.style = "display:flex !important";
        });
      } else {
        document.querySelectorAll(".user_t_g").forEach((user) => {
          user.style = "display:none !important";
        });
        document
          .querySelector(".content_list_tribuT_elie_js")
          .classList.remove("d-none");

        document
          .querySelector(".content_list_tribuT_elie_js")
          .querySelectorAll("a")
          .forEach((a) => {
            if (a.querySelector("p")) a.querySelector("p").remove();

            let span = document.createElement("span");
            span.classList = "rounded-pill text-primary cursor-pointer ms-auto";
            span.setAttribute("onclick", "selectOneUser(this)");
            span.textContent = "Inviter";
            a.previousElementSibling.parentElement.appendChild(span);

            a.parentElement.classList =
              "cg lc mg sh ol rl tq is content-message-nanta-css d-flex align-items-center";

            a.parentElement.querySelector("img").classList = "user-pdp-visio";
          });
      }
    });
  });
}


/**
 * @author faniry <faniryandriamihaingo@gmail.com> doesn't disturb me when I'm off
 * cette fonction créé les elements html pour afficher la liste des fan 
 * @param {String} id l'id de l'elemene où vous voulez afficher la liste
 * @param {*} fans provenant de la focntion generateListFanConnected ou formater les object exactement comme le retour 
 * de generateListFanConnected
 * @param {string} [customClassForInput="fan_who_selected_faniry_js"] class par défaut des checkbox générer
 * @param {boolean} [useSearchBar=true] 
 * @param {string} [title="Contacts"] le titre de l'element ul généré,par défaut le titre est contacts
 * @param {string} [ulClass=""]  class de l'element ul généré, par défaut il n' a pas de class
 */
function createListeFans(id, 
  fans,
  customClassForInput="fan_who_selected_faniry_js", 
  useSearchBar = false,
  title="Contacts",
  ulClass="",
  addNewElement=false,
  origin="visio"
  ){
  const ul = document.createElement("ul");
  if(ulClass!="")
      ul.setAttribute("class",ulClass)

  const modalContainer = document.querySelector("#"+id);
  if(!addNewElement)
  modalContainer.innerHTML = "";
  
  const fli=document.createElement("li")
  let className = ""
  switch(origin){
    case "contact":{
      className= "all-c-faniry-js"
      break
    }
    case "search":{
      className= "all-s-faniry-js"
      break
    }
    case "visio":{
      className= "all-v-faniry-js"
      break
    }
  }
  fli.setAttribute("class",className )
  fli.innerHTML=`
      <div class="cg lc mg sh ol rl tq is content-message-nanta-css">
       
      <div  class="yd">
          <div class="row">
              <div class="col align-self-start">
                  <h5 class="mn un zn gs">
                    Sélectionnez tout
                  </h5>

              </div>
              <div class="col-md-4 ${className}" >
                <input class="ms-3 selected_all_fans_js" type="checkbox"/>
              </div>
          </div>
      </div>
      </div>
  `
  ul.appendChild(fli);
  for (let fan of fans) {
    myid = parseInt(fan.myid);
    const li = document.createElement("li");
    const fullName = fan.fullName;
    const photoProfil =
      fan.photo_fan != null
        ? "/public" + fan.photo_fan.replace(/\/public/i,"")
        : "/public/uploads/users/photos/default_pdp.png";
    const user_id = fan.id_fan;
    const status = !!parseInt(fan.isActive);
    const statusHtml = status
      ? '<span class="g l m jc wc ce th pi ij xj"></span>'
      : '<span class="g l m jc wc ce th pi ij" style="background-color:gray"></span>';
    li.innerHTML = `
                <div class="cg lc mg sh ol rl tq is content-message-nanta-css last_msg_user_${user_id}_jheo_js" data-toggle-user-id="${user_id}" data-message-id={{last_message.id is defined ? last_message.id : '0' }}>
                    <div class="h mb sc yd of th">
                        <img src="${photoProfil}" class="vc yd qk rk elie-pdp-modif"/>
                        ${statusHtml}
                    </div>
                    <div class="yd">
                        <div class="row">
                            <div class="col-8">
                                <h5 class="mn un zn gs">
                                    ${fullName}
                                </h5>

                            </div>
                            <div class="col-4">
                            <input class="${customClassForInput}" type="checkbox" data-roof=${user_id} id="user_${user_id}" name="user_${user_id}"/>
                            </div>
                        </div>
                    </div>
                </div>
        `;
    ul.appendChild(li);
  }
if(useSearchBar){
    if(document.querySelector(".back_to_futur"))
        document.querySelector(".back_to_futur").remove()

    const searchElement=document.createElement('input');
    searchElement.setAttribute("class", "back_to_futur")
    searchElement.setAttribute("oninput","lookupFan(event,false,updateListIfChangeWord,updateList)")
    searchElement.placeholder="Rechercher des personnes..."
    searchElement.type="search";
    searchElement.style="border:1px solid black;width: 100%;"+ 
      "margin-top: 25px;"+
      "margin-left: 15px;"+
      "border-radius: 30px;"+
      "font-size: 16px;"+
      "background-color: white;"+
      "background-image: url('https://cdn2.iconfinder.com/data/icons/ios-7-icons/50/search-24.png');"+
      "background-position: 10px 7px;"+
      "background-repeat: no-repeat;"+
      "padding: 8px 20px 8px 40px;"+
      "-webkit-transition: width 0.8s ease-in-out;"+
      "transition: width 0.8s ease-in-out;"+
      "outline: none;"+
      "opacity: 0.9;"+
  
    
    modalContainer.parentElement.querySelector(".search_bar").appendChild(searchElement);
  }
  const h4 = document.createElement("h4");
  h4.innerHTML =`<p>${title}</p>`
  ul.style.padding="5px"
  modalContainer.appendChild(h4)
  modalContainer.appendChild(ul);
}

function createLoader(hidden=false){
      if(hidden){
        document.querySelector("#modal_Partage_Message_Faniry_js > .loader-fan").classList.add("d-none")
      }else{
        document.querySelector("#modal_Partage_Message_Faniry_js > .loader-fan").classList.remove("d-none")
      }
}

function updateListIfChangeWord(useTransition=true){
    //TODO update list if no 
    const ul=document.querySelector(".result_search_faniry_js")
    if(ul){
      if(useTransition){
        const seconds = 200/1000;
        ul.style.transition = "opacity "+seconds+"s ease";
        ul.parentElement.querySelector("h4").style.transition="opacity "+seconds+"s ease";
        ul.style.opacity = 0;
        ul.parentElement.querySelector("h4").opacity=0
        setTimeout(function() {
          ul.parentElement.querySelector("h4").remove()
          ul.remove();
        }, 200);
      }else{
        ul.parentElement.querySelector("h4").remove()
        ul.remove();
      }
      
    }
}

function listenCheckBoxChecked(){
  if(document.querySelectorAll(".fan_who_selected_prtg_msgfaniry_js").length > 0){
    Array.from(document.querySelectorAll(".fan_who_selected_prtg_msgfaniry_js")).forEach(item=>{
            item
            .addEventListener("input",(event)=>{
                  if(event.target.checked){
                        document.querySelector("#patager_message_faniry_js").disabled=false
                        
                  }else{
                  //   document.querySelector("#patager_message_faniry_js").disabled=true
                    if(document.querySelector(".selected_all_fans_js").checked){
                        document.querySelector(".selected_all_fans_js").checked=false
                    }
                    const isSomeChecked=[]
                    Array.from(document.querySelectorAll(".fan_who_selected_prtg_msgfaniry_js")).forEach(item2=>{
                          if(item2.checked){
                              isSomeChecked.push(true)
                          }
                    })
                    if(isSomeChecked.indexOf(true) < 0 ){
                      document.querySelector("#patager_message_faniry_js").disabled=true
                    }
                  }
                  //verifier si il y a encore des input checked

            })
    })
  }else{
    //TODO afficher une erreur
    // swal({
    //   title: "Oops...",
    //   text: "Erreur 500!",
    //   icon: "error",
    //   button: "OK",
    // });
  }
}

function updateList(datas){
   //TODO update Liste on data
   updateListIfChangeWord(false)
   console.log(datas)
   const finalResult=[]
   for(let data of datas){
      finalResult.push({
        id_fan: parseInt(data.user_id),
        photo_fan:data.photo_profil,
        fullName:data.firstname + " " + data.lastname,
        isactive: false,
        myid: parseInt(document.querySelector(".information_user_conected_jheo_js").dataset.userId),
      })
   }
   createListeFans("modal_Partage_Message_Faniry_js > .result_search",
   finalResult,
   "fan_who_selected_prtg_msgfaniry_js",
   false,
   "Resultats des recherches",
   "result_search_faniry_js",
   true,
   "search")
   listenCheckBoxChecked()
   listenMe("fan_who_selected_prtg_msgfaniry_js")
}

/**
 * @author faniry <faniryandriamihaingo@gmail.com> doesn't disturb me when I'm off
 * cette fonction va générer la liste des amis avec qui vous aller pouvoir partger le message
 * et puis envoyé le message
 */
async function createFanListToShareMessage(event){
  document.querySelector("#patager_message_faniry_js").disabled=true
  const fans =await generateListFanConnected();
  const idMessage=event.target.dataset.onFuture
  document.querySelector("#patager_message_faniry_js").dataset.onFuture=btoa(idMessage)
  //enlevez le resultat de recherche
  if(document.querySelector("#modal_Partage_Message_Faniry_js > .result_search"))
      document.querySelector("#modal_Partage_Message_Faniry_js > .result_search").innerHTML="";
  
  createListeFans("modal_Partage_Message_Faniry_js > .contacts",
      fans,
      "fan_who_selected_prtg_msgfaniry_js",
      true,
      "Contacts",
      "",
      false,
      "contact");
  listenCheckBoxChecked();
  listenMe("fan_who_selected_prtg_msgfaniry_js");
}

/**
 * @author faniry
 */
function listenMe(inputClassToSeleted="fan_who_selected_faniry_js"){
  if( document.querySelectorAll(".selected_all_fans_js").length > 0 ){
    Array.from( document.querySelectorAll(".selected_all_fans_js")).forEach(item=>{
        item.addEventListener("input",(e)=>{
            if(e.target.checked){
               
                const c=e.target.parentElement.classList[1];
                const ul=document.querySelector(`li.${c}`).parentElement
                console.log(ul)
                const inputs=ul.querySelectorAll(`input.${inputClassToSeleted}`)
                console.log(inputs)
                if(inputs.length > 0){
                    const isSomeChecked=[]
                    Array.from(inputs)
                    .forEach(input=>{
                        input.checked=true
                        if(input.checked)
                            isSomeChecked.push(true)
                      
                    })
                    
                    if(isSomeChecked.indexOf(true)  >= 0 ){
                      
                      document.querySelector("#patager_message_faniry_js").disabled=false
                    }else{
                      document.querySelector("#patager_message_faniry_js").disabled=true
                    }
                  
                }
               
               
                
            }else{
              const c=e.target.parentElement.classList[1];
              const ul=document.querySelector(`li.${c}`).parentElement
              const inputs=ul.querySelectorAll(`input.${inputClassToSeleted}` )
              if(inputs.length > 0){
                const isSomeChecked=[]
                Array.from(inputs)
                .forEach(input=>{
                    input.checked=false
                    if(!input.checked)
                      isSomeChecked.push(false)
                })
                if(isSomeChecked.indexOf(true) < 0 ){
                      
                  document.querySelector("#patager_message_faniry_js").disabled=true
                }else{
                  document.querySelector("#patager_message_faniry_js").disabled=false
                }
              }
            }

        })
    })
    
  }
}

/**
 * @author faniry
 * lance le visio de groupe
 */
async function createVisoGroup() {
  const fans = await generateListFanConnected();
  createListeFans("visioGroupContentForMessage", fans)
  listenMe();
  $("#visioGroupModalForMessage").modal("show");
  document
    .querySelector("#confirmVisioGroupForMessage")
    .addEventListener("click", (event) => {
      const fansId = [];
      document
        .querySelectorAll(".fan_who_selected_faniry_js")
        .forEach((item) => {
          if (item.checked) {
            fansId.push(item.dataset.roof);
          }
        });
      if (fans.length > 0 && myid != 0) {
        let roomGroup = "Meet" + generateUID() + myid;
        let msg_txt = `<div class="qb-chat vh-chat hi-chat vj-chat yr-chat el-chat yl-chat">
                    <p class="text-info mb-2">
                        <i class="fas fa-video-camera me-2 ms-1"></i>
                        Appel en attente...
                        <span onclick="joinMeet('${roomGroup}', 'bodyVisioMessageElie', this)" class="float-end badge text-bg-primary text-white cursor-pointer p-2">Joindre</span>
                    </p> 
                    </div>`;
        for (let user_id of fansId) {
          fetch("/user/push/message", {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              /// current connecter
              from: myid,

              /// user to talk
              to: user_id,

              ///message content
              message: msg_txt.replace("\n", ""),
              files: [],
            }),
          })
            .then((response) => response.json())
            .then((res) => console.log(res));

          document.querySelector("#bodyVisioMessageElie").innerHTML = "";

          runVisio(roomGroup, user_id, "bodyVisioMessageElie");
        }
      } else {
        swal({
          title: "Oops...",
          text: "Aucun utilisateur n'a été sélectionné!",
          icon: "info",
          button: "OK",
        });
      }
    });
}
/**
 * @author faniry
 * cette fonction liste les fans en ligne
 * le fichier se trouve dans chatHome.js
 */
function generateListFanConnected() {
createLoader()
  return new Promise((resolve, reject) => {
    fetch("/user/get/allfans").then((r) => {
      if (r.status === 200 && r.ok) {
createLoader(true)
        r.json().then((datas) => {
          let length = {
            tribuT: 1,
            tribug: 1,
          };
          let fans = [];
          let result = [];
          for (let j = 0, l = datas.length; j < l; j++) {
            if (j === 0) {
              //index 0 correpond au tribu t
if(datas[j][0]){
              let data = datas[j][0].amis;
              length.tribuT = data === undefined ? 0 : data.length;
              for (let value of data) {
                const photoProfil =
                  value.image_profil != null
                    ? "/public" + value.image_profil
                    : "/public/uploads/users/photos/default_pdp.png";
                fans.push({
                  id_fan: parseInt(value.id),
                  photo_fan: photoProfil,
                  fullName: value.firstname + " " + value.lastname,
                  isactive: value.is_online,
                  myid: value.my_id,
                });
              }
            }
              
            }else{
              let data = datas[j];
if(data){
              length.tribug = data.length;
              for (let value of data) {
                const photoProfil =
                  value.image_profil != null
                    ? "/public" + value.image_profil
                    : "/public/uploads/users/photos/default_pdp.png";
                fans.push({
                  id_fan: parseInt(value.id),
                  photo_fan: photoProfil,
                  fullName: value.firstname + " " + value.lastname,
                  isactive: value.is_online,
                  myid: value.my_id,
                });
              }
            }

            }
          }
          const ids = [];

          if (length.tribuT === 0 && length.tribug === 0) {
            result = [];
          } else {
            for (let fan of fans) {
              if (!ids.includes(fan.id_fan)) {
                result.push(fan);
                ids.push(fan.id_fan);
              }
            }
          }
          resolve(result);
        });
      } else {
        reject("error");
      }
    });
  });
}
/**
* @author Elie
 * Function selecting one or more user to meeting
 * @constructor
 * @param {node} params : li element
 */
function selectOneUser(params) {
  if (params.textContent.trim() == "Inviter") {
    params.textContent = "Annuler";
    params.classList.remove("text-primary");
    params.classList.add("text-danger");
    params.parentElement.style = "background-color:#CFF4FC;";
    params.parentElement.classList.add("elie-user-selected");
  } else {
    params.textContent = "Inviter";
    params.classList.remove("text-danger");
    params.classList.add("text-primary");
    params.parentElement.style = "";
    params.parentElement.classList.remove("elie-user-selected");
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
    response:
      "ConsoMyZone est une application qui vous aidera à consommer bien et bon près de chez vous.",
    question: [
      {
        description: {
          label: "Comment ConsoMyZone peut vous aidez à consommer bien et bon?",
          response:
            "L'application embarque une carte interactive qui vous donne des informations bien qualifiées et mise à jour sur les restaurants," +
            "les golfs, les fermes, les stations et bien d'autres encore à venir, et vous donne aussi la possibilité de noter et de donner votre avis.",
        },
      },
    ],
  },
  FAQ: {
    label: "Section FAQ?",
    question: [
      {
        f1: {
          label: "ConsoMyZone, a-t-il une partie connectée?",
          response:
            "Oui, ConsoMyZone invoque la notion de tribu dans ses parties connectées.",
        },
      },
      {
        f2: {
          label: "C'est quoi une tribu-G?",
          response:
            "Une tribu-G, est une tribu géographique (G pour géographie), qui regroupe tous les partisans qui habitent dans la même commune." +
            "Vous serez assigné à un tribu-G lors de votre inscription.",
        },
      },
      {
        f3: {
          label: "Comment on vous assigne-t-on à une tribu-G ?",
          response:
            "Lors de votre inscription, vous serez amené à choisir votre commune, et cette commune que vous auriez choisis deviendra votre tribu-G.",
        },
      },
      {
        f4: {
          label: "C'est quoi une tribu-T?",
          response:
            "Une tribu-T, est une tribu thématique (T pour thématique). Contrairement aux tribus-g, elle n'est pas assignée automatiquement," +
            "mais vous devriez la créer, l'animé, et chercher et inviter des partisans qui auront la même passion que vous à propos du thème de votre tribu-T.",
        },
      },
      {
        f5: {
          label: "C'est quoi un fondateur ou fondatrice d'une tribu-G ?",
          response:
            "C'est le partisan, qui aura été le premier a s'inscrire sur ConsoMyZone dans sa commune.",
        },
      },
      {
        f6: {
          label: "Quels sont les rôles d'un fondateur ou fondatrice ?",
          response:
            "Votre rôle sera d'animer la tribu et de veiller au bon déroulement des événements de la tribu, pour que tout le monde se sente en sécurité et soit à l'aise.",
        },
      },
      {
        f7: {
          label: "Est ce que je peux abandonner mon rôle de fondateur.",
          response: "Oui, bien sûr",
        },
      },
      {
        f8: {
          label: "Que peut-on faire dans la partie connectée ?",
          response:
            "Vous pouvez partager vos pensées, des photos, créer des tribus-T, parlez avec d'autres partisans ," +
            "faire des appels vidéo ou vocal avec la messagerie de ConsoMyzone et gérer votre agenda et aussi le partager.",
        },
      },
    ],
  },
  sessions: {
    label: "Comment gère-t-on vos données clients ?",
    response:
      "Nous utilisons des sessions storages, pour stocker vos habitudes sur la carte ConsoMyzone  comme le niveau de zoom, dernier emplacement sur la carte," +
      "pour vous donnez une meilleure expérience quand vous parcourez la carte.",
  },
};

let dico_specifique = {
  "je m'appelle":
    "Enchanté et bienvenu sur l'application ConsoMyzone. Comment puis-je vous aider ? ",
  "ça va":
    "L'équipe ConsoMyzone se porte merveilleusement bien, nous tenons à vous souhaiter une très bonne santé. Comment puis-je vous aider ?",
  "ça va?":
    "L'équipe ConsoMyzone se porte merveilleusement bien, nous tenons à vous souhaiter une très bonne santé. Comment puis-je vous aider ?",
  "comment ça va?":
    "L'équipe ConsoMyzone se porte merveilleusement bien, nous tenons à vous souhaiter une très bonne santé. Comment puis-je vous aider ?",
};

let dico_response = {
  "slt, salut, cv, cc, coucou, bjr, bonjour":
    "Bonjour, comment puis-je vous aider ?",
  merci:
    "L'équipe ConsoMyzone vous remercie de l'intêret que vous portiez à l'application. Comment puis-je vous aider ?",
  "bye, au revoir":
    "L'équipe ConsoMyzone vous remercie de l'intêret que vous portiez à l'application. Comment puis-je vous aider ?",
  "bisous, biz":
    "L'équipe ConsoMyzone vous remercie de l'intêret que vous portiez à l'application. Comment puis-je vous aider ?",
};

let main_suggestion = {
  definition: "Qu'est ce que ConsoMyZone ou CMZ pour les intimes ?",
  FAQ: "Section FAQ ?",
  sessions: "Comment gère-t-on vos données clients ?",
};

let file_extension = {
  sheet: "xlsx",
  document: "docx",
  pdf: "pdf",
  plain: "txt",
  csv: "csv",
  presentation: "pptx",
  html: "html",
  xml: "xml",
};

let image_list = [];

if (document.querySelector("#closevisio")) {
  document.querySelector("#closevisio").addEventListener("click", function () {
    endChat();
    document.querySelector("#chat_container").setAttribute("data-type", "");
  });
}

if (document.querySelector("#openMessage")) {
  document.querySelector("#openMessage").addEventListener("click", function () {
    // window.location.href = "/user/all/message";
    openIframeMessageOrVisio("message");

    // openChat()

    // document.querySelector("#assist_virt").style = "display:none;"
    // document.querySelector(".btn-input-file").style = "display:;cursor:pointer;"
    // document.querySelector('#visio').style = "display:none"

    // document.querySelector("#amis_list").style = "display:block;"

    // document.querySelector("#chat_container > div.content-chat.vc-chat.lc-chat.hg-chat.vv-chat.xi-chat.yi-chat.bj-chat.wr-chat > div.nj-chat.xr-chat.ti-chat.bj-chat.wr-chat.sl-chat.ql-chat").style = "display:block;"

    // document.querySelector("#chat_container").style = "width: 58vw; height: 82vh; position: fixed; bottom: 0px; z-index: 1003; right: -260px;"

    // document.querySelectorAll("div.user_friends").forEach(user => {
    //     user.style = "display:";
    // })

    // let first_user = document.querySelectorAll("#amis_list > div > div > div.cg-chat.lc-chat.mg-chat.sh-chat.ol-chat.rl-chat.tq-chat.is-chat.user_friends")[0]

    // // let user_id = first_user.getAttribute("data-toggle-user-id")?first_user.getAttribute("data-toggle-user-id") : 0
    // let user_id = 0;

    // if (first_user) {
    //     user_id = first_user.getAttribute("data-toggle-user-id")
    // }
    // // else {
    // //     user_id = 0;
    // //     runSpinner()

    // //     writeResponse("👋 Bonjour! Je suis l'assistant virtuel de ConsoMyZone.")

    // //     runSuggestion()
    // // }

    // let user_name = (first_user === undefined) ? "" : first_user.querySelector("div:nth-child(2) > h5").textContent.trim()

    // let user_photo = (first_user === undefined) ? "" : first_user.querySelector("div.h-chat.mb-chat.sc-chat.yd-chat.of-chat.th-chat > img").src

    // document.querySelector("div#user_head").innerHTML = `
    //                     <div class="ob-chat xc-chat yd-chat pf-chat nh-chat">
    //                         <div class="h-chat mb-chat sc-chat yd-chat of-chat th-chat">
    //                             <img src="${user_photo}" alt="profile" id="profile-user" class="vc-chat yd-chat qk-chat rk-chat"/>
    //                             <span class="g-chat l-chat m-chat jc-chat wc-chat ce-chat th-chat pi-chat ij-chat xj-chat"></span>
    //                         </div>
    //                     </div>
    //                     <div class="user-chat-display" data-user-id="${user_id}">
    //                         <h5 class="un-chat zn-chat gs-chat fw-bold" id="user_name_chat">
    //                             ${user_name}
    //                         </h5>
    //                     </div>
    //                     `
    // if (document.querySelector("div.user-chat-display").getAttribute("data-user-id") != 0) {

    //     getChat(document.querySelector("div.user-chat-display").getAttribute("data-user-id"))

    // } else {
    //     document.querySelector("#footer_chat").classList.add("non_active")
    // }

    // /** Adding active message for user */

    // document.querySelectorAll("#amis_list > div > div > div.user_friends").forEach(i => {
    //     i.classList.remove("message-active")
    // })

    // document.querySelectorAll("#amis_list > div > div > div.user_friends").forEach(user => {
    //     if (user.getAttribute("data-toggle-user-id") == document.querySelector("div.user-chat-display").getAttribute("data-user-id")) {
    //         user.classList.add("message-active")
    //     }
    //     user.addEventListener("click", function () {
    //         document.querySelectorAll("#amis_list > div > div > div.user_friends").forEach(i => {
    //             i.classList.remove("message-active")
    //         })
    //         user.classList.add("message-active")
    //     })
    // })
  });
}

if (document.querySelector("#openChat")) {
  document.querySelector("#openChat").addEventListener("click", function () {
    openChat();

    document.querySelector("#assist_virt").style = "display:;";
    document.querySelector(".btn-input-file").style = "display:none;";
    document.querySelector("#visio").style = "display:none";

    document.querySelector("#amis_list").style = "display:none;";

    document.querySelector("#chat_container").style =
      "width: 58vw; height: 82vh; position: fixed; bottom: 0px; z-index: 1003; right: -33% !important;";

    document.querySelectorAll("div.user_friends").forEach((user) => {
      user.style = "display:none";
    });

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
                            `;

    if (
      document
        .querySelector("div.user-chat-display")
        .getAttribute("data-user-id") == "0"
    ) {
      runSpinner();

      writeResponse("👋 Bonjour! Je suis l'assistant virtuel de ConsoMyZone.");

      runSuggestion();
    } else {
      getChat(
        document
          .querySelector("div.user-chat-display")
          .getAttribute("data-user-id")
      );
    }
  });
}

if (document.querySelector("#openVisio")) {
  document.querySelector("#openVisio").addEventListener("click", function () {
    // window.location.href = "/user/all/message";
    openIframeMessageOrVisio("visio");
    // openChat()

    // document.querySelector("#chat_container").classList.add("chat_container_visio")
    // document.querySelector("#chat_container > div.content-chat.vc-chat.lc-chat.hg-chat.vv-chat.xi-chat.yi-chat.bj-chat.wr-chat").classList.add("content_chat_visio")
    // document.querySelector("#amis_list > div").classList.add("chat_friend_visio")

    // document.querySelector("#visio_group_btn").style = "display:;"

    // document.querySelector("#assist_virt").style = "display:none;"
    // document.querySelector(".btn-input-file").style = "display:;cursor:pointer;"

    // document.querySelector('#conversation').style = "display:none"

    // document.querySelector('#closeChat').style = "display:none"
    // document.querySelector('#closevisio').style = "display:"

    // document.querySelector("#chat_container").setAttribute("data-type", "visio")

    // document.querySelector("#chat_container > div.content-chat.vc-chat.lc-chat.hg-chat.vv-chat.xi-chat.yi-chat.bj-chat.wr-chat > div.nj-chat.xr-chat.ti-chat.bj-chat.wr-chat.sl-chat.ql-chat").style = "display:none;"

    // document.querySelectorAll("div.user_friends").forEach(user => {
    //     user.style = "display:";
    // })

    // document.querySelector("div#user_head").innerHTML = `
    //                     <div class="d-flex p-1 ps-0">
    //                         <div">
    //                             <i class="fas fa-video-camera" style="margin-top: 15%;font-size:27px;color:red;"></i>
    //                         </div>
    //                     </div>
    //                     <div class="user-chat-display p-2" data-user-id="">
    //                         <h5 class="un-chat zn-chat gs-chat fw-bold" id="user_name_chat">
    //                         VisioConférence
    //                         </h5>
    //                     </div>
    //                     `;
    // // document.querySelector('#conversation').innerHTML = ""

    // document.querySelector('#visio').style = "display:block"

    // let my_id = document.querySelector("#amis_list").getAttribute("data-my-id")

    // const evtSource_meet = new EventSource("/get/myvisio");

    // //// event onmessage
    // evtSource_meet.onmessage = function (event) {

    //     const all_meet = JSON.parse(event.data);

    //     const last_meet = all_meet[all_meet.length - 1]

    //     if (all_meet.length > 0) {

    //         all_meet.forEach(meet => {

    //             if (!document.querySelector('.meet_' + meet.id)) {

    //                 let stat = "manqué"
    //                 let color = ""
    //                 let btn_join = ""
    //                 switch (meet.status) {
    //                     case 'wait':
    //                         stat = `en attente...`
    //                         color = 'info'
    //                         btn_join = `<span onclick="joinMeet('${meet.nom}', 'visio')" class='float-end badge text-bg-primary text-white cursor-pointer p-2'>Joindre</span>`
    //                         break;
    //                     case 'progress':
    //                         stat = `en cours`
    //                         color = 'warning'
    //                         btn_join = `<span onclick="joinMeet('${meet.nom}', 'visio')" class='float-end badge text-bg-info text-white cursor-pointer p-2'>Ouvrir</span>`
    //                         break;
    //                     case 'finished':
    //                         stat = `términé`
    //                         color = 'success'
    //                         break;
    //                     case 'missed':
    //                         stat = `manqué`
    //                         color = 'danger'
    //                         break;
    //                     default:
    //                         stat = "manqué"
    //                 }

    //                 if (!document.querySelector("#visio > iframe")) {

    //                     document.querySelector("#visio").innerHTML += `<div class="qf m-2 meet_${meet.id}">
    //                         <p class="qb-chat mn un mt-4">
    //                             ${my_id == meet.from ? meet.username + "(vous)" : meet.username}
    //                         </p>
    //                         <div class="qb-chat vh-chat hi-chat vj-chat yr-chat el-chat yl-chat">
    //                         <p class="text-${color} mb-2">
    //                             <i class="fas fa-video-camera me-2 ms-1"></i>
    //                             ${meet.users_number > 1 ? "Réunion" : "Appel"} ${stat}
    //                             ${btn_join}
    //                         </p>
    //                         </div>
    //                         <p class="nn-chat float-end">${meet.date}</p>
    //                     </div>`
    //                 }

    //             }

    //         })

    //         if (last_meet && !document.querySelector("#visio > iframe")) {
    //             document.querySelector(".meet_" + last_meet.id).scrollIntoView();
    //         }
    //     } else {
    //         document.querySelector("#visio").innerHTML = "<div class='m-4'><p class='text-center'>Aucune visioconférence a été notée.</p></div>";
    //     }

    //     /** Adding active visio for user */

    //     document.querySelectorAll("#amis_list > div > div > div.user_friends").forEach(user => {

    //         user.addEventListener("click", function () {
    //             document.querySelectorAll("#amis_list > div > div > div.user_friends").forEach(i => {
    //                 i.classList.remove("message-active")
    //             })
    //             user.classList.add("message-active")
    //         })
    //     })

    // }
  });
}

if (document.querySelector("#closeChat")) {
  document.querySelector("#closeChat").addEventListener("click", function () {
    closeChat();
  });
}

if (document.querySelector("#text-search")) {
  document
    .querySelector("#text-search")
    .addEventListener("keyup", function (e) {
      if (e.key === "Enter" || e.keyCode === 13) {
        if (
          document
            .querySelector("div.user-chat-display")
            .getAttribute("data-user-id") == 0
        ) {
          if (e.target.value) {
            searchResultKey(e.target.value);
          }
        } else {
          //console.log("send message user");

          sendChat(
            e.target.value,
            image_list,
            document
              .querySelector("div.user-chat-display")
              .getAttribute("data-user-id")
          );
        }

        e.target.value = "";
      }
    });
}

if (document.querySelector("#btn-send")) {
  document.querySelector("#btn-send").addEventListener("click", function (e) {
    if (
      document
        .querySelector("div.user-chat-display")
        .getAttribute("data-user-id") == 0
    ) {
      if (document.querySelector("#text-search").value) {
        searchResultKey(document.querySelector("#text-search").value);
      }
    } else {
      //console.log("send message user");

      sendChat(
        document.querySelector("#text-search").value,
        image_list,
        document
          .querySelector("div.user-chat-display")
          .getAttribute("data-user-id")
      );
    }

    document.querySelector("#text-search").value = "";
  });
}

function removeToList(params) {
  params.parentElement.remove();
}

if (document.querySelectorAll("div.cg-chat")) {
  document.querySelectorAll("div.cg-chat").forEach((amis) => {
    amis.addEventListener("click", function (e) {
      //Assistant virtuel and messagerie container

      if (
        document.querySelector("#chat_container").getAttribute("data-type") !=
        "visio"
      ) {
        document.querySelector("#conversation").innerHTML = "";

        document.querySelector(".content_image_input_js_jheo").innerHTML = "";

        document.querySelector(
          ".content_image_input_js_jheo_file_name"
        ).innerHTML = "";

        image_list = [];

        let user_name = e.target.textContent.trim();

        //let user_id = amis.getAttribute("data-toggle-user-id")

        document.querySelector("#user_name_chat").innerText = user_name;

        if (user_name != "Assistant Virtuel") {
          document.querySelector("#profile-user").src =
            amis.querySelector("img").src;
          document.querySelector(".mn-chat").style.display = "none";

          document
            .querySelector("div.user-chat-display")
            .setAttribute(
              "data-user-id",
              amis.getAttribute("data-toggle-user-id")
            );

          // get message from other user

          getChat(
            document
              .querySelector("div.user-chat-display")
              .getAttribute("data-user-id")
          );

          checkNewMessage(
            document
              .querySelector("div.user-chat-display")
              .getAttribute("data-user-id")
          );

          document.querySelector(".btn-input-file").style = "cursor:pointer;";
        } else {
          document.querySelector("#profile-user").src =
            "https://www.iconpacks.net/icons/1/free-help-icon-1160-thumb.png";

          document.querySelector(".user-chat-display").innerHTML = `
                            <h5 class="un-chat zn-chat gs-chat" id="user_name_chat">
                                Assistant Virtuel
                            </h5>
                            <p class="mn-chat">Reponse automatique</p>`;

          document
            .querySelector("div.user-chat-display")
            .setAttribute("data-user-id", "0");

          document.querySelector(".btn-input-file").style =
            "cursor:not-allowed;";

          runSpinner();

          writeResponse(
            "👋 Bonjour! Je suis l'assistant virtuel de ConsoMyZone."
          );

          runSuggestion();
        }

        // Visio conference container
      } else {
        let roomRandom =
          "Meet" +
          generateUID() +
          document.querySelector("#amis_list").getAttribute("data-my-id");

        runVisio(roomRandom, amis.getAttribute("data-toggle-user-id"), "visio");
      }
    });
  });
}

/** Upload image */

///read file

if (document.querySelector("#input-image")) {
  document.querySelector("#input-image").addEventListener("change", (e) => {
    ////on load file
    const reader = new FileReader();

    reader.addEventListener("load", () => {
      /// file as url
      const uploaded_image = reader.result;

      ///let get multiple images (files)

      image_list.push({
        name: reader.result,
        type: "image",
      });

      //// for the content image above the input message
      const img = document.createElement("img");
      img.src = uploaded_image;
      img.style = "width:100px;height:100px;";
      img.setAttribute("alt", "Image upload");
      document.querySelector(".content_image_input_js_jheo").style.display =
        "flex";

      const parentImage = document.querySelector(
        ".content_image_input_js_jheo"
      );

      //// add in the first the new image upload
      if (parentImage.querySelector("img")) {
        parentImage.insertBefore(img, parentImage.querySelector("img"));
      } else {
        document.querySelector(".content_image_input_js_jheo").appendChild(img);
      }
    });

    ///run event load in file reader.
    reader.readAsDataURL(e.target.files[0]);
  });
}

/** Upload document */
if (document.querySelector("#input-file")) {
  document.querySelector("#input-file").addEventListener("change", (e) => {
    ///read file
    const reader_doc = new FileReader();

    ////on load file
    reader_doc.addEventListener("load", () => {
      ///let get multiple images (files)
      image_list.push({
        name: reader_doc.result,
        type: "file",
      });

      const file_name = document.createElement("li");
      file_name.innerHTML = e.target.files[0].name;

      //document.querySelector(".content_image_input_js_jheo").style.display = "flex"

      document
        .querySelector(".content_image_input_js_jheo_file_name")
        .appendChild(file_name);
    });

    ///run event load in file reader.
    reader_doc.readAsDataURL(e.target.files[0]);
  });
}



//* Transférer le message à d'autre fan/
if(document.querySelector("#patager_message_faniry_js")){
   const messageShare=document.querySelector("#patager_message_faniry_js")
   messageShare.addEventListener("click",(event)=>{
      createLoader()
      let  userIDSharingMsg=[]
      const idMessage=event.target.dataset.onFuture
      userIDSharingMsg=Array.from(document.querySelectorAll(".fan_who_selected_prtg_msgfaniry_js")).
      filter(item=>item.checked).
      map(item=>cryptageJs(item.dataset.roof))
      console.log(userIDSharingMsg)
      const request =new Request("/user/sharing/message",{
        method:"POST",
        headers:{
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body:JSON.stringify({
            idMessage:cryptageJs(idMessage),
            usr:userIDSharingMsg
          })
      })

      fetch(request).then(response=>{
        if(response.status === 200 && response.ok){
            createLoader(true)

            new swal({
              title: "Fait",
              text: "Message transféré.",
              icon: "success",
              button: "OK",
            });
        }else{
            new swal({
              title: "Oops...",
              text: "Erreur 500",
              icon: "error",
              button: "OK",
            });
        }
      })
   })
}else{
  // swal({
  //   title: "Oops...",
  //   text: "Aucun utilisateur n'a été sélectionné!",
  //   icon: "info",
  //   button: "OK",
  // });
}

/**on met les input selectionez tous à checked = false  lorsqu'on ferme les modal*/
if(document.querySelector("#canceled_message_shared_faniry_js")){
  document.querySelector("#canceled_message_shared_faniry_js").
  addEventListener("click",()=>{
    if( document.querySelectorAll(".selected_all_fans_js").length > 0 ){
      Array.from( document.querySelectorAll(".selected_all_fans_js")).forEach(item=>{
          if(item.checked)
             item.checked=false
      })
    }
  })
}

/**on met les input selectionez tous à checked = false  lorsqu'on ferme les modal*/
if(document.querySelector("#close_message_shared_faniry_js")){
  document.querySelector("#close_message_shared_faniry_js").
  addEventListener("click",()=>{
    if( document.querySelectorAll(".selected_all_fans_js").length > 0 ){
      Array.from( document.querySelectorAll(".selected_all_fans_js")).forEach(item=>{
        if(item.checked) 
            item.checked=false
      })
    }
  })
}

/**on met les input selectionez tous à checked = false  lorsqu'on ferme les modal*/
if(document.querySelector("#canceled_visio_shared_faniry_js")){
  document.querySelector("#canceled_visio_shared_faniry_js").
  addEventListener("click",()=>{
    if( document.querySelectorAll(".selected_all_fans_js").length > 0 ){
      Array.from( document.querySelectorAll(".selected_all_fans_js")).forEach(item=>{
          if(item.checked)
              item.checked=false
      })
    }
  })
}

/**on met les input selectionez tous à checked = false  lorsqu'on ferme les modal*/
if(document.querySelector("#close_visio_shared_faniry_js")){
  document.querySelector("#close_visio_shared_faniry_js").
  addEventListener("click",()=>{
    if( document.querySelectorAll(".selected_all_fans_js").length > 0 ){
      Array.from( document.querySelectorAll(".selected_all_fans_js")).forEach(item=>{
          if(item.checked)
              item.checked=false
      })
    }
  })
}


/**
 * @author Elie
 * @constructor : lancement d'une messagerie et chatbot dans une iframe
 * localisation : chatHome.js
 * utilisation : icon chat et visio sur la page d'accueil de la carte
 */
function openIframeMessageOrVisio(type){

  let url = type=="visio"?"/api/message/perso_iframe":"/api/user/message_iframe";

  if(document.querySelector("body > iframe")){

    document.querySelector("body > iframe").remove()

  }else{

    let message_iframe = document.createElement("iframe")
    message_iframe.id=type+"-iframe";
    message_iframe.src = url
    message_iframe.classList.add("message-iframe")

    document.querySelector("#"+type+"IframeBody").appendChild(message_iframe)

    $("#"+type+"Iframe").modal("show");

  }
}

/**
 * @author Elie
 * location : chatHome.js
 * utilisation : affichage de nombre de message non lu dans l'écran d'accueil sur la carte
 */
if (document.querySelector(".information_user_conected_jheo_js")) {
  const contentInfoUser = document.querySelector(
    ".information_user_conected_jheo_js"
  );

  //// GET NUMBER MESSAGE NOT SHOW  AND SETTINGS
  const event_source_nbr_message = new EventSource(
    "/user/show/nbrMessageNotShow"
  );
  event_source_nbr_message.onmessage = function (event) {
    ///number message not show in the database
    const new_nbr_message = JSON.parse(event.data);

    /// check if different 0
    const badge_msg = document.querySelector(".content_badge_message_jheo_js");
    const old_nbr_message = document.querySelector(
      ".badge_message_jheo_js"
    ).innerText;
    if (
      parseInt(new_nbr_message) != 0 &&
      parseInt(old_nbr_message) < parseInt(new_nbr_message)
    ) {
      if (badge_msg.classList.contains("d-none")) {
        badge_msg.classList.remove("d-none");
      }
      if(!document.querySelector("#openMessage")){
        document.querySelector(".badge_message_jheo_js").innerText = `${parseInt(
          new_nbr_message
        )}`;
      }
      notificationSong();
    } else if (parseInt(new_nbr_message) === 0) {
      if (!badge_msg.classList.contains("d-none")) {
        badge_msg.classList.add("d-none");
        document.querySelector(".badge_message_jheo_js").innerText = "0";
      }
    }
  };

  if(document.querySelector("#openMessage")){
    const event_source_show_message = new EventSource("/user/get/not/show/message");
    event_source_show_message.onmessage = function (event) {
      /// last message for each user
      const new_message = JSON.parse(event.data);
      console.log(JSON.parse(event.data));
      ////check number message not show
      const message_not_show = new_message.filter(
        (item) => {
          if(parseInt(item.message.isForMe) === 1){
            return parseInt(item.message.isShow) === 0
          }
        }
      );
      let span = ""
      let spanVisio = ""
      let tooltipMessage = document.querySelector("#openMessage > .tooltips-chathome")
      let tooltipVisio = document.querySelector("#openVisio > .tooltips-chathome")
      let countVisio = 0
      let height = 60;
      let heightVisio = 60;
      if(message_not_show.length > 0){
        let prefixPath = IS_DEV_MODE == true ? "" : "/public";
        let i = 0
        for (const item of message_not_show) {
          i++
          let contentMessage = JSON.parse(item.message.content)
          let messageText = ""
          let pdprofil = item.profil?item.profil : "/uploads/users/photos/default_pdp.png"
          pdprofil = prefixPath + pdprofil
          if(contentMessage.text != ""){
            if(contentMessage.text.includes("joinMeet(")){
              messageText = `Visioconférence entrant <i class="fa-solid fa-phone-volume" style="color: #1bff0a;"></i>`
              spanVisio += `<span style="display:flex;"><img src="${pdprofil}" style="width:40px;clip-path: circle(40%);"><span class="ms-2">${item.fullname}<br><span style="color:#FFC107;">${messageText}</span></span></span>`
              countVisio++;
            }else{
              messageText = contentMessage.text
            }
            span += `<span style="display:flex;"><img src="${pdprofil}" style="width:40px;clip-path: circle(40%);"><span class="ms-2">${item.fullname}<br><span style="color:#FFC107;">${messageText}</span></span></span>`
          }else{
            span += `<span style="display:flex;"><img src="${pdprofil}" style="width:40px;clip-path: circle(40%);"><span class="ms-2">${item.fullname}<br><span style="color:#FFC107;">Le message contient de(s) fichiers</span></span></span>`
          }
        }
        height = height * i + 40
        tooltipMessage.innerHTML = span
        // tooltipMessage.style.visibility = "visible"
        // if(message_not_show.length >= 2){
        //   tooltipMessage.style.top = "-160%"
        // }else if(message_not_show.length >= 3){
        //   tooltipMessage.style.top = "-160%"
        // }
        tooltipMessage.style.top = "-"+height+"%"
        
      }else{
        tooltipMessage.innerHTML = "Aucun message non lu"
        tooltipMessage.style.top = "-60%"
        document.querySelector(".content_badge_visio_nanta_js").classList.add("d-none")
      }
      if(message_not_show.length > 0){
        if(document.querySelector(".content_badge_message_jheo_js").classList.contains("d-none"))
          document.querySelector(".content_badge_message_jheo_js").classList.remove("d-none")
        document.querySelector(".badge_message_jheo_js").innerText = message_not_show.length;
      }else{
        if(!document.querySelector(".content_badge_message_jheo_js").classList.contains("d-none"))
          document.querySelector(".content_badge_message_jheo_js").classList.add("d-none")
      }
      if(countVisio > 0){
        document.querySelector(".content_badge_visio_nanta_js").classList.remove("d-none")
        tooltipVisio.innerHTML = spanVisio
        heightVisio = heightVisio * countVisio + 40
        tooltipVisio.style.top = "-"+heightVisio+"%"
      }else{
        document.querySelector(".content_badge_visio_nanta_js").classList.add("d-none")
        tooltipVisio.innerHTML = "Cliquez pour lancer une visioconférence."
        tooltipVisio.style.top = "-"+heightVisio+"%"
      }
    }
  }
}

function createIframeOnClickHoverMessage(user_post){
  let body = document.querySelector("#messageIframeBody")
  body.remove()
  let modalBody = document.createElement("div")
  modalBody.setAttribute("class", "modal-body p-0")
  modalBody.setAttribute("style", "height:100vh;")
  modalBody.setAttribute("id", "messageIframeBody")
  // let iframeNanta = window.parent.document.documentElement.querySelector("#message-iframe")
  // if(iframeNanta)
  //   iframeNanta.remove()
  let url = `/api/message/perso_iframe?user_id=${user_post}`;
  let iframeMsgNanta = document.createElement("iframe");
  iframeMsgNanta.src = url;
  modalBody.appendChild(iframeMsgNanta);
  const modalContent = document.querySelector("#messageIframe .modal-content");
  modalContent.insertBefore(modalBody, modalContent.children[1]);
  $("#messageIframe").modal("show")
}

/** Fin Elie */