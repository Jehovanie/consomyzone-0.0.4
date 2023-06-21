onmessage = (e) => {
   
    const param = "?tbl_tribu_t_commentaire=" + encodeURIComponent(e.data[0]) +
     "&id_pub="+encodeURIComponent(e.data[1])+"&id_min="+encodeURIComponent(e.data[2])+"&limits="+encodeURIComponent(e.data[3])

    
    const request = new Request("/user/get/comment/pub"+param, {
        method: "GET",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
       
    })
     console.log(param)
    fetch(request).then(response => { 
        if ( response.ok && response.status == 200 )  {
            response.json().then(json => {
                console.log(json)
                postMessage([json,e.data[1]])
            })
        }
    })
}