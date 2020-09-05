import { getColumns } from "./objects/column.js"
let columnCount = 0;
let details = document.getElementById("permission-details");
let permSelection = document.getElementById("permission-type");
let addBtn = document.getElementById("add-btn");
let removeBtn = document.getElementById("remove-btn");
let columnData = [];
init();

function init(){    
    getColumns(setColumnData);
}

window.toggleShow = function(){
    var selectedValue = permSelection.options[permSelection.selectedIndex].value;
    if(selectedValue === "cml" || selectedValue === "cma"){
        addColumn();            
        addBtn.style.display = "inline";
    } else {
        details.innerHTML = "";
        addBtn.style.display = "none";
        removeBtn.style.display = "none"; 
    }
}

window.addColumn = function(){
    columnCount++;
    let select = document.createElement("select");
    let br1 = document.createElement("br");
    let br2 = document.createElement("br");
    select.className = "columnselect";
    select.name = "perm" + columnCount;
    details.appendChild(select);
    details.appendChild(br1);
    details.appendChild(br2);
    renderOptions(select);  
    if(columnCount > 1){
        removeBtn.style.display = "inline";
    }   
}
    
window.removeColumn = function(){
    details.removeChild(details.lastElementChild); //<br>
    details.removeChild(details.lastElementChild); //<br>
    details.removeChild(details.lastElementChild); //<select>
    columnCount--;
    if(columnCount < 2){
        removeBtn.style.display = "none";
    }
}  

function setColumnData(columns){
    columnData = columns;
}

function renderOptions(select){
    for (let col of columnData) {
        let opt = document.createElement("option");
        opt.value = col.id;
        opt.innerHTML = col.name;
        select.appendChild(opt);
    }
}