
function mention_comment_partison(table, id) {
    fetch(`/user/mention/partison/commentaire/${table}`)
        .then((res) => res.json())
        .then((res) => {
            console.log(res)
            

            
            if (document.querySelector(`#newComment_${id}`)) {
                const textarea = document.querySelector(`#newComment_${id}`)

                textarea.addEventListener("keyup", (e) => { 
                    
                    if (e.code === 'Digit0') {
                        createAndAddOptionMentionComment(res)
                        textarea.addEventListener("input", () => {
                            const event_text = textarea.innerText
                            const text_comment = event_text.split("@")[event_text.split("@").length - 1]
                          
                            const all_tribu = res.filter((item) => {

                                return item.user.firstname.includes(text_comment) || item.user.lastname.includes(text_comment)
                            })
                            console.log('all')
                            
                            createAndAddOptionMentionComment(all_tribu)
                        })
                      
                        
                    }
                    else if (e.code === 'Backspace') { 
                        
                        const element = document.querySelector("#tribu_mentions >div.toast")
                            element.remove();
                    }
                    
                    const list_mention = document.querySelectorAll(".list-mentions");
                    
                    
                    list_mention.forEach((item) => {
                        item.addEventListener('click', event => {
                            // console.log( event.target.innerText)
                            
                            const username ='<span class="text-primary username-text">'+ event.target.innerText +'</span>'
                            
                            const inputDiv = document.querySelector(`#newComment_${id}`)
                                const value_teaxtarea = inputDiv.innerText.split("@")[inputDiv.innerText.split("@").length - 1] 
                                inputDiv.innerHTML = inputDiv.innerHTML.replace(`@${value_teaxtarea}`, username)
                            
                        });  
                    })
                })  
            }
            
            
        })
}



function createAndAddOptionMentionComment(value) {
    const list_tribu_mentions = document.getElementById('tribu_mentions')
    if (list_tribu_mentions.querySelector('.remove_comment')) {
        list_tribu_mentions.removeChild(list_tribu_mentions.querySelector('.remove_comment'))
    }
    const comment = value.map(i => {
        const list_tribu_t =  i.user.lastname + ' ' + i.user.firstname 

        const li = document.createElement('li')
        li.className = "list-group-item list-mentions text-primary"
        li.setAttribute('id', "list_user_"+i.user_id)
        li.innerText = list_tribu_t
        return li
    }) 
 
        const div = document.createElement('div')
        div.className = "toast show remove_comment"
        div.setAttribute('role', 'alert')
        div.setAttribute('aria-live', 'assertive')
    div.setAttribute('aria-atomic', 'true')
    
    const div2 = document.createElement('div')
    div2.className = "toast-body"
    const ul = document.createElement('ul')
    ul.className = "list-group"

    comment.forEach(i => { 
        ul.appendChild(i)
       
    })
    div2.appendChild(ul)
    div.appendChild(div2)
    list_tribu_mentions.appendChild(div)

    
}

