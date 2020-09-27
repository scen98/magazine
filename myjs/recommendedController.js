import * as utils from "../amp/js/utils.js";
import { selectSideArticles } from "./positionedArticle.js";
let articles = [];
init();
function init() {
    selectSideArticles(setArticles, getColumnId());
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
function getColumnId() {
    let columnId = parseInt(utils.getUrlParameter("cid"));
    if (columnId == null) {
        columnId = 0;
    }
    return columnId;
}
//# sourceMappingURL=recommendedController.js.map