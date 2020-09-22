import { getColumns } from "./objects/column.js";
import * as doc from "./doc.js";
import * as utils from "./utils.js";
import { selectByBlock } from "./objects/position.js";
import { selectArticlesByState, selectArticles } from "./objects/article.js";
import { updateBlock, selectByColumn } from "./objects/positionBlock.js";
import { getMyInfo } from "./objects/author.js";
let articleTable = doc.getDiv("article-table");
let positionTable = doc.getDiv("position-table");
let columnSelect = doc.getSelect("column-select");
let blockSelect = doc.getSelect("block-select");
let columns = [];
let blocks = [];
let positions = [];
let articles = [];
let archivedArticles = [];
let searchSelect = doc.getSelect("search-select");
let searchInput = doc.getInput("search-input");
let myInfo;
init();
function init() {
    getMyInfo((me) => {
        myInfo = me;
        getColumns(preparePage);
    });
    initListeners();
}
function initListeners() {
    doc.addChange(columnSelect, articleBasedLoad);
    doc.addChange(blockSelect, blockBasedLoad);
    doc.addChange(searchInput, searchArticles);
    doc.addChange(searchSelect, searchArticles);
    doc.addClick("search-btn", searchArticles);
    doc.addClick(doc.getBtn("save-btn"), save);
    doc.addClick(doc.getBtn("reset-btn"), reset);
}
function articleBasedLoad() {
    selectArticlesByState(renderArticles, "", 1000000, 0, parseInt(columnSelect.value), 2); //...ja
}
function blockBasedLoad() {
    selectByBlock(setPositions, parseInt(blockSelect.value));
}
function save() {
    let toSave = blocks.find(b => b.id === parseInt(blockSelect.value));
    toSave.positions = positions;
    updateBlock(() => { }, toSave);
}
function reset() {
    selectByBlock(setPositions, parseInt(blockSelect.value));
}
function searchArticles() {
    let results = articles;
    if (parseInt(searchSelect.value) !== 0) {
        results = results.filter(a => a.columnId === parseInt(searchSelect.value));
    }
    if (searchInput.value !== "" && searchInput.value != null && searchInput.value != undefined) {
        let keyword = searchInput.value.toLowerCase();
        results = results.filter(a => a.title.toLowerCase().includes(keyword) || a.lead.toLowerCase().includes(keyword) || a.authorName.toLowerCase().includes(keyword));
    }
    articleTable.innerHTML = "";
    for (let art of results) {
        renderArticle(art);
    }
}
function preparePage(columnData) {
    let highestPerm = myInfo.getHighestPermission();
    if (highestPerm >= 40) {
        let all = { id: 0, name: "Címlap" };
        columns = columnData;
        columns.unshift(all);
    }
    else {
        columns = columnData.filter(col => utils.hasCmlAccesToColumn(myInfo.permissions, col));
    }
    renderColumnSelect(columnSelect);
    renderColumnSearch();
}
function renderColumnSelect(select) {
    for (let col of columns) {
        doc.renderOption(select, col.id.toString(), col.name);
    }
    articleBasedLoad();
}
function renderArticles(articleData) {
    articles = articleData;
    selectByColumn((data) => {
        setBlocks(data);
    }, parseInt(columnSelect.value));
    articleTable.innerHTML = "";
    for (let art of articles) {
        renderArticle(art);
    }
}
function setBlocks(blockData) {
    blocks = blockData;
    blockSelect.innerHTML = "";
    for (let block of blocks) {
        doc.renderOption(blockSelect, block.id.toString(), block.name);
    }
    blockBasedLoad();
}
function renderArticle(article) {
    let container = doc.createDiv(article.id.toString(), ["positionArticleContainer"]);
    let title = doc.createP(["positionArticleTitle"], article.title);
    let table = document.createElement("table");
    let editBtn = doc.createButton(["positionArticleButton", "blue"], '<i class="fas fa-edit"></i>', () => {
        openEditor(article);
    });
    let archiveBtn = doc.createButton(["positionArticleButton", "yellow"], '<i class="fas fa-archive"></i>', () => {
        archiveArticle(article);
    });
    let stateBackBtn = doc.createButton(["positionArticleButton", "red"], '<i class="fas fa-share"></i>', () => {
        setStateBack(article);
    });
    container.draggable = true;
    doc.addDrag(container, article);
    doc.renderTableRow(table, [columns.find(c => c.id === article.columnId).name, article.authorName, doc.parseDateHun(article.date)]);
    doc.append(container, [title, editBtn, archiveBtn, stateBackBtn, table]);
    doc.append(articleTable, [container]);
}
function openEditor(article) {
    window.open("./editx.php?aid=" + article.id);
}
function archiveArticle(article) {
    article.state = 3;
    article.updateState(null);
    doc.remove(article.id.toString());
}
function setStateBack(article) {
    article.state = 1;
    article.updateState(null);
    doc.remove(article.id.toString());
}
function setPositions(positionData) {
    positions = positionData;
    selectArticles(setArchives, getArchivedIds());
}
function setArchives(archiveData) {
    archivedArticles = archiveData;
    renderPositions();
}
function getArchivedIds() {
    let archiveIds = [];
    for (let position of positions) {
        if (position.articleId != null) {
            if (!articles.some(a => a.id === position.articleId))
                archiveIds.push(position.articleId);
        }
    }
    return archiveIds;
}
function renderPositions() {
    positionTable.innerHTML = "";
    for (let position of positions) {
        renderPosition(position);
    }
}
function renderPosition(position) {
    let container = doc.createDiv("pos" + position.id, ["positionContainer"]);
    let name = doc.createP(["positionName"], position.name);
    let positionSpace = doc.createDiv(null, ["positionSpace"]);
    doc.addDrop(positionSpace, (article) => {
        position.articleId = article.id;
        article.date = new Date(article.date); //szóval a date stringből megint datet kell csinálnunk
        if (container.childNodes.length > 2) {
            container.removeChild(container.childNodes[2]);
            container.removeChild(container.childNodes[2]);
        }
        renderPositionButtons(container, positionSpace, position);
        renderPositionSpace(positionSpace, article);
    });
    doc.append(container, [name, positionSpace]);
    if (position.articleId != null) {
        renderPositionButtons(container, positionSpace, position);
        renderPositionSpace(positionSpace, articles.concat(archivedArticles).find(a => a.id === position.articleId));
    }
    doc.append(positionTable, [container]);
}
function renderPositionButtons(container, positionSpace, position) {
    let emptyBtn = doc.createButton(["positionArticleButton", "red"], '<i class="far fa-folder-open"></i>', () => {
        emptyPosition(container, position, positionSpace);
    });
    let sortDown = doc.createButton(["positionArticleButton", "green"], '<i class="fas fa-chevron-circle-down"></i>', () => {
        pushDown(position);
    });
    doc.append(container, [sortDown, emptyBtn]);
}
function pushDown(position) {
    let index = positions.findIndex(p => p.id === position.id);
    let i = positions.length - 1;
    while (i > index) {
        positions[i].articleId = positions[i - 1].articleId;
        i--;
    }
    positions[index].articleId = null;
    renderPositions();
}
function emptyPosition(container, position, positionSpace) {
    container.removeChild(container.childNodes[2]);
    container.removeChild(container.childNodes[2]);
    position.articleId = null;
    positionSpace.innerHTML = "";
}
function renderPositionSpace(parent, article) {
    parent.innerHTML = "";
    let container = doc.createDiv(null, ["innerContainer"]);
    let title = doc.createP(["positionArticleTitle"], article.title);
    let table = document.createElement("table");
    doc.renderTableRow(table, [columns.find(c => c.id === article.columnId).name, article.authorName, doc.parseDateHun(article.date)]);
    doc.append(container, [title, table]);
    doc.append(parent, [container]);
}
function renderColumnSearch() {
    let highestPerm = myInfo.getHighestPermission();
    let accessibleColumns = [];
    if (highestPerm >= 40) {
        let all = { id: 0, name: "Mind" };
        accessibleColumns = columns;
        accessibleColumns[0] = all;
        ;
    }
    else {
        accessibleColumns = columns.filter(col => utils.hasCmlAccesToColumn(myInfo.permissions, col));
    }
    for (let col of accessibleColumns) {
        doc.renderOption(searchSelect, col.id, col.name);
    }
}
//# sourceMappingURL=positionsController.js.map