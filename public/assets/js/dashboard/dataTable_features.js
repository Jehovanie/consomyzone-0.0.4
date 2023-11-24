// let table = new DataTable('#myTable');
// console.log(table);

// {
//     data: dataSet,
//     columns: [
//         { title: 'Name' },
//         { title: 'Position' },
//         { title: 'Office' },
//         { title: 'Extn.' },
//         { title: 'Start date' },
//         { title: 'Salary' },
//     ],
// }

window.addEventListener('load', () => {

    document.querySelector(".content_global_super_admin_js_jheo").innerHTML = `
        <div class="content_chargement content_chargement_js_jheo">
            <div class="spinner-border spinner-border text-info" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
    `
    fetch("/user/dashboard/tribug_json")
    .then(response => response.json())
    .then(result => {
        const { allTribuG } = result;
        const dataSet= dataFormat(allTribuG);
        
        deleteChargement();
        bindContentTable();

        $('#myTable').DataTable({
            data: dataSet,
            order: [[5, 'desc']],
            
            initComplete: function () {

                document.querySelectorAll('.span_th_js_jheo').forEach( item => {
                    item.parentElement.innerHTML += `<input class="input_column input_column_js_jheo" type="text" placeholder="Search"/>`
                })

                // Apply the search
                this.api()
                    .columns()
                    .every(function () {
                        var that = this;
                        console.log(this)
                        $('.input_column_js_jheo', this.header()).on('keyup change clear', function () {
                            if (that.search() !== this.value) {
                                that.search(this.value).draw();
                            }
                        });
                    });
            },
            language: {
                url: '//cdn.datatables.net/plug-ins/1.13.4/i18n/fr-FR.json',
            }
        });

        const label= document.querySelector("#myTable_filter label")
        const input_search= document.querySelector("#myTable_filter label input");
        if(input_search){
            input_search.setAttribute('placeholder','Recherche de tribu G');
        
            while (label.firstChild) {
                label.removeChild(label.firstChild);
            }

            label.appendChild(input_search)

        }

    })

    document.querySelector(".content_global_super_admin_tribu_t_js_jheo").innerHTML = `
        <div class="content_chargement content_chargement_tribu_t_js_jheo">
            <div class="spinner-border spinner-border text-info" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
    `

    fetch("/user/dashboard/tribut_json")
    .then(response => response.json())
    .then(result => {
        const { allTribuT } = result;
        const dataSet= dataFormatTribuT(allTribuT);
        
        deleteChargementTrubuT();
        bindContentTableTribuT();

        $('#myTableTribut').DataTable({
            data: dataSet,
            order: [[5, 'desc']],
            
            initComplete: function () {

                document.querySelectorAll('.span_th_js_tribu_t_jheo').forEach( item => {
                    item.parentElement.innerHTML += `<input class="input_column input_column_tribu_t_js_jheo" type="text" placeholder="Search"/>`
                })

                // Apply the search
                this.api()
                    .columns()
                    .every(function () {
                        var that = this;
                        console.log(this)
                        $('.input_column_tribu_t_js_jheo', this.header()).on('keyup change clear', function () {
                            if (that.search() !== this.value) {
                                that.search(this.value).draw();
                            }
                        });
                    });
            },
            language: {
                url: '//cdn.datatables.net/plug-ins/1.13.4/i18n/fr-FR.json',
            }
        });
        const label= document.querySelector("#myTable_filter_tribu_t label")
        const input_search= document.querySelector("#myTable_filter_tribu_t label input");
        if(input_search){
            input_search.setAttribute('placeholder','Recherche de tribu T');
        
            while (label.firstChild) {
                label.removeChild(label.firstChild);
            }

            label.appendChild(input_search)

        }

    })
})


function dataFormat(dataToFormat){
    const data= [];
    t.forEach((item, index) => {
        const tribug= "tribug_" + item.d + "_"+ item.i.split(" ").map(t=> t.toLowerCase()).join("_")+ "_" + item.co.split(" ").map(t=> t.toLowerCase()).join("_")
        const name_format= "tribug_" + item.d + "_" + item.i.replace(/( )/g , "_") + "_" + item.co.replace(" " , "_");
        const table_exist= dataToFormat.find(item => name_format.includes(item.table_name))
        const table_tribug= tribug.length > 30 ? tribug.substr(0,30) : tribug
        data.push([
            index +1,
            item.d,
            item.co,
            item.co + " " + item.i,
            name_format,
            table_exist ? table_exist.count : 0,
            "<a class='btn btn-primary' href=/user/dashboard-membre?table="+table_tribug+ ">Voir</a>"
        ])
        // data.push({
        //     code: item.d,
        //     commune: item.co,
        //     quartier: item.co + " " + item.i,
        //     inv_quartier: item.i + " " + item.co,
        //     name: name_format,
        //     nbr_content: table_exist ? table_exist.count : 0,
        //     link: `/user/dashboard-membre?table=${table_tribug}`
        // })
    })
    return data;
}

function dataFormatTribuT(dataToFormat){
    const data= [];
    t.forEach((item, index) => {
        const tribut= "tribut_" + item.d + "_"+ item.i.split(" ").map(t=> t.toLowerCase()).join("_")+ "_" + item.co.split(" ").map(t=> t.toLowerCase()).join("_")
        const name_format= "tribut_" + item.d + "_" + item.i.replace(/( )/g , "_") + "_" + item.co.replace(" " , "_");
        const table_exist= dataToFormat.find(item => name_format.includes(item.table_name))
        const table_tribut= tribut.length > 30 ? tribut.substr(0,30) : tribut
        data.push([
            index +1,
            item.d,
            item.co,
            item.co + " " + item.i,
            name_format,
            table_exist ? table_exist.count : 0,
            // "<a class='btn btn-primary' href=/user/dashboard-membre?table="+table_tribug+ ">Voir</a>"
        ])
        // data.push({
        //     code: item.d,
        //     commune: item.co,
        //     quartier: item.co + " " + item.i,
        //     inv_quartier: item.i + " " + item.co,
        //     name: name_format,
        //     nbr_content: table_exist ? table_exist.count : 0,
        //     link: `/user/dashboard-membre?table=${table_tribug}`
        // })
    })
    return data;
}

function addChargement(){

}

function deleteChargement(){
    document.querySelector(".content_chargement_js_jheo").remove();
}

function deleteChargementTrubuT(){
    document.querySelector(".content_chargement_tribu_t_js_jheo").remove();
}

function bindContentTable(){

    document.querySelector(".content_global_super_admin_js_jheo").innerHTML = `
    <div class="table-responsive">
        <table class="table table_content table-hover" id="myTable">
            <thead class="thead-dark">
                <tr>
                    <th>#</th>
                    <th>
                        <span class="span_th_js_jheo">Code</span>
                    </th>
                    <th>
                        <span class="span_th_js_jheo">Commune</span>
                    </th>
                    <th>
                        <span class="span_th_js_jheo">Quartier</span>
                    </th>
                    <th>
                        <span class="span_th_js_jheo">Tribu G</span>
                    </th>
                    <th>
                        <span class="span_th_js_jheo">Efféctif</span>
                    </th>
                    <th></th>
                </tr>
            </thead>
            <tbody class="content_list_tributG_js_jheo">
            </tbody>
        </table>
        
    </div>
    `
}

function bindContentTableTribuT(){

    document.querySelector(".content_global_super_admin_tribu_t_js_jheo").innerHTML = `
    <div class="table-responsive">
        <table class="table table_content table-hover" id="myTableTribuT">
            <thead class="thead-dark">
                <tr>
                    <th>#</th>
                    
                    
                    
                    <th>
                        <span class="span_th_tribu_t_js_jheo">Tribu T</span>
                    </th>
                    <th>
                        <span class="span_th_tribu_t_js_jheo">Efféctif</span>
                    </th>
                    <th></th>
                </tr>
            </thead>
            <tbody class="content_list_tributT_js_jheo">
            </tbody>
        </table>
        
    </div>
    `
}

/**
 * @Author Nantenaina
 * Où: On utilise cette fonction dans l'onglet validation adresse de la rubrique Super Admin 
 * Localisation du fichier: dataTable_features.js,
 * Je veux: voir la liste des adresses à valider
 *
*/
function getListeInfoTovalidate(e){
    
    let linkActives = document.querySelectorAll("#navbarSuperAdmin > ul > li > a")
    linkActives.forEach(link=>{
        if(link.classList.contains("text-primary"))
            link.classList.remove("text-primary")
    })
    e.target.classList.add("text-primary")
    document.querySelector("#list-tribu-g").style.display = "none"
    // document.querySelector("#list-tribu-t").style.display = "none"
    document.querySelector("#list-demande-partenaire").style.display = "none"
    document.querySelector("#list-infoAvalider").style.display = "block"
    let _table = `<table class="table" id="listeRestoAvaliderTable">
                    <thead>
                        <tr>
                            <th scope="col">Nom</th>
                            <th scope="col">Adresse</th>
                            <th scope="col">Téléphone</th>
                            <th scope="col">Demandeur</th>
                            <th scope="col">Status</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                    `

    fetch("/user/liste/information/to/update")
        .then(response => response.json())
        .then(r => {
            console.log(r)
            let _tr = "";
            if(r.length > 0){
                for (const items of r) {
                    let item = items.info
                    let _adresse = item.numvoie + " " + item.typevoie + " " + item.nomvoie + " " + item.compvoie + " " + item.codpost + " " + item.commune
                    _adresse = _adresse.replace(/\s+/g, ' ').trim();
                    _tr += `<tr style="text-align:center;vertical-align:middle;">
                            <td>${item.denominationF}</td>
                            <td>${_adresse}</td>
                            <td>${item.tel}</td>
                            <td><a href="/user/profil/${item.userId}" style="color:blue;">${items.userFullName}</a></td>
                            <td><span style="background-color:blue; border-radius:5px; color:white; padding:5px">A valider</span></td>
                            <td><button class="btn btn-info" onclick="getRestoInfoToValidate(${item.restoId}, ${item.userId})">Voir</button></td>
                        </tr>`
                }
            }else{
                _tr = `<tr><td colspan="4">Aucune information à valider</td></tr>`;
            }
            _table += _tr + "</tbody></table>"
            document.querySelector(".content_list_infoAvalider_js").innerHTML = _table
        })

}

function getRestoInfoToValidate(restoId, userId){
    document.querySelector(".navbar-expand-lg").display = "none";
    $("#infoRestoToValidateModal").modal("show")
    //document.querySelector(".navbar-expand-lg").display = "block";
    fetch(`/user/information/${restoId}/etablissement/${userId}`)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            let contentCurrentInfo = document.querySelector(".content_current_info_nanta_js")
            let newCurrentInfo = document.querySelector(".content_new_info_nanta_js")
            let new_info = data.new_info
            let current_info = data.current_info
            if(current_info.restaurant){
                contentCurrentInfo.querySelector("span.rubrique").textContent = "RESTAURANT"
                contentCurrentInfo.querySelector("#rubriqueName > a").textContent = current_info.denominationF
                let current_adresse = current_info.numvoie + " " + current_info.typevoie + " " + current_info.nomvoie + " " + current_info.compvoie + " " + current_info.codpost + " " + current_info.villenorm
                current_adresse = current_adresse.replace(/\s+/g, ' ').trim();
                contentCurrentInfo.querySelector(".cmz-adresse > a").textContent = current_adresse.toLocaleLowerCase()

                if(current_info.tel != ""){
                    contentCurrentInfo.querySelector(".tel > .numero").textContent = current_info.tel
                    contentCurrentInfo.querySelector(".cmz-tel").style.display = "block"
                }else{
                    contentCurrentInfo.querySelector(".tel > .numero").textContent = ""
                    contentCurrentInfo.querySelector(".cmz-tel").style.display = "none"
                }
                contentCurrentInfo.querySelector(".cmz-categories-list").innerHTML = ""
                checkRestoMenu(current_info,contentCurrentInfo.querySelector(".cmz-categories-list"))

            }else{
                contentCurrentInfo.querySelector("span.rubrique").textContent = "GOLF"
            }

            if(new_info.restaurant){
                newCurrentInfo.querySelector("span.rubrique").textContent = "RESTAURANT"
                newCurrentInfo.querySelector("#rubriqueName > a").textContent = new_info.denominationF
                let current_adresse = new_info.numvoie + " " + new_info.typevoie + " " + new_info.nomvoie + " " + new_info.compvoie + " " + new_info.codpost + " " + new_info.villenorm
                current_adresse = current_adresse.replace(/\s+/g, ' ').trim();
                newCurrentInfo.querySelector(".cmz-adresse > a").textContent = current_adresse.toLocaleLowerCase()

                if(new_info.tel != ""){
                    newCurrentInfo.querySelector(".tel > .numero").textContent = new_info.tel
                    newCurrentInfo.querySelector(".cmz-tel").style.display = "block"
                }else{
                    newCurrentInfo.querySelector(".tel > .numero").textContent = ""
                    newCurrentInfo.querySelector(".cmz-tel").style.display = "none"
                }
                newCurrentInfo.querySelector(".cmz-categories-list").innerHTML = ""
                checkRestoMenu(new_info,newCurrentInfo.querySelector(".cmz-categories-list"))

            }else{
                newCurrentInfo.querySelector("span.rubrique").textContent = "GOLF"
            }

        })
}

function checkRestoMenu(resto,selector){
    if(resto.brasserie == 1)
        selector.innerHTML += `<span class="cmz-category">brasserie</span>`
    if(resto.creperie == 1)
        selector.innerHTML += `<span class="cmz-category">creperie</span>`
    if(resto.fastFood == 1)
        selector.innerHTML += `<span class="cmz-category">fast_food</span>`
    if(resto.pizzeria == 1)
        selector.innerHTML += `<span class="cmz-category">pizzeria</span>`

    if(resto.boulangerie == 1)
        selector.innerHTML += `<span class="cmz-category">boulangerie</span>`
    if(resto.cafe == 1)
        selector.innerHTML += `<span class="cmz-category">cafe</span>`
    if(resto.bar == 1)
        selector.innerHTML += `<span class="cmz-category">bar</span>`
    if(resto.cuisineMonde == 1)
        selector.innerHTML += `<span class="cmz-category">cuisine_monde</span>`
    if(resto.salonThe == 1)
        selector.innerHTML += `<span class="cmz-category">salon_the</span>`
}

