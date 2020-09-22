import * as caller from "./caller.js";
import * as ti from "./tokenInstance.js";
export class Article {
    constructor(id, title, lead, authorId, date, imgPath, columnId, text, isLocked, lockedBy, state, authorName, tokenInstances) {
        this.id = id;
        this.title = title;
        this.lead = lead;
        this.authorId = authorId;
        this.date = date;
        this.imgPath = imgPath;
        this.columnId = columnId;
        this.text = text;
        this.isLocked = isLocked;
        this.lockedBy = lockedBy;
        this.state = state;
        this.authorName = authorName;
        this.tokenInstances = tokenInstances;
    }
    insert(func) {
        console.log(this);
        let f = (response) => {
            this.id = JSON.parse(response).newId;
            func();
        };
        caller.POST("../amp/includes/requests/insertarticle.php", JSON.stringify(this), f);
    }
    update(func) {
        let f = (response) => {
            if (JSON.parse(response).msg === "success") {
                func();
            }
            else {
                console.log(response);
            }
        };
        caller.POST("../amp/includes/requests/updatearticle.php", JSON.stringify(this), f);
    }
    delete(func) {
        let f = (response) => {
            if (JSON.parse(response).msg === "success") {
                func();
            }
            else {
                console.log(response);
            }
        };
        caller.POST("../amp/includes/requests/deletearticle.php", JSON.stringify(this), f);
    }
    switchLock(func, authorId) {
        invertLock(this, authorId);
        let f = (response) => {
            if (JSON.parse(response).msg === "success") {
                func();
            }
            else if (JSON.parse(response).msg === "fail") {
                alert("Ezt a cikket már egy másik felhasználó zárolta.");
            }
            else {
                invertLock(this, authorId);
                console.log(response);
            }
        };
        if (this.isLocked) {
            caller.POST("../amp/includes/requests/lockarticle.php", JSON.stringify(this), f);
        }
        else {
            caller.POST("../amp/includes/requests/unlockarticle.php", JSON.stringify(this), f);
        }
    }
    updateState(func) {
        let data = {
            id: this.id,
            state: this.state,
            columnId: this.columnId
        };
        let f = (response) => {
            if (JSON.parse(response).msg === "success") {
                //func();
            }
            else {
                console.log(response);
            }
        };
        caller.POST("../amp/includes/requests/updatearticlestate.php", JSON.stringify(data), f);
    }
    hasTokenInstance(token) {
        if (this.tokenInstances == null) {
            return false;
        }
        return this.tokenInstances.some(ti => ti.tokenId === token.id);
    }
    hasAllTokenInstances(necessaryTokens) {
        return necessaryTokens.every(t => this.hasTokenInstance(t));
    }
}
export function invertLock(article, authorId) {
    if (!article.isLocked) {
        article.isLocked = true;
        article.lockedBy = authorId;
    }
    else {
        article.isLocked = false;
    }
}
export function selectArticle(func, articleId) {
    let data = {
        id: articleId
    };
    let f = (response) => {
        func(constrFromJSON(response));
    };
    caller.POST("../amp/includes/requests/selectarticle.php", JSON.stringify(data), f);
}
export function selectArticles(func, articleIdArray) {
    let data = {
        ids: articleIdArray
    };
    let f = (response) => {
        func(parseArray(response));
    };
    caller.POST("../amp/includes/requests/selectarticles.php", JSON.stringify(data), f);
}
export function selectMyArticles(func, keyword, limit, offset, orderby, desc) {
    let args = {
        keyword: keyword,
        limit: limit,
        offset: offset,
        orderby: orderby,
        desc: desc
    };
    let f = (response) => {
        func(parseArray(response));
    };
    caller.POST("../amp/includes/requests/selectmyarticles.php", JSON.stringify(args), f);
}
export function selectArticlesByState(func, keyword, limit, offset, columnId, state) {
    let data = {
        keyword: keyword,
        limit: limit,
        offset: offset,
        columnId: columnId,
        state: state
    };
    let f = (response) => {
        func(parseArray(response));
    };
    caller.POST("../amp/includes/requests/selectarticlesbystate.php", JSON.stringify(data), f);
}
function parseArray(json) {
    let articleArray = Array();
    for (let art of JSON.parse(json).articles) {
        let newArticle = new Article(art.id, art.title, art.lead, art.authorId, new Date(art.date), art.imgP, art.columnId, art.text, art.isLocked == 1, art.lockedBy, art.state, art.authorName, ti.constrArray(art.tokenInstances));
        articleArray.push(newArticle);
    }
    return articleArray;
}
function constrFromJSON(json) {
    let art = JSON.parse(json).article;
    let article = new Article(art.id, art.title, art.lead, art.authorId, new Date(art.date), art.imgPath, art.columnId, art.text, art.isLocked == 1, art.lockedBy, art.state, art.authorName);
    if (art.state > 0 && art.tokenInstances != undefined && art.tokenInstances.length > 0) {
        article.tokenInstances = ti.constrArray(art.tokenInstances);
    }
    //  if(data.state > 0){
    //   article.tokenInstances = TokenInstance.constrFromJson(json);
    //  }
    return article;
}
//# sourceMappingURL=article.js.map