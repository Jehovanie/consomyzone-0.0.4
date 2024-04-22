var slickConfig = {
	slidesToShow: 0,
	slidesToScroll: 1,
	infinite: false,
	arrows: true,
	prevArrow: `<i class="fa-solid fa-circle-chevron-left fs-3 cursor-pointer color_blue"></i>`,
	nextArrow: `<i class="fa-solid fa-circle-chevron-right fs-3 cursor-pointer color_blue"></i>`,
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

//// data table object //////////////////////////////////////
let DataTableObject = function () {
	dataTableInstance = null;
};

DataTableObject.prototype = {
	activeDataTableOnList: (id_table_to_active_data_table) => {
		dataTableInstance = $(id_table_to_active_data_table).DataTable({
			searching: true, // Ceci désactive la barre de recherche
			pageLength: 50,
			language: {
				url: "https://cdn.datatables.net/plug-ins/1.13.4/i18n/fr-FR.json",
			},
		});
	},

	addDataTableOnList: (data) => {
		data.forEach((item_data) => {
			dataTableInstance?.row.add([item_data]);
		});

		dataTableInstance?.draw();
	},

	removeOneElement: (element) => {
		// console.log(dataTableInstance.rows().eq(0));

		// dataTableInstance.rows().data().each((rowData) => {
		// 	// rowData contient les données de la ligne actuelle
		// 	console.log(rowData);
		// });

		const domparse = new DOMParser();
		dataTableInstance?.rows()?.every(function (rowIdx, tableLoop, rowLoop) {
			var rowData = this.data(); // Données de la ligne actuelle
			var card_list = rowData[0]; // Accès à la deuxième colonne (indice 1)

			let text_html = domparse.parseFromString(card_list, "text/html"); //
			var text = text_html.querySelector(`.${element.type}_${element.id}`);

			if (text !== null) {
				console.log(card_list);
				console.log(text);
			}
		});
	},
};

const dataTable = new DataTableObject();

function activeDataTableOnList(id_table_to_active_data_table) {
	dataTable.activeDataTableOnList(id_table_to_active_data_table);
}

function addDataTableOnList(data) {
	dataTable.addDataTableOnList(data);
}

function removeOneElement(element) {
	dataTable.removeOneElement(element);
}

///// end of datatable

function injectSlider(start_min_max = { min: 0, max: 5 }) {
	var skipSlider = document.getElementById("skipstep");
	var skipValues = [document.getElementById("skip-value-lower"), document.getElementById("skip-value-upper")];

	noUiSlider.create(skipSlider, {
		start: [start_min_max.min, start_min_max.max],
		connect: true,
		behaviour: "drag",
		step: 0.1,
		range: {
			min: 0,
			max: 5,
		},
		format: {
			from: function (value) {
				return parseFloat(value).toFixed(1);
			},
			to: function (value) {
				return parseFloat(value).toFixed(1);
			},
		},
	});

	skipSlider.noUiSlider.on("update", function (values, handle) {
		skipValues[handle].innerHTML = values[handle];
	});
}

function resetSliderNotation() {
	var skipSlider = document.getElementById("skipstep");
	skipSlider.noUiSlider.set([0, 5]);
}
