import { Article, selectArticlesByState } from "./objects/article.js"
import { getColumns } from "./objects/column.js"
import * as doc from "./doc.js";
import * as utils from "./utils.js";

let articleTable = document.getElementById("article-table");
let columnSelect = document.getElementById("column-select");
let articles = [];
let columns = [];
let articlePerPage = 30;
let search = document.getElementById("search");
let state = document.getElementById("state-select");
let selectDesc;

init();
function init(){
    state.value = 1;
    search.value = "";
    getColumns(requestArticles);
    addSearchListener();
}
window.expand = function() {
    try {
        selectArticlesByState(expandArticles, search.value, articlePerPage, articles.length+1, columnSelect.value, state.value);
    }
    catch {
        document.getElementById("expand-btn").style.display = "none";
    }  
}

window.search = function(){
    articleTable.innerHTML = "";
    articles = [];
    selectArticlesByState(loadArticles, search.value, articlePerPage, 0, columnSelect.value, state.value);
}

window.editArticle = function(article){
    if(article.state > 0){
        window.location.href = "../amp/editx.php?aid="+article.id;
    } else {
        window.location.href = "../amp/edit.php?aid="+article.id;
    }
    
}

window.switchChangeStateBtn = function(oldButton, article){
    let newButton = doc.create("button", null, ["red", "awaitArticleButton"], "Visszaküldés");
    newButton.addEventListener("click", function() { changeState(article); });
    oldButton.parentNode.replaceChild(newButton, oldButton);
}

window.changeState = function(article){
    article.state = 0;
    article.updateState(function() {  });
    document.getElementById(article.id).remove();
    articles = articles.filter(a => a.id !== article.id);
}

function expandArticles(articleData){
    if(articleData.length > 0){
        loadArticles(articleData);
    }
    displayExpandBtn(articleData);   
}

function addSearchListener(){
    let input = document.getElementById("search");
    doc.addEnter(input, () => { document.getElementById("search-btn").click(); });
}

function requestArticles(columnData){
    columns = columnData;
    renderColumnSelect();
    selectArticlesByState(loadArticles, "", articlePerPage, 0, columnSelect.value, 1);
}

function renderColumnSelect(){
    let highestPerm = utils.getHighestPermission(permissions);
    let accessibleColumns = [];
    if(highestPerm >= 40){ 
        let all = { id: 0, name: "Mind" }
        accessibleColumns = columns;
        accessibleColumns.unshift(all);
    } else {
        accessibleColumns = columns.filter(col => utils.hasCmlAccesToColumn(permissions, col));
    }
    for (let column of accessibleColumns) {
        doc.renderOption(columnSelect, column.id, column.name);
    }
}

function loadArticles(articleData){
    articles = articles.concat(articleData);
    for (var art of articleData) {
        renderRow(art);
    }
    displayExpandBtn(articleData);
}

function renderRow(article){
    let container = doc.createDiv(article.id, ["awaitArticleContainer"]);
    let title = doc.createP(["awaitArticleTitle"], article.title);
    let authorName = doc.createP(["awaitArticleAuthorName"], article.authorName);
    let columnName = doc.createP(["awaitArticleColumn"], getColumnNameById(article.columnId));
    let editBtn = doc.createButton(["awaitArticleButton", "blue"], '<i class="fas fa-edit"></i>', () => { editArticle(article); });
    let date = doc.createP(["awaitArticleDate"], article.date);
    let changeStateBtn = doc.createButton(["awaitArticleButton", "red"], '<i class="fas fa-backspace"></i>', () => { switchChangeStateBtn(changeStateBtn, article); });
    let lockDiv = renderLock(article);
    doc.append(container, [authorName, title, editBtn, changeStateBtn, lockDiv, columnName, date]);
    articleTable.appendChild(container);
}

function renderLock(article){
    let lockDiv = doc.createDiv(null, ["lock"]);
    if(article.isLocked === 1){
        lockDiv.innerHTML = '<i class="fas fa-lock"></i>';
        if(article.lockedBy === permissions[0].authorId){
            lockDiv.style.backgroundColor = "whitesmoke";
        } else {
            lockDiv.style.backgroundColor = "gray";
        }
    } else {
        lockDiv.innerHTML = '<i class="fas fa-lock-open"></i>';
        lockDiv.style.backgroundColor = "green";
    }
    return lockDiv;
}

function getColumnNameById(columnId){
    var result = columns.find(c => c.id == columnId);
    return result.name;
}
function displayExpandBtn(articleData){
    if(articleData.length < articlePerPage){
        document.getElementById("expand-btn").style.display = "none";
    } else {
        document.getElementById("expand-btn").style.display = "inline";
    }
}
