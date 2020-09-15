<?php
require "../objects/permission.php";
require "../MSQDB.php";
require "requestutils.php";
session_start();
if($_SESSION["permissions"][0]->level < 50){
    RequestUtils::permissionDenied();
}
$data = json_decode(file_get_contents("php://input"));
RequestUtils::checkData($data);

$database = new MSQDB;
if(Permission::deleteById($database, $data->id)){
    RequestUtils::sendSuccess();
} else {
    RequestUtils::sqlError();
}