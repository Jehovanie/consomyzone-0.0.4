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