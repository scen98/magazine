import * as caller from "./caller.js";
import * as perm from "./permission.js";
export class Author{
    id: number;
    uniqName: string;
    userName: string;
    permissions: perm.Permission[] = [];
    tokenPermissions: perm.TokenPermission[] = [];
    constructor(id: number, uniqName: string, userName:string, permissions?: perm.Permission[], tokenPermissions?: perm.TokenPermission[]){
        this.id = id;
        this.uniqName = uniqName;
        this.userName = userName;
        this.permissions = permissions;
        this.tokenPermissions = tokenPermissions;
    }

    getHighestPermission(): number{
        if(this.permissions == null || this.permissions.length === 0){
            return 0;
        }
        return Math.max.apply(Math, this.permissions.map(function(p:any) { return p.level; }))
    }
    getPermissionName(): string{
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
export function selectAllAuthors(func: (authors: Author[])=>void){
    let f = (response:string)=> {
        func(parseArray(response));  
    }
    caller.GET("../amp/includes/requests/selectauthors.php", f);
}

export function selectAuthor(func: (authors: Author)=>void, id: number){
    let f = (response:string) => {
        func(parseAuthor(response));
    }
    let data = {
        id: id
    }
    caller.POST("../amp/includes/requests/selectauthor.php", JSON.stringify(data), f);
}

export function selectAuthorByName(func: (authors: Author)=>void, authorName:string){
    let f = (response:string) => {
        func(parseAuthor(response));
    }
    let data = {
        name: authorName
    }
    caller.POST("../amp/includes/requests/selectauthorbyname.php", JSON.stringify(data), f);
}

export function permissionName(permission: perm.Permission):string{
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

export function getMyInfo(func: (author: Author)=>void){
    let f = (response:string)=>{
        func(parseAuthor(response));
    }
    caller.GET("../amp/includes/requests/getmyinfo.php", f);
}

function parseAuthor(json:string){
    let author = JSON.parse(json).author;
    let newAuthor: Author;
    if(author.permissions.length === 0){
        newAuthor = new Author(author.id, author.uniqName, author.userName);
    } else {
        newAuthor = new Author(author.id, author.uniqName, author.userName, perm.constrPermission(author.permissions), perm.constrTokenPermission(author.tokenPermissions));
    } 
    if(author.tokenPermissions.length > 0){
        newAuthor.tokenPermissions = author.tokenPermissions;
    } 
    return newAuthor;
}

function parseArray(json:string): Author[]{
    let authorArray: Author[] = [];
    for (let auth of JSON.parse(json).authors) {
        let newAuthor = new Author(auth.id, auth.uniqName, auth.userName, null, auth.level);
        newAuthor.permissions = auth.permissions;
        authorArray.push(newAuthor);
    }
    return authorArray;
}