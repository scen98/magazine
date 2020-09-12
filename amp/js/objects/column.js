export class Column{
    constructor(id, name){
        this.id = parseInt(id);
        this.name = name;
    }   
}

export function getColumns(func){
    let xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
        try{
            func(constrFromJSON(this.responseText));
        }catch(err) {
            console.log(err);
            console.log(this.responseText);
        }
    };    
    xhttp.open("GET", "../amp/includes/requests/getcolumns.php", true);
    xhttp.send();    
}

export function selectAcccessibleColumns(func){
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

