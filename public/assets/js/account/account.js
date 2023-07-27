if( document.querySelector(".information_user_conected_jheo_js")){

    const contentInfoUser= document.querySelector(".information_user_conected_jheo_js");

    //// GET NUMBER MESSAGE NOT SHOW  AND SETTINGS 
    const event_source_nbr_message= new EventSource("/user/show/nbrMessageNotShow");
    event_source_nbr_message.onmessage=function(event){

        ///number message not show in the database
        const new_nbr_message= JSON.parse(event.data);

        console.log("new_nbr_message");
        console.log(new_nbr_message);

        /// check if different 0  
        if(parseInt(new_nbr_message) !== 0){
            
            //// get the last number message
            const old_nbr_message =document.querySelector(".nbr_message_jheo_js").innerText;
            
            /// if its less than the new number: let's show
            if( parseInt(old_nbr_message) < parseInt(new_nbr_message)){
                
                //// SHOW BADGE ON MESSAGE ICON
                const badge_msg= document.querySelector('.badge_message_js_jheo')
                if(badge_msg.classList.contains('hidden')){
                    badge_msg.classList.remove('hidden');
                }

                //// UPDATE NUMBER MESSAGE NOT READ
                document.querySelector(".nbr_message_jheo_js").innerText= parseInt(new_nbr_message) > 9 ? new_nbr_message : `0${new_nbr_message}`;
            }
        }
    }


    //// GET ALL MESSAGES AND PUT INTO POPUP MODAL
    const event_source_show_message = new EventSource("/user/show/message");

    event_source_show_message.onmessage=function(event){

        /// last message for each user
        const new_message= JSON.parse(event.data);

        /// check if there is no message in the modal.
        if(document.querySelectorAll(".show_single_msg_popup_jheo_js").length === 0){

            /// show all last messages for each user
            new_message.forEach(single_message => {

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
            })

        }else{ /// there is alread card message 

            /// get all card message exit
            const div_message_already_show = document.querySelectorAll(".show_single_msg_popup_jheo_js");

            //// get all id message in the popup
            const tab_id_msg_already_show = [];

            div_message_already_show.forEach(element => {
                tab_id_msg_already_show.push(parseInt(element.getAttribute("id")))
            })

            //// filter new message from server and show the message don't show
            const new_msg = new_message.filter( item => !tab_id_msg_already_show.includes(parseInt(item.message.id)))
            console.log("new message after filtering")
            console.log(new_msg)

            if( new_msg.length > 0 ) {
                /// for each rest message let's show
                new_msg.forEach(single_message => {

                    createAndAddCardMessage(
                        single_message.message.id,
                        single_message.message.user_post,
                        single_message.firstname,
                        single_message.lastname,
                        single_message.message.content,
                        single_message.message.isForMe,
                        single_message.message.isRead,
                        single_message.profil,
                    );

                })
            }
        }
    }

    /////GET NOTIFICATION AND SETTINGS

    const event_source_notification = new EventSource("/user/show/notification");
    event_source_notification.onmessage = function(event) {
        
        if( event.data != ""){
            const new_notification = JSON.parse(event.data);
            if( document.querySelector(".nbr_notification_jheo_js")){

                const nbr_actual_notification = document.querySelector(".nbr_notification_jheo_js").innerText;

                if(parseInt(nbr_actual_notification) < new_notification.length){

                    const notification_unshow = new_notification.filter(item => {
                        if( item.isShow == "0" ){
                            return item
                        }
                    })

                    if( notification_unshow.length !== 0 ){

                        document.querySelector(".nbr_notification_jheo_js").parentElement.style.opacity="1"
                        document.querySelector(".nbr_notification_jheo_js").innerText= notification_unshow.length > 9 ? notification_unshow.length : `0${notification_unshow.length}` ;
                    }else{
                        document.querySelector(".nbr_notification_jheo_js").parentElement.style.opacity="0"
                    }

                    if( document.querySelector(".content_card_notification_jheo_js")){

                        ////delete old card

                        //deleteCardElement();

                        document.querySelector(".content_card_notification_jheo_js").innerHTML ="";



                        ////show new notification

                        new_notification.forEach(item => {

                            // notif_id,parent_card, card_title_content, card_text_content,card_text_date, is_show, is_read, link, type invitation, isAccepted

                            createAndAddCardNotification(

                                item.id,
                                document.querySelector(".content_card_notification_jheo_js"),
                                "Une nouvelle notification.",
                                item.content,
                                item.datetime,
                                item.isShow,
                                item.isRead,
                                item.type,
                                "?tribu_name="+item.tribu+"&notif_id="+item.id,
                                item.tribu/*,
                                item.invitation,
                                item.is_accepted*/

                            )

                        })

                        

                        if( document.querySelector(".content_card_notification_jheo_js")){

                            document.querySelectorAll(".card_js_jheo").forEach(card =>{

                                card.addEventListener("click", () => {

                                    const notification_id = card.getAttribute("data-toggle-notif-id");

                                    

                                    fetch("/user/notification/read?notif_id="+ notification_id)

                                        .then(response => response.text())

                                        .then(html => {

                                            //document.querySelector(".content_text_js_jheo").innerHTML = html

                                        })

                                } )

                            })

                        }

                    }
                }
            }
        }
    }
}

if( document.querySelector(".notification_jheo_js")){

    const notif_icon = document.querySelector(".notification_jheo_js");

    notif_icon.addEventListener("click", () => {

        if( document.querySelectorAll(".card_js_jheo")){

            const all_card_message= document.querySelectorAll(".card_js_jheo")

            const data = []

            all_card_message.forEach(card => {
                const single_data = { notif_id: card.getAttribute("data-toggle-notif-id")}

                data.push(single_data);
            })



            fetch("/user/notification/show" , {
                method: "POST",
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(res => res.json())
            .then(res => {

                if( res){
                    // document.querySelector(".nbr_notification_jheo_js").innerText="0";
                    document.querySelector(".nbr_notification_jheo_js").parentElement.style.opacity= "0"

                    // const all_card=document.querySelectorAll(".card_js_jheo")
                    // all_card.forEach(item => {
                    //     if( item.classList.contains("back_gray")){
                    //         setTimeout(() => {
                    //             item.classList.remove("back_gray")
                    //         }, 5000)
                    //     }
                    // })
                }
            })
        }
    })
}

if( document.querySelector(".tous_marquer_comme_lu_js_jheo")){

    document.querySelector(".tous_marquer_comme_lu_js_jheo").addEventListener("click" , () => {

        fetch("/user/notification/tous_marquer_lu",{

            method: "POST",

            headers: {

                "content-type": "application/json; charset=utf",

            }

        }).then(response => response.json())

        .then(response =>{

            console.log(response)

        })

    })

}


//// delete the all input in form is the user cancelled the publication.
if(document.querySelector('.annulation_pub_js_jheo')){

    document.querySelector('.annulation_pub_js_jheo').onclick = () => {

        document.querySelector('#publication_legend').value = null
        document.querySelector("#publication_photo").value = null
    }

    document.querySelector('.modal-header .btn-close').onclick = () => {

        document.querySelector('#publication_legend').value = null
        document.querySelector("#publication_photo").value = null
    }

}



/**

 *@author Tommy

 */



if (document.querySelectorAll(".radio-publi").length > 0){

    document.querySelectorAll(".radio-publi").forEach(item => {

        item.addEventListener("change", (e) => {

            console.log(e)

            if (e.target.checked && e.target.id=="man-valid") { 

                //TODO something

                //split(":")[2].split("\.")[1].replace(/[^0-9]/g,"")

            } else if (e.target.checked && e.target.id == "auto-validd") {

                //TODO something

            }

        })

    })

}



if (document.querySelector(".banished")) {

    document.querySelector(".banished").onclick = (e) => {

        // console.log(e)

        const request = new Request("/set/banished", {

            method: "POST",

            headers: {

               'Content-Type': 'application/x-www-form-urlencoded'

            },

            body:"id="+encodeURIComponent(parseInt(e.target.dataset.token.split(":")[2].split("\.")[1].replace(/[^0-9]/g,""),10))



        })

        fetch(request)

        

    }

}



if (document.querySelector(".retablir")) {

    document.querySelector(".retablir").onclick = (e) => {

        // console.log(e)

        const request = new Request("/undo/banished", {

            method: "POST",

            headers: {

                'Content-Type': 'application/x-www-form-urlencoded'

            },

            body:"id="+encodeURIComponent(parseInt(e.target.dataset.token.split(":")[2].split("\.")[1].replace(/[^0-9]/g,""),10))

        })

        fetch(request)



    }

}



if (document.querySelector("#send-request")) {

    document.getElementById("send-request").onclick = (e) => {

        const idReceiver = new URL(location.href).searchParams.get('user_id')

        // console.log("idReceiver : " +  encodeURIComponent(parseInt(idReceiver,10)))

        const request = new Request("/send/notification/ask", {

            method: "POST",

            headers: {

                'Content-Type': 'application/x-www-form-urlencoded'

            },

            body:"id="+encodeURIComponent(parseInt(idReceiver,10))

        })

        fetch(request).then((response) => { 

            if (response.ok && response.status == 200) {

                let div = document.createElement("div")

                div.setAttribute("class", "succes_message request_success")

                div.innerHTML="<p>invitation bien envoyé </p>"

                document.querySelector("main").appendChild(div)

                setTimeout(() => {

                    div.classList.add("disabled_notif_success")

                },4000)

            }

        })

    }

}

/**---------------------end tommy----------------- */





function createAndAddCardMessage(id,other_id, firstname, lastname,message,isForMe, isRead, profil){

    //// format the message to long
    const { text, images } = JSON.parse(message)

    const msg_prefix= isForMe === 0 ? "Vous: " : "";

    if( text !== ""){
        message_text= msg_prefix + text.length > 100 ? text.substring(0,100) + " ... (voir la suite)" : text;
    }else{
        message_text = msg_prefix + "(fichier image)"
    }

    ///CHECK IF  THIS USER SEND MESSAGE IS ALREADY IN THE POPUP MASSAGE
    let popup_message_already_exist= false,  popup_message_id = "" /// their last message id

    ////get all message popup
    const popup_message = document.querySelectorAll(".show_single_msg_popup_jheo_js");
    popup_message.forEach(item => {

        //// check if the id the user is already in the popup message
        if( parseInt(item.getAttribute("data-toggle-other-id")) === other_id ){
            /// get thier id the last message
            popup_message_id = item.getAttribute("id");

            /// validate the user is already in the popup message
            popup_message_already_exist= true;
        }
    })



    /// the user is already in the popup message
    if(popup_message_already_exist && popup_message_id){

        ///select the popup message 
        // const card_message = document.querySelector(".modal_message_"+ popup_message_id);
        const card_message = document.querySelector(`.msg_${popup_message_id}_js_jheo`);

        card_message.setAttribute("class", "show_single_message_popup modal_message_"+id);

        ///change the last message id to the new message id
        card_message.setAttribute("id",id);

        ///format the form and text
        if(parseInt(isForMe) === 1){
            if(parseInt(isRead) !== 1 ){ /// already read 
                if(!card_message.classList.contains("border_gray")){
                    card_message.classList.add("border_gray");
                }
            }else{
                if(card_message.classList.contains("border_gray")){
                    card_message.classList.remove("border_gray");
                }
            }
        }
        card_message.querySelector(".content_msg_text_jheo_js").innerHTML =message_text;

    /// if the user is not in the popup message list
    }else{
        ///create card message and add in the message modal popup
        const card_msg = document.createElement("li");
        card_msg.className= `nr cg h lc mg qg qh sq js yk msg_${id}_js_jheo show_single_msg_popup_jheo_js`;

        /// user author
        card_msg.setAttribute("data-toggle-other-id", other_id);

        /// set the id of the card_msg message
        card_msg.setAttribute("id",id);


        card_msg.innerHTML= `
            <a class="lc mg ug" href='/user/message?user_id=${other_id}'>
                <div class="h sa wf uk th ni ej">
                    <img src='${profil}' alt="User"/>
                    <span class="g l m xe qd th pi jj sj ra"></span>
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
            <!-- <div class="lc mg tg">
                <div x-data="{openDropDown: false}" class="h">
                    <button @click="openDropDown = !openDropDown" @click.outside="openDropDown = false" class="lc mg pg">
                        <svg class="hk" width="14" height="14" viewbox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clip-path="url(#clip0_4662_3241)">
                                <path d="M8.75 12.25C8.75 11.2835 7.9665 10.5 7 10.5C6.0335 10.5 5.25 11.2835 5.25 12.25C5.25 13.2165 6.0335 14 7 14C7.9665 14 8.75 13.2165 8.75 12.25Z" fill=""/>
                                <path d="M8.75 7C8.75 6.0335 7.9665 5.25 7 5.25C6.0335 5.25 5.25 6.0335 5.25 7C5.25 7.9665 6.0335 8.75 7 8.75C7.9665 8.75 8.75 7.9665 8.75 7Z" fill=""/>
                                <path d="M8.75 1.75C8.75 0.783502 7.9665 1.19677e-07 7 1.61924e-07C6.0335 2.04171e-07 5.25 0.783502 5.25 1.75C5.25 2.7165 6.0335 3.5 7 3.5C7.9665 3.5 8.75 2.7165 8.75 1.75Z" fill=""/>
                            </g>
                            <defs>
                                <clipPath id="clip0_4662_3241">
                                    <rect width="14" height="14" fill="white" transform="translate(0 14) rotate(-90)"/>
                                </clipPath>
                            </defs>
                        </svg>
                    </button>

                    <div class="or pr qr g m n oa de eh sh so nj xr ni bj wr vk gc" x-show="openDropDown">
                        <button class="yd sh ol ll gn mn tq js">View Profile</button>
                        <button class="yd sh ol ll gn mn tq js">Mark As Unread</button>
                        <button class="yd sh ol ll gn mn tq js">Delete Message</button>
                        <button class="yd sh ol ll gn mn tq js">Block Message</button>
                    </div>
                </div>
            </div> -->
        `
        //// ADD IN CONTENT
        document.querySelector(".content_card_msg_jheo_js").appendChild(card_msg);
    }

    //// add link to the
    // document.querySelector(`.cta_goto_msg_${id}_js_jheo`).addEventListener("click",() => {
    //     window.location.replace(`/user/message?user_id=${other_id}`)
    // })
}



function createAndAddCardNotification(notif_id,parent_card, card_title_content, card_text_content,card_text_date, is_show, is_read, type, link, tribu){
    const card = document.createElement("div");
    card.classList.add("card");
    card.classList.add("my-2");
    
    card.classList.add("card_js_jheo");

    card.setAttribute("data-toggle-notif-id" , notif_id)

    if(parseInt(is_read) === 0){
        card.classList.add("back_gray");
    }

    const card_body = document.createElement("div");
    card_body.classList.add("card-body");

    const h5 = document.createElement("h5");
    h5.classList.add("card-title");
    h5.setAttribute("lng-tag","nouvelle_notification")
    h5.innerText = card_title_content;

    card_body.appendChild(h5);

    const p = document.createElement("p");
    p.classList.add("card-text");
    p.innerHTML = card_text_content

    let url = "";
    let ancor = p.querySelector("a");
    if(ancor){
        href = ancor.dataset.ancre;
        if(type == "commentaire" || type == "reaction"){
            url = "/user/tribu/publication/" + tribu + "_publication" + link;
            ancor.setAttribute("href", url+href);
            ancor.textContent = "Voir la publication";
        }
    }
    
    card_body.appendChild(p);

    const p_date = document.createElement("p");

    p_date.classList.add("text-right");
    p_date.innerHTML = "<footer class='blockquote-footer'><cite>"+ card_text_date + " </cite></footer>";

    card_body.appendChild(p_date);

    card.appendChild(card_body);

    parent_card.appendChild(card)
}



function deleteCardElement(){

    const all_cards = document.querySelectorAll(".card_js_jheo");

    const parent_card = document.querySelector(".content_card_notification_jheo_js");



    all_cards.forEach(item => {
        parent_card.removeChild(item)
    })
}



function createBadgeNotifContent(){

    const content_notification = document.querySelector(".content_notification");
    const div_badge = document.createElement("div");

    div_badge.classList.add("badge_notification");

    const span_nbr_notification = document.createElement("span")

    span_nbr_notification.classList.add("nbr_notification_jheo_js")



    div_badge.appendChild(span_nbr_notification);



    if( content_notification.querySelector(".nav-link")){

        content_notification.insertBefore(
            div_badge,  
            content_notification.querySelector(".nav-link")
        );

    }else{

        content_notification.appendChild(div_badge);
    }

}

let fileInputProfils = document.querySelectorAll("#fileInputProfil");

fileInputProfils.forEach(fileInputProfil=>{
	fileInputProfil.addEventListener("change", (e) => {
        ///read file
        const fileReader = new FileReader();

        ////on load file
        fileReader.addEventListener("load", () => {

            let avatarPartisant = fileReader.result;

            //console.log(avatarPartisant);
            // Change profil
            let profilPartisants = document.querySelectorAll("#profilPartisant");

            profilPartisants.forEach(profilPartisant=>{
                profilPartisant.src = avatarPartisant
            })

            //profilPartisant.src = avatarPartisant

            if(document.querySelector("#roundedImg") != null){
                document.querySelector("#roundedImg").src = avatarPartisant
            }

            let data = {
                image : avatarPartisant
            }

            fetch(new Request("/user/profil/update/avatar", {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })).then(x => x.json()).then(response => console.log(response));

        });

        ///run event load in file reader.
        fileReader.readAsDataURL(e.target.files[0]);
    })
})
