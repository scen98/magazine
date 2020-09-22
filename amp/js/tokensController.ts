import { Token, selectAccessibleTokens } from "./objects/token.js";
import { getColumns, Column } from "./objects/column.js";
import * as utils from "./utils.js";
import * as doc from "./doc.js";
import { Author, getMyInfo } from "./objects/author.js";
let tokenTable: HTMLDivElement = doc.getTable("token-table");
let columnArray: Column[] = [];
let tokenArray: Token[] = [];
let columnSelect: HTMLSelectElement = doc.getSelect("column-select");
let newName: HTMLInputElement = doc.getInput("new-token-name");
let newStatus: HTMLSelectElement = doc.getSelect("active-select");
let newColumn:HTMLSelectElement = doc.getSelect("column-select");
let myInfo: Author;
init();
function init(){
    getMyInfo((me: Author)=>{
        myInfo = me;
        getColumns(preparePage);
    });
    doc.addClick("insert-token", insertToken);
}

function insertToken(){
    let newToken = new Token(0, newName.value, parseInt(newStatus.value), parseInt(newColumn.value));
    newToken.insert(() => addToken(newToken));
}

function addToken(token: Token){
    if(token.id !== 0){
        tokenArray.push(token);
        renderToken(token);
    }
}

function preparePage(columns: Column[]){
    let highestPerm = myInfo.getHighestPermission();
    if(highestPerm >= 40){ 
        let all = { id: 0, name: "Mind" }
        columnArray = columns;
        columnArray.unshift(all);
    } else {
        columnArray = columns.filter(col => utils.hasCmlAccesToColumn(myInfo.permissions, col));
    }
    renderColumnSelect(columnSelect);
    selectAccessibleTokens(loadTokens);
}

function loadTokens(tokens: Token[]){
    tokenArray = tokens;
    for (let token of tokenArray) {
        renderToken(token);
    }
}

function renderToken(token: Token){
    let container = doc.createDiv(token.id.toString(), ["tokenContainer"]);
    let name = doc.createP(["tokenName"], token.name);
    let saveBtn = doc.createButton(["tokenButton", "blue"], '<i class="fas fa-save"></i>', ()=>{
        token.status = parseInt(statusSelect.value);
        token.columnId = parseInt(columnSelect.value);
        token.update(() => { onUpdate(); });
    });
    let deleteBtn = doc.createButton(["tokenButton", "red"], '<i class="fas fa-trash-alt"></i>', ()=>{
        switchDeleteBtn(deleteBtn, token);
    });
    let statusSelect = renderTokenSelect(token);
    let columnSelect = renderTokenColumnSelect(token);
    doc.append(container, [name, statusSelect, columnSelect, deleteBtn, saveBtn]);
    tokenTable.appendChild(container);
}

function switchDeleteBtn(oldButton: HTMLButtonElement, token: Token){
    let newButton = doc.createButton(["tokenButton", "red"], "Törlés", ()=> {
        deleteToken(token);
    });
    oldButton.parentNode.replaceChild(newButton, oldButton);
}

function deleteToken(token: Token){
    token.delete(() => { onTokenDelete(token); } );
    tokenArray = tokenArray.filter(f => f.id !== token.id);
}

function onTokenDelete(token: Token){
    doc.remove(token.id.toString());
}

function onUpdate(){

}

function renderTokenColumnSelect(token){
    let tokenColumnSelect = doc.createSelect("column-select" + token.id, ["tokenSelect"]);
    renderColumnSelect(tokenColumnSelect);
    tokenColumnSelect.value = token.columnId;
    return tokenColumnSelect;
}

function renderTokenSelect(token){
    let select = doc.createSelect("status-select" + token.id, ["tokenSelect"]);
    doc.renderOption(select, "1", "Aktív");
    doc.renderOption(select, "0", "Inaktív");
   // doc.renderOption(select, "2", "Kötelező");
    select.value = token.status;
    return select;
}

function renderColumnSelect(select){
    for (let col of columnArray) {
        doc.renderOption(select, col.id.toString(), col.name);
    }
}