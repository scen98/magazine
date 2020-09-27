export function renderOption(select: HTMLSelectElement, value: string, innerText: string){
    let opt = document.createElement("option");
    opt.value = value;
    opt.innerText = innerText;
    select.appendChild(opt);
}

export function createTable(classList: string[]): HTMLTableElement{
    let element = document.createElement("table");
    for (let c of classList) {
        element.classList.add(c);
    }
    return element;
}

export function createDiv(id: string, classList: string[]): HTMLDivElement{
    let element = document.createElement("div");
    if(id != null){
        element.id = id;
    }
    for (let c of classList) {
        element.classList.add(c);
    }
    return element;
}

export function renderTableRow(parent: HTMLElement, rowArray){
    let row = document.createElement("tr");;
    for (let td of rowArray) {
        let cell = document.createElement("td");
        cell.innerHTML = td;
        row.appendChild(cell);
    }
    parent.appendChild(row);
}

export function createP(classList: string[], innerText: string): HTMLParagraphElement{
    let element = document.createElement("p");
    for (let c of classList) {
        element.classList.add(c);
    }
    element.innerText = innerText;
    return element;
}

export function createA(classList: string[], innerText: string, href?: string): HTMLAnchorElement{
    let element = document.createElement("a");
    for (let c of classList) {
        element.classList.add(c);
    }
    element.innerText = innerText;
    element.href = href;
    return element;
}

export function createButton(classList: string[], innerHTML:any, func?:any): HTMLButtonElement{
    let element = document.createElement("button");
    for (let c of classList) {
        element.classList.add(c);
    }
    element.innerHTML = innerHTML;
    element.addEventListener("click", func);
    return element;
}

export function createSelect(id: string, classList: string[]): HTMLSelectElement{
    let element = document.createElement("select");
    if(id != null){
        element.id = id;
    }
    for (let c of classList) {
        element.classList.add(c);
    }
    
    return element;
}
export function create(type: string, id: string, classList: string[], innerHTML:any): HTMLElement{
    let element = document.createElement(type);
    if(id != null){
        element.id = id;
    }
    for (let c of classList) {
        element.classList.add(c);
    }
    
    element.innerHTML = innerHTML;
    return element;
}


export function append(parent:HTMLElement | string, childList:HTMLElement[]){
    let p = checkString(parent);
    for (let e of childList) {
        p.appendChild(e);
    }
}

export function getValue(htmlId: string | HTMLInputElement): string{
    return (checkString(htmlId) as HTMLInputElement).value;
}

export function getUl(htmlId: string): HTMLUListElement{
    return (document.getElementById(htmlId) as HTMLUListElement);
}

export function getImg(htmlId: string): HTMLImageElement{
    return (document.getElementById(htmlId) as HTMLImageElement);
}

export function get(htmlId: string): HTMLElement{
    return (document.getElementById(htmlId) as HTMLElement);
}

export function getDiv(htmlId: string): HTMLDivElement {
    return (document.getElementById(htmlId) as HTMLDivElement);
}

export function getBtn(htmlId: string): HTMLButtonElement{
    return (document.getElementById(htmlId) as HTMLButtonElement);
}

export function getSelect(htmlId: string): HTMLSelectElement{
    return (document.getElementById(htmlId) as HTMLSelectElement);
}



export function getTable(htmlId):HTMLTableElement{
    return (document.getElementById(htmlId) as HTMLTableElement);
}

export function getInput(htmlId: string): HTMLInputElement{
    return (document.getElementById(htmlId) as HTMLInputElement);
}

export function addClick(parent: string | HTMLElement, func: ()=>void){
    checkString(parent).addEventListener("click", func);
}

export function addChange(parent: string | HTMLElement, func: ()=>void){
    checkString(parent).addEventListener("change", func);
}

export function remove(htmlId: string){
    (document.getElementById(htmlId) as HTMLElement).remove();
}

export function addEnter(element: string | HTMLElement, func){
    checkString(element).addEventListener("keyup", function(event) {
        if (event.keyCode === 13) {
            func();
        }
        });
}

export function renderLi(parent: HTMLUListElement | HTMLOListElement | string, innerHTML: string){
    let li = document.createElement("li");
    li.innerHTML = innerHTML;
    checkString(parent).appendChild(li);
}

export function setText(element: string | HTMLElement, innerText: string){
    checkString(element).innerText = innerText;
}

export function addNonLetterKey(element: string | HTMLElement, func){
    checkString(element).addEventListener("keyup", function(event) {
        if (event.keyCode === 13 ||  event.keyCode === 32 || event.keyCode === 17){
            func();
        }
        });
}

export function addDrag(element: string | HTMLElement, data){
    checkString(element).addEventListener("dragstart", (event)=>{
        event.dataTransfer.setData("Text", JSON.stringify(data));
    });
}

export function addDrop(element: string | HTMLElement, func){
    let e = checkString(element);
    e.addEventListener("drop", (event)=>{
        event.preventDefault();
        var data = event.dataTransfer.getData("text");
        func(JSON.parse(data));
    });
    e.addEventListener("dragover", (event)=>{
        event.preventDefault();
    });
}

export function parseDateHun(date: Date): string{
    return date.getFullYear() + ". " + monthNames[date.getMonth()] + ". " + date.getDate()  + ", " + date.getHours() + ":" + date.getMinutes();
}

export function parseDateYYYYMMDD(date: Date):string{
    return `${date.getFullYear()}. ${monthNames[date.getMonth()]}. ${date.getDate()}`;
}

function checkString(s: string | HTMLElement){
    if(typeof s === "string"){
        return document.getElementById(s);
    }
    return s;
}

export let monthNames = ["jan", "febr", "márc", "ápr", "máj", "jún", "júl", "aug", "szept", "okt", "nov", "dec"];