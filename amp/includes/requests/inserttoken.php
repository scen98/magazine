<?php
require "../objects/permission.php";
require "../objects/token.php";
require "../MSQDB.php";
require "requestutils.php";
session_start();
if($_SESSION["permissions"][0]->level <= 10){
    RequestUtils::permissionDenied();
}
$data = json_decode(file_get_contents("php://input"));
RequestUtils::checkData($data);

if($_SESSION["permissions"][0]->level >= 20 && $_SESSION["permissions"][0]->level < 40){
    if(!isTokenAccessible($data)){
        RequestUtils::checkData($data);
    }
}

if($data->columnId === 0){
    $data->columnId = null;
}
$database = new MSQDB;
$newId = Token::insert($database, $data);
if(is_null($newId)){
    RequestUtils::sqlError();
} else {
     RequestUtils::returnData("newId", $newId);
}



function isTokenAccessible($token){
    foreach($_SESSION["permissions"] as $perm){
        if($perm->columnId === $token->columnId){
            return true;
        }
    }
    return false;
}
