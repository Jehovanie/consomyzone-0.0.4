const IS_DEV_MODE=true;
const current_url = window.location.href;
const url = current_url.split("/");
const nav_items = document.querySelectorAll(".nav-item");
const url_test = new URL(current_url);
// cloneResultDepResto()
if( document.querySelector(".form_content_search_navbar_js")){
    const search_form = document.querySelector(".form_content_search_navbar_js");
    if( getDataInLocalStorage("type")){
        const baseOne = getDataInLocalStorage("type");
        search_form.setAttribute("action", `${search_form.getAttribute("action")}/${baseOne}`);
    }

    search_form.addEventListener("submit", (e) => {
        const cles0 = document.querySelector(".input_search_type_js").value.trim();
        const cles1= document.querySelector(".input_mots_cle_js").value.trim();
        
        if(current_url.includes("/restaurant") || current_url.includes("/ferme") || current_url.includes("/station")){
            
            if( cles0=== "" && cles1 === "" ){

                e.preventDefault();

                new swal("Attention !", "Veuillez renseigner au moins l'adresse!", "error")
                    .then((value) => {
                        document.querySelector(".input_mots_cle_js").classList.add("border_red")
                    });
    
            }else if(cles1 === ""){

                e.preventDefault();

                new swal("Attention !", "L'adresse est obligatoire!", "error")
                    .then((value) => {
                        document.querySelector(".input_mots_cle_js").classList.add("border_red")
                    });
            }
        }else{

            if( cles1 === "" ){

                e.preventDefault();

                new swal("Attention !", "L'adresse est obligatoire!", "error")
                    .then((value) => {
                        document.querySelector(".input_mots_cle_js").classList.add("border_red")
                    });
    
            }

            /*if( cles0=== "" && cles1 === "" ){
    
                //alert("Veuillez renseigner les deux champs!")
                alert("L'adresse est obligatoire!")
    
                e.preventDefault();
                // document.querySelector(".input_search_type_js").classList.add("border_red")
                document.querySelector(".input_mots_cle_js").classList.add("border_red")
    
            }else if( cles0=== "" || cles1 === "" ){
     
                document.querySelector(".input_mots_cle_js").classList.add("border_red")
    
                if( cles0=== "" ){
                    if(getDataInLocalStorage("type") != "tous"){
                        alert("Veuillez renseigner le nom de "+ getDataInLocalStorage("type"))
                    }else{
                        alert("Veuillez renseigner de quoi vous avez besoin !")
                    }
                    document.querySelector(".input_search_type_js").classList.add("border_red")
                    e.preventDefault();
                }
    
                if( cles1=== "" ){
                    alert("Veuillez renseigner l'addresse!")
                    document.querySelector(".input_mots_cle_js").classList.add("border_red")
                    e.preventDefault();
                }
    
            }*/

        }

    })

    const inputs=  [document.querySelector(".input_search_type_js"), document.querySelector(".input_mots_cle_js")];
    inputs.forEach(input => {
        input.addEventListener("input", () => {
            
            inputs.forEach(item => {
                if( item.classList.contains("border_red")){
                    item.classList.remove("border_red")
                }
            })
        })
    })

}

if( document.querySelector(".form_content_search_navbar_js_mob")){
    const search_form = document.querySelector(".form_content_search_navbar_js_mob");
    if( getDataInLocalStorage("type")){
        const baseOne = getDataInLocalStorage("type");
        search_form.setAttribute("action", `${search_form.getAttribute("action")}/${baseOne}`);
    }

    search_form.addEventListener("submit", (e) => {
        const cles0 = document.querySelector(".input_search_type_js_mob").value.trim();
        const cles1= document.querySelector(".input_mots_cle_js_mob").value.trim();
        
        if(current_url.includes("/restaurant") || current_url.includes("/ferme") || current_url.includes("/station")){
            
            if( cles0=== "" && cles1 === "" ){

                e.preventDefault();

                new swal("Attention !", "Veuillez renseigner au moins l'adresse!", "error")
                    .then((value) => {
                        document.querySelector(".input_mots_cle_js_mob").classList.add("border_red")
                    });
    
            }else if(cles1 === ""){

                e.preventDefault();

                new swal("Attention !", "L'adresse est obligatoire!", "error")
                    .then((value) => {
                        document.querySelector(".input_mots_cle_js_mob").classList.add("border_red")
                    });
            }
        }else{

            if( cles1 === "" ){

                e.preventDefault();

                new swal("Attention !", "L'adresse est obligatoire!", "error")
                    .then((value) => {
                        document.querySelector(".input_mots_cle_js_mob").classList.add("border_red")
                    });
    
            }
        }

    })

    const inputs=  [document.querySelector(".input_search_type_js_mob"), document.querySelector(".input_mots_cle_js_mob")];
    inputs.forEach(input => {
        input.addEventListener("input", () => {
            
            inputs.forEach(item => {
                if( item.classList.contains("border_red")){
                    item.classList.remove("border_red")
                }
            })
        })
    })

}


/// use this for flip on the left menu
if( document.querySelector(".b-example-divider .fa-solid") ){

    const menu = document.querySelector(".b-example-divider .fa-solid")
    menu.addEventListener("click" , () => {

        if(menu.getAttribute("data-toggle-state") === "show"){

            document.querySelector(".content_left_menu").style.animation ="toHideLeft 0.5s linear forwards"

            document.querySelector(".content_left_menu").style.overflow ="hidden"



            document.querySelector(".right_content").style.animation="toScaleUpContent 0.5s linear forwards";

            document.querySelector(".content_nav_top").style.animation="toScaleUpNavbar 0.5s linear forwards";

     

            const all_span = document.querySelectorAll(".link_type_menu");

            all_span.forEach(item => {

                item.style.animation="toNone 0.2s linear forwards";

             })

     

             menu.setAttribute("data-toggle-state", "hide")

        }else{

            document.querySelector(".content_left_menu").style.animation ="toShowLeft 0.5s linear forwards"

             

            document.querySelector(".right_content").style.animation="toScaleDownContent 0.5s linear forwards";

            document.querySelector(".content_nav_top").style.animation="toScaleDownNavbar 0.5s linear forwards";

     

             const all_span = document.querySelectorAll(".link_type_menu");

             all_span.forEach(item => {

                 item.style.animation="toBlock 0.2s linear forwards"

             })

             menu.setAttribute("data-toggle-state", "show")

        }

    })

}



///jheo: for message flash ---------------------------
if(document.querySelector(".custom-flash")){

    const contentMessageFlash = document.querySelector(".custom-flash");

    //contentMessageFlash.style.animation = "toShowFlass 0.8s linear forwards"



    setTimeout(() => {

        contentMessageFlash.classList.add("hide-flash") 

    }, 4000)

}


if(document.querySelector(".custom-flash-inscription")){

    const contentMessageFlash = document.querySelector(".custom-flash-inscription");

    //contentMessageFlash.style.animation = "toShowFlass 0.8s linear forwards"



    setTimeout(() => {

        contentMessageFlash.classList.add("hide-flash-inscription") 

    }, 4000)

}

/// ------------ end of message flash ----------------



///jheo: setting retractibilite -------------
if( document.querySelector("#show_list")){

    const btn_show_list = document.querySelector("#show_list");



    btn_show_list.addEventListener("click", () => {

        // contentMessageFlash.style.animation = "toShowFlass 0.8s linear forwards"

        document.querySelector(".left_content_home").style.animation ="toShowList 0.8s linear forwards";

        document.querySelector(".right_content_home").style.animation ="toScaleDown 0.8s linear forwards";



        btn_show_list.style.display="none"

    })

}



if( document.querySelector("#hide_list")){
    const btn_hide_list = document.querySelector("#hide_list");

    btn_hide_list.addEventListener("click", () => {

        // contentMessageFlash.style.animation = "toShowFlass 0.8s linear forwards"
        document.querySelector(".left_content_home").style.animation ="toHideList 0.8s linear forwards";
        document.querySelector(".right_content_home").style.animation ="toScaleUp 0.8s linear forwards";

        document.querySelector("#show_list").style.display="block"
    })

}
// --------- end of retractibilite -----------



/// ------- toggle password -----------------
if(document.querySelector("#togglePassword")){

    const icon_eye = document.querySelector("#togglePassword");

    icon_eye.addEventListener("click", () => {

        const input_pass = document.querySelector(".toggle_password_js_jheo");

        if( icon_eye.classList.contains("fa-eye-slash")){

            icon_eye.classList.remove("fa-eye-slash");

            icon_eye.classList.add("fa-eye");

            ///show password

            input_pass.type="text";

        }else{

            icon_eye.classList.remove("fa-eye");

            icon_eye.classList.add("fa-eye-slash");

            ///hide password

            input_pass.type="password";

        }

    })

}

if(document.querySelector("#togglePasswordInscription")){

    const icon_eye = document.querySelector("#togglePasswordInscription");

    icon_eye.addEventListener("click", () => {

        const input_pass = document.querySelector(".toggle_password_inscription_js_jheo");

        if( icon_eye.classList.contains("fa-eye-slash")){

            icon_eye.classList.remove("fa-eye-slash");

            icon_eye.classList.add("fa-eye");

            ///show password

            input_pass.type="text";

        }else{

            icon_eye.classList.remove("fa-eye");

            icon_eye.classList.add("fa-eye-slash");

            ///hide password

            input_pass.type="password";

        }

    })

}

////jheo: Responsive for mobile -----------------------
if(document.getElementById("close_menu_for_mobile")){
    const close_menu =  document.getElementById("close_menu_for_mobile");

    close_menu.addEventListener("click" , () => {
        document.querySelector(".content_left_menu").style.animation="toHide 0.8s linear forwards"
        console.log(document.querySelector(".content_left_menu").style.animation)
    })

}



if(document.getElementById("open_menu")){

    const open_menu =  document.getElementById("open_menu");



    open_menu.addEventListener("click" , () => {

        console.log(document.querySelector(".content_left_menu"))

        document.querySelector(".content_left_menu").style.animation="toShow 0.8s linear forwards"

        console.log(document.querySelector(".content_left_menu").style.animation)

    })

}
/// --------------- end of this rtesponsive for mobile ---------


function testIsMatched(value, tester){
    return value?.split(" ").join("").toLowerCase().includes(tester);
}

function makeLoadingDemandePartenariatEmail(){
    let containerChargement = document.createElement("div")
    containerChargement.classList.add("chargement_content")
    containerChargement.classList.add("content_chargement_email")
    containerChargement.classList.add("mt-3")
    containerChargement.classList.add("mb-3")
    document.querySelector(".container_list").appendChild(containerChargement)

    createChargement(document.querySelector(".content_chargement_email"), c = "chargement_content content_chargement_email")

}

function showResultSearchNavBar(type,nom, adresse, dep, nomDep , id ){

    const div_content = document.createElement('div');
    div_content.className = "card mt-2";

    const card_body = document.createElement('div');
    card_body.className = "card-body";

    const h5 = document.createElement('h5');
    h5.className = "card-title";
    h5.innerText = nom;

    const p = document.createElement('p');
    p.className = "card-text";
    p.innerText = `Adresse : ${adresse}, departement : ${dep}, nom de departement : ${nomDep}`;

    const a = document.createElement("a");

    switch(type){
        case "ferme":
            a.setAttribute("href", `/ferme/departement/${nomDep}/${dep}/details/${id}`);
            break;
        case "resto":
            // /restaurant/departement/Loire-Atlantique/44/details/1
            a.setAttribute("href", `/restaurant/departement/${nomDep}/${dep}/details/${id}`);
            break;
        case "station":
            // /station/departement/50/Manche/details/4827
            a.setAttribute("href", `/station/departement/${dep}/${nomDep}/details/${id}`);
            break;
        default: 
            break
    }
    
    a.className = "btn btn-primary";
    a.innerText = "Voir details"

    div_content.appendChild(card_body);
    card_body.appendChild(h5);
    card_body.appendChild(p);
    card_body.appendChild(a);

    document.querySelector(".content_list_result_js_jheo").appendChild(div_content)
}



function setDataInSessionStorage(type , value){
    sessionStorage.setItem(type, value );
}

function getDataInSessionStorage(type){
    return sessionStorage.getItem(type);
}

function clearDataInSessionStorage(type){
    return sessionStorage.removeItem(type);
}

function setDataInLocalStorage(type , value){
    localStorage.setItem(type, value );
}

function getDataInLocalStorage(type){
    return localStorage.getItem(type);
}

function rmDataInLocalStorage(type){
    localStorage.removeItem(type);
    // localStorage.clear();
}


function addControlPlaceholdersferme(map) {
    const corners = map._controlCorners
    const l = 'leaflet-'
    const container = map._controlContainer;

    function createCorner(vSide, hSide) {
        var className = l + vSide + ' ' + l + hSide;

        corners[vSide] = L.DomUtil.create('div', className, container);
    }

    createCorner('verticalcenterl', 'left swipe-me-reverse');
    createCorner('verticalcenter', 'right');
    createCorner('horizontalmiddle', 'center');
  
}


function iconsChange() {
    document.querySelector(".icon_open_nav_left_jheo_js").classList.toggle("fa-bars")
    document.querySelector(".icon_open_nav_left_jheo_js").classList.toggle("fa-minuss")
}

if( document.querySelector(".icon_close_nav_left_jheo_js")){
    document.querySelector(".icon_close_nav_left_jheo_js").addEventListener('click' , () => {
        if(!document.querySelector(".content_navleft_jheo_js").classList.contains("d-none")){
            document.querySelector(".content_navleft_jheo_js").classList.add("d-none")
            iconsChange()
        };
    })
}

if( document.querySelector(".open_nav_left_jheo_js")){
    document.querySelector(".open_nav_left_jheo_js").addEventListener("click", () => {
        if( document.querySelector(".content_navleft_jheo_js").classList.contains("d-none")){
            document.querySelector(".content_navleft_jheo_js").classList.remove("d-none")
            iconsChange()
        }
    })
}

if (document.querySelector("#menu-mobile")) {
    document.querySelector("#menu-mobile").onclick = () => {
        if (document.querySelector("#container-mobile")) {
            document.querySelector("#container-mobile").classList.toggle("content_right_actualite-g_menu");
            document.querySelector(".card-pub").classList.toggle("bgPersonnalisee_menu");
        } else if (document.querySelector(".content_right_actualite")) {
            document.querySelector(".content_right_actualite").classList.toggle("content_right_actualite_menu");
        } 
        
    }
}

if (document.querySelector("#menu-mobile-tribut")) {
    document.querySelector("#menu-mobile-tribut").onclick = () => {
        if (document.querySelector(".content_list_menu_tribut_mob")) {
            document.querySelector(".content_list_menu_tribut_mob").classList.toggle("transition-mob")
        }
    }
}

if (document.querySelector(".tribu_t")) {
    document.querySelector(".tribu_t").onclick = () => {
        alert("Please")
        // document.querySelector(".content_list_menu_tribut_mob").classList.toggle("transition-mob")
    }
}


/**
 * active navigation bar map
 */
if (document.querySelector(".list-nav-bar")) {
    const activPage = window.location.pathname;
    
    if( activPage.includes("/ferme")){
        document.querySelector("#ferme-page").classList.add("active");
    }else if( activPage.includes("/restaurant")){
        document.querySelector("#resto-page").classList.add("active");
    }else if( activPage.includes("/station")){
        document.querySelector("#station-page").classList.add("active");
    }else if( activPage.includes("/golf")){
        document.querySelector("#golf-page").classList.add("active");
    }else if( activPage.includes("/tabac")){
        document.querySelector("#tabac-page").classList.add("active");
    }else if(activPage.length === 1 || activPage.includes("/search/tous") ){
        document.querySelector("#tous-page").classList.add("active");
    }
}


if( document.querySelector('.btn_close_comment_jheo_js') || document.querySelector('.btn_cancel_comment_jheo_js')){
    const cta= [ document.querySelector('.btn_close_comment_jheo_js'),document.querySelector('.btn_cancel_comment_jheo_js') ];

    cta.forEach(item  => {
        item.addEventListener("click", () => {
            document.querySelector('.content_all_comment_jheo_js').innerHTML="";
        })
    })
}

/**upload file */
let dropZones=document.querySelectorAll(".drop_zone__input_Nantenaina_css_js")
if(dropZones.length > 0 && dropZones!=null){
    document.querySelectorAll(".drop_zone__input_Nantenaina_css_js").forEach((inputElement) => {
        const dropZoneElement = inputElement.closest(".drop_zone_Nantenaina_css_js");
      
        dropZoneElement.addEventListener("click", (e) => {
          inputElement.click();
        });
      
        // inputElement.addEventListener("change", (e) => {
        //   if (inputElement.files.length) {
        //     updateThumbnail(dropZoneElement, inputElement.files[0]);
        //   }
        // });
      
        dropZoneElement.addEventListener("dragover", (e) => {
          e.preventDefault();
          dropZoneElement.classList.add("drop-zone--over");
        });
      
        ["dragleave", "dragend"].forEach((type) => {
          dropZoneElement.addEventListener(type, (e) => {
            dropZoneElement.classList.remove("drop-zone--over");
          });
        });
      
        // dropZoneElement.addEventListener("drop", (e) => {
        //   e.preventDefault();
      
        //   if (e.dataTransfer.files.length) {
        //     //inputElement.files = e.dataTransfer.files;
        //     //updateThumbnail(dropZoneElement, e.dataTransfer.files[0]);
        //   }
      
        //   dropZoneElement.classList.remove("drop-zone--over");
        // });
      });
}
 /**
   * Updates the thumbnail on a drop zone element.
   *
   * @param {HTMLElement} dropZoneElement
   * @param {File} file
   */
  function updateThumbnail(dropZoneElement, file, customFile) {

    let thumbnailElement = dropZoneElement.querySelector(".drop-zone__thumb");
  
    // First time - remove the prompt
    if (dropZoneElement.querySelector(".drop_zone__prompt_Nantenaina_css_js")) {
      dropZoneElement.querySelector(".drop_zone__prompt_Nantenaina_css_js").remove();
    }
  
    // First time - there is no thumbnail element, so lets create it
    if (!thumbnailElement) {
      thumbnailElement = document.createElement("div");
      thumbnailElement.classList.add("drop-zone__thumb");
      dropZoneElement.appendChild(thumbnailElement);
    }
  
    thumbnailElement.dataset.label = file.name;
  
    // Show thumbnail for image files
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
  
      reader.readAsDataURL(file);
      reader.onload = () => {
        thumbnailElement.style.backgroundImage = `url('${reader.result}')`;
      };
    } else {
        // thumbnailElement.style.backgroundImage ="url('/public/assets/image/doc.jpg')" ;
        thumbnailElement.style.backgroundImage ="url('/public/assets/image/doc.jfif')" ;
    }
  }

let editor;
initCKEditor("editor",showModalEditor);
initCKEditor("editor-partenaire",showPartenairAsk);
initCKEditor("editor-reponseDemandePartenaire",showReponsePartenaire);

/**
 * 
 * @param {*} idElement please give id 
 */
function initCKEditor(idElement,callback){
    if(document.getElementById(`${idElement}`)){
        CKEDITOR.ClassicEditor.create(document.getElementById(`${idElement}`), {
            // https://ckeditor.com/docs/ckeditor5/latest/features/toolbar/toolbar.html#extended-toolbar-configuration-format
            toolbar: {
                items: [
                    
                    'selectAll', '|',
                   
                    'bold', 'italic', 'strikethrough', 'underline', 'code', 'subscript', 'superscript', 'removeFormat', '|',
                    'bulletedList', 'numberedList', 'todoList', '|',
                    'outdent', 'indent', '|','undo', 'redo',
                    '-',
                    'fontSize', 'fontFamily', 'fontColor', 'fontBackgroundColor', 'highlight', '|',
                    'alignment', '|',
                    'link',  'blockQuote','|',
                     'horizontalLine', 'pageBreak', '|',
                    'textPartLanguage'
                    
                ],
                shouldNotGroupWhenFull: true
            },
            // Changing the language of the interface requires loading the language file using the <script> tag.
            // language: 'es',
            list: {
                properties: {
                    styles: true,
                    startIndex: true,
                    reversed: true
                }
            },
            // https://ckeditor.com/docs/ckeditor5/latest/features/headings.html#configuration
            heading: {
                options: [
                    { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
                    { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
                    { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
                    { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
                    { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
                    { model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5' },
                    { model: 'heading6', view: 'h6', title: 'Heading 6', class: 'ck-heading_heading6' }
                ]
            },
            // https://ckeditor.com/docs/ckeditor5/latest/features/editor-placeholder.html#using-the-editor-configuration
            placeholder: 'Welcome to CKEditor&nbsp;5!',
            // https://ckeditor.com/docs/ckeditor5/latest/features/font.html#configuring-the-font-family-feature
            fontFamily: {
                options: [
                    'default',
                    'Arial, Helvetica, sans-serif',
                    'Courier New, Courier, monospace',
                    'Georgia, serif',
                    'Lucida Sans Unicode, Lucida Grande, sans-serif',
                    'Tahoma, Geneva, sans-serif',
                    'Times New Roman, Times, serif',
                    'Trebuchet MS, Helvetica, sans-serif',
                    'Verdana, Geneva, sans-serif'
                ],
                supportAllValues: true
            },
            // https://ckeditor.com/docs/ckeditor5/latest/features/font.html#configuring-the-font-size-feature
            fontSize: {
                options: [ 10, 12, 14, 'default', 18, 20, 22 ],
                supportAllValues: true
            },
            // Be careful with the setting below. It instructs CKEditor to accept ALL HTML markup.
            // https://ckeditor.com/docs/ckeditor5/latest/features/general-html-support.html#enabling-all-html-features
            htmlSupport: {
                allow: [
                    {
                        name: /.*/,
                        attributes: true,
                        classes: true,
                        styles: true
                    }
                ]
            },
            // Be careful with enabling previews
            // https://ckeditor.com/docs/ckeditor5/latest/features/html-embed.html#content-previews
            htmlEmbed: {
                showPreviews: true
            },
            // https://ckeditor.com/docs/ckeditor5/latest/features/link.html#custom-link-attributes-decorators
            link: {
                decorators: {
                    addTargetToExternalLinks: true,
                    defaultProtocol: 'https://',
                    toggleDownloadable: {
                        mode: 'manual',
                        label: 'Downloadable',
                        attributes: {
                            download: 'file'
                        }
                    }
                }
            },
            // https://ckeditor.com/docs/ckeditor5/latest/features/mentions.html#configuration
            mention: {
                feeds: [
                    {
                        marker: '@',
                        feed: [
                            '@apple', '@bears', '@brownie', '@cake', '@cake', '@candy', '@canes', '@chocolate', '@cookie', '@cotton', '@cream',
                            '@cupcake', '@danish', '@donut', '@dragée', '@fruitcake', '@gingerbread', '@gummi', '@ice', '@jelly-o',
                            '@liquorice', '@macaroon', '@marzipan', '@oat', '@pie', '@plum', '@pudding', '@sesame', '@snaps', '@soufflé',
                            '@sugar', '@sweet', '@topping', '@wafer'
                        ],
                        minimumCharacters: 1
                    }
                ]
            },
            // The "super-build" contains more premium features that require additional configuration, disable them below.
            // Do not turn them on unless you read the documentation and know how to configure them and setup the editor.
            removePlugins: [
                // These two are commercial, but you can try them out without registering to a trial.
                // 'ExportPdf',
                // 'ExportWord',
                'CKBox',
                'CKFinder',
                'EasyImage',
                // This sample uses the Base64UploadAdapter to handle image uploads as it requires no configuration.
                // https://ckeditor.com/docs/ckeditor5/latest/features/images/image-upload/base64-upload-adapter.html
                // Storing images as Base64 is usually a very bad idea.
                // Replace it on production website with other solutions:
                // https://ckeditor.com/docs/ckeditor5/latest/features/images/image-upload/image-upload.html
                // 'Base64UploadAdapter',
                'RealTimeCollaborativeComments',
                'RealTimeCollaborativeTrackChanges',
                'RealTimeCollaborativeRevisionHistory',
                'PresenceList',
                'Comments',
                'TrackChanges',
                'TrackChangesData',
                'RevisionHistory',
                'Pagination',
                'WProofreader',
                // Careful, with the Mathtype plugin CKEditor will not load when loading this sample
                // from a local file system (file://) - load this site via HTTP server if you enable MathType.
                'MathType',
                // The following features are part of the Productivity Pack and require additional license.
                'SlashCommand',
                'Template',
                'DocumentOutline',
                'FormatPainter',
                'TableOfContents',
                'PasteFromOfficeEnhanced'
            ]
        }).then( newEditor => {
            editor=newEditor
            let html=callback()
            editor.setData(html)
        });
    }
    
}
function showModalEditor(isG, isListeInfile=false){
    let fullname = document.querySelector(".use-in-agd-nanta_js_css").textContent.trim()
    if(isListeInfile){
        if(document.querySelector("#btnValidate"))
            document.querySelector("#btnValidate").removeAttribute("data-g")
        if(document.querySelector("#btnValidateMessage")){
            document.querySelector("#btnValidateMessage").removeAttribute("data-g")
            document.querySelector("#btnValidateMessage").style.display = "none"
        }
       
    }else{
        if(document.querySelector("#btnValidateMessage"))
            document.querySelector("#btnValidateMessage").style.display = "block"
        if(document.querySelector("#btnValidate"))
            document.querySelector("#btnValidate").dataset.g = isG
        if(document.querySelector("#btnValidateMessage"))
             document.querySelector("#btnValidateMessage").dataset.g = isG
    }

    let agenda = JSON.parse(sessionStorage.getItem("agenda"))
    // <span contenteditable="false" style="background-color:rgba(252, 130, 29, 1);" >{{Nom}} de la personne invité 
    //</span>
    return html=` 
    <p>Madame / Monsieur 
       <br>
        C'est avec un immense plaisir que je vous annonce la tenue de l'événement 
        <span id="eventTitleText" style="background-color:rgba(252, 130, 29, 1);">
            ${agenda.title}
        </span>
        , qui aura lieu à l'établissement
        <span id="etabNameText" contenteditable="false" style="background-color:rgba(252, 130, 29, 1);">
            ${agenda.name}
        </span> 
        , se trouvant à l'adresse 
        <span id="etabAdresseText" contenteditable="false" style="background-color:rgba(252, 130, 29, 1);">
            ${agenda.adresse}
        </span> 
         qui aura lieu le <span id="dataDebutText" contenteditable="false" style="background-color:rgba(252, 130, 29, 1);">
            ${agenda.dateStart}
        </span> à partir de  
        <span id="heureDebutText" contenteditable="false" style="background-color:rgba(252, 130, 29, 1);">
            ${agenda.heure_debut}
        </span>  jusqu'à 
        <span id="heureFinText" contenteditable="false" style="background-color:rgba(252, 130, 29, 1);">
            ${agenda.heure_fin}
        </span></p>
    <p >
      <span id="descriptionText" contenteditable="false" style="background-color:rgba(252, 130, 29, 1);">${agenda.description}</span>
    </p>
    <p id="remerciementText" >Je vous remercie de bien vouloir confirmer votre présence avant le 
    <span contenteditable="true" style="background-color:cyan"> à remplir par vous</span></p>
    <p id="confirmationText">Pour confirmer votre présence, veuillez cliquer sur le lien ci-dessous</p>
    <a id="mail_link_Natenaina_js_css" href="" disabled contenteditable="false">Confirmation</button>
    <p id="free_place" > 
    Faites vite, car il ne reste plus que <span contenteditable="false" style="background-color:rgba(252, 130, 29, 1);"> ${agenda.place_libre} </span> place(s)</p>
    <p>Cordialement</p>
    <span id="fullnameCanEdit" contenteditable="true" style="background-color:cyan">
           ${fullname} 
    </span>
    `
}

if (document.querySelector(".open-search-mobil-tomm-js")) {
    document.querySelector(".open-search-mobil-tomm-js").addEventListener("click", () => {
        document.querySelector(".search-mobil-tomm-js").classList.remove('search-resto-mobil-none')
        document.querySelector(".open-search-mobil-tomm-js").classList.add('search-resto-mobil-none')
    })
    document.querySelector(".close-search-mob").addEventListener("click", () => { 
        document.querySelector(".search-mobil-tomm-js").classList.add('search-resto-mobil-none')
        document.querySelector(".open-search-mobil-tomm-js").classList.remove('search-resto-mobil-none')
    })
}

/**
 * Function opening a sweet alert on click button actif without event
 * @author Elie Fenohasina <eliefenohasina@gmail.com>
 * @constructor
 */
function openSwalActif() {

    swal("Veuillez vous connecter pour accéder à ce lien. \nVoulez-vous vous connecter?", {
        buttons: {
          cancel: "Pas maintenant",
          connect: {
            text: "Se connecter",
            value: "connect",
          },
        },
        icon : "info",
      })
      .then((value) => {

        if(value == "connect"){
            window.open("/connexion", "_blank");
        }

      });
}

/**
 * Function opening a sweet alert on click button actif without event
 * @author Elie Fenohasina <eliefenohasina@gmail.com>
 * @constructor
 */
function openSwalActifPastille() {

    swal("Pour pastiller veuillez vous connecter et puis créée une tribu-T avec l'extension restaurant activée.\nVoulez-vous vous connecter?", {
        buttons: {
          cancel: "Pas maintenant",
          connect: {
            text: "Se connecter",
            value: "connect",
          },
        },
        icon : "info",
      })
      .then((value) => {

        if(value == "connect"){
            window.open("/connexion", "_blank");
        }

      });
}



/**
 * Function opening a sweet alert on click button inactif
 * @constructor
 */
function openSwalNonActif(){

    swal({
        text: "Cette fonctionnalité est en cours de développement, merci de votre compréhension.",
        icon: "info",
      });
}

document.querySelectorAll(".btn_gris_actif_js_Elie").forEach(btn_gris=>{

    //console.log(btn_gris);

    btn_gris.addEventListener("click", function(){

        openSwalActif()

    })
})

document.querySelectorAll(".btn_grise_non_actif_js_Elie").forEach(btn_gris=>{
    btn_gris.addEventListener("click", function(){
        openSwalNonActif()
    })
})


function openVoirPlusChearch(denomination_f, adresse){

    let html = `<div class="container mt-3 mb-3"><div class="d-flex justify-content-evenly">
    <div class="d-flex flex-column align-items-center"><i class="fa-brands fa-google fa-search-elie"></i>Google</div>
    <div class="d-flex flex-column align-items-center"><i class="fa-solid fa-location-dot fa-search-elie"></i>Google Maps</div>
    <div class="d-flex flex-column align-items-center"><i class="fa-solid fa-utensils fa-search-elie"></i>The fork</div>
    <div class="d-flex flex-column align-items-center"><i class="fa-brands fa-cc-visa fa-search-elie"></i>Tripadvisor</div>
    <div class="d-flex flex-column align-items-center"><i class="fa-brands fa-guilded fa-search-elie"></i>Guide Michelin</div>
    <div class="d-flex flex-column align-items-center"></div></div>`

    Swal.fire({
        title: 'Vous voulez chercher dans...',
        icon: 'question',
        html: html,
        showConfirmButton: false,
        showCancelButton: false,
        confirmButtonText:
          '<i class="fa-solid fa-magnifying-glass"></i> Rechercher',
        cancelButtonText:
          '<i class="fa-solid fa-xmark"></i> Pas maintenant',
      })

}

function showPartenairAsk(){
    // let fullname = document.querySelector(".use-in-agd-nanta_js_css").textContent.trim()
    return html=`
        <p>Madame / Monsieur</p>
        <span>Ma personne</span> <span style="background-color:rgba(252, 130, 29, 1);">( veulliez nous donner votre nom, prénom et votre email),  </span>
        <span>agissant en tant que</span> <span style="background-color:rgba(252, 130, 29, 1);">(préciser votre fonction au sein de votre entreprise)</span> 
        <span>et représente la société</span> <span style="background-color:rgba(252, 130, 29, 1);">(donner le nom de la société).</span>
        <p> C'est avec le plus grand plaisir que je vous contacte pour vous demander de bien vouloir accepter ma demande de proposition de partenariat.</p>
        <p>Bien cordialement.</p>
        `
}

function showReponsePartenaire(){
    // let fullname = document.querySelector(".use-in-agd-nanta_js_css").textContent.trim()
    return html=`
        <p>Ecrivez votre message ici.</p>
        `
}

function getListeDemandePartenariat(e){
    document.querySelector(".content_chargement_liste_partenaire_nanta_js").innerHTML = `<div class="spinner-border spinner-border text-info" role="status">
        <span class="visually-hidden">Loading...</span>
    </div>`
    let linkActives = document.querySelectorAll("#navbarSuperAdmin > ul > li > a")
    linkActives.forEach(link=>{
        if(link.classList.contains("text-primary"))
            link.classList.remove("text-primary")
    })
    e.target.classList.add("text-primary")

    document.querySelector("#list-tribu-g").style.display = "none"
    // document.querySelector("#list-tribu-t").style.display = "none"
    document.querySelector("#list-demande-partenaire").style.display = "block"
    fetch("/user/liste/demande/partenariat")
        .then(response => response.json())
        .then(r => {
            console.log(r)
            document.querySelector(".content_chargement_liste_partenaire_nanta_js").innerHTML = ""
            let table = document.createElement("table")
            table.setAttribute("class", "table-responsive")
            let thead = document.createElement("thead")
            let tr = document.createElement("tr")
            let thFname = document.createElement("th")
            thFname.textContent = "Prénom"
            let thLname = document.createElement("th")
            thLname.textContent = "Nom"
            let thEmail = document.createElement("th")
            thEmail.textContent = "Email"
            let thTel = document.createElement("th")
            thTel.textContent = "Téléphone"
            let thAdresse = document.createElement("th")
            thAdresse.textContent = "Adresse"
            let thDetail = document.createElement("th")
            thDetail.textContent = "Voir Détail"
            let thValidate = document.createElement("th")
            thValidate.textContent = "Approuver"
            let tbody = document.createElement("tbody")

            tr.appendChild(thFname)
            tr.appendChild(thLname)
            tr.appendChild(thEmail)
            tr.appendChild(thTel)
            tr.appendChild(thAdresse)
            tr.appendChild(thDetail)
            tr.appendChild(thValidate)

            thead.appendChild(tr)
            table.appendChild(thead)
            table.appendChild(tbody)

            document.querySelector(".content_chargement_liste_partenaire_nanta_js").appendChild(table)            

            for (let i = 0; i < r.length; i++) {
                let trData = document.createElement("tr")
                trData.id = "user_" + r[i].userId.id
                let tdFname = document.createElement("td")
                tdFname.textContent = r[i].firstname
                let tdLname = document.createElement("td")
                tdLname.textContent = r[i].lastname
                let tdEmail = document.createElement("td")
                tdEmail.textContent = r[i].userId.email
                let tdTel = document.createElement("td")
                tdTel.textContent = r[i].telephone
                let tdAdresse = document.createElement("td")
                tdAdresse.textContent = r[i].numRue + " " +  r[i].codePostal + " " + r[i].commune
                let tdDetail = document.createElement("td")
                let tdValidate = document.createElement("td")
                let btnDetail = document.createElement("button")
                btnDetail.setAttribute("class", "btn btn-info")
                btnDetail.textContent = "Détail"
                btnDetail.dataset.valueIndex=i
                btnDetail.onclick=()=>{
                    $("#modalDetailListeDemandePartenaire").modal("show")
                    document.querySelector(".adresseD").innerHTML = ""
                    document.querySelector(".facebookD").innerHTML = ""
                    document.querySelector(".twitterD").innerHTML = ""
                    document.querySelector(".sirenD").innerHTML =""
                    document.querySelector(".linkedinD").innerHTML =""
                    document.querySelector(".websiteD").innerHTML = ""
                    document.querySelector(".nomCommerceD").innerHTML = ""
                    let fnameText = r[i].firstname != "" ? r[i].firstname : "Le partenaire n'a pas fourni cette information"
                    document.querySelector(".fnameD").textContent = fnameText
                    let lnameText = r[i].lastname != "" ? r[i].lastname : "Le partenaire n'a pas fourni cette information"
                    document.querySelector(".lnameD").textContent = lnameText
                    let emailProText = r[i].emailPro != "" ? r[i].emailPro : "Le partenaire n'a pas fourni cette information"
                    document.querySelector(".emailD").textContent = emailProText
                    let telProText = r[i].telephone != "" ? r[i].telephone : "Le partenaire n'a pas fourni cette information"
                    document.querySelector(".telD").textContent = telProText
                    let adrComplet = r[i].numRue + " " +  r[i].codePostal + " " + r[i].commune
                    if(adrComplet != ""){
                        let linkAdresse = document.createElement("a")
                        linkAdresse.href = `https://www.google.com/maps?q=${r[i].numRue + " " +  r[i].codePostal + " " + r[i].commune}`
                        linkAdresse.textContent = r[i].numRue + " " +  r[i].codePostal + " " + r[i].commune
                        linkAdresse.setAttribute("class","linkOndetail")
                        linkAdresse.setAttribute("target","_blanc")
                        document.querySelector(".adresseD").appendChild(linkAdresse)
                    }else{
                        document.querySelector(".adresseD").textContent = "Le partenaire n'a pas fourni cette information"
                    }
                    let commerceText = r[i].commerce != "" ? r[i].commerce : "Le partenaire n'a pas fourni cette information"
                    document.querySelector(".commerceD").textContent = commerceText
                    let codeapeText = r[i].codeape != "" ? r[i].codeape : "Le partenaire n'a pas fourni cette information"
                    document.querySelector(".codeapeD").textContent = codeapeText
                    
                    if(r[i].facebook || r[i].facebook != ""){

                        let linkFb = document.createElement("a")
                        linkFb.href = r[i].facebook
                        linkFb.setAttribute("class","linkOndetail")
                        linkFb.setAttribute("target","_blanc")
                        linkFb.textContent = r[i].facebook
                        document.querySelector(".facebookD").appendChild(linkFb)
                    }else{
                        document.querySelector(".facebookD").textContent = "Le partenaire n'a pas fourni cette information"
                    }

                    if(r[i].twitter || r[i].twitter != ""){

                        let linkTwitter = document.createElement("a")
                        linkTwitter.href = r[i].twitter
                        linkTwitter.setAttribute("class","linkOndetail")
                        linkTwitter.setAttribute("target","_blanc")
                        linkTwitter.textContent = r[i].twitter
                        document.querySelector(".twitterD").appendChild(linkTwitter)
                    }else{
                        document.querySelector(".twitterD").textContent = "Le partenaire n'a pas fourni cette information"

                    }

                    if(r[i].website || r[i].website != ""){

                        let linkWebSite = document.createElement("a")
                        linkWebSite.href = r[i].website
                        linkWebSite.setAttribute("class","linkOndetail")
                        linkWebSite.setAttribute("target","_blanc")
                        linkWebSite.textContent = r[i].website
                        document.querySelector(".websiteD").appendChild(linkWebSite)
                    }else{
                        document.querySelector(".websiteD").textContent = "Le partenaire n'a pas fourni cette information"

                    }

                    if(r[i].linkedin || r[i].linkedin != ""){

                        let linkLinkedin = document.createElement("a")
                        linkLinkedin.href = r[i].linkedin
                        linkLinkedin.setAttribute("class","linkOndetail")
                        linkLinkedin.setAttribute("target","_blanc")
                        linkLinkedin.textContent = r[i].linkedin
                        document.querySelector(".linkedinD").appendChild(linkLinkedin)
                    }else{
                        document.querySelector(".linkedinD").textContent = "Le partenaire n'a pas fourni cette information"

                    }

                    if(r[i].siren || r[i].siren != ""){

                        let linkSiren = document.createElement("a")
                        linkSiren.href = "https://www.pappers.fr/entreprise/"+r[i].siren
                        linkSiren.setAttribute("class","linkOndetail")
                        linkSiren.setAttribute("target","_blanc")
                        linkSiren.textContent = r[i].siren
                        document.querySelector(".sirenD").appendChild(linkSiren)
                    }else{
                        document.querySelector(".sirenD").textContent = "Le partenaire n'a pas fourni cette information"

                    }

                    let siretText = r[i].siret || r[i].siret != "" ? r[i].siret : "Le partenaire n'a pas fourni cette information"
                    document.querySelector(".siretD").textContent = siretText

                    if(r[i].nomCommerce || r[i].nomCommerce != ""){

                        let linkNomCommerce = document.createElement("a")
                        linkNomCommerce.href = "https://www.google.com/search?q="+r[i].nomCommerce
                        linkNomCommerce.setAttribute("class","linkOndetail")
                        linkNomCommerce.setAttribute("target","_blanc")
                        linkNomCommerce.textContent = r[i].nomCommerce
                        document.querySelector(".nomCommerceD").appendChild(linkNomCommerce)
                    }else{
                        document.querySelector(".nomCommerceD").textContent = "Le partenaire n'a pas fourni cette information"

                    }
                }
                let btnValidate = document.createElement("button")
                btnValidate.textContent = "Approuver"
                btnValidate.dataset.id = r[i].userId.id
                btnValidate.setAttribute("class", "btn btn-primary validatePartenariat")
                btnValidate.onclick =(event)=>{
                    
                    let useInformation = {
                        id : r[i].userId.id,
                        email : r[i].emailPro,
                        fullname : r[i].firstname + " " + r[i].lastname
                    }

                    sessionStorage.setItem("useInformation", JSON.stringify(useInformation))
                    acceptPropositionPartenariat(event)
                }
                tdDetail.appendChild(btnDetail)
                tdValidate.appendChild(btnValidate)

                trData.appendChild(tdFname)
                trData.appendChild(tdLname)
                trData.appendChild(tdEmail)
                trData.appendChild(tdTel)
                trData.appendChild(tdAdresse)
                trData.appendChild(tdDetail)
                trData.appendChild(tdValidate)
                tbody.appendChild(trData)
            }

            // $(table).DataTable({
            //     language: {
            //         url: '//cdn.datatables.net/plug-ins/1.13.4/i18n/fr-FR.json',
            //         "search": "Recherche global",
            //     },})
            // })

            var trHeadClone = $(tr).clone(true)
            console.log(trHeadClone)
            console.log(trHeadClone.children())
            for(let [key,child] of Object.entries(trHeadClone.children())){
                if(key >4){
                    console.log(key,child)
                    child.textContent=""
                }
            }
            // document.querySelector("#thead > tr.filters > th:nth-child(6)").textContent = ""
            // console.log($(trHeadClone).children().last())
            $(trHeadClone).addClass('filters').appendTo(thead);
            let limite = thead.querySelectorAll('tr:nth-child(2) > th').length
            $(table).DataTable({
                language: {
                    url: '//cdn.datatables.net/plug-ins/1.13.4/i18n/fr-FR.json',
                    "search": "Recherche global",

                },
                orderCellsTop: true,
                fixedHeader: true,
                initComplete: function () {
                    var api = this.api();
                    var i = 0;
                    // For each column
                    api.columns()
                        .eq(0)
                        .each(function (colIdx) {
                                if(i < limite-2 ){
                                    putSearshDataTableHeader(colIdx,api)
                                }

                            i++;
                        });
                }})
        });
}

function putSearshDataTableHeader(colIdx,api){
    // Set the header cell to contain the input element
    var cell = $('.filters th').eq(
        $(api.column(colIdx).header()).index()
    );
    var title = $(cell).text();

    $(cell).html('<input type="text" placeholder="Chercher ' + title + '" style="width:100%; font-size:1em" />');

    // On every keypress in this input
    $('input', $('.filters th').eq($(api.column(colIdx).header()).index()))
        .off('keyup change')
        .on('keyup change', function (e) {
            e.stopPropagation();

            // Get the search value
            $(this).attr('title', $(this).val());
            var regexr = '({search})'; //$(this).parents('th').find('select').val();

            var cursorPosition = this.selectionStart;
            // Search the column for that value
            api
                .column(colIdx)
                .search(
                    this.value != ''
                        ? regexr.replace('{search}', '(((' + this.value + ')))')
                        : '',
                    this.value != '',
                    this.value == ''
                )
                .draw();

            $(this)
                .focus()[0]
                .setSelectionRange(cursorPosition, cursorPosition);
        });
}

function sendEmailPropositionPartenariat(){

    makeLoadingDemandePartenariatEmail()

    let data = editor.getData()

    let dataEmail={
        emailCore:data,
        proposition:true,
        generateAuto:false,
        objectEmail : "Demande de proposition de partenariat"
    }

    let request =new Request("/proposition/partenariat/send/email",{
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataEmail)
    })


    fetch(request).then(r=>{
    
        if(r.status===200 && r.ok){
            deleteChargement("chargement_content");
            swal("Bravo !","Demande bien envoyée", "success")
                    .then((value) => {
                        $("#devenirPartenaireModal").modal("hide")
                });
        }else{
            deleteChargement("chargement_content");
            swal("Erreur !","Erreur 500", "error")
                    .then((value) => {
                        $("#devenirPartenaireModal").modal("hide")
                });
        }
    })

}

function acceptPropositionPartenariat(e) {

    e.target.dataset.isSelected = true

    const id = e.target.dataset.id
    swal({
        title: "Voulez vous approuver sa demande de partenariat?",
        // text: "Agenda supprimé avec succès !",
        icon: "info",
        buttons: {
            catch: {
                text:"Refuser",
                
                value:"cancel"
            },
            Accepter: true
          },
       
        dangerMode: false,
        // allowOutsideClick: false
    }) .then((value) => {
        switch (value) {
 
            case "cancel":{

                sessionStorage.setItem("statusDemande", false)

                const request = new Request('/accept/proposition/partenariat/0', {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ userId: id })
                })

                fetch(request)
                    .then(response =>{ 
                        if(response.status ==200 && response.ok ){

                            document.querySelector("#user_"+id).remove()

                            swal("Merci !", "Demande de partenariat refuser.", "success").then((value)=>{
                                    swal({
                                        title: "Voulez vous lui ecrire un email pour lui expliquez les raison du refus?",
                                        icon: "info",
                                        buttons: {
                                            catch: {
                                                text:"Non",
                                              
                                                value:"cancel"
                                            },
                                            Oui: true
                                          },
                                       
                                        dangerMode: false,
                                    }).then(value1=>{
                                        switch(value1){
                                            case "cancel":{

                                                let dataEmail={
                                                    generateAuto:true,
                                                    emailCore : "Désolé ! Votre demande de partenariat a été refusée",
                                                    objectEmail : "Demande de partenariat refusée"
                                                }

                                                let request =new Request("/proposition/partenariat/send/email",{
                                                    method: "POST",
                                                    headers: {
                                                        'Accept': 'application/json',
                                                        'Content-Type': 'application/json'
                                                    },
                                                    body: JSON.stringify(dataEmail)
                                                })
                                                fetch(request).then(r=>{
                                                    if(r.status=200 && r.ok){
                                                        swal("Info", `Le mail qui lui explique le refus a été envoyer et géné automatiquement par CMZ`, "success")
                                                    }
                                                })
                                                break
                                            }
                                            case "Oui":{

                                                $("#reponsePartenaireModal").modal("show")

                                                break
                                            }

                                            default:{
                                               
                                                break
                                            }
                                        }
                                    })
                            })
                        }
                    })
                break;
            }
            case "Accepter":{

                sessionStorage.setItem("statusDemande", true)

                const request = new Request('/accept/proposition/partenariat/1', {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ userId: id })
                })

                fetch(request)
                    .then(response => {

                        if(response.status ==200 && response.ok ){
                            document.querySelector("#user_"+id).remove()
                            /*swal("Merci !", "Demande de partenariat approuvée", "success").then((value)=>{

                            })*/

                                swal("Merci !", "Demande de partenariat approuvée", "success").then((value)=>{
                                swal({
                                    title: "Voulez vous lui ecrire un email?",
                                    icon: "info",
                                    buttons: {
                                        catch: {
                                            text:"Non",
                                          
                                            value:"cancel"
                                        },
                                        Oui: true
                                      },
                                   
                                    dangerMode: false,

                                }).then(value1=>{
                                    switch(value1){
                                        case "cancel":{

                                            let dataEmail={
                                                generateAuto:true,
                                                emailCore : "Bravo ! Votre demande de partenariat a été acceptée",
                                                objectEmail : "Demande de partenariat acceptée"
                                            }

                                            let request =new Request("/proposition/partenariat/send/email",{
                                                method: "POST",
                                                headers: {
                                                    'Accept': 'application/json',
                                                    'Content-Type': 'application/json'
                                                },
                                                body: JSON.stringify(dataEmail)
                                            })
                                            fetch(request).then(r=>{
                                                if(r.status=200 && r.ok){
                                                    swal("Info", `Le mail qui lui explique le refus a été envoyer et géné automatiquement par CMZ`, "success")
                                                }
                                            })
                                            break
                                        }
                                        case "Oui":{

                                            $("#reponsePartenaireModal").modal("show")

                                            break
                                        }

                                        default:{
                                           
                                            break
                                        }
                                    }
                                })
                        })

                        }
                    })
                

                break;
            }
            default:{
                swal("Merci !", "Vous n'avez pas encore decidé, revenez plus tard.", "warning").then((value)=>{

                })
            }
            
          }
    })
}

function sendFeedBackForPartenariat(){

    makeLoadingDemandePartenariatEmail()

    let data = editor.getData()

    let useInformationStr = sessionStorage.getItem("useInformation")
    let useInformationObject = JSON.parse(useInformationStr)
    let email = useInformationObject.email
    let fullname = useInformationObject.fullname
    let objectEmail = "Demande de partenariat refusée"
    let statusDemande = sessionStorage.getItem("statusDemande")
    if(JSON.parse(statusDemande)){
        objectEmail = "Demande de partenariat acceptée"
    }

    let dataEmail={
        fullname : fullname,
        email : email,
        emailCore:data,
        proposition:false,
        generateAuto:false,
        objectEmail : objectEmail
    }

    let request =new Request("/proposition/partenariat/send/email",{
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataEmail)
    })

    fetch(request).then(r=>{
        if(r.status=200 && r.ok){
            swal("Info", `Le mail qui lui explique le refus a été envoyée`, "success")
            .then((value)=>{
                $("#reponsePartenaireModal").modal("hide")
            })
        }
    })
}


function reorganisePastille(){
   let container=document.querySelector(".mainContainerLogoTribu") 
//    let ratio=(container.querySelectorAll(".img_nantenaina").length)/5
//    container.style.width=(43*3)+"px"
    let i=0
    let j = 0;

    let imLength = container.querySelectorAll(".img_nantenaina").length
    if(imLength> 5)
        document.querySelector(".iconePlus_nanta_js").classList.remove("d-none")

   Array.from(container.querySelectorAll(".img_nantenaina")).forEach(item=>{
      let bRect= item.getBoundingClientRect()
      let itemWidth=bRect.width;
      item.style.zIndex = 4 - j
      i+= itemWidth
      if(imLength > 4)
        if(j>0)
            item.style.marginLeft = "-10px"
      j++
      container.style.width=i+"px"
   })

}

function showNextImage(){
    let mainContainerLogoTribu = document.querySelector(".mainContainerLogoTribu")
    let mLeft = mainContainerLogoTribu.style.marginLeft - 35
    mainContainerLogoTribu.style.marginLeft = mLeft + "px"   
}

function agrandirImage(ev){
   console.log(ev.target)
   ev.target.style="transform:scale(1.2)"
}

function resetImage(ev){
    console.log(ev.target)
    ev.target.style="transform:scale(1)"
 }

function createPopUp(ev){
    let tribuName = ev.target.dataset.name
    console.log(ev)
    $("#modalCreatePopUp").modal("show")
    console.log(document.querySelector("#modalCreatePopUp"))
    document.querySelector("#modalCreatePopUpLabel").textContent = "Tribu T " + tribuName
    document.querySelector("#modalCreatePopUp .textInfos").textContent = "Ce restaurant est pastillé par la tribu " + tribuName
    document.querySelector("#modalCreatePopUp .tbtName").textContent = tribuName
}

function showLogoAndNameTribus(){
    let modalBody = document.querySelector("#modalShowTribusInfos .modal-body")
    modalBody.innerHTML = ""
    $("#modalShowTribusInfos").modal("show")
    let allTribusT = document.querySelectorAll(".img_nantenaina > img")
    
    allTribusT.forEach(tribu=>{
        modalBody.innerHTML += `<div class="divContainerImgOnModal mb-3"><div><img onclick="createPopUp(event)" src="${tribu.src}" alt="${tribu.dataset.name}" data-name="${tribu.dataset.name}" data-bs-dismiss="modal"></div><div class="tribuTName" onclick="createPopUp(event)" data-name="${tribu.dataset.name}" data-bs-dismiss="modal"> ${tribu.dataset.name}</div></div>`
    })
}
