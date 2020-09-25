import { Column, getColumns } from "./objects/column.js"
import { Article } from "./objects/article.js"
import * as doc from "./doc.js";
let columnSelect: HTMLSelectElement = doc.getSelect("column-select"); 
let newTitle = document.getElementById("new-title") as HTMLInputElement;
let lead = document.getElementById("lead") as HTMLInputElement;
let imgPath = document.getElementById("img-path") as HTMLInputElement;
let text = document.getElementById("txtField") as HTMLIFrameElement;
init();

function init(){
    enableEditMode();
    getColumns(renderOptions);
    doc.addClick(document.getElementById("save-article-btn"), insertArticle);
    doc.addClick("open-img-path-btn", ()=> { window.open(imgPath.value); })
}

function insertArticle(){
    let newArticle = new Article(0, newTitle.value,lead.value, undefined, undefined, imgPath.value, parseInt(columnSelect.value), 
    text.contentWindow.document.body.innerHTML);
    newArticle.insert(()=> { moveToEditor(newArticle); });
}

function moveToEditor(article: Article){ 
    window.location.href = `../amp/cikk_szerk.php?aid=${article.id}&cim=${article.title}`;
}

function renderOptions(columnArray: Column[]){
    for (let col of columnArray) {
        doc.renderOption(columnSelect, col.id.toString(), col.name);
    }
    enableEditMode(); //ez a szar bugos firefoxon és olyamatosan hívogatni kell
}

function enableEditMode() {
    text.contentWindow.document.designMode = "On";
}
