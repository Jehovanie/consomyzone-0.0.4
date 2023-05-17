/**
 * global variable 
 */
var tribu_t_name_0 = ""; 
let image_list = [];
var worker = new Worker('/assets/js/tribuT/worker.js');

/**
 * create tribu_t section
 */

document.getElementById("form_upload").onchange = (e) => {
    const reader = new FileReader();

    const imgs = document.querySelectorAll("img.img-uploaded")
    if (imgs.length > 0) {
        for(let i of imgs)
            i.parentNode.removeChild(i)
    }
    reader.onload = () => { 
        const uploaded_image = reader.result;
        image_list.push(reader.result);

    
        let img = document.createElement("img");
        img.setAttribute("class","img-uploaded");
        img.src = uploaded_image
        img.setAttribute("alt","Image upload")
        // img.setAttribute("style", "width:100px; height:100px");

        const parentImage = document.querySelector("#uploadImage")
        if(parentImage.querySelector("img")){
            parentImage.insertBefore(img, parentImage.querySelector("img"))
        }else{
            document.querySelector("#uploadImage").appendChild(img)
        }
    }
    reader.readAsDataURL(e.target.files[0])
    

};
/*---------------------- end create tribu_t section-----------------------*/

/**
 * render tribu_t section
 */
const arrays = Array.from(document.querySelectorAll(".tribu_t"))
    
for (let array of arrays) {
    array.onclick = (async (e) => {
        e.preventDefault();
        const id_c_u=e.target.dataset.tribuRank
        const type = e.target.classList[1];
        const tribu_t_name=e.target.textContent
        let data = await showdData(tribu_t_name)
        showdDataContent(data,type,tribu_t_name)
        
        /**render pastiled resto */
        document.querySelector("#navBarTribu > li.listNavBarTribu.restoNotHide > a").onclick = (e => { 
            e.preventDefault();
            document.querySelector("#tribu_t_conteuneur").innerHTML=""
            showResto(tribu_t_name+"_restaurant",id_c_u)
        })
        /**end */
    })
}

/*------------end render tribu_t section--------------*/
    
/**
 * send publication sectio
 */
const btnSubmitPublication = document.querySelector("#submit-publication-tribu-t")
document.querySelector("#publication_photo").addEventListener("change",getBase64V2)
btnSubmitPublication.onclick = (e) => {
    e.preventDefault();
    const formData = new FormData(document.querySelector("#form-publication-tribu-t"))
    sendPublication(formData)
}

/*---------------end send publication section--------------------*/



/*--------------function section---------------------*/ 
function convertFileToBlob(file) {
    const reader = new FileReader();
    reader.onload = function (e) {
        let blob = new Blob([new Uint8Array(e.target.result)], {type: file.type });
    };
    reader.readAsArrayBuffer(file);
}
function getBase64V2() {
    const fR = new FileReader();
    fR.addEventListener("load", function (evt) { 
         document.querySelector("#image-publication-tribu-t").src = evt.target.result;
    })
    fR.readAsDataURL(this.files[0]);
} 

function sendPublication(formData) {
    const fR = new FileReader();
    fR.addEventListener("load",  (evt) =>{ 
        
        const param = {
            base64: evt.target.result,
            photoName: formData.get("photo").name,
            photoType: formData.get("photo").type,
            photoSize: formData.get("photo").size,
            contenu: formData.get("contenu"),
            tribu_t_name: tribu_t_name_0,
            confidentialite:formData.get("confidentialite")
        }
        console.log(param)
        const request = new Request("/user/create-one/publication", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'  
            },
            body: JSON.stringify(param)
        })
        fetch(request)
       
    })
    fR.readAsDataURL(formData.get('photo'));
} 

function sendPublication() {
    
}

/**
 * render tribu_t contet
 * @param {*} data 
 * @param {*} type 
 * @param {*} tribu_t_name 
 */
function showdDataContent(data, type, tribu_t_name) { 
    let detailsTribuT=null
   
    if (type === "owned")
        detailsTribuT = data.tribu_t_owned
    else
        detailsTribuT = data.tribu_t_joined

    let tribu_t = Array.from(JSON.parse(detailsTribuT).tribu_t).filter(e => e.name == tribu_t_name)
    tribu_t_name_0 =tribu_t[0].name
    console.log(tribu_t)
    document.querySelector("#content-pub-js").innerHTML = `
            <div class="card-couverture-pub-tribu-t">
                <div class="content-couverture">
                    <div class="row">
                        <div class="col-3">
                            <img src="../../..${tribu_t[0].logo_path}" alt="123">
                        </div>
                        <div class="col-8 mt-4">
                            <h1>${tribu_t[0].name.replaceAll("tribu_t_1_","")}</h1>
                            
                        </div>
                    </div>
                    
                    <div class="nome-fontateur-tribu-t">
                        <p>Tribu-t fondée par <span class="fw-bold">${data.pseudo}</span></p>
                    </div>
                </div>
                <nav class="responsif-none mx-auto">
                    <ul id="navBarTribu">
                        <li class="listNavBarTribu">
                            <a id="ulActualites" style="cursor:pointer;" onclick="showActualites()">Actualités</a>
                        </li>


                        <li class="listNavBarTribu restoNotHide">
                            <a style="cursor:pointer;">Restaurants</a>
                        </li>

                        <li class="listNavBarTribu">
                            <a style="cursor:pointer;" onclick="showInvitations()">Invitations</a>
                        </li>
                        <li class="listNavBarTribu">
                            <a style="cursor:pointer;" href="/user/tribu/show-member/tribu_t_32_efa_leo_anana">Partisant</a>
                        </li>
                        <li class="listNavBarTribu">
                            <a style="cursor:pointer;" onclick="showPhotos(&quot;tribu_t_32_efa_leo_anana_publication&quot;)">Photos</a>
                        </li>

                    </ul>
                </nav>
                
            </div>
            <div id="tribu_t_conteuneur" class="exprime-pub">
                <center>
                    <div class="row p-3 champ-pub">
                        <div class="col-1 rounded-circle">
                            <img id="roundedImg" style="min-height: 50px; min-width:50px; max-width:50px; max-height: 50px;" class="rounded-circle border border-1" src="/uploads/users/photos/img_avatar.png">
                        </div>
                        <div class="col-11">
                            <input id="btnShowModalAddPub" type="text" class="form-control form-control-lg rounded-pill bg-transparent text-white" data-bs-toggle="modal" data-bs-target="#modal_publication" data-bs-whatever="@mdo" placeholder="Exprimez-vous...">
                        </div>
                        <hr class=" hr-pub mt-3 mx-auto" >
                        <div class="row mt-3">
                            <div class="col-3 text-center" style="cursor:pointer;">
                                <i class="bi bi-play-btn-fill"></i>
                                Vidéo
                            </div>
                            <div class="col-3 text-center" style="cursor:pointer;" onclick="getPosition()" data-bs-toggle="modal" data-bs-target="#modal_localisation">
                                <i class="bi bi-geo-alt-fill"></i>Localisation
                            </div>
                            <div class="col-3 text-center" data-bs-toggle="modal" data-bs-target="#modal_evenement" data-bs-whatever="@mdo" style="cursor:pointer;">
                                <i class="bi bi-calendar2-event-fill"></i>
                                Agenda

                            </div>
                            <div class="col-3 text-center" style="cursor:pointer;">
                                <i class="bi bi-pencil-square"></i>
                                Article
                            </div>
                        </div>
                    </div>
                </center>
                <div class="row">
                    <div class="col-8">
                        <div id="list-publicatiotion-tribu-t">
                            
                        </div>
                        <div class="pub-tribu-t" id="showResto"></div>
                    </div>
                    <div class="col-4">
                        <div class="apropos-tribu-t ps-2 mt-3">
                            <p class="fw-bold">Apropos Tribu-t</p>
                            <p>
                            ${tribu_t[0].description}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            
    `
    worker.postMessage([tribu_t_name_0, 0,20]);
    console.log('Message envoyé au worker');
    worker.onmessage = (event) => {
        console.log(event.data)
        let data=event.data
        /*---------show 5 pub par defaut-----------------*/
        for (let i = 0; i < 5; i++){
            const contentPublication=`<div class="pub-tribu-t mt-3">
                        <div class="name-pub">
                            <div class="row head-pub">
                                <div class="col-1">
                                    <img class="mini-pdp" src="/uploads/tribus/photos/avatar_tribu.jpg" alt="123">
                                </div>
                                <div class="col-10 mt-3">

                                    <a href=""> ${data[i].userfullname}</a>
                                    <p class="card-text">
                                        <i>
                                            <small class="text-muted">Publié le
                                                ${data[i].datetime}
                                            </small>
                                        </i>
                                      
                                    </p>
                                </div>
                                <div class="col-1 mt-3">
                                    <i class="bi bi-three-dots" style="cursor:pointer"></i>
                                </div>
                            </div>
                            <div class="pub-content">
                                <p>
                                    ${data[i].publication}
                                </p>
                            </div>
                            <div class="pub-photo">
                                <img src="${data[i].photo.replaceAll("/public","")}" alt="">
                            </div>
                            <div class="content-comant-reaction">
                                <div class="row">
                                    <div class="col">
                                        <i class="bi-heart-fill ms-3" style="cursor: pointer;"></i><span class="text-muted"> 12</span>
                                    </div>
                                    <div class="col">
                                        <p class="text-muted">10 commentaires</p>
                                    </div>
                                </div>
                            </div>
                            <hr>
                            <div class="btn-mention-partage">
                                <div class="row text-center">
                                    <div class="col">
                                        <i class="bi-heart"></i>
                                    </div>
                                    <div class="col">
                                        <i class="bi bi-chat-square"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    `
           document.querySelector("#list-publicatiotion-tribu-t").innerHTML+=contentPublication
        }
        /*---------after shwo in each scroll ---------------*/
        const gen = genDataPubOfAllPartisans(data, 5)
        const gen_length = (data.length-5)
        console.log(gen_length)
  
       
        let lastId = 0;
        let genCursorPos=0
        window.addEventListener("scroll", (e) => {
           
            const scrollable = document.documentElement.scrollHeight - window.innerHeight
            const scrolled = window.scrollY
            if (Math.ceil(scrolled) === scrollable) {
                if (data) {
                    lastId = data.id
                    console.log(genCursorPos)
                    if (genCursorPos === gen_length) {
                        
                        worker.postMessage([tribu_t_name_0, lastId, 20]);
                        
                    }
                        
                    data = gen.next().value
                    console.log(data)
                    const contentPublication=`<div class="pub-tribu-t mt-3">
                            <div class="name-pub">
                                <div class="row head-pub">
                                    <div class="col-1">
                                        <img class="mini-pdp" src="/uploads/tribus/photos/avatar_tribu.jpg" alt="123">
                                    </div>
                                    <div class="col-10 mt-3">

                                        <a href=""> ${data.userfullname}</a>
                                        <p class="card-text">
                                            <i>
                                                <small class="text-muted">Publié le
                                                    ${data.datetime}
                                                </small>
                                            </i>
                                        
                                        </p>
                                    </div>
                                    <div class="col-1 mt-3">
                                        <i class="bi bi-three-dots" style="cursor:pointer"></i>
                                    </div>
                                </div>
                                <div class="pub-content">
                                    <p>
                                        ${data.publication}
                                    </p>
                                </div>
                                <div class="pub-photo">
                                    <img src="${data.photo.replaceAll("/public","")}" alt="">
                                </div>
                                <div class="content-comant-reaction">
                                    <div class="row">
                                        <div class="col">
                                            <i class="bi-heart-fill ms-3" style="cursor: pointer;"></i><span class="text-muted"> 12</span>
                                        </div>
                                        <div class="col">
                                            <p class="text-muted">10 commentaires</p>
                                        </div>
                                    </div>
                                </div>
                                <hr>
                                <div class="btn-mention-partage">
                                    <div class="row text-center">
                                        <div class="col">
                                            <i class="bi-heart"></i>
                                        </div>
                                        <div class="col">
                                            <i class="bi bi-chat-square"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        `
                    document.querySelector("#list-publicatiotion-tribu-t").innerHTML += contentPublication
                    genCursorPos++;
                    
                } 
               
            }
        })
    }
}

function* genDataPubOfAllPartisans(data,index) {
    for (let i = index; i < data.length; i++)
        if (i < data.length) 
            yield data[i]
         
        
}


function test() {
        return new Promise((resolve, reject) => { 
        setInterval(()=>resolve(),5000)
    })
}

async function showdData(tribu_t_name) {
    
    const request1 = new Request(`/user/tribu_one/${tribu_t_name}`, {
        method: "GET",
        headers: {
            'Accept': 'application/json',
            "Content-Type": "application/json; charset=utf-8"
        }
    }) 
    return await fetch(request1).then(res =>res.json())
 
}


function showResto(table_rst_pastilled,id_c_u){
    let restoContainer = document.querySelector("#tribu_t_conteuneur")
    restoContainer.innerHTML = `
                                <div class="row mt-3">
                                    <div class="col-8">
                                        <div id="form_past"></div>
                                        <div class="g-3">
                                            <div class="input-group mb-3">
                                                <input type="text" class="form-control  rounded" placeholder="Pastiller un restaurant" id="resto-rech">
                                                <button class="btn btn-light" type="button" id="button-addon2"  onclick="findResto"><i class="fas fa-search"></i></button>
                                            </div>
                                            <div class="list-group" style="z-index:9; position:relative;height:120px;display:none;" id="result_resto_past">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-4">
                                        <div class="apropos-tribu-t ps-2 ">
                                            <p class="fw-bold">Apropos Tribu-t</p>
                                            <p>
                                                apropo de tribu t
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                    
                                `

    

    if(document.getElementById('list_resto_pastilled')){
        let childreen=document.getElementById('list_resto_pastilled').children
        for(let child of childreen)
             document.getElementById('list_resto_pastilled').
                removeChild(child)
    }
       
    const request=new Request("/user/tribu/restos-pastilles/" + table_rst_pastilled, {
        method: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })

    fetch(request).then(rqt => rqt.json()).then(restos => {
            console.log(restos);
            let imgSrc = "";
            let avatar ="" //"{{avatar}}"
            if(avatar != null){
                imgSrc = "/uploads/tribus/photos/"+avatar
            }else{
                imgSrc = "uploads/tribus/photos/avatar_tribu.jpg"
            }

            if(restos.length > 0){
                let ul = null
                if(!document.getElementById('list_resto_pastilled')){
                    ul = document.createElement('ul');
                    ul.id="list_resto_pastilled"
                }else
                    ul=document.getElementById('list_resto_pastilled')
                
                ul.classList = "list-group list-group-flush mt-2"
                let title = document.createElement('h6');
                title.innerText = "Liste des restaurants pastillés"
                title.classList ="mt-2 text-info"
                restoContainer.appendChild(title);
              
                let li = ""
                let text=""
                let text1 = ""
                //id current user
                // let id_c_u = document.querySelector("#settingProfilId > div").dataset.tribuUsRank;
                console.log(id_c_u)
                for (let resto of restos) {
                    //console.log(resto);

                    //<a target="_blank" href="/restaurant/departement/${resto.departement}/${resto.id_dep}/details/${resto.id_unique}">

                    let id = resto.id
                    let id_resto = resto.id_resto
                    let id_resto_comment = resto.All_id_r_com!=null ?  resto.All_id_r_com.split(",") :[]
                    
                    let id_user = resto.All_user!=null ? resto.All_user.split(",") :[]
                    console.log(id_user)
                    let denominationsF = resto.denomination_f
                    let nbrAvis= resto.nbrAvis
                    let key=0
                    for(let [k,v] of id_user.entries() ){
                        if(v === id_c_u)
                            key=k
                    }
                    if(id_user.includes(id_c_u)){
                        console.log("up "+denominationsF)
                        text=`<button type="button" class="btn btn-primary " id="Submit-Avis-resto-tribu-t-tom-js" data-bs-toggle="modal" data-bs-target="#RestoModalNote${id_resto_comment[key]}" onclick="updateNote(event,${id_resto_comment[key]})">Modifiez votre avis</button>`

                        text1="Modifiez votre avis"
                    }else{
                        console.log("crt "+denominationsF)
                        text=`<button type="button" class="btn btn-primary" id="Submit-Avis-resto-tribu-t-tom-js" data-bs-toggle="modal" data-bs-target="#RestoModalNote${id_resto_comment[key]}" onclick="sendNote(event,${id_c_u},${id},${id_resto_comment[key]})">Notez</button>`
                        text1="Notez"
                    }
                    li +=`<li style="list-style-type:none; " data-toggle-id="${id_resto}">
                            <div class="row ms-1">
                                <div class="col-8 pastil-resto">
                                    <div class="fw-bold">
                                        <a target="_blank" href="/restaurant?id=${resto.id_unique}" class="text-decoration-none">
                                            <img style="height: 30px; width:30px; border-radius:50%;margin-top: -10px; " src="{% if avatar != null %} {{ asset("uploads/tribus/photos/") ~ avatar}} {% else %} {{ asset("uploads/tribus/photos/avatar_tribu.jpg") }} {% endif %}">
                                            <span style="font-weight:700; font-size:18pt;">${denominationsF} </span> 
                                        </a>
                                    </div>
                                    <div id="etoile_${id_resto}">
                                        <i class="fa-solid fa-star" data-rank="1"></i>
                                        <i class="fa-solid fa-star" data-rank="2"></i>
                                        <i class="fa-solid fa-star" data-rank="3"></i>
                                        <i class="fa-solid fa-star" data-rank="4"> </i>
                                        <a class="text-primary text-decoration-underline" style="cursor: pointer;" data-bs-toggle="modal" data-bs-target="#RestoModalComment${resto.id}" onclick="showComment(${resto.id})"> ${nbrAvis} Avis</a>
                                    </div>
                                    <div class="row mt-3 ">
                                        <div class="col-4">
                                            <button type="button" class="btn btn-outline-primary  float-end" data-bs-toggle="modal" data-bs-target="#modal_repas" style="cursor:pointer;" onclick="createRepas('${resto.id_pastille}','${resto.denomination_f}', '${resto.latitude}','${resto.longitude}')">Créer un repas</button>
                                        </div>
                                        <div class="col-4">
                                            <button type="button" class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#RestoModalNote${id_resto_comment[key]}">${text1}</button>
                                        </div>
                                    </div>
                                </div>
                                
                            </div>

                            <!-- Modal note-->
                            <div class="modal fade" id="RestoModalNote${id_resto_comment[key]}" tabindex="-1" aria-labelledby="RestoModalNoteLabel" aria-hidden="true">
                                <div class="modal-dialog">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h5 class="modal-title" id="RestoModalNoteLabel">Notez ${denominationsF}</h5>
                                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div class="modal-body">
                                            <form>
                                                <label for="text-note" class="col-form-label">Donner une note sur 4:</label>
                                                <textarea class="form-control" id="text-note-tribu-t-${id_resto_comment[key]}"></textarea>
                                                <label for="message-text" class="col-form-label">Commentaire:</label>
                                                <textarea class="form-control" id="message-text-${id_resto_comment[key]}"></textarea>
                                            </form>
                                        </div>
                                        <div class="modal-footer">${text}</div>
                                    </div>
                                </div>
                            </div>
                            <!-- Modal comment -->
                            <div class="modal fade modal-commet-tribut" id="RestoModalComment${resto.id}" tabindex="-1" aria-labelledby="RestoModalCommentLabel" aria-hidden="true">
                                <div class="modal-dialog">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h5 class="modal-title" id="RestoModalCommentLabel">Avis</h5>
                                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div class="modal-body"></div>
                                    </div>
                                </div>
                            </div>
                    
                        </li> `
                    

                }
                ul.innerHTML = li;
                restoContainer.appendChild(ul);
                restos.forEach(resto=>{

                    // let noteGlobales= 0.00
                    // if(Array.isArray(resto.note)){
                    //     let sum = 0.00;
                    //     for (let i = 0; i < resto.note.length; i++) {
                    //         sum += parseFloat(resto.note[i]);
                    //     }
                    //      noteGlobales = sum / resto.note.length
                    // }else{
                    //     noteGlobales=resto.note
                    // }
                    // let sum = 0.00;
                    // for (let i = 0; i < note.length; i++) {
                    //     sum += parseFloat(note[i]);
                    // }
                    // let noteGlobales = sum / note.length
                    // console.log(noteGlobales)
                    let id_resto = resto.id_resto
                    let noteGlobales=resto.globalNote
                    printNodeGlobale(document.querySelectorAll("#etoile_"+id_resto+">i"),noteGlobales)

                }) 


            }else{
                restoContainer.style.textAlign = "center"
                restoContainer.innerHTML = "Aucun restaurant pastillé pour le moment";
               
            }

            restoContainer.style.display = "block"
            // invitationsContainer.innerHTML = "";               
            // invitationsContainer.style.display = "none"
            // photosContainer.innerHTML = "";
            // photosContainer.style.display = "none"
            // showCreatePub.style.display = "none"
            //  showCreatePub_mobile.style.display = "none"
            // showPub.style.display = "none"

            

    });

    let rows = document.querySelectorAll("#restaurants > ul.list-group > li.list-group-item");

    if(document.querySelector("#resto-rech")){
        document.querySelector("#resto-rech").addEventListener("keyup", function (event) {
            const q = event.target.value.toLowerCase();

            if (event.keyCode === 13) {
                findResto()
            }else{
                document.querySelectorAll("#restaurants > ul > li").forEach(elem=>{
                    if(elem.textContent.toLowerCase().includes(q)){
                        elem.style = "display : flex!important;"
                    }else{
                        elem.style = "display : none !important;"
                    }
                })
            }
            
        });
    }
}

function printNodeGlobale(element,globalNote){

    let rankRange = [1, 2, 3, 4]
    for (let star of element) {
        console.log(star)
        if (rankRange.includes(parseInt(star.dataset.rank, 10))) {
            if(parseInt(star.dataset.rank, 10) <= Math.trunc(globalNote))
                    star.style.color = "#F5D165"
            if (globalNote % 1 != 0) {
                //console.log(parseInt(star.dataset.rank, 10)+" "+(Math.trunc(globalNote) + 1))
                if (parseInt(star.dataset.rank, 10) == (Math.trunc(globalNote) + 1)) {
                      //console.log(parseInt(star.dataset.rank, 10)+" "+(Math.trunc(globalNote) + 1))
                    let rateYello = (globalNote % 1) *100
                    let rateBlack=100 -rateYello
                    star.style = `
                     background: linear-gradient(90deg, #F5D165 ${rateYello}%, #000 ${rateBlack}%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    `
                    
                }
            }
        }
    }
}
function sendNote(event, _idUser, _idResto,_idRestoComment) {
    const note = parseFloat(document.querySelector(`#text-note-tribu-t-${_idRestoComment}`).value, 10)
    //console.log(document.querySelector(`#text-note-tribu-t-${_idRestoComment}`))
    const commentaire =document.querySelector("#message-text-"+_idRestoComment).value
    const content = {
        idUser: _idUser,
        idResto: _idResto,
        tableName: tribu_t_name_0+"_restaurant_commentaire",
        note: note,
        commentaire: commentaire
    }
   
    const jsonStr = JSON.stringify(content)
     console.log(jsonStr)
    const request = new Request("/push/comment/resto/pastilled", {
        method: "POST",
        body: jsonStr,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    })
    fetch(request).then(response => {
        if (response.ok && response.status === 200) {
           alert("nety")
       }
    } )
}
function updateNote(event, _idRestoComment) {
    const note =parseFloat(document.querySelector("#text-note-tribu-t-"+_idRestoComment).value,10)
    const commentaire =document.querySelector("#message-text-"+_idRestoComment).value
    const content = {
        tableName: table_restaurant_com,
        note: note,
        commentaire: commentaire,
        idRestoComment:_idRestoComment
    }
    const jsonStr = JSON.stringify(content)
    const request = new Request("/up/comment/resto/pastilled", {
        method: "POST",
        body: jsonStr,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    })
    fetch(request).then(response => {
        if (response.ok && response.status === 200) {
           alert("nety")
       }
    } )
}
function findResto(){
    let val = document.querySelector("#resto-rech").value;

    document.querySelector("#result_resto_past").style.display ="block"

    let loading =`<button class="btn btn-primary mt-4" type="button" disabled>
                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                Chargement...
                </button>`

    document.querySelector("#result_resto_past").innerHTML = loading;
    
    fetch("/user/tribut/get_resto/"+tribu_t_name_0+"_restaurant/"+val)
    .then(res => res.json())
    .then(data =>{
        console.log(data)
        let avatar = data.avatar
        let list = data.list
        if(list.length > 0){
            //document.querySelector("#result_resto_past").style.display ="block"
            let res =""
            //console.log(data)
            for(let resto of list){
                //let avtr = "{% if avatar != null %} {{ asset(\"uploads/tribus/photos/\") ~ avatar}} {% else %} {{ asset(\"uploads/tribus/photos/avatar_tribu.jpg\") }} {% endif %}"
                if(resto.isPelleted == 1){
                    res += ""//"<li class='list-group-item list-group-item-action' style='list-style:none;'><img id='roundedImg' style='min-height: 40px; min-width:40px; max-width:40px; max-height: 40px;' class='rounded-circle border border-1' src="+avtr+"><a href='#' data-idresto='"+resto.id+"' data-isPelleted ='true'> "+resto.denomination_f.trim()+"</a><small class='float-end text-danger'><i>Déjà pastillé</i></small></li>"
                
                }else{
                    res+=`<li class="list-group-item d-flex justify-content-between align-items-start">
                        <div class="ms-2 me-auto">
                            <div class="fw-bold" data-isPelleted ='false'>${resto.denomination_f.trim()}</div>
                            <i style="font-size:small;">${resto.adresse.trim().toLowerCase()}</i>
                        </div>
                        <input type="button" class="btn btn-primary h-100" value="Pastiller" id="pastille-btn" onclick="pastillerPast('${resto.id}','${resto.denomination_f.trim()}')">
                        
                    </li>`
                    //res += "<li class='list-group-item list-group-item-action' style='list-style:none;'><a href='#' data-idresto='"+resto.id+"' data-isPelleted ='false'>"+resto.denomination_f.trim()+"</a><small class='float-end'><i>"+resto.adresse.trim().toLowerCase()+"</i></small></li>"
                
                }
                //let adress = resto.numvoie.trim()+' '+resto.typevoie.trim()+' '+resto.nomvoie.trim()+' '+resto.codpost.trim()+', '+resto.compvoie.trim()+' '+resto.commune.trim()
                //console.log(resto.denomination_f)
            }
            document.querySelector("#result_resto_past").innerHTML ="<ul class='list-group' style='overflow-y:scroll;height:120px;'>"+res+"</ul>"
        
        }else{
            
            document.querySelector("#result_resto_past").innerHTML ="<b class='text-danger'>Aucun resultat ne correspond votre recherche</b>"
        }
        
    })
}
function pastillerPast(id,nom){
    saveRestaurantPast(id, nom);

    let xmlString = `<div class="alert alert-success mb-2 mt-2" role="alert">
    ${nom} bien pastillé avec succès!
    </div>`;

    showResto();

    document.querySelector("#form_past").innerHTML = xmlString;

    setTimeout(()=>{
        document.querySelector("#form_past").innerHTML = ""
    }, 5000)
    
}

function saveRestaurantPast(id, nom){
    let data ={
        name : nom,
        id_resto :id
    }
    //console.log(data);

    fetch(new Request("/user/tribut/save_resto/"+tableTribu+"_restaurant", {
        method: "POST",
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
        })).then(req => req.json()).then(message => {
            console.log(message);
    })

    document.querySelector("#result_resto_past").style.display="none";
}