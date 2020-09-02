import { Token, selectAccessibleTokens } from "./objects/token.js";
import { getColumns } from "./objects/column.js";
let tokenTable = document.getElementById("token-table");
let columnArray = [];
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
    for (const item of columnArray) {
        console.log(item.name);
    }
}

function hasAccessToColumn(column){
    for (let perm of permissions) {
        if(perm.columnId == column.id){
            return true;
        }
    }
    return false;
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
