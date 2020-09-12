
export class Token{
    constructor(id, name, status, columnId){
        this.id = id;
        this.name = name;
        this.status = status;
        this.columnId = columnId;
    }

    insert(func){
        let xhttp = new XMLHttpRequest();
        xhttp.open("POST", "../amp/includes/requests/inserttoken.php"); 
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.send(JSON.stringify(this));
        xhttp.onload = () => {
            try{
                this.id = JSON.parse(xhttp.responseText).newId;
                func();
            } catch(err){
                console.log(err);
                console.log(xhttp.responseText)
            }
        }
    }

    update(func){
        let xhttp = new XMLHttpRequest();
        xhttp.open("POST", "../amp/includes/requests/updatetoken.php"); 
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.send(JSON.stringify(this));
        xhttp.onload = function() {
            if(JSON.parse(this.responseText).msg === "success"){
                tryCallback(func, this.responseText); 
            } else {
                console.log(this.responseText)
            }
        }
    }

    delete(func){
        let xhttp = new XMLHttpRequest();
        xhttp.open("POST", "../amp/includes/requests/deletetoken.php"); 
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.send(JSON.stringify(this));
        xhttp.onload = function() {
            if(JSON.parse(this.responseText).msg === "success"){              
                tryCallback(func, this.responseText);
            } else {
                console.log(this.responseText);
            }
        }
    }
}
export function selectTokens(){
    
}

function tryCallback(callback, response){
    try{
        callback();
    } catch(err){
        console.log(response);
        console.log(err);
    }
}

export function selectAccessibleTokens(func){
    let xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
        try{
            func(constrFromJSON(this.responseText));
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