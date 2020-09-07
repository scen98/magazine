<?php
  require "../MSQDB.php";
  require "../objects/author.php";
session_start();
if(!isset($_SESSION["id"])){
    http_response_code(403);
    echo json_encode(["msg"=> "No running session."]);
    exit();
}

$database = new MSQDB;
$authors = Author::selectAuthors($database);
if(is_null($authors)){
    http_response_code(400);
    echo json_encode(["msg"=> "success"]);
    exit();
}
http_response_code(200);
echo json_encode(["authors" => $authors]);