import * as caller from "./caller.js";
export class Position {
    constructor(id, name, htmlId, articleId) {
        this.id = id;
        this.name = name;
        this.htmlId = htmlId;
        this.articleId = articleId;
    }
}
export function updatePositions(func, positions) {
    let f = () => {
        func();
    };
    caller.POST("../amp/includes/requests/updatepositions.php", JSON.stringify(positions), f);
}
export function selectByBlock(func, blockId) {
    let f = (response) => {
        func(parseArray(response));
    };
    let data = {
        blockId: blockId
    };
    caller.POST("../amp/includes/requests/selectpositionbyblock.php", JSON.stringify(data), f);
}
function parseArray(json) {
    let pos_array = [];
    for (let pos of JSON.parse(json).positions) {
        let position = new Position(pos.id, pos.name, pos.htmlId, pos.articleId);
        pos_array.push(position);
    }
    return pos_array;
}
//# sourceMappingURL=position.js.map