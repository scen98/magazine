import { getColumns } from "./objects/column.js";
import { Article } from "./objects/article.js";
import * as doc from "./doc.js";
let columnSelect = doc.getSelect("column-select");
let newTitle = document.getElementById("new-title");
let lead = document.getElementById("lead");
let imgPath = document.getElementById("img-path");
let text = document.getElementById("txtField");
init();
function init() {
    enableEditMode();
    getColumns(renderOptions);
    doc.addClick(document.getElementById("save-article-btn"), insertArticle);
    doc.addClick("open-img-path-btn", () => { window.open(imgPath.value); });
}
function insertArticle() {
    let newArticle = new Article(0, newTitle.value, lead.value, undefined, undefined, imgPath.value, parseInt(columnSelect.value), text.contentWindow.document.body.innerHTML);
    newArticle.insert(() => { moveToEditor(newArticle); });
}
function moveToEditor(article) {
    window.location.href = `../amp/cikk_szerk.php?aid=${article.id}&cim=${article.title}`;
}
function renderOptions(columnArray) {
    for (let col of columnArray) {
        doc.renderOption(columnSelect, col.id.toString(), col.name);
    }
    enableEditMode(); //ez a szar bugos firefoxon és olyamatosan hívogatni kell
}
function enableEditMode() {
    text.contentWindow.document.designMode = "On";
}
//# sourceMappingURL=writeController.js.map