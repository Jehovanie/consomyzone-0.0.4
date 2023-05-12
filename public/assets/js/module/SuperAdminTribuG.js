class SuperAdminTribuG{
    constructor(){
        this.defaultData=[];
        this.lastIndexPag=0;
        this.taillePerPage=50;
    }

    async onInit(){
        try{
            const response= await fetch("/user/dashboard/tribug_json");
            const data= await response.json();

            this.settingDataformat(data.allTribuG);
            this.dataTemp= this.defaultData;
            this.bindAction();
        }catch(e){
            console.log(e)
        }
    }

    settingDataformat(data){
        // Code	Commune	Quartier	Nom tribu G	Efféctif
        // {d:"01",dr:"010010000",c:1,i:"l abergement clemenciat",co:"l abergement clemenciat"}
        // {d:"01",dr:"012830302",c:0,i:"parc industriel nord",co:"oyonnax"}
        t.forEach(item => {
            const table_tribug= "tribug_" + item.d + "_"+ item.i.split(" ").map(t=> t.toLowerCase()).join("_")+ "_" + item.co.split(" ").map(t=> t.toLowerCase()).join("_")
            const name_format= "tribug_" + item.d + "_" + item.i.replace(/( )/g , "_") + "_" + item.co.replace(" " , "_");
            const table_exist= data.find(item => item.table_name === name_format)
            
            this.defaultData.push({
                code: item.d,
                commune: item.co,
                quartier: item.co + " " + item.i,
                inv_quartier: item.i + " " + item.co,
                name: name_format,
                nbr_content: table_exist ? table_exist.count : 0,
                link: `/user/dashboard-membre?table=${table_tribug}`
            })
        })
    }

    bindAction(){
        this.createListAndAddPagination(this.dataTemp,this.lastIndexPag);
    }

    displayData(){
        console.log(this.defaultData)
        console.log(this.dataTemp)
        console.log(this.lastIndexPag)
    }

    createList(data,page){
        const startOn= page*this.taillePerPage;
        const tailPerPage= startOn + this.taillePerPage;

        data.forEach((item, index) => {
            const { code, commune, quartier, name,nbr_content, link }= item;
            if(index >= startOn &&  index < tailPerPage ){

                this.createItemAndAddTableTributG(
                    document.querySelector(".content_list_tributG_js_jheo"), ///parent
                    index +1,
                    code,
                    commune,
                    quartier,
                    name,
                    nbr_content,
                    link
                );
            }
        })
    }

    createItemAndAddTableTributG(parent,index,code,commune,quartier, name,nbr_content, link) {

        const tr = document.createElement("tr");
        tr.className = "list_js_jheo"
        tr.setAttribute("id",name.replace(" ", "_") +"_js_jheo");
    
        tr.appendChild(createTd(index));
        tr.appendChild(createTd(code));
        tr.appendChild(createTd(commune));
        tr.appendChild(createTd(quartier));
    
        const td_name = document.createElement("td");
    
        td_name.innerText = name;
    
        const td_content_link = document.createElement("td");
    
        const a = document.createElement("a");
        a.setAttribute("href", link);
        a.className = "btn btn-primary";
        a.innerText = "Voir";
        
        td_content_link.appendChild(a);
        
        tr.appendChild(td_name);
        tr.appendChild(createTd(parseInt(nbr_content)));
        tr.appendChild(td_content_link);
    
        parent.appendChild(tr);
    }

    filterByContentPartisant(){

        this.resetListItem();

        this.dataTemp= this._filterByContentPartisantAction(this.defaultData);

        const query= document.querySelector(".input_search_tribug_js").value === "" ? null: document.querySelector(".input_search_tribug_js").value;
        this.dataTemp= this._searchAction(this.dataTemp,query)

        this.createListAndAddPagination(this.dataTemp,this.lastIndexPag);
        this.displayData();
    }

    _filterByContentPartisantAction(dataToFilter){
        const data_type= document.querySelector(".list_filter_js_jheo.active_js_jheo").getAttribute("data-type");
        let data_filtered= [];
        console.log(dataToFilter);

        if( parseInt(data_type) === 1 ){
            data_filtered = dataToFilter.filter(item => parseInt(item.nbr_content) > 0)
            console.log(data_filtered)
        }else if( parseInt(data_type) === 0 ){
            data_filtered = dataToFilter.filter(item => parseInt(item.nbr_content) === 0)
            console.log(data_filtered)
        }else{
            return dataToFilter;
        }

        return data_filtered;
    }

    resetListItem(){
        ////delete all list
        document.querySelectorAll(".list_js_jheo").forEach(listItem => {
           listItem.parentElement.removeChild(listItem);
        })

        ///delete pagination page-item
        document.querySelectorAll(".page-item").forEach(list_pag => {
            list_pag.parentElement.removeChild(list_pag);
        })
    }

    search(query){
        this.resetListItem();
        this.dataTemp= this._searchAction(this.defaultData, query);
        this.dataTemp= this._filterByContentPartisantAction(this.dataTemp);
        console.log(this.dataTemp);
        this.createListAndAddPagination(this.dataTemp,this.lastIndexPag);
    }

    _searchAction(dataToFilter, query=null){
        if(!query){
            return dataToFilter;
        }
        return dataToFilter.filter( item => {
            if(query.length === 2 ){
                return item.code.includes(query)
            }else{
                return item.name.includes(query) || item.commune.includes(query) || item.quartier.includes(query) || item.inv_quartier.includes(query)
            }
        })
    }


    createPagination(data, indexActivePag){
        const nbr_btn = Math.ceil(data.length / 50 );
        nbr_btn > 3 && document.querySelector(".pagination").appendChild(createliP("Previous"))

        const start= (parseInt(indexActivePag) > 2) && (parseInt(indexActivePag) < nbr_btn-4 ) ? parseInt(indexActivePag) - 2 : 0;
        const end= (parseInt(indexActivePag) > start + 3  ) && (parseInt(indexActivePag) < nbr_btn-2) ? parseInt(indexActivePag) +1 : nbr_btn ;
    
        if( nbr_btn > 10 ){
            for(let i=start; i<start+3 ; i++ ){
                document.querySelector(".pagination").appendChild( createliP(i+1,parseInt(indexActivePag) === i+1 ? true: false) )
            }

            document.querySelector(".pagination").appendChild( createliP("..."))

            for(let i=end-3; i<end ; i++ ){
                document.querySelector(".pagination").appendChild( createliP(i+1,parseInt(indexActivePag)=== i+1 ? true: false))
            }
        }else if( nbr_btn > 1 && nbr_btn < 11 ){
            for(let i=0; i<nbr_btn ; i++ ){
                document.querySelector(".pagination").appendChild(createliP(i+1, parseInt(indexActivePag)=== i+1 ? true: false))
            }
        }

        nbr_btn > 3 && document.querySelector(".pagination").appendChild(createliP("Next"))

        if(document.querySelector(".page_item_js_jheo")){
            if( parseInt(indexActivePag) === 1 ){
                const p01 = document.querySelector(".pagination");
                p01.firstChild.classList.add("disabled")
            }
    
            if( parseInt(indexActivePag) === nbr_btn ){
                const p01 = document.querySelector(".pagination");
                p01.lastElementChild.classList.add("disabled")
            }
    
            this.lastIndexPag=indexActivePag;
            this.handleClickOnPagination();
        }
    }


    createListAndAddPagination(data,page){
        this.displayData();
        this.createList(data, page);
        this.createPagination(data,page);
    }
    
    handleClickOnPagination(){
        document.querySelectorAll(".page_item_js_jheo").forEach(li => {
            if(!li.classList.contains("disabled")){
                const that= this
                li.addEventListener("click", (e) =>{
                    that.checkoutPage(e.target.innerText)
                })
            }
        })
    }

    checkoutPage(index_pag){
        this.resetListItem();
        const index_current= index_pag === "Previous" ? parseInt(this.lastIndexPag)-1 : (index_pag === "Next" ? parseInt(this.lastIndexPag)+1 : index_pag );
        this.createPagination(this.dataTemp, index_current)
        this.createList(this.dataTemp,this.lastIndexPag);
    }
}