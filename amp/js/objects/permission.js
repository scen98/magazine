export class Permission {
    constructor(id, level, authorId){
        this.id = parseInt(id);
        this.level = parseInt(level);
        this.authorId = parseInt(authorId);
        this.columnId;
    }
    insert(func){
        let xhttp = new XMLHttpRequest();
        xhttp.open("POST", "../amp/includes/requests/insertpermission.php"); 
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.send(JSON.stringify(this));
        xhttp.onload = () => {
            try{
                this.id = JSON.parse(xhttp.responseText).newId;
                func(this); 
            } catch(err){
                console.log(err);
                console.log(xhttp.responseText);
            }
        }
    }
    change(func){
        let xhttp = new XMLHttpRequest();
        xhttp.open("POST", "../amp/includes/requests/changepermissiontype.php"); 
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.send(JSON.stringify(this));
        xhttp.onload = () => {
            try{
                this.id = JSON.parse(xhttp.responseText).newId;
                func(this); 
            } catch(err){
                console.log(err);
                console.log(xhttp.responseText)
            }
        }
    }
    delete(func){
        let xhttp = new XMLHttpRequest();
        let data = {
            id: this.id
        }
        xhttp.open("POST", "../amp/includes/requests/deletepermission.php"); 
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.send(JSON.stringify(data));
        xhttp.onload = () => {
            if(JSON.parse(xhttp.responseText).msg === "success"){
                tryCallback(func, args, xhttp.responseText);
            } else {
                console.log(xhttp.responseText);
            }
        }
    }
}

export function deletePermission(func, args, permission){
    let xhttp = new XMLHttpRequest();
    let data = {
        id: permission.id
    }
    xhttp.open("POST", "../amp/includes/requests/deletepermission.php"); 
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(data));
    xhttp.onload = () => {
        if(JSON.parse(xhttp.responseText).msg === "success"){
            tryCallback(func, args, xhttp.responseText);
        } else {
            console.log(xhttp.responseText);
        }
    }
}

export function insertTokenPermission(func, tokenPermission){
    let xhttp = new XMLHttpRequest();
    xhttp.open("POST", "../amp/includes/requests/inserttokenpermission.php"); 
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(tokenPermission));
    xhttp.onload = () => {
        try{
            tokenPermission.id = JSON.parse(xhttp.responseText).newId;
            func(tokenPermission);
        } catch(err){
            console.log(err);
            console.log(xhttp.responseText);
        }
    }
}

export function deleteTokenPermission(func, args, tokenPermission){
    let xhttp = new XMLHttpRequest();
    let data = {
        id: tokenPermission.id
    }
    xhttp.open("POST", "../amp/includes/requests/deletetokenpermission.php"); 
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(data));
    xhttp.onload = () => {
        if(JSON.parse(xhttp.responseText).msg === "success"){
            tryCallback(func, args, xhttp.responseText);
        } else {
            console.log(xhttp.responseText);
        }
    }
}

function tryCallback(callback, args, response){
    try{
        callback(args);
    } catch(err){
        console.log(response);
        console.log(err);
    }
}