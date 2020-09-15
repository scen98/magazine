import { Article, selectMyArticles } from "./objects/article.js"
import { getColumns } from "./objects/column.js"
import * as doc from "./doc.js"
let articleTable = document.getElementById("article-table");
let selectOrder;
let articles = [];
let columns = [];
let articlePerPage = 20;
let search = "";
let selectDesc;
init();

function init(){
    loadPage();
    setSearchParameters();
    addSearchListener();
}

window.expand = function() {
    try {
        selectMyArticles(expandArticles, search, articlePerPage, columns.length+1, selectOrder, selectDesc);
    }
    catch {
        document.getElementById("expand-btn").style.display = "none";
    }  
}

window.search = function(){
    setSearchParameters();
    articleTable.innerHTML = "";
    articles = [];
    selectMyArticles(loadArticles, search, articlePerPage, 0, selectOrder, selectDesc);
}

window.editArticle = function(id){
    window.location.href = "../amp/edit.php?aid="+id;
}

window.switchDeleteBtn = function(oldButton, article){
    let newButton = doc.create("button", null, ["red", "articleButton"], "Törlés");
    newButton.addEventListener("click", function() { deleteArticle(article); });
    oldButton.parentNode.replaceChild(newButton, oldButton);
}

window.deleteArticle = function(article){
    article.delete(function() {  });
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

function setSearchParameters(){
    search = document.getElementById("search").value;
    selectOrder = document.getElementById("order-select").value;
    selectDesc = document.getElementById("desc-select").value;
}

function loadPage(){
    getColumns(prepareArticles);
}

function prepareArticles(columnData){
    columns = columnData;
    selectMyArticles(loadArticles, "", articlePerPage, 0, "date", true);
}

function loadArticles(articleData){
    articles = articles.concat(articleData);
    for (var art of articleData) {
        renderRow(art);
    }
    displayExpandBtn(articleData);
}

function renderRow(article){
    let container = doc.createDiv(article.id, ["articleContainer"]);
    let title = doc.createP(["articleTitle"], article.title);
    let lead = doc.createDiv(null, ["articleLead"]);
    lead.innerText = article.lead;
    let columnName = doc.createP(["articleColumn"], getColumnNameById(article.columnId));
    let editBtn = doc.createButton(["articleButton", "blue"], '<i class="fas fa-edit"></i>', () => { editArticle(article.id); });
    let date = doc.createP(["articleDate"], article.date);
    let deleteBtn = doc.createButton(["articleButton", "red"], '<i class="fas fa-trash-alt"></i>', () => { switchDeleteBtn(deleteBtn, article); });
    doc.append(container, [title, columnName, lead, deleteBtn, editBtn, date]);
    articleTable.appendChild(container);
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
