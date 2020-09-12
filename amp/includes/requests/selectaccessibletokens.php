<?php
require "../objects/accessmanager.php";
require "../objects/token.php";
require "../MSQDB.php";
if(!isset($_SESSION["permissions"][0])){
    http_response_code(403);
    echo json_encode(["msg"=> "No running session."]);
    exit();
}

if($_SESSION["permissions"][0]->level <= 20){
    http_response_code(403);
    echo json_encode(["msg"=> "Hozzáférés megtagadva."]);
    exit();
}

$database = new MSQDB;
$token_array = $token_array = Token::selectTokens($database);

if($_SESSION["permissions"][0]->level >= 30 && $_SESSION["permissions"][0]->level < 40){
    $token_array = filterByColumn($token_array);
}
http_response_code(200);
echo json_encode(["tokens"=> $token_array]);
exit();

function filterByColumn($token_array){
    $newTokens = array();
    foreach($token_array as $token){
        if(AccessManager::isTokenAccessible($token)){
           array_push($newTokens, $token);
        }
    }
    return $newTokens;
}

function isAccessible($token){
    foreach($_SESSION["permissions"] as $perm){
        if($perm->columnId === $token->columnId){
            return true;
        }
    }
    return false;
}