import { selectArticlesByState } from "./objects/article.js";
import { getColumns } from "./objects/column.js";
import * as doc from "./doc.js";
import * as utils from "./utils.js";
import { Token, selectAccessibleTokens, selectTokensByColumn } from "./objects/token.js";
import { getMyInfo } from "./objects/author.js";
let articleTable = doc.getDiv("article-table");
let columnSelect = doc.getSelect("column-select");
let articles = [];
let columns = [];
let tokens = [];
let articlePerPage = 50;
let searchInput = doc.getInput("search");
let state = doc.getSelect("state-select");
let tokenSelect = doc.getSelect("token-select");
let excludeLocked = doc.getInput("exclude-locked");
let myInfo;
init();
function init() {
    state.value = "1";
    searchInput.value = "";
    getMyInfo(loadAccessibleTokens);
    getColumns(requestTokens);
    addListeners();
}
function addListeners() {
    doc.addChange(tokenSelect, renderArticles);
    doc.addChange(excludeLocked, renderArticles);
    doc.addClick("search-btn", search);
    doc.addClick("expand-btn", expand);
    doc.addClick("state-select", search);
    doc.addClick("column-select", search);
    doc.addClick(tokenSelect, search);
    addSearchListener();
}
function loadAccessibleTokens(me) {
    myInfo = me;
    selectAccessibleTokens((tokenData) => {
        for (let token of tokenData) {
            doc.renderOption(tokenSelect, token.id.toString(), token.name);
        }
    });
}
function expand() {
    try {
        selectArticlesByState(expandArticles, searchInput.value, articlePerPage, articles.length + 1, parseInt(columnSelect.value), parseInt(state.value));
    }
    catch (_a) {
        doc.get("expand-btn").style.display = "none";
    }
}
function search() {
    articles = [];
    selectArticlesByState(loadArticles, searchInput.value, articlePerPage, 0, parseInt(columnSelect.value), parseInt(state.value));
}
function editArticle(article) {
    if (article.state > 0) {
        window.open("../amp/editx.php?aid=" + article.id);
    }
    else {
        window.open("../amp/edit.php?aid=" + article.id);
    }
}
function switchChangeStateBtn(oldButton, article) {
    let newButton = doc.create("button", null, ["red", "awaitArticleButton"], "Visszaküldés");
    newButton.addEventListener("click", function () { changeState(article); });
    oldButton.parentNode.replaceChild(newButton, oldButton);
}
function changeState(article) {
    article.state = article.state - 1;
    article.updateState(function () { });
    doc.remove(article.id.toString());
    articles = articles.filter(a => a.id !== article.id);
}
function renderArticles() {
    articleTable.innerHTML = "";
    for (var art of articles.filter(a => !a.hasTokenInstance(new Token(parseInt(tokenSelect.value))))) {
        if (isEditable(art) == excludeLocked.checked)
            renderRow(art);
    }
}
function expandArticles(articleData) {
    if (articleData.length > 0) {
        loadArticles(articleData);
    }
    displayExpandBtn(articleData);
}
function addSearchListener() {
    let input = doc.get("search");
    doc.addEnter(input, () => { document.getElementById("search-btn").click(); });
}
function requestTokens(columnData) {
    columns = columnData;
    selectTokensByColumn(requestArticles, null);
}
function requestArticles(tokenData) {
    tokens = tokenData;
    renderColumnSelect();
    selectArticlesByState(loadArticles, "", articlePerPage, 0, parseInt(columnSelect.value), 1);
}
function renderColumnSelect() {
    let highestPerm = myInfo.getHighestPermission();
    let accessibleColumns = [];
    if (highestPerm >= 40) {
        let all = { id: 0, name: "Mind" };
        accessibleColumns = columns;
        accessibleColumns.unshift(all);
    }
    else {
        accessibleColumns = columns.filter(col => utils.hasCmlAccesToColumn(myInfo.permissions, col));
    }
    for (let column of accessibleColumns) {
        doc.renderOption(columnSelect, column.id, column.name);
    }
}
function loadArticles(articleData) {
    articles = articles.concat(articleData);
    renderArticles();
    displayExpandBtn(articleData);
}
function renderRow(article) {
    let container = doc.createDiv(article.id.toString(), ["awaitArticleContainer"]);
    let title = doc.createP(["awaitArticleTitle"], article.title);
    let editBtn = doc.createButton(["awaitArticleButton", "blue"], '<i class="fas fa-edit"></i>', () => { editArticle(article); });
    let table = doc.createTable(["awaitArticleTable"]);
    doc.renderTableRow(table, [doc.createP(["awaitArticleAuthorName"], article.authorName).outerHTML, getColumnNameById(article.columnId), doc.parseDateHun(article.date)]);
    let lockDiv = renderLock(article);
    if (article.state > 0) {
        let changeStateBtn = doc.createButton(["awaitArticleButton", "red"], '<i class="fas fa-backspace"></i>', () => { switchChangeStateBtn(changeStateBtn, article); });
        doc.append(container, [title, table, editBtn, changeStateBtn, lockDiv]);
    }
    else {
        doc.append(container, [title, table, editBtn, lockDiv]);
    }
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
function renderLock(article) {
    let lockDiv = doc.createDiv(null, ["lock"]);
    if (article.isLocked) {
        lockDiv.innerHTML = '<i class="fas fa-lock"></i>';
        if (article.lockedBy === myInfo.permissions[0].authorId) {
            lockDiv.style.backgroundColor = "whitesmoke";
            lockDiv.title = "Ön által lezárva";
        }
        else {
            lockDiv.style.backgroundColor = "gray";
            lockDiv.title = "Más felhasználó által lezárva";
        }
    }
    else {
        lockDiv.innerHTML = '<i class="fas fa-lock-open"></i>';
        lockDiv.style.backgroundColor = "green";
        lockDiv.title = "Nyitott";
    }
    return lockDiv;
}
function isEditable(article) {
    if (!article.isLocked)
        return true;
    if (article.lockedBy === myInfo.permissions[0].authorId)
        return true;
    return false;
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
//# sourceMappingURL=awaitingarticlesController.js.map