/**
 * global variable 
 */
var tribu_t_name_0 = ""; 
var id_c_u
let image_list = [];
var worker = new Worker('/assets/js/tribuT/worker.js');
var workerRestoPastilled = new Worker('/assets/js/tribuT/worker_pastilled.js')
var workerGetCommentaireTribuT=new Worker('/assets/js/tribuT/worker_cmnt.js')

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

function showBlockPub(){
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

            /**render photo gallery*/
            document.querySelector("#seer-gallery").onclick = (e => { 
                e.preventDefault();
                document.querySelector("#tribu_t_conteuneur").innerHTML=""
                showPhotos()

            })
            /**end */

            /**change pdp tribu_t */
            document.querySelector("#fileInputModifTribuT").onchange = (e) => {
                let files = e.target.files[0]
                updatePdpTribu_T(files)
            }
            /**end */
            

            /**send commentaire */
      
            /**end */
        })
    }
}

showBlockPub()

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
function updatePdpTribu_T(files) {
     const fR = new FileReader();
    fR.addEventListener("load",  (evt) =>{ 
        
        const param = {
            base64: evt.target.result,
            photoName: files.name,
            photoType: files.type,
            photoSize: files.size,
            tribu_t_name: tribu_t_name_0,
            
        }
        console.log(param)
        const request = new Request("/user/tribu/set/pdp", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'  
            },
            body: JSON.stringify(param)
        })
        fetch(request)
       
    })
    fR.readAsDataURL(files);
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

    console.log(JSON.parse(detailsTribuT).tribu_t)

    let tribu_t = Array.isArray(JSON.parse(detailsTribuT).tribu_t) ? Array.from(JSON.parse(detailsTribuT).tribu_t).filter(e => e.name == tribu_t_name) : [JSON.parse(detailsTribuT).tribu_t];
    tribu_t_name_0 =tribu_t[0].name
    document.querySelector("#content-pub-js").innerHTML = `
            <div class="card-couverture-pub-tribu-t ">
                <div class="content-couverture">
                    <div class="row">
                        <div class="col-3">
                            <div class="row">
                                <div class="col">
                                    <img src="../../..${tribu_t[0].logo_path.replaceAll("/public","")}" alt="123">
                                </div>
                                <div class="col">
                                    <label style="margin-left:10%;" for="fileInputModifTribuT">
                                        <i class="bi bi-camera-fill" style="font-size: 20px; margin-top:5px;cursor:pointer; background-position: 0px -130px; background-size: auto; width: 20px; height: 20px; background-repeat: no-repeat; display: inline-block;"></i>
                                    </label>
                                    <input type="file" name="fileInputModifTribuT" id="fileInputModifTribuT" style="display:none;visibility:none;" accept="image/*">
                                </div>
                            </div>
                        </div>
                        <div class="col-8 mt-4">
                            <h1  id="tribu_t_name_main_head" data-tribu="${tribu_t[0].name}">${tribu_t[0].name.replaceAll("tribu_t_1_","")}</h1>
                            <p class="responsif-none-mobile p-mobile">
                            ${tribu_t[0].description}
                            </p>
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
                            <a style="cursor:pointer;" href="#">Partisans</a>
                        </li>
                        <li class="listNavBarTribu">
                            <a style="cursor:pointer;" id="seer-gallery">Photos</a>
                        </li>

                    </ul>
                </nav>
                
            </div>
            <div id="tribu_t_conteuneur" class="exprime-pub">
                <center id="createPubBloc">
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
                        <div class="invitation-tribu-t" id="blockInvitation"></div>
                    </div>
                    <div class="col-4">
                        <div class="apropos-tribu-t ps-2 mt-3 responsif-none">
                            <p class="fw-bold">A propos Tribu-t</p>
                            <p >
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
        if(data.length > 0)
        for (let i = 0; i < 5; i++){
            const contentPublication=`<div class="pub-tribu-t mt-3">
                        <div class="name-pub">
                            <div class="row head-pub">
                                <div class="col-1">
                                    <img class="mini-pdp" src="/uploads/tribus/photos/avatar_tribu.jpg" alt="123">
                                </div>
                                <div class="col-10 mt-3">

                                    <a href="">${data[i].userfullname}</a>
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
                            <!--<div class="content-comant-reaction">
                                <div class="row">
                                    <div class="col">
                                        <i class="bi-heart-fill ms-3" style="cursor: pointer;"></i><span class="text-muted"> 12</span>
                                    </div>
                                    <div class="col">
                                        <p class="text-muted">10 commentaires</p>
                                    </div>
                                </div>
                            </div>--!>
                            <hr>
                            <div class="btn-mention-partage">
                                <div class="action-container">
                                    <i class="bi-heart like"></i>
                                    <i onclick="showCommentaireTribu_T(event)" class="fa-regular fa-comment comment" data-foo="kjjk_${data[i].id}xdjyfvfAAS"  data-bs-toggle="modal" data-bs-target="#modalCommentairTribuT${data[i].id}"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Modal commentair -->
                    <div class="modal fade" id="modalCommentairTribuT${data[i].id}" tabindex="-1" aria-labelledby="modalCommentairTribuTLabel" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                        <div class="modal-header">
                            <h3 class="count_comment">Publication de ...</h3>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="container">
                                <div class="center-block" id="center-content-cmnt${data[i].id}">
                                    
                                </div>
                               
                                <div class="modal-footer">
                                    <input type="text" class="commentair-tribu-t" placeholder="votre commentaire">
                                    <i class="fa-solid fa-paper-plane" id="mlXXdZE${data[i].id}hjki" onclick="putComment(event)"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    `
               
            document.querySelector("#list-publicatiotion-tribu-t").innerHTML += contentPublication
            workerGetCommentaireTribuT.onmessage = (e) => {
                console.log(e.data)
                const datas = e.data
                
                const indexx=6
                /*show 6 per default */
                for (let i = 0; i < indexx; i++) { 
                    console.log(i)
                    calculateDurationOfComment(datas[i].datetime)
                    let commentaire= `<div class="media-comment">
                                            <a class="avatar-content" href="javascript://">
                                                <img class="avatar" src="https://randomuser.me/api/portraits/men/77.jpg" width="45" height="45"/>
                                            </a>
                                            <div class="media-content">
                                                <div class="media-comment-body">
                                                    <div  class="media-option"><a class="ripple-grow" id="dropdownMenuButton" href="javascript://" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                        <svg  class="ripple-icon" width="28" height="28" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" viewBox="0 0 24 24">
                                                            <g fill="currentColor">
                                                            <circle cx="5" cy="12" r="2"></circle>
                                                            <circle cx="12" cy="12" r="2"></circle>
                                                            <circle cx="19" cy="12" r="2"></circle>
                                                            </g>
                                                        </svg></a>
                                                    </div>
                                                    <div class="media-comment-data-person">
                                                        <a class="media-comment-name" href="javascript://">${datas[i].userfullname}</a><span class="text-muted">2 h</span>
                                                    </div>
                                                    <div class="media-comment-text" id="comment-container">
                                                        <p >
                                                        ${datas[i].commentaire}
                                                        </p>
                                                    </div>
                                                </div>
                                                
                                            </div>
                                        </div>`
                    if (i == (indexx- 1))
                        commentaire+= "<a class=\"voir-plus\">Voir plus de commentaire</a>"
                    
                    document.getElementById("center-content-cmnt"+datas[i].pub_id).innerHTML +=commentaire
                }
                /**end */
                const commentGen = genDataPubOfAllPartisans(e.data, indexx)
                /**after show 5 commentaire in each scroll */

                /**end */
            
            }

            if(document.querySelector("#list-publicatiotion-tribu-t")){
                document.querySelector("#list-publicatiotion-tribu-t").innerHTML+=contentPublication
            }
        }
        
           
            
        
            
        /*---------after shwo in each scroll ---------------*/
        const gen = genDataPubOfAllPartisans(data, 5)
        const gen_length = (data.length-5)
        //const gen_length = (data.length)
        console.log(gen_length)

       
        let lastId = 0;

        let genCursorPos=0
        
        if(gen_length > 0){
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
                        if(data){
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
                        }
                        genCursorPos++;
                        
                    } 
                
                }
            })
        }
    }
}
function calculateDurationOfComment(dateOfComment) {
    var date;
    date = new Date();
    const dateStr= date.getUTCFullYear() + '-' +
    ((date.getUTCMonth()+1)) + '-' +
        (date.getUTCDate())
    
    const hour= (date.getHours())+ ':' + 
    (date.getMinutes())+ ':' + 
    (date.getSeconds());
   
    if (dateOfComment.split("")[0] != dateStr) {
        const dateDetails = parseInt(((dateOfComment.split("")[0]).split("-")[2]), 10)
        if ((dateDetails-date.getUTCDate())== 1) {
             console.log("hier")
        } else {
            const since = dateDetails - date.getUTCDate()
            console.log("depuis " + since + " j");
        }
            
    }

}

function showCommentaireTribu_T(event) {
    const table_cmmnt = tribu_t_name_0 + "_commentaire"
    const pub_id = event.target.dataset.foo.replace(/[^0-9]/g, "")
    const idmin = 0
    const limits=10
    workerGetCommentaireTribuT.postMessage([table_cmmnt, pub_id, idmin, limits])
}

function putComment(event) { 
    const pubId = event.target.id.replace(/[^0-9]/g, "")
    const commentaire = event.target.parentNode.querySelector("input").value
 
    const param = {
        pubId: pubId,
        commentaire: commentaire,
        tbl_cmnt_name: tribu_t_name_0 + "_commentaire",
        
    }
    const request = new Request("/user/send/comment/pub", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body:JSON.stringify(param)
    }) 
    fetch(request)
    console.log(pubId,commentaire)
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


/**
 * this function show all resto pastilled
 * @param {*} table_rst_pastilled 
 * @param {*} id_c_u 
 */
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
                                <div id="result_resto_chr" class="result_resto_chr owl-carousel owl-theme"></div>
                                `

    

    if(document.getElementById('list_resto_pastilled')){
        let childreen=document.getElementById('list_resto_pastilled').children
        for(let child of childreen)
             document.getElementById('list_resto_pastilled').
                removeChild(child)
    }
       
    
    workerRestoPastilled.postMessage([table_rst_pastilled])

    workerRestoPastilled.onmessage=(e => {
            let restos=e.data
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


            }
            // else {
            //     restoContainer.style.textAlign = "center"
            //     restoContainer.innerHTML = "Aucun restaurant pastillé pour le moment";
               
            // }

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
        document.querySelector("#resto-rech").addEventListener("keyup",  (event) =>{
            const q = event.target.value.toLowerCase();

            if (event.keyCode === 13) {
                findResto(q)
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

function findResto(val){
    
    const request = new Request(`/user/getRestoByName/${val}`, {
       method: 'GET'
   }) 
    fetch(request).then(response => response.json()).then(jsons => {
        console.log(jsons)
        for (let json of jsons) { 
            const name = json.denominationF;
            const dep = json.dep;
            const depName = json.depName;
            const commune = json.commune;
            const codePost = json.codpost;
            const nomvoie = json.nomvoie;
            const numvoie = json.numvoie;
            const typevoie = json.typevoie;
            const adresse = `${numvoie} ${typevoie} ${nomvoie} ${codePost} ${commune}`
            const bar = json.bar !="0" ? `<p><i class="fa-solid fa-martini-glass-citrus"> </i><span> Bar</span></p>` : '' 
            const boulangerie = json.boulangerie !="0" ? `<p><i class="fa-solid fa-bread-slice"> </i> <span>Boulangerie</span></p>` : ''
            const brasserie = json.brasserie !="0" ? `<p><i class="fa-solid fa-beer-mug-empty"> </i><span>Brasserie</span></p>` : ''
            const cafe = json.cafe !="0" ? `<p><i class="fa-solid fa-mug-hot"> </i><span>Cafe</span></p>` : '' 
            const cuisineMonde = json.cuisineMonde !="0" ? `<p><i class="fa-solid fa-utensils"> </i><span>Cuisine du Monde</span></p>` : '' 
            const fastFood = json.fastFood !="0" ? `<p><i class="fa-solid fa-burger"></i><span>Fast food</span></p>` : '' 
            const creperie = json.creperie !="0" ? `<p><i class="fa-solid fa-pancakes"> </i><span>Crêperie</span></p>` : '' 
            const salonThe = json.salonThe !="0" ? `<p><i class="fa-solid fa-mug-saucer"> </i><span>Salon de thé</span></p>` : '' 
            const pizzeria = json.pizzeria !="0" ? `<p><i class="fa-solid fa-pizza-slice"> </i><span>Pizzeria</span></p>` : '' 

            

            document.querySelector("#result_resto_chr").innerHTML += `
                
                <div class="card-result-chr items">
                    <div class="header-result">
                        <h5>${name}</h5>

                    </div>
                    <div class="body-result">
                       
                        <div class="type-resto" onclick="showTypeResto(event)"> <span>Type de restauration</span> <i class="fa-solid fa-greater-than"></i></div>
                         <div class="type-resto-ico row">
                            <div class="col-5">${boulangerie}</div>
                            <div class="col-5">${bar}</div>
                            <div class="col-5">${brasserie}</div>
                            <div class="col-5">${cafe}</div>
                            <div class="col-5">${cuisineMonde}</div>
                            <div class="col-5">${fastFood}</div>
                            <div class="col-5">${creperie}</div>
                            <div class="col-5">${salonThe}</div>
                            <div class="col-5">${pizzeria}</div>
                        </div>
                        <div>
                            <h5>Adresse: </h5>
                            <p>${adresse}</p>
                        </div>
                        
                    </div>
                    <div class="footer-result">
                        <button class="btn btn-primary" onclick="pastillerPast(${json.id},'${name}')">Pastillez</button>
                    </div>
                </div>
            `
            $(document).ready(function(){
                $(".owl-carousel").owlCarousel({
                    autoPlay: 3000,
                    items: 5
                });
            });

            
        }
    })
    
}

function showTypeResto(event) {
    let b = event.target.parentNode.parentNode
    console.log(b)
    if (b.classList.contains("active")) {
        b.classList.remove("active");
        b.querySelector("div.type-resto > i").classList.remove("active");
        b.querySelector("div.type-resto-ico").style.display = "none"
    } else {
       b.classList.add("active");
       b.querySelector("div.type-resto > i").classList.add("active");
     b.querySelector("div.type-resto-ico").style.display = "block"
    }
    
   
}

function pastillerPast(id, nom) {
   
    saveRestaurantPast(id, nom);

    
    
}

/**save resto pastilled */
function saveRestaurantPast(id, nom){
    let data ={
        name : nom,
        id_resto :id
    }
    //console.log(data);

    fetch(new Request("/user/tribut/save_resto/"+tribu_t_name_0+"_restaurant", {
        method: "POST",
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })).then(req => {
        console.log(req.ok , req.status)
        if (req.ok && req.status === 200) {
                let xmlString = `<div class="alert alert-success mb-2 mt-2" role="alert">
                ${nom} bien pastillé avec succès!
                </div>`;
                
                document.querySelector("#form_past").innerHTML = xmlString;

                setTimeout(()=>{
                    document.querySelector("#form_past").innerHTML = ""
                    showResto(tribu_t_name_0+"_restaurant",id_c_u);
                }, 5000)

               
        }
    })

    document.querySelector("#result_resto_past").style.display="none";
}

/**
 * show gallery 
 */
function showPhotos(){

    // invitationsContainer.innerHTML = "";               
    // invitationsContainer.style.display = "none"
    // restoContainer.style.display = "none"
    // restoContainer.innerHTML += "";
    let  photosContainer = document.querySelector("#tribu_t_conteuneur")
    // showCreatePub.style.display = "none"
    // showCreatePub_mobile.style.display = "none"
    // showPub.style.display = "none"

    photosContainer.innerHTML = `<div class="mt-3 d-flex justify-content-center">
            <div class="spinner-border" role="status">
            <span class="sr-only">Loading...</span>
            </div>
        </div>`;

    const requete=new Request("/user/tribu/photos/" + tribu_t_name_0+"_publication", {
        method: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
    fetch(requete).then(rqt => rqt.json()).then(data => {
            //console.log(data);
            photosContainer.innerHTML = `<div class="intro">
                    <div class="alert alert-success" role="alert" style="display:none;" id="success_upload">
                        Photo télechargé avec succès!
                    </div>
                    <div><span class="h2">Liste des photos</span> <label class="input-file text-center float-end"  style="height:40px;background-color:#0D6EFD;padding:10px;border-radius:5px;color:white;cursor:pointer;"> <i class="bi bi-camera-fill"></i> Importer
                        <input onchange="loadFile(event)" type="file" name="photo" style="display:none;">
                        <img src="" alt="" id="photo-file" class="w-100" style="display:none;">
                    </label></div>
                    
                </div>`;

            if(data.length > 0){
                let li_img =''

                for (let photo of data) {
                    let img_src =photo.photo.replaceAll("/public","");
                    li_img +=`<img  class="img_gal" src="${img_src}" data-bs-toggle="modal" data-bs-target="#modal_show_photo" onclick = "setPhotoTribu(this)">`
                }
                setGallerie(document.querySelectorAll(".img_gal"))
                photosContainer.innerHTML+=`<div class="gallery-container"><div id="gallery">${li_img}</div></div>`

                setGallerie(document.querySelectorAll("#gallery img"))
                
            }else{
                //photosContainer.style.textAlign = "center"
                photosContainer.innerHTML += `<div class="gallery-container"><div id="gallery">Aucune photo</div></div>`;
                // invitationsContainer.innerHTML = "";               
                // invitationsContainer.style.display = "none"
                // restoContainer.style.display = "none"
                // restoContainer.innerHTML += "";
            }

        });

}


function loadFile(event) {
    let new_photo = document.createElement("img")
    new_photo.setAttribute("data-bs-toggle","modal")
    new_photo.setAttribute("data-bs-target","#modal_show_photo")
    new_photo.setAttribute("onclick","setPhotoTribu(this)")
    new_photo.src = URL.createObjectURL(event.target.files[0]);
    var div_photo = document.querySelector('#gallery');

    let first_photo = document.querySelector("#gallery > img:nth-child(1)")

    if(first_photo){
        div_photo.insertBefore(new_photo, first_photo)
    }else{
        div_photo.innerHTML = ""
        div_photo.appendChild(new_photo);
    }
    

    const fileReader = new FileReader();
    fileReader.onload = () => {
        const srcData = fileReader.result;

        ///public/uploads/tribu_t/photo/tribu_t_1_banane_publication/photo.jpg
        let data = {
                publication : "",
                image : srcData,
                confidentiality : 1
            }

        fetch(new Request("/user/tribu/add_photo/"+tribu_t_name_0+"_publication", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })).then(x => x.json()).then(response => {
            document.querySelector("#success_upload").style ="display:block;"
            setTimeout(function(){
                 document.querySelector("#success_upload").style ="display:none;"
            }, 5000);
            console.log(response)
            }
        ).catch(error=>{
            console.log(error)
        });
    };
    fileReader.readAsDataURL(event.target.files[0]);
}
/*-----------end------------------*/

function showActualites(){
    document.querySelector("#page-top > div > ul:nth-child(6) > li:nth-child(1) > div > div.col-9 > p > a").click();
}


if( document.querySelector("#submit-publication-tribu-t")){
    document.querySelector("#submit-publication-tribu-t").addEventListener("click" , () => {
        document.querySelector("#form-publication-tribu-t > div > div > div.modal-header > button").click();
        showActualites();
    })
}

function showInvitations() {
    // document.querySelector("#list-publicatiotion-tribu-t").innerHTML = ""
    // document.querySelector("#createPubBloc").style.display = "none";
    document.querySelector("#tribu_t_conteuneur").innerHTML = `
                <div class="bg-white rounded-3 px-3">
                    <ul class="nav nav-tabs ml-3" id="smallNavInvitation">
                        <li class="nav-item">
                            <a data-element="table-tribuG-member" class="nav-link active text-secondary" aria-current="page" href="#" onclick="setActiveTab(this)">Tribu G</a>
                        </li>
                        <li class="nav-item">
                            <a data-element="blockSendEmailInvitation" class="nav-link text-secondary" href="#" onclick="setActiveTab(this)">Email</a>
                        </li>
                    </ul>
                    <div id="blockSendEmailInvitation" style="display:none;" class="w-50 mt-4 px-3">
                        <h5 class="modal-title text-primary" id="exampleModalLabel">Inviter d'autre partisan par E-mail</h5>
                        <form class="content_form_send_invitation_email_js_jheo">
                            <div class="alert alert-success mt-3" id="successSendingMail" role="alert" style="display:none;">
                                Invitation envoyée avec succès !
                            </div>
                            <div class="form-group content_cc_css_jheo mt-3">
                                <label for="exampleFormControlInput1">Destinataires</label>
                                <input type="email" class="form-control single_destination_js_jheo" id="exampleFormControlInput1" placeholder="name@example.com">
                                <a href="#" style="padding-top:5px;" class="nav-link link-dark collapsed cc_css_jheo" data-bs-toggle="collapse" data-bs-target="#tribut-collapse" aria-expanded="false">
                                    <span class="me-2 mt-2">Cc/Cci</span>
                                </a>
                            </div>

                            <div class="collapse mt-3" id="tribut-collapse">
                                <div class="form-group multiple_destination_css">
                                    <label for="exampleFormControlInput1">Ajouter de Cc</label>
                                    <input type="text" class="form-control  multiple_destination_js_jheo" id="exampleFormControlInput1" placeholder="Saisir l'email puis tapez la touche Entrée">
                                    <div class="content_chip content_chip_js_jheo">
                                        
                                    </div>
                                </div>
                            </div>
                            <div class="form-group content_objet_css_jheo mt-3">
                                <label for="exampleFormControlInput2">Objet</label>
                                <input type="text" class="form-control object_js_jheo" id="exampleFormControlInput2" placeholder="Objet">
                            </div>

                            <div class="form-group mt-3">
                                <label for="exampleFormControlTextarea1">Description</label>
                                <textarea class="form-control invitation_description_js_jheo" id="exampleFormControlTextarea1" rows="3"></textarea>
                            </div>
                            <button type="button" class="btn btn-primary btn_send_invitation_js_jheo my-3">Envoyer l'invitation</button>
                        </form>
                    </div>
                    <div id="table-tribuG-member" class="mt-2">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th scope="col">Nom</th>
                                    <th>Email</th>
                                    <th scope="col">Tribu G</th>
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody id="all_tribu_g_members">
                                
                            </tbody>
                        </table>
                    </div>
                </div>
        `
    fetchAllTribuGMember()

    /** JEHOVANNIE SEND INVITATION BY EMAIL */
    const form_parent = document.querySelector(".content_form_send_invitation_email_js_jheo");
    const input_principal = form_parent.querySelector(".single_destination_js_jheo")
    const input_cc = form_parent.querySelector(".multiple_destination_js_jheo")
    const object = form_parent.querySelector(".object_js_jheo");
    const description = form_parent.querySelector(".invitation_description_js_jheo");

    document.querySelector("#blockSendEmailInvitation").setAttribute("data-table", document.querySelector("#tribu_t_name_main_head").dataset.tribu)

    input_principal.addEventListener("input", () => {
        input_principal.style.border = "1px solid black";
    })

    input_cc.addEventListener("input", () => {
        input_cc.style.border = "1px solid black";
    })

    object.addEventListener("input", () => {
        object.style.border = "1px solid black";
    })

    input_cc.addEventListener("keyup", (e) => {

        if (e.code === "KeyM" || e.code === "Enter" || e.code === "NumpadEnter") {
            if (verifieEmailValid(input_cc.value.replace(",", ""))) {
                ////create single email
                // <div  class="chip"><span>toto@gmail.com</span><i class="fa-solid fa-delete-left" onclick="ondeleteUser(this)"></i></div>
                const div = document.createElement("div");
                div.classList.add("chip");
                const span = document.createElement("span");
                span.innerText = input_cc.value.replace(",", "");
                div.appendChild(span);
                div.innerHTML += `<i class="fa-solid fa-delete-left" onclick="ondeleteUser(this)"></i>`
                document.querySelector(".content_chip_js_jheo").appendChild(div);

                input_cc.value = null
            } else {
                input_cc.style.border = "1px solid red";
            }
        }
    })

    form_parent.querySelector(".btn_send_invitation_js_jheo").addEventListener("click", (e) => {
        e.preventDefault();
        form_parent.querySelector(".btn_send_invitation_js_jheo").setAttribute("disabled", true)
        form_parent.querySelector(".btn_send_invitation_js_jheo").textContent = "En cours..."

        ////get cc
        let cc_destinataire = [];
        document.querySelectorAll(".chip span").forEach(item => {
            cc_destinataire.push(item.innerText)
        })

        let data = { "table": document.querySelector("#blockSendEmailInvitation").getAttribute("data-table"), "principal": "", "cc": cc_destinataire, "object": "", "description": "" }

        console.log(data);

        let status = false;

        if (input_principal.value === "") {
            alert("Entre au moin une destination.")
            input_principal.style.border = "1px solid red";
        }

        if (verifieEmailValid(input_principal.value)) {
            data = { ...data, "principal": input_principal.value }
            status = true;
        } else {
            input_principal.style.border = "1px solid red";
        }

        ///object
        if (object.value === "") {
            alert("Veillez entre un Object.")
            object.style.border = "1px solid red";
        } else {
            data = { ...data, "object": object.value }
            status = true;
        }

        if (description.value != "") {
            data = { ...data, "description": description.value }
        }
        console.log("data sending...")
        console.log(data)

        if (status) {
            //////fetch data
            fetch("/user/tribu/email/invitation", {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }).then(response => {
                if (!response.ok && response.status != 200) {
                    throw new Error("ERROR: " + response.status)
                }
                return response.json()
            }).then(result => {
                input_principal.value = null;
                input_cc.value = null;
                description.value = null;
                object.value = null;
                document.querySelectorAll(".chip").forEach(item => {
                    item.parentElement.removeChild(item);
                })

                form_parent.querySelector(".btn_send_invitation_js_jheo").removeAttribute("disabled")
                form_parent.querySelector(".btn_send_invitation_js_jheo").textContent = "Envoyer l'invitation"
                document.querySelector("#successSendingMail").style.display = "block"
        
                setTimeout(()=>{
                    document.querySelector("#successSendingMail").style.display = "none"
                }, 3000)

            }).catch((e) => { console.log(e); });

        }
    })

    /** END JEHOVANNIE*/
}

function setActiveTab(elem){
    if(!elem.classList.contains("active")){
        elem.classList.add("active")
        document.querySelector("#"+elem.dataset.element).style = "";
        if(elem.parentElement.nextElementSibling){
            elem.parentElement.nextElementSibling.firstElementChild.classList.remove("active")
            document.querySelector("#"+elem.parentElement.nextElementSibling.firstElementChild.dataset.element).style.display = "none";
        }else{
            elem.parentElement.previousElementSibling.firstElementChild.classList.remove("active")
            document.querySelector("#"+elem.parentElement.previousElementSibling.firstElementChild.dataset.element).style.display = "none";
        }
    }
}

function fetchAllTribuGMember() {
    let table = document.querySelector("#tribu_t_name_main_head").dataset.tribu.trim()
    let tbody = document.querySelector("#all_tribu_g_members")
    tbody.innerHTML = `<td colspan="4"><div class="d-flex justify-content-center">
                        <div class="spinner-border" role="status">
                        <span class="visually-hidden">Loading...</span>
                        </div>
                    </div></td>`
    fetch("/user/all_tribu_g/members?tribu_t="+table)
        .then(response=>response.json())
        .then(response=>{
            console.log(response)
            if(response.length > 0){
                tbody.innerHTML = ""
                for (const item of response) {
                    let ancorOrbutton = ""
                    if(item.isMember != "not_invited"){
                        if(item.isMember == "refuse"){
                            ancorOrbutton = `<button class="btn btn-sm btn-secondary" disabled="true">Invitation refusée</button>`;
                        }else if(item.isMember == "pending"){
                            ancorOrbutton = `<button class="btn btn-sm btn-secondary" disabled="true">En attente</button>`;
                        }else{
                            ancorOrbutton = `<button class="btn btn-sm btn-secondary" disabled="true">Membre</button>`;
                        }
                    }else{
                        ancorOrbutton = `<button data-id="${item.id}" type="button" class="btn btn-primary btn-sm" onclick="inviteUser(this)">Inviter</button>`;
                    }
                    tbody.innerHTML += `<tr>
                            <td><a style="text-decoration:none;" href="/user/profil/${item.id}">${item.fullName}</a></td>
                            <td>${item.email}</td>
                            <td>${item.tribug}</td>
                            <td class="text-center">${ancorOrbutton}</td>
                        </tr>
                    `
                }
                $('#table-tribuG-member > table').DataTable({
                    "language": {
                        url: '//cdn.datatables.net/plug-ins/1.13.4/i18n/fr-FR.json',
                    }
                });
            }else{
                tbody.innerHTML = "Aucun tribu G créé pour le moment"
            }

        })
        .catch(error=>console.log(error))
}

function inviteUser(elem){
	
    let data = {
                user_id : elem.dataset.id,
                table : document.querySelector("#tribu_t_name_main_head").dataset.tribu.trim(),
            }
    
    console.log(data);
    
    const http = new XMLHttpRequest()
    http.open('POST', '/user/tribu/send/one-invitation')
    http.setRequestHeader('Content-type', 'application/json')
    http.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
    http.send(JSON.stringify(data))
    http.onload = function() {
        elem.style.backgroundColor = "#E4E6EB";
        elem.style.borderColor = "#E4E6EB";
        elem.style.color = "black";
        elem.setAttribute("disabled", true);
        elem.innerHTML = http.responseText.replace(/"/g, "").replace(/ee/g, "ée");
    }

}

function verifieEmailValid(email) {
    if (email.match(/(?:[a-z0-9+!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/gi)) {
        return true;
    }
    return false
}


function ondeleteUser(e) {
    const email = e.parentElement
    email.parentElement.removeChild(email);
}