// if(document.querySelector("#close-detail-station")){
//     document.querySelector("#close-detail-station").addEventListener("click", () => { 
//         document.getElementById("remove-detail-station").setAttribute("class", "hidden")
//     })
// }

// //// HIDE DETAILS STATION POP UP
// if(document.querySelector("#close-detail-home")){
//     document.querySelector("#close-detail-home").addEventListener("click", () => { 
//         document.getElementById("remove-detail-home").setAttribute("class", "hidden")
//     })
// }

const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
};

function success(pos) {
    const crd = pos.coords;

    console.log("Your current position is:");
    console.log(`Latitude : ${crd.latitude}`);
    console.log(`Longitude: ${crd.longitude}`);
    console.log(`More or less ${crd.accuracy} meters.`);
}

function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
}

// navigator.geolocation.getCurrentPosition(success, error, options);