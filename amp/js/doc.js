export function renderOption(select, value, innerText){
    let opt = document.createElement("option");
    opt.value = value;
    opt.innerText = innerText;
    select.appendChild(opt);
}

export function createDiv(id, classList, innerHTML){
    return create("div", id, classList, innerHTML);
}

export function createP(id, classList, innerHTML){
    return create("p", id, classList, innerHTML);
}

export function createButton(id, classList, innerHTML){
    return create("button", id, classList, innerHTML);
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

export function onEnter(element, func){
    element.addEventListener("keyup", function(event) {
        if (event.keyCode === 13) {
            func();
        }
        });
}