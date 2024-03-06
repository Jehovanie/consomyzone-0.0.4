let email_piece_joint_list_g = [];
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
      if(typeof notificationSong === "function")
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

      if (Cookies2?.get("_egemonie_n_" + currentUser) != undefined) {
        //console.log("ato express")
        let tmp = Cookies2.get("_egemonie_n_" + currentUser);

        Cookies2.set("_egemonie_0_" + currentUser, tmp, {
          expires: 30,
          secure: true,
        });
      } else {
        //set cookie old

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
          single_message.profil,
          single_message.fullname
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
            single_message.profil,
            single_message.fullname
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
            // console.log(res);
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


function isBanished(event) {
  let idUser = parseInt(
            event.target.dataset.token
              .split(":")[2]
              .split(".")[1]
              .replace(/[^0-9]/g, ""),
            10
          )
    const request = new Request("/set/banished", {
      method: "POST",

      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },

      body:
        "id=" +
        encodeURIComponent(idUser),
    });

    fetch(request).
    then(response => {
      if (response.ok && response.status == 200) {
      if (document.querySelector(`.content-is-banished-${idUser}`)) {
          event.target.remove()
          document.querySelector(`.content-is-banished-${idUser}`).innerHTML = `
            <button type="button" class="btn btn-danger isRetablir-${idUser}-tomm-js" data-token="2ahUK:Ewip3tqU6Ob7AhW3gc:4145B77.${idUser}H:bAUoBJQQ-EN6BAhzEAo" onclick="isRetabliBanished(event)">
              Retablir
            </button>
          `
        }
        
        if (document.querySelector(".btn-admin-banished-tomm-js")) {
        location.reload()
      }
    }
    })
  }


function isSuspendre(event) {
  let idUser = parseInt(
            event.target.dataset.token
              .split(":")[2]
              .split(".")[1]
              .replace(/[^0-9]/g, ""),
            10
          )
    const request = new Request("/set/suspendre", {
      method: "POST",

      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },

      body:
        "id=" +
        encodeURIComponent(
          parseInt(idUser)
        ),   
    });

    fetch(request).
      then(response => {
        if (response.ok && response.status == 200) {
          if (document.querySelector(`.content-is-banished-${idUser}`)) {
            event.target.remove()
            document.querySelector(`.content-is-suspendre-${idUser}`).innerHTML = `
              <button type="button" class="btn btn-danger isRetablir-${idUser}-susp-tomm-js" data-token="2ahUK:Ewip3tqU6Ob7AhW3gc:4145B77.${idUser}H:bAUoBJQQ-EN6BAhzEAo" onclick="isRetabliSuspendre(event)">
                Retablir
              </button>
            `
          }
          if (document.querySelector(".btn-admin-banished-tomm-js")) {
        location.reload()
      }
    }
      })
  }


function isRetabliBanished(event) {
  let idUser = parseInt(
            event.target.dataset.token
              .split(":")[2]
              .split(".")[1]
              .replace(/[^0-9]/g, ""),
            10
          )
    const request = new Request("/undo/banished", {
      method: "POST",

      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },

      body:
        "id=" +
        encodeURIComponent(
          parseInt(idUser)
        ),
    });

    fetch(request).
      then(response => {
        if (response.ok && response.status == 200) {
      if (document.querySelector(`.content-is-banished-${idUser}`)) { 
            event.target.remove()
            document.querySelector(`.content-is-banished-${idUser}`).innerHTML = `
              <button type="button" class="btn btn-danger isBanished-${idUser}-tomm-js" data-token="2ahUK:Ewip3tqU6Ob7AhW3gc:77B12.${idUser}H:bAUBppJQQ-EN6BAhzEAo" onclick="isBanished(event)">
                Radier
              </button>
            `
          }
          
          if (document.querySelector(".btn-admin-banished-tomm-js")) {
        location.reload()
      }
    
        }
      })
  }

function isRetabliSuspendre(event) {
  let idUser = parseInt(
            event.target.dataset.token
              .split(":")[2]
              .split(".")[1]
              .replace(/[^0-9]/g, ""),
            10
          )
    const request = new Request("/undo/suspendre", {
      method: "POST",

      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },

      body:
        "id=" +
        encodeURIComponent(
          parseInt(idUser)
        ),
    });

    fetch(request).
      then(response => {
        if (response.ok && response.status == 200) {
          if (document.querySelector(`.content-is-banished-${idUser}`)) {
            event.target.remove()
            document.querySelector(`.content-is-suspendre-${idUser}`).innerHTML = `
              <button type="button" class="btn btn-warning isSuspendre-${idUser}-tomm-js" data-token="2ahUK:Ewip3tqU6Ob7AhW3gc:77B12.${idUser}H:bAUBppJQQ-EN6BAhzEAo" onclick="isSuspendre(event)">
                Suspendre
              </button>
            `
          }
          if (document.querySelector(".btn-admin-banished-tomm-js")) {
            location.reload()
          }
        }
      })
}

function relanceMailAbonnement(event, isEmail) {
  let idUser = parseInt(
        event.target.dataset.token
              .split(":")[2]
              .split(".")[1]
              .replace(/[^0-9]/g, ""),
            10
          )
        
  const request = new Request("/user/relance/mail/abonnement", {
    method: "POST",
    headers:  {
          Accept: "application/json",
          "Content-Type": "application/json",
      },
    body:JSON.stringify({
      "idUser" : idUser,
      "email" : isEmail
      })
  });
  fetch(request).then(response => {
        if (response.ok && response.status == 200) {
        swal({
          title: "Email envoyer",
          text: "Votre email a été bien envoyer",
          icon: "success",
          button: "OK",
        })
        }
    })
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
                                <img class="image_profil_navbar_msg image_profil_${notification.id}_msg_tomm_js" src="${
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
        AUDIO_FOR_MESSAGE=document.querySelector("#myAudio_message_faniry_js")
        
        AUDIO_FOR_MESSAGE.play()
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
const fullNameConf = message.fullname;
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
                  message,
                  fullNameConf
                );
              } else {
                showNotifVisoCallWithSound(
                  profil,
                  mesageId,
                  userId,
                  userFirstName,
                  userLastName,
                  message,
                  fullNameConf
                );
              }
            } else {
              showNotifMessageWithSound(
                profil,
                mesageId,
                userId,
                userFirstName,
                userLastName,
                message,
                fullNameConf
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
                message,
                fullNameConf
              );
            } else {
              showNotifVisoCallWithSound(
                profil,
                mesageId,
                userId,
                userFirstName,
                userLastName,
                message,
                fullNameConf
              );
            }
          } else {
            showNotifMessageWithSound(
              profil,
              mesageId,
              userId,
              userFirstName,
              userLastName,
              message,
              fullNameConf
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
                                <img class="image_profil_navbar_msg image_profil_${userId}_msg_tomm_js" src="${
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
  message,
  fullNameConf = ""
) {
  const div = document.createElement("div");
  div.setAttribute("id", `toast_message_faniry_${mesageId}_js`);
  div.innerHTML = `<a class="lc kg ug" href="/user/message/perso?user_id=${userId}">
                            <div class="h sa wf uk th ni ej cb">
                                <img class="image_profil_navbar_msg image_profil_${userId}_msg_tomm_js" src="${
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
                                              fullNameConf != "" ? fullNameConf: userFirstName + " " + userLastName
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

  AUDIO_FOR_MESSAGE=document.querySelector("#myAudio_message_faniry_js")
        
  AUDIO_FOR_MESSAGE.play()
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
  message,
  fullNameConf = ""
) {
  const div = document.createElement("div");
  div.setAttribute("id", `toast_message_faniry_${mesageId}_js`);
  div.innerHTML = `<a class="lc kg ug" href="/user/message/perso?user_id=${userId}">
                            <div class="h sa wf uk th ni ej cb">
                                <img class="image_profil_navbar_msg image_profil_${userId}_msg_tomm_js" src="${
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
                                              fullNameConf != "" ? fullNameConf: userFirstName + " " + userLastName
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
                                <img class="image_profil_navbar_msg image_profil_${userId}_msg_tomm_js" src="${
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
        if(typeof notificationSong === "function")
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
  profil,
  __fullName = ""
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
                <img class="image_profil_navbar_msg image_profil_${other_id}_msg_tomm_js"  src='${
                  profil
                    ? "/public" + profil
                    : "/public/uploads/users/photos/default_pdp.png"
                }' alt="User"/>
            </div>

            <div>
                <h6 class="un zn gs">
                    ${__fullName}
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
          if(document.querySelector(".btn_submit_inscription_js") == null)
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

/**
 * rend les boutuon sur le menu de gauche active ou non
 */
if (document.querySelectorAll(".list-nav-left").length > 0)  {
  let activPage = window.location.pathname;
  // activPage = activPage === "/user/my-tribu-t/spec" ? "/user/tribu/my-tribu-t" : activPage;
  const links = document.querySelectorAll(".list-nav-left");
  const superAdmin = document.querySelector(".dashbord-super-admin");
  const myAgenda = document.querySelector(".myAgendaLink");
  Array.from(links).forEach((link) => {
// console.log(activPage)
    // console.log(link)
      if (link.href.includes(`${activPage}`)) {
        link.classList.add("active");
      } else if (superAdmin) {
        document.querySelector("#link-super-admin").classList.add("active");
      } else if (myAgenda) {
        document.querySelector("#link-agenda").classList.add("active");
      }
    });
  
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
removeOngletSession(other_id)
  let windowNoIframe = window.parent.document.documentElement;
  let elementIframe = windowNoIframe.querySelector(`#onglet${other_id}Msg`);
  document.querySelector(".content-close-tomm-js").classList.add("d-none");
  elementIframe.remove();

}

function addOngletMessage(other_id) {

  let windowNoIframe = window.parent.document.documentElement;
  if (document.querySelector(".add-onglet-msg-tomm-js")) {
// let imgUrl = document.querySelector(`.image_profil_${other_id}_msg_tomm_js`).getAttribute("src");
    // storageBulleList(other_id, imgUrl)
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
  
    let iframe = windowNoIframe.querySelector(`#onglet${other_id}Msg`)
      let iframeDocument = iframe.contentWindow.document.querySelector(".ref_tom_js");
      let iframeDocumentBody = iframe.contentWindow.document.querySelector("body");

      if (iframeDocument === null) {
        iframeDocumentBody.innerHTML = `
                            <div class="spinner-border text-primary mx-auto" role="status">
                              <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'>
                                <radialGradient id='a7' cx='.66' fx='.66' cy='.3125' fy='.3125' gradientTransform='scale(1.5)'>
                                    <stop offset='0' stop-color='#0d6efd'></stop><stop offset='.3' stop-color='#0d6efd' stop-opacity='.9'></stop>
                                    <stop offset='.6' stop-color='#0d6efd' stop-opacity='.6'></stop>
                                    <stop offset='.8' stop-color='#0d6efd' stop-opacity='.3'></stop>
                                    <stop offset='1' stop-color='#0d6efd' stop-opacity='0'></stop>
                                </radialGradient>
                                <circle transform-origin='center' fill='none' stroke='url(#a7)' stroke-width='2' stroke-linecap='round' stroke-dasharray='200 1000' stroke-dashoffset='0' cx='100' cy='100' r='7'>
                                    <animateTransform type='rotate' attributeName='transform' calcMode='spline' dur='2' values='360;0' keyTimes='0;1' keySplines='0 0 1 1' repeatCount='indefinite'>
                                    </animateTransform>
                                </circle>
                                <circle transform-origin='center' fill='none' opacity='.2' stroke='#0d6efd' stroke-width='2' stroke-linecap='round' cx='100' cy='100' r='7'></circle>
                              </svg>
                            </div>`;
      }
      
  } else if (windowNoIframe.querySelector(".add-onglet-msg-tomm-js")) {
    let imgUrl = document.querySelector(`.image_profil_${other_id}_msg_tomm_js`).getAttribute("src");
    storageBulleList(other_id, imgUrl)
    if (windowNoIframe.querySelector(`#onglet${other_id}Msg`)) {
      windowNoIframe.querySelector(`#onglet${other_id}Msg`).remove();
    }

    
    let contentongletMsg = windowNoIframe.querySelector(".onglet-msg-all-tomm-js");
    contentongletMsg.classList.remove("d-none");
    // contentongletMsg.dataset.otherId = other_id
    let url = `/user/message/onglet/perso?user_id=${other_id}`;
    let iframeongletMsg = document.createElement("iframe");
    iframeongletMsg.src = url;
    iframeongletMsg.classList = "onglet-msg onglet-msg-tomm-js";
    iframeongletMsg.id = `onglet${other_id}Msg`;
    iframeongletMsg.dataset.otherId = other_id;
    contentongletMsg.appendChild(iframeongletMsg);
    if (windowNoIframe.querySelector(`#bulle${other_id}Msg`)) {
      windowNoIframe.querySelector(`#bulle${other_id}Msg`).remove();
    }
  }
}



function reduirOnglet(other_id) {
  
  let imgUrl = document
    .querySelector(".pdp-msg-onglet-tomm-js")
    .getAttribute("src");
storageBulleList(other_id, imgUrl)
  let windowNoIframe = window.parent.document.documentElement;
  let elementIframe = windowNoIframe.querySelector(`#onglet${other_id}Msg`);
let bulleMsg = windowNoIframe.querySelector(`#bulle${other_id}Msg`);
  if (bulleMsg) {
    bulleMsg.remove()
    let contentongletMsg = windowNoIframe.querySelector(".content-bulle-tomm-js");
    elementIframe.remove();
    contentongletMsg.innerHTML += `
        <div class="content-bulle content-bulle-tomm-js" id="bulle${other_id}Msg" onclick="bulleMsg(${other_id})">
          <img src="${imgUrl}" class="content-bulle">
        </div>
      `;
  } else {
  let contentongletMsg = windowNoIframe.querySelector(".content-bulle-tomm-js");
  elementIframe.remove();
  contentongletMsg.innerHTML += `
      <div class="content-bulle content-bulle-tomm-js" id="bulle${other_id}Msg" onclick="bulleMsg(${other_id})">
        <img src="${imgUrl}" class="content-bulle">
      </div>
    `;
}


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
            ordering: false,
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

                  let user = item.user ? `<a href="/user/profil/${item.user.userId.id}" class="badge text-bg-primary">${item.fullNameUser
                  }</a>` : `<span class="badge text-bg-warning">Compte non trouvé</span>`;

                  let user_img = (item.user && item.user.photoProfil) ? "/public"+item.user.photoProfil : "/public/uploads/users/photos/default_pdp.png"
                  let sender_img = (item.sender && item.sender.photoProfil) ? "/public"+item.sender.photoProfil : "/public/uploads/users/photos/default_pdp.png"

                  let sender_profil = item.sender ? `<a class="text-primary" href="/user/profil/${item.sender.id}" >${item.fullNameSender}</a>` : "Le fondateur"

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
                                          <p>${item.is_forMe? "Vous avez " :sender_profil +" a "} invité <b>${user} [<span class="text-primary">${item.emailConf}</span>]</b></p>
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
          ordering: false,
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
 * @author Nantenaina mise a jour Tomm
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
              <th>Cotisation CMZ</th>
              <th>Cotisation Tribu</th>
              <th>Cotisation bleu</th>
              <th>Cotisation vert</th>
              <th>Participation supplémentaire</th>
              <th>Date codisation CMZ</th>
              <th>Date codisation Tribu</th>
              <th>Date codisation bleu</th>
              <th>Date codisation vert</th>
              <th>Date Participation supplémentaire</th>
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
                      <td>${abonnement.cotisation_cmz ? abonnement.cotisation_cmz : "0" } €</td>
                      <td>${abonnement.cotisation_tribu ? abonnement.cotisation_tribu : "0"} €</td>
                      <td>${abonnement.cotisation_bleu ? abonnement.cotisation_bleu : "0"} €</td>
                      <td>${abonnement.cotisation_vert ? abonnement.cotisation_vert : "0"} €</td>
                      <td>${abonnement.participation_suplementaire ? abonnement.participation_suplementaire : "0"} €</td>
                      <td>${abonnement.date_cotisation_cmz ? abonnement.date_cotisation_cmz : "-"}</td>
                      <td>${abonnement.date_cotisation_tribu ? abonnement.date_cotisation_tribu : "-"}</td>
                      <td>${abonnement.date_cotisation_bleu ? abonnement.date_cotisation_bleu : "-"}</td>
                      <td>${abonnement.date_cotisation_vert ? abonnement.date_cotisation_vert : "-"}</td>
                      <td>${abonnement.date_supplementaire ? abonnement.date_supplementaire : "-"}</td>
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
 * @author Nantenaina mise a jour Tomm
 * où: On utilise cette fonction dans l'onglet abonnement de la page Super Admin
 * localisation du fichier: dans account.js,
 * je veux: afficher la liste de tous les abonnements
 */
function getListeAbonnementSuperAdmin(e) {
  document.querySelector(
    ".content_chargement_liste_abonnement_nanta_js"
  ).innerHTML = `<div class="spinner-border spinner-border text-info" role="status">
                  <span class="visually-hidden">Loading...</span>
              </div>`;

  let table = `<table class="table table-striped" id="abonnementStoryTableSuperAdmin">
          <thead>
            <tr valign="middle" class="text-center text-sm">
              <th style="min-width:218px !important;">Nom du partisan</th>
              <th>Cotisation CMZ</th>
              <th>Cotisation Tribu</th>
              <th>Cotisation bleu</th>
              <th>Cotisation vert</th>
              <th>Participation supplémentaire</th>
              <th>Date codisation CMZ</th>
              <th>Date codisation Tribu</th>
              <th>Date codisation bleu</th>
              <th>Date codisation vert</th>
              <th>Date Participation supplémentaire</th>
              <th>Radier</th>
              <th>Suspendre</th>
              <th>Relancer</th>
            </tr>
          </thead>
          <tbody>
        `
  
  fetch("/get/all/abonnement/")
    .then(response => {
      if (response.status === 200) {
        response.json().then(result => {
        let tr = ""
        let abonnementList = result.abonnementList
        if(abonnementList.length > 0){
            for (const abonnement of abonnementList) {
              console.log(abonnement)
              let cotisationCMZ,
                cotisationTribu,
                cotisationBleu,
                cotisationVert,
                participationSuplementaire,
                isBanished,
                isSuspendre,
                btnNotActive = ""
              
              let abonnementCMZ = abonnement.abonnement.cotisationCMZ
              let abonnementTribu = abonnement.abonnement.cotisationTribu
              let abonnementBleu = abonnement.abonnement.cotisationBleu
              let abonnementVert = abonnement.abonnement.cotisationVert
              let abonnementSup = abonnement.abonnement.participationSuplementaire

              let dateCotisationCMZ = abonnement.abonnement.dateCotisationCMZ ? abonnement.abonnement.dateCotisationCMZ.split("T")[0] : "-"
              let dateCotisationTribu = abonnement.abonnement.dateCotisationTribu ? abonnement.abonnement.dateCotisationTribu.split("T")[0] : "-"
              let dateCotisationBleu = abonnement.abonnement.dateCotisationBleu ? abonnement.abonnement.dateCotisationBleu.split("T")[0] : "-"
              let dateCotisationVert = abonnement.abonnement.dateCotisationVert ? abonnement.abonnement.dateCotisationVert.split("T")[0] : "-"
              let dateSupplementaire = abonnement.abonnement.dateSupplementaire ? abonnement.abonnement.dateSupplementaire.split("T")[0] : "-"
              
              if (abonnementCMZ !== null) {
                cotisationCMZ = abonnementCMZ
              } else {
                cotisationCMZ = "0"
              }

              if (abonnementTribu !== null ) {
                cotisationTribu = abonnementTribu
              } else {
                cotisationTribu = "0"
              }

              if (abonnementBleu !== null ) {
                cotisationBleu = abonnementBleu
              } else {
                cotisationBleu = "0"
                btnNotActive = ""
              }

              if (abonnementVert !== null ) {
                cotisationVert = abonnementVert
              } else {
                cotisationVert = "0"
              }

              if (abonnementSup !== null ) {
                participationSuplementaire = abonnementSup
              } else {
                participationSuplementaire = "0"
              }


              

              let newDate = new Date()
              let dateUnAnCmz = new Date(dateCotisationCMZ);
              dateUnAnCmz.setFullYear(dateUnAnCmz.getFullYear() + 1);

              let dateUnAnTribu = new Date(dateCotisationTribu);
              dateUnAnTribu.setFullYear(dateUnAnTribu.getFullYear() + 1);

              let dateUnAnBleu = new Date(dateCotisationBleu);
              dateUnAnBleu.setFullYear(dateUnAnBleu.getFullYear() + 1);

              let dateUnAnVert = new Date(dateCotisationVert);
              dateUnAnVert.setFullYear(dateUnAnVert.getFullYear() + 1);

              let dateUnAnSup = new Date(dateSupplementaire);
              dateUnAnSup.setFullYear(dateUnAnSup.getFullYear() + 1);

              if (abonnementCMZ !== null ||
                abonnementTribu !== null ||
                abonnementBleu !== null ||
                abonnementVert !== null ||
                abonnementSup !== null 
                ) {
                btnNotActive = "disabled"
              }
            
              if (dateUnAnCmz.getFullYear() == newDate.getFullYear() || dateUnAnTribu.getFullYear() == newDate.getFullYear()
                || dateUnAnBleu.getFullYear() == newDate.getFullYear() || dateUnAnVert.getFullYear() == newDate.getFullYear()
                || dateUnAnSup.getFullYear() == newDate.getFullYear()
              ) {
                btnNotActive = ""
              }


              if (abonnement.isBanished == 1) {
                isBanished = `
														<button type="button" class="btn btn-danger isRetablir-${abonnement.abonnement.userId}-tomm-js" data-token="2ahUK:Ewip3tqU6Ob7AhW3gc:4145B77.${abonnement.abonnement.userId}H:bAUoBJQQ-EN6BAhzEAo" onclick="isRetabliBanished(event)">
															Retablir
														</button>`
                
              } else {
                isBanished = `
														<button type="button" class="btn btn-danger isBanished-${abonnement.abonnement.userId}-tomm-js" data-token="2ahUK:Ewip3tqU6Ob7AhW3gc:77B12.${abonnement.abonnement.userId}H:bAUBppJQQ-EN6BAhzEAo" onclick="isBanished(event)" ${btnNotActive}>
															Radier
														</button>`
              }

              if (abonnement.isSuspendre == 1) {
                isSuspendre = `
														<button type="button" class="btn btn-danger isRetablir-${abonnement.abonnement.userId}-susp-tomm-js" data-token="2ahUK:Ewip3tqU6Ob7AhW3gc:4145B77.${abonnement.abonnement.userId}H:bAUoBJQQ-EN6BAhzEAo" onclick="isRetabliSuspendre(event)">
															Retablir
														</button>`
                
              } else {
                isSuspendre = `
														<button type="button" class="btn btn-warning isSuspendre-${abonnement.abonnement.userId}-tomm-js" data-token="2ahUK:Ewip3tqU6Ob7AhW3gc:77B12.${abonnement.abonnement.userId}H:bAUBppJQQ-EN6BAhzEAo" onclick="isSuspendre(event)" ${btnNotActive}>
                              Suspendre
                            </button>`
              }

              tr += `<tr valign="middle">
                      <td style="min-width:218px !important;"><a href="/user/profil/${abonnement.abonnement.userId}" class="text-primary">${abonnement.fullName}</a></td>
                      <td>${cotisationCMZ} €</td>
                      <td>${cotisationTribu} €</td>
                      <td>${cotisationBleu} €</td>
                      <td>${cotisationVert} €</td>
                      <td>${participationSuplementaire} €</td>
                      <td>${dateCotisationCMZ}</td>
                      <td>${dateCotisationTribu}</td>
                      <td>${dateCotisationBleu}</td>
                      <td>${dateCotisationVert}</td>
                      <td>${dateSupplementaire}</td>
                      <td class="content-is-banished-${abonnement.abonnement.userId}">${isBanished}</td>
                      <td class="content-is-suspendre-${abonnement.abonnement.userId}">${isSuspendre}</td>
                      <td>
                        <button type="button" class="btn btn-success isRelance-${abonnement.abonnement.userId}-tomm-js" data-token="2ahUK:Ewip3tqU6Ob7AhW3gc:77B12.${abonnement.abonnement.userId}H:bAUBppJQQ-EN6BAhzEAo" onclick="relanceMailAbonnement(event, '${abonnement.isEmail}')" ${btnNotActive}>
                          Relance
                        </button>
                      </td>
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
      })
      }
    })
}


function copyAffiliateLink(e) {
  let reflink = document.getElementById("reflink");
  reflink.select();
  reflink.setSelectionRange(0, 99999);
  navigator.clipboard.writeText(reflink.value);
  e.target.textContent = "Copié"
  e.target.setAttribute("style","color:green;background-color:white")
  setTimeout(()=>{
    e.target.textContent = "Copier"
    e.target.removeAttribute("style")
  },5000)
}

function showInvitationsG() {
    removeActiveLinkOnG(document.querySelectorAll(".listNavBarTribu > a"), document.querySelector("#fetch_invitation_tribug_nanta_js"))
    document.querySelector(".textIndicationNantaJs").textContent = "Invitations"
    if (document.querySelector(".content_bloc_jheo_js"))
      document.querySelector(".content_bloc_jheo_js").innerHTML = `
                <div class="bg-white rounded-3 px-3" style="width:74%;">
                    <ul class="nav nav-tabs ml-3" id="smallNavInvitation">
                        <li class="nav-item">
                            <a data-element="blockSendEmailInvitation" class="nav-link active text-secondary tab_invite_elie" href="#" onclick="setActiveTabG(this, 'email')">Par e-mail</a>
                        </li>
                        <li class="nav-item">
                            <a data-element="blockHistInvitation" class="nav-link text-secondary tab_invite_elie" href="#" onclick="setActiveTabG(this, 'historique')">Historiques</a>
                        </li>
                    </ul>
                    <div id="blockSendEmailInvitation" class="mt-4 px-3">
                        <h5 class="modal-title text-primary" id="exampleModalLabel">Inviter d'autre fan par e-mail</h5>
                        <h6 class="modal-title text-primary" >Vous pouvez modifier le corps de l'e-mail comme vous le voulez.</h6>
                        <h6 class="modal-title text-primary" >Le lien d'invitation sera généré automatiquement par CMZ.</h6>
                        <h6 class="modal-title text-primary" >L'e-mail envoyé sera automatiquement signé à votre nom.</h6>
                        <form class="content_form_send_invitation_email_js_jheo">
                            <div class="alert alert-success mt-3" id="successSendingMail" role="alert" style="display:none;">
                                Invitation envoyée avec succès !
                            </div>
                            <div class="form-group content_cc_css_jheo mt-3">
                                <label for="exampleFormControlInput1">Destinataires<span class="info_multiple_mail">(*séparez par un espace ou une virgule si vous avez plusieurs destinataires.)</span></label>
                                <input type="text" class="form-control single_destination_js_jheo" id="exampleFormControlInput1" placeholder="Saisir les ou l'adresse(s) e-mail du destinataire">
                                <!--<a href="#" style="padding-top:5px;" class="nav-link link-dark collapsed cc_css_jheo" data-bs-toggle="collapse" data-bs-target="#tribut-collapse" aria-expanded="false">
                                    <span class="me-2 mt-2">Cc/Cci</span>
                                </a>-->
                            </div>

                            
                            <div class="form-group content_objet_css_jheo mt-3">
                                <label for="exampleFormControlInput2">Objet</label>
                                <input type="text" class="form-control object_js_jheo" id="exampleFormControlInput2" value="Invitation de rejoindre ma tribu Géographique sur Consomyzone" placeholder="Objet">
                            </div>

                            <div class="form-group mt-3">
                                <label for="exampleFormControlTextarea1">Corps de l'e-mail</label>
                                <div id="exampleFormControlTextarea32">
                                    <div class="wrapper pt-3 pb-3">
                                        <textarea cols="100 invitation_description_js_jheo" id="exampleFormControlTextarea1">
                                            
                                        </textarea>
                        
                                        <pre id="output"></pre>
                                    </div>
                                </div>
                                <!--<textarea class="form-control invitation_description_js_jheo" id="exampleFormControlTextarea1" rows="3"></textarea>-->
                            </div>

                            <ul class="list-group content_list_piece_joint_jheo_js d-none"></ul>

                            <div class="d-flex justify-content-start align-items-center">
                                <div class="p-2 bd-highlight">
                                    <button type="button" class="btn btn-primary btn_send_invitation_js_jheo my-3">Envoyer l'invitation</button>
                                </div>
                                <div class="p-2 bd-highlight content_input_piece_joint content_input_piece_joint_jheo_js">
                                    <div class="message_tooltip_piece_joint d-none message_tooltip_piece_joint_jheo_js">Ajouter des pièces jointes.</div>
                                    <label class="pointer_cursor label_piece_joint_jheo_js" for="piece_joint">
                                        <i class="fa-solid fa-paperclip pointer_cursor label_piece_joint_jheo_js"></i>
                                    </label>
                                    <input type="file" class="input_piece_joint_jheo_js hidden " id="piece_joint" name="piece_joint" onchange="addPieceJointG(this);" />
                                </div>
                                <div class="p-2 bd-highlight content_input_piece_joint content_add_link_jheo_js">
                                    <div class="pointer_cursor message_tooltip_piece_joint d-none add_link_jheo_js">Ajouter des liens.</div>
                                    <div class="pointer_cursor label_add_link_jheo_js"><i class="fa-solid fa-link"></i></div>
                                </div>
                                <div class="p-2 bd-highlight content_input_piece_joint content_add_image_js">
                                    <div class="pointer_cursor message_tooltip_piece_joint d-none add_image_jheo_js">Ajouter des images.</div>
                                    <label class="pointer_cursor label_add_image_jheo_js" for="piece_joint_image"><i class="fa-solid fa-image"></i></label>
                                    <input type="file" class="input_piece_joint_jheo_js hidden " id="piece_joint_image" name="piece_joint_image" accept="image/png, image/jpeg, image/jpg" onchange="addPieceJointImageG(this);"/>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div id="blockHistInvitation" class="mt-2 d-none">
                        <h5 class="modal-title text-primary mt-3 mb-3" id="exampleModalLabel">Historique des invitations par e-mail</h5>
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>E-mail</th>
                                    <th scope="col">Date</th>
                                    <th scope="col">Avatar</th>
<th scope="col">Invité(e) par</th>
                                    <th scope="col">Status</th>
                                </tr>
                            </thead>
                            <tbody id="all_historique">
                                
                            </tbody>
                        </table>
                    </div>
                </div>
        `;

  initCKEditor("exampleFormControlTextarea1", showInvitationEditorG);

  if (document.querySelector(".content_add_link_jheo_js")) {
    document
      .querySelector(".label_add_link_jheo_js")
      .addEventListener("click", () => {
        $("#addLinkInvitation").modal("show")
      });
  }

  ///hover tooltip piece joint, ...
  displayTooltipHelpMsg();

  /** JEHOVANNIE SEND INVITATION BY EMAIL */
  const form_parent = document.querySelector(
    ".content_form_send_invitation_email_js_jheo"
  );
  const input_principal = form_parent.querySelector(
    ".single_destination_js_jheo"
  );

  const object = form_parent.querySelector(".object_js_jheo");
  const description = form_parent.querySelector(
    ".invitation_description_js_jheo"
  );

  document
    .querySelector("#blockSendEmailInvitation")
    .setAttribute(
      "data-table",
      document.querySelector(".tributG_profile_name").dataset.toggleTribugTable
    );

  input_principal.addEventListener("input", () => {
    input_principal.style.border = "1px solid black";
  });

  object.addEventListener("input", () => {
    object.style.border = "1px solid black";
  });

  controlInputEmailToMultiple([input_principal]);

  form_parent
    .querySelector(".btn_send_invitation_js_jheo")
    .addEventListener("click", (e) => {
      e.preventDefault();

      ////get cc
      let cc_destinataire = [];

      let status = true;

      if (input_principal.value === "") {
        // console.log("Entre au moin une destination.");
        input_principal.style.border = "1px solid red";
        status = false;
      }

      if (checkIfExistMailInValid(input_principal.value)) {
        input_principal.style.border = "1px solid red";
        status = false;
      }

      let data = {
        table: document
          .querySelector("#blockSendEmailInvitation")
          .getAttribute("data-table"),
        principal: formatEmailAdresseFromStringLong(input_principal.value),
        object: "",
        description: "",
      };

      ///object
      if (object.value === "") {
        // console.log("Veillez entre un Object.");
        object.style.border = "1px solid red";
        status = false;
      } else {
        data = { ...data, object: object.value };
      }
      //Changing description check editor by Elie
      data = { ...data, description: editor.getData() };

      if (email_piece_joint_list_g.length > 0) {
        data = { ...data, piece_joint: email_piece_joint_list_g };
      } else {
        data = { ...data, piece_joint: [] };
      }

      if (status) {

        form_parent.querySelector(".btn_send_invitation_js_jheo").setAttribute("disabled", true);
        form_parent.querySelector(".btn_send_invitation_js_jheo").textContent = "En cours...";

        if (email_piece_joint_list_g.length > 0) {
          email_piece_joint_list_g.forEach((item) => {
            const id = item.id;
            const btn_item = document.querySelector(`.fa_solid_${id}_jheo_js`);
            if (btn_item.classList.contains("btn-outline-danger")) {
              btn_item.classList.remove("btn-outline-danger");
            }

            if (!btn_item.classList.contains("btn-outline-primary")) {
              btn_item.classList.add("btn-outline-primary");
            }

            btn_item.innerHTML = `<i class="fas fa-spinner fa-spin"></i>`;

            btn_item.setAttribute("onclick", "");
          });
        }
        console.log(data);
        //////fetch data
        fetch("/user/tribu/email/invitation", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })
          .then((response) => {
            if (!response.ok && response.status != 200) {
              throw new Error("ERROR: " + response.status);
            }
            return response.json();
          })
          .then((result) => {

            let mailsInscrits = result.data[2]
            let totalEmails = result.data[3] 
            if(mailsInscrits.length > 0){
                if(mailsInscrits.length > 1){
                  let texte = ""
                  for (const item of mailsInscrits) {
                    texte += item + ", "
                  }
                  texte = texte.trim();
                  texte = texte.replace(/,$/, '');
                  if(totalEmails > mailsInscrits.length){
                    swal("Attention !", "Les adresses emails " + texte + " sont déjà inscrits dans CMZ. Les invitations pour les autres adresses emails ont été envoyées.", "warning")
                  }else{
                    swal("Attention !", "Les adresses emails " + texte + " sont déjà inscrits dans CMZ.", "warning")
                  }
                }else{
                  if(totalEmails > mailsInscrits.length){
                    swal("Attention !", "L'adresse email " + mailsInscrits[0] + " est déjà inscrit dans CMZ. Les invitations pour les autres adresses emails ont été envoyées.", "warning")
                  }else{
                    swal("Attention !", "L'adresse email " + mailsInscrits[0] + " est déjà inscrit dans CMZ.", "warning")
                  }
                }
            }else{
            swal("Bravo !", "Invitation envoyée avec succès !", "success")
          }

            let table_trib = document
              .querySelector("#blockSendEmailInvitation")
              .getAttribute("data-table");

            form_parent
              .querySelector(".btn_send_invitation_js_jheo")
              .removeAttribute("disabled");
            form_parent.querySelector(
              ".btn_send_invitation_js_jheo"
            ).textContent = "Envoyer l'invitation";

            email_piece_joint_list_g.forEach((item) => {
              const id = item.id;
              const btn_item = document.querySelector(
                `.fa_solid_${id}_jheo_js`
              );
              if (!btn_item.classList.contains("btn-outline-danger")) {
                btn_item.classList.add("btn-outline-danger");
              }

              if (btn_item.classList.contains("btn-outline-primary")) {
                btn_item.classList.remove("btn-outline-primary");
              }

              btn_item.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;

              btn_item.setAttribute(
                "onclick",
                `removeListeItemG(this, '${id}')`
              );
            });

            // document.querySelector("#successSendingMail").style.display =
            //   "block";

            // setTimeout(() => {
            //   document.querySelector("#successSendingMail").style.display =
            //     "none";
            // }, 5000);
          })
          .catch((e) => {
            console.log(e);
          });
      }
    });

}

function removeActiveLinkOnG(allLinks,element){

  allLinks.forEach(li=>{
    if(li.classList.contains("active")){
      li.classList.remove("active");
      li.classList.remove("text-white");
      li.classList.add("text-primary");
    }
  })

  if (!element.classList.contains("active")) {
    element.classList.add("active");
    element.classList.add("text-white");
    element.classList.remove("text-primary");
  }

}

/**
 * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
 *
 * This function is use listen the input file event onchange
 * on the input piece joint in mail invitation
 *
 * All add input image
 * Object element
 */
function addPieceJointG(input) {
	if (input.files && input.files[0]) {
	  /// list all extensions not accepted by email :Les types de fichiers bloqués par Gmail sont les suivants :
	  /// https://support.google.com/mail/answer/6590?hl=fr#zippy=%2Cmessages-avec-pi%C3%A8ces-jointes
	  const listNotAccepted = [
		"zip",
		"css",
		"html",
		"sql",
		"xml",
		"gz",
		"bz2",
		"tgz",
		"ade",
		"adp",
		"apk",
		"appx",
		"appxbundle",
		"bat",
		"cab",
		"chm",
		"cmd",
		"com",
		"cpl",
		"diagcab",
		"diagcfg",
		"diagpack",
		"dll",
		"dmg",
		"ex",
		"ex_",
		"exe",
		"hta",
		"img",
		"ins",
		"iso",
		"isp",
		"jar",
		"jnlp",
		"js",
		"jse",
		"lib",
		"lnk",
		"mde",
		"msc",
		"msi",
		"msix",
		"msixbundle",
		"msp",
		"mst",
		"nsh",
		"pif",
		"ps1",
		"scr",
		"sct",
		"shb",
		"sys",
		"vb",
		"vbe",
		"vbs",
		"vhd",
		"vxd",
		"wsc",
		"wsf",
		"wsh",
		"xll",
	  ];
  
	  /// input value to get the original name of the file ( with the fake path )
	  const value = input.value;
  
	  //// to get the extension file
	  const temp = value.split(".");
	  const extensions = temp[temp.length - 1]; /// extension
  
	  ///if the current extension is in the list not accepted.
	  if (
		!listNotAccepted.some(
		  (item) => item.toLowerCase() === extensions.toLowerCase()
		) &&
		extensions !== value
	  ) {
		var reader = new FileReader();
		reader.onload = function (e) {
		  /// get name the originila name of the file
		  const input_value = value.split("\\");
		  const name = input_value[input_value.length - 1]; /// original name
  
		  ///unique  to identify the file item
		  /// this not save in the database.
		  const id_unique = new Date().getTime();
  
		  ////create item piece joint.
		  createListItemPiece(name, id_unique);
  
		  //// save the item in variable global list piece jointe.
		  email_piece_joint_list_g.push({
			id: id_unique,
			name,
			base64File: e.target.result,
		  });
		};
  
		reader.readAsDataURL(input.files[0]);
	  } else {
		/// if the extension is not supported.
		swal({
		  title: "Le format de fichier n'est pas pris en charge!",
		  icon: "error",
		  button: "OK",
		});
	  }
	}
}

/**
 * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
 *
 * This function is use listen the input file event onchange
 * on the input piece joint in mail invitation
 *
 * All add input image
 * Object element
 */
function addPieceJointImageG(input) {
	if (input.files && input.files[0]) {
	  /// list all extensions not accepted by email :Les types de fichiers bloqués par Gmail sont les suivants :
	  /// https://support.google.com/mail/answer/6590?hl=fr#zippy=%2Cmessages-avec-pi%C3%A8ces-jointes
	  const listNotAccepted = [
		"zip",
		"css",
		"html",
		"sql",
		"xml",
		"gz",
		"bz2",
		"tgz",
		"ade",
		"adp",
		"apk",
		"appx",
		"appxbundle",
		"bat",
		"cab",
		"chm",
		"cmd",
		"com",
		"cpl",
		"diagcab",
		"diagcfg",
		"diagpack",
		"dll",
		"dmg",
		"ex",
		"ex_",
		"exe",
		"hta",
		"img",
		"ins",
		"iso",
		"isp",
		"jar",
		"jnlp",
		"js",
		"jse",
		"lib",
		"lnk",
		"mde",
		"msc",
		"msi",
		"msix",
		"msixbundle",
		"msp",
		"mst",
		"nsh",
		"pif",
		"ps1",
		"scr",
		"sct",
		"shb",
		"sys",
		"vb",
		"vbe",
		"vbs",
		"vhd",
		"vxd",
		"wsc",
		"wsf",
		"wsh",
		"xll",
	  ];
	  const listAccepted = ["png", "gif", "jpeg", "jpg"];
  
	  /// input value to get the original name of the file ( with the fake path )
	  const value = input.value;
  
	  //// to get the extension file
	  const temp = value.split(".");
	  const extensions = temp[temp.length - 1]; /// extension
  
	  ///if the current extension is in the list not accepted.
	  if (
		listAccepted.some((item) => item === extensions) &&
		!listNotAccepted.some(
		  (item) => item.toLowerCase() === extensions.toLowerCase()
		) &&
		extensions !== value
	  ) {
		var reader = new FileReader();
		reader.onload = function (e) {
		  /// get name the originila name of the file
		  const input_value = value.split("\\");
		  const name = input_value[input_value.length - 1]; /// original name
  
		  ///unique  to identify the file item
		  /// this not save in the database.
		  const id_unique = new Date().getTime();
  
		  ////create item piece joint.
		  createListItemPiece(name, id_unique);
  
		  //// save the item in variable global list piece jointe.
		  email_piece_joint_list_g.push({
			id: id_unique,
			name,
			base64File: e.target.result,
		  });
		};
  
		reader.readAsDataURL(input.files[0]);
	  } else {
		/// if the extension is not supported.
		swal({
		  title: "Le format de fichier n'est pas pris en charge!",
		  icon: "error",
		  button: "OK",
		});
	  }
	}
}

/**
 * @author Jehovanie RAMANDRIJOEL <jehovanieram@gmail.com>
 *
 * This function remove the item on the list piece jointe
 * and update variable global `email_piece_joint_list_g` list of the piece joint
 *
 * @param {*} e : event html object: item list piece jointe
 * @param {*} id : unique id in to identify the item piece joint in the list `email_piece_joint_list_g`
 *
 * @return void
 */
function removeListeItemG(e, id) {
	///remove html element
	e.parentElement.remove();
	///remove one element in the piece global
	email_piece_joint_list_g = email_piece_joint_list_g.filter(
	  (item) => item.id != id
	);
}

function setActiveTabG(elem, param) {
  document.querySelectorAll(".tab_invite_elie").forEach((it) => {
    it.classList.remove("active");
  });

  if (!elem.classList.contains("active")) {
    elem.classList.add("active");
    document.querySelector("#" + elem.dataset.element).style = "";
  }
  switch (param) {
    case "email": {
      document.querySelector("#blockHistInvitation").classList.add("d-none");
      document
        .querySelector("#blockSendEmailInvitation")
        .classList.remove("d-none");
      break;
    }
    case "historique": {
      document
        .querySelector("#blockSendEmailInvitation")
        .classList.add("d-none");
      document.querySelector("#blockHistInvitation").classList.remove("d-none");
      fetchAllInvitationStoryG();
      break;
    }
  }
}

/**
 * @constructor
 * @author Nantenaina
 * @Fonction fetch toutes les historiques dans la tribu G et affichage dans un tableau
 */
function fetchAllInvitationStoryG() {
  let table = document.querySelector(".tributG_profile_name").dataset.toggleTribugTable.trim();
  let tbody_hist = document.querySelector("#all_historique");
  tbody_hist.innerHTML = `<td colspan="4"><div class="d-flex justify-content-center">
                        <div class="spinner-border" role="status">
                        <span class="visually-hidden">Loading...</span>
                        </div>
                    </div></td>`;
  fetch("/tribu/invitation/get_all_story/" + table)
    .then((response) => response.json())
    .then((response) => {
      // console.log(response)
      if (response.length > 0) {
        tbody_hist.innerHTML = "";
        for (const item of response) {
          // console.log(item);

          tbody_hist.innerHTML += `<tr>
                            <td>${item.email}</td>
                            <td class="">${item.date}</td>
                            <td class="">${
                              item.user
                                ? `<a href="/user/profil/${
                                    item.user.userId.id
                                  }" class="badge text-bg-primary">${
                                    item.fullNameInvited
                                  }</a>`
                                : `<span class="badge text-bg-warning">Compte non trouvé</span>`
                            }</td>
                            <td><a href="${item.sender? "/user/profil/"+item.sender.id :"#"}" class="badge text-bg-primary">${
                              item.sender? item.fullNameSender :"Fondateur"
                            }</a>
                            <td>${
                              item.is_valid == 1
                                ? `<span class="badge text-bg-success">Validé</span>`
                                : `<span class="badge text-bg-warning">En attente</span>`
                            }</td>
                        </tr>
                    `;
        }
        $("#table-tribuG-member > table").DataTable({
          language: {
            url: "//cdn.datatables.net/plug-ins/1.13.4/i18n/fr-FR.json",
          },
        });
      } else {
        tbody_hist.innerHTML = `<tr class="text-center"><td colspan="5">Aucun historique enregistré pour le moment!</td></tr>`;
      }
    })
    .catch((error) => console.log(error));
}

function bulleListFans() {
  let bulleListFans = document.querySelector(".content-bulle-amie-tomm-js")
  let contentListFans = document.querySelector(".onglet-msg-amie-all-tomm-js")
  if (bulleListFans) {
    bulleListFans.addEventListener("click", () => {

      
      // bulleListFans.classList.toggle("d-none")
      contentListFans.classList.toggle("d-none")
      document.querySelector(".onglet-msg-all-tomm-js").classList.toggle("position-msg-onglet")
      if (document.querySelector(".onglet-list-tomm-js")) {
        document.querySelector(".onglet-list-tomm-js").remove()
        
      } else{
        let url = `/user/message/onglet/list`;
        let iframeongletMsg = document.createElement("iframe");
        iframeongletMsg.src = url;
        iframeongletMsg.classList = "onglet-msg onglet-list-tomm-js";
        iframeongletMsg.id = `ongletListMsg`;
        contentListFans.appendChild(iframeongletMsg);
        fanBulleMsg()
        let iframe = window.parent.document.documentElement.querySelector("#ongletListMsg")
        let iframeDocumentTest = iframe.contentWindow.document.querySelector(".ref_tom_js");
        let iframeDocumentBody = iframe.contentWindow.document.querySelector("body");
            console.log(iframeDocumentTest)

        if (iframeDocumentTest === null) {
          iframeDocumentBody.innerHTML = `
                              <div class="spinner-border text-primary mx-auto" role="status">
                                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'>
                                  <radialGradient id='a7' cx='.66' fx='.66' cy='.3125' fy='.3125' gradientTransform='scale(1.5)'>
                                      <stop offset='0' stop-color='#0d6efd'></stop><stop offset='.3' stop-color='#0d6efd' stop-opacity='.9'></stop>
                                      <stop offset='.6' stop-color='#0d6efd' stop-opacity='.6'></stop>
                                      <stop offset='.8' stop-color='#0d6efd' stop-opacity='.3'></stop>
                                      <stop offset='1' stop-color='#0d6efd' stop-opacity='0'></stop>
                                  </radialGradient>
                                  <circle transform-origin='center' fill='none' stroke='url(#a7)' stroke-width='2' stroke-linecap='round' stroke-dasharray='200 1000' stroke-dashoffset='0' cx='100' cy='100' r='7'>
                                      <animateTransform type='rotate' attributeName='transform' calcMode='spline' dur='2' values='360;0' keyTimes='0;1' keySplines='0 0 1 1' repeatCount='indefinite'>
                                      </animateTransform>
                                  </circle>
                                  <circle transform-origin='center' fill='none' opacity='.2' stroke='#0d6efd' stroke-width='2' stroke-linecap='round' cx='100' cy='100' r='7'></circle>
                                </svg>
                              </div>`;
        }

      }
    })
  }
  
}
bulleListFans()

function closeOngletList() {
  let windowNoIframe = window.parent.document.documentElement;
  let elementIframe = windowNoIframe.querySelector(`.content-bulle-amie-tomm-js`);
  elementIframe.click();
}


window.addEventListener("load", (e) => {
  if (e.target.location.pathname !== "/user/message/onglet/perso" && e.target.location.pathname !== "/user/message/onglet/list") {
    let localBulleIdHtml = sessionStorage.getItem("ongletId")

    if (localBulleIdHtml) {
      let bulleIdHtml = localBulleIdHtml.split(",")
      bulleIdHtml.forEach((idBulle) => {
        let htmlIdBulles = sessionStorage.getItem(`ongletMsg${idBulle}`)
        let windowNoIframe = window.parent.document.documentElement;
        let contentOngletMsg = windowNoIframe.querySelector(".content-bulle-tomm-js");
        if (htmlIdBulles !== null) {
          contentOngletMsg.innerHTML += htmlIdBulles
        }
      })
    }
    
  }
});

function storageBulleList(other_id, imgUrl) { 
  // let imgUrl = document.querySelector(".image_profil_navbar_msg").getAttribute("src");
  let ongletId = []
  
  // ongletId.push(other_id)
  if (sessionStorage.getItem("ongletId")) {
    ongletId.push(sessionStorage.getItem("ongletId"))
    let verrifIdOther = ongletId.indexOf(other_id)
    let verrifIdStorage = sessionStorage.getItem("ongletId").indexOf(other_id)
    if (verrifIdOther === -1 && verrifIdStorage === -1) {
      ongletId.push(other_id)
    } 
  }else {
    ongletId.push(other_id)
  }
  sessionStorage.setItem("ongletId", ongletId)
  sessionStorage.setItem(`ongletMsg${other_id}`, `<div class="content-bulle content-bulle-tomm-js" id="bulle${other_id}Msg" onclick="bulleMsg(${other_id})">
      <img src="${imgUrl}" class="content-bulle">
    </div>`);
}

function removeOngletSession(other_id) {
  sessionStorage.removeItem(`ongletMsg${other_id}`)
  
  if (sessionStorage.getItem("ongletId") !== null) {
    let verrifIdStorage = sessionStorage.getItem("ongletId").indexOf(other_id)
    let idStorage = sessionStorage.getItem("ongletId")
    let idStorageArray = idStorage.split(",")
    if (verrifIdStorage > -1) {
      idStorageArray.splice(verrifIdStorage)
      
      // sessionStorage.removeItem("ongletId")
      // sessionStorage.setItem("ongletId", idStorage)
    }
  }
}


/**
 * @author Tomm
 * affiche la liste d'amis
 */
function fanBulleMsg() {
  let iframe = window.parent.document.documentElement.querySelector("#ongletListMsg")
  fetch("/user/get/allfans/bulle").then((r) => {
    // const ulContainer = document.querySelector(".fan_actif_tom_js");
    
    iframe.onload = () => {
      let iframeDocument = iframe.contentWindow.document;
      let ulContainer = iframeDocument.documentElement.querySelector(".fan_actif_tom_js")
      iframeDocument.documentElement.querySelector(".content_list_enligne_tomm_js").classList.remove("d-none")
      
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
                const li = createListTribuBulle(photoTribuT, title);
                bigContainer.setAttribute(
                  "class",
                  "list-group list-group-flush big_container_js d-none"
                );
                if(amis.length > 0)
                  for (let c = 0; c < amis.length; c++) {
                    const div = createCardPartisanBulle(amis[c]);
                    bigContainer.appendChild(div);
                  }
                else{
                  const span=document.createElement("span");
                  span.innerText="Aucun partisan"
                  bigContainer.appendChild(span);
                }

                li.appendChild(bigContainer);
                ulContainer.appendChild(li);
                hideContainerBulle(li, bigContainer);
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
            if(tribuGLength > 0){
              for (let c = 0; c < tribuGLength; c++) {
                if (c === 0) {
                  const photoTribuG = tribuG[c]["avatarTribuG"];
                  const title = `Liste des partisans dans votre tribu G ${tribuG[c]["nom_tribuG"]}`;
                  li = createListTribuBulle(photoTribuG, title);
                }
                const div = createCardPartisanBulle(tribuG[c]);
                bigContainer.appendChild(div);
              }
            }
            else{
                  const span=document.createElement("span");
                  span.innerText="Aucun partisan"
                  bigContainer.appendChild(span);
              }

              li.appendChild(bigContainer);
              ulContainer.appendChild(li);
              hideContainerBulle(li, bigContainer);
            }
          }
          updateListFan();

          myMessageWorker.onmessage = (e) => {
            reRenderPartisanStatus(e.data);
          };
        });
      }
    }
  });
}

/**
 * @author Tomm
 * provoque l'effet de dropsown sur la list amis
 * @param {*} targetElement
 * @param {*} container
 */
function hideContainerBulle(targetElement, container) {
  const icon = targetElement.querySelector(".superior");
  targetElement.onclick = (e) => {
    let targ = e.target;
    if (
      targ.classList.contains("listing_fa_js") ||
      targ.classList.contains("name_tribu_faniry_js") ||
      targ.classList.contains("superior")
    ) {
      targetElement.classList.toggle("active_amis_list_fa_js");
      if (!targetElement.classList.contains("active_amis_list_fa_js")) {
        container.classList.toggle("d-none");
        icon.style.transform = "rotate(0deg)";
      } else {
        container.classList.toggle("d-none");
        icon.style.transform = "rotate(90deg)";
      }
    }
  };
}

/**
 * @author Tomm
 * créé la carte pour le partisan
 */
function createCardPartisanBulle(json, isIframe = false) {
  const photoProfil =
    json.image_profil != null
      ? "/public" + json.image_profil
      : "/public/uploads/users/photos/default_pdp.png";
  let link = !isIframe
    ? "/user/message/perso?user_id=" + json.id
    : "/api/message/perso_iframe?user_id=" + json.id;

  // const fullName = json.firstname + " " + json.lastname;

    let fullName = json.fullname ? json.fullname : json.firstname + " " + json.lastname;

  // last_msg_user_${json.id}_jheo_js
  //content-message-nanta-css
  const divContainer = document.createElement("div");
  divContainer.setAttribute("class", `cg lc mg sh ol rl tq is  mss_fan_js`);
  divContainer.dataset.rank = cryptageJs((''+json.id));

  const divHeader = document.createElement("div");
  divHeader.setAttribute("class", `h mb sc yd of th`);
  const img = document.createElement("img");
  img.setAttribute("class", `vc yd qk rk elie-pdp-modif image_profil_${json.id}_msg_tomm_js`);   
  img.src = photoProfil;
  img.style = "cursor:pointer;";
  img.dataset.bsToggle = "modal";
  img.dataset.bsTarget = "#modal_show_photo_mess";

  const span = document.createElement("span");
  //span.setAttribute("class","onlinestat_fan_js")
  let isActive = !!json.is_online;
  if (isActive) {
    span.setAttribute("class", "g l m jc wc ce th pi ij xj onlinestat_fan_js");
  } else {
    span.setAttribute("class", "g l m jc wc ce th pi ij onlinestat_fan_js");
    span.style.backgroundColor = "gray";
  }

  img.onclick = function () {
    setPhotoMessage(this);
  };

  divHeader.appendChild(img);
  divHeader.appendChild(span);

  const a = document.createElement("a");
  a.href = "#";
  a.setAttribute("onclick", `addOngletMessage(${json.id})`)
  a.setAttribute("class", "yd");
  a.innerHTML = `<div class="row">
					  <div class="col-8">
						  <h5 class="mn un zn gs">
							  ${fullName}
						  </h5>
					  </div>
				  </div>`;

  divContainer.appendChild(divHeader);
  divContainer.appendChild(a);
  return divContainer;
}


/**
 * @author Tomm
 * créé le listing des tribu
 */
function createListTribuBulle(photoTribu, title) {
  const li = document.createElement("li");
  const img = document.createElement("img");
  const i = document.createElement("i");
  const span = document.createElement("span");

  li.style = "cursor:pointer";
  li.setAttribute("class", "listing_fa_js");
  li.style.padding = "0.75em";
  li.style.width = "100%";

  img.src = photoTribu;
  i.setAttribute("class", "fa-solid fa-chevron-right superior");
  i.style.float = "right";
  span.setAttribute("class", "name_tribu_faniry_js");
  span.textContent = title;

  //li.appendChild(img);
  span.appendChild(i);
  li.appendChild(span);
  // li.appendChild(i);

  i.onclick = (e) => {};
  return li;
}


/**
 * @author Tomm
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
              montant : inputValue
            }

            let url = ""
            if (typeAbonnement == 1) {
              url = "/user/set/abonnement/cotisation/cmz"
            }else if (typeAbonnement == 2) {
              url = "/user/set/abonnement/cotisation/supplementaire"
            }else if (typeAbonnement == 3) {
              url = "/user/set/abonnement/cotisation/tribu"
            }else if (typeAbonnement == 4) {
              url = "/user/set/abonnement/cotisation/vert"
            }else if (typeAbonnement == 5) {
              url = "/user/set/abonnement/cotisation/bleu"
            }
            let request = new Request(url, {
              body: JSON.stringify(data),
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
            });
          
            fetch(request).then((response) => {
              if (response.status === 200) {
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