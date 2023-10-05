window.addEventListener('load', () => { 
    const id_dep = new URL(window.location.href).pathname.split('/')[4]
    const nom_dep = new URL(window.location.href).pathname.split('/')[3]
    getDataSpecGolfMobile(nom_dep, id_dep)
})


//// HIDE DETAILS STATION POP UP
	document.querySelector(".close_details_jheo_js").addEventListener("click", () => { 
		document.getElementById("remove-detail-golf").setAttribute("class", "hidden")
	})
	addListDepartGolf() 
	