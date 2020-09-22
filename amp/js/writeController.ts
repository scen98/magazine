import { Column, getColumns } from "./objects/column.js"
import { Article } from "./objects/article.js"
import * as doc from "./doc.js";
let columnSelect: HTMLSelectElement = doc.getSelect("column-select"); 
let newTitle = document.getElementById("new-title") as HTMLInputElement;
let lead = document.getElementById("lead") as HTMLInputElement;
let imgPath = document.getElementById("img-path") as HTMLInputElement;
doc.addClick(document.getElementById("save-article-btn"), insertArticle);
let text = document.getElementById("txtField") as HTMLIFrameElement;
init();

function init(){
    enableEditMode();
    getColumns(renderOptions);
}

function insertArticle(){
    let newArticle = new Article(0, newTitle.value,lead.value, undefined, undefined, imgPath.value, parseInt(columnSelect.value), 
    text.contentWindow.document.body.innerHTML);
    newArticle.insert(()=> { moveToEditor(newArticle.id); });
}

function moveToEditor(articleId: number){
    window.location.href = "../amp/edit.php?aid="+articleId;
}

function renderOptions(columnArray: Column[]){
    for (let col of columnArray) {
        doc.renderOption(columnSelect, col.id.toString(), col.name);
    }
}

function enableEditMode() {
    text.contentWindow.document.designMode = "On";
}
