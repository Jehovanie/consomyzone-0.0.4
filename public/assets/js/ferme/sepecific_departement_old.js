window.addEventListener('load', () => {

	let tabArray

	console.log(window.location.href)



    fetch(window.location.href + "/allFerme")

        .then(result => result.json())

        .then(parsedResult => {

			      create_map_content();

			

            if( parsedResult ){

                var tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {

                    maxZoom: 18,

                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Points &copy 2012 LINZ'

                })

                // var latlng = L.latLng(-37.89, 175.46);

				const departName = document.querySelector(".titre").getAttribute("data-toggle-deparement")



                var latlng = L.latLng(46.227638, 2.213749);



                var map = L.map('map', {center: latlng, zoom: 5, layers: [tiles]});



                var markers = L.markerClusterGroup({ 

                        chunkedLoading: true

                    });

        tabArray = parsedResult

        console.log(tabArray)

				parsedResult.forEach(item => {

					// var pathDetails = "/ferme/departement/" + departName + "/" + item.departement.split(",")[0].toString().trim() + "/details/" + item.id.toString().trim();

					var pathDetails = "/ferme/departement/" + departName + "/" + item.departement + "/details/" + item.id.toString().trim();

			

                    const adress = "<br> <span class='fw-bolder'> Adresse: </span> <br>" + item.adresseFerme;

                    // const link = "<br><a href='"+ pathDetails + "'> VOIR DETAILS </a>";



                    var title = " <span class='fw-bolder'> Ferme:</span> <br>" + item.nomFerme + ".<br> <span class='fw-bolder'> Departement:</span> <br>" + item.departement +"." + adress;

                    var marker = L.marker(L.latLng(parseFloat(item.latitude), parseFloat(item.longitude )), {icon: setIconn('assets/icon/NewIcons/icon-ferme-new-B.png') });

                   

                    marker.bindTooltip(title,{ direction:"top", offset: L.point(0,-30)}).openTooltip();

                    marker.on('click', () => {

                        window.location = pathDetails;

                    });



                    markers.addLayer(marker);

                } )



                map.addLayer(markers);

            }else{

                console.log("ERREUR : L'erreur se produit par votre réseaux.")

            }

        });

});



if( document.querySelector(".plus_result")){



	const more_result =  document.querySelector(".plus_result");

	const id_dep = more_result.getAttribute("data-id");

	const nom_dep = more_result.getAttribute("data-toggle");

	

	more_result.addEventListener("click" , () => {

		

		$.ajax({

			url: "/ferme/departement",

			type: "POST",

			dataType: "json",

			data :{

				id_dep : id_dep,

                nom_dep : nom_dep,

				page :parseInt(more_result.getAttribute("id"))

            },

			

			success: (result , status ) =>{

				console.log(result)

				const more = document.querySelector(".plus_result");

				

				if (result.length > 0 ){

					result.forEach(element => {

						const div= document.createElement("div");

						div.classList.add("element");

						const p = document.createElement("p")



						if( element.nomFerme && element.adresseFerme ){

							p.innerHTML = element.nomFerme + "<br>" + element.adresseFerme;

						}else{

							p.innerText = "12 Lorem";

						}

						div.appendChild(p);

	

						const a=document.createElement("a");

						a.classList.add("plus");

						a.setAttribute("href" , "/ferme/departement/" + nom_dep + "/" + id_dep + "/details/" + element.id);

						a.innerText ="Voir details";

	

						div.appendChild(a);

	

						const parent = more.parentElement;

						parent.insertBefore(div , more);

						

					});

				}else {



					const div= document.createElement("div");

					div.classList.add("fin_ferme");

					div.innerText = "Il n'existe plus."



					const parent = more.parentElement;

					parent.appendChild(div);

					parent.removeChild(more);

				}

			},

			

			error : function(xhr, textStatus, errorThrown) { 

				alert(textStatus); 

				console.log('Ajax request failed.');

			}

		});

		

		if(document.querySelector(".plus_result")){

			const new_req = document.querySelector(".plus_result");

			new_req.setAttribute("id" , parseInt(new_req.getAttribute("id")) + 1 );

		}

	})

}

/***

 * @author tommy

 * 

 * delete fiche created by user suppliers  

 * */



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



/***

 * @author tommy

 */



document.querySelectorAll(".modif-etab").forEach((element) => {

	element.addEventListener("click", (event) => {

		const idFerme = parseInt(event.target.dataset.token.split(":")[2].split("\.")[1].replace(/[^0-9]/g, ""), 10)

		sessionStorage.setItem("fff",idFerme)

	})

})


// filter alphabet

// selecting required element
const element = document.querySelector(".pagination ul");

const letters=['','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']
//const lettersL=letters.length
let totalPages = letters.length-1;
let page = 1;

//calling function with passing parameters and adding inside element which is ul tag
element.innerHTML = createPagination(totalPages, page);
function createPagination(totalPages, page){
  let liTag = '';
  let active;
  let beforePage = page - 1;
  let afterPage = page + 1;
  if(page > 1){ //show the next button if the page value is greater than 1
    liTag += `<li class="btn prev" onclick="createPagination(totalPages, ${page - 1})"><span><i class="fas fa-angle-left"></i></span></li>`;
  }

  if(page > 2){ //if page value is less than 2 then add 1 after the previous button
    liTag += `<li class="first numb" onclick="createPagination(totalPages, 1)"><span>A</span></li>`;
    if(page > 3){ //if page value is greater than 3 then add this (...) after the first li or page
      liTag += `<li class="dots"><span>...</span></li>`;
    }
  }

  // how many pages or li show before the current li
  if (page == totalPages) {
    beforePage = beforePage - 2;
  } else if (page == totalPages - 1) {
    beforePage = beforePage - 1;
  }
  // how many pages or li show after the current li
  if (page == 1) {
    afterPage = afterPage + 2;
  } else if (page == 2) {
    afterPage  = afterPage + 1;
  }

  for (var plength = beforePage; plength <= afterPage; plength++) {
    if (plength > totalPages) { //if plength is greater than totalPage length then continue
      continue;
    }
    if (plength == 0) { //if plength is 0 than add +1 in plength value
      plength = plength + 1;
    }
    if(page == plength){ //if page is equal to plength than assign active string in the active variable
      active = "active";
    }else{ //else leave empty to the active variable
      active = "";
    }
    liTag += `<li class="numb ${active}" onclick="createPagination(totalPages, ${plength})"><span>${letters[plength]}</span></li>`;
  }

  if(page < totalPages - 1){ //if page value is less than totalPage value by -1 then show the last li or page
    if(page < totalPages - 2){ //if page value is less than totalPage value by -2 then add this (...) before the last li or page
      liTag += `<li class="dots"><span>...</span></li>`;
    }
    liTag += `<li class="last numb" onclick="createPagination(totalPages, ${totalPages})"><span>${letters[totalPages]}</span></li>`;
  }

  if (page < totalPages) { //show the next button if the page value is less than totalPage(20)
    liTag += `<li class="btn next" onclick="createPagination(totalPages, ${page + 1})"><span> <i class="fas fa-angle-right"></i></span></li>`;
  }
  element.innerHTML = liTag; //add li tag inside ul tag

  let charAfilter = element.querySelector("li.active").textContent;

  document.querySelectorAll("#all_ferme_in_dep > div.element").forEach((ferme)=>{
      let nomFerme = ferme.querySelector("p").textContent.trim();
      if(!nomFerme.startsWith(charAfilter)){
        ferme.style.display = "none"
        ferme.classList.remove("miseho")
      }else{
        ferme.style.display = "block"
        ferme.classList.add("miseho")
      }
  })


  document.querySelector("p.nombre_de_resultat > span").textContent =  document.querySelectorAll(".miseho").length

  console.log(element.querySelector("li.active").textContent);
  
  return liTag; //reurn the li tag
}

window.onload = (event) => {
  document.querySelector("li.numb.active").classList.remove("active")
  document.querySelectorAll("#all_ferme_in_dep > div.element").forEach((ferme)=>{
      ferme.style.display = "block"
  })
  document.querySelector("p.nombre_de_resultat > span").textContent =  document.querySelectorAll("#all_ferme_in_dep > div.element").length
};



