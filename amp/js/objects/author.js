import * as caller from "./caller.js";
export class Author{
    constructor(id, uniqName, userName, password, permissions){
        this.id = parseInt(id);
        this.uniqName = uniqName;
        this.userName = userName;
        this.password = password;
        this.permissions = permissions;
        this.tokenPermissions = [];
    }

    getHighestPermission(){
        if(this.permissions.length === 0){
            return 0;
        }
        return Math.max.apply(Math, this.permissions.map(function(p) { return p.level; }))
    }
    getPermissionName(){
        switch(this.getHighestPermission()){
            case 10:
            return "Általános";
            case 20: 
            return "Rovatsegéd";
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
    let f = (response)=> {
        func(parseArray(response));  
    }
    caller.GET("../amp/includes/requests/selectauthors.php", f);
}

export function selectAuthorByName(func, authorName){
    let f = (response) => {
        func(parseAuthor(response));
    }
    let data = {
        name: authorName
    }
    caller.POST("../amp/includes/requests/selectauthorbyname.php", JSON.stringify(data), f);
}

export function permissionName(permission){
    switch(permission.level){
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

function parseAuthor(json){
    let author = JSON.parse(json).author;
    let newAuthor;
    if(author.permissions.length === 0){
        newAuthor = new Author(author.id, author.uniqName, author.userName, null, []);
    } else {
        newAuthor = new Author(author.id, author.uniqName, author.userName, null, author.permissions);
    }
    if(author.tokenPermissions.length > 0){
        newAuthor.tokenPermissions = author.tokenPermissions;
    }
    return newAuthor;
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