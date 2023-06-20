
const user_id = parseInt(document.querySelector(".main_user_id").getAttribute("id"));
const fullname = document.querySelector(".main_user_id").getAttribute("data-toggle-full-name");

if( document.querySelector(".content_publication_js_jheo")){

    /// sse event
    const evtSource = new EventSource("/users/account/publications");

    //// event onmessage
    evtSource.onmessage = function(event) {

        //// get data
        const all_publication = JSON.parse(event.data);
        ///mise a jour des nbrs des reactions de nbrs de comments 
        all_publication.forEach(publication => {

            const publication_id = publication.id;

            const nbr_reaction = publication.reactions.length > 0 ? publication.reactions.length : "";
            const nbr_comment = publication.comments.length > 0 ? publication.comments.length : "";

            if(document.querySelector("#pubication_js_" + publication_id  + "_jheo")){

                document.querySelector("#nbr_reaction_pub_" + publication_id ).innerText = nbr_reaction;
                document.querySelector("#nbr_comment_pub_" + publication_id ).innerText = nbr_comment;
            }

        })

        ///filter publications not show.
        const last_pub_id_show= document.querySelector(".publication_js_jheo") ? document.querySelector(".publication_js_jheo").getAttribute("data-toggle-pub-id") : 0;
        const new_publication = all_publication.filter(pub => parseInt(pub.id) > parseInt(last_pub_id_show))

        if( new_publication.length > 0 ){
            if(document.querySelector(".btn_actualise_js_jheo").classList.contains("hidden_actualise")){
                document.querySelector(".btn_actualise_js_jheo").classList.remove("hidden_actualise");
            }

            if(!document.querySelector(".btn_actualise_js_jheo").classList.contains("btn_actulise_annimation")){
                document.querySelector(".btn_actualise_js_jheo").classList.add("btn_actulise_annimation");
            }

            setTimeout(() => {
                document.querySelector(".btn_actualise_js_jheo").classList.add("hidden_actualise");
                document.querySelector(".btn_actualise_js_jheo").classList.remove("btn_actulise_annimation");
            }, 5000)
        }
    }
}

if( document.querySelector(".content_chargement_publication_js_jheo")){


    window.addEventListener('scroll', function(e) {
        const scroll_Y = window.scrollY;
        const scrollable = document.documentElement.scrollHeight - window.innerHeight

        const content_description = document.querySelector(".need_position_fixed_js_jheo")
        const scroll_goal= content_description.getBoundingClientRect().bottom +  content_description.getBoundingClientRect().height;
        
        if( parseInt(scroll_goal) - parseInt(scroll_Y) < 0 ){
            if(!document.querySelector(".need_position_fixed_js_jheo").classList.contains("position_sticky")){
                document.querySelector(".need_position_fixed_js_jheo").classList.add("position_sticky")
            }
        }else{
            if(document.querySelector(".need_position_fixed_js_jheo").classList.contains("position_sticky")){
                document.querySelector(".need_position_fixed_js_jheo").classList.remove("position_sticky")
            }
        }

        if( parseInt(scroll_Y) === parseInt(scrollable)){

            const loading_content= document.querySelector(".content_chargement_publication_js_jheo");
            const last_pub_id= loading_content.getAttribute("data-toggle-pub-id");

            const content_pub= document.querySelector(".content_publication_js_jheo");

            fetch(`/tribuG/publications/${parseInt(last_pub_id) - 1 }`)
                .then(response => response.text())
                .then(response => {
                    var responseHTML = (new DOMParser()).parseFromString(response, "text/html");

                    if( responseHTML.querySelector(".publication_js_jheo")){
                        document.querySelector(".content_chargement_publication_js_jheo").remove();
                        content_pub.innerHTML  += response;
                    }


                    if( parseInt(last_pub_id) > 1 ){
                        content_pub.innerHTML  += `
                            <div data-toggle-pub-id=${ last_pub_id - 1 } class="content_chargement_publication content_chargement_publication_js_jheo mt-3">
                                <div class="spinner-border text-primary" role="status">
                                    <span class="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        `
                    }else{

                        removeChargement()

                        if( !document.querySelector(".reload_publication_js_jheo")){
                            content_pub.innerHTML  += `
                                <div class="content_chargement_publication reload_publication_js_jheo mt-3">
                                    <button type="button" class="btn btn-primary">Il n'y a plus de publication</button>
                                </div>
                            `
            
                            document.querySelector(".reload_publication_js_jheo").addEventListener("click", () => {
                                location.replace(location.href);
                            })
                        }
                    }
                })
        }
    });
}


//// Pour empéche une publication vide.

if( document.querySelector(".send_new_pub_js_jheo")){

    document.querySelector(".send_new_pub_js_jheo").addEventListener("click",(e) => {

        const text_content = document.querySelector("#publication_legend").value;

        const image_content = document.querySelector("#publication_photo").value;



        if( !text_content &&  image_content.length  === 0 ){

            e.preventDefault();

            alert("Impossible de publier une publication vide.")

        }

    })



}


function removeChargement(){
    if( document.querySelector(".content_chargement_publication_js_jheo")){
        document.querySelector(".content_chargement_publication_js_jheo").remove();
    }
}

function isLike(pub_id, author_id) {

    value = 0

    x = document.querySelector(".reaction_js_" + pub_id + "_jheo")

    if (x.classList.contains("bi-heart-fill")) {

        x.classList.remove("bi-heart-fill")

        x.classList.add("bi-heart");

        x.style.color = "black";

    } else {

        x.classList.remove("bi-heart")

        x.classList.add("bi-heart-fill");

        x.style.color = "red";

        value = 1;

    }



    fetch("/tributG/publications/reaction", {

        method: "POST",

        headers: {

            'Content-Type': 'application/json',

            'Accept'  : 'application/json'

        },

        body: JSON.stringify({

            "pub_id": pub_id,

            "is_like": value,

            "author_id": author_id,

        })

    }).then(res => res.json())

    .then(res => {



        if( parseInt(res.reaction) > 0 ){

            document.querySelector("#nbr_reaction_pub_" + pub_id  ).innerText = res.reaction;

        }else{

            document.querySelector("#nbr_reaction_pub_" + pub_id  ).innerText = "";

        }

    })

}

function handleCommentPublished(author_id, publication_id , comment, bouton=null){
    
    let audioSrc = null;

    if( bouton ){
        audioSrc = bouton.querySelector("#audio_" + publication_id) != null ? bouton.querySelector("#audio_" + publication_id).src : "";
        
        if(bouton.querySelector("#audio_" + publication_id)){
            console.log(bouton.querySelector("#audio_" + publication_id).src);
        }

        if(bouton.querySelector("#soundClips > div.clip")){
            bouton.querySelector("#soundClips > div.clip").remove();
            bouton.querySelector("#soundClips > div.iconeDelete").remove();
            bouton.querySelector("#soundClips").style.display="none"
        }
    }

    fetch("/tributG/publications/comment", {
        headers: {
            'Content-Type': 'application/json',
            'Accept'  : 'application/json'
        },
        method: "POST",
        body: JSON.stringify({
            "author_id": author_id,
            "publication_id": publication_id,
            "comment": comment,
            "audio": audioSrc
        })
    })
        .then(response => response.json())
        .then(response => {
            console.log(response);
        })

}


function fetchNotification(publication_id){


    const content_comment = document.querySelector(`.content_comment_${publication_id}_js_jheo`).querySelector(".content_notification_tributg")
            
    ////delete old comments
    if (content_comment && content_comment.querySelectorAll(".card_comment_js")){
        content_comment.querySelectorAll(".card_comment_js").forEach(comment => {
            comment.remove();
        })
    }

    document.querySelector(`.content_comment_${publication_id}_js_jheo`).querySelector(".content_notification_tributg").innerHTML = `
        <div class="content_loading_js_jheo">
            <div class="spinner-border text-primary d-block mx-auto" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
    `

    const header = {
        'Content-Type': 'application/json',
        'Accept'  : 'application/json'
    };

    const options_request= {
        headers: header,
        method: "POST",
        body: JSON.stringify({
            "publication_id": publication_id,
        })
    }
    

    fetch("/tributG/publications/comments/fetchall", options_request )
        .then(response => response.json())
        .then(results => {

            if(document.querySelector(`.content_comment_${publication_id}_js_jheo`).querySelector(".content_loading_js_jheo")){
                document.querySelector(`.content_comment_${publication_id}_js_jheo`).querySelector(".content_loading_js_jheo").remove();
            }

            if (results.success ){
                if( results.comments.length > 0){

                    results.comments.forEach(comment => {

                        let audio;

                        if(comment.audioname){
                            audio = `/uploads/users/audios/${comment.audioname}`;
                        }

                        createCardComment(
                            comment.user_id,
                            comment.pub_id,
                            comment.userfullname,
                            comment.photo_profil,
                            calculateDurationOfComment(comment.datetime),
                            comment.id,
                            comment.commentaire,
                            audio,
                            comment.id,
                        );

                    })

                }else{
                    content_comment.innerHTML= `
                        <div class="alert alert-primary text-center no_comment_${publication_id}_js_jheo" role="alert">
                            Laissez-moi un commentaire.
                        </div>
                    `
                }

            }else{
                content_comment.innerHTML= `
                    <div class="alert alert-warning text-center error_comment_${publication_id}_js_jheo" role="alert">
                        Il y a une erreur sur votre reseaux!
                    </div>
                `
            }

        })

}


function formatDisplayComment(){

}

function createCardComment(publication_user_id, publication_id, user_fullname, user_profil, datetime, comment_id=null, comment=null, audio=null){

    comment_id = comment_id ? comment_id : 0;

    const card_comment = document.createElement("div");
    card_comment.className = "card_comment_js card my-2";
    card_comment.classList.add(`card_comment_${comment_id}_js_jheo`);

    const card_body = document.createElement("div");
    card_body.classList.add("card-body");

    const user_id = parseInt(document.querySelector(".main_user_id").getAttribute("id"));

    const profil= user_profil ? user_profil : "/public/assets/image/img_avatar3.png";

    let comment_admin = "";
    if( parseInt(publication_user_id) === parseInt(user_id)){
        comment_admin= `
            <div class="float-end dropstart">
                <span class="float-end" style="cursor:pointer" data-bs-toggle="dropdown">
                    <i class="bi bi-three-dots" style="cursor:pointer"></i>
                </span>
                <ul class="dropdown-menu">
                    <li>
                        <button class="dropdown-item" onclick="changeComment('${comment_id}' , '${publication_id}')">
                            <i class="fas fa-edit"></i>
                            Modifier
                        </button>
                    </li>
                    <li>
                        <button data-bs-toggle="modal" data-bs-target="#deleteCommentConfirm" class="dropdown-item" onclick="show_modal_remove_com('${publication_id}', ${comment_id})">
                            <i class="fas fa-trash" aria-hidden="true"></i>
                            Supprimer
                        </button>
                    </li>
                </ul>
            </div>
        `
    }

    const card_body_html= `
        <div class="card">
            <div class="card-body">
                <div class="card_entete">
                    <div class="content_profile">
                        <div class="d-flex justify-content-end align-items-centerprofile_comment">
                            <img src="${profil}" class="image_profile_comment me-2"/>
                            <div class="name_date">
                                <a href="/user/profil/${user_id}" class="card-title"> ${user_fullname}</a>
                                <span class="datetime_comment">${datetime}</span>
                            </div>
                        </div>
                    </div>
                    ${comment_admin}
                </div>
                <p class="text_js_jheo ms-3 mt-2">${comment}</p>
            </div>
        </div>
    `


    
    if(audio){

        const audio_content = document.createElement("audio")

        audio_content.classList.add("card-text")

        audio_content.setAttribute("controls", "")

        audio_content.src = audio;

        card_body.appendChild(audio_content);

    }
    
    // card_comment.appendChild(card_body);
    card_comment.innerHTML = card_body_html;

    const content_comment = document.querySelector(`.content_comment_${publication_id}_js_jheo`).querySelector(".content_notification_tributg")

    ///if there is already content comment, insert a new comment on the top
    if (content_comment && content_comment.querySelectorAll(".card_comment_js").length > 0){

        content_comment.insertBefore(
            card_comment,
            content_comment.querySelector(".card_comment_js")
        )

    }else{
        ///first comment
        content_comment.appendChild(card_comment);
    }

}


function changeComment(comment_id, publication_id){
    const card_comment= document.querySelector(`.card_comment_${comment_id}_js_jheo`);
    document.querySelector(`.text_input_${publication_id}_js_jheo`).value=card_comment.querySelector(".text_js_jheo").innerText;

    document.querySelector(`.cta_send_notification_${publication_id}_js_jheo`).setAttribute("onclick", `handleChangeComment("${publication_id}", "${comment_id}")`);

    // document.querySelector(`.cta_send_notification_${publication_id}_js_jheo`).innerText = "Modifier";
}

function show_modal_remove_com(pub_id, comm_id){
    document.querySelector(".cta_confirme_del_com_js_jheo").setAttribute("onclick", `removeComment('${pub_id}', '${comm_id}')`);
}

function removeComment(pub_id,comment_id){
    if( parseInt(pub_id)){
        fetch(`/tribuG/publication/${pub_id}/comment/${comment_id}/delete`)
            .then(response => response.json())
            .then(response => {
                console.log(response)
                document.querySelector(`.card_comment_${comment_id}_js_jheo`).remove();
            })
    }
}

function handleAndSentNotification(publication_id, publication_user_id){


    if( document.querySelector(`.no_comment_${publication_id}_js_jheo`)){
        document.querySelector(`.no_comment_${publication_id}_js_jheo`).remove();
    }

    if( document.querySelector(`.error_comment_${publication_id}_js_jheo`)){
        document.querySelector(`.error_comment_${publication_id}_js_jheo`).remove();
    }

    if( document.querySelector(".form_comment_"+ publication_id)){
        const form_content = document.querySelector(".form_comment_"+ publication_id);


        if(form_content.querySelector("input").value != null && form_content.querySelector("input").value.length > 1 ){
            const user_id = parseInt(document.querySelector(".main_user_id").getAttribute("id"));
            createCardComment(
                user_id,
                publication_id,
                document.querySelector(".main_user_id").getAttribute("data-toggle-full-name"),
                document.querySelector("#profilPartisant").getAttribute("src"),
                "maintenant",
                0,
                form_content.querySelector("input").value 
            );

            handleCommentPublished(
                publication_user_id,
                publication_id,
                form_content.querySelector("input").value
            );
            ///delete content on form.
            form_content.querySelector("input").value = null
        }
    }
}


function handleChangeComment(publication_id, comment_id){
    

    const form_content = document.querySelector(".form_comment_"+ publication_id);
    if(form_content.querySelector("input").value != null && form_content.querySelector("input").value.length > 1 ){

        const card_comment= document.querySelector(`.card_comment_${comment_id}_js_jheo`);
        card_comment.querySelector(".text_js_jheo").innerText= form_content.querySelector("input").value
        // document.querySelector(`.cta_send_notification_${publication_id}_js_jheo`).innerHTML = "Envoyer";

        const post_publication= document.querySelector(`#pubication_js_${publication_id}_jheo`);
        const pub_user_id= parseInt(post_publication.getAttribute("data-toggle-pub-user-id"));

        document.querySelector(`.cta_send_notification_${publication_id}_js_jheo`).setAttribute("onclick", `handleAndSentNotification('${publication_id}', '${pub_user_id}')`);

        handleEditComment(
            publication_id,
            comment_id,
            form_content.querySelector("input").value
        );

        ///delete content on form.
        form_content.querySelector("input").value = null
    }
}

function handleEditComment(publication_id, comment_id, text_comment){

    const request_headers = {
        headers: {
            'Content-Type': 'application/json',
            'Accept'  : 'application/json'
        },
        method: "POST",
        body: JSON.stringify({
            "publication_id": publication_id,
            "comment_id": comment_id,
            "comment_text": text_comment
        })
    }

    fetch(`/tributG/publications/${publication_id}/comment/${comment_id}/change`, request_headers)
        .then(response => response.json())
        .then(response => console.log(response));
}

function getPub(pub_id, message, confid) {
    document.querySelector("#pub_id_modif").value = pub_id;
    document.querySelector("#option_modif").value = confid;
    document.querySelector("#message-text_modif").innerHTML = message;
}

function confirm(pub_id){
    document.querySelector("#data-pub-id").value = pub_id;
}

function updatePublication(){
    let data = {
        "pub_id": document.querySelector("#pub_id_modif").value,
        "confidentiality": document.querySelector("#option_modif").value,
        "message": document.querySelector("#message-text_modif").value
    }

    const URL = "/user/acount/tributG/publication/update";
    const options = {
        method: "PUT",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    }

    fetch(URL, options)
        .then(response => {
            if(!response.ok || response.status != 204 ){
                throw new Error("ERROR: from the backend, CODE: " + response.status)
            }
            console.log(response)
            return response.text();
        }).then(response => {
            console.log(response);
            location.reload();
        }).catch(error => {
            console.log(error);
        })

}

function removePublication(elem){
    console.log(elem)
    document.querySelector(`#pubication_js_${elem.value}_jheo`).remove();

    const URL = "/user/acount/tributG/publication/delete";
    const options = {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            "Content-Type": 'application/json'
        },
        body: JSON.stringify({
            "id_publication": elem.value
        })
    }

    fetch(URL, options)
        .then(response => {
            if( !response.ok || response.status !== 204 ){
                throw new Error("ERROR: from the back")
            }
            return response.json();
        }).then(response => {
            console.log(JSON.stringify(response));
        }).catch(error => {
            console.log(error)
        })

}

function addAudio(bouton,id){
    /* For sending media recorder */

    var mediaRecorder
    let record = bouton.querySelector("#start")
    let stop = bouton.querySelector("#stop")
    let soundClips = bouton.querySelector("#soundClips")

    let dateForName = new Date();
    let month = parseInt(dateForName.getMonth()) + 1
    if(String(month).length < 2){
        month = String("0"+month)
    }

    let dateString = dateForName.getDate() + "_" + month + "_" + dateForName.getFullYear();

    record.addEventListener('click', event => {
        if (navigator.mediaDevices) {
        console.log("getUserMedia supported.");

        const constraints = { audio: true };
        let chunks = [];

        navigator.mediaDevices
            .getUserMedia(constraints)
            .then((stream) => {
            mediaRecorder = new MediaRecorder(stream);

            //visualize(stream);

            mediaRecorder.start();
            console.log(mediaRecorder.state);
            console.log("recorder started");
            record.style.display = "none";
            stop.style.display = "block";

            mediaRecorder.onstop = (e) => {
                console.log("data available after MediaRecorder.stop() called.");

                //const clipName = prompt("Enter a name for your sound clip");

                const clipName = dateString+".oga";
                const clipContainer = document.createElement("div");
                const iconContainer = document.createElement("div");
                //clipContainer.classList.add("container");
                clipContainer.classList.add("col-5");
                iconContainer.classList.add("col-1");
                const audio = document.createElement("audio");
                audio.id = "audio_"+id;
                const deleteButton = document.createElement("i");

                clipContainer.classList.add("clip");
                iconContainer.classList.add("iconeDelete");
                audio.setAttribute("controls", "");
                audio.classList.add("ml-5");
                deleteButton.classList.add("bi");
                deleteButton.classList.add("bi-trash3");
                deleteButton.style.color = "red"
                deleteButton.style.marginLeft = "5px"
                deleteButton.style.cursor = "pointer"
                deleteButton.style.fontSize = "30px"
                clipContainer.appendChild(audio);
                iconContainer.appendChild(deleteButton);
                soundClips.appendChild(clipContainer);
                soundClips.appendChild(iconContainer);
                soundClips.classList.add("mt-3");

                bouton.querySelector("#soundClips").style.display = ""
                
                audio.controls = true;
                const blob = new Blob(chunks, { type: "audio/mp3; codecs=opus" });
                chunks = [];
                console.log(blob)
                //const audioURL = URL.createObjectURL(blob);
                //audio.src = audioURL;
                //console.log("recorder stopped");

                var reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onloadend = function () {
                var base64String = reader.result;
                audio.src = base64String
                console.log('Base64 String - ', base64String);
                }

                deleteButton.onclick = (e) => {
                const evtTgt = e.target;
                evtTgt.parentNode.parentNode.removeChild(evtTgt.parentNode.previousElementSibling);
                evtTgt.parentNode.parentNode.removeChild(evtTgt.parentNode);
                soundClips.classList.remove("mt-3");
                //evtTgt.parentNode.parentNode.remove();
                };
            };

            mediaRecorder.ondataavailable = (e) => {
                chunks.push(e.data);
            };
            })
            .catch((err) => {
            alert("Veuillez vérifier votre micro !");
            console.error(`The following error occurred: ${err}`);
            });
        }
    });

    stop.addEventListener('click', event => {
        mediaRecorder.stop();
        console.log(mediaRecorder.state);
        console.log("recorder stopped");
        record.style.display = "block";
        stop.style.display = "none";
    });
}
