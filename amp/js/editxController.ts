import { Article, selectArticle } from "./objects/article.js";
import { Token, getMyTokenPermissions, selectTokensByColumn } from "./objects/token.js";
import { getColumns, Column } from "./objects/column.js";
import * as doc from "./doc.js";
import { TokenInstance } from "./objects/tokenInstance.js";
import * as utils from "./utils.js";
import { TokenPermission } from "./objects/permission.js";
import { Author, getMyInfo } from "./objects/author.js";
let columnSelect: HTMLSelectElement = doc.getSelect("column-select");
let title: HTMLInputElement = doc.getInput("title");
let lead:HTMLInputElement = doc.getInput("lead");
let imgPath: HTMLInputElement = doc.getInput("img-path");  
let text: HTMLIFrameElement = document.getElementById("txtField") as HTMLIFrameElement;
let article: Article;
let message = document.getElementById("message");
let deleteModal:HTMLDivElement = doc.getDiv("delete-modal");
let state = document.getElementById("state");
let lockMessage = document.getElementById("lock-message");
let lockBtn: HTMLButtonElement = doc.getBtn("lock-btn");
let necessaryTokens: Token[] = [];
let myTokenPermissions: TokenPermission[] = [];
let tokenTable = document.getElementById("token-table");
let stateSelect: HTMLSelectElement = doc.getSelect("state-select");
let stateModal: HTMLDivElement = doc.getDiv("state-modal");
let myInfo: Author;

init();
function init(){
    getMyInfo(setMyTokenPermissions);
    getColumns(loadPage);
    initListeners();
}

function initListeners(){
    doc.addClick(doc.get("open-img"), openImgPath);
    doc.addClick(lockBtn, switchLock);
    doc.addClick("check-btn", checkState);
    doc.addClick("display-delete-modal", displayDeleteModal);
    doc.addClick("save-btn", saveArticle);
    doc.addClick("delete-close-span", hideDeleteModal);
    doc.addClick("delete-btn", deleteArticle);
    doc.addClick("hide-delete-modal-btn", hideDeleteModal);
    doc.addClick("change-close-span", hideStateModal);
    doc.addClick("save-state-btn", saveState);
    doc.addClick("hide-state-modal-btn", hideStateModal);
}

function saveArticle(){
    setArticle();
    article.update(refreshMessage);
}

function displayStateModal(){
    stateModal.style.display = "block";
}

function hideStateModal(){
    stateModal.style.display = "none";
}

function displayDeleteModal(){
    deleteModal.style.display = "block";
}

function hideDeleteModal(){
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

function deleteArticle(){
    article.delete(onDelete);
}

function openImgPath(){
    window.open(imgPath.value);
}

function switchLock(){
    article.switchLock(()=>{
        setState();
    }, myInfo.permissions[0].authorId);
}

function checkState(){
    article.state = parseInt(stateSelect.value);
    if(!article.hasAllTokenInstances(necessaryTokens) && article.state > 1){
        displayStateModal();
    } else {
        article.updateState(null);
    }
}

function saveState(){
    article.updateState(null);
    hideStateModal();
}

function setMyTokenPermissions(me: Author){ 
    myInfo = me;
}

function loadPage(columns: Column[]){
    renderOptions(columns);
    selectArticle(loadArticle, getId());
}

function loadArticle(art: Article){ 
    article = art;
    if(article.state === 0){
        window.location.href = "../amp/edit.php?aid="+article.id;
    }
    stateSelect.value =article.state.toString();
    selectTokensByColumn((response)=>{
        if(article.state > 0){
            renderTokens(response);
        }
    }, article.columnId);
    article.id = getId();
    refreshArticle();
}
function allTokensExist(){
    return article.hasAllTokenInstances(necessaryTokens); 
}

function renderTokens(tokens: Token[]){
    necessaryTokens = tokens;
    for (let token of necessaryTokens) {
        renderToken(token);
    }
}

function renderToken(token: Token){
    let container = doc.createDiv("token"+token.id, ["tokenContainer"]);
    let name = doc.createP(["tokenName"], token.name);
    let doesExist = article.hasTokenInstance(token);
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

function renderNonExistingTokenElements(token: Token, tokenContainer: HTMLDivElement){
    let addBtn =  doc.createButton(["tokenButton", "green"], '<i class="fas fa-plus-square"></i>', ()=>{
        let newTokenInstance = new TokenInstance(0, article.id, token.id, myInfo.id, myInfo.userName, new Date());
        newTokenInstance.insert( ()=> { onTokenInstanceInsert(newTokenInstance); });
    });
    tokenContainer.classList.add("redToken");
    
    doc.append(tokenContainer, [addBtn]);
}

function onTokenInstanceInsert(newTokenInstance: TokenInstance){
    article.tokenInstances.push(newTokenInstance);
    tokenTable.innerHTML = "";
    for (let token of necessaryTokens) {
        renderToken(token);
    }
}

function renderExistingTokenElements(token: Token, tokenContainer: HTMLDivElement){
    let tokenInstance = article.tokenInstances.find(t=> t.tokenId === token.id);
    let deleteBtn =  doc.createButton(["tokenButton", "red"], '<i class="fas fa-minus-circle"></i>', ()=>{
        switchDeleteButton(deleteBtn, tokenInstance);
    });
    tokenContainer.classList.add("green");
    
    let tokenAuthor = doc.createP(["tokenInfo"], tokenInstance.authorName + ": ");
    let tokenDate = doc.createP(["tokenInfo"], doc.parseDateHun(tokenInstance.date));
    doc.append(tokenContainer, [tokenAuthor, tokenDate, deleteBtn]);
    
}

function switchDeleteButton(oldButton: HTMLButtonElement, toDelete: TokenInstance){
    let newBtn = doc.createButton(["tokenButton", "red"], "Eltávolít", ()=>{
        toDelete.delete(()=> {
            onTokenInstanceDelete(toDelete);
        });
    });
    oldButton.parentNode.replaceChild(newBtn, oldButton);
}

function onTokenInstanceDelete(tokenInstance: TokenInstance){
    article.tokenInstances = article.tokenInstances.filter(t=> t.id !== tokenInstance.id);
    tokenTable.innerHTML = "";
    for (let token of necessaryTokens) {
        renderToken(token);
    }
}

function hasAccessToToken(token: Token){
    if(myInfo.permissions[0].level >= 40){
        return true;
    }
    for (let tokenPermission of myTokenPermissions) {
        if(token.id === tokenPermission.tokenId) return true;            
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
    columnSelect.value = article.columnId.toString();
    text.contentWindow.document.body.innerHTML = article.text;
    setState();
}

function setState(){
    if(!article.isLocked){
        openState();
    } else if(article.isLocked && article.lockedBy == myInfo.permissions[0].authorId){
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
    article.imgPath = imgPath.value;
    article.columnId = parseInt(columnSelect.value);
    article.text = text.contentWindow.document.body.innerHTML;

}

function getId(){
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return parseInt(urlParams.get("aid"));
}

function renderOptions(columnArray: Column[]){
    let highestPerm = myInfo.getHighestPermission();
    if(highestPerm < 40){ 
        columnArray = columnArray.filter(col => utils.hasCmlAccesToColumn(myInfo.permissions, col));
    }
    for (let col of columnArray) {
        doc.renderOption(columnSelect, col.id.toString(), col.name);
    }
}

function toggleEditOn(){
    text.contentWindow.document.designMode = "On";
}

function toggleEditOff(){
    text.contentWindow.document.designMode = "Off";
}