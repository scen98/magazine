import * as doc from "../amp/js/doc.js";
import * as utils from "../amp/js/utils.js";
import { PositionedArticle, selectPositionedArticles, selectSideArticles } from "./positionedArticle.js";
let articles: PositionedArticle[] = [];
init();
function init(){
    selectSideArticles(setArticles, getColumnId());
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

function getColumnId(): number{
    let columnId = parseInt(utils.getUrlParameter("cid"));
    if(columnId == null){
        columnId = 0;
    }
    return columnId;
}