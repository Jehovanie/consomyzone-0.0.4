const IS_DEV_MODE= true;

if(document.querySelector("#close-navleft")){
    document.querySelector("#close-navleft").addEventListener('click', () => {
        document.querySelector(".navleft").style.transform = "translateX(-50vh)"
        document.querySelector(".navleft").style.transition = "all 1.5s ease-out"
    })
}

if(document.querySelector("#open-navleft")){
    document.querySelector("#open-navleft").addEventListener('click', () => {
        document.querySelector(".navleft").style.transform = "translateX(0vh)"
        document.querySelector(".navleft").style.transition = "all 1.5s ease-out"
    })
}

