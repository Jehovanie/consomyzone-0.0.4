window.addEventListener('load', () => {
	
	addMapFerme()
    setDataInLocalStorage("type", "ferme");

	document.querySelectorAll("#list_departements > div> a").forEach(item => {
        item.onclick = (e) => {
            localStorage.removeItem("coordFerme")
        }
    })
	/*format numero*/
	// let items = document.querySelector("#content-details-ferme > div > div.left_content_home > div > div > div.content_tel > ul > li")
	let items = document.querySelectorAll("body > main > div.content_global > div > div > div.left_content_home > div > div > div.content_tel > ul > li")
	if( items.length > 0 ){
		items.forEach(item => {
			let r = item.textContent.replace(/[^0-9]/g, "").split("")
			let num = `+33 ${r[0]} ${r[1]}${r[2]} ${r[3]}${r[4]} ${r[5]}${r[6]} ${r[7]}${r[8]} `
			console.log(num)
			item.textContent = item.textContent.replace(/[0-9]/g, "")+" "+num
		})
	}
});
