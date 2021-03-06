import * as doc from "../amp/js/doc.js";
import * as utils from "../amp/js/utils.js";
import { PositionedArticle, selectPositionedArticles } from "./positionedArticle.js";
let articles: PositionedArticle[] = [];
init();
function init(){
    selectPositionedArticles(setArticles, getColumnId());
    setColumnName();
}

function setArticles(articleData: PositionedArticle[]){
    articles = articleData;
    renderArticles();
}

function renderArticles(){
    for (let article of articles) {
        article.render();
    }
}

function setColumnName(){
    let columnName = utils.getUrlParameter("rovat");
    let columnNameElement = doc.get("column-name");
    if(columnName == null || columnNameElement == null) return;
    columnNameElement.innerText = columnName;
}

function getColumnId(): number{
    let columnId = parseInt(utils.getUrlParameter("cid"));
    if(columnId == null){
        columnId = 0;
    }
    return columnId;
}