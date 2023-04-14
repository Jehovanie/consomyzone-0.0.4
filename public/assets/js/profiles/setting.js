
///checkbox consommateur et Fournisseur
let togg1 = document.getElementById("inscription_Consommateur");
let togg2 = document.getElementById("inscription_Fournisseur");

// const tabCheckbox = [togg1, togg2 ];

// tabCheckbox.forEach(checkbox => {
//     checkbox.addEventListener("click", () => {
//         const otherCheckbox = tabCheckbox.find(item => item != checkbox);

//         if(checkbox.checked){
//             otherCheckbox.checked = false;
//         }else{
//             otherCheckbox.checked = true;
//         }
//     })
// })

togg1.addEventListener("click", (e) => {
    if(togg1.checked){
        togg2.checked = false;
        // togg1.checked = false;
    }else{
        togg2.checked = true;
        
    }

    if(!document.getElementById('fournisseur-input').classList.contains("fournisseur-hide")){
        document.getElementById('fournisseur-input').classList.toggle("fournisseur-hide")
    } 
})
togg2.addEventListener("click", (e) => {

    if(togg2.checked){
        togg1.checked = false;
        // togg1.checked = false;
    }else{
        togg1.checked = true;
    }
    if(document.getElementById('fournisseur-input').classList.contains("fournisseur-hide")){
            document.getElementById('fournisseur-input').classList.toggle("fournisseur-hide")
    } 
})

/*function togg(){
    if(getComputedStyle(d2).display != "none"){
        d2.style.display = "none";
    } else {
        d2.style.display = "block";
    }
};
togg2.onclick = togg;*/