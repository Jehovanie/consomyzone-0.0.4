const IS_DEV_MODE= false;
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

CKEDITOR.ClassicEditor.create(document.getElementById("editor"), {
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
    let html=showModalEditor()
    editor.setData(html)
});
function showModalEditor(isG, isListeInfile=false){
    let fullname = document.querySelector(".use-in-agd-nanta_js_css").textContent.trim()
    if(isListeInfile){
        document.querySelector("#btnValidate").removeAttribute("data-g")
        document.querySelector("#btnValidateMessage").removeAttribute("data-g")
        document.querySelector("#btnValidateMessage").style.display = "none"
    }else{
        document.querySelector("#btnValidateMessage").style.display = "block"
        document.querySelector("#btnValidate").dataset.g = isG
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

