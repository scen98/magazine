import { selectArticle } from "./objects/article.js";
import * as doc from "./doc.js";
import * as utils from "./utils.js";
import { getColumns } from "./objects/column.js";
let article;
let columns = [];
init();
function init() {
    getColumns(loadPage);
}
function loadPage(columnData) {
    columns = columnData;
    selectArticle(setArticle, parseInt(utils.getUrlParameter("aid")));
}
function setArticle(articleData) {
    articleData;
    doc.getImg("main-img").src = articleData.imgPath;
    doc.get("title").innerText = articleData.title;
    doc.get("details").innerText = `${utils.getUrlParameter("by")}, ${columns.find(c => c.id === articleData.columnId).name}, ${doc.parseDateHun(articleData.date)}`;
    doc.get("lead").innerText = articleData.lead;
    doc.get("text").innerHTML = articleData.text;
}
function loadArticle(art) {
    article = art;
}
//# sourceMappingURL=articleController.js.map