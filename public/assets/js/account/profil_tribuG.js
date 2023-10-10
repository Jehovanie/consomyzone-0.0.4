if( document.querySelector("#fileInputTribu")){
    const input_photo = document.querySelector("#fileInputTribu");
    const tribuG_profil = document.querySelector("#profilTribu");

    input_photo.addEventListener("change",(e) => {

        ///read file
        const reader = new FileReader();

        ///run event load in file reader.
        reader.readAsDataURL(e.target.files[0]);

        ////on load file
        reader.addEventListener("load", () => {
            /// file as url
            const uploaded_image = reader.result;

            //// for the content image above the input message
            tribuG_profil.setAttribute("src", uploaded_image);
            changePhotoProfileTribuG(uploaded_image)
        });
    })
}

function changePhotoProfileTribuG(image_file){

    fetch("/users/acount/tribuG/changeprofile", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            image: image_file
        })
    }).then(response => {
        console.log(response)
        return response.json()
    }).then(response => {
        console.log(response)
    })
}