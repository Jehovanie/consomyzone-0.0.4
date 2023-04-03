document.querySelectorAll(".pdp-actif").forEach(item => {
    //console.log(item.querySelector(".nom"))
    
    item.onmouseover = (event) => {
        getMousePos(event.clientX,event.clientY)
        let nom = "" 
        let imagePath =""
        try {
            nom = event.target.parentNode.querySelector(".nom").textContent
            imagePath = event.target.parentNode.querySelector(".img-pdp").src
            // console.log("src "+imagePath)
        } catch (error){
            nom = event.target.parentNode.parentNode.textContent
            imagePath = event.target.parentNode.parentNode.querySelector(".img-pdp").src
        }
        
        createTooltip(nom,event.clientX,event.clientY,imagePath)
        // console.log(nom)
    }
    
   
})
document.querySelectorAll(".pdp-actif").forEach(item => { 
    item.onmouseout = () => {
        if (document.querySelector(".tltp") != null) {
           		document.querySelector("body > main > div.row.account").removeChild(document.querySelector(".tltp")) 
        }
         
    
    }

});

document.querySelectorAll("i.fa-solid.fa-file-import").forEach(item=>{
    item.onclick = ()=>{
        document.querySelector(".first-input").click()
    }
})

function createTooltip(nom,clientX,clientY,imagePath) {
    let divCard = document.createElement("div") 
    let divRow = document.createElement("div") 
    let divCol1 = document.createElement("div")
    let divCol2 = document.createElement("div")
    let img = document.createElement("img")
    
    img.src = imagePath
    divCol1.appendChild(img)
    divCard.style.position = 'absolute';
    divCard.style.top = (clientY-200)+"px";
    divCard.style.left = (clientX-350)+"px";
    divCol2.innerHTML=`<span>${nom}</span>`
    divCard.setAttribute("class", "card card-hover tltp")
    divRow.setAttribute("class", "row")
    divCol1.setAttribute("class", "col img-profile")
    divCol2.setAttribute("class", "col col-nom")

    divCard.appendChild(divRow)
    divRow.appendChild(divCol1)
    divRow.appendChild(divCol2)
    //divCard.appendChild(divCol1)
    //divCard.appendChild(divCol2)
    document.querySelector("body > main > div.row.account").appendChild(divCard)
    
}

function getMousePos(clientX,clientY) {
    console.log(`clientx ${clientX} clientY ${clientY}`)
}

// <img  id="prevg"  src="" alt="" height="50">
function show(event){

    const reader = new FileReader();
    reader.addEventListener("load", () => {
        const uploaded_image = reader.result; 
        const widthIncriment= 100
        const attachement = document.querySelector(".attachement")
        //   console.log(attachement.getBoundingClientRect().width+ widthIncriment)
        attachement.style.width =(attachement.getBoundingClientRect().width+ widthIncriment)*1.5+"px"
        let img = document.createElement("img")
        let div = document.createElement("div")
        div.setAttribute("class", "img-card")
        

        img.src = uploaded_image
        img.style = " width: 65px;height: 50px;border-radius: 5px; display:inline-block"
        div.appendChild(img)

        
        attachement.appendChild(div)
        //const imageSize = document.querySelectorAll(".img-card").length
        
        document.querySelector(".text-chat").classList.remove("down")
        document.querySelector(".text-chat").classList.add("up")
        document.querySelector("#file-container-js").style="display:inline;"
        //   document.querySelector("#prevg").src = uploaded_image;
  }, false);
    // console.log(event.target.files[0])
  reader.readAsDataURL(event.target.files[0]);
}


