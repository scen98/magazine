import { Author, selectAllAuthors } from "./objects/author.js";
import { getHighestPermission } from "./utils.js";
import * as doc from "./doc.js";
let authorTable = document.getElementById("author-table");
let authors = [];
let searchInput = document.getElementById("search");
let permissionSearchInput = document.getElementById("permission-select");
init();
function init(){
    selectAllAuthors(loadPage);
    doc.addEnter(searchInput, () => document.getElementById("search-btn").click());
}

function loadPage(authorData){
    authors = authorData;
    for (let a of authors) {
        renderAuthor(a);
    }
}

function renderAuthor(author){
    let container = doc.createDiv("author-container"+author.id, ["authorContainer"]);
    let name = doc.createP(["authorName"], author.userName);
    let level = doc.createP(["authorLevel"], author.getPermissionName());
    doc.append(container, [name, level]);
    authorTable.appendChild(container);
    canUserEdit(author, renderEditButton, [container, author]);
}

function canUserEdit(author, func, args){
    let highestPermission = getHighestPermission(permissions);
    if(highestPermission >= 30 && highestPermission >= author.getHighestPermission()){
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
    let editBtn = doc.createButton(["authorButton", "blue"], '<i class="fas fa-user-edit"></i>', ()=> { window.location.href = "../amp/editAuthor.php?author="+author.uniqName; });
    parent.appendChild(editBtn);
}