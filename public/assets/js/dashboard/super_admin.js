t.forEach((item) => {
    // {d:"01",dr:"010010000",c:1,i:"l abergement clemenciat",co:"l abergement clemenciat"}
    createItemAndAddTableTributG(
        document.querySelector(".content_list_tributG_js_jheo"),
        item.d + " " + item.i + " " + item.co,
        "/user/dashboard-membre?table=tribug_" + item.d + "_" + item.i.split(" ").map(t=> t.toLowerCase()).join("_") + "_" + item.co.split(" ").map(t=> t.toLowerCase()).join("_")
    );
})


function createItemAndAddTableTributG(parent, name, link) {

    const tr = document.createElement("tr");

    const td_name = document.createElement("td");
    td_name.innerText = name;

    const td_content_link = document.createElement("td");
    const a = document.createElement("a");
    a.setAttribute("href", link);
    a.className = "btn btn-primary";
    a.innerText = "Voir Membre";

    td_content_link.appendChild(a);

    tr.appendChild(td_name);
    tr.appendChild(td_content_link);

    parent.appendChild(tr);

}