<?php
require "../objects/token.php";
require "../MSQDB.php";
require "../objects/accessmanager.php";
$data = json_decode(file_get_contents("php://input"));
if(empty($data)){
    http_response_code(400);
    echo json_encode(["msg"=> "Hiányos adatok."]);
    exit();
}
if($data->columnId === 0){
    $data->columnId = null;
}
$database = new MSQDB;
if(AccessManager::isTokenAccessible($data)){
    if(Token::update($database, $data)){
        http_response_code(200);
        echo json_encode(["msg"=> "success"]);
        exit();
    } else {
        http_response_code(400);
        echo json_encode(["msg"=> "SQL hiba."]);
        exit();
    }
} else {
    http_response_code(403);
    echo json_encode(["msg"=> "Hozzáférés megtagadva."]);
    exit();
}