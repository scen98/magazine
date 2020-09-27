import { selectReadableArticle } from "./positionedArticle.js";
import * as doc from "../amp/js/doc.js";
import * as utils from "../amp/js/utils.js";
import { Article } from "../amp/js/objects/article.js";
init();
function init(){
    selectReadableArticle(setArticle, parseInt(utils.getUrlParameter("aid")));
}

function setArticle(articleData: Article){
    let columnName: string = utils.getUrlParameter("rovat");
    doc.get("title").innerText = articleData.title;
    doc.get("lead").innerText = articleData.lead;
    doc.get("text").innerHTML = articleData.text;
    doc.get("date").innerText = doc.parseDateYYYYMMDD(articleData.date);
    doc.get("author-name").innerText = articleData.authorName;
    doc.getImg("main-img").src = articleData.imgPath;
    let columnAnchor = doc.get("column-name") as HTMLAnchorElement;
    columnAnchor.innerText = columnName;
    columnAnchor.href = `../magazine/rovat.php?cid=${articleData.columnId}&rovat=${columnName}`;
}