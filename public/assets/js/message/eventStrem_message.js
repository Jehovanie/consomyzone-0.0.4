/// to send all messages is automatically show and read messages
if(document.querySelector(".content_entete_msg_jheo_js")){

    ////id user sending message
    const user_id = document.querySelector(".content_entete_msg_jheo_js").getAttribute("data-toggle-id-user-to")

    /// sse event
    const evtSource = new EventSource("/user/read/message?id=" + user_id);

    //// event onmessage
    evtSource.onmessage = function(event) {

        //// get data
        const all_messages = JSON.parse(event.data);
        all_messages.forEach(message => {

            if(!document.querySelector(`#message_${message.id}_jheo_js`)){
                
                ///create new div mesage show
                const { text, images } = JSON.parse(message.content);
                createDivMessage(message.id, message.isForMe, message.datetime,text, images);

                if( document.querySelector(".image_temp_js_jheo")){

                    document.querySelector(".image_temp_js_jheo").parentElement.removeChild(
                        document.querySelector(".image_temp_js_jheo")
                    )
                }

                ///fetch set show and read
                fetch("/user/show-read/message", {

                    "method": "POST",
                    "headers": {
                        'Accept': 'application/json',
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        "other_id": message.user_post
                    })

                })
                .then(res => res.json())
                .then((res) => {
                    console.log("Message show and read")
                    console.log(res)
                })
            }
        })
    }
}


//// SHOW MESSAGE ABOVE THE INPUT MESSAGE FROM THE SSE
function createDivMessage(id,isForMe,date, message,images){

    const card_msg= document.createElement("div");
    card_msg.className= "qf";
    card_msg.setAttribute("id", `message_${id}_jheo_js`);

    let image_html_list= "";
    if( images.length > 0 ){
        images.forEach(image=> {
            image_html_list += `<img class="message_image_item" src="${image}" alt="image">`
        });
    }

    card_msg.innerHTML= `
        <p class="qb mn un">
            firstName Lastname
        </p>
        <div class="qb vh hi vj yr el yl">
            <p>${message}</p>
            <div class="content_image_msg">
                ${image_html_list}
            </div>
        </div>
        <p class="nn">${date}</p>
    `
    ////insert into block message
    if(document.querySelector(".content_form_message_jheo_js")){
        if( document.querySelector(".start_discussion_jheo_js")){
            document.querySelector(".start_discussion_jheo_js").remove();
        }
        document.querySelector(".content_discussion_jheo_js").appendChild(card_msg);
        document.querySelector(".content_discussion_jheo_js").scrollTop= 9e9;
    }

    // // <div class="message" id={{"message_" ~ msg.id}}>
    // const div_message = document.createElement("div")
    // div_message.classList.add("message");
    // div_message.setAttribute("id" , "message_" + id );

    // //     <div class="avatar_message right_place"> OR  left_place
    // const div_avatar_message = document.createElement("div")
    // div_avatar_message.classList.add("avatar_message");

    // if( isForMe == "0" ){
    //     div_avatar_message.classList.add("right_place");
    // }else{
    //     div_avatar_message.classList.add("left_place");
    // }

    // //        <div>
    // const div = document.createElement("div")

    // // <span>{{msg.datetime}}</span>
    // const span_date = document.createElement("span");
    // span_date.innerText = date

    // //        <div> >>> span , ... 
    // div.appendChild(span_date);

    // //             <div class="message_single">
    // const div_message_single = document.createElement("div")
    // div_message_single.classList.add("message_single");

    // // <p>{{msg.content ? msg.content.text : "" }}</p>
    // const p_content = document.createElement("p");
    // p_content.innerText = message? message : "";

    // //  <div class="message_single"> >>> p , ... 
    // div_message_single.appendChild(p_content);

    // if( images.length > 0 ){
    //     // <div class="content_image_message image_right">
    //     const div_image_messages = document.createElement("div");
    //     div_image_messages.classList.add("content_image_message");

    //     if( isForMe == "0" ){
    //         div_image_messages.classList.add("image_right");
    //     }else{
    //         div_image_messages.classList.add("image_left");
    //     }

    //     images.forEach(image => {
    //         // <img src="{{asset('uploads/messages/'~ image )}}" alt="Message image">
    //         const image_msg = document.createElement("img");

    //         if(IS_DEV_MODE){
    //             console.log("on dev")
    //             image_msg.setAttribute("src", "/uploads/messages/" + image );
    //         }else{
    //             img.setAttribute("src", "/public/uploads/messages/" + image );
    //         }
            
    //         div_image_messages.appendChild(image_msg);
    //     })

    //     //  <div class="message_single"> >>> ... , div_content_image
    //     div_message_single.appendChild(div_image_messages)

    // }

    // //        <div> >>> ..., <div class="message_single">
    // div.appendChild(div_message_single)

    // // <img src={{ (profil[0].getPhotoProfil != null) ? asset('uploads/users/photos/') ~ profil[0].getPhotoProfil : asset('uploads/users/photos/img_avatar.png') }} alt="{{ profil[0].getFirstname }}">
    // const img = document.createElement("img");
    // img.setAttribute("alt" , "Avatar-Massage");

    // ///verifier the user user sending: isForMe: his send me, else I send it
    // if(isForMe == "0"){/// I sent this message to her

    //     const photo = document.querySelector(".content_message").getAttribute("data-toggle-current-profil")
    //     if(photo){
    //         if( IS_DEV_MODE ){
    //             console.log("on dev")
    //             img.setAttribute("src", "/uploads/users/photos/" + photo  );
    //         }else{
    //             img.setAttribute("src", "/public/uploads/users/photos/" + photo  );
    //         }
    //     }else{

    //         if( IS_DEV_MODE ){
    //             console.log("on dev")
    //             img.setAttribute("src", "/assets/image/message2.jpg" );
    //         }else{
    //             img.setAttribute("src", "/public/assets/image/message2.jpg" );
    //         }
    //     }


    //     div_avatar_message.appendChild(div);
    //     div_avatar_message.appendChild(img);

    // }else{ /// His send this message for me

    //     const photo = document.querySelector(".content_message").getAttribute("data-toggle-other-profil")
    //     if(photo){
    //         if(IS_DEV_MODE){
    //             console.log("on dev")
    //             img.setAttribute("src", "/uploads/users/photos/" + photo  );
    //         }else{
    //             // on prod --------------------------------
    //             img.setAttribute("src", "/public/uploads/users/photos/" + photo  );
    //         }
    //     }else{
    //         if(IS_DEV_MODE){
    //             console.log("on dev")
    //             img.setAttribute("src", "/assets/image/message1.jpg" );
    //         }else{
    //             img.setAttribute("src", "/public/assets/image/message1.jpg" );
    //         }
    //     }

    //     div_avatar_message.appendChild(img);
    //     div_avatar_message.appendChild(div);

    // }

    // div_message.appendChild(div_avatar_message);

    // ///on va insert after the last message show
    // const last_id = parseInt(id) - 1;
    // if( document.querySelector("#message_" + last_id)){

    //     /// insert after the last message
    //     document.querySelector("#message_" + last_id).insertAdjacentElement("beforeend",div_message);
    // }else{

        /// insert befor the input message in the first chat
        document.querySelector(".content_input_message_js_jheo").parentElement.insertBefore(
            div_message,
            document.querySelector(".content_input_message_js_jheo")
        );
    // }
}