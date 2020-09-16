import { Article, selectArticle } from "./objects/article.js";
import * as Token from "./objects/token.js";
import { getColumns } from "./objects/column.js";
import * as doc from "./doc.js";
import { TokenInstance } from "./objects/tokenInstance.js";
let columnSelect = document.getElementById("column-select");
let title = document.getElementById("title");
let lead = document.getElementById("lead");
let imgPath = document.getElementById("img-path");  
let text = document.getElementById("txtField");
let article;
let message = document.getElementById("message");
let deleteModal = document.getElementById("delete-modal");
let state = document.getElementById("state");
let lockMessage = document.getElementById("lock-message");
let lockBtn = document.getElementById("lock-btn");
let necessaryTokens = [];
let myTokenPermissions;
let tokenTable = document.getElementById("token-table");
let stateSelect = document.getElementById("state-select");
let stateModal = document.getElementById("state-modal");

init();

function init(){
    Token.getMyTokenPermissions(setMyTokenPermissions);
    getColumns(loadPage);
}

window.saveArticle = function(){
    setArticle();
    article.update(refreshMessage);
}

window.displayStateModal = function(){
    stateModal.style.display = "block";
}

window.hideStateModal = function(){
    stateModal.style.display = "none";
}

window.displayDeleteModal = function(){
    deleteModal.style.display = "block";
}

window.hideDeleteModal = function(){
    deleteModal.style.display = "none";
}

window.onclick = function(event){
    if(event.target == deleteModal){
        deleteModal.style.display = "none";
    }
    if(event.target == stateModal){
        stateModal.style.display = "none";
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

window.checkState = () =>{
    article.state = stateSelect.value;
    if(!allTokensExist() && article.state > 1){
        displayStateModal();
    } else {
        article.updateState();
    }
}

window.saveState = ()=>{
    article.updateState();
    hideStateModal();
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
    if(article.state === 0){
        window.location.href = "../amp/edit.php?aid="+article.id;
    }
    stateSelect.value = article.state;
    Token.selectTokensByColumn((response)=>{
        if(article.state > 0){
            renderTokens(response);
        }
    }, article.columnId);
    article.id = getId();
    refreshArticle();
}
function allTokensExist(){
    return necessaryTokens.every(doesTokenInstanceExist);
}

function renderTokens(tokens){
    necessaryTokens = tokens;
    for (let token of necessaryTokens) {
        renderToken(token);
    }
}

function renderToken(token){
    let container = doc.createDiv("token"+token.id, ["tokenContainer"]);
    let name = doc.createP(["tokenName"], token.name);
    let doesExist = doesTokenInstanceExist(token);
    let hasAccess = hasAccessToToken(token);
    doc.append(container, [name]);
    if(doesExist && hasAccess){ 
        renderExistingTokenElements(token, container);
    } else if(!doesExist && hasAccess) {
        renderNonExistingTokenElements(token, container);
    } else {
        container.classList.add("redToken");
    }
    doc.append(tokenTable, [container]); 
}

function renderNonExistingTokenElements(token, tokenContainer){
    let addBtn =  doc.createButton(["tokenButton", "green"], '<i class="fas fa-plus-square"></i>', ()=>{
        let newTokenInstance = new TokenInstance(0, article.id, token.id, {date: new Date(), authorName: "Általam"});
        newTokenInstance.insert( ()=> { onTokenInstanceInsert(newTokenInstance); });
    });
    tokenContainer.classList.add("redToken");
    
    doc.append(tokenContainer, [addBtn]);
}

function onTokenInstanceInsert(newTokenInstance){
    article.tokenInstances.push(newTokenInstance);
    tokenTable.innerHTML = "";
    for (let token of necessaryTokens) {
        renderToken(token);
    }
}

function renderExistingTokenElements(token, tokenContainer){
    let tokenInstance = article.tokenInstances.find(t=> t.tokenId === token.id);
    let deleteBtn =  doc.createButton(["tokenButton", "red"], '<i class="fas fa-minus-circle"></i>', ()=>{
        switchDeleteButton(deleteBtn, tokenInstance);
    });
    tokenContainer.classList.add("green");
    
    let tokenAuthor = doc.createP(["tokenInfo"], tokenInstance.authorName + ": ");
    let date = new Date(tokenInstance.date);
    let tokenDate = doc.createP(["tokenInfo"], date.getFullYear() + ". " + doc.monthNames[date.getMonth()] + ". " + date.getDay()  + " " + date.getHours() + ":" + date.getMinutes());
    doc.append(tokenContainer, [tokenAuthor, tokenDate, deleteBtn]);
    
}

function switchDeleteButton(oldButton, toDelete){
    let newBtn = doc.createButton(["tokenButton", "red"], "Eltávolít", ()=>{
        toDelete.delete(()=> {
            onTokenInstanceDelete(toDelete);
        });
    });
    oldButton.parentNode.replaceChild(newBtn, oldButton);
}

function onTokenInstanceDelete(tokenInstance){
    article.tokenInstances = article.tokenInstances.filter(t=> t.id !== tokenInstance.id);
    tokenTable.innerHTML = "";
    for (let token of necessaryTokens) {
        renderToken(token);
    }
}

function hasAccessToToken(token){
    if(permissions[0].level >= 40){
        return true;
    }
    for (let tokenPermission of myTokenPermissions) {
        if(token.id === tokenPermission.tokenId) return true;            
    }
    return false;
}

function doesTokenInstanceExist(token){
    for (let tokenInstance of article.tokenInstances) {
        if(token.id === tokenInstance.tokenId) return true;
    }
    return false;
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