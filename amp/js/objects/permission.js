import * as caller from "./caller.js";
export class Permission {
    constructor(id, level, authorId){
        this.id = parseInt(id);
        this.level = parseInt(level);
        this.authorId = parseInt(authorId);
        this.columnId;
    }
    insert(func){
        let f = (response)=>{
            this.id = JSON.parse(response).newId;
            func(); 
        }
        caller.POST("../amp/includes/requests/insertpermission.php", JSON.stringify(this), f);
    }
    change(func){
        let f = (response)=>{
            this.id = JSON.parse(response).newId;
            func(); 
        }
        caller.POST("../amp/includes/requests/changepermissiontype.php", JSON.stringify(this), f);
    }
    delete(func){
        let f = (response)=>{
            if(JSON.parse(response).msg === "success"){
                func();
            } else {
                console.log(response);
            }
        }
        let data = {
            id: this.id
        }
        caller.POST("../amp/includes/requests/deletepermission.php", JSON.stringify(data), f);
    }
}

export function deletePermission(func, permission){
    let f = (response)=>{
        if(JSON.parse(response).msg === "success"){
            func();
        } else {
            console.log(response);
        }
    }
    let data = {
        id: permission.id
    }
    caller.POST("../amp/includes/requests/deletepermission.php", JSON.stringify(data), f);

}

export function insertTokenPermission(func, tokenPermission){
    let f = (response)=>{
        tokenPermission.id = JSON.parse(response).newId;
        func(); 
    }
    caller.POST("../amp/includes/requests/inserttokenpermission.php", JSON.stringify(tokenPermission), f);
}

export function deleteTokenPermission(func, tokenPermission){
    let f = (response)=>{
        
        if(JSON.parse(response).msg === "success"){
            func(); 
        } else {
            console.log(response);
        }
    }
    let data = {
        id: tokenPermission.id,
        columnId: tokenPermission.columnId
    }
    caller.POST("../amp/includes/requests/deletetokenpermission.php", JSON.stringify(data), f);
}