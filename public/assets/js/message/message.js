const urlParams = new URLSearchParams(window.location.search);
const myParam = urlParams.get("tribuT");
let lookupFanDebounce = setTimeout(() => {}, 1000);
if (myParam) {
  console.log(myParam);
  if (document.querySelector(`.${myParam}_jheo_js`)) {
    document.querySelector(`.${myParam}_jheo_js`).click();
  } else {
    console.log(`Selector not found : '${myParam}_jheo_js'`);
  }
}

if (document.querySelector(".content-message-nanta-css .bloc-text-message")) {
  document
    .querySelector(".content-message-nanta-css .bloc-text-message")
    .classList.remove("text-white");
}
const imageType = ["jpg", "png", "gif", "jpeg"];
const fileDefaults = "/public/assets/image/type_file.png";
///check btn send and input msg
if (
  document.querySelector(".btn_send_message_jheo_js") &&
  document.querySelector(".input_message_jheo_js")
) {
  document.querySelector(".content_discussion_jheo_js").scrollTop = 9e9;

  //// input message
  const message_input = document.querySelector(".input_message_jheo_js");

  ///btn send message
  const btn_send_message = document.querySelector(".btn_send_message_jheo_js");

  ///input file
  const icon_input_file_show = document.querySelector(
    ".input_file_show_jheo_js"
  );
  const icon_input_file_hidden = document.querySelector(
    ".input_file_hidden_jheo_js"
  );

  // EVENT CLICK
  icon_input_file_show.onclick = () => {
    icon_input_file_hidden.click();
  };

  ///input file inside the file before
  if (document.querySelector(".input_file_under_image_jheo_js")) {
    document.querySelector(".input_file_under_image_jheo_js").onclick = () => {
      icon_input_file_hidden.click();
    };
  }

  ////Read image file. (message image)
  let image_list = [];
  icon_input_file_hidden.addEventListener("change", (e) => {
    ////hide emojy picker
    hideEmojyPicker();

    ///read file
    const reader = new FileReader();

    ////on load file
    reader.addEventListener("load", () => {
      const listExt = ["jpg", "jpeg", "png", "csv", "txt", "json", "pdf"];
      const octetMax = 3145728; //3Mo

      /// file as url
      const uploaded_image = reader.result;

      if (!checkFileExtension(listExt, uploaded_image)) {
        swal({
          title: "Le format de fichier n'est pas pris en charge!",
          text: "Le fichier autorisé doit être une image ou des fichier (.jpeg, .jpg, .png, .csv, .txt, .json, .pdf)",
          icon: "error",
          button: "OK",
        });
      } else {
        if (!checkTailleImage(octetMax, uploaded_image)) {
          swal({
            title: "Le fichier est trop volumineux!",
            text: "La taille de l'image doit être inférieure à 3Mo.",
            icon: "error",
            button: "OK",
          });
        } else {
          ///let get multiple images (files)
          const type = checkFileExtension(imageType, reader.result)
            ? "image"
            : "file";
          image_list.push({ type: type, name: reader.result });

          // for the content image above the input message
          const img = document.createElement("img");
          img.className = "image_input_item image_input_item_jheo_js";
          img.setAttribute("alt", "Image upload");
          img.src = type === "image" ? uploaded_image : fileDefaults;

          const parentImage = document.querySelector(
            ".content_image_input_jheo_js"
          );
          parentImage.style.display = "flex";

          //// add in the first the new image upload
          if (parentImage.querySelector(".image_input_item_jheo_js")) {
            parentImage.insertBefore(
              img,
              parentImage.querySelector("image_input_item_jheo_js")
            );
          } else {
            parentImage.appendChild(img);
          }
        }
      }
    });

    ///run event load in file reader.
    reader.readAsDataURL(e.target.files[0]);
  });

  ///event on the keyup the user (message text)
  message_input.addEventListener("keyup", (e) => {
    ////hide emojy picker
    hideEmojyPicker();

    ///the user key entre ...
    if (e.code === "Enter" || e.code === "NumpadEnter") {
      ///check input content text
      if (
        document.querySelector(".input_message_jheo_js").value.length > 1 ||
        document.querySelectorAll(".content_image_input_js_jheo img").length > 0
      ) {
        //// hide emoji picker
        hideEmojyPicker();

        ///send message---------------------------------------------------
        sendMessage(
          document.querySelector(".input_message_jheo_js").value,
          image_list
        );

        if (document.querySelectorAll(".image_input_item_jheo_js").length > 0) {
          image_list = [];
        }
      }

      ///delete focus
      document.querySelector(".input_message_jheo_js").blur();

      ///reset input
      document.querySelector(".input_message_jheo_js").value = null;

      ///delete content image above ...
      if (document.querySelectorAll(".image_input_item_jheo_js")) {
        const image_sended = document.querySelectorAll(
          ".image_input_item_jheo_js"
        );
        image_sended.forEach((element) => element.remove());

        document.querySelector(".content_image_input_jheo_js").style.display =
          "none";
      }
    }
  });

  /// click btn send message

  btn_send_message.addEventListener("click", () => {
    ////hide emojy picker
    hideEmojyPicker();

    ///check input content text
    if (
      document.querySelector(".input_message_jheo_js").value.length > 1 ||
      image_list.length > 0
    ) {
      ///send message---------------------------------------------------
      sendMessage(
        document.querySelector(".input_message_jheo_js").value,
        image_list
      );

      if (document.querySelectorAll(".image_input_item_jheo_js").length > 0) {
        image_list = [];
      }
    }

    ///delete focus
    document.querySelector(".input_message_jheo_js").blur();

    ///reset input
    document.querySelector(".input_message_jheo_js").value = null;

    if (document.querySelectorAll(".image_input_item_jheo_js")) {
      const image_sended = document.querySelectorAll(
        ".image_input_item_jheo_js"
      );
      image_sended.forEach((element) => {
        element.remove();
      });
      document.querySelector(".content_image_input_jheo_js").style.display =
        "none";
    }
  });
}

/**cette section est là pour envoyer le message par groupe */
if (document.querySelector(".send_msg_grp_faniry_js")) {
  const containerImagesToUpload = document.querySelector(
    ".content_image_input_jheo_js"
  );
  const typeG = containerImagesToUpload.dataset.toggleType;
  const where = containerImagesToUpload.dataset.toggleUsertoId;
  const sender = containerImagesToUpload.dataset.userfromId;
  document.querySelector(".content_discussion_jheo_js").scrollTop = 9e9;
  const message_input = document.querySelector(".input_message_jheo_js");

  ///btn send message
  const btn_send_message = document.querySelector(".send_msg_grp_faniry_js");

  ///input file
  const icon_input_file_show = document.querySelector(
    ".input_file_show_jheo_js"
  );
  const icon_input_file_hidden = document.querySelector(
    ".input_file_hidden_jheo_js"
  );

  icon_input_file_show.onclick = () => {
    icon_input_file_hidden.click();
  };

  ///input file inside the file before
  if (document.querySelector(".input_file_under_image_jheo_js")) {
    document.querySelector(".input_file_under_image_jheo_js").onclick = () => {
      icon_input_file_hidden.click();
    };
  }

  //read images or file
  let image_list = [];
  icon_input_file_hidden.addEventListener("change", (e) => {
    ////hide emojy picker
    hideEmojyPicker();

    ///read file
    const reader = new FileReader();

    ////on load file
    reader.addEventListener("load", () => {
      const listExt = ["jpg", "jpeg", "png", "csv", "txt", "json", "pdf"];
      const octetMax = 3145728; //3Mo

      /// file as url
      const uploaded_image = reader.result;

      if (!checkFileExtension(listExt, uploaded_image)) {
        swal({
          title: "Le format de fichier n'est pas pris en charge!",
          text: "Le fichier autorisé doit être une image ou des fichier (.jpeg, .jpg, .png, .csv, .txt, .json, .pdf)",
          icon: "error",
          button: "OK",
        });
      } else {
        if (!checkTailleImage(octetMax, uploaded_image)) {
          swal({
            title: "Le fichier est trop volumineux!",
            text: "La taille de l'image doit être inférieure à 3Mo.",
            icon: "error",
            button: "OK",
          });
        } else {
          ///let get multiple images (files)
          const type = checkFileExtension(imageType, reader.result)
            ? "image"
            : "file";
          image_list.push({ type: type, name: reader.result });

          // for the content image above the input message
          const img = document.createElement("img");
          img.className = "image_input_item image_input_item_jheo_js";
          img.setAttribute("alt", "Image upload");
          img.src = type === "image" ? uploaded_image : fileDefaults;

          // const parentImage = document.querySelector(".content_image_input_jheo_js")
          containerImagesToUpload.style.display = "flex";

          //// add in the first the new image upload
          if (
            containerImagesToUpload.querySelector(".image_input_item_jheo_js")
          ) {
            containerImagesToUpload.insertBefore(
              img,
              containerImagesToUpload.querySelector("image_input_item_jheo_js")
            );
          } else {
            containerImagesToUpload.appendChild(img);
          }
        }
      }
    });

    reader.readAsDataURL(e.target.files[0]);
  });

  //send message by typing enter btn
  message_input.addEventListener("keyup", (e) => {
    hideEmojyPicker();
    if (e.code === "Enter" || e.code === "NumpadEnter") {
      hideEmojyPicker();
      if (
        document.querySelector(".input_message_jheo_js").value.length > 1 ||
        document.querySelectorAll(".content_image_input_js_jheo img").length > 0
      ) {
        //// hide emoji picker
        hideEmojyPicker();

        ///send message---------------------------------------------------
        //sendMessage(document.querySelector(".input_message_jheo_js").value, image_list)
        sendMessageGrp(message_input.value, image_list, sender, where, typeG);
        if (document.querySelectorAll(".image_input_item_jheo_js").length > 0) {
          image_list = [];
        }
      }

      ///delete focus
      document.querySelector(".input_message_jheo_js").blur();

      ///reset input
      document.querySelector(".input_message_jheo_js").value = null;

      ///delete content image above ...
      if (document.querySelectorAll(".image_input_item_jheo_js")) {
        const image_sended = document.querySelectorAll(
          ".image_input_item_jheo_js"
        );
        image_sended.forEach((element) => element.remove());

        document.querySelector(".content_image_input_jheo_js").style.display =
          "none";
      }
    }
  });

  //send message by clicking on send button
  btn_send_message.addEventListener("click", (event) => {
    hideEmojyPicker();
    if (
      document.querySelector(".input_message_jheo_js").value.length > 1 ||
      image_list.length > 0
    ) {
      ///send message---------------------------------------------------
      //sendMessage(document.querySelector(".input_message_jheo_js").value, image_list)
      sendMessageGrp(message_input.value, image_list, sender, where, typeG);
      if (document.querySelectorAll(".image_input_item_jheo_js").length > 0) {
        image_list = [];
      }
    }

    ///delete focus
    document.querySelector(".input_message_jheo_js").blur();

    ///reset input
    document.querySelector(".input_message_jheo_js").value = null;

    if (document.querySelectorAll(".image_input_item_jheo_js")) {
      const image_sended = document.querySelectorAll(
        ".image_input_item_jheo_js"
      );
      image_sended.forEach((element) => {
        element.remove();
      });
      document.querySelector(".content_image_input_jheo_js").style.display =
        "none";
    }
  });
}

function sendMessageGrp(message, files, sender, where, type) {
  let url = "";
  switch (type) {
    case "t": {
      url = "/user/pushMessage/T";
      break;
    }

    case "g": {
      url = "/user/pushMessage/G";
      break;
    }

    default: {
      swal({
        title: "Ouups!!",
        text: "erreur 500",
        icon: "error",
        button: "OK",
      });
    }
  }
  const parameters = {
    receiver: where,
    message: message.replace("\n", ""),
    files: files,
  };
  const date =
    new Date().toLocaleDateString() + " " + new Date().toJSON().slice(11, 19);
  handleMessageResponse(date, message, files, "#", false);
  fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(parameters),
  }).then((response) => {
    if (response.status === 200 && response.ok) {
      response.json().then((result) => {
        const content_loading = document.querySelector(
          ".content_loading_jheo_js"
        );
        content_loading.innerHTML = "<i class='fa-solid fa-check'></i>";

        //// change the id the last message.
        const message_sent = document.querySelector("#message_id_jheo_js");
        message_sent.setAttribute("id", `message_${result.id}_jheo_js`);

        setTimeout(() => {
          content_loading.parentElement.removeChild(content_loading);
        }, 2000);
      });

      document.querySelector(".message-active").setAttribute("data-date", new Date().toUTCString())
      document.querySelector("div.message-active > a > div > div.col-8 > p.text_message_jheo_js").textContent = message.length > 50 ? "(Message long) ..." : message
      document.querySelector("div.message-active > a > div > div.col-4 > p.heure_message").innerHTML = `à l'instant <i class="fa-regular fa-clock"></i>`

      /** Appel de triage de message */
  
      orderOldMessage()
  
      /** End appel triage */

    } else {
      swal({
        title: "Ouups!!",
        text: "erreur 500",
        icon: "error",
        button: "OK",
      });
    }
  });
}

//fin section envoie message pour groupe

/// THIS FUNCTION SHOW AND SEND MESSAGE TO THE SERVER ////////////////
function sendMessage(message, file_list) {
  //// format date now
  const date =
    new Date().toLocaleDateString() + " " + new Date().toJSON().slice(11, 19);

  ///handle message, show under the input champ
  handleMessageResponse(date, message, file_list, "#", false);

  // ///send to the server
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
      to: document
        .querySelector(".content_image_input_jheo_js")
        .getAttribute("data-toggle-userto-id"),

      ///message content
      message: message.replace("\n", ""),
      files: file_list,
    }),
  })
    .then((response) => response.json())
    .then((result) => {
      ///change status message
      const content_loading = document.querySelector(
        ".content_loading_jheo_js"
      );
      content_loading.innerHTML = "<i class='fa-solid fa-check'></i>";

      //// change the id the last message.
      const message_sent = document.querySelector("#message_id_jheo_js");
      message_sent.setAttribute("id", `message_${result.id}_jheo_js`);

      setTimeout(() => {
        content_loading.parentElement.removeChild(content_loading);
      }, 2000);

      document.querySelector(".message-active").setAttribute("data-date", new Date().toUTCString())

      document.querySelector("div.message-active > a > div > div.col-8 > p.text_message_jheo_js").textContent = message.length > 50 ? "(Message long) ..." : message

      document.querySelector("div.message-active > a > div > div.col-4 > p.heure_message").innerHTML = `à l'instant <i class="fa-regular fa-clock"></i>`
      
      /** Appel de triage de message */
  
      orderOldMessage()
  
      /** End appel triage */

    })
    .catch((e) => {
      const content_loading = document.querySelector(
        ".content_loading_jheo_js"
      );
      content_loading.innerHTML =
        "<i class='fa-solid fa-circle-exclamation error_message_status'></i>";
    });
}

//// SHOW MESSAGE ABOVE THE INPUT MESSAGE IN THE FIRST TIME

function handleMessageResponse(date, message, file_list = null, image, status) {
  const card_msg = document.createElement("div");
  card_msg.className = "qf rb";
  card_msg.setAttribute("id", "message_id_jheo_js");

  let image_html_list = "";
  if (file_list.length > 0) {
    file_list.forEach(({ type, name }) => {
      const file = type === "image" ? name : fileDefaults;
      image_html_list += `
                <div class="file_item">
                    <img class="message_image_item" src="${file}" alt="image" style="cursor:pointer;" 
                      data-bs-toggle="modal" data-bs-target="#modal_show_photo_mess_grp" onclick="setPhotoMessage(this)">
                    <a class="icon_download_file" href="${name}" download>
                        <i class="fa-solid fa-download"></i>
                    </a>
                </div>
            `;
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
    `;

  if (!status) {
    const content_loading = document.createElement("div");
    content_loading.className = "content_loading content_loading_jheo_js";
    content_loading.innerHTML = "<i class='fa-solid fa-spinner loading'></i>";

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
  document
    .querySelector("#search_friend_input")
    .addEventListener("keyup", function (e) {
      let target = e.target.value.toLowerCase();

      let divs = document.querySelectorAll("div.list_users > div.discussion");

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
    });
}

const imgs = document.querySelectorAll(
  "section > div.messages-chat.mode_pc > div > div > div > img"
);
const fullPage = document.querySelector("#fullpage");

imgs.forEach((img) => {
  img.addEventListener("click", function () {
    fullPage.style.backgroundImage = "url(" + img.src + ")";
    fullPage.style.display = "block";
  });
});

// let y = document.querySelector("span.jc.un.mn.zn.gs.use-in-agd-nanta_js_css").textContent.trim()
// console.log(y)

if (document.querySelector("#elie-btn-visio")) {
  document
    .querySelector("#elie-btn-visio")
    .addEventListener("click", (event) => {
      // $("#visioMessageElie").modal("show")
      document.querySelector("#visioMessageElie").classList.remove("d-none");
      document.querySelector("#visioMessageElie").style =
        "display:block !important;";

      document.querySelector(
        "#bodyVisioMessageElie"
      ).innerHTML = `<div class="d-flex justify-content-center mt-5">
        <div class="containt">
        <div class="word word-1">C</div>
        <div class="word word-2">M</div>
        <div class="word word-3">Z</div>
        </div>
        </div>
        `;
      console.log(event.target.dataset.roof);
      let roomRandom_msg = "Meet" + generateUID() + event.target.dataset.roof;

      document
        .querySelector(".btn-minimize-elie")
        .setAttribute(
          "data-onclick",
          `joinMeet('${roomRandom_msg}', 'bodyVisioMessageElie', this,'old')`
        );

      let msg_txt = `<div class="qb-chat vh-chat hi-chat vj-chat yr-chat el-chat yl-chat">
        <p class="text-info mb-2">
            <i class="fas fa-video-camera me-2 ms-1"></i>
            Appel en attente...
            <span onclick="joinMeet('${roomRandom_msg}', 'bodyVisioMessageElie', this,'old')" class="float-end badge text-bg-primary text-white cursor-pointer p-2"><i class="fa-solid fa-phone-volume" style="color: #1bff0a;"></i></span>
        
        </p> 
        </div>`;
      // <span onclick="cancelMeet('${roomRandom_msg}')"class="float-end badge text-bg-primary text-white cursor-pointer p-2"><i class="fa-solid fa-phone-slash" style="color: #ff0000;"></i></span>
      sendMessage(msg_txt, []);

      let amis = document.querySelector("div.content_entete_msg_jheo_js");

      document.querySelector("#bodyVisioMessageElie").innerHTML = "";

      runVisio(
        roomRandom_msg,
        amis.getAttribute("data-toggle-id-user-to"),
        "bodyVisioMessageElie"
      );
      // runVisio(roomRandom_msg, amis.getAttribute("data-toggle-id-user-to"),'content_discussion_elie')
    });
}

function cancelMeet(room) {
  console.log(apiJitsi);
  apiJitsi.executeCommand("hangup");
  // let msg_txt = `Appel refusé.`
  // sendMessage(msg_txt, [])
  // setStatusMeetByName(room, "finished")
}

function toggleClick(domHtml) {
  domHtml.classList.toggle("fa-minus-circle");
  domHtml.classList.toggle("fa-plus-circle");
}

function toggleAmisTribu(domHtml) {
  if (!domHtml.querySelector(".linkToActive_jheo_js")) {
    console.log("Selector not found: 'linkToActive_jheo_js'");
    return false;
  }

  const activeSwitch = domHtml.querySelector(".linkToActive_jheo_js");
  if (!activeSwitch.classList.contains("active")) {
    activeSwitch.classList.add("active");
  }

  const selector_list = activeSwitch.getAttribute("data-selector-list");
  if (
    document.querySelector(`.${selector_list}`).classList.contains("d-none")
  ) {
    document.querySelector(`.${selector_list}`).classList.remove("d-none");
  }

  const allSwitches = document.querySelectorAll(".linkToActive_jheo_js");
  allSwitches.forEach((item) => {
    if (item != activeSwitch) {
      const selector_list_other = item.getAttribute("data-selector-list");
      if (item.classList.contains("active")) {
        item.classList.remove("active");
      }
      if (
        !document
          .querySelector(`.${selector_list_other}`)
          .classList.contains("d-none")
      ) {
        document
          .querySelector(`.${selector_list_other}`)
          .classList.add("d-none");
      }
    }
  });
}

function toggleAmisMessage(domHtml) {
  if (!domHtml.querySelector(".linkToActive_tomm_js")) {
    console.log("Selector not found: 'linkToActive_tomm_js'");
    return false;
  }

  const activeSwitch = domHtml.querySelector(".linkToActive_tomm_js");
  if (!activeSwitch.classList.contains("active")) {
    activeSwitch.classList.add("active");
  }

  const selector_list = activeSwitch.getAttribute("data-selector-list");
  if (
    document.querySelector(`.${selector_list}`).classList.contains("d-none")
  ) {
    document.querySelector(`.${selector_list}`).classList.remove("d-none");
  }

  const allSwitches = document.querySelectorAll(".linkToActive_tomm_js");
  allSwitches.forEach((item) => {
    if (item != activeSwitch) {
      const selector_list_other = item.getAttribute("data-selector-list");
      if (item.classList.contains("active")) {
        item.classList.remove("active");
      }
      if (
        !document
          .querySelector(`.${selector_list_other}`)
          .classList.contains("d-none")
      ) {
        document
          .querySelector(`.${selector_list_other}`)
          .classList.add("d-none");
      }
    }
  });
}

window.addEventListener("load", (event) => {
  const currentUrl = window.location.href;

  let url = new URL(currentUrl);
  let params = new URLSearchParams(url.search);

  let user_id = 0;

  if (params.has("user_id")) {
    user_id = params.get("user_id");
  } else {
    user_id = document
      .querySelector(".content_entete_msg_jheo_js")
      ?.getAttribute("data-toggle-id-user-to");
  }

  if (document.querySelectorAll("div.content-message-nanta-css")) {
    document
      .querySelectorAll("div.content-message-nanta-css")
      .forEach((div) => {
        if (div.getAttribute("data-toggle-user-id") == user_id) {
          div.classList.add("message-active");
        }
      });
  }

  // document.querySelectorAll(".rb > div > div > p")
  if (document.querySelectorAll(".rb > div > div > p")) {
    document.querySelectorAll(".rb > div > div > p").forEach((p) => {
      p.classList.add("text-white");
    });
  }
});

// if(document.querySelector(".btn-minimize-elie")){
//     document.querySelector(".btn-minimize-elie").addEventListener("click", function (e) {
//         $("#visioMessageElie").modal("hide")

//         let room = document.querySelector(".btn-minimize-elie").getAttribute("data-room")

//         joinMeet(room, 'minimizeVisio', this)

//         let btn_expand = document.createElement("button")
//         btn_expand.setAttribute('onclick', "joinMeet('" + room + "','bodyVisioMessageElie', this)")
//         btn_expand.setAttribute('type', 'button')
//         btn_expand.classList = "btn-close btn-expand-elie"
//         btn_expand.innerHTML = '<i class="fa-solid fa-expand"></i><span class="tooltiptext tooltiptextAgrandir">Agrandir</span>'

//         document.querySelector("#minimizeVisio").appendChild(btn_expand)

//         btn_expand.addEventListener("click", function () {
//             $("#visioMessageElie").modal("show")
//             document.querySelector("#minimizeVisio").innerHTML = ""
//         })

//     })
// }

if (document.querySelector(".show_emojy_picker_jheo_js")) {
  const ctaShowEmojyPicker = document.querySelector(
    ".show_emojy_picker_jheo_js"
  );

  ctaShowEmojyPicker.addEventListener("click", () => {
    toggleEmojyPicker();
  });

  document
    .querySelector("emoji-picker")
    .addEventListener("emoji-click", (event) => {
      document.querySelector(".input_message_jheo_js").value +=
        event.detail.emoji.unicode;
    });
}

function toggleEmojyPicker() {
  const contentEmojyPicker = document.querySelector(
    ".content_emojy_picker_jheo_js"
  );
  contentEmojyPicker.classList.toggle("d-none");
}

function hideEmojyPicker() {
  const contentEmojyPicker = document.querySelector(
    ".content_emojy_picker_jheo_js"
  );
  if (!contentEmojyPicker.classList.contains("d-none")) {
    contentEmojyPicker.classList.add("d-none");
  }
}

/**
 * @author faniry
 * affiche la liste d'amis
 */
function fan() {
  fetch("/user/get/allfans").then((r) => {
    const ulContainer = document.querySelector(".fan_actif_tom_js");
    ulContainer.innerHTML = "";
    ulContainer.innerHTML = `<div class="spinner-border text-primary mx-auto" role="status">
                          <span class="visually-hidden">Loading...</span>
                        </div>`;

    if (r.status === 200 && r.ok) {
      r.json().then((jsons) => {
        const length = jsons.length;
        ulContainer.innerHTML = "";

        for (let i = 0; i < length; i++) {
          //pour les tribu T
          if (i === 0) {
            const tribusT = jsons[i];
            const tribusTLength = tribusT.length;

            for (let j = 0; j < tribusTLength; j++) {
              console;
              const amis = tribusT[j].amis;
              const bigContainer = document.createElement("div");
              bigContainer.style.background="#efe8e8cc";
              bigContainer.style.borderTop="2px solid #227BC9";
              const photoTribuT = tribusT[j]["logo_path"];
              const title = `Liste des partisans dans votre tribu T ${tribusT[j]["name_tribu_t_muable"]}`;
              const li = createListTribu(photoTribuT, title);
              bigContainer.setAttribute(
                "class",
                "list-group list-group-flush big_container_js d-none"
              );
              if(amis.length > 0)
                for (let c = 0; c < amis.length; c++) {
                  const div = createCardPartisan(amis[c]);
                  bigContainer.appendChild(div);
                }
              else{
                const span=document.createElement("span");
                span.innerText="Aucun partisan"
                bigContainer.appendChild(span);
              }

              li.appendChild(bigContainer);
              ulContainer.appendChild(li);
              hideContainer(li, bigContainer);
            }
          } else {
            //pour tribu G
            const tribuG = jsons[i];
            const tribuGLength = tribuG.length;
            let li = null;
            const bigContainer = document.createElement("div");
            bigContainer.style.background="#efe8e8cc";
            bigContainer.style.borderTop="2px solid #227BC9";
            bigContainer.setAttribute(
              "class",
              "list-group list-group-flush big_container_js d-none"
            );
if(tribuGLength > 0)
            for (let c = 0; c < tribuGLength; c++) {
              if (c === 0) {
                const photoTribuG = tribuG[c]["avatarTribuG"];
                const title = `Liste des partisans dans votre tribu G ${tribuG[c]["nom_tribuG"]}`;
                li = createListTribu(photoTribuG, title);
              }
              const div = createCardPartisan(tribuG[c]);
              bigContainer.appendChild(div);
            }
else{
                const span=document.createElement("span");
                 span.innerText="Aucun partisan"
                 bigContainer.appendChild(span);
            }

            li.appendChild(bigContainer);
            ulContainer.appendChild(li);
            hideContainer(li, bigContainer);
          }
        }
        updateListFan();

        myMessageWorker.onmessage = (e) => {
          reRenderPartisanStatus(e.data);
        };
      });
    }
  });
}

/**
 *@author tommy
@deprecated since version
 *cette fonction affiche la liste des users actifs
 *localisation message.js
 */
function fanOld() {
  fetch("/user/get/fan/online").then((r) => {
        if (r.status === 200 && r.ok) {
      r.json().then((datas) => {
        if (document.querySelector(".only"))
          document.querySelector(".only").textContent = "";
        const ul = document.querySelector(".fan_actif_tom_js");
        ul.innerHTML = ``;
        let i = 0;
        let length = {
          tribuT: 1,
          tribug: 1,
        };
        for (let j = 0; j < datas.length; j++) {
          if (j === 0) {
            for (let m = 0; m < datas[j].length; m++) {
            console.log(datas[j][m].amis);
            let data = datas[j][m].amis;
            length.tribuT = data === undefined ? 0 : data.length;
            for (let value of data) {
              let li = document.createElement("li");
              li.setAttribute("class", "fan_activ_i_faniry_js");
              li.dataset.toggleUserId = value.id;
              const photoProfil =
                value.image_profil != null
                  ? "/public" + value.image_profil
                  : "/public/uploads/users/photos/default_pdp.png";
              const link = "/user/message/perso?user_id=" + value.id;
              const fullName = value.firstname + " " + value.lastname;
              li.innerHTML = `
                                <div class="cg lc mg sh ol rl tq is content-message-nanta-css last_msg_user_${value.id}_jheo_js" data-toggle-user-id="${value.id}" data-message-id={{last_message.id is defined ? last_message.id : '0' }}>
                                    <div class="h mb sc yd of th">
                                        <img src="${photoProfil}" class="vc yd qk rk elie-pdp-modif" style="cursor:pointer;" data-bs-toggle="modal" data-bs-target="#modal_show_photo_mess" onclick="setPhotoMessage(this)"/>
                                        <span class="g l m jc wc ce th pi ij xj"></span>
                                    </div>
    
                                   
                                    <a href="${link}" class="yd">
                                        <div class="row">
                                            <div class="col-8">
                                                <h5 class="mn un zn gs">
                                                    ${fullName}
                                                </h5>
    
                                            </div>
                                            <div class="col-4">
                                                <p class="heure_message">14:15 <i class="fa-regular fa-clock"></i></p>
                                            </div>
                                        </div>
    
    
    
                                    </a>
                                </div>
                            `;
              ul.appendChild(li);
            }
          }
          } else if (j != 0 && datas[j]) {
            let data = datas[j];
            length.tribug = data.length;
            for (let value of data) {
              let li = document.createElement("li");
              li.setAttribute("class", "fan_activ_i_faniry_js");
              li.dataset.toggleUserId = value.id;
              const photoProfil =
                value.image_profil != null
                  ? "/public" + value.image_profil
                  : "/public/uploads/users/photos/default_pdp.png";
              const link = "/user/message/perso?user_id=" + value.id;
              const fullName = value.firstname + " " + value.lastname;

              const is_online =
                value.is_online == 0 ? "background-color:gray" : "";

              li.innerHTML = `
                                <div class="cg lc mg sh ol rl tq is content-message-nanta-css last_msg_user_${value.id}_jheo_js" data-toggle-user-id="${value.id}" data-message-id={{last_message.id is defined ? last_message.id : '0' }}>
                                    <div class="h mb sc yd of th">
                                        <img src="${photoProfil}" class="vc yd qk rk elie-pdp-modif" style="cursor:pointer;" data-bs-toggle="modal" data-bs-target="#modal_show_photo_mess" onclick="setPhotoMessage(this)"/>
                                        <span class="g l m jc wc ce th pi ij xj" style="${is_online}"></span>
                                    </div>
    
                                   
                                    <a href="${link}" class="yd">
                                        <div class="row">
                                            <div class="col-8">
                                                <h5 class="mn un zn gs">
                                                    ${fullName}
                                                </h5>
    
                                            </div>
                                            <div class="col-4">
                                                <p class="heure_message">14:15 <i class="fa-regular fa-clock"></i></p>
                                            </div>
                                        </div>
    
    
    
                                    </a>
                                </div>
                            `;
              ul.appendChild(li);
            }
          }
        }
        console.log(length);
        if (length.tribuT === 0 && length.tribug === 0) {
          if (document.querySelector(".only")) {
            document.querySelector(".only").textContent = "";
            document.querySelector(".only").textContent =
              "Aucun fan n'est actif.";
          } else {
            ul.parentElement.innerHTML +=
              '<span class="only">Aucun fan n\'est actif.</span>';
          }
        }

        const fans = document.querySelectorAll(`.fan_activ_i_faniry_js`);
        let results = removeReplicatedFan(fans);
        if (results.length > 0) {
          const fanOnlineContainer = document.querySelector(
            "ul.fan_actif_tom_js"
          );
          fans.forEach((item) => {
            try {
              //console.log(item);
              fanOnlineContainer.removeChild(item);
            } catch (error) {
              console.log(error);
            }
          });
          results.forEach((item) => {
            fanOnlineContainer.appendChild(item);
          });
        }
      });
    }
  });
}

if (
  location.href.includes("/user/all/message") ||
  location.href.includes("/user/message/perso")
) {
  const fanss = document.querySelectorAll(`.mpcm_faniry_js`);
  // console.log(fanss);
  let results = removeReplicatedFan(fanss);
  if (results.length > 0) {
    const fanOnlineContainer = document.querySelector(
      "div.all_mpcmz_faniry_js "
    );
    fanss.forEach((item) => {
      fanOnlineContainer?.removeChild(item);
    });
    results.forEach((item) => {
      fanOnlineContainer?.appendChild(item);
    });
  }
}

/**
 *@author Faniry Team <faniryandriamihaingo@gmail.com> doesn't disturb me when I'm off
*cette fonction recherche des amis 
*@param {*} event
*@param {*} myaction1 ce parametre est une fonction ,qui est utilisé que lorsque vous mettez useDefaulContainer à false,
*@param {*} myaction2 ce parametre est une fonction et prend en parametre un json ,qui est utilisé que lorsque vous mettez useDefaulContainer à false,
@param {boolean} [useDefaulAction=true]   
*/
function lookupFan(
  event,
  useDefaulAction = true,
  myaction1 = null,
  myaction2 = null
) {
  const target = event.target;
  clearTimeout(lookupFanDebounce);
  if (target != null && target instanceof HTMLElement) {
    let word = target.value;
    if (word.length > 2) {
      lookupFanDebounce = setTimeout(() => {
        if (!useDefaulAction) createLoader();
        fetch(`/user/look/${word}`, { method: "GET" }).then((r) => {
          if (r.status === 200 && r.ok) {
            if (useDefaulAction) {
            const lookContainer = document.querySelector(
              ".lookup_fan_result_tom_js"
            );
            lookContainer.innerHTML = "";
            r.json().then((jsons) => {
              if (jsons.length > 0) {
                for (let json of jsons) {
                  const link = "/user/message/perso?user_id=" + json.user_id;
                  const fullname = json.firstname + " " + json.lastname;
                  const anchorElement = document.createElement("a");
                  anchorElement.href = link;
                  anchorElement.innerHTML = `<span class="fan_name fan_name_tom_js">${fullname}</span>`;
                  lookContainer.appendChild(anchorElement);
                }
                lookContainer.classList.remove("d-none");
              } else {
                const anchorElement = document.createElement("a");
                anchorElement.innerHTML = `<span class="fan_name fan_name_tom_js">Aucune résulta.</span>`;

                lookContainer.appendChild(anchorElement);
                document
                  .querySelector(".lookup_fan_result_tom_js")
                  .classList.toggle("d-none");
                swal({
                    title: "Oops...",
                    text: "Aucune résulta.",
                    icon: "error",
                    button: "OK",
                  });
              }
            });
          } else {
            createLoader(true);
              r.json().then((jsons) => {
                if (jsons.length > 0) {
                  myaction2(jsons);
                } else {
                  swal({
                    title: "Oops...",
                    text: "Erreur 500!",
                    icon: "error",
                    button: "OK",
                  });
                }
              });
            }
          } else {
            swal({
              title: "Oops...",
              text: "Erreur 500!",
              icon: "error",
              button: "OK",
            });
          }
        });
      }, 3000);
    } else if (word.length === 0) {
      if (useDefaulAction) {
        const lookContainer = document.querySelector(
          ".lookup_fan_result_tom_js"
        );
      lookContainer.classList.add("d-none");
    } else {
        //todo mettre à jour
        myaction1();
      }
    }
  }
}

/**
 * @author Faniry
 * cette fonction enleve les donnée repété dans la liste  fan connecté
 */
function removeReplicatedFan(element) {
  let userIds = [];
  let result = [];
  if (element.length > 0) {
    element.forEach((value) => {
      let userId = parseInt(value.dataset.toggleUserId);
      if (!userIds.includes(userId)) {
        result.push(value.cloneNode(true));
        userIds.push(userId);
      }
    });
  }

  return result;
}

/**
 * @author Faniry
 * cette fonction liste les messages groupé de tous les tribus
 * localisation: message.js
 */
function showListTribus() {
  fetch("/user/get/allTribu").then((response) => {
    if (response.status === 200 && response.ok) {
      response.json().then((jsons) => {
        const ul = document.querySelector(".msg_grp_faniry_js");
        ul.innerHTML = "";
        for (let i = 0; i < jsons.length; i++) {
          if (i === 0) {
            //pour tribu G
            const json = jsons[i];
            const tribuGName = `tribu G ${json.commune} ${json.quartier}`;
            const logoPath = json.tribugAvatar;
            const link = `/user/tribu/msg?name=${json.tableTribuG}&type=g`;
            const li = document.createElement("li");
            li.setAttribute("class", "fan_activ_faniry_js");
            li.dataset.toggleTribuGId = json.tableTribuG;
//<span class="g l m jc wc ce th pi ij xj"></span>
            li.innerHTML = `
                                <div class="cg lc mg sh ol rl tq is content-message-nanta-css last_msg_user_${json.id}_jheo_js" data-toggle-user-id="${json.id}" data-message-id={{last_message.id is defined ? last_message.id : '0' }}>
                                    <div class="h mb sc yd of th">
                                        <img src="/public${logoPath}" class="vc yd qk rk elie-pdp-modif" style="cursor:pointer;" data-bs-toggle="modal" data-bs-target="#modal_show_photo_mess" onclick="setPhotoMessage(this)"/>
                                        
                                    </div>
                                    <a href="${link}" class="yd">
                                        <div class="row">
                                            <div class="col-8">
                                                <h5 class="mn un zn gs">
                                                    ${tribuGName}
                                                </h5>
    
                                            </div>
                                            <div class="col-4">
                                                
                                            </div>
                                        </div>
                                    </a>
                                </div>
                            `;
            ul.appendChild(li);
          } else {
//<span class="g l m jc wc ce th pi ij xj"></span>
            let tribuTs = jsons[i];
            for (let tribut of tribuTs) {
              const tribuTimmuable = tribut.table_name;
              const tribuTname = tribut.name_tribu_t_muable;
              const logoPath =
                tribut.logo_path != ""
                  ? tribut.logo_path
                  : "/uploads/tribus/avatar_tribu.jpg";
              const link = `/user/tribu/msg?name=${tribut.table_name}&type=t`;
              const li = document.createElement("li");
              li.setAttribute("class", "fan_activ_faniry_js");
              li.dataset.toggleTribuGId = tribuTname;
              li.innerHTML = `
                                <div class="cg lc mg sh ol rl tq is content-message-nanta-css last_msg_user_${tribut.id}_jheo_js" data-toggle-user-id="${tribut.id}" data-message-id={{last_message.id is defined ? last_message.id : '0' }}>
                                    <div class="h mb sc yd of th">
                                        <img src="/public${logoPath}" class="vc yd qk rk elie-pdp-modif" style="cursor:pointer;" data-bs-toggle="modal" data-bs-target="#modal_show_photo_mess" onclick="setPhotoMessage(this)"/>
                                        
                                    </div>
                                    <a href="${link}" class="yd">
                                        <div class="row">
                                            <div class="col-8">
                                                <h5 class="mn un zn gs">
                                                    ${tribuTname}
                                                </h5>
    
                                            </div>
                                            <div class="col-4">
                                                
                                            </div>
                                        </div>
                                    </a>
                                </div>
                            `;
              ul.appendChild(li);
            }
          }
        }
      });
    }
  });
}

/**
 * @author Elie
 * Triage message dans l'ordre decrossant
 */
function orderOldMessage() {
  // Trier messages templates
  let parent = document.querySelector(
    "div.all_mpcmz_faniry_js"
  );

  if (parent) {
    let ms = document.querySelectorAll(
      "div.all_mpcmz_faniry_js > div.content-message-nanta-css"
    );
    let datas = [];
    ms.forEach((m) => {
      let dt = m.getAttribute("data-date");
      datas.push([m, new Date(dt)]);
    });

    datas.sort((a, b) => {
      return b[1] - a[1];
    });
    parent.innerHTML = "";
    datas.forEach((el) => {
      parent.appendChild(el[0]);
    });
  }
}

/** Appel de triage de message */

orderOldMessage();

/** End appel triage */
