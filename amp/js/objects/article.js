export class Article {
    constructor(id, title, lead, authorId, date, imgPath, columnId, text){
        this.id = id;
        this.title = title;
        this.lead = lead;
        this.authorId = authorId;
        this.date = date;
        this.imgPath = imgPath;
        this.columnId = columnId;
        this.text = text;
    }

    insert(func, args){    
        let xhttp = new XMLHttpRequest();
        xhttp.open("POST", "../amp/includes/requests/insertarticle.php"); 
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.send(JSON.stringify(this));
        xhttp.onload = () => {
            try {
                var newId = JSON.parse(xhttp.responseText).newId;
                this.id = newId;
                func(newId, args);
            } catch(err){
                console.log(xhttp.responseText);
                console.log(err);
            }
        }
    }

    update(func, args){
        let xhttp = new XMLHttpRequest();
        xhttp.open("POST", "../amp/includes/requests/updatearticle.php"); 
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.send(JSON.stringify(this));
        xhttp.onload = function() {
            if(JSON.parse(this.responseText).msg == "success"){
                tryCallBack(func, args, this.responseText);
            } else {
                console.log(this.responseText);
            }            
        }
    }

    delete(func, args){
        let xhttp = new XMLHttpRequest();
        xhttp.open("POST", "../amp/includes/requests/deletearticle.php"); 
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.send(JSON.stringify(this));
        xhttp.onload = function() {
            if(JSON.parse(this.responseText).msg == "success"){
                tryCallBack(func, args, this.responseText);
            } else {
                console.log(this.responseText);
            }   
        }
    }
}

function tryCallBack(func, args, message){
    try {
        func(args);
    }catch(err){
        console.log(message);
        console.log(err);
    }
}

export function selectArticle(func, articleId){
    let data = {
        id: articleId
    }
    let xhttp = new XMLHttpRequest();
    xhttp.open("POST", "../amp/includes/requests/selectarticle.php"); 
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(data));
    xhttp.onload = function() {
        try{
            func(constrFromJSON(this.responseText));
        }
        catch{
           console.log(this.responseText);
        }
    }
}

export function selectMyArticles(func, keyword, limit, offset, orderby, desc){
    let xhttp = new XMLHttpRequest();
    let args = {
        keyword: keyword,
        limit: limit,
        offset: offset,
        orderby: orderby,
        desc: desc
    }
    xhttp.open("POST", "../amp/includes/requests/selectmyarticles.php"); 
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(args));
    xhttp.onload = function() {
        try{
            func(parseArray(this.responseText));
        }
        catch(err){
            console.log(err);
            console.log(this.responseText);
        }
    }    
}

function parseArray(json){
    let articleArray = Array();
    for (let art of JSON.parse(json).articles) {
        let newArticle = new Article(art.id, art.title, art.lead, art.authorId, art.date, art.imgP,art.columnId, art.text);
        articleArray.push(newArticle);
    }
    return articleArray;
}

function constrFromJSON(json){
    let data = JSON.parse(json).article;
    let article = new Article(data.id, data.title, data.lead, data.authorId, data.date, data.imgPath, data.columnId, data.text);
    return article;
}