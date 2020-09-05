<?php
require "../objects/permission.php";
require "../objects/token.php";
require "../MSQDB.php";
session_start();

if($_SESSION["permissions"][0] <= 10){
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
if($_SESSION["permissions"][0] >= 20 && $_SESSION["permissions"][0] < 40){
    if(!isTokenAccessible($data)){
        http_response_code(403);
        echo json_encode(["msg"=> "Hozzáférés megtagadva."]);
        exit();
    }
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

function isTokenAccessible($token){
    foreach($_SESSION["permissions"] as $perm){
        if($perm->columnId === $token->columnId){
            return true;
        }
    }
    return false;
}
