import * as A from "./objects/article.js";
import * as doc from "./doc.js";
import { getColumns, Column } from "./objects/column.js";
let columnSelect: HTMLSelectElement = doc.getSelect("column-select"); 
let title: HTMLInputElement = doc.getInput("title"); <HTMLInputElement>document.getElementById("title");
let lead: HTMLInputElement = doc.getInput("lead"); <HTMLInputElement>document.getElementById("lead");
let imgPath: HTMLInputElement = doc.getInput("img-path");  
let text: HTMLIFrameElement = document.getElementById("txtField") as HTMLIFrameElement;
let article: A.Article;
let message: HTMLElement = doc.get("message");
let modal: HTMLDivElement =doc.getDiv("myModal");
let stateSelect = <HTMLInputElement>document.getElementById("state-select");
doc.addClick("change-state-button", updateState);
doc.addClick("save-article-button", saveArticle);
doc.addClick("delete-btn", displayDeleteModal);
doc.addClick("delete-article-btn", deleteArticle);
doc.addClick("open-img-path-btn", openImgPath);
doc.addClick("hide-modal-btn1", hideDeleteModal);
doc.addClick("hide-modal-btn2", hideDeleteModal);
init();

function init(){
   // enableEditMode();
    getColumns(loadPage);
}

function saveArticle(){
    setArticle();
    article.update(refreshMessage);
}

function displayDeleteModal(){
    modal.style.display = "block";
}

function hideDeleteModal(){
    modal.style.display = "none";
}

window.onclick = function(event){
    if(event.target == modal){
        modal.style.display = "none";
    }
}

function deleteArticle(){
    article.delete(onDelete);
}

function openImgPath(){
    window.open(imgPath.value);
}

function updateState(){
    article.state = parseInt(stateSelect.value);
    article.updateState(null);
}

function loadPage(columns: Column[]){
    renderOptions(columns);

    A.selectArticle(loadArticle, getId());
}

function loadArticle(art:A.Article){    
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
    columnSelect.value = article.columnId.toString();
    text.contentWindow.document.body.innerHTML = article.text;
    stateSelect.value = article.state.toString();
    enableEditMode();
}

function setArticle(){
    article.title = title.value;
    article.lead = lead.value;
    article.imgPath = imgPath.value
    article.columnId = parseInt(columnSelect.value);
    article.text = text.contentWindow.document.body.innerHTML;
    article.state = parseInt(stateSelect.value);
}

function getId(){
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return parseInt(urlParams.get("aid"));
}

function renderOptions(columnArray: Column[]){  
    for (let col of columnArray) {
        doc.renderOption(columnSelect, col.id.toString(), col.name);
    }
}

function enableEditMode() {
    text.contentWindow.document.designMode = "On";
}
