<?php
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

if(TokenInstance::delete($database, $data->id)){
    RequestUtils::sendSuccess();
} else {
    RequestUtils::sqlError();
}

function cmaCheck($token){
    foreach($_SESSION["tokenPermissions"] as $tokenPermission){
        if($token->id === $tokenPermission->tokenId){
            return true;
        }
    }
    return false;
}