import { Token, selectAccessibleTokens } from "./objects/token.js";
import { getColumns } from "./objects/column.js";
import * as utils from "./utils.js";
let tokenTable = document.getElementById("token-table");
let columnArray = [];
let tokenArray = [];
let columnSelect = document.getElementById("column-select");
let newName = document.getElementById("new-token-name");
let newStatus = document.getElementById("active-select");
let newColumn = document.getElementById("column-select");
init();
function init(){
    getColumns(preparePage);
}

window.insertToken = function(){
    let newToken = new Token(0, newName.value, newStatus.value, newColumn.value);
    newToken.insert(addToken);
}

function addToken(token){
    if(token.id !== 0){
        tokenArray.push(token);
        renderToken(token);
    }
}

function preparePage(columns){
    let highestPerm = utils.getHighestPermission(permissions);
    if(highestPerm >= 40){ 
        let all = { id: 0, name: "Mind" }
        columnArray = columns;
        columnArray.unshift(all);
    } else {
        columnArray = columns.filter(col => utils.hasCmlAccesToColumn(permissions, col));
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
    let saveBtn = document.createElement("button");
    let deleteBtn = document.createElement("button");
    let statusSelect = renderTokenSelect(token);
    let columnSelect = renderTokenColumnSelect(token);
    container.className = "tokenContainer";
    container.id = token.id;
    name.className = "tokenName";
    name.innerHTML = token.name;
    saveBtn.innerHTML = '<i class="fas fa-save"></i>';
    saveBtn.className = "tokenButton";
    saveBtn.classList.add("blue");
    saveBtn.addEventListener( "click", function() {
        token.status = statusSelect.value;
        token.columnId = columnSelect.value;
        token.update(onUpdate);
    }
    );
    deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
    deleteBtn.className = "tokenButton";    
    deleteBtn.classList.add("red");
    deleteBtn.addEventListener("click", function() { 
        switchDeleteBtn(deleteBtn, token);
    })
    container.appendChild(name);
    container.appendChild(statusSelect);
    container.appendChild(columnSelect);
    container.appendChild(deleteBtn);
    container.appendChild(saveBtn);
    tokenTable.appendChild(container);
}

function switchDeleteBtn(oldButton, token){
    let newButton = document.createElement("button");
        newButton.innerHTML = "Törlés";
        newButton.classList.add("red");
        newButton.classList.add("tokenButton");
        newButton.addEventListener("click", function() { deleteToken(token); })
        oldButton.parentNode.replaceChild(newButton, oldButton);
}

function deleteToken(token){
    token.delete(onTokenDelete, token);
}

function onTokenDelete(token){
    document.getElementById(token.id).remove();
}

function onUpdate(){

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
