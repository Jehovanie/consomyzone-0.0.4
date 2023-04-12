window.addEventListener('load', () => {
  document.querySelectorAll("#list_departements ul > li > div > a").forEach(item => {
    item.onclick = () => {
      localStorage.removeItem("coordStation")
    }
  })
	// const url = window.location.href.split("?");
  //   ///get the data important
  //   const id_dep = document.querySelector("#list_departements").getAttribute("data-toggle-code"),
  //   nom_dep = document.querySelector("#list_departements").getAttribute("data-toggle-name"),
  //   min = document.querySelector(".input_min").getAttribute("value"),
  //   max = document.querySelector(".input_max").getAttribute("value");

  //   if(url.length>1 && url[1].split("=")[1] != "tous"){
  //       const all_types = url[1].split("=")[1].split("@");
  //       const all_checkbox = document.querySelectorAll(".checkbox_filter .checkbox");
  //       all_checkbox.forEach(item => {
  //           if( all_types.includes(item.getAttribute("value"))){
  //               item.checked=true
  //           }else{
  //               item.checked=false
  //           }
  //       })
  //       filterByPrice(parseFloat(min), parseFloat(max),url[1].split("=")[1],nom_dep, id_dep);
  //   }else{
	// 	const all_checkbox = document.querySelectorAll(".checkbox_filter .checkbox");
  //       all_checkbox.forEach(item => {
  //           item.checked=true
  //       })
  //       filterByPrice(parseFloat(min), parseFloat(max),"tous",nom_dep, id_dep);
  //   }
});


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
  return liTag; //reurn the li tag
}