<?php
//require "../objects/tokenpermission.php";
require "../MSQDB.php";
require "../objects/accessmanager.php";
require "requestutils.php";
require "../objects/tokeninstance.php";
require "../objects/token.php";
if($_SESSION["permissions"][0]->level <= 10){
    RequestUtils::permissionDenied();
}
$data = json_decode(file_get_contents("php://input"));
RequestUtils::checkData($data);
$database = new MSQDB;
$token = Token::selectById($database, $data->tokenId);
if(AccessManager::getMaxLevel() === 20){
    if(!cmaCheck($token)){
        RequestUtils::permissionDenied();
    }
}

if(AccessManager::getMaxLevel() === 30){
    if(!AccessManager::cmlTokenCheck($token)){
        RequestUtils::permissionDenied();
    }
}
$data->authorId = $_SESSION["id"];
$newId = TokenInstance::insert($database, $data);
if(is_null($newId)){
    RequestUtils::sqlError();
} else {
    RequestUtils::returnData("newId", $newId);
}

function cmaCheck($token){
    foreach($_SESSION["tokenPermissions"] as $tk){
        if($token->id === $tk->tokenId){
            return true;
        }
    }
    return false;
}