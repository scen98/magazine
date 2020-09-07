import { Author, selectAllAuthors } from "./objects/author.js";
let authorTable = document.getElementById("author-table");
let authors = [];
let searchInput = document.getElementById("search");
let permissionSearchInput = document.getElementById("permission-select");
init();
function init(){
    selectAllAuthors(loadPage);
    searchInput.addEventListener("keyup", function(event) {
        if (event.keyCode === 13) {
            document.getElementById("search-btn").click();
        }
        });
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
    level.innerHTML = author.getPermissionName();
    level.className = "authorLevel";
    container.appendChild(name);
    container.appendChild(level);
    authorTable.appendChild(container);
    canUserEdit(author, renderEditButton, [container, author]);
}

function canUserEdit(author, func, args){
    if(permissions[0].level >= 30 && permissions[0].level > author.getHighestPermission()){
       func.apply(this,args);
    }
}

window.search = function(){
    let keyword = searchInput.value.toLowerCase();
    let searchedLevel = permissionSearchInput.value;
    let result = [];
    result = authors.filter(a=> a.userName.toLowerCase().includes(keyword));
    if(searchedLevel !== "null"){
        result = result.filter(a=> a.getHighestPermission() === parseInt(searchedLevel));
    }

    authorTable.innerHTML = "";
    for (let author of result) {
        renderAuthor(author);
    }
}

function renderEditButton(parent, author){
    let editBtn = document.createElement("button");
    editBtn.className = "authorButton";
    editBtn.classList.add("blue");
    editBtn.innerHTML = '<i class="fas fa-user-edit"></i>';
    editBtn.addEventListener("click", function() {
        window.location.href = "../amp/editAuthor.php?aid="+author.id;
    })
    parent.appendChild(editBtn);
}