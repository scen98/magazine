export function select(location, func){
    let xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
        try{
            func(JSON.parse(this.responseText).result);
        }catch(err) {
            console.log(err.message);
            console.log(this.responseText);
        }
    };    
    xhttp.open("GET", location, true);
    xhttp.send();
}

export function insert(location, object, func){
    let xhttp = new XMLHttpRequest();
    xhttp.open("POST", location); 
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(object));
    xhttp.onload = () => {
        try{
            object.id = JSON.parse(xhttp.responseText).newId;
            func(); 
        } catch(err){
            console.log(err);
            console.log(xhttp.responseText)
        }
    }
}
export function update(location, object, func){
    let xhttp = new XMLHttpRequest();
    xhttp.open("POST", location); 
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(object));
    xhttp.onload = function() {
        if(JSON.parse(this.responseText).msg === "success"){
            tryCallback(func, this.responseText); 
        } else {
            console.log(this.responseText)
        }
    }
}

export function deleteCall(location, object, func){
    let xhttp = new XMLHttpRequest();
        xhttp.open("POST", location); 
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.send(JSON.stringify(object));
        xhttp.onload = function() {
            if(JSON.parse(this.responseText).msg === "success"){              
                tryCallback(func, this.responseText);
            } else {
                console.log(this.responseText);
            }
        }
}

function tryCallback(callback, response){
    try{
        callback();
    } catch(err){
        console.log(response);
        console.log(err);
    }
}