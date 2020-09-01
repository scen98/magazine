<?php
  require "../MSQDB.php";
  require "../objects/article.php";
session_start();
if(!isset($_SESSION["id"])){
    http_response_code(403);
    echo json_encode(["msg"=> "No running session."]);
    exit();
}

$data = json_decode(file_get_contents("php://input"));
if(empty($data)){
  http_response_code(400);
    echo json_encode(["msg"=> "Data incomplete."]);
    exit();
}
$database = new MSQDB;
$articles = Article::getByAuthorId($database, $_SESSION["id"], $data->keyword, $data->orderby, $data->limit, $data->offset, $data->desc);
if(is_null($articles[0]->id)){
    http_response_code(400);
    echo json_encode(["msg"=> "SQL hiba."]);
    exit();
}
http_response_code(200);
echo json_encode(["articles" => $articles]);