<?php
require "../objects/author.php";
require "../MSQDB.php";
session_start();
if(!isset($_SESSION["id"])){
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
$author = Author::selectAuthorByUserName($database, $data->name);
$author->password = "";
http_response_code(200);
echo json_encode(["author"=> $author]);
exit();