<?php
require "../objects/permission.php";
require "../objects/tokenpermission.php";
require "../MSQDB.php";
require "requestutils.php";
session_start();

if($_SESSION["permissions"][0]->level < 50){
    RequestUtils::permissionDenied();
}
$data = json_decode(file_get_contents("php://input"));
RequestUtils::checkData($data);
$database = new MSQDB;
Permission::deleteByAID($database, $data->authorId);
if($data->level <= 10 || $data->level >= 40){
    $id = Permission::insertGlobalPermission($database, new Permission(NULL, $data->level, $data->authorId, NULL));
    TokenPermission::deleteByAID($database, $data->authorId);
    RequestUtils::returnInsert($id);
}
http_response_code(200);
echo json_encode(["newId"=> 0]);
exit();