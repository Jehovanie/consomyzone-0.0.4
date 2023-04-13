if( document.querySelector("#inscription_nom_commune")){

    //// user input
    const input_codePostal = document.querySelector("#inscription_code_postal");

    //// dedecter et selectionner 
    const input_commune = document.querySelector("#inscription_nom_commune");
    const content_options_communes = document.querySelector("#inscription_faux_commune");

    //// dedecte et sélectionner
    const input_quartier = document.querySelector("#inscription_quartier");
    const content_options_quartier = document.querySelector("#inscription_faux_quartier");

    ///set departement
    const input_hidden_departement = document.querySelector("#inscription_departement");
    
    // input_commune.addEventListener("input", () => {
    //     const user_input = document.querySelector("#inscription_nom_commune").value;
        
    //     const all_iris = t.filter((item) => {
    //         // {d:"01",dr:"010010000",c:1,i:"l abergement clemenciat",co:"l abergement clemenciat"}
    //         //{d:"13",dr:"132010102",c:0,i:"thubaneau",co:"marseille 1er arrondissement"}
    //         if( user_input.split(" ").join("").toLowerCase() === item.co.split(" ").join("").toLowerCase() && item.c === 0  ){
    //         // if( item.co.split(" ").join("").toLowerCase().includes(user_input.split(" ").join("").toLowerCase()) && item.c === 0  ){
    //             return item.i;
    //         }
    //     })

    const input_hidden_profil = document.querySelector("#inscription_profil");
    const img_profil = document.querySelector(".image_profil_js_jheo");
    const fake_input_profil = document.querySelector("#fileInputProfil");


    ///get all Commune 
    fetch("/api/getAllCommune")
    .then(response => {
        if( !response.ok || response.status != 200){
            throw new Error("ERROR : " + response.status);
        }
        return response.json();
        /// object list of the commune
    })
    .then(response => { //// { commune: []}

        const commune = response.commune // [{ codeInsee : "" , codePostal : "" , commune : "" , dep :"" , id : "", typecom : "" }, ... ]
        
        ///when input
        input_codePostal.addEventListener("input", (e) => {     
            ///delete border red 
            input_codePostal.style.border = "";

            ///delete old value and set there to disable until user set code postal
            deleteOption("inscription_faux_commune") /// id content_options for commune
            deleteOption("inscription_faux_quartier") /// id content_options for quartier

            ////get list commune related with the code postal
            const list_options_commune = commune.filter(item => e.target.value === item.codePostal);
            
            /// if there is more 
            if( list_options_commune.length > 0 ){

                ///set input commun active
                input_commune.disabled = false;
                
                ///put all options input
                list_options_commune.forEach(({ commune , dep  }) => {
                    /// create single option
                    createAndAddOption(commune,content_options_communes) /// value, parents
                    input_hidden_departement.value = dep;
                })

                ///if the user set unvalid code postal
            }else{
                input_codePostal.style.border = "1px solid red";
            }
        })

        ///when commmune setting
        content_options_communes.addEventListener("change", (e) => {

            //// active input quartier
            input_quartier.disabled = false;

            ////get more information about this commune selected
            const commune_valid = commune.find(({ commune }) => commune === e.target.value )

            if( commune_valid){

                ////get list quartie related with the commune
                const list_options_quartier = t.filter(item => item.dr.substring(0,5) === commune_valid.codeInsee)

                //nput_quartier.value = content_options_communes.value

                /// if there is more quartier
                if( list_options_quartier.length > 0 ){
                    list_options_quartier.forEach(item => {
                        console.log(item)
                        
                        createAndAddOption(item.co + " " + item.i, content_options_quartier )
                        
                    })
                }
            }
            
        })

    })
    .catch(error => {
        console.log(error)
    })

    fake_input_profil.addEventListener( 'change', (e) => {

        ///read file
        const reader = new FileReader();
        ////on load file
        reader.addEventListener("load", (e) => {
            /// file as url
            const uploaded_image = reader.result;
            img_profil.setAttribute('src', uploaded_image);
            input_hidden_profil.value = uploaded_image;
        });

        ///run event load in file reader.
        reader.readAsDataURL(e.target.files[0]);
        
    }) 


    
}

function createAndAddOption(value , parent){
    const option = document.createElement("option");
    option.textContent = value;

    parent.appendChild(option);
}

function deleteOption(content_options){
    document.querySelectorAll("input[list]").forEach( i => {
        i.value=null
        i.disabled=true
    });
    const parent = document.querySelector("#" + content_options);
    if(parent.querySelectorAll("option")){
        parent.querySelectorAll("option")?.forEach( i => i.remove());
    }
    
   
}

// function closeAutoCompletion() {
//     document.querySelector(".content_autocompletion_js_jheo").removeChild(document.querySelector(".autocomplete_list"))
// }


// function autocompleteList(dom_parent, all_iris ){
//     const div_content = document.createElement("div")
//     div_content.classList.add("autocomplete_list")

//     ///{d:"01",dr:"010040101",c:0,i:"les perouses triangle d activites",co:"amberieu en bugey"}
//     all_iris.forEach(item => {
//         const valueUnique ="tribug_" + item.d + "_" + item.i.split(" ").map(l => l.toLowerCase()).join("-") + "_" + item.co.split(" ").map(t => t.toLowerCase()).join("-") 
        
//         const div_content_option = document.createElement("div")
//         div_content_option.classList.add(valueUnique)

//         const span = document.createElement("span")
//         span.innerText = item.i + " " + item.co;

//         const input = document.createElement("input")
//         input.setAttribute("id" , valueUnique+ "_input");
//         input.setAttribute("class" , item.d);
//         input.setAttribute("type" , "hidden");
//         input.setAttribute("value" , item.i + " " + item.co );

//         div_content_option.appendChild(span)
//         div_content_option.appendChild(input)

//         div_content.appendChild(div_content_option);
//     })

//     dom_parent.appendChild(div_content);
// }

// function processingAutoComplet(){
//     const div = document.querySelectorAll(".autocomplete_list div")
//     div.forEach(d => {
//         d.addEventListener("click", () => {
//             const className = d.getAttribute("class");
//             // alert(d.querySelector("#" + className + "_input").value)

//             document.querySelector("#inscription_nom_commune").value = document.querySelector("#" + className + "_input").value
//             document.querySelector("#inscription_departement").value = document.querySelector("#" + className + "_input").getAttribute("class")

//             closeAutoCompletion();
//         })
//     })
// }