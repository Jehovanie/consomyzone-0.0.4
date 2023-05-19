
let curent_location = window.location.href;

/**
* Set active click button
*/
function removeActiveLink(){

    document.querySelectorAll("#nav_menu_profil > div").forEach(menu=>{
            menu.classList ="px-3";
        })
}

/**
* Show photos gallery profil
*/
function showGalleryProfil(){
    document.querySelectorAll(".apropos_profil").forEach(elem=>{
        elem.style= "display:none;"
    })

    removeActiveLink()

    document.querySelector("#gallery-item").classList ="px-3 border-bottom border-primary";

    document.querySelector("#gallery_profil").style ="display:block;width:100%;";

    setGallerie(document.querySelectorAll("#gallery img"))
}

function showAboutProfil(){
    document.querySelectorAll(".apropos_profil").forEach(elem=>{
        elem.style= "display:block;"
    })

    removeActiveLink()

    document.querySelector("#about-item").classList ="px-3 border-bottom border-primary";

    document.querySelector("#gallery_profil").style ="display:none;width:100%;";
}

/**
* Upload photos
*/
//let fileInputProfil = document.querySelector("#fileInputProfil_add");

    
document.querySelector("#fileInputProfil_add").addEventListener("change", (e) => {

removeActiveLink()
document.querySelector("#add-item").classList ="px-3 border-bottom border-primary";
///read file
const fileReader = new FileReader();

////on load file
fileReader.addEventListener("load", () => {

    let data = {
        image : fileReader.result
    }

    fetch(new Request("/user/profil/add/photo", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })).then(x => x.json()).then(response => {
        location.href = "#photos"
        location.reload()
        console.log(response)
        });

});

///run event load in file reader.
fileReader.readAsDataURL(e.target.files[0]);


})

if(curent_location.includes("#photos")){
    showGalleryProfil();
}
if(curent_location.includes("#apropos") || !curent_location.includes("#")){
    showAboutProfil()
}

/*function setPhotoTribu(btn_photo){

    if(btn_photo.tagName != "IMG"){
        document.querySelector("#img_modal").src = btn_photo.querySelector("img").src
    }else{
        document.querySelector("#img_modal").src = btn_photo.src
    }
    
}*/