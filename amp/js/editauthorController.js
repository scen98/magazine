import { getColumns } from "./objects/column.js";
import { Token, selectAccessibleTokens } from "./objects/token.js";
import { selectAuthorByName, permissionName } from "./objects/author.js";
import { Permission, deletePermission, insertTokenPermission, deleteTokenPermission } from "./objects/permission.js";
import * as utils from "./utils.js";
import * as doc from "./doc.js";
let permissionTable = document.getElementById("permission-table");
let columns = [];
let author;
let permissionType = document.getElementById("permission-type");
let addPermission = document.getElementById("add-permission");
let accessibleTokens = [];
let myTokenTable = document.getElementById("my-token-table");
let authorTokenTable = document.getElementById("author-token-table");
init();

function init(){
    getColumns(loadPage);
}

function loadPage(columnData){
    setColumns(columnData);
    selectAuthorByName(loadAuthor, getAuthorName());
}

function loadAuthor(authorData){
    author = authorData;
    renderTokenBox();
    renderAuthor();
    document.getElementById("user-name").innerText = author.userName;
    document.getElementById("uniq-name").innerText = author.uniqName;
}

function renderAuthor(){
    if(utils.getHighestPermission(permissions) >= 50){
        renderPermissions();
    }
}

function getAuthorName(){
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get("author");
}
//---PERMISSIONS
window.changePermission = () => {
    let newPermission = new Permission(0, permissionType.value, author.id);
    if(doesPermissionExist(newPermission)){
        alert("Ez a jogosultságtípus már be van állítva.");
    } else {
        permissionTable.innerHTML = "";
        newPermission.change(updateAuthorPermissions);
    }
}

window.addColumnPermission = () => {
    let newPermission = new Permission(0, document.getElementById("column-permission-level").value, author.id);
    newPermission.columnId = parseInt(document.getElementById("permission-column-select").value);
    if(doesPermissionExist(newPermission)){
        alert("Ilyen jogosultság már létezik.");
    } else {
        newPermission.insert(onInsert);
    }
}

function onInsert(newPermission){
    author.permissions.push(newPermission);
    renderPermission(newPermission);
}

function doesPermissionExist(newPermission){
    if(author.permissions.length === 0){
        false;
    }
    for (let perm of author.permissions) {
        if(arePermissionsEqual(perm, newPermission)){
            return true;
        }
    }
    return false;
}
function arePermissionsEqual(perm1, perm2){
    if(perm1.hasOwnProperty("columnId") && perm2.hasOwnProperty("columnId")){
        if(perm1.level == perm2.level && perm1.columnId == perm2.columnId) return true;
    } else {
        if(perm1.level == perm2.level) return true;
    }
    
    return false;
}

function onPermissionDelete(permission){
    document.getElementById(permission.id).remove();
    author.permissions = author.permissions.filter(p => p.id !== permission.id);

}

function updateAuthorPermissions(permission){
    author.permissions = [];
    author.tokenPermissions = [];
    if(permission.level <= 10 || permission.level >=40){
        renderPermission(permission);
        author.permissions.push(permission);
    }
    displayPermissionAdder();
    if(utils.getHighestPermission(permissions) >= 30 && permissionType.value == 20){
        document.getElementById("token-permissions").style.display = "block";
    }
    renderTokenBox();
}

function renderPermissions(){
    document.getElementById("permission-settings").style.display = "block";
    for (let perm of author.permissions) {
        renderPermission(perm);
    }
    if(author.permissions.length === 0){
        renderNoPermissionsMessage();
    } else {
        setPermissionType();
        displayPermissionAdder();
    }
}

function displayPermissionAdder(){
    if(permissionType.value == 20){
        addPermission.style.display = "block";
    } else {
        addPermission.style.display = "none";
    }
}

function setColumns(columnData){
    columns = columnData;
    renderColumnSelect(document.getElementById("permission-column-select"));
}

function setPermissionType(){
    if(author.getHighestPermission() <= 10 && author.permissions.length > 0){
        permissionType.value = "10";
    } else if(author.getHighestPermission() >= 40){
        permissionType.value = "40";
    } else {
        permissionType.value = "20";
    }
}

function renderPermission(permission){
    let perm = document.createElement("div");
    let permName = document.createElement("p");
    let columnName = document.createElement("p");
    let deleteBtn = document.createElement("button");
    perm.className = "permissionContainer";
    perm.id = permission.id;
    permName.innerText = permissionName(permission);
    permName.className = "permissionName";
    if(author.getHighestPermission() <= 10 || author.getHighestPermission() >= 40){
        columnName.innerText = "Mind";
    } else {
        columnName.innerText = columns.find(c=> c.id === permission.columnId).name;
    }  
    columnName.className = "permissionColumn";
    deleteBtn.className = "permissionButton";
    deleteBtn.classList.add("red");
    deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
    deleteBtn.addEventListener("click", function() { switchDeleteBtn(deleteBtn, permission); })
    perm.appendChild(permName);
    perm.appendChild(columnName);
    perm.appendChild(deleteBtn);
    permissionTable.appendChild(perm);
}

function renderNoPermissionsMessage(){
    let p = document.createElement("p");
    p.innerText = "A felhasználó nem rendelkezik jogosultságokkal, így nem tudja használni az oldalt.";
    p.style.fontStyle = "itelic";
    permissionTable.appendChild(p);
}

function renderColumnSelect(select){
    for (let col of columns) {
        doc.renderOption(select, col.id, col.name);
    }
}

function switchDeleteBtn(oldButton, permission){
    let newButton = document.createElement("button");
        newButton.innerHTML = "Törlés";
        newButton.classList.add("red");
        newButton.classList.add("permissionButton");
        newButton.addEventListener("click", function() { deletePermission(onPermissionDelete, permission, permission); })
        oldButton.parentNode.replaceChild(newButton, oldButton);
}
//PERMISSIONS---
//---TOKENS

function renderTokenBox(){
    authorTokenTable.innerHTML = "";
    if(utils.getHighestPermission(permissions) >= 30 && (permissionType.value == 20 || author.getHighestPermission() >= 20) && author.getHighestPermission() < 40){
        selectAccessibleTokens(renderMyTokens);
        renderAuthorTokenPermissions();
        document.getElementById("token-permissions").style.display = "block";
    } else {
        document.getElementById("token-permissions").style.display = "none";
    }
}

function onTokenPermissionInsert(newPermission){
    author.tokenPermissions.push(newPermission);
    renderAuthorTokenPermission(newPermission);
}

function renderAuthorTokenPermissions(){
    for (let perm of author.tokenPermissions) {
        renderAuthorTokenPermission(perm);
    }
}

function renderAuthorTokenPermission(tokenPermission){
    let container = document.createElement("div");
    let tokenName = document.createElement("p");
    let tokenColumn = document.createElement("p");
    container.className = "tokenContainer";
    container.id = "author-token-" + tokenPermission.id;
    tokenName.className = "tokenName";
    tokenName.innerText = tokenPermission.tokenName;
    tokenColumn.className = "permissionColumn";
    if(tokenPermission.columnId == null || tokenPermission.columnId === 0){
        tokenColumn.innerText = "Mind";
    } else {
        tokenColumn.innerText  = columns.find(c => c.id === tokenPermission.columnId).name;
    }
    container.appendChild(tokenName);
    container.appendChild(tokenColumn);
    if(hasAccessToToken(tokenPermission)){
        createTokenDeleteBtn(container, tokenPermission);
    }
    authorTokenTable.appendChild(container);
}

function createTokenDeleteBtn(container, tokenPermission){
    let deleteBtn = document.createElement("button");
    deleteBtn.className = "tokenButton";
    deleteBtn.classList.add("red");
    deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
    deleteBtn.addEventListener("click", function() { switchTokenDeleteBtn(tokenPermission, deleteBtn); })
    container.appendChild(deleteBtn);
}

function switchTokenDeleteBtn(tokenPermission, oldButton){
    let newButton = document.createElement("button");
    newButton.innerHTML = "Törlés";
    newButton.classList.add("red");
    newButton.classList.add("tokenButton");
    newButton.addEventListener("click", function() { deleteTokenPermission(onTokenPermissionDelete, tokenPermission, tokenPermission); })
    oldButton.parentNode.replaceChild(newButton, oldButton);
}

function doesTokenPermissionExist(newTokenPermission){
    if(author.tokenPermissions.length === 0){
        return false;
    }
    for (let tp of author.tokenPermissions) {
        if(newTokenPermission.tokenId === tp.tokenId) return true;
    }
    return false;
}

function onTokenPermissionDelete(tokenPermission){
    author.tokenPermissions.filter(t=> t.id !== tokenPermission.id);
    document.getElementById("author-token-"+tokenPermission.id).remove();
}

function hasAccessToToken(token){
    if(utils.getHighestPermission(permissions) >= 40){
        return true;
    }
    for (let perm of permissions) {
        if(perm.columnId === token.columnId) return true;
    }
    return false;
}

function renderMyTokens(tokenData){
    accessibleTokens = tokenData;
    myTokenTable.innerHTML = "";
    for (let token of accessibleTokens) {
        renderAccessibleToken(token);
    }
}

function renderAccessibleToken(token){
    let container = document.createElement("div");
    let name = document.createElement("p");
    let columnName = document.createElement("p");
    let addBtn = document.createElement("button");
    let newTokenPermission = {
        authorId: author.id,
        columnId: token.columnId,
        tokenId: token.id,
        tokenName: token.name
    }
    container.className = "tokenContainer";
    name.className = "tokenName";
    name.innerText = token.name;
    columnName.className = "tokenName";
    addBtn.className = "tokenButton";
    addBtn.classList.add("green");
    addBtn.innerHTML = '<i class="fas fa-user-plus"></i>';
    addBtn.addEventListener("click", function() { 
        if(doesTokenPermissionExist(newTokenPermission)){
            alert("A felhasználó már rendelkezik ezzel a jogosultsággal.");
        } else {
            insertTokenPermission(onTokenPermissionInsert, newTokenPermission); 
        }  
    });
    if(token.columnId === 0){
        columnName.innerText = "Mind";
    } else {
        columnName.innerText = columns.find(c=> c.id === token.columnId).name;
    }
    container.appendChild(name);
    container.appendChild(columnName);
    container.appendChild(addBtn);
    myTokenTable.appendChild(container);
}
//TOKENS---
