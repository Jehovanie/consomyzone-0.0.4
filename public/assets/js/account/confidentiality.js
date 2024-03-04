let confidCompteNantaElems = document.querySelectorAll("#confid_compte > .confid_compte_nanta_js")
confidCompteNantaElems.forEach(element => {
    let cleConf = element.classList.contains("content-confid-email") ? "email" : 
                    (element.classList.contains("content-confid-fname") ? "firstname" :
                        (element.classList.contains("content-confid-adresse") ? "adresse" :
                            (element.classList.contains("content-confid-phone") ? "phone_number" : 
                                (element.classList.contains("content-confid-lname") ? "lastname" :
                                    (element.classList.contains("content-confid-badgeFan") ? "badgeFan" : 
                                        (element.classList.contains("content-confid-badgeDonBleu") ? "badgeDonateurBleu" : 
                                            (element.classList.contains("content-confid-badgeDonVert") ? "badgeDonateurVert" : 
                                                element.classList.contains("content-confid-badgeActionnaire") ? "badgeActionnaire" : "not"
                                            )
                                        )
                                    )
                                )
                            )
                        )
                    )

    let radioConfs = element.querySelectorAll("input[type=radio]")
    radioConfs.forEach(item => {
        item.addEventListener("click", (e) => {
            let parentElement = e.target.parentElement.parentElement
            let contentCollapseTribu = parentElement.querySelector(".content-confid-tribu")
            console.log(contentCollapseTribu);
            if(e.target.dataset.rank == 0){
                if(contentCollapseTribu.classList.contains("show"))
                    contentCollapseTribu.setAttribute("class","mt-4 collapse content-confid-tribu")
            
                updatePrincipalConfidentiality(cleConf, 1, 0, 0)
            }else if(e.target.dataset.rank == 1){
                if(contentCollapseTribu.classList.contains("show"))
                    contentCollapseTribu.setAttribute("class","mt-4 collapse content-confid-tribu")
                
                updatePrincipalConfidentiality(cleConf, 0, 1, 0)
            }else if(e.target.dataset.rank == 2){
                updatePrincipalConfidentiality(cleConf, 0, 0, 1)
            }
        })
    });

    let tribuConf = element.classList.contains("content-confid-email") ? "is_public_email" : 
                    (element.classList.contains("content-confid-fname") ? "is_public_firstname" :
                        (element.classList.contains("content-confid-adresse") ? "is_public_adresse" :
                            (element.classList.contains("content-confid-phone") ? "is_public_phone_number" : 
                                (element.classList.contains("content-confid-lname") ? "is_public_lastname" : 
                                    (element.classList.contains("content-confid-badgeFan") ? "is_public_badge_fan" : 
                                        (element.classList.contains("content-confid-badgeDonBleu") ? "is_public_badge_don_bleu" : 
                                            (element.classList.contains("content-confid-badgeDonVert") ? "is_public_badge_don_vert" : 
                                                element.classList.contains("content-confid-badgeActionnaire") ? "is_public_badge_actionnaire" : "not"
                                            )
                                        )
                                    )
                                )
                            )
                        )
                    )

    let checkboxConfs = element.querySelectorAll("input[type=checkbox]")
    checkboxConfs.forEach(item => {
        item.addEventListener("click", (e) => {
            let valeur = e.target.checked ? 1 : 0 
            updateTribuConfidentiality(e.target.dataset.boum, tribuConf, valeur)
        })
    });

});

function updatePrincipalConfidentiality(cle,is_private, is_public, is_tribu){

    let data = {
        cle : cle,
        is_private : is_private,
        is_public : is_public,
        is_tribu : is_tribu
    }

    console.log(data);

    fetch("/user/update/principal/visibility", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
    .then(response=>{
        if(response.status=200 && response.ok){
          response.json().then(result=>{
            console.log(result);
          })
        }
    })
}

function updateTribuConfidentiality(tribu, colonne, valeur){

    let data = {
        tribu : tribu,
        colonne : colonne,
        valeur : valeur
    }

    console.log(data);

    fetch("/user/update/tribu/visibility", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
    .then(response=>{
        if(response.status=200 && response.ok){
          response.json().then(result=>{
            console.log(result);
          })
        }
    })
}

document.querySelector("#setting_pseudo").addEventListener("input", (e)=>{
    fetch("/is/available/"+e.target.value)
    .then((res) => res.json())
    .then((data) => {
      let pseudo_checked = document.querySelector(".pseudo_checked")
      if(data.result > 0){
          pseudo_checked.textContent = "Pseudo non disponible"
          pseudo_checked.setAttribute("class","text-danger text-sm input-not-valid pseudo_checked blocked")
      }else{
        pseudo_checked.textContent = "Pseudo disponible"
        pseudo_checked.setAttribute("class","text-success text-sm input-not-valid pseudo_checked")
        // setTimeout(()=>{
        //   pseudo_checked.setAttribute("class","text-danger text-sm input-not-valid d-none pseudo_checked")
        // },3000)
      }
      
    })
});

document.querySelector(".nanta_submit_js").addEventListener("click",(e)=>{
    if(document.querySelector(".pseudo_checked.blocked")){
        e.preventDefault();
        swal("Attention!", "Le pseudo n'est plus disponible. Veuillez modifier s'il vous plaît.", "error");
    }
})

function closeParentList(e){
    if(e.parentElement.classList.contains("show"))
        e.parentElement.setAttribute("class","mt-4 collapse content-confid-tribu")
}