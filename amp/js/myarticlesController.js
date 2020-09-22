import { selectMyArticles } from "./objects/article.js";
import { getColumns } from "./objects/column.js";
import * as doc from "./doc.js";
let articleTable = document.getElementById("article-table");
let expandBtn = document.getElementById("expand-btn");
let searchBtn = document.getElementById("search-btn");
let selectOrder;
let articles = [];
let columns = [];
let articlePerPage = 20;
let searchInput = "";
let selectDesc;
init();
function init() {
    loadPage();
    setSearchParameters();
    addSearchListener();
    doc.addChange(document.getElementById("search"), search);
    doc.addClick(expandBtn, expand);
    doc.addClick(searchBtn, search);
}
function loadPage() {
    getColumns(prepareArticles);
}
function expand() {
    try {
        selectMyArticles(expandArticles, searchInput, articlePerPage, columns.length + 1, selectOrder, selectDesc);
    }
    catch (_a) {
        document.getElementById("expand-btn").style.display = "none";
    }
}
function search() {
    setSearchParameters();
    articleTable.innerHTML = "";
    articles = [];
    selectMyArticles(loadArticles, searchInput, articlePerPage, 0, selectOrder, selectDesc);
}
function editArticle(id) {
    window.location.href = "../amp/edit.php?aid=" + id;
}
function switchDeleteBtn(oldButton, article) {
    let newButton = doc.createButton(["red", "articleButton"], "Törlés", () => { deleteArticle(article); });
    oldButton.parentNode.replaceChild(newButton, oldButton);
}
function deleteArticle(article) {
    article.delete(function () { });
    document.getElementById(article.id.toString()).remove();
    articles = articles.filter(a => a.id !== article.id);
}
function expandArticles(articleData) {
    if (articleData.length > 0) {
        loadArticles(articleData);
    }
    displayExpandBtn(articleData);
}
function addSearchListener() {
    let input = document.getElementById("search");
    doc.addEnter(input, () => { document.getElementById("search-btn").click(); });
}
function setSearchParameters() {
    searchInput = document.getElementById("search").value;
    selectOrder = document.getElementById("order-select").value;
    selectDesc = document.getElementById("desc-select").value;
}
function prepareArticles(columnData) {
    columns = columnData;
    selectMyArticles(loadArticles, "", articlePerPage, 0, "date", true);
}
function loadArticles(articleData) {
    articles = articles.concat(articleData);
    for (var art of articleData) {
        renderRow(art);
    }
    displayExpandBtn(articleData);
}
function renderRow(article) {
    let container = doc.createDiv(article.id.toString(), ["articleContainer"]);
    let title = doc.createP(["articleTitle"], article.title);
    let lead = doc.createDiv(null, ["articleLead"]);
    lead.innerText = article.lead;
    let columnName = doc.createP(["articleColumn"], getColumnNameById(article.columnId));
    let editBtn = doc.createButton(["articleButton", "blue"], '<i class="fas fa-edit"></i>', () => { editArticle(article.id); });
    let date = doc.createP(["articleDate"], doc.parseDateHun(article.date));
    let deleteBtn = doc.createButton(["articleButton", "red"], '<i class="fas fa-trash-alt"></i>', () => { switchDeleteBtn(deleteBtn, article); });
    doc.append(container, [title, columnName, lead, deleteBtn, editBtn, date]);
    articleTable.appendChild(container);
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