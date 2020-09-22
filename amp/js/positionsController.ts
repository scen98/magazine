import { getColumns, Column } from "./objects/column.js";
import * as doc from "./doc.js";
import * as utils from "./utils.js";
import { Position, selectByBlock } from "./objects/position.js";
import { Article, selectArticlesByState, selectArticles }from "./objects/article.js";
import { PositionBlock, updateBlock, selectByColumn } from "./objects/positionBlock.js";
import { Author, getMyInfo } from "./objects/author.js";
let articleTable: HTMLDivElement = doc.getDiv("article-table");
let positionTable: HTMLDivElement = doc.getDiv("position-table");
let columnSelect: HTMLSelectElement = doc.getSelect("column-select");
let blockSelect: HTMLSelectElement = doc.getSelect("block-select");
let columns: Column[] = [];
let blocks: PositionBlock[] = [];
let positions: Position[] = [];
let articles: Article[] = [];
let archivedArticles: Article[] = [];
let searchSelect: HTMLSelectElement = doc.getSelect("search-select");
let searchInput: HTMLInputElement = doc.getInput("search-input");
let myInfo: Author;

init();
function init(){
    getMyInfo((me: Author)=>{
        myInfo = me;
        getColumns(preparePage);
    });
    initListeners();
}

function initListeners(){
    doc.addChange(columnSelect, articleBasedLoad);
    doc.addChange(blockSelect, blockBasedLoad);
    doc.addChange(searchInput, searchArticles);
    doc.addChange(searchSelect, searchArticles);
    doc.addClick("search-btn", searchArticles);
    doc.addClick(doc.getBtn("save-btn"), save);
    doc.addClick(doc.getBtn("reset-btn"), reset);
}

function articleBasedLoad(){
    selectArticlesByState(renderArticles, "", 1000000, 0, parseInt(columnSelect.value), 2); //...ja
}

function blockBasedLoad(){
    selectByBlock(setPositions, parseInt(blockSelect.value));
}

function save(){
    let toSave = blocks.find(b=> b.id === parseInt(blockSelect.value));
    toSave.positions = positions;
    updateBlock(()=>{}, toSave);
}

function reset(){
    selectByBlock(setPositions, parseInt(blockSelect.value));
}

function searchArticles(){
    let results = articles;
    if(parseInt(searchSelect.value) !== 0){
        results = results.filter(a=> a.columnId === parseInt(searchSelect.value));
    }
    if(searchInput.value !== "" && searchInput.value != null && searchInput.value != undefined){
        let keyword = searchInput.value.toLowerCase();
        results = results.filter(a=> a.title.toLowerCase().includes(keyword) || a.lead.toLowerCase().includes(keyword) || a.authorName.toLowerCase().includes(keyword));
    }
    articleTable.innerHTML = "";
    for (let art of results) {
        renderArticle(art);
    }
}

function preparePage(columnData: Column[]){
    let highestPerm = myInfo.getHighestPermission();
    if(highestPerm >= 40){ 
        let all = { id: 0, name: "Címlap" }
        columns = columnData;
        columns.unshift(all);
    } else {
        columns = columnData.filter(col => utils.hasCmlAccesToColumn(myInfo.permissions, col));
    }
    renderColumnSelect(columnSelect);
    renderColumnSearch();
}

function renderColumnSelect(select: HTMLSelectElement){
    for (let col of columns) {
        doc.renderOption(select, col.id.toString(), col.name);
    }
    articleBasedLoad();
}

function renderArticles(articleData: Article[]){
    articles = articleData;
    selectByColumn((data)=>{
        setBlocks(data);
    }, parseInt(columnSelect.value)
    );
    articleTable.innerHTML = "";
    for (let art of articles) {
        renderArticle(art);
    }
}

function setBlocks(blockData: PositionBlock[]){
    blocks = blockData;
    blockSelect.innerHTML = "";
    for (let block of blocks) {
        doc.renderOption(blockSelect, block.id.toString(), block.name);
    }
    blockBasedLoad();
}

function renderArticle(article: Article){
    let container = doc.createDiv(article.id.toString(), ["positionArticleContainer"]);
    let title = doc.createP(["positionArticleTitle"], article.title);
    let table = document.createElement("table");
    let editBtn = doc.createButton(["positionArticleButton", "blue"], '<i class="fas fa-edit"></i>', ()=>{
        openEditor(article);
    });
    let archiveBtn = doc.createButton(["positionArticleButton", "yellow"], '<i class="fas fa-archive"></i>', ()=>{
        archiveArticle(article);
    });
    let stateBackBtn = doc.createButton(["positionArticleButton", "red"], '<i class="fas fa-share"></i>', ()=>{
        setStateBack(article);
    });

    container.draggable = true;
    doc.addDrag(container, article);
    doc.renderTableRow(table, [columns.find(c=> c.id === article.columnId).name, article.authorName, doc.parseDateHun(article.date)]);
    doc.append(container, [title, editBtn, archiveBtn, stateBackBtn, table]);
    doc.append(articleTable, [container]);
}

function openEditor(article: Article){
    window.open("./editx.php?aid="+article.id);
}

function archiveArticle(article: Article){
    article.state = 3;
    article.updateState(null);
    doc.remove(article.id.toString());
}

function setStateBack(article: Article){
    article.state = 1;
    article.updateState(null);
    doc.remove(article.id.toString());
}

function setPositions(positionData: Position[]){
    positions = positionData;

    selectArticles(setArchives, getArchivedIds())
    
}

function setArchives(archiveData: Article[]){
    archivedArticles = archiveData;
    renderPositions();
}

function getArchivedIds(){
    let archiveIds = [];
    for (let position of positions) {
        if(position.articleId != null){
            if(!articles.some(a=> a.id === position.articleId)) archiveIds.push(position.articleId);
        }
    }
    return archiveIds;
}

function renderPositions(){
    positionTable.innerHTML = "";
    for (let position of positions) {
        renderPosition(position);
    }
}

function renderPosition(position: Position){
    let container = doc.createDiv("pos"+position.id, ["positionContainer"]);
    let name = doc.createP(["positionName"], position.name);
    let positionSpace = doc.createDiv(null, ["positionSpace"]);
    doc.addDrop(positionSpace, (article)=>{ //ez nem igazi Article, mert JSON.parse() készíti nekünk
        position.articleId = article.id;
        article.date = new Date(article.date); //szóval a date stringből megint datet kell csinálnunk
        if(container.childNodes.length > 2){
            container.removeChild(container.childNodes[2]);
            container.removeChild(container.childNodes[2]);
        }
        renderPositionButtons(container, positionSpace, position);
        renderPositionSpace(positionSpace, article);
    });
    doc.append(container, [name, positionSpace]);
    if(position.articleId != null){
        renderPositionButtons(container, positionSpace, position);
        renderPositionSpace(positionSpace, articles.concat(archivedArticles).find(a=> a.id === position.articleId));
    }
    doc.append(positionTable, [container]);
}

function renderPositionButtons(container: HTMLDivElement, positionSpace: HTMLDivElement, position: Position){
    let emptyBtn = doc.createButton(["positionArticleButton", "red"], '<i class="far fa-folder-open"></i>', ()=>{
        emptyPosition(container, position, positionSpace);
    });
    let sortDown = doc.createButton(["positionArticleButton", "green"], '<i class="fas fa-chevron-circle-down"></i>', ()=>{
        pushDown(position);
    });
    doc.append(container, [sortDown, emptyBtn]);
}

function pushDown(position: Position){
    let index = positions.findIndex(p=> p.id === position.id);
    let i = positions.length-1;
    while(i > index){
        positions[i].articleId = positions[i-1].articleId;
        i--;
    }
    positions[index].articleId = null;
    renderPositions();
}

function emptyPosition(container: HTMLDivElement, position: Position, positionSpace: HTMLDivElement){
    container.removeChild(container.childNodes[2]);
    container.removeChild(container.childNodes[2]);
    position.articleId = null;
    positionSpace.innerHTML = "";
}

function renderPositionSpace(parent: HTMLElement, article: Article){
    parent.innerHTML = "";
    let container = doc.createDiv(null, ["innerContainer"]);
    let title = doc.createP(["positionArticleTitle"], article.title);
    let table = document.createElement("table");
    doc.renderTableRow(table, [columns.find(c=> c.id === article.columnId).name, article.authorName, doc.parseDateHun(article.date)]);
    doc.append(container, [title, table]);
    doc.append(parent, [container]);
}

function renderColumnSearch(){
    let highestPerm = myInfo.getHighestPermission();
    let accessibleColumns = [];
    if(highestPerm >= 40){ 
        let all = { id: 0, name: "Mind" }
        accessibleColumns = columns;
        accessibleColumns[0] = all;;
    } else {
        accessibleColumns = columns.filter(col => utils.hasCmlAccesToColumn(myInfo.permissions, col));
    }
    for (let col of accessibleColumns) {
        doc.renderOption(searchSelect, col.id, col.name);
    }
}
