/// script to manager the user select  in filter checkbox.
if( document.querySelectorAll(".checkbox_filter .checkbox")){
	const all_checkbox = document.querySelectorAll(".checkbox_filter .checkbox");
	const checkbox_type_tous = document.querySelector(".checkbox_filter #tous_type_filter");
	
	////special for the checkbout tous.
	checkbox_type_tous.addEventListener("input", () =>{
		if( checkbox_type_tous.checked ){
			all_checkbox.forEach(item => {
				item.checked=true;
			})
			const input_min = document.querySelector(".input_min")
			const input_max = document.querySelector(".input_max")
			////request with filter for all type.
			changeDapartLinkCurrent("tous")
			filterByPrice(parseFloat(input_min.value), parseFloat(input_max.value), "tous")
		}else{
			all_checkbox.forEach(item => {
				item.checked=false;
			})
			changeDapartLinkCurrent("tous")
			filterByPrice(2.5,3, "tous")
		}
	})

	////special for over the checkbox tous.
	for( let i = 1; i< all_checkbox.length; i++){
		const single_checkbox= all_checkbox[i];
		single_checkbox.addEventListener("input", () => {
			checkbox_type_tous.checked= false;
			
			var value_to_check_all = 0;
			let type=[]
			for ( let k=1; k< all_checkbox.length;k++){
				if( all_checkbox[k].checked === true){
					value_to_check_all++;
					type.push(all_checkbox[k].value);
				}
			}

			if( value_to_check_all === all_checkbox.length-1){
				checkbox_type_tous.checked= true;
			}

			const input_min = document.querySelector(".input_min")
			const input_max = document.querySelector(".input_max")
			////request with filter for all type.
			changeDapartLinkCurrent(type.join("@"))
			filterByPrice(parseFloat(input_min.value), parseFloat(input_max.value),type.join("@"))

		})
	}

}else{
	console.log("ERREUR: on the selection in checkbox_filter checkbox")
}

/// script for filtre slide bar
const rangeInput = document.querySelectorAll( ".range_input input"),
priceInput = document.querySelectorAll( ".price_input input"),
progress = document.querySelector(".slider .proggress");

let priceGap = 0.1;
let minVal_sortie = 0,maxVal_sortie = 0;

priceInput.forEach(input => {
    input.addEventListener("input" , e => {
        let minVal = parseFloat(priceInput[0].value), maxVal = parseFloat(priceInput[1].value);

        if( (maxVal - minVal >= priceGap) && maxVal <= 3 ){
            ///if active input is min input  
            if(e.target.className ==="input_min"){
				rangeInput[0].value= minVal;
                progress.style.left = (minVal / rangeInput[0].max) * 100 + "%";
            }else{
                rangeInput[1].value=maxVal;
                progress.style.right = 100 - (maxVal / rangeInput[1].max) * 100 + "%";
            }
        }
		
		minVal_sortie = minVal;
		maxVal_sortie = maxVal;
		if(document.querySelector(".checkbox_filter .checkbox").checked){
			changeDapartLinkCurrent(type.join("@"))
			filterByPrice(minVal_sortie, maxVal_sortie, "tous")
		}else{
			const all_check_box = document.querySelectorAll(".checkbox_filter .checkbox");
			let tab_check = [];
			for(let i = 1; i<all_check_box.length ; i++){
				if(all_check_box[i].checked){
					tab_check.push(all_check_box[i].value);
				}
			}
			changeDapartLinkCurrent(type.join("@"))
			filterByPrice(minVal_sortie, maxVal_sortie, tab_check.join("@"))
		}

    })

})

rangeInput.forEach(input => {
    input.addEventListener("input" , e => {
        let minVal = parseFloat(rangeInput[0].value),
        maxVal = parseFloat(rangeInput[1].value);
        if( maxVal - minVal < priceGap ){
            ///if active slider is min slider  
            if(e.target.className ==="range_min"){
                rangeInput[0].value= maxVal - priceGap;
            }else{
                rangeInput[1].value= minVal + priceGap;
            }
        }else{
            priceInput[0].value = minVal;
            priceInput[1].value = maxVal;
            progress.style.left = (minVal / rangeInput[0].max) * 100 + "%";
            progress.style.right = 100 - (maxVal / rangeInput[1].max) * 100 + "%";
        }

		minVal_sortie = minVal;
		maxVal_sortie = maxVal;
    })


	input.addEventListener("mouseup", () => {
		if(document.querySelector(".checkbox_filter .checkbox").checked){
			changeDapartLinkCurrent("tous")
			filterByPrice(minVal_sortie, maxVal_sortie, "tous")
		}else{
			const all_check_box = document.querySelectorAll(".checkbox_filter .checkbox");
			/// format type filter using for the filter.
			let tab_check = [];
			for(let i = 1; i<all_check_box.length ; i++){
				if(all_check_box[i].checked){
					tab_check.push(all_check_box[i].value);
				}
			}
			changeDapartLinkCurrent(tab_check.join("@"))
			filterByPrice(minVal_sortie, maxVal_sortie, tab_check.join("@"))
		}
	})

})
