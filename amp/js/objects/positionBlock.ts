import * as caller from "./caller.js";
import { Position }from "./position.js";
export class PositionBlock{
    id: number;
    name: string;
    columnId: number;
    positions: Position[];
    constructor(id: number, name: string, columnId:number, positions?: Position[]){
        this.id = id;
        this.name = name;
        this.columnId = columnId;
        this.positions = positions;
    }
}

export function updateBlock(func:any, block: PositionBlock){
    let f = (response:string)=>{
        if(JSON.parse(response).msg === "success"){
            func();
        } else {
            console.log(response);
        } 
    }
    let data = {
        positionBlock: block
    }
    caller.POST("../amp/includes/requests/updateblock.php", JSON.stringify(data), f);
}

export function selectByColumn(func: (pos: PositionBlock[])=>void, columnId: number){
    let f = (response: string)=>{
        func(parseArray(response));
    }
    let data = {
        columnId: columnId
    }
    caller.POST("../amp/includes/requests/selectpositionblockbycolumn.php", JSON.stringify(data), f)
}

function parseArray(json: string){
    let pos_array: PositionBlock[]=[];
    for (let pos of JSON.parse(json).positionBlocks) {
        let block = new PositionBlock(pos.id, pos.name, pos.columnId);
        pos_array.push(block);
    }
    return pos_array;
}