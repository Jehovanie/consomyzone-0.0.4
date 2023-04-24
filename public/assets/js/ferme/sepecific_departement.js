let tabArray, map, markers
let tabMarker = []

window.addEventListener('load', () => {
    const geos = []
    document.querySelectorAll("#all_ferme_in_dep > div > a").forEach(item => {
        item.onclick = () => {
            localStorage.removeItem("coordFerme")
        }
    })
    const id_dep = document.querySelector('#all_ferme_in_dep').getAttribute("data-toggle-id-dep")

    if (id_dep == 20) {
        for (let corse of ['2A', '2B'])
            geos.push(franceGeo.features.find(element => element.properties.code == corse))
    } else {
            geos.push(franceGeo.features.find(element => element.properties.code == id_dep))
    }
    //  console.log(geos) 
  fetch(window.location.href.replace(/#/g, "") + "/allFerme")
    .then(result => result.json())
    .then(parsedResult => {
        tabArray = parsedResult;

        // create_map_content();
        var map=create_map_content(geos,id_dep, "home");
        markers = L.markerClusterGroup({
            chunkedLoading: true
        });
        chargeMapAndMarkers(tabArray, map, markers)
    });

});



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
        sessionStorage.setItem("fff", idFerme)
    })

})


// // filter alphabet

// // selecting required element
// const element = document.querySelector(".pagination ul");
// const letters = ['', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
// //const lettersL=letters.length
// let totalPages = letters.length - 1;
// let page = 1;

// //calling function with passing parameters and adding inside element which is ul tag
// element.innerHTML = createPagination(totalPages, page);
// function createPagination(totalPages, page) {
//   let liTag = '';
//   let active;
//   let beforePage = page - 1;
//   let afterPage = page + 1;
//   if (page > 1) { //show the next button if the page value is greater than 1
//     liTag += `<li class="btn prev" onclick="createPagination(totalPages, ${page - 1})"><span><i class="fas fa-angle-left"></i></span></li>`;
//   }

//   if (page > 2) { //if page value is less than 2 then add 1 after the previous button
//     liTag += `<li class="first numb" onclick="createPagination(totalPages, 1)"><span>A</span></li>`;
//     if (page > 3) { //if page value is greater than 3 then add this (...) after the first li or page
//       liTag += `<li class="dots"><span>...</span></li>`;
//     }
//   }

//   // how many pages or li show before the current li
//   if (page == totalPages) {
//     beforePage = beforePage - 2;
//   } else if (page == totalPages - 1) {
//     beforePage = beforePage - 1;
//   }
//   // how many pages or li show after the current li
//   if (page == 1) {
//     afterPage = afterPage + 2;
//   } else if (page == 2) {
//     afterPage = afterPage + 1;
//   }

//   for (var plength = beforePage; plength <= afterPage; plength++) {
//     if (plength > totalPages) { //if plength is greater than totalPage length then continue
//       continue;
//     }
//     if (plength == 0) { //if plength is 0 than add +1 in plength value
//       plength = plength + 1;
//     }
//     if (page == plength) { //if page is equal to plength than assign active string in the active variable
//       active = "active";
//     } else { //else leave empty to the active variable
//       active = "";
//     }
//     liTag += `<li class="numb ${active}" onclick="createPagination(totalPages, ${plength})"><span>${letters[plength]}</span></li>`;
//   }

//   if (page < totalPages - 1) { //if page value is less than totalPage value by -1 then show the last li or page
//     if (page < totalPages - 2) { //if page value is less than totalPage value by -2 then add this (...) before the last li or page
//       liTag += `<li class="dots"><span>...</span></li>`;
//     }
//     liTag += `<li class="last numb" onclick="createPagination(totalPages, ${totalPages})"><span>${letters[totalPages]}</span></li>`;
//   }

//   if (page < totalPages) { //show the next button if the page value is less than totalPage(20)
//     liTag += `<li class="btn next" onclick="createPagination(totalPages, ${page + 1})"><span> <i class="fas fa-angle-right"></i></span></li> <li class="btn next ms-4" onclick='refreshData()'><i class="fa-solid fa-arrows-rotate refreshData"></i></li>`;
//   }
//   if (element) {
//       element.innerHTML = liTag; //add li tag inside ul tag
//   }

//   let charAfilter = element.querySelector("li.active").textContent;
//   let xData = Array()
//   document.querySelectorAll("#all_ferme_in_dep > div.element").forEach((ferme) => {
//     let nomFerme = ferme.querySelector("p").textContent.trim();
//     if (!nomFerme.startsWith(charAfilter)) {
//       ferme.style.display = "none"
//       ferme.classList.remove("miseho")
//     } else {
//       ferme.style.display = "block"
//       ferme.classList.add("miseho")
//       //xData.push(filterData(ferme.dataset.toggleLatitude, ferme.dataset.toggleLongitude));
//       xData.push(filterData(ferme.dataset.toggleId));
//       //console.log("Latitude : " + ferme.dataset.toggleLatitude + "\tLongitude : " + ferme.dataset.toggleLongitude)
//     }

//   })

  
//   if (tabMarker.length > 0) {
//     //console.log(tabMarker)
//     for (let j = 0; j < tabMarker.length; j++) {
//       markers.removeLayer(tabMarker[j]);
//     }

//     map.removeLayer(markers);

//     tabMarker = [];

//   }

//   if(xData.length > 0){

//     chargeMapAndMarkers(xData, map, markers)

//   }
  
//   document.querySelector("p.nombre_de_resultat > span").textContent = document.querySelectorAll(".miseho").length

//   console.log(element.querySelector("li.active").textContent);

//   return liTag; //reurn the li tag
// }

function chargeMapAndMarkers(parsedResult, map, markers) {

    if (parsedResult) {
        const departName = document.querySelector(".titre").getAttribute("data-toggle-deparement")

        parsedResult.forEach(item => {
            item= item.id ? item : item[0];

            // var pathDetails = "/ferme/departement/" + departName + "/" + item.departement + "/details/" + item.id.toString().trim();
            let pathDetails = `/ferme/departement/${departName}/${item.departement}/details/${item.id}`;
            let pathDetailsMobile = `/ferme-mobile/departement/${departName}/${item.departement}/details/${item.id}`;

            const adress = "<br> <span class='fw-bolder'> Adresse: </span> <br>" + item.adresseFerme;

            var title = " <span class='fw-bolder'> Ferme:</span> <br>" + item.nomFerme + ".<br> <span class='fw-bolder'> Departement:</span> <br>" + item.departement + "." + adress;
            var marker = L.marker(L.latLng(parseFloat(item.latitude), parseFloat(item.longitude)), { icon: setIcon('assets/icon/NewIcons/icon-ferme-new-B.png') });

            tabMarker.push(marker)

            marker.bindTooltip(title, { direction: "top", offset: L.point(0, -30) }).openTooltip();
            marker.on('click', (e) => {
                
                const coordAndZoom = {
                zoom: e.target.__parent._zoom+1,
                coord:e.target.__parent._cLatLng
                }
            setDataInLocalStorage("coordFerme", JSON.stringify(coordAndZoom))
                let screemMax = window.matchMedia("(max-width: 1000px)")
                let screemMin = window.matchMedia("(min-width: 1000px)")
                let remove = document.getElementById("remove-detail-ferme-spec")
                if (screemMax.matches) {
                    location.assign(pathDetailsMobile)
                } else if (screemMin.matches) {
                    
                    remove.removeAttribute("class", "hidden");
                    remove.setAttribute("class", "navleft-detail fixed-top")
                    var myHeaders = new Headers();
                    myHeaders.append('Content-Type', 'text/plain; charset=UTF-8');
                    fetch(pathDetails, myHeaders)
                        .then(response => {
                            return response.text()
                        }).then(r => {
                            document.querySelector("#content-details-ferme").innerHTML = null
                            document.querySelector("#content-details-ferme").innerHTML = r
                        
                            document.querySelector("#close-detail-ferme").addEventListener("click", () => {
                                document.querySelector("#content-details-ferme").style.display = "none"
                            })
                            document.querySelector("#content-details-ferme").removeAttribute("style")
                        
                        })
                
                }
            });
            markers.addLayer(marker);
        })
        map.addLayer(markers);

        map.on("resize zoom", (e) => {
            const coordAndZoom = {
                zoom: e.target._zoom,
                coord:e.target._lastCenter
            }
            setDataInLocalStorage("coordFerme", JSON.stringify(coordAndZoom))
        })
        map.on("dragend", (e) => {
            console.log(e.target.getCenter(), e.target.getZoom())
            const coordAndZoom = {
                zoom: e.target.getZoom(),
                coord:e.target.getCenter()
            }
            setDataInLocalStorage("coordFerme", JSON.stringify(coordAndZoom))
        })
    } else {
        console.log("ERREUR : L'erreur se produit par votre réseaux.")
    }
}

// /*function filterData(lat, long) {
//   console.log(tabArray);
//   let filteredData = tabArray.filter(position =>
//     position.latitude.includes(lat) &&
//     position.longitude.includes(long)
//   )

//   return filteredData
  
// }*/

// function filterData(id) {

//   let filteredData = tabArray.filter(position =>
//     position.id == id
//   )
 
//   return filteredData

// }

// function sortList() {
//   var list, i, switching, b, shouldSwitch;
//   list = document.querySelector("#all_ferme_in_dep")
//   switching = true;
//   while (switching) {
//     // start by saying: no switching is done:
//     switching = false;
//     b = list.querySelector("div > p");
//     // Loop through all list-items:
//     for (i = 0; i < (b.length - 1); i++) {
//       // start by saying there should be no switching:
//       shouldSwitch = false;
//       if (b[i].innerHTML.toLowerCase() > b[i + 1].innerHTML.toLowerCase()) {
//         shouldSwitch = true;
//         break;
//       }
//     }
//     if (shouldSwitch) {
//       /* If a switch has been marked, make the switch
//       and mark the switch as done: */
//       b[i].parentNode.insertBefore(b[i + 1], b[i]);
//       switching = true;
//     }
//   }
// }

// function reverseList(e) {
//     const parent = document.querySelector("#all_ferme_in_dep")
//     const arr = Array.from(parent.childNodes);
//     arr.reverse();
//     parent.append(...arr);
//     e.classList.add("active")

//     if(e.parentElement.nextElementSibling){
//       e.parentElement.nextElementSibling.querySelector("a").classList.remove("active")
//     }else{
//       e.parentElement.previousElementSibling.querySelector("a").classList.remove("active")
//     }

// }

// function refreshData(){
//   //console.log("Mandeha ve?");
//   document.querySelector("li.numb.active").classList.remove("active")
//   document.querySelectorAll("#all_ferme_in_dep > div.element").forEach((ferme) => {
//     ferme.style.display = "block"
//     if(!ferme.classList.toString().includes("miseho")) ferme.classList.add("miseho")    
//   })
//   document.querySelector("p.nombre_de_resultat > span").textContent = document.querySelectorAll("#all_ferme_in_dep > div.element").length


//   let xData = Array()

//   document.querySelectorAll("#all_ferme_in_dep > div.element.miseho").forEach((ferme) => {
    
//       xData.push(filterData(ferme.dataset.toggleId));

//   })

  
//   if (tabMarker.length > 0) {
    
//     for (let j = 0; j < tabMarker.length; j++) {
//       markers.removeLayer(tabMarker[j]);
//     }

//     map.removeLayer(markers);

//     tabMarker = [];

//   }

//   chargeMapAndMarkers(tabArray, map, markers)

// }




