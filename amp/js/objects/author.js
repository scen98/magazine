export class Author{
    constructor(id, uniqName, userName, password, permissions){
        this.id = id;
        this.uniqName = uniqName;
        this.userName = userName;
        this.password = password;
        this.permissions = permissions;
    }

    
    getHighestPermission(){
        return Math.max.apply(Math, this.permissions.map(function(p) { return p.level; }))
    }
    getPermissionName(){
        switch(this.getHighestPermission()){
            case 10:
            return "Általános";
            case 20: 
            return "Asszisztens";
            case 30: 
            return "Rovatvezető";
            case 40:
            return "Újságvezető";
            case 50:
            return "Rendszergazda";
        }
    }
}
export function selectAllAuthors(func){
    let xhttp = new XMLHttpRequest();
    xhttp.open("GET", "../amp/includes/requests/selectauthors.php"); 
    xhttp.onload = function() {
        console.log(this.responseText);
        try{
            func(parseArray(this.responseText));  
        }
        catch(err){
            console.log(err);
            console.log(this.responseText);
        }
    }  
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();
     
}

function parseArray(json){
    let authorArray = [];
    for (let auth of JSON.parse(json).authors) {
        let newAuthor = new Author(auth.id, auth.uniqName, auth.userName, null, auth.level);
        newAuthor.permissions = auth.permissions;
        authorArray.push(newAuthor);
    }
    return authorArray;
}