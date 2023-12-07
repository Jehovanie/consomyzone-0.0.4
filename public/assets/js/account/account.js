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
      document.querySelector(".badge_message_jheo_js").innerText = `${parseInt(
        new_nbr_message
      )}`;
      notificationSong();
    } else if (parseInt(new_nbr_message) === 0) {
      if (!badge_msg.classList.contains("d-none")) {
        badge_msg.classList.add("d-none");
        document.querySelector(".badge_message_jheo_js").innerText = "0";
      }
    }
  };

  //// GET ALL MESSAGES AND PUT INTO POPUP MODAL
  const event_source_show_message = new EventSource("/user/show/message");
  event_source_show_message.onmessage = function (event) {
    /// last message for each user
    const new_message = JSON.parse(event.data);
    //console.log("new message: " + JSON.parse(event.data));
    ////check number message not read
    const message_not_read = new_message.filter(
      (item) => parseInt(item.message.isRead) === 0
    );
    const new_nbr_message = message_not_read.length;
    if (new_nbr_message > 0) {
      document.querySelector(".nbr_message_jheo_js").innerText =
        new_nbr_message > 9 ? new_nbr_message : `0${new_nbr_message}`;
    }

    const notificationContainer = document.querySelector(
      ".content_card_msg_jheo_js"
    );

    let allUserAlreadyInNotifications = [];
    let oldMessageNotifId = [];
    let obj = {};
    const currentUser = document.querySelector(".ref_tom_js").dataset.roof;

    if (notificationContainer) {
      const allNotifications = Array.from(
        notificationContainer.querySelectorAll(".show_single_msg_popup_jheo_js")
      );
      // let map2 = new Map();
      //get cookie
      
      if (Cookies2.get("_egemonie_n_" + currentUser) != undefined) {
            //console.log("ato express")
            let tmp = Cookies2.get("_egemonie_n_" + currentUser);

            Cookies2.set("_egemonie_0_" + currentUser, tmp, {
             expires: 30,
             secure: true,
           });
           
      } else {
        //set cookie old

        console.log("tsy misy lty a")
        for (let notif of Array.from(allNotifications)) {
          for (let msg of new_message) {
            if (notif.dataset.toggleOtherId == msg.message.user_post) {
              obj = { [notif.dataset.toggleOtherId]: parseInt(notif.id) };
              oldMessageNotifId.push(obj);
            }
          }
        }
        let tmp = JSON.stringify(oldMessageNotifId)
        
        Cookies2.set("_egemonie_0_" + currentUser, JSON.stringify(tmp), {
          expires: 30,
          secure: true,
        });
      }

      //get all user list
      allUserAlreadyInNotifications =
        allNotifications.length > 0
          ? allNotifications.map((notif) =>
              parseInt(notif.dataset.toggleOtherId)
            )
          : [];
    }
    // console.log(oldAllNotificationsId);
    // console.log(allUserAlreadyInNotifications);

    /// check if there is no message in the modal.
    if (
      document.querySelectorAll(".show_single_msg_popup_jheo_js").length === 0
    ) {
      /// show all last messages for each user
      new_message.forEach((single_message) => {
        ///card message
        createAndAddCardMessage(
          single_message.message.id,
          single_message.message.user_post,
          single_message.firstname,
          single_message.lastname,
          single_message.message.content,
          single_message.message.isForMe,
          single_message.message.isRead,
          single_message.profil
        );
      });
    } else {
      /// there is alread card message

      /// get all card message exit
      const div_message_already_show = document.querySelectorAll(
        ".show_single_msg_popup_jheo_js"
      );

      //// get all id message in the popup
      const tab_id_msg_already_show = [];
      //set cookie here
      let obj2 = [];
      let oldMessageNotifId2 = [];
      
      
      for (let notif of Array.from(div_message_already_show)) {
        for (let msg of new_message) {
          if (notif.dataset.toggleOtherId == msg.message.user_post ) {
              obj2 = { [notif.dataset.toggleOtherId]: msg.message.id };
               oldMessageNotifId2.push(obj2);
          }
        }
      }
      Cookies2.set(
        "_egemonie_n_" + currentUser,
        JSON.stringify(oldMessageNotifId2),
        { expires: 30, secure: true }
      );
      div_message_already_show.forEach((element) => {
        //set cookies here

        const dataOtherId = parseInt(
          element.getAttribute("data-toggle-other-id")
        );
        if (
          new_message.some(
            (jtem) => parseInt(jtem.message.user_post) === dataOtherId
          )
        ) {
          const dataMsg = new_message.find(
            (jtem) => parseInt(jtem.message.user_post) === dataOtherId
          );

          // card_msg.className= ` ... show_single_msg_popup_jheo_js ${ parseInt(isRead) !== 1 ? 'gray400' : '' } msg_${other_id}_js_jheo`;
          if (dataMsg) {
            if (parseInt(dataMsg.message.isRead) !== 1) {
              const divMsg = document.querySelector(
                `.msg_${dataMsg.message.user_post}_js_jheo`
              );

              divMsg.id = dataMsg.message.id;
              if (divMsg && !divMsg.classList.contains("gray400")) {
                divMsg.classList.add("gray400");

                ///push to up
                const parentSingle = divMsg.parentElement;
                const single = divMsg.cloneNode(true);
                divMsg.remove();
                parentSingle.prepend(single);
              }
            }
          }
        }
        tab_id_msg_already_show.push(dataOtherId);
      });

      //// filter new message from server and show the message don't show
      const new_msg = new_message.filter(
        (item) =>
          !tab_id_msg_already_show.includes(parseInt(item.message.user_post))
      );

      if (new_msg.length > 0) {
        /// for each rest message let's show
        new_msg.forEach((single_message) => {
          createAndAddCardMessage(
            single_message.message.id,
            single_message.message.user_post,
            single_message.firstname,
            single_message.lastname,
            single_message.message.content,
            single_message.message.isForMe,
            single_message.message.isRead,
            single_message.profil
          );
        });
      }
    }

    showToastMessage(new_message, allUserAlreadyInNotifications);

    //// inside message link message discussion
    if (
      document.querySelector(".content_list_tribuG_jheo_js") &&
      document.querySelector(".content_list_tribuT_jheo_js")
    ) {
      new_message.forEach(({ message }) => {
        ///card message
        if (
          document.querySelectorAll(
            `.last_msg_user_${message.user_post}_jheo_js`
          )
        ) {
          const allMessageUserID = document.querySelectorAll(
            `.last_msg_user_${message.user_post}_jheo_js`
          );
          allMessageUserID.forEach((single) => {
            const lastMessageID = single.getAttribute("data-message-id"); /// last message ID use to chech new appear

            if (parseInt(lastMessageID) !== parseInt(message.id)) {
              /// check if new appear

              const messageType = message.message_type; /// new message type
              const messageContent = JSON.parse(message.content); //// messageContent Object  { files: ..., images : [... ], files: [... ] }

              const isForMe = message.isForMe === 0 ? "vous: " : ""; //// befor the message

              const content =
                messageContent.text.length > 50
                  ? "(Message long) ..."
                  : messageContent.text;

              if (messageType === "text") {
                //// check the new type message
                single.querySelector(".text_message_jheo_js").innerText =
                  isForMe + content;
              } else {
                single.querySelector(".text_message_jheo_js").innerText =
                  isForMe + "(object)";
              }

              if (parseInt(message.isRead) === 0) {
                single
                  .querySelector(".text_message_jheo_js")
                  .classList.add("wn");
              }

              const parentSingle = single.parentElement;
              single.remove();
              parentSingle.prepend(single);

              single.setAttribute("data-message-id", message.id);
            }
          });
        }
      });
    }
  };

  /////GET NOTIFICATION AND SETTINGS
  const event_source_notification = new EventSource("/user/show/notification");
  event_source_notification.onmessage = function (event) {
    if (event.data != "") {
      /// all notifications
      const all_notification = JSON.parse(event.data);
      const notificationContainer = document.querySelector(
        ".content_card_notification_jheo_js"
      );
      let oldAllNotificationsId = [];
      if (notificationContainer) {
        const allNotifications = Array.from(
          notificationContainer.querySelectorAll(".single_notif_jheo_js")
        );
        oldAllNotificationsId =
          allNotifications.length > 0
            ? allNotifications.map((notificationContainer) =>
                parseInt(notificationContainer.dataset.toggleNotifId)
              )
            : [];
      }

      //// update number notifications and show red badge when there is new notification don't show
      updateNbrNotificationAndShowBadge(all_notification);

      //// generate new notification
      injectNewCardNotification(all_notification);

      showToastNotification(all_notification, oldAllNotificationsId);

      //// update all sse
      updateAllWhenStateChange(all_notification);

      ///will generate toast js
    }
  };
}

if (document.querySelector(".message_jheo_js")) {
  const message_icon = document.querySelector(".message_jheo_js");

  message_icon.addEventListener("click", () => {
    if (document.querySelectorAll(".show_single_msg_popup_jheo_js")) {
      const all_card_message = document.querySelectorAll(
        ".show_single_msg_popup_jheo_js"
      );
      const data = [];
      all_card_message.forEach((card) => {
        const single_data = {
          notif_id: card.getAttribute("data-toggle-other-id"),
        };
        data.push(single_data);
      });

      fetch("/user/setshow/messages", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          //// show badge red notification
          const badge_message = document.querySelector(
            ".badge_message_jheo_js"
          );
          if (badge_message && !badge_message.classList.contains("hidden")) {
            badge_message.classList.add("hidden");
          }
          return res.json();
        })
        .then((res) => {
          if (res) {
            console.log(res);
          }
        });
    }
  });
}

if (document.querySelector(".notification_jheo_js")) {
  const notif_icon = document.querySelector(".notification_jheo_js");

  notif_icon.addEventListener("click", () => {
    if (document.querySelectorAll(".single_notif_jheo_js")) {
      const all_card_message = document.querySelectorAll(
        ".single_notif_jheo_js"
      );

      const data = [];

      all_card_message.forEach((card) => {
        const single_data = {
          notif_id: card.getAttribute("data-toggle-notif-id"),
        };

        data.push(single_data);
      });

      fetch("/user/notification/show", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((res) => {
          //// show badge red notification
          const content_alert_notif = document.querySelector(
            ".content_alert_new_notification_jheo_js"
          );
          const alert_new_notification = document.querySelector(
            ".alert_new_notification_jheo_js"
          );

          if (
            content_alert_notif &&
            !content_alert_notif.classList.contains("d-none")
          ) {
            content_alert_notif.classList.add("d-none");
          }

          alert_new_notification.innerText = "0";
          return res.json();
        })
        .then((res) => {
          if (res) {
            console.log(res);
          }
        });
    }
  });
}

//// delete the all input in form is the user cancelled the publication.
if (document.querySelector(".annulation_pub_js_jheo")) {
  document.querySelector(".annulation_pub_js_jheo").onclick = () => {
    document.querySelector("#publication_legend").value = null;
    document.querySelector("#publication_photo").value = null;
  };

  document.querySelector(".modal-header .btn-close").onclick = () => {
    document.querySelector("#publication_legend").value = null;
    document.querySelector("#publication_photo").value = null;
  };
}

/**

 *@author Tommy

 */

if (document.querySelectorAll(".radio-publi").length > 0) {
  document.querySelectorAll(".radio-publi").forEach((item) => {
    item.addEventListener("change", (e) => {
      if (e.target.checked && e.target.id == "man-valid") {
        //TODO something
        //split(":")[2].split("\.")[1].replace(/[^0-9]/g,"")
      } else if (e.target.checked && e.target.id == "auto-validd") {
        //TODO something
      }
    });
  });
}

if (document.querySelector(".banished")) {
  document.querySelector(".banished").onclick = (e) => {
    const request = new Request("/set/banished", {
      method: "POST",

      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },

      body:
        "id=" +
        encodeURIComponent(
          parseInt(
            e.target.dataset.token
              .split(":")[2]
              .split(".")[1]
              .replace(/[^0-9]/g, ""),
            10
          )
        ),
    });

    fetch(request);
  };
}

if (document.querySelector(".retablir")) {
  document.querySelector(".retablir").onclick = (e) => {
    const request = new Request("/undo/banished", {
      method: "POST",

      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },

      body:
        "id=" +
        encodeURIComponent(
          parseInt(
            e.target.dataset.token
              .split(":")[2]
              .split(".")[1]
              .replace(/[^0-9]/g, ""),
            10
          )
        ),
    });

    fetch(request);
  };
}

if (document.querySelector("#send-request")) {
  document.getElementById("send-request").onclick = (e) => {
    const idReceiver = new URL(location.href).searchParams.get("user_id");

    const request = new Request("/send/notification/ask", {
      method: "POST",

      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },

      body: "id=" + encodeURIComponent(parseInt(idReceiver, 10)),
    });

    fetch(request).then((response) => {
      if (response.ok && response.status == 200) {
        let div = document.createElement("div");

        div.setAttribute("class", "succes_message request_success");

        div.innerHTML = "<p>invitation bien envoyé </p>";

        document.querySelector("main").appendChild(div);

        setTimeout(() => {
          div.classList.add("disabled_notif_success");
        }, 4000);
      }
    });
  };
}

/**---------------------end tommy----------------- */

/**
 * @author faniry
 * cette fonction fait apparaitre des toast pour les notifications pour plus de visibilité
 * @param int[] notifications  (le resultat du query du sse )
 * @param int[] allNotificationsId  (les notifications dèja charger par l'appli)
 */
function showToastNotification(notifications, allNotificationsId) {
  if (allNotificationsId.length > 0)
    for (const notification of notifications) {
      if (allNotificationsId.indexOf(parseInt(notification.id)) < 0) {
        console.log(
          "eee " +
            notification.id +
            " " +
            allNotificationsId.indexOf(parseInt(notification.id))
        );
        const div = document.createElement("div");
        div.setAttribute("id", `toast_faniry_${notification.id}`);
        div.innerHTML = `<a class="lc kg ug" href="${
          notification.notification_type
        }">
                            <div class="h sa wf uk th ni ej cb">
                                <img class="image_profil_navbar_msg" src="${
                                  notification.photoDeProfil
                                    ? "/public" + notification.photoDeProfil
                                    : "/public/uploads/users/photos/default_pdp.png"
                                }" alt="User"/>
                            </div>
                            <div>
                                <figure>
                                    <blockquote class="blockquote">
                                        <h6 class="un zn gs">
                                            ${notification.fullname}
                                        </h6>
                                        <p class="mn hc">
                                            ${notification.content}
                                        </p>
                                    </blockquote>
                                    <figcaption class="blockquote-footer" style="float: right;">
                                        <cite class="fontSize07">${
                                          notification.datetime
                                        }</cite>
                                    </figcaption>
                                </figure>
                            </div>
                        </a>`;
        const alert = "#842029",
          info = "#084298",
          news = "#055160";
        const bg_alert = "#f8d7da",
          bg_info = "#cfe2ff",
          bg_news = "#cff4fc";
        const duration = -1;
        const timeOutDelay = 600;

        const audio = new Audio(
          "https://drive.google.com/uc?export=download&id=1M95VOpto1cQ4FQHzNBaLf0WFQglrtWi7"
        );
        audio
          .play()
          .then((r) => {})
          .catch((error) => {
            console.log(error);
          })
          .finally(() => {
            Toastify({
              // text: message,
              node: div,
              duration: duration,
              // destination: "https://github.com/apvarun/toastify-js",
              // newWindow: true,
              close: true,
              gravity: "bottom", // `top` or `bottom`
              position: "left", // `left`, `center` or `right`
              stopOnFocus: true, // Prevents dismissing of toast on hover
              style: {
                //color: alert ,
                background: "linear-gradient(to right, #00b09b, #96c93d)",
                fontSize: "0.9rem",
                width: "350px",
                maxWidth: screen.width <= 375 ? "75vw" : "93vw",
              },
              // onClick: function(){ // Callback after click
              //     clickedOnToastMessage(toastId)
              // }
            }).showToast();
          });
        // setTimeout(() => {

        // }, timeOutDelay);
      }
    }
}

function showToastMessage(
  allMessageNotifications,
  allUserAlreadyInNotifications
) {
  // retrieve to cookies oldMessages,
  const currentUser = document.querySelector(".ref_tom_js").dataset.roof;
  const oldMessagesStr = Cookies2.get("_egemonie_0_" + currentUser);
  const oldMessages=JSON.parse(oldMessagesStr);
  //console.log(oldMessages);
  if (oldMessages.length > 0 && allUserAlreadyInNotifications.length > 0) {
    for (const message of allMessageNotifications) {
      const userLastName = message.lastname;
      const userFirstName = message.firstname;
      const profil = message.profil;
      const userId = parseInt(message.message.user_post); // id user who send message
      const mesageId = message.message.id; // new message
      const messageTextContent = JSON.parse(message.message.content).text;

      const toastMessageElement = document.querySelector(
        `#toast_message_faniry_${mesageId}_js`
      );

      if (!toastMessageElement) {
        if (allUserAlreadyInNotifications.indexOf(userId) != -1) {
           let oldmesageId=0;
            for(let oldMessage of oldMessages){
                 for(let [key, value] of Object.entries(oldMessage) ){
                      if(key== userId){
                          oldmesageId = parseInt(value);	
                          break;
                      }
                 }
            }
          if (mesageId != oldmesageId && oldmesageId!=0) {
            if (messageTextContent.includes('<div class="qb-chat')) {
              if (window.location.pathname.includes("user/message/perso")) {
                showNotifVisoCallWithSound(
                  profil,
                  mesageId,
                  userId,
                  userFirstName,
                  userLastName,
                  message
                );
              } else {
                showNotifVisoCallWithSound(
                  profil,
                  mesageId,
                  userId,
                  userFirstName,
                  userLastName,
                  message
                );
              }
            } else {
              showNotifMessageWithSound(
                profil,
                mesageId,
                userId,
                userFirstName,
                userLastName,
                message
              );
            }
          }
        } else {
          if (messageTextContent.includes('<div class="qb-chat')) {
            ///user/message/perso
            if (window.location.pathname.includes("user/message/perso")) {
              showNotifVisoCallWithSound(
                profil,
                mesageId,
                userId,
                userFirstName,
                userLastName,
                message
              );
            } else {
              showNotifVisoCallWithSound(
                profil,
                mesageId,
                userId,
                userFirstName,
                userLastName,
                message
              );
            }
          } else {
            showNotifMessageWithSound(
              profil,
              mesageId,
              userId,
              userFirstName,
              userLastName,
              message
            );
          }
        }
      }
    }
  }
}

/**
 * @author faniry
 * @param {*} profil
 * @param {*} mesageId
 * @param {*} userId
 * @param {*} userFirstName
 * @param {*} userLastName
 * @param {*} message
 * cette fonction a pour but de montrer un toast message lorsqu'il y a un appel
 * sans audio
 */
function justShowSimpleToastWithoutSound(
  profil,
  mesageId,
  userId,
  userFirstName,
  userLastName,
  message
) {
  div.setAttribute("id", `toast_message_faniry_${mesageId}_js`);
  div.innerHTML = `<a class="lc kg ug" href="/user/message/perso?user_id=${userId}">
                            <div class="h sa wf uk th ni ej cb">
                                <img class="image_profil_navbar_msg" src="${
                                  profil
                                    ? "/public" + profil
                                    : "/public/uploads/users/photos/default_pdp.png"
                                }" alt="User"/>
                            </div>
                            <div>
                                <figure>
                                    <blockquote class="blockquote">
                                        <h6 class="un zn gs">
                                           Vous avez reçu un nouveau message de
                                        </h6>
                                        <p class="mn hc">
                                            ${
                                              userFirstName + " " + userLastName
                                            }
                                        </p>
                                    </blockquote>
                                    <figcaption class="blockquote-footer" style="float: right;">
                                        <cite class="fontSize07">${
                                          message.message.datetime
                                        }</cite>
                                    </figcaption>
                                </figure>
                            </div>
                        </a>`;

  const duration = -1;
  Toastify({
    // text: message,
    node: div,
    duration: duration,
    // destination: "https://github.com/apvarun/toastify-js",
    // newWindow: true,
    close: true,
    gravity: "bottom", // `top` or `bottom`
    position: "left", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      //color: alert ,
      background: "linear-gradient(to right, #00b09b, #96c93d)",
      fontSize: "0.9rem",
      width: "350px",
      maxWidth: screen.width <= 375 ? "75vw" : "93vw",
    },
    // onClick: function(){ // Callback after click
    //     clickedOnToastMessage(toastId)
    // }
  }).showToast();
}

/**
 * @author faniry
 * @param {*} profil
 * @param {*} mesageId
 * @param {*} userId
 * @param {*} userFirstName
 * @param {*} userLastName
 * @param {*} message
 * cette fonction a pour but de montrer un toast message pour les messages lorsqu'il y a un appel
 * avec audio
 */
function showNotifMessageWithSound(
  profil,
  mesageId,
  userId,
  userFirstName,
  userLastName,
  message
) {
  const div = document.createElement("div");
  div.setAttribute("id", `toast_message_faniry_${mesageId}_js`);
  div.innerHTML = `<a class="lc kg ug" href="/user/message/perso?user_id=${userId}">
                            <div class="h sa wf uk th ni ej cb">
                                <img class="image_profil_navbar_msg" src="${
                                  profil
                                    ? "/public" + profil
                                    : "/public/uploads/users/photos/default_pdp.png"
                                }" alt="User"/>
                            </div>
                            <div>
                                <figure>
                                    <blockquote class="blockquote">
                                        <h6 class="un zn gs">
                                           Vous avez reçu un nouveau message de
                                        </h6>
                                        <p class="mn hc">
                                            ${
                                              userFirstName + " " + userLastName
                                            }
                                        </p>
                                    </blockquote>
                                    <figcaption class="blockquote-footer" style="float: right;">
                                        <cite class="fontSize07">${
                                          message.message.datetime
                                        }</cite>
                                    </figcaption>
                                </figure>
                            </div>
                        </a>`;

  const duration = -1;

  const audio = new Audio(
    "https://drive.google.com/uc?export=download&id=1M95VOpto1cQ4FQHzNBaLf0WFQglrtWi7"
  );
  audio
    .play()
    .then((r) => {})
    .catch((error) => {
      console.log(error);
    })
    .finally(() => {
      Toastify({
        // text: message,
        node: div,
        duration: duration,
        // destination: "https://github.com/apvarun/toastify-js",
        // newWindow: true,
        close: true,
        gravity: "bottom", // `top` or `bottom`
        position: "left", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          //color: alert ,
          background: "linear-gradient(to right, #00b09b, #96c93d)",
          fontSize: "0.9rem",
          width: "350px",
          maxWidth: screen.width <= 375 ? "75vw" : "93vw",
        },
        // onClick: function(){ // Callback after click
        //     clickedOnToastMessage(toastId)
        // }
      }).showToast();
    });
}

/**
 * @author faniry
 * @param {*} profil
 * @param {*} mesageId
 * @param {*} userId
 * @param {*} userFirstName
 * @param {*} userLastName
 * @param {*} message
 * cette fonction a pour but de montrer un toast message pour les appel visio lorsqu'il y a un appel
 * avec audio
 */
function showNotifVisoCallWithSound(
  profil,
  mesageId,
  userId,
  userFirstName,
  userLastName,
  message
) {
  const div = document.createElement("div");
  div.setAttribute("id", `toast_message_faniry_${mesageId}_js`);
  div.innerHTML = `<a class="lc kg ug" href="/user/message/perso?user_id=${userId}">
                            <div class="h sa wf uk th ni ej cb">
                                <img class="image_profil_navbar_msg" src="${
                                  profil
                                    ? "/public" + profil
                                    : "/public/uploads/users/photos/default_pdp.png"
                                }" alt="User"/>
                            </div>
                            <div>
                                <figure>
                                    <blockquote class="blockquote">
                                        <h6 class="un zn gs">
                                          Appel rentrant de
                                        </h6>
                                        <p class="mn hc">
                                            ${
                                              userFirstName + " " + userLastName
                                            }
                                        </p>
                                    </blockquote>
                                    <figcaption class="blockquote-footer" style="float: right;">
                                        <cite class="fontSize07">${
                                          message.message.datetime
                                        }</cite>
                                    </figcaption>
                                </figure>
                            </div>
                        </a>`;

  const duration = -1;

  AUDIO_FOR_JITSI = document.querySelector("#myAudio_faniry_js");
  AUDIO_FOR_JITSI.play()
    .then((r) => {})
    .catch((error) => {
      console.log(error);
    })
    .finally(() => {
      Toastify({
        // text: message,
        node: div,
        duration: duration,
        // destination: "https://github.com/apvarun/toastify-js",
        // newWindow: true,
        close: true,
        gravity: "bottom", // `top` or `bottom`
        position: "left", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          //color: alert ,
          background: "linear-gradient(to right, #00b09b, #96c93d)",
          fontSize: "0.9rem",
          width: "350px",
          maxWidth: screen.width <= 375 ? "75vw" : "93vw",
        },
        // onClick: function(){ // Callback after click
        //     clickedOnToastMessage(toastId)
        // }
      }).showToast();
    });
}

/**
 * @author faniry
 * @param {*} profil
 * @param {*} mesageId
 * @param {*} userId
 * @param {*} userFirstName
 * @param {*} userLastName
 * @param {*} message
 * cette fonction a pour but de montrer un toast message pour les appel visio lorsqu'il y a un appel
 * sans audio
 */
function showNotifVisoCallWithoutSound(
  profil,
  mesageId,
  userId,
  userFirstName,
  userLastName,
  message
) {
  const div = document.createElement("div");
  div.setAttribute("id", `toast_message_faniry_${mesageId}_js`);
  div.innerHTML = `<a class="lc kg ug" href="/user/message/perso?user_id=${userId}">
                            <div class="h sa wf uk th ni ej cb">
                                <img class="image_profil_navbar_msg" src="${
                                  profil
                                    ? "/public" + profil
                                    : "/public/uploads/users/photos/default_pdp.png"
                                }" alt="User"/>
                            </div>
                            <div>
                                <figure>
                                    <blockquote class="blockquote">
                                        <h6 class="un zn gs">
                                          Appel rentrant de
                                        </h6>
                                        <p class="mn hc">
                                            ${
                                              userFirstName + " " + userLastName
                                            }
                                        </p>
                                    </blockquote>
                                    <figcaption class="blockquote-footer" style="float: right;">
                                        <cite class="fontSize07">${
                                          message.message.datetime
                                        }</cite>
                                    </figcaption>
                                </figure>
                            </div>
                        </a>`;

  const duration = -1;

  Toastify({
    // text: message,
    node: div,
    duration: duration,
    // destination: "https://github.com/apvarun/toastify-js",
    // newWindow: true,
    close: true,
    gravity: "bottom", // `top` or `bottom`
    position: "left", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      //color: alert ,
      background: "linear-gradient(to right, #00b09b, #96c93d)",
      fontSize: "0.9rem",
      width: "350px",
      maxWidth: screen.width <= 375 ? "75vw" : "93vw",
    },
    // onClick: function(){ // Callback after click
    //     clickedOnToastMessage(toastId)
    // }
  }).showToast();
}

/**not used */
function simulateUserClick(element) {
  var events = [
    "mousemove",
    "mouseover",
    "focus",
    "mousedown",
    "mouseup",
    "click",
  ];

  for (var i = 0; i < events.length; i++) {
    var eventObject = new Event(events[i], {
      bubbles: true,
      cancelable: false,
    });

    document.dispatchEvent(eventObject);
  }
}

function updateNbrNotificationAndShowBadge(allNotifications) {
  /// notification have a state not show
  const array_notificationNotShow = allNotifications.filter(
    (item) => parseInt(item.isShow) === 0
  );
  const array_notificationNotRead = allNotifications.filter(
    (item) => parseInt(item.isRead) === 0
  );

  const content_alert_notif = document.querySelector(
    ".content_alert_new_notification_jheo_js"
  );
  //// show badge red notification
  if (content_alert_notif) {
    if (array_notificationNotShow.length > 0) {
      const alert_new_notification = document.querySelector(
        ".alert_new_notification_jheo_js"
      );
      const old_nbr_notification = alert_new_notification.innerText;

      if (parseInt(old_nbr_notification) < array_notificationNotShow.length) {
        if (content_alert_notif.classList.contains("d-none")) {
          content_alert_notif.classList.remove("d-none");
        }

        alert_new_notification.innerText = array_notificationNotShow.length;
        notificationSong();
      }
    } else {
      if (!content_alert_notif.classList.contains("d-none")) {
        content_alert_notif.classList.add("d-none");
      }
    }
  } else {
    console.log("Selector not found: 'content_alert_new_notification_jheo_js'");
  }

  ///content nbr of notification
  const contentNbrNotification = document.querySelector(
    ".nbr_notification_jheo_js"
  );
  if (contentNbrNotification) {
    /// old number
    const nbr_actual_notification = contentNbrNotification.innerText;
    /// if there is a notification not read
    if (parseInt(nbr_actual_notification) < array_notificationNotRead.length) {
      //// change the old number notification
      contentNbrNotification.innerText =
        array_notificationNotRead.length > 9 ||
        array_notificationNotRead.length === 0
          ? array_notificationNotRead.length
          : `0${array_notificationNotRead.length}`;
    }
  } else {
    console.log("Selector not found: 'nbr_notification_jheo_js'");
  }
}

function injectNewCardNotification(allNotifications) {
  /// notification not in card
  const array_notificationToShow = allNotifications.filter(
    (item) => !document.querySelector(`#notificationID_${item.id}_jheo_js`)
  );
  if (array_notificationToShow.length > 0) {
    //// content list notification
    const contentNotificationHtml = document.querySelector(
      ".content_card_notification_jheo_js"
    );
    if (contentNotificationHtml) {
      array_notificationToShow.length === allNotifications.length
        ? (contentNotificationHtml.innerHTML = "")
        : null;

      ////show new notification
      array_notificationToShow &&
        array_notificationToShow.forEach((item) => {
          // notif_id,parent_card, card_title_content, card_text_content,card_text_date, is_show, is_read, link, type invitation, isAccepted
          // user= { "photo": null, "fullname": null, "userID" : null}, notification= { "notificationID" : null, "title": null, "textContent" : null, "dateTime" : null }
          createAndAddCardNotification(
            contentNotificationHtml,
            {
              notificationID: item.id,
              title: "Une nouvelle notification",
              textContent: item.content,
              dateTime: item.datetime,
              isShow: !!parseInt(item.isShow),
              isRead: !!parseInt(item.isRead),
            },
            {
              photo: item.photoDeProfil,
              userID: item.user_post,
              fullname: item.fullname,
              isConnected: item.is_connected,
            }
          );
        });
    }
  }
}

function updateAllWhenStateChange(allNotifications) {
  /// notification have a state not show
  const array_notificationNotShow = allNotifications.filter(
    (item) => parseInt(item.isShow) === 0
  );
  const array_notificationNotRead = allNotifications.filter(
    (item) => parseInt(item.isRead) === 0
  );

  allNotifications.forEach((item) => {
    if (parseInt(item.isRead) === 1) {
      const notif_card_item = document.querySelector(
        `#notificationID_${item.id}_jheo_js`
      );
      if (notif_card_item.classList.contains("gray400")) {
        notif_card_item.classList.remove("gray400");
      }
    }
  });
}

function createAndAddCardMessage(
  id,
  other_id,
  firstname,
  lastname,
  message,
  isForMe,
  isRead,
  profil
) {
  //// format the message to long
  // const { text, images } = JSON.parse(message)
  // const msg_prefix= isForMe === 0 ? "Vous: " : "";
  // if( text !== ""){
  //     message_text= msg_prefix + text.length > 100 ? text.substring(0,100) + " ... (voir la suite)" : text;
  // }else{
  //     message_text = msg_prefix + "(fichier image)"
  // }

  const message_text =
    isForMe === 0
      ? "Vous venez d'envoyer une message à cette partisant."
      : "Vous avez réçu un nouveau message.Veuillez cliquez pour voir.";

  ///create card message and add in the message modal popup
  const card_msg = document.createElement("li");
  card_msg.className = `nr cg h lc mg qg qh sq js yk show_single_msg_popup_jheo_js ${
    parseInt(isRead) !== 1 ? "gray400" : ""
  } msg_${other_id}_js_jheo`;
  /// user author
  card_msg.setAttribute("data-toggle-other-id", other_id);
  /// set the id of the card_msg message
  card_msg.setAttribute("id", id);

  card_msg.innerHTML = `
  
        <a class="lc mg ug" href='/user/message/perso?user_id=${other_id}'>
            <div class="h sa wf uk th ni ej">
                <img class="image_profil_navbar_msg"  src='${
                  profil
                    ? "/public" + profil
                    : "/public/uploads/users/photos/default_pdp.png"
                }' alt="User"/>
            </div>

            <div>
                <h6 class="un zn gs">
                    ${firstname} ${lastname}
                </h6>
                <p class="mn hc content_msg_text_jheo_js">
                    ${message_text}
                </p>
            </div>
        </a>
    `;
  //// ADD IN CONTENT
  if (parseInt(isRead) !== 1) {
    document.querySelector(".content_card_msg_jheo_js").prepend(card_msg);
  } else {
    document.querySelector(".content_card_msg_jheo_js").appendChild(card_msg);
  }
}

function createAndAddCardNotification(
  contentNotificationHtml,
  notification = {
    notificationID: null,
    title: null,
    textContent: null,
    dateTime: null,
    isShow: false,
    isRead: false,
  },
  user = { photo: null, fullname: null, userID: null, isConnected: null }
) {
  const notification_item = document.createElement("li");
  notification_item.className = `nr cg h lc kg qg qh sq js yk ${
    !notification.isRead ? "gray400" : ""
  } single_notif_jheo_js`;

  notification_item.setAttribute(
    "id",
    `notificationID_${notification.notificationID}_jheo_js`
  );
  notification_item.setAttribute(
    "data-toggle-notif-id",
    `${notification.notificationID}`
  );
  notification_item.setAttribute(
    "onclick",
    `setShowNotifications(${notification.notificationID})`
  );

  const badge_isConnected =
    !!user.isConnected === true
      ? `<span class="g l m xe qd th pi jj sj ra"></span>`
      : "";
  notification_item.innerHTML = `
        <a class="lc kg ug" href="#">
            <div class="h sa wf uk th ni ej cb">
                <img class="image_profil_navbar_msg" src="${
                  user.photo
                    ? "/public" + user.photo
                    : "/public/uploads/users/photos/default_pdp.png"
                }" alt="User"/>
            </div>
            <div>
                <figure>
                    <blockquote class="blockquote">
                        <h6 class="un zn gs">
                            ${user.fullname}
                        </h6>
                        <p class="mn hc">
                            ${notification.textContent}
                        </p>
                    </blockquote>
                    <figcaption class="blockquote-footer" style="float: right;">
                        <cite class="fontSize07">${notification.dateTime}</cite>
                    </figcaption>
                </figure>
            </div>
        </a>
    `;
  if (contentNotificationHtml.firstChild) {
    contentNotificationHtml.insertBefore(
      notification_item,
      contentNotificationHtml.firstChild
    );
  } else {
    contentNotificationHtml.appendChild(notification_item);
  }

  // contentNotificationHtml.appendChild(notification_item)
}

function setShowNotifications(notificationID) {
  fetch(`/user/notification/read?notif_id=${notificationID}`)
    .then((response) => response.json())
    .then((response) => {
      const cardNotification = document.querySelector(
        `#notificationID_${notificationID}_jheo_js`
      );
      if (cardNotification.classList.contains("gray400")) {
        cardNotification.classList.remove("gray400");
      }

      const nbr = document.querySelector(".nbr_notification_jheo_js");
      const nbr_final =
        nbr && parseInt(nbr.innerText) != 0
          ? parseInt(nbr.innerText) - 1
          : nbr.innerText;
      nbr.innerText =
        parseInt(nbr_final) < 10 && parseInt(nbr_final) != 0
          ? `0${nbr_final}`
          : nbr_final;
    });
}

function setReadAll() {
  if (document.querySelectorAll(".single_notif_jheo_js")) {
    const data = [],
      all_card_notification = document.querySelectorAll(
        ".single_notif_jheo_js"
      );

    all_card_notification.forEach((card) => {
      const single_data = {
        notif_id: card.getAttribute("data-toggle-notif-id"),
      };
      data.push(single_data);
    });

    fetch("/user/notification/readAll", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res) {
          document.querySelector(".nbr_notification_jheo_js").innerText = "0";

          all_card_notification.forEach((item) => {
            if (item.classList.contains("gray400")) {
              setTimeout(() => {
                item.classList.remove("gray400");
              }, 1000);
            }
          });
        }
      });
  }
}

function deleteCardElement() {
  const all_cards = document.querySelectorAll(".card_js_jheo");

  const parent_card = document.querySelector(
    ".content_card_notification_jheo_js"
  );

  all_cards.forEach((item) => {
    parent_card.removeChild(item);
  });
}

function createBadgeNotifContent() {
  const content_notification = document.querySelector(".content_notification");
  const div_badge = document.createElement("div");

  div_badge.classList.add("badge_notification");

  const span_nbr_notification = document.createElement("span");

  span_nbr_notification.classList.add("nbr_notification_jheo_js");

  div_badge.appendChild(span_nbr_notification);

  if (content_notification.querySelector(".nav-link")) {
    content_notification.insertBefore(
      div_badge,
      content_notification.querySelector(".nav-link")
    );
  } else {
    content_notification.appendChild(div_badge);
  }
}

let fileInputProfils = document.querySelectorAll("#fileInputProfil");

fileInputProfils.forEach((fileInputProfil) => {
  fileInputProfil.addEventListener("change", (e) => {
    ///read file
    const fileReader = new FileReader();

    ////on load file
    fileReader.addEventListener("load", () => {
      let avatarPartisant = fileReader.result;

      /**
       * @author elie
       * checking image extension and size if <2Mo
       * use into profil.html.twig
       * i want upload an image less than 2Mo
       */

      const listExt = ["jpg", "jpeg", "png", "gif", "tiff", "jpe"];
      const octetMax = 2e6; //2Mo

      if (!checkFileExtension(listExt, avatarPartisant)) {
        swal({
          title: "Le format de fichier n'est pas pris en charge!",
          text: "Le fichier autorisé doit être une image ou des fichier (.jpeg, .jpg, .png, gif, tiff, jpe)",
          icon: "error",
          button: "OK",
        });
      } else {
        if (!checkTailleImage(octetMax, avatarPartisant)) {
          swal({
            title: "Le fichier est trop volumineux!",
            text: "La taille de l'image doit être inférieure à 2Mo.",
            icon: "error",
            button: "OK",
          });
        } else {
          // Change profil
          let profilPartisants = document.querySelectorAll("#profilPartisant");

          profilPartisants.forEach((profilPartisant) => {
            profilPartisant.src = avatarPartisant;
          });

          //profilPartisant.src = avatarPartisant

          if (document.querySelector("#roundedImg") != null) {
            document.querySelector("#roundedImg").src = avatarPartisant;
          }

          let data = {
            image: avatarPartisant,
          };

          setPhotoAfterUpload(data);
        }
      }
    });

    ///run event load in file reader.
    fileReader.readAsDataURL(e.target.files[0]);
  });
});

let icons_eye = document.querySelectorAll("i.pwd-eye");
icons_eye.forEach((icon_eye) => {
  icon_eye.addEventListener("click", function () {
    if (icon_eye.classList.contains("fa-eye-slash")) {
      icon_eye.classList.remove("fa-eye-slash");

      icon_eye.classList.add("fa-eye");

      ///show password

      icon_eye.previousElementSibling.type = "text";
    } else {
      icon_eye.classList.remove("fa-eye");

      icon_eye.classList.add("fa-eye-slash");

      ///hide password

      icon_eye.previousElementSibling.type = "password";
    }
  });
});

function toggleClass(element) {
  if (element.classList == "fas fa-plus-circle") {
    element.classList = "fas fa-minus-circle";
  } else {
    element.classList = "fas fa-plus-circle";
  }
}

// active nav left
if (document.querySelector(".list-nav-left")) {
  const activPage = window.location.pathname;
  const links = document.querySelectorAll(".list-nav-left");
  const superAdmin = document.querySelector(".dashbord-super-admin");
  const myAgenda = document.querySelector(".myAgendaLink");

  if (links.length) {
    links.forEach((link) => {
      if (link.href.includes(`${activPage}`)) {
        link.classList.add("active");
      } else if (superAdmin) {
        document.querySelector("#link-super-admin").classList.add("active");
      } else if (myAgenda) {
        document.querySelector("#link-agenda").classList.add("active");
      }
    });
  }
}

//SPA dashboard Super admin
if (document.querySelector("#navbarSuperAdmin > ul > li > a")) {
  const navLinks = document.querySelectorAll("#navbarSuperAdmin > ul > li > a");
  const pages = document.querySelectorAll(".content-super-admin");

  let pageStyle = null;
  function showPage(pageId) {
    pages.forEach((page) => {
      pageStyle = page.getAttribute("style");
      if (page.id === pageId) {
        page.style.display = "block";
      } else {
        page.style.display = "none";
      }
    })
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const dataLink = link.getAttribute("data-target");

      event.preventDefault();
      const pageId = event.target.dataset.target;
      if (dataLink === 'list-tribu-g') {
        document.querySelector("#navbarSuperAdmin > ul > li > a.list-tribu-g").classList.add('text-primary')
        document.querySelector("#navbarSuperAdmin > ul > li > a.list-partenaire").classList.remove('text-primary')
        document.querySelector("#navbarSuperAdmin > ul > li > a.list-infoAvalider").classList.remove('text-primary')
          // document.querySelector("#navbarSuperAdmin > ul > li > a.list-tribu-t").classList.remove('text-primary')
      } else if (dataLink === 'list-tribu-t') {
          // document.querySelector("#navbarSuperAdmin > ul > li > a.list-tribu-t").classList.add('text-primary')
        document.querySelector("#navbarSuperAdmin > ul > li > a.list-tribu-g").classList.remove('text-primary')
        document.querySelector("#navbarSuperAdmin > ul > li > a.list-partenaire").classList.remove('text-primary')
        document.querySelector("#navbarSuperAdmin > ul > li > a.list-infoAvalider").classList.remove('text-primary')
      }else if (dataLink === 'list-fournisseur') {
        document.querySelector("#navbarSuperAdmin > ul > li > a.list-partenaire").classList.add('text-primary')
        document.querySelector("#navbarSuperAdmin > ul > li > a.list-tribu-g").classList.remove('text-primary')
        document.querySelector("#navbarSuperAdmin > ul > li > a.list-infoAvalider").classList.remove('text-primary')
          // document.querySelector("#navbarSuperAdmin > ul > li > a.list-tribu-t").classList.remove('text-primary')
      }
      showPage(pageId);
    });
  });

  showPage("list-tribu-g");
}

//SPA Profil

if (document.querySelector("#navbarProfil > ul > li > label")) {
  const navLinks = document.querySelectorAll("#navbarProfil > ul > li > label");
  const navLinksFils = document.querySelectorAll(
    "#navbarProfil > ul > li > label > span > .fils"
  );
  const pages = document.querySelectorAll(".content-profil-navs");

  let pageStyle = null;
  function showPageProfile(pageId) {
    // loading()

    pages.forEach((page) => {
      pageStyle = page.getAttribute("style");

      if (page.id === pageId) {
        page.style.display = "block";
        if (page.style.display === "none") {
          page.removeAttribute("style");
        }
      } else if (page.id !== pageId) {
        page.style.display = "none";
      }
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const dataLink = link.getAttribute("data-target");

      event.preventDefault();
      const pageId = event.target.dataset.target;

      showPageProfile(pageId);

      if (dataLink === "apropos_pdp") {
        document
          .querySelector("#navbarProfil > ul > li >  label.apropos_pdp")
          .classList.add("bg-pdp-profil");
        document
          .querySelector("#navbarProfil > ul > li > label.elie_gallery_profil")
          .classList.remove("bg-pdp-profil");
        document
          .querySelector("#navbarProfil > ul > li > label.tribu_profil")
          .classList.remove("bg-pdp-profil");
      }
      if (dataLink === "elie_gallery_profil") {
        // loading()
        document
          .querySelector("#navbarProfil > ul > li > label.elie_gallery_profil")
          .classList.add("bg-pdp-profil");
        document
          .querySelector("#navbarProfil > ul > li > label.apropos_pdp")
          .classList.remove("bg-pdp-profil");
        document
          .querySelector("#navbarProfil > ul > li > label.tribu_profil")
          .classList.remove("bg-pdp-profil");
      }
      if (dataLink === "tribu_profil") {
        // loading()

        document
          .querySelector("#navbarProfil > ul > li > label.tribu_profil")
          .classList.add("bg-pdp-profil");
        document
          .querySelector("#navbarProfil > ul > li > label.apropos_pdp")
          .classList.remove("bg-pdp-profil");
        document
          .querySelector("#navbarProfil > ul > li > label.elie_gallery_profil")
          .classList.remove("bg-pdp-profil");
        document.querySelector("#tribu_profil").style.display = "block";

        document.querySelectorAll(".elie_nav_link")[0].click();
      }

      // console.log(pageId);

      // showPageProfile(pageId);
    });
  });

  showPageProfile("apropos_pdp");
}

//SPA agenda list

if (document.querySelector("#smallNavInvitation > li > a")) {
  const navLinks = document.querySelectorAll("#smallNavInvitation > li > a");
  const pages = document.querySelectorAll(".list_resto_or_golf_partage");

  let pageStyle = null;
  function showPageAgenda(pageId) {
    pages.forEach((page) => {
      pageStyle = page.getAttribute("style");

      if (page.id === pageId) {
        page.style.display = "block";
      } else {
        page.style.display = "none";
      }
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const dataLink = link.getAttribute("data-target");

      event.preventDefault();
      const pageId = event.target.dataset.target;
      showPageAgenda(pageId);
    });
  });

  showPageAgenda("agenda-tribu-g");
}

function setAsPdp(span) {
  let img = span.previousElementSibling.querySelector("img").src;

  let img_path = new URL(img).pathname;

  let data = {
    image_path: img_path.includes("/public")
      ? img_path.replace("/public", "")
      : img_path,
  };

  fetch(
    new Request("/user/setpdp", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
  )
    .then((x) => x.json())
    .then((response) => {
      if (response.success) {
        swal("Votre photo de profile a été mis à jour!", {
          buttons: {
            ok: {
              value: "ok",
            },
          },
        }).then((value) => {
          switch (value) {
            case "ok": {
              location.reload();
              break;
            }
            default: {
              location.reload();
            }
          }
        });
      }
    });
}

setGallerieImageV2();

document.querySelectorAll(".elie_nav_link").forEach((i) => {
  i.addEventListener("click", function () {
    document.querySelectorAll(".elie_nav_link").forEach((item) => {
      item.classList.remove("active");
    });
    i.classList.add("active");

    if (i.getAttribute("data-tribu") == "G") {
      // new DataTable('#table_tribu_g');
      document.querySelector(".table_tribu_g").style = "display:table;";
      document.querySelector(".table_tribu_t").style = "display:none;";

      if (!$.fn.dataTable.isDataTable("#table_tribu_g")) {
        $("#table_tribu_g").DataTable({
          language: {
            url: "//cdn.datatables.net/plug-ins/1.13.4/i18n/fr-FR.json",
          },
        });
      }

      $("#table_tribu_t").DataTable().destroy();
    } else {
      document.querySelector(".table_tribu_g").style = "display:none;";
      document.querySelector(".table_tribu_t").style = "display:table;";

      if (!$.fn.dataTable.isDataTable("#table_tribu_t")) {
        $("#table_tribu_t").DataTable({
          language: {
            url: "//cdn.datatables.net/plug-ins/1.13.4/i18n/fr-FR.json",
          },
        });
      }

      $("#table_tribu_g").DataTable().destroy();
    }
  });
});

if (arrangeSetingApparitionMobile()) {
  set_iris_partisan();
}
