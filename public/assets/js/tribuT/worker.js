onmessage = (e) => {

    let params=[]
    let tblPublication = "tblpublication=" + encodeURIComponent(e.data[0]+"_publication")
    let idmin = "idmin=" + encodeURIComponent(e.data[1])
    let limits = "limits=" + encodeURIComponent(e.data[2])
    let tblCommentaire="tblCommentaire="+encodeURIComponent(e.data[0]+"_commentaire")
    params.push(tblPublication)
    params.push(idmin)
    params.push(limits)
    params.push(tblCommentaire)
    params = params.join("&")
    console.log("/user/publicalition/vals?"+params)
    const request = new Request("/user/publicalition/vals?"+params, {
        method: "GET",
        headers: {
             'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        }
        
    })
    fetch(request).then((response) => response.json()).then((json) => { 
        console.log(json)
        postMessage(json)
    })
}
