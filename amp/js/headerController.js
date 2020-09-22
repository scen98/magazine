import { getMyInfo } from "./objects/author.js";
import * as doc from "./doc.js";
import * as caller from "./objects/caller.js";
let createUser = document.getElementById("create-user");
let header = document.getElementById("main-header");
let sticky = header.offsetTop;
let tokens = document.getElementById("tokens");
let awaiting = document.getElementById("awaiting-articles");
let positionPage = document.getElementById("position-page");
let myInfo;
let logOutBtn = document.getElementById("log-out");
init();
function init() {
    getMyInfo(setMyInfo);
    doc.addClick(logOutBtn, logOut);
}
function setMyInfo(authorData) {
    myInfo = authorData;
    displayContent();
}
function logOut() {
    caller.GET("../amp/includes/logout.php", onLogout);
}
function onLogout() {
    window.location.href = "../amp/login.php";
}
function displayContent() {
    let highestPermission = myInfo.getHighestPermission();
    if (highestPermission <= 10) {
        hideFromNormal();
    }
    else if (highestPermission <= 20) {
        hideFromCma();
    }
    else if (highestPermission <= 30) {
        hideFromCml();
    }
    else if (highestPermission <= 40) {
        hideFromAdmin();
    }
}
function hideFromNormal() {
    tokens.style.display = "none";
    createUser.style.display = "none";
    awaiting.style.display = "none";
    positionPage.style.display = "none";
}
function hideFromCma() {
    tokens.style.display = "none";
    createUser.style.display = "none";
    positionPage.style.display = "none";
}
function hideFromCml() {
    createUser.style.display = "none";
}
function hideFromAdmin() {
    createUser.style.display = "none";
}
window.onscroll = function () {
    headerHandler();
};
function headerHandler() {
    if (window.pageYOffset > sticky) {
        header.classList.add("sticky");
    }
    else {
        header.classList.remove("sticky");
    }
}
//# sourceMappingURL=headerController.js.map