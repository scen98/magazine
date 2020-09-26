let text = document.getElementById("txtField");
function execCmd(command) {
    text.contentWindow.document.execCommand(command, false, null);
}
function execCommandWithArg(command, arg) {
    text.contentWindow.document.execCommand(command, false, arg);
}

function insertVideo(url){ //ez majd a konzolba egy tonna errort fog dobálni, de semmi baj
    let html = `<div><iframe src="${url.replace("watch?v=", "embed/")}" width="560" height="315" frameborder="0"></iframe></div>`; //nem igazán találtam jobb megoldás az iframeceptionnél
    text.contentWindow.document.execCommand("insertHTML", false, html); 
 /*   https://www.youtube.com/embed/9YffrCViTVk
    https://www.youtube.com/watch?v=9YffrCViTVk*/
}

//# sourceMappingURL=textEditController.js.map