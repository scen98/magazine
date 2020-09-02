export class Token{
    constructor(id, name, status, columnId){
        this.id = id;
        this.name = name;
        this.status = status;
        this.columnId = columnId;
    }
}
export function selectTokens(){
    
}

export function selectAccessibleTokens(func, args){
    let xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
        try{
            func(constrFromJSON(this.responseText), args);
        }catch(err) {
            console.log(err.message);
            console.log(this.responseText);
        }
    };    
    xhttp.open("GET", "../amp/includes/requests/selectaccessibletokens.php", true);
    xhttp.send();
}

function constrFromJSON(json){
    let data = JSON.parse(json).tokens;
    let tokenArray = [];
    for (let t of data) {
        tokenArray.push(new Token(t.id, t.name, t.status, t.columnId));
    }
    return tokenArray;
}