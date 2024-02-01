onmessage=(e)=>{
    const dataToSend={
        ids: e.data
    }
   
    const request=new Request("/user/isOline",{
        method: "POST",
        header: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend)

    })
    fetch(request).then((response)=>{
         if(response.status === 200 && response.ok){
             response.json().then(jsons=>{
                postMessage(jsons)
             })
         }
    })
}