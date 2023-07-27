//let scroll_to_bottom = document.querySelector('.content_message');
//scroll_to_bottom.scrollTop = scroll_to_bottom.scrollHeight;

//// ON THE PAGE CHAT BOX
// if(screen.width > 1000){

// document.querySelector(".mode_mobile").remove()

// }else{
//     document.querySelector(".mode_pc").remove()
// }

///check btn send and input msg
if(document.querySelector(".btn_send_message_jheo_js") && document.querySelector(".input_message_jheo_js")){
    
    document.querySelector(".content_discussion_jheo_js").scrollTop= 9e9;

    //// input message
    const message_input = document.querySelector(".input_message_jheo_js")

    ///btn send message
    const btn_send_message = document.querySelector(".btn_send_message_jheo_js");

    ///input file
    const icon_input_file_show= document.querySelector(".input_file_show_jheo_js");
    const icon_input_file_hidden= document.querySelector(".input_file_hidden_jheo_js");

    // EVENT CLICK
    icon_input_file_show.onclick = () => {
        icon_input_file_hidden.click();
    }

    ///input file inside the file before
    if(document.querySelector(".input_file_under_image_jheo_js")){
        document.querySelector(".input_file_under_image_jheo_js").onclick = ()  => {
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
            image_list.push(reader.result);

            // for the content image above the input message
            const img = document.createElement("img")
            img.className="image_input_item image_input_item_jheo_js";
            img.setAttribute("alt","Image upload")
            img.src = uploaded_image

            const parentImage = document.querySelector(".content_image_input_jheo_js")
            parentImage.style.display= "flex"

            
            //// add in the first the new image upload
            if(parentImage.querySelector(".image_input_item_jheo_js")){
                parentImage.insertBefore(img, parentImage.querySelector("image_input_item_jheo_js"))
            }else{
                parentImage.appendChild(img)
            }

        });


        ///run event load in file reader.
        reader.readAsDataURL(e.target.files[0]);
        
    })

    ///event on the keyup the user (message text)
    message_input.addEventListener("keyup" , (e) => {
        ///the user key entre ... 
        if (e.code === "Enter" || e.code === "NumpadEnter") {
            
            ///check input content text
            if(document.querySelector(".input_message_jheo_js").value.length > 1 || document.querySelectorAll(".content_image_input_js_jheo img").length > 0 ){

                ///send message---------------------------------------------------
                sendMessage(document.querySelector(".input_message_jheo_js").value, image_list)

                if( document.querySelectorAll(".image_input_item_jheo_js").length > 0 ){
                    image_list = []
                }
            }

            ///delete focus
            document.querySelector(".input_message_jheo_js").blur()

            ///reset input
            document.querySelector(".input_message_jheo_js").value= null

            ///delete content image above ...
            if(document.querySelectorAll(".image_input_item_jheo_js")){

                const image_sended = document.querySelectorAll(".image_input_item_jheo_js");
                image_sended.forEach(element => element.remove())

                document.querySelector(".content_image_input_jheo_js").style.display= "none"
            }

        }

    })



    /// click btn send message

    btn_send_message.addEventListener("click" , () => {

        //alert("ok")
        ///check input content text
        if(document.querySelector(".input_message_jheo_js").value.length > 1 || image_list.length>0 ){

            ///send message---------------------------------------------------
            sendMessage(document.querySelector(".input_message_jheo_js").value, image_list)

            if( document.querySelectorAll(".image_input_item_jheo_js").length > 0 ){
                image_list = []
            }

        }

        ///delete focus
        document.querySelector(".input_message_jheo_js").blur()

        ///reset input
        document.querySelector(".input_message_jheo_js").value= null

        if(document.querySelectorAll(".image_input_item_jheo_js")){

            const image_sended = document.querySelectorAll(".image_input_item_jheo_js");
            image_sended.forEach(element => {
                element.remove()
            })
            document.querySelector(".content_image_input_jheo_js").style.display= "none"
        }
    })
}





/// THIS FUNCTION SHOW AND SEND MESSAGE TO THE SERVER ////////////////

function sendMessage(message, image_list){

    //// format date now 
    const date =new Date().toLocaleDateString() + " " + new Date().toJSON().slice(11,19);

    ///handle message, show under the input champ
    handleMessageResponse(date ,message,image_list, "#",false)

    // ///send to the server
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
            to: document.querySelector(".content_image_input_jheo_js").getAttribute("data-toggle-userto-id"),

            ///message content
            message: message.replace("\n", ""),
            images: image_list
        })
    })
    .then(response => response.json())
    .then(result => { 

        ///change status message
        const content_loading = document.querySelector(".content_loading_jheo_js");
        content_loading.innerHTML = "<i class='fa-solid fa-check'></i>";

        //// change the id the last message.
        const message_sent= document.querySelector("#message_id_jheo_js");
        message_sent.setAttribute("id",`message_${result.id}_jheo_js`);

        setTimeout(() => {
            content_loading.parentElement.removeChild(content_loading);
        }, 2000);

    }).catch((e) => {

        const content_loading = document.querySelector(".content_loading_jheo_js");
        content_loading.innerHTML = "<i class='fa-solid fa-circle-exclamation error_message_status'></i>";
    })
}



//// SHOW MESSAGE ABOVE THE INPUT MESSAGE IN THE FIRST TIME 

function handleMessageResponse(date, message,image_list=null,image,status){

    const card_msg= document.createElement("div");
    card_msg.className= "qf rb";
    card_msg.setAttribute("id", "message_id_jheo_js");

    let image_html_list= "";
    if( image_list.length > 0 ){
        image_list.forEach(image=> {
            image_html_list += `<img class="message_image_item" src="${image}" alt="image">`
        });
    }

    card_msg.innerHTML= `
        <div class="qb vh ii oj el yl">
            <p class="eo">${message}</p>
            <div class="content_image_msg">
                ${image_html_list}
            </div>
        </div>
        <p class="in nn">${date}</p>
    `


    if(!status){

        const content_loading = document.createElement("div");
        content_loading.className= "content_loading content_loading_jheo_js"
        content_loading.innerHTML= "<i class='fa-solid fa-spinner loading'></i>"

        card_msg.appendChild(content_loading);

    }


    // <img src={{ (profil[0].getPhotoProfil != null) ? asset('uploads/users/photos/') ~ profil[0].getPhotoProfil : asset('uploads/users/photos/img_avatar.png') }} alt="{{ profil[0].getFirstname }}">
  

    ////insert into block message
    if(document.querySelector(".content_form_message_jheo_js")){

        if( document.querySelector(".start_discussion_jheo_js")){
            document.querySelector(".start_discussion_jheo_js").remove();
        }

        document.querySelector(".content_discussion_jheo_js").appendChild(card_msg);
        document.querySelector(".content_discussion_jheo_js").scrollTop= 9e9;
    }

}