import { Article, selectArticle, saveText } from "./objects/article.js";
import * as Token from "./objects/token.js";
import { getColumns } from "./objects/column.js";
import * as doc from "./doc.js";
let columnSelect = document.getElementById("column-select");
let title = document.getElementById("title");
let lead = document.getElementById("lead");
let imgPath = document.getElementById("img-path");  
let text = document.getElementById("txtField");
let article;
let message = document.getElementById("message");
let modal = document.getElementById("myModal");
let state = document.getElementById("state");
let lockMessage = document.getElementById("lock-message");
let lockBtn = document.getElementById("lock-btn");
let necessaryTokens = [];
let myTokenPermissions;

init();

function init(){
    Token.getMyTokenPermissions(setMyTokenPermissions);
    getColumns(loadPage);
}

window.saveArticle = function(){
    setArticle();
    article.update(refreshMessage);
}

window.displayDeleteModal = function(){
    modal.style.display = "block";
}

window.hideDeleteModal = function(){
    modal.style.display = "none";
}

window.onclick = function(event){
    if(event.target == modal){
        modal.style.display = "none";
    }
}

window.deleteArticle = function(){
    article.delete(onDelete);
}

window.openImgPath = function(){
    window.open(imgPath.value);
}

window.switchLock = () =>{
    article.switchLock(()=>{
        setState();
    }, permissions[0].authorId);
}

function setMyTokenPermissions(tokenPermissions){ 
    myTokenPermissions = tokenPermissions;
}

function loadPage(columns){
    renderOptions(columns);
    selectArticle(loadArticle, getId());
}

function loadArticle(art){ 
    article = art;
    Token.selectTokensByColumn((response)=>{
        loadTokenInstances(response);
    }, article.columnId);
    article.id = getId();
    refreshArticle();
}

function loadTokenInstances(tokenInstances){ ////////////////////////////////////////////////////////////////////////////////////TODO////////////////////////////
    necessaryTokens = tokenInstances;
    for (let instance of necessaryTokens) {
        renderTokenInstance(instance);
    }
}

function renderTokenInstance(tokenInstance){
    
}

function hasAccessToTokenInstance(tokenInstance){
    
}

function onDelete(){
    window.location.href = "../amp/index.php";
}

function refreshMessage(){    
    let d = new Date();
    message.innerHTML = "Legutóbb mentve: "+d.getHours() + ":" + d.getMinutes();
}

function refreshArticle(){
    title.value = article.title;
    lead.value = article.lead;
    imgPath.value = article.imgPath;
    columnSelect.value = article.columnId;
    text.contentWindow.document.body.innerHTML = article.text;
    setState();
}

function setState(){
   // console.log(permissions[0].authorId);
  //  console.log(article.lockedBy);
    if(article.isLocked === 0){
        openState();
    } else if(article.isLocked === 1 && article.lockedBy == permissions[0].authorId){
        closeState();
    } else {
        noAccessState();
    }
}

function openState(){
    state.innerText = "Nyitott";
    state.className = "unlocked";
    lockMessage.innerText = "A szerkesztés megkezdésekor a rendszer zárt állapotba helyezi azt, ezzel meggátolva hogy más felhasználók is módosításokat hajtsanak végre, amíg ön ezt a zárat fel nem oldja.."
    lockBtn.style.display = "block";
    lockBtn.innerHTML = "Zárolás / Szerkesztés";
    lockBtn.className = "lockBtn";
    toggleEditOff();
}

function closeState(){
    state.innerText = "Zárt";
    state.className = "locked";
    lockMessage.innerText = "A cikkhez jelen pillanatban csak ez a felhasználó fér hozzá.";
    lockBtn.innerHTML = "Feloldás";
    lockBtn.className = "unlockBtn";
    toggleEditOn();
}

function noAccessState(){
    state.innerText = "Más által zárolva.";
        lockMessage.innerText = "A cikk egy másik felhasználó által lett zárolva, így addig nem végezhető változtatás, amíg azt ő fel nem oldja."
        document.getElementById("lock-btn").style.display = "none";
        toggleEditOff();
}

function setArticle(){
    article.title = title.value;
    article.lead = lead.value;
    article.imgPath = imgPath.value
    article.columnId = columnSelect.value
    article.text = text.contentWindow.document.body.innerHTML;

}

function getId(){
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get("aid");
}

function renderOptions(columnArray){  
    for (let col of columnArray) {
        doc.renderOption(columnSelect, col.id, col.name);
    }
}

function toggleEditOn(){
    richTextField.document.designMode = "On";
}

function toggleEditOff(){
    richTextField.document.designMode = "Off";
}

window.execCmd = function(command){
    richTextField.document.execCommand(command, false, null);
}
window.execCommandWithArg = function(command, arg){
    richTextField.document.execCommand(command, false, arg);
}