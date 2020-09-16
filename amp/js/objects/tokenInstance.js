import * as caller from "./caller.js";
export class TokenInstance{
    constructor(id, articleId, tokenId, { authorId, authorName, date } = {}){
        this.id = parseInt(id);
        this.articleId = parseInt(articleId);
        this.tokenId = parseInt(tokenId);
        this.authorId = parseInt(authorId);
        this.authorName = authorName;
        this.date = date;
    }

    insert(func){
        let f = (response)=>{
            this.id = JSON.parse(response).newId;
            func();
        }

        caller.POST("../amp/includes/requests/inserttokeninstance.php", JSON.stringify(this), f);
    }
    
    delete(func){
        let f = (response)=>{
            if(JSON.parse(response).msg === "success"){
                func();
            } else {
                console.log(response);
            }
        }

        caller.POST("../amp/includes/requests/deletetokeninstance.php", JSON.stringify(this), f);
    }
}

export function constrFromJson(json){
    let instanceArray = [];
    for (let instance of JSON.parse(json).article.tokenInstances) {
        let newTokenInstance = new TokenInstance(instance.id, instance.articleId, instance.tokenId, { authorId: instance.authorId, authorName: instance.authorName, date: instance.date});
        instanceArray.push(newTokenInstance);
    }
    return instanceArray;
    
}