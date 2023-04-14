function faireTraduction(attribute, lng) { 
	
	var xrhFile = new XMLHttpRequest();
		//load content data 
	xrhFile.open("GET", "/assets/js/Langue/"+lng+".json", false);
	xrhFile.onreadystatechange = function ()
	{
		if(xrhFile.readyState === 4)
		{
			if(xrhFile.status === 200 || xrhFile.status == 0)
			{
				var LngObject = JSON.parse(xrhFile.responseText);
				var allDom = document.getElementsByTagName("*");
				for(var i =0; i < allDom.length; i++){
					var elem = allDom[i];
					var key = elem.getAttribute(attribute);
					if(key != null) {
						elem.innerHTML = LngObject[key]  ;
					}
				}
			
			}
		}
	}
	xrhFile.send();
}
		
		
function traduire(lng, tagAttr){
	
	faireTraduction(tagAttr, lng)

	if(lng == 'en'){
		$("#enTranslator").prop('disabled', true);
		$("#frTranslator").prop('disabled', false);
	} 
	if(lng == 'fr'){
		// $("#frTranslator").css('color', '#f4623a');
		$("#frTranslator").prop('disabled', true);
		$("#enTranslator").prop('disabled', false);
	}
}
	
$(document).ready(function(){

	if(localStorage.getItem("langue")){
		let lng = localStorage.getItem("langue")
		traduire(lng, 'lng-tag')
		console.log("lng : " + lng);
	}
	//This is id of HTML element (English) with attribute lng-tag
	if($("#enTranslator") && $("#frTranslator")){
		$("#enTranslator").click(function(){
			traduire('en', 'lng-tag');
			localStorage.setItem("langue", "en");
		});
		//This is id of HTML element (Khmer) with attribute lng-tag
		$("#frTranslator").click(function(){
			traduire('fr', 'lng-tag');
			localStorage.setItem("langue", "fr");
			//localStorage.getItem("lastname");
		});
	}
	
});