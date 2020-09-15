export function GET(location, func){
    let xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
        try{
            func(this.responseText);
        }catch(err) {
            console.log(err);
            console.log(this.responseText);
        }
    };    
    xhttp.open("GET", location, true);
    xhttp.send();
}

export function POST(location, message, func){
    let xhttp = new XMLHttpRequest();
    xhttp.open("POST", location); 
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(message);
    xhttp.onload = () => {
        try{
            func(xhttp.responseText); 
        } catch(err){
            console.log(err);
            console.log(xhttp.responseText)
        }
    }
}
