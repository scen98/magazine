import * as doc from "./doc.js";
import * as utils from "./utils.js";
import { getMyInfo, permissionName, selectAuthor } from "./objects/author.js";
import { selectByAuthorId } from "./objects/article.js";
import { getColumns } from "./objects/column.js";
let tokenPermissionTable = doc.getUl("token-permission-list");
let searchInput = doc.getInput("search-input");
let columnSelect = doc.getSelect("column-select");
let articleTable = doc.getDiv("article-container");
let stateSelect = doc.getSelect("state-select");
let author;
let columns = [];
let articlePerPage = 100;
let articles = [];
let myInfo;
init();
function init() {
    stateSelect.value = "2";
    getColumns((columnData) => {
        setColumns(columnData);
        selectAuthor(setAuthor, parseInt(utils.getUrlParameter("szerzo")));
    });
    addListeners();
}
function setAuthor(authorData) {
    author = authorData;
    renderAuthor();
}
function renderAuthor() {
    doc.setText("author-name", author.userName);
    for (let permission of author.permissions) {
        renderAuthorPermission(permission);
    }
    if (author.tokenPermissions != null && author.tokenPermissions.length > 0) {
        renderTokenPermissions();
    }
    else {
        doc.get("token-permission-title").style.display = "none";
    }
    getMyInfo((me) => {
        myInfo = me;
        selectByAuthorId(setArticles, author.id, "", parseInt(stateSelect.value), parseInt(columnSelect.value), articlePerPage, 0);
    });
}
function renderAuthorPermission(permission) {
    let column = columns.find(c => c.id === permission.columnId);
    let columnName;
    if (column != null) {
        columnName = `(${column.name})`;
    }
    else {
        columnName = "";
    }
    doc.renderLi("permission-list", `${permissionName(permission)} ${columnName}`);
}
function setArticles(articleData) {
    articles = articleData;
    renderArticles();
    displayExpandBtn(articleData);
}
function addListeners() {
    doc.addClick("search-btn", search);
    doc.addClick("expand-btn", expand);
    doc.addChange("state-select", search);
    doc.addChange("column-select", search);
    doc.addChange(searchInput, search);
}
function search() {
    articles = [];
    selectByAuthorId(setArticles, author.id, searchInput.value, parseInt(stateSelect.value), parseInt(columnSelect.value), articlePerPage, 0);
}
function expand() {
    try {
        selectByAuthorId(expandArticles, author.id, searchInput.value, parseInt(stateSelect.value), parseInt(columnSelect.value), articlePerPage, articles.length);
    }
    catch (_a) {
        doc.get("expand-btn").style.display = "none";
    }
}
function renderArticles() {
    articleTable.innerHTML = "";
    for (var art of articles) {
        renderRow(art);
    }
}
function expandArticles(articleData) {
    if (articleData.length > 0) {
        setArticles(articleData);
    }
}
function renderRow(article) {
    let container = doc.createDiv(article.id.toString(), ["awaitArticleContainer"]);
    let title = doc.createA(["awaitArticleTitle"], article.title, `../amp/cikk.php?aid=${article.id}&by=${author.userName}`);
    let lead = doc.createP(["articleLead"], article.lead);
    let table = doc.createTable(["awaitArticleTable"]);
    doc.renderTableRow(table, [getColumnNameById(article.columnId), doc.parseDateHun(article.date)]);
    doc.append(container, [title, lead, table]);
    if (isArticleEditable(article)) {
        renderEditBtn(container, article);
    }
    articleTable.appendChild(container);
}
function renderTokenPermissions() {
    for (let tokenPermission of author.tokenPermissions) {
        console.log(tokenPermission);
        doc.renderLi("token-permission-list", tokenPermission.tokenName);
    }
}
function renderEditBtn(parent, article) {
    let button = doc.createButton(["awaitArticleButton", "blue"], '<i class="fas fa-edit"></i>', () => {
        window.open(`../amp/cikk_szerk_x.php?aid=${article.id}`);
    });
    parent.appendChild(button);
}
function getColumnNameById(columnId) {
    var result = columns.find(c => c.id == columnId);
    return result.name;
}
function setColumns(columnData) {
    columns = columnData;
    for (let column of columns) {
        doc.renderOption(columnSelect, column.id.toString(), column.name);
    }
}
function isArticleEditable(article) {
    if (article.state < 1)
        return false;
    if (myInfo.getHighestPermission() >= 40)
        return true;
    return myInfo.permissions.some(p => p.columnId === article.columnId);
}
function displayExpandBtn(articleData) {
    if (articleData.length < articlePerPage) {
        document.getElementById("expand-btn").style.display = "none";
    }
    else {
        document.getElementById("expand-btn").style.display = "inline";
    }
}
//# sourceMappingURL=authorController.js.map