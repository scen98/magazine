<?php
require "../objects/permission.php";
require "../objects/tokenpermission.php";
require "../MSQDB.php";
session_start();

if($_SESSION["permissions"][0]->level < 50){
    http_response_code(403);
    echo json_encode(["msg"=> "Hozzáférés megtagadva."]);
    exit();
}
$data = json_decode(file_get_contents("php://input"));
if(empty($data)){
    http_response_code(400);
    echo json_encode(["msg"=> "Hiányos adatok."]);
    exit();
}
$database = new MSQDB;
Permission::deleteByAID($database, $data->authorId);
if($data->level <= 10 || $data->level >= 40){
    $id = Permission::insertGlobalPermission($database, new Permission(NULL, $data->level, $data->authorId, NULL));
    TokenPermission::deleteByAID($database, $data->authorId);
    http_response_code(201);
    echo json_encode(["newId"=> $id]);
    exit();
}
http_response_code(200);
echo json_encode(["newId"=> 0]);
exit();