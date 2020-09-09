import { getColumns } from "./objects/column.js";
import { Token, selectAccessibleTokens } from "./objects/token.js";
import { selectAuthorByName, permissionName } from "./objects/author.js";
import { Permission } from "./objects/permission.js";
import * as utils from "./utils.js";
let permissionTable = document.getElementById("permission-table");
let columns = [];
let author;
let permissionType = document.getElementById("permission-type");
let addPermission = document.getElementById("add-permission");
init();

window.changePermission = () => {
    let newPermission = new Permission(0, permissionType.value, author.id);
    permissionTable.innerHTML = "";
    newPermission.change(updateAuthorPermissions);
}

window.addColumnPermission = () => {
    let newPermission = new Permission(0, document.getElementById("column-permission-level").value, author.id);
    newPermission.columnId = parseInt(document.getElementById("permission-column-select").value);
    newPermission.insert(onInsert);
}

function init(){
    selectAuthorByName(loadAuthor, getAuthorName());
}

function onInsert(newPermission){
    author.permissions.push(newPermission);
    renderPermission(newPermission);
}

function loadAuthor(authorData){
    author = authorData;
    getColumns(loadAuthorPermissions);
    document.getElementById("user-name").innerText = author.userName;
    document.getElementById("uniq-name").innerText = author.uniqName;
}

function getAuthorName(){
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get("author");
}

function loadAuthorPermissions(columnData){
    setColumns(columnData);
    if(utils.getHighestPermission(permissions) >= 50){
        renderPermissions();
    }  
}

function updateAuthorPermissions(permission){
    if(permission.level <= 10 || permission.level >=40){
        renderPermission(permission);
        author.permissions = [];
        author.permissions.push(permission);
    } else {
        author.permissions = [];   
    }
    displayPermissionAdder();
    
    
}

function renderPermissions(){
    document.getElementById("permission-settings").style.display = "block";
    for (let perm of author.permissions) {
        renderPermission(perm);
    }
    setPermissionType();
    displayPermissionAdder();
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
        select.appendChild(renderColumnOption(col));
    }
}

function renderColumnOption(column){
    let opt = document.createElement("option");
    opt.value = column.id;
    opt.innerText = column.name;
    return opt;
}

