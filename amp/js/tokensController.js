import { Token, selectAccessibleTokens } from "./objects/token.js";
import { getColumns } from "./objects/column.js";
let tokenTable = document.getElementById("token-table");
let columnArray = [];
let tokenArray = [];
let columnSelect = document.getElementById("column-select");
init();
function init(){
    getColumns(preparePage);
}

function preparePage(columns){
    if(permissions[0].level === "superadmin" || permissions[0].level === "admin"){
        let all = { id: 0, name: "Mind" }
        columnArray = columns;
        columnArray.unshift(all);
    } else {
        columnArray = columns.filter(col => hasAccessToColumn(col));
    }
    renderColumnSelect(columnSelect);
    selectAccessibleTokens(loadTokens);
}

function loadTokens(tokens){
    tokenArray = tokens;
    for (let token of tokenArray) {
        renderToken(token);
    }
}

function renderToken(token){
    let container = document.createElement("div");
    let name = document.createElement("p");
    container.className = "tokenContainer";
    container.id = token.id;
    name.className = "tokenName";
    name.innerHTML = token.name; 
    container.appendChild(name);
    container.appendChild(renderTokenSelect(token));
    container.append(renderTokenColumnSelect(token));
    tokenTable.appendChild(container);
}

function hasAccessToColumn(column){
    for (let perm of permissions) {
        if(perm.columnId == column.id){
            return true;
        }
    }
    return false;
}

function renderTokenColumnSelect(token){
    let tokenColumnSelect = document.createElement("select");
    tokenColumnSelect.id = "column-select" + token.id;
    tokenColumnSelect.className = "tokenSelect";
    renderColumnSelect(tokenColumnSelect);
    tokenColumnSelect.value = token.columnId;
    return tokenColumnSelect;
}

function renderTokenSelect(token){
    let select = document.createElement("select");
    select.id = "status-select" + token.id;
    let active = document.createElement("option");
    let inactive = document.createElement("option");
    let mandatory = document.createElement("option");
    active.value = 1;
    active.innerHTML = "Aktív";
    inactive.value = 0;
    inactive.innerHTML = "Inaktív";
    mandatory.value = 2;
    mandatory.innerHTML = "Kötelező";
    select.appendChild(active);
    select.appendChild(inactive);
    select.appendChild(mandatory);
    select.value = token.status;
    select.classList.add("tokenSelect");
    return select;
}

function renderColumnSelect(select){
    for (let col of columnArray) {
        renderOption(select, col);
    }
}

function renderOption(select, column){
    let opt = document.createElement("option");
    opt.value = column.id;
    opt.innerHTML = column.name;
    select.appendChild(opt);
}
