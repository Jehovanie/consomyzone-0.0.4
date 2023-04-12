let tabArray = []
let map
let markers
let tabMarker = []
let centerss = []
centerss[44] = {
  lat: 47.218371,
  lng: -1.553621,
  zoom:9
}

centerss[75] = {
  lat: 48.856614,
  lng: 2.3522219,
  zoom: 10,
  arrondissement: {
    75101: { lat: 48.861924, lng: 2.330883 },
    75102: { lat: 48.867556, lng: 2.343892 },
    75103: { lat: 48.8627014160156, lng: 2.3652000427246 },
    75104: { lat: 48.8544006347656 , lng: 2.36240005493164},
    75105: { lat: 48.8446998596191 , lng:  2.35419988632202},
    75106: { lat: 48.8470001220703, lng: 2.33459997177124 },
    75107: { lat: 48.8564987182617, lng: 2.31369996070861},
    75108: { lat: 48.872200012207, lng: 2.31680011749267 },
    75109: { lat: 48.8801002502441 , lng: 2.34039998054504 },
    75110: { lat: 48.8815994262695, lng: 2.36229991912841 },
    75111: { lat: 48.8611984252929 , lng: 2.3833999633789 },
    75112: { lat: 48.8367004394531, lng: 2.39689993858337 },
    75113: { lat: 48.8274002075195, lng: 2.36660003662109 },
    75114: { lat: 48.8316993713378, lng: 2.32319998741149 },
    75115: { lat: 48.8445014953613, lng: 2.29769992828369 },
    75116: { lat: 48.8712005615234, lng: 2.28929996490478 },
    75117: { lat: 48.8866996765136, lng: 2.30349993705749 },
    75118: { lat: 48.8917007446289 , lng: 2.35100007057189 },
    75119: { lat: 48.8825988769531, lng: 2.39109992980957},
    75120: { lat: 48.8646011352539, lng: 2.40639996528625}

   
  }
}

window.addEventListener('load', () => {
  const geos=[]
  document.querySelectorAll("#all_ferme_in_dep > div > a").forEach(item => {
    item.onclick = () => {
      localStorage.removeItem("coord")

    }
     
  })

  if (window.location.href.includes("/restaurant/arrondissement/specific")) {
    const dep = new URLSearchParams(window.location.href).get("id_dep")
    const codinsee = new URLSearchParams(window.location.href).get("codinsee")
    
    let url = "/Coord/All/Restaurant/specific/arrondissement/" + dep + "/" + codinsee;
    geos.push(arrdParis.features.find(element => element.properties.c_arinsee == codinsee))
   
    console.log(geos)
    const cntrJson = JSON.parse(JSON.stringify(centerss[75]))
    console.log(cntrJson["arrondissement"][codinsee])
    fetch(url).then(response =>response.json())
              .then(response1 => {
                
                tabArray = response1
                create_map_content()
                if (document.getElementById("content_nombre_result_js_jheo")) {
                  document.getElementById("content_nombre_result_js_jheo").innerText = response1.length;
                }

                var tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                  maxZoom: 18,
                  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Points &copy 2012 LINZ'
                })
                // var latlng = L.latLng(-37.89, 175.46);
                //lat: 48.85151944993856, lng: 2.3303965687751753
                var latlng = L.latLng(cntrJson["arrondissement"][codinsee].lat, cntrJson["arrondissement"][codinsee].lng);
                const json=getDataInLocalStorage("coord") ? JSON.parse(getDataInLocalStorage("coord")) :null
                const zoom = json ? (json.zoom ? json.zoom :14) : 14;
                const centered = json ? (json.coord ? L.latLng(json.coord.lat, json.coord.lng) : latlng) : latlng;
                var map = L.map('map', { center: centered, zoom: zoom, layers: [tiles] });
                L.geoJson(geos,{style:{
                                //fillColor: getColor(feature.properties.density),
                                weight: 2,
                                opacity: 1,
                                color: 'red',
                                dashArray: '3',
                                fillOpacity: 0
                            },onEachFeature: function (feature, layer) {
                            layer.bindTooltip(feature.properties.l_ar);
                        }}).addTo(map);
                map.doubleClickZoom.disable();

                markers = L.markerClusterGroup({
                  chunkedLoading: true
                });

                chargeMapAndMarkers(response1, map, markers)

              });
  } else {
    const dep = new URLSearchParams(window.location.href).get("id_dep")
    //alert(dep)
    let url = "/Coord/Spec/Restaurant/" + dep;
    geos.push(franceGeo.features.find(element => element.properties.code == dep))
    fetch(url).then(response =>response.json())
              .then(response1 => {

                  tabArray = response1
                  create_map_content()
                  if (document.getElementById("content_nombre_result_js_jheo")) {
                    document.getElementById("content_nombre_result_js_jheo").innerText = response1.length;
                  }

                  var tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    maxZoom: 18,
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Points &copy 2012 LINZ'
                  })
                  // var latlng = L.latLng(-37.89, 175.46);

                  var latlng = L.latLng(centerss[parseInt(dep)].lat, centerss[parseInt(dep)].lng);
                  const json=getDataInLocalStorage("coord") ? JSON.parse(getDataInLocalStorage("coord")) :null
                  const zoom = json ? (json.zoom ? json.zoom :centerss[parseInt(dep)].zoom) : centerss[parseInt(dep)].zoom;
                  const centered =json ?( json.coord ? L.latLng(json.coord.lat,json.coord.lng):latlng) : latlng ;
                  var map = L.map('map', { center: centered, zoom: zoom, layers: [tiles] });
                  L.geoJson(geos,{style:{
                                //fillColor: getColor(feature.properties.density),
                                weight: 2,
                                opacity: 1,
                                color: 'red',
                                dashArray: '3',
                                fillOpacity: 0
                            }, onEachFeature: function (feature, layer) {
                            layer.bindTooltip(feature.properties.nom);
                        }}).addTo(map);
                  
                
                  markers = L.markerClusterGroup({
                    chunkedLoading: true
                  });

                  chargeMapAndMarkers(response1, map, markers)

              });
  }
  if(document.querySelector("li.numb.active"))
    document.querySelector("li.numb.active").classList.remove("active")
  document.querySelectorAll("#all_ferme_in_dep > div.element").forEach((ferme) => {
    ferme.style.display = "block"
  })
  document.querySelector("p.nombre_de_resultat > span").textContent = document.querySelectorAll("#all_ferme_in_dep > div.element").length

});


// filter alphabet

// selecting required element
const element = document.querySelector(".pagination ul");


const letters = ['', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
//const lettersL=letters.length
let totalPages = letters.length - 1;
let page = 1;

//calling function with passing parameters and adding inside element which is ul tag
if (element) {
    element.innerHTML = createPagination(totalPages, page);
}

function createPagination(totalPages, page) {
  let liTag = '';
  let active;
  let beforePage = page - 1;
  let afterPage = page + 1;
  if (page > 1) { //show the next button if the page value is greater than 1
    liTag += `<li class="btn prev" onclick="createPagination(totalPages, ${page - 1})"><span><i class="fas fa-angle-left"></i></span></li>`;
  }

  if (page > 2) { //if page value is less than 2 then add 1 after the previous button
    liTag += `<li class="first numb" onclick="createPagination(totalPages, 1)"><span>A</span></li>`;
    if (page > 3) { //if page value is greater than 3 then add this (...) after the first li or page
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
    afterPage = afterPage + 1;
  }

  for (var plength = beforePage; plength <= afterPage; plength++) {
    if (plength > totalPages) { //if plength is greater than totalPage length then continue
      continue;
    }
    if (plength == 0) { //if plength is 0 than add +1 in plength value
      plength = plength + 1;
    }
    if (page == plength) { //if page is equal to plength than assign active string in the active variable
      active = "active";
    } else { //else leave empty to the active variable
      active = "";
    }
    liTag += `<li class="numb ${active}" onclick="createPagination(totalPages, ${plength})"><span>${letters[plength]}</span></li>`;
  }

  if (page < totalPages - 1) { //if page value is less than totalPage value by -1 then show the last li or page
    if (page < totalPages - 2) { //if page value is less than totalPage value by -2 then add this (...) before the last li or page
      liTag += `<li class="dots"><span>...</span></li>`;
    }
    liTag += `<li class="last numb" onclick="createPagination(totalPages, ${totalPages})"><span>${letters[totalPages]}</span></li>`;
  }

  if (page < totalPages) { //show the next button if the page value is less than totalPage(20)
    liTag += `<li class="btn next" onclick="createPagination(totalPages, ${page + 1})"><span> <i class="fas fa-angle-right"></i></span></li> <li class="btn next ms-4" onclick='refreshData()'><i class="fa-solid fa-arrows-rotate refreshData"></i></li>`;
  }
   let xData = Array()

    element.innerHTML = liTag; //add li tag inside ul tag

    let charAfilter = element.querySelector("li.active").textContent;
 
 
    document.querySelectorAll("#all_ferme_in_dep > div.element").forEach((ferme) => {
      let nomFerme = ferme.querySelector("p").textContent.trim();
      if (!nomFerme.startsWith(charAfilter)) {
        ferme.style.display = "none"
        ferme.classList.remove("miseho")
      } else {
        // console.log(ferme.querySelector("p").textContent.trim());
        ferme.style.display = "block"
        ferme.classList.add("miseho")
        //console.log("Latitude : " + ferme.dataset.toggleLatitude + "\tLongitude : " + ferme.dataset.toggleLongitude)
        xData.push(filterData(ferme.dataset.toggleId));
      
      }

    })
  
  
  


    if (tabMarker.length > 0) {
      //console.log(tabMarker)
      for (let j = 0; j < tabMarker.length; j++) {
        markers.removeLayer(tabMarker[j]);
      }

      map.removeLayer(markers);

      tabMarker = [];

    }

    if (xData.length > 0) {
      // console.log(xData)
      chargeMapAndMarkers(xData, map, markers)

    }

    document.querySelector("p.nombre_de_resultat > span").textContent = document.querySelectorAll(".miseho").length

    console.log(element.querySelector("li.active").textContent);
  

  return liTag; //reurn the li tag
}

function chargeMapAndMarkers(response1, map, markers) {

  //const departName = document.querySelector(".titre").getAttribute("data-toggle-deparement")

  ///// 0 -> 4717
  response1.forEach(item => {
   
    if(item.id){
      item = item
    }else{
      item = item[0]
    }
    //console.log(item);
    //console.log("item", item.depName)
    // const nom_dep = item.departement.split(",")[1]?.toString().trim() ? item.departement.split(",")[1]?.toString().trim() : "unknow";
    // const departementName = item.departementName ? item.departementName : "unknow";
    const departementName = item.depName
    // @Route("ferme/departement/{nom_dep}/{id_dep}/details/{id_ferme}" , name="detail_ferme" , methods="GET" )
    var pathDetails = "/restaurant/departement/" + departementName + "/" + item.dep + "/details/" + item.id;

    const adresseRestaurant = `${item.numvoie} ${item.typevoie} ${item.nomvoie} ${item.codpost} ${item.villenorm}`
    const adress = "<br><span class='fw-bolder'> Adresse:</span> <br>" + adresseRestaurant;
    // const link = "<br><a href='"+ pathDetails + "'> VOIR DETAILS </a>";

    var title = "<span class='fw-bolder'> Restaurant:</span>  " + item.denominationF + ".<span class='fw-bolder'><br> Departement:</span>  " + departementName + "." + adress;

    var marker = L.marker(L.latLng(parseFloat(item.poiY), parseFloat(item.poiX)), { icon: setIcon('assets/icon/icon-resto-bleu.png') });
    tabMarker.push(marker)
    marker.bindTooltip(title, { direction: "top", offset: L.point(0, -30) }).openTooltip();
    marker.on('click', (e) => {
      console.log(e)
      const coordAndZoom = {
        zoom: e.target.__parent._zoom+1,
        coord:e.target.__parent._cLatLng
      }
      setDataInLocalStorage("coord", JSON.stringify(coordAndZoom))
      window.location = pathDetails;
    });

    markers.addLayer(marker);
  });

  map.addLayer(markers);
  map.on("resize zoom", (e) => {
      console.log(e)
      const coordAndZoom = {
          zoom: e.target._zoom,
          coord:e.target._lastCenter
      }
      setDataInLocalStorage("coord", JSON.stringify(coordAndZoom))
  })
  map.on("dragend", (e) => {
      console.log(e.target.getCenter(), e.target.getZoom())
      const coordAndZoom = {
          zoom: e.target.getZoom(),
          coord:e.target.getCenter()
      }
      setDataInLocalStorage("coord", JSON.stringify(coordAndZoom))
  })
}

function filterData(id) {

  let filteredData = tabArray.filter(position =>
    position.id == id
  )
 
  return filteredData

}

function sortList() {
  var list, i, switching, b, shouldSwitch;
  list = document.querySelector("#all_ferme_in_dep")
  switching = true;
  while (switching) {
    // start by saying: no switching is done:
    switching = false;
    b = list.querySelector("div > p");
    // Loop through all list-items:
    for (i = 0; i < (b.length - 1); i++) {
      // start by saying there should be no switching:
      shouldSwitch = false;
      if (b[i].innerHTML.toLowerCase() > b[i + 1].innerHTML.toLowerCase()) {
        shouldSwitch = true;
        break;
      }
    }
    if (shouldSwitch) {
      /* If a switch has been marked, make the switch
      and mark the switch as done: */
      b[i].parentNode.insertBefore(b[i + 1], b[i]);
      switching = true;
    }
  }
}

function reverseList(e) {
  const parent = document.querySelector("#all_ferme_in_dep")
  const arr = Array.from(parent.childNodes);
  arr.reverse();
  parent.append(...arr);
  e.classList.add("active")

  if (e.parentElement.nextElementSibling) {
    e.parentElement.nextElementSibling.querySelector("a").classList.remove("active")
  } else {
    e.parentElement.previousElementSibling.querySelector("a").classList.remove("active")
  }

}

function refreshData(){
  //console.log("Mandeha ve?");
  document.querySelector("li.numb.active").classList.remove("active")
  document.querySelectorAll("#all_ferme_in_dep > div.element").forEach((ferme) => {
    ferme.style.display = "block"
    if(!ferme.classList.toString().includes("miseho")) ferme.classList.add("miseho")    
  })
  document.querySelector("p.nombre_de_resultat > span").textContent = document.querySelectorAll("#all_ferme_in_dep > div.element").length


  let xData = Array()

  document.querySelectorAll("#all_ferme_in_dep > div.element.miseho").forEach((ferme) => {
    
      xData.push(filterData(ferme.dataset.toggleId));

  })

  
  if (tabMarker.length > 0) {
    
    for (let j = 0; j < tabMarker.length; j++) {
      markers.removeLayer(tabMarker[j]);
    }

    map.removeLayer(markers);

    tabMarker = [];

  }

  chargeMapAndMarkers(tabArray, map, markers)

}

