onmessage=(e)=>{
    table_rst_pastilled=e.data[0]
    const request=new Request("/user/tribu/restos-pastilles/" + table_rst_pastilled, {
        method: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
    fetch(request).then(rqt => rqt.json()).then(restos => {
            postMessage(restos)

    })
}