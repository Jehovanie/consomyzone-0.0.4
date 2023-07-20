window.addEventListener('load', () => {

	/*format numero*/
	// let items = document.querySelector("#content-details-ferme > div > div.left_content_home > div > div > div.content_tel > ul > li")
	let items = document.querySelectorAll("body > main > div.content_global > div > div > div.left_content_home > div > div > div.content_tel > ul > li")
	if( items.length > 0 ){
		items.forEach(item => {
			let r = item.textContent.replace(/[^0-9]/g, "").split("")
			let num = `+33 ${r[0]} ${r[1]}${r[2]} ${r[3]}${r[4]} ${r[5]}${r[6]} ${r[7]}${r[8]} `
			console.log(num)
			item.textContent = item.textContent.replace(/[0-9]/g, "")+" "+num
		})
	}

	//// HIDE DETAILS STATION POP UP
	document.querySelector("#close-detail-ferme").addEventListener("click", () => { 
		document.getElementById("remove-detail-ferme").setAttribute("class", "hidden")
	})


    /**
     * @author tommy
     * 
     * delete fiche created by user suppliers  
     * 
     */
    if( document.querySelectorAll(".suppr-etab")){
        document.querySelectorAll(".suppr-etab").forEach((element) => {
            element.addEventListener("click", (event) => {
                const currentUserId = parseInt(event.target.dataset.token.split(":")[2].split("\.")[1].replace(/[^0-9]/g, ""), 10)
                const currentCard = event.target.parentNode.parentNode.parentNode
                console.log(currentCard)
                const formBody = "id=" + encodeURIComponent(currentUserId)
                fetch('/delete-etab', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                    },
                    body: formBody
                    }).then(response => {
                        if (response.ok) {
                            //currentCard.style = "transition:2s ease-in-out; transform: translateX(-25px); opacity: 0;"
                            currentCard.parentNode.removeChild(currentCard)
                        }
                })
            })
        })
    }

    /**
     * @author tommy
     */
    if(document.querySelectorAll(".modif-etab")){
        document.querySelectorAll(".modif-etab").forEach((element) => {
            element.addEventListener("click", (event) => {
                const idFerme = parseInt(event.target.dataset.token.split(":")[2].split("\.")[1].replace(/[^0-9]/g, ""), 10)
                sessionStorage.setItem("fff", idFerme)
            })
        })
    }

    
    if(document.querySelector(".name_ferme_js_jheo")){
           pagginationModule(".content_list_ferme_spec_js_jheo",".name_ferme_js_jheo",10)
    }
});