import * as caller from "./caller.js";
export class Token {
    constructor(id, name, status, columnId) {
        this.id = id;
        this.name = name;
        this.status = status;
        this.columnId = columnId;
    }
    insert(func) {
        let f = (response) => {
            this.id = JSON.parse(response).newId;
            func();
        };
        caller.POST("../amp/includes/requests/inserttoken.php", JSON.stringify(this), f);
    }
    update(func) {
        let f = (response) => {
            if (JSON.parse(response).msg === "success") {
                func();
            }
            else {
                console.log(response);
            }
        };
        caller.POST("../amp/includes/requests/updatetoken.php", JSON.stringify(this), f);
    }
    delete(func) {
        let f = (response) => {
            if (JSON.parse(response).msg === "success") {
                func();
            }
            else {
                console.log(response);
            }
        };
        caller.POST("../amp/includes/requests/deletetoken.php", JSON.stringify(this), f);
    }
}
export function selectTokensByColumn(func, columnId) {
    let f = (response) => {
        func(constrFromJSON(response));
    };
    let data = {
        columnId: columnId
    };
    caller.POST("../amp/includes/requests/selecttokensbycolumn.php", JSON.stringify(data), f);
}
export function selectActiveTokensByColumn(func, columnId) {
    let f = (response) => {
        func(constrFromJSON(response));
    };
    let data = {
        columnId: columnId
    };
    caller.POST("../amp/includes/requests/selectactivetokensbycolumn.php", JSON.stringify(data), f);
}
export function selectAccessibleTokens(func) {
    let f = (response) => {
        func(constrFromJSON(response));
    };
    caller.GET("../amp/includes/requests/selectaccessibletokens.php", f);
}
function constrFromJSON(json) {
    let data = JSON.parse(json).tokens;
    let tokenArray = [];
    for (let t of data) {
        tokenArray.push(new Token(t.id, t.name, t.status, t.columnId));
    }
    return tokenArray;
}
export function getMyTokenPermissions(func) {
    let f = (response) => {
        func(JSON.parse(response).tokenPermissions);
    };
    caller.GET("../amp/includes/gettokenpermissions.php", f);
}
//# sourceMappingURL=token.js.map