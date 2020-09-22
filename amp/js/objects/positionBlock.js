import * as caller from "./caller.js";
export class PositionBlock {
    constructor(id, name, columnId, positions) {
        this.id = id;
        this.name = name;
        this.columnId = columnId;
        this.positions = positions;
    }
}
export function updateBlock(func, block) {
    let f = (response) => {
        if (JSON.parse(response).msg === "success") {
            func();
        }
        else {
            console.log(response);
        }
    };
    let data = {
        positionBlock: block
    };
    caller.POST("../amp/includes/requests/updateblock.php", JSON.stringify(data), f);
}
export function selectByColumn(func, columnId) {
    let f = (response) => {
        func(parseArray(response));
    };
    let data = {
        columnId: columnId
    };
    caller.POST("../amp/includes/requests/selectpositionblockbycolumn.php", JSON.stringify(data), f);
}
function parseArray(json) {
    let pos_array = [];
    for (let pos of JSON.parse(json).positionBlocks) {
        let block = new PositionBlock(pos.id, pos.name, pos.columnId);
        pos_array.push(block);
    }
    return pos_array;
}
//# sourceMappingURL=positionBlock.js.map