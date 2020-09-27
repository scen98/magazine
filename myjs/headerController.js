
import * as utils from "../amp/js/utils.js";
window.onscroll = function() {handleHeader()};
var header = document.getElementById("myTopnav");
var sticky = header.offsetTop;
init();
function init(){
    setActive();
}

function setActive(){
    let columnId = parseInt(utils.getUrlParameter("cid"));
    if(columnId > 0){
        document.getElementById(`menu-${columnId}`).classList.add("active");
    } else {  
        document.getElementById("menu-0").classList.add("active");
    }
}

window.displayMenu = ()=> {
    var x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
      x.className += " responsive";
    } else {
      x.className = "topnav";
    }
  }



function handleHeader() {
  if (window.pageYOffset > sticky) {
    header.classList.add("sticky");
  } else {
    header.classList.remove("sticky");
  }
}