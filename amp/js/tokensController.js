import * as Token from "./objects/token.js";
import { getColumns } from "./objects/column.js";
import * as utils from "./utils.js";
import * as doc from "./doc.js";
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
    Token.insertToken(newToken, () => addToken(newToken));
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
    Token.selectAccessibleTokens(loadTokens);
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
        Token.update(token, () => { onUpdate(token); });
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
    Token.remove(token, () => { onTokenDelete(token); } );
    tokenArray = tokenArray.filter(f => f.id !== token.id);
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
    let select = doc.createSelect("status-select" + token.id, ["tokenSelect"]);
    doc.renderOption(select, 1, "Aktív");
    doc.renderOption(select, 0, "Inaktív");
    doc.renderOption(select, 2, "Kötelező");
    select.value = token.status;
    return select;
}

function renderColumnSelect(select){
    for (let col of columnArray) {
        doc.renderOption(select, col.id, col.name);
    }
}