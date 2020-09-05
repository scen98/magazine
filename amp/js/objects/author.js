export class Author{
    constructor(id, uniqName, userName, password, level){
        this.id = id;
        this.uniqName = uniqName;
        this.userName = userName;
        this.password = password;
        this.level = level;
    }

    getLevelName(){
        switch(this.level){
            case 10:
            return "Általános";
            case 20: 
            return "Asszisztens";
            case 30: 
            return "Rovatvezető";
            case 40:
            return "Újságvezető"
        }
    }
}
export function selectAllAuthors(func){
    let xhttp = new XMLHttpRequest();
    xhttp.open("GET", "../amp/includes/requests/selectauthors.php"); 
    xhttp.onload = function() {
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
        authorArray.push(newAuthor);
    }
    return authorArray;
}