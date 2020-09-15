export function bindById(elementId, value){
    let element = document.getElementById(elementId)
    element.addEventListener("change", () => {
        value = document.value;
    })
}

export function bind(element, value){
    element.addEventListener("change", ()=>{
        value = element.value;
    })
}

export function renderOption(select, value, innerText){
    let opt = document.createElement("option");
    opt.value = value;
    opt.innerText = innerText;
    select.appendChild(opt);
}

export function createDiv(id, classList){
    let element = document.createElement("div");
    if(id != null){
        element.id = id;
    }
    for (let c of classList) {
        element.classList.add(c);
    }
    return element;
}

export function createP(classList, innerText){
    let element = document.createElement("p");
    for (let c of classList) {
        element.classList.add(c);
    }
    element.innerText = innerText;
    return element;
}

export function createButton(classList, innerHTML, func){
    let element = document.createElement("button");
    for (let c of classList) {
        element.classList.add(c);
    }
    element.innerHTML = innerHTML;
    element.addEventListener("click", func);
    return element;
}

export function createSelect(id, classList){
    let element = document.createElement("select");
    if(id != null){
        element.id = id;
    }
    for (let c of classList) {
        element.classList.add(c);
    }
    
    return element;
}
export function create(type, id, classList, innerHTML){
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

export function append(parent, childList){
    for (let e of childList) {
        parent.appendChild(e);
    }
}

export function addClick(parent, func){
    parent.addEventListener("click", func);
}

export function addEnter(element, func){
    element.addEventListener("keyup", function(event) {
        if (event.keyCode === 13) {
            func();
        }
        });
}

export function addNonLetterKey(element, func){
    element.addEventListener("keyup", function(event) {
        if (event.keyCode === 13 ||  event.keyCode === 32 || event.keyCode === 17){
            func();
        }
        });
}