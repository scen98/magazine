import * as caller from "./caller.js";
export class Article {
    constructor(id, title, lead, authorId, date, imgPath, columnId, { text, isLocked, lockedBy, state } = {}){
        this.id = parseInt(id);
        this.title = title;
        this.lead = lead;
        this.authorId = authorId;
        this.date = date;
        this.imgPath = imgPath;
        this.columnId = parseInt(columnId);
        this.text = text;
        this.isLocked = isLocked;
        this.lockedBy = parseInt(lockedBy);
        this.state = state;
    }

    insert(func){
        console.log(this);
        let f = (response) => {
            this.id = JSON.parse(response).newId;
            func();
        }
        caller.POST("../amp/includes/requests/insertarticle.php", JSON.stringify(this), f);
    }

    update(func){
        let f = (response) =>{
            if(JSON.parse(response).msg === "success"){
                func();
            } else {
                console.log(response);
            }
        }
        caller.POST("../amp/includes/requests/updatearticle.php", JSON.stringify(this), f);
    }

    delete(func){
        let f = (response) =>{
            if(JSON.parse(response).msg === "success"){
                func();
            } else {
                console.log(response);
            }
        }
        caller.POST("../amp/includes/requests/deletearticle.php", JSON.stringify(this), f);
    }

    switchLock(func, authorId){
        invertLock(this, authorId);
        let f = (response) =>{
            if(JSON.parse(response).msg === "success"){
                func();
            } else if(JSON.parse(response).msg === "fail"){
                alert("Ezt a cikket már egy másik felhasználó zárolta.")
            } else{
                invertLock(this, authorId);
                console.log(response);
            }
        }
        if(this.isLocked === 1){
            caller.POST("../amp/includes/requests/lockarticle.php", JSON.stringify(this), f);
        } else {
            caller.POST("../amp/includes/requests/unlockarticle.php", JSON.stringify(this), f);
        }
        
    }

    updateState(func){
        let data = {
            id: this.id,
            state: this.state,
            columnId: this.columnId
        }
        let f = (response) => {
            if(JSON.parse(response).msg === "success"){
                func();
            } else{
                console.log(response);
            }
        }
        caller.POST("../amp/includes/requests/updatearticlestate.php", JSON.stringify(data), f);
    }

    getText(func){
        let f = (response)=>{
            this.text = response;
            func();
        }
        caller.GET("../amp/includes/texts/article"+this.id+".txt", f);
    }
}

export function invertLock(article, authorId){
    if(article.isLocked === 0){
        article.isLocked = 1;
        article.lockedBy = authorId;
    } else {
        article.isLocked = 0;
    }
}

export function selectArticle(func, articleId){
    let data = {
        id: articleId
    }
    let f = (response)=> {
        func(constrFromJSON(response));
    }
    caller.POST("../amp/includes/requests/selectarticle.php", JSON.stringify(data), f);
}

export function selectMyArticles(func, keyword, limit, offset, orderby, desc){
    let args = {
        keyword: keyword,
        limit: parseInt(limit),
        offset: offset,
        orderby: orderby,
        desc: desc
    }
    let f = (response)=> {
        func(parseArray(response));
    }
    caller.POST("../amp/includes/requests/selectmyarticles.php", JSON.stringify(args), f);   
}

export function selectState1Articles(func, keyword, limit, offset, columnId){
    let data = {
        keyword: keyword,
        limit: parseInt(limit),
        offset: parseInt(offset),
        columnId: parseInt(columnId)
    }
    let f = (response) =>{
        func(parseArray(response));
    }
    caller.POST("../amp/includes/requests/selectstate1articles.php", JSON.stringify(data), f);
}

export function saveText(func, article){
    let data = {
        id: article.id,
        text: article.text
    }
    let f = (response)=>{
        if(JSON.parse(response).msg === "success"){
            func();
        } else {
            console.log(response);
        }
    }
    caller.POST("../amp/includes/requests/savetext.php", JSON.stringify(data), f);
}

function parseArray(json){
    let articleArray = Array();
    for (let art of JSON.parse(json).articles) {
        let newArticle = new Article(art.id, art.title, art.lead, art.authorId, art.date, art.imgP,art.columnId,
            {text: art.text, isLocked: art.isLocked, lockedBy: art.lockedBy, state: art.state});
        articleArray.push(newArticle);
    }
    return articleArray;
}

function constrFromJSON(json){
    let data = JSON.parse(json).article;
    let article = new Article(data.id, data.title, data.lead, data.authorId, data.date, data.imgPath, data.columnId, 
        {text: data.text, isLocked: data.isLocked, lockedBy: data.lockedBy, state: data.state});
    if(data.state === 1){
        article.tokenInstances = data.tokenInstances;
    }
    return article;
}