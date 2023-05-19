window.addEventListener('load', () => {
    const super_admin_tribuG= new SuperAdminTribuG();
    super_admin_tribuG.onInit()

    if( document.querySelectorAll(".list_filter_js_jheo")){
        document.querySelectorAll(".list_filter_js_jheo").forEach(item_filter => {
            item_filter.addEventListener("click", (e) =>{
                document.querySelector(".list_filter_js_jheo.active_js_jheo").classList.remove("active_js_jheo")
                document.querySelector(".list_filter_js_jheo.active").classList.remove("active")
    
                if( !e.target.classList.contains("active")){
                    e.target.classList.add("active")
                }
    
                document.querySelector(".list_filter_js_jheo.active").classList.add("active_js_jheo")
    
                super_admin_tribuG.filterByContentPartisant()
            })
        })
    }

    document.querySelector(".input_search_tribug_js").addEventListener("input" , (e) => {
        super_admin_tribuG.search(e.target.value.toLowerCase());
    })


    document.querySelector(".btn_search_js").addEventListener("click", () => {
        if( document.querySelector(".input_search_tribug_js").value !== "" ){
            super_admin_tribuG.search(document.querySelector(".input_search_tribug_js").value);
        }
    })
})

function getRandomInt(max) {
    return Math.floor(Math.random() * max)*10;
}


function createTd(value)
{   
    const td = document.createElement("td")
    if( typeof(value) === 'number'){
        td.classList.add("content_count_js_jheo"); 
        td.innerText = value;
    }else{
        td.innerText = value.replace(/""/g, "'");
    }
    return td;
}


function deleteTr(){
    document.querySelectorAll(".list_js_jheo").forEach(item => {
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


function createliP(value, is_active=false )
{   
    const li = document.createElement("li");
    li.className= "page-item page_item_js_jheo";
    if( is_active ){
        li.classList.add("active");
    }
    const a = document.createElement("a");
    a.className = "page-link";
    a.innerText = value;

    li.appendChild(a);

    // li.addEventListener("click", (e) => { 
    //     if( value !== "..."){
    //         super_admin_tribuG.checkoutPage(value)
    //     }
    // })

    return li
}






