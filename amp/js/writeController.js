import { getColumns } from "./objects/column.js"
import { Article } from "./objects/article.js"
let columnSelect = document.getElementById("column-select");
init();

function init(){
    enableEditMode();
    getColumns(renderOptions);
}

window.insertArticle = function(){
    let newArticle = new Article(0, document.getElementById("new-title").value, document.getElementById("lead").value, 
    null, null, document.getElementById("img-path").value, columnSelect.options[columnSelect.selectedIndex].value, 
    document.getElementById("txtField").contentWindow.document.body.innerHTML);
    newArticle.insert(moveToEditor);
}

function moveToEditor(articleId){
    window.location.href = "../amp/edit.php?aid="+articleId;
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

window.openImgPath = function(){
    window.open(document.getElementById("img-path").value);
}