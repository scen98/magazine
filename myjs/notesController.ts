import * as doc from "../amp/js/doc.js";
import * as utils from "../amp/js/utils.js";
import { PositionedArticle, selectPositionedArticles, selectPositionedArticlesByBlock } from "./positionedArticle.js";
init();
function init(){
    let columnParameter = utils.getUrlParameter("cid");
    if(columnParameter == null || parseInt(columnParameter) ===  0) //a főoldalon nem kell lefuttatni ezt a scriptet, mert a recommendedController betölti a szükséges cikkeket
    {
        return;
    }
    selectPositionedArticlesByBlock(renderPositions, 3);
}

function renderPositions(articleData: PositionedArticle[]){
    for (let article of articleData) {
        article.render();
    }
}