if( document.querySelector(".content_publication_js_jheo")){

    const user_id = parseInt(document.querySelector(".main_user_id").getAttribute("id"));
    const fullname = document.querySelector(".main_user_id").getAttribute("data-toggle-full-name");

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
        const new_publication = all_publication.filter(pub => !document.querySelector("#pubication_js_"+ pub.id + "_jheo"))

        //// add new publication
        new_publication.forEach(publication => {

            // <div class="publication_js_jheo" id={{"pubication_js_" ~ pub.id ~ "_jheo" }}>
            const div_parent = document.createElement("div")

            div_parent.classList.add("publication_js_jheo")

            div_parent.setAttribute("id", "pubication_js_" + publication.id + "_jheo");



            div_parent.setAttribute("data-toggle-pub-id", publication.id);

            div_parent.setAttribute("data-toggle-pub-user-id", publication.user_id);



                //<div class="card mb-2">

                const div_card = document.createElement("div")

                div_card.classList.add("card")

                div_card.classList.add("mb-2")



                        //<div class="card-header">

                        const div_card_header = document.createElement("div")

                        div_card_header.classList.add("card-header")





                            //<a href="{{ path("user_profil", {"user_id":pub.user_id }) }}">

                            const a = document.createElement("a");

                            a.setAttribute("href","/user/profil/"+ publication.user_id);

                            

                                // <i>{{pub.userfullname}}</i>

                                const i_userfullname = document.createElement("i");

                                i_userfullname.innerText = publication.userfullname



                            a.appendChild(i_userfullname);

                        div_card_header.appendChild(a);

                        //</a>

                            

            //             <i class="bi bi-play-fill"></i>

                            const i_bi = document.createElement("i");

                            i_bi.classList.add("bi");

                            i_bi.classList.add("bi-play-fill");



                        div_card_header.appendChild(i_bi)

                            //<a href="#">

                            const a_link = document.createElement("a");

                            //<i class="bi bi-collection"></i>

                            const i_bi_collection = document.createElement("i");

                            i_bi_collection.classList.add("bi");

                            i_bi_collection.classList.add("bi-collection");

                            a_link.appendChild(i_bi_collection);

                            //{{tributG.profil.name}}

                            a_link.innerHTML = document.querySelector(".tributG_profile_name").getAttribute("data-toggle-tribut-profil-name")

                        div_card_header.appendChild(a_link);

            //</div>

                div_card.appendChild(div_card_header);

            // div_parent.appendChild(div_card)

                //         <div class="card-body">

                    const div_card_body_content = document.createElement("div")

                    div_card_body_content.classList.add("card-body")

                //          <p class="card-text">{{pub.publication}}</p>

                            const p_card_text = document.createElement("p");

                            p_card_text.classList.add("card-text");

                            p_card_text.innerText = publication.publication

                            

                    div_card_body_content.appendChild(p_card_text);



                    if( publication.photo){

                        const div_content_photo = document.createElement("div")

                        div_content_photo.setAttribute("style", "max-heigth:100%; max-width: 100%;")



                        const img = document.createElement("img");

                        img.setAttribute("width","50%" )
                        img.setAttribute("heigth","100px" )

                        // img.classList.add("card-img-top");

                        ///on dev -------------
                        // img.setAttribute("src", "/assets/publications/photos/" + publication.photo);
                        /// --------------------------------

                        // on prod ----------
                        img.setAttribute("src", "/public/assets/publications/photos/" + publication.photo);
                        //-------------------

                        img.setAttribute("alt", "Card image cap");



                        div_content_photo.appendChild(img);



                        div_card_body_content.appendChild(div_content_photo);



                    }

                //             

                //             <p class="card-text">

                            const p_card_text_2 = document.createElement("p");

                            p_card_text_2.classList.add("card-text");

                //                 

                                const i_small = document.createElement("i");



                                    const small = document.createElement("small");

                                    small.classList.add("text-muted");

                                    small.innerText = "Publié le " +  publication.datetime

                                i_small.appendChild(small);



                            p_card_text_2.appendChild(i_small)

                //              <span class="badge text-bg-primary" style="background-color:#0d6efd;">

                                const span_badge = document.createElement("span");

                                span_badge.classList.add("badge");

                                span_badge.classList.add("text-bg-primary");

                                span_badge.style.backgroundColor = "#0d6efd";

                                    // <i class="bi bi-eye-fill"></i>
                                    const i_bi_eye_fill = document.createElement("i");

                                    i_bi_eye_fill.classList.add("bi");

                                    i_bi_eye_fill.classList.add("bi-eye-fill");



                                span_badge.appendChild(i_bi_eye_fill);

                                    

                                if( publication.confidentiality == 1 ){

                                    span_badge.innerText += "Publique";

                                }else if( publication.confidentiality == 2){

                                    span_badge.innerText += "Ami(e)s";

                                }else{

                                    span_badge.innerText += "Moi uniquement";

                                }



                            p_card_text_2.appendChild(span_badge)



                    div_card_body_content.appendChild(p_card_text_2);


                div_card.appendChild(div_card_body_content);

                // div_parent.appendChild(div_card_body_content);



                    //  <div class="card-footer foot">

                    const div_card_footer = document.createElement("div")

                    div_card_footer.classList.add("card-footer")

                    div_card_footer.classList.add("foot");



                        //  <div class="row text-center">

                        const div_text_center = document.createElement("div")

                        div_text_center.classList.add("row")

                        div_text_center.classList.add("text-center")



                            // <div class="col-4 ">

                            const div_col_4 = document.createElement("div")

                            div_col_4.classList.add("col-4")



                                // <span>

                                const span_temp = document.createElement("span");



                                    const span_reaction = document.createElement("span");

                                    span_reaction.setAttribute("id","nbr_reaction_pub_" + publication.id)

                                    span_reaction.innerText = publication.reactions.length > 0 ? publication.reactions.length : "";



                                span_temp.appendChild(span_reaction);



                                // </span>

                                    //  <i class="bi-heat-fill" onclick="() => {alert('click reaction')}" style="cursor: pointer"></i>

                                    const i_bi_heat_fill = document.createElement("i");



                                    i_bi_heat_fill.classList.add("reaction_js_" + publication.id + "_jheo");



                                    if(publication.reactions.find((reaction => parseInt(reaction.user_id) === user_id )) ){

                                        i_bi_heat_fill.classList.add("bi-heart-fill");

                                    }else{

                                        i_bi_heat_fill.classList.add("bi-heart");

                                    }



                                    i_bi_heat_fill.onclick = () => isLike(publication.id,publication.user_id)

                                    i_bi_heat_fill.style.cursor = "pointer";



                                span_temp.appendChild(i_bi_heat_fill);



                            div_col_4.appendChild(span_temp);



                        div_text_center.appendChild(div_col_4);



                            const div_col_4_chat_square = document.createElement("div");

                            div_col_4_chat_square.classList.add("col-4");



                                const span_nbr_comment = document.createElement("span");

                                span_nbr_comment.setAttribute("id","nbr_comment_pub_" + publication.id);

                                span_nbr_comment.innerText = publication.comments.length > 0? publication.comments.length : "";



                            div_col_4_chat_square.appendChild(span_nbr_comment);



                                const a_collapse = document.createElement("a");

                                a_collapse.setAttribute("data-bs-toggle", "collapse");

                                a_collapse.setAttribute("href", "#collapse_comment_" + publication.id  );

                                a_collapse.setAttribute("id", "nbComment_" + publication.id);

                                a_collapse.onclick = () => fetchNotification(publication.id);



                                    const i_bi_chat_square = document.createElement("i");

                                    i_bi_chat_square.classList.add("bi");

                                    i_bi_chat_square.classList.add("bi-chat-square");



                                a_collapse.appendChild(i_bi_chat_square);



                            div_col_4_chat_square.appendChild(a_collapse);



                        div_text_center.appendChild(div_col_4_chat_square);



                            const div_col_4_souri_non_utilise = document.createElement("div")

                            div_col_4_souri_non_utilise.classList.add("col-4");

                            div_col_4_souri_non_utilise.classList.add("souri-non-utilise")

                                    

                                const a_collapse_2 = document.createElement("a");

                                a_collapse_2.setAttribute("data-bs-toggle", "collapse");

                                a_collapse_2.setAttribute("href", "#collapseExample3");

                                a_collapse_2.setAttribute("role", "button");

                                a_collapse_2.setAttribute("class", "souri-non-utilise")



                                a_collapse_2.innerHTML = 1;

                                a_collapse_2.innerHTML += "<i class='bi bi-share souri-non-utilise'></i>"



                            div_col_4_souri_non_utilise.appendChild(a_collapse_2);



                        div_text_center.appendChild(div_col_4_souri_non_utilise);

                        

                    div_card_footer.appendChild(div_text_center);


                div_card.appendChild(div_card_footer);

            // div_parent.appendChild(div_card_footer);

            //      <div class="collapse m-2">

                    const div_collapse = document.createElement("div");

                    div_collapse.classList.add("collapse");

                    div_collapse.classList.add("m-2");



                    div_collapse.setAttribute("id", "collapse_comment_" + publication.id)



                //      <div class="card card-body">

                        const div_card_sous_collapse = document.createElement("div");

                        div_card_sous_collapse.classList.add("card");

                        div_card_sous_collapse.classList.add("card-body");



                //          <label style="display:none;">Commentaires</label>

                            const label = document.createElement("label");

                            label.setAttribute("style", "display:none");

                            label.innerHTML = "Commentaires";



                        div_card_sous_collapse.appendChild(label);



                            const div_content_notif = document.createElement("div");

                            div_content_notif.setAttribute("class", "content_notification_tributg mb-3")



                        div_card_sous_collapse.appendChild(div_content_notif);



                            const form = document.createElement("form");

                            form.classList.add("form_comment_"+ publication.id );

                            // form.setAttribute("class", "form_comment_"+ fullname);



                                const div_mb_3 = document.createElement("div");

                                div_mb_3.classList.add("mb-3");



                                    const textaread = document.createElement("textarea")

                                    textaread.setAttribute("class", "form-control");

                                    textaread.setAttribute("name", "commentaire");

                                    textaread.setAttribute("placeholder", "Votre commentaire...");

                                    textaread.setAttribute("required", "");



                                div_mb_3.appendChild(textaread)



                                    const span_text_danger = document.createElement("span");

                                    span_text_danger.setAttribute("class", "text-danger");

                                    span_text_danger.setAttribute("style", "display:none");

                                    span_text_danger.innerHTML = "Le commentaire ne devrait pas être vide."



                                div_mb_3.appendChild(span_text_danger)



                            form.appendChild(div_mb_3);

                //                     </div>

                //                     <div class="row">

                                const row_btn = document.createElement("div");

                                row_btn.classList.add("row");

                                    

                                    const div_col_8 = document.createElement("div");

                                    div_col_8.classList.add("col-8");



                                row_btn.appendChild(div_col_8);



                                    const div_col_4_2 = document.createElement("div")

                                    div_col_4_2.classList.add("col-4");



                                        const input_btn = document.createElement("input");

                                        input_btn.setAttribute("type", "button");

                                        input_btn.setAttribute("value", "Envoyer");

                                        input_btn.setAttribute("class", "btn btn-primary float-end");



                                        input_btn.onclick = () => handleAndSentNotification(publication.id, publication.user_id)

                                    

                                    div_col_4_2.appendChild(input_btn);



                                row_btn.appendChild(div_col_4_2);



                            form.appendChild(row_btn)



                        div_card_sous_collapse.appendChild(form);

                    

                    div_collapse.appendChild(div_card_sous_collapse)


                div_card.appendChild(div_collapse);  

            div_parent.appendChild(div_card)

            if( document.querySelector(".content_publication_js_jheo")){

                document.querySelector(".content_publication_js_jheo").insertBefore(
                    div_parent,
                    document.querySelector(".content_publication_js_jheo").firstElementChild
                    // null
                );

            }
        })

    }

    if(document.querySelectorAll(".publication_js_jheo")){

        const publications = document.querySelectorAll(".publication_js_jheo");

        publications.forEach(publication => {

            const publication_id = publication.getAttribute("data-toggle-pub-id");
            const publication_user_id = publication.getAttribute("data-toggle-pub-user-id");

            if( document.querySelector(".form_comment_"+ publication_id)){

                const form_content = document.querySelector(".form_comment_"+ publication_id);
                const input_content = form_content.querySelector("input");



                input_content.addEventListener("click", (e) => {
                    e.preventDefault();

                    const datetime =new Date().toLocaleDateString() + " " + new Date().toJSON().slice(11,19);

                    console.log(form_content.querySelector("textarea").length );

                    if(form_content.querySelector("textarea").value != null && form_content.querySelector("textarea").value.length > 0 ){

                        createCardComment(
                            publication_id,
                            fullname,
                            datetime,
                            form_content.querySelector("textarea").value 
                        );

    

                        handleCommentPublished(

                            publication_user_id,

                            publication_id,

                            form_content.querySelector("textarea").value

                        );

    

                    }

                    ///delete content on form.

                    form_content.querySelector("textarea").value = null





                })

            }

        })

    }

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

function handleCommentPublished(author_id, publication_id , comment){



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

        })

    }).then(response => response.json())

    .then(response => {
        
        console.log(response);

    })

}


function fetchNotification(publication_id){

    

    fetch("/tributG/publications/comments/fetchall" , {

        headers: {

            'Content-Type': 'application/json',

            'Accept'  : 'application/json'

        },

        method: "POST",

        body: JSON.stringify({

            "publication_id": publication_id,

        })

    }).then(response => response.json())

    .then(results => {



        const content_comment = document.querySelector("#collapse_comment_" + publication_id ).querySelector(".content_notification_tributg")

        

        if (content_comment && content_comment.querySelectorAll(".card_comment_js")){

            content_comment.querySelectorAll(".card_comment_js").forEach(comment => {

                comment.parentElement.removeChild(comment);

            })

        }



        if (results.success ){

            if( results.comments.length > 0){

                results.comments.forEach(comment => {

                    createCardComment(

                        comment.pub_id,

                        comment.userfullname,

                        comment.datetime,

                        comment.commentaire

                    );

                })

            }

        }

    })

}

function createCardComment(publication_id, user_fullname,datetime,comment ){



    const card_comment = document.createElement("div");

    card_comment.classList.add("card_comment_js");

    card_comment.classList.add("card");

    card_comment.classList.add("my-2");



    const card_body = document.createElement("div");

    card_body.classList.add("card-body");



    const h5_comment = document.createElement("h5")

    h5_comment.innerText = user_fullname;

    

    card_body.appendChild(h5_comment);



    const span_comment = document.createElement("span")

    span_comment.classList.add("blockquote-footer");



    span_comment.innerText = datetime;



    card_body.appendChild(span_comment);

    

    const p_comment = document.createElement("p")

    p_comment.classList.add("card-text")

    p_comment.innerText = comment;



    card_body.appendChild(p_comment);



    card_comment.appendChild(card_body);

    

    const content_comment = document.querySelector("#collapse_comment_" + publication_id ).querySelector(".content_notification_tributg")



    if (content_comment && content_comment.querySelectorAll(".card_comment_js").length > 0){

        content_comment.insertBefore(

            card_comment,

            content_comment.querySelector(".card_comment_js")

        )

    }else{

        content_comment.appendChild(card_comment);

    }

}

function handleAndSentNotification(publication_id, publication_user_id){

    if( document.querySelector(".form_comment_"+ publication_id)){

        const form_content = document.querySelector(".form_comment_"+ publication_id);

        const input_content = form_content.querySelector("input");



        input_content.addEventListener("click", (e) => {
            e.preventDefault();

            const datetime =new Date().toLocaleDateString() + " " + new Date().toJSON().slice(11,19);

            // console.log(form_content.querySelector("textarea").value);
            if(form_content.querySelector("textarea").value != null && form_content.querySelector("textarea").value.length > 1 )
            {
                createCardComment(
                    publication_id,
                    document.querySelector(".main_user_id").getAttribute("data-toggle-full-name"),
                    datetime,
                    form_content.querySelector("textarea").value 
                );
    
                handleCommentPublished(
    
                    publication_user_id,
    
                    publication_id,
    
                    form_content.querySelector("textarea").value
    
                );
                ///delete content on form.
                form_content.querySelector("textarea").value = null
            }


        })

    }

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
