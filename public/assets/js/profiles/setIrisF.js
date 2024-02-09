///profile selection
const input_hidden_profil = document.querySelector("#inscription_filleul_profil");
const img_profil = document.querySelector(".image_profil_js_jheo");
const fake_input_profil = document.querySelector("#fileInputProfil");

fake_input_profil.addEventListener("change", (e) => {
  ///read file
  const reader = new FileReader();
  ////on load file
  reader.addEventListener("load", (e) => {
    /// file as url
    const uploaded_image = reader.result;
    img_profil.setAttribute("src", uploaded_image);
    input_hidden_profil.value = uploaded_image;
  });

  ///run event load in file reader.
  reader.readAsDataURL(e.target.files[0]);
});

if (document.querySelector(".btn_submit_inscription_js")) {
  const submit_inscription = document.querySelector(
    ".btn_submit_inscription_js"
  );
  submit_inscription.addEventListener("click", (e) => {
    const nom = document.querySelector("#inscription_filleul_nom")
    const prenom = document.querySelector("#inscription_filleul_prenom")
    const telephone = document.querySelector("#inscription_filleul_telephone")
    const pseudo = document.querySelector("#inscription_filleul_pseudo")
    const email = document.querySelector("#inscription_filleul_email")
    const pw = document.querySelector("#inscription_filleul_password")
    const confirmpw = document.querySelector("#inscription_filleul_confirm_password")
    const tableTemp = [
      nom,
      prenom,
      telephone,
      pseudo,
      email,
      pw,
      confirmpw
    ];

    if (tableTemp.some((item) => item.value === "")) {
      let nom_required = document.querySelector(".nom_required")
      let prenom_required = document.querySelector(".prenom_required")
      let tel_required = document.querySelector(".tel_required")
      let pseudo_required = document.querySelector(".pseudo_required")
      let email_required = document.querySelector(".email_required")
      let pw_required = document.querySelector(".pw_required")
      let pwconfirm_required = document.querySelector(".pwconfirm_required")
      e.preventDefault();
      if (nom.value === "") {
          nom_required.classList.remove("d-none")
      }
      if (prenom.value === "") {
        prenom_required.classList.remove("d-none")
      }
      if (telephone.value === "") {
        tel_required.classList.remove("d-none")
      }

      if (pseudo.value === "") {
        pseudo_required.classList.remove("d-none")
      }
      if (email.value === "") {
        email_required.classList.remove("d-none")
      }
      if (pw.value === "") {
        pw_required.classList.remove("d-none")
      }
      if (confirmpw.value === "") {
        pwconfirm_required.classList.remove("d-none")
      }

      setTimeout(()=>{
        document.querySelectorAll(".input-not-valid").forEach(item=>{
          if(!item.classList.contains("d-none"))
            item.classList.add("d-none")
        })
      },3000)

    }else{
      let pw_not_identique = document.querySelector(".pw_not_identique")
      if(pw.value != confirmpw.value){
        e.preventDefault();
        pw_not_identique.classList.remove("d-none")
      }

      if(!document.querySelector(".pseudo_checked").classList.contains("d-none")){
        e.preventDefault();
      }else{
        setTimeout(()=>{
          document.querySelectorAll(".input-not-valid").forEach(item=>{
            if(!item.classList.contains("d-none"))
              item.classList.add("d-none")
          })
        },3000)
      }

    }
  });
}

function addNumeroOptionGeo() {
  const target = document.querySelector("#inscription_filleul_telephone");
  intlTelInput(target, {
    initialCountry: "auto",
    geoIpLookup: (callback) => {
      fetch("https://ipapi.co/json")
        .then((res) => res.json())
        .then((data) => callback(data.country_code))
        .catch(() => callback("us"));
    },
    utilsScript: "/assets/js/intelTelInput/utils.js",
  });
}

document.querySelector("#inscription_filleul_pseudo").addEventListener("change", (e)=>{
  fetch("/is/pseudo/"+e.target.value)
  .then((res) => res.json())
  .then((data) => {
    console.log(data)
    let pseudo_checked = document.querySelector(".pseudo_checked")
    if(data.result > 0){
        pseudo_checked.textContent = "Pseudo non disponible"
        pseudo_checked.setAttribute("class","text-danger text-sm input-not-valid pseudo_checked")
    }else{
      pseudo_checked.textContent = "Pseudo disponible"
      pseudo_checked.setAttribute("class","text-success text-sm input-not-valid pseudo_checked")
      document.querySelector(".pseudoTexte").innerHTML = e.target.value
      setTimeout(()=>{
        pseudo_checked.setAttribute("class","text-danger text-sm input-not-valid d-none pseudo_checked")
      },3000)
    }
    
  })
});

addNumeroOptionGeo()
