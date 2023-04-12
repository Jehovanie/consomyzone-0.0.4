//let scroll_to_bottom = document.querySelector('.content_message');
//scroll_to_bottom.scrollTop = scroll_to_bottom.scrollHeight;

//// ON THE PAGE CHAT BOX

///check btn send and input msg
if(document.querySelector(".btn_send_message_js_jheo") && document.querySelector(".input_message_js_jheo")){

    //// input message
    const message_input = document.querySelector(".input_message_js_jheo")

    ///btn send message
    const btn_send_message = document.querySelector(".btn_send_message_js_jheo");

    ///input file
    const icon_input_file= document.querySelector(".i_input_file");

    // EVENT CLICK
    icon_input_file.onclick = () => {
        icon_input_file.querySelector("input").click();
    }

    ///input file inside the file before
    if(document.querySelector(".i_input_file_under_image")){

        document.querySelector(".i_input_file_under_image").onclick = ()  => {
            icon_input_file.querySelector("input").click();
        }

    }

    ////Read image file. (message image)
    let image_list = [];
    icon_input_file.querySelector("input").addEventListener("change", (e) => {

        ///read file
        const reader = new FileReader();

        ////on load file
        reader.addEventListener("load", () => {

            /// file as url
            const uploaded_image = reader.result;

            ///let get multiple images (files)
            image_list.push(reader.result);

            //// for the content image above the input message
            const img = document.createElement("img")
            img.src = uploaded_image
            img.setAttribute("alt","Image upload")
            document.querySelector(".content_image_input_js_jheo").style.display= "flex"

            const parentImage = document.querySelector(".content_image_input_js_jheo")

            //// add in the first the new image upload
            if(parentImage.querySelector("img")){
                parentImage.insertBefore(img, parentImage.querySelector("img"))
            }else{
                document.querySelector(".content_image_input_js_jheo").appendChild(img)
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
            if(document.querySelector(".input_message_js_jheo").value.length > 1 || document.querySelectorAll(".content_image_input_js_jheo img").length > 0 ){

                ///send message---------------------------------------------------
                sendMessage(document.querySelector(".input_message_js_jheo").value, image_list)

                if( document.querySelectorAll(".content_image_input_js_jheo img").length > 0 ){
                    image_list = []
                }
            }

            ///delete focus
            document.querySelector(".input_message_js_jheo").blur()

            ///reset input
            document.querySelector(".input_message_js_jheo").value= null

            ///delete content image above ...
            if(document.querySelectorAll(".content_image_input img")){

                const image_sended = document.querySelectorAll(".content_image_input img");
                image_sended.forEach(element => {
                    element.parentElement.removeChild(element)
                })
                document.querySelector(".content_image_input").style.display= "none"
            }

        }

    })



    /// click btn send message

    btn_send_message.addEventListener("click" , () => {

        //alert("ok")
        ///check input content text
        if(document.querySelector(".input_message_js_jheo").value.length > 1 || image_list.length>0 ){

            ///send message---------------------------------------------------
            sendMessage(document.querySelector(".input_message_js_jheo").value, image_list)

            if( document.querySelectorAll(".content_image_input_js_jheo img").length > 0 ){
                image_list = []
            }

        }

        ///delete focus
        document.querySelector(".input_message_js_jheo").blur()

        ///reset input
        document.querySelector(".input_message_js_jheo").value= null

        if(document.querySelectorAll(".content_image_input img")){

            const image_sended = document.querySelectorAll(".content_image_input img");
            image_sended.forEach(element => {
                element.parentElement.removeChild(element)
            })
            document.querySelector(".content_image_input").style.display= "none"
        }
    })
}





/// THIS FUNCTION SHOW AND SEND MESSAGE TO THE SERVER ////////////////

function sendMessage(message, image_list){

    //// format date now 
    const date =new Date().toLocaleDateString() + " " + new Date().toJSON().slice(11,19);

    ///handle message, show under the input champ
    handleMessageResponse(date ,message,image_list, "#",false)

    ///send to the server
    fetch("/user/push/message", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify( {

            /// current connecter
            from: document.querySelector(".content_input_message_js_jheo").getAttribute("data-toggle-userfrom-id"),
            
            /// user to talk
            to: document.querySelector(".content_input_message_js_jheo").getAttribute("data-toggle-userto-id"),

            ///message content
            message: message.replace("\n", ""),
            images: image_list
        })
    })
    .then(response => response.json())
    .then(result => { 

        ///change status message
        const content_loading = document.querySelector(".content_loading");
        content_loading.innerHTML = "<i class='fa-solid fa-check'></i>";

        //// change the id the last message.
        const message_sent= document.querySelector("#message_id");
        message_sent.setAttribute("id","message_" + result.id);

        setTimeout(() => {
            content_loading.parentElement.removeChild(content_loading);
        }, 2000);

    }).catch((e) => {

        const content_loading = document.querySelector(".content_loading");
        content_loading.innerHTML = "<i class='fa-solid fa-circle-exclamation error_message_status'></i>";
    })
}



//// SHOW MESSAGE ABOVE THE INPUT MESSAGE IN THE FIRST TIME 

function handleMessageResponse(date, message,image_list=null,image,status){

    // <div class="message" id={{"message_" ~ msg.id}}>
    const div_message = document.createElement("div")
    div_message.classList.add("message");
    div_message.setAttribute("id", "message_id"); ///id_message

    //     <div class="avatar_message right_place">
    const div_avatar_message = document.createElement("div")
    div_avatar_message.className = "avatar_message right_place";

    //         <div>
    const div = document.createElement("div")

    //            <span>{{msg.datetime}}</span>
    const span_date = document.createElement("span");
    span_date.innerText = date;

    //             <div class="message_single">
    const div_message_single = document.createElement("div");
    div_message_single.className = "message_single";

    //                   <p>{{msg.content ? msg.content.text : "" }}</p>
    const p_content = document.createElement("p");
    p_content.innerText = message;


    // <div class="message_single"> >>> <p> , ... 
    div_message_single.appendChild(p_content);

    ///generate content_image is exit
    if(image_list &&  image_list.length > 0 ){

        // <div class="content_image_message image_right">
        const div_content_message_image = document.createElement("div")
        div_content_message_image.className = "content_image_message image_right"


        image_list.forEach((element, index) => {
            // <img src="{{asset('uploads/messages/'~ image )}}" alt="Message image">
            const img = document.createElement("img");
            img.setAttribute("id", "image_sended_"+ index );
            img.setAttribute("alt", "Image sended");
            img.setAttribute("class", "image_temp_js_jheo");

            /// on dev -----------------------------
            console.log("on dev");
            img.setAttribute("src", element );
            /// --------------------------------

            /// on prod -----------------------------
            // img.setAttribute("src","/public/" +  element );
            /// --------------------------------


            // <div class="content_image_message image_right"> >>> img
            div_content_message_image.appendChild(img);
        });

        // <div class="message_single"> >>> ... ,  <div class="content_image_message image_right">
        div_message_single.appendChild(div_content_message_image);
    }

    //<div> >>>  span , ... 
    div.appendChild(span_date)

    //<div> >>> ..., <div class="message_single">
    div.appendChild(div_message_single)




    if(!status){

        const content_loading = document.createElement("div");

        content_loading.classList.add("content_loading");

        content_loading.innerHTML= "<i class='fa-solid fa-spinner loading'></i>"

        div.appendChild(content_loading);

    }


    // <img src={{ (profil[0].getPhotoProfil != null) ? asset('uploads/users/photos/') ~ profil[0].getPhotoProfil : asset('uploads/users/photos/img_avatar.png') }} alt="{{ profil[0].getFirstname }}">
    const img = document.createElement("img");
    const image_profil = document.querySelector(".content_message").getAttribute("data-toggle-current-profil")

    if( image_profil ){

        // on dev-------------
        console.log("on dev");
        img.setAttribute("src","/uploads/users/photos/" +  image_profil );
        /// ------------------------

        // on prod-------------
        // img.setAttribute("src","/public/uploads/users/photos/" +  image_profil );
        /// ------------------------

    }else{
        // on dev-------------
        console.log("on dev");
        img.setAttribute("src", "/uploads/users/photos/img_avatar.png" );
        /// ------------------------

        // on prod-------------
        // img.setAttribute("src", "/public/uploads/users/photos/img_avatar.png" );
        /// ------------------------
    }

    img.setAttribute("alt" , "Avatar-Massage");

    // <div class="avatar_message right_place"> >>> div , ...
    div_avatar_message.appendChild(div);

    // <div class="avatar_message right_place"> >>> ..., img
    div_avatar_message.appendChild(img);

    // <div class="message" id={{"message_" ~ msg.id}}>
    div_message.appendChild(div_avatar_message);

    ////insert into block message
    if(document.querySelector(".content_input_message_js_jheo")){

        const block_message =document.querySelector(".content_input_message_js_jheo").parentElement;
        block_message.insertBefore(div_message,document.querySelector(".content_input_message_js_jheo"))
    }

}