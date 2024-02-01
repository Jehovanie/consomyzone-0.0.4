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

        console.log("tsy misy lty a");
        for (let notif of Array.from(allNotifications)) {
          for (let msg of new_message) {
            if (notif.dataset.toggleOtherId == msg.message.user_post) {
              obj = { [notif.dataset.toggleOtherId]: parseInt(notif.id) };
              oldMessageNotifId.push(obj);
            }
          }
        }
        let tmp = JSON.stringify(oldMessageNotifId);

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
          if (notif.dataset.toggleOtherId == msg.message.user_post) {
            obj2 = { [notif.dataset.toggleOtherId]: msg.message.id };
            oldMessageNotifId2.push(obj2);
          }
        }
      }
      Cookies2.set(
        "_egemonie_n_" + currentUser,
        JSON.stringify(oldMessageNotifId2),
        {
          expires: 30,
          secure: true,
        }
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
  const oldMessages = JSON.parse(oldMessagesStr);
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
          let oldmesageId = 0;
          for (let oldMessage of oldMessages) {
            for (let [key, value] of Object.entries(oldMessage)) {
              if (key == userId) {
                oldmesageId = parseInt(value);
                break;
              }
            }
          }
          if (mesageId != oldmesageId && oldmesageId != 0) {
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
              url: item.notification_type,
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

  // card_msg.innerHTML = `

  //       <a class="lc mg ug" href='/user/message/perso?user_id=${other_id}'>
  //           <div class="h sa wf uk th ni ej">
  //               <img class="image_profil_navbar_msg"  src='${
  //                 profil
  //                   ? "/public" + profil
  //                   : "/public/uploads/users/photos/default_pdp.png"
  //               }' alt="User"/>
  //           </div>

  //           <div>
  //               <h6 class="un zn gs">
  //                   ${firstname} ${lastname}
  //               </h6>
  //               <p class="mn hc content_msg_text_jheo_js">
  //                   ${message_text}
  //               </p>
  //           </div>
  //       </a>
  //   `;

  card_msg.innerHTML = `
  
        <div class="lc mg ug onglet-message-${other_id}-tomm-js" onclick="addOngletMessage(${other_id})">
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
        </div>
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
    url: null,
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
        <a class="lc kg ug" href="${notification.url}">
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
  let activPage = window.location.pathname;
  activPage =
    activPage === "/user/my-tribu-t/spec"
      ? "/user/tribu/my-tribu-t"
      : activPage;
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
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const dataLink = link.getAttribute("data-target");

      event.preventDefault();
      const pageId = event.target.dataset.target;
      if (dataLink === "list-tribu-g") {
        document
          .querySelector("#navbarSuperAdmin > ul > li > a.list-tribu-g")
          .classList.add("text-primary");
        document
          .querySelector("#navbarSuperAdmin > ul > li > a.list-partenaire")
          .classList.remove("text-primary");
        document
          .querySelector("#navbarSuperAdmin > ul > li > a.list-infoAvalider")
          .classList.remove("text-primary");
        if(document.querySelector("#navbarSuperAdmin > ul > li > a.list-abonnement"))
          document.querySelector("#navbarSuperAdmin > ul > li > a.list-abonnement").classList.remove('text-primary')
        if(document.querySelector("#navbarSuperAdmin > ul > li > a.addr_faniry_js"))
          document.querySelector("#navbarSuperAdmin > ul > li > a.addr_faniry_js").classList.remove('text-primary')
        if(document.querySelector("#navbarSuperAdmin > ul > li > a.phtR_faniry_js"))
          document.querySelector("#navbarSuperAdmin > ul > li > a.phtR_faniry_js").classList.remove('text-primary')
        if(document.querySelector("#navbarSuperAdmin > ul > li > a.phtG_faniry_js"))
          document.querySelector("#navbarSuperAdmin > ul > li > a.phtG_faniry_js").classList.remove('text-primary')
      } else if (dataLink === "list-tribu-t") {
        // document.querySelector("#navbarSuperAdmin > ul > li > a.list-tribu-t").classList.add('text-primary')
        document
          .querySelector("#navbarSuperAdmin > ul > li > a.list-tribu-g")
          .classList.remove("text-primary");
        document
          .querySelector("#navbarSuperAdmin > ul > li > a.list-partenaire")
          .classList.remove("text-primary");
        document
          .querySelector("#navbarSuperAdmin > ul > li > a.list-infoAvalider")
          .classList.remove("text-primary");
        if(document.querySelector("#navbarSuperAdmin > ul > li > a.list-abonnement"))
          document.querySelector("#navbarSuperAdmin > ul > li > a.list-abonnement").classList.remove('text-primary')
        if(document.querySelector("#navbarSuperAdmin > ul > li > a.addr_faniry_js"))
          document.querySelector("#navbarSuperAdmin > ul > li > a.addr_faniry_js").classList.remove('text-primary')
        if(document.querySelector("#navbarSuperAdmin > ul > li > a.phtR_faniry_js"))
          document.querySelector("#navbarSuperAdmin > ul > li > a.phtR_faniry_js").classList.remove('text-primary')
        if(document.querySelector("#navbarSuperAdmin > ul > li > a.phtG_faniry_js"))
          document.querySelector("#navbarSuperAdmin > ul > li > a.phtG_faniry_js").classList.remove('text-primary')
      } else if (dataLink === "list-fournisseur") {
        document
          .querySelector("#navbarSuperAdmin > ul > li > a.list-partenaire")
          .classList.add("text-primary");
        document
          .querySelector("#navbarSuperAdmin > ul > li > a.list-tribu-g")
          .classList.remove("text-primary");
        document
          .querySelector("#navbarSuperAdmin > ul > li > a.list-infoAvalider")
          .classList.remove("text-primary");
        // document.querySelector("#navbarSuperAdmin > ul > li > a.list-tribu-t").classList.remove('text-primary')
        if(document.querySelector("#navbarSuperAdmin > ul > li > a.list-abonnement"))
         document.querySelector("#navbarSuperAdmin > ul > li > a.list-abonnement").classList.remove('text-primary')
        if(document.querySelector("#navbarSuperAdmin > ul > li > a.addr_faniry_js"))
          document.querySelector("#navbarSuperAdmin > ul > li > a.addr_faniry_js").classList.remove('text-primary')
        if(document.querySelector("#navbarSuperAdmin > ul > li > a.phtR_faniry_js"))
          document.querySelector("#navbarSuperAdmin > ul > li > a.phtR_faniry_js").classList.remove('text-primary')
        if(document.querySelector("#navbarSuperAdmin > ul > li > a.phtG_faniry_js"))
          document.querySelector("#navbarSuperAdmin > ul > li > a.phtG_faniry_js").classList.remove('text-primary')
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
if(document.querySelector("#navbarProfil > ul > li > label.abonnement_partisan"))
          document
            .querySelector("#navbarProfil > ul > li > label.abonnement_partisan")
            .classList.remove("bg-pdp-profil");
        document
          .querySelector("#navbarProfil > ul > li > label.tribu_profil")
          .classList.remove("bg-pdp-profil");
if(document.querySelector("#abonnement_partisan"))
          document.querySelector("#abonnement_partisan").style.display = "none"
      }
      if (dataLink === "elie_gallery_profil") {
        // loading()
        document
          .querySelector("#navbarProfil > ul > li > label.elie_gallery_profil")
          .classList.add("bg-pdp-profil");
        document
          .querySelector("#navbarProfil > ul > li > label.apropos_pdp")
          .classList.remove("bg-pdp-profil");
if(document.querySelector("#navbarProfil > ul > li > label.abonnement_partisan"))
          document
            .querySelector("#navbarProfil > ul > li > label.abonnement_partisan")
            .classList.remove("bg-pdp-profil");
        document
          .querySelector("#navbarProfil > ul > li > label.tribu_profil")
          .classList.remove("bg-pdp-profil");
if(document.querySelector("#abonnement_partisan"))
          document.querySelector("#abonnement_partisan").style.display = "none"
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
        if(document.querySelector("#navbarProfil > ul > li > label.abonnement_partisan"))
          document
            .querySelector("#navbarProfil > ul > li > label.abonnement_partisan")
          .classList.remove("bg-pdp-profil");
        document.querySelector("#tribu_profil").style.display = "block";

        document.querySelectorAll(".elie_nav_link")[0].click();
        if(document.querySelector("#abonnement_partisan"))
          document.querySelector("#abonnement_partisan").style.display = "none"
      }

      if (dataLink === "abonnement_partisan"){
        document
          .querySelector("#navbarProfil > ul > li > label.abonnement_partisan")
          .classList.add("bg-pdp-profil");
        document
          .querySelector("#navbarProfil > ul > li > label.tribu_profil")
          .classList.remove("bg-pdp-profil");
        document
          .querySelector("#navbarProfil > ul > li > label.apropos_pdp")
          .classList.remove("bg-pdp-profil");
        document
          .querySelector("#navbarProfil > ul > li > label.elie_gallery_profil")
          .classList.remove("bg-pdp-profil");
        document.querySelector("#abonnement_partisan").style.display = "block"
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

function closeOnglet(other_id) {
  let windowNoIframe = window.parent.document.documentElement;
  let elementIframe = windowNoIframe.querySelector(`#onglet${other_id}Msg`);
  document.querySelector(".content-close-tomm-js").classList.add("d-none");
  elementIframe.remove();
}

function addOngletMessage(other_id) {
  if (document.querySelector(".add-onglet-msg-tomm-js")) {
    document.querySelector(".message_jheo_js").click();
    if (document.querySelector(`#onglet${other_id}Msg`)) {
      document.querySelector(`#onglet${other_id}Msg`).remove();
    }
    let contentongletMsg = document.querySelector(".onglet-msg-all-tomm-js");
    contentongletMsg.classList.remove("d-none");
    // contentongletMsg.dataset.otherId = other_id
    let url = `/user/message/onglet/perso?user_id=${other_id}`;
    let iframeongletMsg = document.createElement("iframe");
    iframeongletMsg.src = url;
    iframeongletMsg.classList = "onglet-msg onglet-msg-tomm-js";
    iframeongletMsg.id = `onglet${other_id}Msg`;
    iframeongletMsg.dataset.otherId = other_id;
    contentongletMsg.appendChild(iframeongletMsg);
    if (document.querySelector(`#bulle${other_id}Msg`)) {
      document.querySelector(`#bulle${other_id}Msg`).remove();
    }
  }
}

function reduirOnglet(other_id) {
  let windowNoIframe = window.parent.document.documentElement;
  let imgUrl = document
    .querySelector(".pdp-msg-onglet-tomm-js")
    .getAttribute("src");
  let elementIframe = windowNoIframe.querySelector(`#onglet${other_id}Msg`);
  let contentongletMsg = windowNoIframe.querySelector(".content-bulle-tomm-js");
  elementIframe.remove();
  contentongletMsg.innerHTML += `
      <div class="content-bulle content-bulle-tomm-js" id="bulle${other_id}Msg" onclick="bulleMsg(${other_id})">
        <img src="${imgUrl}" class="content-bulle">
      </div>
    `;
}

function bulleMsg(other_id) {
  document.getElementById(`bulle${other_id}Msg`).remove();
  addOngletMessage(other_id);
  document.querySelector(".message_jheo_js").click();
}

/** Call invitation interne actif */

if(window.location.href.includes("/user/invitation")){

  showInvitationUser("interne")
}

/**
 * @author Elie
 * @constructor affichage des invitations en fonction de type (interne ou externe)
 * @param {*} type 
 */
function showInvitationUser(type) {
  if (type == "externe") {
    document.querySelector(".interne > a").classList.remove("active");
    document.querySelector(".externe > a").classList.add("active");

    document.querySelector("#panneau").classList.add("d-none")
    document.querySelector("#invitation_externe").classList.remove("d-none")

  }
  // Interne
  else {
    document.querySelector(".interne > a").classList.add("active");
    document.querySelector(".externe > a").classList.remove("active");

    document.querySelector("#panneau").classList.remove("d-none")
    document.querySelector("#invitation_externe").classList.add("d-none")

    fetchInvitationExterne();

  }

}

/**
 * @author Elie
 * @constructor Fetching information for the invitation story by user and showing into data table 
 * @param {*} e 
 */
function getHistoInvitation(e) {
  document.querySelector("#panneau > #contenus").classList.add("d-none");

  document.querySelector("#listeHistorique").classList.remove("d-none");

  e.classList.add("actif")

  let htm = ``


  fetch("/user/invitations-all/interne").then(response => response.json())
    .then(data => {
      // console.log(data);
      if (data.length > 0) {

        document.querySelector("#tableInvitation").innerHTML = `<td colspan="4"><div class="d-flex justify-content-center">
                        <div class="spinner-border" role="status">
                        <span class="visually-hidden">Loading...</span>
                        </div>
                    </div></td>`;

        for (let invit of data) {

          // console.log(invit);

          let is_accepted = "", is_cancelled = "", is_rejected = "", is_wait = "", btn_action = ""
          let tribu_name = invit.requesting.content.split("de rejoindre la tribu ")[1];

          let img_profil = ""

          if (invit.requesting.types == "invitation") {

            img_profil = invit.pdp_uPoster?invit.pdp_uPoster : "/uploads/users/photos/default_pdp.png"

            if (invit.requesting.is_wait == 1) {
              is_wait = `<span class="badge rounded-pill text-bg-warning"> <i class="fa-solid fa-hourglass-start"></i> En attente</span>`
              btn_action = `
                    <button onclick="acceptInvitation(this)" class="btn btn-primary bt${invit["requesting"]["id"]}rU btn_t_${invit["uPoster"]["\u0000App\\Entity\\User\u0000id"]} btn-sm" data-b="${invit["requesting"]["balise"]}" data-tbt="${invit["requesting"]["is_tribu"]}" id="confirm_invitation_js">Confirmer
                      <i class="fa-solid fa-user-plus text-light"></i>
                    </button> 
                    <button onclick="declineInvitation(this)" class="btn btn-danger bt${invit["requesting"]["id"]}rU btn_r_${invit["uPoster"]["\u0000App\\Entity\\User\u0000id"]} btn-sm" data-b="${invit["requesting"]["balise"]}" data-tbt="${invit["requesting"]["is_tribu"]}" id="supre_invitation_js">Suprimer
                      <i class="fa-solid fa-trash text-light"></i>
                    </button>
            `
            } else {
              if (invit.requesting.is_accepted == 1) {
                is_accepted = `<span class="badge rounded-pill text-bg-success"><i class="fa-solid fa-check-double"></i> Déjà accepté</span>`
              }
              if (invit.requesting.is_cancelled == 1) {
                is_cancelled = `<span class="badge rounded-pill text-bg-danger"><i class="fa-solid fa-circle-xmark"></i> Annulé</span>`
              }
              if (invit.requesting.is_rejected == 1) {
                is_rejected = `<span class="badge rounded-pill text-bg-warning"><i class="fa-solid fa-triangle-exclamation"></i> Rejecté</span>`
              }

            }

          } else {

            img_profil = invit.pdp_userReceiving? invit.pdp_userReceiving:"/uploads/users/photos/default_pdp.png"

            if (invit.requesting.is_wait == 1) {
              is_wait = `<span class="badge rounded-pill text-bg-warning"> <i class="fa-solid fa-hourglass-start"></i> En attente</span>`
              btn_action = `
                <button onclick="annuledDemand(this)" class="btn btn-secondary bt${invit["requesting"]["id"]}rU btn_a_${invit["userReceiving"]["\u0000App\\Entity\\User\u0000id"]} btn-sm" data-b="${invit["requesting"]["balise"]}" data-tbt="${invit["requesting"]["is_tribu"]}" id="annule_invitation_js">Annuler
                <i class="fa-solid fa-user-minus text-light"></i> 
              </button>
              <button onclick="relanceDemand(this, ${invit.requesting.user_received},'${invit.requesting.balise}','${tribu_name}')" class="btn btn-primary bt${invit["requesting"]["id"]}rU btn_a_${invit["userReceiving"]["\u0000App\\Entity\\User\u0000id"]} btn-sm" data-b="${invit["requesting"]["balise"]}" data-tbt="${invit["requesting"]["is_tribu"]}" id="relance_invitation_js">Relancer
                <i class="fa-solid fa-paper-plane text-light"></i> 
              </button>
              `
            } else {
              if (invit.requesting.is_accepted == 1) {
                is_accepted = `<span class="badge rounded-pill text-bg-success"><i class="fa-solid fa-check-double"></i> Déjà accepté</span>`
              }
              if (invit.requesting.is_cancelled == 1) {
                is_cancelled = `<span class="badge rounded-pill text-bg-danger"><i class="fa-solid fa-circle-xmark"></i> Annulé</span>`
              }
              if (invit.requesting.is_rejected == 1) {
                is_rejected = `<span class="badge rounded-pill text-bg-warning"><i class="fa-solid fa-triangle-exclamation"></i> Rejecté</span>`
              }
            }
          }

          // let user_img = invit.uPoster

          // let user_node = document.querySelector(".avatar-account-connected");

          // let user_full_name = user_node.querySelector("span.use-in-agd-nanta_js_css").textContent.trim();

          // let user_img = user_node.querySelector("img").src

          htm += `
            <tr class="invit_int_${invit.requesting.id}">
              <td>
                <div class="notification-list notification-list--unread">
                  <div class="notification-list_content">
                      <div class="notification-list_img">
                          <img src="/public${img_profil}" alt="user">
                      </div>
                      <div class="notification-list_detail">
                          <p class="text-muted">${invit.requesting.content}</p>
                          <p class="text-muted"><small>${is_wait + is_accepted + is_cancelled + is_rejected}</small></p>
                      </div>
                  </div>
                  <div class="notification-list_feature-img">
                      ${btn_action}
                  </div>
              </div>
              </td>
            </tr>
          `
        }

        document.querySelector("#tableInvitation").innerHTML = htm

        if (!$.fn.dataTable.isDataTable("#tableHistoInvit")) {
          $("#tableHistoInvit").DataTable({
            language: {
              url: "//cdn.datatables.net/plug-ins/1.13.4/i18n/fr-FR.json",
            },
          });
        }
  
        // $("#tableHistoInvit").DataTable().destroy();


      } else {
        document.querySelector("#tableInvitation").innerHTML = "Aucun historique d'invitation interne pour le moment."
      }
      

    })

}

/**
 * @author Elie
 * @constructor Relance in invitation
 * @param {*} elem 
 */
function relanceDemand(elem, user_id, table_tribu, name_tribu) {

  let data = {
    user_id: user_id,
    table: table_tribu,
    nom: name_tribu,
  };

  const http = new XMLHttpRequest();
  http.open("POST", "/user/tribu/relance/one-invitation");
  http.setRequestHeader("Content-type", "application/json");
  http.setRequestHeader("X-Requested-With", "XMLHttpRequest");
  http.send(JSON.stringify(data));
  http.onload = function () {
    elem.style.backgroundColor = "#E4E6EB";
    elem.style.borderColor = "#E4E6EB";
    elem.style.color = "black";
    elem.setAttribute("disabled", true);
    elem.innerHTML = http.responseText.replace(/"/g, "").replace(/ee/g, "ée");
    elem.previousElementSibling.click()
    document.querySelector(".invit-h").click()

  };


}

/**
 * @author Elie
 * @constructor fetching and showing invitations per email address
 */
function fetchInvitationExterne() {
  // document.querySelector("#invitation_externe").innerHTML = "Hello world!";

  let tbody_hist = document.querySelector("#bBodyInvitationExterne");

  let user_node = document.querySelector(".avatar-account-connected");

  let user_full_name = user_node.querySelector("span.use-in-agd-nanta_js_css").textContent.trim();

  fetch("/user/invitations-all/externe").then(resp => resp.json())
    .then(data => {

      tbody_hist.innerHTML = ""

      let htm =""

      if (data.length > 0) {

        for (let tribu of data) {
          for (let [key, value] of Object.entries(tribu)) {
            let tribu_table = key;
            let membres = value
            if (membres.length > 0) {
              for (const item of membres) {

                // console.log(item);
                 /*|| item.role == "Fondateur"*/
                if(item.is_forMe && item.is_valid != 1 ){
                  // console.log(item);

                  let user = item.user ? `<a href="/user/profil/${item.user.userId.id}" class="badge text-bg-primary">${item.user.firstname + " " + item.user.lastname
                  }</a>` : `<span class="badge text-bg-warning">Compte non trouvé</span>`;

                  let user_img = (item.user && item.user.photoProfil) ? "/public"+item.user.photoProfil : "/public/uploads/users/photos/default_pdp.png"
                  let sender_img = (item.sender && item.sender.photoProfil) ? "/public"+item.sender.photoProfil : "/public/uploads/users/photos/default_pdp.png"

                  let sender_profil = item.sender ? `<a class="text-primary" href="/user/profil/${item.sender.id}" >${item.sender.firstname +" " +item.sender.lastname}</a>` : "Le fondateur"

                  let roles =""
                  let btn_supp =""
                  let cls_for_me =""
/*item.role == "Fondateur" || */
                  if(item.is_forMe){
                  btn_supp = `<button class="mt-2 btn btn-sm btn-danger ${roles}" onclick="supprInvitationExterne('${tribu_table.split("_invitation")[0]}', '${item.id}')"><i class="fa-solid fa-trash text-light"></i> Supprimer</button>`

                  }

                  if(item.role != "Fondateur" && !item.is_forMe){
                  cls_for_me ="d-none"
                  }

                  htm += `<tr class="invit_ext_${item.id} ${cls_for_me}">
                              <td>
                                <div class="notification-list notification-list--unread">
                                  <div class="notification-list_content">
                                      <div class="notification-list_img">
                                          <img src="${sender_img}" alt="user">
                                      </div>
                                      <div class="notification-list_detail">
                                          <p>${item.is_forMe? "Vous avez " :sender_profil +" a "} invité <b>${user} [<span class="text-primary">${item.email}</span>]</b></p>
                                          <p class="text-muted"> à rejoindre la tribu T "${item.tribu}" le <small>${item.date}</small></p>
                                          <p class="text-muted"><small>${item.is_valid == 1 ? `<span class="badge text-bg-success"><i class="fa-solid fa-check-double"></i> Validé</span>` : `<span class="badge text-bg-warning"><i class="fa-solid fa-hourglass-start"></i> En attente</span>`}</small></p>
                                      </div>
                                  </div>
                                  <div class="notification-list_feature-img">
                                      ${(item.is_valid == 0 || !item.user) ? `<button class="mt-2 btn btn-sm btn-primary ${!item.is_forMe?"d-none":""}" onclick="relanceInvitationExterne('${tribu_table.split("_invitation")[0]}', '${item.tribu}', '${item.email}', '${user_full_name}')"><i class="fa-solid fa-user-plus text-light"></i> Relancer</button>` 
                                      : ``}
                                      ${btn_supp}
                                  </div>
                              </div>
                              </td>
                          </tr>
                      `;

                }
                
              }
            }

          }
        }

      }else{
        htm = " "
      }
      tbody_hist.innerHTML = htm

      if (!$.fn.dataTable.isDataTable("#tableHistoInvitExt")) {
        $("#tableHistoInvitExt").DataTable({
          language: {
            url: "//cdn.datatables.net/plug-ins/1.13.4/i18n/fr-FR.json",
          },
        });
      }
      
    })


}

/**
 * @author Elie
 * @constructor Relance invitation externe
 * @param {*} table 
 * @param {*} tribu_name 
 * @param {*} email 
 * @param {*} user_full_name 
 */
function relanceInvitationExterne(table, tribu_name, email, user_full_name) {

  let data = {
    table: table,
    principal: [email],
    object: "Invitation rejoindre ma tribu Thématique sur Consomyzone",
    description: `<br>Madame, Monsieur,<br>
      J'ai le plaisir de vous relancer une invitation à rejoindre la tribu thématique ${tribu_name} nouvellement fondée sur l'application ConsoMyZone.
      <br><br>
      Nous serions ravis de vous compter parmi nos membres. Votre présence sera une aide précieuse.<br>
      Dans cette attente, je vous adresse mes cordiales salutations.<br><br>
      
      `,
      piece_joint: [],

  };

  fetch("/user/tribu/email/invitation", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then(response=>{
    if(response.status=200 && response.ok){
      response.json().then(result=>{
let isSaved=false
        try{
    saveInvitationStory(table, result.data,false);
    isSaved=true
        }catch(err){
          isSaved=false;
          console.log(error)
        }
        
        if(isSaved){
    swal({
      title: "Bravo !",
      text: "Relance envoyée avec succès",
      icon: "success",
      button: "Fermer",
    })
  }else{
          swal({
            title: "Oooops !",
            text: "Erreur 500",
            icon: "error",
            button: "Fermer",
          })
        }
        
      })
}

})
  
  
  
 
}



/**
 * @author Elie
 * @constructor Suppression d'une invitation dans un table invitation tribu
 * @param {*} table 
 * @param {*} email 
 */
function supprInvitationExterne(table, id){

  fetch(`/tribu/invitation/delete_story/${table}/${id}`,{
    method :"POST"
  })
  .then(rp=>rp.json())
  .then(result=>{
    swal({
      title: "Supprimé!",
      text: "Invitation supprimée avec succès",
      icon: "success",
      button: "Fermer",
    }).then(result=>{
      document.querySelector(".invit_ext_"+id).remove()
    })
  })
}

/**
 * @author Nantenaina a ne pas contacté pendant les congés
 * où: On utilise cette fonction dans l'onglet abonnement de la page profil partisan
 * localisation du fichier: dans account.js,
 * je veux: soumettre un formulaire d'abonnement
 * Ancien Version
 */
function submitSubscriptionOld(e){
  e.target.disabled = true
  e.target.textContent = "Soumission..."
  e.target.classList = "btn btn-secondary btn-lg"
  let firstOption = document.querySelector("#firstOption").value
  let secondOption = document.querySelector("#secondOption").value
  let thirdOption = document.querySelector("#thirdOption").value
  let fourthOption = document.querySelector("#fourthOption").value
  let fifthOption = document.querySelector("#fifthOption").value
  if(firstOption == "" && secondOption == "" && thirdOption == "" && fourthOption == "" && fifthOption == ""){
    swal({
      title: "Attention !",
      text: "Veuillez saisir au moins un montant",
      icon: "warning",
      button: "Ok",
    });
    e.target.disabled = false
    e.target.textContent = "Soumettre"
    e.target.classList = "btn btn-primary btn-lg"
  }else{
    firstOption = firstOption != "" ? firstOption : 0
    secondOption = secondOption != "" ? secondOption : 0
    thirdOption = thirdOption != "" ? thirdOption : 0
    fourthOption = fourthOption != "" ? fourthOption : 0
    fifthOption = fifthOption != "" ? fifthOption : 0
    let data = {
      firstOption : firstOption,
      secondOption : secondOption,
      thirdOption : thirdOption,
      fourthOption : fourthOption,
      fifthOption : fifthOption
    }

    let request = new Request("/user/save/abonnement/", {
      body: JSON.stringify(data),
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    fetch(request).then((response) => {
      if (response.status === 201) {
        swal({
          title: "Merci !",
          text: "Votre abonnement est prise en compte.",
          icon: "success",
          button: "Ok",
        });
        e.target.disabled = false
        e.target.textContent = "Soumettre"
        e.target.classList = "btn btn-primary btn-lg"
      } else if (response.status === 205) {
        swal({
          title: "Non connecté !",
          text: "Veuillez vous reconnecter.",
          icon: "warning",
          button: "Ok",
        });
      }
    });

  }
}

/**
 * @author Nantenaina a ne pas contacté pendant les congés
 * où: On utilise cette fonction dans l'onglet abonnement de la page profil partisan
 * localisation du fichier: dans account.js,
 * je veux: tester si l'entrée saisi par le partisan est exactement un chiffre
 */
function checkExactNumber(e){
  e.target.value = e.target.value.replace(",",".")
  if(isNaN(e.target.value)){
    swal({
      title: "Attention !",
      text: "Veuillez saisir un nombre",
      icon: "warning",
      button: "Ok",
    });
  }else{
    if(e.target.value < 0){
      swal({
        title: "Attention !",
        text: "Veuillez saisir un nombre positif",
        icon: "warning",
        button: "Ok",
      });
      e.target.value = e.target.value.replace("-","")
    }
  }
}

/**
 * @author Nantenaina a ne pas contacté pendant les congés
 * où: On utilise cette fonction dans l'onglet abonnement de la page profil partisan
 * localisation du fichier: dans account.js,
 * je veux: afficher le formulaire d'abonnement ou l'historique
 */
function getSubscriptionStoryOrForm(e){
  if(e.target.parentElement.nextElementSibling){
      document.querySelector("#subscriptionForm").style.display = "block"
      document.querySelector("#subscriptionStory").style.display = "none"
      if(!e.target.classList.contains("active")){
        e.target.classList.add("active")
        document.querySelector("#abonnement_partisan > div > div > ul > li:nth-child(2) > span").classList.remove("active")
      }
  }else if(e.target.parentElement.previousElementSibling){
      document.querySelector("#subscriptionStory").style.display = "block"
      document.querySelector("#subscriptionForm").style.display = "none"
      if(!e.target.classList.contains("active")){
        e.target.classList.add("active")
        document.querySelector("#abonnement_partisan > div > div > ul > li:nth-child(1) > span").classList.remove("active")
        getPartisanAbonnement()
      }
  }
}

/**
 * @author Nantenaina a ne pas contacté pendant les congés
 * où: On utilise cette fonction dans l'onglet abonnement de la page profil partisan
 * localisation du fichier: dans account.js,
 * je veux: soumettre un formulaire d'abonnement
 */
function submitSubscription(e,typeAbonnement){
  
  let inputNumber = e.target.parentElement.querySelector("input")
  let inputValue = inputNumber.value

  if(inputValue == ""){
    swal({
      title: "Attention !",
      text: "Veuillez saisir un montant",
      icon: "warning",
      button: "Ok",
    });
  }else{
      inputValue = inputValue.replace(",",".")
      if(isNaN(inputValue)){
        swal({
          title: "Attention !",
          text: "Veuillez saisir un nombre",
          icon: "warning",
          button: "Ok",
        });
      }else{
          if(inputValue <= 0){
            swal({
              title: "Attention !",
              text: "Veuillez saisir un montant positif",
              icon: "warning",
              button: "Ok",
            });
            inputNumber.value = inputValue.replace("-","")
          }else{
              e.target.disabled = true
              e.target.textContent = "Soumission..."
              e.target.classList = "btn btn-secondary"
              let data = {
                typeAbonnement : parseInt(typeAbonnement),
                montant : inputValue
              }

              let request = new Request("/save/one/abonnement/", {
                body: JSON.stringify(data),
                method: "POST",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                },
              });
          
              fetch(request).then((response) => {
                if (response.status === 201) {
                  swal({
                    title: "Merci !",
                    text: "Votre abonnement est prise en compte.",
                    icon: "success",
                    button: "Ok",
                  });
                  e.target.disabled = false
                  e.target.textContent = "Soumettre"
                  e.target.classList = "btn btn-primary"
                } else if (response.status === 205) {
                  swal({
                    title: "Hors Ligne !",
                    text: "Veuillez vous reconnecter.",
                    icon: "warning",
                    button: "Ok",
                  }).then((result)=>{
                      location.href = "/connexion"
                  });
                  e.target.disabled = false
                  e.target.textContent = "Soumettre"
                  e.target.classList = "btn btn-primary"
                }
              });
          }
      }
  }
}

/**
 * @author Nantenaina a ne pas contacté pendant les congés
 * où: On utilise cette fonction dans l'onglet abonnement de la page profil partisan
 * localisation du fichier: dans account.js,
 * je veux: afficher la liste des abonnements d'un partisan
 */
function getPartisanAbonnement(){
  document.querySelector("#subscriptionStory").innerHTML = `
            <div class="spinner-border spinner-border text-info mt-3 text-center" role="status" style="margin-left:45%;">
              <span class="visually-hidden">Chargement...</span>
          </div>
          `;
  // <th>Nom du partisan</th>
  let table = `<table class="table table-striped" id="abonnementStoryTable">
          <thead>
            <tr valign="middle" class="text-center text-sm">
              <th>Type d'abonnement</th>
              <th>Montant</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
        `
  
  fetch("/get/partisan/abonnement/")
    .then(response=> response.json())
    .then(result=>{
      if (result.status === 201) {
        let tr = ""
        let abonnements = result.abonnements
        if(abonnements.length > 0){
            let fullName = result.fullName
            for (const abonnement of abonnements) {

              let typeAbonnement = getTypeAbonnement(abonnement.typeAbonnement)
              // <td>${fullName}</td>
              tr += `<tr valign="middle">
                      <td>${typeAbonnement}</td>
                      <td>${abonnement.montant}</td>
                      <td>${abonnement.dateSoumission}</td>
                    </tr>`
            }
            table += tr
            table += `</tbody>
                    </table>
                  `
            document.querySelector("#subscriptionStory").innerHTML = table
            $('#abonnementStoryTable').DataTable({
              language: {
                  url: 'https://cdn.datatables.net/plug-ins/1.13.4/i18n/fr-FR.json'
              },})
        }else{
          tr += `<tr valign="middle" class="text-center">
                      <td colspan="3">Aucun abonnement</td>
                    </tr>`
          table += tr
          table += `</tbody>
                    </table>
                  `
          document.querySelector("#subscriptionStory").innerHTML = table
        }
      } else if (result.status === 205) {
        swal({
          title: "Hors Ligne !",
          text: "Veuillez vous reconnecter.",
          icon: "warning",
          button: "Ok",
        }).then((ok)=>{
            location.href = "/connexion"
        });
      }
    })
}

/**
 * @author Nantenaina a ne pas contacté pendant les congés
 * où: On utilise cette fonction dans l'onglet abonnement de la page profil utilisateur et celle de Super Admin
 * localisation du fichier: dans account.js,
 * je veux: afficher le type d'abonnement
 */
function getTypeAbonnement(typeAbonnement){
  let texte = ""
  switch (parseInt(typeAbonnement)) {
    case 1:
      texte = "Cotisations";
      break;
      
    case 2:
      texte = "Participation supplémentaire";
      break;

    case 3:
      texte = "Cotisation tribu";
      break;

    case 4:
      texte = "Participation verte";
      break;

    case 5:
      texte = "Participation bleue";
      break;
                
    default:
      texte = "Cotisations";
  }
  return texte;
}

/**
 * @author Nantenaina a ne pas contacté pendant les congés
 * où: On utilise cette fonction dans l'onglet abonnement de la page Super Admin
 * localisation du fichier: dans account.js,
 * je veux: afficher la liste de tous les abonnements
 */
function getListeAbonnementSuperAdmin(e){
  let linkActives = document.querySelectorAll(
    "#navbarSuperAdmin > ul > li > a"
  );
  linkActives.forEach((link) => {
    if (link.classList.contains("text-primary"))
      link.classList.remove("text-primary");
  });
  if (e) {
    e.target.classList.add("text-primary");
  } else {
    document.querySelector(".addr_faniry_js").classList.add("text-primary");
  }

  if (document.querySelector("#list-tribu-g"))
    document.querySelector("#list-tribu-g").style.display = "none";
  if (document.querySelector("#list-demande-partenaire"))
    document.querySelector("#list-demande-partenaire").style.display = "none";

  if (document.querySelector("#list-infoAvalider"))
    document.querySelector("#list-infoAvalider").style.display = "none";

  if (document.querySelector("#list-abonnement-cmz"))
    document.querySelector("#list-abonnement-cmz").style.display = "block";

  document.querySelector(
    ".content_chargement_liste_abonnement_nanta_js"
  ).innerHTML = `<div class="spinner-border spinner-border text-info" role="status">
                  <span class="visually-hidden">Loading...</span>
              </div>`;

  let table = `<table class="table table-striped" id="abonnementStoryTableSuperAdmin">
          <thead>
            <tr valign="middle" class="text-center text-sm">
              <th style="min-width:218px !important;">Nom du partisan</th>
              <th>Type d'abonnement</th>
              <th>Montant</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
        `
  
  fetch("/get/all/abonnement/")
    .then(response=> response.json())
    .then(result=>{
      if (result.status === 201) {
        let tr = ""
        let abonnements = result.abonnements
        if(abonnements.length > 0){
            for (const abonnement of abonnements) {
              let typeAbonnement = getTypeAbonnement(abonnement.typeAbonnement)

              tr += `<tr valign="middle">
                      <td style="min-width:218px !important;"><a href="/user/profil/${abonnement.userId}" class="text-primary">${abonnement.fullName}</a></td>
                      <td>${typeAbonnement}</td>
                      <td>${abonnement.montant}</td>
                      <td>${abonnement.dateSoumission}</td>
                    </tr>`
            }
            table += tr
            table += `</tbody>
                    </table>
                  `
            document.querySelector(".content_chargement_liste_abonnement_nanta_js").innerHTML = table
            $('#abonnementStoryTableSuperAdmin').DataTable({
              language: {
                  url: 'https://cdn.datatables.net/plug-ins/1.13.4/i18n/fr-FR.json'
              },})
        }else{
          tr += `<tr valign="middle" class="text-center">
                      <td colspan="4">Aucun abonnement</td>
                    </tr>`
          table += tr
          table += `</tbody>
                    </table>
                  `
          document.querySelector(".content_chargement_liste_abonnement_nanta_js").innerHTML = table
        }
      } else if (result.status === 205) {
        swal({
          title: "Hors Ligne !",
          text: "Veuillez vous reconnecter.",
          icon: "warning",
          button: "Ok",
        }).then((ok)=>{
            location.href = "/connexion"
        });
      }
    })
}
