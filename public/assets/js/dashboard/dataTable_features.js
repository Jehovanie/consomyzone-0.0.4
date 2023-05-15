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
    fetch("/user/dashboard/tribug_json")
        .then(response => response.json())
        .then(result => {
            const { allTribuG } = result;
            const dataSet= dataFormat(allTribuG);
            document.querySelector(".chargment_content_js_jheo").remove();
            $('#myTable').DataTable({
                data: dataSet,
                columns: [
                    { title: '#' },
                    { title: 'Code' },
                    { title: 'Commune' },
                    { title: 'Quartier' },
                    { title: 'Nom tribu G' },
                    { title: 'Efféctif' },
                    { title: '' },
                ],
            });
            const label= document.querySelector("#myTable_filter label")
            const input_search= document.querySelector("#myTable_filter label input");
            input_search.setAttribute('placeholder','Recherche de tribu G');
            
            while (label.firstChild) {
                label.removeChild(label.firstChild);
            }

            label.appendChild(input_search)

            // document.querySelector("#myTable_filter label").innerText = document.querySelector("#myTable_filter label input")
            // document.querySelector("#myTable_filter label input").setAttribute('placeholder','Recherche de tribu G')
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