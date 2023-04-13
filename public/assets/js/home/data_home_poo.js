class DataHome{
    all_data= [];
    url= null;
    constructor(url){
        this.url= url;
    }

     fetchData(){
        fetch(this.url).then(result => result.json())
        .then(parsedResult =>{
            console.log(parsedResult);
            this.all_data= parsedResult;
            
        })
    }

    showMap(id_dep=null){
        const geos = []
        if(id_dep){
            if (id_dep == 20) {
                for (let corse of ['2A', '2B']){
                    geos.push(franceGeo.features.find(element => element.properties.code == corse))
                }
            } else {
                geos.push(franceGeo.features.find(element => element.properties.code == id_dep))
            }
        }else{
            for (let f of franceGeo.features) {
                geos.push(f)
            }
        }
        create_map_content(geos,id_dep);
    }

    showAllData(){

    }

}