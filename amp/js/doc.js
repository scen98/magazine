export function renderOption(select, value, innerText) {
    let opt = document.createElement("option");
    opt.value = value;
    opt.innerText = innerText;
    select.appendChild(opt);
}
export function createTable(classList) {
    let element = document.createElement("table");
    for (let c of classList) {
        element.classList.add(c);
    }
    return element;
}
export function createDiv(id, classList) {
    let element = document.createElement("div");
    if (id != null) {
        element.id = id;
    }
    for (let c of classList) {
        element.classList.add(c);
    }
    return element;
}
export function renderTableRow(parent, rowArray) {
    let row = document.createElement("tr");
    ;
    for (let td of rowArray) {
        let cell = document.createElement("td");
        cell.innerHTML = td;
        row.appendChild(cell);
    }
    parent.appendChild(row);
}
export function createP(classList, innerText) {
    let element = document.createElement("p");
    for (let c of classList) {
        element.classList.add(c);
    }
    element.innerText = innerText;
    return element;
}
export function createA(classList, innerText, href) {
    let element = document.createElement("a");
    for (let c of classList) {
        element.classList.add(c);
    }
    element.innerText = innerText;
    element.href = href;
    return element;
}
export function createButton(classList, innerHTML, func) {
    let element = document.createElement("button");
    for (let c of classList) {
        element.classList.add(c);
    }
    element.innerHTML = innerHTML;
    element.addEventListener("click", func);
    return element;
}
export function createSelect(id, classList) {
    let element = document.createElement("select");
    if (id != null) {
        element.id = id;
    }
    for (let c of classList) {
        element.classList.add(c);
    }
    return element;
}
export function create(type, id, classList, innerHTML) {
    let element = document.createElement(type);
    if (id != null) {
        element.id = id;
    }
    for (let c of classList) {
        element.classList.add(c);
    }
    element.innerHTML = innerHTML;
    return element;
}
export function append(parent, childList) {
    let p = checkString(parent);
    for (let e of childList) {
        p.appendChild(e);
    }
}
export function getValue(htmlId) {
    return checkString(htmlId).value;
}
export function getUl(htmlId) {
    return document.getElementById(htmlId);
}
export function getImg(htmlId) {
    return document.getElementById(htmlId);
}
export function get(htmlId) {
    return document.getElementById(htmlId);
}
export function getDiv(htmlId) {
    return document.getElementById(htmlId);
}
export function getBtn(htmlId) {
    return document.getElementById(htmlId);
}
export function getSelect(htmlId) {
    return document.getElementById(htmlId);
}
export function getTable(htmlId) {
    return document.getElementById(htmlId);
}
export function getInput(htmlId) {
    return document.getElementById(htmlId);
}
export function addClick(parent, func) {
    checkString(parent).addEventListener("click", func);
}
export function addChange(parent, func) {
    checkString(parent).addEventListener("change", func);
}
export function remove(htmlId) {
    document.getElementById(htmlId).remove();
}
export function addEnter(element, func) {
    checkString(element).addEventListener("keyup", function (event) {
        if (event.keyCode === 13) {
            func();
        }
    });
}
export function renderLi(parent, innerHTML) {
    let li = document.createElement("li");
    li.innerHTML = innerHTML;
    checkString(parent).appendChild(li);
}
export function setText(element, innerText) {
    checkString(element).innerText = innerText;
}
export function addNonLetterKey(element, func) {
    checkString(element).addEventListener("keyup", function (event) {
        if (event.keyCode === 13 || event.keyCode === 32 || event.keyCode === 17) {
            func();
        }
    });
}
export function addDrag(element, data) {
    checkString(element).addEventListener("dragstart", (event) => {
        event.dataTransfer.setData("Text", JSON.stringify(data));
    });
}
export function addDrop(element, func) {
    let e = checkString(element);
    e.addEventListener("drop", (event) => {
        event.preventDefault();
        var data = event.dataTransfer.getData("text");
        func(JSON.parse(data));
    });
    e.addEventListener("dragover", (event) => {
        event.preventDefault();
    });
}
export function parseDateHun(date) {
    return date.getFullYear() + ". " + monthNames[date.getMonth()] + ". " + date.getDate() + ", " + date.getHours() + ":" + date.getMinutes();
}
function checkString(s) {
    if (typeof s === "string") {
        return document.getElementById(s);
    }
    return s;
}
export let monthNames = ["jan", "febr", "márc", "ápr", "máj", "jún", "júl", "aug", "szept", "okt", "nov", "dec"];
//# sourceMappingURL=doc.js.map