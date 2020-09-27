import * as utils from "../amp/js/utils.js";
import { selectPositionedArticlesByBlock } from "./positionedArticle.js";
init();
function init() {
    let columnParameter = utils.getUrlParameter("cid");
    if (columnParameter == null || parseInt(columnParameter) === 0) //a főoldalon nem kell lefuttatni ezt a scriptet, mert a recommendedController betölti a szükséges cikkeket
     {
        return;
    }
    selectPositionedArticlesByBlock(renderPositions, 3);
}
function renderPositions(articleData) {
    for (let article of articleData) {
        article.render();
    }
}
//# sourceMappingURL=notesController.js.map