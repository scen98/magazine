import { Article, selectArticle } from "./objects/article.js"
import { getColumns } from "./objects/column.js"
let columnSelect = document.getElementById("column-select");
let title = document.getElementById("title");
let lead = document.getElementById("lead");
let imgPath = document.getElementById("img-path");  
let text = document.getElementById("txtField");
let article;
let message = document.getElementById("message");
let modal = document.getElementById("myModal");
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
        renderRow(col);
    }
}

function renderRow(column){
    let opt = document.createElement("option");
        opt.value = column.id;
        opt.innerHTML = column.name;
        columnSelect.add(opt);
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