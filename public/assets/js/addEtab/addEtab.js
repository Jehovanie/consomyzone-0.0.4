if (document.querySelector("#etab-next-modif-cart")) {
    document.querySelector("#etab-next-modif-cart").onclick = () => {
        window.location.replace("/add-etab-modif-suite/"+sessionStorage.getItem("fff"))
    }
}

if (document.querySelector("#add_etab_ferme_telephone_mobile")) {
    const phoneInput = window.intlTelInput(document.querySelector("#add_etab_ferme_telephone_mobile"), {
     utilsScript:
       "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
   });
}
    
if (document.querySelector("#add_etab_ferme_departement")) {
    document.querySelector("#add_etab_ferme_departement").onchange = e => {
        console.log(e.target.selectedIndex);
        document.querySelector("#add_etab_ferme_departement_name").value=e.target[e.target.selectedIndex].dataset.name;
    }    
}

if (document.querySelector("#add_etab_ferme_departement_name")) {
    document.querySelector("#add_etab_ferme_departement_name").onkeyup = e => {
        const str = e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1)
        const b=`{
            "Ain" : "01",
            "Aisn" : "02",
            "Allier" : "03",
            "Alpes de Haute-Provence" : "04",
            "Hautes-Alpes" : "05",
            "Alpes-Maritimes" : "06",
            "Ardêche" : "07",
            "Ardennes" : "08",
            "Ariège" : "09",
            "Aube" : "10",
            "Aude" : "11",
            "Aveyron" : "12",
            "Bouches-du-Rhône" : "13",
            "Calvados" : "14",
            "Cantal" : "15",
            "Charente" : "16",
            "Charente-Maritime" : "17",
            "Cher" : "18",
            "Corrèze" : "19",
            "Corse-du-Sud" : "2A",
            "Haute-Corse" : "2B",
            "Côte-d'Or" : "21",
            "Côtes d'Armor" : "22",
            "Creuse" : "23",
            "Dordogne" : "24",
            "Doubs" : "25",
            "Drôme" : "26",
            "Eure" : "27",
            "Eure-et-Loir" : "28",
            "Finistère" : "29",
            "Gard" : "30",
            "Haute-Garonne" : "31",
            "Gers" : "32",
            "Gironde" : "33",
            "Hérault" : "34",
            "Île-et-Vilaine" : "35",
            "Indre" : "36",
            "Indre-et-Loire" : "37",
            "Isère" : "38",
            "Jura" : "39",
            "Landes" : "40",
            "Loir-et-Cher" : "41",
            "Loire" : "42",
            "Haute-Loire" : "43",
            "Loire-Atlantique" : "44",
            "Loiret" : "45",
            "Lot" : "46",
            "Lot-et-Garonne" : "47",
            "Lozère" : "48",
            "Maine-et-Loire" : "49",
            "Manche" : "50",
            "Marne" : "51",
            "Haute-Marne" : "52",
            "Mayenne" : "53",
            "Meurthe-et-Moselle" : "54",
            "Meuse" : "55",
            "Morbihan" : "56",
            "Moselle" : "57",
            "Nièvre" : "58",
            "Nord" : "59",
            "Oise" : "60",
            "Orne" : "61",
            "Pas-de-Calais" : "62",
            "Puy-de-Dôme" : "63",
            "Pyrénées-Atlantiques" : "64",
            "Hautes-Pyrénées" : "65",
            "Pyrénées-Orientales" : "66",
            "Bas-Rhin" : "67",
            "Haut-Rhin" : "68",
            "Rhône" : "69",
            "Haute-Saône" : "70",
            "Saône-et-Loire" : "71",
            "Sarthe" : "72",
            "Savoie" : "73",
            "Haute-Savoie" : "74",
            "Paris" : "75",
            "Seine-Maritime" : "76",
            "Seine-et-Marne" : "77",
            "Yvelines" : "78",
            "Deux-Sèvres" : "79",
            "Somme" : "80",
            "Tarn" : "81",
            "Tarn-et-Garonne" : "82",
            "Var" : "83",
            "Vaucluse" : "84",
            "Vendée" : "85",
            "Vienne" : "86",
            "Haute-Vienne" : "87",
            "Vosges" : "88",
            "Yonne" : "89",
            "Territoire-de-Belfort" : "90",
            "Essonne" : "91",
            "Hauts-de-Seine" : "92",
            "Seine-Saint-Denis" : "93",
            "Val-de-Marne" : "94",
            "Val-d'Oise" : "95"
        }`
        console.log(str+" "+JSON.parse(b)[str])
        document.querySelector("#add_etab_ferme_departement").value=JSON.parse(b)[str]
    }
}

if (document.querySelector("#etab-next"))
        document.querySelector("#etab-next").onclick = e => {
            e.preventDefault()
            const form = document.querySelector("body > div.container > form");
            const formData = new FormData(form);
            console.log(formData)
            let map1 = new Map();
            let hasError = false
            let hasWarning=false
            try {
                
                for (const [key, value] of formData) {
                    let output = `${key}: ${value}\n`;
                    console.log(output)
                    if (value === "") {
                        document.querySelector(`input[name="${key}"]`).style = "border:2px solid #FFC107;"
                        msgFlash("veuilliez remplir ce champs", document.querySelector(`input[name="${key}"]`))
                        //hasWarning=true
                        throw new Error('champs non rempli');
                    }
                    if (detectIfTextContentHtml(value)) {
                        document.querySelector(`input[name="${key}"]`).style = "border:2px solid red;"
                        msgFlash(flhMSgERREUR(key), document.querySelector(`input[name="${key}"]`))
                        throw new Error('Parameter is not a valid');
                    
                    }
                    if (key === "add_etab_ferme[email]" && !detectIfGooDMAil(value)) {
                        document.querySelector(`input[name="${key}"]`).style = "border:2px solid red;"
                        msgFlash("<p class=\"text-danger\">ERREUR <br> votre email est invalid</p>",document.querySelector(`input[name="${key}"]`))
                        throw new Error('Parameter is not a valid');
                    
                    }
                    if (key === "add_etab_ferme[telephone_travail]" && !detectGooDPhoneNumbers(value)){
                            document.querySelector(`input[name="${key}"]`).style = "border:2px solid #FFC107;"
                            msgFlash("veuilliez respectez le format requis", document.querySelector(`input[name="${key}"]`))
                          
                          throw new Error('champs non rempli');
                    }
                    if (key === "add_etab_ferme[telephone_domicile]" && !detectGooDPhoneNumbers(value)){
                            document.querySelector(`input[name="${key}"]`).style = "border:2px solid #FFC107;"
                            msgFlash("veuilliez respectez le format requis", document.querySelector(`input[name="${key}"]`))
                          
                          throw new Error('champs non rempli');
                    }
                   
                    map1.set(key, value)
                }
            
            } catch (err) { 
                console.log(err)
                if (err.message  === "Parameter is not a valid") {
                     hasError=true
                } else if (err.message  === "champs non rempli") {
                    hasWarning=true
                }
               
            } finally {
            
                if (!hasError && !hasWarning) {
                    console.log(map1)
                    localStorage.setItem("fisrtDta", JSON.stringify(Object.fromEntries(map1)))
                    window.location.replace("/add-etab-carte")
                } else {
                    setTimeout(() => {
                        document.querySelectorAll(".flash-msg-ERREUR").forEach((i) => {
                            i.style = " transition:2s ease-in-out; transform: translateX(-25px); opacity: 0;" 
                            
                        })
                    }, 5000)    
                }
            
            console.log(localStorage.getItem("fisrtDta"))
            }

            
        }
if (document.querySelector("#etab-next-hor"))
    document.querySelector("#etab-next-hor").onclick = e => {
        e.preventDefault()
        const form = document.querySelector("body > div.container.horaires > form");
        const formData = new FormData(form);
        let map1 = new Map();
        for (const [key, value] of formData) {
            let output = `${key}: ${value}\n`;
            console.log(output)
            map1.set(key, value)
        }
        localStorage.setItem("dataH", JSON.stringify(Object.fromEntries(map1)))
        window.location.replace("/add-etab-fin")
    }
if (document.querySelector("#btn-fin-etab"))
    document.querySelector("#btn-fin-etab").onclick = e => { 
        e.preventDefault()
        const form = document.querySelector("body > div.container > form");
        const formData = new FormData(form);
        let map1 = new Map();
        for (const [key, value] of formData) { 
            let output = `${key}: ${value}\n`;
            console.log(output)
            map1.set(key, value)
        }
        localStorage.setItem("dataService", JSON.stringify(Object.fromEntries(map1)))
        let etab={}
        const etabInfo1 = localStorage.getItem("fisrtDta");
        const etabInfo2 = localStorage.getItem("latlng")
        const etabInfo3 = JSON.parse(localStorage.getItem("dataH"))
        const etabInfo4 = JSON.parse(localStorage.getItem("dataService"))
        console.log(etabInfo4["add_etab_ferme_fin[acces_handicap_auditif]"])
        let horairesVenteFerme =
            `Lundi ${etabInfo3["lu-matin-dom-1"]}-${etabInfo3["lu-matin-dom-2"]} ${etabInfo3["lu-midi-dom-1"]}-${etabInfo3["lu-midi-dom-2"]}
             Mardi ${etabInfo3["ma-matin-dom-1"]}-${etabInfo3["ma-matin-dom-2"]} ${etabInfo3["ma-midi-dom-1"]}-${etabInfo3["ma-midi-dom-2"]}
             Mercredi ${etabInfo3["me-matin-dom-1"]}-${etabInfo3["me-matin-dom-2"]} ${etabInfo3["me-midi-dom-1"]}-${etabInfo3["me-midi-dom-2"]}
             Jeudi ${etabInfo3["je-matin-dom-1"]}-${etabInfo3["je-matin-dom-2"]} ${etabInfo3["je-midi-dom-1"]}-${etabInfo3["je-midi-dom-2"]}
             Vendredi ${etabInfo3["ve-matin-dom-1"]}-${etabInfo3["ve-matin-dom-2"]} ${etabInfo3["ve-midi-dom-1"]}-${etabInfo3["ve-midi-dom-2"]}
             Samedi ${etabInfo3["sa-matin-dom-1"]}-${etabInfo3["sa-matin-dom-2"]} ${etabInfo3["sa-midi-dom-1"]}-${etabInfo3["sa-midi-dom-2"]}
             Dimanche ${etabInfo3["di-matin-dom-1"]}-${etabInfo3["di-matin-dom-2"]} ${etabInfo3["di-midi-dom-1"]}-${etabInfo3["di-midi-dom-2"]}
            `
        let horairesVenteMagasin =
            `
              Lundi ${etabInfo3["lu-matin-magasin-1"]}-${etabInfo3["lu-matin-magasin-2"]} ${etabInfo3["lu-midi-magasin-1"]}-${etabInfo3["lu-midi-magasin-2"]}
             Mardi ${etabInfo3["ma-matin-magasin-1"]}-${etabInfo3["ma-matin-magasin-2"]} ${etabInfo3["ma-midi-magasin-1"]}-${etabInfo3["ma-midi-magasin-2"]}
             Mercredi ${etabInfo3["me-matin-magasin-1"]}-${etabInfo3["me-matin-magasin-2"]} ${etabInfo3["me-midi-magasin-1"]}-${etabInfo3["me-midi-magasin-2"]}
             Jeudi ${etabInfo3["je-matin-magasin-1"]}-${etabInfo3["je-matin-magasin-2"]} ${etabInfo3["je-midi-magasin-1"]}-${etabInfo3["je-midi-magasin-2"]}
             Vendredi ${etabInfo3["ve-matin-magasin-1"]}-${etabInfo3["ve-matin-magasin-2"]} ${etabInfo3["ve-midi-magasin-1"]}-${etabInfo3["ve-midi-magasin-2"]}
             Samedi ${etabInfo3["sa-matin-magasin-1"]}-${etabInfo3["sa-matin-magasin-2"]} ${etabInfo3["sa-midi-magasin-1"]}-${etabInfo3["sa-midi-magasin-2"]}
             Dimanche ${etabInfo3["di-matin-magasin-1"]}-${etabInfo3["di-matin-magasin-2"]} ${etabInfo3["di-midi-magasin-1"]}-${etabInfo3["di-midi-magasin-2"]}
            `
        let horairesVenteMarche =
            `Lundi ${etabInfo3["lu-matin-marche-1"]}-${etabInfo3["lu-matin-marche-2"]} ${etabInfo3["lu-midi-marche-1"]}-${etabInfo3["lu-midi-marche-2"]}
             Mardi ${etabInfo3["ma-matin-marche-1"]}-${etabInfo3["ma-matin-marche-2"]} ${etabInfo3["ma-midi-marche-1"]}-${etabInfo3["ma-midi-marche-2"]}
             Mercredi ${etabInfo3["me-matin-marche-1"]}-${etabInfo3["me-matin-marche-2"]} ${etabInfo3["me-midi-marche-1"]}-${etabInfo3["me-midi-marche-2"]}
             Jeudi ${etabInfo3["je-matin-marche-1"]}-${etabInfo3["je-matin-marche-2"]} ${etabInfo3["je-midi-marche-1"]}-${etabInfo3["je-midi-marche-2"]}
             Vendredi ${etabInfo3["ve-matin-marche-1"]}-${etabInfo3["ve-matin-marche-2"]} ${etabInfo3["ve-midi-marche-1"]}-${etabInfo3["ve-midi-marche-2"]}
             Samedi ${etabInfo3["sa-matin-marche-1"]}-${etabInfo3["sa-matin-marche-2"]} ${etabInfo3["sa-midi-marche-1"]}-${etabInfo3["sa-midi-marche-2"]}
             Dimanche ${etabInfo3["di-matin-marche-1"]}-${etabInfo3["di-matin-marche-2"]} ${etabInfo3["di-midi-marche-1"]}-${etabInfo3["di-midi-marche-2"]}
            `
        etab = {
            adresse_ferme: JSON.parse(etabInfo1)["add_etab_ferme[adresse_ferme]"],
            code_postal:JSON.parse(etabInfo1)["add_etab_ferme[code_postal]"],
            departement:JSON.parse(etabInfo1)["add_etab_ferme[departement]"],
            departement_name: JSON.parse(etabInfo1)["add_etab_ferme[departement_name]"],
            email: JSON.parse(etabInfo1)["add_etab_ferme[email]"],
            fax:JSON.parse(etabInfo1)["add_etab_ferme[fax]"],
            nom_ferme:JSON.parse(etabInfo1)["add_etab_ferme[nom_ferme]"],
            produit_ferme:JSON.parse(etabInfo1)["add_etab_ferme[produit_ferme]"],
            telephone_domicile:JSON.parse(etabInfo1)["add_etab_ferme[telephone_domicile]"],
            telephone_mobile:JSON.parse(etabInfo1)["add_etab_ferme[telephone_mobile]"],
            telephone_travail:JSON.parse(etabInfo1)["add_etab_ferme[telephone_travail]"],
            ville: JSON.parse(etabInfo1)["add_etab_ferme[ville]"],
            lat:JSON.parse(etabInfo2)["lat"],
            lng: JSON.parse(etabInfo2)["lng"],
            horaires_vente_magasin: horairesVenteMagasin.replace(/\s+/g, " "),
            horaires_vente_ferme: horairesVenteFerme.replace(/\s+/g, " "),
            horaires_vente_marche: horairesVenteMarche.replace(/\s+/g, " "),
            acces_handicap_auditif:etabInfo4["add_etab_ferme_fin[acces_handicap_auditif]"] !=undefined ? etabInfo4["add_etab_ferme_fin[acces_handicap_auditif]"]:0, 
            acces_handicap_mental:etabInfo4["add_etab_ferme_fin[acces_handicap_mental]"] !=undefined ? etabInfo4["add_etab_ferme_fin[acces_handicap_mental]"]:0,
            acces_handicap_motrice: etabInfo4["add_etab_ferme_fin[acces_handicap_motrice]"] !=undefined? etabInfo4["add_etab_ferme_fin[acces_handicap_motrice]"]:0,
            acces_handicap_visuel: etabInfo4["add_etab_ferme_fin[acces_handicap_visuel]"] !=undefined? etabInfo4["add_etab_ferme_fin[acces_handicap_visuel]"]:0,
            acces_handicape: etabInfo4["add_etab_ferme_fin[acces_handicape]"] !=undefined? etabInfo4["add_etab_ferme_fin[acces_handicape]"]:0,
            acces_voiture: etabInfo4["add_etab_ferme_fin[acces_voiture]"] !=undefined? etabInfo4["add_etab_ferme_fin[acces_voiture]"]:0,
            adherent_adeve: etabInfo4["add_etab_ferme_fin[adherent_adeve]"] !=undefined? etabInfo4["add_etab_ferme_fin[adherent_adeve]"]:0,
            agriculture_bio: etabInfo4["add_etab_ferme_fin[agriculture_bi0]"] !=undefined? etabInfo4["add_etab_ferme_fin[agriculture_bio]"]:0,
            animaux_autoriser: etabInfo4["add_etab_ferme_fin[animaux_autoriser]"] !=undefined? etabInfo4["add_etab_ferme_fin[animaux_autoriser]"]:0,
            atelier: etabInfo4["add_etab_ferme_fin[atelier]"] !=undefined? etabInfo4["add_etab_ferme_fin[atelier]"]:0,
            carte_bancaire: etabInfo4["add_etab_ferme_fin[carte_bancaire]"] !=undefined? etabInfo4["add_etab_ferme_fin[carte_bancaire]"]:0,
            cheque_vacance: etabInfo4["add_etab_ferme_fin[cheque_vacance]"] !=undefined? etabInfo4["add_etab_ferme_fin[cheque_vacance]"]:0,
            degustation: etabInfo4["add_etab_ferme_fin[degustation]"] !=undefined? etabInfo4["add_etab_ferme_fin[degustation]"]:0,
            marcher_produit: etabInfo4["add_etab_ferme_fin[marcher_produit]"] !=undefined ? etabInfo4["add_etab_ferme_fin[marcher_produit]"]: 0,
            site_web: etabInfo4["add_etab_ferme_fin[site_web]"] !=undefined? etabInfo4["add_etab_ferme_fin[site_web]"]:0,
            station_verte: etabInfo4["add_etab_ferme_fin[station_verte]"] !=undefined? etabInfo4["add_etab_ferme_fin[station_verte]"]:0,
            tickets_restaurant: etabInfo4["add_etab_ferme_fin[tickets_restaurant]"] !=undefined? etabInfo4["add_etab_ferme_fin[tickets_restaurant]"]:0,
            vente_en_ligne: etabInfo4["add_etab_ferme_fin[vente_en_ligne]"] !=undefined? etabInfo4["add_etab_ferme_fin[vente_en_ligne]"]:0,
        }
        console.log(JSON.stringify(etab))
        const options = {
            method: 'POST',
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(etab)
        }
        const request = new Request("/persit-new-etab", options)
        fetch(request).then((response) => {
            if (response.ok && response.status === 200) {
                fetch("/getMax").then(r2 => {
                    r2.json().then(r3 => {
                        fetch("/send/notifications/etbasCreate", {
                            method: "POST",
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                /// current connecter
                                // http://127.0.0.1:8000/ferme/departement/Ain/01/details/4726
                                departeName: JSON.parse(etabInfo1)["add_etab_ferme[departement_name]"],
                                /// user to talk
                                numDeparte: JSON.parse(etabInfo1)["add_etab_ferme[departement]"],
                                ///message content
                                id: r3["id"],

                                ask:"create"
                            })
                        }).then(r => {
                            if (r.ok && r.status === 200) {
                                window.location.replace(`/ferme/departement/${JSON.parse(etabInfo1)["add_etab_ferme[departement_name]"]}/${JSON.parse(etabInfo1)["add_etab_ferme[departement]"]}/details/${r3["id"]}`)
                            
                            }
                        })
                
                    })//end fetching getMax
                })//fetching getMax
            }//end if
                
        })//fetching persist etab

        //window.location.replace("/add-etab-fin")
    }


if (document.querySelector("#map")) {
    localStorage.setItem("latlng", JSON.stringify({
        lat: 0.000,
        lng: 0.000
    }))
    const tiles=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 18,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    })
    let latlng = L.latLng(46.227638, 2.213749);
    const carte = L.map(document.querySelector("#map"), { center: latlng, zoom: 6, layers: [tiles] }); 
    carte.on('click', e => {
        const latlng = e.latlng
        L.marker(latlng).addTo(carte)
        localStorage.setItem("latlng",JSON.stringify(latlng))
    })
    let greenIcon=L.icon({
            iconUrl:
              "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
            shadowUrl:
              "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        }) 
        var mrk 
        let geocoder=L.Control.geocoder({
            defaultMarkGeocode: false
        }).on('markgeocode', function(e) {
            var latlng = e.geocode.center;
            console.log(e.geocode.latlng)
            mrk = L.marker(latlng, { icon: greenIcon }).addTo(carte);
            localStorage.setItem("latlng",JSON.stringify(latlng))
            mrk.on('click', function (e) { 
                console.log(e.latlng)
                localStorage.setItem("latlng",JSON.stringify(latlng))
            })
            mrk.bindPopup(e.geocode.html)
            /*var mrk2=L.marker(latlng,{icon: greenIcon}).addTo(carte);
            mrk2.bindPopup(e.geocode.html)*/
            carte.fitBounds(e.geocode.bbox);
            carte.fitBounds(e.geocode.bbox);
        }).addTo(carte);
   
    
}
function detectIfTextContentHtml(str) {
    const regex = /<.*>|<.*|.*>/
    return regex.test(str)
}

function detectIfGooDMAil(str) {
    const regex = /[a-zA-Z0-9]+\.[a-zA-Z0-9]+@[a-zA-z]+\.[a-zA-Z]|[a-zA-Z0-9]+@[a-zA-z]+\.[a-zA-Z]/ 
    return regex.test(str)
}

function msgFlash(msg,targetElmnt) {
    const div = document.createElement("div")
    div.classList.add("flash-msg-ERREUR")
    div.innerHTML= msg
    targetElmnt.parentNode.appendChild(div)
    
}
function detectGooDPhoneNumbers(str) {
    const regex = /[0-9]{10}|[0-9]{2} [0-9]{2} [0-9]{2} [0-9]{2} [0-9]{2}/
    return regex.test(str)
}

function flhMSgERREUR(key){
    switch (key) {
        case 'add_etab_ferme[nom_ferme]': {
            return "<p class=\"text-danger\">ERREUR <br> votre nom contient des caractère invalides</p>"
        }
            


case 'add_etab_ferme[adresse_ferme]':{
    return "<p class=\"text-danger\">ERREUR <br> votre adresse contient des caractère invalides</p>"
}

case 'add_etab_ferme[code_postal]':{
    return "<p class=\"text-danger\">ERREUR <br> votre code postale contient des caractère invalides</p>" 
}

case 'add_etab_ferme[departement]':{
    return "<p class=\"text-danger\">ERREUR <br> votre departement contient des caractère invalides</p>"
}

case 'add_etab_ferme[departement_name]':{
    return "<p class=\"text-danger\">ERREUR <br> votre nom  departement contient des caractère invalides</p>"
}

case 'add_etab_ferme[ville]':{
    return "<p class=\"text-danger\">ERREUR <br> votre ville contient des caractère invalides</p>"
}

case 'add_etab_ferme[email]':{
    return "<p class=\"text-danger\">ERREUR <br> votre email contient des caractère invalides</p>"
}

case 'add_etab_ferme[fax]':{
    return "<p class=\"text-danger\">ERREUR <br> votre fax contient des caractère invalides</p>"
}

case 'add_etab_ferme[telephone_travail]':{
    return "<p class=\"text-danger\">ERREUR <br> votre telephone_travail contient des caractère invalides</p>"
}

case 'add_etab_ferme[telephone_mobile]':{
    return "<p class=\"text-danger\">ERREUR <br> votre telephone_mobile contient des caractère invalides</p>"
}

case 'add_etab_ferme[telephone_domicile]':{
    return "<p class=\"text-danger\">ERREUR <br> votre telephone_domicile contient des caractère invalides</p>"
}

case 'add_etab_ferme[produit_ferme]':{
    return "<p class=\"text-danger\">ERREUR <br> votre produit_ferme contient des caractère invalides</p>"
}
   }
}