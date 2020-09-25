export function GET(url, func) {
    let xhttp = new XMLHttpRequest();
    xhttp.onload = function () {
        try {
            func(this.responseText);
        }
        catch (err) {
            console.log(err);
            console.log(this.responseText);
        }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
}
/*
export function GETSynch(url: string): string{
    let xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
        return this.responseText;
    };
    xhttp.open("GET", url, false);
    xhttp.send();
}*/
export function POST(url, message, func) {
    let xhttp = new XMLHttpRequest();
    xhttp.open("POST", url);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(message);
    xhttp.onload = () => {
        try {
            func(xhttp.responseText);
        }
        catch (err) {
            console.log(err);
            console.log(xhttp.responseText);
        }
    };
}
//# sourceMappingURL=caller.js.map