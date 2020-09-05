import { Author, selectAllAuthors } from "./objects/author.js"
let authorTable = document.getElementById("author-table");
let authors = [];
init();
function init(){
    selectAllAuthors(loadPage);
}

function loadPage(authorData){
    authors = authorData;
    for (let a of authors) {
        renderAuthor(a);
    }
}

function renderAuthor(author){
    let container = document.createElement("div");
    let name = document.createElement("p");
    let level = document.createElement("p");
    container.id = "author-container"+author.id;
    container.className = "authorContainer";
    name.innerHTML = author.userName;
    name.className = "authorName";
    level.innerHTML = author.getLevelName();
    level.className = "authorLevel";
    container.appendChild(name);
    container.appendChild(level);
    authorTable.appendChild(container);
    canUserEdit();
}

function canUserEdit(author, func, args){
    if(permissions[0] >= 30 && permissions[0] > author.level){
       func();
    }
}