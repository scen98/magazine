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

if($_SESSION["permissions"][0]->level === "normal"){
    http_response_code(403);
    echo json_encode(["msg"=> "Hozzáférés megtagadva."]);
    exit();
}

$database = new MSQDB;
$token_array = $token_array = Token::selectTokens($database);

if($_SESSION["permissions"][0]->level === "cml"){
    $token_array = array_filter($token_array, "isAccessible");
}
http_response_code(200);
echo json_encode(["tokens"=> $token_array]);
exit();

function isAccessible($token){
    foreach($_SESSION["permissions"] as $perm){
        if($perm->columnId == $token->columnId){
            return true;
        }
    }
    return false;
}