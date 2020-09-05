<?php
require "../objects/permission.php";
require "../objects/token.php";
require "../MSQDB.php";
session_start();

if($_SESSION["permissions"][0]->level < 30){
    http_response_code(402);
    echo json_encode(["msg"=> "Hozzáférés megtagadva."]);
    exit();
}
$data = json_decode(file_get_contents("php://input"));
if(empty($data)){
    http_response_code(400);
    echo json_encode(["msg"=> "Hiányos adatok."]);
    exit();
}
if($_SESSION["permissions"][0]->level < 40){
    if(!isTokenAccessible($data)){
        http_response_code(403);
        echo json_encode(["msg"=> "Hozzáférés megtagadva."]);
        exit();
    }
}

if($data->columnId === 0){
    $data->columnId = null;
}
$database = new MSQDB;
if(Token::update($database, $data)){
    http_response_code(200);
    echo json_encode(["msg"=> "success"]);
    exit();
} else {
    http_response_code(400);
    echo json_encode(["msg"=> "SQL hiba."]);
    exit();
}

function isTokenAccessible($token){
    foreach($_SESSION["permissions"] as $perm){
        if($perm->columnId === $token->columnId){
            return true;
        }
    }
    return true;
}
