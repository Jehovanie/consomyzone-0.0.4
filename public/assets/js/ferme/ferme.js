///script qui prends plus des resultats en utilisant AJAX
// if( document.querySelector(".plus_result")){
// 	const more_result =  document.querySelector(".plus_result");

// 	more_result.addEventListener("click" , () => {
// 		$.ajax({
// 			url: "/ferme",
// 			type: "POST",
// 			dataType: "json",
// 			data :{
// 				page :parseInt(more_result.getAttribute("id"))
// 			},
			
// 			success: (result , status ) =>{
// 				console.log(result)
// 				const more = document.querySelector(".plus_result");
// 				result.forEach(element => {
// 					const div= document.createElement("div");
// 					div.classList.add("element");
// 					const p = document.createElement("p")
// 					p.innerHTML ="<span class='id_departement'>"+ element.id + "</span>  " + element.departement;
					
// 					div.appendChild(p);

// 					const a=document.createElement("a");
// 					a.classList.add("plus");
// 					a.setAttribute("href" , "/ferme/departement/" + element.departement + "/" + element.id );

// 					a.innerText ="Voir plus";

// 					div.appendChild(a);

// 					const parent = more.parentElement;
// 					parent.insertBefore(div , more);
					
// 				});
				
// 			},
// 			error : function(xhr, textStatus, errorThrown) {
// 				alert(textStatus);
// 				console.log('Ajax request failed.');
// 			}
// 		});

// 		const new_req = document.querySelector(".plus_result");
// 		new_req.setAttribute("id" , parseInt(new_req.getAttribute("id")) + 1 );
// 	})
// }
/*format numero*/
// let items = document.querySelector("#content-details-ferme > div > div.left_content_home > div > div > div.content_tel > ul > li")
let items = document.querySelectorAll("body > main > div.content_global > div > div > div.left_content_home > div > div > div.content_tel > ul > li")
items.forEach(item => {
	let r = item.textContent.replace(/[^0-9]/g, "").split("")
	let num = `+33 ${r[0]} ${r[1]}${r[2]} ${r[3]}${r[4]} ${r[5]}${r[6]} ${r[7]}${r[8]} `
	console.log(num)
	item.textContent = item.textContent.replace(/[0-9]/g, "")+" "+num
})

