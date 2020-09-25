import { Column, getColumns } from "./objects/column.js";
import { Token, selectAccessibleTokens } from "./objects/token.js";
import { selectAuthorByName, permissionName, Author, getMyInfo } from "./objects/author.js";
import { Permission, deletePermission, insertTokenPermission, deleteTokenPermission, TokenPermission } from "./objects/permission.js";
import * as utils from "./utils.js";
import * as doc from "./doc.js";
let permissionTable: HTMLDivElement = doc.getDiv("permission-table"); 
let columns: Column[] = [];
let author: Author;
let permissionType: HTMLSelectElement = doc.getSelect("permission-type");
let addPermission: HTMLDivElement = doc.getDiv("add-permission");
let accessibleTokens: Token[] = [];
let myTokenTable: HTMLDivElement = doc.getDiv("my-token-table");
let authorTokenTable: HTMLDivElement = doc.getDiv("author-token-table");
let myInfo: Author;
init();

function init(){
    getColumns(loadPage);
    doc.addClick("change-permission-btn", changePermission);
    doc.addClick("add-column-permission-btn", addColumnPermission);
}

function loadPage(columnData: Column[]){
    setColumns(columnData);
    selectAuthorByName(loadAuthor, getAuthorName());
}

function loadAuthor(authorData: Author){
    author = authorData;
    getMyInfo(renderAuthor);
    doc.get("user-name").innerText = author.userName;
    doc.get("uniq-name").innerText = author.uniqName;
}

function renderAuthor(authorData: Author){
    myInfo = authorData;
    renderTokenBox();
    if(utils.getHighestPermission(myInfo.permissions) >= 50){
        renderPermissions();
    }
}

function getAuthorName(){
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get("author");
}
//---PERMISSIONS
function changePermission() {
    let newPermission = new Permission(0, parseInt(permissionType.value), author.id);
    if(doesPermissionExist(newPermission)){
        alert("Ez a jogosultságtípus már be van állítva.");
    } else {
        permissionTable.innerHTML = "";
        newPermission.change(() => { updateAuthorPermissions(newPermission); });
    }
}

function addColumnPermission() {
    let newPermission = new Permission(0, parseInt(doc.getValue("column-permission-level")), author.id);
    newPermission.columnId = parseInt(doc.getValue("permission-column-select"));
    if(doesPermissionExist(newPermission)){
        alert("Ilyen jogosultság már létezik.");
    } else {
        newPermission.insert(()=> { onInsert(newPermission); });
    }
    renderTokenBox();
}

function onInsert(newPermission: Permission){
    author.permissions.push(newPermission);
    renderPermission(newPermission);
    renderTokenBox();
}

function doesPermissionExist(newPermission: Permission){
    if(author.permissions == null || author.permissions.length === 0){
        return false;
    }
    for (let perm of author.permissions) {
        if(arePermissionsEqual(perm, newPermission)) return true;
    }
    return false;
}
function arePermissionsEqual(perm1: Permission, perm2: Permission){
    if(perm1.hasOwnProperty("columnId") && perm2.hasOwnProperty("columnId")){
        if(perm1.level == perm2.level && perm1.columnId == perm2.columnId) return true;
    } else {
        if(perm1.level == perm2.level) return true;
    }
    return false;
}

function onPermissionDelete(permission: Permission){
    doc.remove(permission.id.toString());
    author.permissions = author.permissions.filter(p => p.id !== permission.id);
    let tokensToDelete = accessibleTokens.filter(t=> t.columnId === permission.columnId);
    for (let token of tokensToDelete) {
        author.tokenPermissions = author.tokenPermissions.filter(t=> t.tokenId !== token.id);
    }
}

function updateAuthorPermissions(permission: Permission){
    author.permissions = [] as Permission[];
    author.tokenPermissions = [] as TokenPermission[]
    if(permission.level <= 10 || permission.level >=40){
        renderPermission(permission);
        author.permissions.push(permission);
    }
    displayPermissionAdder();
    if(utils.getHighestPermission(myInfo.permissions) >= 30 && parseInt(permissionType.value) === 20){ //////////////////////////////////////////////////////MAYBE PROBLEM????
        document.getElementById("token-permissions").style.display = "block";
    }
    renderTokenBox();
}

function renderPermissions(){
    doc.get("permission-settings").style.display = "block";
    if(author.permissions == null || author.permissions.length === 0){
        renderNoPermissionsMessage();
    } else {
        for (let perm of author.permissions) {
            renderPermission(perm);
        }
        setPermissionType();
        displayPermissionAdder();
    }
}

function renderPermission(permission: Permission){
    let perm = doc.createDiv(permission.id.toString(), ["permissionContainer"],);
    let columnName = doc.createP(["permissionColumn"], "");
    let permName = doc.createP(["permissionName"], permissionName(permission));
    let deleteBtn = doc.createButton(["permissionButton", "red"], '<i class="fas fa-trash-alt"></i>', ()=> { switchDeleteBtn(deleteBtn, permission); });
    if(author.getHighestPermission() <= 10 || author.getHighestPermission() >= 40){
        columnName.innerText = "Mind";
    } else {
        columnName.innerText = columns.find(c=> c.id === permission.columnId).name;
    }
    doc.append(perm, [permName, columnName, deleteBtn]);
    permissionTable.appendChild(perm);
}

function displayPermissionAdder(){
    if(parseInt(permissionType.value) === 20){
        addPermission.style.display = "block";
    } else {
        addPermission.style.display = "none";
    }
}

function setColumns(columnData: Column[]){
    columns = columnData;
    renderColumnSelect(doc.getSelect("permission-column-select"));
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

function renderNoPermissionsMessage(){
    let p = document.createElement("p");
    p.innerText = "A felhasználó nem rendelkezik jogosultságokkal, így nem tudja használni az oldalt.";
    p.style.fontStyle = "italic";
    permissionTable.appendChild(p);
}

function renderColumnSelect(select: HTMLSelectElement){
    for (let col of columns) {
        doc.renderOption(select, col.id.toString(), col.name);
    }
}

function switchDeleteBtn(oldButton: HTMLButtonElement, permission: Permission){
    let newButton = doc.createButton(["permissionButton", "red"], "Törlés");
    doc.addClick(newButton, ()=> { deletePermission(()=> { onPermissionDelete(permission); renderTokenBox(); }, permission); })
    oldButton.parentNode.replaceChild(newButton, oldButton);
}
//PERMISSIONS---
//---TOKENS

function renderTokenBox(){
    if(author.permissions != null && !author.permissions.some(p=> p.level === 20)){
        doc.get("token-permissions").style.display = "none";
        return false;
    }
    doc.get("token-permissions").style.display = "block";
    authorTokenTable.innerHTML = "";
    if(utils.getHighestPermission(myInfo.permissions) >= 30 && (parseInt(permissionType.value) === 20 || author.getHighestPermission() >= 20) && author.getHighestPermission() < 40){
        selectAccessibleTokens(renderMyTokens);
        if(author.tokenPermissions != null) renderAuthorTokenPermissions();
        document.getElementById("token-permissions").style.display = "block";
    } else {
        document.getElementById("token-permissions").style.display = "none";
    }
}

function onTokenPermissionInsert(newPermission: TokenPermission){
    author.tokenPermissions.push(newPermission);
    renderAuthorTokenPermission(newPermission);
}

function renderAuthorTokenPermissions(){
    authorTokenTable.innerHTML = "";
    for (let perm of author.tokenPermissions) {
        renderAuthorTokenPermission(perm);
    }
}

function renderAuthorTokenPermission(tokenPermission: TokenPermission){
    let container = doc.createDiv("author-token-" + tokenPermission.id, ["tokenContainer"], );
    let tokenName = doc.createP(["tokenName"], tokenPermission.tokenName);
    let tokenColumn = document.createElement("p");
    tokenColumn.className = "permissionColumn";

    if(tokenPermission.columnId == null || tokenPermission.columnId === 0){
        tokenColumn.innerText = "Mind";
    } else {
        tokenColumn.innerText  = columns.find(c => c.id === tokenPermission.columnId).name;
    }
    doc.append(container, [tokenName, tokenColumn]);
    if(hasAccessToToken(tokenPermission)){
        createTokenDeleteBtn(container, tokenPermission);
    }
    authorTokenTable.appendChild(container);
}

function createTokenDeleteBtn(container: HTMLDivElement, tokenPermission: TokenPermission){
    let deleteBtn = doc.createButton(["tokenButton", "red"], '<i class="fas fa-trash-alt"></i>', ()=>{ switchTokenDeleteBtn(tokenPermission, deleteBtn); });
    container.appendChild(deleteBtn);
}

function switchTokenDeleteBtn(tokenPermission: TokenPermission, oldButton: HTMLButtonElement){
    let newButton = doc.createButton(["tokenButton", "red"], "Törlés", ()=> { deleteTokenPermission(()=> { onTokenPermissionDelete(tokenPermission); }, tokenPermission); });
    oldButton.parentNode.replaceChild(newButton, oldButton);
}

function doesTokenPermissionExist(newTokenPermission: TokenPermission){
    if(author.tokenPermissions == null || author.tokenPermissions.length === 0){
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

function hasAccessToToken(token: TokenPermission){
    if(utils.getHighestPermission(myInfo.permissions) >= 40){
        return true;
    }
    for (let perm of myInfo.permissions) {
        if(perm.columnId === token.columnId) return true;
    }
    return false;
}

function renderMyTokens(tokenData: Token[]){
    accessibleTokens = tokenData;
    myTokenTable.innerHTML = "";
    for (let token of accessibleTokens.filter(t=> isTokenRelevant(t))) {
        renderAccessibleToken(token);
    }
}

function isTokenRelevant(token: Token){
    let permission = author.permissions.find(t=> t.columnId === token.columnId);
    return permission != null && permission.level < 30;
}

function renderAccessibleToken(token: Token){
    let container = doc.createDiv(null, ["tokenContainer"]);
    let name = doc.createP(["tokenName"], token.name);
    let columnName = doc.createP(["permissionColumn"], ""); //permission igen
    let addBtn = doc.createButton(["green", "tokenButton"], '<i class="fas fa-user-plus"></i>', ()=> {
        if(doesTokenPermissionExist(newTokenPermission)){
            alert("A felhasználó már rendelkezik ezzel a jogosultsággal.");
        } else {
            insertTokenPermission(()=> { onTokenPermissionInsert(newTokenPermission); }, newTokenPermission); 
        }  
    });
    let newTokenPermission: TokenPermission = {
        id: null,
        authorId: author.id,
        columnId: token.columnId,
        tokenId: token.id,
        tokenName: token.name
    }
    if(token.columnId === 0){
        columnName.innerText = "Mind";
    } else {
        columnName.innerText = columns.find(c=> c.id === token.columnId).name;
    }
    doc.append(container, [name, columnName, addBtn]);
    myTokenTable.appendChild(container);
}
//TOKENS---
