
const uri = new URL(window.location.href);
const path = uri.pathname.toString()


if( path.includes("account") && !path.includes("setting/account")){
    document.querySelector(".account_js").classList.add("active");
}

if( path.includes("invitation")){
    document.querySelector(".invitation_js").classList.add("active");
}

if( path.includes("dashboard") && !path.includes("dashboard-fondateur")){
    document.querySelector(".dashboard_super_js").classList.add("active");
}

if( path.includes("dashboard-fondateur")){
    document.querySelector(".dashboard_js").classList.add("active");
}

if( path.includes("profil")){
    document.querySelector(".profil_js").classList.add("active");
}

if( path.includes("tribu")){
    document.querySelector(".tribu_js").classList.add("active");
}

if( path.includes("setting/account")){
    document.querySelector(".setting_js").classList.add("active");
}

if( path.includes("message")){
    document.querySelector(".message_js").classList.add("active");
}