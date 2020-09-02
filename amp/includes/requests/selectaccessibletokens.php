<?php
require "../objects/permission.php";
require "../objects/token.php";
require "../MSQDB.php";
session_start();
if(!isset($_SESSION["permissions"][0])){
    http_response_code(403);
    echo json_encode(["msg"=> "No running session."]);
    exit();
}

if($_SESSION["permissions"][0] === "normal"){
    http_response_code(403);
    echo json_encode(["msg"=> "Hozzáférés megtagadva."]);
    exit();
}

$database = new MSQDB;
if($_SESSION["permissions"][0] === "superadmin"){
    $token_array = Token::selectTokens($database);
    http_response_code(200);
    echo json_encode(["tokens"=> $token_array]);
    exit();
}

if($_SESSION["permissions"][0] == "cml"){
    mergeTokens();
}

function mergeTokens(){
    foreach($_SESSION["permissions"] as $perm){
        $token_array = array_merge($token_array, Token::selectTokensByColumn($mysqlidb, $perm->columnId));
    }
}