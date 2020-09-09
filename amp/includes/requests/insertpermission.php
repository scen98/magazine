<?php
require "../objects/permission.php";
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
$newId = Permission::insertPermission($database, $data);
if(!is_null($newId)){
    http_response_code(201);
    echo json_encode(["newId"=> $newId]);
    exit();
}