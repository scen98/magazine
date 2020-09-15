<?php
require "../MSQDB.php";
require "../objects/accessmanager.php";
require "../objects/tokenpermission.php";
require "requestutils.php";
$data = json_decode(file_get_contents("php://input"));
RequestUtils::checkData($data);
if(!AccessManager::isTokenAccessible($data)){
    RequestUtils::permissionDenied();
}
$database = new MSQDB;
if(TokenPermission::delete($database, $data->id)){
    RequestUtils::sendSuccess();
} else {
    RequestUtils::sqlError();
}
