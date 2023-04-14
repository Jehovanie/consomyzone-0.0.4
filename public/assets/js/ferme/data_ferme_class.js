// type of data 
// var addressPoints = [
//     [-37.8839, 175.3745188667, "571"],
//     ....
// ]

window.addEventListener('load', () => {
    
	fetch("/getLatitudeLongitudeFerme")
    .then(result => result.json())
    .then(parsedResult => {
        if( parsedResult ){

            var mc = new MarckerCluster();
            mc.setcenter(46.227638, 2.213749)
            mc.setZoom(5)
            mc.bindMap();
            mc.createMarkers({ 
                chunkedLoading: true,
                showCoverageOnHover: false,
            })

            ///// 0 -> 4717
            parsedResult.forEach(item => {
                console.log(item)
                const nom_dep = item.departement.split(",")[1]?.toString().trim() ? item.departement.split(",")[1]?.toString().trim() : "unknow";
                // @Route("ferme/departement/{nom_dep}/{id_dep}/details/{id_ferme}" , name="detail_ferme" , methods="GET" )
                var pathDetails ="/ferme/departement/"+ nom_dep + "/" + item.departement.split(",")[0].toString().trim() +"/details/" + item.id;
        
                const adress = "<br> Adresse: " + item.adresseFerme;
                const link = "<br><a href='"+ pathDetails + "'> VOIR DETAILS </a>";

                var title = "Ferme: " + item.nomFerme + ". Departement: " + item.departement +"." + adress + link;
                
                mc.singleMarker(
                    parseFloat(item.latitude),
                    parseFloat(item.longitude ),
                    title,
                    'assets/icon/ferme-logo.png'
                );
            } )

            mc.prepareMarkers()
            mc.addToMap();
        }else{
            console.log("ERREUR : L'erreur se produit par votre réseaux.")
        }
    });
});