var slickConfig = {
	slidesToShow: 0,
	slidesToScroll: 1,
	infinite: false,
	arrows: true,
	prevArrow: `<i class="fa-solid fa-circle-chevron-left fs-3 cursor-pointer"></i>`,
	nextArrow: `<i class="fa-solid fa-circle-chevron-right fs-3 cursor-pointer"></i>`,
};

const slickElement = $(".content_list_rubrique_active_jheo_js").slick(slickConfig);

function updateSlidesToShow() {
	let max_slidesToScroll = slickElement[0].slick.slideCount;

	// Adjust slidesToShow based on the number of child elements
	slickConfig.slidesToShow = Math.min(max_slidesToScroll, 5); // Limit to maximum of 5 slidesToShow

	// Reinitialize Slick Carousel with updated configuration
	slickElement.slick("unslick").slick(slickConfig);
}

function addNewElement(newElement) {
	slickElement.slick("slickAdd", newElement);
	updateSlidesToShow();
}

function removeNewElement(index) {
	console.log("remove: " + index);
	slickElement.slick("slickRemove", index);
	updateSlidesToShow();
}

function activeDataTableOnList(id_table_to_active_data_table) {
	$(id_table_to_active_data_table).DataTable({
		searching: false, // Ceci désactive la barre de recherche
		pageLength: 50,
		language: {
			url: "https://cdn.datatables.net/plug-ins/1.13.4/i18n/fr-FR.json",
		},
	});
}
