import * as caller from "./caller.js";
export class TokenInstance {
    constructor(id, articleId, tokenId, authorId, authorName, date) {
        this.id = id;
        this.articleId = articleId;
        this.tokenId = tokenId;
        this.authorId = authorId;
        this.authorName = authorName;
        this.date = date;
    }
    insert(func) {
        let f = (response) => {
            this.id = JSON.parse(response).newId;
            func();
        };
        caller.POST("../amp/includes/requests/inserttokeninstance.php", JSON.stringify(this), f);
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
        caller.POST("../amp/includes/requests/deletetokeninstance.php", JSON.stringify(this), f);
    }
}
export function constrFromJson(json) {
    return constrArray(JSON.parse(json).article.tokenInstances);
    /*   let instanceArray: TokenInstance[];
       for (let instance of JSON.parse(json).article.tokenInstances) {
           let newTokenInstance = new TokenInstance(instance.id, instance.articleId, instance.tokenId, instance.authorId, instance.authorName, new Date(instance.date));
           instanceArray.push(newTokenInstance);
       }
       return instanceArray; */
}
export function constrArray(raw) {
    let instanceArray = [];
    if (raw == null) {
        return undefined;
    }
    for (let instance of raw) {
        let newTokenInstance = new TokenInstance(instance.id, instance.articleId, instance.tokenId, instance.authorId, instance.authorName, new Date(instance.date));
        instanceArray.push(newTokenInstance);
    }
    return instanceArray;
}
//# sourceMappingURL=tokenInstance.js.map