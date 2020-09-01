let createUser = document.getElementById("create-user");
let header =  document.getElementById("main-header");
let sticky = header.offsetTop;
let tokens = document.getElementById("tokens");
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

function displayContent(permissions){   
    if(permissions.permissions[0].level !== "superadmin"){
        hideNonSAElements();
    }
}

function hideNonSAElements(){
    createUser.style.display = "none";
    tokens.style.display = "none";
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
