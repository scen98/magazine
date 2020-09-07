<?php
require "../objects/accessmanager.php";
require "../objects/token.php";
require "../MSQDB.php";

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
$result = Token::delete($database, $data->id);
if($result === true){
    http_response_code(200);
    echo json_encode(["msg"=> "success"]);
    exit();
} else {
    http_response_code(400);
    echo json_encode(["msg"=> "SQL hiba."]);
    exit();
}