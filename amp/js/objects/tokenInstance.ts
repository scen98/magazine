import * as caller from "./caller.js";
export class TokenInstance{
    id: number;
    articleId: number;
    tokenId: number;
    authorId: number;
    authorName: string;
    date: Date;
    constructor(id: number, articleId: number, tokenId:number, authorId?: number, authorName?: string, date?: Date){
        this.id = id;
        this.articleId = articleId;
        this.tokenId = tokenId;
        this.authorId = authorId;
        this.authorName = authorName;
        this.date = date;
    }

    insert(func:any){
        let f = (response:string)=>{
            this.id = JSON.parse(response).newId;
            func();
        }

        caller.POST("../amp/includes/requests/inserttokeninstance.php", JSON.stringify(this), f);
    }
    
    delete(func:any){
        let f = (response:string)=>{
            if(JSON.parse(response).msg === "success"){
                func();
            } else {
                console.log(response);
            }
        }

        caller.POST("../amp/includes/requests/deletetokeninstance.php", JSON.stringify(this), f);
    }
}

export function constrFromJson(json:string){
    return constrArray(JSON.parse(json).article.tokenInstances);
 /*   let instanceArray: TokenInstance[];
    for (let instance of JSON.parse(json).article.tokenInstances) {
        let newTokenInstance = new TokenInstance(instance.id, instance.articleId, instance.tokenId, instance.authorId, instance.authorName, new Date(instance.date));
        instanceArray.push(newTokenInstance);
    }
    return instanceArray; */
}

export function constrArray(raw){
    let instanceArray: TokenInstance[] = [];
    if(raw == null){
        return undefined;
    }
    for (let instance of raw) {
        let newTokenInstance = new TokenInstance(instance.id, instance.articleId, instance.tokenId, instance.authorId, instance.authorName, new Date(instance.date));
        instanceArray.push(newTokenInstance);
    }
    return instanceArray;
}