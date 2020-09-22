import { Article, selectMyArticles } from "./objects/article.js"
import { Column, getColumns } from "./objects/column.js"
import * as doc from "./doc.js"
let articleTable = document.getElementById("article-table") as HTMLDivElement;
let expandBtn = document.getElementById("expand-btn") as HTMLButtonElement;
let searchBtn = document.getElementById("search-btn") as HTMLButtonElement;
let selectOrder;
let articles: Article[] = [];
let columns: Column[] = [];
let articlePerPage = 20;
let searchInput = "";
let selectDesc;
init();

function init(){
    loadPage();
    setSearchParameters();
    addSearchListener();
    doc.addChange(document.getElementById("search"), search);
    doc.addClick(expandBtn, expand);
    doc.addClick(searchBtn, search);
}

function loadPage(){
    getColumns(prepareArticles);
}

function expand() {
    try {
        selectMyArticles(expandArticles, searchInput, articlePerPage, columns.length+1, selectOrder, selectDesc);
    }
    catch {
        document.getElementById("expand-btn").style.display = "none";
    }  
}

function search(){
    setSearchParameters();
    articleTable.innerHTML = "";
    articles = [];
    selectMyArticles(loadArticles, searchInput, articlePerPage, 0, selectOrder, selectDesc);
}

function editArticle(id: number){
    window.location.href = "../amp/edit.php?aid="+id;
}

function switchDeleteBtn(oldButton: HTMLButtonElement, article: Article){
    let newButton:HTMLButtonElement = doc.createButton(["red", "articleButton"], "Törlés", ()=>{ deleteArticle(article) });
    oldButton.parentNode.replaceChild(newButton, oldButton);
}

function deleteArticle(article: Article){
    article.delete(function() {  });
    document.getElementById(article.id.toString()).remove();
    articles = articles.filter(a => a.id !== article.id);
}

function expandArticles(articleData: Article[]){
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
    searchInput = (document.getElementById("search") as HTMLInputElement).value;
    selectOrder = (document.getElementById("order-select") as HTMLInputElement).value;
    selectDesc = (document.getElementById("desc-select") as HTMLInputElement).value;
}

function prepareArticles(columnData: Column[]){
    columns = columnData;
    selectMyArticles(loadArticles, "", articlePerPage, 0, "date", true);
}

function loadArticles(articleData: Article[]){
    articles = articles.concat(articleData);
    for (var art of articleData) {
        renderRow(art);
    }
    displayExpandBtn(articleData);
}

function renderRow(article: Article){
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

function getColumnNameById(columnId: number){
    var result = columns.find(c => c.id == columnId);
    return result.name;
}
function displayExpandBtn(articleData: Article[]){
    if(articleData.length < articlePerPage){
        document.getElementById("expand-btn").style.display = "none";
    } else {
        document.getElementById("expand-btn").style.display = "inline";
    }
}
