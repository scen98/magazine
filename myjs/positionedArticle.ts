import * as caller from "../amp/js/objects/caller.js";
import { Article, constrFromJSON } from "../amp/js/objects/article.js";
import * as doc from "../amp/js/doc.js";
export class PositionedArticle extends Article {
    htmlId: string;
    columnName: string;
    constructor(id:number, title:string, lead:string, authorId:number, date:Date, imgPath:string, columnId:number, authorName: string, columnName: string, htmlId: string){
        super(id, title, lead, authorId, date, imgPath, columnId);
        super.authorName = authorName;
        this.columnName = columnName;
        this.htmlId = htmlId;
    }

    render(){
        let title = doc.get(`${this.htmlId}-title`);
        if(title != null) title.innerText = `${this.title}`;
        let lead = doc.get(`${this.htmlId}-lead`);
        if(lead != null){
            let leadContent = `${this.lead.substr(0, 150)}`;
            //if(this.lead.length > 100) leadContent += "..."; 
            lead.innerText = leadContent;
        }  
        let frontImg = doc.getImg(`${this.htmlId}-img`);
        if(frontImg != null) frontImg.src = this.imgPath;
        let column = doc.get(`${this.htmlId}-column`) as HTMLAnchorElement;
        if(column != null) {
            column.innerText = this.columnName;
            column.href = `../magazine/rovat.php?cid=${this.columnId}&rovat=${this.columnName}`;
        }
        let date = doc.get(`${this.htmlId}-date`);
        if(date != null) date.innerText = doc.parseDateYYYYMMDD(this.date);
        let author = doc.get(`${this.htmlId}-author`);
        if(author != null) author.innerText = this.authorName;
        for (let art of document.getElementsByName(this.htmlId)) {
            art.href = `../magazine/cikk.php?aid=${this.id}&cid=${this.columnId}&rovat=${this.columnName}`;
        }
    }
}

export function selectPositionedArticles(func: (articles: PositionedArticle[])=> void, columnId: number){
    let data = {
        columnId: columnId
    }
    let f = (response: string)=>{
        func(parsePositionedArticles(response));
    }
    caller.POST("./amp/includes/requests/selectarticlesbycolumnblock.php", JSON.stringify(data), f);
}

export function selectReadableArticle(func: (article: Article)=> void, id: number){
    let f = (response: string)=>{
        func(constrFromJSON(response));
    }
    let data = {
        id: id
    }
    caller.POST("../magazine/amp/includes/requests/selectreadablearticle.php", JSON.stringify(data), f);
}

export function selectSideArticles(func: (articles: PositionedArticle[])=> void, columnId: number){
    let data = {
        columnId: columnId
    }
    let f = (response: string)=>{
        func(parsePositionedArticles(response));
    }
    caller.POST("./amp/includes/requests/selectsidearticles.php", JSON.stringify(data), f);
}

export function selectPositionedArticlesByBlock(func: (articles: PositionedArticle[])=> void, blockId: number){
    let data = {
        blockId: blockId
    }
    let f = (response: string)=>{
        func(parsePositionedArticles(response));
    }
    caller.POST("./amp/includes/requests/selectarticlesbyblock.php", JSON.stringify(data), f);
}

export function parsePositionedArticles(json: string): PositionedArticle[]{
    let articles = JSON.parse(json).articles;
    let result: PositionedArticle[] = [];
    for (let art of articles) {
        let newArticle = new PositionedArticle(art.id, art.title, art.lead, art.authorId, new Date(art.date), art.imgPath, art.columnId, art.authorName, art.columnName, art.htmlId);
        result.push(newArticle);
    }
    return result;
}