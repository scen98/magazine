import { Article, selectArticle, saveText } from "./objects/article.js";
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
let stateSelect = document.getElementById("state-select");
init();

function init(){
    enableEditMode();
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

window.updateState = ()=>{
    article.state = stateSelect.value;
    article.updateState(()=>{
        
    });
}

function loadPage(columns){
    renderOptions(columns);
    selectArticle(loadArticle, getId());
}

function loadArticle(art){    
    article = art;
    article.id = getId();
    refreshArticle();    
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
    stateSelect.value = article.state;
}

function setArticle(){
    article.title = title.value;
    article.lead = lead.value;
    article.imgPath = imgPath.value
    article.columnId = columnSelect.value
    article.text = text.contentWindow.document.body.innerHTML;
    article.state = stateSelect.value;
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

function enableEditMode() {
    richTextField.document.designMode = "On";
}

window.execCmd = function(command){
    richTextField.document.execCommand(command, false, null);
}
window.execCommandWithArg = function(command, arg){
    richTextField.document.execCommand(command, false, arg);
}