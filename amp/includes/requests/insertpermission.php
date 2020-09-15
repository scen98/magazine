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
$newId = Permission::insertPermission($database, $data);
RequestUtils::returnInsert($newId);