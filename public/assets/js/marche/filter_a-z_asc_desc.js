/* ------------------------------------------------------------------------------------------------------ */
/* THIS CODE USES THE  INSTANCE  of 'MarckerClusterMarche' CREATED IN FILE marckerClusterMarche_spec.js */
/*--------------------------------------------------------------------------------------------------------*/

// filter alphabet
const letters = [
	"",
	"A",
	"B",
	"C",
	"D",
	"E",
	"F",
	"G",
	"H",
	"I",
	"J",
	"K",
	"L",
	"M",
	"N",
	"O",
	"P",
	"Q",
	"R",
	"S",
	"T",
	"U",
	"V",
	"W",
	"X",
	"Y",
	"Z",
];

//const lettersL=letters.length
let totalPages = letters.length - 1,
	page = 1;

// selecting required element

const class_content_trie = screen.width < 991 ? "pagination_alphabet_mobile_jheo_js" : "pagination_alphabet_jheo_js";
const element = document.querySelector(`.${class_content_trie} ul`);

//calling function with passing parameters and adding inside element which is ul tag
if (screen.width <= 991) {
} else {
	element.innerHTML = createPagination(totalPages, page);
}

function createPagination(totalPages, page) {
	let liTag = "";
	let active;
	let beforePage = page - 1;
	let afterPage = page + 1;

	if (page > 1) {
		//show the next button if the page value is greater than 1
		liTag += `<li class=" prev" onclick="createPagination(totalPages, ${
			page - 1
		})"><span><i class="fas fa-angle-left"></i></span></li>`;
	}

	if (page > 2) {
		//if page value is less than 2 then add 1 after the previous button
		liTag += `<li class="first numb" onclick="createPagination(totalPages, 1)"><span>A</span></li>`;
		if (page > 3) {
			//if page value is greater than 3 then add this (...) after the first li or page
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
		if (plength > totalPages) {
			//if plength is greater than totalPage length then continue
			continue;
		}
		if (plength == 0) {
			//if plength is 0 than add +1 in plength value
			plength = plength + 1;
		}
		if (page == plength) {
			//if page is equal to plength than assign active string in the active variable
			if (OBJECT_MARKERS_MARCHE.getAlreadyInit()) {
				active = "alphabet_active";
				handleFilterFirstChar(letters[plength]);
				OBJECT_MARKERS_MARCHE.filterByFirstLetterOnName(letters[page]);

				document.querySelector(".content_pagination_js_jheo").classList.add("hidden");
			}
		} else {
			//else leave empty to the active variable
			active = "";
		}
		liTag += `<li class="numb ${active}" onclick="createPagination(totalPages, ${plength})"><span>${letters[plength]}</span></li>`;
	}

	if (page < totalPages - 1) {
		//if page value is less than totalPage value by -1 then show the last li or page
		if (page < totalPages - 2) {
			//if page value is less than totalPage value by -2 then add this (...) before the last li or page
			liTag += `<li class="dots"><span>...</span></li>`;
		}

		liTag += `<li class="last numb" onclick="createPagination(totalPages, ${totalPages})"><span>${letters[totalPages]}</span></li>`;
	}

	if (page < totalPages) {
		//show the next button if the page value is less than totalPage(20)
		liTag += `<li class=" next" onclick="createPagination(totalPages, ${
			page + 1
		})"><span> <i class="fas fa-angle-right"></i></span></li>`;
	}
	const refreshData = `<li class="list_alphabet" onclick="refreshDataList()"><span class="alphabet_element arrow_refresh_data_jheo_js"><i class="fa-solid fa-arrows-rotate"></i></span></li>`;
	const cta_reverselist = `<li class="list_alphabet" onclick="reverseList()"><span class="alphabet_element arrow_asc_desc_jheo_js asc_jheo_js"><i class="fa-solid fa-arrow-down-a-z"></i></span></li>`;
	liTag += refreshData + cta_reverselist;
	element.innerHTML = liTag; //add li tag inside ul tag

	OBJECT_MARKERS_MARCHE.setAlreadyInit(true);

	return liTag; //reurn the li tag
}

function reverseList() {
	if (document.querySelector(".arrow_asc_desc_jheo_js")) {
		reverseCardElement();
		if (document.querySelector(".arrow_asc_desc_jheo_js").classList.contains("asc_jheo_js")) {
			document.querySelector(".arrow_asc_desc_jheo_js").classList.remove("asc_jheo_js");
			document.querySelector(".arrow_asc_desc_jheo_js").classList.add("desc_jheo_js");

			document.querySelector(".arrow_asc_desc_jheo_js").innerHTML = `<i class="fa-solid fa-arrow-down-z-a"></i>`;
		} else {
			document.querySelector(".arrow_asc_desc_jheo_js").classList.remove("desc_jheo_js");
			document.querySelector(".arrow_asc_desc_jheo_js").classList.add("asc_jheo_js");

			document.querySelector(".arrow_asc_desc_jheo_js").innerHTML = `<i class="fa-solid fa-arrow-down-a-z"></i>`;
		}
	}
}

function reverseCardElement() {
	const all_card_elements = document.querySelectorAll(
		".content_list_marche_spec_js_jheo .card-list.name_marche_js_jheo"
	);
	document.querySelector(".content_list_marche_spec_js_jheo").innerHTML = "";
	for (let i = all_card_elements.length - 1; i >= 0; i--) {
		document.querySelector(".content_list_marche_spec_js_jheo").appendChild(all_card_elements[i]);
	}
}

function handleFilterFirstChar(letter) {
	const all_card_elements = document.querySelectorAll(
		".content_list_marche_spec_js_jheo .card-list.name_marche_js_jheo"
	);
	let count_not_hidden = 0;
	for (let i = 0; i < all_card_elements.length; i++) {
		if (
			all_card_elements[i].querySelector(".name_to_filter_js_jheo").innerText.charAt(0).toLowerCase() !==
			letter.toLowerCase()
		) {
			all_card_elements[i].classList.add("hidden");
		} else {
			if (all_card_elements[i].classList.contains("hidden")) {
				all_card_elements[i].classList.remove("hidden");
			}
			count_not_hidden++;
		}
	}
	document.querySelector(".content_nombre_result_js_jheo").innerText = count_not_hidden;
}

function refreshDataList() {
	const all_card_elements = document.querySelectorAll(
		".content_list_marche_spec_js_jheo .card-list.name_marche_js_jheo"
	);

	for (let i = 0; i < all_card_elements.length; i++) {
		if (all_card_elements[i].classList.contains("hidden")) {
			all_card_elements[i].classList.remove("hidden");
		}
	}

	pagginationModule(".content_list_marche_spec_js_jheo", ".name_marche_js_jheo", 10);

	document.querySelector(".content_nombre_result_js_jheo").innerText = all_card_elements.length;

	if (document.querySelector(".alphabet_active")) {
		document.querySelector(".alphabet_active").classList.remove("alphabet_active");
	}

	OBJECT_MARKERS_MARCHE.resetToDefaultMarkers();

	document.querySelector(".content_pagination_js_jheo").classList.remove("hidden");
}
