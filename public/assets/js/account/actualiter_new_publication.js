if( document.querySelector('.publication_type_jheo_js')){
    document.querySelector('.publication_type_jheo_js').addEventListener('change',(e)=> {
        if( e.target.value === "Tribu T"){
            if(document.querySelectorAll(".select_tribuT_jheo_js option").length > 0 ){
                document.querySelector('.content_tribuT_select_jheo_js').classList.remove("d-none")
            }else{
                document.querySelector('.content_infoTribuT_jheo_js').classList.remove("d-none")
                document.querySelector('.submit_new_publication_jheo_js').setAttribute("disabled", "");
            }
        }else{
            if(!document.querySelector('.content_tribuT_select_jheo_js').classList.contains("d-none")){
                document.querySelector('.content_tribuT_select_jheo_js').classList.add("d-none")
            }
            if(!document.querySelector('.content_infoTribuT_jheo_js').classList.contains("d-none")){
                document.querySelector('.content_infoTribuT_jheo_js').classList.add("d-none")
            }

            if(document.querySelector('.select_tribuT_jheo_js').value){
                document.querySelector('.select_tribuT_jheo_js').value= null;
            }

            if(document.querySelector('.submit_new_publication_jheo_js').attributes.disabled){
                document.querySelector('.submit_new_publication_jheo_js').removeAttribute("disabled");
            }
        }
    })
}


//// delete the all input in form is the user cancelled the publication.
if(document.querySelector('.annulation_pub_actualite_js_jheo')){

    const cancelPubCta= [ document.querySelector('.annulation_pub_actualite_js_jheo'),document.querySelector('.btn_close_pub_jheo_js') ];

    cancelPubCta.forEach((cta) => {
        cta.onclick = () => {
            document.querySelector('.message_textarea_jheo_js').value = null 
            document.querySelector(".image_upload_input_jheo_js").value = null
            document.querySelector(".select_tribuT_jheo_js").value = null
        }
    })
}


if( document.querySelector('.submit_new_publication_jheo_js')){
    const msg_input= document.querySelector('.message_textarea_jheo_js')
    const photo_input= document.querySelector('.image_upload_input_jheo_js')

    document.querySelector('.submit_new_publication_jheo_js').addEventListener('click', (e) =>{
        if( msg_input.value.trim().length === 0 && photo_input.value.trim().length === 0 ){
            e.preventDefault();
            msg_input.className += 'border border-danger'
            photo_input.className += 'border border-danger'
        }
    })

    msg_input.addEventListener('input' , () => { deletBorderDanger(msg_input) })
    photo_input.addEventListener('change' , () => { deletBorderDanger(photo_input) })
    
    function deletBorderDanger(item){
        if(item.classList.contains('border-danger')){
            item.classList.remove('border-danger')
        }
    }
}
