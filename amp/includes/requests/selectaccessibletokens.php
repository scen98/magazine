<?php
require "../objects/permission.php";
require "../objects/token.php";
require ".../MSQDB.php";
if(!isset($_SESSION["permissions"])){
    http_response_code(403);
    echo json_encode(["msg"=> "No running session."]);
    exit();
}

if($_SESSION["permissions"][0] === "normal"){
    http_response_code(403);
    echo json_encode(["msg"=> "Hozzáférés megtagadva.."]);
    exit();
}

$database = new MSQDB;
$tokens;
if($_SESSION["permissions"][0] === "admin" || $_SESSIONS["permissions"][0] === "superadmin"){
    $tokens = Token::selectTokens($database);
}

if($_SESSION["permissions"][0] === "cml"){
    mergeTokens();
}

http_response_code(200);
echo json_encode(["tokens"=> $tokens]);
exit();


function mergeTokens(){
    foreach($_SESSION["permissions"] as $perm){
        array_merge($tokens, Token::selectTokensByColumn($mysqlidb, $perm->columnId));
    }
}