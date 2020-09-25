import { Article, selectArticle } from "./objects/article.js";
import * as doc from "./doc.js";
import * as utils from "./utils.js";
import { Author } from "./objects/author.js";
import { getColumns, Column } from "./objects/column.js";
let article: Article;
let columns: Column[] = [];
init();
function init(){
    getColumns(loadPage);
}

function loadPage(columnData: Column[]){
    columns = columnData;
    selectArticle(setArticle, parseInt(utils.getUrlParameter("aid")));
}

function setArticle(articleData: Article){
    articleData;
    doc.getImg("main-img").src = articleData.imgPath;
    doc.get("title").innerText = articleData.title;
    doc.get("details").innerText = `${utils.getUrlParameter("by")}, ${columns.find(c=> c.id ===  articleData.columnId).name}, ${doc.parseDateHun(articleData.date)}`;
    doc.get("lead").innerText = articleData.lead;
    doc.get("text").innerHTML = articleData.text;
}

function loadArticle(art: Article){    
    article = art;
}
