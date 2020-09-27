import * as doc from "../amp/js/doc.js";
import * as utils from "../amp/js/utils.js";
import { selectPositionedArticles } from "./positionedArticle.js";
let articles = [];
init();
function init() {
    selectPositionedArticles(setArticles, getColumnId());
    setColumnName();
}
function setArticles(articleData) {
    articles = articleData;
    renderArticles();
}
function renderArticles() {
    for (let article of articles) {
        article.render();
    }
}
function setColumnName() {
    let columnName = utils.getUrlParameter("rovat");
    let columnNameElement = doc.get("column-name");
    if (columnName == null || columnNameElement == null)
        return;
    columnNameElement.innerText = columnName;
}
function getColumnId() {
    let columnId = parseInt(utils.getUrlParameter("cid"));
    if (columnId == null) {
        columnId = 0;
    }
    return columnId;
}
//# sourceMappingURL=mainController.js.map