let currentURL = window.location.pathname
///agenda/confirmation/9/6/3
let fromId = currentURL.split("/")[3]
let toId = currentURL.split("/")[4]
let agendaId = currentURL.split("/")[5]
if(document.querySelector("#accept_from_page_email_Nantenaina_js_css")){
    document.querySelector("#accept_from_page_email_Nantenaina_js_css").onclick=e=>{
      
        const request = new Request(`/agenda/make/confirmation/${fromId}/${toId}/${agendaId}/1`, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
    
        fetch(request)
            .then(response => response.json())
            .then(response => {
                document.querySelector("#contentAcceptOrRejectAgenda").style.display = "none"
                swal("Message !", "Votre choix a été bien pris en compte."+
                                "\r\nVous recevrez un email de présence le jour de l'événement.\r\n"+
                                "Vous allez être redirigé vers CONSOMYZONE.", "success")
                            .then((value) => {
                                location.href = "/";
                            });
            })
     
    }
}
if(document.querySelector("#decline_from_page_email_Nantenaina_js_css")){
    document.querySelector("#decline_from_page_email_Nantenaina_js_css").onclick=e=>{
        const request = new Request(`/agenda/make/confirmation/${fromId}/${toId}/${agendaId}/0`, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
    
        fetch(request)
            .then(response => response.json())
            .then(response => {
                console.log(response);
                swal("Merci !", "Votre choix a été bien pris en compte.\r\nVous allez être redirigé vers CONSOMYZONE.", "success")
                            .then((value) => {
                                location.href = "/";
                            });
            })
    }
}