let $id = (id) => document.getElementById(id);
var [login, register, form] = ['login', 'register', 'form'].map(id => $id(id));

[login, register].map(element => {
    element.onclick = function () {
        [login, register].map($ele => {
            $ele.classList.remove("active");
        });
        this.classList.add("active");
        this.getAttribute("id") === "register"?  form.classList.add("active") : form.classList.remove("active");
    }
});
const urlParams = new URLSearchParams(location.search);
const registerAgenda = urlParams.get('registerAgenda')
const toId = urlParams.get('roof')
if (registerAgenda) {
    fetch(`/info/verif/${toId}`).then(r => {
        r.json().then(j => {
            //document.querySelector("#form_email").value = j.email
            document.querySelector("#form_email").setAttribute("value",j.email)
            // document.querySelector("#form_email").disabled = true;
            document.querySelector("#form_email").readOnly = true;
            document.querySelector("#register").click()
        })
    })
}