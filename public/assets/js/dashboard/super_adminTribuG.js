createList(t);
// createPagination(t);

if( document.querySelector(".input_search_tribug_js").value !== "" ){
    search(document.querySelector(".input_search_tribug_js").value);
}

document.querySelector(".input_search_tribug_js").addEventListener("input" , (e) => {
    search(e.target.value.toLowerCase());
})

document.querySelector(".btn_search_js").addEventListener("click", () => {
    if( document.querySelector(".input_search_tribug_js").value !== "" ){
        search(document.querySelector(".input_search_tribug_js").value);
    }
})


function search(query){
    const results= t.filter( item => {
        if(query.length === 2 ){
            return item.d.includes(query)
        }else{
           const quartier = item.co + " " + item.i;
           const inv_quartier = item.i + " " + item.co;
           return item.dr.includes(query) || item.co.includes(query) || item.i.includes(query) || quartier.includes(query) || inv_quartier.includes(query)
        }
    })

    deleteTr();
    // deletePagination()
    createList(results);
    // createPagination(results)
}


function createList(data){
    
    data.forEach((item, index) => {
        // {d:"01",dr:"010010000",c:1,i:"l abergement clemenciat",co:"l abergement clemenciat"}
        // {d:"01",dr:"012830302",c:0,i:"parc industriel nord",co:"oyonnax"}
        if( index < 100 ){
            createItemAndAddTableTributG(
                document.querySelector(".content_list_tributG_js_jheo"), ///parent
                item.d,
                item.co,
                item.co + " " + item.i,
                "tribug_" + item.d + "_" + item.i.replace(/( )/g , "_") + "_" + item.co.replace(" " , "_"),
                // "/user/dashboard-membre?table=tribug_" + item.d + "_"+ item.co.split(" ").map(t=> t.toLowerCase()).join("_")+ "_" + item.i.split(" ").map(t=> t.toLowerCase()).join("_")
                "/user/dashboard-membre?table=tribug_" + item.d + "_"+ item.i.split(" ").map(t=> t.toLowerCase()).join("_")+ "_" + item.co.split(" ").map(t=> t.toLowerCase()).join("_")
            );
        }
    })
    
}




function createItemAndAddTableTributG(parent,code,commune,quartier, name, link) {

    const tr = document.createElement("tr");
    tr.className = "list_js"

    tr.appendChild(createTd(code));
    tr.appendChild(createTd(commune));
    tr.appendChild(createTd(quartier));

    const td_name = document.createElement("td");
    td_name.innerText = name;

    const td_content_link = document.createElement("td");

    const a = document.createElement("a");
    a.setAttribute("href", link);
    a.className = "btn btn-primary";
    a.innerText = "Voir Membre";

    td_content_link.appendChild(a);

    tr.appendChild(td_name);
    tr.appendChild(td_content_link);

    parent.appendChild(tr);

}


function createTd(value)
{   
    const td = document.createElement("td")
    td.innerText = value.replace(/""/g, "'");
    return td;
}


function deleteTr(){
    document.querySelectorAll(".list_js").forEach(item => {
        item.remove()
    })
}

function createPagination(data){
    const nbr_btn = Math.ceil(data.length / 100 );
    data.length > 0 && document.querySelector(".pagination").appendChild(createliP("Previous"))

    if( nbr_btn > 10 ){
        for(let i=0; i<10 ; i++ ){
            const li = ( i < 3 || i > 6 ) ?  createliP(i+1) : createliP("...");
            document.querySelector(".pagination").appendChild(li)
        }
    }else{
        for(let i=0; i<nbr_btn ; i++ ){
            li = createliP(i+1)
            document.querySelector(".pagination").appendChild(li)
        }
    }
    data.length > 0 && document.querySelector(".pagination").appendChild(createliP("next"))
}
function deletePagination(){
    document.querySelectorAll(".pagination li").forEach(item => item.remove())
}


function createliP(value)
{   
    const li = document.createElement("li");
    li.className= "page-item";
    const a = document.createElement("a");
    a.className = "page-link";
    a.innerText = value;

    li.appendChild(a);

    // li.addEventListener("click", (e) => { console.log()})

    return li
}






