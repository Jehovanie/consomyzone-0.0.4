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
    
    const userToFirstname= document.querySelector(".content_entete_msg_jheo_js").getAttribute('data-userToFirstname')
    const userToLastname= document.querySelector(".content_entete_msg_jheo_js").getAttribute('data-userToLastname')

    const card_msg= document.createElement("div");
    // if(isForMe== "1"){
    //     card_msg.classList= "qf rb";
    // }else{
    //     card_msg.className= "qf";
    // }
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
            ${userToFirstname} ${userToLastname}
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
}