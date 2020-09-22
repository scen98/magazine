import * as caller from "./caller.js";
export class Position{
    id: number;
    name: string;
    htmlId: string;
    articleId: number;
    constructor(id: number, name: string, htmlId: string, articleId:number){
        this.id = id;
        this.name = name;
        this.htmlId = htmlId;
        this.articleId = articleId;
    }
}

export function updatePositions(func: any, positions: Position[]){
    let f = ()=>{
        func();
    }
    caller.POST("../amp/includes/requests/updatepositions.php", JSON.stringify(positions), f);
}

export function selectByBlock(func: (positions: Position[])=>void, blockId: number){
    let f = (response:string)=>{
        func(parseArray(response));
    }
    let data = {
        blockId: blockId
    }
    caller.POST("../amp/includes/requests/selectpositionbyblock.php", JSON.stringify(data), f)
}

function parseArray(json: string){
    let pos_array: Position[] = [];
    for (let pos of JSON.parse(json).positions) {
        let position = new Position(pos.id, pos.name, pos.htmlId, pos.articleId);
        pos_array.push(position);
    }
    return pos_array;
}