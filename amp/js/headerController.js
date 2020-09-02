let createUser = document.getElementById("create-user");
let header =  document.getElementById("main-header");
let sticky = header.offsetTop;
let tokens = document.getElementById("tokens");
window.permissions = [];
init();
function init(){    
    let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                displayContent(JSON.parse(this.responseText));
               }
            
        };
        xhttp.open("GET", "../amp/includes/getpermissions.php", true);
        xhttp.send();
    }

window.logOut = function(){
    let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                window.location.href = "../amp/login.php";
               }
            
        };
        xhttp.open("GET", "../amp/includes/logout.php", true);
        xhttp.send();
    return false;
}

function displayContent(permissionData){
    permissions = permissionData.permissions;
    if(permissionData.permissions[0].level === "normal"){
        hideNonNormal();
    } else if(permissionData.permissions[0].level === "cml"){
        hideFromCml();
    } else if(permissionData.permissions[0].level !== "superadmin"){
        hideFromAdmin();
    }
}

function hideFromNormal(){
    tokens.style.display = "none";
    createUser.style.display = "none";
}

function hideFromCml(){
    createUser.style.display = "none";
}

function hideFromAdmin(){
    createUser.style.display = "none";
}

window.onscroll = function() {
    headerHandler()
};

function headerHandler() {
  if (window.pageYOffset > sticky) {
    header.classList.add("sticky");
  } else {
    header.classList.remove("sticky");
  }
}

