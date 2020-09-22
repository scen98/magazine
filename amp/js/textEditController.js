let text = document.getElementById("txtField");
function execCmd(command){
    text.contentWindow.document.execCommand(command, false, null);
}
function execCommandWithArg(command, arg){
    text.contentWindow.document.execCommand(command, false, arg);
}