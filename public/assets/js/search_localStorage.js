localStorage.getItem("type") ?? localStorage.removeItem("type")

const link= new URL(window.location.href)
const linkPathname= link.pathname;

if( linkPathname.includes("/restaurant")){
    localStorage.setItem("type", "restaurant");
}else if( linkPathname.includes("/ferme")){
    localStorage.setItem("type", "ferme");
}else if( linkPathname.includes("/station")){
    localStorage.setItem("type", "station");
}