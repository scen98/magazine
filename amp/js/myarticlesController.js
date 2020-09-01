import { Article, selectMyArticles } from "./objects/article.js"
import { getColumns } from "./objects/column.js"
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
    let newButton = document.createElement("button");
    newButton.innerHTML = "Törlés";
    newButton.classList.add("red");
    newButton.classList.add("articleButton");
    newButton.addEventListener("click", function() { deleteArticle(article); })
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

    input.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        document.getElementById("search-btn").click();
    }
    });
}

function setSearchParameters(){
    search = search = document.getElementById("search").value;
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
    var container = document.createElement("div");
    var title = document.createElement("p");
    var lead = document.createElement("div");
    var columnName = document.createElement("p");
    var date = document.createElement("p");
    var editBtn = document.createElement("button");
    var deleteBtn = document.createElement("button");

    container.className = "articleContainer";
    container.id = article.id;
    title.innerHTML = article.title;
    title.className = "articleTitle";
    columnName.innerHTML = getColumnNameById(article.columnId);
    columnName.className = "articleColumn";
    lead.innerHTML = article.lead;
    lead.className = "articleLead";
    editBtn.innerHTML = '<i class="fas fa-edit"></i>';
    editBtn.className = "articleButton";
    editBtn.classList.add("blue");
    editBtn.addEventListener("click", function() { editArticle(article.id); });
    deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
    deleteBtn.className = "articleButton";    
    deleteBtn.classList.add("red");
    deleteBtn.addEventListener("click", function() { switchDeleteBtn(deleteBtn, article); })
    date.innerHTML = article.date;
    date.className = "articleDate";
    
    container.appendChild(title);
    container.appendChild(columnName);
    container.appendChild(lead);
    container.appendChild(deleteBtn);
    container.appendChild(editBtn);
    container.appendChild(date);
     
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
