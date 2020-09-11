<?php
require "../MSQDB.php";
require "../objects/accessmanager.php";
require "../objects/tokenpermission.php";
$data = json_decode(file_get_contents("php://input"));
if(empty($data)){
    http_response_code(400);
    echo json_encode(["msg"=> "Hiányos adatok."]);
    exit();
}
if(!AccessManager::isTokenAccessible($data)){
    http_response_code(403);
    echo json_encode(["msg"=> "Hozzáférés megtagadva."]);
    exit();
}
$database = new MSQDB;
$newId = TokenPermission::insert($database, $data);
if(is_null($newId)){
    http_response_code(400);
    echo json_encode(["msg"=> "SQL hiba."]);
    exit();
} else {
    http_response_code(201);
    echo json_encode(["msg"=> $newId]);
    exit();
}
