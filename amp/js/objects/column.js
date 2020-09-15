import * as caller from "./caller.js";
export class Column{
    constructor(id, name){
        this.id = parseInt(id);
        this.name = name;
    }   
}

export function getColumns(func){
    let f = (response)=>{
        func(constrFromJSON(response));
    }
    caller.GET("../amp/includes/requests/getcolumns.php", f);  
}

export function selectAcccessibleColumns(func){ //azt se tudom hogy ez a cucc kell-e még de nem merem kitörölni mert egyszer talán hátha igen
    let xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
        try{
            func(constrFromJSON(this.responseText));
        }catch(err) {
            console.log(err.message);
        }
    };    
    xhttp.open("GET", "../amp/includes/requests/selectaccessiblecolumns.php", true);
    xhttp.send();    
}

function constrFromJSON(json){
    let data = JSON.parse(json).columns;
    let columnArray = [];
    for (let col of data) {
        columnArray.push(new Column(col.id, col.name));
    }
    return columnArray;
}

