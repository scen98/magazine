
import * as caller from "./caller.js";
export class Token{
    constructor(id, name, status, columnId){
        this.id = id;
        this.name = name;
        this.status = status;
        this.columnId = columnId;
    }
}

export function insertToken(newToken, func){
    caller.insert("../amp/includes/requests/inserttoken.php", newToken, func);
}

export function selectAccessibleTokens(func){
    caller.select("../amp/includes/requests/selectaccessibletokens.php", func);
}

export function update(token, func){
    caller.update("../amp/includes/requests/updatetoken.php", token, func)
}

export function remove(object, func){
    caller.deleteCall("../amp/includes/requests/deletetoken.php", object, func);
}