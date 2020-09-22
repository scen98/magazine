import * as caller from "./caller.js";
export class Token{
    id: number;
    name: string;
    status: number;
    columnId: number;

    constructor(id: number, name?: string, status?: number, columnId?: number){
        this.id = id;
        this.name = name;
        this.status = status;
        this.columnId = columnId;
    }

    insert(func: () => void){
        let f = (response: string) =>{
            if(JSON.parse(response).msg === "success"){
                func();
            } else {
                console.log(response);
            }
        }
        caller.POST("../amp/includes/requests/updatetoken.php", JSON.stringify(this), f);
    }

    update(func: ()=> void){
        let f = (response: string) =>{
            if(JSON.parse(response).msg === "success"){
                func();
            } else {
                console.log(response);
            }
        }
        caller.POST("../amp/includes/requests/updatetoken.php", JSON.stringify(this), f);
    }

    delete(func: ()=> void){
        let f = (response: string) =>{
            if(JSON.parse(response).msg === "success"){
                func();
            } else {
                console.log(response);
            }
        }
        caller.POST("../amp/includes/requests/deletetoken.php", JSON.stringify(this), f);
    }
}
export function selectTokensByColumn(func: (tokens: Token[])=>void, columnId: number){
    let f = (response: string) => {
        func(constrFromJSON(response));
    }
    let data = {
        columnId: columnId
    }
    caller.POST("../amp/includes/requests/selecttokensbycolumn.php", JSON.stringify(data), f);
}

export function selectAccessibleTokens(func: (tokens: Token[])=>void){
    let f = (response: string) => {
        func(constrFromJSON(response));
    }
    caller.GET("../amp/includes/requests/selectaccessibletokens.php", f);
}

function constrFromJSON(json: string){
    let data = JSON.parse(json).tokens;
    let tokenArray: Token[] = [];
    for (let t of data) {
        tokenArray.push(new Token(t.id, t.name, t.status, t.columnId));
    }
    return tokenArray;
}

export function getMyTokenPermissions(func: any){
    let f = (response: string)=>{
        func(JSON.parse(response).tokenPermissions);
    }
    caller.GET("../amp/includes/gettokenpermissions.php", f);
}