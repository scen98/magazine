<?php
require "../objects/accessmanager.php";
require "../objects/token.php";
require "../MSQDB.php";
require "requestutils.php";
if(!isset($_SESSION["permissions"][0])){
    RequestUtils::permissionDenied();
}

if($_SESSION["permissions"][0]->level < 20){
    RequestUtils::permissionDenied();
}

$database = new MSQDB;
$token_array = $token_array = Token::selectTokens($database);

if($_SESSION["permissions"][0]->level >= 20 && $_SESSION["permissions"][0]->level < 40){
    $token_array = filterByColumn($token_array);
}
RequestUtils::returnData("tokens", $token_array);

function filterByColumn($token_array){
    $newTokens = array();
    foreach($token_array as $token){
        if(AccessManager::isTokenReadable($token)){
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