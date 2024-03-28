var slickConfig = {
	slidesToShow: 1,
	slidesToScroll: 1,
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
	slickElement.slick("slickRemove", index);
	updateSlidesToShow();
}
