if( localStorage.getItem("type") ){
    localStorage.removeItem("type")
}

const link_now= new URL(window.location.href)
const linkPathname= link_now.pathname;

if( linkPathname.includes("/restaurant")){
    localStorage.setItem("type", "restaurant");
}else if( linkPathname.includes("/ferme")){
    localStorage.setItem("type", "ferme");
}else if( linkPathname.includes("/station")){
    localStorage.setItem("type", "station");
}else if( linkPathname.length === 1  ||  linkPathname.includes("/search/tous") ){
    localStorage.setItem("type", "tous");
}