import * as caller from "./caller.js";
export class Permission {
    id: number;
    level: number;
    authorId: number;
    columnId: number;
    constructor(id: number, level: number, authorId: number, columnId?: number){
        this.id = id;
        this.level = level;
        this.authorId = authorId;
        this.columnId = columnId;
    }
    insert(func: any){
        let f = (response: string)=>{
            this.id = JSON.parse(response).newId;
            func(); 
        }
        caller.POST("../amp/includes/requests/insertpermission.php", JSON.stringify(this), f);
    }
    change(func: any){
        let f = (response: string)=>{
            this.id = JSON.parse(response).newId;
            func(); 
        }
        caller.POST("../amp/includes/requests/changepermissiontype.php", JSON.stringify(this), f);
    }
    delete(func: any){
        let f = (response: string)=>{
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

export function deletePermission(func: any, permission: Permission){
    let f = (response: string)=>{
        if(JSON.parse(response).msg === "success"){
            func();
        } else {
            console.log(response);
        }
    }
    let data = {
        id: permission.id,
        columnId: permission.columnId,
        authorId: permission.authorId
    }
    caller.POST("../amp/includes/requests/deletepermission.php", JSON.stringify(data), f);

}

export function insertTokenPermission(func: any, tokenPermission: TokenPermission){
    let f = (response: string)=>{
        tokenPermission.id = JSON.parse(response).newId;
        func(); 
    }
    caller.POST("../amp/includes/requests/inserttokenpermission.php", JSON.stringify(tokenPermission), f);
}

export function deleteTokenPermission(func: any, tokenPermission: TokenPermission){
    let f = (response: string)=>{
        
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

export function constrPermission(json): Permission[]{
    let permissions: Permission[] = [];
    for (let perm of json) {
        permissions.push(new Permission(perm.id, perm.level, perm.authorId, perm.columnId));
    }
    return permissions;
}

export function constrTokenPermission(json): TokenPermission[]{
    let permissions: TokenPermission[] = [];
    for (let perm of json) {
        let tk: TokenPermission = {
            id: perm.id,
            authorId: perm.authorId,
            tokenId: perm.tokenId,
            columnId: perm.columnId
        }
        permissions.push(tk);
    }
    return permissions;
}

export interface TokenPermission{
    id: number;
    authorId: number;
    tokenId: number;
    columnId: number;
    tokenName?: string;
}