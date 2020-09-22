import { Author, selectAllAuthors, getMyInfo } from "./objects/author.js";
import * as doc from "./doc.js";
//var utils_1 = require("./utils");
let authorTable: HTMLDivElement = doc.getDiv("author-table");
let authors: Author[] = [];
let searchInput: HTMLInputElement = doc.getInput("search");
let permissionSearchInput: HTMLSelectElement = doc.getSelect("permission-select");
let myInfo:Author;
init();
function init() {
    getMyInfo(setMyInfo);
    doc.addClick(doc.getBtn("search-btn"), search);
    doc.addEnter(searchInput, search);
}

function setMyInfo(authorData:Author){
    myInfo = authorData;
    selectAllAuthors(loadPage);
}

function loadPage(authorData: Author[]) {
    authors = authorData;
    for (let author of authors) {
        renderAuthor(author);
    }
}
function renderAuthor(author: Author) {
    let container = doc.createDiv("author-container" + author.id, ["authorContainer"]);
    let name = doc.createP(["authorName"], author.userName);
    let level = doc.createP(["authorLevel"], author.getPermissionName());
    doc.append(container, [name, level]);
    authorTable.appendChild(container);
    canUserEdit(author, renderEditButton, [container, author]);
}
function canUserEdit(author: Author, func:any, args:any) {
    var highestPermission = myInfo.getHighestPermission();
    if (highestPermission >= 30 && highestPermission >= author.getHighestPermission()) {
        func.apply(this, args);
    }
}
function search(){
    let keyword = searchInput.value.toLowerCase();
    let searchedLevel = permissionSearchInput.value;
    let result = [];
    result = authors.filter(function (a) { return a.userName.toLowerCase().includes(keyword); });
    if (searchedLevel !== "null") {
        result = result.filter(function (a) { return a.getHighestPermission() === parseInt(searchedLevel); });
    }
    authorTable.innerHTML = "";
    for (let author of result) {
        renderAuthor(author);
    }
}

function renderEditButton(parent: HTMLElement, author: Author) {
    let editBtn = doc.createButton(["authorButton", "blue"], '<i class="fas fa-user-edit"></i>', function () { window.location.href = "../amp/editAuthor.php?author=" + author.uniqName; });
    parent.appendChild(editBtn);
}
//# sourceMappingURL=authorsController.js.map