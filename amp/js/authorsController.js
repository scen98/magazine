import { selectAllAuthors, getMyInfo } from "./objects/author.js";
import * as doc from "./doc.js";
//var utils_1 = require("./utils");
let authorTable = doc.getDiv("author-table");
let authors = [];
let searchInput = doc.getInput("search");
let permissionSearchInput = doc.getSelect("permission-select");
let myInfo;
init();
function init() {
    getMyInfo(setMyInfo);
    doc.addClick(doc.getBtn("search-btn"), search);
    doc.addEnter(searchInput, search);
}
function setMyInfo(authorData) {
    myInfo = authorData;
    selectAllAuthors(loadPage);
}
function loadPage(authorData) {
    authors = authorData;
    for (let author of authors) {
        renderAuthor(author);
    }
}
function renderAuthor(author) {
    let container = doc.createDiv("author-container" + author.id, ["authorContainer"]);
    let name = doc.createA(["authorName"], author.userName, `../amp/szerzo.php?szerzo=${author.id}`);
    let level = doc.createP(["authorLevel"], author.getPermissionName());
    doc.append(container, [name, level]);
    authorTable.appendChild(container);
    canUserEdit(author, renderEditButton, [container, author]);
}
function canUserEdit(author, func, args) {
    let myHighestPermission = myInfo.getHighestPermission();
    let authorHighestPermission = author.getHighestPermission();
    if (myHighestPermission >= 50 && myHighestPermission > authorHighestPermission) {
        func.apply(this, args);
    }
    else if (myHighestPermission >= 30 && myHighestPermission >= authorHighestPermission && authorHighestPermission >= 20) {
        func.apply(this, args);
    }
}
function search() {
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
function renderEditButton(parent, author) {
    let editBtn = doc.createButton(["authorButton", "blue"], '<i class="fas fa-user-edit"></i>', function () { window.location.href = `../amp/szerzo_szerk.php?author=${author.uniqName}`; });
    parent.appendChild(editBtn);
}
//# sourceMappingURL=authorsController.js.map
//# sourceMappingURL=authorsController.js.map