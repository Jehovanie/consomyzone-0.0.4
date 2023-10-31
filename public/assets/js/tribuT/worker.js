onmessage = (e) => {

    let params=[]
    let tableTribuT = e.data[0]
    let idTribuT = e.data[1]
    let idmin = "idmin=" + encodeURIComponent(e.data[2])
    let limits = "limits=" + encodeURIComponent(e.data[3])
    params.push(idmin)
    params.push(limits)
    params = params.join("&")
    
    const request = new Request(`/user/get/${tableTribuT}/{tribuTId}/publications/?${params}`, {
        method: "GET",
        headers: {
             'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        }
        
    })
    
    fetch(request).then((response) => response.json()).then((json) => { 
        postMessage(json)
    })
}
