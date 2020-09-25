import { selectByAuthorId } from "./objects/article.js";
import { getColumns } from "./objects/column.js";
import * as doc from "./doc.js";
import { selectTokensByColumn } from "./objects/token.js";
import { getMyInfo } from "./objects/author.js";
let articleTable = doc.getDiv("article-table");
let columnSelect = doc.getSelect("column-select");
let articles = [];
let columns = [];
let tokens = [];
let articlePerPage = 100; //ez 100 kB-nál nem kéne hogy több legyen
let searchInput = doc.getInput("search");
let stateSelect = doc.getSelect("state-select");
let myInfo;
init();
function init() {
    stateSelect.value = "0";
    searchInput.value = "";
    getMyInfo((me) => {
        myInfo = me;
        getColumns(requestTokens);
    });
    addListeners();
}
function setArticles(tokenData) {
    tokens = tokenData;
    renderColumnSelect();
    selectByAuthorId(loadArticles, myInfo.id, "", 0, parseInt(columnSelect.value), articlePerPage, 0);
}
function loadArticles(articleData) {
    articles = articles.concat(articleData);
    renderArticles();
    displayExpandBtn(articleData);
}
function addListeners() {
    doc.addClick("search-btn", search);
    doc.addClick("expand-btn", expand);
    doc.addChange("state-select", search);
    doc.addChange("column-select", search);
    doc.addChange("search", search);
}
function expand() {
    try {
        selectByAuthorId(expandArticles, myInfo.id, "", parseInt(stateSelect.value), parseInt(columnSelect.value), articlePerPage, articles.length);
    }
    catch (_a) {
        doc.get("expand-btn").style.display = "none";
    }
}
function search() {
    articles = [];
    selectByAuthorId(loadArticles, myInfo.id, searchInput.value, parseInt(stateSelect.value), parseInt(columnSelect.value), articlePerPage, 0);
}
function editArticle(article) {
    window.location.href = `../amp/cikk_szerk.php?aid=${article.id}`;
}
/* talán még egyszer jól jön
function switchChangeStateBtn(oldButton: HTMLButtonElement, article: Article){
    let newButton = doc.create("button", null, ["red", "awaitArticleButton"], "Visszaküldés");
    newButton.addEventListener("click", function() { changeState(article); });
    oldButton.parentNode.replaceChild(newButton, oldButton);
} */
function changeState(article) {
    article.state = article.state - 1;
    article.updateState(function () { });
    doc.remove(article.id.toString());
    articles = articles.filter(a => a.id !== article.id);
}
function renderArticles() {
    articleTable.innerHTML = "";
    for (var art of articles) {
        renderRow(art);
    }
}
function expandArticles(articleData) {
    if (articleData.length > 0) {
        loadArticles(articleData);
    }
}
function requestTokens(columnData) {
    columns = columnData;
    selectTokensByColumn(setArticles, null);
}
function renderColumnSelect() {
    //doc.renderOption(columnSelect, "0", "Mind");
    for (let column of columns) {
        doc.renderOption(columnSelect, column.id.toString(), column.name);
    }
}
function renderRow(article) {
    let container = doc.createDiv(article.id.toString(), ["awaitArticleContainer"]);
    let title = doc.createP(["awaitArticleTitle"], article.title);
    let lead = doc.createP(["articleLead"], article.lead);
    let editBtn = doc.createButton(["awaitArticleButton", "blue"], '<i class="fas fa-edit"></i>', () => { editArticle(article); });
    let table = doc.createTable(["awaitArticleTable"]);
    doc.renderTableRow(table, [getColumnNameById(article.columnId), doc.parseDateHun(article.date)]);
    doc.append(container, [title, lead, table, editBtn]);
    renderTokenInstances(container, article);
    articleTable.appendChild(container);
}
function renderTokenInstances(container, article) {
    for (let token of tokens) {
        if (isTokenNecessary(token, article))
            renderTokenInstance(container, article, token);
    }
}
function renderTokenInstance(container, article, token) {
    let tokenDiv = doc.createDiv(null, ["redAwaitingToken"]);
    if (article.hasTokenInstance(token)) {
        tokenDiv.className = "greenAwaitingToken";
    }
    tokenDiv.innerText = token.name;
    doc.append(container, [tokenDiv]);
}
function isTokenNecessary(token, article) {
    if (token.columnId === 0)
        return true;
    return article.columnId === token.columnId;
}
function getColumnNameById(columnId) {
    var result = columns.find(c => c.id == columnId);
    return result.name;
}
function displayExpandBtn(articleData) {
    if (articleData.length < articlePerPage) {
        document.getElementById("expand-btn").style.display = "none";
    }
    else {
        document.getElementById("expand-btn").style.display = "inline";
    }
}
//# sourceMappingURL=myarticlesController.js.map